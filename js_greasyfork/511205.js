// ==UserScript==
// @name         GeoGuessr - Who played better?
// @description  Shows which player made better guesses overall in a duel, independent of the actual outcome influenced by multipliers.
// @namespace    https://greasyfork.org/users/1375871
// @version      0.2
// @author       @teqoa9
// @match        https://www.geoguessr.com/duels/*/summary
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511205/GeoGuessr%20-%20Who%20played%20better.user.js
// @updateURL https://update.greasyfork.org/scripts/511205/GeoGuessr%20-%20Who%20played%20better.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let text = "{winner} beat {loser} by {pointsDifference} points."
    let multiMerchantedText = "However, {loser} won thanks to multipliers."

    function extractGameData() {
        const roundElements = document.querySelectorAll('.game-summary_playedRound__VukPu');
        let totalDifference = 0;
        let player1TotalScore = 0;
        let player2TotalScore = 0;
        let lastRoundDifference = 0;

        roundElements.forEach((round, index) => {
            const scores = round.querySelectorAll('.game-summary_text__viPc6');
            if (scores.length >= 3) {
                const player1Score = parseInt(scores[1].textContent);
                const player2Score = parseInt(scores[2].textContent);
                const difference = player1Score - player2Score;
                totalDifference += difference;
                player1TotalScore += player1Score;
                player2TotalScore += player2Score;

                if (index === roundElements.length - 1) {
                    lastRoundDifference = difference;
                }
            }
        });

        const player1Name = 'Blue';
        const player2Name = 'Red';

        return {
            player1: {
                name: player1Name,
                score: player1TotalScore
            },
            player2: {
                name: player2Name,
                score: player2TotalScore
            },
            totalDifference: Math.abs(totalDifference),
            lastRoundDifference: lastRoundDifference
        };
    }

    function addText() {
        const targetElement = document.querySelector('.game-mode-brand_root__8782u');
        if (!targetElement) {
            console.log('Target element not found, retrying...');
            return false;
        }

        const gameData = extractGameData();
        if (!gameData || gameData.player1.score === 0 || gameData.player2.score === 0) {
            console.log('Game data not fully loaded, retrying...');
            return false;
        }

        if (targetElement.querySelector('.better-player-analysis')) {
            console.log('Analysis already added');
            return true;
        }

        const winner = gameData.player1.score > gameData.player2.score ? gameData.player1 : gameData.player2;
        const loser = winner === gameData.player1 ? gameData.player2 : gameData.player1;

        const analysisContainer = document.createElement('div');
        analysisContainer.className = 'better-player-analysis';

        const firstText = document.createElement('div');
        firstText.innerHTML = text
            .replace("{winner}", `<span class="player-name ${winner.name.toLowerCase()}">${winner.name}</span>`)
            .replace("{pointsDifference}", gameData.totalDifference)
            .replace("{loser}", `<span class="player-name ${loser.name.toLowerCase()}">${loser.name}</span>`);
        firstText.style.marginTop = '10px';
        analysisContainer.appendChild(firstText);

        // check if multimerchanted.
        const multiMerchanted = (winner === gameData.player1 && gameData.lastRoundDifference < 0) ||
                                (winner === gameData.player2 && gameData.lastRoundDifference > 0);

        if (multiMerchanted) {
            const secondText = document.createElement('div');
            secondText.innerHTML = multiMerchantedText
                .replace("{loser}", `<span class="player-name ${loser.name.toLowerCase()}">${loser.name}</span>`);
            secondText.style.marginTop = '5px';
            analysisContainer.appendChild(secondText);
        }

        targetElement.appendChild(analysisContainer);
        console.log('Analysis added successfully');
        return true;
    }

    function initializeScript() {
        if (!addText()) {
            const observer = new MutationObserver((mutations, obs) => {
                if (addText()) {
                    obs.disconnect();
                    console.log('Observer disconnected after successful addition');
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                console.log('Observer timed out after 10 seconds');
            }, 10000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    GM_addStyle(`
        .game-mode-brand_root__8782u {
        }
        .player-name {
            font-weight: bold;
            color: white;
            padding: 0px 0px;
            border-radius: 3px;
            margin: 0 0px;
        }
        .blue {
            -webkit-text-stroke: 1px blue;
            text-stroke: 1px blue;
        }
        .red {
            -webkit-text-stroke: 1px red;
            text-stroke: 1px red;
        }
        .better-player-analysis {
            margin-top: 10px;
        }
    `);
})();