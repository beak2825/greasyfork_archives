// ==UserScript==
// @name         Torn Faction Chain Timer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Displays chain timer above faction war list and below faction message on Torn.com, with a profile link button, optimized for iPhone.
// @author       Grok
// @match        https://www.torn.com/factions.php?step=your&type=1*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542348/Torn%20Faction%20Chain%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/542348/Torn%20Faction%20Chain%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to wait for an element to appear
    function waitForElement(selector, callback, maxAttempts = 30, interval = 500) {
        let attempts = 0;
        const check = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(check, interval);
            }
        };
        check();
    }

    // Function to create and style timer display
    function createTimerDisplay(id, timerValue) {
        let timerDisplay = document.getElementById(id);
        if (!timerDisplay) {
            timerDisplay = document.createElement('div');
            timerDisplay.id = id;
            timerDisplay.style.cssText = `
                background: linear-gradient(90deg, #2c3e50, #3498db);
                color: white;
                padding: 15px;
                margin: 10px 0;
                border-radius: 8px;
                text-align: center;
                font-family: Arial, sans-serif;
                font-size: 1.5rem;
                font-weight: bold;
                width: 100%;
                max-width: 280px;
                box-sizing: border-box;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                align-items: center;
                pointer-events: auto;
            `;
            const button = document.createElement('a');
            button.href = 'https://www.torn.com/profiles.php?XID=3471922';
            button.textContent = 'View Profile';
            button.style.cssText = `
                display: inline-block;
                background-color: #007bff;
                color: white;
                padding: 10px;
                margin-top: 10px;
                border-radius: 5px;
                text-decoration: none;
                font-size: 1.1rem;
                width: 100%;
                max-width: 200px;
                text-align: center;
                box-sizing: border-box;
                pointer-events: auto;
            `;
            button.onmouseover = () => button.style.backgroundColor = '#0056b3';
            button.onmouseout = () => button.style.backgroundColor = '#007bff';
            timerDisplay.appendChild(button);
        }
        timerDisplay.firstChild && timerDisplay.firstChild.nodeType === Node.TEXT_NODE
            ? timerDisplay.firstChild.textContent = `Time Left: ${timerValue}`
            : timerDisplay.insertBefore(document.createTextNode(`Time Left: ${timerValue}`), timerDisplay.firstChild);
        return timerDisplay;
    }

    // Function to update timer displays
    function updateTimerDisplay() {
        const timerElement = document.querySelector('.chain-box-timeleft');
        const timerValue = timerElement ? timerElement.textContent : 'N/A';

        // Insert above faction war list
        waitForElement('#faction_war_list_id', (warList) => {
            if (!document.getElementById('timer_above_war_list')) {
                const timerAbove = createTimerDisplay('timer_above_war_list', timerValue);
                warList.parentNode.insertBefore(timerAbove, warList);
            }
        });

        // Insert below faction message
        waitForElement('.f-msg.m-top10', (factionMsg) => {
            if (!document.getElementById('timer_below_faction_msg')) {
                const timerBelow = createTimerDisplay('timer_below_faction_msg', timerValue);
                factionMsg.parentNode.insertBefore(timerBelow, factionMsg.nextSibling);
            }
        });

        // Update existing displays
        const displays = ['timer_above_war_list', 'timer_below_faction_msg'];
        displays.forEach(id => {
            const display = document.getElementById(id);
            if (display && display.firstChild && display.firstChild.nodeType === Node.TEXT_NODE) {
                display.firstChild.textContent = `Time Left: ${timerValue}`;
            }
        });
    }

    // Initial setup
    waitForElement('.chain-box-timeleft', (timerElement) => {
        updateTimerDisplay();

        // Observe changes to timer element
        const observer = new MutationObserver(updateTimerDisplay);
        observer.observe(timerElement, { childList: true, characterData: true, subtree: true });

        // Fallback periodic update
        setInterval(updateTimerDisplay, 1000);
    });
})();