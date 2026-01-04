// ==UserScript==
// @name         RSS Feed Extractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Estrae il feed RSS di una pagina web
// @author       Magneto1
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/508905/RSS%20Feed%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/508905/RSS%20Feed%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per estrarre il feed RSS
    const extractRSSFeed = () => {
        // Cerca i link al feed RSS nella pagina
        const links = document.querySelectorAll('link[type="application/rss+xml"], link[type="application/atom+xml"]');
        if (links.length > 0) {
            // Se trova almeno un link, mostra il primo in un alert
            const rssFeedUrl = links[0].href;
            alert(`Feed RSS trovato: ${rssFeedUrl}`);
        } else {
            alert('Nessun feed RSS trovato in questa pagina.');
        }
    };

    // Aggiungi un comando al menu di Violentmonkey per estrarre il feed RSS
    GM_registerMenuCommand("Estrai Feed RSS", extractRSSFeed);
})();
