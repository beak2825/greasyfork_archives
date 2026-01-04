// ==UserScript==
// @name         YouTube Transcript Export
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Estrae tutti i sottotitoli da un video di YouTube e li esporta in formato .txt o .docx - Script to transcribe youtube videos and export them to txt or docx format
// @author       Magneto1
// @match        https://www.youtube.com/watch*
// @grant        GM_xmlhttpRequest
// @connect      youtube.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508692/YouTube%20Transcript%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/508692/YouTube%20Transcript%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let transcriptText = "";
    const recordedSubtitles = new Set(); // Utilizza un Set per evitare duplicati

    // Funzione per estrarre i sottotitoli dal DOM
    function extractTranscript() {
        const transcriptElements = document.querySelectorAll('.ytp-caption-segment');
        transcriptElements.forEach(element => {
            const subtitleText = element.innerText;
            if (!recordedSubtitles.has(subtitleText)) {
                transcriptText += subtitleText + "\n";
                recordedSubtitles.add(subtitleText); // Aggiungi il sottotitolo al Set
            }
        });
    }

    // Funzione per esportare la trascrizione
    function exportTranscript() {
        const format = prompt("In quale formato vuoi esportare la trascrizione? (txt/docx)", "txt");

        if (format === "txt") {
            const blob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
            saveAs(blob, "trascrizione.txt");
        } else if (format === "docx") {
            const docxContent = `
                <!DOCTYPE html>
                <html xmlns:w="urn:schemas-microsoft-com:office:word">
                <head>
                    <meta charset="utf-8">
                    <title>Trascrizione</title>
                </head>
                <body>
                    <pre>${transcriptText}</pre>
                </body>
                </html>
            `;
            const blob = new Blob([docxContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(blob, "trascrizione.docx");
        } else {
            alert("Formato non valido. Usa 'txt' o 'docx'.");
        }
    }

    // Funzione per avviare l'estrazione dei sottotitoli
    function startExtracting() {
        transcriptText = ""; // Resetta il testo della trascrizione
        recordedSubtitles.clear(); // Resetta il Set dei sottotitoli registrati

        const interval = setInterval(() => {
            extractTranscript();
        }, 1000); // Estrae i sottotitoli ogni secondo

        // Aggiungi un pulsante per fermare l'estrazione e esportare
        const stopButton = document.createElement("button");
        stopButton.innerText = "Ferma e Esporta Trascrizione";
        stopButton.style.position = "fixed";
        stopButton.style.bottom = "10px"; // Posizione in basso
        stopButton.style.left = "150px";   // Posizione a sinistra
        stopButton.style.zIndex = "1000";
        stopButton.onclick = function() {
            clearInterval(interval);
            exportTranscript();
            document.body.removeChild(stopButton); // Rimuovi il pulsante dopo l'uso
        };

        document.body.appendChild(stopButton);
    }

    // Aggiungi un pulsante per avviare l'estrazione
    const button = document.createElement("button");
    button.innerText = "Inizia Estrazione Trascrizione";
    button.style.position = "fixed";
    button.style.bottom = "10px"; // Posizione in basso
    button.style.left = "10px";   // Posizione a sinistra
    button.style.zIndex = "1000";
    button.onclick = function() {
        startExtracting();
        button.disabled = true; // Disabilita il pulsante dopo l'avvio
    };

    document.body.appendChild(button);
})();
