// ==UserScript==
// @name         Kyoto Library Viewer Launcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sulle pagine dei libri, trova il viewer Mirador e fornisce un pulsante per aprirlo in una nuova scheda.
// @author       Flejta & Gemini
// @match        https://rmda.kulib.kyoto-u.ac.jp/item/*
// @grant        GM_addStyle
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/538855/Kyoto%20Library%20Viewer%20Launcher.user.js
// @updateURL https://update.greasyfork.org/scripts/538855/Kyoto%20Library%20Viewer%20Launcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addLauncherButton() {
        // Trova l'iframe del viewer nella pagina
        const viewerIframe = document.querySelector('iframe.viewer-iframe');

        if (!viewerIframe) {
            console.log("Launcher: Iframe del viewer non trovato in questa pagina.");
            return;
        }

        // Estrai l'URL relativo del viewer
        const relativeSrc = viewerIframe.getAttribute('src');
        if (!relativeSrc) {
            console.error("Launcher: L'iframe ha la classe corretta ma non ha un attributo 'src'.");
            return;
        }

        // Costruisci l'URL completo
        const fullViewerUrl = window.location.origin + relativeSrc;
        console.log("Launcher: URL del viewer trovato:", fullViewerUrl);

        // Crea il pulsante per lanciare il viewer
        const button = document.createElement('button');
        button.innerText = 'Apri Viewer in Nuova Scheda';
        button.id = 'mirador-launcher-button';
        document.body.appendChild(button);

        // Aggiungi l'azione al click
        button.addEventListener('click', () => {
            // Apri il viewer in una nuova scheda. I browser di solito lo permettono perché
            // è una diretta conseguenza di un'azione dell'utente.
            window.open(fullViewerUrl, '_blank');
        });

        // Stile per il pulsante
        GM_addStyle(`
            #mirador-launcher-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 999999;
                padding: 15px 25px;
                background-color: #28a745; /* Verde per distinguerlo */
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-family: sans-serif;
                font-size: 18px;
                font-weight: bold;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                transition: all 0.2s ease-in-out;
            }
            #mirador-launcher-button:hover {
                background-color: #218838;
                transform: scale(1.05);
            }
        `);
    }

    // Esegui lo script dopo che la pagina è completamente caricata
    window.addEventListener('load', addLauncherButton, false);

})();