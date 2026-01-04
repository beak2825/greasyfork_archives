// ==UserScript==
// @name         No More Dramas - TJUPT/PTer
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  torrent page filter
// @author       colder
// @match        https://*.tjupt.org/torrents.php*
// @match        https://*.tju.pt/torrents.php*
// @match        https://*.pterclub.com/torrents.php*
// @match        https://*.pterclub.net/torrents.php*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493684/No%20More%20Dramas%20-%20TJUPTPTer.user.js
// @updateURL https://update.greasyfork.org/scripts/493684/No%20More%20Dramas%20-%20TJUPTPTer.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const filterChars = ["-GodDramas", "短剧"];
    
    function containsFilterChar(text) {
        return filterChars.some(char => text.includes(char));
    }
    
    function hideFilteredTRs() {
        const torrentsTable = document.querySelector('.torrents') || 
                             document.querySelector('table.torrents') ||
                             document.querySelector('table');
        
        if (torrentsTable) {
            torrentsTable.querySelectorAll('tr').forEach(tr => {
                if (containsFilterChar(tr.textContent)) {
                    tr.style.display = 'none';
                }
            });
        }
    }
    
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            hideFilteredTRs();
        });
        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }
    
    // Wait for page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideFilteredTRs);
    } else {
        hideFilteredTRs();
    }
    
    observeDOMChanges();
})();