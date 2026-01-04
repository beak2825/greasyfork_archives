// ==UserScript==
// @name         Wykop Random Filename Uploader
// @namespace    http://tampermonkey.net/
// @icon         https://i.imgur.com/micEWu9.png
// @version      1.4
// @description  Changes uploaded file names to random numbers on Wykop (supports both click upload and drag-drop, main editor and replies)
// @author       stopbreathing
// @match        https://wykop.pl/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527933/Wykop%20Random%20Filename%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/527933/Wykop%20Random%20Filename%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate random number string
    function generateRandomNumber(length = 10) {
        let result = '';
        for(let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    // Function to create a new file with random name
    function createRandomNameFile(file) {
        const extension = file.name.split('.').pop();
        const newName = `${generateRandomNumber()}.${extension}`;

        const newFile = new File([file], newName, {
            type: file.type,
            lastModified: new Date().getTime()
        });

        console.log('File renamed from', file.name, 'to', newName);
        return newFile;
    }

    // Function to handle file selection through input
    function handleFileSelection(event) {
        const input = event.target;
        if (!input.files || !input.files.length) return;

        const file = input.files[0];
        const newFile = createRandomNameFile(file);

        // Create new FileList
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(newFile);
        input.files = dataTransfer.files;
    }

    // Function to handle drag events
    function handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Function to handle drop events
    function handleDrop(event) {
        // We need to prevent the default behavior initially
        event.preventDefault();
        event.stopPropagation();

        const files = event.dataTransfer?.files;
        if (!files || !files.length) return;

        // Create a new DataTransfer object with renamed files
        const newDataTransfer = new DataTransfer();
        for (const file of files) {
            const newFile = createRandomNameFile(file);
            newDataTransfer.items.add(newFile);
        }

        // Create a new drop event with our renamed files
        const newDropEvent = new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: newDataTransfer
        });

        // Remove our event listeners temporarily
        const editorArea = event.target.closest('.editor');
        if (editorArea) {
            editorArea.removeEventListener('drop', handleDrop, true);
            editorArea.removeEventListener('dragover', handleDragOver, true);

            // Dispatch the new event
            event.target.dispatchEvent(newDropEvent);

            // Re-add our event listeners after a short delay
            setTimeout(() => {
                editorArea.addEventListener('drop', handleDrop, true);
                editorArea.addEventListener('dragover', handleDragOver, true);
            }, 100);
        }
    }

    // Function to add visual indicator
    function addVisualIndicator(element, isDragDrop = false) {
        if (!element.querySelector('.random-filename-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'random-filename-indicator';
            indicator.style.color = 'green';
            indicator.style.fontSize = '12px';

            if (isDragDrop) {
                indicator.style.position = 'absolute';
                indicator.style.top = '0';
                indicator.style.right = '0';
                indicator.style.padding = '5px';
                indicator.textContent = 'Random filename active (drag & drop enabled)';
                element.style.position = 'relative';
            } else {
                indicator.textContent = 'Random filename active';
            }

            element.appendChild(indicator);
        }
    }

    // Function to observe DOM for file inputs and drag-drop zones
    function observeElements(mutations) {
        const addEventListeners = () => {
            // Handle file inputs
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
                if (!input.dataset.randomized) {
                    input.dataset.randomized = 'true';
                    input.addEventListener('change', handleFileSelection);
                    addVisualIndicator(input.parentElement);
                }
            });

            // Handle both main editor and reply editors
            const editorAreas = document.querySelectorAll('.editor.entry-editor, .editor.entry-comment-editor');
            editorAreas.forEach(editorArea => {
                if (!editorArea.dataset.randomizedDrop) {
                    editorArea.dataset.randomizedDrop = 'true';

                    // Add drag and drop event listeners
                    editorArea.addEventListener('dragover', handleDragOver, true);
                    editorArea.addEventListener('drop', handleDrop, true);

                    // Add visual indicator
                    addVisualIndicator(editorArea, true);
                }
            });
        };

        // Initial check
        addEventListeners();

        // Monitor for changes
        const observer = new MutationObserver((mutations) => {
            addEventListeners();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start monitoring when document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeElements);
    } else {
        observeElements();
    }

    // Also monitor for dynamic changes
    const observer = new MutationObserver(observeElements);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();