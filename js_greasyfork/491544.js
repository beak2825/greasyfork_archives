// ==UserScript==
// @name         Alterar Título e Ícone da Página
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Script para alterar o título e o ícone da página
// @author       BSH
// @match        *://*.chatgpt.com/*
// @match        *://*.openai.com/*
// @match        *://*.perplexity.ai/*
// @match        *://*.claude.ai/*
// @match        *://*.claude.com/*
// @match        *://*.windsurf.com/*
// @match        *://*.cursor.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491544/Alterar%20T%C3%ADtulo%20e%20%C3%8Dcone%20da%20P%C3%A1gina.user.js
// @updateURL https://update.greasyfork.org/scripts/491544/Alterar%20T%C3%ADtulo%20e%20%C3%8Dcone%20da%20P%C3%A1gina.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL do ícone
    const iconUrl = 'https://www.google.com/favicon.ico';

    function changeTitleAndIcon() {
        // Altera o título
        document.title = "Google";

        // Altera os ícones
        const iconLinkTypes = ['icon', 'apple-touch-icon', 'shortcut icon', 'apple-touch-icon-precomposed'];
        for (let type of iconLinkTypes) {
            let link = document.querySelector(`link[rel*='${type}']`);
            if (link) {
                link.href = iconUrl;
            } else {
                link = document.createElement('link');
                link.rel = type;
                link.href = iconUrl;
                document.head.appendChild(link);
            }
        }

        // Altera a meta tag og:image
        let metaOgImage = document.querySelector(`meta[property='og:image']`);
        if (metaOgImage) {
            metaOgImage.content = iconUrl;
        }
    }

    // Chama a função changeTitleAndIcon a cada 1000 milissegundos (ou seja, 1 segundo)
    setInterval(changeTitleAndIcon, 1000);
})();