// ==UserScript==
// @name         CoinPayz
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto Shorts
// @author       keno venas
// @license      MIT
// @match        https://coinpayz.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinpayz.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492785/CoinPayz.user.js
// @updateURL https://update.greasyfork.org/scripts/492785/CoinPayz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clicarComDelay() {
        setTimeout(function() {
            var botao = document.querySelector('.col-lg-3:nth-child(1) .btn');
            if (botao) {
                botao.click();
            } else {
                console.log('Botão não encontrado.');
            }
        }, 5000);
    }
    clicarComDelay();
    if (window.location.href === "https://coinpayz.xyz/dashboard") {
        window.location.href = "https://coinpayz.xyz/links";
    }
    function removerCartoes() {
        var cartoes = document.querySelectorAll('div[class="col-lg-3"]');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Earnow") ||
                textoCartao.includes("Revcut") ||
                textoCartao.includes("Cutlink") ||
                textoCartao.includes("Easycut") ||
                textoCartao.includes("Earnow") ||
                textoCartao.includes("Ctr.sh")) {
                // Remover o cartão
                cartao.remove();
            }
        });
    }
    removerCartoes();
})();