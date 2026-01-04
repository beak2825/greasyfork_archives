// ==UserScript==
// @name         AIZen Mapper - ChatGPT
// @namespace    AIZenConductor
// @version      1.0
// @description  Mappatura elementi UI per ChatGPT
// @author       Flejta
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544212/AIZen%20Mapper%20-%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/544212/AIZen%20Mapper%20-%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.AIZen = window.AIZen || {};
    window.AIZen.aiName = 'ChatGPT';
    window.AIZen.version = '1.0';
    
    // Mappatura elementi
    window.AIZen.mapElements = function() {
        const mapping = {
            success: false,
            elements: {},
            errors: [],
            nativeIds: {} // Traccia ID nativi esistenti
        };
        
        try {
            // OBBLIGATORIO: Pulsante invio (ha già ID nativo)
            const btnInvio = document.querySelector('#composer-submit-button');
            if (btnInvio) {
                // Non riassegnare - usa ID esistente
                mapping.elements.AIZenBtnInvio = '#composer-submit-button';
                mapping.nativeIds.btnInvio = 'composer-submit-button';
            } else {
                mapping.errors.push('Pulsante invio non trovato');
            }
            
            // Campo input - contenteditable div ProseMirror
            const inputField = document.querySelector('#prompt-textarea.ProseMirror[contenteditable="true"]');
            if (inputField) {
                // Ha già ID nativo - non riassegnare
                mapping.elements.AIZenInputField = '#prompt-textarea';
                mapping.nativeIds.inputField = 'prompt-textarea';
            } else {
                mapping.errors.push('Campo input non trovato');
            }
            
            // TODO: Pulsante STOP - aspetto selettori da Francesca
            // const stopBtn = document.querySelector('[selettore_stop]');
            // if (stopBtn) {
            //     mapping.elements.AIZenBtnStop = true;
            // }
            
            mapping.success = mapping.errors.length === 0;
        } catch (e) {
            mapping.errors.push(e.toString());
        }
        
        return mapping;
    };
    
    // Helper per ottenere elementi usando ID nativi o personalizzati
    window.AIZen.getElement = function(type) {
        const mapping = {
            'btnInvio': '#composer-submit-button',
            'inputField': '#prompt-textarea',
            'btnStop': null // TODO: implementare
        };
        return document.querySelector(mapping[type]);
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
        // TODO: Implementare quando Francesca fornirà selettori STOP
        // const stopBtn = document.querySelector('[selettore_stop]');
        // return stopBtn !== null;
        return false;
    };
    
    // Verifica se input è abilitato
    window.AIZen.isInputEnabled = function() {
        const btn = window.AIZen.getElement('btnInvio');
        const input = window.AIZen.getElement('inputField');
        
        if (!btn) return false;
        
        // In ChatGPT il pulsante sparisce quando disabilitato
        // Controlliamo anche se è visibile
        const isVisible = btn.offsetParent !== null;
        
        return !btn.disabled && 
               !btn.classList.contains('disabled') &&
               btn.getAttribute('aria-disabled') !== 'true' &&
               isVisible &&
               (!input || !input.hasAttribute('disabled'));
    };
    
    // TODO: Implementare quando Francesca fornirà i selettori specifici
    // window.AIZen.hasReachedLimit = function() {
    //     // I messaggi di limite appaiono nella lingua selezionata
    //     return false;
    // };
    
    // Funzioni helper per interazione
    window.AIZen.sendMessage = function(text) {
        const input = window.AIZen.getElement('inputField');
        const btn = window.AIZen.getElement('btnInvio');
        
        if (!input || !btn || !window.AIZen.isInputEnabled()) {
            return false;
        }
        
        // Inserisce il testo nel contenteditable (ChatGPT usa <p> tags)
        input.focus();
        input.innerHTML = '<p>' + text.replace(/\n/g, '</p><p>') + '</p>';
        
        // Simula eventi per far riconoscere il cambiamento
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Clicca invio dopo un breve delay
        setTimeout(() => {
            const currentBtn = window.AIZen.getElement('btnInvio');
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