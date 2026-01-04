// ==UserScript==
// @name         Auto Recruit Units
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically recruits spears and light cavalry at intervals
// @match        https://*.die-staemme.de/game.php?village=*&screen=train*
// @match        https://*.die-staemme.de/game.php?village=*&screen=train&*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514145/Auto%20Recruit%20Units.user.js
// @updateURL https://update.greasyfork.org/scripts/514145/Auto%20Recruit%20Units.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCurrentTimestamp() {
        return new Date().toLocaleString();
    }

    function recruitUnits() {
        console.log(`[${getCurrentTimestamp()}] Attempting to recruit units...`);

        // Find the input fields and button
        const spearInput = document.querySelector('input[name="spear"]');
        const lightInput = document.querySelector('input[name="light"]');
        const recruitButton = document.querySelector('.btn-recruit[value="Rekrutieren"]');

        // Check if elements exist and log their status
        console.log(`[${getCurrentTimestamp()}] Element check:`, {
            'Spear Input Found': !!spearInput,
            'Light Input Found': !!lightInput,
            'Recruit Button Found': !!recruitButton
        });

        if (spearInput && lightInput && recruitButton) {
            // Set the values
            spearInput.value = '6';
            lightInput.value = '3';

            console.log(`[${getCurrentTimestamp()}] Values set:`, {
                'Spears': spearInput.value,
                'Light Cavalry': lightInput.value
            });

            // Click the recruit button
            recruitButton.click();
            console.log(`[${getCurrentTimestamp()}] Recruit button clicked`);
        } else {
            console.error(`[${getCurrentTimestamp()}] Error: Some elements not found!`);
        }
    }

    function getRandomInterval() {
        // Generate random interval between 30-37 minutes in milliseconds
        const minutes = Math.floor(Math.random() * (37 - 30 + 1)) + 30;
        const milliseconds = minutes * 60 * 1000;
        console.log(`[${getCurrentTimestamp()}] Next recruitment scheduled in ${minutes} minutes`);
        return milliseconds;
    }

    function scheduleNextRecruitment() {
        const interval = getRandomInterval();
        console.log(`[${getCurrentTimestamp()}] Setting timeout for ${interval/1000/60} minutes`);

        setTimeout(() => {
            console.log(`[${getCurrentTimestamp()}] Timeout reached, starting recruitment process`);
            recruitUnits();
            scheduleNextRecruitment(); // Schedule the next recruitment
        }, interval);
    }

    // Start the recruitment cycle
    console.log(`[${getCurrentTimestamp()}] Script initialized`);
    scheduleNextRecruitment();
})();
