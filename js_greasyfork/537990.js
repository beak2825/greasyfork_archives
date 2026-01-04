// ==UserScript==
// @name         Mobile DC Fix
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Divers fix mobile
// @author       Laïn
// @match        https://www.dreadcast.net/*
// @grant        GM_addStyle
// @grant        GM_log
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/537990/Mobile%20DC%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/537990/Mobile%20DC%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initDeckMainInputFocusFix() {
        const attemptFixFocus = () => {
            const targetInput = document.querySelector('.deck_main .ligne_ecriture .texte');
            if (targetInput) {
                const reFocus = () => {
                    setTimeout(() => {
                        targetInput.focus();
                    }, 0);
                };
                
                targetInput.removeEventListener('click', reFocus);
                targetInput.addEventListener('click', reFocus);

                targetInput.removeEventListener('touchstart', reFocus);
                targetInput.addEventListener('touchstart', reFocus, { passive: true });

            } else {
                setTimeout(attemptFixFocus, 500);
            }
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            attemptFixFocus();
        } else {
            document.addEventListener('DOMContentLoaded', attemptFixFocus);
        }
    }

    function initBankScrollButtons() {
        const buttonCSS_bankScroll = `
            #inventaire_compte {
                position: relative !important;
            }
            .custom-scroll-btn-dc-rv {
                position: absolute !important;
                right: 5px !important;
                width: 45px !important;
                height: 45px !important;
                background-color: rgba(0, 120, 200, 0.85) !important;
                color: white !important;
                text-align: center !important;
                line-height: 45px !important;
                font-size: 24px !important;
                font-weight: bold !important;
                cursor: pointer !important;
                z-index: 10000 !important;
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
                bottom: 8px !important;
            }
            #inventaire_compte #liste_stocks > .sp.ok::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
                -webkit-appearance: none !important;
            }
            #inventaire_compte #liste_stocks > .sp.ok {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
                overflow: -moz-scrollbars-none !important;
            }
        `;
        GM_addStyle(buttonCSS_bankScroll);

        let scrollInterval_bank = null;
        let buttonsAdded_bank = false;
        let scrollableAreaRef_bank = null;
        let bankDialogObserver_bank = null;
        const mainObserverTargetNode_bank = document.body;
        let mainObserver_bank = null;


        function manageScrollButtons_bank() {
            const bankDialog = document.getElementById('db_compte_bancaire');
            const inventaireCompte = document.querySelector('#modif_stocks_form #inventaire_compte');

            const isBankVisible = bankDialog && bankDialog.style.display !== 'none' && getComputedStyle(bankDialog).display !== 'none';
            const isInventaireVisible = inventaireCompte && inventaireCompte.style.display !== 'none' && getComputedStyle(inventaireCompte).display !== 'none';

            if (isBankVisible && isInventaireVisible) {
                if (!buttonsAdded_bank) {
                    addScrollButtons_bank(inventaireCompte);
                    buttonsAdded_bank = true;
                }
            } else {
                if (buttonsAdded_bank) {
                    removeScrollButtons_bank();
                    buttonsAdded_bank = false;
                }
            }
        }

        function addScrollButtons_bank(inventaireCompteElement) {
            scrollableAreaRef_bank = inventaireCompteElement.querySelector('#liste_stocks > .sp.ok');
            if (!scrollableAreaRef_bank) {
                return;
            }

            const scrollUpButton = document.createElement('div');
            scrollUpButton.id = 'custom-scroll-up-btn-dc-rv';
            scrollUpButton.className = 'custom-scroll-btn-dc-rv';
            scrollUpButton.innerHTML = '▲';

            const scrollDownButton = document.createElement('div');
            scrollDownButton.id = 'custom-scroll-down-btn-dc-rv';
            scrollDownButton.className = 'custom-scroll-btn-dc-rv';
            scrollDownButton.innerHTML = '▼';

            inventaireCompteElement.appendChild(scrollUpButton);
            inventaireCompteElement.appendChild(scrollDownButton);

            const scrollStep = 60;

            const performScroll_bank = (direction) => {
                if (!scrollableAreaRef_bank) return;
                const amount = direction === 'up' ? -scrollStep : scrollStep;
                scrollableAreaRef_bank.scrollTop += amount;
            };

            const startScrolling_bank = (direction) => {
                stopScrolling_bank();
                performScroll_bank(direction);
                scrollInterval_bank = setInterval(() => performScroll_bank(direction), 90);
            };

            const stopScrolling_bank = () => {
                clearInterval(scrollInterval_bank);
                scrollInterval_bank = null;
            };

            scrollUpButton.addEventListener('pointerdown', (e) => {
                e.preventDefault(); e.stopPropagation();
                scrollUpButton.setPointerCapture(e.pointerId);
                startScrolling_bank('up');
            });
            scrollDownButton.addEventListener('pointerdown', (e) => {
                e.preventDefault(); e.stopPropagation();
                scrollDownButton.setPointerCapture(e.pointerId);
                startScrolling_bank('down');
            });

            const commonEndEvents = ['pointerup', 'pointercancel'];
            commonEndEvents.forEach(eventType => {
                scrollUpButton.addEventListener(eventType, (e) => {
                    stopScrolling_bank();
                    scrollUpButton.releasePointerCapture(e.pointerId);
                });
                scrollDownButton.addEventListener(eventType, (e) => {
                    stopScrolling_bank();
                    scrollDownButton.releasePointerCapture(e.pointerId);
                });
            });
        }

        function removeScrollButtons_bank() {
            const upBtn = document.getElementById('custom-scroll-up-btn-dc-rv');
            const downBtn = document.getElementById('custom-scroll-down-btn-dc-rv');
            if (upBtn) upBtn.remove();
            if (downBtn) downBtn.remove();
            stopScrolling_bank();
            scrollableAreaRef_bank = null;
        }

        mainObserver_bank = new MutationObserver((mutationsList) => {
            let bankDialogNow = document.getElementById('db_compte_bancaire');

            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.id === 'db_compte_bancaire') {
                            bankDialogNow = node;
                            setupBankDialogObserver_bank(bankDialogNow);
                        }
                    });
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.id === 'db_compte_bancaire') {
                            if (bankDialogObserver_bank) bankDialogObserver_bank.disconnect();
                            bankDialogObserver_bank = null;
                            manageScrollButtons_bank();
                        }
                    });
                }
                if (mutation.type === 'attributes' && mutation.target.id === 'db_compte_bancaire' && mutation.attributeName === 'style') {
                    manageScrollButtons_bank();
                }
            }

            if (bankDialogNow && !bankDialogObserver_bank) {
                setupBankDialogObserver_bank(bankDialogNow);
            }

            if(bankDialogNow && bankDialogObserver_bank) {
                 manageScrollButtons_bank();
            }
        });

        function setupBankDialogObserver_bank(bankDialogElement) {
            if (bankDialogObserver_bank) bankDialogObserver_bank.disconnect();

            bankDialogObserver_bank = new MutationObserver(() => {
                manageScrollButtons_bank();
            });

            const inventaireCompte = bankDialogElement.querySelector('#inventaire_compte');
            const resumeCompte = bankDialogElement.querySelector('#resume_compte');
            const creditsCompte = bankDialogElement.querySelector('#credits_compte');
            const modifForm = bankDialogElement.querySelector('#modif_stocks_form');

            const observerConfig = { attributes: true, attributeFilter: ['style', 'class'], subtree: false };
            if (inventaireCompte) bankDialogObserver_bank.observe(inventaireCompte, observerConfig);
            if (resumeCompte) bankDialogObserver_bank.observe(resumeCompte, observerConfig);
            if (creditsCompte) bankDialogObserver_bank.observe(creditsCompte, observerConfig);
            if (modifForm) bankDialogObserver_bank.observe(modifForm, observerConfig);

            manageScrollButtons_bank();
        }

        mainObserver_bank.observe(mainObserverTargetNode_bank, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

        setTimeout(() => {
            const bankDialogInitial = document.getElementById('db_compte_bancaire');
            if (bankDialogInitial && !bankDialogObserver_bank) {
                setupBankDialogObserver_bank(bankDialogInitial);
            }
            manageScrollButtons_bank();
        }, 700);
    }

    function initMobileBankCreditsFix() {
        const inputIds_credits = ['champ_retrait_credit_compte', 'champ_depot_credit_compte'];
        const fixedInputs_credits = new Set();

        function fixInputFocus_credits(targetInputId) {
            const inputField = document.getElementById(targetInputId);
            if (!inputField || fixedInputs_credits.has(targetInputId)) {
                return fixedInputs_credits.has(targetInputId);
            }

            ['touchend', 'click'].forEach(eventType => {
                inputField.addEventListener(eventType, function(event) {
                    event.stopPropagation();
                    this.focus();
                }, true);
            });

            fixedInputs_credits.add(targetInputId);
            return true;
        }

        function tryApplyFixesToAllTargets_credits() {
            let allCurrentlyFixedOrNonExistent = true;
            for (const id of inputIds_credits) {
                if (!fixedInputs_credits.has(id)) {
                    if (document.getElementById(id)) {
                        if (!fixInputFocus_credits(id)) {
                            allCurrentlyFixedOrNonExistent = false;
                        }
                    } else {
                        allCurrentlyFixedOrNonExistent = false;
                    }
                }
            }
            return allCurrentlyFixedOrNonExistent;
        }

        const observer_credits = new MutationObserver(function(mutationsList, observerInstance) {
            if (tryApplyFixesToAllTargets_credits()) {
                const allExpectedAreFixed = inputIds_credits.every(id => fixedInputs_credits.has(id));
                if (allExpectedAreFixed) {
                    observerInstance.disconnect();
                }
            }
        });

        observer_credits.observe(document.body, { childList: true, subtree: true });

        if (tryApplyFixesToAllTargets_credits()) {
            const allExpectedAreFixed = inputIds_credits.every(id => fixedInputs_credits.has(id));
            if (allExpectedAreFixed) {
                observer_credits.disconnect();
            }
        }
    }

    function initMobileDigicodeFix() {
        const inputId_digicode = 'lb_textinput_digicode-meuble';
        let attempts_digicode = 0;
        const maxAttempts_digicode = 20;

        function initializeFix_digicode() {
            const digicodeInput = document.getElementById(inputId_digicode);

            if (digicodeInput) {
                digicodeInput.onfocus = null;
                digicodeInput.onblur = null;

                function handleFocusAndStyle_digicode(event) {
                    if (this.readOnly) this.readOnly = false;
                    if (this.disabled) this.disabled = false;
                    this.focus();
                    this.style.color = 'black';
                }

                digicodeInput.addEventListener('click', handleFocusAndStyle_digicode);
                digicodeInput.addEventListener('touchstart', handleFocusAndStyle_digicode, { passive: true });

                if (digicodeInput.type === 'password' || digicodeInput.type === 'text') {
                     digicodeInput.inputMode = 'numeric';
                }
            } else {
                attempts_digicode++;
                if (attempts_digicode < maxAttempts_digicode) {
                    setTimeout(initializeFix_digicode, 500);
                }
            }
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initializeFix_digicode();
        } else {
            document.addEventListener('DOMContentLoaded', initializeFix_digicode);
        }
    }

    function initCentraleVenteFix() {
        const inputName_centrale = 'centrale_vente_prix';
        const parentLiId_centrale = 'lb_form_centrale_vente_prix';
        let popupObserver_centrale;

        function makeInputInteractive_centrale(inputElement, interactionType = "direct_action") {
            if (!inputElement) return false;

            inputElement.style.outline = '2px solid blue';

            if (inputElement.disabled) inputElement.disabled = false;
            if (inputElement.readOnly) inputElement.readOnly = false;
            if (inputElement.inputMode !== 'numeric') inputElement.inputMode = 'numeric';

            if (interactionType === "click" || interactionType === "touchend") {
                setTimeout(() => {
                    inputElement.focus();
                    if (document.activeElement === inputElement) {
                        inputElement.style.outline = '2px solid limegreen';
                        if (typeof inputElement.select === 'function') inputElement.select();
                    } else {
                        inputElement.style.outline = '2px solid red';
                    }
                }, 50);
            } else {
                 setTimeout(() => {
                    if (document.activeElement !== inputElement || (inputElement.style.outline && inputElement.style.outline.includes('red'))) {
                       inputElement.style.outline = '';
                    }
                }, 1500);
            }
            return true;
        }

        function setupInputListeners_centrale(inputElement) {
            if (!inputElement || inputElement.dataset.gmPopupFixed === 'true') return;

            inputElement.addEventListener('click', handleDirectInputInteraction_centrale, true);
            inputElement.addEventListener('touchend', handleDirectInputInteraction_centrale, true);
            inputElement.addEventListener('blur', () => {
                inputElement.style.outline = '';
            }, true);
            inputElement.dataset.gmPopupFixed = 'true';
        }

        function handleDirectInputInteraction_centrale(event) {
            event.stopPropagation();
            makeInputInteractive_centrale(event.currentTarget, event.type);
        }

        function scanForNewInput_centrale(nodeList) {
            for (const node of nodeList) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    let targetLi = null;
                    if (node.id === parentLiId_centrale && node.matches('li')) {
                        targetLi = node;
                    } else if (typeof node.querySelector === 'function') {
                        targetLi = node.querySelector(`#${parentLiId_centrale}`);
                    }

                    if (targetLi) {
                        const newInput = targetLi.querySelector(`input[name="${inputName_centrale}"]`);
                        if (newInput && !newInput.dataset.gmPopupFixed) {
                            makeInputInteractive_centrale(newInput, "appearance_scan");
                            setupInputListeners_centrale(newInput);
                        }
                    }
                }
            }
        }

        function initializeGlobalObserver_centrale() {
            const stableAncestor = document.body;
            if (!stableAncestor) {
                setTimeout(initializeGlobalObserver_centrale, 1000);
                return;
            }

            popupObserver_centrale = new MutationObserver((mutationsList, obs) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        scanForNewInput_centrale(mutation.addedNodes);
                    }
                }
            });

            popupObserver_centrale.observe(stableAncestor, { childList: true, subtree: true });

            const existingLi = document.getElementById(parentLiId_centrale);
            if(existingLi) {
                const existingInput = existingLi.querySelector(`input[name="${inputName_centrale}"]`);
                if (existingInput && !existingInput.dataset.gmPopupFixed) {
                    makeInputInteractive_centrale(existingInput, "initial_scan");
                    setupInputListeners_centrale(existingInput);
                }
            }
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initializeGlobalObserver_centrale();
        } else {
            document.addEventListener('DOMContentLoaded', initializeGlobalObserver_centrale);
        }
    }

    initBankScrollButtons();
    initMobileBankCreditsFix();
    initMobileDigicodeFix();
    initCentraleVenteFix();
    initDeckMainInputFocusFix();

})();