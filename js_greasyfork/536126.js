// ==UserScript==
// @name         Torn.com Attack Player Count Checker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Checks the number of players in an ongoing attack on Torn.com, warns once if there are more than 2 players, and allows the attack to proceed on the second click.
// @author       Lewiss + AI
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536126/Torncom%20Attack%20Player%20Count%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/536126/Torncom%20Attack%20Player%20Count%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let warningShown = false; // Flag to track if the warning has been shown

    // Function to check the number of players in the attack
    function checkAttackPlayers() {
        // Find the element containing the number of players
        const playerCountElement = document.querySelector('.titleNumber___zLFnC');

        if (playerCountElement) {
            // Extract the number of players
            const playerCount = parseInt(playerCountElement.textContent, 10);

            // Check if there are more than 2 players
            if (playerCount > 2) {
                // Display a warning pop-up only if it hasn't been shown yet
                if (!warningShown) {
                    alert(`Warning: There are ${playerCount} players in this attack! Proceed with caution.`);
                    warningShown = true; // Set the flag to true after showing the warning
                    return true; // Indicates that the attack should be blocked this time
                }
            }
        } else {
            console.log("Player count element not found.");
        }
        return false; // Indicates that the attack can proceed
    }

    // Function to attach the event listener to the "Start fight" button
    function attachButtonListener() {
        // Find the "Start fight" button
        const startFightButton = document.querySelector('button[type="submit"].torn-btn.btn___RxE8_.silver');

        if (startFightButton) {
            // Attach a click event listener to the button
            startFightButton.addEventListener('click', function(event) {
                // Run the player count check
                const shouldBlockAttack = checkAttackPlayers();

                // If there are more than 2 players and the warning hasn't been shown, block the attack
                if (shouldBlockAttack) {
                    event.preventDefault(); // Stop the form submission
                    event.stopPropagation(); // Stop the event from bubbling up
                    console.log("Attack blocked: Too many players. Warning shown.");
                } else {
                    console.log("Attack allowed: 2 or fewer players, or warning already shown.");
                }
            });
        } else {
            console.log("Start fight button not found.");
        }
    }

    // Function to wait for an element to appear in the DOM
    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 500); // Check every 500ms
    }

    // Wait for the "Start fight" button to appear and attach the listener
    waitForElement('button[type="submit"].torn-btn.btn___RxE8_.silver', function(button) {
        attachButtonListener();
    });

    // Wait for the player count element to appear and log it
    waitForElement('.titleNumber___zLFnC', function(element) {
        console.log("Player count element found:", element.textContent);
    });
})();