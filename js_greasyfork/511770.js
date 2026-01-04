// ==UserScript==
// @name       THE HIGHLIGHTER
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Logs and highlights entries
// @author       Moxsee
// @match        https://www.neopets.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/511770/THE%20HIGHLIGHTER.user.js
// @updateURL https://update.greasyfork.org/scripts/511770/THE%20HIGHLIGHTER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const containerId = 'neopets-text-container';
    const entryListId = 'entry-list';

    // Create the container element
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.left = '20px';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    container.style.border = '1px solid black';
    container.style.padding = '10px';
    container.style.zIndex = '9999';
    container.id = containerId;

    // Text input for adding entries
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Enter text to highlight...';
    textInput.style.width = '180px';

    // Button to add the text to the list
    const addButton = document.createElement('button');
    addButton.innerText = 'Add';

    // Button to clear the list
    const clearButton = document.createElement('button');
    clearButton.innerText = 'Clear';

    // Button to clear the last entry
    const clearLastButton = document.createElement('button');
    clearLastButton.innerText = 'Clear Last Entry';

    // List to display the entries
    const entryList = document.createElement('div');
    entryList.id = entryListId;
    entryList.style.maxHeight = '150px';
    entryList.style.overflowY = 'auto';

    // Append elements to the container
    container.appendChild(textInput);

    // Create a div to hold the buttons, and append it to the container
    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(clearButton);
    buttonContainer.appendChild(clearLastButton);
    container.appendChild(buttonContainer);

    container.appendChild(entryList);
    document.body.appendChild(container);

    // Load entries from storage
    let entries = GM_getValue('entries', []);
    entries.forEach(entry => addEntryToList(entry));
    highlightText(entries);

    // Add entry to the list
    function addEntryToList(entry) {
        const listItem = document.createElement('div');
        listItem.innerText = entry;
        entryList.appendChild(listItem);
    }

    // Highlight text function
    function highlightText(entries) {
        // Remove any previous highlights
        const highlightedElements = document.querySelectorAll('span.highlighted');
        highlightedElements.forEach(el => {
            const parent = el.parentNode;
            while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
        });

        // If there are no entries, return early
        if (!entries.length) {
            return;
        }

        // Create a single regex pattern from all entries
        const regexPattern = entries.map(entry => entry.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&')).join('|');
        const regex = new RegExp(`(${regexPattern})`, 'gi');

        // Function to replace text nodes with highlighted spans
        function replaceTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const originalText = node.nodeValue;
                const newText = originalText.replace(regex, `<span class="highlighted" style="background-color: yellow;">$1</span>`);
                if (newText !== originalText) {
                    const newNode = document.createElement('span');
                    newNode.innerHTML = newText;
                    node.parentNode.replaceChild(newNode, node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                let child = node.firstChild;
                while (child) {
                    const nextChild = child.nextSibling;
                    replaceTextNodes(child);
                    child = nextChild;
                }
            }
        }

        // Start replacing text nodes from the body
        replaceTextNodes(document.body);
    }

    // Add button click event
    addButton.addEventListener('click', function() {
        const text = textInput.value.trim();
        if (text && !entries.includes(text)) {
            entries.push(text);
            GM_setValue('entries', entries);
            addEntryToList(text);
            highlightText(entries);
            textInput.value = '';
        }
    });

    // Clear button click event
    clearButton.addEventListener('click', function() {
        entries = [];
        GM_deleteValue('entries');
        entryList.innerHTML = '';
        highlightText([]);
    });

    // Clear last entry button click event
    clearLastButton.addEventListener('click', function() {
        if (entries.length > 0) {
            entries.pop(); // Remove the last entry
            GM_setValue('entries', entries); // Update the stored entries
            entryList.innerHTML = ''; // Clear the display
            entries.forEach(entry => addEntryToList(entry)); // Re-add remaining entries
            highlightText(entries); // Update highlights
        }
    });
})();