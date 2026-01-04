// ==UserScript==
// @name         Dreadcast - Mobile Fix & Bank Scroll (v2.0)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Global mobile input fixes and custom bank scroll buttons for Dreadcast
// @author       Laïn
// @match        https://www.dreadcast.net/*
// @grant        GM_addStyle
// @grant        GM_log
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/544645/Dreadcast%20-%20Mobile%20Fix%20%20Bank%20Scroll%20%28v20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544645/Dreadcast%20-%20Mobile%20Fix%20%20Bank%20Scroll%20%28v20%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Dreadcast Mobile Fix & Bank Scroll (v2.0): Script initiated.");

    // =============================================================================
    // GLOBAL MOBILE INPUT FIXES
    // =============================================================================
    
    // Global configuration for input fixes
    const CONFIG = {
        // Specific selectors that need fixes
        inputSelectors: [
            '.deck_main .ligne_ecriture .texte',
            '#champ_retrait_credit_compte',
            '#champ_depot_credit_compte', 
            '#lb_textinput_digicode-meuble',
            'input[name="centrale_vente_prix"]'
        ],
        
        // Additional selectors for broader coverage
        generalSelectors: [
            'input[type="text"]',
            'input[type="password"]', 
            'input[type="number"]',
            'textarea'
        ],
        
        // Elements to exclude from global fixes
        excludeSelectors: [
            '.no-mobile-fix',
            '[data-mobile-fix-ignore]'
        ],
        
        // Visual feedback options
        visualFeedback: {
            enabled: true,
            successColor: '#00ff00',
            processingColor: '#0080ff',
            errorColor: '#ff0000'
        }
    };

    // Set to track already processed inputs
    const processedInputs = new WeakSet();
    
    // Main input fixer class
    class MobileInputFixer {
        constructor() {
            this.initializeInputCSS();
            this.startGlobalObserver();
            this.processExistingInputs();
        }

        initializeInputCSS() {
            const css = `
                /* Mobile Input Fix Visual Feedback */
                input.mobile-fix-boost-z, textarea.mobile-fix-boost-z {
                    position: relative !important;
                    z-index: 9999 !important;
                }
                
                .mobile-fix-processing {
                    outline: 2px solid ${CONFIG.visualFeedback.processingColor} !important;
                    outline-offset: 1px !important;
                }
                
                .mobile-fix-success {
                    outline: 2px solid ${CONFIG.visualFeedback.successColor} !important;
                    outline-offset: 1px !important;
                }
                
                .mobile-fix-error {
                    outline: 2px solid ${CONFIG.visualFeedback.errorColor} !important;
                    outline-offset: 1px !important;
                }
            `;
            GM_addStyle(css);
        }

        isInputElement(element) {
            return element && (
                element.tagName === 'INPUT' || 
                element.tagName === 'TEXTAREA'
            );
        }

        shouldExcludeElement(element) {
            return CONFIG.excludeSelectors.some(selector => 
                element.matches && element.matches(selector)
            );
        }

        isTargetInput(element) {
            if (!this.isInputElement(element) || this.shouldExcludeElement(element)) {
                return false;
            }

            // Check if it matches specific selectors
            const matchesSpecific = CONFIG.inputSelectors.some(selector => {
                try {
                    return element.matches(selector);
                } catch (e) {
                    return false;
                }
            });

            if (matchesSpecific) return true;

            // Check general selectors, but only if input seems problematic
            const matchesGeneral = CONFIG.generalSelectors.some(selector => {
                try {
                    return element.matches(selector);
                } catch (e) {
                    return false;
                }
            });

            // Only apply to general inputs if they show signs of mobile issues
            if (matchesGeneral) {
                return this.hasLikelyMobileIssues(element);
            }

            return false;
        }

        hasLikelyMobileIssues(element) {
            // Heuristics to detect inputs that likely have mobile issues
            return (
                element.disabled ||
                element.readOnly ||
                element.type === 'password' ||
                (element.type === 'text' && !element.inputMode) ||
                getComputedStyle(element).pointerEvents === 'none' ||
                element.style.pointerEvents === 'none'
            );
        }

        applyInputFix(inputElement) {
            if (!inputElement || processedInputs.has(inputElement)) {
                return false;
            }

            try {
                this.showVisualFeedback(inputElement, 'processing');

                // Fix common mobile issues
                this.fixInputProperties(inputElement);
                this.addInteractionListeners(inputElement);
                this.optimizeForMobile(inputElement);

                // Mark as processed
                processedInputs.add(inputElement);
                inputElement.setAttribute('data-mobile-fixed', 'true');

                this.showVisualFeedback(inputElement, 'success');
                
                GM_log(`Fixed input: ${this.getInputIdentifier(inputElement)}`);
                return true;

            } catch (error) {
                GM_log(`Error fixing input: ${error.message}`);
                this.showVisualFeedback(inputElement, 'error');
                return false;
            }
        }

        fixInputProperties(inputElement) {
            // Remove blocking properties
            if (inputElement.disabled) inputElement.disabled = false;
            if (inputElement.readOnly) inputElement.readOnly = false;
            
            // Clear problematic inline styles
            if (inputElement.style.pointerEvents === 'none') {
                inputElement.style.pointerEvents = '';
            }
            
            // Clear problematic event handlers that might interfere
            inputElement.onfocus = null;
            inputElement.onblur = null;
            inputElement.onclick = null;
        }

        addInteractionListeners(inputElement) {
            const focusHandler = (event) => {
                event.stopPropagation();
                
                // Ensure element is still editable
                if (inputElement.disabled) inputElement.disabled = false;
                if (inputElement.readOnly) inputElement.readOnly = false;
                
                // Force focus with delay to override other scripts
                setTimeout(() => {
                    inputElement.focus();
                    
                    // Select text for better UX
                    if (typeof inputElement.select === 'function' && 
                        inputElement.type !== 'password') {
                        try {
                            inputElement.select();
                        } catch (e) {
                            // Selection might fail on some input types
                        }
                    }
                }, 10);
            };

            // Add both click and touch events
            inputElement.addEventListener('click', focusHandler, true);
            inputElement.addEventListener('touchend', focusHandler, true);
            
            // Also handle touchstart for immediate feedback
            inputElement.addEventListener('touchstart', (event) => {
                // Just ensure the element is ready, don't focus yet
                if (inputElement.disabled) inputElement.disabled = false;
                if (inputElement.readOnly) inputElement.readOnly = false;
            }, { passive: true });

            // Clear visual feedback on blur
            inputElement.addEventListener('blur', () => {
                this.clearVisualFeedback(inputElement);
            });
        }

        optimizeForMobile(inputElement) {
            // Set appropriate input modes based on context (like original script)
            if (inputElement.type === 'text' || inputElement.type === 'password') {
                // Check if it's likely a numeric input
                if (this.isLikelyNumericInput(inputElement)) {
                    inputElement.inputMode = 'numeric';
                } else if (!inputElement.inputMode) {
                    inputElement.inputMode = 'text';
                }
            }
            
            // Apply specific styling fixes only when needed
            if (this.needsColorFix(inputElement)) {
                inputElement.style.color = 'black';
            }
        }
        
        needsColorFix(inputElement) {
            // Only apply color fix for digicode input (like original script)
            return inputElement.id === 'lb_textinput_digicode-meuble';
        }

        isLikelyNumericInput(inputElement) {
            const identifier = this.getInputIdentifier(inputElement).toLowerCase();
            const numericKeywords = ['prix', 'price', 'amount', 'number', 'digicode', 'code', 'credit', 'depot', 'retrait'];
            return numericKeywords.some(keyword => identifier.includes(keyword));
        }

        getInputIdentifier(inputElement) {
            return inputElement.id || 
                   inputElement.name || 
                   inputElement.className || 
                   inputElement.tagName;
        }

        showVisualFeedback(inputElement, type) {
            if (!CONFIG.visualFeedback.enabled) return;

            this.clearVisualFeedback(inputElement);
            inputElement.classList.add(`mobile-fix-${type}`);

            if (type === 'success') {
                setTimeout(() => this.clearVisualFeedback(inputElement), 1500);
            }
        }

        clearVisualFeedback(inputElement) {
            inputElement.classList.remove('mobile-fix-processing', 'mobile-fix-success', 'mobile-fix-error', 'mobile-fix-boost-z');
        }

        processExistingInputs() {
            // Process inputs that already exist
            const allInputs = document.querySelectorAll('input, textarea');
            let fixedCount = 0;

            allInputs.forEach(input => {
                if (this.isTargetInput(input) && this.applyInputFix(input)) {
                    fixedCount++;
                }
            });

            GM_log(`Mobile Input Fix: Fixed ${fixedCount} existing inputs`);
        }

        startGlobalObserver() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.processNewNode(node);
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            GM_log('Mobile Input Fix: Global input observer started');
        }

        processNewNode(node) {
            // Check if the node itself is an input
            if (this.isTargetInput(node)) {
                this.applyInputFix(node);
            }

            // Check for inputs within the node
            if (typeof node.querySelectorAll === 'function') {
                const inputs = node.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    if (this.isTargetInput(input)) {
                        this.applyInputFix(input);
                    }
                });
            }
        }
    }

    // =============================================================================
    // BANK SCROLL BUTTONS
    // =============================================================================

    const buttonCSS = `
        #inventaire_compte {
            position: relative !important; /* Positioning context for buttons */
        }
        .custom-scroll-btn-dc-rv {
            position: absolute !important;
            right: 5px !important;
            width: 45px !important; /* Slightly smaller for dense mobile */
            height: 45px !important;
            background-color: rgba(0, 120, 200, 0.85) !important;
            color: white !important;
            text-align: center !important;
            line-height: 45px !important;
            font-size: 24px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            z-index: 10000 !important; /* Ensure on top of content within inventaire_compte */
            border-radius: 6px !important;
            border: 1px solid rgba(255, 255, 255, 0.6) !important;
            box-shadow: 0px 1px 5px rgba(0,0,0,0.5) !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        #custom-scroll-up-btn-dc-rv {
            top: 8px !important;
        }
        #custom-scroll-down-btn-dc-rv {
            bottom: 8px !important; /* Ensure it doesn't overlap form's "Annuler" button if too close */
        }

        /* Hide native scrollbars */
        #inventaire_compte #liste_stocks > .sp.ok::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            -webkit-appearance: none !important;
        }
        #inventaire_compte #liste_stocks > .sp.ok {
            scrollbar-width: none !important; /* Firefox */
            -ms-overflow-style: none !important; /* IE and Edge */
            overflow: -moz-scrollbars-none !important;
        }
    `;
    GM_addStyle(buttonCSS);

    let scrollInterval = null;
    let buttonsAdded = false;
    let scrollableAreaRef = null; // Keep a reference

    function manageScrollButtons() {
        const bankDialog = document.getElementById('db_compte_bancaire'); // Main bank dialog
        const inventaireCompte = document.querySelector('#modif_stocks_form #inventaire_compte');

        // Determine if the bank and inventory tab are truly visible
        const isBankVisible = bankDialog && bankDialog.style.display !== 'none' && getComputedStyle(bankDialog).display !== 'none';
        const isInventaireVisible = inventaireCompte && inventaireCompte.style.display !== 'none' && getComputedStyle(inventaireCompte).display !== 'none';

        if (isBankVisible && isInventaireVisible) {
            if (!buttonsAdded) {
                console.log("Dreadcast Bank Scroll: Inventaire tab is visible, adding buttons.");
                addScrollButtons(inventaireCompte);
                buttonsAdded = true;
            }
        } else {
            if (buttonsAdded) {
                console.log("Dreadcast Bank Scroll: Inventaire tab/Bank Dialog is hidden, removing buttons.");
                removeScrollButtons();
                buttonsAdded = false;
            }
        }
    }

    function addScrollButtons(inventaireCompteElement) {
        scrollableAreaRef = inventaireCompteElement.querySelector('#liste_stocks > .sp.ok');
        if (!scrollableAreaRef) {
            console.error("Dreadcast Bank Scroll: Scrollable area (.sp.ok) not found.");
            return;
        }
        // Log initial scroll height to see if content is present
        console.log("Dreadcast Bank Scroll: Scrollable area found. scrollHeight:", scrollableAreaRef.scrollHeight, "clientHeight:", scrollableAreaRef.clientHeight);


        const scrollUpButton = document.createElement('div');
        scrollUpButton.id = 'custom-scroll-up-btn-dc-rv';
        scrollUpButton.className = 'custom-scroll-btn-dc-rv';
        scrollUpButton.innerHTML = '▲'; // Up arrow ▲

        const scrollDownButton = document.createElement('div');
        scrollDownButton.id = 'custom-scroll-down-btn-dc-rv';
        scrollDownButton.className = 'custom-scroll-btn-dc-rv';
        scrollDownButton.innerHTML = '▼'; // Down arrow ▼

        inventaireCompteElement.appendChild(scrollUpButton);
        inventaireCompteElement.appendChild(scrollDownButton);
        console.log("Dreadcast Bank Scroll: Buttons appended.");

        const scrollStep = 60; // Pixels per step

        const performScroll = (direction) => {
            if (!scrollableAreaRef) return;
            const amount = direction === 'up' ? -scrollStep : scrollStep;
            scrollableAreaRef.scrollTop += amount;
            // console.log("Scrolling. New scrollTop:", scrollableAreaRef.scrollTop); // For debugging scroll
        };

        const startScrolling = (direction) => {
            stopScrolling();
            performScroll(direction); // Scroll once immediately
            scrollInterval = setInterval(() => performScroll(direction), 90);
        };

        const stopScrolling = () => {
            clearInterval(scrollInterval);
            scrollInterval = null;
        };

        // Use 'pointerdown' and 'pointerup' for better touch & mouse handling
        scrollUpButton.addEventListener('pointerdown', (e) => {
            e.preventDefault(); e.stopPropagation();
            scrollUpButton.setPointerCapture(e.pointerId); // Capture pointer for consistent events
            startScrolling('up');
        });
        scrollDownButton.addEventListener('pointerdown', (e) => {
            e.preventDefault(); e.stopPropagation();
            scrollDownButton.setPointerCapture(e.pointerId);
            startScrolling('down');
        });

        // 'pointerup' anywhere should stop scrolling if it was initiated by these buttons
        // 'pointercancel' for robustness
        const commonEndEvents = ['pointerup', 'pointercancel'];
        commonEndEvents.forEach(eventType => {
            scrollUpButton.addEventListener(eventType, (e) => {
                stopScrolling();
                scrollUpButton.releasePointerCapture(e.pointerId);
            });
            scrollDownButton.addEventListener(eventType, (e) => {
                stopScrolling();
                scrollDownButton.releasePointerCapture(e.pointerId);
            });
        });
    }

    function removeScrollButtons() {
        const upBtn = document.getElementById('custom-scroll-up-btn-dc-rv');
        const downBtn = document.getElementById('custom-scroll-down-btn-dc-rv');
        if (upBtn) upBtn.remove();
        if (downBtn) downBtn.remove();
        stopScrolling(); // Clear any active interval
        scrollableAreaRef = null; // Clear reference
        console.log("Dreadcast Bank Scroll: Buttons removed.");
    }

    // Observer for the bank dialog or its container.
    // #db_compte_bancaire is the ID of the bank dialog box.
    // We need to observe its parent if #db_compte_bancaire is added/removed,
    // or #db_compte_bancaire itself if its style (display) changes.
    // The original HTML shows <form id="modif_stocks_form"> as the parent of the tabs.
    // The entire bank dialog is likely within a container like #dataBox_content or similar.
    // Let's observe document.body for #db_compte_bancaire appearance/disappearance
    // and then #db_compte_bancaire itself for style changes on its children (the tabs).

    let bankDialogObserver = null;
    const mainObserverTargetNode = document.body; // Or a more specific known parent of #db_compte_bancaire if stable

    const mainObserver = new MutationObserver((mutationsList) => {
        let bankDialogNow = document.getElementById('db_compte_bancaire');

        // Check if bank dialog was added or removed, or if its style changed.
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.id === 'db_compte_bancaire') {
                        console.log("Dreadcast Bank Scroll: Bank dialog (#db_compte_bancaire) added.");
                        bankDialogNow = node; // Update reference
                        setupBankDialogObserver(bankDialogNow);
                    }
                });
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.id === 'db_compte_bancaire') {
                        console.log("Dreadcast Bank Scroll: Bank dialog (#db_compte_bancaire) removed.");
                        if (bankDialogObserver) bankDialogObserver.disconnect();
                        bankDialogObserver = null;
                        manageScrollButtons(); // Will trigger removal if buttons were present
                    }
                });
            }
             // If db_compte_bancaire itself has its style changed (e.g. display:none from an external script)
            if (mutation.type === 'attributes' && mutation.target.id === 'db_compte_bancaire' && mutation.attributeName === 'style') {
                console.log("Dreadcast Bank Scroll: Bank dialog (#db_compte_bancaire) style changed.");
                manageScrollButtons();
            }
        }

        // If bankDialog is present but observer isn't set up (e.g. on script load when dialog is already open)
        if (bankDialogNow && !bankDialogObserver) {
            setupBankDialogObserver(bankDialogNow);
        }

        // Always run manageScrollButtons to reconcile state
        // This covers cases where child elements of an already present dialog change style
        if(bankDialogNow && bankDialogObserver) { // only if observer is active on dialog
             manageScrollButtons();
        }
    });

    function setupBankDialogObserver(bankDialogElement) {
        if (bankDialogObserver) bankDialogObserver.disconnect(); // Disconnect previous if any

        bankDialogObserver = new MutationObserver(() => {
            // console.log("Dreadcast Bank Scroll: Mutation observed within bank dialog.");
            manageScrollButtons();
        });

        // Observe style changes on the tab content divs and the main form
        const inventaireCompte = bankDialogElement.querySelector('#inventaire_compte');
        const resumeCompte = bankDialogElement.querySelector('#resume_compte');
        const creditsCompte = bankDialogElement.querySelector('#credits_compte');
        const modifForm = bankDialogElement.querySelector('#modif_stocks_form');

        const observerConfig = { attributes: true, attributeFilter: ['style', 'class'], subtree: false };
        if (inventaireCompte) bankDialogObserver.observe(inventaireCompte, observerConfig);
        if (resumeCompte) bankDialogObserver.observe(resumeCompte, observerConfig);
        if (creditsCompte) bankDialogObserver.observe(creditsCompte, observerConfig);
        if (modifForm) bankDialogObserver.observe(modifForm, { attributes: true, attributeFilter: ['style', 'class'], subtree: false }); // Observe form style too


        console.log("Dreadcast Bank Scroll: Observer set up for bank dialog's tab content.");
        manageScrollButtons(); // Initial check after setting up
    }


    // Start main observer
    mainObserver.observe(mainObserverTargetNode, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    console.log("Dreadcast Bank Scroll: Main observer started on document.body (or target node).");

    // Initial check in case the dialog is already open
    setTimeout(() => {
        console.log("Dreadcast Bank Scroll: Delayed initial state check.");
        const bankDialogInitial = document.getElementById('db_compte_bancaire');
        if (bankDialogInitial && !bankDialogObserver) { // if dialog exists and observer not yet set by mainObserver
            console.log("Dreadcast Bank Scroll: Bank dialog present on delayed check, setting up its observer.");
            setupBankDialogObserver(bankDialogInitial);
        }
        manageScrollButtons();
    }, 700); // Increased delay slightly

    // =============================================================================
    // INITIALIZATION
    // =============================================================================
    
    // Initialize the global mobile input fixer
    function initGlobalMobileFixes() {
        GM_log('Initializing global mobile input fixes...');
        new MobileInputFixer();
    }

    // Start when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initGlobalMobileFixes();
    } else {
        document.addEventListener('DOMContentLoaded', initGlobalMobileFixes);
    }

})();