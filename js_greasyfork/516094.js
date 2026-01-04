// ==UserScript==
// @name         ChatGPT Clipboard Manager
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Modern simple clipboard manager for ChatGPT with persistent storage
// @author       OutlawRGB
// @match        *://chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516094/ChatGPT%20Clipboard%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/516094/ChatGPT%20Clipboard%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        MAX_ITEMS: 100,
        MAX_FAVORITES: 10,
        TOAST_DURATION: 2000,
        CONFIRM_TIMEOUT: 5000,
        STORAGE_KEY: 'chatgpt-clips',
    };

    const styles = `
        .clip-manager, .clip-toggle, .clip-content, .clip-bottom-actions,
        .clip-header, .clip-title, .clip-title-wrapper, .clip-title-display,
        .clip-close, .clip-toast, .clip-card, .clip-preview,
        .clip-actions, .clip-btn, .clip-save, .clip-save-clipboard,
        .clip-clear-all, .clip-search, .clip-controls, .clip-empty,
        .clip-title-input, .clip-favorite, .clip-edit-icon, .clip-save-icon {
            transition: all 0.2s ease;
        }

        .clip-manager {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            height: 700px;
            background: #1a1b1e;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            flex-direction: column;
            opacity: 0;
            visibility: hidden;
            user-select: none;
        }

        .clip-manager.open {
            opacity: 1;
            visibility: visible;
        }

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
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

        .clip-header {
            padding: 20px;
            color: #fff;
            border-bottom: 1px solid #2c2d31;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .clip-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }

        .clip-title-display {
            font-size: 16px;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
        }

        .clip-title-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }

        .clip-close {
            background: transparent;
            border: none;
            color: #6b7280;
            font-size: 24px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
            line-height: 1;
        }

        .clip-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }

        .clip-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            margin-bottom: 70px;
        }

        .clip-content::-webkit-scrollbar {
            width: 6px;
        }

        .clip-content::-webkit-scrollbar-track {
            background: #1a1b1e;
        }

        .clip-content::-webkit-scrollbar-thumb {
            background: #2c2d31;
            border-radius: 3px;
        }

        .clip-content::-webkit-scrollbar-thumb:hover {
            background: #3a3b3f;
        }

        .clip-bottom-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: #2c2d31;
            border-radius: 0 0 16px 16px;
        }

        .clip-save, .clip-save-clipboard, .clip-clear-all {
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

        .clip-save {
            background: #98c379;
            color: #1a1b1e;
            box-shadow: 0 2px 8px rgba(152, 195, 121, 0.2);
        }

        .clip-save:hover {
            background: #a9d389;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(152, 195, 121, 0.3);
        }

        .clip-save:disabled {
            background: #4a4b4f;
            cursor: not-allowed;
        }

        .clip-save-clipboard {
            background: #5a67d8;
            color: white;
            box-shadow: 0 2px 8px rgba(90, 103, 216, 0.2);
        }

        .clip-save-clipboard:hover {
            background: #6875f5;
        }

        .clip-clear-all {
            background: #dc2626;
            color: white;
            box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
            padding-right: 20px;
            text-align: center;
        }

        .clip-clear-all:hover {
            background: #ef4444;
        }

        .clip-clear-all.confirm {
            background: #991b1b;
        }

        .clip-card {
            background: #2c2d31;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
            color: #fff;
            border: 1px solid #3a3b3f;
        }

        .clip-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: #4a4b4f;
        }

        .clip-preview {
            font-size: 14px;
            color: #d1d5db;
            margin: 8px 0 12px 0;
            line-height: 1.5;
            max-height: 100px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .clip-actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            border-top: 1px solid #3a3b3f;
            padding-top: 12px;
            margin-top: 8px;
        }

        .clip-btn {
            height: 32px;
            padding: 0 12px;
            background: transparent;
            border: 1px solid #4a4b4f;
            color: #fff;
            border-radius: 6px;
            font-size: 13px;
            line-height: 30px;
        }

        .clip-btn:hover {
            background: #3a3b3f;
            border-color: #5a5b5f;
        }

        .clip-btn.delete {
            color: #ef4444;
            border-color: #ef4444;
        }

        .clip-btn.delete:hover {
            background: rgba(239, 68, 68, 0.1);
        }

        .clip-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10003;
            font-size: 14px;
            line-height: 1.4;
        }

        .clip-manager[data-theme="light"] {
            background: #ffffff;
            color: #1a1b1e;
        }

        .clip-search {
            background: #2c2d31;
            color: #fff;
            border: 1px solid #3a3b3f;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 16px;
            width: 100%;
            flex: 1;
        }

        .clip-favorite {
            color: #ffd700;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 4px;
            margin-right: auto;
        }

        .clip-controls {
            margin-bottom: 20px;
            padding: 20px;
            display: flex;
            gap: 16px;
            align-items: center;
            flex-wrap: wrap;
            background: #1a1b1e;
            border-radius: 8px;
        }

        .clip-empty {
            text-align: center;
            font-size: 16px;
            color: #d1d5db;
            padding: 20px;
        }

        .clip-title-input {
            background: #2c2d31;
            color: #fff;
            border: 1px solid #3a3b3f;
            padding: 8px 12px;
            border-radius: 6px;
            flex: 1;
        }

        .clip-edit-icon, .clip-save-icon {
            background: transparent;
            border: none;
            color: #6b7280;
            font-size: 16px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
        }

        .clip-edit-icon:hover, .clip-save-icon:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
    `;

    const archiveStyles = `
        .clip-archived-counter {
            margin-top: 20px;
            padding: 16px;
            background: #2c2d31;
            border-radius: 8px;
            color: #6b7280;
            text-align: center;
            font-size: 14px;
        }

        .archived-line {
            height: 2px;
            background: #3a3b3f;
            margin-bottom: 12px;
            border-radius: 1px;
        }

        .clip-card.favorite {
            border-color: #ffd700;
            background: rgba(255, 215, 0, 0.05);
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles + archiveStyles;
    document.head.appendChild(styleSheet);

    const manager = document.createElement('div');
    manager.className = 'clip-manager';
    manager.innerHTML = `
        <div class="clip-header">
            <h2 class="clip-title">Clipboard Manager</h2>
            <button class="clip-close">×</button>
        </div>
        <div class="clip-controls">
            <input type="text" class="clip-search" placeholder="Search clips by title or content...">
        </div>
        <div class="clip-content"></div>
        <div class="clip-bottom-actions">
            <button class="clip-save-clipboard">Save Clipboard</button>
            <button class="clip-save" disabled>Save Selection</button>
            <button class="clip-clear-all">Clear All</button>
        </div>
    `;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'clip-toggle';
    toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
    `;

    class ClipboardManager {
        constructor() {
            this.items = this.loadItems();
            this.archivedItems = this.loadArchivedItems();
            this.isOpen = false;
            this.clearAllTimeout = null;
            this.searchTerm = '';
            this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            this.lastMouseY = 0;
            this.mouseMoveDelta = 0;

            this.init();
        }

        init() {
            document.body.appendChild(manager);
            document.body.appendChild(toggleBtn);
            this.bindEvents();
            this.setupThemeDetection();
            this.renderItems();
            this.updateSaveButton();
        }

        loadItems() {
            try {
                const items = typeof GM_getValue !== 'undefined' ?
                      GM_getValue(CONFIG.STORAGE_KEY) :
                localStorage.getItem(CONFIG.STORAGE_KEY);
                return items ? JSON.parse(items) : [];
            } catch (error) {
                console.error('Error loading items:', error);
                return [];
            }
        }

        loadArchivedItems() {
            try {
                const archived = typeof GM_getValue !== 'undefined' ?
                      GM_getValue(CONFIG.STORAGE_KEY + '_archived') :
                localStorage.getItem(CONFIG.STORAGE_KEY + '_archived');
                return archived ? JSON.parse(archived) : [];
            } catch (error) {
                console.error('Error loading archived items:', error);
                return [];
            }
        }

        saveItems() {
            try {
                const itemsJSON = JSON.stringify(this.items);
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(CONFIG.STORAGE_KEY, itemsJSON);
                } else {
                    localStorage.setItem(CONFIG.STORAGE_KEY, itemsJSON);
                }
            } catch (error) {
                console.error('Error saving items:', error);
                this.showToast('Error saving items');
            }
        }

        saveArchivedItems() {
            try {
                const archivedJSON = JSON.stringify(this.archivedItems);
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(CONFIG.STORAGE_KEY + '_archived', archivedJSON);
                } else {
                    localStorage.setItem(CONFIG.STORAGE_KEY + '_archived', archivedJSON);
                }
            } catch (error) {
                console.error('Error saving archived items:', error);
            }
        }

        setupThemeDetection() {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                this.theme = e.matches ? 'dark' : 'light';
                this.updateTheme();
            });
        }

        updateTheme() {
            manager.dataset.theme = this.theme;
        }

        bindEvents() {
            toggleBtn.addEventListener('click', () => this.toggle());
            manager.querySelector('.clip-close').addEventListener('click', () => this.close());

            document.addEventListener('selectionchange', () => {
                this.updateSaveButton();
            });

            manager.querySelector('.clip-save').addEventListener('click', () => {
                const selection = window.getSelection().toString().trim();
                if (selection) {
                    this.addItem(selection);
                }
            });

            manager.querySelector('.clip-save-clipboard').addEventListener('click', async () => {
                try {
                    const clipboardText = await navigator.clipboard.readText();
                    if (clipboardText.trim()) {
                        this.addItem(clipboardText);
                    } else {
                        this.showToast('Clipboard is empty');
                    }
                } catch (err) {
                    this.showToast('Failed to read clipboard');
                    console.error('Failed to read clipboard:', err);
                }
            });

            manager.querySelector('.clip-clear-all').addEventListener('click', (e) => {
                this.handleClearAll(e.target);
            });

            manager.querySelector('.clip-search').addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderItems();
            });

            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    this.toggle();
                    const selection = window.getSelection().toString().trim();
                    if (selection) {
                        this.addItem(selection);
                    }
                }
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            const content = manager.querySelector('.clip-content');

            content.addEventListener('click', (e) => {
                if (e.target.classList.contains('clip-card') || 
                    e.target.classList.contains('clip-preview') ||
                    e.target.classList.contains('clip-title-wrapper') ||
                    e.target.classList.contains('clip-info') ||
                    e.target.classList.contains('clip-actions') ||
                    e.target.classList.contains('clip-date')) {
                    return;
                }
            
                const card = e.target.closest('.clip-card');
                if (!card) return;
            
                const id = parseInt(card.dataset.id);
            
                if (e.target.classList.contains('clip-edit-icon') || e.target.classList.contains('clip-save-icon')) {
                    this.toggleEditTitle(id, card);
                } else if (e.target.classList.contains('delete')) {
                    this.removeItem(id);
                } else if (e.target.classList.contains('favorite')) {
                    this.toggleFavorite(id);
                } else if (e.target.classList.contains('move-up')) {
                    e.stopPropagation();
                    this.moveItem(id, -1);
                } else if (e.target.classList.contains('move-down')) {
                    e.stopPropagation();
                    this.moveItem(id, 1);
                } else if (e.target.classList.contains('copy')) {
                    const text = card.querySelector('.clip-preview').textContent;
                    this.copyItem(text);
                }
            });
        }

        moveItem(id, direction) {
            const index = this.items.findIndex(item => item.id === id);
            if (index === -1) return;

            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= this.items.length) {
                this.showToast('Cannot move item further');
                return;
            }

            const item = this.items[index];
            const targetItem = this.items[newIndex];

            if ((item.isFavorite && !targetItem.isFavorite) || (!item.isFavorite && targetItem.isFavorite)) {
                this.showToast('Cannot move items between favorite and non-favorite sections');
                return;
            }

            this.items.splice(index, 1);
            this.items.splice(newIndex, 0, item);

            this.saveItems();
            this.renderItems();
        }

        addItem(text) {
            const timestamp = Date.now();
            const item = {
                id: timestamp,
                title: `Saved-${timestamp}`,
                text: text.trim(),
                date: new Date().toISOString(),
                isFavorite: false
            };

            const firstNonFavoriteIdx = this.items.findIndex(i => !i.isFavorite);
            this.items.splice(firstNonFavoriteIdx === -1 ? this.items.length : firstNonFavoriteIdx, 0, item);

            if (this.items.length > CONFIG.MAX_ITEMS) {
                const nonFavoriteItems = this.items.filter(item => !item.isFavorite);
                if (nonFavoriteItems.length > 0) {
                    const itemToArchive = nonFavoriteItems[nonFavoriteItems.length - 1];
                    this.archivedItems.unshift(itemToArchive);
                    this.items = this.items.filter(item => item.id !== itemToArchive.id);
                    this.saveArchivedItems();
                }
            }

            this.saveItems();
            this.renderItems();
            this.showToast('Item saved to clipboard manager');
        }

        removeItem(id) {
            const removedItem = this.items.find(item => item.id === id);
            this.items = this.items.filter(item => item.id !== id);

            if (this.archivedItems.length > 0 && this.items.length < CONFIG.MAX_ITEMS) {
                const itemToRestore = this.archivedItems.find(item => !item.isFavorite);
                if (itemToRestore) {
                    this.items.push(itemToRestore);
                    this.archivedItems = this.archivedItems.filter(item => item.id !== itemToRestore.id);
                    this.saveArchivedItems();
                    this.showToast('Restored item from archive');
                }
            }

            this.saveItems();
            this.renderItems();
            this.showToast('Item deleted');
        }

        toggleFavorite(id) {
            const item = this.items.find(item => item.id === id);
            if (!item) return;

            const favoriteCount = this.items.filter(i => i.isFavorite).length;

            if (!item.isFavorite && favoriteCount >= CONFIG.MAX_FAVORITES) {
                this.showToast(`Cannot add more than ${CONFIG.MAX_FAVORITES} favorites`);
                return;
            }

            const currentIndex = this.items.indexOf(item);
            this.items.splice(currentIndex, 1);

            item.isFavorite = !item.isFavorite;

            if (item.isFavorite) {
                const lastFavoriteIdx = this.items.findLastIndex(i => i.isFavorite);
                this.items.splice(lastFavoriteIdx + 1, 0, item);
            } else {
                const firstNonFavoriteIdx = this.items.findIndex(i => !i.isFavorite);
                this.items.splice(firstNonFavoriteIdx === -1 ? this.items.length : firstNonFavoriteIdx, 0, item);
            }

            this.saveItems();
            this.renderItems();
            this.showToast(item.isFavorite ? 'Added to favorites' : 'Removed from favorites');
        }

        async copyItem(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.showToast('Copied to clipboard');
            } catch (err) {
                this.showToast('Failed to copy text');
                console.error('Failed to copy text:', err);
            }
        }

        handleClearAll(button) {
            if (button.classList.contains('confirm')) {
                this.items = [];
                this.archivedItems = [];
                this.saveItems();
                this.saveArchivedItems();
                this.renderItems();
                this.showToast('All items cleared');
                button.textContent = 'Clear All';
                button.classList.remove('confirm');
                if (this.clearAllTimeout) {
                    clearTimeout(this.clearAllTimeout);
                    this.clearAllTimeout = null;
                }
            } else {
                button.textContent = 'Confirm Clear?';
                button.classList.add('confirm');

                if (this.clearAllTimeout) {
                    clearTimeout(this.clearAllTimeout);
                }

                this.clearAllTimeout = setTimeout(() => {
                    button.textContent = 'Clear All';
                    button.classList.remove('confirm');
                    this.clearAllTimeout = null;
                }, CONFIG.CONFIRM_TIMEOUT);
            }
        }

        updateSaveButton() {
            const saveBtn = manager.querySelector('.clip-save');
            if (!saveBtn) return;

            const selection = window.getSelection();
            const hasSelection = selection && selection.toString().trim().length > 0;
            saveBtn.disabled = !hasSelection;
        }

        toggle() {
            this.isOpen = !this.isOpen;
            manager.classList.toggle('open');
            toggleBtn.classList.toggle('hidden');
        }

        close() {
            this.isOpen = false;
            manager.classList.remove('open');
            toggleBtn.classList.remove('hidden');
        }

        showToast(message) {
            const existingToast = document.querySelector('.clip-toast');
            if (existingToast) {
                existingToast.remove();
            }

            const toast = document.createElement('div');
            toast.className = 'clip-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), CONFIG.TOAST_DURATION);
        }

        toggleEditTitle(id, card) {
            const titleDisplay = card.querySelector('.clip-title-display');
            const editIcon = card.querySelector('.clip-edit-icon');
            const saveIcon = card.querySelector('.clip-save-icon');

            if (!titleDisplay.contentEditable || titleDisplay.contentEditable === 'false') {
                card.classList.add('editing');
                titleDisplay.contentEditable = 'true';
                titleDisplay.focus();

                const range = document.createRange();
                range.selectNodeContents(titleDisplay);
                range.collapse(false);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                editIcon.style.display = 'none';
                saveIcon.style.display = 'inline-block';

                titleDisplay.addEventListener('input', function() {
                    if (this.textContent.length > 32) {
                        this.textContent = this.textContent.slice(0, 32);
                        const range = document.createRange();
                        range.selectNodeContents(this);
                        range.collapse(false);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                });
            } else {
                const newTitle = titleDisplay.textContent.trim();
                if (!newTitle) {
                    this.showToast('Title cannot be blank');
                    return;
                }

                card.classList.remove('editing');
                const item = this.items.find(item => item.id === id);
                if (item) {
                    item.title = newTitle;
                    this.saveItems();
                }

                titleDisplay.contentEditable = 'false';
                editIcon.style.display = 'inline-block';
                saveIcon.style.display = 'none';
            }
        }

        renderItems() {
            const content = manager.querySelector('.clip-content');
            content.innerHTML = '';

            const filteredItems = this.items
            .filter(item => {
                const searchMatch = (
                    item.title.toLowerCase().includes(this.searchTerm) ||
                    item.text.toLowerCase().includes(this.searchTerm)
                );
                return searchMatch;
            })
            .sort((a, b) => b.isFavorite - a.isFavorite);

            if (filteredItems.length === 0) {
                content.innerHTML = `
                    <div class="clip-empty">
                        ${this.searchTerm ? 'No matching items found' : 'No items saved yet'}
                    </div>`;
                return;
            }

            content.innerHTML = filteredItems.map(item => `
                <div class="clip-card ${item.isFavorite ? 'favorite' : ''}" data-id="${item.id}">
                    <div class="clip-title-wrapper">
                        <button class="clip-edit-icon">✎</button>
                        <div class="clip-title-display">${item.title}</div>
                        <button class="clip-save-icon" style="display:none;">💾</button>
                    </div>
                    <div class="clip-preview">${item.text}</div>
                    <div class="clip-info">
                        <span class="clip-date">${new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div class="clip-actions">
                        <button class="clip-btn favorite">${item.isFavorite ? '★' : '☆'}</button>
                        <button class="clip-btn copy">Copy</button>
                        <button class="clip-btn delete">Delete</button>
                        <button class="clip-btn move-up">↑</button>
                        <button class="clip-btn move-down">↓</button>
                    </div>
                </div>
            `).join('');

            if (this.archivedItems.length > 0) {
                const archivedCounter = document.createElement('div');
                archivedCounter.className = 'clip-archived-counter';
                archivedCounter.innerHTML = `
                    <div class="archived-line"></div>
                    <span><strong>${this.archivedItems.length}</strong> items in archive</span>
                `;
                content.appendChild(archivedCounter);
            }
        }
    }

    window.clipManager = new ClipboardManager();
})();