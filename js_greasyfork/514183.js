// ==UserScript==
// @name         Copiar Todos os Links com Atalho
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copia todos os links <a> da página ao pressionar a tecla *.
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/514183/Copiar%20Todos%20os%20Links%20com%20Atalho.user.js
// @updateURL https://update.greasyfork.org/scripts/514183/Copiar%20Todos%20os%20Links%20com%20Atalho.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adiciona um evento de teclado para detectar quando * é pressionado
    document.addEventListener('keydown', function(event) {
        if (event.key === '*') {  // Verifica se a tecla pressionada foi *
            // Seleciona todos os links <a> na página
            const allLinks = [...document.querySelectorAll('a')].map(link => link.href).join('\n');
            // Copia todos os links para a área de transferência
            GM_setClipboard(allLinks);
            alert('Todos os links foram copiados para a área de transferência!');
        }
    });
})();
// ==UserScript==
// @name        New script chatgpt.com
// @namespace   Violentmonkey Scripts
// @match       https://chatgpt.com/c/6715d420-d0ec-8003-9a0c-5eeb8cb18c2d*
// @grant       none
// @version     1.0
// @author      -
// @description 21/10/2024, 01:13:33a
// ==/UserScript==
