// ==UserScript==
// @name         OurChan New Tab Hotfix
// @namespace    https://ourchan.org/
// @version      1.0
// @description  Temporary fix to open threads in new tabs
// @author       Sneed
// @match        https://ourchan.org/*/index.html
// @match        https://ourchan.org/*/catalog.html
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533098/OurChan%20New%20Tab%20Hotfix.user.js
// @updateURL https://update.greasyfork.org/scripts/533098/OurChan%20New%20Tab%20Hotfix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Check page type once for efficiency
    const isIndex = location.pathname.indexOf('/index.html') > -1;
    
    // Single event handler w/ capture phase
    document.addEventListener('click', function(e) {
        // Find clicked anchor or parent anchor
        const a = e.target.closest('a');
        if (!a || !a.href || a.href.indexOf('/thread/') === -1) return;
        
        // Handle Open links on index pages
        if (isIndex) {
            if (a.textContent === '[Open]' && a.parentNode.className === 'noselect') {
                e.preventDefault();
                window.open(a.href, '_blank');
            }
        } 
        // Handles thumbnails on catalog pages
        else if (e.target.classList.contains('catalog-thumb') || a.closest('.post-file-src')) {
            e.preventDefault();
            window.open(a.href, '_blank');
        }
    }, true); // Using capture phase for better performance
})();
