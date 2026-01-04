// ==UserScript==
// @name         OneDrive Direct Link Generator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Genera link diretti da link di condivisione di OneDrive
// @author       Tu
// @match        https://onedrive.live.com/?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509570/OneDrive%20Direct%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/509570/OneDrive%20Direct%20Link%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crea un div per l'interfaccia
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px'; // Posiziona in basso
    container.style.right = '10px';  // Posiziona a destra
    container.style.backgroundColor = '#fff';
    container.style.border = '1px solid #ccc';
    container.style.padding = '10px';
    container.style.zIndex = '1000';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)'; // Aggiunge ombra

    // Crea un campo di input
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Inserisci il link di condivisione';
    inputField.style.width = '200px'; // Larghezza del campo di input

    // Crea un pulsante per generare il link diretto
    const generateButton = document.createElement('button');
    generateButton.innerText = 'Crea Direct Link';
    generateButton.style.marginLeft = '5px';

    // Crea un campo per mostrare il link diretto
    const outputField = document.createElement('input');
    outputField.type = 'text';
    outputField.readOnly = true;
    outputField.style.width = '200px'; // Larghezza del campo di output
    outputField.style.marginTop = '10px';

    // Funzione per generare il link diretto
    generateButton.onclick = function() {
        const link = inputField.value;
        if (link) {
            const baseLink = link.split('?')[0];
            const directLink = baseLink + '?download=1';
            outputField.value = directLink;
        } else {
            alert("Per favore, inserisci un link valido.");
        }
    };

    // Aggiungi elementi al container
    container.appendChild(inputField);
    container.appendChild(generateButton);
    container.appendChild(outputField);

    // Aggiungi il container al body
    document.body.appendChild(container);
})();
