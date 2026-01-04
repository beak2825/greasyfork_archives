// ==UserScript==
// @name         Responde Aí Resolução Livros
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script para ver o conteudo de resolução de livros do Responde Aí. Você precisa estar logado.
// @author       Isa56
// @match        https://www.respondeai.com.br/*
// @match        https://www.respondeai.com.br/materias/solucionario/livro/*
// @match        https://www.respondeai.com.br/praticar/*/lista/*
// @match        https://www.respondeai.com.br/materias/solucionario/livro/1/edicao/18/*
// @match        https://www.respondeai.com.br/materias/solucionario/livro/1/edicao/18/exercicio/*
// @match        https://app.respondeai.com.br/materias/solucionario/livro/*
// @match        https://www.respondeai.com.br/praticar/218/lista/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/535708/Responde%20A%C3%AD%20Resolu%C3%A7%C3%A3o%20Livros.user.js
// @updateURL https://update.greasyfork.org/scripts/535708/Responde%20A%C3%AD%20Resolu%C3%A7%C3%A3o%20Livros.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;

                const modal = node.querySelector('.sc-gAmQfK');

                if (node.classList?.contains('sc-gAmQfK') || modal) {
                    removePaymentModal();
                }

                const disclaimer = node.querySelector('[class*="NoAccessDisclaimer__Container-"]');

                if (node.className?.includes('NoAccessDisclaimer__Container-') || disclaimer) {
                    removeLoginDisclaimer();
                    unblur();
                }

            });
        });
    });

    function removePaymentModal() {
        const modal = document.querySelector('.sc-gAmQfK');
        if (!modal) return;

        // Tentar clicar no primeiro elemento atrás do modal
        const backdrop = modal.parentElement;
        if (backdrop && backdrop instanceof HTMLElement) {
            backdrop.click();
        }
    }

    function removeLoginDisclaimer() {
        let loginElements = document.querySelectorAll('[class*="NoAccessDisclaimer__Container-"]');
        loginElements.forEach(el => {
            el.style.display = 'none';
        });
    }

    function unblur() {
        const allElements = document.querySelectorAll('*');
        // console.log('allElements!', allElements);
        allElements.forEach(el => {
            const style = getComputedStyle(el);
            if(style.filter.includes('blur')) {
                el.style.setProperty('filter', 'none', 'important');
            }
        });
    }

    observer.observe(document.body, { childList: true, subtree: true });
})();