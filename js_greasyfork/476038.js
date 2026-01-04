// ==UserScript==
// @name         BigPay
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  auto login, faucet e shortlink 
// @author       White
// @match        https://cryptobigpay.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptobigpay.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476038/BigPay.user.js
// @updateURL https://update.greasyfork.org/scripts/476038/BigPay.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (window.location.href.includes("/dashboard")) {
    window.location.href = "https://cryptobigpay.online/faucet";
  }
if (window.location.href == "https://cryptobigpay.online/" || window.location.href == "https://cryptobigpay.online") {
    window.location.href = "https://cryptobigpay.online/login";
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
    }
  };

  let buttonClicked = false;

  const checkAndClick = () => {
    const grecaptchaResponse = (window.grecaptcha && window.grecaptcha.getResponse) ? window.grecaptcha.getResponse() : null;

    if (grecaptchaResponse && grecaptchaResponse.length > 0 && !buttonClicked) {
      const logInButton = document.querySelector('button.btn.btn-primary.btn-block.waves-effect.waves-light[type="submit"]');
      if (logInButton) {
        logInButton.click();
        buttonClicked = true;
      }
    }
  }
  };

let hasClicked = false;

function mbsolver() {
  const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
  return valorAntibotlinks.length === 12;
}
function wasButtonClicked() {
  return localStorage.getItem('buttonClicked') === 'true';
}

function setButtonClicked() {
  localStorage.setItem('buttonClicked', 'true');
}

function removeButtonClicked() {
  localStorage.removeItem('buttonClicked');
}

if (wasButtonClicked()) {
  removeButtonClicked();
  window.location.href = 'https://cryptobigpay.online/faucet';
}

setInterval(function() {
  const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
  const grecaptchaResponse = (window.grecaptcha && window.grecaptcha.getResponse) ? window.grecaptcha.getResponse() : null;

  if (window.location.href.includes("/faucet") && grecaptchaResponse && grecaptchaResponse.length > 0 && mbsolver() && !wasButtonClicked()) {
    const submitButton = document.querySelector('button.btn.btn-primary.btn-lg.claim-button');
    if (submitButton) {
      submitButton.click();
      setButtonClicked();
    }
  }
}, 3000);
setInterval(function() {
    const targetText = "0/100";
    const pElements = document.querySelectorAll('p.lh-1.mb-1.font-weight-bold');

    pElements.forEach(pElement => {
        const textContent = pElement.textContent.trim();

        if (textContent.endsWith(targetText)) {
            window.close();
        }
    });
}, 3000);

    setTimeout(function() {
    if (window.location.href.includes("/links")) {
        setTimeout(function() {
            var buttons = document.querySelectorAll('a.btn.btn-primary.waves-effect.waves-light.a1');

            var targetHrefs = [
                'https://cryptobigpay.online/links/go/76',
                'https://cryptobigpay.online/links/go/75',
                'https://cryptobigpay.online/links/go/74',
                'https://cryptobigpay.online/links/go/69',
                'https://cryptobigpay.online/links/go/78'
            ];

            var buttonFound = false;

            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                var href = button.getAttribute('href');
                var buttonText = button.innerText;

                if (targetHrefs.includes(href) && !buttonText.includes('0/3')) {
                    console.log('Found href:', href);

                    window.location.href = href;

                    buttonFound = true;
                    break;
                }
            }

            if (!buttonFound) {
                window.location.href = 'https://cryptobigpay.online/faucet';
            }
        }, 3000);
    }
}, 3000);
    if (window.location.href.includes("firewall")) {
        let firewall = setInterval(function() {
            let recaptchav3 = document.querySelector("input#recaptchav3Token");
            let hcaptcha = document.querySelector('.h-captcha > iframe');
            let turnstile = document.querySelector('.cf-turnstile > input');
            let boton = document.querySelector("button[type='submit'].btn.btn-primary.w-md.a1");
            if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
                boton.click();
                clearInterval(firewall);
            }
        }, 5000);
    }
})();
