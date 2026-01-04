// ==UserScript==
// @name         Character.ai Text Highlighter and Note Taker
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Advanced text highlighting and note-taking for Character.ai with single-click and un-highlighting.
// @match        https://character.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/528916/Characterai%20Text%20Highlighter%20and%20Note%20Taker.user.js
// @updateURL https://update.greasyfork.org/scripts/528916/Characterai%20Text%20Highlighter%20and%20Note%20Taker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enhanced styling for highlights and notes
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .ca-highlight {
            background-color: yellow;
            color: black;
            cursor: pointer;
            transition: background-color 0.2s ease;
            display: inline; /* Ensure inline display for proper spacing */
            white-space: pre-wrap; /* Preserve whitespace */
        }
        .ca-highlight:hover {
            background-color: #ffff99;
        }
        .ca-note-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #1a1a1a;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            width: 350px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.5);
        }
        .ca-note-input {
            width: 100%;
            margin-bottom: 10px;
            padding: 8px;
            background-color: #2a2a2a;
            color: white;
            border: 1px solid #444;
            border-radius: 4px;
            resize: vertical;
            min-height: 100px;
        }
        .ca-note-buttons {
            display: flex;
            justify-content: space-between;
        }
        .ca-note-save {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        }
        .ca-note-cancel {
            background-color: #f44336;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
        }
        .ca-highlight-mode-indicator {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: yellow;
            color: black;
            padding: 5px 10px;
            border-radius: 4px;
            z-index: 9999;
            display: none;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .ca-note-button, .ca-unhighlight-button {
            margin-right: 10px;
            background-color: #555;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
        }
        .ca-unhighlight-button {
            background-color: #ff9800;
        }
        .ca-popup-menu {
            position: absolute;
            background-color: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 5px;
            z-index: 10001;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(styleElement);

    // Create highlight mode indicator
    const highlightModeIndicator = document.createElement('div');
    highlightModeIndicator.classList.add('ca-highlight-mode-indicator');
    highlightModeIndicator.textContent = 'Highlight Mode';
    document.body.appendChild(highlightModeIndicator);

    // State variables
    let isHighlightMode = false;
    const STORAGE_KEY = 'caNotes';

    // Utility function to get unique identifier for a word
    function getWordIdentifier(word) {
        return `highlight_${btoa(word.trim())}`;
    }

    // Save note for a word
    function saveNote(word, note) {
        const identifier = getWordIdentifier(word);
        const savedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        savedNotes[identifier] = note;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedNotes));
    }

    // Retrieve note for a word
    function getNote(word) {
        const identifier = getWordIdentifier(word);
        const savedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return savedNotes[identifier] || '';
    }

    // Create note popup
    function createNotePopup(word) {
        const popup = document.createElement('div');
        popup.classList.add('ca-note-popup');

        const textarea = document.createElement('textarea');
        textarea.classList.add('ca-note-input');
        textarea.placeholder = `Enter note for "${word}"`;
        textarea.value = getNote(word);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('ca-note-buttons');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('ca-note-save');
        saveButton.addEventListener('click', () => {
            saveNote(word, textarea.value);
            document.body.removeChild(popup);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Discard';
        cancelButton.classList.add('ca-note-cancel');
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);

        popup.appendChild(textarea);
        popup.appendChild(buttonContainer);

        return popup;
    }

    // New function to un-highlight text
    function unhighlightText(element) {
        if (element && element.classList.contains('ca-highlight')) {
            // Get the text content
            const text = element.textContent;

            // Create a text node to replace the highlighted span
            const textNode = document.createTextNode(text);

            // Replace the span with the text node
            element.parentNode.replaceChild(textNode, element);
        }
    }

    // Handle highlighting and un-highlighting with a single click
    function handleHighlightClick(e) {
        // Only work in highlight mode
        if (!isHighlightMode) return;

        // Check if clicked on an existing highlight
        if (e.target.classList && e.target.classList.contains('ca-highlight')) {
            // Un-highlight the text
            unhighlightText(e.target);
            return;
        }

        // Otherwise, create a new highlight
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (selectedText && selectedText.trim() !== '') {
            try {
                // Get the range
                const range = selection.getRangeAt(0);

                // Store the original text with spaces for note-taking
                const originalText = selectedText;

                // Create a highlight span
                const highlightSpan = document.createElement('span');
                highlightSpan.classList.add('ca-highlight');

                // Use createTextNode to preserve spaces
                highlightSpan.appendChild(document.createTextNode(selectedText));

                // Replace selection with our highlight
                range.deleteContents();
                range.insertNode(highlightSpan);

                // Clear the selection
                selection.removeAllRanges();
            } catch (error) {
                console.error('Error highlighting text:', error);
            }
        }
    }

    // Add right-click handling for highlights
    function handleHighlightRightClick(e) {
        // Check if right-clicked on a highlight
        if (e.target.classList && e.target.classList.contains('ca-highlight')) {
            e.preventDefault();

            // Get the highlighted text
            const highlightedText = e.target.textContent;

            // Create and display a popup menu for the note
            const notePopup = createNotePopup(highlightedText);
            document.body.appendChild(notePopup);
        } else {
            // Add note functionality when not in highlight mode
            if (!isHighlightMode) {
                const selection = window.getSelection();
                const selectedText = selection.toString();

                if (selectedText && selectedText.trim() !== '') {
                    e.preventDefault();

                    // Create and display a popup menu for the note
                    const notePopup = createNotePopup(selectedText);
                    document.body.appendChild(notePopup);
                }
            }
        }
    }

    // Toggle highlight mode
    function toggleHighlightMode() {
        isHighlightMode = !isHighlightMode;
        highlightModeIndicator.style.display = isHighlightMode ? 'block' : 'none';

        // Update the indicator text to show the new mode behavior
        highlightModeIndicator.textContent = isHighlightMode ?
            'Highlight Mode (Click to highlight/unhighlight, Right-click for notes)' :
            'Highlight Mode';
    }

    // Event listeners
    document.addEventListener('click', (e) => {
        // Single click for highlighting/unhighlighting when in highlight mode
        handleHighlightClick(e);
    });

    document.addEventListener('contextmenu', (e) => {
        // Right-click for adding notes to highlights
        handleHighlightRightClick(e);
    });

    document.addEventListener('keydown', (e) => {
        // Toggle highlight mode with '/'
        if (e.key === '/') {
            e.preventDefault();
            toggleHighlightMode();
        }
    });

    // Add initial message about feature
    console.log('Character.ai Text Highlighter Loaded:\n- Highlight Mode: "/" to toggle\n- While in highlight mode: click to highlight/unhighlight\n- Right-click on highlighted text to add/view notes\n- Right-click on selected text to add notes when not in highlight mode');
})();