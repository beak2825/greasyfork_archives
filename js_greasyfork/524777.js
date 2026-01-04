// ==UserScript==
// @name         Professional Website Notes Manager
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Professional notes manager with editable URLs, modern interface, and quick delete functionality
// @author       Byakuran
// @match        https://*/*
// @require      https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/524777/Professional%20Website%20Notes%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/524777/Professional%20Website%20Notes%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the script is running in the main document
    if (window.self !== window.top) {
        return; // Exit if inside an iframe
    }

    const md = markdownit({ breaks: true, linkify: true });

    let changeLog = `
Changes from 0.8 → 0.9:
- Script only in main document
- Non-colour option re-created
- Scrolling of complete note, or only text inside
- Removed linkify and implemented proper markdown rendering
- Added merging without duplicates
- Improved updateNote function
- Added caching for compiled regex patterns
- Significantly improved search functionality with caching and max result limits
- Improved CSS managing
- Improved pattern matching for speed
- Removed duplicate search
- Better limit reached functionality for searching
- Improved caching for patterns (limited to 10k entries)
- Fixed escape key listener cleanup when closing modal
- Added alert for duplicate shortcuts
- Added limiting amount of notes shown per page

Changes from 0.9.0 → 0.9.1:
- Added Note IDs for importing and easier merging
- Added non-intrusive notifications for saving/updating/deleting

Planned for 0.10:
- Markdown Preview with split-pane view or Preview button
`;

    //changing allows for fixing settings keys
    let scriptVersion = '0.9.1'

    const defaultOptions = {
        version: scriptVersion,
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        addTimestampToTitle: false,
        showUrlLinksInNotesList: true,
        autoBackup: true,
        scrollContentOnly: false,
        maxSearchResults: 50,
        maxPatternsPerPage: 50,
        shortcuts: {
            newNote: { ctrlKey: true, shiftKey: true, key: 'S' },
            currentPageNotes: { ctrlKey: true, shiftKey: true, key: 'C' },
            allNotes: { ctrlKey: true, shiftKey: true, key: 'L' },
            showOptions: { ctrlKey: true, altKey: true, key: 'O' }
        }
    };

    let options = checkAndUpdateOptions();
    GM_setValue('options', options);

    function checkAndUpdateOptions() {
        let currentOptions;
        try {
            currentOptions = GM_getValue('options', defaultOptions);
        } catch (error) {
            console.error('Error loading options, resetting to defaults:', error);
            return defaultOptions;
        }

        // If options is not an object for some reason
        if (!currentOptions || typeof currentOptions !== 'object') {
            console.warn('Invalid options found, resetting to defaults');
            return defaultOptions;
        }

        // Check if the version has changed or if it doesn't exist
        if (!currentOptions.version || currentOptions.version !== defaultOptions.version) {
            // Version has changed, update options
            for (let key in defaultOptions) {
                if (!(key in currentOptions)) {
                    currentOptions[key] = defaultOptions[key];
                }
            }

            // Update nested objects (shortcuts, possibly more later)
            if (!currentOptions.shortcuts || typeof currentOptions.shortcuts !== 'object') {
                currentOptions.shortcuts = defaultOptions.shortcuts;
            } else {
                for (let key in defaultOptions.shortcuts) {
                    if (!(key in currentOptions.shortcuts)) {
                        currentOptions.shortcuts[key] = defaultOptions.shortcuts[key];
                    }
                }
            }

            // Update the version
            currentOptions.version = defaultOptions.version;

            // Save the updated options
            GM_setValue('options', currentOptions);
            // Migrate existing notes to add IDs
            migrateNotesToAddIds();

            alert('Options updated to version ' + defaultOptions.version + changeLog);
            console.log('Options updated to version ' + defaultOptions.version);
        }

        return currentOptions;
    }

    function migrateNotesToAddIds() {
        try {
            const notes = getAllNotes();
            let migrated = false;

            for (const url in notes) {
                notes[url].forEach(note => {
                    if (!note.id) {
                        note.id = generateNoteId();
                        migrated = true;
                    }
                });
            }

            if (migrated) {
                GM_setValue('website-notes', notes);
                console.log('Migration completed: IDs added to existing notes');
            }
        } catch (error) {
            console.error('Error during note migration:', error);
        }
    }

    const isDarkMode = options.darkMode;

    const darkModeStyles = {
        modal: {
            bg: '#1f2937',
            text: '#f3f4f6'
        },
        input: {
            bg: '#374151',
            border: '#4b5563',
            text: '#f3f4f6'
        },
        button: {
            primary: '#3b82f6',
            primaryHover: '#2563eb',
            secondary: '#4b5563',
            secondaryHover: '#374151',
            text: '#ffffff'
        },
        listItem: {
            bg: '#374151',
            bgHover: '#4b5563',
            text: '#f3f4f6'
        }
    };

    const lightModeStyles = {
        modal: {
            bg: '#ffffff',
            text: '#111827'
        },
        input: {
            bg: '#f9fafb',
            border: '#e5e7eb',
            text: '#111827'
        },
        button: {
            primary: '#3b82f6',
            primaryHover: '#2563eb',
            secondary: '#f3f4f6',
            secondaryHover: '#e5e7eb',
            text: '#ffffff'
        },
        listItem: {
            bg: '#ffffff',
            bgHover: '#f9fafb',
            text: '#1f2937'
        }
    };

    const currentTheme = isDarkMode ? darkModeStyles : lightModeStyles;

    const styles = `
        .notes-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,${isDarkMode ? '0.8' : '0.7'});
            z-index: 99998;
            backdrop-filter: blur(4px);
            contain: layout style paint;
        }

        .notes-overlay{
            h1 { font-size: 1.5em; margin-top: 0.8em; margin-bottom: 0.5em; }
            h2 { font-size: 1.3em; margin-top: 0.7em; margin-bottom: 0.4em; }
            ul { list-style-type: disc; margin-left: 20px; }
            blockquote { border-left: 3px solid #9ca3af; padding-left: 10px; margin-left: 5px; color: #6b7280; }
            pre { background-color: #2a3441; padding: 10px; border-radius: 6px; overflow-x: auto; }
            code { background-color: #374151; padding: 2px 4px; border-radius: 4px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #4b5563; padding: 8px; }
            hr { border: none; border-top: 1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}; margin: 16px 0;}
        }

        .notes-overlay {
            .notes-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${currentTheme.modal.bg};
                color: ${currentTheme.modal.text};
                padding: 32px;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.25);
                z-index: 10000;
                max-width: 700px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .notes-input {
                width: 100%;
                margin: 12px 0;
                padding: 12px 16px;
                border: 2px solid ${currentTheme.input.border};
                border-radius: 8px;
                font-size: 15px;
                transition: all 0.2s ease;
                background: ${currentTheme.input.bg};
                color: ${currentTheme.input.text};
                box-sizing: border-box;
            }
            .notes-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            .notes-textarea {
                width: 100%;
                height: 200px;
                margin: 12px 0;
                padding: 16px;
                border: 2px solid ${currentTheme.input.border};
                border-radius: 8px;
                font-size: 15px;
                resize: vertical;
                transition: all 0.2s ease;
                background: ${currentTheme.input.bg};
                color: ${currentTheme.input.text};
                line-height: 1.5;
                box-sizing: border-box;
            }
            .notes-textarea:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            .notes-button {
                background: ${currentTheme.button.primary};
                color: ${currentTheme.button.text};
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                margin: 5px;
                font-size: 15px;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            .notes-button:hover {
                background: ${currentTheme.button.primaryHover};
                transform: translateY(-1px);
            }
            .notes-button.secondary {
                background: ${currentTheme.button.secondary};
                color: ${isDarkMode ? '#f3f4f6' : '#4b5563'};
            }
            .notes-button.secondary:hover {
                background: ${currentTheme.button.secondaryHover};
            }
            .notes-button.delete {
                background: #ef4444;
            }
            .notes-button.delete:hover {
                background: #dc2626;
            }
            .notes-button.edit {
                background: #10b981;
            }
            .notes-button.edit:hover {
                background: #059669;
            }
            .notes-list-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                border: 1px solid ${currentTheme.input.border};
                border-radius: 8px;
                margin: 8px 0;
                cursor: pointer;
                transition: all 0.2s ease;
                background: ${currentTheme.listItem.bg};
                color: ${currentTheme.listItem.text};
                contain: layout paint;
            }
            .notes-list-item:hover {
                background: ${currentTheme.listItem.bgHover};
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,${isDarkMode ? '0.3' : '0.05'});
            }
            .close-button {
                position: absolute;
                top: 16px;
                right: 16px;
                cursor: pointer;
                font-size: 24px;
                color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
                transition: all 0.2s;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
            }
            .close-button:hover {
                color: ${isDarkMode ? '#f3f4f6' : '#111827'};
                background: ${isDarkMode ? '#374151' : '#f3f4f6'};
            }
            .modal-title {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 24px;
                color: ${currentTheme.modal.text};
            }
            .url-text {
                font-size: 14px;
                color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
                word-break: break-all;
                margin-bottom: 16px;
                padding: 8px 12px;
                background: ${isDarkMode ? '#374151' : '#f3f4f6'};
                border-radius: 6px;
            }
            .timestamp {
                font-size: 12px;
                color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
                margin-top: 4px;
            }
            .delete-note-button {
                background: none;
                border: none;
                color: #ef4444;
                font-size: 18px;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            .delete-note-button:hover {
                background: #ef4444;
                color: #ffffff;
            }
            .notes-options-input {
                width: 100%;
                margin: 8px 0;
                padding: 10px 14px;
                border: 2px solid ${currentTheme.input.border};
                border-radius: 8px;
                font-size: 15px;
                transition: all 0.2s ease;
                background: ${currentTheme.input.bg};
                color: ${currentTheme.input.text};
                box-sizing: border-box;
            }

            .notes-options-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .notes-options-checkbox {
                margin-right: 8px;
            }

            .notes-options-label {
                display: flex;
                align-items: center;
                margin: 10px 0;
                color: ${currentTheme.modal.text};
            }

            .notes-editor-toolbar {
                display: flex;
                gap: 8px;
                margin: 8px 0;
                padding: 8px;
                background: ${isDarkMode ? '#2a3441' : '#f3f4f6'};
                border-radius: 6px;
            }

            .notes-tag {
                display: inline-block;
                padding: 4px 8px;
                margin: 0 4px 4px 0;
                border-radius: 4px;
                background: ${isDarkMode ? '#4b5563' : '#e5e7eb'};
                color: ${isDarkMode ? '#f3f4f6' : '#374151'};
                font-size: 12px;
            }
        }

        .notes-notification {
			position: fixed;
			top: 20px;
			right: 20px;
			z-index: 99999;
			padding: 12px 16px;
			color: white;
			border-radius: 8px;
			font-size: 13px;
			font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
			font-weight: 500;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
			max-width: 350px;
			animation: slideInRight 0.3s ease-out;
			cursor: pointer;
			display: flex;
			align-items: center;
			gap: 8px;

            .closing {
				animation: slideOutRight 0.3s ease-in;
            }

        }


        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOutRight {
            to { transform: translateX(100%); opacity: 0; }
        }
    `;


    const mobileStyles = `
        @media (max-width: 768px) {
            .notes-overlay .notes-modal {
                width: 95%;
                padding: 16px;
                max-height: 95vh;
            }

            .notes-overlay .notes-button {
                padding: 10px 16px;
                margin: 3px;
                font-size: 14px;
            }

            .notes-overlay .close-button {
                top: 8px;
                right: 8px;
            }

            .notes-overlay .button-group {
                display: flex;
                flex-direction: column;
            }

            .notes-overlay .notes-list-item {
                padding: 12px;
            }
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles + mobileStyles;
    document.head.appendChild(styleSheet);

    function showNotification(message, type = 'info', duration = 4000) {
        // Remove existing notifications
        document.querySelectorAll('.notes-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'notes-notification';

        const colors = {
            success: { bg: '#4CAF50', icon: '✅' },
            warning: { bg: '#FF9800', icon: '⚠️' },
            error: { bg: '#F44336', icon: '❌' },
            info: { bg: '#2196F3', icon: 'ℹ️' },
            deletion: { bg: '2196F3', icon: '🗑️' }
        };

        const style = colors[type] || colors.info;

        notification.style.background = style.bg;
        notification.innerHTML = `${style.icon} ${message}`;

        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.classList.add('closing');
            setTimeout(() => notification.remove(), 300);
        });

        document.body.appendChild(notification);

        // Auto-remove after duration
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('closing');
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }


    function showOptionsMenu() {
        // Define shortcuts configuration
        const shortcuts = [
            { key: 'newNote', label: 'New Note', id: 'newNoteShortcut' },
            { key: 'currentPageNotes', label: 'Current Page Notes', id: 'currentPageNotesShortcut' },
            { key: 'allNotes', label: 'All Notes', id: 'allNotesShortcut' },
            { key: 'showOptions', label: 'Show Options', id: 'showOptionsWindow' }
        ];

        // Generate shortcuts HTML
        const shortcutHTML = shortcuts.map(s => `
            <div>
                <label>${s.label}:
                    <input type="text" class="notes-options-input" id="${s.id}" value="${getShortcutString(options.shortcuts[s.key])}">
                </label>
            </div>
        `).join('');

        const container = document.createElement('div');
        container.innerHTML = `
            <h3 class="modal-title">Options</h3>
            <div class="notes-options-label">
                <label>
                    <input type="checkbox" class="notes-options-checkbox" id="darkModeToggle" ${options.darkMode ? 'checked' : ''}>
                    Dark Mode
                </label>
            </div>
            <div class="notes-options-label">
                <label>
                    <input type="checkbox" class="notes-options-checkbox" id="timestampToggle" ${options.addTimestampToTitle ? 'checked' : ''}>
                    Add timestamp to note titles
                </label>
            </div>
            <div class="notes-options-label">
                <label>
                    <input type="checkbox" class="notes-options-checkbox" id="showUrlLinksToggle" ${options.showUrlLinksInNotesList ? 'checked' : ''}>
                    Show URL links in notes list
                </label>
            </div>
            <div class="notes-options-label">
                <label>
                    <input type="checkbox" class="notes-options-checkbox" id="autoBackupToggle" ${options.autoBackup ? 'checked' : ''}>
                    Enable automatic backups
                </label>
            </div>
            <div class="notes-options-label">
                <label>
                    <input type="checkbox" class="notes-options-checkbox" id="scrollContentToggle" ${options.scrollContentOnly ? 'checked' : ''}>
                    Scroll content only (instead of entire modal)
                </label>
            </div>
            <div class="notes-options-label">
                <label>
                    Max Search Results:
                    <input type="number" class="notes-options-input" id="maxSearchResults" value="${options.maxSearchResults}" min="10" max="500" style="width: 80px; margin-left: 8px;">
                </label>
            </div>
            <div class="notes-options-label">
                <label>
                    Max Patterns Per Page (When showing all notes):
                    <input type="number" class="notes-options-input" id="maxPatternsPerPage" value="${options.maxPatternsPerPage}" min="10" max="500" style="width: 80px; margin-left: 8px;">
                </label>
            </div>
            <h4 style="margin-top: 20px;">Keyboard Shortcuts</h4>
            ${shortcutHTML}
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button id="saveOptions" class="notes-button">Save Options</button>
                <button id="exportNotesBtn" class="notes-button secondary">Export Notes</button>
                <button id="importNotesBtn" class="notes-button secondary">Import Notes</button>
            </div>
        `;

        createModal(container);

        addRestoreBackupButton();

        const buttonHandlers = {
            'saveOptions': saveOptions,
            'exportNotesBtn': exportNotes,
            'importNotesBtn': importNotes
        };

        // Add event listeners
        Object.entries(buttonHandlers).forEach(([id, handler]) => {
            document.getElementById(id).onclick = handler;
        });
    }

    function getShortcutString(shortcut) {
        let str = '';
        if (shortcut.ctrlKey) str += 'Ctrl+';
        if (shortcut.shiftKey) str += 'Shift+';
        if (shortcut.altKey) str += 'Alt+';
        str += shortcut.key.toUpperCase();
        return str;
    }

    function parseShortcutString(str) {
        if (!str || typeof str !== 'string') {
            console.warn('Invalid shortcut string:', str);
            // Return default values if string is invalid
            return {
                ctrlKey: true,
                shiftKey: true,
                altKey: false,
                key: 'S'
            };
        }

        const parts = str.toLowerCase().split('+');
        return {
            ctrlKey: parts.includes('ctrl'),
            shiftKey: parts.includes('shift'),
            altKey: parts.includes('alt'),
            key: parts[parts.length - 1] || 'S'
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function saveOptions() {
        try {

            const maxResults = parseInt(document.getElementById('maxSearchResults').value) || 50;
            const maxPerPage = parseInt(document.getElementById('maxPatternsPerPage').value) || 50;

            const shortcutMappings = {
                newNote: 'newNoteShortcut',
                currentPageNotes: 'currentPageNotesShortcut',
                allNotes: 'allNotesShortcut',
                showOptions: 'showOptionsWindow'
            };

            const shortcuts = {};
            const shortcutValues = new Set();

            for (const [key, id] of Object.entries(shortcutMappings)) {
                const value = document.getElementById(id).value;
                const normalizedValue = value.toLowerCase();
                if (shortcutValues.has(normalizedValue)) {
                    alert(`Duplicate shortcut detected: ${value}. This will execute multiple functionalities at once.`);
                }
                shortcutValues.add(normalizedValue);
                shortcuts[key] = parseShortcutString(value);
            }

            options = {
                version: scriptVersion,
                darkMode: document.getElementById('darkModeToggle').checked,
                addTimestampToTitle: document.getElementById('timestampToggle').checked,
                showUrlLinksInNotesList: document.getElementById('showUrlLinksToggle').checked,
                autoBackup: document.getElementById('autoBackupToggle').checked,
                scrollContentOnly: document.getElementById('scrollContentToggle').checked,
                maxSearchResults: isNaN(maxResults) || maxResults < 10 ? 10 : Math.min(maxResults, 500),
                maxPatternsPerPage: isNaN(maxPerPage) || maxPerPage < 10 ? 10 : Math.min(maxPerPage, 500),
                shortcuts
            };
            GM_setValue('options', options);
            updateShortcutListener();
            alert('Options saved successfully. Some changes may require reloading the page.');
        } catch (error) {
            console.error('Error saving options:', error);
            alert('Failed to save options. Please try again.');
        }
    }

    function exportNotes() {
        try {
            const notes = getAllNotes();

            // Ensure all notes have IDs before export
            let modified = false;
            for (const url in notes) {
                notes[url].forEach(note => {
                    if (!note.id) {
                        note.id = generateNoteId();
                        modified = true;
                    }
                });
            }

            // If we added IDs, save them back
            if (modified) {
                GM_setValue('website-notes', notes);
            }

            const dateInfo = getFormattedBackupDate();
            const blob = new Blob([JSON.stringify(notes, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `website-notes-backup-${dateInfo.formatted}.json`;
            a.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting notes:', error);
            alert('Failed to export notes. Please try again.');
        }
    }

    function importNotes() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const importedNotes = JSON.parse(event.target.result);

                    // Create custom modal for import options
                    const overlay = document.createElement('div');
                    overlay.className = 'notes-overlay';

                    const modal = document.createElement('div');
                    modal.className = 'notes-modal';
                    modal.style.maxWidth = '500px';

                    const closeButton = document.createElement('span');
                    closeButton.className = 'close-button';
                    closeButton.textContent = '×';
                    closeButton.onclick = () => overlay.remove();

                    modal.innerHTML = `
                        <h3 class="modal-title">Import Notes</h3>
                        <p>Choose how to import the notes:</p>

                        <div class="notes-list-item" style="cursor: pointer; margin-bottom: 12px;">
                            <div>
                                <strong>Merge</strong>
                                <p style="margin: 5px 0; font-size: 14px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'}">
                                    Add imported notes to your existing notes. This will keep all your current notes and may create duplicates.
                                </p>
                            </div>
                        </div>

                        <div class="notes-list-item" style="cursor: pointer; margin-bottom: 12px;">
                            <div>
                                <strong>Update</strong>
                                <p style="margin: 5px 0; font-size: 14px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'}">
                                    Add imported notes, updating existing notes (based on ID).
                                </p>
                            </div>
                        </div>

                        <div class="notes-list-item" style="cursor: pointer;">
                            <div>
                                <strong>Replace</strong>
                                <p style="margin: 5px 0; font-size: 14px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'}">
                                    Replace all your current notes with the imported ones. This will delete all your existing notes.
                                </p>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                            <button id="mergeBtn" class="notes-button">Merge</button>
                            <button id="updateBtn" class="notes-button">Update</button>
                            <button id="replaceBtn" class="notes-button delete">Replace</button>
                            <button id="cancelBtn" class="notes-button secondary">Cancel</button>
                        </div>
                    `;

                    modal.appendChild(closeButton);
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);

                    // Add event listeners
                    document.getElementById('mergeBtn').onclick = () => {
                        mergeNotes(importedNotes);
                        overlay.remove();
                    };

                    document.getElementById('updateBtn').onclick = () => {
                        importUpdate(importedNotes);
                        overlay.remove();
                    };

                    document.getElementById('replaceBtn').onclick = () => {
                        if (confirm('This will permanently replace all your existing notes. Are you sure?')) {
                            GM_setValue('website-notes', importedNotes);
                            alert('Notes replaced successfully!');
                            overlay.remove();
                        }
                    };

                    document.getElementById('cancelBtn').onclick = () => {
                        overlay.remove();
                    };

                } catch (error) {
                    console.error('Error parsing imported notes:', error);
                    alert('Error importing notes: Invalid format');
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    function importUpdate(importedNotes) {
        try {
            // Get existing notes
            const existingNotes = getAllNotes();

            // Build a Map of existing note IDs to their notes and locations for fast lookup
            const existingNotesMap = new Map();
            for (const url in existingNotes) {
                existingNotes[url].forEach((note, index) => {
                    if (note.id) {
                        existingNotesMap.set(note.id, {
                            note,
                            url,
                            index
                        });
                    }
                });
            }

            // Count imported, updated, and skipped notes for notification
            let importedCount = 0;
            let updatedCount = 0;
            let skippedCount = 0;

            // Merge notes by URL
            for (const url in importedNotes) {
                if (!existingNotes[url]) {
                    // If URL is new, add all notes (but ensure they have IDs)
                    existingNotes[url] = importedNotes[url].map(note => ({
                        ...note,
                        id: note.id || generateNoteId()
                    }));
                    importedCount += importedNotes[url].length;
                } else {
                    // Check for duplicates before adding
                    importedNotes[url].forEach(importedNote => {
                        // If imported note has an ID
                        if (importedNote.id) {
                            // Check if this ID already exists
                            if (existingNotesMap.has(importedNote.id)) {
                                const existing = existingNotesMap.get(importedNote.id);

                                // Compare timestamps - keep the more recent version
                                if (importedNote.timestamp > existing.note.timestamp) {
                                    // Imported note is newer, replace the existing one
                                    existingNotes[existing.url][existing.index] = importedNote;
                                    updatedCount++;

                                    // Update the map with the new note
                                    existingNotesMap.set(importedNote.id, {
                                        note: importedNote,
                                        url: existing.url,
                                        index: existing.index
                                    });
                                } else {
                                    // Existing note is newer or same age, skip
                                    skippedCount++;
                                }
                            } else {
                                // New note with ID, add it
                                existingNotes[url].push(importedNote);
                                existingNotesMap.set(importedNote.id, {
                                    note: importedNote,
                                    url,
                                    index: existingNotes[url].length - 1
                                });
                                importedCount++;
                            }
                        } else {
                            // Imported note has no ID - use old logic (content-based comparison)
                            const isDuplicate = existingNotes[url].some(existingNote => {
                                // First check timestamp for efficiency
                                return existingNote.timestamp === importedNote.timestamp &&
                                    existingNote.title === importedNote.title &&
                                    existingNote.content === importedNote.content;
                            });

                            if (!isDuplicate) {
                                // Find if there's a matching note with an ID that we can reuse
                                const matchingNoteWithId = existingNotes[url].find(existingNote =>
                                                                                   existingNote.id &&
                                                                                   existingNote.timestamp === importedNote.timestamp &&
                                                                                   existingNote.title === importedNote.title &&
                                                                                   existingNote.content === importedNote.content
                                                                                  );

                                if (matchingNoteWithId) {
                                    // Use the existing note's ID
                                    importedNote.id = matchingNoteWithId.id;
                                } else {
                                    // Generate a new ID
                                    importedNote.id = generateNoteId();
                                }

                                existingNotes[url].push(importedNote);
                                if (importedNote.id) {
                                    existingNotesMap.set(importedNote.id, {
                                        note: importedNote,
                                        url,
                                        index: existingNotes[url].length - 1
                                    });
                                }
                                importedCount++;
                            } else {
                                skippedCount++;
                            }
                        }
                    });
                }
            }

            // Save merged notes back to storage
            GM_setValue('website-notes', existingNotes);

            // Perform auto-backup if enabled
            if (options.autoBackup) {
                performAutoBackup();
            }

            let message = `Notes merged successfully!\n${importedCount} new notes imported`;
            if (updatedCount > 0) {
                message += `, ${updatedCount} notes updated to newer versions`;
            }
            if (skippedCount > 0) {
                message += `, ${skippedCount} older/duplicate notes skipped`;
            }
            alert(message);
        } catch (error) {
            console.error('Error merging notes without duplicates:', error);
            alert('Error merging notes. Please try again.');
        }
    }

    function mergeNotes(importedNotes) {
        try {
            // Get existing notes
            const existingNotes = getAllNotes();

            // Count imported notes for notification
            let importedCount = 0;

            // Merge notes by URL
            for (const url in importedNotes) {
                if (existingNotes[url]) {
                    // If URL exists, append notes to existing array
                    existingNotes[url] = existingNotes[url].concat(importedNotes[url]);
                    importedCount += importedNotes[url].length;
                } else {
                    // If URL is new, add all notes
                    existingNotes[url] = importedNotes[url];
                    importedCount += importedNotes[url].length;
                }
            }

            // Save merged notes back to storage
            GM_setValue('website-notes', existingNotes);

            // Perform auto-backup if enabled
            if (options.autoBackup) {
                performAutoBackup();
            }

            alert(`Notes merged successfully! ${importedCount} notes were imported.`);
        } catch (error) {
            console.error('Error merging notes:', error);
            alert('Error merging notes. Please try again.');
        }
    }

    function addRestoreBackupButton() {
        // Create a restore backup button
        const restoreBackupBtn = document.createElement('button');
        restoreBackupBtn.id = 'restoreBackupBtn';
        restoreBackupBtn.className = 'notes-button secondary';
        restoreBackupBtn.textContent = 'Restore Backup';

        // Add it to the export/import button group
        const buttonGroup = document.querySelector('[id="saveOptions"]').parentNode;
        buttonGroup.appendChild(restoreBackupBtn);

        // Add event listener
        document.getElementById('restoreBackupBtn').onclick = showBackupsList;
    }

    function showBackupsList() {
        // Create modal for backup list
        const overlay = document.createElement('div');
        overlay.className = 'notes-overlay';

        const modal = document.createElement('div');
        modal.className = 'notes-modal';
        modal.style.maxWidth = '500px';

        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.onclick = () => overlay.remove();

        let backupKeys = [];
        try {
            backupKeys = GM_listValues().filter(key => key.startsWith('notes-backup-')).sort().reverse();
        } catch (error) {
            console.warn('Could not retrieve list of backups:', error);
        }

        if (backupKeys.length === 0) {
            modal.innerHTML = `
            <h3 class="modal-title">Restore Backup</h3>
            <p>No backups found. Automatic backups are ${options.autoBackup ? 'enabled' : 'disabled'} in your settings.</p>
            <button id="closeBackupsList" class="notes-button">Close</button>
            `;
        } else {
            modal.innerHTML = `
            <h3 class="modal-title">Available Backups</h3>
            <p>Select a backup to restore:</p>
            <div id="backupsList" style="max-height: 300px; overflow-y: auto;"></div>
            <button id="closeBackupsList" class="notes-button secondary" style="margin-top: 16px;">Cancel</button>
            `;

            const backupsList = modal.querySelector('#backupsList');

            backupKeys.forEach(key => {
                // Extract the timestamp from the key
                const timestampStr = key.replace('notes-backup-', '');
                let timestamp;
                let readableDate = "Unknown date";

                // Handle both timestamp formats
                if (/^\d+$/.test(timestampStr)) {
                    // It's a numeric timestamp
                    timestamp = parseInt(timestampStr, 10);
                } else if (timestampStr.includes('T')) {
                    // It's an ISO date format
                    try {
                        timestamp = new Date(timestampStr.replace(/\-/g, ':')).getTime();
                    } catch (e) {
                        console.error('Error parsing ISO date format:', e);
                    }
                }

                // Format date in a more user-friendly way
                if (!isNaN(timestamp) && timestamp > 0) {
                    const date = new Date(timestamp);

                    // Format: "Feb 25, 2025 - 3:45 PM" (with day and time)
                    const options = {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    };
                    readableDate = date.toLocaleDateString(undefined, options);

                    // Add relative time indication like "Today", "Yesterday", etc.
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (date.toDateString() === today.toDateString()) {
                        readableDate = `Today, ${date.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit', hour12: true})}`;
                    } else if (date.toDateString() === yesterday.toDateString()) {
                        readableDate = `Yesterday, ${date.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit', hour12: true})}`;
                    }
                }

                const backupItem = document.createElement('div');
                backupItem.className = 'notes-list-item';
                backupItem.innerHTML = `<span>${readableDate}</span>`;
                backupItem.onclick = () => confirmAndRestoreBackup(key);

                backupsList.appendChild(backupItem);
            });
        }

        modal.appendChild(closeButton);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        document.getElementById('closeBackupsList')?.addEventListener('click', () => overlay.remove());
    }

    function confirmAndRestoreBackup(backupKey) {
        if (confirm('Are you sure you want to restore this backup? This will replace all your current notes.')) {
            try {
                const backupData = GM_getValue(backupKey);
                if (backupData) {
                    GM_setValue('website-notes', backupData);
                    alert('Backup restored successfully!');
                    location.reload(); // Reload the page to refresh notes display
                } else {
                    alert('Error: Backup data is empty or corrupted.');
                }
            } catch (error) {
                console.error('Error restoring backup:', error);
                alert('Failed to restore backup. Please try again.');
            }
        }
    }

    // Add search functionality
    function addSearchButton() {
        // Add a search button to the top of the all notes view
        const searchButton = document.createElement('button');
        searchButton.className = 'notes-button';
        searchButton.textContent = '🔍 Search Notes';
        searchButton.style.marginBottom = '16px';
        searchButton.onclick = showSearchModal;

        // Find the appropriate container - the div after the modal title
        const titleElement = document.querySelector('.notes-modal .modal-title');
        if (titleElement && titleElement.textContent === 'All Notes') {
            titleElement.parentNode.insertBefore(searchButton, titleElement.nextSibling);
        }
    }

    function showSearchModal() {
        const overlay = document.createElement('div');
        overlay.className = 'notes-overlay';

        const modal = document.createElement('div');
        modal.className = 'notes-modal';

        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.onclick = () => overlay.remove();

        modal.innerHTML = `
            <h3 class="modal-title">Search Notes</h3>
            <input type="text" id="searchInput" class="notes-input" placeholder="Search by title, content, tags, or URL...">
            <div class="notes-options-label">
                <label>
                    <input type="checkbox" class="notes-options-checkbox" id="searchTitle" checked>
                    Search in titles
                </label>
            </div>
            <div class="notes-options-label">
                <label>
                    <input type="checkbox" class="notes-options-checkbox" id="searchContent" checked>
                    Search in note content
                </label>
            </div>
            <div class="notes-options-label">
                <label>
                    <input type="checkbox" class="notes-options-checkbox" id="searchTags" checked>
                    Search in tags
                </label>
            </div>
            <div class="notes-options-label">
                <label>
                    <input type="checkbox" class="notes-options-checkbox" id="searchUrls">
                    Search in URLs
                </label>
            </div>
            <div id="searchResults" style="margin-top: 16px; max-height: 400px; overflow-y: auto;"></div>
            <button id="closeSearchModal" class="notes-button secondary" style="margin-top: 16px;">Close</button>
        `;

        modal.appendChild(closeButton);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Set up event listeners
        const searchInput = document.getElementById('searchInput');
        searchInput.focus();

        // Cache for search results
        let searchCache = {
            lastQuery: '',
            lastResults: [],
            lastSearchOptions: null
        };

        const debouncedSearch = debounce(performSearch, 150);
        searchInput.addEventListener('input', debouncedSearch);
        function resetCacheAndSearch() {
            searchCache = { lastQuery: '', lastResults: [], lastSearchOptions: null, wasLimitReached: false };
            performSearch();
        }

        document.getElementById('searchTitle').addEventListener('change', resetCacheAndSearch);
        document.getElementById('searchContent').addEventListener('change', resetCacheAndSearch);
        document.getElementById('searchTags').addEventListener('change', resetCacheAndSearch);
        document.getElementById('searchUrls').addEventListener('change', resetCacheAndSearch);

        document.getElementById('closeSearchModal').addEventListener('click', () => overlay.remove());

        // Perform search when input changes
		function performSearch() {
			const query = searchInput.value.toLowerCase().trim();
			const searchTitle = document.getElementById('searchTitle').checked;
			const searchContent = document.getElementById('searchContent').checked;
			const searchTags = document.getElementById('searchTags').checked;
			const searchUrls = document.getElementById('searchUrls').checked;
			const searchResults = document.getElementById('searchResults');
			const maxResults = options.maxSearchResults || 50;

			// Create search options object for comparison
			const currentSearchOptions = { searchTitle, searchContent, searchTags, searchUrls };

			// Helper function to highlight matching text
			function highlightMatch(text, query) {
				if (!text) return '';
				const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
				return text.replace(regex, '<mark style="background-color: #fde68a; color: #1f2937;">$1</mark>');
			}

			// Helper function to check if search options changed
			function searchOptionsChanged() {
				if (!searchCache.lastSearchOptions) return true;
				return JSON.stringify(currentSearchOptions) !== JSON.stringify(searchCache.lastSearchOptions);
			}

			// Helper function to add a note result to the results div
			function addNoteResult(container, note, url, index, query) {
				const noteDiv = document.createElement('div');
				noteDiv.className = 'notes-list-item';

				// Apply note color if available
				if (note.color) {
					noteDiv.style.borderLeft = `4px solid ${note.color}`;
					noteDiv.style.paddingLeft = '12px';
				}

				// Create content with highlighted matches
				let titleHtml = note.title;
				let contentPreview = '';

				if (query) {
					// Highlight matches
					if (searchTitle) {
						titleHtml = highlightMatch(note.title, query);
					}

					if (searchContent && note.content.toLowerCase().includes(query)) {
						// Find the context around the match
						const matchIndex = note.content.toLowerCase().indexOf(query);
						const startIndex = Math.max(0, matchIndex - 50);
						const endIndex = Math.min(note.content.length, matchIndex + query.length + 50);

						// Add ellipsis if we're not starting from the beginning
						let preview = (startIndex > 0 ? '...' : '') +
							note.content.substring(startIndex, endIndex) +
							(endIndex < note.content.length ? '...' : '');

						contentPreview = `<div style="margin-top: 4px; font-size: 14px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'};">
						 ${highlightMatch(preview, query)}
						 </div>`;
					}
				}

				// Add tags if available with highlighting
				let tagsHTML = '';
				if (note.tags && note.tags.length > 0) {
					tagsHTML = '<div style="margin-top: 4px;">';
					note.tags.forEach(tag => {
						if (searchTags && query && tag.toLowerCase().includes(query)) {
							tagsHTML += `<span class="notes-tag">${highlightMatch(tag, query)}</span>`;
						} else {
							tagsHTML += `<span class="notes-tag">${tag}</span>`;
						}
					});
					tagsHTML += '</div>';
				}

				noteDiv.innerHTML = `
					<div style="flex-grow: 1;">
						<div style="font-weight: 500;">${titleHtml}</div>
						${contentPreview}
						${tagsHTML}
					</div>
				`;

				noteDiv.onclick = () => {
					document.querySelector('.notes-overlay').remove();
					showNoteContent(note, url, index);
				};

				container.appendChild(noteDiv);
			}

			// Use DocumentFragment for efficient DOM updates
			const fragment = document.createDocumentFragment();

			if (!query) {
				const emptyMessage = document.createElement('p');
				emptyMessage.style.color = '#6b7280';
				emptyMessage.textContent = 'Enter a search term to find notes';
				fragment.appendChild(emptyMessage);

				searchResults.replaceChildren(fragment);

				// Reset cache when query is empty
				searchCache = { lastQuery: '', lastResults: [], lastSearchOptions: null, wasLimitReached: false };
				return;
			}

			// Determine if we can use cached results
			const canUseCache = searchCache.lastQuery &&
							   query.startsWith(searchCache.lastQuery) &&
							   !searchOptionsChanged() &&
							   searchCache.lastResults.length > 0 &&
							   !searchCache.wasLimitReached;

			let searchPool = [];
			let useCache = false;

			if (canUseCache) {
				// Use cached results as the search pool for refinement
				searchPool = searchCache.lastResults.slice(); // Create a copy
				useCache = true;
			} else {
				// Need to search all notes - build the complete search pool
				const notes = getAllNotes();
				for (const url in notes) {
					notes[url].forEach((note, index) => {
						searchPool.push({
							note,
							url,
							index
						});
					});
				}
				useCache = false;
			}

			// Perform the actual search with early termination
			const results = [];
			let resultCount = 0;
			let limitReached = false;

			// Search through the pool and break early when limit is reached
			for (const item of searchPool) {
				if (resultCount >= maxResults) {
					limitReached = true;
					break;
				}

				const { note, url, index } = item;
				let matches = false;

				// Check URL match
				if (searchUrls && url.toLowerCase().includes(query)) {
					matches = true;
				}

				// Check note content matches
				if (!matches) {
					if (searchTitle && note.title.toLowerCase().includes(query)) matches = true;
					if (!matches && searchContent && note.content.toLowerCase().includes(query)) matches = true;
					if (!matches && searchTags && note.tags && note.tags.some(tag => tag.toLowerCase().includes(query))) matches = true;
				}

				if (matches) {
					results.push({ note, url, index });
					resultCount++;
				}
			}

			// Update cache - always update when we have results
			if (results.length > 0 || !useCache) {
				searchCache = {
					lastQuery: query,
					lastResults: results,
					lastSearchOptions: { ...currentSearchOptions },
					wasLimitReached: limitReached
				};
			}

			// Create DOM elements
			if (resultCount === 0) {
				const noResults = document.createElement('p');
				noResults.style.color = '#6b7280';
				noResults.textContent = 'No matching notes found';
				fragment.appendChild(noResults);
			} else {
				const countMessage = document.createElement('p');
				countMessage.style.color = '#6b7280';
                if (limitReached) {
                    countMessage.textContent = `Search limit reached: showing first ${maxResults}`;
                } else {
                    countMessage.textContent = `${resultCount} note${resultCount !== 1 ? 's' : ''} found`;
                }
				fragment.appendChild(countMessage);

				// Group results by URL
				const groupedResults = {};
				results.forEach(result => {
					if (!groupedResults[result.url]) {
						groupedResults[result.url] = [];
					}
					groupedResults[result.url].push(result);
				});

				Object.keys(groupedResults).forEach(url => {
					const urlDiv = document.createElement('div');
					urlDiv.innerHTML = `<div class="url-text">${searchUrls && query ? highlightMatch(url, query) : url}</div>`;

					groupedResults[url].forEach(result => {
						addNoteResult(urlDiv, result.note, result.url, result.index, query);
					});

					fragment.appendChild(urlDiv);
				});
			}

			// Single DOM update
			searchResults.replaceChildren(fragment);
		}
    }

    GM_registerMenuCommand('Toggle Dark Mode', () => {
        const newMode = !isDarkMode;
        GM_setValue('darkMode', newMode);
        location.reload();
    });

    function createModal(content) {
        const overlay = document.createElement('div');
        overlay.className = 'notes-overlay';

        const modal = document.createElement('div');
        modal.className = 'notes-modal';

        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.onclick = () => {
            overlay.remove();
            document.removeEventListener('keydown', escapeListener);
        };
        modal.appendChild(closeButton);
        modal.appendChild(content);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const escapeListener = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escapeListener);
            }
        };
        document.addEventListener('keydown', escapeListener);
    }

    function getAllNotes() {
        return GM_getValue('website-notes', {});
    }

    function generateNoteId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    function saveNote(title, url, content, timestamp = Date.now(), pinned = false, tags = [], color = null, id = null) {
        try {
            const notes = getAllNotes();
            if (!notes[url]) notes[url] = [];

            // Add timestamp to title if the option is enabled
            let finalTitle = title.trim();
            if (options.addTimestampToTitle) {
                const date = new Date(timestamp);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                finalTitle = `${finalTitle} [${formattedDate}]`;
            }

            const noteData = {
                id: id || generateNoteId(), // Generate ID if not provided
                title: finalTitle,
                content: content.trim(),
                timestamp,
                pinned: Boolean(pinned),
                tags: Array.isArray(tags) ? tags.filter(tag => tag && tag.trim()) : [],
                color: color || null
            };

            notes[url].push(noteData);
            GM_setValue('website-notes', notes);

            // Perform auto-backup if enabled
            if (options.autoBackup) {
                performAutoBackup();
            }
            showNotification('✅ Note saved successfully', 'success');
            return true;

        } catch (error) {
            console.error('Error saving note:', error);
            showNotification('Failed to save note: ' + error.message, 'error');
            alert('Failed to save note: ' + error.message);
            return false;
        }
    }

    function performAutoBackup() {
        try {
            const notes = getAllNotes();
            const dateInfo = getFormattedBackupDate();
            // Use consistent format with numeric timestamp
            const backupKey = `notes-backup-${dateInfo.timestamp}`;

            // Create the new backup
            GM_setValue(backupKey, notes);
            console.log(`Auto-backup created successfully: ${dateInfo.formatted}`);

            // Now try to manage old backups
            try {
                // Try to get all backup keys
                const allBackupKeys = GM_listValues().filter(key => key.startsWith('notes-backup-')).sort();

                // Keep only the last 5 backups
                if (allBackupKeys.length > 5) {
                    // Delete oldest backups, keeping the 5 most recent
                    for (let i = 0; i < allBackupKeys.length - 5; i++) {
                        try {
                            GM_deleteValue(allBackupKeys[i]);
                            console.log(`Deleted old backup: ${allBackupKeys[i]}`);
                        } catch (deleteError) {
                            alert(`Could not delete backup ${allBackupKeys[i]}:`, deleteError);
                        }
                    }
                }
            } catch (listError) {
                console.warn('Could not retrieve list of backups to manage old backups:', listError);
                alert('Could not retrieve list of backups to manage old backups:', listError);

                // Alternative approach: Store the list of backup keys ourselves
                let storedBackupKeys = GM_getValue('backup-key-list', []);

                // Add the new backup key to our list
                storedBackupKeys.push(backupKey);

                // Only keep the most recent 5 backups
                if (storedBackupKeys.length > 5) {
                    // Get keys to delete (all except the 5 most recent)
                    const keysToDelete = storedBackupKeys.slice(0, storedBackupKeys.length - 5);

                    // Delete old backups
                    keysToDelete.forEach(keyToDelete => {
                        try {
                            GM_deleteValue(keyToDelete);
                            console.log(`Deleted old backup (using fallback method): ${keyToDelete}`);
                        } catch (deleteError) {
                            console.warn(`Could not delete backup ${keyToDelete}:`, deleteError);
                        }
                    });

                    // Update our stored list to contain only the 5 most recent keys
                    storedBackupKeys = storedBackupKeys.slice(storedBackupKeys.length - 5);
                }

                // Save the updated list of backup keys
                GM_setValue('backup-key-list', storedBackupKeys);
            }
        } catch (error) {
            console.error('Error during auto-backup:', error);
        }
    }

    function getFormattedBackupDate() {
        const now = new Date();

        // Format: YYYY-MM-DD_HH-MM-SS (e.g., 2025-02-25_14-30-45)
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const dateString = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

        return {
            timestamp: now.getTime(), // Use numeric timestamp
            formatted: dateString
        };
    }

    function updateNote(oldUrl, index, title, newUrl, content, pinned, tags = [], color = null) {
        const notes = getAllNotes();
        const existingNote = notes[oldUrl][index];

        if (!existingNote) {
            console.error('Note not found at specified index');
            showNotification('Note not found', 'error');
            return;
        }

        // Ensure the note has an ID (backfill for old notes)
        const noteId = existingNote.id || generateNoteId();

        // If URL hasn't changed, update in place
        if (oldUrl === newUrl) {
            notes[oldUrl][index] = {
                id: noteId,
                title,
                content,
                timestamp: existingNote.timestamp,
                pinned,
                tags,
                color
            };
            GM_setValue('website-notes', notes);

        } else {
            // URL changed: remove from old location, add to new location
            deleteNote(oldUrl, index);

            // Save with updated values but keep the original timestamp and ID
            saveNote(
                title,
                newUrl,
                content,
                existingNote.timestamp,
                pinned,
                tags,
                color,
                noteId // Pass the existing ID
            );
        }

        // Perform auto-backup if enabled
        if (options.autoBackup) {
            performAutoBackup();
        }
        showNotification('Note updated successfully', 'success');
        displayPinnedNotes();
    }

    function togglePinNote(url, index) {
        const notes = getAllNotes();
        if (notes[url] && notes[url][index]) {
            notes[url][index].pinned = !notes[url][index].pinned;
            GM_setValue('website-notes', notes);
        }
    }

    function deleteNote(url, index) {
        const notes = getAllNotes();
        if (notes[url]) {
            notes[url].splice(index, 1);
            if (notes[url].length === 0) delete notes[url];
            GM_setValue('website-notes', notes);
        }
    }

    function showNoteForm(editMode = false, existingNote = null, url = null, index = null) {
        const container = document.createElement('div');
        container.innerHTML = `<h3 class="modal-title">${editMode ? 'Edit Note' : 'Create New Note'}</h3>`;

        const titleInput = document.createElement('input');
        titleInput.className = 'notes-input';
        titleInput.placeholder = 'Enter title';
        titleInput.value = editMode ? existingNote.title : '';

        const urlInput = document.createElement('input');
        urlInput.className = 'notes-input';
        urlInput.placeholder = 'Enter URL(s) or URL pattern(s), separated by spaces (e.g., https://domain.com/*)';
        urlInput.value = editMode ? url : window.location.href;

        const patternHelp = document.createElement('div');
        patternHelp.style.fontSize = '12px';
        patternHelp.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
        patternHelp.style.marginTop = '-8px';
        patternHelp.style.marginBottom = '8px';
        patternHelp.innerHTML = 'Use * for wildcard matching. Multiple URLs: separate with spaces (e.g., https://domain1.com/* https://domain2.com/*)';

        // Add tags input
        const tagsInput = document.createElement('input');
        tagsInput.className = 'notes-input';
        tagsInput.placeholder = 'Tags (comma separated)';
        tagsInput.value = editMode && existingNote.tags ? existingNote.tags.join(', ') : '';

        const tagsHelp = document.createElement('div');
        tagsHelp.style.fontSize = '12px';
        tagsHelp.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
        tagsHelp.style.marginTop = '-8px';
        tagsHelp.style.marginBottom = '8px';
        tagsHelp.innerHTML = 'Add tags to organize notes (e.g., work, personal, important)';

        // Add color picker
        const colorPicker = createColorPicker(editMode && existingNote.color);
        const colorPickerLabel = document.createElement('div');
        colorPickerLabel.style.fontSize = '14px';
        colorPickerLabel.style.marginBottom = '8px';
        colorPickerLabel.innerHTML = 'Note Color:';

        const contentArea = document.createElement('textarea');
        contentArea.className = 'notes-textarea';
        contentArea.placeholder = 'Enter your notes here';
        contentArea.value = editMode ? existingNote.content : '';

        // Add formatting toolbar
        const toolbar = enhanceTextEditor(contentArea);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        buttonGroup.style.display = 'flex';
        buttonGroup.style.justifyContent = 'space-between';
        buttonGroup.style.marginTop = '16px';

        const saveButton = document.createElement('button');
        saveButton.className = 'notes-button';
        saveButton.textContent = editMode ? 'Update Note' : 'Save Note';
        saveButton.onclick = () => {
            if (titleInput.value && contentArea.value) {
                const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                const color = colorPicker.dataset.selectedColor;

                if (editMode) {
                    updateNote(url, index, titleInput.value, urlInput.value, contentArea.value,
                               existingNote.pinned, tags, color);
                } else {
                    saveNote(titleInput.value, urlInput.value, contentArea.value, Date.now(), false, tags, color);
                }
                container.parentElement.parentElement.remove();
                showCurrentPageNotes();
            } else {
                alert('Title and content are required!');
            }
        };

        const cancelButton = document.createElement('button');
        cancelButton.className = 'notes-button secondary';
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => container.parentElement.parentElement.remove();

        buttonGroup.appendChild(saveButton);
        buttonGroup.appendChild(cancelButton);

        container.appendChild(titleInput);
        container.appendChild(urlInput);
        container.appendChild(patternHelp);
        container.appendChild(tagsInput);
        container.appendChild(tagsHelp);
        container.appendChild(colorPickerLabel);
        container.appendChild(colorPicker);
        container.appendChild(toolbar);
        container.appendChild(contentArea);
        container.appendChild(buttonGroup);

        createModal(container);
    }

    function createColorPicker(selectedColor = null) {
        const colorOptions = ['', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '8px';
        container.style.margin = '8px 0';
        container.style.flexWrap = 'wrap';

        colorOptions.forEach(color => {
            const option = document.createElement('div');
            option.style.width = '24px';
            option.style.height = '24px';
            option.style.borderRadius = '50%';
            option.style.backgroundColor = color;
            option.style.cursor = 'pointer';
            option.style.border = color === selectedColor ? '2px solid white' : '2px solid transparent';
            option.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.1)';

            option.onclick = () => {
                container.querySelectorAll('div').forEach(div => {
                    div.style.border = '2px solid transparent';
                });
                option.style.border = '2px solid white';
                container.dataset.selectedColor = color;
            };

            container.appendChild(option);
        });

        container.dataset.selectedColor = selectedColor;
        return container;
    }

    function applyNoteColor(noteElement, color) {
        if (!color) return;

        // Apply color as a left border
        noteElement.style.borderLeft = `4px solid ${color}`;
        // Add subtle background tint
        const colorOpacity = isDarkMode ? '0.1' : '0.05';
        noteElement.style.backgroundColor = `${color}${colorOpacity}`;
    }

    function enhanceTextEditor(textArea) {
        const toolbar = document.createElement('div');
        toolbar.className = 'notes-editor-toolbar';

        const addButton = (text, title, action) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.title = title;
            btn.className = 'notes-button secondary';
            btn.style.padding = '4px 8px';
            btn.style.fontSize = '12px';
            btn.onclick = (e) => {
                e.preventDefault();
                action(textArea);
                textArea.focus(); // Keep focus on the textarea after button click
            };
            return btn;
        };

        // Add formatting buttons with icons or text
        toolbar.appendChild(addButton('B', 'Bold (Ctrl+B)', ta => {
            // If text is selected, wrap it in bold marks
            // Otherwise, just insert the marks and place cursor between them
            insertAround(ta, '**', '**');
        }));

        toolbar.appendChild(addButton('I', 'Italic (Ctrl+I)', ta => {
            insertAround(ta, '*', '*');
        }));

        toolbar.appendChild(addButton('hr', 'Horiztonal Line', ta => {
            insertAtCursor(ta, '___');
        }));

        toolbar.appendChild(addButton('Link', 'Insert Link', ta => {
            const selection = ta.value.substring(ta.selectionStart, ta.selectionEnd);
            if (selection) {
                insertAround(ta, '[', '](https://)');
                // Position cursor after the opening bracket of the URL
                ta.selectionStart = ta.selectionEnd - 9;
                ta.selectionEnd = ta.selectionEnd - 1;
            } else {
                insertAtCursor(ta, '[Link text](https://)');
                // Select "Link text" for easy replacement
                const cursorPos = ta.value.lastIndexOf('[Link text]');
                ta.selectionStart = cursorPos + 1;
                ta.selectionEnd = cursorPos + 10;
            }
        }));

        toolbar.appendChild(addButton('List', 'Insert List', ta => {
            insertAtCursor(ta, '\n- Item 1\n- Item 2\n- Item 3\n');
        }));

        toolbar.appendChild(addButton('H1', 'Heading 1', ta => {
            const start = ta.selectionStart;
            const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
            const selection = ta.value.substring(ta.selectionStart, ta.selectionEnd);

            // Check if the line already starts with # to avoid duplicating
            const currentLine = ta.value.substring(lineStart, start);
            if (currentLine.trim().startsWith('# ')) {
                return; // Already has heading format
            }

            if (selection) {
                // Selected text becomes heading
                ta.value = ta.value.substring(0, ta.selectionStart) +
                           '# ' + selection +
                           ta.value.substring(ta.selectionEnd);
                ta.selectionStart = ta.selectionStart + 2;
                ta.selectionEnd = ta.selectionStart + selection.length;
            } else {
                // Insert at current line start
                ta.value = ta.value.substring(0, lineStart) +
                           '# Heading' +
                           ta.value.substring(lineStart);
                ta.selectionStart = lineStart + 2;
                ta.selectionEnd = lineStart + 9;
            }
        }));

        toolbar.appendChild(addButton('H2', 'Heading 2', ta => {
            const start = ta.selectionStart;
            const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
            const selection = ta.value.substring(ta.selectionStart, ta.selectionEnd);

            // Check if the line already starts with ## to avoid duplicating
            const currentLine = ta.value.substring(lineStart, start);
            if (currentLine.trim().startsWith('## ')) {
                return; // Already has heading format
            }

            if (selection) {
                // Selected text becomes heading
                ta.value = ta.value.substring(0, ta.selectionStart) +
                           '## ' + selection +
                           ta.value.substring(ta.selectionEnd);
                ta.selectionStart = ta.selectionStart + 3;
                ta.selectionEnd = ta.selectionStart + selection.length;
            } else {
                // Insert at current line start
                ta.value = ta.value.substring(0, lineStart) +
                           '## Subheading' +
                           ta.value.substring(lineStart);
                ta.selectionStart = lineStart + 3;
                ta.selectionEnd = lineStart + 13;
            }
        }));

        toolbar.appendChild(addButton('Quote', 'Blockquote', ta => {
            const start = ta.selectionStart;
            const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
            const selection = ta.value.substring(ta.selectionStart, ta.selectionEnd);

            if (selection) {
                // Add quote prefix to all selected lines
                const lines = selection.split('\n');
                const quotedText = lines.map(line => `> ${line}`).join('\n');

                ta.value = ta.value.substring(0, ta.selectionStart) +
                           quotedText +
                           ta.value.substring(ta.selectionEnd);

                ta.selectionStart = ta.selectionStart;
                ta.selectionEnd = ta.selectionStart + quotedText.length;
            } else {
                // Insert at current line start
                ta.value = ta.value.substring(0, lineStart) +
                           '> ' + ta.value.substring(lineStart);
                ta.selectionStart = lineStart + 2;
                ta.selectionEnd = lineStart + 2;
            }
        }));

        // Add keyboard event listeners for common shortcuts
        textArea.addEventListener('keydown', (e) => {
            // Ctrl+B for bold
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                insertAround(textArea, '**', '**');
            }
            // Ctrl+I for italic
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                insertAround(textArea, '_', '_');
            }
            // Tab key handling for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                insertAtCursor(textArea, '    ');
            }
        });

        return toolbar;
    }

    function insertAround(textArea, before, after) {
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const text = textArea.value;
        const selected = text.substring(start, end);

        textArea.value = text.substring(0, start) + before + selected + after + text.substring(end);
        textArea.focus();
        textArea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }

    function insertAtCursor(textArea, text) {
        const start = textArea.selectionStart;
        textArea.value = textArea.value.substring(0, start) + text + textArea.value.substring(start);
        textArea.focus();
        textArea.setSelectionRange(start + text.length, start + text.length);
    }

    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    function showNoteContent(note, url, index) {
        const container = document.createElement('div');

        const contentContainer = document.createElement('div');
        contentContainer.className = 'note-content-container';
        if (options.scrollContentOnly) {
            contentContainer.style.maxHeight = '60vh';
            contentContainer.style.overflowY = 'auto';
        }
        contentContainer.style.padding = '16px';
        contentContainer.style.borderRadius = '8px';
        contentContainer.style.marginBottom = '16px';
        if (note.color) {
            contentContainer.style.borderLeft = `4px solid ${note.color}`;
            contentContainer.style.backgroundColor = `${note.color}${isDarkMode ? '15' : '10'}`;
        } else {
            contentContainer.style.backgroundColor = isDarkMode ? '#2a3441' : '#f9fafb';
        }

        let tagsHTML = '';
        if (note.tags && note.tags.length > 0) {
            tagsHTML = '<div style="margin-top: 8px; margin-bottom: 8px;">';
            note.tags.forEach(tag => {
                tagsHTML += `<span class="notes-tag">${tag}</span>`;
            });
            tagsHTML += '</div>';
        }

        container.innerHTML = `
            <h3 class="modal-title">${note.title}</h3>
            <div class="url-text">${url}</div>
            <div class="timestamp">Created: ${formatDate(note.timestamp)}</div>
            ${tagsHTML}
        `;

        contentContainer.innerHTML = md.render(note.content);
        container.appendChild(contentContainer);

        contentContainer.addEventListener('copy', async (e) => {
            e.preventDefault();
            const selection = window.getSelection();
            let selectedText = selection.toString();

            if (!selectedText) {
                // If no selection, copy the entire note content
                selectedText = note.content;
            }

            try {
                await navigator.clipboard.writeText(selectedText);
                console.log('Text copied to clipboard');
            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy text. Please try again.');
            }

            // Clear selection to prevent unwanted behavior
            selection.removeAllRanges();
        });

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const editButton = document.createElement('button');
        editButton.className = 'notes-button edit';
        editButton.textContent = 'Edit';
        editButton.onclick = () => {
            container.parentElement.parentElement.remove();
            showNoteForm(true, note, url, index);
        };

        const deleteButton = document.createElement('button');
        deleteButton.className = 'notes-button delete';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            if (confirm('Are you sure you want to delete this note?')) {
                deleteNote(url, index);
                container.parentElement.parentElement.remove();
                showNotification('Note deleted', 'deletion');
                showCurrentPageNotes();
            }
        };

        const pinButton = document.createElement('button');
        pinButton.className = `notes-button ${note.pinned ? 'secondary' : ''}`;
        pinButton.textContent = note.pinned ? 'Unpin' : 'Pin';
        pinButton.onclick = () => {
            togglePinNote(url, index);
            const notes = getAllNotes();
            const isPinned = notes[url] && notes[url][index] ? notes[url][index].pinned : false;
            pinButton.textContent = isPinned ? 'Unpin' : 'Pin';
            pinButton.className = `notes-button ${isPinned ? '' : 'secondary'}`;
            displayPinnedNotes();
        };

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);
        buttonGroup.appendChild(pinButton);
        container.appendChild(buttonGroup);

        createModal(container);
    }

    function displayPinnedNotes() {
        const notes = getAllNotes();
        const currentUrl = window.location.href;
        let pinnedNotesContainer = document.getElementById('pinned-notes-container');

        if (!pinnedNotesContainer) {
            pinnedNotesContainer = document.createElement('div');
            pinnedNotesContainer.id = 'pinned-notes-container';
            pinnedNotesContainer.style.position = 'fixed';
            pinnedNotesContainer.style.top = '10px';
            pinnedNotesContainer.style.right = '10px';
            pinnedNotesContainer.style.zIndex = '9999';
            pinnedNotesContainer.style.maxWidth = '300px';
            document.body.appendChild(pinnedNotesContainer);
        }

        pinnedNotesContainer.innerHTML = '';

        for (const url in notes) {
            if (doesUrlMatchPattern(url, currentUrl)) {
                notes[url].forEach((note, index) => {
                    if (note.pinned) {
                        const noteDiv = document.createElement('div');
                        noteDiv.className = 'pinned-note';
                        noteDiv.style.background = currentTheme.listItem.bg;
                        noteDiv.style.color = currentTheme.listItem.text;
                        noteDiv.style.padding = '10px';
                        noteDiv.style.margin = '5px 0';
                        noteDiv.style.borderRadius = '8px';
                        noteDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        noteDiv.style.cursor = 'pointer';

                        // Apply note color if available
                        if (note.color) {
                            noteDiv.style.borderLeft = `4px solid ${note.color}`;
                            noteDiv.style.paddingLeft = '12px';
                        }

                        noteDiv.innerHTML = `<strong>${note.title}</strong>`;
                        noteDiv.onclick = () => showNoteContent(note, url, index);
                        pinnedNotesContainer.appendChild(noteDiv);
                    }
                });
            }
        }
    }


    // Add caching for compiled regex patterns
    const patternCache = new Map();
    const MAX_CACHE_SIZE = 10000;
    let cacheEntries = 0;

    function cacheResult(key, value) {
        if (cacheEntries < MAX_CACHE_SIZE) {
            patternCache.set(key, value);
            cacheEntries++;
        }
        // Don't cache beyond limit, but don't evict either
    }

    function doesUrlMatchPattern(urlPatterns, currentUrl) {
        // Check simple pattern cache first
        const cacheKey = `${urlPatterns}|${currentUrl}`;
        if (patternCache.has(cacheKey)) {
            return patternCache.get(cacheKey);
        }

        // Split the pattern string into an array of patterns
        const patterns = urlPatterns.split(/\s+/).filter(pattern => pattern.trim() !== '');

        for (const pattern of patterns) {
            const result = matchSinglePattern(pattern, currentUrl);
            if (result) {
                // Cache positive results
                cacheResult(cacheKey, true);
                return true;
            }
        }

        // Cache negative results
        cacheResult(cacheKey, false);
        return false;
    }

    function matchSinglePattern(pattern, currentUrl) {
        // Handle exact match (no wildcards)
        if (!pattern.includes('*')) {
            return pattern === currentUrl;
        }

        const asteriskCount = countAsterisks(pattern)

        // Handle simple end double wildcard: "https://example.com/**"
        // Handle ** first, since * would catch **, also, ** more common
        if (pattern.endsWith('**') && asteriskCount === 2 ) {
            return currentUrl.startsWith(pattern.slice(0, -2));
        }

        // Handle simple end single wildcard: "https://example.com/*"
        if (pattern.endsWith('*') && asteriskCount === 1) {
            const prefix = pattern.slice(0, -1);
            if (!currentUrl.startsWith(prefix)) {
                return false;
            }
            // Check that the remaining part doesn't contain '/' (single segment only)
            const remaining = currentUrl.slice(prefix.length);
            return !remaining.includes('/');
        }

        // Handle simple start double wildcard: "**/path/to/page"
        if (pattern.startsWith('**') && asteriskCount === 2 ) {
            return currentUrl.endsWith(pattern.slice(2));
        }

        if (pattern.startsWith('https://**') && asteriskCount === 2 ) {
            return currentUrl.endsWith(pattern.slice(10));
        }

/*removed, because starting with * doesn't make much sense, because https://
        // Handle simple start wildcard: "* /path/to/page" ; space for multine comment
        if (pattern.startsWith('*') && !pattern.slice(1).includes('*')) {
            return currentUrl.endsWith(pattern.slice(1));
        }
*/
        // Handle patterns with only one * in the middle: "https://example.com/*/page"
        if (asteriskCount === 1 && !pattern.startsWith('*')) {
            const [prefix, suffix] = pattern.split('*');
            if (currentUrl.startsWith(prefix) && currentUrl.endsWith(suffix) &&
                currentUrl.length >= prefix.length + suffix.length) {

                // Extract the part that the * should match
                const matchedPart = currentUrl.slice(prefix.length, currentUrl.length - suffix.length);

                // Single * should not contain '/' (single level only)
                return !matchedPart.includes('/');
            }
            return false;
        }

        // Handle patterns with only one ** in the middle: "https://example.com/**/page"
        if (asteriskCount === 2 && pattern.includes('**')) {
            const [prefix, suffix] = pattern.split('**');
            return currentUrl.startsWith(prefix) && currentUrl.endsWith(suffix) &&
                   currentUrl.length >= prefix.length + suffix.length;
        }

        // For complex patterns, fall back to regex
        return matchComplexPattern(pattern, currentUrl);
    }

    function countAsterisks(str) {
        let count = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '*') count++;
        }
        return count;
    }

    function matchComplexPattern(pattern, currentUrl) {

        try {
            const regex = patternToRegex(pattern);
            return regex.test(currentUrl);
        } catch (e) {
            console.error('Invalid URL pattern:', pattern, e);
            return false;
        }
    }

    function patternToRegex(pattern) {
        // Escape special characters for regex
        const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const parts = pattern.split('*');
        let regexString = '^';

        for (let i = 0; i < parts.length; i++) {
            regexString += escapeRegex(parts[i]);
            if (i < parts.length - 1) {
                if (i < parts.length - 2 && parts[i + 1] === '') {
                    // '**' matches any number of path segments
                    regexString += '.*';
                    i++; // Skip the next empty part
                } else {
                    // Single '*' matches anything except '/'
                    regexString += '[^/]*';
                }
            }
        }

        regexString += '$';
        return new RegExp(regexString);
    }

    function showCurrentPageNotes() {
        const notes = getAllNotes();
        const currentUrl = window.location.href;
        let matchingNotes = [];

        // Collect all matching notes
        for (const urlPattern in notes) {
            if (doesUrlMatchPattern(urlPattern, currentUrl)) {
                matchingNotes.push({
                    pattern: urlPattern,
                    notes: notes[urlPattern]
                });
            }
        }

        const container = document.createElement('div');
        container.innerHTML = `
            <h3 class="modal-title">Notes for Current Page</h3>
            <div class="url-text">${currentUrl}</div>
        `;

        if (matchingNotes.length === 0) {
            container.innerHTML += '<p style="color: #6b7280;">No matching notes found for this page</p>';
        } else {
            matchingNotes.forEach(({pattern, notes: patternNotes}) => {
                const patternDiv = document.createElement('div');

                if (options.showUrlLinksInNotesList) {
                    patternDiv.innerHTML = `<div class="url-text">Pattern: ${pattern}</div>`;
                }
                patternNotes.forEach((note, index) => {
                    const noteDiv = document.createElement('div');
                    noteDiv.className = 'notes-list-item';

                    // Apply note color if available
                    if (note.color) {
                        noteDiv.style.borderLeft = `4px solid ${note.color}`;
                        noteDiv.style.paddingLeft = '12px';
                    }

                    // Add tags if available
                    let tagsHTML = '';
                    if (note.tags && note.tags.length > 0) {
                        tagsHTML = '<div style="margin-top: 4px;">';
                        note.tags.forEach(tag => {
                            tagsHTML += `<span class="notes-tag">${tag}</span>`;
                        });
                        tagsHTML += '</div>';
                    }

                    noteDiv.innerHTML = `
                        <div style="flex-grow: 1; display: flex; flex-direction: column;">
                            <span style="font-weight: 500;">${note.title}</span>
                            ${tagsHTML}
                        </div>
                        <button class="delete-note-button" title="Delete note">×</button>
                    `;

                    noteDiv.onclick = (e) => {
                        if (!e.target.classList.contains('delete-note-button')) {
                            container.parentElement.parentElement.remove();
                            showNoteContent(note, pattern, index);
                        }
                    };

                    noteDiv.querySelector('.delete-note-button').onclick = (e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this note?')) {
                            deleteNote(pattern, index);
                            noteDiv.remove();
                            if (patternNotes.length === 1) {
                                patternDiv.remove();
                            }
                        }
                    };

                    patternDiv.appendChild(noteDiv);
                });

                container.appendChild(patternDiv);
            });
        }

        // Add help button and dropdown
        const helpButton = document.createElement('button');
        helpButton.textContent = '?';
        helpButton.style.position = 'absolute';
        helpButton.style.top = '16px';
        helpButton.style.right = '56px';
        helpButton.style.width = '32px';
        helpButton.style.height = '32px';
        helpButton.style.borderRadius = '50%';
        helpButton.style.border = 'none';
        helpButton.style.background = isDarkMode ? '#374151' : '#e5e7eb';
        helpButton.style.color = isDarkMode ? '#f3f4f6' : '#4b5563';
        helpButton.style.fontSize = '18px';
        helpButton.style.cursor = 'pointer';
        helpButton.style.display = 'flex';
        helpButton.style.alignItems = 'center';
        helpButton.style.justifyContent = 'center';
        helpButton.title = 'URL Pattern Help';

        const helpDropdown = document.createElement('div');
        helpDropdown.style.position = 'absolute';
        helpDropdown.style.top = '52px';
        helpDropdown.style.right = '56px';
        helpDropdown.style.background = isDarkMode ? '#1f2937' : '#ffffff';
        helpDropdown.style.border = `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`;
        helpDropdown.style.borderRadius = '8px';
        helpDropdown.style.padding = '16px';
        helpDropdown.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        helpDropdown.style.zIndex = '10001';
        helpDropdown.style.display = 'none';
        helpDropdown.style.maxWidth = '300px';
        helpDropdown.style.color = isDarkMode ? '#f3f4f6' : '#4b5563';
        helpDropdown.innerHTML = `
            <strong>URL Pattern Examples:</strong><br>
            - https://domain.com/* (matches entire domain, one level deep)<br>
            - https://domain.com/** (matches entire domain, any number of levels)<br>
            - https://domain.com/specific/* (matches specific path and one level below)<br>
            - https://domain.com/specific/** (matches specific path and any levels below)<br>
            - https://domain.com/*/specific (matches specific ending, one level in between)<br>
            - https://domain.com/**/specific (matches specific ending, any number of levels in between)
        `;

        let isDropdownOpen = false;

        helpButton.onmouseenter = () => {
            if (!isDropdownOpen) {
                helpDropdown.style.display = 'block';
            }
        };

        helpButton.onmouseleave = () => {
            if (!isDropdownOpen) {
                helpDropdown.style.display = 'none';
            }
        };

        helpButton.onclick = () => {
            isDropdownOpen = !isDropdownOpen;
            helpDropdown.style.display = isDropdownOpen ? 'block' : 'none';
        };

        document.addEventListener('click', (e) => {
            if (isDropdownOpen && e.target !== helpButton && !helpDropdown.contains(e.target)) {
                isDropdownOpen = false;
                helpDropdown.style.display = 'none';
            }
        });

        container.appendChild(helpButton);
        container.appendChild(helpDropdown);

        createModal(container);
    }

    function showAllNotes() {
        const notes = getAllNotes();
        const container = document.createElement('div');
        container.innerHTML = '<h3 class="modal-title">All Notes</h3>';

        // Add search button
        const searchButton = document.createElement('button');
        searchButton.className = 'notes-button';
        searchButton.textContent = '🔍 Search Notes';
        searchButton.style.marginBottom = '16px';
        searchButton.onclick = showSearchModal;
        container.appendChild(searchButton);

        const notesPerPage = options.maxPatternsPerPage;
        let currentPage = 0;
        const urls = Object.keys(notes).sort();

        // Create a scrollable container for notes
        const notesWrapper = document.createElement('div');
        notesWrapper.id = 'notes-wrapper';
        if (options.scrollContentOnly) {
            notesWrapper.style.maxHeight = '60vh'; // Limit height to keep pagination visible
            notesWrapper.style.overflowY = 'auto';
        }
        notesWrapper.style.marginBottom = '8px';
        container.appendChild(notesWrapper);

        // Create a dedicated container for pagination controls
        const paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        paginationContainer.style.display = 'flex';
        paginationContainer.style.gap = '8px';
        paginationContainer.style.justifyContent = 'flex-end'; // Align buttons to the right
        container.appendChild(paginationContainer);

        function renderPage() {
            // Clear existing notes
            const existingNotesContainer = document.getElementById('notes-container');
            if (existingNotesContainer) {
                existingNotesContainer.remove();
            }

            const fragment = document.createDocumentFragment();
            const start = currentPage * notesPerPage;
            const end = Math.min(start + notesPerPage, urls.length);

            const notesContainer = document.createElement('div');
            notesContainer.id = 'notes-container';

            for (let i = start; i < end; i++) {
                const url = urls[i];
                const urlDiv = document.createElement('div');
                urlDiv.innerHTML = `<div class="url-text">${url}</div>`;
                const notesFragment = document.createDocumentFragment();
                notes[url].forEach((note, index) => {
                    const noteDiv = document.createElement('div');
                    noteDiv.className = 'notes-list-item';
                    noteDiv.dataset.url = url;
                    noteDiv.dataset.index = index;

                    if (note.color) {
                        noteDiv.style.borderLeft = `4px solid ${note.color}`;
                        noteDiv.style.paddingLeft = '12px';
                        const colorOpacity = isDarkMode ? '0.1' : '0.05';
                        noteDiv.style.backgroundColor = `${note.color}${colorOpacity}`;
                    }

                    let tagsHTML = '';
                    if (note.tags && note.tags.length > 0) {
                        tagsHTML = '<div style="margin-top: 4px;">';
                        note.tags.forEach(tag => {
                            tagsHTML += `<span class="notes-tag">${tag}</span>`;
                        });
                        tagsHTML += '</div>';
                    }

                    const pinnedIndicator = note.pinned ?
                          '<span title="Pinned" style="margin-right: 5px; color: #f59e0b;">📌</span>' : '';

                    noteDiv.innerHTML = `
                    <div style="flex-grow: 1; display: flex; flex-direction: column;">
                        <span style="font-weight: 500;">${pinnedIndicator}${note.title}</span>
                        ${tagsHTML}
                    </div>
                    <button class="delete-note-button" title="Delete note">×</button>
                `;

                    noteDiv.onclick = (e) => {
                        if (!e.target.classList.contains('delete-note-button')) {
                            container.parentElement.parentElement.remove();
                            showNoteContent(note, url, index);
                        }
                    };

                    noteDiv.querySelector('.delete-note-button').onclick = (e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this note?')) {
                            deleteNote(url, index);
                            noteDiv.remove();
                            if (notes[url].length === 1) {
                                urlDiv.remove();
                            }
                            // Update URLs and adjust page if needed
                            const newUrls = Object.keys(getAllNotes()).sort();
                            if (currentPage * notesPerPage >= newUrls.length) {
                                currentPage = Math.max(0, Math.floor((newUrls.length - 1) / notesPerPage));
                            }
                            renderPage();
                        }
                    };

                    notesFragment.appendChild(noteDiv);
                });

                urlDiv.appendChild(notesFragment);
                fragment.appendChild(urlDiv);
            }

            notesContainer.appendChild(fragment);
            notesWrapper.appendChild(notesContainer);

            // Update pagination controls
            paginationContainer.innerHTML = ''; // Clear previous buttons

            // Only show Previous button if not on first page
            if (currentPage > 0) {
                const prevButton = document.createElement('button');
                prevButton.className = 'notes-button secondary';
                prevButton.textContent = 'Previous';
                prevButton.onclick = () => {
                    currentPage--;
                    renderPage();
                    // Scroll to top of notes after page change
                    notesWrapper.scrollTop = 0;
                };
                paginationContainer.appendChild(prevButton);
            }

            // Only show Next button if not on last page
            if (end < urls.length) {
                const nextButton = document.createElement('button');
                nextButton.className = 'notes-button secondary';
                nextButton.textContent = 'Next';
                nextButton.onclick = () => {
                    currentPage++;
                    renderPage();
                    // Scroll to top of notes after page change
                    notesWrapper.scrollTop = 0;
                };
                paginationContainer.appendChild(nextButton);
            }
        }

        if (urls.length === 0) {
            container.innerHTML += '<p style="color: #6b7280;">No notes found</p>';
        } else {
            renderPage();
        }

        createModal(container);
    }

    let shortcutListenerAdded = false;

    function setupShortcutListener() {
        if (!shortcutListenerAdded) {
            document.addEventListener('keydown', shortcutHandler);
            shortcutListenerAdded = true;
        }
    }

    function updateShortcutListener() {
        // Only call this when options actually change
        document.removeEventListener('keydown', shortcutHandler);
        shortcutListenerAdded = false;
        setupShortcutListener();
    }

    function shortcutHandler(e) {
        if (matchShortcut(e, options.shortcuts.newNote)) {
            e.preventDefault();
            showNoteForm();
        }
        if (matchShortcut(e, options.shortcuts.currentPageNotes)) {
            e.preventDefault();
            showCurrentPageNotes();
        }
        if (matchShortcut(e, options.shortcuts.allNotes)) {
            e.preventDefault();
            showAllNotes();
        }
        if (matchShortcut(e, options.shortcuts.showOptions)) {
            e.preventDefault();
            showOptionsMenu();
        }
    }

    function matchShortcut(e, shortcut) {
        return e.ctrlKey === shortcut.ctrlKey &&
               e.shiftKey === shortcut.shiftKey &&
               e.altKey === shortcut.altKey &&
               e.key.toLowerCase() === shortcut.key.toLowerCase();
    }

    displayPinnedNotes();
    setupShortcutListener();

    // Register menu commands
    GM_registerMenuCommand('New Note', () => showNoteForm());
    GM_registerMenuCommand('View Notes (Current Page)', showCurrentPageNotes);
    GM_registerMenuCommand('View All Notes', showAllNotes);
    GM_registerMenuCommand('Options', showOptionsMenu);

})();