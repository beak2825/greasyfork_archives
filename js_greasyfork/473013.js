// ==UserScript==
// @name         YouTube Continue Button Clicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically press continue on Suicide, self-harm, and eating disorders videos
// @author       Deyzze
// @match        https://www.youtube.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473013/YouTube%20Continue%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/473013/YouTube%20Continue%20Button%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickContinueButton() {
        const continueButton = document.querySelector('button.yt-spec-button-shape-next--filled');
        if (continueButton) {
            continueButton.click();
        }
    }

    function waitForPageLoad() {
        if (document.readyState === 'complete') {
            // Page is fully loaded, execute the script
            clickContinueButton();
        } else {
            // Wait and check again after a short delay
            setTimeout(waitForPageLoad, 100);
        }
    }

    // Start waiting for the page to load
    waitForPageLoad();
})();
