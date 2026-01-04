// ==UserScript==
// @name         Text Extractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Estrae il testo di una pagina web e lo salva in un file .txt
// @author       Magneto1
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/508908/Text%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/508908/Text%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per estrarre il testo dalla pagina e salvarlo in un file .txt
    function extractText() {
        const bodyText = document.body.innerText; // Estrae il testo dal corpo della pagina
        if (bodyText) {
            const blob = new Blob([bodyText], { type: 'text/plain' }); // Crea un blob di testo
            const url = URL.createObjectURL(blob); // Crea un URL per il blob
            const a = document.createElement('a'); // Crea un elemento <a> per il download
            a.href = url;
            a.download = 'estratto.txt'; // Nome del file di download
            document.body.appendChild(a); // Aggiungi l'elemento al DOM
            a.click(); // Simula un clic per avviare il download
            document.body.removeChild(a); // Rimuovi l'elemento dal DOM
            URL.revokeObjectURL(url); // Revoca l'URL per liberare risorse
            alert('Testo estratto e salvato in estratto.txt!');
        } else {
            alert('Nessun testo trovato nella pagina.');
        }
    }

    // Aggiungi un comando al menu di Violentmonkey per estrarre il testo
    GM_registerMenuCommand("Estrai Testo dalla Pagina", extractText);

    // Aggiungi un listener per la combinazione di tasti Ctrl + I
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'i') {
            event.preventDefault(); // Previene l'azione predefinita
            extractText();
        }
    });
})();
