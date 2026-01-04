// ==UserScript==
// @name         ChatGPT Zero
// @namespace    https://github.com/NextDev65/
// @version      0.59
// @description  Enhancements for ChatGPT
// @author       NextDev65
// @homepageURL  https://github.com/NextDev65/ChatGPT-0
// @supportURL   https://github.com/NextDev65/ChatGPT-0
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539826/ChatGPT%20Zero.user.js
// @updateURL https://update.greasyfork.org/scripts/539826/ChatGPT%20Zero.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const PREFERRED_MODEL_KEY = 'preferredChatGPTModel';
    const SETTINGS_KEY = 'chatgptZeroSettings';
    const DEFAULT_MODEL = 'auto';
    const MODELS = [
        'gpt-5',
        'gpt-5-mini',
        'gpt-5-t-mini',
        'auto'
    ];

    // Default settings
    const DEFAULT_SETTINGS = {
        modelSwitcher: true,
        streamerMode: true,
        animations: true
    };

    // Load settings from localStorage
    function loadSettings() {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
        } catch (e) {
            console.warn('Failed to load settings, using defaults', e);
            return { ...DEFAULT_SETTINGS };
        }
    }

    // Save settings to localStorage
    function saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('Failed to save settings', e);
        }
    }

    // Global settings object
    let settings = loadSettings();

    /**
     * Creates a toggle switch element
     * @param {string} label - The label text for the toggle
     * @param {boolean} checked - Initial checked state
     * @param {Function} onChange - Callback when toggle changes
     * @returns {HTMLDivElement}
     */
    function createToggleSwitch(label, checked, onChange) {
        const container = document.createElement('div');
        container.className = 'toggle-container';

        const labelElement = document.createElement('label');
        labelElement.className = 'toggle-label';
        labelElement.textContent = label;

        const switchContainer = document.createElement('label');
        switchContainer.className = 'toggle-switch';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = checked;
        input.className = 'toggle-input';
        input.addEventListener('change', onChange);

        const slider = document.createElement('span');
        slider.className = 'toggle-slider';

        switchContainer.appendChild(input);
        switchContainer.appendChild(slider);
        container.appendChild(labelElement);
        container.appendChild(switchContainer);

        return container;
    }


    /**
     * Creates and returns a settings menu.
     * @returns {HTMLDivElement}
     */
    function createSettingsMenu() {
        const menu = document.createElement('div');
        menu.id = 'settings-menu';
        menu.className = 'settings-dropdown';
        menu.style.display = 'none';

        // Create toggle switches
        const modelSwitcherToggle = createToggleSwitch('Model Switcher', settings.modelSwitcher, (e) => {
            settings.modelSwitcher = e.target.checked;
            saveSettings(settings);
            updateModelSwitcherVisibility();
        });
        
        const streamerModeToggle = createToggleSwitch(
          'Streamer Mode',
          settings.streamerMode ?? true,
          (e) => {
            settings.streamerMode = e.target.checked;
            saveSettings(settings);
            updateStreamerModeStyles();
          }
        );

        const animationsToggle = createToggleSwitch('Animations', settings.animations, (e) => {
            settings.animations = e.target.checked;
            saveSettings(settings);
            updateAnimationStyles();
        });

        menu.appendChild(modelSwitcherToggle);
        menu.appendChild(streamerModeToggle);
        menu.appendChild(animationsToggle);

        // Append menu to body to avoid positioning issues
        document.body.appendChild(menu);

        return menu;
    }

    /**
     * Creates and returns a <button> element with an attached settings menu.
     * @param {div} menu - The settings menu to be attached
     * @returns {HTMLButtonElement}
     */
    function createSettingsCog(menu) {
        const cog = document.createElement('button');
        cog.id = 'settings-cog';
        //cog.textContent = settings.animations ? '⚙️' : '⚙';
        cog.setAttribute('aria-label', 'Settings');

        // Toggle menu visibility
        cog.addEventListener('click', (e) => {
            e.stopPropagation();
            //const isVisible = window.getComputedStyle(menu).display !== 'none';
            if (menu.style.display === 'block')
            {
                menu.style.display = 'none';
            }
            else {
                positionMenu();
                menu.style.display = 'block';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!cog.contains(e.target) && !menu.contains(e.target)) {
                menu.style.display = 'none';
            }
        });

        // Position menu relative to cog
        function positionMenu() {
            // cog bounds, changes when cog is rotated (animations enabled) -> alignment inconsistencies
            const cogRect = cog.getBoundingClientRect();
            // page header bounds
            const parentRect = cog.parentElement.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            menu.style.position = 'fixed';
            menu.style.top = `${parentRect.bottom - 5}px`; // 5px above `page-header`
            menu.style.zIndex = '10000';
            
            const cogRight = cogRect.left + cogRect.width;
            const rightOffset = viewportWidth - cogRight;

            // prepare initial state
            menu.style.right = `${rightOffset}px`;
            menu.style.left = 'auto';
            if (settings.animations) {
                menu.style.opacity = '0';
                menu.style.transform = 'translateX(10px)';
                menu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                /*// force a reflow so the browser registers the start state
                // eslint-disable-next-line @microsoft/sdl/no-document-domain -- reflow hack
                void menu.offsetWidth;*/

                // slide into place
                requestAnimationFrame(() => {
                    menu.style.opacity = '1';
                    menu.style.transform = 'translateX(0)';
                });
            }
        }

        // Inject CSS for settings menu and toggle switches
        injectSettingsStyles();

        return cog;
    }

    /**
     * Injects CSS styles for the settings menu and components
     */
    function injectSettingsStyles() {
        if (document.getElementById('settings-styles')) return;

        const style = document.createElement('style');
        style.id = 'settings-styles';

        style.textContent = `
    #settings-cog {
        font-size: 20px;
        margin-left: 12px;
        padding: 4px 5px;
        border: none;
        border-radius: 50%;
        background-color: #212121;
        color: #fff;
        cursor: pointer;
        box-shadow: 0 0 0 0 rgba(33, 33, 33, 0) inset,
                    0 0 5px 0 rgba(33, 33, 33, 0);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transform: translateX(0.75px) translateY(-0.75px);
        transition: background-color var(--anim-fast)   var(--easing-standard),
                    box-shadow       var(--anim-slow)   var(--easing-standard),
                    transform        var(--anim-normal) var(--easing-transform);
    }
    #settings-cog:hover {
        background-color: #2f2f2f;
        box-shadow: 0 0 2.5px 0 rgba(255, 255, 255, 0) inset,
                    0 0 5px   0 rgba(255, 255, 255, 0.2);
        transform: translateX(0.75px) translateY(-0.75px) var(--cog-rotate);
    }
    #settings-cog:focus {
        outline: none;
        box-shadow: 0 0 2.5px 0 rgba(255, 255, 255, 0.5) inset,
                    0 0 5px   0 rgba(255, 255, 255, 0.5);
    }

    #settings-cog::before {
        content: var(--cog-icon);
        transform-origin: center;
        transform: translateX(0.75px) translateY(-0.75px);
    }

    .settings-dropdown {
        display: none;
        background-color: #2a2a2a;
        border: 1px solid #444;
        border-radius: 8px;
        padding: 12px;
        min-width: 200px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }


    .toggle-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    .toggle-container:last-child {
        margin-bottom: 0;
    }

    .toggle-label {
        color: #fff;
        font-size: 14px;
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
    }

    .toggle-input {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        z-index: 1;
    }
    .toggle-input:checked + .toggle-slider {
        background-color: #4CAF50;
    }
    .toggle-input:checked + .toggle-slider:before {
        transform: translateX(20px);
    }
    .toggle-input:checked + .toggle-slider:hover {
        background-color: #45a049;
    }

    .toggle-slider {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #555;
        border-radius: 24px;
        transition: background-color var(--anim-normal) var(--easing-slider-bg),
                    transform        var(--anim-normal) var(--easing-transform);
    }
    .toggle-slider:before {
        content: "";
        position: absolute;
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        border-radius: 50%;
        transition: transform var(--anim-normal) var(--easing-transform);
    }
`;
        document.head.appendChild(style);
    }

    /**
     * Updates animation styles based on current settings with CSS custom properties
     */
    function updateAnimationStyles() {
        const root = document.documentElement;
        const animate = settings.animations;
        // Durations
        root.style.setProperty('--anim-fast',   animate ? '0.2s' : '0s');
        root.style.setProperty('--anim-normal', animate ? '0.3s' : '0s');
        root.style.setProperty('--anim-slow',   animate ? '0.4s' : '0s');
        // Easing functions
        root.style.setProperty('--easing-standard',  animate ? 'cubic-bezier(0.4,   0,    0.2,  1)' : '');
        root.style.setProperty('--easing-transform', animate ? 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' : '');
        root.style.setProperty('--easing-slider-bg', animate ? 'cubic-bezier(0.68, -0.1,  0.27, 1.1)' : '');
        // Cog styles
        root.style.setProperty('--cog-rotate', animate ? 'rotate(45deg)' : 'rotate(0deg)');
        root.style.setProperty('--cog-icon', animate ? "'⚙️'" : "'⚙'");
        // Model Switcher glow (initially invisible, transitions from this on hover)
        root.style.setProperty('--initial-glow', animate ? `0 0 0   0 rgba(33, 33, 33, 0) inset,
                                                            0 0 5px 0 rgba(33, 33, 33, 0)` : 'none');
    }

    function updateStreamerModeStyles() {
        injectStreamerModeStyles();
        document.body.classList.toggle('streamer-mode', settings.streamerMode);
    }

    function injectStreamerModeStyles() {
        if (document.getElementById('streamer-styles')) return;

        const style = document.createElement('style');
        style.id = 'streamer-styles';

        style.textContent = `
        /* inactive chats */
        .streamer-mode #history .__menu-item:not([data-active]) {
            box-shadow: 0 0 2.5px 0 rgba(255, 255, 255, 0) inset,
                        0 0 5px 0 rgba(255, 255, 255, 0.2);
            transition: background-color var(--anim-fast) var(--easing-standard),
                        box-shadow       var(--anim-slow) var(--easing-standard);
        }
        
        /* inactive chat titles */
        .streamer-mode #history .__menu-item:not([data-active]) .truncate span {
            opacity: 0;
            transition: opacity    var(--anim-fast) var(--easing-standard),
                        box-shadow var(--anim-slow) var(--easing-standard);
        }
        .streamer-mode #history .__menu-item:not([data-active]):hover .truncate span {
            opacity: 1;
        }
        
        /* accounts profile */
        .streamer-mode [data-testid="accounts-profile-button"] {
            display: none !important;
        }
        `;

        document.head.appendChild(style);
    }

    /**
     * Updates model switcher visibility based on settings
     */
    function updateModelSwitcherVisibility() {
        const modelSwitcher = document.getElementById('chatgpt-model-switcher');
        if (modelSwitcher) {
            modelSwitcher.style.display = settings.modelSwitcher ? 'block' : 'none';
        }
    }

    /**
     * Injects CSS styles for the model switcher
     */
    function injectModelSwitcherStyles() {
        if (document.getElementById('model-switcher-styles')) return;

        const style = document.createElement('style');
        style.id = 'model-switcher-styles';

        style.textContent = `
    #chatgpt-model-switcher {
        margin: auto;
        padding: 4px 8px;
        border: none;
        border-radius: 6px;
        background-color: #212121;
        color: #fff;
        outline: none;
        box-shadow: var(--initial-glow);
        transition: background-color var(--anim-fast) var(--easing-standard),
                    box-shadow       var(--anim-slow) var(--easing-standard);
    }
    #chatgpt-model-switcher:hover {
        background-color: #2f2f2f;
        box-shadow: 0 0 2.5px 0 rgba(255, 255, 255, 0) inset,
                    0 0 5px 0 rgba(255, 255, 255, 0.2);
    }
    #chatgpt-model-switcher:focus {
        outline: none;
        box-shadow: 0 0 2.5px 0 rgba(255, 255, 255, 0.5) inset,
                    0 0 5px 0 rgba(255, 255, 255, 0.5);
    }
`;
        document.head.appendChild(style);
    }

    /**
     * Creates and returns a <select> element configured as the model switcher.
     * @param {string} currentModel - Model to pre-select in the dropdown.
     * @returns {HTMLSelectElement}
     */
    function createModelSwitcher(currentModel) {
        const select = document.createElement('select');
        select.id = 'chatgpt-model-switcher';

        // Inject CSS for base styling, hover, focus, and transition effects
        injectModelSwitcherStyles();

        // Populate dropdown with model options
        MODELS.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            if (model === currentModel) option.selected = true;
            select.appendChild(option);
        });

        // Save selection to localStorage on change
        select.addEventListener('change', () => {
            localStorage.setItem(PREFERRED_MODEL_KEY, select.value);
        });

        // Set initial visibility based on settings
        select.style.display = settings.modelSwitcher ? 'block' : 'none';

        return select;
    }

    /**
     * Finds our model switcher in the UI and inserts the settings cog after it.
     * Retries every second until our model switcher is visible.
     */
    function injectSettingsMenu() {
        const checkInterval = setInterval(() => {
            const modelSwitcher = document.getElementById('chatgpt-model-switcher');
            if (!modelSwitcher) return; // Wait until the model switcher is available

            let cog = document.getElementById('settings-cog');
            let menu = document.getElementById('settings-menu');

            // Create menu if it doesn't exist yet
            if (!menu) {
                menu = createSettingsMenu();
            }
            // Create cog + Insert cog before toolbar
            if (!cog) {
                cog = createSettingsCog(menu);
                //modelSwitcher.after(cog);
                
                document.getElementById('page-header').lastChild.prepend(cog); // last child of page header
            }
        }, 1000);
    }

    /**
     * Finds the native model switcher in the UI and inserts our custom switcher beside it.
     * Retries every second until the native element is visible.
     */
    function injectModelSwitcher() {
        const checkInterval = setInterval(() => {
            const nativeModelSwitchers = document.querySelectorAll('[data-testid="model-switcher-dropdown-button"]');
            let switcher = document.getElementById('chatgpt-model-switcher');
            const getPlusClassName = ['absolute start-1/2 flex flex-col items-center gap-2 ltr:-translate-x-1/2 rtl:translate-x-1/2',
                                      'pointer-events-none absolute start-0 flex flex-col items-center gap-2 lg:start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2'];
            // Create switcher
            if (!switcher) {
                const savedModel = localStorage.getItem(PREFERRED_MODEL_KEY) || DEFAULT_MODEL;
                switcher = createModelSwitcher(savedModel);
            }
            // Insert switcher next to the first visible native button
            if (!switcher.parentNode) {
                for (let nativeModelSwitcher of nativeModelSwitchers) {
                    if (nativeModelSwitcher.checkVisibility && nativeModelSwitcher.checkVisibility()) {
                        nativeModelSwitcher.parentNode.after(switcher);

                        // move "Get Plus" button
                        let getPlus = null;
                        for (let className of getPlusClassName) {
                            let elements = document.getElementsByClassName(className);
                            if (elements.length > 0) {
                                // give getPlus styling to switcher
                                switcher.className = getPlusClassName;
                                getPlus = elements[0];
                                break;
                            }
                        }
                        nativeModelSwitcher.parentNode.appendChild(getPlus);
                        getPlus.className = '';
                        break;
                    }
                }
            }
        }, 1000);
    }

    /**
     * Overrides window.fetch to intercept conversation requests and replace the model
     * property in the request body with the user-selected model.
     */
    function overrideModelInRequest() {
        // Only override if model switcher is enabled
        if (!settings.modelSwitcher) return;

        const origFetch = window.fetch;
        window.fetch = async (...args) => {
            const [resource, config] = args;
            const savedModel = localStorage.getItem(PREFERRED_MODEL_KEY) || DEFAULT_MODEL;

            // Target only conversation API calls
            if (
                typeof resource === 'string' &&
                resource.includes('/backend-api/f/conversation') &&
                config?.body
            ) {
                try {
                    const body = JSON.parse(config.body);
                    if (body && body.model) {
                        // Overwrite model
                        body.model = savedModel;
                        config.body = JSON.stringify(body);
                    }
                } catch (e) {
                    console.warn('Model switcher failed to parse request body', e);
                }
            }

            return origFetch(resource, config);
        };
    }

    // Initialize the userscript
    injectModelSwitcher();
    overrideModelInRequest();
    updateStreamerModeStyles();
    injectSettingsMenu();
    updateAnimationStyles();

})();
