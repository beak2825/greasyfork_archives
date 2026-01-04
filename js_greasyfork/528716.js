// ==UserScript==
// @name         AWS CLI - Auto Click "Confirm and Continue"
// @namespace    http://tampermonkey.net/
// @version      2024-11-27
// @description  Automatically clicks the "Confirm and Continue" button when it becomes available.
// @author       You
// @match        https://d-9a67274801.awsapps.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazonaws.com
// @grant        none
// @run-at       document-idle
// @licence      MIT
// @downloadURL https://update.greasyfork.org/scripts/528716/AWS%20CLI%20-%20Auto%20Click%20%22Confirm%20and%20Continue%22.user.js
// @updateURL https://update.greasyfork.org/scripts/528716/AWS%20CLI%20-%20Auto%20Click%20%22Confirm%20and%20Continue%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonSelector = "#cli_verification_btn";

    // Function to check and click the button
    function clickButton() {
        const button = document.querySelector(buttonSelector);
        if (button) {
            console.log("Button found, clicking now...");
            button.click();
        }
    }

    // Use a MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(() => {
        clickButton();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the function initially in case the button is already present
    clickButton();
})();