// ==UserScript==
// @name         ForceTwitterURL
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects x.com to twitter.com and enforces ?mx=1 on all URLs
// @author       nyathea
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523784/ForceTwitterURL.user.js
// @updateURL https://update.greasyfork.org/scripts/523784/ForceTwitterURL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;
    const path = window.location.pathname || '/home';
    
    // Check if the URL is an OAuth URL
    const isOAuthUrl = () => {
        return path.includes('/i/oauth2/authorize');
    };

    // Redirect to twitter.com with ?mx=1
    const redirectToTwitterWithMx = (redirectPath = '/home') => {
        const newUrl = `https://twitter.com${redirectPath}?mx=1`;
        window.location.replace(newUrl);
    };

    if (currentUrl.startsWith('https://x.com')) {
        if (isOAuthUrl()) {
            // For OAuth URLs on x.com, redirect to twitter.com preserving all query parameters
            const newUrl = `https://twitter.com${path}${window.location.search}`;
            window.location.replace(newUrl);
        } else {
            // For non-OAuth URLs on x.com, redirect to twitter.com with ?mx=1
            redirectToTwitterWithMx(path);
        }
    } else if (currentUrl.startsWith('https://twitter.com')) {
        // For twitter.com URLs
        if (isOAuthUrl()) {
            // Don't modify OAuth URLs on twitter.com
            return;
        } else if (!currentUrl.includes('?mx=1')) {
            // Ensure ?mx=1 is appended
            redirectToTwitterWithMx(path);
        } else if (currentUrl === 'https://twitter.com/') {
            // Redirect twitter.com/ to twitter.com/home?mx=1
            redirectToTwitterWithMx('/home');
        }
    }
})();
