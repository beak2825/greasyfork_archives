// ==UserScript==
// @name         faucet-bit.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  faucet-bit
// @author       LTW
// @license      none
// @match        https://faucet-bit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucet-bit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499222/faucet-bitcom.user.js
// @updateURL https://update.greasyfork.org/scripts/499222/faucet-bitcom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const email = '';
  const password = '';
  const redirectUrl = 'https://faucet-bit.com/faucet';
  const timerRedirect = false;

  if (window.location.href.includes("/dashboard")) {
    window.location.href = 'https://faucet-bit.com/faucet';
  }

  if (window.location.href === "https://faucet-bit.com/" || window.location.href === "https://faucet-bit.com") {
    window.location.href = "https://faucet-bit.com/login";
  }

  function checkForDailyLimitReached() {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached')) {
        window.location.href = redirectUrl;
      }
    });
  }
  if (window.location.href.includes("/login")) {
    const fillLoginForm = () => {
      const emailField = document.getElementById('email');
      const passwordField = document.getElementById('password');

      if (emailField && passwordField) {
        emailField.value = email;
        passwordField.value = password;
      }
    };
    const checkAndClick = () => {
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
      if (reCaptchaResponse && reCaptchaResponse.length !== 0) {
        setTimeout(() => {
          const logInButton = document.querySelector('[type="submit"]');
          logInButton.click();
        }, 3000);
      }
    };
      fillLoginForm();
    setInterval(checkAndClick, 3000);
  }

  const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
  const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
  const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

  if (wasButtonClicked()) {
    removeButtonClicked();
    window.location.href = redirectUrl;
  }


  setTimeout(function() {
    location.reload();
  }, 120000);
(() => {
    if(window.location.href.includes('/faucet') || window.location.href.includes('/madfaucet')){
  function isAntiBotLinksValid() {
    const antibotlinksValue = document.getElementById('antibotlinks').value.replace(/\s/g, '');
    return antibotlinksValue.length === 12;
  }

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
            if (isAntiBotLinksValid() && !wasButtonClicked()) {
                const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                    setButtonClicked();
                }
            }
        }
    }, 3000);
    }
})();
checkForDailyLimitReached();
const minuteElement = document.getElementById('minute');
      if(timerRedirect){

if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
  const minuteValue = parseInt(minuteElement.textContent);
  if (minuteValue > 1) {
    window.location.href = redirectUrl;
  }
}}
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