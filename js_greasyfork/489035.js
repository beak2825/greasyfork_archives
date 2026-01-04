// ==UserScript==
// @name         [KPX] Blackjack helper
// @namespace    https://cartelempire.online/
// @version      0.4
// @description  Blackjack helper
// @author       KPCX
// @match        https://cartelempire.online/*asino/*lackjack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489035/%5BKPX%5D%20Blackjack%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/489035/%5BKPX%5D%20Blackjack%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define constants
    const HIT = "Hit";
    const STAND = "Stand";
    const DOUBLE = "Double";
    const SURRENDER = "Surrender";
    const SPLIT = "Split";

    // New blackjack strategy
    const strategy = {
        "5":   ["H", "H", "H", "H", "H", "H", "H", "H", "H", "R"],
        "6":   ["H", "H", "H", "H", "H", "H", "H", "H", "H", "R"],
        "7":   ["H", "H", "H", "H", "H", "H", "H", "H", "H", "R"],
        "8":     ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
        "9":     ["H", "D", "D", "D", "D", "H", "H", "H", "H", "H"],
        "10":    ["D", "D", "D", "D", "D", "D", "D", "D", "H", "H"],
        "11":    ["D", "D", "D", "D", "D", "D", "D", "D", "H", "H"],
        "12":    ["H", "H", "S", "S", "S", "H", "H", "H", "H", "R"],
        "13":    ["S", "S", "S", "S", "S", "H", "H", "H", "H", "R"],
        "14":    ["S", "S", "S", "S", "S", "H", "H", "H", "R", "R"],
        "15":    ["S", "S", "S", "S", "S", "H", "H", "H", "R", "R"],
        "16":    ["S", "S", "S", "S", "S", "H", "H", "R", "Rs", "R"],
        "17":    ["S", "S", "S", "S", "S", "S", "S", "S", "S", "Rs"],
        "18":   ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        "19":   ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        "20":   ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        "21":   ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        "A,2":   ["H", "H", "H", "D", "D", "H", "H", "H", "H", "H"],
        "A,3":   ["H", "H", "H", "D", "D", "H", "H", "H", "H", "H"],
        "A,4":   ["H", "H", "D", "D", "D", "H", "H", "H", "H", "H"],
        "A,5":   ["H", "H", "D", "D", "D", "H", "H", "H", "H", "H"],
        "A,6":   ["H", "D", "D", "D", "D", "H", "H", "H", "H", "H"],
        "A,7":   ["S", "Ds", "Ds", "Ds", "Ds", "S", "S", "H", "H", "H"],
        "A,8":   ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        "A,9":   ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        "2,2":   ["H", "H", "P", "P", "P", "P", "H", "H", "H", "H"],
        "3,3":   ["H", "H", "P", "P", "P", "P", "H", "H", "H", "R"],
        "4,4":   ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
        "5,5":   ["D", "D", "D", "D", "D", "D", "D", "D", "H", "H"],
        "6,6":   ["H", "P", "P", "P", "P", "H", "H", "H", "H", "R"],
        "7,7":   ["P", "P", "P", "P", "P", "P", "H", "H", "R", "R"],
        "8,8":   ["P", "P", "P", "P", "P", "P", "P", "P", "Rs", "R"],
        "9,9":   ["P", "P", "P", "P", "P", "S", "P", "P", "S", "S"],
        "10,10": ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
        "A,A":   ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"]
    };

    // Function to get the optimal move
    function getOptimalMove(playerHand, dealerCard, playerScore) {
        if (!strategy.hasOwnProperty(playerHand)) {
            console.error(`Unknown player hand: ${playerHand}`);
            return null;
        }

        const move = strategy[playerHand][dealerCard-2];
        switch(move) {
            case "H":
                return HIT;
            case "S":
                return STAND;
            case "D":
                return DOUBLE;
            case "P":
                return SPLIT;
            case "R":
            case "Rs":
                // Check for surrender after checking the strategy table
                if ((playerHand === 16 && (dealerCard === 9 || dealerCard === 10 || dealerCard === 11)) ||
                    (playerHand === 15 && dealerCard === 10)) {
                    return SURRENDER;
                } else {
                    // If surrender is not possible, choose the next best move
                    if (playerScore <= 17) {
                        // If the player's score is 17 or less, the next best move is to hit
                        return HIT;
                    } else {
                        // If the player's score is 18 or more, the next best move is to stand
                        return STAND;
                    }
                }
            default:
                console.error(`Unknown move: ${move}`);
                return null;
        }
    }

    // Select elements once
    const dealerScoreElement = document.getElementById('dealerScore');
    const playerScoreElement = document.getElementById('playerScore');
    const continueButton = document.getElementById('continue');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const doubleButton = document.getElementById('double');
    const resultElement = document.getElementById('result');
    const surrenderButton = document.getElementById('surrender');
    const splitButton = document.getElementById('split');

    let lastOptimalMove = null;

    // Check the page every second
    setInterval(function() {
        if (dealerScoreElement && playerScoreElement) {
            const dealerScore = parseInt(dealerScoreElement.innerText);

            // Get all card elements
            let cardElements = document.querySelectorAll('#playerCards .blackjackCardText');
            // Extract the card values
            let cardValues = Array.from(cardElements).map(el => el.textContent);
            // Check if the hand contains an Ace
            let hasAce = cardValues.includes('A');

            // Calculate player score considering Ace as 1 if it exists
            let playerScore = cardValues.reduce((a, b) => a + (b === 'A' ? 1 : (['J', 'Q', 'K'].includes(b) ? 10 : parseInt(b))), 0);

            // If treating Ace as 11 doesn't cause the player's score to exceed 21, do so
            if (hasAce && playerScore + 10 <= 21) {
                playerScore += 10;
            }

            // Construct the playerHand string
            let playerHand;
            if (cardValues.length === 2 && cardValues[0] === cardValues[1]) {
                // If the player has a pair, use the pair entry in the strategy table
                playerHand = `${cardValues[0]},${cardValues[1]}`;
            } else if (hasAce && playerScore >= 12) {
                // If the player has an Ace and the total is 12 or more, treat it as a hard total
                playerHand = playerScore.toString();
            } else {
                playerHand = hasAce ? `A,${playerScore - 1}` : playerScore.toString();
            }
            console.log(`Card values: ${cardValues}`);
            console.log(`Player score: ${playerScore}`);

            console.log(`Player hand: ${playerHand}`);
            console.log(`Dealer score: ${dealerScore}`);

            const optimalMove = getOptimalMove(playerHand, dealerScore, playerScore);
            console.log(`Optimal move: ${optimalMove}`);

            // Only change button colors if the optimal move changes
            if (optimalMove !== lastOptimalMove) {
                // Reset all button colors
                if (hitButton) hitButton.style.backgroundColor = '';
                if (standButton) standButton.style.backgroundColor = '';
                if (doubleButton) doubleButton.style.backgroundColor = '';

                // Color the optimal button green and the others red
                switch (optimalMove) {
                    case HIT:
                        if (hitButton && !hitButton.disabled) hitButton.style.backgroundColor = 'green';
                        if (standButton && !standButton.disabled) standButton.style.backgroundColor = 'red';
                        if (doubleButton && !doubleButton.disabled) doubleButton.style.backgroundColor = 'red';
                        break;
                    case STAND:
                        if (hitButton && !hitButton.disabled) hitButton.style.backgroundColor = 'red';
                        if (standButton && !standButton.disabled) standButton.style.backgroundColor = 'green';
                        if (doubleButton && !doubleButton.disabled) doubleButton.style.backgroundColor = 'red';
                        break;
                    case DOUBLE:
                        if (hitButton && !hitButton.disabled) hitButton.style.backgroundColor = 'red';
                        if (standButton && !standButton.disabled) standButton.style.backgroundColor = 'red';
                        if (doubleButton && !doubleButton.disabled) doubleButton.style.backgroundColor = 'green';
                        break;
                    case SPLIT:
                        if (splitButton && !splitButton.disabled) splitButton.style.backgroundColor = 'green';
                        if (hitButton && !hitButton.disabled) hitButton.style.backgroundColor = 'red';
                        if (standButton && !standButton.disabled) standButton.style.backgroundColor = 'red';
                        if (doubleButton && !doubleButton.disabled) doubleButton.style.backgroundColor = 'red';
                        break;
                    case SURRENDER:
                        if (surrenderButton && !surrenderButton.disabled) surrenderButton.style.backgroundColor = 'green';
                        if (hitButton && !hitButton.disabled) hitButton.style.backgroundColor = 'red';
                        if (standButton && !standButton.disabled) standButton.style.backgroundColor = 'red';
                        if (doubleButton && !doubleButton.disabled) doubleButton.style.backgroundColor = 'red';
                        break;
                }

                // If the optimal move is disabled, find the next best move
                if ((optimalMove === HIT && hitButton.disabled) ||
                    (optimalMove === STAND && standButton.disabled) ||
                    (optimalMove === DOUBLE && doubleButton.disabled)) {
                    if (!hitButton.disabled) hitButton.style.backgroundColor = 'green';
                    else if (!standButton.disabled) standButton.style.backgroundColor = 'green';
                    else if (!doubleButton.disabled) doubleButton.style.backgroundColor = 'green';
                }

                lastOptimalMove = optimalMove;
            }
        }

    }, 500);
})();