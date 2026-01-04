// ==UserScript==
// @name         UnrealSoftware Theme Switcher
// @version      1.0.0
// @description  Automatically switches theme on unrealsoftware.de based on browser's color scheme preference
// @author       Adrian Gajos
// @match        https://unrealsoftware.de/*
// @license      MIT
// @namespace https://greasyfork.org/users/1486099
// @downloadURL https://update.greasyfork.org/scripts/540108/UnrealSoftware%20Theme%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/540108/UnrealSoftware%20Theme%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        SELECTORS: {
            SAH_LINK: 'a.js-tt[href*="sah="]'
        },
        ENDPOINTS: {
            SETTINGS: 'https://unrealsoftware.de/settings.php'
        },
        COOKIES: {
            LANGUAGE: 'language'
        },
        THEMES: {
            DARK: '',
            BRIGHT: 'bright'
        },
        TIMEOUT: 5000 // 5 seconds timeout for fetch requests
    };

    // Logging utility
    const Logger = {
        info: (message, ...args) => console.info(`[UnrealSW Theme]: ${message}`, ...args),
        warn: (message, ...args) => console.warn(`[UnrealSW Theme]: ${message}`, ...args),
        error: (message, ...args) => console.error(`[UnrealSW Theme]: ${message}`, ...args)
    };

    /**
     * Extracts the SAH (security hash) parameter from the page
     * @returns {string|null} The SAH parameter or null if not found
     */
    function extractSecurityHash() {
        try {
            const sahElement = document.querySelector(CONFIG.SELECTORS.SAH_LINK);
            
            if (!sahElement) {
                Logger.warn('Security hash element not found');
                return null;
            }

            const href = sahElement.getAttribute('href');
            if (!href) {
                Logger.warn('No href attribute found on security hash element');
                return null;
            }

            const match = href.match(/[?&]sah=([^&]+)/);
            if (!match || !match[1]) {
                Logger.warn('Security hash parameter not found in URL:', href);
                return null;
            }

            return match[1];
        } catch (error) {
            Logger.error('Error extracting security hash:', error);
            return null;
        }
    }

    /**
     * Retrieves a cookie value by name
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null if not found
     */
    function getCookieValue(name) {
        try {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
            
            return null;
        } catch (error) {
            Logger.error(`Error retrieving cookie '${name}':`, error);
            return null;
        }
    }

    /**
     * Determines if the browser prefers dark mode
     * @returns {boolean} True if dark mode is preferred
     */
    function prefersDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * Checks if the current theme matches the browser preference
     * @returns {boolean} True if theme is already correct
     */
    function isThemeCorrect() {
        const isDarkPreferred = prefersDarkMode();
        const languageCookie = getCookieValue(CONFIG.COOKIES.LANGUAGE) || '';
        const isBrightTheme = languageCookie.includes(CONFIG.THEMES.BRIGHT);

        // Theme is correct if:
        // - Dark mode preferred AND not using bright theme
        // - Light mode preferred AND using bright theme
        return (isDarkPreferred && !isBrightTheme) || (!isDarkPreferred && isBrightTheme);
    }

    /**
     * Creates a fetch request with timeout
     * @param {string} url - Request URL
     * @param {Object} options - Fetch options
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise} Fetch promise with timeout
     */
    function fetchWithTimeout(url, options = {}, timeout = CONFIG.TIMEOUT) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    }

    /**
     * Switches the theme by calling the settings endpoint
     * @param {string} securityHash - The SAH parameter
     * @returns {Promise<boolean>} Success status
     */
    async function switchTheme(securityHash) {
        try {
            const isDarkPreferred = prefersDarkMode();
            const themeParam = isDarkPreferred ? CONFIG.THEMES.DARK : CONFIG.THEMES.BRIGHT;
            const themeName = isDarkPreferred ? 'dark' : 'bright';
            
            const url = new URL(CONFIG.ENDPOINTS.SETTINGS);
            url.searchParams.set('sah', securityHash);
            url.searchParams.set('set_style', themeParam);

            Logger.info(`Switching to ${themeName} theme...`);

            const response = await fetchWithTimeout(url.toString(), {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            Logger.info(`Theme successfully switched to ${themeName}. Refreshing page...`);
            return true;

        } catch (error) {
            Logger.error('Failed to switch theme:', error);
            return false;
        }
    }

    /**
     * Main execution function
     */
    async function main() {
        try {
            // Check if theme adjustment is needed
            if (isThemeCorrect()) {
                Logger.info('Theme is already correct, no action needed');
                return;
            }

            // Extract security hash
            const securityHash = extractSecurityHash();
            if (!securityHash) {
                Logger.error('Cannot proceed without security hash');
                return;
            }

            // Switch theme
            const success = await switchTheme(securityHash);
            if (success) {
                // Add a small delay to ensure the server processes the request
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

        } catch (error) {
            Logger.error('Unexpected error in main execution:', error);
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        // DOM is already ready, execute immediately
        main();
    }

    // Optional: Listen for theme changes during the session
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            Logger.info('System theme changed, checking if adjustment needed...');
            setTimeout(main, 500); // Small delay to ensure page is stable
        });
    }

})();