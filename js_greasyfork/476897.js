// ==UserScript==
// @name         UgeenIPTV Countdown Skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skips countdown timers on certain websites
// @author       LynX
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=3rabsports.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476897/UgeenIPTV%20Countdown%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/476897/UgeenIPTV%20Countdown%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enable the button if it's disabled
    function enableButtonIfDisabled() {
        var nextButton = document.getElementById('nextbutton');
        if (nextButton && nextButton.disabled) {
            nextButton.disabled = false;
            console.log("Next button enabled.");
        }
    }

    // Function to skip countdown timer
    function skipTimer() {
        var nextButton = document.getElementById('nextbutton');
        if (nextButton && !nextButton.disabled) {
            nextButton.click();
            console.log("Timer skipped");
        } else {
            console.log("Next button not found or disabled.");
        }
    }

    // Immediately enable the button if it's disabled
    enableButtonIfDisabled();
    
    // Skip the timer immediately
    skipTimer();
})();
