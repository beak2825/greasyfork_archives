// ==UserScript==
// @name         MedGemma Direct Automation
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Automazione diretta per MedGemma
// @author       Flejta & Claude
// @match        https://medgemma.org/*
// @match        https://warshanks-medgemma-4b-it.hf.space/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545468/MedGemma%20Direct%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/545468/MedGemma%20Direct%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //#region Configurazione
    console.log('MedGemma Automation: Inizializzazione...');
    let isProcessing = false;
    let currentSessionHash = null;
    //#endregion

    //#region Funzione principale di invio messaggio
    async function sendMessageToMedGemma(message) {
        if (isProcessing) {
            console.log('Già in elaborazione, attendi...');
            return null;
        }

        isProcessing = true;
        console.log('Invio messaggio:', message);

        try {
            // Genera un nuovo session hash
            const sessionHash = Math.random().toString(36).substring(2, 15);
            currentSessionHash = sessionHash;

            // Determina l'URL base in base al dominio corrente
            const baseUrl = window.location.hostname.includes('hf.space')
                ? ''
                : 'https://warshanks-medgemma-4b-it.hf.space';

            // Step 1: Invia la prediction
            const predictResponse = await fetch(`${baseUrl}/gradio_api/run/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: [{
                        text: message + '\n\n',
                        files: []
                    }],
                    event_data: null,
                    fn_index: 0,
                    trigger_id: 1,
                    session_hash: sessionHash
                })
            });

            if (!predictResponse.ok) {
                throw new Error(`Errore HTTP: ${predictResponse.status}`);
            }

            console.log('Prediction inviata, attendo risposta...');

            // Step 2: Leggi la risposta tramite SSE
            return new Promise((resolve, reject) => {
                const eventSource = new EventSource(`${baseUrl}/gradio_api/queue/data?session_hash=${sessionHash}`);
                let finalResponse = '';
                let timeoutId = null;

                // Timeout dopo 30 secondi
                timeoutId = setTimeout(() => {
                    eventSource.close();
                    isProcessing = false;
                    reject(new Error('Timeout nella risposta'));
                }, 30000);

                eventSource.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('Evento ricevuto:', data.msg);

                        if (data.msg === 'process_completed') {
                            clearTimeout(timeoutId);
                            eventSource.close();
                            isProcessing = false;

                            if (data.output && data.output.data && data.output.data[0]) {
                                finalResponse = data.output.data[0];
                                console.log('Risposta completa ricevuta');
                                resolve(finalResponse);
                            } else {
                                resolve(finalResponse || 'Nessuna risposta');
                            }
                        } else if (data.msg === 'process_generating') {
                            if (data.output && data.output.data && data.output.data[0]) {
                                finalResponse = data.output.data[0];
                                console.log('Generazione in corso...');
                            }
                        }
                    } catch (e) {
                        console.error('Errore parsing:', e);
                    }
                };

                eventSource.onerror = (error) => {
                    console.error('Errore SSE:', error);
                    clearTimeout(timeoutId);
                    eventSource.close();
                    isProcessing = false;
                    reject(new Error('Errore nella connessione SSE'));
                };
            });

        } catch (error) {
            console.error('Errore:', error);
            isProcessing = false;
            throw error;
        }
    }
    //#endregion

    //#region Integrazione con l'interfaccia esistente
    function integrateWithGradio() {
        // Cerca la textarea nell'interfaccia Gradio
        const findTextarea = () => {
            // Prova diversi selettori possibili per Gradio 5.31.0
            const selectors = [
                'textarea[data-testid="textbox"]',
                '.multimodal-textbox textarea',
                '.svelte-5gfv2q',
                'textarea.scroll-hide'
            ];

            for (const selector of selectors) {
                const textarea = document.querySelector(selector);
                if (textarea) {
                    console.log('Textarea trovata con selettore:', selector);
                    return textarea;
                }
            }

            // Se siamo in un iframe, prova a cercare nell'iframe
            const iframe = document.querySelector('iframe[src*="hf.space"]');
            if (iframe && iframe.contentDocument) {
                for (const selector of selectors) {
                    const textarea = iframe.contentDocument.querySelector(selector);
                    if (textarea) {
                        console.log('Textarea trovata nell\'iframe con selettore:', selector);
                        return textarea;
                    }
                }
            }

            return null;
        };

        // Trova il pulsante di invio
        const findSubmitButton = () => {
            const selectors = [
                '.submit-button',
                'button.svelte-5gfv2q:last-child',
                'button[aria-label*="submit"]'
            ];

            for (const selector of selectors) {
                const button = document.querySelector(selector);
                if (button) return button;
            }

            const iframe = document.querySelector('iframe[src*="hf.space"]');
            if (iframe && iframe.contentDocument) {
                for (const selector of selectors) {
                    const button = iframe.contentDocument.querySelector(selector);
                    if (button) return button;
                }
            }

            return null;
        };

        // Aggiungi shortcuts da tastiera
        document.addEventListener('keydown', async (e) => {
            // Ctrl+Shift+M per inserire una domanda medica di test
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                const textarea = findTextarea();
                if (textarea) {
                    textarea.value = 'Ho mal di testa frequenti nel pomeriggio. Il dolore è pulsante sulla fronte. Cosa potrebbe essere?';
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log('Domanda di test inserita');
                }
            }

            // Ctrl+Shift+S per inviare direttamente
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                const textarea = findTextarea();
                const submitBtn = findSubmitButton();

                if (textarea && submitBtn) {
                    submitBtn.click();
                    console.log('Messaggio inviato tramite shortcut');
                }
            }
        });

        console.log('Shortcuts attivati: Ctrl+Shift+M per test, Ctrl+Shift+S per inviare');
    }
    //#endregion

    //#region API Globale per test nella console
    window.MedGemma = {
        send: sendMessageToMedGemma,
        test: async function() {
            console.log('Test in corso...');
            try {
                const response = await sendMessageToMedGemma('Cos\'è il mal di testa?');
                console.log('Risposta:', response);
                return response;
            } catch (error) {
                console.error('Test fallito:', error);
                return null;
            }
        },
        status: function() {
            return {
                processing: isProcessing,
                sessionHash: currentSessionHash
            };
        }
    };
    //#endregion

    //#region Init con ritardo per iframe
    function init() {
        console.log('MedGemma Automation: Attivo su', window.location.hostname);

        // Se siamo su medgemma.org, aspetta che l'iframe sia caricato
        if (window.location.hostname === 'medgemma.org') {
            console.log('Aspetto il caricamento dell\'iframe...');
            setTimeout(() => {
                integrateWithGradio();
                console.log('MedGemma Automation: Pronto!');
                console.log('Usa MedGemma.test() nella console per testare');
                console.log('Oppure MedGemma.send("la tua domanda") per inviare messaggi');
            }, 3000);
        } else {
            integrateWithGradio();
            console.log('MedGemma Automation: Pronto!');
        }
    }

    // Avvia quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    //#endregion

})();