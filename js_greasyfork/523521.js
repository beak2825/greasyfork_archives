// ==UserScript==
// @name         Infinite Scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable infinite scrolling on paginated sites
// @author       sharmanhall
// @license MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523521/Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/523521/Infinite%20Scroll.meta.js
// ==/UserScript==

(function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const nextLink = document.querySelector('a[rel="next"], .pagination-next');
                if (nextLink) {
                    fetch(nextLink.href)
                        .then(res => res.text())
                        .then(html => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            const newContent = doc.querySelector('main, .content, .articles'); // Customize selector as needed
                            if (newContent) {
                                document.body.appendChild(newContent);
                            }
                        });
                }
            }
        });
    });
    const footer = document.querySelector('footer');
    if (footer) observer.observe(footer);
})();
