// ==UserScript==
// @name         Universal Site Search for Arc Browser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enables site-specific searches with shortcuts for Arc Browser or others. Efficiently handles search queries for various websites.
// @author       Your Loyal Assistant
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520089/Universal%20Site%20Search%20for%20Arc%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/520089/Universal%20Site%20Search%20for%20Arc%20Browser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Public search engine shortcuts
    const searchEngines = [
        { shortcut: '@youtube', url: 'https://www.youtube.com/results?search_query=%s' },
        { shortcut: '@bing', url: 'https://www.bing.com/search?q=%s' },
        { shortcut: '@duckduckgo', url: 'https://duckduckgo.com/?q=%s' },
        { shortcut: '@yandex', url: 'https://yandex.com/search/?text=%s' },
        { shortcut: '@perplexity', url: 'https://www.perplexity.ai/search?q=%s' },
        { shortcut: '@pahe', url: 'https://pahe.ink/?s=%s' },
        { shortcut: '@mkvdrama', url: 'https://mkvdrama.org/?s=%s' },
        { shortcut: '@subsource', url: 'https://subsource.net/search/%s' },
    ];

    // Parse the query string
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || params.get('search_query') || params.get('text');
    if (!query) return;

    // Trim and process query
    const trimmedQuery = query.trim();

    // Match shortcuts with precision
    const engine = searchEngines.find(e => trimmedQuery.startsWith(e.shortcut + ' '));
    const searchQuery = engine ? trimmedQuery.replace(engine.shortcut, '').trim() : null;

    if (engine && searchQuery) {
        // Stop the current page load
        if (window.stop) window.stop();
        document.documentElement.innerHTML = '';

        // Redirect to the target URL
        const redirectUrl = engine.url.replace('%s', encodeURIComponent(searchQuery));
        location.replace(redirectUrl);

        // Prevent further script execution
        throw new Error('REDIRECT_COMPLETE');
    }

    // If no shortcut matched, do nothing and let the browser handle the query normally
})();
