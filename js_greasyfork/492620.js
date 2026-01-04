// ==UserScript==
// @name         free-ltc-info
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  :P
// @author       LTW
// @license      none
// @match        https://free-ltc-info.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=free-ltc-info.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492620/free-ltc-info.user.js
// @updateURL https://update.greasyfork.org/scripts/492620/free-ltc-info.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const redirecionamento = "https://earncrypto.online/dashboard";
    const gmail = false; //mude para true  se for para logar com gmail ao inves de login e senha
    const email = '';
    const senha = ''
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const select = (selector) => document.querySelector(selector);
    const selectValue = (selector) => select(selector)?.value?.replace(/\s/g, '');
if (window.location.href === "https://free-ltc-info.com/" || window.location.href === "https://free-ltc-info.com") {
 window.location.href = "https://free-ltc-info.com/login";
}
      if (window.location.href.includes("/login")) {
          if (gmail === true){
           window.location.href = "https://free-ltc-info.com/gauth";
          }
                    if (gmail === false){
        const { email: emailInput, password: passwordInput } = document.forms[0].elements;

        if (emailInput && passwordInput) {
            emailInput.value = email;
            passwordInput.value = senha;
let checkTurnstileInput = setInterval(function () {
                        let turnstileContainer = document.querySelector('.cf-turnstile');
                        if (turnstileContainer) {
                            let turnstileInput = turnstileContainer.querySelector('input');
                            if (turnstileInput && turnstileInput.value) {
                                let unlockButton = document.querySelector('.btn.btn-primary.btn-block.btn-md');
                                if (unlockButton) {
                                    unlockButton.click();
                                    setButtonClicked();
                                    clearInterval(checkTurnstileInput);
                                }
                            }
                        }
                    }, 3000 + Math.random() * 2000);
          }
      }
      }

    if (window.location.href.includes("/dashboard")) {
    setTimeout(function() {
        const claimButton = document.querySelector('button.swal2-confirm.swal2-styled');
        if (claimButton) {
            const randomDelay = Math.floor(Math.random() * 7000) + 2000;
            setTimeout(function() {
                claimButton.click();
            }, randomDelay);
        } else {
          window.location.href = "https://free-ltc-info.com/claim";
        }
    }, 3000);
}

    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

    const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]');

    if (wasButtonClicked()) {
        removeButtonClicked();
        const okButton = document.querySelector('.swal2-confirm.swal2-styled');
        if (okButton) {
            okButton.click();
            window.location.replace(redirecionamento);
        }
    }

const checkAndClaim = async () => {
    let claimsLeftElements = document.querySelectorAll('.text-base.text-slate-500.mt-1');
    let claimsLeftFound = false;

    claimsLeftElements.forEach(element => {
        if (element.innerText.trim() === "Claims Left") {
            claimsLeftFound = true;
            let claimCountElement = element.previousElementSibling;
            if (claimCountElement && claimCountElement.innerText.trim() === "208/288") {
                window.location.href = redirecionamento;
            } else {
                if (window.location.href.includes("/claim") && !wasButtonClicked() && (element.innerText.trim() === "Claims Left")) {
                    let checkTurnstileInput = setInterval(function () {
                        let turnstileContainer = document.querySelector('.cf-turnstile');
                        if (turnstileContainer) {
                            let turnstileInput = turnstileContainer.querySelector('input');
                            if (turnstileInput && turnstileInput.value) {
                                let unlockButton = document.querySelector('.btn.btn-primary');
                                if (unlockButton) {
                                    unlockButton.click();
                                    setButtonClicked();
                                    clearInterval(checkTurnstileInput);
                                }
                            }
                        }
                    }, 3000 + Math.random() * 2000);
                }
            }
        }
});
    if (!claimsLeftFound) {
    }
};



    setTimeout(function () {
        location.reload();
    }, 80000 + Math.random() * 5000);

    checkAndClaim();
})();
