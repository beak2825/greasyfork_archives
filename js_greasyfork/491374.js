// ==UserScript==
// @name         Banfaucet
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Auto Login, Saque automático e coleta da faucet.
// @author       LTW
// @match        https://banfaucet.com/*
// @license      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=banfaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491374/Banfaucet.user.js
// @updateURL https://update.greasyfork.org/scripts/491374/Banfaucet.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;} else  {
    const email = ""; // Email para saque FaucetPay e para login
    const senha = ""; // Senha para Login
    var Metodo = "Bitcoin - FaucetPay";
    var SaqueAuto = true; // mude para false se quiser desativar
    var ComeçarSaque = 0.2; // valor em dólares
    var saque = ""; // carteira Cwallet ou Faucetpay para saque
    var redirecionamento = "https://hatecoin.me/faucet"

    /* Metodos de saque copie e cole
    Bitcoin - FaucetPay
    Tether - FaucetPay
    Dogecoin - CWallet
    Solana - CWallet
    Pepe - CWallet
    DigiByte - CWallet
    Shiba Inu - CWallet
    Ethereum - CWallet
    Ravencoin - CWallet
    FLOKI - CWallet
    BNB - CWallet
    Polkadot - CWallet
    Gala - CWallet
    */
      if (window.location.href.includes("/login")) {
         setTimeout(function () {
    document.getElementById("inputEmail").value = email;
    document.getElementById("inputPassword").value = senha;
  }, 5000);
    let buttonClicked = false;
         const checkAndClick = () => {
        if (!buttonClicked && grecaptcha && grecaptcha.getResponse().length !== 0) {
            const logInButton = document.querySelector('.btn-submit.w-100[type="submit"]');
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

        if (url === 'https://banfaucet.com/' || url === 'https://banfaucet.com') {
            window.location.href = 'https://banfaucet.com/login';
        } else if (url === 'https://banfaucet.com/dashboard') {
            window.location.href = 'https://banfaucet.com/faucet';
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

const mbsolver = () => !!document.getElementById('antibotlinks').value.trim();
const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
const removeButtonClicked = () => localStorage.removeItem('buttonClicked');


if (wasButtonClicked()) {
    removeButtonClicked();
    window.location.href = redirecionamento;
}

    setInterval(function() {
        const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]')

        if (window.location.href.includes("/faucet") && turnstileResponseInput && turnstileResponseInput.value.trim() !== '' && mbsolver() && !wasButtonClicked()) {

           const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                submitButton.dispatchEvent(new MouseEvent('click'));
                setButtonClicked();
            }
        }
    }, 3000);



       if (SaqueAuto === true) {
        var elemento = document.getElementById('balance-in-dollars');
        var texto = parseFloat(elemento.textContent.trim());

        setTimeout(function() {
            if (window.location.href.indexOf('withdraw') === -1 && window.location.href.indexOf('firewall') === -1) {
                if (texto > ComeçarSaque) {
                    window.location.href = 'https://banfaucet.com/withdraw';
                }
            }
        }, 3000);

        setTimeout(function() {
            if (window.location.href.includes("/withdraw") && texto < ComeçarSaque) {
                window.location.href = 'https://banfaucet.com/faucet';
            }
        }, 3000);

        setTimeout(function() {
            if (window.location.href.includes("/withdraw") && texto > ComeçarSaque) {
                var inputWallet = document.querySelector('input[name="wallet"]');
                if (inputWallet) {
                inputWallet.value = saque;}
                var buttonClicked = false;
                var labels = document.querySelectorAll('.card-radio-label');

                labels.forEach(function(label) {
                    if (label.querySelector('span').textContent.trim() === Metodo) {
                        var input = label.querySelector('input[type="radio"]');
                        if (input) {
                            input.click();
                            return;
                        }
                    }
                });

                const checkAndClick = () => {
                    if (!buttonClicked && grecaptcha && grecaptcha.getResponse().length !== 0) {
                        const withdrawButton = document.querySelector('.custom-stbtn[type="submit"]');
                        if (withdrawButton) {
                            withdrawButton.click();
                            buttonClicked = true;
                        }
                    }
                    setTimeout(checkAndClick, 2000);
                };
               setTimeout(checkAndClick, 3000);

            }
        }, 3000);
    }
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
