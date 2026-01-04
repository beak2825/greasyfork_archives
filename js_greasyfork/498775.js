// ==UserScript==
// @name         Tartaria Faucet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tartaria
// @author       LTW
// @license      none
// @match        https://tartaria-faucet.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tartaria-faucet.net
// @grant        none
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/498775/Tartaria%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/498775/Tartaria%20Faucet.meta.js
// ==/UserScript==


(async function () {
    'use strict';

    const redirecionamento = '';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);
    const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');

if (window.location.href === 'https://tartaria-faucet.net/dashboard' || window.location.href === 'https://tartaria-faucet.net/dashboard/') {
            window.location.href = 'https://tartaria-faucet.net/faucet';
        }
    const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;

    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');
    const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]')
    if (wasButtonClicked()) {
        removeButtonClicked();
        window.location.href = redirecionamento;
    }
     const checkAndClaim = async () => {
        if (window.location.href.includes("/faucet") && grecaptcha && grecaptcha.getResponse().length !== 0 && mbsolver() && !wasButtonClicked()) {
            await sleep(3000);
            select('.btn-one.claim-button')?.click();
            setButtonClicked();
        }
    };
    setTimeout(function () {location.reload();}, 120000);
    setInterval(async () => {
        await checkAndClaim();
    }, 5000);

function checkForDailyLimitReached() {

    var textElements = document.querySelectorAll('body *');

    textElements.forEach(function(element) {

        if (element.textContent.includes('Daily limit reached')) {

       window.location.href = redirecionamento;
        }
    });
}

window.onload = function() {
    checkForDailyLimitReached();
};

        if (window.location.href.includes("firewall")) {
        let firewall = setInterval(function() {
            let recaptchav3 = document.querySelector("input#recaptchav3Token");
            let hcaptcha = document.querySelector('.h-captcha > iframe');
            let turnstile = document.querySelector('.cf-turnstile > input');
            let boton = document.querySelector("button[type='submit']");
            if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
                boton.click();
                clearInterval(firewall);
            }
        }, 5000);
    }
})();