// ==UserScript==
// @name         GamerLee Auto Flow
// @namespace    https://gamerlee.com/
// @version      1.2
// @author       Rubystance
// @license      MIT
// @match        https://gamerlee.com/*
// @grant        none
// @description Automatically logs in and claims DGB, LTC and others.
// @downloadURL https://update.greasyfork.org/scripts/545878/GamerLee%20Auto%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/545878/GamerLee%20Auto%20Flow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const WALLET_EMAIL = "YOUR_FAUCETPAY_EMAIL_HERE"; // << YOUR_FAUCETPAY_EMAIL
    const REF_LINK = "https://gamerlee.com/?r=22589";

    if (location.origin === "https://gamerlee.com" &&
        location.pathname === "/" &&
        !location.search.includes("r=22589")) {
        location.replace(REF_LINK);
        return;
    }

    function waitFor(selector, cb, interval = 500) {
        const t = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(t);
                cb(el);
            }
        }, interval);
    }

    const url = location.href;

    if (url.startsWith("https://gamerlee.com/") && !url.includes("/app/")) {
        waitFor('input[name="wallet"]', input => {
            input.value = WALLET_EMAIL;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        waitFor('.iconcaptcha-modal__body-title', title => {
            const obs = new MutationObserver(() => {
                if (title.textContent.includes("Verification complete")) {
                    document.querySelector('button[type="submit"]')?.click();
                    obs.disconnect();
                }
            });
            obs.observe(title, { childList: true, subtree: true });
        });
    }

    if (url === "https://gamerlee.com/app/dashboard") {
        waitFor('a[href*="faucet?currency=DOGE"]', a => a.click());
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
