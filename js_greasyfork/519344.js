// ==UserScript==
// @name         Site Search for Arc Browser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables site search for Arc browser and others using shortcuts
// @author       Faisal Bhuiyan
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519344/Site%20Search%20for%20Arc%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/519344/Site%20Search%20for%20Arc%20Browser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const start = performance.now();
    
    // List of search engines with their shortcuts and URLs
    // NOTE: Avoid adding your browser's default search engine to prevent redirect loops
    const searchEngines = [
        {
            shortcut: '@perplexity',
            url: 'https://perplexity.ai/search?q=%s'
        },
        {
            shortcut: '@g',
            url: 'https://www.google.com/search?q=%s'
        },
        {
            shortcut: '@youtube',
            url: 'https://www.youtube.com/results?search_query=%s'
        },
        {
            shortcut: '@morphic',
            url: 'https://morphic.sh/search?q=%s'
        },
        {
            shortcut: '@qwant',
            url: 'https://www.qwant.com/?q=%s'
        },
        {
            shortcut: '@phind',
            url: 'https://www.phind.com/search?q=%s'
        },
        {
            shortcut: '@yandex',
            url: 'https://yandex.com/search/?text=%s'
        }
    ];

    // Fast hostname check using Set for O(1) lookup
    // NOTE: These domains should match the search engines above, excluding your default search engine
    const searchDomains = new Set([
        'perplexity.ai',
        'google.com',
        'youtube.com',
        'morphic.sh',
        'qwant.com',
        'phind.com',
        'yandex.com'
    ]);
    
    const hostname = location.hostname;
    
    // Exit immediately if we're on a search engine
    if ([...searchDomains].some(domain => hostname.includes(domain))) return;

    // Get query parameters fast
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || params.get('search_query') || params.get('text');
    
    if (!query) return;

    const trimmedQuery = query.trim();
    
    // Fast lookup using Array.find
    const engine = searchEngines.find(e => trimmedQuery.startsWith(e.shortcut));
    
    if (engine) {
        const searchQuery = trimmedQuery.replace(engine.shortcut, '').trim();
        if (searchQuery) {
            // Stop the page load as early as possible
            if (window.stop) window.stop();
            
            // Try to prevent any further resource loading
            document.documentElement.innerHTML = '';
            
            // Use the fastest redirection method
            const redirectUrl = engine.url.replace('%s', encodeURIComponent(searchQuery));
            location.replace(redirectUrl);
            
            // Prevent any further script execution
            throw new Error('REDIRECT_COMPLETE');
        }
    }

    const end = performance.now();
    console.debug(`Arc Search executed in ${end - start}ms`);
})();