// ==UserScript==
// @name         Inoreader - Back Button Override
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Overrides the back button to press a specific link instead.
// @author       Threeskimo
// @match        https://www.inoreader.com/*
// @grant        none
// @icon         https://www.inoreader.com/favicon.ico?v=8
// @downloadURL https://update.greasyfork.org/scripts/525112/Inoreader%20-%20Back%20Button%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/525112/Inoreader%20-%20Back%20Button%20Override.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Replace the back button behavior entirely
    window.addEventListener('popstate', function (event) {
        //console.log("Back button intercepted.");

        const closeButton = document.getElementById("close-article-mobile");

        if (closeButton) {
            //console.log("Triggering close button action.");

            // Call the onclick handler directly, if defined
            if (closeButton.onclick) {
                closeButton.onclick();
                //console.log("Executed onclick handler.");
            } else {
                // Simulate a click if no onclick handler exists
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                closeButton.dispatchEvent(event);
                //console.log("Manually dispatched click event.");
            }
        } else {
            console.log("Close button not found. Stopping back navigation.");
        }

        // Prevent the default back navigation
        history.pushState(null, document.title, location.href);
    });

    // Ensure a dummy state is added to the history to allow interception
    window.history.pushState(null, document.title, location.href);
})();
