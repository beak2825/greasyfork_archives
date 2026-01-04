// ==UserScript==
// @name         Google Images largest Drag-and-drop zone
// @namespace    https://github.com/random-user
// @version      1.0
// @description  Google Images with a large drag and drop zone for easier image searches
// @match        https://www.google.com/*
// @match        https://images.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529856/Google%20Images%20largest%20Drag-and-drop%20zone.user.js
// @updateURL https://update.greasyfork.org/scripts/529856/Google%20Images%20largest%20Drag-and-drop%20zone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(2, 115, 232, 0.1)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'none';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);

    const dropArea = document.createElement('div');
    dropArea.style.position = 'fixed';
    dropArea.style.top = '50px';
    dropArea.style.left = '50px';
    dropArea.style.right = '50px';
    dropArea.style.bottom = '50px';
    dropArea.style.border = '2px dashed rgba(26, 115, 232, 0.5)';
    dropArea.style.borderRadius = '10px';
    dropArea.style.zIndex = '10000';
    dropArea.style.display = 'none';
    dropArea.style.pointerEvents = 'none';
    document.body.appendChild(dropArea);

    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        overlay.style.display = 'block';
        dropArea.style.display = 'block';
    });

    document.addEventListener('dragleave', (e) => {
        e.preventDefault();
        overlay.style.display = 'none';
        dropArea.style.display = 'none';
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        overlay.style.display = 'none';
        dropArea.style.display = 'none';

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            } else {
                console.error('File input not found. Unable to process the image.');
            }
        } else {
            alert('Please drop a valid image file (e.g., .jpg, .png, .bmp).');
        }
    });

    setInterval(() => {
        if (!document.body.contains(overlay)) {
            document.body.appendChild(overlay);
            document.body.appendChild(dropArea);
        }
    }, 1000);
})();