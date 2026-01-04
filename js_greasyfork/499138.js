// ==UserScript==
// @name         speedrun Update Filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ччч
// @author       ZV
// @match        *://*/Admin/MyCurrentTask/UpdateImage*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499138/speedrun%20Update%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/499138/speedrun%20Update%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check for the "Update Picture Filter" text and click the Cancel button
    function checkAndClickCancelButton() {
        if (document.body.textContent.includes('Update Picture Filter')) {
            let cancelButton = document.getElementById('cancelSubmitButton');
            if (cancelButton) {
                cancelButton.click();
                observer.disconnect(); // Stop observing after clicking the button
            }
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(checkAndClickCancelButton);

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case the elements are already present
    checkAndClickCancelButton();
})();