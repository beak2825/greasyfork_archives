// ==UserScript==
// @name         Btc Bunch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Shorts !
// @author       Keno Venas
// @match        https://btcbunch.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btcbunch.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494526/Btc%20Bunch.user.js
// @updateURL https://update.greasyfork.org/scripts/494526/Btc%20Bunch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function isSecureConnectionMessageVisible() {
        return document.body.textContent.includes('Verificando se você é humano. Isso pode levar alguns segundos.');
    }
    function suaFuncaoPrincipal() {
    var messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.left = '20px';
    messageDiv.style.padding = '10px';
    messageDiv.style.backgroundColor = 'blue';
    messageDiv.style.color = 'black';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.zIndex = '9999';
    messageDiv.textContent = 'Criado por Keno Venas !!!';
    document.body.appendChild(messageDiv);
    function clicarBotaoComDelay(selector, delay) {
        setTimeout(function() {
            var botao = document.querySelector(selector);
            if (botao) {
                botao.click();
            }
        }, delay);
    }
    window.addEventListener('load', function() {
        clicarBotaoComDelay('a[class="btn btn-primary waves-effect waves-light"]', 5000);
    });
    var botoesParaClicar = ['button.btn'];
    function clicarNosBotoesComAtraso() {
        setTimeout(function() {
            clicarNosBotoes();
        }, 3000);
    }
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
            clicarNosBotoesComAtraso();
        }
    }, 1000);
    var email = "emal@gmail.com";
    var senha = "senha";
    function preencherCampos() {
        var emailInput = document.querySelector('input#email');
        var senhaInput = document.querySelector('input#password');

        if (emailInput && senhaInput) {
            emailInput.value = email;
            senhaInput.value = senha;
        }
    }
    window.addEventListener('load', preencherCampos);
    if (window.location.href === "https://btcbunch.com/") {
        window.location.href = "https://btcbunch.com/login";
    }

    if (window.location.href === "https://btcbunch.com/dashboard") {
        window.location.href = "http://linksfly.link/btcbunch-com-links";
    }
    var palavrasEspecificas = ['PayLinks.Cloud', 'RSS Short',
 'RevCut',
  'EarNow',
   'Shortino',
    'Shortano',
     'ClkSh',
      'ClicksFly',
       'Exe IO',
        'FcLc',
         'Ez4Short',
          'EasyCut',
           'ShrinkEarn',
            'FreeLTC Top',
             'Try2Link',
              'BtCut',
               'AskPaccosi',
                'Clks Pro',
                 'RevCut'];
    function contemPalavraEspecifica(texto) {
        var textoLowerCase = texto.toLowerCase();
        return palavrasEspecificas.some(function(palavra) {
            return textoLowerCase.includes(palavra.toLowerCase());
        });
    }
    function removeCartoesComPalavrasEspecificas() {
        // Seleciona todos os elementos com a classe "col-lg-3"
        var cartoes = document.querySelectorAll('.col-lg-3');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (contemPalavraEspecifica(textoCartao)) {
                cartao.remove();
            }
        });
    }
    window.addEventListener('load', removeCartoesComPalavrasEspecificas);
        console.log('Executando sua função principal...');
    }
    const observerConfig = { childList: true, subtree: true };
    function handleDomChanges(mutationsList, observer) {
        if (!isSecureConnectionMessageVisible()) {
            suaFuncaoPrincipal();
            observer.disconnect();
        }
    }
    const observer = new MutationObserver(handleDomChanges);
    observer.observe(document.body, observerConfig);
})();