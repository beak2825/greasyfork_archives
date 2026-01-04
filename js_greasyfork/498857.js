// ==UserScript==
// @name         123faucet.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  123faucet
// @author       LTW
// @match        https://123faucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123faucet.com
// @license      none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498857/123faucetcom.user.js
// @updateURL https://update.greasyfork.org/scripts/498857/123faucetcom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const email = '';
  const password = '';
  const redirectUrl = 'https://123faucet.com/ptc';
  let redirecionamentoptc = "https://123faucet.com/faucet"; // Substitua com o URL desejado
  const timerRedirect = false;

  if (window.location.href.includes("/dashboard")) {
    window.location.href = 'https://123faucet.com/faucet';
  }

  if (window.location.href === "https://123faucet.com/" || window.location.href === "https://123faucet.com") {
    window.location.href = "https://123faucet.com/login";
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
  window.onload = function() {
    checkForDailyLimitReached();
  };
  if (window.location.href === 'https://123faucet.com/ptc') {
setTimeout(function() {
    let buttons = document.querySelectorAll('button');
    let button = Array.from(buttons).find(el => el.textContent.trim() === 'Go');
    if (button) {
        button.click();
    } else {
        window.location.href = redirecionamentoptc;
    }
}, 3000);
}
if (window.location.href.includes("/ptc/view")) {
(() => {
    setInterval(function() {
        let reCaptchaResponse = "";
        let hCaptchaResponse = "";

        const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
        if (reCaptchaTextarea) {
            reCaptchaResponse = reCaptchaTextarea.value;
        }

        if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
            }
        }
    }, 3000);
})();
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

  setInterval(function() {
    if (window.location.href.includes("/faucet") && !wasButtonClicked() && isAntiBotLinksValid() && grecaptcha && grecaptcha.getResponse().length !== 0) {
      const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
      if (submitButton) {
        setButtonClicked();
        submitButton.click();
      }
    }
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
