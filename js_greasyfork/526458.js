// ==UserScript==
// @name         Remove Google Classroom Loading Bar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically removes the glitched loading bar stuck at the top of google classroom
// @match        https://classroom.google.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526458/Remove%20Google%20Classroom%20Loading%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/526458/Remove%20Google%20Classroom%20Loading%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to start the MutationObserver once the target element is available
    function startObserver() {
        const targetNode = document.querySelector("#kO001e");

        // Check if the targetNode exists before starting observation
        if (targetNode) {
            const observer = new MutationObserver((mutationsList, observer) => {
                // Look for the element you want to remove within the target node
                const element = targetNode.querySelector("div.a6pJXc.Q6ApZc.aTtRxf");
                if (element) {
                    element.remove();
                    console.log("Element removed!");
                }
            });

            // Start observing the target node for changes in its children (and subtree)
            observer.observe(targetNode, {
                childList: true,
                subtree: true  // Observe changes within all descendants of #kO001e
            });
        } else {
            // Retry after 500ms if the target element is not found yet
            setTimeout(startObserver, 500);
        }
    }

    // Start the observer process
    startObserver();

})();