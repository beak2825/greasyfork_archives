// ==UserScript==
// @name         Faucet Auto Clicker - Feyorra
// @namespace    https://feyorra.site/
// @version      1.0
// @description  Automatically clicks the CAPTCHA checkbox and the claim button when ready.
// @author       Rubystance
// @license      MIT
// @match        https://feyorra.site/member/faucet
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545870/Faucet%20Auto%20Clicker%20-%20Feyorra.user.js
// @updateURL https://update.greasyfork.org/scripts/545870/Faucet%20Auto%20Clicker%20-%20Feyorra.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForElement(selector, callback, interval = 500, timeout = 15000) {
        const start = Date.now();
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback(el);
            } else if (Date.now() - start > timeout) {
                clearInterval(timer);
                console.warn(`[!] Element not found: ${selector}`);
            }
        }, interval);
    }

    function isButtonClickable(button) {
        const style = window.getComputedStyle(button);
        return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            !button.disabled &&
            button.offsetParent !== null
        );
    }

    waitForElement('#verifyCheckbox', (checkbox) => {
        if (!checkbox.checked) {
            checkbox.click();
            console.log('[✓] Checkbox clicked.');
        } else {
            console.log('[✓] Checkbox already checked.');
        }

        const checkCaptchaInterval = setInterval(() => {
            if (checkbox.checked) {
                console.log('[✓] CAPTCHA solved.');

                const claimInterval = setInterval(() => {
                    const btn = document.querySelector('#ClaimBtn');
                    if (btn && isButtonClickable(btn)) {
                        btn.click();
                        console.log('[✓] Claim button clicked.');
                        clearInterval(claimInterval);
                    } else {
                        console.log('[...] Waiting for Claim button to become available...');
                    }
                }, 1000);

                clearInterval(checkCaptchaInterval);
            } else {
                console.log('[...] Waiting for CAPTCHA to be solved...');
            }
        }, 1000);
    });
})();
