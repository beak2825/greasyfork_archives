// ==UserScript==
// @name         BHD Saved Searches
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Adds combobox and related buttons to save searches
// @author       CodeX0
// @match        *://beyond-hd.me/library*
// @exclude      *://beyond-hd.me/library/title*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531212/BHD%20Saved%20Searches.user.js
// @updateURL https://update.greasyfork.org/scripts/531212/BHD%20Saved%20Searches.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('bhd-search-manager')) {
        return;
    }

    GM_addStyle(`
        #bhd-search-manager {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: 2%;
            margin-top: 10px;
        }
        #bhd-search-select {
            width: 200px !important;
            padding: 6px 10px !important;
            border-radius: 4px !important;
            border: 1px solid #766d61 !important;
        }
        .bhd-search-btn {
            background: #555c63 !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 6px 12px !important;
            cursor: pointer !important;
            font-size: 13px !important;
            white-space: nowrap;
        }
        .bhd-search-btn.delete {
            background: #800101 !important;
        }
        .bhd-search-btn:hover {
            opacity: 0.9;
        }
    `);

    class SearchManager {
        constructor() {
            this.searches = GM_getValue('librarySearches', []);
        }

        addSearch(name, url) {
            const cleanUrl = url.split('#')[0];

            if (this.searches.some(search => search.name === name || search.url === cleanUrl)) {
                return false;
            }

            this.searches.push({ name, url: cleanUrl });
            GM_setValue('librarySearches', this.searches);
            return true;
        }

        deleteSearch(name) {
            const initialLength = this.searches.length;
            this.searches = this.searches.filter(search => search.name !== name);

            if (this.searches.length !== initialLength) {
                GM_setValue('librarySearches', this.searches);
                return true;
            }
            return false;
        }

        getSearches() {
            return this.searches;
        }
    }

    class UI {
        constructor(searchManager) {
            this.searchManager = searchManager;
            this.createUI();
        }

        createUI() {
            const container = document.createElement('div');
            container.id = 'bhd-search-manager';

            this.selectBox = document.createElement('select');
            this.selectBox.id = 'bhd-search-select';

            const searchBtn = this.createButton('Search', () => this.loadSearch());
            const saveBtn = this.createButton('Save', () => this.saveSearch());
            const deleteBtn = this.createButton('Delete', () => this.deleteSearch(), 'delete');

            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = 'Saved Searches';
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            this.selectBox.appendChild(placeholderOption);

            this.updateSelectBox();

            container.appendChild(this.selectBox);
            container.appendChild(searchBtn);
            container.appendChild(saveBtn);
            container.appendChild(deleteBtn);

            this.addToPage(container);
        }

        createButton(text, onClick, className = '') {
            const btn = document.createElement('button');
            btn.className = `bhd-search-btn ${className}`;
            btn.textContent = text;
            btn.addEventListener('click', onClick);
            return btn;
        }

        addToPage(container) {
            const exactContainer = document.querySelector('.bhd-outer > #stickyBar > .text-center');

            const targetContainer = exactContainer ||
                                 document.querySelector('#stickyBar .text-center') ||
                                 document.querySelector('.text-center') ||
                                 document.querySelector('.navbar-header');

            if (targetContainer) {
                if (!targetContainer.querySelector('#bhd-search-manager')) {
                    targetContainer.appendChild(container);
                }
            } else {
                console.warn('Could not find suitable container for search manager');
            }
        }

        updateSelectBox() {
            while (this.selectBox.options.length > 1) {
                this.selectBox.remove(1);
            }

            this.searchManager.getSearches().forEach(search => {
                const option = document.createElement('option');
                option.value = search.url;
                option.textContent = search.name;
                this.selectBox.appendChild(option);
            });

            if (this.selectBox.options.length > 0) {
                this.selectBox.selectedIndex = 0;
            }
        }

        saveSearch() {
            const currentUrl = window.location.href;
            const searchName = prompt('Enter a name for this search:',
                `Search ${this.searchManager.getSearches().length + 1}`);

            if (searchName && searchName.trim()) {
                if (this.searchManager.addSearch(searchName.trim(), currentUrl)) {
                    this.updateSelectBox();
                    this.showMessage('Search saved successfully!');
                } else {
                    this.showMessage('This search already exists!', true);
                }
            }
        }

        loadSearch() {
            const selectedIndex = this.selectBox.selectedIndex;
            if (selectedIndex > 0) {
                const selectedUrl = this.selectBox.options[selectedIndex].value;
                window.location.href = selectedUrl;
            } else {
                this.showMessage('Please select a search first!', true);
            }
        }

        deleteSearch() {
            const selectedIndex = this.selectBox.selectedIndex;
            if (selectedIndex > 0) {
                const searchName = this.selectBox.options[selectedIndex].text;
                if (confirm(`Are you sure you want to delete "${searchName}"?`)) {
                    if (this.searchManager.deleteSearch(searchName)) {
                        this.updateSelectBox();
                        this.showMessage('Search deleted successfully!');
                    }
                }
            } else {
                this.showMessage('Please select a search to delete!', true);
            }
        }

        showMessage(text, isError = false) {
            const msg = document.createElement('div');
            msg.textContent = text;
            msg.style.position = 'fixed';
            msg.style.bottom = '20px';
            msg.style.right = '20px';
            msg.style.padding = '10px 15px';
            msg.style.backgroundColor = isError ? '#e74c3c' : '#2ecc71';
            msg.style.color = 'white';
            msg.style.borderRadius = '4px';
            msg.style.zIndex = '9999';
            document.body.appendChild(msg);

            setTimeout(() => {
                msg.style.transition = 'opacity 0.5s';
                msg.style.opacity = '0';
                setTimeout(() => msg.remove(), 500);
            }, 3000);
        }
    }

    function initializeSearchManager() {
        if (!window.location.pathname.includes('/library')) return;

        if (document.getElementById('bhd-search-manager')) return;

        const searchManager = new SearchManager();
        new UI(searchManager);
    }

    function setupObserver() {
        initializeSearchManager();

        const observer = new MutationObserver((mutations) => {
            let shouldInitialize = false;

            if (!document.getElementById('bhd-search-manager')) {
                const targetAreas = [
                    '.bhd-outer > #stickyBar > .text-center',
                    '#stickyBar .text-center',
                    '.text-center',
                    '.navbar-header'
                ];

                shouldInitialize = targetAreas.some(selector => {
                    const container = document.querySelector(selector);
                    return container && !container.querySelector('#bhd-search-manager');
                });
            }

            if (shouldInitialize) {
                initializeSearchManager();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupObserver);
    } else {
        setupObserver();
    }
})();