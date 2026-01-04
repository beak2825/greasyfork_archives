// ==UserScript==
// @name         Sleep And earn
// @namespace    http://tampermonkey.net/
// @version      2024-03-26
// @description  try to take over the world!
// @author       LTW
// @match        https://sleepandearn.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sleepandearn.online
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/492104/Sleep%20And%20earn.user.js
// @updateURL https://update.greasyfork.org/scripts/492104/Sleep%20And%20earn.meta.js
// ==/UserScript==

(async function () {
    'use strict';


    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);
    const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');

if (window.location.href === 'https://sleepandearn.online/account/summary' || window.location.href === 'https://sleepandearn.online/account/summary/') {
            window.location.href = 'https://sleepandearn.online/account/money/claims';
        }

    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

    if (wasButtonClicked()) {
        setTimeout(function () {
        removeButtonClicked();
        window.location.href = 'https://claimercorner.xyz/web/faucet';
     }, 3000);
    }
     const checkAndClaim = async () => {

    if (window.location.href.includes("/claims") && grecaptcha && grecaptcha.getResponse().length !== 0 && !wasButtonClicked()) {
            await sleep(1000);
            document.querySelector('.faucet_btn.btn.bg-gradient-warning.w-100.mt-4.mb-0').click();
            setButtonClicked();
        }
};
        setTimeout(function () {location.reload();}, 180000);
    setInterval(async () => {
        await checkAndClaim();
    }, 3000);
        if (window.location.href.includes("firewall")) {
        let firewall = setInterval(function() {
            let recaptchav3 = document.querySelector("input#recaptchav3Token");
            let hcaptcha = document.querySelector('.h-captcha > iframe');
            let turnstile = document.querySelector('.cf-turnstile > input');
            let boton = document.querySelector('button[type="submit"].btn.btn-primary.w-md');

            if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
                boton.click();
                clearInterval(firewall);
            }
        }, 3000);
    }

})();