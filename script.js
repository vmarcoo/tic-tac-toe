const preventDefault = (() => {
    const board = document.querySelector("#gameboard")
    board.addEventListener("mouseup", preventDefaultHandler)
    board.addEventListener("mousedown", preventDefaultHandler)
    board.addEventListener("mousemove", preventDefaultHandler)

    function preventDefaultHandler(event) {
        event.preventDefault();
    }
})();

const Game = (() => {
    
    let players = []
    let currentPlayer
    let isGameRunning
    let isGameOver
    let modal = document.querySelector(".modal")
    let winTextDiv = document.querySelector("#h1modal")

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
          modal.style.display = "none"
        }
    });

    const start = () => {
        if (isGameRunning) return
        if (isGameOver) return

        players = [
            createPlayer(document.querySelector("#player1Input"), "X"),
            createPlayer(document.querySelector("#player2Input"), "O")
        ]

        currentPlayer = 0;
        isGameRunning = true;
        isGameOver = false;
    }

    const updateCurrentPlayer = () => {
        if (checkIfPlayerWon(Gameboard.getGameboard(), players[currentPlayer].sign)){
            isGameRunning = false
            Game.printWinner(players[currentPlayer].playerName)
            return
        }

        if (currentPlayer == 0){currentPlayer = 1}
        else if (currentPlayer == 1){currentPlayer = 0}
    }

    const handleClick = (event) => {
        if (isGameOver) return
        if (!isGameRunning) return
        let index = parseInt(event.target.id.slice(-1))
        Gameboard.write(index, players[currentPlayer].sign)
    }

    const printWinner = (name) => {
        modal.style.display = "flex"
        winTextDiv.textContent = `${name} won!`
        isGameOver = true
    }

    const clearData = () => {
        players = ""
        isGameRunning = false
        isGameOver = false
        document.querySelector("#player1Input").value = ""
        document.querySelector("#player1Input").disabled = false
        document.querySelector("#player2Input").value = ""
        document.querySelector("#player2Input").disabled = false
    }

    return {start, updateCurrentPlayer, handleClick, printWinner, clearData}
})();

const Gameboard = (() => {

    const gameboxes = document.querySelectorAll(".gamebox")
    gameboxes.forEach((box) => box.addEventListener("click", Game.handleClick))

    const getGameboard = () => {
        let gameboard = []
        gameboxes.forEach((box) => gameboard.push(box.textContent))
        return gameboard
    }

    const clearBoard = () => {
        gameboxes.forEach((box) => box.textContent = "")
    }

    const write = (index, sign) => {
        if (gameboxes[index].textContent != "") return
        gameboxes[index].textContent = sign;
        Game.updateCurrentPlayer();
    }

    return {getGameboard, clearBoard, write}
})();

function createPlayer(name, sign){
    if (name.value == ""){name.value = "Anonymous"}
    name.disabled = true
    playerName = name.value
    return {playerName, sign}
}

function checkIfPlayerWon(board, sign){
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for (let i = 0; i < winningCombinations.length; i++){
        let [a, b, c] = winningCombinations[i]
        if (board[a] == sign && board[b] == sign && board[c] == sign){
            return true
        }
    }
    return false
}

const startBtn = document.querySelector("#StartBtn").addEventListener("click", () => Game.start())
const clearBtn = document.querySelector("#clearBtn").addEventListener("click", () => {
    Gameboard.clearBoard();
    Game.clearData();
})