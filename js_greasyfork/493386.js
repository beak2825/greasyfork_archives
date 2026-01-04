// ==UserScript==
// @name         Remove ad block pop-up (Habblet Client)
// @namespace    http://tampermonkey.net/
// @version      2024-04-24
// @description  Remove adblock messages
// @author       Luann
// @match        https://www.habblet.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=habblet.city
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493386/Remove%20ad%20block%20pop-up%20%28Habblet%20Client%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493386/Remove%20ad%20block%20pop-up%20%28Habblet%20Client%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para remover a div
    function removeDiv() {
        var divToRemove = document.querySelector('.fc-ab-root');
        if (divToRemove) {
            divToRemove.remove();
        }
    }

    // Cria um observador de mutação para observar mudanças no DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Verifica se a div com a classe fc-ab-root foi adicionada ao DOM
            if (mutation.addedNodes && mutation.addedNodes.length) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].classList && mutation.addedNodes[i].classList.contains('fc-ab-root')) {
                        // Se a div foi adicionada, remove o observador e remove a div
                        observer.disconnect();
                        removeDiv();
                        return;
                    }
                }
            }
        });
    });

    // Configurações do observador de mutação (observar mudanças na subárvore do documento e adicionar/remover nós)
    var config = { childList: true, subtree: true };

    // Inicia o observador de mutação
    observer.observe(document.body, config);
})();