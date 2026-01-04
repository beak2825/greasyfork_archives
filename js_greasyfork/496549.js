// ==UserScript==
// @name         Robux Display Modifier
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modify displayed robux amount to "20M" instead of "39" on page refresh for Roblox.com
// @author       Your Name
// @match        https://www.roblox.com/*
// @grant        none
// @license MIT`
// @downloadURL https://update.greasyfork.org/scripts/496549/Robux%20Display%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/496549/Robux%20Display%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify the robux amount
    function modifyRobuxAmount() {
        // Select the element containing the robux amount
        var robuxAmountElement = document.querySelector("#nav-robux-amount");

        // Check if the element exists
        if (robuxAmountElement) {
            // Change the text content to "20M+"
            robuxAmountElement.textContent = "20M+";
        }
    }

    // Call the function when the DOM is fully loaded
    window.addEventListener("load", modifyRobuxAmount);
})();