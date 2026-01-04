// ==UserScript==
// @name         freesolana.top
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fly Shorts
// @author
// @match        https://freesolana.top/
// @match        https://freesolana.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freesolana.top
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494691/freesolanatop.user.js
// @updateURL https://update.greasyfork.org/scripts/494691/freesolanatop.meta.js
// ==/UserScript==

// Editar email e pass na linha 63 - 64


(async function() {
    'use strict';

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://freesolana.top/' || url === 'https://freesolana.top') {
            window.location.href = 'https://freesolana.top/login';
        } else if (url === 'https://freesolana.top/dashboard') {
            window.location.href = 'http://linksfly.link/freesolana-top-inks';
        }
    };

    const waitForElement = async (selector) => {
        while (!document.querySelector(selector)) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    };

    const preencherCampos = async () => {
    const [emailInput, passwordInput] = await Promise.all([waitForElement('#email'), waitForElement('#password')]);

	// Preenche o email e senha
    if (emailInput && passwordInput) {
        emailInput.value = 'seuemail@gmail.com'; // Substitua com o seu email
        passwordInput.value = 'suasenha'; // Substitua com a sua senha

        await waitForCaptchaCompletion();

        clicarBotaoLogin();
    }
};


    const clicarBotaoLogin = () => {
    const signInButton = document.querySelector('button.btn.btn-primary.btn-block.waves-effect.waves-light');

    if (signInButton) {
        signInButton.click();
    }
};


    const waitForCaptchaCompletion = async () => {
        while (!(grecaptcha && grecaptcha.getResponse().length > 0)) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    const executeScript = async () => {
        handlePageRedirection();

        if (window.location.href.includes('https://freesolana.top/login')) {
            await preencherCampos();
        }
    };

    await executeScript();

    (function() {
    function waitForPageLoad(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            window.addEventListener('load', callback);
        }
    }

    function clickClaimButtonWithDelay() {
        setTimeout(function() {
            var claimButton = document.querySelector('.btn.btn-primary.waves-effect.waves-light');

            if (claimButton) {
                claimButton.click();
            }
        }, 5000);
    }

    waitForPageLoad(function() {
        clickClaimButtonWithDelay();
    });
})();

    function removerCartoes() {
        var cartoes = document.querySelectorAll('div[class="card card-body text-center"]');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Faucetcrypto") ||
                textoCartao.includes("Clicksfly.com") ||
                textoCartao.includes("Linksly") ||
                textoCartao.includes("Droplink") ||
                textoCartao.includes("Clk.sh") ||
                textoCartao.includes("Ez4short") ||
                textoCartao.includes("Adlink") ||
                textoCartao.includes("Revcut") ||
                textoCartao.includes("Urlcut") ||
                textoCartao.includes("Shrinkme") ||
                textoCartao.includes("Cuty") ||
                textoCartao.includes("Exalink") ||
                textoCartao.includes("Rsshort") ||
                textoCartao.includes("Cutlink") ||
                textoCartao.includes("Chainfo") ||
                textoCartao.includes("Shortano") ||
                textoCartao.includes("Shortino") ||
                textoCartao.includes("ShrinkEarn") ||
                textoCartao.includes("Zshort") ||
                textoCartao.includes("Adrinolinks") ||
                textoCartao.includes("Inlinks") ||
                textoCartao.includes("Bitss") ||
                textoCartao.includes("Try2link") ||
                textoCartao.includes("clks") ||
                textoCartao.includes("Shortlinks") ||
                textoCartao.includes("Earnow")) {
                cartao.remove();
            }
        });
    }
    removerCartoes();
    removerCartoes();

})();
