// ==UserScript==
// @name         Claim Faucet Earnsolana
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto claim
// @author       nubiebot
// @match        https://earnsolana.xyz/faucet/currency/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540986/Claim%20Faucet%20Earnsolana.user.js
// @updateURL https://update.greasyfork.org/scripts/540986/Claim%20Faucet%20Earnsolana.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let alreadyWaiting = false;
    let goClaimClicked = false;

    const checkInterval = setInterval(() => {
        const claimBtn = document.querySelector('#subbutt');
        const successImage = [...document.querySelectorAll('img')]
            .find(img => img.src.includes('/assets/images/success.png'));

        const buttonEnabled = claimBtn && !claimBtn.disabled;
        const extVerified = !!successImage;

        if (claimBtn && buttonEnabled && extVerified && !alreadyWaiting) {
            alreadyWaiting = true;

            setTimeout(() => {
                claimBtn.click();

                const form = document.querySelector('#fauform');
                if (form) {
                    form.submit();
                }
            }, 5000);
        }

        const goClaimBtn = [...document.querySelectorAll('.next-button a.btn.btn-primary')]
            .find(el => el.textContent.trim().toLowerCase() === 'go claim');

        if (goClaimBtn && !goClaimClicked) {
            goClaimClicked = true;
            goClaimBtn.click();
        }

    }, 1000);
})();
