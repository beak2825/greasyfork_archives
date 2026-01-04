// ==UserScript==
// @name         Convert Percentages to American Odds
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Converts displayed percentages on DataGolf.com to American odds
// @author       stigy
// @match        https://datagolf.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522638/Convert%20Percentages%20to%20American%20Odds.user.js
// @updateURL https://update.greasyfork.org/scripts/522638/Convert%20Percentages%20to%20American%20Odds.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Config: Choose the behavior
    const APPEND_ODDS = false; // Set to false to replace the percentage completely

    // Function to convert percentage to American odds
    function convertToAmericanOdds(percentage) {
        if (percentage > 50) {
            return Math.round(- (percentage / (100 - percentage)) * 100);
        } else {
            return Math.round(((100 - percentage) / percentage) * 100);
        }
    }

    // Function to update percentages on the page
    function updateOdds() {
        // Select all relevant elements by class
        const elements = document.querySelectorAll('.data.probs-bg');

        elements.forEach(element => {
            // Extract percentage from innerText
            const percentageText = element.innerText.trim();
            const percentageValue = parseFloat(percentageText.replace('%', ''));

            // Ensure it's a valid number before converting
            if (!isNaN(percentageValue)) {
                const americanOdds = convertToAmericanOdds(percentageValue);

                if (APPEND_ODDS) {
                    // Append American odds in parentheses
                    element.innerText = `${percentageText} (${americanOdds > 0 ? `+${americanOdds}` : `${americanOdds}`})`;
                } else {
                    // Replace percentage with American odds
                    element.innerText = americanOdds > 0 ? `+${americanOdds}` : `${americanOdds}`;
                }
            }
        });
    }

    // Run the updateOdds function when the DOM is fully loaded
    window.addEventListener('load', updateOdds);
})();