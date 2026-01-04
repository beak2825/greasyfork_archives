// ==UserScript==
// @name         Mydealz Emoji Entferner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Entfernt alle Emojis aus .userHtml-content auf mydealz.de
// @match        https://www.mydealz.de/*
// @author       MD928835
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535915/Mydealz%20Emoji%20Entferner.user.js
// @updateURL https://update.greasyfork.org/scripts/535915/Mydealz%20Emoji%20Entferner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Entfernen von Emojis aus einem Text
    function removeEmojis(text) {
        return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    }

    // Funktion zum Verarbeiten aller .userHtml-content Elemente
    function processElements() {
        const elements = document.querySelectorAll('.userHtml-content');

        elements.forEach(element => {
            // Alle Textknoten im Element finden und verarbeiten
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            let node;

            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            // Emojis aus allen Textknoten entfernen
            textNodes.forEach(textNode => {
                const originalText = textNode.nodeValue;
                const cleanedText = removeEmojis(originalText);

                if (originalText !== cleanedText) {
                    textNode.nodeValue = cleanedText;
                }
            });
        });
    }

    // Initial ausführen
    processElements();

    // MutationObserver für dynamisch geladene Inhalte
    const observer = new MutationObserver(mutations => {
        let shouldProcess = false;

        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
            }
        });

        if (shouldProcess) {
            processElements();
        }
    });

    // Beobachte Änderungen im gesamten Dokument
    observer.observe(document.body, { childList: true, subtree: true });
})();
