// ==UserScript==
// @name         freesolana.top
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  freesolana
// @author       LTW
// @license      none
// @match        https://freesolana.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freesolana.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499223/freesolanatop.user.js
// @updateURL https://update.greasyfork.org/scripts/499223/freesolanatop.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const email = '';
  const password = '';
  const wallet = ''; //email faucetpay
  const redirectUrl = ''; // após faucet original
  const redirectUrlBitcoin = ''; // após faucet /bitcoin
  const redirectUrlSolana = ''; // após faucet /solana
  const timerRedirect = false;

    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;} else {


  if (window.location.href.includes("/dashboard")) {
    window.location.href = window.location.href.replace('/dashboard', '/faucet');
  }
  if (window.location.href === "https://freesolana.top/bitcoin/" || window.location.href === "https://freesolana.top/bitcoin") {
    window.location.href = "https://freesolana.top/bitcoin/login";
  }
   if (window.location.href === "https://freesolana.top/solana/" || window.location.href === "https://freesolana.top/solana") {
    window.location.href = "https://freesolana.top/solana/login";
  }
  if (window.location.href === "https://freesolana.top/" || window.location.href === "https://freesolana.top") {
    window.location.href = "https://freesolana.top/login";
  }

  function checkForDailyLimitReached() {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached')) {
        window.location.href = redirectUrl;
      }
    });
  }
const e = () => {
    const value = localStorage.getItem('f');
    return value === '0';
};
const b = () => localStorage.setItem('f', '2');
const a = () => localStorage.setItem('f', '1');
const c = () => {
  let currentValue = parseInt(localStorage.getItem('f')) || 0;
  let newValue = currentValue - 1;
  localStorage.setItem('f', newValue);
};
if (window.location.href.indexOf("faucet") > -1) {
    var alertWarnings = document.querySelectorAll('.alert.alert-warning');
    alertWarnings.forEach(function(alert) {
        if (alert.textContent.includes('You need to claim at least 1 shortlink to claim faucet.')) {
            a();
              window.location.href = window.location.href.replace('/faucet', '/links');
        }
    });
}

setTimeout(function() {
    if (window.location.href.includes("/links")) {
        if (e()) {
            window.location.href = window.location.href.replace('/links', '/faucet');
            return;
        }
        setTimeout(function() {
            var links = [
                'https://freesolana.top/links/go/314',
                'https://freesolana.top/links/go/2',
                'https://freesolana.top/bitcoin/links/go/1',
                'https://freesolana.top/solana/links/go/1'
            ];

            var linkFound = false;

            for (var i = 0; i < links.length; i++) {
                var link = document.querySelector('a[href="' + links[i] + '"]');
                if (link) {
                    c();
                    window.location.href = link.href;
                    linkFound = true;
                    break;
                }
            }

            if (!linkFound) {
                window.location.href = redirectUrl;
            }
        }, 2000);
    }
}, 1000);

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
      if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
          const logInButton = document.querySelector('[type="submit"]');
          logInButton.click();
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
  if (window.location.href.includes('/solana/')) {
    window.location.href = redirectUrlSolana;
  } else if (window.location.href.includes('/bitcoin/')) {
    window.location.href = redirectUrlBitcoin;
  } else {
    window.location.href = redirectUrl;
  }
}


  function isAntiBotLinksValid() {
    const antibotlinksValue = document.getElementById('antibotlinks').value.replace(/\s/g, '');
    return antibotlinksValue.length === 12;
  }

  setTimeout(function() {
    location.reload();
  }, 360000);

  setInterval(function() {
    if (inputElement) {
     inputElement.value = wallet;
    }
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
    if (window.location.href.includes("/faucet") && !wasButtonClicked() && isAntiBotLinksValid()) {
   var inputElement = document.querySelector('input[name="wallet"]');

      const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
      if (submitButton) {
        setButtonClicked();
        submitButton.click();
      }
    }
   }
 }, 3000);
}
})();