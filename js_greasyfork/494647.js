// ==UserScript==
// @name         Easy Execute %
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Calculate and display Execute %
// @author       ChatGPT
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494647/Easy%20Execute%20%25.user.js
// @updateURL https://update.greasyfork.org/scripts/494647/Easy%20Execute%20%25.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to calculate 19% of a value
    function calculatePercentage(value) {
        return value * 0.19; // Change this to your Execute %
    }

    // Function to extract maximum health value from the webpage and calculate 19% of it
    function updatePercentage() {
        // Select all elements whose ID contains "player-health-value_"
        var healthValueElements = document.querySelectorAll('[id^="player-health-value_"]');
        if (healthValueElements.length > 0) {
            healthValueElements.forEach(function(element) {
                var healthText = element.textContent.trim();
                var maxHealth = healthText.split("/")[1].replace(",", "").trim(); // Extract maximum health value
                var value = parseFloat(maxHealth);
                if (!isNaN(value)) {
                    var percentage = calculatePercentage(value);
                    // Display the result on the screen
                    displayPercentage(percentage);
                    // Log the result to the console
                    console.log("19% of maximum health is: " + percentage.toFixed(2));
                }
            });
        }
    }

    // Function to display the calculated percentage on the screen
    function displayPercentage(percentage) {
        var existingDisplay = document.getElementById("percentage-display");
        if (existingDisplay === null) {
            // Create a new element if it doesn't exist
            var displayElement = document.createElement("div");
            displayElement.id = "percentage-display";
            displayElement.style.position = "absolute";
            displayElement.style.top = "109px";
            displayElement.style.left = "950px";
            displayElement.style.background = "transparent";
            displayElement.style.padding = "8px";
            document.body.appendChild(displayElement);
            existingDisplay = displayElement;
        }
        // Round down the percentage to remove decimal points
        var roundedPercentage = Math.floor(percentage);
        // Update the content of the element with the new rounded percentage
        existingDisplay.textContent = "Execute HP: " + roundedPercentage;
    }

    // Call updatePercentage after a short delay to allow the page to fully load
    setTimeout(updatePercentage, 500); // delay

})();
