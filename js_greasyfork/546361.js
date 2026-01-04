// ==UserScript==
// @name         AWS China SSO Login Auto Confirm
// @description  Clicks the "Confirm and continue" button automatically when running `aws sso login`
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @match        https://*.awsapps.com/*
// @match        https://*.awsapps.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546361/AWS%20China%20SSO%20Login%20Auto%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/546361/AWS%20China%20SSO%20Login%20Auto%20Confirm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonTexts = ['Confirm and continue', 'Allow access', 'Allow'];

    function clickButton() {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            const text = btn.textContent;
            if (buttonTexts.some(btnText => text.includes(btnText))) {
                btn.click();
                return;
            }
        }
    }

    clickButton();
    new MutationObserver(clickButton).observe(document.body, { childList: true, subtree: true });
})();