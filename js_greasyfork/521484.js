// ==UserScript==
// @name         EazyHTMLTextEdit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to edit text content of any HTML element (Toggle with Ctrl+Shift+E)
// @author       404
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521484/EazyHTMLTextEdit.user.js
// @updateURL https://update.greasyfork.org/scripts/521484/EazyHTMLTextEdit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '✏️ Edit Mode';
    toggleButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        transition: opacity 0.3s ease;
    `;

    // Add button to page
    document.body.appendChild(toggleButton);

    let isEditMode = false;
    let selectedElement = null;
    let originalBackground = '';
    let isButtonVisible = false;

    // Set initial button state
    toggleButton.style.opacity = '0';
    toggleButton.style.pointerEvents = 'none';

    // Toggle button visibility with keyboard shortcut (Ctrl+Shift+E)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
            e.preventDefault();
            isButtonVisible = !isButtonVisible;
            toggleButton.style.opacity = isButtonVisible ? '1' : '0';
            toggleButton.style.pointerEvents = isButtonVisible ? 'auto' : 'none';
        }
    });

    // Toggle edit mode
    toggleButton.addEventListener('click', () => {
        isEditMode = !isEditMode;
        toggleButton.style.backgroundColor = isEditMode ? '#f44336' : '#4CAF50';
        toggleButton.textContent = isEditMode ? '✏️ Exit Edit Mode' : '✏️ Edit Mode';

        if (!isEditMode && selectedElement) {
            selectedElement.style.backgroundColor = originalBackground;
            selectedElement = null;
        }
    });

    // Handle mouseover highlighting
    document.addEventListener('mouseover', (e) => {
        if (!isEditMode) return;

        if (e.target !== toggleButton && e.target !== selectedElement) {
            e.target.style.outline = '2px solid #4CAF50';
            e.stopPropagation();
        }
    });

    // Remove highlight on mouseout
    document.addEventListener('mouseout', (e) => {
        if (!isEditMode) return;

        if (e.target !== toggleButton && e.target !== selectedElement) {
            e.target.style.outline = '';
            e.stopPropagation();
        }
    });

    // Handle element selection and text editing
    document.addEventListener('click', (e) => {
        if (!isEditMode || e.target === toggleButton) return;

        e.preventDefault();
        e.stopPropagation();

        // Reset previous selection if exists
        if (selectedElement) {
            selectedElement.style.backgroundColor = originalBackground;
        }

        selectedElement = e.target;
        originalBackground = getComputedStyle(selectedElement).backgroundColor;
        selectedElement.style.backgroundColor = '#fff8e1';

        // Create input for editing
        const originalText = selectedElement.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        input.style.cssText = `
            width: ${Math.max(selectedElement.offsetWidth, 100)}px;
            padding: 8px;
            border: 2px solid #4CAF50;
            border-radius: 4px;
            background-color: #ffffff;
            color: #000000;
            font-size: 16px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            margin: 2px;
            z-index: 10001;
            position: relative;
        `;

        // Replace element content with input
        selectedElement.textContent = '';
        selectedElement.appendChild(input);
        input.focus();

        // Handle input completion
        const finishEditing = () => {
            const newText = input.value;
            selectedElement.removeChild(input);
            selectedElement.textContent = newText;
            selectedElement.style.backgroundColor = originalBackground;
            selectedElement = null;
        };

        input.addEventListener('blur', finishEditing);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                finishEditing();
            }
        });
    });
})();
