// ==UserScript==
// @name         AWS CLI - Auto Click "Allow Access"
// @namespace    http://tampermonkey.net/
// @version      2025-03-04
// @description  Automatically clicks the "Allow Access" button when it becomes available.
// @author       You
// @match        https://d-9a67274801.awsapps.com/start/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=awsapps.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528717/AWS%20CLI%20-%20Auto%20Click%20%22Allow%20Access%22.user.js
// @updateURL https://update.greasyfork.org/scripts/528717/AWS%20CLI%20-%20Auto%20Click%20%22Allow%20Access%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and click the button
    function clickAllowAccessButton() {
        const button = document.querySelector('[data-testid="allow-access-button"]');

        if (button) {
            console.log("Allow Access button found, clicking now...");
            button.click();
            // Close the tab after 2 seconds
            setTimeout(() => {
                window.close()
            }, 2000);
        }
    }

    // Use a MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(() => {
        clickAllowAccessButton();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the function initially in case the button is already present
    clickAllowAccessButton();
})();