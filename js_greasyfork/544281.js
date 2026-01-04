// ==UserScript==
// @name        [Biblioteche di Roma] Salva risultati di ricerca
// @namespace   http://tampermonkey.net/
// @version     3.0
// @description Estrae schede Elsa Morante. Alternativamente ridurre scala di stampa
// @author      Lawrence R. d'Aniello
// @match       https://www.bibliotechediroma.it/opac/*
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/544281/%5BBiblioteche%20di%20Roma%5D%20Salva%20risultati%20di%20ricerca.user.js
// @updateURL https://update.greasyfork.org/scripts/544281/%5BBiblioteche%20di%20Roma%5D%20Salva%20risultati%20di%20ricerca.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Stili CSS
    const style = document.createElement('style');
    style.textContent = `
        .printer-button {
            background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYgOVY2QTIgMiAwIDAgMSA4IDRIMTZBMiAyIDAgMCAxIDE4IDZWOSIgc3Ryb2tlPSIjNjY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNNiAxOEg0QTIgMiAwIDAgMSAyIDE2VjEwQTIgMiAwIDAgMSA0IDhIMjBBMiAyIDAgMCAxIDIyIDEwVjE2QTIgMiAwIDAgMSAyMCAxOEgxOCIgc3Ryb2tlPSIjNjY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTggMTRIOEEyIDIgMCAwIDAgNiAxNlYyMEEyIDIgMCAwIDAgOCAyMkgxNkEyIDIgMCAwIDAgMTggMjBWMTZBMiAyIDAgMCAwIDE2IDE0WjE4IDE0WiIgc3Ryb2tlPSIjNjY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K') no-repeat center;
            background-size: 28px 28px;
            width: 38px;
            height: 38px;
            display: block;
            cursor: pointer;
            border: none;
            background-color: transparent;
            margin: 0;
            padding: 0;
        }
        .printer-button:hover {
            background-color: #f0f0f0;
            border-radius: 3px;
        }
        .servizilista.rss {
            display: block;
            width: 38px;
            height: 38px;
            margin-right: -2px;
        }
        .servizilista.rss .printer-button {
            width: 100%;
            height: 100%;
        }
        #progress-info {
            position: fixed;
            bottom: 60px;
            right: 20px;
            background: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9998;
            display: none;
        }
    `;
    document.head.appendChild(style);

    // Crea elemento per il progresso
    const progressInfo = document.createElement('div');
    progressInfo.id = 'progress-info';
    document.body.appendChild(progressInfo);

    // Funzione semplificata per estrarre la collocazione Elsa Morante
    async function getCollocation(docElement) {
        const link = docElement.querySelector('.titololistarisultati a');
        if (!link) return "Link non trovato";

        return new Promise(resolve => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const timeout = setTimeout(() => {
                document.body.removeChild(iframe);
                resolve("Timeout");
            }, 10000);

            iframe.onload = function() {
                setTimeout(() => {
                    try {
                        // Cerca direttamente la collocazione
                        const collocation = iframe.contentDocument.querySelector('.collocazione .ws-pre')?.textContent.trim() ||
                                           iframe.contentDocument.querySelector('.ws-pre')?.textContent.trim();

                        if (collocation) {
                            document.body.removeChild(iframe);
                            clearTimeout(timeout);
                            resolve(collocation);
                            return;
                        }

                        // Cerca la biblioteca Elsa Morante
                        const libraryLinks = iframe.contentDocument.querySelectorAll('#biblioteche > UL > LI > A');
                        for (const libLink of libraryLinks) {
                            if (libLink.textContent.includes('Elsa Morante')) {
                                libLink.click();
                                setTimeout(() => {
                                    const found = iframe.contentDocument.querySelector('.collocazione .ws-pre')?.textContent.trim() ||
                                                  iframe.contentDocument.querySelector('.ws-pre')?.textContent.trim();
                                    document.body.removeChild(iframe);
                                    clearTimeout(timeout);
                                    resolve(found || "Collocazione non trovata");
                                }, 1000);
                                return;
                            }
                        }

                        document.body.removeChild(iframe);
                        clearTimeout(timeout);
                        resolve("Biblioteca non trovata");
                    } catch (e) {
                        document.body.removeChild(iframe);
                        clearTimeout(timeout);
                        resolve("Errore");
                    }
                }, 1000);
            };

            iframe.src = link.href;
        });
    }

    // Funzione principale
    async function extractData() {
        const documents = document.querySelectorAll('.list-document .documento');
        if (!documents.length) {
            alert("Nessun risultato trovato");
            return;
        }

        const button = document.querySelector('.printer-button');
        if (button) button.style.opacity = '0.5';
        progressInfo.style.display = 'block';
        progressInfo.textContent = `Elaborazione 0/${documents.length}`;

        // Ottieni il termine di ricerca
        const searchInput = document.querySelector('input[name="frase"]');
        const searchTerm = searchInput ? searchInput.value : "argomento sconosciuto";

        let output = `Bibliografia relativa a ${searchTerm}\n\n`;

        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            progressInfo.textContent = `Elaborazione ${i+1}/${documents.length}`;

            const title = doc.querySelector('.titololistarisultati a')?.textContent.trim() || "Titolo non disponibile";
            const author = doc.querySelector('.autorelistarisultati a, .autorelistarisultati')?.textContent.trim() || "Autore non disponibile";
            const year = doc.querySelector('.meta-annopubblicazione')?.textContent.trim() || "Anno non disponibile";
            let publisher = doc.querySelector('.meta-editore a, .meta-editore')?.textContent.trim() || "Editore non disponibile";
            publisher = publisher.replace(/<casa editrice>/i, '').trim();
            const collocation = await getCollocation(doc);

            output += `DOCUMENTO ${i+1}\n`;
            output += `Titolo: ${title}\nAutore: ${author}\n`;
            output += `Editore: ${publisher}\nAnno: ${year}\n`;
            output += `Collocazione: ${collocation}\n\n`;

            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Crea e scarica il file
        const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bibliografia_${searchTerm.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}.txt`;
        a.click();

        progressInfo.textContent = `Completato! ${documents.length} documenti elaborati`;
        setTimeout(() => {
            progressInfo.style.display = 'none';
        }, 3000);
        if (button) button.style.opacity = '1';
    }

    // Sostituisce il pulsante RSS con il simbolo della stampante
    function replacePrinterButton() {
        const rssDiv = document.querySelector('.servizilista.rss');
        if (rssDiv && !rssDiv.querySelector('.printer-button')) {
            const rssLink = rssDiv.querySelector('a');
            if (rssLink) {
                // Crea il nuovo pulsante stampante
                const printerButton = document.createElement('button');
                printerButton.className = 'printer-button';
                printerButton.title = 'Stampa/Scarica risultati della ricerca';
                printerButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    extractData();
                });

                // Sostituisce il link RSS con il pulsante stampante
                rssLink.parentNode.replaceChild(printerButton, rssLink);
            }
        }
    }

    // Inizializza
    function initialize() {
        setTimeout(() => {
            replacePrinterButton();
        }, 1000);
    }

    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }

    // Osserva cambiamenti AJAX
    new MutationObserver(() => {
        setTimeout(replacePrinterButton, 500);
    }).observe(document, { subtree: true, childList: true });
})();