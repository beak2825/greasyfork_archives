// ==UserScript==
// @name         cryptoearns
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Faucet claim
// @author       Gysof
// @match        https://cryptoearns.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptoearns.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494149/cryptoearns.user.js
// @updateURL https://update.greasyfork.org/scripts/494149/cryptoearns.meta.js
// ==/UserScript==

// Register here - https://cryptoearns.com/?r=110567
// You will need rscaptcha solver - link - https://crypdona.cybranceehost.com/
// You will need AB Links Solver - I recommend mbsolver
// Editar email e pass linha 21 - 22

(function() {
    'use strict';

	// Editar o email e a senha
    var email = "Your@Email"; // Substitua com seu email
    var senha = "YourPassword"; // Substitua com sua senha

    if (window.location.href === "https://cryptoearns.com/") {
        window.location.href = "https://cryptoearns.com/login";
    }

    if (window.location.href === "https://cryptoearns.com/dashboard") {
        window.location.href = "https://cryptoearns.com/faucet";
    }

    function preencherCampos() {
        var emailInput = document.querySelector('input[class="form-control"]');
        var senhaInput = document.querySelector('input[class="form-control mb-3"]');
        if(emailInput && senhaInput) {
            emailInput.value = email;
            senhaInput.value = senha;
            verificarCaptcha();
            verificarErroCaptcha();
        }
    }

    function verificarCaptcha() {
        var campoCaptcha = document.getElementById('rscaptcha_response');
        var valorCaptcha = campoCaptcha.value;

        if (valorCaptcha !== "") {
            clicarBotaoLogin();
        } else {
            setTimeout(verificarCaptcha, 1000);
        }
    }

    function clicarBotaoLogin() {
        var botaoLogin = document.querySelector('button[class="btn-submit w-100"]');
        if(botaoLogin) {
            botaoLogin.click();
        }
    }

    function verificarErroCaptcha() {
        var mensagemErroCaptcha = document.querySelector('.captcha-error');
        if (mensagemErroCaptcha && mensagemErroCaptcha.textContent.trim() === "Something Went Wrong") {
            location.reload();
        }
    }

    function verificarAntibotlinks() {
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        return valorAntibotlinks.length === 12;
    }

    function clicarBotaoReivindicacao() {
        var botaoReivindicacao = document.querySelector('.btn.solid_btn.btn-lg.text-white.claim-button');
        if(botaoReivindicacao) {
            botaoReivindicacao.click();
            setTimeout(() => location.reload(), 60000);
        }
    }

    window.onload = function() {
        preencherCampos();
    };

    setInterval(function() {
        if (window.location.href.includes("/faucet") && verificarAntibotlinks() && verificarCaptchaResolvido()) {
            clicarBotaoReivindicacao();
        }
        verificarErroCaptcha();
    }, 3000);

    function verificarCaptchaResolvido() {
        var campoRSCaptcha = document.getElementById('rscaptcha_response');
        return campoRSCaptcha && campoRSCaptcha.value.trim() !== '';
    }

})();
