// ==UserScript==
// @name         Lorwolf Accessibility Script Right Side
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Lorwolf Accessibility Script
// @author       Chris T.
// @match        https://www.lorwolf.com/Campaign/Explore*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484083/Lorwolf%20Accessibility%20Script%20Right%20Side.user.js
// @updateURL https://update.greasyfork.org/scripts/484083/Lorwolf%20Accessibility%20Script%20Right%20Side.meta.js
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

    // Function to add an arrow to the button text
    function addArrowToButton(arrow, buttonSelector) {
        const button = document.querySelector(buttonSelector);
        if (button) {
            const buttonText = button.textContent.trim();
            const arrowText = `[${arrow}]`;

            // Check if the arrow is already present in the button text
            if (!button.dataset.arrowAdded || button.dataset.arrowAdded !== arrow) {
                // Add the arrow only if it's not already present
                button.innerHTML = `${arrowText} ${buttonText}`;
                button.dataset.arrowAdded = arrow; // Set a data attribute to mark the arrow as added
            }
        }
    }

    // Function to check and update buttons
    function checkAndUpdateButtons() {
        addArrowToButton('&#9650;', '.exploreOption[data-option-id="0"]'); // Black Up-Pointing Small Triangle (Up arrow)
        addArrowToButton('&#9660;', '.exploreOption[data-option-id="1"]'); // Black Down-Pointing Small Triangle (Down arrow)
        addArrowToButton('&#9654;', '.partyFeedAllButton'); // Black Right-Pointing Small Triangle (Left arrow)
        addArrowToButton('&#9664;', '.exploreAgainOption'); // Black Left-Pointing Small Triangle (Right arrow)
    }

    // Event listener for key presses
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is ArrowUp, ArrowDown, ArrowRight, ArrowLeft, or '0'
        if (event.key === 'ArrowUp') {
            clickButton(0); // Press the top button when ArrowUp is pressed
        } else if (event.key === 'ArrowDown') {
            clickButton(1); // Press the bottom button when ArrowDown is pressed
        } else if (event.key === 'ArrowRight') {
            clickFeedAll(); // Press the "Feed All" button when ArrowRight is pressed
        } else if (event.key === 'ArrowLeft') {
            clickExploreAgain(); // Press the "Explore Again" link when ArrowLeft is pressed
        } else if (event.key === '0') {
            location.reload(); // Refresh the page when '0' is pressed
        }
    });

    // Check and update buttons every 0.2 seconds
    setInterval(checkAndUpdateButtons, 200);
})();
