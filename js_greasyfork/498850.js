// ==UserScript==
// @name         almasat.net
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  almasat
// @author       LTW
// @license      none
// @match        https://almasat.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=almasat.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498850/almasatnet.user.js
// @updateURL https://update.greasyfork.org/scripts/498850/almasatnet.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const email = '';
  const password = '';
  const redirectUrl = 'https://almasat.net/faucet';


  if (window.location.href.includes("/dashboard")) {
    window.location.href = 'https://almasat.net/faucet';
  }

  if (window.location.href === "https://almasat.net/" || window.location.href === "https://almasat.net") {
    window.location.href = "https://almasat.net/login";
  }

  function checkForDailyLimitReached() {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached, claim from Shortlink Wall to earn energy')) {
        window.location.href = redirectUrl;
      }
    });
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
