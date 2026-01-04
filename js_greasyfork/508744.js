// ==UserScript==
// @name         DuckDuckGo Search Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Effettua una ricerca su DuckDuckGo nella parte laterale destra della pagina
// @author       Magneto1
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/508744/DuckDuckGo%20Search%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/508744/DuckDuckGo%20Search%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per effettuare una ricerca su DuckDuckGo
    function searchDuckDuckGo() {
        const query = prompt('Inserisci il termine di ricerca per DuckDuckGo:');
        if (query) {
            const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
            const width = 800; // Larghezza della finestra
            const height = 600; // Altezza della finestra
            const left = window.screenX + window.innerWidth; // Posizione a destra della pagina corrente
            const top = window.screenY; // Posizione in alto

            // Apri la finestra pop-up
            const newWindow = window.open(searchUrl, 'DuckDuckGoSearch', `width=${width},height=${height},left=${left},top=${top},resizable=yes`);

            // Controlla se il pop-up è stato bloccato
            if (!newWindow) {
                alert('Il pop-up è stato bloccato. Assicurati di consentire i pop-up per questo sito.');
            }
        } else {
            alert('Per favore, inserisci un termine di ricerca valido.');
        }
    }

    // Aggiungi un comando al menu di Violentmonkey per la ricerca su DuckDuckGo
    GM_registerMenuCommand("Cerca su DuckDuckGo", searchDuckDuckGo);
})();
