// ==UserScript==
// @name         ChatGPT Furigana Formater
// @version      2025.01.26.16.24
// @description  ChatGPT Furigana formating
// @author       Remy Maetz
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @namespace https://greasyfork.org/users/1426050
// @downloadURL https://update.greasyfork.org/scripts/524501/ChatGPT%20Furigana%20Formater.user.js
// @updateURL https://update.greasyfork.org/scripts/524501/ChatGPT%20Furigana%20Formater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isFormating = false;

    // Fonction pour transformer le texte en ajoutant les furigana
    function formatTextWithFurigana(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

        // Désactive temporairement l'observateur
        observer.disconnect();
        isFormating = true;

        // Collecter tous les nœuds texte dans une liste avant de modifier
        let textNodes = [];
        let walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // Parcourir les nœuds collectés et appliquer les modifications
        textNodes.forEach(node => {
            let updatedText = node.nodeValue.replace(/\[\[(.*?)\]\]\{\{(.*?)\}\}/gu, (match, kanji, kana) => {
                return `<ruby>${kanji}<rt>${kana}</rt></ruby>`;
            });

            if (updatedText !== node.nodeValue) {
                let span = document.createElement('span');
                span.innerHTML = updatedText;
                node.parentNode.replaceChild(span, node);
            }
        });

        // Réactive l'observateur après le formatage
        isFormating = false;
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Appliquer le formatage à tout le body ou une section spécifique
    function applyFuriganaFormatting() {
        if (isFormating) return; // Vérification supplémentaire
        formatTextWithFurigana(document.body); // Cible le body
    }

    let formatTimeout;

    // Observer pour détecter les changements dynamiques avec délai
    const observer = new MutationObserver(() => {
        if (isFormating) return; // Évite les déclenchements multiples

        clearTimeout(formatTimeout); // Réinitialise le délai à chaque changement
        formatTimeout = setTimeout(() => {
            applyFuriganaFormatting();
        }, 5000); // Délai de 5 secondes
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Appliquer le formatage initialement
    window.addEventListener('load', applyFuriganaFormatting);
})();
