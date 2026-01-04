// ==UserScript==
// @name         gwaher.com/
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gwaher
// @author       LTW
// @match        https://gwaher.com/*
// @license      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gwaher.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499485/gwahercom.user.js
// @updateURL https://update.greasyfork.org/scripts/499485/gwahercom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const email = '';
  const password = '';
  const redirectUrl = '';
  const timerRedirect = true;

    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;} else  {
  if (window.location.href.includes("/ptc")) {
    window.location.href = 'https://gwaher.com/faucet';
  }

  if (window.location.href === "https://gwaher.com/" || window.location.href === "https://gwaher.com") {
    window.location.href = "https://gwaher.com/login";
  }

  function checkForDailyLimitReached() {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached')) {
        window.location.href = redirectUrl;
      }
    });
  }

const minuteElement = document.getElementById('minute');
      if(timerRedirect){

if (minuteElement && !isNaN(parseInt(minuteElement.textContent))) {
  const minuteValue = parseInt(minuteElement.textContent);
  if (minuteValue > 1) {
    window.location.href = redirectUrl;
  }
}}


      if (window.location.href.includes("/login")) {
         setTimeout(function () {
    document.getElementById("email").value = email;
    document.getElementById("password").value = password;
  }, 5000);
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
if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
            const logInButton = document.querySelector('[type="submit"]');
            if (logInButton) {
                logInButton.click();
            }
    };
     setInterval(checkAndClick, 5000);
   }
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
  }, 120000);
  window.onload = function() {
    checkForDailyLimitReached();
  };
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

    if (window.location.href.includes("/faucet") && !wasButtonClicked()) {
      const submitButton = document.querySelector('[type="submit"]');
      if (submitButton) {
        setButtonClicked();
        submitButton.click();
      }
    }
}
  }, 3000);
}
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
