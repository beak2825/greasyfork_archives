// ==UserScript==
// @name         costcodle ruiner
// @namespace    http://tampermonkey.net/
// @version      2024-05-09
// @description  costcodle ruinere
// @author       You
// @match        https://costcodle.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=costcodle.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494458/costcodle%20ruiner.user.js
// @updateURL https://update.greasyfork.org/scripts/494458/costcodle%20ruiner.meta.js
// ==/UserScript==

const buttonHandler = () => {
    const num = Number(document.querySelector("#gamenumberinput").value);
    _fetchGameData(num)
}

const _fetchGameData = (gameNumber) => {
  fetch("./games.json")
    .then((response) => response.json())
    .then((json) => {
      productName = json[`game-${gameNumber}`].name;
      productPrice = json[`game-${gameNumber}`].price;
      productPrice = Number(productPrice.slice(1, productPrice.length));
      productImage = json[`game-${gameNumber}`].image;

      _initializeGame();
    });
}

const _initializeGame = () => {
    document.querySelector("#product-image").remove()
    if (gameState.hasWon === false) {
        userStats.currentStreak = 0;
    }

    const guessContainers = document.querySelectorAll(".guess-container");
    for (let i = 1; i <= 6; i++) {
        const container = document.getElementById(i);
        container.innerHTML = ""
        container.setAttribute("class", "guess-container");
    }

    gameState.gameNumber = gameNumber;
    gameState.guesses = [];
    gameState.hasWon = false;
    userStats.numGames++;

    localStorage.setItem("stats", JSON.stringify(userStats));
    localStorage.setItem("state", JSON.stringify(gameState));

    document.querySelector("#input-container").innerHTML = `<div id="text-input-container">
              <div id="input-label">$</div>
              <div id="input-div">
              </div>
            </div>
            <div id="button-container">
            </div>
            `
    document.querySelector("#input-div").appendChild(input);
    document.querySelector("#button-container").appendChild(buttonInput);
    buttonInput.setAttribute("class", "active");
    buttonInput.removeAttribute("disabled");
    input.removeAttribute("disabled");
    input.placeholder = "Enter a guess...";

    displayProductCard();

    updateGameBoard();

    if (gameState.guesses.length < 6 && !gameState.hasWon) {
        addEventListeners();
    } else {
        convertToShareButton();
    }
}

const addButton = () => {
    const gameNumberInput = document.createElement("input");
    gameNumberInput.setAttribute("id", "gamenumberinput");
    gameNumberInput.placeholder = "enter a number from 1-3000"
    const button = document.createElement("button");
    button.onclick = buttonHandler

    button.innerText = "Type the game number and then click me"
    document.body.appendChild(button);
    document.body.appendChild(gameNumberInput);
}

window.addEventListener('load', addButton, false);