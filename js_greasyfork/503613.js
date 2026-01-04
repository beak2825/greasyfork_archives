// ==UserScript==
// @name         Ultimate Floatplane Beta Redirector
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Advanced redirector for Floatplane with configurable options and performance optimizations
// @match        *://*.floatplane.com/*
// @exclude      *://beta.floatplane.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503613/Ultimate%20Floatplane%20Beta%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/503613/Ultimate%20Floatplane%20Beta%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        TARGET_HOSTNAME: 'beta.floatplane.com',
        REDIRECT_DELAY: 50, // milliseconds
        MAX_RETRIES: 3,
        RETRY_INTERVAL: 100, // milliseconds
        WHITELIST_PATHS: ['/api/', '/cdn/'], // Paths to exclude from redirection
    };

    let redirectAttempts = 0;

    function shouldRedirect(url) {
        const parsedUrl = new URL(url);
        return !CONFIG.WHITELIST_PATHS.some(path => parsedUrl.pathname.startsWith(path));
    }

    function redirectToBeta() {
        if (redirectAttempts >= CONFIG.MAX_RETRIES) return;

        const currentURL = new URL(window.location.href);

        if (currentURL.hostname === CONFIG.TARGET_HOSTNAME || !shouldRedirect(currentURL.href)) return;

        currentURL.hostname = CONFIG.TARGET_HOSTNAME;
        
        // Use performance.now() for more precise timing
        const startTime = performance.now();
        
        window.location.replace(currentURL.href);
        
        redirectAttempts++;
        
        // Log redirect attempt
        console.log(`Redirect attempt ${redirectAttempts} at ${startTime.toFixed(2)}ms`);
        
        // Schedule next attempt if needed
        if (redirectAttempts < CONFIG.MAX_RETRIES) {
            setTimeout(redirectToBeta, CONFIG.RETRY_INTERVAL);
        }
    }

    // Attempt redirect immediately
    redirectToBeta();

    // Fallback redirect after a delay
    setTimeout(redirectToBeta, CONFIG.REDIRECT_DELAY);

    // User configuration options
    function saveConfig() {
        GM_setValue('floatplaneRedirectConfig', JSON.stringify(CONFIG));
    }

    function loadConfig() {
        const savedConfig = GM_getValue('floatplaneRedirectConfig');
        if (savedConfig) {
            Object.assign(CONFIG, JSON.parse(savedConfig));
        }
    }

    function promptForConfig(key) {
        const value = prompt(`Enter new value for ${key}:`, CONFIG[key]);
        if (value !== null) {
            CONFIG[key] = key === 'WHITELIST_PATHS' ? value.split(',').map(s => s.trim()) : value;
            saveConfig();
            alert('Configuration updated. Please refresh the page for changes to take effect.');
        }
    }

    // Load saved configuration
    loadConfig();

    // Register configuration menu commands
    GM_registerMenuCommand('Configure Target Hostname', () => promptForConfig('TARGET_HOSTNAME'));
    GM_registerMenuCommand('Configure Redirect Delay', () => promptForConfig('REDIRECT_DELAY'));
    GM_registerMenuCommand('Configure Max Retries', () => promptForConfig('MAX_RETRIES'));
    GM_registerMenuCommand('Configure Retry Interval', () => promptForConfig('RETRY_INTERVAL'));
    GM_registerMenuCommand('Configure Whitelist Paths', () => promptForConfig('WHITELIST_PATHS'));
})();