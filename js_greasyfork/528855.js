// ==UserScript==
// @name         Claude Message Copier (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Efficiently copies Claude.ai messages with improved performance, better UI, and enhanced field management
// @match        https://claude.ai/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528855/Claude%20Message%20Copier%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528855/Claude%20Message%20Copier%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the script is running in the main document
    if (window.self !== window.top) {
        return; // Exit if inside an iframe
    }

    // Add CSS with GM_addStyle for better performance and organization
    GM_addStyle(`
        .cmsg-control-panel {
            position: fixed;
            top: 10px;
            right: 320px;
            background-color: white;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 10000;
            color: black;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .cmsg-field {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            height: 200px;
            overflow: auto;
            background-color: white;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            color: black;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            resize: both;
            direction: rtl;
            display: none;
            border-radius: 5px;
        }

        .cmsg-text-container {
            direction: ltr;
            width: 100%;
            height: calc(100% - 30px);
            overflow: auto;
        }

        .cmsg-button {
            padding: 5px 10px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 3px;
            cursor: pointer;
            color: black;
            transition: background-color 0.2s;
        }

        .cmsg-button:hover {
            background-color: #e0e0e0;
        }

        .cmsg-copy-button {
            position: absolute;
            top: 5px;
            right: 5px;
        }

        .cmsg-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10001;
            animation: fadeInOut 3s ease-in-out;
        }

        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            10%, 90% { opacity: 1; }
        }

        .cmsg-nav-arrow {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 3px;
            cursor: pointer;
            padding: 5px 10px;
            margin: 0 5px;
            color: black;
            transition: background-color 0.2s;
        }

        .cmsg-nav-arrow:hover {
            background-color: #e0e0e0;
        }

        .cmsg-field-container {
            display: flex;
            align-items: center;
        }

    `);

    // Create control panel
    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'cmsg-control-panel';
        document.body.appendChild(controlPanel);

        // Create navigation arrows
        const prevFieldArrow = createButton('←');
        prevFieldArrow.className = 'cmsg-nav-arrow cmsg-prev-field';

        const nextFieldArrow = createButton('→');
        nextFieldArrow.className = 'cmsg-nav-arrow cmsg-next-field';

        // Create field container for input and navigation
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'cmsg-field-container';

        // Add elements to the control panel
        const toggleButton = createToggleSwitch('toggle-recording', 'Enable Recording', true);
        controlPanel.appendChild(toggleButton.container);

        fieldContainer.appendChild(prevFieldArrow);

        const fieldInput = createNumberInput(1, 1, 999, 50);
        fieldContainer.appendChild(fieldInput);

        fieldContainer.appendChild(nextFieldArrow);
        controlPanel.appendChild(fieldContainer);

        // Existing buttons
        const fieldButton = createButton('Switch');
        const clearButton = createButton('Clear');
        controlPanel.appendChild(fieldButton);
        controlPanel.appendChild(clearButton);

        // Minimize/maximize button (existing code)
        const minimizeButton = createButton('+');
        minimizeButton.style.marginLeft = 'auto';
        minimizeButton.style.width = '24px';
        minimizeButton.style.textAlign = 'center';
        controlPanel.appendChild(minimizeButton);

        let minimized = true;

        const elements = controlPanel.querySelectorAll('*:not(' + minimizeButton.tagName + ')');
        elements.forEach(el => el.style.display = 'none');

        minimizeButton.addEventListener('click', () => {
            const elements = controlPanel.querySelectorAll('*:not(' + minimizeButton.tagName + ')');
            if (minimized) {
                elements.forEach(el => el.style.display = '');
                minimizeButton.textContent = '_';
            } else {
                elements.forEach(el => el.style.display = 'none');
                minimizeButton.textContent = '+';
            }
            minimized = !minimized;
        });

        prevFieldArrow.addEventListener('click', () => {
            const currentFieldNum = parseInt(fieldInput.value);
            if (currentFieldNum === 1) {
                showPopup('Already at the first field');
                return;
            }

            const prevField = currentFieldNum - 1;
            switchField(prevField);
            fieldInput.value = prevField;
        });

        nextFieldArrow.addEventListener('click', () => {
            const currentFieldNum = parseInt(fieldInput.value);
            const nextField = currentFieldNum + 1;
            switchField(nextField);
            fieldInput.value = nextField;
        });

        // Existing event listeners
        fieldButton.addEventListener('click', () => {
            const newField = parseInt(fieldInput.value);
            if (newField >= 1) switchField(newField);
        });

        clearButton.addEventListener('click', clearCurrentField);

        return {
            controlPanel,
            toggleButton,
            fieldInput,
            minimizeButton,
            prevFieldArrow,
            nextFieldArrow
        };
    }


    const {
        controlPanel,
        toggleButton,
        fieldInput,
        minimizeButton,
        prevFieldArrow,
        nextFieldArrow
    } = createControlPanel();


    // Fields management with improved memory management
    const fields = {};
    let currentField = 1;
    let lastContent = '';
    let lastContentHash = '';
    let copyInterval;

    // Create field with better organization
    function createField(number) {
        const field = document.createElement('div');
        field.id = `secondary-field-${number}`;
        field.className = 'cmsg-field';
        document.body.appendChild(field);

        const textContainer = document.createElement('div');
        textContainer.className = 'cmsg-text-container';
        field.appendChild(textContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'position: absolute; top: 5px; right: 5px; display: flex; gap: 5px;';
        field.appendChild(buttonContainer);

        const copyButton = createButton('Copy');
        copyButton.className = 'cmsg-button cmsg-copy-button';
        buttonContainer.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
            copyToClipboard(textContainer.innerHTML);
        });

        return { field, textContainer };
    }

    // Initialize first field
    fields[currentField] = createField(currentField);
    fields[currentField].field.style.display = 'block';

    // Simple string hash function for better comparison
    function hashString(str) {
        let hash = 0;
        if (str.length === 0) return hash;

        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return hash;
    }

    // Optimized content copying with better performance
    function copyContent() {
        if (!toggleButton.input.checked) return;

        const messages = document.querySelectorAll('.font-claude-message');
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        const newContent = lastMessage.innerHTML;
        const newContentHash = hashString(newContent);

        if (newContentHash !== lastContentHash) {
            if (isSignificantChange(lastContent, newContent)) {
                const existingFieldNumber = findExistingField(newContent);
                if (existingFieldNumber !== null) {
                    switchField(existingFieldNumber);
                    showPopup(`Switched to existing field ${existingFieldNumber}`);
                } else {
                    const newFieldNumber = Object.keys(fields).length + 1;
                    fields[newFieldNumber] = createField(newFieldNumber);
                    switchField(newFieldNumber);
                    showPopup(`Created new field ${newFieldNumber}`);
                }
                fieldInput.value = currentField;
            }

            fields[currentField].textContainer.innerHTML = newContent;
            lastContent = newContent;
            lastContentHash = newContentHash;
        }
    }

    // More efficient significant change detection
    function isSignificantChange(oldContent, newContent) {
        const numSamples = 10;
        const sampleLength = 20;
        const minContentLength = numSamples * sampleLength;
        const maxDifferentSamples = 2;

        // If old content is too short, consider any change as significant
        if (oldContent.length < minContentLength) {
            return false;
        }

        const maxPosition = Math.min(oldContent.length, newContent.length) - sampleLength;
        const effectiveMaxPosition = Math.max(maxPosition, 1);

        let differentSamples = 0;
        const usedPositions = new Set();

        for (let i = 0; i < numSamples; i++) {
            let position;
            do {
                position = Math.floor(Math.random() * effectiveMaxPosition);
            } while (usedPositions.has(position));
            usedPositions.add(position);

            if (characterByCharacterCompare(oldContent, newContent, position, position + sampleLength)) {
                differentSamples++;
                if (differentSamples > maxDifferentSamples) {
                    return true;
                }
            }
        }

        return false;
    }

    function characterByCharacterCompare(str1, str2, start, end) {
        for (let i = start; i < end; i++) {
            if (str1[i] !== str2[i]) {
                return true; // Different
            }
        }
        return false; // Same
    }

    // Find existing field with the same content
    function findExistingField(content) {
        for (let fieldNumber in fields) {
            if (fieldNumber != currentField && fields[fieldNumber].textContainer.innerHTML === content) {
                return parseInt(fieldNumber);
            }
        }
        return null;
    }

    // Improved popup with animation
    function showPopup(message) {
        const popup = document.createElement('div');
        popup.textContent = message;
        popup.className = 'cmsg-popup';
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 3000);
    }

    // Set interval for continuous recording with adaptive timing
    function startCopyInterval() {
        stopCopyInterval();
        copyInterval = setInterval(copyContent, 200);
    }

    function stopCopyInterval() {
        if (copyInterval) {
            clearInterval(copyInterval);
        }
    }

    // Start recording on load
    startCopyInterval();

    // Helper functions for clipboard operations
    function copyToClipboard(html) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        const textContent = tempElement.textContent || tempElement.innerText || '';

        navigator.clipboard.writeText(textContent).then(() => {
            showPopup('Content copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showPopup('Failed to copy content');
        });
    }

    function switchField(newField) {
        Object.values(fields).forEach(f => f.field.style.display = 'none');
        if (!fields[newField]) {
            fields[newField] = createField(newField);
        }
        fields[newField].field.style.display = 'block';
        currentField = newField;
        fieldInput.value = newField;
    }

    function clearCurrentField() {
        if (fields[currentField]) {
            fields[currentField].textContainer.innerHTML = '';
            lastContent = '';
            lastContentHash = '';
            showPopup(`Cleared field ${currentField}`);
        }
    }

    // UI helper functions
    function createToggleSwitch(id, labelText, defaultChecked = false) {
        const container = document.createElement('label');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '5px';
        container.style.cursor = 'pointer';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = id;
        input.checked = defaultChecked;

        const span = document.createElement('span');
        span.textContent = labelText;
        span.style.color = 'black';

        container.appendChild(input);
        container.appendChild(span);

        return { container, input };
    }

    function createNumberInput(value, min, max, width) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = min;
        input.max = max;
        input.value = value;
        input.style.width = width + 'px';
        input.style.color = 'black';
        input.style.padding = '5px';
        input.style.borderRadius = '3px';
        input.style.border = '1px solid #ccc';

        return input;
    }

    function createButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'cmsg-button';

        return button;
    }

    // Event listeners
    fieldButton.addEventListener('click', () => {
        const newField = parseInt(fieldInput.value);
        if (newField >= 1) switchField(newField);
    });

    fieldInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const newField = parseInt(fieldInput.value);
            if (newField >= 1) switchField(newField);
        }
    });

    clearButton.addEventListener('click', clearCurrentField);

    // Toggle recording on checkbox change
    toggleButton.input.addEventListener('change', () => {
        if (toggleButton.input.checked) {
            startCopyInterval();
        } else {
            stopCopyInterval();
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt+C to copy current field
        if (e.altKey && e.key === 'c') {
            copyToClipboard(fields[currentField].textContainer.innerHTML);
        }

        // Alt+number to switch fields (1-9)
        if (e.altKey && !isNaN(parseInt(e.key)) && parseInt(e.key) >= 1 && parseInt(e.key) <= 9) {
            switchField(parseInt(e.key));
        }

        // Alt+X to clear current field
        if (e.altKey && e.key === 'x') {
            clearCurrentField();
        }
    });

    // Cleanup on page unload to prevent memory leaks
    window.addEventListener('beforeunload', () => {
        stopCopyInterval();
    });
})();