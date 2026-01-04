// ==UserScript==
// @name         Claim Faucet Linksfly
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto claim
// @author       nubiebot
// @match        https://linksfly.link/app/faucet*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540987/Claim%20Faucet%20Linksfly.user.js
// @updateURL https://update.greasyfork.org/scripts/540987/Claim%20Faucet%20Linksfly.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let alreadyClicked = false;
    let goClaimClicked = false;
    let alreadyReloaded = false;

    function simulateClick(elem) {
        const evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        elem.dispatchEvent(evt);
    }

    const checkInterval = setInterval(() => {
        const errorTitle = document.querySelector('.iconcaptcha-modal__body-title');
        const errorText = errorTitle?.textContent.trim();
        if (errorText === 'Uh oh.' && !alreadyReloaded) {
            alreadyReloaded = true;
            setTimeout(() => {
                location.reload();
            }, 1000);
            return;
        }
        const isCaptchaSuccess = errorText === 'Verification complete.';
        const claimBtn = document.querySelector('button.claim-button.step4');

        if (isCaptchaSuccess && claimBtn && !alreadyClicked) {
            alreadyClicked = true;
            claimBtn.removeAttribute('disabled');
            setTimeout(() => {
                simulateClick(claimBtn);
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
