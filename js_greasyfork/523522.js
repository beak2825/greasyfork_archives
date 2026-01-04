// ==UserScript==
// @name         Faster Google Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skip Google redirect links in search results
// @author       sharmanhall
// @match        https://www.google.com/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523522/Faster%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/523522/Faster%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    const removeRedirects = () => {
        document.querySelectorAll('a').forEach(link => {
            const url = link.getAttribute('href');
            if (url && url.startsWith('/url?q=')) {
                const realURL = new URLSearchParams(url.split('?')[1]).get('q');
                if (realURL) link.setAttribute('href', realURL);
            }
        });
    };
    new MutationObserver(removeRedirects).observe(document.body, { childList: true, subtree: true });
    removeRedirects();
})();
