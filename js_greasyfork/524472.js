// ==UserScript==
// @name             Tela Cheia
// @description      Deixa o navegador em tela cheia
// @namespace        CowanSCREEN
// @license          GPL-3.0
// @version          2.0
// @author           Cowanbas
// @match            *://*/*
// @run-at           document-start
// @downloadURL https://update.greasyfork.org/scripts/524472/Tela%20Cheia.user.js
// @updateURL https://update.greasyfork.org/scripts/524472/Tela%20Cheia.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Cria um novo elemento <style> para adicionar ao documento
    const style = document.createElement('style');

    // Define o conteúdo CSS que será aplicado aos elementos da página
    style.textContent = `
        div[tabindex="-1"].two {
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
        }
        
        div[tabindex="-1"].two > ._aigw.x9f619 {
            flex: none !important;
            resize: horizontal !important;
            max-width: 50% !important;
            min-width: min-content !important;
            overflow: auto !important;
        }
    `;
    // Adiciona o elemento <style> ao <head> do documento, aplicando os estilos definidos
    document.head.appendChild(style);

})();