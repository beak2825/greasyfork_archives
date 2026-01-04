// ==UserScript==
// @name         kiddyearner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto shorts!!!
// @author       keno venas 
// @match        https://kiddyearner.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiddyearner.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493298/kiddyearner.user.js
// @updateURL https://update.greasyfork.org/scripts/493298/kiddyearner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clicarBotaoComDelay() {
        setTimeout(function() {
            var botao = document.querySelector('button.btn');
            if (botao) {
                botao.click();
            } else {
                console.log('Botão não encontrado.');
            }
        }, 12000);
    }

    // Função para clicar no botão '.col-lg-6:nth-child(1) .claim-btn' após um atraso de 5 segundos
    function clicarClaimBtnComDelay() {
        setTimeout(function() {
            var claimBtn = document.querySelector('.col-lg-6:nth-child(1) .claim-btn');
            if (claimBtn) {
                claimBtn.click();
            } else {
                console.log('Botão de claim não encontrado.');
            }
        }, 5000);
    }
    function clicarNosBotoes() {
        var botoesParaClicar = ['button.btn-submit'];
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
    clicarBotaoComDelay();
    clicarClaimBtnComDelay();
    if (window.location.href === "https://kiddyearner.com/") {
        window.location.href = "https://cuty.io/RvXT25O1";
    }

    if (window.location.href === "https://kiddyearner.com/dashboard") {
        window.location.href = "https://cuty.io/FSJh";
    }
    function preencherCampos() {
        var emailCampo = 'input#email';
        var senhaCampo = 'input#password';
        var email = 'seuemail@gmail.com';
        var senha = 'suasenha ';
        setTimeout(function() {
            $(emailCampo).val(email);
        }, 3000);

        setTimeout(function() {
            $(senhaCampo).val(senha);
        }, 3000);
    }
    function removerCartoes() {
        var cartoes = document.querySelectorAll('div[class="col-lg-6"]');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (
                textoCartao.includes("Rs short") ||
                textoCartao.includes("Shortsme") ||
                textoCartao.includes("FC LC") ||
                textoCartao.includes("clk") ||
                textoCartao.includes("Shrinkearn") ||
                textoCartao.includes("Coinfays") ||
                textoCartao.includes("CTR") ||
                textoCartao.includes("Clks"))
            {
                cartao.remove();
            }
        });
    }
    preencherCampos();
    removerCartoes();

})();
