// ==UserScript==
// @name         GPT Prompt Manager: Deepseek and ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @author       Minhaz Mahmood
// @description  Manage, store, and quickly insert GPT prompts with categorization, templating, tagging, rating, and usage tracking.
// @match        *://chatgpt.com/*
// @match        *://deepseek.com/*
// @match        *://chat.deepseek.com/*
// @match        *://chat.openai.com/*
// @match        *://*.chat.openai.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527308/GPT%20Prompt%20Manager%3A%20Deepseek%20and%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/527308/GPT%20Prompt%20Manager%3A%20Deepseek%20and%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /***********************************************************************
     * Configuration
     ***********************************************************************/
    const CONFIG = {
        MAX_ITEMS: 200,
        MAX_FAVORITES: 10,
        TOAST_DURATION: 2000,
        CONFIRM_TIMEOUT: 5000,
        STORAGE_KEY: 'gpt-prompts',
        KEYBOARD_SHORTCUT: { ctrlKey: true, altKey: true, key: 'p' },
        TABS: ['Coding', 'Writing', 'Research', 'General', 'Templates', 'Archive'],
        // Selector for ChatGPT input field; update if ChatGPT's UI changes.
        CHATGPT_INPUT_SELECTOR: 'textarea[data-id="root"]'
    };

    /***********************************************************************
     * CSS Styles and UI Layout
     ***********************************************************************/
    const styles = `
        /* General transitions */
        .prompt-manager, .clip-toggle, .prompt-content, .prompt-bottom-actions,
        .prompt-header, .prompt-title, .prompt-close, .prompt-toast, .prompt-card,
        .prompt-preview, .prompt-actions, .prompt-btn, .prompt-search, .prompt-controls,
        .prompt-edit-icon, .prompt-save-icon, .prompt-drag-handle, .prompt-theme-toggle,
        .prompt-tabs, .prompt-tab, .prompt-tags, .prompt-import, .prompt-export {
            transition: all 0.2s ease;
        }

        /* Manager container */
        .prompt-manager {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 640px;
            height: 720px;
            background: #1a1b1e;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            opacity: 0;
            visibility: hidden;
            user-select: none;
            resize: both;
            overflow: hidden;
        }
        .prompt-manager.open {
            opacity: 1;
            visibility: visible;
        }

        /* Floating Toggle Button (exact as original) */
        .clip-toggle {
            position: fixed;
            right: 340px;
            top: 10px;
            background: #2c2d31;
            border: none;
            border-radius: 12px;
            padding: 12px;
            cursor: pointer;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .clip-toggle.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
        .clip-toggle:hover {
            transform: scale(1.05);
            background: #3a3b3f;
        }

        /* Header and Tabs */
        .prompt-header {
            padding: 10px 20px;
            color: #fff;
            border-bottom: 1px solid #2c2d31;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .prompt-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }
        .prompt-close {
            background: transparent;
            border: none;
            color: #6b7280;
            font-size: 24px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
        }
        .prompt-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        .prompt-tabs {
            display: flex;
            gap: 12px;
            padding: 0 20px;
            border-bottom: 1px solid #2c2d31;
            background: #24252a;
        }
        .prompt-tab {
            cursor: pointer;
            padding: 8px 12px;
            color: #ccc;
            border-bottom: 2px solid transparent;
        }
        .prompt-tab.active {
            color: #fff;
            border-color: #98c379;
        }

        /* Controls: Search, Theme Toggle, Import/Export */
        .prompt-controls {
            margin: 10px 20px;
            display: flex;
            gap: 16px;
            align-items: center;
            flex-wrap: wrap;
        }
        .prompt-search {
            background: #2c2d31;
            color: #fff;
            border: 1px solid #3a3b3f;
            padding: 8px 12px;
            border-radius: 6px;
            flex: 1;
        }
        .prompt-theme-toggle, .prompt-import, .prompt-export {
            background: #5a67d8;
            color: #fff;
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        .prompt-theme-toggle:hover, .prompt-import:hover, .prompt-export:hover {
            background: #6875f5;
        }

        /* Content Area */
        .prompt-content {
            flex: 1;
            overflow-y: auto;
            padding: 10px 20px;
            margin-bottom: 60px;
        }
        .prompt-content::-webkit-scrollbar {
            width: 6px;
        }
        .prompt-content::-webkit-scrollbar-track {
            background: #1a1b1e;
        }
        .prompt-content::-webkit-scrollbar-thumb {
            background: #2c2d31;
            border-radius: 3px;
        }
        .prompt-content::-webkit-scrollbar-thumb:hover {
            background: #3a3b3f;
        }

        /* Bottom Actions */
        .prompt-bottom-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: #2c2d31;
            border-radius: 0 0 16px 16px;
        }
        .prompt-save, .prompt-save-clipboard, .prompt-clear-all {
            height: 40px;
            padding: 0 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            line-height: 40px;
            white-space: nowrap;
            border: none;
        }
        .prompt-save {
            background: #98c379;
            color: #1a1b1e;
            box-shadow: 0 2px 8px rgba(152, 195, 121, 0.2);
        }
        .prompt-save:hover {
            background: #a9d389;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(152, 195, 121, 0.3);
        }
        .prompt-save:disabled {
            background: #4a4b4f;
            cursor: not-allowed;
        }
        .prompt-save-clipboard {
            background: #5a67d8;
            color: #fff;
            box-shadow: 0 2px 8px rgba(90, 103, 216, 0.2);
        }
        .prompt-save-clipboard:hover {
            background: #6875f5;
        }
        .prompt-clear-all {
            background: #dc2626;
            color: #fff;
            box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
            padding-right: 20px;
            text-align: center;
        }
        .prompt-clear-all:hover {
            background: #ef4444;
        }
        .prompt-clear-all.confirm {
            background: #991b1b;
        }

        /* Prompt Card Styles */
        .prompt-card {
            background: #2c2d31;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 12px;
            color: #fff;
            border: 1px solid #3a3b3f;
        }
        .prompt-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: #4a4b4f;
        }
        .prompt-title-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }
        .prompt-title-display {
            font-size: 16px;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
        }
        .prompt-edit-icon, .prompt-save-icon {
            background: transparent;
            border: none;
            color: #6b7280;
            font-size: 16px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
        }
        .prompt-edit-icon:hover, .prompt-save-icon:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        .prompt-preview {
            font-size: 14px;
            color: #d1d5db;
            margin: 4px 0 8px 0;
            line-height: 1.5;
            max-height: 90px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-word;
        }
        .prompt-info {
            font-size: 12px;
            color: #9ca3af;
            margin-bottom: 4px;
        }
        .prompt-tags {
            margin-top: 4px;
            font-size: 12px;
        }
        .prompt-tags span {
            color: #98c379;
            cursor: pointer;
            margin-right: 6px;
        }

        /* Action buttons within each prompt card */
        .prompt-actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            border-top: 1px solid #3a3b3f;
            padding-top: 8px;
            margin-top: 4px;
        }
        .prompt-btn {
            height: 32px;
            padding: 0 12px;
            background: transparent;
            border: 1px solid #4a4b4f;
            color: #fff;
            border-radius: 6px;
            font-size: 13px;
            line-height: 30px;
        }
        .prompt-btn:hover {
            background: #3a3b3f;
            border-color: #5a5b5f;
        }
        .prompt-btn.delete {
            color: #ef4444;
            border-color: #ef4444;
        }
        .prompt-btn.delete:hover {
            background: rgba(239, 68, 68, 0.1);
        }

        /* Rating stars */
        .prompt-rating {
            display: flex;
            gap: 4px;
            align-items: center;
            margin-right: auto;
        }
        .prompt-rating-star {
            cursor: pointer;
            color: #ccc;
        }
        .prompt-rating-star.filled {
            color: #ffc107;
        }

        /* Resize drag handle */
        .prompt-drag-handle {
            position: absolute;
            right: 2px;
            bottom: 2px;
            width: 16px;
            height: 16px;
            cursor: nwse-resize;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
        }

        /* Toast notification styling */
        .prompt-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: #fff;
            padding: 10px 16px;
            border-radius: 8px;
            z-index: 999999;
        }

        /* Light theme overrides */
        .prompt-manager[data-theme="light"] {
            background: #ffffff;
            color: #1a1b1e;
        }
        .prompt-manager[data-theme="light"] .prompt-search {
            background: #f0f0f0;
            color: #1a1b1e;
        }
        .prompt-manager[data-theme="light"] .prompt-card {
            background: #f8f8f8;
            color: #1a1b1e;
        }
    `;

    // Append the stylesheet to the document head.
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    /***********************************************************************
     * UI Elements: Manager Window & Floating Toggle Button
     ***********************************************************************/
    const manager = document.createElement('div');
    manager.className = 'prompt-manager';
    manager.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Manager HTML layout with header, tabs, controls, content, and bottom actions.
    manager.innerHTML = `
        <div class="prompt-header">
            <h2 class="prompt-title">GPT Prompt Manager</h2>
            <button class="prompt-close">×</button>
        </div>
        <div class="prompt-tabs">
            ${CONFIG.TABS.map(tab => `<div class="prompt-tab" data-tab="${tab}">${tab}</div>`).join('')}
        </div>
        <div class="prompt-controls">
            <input type="text" class="prompt-search" placeholder="Search prompts by title, content, or tag...">
            <button class="prompt-theme-toggle">Toggle Theme</button>
            <button class="prompt-import">Import</button>
            <button class="prompt-export">Export</button>
        </div>
        <div class="prompt-content"></div>
        <div class="prompt-bottom-actions">
            <button class="prompt-save-clipboard">Save Clipboard</button>
            <button class="prompt-save" disabled>Save Selection</button>
            <button class="prompt-clear-all">Clear All</button>
        </div>
        <div class="prompt-drag-handle"></div>
    `;

    // Floating toggle button using the exact SVG and styling from the original script.
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'clip-toggle';
    toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
    `;

    /***********************************************************************
     * GPT Prompt Manager Class Definition
     ***********************************************************************/
    class GptPromptManager {
        constructor() {
            this.prompts = this.loadPrompts();
            this.archivedPrompts = this.loadArchivedPrompts();
            this.isOpen = false;
            this.clearAllTimeout = null;
            this.searchTerm = '';
            this.activeTab = 'General';
            this.manualTheme = null; // null indicates following system preference
            this.activeTagFilter = '';

            // Append UI elements
            document.body.appendChild(manager);
            document.body.appendChild(toggleBtn);

            // Initialize events, theme detection, drag/resize, and initial render.
            this.initEvents();
            this.setupThemeDetection();
            this.makeDraggable();
            this.renderTabs();
            this.renderPrompts();
            this.updateSaveButton();
        }

        /***********************************************************************
         * Data Persistence: Loading & Saving Prompts
         ***********************************************************************/
        loadPrompts() {
            try {
                const saved = typeof GM_getValue !== 'undefined'
                    ? GM_getValue(CONFIG.STORAGE_KEY)
                    : localStorage.getItem(CONFIG.STORAGE_KEY);
                return saved ? JSON.parse(saved) : [];
            } catch (err) {
                console.error('Error loading prompts:', err);
                return [];
            }
        }

        loadArchivedPrompts() {
            try {
                const archived = typeof GM_getValue !== 'undefined'
                    ? GM_getValue(CONFIG.STORAGE_KEY + '_archived')
                    : localStorage.getItem(CONFIG.STORAGE_KEY + '_archived');
                return archived ? JSON.parse(archived) : [];
            } catch (err) {
                console.error('Error loading archived prompts:', err);
                return [];
            }
        }

        savePrompts() {
            try {
                const data = JSON.stringify(this.prompts);
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(CONFIG.STORAGE_KEY, data);
                } else {
                    localStorage.setItem(CONFIG.STORAGE_KEY, data);
                }
            } catch (err) {
                console.error('Error saving prompts:', err);
                this.showToast('Error saving prompts');
            }
        }

        saveArchivedPrompts() {
            try {
                const data = JSON.stringify(this.archivedPrompts);
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(CONFIG.STORAGE_KEY + '_archived', data);
                } else {
                    localStorage.setItem(CONFIG.STORAGE_KEY + '_archived', data);
                }
            } catch (err) {
                console.error('Error saving archived prompts:', err);
            }
        }

        /***********************************************************************
         * Theme Detection and Toggling
         ***********************************************************************/
        setupThemeDetection() {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', e => {
                if (this.manualTheme === null) {
                    manager.dataset.theme = e.matches ? 'dark' : 'light';
                }
            });
        }

        /***********************************************************************
         * Event Binding
         ***********************************************************************/
        initEvents() {
            // Toggle manager visibility
            toggleBtn.addEventListener('click', () => this.toggle());
            manager.querySelector('.prompt-close').addEventListener('click', () => this.close());

            // Save selected text as a new prompt
            document.addEventListener('selectionchange', () => this.updateSaveButton());
            manager.querySelector('.prompt-save').addEventListener('click', () => {
                const selection = window.getSelection().toString().trim();
                if (selection) {
                    this.addPrompt(selection);
                }
            });

            // Save clipboard text as a new prompt
            manager.querySelector('.prompt-save-clipboard').addEventListener('click', async () => {
                try {
                    const clipboardText = await navigator.clipboard.readText();
                    if (clipboardText.trim()) {
                        this.addPrompt(clipboardText);
                    } else {
                        this.showToast('Clipboard is empty');
                    }
                } catch (err) {
                    console.error('Clipboard error:', err);
                    this.showToast('Failed to read clipboard');
                }
            });

            // Clear all prompts (with confirmation)
            manager.querySelector('.prompt-clear-all').addEventListener('click', e => {
                this.handleClearAll(e.target);
            });

            // Tab switching
            manager.querySelectorAll('.prompt-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    this.activeTab = tab.dataset.tab;
                    this.activeTagFilter = '';
                    this.renderTabs();
                    this.renderPrompts();
                });
            });

            // Search functionality
            manager.querySelector('.prompt-search').addEventListener('input', e => {
                this.searchTerm = e.target.value.toLowerCase();
                this.activeTagFilter = '';
                this.renderPrompts();
            });

            // Theme toggle
            manager.querySelector('.prompt-theme-toggle').addEventListener('click', () => {
                if (this.manualTheme === 'dark') {
                    this.manualTheme = 'light';
                } else if (this.manualTheme === 'light') {
                    this.manualTheme = 'dark';
                } else {
                    this.manualTheme = (manager.dataset.theme === 'dark') ? 'light' : 'dark';
                }
                manager.dataset.theme = this.manualTheme;
            });

            // Import and Export prompts
            manager.querySelector('.prompt-import').addEventListener('click', () => this.importPrompts());
            manager.querySelector('.prompt-export').addEventListener('click', () => this.exportPrompts());

            // Global keyboard shortcut: Ctrl+Alt+P
            document.addEventListener('keydown', e => {
                if (e.ctrlKey === CONFIG.KEYBOARD_SHORTCUT.ctrlKey &&
                    e.altKey === CONFIG.KEYBOARD_SHORTCUT.altKey &&
                    e.key.toLowerCase() === CONFIG.KEYBOARD_SHORTCUT.key) {
                    e.preventDefault();
                    this.toggle();
                    const selection = window.getSelection().toString().trim();
                    if (selection) {
                        this.addPrompt(selection);
                    }
                }
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Delegate click events for prompt card actions
            manager.querySelector('.prompt-content').addEventListener('click', e => {
                const card = e.target.closest('.prompt-card');
                if (!card) return;
                const id = parseInt(card.dataset.id);

                if (e.target.classList.contains('prompt-edit-icon') ||
                    e.target.classList.contains('prompt-save-icon')) {
                    this.toggleEditTitle(id, card);
                } else if (e.target.classList.contains('delete')) {
                    if (this.activeTab === 'Archive') {
                        this.deleteArchivedPrompt(id);
                    } else {
                        this.removePrompt(id);
                    }
                } else if (e.target.classList.contains('favorite')) {
                    this.toggleFavorite(id);
                } else if (e.target.classList.contains('move-up')) {
                    e.stopPropagation();
                    this.movePrompt(id, -1);
                } else if (e.target.classList.contains('move-down')) {
                    e.stopPropagation();
                    this.movePrompt(id, 1);
                } else if (e.target.classList.contains('copy')) {
                    const text = card.querySelector('.prompt-preview').textContent;
                    this.copyText(text);
                } else if (e.target.classList.contains('insert')) {
                    const text = card.querySelector('.prompt-preview').textContent;
                    this.insertIntoChatGpt(text);
                    this.incrementUsage(id);
                } else if (e.target.classList.contains('prompt-rating-star')) {
                    const starValue = parseInt(e.target.dataset.value);
                    this.setRating(id, starValue);
                } else if (e.target.tagName === 'SPAN' && e.target.parentElement.classList.contains('prompt-tags')) {
                    // Filter by tag when clicked
                    this.activeTagFilter = e.target.textContent.slice(1).toLowerCase();
                    manager.querySelector('.prompt-search').value = '';
                    this.searchTerm = '';
                    this.renderPrompts();
                }
            });
        }

        /***********************************************************************
         * Draggable & Resizable Manager
         ***********************************************************************/
        makeDraggable() {
            const header = manager.querySelector('.prompt-header');
            header.addEventListener('mousedown', e => {
                e.preventDefault();
                const offsetX = e.clientX - manager.offsetLeft;
                const offsetY = e.clientY - manager.offsetTop;
                const onMouseMove = ev => {
                    manager.style.left = (ev.clientX - offsetX) + 'px';
                    manager.style.top = (ev.clientY - offsetY) + 'px';
                };
                const onMouseUp = () => document.removeEventListener('mousemove', onMouseMove);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp, { once: true });
            });

            // Enable resizing using the drag handle
            const dragHandle = manager.querySelector('.prompt-drag-handle');
            let isResizing = false, startX, startY, initialWidth, initialHeight;
            dragHandle.addEventListener('mousedown', e => {
                e.preventDefault();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                initialWidth = manager.offsetWidth;
                initialHeight = manager.offsetHeight;

                const onMouseMove = ev => {
                    if (isResizing) {
                        const newWidth = initialWidth + (ev.clientX - startX);
                        const newHeight = initialHeight + (ev.clientY - startY);
                        manager.style.width = newWidth + 'px';
                        manager.style.height = newHeight + 'px';
                    }
                };
                const onMouseUp = () => {
                    isResizing = false;
                    document.removeEventListener('mousemove', onMouseMove);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp, { once: true });
            });
        }

        /***********************************************************************
         * Prompt Operations: Add, Remove, and Modify Prompts
         ***********************************************************************/
        addPrompt(text) {
            const timestamp = Date.now();
            const category = this.activeTab !== 'Archive' ? this.activeTab : 'General';
            const promptItem = {
                id: timestamp,
                title: `Prompt-${timestamp}`,
                text: text.trim(),
                date: new Date().toISOString(),
                url: window.location.href,
                isFavorite: false,
                category,
                tags: [],
                usageCount: 0,
                rating: 0
            };

            // Insert at the beginning of non-favorite items.
            const index = this.prompts.findIndex(p => !p.isFavorite);
            this.prompts.splice(index === -1 ? this.prompts.length : index, 0, promptItem);

            // Enforce maximum prompt limit and archive older items if needed.
            if (this.prompts.length > CONFIG.MAX_ITEMS) {
                const nonFavorites = this.prompts.filter(p => !p.isFavorite);
                if (nonFavorites.length) {
                    const itemToArchive = nonFavorites[nonFavorites.length - 1];
                    this.archivedPrompts.unshift(itemToArchive);
                    this.prompts = this.prompts.filter(p => p.id !== itemToArchive.id);
                    this.saveArchivedPrompts();
                }
            }

            this.savePrompts();
            this.renderPrompts();
            this.showToast('Prompt saved');
        }

        removePrompt(id) {
            this.prompts = this.prompts.filter(p => p.id !== id);
            // Attempt to restore one archived prompt if available.
            if (this.archivedPrompts.length && this.prompts.length < CONFIG.MAX_ITEMS) {
                const restoreItem = this.archivedPrompts.find(p => !p.isFavorite);
                if (restoreItem) {
                    this.prompts.push(restoreItem);
                    this.archivedPrompts = this.archivedPrompts.filter(p => p.id !== restoreItem.id);
                    this.saveArchivedPrompts();
                    this.showToast('Restored a prompt from archive');
                }
            }
            this.savePrompts();
            this.renderPrompts();
            this.showToast('Prompt deleted');
        }

        deleteArchivedPrompt(id) {
            this.archivedPrompts = this.archivedPrompts.filter(p => p.id !== id);
            this.saveArchivedPrompts();
            this.renderPrompts();
            this.showToast('Archived prompt permanently deleted');
        }

        movePrompt(id, direction) {
            const idx = this.prompts.findIndex(p => p.id === id);
            if (idx === -1) return;
            const newIdx = idx + direction;
            if (newIdx < 0 || newIdx >= this.prompts.length) {
                this.showToast('Cannot move prompt further');
                return;
            }
            const item = this.prompts[idx];
            const target = this.prompts[newIdx];
            // Prevent moving across favorite boundaries.
            if ((item.isFavorite && !target.isFavorite) || (!item.isFavorite && target.isFavorite)) {
                this.showToast('Cannot move across favorite sections');
                return;
            }
            this.prompts.splice(idx, 1);
            this.prompts.splice(newIdx, 0, item);
            this.savePrompts();
            this.renderPrompts();
        }

        toggleFavorite(id) {
            const item = this.prompts.find(p => p.id === id);
            if (!item) return;
            const favoriteCount = this.prompts.filter(p => p.isFavorite).length;
            if (!item.isFavorite && favoriteCount >= CONFIG.MAX_FAVORITES) {
                this.showToast(`Maximum ${CONFIG.MAX_FAVORITES} favorites allowed`);
                return;
            }
            const idx = this.prompts.indexOf(item);
            this.prompts.splice(idx, 1);
            item.isFavorite = !item.isFavorite;
            if (item.isFavorite) {
                const lastFav = this.prompts.findLastIndex(p => p.isFavorite);
                this.prompts.splice(lastFav + 1, 0, item);
            } else {
                const firstNonFav = this.prompts.findIndex(p => !p.isFavorite);
                this.prompts.splice(firstNonFav === -1 ? this.prompts.length : firstNonFav, 0, item);
            }
            this.savePrompts();
            this.renderPrompts();
            this.showToast(item.isFavorite ? 'Marked as favorite' : 'Removed favorite');
        }

        copyText(text) {
            navigator.clipboard.writeText(text)
                .then(() => this.showToast('Copied to clipboard'))
                .catch(err => {
                    console.error('Copy error:', err);
                    this.showToast('Failed to copy text');
                });
        }

        insertIntoChatGpt(text) {
            const inputEl = document.querySelector(CONFIG.CHATGPT_INPUT_SELECTOR);
            if (inputEl) {
                inputEl.value = text;
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                this.showToast('Prompt inserted');
            } else {
                this.showToast('ChatGPT input field not found');
            }
        }

        incrementUsage(id) {
            const item = this.prompts.find(p => p.id === id);
            if (!item) return;
            item.usageCount = (item.usageCount || 0) + 1;
            this.savePrompts();
            this.renderPrompts();
        }

        setRating(id, value) {
            const item = this.prompts.find(p => p.id === id);
            if (!item) return;
            item.rating = value;
            this.savePrompts();
            this.renderPrompts();
        }

        /***********************************************************************
         * Edit Title and Tag Management
         ***********************************************************************/
        toggleEditTitle(id, card) {
            const titleEl = card.querySelector('.prompt-title-display');
            const editIcon = card.querySelector('.prompt-edit-icon');
            const saveIcon = card.querySelector('.prompt-save-icon');
            const item = this.getItemById(id);
            if (!item) return;

            if (titleEl.contentEditable !== 'true') {
                // Enable editing; show title and tags
                card.classList.add('editing');
                titleEl.contentEditable = 'true';
                titleEl.textContent = item.title + (item.tags.length ? `, ${item.tags.join(', ')}` : '');
                titleEl.focus();
                // Place the cursor at the end
                const range = document.createRange();
                range.selectNodeContents(titleEl);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                editIcon.style.display = 'none';
                saveIcon.style.display = 'inline-block';
            } else {
                // Save changes to title and tags
                const newText = titleEl.textContent.trim();
                if (!newText) {
                    this.showToast('Title cannot be blank');
                    return;
                }
                card.classList.remove('editing');
                titleEl.contentEditable = 'false';
                editIcon.style.display = 'inline-block';
                saveIcon.style.display = 'none';
                const [newTitle, ...tagParts] = newText.split(',');
                item.title = newTitle.trim();
                item.tags = tagParts.map(t => t.trim()).filter(t => t !== '');
                this.savePrompts();
                this.renderPrompts();
            }
        }

        getItemById(id) {
            return this.prompts.find(p => p.id === id) ||
                   this.archivedPrompts.find(p => p.id === id);
        }

        /***********************************************************************
         * Clear All Prompts with Confirmation
         ***********************************************************************/
        handleClearAll(button) {
            if (button.classList.contains('confirm')) {
                this.prompts = [];
                this.archivedPrompts = [];
                this.savePrompts();
                this.saveArchivedPrompts();
                this.renderPrompts();
                this.showToast('All prompts cleared');
                button.textContent = 'Clear All';
                button.classList.remove('confirm');
                if (this.clearAllTimeout) {
                    clearTimeout(this.clearAllTimeout);
                    this.clearAllTimeout = null;
                }
            } else {
                button.textContent = 'Confirm Clear?';
                button.classList.add('confirm');
                if (this.clearAllTimeout) clearTimeout(this.clearAllTimeout);
                this.clearAllTimeout = setTimeout(() => {
                    button.textContent = 'Clear All';
                    button.classList.remove('confirm');
                    this.clearAllTimeout = null;
                }, CONFIG.CONFIRM_TIMEOUT);
            }
        }

        /***********************************************************************
         * Render Tabs and Prompt List
         ***********************************************************************/
        renderTabs() {
            manager.querySelectorAll('.prompt-tab').forEach(tabEl => {
                tabEl.classList.toggle('active', tabEl.dataset.tab === this.activeTab);
            });
        }

        renderPrompts() {
            const content = manager.querySelector('.prompt-content');
            content.innerHTML = '';

            let itemsToRender = (this.activeTab === 'Archive')
                ? this.archivedPrompts
                : this.prompts.filter(p => p.category === this.activeTab);

            // Filter by search term and active tag
            itemsToRender = itemsToRender.filter(item => {
                const searchMatch = item.title.toLowerCase().includes(this.searchTerm) ||
                                    item.text.toLowerCase().includes(this.searchTerm);
                const tagMatch = this.activeTagFilter
                    ? item.tags.map(t => t.toLowerCase()).includes(this.activeTagFilter)
                    : true;
                return searchMatch && tagMatch;
            });

            // Sort: favorites first, then by rating and usage
            itemsToRender.sort((a, b) => {
                if (b.isFavorite !== a.isFavorite) return b.isFavorite ? 1 : -1;
                if (b.rating !== a.rating) return b.rating - a.rating;
                return b.usageCount - a.usageCount;
            });

            if (!itemsToRender.length) {
                content.innerHTML = `<div class="prompt-empty">
                    ${(this.searchTerm || this.activeTagFilter) ? 'No matching prompts found' : 'No prompts saved yet'}
                </div>`;
                return;
            }

            // Build HTML for each prompt card.
            content.innerHTML = itemsToRender.map(item => {
                const stars = [1,2,3,4,5].map(value => {
                    const filled = value <= item.rating ? 'filled' : '';
                    return `<span class="prompt-rating-star ${filled}" data-value="${value}">★</span>`;
                }).join('');

                return `
                    <div class="prompt-card ${item.isFavorite ? 'favorite' : ''}" data-id="${item.id}">
                        <div class="prompt-title-wrapper">
                            <button class="prompt-edit-icon">✎</button>
                            <div class="prompt-title-display">${item.title}</div>
                            <button class="prompt-save-icon" style="display:none;">💾</button>
                        </div>
                        <div class="prompt-preview">${item.text}</div>
                        <div class="prompt-info">
                            <span class="prompt-date">${new Date(item.date).toLocaleDateString()}</span>
                            <br>
                            <span class="prompt-url">[<a href="${item.url}" target="_blank">source</a>]</span>
                        </div>
                        <div class="prompt-tags">
                            ${item.tags.map(tag => `<span>#${tag}</span>`).join('')}
                        </div>
                        <div class="prompt-actions">
                            <div class="prompt-rating">${stars}</div>
                            <button class="prompt-btn favorite">${item.isFavorite ? '★' : '☆'}</button>
                            <button class="prompt-btn copy">Copy</button>
                            <button class="prompt-btn insert">Insert</button>
                            <button class="prompt-btn delete">Delete</button>
                            ${this.activeTab === 'Archive'
                                ? ''
                                : `<button class="prompt-btn move-up">↑</button>
                                   <button class="prompt-btn move-down">↓</button>`
                            }
                        </div>
                    </div>
                `;
            }).join('');
        }

        /***********************************************************************
         * Update Save Button Based on Selection
         ***********************************************************************/
        updateSaveButton() {
            const saveBtn = manager.querySelector('.prompt-save');
            if (!saveBtn) return;
            const selection = window.getSelection();
            saveBtn.disabled = !(selection && selection.toString().trim().length > 0);
        }

        /***********************************************************************
         * Open/Close Manager & Toast Notifications
         ***********************************************************************/
        toggle() {
            this.isOpen = !this.isOpen;
            manager.classList.toggle('open');
            // Do not hide the toggle icon once visible
            // (Remove 'hidden' class if present)
            toggleBtn.classList.remove('hidden');
        }

        close() {
            this.isOpen = false;
            manager.classList.remove('open');
            // Keep the toggle icon visible
            toggleBtn.classList.remove('hidden');
        }

        showToast(message) {
            const existing = document.querySelector('.prompt-toast');
            if (existing) existing.remove();
            const toast = document.createElement('div');
            toast.className = 'prompt-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), CONFIG.TOAST_DURATION);
        }

        /***********************************************************************
         * Import/Export Functionality
         ***********************************************************************/
        importPrompts() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'application/json';
            fileInput.addEventListener('change', e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = evt => {
                    try {
                        const data = JSON.parse(evt.target.result);
                        if (Array.isArray(data.prompts)) {
                            data.prompts.forEach(item => this.prompts.push(item));
                        }
                        if (Array.isArray(data.archivedPrompts)) {
                            data.archivedPrompts.forEach(item => this.archivedPrompts.push(item));
                        }
                        this.savePrompts();
                        this.saveArchivedPrompts();
                        this.renderPrompts();
                        this.showToast('Prompts imported successfully');
                    } catch (err) {
                        console.error('Import error:', err);
                        this.showToast('Failed to import file');
                    }
                };
                reader.readAsText(file);
            });
            fileInput.click();
        }

        exportPrompts() {
            const data = {
                prompts: this.prompts,
                archivedPrompts: this.archivedPrompts
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gpt-prompts-export.json';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
        }
    }

    // Instantiate the GPT Prompt Manager.
    new GptPromptManager();

})();
