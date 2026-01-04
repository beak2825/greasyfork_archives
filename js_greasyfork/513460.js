// ==UserScript==
// @name         Catbox File Uploader with Hidden Circular Button, Minimize Support, Drag-and-Drop
// @namespace    https://catbox.moe/
// @version      1.2
// @description  A button to upload files to Catbox, hidden until clicked, with minimize support, drag-and-drop functionality, and a copy URL button.
// @author       heapsofjoy
// @match        *://*/*
// @icon         https://catbox.moe/pictures/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/513460/Catbox%20File%20Uploader%20with%20Hidden%20Circular%20Button%2C%20Minimize%20Support%2C%20Drag-and-Drop.user.js
// @updateURL https://update.greasyfork.org/scripts/513460/Catbox%20File%20Uploader%20with%20Hidden%20Circular%20Button%2C%20Minimize%20Support%2C%20Drag-and-Drop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a hidden button at the bottom of the page
    const uploadButton = document.createElement('div');
    uploadButton.id = 'uploadButton';
    uploadButton.innerHTML = '⬆'; // Up arrow to indicate sliding up
    document.body.appendChild(uploadButton);

    // Create an invisible file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Create a text box to display the URL after uploading
    const urlTextBox = document.createElement('input');
    urlTextBox.type = 'text';
    urlTextBox.id = 'fileUrl';
    urlTextBox.placeholder = 'URL will appear here';
    urlTextBox.readOnly = true;
    urlTextBox.style.display = 'none';
    document.body.appendChild(urlTextBox);

    // Create a copy button for the URL
    const copyButton = document.createElement('div');
    copyButton.id = 'copyButton';
    copyButton.innerHTML = '📋'; // Clipboard icon
    copyButton.style.display = 'none';
    document.body.appendChild(copyButton);

    // Create a drop zone area for drag-and-drop
    const dropZone = document.createElement('div');
    dropZone.id = 'dropZone';
    dropZone.innerText = 'Drag & Drop File Here';
    dropZone.style.display = 'none';
    document.body.appendChild(dropZone);

    // Minimize button
    const minimizeButton = document.createElement('div');
    minimizeButton.id = 'minimizeButton';
    minimizeButton.innerHTML = '—'; // Minimize symbol
    minimizeButton.style.display = 'none';
    document.body.appendChild(minimizeButton);

    // Styling for the circular button, text box, drop zone, minimize button, and copy button
    GM_addStyle(`
        #uploadButton {
            position: fixed;
            bottom: 0;
            left: 20px;
            width: 50px;
            height: 50px;
            background-color: #333; /* Dark grey */
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 24px;
            text-align: center;
            line-height: 50px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
            transition: bottom 0.4s ease;
            z-index: 10000; /* Ensure it's on top */
        }
        #uploadButton.minimized {
            bottom: 0;
            width: 50px;
            height: 10px;
            border-radius: 50px 50px 0 0;
            font-size: 10px;
            line-height: 10px;
        }
        #minimizeButton {
            position: fixed;
            bottom: 0;
            left: 80px;
            width: 30px;
            height: 30px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 16px;
            text-align: center;
            line-height: 30px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 10000;
        }
        #fileUrl {
            position: fixed;
            bottom: 70px;
            left: 20px;
            width: 270px; /* Adjusted to accommodate the copy button */
            padding: 10px;
            font-size: 14px;
            border: none;
            border-radius: 5px;
            background-color: #333;
            color: white;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
            display: block;
            z-index: 10000;
        }
        #copyButton {
            position: fixed;
            bottom: 70px;
            left: 295px; /* Position next to URL text box */
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

    // Start minimized
    let isMinimized = true;
    uploadButton.classList.add('minimized');

    // Show the button when clicked
    uploadButton.addEventListener('click', () => {
        if (isMinimized) {
            // Show the full button
            uploadButton.classList.remove('minimized');
            isMinimized = false;
            minimizeButton.style.display = 'block';
        } else {
            // Open file explorer on single click when button is expanded
            fileInput.click();
        }
    });

    // Minimize the button when clicking the minimize button
    minimizeButton.addEventListener('click', () => {
        uploadButton.classList.add('minimized');
        isMinimized = true;
        minimizeButton.style.display = 'none';
        // Hide URL text box and copy button when minimizing
        urlTextBox.style.display = 'none';
        copyButton.style.display = 'none';
    });

    // Listen for file selection from the file input
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            uploadFile(file);
        }
    });

    let dragCounter = 0;  // To keep track of drag events

    // Disable drag-and-drop if minimized
    document.addEventListener('dragenter', (e) => {
        if (!isMinimized) {
            e.preventDefault();
            dragCounter++;  // Increment the drag counter
            dropZone.style.display = 'block';
        }
    });

    // Handle drag over events to allow dropping
    document.addEventListener('dragover', (e) => {
        if (!isMinimized) {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }
    });

    // Handle drag leave to hide the drop zone only when all drags leave
    document.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dragCounter--;  // Decrement the drag counter
        if (dragCounter === 0) {
            dropZone.classList.remove('dragover');
            dropZone.style.display = 'none';
        }
    });

    // Handle drop events to upload the file
    dropZone.addEventListener('drop', (e) => {
        if (!isMinimized) {
            e.preventDefault();
            dragCounter = 0;  // Reset the counter when a file is dropped
            dropZone.classList.remove('dragover');
            dropZone.style.display = 'none';
            const file = e.dataTransfer.files[0];
            if (file) {
                uploadFile(file);
            }
        }
    });

    // Upload file and fetch URL
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
            // Display the URL in the text box and show copy button
            urlTextBox.style.display = 'block';
            urlTextBox.value = url;
            copyButton.style.display = 'block';
        })
        .catch(error => {
            urlTextBox.value = 'Upload failed!';
            console.error('Error:', error);
        });
    }

    // Copy URL to clipboard when copy button is clicked
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(urlTextBox.value).then(() => {
            copyButton.innerHTML = '✔'; // Change to a check mark to indicate success
            setTimeout(() => {
                copyButton.innerHTML = '📋'; // Revert back to clipboard icon
            }, 1000);
        }).catch(error => {
            console.error('Copy failed:', error);
        });
    });
})();