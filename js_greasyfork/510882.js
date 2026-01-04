// ==UserScript==
// @name         Chess.com Game Analysis on Wintrcat
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Adds a button on Chess.com to analyze games on chess.wintrcat.uk and automates game loading
// @match        https://www.chess.com/game/live/*
// @match        https://chess.wintrcat.uk/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510882/Chesscom%20Game%20Analysis%20on%20Wintrcat.user.js
// @updateURL https://update.greasyfork.org/scripts/510882/Chesscom%20Game%20Analysis%20on%20Wintrcat.meta.js
// ==/UserScript==

(function() {
    'use strict';

         function addAnalysisButton() {
        const reviewButtonContainer = document.querySelector('.game-over-review-button-component');
        if (reviewButtonContainer && !document.getElementById('wintrcat-analysis-button')) {
            // Create the new button container
            const wintrcatButtonContainer = document.createElement('div');
            wintrcatButtonContainer.className = 'game-over-review-button-component';
            wintrcatButtonContainer.style.cssText = reviewButtonContainer.style.cssText;

            // Create the button label
            const buttonLabel = document.createElement('span');
            buttonLabel.className = 'game-over-review-button-label';
            buttonLabel.textContent = 'Analyze on Wintrcat';

            // Create the button
            const button = document.createElement('button');
            button.id = 'wintrcat-analysis-button';
            button.className = 'cc-button-component cc-button-secondary cc-button-xx-large cc-button-full game-over-review-button-background';
            button.type = 'button';
            button.setAttribute('aria-label', 'Analyze on Wintrcat');
            button.addEventListener('click', prepareAndOpenAnalysisPage);

            // Assemble the button
            wintrcatButtonContainer.appendChild(buttonLabel);
            wintrcatButtonContainer.appendChild(button);

            // Insert the new button after the review button
            reviewButtonContainer.insertAdjacentElement('afterend', wintrcatButtonContainer);
        }
    }

    function prepareAndOpenAnalysisPage() {
        const gameId = window.location.pathname.split('/').pop();
        const apiUrl = `https://www.chess.com/callback/live/game/${gameId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const gameData = {
                    gameId: gameId,
                    white: data.game.pgnHeaders.White,
                    black: data.game.pgnHeaders.Black,
                    date: data.game.pgnHeaders.Date,
                    timeClass: data.game.timeClass
                };
                GM_setValue('chesscomGameData', JSON.stringify(gameData));
                window.open('https://chess.wintrcat.uk/', '_blank');
            })
            .catch(error => console.error('Error fetching game data:', error));
    }

    // Function for chess.wintrcat.uk
    function loadChesscomGame() {
        const gameDataString = GM_getValue('chesscomGameData', null);
        if (!gameDataString) return;

        const gameData = JSON.parse(gameDataString);

        // Clear the stored data
        GM_setValue('chesscomGameData', null);

        // Wait for the page to load
        setTimeout(() => {
            // Set load type to Chess.com
            const loadTypeDropdown = document.querySelector('#load-type-dropdown');
            loadTypeDropdown.value = 'chesscom';
            loadTypeDropdown.dispatchEvent(new Event('input'));

            // Set username
            const usernameInput = document.querySelector('#chess-site-username');
            usernameInput.value = gameData.white; // Assuming the user is always white

            // Click the fetch button
            const fetchButton = document.querySelector('#fetch-account-games-button');
            fetchButton.click();

            // Wait for the games to load, then select the correct game
            setTimeout(() => {
                const gameListings = document.querySelectorAll('.game-listing');
                for (const listing of gameListings) {
                    const pgnData = listing.getAttribute('data-pgn');
                    if (pgnData && pgnData.includes(gameData.gameId)) {
                        listing.click();

                        // Click the review button
                        setTimeout(() => {
                            const reviewButton = document.querySelector('#review-button');
                            if (reviewButton && !reviewButton.classList.contains('review-button-disabled')) {
                                reviewButton.click();
                            } else {
                                console.log('Review button not available or disabled');
                            }
                        }, 1000); // Wait a bit for the button to become clickable
                        return;
                    }
                }

                console.log('Game not found. Falling back to player name matching.');

                // Fallback to matching player names if game ID is not found
                for (const listing of gameListings) {
                    const playerText = listing.querySelector('span').textContent;
                    if (playerText.includes(gameData.white) && playerText.includes(gameData.black)) {
                        listing.click();

                        // Click the review button
                        setTimeout(() => {
                            const reviewButton = document.querySelector('#review-button');
                            if (reviewButton && !reviewButton.classList.contains('review-button-disabled')) {
                                reviewButton.click();
                            } else {
                                console.log('Review button not available or disabled');
                            }
                        }, 1000); // Wait a bit for the button to become clickable
                        return;
                    }
                }

                console.log('Game not found by player names either.');
            }, 2000); // Adjust this timeout if needed
        }, 1000); // Adjust this timeout if needed
    }

    // Determine which site we're on and run the appropriate function
    if (window.location.hostname === 'www.chess.com') {
        // Check for the button every second
        const intervalId = setInterval(() => {
            if (document.querySelector('.game-over-modal-content')) {
                addAnalysisButton();
                clearInterval(intervalId);
            }
        }, 1000);
    } else if (window.location.hostname === 'chess.wintrcat.uk') {
        loadChesscomGame();
    }
})();