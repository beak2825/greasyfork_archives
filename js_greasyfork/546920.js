// ==UserScript==
// @name         Rapid Barcode Receiver (Resize Fix v2)
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Uses !important CSS override to fix column resizing on pages with conflicting styles.
// @author       Gemini & User
// @match        *://*/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/colresizable@1.6.0/colResizable-1.6.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546920/Rapid%20Barcode%20Receiver%20%28Resize%20Fix%20v2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546920/Rapid%20Barcode%20Receiver%20%28Resize%20Fix%20v2%29.meta.js
// ==/UserScript==

// --- Utility function to wait for dynamically loaded elements ---
function waitForKeyElements(selector, callback, bWaitOnce) {
    var targetNodes, bDone = false;
    targetNodes = $(selector);
    if (targetNodes && targetNodes.length > 0) {
        targetNodes.each(function() { callback($(this)); });
        bDone = bWaitOnce;
    }
    var obs = new MutationObserver(function(mutations) {
        if (bDone) { obs.disconnect(); return; }
        mutations.forEach(function(mutation) {
            var newNodes = mutation.addedNodes;
            if (newNodes && newNodes.length > 0) {
                for (var i = 0, len = newNodes.length; i < len; i++) {
                    var newNode = newNodes[i];
                    if (newNode.nodeType === 1) {
                        var $node = $(newNode);
                        if ($node.is(selector)) {
                            callback($node);
                            if (bWaitOnce) bDone = true;
                        } else if ($node.find(selector).length > 0) {
                            $node.find(selector).each(function() { callback($(this)); });
                            if (bWaitOnce) bDone = true;
                        }
                    }
                }
            }
        });
    });
    obs.observe(document.body, { childList: true, subtree: true });
}

