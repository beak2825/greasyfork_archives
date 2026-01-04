// ==UserScript==
// @name         Text Extraction - navigate
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Extracts tweets with a real-time board, save as JSON.
// @match        https://x.com/*  
// @license      MIT
// @grant        
// @downloadURL https://update.greasyfork.org/scripts/516382/Text%20Extraction%20-%20navigate.user.js
// @updateURL https://update.greasyfork.org/scripts/516382/Text%20Extraction%20-%20navigate.meta.js
// ==/UserScript==

/* MIT License
 * 
 * Copyright (c) 2024 [955whynot]
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function () {
    'use strict';

    // Add error handling for localStorage
    function safelyGetFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('extractedData')) || [];
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return [];
        }
    }

    const extractedData = safelyGetFromStorage();

    let observer; // To hold the MutationObserver instance

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

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.style.backgroundColor = 'maroon';
    clearButton.style.color = 'white';
    clearButton.style.fontWeight = "700";
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

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save as JSON';
    saveButton.style.marginTop = '10px';
    saveButton.style.backgroundColor = '#FF8C00';
    saveButton.style.color = 'white';
    saveButton.style.fontWeight = "700";
    saveButton.style.padding = '5px';
    controls.appendChild(saveButton);

    // Add counter to display
    const counter = document.createElement('div');
    counter.style.marginTop = '5px';
    counter.style.fontWeight = 'bold';
    counter.textContent = `Total Items: ${extractedData.length}`;
    controls.insertBefore(counter, display);

    // Function to update the display board
    function updateDisplay() {
        try {
            display.innerHTML = '<strong>Extracted Data:</strong><br>' +
                extractedData.map((item, index) => `<div><strong>Div ${index + 1}:</strong> ${item}</div>`).join('');
            counter.textContent = `Total Items: ${extractedData.length}`;
            localStorage.setItem('extractedData', JSON.stringify(extractedData));
        } catch (e) {
            console.error('Error updating display:', e);
        }
    }

    // Function to extract data from a single div, preserving sequence
    function extractFromDiv(div) {
        let result = '';
        const children = div.childNodes;

        children.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent.trim();
                if (text) {
                    result += (!result.endsWith(' ') ? ' ' : '') + text;
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === 'SPAN') {
                    const text = child.innerText.trim();
                    if (text) {
                        result += (!result.endsWith(' ') ? ' ' : '') + text;
                    }
                } else if (child.tagName === 'IMG') {
                    const alt = child.getAttribute('alt');
                    if (alt) {
                        result += alt;
                    }
                } else if (child.tagName === 'A' && child.getAttribute('role') === 'link') {
                    const hashtag = child.innerText.trim();
                    if (hashtag) {
                        result += (!result.endsWith(' ') ? ' ' : '') + hashtag;
                    }
                }
            }
        });

        return result.trim();
    }

    // Function to extract from all divs
    function extractAll() {
        if (window.location.pathname.startsWith('/search')) {
            const targetDivs = document.querySelectorAll('div[data-testid="tweetText"]');
            targetDivs.forEach((div) => {
                const divData = extractFromDiv(div);

                if (divData && !extractedData.includes(divData)) {
                    extractedData.push(divData);
                    updateDisplay();
                }
            });
        } else {
            console.log('Extraction skipped. Not on /search.');
        }
    }

    // Function to enable the extraction process
    function enableExtraction() {
        extractAll();
        observer = new MutationObserver(() => {
            if (window.location.pathname.startsWith('/search')) {
                extractAll();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('Extraction enabled.');
    }

    // Function to disable the extraction process
    function disableExtraction() {
        if (observer) observer.disconnect();
        console.log('Extraction disabled.');
    }

    // Monitor navigation dynamically
    function monitorNavigation() {
        if (window.location.pathname.startsWith('/search')) {
            enableExtraction();
        } else {
            disableExtraction();
        }
    }

    // Attach functionality to buttons
    clearButton.onclick = () => {
        extractedData.length = 0;
        updateDisplay();
    };

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

    // Monitor navigation dynamically using popstate and hashchange
    window.addEventListener('popstate', monitorNavigation);
    window.addEventListener('hashchange', monitorNavigation);

    // Initial check for current page
    monitorNavigation();
})();
