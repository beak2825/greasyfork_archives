// ==UserScript==
// @name         Google Spam Filter
// @name:vi      Dọn dẹp link rác Google Search
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Clean up Google Search spam links
// @description:vi  Dọn dẹp link rác trên Google Search
// @author       Yuusei
// @icon         https://www.google.com/favicon.ico
// @match        https://www.google.com/search*
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/519464/Google%20Spam%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/519464/Google%20Spam%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // options domains
    const spamDomains = new Set([
        '.fr',
        '.pl',
    ]);

    // cache for URLs checked
    const urlCache = new Map();
    const CACHE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours
    const DEBOUNCE_DELAY = 250; // debounce time
 
    // check if url is spam
    function isSpamUrl(url) {
        if (!url) return false;
        
        const now = Date.now();
        
        // check cache first
        const cached = urlCache.get(url);
        if (cached) {
            if (now - cached.timestamp < CACHE_EXPIRY) {
                return cached.result;
            }
            urlCache.delete(url);
        }

        const urlLower = url.toLowerCase();
        const isSpam = Array.from(spamDomains).some(domain => urlLower.includes(domain));

        // save output to cache
        urlCache.set(url, {
            result: isSpam,
            timestamp: now
        });
        
        return isSpam;
    }

    // debounce function to prevent calling too many times
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // filter and hide spam results
    const filterSpamResults = debounce(() => {
        // select all search results
        const searchResults = document.querySelectorAll('#search .g, #rso .g');
        let spamCount = 0;
        const totalResults = searchResults.length;
        
        searchResults.forEach(result => {
            const elements = {
                link: result.querySelector('a'),
                cite: result.querySelector('cite'),
                title: result.querySelector('.oewGkc, .LC20lb'),
                snippet: result.querySelector('.VwiC3b')
            };
            
            const isSpam = elements.link && (
                isSpamUrl(elements.link.href) || 
                isSpamUrl(elements.cite?.textContent) ||
                isSpamUrl(elements.title?.textContent) ||
                isSpamUrl(elements.snippet?.textContent)
            );

            if (isSpam) {
                result.style.display = 'none';
                spamCount++;
            }
        });

        // show notification about the number of spam links filtered
        if (spamCount > 0) {
            const percentage = Math.round((spamCount / totalResults) * 100);
            console.log(`Cleaned ${spamCount}/${totalResults} spam results (${percentage}%)`);
        }
    }, DEBOUNCE_DELAY);

    // run when page loaded
    window.addEventListener('DOMContentLoaded', filterSpamResults);

    // observe content changes (Google dynamic loading)
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
            filterSpamResults();
        }
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
