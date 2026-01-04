// ==UserScript==
// @name         AIZen Mapper - Grok
// @namespace    AIZenConductor
// @version      1.0
// @description  Mappatura elementi UI per Grok (X.com)
// @author       Flejta
// @match        https://x.com/i/grok*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544216/AIZen%20Mapper%20-%20Grok.user.js
// @updateURL https://update.greasyfork.org/scripts/544216/AIZen%20Mapper%20-%20Grok.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.AIZen = window.AIZen || {};
    window.AIZen.aiName = 'Grok';
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
            // OBBLIGATORIO: Campo input - textarea
            const inputField = document.querySelector('textarea[placeholder="Ask anything"]');
            if (inputField) {
                // Non ha ID nativo, possiamo assegnarlo
                if (!inputField.id) {
                    inputField.id = 'AIZenInputField';
                    mapping.elements.AIZenInputField = true;
                }
            } else {
                mapping.errors.push('Campo input non trovato');
            }
            
            // Pulsante invio (Grok something)
            const btnInvio = document.querySelector('button[aria-label="Grok something"]');
            if (btnInvio) {
                // Non ha ID nativo, possiamo assegnarlo
                if (!btnInvio.id) {
                    btnInvio.id = 'AIZenBtnInvio';
                    mapping.elements.AIZenBtnInvio = true;
                }
            } else {
                mapping.errors.push('Pulsante invio non trovato');
            }
            
            // Pulsante STOP (Cancel button durante processing)
            const stopBtn = document.querySelector('button[aria-label="Cancel"]');
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
    
    // Helper per ottenere elementi usando ID nativi o personalizzati
    window.AIZen.getElement = function(type) {
        switch(type) {
            case 'inputField':
                return document.getElementById('AIZenInputField') || 
                       document.querySelector('textarea[placeholder="Ask anything"]');
            case 'btnInvio':
                return document.getElementById('AIZenBtnInvio') || 
                       document.querySelector('button[aria-label="Grok something"]');
            case 'btnStop':
                return document.getElementById('AIZenBtnStop') || 
                       document.querySelector('button[aria-label="Cancel"]');
            default:
                return null;
        }
    };
    
    // Stati del sistema
    window.AIZen.getStatus = function() {
        return {
            isProcessing: window.AIZen.isProcessing(),
            isInputEnabled: window.AIZen.isInputEnabled(),
            deepSearchEnabled: window.AIZen.isDeepSearchEnabled(),
            thinkEnabled: window.AIZen.isThinkEnabled()
        };
    };
    
    // Verifica se sta elaborando
    window.AIZen.isProcessing = function() {
        // Controlla se esiste il pulsante Cancel (STOP)
        const stopBtn = document.querySelector('button[aria-label="Cancel"]');
        return stopBtn !== null;
    };
    
    // Verifica se input è abilitato
    window.AIZen.isInputEnabled = function() {
        const input = window.AIZen.getElement('inputField');
        const btn = window.AIZen.getElement('btnInvio');
        
        if (!input || !btn) return false;
        
        // Controlla se il pulsante è disabilitato
        const isDisabled = btn.disabled || 
                          btn.getAttribute('aria-disabled') === 'true' ||
                          btn.hasAttribute('disabled');
        
        return !input.disabled && !isDisabled;
    };
    
    // Verifica se DeepSearch è abilitato
    window.AIZen.isDeepSearchEnabled = function() {
        // DeepSearch abilitato ha colore blu: rgb(67, 179, 246)
        const deepSearchBtn = document.querySelector('button:has(span:contains("DeepSearch"))');
        if (!deepSearchBtn) return false;
        
        // Controlla il colore del testo dentro il pulsante
        const textElement = deepSearchBtn.querySelector('div[style*="color"]');
        if (!textElement) return false;
        
        const color = textElement.style.color;
        return color === 'rgb(67, 179, 246)'; // Colore blu quando abilitato
    };
    
    // Verifica se Think è abilitato
    window.AIZen.isThinkEnabled = function() {
        // Think abilitato ha colore blu: rgb(67, 179, 246)
        const thinkBtn = document.querySelector('button:has(span:contains("Think"))');
        if (!thinkBtn) return false;
        
        // Controlla il colore del testo dentro il pulsante
        const textElement = thinkBtn.querySelector('div[style*="color"]');
        if (!textElement) return false;
        
        const color = textElement.style.color;
        return color === 'rgb(67, 179, 246)'; // Colore blu quando abilitato
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
        
        // Clicca Grok dopo un breve delay
        setTimeout(() => {
            const currentBtn = window.AIZen.getElement('btnInvio');
            if (currentBtn && window.AIZen.isInputEnabled()) {
                currentBtn.click();
            }
        }, 200);
        
        return true;
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
    
    // Helper per toggle features
    window.AIZen.toggleDeepSearch = function() {
        const deepSearchBtn = document.querySelector('button:has(span:contains("DeepSearch"))');
        if (deepSearchBtn) {
            deepSearchBtn.click();
            return true;
        }
        return false;
    };
    
    window.AIZen.toggleThink = function() {
        const thinkBtn = document.querySelector('button:has(span:contains("Think"))');
        if (thinkBtn) {
            thinkBtn.click();
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