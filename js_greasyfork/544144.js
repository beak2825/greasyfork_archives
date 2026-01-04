// ==UserScript==
// @name         Grok Feature Flags
// @namespace    http://tampermonkey.net/
// @version      4.2.0
// @description  View and modify feature flags.
// @author       Blankspeaker & Prism
// @match        https://grok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544144/Grok%20Feature%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/544144/Grok%20Feature%20Flags.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FLAGS_KEY = 'local_feature_flags';
    const DEFAULTS_KEY = 'default_feature_flags';
    const KNOWN_FLAGS_KEY = 'known_feature_flags';
    const NEW_FLAG_EXPIRATION = 24 * 60 * 60 * 1000;

    const PROBLEMATIC_FLAGS = [
        'THINKING_AUTO_OPEN',
        'SHOW_ANON_HELP_LINK',
        'ENABLE_IN_APP_REPORTING',
        'SHOW_X_BADGE',
        'SHOW_FAVORITE_BUTTON',
    ];

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --gff-surface-base: #171717;
                --gff-surface-l1: #202020;
                --gff-surface-l2: #2a2a2a;
                --gff-surface-l4-bg: rgba(30, 30, 30, 0.7);
                --gff-border-l1: #363636;
                --gff-text-primary: #f9fafb;
                --gff-text-secondary: #9ca3af;
                --gff-placeholder-text: rgba(249, 250, 251, 0.5);
                --gff-primary: #4f46e5;
                --gff-primary-hover: #4338ca;
                --gff-danger: #ef4444;
                --gff-warning: #facc15;
                --gff-new: #22d3ee;
                --gff-icon-neutral: #b5b5b5;
                --gff-button-ghost-hover: rgba(255, 255, 255, 0.05);
                --gff-badge-bg: #28282a;
                --gff-switch-checked-bg: #f9f8f6;
                --gff-switch-unchecked-bg: #515153;
                --gff-switch-checked-thumb-bg: #171717;
                --gff-switch-unchecked-thumb-bg: #2b2b2c;
                --gff-menu-item-bg: #3e3f42;
                --gff-menu-item-hover-bg: #4d4e51;
                --gff-save-bg: #e2e2e0;
                --gff-save-text: #111827;
                --gff-save-hover-bg: #d4d4d8;
            }
            .gff-overlay {
                position: fixed; inset: 0;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(2px);
                z-index: 9998; opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
            }
            .gff-overlay.visible { opacity: 1; pointer-events: auto; }
            .gff-modal {
                position: fixed; left: 50%; top: 50%;
                width: 90vw; max-width: 640px;
                height: 80vh; max-height: 700px;
                background-color: var(--gff-surface-base);
                border: 1px solid var(--gff-border-l1);
                border-radius: 1.5rem;
                z-index: 9999;
                display: flex; flex-direction: column;
                gap: 1rem; padding: 1.5rem;
                opacity: 0;
                transform: translate(-50%, -48%) scale(0.95);
                transition: opacity 0.2s ease, transform 0.2s ease;
                pointer-events: none;
            }
            .gff-modal.visible { opacity: 1; transform: translate(-50%, -50%) scale(1); pointer-events: auto; }
            .gff-modal * { box-sizing: border-box; }
            .gff-modal-header { display: flex; justify-content: space-between; align-items: center; }
            .gff-modal-header h2 { font-size: 1.125rem; font-weight: 600; color: var(--gff-text-primary); margin: 0; }
            .gff-modal-header .gff-button { color: var(--gff-text-primary); }
            .gff-modal-content {
                flex: 1; min-height: 0;
                overflow-y: hidden;
                display: flex; flex-direction: column; gap: 1rem;
            }
            .gff-controls-wrapper { display: flex; gap: 0.5rem; align-items: center; }
            .gff-flags-container {
                flex: 1; overflow-y: auto; padding-right: 0.5rem;
                display: flex; flex-direction: column; gap: 0.25rem;
            }
            .gff-flags-container:focus { outline: none; }
            .gff-modal-footer {
                display: flex; justify-content: flex-end; gap: 0.5rem;
                padding-top: 1rem; border-top: 1px solid var(--gff-border-l1);
            }
            .gff-search-input {
                flex: 1;
                display: flex; align-items: center; gap: 0.75rem;
                padding: 0 0.75rem;
                height: 40px;
                border-radius: 0.75rem;
                border: 1px solid var(--gff-border-l1);
                background-color: var(--gff-surface-l1);
            }
            .gff-search-input svg { color: var(--gff-icon-neutral); flex-shrink: 0; }
            .gff-search-input input {
                width: 100%; background: transparent; border: none; outline: none;
                color: var(--gff-text-primary); font-size: 0.875rem;
            }
            .gff-search-input input::placeholder { color: var(--gff-placeholder-text); }
            .gff-flag-row {
                display: flex; justify-content: space-between; align-items: center;
                gap: 1rem;
                padding: 0.5rem; border-radius: 0.5rem;
                transition: background-color 0.1s ease;
            }
            .gff-flag-row:hover { background-color: var(--gff-surface-l1); }
            .gff-new-badge, .gff-broken-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 2px 6px;
                border-radius: 6px;
                font-family: monospace;
                font-size: 0.8em;
                cursor: default;
                text-transform: uppercase;
                margin-left: 0.5rem;
            }
            .gff-new-badge {
                color: var(--gff-text-secondary);
                background-color: var(--gff-badge-bg);
            }
            .gff-broken-badge {
                color: var(--gff-text-secondary);
                background-color: var(--gff-badge-bg);
            }
            .gff-broken-badge.modified {
                background-color: var(--gff-danger);
                color: var(--gff-text-primary);
            }
            .gff-new-badge svg, .gff-broken-badge svg {
                stroke: var(--gff-icon-neutral);
            }
            .gff-broken-badge.modified svg {
                stroke: currentColor;
            }
            .gff-flag-row label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-family: monospace; font-size: 0.875rem;
                color: var(--gff-text-secondary); cursor: default;
                flex: 1;
                min-width: 0;
            }
            .gff-flag-row .gff-flag-row-label {
                word-break: break-word;
                transition: color 0.2s ease;
            }
            .gff-flag-row .gff-flag-row-label.modified { font-weight: 600; }
            .gff-flag-row .gff-flag-row-label.new { color: var(--gff-text-primary); }
            .gff-flag-row .gff-flag-row-label.problematic.modified { color: var(--gff-danger); }
            .gff-filter-dropdown { position: relative; }
            .gff-filter-button {
                display: flex; align-items: center; gap: 0.5rem;
                height: 40px; padding: 0 0.75rem; border-radius: 0.75rem;
                background-color: var(--gff-surface-l1);
                border: 1px solid var(--gff-border-l1);
                color: var(--gff-placeholder-text); font-size: 0.875rem; cursor: pointer;
                transition: background-color 0.1s ease;
            }
            .gff-filter-button:hover { background-color: var(--gff-surface-l2); }
            .gff-filter-button svg {
                width: 1rem; height: 1rem;
                stroke: var(--gff-icon-neutral);
                transition: transform 0.2s ease;
            }
            .gff-filter-dropdown.open .gff-filter-button svg { transform: rotate(180deg); }
            .gff-filter-menu {
                position: absolute; top: calc(100% + 4px); right: 0;
                width: 180px;
                background-color: var(--gff-surface-l4-bg);
                backdrop-filter: blur(8px);
                border: 1px solid var(--gff-border-l1);
                border-radius: 1rem;
                padding: 0.25rem;
                z-index: 10000;
                opacity: 0;
                transform-origin: top right;
                transform: scale(0.95);
                transition: opacity 0.1s ease, transform 0.1s ease;
                pointer-events: none;
            }
            .gff-filter-dropdown.open .gff-filter-menu { opacity: 1; transform: scale(1); pointer-events: auto; }
            .gff-filter-option {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 0.75rem;
                font-size: 0.875rem;
                border-radius: 0.75rem;
                color: var(--gff-placeholder-text);
                cursor: pointer;
            }
            .gff-filter-option:hover { background-color: var(--gff-button-ghost-hover); color: var(--gff-text-primary); }
            .gff-filter-option .gff-option-text { flex: 1; }
            .gff-filter-option .gff-main-icon {
                width: 1rem; height: 1rem;
                stroke: var(--gff-icon-neutral);
            }
            .gff-filter-option .gff-checkmark-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 1rem;
                height: 1rem;
            }
            .gff-filter-option .gff-checkmark {
                width: 1rem; height: 1rem;
                stroke: var(--gff-text-primary);
            }
            .gff-switch {
                display: inline-flex; height: 1.5rem; width: 2.75rem;
                flex-shrink: 0; cursor: pointer; align-items: center;
                border-radius: 9999px; border: 1px solid transparent;
                transition: background-color 0.2s ease-in-out;
            }
            .gff-switch[data-state="unchecked"] { background-color: var(--gff-switch-unchecked-bg); }
            .gff-switch[data-state="checked"] { background-color: var(--gff-switch-checked-bg); }
            .gff-switch-thumb {
                pointer-events: none; display: block;
                height: 1rem; width: 1rem;
                border-radius: 9999px;
                background-color: var(--gff-switch-unchecked-thumb-bg);
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
                transform: translateX(2px);
            }
            .gff-switch[data-state="checked"] .gff-switch-thumb {
                background-color: var(--gff-switch-checked-thumb-bg);
                transform: translateX(22px);
            }
            .gff-button {
                display: inline-flex; align-items: center; justify-content: center;
                gap: 0.5rem; height: 40px; padding: 0 1rem;
                border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem;
                cursor: pointer; transition: all 0.1s ease;
                border: 1px solid transparent;
            }
            .gff-button.icon-only { width: 40px; height: 40px; padding: 0; }
            .gff-button.variant-solid { background-color: var(--gff-primary); color: white; }
            .gff-button.variant-solid:hover { background-color: var(--gff-primary-hover); }
            .gff-button.variant-outline { border-color: var(--gff-border-l1); color: var(--gff-text-primary); }
            .gff-button.variant-outline:hover { background-color: var(--gff-button-ghost-hover); }
            .gff-button.variant-ghost { color: var(--gff-text-secondary); }
            .gff-button.variant-ghost:hover { background-color: var(--gff-button-ghost-hover); color: var(--gff-text-primary); }
            .gff-button.color-warning {
                background-color: rgba(250, 204, 21, 0.15);
                color: var(--gff-warning); border: none;
            }
            .gff-button.color-warning:hover {
                background-color: rgba(250, 204, 21, 0.25);
                color: var(--gff-warning);
            }
            .gff-button.save-button { background-color: var(--gff-save-bg); color: var(--gff-save-text); }
            .gff-button.save-button:hover { background-color: var(--gff-save-hover-bg); }
            .gff-notification {
                display: flex; padding: 1rem; border-radius: 0.5rem;
                border: 1px solid rgba(250, 204, 21, 0.3);
                background-image: linear-gradient(to right, rgba(250, 204, 21, 0.1), rgba(250, 204, 21, 0.05));
            }
            .gff-notification-content h3 { font-weight: 500; color: var(--gff-text-primary); margin:0; }
            .gff-notification-content p { font-size: 0.875rem; color: var(--gff-text-secondary); margin-top: 0.25rem; margin-bottom: 0; }
            .gff-menu-item {
                position: relative; display: flex; cursor: pointer; user-select: none;
                align-items: center; border-radius: 0.75rem;
                padding: 0.5rem 0.75rem; font-size: 0.875rem;
                background-color: var(--gff-menu-item-bg);
                color: var(--gff-text-primary);
                outline: none; transition: background-color 0.1s;
            }
            .gff-menu-item:hover { background-color: var(--gff-menu-item-hover-bg); }
            .gff-menu-item svg { margin-right: 0.5rem; }
            .gff-empty-state {
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                height: 100%; text-align: center; color: var(--gff-text-secondary);
            }
            .gff-empty-state svg { margin-bottom: 0.75rem; }
            .gff-empty-state h3 { font-size: 1rem; font-weight: 500; color: var(--gff-text-primary); margin: 0; }
            .gff-empty-state p { font-size: 0.875rem; margin-top: 0.25rem; margin-bottom: 0; }
            @media (max-width: 768px) {
                .gff-modal {
                    width: 95vw;
                    height: 85vh;
                    padding: 1rem;
                }
                .gff-modal-header h2 {
                    font-size: 1rem;
                }
                .gff-flag-row label {
                    font-size: 0.8rem;
                }
                .gff-modal-footer {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }
                .gff-modal-footer .gff-import-btn { grid-area: 1 / 1; }
                .gff-modal-footer .gff-export-btn { grid-area: 1 / 2; }
                .gff-modal-footer .gff-reset-btn { grid-area: 2 / 1; }
                .gff-modal-footer .gff-save-btn { grid-area: 2 / 2; }
                .gff-modal-footer .gff-button {
                    width: 100%;
                    padding: 0 0.5rem;
                    font-size: 0.8rem;
                    height: 44px;
                }
                .gff-notification-content h3 {
                    font-size: 0.9rem;
                }
                 .gff-notification-content p {
                    font-size: 0.8rem;
                }
            }
        `;
        document.head.append(style);
    }

    function createModal() {
        const overlay = document.createElement('div');
        overlay.className = 'gff-overlay';
        const modal = document.createElement('div');
        modal.className = 'gff-modal';
        const header = document.createElement('div');
        header.className = 'gff-modal-header';
        const title = document.createElement('h2');
        const closeBtn = createButton({
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
            variant: 'ghost', isIconOnly: true,
            onClick: () => toggle(false)
        });
        header.append(title, closeBtn);
        const content = document.createElement('div');
        content.className = 'gff-modal-content';
        const footer = document.createElement('div');
        footer.className = 'gff-modal-footer';
        modal.append(header, content, footer);
        document.body.append(overlay, modal);
        const toggle = (visible) => {
            overlay.classList.toggle('visible', visible);
            modal.classList.toggle('visible', visible);
        };
        overlay.onclick = () => toggle(false);
        return { modal, content, footer, title, toggle };
    }

    function createSwitch(key, checked, onToggle) {
        const button = document.createElement('button');
        button.type = 'button';
        button.role = 'switch';
        button.className = 'gff-switch';
        const thumb = document.createElement('span');
        thumb.className = 'gff-switch-thumb';
        button.append(thumb);
        const setState = (isChecked) => {
            button.setAttribute('aria-checked', String(isChecked));
            button.dataset.state = isChecked ? 'checked' : 'unchecked';
        };
        setState(checked);
        button.onclick = () => {
            const newState = button.dataset.state === 'unchecked';
            setState(newState);
            onToggle(key, newState);
        };
        return button;
    }

    function createButton({ text, icon, variant = 'ghost', color, noRadius = false, isIconOnly = false, className = '', onClick }) {
        const btn = document.createElement('button');
        btn.className = `gff-button variant-${variant}`;
        if (color) btn.classList.add(`color-${color}`);
        if (noRadius) btn.classList.add('no-radius');
        if (isIconOnly) btn.classList.add('icon-only');
        if (className) btn.classList.add(...className.split(' '));
        if (icon) {
            btn.innerHTML = icon;
            if (text) {
                const textSpan = document.createElement('span');
                textSpan.textContent = text;
                btn.append(textSpan);
            }
        } else if (text) {
            btn.textContent = text;
        }
        btn.onclick = onClick;
        return btn;
    }

    const FlagManager = (function() {
        let _flags = {};
        let _defaults = {};
        let _knownFlags = {};
        let isFirstRun = false;
        const _get = (key) => JSON.parse(localStorage.getItem(key) || '{}');
        const _set = (key, data) => localStorage.setItem(key, JSON.stringify(data));
        return {
            init: () => {
                if (localStorage.getItem(KNOWN_FLAGS_KEY) === null) {
                    isFirstRun = true;
                }
                _flags = _get(FLAGS_KEY);
                _defaults = _get(DEFAULTS_KEY);
                _knownFlags = _get(KNOWN_FLAGS_KEY);
            },
            getFlags: () => _flags,
            getDefaults: () => _defaults,
            saveFlags: (flags) => {
                const safeFlags = { ...flags };
                PROBLEMATIC_FLAGS.forEach(flagKey => {
                    const upperFlagKey = flagKey.toUpperCase();
                    if (safeFlags[upperFlagKey] !== undefined && _defaults[upperFlagKey] !== undefined && safeFlags[upperFlagKey] !== _defaults[upperFlagKey]) {
                        safeFlags[upperFlagKey] = _defaults[upperFlagKey];
                    }
                });
                _flags = safeFlags;
                _set(FLAGS_KEY, _flags);
                window.location.reload();
            },
            captureFlag: (key, value) => {
                const upperKey = key.toUpperCase();
                let flagsUpdated = false;
                let defaultsUpdated = false;
                let knownFlagsUpdated = false;

                if (_knownFlags[upperKey] === undefined) {
                    _knownFlags[upperKey] = isFirstRun ? 1 : Date.now();
                    knownFlagsUpdated = true;
                }
                if (_defaults[upperKey] === undefined && typeof value === 'boolean') {
                    _defaults[upperKey] = value;
                    defaultsUpdated = true;
                }
                if (_flags[upperKey] === undefined && typeof value === 'boolean') {
                    _flags[upperKey] = value;
                    flagsUpdated = true;
                }
                if (knownFlagsUpdated) _set(KNOWN_FLAGS_KEY, _knownFlags);
                if (defaultsUpdated) _set(DEFAULTS_KEY, _defaults);
                if (flagsUpdated) _set(FLAGS_KEY, _flags);
            },
            isNew: (key) => {
                const upperKey = key.toUpperCase();
                const discoveredAt = _knownFlags[upperKey];
                if (!discoveredAt) return false;
                return (Date.now() - discoveredAt) < NEW_FLAG_EXPIRATION;
            },
            isModified: (key, flags, defaults) => {
                const upperKey = key.toUpperCase();
                return flags[upperKey] !== defaults[upperKey];
            },
            reset: () => {
                localStorage.removeItem(FLAGS_KEY);
                localStorage.removeItem(DEFAULTS_KEY);
                window.location.reload();
            },
            export: () => {
                const json = JSON.stringify(_flags, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'grok_flags.json';
                a.click();
                URL.revokeObjectURL(a.href);
            },
            import: () => new Promise((resolve) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return resolve(null);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const imported = JSON.parse(event.target.result);
                            const upperCasedImport = {};
                            for (const key in imported) {
                                upperCasedImport[key.toUpperCase()] = imported[key];
                            }
                            _flags = { ..._flags, ...upperCasedImport };
                            resolve(_flags);
                        }
                        catch { resolve(null); }
                    };
                    reader.readAsText(file);
                };
                input.click();
            }),
        };
    })();

    const Patcher = {
        originalCheckGate: null,
        originalApply: Function.prototype.apply,

        start: function () {
            this._injectEarlyOverride();
            this._interceptFunctionPrototype();
            this._waitForStatsigAndPatch();
        },

        _injectEarlyOverride: function() {
            const script = document.createElement('script');
            script.textContent = `
                (function() {
                    const flags = JSON.parse(localStorage.getItem('${FLAGS_KEY}') || '{}');
                    const mockClient = {
                        checkGate: function(gateName) {
                            const upperKey = gateName.toUpperCase();
                            return flags[upperKey] !== undefined ? flags[upperKey] : false;
                        }
                    };
                    let statsigClient = mockClient;
                    Object.defineProperty(window, 'Statsig', {
                        get: () => ({ getClient: () => statsigClient }),
                        set: (value) => { statsigClient = value ? value.getClient() : mockClient; },
                        configurable: true
                    });
                })();
            `;
            (document.head || document.documentElement).insertBefore(script, document.head.firstChild);
            script.remove();
        },

        _interceptFunctionPrototype: function() {
            const self = this;
            Function.prototype.apply = function(thisArg, args) {
                if (this.name === 'checkGate' && args && typeof args[0] === 'string') {
                    const gateName = args[0];
                    const flags = FlagManager.getFlags();
                    const upperKey = gateName.toUpperCase();
                    if (flags[upperKey] !== undefined) {
                        return flags[upperKey];
                    }
                    const value = self.originalApply.call(this, thisArg, args);
                    FlagManager.captureFlag(gateName, value);
                    return value;
                }
                return self.originalApply.call(this, thisArg, args);
            };
        },

        _waitForStatsigAndPatch: function() {
            const intervalId = setInterval(() => {
                if (window.Statsig?.getClient) {
                    const client = window.Statsig.getClient();
                    if (client?.checkGate && !this.originalCheckGate) {
                        clearInterval(intervalId);
                        this.originalCheckGate = client.checkGate.bind(client);
                        client.checkGate = (gateName) => {
                            const flags = FlagManager.getFlags();
                            const upperKey = gateName.toUpperCase();
                            if (flags[upperKey] !== undefined) {
                                return flags[upperKey];
                            }
                            const defaultValue = this.originalCheckGate(gateName);
                            FlagManager.captureFlag(gateName, defaultValue);
                            return defaultValue;
                        };
                    }
                }
            }, 50);
        },
    };

    function init() {
        FlagManager.init();
        let state = {
            flags: FlagManager.getFlags(),
            defaults: FlagManager.getDefaults(),
            searchTerm: '',
            filter: 'all',
        };

        injectStyles();
        Patcher.start();

        const { content: modalContent, footer: modalFooter, title: modalTitle, toggle: toggleModal } = createModal();
        const controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'gff-controls-wrapper';

        const searchInput = document.createElement('div');
        searchInput.className = 'gff-search-input';
        searchInput.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Search flags...';
        input.oninput = (e) => {
            state.searchTerm = e.target.value;
            renderFlagList();
        };
        searchInput.append(input);

        const filterDropdown = document.createElement('div');
        filterDropdown.className = 'gff-filter-dropdown';
        const filterButton = document.createElement('button');
        filterButton.className = 'gff-filter-button';
        filterButton.innerHTML = `<span class="gff-filter-button-text">Show All</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
        const filterButtonText = filterButton.querySelector('.gff-filter-button-text');
        const filterMenu = document.createElement('div');
        filterMenu.className = 'gff-filter-menu';

        const checkmarkSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="gff-checkmark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

        const filters = [
            { key: 'all', text: 'Show All', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="gff-main-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>` },
            { key: 'enabled', text: 'Show Enabled', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="gff-main-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="12" x="2" y="6" rx="2"/><path d="M18 12h4"/><circle cx="6" cy="12" r="2"/></svg>` },
            { key: 'disabled', text: 'Show Disabled', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="gff-main-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="12" x="6" y="6" rx="2"/><path d="M2 12h4"/><circle cx="18" cy="12" r="2"/></svg>` },
            { key: 'new', text: 'Show New', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="gff-main-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/></svg>` },
            { key: 'broken', text: 'Show Broken', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="gff-main-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>` }
        ];

        function updateFilterMenuSelection() {
            filterMenu.querySelectorAll('.gff-filter-option').forEach(opt => {
                const checkmarkSpan = opt.querySelector('.gff-checkmark-wrapper');
                if (opt.dataset.filter === state.filter) {
                    checkmarkSpan.innerHTML = checkmarkSVG;
                } else {
                    checkmarkSpan.innerHTML = '';
                }
            });
        }

        filters.forEach(filter => {
            const option = document.createElement('div');
            option.className = 'gff-filter-option';
            option.innerHTML = `${filter.icon}<span class="gff-option-text">${filter.text}</span><span class="gff-checkmark-wrapper"></span>`;
            option.dataset.filter = filter.key;
            option.onclick = () => {
                state.filter = filter.key;
                filterButtonText.textContent = filter.text;
                filterDropdown.classList.remove('open');
                updateFilterMenuSelection();
                renderFlagList();
            };
            filterMenu.append(option);
        });

        updateFilterMenuSelection();

        filterButton.onclick = () => filterDropdown.classList.toggle('open');
        document.addEventListener('click', (e) => {
            if (!filterDropdown.contains(e.target)) {
                filterDropdown.classList.remove('open');
            }
        });

        filterDropdown.append(filterButton, filterMenu);
        controlsWrapper.append(searchInput, filterDropdown);

        const notificationArea = document.createElement('div');
        const flagsContainer = document.createElement('div');
        flagsContainer.className = 'gff-flags-container';
        flagsContainer.setAttribute('tabindex', '-1');
        modalContent.append(controlsWrapper, notificationArea, flagsContainer);

        function renderFlagList() {
            state.flags = FlagManager.getFlags();
            state.defaults = FlagManager.getDefaults();

            const filteredKeys = Object.keys(state.flags)
                .filter(key => {
                    const isProblematic = PROBLEMATIC_FLAGS.map(f => f.toUpperCase()).includes(key);
                    switch (state.filter) {
                        case 'enabled': return state.flags[key] === true;
                        case 'disabled': return state.flags[key] === false;
                        case 'new': return FlagManager.isNew(key);
                        case 'broken': return isProblematic;
                        case 'all': default: return true;
                    }
                })
                .filter(key => key.toLowerCase().includes(state.searchTerm.toLowerCase()))
                .sort((a, b) => {
                    const aIsNew = FlagManager.isNew(a);
                    const bIsNew = FlagManager.isNew(b);
                    if (aIsNew && !bIsNew) return -1;
                    if (!aIsNew && bIsNew) return 1;
                    return a.localeCompare(b);
                });

            modalTitle.textContent = `Feature Flags (${filteredKeys.length})`;
            flagsContainer.innerHTML = '';

            if (Object.keys(state.flags).length === 0) {
                 const emptyState = document.createElement('div');
                emptyState.className = 'gff-empty-state';
                emptyState.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
                    </svg>
                    <h3>Flags Not Loaded</h3>
                    <p>Could not capture flags from the page. Try reloading.</p>
                `;
                flagsContainer.append(emptyState);
                return;
            }

            if (filteredKeys.length === 0) {
               const emptyState = document.createElement('div');
                emptyState.className = 'gff-empty-state';
                emptyState.innerHTML = `<p>No flags found for the current filter.</p>`;
                flagsContainer.append(emptyState);
                return;
            }

            filteredKeys.forEach(key => {
                const row = document.createElement('div');
                row.className = 'gff-flag-row';
                const label = document.createElement('label');

                const updateLabel = () => {
                    label.innerHTML = '';
                    const isNew = FlagManager.isNew(key);
                    const isModified = FlagManager.isModified(key, state.flags, state.defaults);
                    const isProblematic = PROBLEMATIC_FLAGS.map(f => f.toUpperCase()).includes(key);

                    const labelTextContainer = document.createElement('span');
                    labelTextContainer.className = 'gff-flag-row-label';

                    if (isModified) {
                        labelTextContainer.classList.add('modified');
                    }
                    if (isProblematic && isModified) {
                        labelTextContainer.classList.add('problematic');
                    } else if (isNew) {
                        labelTextContainer.classList.add('new');
                    }

                    labelTextContainer.textContent = key;
                    label.append(labelTextContainer);

                    if (isNew) {
                        const badge = document.createElement('span');
                        badge.className = 'gff-new-badge';
                        badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/></svg><span>NEW</span>`;
                        label.append(badge);
                    }

                    if (isProblematic) {
                        const badge = document.createElement('span');
                        badge.className = 'gff-broken-badge';
                        if (isModified) {
                            badge.classList.add('modified');
                        }
                        badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg><span>BROKEN</span>`;
                        label.append(badge);
                    }
                };

                updateLabel();

                const switchEl = createSwitch(key, state.flags[key], (k, v) => {
                    state.flags[k] = v;
                    updateLabel();
                    renderNotification();
                });
                row.append(label, switchEl);
                flagsContainer.append(row);
            });
        }

        function renderNotification() {
            notificationArea.innerHTML = '';
            const hasProblematic = PROBLEMATIC_FLAGS.some(flag => FlagManager.isModified(flag, state.flags, state.defaults));
            if (hasProblematic) {
                const warning = document.createElement('div');
                warning.className = 'gff-notification';
                warning.innerHTML = `<div class="gff-notification-content">
                    <h3>Potentially Unstable Flags Enabled</h3>
                    <p>You have modified problematic flags. This may cause issues.</p>
                </div>`;
            }
        }

        modalFooter.append(
            createButton({ text: 'Reset All', color: 'warning', className: 'gff-reset-btn', onClick: FlagManager.reset }),
            createButton({ text: 'Import', variant: 'outline', className: 'gff-import-btn', onClick: async () => {
                const importedFlags = await FlagManager.import();
                if (importedFlags) {
                    state.flags = importedFlags;
                    renderFlagList();
                    renderNotification();
                }
            } }),
            createButton({ text: 'Export', variant: 'outline', className: 'gff-export-btn', onClick: FlagManager.export }),
            createButton({ text: 'Save', variant: 'solid', className: 'save-button gff-save-btn', onClick: () => {
                FlagManager.saveFlags(state.flags);
            }})
        );

        const menuObserver = new MutationObserver(() => {
            const menu = document.querySelector('div[role="menu"][data-state="open"]');
            if (menu && !menu.querySelector('#gff-menu-item')) {
                const settingsItem = Array.from(menu.querySelectorAll('div[role="menuitem"]')).find(item => item.textContent?.includes('Settings'));
                if (settingsItem) {
                    const flagItem = document.createElement('div');
                    flagItem.id = 'gff-menu-item';
                    flagItem.className = 'gff-menu-item';
                    flagItem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>Flags`;
                    flagItem.onpointerdown = (event) => {
                        event.stopPropagation();

                        const escapeEvent = new KeyboardEvent('keydown', {
                            bubbles: true, cancelable: true, key: 'Escape', code: 'Escape'
                        });
                        document.body.dispatchEvent(escapeEvent);

                        input.value = '';
                        state.searchTerm = '';
                        state.filter = 'all';
                        filterButtonText.textContent = 'Show All';
                        updateFilterMenuSelection();
                        renderFlagList();
                        renderNotification();
                        toggleModal(true);
                        setTimeout(() => flagsContainer.focus(), 50);
                    };
                    settingsItem.after(flagItem);
                }
            }
        });
        menuObserver.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();