// ==UserScript==
// @name         Path Notes
// @namespace    Violentmonkey Scripts
// @version      2.0
// @description  Add and save notes for different website paths
// @author       maanimis
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530124/Path%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/530124/Path%20Notes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        notesPanelClass: 'path-notes-container',
        overlayClass: 'path-notes-overlay',
        textareaClass: 'path-notes-textarea',
        toggleBtnClass: 'path-notes-toggle',
        storageKey: 'pathNotes',
        animationDuration: 300, // ms
        debounceInterval: 500, // ms for autosave debounce
    };
    
    // DOM Elements (initialized later)
    let elements = {
        container: null,
        overlay: null,
        textarea: null,
        toggleBtn: null
    };
    
    // State management
    const state = {
        isVisible: false,
        currentPath: window.location.pathname + window.location.search,
        notes: {},
        saveTimeout: null
    };
    
    // Styles
    const styles = `
        .${CONFIG.overlayClass} {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(3px);
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity ${CONFIG.animationDuration}ms ease;
        }
        
        .${CONFIG.notesPanelClass} {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            background-color: #ffffff;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border-radius: 12px;
            padding: 20px;
            z-index: 10000;
            max-width: 500px;
            width: 90%;
            display: flex;
            flex-direction: column;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            opacity: 0;
            visibility: hidden;
            transition: opacity ${CONFIG.animationDuration}ms ease, 
                        transform ${CONFIG.animationDuration}ms ease;
        }
        
        .${CONFIG.notesPanelClass}.visible {
            opacity: 1;
            visibility: visible;
            transform: translate(-50%, -50%) scale(1);
        }
        
        .${CONFIG.overlayClass}.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .path-notes-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        
        .path-notes-title {
            margin: 0;
            color: #333;
            font-size: 18px;
            font-weight: 600;
        }
        
        .path-notes-content {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        
        .path-notes-path {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            word-break: break-all;
        }
        
        .${CONFIG.textareaClass} {
            width: 100%;
            min-height: 180px;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            resize: vertical;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
            transition: border-color 0.2s;
        }
        
        .${CONFIG.textareaClass}:focus {
            outline: none;
            border-color: #4d90fe;
            box-shadow: 0 0 0 2px rgba(77, 144, 254, 0.2);
        }
        
        .${CONFIG.toggleBtnClass} {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #4d90fe;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            transition: background-color 0.2s, transform 0.2s;
        }
        
        .${CONFIG.toggleBtnClass}:hover {
            background-color: #3a7be0;
            transform: scale(1.05);
        }
        
        @media (max-width: 600px) {
            .${CONFIG.notesPanelClass} {
                width: 85%;
                max-width: none;
            }
            
            .${CONFIG.textareaClass} {
                min-height: 140px;
            }
        }
    `;
    
    // Load notes from localStorage
    function loadNotes() {
        try {
            state.notes = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {};
        } catch (e) {
            state.notes = {};
        }
        return state.notes;
    }
    
    // Save notes to localStorage
    function saveNotes() {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(state.notes));
    }
    
    // Save current note with debounce
    function saveCurrentNote(text) {
        clearTimeout(state.saveTimeout);
        state.saveTimeout = setTimeout(() => {
            state.notes[state.currentPath] = text;
            saveNotes();
        }, CONFIG.debounceInterval);
    }
    
    // Show/hide the notes panel
    function toggleNotesPanel() {
        state.isVisible = !state.isVisible;
        
        if (state.isVisible) {
            elements.container.classList.add('visible');
            elements.overlay.classList.add('visible');
            elements.textarea.focus();
        } else {
            elements.container.classList.remove('visible');
            elements.overlay.classList.remove('visible');
        }
    }
    
    // Create UI elements
    function createUI() {
        // Add styles
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
        
        // Create overlay for background blur
        const overlay = document.createElement('div');
        overlay.className = CONFIG.overlayClass;
        document.body.appendChild(overlay);
        
        // Create notes container
        const container = document.createElement('div');
        container.className = CONFIG.notesPanelClass;
        
        // Load stored notes
        loadNotes();
        const currentNote = state.notes[state.currentPath] || '';
        
        // Create notes UI
        container.innerHTML = `
            <div class="path-notes-header">
                <h3 class="path-notes-title">Path Notes</h3>
            </div>
            <div class="path-notes-content">
                <div class="path-notes-path">Current path: ${state.currentPath}</div>
                <textarea class="${CONFIG.textareaClass}" placeholder="Add your notes for this page...">${currentNote}</textarea>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Create toggle button
        const toggleButton = document.createElement('div');
        toggleButton.className = CONFIG.toggleBtnClass;
        toggleButton.innerHTML = '📝';
        toggleButton.title = 'Toggle Path Notes';
        document.body.appendChild(toggleButton);
        
        // Store elements references
        elements.container = container;
        elements.overlay = overlay;
        elements.textarea = container.querySelector(`.${CONFIG.textareaClass}`);
        elements.toggleBtn = toggleButton;
        
        // Setup event listeners
        setupEventListeners();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Toggle button click
        elements.toggleBtn.addEventListener('click', toggleNotesPanel);
        
        // Clicking overlay closes panel
        elements.overlay.addEventListener('click', () => {
            if (state.isVisible) {
                toggleNotesPanel();
            }
        });
        
        // Auto-save on typing
        elements.textarea.addEventListener('input', (e) => {
            saveCurrentNote(e.target.value);
        });
    }
    
    // Register menu command
    function registerMenuCommand() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('Open Path Notes', toggleNotesPanel);
        }
    }
    
    // Initialize the userscript
    function initialize() {
        createUI();
        registerMenuCommand();
    }
    
    // Start when the page is fully loaded
    window.addEventListener('load', initialize);
})();