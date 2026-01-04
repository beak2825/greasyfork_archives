// ==UserScript==
// @name         mypikpak - open folders with one click
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  open folders with one click in the web version of mypikpak
// @author       Seu Nome
// @match        https://mypikpak.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481553/mypikpak%20-%20open%20folders%20with%20one%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/481553/mypikpak%20-%20open%20folders%20with%20one%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para simular um duplo clique
    function simulateDoubleClick(element) {
        var event = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }

    // Verifica se o elemento possui a classe "folder-cover" ou "folder-explorer__row" e simula um duplo clique
    function handleElementClick(event) {
        var target = event.target;
        if (target.classList.contains('folder-cover') || target.closest('.folder-cover')) {
            simulateDoubleClick(target.closest('.folder-cover'));
        } else if (target.classList.contains('folder-explorer__row') || target.closest('.folder-explorer__row')) {
            simulateDoubleClick(target.closest('.folder-explorer__row'));
        }
    }

    // Adiciona o ouvinte de eventos para capturar o clique no documento
    document.addEventListener('click', handleElementClick);
})();
