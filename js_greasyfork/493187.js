// ==UserScript==
// @name         newzcrypt.xyz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  0.025$/100
// @author       LTW
// @license      none
// @match        https://newzcrypt.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=newzcrypt.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493187/newzcryptxyz.user.js
// @updateURL https://update.greasyfork.org/scripts/493187/newzcryptxyz.meta.js
// ==/UserScript==

(async function() {
    'use strict';
const pageTitle = document.title.toLowerCase();
if (pageTitle.includes('Just a moment...') || pageTitle.includes('Um momento...')) {
return;
}else{
    const email = ""; // Email para saque FaucetPay e para login
    const senha = ""; // Senha para Login
    const redirecionamento = "https://newzcrypt.xyz/faucet";

      if (window.location.href.includes("/login")) {
         setTimeout(function () {
    document.getElementById("email").value = email;
    document.getElementById("password").value = senha;
  }, 5000);
    let buttonClicked = false;
         const checkAndClick = () => {
        if (!buttonClicked && grecaptcha && grecaptcha.getResponse().length !== 0) {
            const logInButton = document.querySelector('.tf-button.style2[type="submit"]');
            if (logInButton) {
                logInButton.click();
                buttonClicked = true;
            }
        }
        setTimeout(checkAndClick, 2000);
    };
     setTimeout(checkAndClick, 2000);
 }
    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://newzcrypt.xyz/' || url === 'https://newzcrypt.xyz') {
            window.location.href = 'https://newzcrypt.xyz/login';
        } else if (url === 'https://newzcrypt.xyz/dashboard') {
            window.location.href = 'https://newzcrypt.xyz/faucet';
        }
    };

    const waitForElement = async (selector) => {
        while (!document.querySelector(selector)) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    };


    const executeScript = async () => {
        handlePageRedirection();
    };

    await executeScript();

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
        window.location.href = redirecionamento;
    }

setInterval(function() {

    if (window.location.href.includes("/faucet") && grecaptcha && grecaptcha.getResponse().length > 0 && mbsolver() && !wasButtonClicked()) {

        const submitButton = document.querySelector('button[type="submit"].btn.btn-primary.btn-lg.claim-button');

        if (submitButton && !submitButton.disabled) {

            submitButton.click();
            setButtonClicked();
        }
    }
}, 3000);


            setTimeout(function () {
            location.reload();
        }, 120000);
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
}
})();
