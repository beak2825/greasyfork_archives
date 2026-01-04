// ==UserScript==
// @name         AD-doge Faucet
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tries to take over the world!
// @author       White
// @match        https://ad-doge.com/member/faucet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ad-doge.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481039/AD-doge%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/481039/AD-doge%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitForCaptchaAndClaim = async () => {
        await waitForPageLoad();

        const turnstile = await waitForTurnstile();

        const claimDiv = document.querySelector('div[align="center"]');
        if (claimDiv) {
            await delay(5000);
            triggerClaimButtonClick();

            setTimeout(triggerSecondButtonClick, 3000);
        }
    };

    const waitForTurnstile = async () => {
        let turnstile;
        while (!(turnstile && turnstile.value.length > 0)) {
            turnstile = document.querySelector('.cf-turnstile > input');
            await delay(100);
        }
        return turnstile;
    };

    const triggerClaimButtonClick = () => {
        const claimButton = document.querySelector('.tg-btn-1.text-white');
        if (claimButton) {
            claimButton.click();
        }
    };

    const triggerSecondButtonClick = () => {
        const secondButton = document.getElementById('mybutton');
        if (secondButton) {
            secondButton.click();
        }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const waitForPageLoad = () => {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    };

    waitForCaptchaAndClaim();
})();
