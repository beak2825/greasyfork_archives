// ==UserScript==
// @name         Click Counter and Mistake Tracker
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  For those who use the site for self-learning. It counts how many times you clicked and how many mistakes you made (click on the counter to count mistakes).
// @author       Idhtft
// @match        https://randomwordgenerator.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498126/Click%20Counter%20and%20Mistake%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/498126/Click%20Counter%20and%20Mistake%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a counter display
    const counterDisplay = document.createElement('div');
    counterDisplay.id = 'clickCounter';
    counterDisplay.style.position = 'fixed';
    counterDisplay.style.bottom = '10px';
    counterDisplay.style.right = '10px';
    counterDisplay.style.backgroundColor = 'blue';
    counterDisplay.style.color = 'white';
    counterDisplay.style.padding = '10px';
    counterDisplay.style.border = '1px solid black';
    counterDisplay.style.borderRadius = '5px';
    counterDisplay.style.cursor = 'pointer'; // Make it clickable
    counterDisplay.style.zIndex = '1000';
    document.body.appendChild(counterDisplay);

    // Initialize counters
    let clickCount = 0;
    let mistakeCount = 0;

    // Update the counter display
    function updateCounter() {
        counterDisplay.textContent = `Clicked: ${clickCount} times\nMistakes: ${mistakeCount}`;
    }

    // Attach event listener to the button
    const generateButton = document.querySelector('input[type="submit"][value="Generate Random Words"]');
    if (generateButton) {
        generateButton.addEventListener('click', () => {
            clickCount++;
            updateCounter();
        });
    }

    // Attach event listener to the counter display
    counterDisplay.addEventListener('click', () => {
        mistakeCount++;
        updateCounter();
    });

    // Initialize counter display
    updateCounter();
})();
