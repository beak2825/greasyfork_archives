// ==UserScript==
// @name         Nitrotype Auto Typing Bot
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically types during Nitrotype races with customizable settings.
// @author       Simeon
// @match        *://www.nitrotype.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513716/Nitrotype%20Auto%20Typing%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/513716/Nitrotype%20Auto%20Typing%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let raceText = '';
    let typingDelay = 200; // Default typing delay
    let accuracy = 100; // Default accuracy
    let totalRaces = 1; // Default number of races
    let currentRaceCount = 0; // Current race counter

    // Create a UI for settings
    const createUI = () => {
        const uiDiv = document.createElement('div');
        uiDiv.style.position = 'fixed';
        uiDiv.style.top = '10px';
        uiDiv.style.right = '10px';
        uiDiv.style.backgroundColor = 'white';
        uiDiv.style.padding = '10px';
        uiDiv.style.zIndex = '1000';
        uiDiv.style.border = '1px solid black';

        uiDiv.innerHTML = `
            <h4>Nitrotype Auto Typing Bot</h4>
            <label for="wpm">Desired WPM:</label>
            <input type="number" id="wpm" min="1" value="40">
            <br>
            <label for="accuracy">Accuracy (%):</label>
            <input type="number" id="accuracy" min="0" max="100" value="100">
            <br>
            <label for="races">Number of Races:</label>
            <input type="number" id="races" min="1" value="1">
            <br>
            <button id="startRacing">Start Racing</button>
        `;

        document.body.appendChild(uiDiv);

        // Start racing on button click
        document.getElementById('startRacing').addEventListener('click', () => {
            const wpm = parseInt(document.getElementById('wpm').value);
            accuracy = parseInt(document.getElementById('accuracy').value);
            totalRaces = parseInt(document.getElementById('races').value);
            typingDelay = (60000 / wpm) / 5; // Calculate typing delay based on WPM
            currentRaceCount = 0; // Reset race counter
            alert("Settings saved! The bot will start racing.");
        });
    };

    // Detect race text and start typing
    const detectRaceText = () => {
        const textElement = document.querySelector('.race-text'); // Adjust selector as needed
        if (textElement) {
            raceText = textElement.innerText;
            console.log("Detected race text:", raceText);
            setTimeout(() => {
                simulateTyping(raceText);
            }, 3000); // Delay before typing
        }
    };

    const simulateTyping = (text) => {
        const inputField = document.querySelector('.input-field'); // Adjust selector as needed
        if (inputField) {
            inputField.focus();
            let lastIndex = 0;

            const typeNextCharacter = () => {
                if (lastIndex < text.length) {
                    const isAccurate = Math.random() * 100 < accuracy; // Determine if the character is accurate
                    const charToType = isAccurate ? text[lastIndex] : getRandomCharacter();

                    inputField.value += charToType; // Append character
                    inputField.dispatchEvent(new Event('input')); // Trigger input event

                    lastIndex++;
                    const delay = typingDelay + Math.random() * 50; // Randomize delay for realism
                    setTimeout(typeNextCharacter, delay);
                } else {
                    currentRaceCount++;
                    if (currentRaceCount < totalRaces) {
                        setTimeout(detectRaceText, 3000); // Delay before the next race
                    }
                }
            };

            typeNextCharacter();
        }
    };

    const getRandomCharacter = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789":?-*\.,; ';
        return characters.charAt(Math.floor(Math.random() * characters.length));
    };

    // Monitor for race events
    const raceObserver = new MutationObserver(detectRaceText);
    raceObserver.observe(document.body, { childList: true, subtree: true });

    // Initialize the UI
    createUI();
})();