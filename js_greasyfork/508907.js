// ==UserScript==
// @name         Dark Mode Toggle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Attiva la modalità scura in una pagina web con miglior contrasto
// @author       Magneto1
// @match        *://*/*
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://unpkg.com/darkreader@4.9.58/darkreader.js
// @downloadURL https://update.greasyfork.org/scripts/508907/Dark%20Mode%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/508907/Dark%20Mode%20Toggle.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const namespace = 'dark-mode-toggle';
    const btn = document.createElement('button');

    // Crea il pulsante
    btn.textContent = '🌙';
    btn.id = namespace;
    btn.style.position = 'fixed';
    btn.style.bottom = '10px';
    btn.style.left = '10px';
    btn.style.zIndex = '10000';
    btn.style.fontSize = '20px';
    btn.style.opacity = '0.7';
    btn.style.border = 'none';
    btn.style.backgroundColor = 'transparent';
    btn.style.cursor = 'pointer';

    // Aggiungi il pulsante al corpo del documento
    document.body.appendChild(btn);

    // Funzione per attivare/disattivare la modalità scura
    const toggleDarkMode = async () => {
        if (await GM.getValue('darkModeEnabled')) {
            await GM.setValue('darkModeEnabled', false);
            DarkReader.disable();
            btn.textContent = '🌙'; // Icona per modalità chiara
        } else {
            await GM.setValue('darkModeEnabled', true);
            DarkReader.setFetchMethod(window.fetch);
            DarkReader.enable({
                brightness: 100,
                contrast: 90,
                sepia: 10
            });
            btn.textContent = '☀️'; // Icona per modalità scura
        }
    };

    // Imposta il comportamento del pulsante
    btn.onclick = toggleDarkMode;

    // Controlla se la modalità scura è già attivata
    try {
        if (await GM.getValue('darkModeEnabled')) {
            DarkReader.setFetchMethod(window.fetch);
            DarkReader.enable({
                brightness: 100,
                contrast: 90,
                sepia: 10
            });
            btn.textContent = '☀️'; // Icona per modalità scura
        }
    } catch (err) {
        console.warn('Errore nel recupero dello stato della modalità scura:', err);
    }
})();
