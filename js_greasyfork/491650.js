// ==UserScript==
// @name         ClickUp EN-CZ Translator - GitHub Translations
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @license      MIT
// @description  Aplikuje překlady z externího zdroje na GitHubu.
// @author       You
// @match        https://app.clickup.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491650/ClickUp%20EN-CZ%20Translator%20-%20GitHub%20Translations.user.js
// @updateURL https://update.greasyfork.org/scripts/491650/ClickUp%20EN-CZ%20Translator%20-%20GitHub%20Translations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let translations = {};

    function loadTranslations() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://raw.githubusercontent.com/petrbla/Tampermonkey-scripty/main/translationsclickupcz.json",
            onload: function(response) {
                translations = JSON.parse(response.responseText);
                applyTranslations(document.body);
            },
            onerror: function(error) {
                console.log("Chyba při načítání překladů", error);
            }
        });
    }

    function applyTranslations(element) {
        if (!element || !element.querySelectorAll) return;

        function translateTextNode(node) {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
                const translatedText = translations[node.nodeValue.trim()];
                if (translatedText) {
                    node.nodeValue = translatedText;
                }
            } else {
                node.childNodes.forEach(translateTextNode);
            }

            if (node.placeholder) {
                const translatedPlaceholder = translations[node.placeholder.trim()];
                if (translatedPlaceholder) {
                    node.placeholder = translatedPlaceholder;
                }
            }
        }

        translateTextNode(element);
        element.querySelectorAll('*').forEach(translateTextNode);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(newNode => {
                if (newNode.nodeType === Node.ELEMENT_NODE) {
                    applyTranslations(newNode);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    window.addEventListener('load', loadTranslations);
})();
