// ==UserScript==
// @name         ironwoodrpg bot
// @namespace    http://tampermonkey.net/
// @version      2024-07-17
// @description  bot for ironwoodrpg 
// @author       You
// @match        https://ironwoodrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500986/ironwoodrpg%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/500986/ironwoodrpg%20bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // General function to click a button if its text contains a specific string
    function clickButton(buttonText) {
        // Find all buttons on the page
        let buttons = document.getElementsByTagName('button');
        for (let button of buttons) {
            // Check if the button's text contains the specified string
            if (button.textContent.includes(buttonText)) {
                button.click();
                console.log(`${buttonText} button clicked`);
                break;
            }
        }
    }

    // Function to initialize button clicking for specified texts
    function initializeButtonClicking(buttonTexts) {
        for (let text of buttonTexts) {
            clickButton(text);
        }
    }

    // Button texts to look for and click
    const buttonTexts = ['Claim Expedition', 'Start Expedition'];

    // Run the function when the page loads
    window.onload = function() {
        initializeButtonClicking(buttonTexts);
    };

    // Optional: Run the function every 5 seconds in case the buttons appear after the page loads
    setInterval(function() {
        initializeButtonClicking(buttonTexts);
    }, 1000);
})();