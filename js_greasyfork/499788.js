// ==UserScript==
// @name         cryptifo.com
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  crtptifo
// @author       LTW
// @license      none
// @match        https://cryptifo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptifo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499788/cryptifocom.user.js
// @updateURL https://update.greasyfork.org/scripts/499788/cryptifocom.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const redirecionamento = '';
    const email = '';
    const senha = '';


const pageTitle = document.title.toLowerCase();
if (pageTitle.includes('just a moment') || pageTitle.includes('um momento')) {return;}else{

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);
    const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');
if (window.location.href === 'https://cryptifo.com/') {
window.location.href = 'https://cryptifo.com/login';}
if (window.location.href === 'https://cryptifo.com/dashboard') {
window.location.href = 'https://cryptifo.com/faucet';}

(() => {
    if(window.location.href.includes('/login')) {
        setTimeout(function () {
            document.getElementById("email").value = email;
            document.getElementById("password").value = senha;
        }, 3000);

        let buttonClicked = false;

        setInterval(function() {
            let reCaptchaResponse = "";
            let hCaptchaResponse = "";

            const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
            const hCaptchaTextarea = document.querySelector('textarea[name="h-captcha-response"]');

            if (reCaptchaTextarea) {
                reCaptchaResponse = reCaptchaTextarea.value;
            }

            if (hCaptchaTextarea) {
                hCaptchaResponse = hCaptchaTextarea.value;
            }

            if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
                if (!buttonClicked) {
                    const submitButton = document.querySelector('button[type="submit"]');
                    if (submitButton && !submitButton.disabled) {
                        submitButton.click();
                        buttonClicked = true;
                    }
                }
            }
        }, 3000);
    }
})();

    const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;
    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

    if (wasButtonClicked()) {
        setTimeout(function () {
        removeButtonClicked();
       window.location.href = redirecionamento;
     }, 2000);
    }
if (window.location.href.includes("/faucet")){await sleep(3000);var buttons = document.querySelectorAll('button[data-target="#exampleModal"]'); if (buttons.length > 0) {buttons[0].click();}}
     const checkAndClaim = async () => {
       let reCaptchaResponse = "";
        let hCaptchaResponse = "";

        const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
        const hCaptchaTextarea = document.querySelector('textarea[name="h-captcha-response"]');

        if (reCaptchaTextarea) {
            reCaptchaResponse = reCaptchaTextarea.value;
        }

        if (hCaptchaTextarea) {
            hCaptchaResponse = hCaptchaTextarea.value;
        }
         if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
        if (window.location.href.includes("/faucet") && mbsolver() && !wasButtonClicked()) {
            await sleep(3000);
            select('.btn.btn-primary.btn-lg.claim-button.waves-effect.waves-float.waves-light')?.click();
            setButtonClicked();
        }
         }
    };
    setTimeout(function () {location.reload();}, 160000);
    setInterval(async () => {await checkAndClaim();}, 3000);
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


})();