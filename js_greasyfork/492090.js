// ==UserScript==
// @name         EarnCrypto.online
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ez
// @author       LTW
// @license      none
// @match        https://earncrypto.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earncrypto.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492090/EarnCryptoonline.user.js
// @updateURL https://update.greasyfork.org/scripts/492090/EarnCryptoonline.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const redirecionamento = "https://coinpayz.xyz/daily";
    const gmail = false; //mude para true  se for para logar com gmail ao inves de login e senha
    const email = '';
    const senha = ''
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);
    const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');
if (window.location.href === "https://earncrypto.online/" || window.location.href === "https://earncrypto.online") {
 window.location.href = "https://earncrypto.online/login";
}
if (window.location.href === 'https://earncrypto.online/dashboard' || window.location.href === 'https://earncrypto.online/dashboard/') {
    let dailyClaimButton = document.querySelector(".btn.btn-primary.waves-effect.waves-float.waves-light.claim-button.glow");
    if (dailyClaimButton && !dailyClaimButton.disabled) {
        dailyClaimButton.click();

    } else {
    window.location.href = 'https://earncrypto.online/claim';
    }

}


    const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;

    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');
    const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]')
    if (wasButtonClicked()) {
        removeButtonClicked();
        window.location.href = redirecionamento;
    }
     const checkAndClaim = async () => {
   if (window.location.href.includes("/claim") && mbsolver() && !wasButtonClicked()) {
   let checkTurnstileInput = setTimeout(function() {
    let turnstileContainer = document.querySelector('.cf-turnstile');
    if (turnstileContainer) {
        let turnstileInput = turnstileContainer.querySelector('input');
        if (turnstileInput) {
            if (turnstileInput.value) {
                let unlockButton = document.querySelector('.btn.btn-primary.btn-lg.claim-button');
                if (unlockButton) {
                    unlockButton.click();
                    setButtonClicked();
                }
            }
        }
    }
}, 1500);
        }
    };
     if (window.location.href.includes("/claim")){
     setTimeout(function () {location.reload();}, 80000);
     }
      setInterval(async () => {
        await checkAndClaim();
    }, 5000);



function checkForDailyLimitReached() {

    var textElements = document.querySelectorAll('body *');

    textElements.forEach(function(element) {

        if (element.textContent.includes('Daily limit reached')) {

       window.location.href = redirecionamento;
        }
    });
}

window.onload = function() {
    checkForDailyLimitReached();
};

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



             setTimeout(function () {location.reload();}, 120000);
        let firewall = setInterval(function() {
            let recaptchav3 = document.querySelector("input#recaptchav3Token");
            let hcaptcha = document.querySelector('.h-captcha > iframe');
            let turnstile = document.querySelector('.cf-turnstile > input');
            let boton = document.querySelector("button[type='submit']");
            if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstileResponseInput && turnstileResponseInput.value.trim() !== ''))) {
                boton.click();
                clearInterval(firewall);
            }
        }, 5000);
    }
})();