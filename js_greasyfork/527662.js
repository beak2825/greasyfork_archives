// ==UserScript==
// @name         Force Google Results in English
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically adds &hl=en to Google search URLs to force English results
// @author       You
// @match        *://www.google.com/*
// @match        *://google.com/*
// @match        *://www.google.co.*/*
// @match        *://google.co.*/*
// @match        *://www.google.com.au/*
// @match        *://www.google.ca/*
// @match        *://www.google.de/*
// @match        *://www.google.fr/*
// @match        *://www.google.es/*
// @match        *://www.google.it/*
// @match        *://www.google.jp/*
// @match        *://www.google.ru/*
// @match        *://www.google.br/*
// @match        *://www.google.in/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/527662/Force%20Google%20Results%20in%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/527662/Force%20Google%20Results%20in%20English.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Run immediately to minimize any visible delay
    const enforceEnglishResults = () => {
        // Only proceed if this is a Google search page
        if (!window.location.href.includes('google.')) return;
        
        // Don't modify the URL if it already has the language parameter
        if (window.location.href.includes('&hl=en') || window.location.href.includes('?hl=en')) return;
        
        // Get the current URL
        let currentUrl = window.location.href;
        
        // Add the English language parameter
        if (currentUrl.includes('?')) {
            // URL already has parameters, append our parameter
            if (!currentUrl.endsWith('&')) {
                currentUrl += '&';
            }
            currentUrl += 'hl=en';
        } else {
            // URL doesn't have parameters yet, add our parameter as the first one
            currentUrl += '?hl=en';
        }
        
        // Update the URL without refreshing the page
        window.history.replaceState({}, document.title, currentUrl);
        
        // For cases where the page is still loading, also change the location
        // This provides a fallback but will cause a page refresh
        if (document.readyState !== 'complete') {
            window.location.href = currentUrl;
        }
    };
    
    // Run the function immediately
    enforceEnglishResults();
    
    // Monitor URL changes for single-page behavior
    let lastUrl = window.location.href;
    new MutationObserver(() => {
        if (lastUrl !== window.location.href) {
            lastUrl = window.location.href;
            enforceEnglishResults();
        }
    }).observe(document, {subtree: true, childList: true});
    
    // Add event listener for when the page is loaded
    window.addEventListener('load', enforceEnglishResults);
})();