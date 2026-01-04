// ==UserScript==
// @name         spinfaucet.ru
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  spinfaucet
// @author       LTW
// @license      none
// @match        https://spinfaucet.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spinfaucet.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500198/spinfaucetru.user.js
// @updateURL https://update.greasyfork.org/scripts/500198/spinfaucetru.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const email = '';
  const password = '';
  const redirectUrl = 'https://spinfaucet.ru/faucet';
  const timerRedirect = false;

  if (window.location.href.includes("/dashboard")) {
    window.location.href = 'https://spinfaucet.ru/faucet';
  }

  if (window.location.href === "https://spinfaucet.ru" || window.location.href === "https://spinfaucet.ru/") {
    window.location.href = "https://spinfaucet.ru/login";
  }

  function checkForDailyLimitReached() {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached')) {
        window.location.href = redirectUrl;
      }
    });
  }
if (timerRedirect === true){
const minuteElement = document.getElementById('minute');
if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
  const minuteValue = parseInt(minuteElement.textContent);
  if (minuteValue > 1) {
    window.location.href = redirectUrl;
  }
}
}
  window.onload = function() {
    checkForDailyLimitReached();
  };

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
      if (grecaptcha && grecaptcha.getResponse().length !== 0) {
        setTimeout(() => {
          const logInButton = document.querySelector('[type="submit"]');
          logInButton.click();
        }, 3000);
      }
      fillLoginForm();
    };

    setInterval(checkAndClick, 3000);
  }

  const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
  const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
  const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

  if (wasButtonClicked()) {
    removeButtonClicked();
    window.location.href = redirectUrl;
  }

  function isAntiBotLinksValid() {
    const antibotlinksValue = document.getElementById('antibotlinks').value.replace(/\s/g, '');
    return antibotlinksValue.length === 12;
  }

  setTimeout(function() {
    location.reload();
  }, 180000);

(() => {
    if(window.location.href.includes('/faucet') || window.location.href.includes('/madfaucet')){
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
})();