// ==UserScript==
// @name         Full-Feature Sequential Text Extraction
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Extracts texts, emojis, and hashtags in sequence, grouped by div, with a start button, real-time board, copy, and save functions.
// @match        https://x.com/*  
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/516210/Full-Feature%20Sequential%20Text%20Extraction.user.js
// @updateURL https://update.greasyfork.org/scripts/516210/Full-Feature%20Sequential%20Text%20Extraction.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Initialize an array to store extracted data grouped by div
    const extractedData = JSON.parse(localStorage.getItem('extractedData')) || [];
    let isExtractionActive = false; // To track if extraction is active

    // Create floating controls (board, start button, and other UI)
    const controls = document.createElement('div');
    controls.style.position = 'fixed';
    controls.style.bottom = '10px';
    controls.style.right = '10px';
    controls.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    controls.style.color = 'white';
    controls.style.padding = '10px';
    controls.style.fontSize = '14px';
    controls.style.zIndex = '9999';
    document.body.appendChild(controls);

    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.style.backgroundColor = 'seagreen';
    startButton.style.color = 'white';
    startButton.style.fontWeight = "700"; // Bold weight
    startButton.style.padding = '6px';
    startButton.style.marginBottom = '10px';
    controls.appendChild(startButton);

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.style.backgroundColor = 'maroon';
    clearButton.style.color = 'white';
    clearButton.style.fontWeight = "700"; // Bold weight
    clearButton.style.padding = '6px';
    clearButton.style.marginBottom = '10px';
    clearButton.style.marginLeft = '8px';
    controls.appendChild(clearButton);

    const display = document.createElement('div');
    display.style.maxHeight = '200px';
    display.style.overflowY = 'auto';
    display.style.border = '1px solid white';
    display.style.padding = '5px';
    display.style.marginTop = '10px';
    display.innerHTML = '<strong>Extracted Data:</strong><br>';
    controls.appendChild(display);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy to Clipboard';
    copyButton.style.marginTop = '10px';
    copyButton.style.backgroundColor = '#007BFF';
    copyButton.style.color = 'white';
    copyButton.style.fontWeight = "700"; // Bold weight
    copyButton.style.padding = '5px';
    controls.appendChild(copyButton);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save as JSON';
    saveButton.style.marginTop = '10px';
    saveButton.style.backgroundColor = '#FF8C00';
    saveButton.style.color = 'white';
    saveButton.style.fontWeight = "700"; // Bold weight
    saveButton.style.padding = '5px';
    controls.appendChild(saveButton);

    // Function to update the display board
    function updateDisplay() {
        display.innerHTML = '<strong>Extracted Data:</strong><br>' +
            extractedData.map((item, index) => `<div><strong>Div ${index + 1}:</strong> ${item}</div>`).join('');
        localStorage.setItem('extractedData', JSON.stringify(extractedData));
    }

    // Function to extract data from a single div, preserving sequence
    function extractFromDiv(div) {
        let result = ''; // Initialize as a string to build the output directly
        const children = div.childNodes;

        children.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent.trim();
                if (text) {
                    // Append text directly
                    if (result && !result.endsWith(' ')) {
                        result += ' ';
                    }
                    result += text;
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === 'SPAN') {
                    const text = child.innerText.trim();
                    if (text) {
                        if (result && !result.endsWith(' ')) {
                            result += ' ';
                        }
                        result += text;
                    }
                } else if (child.tagName === 'IMG') {
                    const alt = child.getAttribute('alt');
                    if (alt) {
                        result += alt; // Append emoji directly, no space needed
                    }
                } else if (child.tagName === 'A' && child.getAttribute('role') === 'link') {
                    const hashtag = child.innerText.trim();
                    if (hashtag) {
                        if (!result.endsWith(' ')) {
                            result += ' ';
                        }
                        result += hashtag;
                    }
                }
            }
        });

        return result.trim(); // Return the final formatted string, trimmed for safety
    }


    // Function to extract from all divs
    function extractAll() {
        const targetDivs = document.querySelectorAll('div[data-testid="tweetText"]');
        targetDivs.forEach((div) => {
            const divData = extractFromDiv(div);

            // Add data if it's a new div
            if (divData && !extractedData.includes(divData)) {
                extractedData.push(divData);
                updateDisplay();
            }
        });
    }

    // Add functionality to the "Start Logging" button
    startButton.onclick = () => {
        if (!isExtractionActive) {
            isExtractionActive = true;
            startButton.textContent = 'Running...';
            extractAll();
        }
    };

    // Add functionality to the "Clear Data" button
    clearButton.onclick = () => {
        extractedData.length = 0; // Clear the array
        updateDisplay();
    };

    // Save as JSON
    saveButton.onclick = () => {
        const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Copy to Clipboard
    copyButton.onclick = () => {
        navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    };

    // MutationObserver to monitor new content on the page
    const observer = new MutationObserver(() => {
        if (isExtractionActive) {
            extractAll();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
