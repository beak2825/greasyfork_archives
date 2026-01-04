// ==UserScript==
// @name         LinksFly Auto Flow
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Autofill wallet, wait for IconCaptcha & Cloudflare Turnstile solve, then continue
// @author       Rubystance
// @license      MIT
// @match        https://linksfly.link/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545880/LinksFly%20Auto%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/545880/LinksFly%20Auto%20Flow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const WALLET_EMAIL = "YOUR_FAUCETPAY_EMAIL_HERE"; // << YOUR_FAUCETPAY_EMAIL
    const REFERRAL_LINK = "https://linksfly.link/?r=19456";

    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function autofillWallet() {
        const input = document.querySelector('input[name="wallet"]');
        if (input && !input.value) {
            input.value = WALLET_EMAIL;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function waitForIconCaptchaSolved() {
        const observer = new MutationObserver(() => {
            const solved = document.querySelector('.iconcaptcha-success');
            if (solved) {
                observer.disconnect();
                const loginBtn = document.querySelector('button[type="submit"]');
                if (loginBtn) {
                    loginBtn.click();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function clickClaimDOGE() {
        const dogeLink = document.querySelector('a[href*="currency=DOGE"]');
        if (dogeLink) {
            dogeLink.click();
        }
    }

    const url = location.href;

    if (url === "https://linksfly.link/" || url.includes("/login")) {
        if (!url.includes("?r=")) {

            window.location.href = REFERRAL_LINK;
        } else {
            autofillWallet();
            waitForIconCaptchaSolved();
        }
    }

    if (url.includes("/app/dashboard")) {
        waitForElement('a[href*="currency=DOGE"]', clickClaimDOGE);
    }

    if (url.includes("/app/faucet?currency=DOGE")) {
        const checkTurnstile = setInterval(() => {
            const token =
                document.querySelector('input[name="cf-turnstile-response"]') ||
                document.querySelector('textarea[name="cf-turnstile-response"]');

            if (token && token.value && token.value.length > 20) {
                const btn = document.querySelector('button.claim-button.step4');
                if (btn) btn.click();
                clearInterval(checkTurnstile);
            }
        }, 1000);
    }

})();
