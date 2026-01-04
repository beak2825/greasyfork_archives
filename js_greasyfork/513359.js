// ==UserScript==
// @name         Bloxflip Game Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Track Bloxflip game results and analyze patterns (not accurate)
// @author       You
// @match        *://bloxflip.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/513359/Bloxflip%20Game%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/513359/Bloxflip%20Game%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array to store game outcomes
    let outcomes = GM_getValue('outcomes', []);
    
    // Function to track the game outcome from the webpage
    function trackGameOutcome() {
        try {
            // Example: You need to inspect the HTML structure of Bloxflip's page to find the correct class/id for game results.
            let resultElement = document.querySelector('.game-result'); // Adjust this selector as needed
            if (resultElement) {
                let outcome = resultElement.textContent.trim().toLowerCase();
                
                if (outcome === 'win' || outcome === 'loss') {
                    outcomes.push(outcome);
                    
                    // Limit array size to avoid storing too much data
                    if (outcomes.length > 100) outcomes.shift();

                    GM_setValue('outcomes', outcomes); // Save outcomes in persistent storage
                    console.log('Outcome recorded:', outcome);

                    // Analyze and display stats
                    displayStats();
                }
            }
        } catch (error) {
            console.error('Error tracking game outcome:', error);
        }
    }

    // Function to analyze game outcomes
    function analyzeOutcomes() {
        let winCount = outcomes.filter(outcome => outcome === 'win').length;
        let lossCount = outcomes.filter(outcome => outcome === 'loss').length;
        let winRatio = winCount / outcomes.length * 100 || 0;
        let lossRatio = lossCount / outcomes.length * 100 || 0;

        // Track streaks
        let currentStreak = 1;
        let lastOutcome = outcomes[outcomes.length - 1];
        for (let i = outcomes.length - 2; i >= 0; i--) {
            if (outcomes[i] === lastOutcome) {
                currentStreak++;
            } else {
                break;
            }
        }

        return {
            winCount,
            lossCount,
            winRatio,
            lossRatio,
            currentStreak,
            lastOutcome
        };
    }

    // Function to display statistics
    function displayStats() {
        let stats = analyzeOutcomes();
        console.log('Game Stats:', stats);

        // Optionally display stats in a custom UI element on the page
        let statsDiv = document.getElementById('bloxflip-stats');
        if (!statsDiv) {
            statsDiv = document.createElement('div');
            statsDiv.id = 'bloxflip-stats';
            document.body.appendChild(statsDiv);

            GM_addStyle(`
                #bloxflip-stats {
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px;
                    font-size: 14px;
                    border-radius: 5px;
                    z-index: 10000;
                }
            `);
        }

        statsDiv.innerHTML = `
            <b>Bloxflip Game Stats</b><br>
            Wins: ${stats.winCount}<br>
            Losses: ${stats.lossCount}<br>
            Win Ratio: ${stats.winRatio.toFixed(2)}%<br>
            Loss Ratio: ${stats.lossRatio.toFixed(2)}%<br>
            Current Streak: ${stats.currentStreak} (${stats.lastOutcome})
        `;
    }

    // Run the tracking function at intervals (adjust the interval to match how frequently games end)
    setInterval(trackGameOutcome, 3000); // Check every 3 seconds

})();