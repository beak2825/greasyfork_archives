// ==UserScript==
// @name         payup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  O amanha será tarde dmais !!!
// @author       keno venas
// @license      MIT   
// @match        https://payup.video/*
// @match        https://premiumbspot.blogspot.com/*
// @match        https://www.youtube.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=payup.video
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492466/payup.user.js
// @updateURL https://update.greasyfork.org/scripts/492466/payup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var botoesParaClicar = ['button.bg-blue4'];
    function clicarNosBotoes() {
        for (var i = 0; i < botoesParaClicar.length; i++) {
            var botao = document.querySelector(botoesParaClicar[i]);
            if (botao) {
                botao.click();
            }
        }
    }
    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse();
    }
    var verificarCaptchaInterval = setInterval(function() {
        if (isCaptchaChecked()) {
            clearInterval(verificarCaptchaInterval);
            clicarNosBotoes();
        }
    }, 1000);
    var email = "seu email@gmail.com";
    var senha = "sua senha ";
    function preencherFormulario() {
        var emailInput = document.querySelector('.form-group:nth-child(1) > .form-control');
        var senhaInput = document.querySelector('.form-group:nth-child(2) > .form-control');

        if (emailInput && senhaInput) {
            emailInput.value = email;
            senhaInput.value = senha;
        }
    }
    window.onload = function() {
        preencherFormulario();
    };
    if (window.location.href === "https://payup.video/") {
        // Redireciona para a nova URL
        window.location.href = "https://payup.video/signin/";
    }
    if (window.location.href === "https://payup.video/dashboard/") {
        // Redireciona para a nova URL
        window.location.href = "https://payup.video/tasks/video/";
    }
    function verificaURL() {
        return window.location.href.startsWith('https://payup.video/tasks/video/');
    }
    function recarregarPagina() {
        if (verificaURL()) {
            setTimeout(function() {
                location.reload();
            }, 25000);
        }
    }
    function criarContador() {
        const contador = document.createElement('div');
        contador.style.position = 'fixed';
        contador.style.top = '10px';
        contador.style.right = '10px';
        contador.style.padding = '5px 10px';
        contador.style.background = 'blue';
        contador.style.color = 'black';
        contador.style.fontWeight = 'bold';
        contador.style.borderRadius = '5px';
        document.body.appendChild(contador);
        function atualizarContador(segundos) {
            contador.textContent = `Próximo recarregamento em ${segundos} segundos`;
        }
        let tempoRestante = 25;
        setInterval(() => {
            tempoRestante--;
            if (tempoRestante === 0) {
                tempoRestante = 25;
            }
            atualizarContador(tempoRestante);
        }, 1000);
    }
    recarregarPagina();
    criarContador();
    window.addEventListener('hashchange', recarregarPagina, false);
    window.addEventListener('popstate', recarregarPagina, false);
    function fecharAba() {
        window.close();
    }
    if (window.location.href.startsWith("https://www.youtube.com/")) {
        fecharAba();
    }
    function clicarComDelay(selector, delay) {
        setTimeout(function() {
            $(selector)[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }, delay);
    }
    $(document).ready(function() {
        clicarComDelay('button.card_run', 2000);
        clicarComDelay('button[class="ytp-large-play-button ytp-button ytp-large-play-button-red-bg"]', 1000);
    });
})();