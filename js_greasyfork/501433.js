// ==UserScript==
// @name        automate snaptik
// @namespace   Violentmonkey Scripts
// @match       https://snaptik.app/en1*
// @grant       none
// @version     1.0
// @author      minnieo
// @description 7/21/2024, 8:25:33 PM
// @downloadURL https://update.greasyfork.org/scripts/501433/automate%20snaptik.user.js
// @updateURL https://update.greasyfork.org/scripts/501433/automate%20snaptik.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to programmatically click a button
    function clickButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.click();
        }
    }

    // Initial click on the paste button with a delay
    setTimeout(() => {
        clickButton('button.button-paste');
    }, 500); // Adjust the delay as needed

       setTimeout(() => {
        clickButton('button.button-go');
    }, 550); // Adjust the delay as needed

    // Create a mutation observer to detect navigation and click the download button
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Click the download button if it appears
                clickButton('a.button.download-file');
            }
        });
    });

    // Observe changes in the body element
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();