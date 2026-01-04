// ==UserScript==
// @name         Hatecoin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto login e coleta faucet
// @author       White
// @match        https://hatecoin.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hatecoin.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476032/Hatecoin.user.js
// @updateURL https://update.greasyfork.org/scripts/476032/Hatecoin.meta.js
// ==/UserScript==
(function() {
  'use strict';
  if (window.location.href.includes("/dashboard")) {
    window.location.href = "https://hatecoin.me/faucet";
  }
if (window.location.href == "https://hatecoin.me/" || window.location.href == "https://hatecoin.me") {
    window.location.href = "https://hatecoin.me/login";
  }
    if (window.location.href.includes("/login")) {
  const email = 'email';
  const senha = 'senha';

  const fillLoginForm = () => {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    if (emailField && passwordField) {
      emailField.value = email;
      passwordField.value = senha;

      setTimeout(() => {
        const logInButton = document.querySelector('button.btn.btn-primary.btn-block.waves-effect.waves-light[type="submit"]');
        logInButton.click();
      }, 3000);
    }
  };

  const checkAndClick = () => {
    const grecaptchaResponse = (window.grecaptcha && window.grecaptcha.getResponse) ? window.grecaptcha.getResponse() : null;

    if (grecaptchaResponse && grecaptchaResponse.length > 0) {
      fillLoginForm();
    }
  };

  const intervalId = setInterval(checkAndClick, 3000);
}

  function mbsolver() {
    const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
    return valorAntibotlinks.length === 12;
  }

  setInterval(function() {
    const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
    const grecaptchaResponse = (window.grecaptcha && window.grecaptcha.getResponse) ? window.grecaptcha.getResponse() : null;

    if (window.location.href.includes("/faucet") && grecaptchaResponse && grecaptchaResponse.length > 0 && mbsolver()) {
      const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
      if (submitButton) {
        submitButton.click();
      }
    }
  }, 3000);
})();