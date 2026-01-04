// ==UserScript==
// @name         EarnCryptoWRS Auto Faucet
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Fills email and ONLY submits after IconCaptcha is truly solved + 10s delay on faucet
// @author       Rubystance
// @license      MIT
// @match        https://earncryptowrs.in/*
// @match        https://earncryptowrs.in/app/dashboard*
// @match        https://earncryptowrs.in/app/faucet*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545872/EarnCryptoWRS%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/545872/EarnCryptoWRS%20Auto%20Faucet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const WALLET_EMAIL = 'YOUR_FAUCETPAY_EMAIL_HERE'; // << YOUR FAUCETPAY EMAIL

    function waitUntil(checkFn, okFn, interval = 700) {
        const t = setInterval(() => {
            try {
                if (checkFn()) {
                    clearInterval(t);
                    okFn();
                }
            } catch (_) {}
        }, interval);
    }

    function iconCaptchaSolved() {
        const tokenInputs = document.querySelectorAll(
            'input[type="hidden"][name*="captcha"], input[type="hidden"][name*="icon"]'
        );
        const tokenReady = [...tokenInputs].some(i => i.value && i.value.length > 10);

        const successClass =
            document.querySelector('.iconcaptcha-success') ||
            document.querySelector('[data-ic-status="success"]');

        const submitBtn = document.querySelector('button[type="submit"], input[type="submit"]');
        const btnEnabled = submitBtn &&
            !submitBtn.disabled &&
            !submitBtn.classList.contains('disabled');

        return (tokenReady || successClass) && btnEnabled;
    }

    if (location.pathname === '/') {

        waitUntil(
            () => document.querySelector('input[name="wallet"]'),
            () => {
                const input = document.querySelector('input[name="wallet"]');
                input.value = WALLET_EMAIL;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        );

        waitUntil(
            () => document.querySelector('form'),
            () => {
                const form = document.querySelector('form');
                console.log('[Auto] Waiting for IconCaptcha (LOGIN)…');

                waitUntil(
                    () => iconCaptchaSolved(),
                    () => {
                        console.log('[Auto] IconCaptcha solved → submitting LOGIN');
                        setTimeout(() => form.submit(), 800);
                    },
                    900
                );
            }
        );
    }

    if (location.pathname === '/app/dashboard') {
        waitUntil(
            () => document.querySelector('a[href*="currency=DOGE"]'),
            () => {
                document.querySelector('a[href*="currency=DOGE"]').click();
            }
        );
    }

    if (location.pathname.includes('/app/faucet')) {

        waitUntil(
            () => document.querySelector('form'),
            () => {
                const form = document.querySelector('form');
                console.log('[Auto] Waiting for IconCaptcha (FAUCET)…');

                waitUntil(
                    () => iconCaptchaSolved(),
                    () => {
                        console.log('[Auto] IconCaptcha solved → waiting 10 seconds…');

                        setTimeout(() => {
                            console.log('[Auto] 10 seconds passed → submitting FAUCET');
                            form.submit();
                        }, 10000);
                    },
                    900
                );
            }
        );
    }

})();
