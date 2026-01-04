// ==UserScript==
// @name         Drag and Drop txt
// @version      0.510
// @namespace    https://ufs.pt/*
// @description  Post with txt and clipboard content
// @author       travisasd
// @match        https://ufs.pt/index.php?forums/*/post-thread
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511923/Drag%20and%20Drop%20txt.user.js
// @updateURL https://update.greasyfork.org/scripts/511923/Drag%20and%20Drop%20txt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prefixes in GB
    const predefinedSizes = [
        0.1, 0.2, 0.3, 0.4, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5,
        5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110,
        120, 130, 140, 150, 160, 170, 180, 190, 200
    ];

    // Function to create the drag and drop container
    function createDropArea() {
        const dropAreaContainer = document.createElement('div');
        dropAreaContainer.style.border = '2px dashed #ccc';
        dropAreaContainer.style.backgroundColor = '#f9f9f9';
        dropAreaContainer.style.padding = '10px';
        dropAreaContainer.style.marginLeft = '10px';
        dropAreaContainer.style.display = 'inline-block';
        dropAreaContainer.style.cursor = 'pointer';
        dropAreaContainer.style.textAlign = 'center';
        dropAreaContainer.style.width = '200px';
        dropAreaContainer.innerText = 'Wrzuc plik albo kliknij by szukac';
        return dropAreaContainer;
    }

    function insertDropArea(dropAreaContainer) {
        const submitButton = document.querySelector('.formSubmitRow-controls .button');

        if (submitButton) {
            submitButton.parentNode.insertBefore(dropAreaContainer, submitButton.nextSibling);
        } else {
            console.error('Submit button not found');
        }
    }

    const dropAreaContainer = createDropArea();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    fileInput.style.display = 'none';

    document.body.appendChild(fileInput);

    dropAreaContainer.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropAreaContainer.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropAreaContainer.addEventListener('dragover', () => {
        dropAreaContainer.style.borderColor = 'green';
    });

    dropAreaContainer.addEventListener('dragleave', () => {
        dropAreaContainer.style.borderColor = '#ccc';
    });

    dropAreaContainer.addEventListener('drop', (event) => {
        let dt = event.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        const file = files[0];

        if (file && file.type === "text/plain") {
            const reader = new FileReader();

            reader.onload = function(e) {
                const content = e.target.result;
                const titleTextarea = document.querySelector('textarea[name="title"]');
                const messageDiv = document.querySelector('.fr-element.fr-view');

                if (titleTextarea && messageDiv) {
                    const lines = content.split('\n');
                    titleTextarea.value = lines[0].trim(); // First line to title
                    const restOfContent = lines.slice(1).join('\n').trim(); // Remaining lines to body
                    messageDiv.innerText = restOfContent; // Set body content

                    // Check for upload size and select the closest prefix
                    const uploadSize = extractUploadSize(content);
                    if (uploadSize !== null) {
                        selectClosestPrefix(uploadSize); // Update prefix
                    } else {
                        console.log("Size match not found");
                    }
                } else {
                    console.error('Textareas not found');
                }
            };
            reader.readAsText(file);
        } else {
            alert('Wybierz plik .txt');
        }
    }

    function extractUploadSize(text) {
        const sizeMatch = text.match(/\[b\]Wielkość uploadu:\[\/b\]\s*(\d+[.,]?\d*)\s*(gb|mb)/i);
        if (sizeMatch) {
            let sizeValue = parseFloat(sizeMatch[1].replace(',', '.'));
            const sizeUnit = sizeMatch[2].toLowerCase();

            if (sizeUnit === 'mb') {
                sizeValue /= 1024;
            }
            return sizeValue;
        }
        return null;
    }


function selectClosestPrefix(uploadSize) {
    function roundToClosest(size) {
        for (let i = 0; i < predefinedSizes.length - 1; i++) {
            const lowerBound = predefinedSizes[i];
            const upperBound = predefinedSizes[i + 1];

            if (size >= lowerBound && size < upperBound) {
                if (size >= (lowerBound + upperBound) / 2) {
                    return upperBound;
                } else {
                    return lowerBound;
                }
            }
        }
        return size;
    }

    let closestSize = roundToClosest(uploadSize);

    // Update prefix in the dropdown
    const prefixElement = document.querySelector('.js-activePrefix');
    if (prefixElement) {
        const ariaControlsId = "js-XFUniqueId7";

        prefixElement.textContent = closestSize + "GB";
        prefixElement.classList.add("label", "label--primary");
        prefixElement.setAttribute("data-prefix-class", "label label--primary");

        const triggerElement = document.querySelector('a.menuTrigger.menuTrigger--prefix');
        if (triggerElement) {
            triggerElement.setAttribute("aria-controls", ariaControlsId);
        }

        const selectedPrefixId = predefinedSizes.indexOf(closestSize) + 1;
        const prefixMenuItem = document.querySelector(`a[data-prefix-id="${selectedPrefixId}"]`);
        if (prefixMenuItem) {
            prefixMenuItem.click();
        }

        const menuElement = document.querySelector('.js-prefixMenuContent');
        if (menuElement) {
            const changeEvent = new Event('change');
            menuElement.dispatchEvent(changeEvent);
        }
    } else {
        console.error("Prefix element not found");
    }
}



    // Add a button to paste from clipboard
    const clipboardButton = document.createElement('button');
    clipboardButton.innerText = 'Wklej ze schowka';
    clipboardButton.style.marginLeft = '10px';
    clipboardButton.style.cursor = 'pointer';
    clipboardButton.style.display = 'inline-block';
    clipboardButton.style.padding = '10px';

    clipboardButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const text = await navigator.clipboard.readText();
            const titleTextarea = document.querySelector('textarea[name="title"]');
            const messageDiv = document.querySelector('.fr-element.fr-view');

            if (titleTextarea && messageDiv) {
                const lines = text.split('\n');
                titleTextarea.value = lines[0].trim();
                const restOfContent = lines.slice(1).join('\n').trim();
                messageDiv.innerText = restOfContent;

                const uploadSize = extractUploadSize(text);
                if (uploadSize !== null) {
                    selectClosestPrefix(uploadSize);
                } else {
                    console.log("Size match not found");
                }
            } else {
                console.error('Textareas not found');
            }
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    });

    // Container for buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.alignItems = 'center';

    buttonContainer.appendChild(dropAreaContainer);
    buttonContainer.appendChild(clipboardButton);

    // Retry mechanism
    function tryInsertElements() {
        const submitButton = document.querySelector('.formSubmitRow-controls .button');
        if (submitButton && !document.querySelector('#buttonContainer')) {
            submitButton.parentNode.insertBefore(buttonContainer, submitButton.nextSibling);
            console.log('Inserted successfully');
        } else {
            console.log('Waiting for button');
        }
    }

    // Observe page changes
    const observer = new MutationObserver((mutations, observer) => {
        tryInsertElements();
        if (document.querySelector('#buttonContainer')) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    let retryCount = 0;
    const retryInterval = setInterval(() => {
        tryInsertElements();
        retryCount++;
        if (document.querySelector('#buttonContainer') || retryCount > 10) {
            clearInterval(retryInterval);
        }
    }, 1000);
})();
