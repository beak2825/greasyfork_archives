// ==UserScript==
// @name         claimcoin
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  claimcoin autoclaim faucet & madfaucet
// @author       iewilmaestro
// @license      Copyright iewilmaestro
// @match        *://claimcoin.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimcoin.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522488/claimcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/522488/claimcoin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback, interval = 500) {
        const check = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(check);
                callback(el);
            }
        }, interval);
    }
    waitForElement('#layout-wrapper > div.main-content > div > div > div:nth-child(4) > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > form > button', collectBtn => {
        const captchaCheck = setInterval(() => {
            const captchaResponse = document.querySelector('input[name="recaptchav3"]');
            if (captchaResponse && captchaResponse.value.trim().length > 0) {

                if (!collectBtn.disabled) {
                    collectBtn.click();
                    console.log("Collect Your Reward clicked!");
                } else {
                    console.log("Button still disabled, will retry...");
                }
                clearInterval(captchaCheck);
            }
        }, 8000);
    });
})();