// --- Main script logic ---
function initializeScript() {
    const closeButtonSelector = "#closebtn-smplrecieve, #btnclose-smplcollection";

    waitForKeyElements(closeButtonSelector, (closeButton) => {
        if (closeButton.parent().find('#rapidReceiveBtn').length > 0) return;

        let rapidReceiveBtn = $('<button type="button" class="btn btn-color-1" id="rapidReceiveBtn">Rapid Receiver</button>');
        rapidReceiveBtn.css('margin-right', '5px');
        closeButton.before(rapidReceiveBtn);

        if ($('#rapidReceiveModal').length === 0) {
            let modalHTML = `
                <div id="rapidReceiveModal" class="rr-modal-backdrop">
                    <div class="rr-modal-content">
                        <div class="rr-modal-header">
                            <h2>Rapid Barcode Processor</h2>
                            <span class="rr-close-button">&times;</span>
                        </div>
                        <div class="rr-modal-body">
                            <input type="text" id="newBarcodeEntry" placeholder="Scan or paste barcodes here and press Enter">
                            <div id="rr-table-container">
                                <table id="barcodeTable">
                                    <thead>
                                        <tr>
                                            <th class="rr-th-no">No.</th>
                                            <th class="rr-th-barcode">Barcode</th>
                                            <th class="rr-th-location">Location</th>
                                            <th class="rr-th-status">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody id="barcodeListBody"></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="rr-modal-footer">
                            <span id="rr-counter" class="rr-counter-style">0 Barcodes Entered</span>
                            <div>
                                <button id="clearBarcodesBtn" class="btn btn-danger">Clear</button>
                                <button id="processBarcodesBtn" class="btn btn-success">Process</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(modalHTML);

            GM_addStyle(`
                .rr-modal-backdrop { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); }
                .rr-modal-content { display: flex; flex-direction: column; background-color: #f8f9fa; margin: 5% auto; padding: 25px; border: none; width: 90%; max-width: 900px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); height: 80vh; }
                .rr-modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dee2e6; padding-bottom: 15px; margin-bottom: 15px; }
                .rr-modal-header h2 { margin: 0; font-size: 1.5rem; color: #343a40; }
                .rr-modal-body { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
                .rr-modal-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #dee2e6; padding-top: 15px; margin-top: 15px; }
                .rr-close-button { color: #aaa; font-size: 32px; font-weight: bold; cursor: pointer; line-height: 1; }
                .rr-close-button:hover { color: black; }
                #newBarcodeEntry { width: 100%; padding: 10px; font-size: 16px; margin-bottom: 15px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box; }
                #newBarcodeEntry:focus { border-color: #80bdff; outline: 0; box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); }
                #rr-table-container { flex-grow: 1; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 4px; background-color: #fff; }
                #barcodeTable { width: 100%; border-collapse: collapse; table-layout: fixed; }
                #barcodeTable th, #barcodeTable td { padding: 4px 15px; text-align: left; border-bottom: 1px solid #e9ecef; vertical-align: middle; }
                #barcodeTable th { background-color: #e9ecef; color: #495057; position: sticky; top: 0; }
                /* MODIFIED: Added !important to force vertical lines to appear */
                #barcodeTable th:not(:last-child), #barcodeTable td:not(:last-child) { border-right: 1px solid #dee2e6 !important; }
                #barcodeTable tbody tr:nth-child(even) { background-color: #f8f9fa; }
                .rr-th-no { width: 5%; }
                .rr-th-barcode { width: 35%; }
                .rr-th-location { width: 15%; }
                .rr-th-status { width: 45%; }
                td.status-cell { font-weight: bold; text-align: left; }
                td.status-cell.success { text-align: center; color: green; font-size: 1.2rem; }
                .rr-counter-style { font-size: 14px; font-weight: bold; color: #555; }
                #clearBarcodesBtn { margin-right: 10px; }
                .rr-error-text { color: #D8000C; font-weight: bold; font-size: 12px; }
                /* MODIFIED: Forceful grip style to ensure it is visible and clickable */
                .JCLRgrip {
                    background-color: #007bff !important;
                    width: 3px !important;
                    z-index: 99999 !important;
                }
            `);

            // Delay initialization to prevent conflicts
            setTimeout(() => {
                $('#barcodeTable').colResizable({
                    liveDrag: true,
                    gripInnerHtml: "<div class='JCLRgrip'></div>",
                    minWidth: 30 // Prevent columns from becoming too small
                });
            }, 100);

            // --- Event Listeners ---
            $('.rr-close-button').on('click', () => $('#rapidReceiveModal').hide());
            $(window).on('click', (event) => {
                if ($(event.target).is('#rapidReceiveModal')) $('#rapidReceiveModal').hide();
            });
            $('#processBarcodesBtn').on('click', processBarcodes);
            $('#clearBarcodesBtn').on('click', clearAllBarcodes);
            $('#newBarcodeEntry').on('keydown', handleBarcodeEntry);
            $('#newBarcodeEntry').on('paste', handleBarcodePaste);
        }

        $('#rapidReceiveBtn').on('click', openRapidReceiver);

    }, false);
}

function openRapidReceiver() {
    $('#rapidReceiveModal').show();
    clearAllBarcodes();
    $('#newBarcodeEntry').focus();
    $('#rr-counter').css('color', '');
    $('#processBarcodesBtn, #clearBarcodesBtn').prop('disabled', false);
    $('#processBarcodesBtn').text('Process');
}

function clearAllBarcodes() {
    $('#barcodeListBody').empty();
    $('#newBarcodeEntry').val('').prop('disabled', false);
    updateBarcodeCount();
}

function updateBarcodeCount() {
    const count = $('#barcodeListBody tr').length;
    $('#rr-counter').text(`${count} Barcodes Entered`);
}

function addBarcodeToTable(barcode) {
    barcode = barcode.trim();
    if (barcode === '') return;

    const currentBarcodes = new Set();
    $('#barcodeListBody td:nth-child(2)').each(function() {
        currentBarcodes.add($(this).text());
    });
    if (currentBarcodes.has(barcode)) return;

    const rowIndex = $('#barcodeListBody tr').length;
    const rowNum = rowIndex + 1;

    const letter = String.fromCharCode(65 + Math.floor(rowIndex / 10));
    const number = (rowIndex % 10) + 1;
    const location = `${letter}${number}`;

    const newRow = `
        <tr>
            <td>${rowNum}</td>
            <td>${barcode}</td>
            <td>${location}</td>
            <td class="status-cell"></td>
        </tr>
    `;
    $('#barcodeListBody').append(newRow);
    updateBarcodeCount();
}

function handleBarcodeEntry(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const barcodeInput = $(this);
        const barcode = barcodeInput.val();
        addBarcodeToTable(barcode);
        barcodeInput.val('');
    }
}

function handleBarcodePaste(event) {
    event.preventDefault();
    const pastedText = (event.originalEvent || event).clipboardData.getData('text/plain');
    const barcodes = pastedText.split(/\r?\n/).filter(line => line.trim() !== '');
    barcodes.forEach(barcode => addBarcodeToTable(barcode));
    $(this).val('');
}


// --- Barcode processing logic ---
async function processBarcodes() {
    const barcodeInput = $('#barcodecollection');
    const processButton = $('#processBarcodesBtn');
    const clearButton = $('#clearBarcodesBtn');
    const entryInput = $('#newBarcodeEntry');
    const counterElement = $('#rr-counter');

    const rowsToProcess = $('#barcodeListBody tr').filter(function() {
        const status = $(this).find('td.status-cell').text().trim();
        return status !== '✔️';
    });

    if (rowsToProcess.length === 0) return alert('No new or failed barcodes to process.');
    if (barcodeInput.length === 0) return alert('Error: Main barcode input field "#barcodecollection" not found.');

    processButton.prop('disabled', true).text('Processing...');
    clearButton.prop('disabled', true);
    entryInput.prop('disabled', true);

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
    for (const row of rowsToProcess) {
        processedCount++;
        counterElement.text(`Processing: ${processedCount} / ${rowsToProcess.length}`);

        const $row = $(row);
        const barcode = $row.find('td:nth-child(2)').text();
        const statusCell = $row.find('td.status-cell');
        statusCell.removeClass('success').html('...');

        const inputElement = barcodeInput[0];
        inputElement.value = barcode;
        dispatchEvent(inputElement, 'input');
        dispatchEvent(inputElement, 'change');
        await sleep(100);
        inputElement.focus();
        await simulateEnter(inputElement);

        await sleep(600);

        const $errorAlert = $("div.alert.alert-danger:visible");
        if ($errorAlert.length > 0) {
            const errorMessage = $errorAlert.find('strong').text().trim() || 'Unknown Error';
            statusCell.html(`<span class="rr-error-text">${errorMessage}</span>`);
        } else {
            statusCell.addClass('success').html('✔️');
        }

        $('.alert-dismissable .close').click();
        await sleep(INTER_BARCODE_DELAY - 600);
    }

    processButton.prop('disabled', false).text('Process');
    clearButton.prop('disabled', false);
    entryInput.prop('disabled', false).focus();
    counterElement.text('✅ Complete!').css('color', 'green');
}

// --- Logic to handle dynamic page loads ---
let lastUrl = location.href;
setInterval(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        initializeScript();
    }
}, 500);

// Initial run
initializeScript();