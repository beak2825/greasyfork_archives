// ==UserScript==
// @name         Efficient & Refined Dark Mode
// @namespace    http://tampermonkey.net/
// @version      20250919.1
// @description  A smarter dark mode script that prevents conflicts with native dark themes and offers user-friendly controls (toggle with Ctrl+D). 🛠️ Fixed: Position break: fixed elements (popups) and overflow scrolling.
// @author       Lancelotly (Refined by Gemini)
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 16.5A7.5 7.5 0 0 1 12 4.5V12a7.5 7.5 0 0 1 7.5 7.5H12a7.5 7.5 0 0 1-1.5-3z" fill="%23ffd900" /></svg>
// @downloadURL https://update.greasyfork.org/scripts/547068/Efficient%20%20Refined%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/547068/Efficient%20%20Refined%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---

    const STORAGE_KEYS = {
        THEME_STATE: 'darkModeThemeState', // User's preference: 'auto', 'dark', 'light'
        DISABLED_SITES: 'darkModeDisabledSites'
    };

    const state = {
        styleElement: null,
        preemptiveCurtain: null,
        isDarkApplied: false,
        userThemePref: GM_getValue(STORAGE_KEYS.THEME_STATE, 'auto'),
        disabledSites: JSON.parse(GM_getValue(STORAGE_KEYS.DISABLED_SITES, '[]'))
    };

    // --- Core Functions ---

    /**
     * Checks if the user's OS/browser preference is set to dark mode.
     */
    function userPrefersDark() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * A more robust check to determine if the website already has a dark theme.
     */
    function isSiteAlreadyDark() {
        return new Promise(resolve => {
            const performCheck = () => {
                const htmlElement = document.documentElement;
                const bodyElement = document.body;

                // 1. Check for explicit color-scheme meta tag or CSS property
                const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
                if (colorSchemeMeta && colorSchemeMeta.content.includes('dark')) { resolve(true); return; }
                if (getComputedStyle(htmlElement).getPropertyValue('color-scheme').includes('dark')) { resolve(true); return; }

                // 2. Check for common dark theme attributes and classes
                const darkAttributes = ['dark', 'darker-dark-theme', 'darker-dark-theme-deprecate'];
                for (const attr of darkAttributes) { if (htmlElement.hasAttribute(attr)) { resolve(true); return; } }
                if (htmlElement.dataset.theme === 'dark' || htmlElement.dataset.bsTheme === 'dark') { resolve(true); return; }
                if (bodyElement.dataset.cmColorScheme === 'dark' || bodyElement.dataset.cmDarkLaunched === 'true') { resolve(true); return; }
                for (const className of [...htmlElement.classList, ...bodyElement.classList]) {
                    if (className.toLowerCase().includes('dark')) {
                        resolve(true);
                        return;
                    }
                }
                const darkClasses = ['dark', 'dark-mode', 'night', 'night-mode'];
                for (const cls of darkClasses) { if (bodyElement.classList.contains(cls) || htmlElement.classList.contains(cls)) { resolve(true); return; } }

                // 3. Heuristic: Check body background color luminosity
                const bgColor = getComputedStyle(bodyElement).backgroundColor;
                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
                    const rgb = bgColor.match(/\d+/g);
                    if (rgb) {
                        const luminance = (0.2126 * parseInt(rgb[0]) + 0.7152 * parseInt(rgb[1]) + 0.0722 * parseInt(rgb[2]));
                        if (luminance < 100) {
                            resolve(true);
                            return;
                        }
                    }
                }

                resolve(false);
            };

            if (document.body) {
                performCheck();
            } else {
                new MutationObserver((_, observer) => {
                    if (document.body) {
                        observer.disconnect();
                        performCheck();
                    }
                }).observe(document.documentElement, { childList: true });
            }
        });
    }

    /**
     * Applies the full, filter-based dark mode styles.
     */
    function applyDarkStyles() {
        if (state.isDarkApplied) return;

        const darkCss = `
            :root { --dark-mode-link-color: #6cb6ff; }
            html {
                filter: invert(1) hue-rotate(180deg);
                transition: filter 0.2s ease-in-out;
            }
            body {
                background-color: #ededed;
            }
            img, video, iframe, canvas, svg, .icon, [style*="url("], .media, .thumb, .avatar, media, path,
            img[src*=".jpg"], img[src*=".png"], img[src*=".bmp"], img[src*=".gif"] {
                filter: invert(1) hue-rotate(180deg);
            }
            a { color: var(--dark-mode-link-color) !important; }
            button, input[type="button"], input[type="submit"] {
                background-color: #333 !important;
                color: #eee !important;
            }
        `;

        state.styleElement = GM_addStyle(darkCss);
        state.isDarkApplied = true;
        console.log('Efficient Dark Mode: Full styles applied.');
    }

    /**
     * Removes the full dark mode styles.
     */
    function removeDarkStyles() {
        if (!state.isDarkApplied || !state.styleElement) return;
        state.styleElement.remove();
        state.styleElement = null;
        state.isDarkApplied = false;
        console.log('Efficient Dark Mode: Full styles removed.');
    }

    /**
     * Creates a "black curtain" overlay to prevent the initial "white flash".
     */
    function applyPreemptiveCurtain() {
        if (state.preemptiveCurtain) return;
        const curtain = document.createElement('div');
        curtain.id = 'dark-mode-preemptive-curtain';
        curtain.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgb(18 18 18 / 95%);
            z-index: 2147483647;
            pointer-events: none;
        `;
        document.documentElement.appendChild(curtain);
        state.preemptiveCurtain = curtain;
    }

    /**
     * Removes the pre-emptive curtain.
     */
    function removePreemptiveCurtain() {
        if (!state.preemptiveCurtain) return;
        state.preemptiveCurtain.remove();
        state.preemptiveCurtain = null;
    }

    /**
     * Toggles the theme on and off for the current session.
     */
    function toggleTheme() {
        if (state.isDarkApplied) {
            removeDarkStyles();
        } else {
            applyDarkStyles();
        }
    }

    /**
     * Registers menu commands for the user script manager.
     */
    function registerMenuCommands() {
        const siteStatus = state.disabledSites.includes(window.location.hostname) ? 'Enable' : 'Disable';
        GM_registerMenuCommand(`${siteStatus} Dark Mode for this site`, () => {
            const hostname = window.location.hostname;
            const index = state.disabledSites.indexOf(hostname);
            if (index > -1) {
                state.disabledSites.splice(index, 1);
            } else {
                state.disabledSites.push(hostname);
            }
            GM_setValue(STORAGE_KEYS.DISABLED_SITES, JSON.stringify(state.disabledSites));
            alert(`Dark mode for ${hostname} has been ${index > -1 ? 'enabled' : 'disabled'}. Please reload the page.`);
        });

        GM_registerMenuCommand(`Set Theme Preference (Current: ${state.userThemePref})`, () => {
            const modes = ['auto', 'dark', 'light'];
            let nextIndex = (modes.indexOf(state.userThemePref) + 1) % modes.length;
            state.userThemePref = modes[nextIndex];
            GM_setValue(STORAGE_KEYS.THEME_STATE, state.userThemePref);
            alert(`Dark mode preference set to "${state.userThemePref}". Please reload the page.`);
        });
    }

    /**
     * The main function to initialize the script logic.
     */
    function main() {
        const shouldRun = (state.userThemePref === 'dark' || (state.userThemePref === 'auto' && userPrefersDark()));
        const isSiteDisabled = state.disabledSites.includes(window.location.hostname);

        if (shouldRun && !isSiteDisabled) {
            applyPreemptiveCurtain();

            let hasChecked = false;
            const verifyAndApplyTheme = async () => {
                if (hasChecked) return;
                hasChecked = true;

                const siteIsNativelyDark = await isSiteAlreadyDark();

                if (siteIsNativelyDark) {
                    removePreemptiveCurtain();
                    console.log("Efficient Dark Mode: Native dark theme detected. No action needed.");
                } else {
                    if (document.body && document.body.style.filter === 'none') {
                        document.body.style.filter = '';
                    }
                    applyDarkStyles();
                    setTimeout(() => {
                        removePreemptiveCurtain();
                    }, 300);
                }
            };

            window.addEventListener('load', verifyAndApplyTheme);
            setTimeout(verifyAndApplyTheme, 3000);
        }
    }

    // --- Event Listeners and Initialization ---
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });

    main();
    registerMenuCommands();

})();
