// ==UserScript==
// @name         coinarns.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  coinarns
// @author       LTW
// @license      none
// @match        https://coinarns.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinarns.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498984/coinarnscom.user.js
// @updateURL https://update.greasyfork.org/scripts/498984/coinarnscom.meta.js
// ==/UserScript==

(function() {
  'use strict';
    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;} else  {
  const email = '';
  const password = '';
  const redirectUrlFaucet = 'https://coinarns.com/madfaucet';
  const redirectUrlMadFaucet = 'https://coinarns.com/faucet';
  const redirectUrlPTC = '';
  const timerRedirectFaucet = false;
  const timerRedirectMadFaucet = false;


  if (window.location.href.includes("/dashboard")) {
    window.location.href = 'https://coinarns.com/faucet';
  }

  if (window.location.href === "https://coinarns.com/" || window.location.href === "https://coinarns.com") {
    window.location.href = "https://coinarns.com/login";
  }

  function checkForDailyLimitReached() {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached')) {
          if(window.location.href.includes('/faucet')){

        window.location.href = redirectUrlFaucet;
          }
      }
    });
  }
if(timerRedirectMadFaucet){
if(window.location.href.includes('/madfaucet')){
if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
  const minuteValue = parseInt(minuteElement.textContent);
  if (minuteValue > 1) {
    window.location.href = redirectUrlMadFaucet;
  }}}}
const minuteElement = document.getElementById('minute');
      if(timerRedirectFaucet){

if(window.location.href.includes('/faucet')){

if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
  const minuteValue = parseInt(minuteElement.textContent);
  if (minuteValue > 1) {
    window.location.href = redirectUrlFaucet;
  }
}}
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
if(window.location.href.includes('/faucet')){
  if (wasButtonClicked()) {
    removeButtonClicked();
    window.location.href = redirectUrlFaucet;
  }
}
if(window.location.href.includes('/madfaucet')){
  if (wasButtonClicked()) {
    removeButtonClicked();
    window.location.href = redirectUrlMadFaucet;
  }
}
  function isAntiBotLinksValid() {
    const antibotlinksValue = document.getElementById('antibotlinks').value.replace(/\s/g, '');
    return antibotlinksValue.length === 12;
  }

  setTimeout(function() {
    location.reload();
  }, 160000);
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
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                    setButtonClicked();
                }
            }
        }
    }, 3000);
    }
})();
  if (window.location.href === 'https://coinarns.com/ptc') {
setTimeout(function() {
    let buttons = document.querySelectorAll('button');
    let button = Array.from(buttons).find(el => el.textContent.trim() === 'Watch');
    if (button) {
        button.click();
    } else {
        window.location.href = redirectUrlPTC;
    }
}, 3000);
}
(() => {
if (window.location.href.includes("/ptc/view")) {

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

}
})();