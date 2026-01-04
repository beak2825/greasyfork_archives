// ==UserScript==
// @name         Lorwolf Accessibility Script Left Side
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Lorwolf Accessibility Script
// @author       Chris T.
// @match        https://www.lorwolf.com/Campaign/Explore*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484082/Lorwolf%20Accessibility%20Script%20Left%20Side.user.js
// @updateURL https://update.greasyfork.org/scripts/484082/Lorwolf%20Accessibility%20Script%20Left%20Side.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a click on the explore buttons 0/1
    function clickButton(optionId) {
        const button = document.querySelector(`.exploreOption[data-option-id="${optionId}"]`);
        if (button) {
            button.click();
        }
    }

    // Function to simulate a click on the "Explore Again" link
    function clickExploreAgain() {
        const exploreAgainLink = document.querySelector('.exploreAgainOption');
        if (exploreAgainLink) {
            exploreAgainLink.click();
        }
    }

    // Function to simulate a click on the "Feed All" button
    function clickFeedAll() {
        const feedAllButton = document.querySelector('.partyFeedAllButton');
        if (feedAllButton) {
            feedAllButton.click();
        }
    }

    // Function to add a letter to the button text
    function addLetterToButton(letter, buttonSelector) {
        const button = document.querySelector(buttonSelector);
        if (button && !button.textContent.includes(`[${letter}]`)) {
            const buttonText = button.textContent.trim();
            button.textContent = `[${letter}] ${buttonText}`;
        }
    }

    // Function to check and update buttons
    function checkAndUpdateButtons() {
        addLetterToButton('E', '.exploreAgainOption');
        addLetterToButton('F', '.partyFeedAllButton');
        addLetterToButton('Q', '.exploreOption[data-option-id="0"]');
        addLetterToButton('W', '.exploreOption[data-option-id="1"]');
    }

    // Event listener for key presses
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is 'q', 'w', 'e', 'f', or 'r'
        if (event.key === 'q') {
            clickButton(0); // Press the top button when 'q' is pressed
        } else if (event.key === 'w') {
            clickButton(1); // Press the bottom button when 'w' is pressed
        } else if (event.key === 'e') {
            clickExploreAgain(); // Press the "Explore Again" link when 'e' is pressed
        } else if (event.key === 'f') {
            clickFeedAll(); // Press the "Feed All" button when 'f' is pressed
        } else if (event.key === 'r') {
            location.reload(); // Refresh the page when 'r' is pressed
        }
    });

    // Check and update buttons every 0.2 seconds
    setInterval(checkAndUpdateButtons, 200);
})();
