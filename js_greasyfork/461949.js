// ==UserScript==
// @name         Loop Claim Sato.Host
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Claims on Sato.host if it has funds https://sato.host/?r=corecrafting
// @author       satology
// @match        https://sato.host/page/dashboard*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sato.host
// @require      https://greasyfork.org/scripts/461948-fbase-lib/code/FBase%20Lib.js?version=1162272
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461949/Loop%20Claim%20SatoHost.user.js
// @updateURL https://update.greasyfork.org/scripts/461949/Loop%20Claim%20SatoHost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.body.innerText.includes('not have sufficient funds')) {
        console.log('out of funds');
        // if out of funds, we'll wait for a while to let's remove the hcaptcha in the meantime to prevent
        // solving loops
        document.querySelectorAll('iframe').forEach(iframe => iframe.remove());
        setTimeout(() => location.reload(), 22 * 60 * 1000);
        return;
    }
    let loop = setInterval(() => {
        let captcha = new HCaptchaWidget();
        let button = document.querySelector('input[type="submit"][value="Claim From Faucet"],input[type="submit"][name="claim"]');
        if (captcha && captcha.isUserFriendly) {
            clearInterval(loop);
            captcha.isSolved().then(() => { button.click(); });
        }
    }, 60 * 1000 + 15);

    // a refresh if the claim button is not there after 15 seconds
    setTimeout(() => {
        let button = document.querySelector('input[type="submit"][value="Claim From Faucet"],input[type="submit"][name="claim"]');
        if (!button) {
            location.reload();
        }
    }, 15 * 1000);

    // a refresh after 2 minutes, in case it doesn't claim for some reason
    setTimeout(() => { location.reload(); }, 120 * 1000);
})();