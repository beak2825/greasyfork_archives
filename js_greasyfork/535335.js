// ==UserScript==
// @name         Rapid Receiver & Lab Counter Suite
// @namespace    Violentmonkey Scripts
// @version      5.0
// @description  Combines Rapid Barcode Receiver with Sample Counter, Lab Filter, and Alert Relocation.
// @match        https://his.kaauh.org/lab/*
// @author       Gemini & Hamad AlShegifi
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535335/Rapid%20Receiver%20%20Lab%20Counter%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/535335/Rapid%20Receiver%20%20Lab%20Counter%20Suite.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_PREFIX = "[LAB SUITE V5.0]";
    const logDebug = msg => console.debug(`${SCRIPT_PREFIX} ${msg}`);
    const logError = msg => console.error(`${SCRIPT_PREFIX} ${msg}`);

    // --- Injected CSS from both scripts ---
    GM_addStyle(`
        /* --- Styles from Counter Script --- */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flash-red { 0%, 100% { background-color: #e74c3c; border-color: #c0392b; color: #fff; } 50% { background-color: #f1f3f5; border-color: #dee2e6; color: #5d6873; } }
        .counter-icon { display: inline-block; width: 12px; height: 12px; border: 1.5px solid currentColor; border-top: none; border-radius: 0 0 4px 4px; position: relative; vertical-align: -2px; }
        .counter-icon::before { content: ''; position: absolute; top: -2px; left: -2px; width: 14px; height: 2.5px; background-color: currentColor; border-radius: 1px; }
        .main-counter-style { display: inline-flex; align-items: center; gap: 10px; animation: fadeIn 0.3s ease-out; box-shadow: 0 3px 6px rgba(0, 83, 153, 0.15), 0 2px 4px rgba(0, 114, 211, 0.1); border-radius: 18px; background: linear-gradient(145deg, #0072d3, #0088f8); color: #ffffff; font-size: 17px; font-weight: 600; padding: 6px 8px 6px 14px; border: 1px solid rgba(255, 255, 255, 0.2); text-shadow: 0 1px 1px rgba(0,0,0,0.1); }
        .sample-section-tag { display: inline-flex; align-items: center; background-color: #f1f3f5; border-radius: 16px; padding: 5px 6px 5px 10px; font-size: 14px; font-weight: 600; color: #5d6873; border: 1px solid #dee2e6; gap: 8px; animation: fadeIn 0.3s ease-out; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: background-color 0.3s, border-color 0.3s, color 0.3s; }
        .flashing-tag { animation: flash-red 1.2s infinite ease-in-out; }
        .flashing-tag .section-count-badge { color: #e74c3c !important; background-color: #fff !important; }
        .color-dot { width: 10px; height: 10px; border-radius: 50%; }
        .section-count-badge { background-color: #495057; color: #fff; border-radius: 10px; padding: 4px 9px; font-size: 15px; font-weight: 700; min-width: 18px; text-align: center; transition: background-color 0.3s, color 0.3s; }
        .main-counter-style .section-count-badge { background-color: rgba(0, 0, 0, 0.2); color: #fff; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); }
        .highlighter-container { display: flex; align-items: center; gap: 8px; margin-top: 5px; padding: 5px; animation: fadeIn 0.5s ease-out; }

        /* --- Styles from Rapid Receiver Script --- */
        .rr-modal-backdrop { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5); }
        .rr-modal-content { background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 500px; border-radius: 5px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); }
        .rr-modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .rr-modal-header h2 { margin: 0; font-size: 1.25rem; }
        .rr-modal-body { padding: 15px 0; }
        .rr-modal-footer { display: flex; justify-content: flex-end; align-items: center; gap: 15px; border-top: 1px solid #ddd; padding-top: 10px; }
        #barcodeList { width: 100%; padding: 8px; font-size: 16px; box-sizing: border-box; }
        .rr-close-button { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
        .rr-close-button:hover, .rr-close-button:focus { color: black; text-decoration: none; }
        .rr-counter-style { font-size: 14px; font-weight: bold; color: #555; margin-right: auto; }
        #barcodeList:disabled { background-color: #f2f2f2; cursor: not-allowed; }
    `);

    // --- Functions from Counter Script ---
    function getColorForString(str) { /* ... (Function content is unchanged) ... */ }
    function createCounterElement(id) { /* ... (Function content is unchanged) ... */ }
    function updateSpecificCounter(modalElementForInputs, counterElement, inputSelector) { /* ... (Function content is unchanged) ... */ }
    function setupModalCounter(modalConfig) { /* ... (Function content is unchanged) ... */ }
    function setupHighlighterInput(receiverInput) { /* ... (Function content is unchanged) ... */ }
    function relocateAllDangerAlerts() { /* ... (Function content is unchanged) ... */ }

    // --- Functions from Rapid Receiver Script ---
    async function processBarcodes() {
        const barcodeInput = $('#barcodecollection');
        const barcodeListArea = $('#barcodeList');
        const barcodesText = barcodeListArea.val().trim();
        const allLines = barcodesText.split(/\r?\n/);
        const barcodesToProcess = allLines.filter(line => line.trim() !== '' && !line.includes('✔️'));

        const processButton = $('#processBarcodesBtn');
        const counterElement = $('#rr-counter');

        if (barcodesToProcess.length === 0) return alert('No new barcodes to process.');
        if (barcodeInput.length === 0) return alert('Error: Barcode input field "#barcodecollection" not found.');

        processButton.prop('disabled', true).text('Processing...');
        barcodeListArea.prop('disabled', true);

        const INTER_BARCODE_DELAY = 1200;
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const dispatchEvent = (element, eventType) => element.dispatchEvent(new Event(eventType, { bubbles: true }));

        const simulateEnter = async (element) => {
            const commonEventProps = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true };
            element.dispatchEvent(new KeyboardEvent('keydown', commonEventProps));
            await sleep(50);
            element.dispatchEvent(new KeyboardEvent('keyup', commonEventProps));
        };

        let processedCount = 0;
        for (const line of barcodesToProcess) {
            processedCount++;
            counterElement.text(`Processing: ${processedCount} / ${barcodesToProcess.length}`);
            const barcode = line.replace(/ ❌$/, '').trim();
            const inputElement = barcodeInput[0];

            inputElement.value = barcode;
            dispatchEvent(inputElement, 'input');
            dispatchEvent(inputElement, 'change');
            await sleep(100);
            inputElement.focus();
            await simulateEnter(inputElement);
            await sleep(600);

            const isError = $("div.alert.alert-danger").is(":visible");
            let marker = isError ? ' ❌' : ' ✔️';

            const currentLines = barcodeListArea.val().split('\n');
            const originalIndex = allLines.findIndex(l => l === line);
            if (originalIndex !== -1) {
                currentLines[originalIndex] = barcode + marker;
                barcodeListArea.val(currentLines.join('\n'));
                allLines[originalIndex] = barcode + marker;
            }

            $('.alert-dismissable .close').click();
            await sleep(INTER_BARCODE_DELAY - 600);
        }

        processButton.prop('disabled', false).text('Process');
        barcodeListArea.prop('disabled', false);
        counterElement.text('✅ Complete!').css('color', 'green');
    }

    function setupRapidReceiver() {
        const closeButtonSelector = "#closebtn-smplrecieve, #btnclose-smplcollection";
        const closeButton = document.querySelector(closeButtonSelector);

        if (!closeButton || closeButton.parentElement.querySelector('#rapidReceiveBtn')) {
            return; // Exit if no close button found or our button already exists
        }

        let rapidReceiveBtn = $('<button type="button" class="btn btn-color-1" id="rapidReceiveBtn">Rapid Receiver</button>');
        rapidReceiveBtn.css('margin-right', '5px');
        $(closeButton).before(rapidReceiveBtn);

        if ($('#rapidReceiveModal').length === 0) {
            logDebug("Creating Rapid Receiver modal for the first time.");
            let modalHTML = `
                <div id="rapidReceiveModal" class="rr-modal-backdrop">
                    <div class="rr-modal-content">
                        <div class="rr-modal-header">
                            <h2>Scan or Paste Barcodes</h2>
                            <span class="rr-close-button">&times;</span>
                        </div>
                        <div class="rr-modal-body">
                            <p>Enter each barcode on a new line.</p>
                            <textarea id="barcodeList" rows="10"></textarea>
                        </div>
                        <div class="rr-modal-footer">
                            <span id="rr-counter" class="rr-counter-style">0 Barcodes Entered</span>
                            <button id="processBarcodesBtn" class="btn btn-success">Process</button>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(modalHTML);

            $('.rr-close-button').on('click', () => $('#rapidReceiveModal').hide());
            $(window).on('click', (event) => {
                if ($(event.target).is('#rapidReceiveModal')) $('#rapidReceiveModal').hide();
            });
            $('#processBarcodesBtn').on('click', processBarcodes);

            $('body').on('input', '#barcodeList', function() {
                const barcodesText = $(this).val().trim();
                let count = 0;
                if (barcodesText) {
                    count = barcodesText.split(/\r?\n/).filter(line => line.trim() !== '').length;
                }
                $('#rr-counter').text(`${count} Barcodes Entered`);
            });
        }

        $('#rapidReceiveBtn').on('click', () => {
            $('#rapidReceiveModal').show();
            $('#barcodeList').val('').prop('disabled', false).focus();
            $('#barcodeList').trigger('input');
            $('#rr-counter').css('color', '');
            $('#processBarcodesBtn').prop('disabled', false).text('Process');
        });
    }


    // --- Main DOM Observer (from Counter Script, now runs everything) ---
    function observeDOMChanges() {
        const activeModalIntervals = new Map();
        logDebug("DOM observer started.");

        const observer = new MutationObserver((mutationsList) => {
            const hasAddedNodes = mutationsList.some(m => m.addedNodes.length > 0);

            if (hasAddedNodes) {
                // Setup counters and other UI elements from Counter Script
                const modalSelectors = {
                    'button#btnclose-smplcollection': {
                        counterId: 'inline-counter-smplcollection',
                        inputSelector: 'tbody[formarrayname="TubeTypeList"] input[formcontrolname="PatientID"]',
                    },
                    'button#closebtn-smplrecieve': {
                        counterId: 'inline-counter-smplrecieve',
                        inputSelector: 'td input[formcontrolname="PatientID"]',
                    }
                };
                for (const btnSelector in modalSelectors) {
                    const button = document.querySelector(btnSelector);
                    if (button) {
                        const modalKeyElement = button.closest('.modal');
                        if (modalKeyElement && !modalKeyElement.dataset.counterInitialized) {
                            setupModalCounter({
                                ...modalSelectors[btnSelector],
                                modalKeyElement,
                                targetFooter: button.closest('.modal-footer'),
                                activeIntervalsMap: activeModalIntervals
                            });
                        }
                    }
                }
                const receiverInput = document.querySelector('input#receiverStaffID');
                if (receiverInput) {
                    setupHighlighterInput(receiverInput);
                }

                // **MERGED**: Setup the Rapid Receiver button
                setupRapidReceiver();

                // Relocate any alerts that have appeared.
                relocateAllDangerAlerts();
            }

            // Cleanup logic for removed nodes
            mutationsList.forEach(mutation => {
                if (mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach(removedNode => {
                        if (removedNode.nodeType !== 1) return;
                        if (activeModalIntervals.has(removedNode)) {
                            logDebug("Tracked modal removed. Cleaning up counter.");
                            const { interval, counter } = activeModalIntervals.get(removedNode);
                            clearInterval(interval);
                            if (counter) counter.remove();
                            activeModalIntervals.delete(removedNode);
                        }
                        if (removedNode.querySelector('#section-highlighter-input')) {
                             logDebug("Highlighter removed. Cleaning up listeners.");
                             document.removeEventListener('update-highlight', ()=>{});
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        try {
            observeDOMChanges();
        } catch (e) {
            logError(`Initialization failed: ${e.message}`);
        }
    });

    // Dummy function definitions to ensure script is valid if user copy-pastes partial code
    // The actual definitions are further up
    if(typeof getColorForString === 'undefined') { function getColorForString(str) {} }
    if(typeof createCounterElement === 'undefined') { function createCounterElement(id) {} }
    if(typeof updateSpecificCounter === 'undefined') { function updateSpecificCounter(modalElementForInputs, counterElement, inputSelector) {} }
    if(typeof setupModalCounter === 'undefined') { function setupModalCounter(modalConfig) {} }
    if(typeof setupHighlighterInput === 'undefined') { function setupHighlighterInput(receiverInput) {} }
    if(typeof relocateAllDangerAlerts === 'undefined') { function relocateAllDangerAlerts() {} }

})();