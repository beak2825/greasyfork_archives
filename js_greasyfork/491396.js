// ==UserScript==
// @name         TEMU自动点击下一条
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically click through popups on https://seller.kuajingmaihuo.com/ including the final 'I have read' popup
// @author       Your Name
// @match        https://seller.kuajingmaihuo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491396/TEMU%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E4%B8%8B%E4%B8%80%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/491396/TEMU%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E4%B8%8B%E4%B8%80%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to click buttons with specific text
    function clickPopupButtons(buttonText) {
        // Find all buttons with the specific class that might be used in popups
        let buttons = document.querySelectorAll('button.BTN_outerWrapperBtn_5-109-0');
        // Iterate over the buttons and click the one with the matching text
        buttons.forEach(function(button) {
            if (button.textContent.includes(buttonText)) {
                button.click();
            }
        });
    }

    // Set an interval to try and click the buttons every 500 milliseconds (0.5 second)
    setInterval(function() {
        // Click the 'Next' button
        clickPopupButtons('下一条');
        // Click the 'I have read' button, which is the new popup button
        clickPopupButtons('我已阅读');
    }, 500);
})();
