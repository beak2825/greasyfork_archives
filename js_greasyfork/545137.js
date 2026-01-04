// ==UserScript==
// @name         Lemehost - Auto Extend Server Time
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Automatically clicks the 'Extend time' button on the Lemehost free server plan page every 10 minutes.
// @author       motoe moto
// @match        https://lemehost.com/server/*/free_plan
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545137/Lemehost%20-%20Auto%20Extend%20Server%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/545137/Lemehost%20-%20Auto%20Extend%20Server%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Time in milliseconds. 10 minutes = 10 * 60 * 1000 = 600000 ms.
    const CLICK_INTERVAL = 600000;

    function findAndClickExtendButton() {
        // This selector looks for an <a> tag that has "extend_time=1" in its href attribute.
        // This is a reliable way to find the specific button you want to click.
        const extendButton = document.querySelector('a[href*="extend_time=1"]');

        if (extendButton) {
            console.log('Lemehost Auto-Extend: "Extend time" button found. Clicking it now.');
            extendButton.click();
        } else {
            console.log('Lemehost Auto-Extend: "Extend time" button not found on the page.');
        }
    }

    console.log('Lemehost Auto-Extend script is active. It will try to click the button every 10 minutes.');

    // Set the script to run the function at the specified interval.
    setInterval(findAndClickExtendButton, CLICK_INTERVAL);

    // Optional: Run the function once immediately when the page loads
    // so you don't have to wait for the first 10-minute interval.
    setTimeout(findAndClickExtendButton, 3000); // Wait 3 seconds for the page to fully load.

})();