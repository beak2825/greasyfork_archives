// ==UserScript==
// @name         BANANO SHORTS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove cartões específicos da página e clica em um botão após a remoção dos cartões
// @author       Maestro01
// @match        https://banfaucet.com/links
// @grant        none
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=banfaucet.com
// @downloadURL https://update.greasyfork.org/scripts/499552/BANANO%20SHORTS.user.js
// @updateURL https://update.greasyfork.org/scripts/499552/BANANO%20SHORTS.meta.js
// ==/UserScript==

  //CADASTRE->  https:banfaucet.com/?r=180865
(function() {
    'use strict';

    // Função para remover os cartões indesejados
    function removerCartoes() {
        var cartoes = document.querySelectorAll('div.col-lg-6.col-xl-4');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            // Lista de textos que indicam cartões a serem removidos
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

    // Função para clicar no botão após a remoção dos cartões
    function clicarNoBotao() {
        var botao = document.querySelector('.col-lg-6:nth-child(1) .btn-one');
        if (botao) {
            botao.click();
        }
    }

    // Chamar a função para remover os cartões
    removerCartoes();

    // Aguardar um segundo para garantir que a remoção dos cartões seja concluída antes de clicar no botão
    setTimeout(clicarNoBotao, 1000);

})();
