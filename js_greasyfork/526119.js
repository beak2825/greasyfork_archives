// ==UserScript==
// @name         Fast Profile Revives w/ R to Revive
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Moves the confirm "Yes" button for revives to the revive button location if success chance exceeds a user-defined threshold. This version also allows the user to spam the 'R' key to revive
// @author       fourzees [3002874]
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526119/Fast%20Profile%20Revives%20w%20R%20to%20Revive.user.js
// @updateURL https://update.greasyfork.org/scripts/526119/Fast%20Profile%20Revives%20w%20R%20to%20Revive.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Default success threshold
    let successThreshold = parseFloat(localStorage.getItem('reviveSuccessThreshold')) || 50; // Load from localStorage or use default (50)

    let successChance = null;
    let reviveReady = false;

    // Variable to store revive button location
    let reviveButtonPosition = null;

    // Utility function to parse success chance from the page text
    function getSuccessChance() {
        // Look for text matching "xx.xx% chance of success"
        const pageText = document.body.innerText;
        const match = pageText.match(/(\d+\.\d+)% chance of success/);
        if (match) {
            return parseFloat(match[1]);
        }
        return null;
    }

    // Function to save the revive button's position
    function saveReviveButtonPosition() {
        const reviveButton = document.querySelector('.profile-button-revive');
        if (reviveButton) {
            const reviveRect = reviveButton.getBoundingClientRect();
            reviveButtonPosition = {
                top: reviveRect.top + window.scrollY,
                left: reviveRect.left + window.scrollX
            };
        }
    }

    // Function to move the "Yes" button
    function adjustYesButton() {
        const successChance = getSuccessChance();

        if (successChance !== null && successChance >= successThreshold && reviveButtonPosition) {
            const yesButton = document.querySelector('.confirm-action-yes');


            if (yesButton) {
                // Apply styles to move the "Yes" button
                yesButton.style.position = 'absolute';
                yesButton.style.top = `${reviveButtonPosition.top}px`;
                yesButton.style.left = `${reviveButtonPosition.left}px`;
                yesButton.style.fontSize = "30px";
                yesButton.style.zIndex = '1000'; // Ensure it's on top
                reviveReady = true;
            }else {
            reviveReady = false;
            }
        }
    }

    // Function to create a button for setting the success threshold
    function createThresholdButton() {
        const actionsText = document.querySelector('.title-black');

        if (actionsText) {
            // Create the button
            const button = document.createElement('button');
            button.textContent = 'Set Revive Threshold';
            button.style.marginLeft = '10px';
            button.style.cursor = 'pointer';
            button.style.color = '#FF0000';

            // Add click event to show a popup for input
            button.addEventListener('click', () => {
                const newThreshold = prompt('Enter the success threshold (as a percentage):', successThreshold);
                if (newThreshold !== null) {
                    const parsedValue = parseFloat(newThreshold);
                    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
                        successThreshold = parsedValue;
                        localStorage.setItem('reviveSuccessThreshold', successThreshold); // Save to localStorage
                        alert(`Success threshold updated to ${successThreshold}%`);
                    } else {
                        alert('Invalid input. Please enter a number between 0 and 100.');
                    }
                }
            });

            // Append the button next to the "Actions" text
            actionsText.parentNode.insertBefore(button, actionsText.nextSibling);
        }
    }

    // Observe changes on the page to trigger the adjustment when needed
    const observer = new MutationObserver(() => {
        // Save the revive button position before it is removed
        saveReviveButtonPosition();
        // Attempt to adjust the "Yes" button
        adjustYesButton();
    });

    // Listen for "R" key press to perform revive action
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'r' && !event.repeat) { // sets 'r' key to revive
            if (successChance === null) {
                const revButton = document.querySelector('.profile-button-revive'); // Press revive button, getting the success chance
                if (revButton) {
                    revButton.click();
                }
                successChance = getSuccessChance();
                adjustYesButton();
            } else if (reviveReady) { // If revive chance is above the set threshold, then the next hit of the "R" button will attempt a revive
                const yesButton = document.querySelector('.confirm-action'); // Confirms the revive and confirms "okay" after success/fail if "R" is pressed again
                if (yesButton) {
                    yesButton.click();
                } else {
                    const revButton = document.querySelector('.profile-button-revive'); // Press the revive button again on fail, restarting the process to attempt the revive again
                    if (revButton) {
                        revButton.click();
                    }
                }
            }
        }
    });

    // Start observing the page for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial setup
    saveReviveButtonPosition();
    adjustYesButton();
    createThresholdButton();
})();
