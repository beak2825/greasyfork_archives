// ==UserScript==
// @name         Rapid Receiver & Lab Counter Suite (Network Hub Edition)
// @namespace    Violentmonkey Scripts
// @version      8.6
// @description  A network-enabled Lab Suite with a main-page live worklist. Batches are shared via a central Python Hub server.
// @match        https://his.kaauh.org/lab/*
// @author       Hamad AlShegifi
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547485/Rapid%20Receiver%20%20Lab%20Counter%20Suite%20%28Network%20Hub%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547485/Rapid%20Receiver%20%20Lab%20Counter%20Suite%20%28Network%20Hub%20Edition%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_PREFIX = "[LAB SUITE V8.3]";
    const logDebug = msg => console.debug(`${SCRIPT_PREFIX} ${msg}`);
    const logError = msg => console.error(`${SCRIPT_PREFIX} ${msg}`);

    // --- ⬇️ IMPORTANT CONFIGURATION ⬇️ ---
    const HUB_SERVER_URL = 'http://REPLACE_WITH_YOUR_HUB_PC_IP:8080';
    // --- ⬆️ IMPORTANT CONFIGURATION ⬆️ ---


    // --- Global state ---
    const collectedData = new Map();
    const processedBarcodes = new Set();
    let autoCollectorInterval = null;
    const liveBatches = new Map();
    let liveBatchPoller = null;

    // --- Injected CSS ---
    GM_addStyle(`
        /* ... All previous styles are unchanged ... */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .counter-icon { display: inline-block; width: 12px; height: 12px; border: 1.5px solid currentColor; border-top: none; border-radius: 0 0 4px 4px; position: relative; vertical-align: -2px; }
        .counter-icon::before { content: ''; position: absolute; top: -2px; left: -2px; width: 14px; height: 2.5px; background-color: currentColor; border-radius: 1px; }
        .main-counter-style { display: inline-flex; align-items: center; gap: 10px; animation: fadeIn 0.3s ease-out; box-shadow: 0 3px 6px rgba(0, 83, 153, 0.15), 0 2px 4px rgba(0, 114, 211, 0.1); border-radius: 18px; background: linear-gradient(145deg, #0072d3, #0088f8); color: #ffffff; font-size: 17px; font-weight: 600; padding: 6px 8px 6px 14px; border: 1px solid rgba(255, 255, 255, 0.2); text-shadow: 0 1px 1px rgba(0,0,0,0.1); }
        .rr-modal-backdrop { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5); }
        .rr-modal-content { background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 500px; border-radius: 5px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); }
        .rr-modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .rr-modal-header h2 { margin: 0; font-size: 1.25rem; }
        .rr-modal-body { padding: 15px 0; }
        .rr-modal-footer { display: flex; justify-content: flex-end; align-items: center; gap: 15px; border-top: 1px solid #ddd; padding-top: 10px; }
        #barcodeList { width: 100%; padding: 8px; font-size: 16px; box-sizing: border-box; }
        .rr-close-button { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
        .rr-close-button:hover, .rr-close-button:focus { color: black; text-decoration: none; }
        .batch-rerun-container { margin-top: 15px; padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; }
        #batchRerunInput { width: 100%; padding: 6px 12px; font-size: 14px; line-height: 1.42857143; color: #555; background-color: #fff; border: 1px solid #ccc; border-radius: 4px; }
        .auto-collector-counter { display: inline-flex; align-items: center; gap: 6px; margin-right: 5px; font-weight: 600; color: #6c757d; background-color: #f8f9fa; padding: 6px 12px; border-radius: 6px; border: 1px solid #dee2e6; }
        .auto-collector-counter.has-items { color: #004085; background-color: #cce5ff; border-color: #b8daff; }

        /* --- Styles for Live Worklist (in modal) --- */
        #liveWorklistContainer { border-top: 2px solid #007bff; margin-top: 15px; padding-top: 10px; }
        #liveWorklistContent { max-height: 250px; overflow-y: auto; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; }
        .worklist-batch { margin-bottom: 15px; }
        .worklist-batch h5 { font-size: 1rem; font-weight: 700; color: #0056b3; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid #e9ecef; }
        .worklist-batch ul { list-style-type: none; padding-left: 5px; margin: 0; }
        .worklist-batch li { padding: 4px; font-family: monospace; font-size: 14px; border-radius: 3px; transition: background-color 0.3s; }
        .worklist-batch li.checked { background-color: #d4edda; color: #155724; text-decoration: line-through; }

        /* --- Styles for Main Page Live Batch Viewer --- */
        .live-batch-menu-item a { cursor: pointer; display: block; text-decoration: none; color: inherit; }
        .live-batch-menu-item .icon-holder { font-size: 20px; }
        #mainLiveWorklistPanel {
            display: none; position: fixed; z-index: 10000; top: 50%; left: 50%;
            transform: translate(-50%, -50%); width: 90%; max-width: 400px;
            background-color: #fff; border: 1px solid #ccc; border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: fadeIn 0.3s ease-out;
        }
        .worklist-panel-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px 15px; background-color: #f7f7f7; border-bottom: 1px solid #ddd;
            border-radius: 8px 8px 0 0; cursor: move;
        }
        .worklist-panel-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .worklist-panel-body { padding: 15px; max-height: 60vh; overflow-y: auto; }
        .worklist-panel-close {
            font-size: 24px; font-weight: bold; color: #888; cursor: pointer;
            border: none; background: none; padding: 0 5px;
        }
        .worklist-panel-close:hover { color: #000; }
    `);

    // --- Core UI & Helper Functions (RESTORED) ---
    function getColorForString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }

    function relocateAllDangerAlerts() {
        const alerts = document.querySelectorAll('.modal-body .alert-danger');
        alerts.forEach(alert => {
            const modalBody = alert.closest('.modal-body');
            if (modalBody) modalBody.prepend(alert);
        });
    }

    function createCounterElement(id) {
        return $(`<div id="${id}" class="main-counter-style" style="margin-right: auto;"><span class="counter-icon"></span><span>Total Samples: <span class="section-count-badge">0</span></span></div>`);
    }

    function updateSpecificCounter(modalElementForInputs, counterElement, inputSelector) {
        const inputs = modalElementForInputs.querySelectorAll(inputSelector);
        const sectionCounts = new Map();
        let totalCount = 0;
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                totalCount++;
                const parentRow = input.closest('tr');
                if (parentRow) {
                    const sectionInput = parentRow.querySelector('input[formcontrolname="TestSection"]');
                    const section = sectionInput ? sectionInput.value.trim() : 'Unknown';
                    sectionCounts.set(section, (sectionCounts.get(section) || 0) + 1);
                }
            }
        });
        counterElement.find('.section-count-badge').first().text(totalCount);
        const existingTags = counterElement.find('.sample-section-tag');
        const displayedSections = new Set();
        existingTags.each(function() {
            const sectionName = $(this).data('section');
            if (sectionCounts.has(sectionName)) {
                $(this).find('.section-count-badge').text(sectionCounts.get(sectionName));
                displayedSections.add(sectionName);
            } else {
                $(this).remove();
            }
        });
        for (const [section, count] of sectionCounts.entries()) {
            if (!displayedSections.has(section)) {
                const color = getColorForString(section);
                counterElement.append(`<div class="sample-section-tag" data-section="${section}"><span class="color-dot" style="background-color: ${color};"></span>${section}: <span class="section-count-badge">${count}</span></div>`);
            }
        }
    }

    function setupModalCounter(modalConfig) {
        const { modalKeyElement, targetFooter, inputSelector, counterId, activeIntervalsMap } = modalConfig;
        if (!targetFooter || modalKeyElement.dataset.counterInitialized) return;
        logDebug(`Setting up counter #${counterId} in modal.`);
        modalKeyElement.dataset.counterInitialized = 'true';
        const counterElement = createCounterElement(counterId);
        $(targetFooter).prepend(counterElement);
        const intervalId = setInterval(() => {
            if (!document.body.contains(modalKeyElement)) {
                clearInterval(intervalId);
                activeIntervalsMap.delete(counterId);
                return;
            }
            updateSpecificCounter(modalKeyElement, counterElement, inputSelector);
        }, 500);
        activeIntervalsMap.set(counterId, intervalId);
    }

    /**
     * Generates a short batch code and saves it to the Hub server.
     * @param {string[]} barcodesArray An array of barcode strings.
     * @param {string} shortPrefix The 2-character prefix for the workbench.
     * @returns {Promise<string|null>}
     */
    function generateAndSaveBatch(barcodesArray, shortPrefix) {
        return new Promise((resolve) => {
            if (HUB_SERVER_URL.includes('REPLACE')) {
                alert("❌ CONFIGURATION ERROR:\nYou must set the HUB_SERVER_URL at the top of the user script.");
                return resolve(null);
            }
            if (!barcodesArray || barcodesArray.length === 0) return resolve(null);

            const shortTimestamp = Math.floor(Date.now() / 1000).toString().slice(-6);
            const shortCode = `${shortPrefix}-${shortTimestamp}-${barcodesArray.length}`;

            GM_xmlhttpRequest({
                method: "POST",
                url: `${HUB_SERVER_URL}/saveBatch`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ code: shortCode, barcodes: barcodesArray.join('\n') }),
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        logDebug(`✅ Saved batch to Hub server: ${shortCode}`);
                        resolve(shortCode);
                    } else {
                        logError(`Failed to save batch. Status: ${response.status}`);
                        alert(`❌ Failed to save batch. Is the Hub server running at ${HUB_SERVER_URL}?`);
                        resolve(null);
                    }
                },
                onerror: (response) => {
                    logError(`Network error saving batch: ${response.statusText}`);
                    alert(`❌ Could not connect to the Hub server.`);
                    resolve(null);
                }
            });
        });
    }


    // --- Live Worklist Functions ---

    /**
     * Renders the fetched live batches into a specified UI container.
     * @param {string} targetSelector The jQuery selector for the container to render into.
     */
    function renderLiveWorklist(targetSelector) {
        const container = $(targetSelector);
        if (container.length === 0) return;

        container.empty();

        if (liveBatches.size === 0) {
            container.html("<i>No recent batches found. Generate a batch to see it here.</i>");
            return;
        }

        const sortedBatches = new Map([...liveBatches.entries()].sort((a, b) => b[0].localeCompare(a[0])));

        for (const [batchCode, data] of sortedBatches.entries()) {
            const { barcodes, checked } = data;
            const isComplete = checked.size === barcodes.size && barcodes.size > 0;
            const batchDiv = $('<div class="worklist-batch"></div>');
            const title = $(`<h5>${batchCode} (${checked.size} / ${barcodes.size})</h5>`);
            if (isComplete) title.css('color', '#28a745');
            batchDiv.append(title);

            const ul = $('<ul></ul>');
            const sortedBarcodes = Array.from(barcodes).sort();

            sortedBarcodes.forEach(barcode => {
                const li = $(`<li data-barcode="${barcode}"></li>`);
                if (checked.has(barcode)) {
                    li.addClass('checked').html(`✔️ ${barcode}`);
                } else {
                    li.text(barcode);
                }
                ul.append(li);
            });

            batchDiv.append(ul);
            container.append(batchDiv);
        }
    }

    /**
     * Checks a scanned barcode against the live worklists.
     * @param {Event} event The keydown event from the input field.
     */
    function handleWorklistMatching(event) {
        if (event.key !== 'Enter') return;
        const barcode = event.target.value.trim();
        if (!barcode) return;

        if (Array.from(liveBatches.values()).some(data => {
            if (data.barcodes.has(barcode)) {
                data.checked.add(barcode);
                return true;
            }
            return false;
        })) {
            logDebug(`Matched barcode "${barcode}" to a live worklist.`);
            renderLiveWorklist('#liveWorklistContent');
            renderLiveWorklist('#mainLiveWorklistPanel .worklist-panel-body');
        }
    }


    /**
     * Starts polling the Hub server for recent batches.
     */
    function startLiveBatchPolling() {
        if (liveBatchPoller) return;
        logDebug("Starting live batch polling...");

        const poll = () => {
             if (HUB_SERVER_URL.includes('REPLACE')) {
                 logError("Polling skipped: HUB_SERVER_URL is not configured.");
                 return;
             }

            GM_xmlhttpRequest({
                method: "GET",
                url: `${HUB_SERVER_URL}/getRecentBatches`,
                onload: function(response) {
                    if (response.status === 200) {
                        const fetchedBatches = JSON.parse(response.responseText);
                        logDebug(`Successfully polled server. Received ${Object.keys(fetchedBatches).length} batches.`);
                        let updated = false;
                        const fetchedKeys = new Set(Object.keys(fetchedBatches));
                        const localKeys = new Set(liveBatches.keys());

                        if (fetchedKeys.size !== localKeys.size || ![...fetchedKeys].every(k => localKeys.has(k))) {
                            updated = true;
                        }

                        for (const batchCode in fetchedBatches) {
                            const serverBatch = fetchedBatches[batchCode];
                            const serverBarcodes = new Set(serverBatch.barcodes.split('\n').filter(b => b));
                            if (!liveBatches.has(batchCode)) {
                                liveBatches.set(batchCode, { barcodes: serverBarcodes, checked: new Set() });
                                updated = true;
                            } else {
                                if (liveBatches.get(batchCode).barcodes.size !== serverBarcodes.size) {
                                    liveBatches.get(batchCode).barcodes = serverBarcodes;
                                    updated = true;
                                }
                            }
                        }

                        for (const localKey of localKeys) {
                            if (!fetchedKeys.has(localKey)) {
                                liveBatches.delete(localKey);
                                updated = true;
                            }
                        }

                        if(updated) {
                           logDebug(`Live worklist updated. Total batches: ${liveBatches.size}`);
                           renderLiveWorklist('#liveWorklistContent');
                           renderLiveWorklist('#mainLiveWorklistPanel .worklist-panel-body');
                        }
                    } else {
                        logError(`Polling failed. Server responded with status: ${response.status}`);
                    }
                },
                onerror: (response) => logError(`Polling network error. Could not connect to Hub server. Details: ${response.statusText}`)
            });
        };

        poll();
        liveBatchPoller = setInterval(poll, 60000); // Poll every 60 seconds
    }


    // --- Main Setup Functions ---

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
        const originalBarcodes = barcodesText.split(/\r?\n/).filter(line => line.trim() !== '');
        const rerunCode = await generateAndSaveBatch(originalBarcodes, "RR");
        if (rerunCode) {
            prompt("Batch processed! Copy this code to re-run this list later:", rerunCode);
        }
    }

    function setupRapidReceiver() {
        const closeButtonSelector = "#closebtn-smplrecieve, #btnclose-smplcollection";
        const closeButton = document.querySelector(closeButtonSelector);
        if (!closeButton || closeButton.parentElement.querySelector('#rapidReceiveBtn')) return;
        let rapidReceiveBtn = $('<button type="button" class="btn btn-color-1" id="rapidReceiveBtn">Rapid Receiver</button>').css('margin-right', '5px');
        $(closeButton).before(rapidReceiveBtn);
        if ($('#rapidReceiveModal').length === 0) {
            logDebug("Creating Rapid Receiver modal.");
            $('body').append(`
                <div id="rapidReceiveModal" class="rr-modal-backdrop">
                    <div class="rr-modal-content">
                        <div class="rr-modal-header"><h2>Scan or Paste Barcodes</h2><span class="rr-close-button">&times;</span></div>
                        <div class="rr-modal-body"><p>Enter each barcode on a new line. To re-run a previous batch, use the 'Batch Re-run' field on the main page.</p><textarea id="barcodeList" rows="10"></textarea></div>
                        <div class="rr-modal-footer"><span id="rr-counter" class="rr-counter-style">0 Barcodes Entered</span><button id="processBarcodesBtn" class="btn btn-success">Process</button></div>
                    </div>
                </div>`);
            $('.rr-close-button').on('click', () => $('#rapidReceiveModal').hide());
            $(window).on('click', (event) => { if ($(event.target).is('#rapidReceiveModal')) $('#rapidReceiveModal').hide(); });
            $('#processBarcodesBtn').on('click', processBarcodes);
            $('body').on('input', '#barcodeList', function() {
                const count = $(this).val().trim() ? $(this).val().trim().split(/\r?\n/).filter(line => line.trim() !== '').length : 0;
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

    function createBatchInputField() {
        const mainInputContainer = $('#barcodecollection').closest('.form-group');
        if (mainInputContainer.length === 0 || $('#batchRerunInput').length > 0) return;
        logDebug("Creating dedicated batch re-run input field.");
        mainInputContainer.after(`
            <div class="form-group batch-rerun-container">
                <label for="batchRerunInput">Batch Re-run Code</label>
                <input type="text" id="batchRerunInput" class="form-control" placeholder="Enter Batch Code (e.g., CH-123456-1) and Press Enter">
            </div>`);
    }

    function createBatchUI() {
        const closeButton = $("#closebtn-smplrecieve, #btnclose-smplcollection");
        if (closeButton.length === 0 || $('#generateBatchBtn').length > 0) return;
        logDebug("Creating 'Generate Batch' UI elements.");
        const batchBtn = $('<button type="button" class="btn btn-info" id="generateBatchBtn">Generate Batch</button>').css('margin-right', '5px');
        const batchCounter = $(`<span id="collectedCounter" class="auto-collector-counter"><span class="counter-icon"></span> 0 Collected</span>`);
        closeButton.before(batchBtn);
        batchBtn.before(batchCounter);
        batchBtn.on('click', async () => {
            if (collectedData.size === 0) return alert("No barcodes have been collected to generate a batch.");
            const batchResults = [];
            for (const [workbench, barcodeSet] of collectedData.entries()) {
                const barcodesArray = Array.from(barcodeSet);
                const shortPrefix = workbench.replace(/[^a-zA-Z0-9]/g, '').substring(0, 2).toUpperCase();
                const code = await generateAndSaveBatch(barcodesArray, shortPrefix);
                if (code) batchResults.push({ workbench, code });
            }
            if (batchResults.length > 0) {
                let promptMessage = "Batches generated! Copy your codes:\n\n";
                batchResults.forEach(result => { promptMessage += `${result.workbench}: ${result.code}\n`; });
                prompt(promptMessage);
            } else {
                alert("Could not save any re-run codes. Please check the Hub server connection.");
            }
            collectedData.clear();
            processedBarcodes.clear();
            $('#collectedCounter').html('<span class="counter-icon"></span> 0 Collected').removeClass('has-items');
        });
    }

    function setupRerunListener() {
        const shortCodeRegex = /^[A-Z]{2}-\d{6}-\d+$/i;
        $(document).on('keydown', '#batchRerunInput', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const potentialCode = $(this).val().trim();
                if (!shortCodeRegex.test(potentialCode)) return alert(`"${potentialCode}" is not a valid batch code format.`);
                logDebug(`Attempting to retrieve code from Hub server: ${potentialCode}`);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${HUB_SERVER_URL}/getBatch/${potentialCode}`,
                    onload: (response) => {
                        if (response.status === 200) {
                            logDebug("✅ Found matching barcode list on Hub server.");
                            const data = JSON.parse(response.responseText);
                            $('#rapidReceiveBtn').trigger('click');
                            $('#barcodeList').val(data.barcodes);
                            $('#barcodeList').trigger('input');
                            $(this).val('');
                        } else {
                            logError(`Re-run code "${potentialCode}" not found on server.`);
                            alert('Re-run code not found.');
                        }
                    },
                    onerror: () => {
                        logError(`Network error while trying to retrieve batch.`);
                        alert(`❌ Could not connect to the Hub server to retrieve the batch.`);
                    }
                });
            }
        });
    }

    function startAutoCollectorPolling() {
        if (autoCollectorInterval) return;
        logDebug("Starting auto-collector polling for table data.");
        autoCollectorInterval = setInterval(() => {
            const tableRows = document.querySelectorAll('.tubes-types-ro tbody tr');
            if (tableRows.length === 0) return;
            let updated = false;
            tableRows.forEach(row => {
                const barcodeInput = row.querySelector('input[formcontrolname="Barcode"]');
                const workbenchInput = row.querySelector('input[formcontrolname="TestSection"]');
                if (barcodeInput && workbenchInput) {
                    const barcodeValue = barcodeInput.value;
                    if (barcodeValue && !processedBarcodes.has(barcodeValue)) {
                        const workbenchValue = workbenchInput.value || 'UNKNOWN';
                        processedBarcodes.add(barcodeValue);
                        if (!collectedData.has(workbenchValue)) collectedData.set(workbenchValue, new Set());
                        collectedData.get(workbenchValue).add(barcodeValue);
                        updated = true;
                    }
                }
            });
            if (updated) {
                let totalCount = 0;
                for (const barcodeSet of collectedData.values()) totalCount += barcodeSet.size;
                logDebug(`Data collected. Total unique barcodes: ${totalCount}`);
                $('#collectedCounter').html(`<span class="counter-icon"></span> ${totalCount} Collected`).addClass('has-items');
            }
        }, 500);
    }

    function setupMainMenuFeatures() {
        if ($('#mainLiveWorklistPanel').length === 0) {
            $('body').append(`
                <div id="mainLiveWorklistPanel">
                    <div class="worklist-panel-header"><h3>Live Worklist</h3><button class="worklist-panel-close">&times;</button></div>
                    <div class="worklist-panel-body"><i>Connecting...</i></div>
                </div>`);
            $('.worklist-panel-close').on('click', () => $('#mainLiveWorklistPanel').hide());
            let isDragging = false, offset = { x: 0, y: 0 };
            const panel = $('#mainLiveWorklistPanel'), header = panel.find('.worklist-panel-header');
            header.on('mousedown', function(e) {
                isDragging = true;
                const panelOffset = panel.offset();
                offset.x = e.clientX - panelOffset.left;
                offset.y = e.clientY - panelOffset.top;
                header.css('cursor', 'grabbing');
            });
            $(document).on('mousemove', function(e) {
                if (!isDragging) return;
                panel.css({ top: e.clientY - offset.y, left: e.clientX - offset.x, transform: 'none' });
            }).on('mouseup', () => {
                isDragging = false;
                header.css('cursor', 'move');
            });
        }
        const docMenuItem = $('span.csi-menu-text[title="Documents"]').closest('csi-main-menu').parent();
        if (docMenuItem.length > 0 && docMenuItem.parent().find('.live-batch-menu-item').length === 0) {
            logDebug("Injecting 'Live Batches' menu item.");
            const menuItem = $(`
                <div class="live-batch-menu-item">
                    <csi-main-menu><a>
                        <span class="icon-holder csi-menu-icon"><i class="nova-icon-lab-flask-2"></i></span>
                        <div class="csi-menu-text-wrapper"><span class="csi-menu-text sidemenu-title" title="Live Batches">Live Worklist</span></div>
                    </a></csi-main-menu>
                </div>`);
            docMenuItem.after(menuItem);
            menuItem.on('click', () => {
                const panel = $('#mainLiveWorklistPanel');
                panel.is(':visible') ? panel.hide() : (renderLiveWorklist('#mainLiveWorklistPanel .worklist-panel-body'), panel.show());
            });
        } else if (docMenuItem.length === 0) {
            logError("Could not find the 'Documents' menu item to inject the Live Batches button.");
        }
    }


    function setupDOMObserver() {
        logDebug("DOM observer started.");
        const observer = new MutationObserver(() => {
            setupMainMenuFeatures();
            const modalSelector = '.modal-body app-sample-receive, .modal-body app-sample-collection';
            const targetModal = document.querySelector(modalSelector);
            if (targetModal && !targetModal.dataset.suiteInitialized) {
                logDebug("Detected a sample modal. Initializing suite features...");
                targetModal.dataset.suiteInitialized = 'true';
                $(targetModal).append(`
                    <div id="liveWorklistContainer">
                        <h4>Live Worklist</h4>
                        <div id="liveWorklistContent">Connecting to Hub server...</div>
                    </div>`);
                const barcodeInput = targetModal.querySelector('input[formcontrolname="Barcode"], #barcodecollection');
                if (barcodeInput) {
                    barcodeInput.addEventListener('keydown', handleWorklistMatching);
                    logDebug("Attached live worklist matcher to barcode input.");
                }
                renderLiveWorklist('#liveWorklistContent');
            }
            setupRapidReceiver();
            createBatchUI();
            if (document.querySelector('.tubes-types-ro')) startAutoCollectorPolling();
            if (document.querySelector('#barcodecollection')) createBatchInputField();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Script Initialization ---
    window.addEventListener('load', () => {
        logDebug("Initializing Lab Suite...");
        setupDOMObserver();
        setupRerunListener();
        startLiveBatchPolling();
    });

})();
