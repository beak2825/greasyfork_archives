// ==UserScript==
// @name         ProQuest Bulk Document Search - Sub-Batch System
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Open multiple ProQuest document pages in user-defined batches with sub-batch system
// @match        https://www.proquest.com/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/531174/ProQuest%20Bulk%20Document%20Search%20-%20Sub-Batch%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/531174/ProQuest%20Bulk%20Document%20Search%20-%20Sub-Batch%20System.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log("Script started");
console.log("Creating UI elements");
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const docId = getUrlParameter('docId');
    const batchId = getUrlParameter('batchId');

    // Function to add button to the right corner
    function addNextBatchButton() {
        const buttonStyle = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 5px 10px;
            font-size: 14px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 5px;
        `;

        const nextBatchButton = document.createElement('button');
        nextBatchButton.textContent = 'Next Batch';
        nextBatchButton.style.cssText = buttonStyle;
        nextBatchButton.addEventListener('click', () => {
            GM_setValue('triggerNextBatch', Date.now());
            window.close();
        });

        document.body.appendChild(nextBatchButton);
    }

    // Add button to all pages
    addNextBatchButton();

    // Main page logic
    if (!docId && !batchId && window.location.href.includes('/results/')) {
        console.log("Script started2");
console.log("Creating UI elements2");
        const ui = document.createElement('div');
        ui.innerHTML = `

            <textarea id="idList" rows="5" cols="50" placeholder="Enter IDs, one per line"></textarea><br>
            <label for="batchSize">Batch Size: </label>
            <input type="number" id="batchSize" value="66" min="1"><br>
            <button id="openTabsButton">Start Processing</button>
            <button id="nextBatchButton" style="display:none;">Next Batch</button>
            <button id="wakeUpButton" style="display:none;">Wake Up</button>
            <div id="status"></div>
            <div id="batchStatus"></div>
        `;
        document.body.prepend(ui);
console.log("Script started3");
console.log("Creating UI elements3");
        const openTabsButton = document.getElementById('openTabsButton');
        const nextBatchButton = document.getElementById('nextBatchButton');
        const wakeUpButton = document.getElementById('wakeUpButton');
        const statusDiv = document.getElementById('status');
        const batchStatusDiv = document.getElementById('batchStatus');

        let currentBatch = 0;
        let batches = 0;
        let ids = [];

        function openDocumentTabs() {
            ids = document.getElementById('idList').value.split('\n').filter(id => id.trim() !== '');
            if (ids.length === 0) {
                statusDiv.textContent = 'Please enter at least one document ID.';
                return;
            }

            const batchSize = parseInt(document.getElementById('batchSize').value, 10);
            batches = Math.ceil(ids.length / batchSize);
            currentBatch = 0;

            statusDiv.textContent = `Processing ${ids.length} IDs in ${batches} batch(es) of ${batchSize}.`;
            openTabsButton.style.display = 'none';
            nextBatchButton.style.display = 'inline';
            wakeUpButton.style.display = 'none';

            processBatch();
        }

        function processBatch() {
            if (currentBatch >= batches) {
                batchStatusDiv.textContent = 'All batches processed.';
                nextBatchButton.style.display = 'none';
                wakeUpButton.style.display = 'inline';
                return;
            }

            const batchSize = parseInt(document.getElementById('batchSize').value, 10);
            const start = currentBatch * batchSize;
            const end = Math.min((currentBatch + 1) * batchSize, ids.length);
            const batchIds = ids.slice(start, end);

            const newBatchId = Date.now().toString();
            GM_setValue('currentBatchId', newBatchId);

            processSubBatches(batchIds, newBatchId, 0);
        }

        function processSubBatches(batchIds, batchId, subBatchIndex) {
            const subBatchSize = 10;
            const start = subBatchIndex * subBatchSize;
            const end = Math.min((subBatchIndex + 1) * subBatchSize, batchIds.length);
            const subBatchIds = batchIds.slice(start, end);

            subBatchIds.forEach((id) => {
                const docUrl = `https://www.proquest.com/docview/${id}?accountid=10598&batchId=${batchId}`;
                GM_openInTab(docUrl, { active: false, insert: true, setParent: true });
            });

            batchStatusDiv.textContent = `Processed sub-batch ${subBatchIndex + 1} of batch ${currentBatch + 1}. Opened tabs ${start + 1} to ${end} of ${batchIds.length}.`;

            if (end < batchIds.length) {
                setTimeout(() => processSubBatches(batchIds, batchId, subBatchIndex + 1), 5000);
            } else {
                currentBatch++;
                if (currentBatch < batches) {
                    nextBatchButton.disabled = false;
                } else {
                    batchStatusDiv.textContent = 'All batches processed.';
                    nextBatchButton.style.display = 'none';
                    wakeUpButton.style.display = 'inline';
                }
            }
        }

        function wakeUp() {
            openTabsButton.style.display = 'inline';
            wakeUpButton.style.display = 'none';
            document.getElementById('idList').value = '';
            statusDiv.textContent = '';
            batchStatusDiv.textContent = '';
        }

        openTabsButton.addEventListener('click', openDocumentTabs);
        nextBatchButton.addEventListener('click', processBatch);
        wakeUpButton.addEventListener('click', wakeUp);

        // Listen for next batch trigger from other tabs
        setInterval(() => {
            if (GM_getValue('triggerNextBatch', 0) > Date.now() - 1000) {
                GM_setValue('triggerNextBatch', 0);
                processBatch();
            }
        }, 500);
    }
    // Document page logic
    else if (docId) {
        // No timer logic needed here anymore
    }
})();