// ==UserScript==
// @name         Archive.org PDF Link Finder (v6 - Hybrid)
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Combina l'estrazione veloce dal DOM con un inserimento paziente del pulsante nella barra di navigazione, attendendo che sia pronta.
// @author       Flejta e Gemini
// @match        https://archive.org/details/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://archive.org/images/glogo.png
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/538861/Archiveorg%20PDF%20Link%20Finder%20%28v6%20-%20Hybrid%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538861/Archiveorg%20PDF%20Link%20Finder%20%28v6%20-%20Hybrid%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_PREFIX = '[PDF Finder v6]';
    console.log(`${SCRIPT_PREFIX} Script avviato. Cerco il link di download nel DOM...`);

    // Funzione per creare il pulsante personalizzato.
    // Proverà ripetutamente finché non troverà il posto giusto.
    function createCustomButton(url) {
        // Aggiungiamo lo stile solo quando siamo sicuri di poter creare il pulsante.
        GM_addStyle(`
            #pdf-download-button {
                display: inline-flex;
                align-items: center;
                height: 40px;
                background-color: #007bff;
                color: white !important;
                padding: 0 15px;
                margin-right: 10px;
                border: none;
                border-radius: 3px;
                font-size: 14px;
                font-weight: bold;
                text-decoration: none !important;
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                transition: background-color 0.3s;
            }
            #pdf-download-button:hover {
                background-color: #0056b3;
                color: white !important;
            }
        `);

        let attempts = 0;
        const maxAttempts = 40; // Prova per un massimo di 20 secondi (40 * 500ms)

        const buttonInterval = setInterval(() => {
            attempts++;
            if (document.getElementById('pdf-download-button')) {
                 console.log(`${SCRIPT_PREFIX} Pulsante già esistente, fermo il tentativo.`);
                 clearInterval(buttonInterval);
                 return;
            }

            const topNav = document.querySelector('ia-topnav');
            if (topNav && topNav.shadowRoot) {
                const insertTarget = topNav.shadowRoot.querySelector('.right-side-section');
                if (insertTarget) {
                    // Trovato! Fermiamo il timer e creiamo il pulsante.
                    clearInterval(buttonInterval);
                    console.log(`${SCRIPT_PREFIX} Trovato target per l'inserimento dopo ${attempts} tentativi. Creo il pulsante...`);

                    const button = document.createElement('a');
                    button.id = 'pdf-download-button';
                    button.href = url;
                    button.textContent = '⬇️ Scarica PDF';
                    button.setAttribute('download', '');
                    button.setAttribute('target', '_blank');

                    insertTarget.prepend(button);
                    console.log(`${SCRIPT_PREFIX} ✅ Pulsante inserito con successo!`);
                }
            }

            if (attempts >= maxAttempts) {
                console.log(`${SCRIPT_PREFIX} ❌ Impossibile trovare il target per il pulsante dopo ${maxAttempts} tentativi. Il link è disponibile in console.`);
                clearInterval(buttonInterval);
            }

        }, 500); // Controlla ogni mezzo secondo
    }

    // Cerchiamo l'elemento del link non appena possibile.
    const pdfLinkElement = document.querySelector('a.download-pill[href$=".pdf"]');

    if (pdfLinkElement) {
        const relativeUrl = pdfLinkElement.getAttribute('href');
        const absoluteUrl = new URL(relativeUrl, window.location.origin).href;

        console.log(`${SCRIPT_PREFIX} ✅ Trovato elemento del link PDF. URL: ${absoluteUrl}`);

        // Ora che abbiamo l'URL, avviamo il processo per creare il pulsante.
        createCustomButton(absoluteUrl);
    } else {
        console.log(`${SCRIPT_PREFIX} ❌ Nessun link di download PDF trovato nel DOM.`);
    }

})();