// ==UserScript==
// @name         Kyoto University IIIF Manifest Extractor
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Estrae e scarica le immagini da un manifest IIIF dell'Università di Kyoto.
// @author       Flejta
// @license      MIT
// @match        https://rmda.kulib.kyoto-u.ac.jp/libraries/mirador/mirador.html*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/538854/Kyoto%20University%20IIIF%20Manifest%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/538854/Kyoto%20University%20IIIF%20Manifest%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //#region Utility Functions
    function sanitizeFilename(filename) {
        // Rimuove caratteri non validi per i nomi file
        return filename.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
                      .replace(/\s+/g, '_')
                      .substring(0, 100); // Limita lunghezza
    }

    function extractDocumentTitle() {
        // Prova diversi selettori per il titolo
        const selectors = [
            '.page-header span',
            'h1.page-header span',
            '.page-title-metadata h1 span',
            '.region-highlighted h1 span',
            'h1 span'
        ];

        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                const title = element.textContent.trim();
                console.log(`Titolo trovato con selettore "${selector}":`, title);
                return sanitizeFilename(title);
            }
        }

        // Se non trova il titolo, prova il Record ID
        const recordIdField = document.querySelector('.field--name-field-record-id .field--item');
        if (recordIdField && recordIdField.textContent.trim()) {
            const recordId = recordIdField.textContent.trim();
            console.log('Record ID trovato:', recordId);
            return sanitizeFilename(recordId);
        }

        // Ultima risorsa: prova dal title della pagina
        if (document.title && document.title !== 'Mirador') {
            console.log('Titolo dalla pagina:', document.title);
            return sanitizeFilename(document.title);
        }

        console.log('Nessun titolo trovato, usando fallback');
        return 'KyotoUniv_Document';
    }

    function promptForDocumentName(suggestedName) {
        const userInput = prompt(
            `Inserisci il nome per i file (senza estensione):\n\nSuggerimento estratto dalla pagina:`,
            suggestedName
        );

        if (userInput === null) {
            throw new Error('Download annullato dall\'utente');
        }

        return userInput.trim() || suggestedName;
    }

    function padNumber(num, length = 3) {
        return String(num).padStart(length, '0');
    }
    //#endregion

    //#region Panel Creation
    function createExtractorPanel() {
        if (document.getElementById('iiif-manifest-extractor-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'iiif-manifest-extractor-panel';
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0;">Estrattore Immagini IIIF</h3>
                <button id="close-panel-btn" style="width: auto; padding: 5px 8px; font-size: 16px; background-color: #dc3545; margin: 0;">&times;</button>
            </div>
            <p>Carica il manifest e scarica le immagini in alta risoluzione.</p>
            <button id="load-manifest-btn">1. Carica Manifest</button>
            <div id="download-all-container" style="display: none;">
                <button id="download-all-btn">📥 Download All</button>
            </div>
            <div id="image-links-container"></div>
            <div id="status-message"></div>
        `;
        document.body.appendChild(panel);

        document.getElementById('load-manifest-btn').addEventListener('click', loadAndProcessManifest);
        document.getElementById('close-panel-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        GM_addStyle(`
            #iiif-manifest-extractor-panel {
                position: fixed; top: 10px; right: 10px; z-index: 999999;
                width: 320px; max-height: 90vh; overflow-y: auto;
                padding: 15px; background-color: #f8f9fa; color: #333;
                border: 1px solid #dee2e6; border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            #iiif-manifest-extractor-panel h3 {
                margin-top: 0; color: #495057; font-size: 16px;
            }
            #iiif-manifest-extractor-panel button {
                width: 100%; padding: 12px; font-size: 14px; margin-bottom: 10px;
                background-color: #007bff; color: white; border: none;
                border-radius: 6px; cursor: pointer; font-weight: 500;
                transition: background-color 0.2s;
            }
            #iiif-manifest-extractor-panel button:hover {
                background-color: #0056b3;
            }
            #iiif-manifest-extractor-panel button:disabled {
                background-color: #6c757d; cursor: not-allowed;
            }
            #download-all-btn {
                background-color: #28a745 !important; font-size: 16px !important;
                font-weight: bold !important; padding: 15px !important;
            }
            #close-panel-btn {
                background-color: #dc3545 !important; color: white !important;
                border: none !important; border-radius: 3px !important;
                cursor: pointer !important; font-weight: bold !important;
                width: auto !important; padding: 5px 8px !important;
                margin: 0 !important; font-size: 16px !important;
                line-height: 1 !important;
            }
            #close-panel-btn:hover {
                background-color: #c82333 !important;
            }
            #image-links-container {
                max-height: 300px; overflow-y: auto;
                border: 1px solid #e9ecef; border-radius: 4px;
                margin: 10px 0;
            }
            #image-links-container a {
                display: block; padding: 8px 12px; margin: 0;
                background-color: #fff; text-decoration: none; color: #495057;
                border-bottom: 1px solid #e9ecef; font-size: 13px;
                transition: background-color 0.2s;
            }
            #image-links-container a:last-child {
                border-bottom: none;
            }
            #image-links-container a:hover {
                background-color: #f8f9fa; color: #007bff;
            }
            #status-message {
                font-style: italic; color: #6c757d; font-size: 12px;
                background-color: #e9ecef; padding: 8px; border-radius: 4px;
                margin-top: 10px;
            }
        `);
    }
    //#endregion

    //#region Manifest Processing
    async function loadAndProcessManifest() {
        const button = document.getElementById('load-manifest-btn');
        const statusDiv = document.getElementById('status-message');
        const linksContainer = document.getElementById('image-links-container');
        const downloadAllContainer = document.getElementById('download-all-container');

        button.disabled = true;
        button.innerText = 'Caricamento in corso...';
        statusDiv.innerText = '';
        linksContainer.innerHTML = '';
        downloadAllContainer.style.display = 'none';

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const manifestUrl = urlParams.get('manifest');
            if (!manifestUrl) {
                throw new Error("URL del manifest non trovato nei parametri della pagina.");
            }

            const fullManifestUrl = new URL(manifestUrl, window.location.href).href;
            statusDiv.innerText = `Trovato manifest: ${fullManifestUrl}`;

            const manifest = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET", url: fullManifestUrl,
                    onload: r => (r.status === 200) ? resolve(JSON.parse(r.responseText)) : reject(new Error(`Errore caricamento manifest: ${r.statusText}`)),
                    onerror: e => reject(new Error(`Errore di rete per manifest: ${e}`))
                });
            });

            if (!manifest.items || !Array.isArray(manifest.items)) {
                throw new Error("Formato del manifest non valido: 'items' non trovato o non è un array.");
            }

            const documentTitle = extractDocumentTitle();
            console.log('Titolo estratto per suggerimento:', documentTitle);

            const imageInfos = manifest.items.map((canvasItem, index) => {
                try {
                    const imageUrl = canvasItem.items[0].items[0].body.id;
                    const pageNumber = padNumber(index);
                    const pageLabel = canvasItem.label.ja[0] || `Pagina ${index + 1}`;

                    return {
                        label: pageLabel,
                        url: imageUrl,
                        pageNumber: pageNumber,
                        baseName: documentTitle // Salviamo il nome base per ora
                    };
                } catch (e) {
                    console.warn(`Errore nel processare l'item ${index}:`, e);
                    return null;
                }
            }).filter(item => item !== null);

            if (imageInfos.length === 0) {
                throw new Error("Nessun URL di immagine trovato nel manifest.");
            }

            statusDiv.innerHTML = `
                <strong>Documento:</strong> ${documentTitle}<br>
                <strong>Pagine trovate:</strong> ${imageInfos.length}<br>
                <small>Clicca sui link per scaricare singolarmente</small>
            `;

            // Mostra il pulsante Download All
            const downloadAllBtn = document.getElementById('download-all-btn');
            downloadAllBtn.innerText = `📥 Scarica Tutte (${imageInfos.length} pagine)`;
            downloadAllContainer.style.display = 'block';

            // Rimuovi listener precedenti e aggiungi quello nuovo
            const newDownloadAllBtn = downloadAllBtn.cloneNode(true);
            downloadAllBtn.parentNode.replaceChild(newDownloadAllBtn, downloadAllBtn);
            newDownloadAllBtn.addEventListener('click', (event) => downloadAll(event, imageInfos));

            // Crea i link individuali (con nome temporaneo)
            imageInfos.forEach(info => {
                const link = document.createElement('a');
                link.href = info.url;
                link.innerText = `${info.pageNumber} - ${info.label}`;
                link.download = `${info.baseName}_${info.pageNumber}.jpg`;
                link.title = `Scarica: ${info.baseName}_${info.pageNumber}.jpg`;
                linksContainer.appendChild(link);
            });

        } catch (error) {
            console.error("ERRORE:", error);
            statusDiv.innerText = `❌ Errore: ${error.message}`;
        } finally {
            button.style.display = 'none';
        }
    }
    //#endregion

    //#region Download Functions
    async function downloadAll(event, imageInfos) {
        const button = event.target;
        const originalText = button.innerText;

        try {
            // Chiedi il nome all'utente
            const suggestedName = imageInfos[0].baseName;
            const finalDocumentName = promptForDocumentName(suggestedName);
            const sanitizedName = sanitizeFilename(finalDocumentName);

            button.disabled = true;
            button.innerText = 'Preparazione download...';

            for (let i = 0; i < imageInfos.length; i++) {
                const info = imageInfos[i];
                const progress = `(${i + 1}/${imageInfos.length})`;
                const filename = `${sanitizedName}_${info.pageNumber}.jpg`;

                button.innerText = `⬇️ Scaricando ${progress}...`;

                const link = document.createElement('a');
                link.href = info.url;
                link.download = filename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Pausa tra i download per evitare rate limiting
                if (i < imageInfos.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
            }

            button.innerText = '✅ Download Completato!';
            setTimeout(() => {
                button.disabled = false;
                button.innerText = originalText;
            }, 3000);

        } catch (error) {
            if (error.message === 'Download annullato dall\'utente') {
                button.innerText = '❌ Annullato';
            } else {
                console.error("Errore durante il download:", error);
                button.innerText = '❌ Errore nel download';
            }

            setTimeout(() => {
                button.disabled = false;
                button.innerText = originalText;
            }, 2000);
        }
    }
    //#endregion

    //#region Initialization
    window.addEventListener('load', () => {
        setTimeout(createExtractorPanel, 1000);
    }, false);
    //#endregion
})();