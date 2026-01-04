// ==UserScript==
// @name         CASHBUX.WORK
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  cashbux
// @author       SON
// @license      none
// @match        https://cashbux.work/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cashbux.work
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537377/CASHBUXWORK.user.js
// @updateURL https://update.greasyfork.org/scripts/537377/CASHBUXWORK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
      return; } else {

    let sonEML = ''; // coloque seu email aqui
    let sonPSW = ''; // coloque sua senha aqui
    let sonRDR = ''; // proximo site da rotação

      if (window.location.href === 'https://cashbux.work/') {
        setTimeout (() => {
            window.location.href = 'https://cashbux.work/login'
        }, 3000)
      }

        if (window.location.href === 'https://cashbux.work/login') {
        document.getElementById('email').value = sonEML
        document.getElementById('password').value = sonPSW
    }

        if (window.location.href === 'https://cashbux.work/login') {
        let sonTML = setInterval (() => {
            let sonBTL = document.querySelector('[class="btn btn-primary btn-block waves-effect waves-light"]')
            if (sonBTL && (window.turnstile.getResponse().length > 0)) {
                sonBTL.click()
                clearInterval(sonTML)
            }
        }, 3000)
        }

        if (window.location.href === 'https://cashbux.work/dashboard') {
        setTimeout (() => {
            window.location.href = 'https://cashbux.work/faucet'
        }, 3000)
    }

        if (window.location.href === 'https://cashbux.work/faucet') {
        let sonTMF = setInterval (() => {
            let sonBTF = document.querySelector('[class="btn btn-primary btn-lg claim-button"]')
            let sonABL = document.getElementById('antibotlinks')
            let sonTNT = document.querySelector('input[name="cf-turnstile-response"]')
            if ((sonBTF.textContent.trim() === 'Collect your reward') && sonTNT.value.trim() !== '' && sonABL.value.trim() !== '') {
                sonBTF.click()
                clearInterval(sonTMF);
            }
        }, 5000)
        }

        if (window.location.href === 'https://cashbux.work/faucet') {
        setTimeout (() => {
            let sonMIN = document.getElementById('minute')
            if (sonMIN.textContent.trim() > 0) {
                window.location.href = sonRDR
            }
        }, 3000)
    }

        if (window.location.href === 'https://cashbux.work/faucet') {
        setTimeout (() => {
            if (document.body.textContent.includes('Daily limit reached')) {
                window.location.href = sonRDR
            }
        }, 3000)
    }

        if (window.location.href.includes('/adblock')) {
    window.location.href = 'https://cashbux.work/faucet'
}

    setTimeout(function () {
       location.reload()
    }, 300000);

  if (window.location.href === 'https://cashbux.work/locked') {
  setTimeout (() => {
    window.location.href = sonRDR
  }, 3000)
}

  if (window.location.href === 'https://cashbux.work/faucet') {
  let sonTMS = setInterval(() => {
    const targetElement = document.querySelector('[class="cf-turnstile"]');
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
        clearInterval(sonTMS);
    }
}, 3000);
  }

  if (window.location.href.includes("firewall")) {
    let checkTurnstileInput = setInterval(function() {
    let turnstileContainer = document.querySelector('.cf-turnstile');
    if (turnstileContainer) {
        let turnstileInput = turnstileContainer.querySelector('input');
        if (turnstileInput) {
            if (turnstileInput.value) {
                let unlockButton = document.querySelector('.btn.btn-primary.w-md');
                if (unlockButton) {
                    unlockButton.click();
                    clearInterval(checkTurnstileInput);
                }
            }
        }
    }
}, 3000);
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

      }

})();