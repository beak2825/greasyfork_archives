// ==UserScript==
// @name         AIZen Mapper - Gemini
// @namespace    AIZenConductor
// @version      1.0
// @description  Mappatura elementi UI per Gemini
// @author       Flejta
// @match        https://gemini.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544210/AIZen%20Mapper%20-%20Gemini.user.js
// @updateURL https://update.greasyfork.org/scripts/544210/AIZen%20Mapper%20-%20Gemini.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.AIZen = window.AIZen || {};
    window.AIZen.aiName = 'Gemini';
    window.AIZen.version = '1.0';
    
    // Mappatura elementi
    window.AIZen.mapElements = function() {
        const mapping = {
            success: false,
            elements: {},
            errors: []
        };
        
        try {
            // OBBLIGATORIO: Pulsante invio/stop
            const btnInvio = document.querySelector('button[aria-label="Invia messaggio"]');
            if (btnInvio) {
                btnInvio.id = 'AIZenBtnInvio';
                mapping.elements.AIZenBtnInvio = true;
            } else {
                mapping.errors.push('Pulsante invio non trovato');
            }
            
            // Campo input - contenteditable div dentro rich-textarea
            const inputField = document.querySelector('.ql-editor[contenteditable="true"][role="textbox"]');
            if (inputField) {
                inputField.id = 'AIZenInputField';
                mapping.elements.AIZenInputField = true;
            } else {
                mapping.errors.push('Campo input non trovato');
            }
            
            // Pulsante STOP (quando Gemini sta elaborando)
            const stopBtn = document.querySelector('button[aria-label="Interrompi risposta"]');
            if (stopBtn) {
                stopBtn.id = 'AIZenBtnStop';
                mapping.elements.AIZenBtnStop = true;
            }
            
            mapping.success = mapping.errors.length === 0;
        } catch (e) {
            mapping.errors.push(e.toString());
        }
        
        return mapping;
    };
    
    // Stati del sistema
    window.AIZen.getStatus = function() {
        return {
            isProcessing: window.AIZen.isProcessing(),
            isInputEnabled: window.AIZen.isInputEnabled()
        };
    };
    
    // Verifica se sta elaborando
    window.AIZen.isProcessing = function() {
        // Controlla se esiste il pulsante STOP (quando Gemini sta pensando)
        const stopBtn = document.querySelector('button[aria-label="Interrompi risposta"]');
        return stopBtn !== null;
    };
    
    // Verifica se input è abilitato
    window.AIZen.isInputEnabled = function() {
        const btn = document.getElementById('AIZenBtnInvio');
        const input = document.getElementById('AIZenInputField');
        
        if (!btn) return false;
        
        // Check multipli per stato abilitato
        return !btn.disabled && 
               !btn.classList.contains('disabled') &&
               btn.getAttribute('aria-disabled') !== 'true' &&
               (!input || !input.hasAttribute('disabled'));
    };
    
    // TODO: Implementare quando Francesca fornirà i selettori specifici
    // window.AIZen.hasReachedLimit = function() {
    //     // I messaggi di limite appaiono nella lingua selezionata
    //     return false;
    // };
    
    // Funzioni helper per interazione
    window.AIZen.sendMessage = function(text) {
        const input = document.getElementById('AIZenInputField');
        const btn = document.getElementById('AIZenBtnInvio');
        
        if (!input || !btn || !window.AIZen.isInputEnabled()) {
            return false;
        }
        
        // Inserisce il testo nel contenteditable (Gemini usa <p> tags)
        input.focus();
        input.innerHTML = '<p>' + text.replace(/\n/g, '</p><p>') + '</p>';
        
        // Simula eventi per far riconoscere il cambiamento
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Clicca invio dopo un breve delay (aspetta che il pulsante diventi visibile)
        setTimeout(() => {
            const currentBtn = document.querySelector('button[aria-label="Invia messaggio"]');
            if (currentBtn && window.AIZen.isInputEnabled()) {
                currentBtn.click();
            }
        }, 200);
        
        return true;
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
    
    // Re-mappa quando l'interfaccia cambia (es. dopo caricamento asincrono)
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