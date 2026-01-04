// ==UserScript==
// @name         PixHost Drag-and-Drop Uploader
// @namespace    https://pixhost.to/
// @version      0.1
// @description  Adds drag-and-drop image upload functionality to PixHost with grouped URLs output
// @author       You
// @match        https://pixhost.to/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515718/PixHost%20Drag-and-Drop%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/515718/PixHost%20Drag-and-Drop%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles
    GM_addStyle(`
        #custom-upload-zone {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: white;
            border: 2px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        #drop-zone {
            border: 2px dashed #ccc;
            border-radius: 4px;
            padding: 20px;
            text-align: center;
            margin-bottom: 10px;
            background: #f9f9f9;
            transition: all 0.3s ease;
        }

        #drop-zone.drag-over {
            background: #e1f5fe;
            border-color: #2196F3;
        }

        .url-output {
            margin-top: 10px;
            max-height: 300px;
            overflow-y: auto;
        }

        .url-group {
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }

        .url-type {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .url-textarea {
            width: 100%;
            min-height: 100px;
            margin: 5px 0;
            font-family: monospace;
            font-size: 12px;
            resize: vertical;
        }

        .copy-btn {
            background: #2196F3;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin: 2px;
            width: 100%;
        }

        .copy-btn:hover {
            background: #1976D2;
        }

        .status {
            margin-top: 10px;
            padding: 10px;
            border-radius: 4px;
        }

        .success {
            background: #E8F5E9;
            color: #2E7D32;
        }

        .error {
            background: #FFEBEE;
            color: #C62828;
        }

        .progress {
            margin-top: 10px;
            font-size: 0.9em;
            color: #666;
        }
    `);

    // Create upload interface
    const uploadInterface = document.createElement('div');
    uploadInterface.id = 'custom-upload-zone';
    uploadInterface.innerHTML = `
        <div id="drop-zone">
            Drag & Drop Images Here<br>
            <small>or click to select files</small>
            <input type="file" id="file-input" multiple style="display: none">
        </div>
        <div class="progress"></div>
        <div class="url-output"></div>
    `;

    document.body.appendChild(uploadInterface);

    // Setup drag and drop handlers
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const urlOutput = document.querySelector('.url-output');
    const progressDiv = document.querySelector('.progress');

    let uploadQueue = [];
    let uploadResults = [];
    let isUploading = false;

    dropZone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFiles, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files: files } });
    }

    function handleFiles(e) {
        const files = [...e.target.files];
        uploadQueue = uploadQueue.concat(files);
        updateProgress();
        if (!isUploading) {
            processQueue();
        }
    }

    function updateProgress() {
        const total = uploadQueue.length + uploadResults.length;
        const completed = uploadResults.length;
        if (total > 0) {
            progressDiv.textContent = `Progress: ${completed}/${total} files`;
        } else {
            progressDiv.textContent = '';
        }
    }

    async function processQueue() {
        if (uploadQueue.length === 0) {
            if (uploadResults.length > 0) {
                displayGroupedUrls(uploadResults);
                uploadResults = [];
            }
            isUploading = false;
            updateProgress();
            return;
        }

        isUploading = true;
        const file = uploadQueue.shift();

        if (!file.type.startsWith('image/')) {
            showStatus(`${file.name} is not an image file`, 'error');
            processQueue();
            return;
        }

        const formData = new FormData();
        formData.append('img', file);
        formData.append('content_type', '0');
        formData.append('max_th_size', '420');

        try {
            await uploadFile(file, formData);
        } catch (error) {
            showStatus(`Error uploading ${file.name}: ${error}`, 'error');
        }

        processQueue();
    }

    function uploadFile(file, formData) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.pixhost.to/images',
                data: formData,
                headers: {
                    'Accept': 'application/json'
                },
                onload: async function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const directUrl = await extractDirectUrl(data.show_url);
                        uploadResults.push({
                            name: data.name,
                            directUrl: directUrl,
                            showUrl: data.show_url
                        });
                        updateProgress();
                        showStatus(`${file.name} uploaded successfully!`, 'success');
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error.statusText);
                }
            });
        });
    }

    function extractDirectUrl(showUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: showUrl,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const imgElement = doc.querySelector('#image');
                    if (imgElement && imgElement.src) {
                        resolve(imgElement.src);
                    } else {
                        reject('Could not find direct image URL');
                    }
                },
                onerror: function(error) {
                    reject(error.statusText);
                }
            });
        });
    }

    function displayGroupedUrls(results) {
        const urlGroup = document.createElement('div');
        urlGroup.className = 'url-group';

        const formats = {
            'Direct URLs': results.map(r => r.directUrl).join('\n'),
            'BBCode': results.map(r => `[img]${r.directUrl}[/img]`).join('\n'),
            'Markdown': results.map(r => `![${r.name}](${r.directUrl})`).join('\n')
        };

        Object.entries(formats).forEach(([formatType, text]) => {
            const formatSection = document.createElement('div');
            formatSection.innerHTML = `
                <div class="url-type">${formatType}</div>
                <textarea class="url-textarea" readonly>${text}</textarea>
                <button class="copy-btn" data-clipboard-text="${text}">Copy ${formatType}</button>
            `;
            urlGroup.appendChild(formatSection);
        });

        // Clear previous results
        urlOutput.innerHTML = '';
        urlOutput.appendChild(urlGroup);

        // Add click handlers for copy buttons
        urlGroup.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.getAttribute('data-clipboard-text');
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 1000);
                });
            });
        });
    }

    function showStatus(message, type) {
        const statusDiv = document.createElement('div');
        statusDiv.className = `status ${type}`;
        statusDiv.textContent = message;
        urlOutput.insertBefore(statusDiv, urlOutput.firstChild);

        setTimeout(() => {
            statusDiv.remove();
        }, 3000);
    }
})();