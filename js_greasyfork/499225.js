// ==UserScript==
// @name         freebinance.top (btc)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  freebinance (btc)
// @author       LTW
// @license      none
// @match        https://freebinance.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebinance.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499225/freebinancetop%20%28btc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499225/freebinancetop%20%28btc%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const email = '';
  const password = '';
  const wallet = ''; // carteira faucetpay
  const redirectUrlCrypto = ''; // redirecionamento após a /crypto/faucet
  const redirectUrl = ''; //redirecionamento após a faucet original
  const timerRedirect = false;

    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;} else {

  if (window.location.href.includes("/dashboard")) {
    window.location.href = window.location.href.replace('/dashboard', '/faucet');
  }
  if (window.location.href === "https://freebinance.top/") {
    window.location.href = "https://freebinance.top/login";
  }
  if (window.location.href === "https://freebinance.top/crypto/") {
    window.location.href = "https://freebinance.top/crypto/login";
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
    if (window.location.href === "https://freebinance.top/links") {
        if (e()) {
            window.location.href = window.location.href.replace('/links', '/faucet');
            return;
        }
        setTimeout(function() {
            var links = [
                'https://freebinance.top/links/go/119',
                'https://freebinance.top/links/go/215'
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
        }, 1000);
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
        const ptcCountdown = document.getElementById("ptcCountdown");

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
      if(window.location.href.includes('/crypto')){
    removeButtonClicked();
    window.location.href = redirectUrlCrypto;
  } else {
    removeButtonClicked();
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

    if (inputElement) {
        inputElement.value = wallet;
    }
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