// ==UserScript==
// @name         Global GTM Notes
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add floating notes to GTM workspace pages with URL-based detection
// @author       Vanakh Chea
// @match        https://tagmanager.google.com/*
// @grant        none
// @run-at document-idle
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535749/Global%20GTM%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/535749/Global%20GTM%20Notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[GTM Notes] Script initialized - URL check version');

    // Configuration
    const config = {
        elementId: 'gtm-workspace-notes',
        defaultText: 'Enter your notes here...',
        storageKey: 'gtmWorkspaceNotes',
        width: '200px',
        bgColor: 'rgba(128, 128, 128, 0.8)',
        textColor: 'white',
        position: {
            bottom: '70px',
            left: '20px'
        }
    };

    // Check if current URL contains /workspaces/
    function isWorkspaceUrl() {
        const isWorkspace = window.location.href.includes('/workspaces/');
        console.log(`[GTM Notes] Checking workspace URL: ${isWorkspace} (full URL: ${window.location.href})`);
        return isWorkspace;
    }

    // Create the notes element
    function createNotesElement() {
        console.log('[GTM Notes] Creating notes element');

        const notesDiv = document.createElement('div');
        notesDiv.id = config.elementId;
        notesDiv.style.position = 'fixed';
        notesDiv.style.bottom = config.position.bottom;
        notesDiv.style.left = config.position.left;
        notesDiv.style.width = config.width;
        notesDiv.style.backgroundColor = config.bgColor;
        notesDiv.style.color = config.textColor;
        notesDiv.style.padding = '10px';
        notesDiv.style.borderRadius = '5px';
        notesDiv.style.zIndex = '9999';
        notesDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

        // Make it resizable vertically
        notesDiv.style.resize = 'vertical';
        notesDiv.style.overflow = 'auto';

        // Create textarea for editing
        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.minHeight = '30vh';// 500px
        textarea.style.backgroundColor = 'transparent';
        textarea.style.color = 'inherit';
        textarea.style.border = '1px solid rgba(255,255,255,0.3)';
        textarea.style.borderRadius = '3px';
        textarea.style.padding = '5px';
        textarea.style.boxSizing = 'border-box';

        // Load saved notes or use default
        const savedNotes = localStorage.getItem(config.storageKey);
        console.log(`[GTM Notes] Loading notes from storage: ${savedNotes ? 'found' : 'not found'}`);
        textarea.value = savedNotes || config.defaultText;

        // Save on change
        textarea.addEventListener('change', () => {
            console.log('[GTM Notes] Notes changed, saving to localStorage');
            localStorage.setItem(config.storageKey, textarea.value);
        });

        notesDiv.appendChild(textarea);
        console.log('[GTM Notes] Notes element created successfully');
        return notesDiv;
    }

    // Main function to handle page changes
    function handlePageChange() {
        console.log('[GTM Notes] Handling page change');

        if (isWorkspaceUrl()) {
            console.log('[GTM Notes] On workspace URL - checking for notes element');

            // Check if notes element already exists
            if (!document.getElementById(config.elementId)) {
                console.log('[GTM Notes] Notes element not found - creating new one');
                document.body.appendChild(createNotesElement());
                console.log('[GTM Notes] Notes element added to DOM');
            } else {
                console.log('[GTM Notes] Notes element already exists');
            }
        } else {
            console.log('[GTM Notes] Not on workspace URL - removing notes if present');

            // Remove notes element if not on workspace page
            const existingNotes = document.getElementById(config.elementId);
            if (existingNotes) {
                existingNotes.remove();
                console.log('[GTM Notes] Existing notes element removed');
            } else {
                console.log('[GTM Notes] No notes element to remove');
            }
        }
    }

    // Initial check
    console.log('[GTM Notes] Running initial URL check');
    handlePageChange();

    // Monitor for history changes (SPA navigation)
    console.log('[GTM Notes] Setting up MutationObserver for SPA navigation');
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            console.log(`[GTM Notes] URL changed from ${lastUrl} to ${currentUrl}`);
            lastUrl = currentUrl;
            handlePageChange();
        }
    }).observe(document, {subtree: true, childList: true});

    console.log('[GTM Notes] Setup complete - monitoring URL changes');
})();