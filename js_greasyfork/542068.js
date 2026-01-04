// ==UserScript==
// @name         pplx Never Suggest - Hide Perplexity Suggestions & Widgets
// @namespace    https://github.com/ckep1/pplx-never-suggest
// @version      1.0.0
// @description  Hide suggestion dropdown and widgets on Perplexity permanently
// @author       Chris Kephart
// @match        https://www.perplexity.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542068/pplx%20Never%20Suggest%20-%20Hide%20Perplexity%20Suggestions%20%20Widgets.user.js
// @updateURL https://update.greasyfork.org/scripts/542068/pplx%20Never%20Suggest%20-%20Hide%20Perplexity%20Suggestions%20%20Widgets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    const defaultSettings = {
        hideWidgets: true,
        hideSuggestions: true,
        hideDiscoverBox: true
    };

    // Get settings with defaults
    function getSetting(key) {
        return GM_getValue(key, defaultSettings[key]);
    }

    // Save setting and apply immediately
    function setSetting(key, value) {
        GM_setValue(key, value);
        applyCookieSettings(true); // Force reload when settings change
    }

    // Cookie management functions
    function setCookie(name, value, days = 365) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;domain=.perplexity.ai`;
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Apply cookie settings based on current preferences
    function applyCookieSettings(forceReload = false) {
        const hideWidgets = getSetting('hideWidgets');
        const hideSuggestions = getSetting('hideSuggestions');
        const hideDiscoverBox = getSetting('hideDiscoverBox');

        // Check if cookies need to be updated
        const currentWidgetsCookie = getCookie('pplx.homepage-widgets-disabled');
        const currentSuggestionsCookie = getCookie('pplx.is-autosuggest-disabled');
        const currentDiscoverCookie = getCookie('pplx.is-discover-interest-box-dismissed');

        const needsUpdate = 
            currentWidgetsCookie !== hideWidgets.toString() ||
            currentSuggestionsCookie !== hideSuggestions.toString() ||
            currentDiscoverCookie !== hideDiscoverBox.toString();

        if (needsUpdate || forceReload) {
            // Set the cookies that control Perplexity's behavior
            setCookie('pplx.homepage-widgets-disabled', hideWidgets.toString());
            setCookie('pplx.is-autosuggest-disabled', hideSuggestions.toString());
            setCookie('pplx.is-discover-interest-box-dismissed', hideDiscoverBox.toString());

            console.log('Perplexity cookies updated:', {
                'pplx.homepage-widgets-disabled': hideWidgets,
                'pplx.is-autosuggest-disabled': hideSuggestions,
                'pplx.is-discover-interest-box-dismissed': hideDiscoverBox
            });

            // Only reload if we actually changed something or forced
            if (forceReload) {
                location.reload();
            }
        }
    }

    // Register menu commands
    GM_registerMenuCommand(`${getSetting('hideSuggestions') ? '✅' : '❌'} Hide Suggestions`, () => {
        setSetting('hideSuggestions', !getSetting('hideSuggestions'));
    });

    GM_registerMenuCommand(`${getSetting('hideWidgets') ? '✅' : '❌'} Hide Widgets`, () => {
        setSetting('hideWidgets', !getSetting('hideWidgets'));
    });

    GM_registerMenuCommand(`${getSetting('hideDiscoverBox') ? '✅' : '❌'} Hide Discover Interest Box`, () => {
        setSetting('hideDiscoverBox', !getSetting('hideDiscoverBox'));
    });

    // Initialize cookies on page load
    function initializeCookies() {
        applyCookieSettings(false); // Don't force reload on page load
    }

    // Run initialization
    console.log('Perplexity Never Suggest Setting Cookies');
    initializeCookies();

})();