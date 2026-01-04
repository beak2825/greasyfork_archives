// ==UserScript==
// @name         GitHub SSO Auto-Continue
// @namespace    GitHub Scripts
// @description Add extra copy buttons into pull request pages.
// @version      1.0
// @description  Automatically clicks the "Continue" button during GitHub SSO login
// @run-at       document-idle
// @match        *://github.com/framgia/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/533187/GitHub%20SSO%20Auto-Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/533187/GitHub%20SSO%20Auto-Continue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to click the button when found
    function clickContinueButton() {
        const button = document.querySelector('button[type="submit"], button[data-optimizely-event="sso_continue_button"]');
        if (button) {
            console.log("GitHub SSO Auto-Continue: Clicking the Continue button.");
            button.click();
        } else {
            console.log("GitHub SSO Auto-Continue: Button not found. Retrying...");
            setTimeout(clickContinueButton, 500); // Retry until it appears
        }
    }

    // Wait for DOM to be ready
    window.addEventListener('load', clickContinueButton);
})();
