// ==UserScript==
// @name         EhBatchUpload
// @namespace    http://tampermonkey.net/
// @version      2025-06-17
// @description  Upload a large gallery in small batches
// @author       4piu
// @license      MIT
// @match        https://upload.e-hentai.org/managegallery*
// @match        https://upld.exhentai.org/upld/managegallery*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hentai.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539817/EhBatchUpload.user.js
// @updateURL https://update.greasyfork.org/scripts/539817/EhBatchUpload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let batchSize = 5;
    let filesToUpload = [];

    let filesUploaded = 0;
    let totalFiles = 0;
    let currentBatch = 0;
    let totalBatches = 0;
    let batchPercent = 0;
    let uploadInProgress = false;
    let uploadMessage = '';

    // Create a progress display element
    function createProgressDisplay() {
        const progressDiv = document.createElement('div');
        progressDiv.id = 'batchProgress';
        progressDiv.style.cssText = 'padding: 10px; border: 1px solid;';
        progressDiv.innerHTML = '<p id="uploadMessage" style="font-weight: bold;"></p>' +
                              '<p>Status: <span id="batchStatus">Idle</span></p>' +
                              '<p>Files Uploaded: <span id="filesUploaded">0</span>/<span id="totalFiles">0</span> <span id="totalPercent"></span></p>' +
                              '<p>Current Batch: <span id="currentBatch">0</span>/<span id="totalBatches">0</span> <span id="batchPercent"></span></p>';
        document.getElementById('u').appendChild(progressDiv);
    }

    // Create a input box for batch size
    function createBatchSizeInput() {
       const batchSizeInputDiv = document.createElement('div');
       batchSizeInputDiv.innerHTML = '<label for="batchSizeInput">Batch size</label>' +
                             `<input type="number" id="batchSizeInput" name="batchSizeInput" value="${batchSize}" style="width: 40px; line-height: 19px; border: 2px solid; margin: 3px 1px 0; padding: 1px 3px 3px; border-radius: 3px;">`;
       document.getElementById('uploadbutton').parentNode.appendChild(batchSizeInputDiv);
    }

    // Update progress display
    function updateProgressDisplay() {
        document.getElementById('batchStatus').textContent = uploadInProgress ? 'Uploading...' : 'Idle';
        document.getElementById('filesUploaded').textContent = filesUploaded;
        document.getElementById('totalFiles').textContent = totalFiles;
        document.getElementById('totalPercent').textContent = uploadInProgress? `[${(filesUploaded / totalFiles * 100).toFixed(1)}%]` : '';
        document.getElementById('currentBatch').textContent = currentBatch + 1;
        document.getElementById('totalBatches').textContent = totalBatches;
        document.getElementById('batchPercent').textContent = uploadInProgress? `[${batchPercent.toFixed(1)}%]` : '';
        document.getElementById('uploadMessage').textContent = uploadMessage;
    }

    // Upload a single batch of files
    function uploadBatch(batchFiles) {
        if (batchFiles.length === 0) {
            currentBatch++;
            uploadNextBatch();
            return;
        }

        const formData = new FormData();
        batchFiles.forEach(file => formData.append('files[]', file));

        // Copy hidden inputs from original form
        const originalForm = document.getElementById('uploadform');
        const hiddenInputs = originalForm.querySelectorAll('input[type="hidden"]');
        hiddenInputs.forEach(input => {
            formData.append(input.name, input.value);
        });

        uploadInProgress = true;
        updateProgressDisplay();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', originalForm.action, true);

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                batchPercent = (e.loaded / e.total) * 100;
                updateProgressDisplay();
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                currentBatch < totalBatches && currentBatch++;
                filesToUpload = filesToUpload.slice(batchFiles.length);
                filesUploaded = totalFiles - filesToUpload.length;
                uploadInProgress = false;
                updateProgressDisplay();
                uploadNextBatch();
            } else {
                uploadMessage = `Error uploading batch ${currentBatch + 1}: ${xhr.statusText}`;
                uploadInProgress = false;
                updateProgressDisplay();
                document.getElementById('batchSizeInput').disabled = false;
            }
        };

        xhr.onerror = function() {
            uploadMessage = `Error uploading batch ${currentBatch + 1}: Network Error`;
            uploadInProgress = false;
            updateProgressDisplay();
            document.getElementById('batchSizeInput').disabled = false;
        };

        xhr.send(formData);
    }

    // Start uploading the next batch
    function uploadNextBatch() {
        if (currentBatch >= totalBatches || filesToUpload.length === 0) {
            uploadMessage = 'All batches uploaded successfully! Please refresh page to see results. ';
            uploadInProgress = false;
            updateProgressDisplay();
            document.getElementById('batchSizeInput').disabled = false;
            return;
        }

        const start = 0;
        const end = Math.min(batchSize, filesToUpload.length);
        const batchFiles = filesToUpload.slice(start, end);
        uploadBatch(batchFiles);
    }

    // Override the original submit_upload function
    function overrideSubmitUpload() {
        window.submit_upload = function() {
            if (uploadInProgress) {
                alert('Upload in progress. Please wait until the current batch completes.');
                return;
            }

            const fileInput = document.getElementById('uploadfiles');
            if (!fileInput.files.length) {
                alert('Please select files to upload.');
                return;
            }

            if (!disable_submit()) {
                return;
            }

            const batchSizeInput = document.getElementById('batchSizeInput');
            batchSize = parseInt(batchSizeInput.value) || batchSize; // Fallback to current value if invalid
            batchSizeInput.disabled = true;

            filesToUpload = Array.from(fileInput.files);
            totalFiles = filesToUpload.length;
            filesUploaded = 0;
            totalBatches = Math.ceil(filesToUpload.length / batchSize);
            currentBatch = 0;
            document.getElementById('uploadbutton').value = 'Uploading...';
            updateProgressDisplay();
            uploadNextBatch();
        };
    }

    // Initialize the script
    function init() {
        createProgressDisplay();
        createBatchSizeInput();
        overrideSubmitUpload();
        console.info('EhBatchUpload loaded');
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();