// ==UserScript==
// @name         AIZen Mapper - Claude (Fixed)
// @namespace    AIZenConductor
// @version      2.5
// @description  Mappatura elementi UI per Claude - Versione corretta
// @author       Flejta & Claude
// @match        https://claude.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544208/AIZen%20Mapper%20-%20Claude%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544208/AIZen%20Mapper%20-%20Claude%20%28Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.AIZen = window.AIZen || {};
    window.AIZen.aiName = 'Claude';
    window.AIZen.version = '2.4';
    
    //#region Selettori e Mappatura
    
    // Funzione per trovare il pulsante invio con selettori multipli
    window.AIZen.btnInvio = function() {
        return document.querySelector([
            'button[aria-label*="Invia messaggio"]',
            'button[aria-label*="Send message"]', 
            'button[data-testid*="send"]',
            'button svg[data-icon="arrow-up"]'
        ].join(', '))?.closest('button');
    };
    
    // Mappatura elementi
    window.AIZen.mapElements = function() {
        const mapping = {
            success: false,
            elements: {},
            errors: []
        };
        
        try {
            // Pulsante invio con selettori aggiornati
            const btnInvio = window.AIZen.btnInvio();
            if (btnInvio && !btnInvio.id) {
                console.log("btnInvio trovato:", btnInvio);
                btnInvio.id = 'AIZenBtnInvio';
                mapping.elements.AIZenBtnInvio = true;
            } else if (btnInvio) {
                mapping.elements.AIZenBtnInvio = true;
            } else {
                mapping.errors.push('Pulsante invio non trovato');
            }
            
            // Campo input - ProseMirror contenteditable
            const inputField = document.querySelector('.ProseMirror[contenteditable="true"][role="textbox"]');
            if (inputField && !inputField.id) {
                console.log("inputField trovato:", inputField);
                inputField.id = 'AIZenInputField';
                mapping.elements.AIZenInputField = true;
            } else if (inputField) {
                mapping.elements.AIZenInputField = true;
            } else {
                mapping.errors.push('Campo input non trovato');
            }
            
            // Pulsante STOP
            const stopBtn = document.querySelector('button[aria-label*="Stop"], button[aria-label*="Interrompi"]');
            if (stopBtn && !stopBtn.id) {
                console.log("btnStop trovato:", stopBtn);
                stopBtn.id = 'AIZenBtnStop';
                mapping.elements.AIZenBtnStop = true;
            }
            
            mapping.success = mapping.errors.length === 0;
        } catch (e) {
            mapping.errors.push(e.toString());
        }
        
        console.log('AIZen Mapping result:', mapping);
        return mapping;
    };
    
    //#endregion
    
    //#region Stato del Sistema
    
    // Stati del sistema
    window.AIZen.getStatus = function() {
        return {
            isProcessing: window.AIZen.isProcessing(),
            isInputEnabled: window.AIZen.isInputEnabled(),
            hasReachedLimit: window.AIZen.hasReachedLimit(),
            elements: {
                input: !!document.getElementById('AIZenInputField'),
                button: !!document.getElementById('AIZenBtnInvio')
            }
        };
    };
    
    // Verifica se sta elaborando
    window.AIZen.isProcessing = function() {
        const stopBtn = document.getElementById('AIZenBtnStop') || 
                       document.querySelector('button[aria-label*="Stop"], button[aria-label*="Interrompi"]');
        
        // SOLO se c'è un pulsante STOP visibile significa che sta elaborando
        const isProcessing = stopBtn && stopBtn.offsetParent !== null;
        
        if (isProcessing) {
            console.log('AIZen: Sistema in elaborazione - pulsante STOP visibile');
        }
        
        return isProcessing;
    };
    
    // Verifica se input è disponibile (indipendentemente dal contenuto)
    window.AIZen.isInputAvailable = function() {
        const input = document.getElementById('AIZenInputField');
        return input && input.getAttribute('contenteditable') === 'true';
    };
    
    // Verifica se il pulsante è abilitato DOPO aver inserito testo
    window.AIZen.isButtonEnabled = function() {
        const btn = document.getElementById('AIZenBtnInvio') || window.AIZen.btnInvio();
        
        if (!btn) return false;
        
        return !btn.disabled && 
               !btn.classList.contains('disabled') &&
               btn.getAttribute('aria-disabled') !== 'true';
    };
    
    // DEPRECATO: mantenuto per compatibilità
    window.AIZen.isInputEnabled = function() {
        return window.AIZen.isInputAvailable();
    };
    
    // Verifica limite raggiunto
    window.AIZen.hasReachedLimit = function() {
        const limitMessages = document.querySelectorAll('.text-danger-000 p, [role="alert"], .error-message');
        for (let msg of limitMessages) {
            const text = msg.textContent.toLowerCase();
            if (text.includes('limit') || text.includes('limite') || text.includes('maximum')) {
                return true;
            }
        }
        return false;
    };
    
    //#endregion
    
    //#region Invio Messaggi
    
    // METODO PRINCIPALE per inviare messaggi
    window.AIZen.sendMessage = function(text) {
        console.log('AIZen.sendMessage chiamato con:', text.substring(0, 100) + '...');
        
        if (!window.AIZen.isInputAvailable()) {
            console.error('AIZen: Input non disponibile');
            return false;
        }
        
        if (window.AIZen.isProcessing()) {
            console.error('AIZen: Sistema sta già elaborando');
            return false;
        }
        
        const input = document.getElementById('AIZenInputField');
        if (!input) {
            console.error('AIZen: Input non trovato');
            return false;
        }
        
        try {
            // STEP 1: Focus e prepara l'input
            console.log('1. Focus sull\'input...');
            input.focus();
            input.click();
            
            // STEP 2: Pulisci e inserisci il testo
            console.log('2. Inserisco il testo...');
            input.innerHTML = text.split('\n').map(line => 
                line.trim() ? `<p>${line}</p>` : '<p><br></p>'
            ).join('');
            
            // STEP 3: Trigger eventi per far riconoscere il cambiamento
            console.log('3. Triggero eventi...');
            const events = [
                new Event('input', { bubbles: true, cancelable: true }),
                new Event('change', { bubbles: true, cancelable: true }),
                new CompositionEvent('compositionend', { data: text, bubbles: true })
            ];
            
            events.forEach(event => input.dispatchEvent(event));
            
            // STEP 4: Attendi che il pulsante si abiliti e clicca
            console.log('4. Attendo abilitazione pulsante...');
            const maxAttempts = 10;
            let attempts = 0;
            
            const checkAndClick = () => {
                attempts++;
                const currentBtn = document.getElementById('AIZenBtnInvio') || window.AIZen.btnInvio();
                
                if (currentBtn && window.AIZen.isButtonEnabled()) {
                    console.log(`5. Pulsante abilitato al tentativo ${attempts}, clicco!`);
                    currentBtn.click();
                    return true;
                } else if (attempts < maxAttempts) {
                    console.log(`Tentativo ${attempts}: pulsante non ancora abilitato, riprovo...`);
                    setTimeout(checkAndClick, 200);
                } else {
                    console.error('Timeout: pulsante non si è abilitato entro il tempo limite');
                    return false;
                }
            };
            
            // Inizia il controllo dopo un breve delay
            setTimeout(checkAndClick, 300);
            
            return true;
            
        } catch (error) {
            console.error('AIZen sendMessage error:', error);
            return false;
        }
    };
    
    // Metodo alternativo usando execCommand
    window.AIZen.sendMessageExecCommand = function(text) {
        console.log('AIZen: Tentativo con execCommand');
        
        const input = document.getElementById('AIZenInputField');
        if (!input || !window.AIZen.isInputAvailable()) return false;
        
        try {
            input.focus();
            
            // Seleziona tutto il contenuto esistente
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(input);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Inserisci il nuovo testo
            document.execCommand('insertText', false, text);
            
            // Trigger eventi
            input.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Attendi e clicca
            setTimeout(() => {
                const btn = document.getElementById('AIZenBtnInvio') || window.AIZen.btnInvio();
                if (btn && window.AIZen.isButtonEnabled()) {
                    btn.click();
                }
            }, 500);
            
            return true;
            
        } catch (error) {
            console.error('AIZen execCommand error:', error);
            return false;
        }
    };
    
    //#endregion
    
    //#region Utilità e Test
    
    // Test function per debug
    window.AIZen.test = function() {
        console.log('=== AIZen Test ===');
        console.log('Status:', window.AIZen.getStatus());
        
        const input = document.getElementById('AIZenInputField');
        const button = document.getElementById('AIZenBtnInvio') || window.AIZen.btnInvio();
        const stopBtn = document.getElementById('AIZenBtnStop') || 
                       document.querySelector('button[aria-label*="Stop"], button[aria-label*="Interrompi"]');
        
        console.log('Input element:', input);
        console.log('Button element:', button);
        console.log('Stop button:', stopBtn, 'visible:', stopBtn?.offsetParent !== null);
        console.log('Input available:', window.AIZen.isInputAvailable());
        console.log('Button enabled:', window.AIZen.isButtonEnabled());
        console.log('Is processing:', window.AIZen.isProcessing());
        
        if (button) {
            console.log('Button disabled:', button.disabled);
            console.log('Button aria-disabled:', button.getAttribute('aria-disabled'));
            console.log('Button classes:', button.className);
        }
        
        return 'Test completato - controlla la console';
    };
    
    // Test di invio
    window.AIZen.testSend = function() {
        return window.AIZen.sendMessage('Test automatico AIZen - ' + new Date().toLocaleTimeString());
    };
    
    //#endregion
    
    //#region Inizializzazione
    
    // Auto-mappa con retry
    function attemptMapping(retries = 5) {
        const result = window.AIZen.mapElements();
        
        if (!result.success && retries > 0) {
            console.log(`AIZen: Mapping fallito, retry in 2s (tentativi rimasti: ${retries})`);
            setTimeout(() => attemptMapping(retries - 1), 2000);
        } else if (result.success) {
            console.log('AIZen: Mapping completato con successo!');
            
            // Test invio automatico se in debug mode
            if (window.location.hash === '#aizentest') {
                setTimeout(() => {
                    console.log('AIZen: Test automatico...');
                    window.AIZen.testSend();
                }, 3000);
            }
        } else {
            console.error('AIZen: Mapping definitivamente fallito');
        }
    }
    
    // Avvia mapping quando DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => attemptMapping());
    } else {
        setTimeout(() => attemptMapping(), 1000);
    }
    
    // Re-mappa quando l'interfaccia cambia
    const observer = new MutationObserver((mutations) => {
        const inputOk = document.getElementById('AIZenInputField');
        const btnOk = document.getElementById('AIZenBtnInvio');
        
        if (!inputOk || !btnOk) {
            console.log('AIZen: Elementi persi, re-mapping...');
            setTimeout(() => window.AIZen.mapElements(), 1000);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    //#endregion
    
    console.log('AIZen Claude mapper v2.4 caricato - Supporto italiano/inglese');
    
})();