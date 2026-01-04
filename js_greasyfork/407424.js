/* Copyright (C) 2020  Nathaniel Wu
 * Modified from ytAutoDark. Automatically toggle Youtube built-in dark theme.
 * Copyright (C) 2019-2020  Victor VOISIN

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// ==UserScript==
// @name         YouTube Auto Dark Mode
// @namespace    http://tampermonkey.net/
// @version      3.0.3
// @description  Automatically toggle built-in dark mode on youtube.com
// @author       Victor VOISIN, Nathaniel Wu
// @include      *www.youtube.com/*
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407424/YouTube%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/407424/YouTube%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /**
     * Is dark theme enabled ?
     */
    const isDarkThemeEnabled = () => {
        return Boolean(document.querySelector('html').hasAttribute('dark'));
    };

    /**
     * Three dot menu button.
     */
    const isMenuButtonAvailableInDom = () => {
        return Boolean(
            document.querySelectorAll('ytd-topbar-menu-button-renderer')[2],
        );
    };

    const clickMenu = () => {
        document.querySelectorAll('ytd-topbar-menu-button-renderer')[2].click();
    };

    const isMenuOpen = () => {
        return (
            document.querySelector('iron-dropdown') &&
            !document.querySelector('iron-dropdown').getAttribute('aria-hidden')
        );
    };

    const isMenuLoading = () => {
        return !document.getElementById('spinner');
    };

    /**
     * Link arrow to dark theme popup.
     */
    const isCompactLinkAvailableInDom = () => {
        return Boolean(
            document.querySelector('ytd-toggle-theme-compact-link-renderer'),
        );
    };

    const clickRenderer = () => {
        document.querySelector('ytd-toggle-theme-compact-link-renderer').click();
    };

    const isRendererOpen = () => {
        return !(
            document.getElementById('submenu') &&
            Boolean(document.getElementById('submenu').hasAttribute('hidden'))
        );
    };

    const isRendererLoading = () => {
        return !(
            document.querySelector('#spinner.ytd-multi-page-menu-renderer') &&
            document
                .querySelector('#spinner.ytd-multi-page-menu-renderer')
                .hasAttribute('hidden')
        );
    };

    /**
     * Check theme menu.
     */
    const ThemeMenuType = {
        "none": 0,
        "toggle": 1,
        "menu": 2
    }
    const isThemeMenuAvailableInDom = () => {
        let ret = ThemeMenuType.none;
        if (Boolean(document.querySelector('#caption-container > paper-toggle-button')))
            ret = ThemeMenuType.toggle;
        else if (Boolean(document.querySelector('ytd-multi-page-menu-renderer > #submenu #container #sections #items > ytd-compact-link-renderer')))
            ret = ThemeMenuType.menu;
        return ret;
    };

    /**
     * Toggle dark theme by clicking element in DOM.
     */
    const toggleDarkTheme = () => {
        let themeMenuType;
        if (isCompactLinkAvailableInDom() && (themeMenuType = isThemeMenuAvailableInDom())) {
            switch (themeMenuType) {
                case ThemeMenuType.toggle: {
                    document
                        .querySelector('#caption-container > paper-toggle-button')
                        .click();
                    break;
                }
                case ThemeMenuType.menu: {
                    document
                        .querySelector(`ytd-multi-page-menu-renderer > #submenu #container #sections #items > ytd-compact-link-renderer:nth-of-type(${isDarkThemeEnabled() ? 4 : 3})`)
                        .click();
                    break;
                }
                default: {
                    console.log('Unknown theme menu type');
                }
            }
        } else {
            setTimeout(() => {
                window.requestAnimationFrame(tryTogglingDarkMode);
            }, 50);
        }
    };

    /**
     * Wait for all elements to exist in DOM then toggle
     * Step 1: Wait for 3 dots menu in DOM.
     * Step 2: Click on 3 dots to open menu.
     * Step 3: Wait for menu to finish loading.
     * Step 4: Waiting for link to sub-menu (Should be optional now, because of step 3).
     * Step 5: Click to open sub-menu (renderer pane).
     * Step 6: Wait for sub-menu to finish loading.
     * Step 7: Toggle dark theme.
     * Step 8: Close menu.
     */
    let start = null;
    const tryTogglingDarkMode = timestamp => {
        // Compute runtime
        if (!start) {
            start = timestamp;
        }
        const runtime = timestamp - start;
        // Try to toggle only during 10s
        if (runtime < 10000) {
            if (!isMenuButtonAvailableInDom()) {
                setTimeout(() => {
                    window.requestAnimationFrame(tryTogglingDarkMode);
                }, 50);
            } else if (!isMenuOpen()) {
                clickMenu();
                setTimeout(() => {
                    window.requestAnimationFrame(tryTogglingDarkMode);
                }, 50);
            } else if (isMenuLoading()) {
                setTimeout(() => {
                    window.requestAnimationFrame(tryTogglingDarkMode);
                }, 50);
            } else if (isMenuOpen() && !isCompactLinkAvailableInDom()) {
                setTimeout(() => {
                    window.requestAnimationFrame(tryTogglingDarkMode);
                }, 50);
            } else if (!isRendererOpen()) {
                clickRenderer();
                setTimeout(() => {
                    window.requestAnimationFrame(tryTogglingDarkMode);
                }, 50);
            } else if (isRendererOpen() && isRendererLoading()) {
                setTimeout(() => {
                    window.requestAnimationFrame(tryTogglingDarkMode);
                }, 50);
            } else {
                toggleDarkTheme();
                // clickRenderer(); // Close dark theme menu
                if (isMenuOpen()) {
                    clickMenu();
                }
            }
        } else {
            // Timeout with new activation process. Try the old one.
            setTimeout(() => {
                window.requestAnimationFrame(tryTogglingDarkModeTheOldWay);
            }, 50);
        }
    };

    /**
     * @Deprecated
     * Old way of doing things.
     * Kept here for backward compatibility.
     * Will be removed in a few month.
     */

    /**
     * @Deprecated
     */
    const openCloseMenu = () => {
        document.querySelectorAll('ytd-topbar-menu-button-renderer')[2].click();
        document.querySelectorAll('ytd-topbar-menu-button-renderer')[2].click();
    };

    /**
     * @Deprecated
     */
    const openCloseRenderer = () => {
        document.querySelector('ytd-toggle-theme-compact-link-renderer').click();
        document.querySelector('ytd-toggle-theme-compact-link-renderer').click();
    };

    /**
     * @Deprecated
     */
    let startOldWay = null;
    const tryTogglingDarkModeTheOldWay = timestamp => {
        // Compute runtime
        if (!startOldWay) {
            startOldWay = timestamp;
        }
        const runtime = timestamp - startOldWay;
        // Try to toggle only during 5s
        if (runtime < 5000) {
            if (!isMenuButtonAvailableInDom()) {
                window.requestAnimationFrame(tryTogglingDarkMode);
            } else if (!isCompactLinkAvailableInDom()) {
                openCloseMenu();
                window.requestAnimationFrame(tryTogglingDarkMode);
            } else if (!isThemeMenuAvailableInDom()) {
                openCloseRenderer();
                window.requestAnimationFrame(tryTogglingDarkMode);
            } else {
                toggleDarkTheme();
                startOldWay = null;
            }
        }
    };

    const setDarkMode = on => {
        const isDarkModeOn = isDarkThemeEnabled();
        if (on) {
            if (!isDarkModeOn) {
                window.requestAnimationFrame(tryTogglingDarkMode);
            }
        } else if (isDarkModeOn) {
            window.requestAnimationFrame(tryTogglingDarkMode);
        }
    };

    const inIframe = () => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    /**
     * Execute
     */
    if (inIframe())
        return;
    if (window.matchMedia) {// if the browser/os supports system-level color scheme
        setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setDarkMode(e.matches));
    } else {// otherwise use local time to decide
        let hour = (new Date()).getHours();
        setDarkMode(hour > 18 || hour < 8);
    }
})();