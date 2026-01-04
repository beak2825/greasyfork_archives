// ==UserScript==
// @name         HLTB - Rating Helper
// @namespace    http://tampermonkey.net/
// @version      1.62
// @description  This script adds a "Rate" button on your completed games page (next to the "Reset" button) that will take your previous completed game's ratings and ask you if the game you just beat is better than those games. This should help you derive a score based on your previous ratings.
// @author       Threeskimo
// @match        https://howlongtobeat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=howlongtobeat.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486963/HLTB%20-%20Rating%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486963/HLTB%20-%20Rating%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract text within anchor tags with class "text_purple"
    function extractTextPurple() {
        const purpleTextElements = document.querySelectorAll('a.text_purple');
        const purpleTextArray = Array.from(purpleTextElements).map(element => {
            return {
                title: element.textContent.trim(),
                score: null
            };
        });
        //console.log(purpleTextArray)
        return purpleTextArray;
    }

    // Function to extract text with a specific selector
    function extractTextWithSelector() {
        const textSelectorArray = [];
        for (let i = 1; i <= 100; i++) {
            //const selector = `#user_games > div > div > table > tbody:nth-child(${i}) > tr > td:nth-child(3)`;
            const selector = `#user_games > div > div > div > div:nth-child(${i}) > div > div:nth-child(3)`;
            const element = document.querySelector(selector);
            if (element) {
                textSelectorArray.push(parseInt(element.textContent.trim().replace('/10', ''), 10));
            }
        }
        //console.log(textSelectorArray)
        return textSelectorArray;
    }

    // Main function to combine extracted data into an object
    function combineData() {
        const textPurpleData = extractTextPurple();
        const textSelectorData = extractTextWithSelector();

        const combinedData = [];
        for (let i = 0; i < textPurpleData.length; i++) {
            const game = textPurpleData[i].title;
            const score = textSelectorData[i] || null;
            if (score !== "NR" && score !== null) {
                combinedData.push({ game, score });
            }
        }
        //console.log(combinedData)
        return combinedData;
    }

    // Function to get a random game from the combined list
    function getRandomGame(combinedData) {
        return combinedData[Math.floor(Math.random() * combinedData.length)];
    }

    // Function to handle the modal popup
    function showModal(game) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <p>Is the game better than <font color="#328ed6"><b>${game.game}</b></font>?</p>
                <!--<center>Debug: ${game.score}</center>-->
                <br><center><button id="yesButton" class="lists_add_game_button__KLl_4 form_button back_green">Yes</button>
                <button id="sameButton" class="lists_add_game_button__KLl_4 form_button back_blue">Same</button>
                <button id="noButton" class="lists_add_game_button__KLl_4 form_button back_red">No</button></center>
            </div>
        `;
        document.body.appendChild(modal);

        // Add event listeners to the buttons
        document.getElementById('yesButton').addEventListener('click', function() {
            closeModal();
            const newScore = game.score + 1;
            const newGame = findRandomGameWithScore(newScore);
            if (newGame) {
                showModal(newGame);
            } else {
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML = `
                <div class="modal-content">
                <p>The rating should be:<br> <font color="#fff" size="5"><center><b>${newScore > 10 ? 10 : newScore}</b></font></p>
                <center><button id="close" class="lists_add_game_button__KLl_4 form_button back_blue">Close</button>
                </div>`;
                document.body.appendChild(modal);
                modal.querySelector('#close').addEventListener('click', closeModal);
            }
        });
        document.getElementById('sameButton').addEventListener('click', function() {
            closeModal();
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
            <div class="modal-content">
            <p>The rating should be:<br> <font color="#fff" size="5"><center><b>${game.score}</font></b></p>
            <center><button id="close" class="lists_add_game_button__KLl_4 form_button back_blue">Close</button>
            </div>`;
            document.body.appendChild(modal);
            modal.querySelector('#close').addEventListener('click', closeModal);
        });
        document.getElementById('noButton').addEventListener('click', function() {
            closeModal();
            const newScore = game.score - 1;
            const newGame = findRandomGameWithScore(newScore);
            if (newGame) {
                showModal(newGame);
            } else {
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML = `
                <div class="modal-content">
                <p>The rating should be:<br> <font color="#fff" size="5"><center><b>${newScore}</b></font></p>
                <center><button id="close" class="lists_add_game_button__KLl_4 form_button back_blue">Close</button>
                </div>`;
                document.body.appendChild(modal);
                modal.querySelector('#close').addEventListener('click', closeModal);
            }
        });
    }

    // Function to close the modal popup
    function closeModal() {
        const modal = document.querySelector('.modal');
        modal.parentNode.removeChild(modal);
    }

    // Function to find a game with a specific score
    function findRandomGameWithScore(score) {
        const combinedData = combineData();
        const gamesWithScore = combinedData.filter(game => game.score === score);
        return gamesWithScore.length > 0 ? getRandomGame(gamesWithScore) : null;
    }

    // Function to create and append the button
    function addButton() {
        // Check to make sure we are on the right page
        var urlPattern = /^https:\/\/howlongtobeat\.com\/user\/[^/]+\/games\/completed\//;
        if (urlPattern.test(window.location.href)) {
            // Check to see if the Rate button has been added, if not, add it
            if (!document.getElementById('rater')) {
                const existingRedButton = document.querySelector('.back_red');
                const button = document.createElement('button');
                button.innerHTML = 'Rate';
                button.id = 'rater';
                button.className = 'lists_add_game_button__KLl_4 form_button back_green';
                button.style = "margin-left:5px";
                button.addEventListener('click', function() {
                    const combinedData = combineData();
                    const randomGame = getRandomGame(combinedData);
                    showModal(randomGame);
                });
                existingRedButton.parentNode.insertBefore(button, existingRedButton.nextSibling);
            }
        } else {
            // Remove the Rate button if not on the right page
            var raterElement = document.getElementById("rater");
            if (raterElement) {
                raterElement.parentNode.removeChild(raterElement);
            }
        }
    }

    // Add CSS styles for the modal
    const css = `
        .modal {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            z-index: 9999;
        }

        .modal-content {
            background-color: #333;
            color: #fff;
            padding: 20px;
            border-radius: 5px;
        }

        .modal button {
            margin-right: 10px;
        }
    `;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Run the main function to add the button, also check ever 2 seconds to see if has been added already, add if not
    addButton();
    setInterval(addButton, 1000);

})();