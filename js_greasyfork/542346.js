// ==UserScript==
// @license you can edit this however you want I made it with AI
// @name         Wikipedia to Wikiwand Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects Wikipedia pages to Wikiwand
// @author       Your Name
// @match        *://*.wikipedia.org/wiki/*
// @match        *://*.wikipedia.org/w/*
// @exclude      *://*.wikipedia.org/wiki/Special:*
// @exclude      *://*.wikipedia.org/wiki/Help:*
// @exclude      *://*.wikipedia.org/wiki/Wikipedia:*
// @exclude      *://*.wikipedia.org/wiki/File:*
// @exclude      *://*.wikipedia.org/wiki/Template:*
// @exclude      *://*.wikipedia.org/wiki/Category:*
// @exclude      *://*.wikipedia.org/wiki/Portal:*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542346/Wikipedia%20to%20Wikiwand%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/542346/Wikipedia%20to%20Wikiwand%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get current Wikipedia URL
    const currentUrl = window.location.href;
    
    // Check if this is a Wikipedia article (not a special page)
    const isArticle = !/\/wiki\/(Special|Help|Wikipedia|File|Template|Category|Portal):/i.test(currentUrl);
    
    // Check if we're already on Wikiwand (to prevent infinite redirects)
    const isAlreadyWikiwand = window.location.href.includes('wikiwand.com');
    
    if (isArticle && !isAlreadyWikiwand) {
        // Extract the article title from the URL
        const articleTitle = window.location.pathname.split('/wiki/')[1];
        
        // Construct the Wikiwand URL
        const wikiwandUrl = `https://www.wikiwand.com/en/${articleTitle}`;
        
        // Redirect to Wikiwand
        window.location.href = wikiwandUrl;
    }
})();