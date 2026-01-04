// ==UserScript==
// @name         ChillFaucet - Auto Login & Claim LTC.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically login and claim LTC after solving IconCaptcha. ICON CAPTCHA ON MY TELEGRAM CHANNEL.
// @author       Rubystance
// @license      MIT
// @match        https://chillfaucet.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544010/ChillFaucet%20-%20Auto%20Login%20%20Claim%20LTC.user.js
// @updateURL https://update.greasyfork.org/scripts/544010/ChillFaucet%20-%20Auto%20Login%20%20Claim%20LTC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const faucetPayEmail = "YOUR_FAUCETPAY_EMAIL_HERE"; // ← Replace with your FaucetPay email
    const loginUrl = "https://chillfaucet.in/";
    const claimUrl = "https://chillfaucet.in/app/faucet?currency=DOGE";
    const maxClaims = 30;
    const storageKey = "chillfaucet_ltc_claim_count";

    function isCaptchaVerified() {
        const captchaTitle = document.querySelector('.iconcaptcha-modal__body-title');
        return captchaTitle && captchaTitle.textContent.includes('Verification complete');
    }

    function getClaimCount() {
        return parseInt(localStorage.getItem(storageKey) || "0", 10);
    }

    function incrementClaimCount() {
        const current = getClaimCount();
        localStorage.setItem(storageKey, current + 1);
    }

    function resetClaimCount() {
        localStorage.removeItem(storageKey);
    }

    if (location.href === loginUrl) {
        const emailInput = document.querySelector('input[name="wallet"]');
        const loginButton = document.querySelector('button.btn.btn-primary[type="submit"]');

        if (emailInput && loginButton) {
            emailInput.value = faucetPayEmail;

            const loginCheck = setInterval(() => {
                if (isCaptchaVerified()) {
                    clearInterval(loginCheck);
                    console.log('[AutoLogin] IconCaptcha solved. Logging in...');
                    loginButton.click();
                } else {
                    console.log('[AutoLogin] Waiting for IconCaptcha...');
                }
            }, 1000);
        }
    }

    if (location.href.includes("/app") && !location.href.includes("currency=DOGE")) {
        const ltcLink = document.querySelector('a[href="/app/faucet?currency=DOGE"]');
        if (ltcLink) {
            console.log('[AutoClaim] Redirecting to LTC claim page...');
            location.href = ltcLink.href;
        }
    }

    if (location.href === claimUrl) {
        const claimsDone = getClaimCount();
        console.log(`[AutoClaim] Claims used: ${claimsDone}/${maxClaims}`);

        if (claimsDone >= maxClaims) {
            console.warn("[AutoClaim] Claim limit reached. No more actions will be taken.");
            return;
        }

        const claimWatcher = setInterval(() => {
            if (isCaptchaVerified()) {
                const claimButton = document.querySelector('button.claim-button.step4');
                if (claimButton) {
                    clearInterval(claimWatcher);
                    console.log('[AutoClaim] IconCaptcha solved. Collecting reward...');
                    incrementClaimCount();
                    claimButton.click();
                }
            } else {
                console.log('[AutoClaim] Waiting for IconCaptcha...');
            }
        }, 1000);
    }
})();
