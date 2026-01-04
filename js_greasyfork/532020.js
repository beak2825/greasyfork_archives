// ==UserScript==
// @name         Player full screen no ge.globo.com
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Altera o max-width dos elementos com a classe bKTuRg para 1900px apenas no site ge.globo.com
// @author       gui-nvieira
// @match        https://ge.globo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532020/Player%20full%20screen%20no%20geglobocom.user.js
// @updateURL https://update.greasyfork.org/scripts/532020/Player%20full%20screen%20no%20geglobocom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para alterar o max-width
    function alterarMaxWidth() {
        const elementos = document.querySelectorAll('.bKTuRg');
        elementos.forEach(elemento => {
            elemento.style.maxWidth = '1900px';
        });
        console.log('O max-width dos elementos com a classe "bKTuRg" foi alterado para 1900px.');
    }

    // Executa a função após o carregamento da página
    window.addEventListener('load', alterarMaxWidth);

    // Observa mudanças no DOM para aplicar a alteração em conteúdo dinâmico
    const observer = new MutationObserver(alterarMaxWidth);
    observer.observe(document.body, { childList: true, subtree: true });
})();