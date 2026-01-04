// ==UserScript==
// @name         YouTube Link Extractor - myLifeTV
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Estrae i link YouTube con struttura HTML specifica
// @author       Flejta
// @match        https://www.mylifetv.it/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530164/YouTube%20Link%20Extractor%20-%20myLifeTV.user.js
// @updateURL https://update.greasyfork.org/scripts/530164/YouTube%20Link%20Extractor%20-%20myLifeTV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Flag per evitare esecuzioni multiple
    let hasExtractedLinks = false;

    // Funzione per estrarre gli ID dei video YouTube
    function extractYouTubeLinks() {
        // Se i link sono già stati estratti, esci
        if (hasExtractedLinks) return;

        // Seleziona solo gli elementi con la struttura HTML specifica
        const youtubeElements = document.querySelectorAll(
            'div.rll-youtube-player[data-src^="https://www.youtube.com/embed/"][data-id]'
        );

        // Array per memorizzare i link estratti
        const youtubeLinks = [];

        // Itera attraverso gli elementi trovati
        youtubeElements.forEach(element => {
            // Estrai l'ID del video dall'attributo data-id
            const videoId = element.getAttribute('data-id');

            if (videoId) {
                const fullLink = `https://www.youtube.com/watch?v=${videoId}`;
                youtubeLinks.push(fullLink);
            }
        });

        // Rimuovi i duplicati
        const uniqueLinks = [...new Set(youtubeLinks)];

        // Crea una stringa con i link separati da nuova riga
        const linksString = uniqueLinks.join('\n');

        // Log dei link in formato compatto
        console.log('YouTube Links Estratti (un link per riga):');
        console.log(linksString);

        // Copia nei clipboard (opzionale)
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(linksString, 'text/plain');
            console.log('Link copiati negli appunti');
        }

        // Mostra il numero totale di link trovati
        console.log(`Totale link YouTube estratti: ${uniqueLinks.length}`);

        // Imposta il flag per evitare riesecuzioni
        hasExtractedLinks = true;

        return uniqueLinks;
    }

    // Esegui l'estrazione una sola volta all'avvio della pagina
    extractYouTubeLinks();

    // Observer con soglia per ridurre le chiamate multiple
    const observer = new MutationObserver((mutations, obs) => {
        // Se i link sono già stati estratti, disconnetti l'observer
        if (hasExtractedLinks) {
            obs.disconnect();
            return;
        }

        // Estrai i link solo se non sono ancora stati estratti
        extractYouTubeLinks();
    });

    // Configura l'observer per osservare modifiche più significative
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
    });
})();