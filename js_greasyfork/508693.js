// ==UserScript==
// @name         Text Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Evidenzia il testo su una pagina web
// @author       Magneto1
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/508693/Text%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/508693/Text%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aggiungi uno stile per l'evidenziazione
    GM_addStyle(`
        .highlight {
            background-color: yellow;
            cursor: pointer;
        }
    `);

    // Funzione per evidenziare il testo selezionato
    const highlightSelectedText = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.className = 'highlight';
            range.surroundContents(span);
            saveHighlights();
        }
    };

    // Funzione per salvare le evidenziazioni nel localStorage
    const saveHighlights = () => {
        const highlights = document.querySelectorAll('.highlight');
        const highlightArray = Array.from(highlights).map(highlight => highlight.innerText);
        localStorage.setItem('highlights', JSON.stringify(highlightArray));
    };

    // Funzione per caricare le evidenziazioni dal localStorage
    const loadHighlights = () => {
        const highlights = JSON.parse(localStorage.getItem('highlights')) || [];
        highlights.forEach(text => {
            const regex = new RegExp(text, 'g');
            document.body.innerHTML = document.body.innerHTML.replace(regex, `<span class="highlight">${text}</span>`);
        });
    };

    // Carica le evidenziazioni all'avvio
    loadHighlights();

    // Aggiungi un comando al menu di Violentmonkey per evidenziare il testo
    GM_registerMenuCommand("Evidenzia Testo Selezionato", highlightSelectedText);
})();

