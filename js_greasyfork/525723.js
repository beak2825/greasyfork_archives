// ==UserScript==
// @name         Google Scholar - Open Links in New Tab
// @namespace    https://violentmonkey.github.io/
// @version      1.3
// @description  Open links in new tab when clicking on h3 elements and gs_or_ggsm class
// @author       Bui Quoc Dung
// @match        https://scholar.google.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525723/Google%20Scholar%20-%20Open%20Links%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/525723/Google%20Scholar%20-%20Open%20Links%20in%20New%20Tab.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function updateLinks() {
        // Selectors for elements that should open in a new tab
        const selectors = ['h3.gs_rt a', '.gs_or_ggsm a'];

        // Set target="_blank" for matching elements
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(link => link.setAttribute('target', '_blank'));
        });

        // Handle .gs_nph and Related articles links that have valid hrefs and force open in new tab
        document.querySelectorAll('.gs_nph, a[href*="related:"]').forEach(link => {
            if (link.tagName === 'A' && link.getAttribute('href') && !link.getAttribute('href').startsWith('javascript')) {
                if (link.getAttribute('href').startsWith('/')) {
                    link.href = location.origin + link.getAttribute('href');
                }
                link.setAttribute('target', '_blank');
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    window.open(link.href, '_blank');
                });
            }
        });
    }

    // Run once on page load
    updateLinks();

    // Observe DOM changes to handle dynamically loaded content
    new MutationObserver(updateLinks).observe(document.body, { childList: true, subtree: true });
})();

