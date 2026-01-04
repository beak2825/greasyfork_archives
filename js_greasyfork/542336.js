// ==UserScript==
// @name         EroMe - Sort by Views Link (Inside Page Container)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a visible "Sort by Views" link just inside the #page container on EroMe profile pages to sort albums by view count descendingly.
// @author       ChatGPT
// @match        https://www.erome.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542336/EroMe%20-%20Sort%20by%20Views%20Link%20%28Inside%20Page%20Container%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542336/EroMe%20-%20Sort%20by%20Views%20Link%20%28Inside%20Page%20Container%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function parseViews(text) {
        if (!text) return 0;
        let cleaned = text.replace(/[^0-9,.KM]/g, '').replace(',', '.');
        if (cleaned.includes('K')) return parseFloat(cleaned) * 1000;
        if (cleaned.includes('M')) return parseFloat(cleaned) * 1000000;
        return parseFloat(cleaned);
    }

    function sortAlbumsByViews() {
        const container = document.querySelector('#albums');
        if (!container) return;

        const albumNodes = Array.from(document.querySelectorAll('.album'));
        const sorted = albumNodes.sort((a, b) => {
            const viewsA = parseViews(a.querySelector('.album-bottom-views')?.innerText);
            const viewsB = parseViews(b.querySelector('.album-bottom-views')?.innerText);
            return viewsB - viewsA;
        });

        sorted.forEach(album => container.appendChild(album));
        console.log('Albums sorted by most views');
    }

    function restoreOriginalOrder() {
        location.reload();
    }

    function insertSortLink() {
        const pageContainer = document.querySelector('#page');
        if (!pageContainer || document.querySelector('#sortViewsLink')) return;

        const sortLink = document.createElement('a');
        sortLink.href = '#';
        sortLink.textContent = '🔽 Sort by Views';
        sortLink.id = 'sortViewsLink';
        sortLink.style.display = 'inline-block';
        sortLink.style.margin = '20px 0';
        sortLink.style.fontSize = '16px';
        sortLink.style.fontWeight = 'bold';
        sortLink.style.color = '#e91e63';

        let sorted = false;

        sortLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (!sorted) {
                sortAlbumsByViews();
                sortLink.textContent = '↩ Unsort';
            } else {
                restoreOriginalOrder();
            }
            sorted = !sorted;
        });

        pageContainer.insertBefore(sortLink, pageContainer.firstChild);
    }

    const waitForElement = (selector, callback, timeout = 10000) => {
        const start = Date.now();
        const check = () => {
            const el = document.querySelector(selector);
            if (el) callback(el);
            else if (Date.now() - start < timeout) requestAnimationFrame(check);
        };
        check();
    };

    waitForElement('#page', insertSortLink);
})();
