// ==UserScript==
// @name         coinhirek.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  coinhirek
// @author       LTW
// @license      none
// @match        https://coinhirek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinhirek.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499023/coinhirekcom.user.js
// @updateURL https://update.greasyfork.org/scripts/499023/coinhirekcom.meta.js
// ==/UserScript==

(function() {
  'use strict';
    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;} else  {
  const email = '';
  const password = '';
  const redirectUrl = 'https://coinhirek.com/app/faucet';
  const timerRedirect = false;

  if (window.location.href.includes("/dashboard")) {
    window.location.href = 'https://coinhirek.com/app/faucet';
  }

  if (window.location.href === "https://coinhirek.com/" || window.location.href === "https://coinhirek.com") {
    window.location.href = "https://coinhirek.com/app/login";
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

if (window.location.href.includes("/login")) {
    const fillLoginForm = () => {
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');

        if (emailField && passwordField) {
            emailField.value = email;
            passwordField.value = password;
        }

        function calcularExpressao() {
            const labels = document.querySelectorAll('.form-label');
            labels.forEach(label => {
                const texto = label.innerText;
                const expressaoMatch = texto.match(/\d+\+\d+/);

                if (expressaoMatch) {
                    const expressao = expressaoMatch[0];
                    const resultado = eval(expressao);
                    const inputId = label.getAttribute('for');
                    const input = document.getElementById(inputId);
                    if (input) {
                        input.value = resultado;
                    } else {
                    }
                } else {
                }
            });
        }

        calcularExpressao();

        setTimeout(() => {
            const loginButton = document.querySelector('.btn.btn-primary.mt-3.mb-3');
            if (loginButton) {
                loginButton.click();
            } else {
                console.error('Botão de login não encontrado.');
            }
        }, 3000);
    };

    fillLoginForm();
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
    if (window.location.href.includes("/faucet") && !wasButtonClicked() && grecaptcha && grecaptcha.getResponse().length !== 0) {
      const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
      if (submitButton) {
        setButtonClicked();
        submitButton.click();
      }
    }
  }, 3000);
        }
})();
