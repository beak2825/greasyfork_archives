// ==UserScript==
// @name         Hide MSN from Bing News
// @description  Hide all MSN news results on Bing News search
// @match        *://www.bing.com/news/search?*
// @version 0.0.1.20250330195728
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/531367/Hide%20MSN%20from%20Bing%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/531367/Hide%20MSN%20from%20Bing%20News.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeMSNResults() {
        document.querySelectorAll('.news-card, .newsitem').forEach(card => {
            let url = card.getAttribute('url') || card.getAttribute('data-url') || '';
            if (url.includes('msn.com')) {
                card.remove();
            }
        });
    }

    // Run once on page load
    removeMSNResults();

    // Observe for dynamically loaded content
    const observer = new MutationObserver(() => {
        removeMSNResults();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
