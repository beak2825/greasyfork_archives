// ==UserScript==
// @name         Leaderboard Score Submitter for The Game Color Find (5jqdmjxdwavv)
// @namespace    https://5jqdmjxdwavv.trickle.host/
// @version      1.0
// @description  Submit any score to the leaderboard in The Color Find game (5jqdmjxdwavv) with a custom name and score
// @author       _extreme
// @match        https://5jqdmjxdwavv.trickle.host/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525256/Leaderboard%20Score%20Submitter%20for%20The%20Game%20Color%20Find%20%285jqdmjxdwavv%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525256/Leaderboard%20Score%20Submitter%20for%20The%20Game%20Color%20Find%20%285jqdmjxdwavv%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function waitForElement() {
        const gameControls = document.querySelector('[data-name="game-controls"]')
        if (gameControls) {
            const startButton = document.querySelector('[data-name="start-button"]').remove()
            const findSeriesButton = document.querySelector('[data-name="find-series-button"]')

            const nameInputContainer = document.querySelector('[data-name="name-input-container"]')
            const nameLabel = nameInputContainer.children[0].children[0]
            const nameInput = nameInputContainer.children[1]
            const scoreInputContainer = nameInputContainer.cloneNode(true)
            const scoreLabel = scoreInputContainer.children[0].children[0]
            const scoreInput = scoreInputContainer.children[1]
            scoreLabel.innerHTML = "Enter your score to start:"
            scoreInput.placeholder = "Your score"
            scoreInput.type = "number"
            scoreInput.setAttribute("data-name", "player-score-input")
            nameInputContainer.parentNode.insertBefore(scoreInputContainer, nameInputContainer.nextSibling);

            const updateDailyButton = document.createElement('button')
            updateDailyButton.className = "w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            updateDailyButton.innerHTML = "Update Daily Leaderboard";
            updateDailyButton.addEventListener('click', async () => {
                await UpdateLeaderboard(nameInput.value, scoreInput.value, "Daily")
            });
            
            const updateAllTimeButton = document.createElement('button')
            updateAllTimeButton.className = "w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            updateAllTimeButton.innerHTML = "Update All Time Leaderboard";
            updateAllTimeButton.addEventListener('click', async () => {
                await UpdateLeaderboard(nameInput.value, scoreInput.value, "AllTime")
            });

            if (findSeriesButton) {
                gameControls.insertBefore(updateDailyButton, findSeriesButton)
                gameControls.insertBefore(updateAllTimeButton, findSeriesButton)
            } else {
                gameControls.appendChild(updateDailyButton)
                gameControls.appendChild(updateAllTimeButton)
            }
        } else {
            setTimeout(waitForElement, 100)
        }
    })()

    async function UpdateLeaderboard(playerName, level, LeaderboardType) {
        try {
            const trickleObjAPI = new TrickleObjectAPI;
            const currentDate = getCurrentUTCDateString();

            const dailyObjectType = `colorGameScore_${currentDate}`; // Used For Daily Leaderboard!
            const historicalObjectType = "colorGameScore"; // Used For All Time Leaderboard!
            
            const timestamp = new Date().toISOString();
            const verificationToken = await generateScoreToken(level, playerName, timestamp);

            const scoreData = {
                playerName,
                score: level,
                timestamp,
                verificationToken
            };

            if (LeaderboardType === "Daily") {
                await trickleObjAPI.createObject(dailyObjectType, scoreData);
            } else if (LeaderboardType === "AllTime") {
                await trickleObjAPI.createObject(historicalObjectType, scoreData);
            }
        } catch (error) {
            console.error('Error updating leaderboard:', error);
        }
    }
    
})();
