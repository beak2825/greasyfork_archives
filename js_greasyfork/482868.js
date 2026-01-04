// ==UserScript==
// @name         eeework.com Element Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block specified elements and modify class attribute on eeework.com
// @match        http://eeework.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482868/eeeworkcom%20Element%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/482868/eeeworkcom%20Element%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current site is eeework.com
    if (window.location.hostname === 'eeework.com') {
        // Find the first specified element by its CSS selector
        var overlayElement = document.querySelector("#app > div.v-overlay.v-overlay--active.theme--dark");
        // Find the second specified element by its CSS selector
        var dialogContentElement = document.querySelector("#app > div.v-dialog__content.v-dialog__content--active");

        // If the overlay element exists, hide it
        if (overlayElement) {
            overlayElement.style.display = "none";
        }

        // If the dialog content element exists, hide it
        if (dialogContentElement) {
            dialogContentElement.style.display = "none";
        }

        // Modify the class attribute of the specified element
        var mainElement = document.querySelector("html");
        if (mainElement) {
            // Check if the class attribute contains "overflow-y-hidden"
            if (mainElement.classList.contains("overflow-y-hidden")) {
                // Remove the "overflow-y-hidden" class
                mainElement.classList.remove("overflow-y-hidden");
            }
            // Add an empty class if the attribute doesn't exist
            else {
                mainElement.classList.add("");
            }
        }
         // Allow scrolling
        document.body.style.overflow = "auto";
    }
})();