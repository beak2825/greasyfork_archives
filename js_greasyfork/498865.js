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
// @downloadURL https://update.greasyfork.org/scripts/498865/Tartaria%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/498865/Tartaria%20Faucet.meta.js
// ==/UserScript==


(async function () {
    'use strict';

    const email = '';
    const senha = '';
    const redirecionamento = '';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);
    const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');
if (window.location.href === 'https://tartaria-faucet.net/' || window.location.href === 'https://tartaria-faucet.net') {
            window.location.href = 'https://tartaria-faucet.net/login';
        }
if (window.location.href === 'https://tartaria-faucet.net/dashboard' || window.location.href === 'https://tartaria-faucet.net/dashboard/') {
            window.location.href = 'https://tartaria-faucet.net/faucet';
        }
    const waitForElement = async (selector) => {
        while (!document.querySelector(selector)) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    };

    const preencherCampos = async () => {
        const [emailInput, passwordInput] = await Promise.all([waitForElement('#email'), waitForElement('#password')]);

        if (emailInput && passwordInput) {
            emailInput.value = email;
            passwordInput.value = senha;

    const submitButton = document.querySelector("button[type='submit']");
    setInterval(() => grecaptcha && grecaptcha.getResponse().length !== 0 && submitButton?.click(), 5000);}

    };

        if (window.location.href.includes('/login')) {
            await preencherCampos();
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
  if (window.location.href.includes("/faucet")) {
await sleep(2000);
 dialog.showModal();
}
     const checkAndClaim = async () => {
        if (window.location.href.includes("/faucet") && grecaptcha && grecaptcha.getResponse().length !== 0 && mbsolver() && !wasButtonClicked()) {
            await sleep(3000);
            var button = document.querySelector('button[type="submit"]');

if (button) {
    button.click();
}

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