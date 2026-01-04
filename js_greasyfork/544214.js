// ==UserScript==
// @name         AIZen Mapper - Gemini AI Studio
// @namespace    AIZenConductor
// @version      1.0
// @description  Mappatura elementi UI per Gemini AI Studio
// @author       Flejta
// @match        https://aistudio.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544214/AIZen%20Mapper%20-%20Gemini%20AI%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/544214/AIZen%20Mapper%20-%20Gemini%20AI%20Studio.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.AIZen = window.AIZen || {};
    window.AIZen.aiName = 'Gemini AI Studio';
    window.AIZen.version = '1.0';
    
    // Mappatura elementi
    window.AIZen.mapElements = function() {
        const mapping = {
            success: false,
            elements: {},
            errors: [],
            nativeIds: {}
        };
        
        try {
            // OBBLIGATORIO: Pulsante invio (Run button)
            const btnInvio = document.querySelector('button[aria-label="Run"]');
            if (btnInvio) {
                // Non ha ID nativo, possiamo assegnarlo
                if (!btnInvio.id) {
                    btnInvio.id = 'AIZenBtnInvio';
                    mapping.elements.AIZenBtnInvio = true;
                } else {
                    mapping.nativeIds.btnInvio = btnInvio.id;
                    mapping.elements.AIZenBtnInvio = '#' + btnInvio.id;
                }
            } else {
                mapping.errors.push('Pulsante invio non trovato');
            }
            
            // Campo input - textarea
            const inputField = document.querySelector('textarea.textarea[aria-label="Type something or tab to choose an example prompt"]');
            if (inputField) {
                // Non ha ID nativo, possiamo assegnarlo
                if (!inputField.id) {
                    inputField.id = 'AIZenInputField';
                    mapping.elements.AIZenInputField = true;
                } else {
                    mapping.nativeIds.inputField = inputField.id;
                    mapping.elements.AIZenInputField = '#' + inputField.id;
                }
            } else {
                mapping.errors.push('Campo input non trovato');
            }
            
            // TODO: Pulsante STOP - aspetto selettori da Francesca quando AI Studio è in processing
            
            mapping.success = mapping.errors.length === 0;
        } catch (e) {
            mapping.errors.push(e.toString());
        }
        
        return mapping;
    };
    
    // Helper per ottenere elementi usando ID nativi o personalizzati
    window.AIZen.getElement = function(type) {
        switch(type) {
            case 'btnInvio':
                return document.getElementById('AIZenBtnInvio') || 
                       document.querySelector('button[aria-label="Run"]');
            case 'inputField':
                return document.getElementById('AIZenInputField') || 
                       document.querySelector('textarea.textarea[aria-label="Type something or tab to choose an example prompt"]');
            case 'btnStop':
                // Il pulsante STOP è lo stesso pulsante Run ma in modalità "stoppable"
                const btn = window.AIZen.getElement('btnInvio');
                return (btn && btn.classList.contains('stoppable')) ? btn : null;
            default:
                return null;
        }
    };
    
    // Stati del sistema
    window.AIZen.getStatus = function() {
        return {
            isProcessing: window.AIZen.isProcessing(),
            isInputEnabled: window.AIZen.isInputEnabled(),
            thinkingModeEnabled: window.AIZen.isThinkingModeEnabled(),
            searchEnabled: window.AIZen.isSearchEnabled()
        };
    };
    
    // Verifica se sta elaborando
    window.AIZen.isProcessing = function() {
        // Controlla se il pulsante Run è in modalità STOP
        const btn = window.AIZen.getElement('btnInvio');
        if (!btn) return false;
        
        // Verifica classe "stoppable" e testo "Stop"
        const hasStoppableClass = btn.classList.contains('stoppable');
        const hasStopText = btn.textContent && btn.textContent.includes('Stop');
        
        return hasStoppableClass || hasStopText;
    };
    
    // Verifica se input è abilitato
    window.AIZen.isInputEnabled = function() {
        const btn = window.AIZen.getElement('btnInvio');
        const input = window.AIZen.getElement('inputField');
        
        if (!btn) return false;
        
        // Controlla se il pulsante è disabilitato
        const isDisabled = btn.disabled || 
                          btn.classList.contains('disabled') ||
                          btn.getAttribute('aria-disabled') === 'true';
        
        return !isDisabled && (!input || !input.disabled);
    };
    
    // Verifica se Thinking Mode è abilitato
    window.AIZen.isThinkingModeEnabled = function() {
        const thinkingToggle = document.querySelector('button[aria-label="Toggle thinking mode"]');
        if (!thinkingToggle) return false;
        
        return thinkingToggle.getAttribute('aria-checked') === 'true';
    };
    
    // Verifica se Search è abilitato
    window.AIZen.isSearchEnabled = function() {
        const searchToggle = document.querySelector('button[aria-label="Grounding with Google Search"]');
        if (!searchToggle) return false;
        
        return searchToggle.getAttribute('aria-checked') === 'true';
    };
    
    // TODO: Implementare quando Francesca fornirà i selettori specifici
    // window.AIZen.hasReachedLimit = function() {
    //     return false;
    // };
    
    // Funzioni helper per interazione
    window.AIZen.sendMessage = function(text) {
        const input = window.AIZen.getElement('inputField');
        const btn = window.AIZen.getElement('btnInvio');
        
        if (!input || !btn || !window.AIZen.isInputEnabled()) {
            return false;
        }
        
        // Inserisce il testo nella textarea
        input.focus();
        input.value = text;
        
        // Simula eventi per far riconoscere il cambiamento
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Clicca Run dopo un breve delay
        setTimeout(() => {
            const currentBtn = window.AIZen.getElement('btnInvio');
            if (currentBtn && window.AIZen.isInputEnabled()) {
                currentBtn.click();
            }
        }, 200);
        
        return true;
    };
    
    // Helper per toggle features
    window.AIZen.toggleThinkingMode = function() {
        const toggle = document.querySelector('button[aria-label="Toggle thinking mode"]');
        if (toggle) {
            toggle.click();
            return true;
        }
        return false;
    };
    
    window.AIZen.toggleSearch = function() {
        const toggle = document.querySelector('button[aria-label="Grounding with Google Search"]');
        if (toggle) {
            toggle.click();
            return true;
        }
        return false;
    };
    
    // Helper per fermare la generazione
    window.AIZen.stopGeneration = function() {
        const stopBtn = window.AIZen.getElement('btnStop');
        if (stopBtn) {
            stopBtn.click();
            return true;
        }
        return false;
    };
    
    window.AIZen.clearChat = function() {
        const clearBtn = document.querySelector('button[aria-label="Clear chat"]');
        if (clearBtn) {
            clearBtn.click();
            return true;
        }
        return false;
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
    
    // Avvia mapping iniziale
    setTimeout(() => attemptMapping(), 2000);
    
    // Re-mappa quando l'interfaccia cambia
    const observer = new MutationObserver((mutations) => {
        let shouldRemap = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldRemap = true;
            }
        });
        
        if (shouldRemap) {
            setTimeout(() => window.AIZen.mapElements(), 500);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();