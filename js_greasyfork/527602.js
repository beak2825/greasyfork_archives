// ==UserScript==
// @name         Zyn Rewards Auto Submit
// @namespace    https://github.com/zimmra/zyn-rewards-autosubmit
// @version      0.4
// @license      MIT
// @description  Automatically clicks a specific button on the Zyn site for rewards submission.
// @author       zimmra
// @match        https://us.zyn.com/ZYNRewards/?serialNumber=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527602/Zyn%20Rewards%20Auto%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/527602/Zyn%20Rewards%20Auto%20Submit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to wait for the element to appear
    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 100);
    }

    // Unique selector for the button
    const buttonSelector = 'div.flex.relative.shadow-sm.h-64 button.btn.btn--primary.w-112[x-html="buttonLabel"]';

    // Wait for the button to appear and validate its state before clicking
    waitForElement(buttonSelector, (button) => {
        if (button && !button.disabled) {
            console.log('Clicking the button...');
            button.click();
        } else {
            console.log('Button is disabled or not found.');
        }
    });
})();
