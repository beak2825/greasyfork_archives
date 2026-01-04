// ==UserScript==
// @name         高亮文本功能
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Highlights specific text items entered into a panel on the current page.
// @author       Your Name (or keep anonymous)
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533236/%E9%AB%98%E4%BA%AE%E6%96%87%E6%9C%AC%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/533236/%E9%AB%98%E4%BA%AE%E6%96%87%E6%9C%AC%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const HIGHLIGHT_CLASS = 'gm-highlighted-text-'; // Base class name
    const PANEL_ID = 'gm-highlighter-panel-';
    const TEXTAREA_ID = 'gm-highlighter-textarea-';
    const HIGHLIGHT_BUTTON_ID = 'gm-highlight-button-';
    const CLEAR_BUTTON_ID = 'gm-clear-highlight-button-';
    const TOGGLE_BUTTON_ID = 'gm-toggle-highlight-panel-';

    // Generate unique IDs for this instance to avoid conflicts if script runs multiple times somehow
    const instanceId = Math.random().toString(36).substring(7);
    const highlightClassName = HIGHLIGHT_CLASS + instanceId;
    const panelId = PANEL_ID + instanceId;
    const textareaId = TEXTAREA_ID + instanceId;
    const highlightButtonId = HIGHLIGHT_BUTTON_ID + instanceId;
    const clearButtonId = CLEAR_BUTTON_ID + instanceId;
    const toggleButtonId = TOGGLE_BUTTON_ID + instanceId;

    // --- Styling ---
    GM_addStyle(`
        #${panelId} {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            min-width: 200px;
            max-width: 300px;
            font-family: sans-serif;
            font-size: 12px;
            transition: transform 0.3s ease-out;
        }
        #${panelId}.hidden {
             transform: translateX(calc(100% + 15px)); /* Slide out */
        }
        #${panelId} textarea {
            width: 95%;
            min-height: 80px;
            max-height: 200px; /* Limit growth */
            margin-bottom: 5px;
            border: 1px solid #ccc;
            font-size: 11px;
            padding: 3px;
            display: block;
        }
        #${panelId} button {
            padding: 4px 8px;
            margin-right: 5px;
            margin-top: 5px;
            cursor: pointer;
            border: 1px solid #aaa;
            background-color: #e0e0e0;
            font-size: 11px;
        }
         #${panelId} button:hover {
             background-color: #d0d0d0;
         }
        .${highlightClassName} {
            background-color: yellow !important;
            color: black !important;
            padding: 0.1em 0; /* Add slight vertical padding */
            margin: -0.1em 0; /* Counteract padding for layout */
            border-radius: 2px;
            font-weight: bold; /* Make it stand out */
        }
        #${toggleButtonId} {
            position: fixed;
            top: 10px;
            right: 10px; /* Initially aligned with the panel */
            z-index: 10000; /* Above the panel when hidden */
            padding: 5px;
            font-size: 10px;
            cursor: pointer;
            background-color: #ddd;
            border: 1px solid #aaa;
            border-right: none;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
        }
    `);

    // --- Create UI Panel ---
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">Highlighter</div>
        <textarea id="${textareaId}" placeholder="Paste items to highlight here (one per line)..."></textarea>
        <button id="${highlightButtonId}">Highlight</button>
        <button id="${clearButtonId}">Clear Highlights</button>
    `;
    document.body.appendChild(panel);

    // --- Create Toggle Button ---
    const toggleButton = document.createElement('button');
    toggleButton.id = toggleButtonId;
    toggleButton.textContent = '>'; // Initially pointing left, meaning panel is visible
    toggleButton.title = 'Toggle Highlighter Panel';
    document.body.appendChild(toggleButton);

    // --- Get UI Elements ---
    const textarea = document.getElementById(textareaId);
    const highlightButton = document.getElementById(highlightButtonId);
    const clearButton = document.getElementById(clearButtonId);

    // --- Load saved items ---
    textarea.value = GM_getValue('highlightItems', '');

    // --- Event Listeners ---
    highlightButton.addEventListener('click', highlightItems);
    clearButton.addEventListener('click', clearHighlights);
    toggleButton.addEventListener('click', togglePanel);

    // Save items when text area changes (optional, saves automatically)
    textarea.addEventListener('input', () => {
        GM_setValue('highlightItems', textarea.value);
    });


    // --- Panel Toggle Logic ---
     function togglePanel() {
         panel.classList.toggle('hidden');
         if (panel.classList.contains('hidden')) {
             toggleButton.textContent = '<'; // Pointing right, meaning panel is hidden
             toggleButton.style.right = '0px'; // Move toggle button to edge
         } else {
             toggleButton.textContent = '>'; // Pointing left, meaning panel is visible
             toggleButton.style.right = '10px'; // Align with panel again
         }
     }

    // --- Highlighting Logic ---
    function highlightItems() {
        clearHighlights(); // Clear previous highlights first

        const itemsRaw = textarea.value;
        const itemsToHighlight = itemsRaw
            .split('\n')
            .map(item => item.trim()) // Remove leading/trailing whitespace
            .filter(item => item !== ''); // Remove empty lines

        if (itemsToHighlight.length === 0) {
            console.log("Highlighter: No items to highlight.");
            return;
        }

        console.log("Highlighter: Highlighting items:", itemsToHighlight);

        // Use TreeWalker to efficiently find all text nodes
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            { // Filter function
                acceptNode: function(node) {
                    // Skip nodes within the script's own panel, script tags, style tags, and empty text nodes
                    if (node.parentElement.closest(`#${panelId}`) ||
                        node.parentElement.closest('script') ||
                        node.parentElement.closest('style') ||
                        !/\S/.test(node.nodeValue) || // Skip nodes with only whitespace
                        node.parentElement.classList.contains(highlightClassName)) { // Skip already highlighted nodes' text content
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        let node;
        const nodesToProcess = [];
        while (node = walker.nextNode()) {
             nodesToProcess.push(node);
        }

        // Process nodes after finding them all to avoid issues with modifying the DOM while iterating
        nodesToProcess.forEach(node => {
            let nodeText = node.nodeValue;
            let parent = node.parentNode;
            let currentIdx = 0; // Keep track of position in the original node text

            itemsToHighlight.forEach(item => {
                 // Simple case-sensitive search
                 // For case-insensitive, convert both nodeText and item to lower case for searching
                 // but use the original item text when highlighting.
                let itemIndex = nodeText.indexOf(item, currentIdx);

                while(itemIndex !== -1) {
                    // Found the item
                    const beforeText = nodeText.substring(currentIdx, itemIndex);
                    const matchedText = nodeText.substring(itemIndex, itemIndex + item.length);

                     // Create text node for text before the match
                    if (beforeText.length > 0) {
                        parent.insertBefore(document.createTextNode(beforeText), node);
                    }

                    // Create span for the highlighted match
                    const span = document.createElement('span');
                    span.className = highlightClassName;
                    span.textContent = matchedText;
                    parent.insertBefore(span, node);

                    // Update the remaining text in the original node
                    currentIdx = itemIndex + item.length;

                    // Find next occurrence in the *remaining* part of the original text concept
                    // Re-search from the updated currentIdx
                    itemIndex = nodeText.indexOf(item, currentIdx);
                }
            });

            // If any replacements happened (currentIdx > 0), add the remaining text after the last match
            if (currentIdx > 0) {
                 const afterText = nodeText.substring(currentIdx);
                 if(afterText.length > 0) {
                    parent.insertBefore(document.createTextNode(afterText), node);
                 }
                 // Remove the original text node as it has been fully replaced
                 parent.removeChild(node);
            }
        });

        console.log("Highlighter: Highlighting complete.");
    }


    // --- Clear Highlights Logic ---
    function clearHighlights() {
        const highlightedSpans = document.querySelectorAll(`span.${highlightClassName}`);
        console.log(`Highlighter: Clearing ${highlightedSpans.length} highlights.`);

        highlightedSpans.forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                // Replace the span with its text content
                const textNode = document.createTextNode(span.textContent);
                parent.insertBefore(textNode, span);
                parent.removeChild(span);
                // Normalize adjacent text nodes (merge them)
                parent.normalize();
            }
        });
         console.log("Highlighter: Clearing complete.");
    }

})();