// ==UserScript==
// @name        Foodpanda Restaurant Portal Styling
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Add yellow background color and a click-to-copy function to specific elements on the Foodpanda Restaurant Portal
// @author      xero
// @match       https://foodpanda.portal.restaurant/*
// @grant       GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472968/Foodpanda%20Restaurant%20Portal%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/472968/Foodpanda%20Restaurant%20Portal%20Styling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        GM_setClipboard(text);
    }

    // Observe a specific DOM element:
    var targetNode = document.body;

    // Options for the observer (which mutations to observe)
    var config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
        // Target elements with specific classes
        const paragraphElements = document.querySelectorAll('.MuiTypography-root.MuiTypography-paragraph-500');
        const headingElements = document.querySelectorAll('.MuiTypography-root.MuiTypography-heading2-700.css-t0w0m3');

        const elements = [...paragraphElements, ...headingElements];

        // Loop over each element
        elements.forEach((element) => {
            // Add yellow background color
            element.style.backgroundColor = 'yellow';

            // Add click event
            element.addEventListener('click', () => {
                // Copy text to clipboard
                copyToClipboard(element.textContent);
            });
        });
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
