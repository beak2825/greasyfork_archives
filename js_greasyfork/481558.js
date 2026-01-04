// ==UserScript==
// @name         mypikpak - automatic download
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks on the "high-speed cloud download" button
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481558/mypikpak%20-%20automatic%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/481558/mypikpak%20-%20automatic%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para clicar no botão
    function clickButton() {
        var button = document.querySelector('.btn-groups [class="btn btn__create-task"]');
        if (button) {
            button.click();
        } else {
            console.log("O elemento não foi encontrado.");
        }
    }

    // Função para verificar continuamente a presença do elemento
    function checkButton() {
        var button = document.querySelector('.btn-groups [class="btn btn__create-task"]');
        if (button) {
            clickButton();
        } else {
            setTimeout(checkButton, 1000); // Verifica novamente após 1 segundo
        }
    }

    // Observador de mutação para detectar alterações na página
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                // Verifica se algum nó adicionado possui a classe desejada
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.classList && node.classList.contains('btn') && node.classList.contains('btn__create-task')) {
                        clickButton();
                        return;
                    }
                }
            }
        });
    });

    // Configurações do observador de mutação
    var observerConfig = {
        childList: true,
        subtree: true
    };

    // Inicia o observador de mutação
    observer.observe(document.documentElement, observerConfig);

    // Inicia a verificação do botão ao carregar a página
    window.addEventListener('load', function() {
        checkButton();
    });
})();
