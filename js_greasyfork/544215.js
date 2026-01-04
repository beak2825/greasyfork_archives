// ==UserScript==
// @name         AIZen Mapper - DeepSeek
// @namespace    AIZenConductor
// @version      1.0
// @description  Mappatura elementi UI per DeepSeek
// @author       Flejta
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544215/AIZen%20Mapper%20-%20DeepSeek.user.js
// @updateURL https://update.greasyfork.org/scripts/544215/AIZen%20Mapper%20-%20DeepSeek.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.AIZen = window.AIZen || {};
    window.AIZen.aiName = 'DeepSeek';
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
            // OBBLIGATORIO: Pulsante invio (ha ID nativo)
            const btnInvio = document.querySelector('#chat-input');
            if (btnInvio) {
                // Ha già ID nativo - non riassegnare
                mapping.elements.AIZenInputField = '#chat-input';
                mapping.nativeIds.inputField = 'chat-input';
            } else {
                mapping.errors.push('Campo input non trovato');
            }
            
            // Pulsante invio/stop - cerca l'icona di invio
            const sendBtn = document.querySelector('div[role="button"]._7436101:not(.bcc55ca1)');
            if (sendBtn) {
                // Non ha ID nativo, possiamo assegnarlo
                if (!sendBtn.id) {
                    sendBtn.id = 'AIZenBtnInvio';
                    mapping.elements.AIZenBtnInvio = true;
                }
            } else {
                mapping.errors.push('Pulsante invio non trovato');
            }
            
            // Pulsante STOP (stesso pulsante ma con contenuto diverso)
            const stopBtn = document.querySelector('div[role="button"]._7436101 ._480132b');
            if (stopBtn) {
                stopBtn.closest('div[role="button"]').id = 'AIZenBtnStop';
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
                return document.querySelector('#chat-input');
            case 'btnInvio':
                return document.getElementById('AIZenBtnInvio') || 
                       document.querySelector('div[role="button"]._7436101:not(.bcc55ca1)');
            case 'btnStop':
                // Il pulsante STOP è riconoscibile dalla classe _480132b interna
                const stopIndicator = document.querySelector('div[role="button"]._7436101 ._480132b');
                return stopIndicator ? stopIndicator.closest('div[role="button"]') : null;
            default:
                return null;
        }
    };
    
    // Stati del sistema
    window.AIZen.getStatus = function() {
        return {
            isProcessing: window.AIZen.isProcessing(),
            isInputEnabled: window.AIZen.isInputEnabled(),
            deepThinkEnabled: window.AIZen.isDeepThinkEnabled(),
            searchEnabled: window.AIZen.isSearchEnabled()
        };
    };
    
    // Verifica se sta elaborando
    window.AIZen.isProcessing = function() {
        // Controlla se esiste il pulsante STOP (con classe _480132b)
        const stopIndicator = document.querySelector('div[role="button"]._7436101 ._480132b');
        return stopIndicator !== null;
    };
    
    // Verifica se input è abilitato
    window.AIZen.isInputEnabled = function() {
        const input = window.AIZen.getElement('inputField');
        const btn = window.AIZen.getElement('btnInvio');
        
        if (!input || !btn) return false;
        
        // Controlla se il pulsante invio è disabilitato
        const isDisabled = btn.getAttribute('aria-disabled') === 'true' ||
                          btn.classList.contains('bcc55ca1'); // classe disabilitato
        
        return !input.disabled && !isDisabled;
    };
    
    // Verifica se DeepThink è abilitato
    window.AIZen.isDeepThinkEnabled = function() {
        // DeepThink abilitato ha colori specifici: --ds-button-color: #DBEAFE
        const deepThinkBtn = document.querySelector('div[role="button"] span:contains("DeepThink (R1)")');
        if (!deepThinkBtn) return false;
        
        const button = deepThinkBtn.closest('div[role="button"]');
        if (!button) return false;
        
        const buttonColor = button.style.getPropertyValue('--ds-button-color');
        return buttonColor === '#DBEAFE'; // Colore blu quando abilitato
    };
    
    // Verifica se Search è abilitato
    window.AIZen.isSearchEnabled = function() {
        // Search abilitato ha colori specifici: --ds-button-color: #DBEAFE
        const searchBtn = document.querySelector('div[role="button"] span:contains("Search")');
        if (!searchBtn) return false;
        
        const button = searchBtn.closest('div[role="button"]');
        if (!button) return false;
        
        const buttonColor = button.style.getPropertyValue('--ds-button-color');
        return buttonColor === '#DBEAFE'; // Colore blu quando abilitato
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
        
        // Clicca invio dopo un breve delay
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
    window.AIZen.toggleDeepThink = function() {
        const deepThinkBtn = document.querySelector('div[role="button"] span:contains("DeepThink (R1)")');
        if (deepThinkBtn) {
            const button = deepThinkBtn.closest('div[role="button"]');
            if (button) {
                button.click();
                return true;
            }
        }
        return false;
    };
    
    window.AIZen.toggleSearch = function() {
        const searchBtn = document.querySelector('div[role="button"] span:contains("Search")');
        if (searchBtn) {
            const button = searchBtn.closest('div[role="button"]');
            if (button) {
                button.click();
                return true;
            }
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