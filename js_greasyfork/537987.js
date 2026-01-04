// ==UserScript==
// @name         Dreadcast - Custom Bank Scroll Buttons (v1.3)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds custom scroll buttons to the Dreadcast bank inventory. Addresses scroll and removal.
// @author       Your Name
// @match        https://www.dreadcast.net/*
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/537987/Dreadcast%20-%20Custom%20Bank%20Scroll%20Buttons%20%28v13%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537987/Dreadcast%20-%20Custom%20Bank%20Scroll%20Buttons%20%28v13%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Dreadcast Bank Scroll Buttons (v1.3): Script initiated.");

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

})();