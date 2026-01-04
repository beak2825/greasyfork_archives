// ==UserScript==
// @name         Highlight Hourly Rates on Prolific 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight hourly rates based on their values.
// @author       You
// @match        *://*/*
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/471227/Highlight%20Hourly%20Rates%20on%20Prolific.user.js
// @updateURL https://update.greasyfork.org/scripts/471227/Highlight%20Hourly%20Rates%20on%20Prolific.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the numeric value from the string like "£8.16/hr"
    function extractHourlyRate(text) {
        return parseFloat(text.match(/[\d.]+/));
    }

    // Function to apply the appropriate background color to the element
    function highlightElement(element) {
        const rate = extractHourlyRate(element.textContent);
        if (rate <= 7.79) {
            element.style.backgroundColor = 'red';
        } else if (rate >= 7.80 && rate <= 9.50) {
            element.style.backgroundColor = 'yellow';
        } else if (rate >= 9.51) {
            element.style.backgroundColor = 'green';
        }
        // Set the font color to black
        element.style.color = 'black';
    }

    // Function to process all elements with class="amount"
    function highlightHourlyRates() {
        const elements = document.getElementsByClassName('amount');
        for (const element of elements) {
            // Check if the element should be ignored
            if (element.getAttribute('data-testid') === 'study-tag-reward') {
                continue;
            }
            highlightElement(element);
        }
    }

    // Run the highlighting on page load
    highlightHourlyRates();

    // Observe the DOM for changes and re-run the highlighting if necessary
    const observer = new MutationObserver(() => {
        highlightHourlyRates();
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();


