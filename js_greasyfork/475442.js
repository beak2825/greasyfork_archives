// ==UserScript==
// @name         Mostrar Bombas Visíveis
// @namespace tampermonkey.org
// @version      1.0
// @description  Mostra as bombas visíveis no jogo de acordo com os seletores fornecidos
// @author       Seu Nome
// @match        https://betfury.io/inhouse/mines
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475442/Mostrar%20Bombas%20Vis%C3%ADveis.user.js
// @updateURL https://update.greasyfork.org/scripts/475442/Mostrar%20Bombas%20Vis%C3%ADveis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adicione os seletores CSS para as bombas visíveis
    const bombSelectors = [
        'div#__nuxt > div > main > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div:nth-child(3) > button:nth-child(4) > div',
        'div#__nuxt > div > main > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div:nth-child(3) > button:nth-child(21) > div'
        // Adicione mais seletores se necessário
    ];

    // Função para mostrar as bombas visíveis
    function showVisibleBombs() {
        for (const selector of bombSelectors) {
            const bombButton = document.querySelector(selector);
            if (bombButton) {
                bombButton.style.display = 'block';
            }
        }
    }

    // Execute a função quando a página estiver completamente carregada
    window.addEventListener('load', showVisibleBombs);
})();
