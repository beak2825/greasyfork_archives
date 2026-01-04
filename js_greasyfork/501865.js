// ==UserScript==
// @name         claimcoin.in
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  claimcoin
// @author       LTW
// @license      none
// @match        https://claimcoin.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimcoin.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501865/claimcoinin.user.js
// @updateURL https://update.greasyfork.org/scripts/501865/claimcoinin.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const email = '';
  const senha = '';
  const redirecionamento = '';

if (window.location.href == "https://claimcoin.in/dashboard") {
    window.location.href = "https://claimcoin.in/madfaucet";
  }
if (window.location.href == "https://claimcoin.in/" || window.location.href == "https://claimcoin.in") {
    window.location.href = "https://claimcoin.in/login";
  }
    function checkForDailyLimitReached() {

    var textElements = document.querySelectorAll('body *');

    textElements.forEach(function(element) {

        if (element.textContent.includes('Daily limit reached')) {

       window.location.href = redirecionamento;
        }
    });
}

setTimeout(function(){
    checkForDailyLimitReached();
},3000);
  if (window.location.href.includes("/login")) {
    const fillLoginForm = () => {
      const emailField = document.getElementById('email');
      const passwordField = document.getElementById('password');

      if (emailField && passwordField) {
        emailField.value = email;
        passwordField.value = senha;
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
        window.location.href = redirecionamento;
    }
  function mbsolver() {
    const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
    return valorAntibotlinks.length === 12;
  }
  setTimeout(function () {
            location.reload();
        }, 180000);
  setInterval(function() {
    const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');

    if (window.location.href.includes("/madfaucet") && !wasButtonClicked() && mbsolver()) {
      const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
      if (submitButton) {
        submitButton.click();
          setButtonClicked();
      }
    }
  }, 3000);
})();