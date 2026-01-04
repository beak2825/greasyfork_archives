// ==UserScript==
// @name         Success Chance Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlights success chances that are below 75 or above 90 when planning is active
// @author       ingine
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530099/Success%20Chance%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/530099/Success%20Chance%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Run the script on page load and also set up a mutation observer
    // to handle dynamic content changes
    function initialize() {
        highlightRiskySuccessChances();

        // Set up a mutation observer to detect DOM changes
        const observer = new MutationObserver(function(mutations) {
            highlightRiskySuccessChances();
        });

        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Main function to highlight risky success chances
    function highlightRiskySuccessChances() {
        // Check if the Planning button is active
        const planningButton = document.querySelector('button.button___cwmLf.active___ImR61');

        if (!planningButton || !planningButton.textContent.includes('Planning')) {
            return; // Exit if Planning button is not active
        }

        // Find all success chance elements
        const successChanceElements = document.querySelectorAll('.successChance___ddHsR');

        successChanceElements.forEach(element => {
            const value = parseInt(element.textContent, 10);

            // Find the parent wrapper element
            const wrapperElement = element.closest('[class^="wrapper___"]');

            if (wrapperElement) {
                // Reset any previous styling
                wrapperElement.style.boxShadow = '';

                // Apply highlight for risky values
                if (value < 75) {
                    // Red highlight for too low
                    wrapperElement.style.boxShadow = '0 0 8px 3px rgba(255, 0, 0, 0.7)';
                } else if (value > 90) {
                    // Green highlight for very high
                    wrapperElement.style.boxShadow = '0 0 8px 3px rgba(0, 255, 0, 0.7)';
                }
            }
        });
    }

    // Initialize the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();