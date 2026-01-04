// ==UserScript==
// @name         Claimercorner
// @namespace    http://tampermonkey.net/
// @version      2024-04-13
// @description  Try to take over the world!
// @author       You
// @match        https://claimercorner.xyz/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimercorner.xyz
// @license      none
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/492107/Claimercorner.user.js
// @updateURL https://update.greasyfork.org/scripts/492107/Claimercorner.meta.js
// ==/UserScript==

(async function () {
    'use strict';
const pageTitle = document.title.toLowerCase();
            if (pageTitle.includes('just a moment') || pageTitle.includes('um momento')) {
                console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
                return;
            }
            setTimeout(function () {
                if (!pageTitle.includes('just a moment') || !pageTitle.includes('um momento')) {
var email = ""
var senha = ""
var redirecionamento = "https://sleepandearn.online/account/money/claims"
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);
    const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');

if (window.location.href === 'https://claimercorner.xyz/web/dashboard' || window.location.href === 'https://claimercorner.xyz/web/dashboard/') {
            window.location.href = 'https://claimercorner.xyz/web/faucet';
        }
if (window.location.href === 'https://claimercorner.xyz/web' || window.location.href === 'https://claimercorner.xyz/web/') {
            window.location.href = 'https://claimercorner.xyz/web/login';
        }
    const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;

    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

    if (wasButtonClicked()) {
        setTimeout(function () {
        removeButtonClicked();
       window.location.href = redirecionamento;
     }, 1000);
    }
if (window.location.href.includes("/login")) {
document.getElementById("email").value = email;
document.getElementById("password").value = senha;
    }
    if (window.location.href.includes("/login")) {
        setTimeout(function () {
document.getElementById("email").value = email;
document.getElementById("password").value = senha;
            let buttonClicked = false;

            const checkAndClick = () => {
                if (!buttonClicked && grecaptcha && grecaptcha.getResponse().length !== 0) {
                    const logInButton = document.querySelector('button[type="submit"]');
                    if (logInButton && logInButton.textContent.trim() === "Log In") {
                        logInButton.click();
                        buttonClicked = true;
                    }
                }
                setTimeout(checkAndClick, 1000);
            };

            setTimeout(checkAndClick, 3000);
        }, 2000);
    }
     const checkAndClaim = async () => {
        if (window.location.href.includes("/faucet") && grecaptcha && grecaptcha.getResponse().length !== 0 && mbsolver() && !wasButtonClicked()) {
            await sleep(3000);
            select('.btn.btn-primary.btn-lg.claim-button')?.click();
            setButtonClicked();
        }
    };
    setTimeout(function () {location.reload();}, 160000);
    setInterval(async () => {
        await checkAndClaim();
    }, 5000);
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
        }, 5000);
    }
  }
}, 3000);
function checkInputAndClickButton() {
    const adcopyInput = document.querySelector('input[name="adcopy_response"]');
    if (adcopyInput && adcopyInput.value.trim() !== '') {
        let boton = document.querySelector('button[type="submit"].btn.btn-primary.w-md');
        boton.click();
    }
}
setInterval(checkInputAndClickButton, 3000);
})();
