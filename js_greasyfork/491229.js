// ==UserScript==
// @name         SHEIN自动点击“下一条”
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Automatically click through popups on https://sso.geiwohuo.com/, including new popup
// @author       Your Name
// @match        https://sso.geiwohuo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491229/SHEIN%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E4%B8%8B%E4%B8%80%E6%9D%A1%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/491229/SHEIN%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E4%B8%8B%E4%B8%80%E6%9D%A1%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the button with the specified attributes
    function clickButton(ariaLabel, title) {
        // Find the button using the provided aria-label and title
        let buttons = document.querySelectorAll(`button[aria-label="${ariaLabel}"][title="${title}"].so-button.so-button-primary`);
        // Click the button if it is found
        for (let button of buttons) {
            button.click();
        }
    }

    // Set an interval to try and click the buttons every 500 milliseconds (0.5 second)
    setInterval(function() {
        // Click the "Next" buttons
        clickButton('Next', 'Next');
        // Click the new "Last" button
        clickButton('Last', 'Last');
    }, 500);
})();
