// ==UserScript==
// @name         Extract Links from Span Text
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Extract href links from span text and make them clickable
// @match        http://eskvido.edrive.cz/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/520896/Extract%20Links%20from%20Span%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/520896/Extract%20Links%20from%20Span%20Text.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Funkce pro zpracování textu ve span elementech
    function makeSpansClickable() {
        document.querySelectorAll('span').forEach(span => {
            const text = span.textContent; // Získáme čistý text z elementu
            // Hledáme část href odkazu v textu
            const match = text.match(/href="([^"]+)"/);
            if (match) {
                const href = match[1]; // Extrahujeme URL z href

                // Nastavíme kurzor ruky, aby bylo zřejmé, že je to klikací
                span.style.cursor = 'pointer';
                span.style.color = 'blue'; // Odkazová barva
                span.style.textDecoration = 'underline';

                // Přidáme událost kliknutí
                span.addEventListener('click', () => {
                    window.open(href, '_blank'); // Otevření URL v nové záložce
                });
            }
        });
    }

    // Spuštění funkce při načtení stránky
    makeSpansClickable();

    // Sledování dynamických změn v DOM
    const observer = new MutationObserver(() => {
        makeSpansClickable();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
