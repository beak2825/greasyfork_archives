// ==UserScript==
// @name         Udemy Progress Percentage
// @namespace    https://greasyfork.org/en/users/1444872-tlbstation
// @version      1.0
// @description  Adds percentage of completion to Udemy progress text
// @author       TLBSTATION
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529743/Udemy%20Progress%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/529743/Udemy%20Progress%20Percentage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to calculate percentage and update the text
    function updateProgress() {
        // Select the element with the progress text
        const progressElement = document.querySelector('.ud-heading-sm');

        if (progressElement) {
            const text = progressElement.textContent.trim();

            // Match the format "X of Y complete."
            const match = text.match(/^(\d+) of (\d+) complete\.$/);

            if (match) {
                const completed = parseInt(match[1], 10);
                const total = parseInt(match[2], 10);

                // Calculate the percentage
                const percentage = ((completed / total) * 100).toFixed(1);

                // Update the text with the percentage
                progressElement.textContent = `${completed} of ${total} (${percentage}%) complete.`;
            }
        }
    }

    // Run the function when the page loads
    window.addEventListener('load', updateProgress);

    // Optional: Run periodically in case the element is dynamically updated
    setInterval(updateProgress, 1000);
})();
