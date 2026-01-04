// ==UserScript==
// @name         Google AI Studio Theme Switcher with Auto Day/Night
// @name:zh-CN   Google AI Studio 主题切换器（含日夜自动切换）
// @namespace    http://tampermonkey.net/
// @version      2.4.1
// @description  Instantly switch between themes (Warm Yellow, Mint Light, Atom One Dark, etc.) for Google AI Studio, with auto day/night mode that remembers your last chosen light and dark themes.
// @description:zh-CN 为Google AI Studio提供可切换的数种护眼主题。自动日夜模式可记忆您最后选择的浅色与深色主题。
// @author       Gemini
// @match        https://aistudio.google.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526371/Google%20AI%20Studio%20Theme%20Switcher%20with%20Auto%20DayNight.user.js
// @updateURL https://update.greasyfork.org/scripts/526371/Google%20AI%20Studio%20Theme%20Switcher%20with%20Auto%20DayNight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Theme Definitions ---
    const themes = {
        warm: {
            className: 'warm-yellow-theme',
            displayName: 'Warm Yellow',
            isDark: false,
            css: `
                body.warm-yellow-theme{color-scheme:light !important;--mat-sys-primary:#f8f0d9 !important;--mat-sys-on-primary:#5D4037 !important;--mat-sys-primary-container:#FAEFE0 !important;--mat-sys-on-primary-container:#5D4037 !important;--mat-sys-secondary:#A1887F !important;--mat-sys-on-secondary:#fff !important;--mat-sys-secondary-container:#EFEBE9 !important;--mat-sys-on-secondary-container:#5D4037 !important;--mat-sys-tertiary:#689F38 !important;--mat-sys-on-tertiary:#fff !important;--mat-sys-error:#C62828 !important;--mat-sys-on-error:#fff !important;--mat-sys-error-container:#fce8e6 !important;--mat-sys-on-error-container:#791a1a !important;--color-v3-error-container:var(--mat-sys-error-container) !important;--color-v3-error-text:#791a1a !important;--mat-sys-background:#FDF6E3 !important;--mat-sys-surface:#FDF6E3 !important;--mat-sys-surface-bright:#FEFBF3 !important;--mat-sys-surface-container:#F8f0d9 !important;--mat-sys-surface-container-high:#F3EADF !important;--mat-sys-surface-container-highest:#EDE4D5 !important;--mat-sys-surface-container-low:#FEFBF3 !important;--mat-sys-surface-container-lowest:#fff !important;--color-v3-surface:var(--mat-sys-surface) !important;--color-v3-surface-container:var(--mat-sys-surface-container) !important;--color-v3-surface-container-high:var(--mat-sys-surface-container-high) !important;--color-v3-surface-container-highest:var(--mat-sys-surface-container-highest) !important;--mat-app-background-color:var(--mat-sys-background) !important;--color-canvas-background:var(--mat-sys-background) !important;--color-v3-surface-left-nav:#f8f0d9 !important;--mat-sys-on-background:#4F4A45 !important;--mat-sys-on-surface:#4F4A45 !important;--mat-sys-on-surface-variant:#655F5A !important;--color-v3-text:var(--mat-sys-on-surface) !important;--color-v3-text-var:var(--mat-sys-on-surface-variant) !important;--color-v3-text-on-button:var(--mat-sys-on-primary) !important;--color-v3-text-link:#B7410E !important;--mat-app-text-color:var(--mat-sys-on-surface) !important;--mat-sys-outline:#DCD5C9 !important;--mat-sys-outline-variant:#CEC8BD !important;--color-v3-outline:var(--mat-sys-outline) !important;--color-v3-outline-var:var(--mat-sys-outline-variant) !important;--color-v3-button-container:var(--mat-sys-primary) !important;--color-v3-button-container-high:#f3e7c4 !important;--color-v3-button-container-highest:#f3e7c4 !important;--color-v3-hover:#F8F0D9 !important;background-color:var(--mat-sys-background) !important;color:var(--mat-sys-on-background) !important}.warm-yellow-theme ms-right-side-panel,.warm-yellow-theme .mat-mdc-row:hover,.warm-yellow-theme .prompt-input-wrapper{background:#f8f0d9 !important}.warm-yellow-theme .run-button,.warm-yellow-theme mat-expansion-panel-header:hover{background:#f3e7c4 !important}.warm-yellow-theme .mat-mdc-row a{color:#777 !important}.warm-yellow-theme .hljs{background:#F8F0D9 !important;color:#4F4A45 !important}.warm-yellow-theme .hljs-comment,.warm-yellow-theme .hljs-quote{color:#A08C7D !important}.warm-yellow-theme .hljs-variable,.warm-yellow-theme .hljs-template-variable,.warm-yellow-theme .hljs-attr,.warm-yellow-theme .hljs-selector-id,.warm-yellow-theme .hljs-selector-class,.warm-yellow-theme .hljs-regexp,.warm-yellow-theme .hljs-deletion{color:#B7410E !important}.warm-yellow-theme .hljs-number,.warm-yellow-theme .hljs-built_in,.warm-yellow-theme .hljs-literal,.warm-yellow-theme .hljs-type,.warm-yellow-theme .hljs-params,.warm-yellow-theme .hljs-meta,.warm-yellow-theme .hljs-link{color:#856b3d !important}.warm-yellow-theme .hljs-keyword,.warm-yellow-theme .hljs-selector-tag{color:#C77800 !important}.warm-yellow-theme .hljs-string,.warm-yellow-theme .hljs-symbol,.warm-yellow-theme .hljs-bullet,.warm-yellow-theme .hljs-addition{color:#556B2F !important}.warm-yellow-theme .hljs-title,.warm-yellow-theme .hljs-title.function_,.warm-yellow-theme .hljs-section{color:#A67B5B !important}.warm-yellow-theme .hljs-emphasis{font-style:italic !important}.warm-yellow-theme .hljs-strong{font-weight:700 !important}`
        },
        mintLight: {
            className: 'mint-light-theme',
            displayName: 'Mint Light',
            isDark: false,
            css: `
                body.mint-light-theme{color-scheme:light !important;--mat-sys-primary:#eaf4f4 !important;--mat-sys-on-primary:#3b413c !important;--mat-sys-primary-container:#daf0ee !important;--mat-sys-on-primary-container:#3b413c !important;--mat-sys-secondary:#cce3de !important;--mat-sys-on-secondary:#3b413c !important;--mat-sys-secondary-container:#eaf4f4 !important;--mat-sys-on-secondary-container:#3b413c !important;--mat-sys-tertiary:#a4c3b2 !important;--mat-sys-on-tertiary:#3b413c !important;--mat-sys-error:#ff686b !important;--mat-sys-on-error:#fff !important;--mat-sys-background:#f6fff8 !important;--mat-sys-surface:#f6fff8 !important;--mat-sys-surface-bright:#f6fff8 !important;--mat-sys-surface-container:#eaf4f4 !important;--mat-sys-surface-container-high:#daf0ee !important;--mat-sys-surface-container-highest:#cce3de !important;--mat-sys-surface-container-low:#f6fff8 !important;--mat-sys-surface-container-lowest:#f6fff8 !important;--color-v3-surface:var(--mat-sys-background) !important;--mat-app-background-color:var(--mat-sys-background) !important;--color-canvas-background:var(--mat-sys-background) !important;--color-v3-surface-left-nav:#eaf4f4 !important;--mat-sys-on-background:#3b413c !important;--mat-sys-on-surface:#3b413c !important;--mat-sys-on-surface-variant:#a4c3b2 !important;--color-v3-text-link:#6b9080 !important;--mat-sys-outline:#cce3de !important;--mat-sys-outline-variant:#a4c3b2 !important;--color-v3-hover:#cce3de !important;background-color:var(--mat-sys-background) !important;color:var(--mat-sys-on-background) !important}.mint-light-theme ms-right-side-panel,.mint-light-theme .mat-mdc-row:hover,.mint-light-theme .prompt-input-wrapper{background:#eaf4f4 !important}.mint-light-theme .run-button{background:#cce3de !important}.mint-light-theme .mat-mdc-row a{color:#3b413c !important}.mint-light-theme .hljs{background:#eaf4f4 !important;color:#3b413c !important}.mint-light-theme .hljs-comment,.mint-light-theme .hljs-quote{color:#aaaaaa !important;font-style:italic}.mint-light-theme .hljs-variable,.mint-light-theme .hljs-template-variable,.mint-light-theme .hljs-attr,.mint-light-theme .hljs-selector-id,.mint-light-theme .hljs-selector-class,.mint-light-theme .hljs-regexp,.mint-light-theme .hljs-deletion{color:#3a506b !important}.mint-light-theme .hljs-number,.mint-light-theme .hljs-built_in,.mint-light-theme .hljs-literal,.mint-light-theme .hljs-type,.mint-light-theme .hljs-params,.mint-light-theme .hljs-meta,.mint-light-theme .hljs-link{color:#ee6352 !important}.mint-light-theme .hljs-keyword,.mint-light-theme .hljs-selector-tag{color:#0b132b !important}.mint-light-theme .hljs-string,.mint-light-theme .hljs-symbol,.mint-light-theme .hljs-bullet,.mint-light-theme .hljs-addition{color:#448c27 !important}.mint-light-theme .hljs-title,.mint-light-theme .hljs-title.function_,.mint-light-theme .hljs-section{color:#ed6a5e !important;font-weight:700}.mint-light-theme .hljs-emphasis{font-style:italic !important}.mint-light-theme .hljs-strong{font-weight:700 !important}`
        },
        atom: {
            className: 'atom-one-dark-theme',
            displayName: 'Atom One Dark',
            isDark: true,
            css: `
                body.atom-one-dark-theme{color-scheme:dark !important;--mat-sys-primary:#528bff !important;--mat-sys-on-primary:#fff !important;--mat-sys-primary-container:#2a3a5c !important;--mat-sys-on-primary-container:#a6c8ff !important;--mat-sys-secondary:#c679dd !important;--mat-sys-on-secondary:#fff !important;--mat-sys-secondary-container:#4a2c58 !important;--mat-sys-on-secondary-container:#e0aaff !important;--mat-sys-tertiary:#97c378 !important;--mat-sys-on-tertiary:#1a2b1f !important;--mat-sys-error:#df6a73 !important;--mat-sys-on-error:#fff !important;--mat-sys-background:#282c34 !important;--mat-sys-surface:#282c34 !important;--mat-sys-surface-bright:#3d4350 !important;--mat-sys-surface-container:#21252b !important;--mat-sys-surface-container-high:#3d4350 !important;--mat-sys-surface-container-highest:#4a5160 !important;--mat-sys-surface-container-low:#292d35 !important;--mat-sys-surface-container-lowest:#272b33 !important;--color-v3-surface:var(--mat-sys-background) !important;--mat-app-background-color:var(--mat-sys-background) !important;--color-canvas-background:var(--mat-sys-background) !important;--color-v3-surface-left-nav:#21252b !important;--mat-sys-on-background:#9da5b4 !important;--mat-sys-on-surface:#9da5b4 !important;--mat-sys-on-surface-variant:#5c6370 !important;--color-v3-text-link:#528bff !important;--mat-sys-outline:#3d4350 !important;--mat-sys-outline-variant:#636e84 !important;--color-v3-hover:#3a4049 !important;background-color:var(--mat-sys-background) !important;color:var(--mat-sys-on-background) !important}.atom-one-dark-theme ms-right-side-panel,.atom-one-dark-theme .mat-mdc-row:hover,.atom-one-dark-theme .prompt-input-wrapper,.atom-one-dark-theme .hljs{background:#21252b !important}.atom-one-dark-theme .run-button{background:#3a4049 !important}.atom-one-dark-theme .mat-mdc-row a,.atom-one-dark-theme .hljs{color:#9da5b4 !important}.atom-one-dark-theme .hljs-comment,.atom-one-dark-theme .hljs-quote{color:#5c6370 !important}.atom-one-dark-theme .hljs-variable,.atom-one-dark-theme .hljs-template-variable,.atom-one-dark-theme .hljs-attr,.atom-one-dark-theme .hljs-selector-id,.atom-one-dark-theme .hljs-selector-class,.atom-one-dark-theme .hljs-regexp,.atom-one-dark-theme .hljs-deletion{color:#e06c75 !important}.atom-one-dark-theme .hljs-number,.atom-one-dark-theme .hljs-built_in,.atom-one-dark-theme .hljs-literal,.atom-one-dark-theme .hljs-type,.atom-one-dark-theme .hljs-params,.atom-one-dark-theme .hljs-meta,.atom-one-dark-theme .hljs-link{color:#d19a66 !important}.atom-one-dark-theme .hljs-keyword,.atom-one-dark-theme .hljs-selector-tag{color:#c678dd !important}.atom-one-dark-theme .hljs-string,.atom-one-dark-theme .hljs-symbol,.atom-one-dark-theme .hljs-bullet,.atom-one-dark-theme .hljs-addition{color:#98c379 !important}.atom-one-dark-theme .hljs-title,.atom-one-dark-theme .hljs-title.function_,.atom-one-dark-theme .hljs-section{color:#61afef !important}`
        },
        monokai: {
            className: 'monokai-dark-theme',
            displayName: 'Monokai',
            isDark: true,
            css: `
                body.monokai-dark-theme{color-scheme:dark !important;--mat-sys-primary:#AE81FF !important;--mat-sys-on-primary:#272822 !important;--mat-sys-primary-container:#3D3063 !important;--mat-sys-on-primary-container:#E0CFFD !important;--mat-sys-secondary:#F92672 !important;--mat-sys-on-secondary:#fff !important;--mat-sys-secondary-container:#5D1D38 !important;--mat-sys-on-secondary-container:#F92672 !important;--mat-sys-tertiary:#A6E22E !important;--mat-sys-on-tertiary:#272822 !important;--mat-sys-error:#F92672 !important;--mat-sys-on-error:#fff !important;--mat-sys-background:#2F2F2A !important;--mat-sys-surface:#2F2F2A !important;--mat-sys-surface-bright:#49483E !important;--mat-sys-surface-container:#272822 !important;--mat-sys-surface-container-high:#49483E !important;--mat-sys-surface-container-highest:#5A5953 !important;--mat-sys-surface-container-low:#2E2F29 !important;--mat-sys-surface-container-lowest:#272822 !important;--color-v3-surface:var(--mat-sys-background) !important;--mat-app-background-color:var(--mat-sys-background) !important;--color-canvas-background:var(--mat-sys-background) !important;--color-v3-surface-left-nav:#272822 !important;--mat-sys-on-background:#afaea3 !important;--mat-sys-on-surface:#C5C8C6 !important;--mat-sys-on-surface-variant:#75715E !important;--color-v3-text-link:#66D9EF !important;--mat-sys-outline:#49483E !important;--mat-sys-outline-variant:#75715E !important;--color-v3-hover:#3E3D32 !important;background-color:var(--mat-sys-background) !important;color:var(--mat-sys-on-background) !important}.monokai-dark-theme ms-right-side-panel,.monokai-dark-theme .mat-mdc-row:hover,.monokai-dark-theme .prompt-input-wrapper,.monokai-dark-theme .hljs{background:#272822 !important}.monokai-dark-theme .run-button{background:#3E3D32 !important}.monokai-dark-theme .mat-mdc-row a,.monokai-dark-theme .hljs{color:#C5C8C6 !important}.monokai-dark-theme .hljs-comment,.monokai-dark-theme .hljs-quote{color:#75715e !important}.monokai-dark-theme .hljs-variable,.monokai-dark-theme .hljs-template-variable,.monokai-dark-theme .hljs-attr,.monokai-dark-theme .hljs-selector-id,.monokai-dark-theme .hljs-selector-class,.monokai-dark-theme .hljs-regexp,.monokai-dark-theme .hljs-deletion{color:#a6e22e !important}.monokai-dark-theme .hljs-number,.monokai-dark-theme .hljs-built_in,.monokai-dark-theme .hljs-literal,.monokai-dark-theme .hljs-type,.monokai-dark-theme .hljs-params,.monokai-dark-theme .hljs-meta,.monokai-dark-theme .hljs-link{color:#ae81ff !important}.monokai-dark-theme .hljs-keyword,.monokai-dark-theme .hljs-selector-tag{color:#f92672 !important}.monokai-dark-theme .hljs-string,.monokai-dark-theme .hljs-symbol,.monokai-dark-theme .hljs-bullet,.monokai-dark-theme .hljs-addition{color:#e6db74 !important}.monokai-dark-theme .hljs-title,.monokai-dark-theme .hljs-title.function_,.monokai-dark-theme .hljs-section{color:#66d9ef !important}`
        },
        dracula: {
            className: 'dracula-dark-theme',
            displayName: 'Dracula',
            isDark: true,
            css: `
                body.dracula-dark-theme{color-scheme:dark !important;--mat-sys-primary:#bd93f9 !important;--mat-sys-on-primary:#282a36 !important;--mat-sys-primary-container:#4c396e !important;--mat-sys-on-primary-container:#e0b3ff !important;--mat-sys-secondary:#8be9fd !important;--mat-sys-on-secondary:#282a36 !important;--mat-sys-secondary-container:#2a505c !important;--mat-sys-on-secondary-container:#b5ffff !important;--mat-sys-tertiary:#50fa7b !important;--mat-sys-on-tertiary:#282a36 !important;--mat-sys-error:#ff5555 !important;--mat-sys-on-error:#fff !important;--mat-sys-background:#353746 !important;--mat-sys-surface:#353746 !important;--mat-sys-surface-bright:#44475a !important;--mat-sys-surface-container:#282a36 !important;--mat-sys-surface-container-high:#535870 !important;--mat-sys-surface-container-highest:#6272a4 !important;--mat-sys-surface-container-low:#353746 !important;--mat-sys-surface-container-lowest:#282a36 !important;--color-v3-surface:var(--mat-sys-background) !important;--mat-app-background-color:var(--mat-sys-background) !important;--color-canvas-background:var(--mat-sys-background) !important;--color-v3-surface-left-nav:#282a36 !important;--mat-sys-on-background:#BFC2D9 !important;--mat-sys-on-surface:#BFC2D9 !important;--mat-sys-on-surface-variant:#6272a4 !important;--color-v3-text-link:#8be9fd !important;--mat-sys-outline:#44475a !important;--mat-sys-outline-variant:#6272a4 !important;--color-v3-hover:#6272a4 !important;background-color:var(--mat-sys-background) !important;color:var(--mat-sys-on-background) !important}.dracula-dark-theme ms-right-side-panel,.dracula-dark-theme .mat-mdc-row:hover,.dracula-dark-theme .prompt-input-wrapper,.dracula-dark-theme .hljs{background:#282a36 !important}.dracula-dark-theme .run-button{background:#6272a4 !important}.dracula-dark-theme .mat-mdc-row a,.dracula-dark-theme .hljs{color:#BFC2D9 !important}.dracula-dark-theme .hljs-comment,.dracula-dark-theme .hljs-quote{color:#6272a4 !important}.dracula-dark-theme .hljs-variable,.dracula-dark-theme .hljs-template-variable,.dracula-dark-theme .hljs-attr,.dracula-dark-theme .hljs-selector-id,.dracula-dark-theme .hljs-selector-class,.dracula-dark-theme .hljs-regexp,.dracula-dark-theme .hljs-deletion{color:#ffb86c !important}.dracula-dark-theme .hljs-number,.dracula-dark-theme .hljs-built_in,.dracula-dark-theme .hljs-literal,.dracula-dark-theme .hljs-type,.dracula-dark-theme .hljs-params,.dracula-dark-theme .hljs-meta,.dracula-dark-theme .hljs-link{color:#bd93f9 !important}.dracula-dark-theme .hljs-keyword,.dracula-dark-theme .hljs-selector-tag{color:#ff79c6 !important}.dracula-dark-theme .hljs-string,.dracula-dark-theme .hljs-symbol,.dracula-dark-theme .hljs-bullet,.dracula-dark-theme .hljs-addition{color:#f1fa8c !important}.dracula-dark-theme .hljs-title,.dracula-dark-theme .hljs-title.function_,.dracula-dark-theme .hljs-section{color:#50fa7b !important}`
        }
    };

    // --- Script Logic ---
    let menuCommands = [];

    // 1. Combine all theme CSS and inject
    let fullCSS = "";
    for (const themeKey in themes) {
        fullCSS += themes[themeKey].css;
    }
    fullCSS += `body, .mat-app-background { transition: background-color 0.3s ease, color 0.3s ease !important; }`;
    GM_addStyle(fullCSS);

    // 2. Core function to apply a theme class to the body
    function updateBodyClass(themeKey) {
        for (const key in themes) {
            document.body.classList.remove(themes[key].className);
        }
        if (themes[themeKey]) {
            document.body.classList.add(themes[themeKey].className);
        }
    }

    // 3. Main function to determine and apply the correct theme based on settings
    function applyActiveTheme() {
        const settings = {
            autoSwitchEnabled: GM_getValue('autoSwitchEnabled', true),
            darkTime: GM_getValue('darkTime', '19:00'),
            lightTime: GM_getValue('lightTime', '07:00'),
            lastDarkTheme: GM_getValue('lastDarkTheme', 'dracula'),
            lastLightTheme: GM_getValue('lastLightTheme', 'warm'),
            selectedTheme: GM_getValue('selectedTheme', 'default')
        };

        let themeToApplyKey = settings.selectedTheme;

        if (settings.autoSwitchEnabled) {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const [darkHour, darkMinute] = settings.darkTime.split(':').map(Number);
            const darkTimeTotalMinutes = darkHour * 60 + darkMinute;
            const [lightHour, lightMinute] = settings.lightTime.split(':').map(Number);
            const lightTimeTotalMinutes = lightHour * 60 + lightMinute;

            if (darkTimeTotalMinutes > lightTimeTotalMinutes) { // Normal day/night
                if (currentTime >= darkTimeTotalMinutes || currentTime < lightTimeTotalMinutes) {
                    themeToApplyKey = settings.lastDarkTheme;
                } else {
                    themeToApplyKey = settings.lastLightTheme;
                }
            } else { // Inverted
                if (currentTime >= darkTimeTotalMinutes && currentTime < lightTimeTotalMinutes) {
                    themeToApplyKey = settings.lastDarkTheme;
                } else {
                    themeToApplyKey = settings.lastLightTheme;
                }
            }
        }
        updateBodyClass(themeToApplyKey);
        GM_setValue('selectedTheme', themeToApplyKey);
    }

    // 4. Function to rebuild the menu commands. Necessary for instant checkmark updates.
    function registerMenuCommands() {
        // Clear existing commands
        menuCommands.forEach(cmdId => GM_unregisterMenuCommand(cmdId));
        menuCommands = [];

        const settings = {
            autoSwitchEnabled: GM_getValue('autoSwitchEnabled', true),
            darkTime: GM_getValue('darkTime', '19:00'),
            lightTime: GM_getValue('lightTime', '07:00'),
            selectedTheme: GM_getValue('selectedTheme', 'default')
        };

        const addCmd = (name, func) => menuCommands.push(GM_registerMenuCommand(name, func));
        const isActive = (key) => !settings.autoSwitchEnabled && settings.selectedTheme === key;

        // Theme selection
        for (const themeKey in themes) {
            const theme = themes[themeKey];
            addCmd(`${isActive(themeKey) ? '✅ ' : ''}${theme.displayName}`, () => manualThemeChange(themeKey));
        }

        // Restore Default
        addCmd(`${isActive('default') ? '✅ ' : ''}Restore Default`, () => manualThemeChange('default'));

        // Automatic switching toggle
        addCmd(`Auto Day/Night: ${settings.autoSwitchEnabled ? '✅ On' : '❌ Off'}`, toggleAutoSwitch);

        // Set custom times
        addCmd(`Set Times (Dark: ${settings.darkTime}, Light: ${settings.lightTime})`, setTimes);
    }

    // 5. Handler functions for menu actions
    function manualThemeChange(themeKey) {
        if (themes[themeKey]) {
            if (themes[themeKey].isDark) {
                GM_setValue('lastDarkTheme', themeKey);
            } else {
                GM_setValue('lastLightTheme', themeKey);
            }
        }
        GM_setValue('selectedTheme', themeKey);
        GM_setValue('autoSwitchEnabled', false);
        updateBodyClass(themeKey);
        registerMenuCommands(); // Rebuild menu to update checkmarks
    }



    function toggleAutoSwitch() {
        const currentVal = GM_getValue('autoSwitchEnabled', true);
        GM_setValue('autoSwitchEnabled', !currentVal);
        applyActiveTheme(); // Immediately apply the correct theme for the new mode
        registerMenuCommands();
    }

    function setTimes() {
        const oldDark = GM_getValue('darkTime', '19:00');
        const newDarkTime = prompt('Enter dark theme start time (HH:MM, 24-hour format):', oldDark);
        if (newDarkTime && /^\d{2}:\d{2}$/.test(newDarkTime)) {
            GM_setValue('darkTime', newDarkTime);
        }

        const oldLight = GM_getValue('lightTime', '07:00');
        const newLightTime = prompt('Enter light theme start time (HH:MM, 24-hour format):', oldLight);
        if (newLightTime && /^\d{2}:\d{2}$/.test(newLightTime)) {
            GM_setValue('lightTime', newLightTime);
        }

        applyActiveTheme(); // Re-evaluate theme with new times
        registerMenuCommands(); // Rebuild menu to show new times
    }


    // --- Initial Execution ---
    applyActiveTheme();
    registerMenuCommands();
    console.log(`AI Studio Theme Switcher: Initialized with corrected low-contrast dark themes.`);
})();