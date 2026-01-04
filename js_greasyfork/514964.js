// ==UserScript==
// @name         Enhanced Catbox File Uploader with Global History
// @namespace    https://catbox.moe/
// @version      1.3.1
// @description  Upload files to Catbox with URL history, timestamps, minimize support, middle-click to open in new tab without shifting focus.
// @author       heapsofjoy
// @match        *://*/*
// @icon         https://catbox.moe/pictures/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/514964/Enhanced%20Catbox%20File%20Uploader%20with%20Global%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/514964/Enhanced%20Catbox%20File%20Uploader%20with%20Global%20History.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create necessary DOM elements
    const uploadButton = document.createElement('div');
    uploadButton.id = 'uploadButton';
    uploadButton.innerHTML = '⬆';
    document.body.appendChild(uploadButton);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    const urlTextBox = document.createElement('input');
    urlTextBox.type = 'text';
    urlTextBox.id = 'fileUrl';
    urlTextBox.placeholder = 'URL will appear here';
    urlTextBox.readOnly = true;
    urlTextBox.style.display = 'none';
    document.body.appendChild(urlTextBox);

    const copyButton = document.createElement('div');
    copyButton.id = 'copyButton';
    copyButton.innerHTML = '📋';
    copyButton.style.display = 'none';
    document.body.appendChild(copyButton);

    const dropZone = document.createElement('div');
    dropZone.id = 'dropZone';
    dropZone.innerText = 'Drag & Drop File Here';
    dropZone.style.display = 'none';
    document.body.appendChild(dropZone);

    const minimizeButton = document.createElement('div');
    minimizeButton.id = 'minimizeButton';
    minimizeButton.innerHTML = '—';
    minimizeButton.style.display = 'none';
    document.body.appendChild(minimizeButton);

    const historyButton = document.createElement('div');
    historyButton.id = 'historyButton';
    historyButton.innerHTML = '📜';
    historyButton.style.display = 'none';
    document.body.appendChild(historyButton);

    const clearHistoryButton = document.createElement('div');
    clearHistoryButton.id = 'clearHistoryButton';
    clearHistoryButton.innerHTML = '🗑️';
    clearHistoryButton.style.display = 'none';
    document.body.appendChild(clearHistoryButton);

    const historyList = document.createElement('div');
    historyList.id = 'historyList';
    historyList.style.display = 'none';
    document.body.appendChild(historyList);

    GM_addStyle(`
        #uploadButton, #historyButton, #clearHistoryButton, #minimizeButton {
            position: fixed;
            bottom: 0;
            width: 50px;
            height: 50px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 24px;
            text-align: center;
            line-height: 50px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 10000;
        }
        #uploadButton { left: 20px; transition: bottom 0.4s ease; }
        #uploadButton.minimized {
            bottom: 0;
            width: 50px;
            height: 10px;
            border-radius: 50px 50px 0 0;
            font-size: 10px;
            line-height: 10px;
        }
        #minimizeButton, #historyButton, #clearHistoryButton {
            width: 40px;
            height: 40px;
            font-size: 20px;
            line-height: 40px;
        }
        #minimizeButton { left: 80px; }
        #historyButton { left: 140px; }
        #clearHistoryButton { left: 200px; }

        #fileUrl, #historyList {
            position: fixed;
            bottom: 70px;
            left: 20px;
            width: 270px;
            background-color: #333;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            overflow-y: auto;
        }
        #fileUrl { display: block; }
        #historyList {
            height: 200px;
            display: none;
        }
        #historyList div {
            padding: 5px;
            border-bottom: 1px solid #555;
            cursor: pointer;
            color: #66ccff;
        }
        #historyList div span.timestamp {
            display: block;
            color: #aaa;
            font-size: 12px;
            margin-top: 2px;
        }
        #copyButton {
            position: fixed;
            bottom: 70px;
            left: 300px;
            width: 30px;
            height: 30px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 16px;
            text-align: center;
            line-height: 30px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 10000;
        }
        #dropZone {
            position: fixed;
            bottom: 120px;
            left: 20px;
            width: 300px;
            height: 150px;
            border: 2px dashed #aaa;
            background-color: #444;
            color: white;
            text-align: center;
            line-height: 150px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            border-radius: 5px;
            z-index: 10000;
        }
        #dropZone.dragover {
            border-color: #fff;
            background-color: #555;
        }
    `);

    let isMinimized = true;
    uploadButton.classList.add('minimized');

    uploadButton.addEventListener('click', () => {
        if (isMinimized) {
            uploadButton.classList.remove('minimized');
            isMinimized = false;
            minimizeButton.style.display = 'block';
            historyButton.style.display = 'block';
            clearHistoryButton.style.display = 'block';
        } else {
            fileInput.click();
        }
    });

    minimizeButton.addEventListener('click', () => {
        uploadButton.classList.add('minimized');
        isMinimized = true;
        minimizeButton.style.display = 'none';
        urlTextBox.style.display = 'none';
        copyButton.style.display = 'none';
        historyList.style.display = 'none';
        historyButton.style.display = 'none';
        clearHistoryButton.style.display = 'none';
        dropZone.style.display = 'none';
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) uploadFile(file);
    });

    const uploadedUrlsKey = 'globalUploadedUrls';
    const urlLimit = 10; // Limit the number of stored URLs

    // Load the saved URLs from GM storage
    let savedUrls = GM_getValue(uploadedUrlsKey, []);

    function updateHistoryList() {
        historyList.innerHTML = '';
        const sortedUrls = [...savedUrls].reverse(); // Reverse order for recent-first

        sortedUrls.forEach(entry => {
            const urlElement = document.createElement('div');
            urlElement.innerHTML = `${entry.url} <span class="timestamp">${entry.timestamp}</span>`;

            // Left-click to open in a new tab (focus)
            urlElement.addEventListener('click', () => {
                window.open(entry.url, '_blank');
            });

            // Middle-click to open in a background tab
            urlElement.addEventListener('auxclick', (e) => {
                if (e.button === 1) {
                    window.open(entry.url, '_blank', 'noopener,noreferrer');
                }
            });
            historyList.appendChild(urlElement);
        });
    }

    historyButton.addEventListener('click', () => {
        historyList.style.display = historyList.style.display === 'none' ? 'block' : 'none';
    });

    clearHistoryButton.addEventListener('click', () => {
        GM_setValue(uploadedUrlsKey, []); // Clear GM storage
        savedUrls = []; // Reset local array
        historyList.innerHTML = ''; // Clear the displayed list
        alert('History cleared!');
    });

    let dragCounter = 0;

    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!isMinimized) {
            dragCounter++;
            dropZone.style.display = 'block';
            dropZone.classList.add('dragover');
        }
    });

    document.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (!isMinimized) {
            dragCounter--;
            if (dragCounter === 0) {
                dropZone.classList.remove('dragover');
                dropZone.style.display = 'none';
            }
        }
    });

    dropZone.addEventListener('drop', (e) => {
        if (!isMinimized) {
            e.preventDefault();
            dragCounter = 0;
            dropZone.classList.remove('dragover');
            dropZone.style.display = 'none';
            const file = e.dataTransfer.files[0];
            if (file) uploadFile(file);
        }
    });

    function uploadFile(file) {
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('time', '1h');
        formData.append('fileToUpload', file);

        fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(url => {
            const timestamp = new Date().toLocaleString();
            savedUrls.push({ url, timestamp });
            // Check for limit and remove oldest if needed
            if (savedUrls.length > urlLimit) {
                savedUrls.shift(); // Remove the oldest entry
            }
            GM_setValue(uploadedUrlsKey, savedUrls); // Save to global storage
            urlTextBox.style.display = 'block';
            urlTextBox.value = url;
            copyButton.style.display = 'block';
            updateHistoryList();
        })
        .catch(error => {
            urlTextBox.value = 'Upload failed!';
            console.error('Error:', error);
        });
    }

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(urlTextBox.value).then(() => {
            copyButton.innerHTML = '✔';
            setTimeout(() => copyButton.innerHTML = '📋', 1000);
        }).catch(error => console.error('Copy failed:', error));
    });

    updateHistoryList(); // Initial call to populate the history on load
})();
