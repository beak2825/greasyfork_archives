// ==UserScript==
// @name         zoomfaucet.com Auto Login and Claim
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto Login and Claim for zoomfaucet.com
// @author       White
// @match        https://zoomfaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zoomfaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477207/zoomfaucetcom%20Auto%20Login%20and%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/477207/zoomfaucetcom%20Auto%20Login%20and%20Claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const clickElement = (selector) => {
        const element = document.querySelector(selector);
        element && element.click();
    };

    const setValue = (selector, value) => {
        const element = document.querySelector(selector);
        element && (element.value = value);
    };

    const autoLogin = async () => {
        clickElement('a[type="button"][data-toggle="modal"][data-target="#login"]');
        await delay(2000);
        setValue('input[type="email"][name="wallet"].form-control', 'youremaill@example.com');
        await delay(2000);
        clickElement('button[type="submit"].d-flex.align-items-center.btn.btn-outline.border.text-secondary');
    };

    const autoClaim = () => {
        clickElement('a[href="https://zoomfaucet.com/faucet/currency/ltc"].d-flex.align-items-center.btn.btn-outline.border.text-primary');
    };

    const autoClaimLTC = async () => {
        while (true) {
            if (window.location.href.includes('https://zoomfaucet.com/faucet/currency/ltc')) {
                await delay(3000);
                const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]');
                if (turnstileResponseInput && turnstileResponseInput.value.trim()) {
                    await delay(2000);
                    clickElement('#subbutt.btn.btn-primary');
                    break;
                }
            } else {
                await delay(2000);
                autoClaimLTC();
            }
        }
    };

    window.addEventListener('load', async () => {
        await delay(2000);
        autoLogin();
        autoClaim();
        autoClaimLTC();
    });

})();
