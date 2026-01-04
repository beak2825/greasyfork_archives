// ==UserScript==
// @name         Die Stämme Auto Label Incoming Attacks
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically labels incoming attacks on die-staemme.de
// @author       ricardofauch
// @match        https://*.die-staemme.de/game.php?screen=overview_villages&mode=incomings*
// @match        https://*.die-staemme.de/game.php?village=*&screen=overview_villages&mode=incomings*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518133/Die%20St%C3%A4mme%20Auto%20Label%20Incoming%20Attacks.user.js
// @updateURL https://update.greasyfork.org/scripts/518133/Die%20St%C3%A4mme%20Auto%20Label%20Incoming%20Attacks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get random number between min and max (inclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to wait for a specific time
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Logging function with timestamp
    function log(message) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[Auto Label ${timestamp}] ${message}`);
    }

    // Function to find and click elements
    async function autoLabel(initialWaitSeconds) {
        try {
            log('Script started');

            // Initial wait of 5-10 minutes
            log(`Waiting ${initialWaitSeconds} seconds before starting actions`);
            await wait(initialWaitSeconds * 1000);

            // Find and click the select all checkbox
            const selectAllCheckbox = document.getElementById('select_all');
            if (!selectAllCheckbox) {
                throw new Error('Select all checkbox not found');
            }
            log('Found select all checkbox');
            selectAllCheckbox.click();
            log('Clicked select all checkbox');

            // Wait 1-3 seconds
            const actionWait = getRandomInt(1000, 3000);
            log(`Waiting ${actionWait}ms before clicking rename`);
            await wait(actionWait);

            // Find and click the rename button
            const renameButton = Array.from(document.querySelectorAll('input[type="submit"]'))
                .find(input => input.value === 'Umbenennen');
            if (!renameButton) {
                throw new Error('Rename button not found');
            }
            log('Found rename button');
            renameButton.click();
            log('Clicked rename button - page will reload automatically');

        } catch (error) {
            log(`ERROR: ${error.message}`);
            console.error('Auto label script error:', error);
        }
    }

    // Add visual indicator that script is running with countdown
    const style = document.createElement('style');
    style.textContent = `
        .auto-label-indicator {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);

    const indicator = document.createElement('div');
    indicator.className = 'auto-label-indicator';
    document.body.appendChild(indicator);

    // Generate wait time once and use it for both the countdown and the actual wait
    const startTime = Date.now();
    const initialWaitSeconds = getRandomInt(300, 600); // 5-10 minutes in seconds

    // Update countdown every second
    function updateIndicator() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = initialWaitSeconds - elapsed;
        if (remaining > 0) {
            indicator.textContent = `🤖 Auto Label: ${remaining}s`;
            requestAnimationFrame(updateIndicator);
        } else {
            indicator.textContent = `🤖 Auto Label: Running...`;
        }
    }
    updateIndicator();

    // Start the automation with the same wait time
    log('Initializing Auto Label script');
    autoLabel(initialWaitSeconds);
})();