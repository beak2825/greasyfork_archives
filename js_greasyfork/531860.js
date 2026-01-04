// ==UserScript==
// @name         Uhmegle AutoSkip with Persistent Country List and Disconnect Detection (Randomized Intervals)
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Auto-skip chats based on country (persisted) and if "You have disconnected" appears, simulate an ESC key press after a randomized delay.
// @match        *://uhmegle.com/*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/531860/Uhmegle%20AutoSkip%20with%20Persistent%20Country%20List%20and%20Disconnect%20Detection%20%28Randomized%20Intervals%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531860/Uhmegle%20AutoSkip%20with%20Persistent%20Country%20List%20and%20Disconnect%20Detection%20%28Randomized%20Intervals%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------
    // Persistent Country List Settings
    // -------------------------------

    const storageKey = 'uhmegleAutoSkipCountries';

    // Retrieve stored auto-skip country settings or initialize as empty.
    let autoSkipCountries = JSON.parse(localStorage.getItem(storageKey)) || {};

    // Save changes to localStorage.
    function saveAutoSkipCountries() {
        localStorage.setItem(storageKey, JSON.stringify(autoSkipCountries));
    }

    // Create and style a panel for the country list.
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.backgroundColor = 'white';
    panel.style.border = '1px solid #ccc';
    panel.style.padding = '10px';
    panel.style.zIndex = 10000;
    panel.style.maxHeight = '300px';
    panel.style.overflowY = 'auto';
    panel.innerHTML = '<h4>AutoSkip Countries</h4><div id="countryList"></div>';
    document.body.appendChild(panel);

    // Update the panel with the list of countries and their auto-skip checkbox.
    function updateCountryListUI() {
        const listDiv = document.getElementById('countryList');
        listDiv.innerHTML = '';
        for (const country in autoSkipCountries) {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = autoSkipCountries[country];
            checkbox.addEventListener('change', function() {
                autoSkipCountries[country] = this.checked;
                saveAutoSkipCountries();
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + country));
            listDiv.appendChild(label);
        }
    }

    updateCountryListUI();

    // -------------------------------
    // ESC Key Simulation Functions
    // -------------------------------

    // Function to simulate one ESC key press.
    function simulateEsc() {
        const escEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(escEvent);
    }

    // Function to simulate two ESC key presses.
    function simulateSkip() {
        console.log('Simulating ESC key presses for auto-skip...');
        simulateEsc();
        // Random delay between 400ms and 600ms.
        const randomDelay = 400 + Math.random() * 200;
        setTimeout(simulateEsc, randomDelay);
    }

    // -------------------------------
    // Monitor for Country Changes
    // -------------------------------

    let lastCountry = '';

    function checkCountry() {
        const countryElem = document.getElementById('countryName');
        if (countryElem) {
            const currentCountry = countryElem.textContent.trim();
            if (currentCountry && currentCountry !== lastCountry) {
                lastCountry = currentCountry;
                // Add new country if not already present.
                if (!(currentCountry in autoSkipCountries)) {
                    autoSkipCountries[currentCountry] = false; // default auto-skip off
                    saveAutoSkipCountries();
                    updateCountryListUI();
                }
                // If auto-skip is enabled for this country, simulate the skip.
                if (autoSkipCountries[currentCountry]) {
                    simulateSkip();
                }
            }
        }
    }

    // Use a recursive function to randomize interval between country checks.
    function scheduleCountryCheck() {
        checkCountry();
        const nextDelay = 800 + Math.random() * 400; // 800ms to 1200ms
        setTimeout(scheduleCountryCheck, nextDelay);
    }
    scheduleCountryCheck();

    // Also observe DOM changes in case the country element is loaded dynamically.
    const countryObserver = new MutationObserver(checkCountry);
    countryObserver.observe(document.body, { childList: true, subtree: true });

    // -------------------------------
    // Monitor for "You have disconnected" Text
    // -------------------------------

    let disconnectTriggered = false;
    function checkForDisconnect() {
        // Check if the phrase "You have disconnected" appears anywhere in the visible text.
        const pageText = document.body.innerText || "";
        const found = pageText.includes("You have disconnected");
        if (found && !disconnectTriggered) {
            disconnectTriggered = true;
            console.log('"You have disconnected" detected. Simulating ESC key press after a random delay...');
            // Random delay between 400ms and 600ms before simulating an ESC key press.
            const randomDelay = 400 + Math.random() * 200;
            setTimeout(simulateEsc, randomDelay);
        } else if (!found && disconnectTriggered) {
            disconnectTriggered = false;
        }
    }

    // Recursive check for disconnect with random interval.
    function scheduleDisconnectCheck() {
        checkForDisconnect();
        const nextDelay = 800 + Math.random() * 400;
        setTimeout(scheduleDisconnectCheck, nextDelay);
    }
    scheduleDisconnectCheck();

    // -------------------------------
    // End of Script
    // -------------------------------
})();
