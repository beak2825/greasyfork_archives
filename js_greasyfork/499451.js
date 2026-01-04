// ==UserScript==
// @name         Reddit Content Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  darken thread lines; remove unwanted content
// @author       BillInKCMO
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499451/Reddit%20Content%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/499451/Reddit%20Content%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const a = document.querySelectorAll('i.threadline');
    a.forEach(b => {b.style.borderRight = "1px solid gray"});
    // Your code here...
    window.addEventListener('scroll', function() {
        const articles = document.querySelectorAll('article[aria-label]');
        const keywords = ['trump', 'supreme court', 'election', 'scotus'];

        articles.forEach(article => {
            const ariaLabel = article.getAttribute('aria-label').toLowerCase();
            if (keywords.some(keyword => ariaLabel.includes(keyword))) {
                article.remove();
            }
        });
    });
})();