// ==UserScript==
// @name         ❤️ Petpet Happiness Percentage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display happiness progress percentage text below the progress bar.
// @author       AshyAsh
// @match        https://www.grundos.cafe/neopetpet/?neopet_name=*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/492462/%E2%9D%A4%EF%B8%8F%20Petpet%20Happiness%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/492462/%E2%9D%A4%EF%B8%8F%20Petpet%20Happiness%20Percentage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add percentage text under the progress bar
    function addPercentageText() {
        // Find the progress element by ID
        var progressElement = document.getElementById('happy_percent');
        if (progressElement) {
            var percentage = progressElement.title; // Get the percentage from the title attribute

            // Create a new div element to display the percentage
            var displayElement = document.createElement('div');
            displayElement.innerText = 'Progress: ' + percentage;

            // Insert the new div right after the progress element
            progressElement.parentNode.insertBefore(displayElement, progressElement.nextSibling);
        }
    }

    // Run the function
    addPercentageText();
})();
