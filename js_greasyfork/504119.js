// ==UserScript==
// @name           99faucet.com,astrorunner.net,bitcoi.news,98faucet.com Unlimited Faucet
// @namespace      auto click unlimited faucet
// @version        0.4
// @description    Automatically clicks the "Claim Now" button when reCAPTCHA or gpCAPTCHA is solved and the button is enabled, and clicks "View Now", "Verify", and "OK" buttons if present. Also scrolls smoothly to the center of the page if CAPTCHA is found.
// @author         Ojo Ngono
// @match          https://98faucet.com/*
// @match          https://99faucet.com/*
// @match          https://bitcoi.news/*
// @match          https://astrorunner.net/*
// @grant          none
// @license        Copyright OjoNgono
// @downloadURL https://update.greasyfork.org/scripts/504119/99faucetcom%2Castrorunnernet%2Cbitcoinews%2C98faucetcom%20Unlimited%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/504119/99faucetcom%2Castrorunnernet%2Cbitcoinews%2C98faucetcom%20Unlimited%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const smoothScrollToCenter = () => {
        const body = document.body;
        const html = document.documentElement;
        const centerY = (window.innerHeight || html.clientHeight) / 2;

        window.scrollTo({
            top: centerY,
            behavior: 'smooth'
        });
    };

    const checkClaimButton = () => {
        const claimInterval = setInterval(() => {
            const captchaResponse = document.querySelector('[name="g-recaptcha-response"], [name="captcha_choosen"]');
            const claimButton = document.querySelector('.claim-button');

            if (captchaResponse) smoothScrollToCenter();
            if (claimButton && captchaResponse && captchaResponse.value.length > 0 && !claimButton.disabled) {
                claimButton.click();
                clearInterval(claimInterval);
            }
        }, 1000);
    };

    const clickViewNowButton = () => {
        let viewNowButton = document.querySelector('button.clbtn.w-100.text-white, button.claim-btn.w-100.text-white');

        if (viewNowButton && viewNowButton.textContent.includes('View Now')) {
            viewNowButton.click();
        }
    };

    const checkVerifyButton = () => {
        const verifyInterval = setInterval(() => {
            const captchaResponse = document.querySelector('[name="g-recaptcha-response"], [name="captcha_choosen"]');
            const verifyButton = document.querySelector('button#verify.btn.btn-success.btn-block');
            const ptcCountdown = document.querySelector('#ptcCountdown');

            if (captchaResponse) smoothScrollToCenter();
            if (verifyButton && captchaResponse && captchaResponse.value.length > 0 && !verifyButton.disabled) {
                if (ptcCountdown && ptcCountdown.textContent.trim() === '0 second') {
                    verifyButton.click();
                    clearInterval(verifyInterval);
                }
            }
        }, 1000);
    };

    const clickOkButton = () => {
        const okInterval = setInterval(() => {
            const okButton = document.querySelector('button.swal2-confirm.swal2-styled');

            if (okButton) {
                okButton.click();
                clearInterval(okInterval);
            }
        }, 1000);
    };

    checkClaimButton();
    clickViewNowButton();
    checkVerifyButton();
    clickOkButton();
})();
