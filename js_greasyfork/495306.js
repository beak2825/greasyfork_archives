// ==UserScript==
// @name         acryptominer.io
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  acryptominer
// @author       LTW
// @license      none
// @match        https://acryptominer.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acryptominer.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495306/acryptominerio.user.js
// @updateURL https://update.greasyfork.org/scripts/495306/acryptominerio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const login = '';
    const senha = '';
    const gmail = true;
    const redirecionamento = 'https://coinpayz.xyz/daily';

    if (window.location.href === 'https://acryptominer.io/user/dashboard') {
        window.location.href = 'https://acryptominer.io/user/faucet';
    }
    if (window.location.href === 'https://acryptominer.io/') {
        window.location.href = 'https://acryptominer.io/user/login';
    }
                setTimeout(function () {

var regex = /\b\d+h\s+(\d+)m\s+\d+s\b/g;

var textoPagina = document.body.innerText;

var match = regex.exec(textoPagina);

while (match != null) {
    var numeroM = parseInt(match[1], 10);

    if (numeroM > 1) {
        window.location.href = redirecionamento;
        break;
    }
    match = regex.exec(textoPagina);
}
    }, 3000);


  if (window.location.href.includes('/faucet')){
    async function selector(selector) {
    return document.querySelector(selector)}
    const checkTurnstileInput = setInterval(async () => {
        const turnstileInput = await selector('.cf-turnstile input');
        if (turnstileInput?.value) {
            clearInterval(checkTurnstileInput);
             const loginButton = document.querySelector('button[type="submit"]');
              if (loginButton) {
              setTimeout(function () {
               loginButton.click();
              }, 2000);
           }
        }
    }, 2000);
}
    setTimeout(function () {
        if (window.location.href.includes('/login')) {
            if (gmail) {
                window.location.href = 'https://acryptominer.io/user/login/google';
            } else {
                preencherCampo('Username', login);
                preencherCampo('your-password', senha);
                verificarCheckbox('remember');
                esperarRecaptchaELogin();
            }
        }
    }, 3000);

    function preencherCampo(id, valor) {
        const campo = document.getElementById(id);
        if (campo) {
            campo.value = valor;
        } else {
            console.warn(`Campo com id="${id}" não encontrado.`);
        }
    }

    function verificarCheckbox(id) {
        const checkbox = document.getElementById(id);
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
        }
    }

    function esperarRecaptchaELogin() {
        const intervalId = setInterval(function () {
            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length !== 0) {
                clearInterval(intervalId);
                setTimeout(function () {
                    const loginButton = document.querySelector('button[type="submit"].btn.btn-outline--base.w-100');
                    if (loginButton) {
                        loginButton.click();
                    } else {
                        console.warn('Botão de login não encontrado.');
                    }
                }, 2000);
            }
        }, 500);
    }

    
})();
