// ==UserScript==
// @name         Kathimerini Content Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Φιλτράρισμα περιεχομένου στο Kathimerini.gr
// @match        *://*.kathimerini.gr/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523019/Kathimerini%20Content%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/523019/Kathimerini%20Content%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Προσθέστε τις ετικέτες που θέλετε να κρύψετε εδώ
    const hideKeywords = [
        'ΑΘΛΗΤΙΣΜΟΣ',
        'ΓΑΣΤΡΟΝΟΜΟΣ',
        'athletic',
        'gastronomos'
    ];

    function hideContent() {
        // Κρύψιμο με βάση τις κατηγορίες και τις διευθύνσεις URL
        const style = document.createElement('style');
        style.textContent = hideKeywords.map(keyword => `
            [class*="${keyword}"],
            [id*="${keyword}"],
            a[href*="${keyword.toLowerCase()}"] {
                display: none !important;
            }
        `).join('\n');
        document.head.appendChild(style);

        // Κρύψιμο άρθρων με βάση το περιεχόμενο
        const articles = document.querySelectorAll('article, .article, .story, .entry');
        articles.forEach(article => {
            const text = article.textContent.toUpperCase();
            if (hideKeywords.some(keyword => text.includes(keyword.toUpperCase()))) {
                article.style.display = 'none';
            }
        });
    }

    // Εκτέλεση στη φόρτωση της σελίδας
    hideContent();

    // Εκτέλεση σε δυναμικές αλλαγές
    new MutationObserver(hideContent).observe(document.body, {
        childList: true,
        subtree: true
    });
})();