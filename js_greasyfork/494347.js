// ==UserScript==
// @name         banfaucet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autologin + autoshorts!
// @author       Keno Venas
// @match        https://banfaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=banfaucet.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494347/banfaucet.user.js
// @updateURL https://update.greasyfork.org/scripts/494347/banfaucet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mensagemAlvo = "A timeout occurred";
    var urlRedirecionamento = "https://banfaucet.com/links";
    if (document.body.innerText.includes(mensagemAlvo)) {
        window.location.href = urlRedirecionamento;
    }
    var messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px'; // Alterado para 20px para o canto superior
    messageDiv.style.left = '20px';
    messageDiv.style.padding = '10px';
    messageDiv.style.backgroundColor = 'blue';
    messageDiv.style.color = 'black';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.zIndex = '9999';
    messageDiv.textContent = 'Criado por Keno Venas !!!';
    document.body.appendChild(messageDiv);
    function clicarComDelay() {
        setTimeout(function() {
            var botao = document.querySelector('.col-lg-6:nth-child(1) .btn-one');
            if (botao) {
                botao.click();
            } else {
                console.log('Botão não encontrado.');
            }
        }, 2000);
    }
    clicarComDelay();
    var botoesParaClicar = ['button.btn-submit'];
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
    if (window.location.href === "https://banfaucet.com/") {
        window.location.href = "https://banfaucet.com/login";
    }
    function preencherCampos() {
        var emailCampo = 'input#inputEmail';
        var senhaCampo = 'input#inputPassword';
        var email = 'email@gmail.com';
        var senha = 'senha';
        setTimeout(function() {
            $(emailCampo).val(email);
        }, 3000);
        setTimeout(function() {
            $(senhaCampo).val(senha);
        }, 3000);
    }
    function removerCartoes() {
        var cartoes = document.querySelectorAll('div[class="col-lg-6 col-xl-4"]');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Earnow.Online") ||
                textoCartao.includes("Shrinkme") ||
                textoCartao.includes("#1 Shortener") ||
                textoCartao.includes("Revcut") ||
                textoCartao.includes("Rsshort") ||
                textoCartao.includes("Cashfly") ||
                textoCartao.includes("Shorti.Io") ||
                textoCartao.includes("Urlcut") ||
                textoCartao.includes("Shrinkearn") ||
                textoCartao.includes("Chainfo") ||
                textoCartao.includes("V2p") ||
                textoCartao.includes("Clk.Sh") ||
                textoCartao.includes("Coinfays") ||
                textoCartao.includes("Usalink") ||
                 textoCartao.includes("Bitss") ||
                textoCartao.includes("Dutchycorp.Ovh") ||
                textoCartao.includes("Adbx") ||
                textoCartao.includes("Inlinks") ||
                textoCartao.includes("C2g") ||
                textoCartao.includes("Clks.Pro")) {
                cartao.remove();
            }
        });
    }
    removerCartoes();
    function redirecionarSeNecessario() {
        if (window.location.href === 'https://banfaucet.com/dashboard') {
            window.location.href = 'http://linksfly.link/banfaucet-com-links';
        }
    }
    preencherCampos();
    removerCartoes();
    redirecionarSeNecessario();
})();
