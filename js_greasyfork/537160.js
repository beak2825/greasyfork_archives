// ==UserScript==
// @name         Monté
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scans Dreadcast meuble IDs, logs finds, and updates placeholder with highest found ID.
// @author       YourName
// @match        https://www.dreadcast.net/Main
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/537160/Mont%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/537160/Mont%C3%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let accretionCounter = 0;
    let isScanning = false;
    let stopScanRequested = false;
    let foundFarineIds = [];
    let highestFoundFarineId = null; // Variable to keep track of the highest ID with farine

    const HIGHEST_FARINE_ID_GM_KEY = 'dcScanner_highestFarineId'; // Key for GM_setValue/getValue

    // --- UI Creation (Main Panel) ---
    const panel = document.createElement('div');
    panel.id = 'dcScannerPanel';
    panel.innerHTML = `
        <h3 class="dc-drag-handle">Meuble Scanner</h3>
        <div>
            <label for="startIdInput">Given ID:</label>
            <input type="text" id="startIdInput" placeholder="Loading..." size="10"> <!-- Placeholder updated later -->
        </div>
        <button id="scanButton">Start Scan</button>
        <button id="showFoundIdsButton" style="margin-top: 5px;">Show Found IDs (0)</button>
        <p>Accrétion farine found: <span id="accretionCount">0</span></p>
        <p id="scanStatus" style="min-height: 20px;"></p>
    `;
    document.body.appendChild(panel);
    panel.style.display = 'none'

    // --- UI Creation (Found IDs Panel) ---
    const foundIdsPanel = document.createElement('div');
    foundIdsPanel.id = 'dcFoundIdsPanel';
    // ... (HTML for foundIdsPanel remains the same)
    foundIdsPanel.innerHTML = `
        <h4 class="dc-drag-handle-found">Found "Accrétion farine" IDs</h4>
        <div id="foundIdsList" style="max-height: 300px; overflow-y: auto; margin-bottom:10px;">
            No IDs found yet.
        </div>
        <button id="closeFoundIdsButton">Close</button>
    `;
    document.body.appendChild(foundIdsPanel);
    foundIdsPanel.style.display = 'none';


    // --- UI Elements ---
    const startIdInput = document.getElementById('startIdInput');
    // ... (other UI elements remain the same)
    const scanButton = document.getElementById('scanButton');
    const showFoundIdsButton = document.getElementById('showFoundIdsButton');
    const accretionCountDisplay = document.getElementById('accretionCount');
    const scanStatusDisplay = document.getElementById('scanStatus');
    const mainPanelDragHandle = panel.querySelector('.dc-drag-handle');
    const foundIdsListDiv = document.getElementById('foundIdsList');
    const closeFoundIdsButton = document.getElementById('closeFoundIdsButton');
    const foundIdsPanelDragHandle = foundIdsPanel.querySelector('.dc-drag-handle-found');


    // --- Styling (Identical to previous, so omitted for brevity in this explanation) ---
    GM_addStyle(`
        /* Main Panel Styles */
        #dcScannerPanel {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 100001;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            font-family: sans-serif;
            width: 250px;
        }
        #dcScannerPanel h3.dc-drag-handle {
            margin-top: 0;
            margin-bottom: 10px;
            padding: 5px;
            background-color: #e0e0e0;
            border-bottom: 1px solid #ccc;
            cursor: move;
            user-select: none;
        }
        #dcScannerPanel div { margin-bottom: 10px; }
        #dcScannerPanel input[type="text"] { padding: 5px; border: 1px solid #ccc; border-radius: 3px; width: calc(100% - 12px); }
        #dcScannerPanel label { display: block; margin-bottom: 3px; }
        #dcScannerPanel button {
            padding: 8px 12px;
            background-color: #4CAF50; color: white;
            border: none; border-radius: 3px; cursor: pointer; width: 100%;
        }
        #dcScannerPanel button#showFoundIdsButton { background-color: #007bff; }
        #dcScannerPanel button#showFoundIdsButton:hover { background-color: #0056b3; }
        #dcScannerPanel button.scanning { background-color: #f44336; }
        #dcScannerPanel button.scanning:hover { background-color: #d32f2f; }
        #dcScannerPanel button:not(.scanning):not(#showFoundIdsButton):hover { background-color: #45a049; }
        #dcScannerPanel button:disabled { background-color: #cccccc; cursor: not-allowed; }
        #dcScannerPanel p { margin-bottom: 5px; }

        /* Found IDs Panel Styles */
        #dcFoundIdsPanel {
            position: fixed;
            top: 50px;
            left: 50px;
            z-index: 100002;
            background-color: #222;
            color: #fff;
            border: 1px solid #555;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            font-family: sans-serif;
            width: 300px;
        }
        #dcFoundIdsPanel h4.dc-drag-handle-found {
            margin-top: 0;
            margin-bottom: 10px;
            padding: 5px;
            background-color: #333;
            border-bottom: 1px solid #555;
            cursor: move;
            user-select: none;
        }
        #dcFoundIdsPanel #foundIdsList {
            background-color: #111;
            padding: 10px;
            border-radius: 3px;
            margin-bottom: 10px;
            white-space: pre-wrap;
            word-break: break-all;
            max-height: 300px; overflow-y: auto;
        }
        #dcFoundIdsPanel button {
            padding: 8px 12px;
            background-color: #007bff; color: white;
            border: none; border-radius: 3px; cursor: pointer;
            width: 100%;
        }
        #dcFoundIdsPanel button:hover { background-color: #0056b3; }
    `);

    // --- Draggable Panel Logic ---
    function makeDraggable(panelElement, handleElement) {
        // ... (makeDraggable function remains the same)
        let isDragging = false; let offsetX, offsetY;
        if (handleElement) {
            handleElement.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; isDragging = true;
                const panelRect = panelElement.getBoundingClientRect();
                offsetX = e.clientX - panelRect.left; offsetY = e.clientY - panelRect.top;
                handleElement.style.cursor = 'grabbing'; panelElement.style.userSelect = 'none';
                document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
                e.preventDefault();
            });
        }
        function onMouseMove(e) {
            if (!isDragging) return; let newLeft = e.clientX - offsetX; let newTop = e.clientY - offsetY;
            const panelRect = panelElement.getBoundingClientRect();
            const maxLeft = window.innerWidth - panelRect.width; const maxTop = window.innerHeight - panelRect.height;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft)); newTop = Math.max(0, Math.min(newTop, maxTop));
            panelElement.style.left = newLeft + 'px'; panelElement.style.top = newTop + 'px';
            panelElement.style.right = 'auto'; panelElement.style.bottom = 'auto';
        }
        function onMouseUp(e) {
            if (e.button !== 0 && isDragging) return;
            if (isDragging) {
                isDragging = false; if (handleElement) handleElement.style.cursor = 'move';
                panelElement.style.userSelect = '';
                document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp);
            }
        }
    }
    makeDraggable(panel, mainPanelDragHandle);
    makeDraggable(foundIdsPanel, foundIdsPanelDragHandle);


    // --- Toggle Visibility with Alt+Y ---
    document.addEventListener('keydown', (e) => {
        // ... (toggle logic remains the same)
        if (e.altKey && (e.key === 'y' || e.key === 'Y')) {
            e.preventDefault();
            panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
        }
    });

    // --- Found IDs Panel Logic ---
    // ... (found IDs panel logic remains the same)
    showFoundIdsButton.addEventListener('click', () => {
        foundIdsPanel.style.display = 'block'; updateFoundIdsDisplay();
    });
    closeFoundIdsButton.addEventListener('click', () => {
        foundIdsPanel.style.display = 'none';
    });
    function updateFoundIdsDisplay() {
        showFoundIdsButton.textContent = `Show Found IDs (${foundFarineIds.length})`;
        if (foundFarineIds.length > 0) {
            foundIdsListDiv.textContent = foundFarineIds.map(id => `ID: ${id}`).join('\n');
        } else {
            foundIdsListDiv.textContent = 'No "Accrétion farine" IDs found in the last scan.';
        }
    }

    // --- Utility Functions ---
    // ... (utility functions remain the same)
    function getRandomInt(min, max) {
        min = Math.ceil(min); max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function updateCounterDisplay() { accretionCountDisplay.textContent = accretionCounter; }
    function updateStatus(message) { scanStatusDisplay.textContent = message; }

    // --- Placeholder Update Function ---
    function updateStartIdPlaceholder() {
        if (highestFoundFarineId !== null) {
            startIdInput.placeholder = `${highestFoundFarineId}`;
        } else {
            startIdInput.placeholder = "e.g., 1463557";
        }
    }

    // --- Initialize: Load highest ID and set placeholder ---
    (async function init() {
        highestFoundFarineId = await GM_getValue(HIGHEST_FARINE_ID_GM_KEY, null);
        updateStartIdPlaceholder();
    })();


    // --- Core Scanner Functions ---
    function sendRequest(idToScan, callback) {
        const url = "https://www.dreadcast.net/Building/Update/Information";
        const payload = `type=meuble&id=meuble_${idToScan}`;
        GM_xmlhttpRequest({
            method: "POST", url: url, data: payload,
            headers: { /* ... headers ... */
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": window.location.href,
                "Accept": "*/*"
            },
            onload: async function(response) { // Made async to use await for GM_setValue
                if (response.status >= 200 && response.status < 300) {
                    if (response.responseText && response.responseText.includes("Accrétion farine")) {
                        accretionCounter++;
                        if (!foundFarineIds.includes(idToScan)) { foundFarineIds.push(idToScan); }
                        updateCounterDisplay(); updateFoundIdsDisplay();

                        // Update highest found ID and persist it
                        if (highestFoundFarineId === null || idToScan > highestFoundFarineId) {
                            highestFoundFarineId = idToScan;
                            await GM_setValue(HIGHEST_FARINE_ID_GM_KEY, highestFoundFarineId);
                            // Update placeholder only if input is not focused (to avoid disrupting typing)
                            if (document.activeElement !== startIdInput) {
                                updateStartIdPlaceholder();
                            }
                        }
                    }
                    callback(null);
                } else {
                    callback(new Error(`HTTP ${response.status}: ${response.statusText || 'Error'}`));
                }
            },
            onerror: function(response) { callback(new Error(`Network error: ${response.statusText || 'Unknown'}`)); },
            ontimeout: function() { callback(new Error("Request Timeout")); }
        });
    }

    async function executeActualScan() {
        const rawStartIdValue = startIdInput.value.trim();
        if (!rawStartIdValue || isNaN(rawStartIdValue)) {
            // If input is empty AND we have a highestFarineId, consider using it as the default start
            if (rawStartIdValue === "" && highestFoundFarineId !== null) {
                startIdInput.value = highestFoundFarineId; // Pre-fill if empty
                // Give a brief moment for the user to see, or proceed if they quickly click start
                updateStatus(`Using last highest found ID: ${highestFoundFarineId}. Click Start again if ready.`);
                // To make it less abrupt, we might not auto-start here, but let them confirm.
                // For now, let's just allow it to proceed if they click start after this.
                // Or, we could just error out if empty as before:
                // updateStatus("Please enter a valid 'Given ID'.");
                // isScanning = false; scanButton.textContent = "Start Scan";
                // scanButton.classList.remove('scanning'); scanButton.disabled = false; startIdInput.disabled = false;
                // return;
            } else if (rawStartIdValue !== "" && isNaN(rawStartIdValue)) { // Only error if non-empty and NaN
                 updateStatus("Please enter a valid 'Given ID'.");
                 isScanning = false; scanButton.textContent = "Start Scan";
                 scanButton.classList.remove('scanning'); scanButton.disabled = false; startIdInput.disabled = false;
                 return;
            }
            // If it was empty and no highestFarineId, or they cleared it, it will become NaN after parseInt
        }

        // Use placeholder if input is empty, otherwise use input value
        const givenIdString = startIdInput.value.trim() === "" && highestFoundFarineId !== null ?
                              String(highestFoundFarineId) :
                              startIdInput.value.trim();

        if (isNaN(givenIdString) || givenIdString === "") {
            updateStatus("No valid ID to start scan. Enter an ID or ensure a previous scan found one.");
            isScanning = false; scanButton.textContent = "Start Scan";
            scanButton.classList.remove('scanning'); scanButton.disabled = false; startIdInput.disabled = false;
            return;
        }


        const givenId = parseInt(givenIdString);
        const actualStartIdForRange = givenId - 50;

        // ... (rest of executeActualScan parameters and logic, unchanged from v0.9)
        const requestsThisSession = getRandomInt(200, 400);
        const totalNormalPausesThisSession = getRandomInt(10, 20);
        const REGULAR_DELAY_MIN_MS = 1000; const REGULAR_DELAY_MAX_MS = 6000
        const NORMAL_PAUSE_MIN_MS = 5000; const NORMAL_PAUSE_MAX_MS = 15000;
        const MIN_REQUESTS_BETWEEN_NORMAL_PAUSES = 10;
        const BASE_NORMAL_PAUSE_PROBABILITY = 0.3;
        const PROBABILITY_INCREASE_PER_REQUEST = 0.15;

        const idsToScan = [];
        for (let i = 0; i < requestsThisSession; i++) {
            idsToScan.push(actualStartIdForRange + i);
        }
        for (let i = idsToScan.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [idsToScan[i], idsToScan[j]] = [idsToScan[j], idsToScan[i]];
        }

        let normalPausesMade = 0; let requestsSinceLastNormalPause = 0;
        let currentNormalPauseProbability = BASE_NORMAL_PAUSE_PROBABILITY;

        accretionCounter = 0; foundFarineIds = [];
        updateCounterDisplay(); updateFoundIdsDisplay(); // Reset session specific lists

        scanButton.textContent = `Stop Scan (${requestsThisSession} IDs)`;
        const conceptualEndId = actualStartIdForRange + requestsThisSession - 1;
        updateStatus(`Starting randomized scan for ${requestsThisSession} IDs (approx. range ${actualStartIdForRange} to ${conceptualEndId})...`);
        const startTime = Date.now();
        let requestsMade = 0; let scanErrorOccurred = false;

        for (let i = 0; i < idsToScan.length; i++) {
            if (stopScanRequested) {
                updateStatus(`Scan interrupted by user. Checked ${requestsMade} IDs.`); break;
            }

            const currentId = idsToScan[i];
            updateStatus(`Scanning meuble_${currentId} (request ${i + 1}/${requestsThisSession})...`);

            try {
                await new Promise((resolve, reject) => {
                    sendRequest(currentId, (error) => {
                        if (error) reject(error); else resolve();
                    });
                });
                requestsMade++; requestsSinceLastNormalPause++;
            } catch (err) {
                scanErrorOccurred = true;
                updateStatus(`Error on ID ${currentId}: ${err.message}. Halting scan.`);
                console.error(`Scan error for ID ${currentId}:`, err); break;
            }

            if (stopScanRequested || scanErrorOccurred) break;

            if (normalPausesMade < totalNormalPausesThisSession && requestsSinceLastNormalPause > MIN_REQUESTS_BETWEEN_NORMAL_PAUSES) {
                if (Math.random() < currentNormalPauseProbability) {
                    const normalPauseDuration = getRandomInt(NORMAL_PAUSE_MIN_MS, NORMAL_PAUSE_MAX_MS);
                    updateStatus(`Taking a normal pause (${(normalPauseDuration / 1000).toFixed(1)}s)... (${normalPausesMade + 1}/${totalNormalPausesThisSession})`);
                    await new Promise(resolve => setTimeout(resolve, normalPauseDuration));
                    normalPausesMade++; requestsSinceLastNormalPause = 0;
                    currentNormalPauseProbability = BASE_NORMAL_PAUSE_PROBABILITY;
                    if (stopScanRequested) {
                        updateStatus(`Scan interrupted by user during pause. Checked ${requestsMade} IDs.`); break;
                    }
                } else {
                    currentNormalPauseProbability = Math.min(1, currentNormalPauseProbability + PROBABILITY_INCREASE_PER_REQUEST);
                }
            }

            if (i < idsToScan.length - 1) {
                const regularDelay = getRandomInt(REGULAR_DELAY_MIN_MS, REGULAR_DELAY_MAX_MS);
                updateStatus(`Request for meuble_${currentId} done. Waiting ${(regularDelay / 1000).toFixed(1)}s...`);
                await new Promise(resolve => setTimeout(resolve, regularDelay));
            }
        }

        if (!scanErrorOccurred && !stopScanRequested) {
            const endTime = Date.now(); const durationSeconds = (endTime - startTime) / 1000;
            updateStatus(`Scan complete. Checked ${requestsMade} IDs in ${durationSeconds.toFixed(2)}s.`);
        }
        updateFoundIdsDisplay(); // Final update to button counts

        // Update placeholder with the latest highest ID after scan, if input is not focused
        if (document.activeElement !== startIdInput) {
            updateStartIdPlaceholder();
        }

        isScanning = false; stopScanRequested = false;
        scanButton.textContent = "Start Scan";
        scanButton.classList.remove('scanning'); scanButton.disabled = false; startIdInput.disabled = false;
    }

    // --- Event Listener for Scan Button ---
    scanButton.addEventListener('click', () => {
        // ... (scan button logic remains the same)
        if (!isScanning) {
            isScanning = true; stopScanRequested = false;
            scanButton.classList.add('scanning'); startIdInput.disabled = true;
            executeActualScan();
        } else {
            stopScanRequested = true; scanButton.textContent = "Stopping...";
            scanButton.disabled = true; updateStatus("Stop request received. Finishing current step...");
        }
    });
    // Add blur listener to update placeholder if user types and then clicks away
    startIdInput.addEventListener('blur', updateStartIdPlaceholder);

})();