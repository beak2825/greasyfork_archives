// ==UserScript==
// @name         Pular shortlinks Blazing Bits
// @namespace    https://blazingbits.org
// @version      1.0
// @description  Acessa os links da página Blazing Bits automaticamente
// @author       Seu Nome
// @match        https://blazingbits.org/links
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493814/Pular%20shortlinks%20Blazing%20Bits.user.js
// @updateURL https://update.greasyfork.org/scripts/493814/Pular%20shortlinks%20Blazing%20Bits.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para clicar no botão "Start Link"
    function clickStartLink() {
        console.log("Clicando no botão Start Link...");
        document.querySelector('.button-normal2').click();
    }

    // Função para verificar se há botões "Start Link" disponíveis
    function checkButtons() {
        var buttons = document.querySelectorAll('.button-normal2');
        var linksClicados = parseInt(document.querySelector('.ts-5.tw-2.tc-1.mb-2.float-end').innerText.split('/')[0]);

        // Verifica se há botões disponíveis para clicar e se o número de links clicados é menor que 20
        if (buttons.length > 0 && linksClicados < 20) {
            console.log("Botões disponíveis e links ainda não atingiram o máximo. Clicando...");
            clickStartLink();
        } else {
            console.log("Nenhum botão disponível ou número de links atingiu o máximo. Redirecionando para a página de batalhas...");
            window.location.href = "https://blazingbits.org/battles"; // Redireciona para a página de batalhas
        }
    }

    // Função para aguardar 5 segundos antes de verificar os botões
    function iniciarAcesso() {
        console.log("Esperando 5 segundos antes de iniciar a verificação dos botões...");
        setTimeout(checkButtons, 5000);
    }

    // Inicia a verificação dos botões após 5 segundos
    iniciarAcesso();
})();
