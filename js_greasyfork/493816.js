// ==UserScript==
// @name         Blazing Bits Auto Claim quests
// @namespace    blazingbits.auto.claim
// @version      0.1
// @description  Claim rewards on Blazing Bits quests page and redirect to battles page
// @author       You
// @match        https://blazingbits.org/quests
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493816/Blazing%20Bits%20Auto%20Claim%20quests.user.js
// @updateURL https://update.greasyfork.org/scripts/493816/Blazing%20Bits%20Auto%20Claim%20quests.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para clicar em todos os botões "Claim Reward"
    function clicarEmTodosOsBotoes() {
        console.log("Clicando em todos os botões 'Claim Reward'...");

        var buttons = document.querySelectorAll('button.button-normal2.text-center.w-100.mt-2');
        if (buttons) {
            buttons.forEach(function(button, index) {
                setTimeout(function() {
                    button.click();
                }, index * 2000); // Intervalo de 2 segundo entre os cliques
            });
        } else {
            console.log("Nenhum botão 'Claim Reward' encontrado.");
        }

        // Redirecionar para a página de batalhas após um intervalo de tempo
        setTimeout(function() {
            console.log("Redirecionando para a página de batalhas...");
            window.location.href = "https://blazingbits.org/battles";
        }, buttons.length * 1000 + 3000); // Tempo total = número de botões * intervalo de tempo entre cliques + 3 segundos
    }

    // Aguardar 3 segundos para garantir que a página carregue completamente
    setTimeout(clicarEmTodosOsBotoes, 3000);
})();
