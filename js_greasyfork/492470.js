// ==UserScript==
// @name         Rotator 39 faucets
// @namespace    http://tampermonkey.net/
// @version      0.9
// @author       keno venas 
// @license       MIT
// @match        https://onlyfaucet.com/*
// @match        https://freeltc.fun/*
// @match        https://bnb-earn.com/*
// @match     https://btcrocket.net/*
// @match     https://ethrocket.net/*
// @match     https://cryptoarea.net/*
// @match     https://sol-earn.com/*
// @match     https://tron-earn.com/*
// @match     https://faucetdash.com/*
// @match     https://matic-earn.com/*
// @match     https://cryptoxmr.net/*
// @match     https://dash-earn.com/*
// @match     https://dgb-earn.com/*
// @match     https://ton-earn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlyfaucet.com
// @grant        none
// @description O amanhã será tarde demais !!!
// @downloadURL https://update.greasyfork.org/scripts/492470/Rotator%2039%20faucets.user.js
// @updateURL https://update.greasyfork.org/scripts/492470/Rotator%2039%20faucets.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href === "https://onlyfaucet.com/") {
        window.location.href = "https://onlyfaucet.com/faucet/currency/ada";
    }
     if (window.location.href === "https://freeltc.fun/") {
        window.location.href = "https://freeltc.fun/faucet/currency/ltc";
    }
    const intervalo = 1000;
    function verificarECLicarRegularmente() {
        let turnstile = document.querySelector("input[name='cf-turnstile-response']");
        let button2 = document.querySelector("button#subbutt");
        if (turnstile && turnstile.value.length > 0 && button2) {
            button2.click();
            clearInterval(claim2);
        }
    }
    const claim2 = setInterval(verificarECLicarRegularmente, intervalo);
    var urls = [
        "https://onlyfaucet.com/faucet/currency/ada",
        "https://onlyfaucet.com/faucet/currency/ltc",
        "https://onlyfaucet.com/faucet/currency/doge",
         "https://onlyfaucet.com/faucet/currency/usdt",
        "https://onlyfaucet.com/faucet/currency/sol",
        "https://onlyfaucet.com/faucet/currency/trx",
        "https://onlyfaucet.com/faucet/currency/bnb",
        "https://onlyfaucet.com/faucet/currency/bch",
        "https://onlyfaucet.com/faucet/currency/dash",
        "https://onlyfaucet.com/faucet/currency/dgb",
        "https://onlyfaucet.com/faucet/currency/eth",
        "https://onlyfaucet.com/faucet/currency/fey",
        "https://onlyfaucet.com/faucet/currency/btc",
        "https://onlyfaucet.com/faucet/currency/ton",
        "https://onlyfaucet.com/faucet/currency/xrp",
         "https://onlyfaucet.com/faucet/currency/zec",
        "https://onlyfaucet.com/faucet/currency/matic",
        "https://freeltc.fun/faucet/currency/ltc",
        "https://freeltc.fun/faucet/currency/doge",
        "https://freeltc.fun/faucet/currency/dgb",
        "https://freeltc.fun/faucet/currency/sol",
        "https://freeltc.fun/faucet/currency/trx",
        "https://freeltc.fun/faucet/currency/bnb",
        "https://freeltc.fun/faucet/currency/bch",
        "https://freeltc.fun/faucet/currency/dash",
        "https://freeltc.fun/faucet/currency/eth",
        "https://freeltc.fun/faucet/currency/fey",
         "https://freeltc.fun/faucet/currency/zec",
        "https://bnb-earn.com/",
    ];
    function redirecionar() {
        var currentIndex = urls.indexOf(window.location.href) + 1;
        if (currentIndex < urls.length) {
            window.location.href = urls[currentIndex];
        }
    }
    function verificarFrase() {
        var frases = [
            "been sent to your FaucetPay account!",
            "he faucet does not have sufficient funds for this transaction.",
            "Daily claim limit for this coin reached, please comeback again tomorrow."
           
        ];
        for (var i = 0; i < frases.length; i++) {
            if (document.body.innerText.includes(frases[i])) {
                setTimeout(redirecionar, 500);
                return;
            }
        }
    }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            verificarFrase();
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    if (window.location.href === "https://ton-earn.com/home/wallet/852840/faucet") {
        setTimeout(function() {
            $('button#faucet_roll').click();
       }, 2000);
        setTimeout(function() {
           window.location.href = "https://onlyfaucet.com/faucet/currency/ltc";
        }, 2000);
    }
    function clickWithDelay() {
        setTimeout(function() {
            var button = document.querySelector('button#faucet_roll');
            if (button) {
                var clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                button.dispatchEvent(clickEvent);
            } else {
                console.error('Botão não encontrado');
            }
        }, 2000);
    }
    window.addEventListener('load', clickWithDelay);
    var style = document.createElement('style');
    style.innerHTML = `
        #contador {
            position: fixed;
            top: 10px;
            left: 10px;
            color: black;
            background-color: blue;
            padding: 5px 10px;
            border-radius: 5px;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);
    var contadorElement = $('<div id="contador">');
    $('body').append(contadorElement);
    function atualizarContador(segundos) {
        contadorElement.text(segundos);
    }
    function recarregarPagina() {
        var segundos = 70;
        atualizarContador(segundos);

        setInterval(function() {
            segundos--;
            atualizarContador(segundos);

            if (segundos === 0) {
                location.reload();
            }
        }, 1000);
    }
    recarregarPagina();
    window.addEventListener('load', clicarComDelay, false);
    if (window.location.href === "https://bch-rocket.com/register") {
        window.location.href = "https://bch-rocket.com/login";
    }
    function preencherCampos() {
        var email = "seuemail@gmail.com";
        var senha = "suasenha";

        document.querySelector('input#floatingEmail').value = email;
        document.querySelector('input#floatingPassword').value = senha;

        setTimeout(clicarBotao, 3000);
    }
    function clicarBotao() {
        var botao = document.querySelector('button.btn');
        if (botao) {
            botao.click();
        }
    }
    window.addEventListener('load', preencherCampos);
})();