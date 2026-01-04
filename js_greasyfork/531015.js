// ==UserScript==
// @name         Remover Elementos FootyStats
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove elementos premium e limpeza de classes h2h-blur
// @author       Rhennan Sullivan
// @match        https://footystats.org/pt/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531015/Remover%20Elementos%20FootyStats.user.js
// @updateURL https://update.greasyfork.org/scripts/531015/Remover%20Elementos%20FootyStats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para remover o elemento premium
    function removePremiumElement() {
        let premiumElement = document.querySelector('.h2h-premium-messaging-wrapper');
        if (premiumElement) {
            premiumElement.remove();
            console.log('Elemento premium removido');
        }
    }

    // Função para limpar a classe h2h-blur dentro de sections
    function cleanBlurClasses() {
        let blurredSections = document.querySelectorAll('section.h2h-blur');
        blurredSections.forEach(section => {
            section.classList.remove('h2h-blur');
            console.log('Classe h2h-blur removida de um section');
        });
    }
        // Função para limpar a classe h2h-blur dentro de sections
    function cleanBlurClasses2() {
        let blurredSections = document.querySelectorAll('div.h2h-blur');
        blurredSections.forEach(section => {
            section.classList.remove('h2h-blur');
            console.log('Classe h2h-blur removida de um section');
        });
    }

    // Executar ao carregar a página
    removePremiumElement();
    cleanBlurClasses();
    cleanBlurClasses2();

    // Observar mudanças na página (para AJAX e carregamento dinâmico)
    let observer = new MutationObserver(() => {
        removePremiumElement();
        cleanBlurClasses();
        cleanBlurClasses2();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
