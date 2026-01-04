// ==UserScript==
// @name         Trova e Copia m3u8 su YouTube
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Aggiungi un'etichetta per copiare il link m3u8 su YouTube
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508525/Trova%20e%20Copia%20m3u8%20su%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/508525/Trova%20e%20Copia%20m3u8%20su%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per cercare link m3u8 nel sorgente della pagina
    function findM3u8() {
        // Ottieni il sorgente della pagina
        var sourceCode = document.documentElement.innerHTML;

        // Cerca l'URL m3u8
        var regex = /https:\/\/manifest\.googlevideo\.com\/api\/manifest\/hls_variant\/.*\.m3u8/g;
        var matches = sourceCode.match(regex);

        // Se troviamo un link, creiamo e mostriamo un'etichetta
        if (matches && matches.length > 0) {
            createM3u8Label(matches[0]);
        }
    }

    // Funzione per creare un'etichetta nella pagina
    function createM3u8Label(link) {
        // Crea un nuovo elemento di etichetta
        var label = document.createElement('div');
        label.innerText = 'Copia m3u8';
        label.style.position = 'fixed';
        label.style.bottom = '10px';
        label.style.left = '10px';
        label.style.backgroundColor = '#ffcc00';
        label.style.color = '#000';
        label.style.padding = '10px';
        label.style.borderRadius = '5px';
        label.style.cursor = 'pointer';
        label.style.zIndex = '1000';
        label.style.fontSize = '14px';
        label.style.maxWidth = '300px';
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';

        // Aggiungi un evento click per copiare il link
        label.addEventListener('click', function() {
            // Copia il link negli appunti
            navigator.clipboard.writeText(link).then(function() {
                alert('Link m3u8 copiato negli appunti!');
            }, function(err) {
                alert('Errore nella copia del link: ' + err);
            });
        });

        // Aggiungi l'etichetta al corpo della pagina
        document.body.appendChild(label);
    }

    // Esegui la funzione quando la pagina è completamente caricata
    window.addEventListener('load', findM3u8);
})();
