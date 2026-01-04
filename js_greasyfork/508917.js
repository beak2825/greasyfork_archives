// ==UserScript==
// @name         Traduttore MyMemory
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Traduci testo selezionato usando MyMemory con scelta della lingua. Lingue supportate: "Italiano": "it", "Inglese": "en", "Francese": "fr", "Spagnolo": "es", "Tedesco": "de","Portoghese": "pt", "Russo": "ru","Cinese": "zh", "Giapponese": "ja", "Coreano": "ko"
// @author       Magneto1
// @match        *://*/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/508917/Traduttore%20MyMemory.user.js
// @updateURL https://update.greasyfork.org/scripts/508917/Traduttore%20MyMemory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedText = '';

    // Crea un div per mostrare la traduzione
    const translationDiv = document.createElement('div');
    translationDiv.style.position = 'fixed';
    translationDiv.style.bottom = '20px';
    translationDiv.style.right = '20px';
    translationDiv.style.backgroundColor = 'white';
    translationDiv.style.border = '1px solid black';
    translationDiv.style.padding = '10px';
    translationDiv.style.zIndex = '10000';
    translationDiv.style.display = 'none'; // Nascondi inizialmente
    document.body.appendChild(translationDiv);

    // Funzione per tradurre il testo usando MyMemory
    function translateWithMyMemory(text, sourceLang, targetLang) {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data && data.responseData && data.responseData.translatedText) {
                        showTranslation(data.responseData.translatedText);
                    } else {
                        showError("Nessuna traduzione trovata.");
                    }
                } catch (error) {
                    showError("Si è verificato un errore nella risposta.");
                }
            },
            onerror: function() {
                showError("Impossibile contattare il servizio di traduzione.");
            }
        });
    }

    // Funzione per mostrare la traduzione
    function showTranslation(translatedText) {
        translationDiv.textContent = translatedText;

        // Aggiungi un pulsante per copiare
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copia';
        copyButton.onclick = function() {
            navigator.clipboard.writeText(translatedText).then(() => {
                alert('Testo copiato negli appunti!');
            });
        };

        // Pulisci il div e aggiungi la traduzione e il pulsante
        translationDiv.innerHTML = ''; // Pulisci il contenuto
        translationDiv.appendChild(document.createTextNode(translatedText)); // Aggiungi la traduzione
        translationDiv.appendChild(copyButton); // Aggiungi il pulsante sotto la traduzione
        translationDiv.style.display = 'block'; // Mostra il div

        // Nascondi il div dopo 5 secondi
        setTimeout(() => {
            translationDiv.style.display = 'none';
            translationDiv.innerHTML = ''; // Pulisci il contenuto
        }, 5000); // 5000 millisecondi = 5 secondi
    }

    // Funzione per mostrare un errore
    function showError(message) {
        translationDiv.textContent = message;
        translationDiv.style.display = 'block'; // Mostra il div

        // Nascondi il div dopo 5 secondi
        setTimeout(() => {
            translationDiv.style.display = 'none';
            translationDiv.textContent = ''; // Pulisci il contenuto
        }, 5000); // 5000 millisecondi = 5 secondi
    }

    // Funzione per registrare il comando di traduzione
    function registerTranslateCommand() {
        GM_registerMenuCommand("Traduci", () => {
            if (selectedText) {
                const sourceLang = prompt("Inserisci la lingua di origine (es. 'en' per inglese, 'it' per italiano):");
                const targetLang = prompt("Inserisci la lingua di destinazione (es. 'en' per inglese, 'it' per italiano):");

                if (sourceLang && targetLang) {
                    translateWithMyMemory(selectedText, sourceLang, targetLang);
                } else {
                    showError("Lingua di origine o destinazione non valida.");
                }
            } else {
                showError("Nessun testo selezionato.");
            }
        });
    }

    // Aggiungi un listener per la selezione del testo
    document.addEventListener('mouseup', function() {
        selectedText = window.getSelection().toString();
        registerTranslateCommand(); // Registra il comando ogni volta che si seleziona del testo
    });
})();
