// ==UserScript==
// @name         AIZen Mapper - Perplexity
// @namespace    AIZenConductor
// @version      7.0
// @description  Mappatura elementi UI e invio automatico per Perplexity
// @author       Flejta
// @match        https://www.perplexity.ai/*
// @match        https://www.perplexity.ai/search/*
// @match        https://www.perplexity.ai/finance
// @match        https://www.perplexity.ai/travel
// @match        https://www.perplexity.ai/academic
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546854/AIZen%20Mapper%20-%20Perplexity.user.js
// @updateURL https://update.greasyfork.org/scripts/546854/AIZen%20Mapper%20-%20Perplexity.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    
    window.AIZen = window.AIZen || {};
    window.AIZen.aiName = 'Perplexity';
    window.AIZen.version = '5.0';
    
    // Mappatura elementi
    window.AIZen.mapElements = function() {
        const mapping = {
            success: false,
            elements: {},
            errors: [],
            nativeIds: {}
        };
        
        try {
            // Campo input - Lexical editor
            const inputField = document.querySelector('#ask-input[data-lexical-editor="true"]');
            if (inputField) {
                mapping.elements.AIZenInputField = '#ask-input';
                mapping.nativeIds.inputField = 'ask-input';
            } else {
                mapping.errors.push('Campo input non trovato');
            }
            
            // Il pulsante cambia funzione in base al contenuto
            mapping.elements.AIZenBtnInvio = 'button[data-testid="submit-button"]';
            
            mapping.success = mapping.errors.length === 0;
        } catch (e) {
            mapping.errors.push(e.toString());
        }
        
        return mapping;
    };
    
    // Helper per ottenere elementi
    window.AIZen.getElement = function(type) {
        switch(type) {
            case 'inputField':
                return document.querySelector('#ask-input[data-lexical-editor="true"]');
            case 'btnInvio':
                return document.querySelector('button[data-testid="submit-button"]');
            default:
                return null;
        }
    };
    
    // Helper per ottenere la risposta
    window.AIZen.getResponse = function() {
        return window.AIZen.lastResponse || null;
    };
    
    // Helper per formattare la risposta (rimuove markdown se necessario)
    window.AIZen.formatResponse = function(response) {
        if (!response) return "";
        
        // Rimuove i bold markdown **testo**
        let formatted = response.replace(/\*\*(.*?)\*\*/g, '$1');
        
        // Rimuove i link markdown [testo](url)
        formatted = formatted.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        
        // Converte i bullet points
        formatted = formatted.replace(/^- /gm, '• ');
        
        return formatted;
    };
    
    // Helper per verificare se il pulsante è in modalità invio
    window.AIZen.isSubmitButton = function(btn) {
        if (!btn) return false;
        
        const input = document.querySelector('#ask-input[data-lexical-editor="true"]');
        const hasText = input && input.textContent.trim().length > 0;
        
        // Verifica le icone
        const hasArrowIcon = btn.querySelector('.tabler-icon-arrow-right');
        const hasMicIcon = btn.querySelector('.tabler-icon-microphone-filled');
        
        // È pulsante di invio se:
        // 1. Ha l'icona freccia
        // 2. O se c'è testo e non ha l'icona microfono (stato intermedio)
        // 3. O se ha le classi attive e c'è testo
        return hasArrowIcon || (hasText && !hasMicIcon) || (hasText && btn.classList.contains('bg-super'));
    };
    
    // METODO PRINCIPALE: Invio diretto via API con gestione risposta
    window.AIZen.sendMessage = async function(text) {
        console.log("AIZen: Invio via API:", text);
        
        // Genera UUID casuali
        const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        
        const payload = {
            params: {
                attachments: [],
                language: navigator.language || "it-IT",
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Rome",
                search_focus: "internet",
                sources: ["web"],
                frontend_uuid: generateUUID(),
                mode: "copilot",
                query_source: "home",
                is_incognito: false,
                mentions: [],
                dsl_query: text,
                version: "2.18"
            },
            query_str: text
        };
        
        try {
            const response = await fetch("https://www.perplexity.ai/rest/sse/perplexity_ask", {
                method: "POST",
                headers: {
                    "accept": "text/event-stream",
                    "content-type": "application/json",
                },
                body: JSON.stringify(payload),
                credentials: "include"
            });
            
            console.log("AIZen: Risposta API:", response.status);
            
            if (response.ok) {
                // Leggi e processa lo stream completo
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let fullResponse = "";
                let chunks = [];
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    // Aggiungi al buffer
                    buffer += decoder.decode(value, { stream: true });
                    
                    // Processa le linee complete
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ""; // Mantieni l'ultima linea incompleta nel buffer
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const jsonStr = line.substring(6).trim();
                                if (jsonStr === '[DONE]') {
                                    console.log("AIZen: Stream terminato");
                                    break;
                                }
                                
                                const jsonData = JSON.parse(jsonStr);
                                
                                // DEBUG: log della struttura
                                if (jsonData.blocks && chunks.length < 5) {
                                    console.log("AIZen: Struttura block:", JSON.stringify(jsonData.blocks[0], null, 2).substring(0, 300));
                                }
                                
                                // Estrai il testo in vari modi
                                if (jsonData.blocks) {
                                    for (const block of jsonData.blocks) {
                                        // Metodo 1: diff_block
                                        if (block.diff_block) {
                                            // Se c'è un answer diretto
                                            if (block.diff_block.answer) {
                                                fullResponse = block.diff_block.answer;
                                            }
                                            // Se ci sono patches
                                            if (block.diff_block.patches) {
                                                for (const patch of block.diff_block.patches) {
                                                    if (patch.op === "replace" && patch.path === "/answer" && patch.value) {
                                                        fullResponse = patch.value;
                                                    } else if (patch.op === "add" && patch.value) {
                                                        chunks.push(patch.value);
                                                    }
                                                }
                                            }
                                            // Se c'è un field markdown_block
                                            if (block.diff_block.field === "markdown_block" && block.diff_block.patches) {
                                                for (const patch of block.diff_block.patches) {
                                                    if (patch.value) {
                                                        chunks.push(patch.value);
                                                    }
                                                }
                                            }
                                        }
                                        
                                        // Metodo 2: markdown_block diretto
                                        if (block.markdown_block && block.markdown_block.answer) {
                                            fullResponse = block.markdown_block.answer;
                                        }
                                        
                                        // Metodo 3: text diretto
                                        if (block.text) {
                                            fullResponse = block.text;
                                        }
                                    }
                                }
                                
                                // Metodo 4: answer diretto nel JSON principale
                                if (jsonData.answer) {
                                    fullResponse = jsonData.answer;
                                }
                                
                                // Status finale
                                if (jsonData.status === "COMPLETED" || jsonData.final_sse_message === true) {
                                    console.log("AIZen: Stream completato");
                                    break;
                                }
                                
                            } catch (e) {
                                console.log("AIZen: Errore parsing JSON:", e.message);
                            }
                        }
                    }
                }
                
                // Usa la risposta completa o unisci i chunk
                const finalAnswer = fullResponse || chunks.join('');
                
                console.log("AIZen: Risposta ricevuta:", finalAnswer.substring(0, 200) + "...");
                console.log("AIZen: Lunghezza risposta:", finalAnswer.length);
                
                // Callback per gestire la risposta
                if (window.AIZen.onResponse) {
                    window.AIZen.onResponse(finalAnswer);
                }
                
                // Salva l'ultima risposta
                window.AIZen.lastResponse = finalAnswer;
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error("AIZen: Errore API:", error);
            return false;
        }
    };
    
    // Callback per gestire la risposta (può essere sovrascritto)
    window.AIZen.onResponse = function(response) {
        console.log("AIZen: Risposta disponibile in window.AIZen.lastResponse");
        console.log("Primi 500 caratteri:", response.substring(0, 500));
    };
    
    // Metodo alternativo: Prova con manipolazione DOM (fallback)
    window.AIZen.sendMessageAlternative = async function(text) {
        console.log('AIZen: Tentativo fallback con manipolazione DOM');
        
        const input = document.querySelector('#ask-input[data-lexical-editor="true"]');
        if (!input) {
            console.error('AIZen: Input non trovato');
            return false;
        }
        
        // Inserisce il testo
        input.focus();
        input.innerHTML = `<p><span data-lexical-text="true">${text}</span></p>`;
        
        // Trigger eventi
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('AIZen: Testo inserito nel DOM, verificare manualmente se il pulsante è attivo');
        
        // Cerca il pulsante dopo un delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            if (btn.querySelector('.tabler-icon-arrow-right')) {
                console.log('AIZen: Trovato pulsante con freccia, tentativo click...');
                btn.disabled = false;
                btn.click();
                return true;
            }
        }
        
        console.log('AIZen: Pulsante non trovato, potrebbe richiedere intervento manuale');
        return false;
    };
    
    // Metodo con simulazione Enter
    window.AIZen.sendWithEnter = function(text) {
        return new Promise((resolve, reject) => {
            try {
                console.log('AIZen: Tentativo invio con Enter');
                
                const input = document.querySelector('#ask-input[data-lexical-editor="true"]');
                if (!input) {
                    reject('Input non trovato');
                    return;
                }
                
                // Inserisce il testo
                input.focus();
                input.innerHTML = `<p dir="ltr"><span data-lexical-text="true">${text}</span></p>`;
                
                // Trigger eventi
                input.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Attende che il pulsante si trasformi
                setTimeout(() => {
                    // Prima verifica se il pulsante è in modalità invio
                    const btn = document.querySelector('button[data-testid="submit-button"]');
                    
                    if (btn && window.AIZen.isSubmitButton(btn)) {
                        // Se sì, simula Enter
                        const enterEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13,
                            bubbles: true,
                            cancelable: true,
                            shiftKey: false,
                            ctrlKey: false,
                            metaKey: false
                        });
                        
                        input.dispatchEvent(enterEvent);
                        
                        // Verifica se ha funzionato
                        setTimeout(() => {
                            if (input.textContent.trim() === '') {
                                console.log('AIZen: Messaggio inviato con Enter');
                                resolve(true);
                            } else {
                                // Se no, click manuale
                                btn.click();
                                resolve(true);
                            }
                        }, 200);
                    } else {
                        reject('Pulsante non in modalità invio');
                    }
                }, 500);
                
            } catch (error) {
                reject(error);
            }
        });
    };
    
    // Metodo diretto di modifica HTML
    window.AIZen.directInsert = function(text) {
        return new Promise((resolve, reject) => {
            try {
                console.log('AIZen: Inserimento diretto HTML');
                
                const input = document.querySelector('#ask-input[data-lexical-editor="true"]');
                if (!input) {
                    reject('Input non trovato');
                    return;
                }
                
                // Replica esattamente la struttura vista negli screenshot
                input.innerHTML = `<p><span data-lexical-text="true">${text}</span></p>`;
                
                // Trigger eventi per notificare React/Lexical del cambiamento
                const event1 = new Event('input', { bubbles: true, cancelable: true });
                const event2 = new Event('change', { bubbles: true, cancelable: true });
                const event3 = new InputEvent('beforeinput', { 
                    bubbles: true, 
                    cancelable: true,
                    inputType: 'insertText',
                    data: text
                });
                
                input.dispatchEvent(event3);
                input.dispatchEvent(event1);
                input.dispatchEvent(event2);
                
                // Attende un attimo per vedere se il pulsante si aggiorna
                setTimeout(() => {
                    const btn = document.querySelector('button[data-testid="submit-button"]');
                    
                    if (btn) {
                        // Controlla se ora ha l'icona freccia
                        const hasArrow = btn.querySelector('.tabler-icon-arrow-right');
                        console.log('AIZen: Pulsante ha freccia?', !!hasArrow);
                        
                        // Forza il click comunque se c'è testo
                        if (input.textContent.trim().length > 0) {
                            btn.disabled = false;
                            btn.click();
                            resolve(true);
                        } else {
                            reject('Testo non inserito');
                        }
                    } else {
                        reject('Pulsante non trovato');
                    }
                }, 500);
                
            } catch (error) {
                reject(error);
            }
        });
    };

    // Metodo con retry automatico
    window.AIZen.sendMessageWithRetry = async function(text, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                console.log(`AIZen: Tentativo ${i + 1} di ${maxRetries}`);
                
                if (i === 0) {
                    // Primo tentativo: metodo principale
                    const result = await window.AIZen.sendMessage(text);
                    if (result) return true;
                } else if (i === 1) {
                    // Secondo tentativo: metodo alternativo
                    const result = await window.AIZen.sendMessageAlternative(text);
                    if (result) return true;
                } else {
                    // Terzo tentativo: con Enter
                    const result = await window.AIZen.sendWithEnter(text);
                    if (result) return true;
                }
                
            } catch (error) {
                console.warn(`AIZen: Tentativo ${i + 1} fallito:`, error);
                
                if (i === maxRetries - 1) {
                    console.error('AIZen: Tutti i tentativi falliti');
                    throw error;
                }
                
                // Attende prima del prossimo tentativo
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        return false;
    };
    
    // Stati del sistema
    window.AIZen.getStatus = function() {
        const input = document.querySelector('#ask-input[data-lexical-editor="true"]');
        const btn = document.querySelector('button[data-testid="submit-button"]');
        
        return {
            isProcessing: window.AIZen.isProcessing(),
            isInputEnabled: window.AIZen.isInputEnabled(),
            inputContent: input?.textContent || '',
            buttonState: {
                found: !!btn,
                disabled: btn?.disabled,
                isSubmitMode: window.AIZen.isSubmitButton(btn),
                hasArrowIcon: !!btn?.querySelector('.tabler-icon-arrow-right'),
                hasMicIcon: !!btn?.querySelector('.tabler-icon-microphone-filled'),
                classes: btn?.className
            }
        };
    };
    
    // Verifica se sta elaborando
    window.AIZen.isProcessing = function() {
        const btn = document.querySelector('button[data-testid="submit-button"]');
        const input = document.querySelector('#ask-input[data-lexical-editor="true"]');
        
        // È in elaborazione se l'input è vuoto ma il pulsante è disabilitato
        return btn && btn.disabled && (!input || input.textContent.trim() === '');
    };
    
    // Verifica se input è abilitato
    window.AIZen.isInputEnabled = function() {
        const input = document.querySelector('#ask-input[data-lexical-editor="true"]');
        
        if (!input) return false;
        
        return input.getAttribute('contenteditable') === 'true';
    };
    
    // Attende che il sistema sia pronto
    window.AIZen.waitForReady = function(timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkReady = () => {
                if (window.AIZen.isInputEnabled() && !window.AIZen.isProcessing()) {
                    resolve(true);
                } else if (Date.now() - startTime > timeout) {
                    reject('Timeout in attesa del sistema');
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            
            checkReady();
        });
    };
    
    // Helper per debug
    window.AIZen.checkStatus = function() {
        const status = window.AIZen.getStatus();
        console.log('=== AIZen Status Check ===');
        console.log('Processing:', status.isProcessing);
        console.log('Input enabled:', status.isInputEnabled);
        console.log('Input content:', status.inputContent);
        console.log('Button:', status.buttonState);
        console.log('========================');
        return status;
    };
    
    // Metodo globale semplificato
    window.sendMessage = async function(text) {
        if (!text) {
            console.error('AIZen: Testo vuoto');
            return false;
        }
        
        try {
            // Attende che il sistema sia pronto
            await window.AIZen.waitForReady();
            
            // Usa il metodo con retry
            return await window.AIZen.sendMessageWithRetry(text);
            
        } catch (error) {
            console.error('AIZen: Errore generale:', error);
            return false;
        }
    };
    
    // Alias per compatibilità con webview
    window.send = window.sendMessage;
    window.sendText = window.sendMessage;
    window.submitMessage = window.sendMessage;
    
    // Helper per test rapido
    window.testMessage = function() {
        return window.sendMessage('Ciao, questo è un test automatico');
    };
    
    // Auto-mappa con retry
    function attemptMapping(retries = 3) {
        const result = window.AIZen.mapElements();
        console.log('AIZen Mapping:', result);
        
        if (!result.success && retries > 0) {
            console.log(`AIZen: Mapping fallito, retry in 2s (tentativi rimasti: ${retries})`);
            setTimeout(() => attemptMapping(retries - 1), 2000);
        }
    }
    
    // Inizializzazione
    setTimeout(() => {
        attemptMapping();
        
        console.log('%c🤖 AIZen Perplexity Mapper v7.0 Attivo', 'color: #10a37f; font-size: 14px; font-weight: bold');
        console.log('%cComandi disponibili:', 'color: #666; font-size: 12px');
        console.log('%c  window.sendMessage("testo")', 'color: #0969da; font-family: monospace');
        console.log('%c  window.AIZen.getResponse()', 'color: #0969da; font-family: monospace');
        console.log('%c  window.AIZen.formatResponse()', 'color: #0969da; font-family: monospace');
        console.log('%c  window.testMessage()', 'color: #0969da; font-family: monospace');
        console.log('%c  window.AIZen.checkStatus()', 'color: #0969da; font-family: monospace');
        
        // Mostra stato iniziale
        window.AIZen.checkStatus();
    }, 2000);
    
})();