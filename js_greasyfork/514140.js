// ==UserScript==
// @name         Die Stämme Farm-Assistent Auto-Farm LKav
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automates farming in Die Stämme
// @author       ricardofauch
// @match        https://*.die-staemme.de/game.php?village=*&screen=am_farm*
// @match        https://*.die-staemme.de/game.php?village=*&screen=am_farm&*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514140/Die%20St%C3%A4mme%20Farm-Assistent%20Auto-Farm%20LKav.user.js
// @updateURL https://update.greasyfork.org/scripts/514140/Die%20St%C3%A4mme%20Farm-Assistent%20Auto-Farm%20LKav.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug logging function with timestamp
    function logDebug(message, data = '') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] Farm Bot: ${message}`, data);
    }

    // Function to get a random number between min and max
    function getRandomInt(min, max) {
        const result = Math.floor(Math.random() * (max - min + 1)) + min;
        logDebug(`Generated random number between ${min}-${max}:`, result);
        return result;
    }

    // Function to sleep for a given number of milliseconds
    function sleep(ms) {
        logDebug(`Sleeping for ${ms}ms`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to check light units and click farm buttons
    async function checkAndFarm() {
        logDebug('Starting farm check...');

        // Get the light units count
        const lightUnitsElement = document.querySelector('td#light.unit-item-light');
        if (!lightUnitsElement) {
            logDebug('Light units element not found!');
            return;
        }

        const lightUnits = parseInt(lightUnitsElement.textContent);
        logDebug('Light units available:', lightUnits);

        if (lightUnits <= 0) {
            logDebug('No light units available, skipping farming');
            return;
        }

        // Get all available farm buttons
        const farmButtons = document.querySelectorAll('a.farm_icon_b:not(.farm_icon_disabled)');
        logDebug('Farm buttons found:', farmButtons.length);

        // Click buttons based on available light units
        const clickCount = Math.min(lightUnits, farmButtons.length);
        logDebug(`Will attempt to click ${clickCount} buttons`);

        for (let i = 0; i < clickCount; i++) {
            // Random delay between clicks (600-1200ms)
            const delay = getRandomInt(600, 1200);
            logDebug(`Click ${i + 1}/${clickCount} - Waiting ${delay}ms before click`);
            await sleep(delay);

            try {
                // Click the farm button
                farmButtons[i].click();
                logDebug(`Successfully clicked button ${i + 1}`);
            } catch (error) {
                logDebug('Error clicking button:', error);
            }
        }

        logDebug('Finished farming sequence');
    }

    // Function to schedule page reload
    function scheduleReload() {
        const reloadDelay = getRandomInt(300000, 600000);
        const reloadMinutes = (reloadDelay / 60000).toFixed(1);

        logDebug(`Scheduled reload in ${reloadMinutes} minutes (${reloadDelay}ms)`);

        setTimeout(() => {
            logDebug('Executing scheduled reload now');
            location.reload();
        }, reloadDelay);
    }

    // Main function
    function initialize() {
        logDebug('Script initialized');
        logDebug('Current URL:', window.location.href);

        // Check and farm immediately after page load
        checkAndFarm().then(() => {
            logDebug('Initial farming sequence completed');
        }).catch(error => {
            logDebug('Error in farming sequence:', error);
        });

        // Schedule next reload
        scheduleReload();
    }

    // Start the script
    logDebug('=== Farm Bot Starting ===');
    initialize();
})();