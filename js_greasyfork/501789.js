// ==UserScript==
// @name         memearns.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  memearns
// @author       LTW
// @license      none
// @match        https://memearns.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=memearns.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501789/memearnscom.user.js
// @updateURL https://update.greasyfork.org/scripts/501789/memearnscom.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const email = '';
    const senha = '';
    const redirecionamento = '';
    const timeredirect = false;

if(timeredirect === true){
const minuteElement = document.getElementById('minute');

if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
  const minuteValue = parseInt(minuteElement.textContent);
  if (minuteValue > 1) {
    window.location.href = redirecionamento;
  }
}
}
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);
    const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');
if (window.location.href === 'https://memearns.com/' || window.location.href === 'https://memearns.com') {
            window.location.href = 'https://memearns.com/login';
}
if (window.location.href === 'https://memearns.com/dashboard') {
            window.location.href = 'https://memearns.com/faucet';
}
    const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;

    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

    if (wasButtonClicked()) {
        await sleep(2000);
        removeButtonClicked();
        window.location.href = redirecionamento;
    }

     const checkAndClaim = async () => {
        if (window.location.href.includes("/faucet") && grecaptcha && grecaptcha.getResponse().length !== 0 && mbsolver() && !wasButtonClicked()) {
            await sleep(1000);
            $('.btn.solid_btn.btn-lg.text-white.claim-button').click();
            setButtonClicked();
        }
    };
setTimeout(function () {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached')) {
        window.location.href = redirecionamento;
      }
    }); }, 3000);
    (() => {
    if(window.location.href.includes('/login')){
    setTimeout(function () {
    document.getElementById("email").value = email;
    document.getElementById("password").value = senha;
  }, 3000);
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
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                }
            }
    }, 3000);
    }
})();
setTimeout(function(){location.reload();},180000);
    setInterval(async () => {
        await checkAndClaim();
    }, 3000);
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