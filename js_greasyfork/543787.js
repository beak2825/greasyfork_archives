// ==UserScript==
// @name         Fixar botão Next no Flowermanga
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixar o botão "Next" na tela enquanto você rola a página no site flowermanga.net
// @match        https://flowermanga.net/manga/*
// @icon         https://flowermanga.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543787/Fixar%20bot%C3%A3o%20Next%20no%20Flowermanga.user.js
// @updateURL https://update.greasyfork.org/scripts/543787/Fixar%20bot%C3%A3o%20Next%20no%20Flowermanga.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Esperar o carregamento da página
    window.addEventListener('load', function() {
        const nextBtn = document.querySelector('a.next_page');

        if (nextBtn) {
            // Clonar botão para evitar conflitos
            const fixedBtn = nextBtn.cloneNode(true);

            // Estilo fixo no canto inferior direito
            fixedBtn.style.position = 'fixed';
            fixedBtn.style.bottom = '20px';
            fixedBtn.style.right = '20px';
            fixedBtn.style.zIndex = '9999';
            fixedBtn.style.padding = '10px 20px';
            fixedBtn.style.backgroundColor = '#e91e63';
            fixedBtn.style.color = '#fff';
            fixedBtn.style.fontWeight = 'bold';
            fixedBtn.style.borderRadius = '8px';
            fixedBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
            fixedBtn.style.textDecoration = 'none';

            // Adiciona o botão fixo à tela
            document.body.appendChild(fixedBtn);
        }
    }, false);
})();
