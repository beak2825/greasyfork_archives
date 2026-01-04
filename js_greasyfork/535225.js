// ==UserScript==
// @name         TTSFree Long Text Reader
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Divide un testo lungo in chunk, intercetta il pulsante di download su ttsfree.com e riproduce gli audio in sequenza con un lettore personalizzato
// @author       Flejta & Grok (con aiuto di xAI)
// @match        https://ttsfree.com/*
// @grant        none
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/535225/TTSFree%20Long%20Text%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/535225/TTSFree%20Long%20Text%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aggiunge l’interfaccia personalizzata
function addCustomControls() {
    const container = document.createElement('div');
    container.id = 'custom-tts-controls';
    container.style = 'position: fixed; top: 10px; right: 10px; background: white; padding: 15px; border: 2px solid #007bff; border-radius: 8px; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.2); width: 400px;';
    container.innerHTML = `
        <h3 style="margin: 0 0 10px; font-size: 16px; color: #333;">TTS Long Text Reader</h3>
        <textarea id="custom-text" placeholder="Inserisci il testo lungo" style="width: 100%; height: 150px; border: 1px solid #ccc; border-radius: 5px; padding: 5px; font-size: 14px; box-sizing: border-box;"></textarea>
        <div style="margin-top: 10px;">
            <label style="font-size: 14px;">Limite caratteri: </label>
            <select id="chunk-size" style="margin-left: 5px; padding: 2px; width: 150px;">
                <option value="500">500 (senza login)</option>
                <option value="2000" selected>2000 (con login)</option>
            </select>
        </div>
        <button id="custom-start" style="margin-top: 10px; padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Avvia lettura</button>
        <div id="status" style="margin-top: 10px; font-size: 14px; color: #333;">Stato: In attesa</div>
    `;
    document.body.appendChild(container);
}

    // Divide il testo in chunk
    function splitText(text, maxLength) {
        console.log(`Divisione testo: lunghezza=${text.length}, maxLength=${maxLength}`);
        const chunks = [];
        let start = 0;

        while (start < text.length) {
            let end = Math.min(start + maxLength, text.length);
            if (end < text.length) {
                const lastPeriod = text.lastIndexOf('.', end);
                const lastSpace = text.lastIndexOf(' ', end);
                end = Math.max(lastPeriod, lastSpace) > start ? Math.max(lastPeriod, lastSpace) + 1 : end;
            }
            chunks.push(text.slice(start, end));
            start = end;
        }

        console.log(`Creati ${chunks.length} chunk`);
        return chunks;
    }

    // Simula un'azione di incolla usando document.execCommand
    function simulatePaste(textarea, text) {
        console.log('Inizio simulazione incolla');

        // Imposta il focus sulla textarea
        textarea.focus();
        console.log('Focus impostato sulla textarea');

        // Seleziona tutto il testo esistente (per sovrascriverlo)
        textarea.select();

        // Inserisce il testo usando document.execCommand
        try {
            const success = document.execCommand('insertText', false, text);
            if (success) {
                console.log('Testo inserito con document.execCommand:', text.substring(0, 50) + '...');

                // Invia eventi input e paste per aggiornare il framework
                const inputEvent = new Event('input', { bubbles: true });
                const pasteEvent = new Event('paste', { bubbles: true });
                textarea.dispatchEvent(inputEvent);
                textarea.dispatchEvent(pasteEvent);
                console.log('Eventi input e paste inviati');
            } else {
                console.error('Errore: document.execCommand non ha funzionato');
                throw new Error('document.execCommand non ha funzionato');
            }
        } catch (error) {
            console.error('Errore durante l\'inserimento del testo:', error);
            throw error;
        }
    }

    // Simula l’inserimento del testo e il click su "Convert Now"
    function insertTextAndConvert(text) {
        return new Promise((resolve, reject) => {
            console.log('Tentativo di inserimento testo:', text.substring(0, 50) + '...');

            const textarea = document.querySelector('#input_text');
            if (!textarea) {
                console.error('Textarea non trovata');
                reject(new Error('Textarea non trovata'));
                return;
            }

            console.log('Textarea trovata');
            try {
                simulatePaste(textarea, text);

                // Verifica se il testo è stato inserito
                setTimeout(() => {
                    if (textarea.value !== text) {
                        console.error('Errore: il testo non è stato inserito correttamente. Valore attuale:', textarea.value);
                        reject(new Error('Testo non inserito nella textarea'));
                        return;
                    }

                    console.log('Testo inserito correttamente:', textarea.value.substring(0, 50) + '...');

                    const convertButton = document.querySelector('.convert-now');
                    if (!convertButton) {
                        console.error('Pulsante "Convert Now" non trovato');
                        reject(new Error('Pulsante "Convert Now" non trovato'));
                        return;
                    }

                    console.log('Pulsante "Convert Now" trovato, simulazione click');
                    convertButton.click();
                    resolve();
                }, 100); // Breve ritardo per consentire al framework di aggiornare
            } catch (error) {
                reject(error);
            }
        });
    }

    // Monitora l’aggiunta o la modifica del pulsante di download
    function waitForDownloadButton(chunkIndex) {
        return new Promise((resolve, reject) => {
            console.log(`Inizio monitoraggio pulsante di download per chunk ${chunkIndex}`);
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // Controlla i nodi aggiunti
                    mutation.addedNodes.forEach((node) => {
                        if (node.id === 'savevoice' || (node.querySelector && node.querySelector('#savevoice'))) {
                            const downloadButton = node.id === 'savevoice' ? node : node.querySelector('#savevoice');
                            if (downloadButton && downloadButton.href) {
                                console.log(`Pulsante di download trovato per chunk ${chunkIndex}, URL: ${downloadButton.href}`);
                                observer.disconnect();
                                resolve(downloadButton.href);
                            }
                        }
                    });

                    // Controlla le modifiche agli attributi di savevoice
                    if (mutation.type === 'attributes' && mutation.target.id === 'savevoice' && mutation.target.href) {
                        console.log(`Modifica attributo href trovata per chunk ${chunkIndex}, URL: ${mutation.target.href}`);
                        observer.disconnect();
                        resolve(mutation.target.href);
                    }
                });
            });

            // Monitora sia l'aggiunta di nodi che le modifiche agli attributi
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['href']
            });

            // Timeout per evitare attese infinite
            setTimeout(() => {
                console.error(`Timeout attesa pulsante di download per chunk ${chunkIndex}`);
                observer.disconnect();
                reject(new Error('Timeout attesa pulsante di download'));
            }, 30000); // 30 secondi
        });
    }

    // Gestore della coda audio
    class AudioPlayer {
        constructor() {
            this.audio = new Audio();
            this.queue = [];
            this.isPlaying = false;
        }

        addToQueue(audioUrl, chunkIndex) {
            console.log(`Aggiunto audio alla coda per chunk ${chunkIndex}: ${audioUrl}`);
            this.queue.push({ url: audioUrl, index: chunkIndex });
            console.log(`Stato coda: ${JSON.stringify(this.queue.map(item => ({ index: item.index, url: item.url })))}`);
            if (!this.isPlaying) {
                this.playNext();
            }
        }

        playNext() {
            if (this.queue.length === 0) {
                console.log('Coda audio vuota, riproduzione terminata');
                this.isPlaying = false;
                return;
            }

            this.isPlaying = true;
            const { url, index } = this.queue.shift();
            console.log(`Riproduzione audio per chunk ${index}: ${url}`);
            this.audio.src = url;
            this.audio.play().catch((error) => {
                console.error(`Errore riproduzione per chunk ${index}:`, error);
            });

            this.audio.onended = () => {
                console.log(`Audio terminato per chunk ${index}, passaggio al successivo`);
                this.playNext();
            };
        }
    }

    // Processo principale
    async function processLongText(maxLength) {
        const customText = document.querySelector('#custom-text').value;
        const status = document.querySelector('#status');
        const player = new AudioPlayer();
        const chunks = splitText(customText, maxLength);

        if (chunks.length === 0 || !customText) {
            console.error('Testo non valido o vuoto');
            status.textContent = 'Stato: Inserisci un testo valido';
            return;
        }

        console.log(`Inizio elaborazione, ${chunks.length} chunk`);
        status.textContent = `Stato: Elaborazione 1/${chunks.length}`;

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            try {
                console.log(`Elaborazione chunk ${i + 1}/${chunks.length}`);
                await insertTextAndConvert(chunk);
                const audioUrl = await waitForDownloadButton(i + 1);
                player.addToQueue(audioUrl, i + 1);
                status.textContent = `Stato: Elaborazione ${i + 2}/${chunks.length}`;
                await new Promise(resolve => setTimeout(resolve, 20000)); // Ritardo di 20 secondi
            } catch (error) {
                console.error(`Errore con il blocco ${i + 1}:`, error);
                status.textContent = `Stato: Errore al blocco ${i + 1} - ${error.message}`;
                break;
            }
        }

        console.log('Elaborazione completata');
        status.textContent = `Stato: Completato`;
    }

    // Inizializza
    addCustomControls();
    document.querySelector('#custom-start').addEventListener('click', () => {
        console.log('Avvio processo');
        const chunkSize = parseInt(document.querySelector('#chunk-size').value, 10);
        processLongText(chunkSize);
    });
})();