// ==UserScript==
// @name         Custom Shortcuts for Zendesk
// @namespace    http://tampermonkey.net/
// @version      7.2.2
// @description  Add custom shortcuts to Zendesk autocomplete menu with content insertion, filtering, a draggable/resizable shortcut manager with copy functionality, constrained within viewport. Includes theme switching, an inline autocomplete feature, and visual effects.
// @author       Swiftlyx
// @match        https://*.zendesk.com/agent/*
// @match        https://expert-portal.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/508871/Custom%20Shortcuts%20for%20Zendesk.user.js
// @updateURL https://update.greasyfork.org/scripts/508871/Custom%20Shortcuts%20for%20Zendesk.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONSTANTS = {
        THEME: {
            LIGHT: 'light',
            DARK: 'dark',
            DEFAULT: 'light'
        },
        SELECTORS: {
            ZENDESK_EDITOR: 'div[data-test-id="ticket-rich-text-editor"] .ck-editor__editable',
            SIDEBAR_NAV: 'nav[data-test-id="support_nav"] > ul[data-garden-id="chrome.nav_list"]',
            SIDEBAR_CONTAINER: 'nav[data-test-id="support_nav"]',
            AUTO_MERGE_BUTTON: 'button[data-app-title="Auto Merge"]'
        },
        CATEGORIES: {
            pdfaid: ['pdfaid', 'pdf aid', 'aid'],
            pdfhouse: ['pdfhouse', 'pdf house', 'house'],
            howly: ['howly', 'howlydocs', 'howly docs'],
            askcrew: ['askcrew', 'ask crew', 'ask-crew'],
            expertssquad: ['expertssquad', 'experts squad'],
            anyexperts: ['anyexperts', 'any experts'],
            expertsonline: ['expertsonline', 'experts online']
        }
    };

    GM_addStyle(`
        #shortcutMenu {
            position: fixed;
            top: 50%;
            left: 0;
            width: 300px;
            height: 450px;
            background: white;
            color: #111;
            border: 1px solid #ccc;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: none;
            resize: both;
            overflow: hidden;
            min-width: 280px;
            min-height: 400px;
            flex-direction: column;
            box-sizing: border-box;
            transition: background 0.3s ease, backdrop-filter 0.3s ease;
        }

        #shortcutMenu.glass-effect {
            background: rgba(230, 230, 230, 0.75) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3);
            position: fixed; /* fix for stacking context */
        }

        /* Noise overlay */
        #shortcutMenu.glass-effect::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.05;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        #shortcutMenu[data-theme="dark"].glass-effect {
            background: rgba(45, 55, 72, 0.85) !important;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        #shortcutMenuHeader {
            background: #007bff;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: move;
            user-select: none;
            position: relative;
            overflow: hidden;
            min-height: 45px;
        }

        #shortcutMenu.glass-effect #shortcutMenuHeader {
            background: rgba(0, 123, 255, 0.8);
        }
        #shortcutMenu[data-theme="dark"].glass-effect #shortcutMenuHeader {
            background: rgba(44, 82, 130, 0.8);
        }

        #headerText {
            position: relative;
            z-index: 2;
            font-weight: bold;
            color: white;
        }

        #shortcutMenuControls {
            padding: 10px;
            border-bottom: 1px solid #ccc;
            background: white;
        }

        #shortcutMenu.glass-effect #shortcutMenuControls {
            background: transparent;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        #shortcutMenu[data-theme="dark"].glass-effect #shortcutMenuControls {
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        #shortcutMenuContent {
            overflow-y: auto;
            height: 100%;
            padding: 5px;
        }

        .shortcutItem {
            padding: 8px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            color: #333;
        }
        .shortcutItem:last-child { border-bottom: none; }
        #shortcutMenu[data-theme="light"] .shortcutItem:hover { background: #f0f0f0; }

        #shortcutMenu.glass-effect .shortcutItem:hover {
            background: rgba(0, 0, 0, 0.05) !important;
        }
        #shortcutMenu[data-theme="dark"].glass-effect .shortcutItem:hover {
            background: rgba(255, 255, 255, 0.1) !important;
        }

        .shortcut-name, .shortcutItem strong {
            font-weight: bold;
        }
        #shortcutMenu[data-theme="light"] .shortcut-name,
        #shortcutMenu[data-theme="light"] .shortcutItem strong {
            color: #111;
        }

        .shortcut-btn, #addShortcutButton, #exportShortcutsButton, #importShortcutsButton, #themeToggleButton, #effectsToggleButton {
            font-size: 12px;
            border-radius: 3px;
            cursor: pointer;
            margin: 2px;
            padding: 3px 6px;
            transition: background-color 0.2s, color 0.2s, border-color 0.2s;
            border: 1px solid transparent;
        }
        #shortcutMenu[data-theme="light"] .shortcut-btn,
        #shortcutMenu[data-theme="light"] #themeToggleButton,
        #shortcutMenu[data-theme="light"] #effectsToggleButton {
            background: #f8f8f8;
            color: #111;
            border-color: #ccc;
            opacity: 0.9;
        }
        #shortcutMenu[data-theme="light"] #addShortcutButton { background: #28a745; color: white; border-color: #28a745; }
        #shortcutMenu[data-theme="light"] #addShortcutButton:hover { background: #165926; }
        #shortcutMenu[data-theme="light"] #exportShortcutsButton,
        #shortcutMenu[data-theme="light"] #importShortcutsButton { background: #007bff; color: white; border-color: #007bff; }
        #shortcutMenu[data-theme="light"] #exportShortcutsButton:hover,
        #shortcutMenu[data-theme-="light"] #importShortcutsButton:hover { background: #0056b3; }

        #effectsToggleButton.effects-on { background-color: #007bff; color: white; border-color: #0056b3; }
        #effectsToggleButton.effects-off { background-color: #dc3545; color: white; border-color: #b21f2d; }
        #shortcutMenu[data-theme="dark"] #effectsToggleButton.effects-on { background-color: #2b6cb0; color: white; border-color: #2c5282; }
        #shortcutMenu[data-theme="dark"] #effectsToggleButton.effects-off { background-color: #c53030; color: white; border-color: #9b2c2c; }


        #shortcutMenu[data-theme="light"] .copyButton:hover { background-color: #45a049; color: white; }
        #shortcutMenu[data-theme="light"] .editButton:hover { background-color: #1976D2; color: white; }
        #shortcutMenu[data-theme="light"] .deleteButton:hover { background-color: #d32f2f; color: white; }
        .copyButton.copied { background-color: #4CAF50 !important; color: white !important; }

        #searchBox {
            width: 100%;
            padding: 5px;
            margin-top: 10px;
            margin-bottom: 10px;
            box-sizing: border-box;
            font-size: 12px;
            border-radius: 3px;
        }
        #shortcutMenu[data-theme="light"] #searchBox {
            background: #f8f8f8;
            border: 1px solid #ccc;
            color: #111;
            opacity: 0.9;
        }
        #sortButton, #searchTypeButton {
            font-size: 12px;
            border-radius: 3px;
            cursor: pointer;
            padding: 3px 5px;
            margin-right: 5px;
        }
        #shortcutMenu[data-theme="light"] #sortButton,
        #shortcutMenu[data-theme="light"] #searchTypeButton {
            background: #f8f8f8;
            border: 1px solid #ccc;
            color: #111;
            opacity: 0.9;
        }

        .shortcutItem.pdfaid, .autocomplete-item.pdfaid { background-color: rgba(252, 140, 136, 0.2); }
        .shortcutItem.pdfhouse, .autocomplete-item.pdfhouse { background-color: rgba(86, 67, 214, 0.2); }
        .shortcutItem.howly, .autocomplete-item.howly { background-color: rgba(15, 114, 255, 0.2); }
        .shortcutItem.askcrew, .autocomplete-item.askcrew { background-color: rgba(60, 173, 92, 0.2); }
        .shortcutItem.expertssquad, .autocomplete-item.expertssquad { background-color: rgba(10, 99, 117, 0.2); }
        .shortcutItem.anyexperts, .autocomplete-item.anyexperts { background-color: rgba(158, 184, 160, 0.2); }
        .shortcutItem.expertsonline, .autocomplete-item.expertsonline { background-color: rgba(106, 137, 167, 0.2); }

        /* Category Hover States */
        #shortcutMenu .shortcutItem.pdfaid:hover, #autocompleteMenu .autocomplete-item.pdfaid:hover, #autocompleteMenu .autocomplete-item.pdfaid.selected { background-color: rgba(252, 140, 136, 0.4) !important; }
        #shortcutMenu .shortcutItem.pdfhouse:hover, #autocompleteMenu .autocomplete-item.pdfhouse:hover, #autocompleteMenu .autocomplete-item.pdfhouse.selected { background-color: rgba(86, 67, 214, 0.4) !important; }
        #shortcutMenu .shortcutItem.howly:hover, #autocompleteMenu .autocomplete-item.howly:hover, #autocompleteMenu .autocomplete-item.howly.selected { background-color: rgba(15, 114, 255, 0.4) !important; }
        #shortcutMenu .shortcutItem.askcrew:hover, #autocompleteMenu .autocomplete-item.askcrew:hover, #autocompleteMenu .autocomplete-item.askcrew.selected { background-color: rgba(60, 173, 92, 0.4) !important; }
        #shortcutMenu .shortcutItem.expertssquad:hover, #autocompleteMenu .autocomplete-item.expertssquad:hover, #autocompleteMenu .autocomplete-item.expertssquad.selected { background-color: rgba(10, 99, 117, 0.4) !important; }
        #shortcutMenu .shortcutItem.anyexperts:hover, #autocompleteMenu .autocomplete-item.anyexperts:hover, #autocompleteMenu .autocomplete-item.anyexperts.selected { background-color: rgba(158, 184, 160, 0.4) !important; }
        #shortcutMenu .shortcutItem.expertsonline:hover, #autocompleteMenu .autocomplete-item.expertsonline:hover, #autocompleteMenu .autocomplete-item.expertsonline.selected { background-color: rgba(106, 137, 167, 0.4) !important; }

        .shortcut-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border-radius: 4px;
            z-index: 10001;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        #shortcutMenu[data-theme="dark"] {
            background: #2d3748; color: #e2e8f0; border-color: #4a5568;
        }
        #shortcutMenu[data-theme="dark"] #shortcutMenuHeader { background: #2c5282; }
        #shortcutMenu[data-theme="dark"] #shortcutMenuControls {
            background: #2d3748; border-bottom-color: #4a5568;
        }
        #shortcutMenu[data-theme="dark"] .shortcutItem {
            border-bottom-color: #4a5568; color: #a0aec0;
        }
        #shortcutMenu[data-theme="dark"] .shortcutItem:hover { background: #4a5568; }
        #shortcutMenu[data-theme="dark"] .shortcut-name,
        #shortcutMenu[data-theme="dark"] .shortcutItem strong { color: #f7fafc; }
        #shortcutMenu[data-theme="dark"] #searchBox,
        #shortcutMenu[data-theme="dark"] #sortButton,
        #shortcutMenu[data-theme="dark"] #searchTypeButton,
        #shortcutMenu[data-theme="dark"] .shortcut-btn,
        #shortcutMenu[data-theme="dark"] #themeToggleButton,
        #shortcutMenu[data-theme="dark"] #effectsToggleButton {
            background: #4a5568; color: #e2e8f0; border-color: #718096;
            opacity: 0.9;
        }
        #shortcutMenu[data-theme="dark"] #addShortcutButton { background: #2f855a; border-color: #276749; }
        #shortcutMenu[data-theme="dark"] #addShortcutButton:hover { background: #276749; }
        #shortcutMenu[data-theme="dark"] .shortcut-btn:hover { background-color: #718096; color: #f7fafc; }
        #shortcutMenu[data-theme="dark"] .copyButton:hover { background-color: #38a169 !important; color: white !important; }
        #shortcutMenu[data-theme="dark"] .editButton:hover { background-color: #2b6cb0 !important; color: white !important; }
        #shortcutMenu[data-theme="dark"] .deleteButton:hover { background-color: #c53030 !important; color: white !important; }

        #autocompleteMenu {
            position: absolute;
            z-index: 10002;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            max-height: 250px;
            overflow-y: auto;
            border-radius: 4px;
        }
        #autocompleteMenu .autocomplete-item {
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            border-bottom: 1px solid #eee;
        }
        #autocompleteMenu .autocomplete-item:last-child { border-bottom: none; }

        #autocompleteMenu .autocomplete-item span {
            font-size: 12px;
            white-space: normal;
            word-break: break-word;
            display: block;
        }

        #autocompleteMenu[data-theme="light"] .autocomplete-item:hover,
        #autocompleteMenu[data-theme="light"] .autocomplete-item.selected { background-color: #f0f0f0; }
        #autocompleteMenu[data-theme="light"] .autocomplete-item strong { color: #111; }
        #autocompleteMenu[data-theme="light"] .autocomplete-item span { color: #555; }

        #autocompleteMenu[data-theme="dark"] { background: #2d3748; border-color: #4a5568; }
        #autocompleteMenu[data-theme="dark"] .autocomplete-item { border-bottom-color: #4a5568; }
        #autocompleteMenu[data-theme="dark"] .autocomplete-item:hover,
        #autocompleteMenu[data-theme="dark"] .autocomplete-item.selected { background-color: #4a5568; }
        #autocompleteMenu[data-theme="dark"] .autocomplete-item strong { color: #f7fafc; }
        #autocompleteMenu[data-theme="dark"] .autocomplete-item span { color: #a0aec0; }

        /* Floating Button for Expert Portal */
        #custom-floating-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #007bff;
            color: white;
            border: none;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s, background-color 0.2s;
        }
        #custom-floating-button:hover {
            transform: scale(1.1);
            background-color: #0056b3;
        }
    `);

    const StateManager = {
        getShortcuts() {
            return JSON.parse(GM_getValue('shortcuts', '[]'));
        },
        saveShortcuts(shortcuts) {
            GM_setValue('shortcuts', JSON.stringify(shortcuts));
        },
        getTheme() {
            return GM_getValue('theme', CONSTANTS.THEME.DEFAULT);
        },
        setTheme(theme) {
            GM_setValue('theme', theme);
        },
        getEffectsEnabled() {
            return GM_getValue('effectsEnabled', false);
        },
        setEffectsEnabled(enabled) {
            GM_setValue('effectsEnabled', enabled);
        },
        getSavedManagerState() {
            return JSON.parse(GM_getValue('shortcutMenuState', 'null'));
        },
        saveManagerState(state) {
            GM_setValue('shortcutMenuState', JSON.stringify(state));
        },
        getFloatingButtonPos() {
            return JSON.parse(GM_getValue('floatingButtonPos', 'null'));
        },
        saveFloatingButtonPos(pos) {
            GM_setValue('floatingButtonPos', JSON.stringify(pos));
        },
        getSidebarPositions() {
            return JSON.parse(GM_getValue('sidebarPositions', 'null'));
        },
        saveSidebarPositions(pos) {
            GM_setValue('sidebarPositions', JSON.stringify(pos));
        }
    };

    const EffectsManager = {
        updateState() {
            const enabled = StateManager.getEffectsEnabled();
            const toggleBtn = document.getElementById('effectsToggleButton');
            const menu = document.getElementById('shortcutMenu');

            if (enabled) {
                toggleBtn.classList.add('effects-on');
                toggleBtn.classList.remove('effects-off');
                menu.classList.add('glass-effect');
                toggleBtn.textContent = 'Glass ON';
            } else {
                toggleBtn.classList.add('effects-off');
                toggleBtn.classList.remove('effects-on');
                menu.classList.remove('glass-effect');
                toggleBtn.textContent = 'Glass OFF';
            }
        }
    };

    const ShortcutManager = {
        shortcuts: [],

        init() {
            this.shortcuts = StateManager.getShortcuts();
        },

        add(name, content) {
            this.shortcuts.push({ name, content, dateAdded: Date.now() });
            this.save();
        },

        update(index, name, content) {
            const old = this.shortcuts[index];
            this.shortcuts[index] = { ...old, name, content };
            this.save();
        },

        delete(index) {
            this.shortcuts.splice(index, 1);
            this.save();
        },

        save() {
            StateManager.saveShortcuts(this.shortcuts);
            UIManager.renderShortcuts();
        },

        getSorted(sortBy, ascending) {
            let sorted = [...this.shortcuts];
            sorted.sort((a, b) => {
                let comparison = 0;
                let valA, valB;
                if (sortBy === 'name') {
                    valA = a.name ? a.name.toLowerCase() : '';
                    valB = b.name ? b.name.toLowerCase() : '';
                    comparison = valA.localeCompare(valB);
                } else if (sortBy === 'date') {
                    valA = a.dateAdded || 0;
                    valB = b.dateAdded || 0;
                    comparison = valA - valB;
                }
                return ascending ? comparison : -comparison;
            });
            return sorted;
        },

        checkCategory(text) {
            const categories = [];
            const lowerText = text.toLowerCase();

            const containsWholeWord = (str, word) => {
                const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return new RegExp('\\b' + escapedWord + '\\b', 'i').test(str);
            };

            for (const [cat, keywords] of Object.entries(CONSTANTS.CATEGORIES)) {
                for (const keyword of keywords) {
                    if (keyword.includes(' ')) {
                        if (lowerText.includes(keyword.toLowerCase())) {
                            categories.push(cat);
                            break;
                        }
                    } else {
                        if (containsWholeWord(lowerText, keyword)) {
                            categories.push(cat);
                            break;
                        }
                    }
                }
            }
            return categories;
        }
    };

    const UIManager = {
        elements: {},
        isGlobalDragging: false,

        init() {
            document.addEventListener('dragstart', () => { this.isGlobalDragging = true; });
            document.addEventListener('dragend', () => { this.isGlobalDragging = false; });
            this.createMenu();
            this.createAutocompleteMenu();
            this.initLauncher();
            this.bindEvents();
            this.applyTheme(StateManager.getTheme());
            this.renderShortcuts();

            const resizeObserver = new ResizeObserver(() => {
                this.saveMenuState();
            });
            resizeObserver.observe(this.elements.menu);

            const state = StateManager.getSavedManagerState();
            if (state) {
                this.elements.menu.style.top = state.top || 'calc(50% - 225px)';
                this.elements.menu.style.left = state.left || '20px';
                this.elements.menu.style.width = state.width || '300px';
                this.elements.menu.style.height = state.height || '450px';
            } else {
                this.elements.menu.style.top = 'calc(50% - 225px)';
                this.elements.menu.style.left = '20px';
            }

            EffectsManager.updateState();
        },

        createMenu() {
            const menu = document.createElement('div');
            menu.id = 'shortcutMenu';
            menu.innerHTML = `
                <div id="shortcutMenuHeader">
                    <span id="headerText">Shortcut Manager</span>
                </div>
                <div id="shortcutMenuControls">
                     <select id="sortButton">
                         <option value="">Sort Shortcuts</option>
                         <option value="name-asc">Name ↑</option>
                         <option value="name-desc">Name ↓</option>
                         <option value="date-asc">Date ↑</option>
                         <option value="date-desc">Date ↓</option>
                     </select>
                     <select id="searchTypeButton">
                         <option value="all">Search All</option>
                         <option value="name">Search Name</option>
                         <option value="content">Search Content</option>
                     </select>
                     <button id="themeToggleButton"></button>
                     <button id="effectsToggleButton">Glass OFF</button>
                     <input type="text" id="searchBox" placeholder="Search shortcuts...">
                     <button id="addShortcutButton">Add Shortcut</button>
                     <button id="exportShortcutsButton">Export</button>
                     <button id="importShortcutsButton">Import</button>
                </div>
                <div id="shortcutMenuContent">
                     <div id="shortcutList"></div>
                </div>
            `;
            document.body.appendChild(menu);
            this.elements.menu = menu;
            this.elements.shortcutList = document.getElementById('shortcutList');
            this.elements.searchBox = document.getElementById('searchBox');
            this.elements.sortButton = document.getElementById('sortButton');
            this.elements.searchTypeButton = document.getElementById('searchTypeButton');
            this.elements.themeToggle = document.getElementById('themeToggleButton');

            this.makeDraggable(menu, document.getElementById('shortcutMenuHeader'));
        },

        createAutocompleteMenu() {
            const menu = document.createElement('div');
            menu.id = 'autocompleteMenu';
            document.body.appendChild(menu);
            this.elements.autocompleteMenu = menu;
        },

        initLauncher() {
            if (window.location.hostname.includes('zendesk.com')) {
                this.injectSidebarButton();
            } else {
                this.injectFloatingButton();
            }
        },

        injectFloatingButton() {
            const btn = document.createElement('button');
            btn.id = 'custom-floating-button';
            btn.title = 'Open Shortcuts';
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`;
            document.body.appendChild(btn);

            const pos = StateManager.getFloatingButtonPos();
            if (pos) {
                btn.style.left = pos.left;
                btn.style.top = pos.top;
                btn.style.bottom = 'auto';
                btn.style.right = 'auto';
            }

            btn.addEventListener('click', (e) => {
                // Determine if it was a drag or a click
                if (btn.getAttribute('data-dragging') === 'true') return;
                this.toggleMenu();
            });

            this.makeDraggable(btn, null, (newLeft, newTop) => {
                StateManager.saveFloatingButtonPos({ left: newLeft + 'px', top: newTop + 'px' });
            });
        },

        injectSidebarButton() {
            let debounceTimer;
            const observer = new MutationObserver((mutations) => {
                if (this.isDragging || this.isGlobalDragging) return;

                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if (this.isDragging || this.isGlobalDragging) return;

                    const navLists = document.querySelectorAll(CONSTANTS.SELECTORS.SIDEBAR_NAV);

                    if (navLists.length > 0) {
                        this.enforceIconPositions();


                        const lastList = navLists[navLists.length - 1];
                        let listItem = document.getElementById('custom-shortcut-sidebar-li');

                        if (!listItem) {
                            listItem = document.createElement('li');
                            listItem.id = 'custom-shortcut-sidebar-li';
                            listItem.setAttribute('data-garden-id', 'chrome.nav_list_item');
                            listItem.setAttribute('data-garden-version', '8.0.0');
                            listItem.draggable = true;

                            if (lastList.firstElementChild) {
                                listItem.className = lastList.firstElementChild.className;
                            } else {
                                listItem.className = 'StyledNavListItem-sc-18cj2v7-0 bbgdDD';
                            }


                            const svgIcon = `
                         <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="StyledBaseIcon-sc-1moykgb-0 StyledNavItemIcon-sc-7w9rpt-0 eWlVPJ YOjtB">
                             <line x1="8" y1="6" x2="21" y2="6"></line>
                             <line x1="8" y1="12" x2="21" y2="12"></line>
                             <line x1="8" y1="18" x2="21" y2="18"></line>
                             <line x1="3" y1="6" x2="3.01" y2="6"></line>
                             <line x1="3" y1="12" x2="3.01" y2="12"></line>
                             <line x1="3" y1="18" x2="3.01" y2="18"></line>
                         </svg>
                         `;

                            const buttonHtml = `
                            <button tabindex="0" title="Custom Shortcuts" id="custom-shortcut-sidebar-btn" class="StyledBaseNavItem-sc-zvo43f-0 StyledNavButton-sc-f5ux3-0 gvFgbC bkva-dj" style="justify-content: center; width: 100%; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
                                <span style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%;">
                                    ${svgIcon}
                                </span>
                            </button>
                         `;

                            listItem.innerHTML = buttonHtml;
                            lastList.appendChild(listItem);

                            this.attachDragEvents(listItem);

                            const btn = listItem.querySelector('button');
                            if (btn) {
                                btn.style.pointerEvents = 'all';
                                const siblingBtn = lastList.querySelector('button');
                                if (siblingBtn) btn.className = siblingBtn.className;

                                btn.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    this.toggleMenu();
                                });
                            }

                            this.enforceIconPositions();
                        }
                    }
                }, 100);
            });

            if (!this.dragEventsInitialized) {
                document.addEventListener('dragover', (e) => {
                    if (!this.isDragging) return; // FIX: Only handle drag if it's our item
                    const sidebarContainer = e.target.closest(CONSTANTS.SELECTORS.SIDEBAR_CONTAINER);
                    if (sidebarContainer) {
                        e.preventDefault();
                        const afterElement = this.getDragAfterElement(sidebarContainer, e.clientY);
                        const draggable = document.getElementById('custom-shortcut-sidebar-li');

                        if (draggable) {
                            if (afterElement == null) {
                                const lists = sidebarContainer.querySelectorAll('ul[data-garden-id="chrome.nav_list"]');
                                if (lists.length > 0) {
                                    lists[lists.length - 1].appendChild(draggable);
                                }
                            } else {
                                afterElement.parentNode.insertBefore(draggable, afterElement);
                            }
                        }
                    }
                });

                document.addEventListener('drop', (e) => {
                    const sidebarContainer = e.target.closest(CONSTANTS.SELECTORS.SIDEBAR_CONTAINER);
                    if (sidebarContainer) {
                        this.saveCurrentPositions();
                    }
                });
                this.dragEventsInitialized = true;
            }

            observer.observe(document.body, { childList: true, subtree: true });
        },

        enforceIconPositions() {
            const positions = StateManager.getSidebarPositions();
            if (!positions) return;

            const navLists = document.querySelectorAll(CONSTANTS.SELECTORS.SIDEBAR_NAV);

            const place = (element, pos) => {
                if (pos && pos.listIndex !== undefined && pos.listIndex < navLists.length) {
                    const list = navLists[pos.listIndex];
                    if (pos.itemIndex !== undefined && pos.itemIndex <= list.children.length) { // Allow <= for appending
                        const currentIdx = Array.from(list.children).indexOf(element);
                        if (element.parentNode !== list || currentIdx !== pos.itemIndex) {
                            if (pos.itemIndex < list.children.length) {
                                list.insertBefore(element, list.children[pos.itemIndex]);
                            } else {
                                list.appendChild(element);
                            }
                        }
                    } else if (element.parentNode !== list) {
                        list.appendChild(element);
                    }
                }
            };

            const customIcon = document.getElementById('custom-shortcut-sidebar-li');
            if (customIcon) {
                place(customIcon, positions.custom);
            }

            const autoMergeBtn = document.querySelector(CONSTANTS.SELECTORS.AUTO_MERGE_BUTTON);
            if (autoMergeBtn) {
                let current = autoMergeBtn;
                while (current && current.tagName !== 'LI') {
                    current = current.parentElement;
                }
                const autoMergeLi = current;
                if (autoMergeLi) {
                    place(autoMergeLi, positions.autoMerge);
                }
            }
        },

        saveCurrentPositions() {
            const navLists = document.querySelectorAll(CONSTANTS.SELECTORS.SIDEBAR_NAV);
            const positions = {};

            const getPos = (element) => {
                const list = element.closest(CONSTANTS.SELECTORS.SIDEBAR_NAV);
                if (list) {
                    let listIndex = -1;
                    for (let i = 0; i < navLists.length; i++) {
                        if (navLists[i] === list) {
                            listIndex = i;
                            break;
                        }
                    }
                    const itemIndex = Array.from(list.children).indexOf(element);
                    return { listIndex, itemIndex };
                }
                return null;
            };

            const customIcon = document.getElementById('custom-shortcut-sidebar-li');
            if (customIcon) positions.custom = getPos(customIcon);

            const autoMergeBtn = document.querySelector(CONSTANTS.SELECTORS.AUTO_MERGE_BUTTON);
            if (autoMergeBtn) {
                let current = autoMergeBtn;
                while (current && current.tagName !== 'LI') {
                    current = current.parentElement;
                }
                if (current) positions.autoMerge = getPos(current);
            }

            StateManager.saveSidebarPositions(positions);
        },

        getDragAfterElement(container, y) {
            // Select ALL list items in the sidebar container, excluding the draggable itself
            const draggableElements = [...container.querySelectorAll('li[data-garden-id="chrome.nav_list_item"]:not(#custom-shortcut-sidebar-li)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        },

        attachDragEvents(element) {
            element.addEventListener('dragstart', () => {
                this.isDragging = true;
                element.classList.add('dragging');
                element.style.opacity = '0.5';
            });

            element.addEventListener('dragend', () => {
                this.isDragging = false;
                element.classList.remove('dragging');
                element.style.opacity = '1';
                // Final enforcement ensure everything is correct after drag ends, but let drop handler save first
                setTimeout(() => this.enforceIconPositions(), 100);
            });
        },

        toggleMenu() {
            const isHidden = this.elements.menu.style.display === 'none';
            if (isHidden) {
                this.renderShortcuts();
            }
            this.elements.menu.style.display = isHidden ? 'flex' : 'none';
        },

        renderShortcuts() {
            const sortBy = this.elements.sortButton.value.split('-')[0] || 'name';
            const ascending = (this.elements.sortButton.value.split('-')[1] || 'asc') === 'asc';

            const shortcuts = ShortcutManager.getSorted(sortBy, ascending);

            this.elements.shortcutList.innerHTML = '';
            shortcuts.forEach(shortcut => {
                const item = document.createElement('div');
                item.className = 'shortcutItem';

                const cats = ShortcutManager.checkCategory(shortcut.name + ' ' + shortcut.content);
                cats.forEach(c => item.classList.add(c));

                item.innerHTML = `
                    <strong>${shortcut.name}</strong><br>
                    ${shortcut.content.replace(/\n/g, '<br>')}
                    <div class="shortcutButtons">
                        <button class="copyButton shortcut-btn">Copy</button>
                        <button class="editButton shortcut-btn">Edit</button>
                        <button class="deleteButton shortcut-btn">Delete</button>
                    </div>
                `;
                this.elements.shortcutList.appendChild(item);
            });
            this.filterShortcuts();
        },

        filterShortcuts() {
            const query = this.elements.searchBox.value.toLowerCase();
            const searchType = this.elements.searchTypeButton.value;
            const items = this.elements.shortcutList.querySelectorAll('.shortcutItem');

            items.forEach(item => {
                const name = item.querySelector('strong').textContent.toLowerCase();
                const clone = item.cloneNode(true);
                const btns = clone.querySelector('.shortcutButtons');
                if (btns) btns.remove();
                const content = clone.textContent.toLowerCase();

                let isVisible = false;
                switch (searchType) {
                    case 'name': isVisible = name.includes(query); break;
                    case 'content': isVisible = content.includes(query); break;
                    default: isVisible = name.includes(query) || content.includes(query);
                }
                item.style.display = isVisible ? 'block' : 'none';
            });
        },

        bindEvents() {
            this.elements.themeToggle.addEventListener('click', () => {
                const current = StateManager.getTheme();
                const next = current === CONSTANTS.THEME.LIGHT ? CONSTANTS.THEME.DARK : CONSTANTS.THEME.LIGHT;
                this.applyTheme(next);
            });

            document.getElementById('effectsToggleButton').addEventListener('click', () => {
                const enabled = !StateManager.getEffectsEnabled();
                StateManager.setEffectsEnabled(enabled);
                EffectsManager.updateState();
            });

            this.elements.searchBox.addEventListener('input', () => this.filterShortcuts());
            this.elements.searchTypeButton.addEventListener('change', () => {
                GM_setValue('lastSearchType', this.elements.searchTypeButton.value);
                this.filterShortcuts();
            });
            this.elements.sortButton.addEventListener('change', (e) => {
                GM_setValue('lastSortOption', e.target.value);
                this.renderShortcuts();
            });

            document.getElementById('addShortcutButton').addEventListener('click', () => {
                const name = prompt("Enter shortcut name:");
                if (!name) return;
                const content = prompt("Enter shortcut content:");
                if (!content) return;
                ShortcutManager.add(name, content);
                this.showNotification('Shortcut added!');
            });

            this.elements.shortcutList.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;
                const item = e.target.closest('.shortcutItem');
                if (!item) return;

                const name = item.querySelector('strong').textContent;
                const shortcuts = ShortcutManager.shortcuts;
                const index = shortcuts.findIndex(s => s.name === name);

                if (index === -1) return;

                if (btn.classList.contains('deleteButton')) {
                    if (confirm(`Delete "${name}"?`)) {
                        ShortcutManager.delete(index);
                        this.showNotification('Shortcut deleted.');
                    }
                } else if (btn.classList.contains('editButton')) {
                    const old = shortcuts[index];
                    const newName = prompt("Edit name:", old.name);
                    if (!newName) return;
                    const newContent = prompt("Edit content:", old.content);
                    if (newContent === null) return;
                    ShortcutManager.update(index, newName, newContent);
                    this.showNotification('Shortcut updated.');
                } else if (btn.classList.contains('copyButton')) {
                    GM_setClipboard(shortcuts[index].content);
                    btn.classList.add('copied');
                    btn.textContent = 'Copied!';
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.textContent = 'Copy';
                    }, 1500);
                }
            });

            document.getElementById('exportShortcutsButton').addEventListener('click', () => {
                const blob = new Blob([JSON.stringify(ShortcutManager.shortcuts)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'shortcuts-backup.json';
                a.click();
                URL.revokeObjectURL(url);
                this.showNotification('Shortcuts exported!');
            });

            document.getElementById('importShortcutsButton').addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.style.display = 'none';
                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        try {
                            const data = JSON.parse(ev.target.result);
                            if (Array.isArray(data)) {
                                StateManager.saveShortcuts(data);
                                ShortcutManager.init();
                                this.showNotification('Imported successfully!');
                            }
                        } catch (err) {
                            this.showNotification('Import error', true);
                        }
                    };
                    reader.readAsText(file);
                });
                input.click();
            });
        },

        applyTheme(theme) {
            StateManager.setTheme(theme);
            this.elements.menu.setAttribute('data-theme', theme);
            if (this.elements.autocompleteMenu) {
                this.elements.autocompleteMenu.setAttribute('data-theme', theme);
            }
            this.elements.themeToggle.textContent = theme === CONSTANTS.THEME.LIGHT ? 'Light' : 'Dark';
        },

        showNotification(message, isError = false) {
            const notif = document.createElement('div');
            notif.className = 'shortcut-notification';
            notif.textContent = message;
            if (isError) notif.style.background = '#D32F2F';
            document.body.appendChild(notif);
            setTimeout(() => { if (notif.parentNode) notif.remove(); }, 3000);
        },

        makeDraggable(element, handle, onDragEnd) {
            const dragHandle = handle || element;
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            let isDragging = false;

            dragHandle.onmousedown = (e) => {
                // Don't start drag if clicking a button inside (unless it's the handle itself)
                if (e.target.tagName === 'BUTTON' && e.target !== dragHandle) return;

                // e.preventDefault(); // Commented out to allow focus
                pos3 = e.clientX;
                pos4 = e.clientY;
                isDragging = false;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            };

            const elementDrag = (e) => {
                e.preventDefault();
                isDragging = true;
                element.setAttribute('data-dragging', 'true');

                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                let newTop = Math.max(0, Math.min(element.offsetTop - pos2, window.innerHeight - element.offsetHeight));
                let newLeft = Math.max(0, Math.min(element.offsetLeft - pos1, window.innerWidth - element.offsetWidth));

                element.style.top = newTop + "px";
                element.style.left = newLeft + "px";
                // Reset bottom/right if they were set
                element.style.bottom = 'auto';
                element.style.right = 'auto';
            };

            const closeDragElement = () => {
                document.onmouseup = null;
                document.onmousemove = null;
                if (isDragging) {
                    setTimeout(() => element.setAttribute('data-dragging', 'false'), 0);
                    if (onDragEnd) {
                        onDragEnd(element.offsetLeft, element.offsetTop);
                    } else {
                        // Default logic for menu
                        this.saveMenuState();
                    }
                }
            };
        },

        saveMenuState() {
            const state = {
                top: this.elements.menu.style.top,
                left: this.elements.menu.style.left,
                width: this.elements.menu.style.width,
                height: this.elements.menu.style.height
            };
            StateManager.saveManagerState(state);
        }
    };

    const AutocompleteSystem = {
        activeInput: null,
        triggerRange: null,

        init() {
            document.addEventListener('keyup', this.handleKeyUp.bind(this));
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            document.addEventListener('click', (e) => {
                if (UIManager.elements.autocompleteMenu && !UIManager.elements.autocompleteMenu.contains(e.target)) {
                    this.hide();
                }
            });
        },

        handleKeyUp(e) {
            const editor = e.target.closest(CONSTANTS.SELECTORS.ZENDESK_EDITOR);
            if (editor) {
                if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Tab', 'Shift'].includes(e.key)) {
                    this.update(editor);
                }
            } else if (UIManager.elements.autocompleteMenu && UIManager.elements.autocompleteMenu.style.display !== 'none') {
                this.hide();
            }
        },

        handleKeyDown(e) {
            const menu = UIManager.elements.autocompleteMenu;
            if (!menu || menu.style.display === 'none') return;

            const items = menu.querySelectorAll('.autocomplete-item');
            if (items.length === 0) return;

            let selected = menu.querySelector('.autocomplete-item.selected');
            let currentIndex = selected ? parseInt(selected.dataset.index, 10) : -1;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % items.length;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + items.length) % items.length;
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                if (selected) {
                    const shortcutName = selected.querySelector('strong').textContent;
                    const shortcut = ShortcutManager.shortcuts.find(sc => sc.name === shortcutName);
                    if (shortcut) this.select(shortcut);
                }
                return;
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.hide();
                return;
            }

            if (selected) selected.classList.remove('selected');
            if (items[currentIndex]) {
                items[currentIndex].classList.add('selected');
                items[currentIndex].scrollIntoView({ block: 'nearest' });
            }
        },

        update(editorElement) {
            const selection = window.getSelection();
            if (!selection.rangeCount) { this.hide(); return; }

            const range = selection.getRangeAt(0).cloneRange();
            range.collapse(true);
            const container = range.startContainer;

            if (container.nodeType !== Node.TEXT_NODE || !editorElement.contains(container)) {
                this.hide();
                return;
            }

            const textBeforeCursor = container.textContent.substring(0, range.startOffset);
            const lastTriggerPos = textBeforeCursor.lastIndexOf('//');

            if (lastTriggerPos === -1 || /[\s\n]/.test(textBeforeCursor.substring(lastTriggerPos + 2))) {
                this.hide();
                return;
            }

            this.activeInput = editorElement;
            this.triggerRange = document.createRange();
            this.triggerRange.setStart(container, lastTriggerPos);
            this.triggerRange.setEnd(container, range.startOffset);

            const query = textBeforeCursor.substring(lastTriggerPos + 2).toLowerCase();
            const searchType = GM_getValue('lastSearchType', 'all');

            const filtered = ShortcutManager.shortcuts.filter(sc => {
                const name = sc.name.toLowerCase();
                const content = sc.content.toLowerCase();
                switch (searchType) {
                    case 'name': return name.includes(query);
                    case 'content': return content.includes(query);
                    default: return name.includes(query) || content.includes(query);
                }
            });

            this.renderMenu(filtered);
        },

        renderMenu(filtered) {
            const menu = UIManager.elements.autocompleteMenu;
            if (filtered.length > 0) {
                menu.innerHTML = '';
                filtered.forEach((sc, index) => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.dataset.index = index;

                    const cats = ShortcutManager.checkCategory(sc.name + ' ' + sc.content);
                    cats.forEach(c => item.classList.add(c));

                    item.innerHTML = `<strong>${sc.name}</strong><span>${sc.content}</span>`;
                    item.addEventListener('mousedown', e => { e.preventDefault(); this.select(sc); });
                    menu.appendChild(item);
                });

                const rect = this.triggerRange.getBoundingClientRect();
                const editorRect = this.activeInput.getBoundingClientRect();
                menu.style.display = 'block';
                menu.style.width = `${editorRect.width}px`;

                const menuHeight = menu.offsetHeight;
                const topPos = window.scrollY + rect.top - menuHeight - 5;
                menu.style.top = `${Math.max(0, topPos)}px`;
                menu.style.left = `${window.scrollX + rect.left}px`;

                menu.querySelector('.autocomplete-item')?.classList.add('selected');
            } else {
                this.hide();
            }
        },

        hide() {
            if (UIManager.elements.autocompleteMenu) {
                UIManager.elements.autocompleteMenu.style.display = 'none';
            }
            this.activeInput = null;
            this.triggerRange = null;
        },

        select(shortcut) {
            if (!this.activeInput || !this.triggerRange) return;

            this.activeInput.focus();
            const selection = window.getSelection();
            if (!selection) return;
            selection.removeAllRanges();
            selection.addRange(this.triggerRange);

            this.activeInput.dispatchEvent(new InputEvent('beforeinput', {
                inputType: 'deleteContent',
                bubbles: true,
                cancelable: true
            }));

            this.activeInput.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Delete',
                keyCode: 46,
                bubbles: true,
                cancelable: true
            }));

            setTimeout(() => {
                this.activeInput.dispatchEvent(new InputEvent('beforeinput', {
                    inputType: 'insertText',
                    data: shortcut.content,
                    bubbles: true,
                    cancelable: true
                }));
                document.execCommand('insertText', false, shortcut.content);
                this.hide();
            }, 0);
        }
    };

    function init() {
        ShortcutManager.init();
        UIManager.init();
        AutocompleteSystem.init();

        const lastSort = GM_getValue('lastSortOption', 'name-asc');
        UIManager.elements.sortButton.value = lastSort;
        const lastSearch = GM_getValue('lastSearchType', 'all');
        UIManager.elements.searchTypeButton.value = lastSearch;

        UIManager.renderShortcuts();
    }

    init();

})();
