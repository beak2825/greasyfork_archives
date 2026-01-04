// ==UserScript==
// @name         Google Search - Reddit Filter Button
// @namespace    https://github.com/Dkdj77/Reddit-search-on-google/
// @version      1.01
// @description  Adds a fancy button adding site:reddit.com to the end of your search!
// @author       DK
// @include *://www.google.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537625/Google%20Search%20-%20Reddit%20Filter%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/537625/Google%20Search%20-%20Reddit%20Filter%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createRedditButton() {
        if(document.getElementById('reddit-filter-btn')) return;

        // Find a container below search box (search form area)
        const searchForm = document.querySelector('form[role="search"]');
        if (!searchForm) return;

        const btn = document.createElement('button');
        btn.id = 'reddit-filter-btn';
        btn.textContent = 'Search Reddit';
        btn.style.cssText = `
            margin-left: 10px;
            padding: 6px 12px;
            font-size: 14px;
            background-color: #FF5700;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-family: Arial, sans-serif;
            user-select: none;
        `;

        btn.addEventListener('click', e => {
            e.preventDefault();

            const urlParams = new URLSearchParams(window.location.search);
            let q = urlParams.get('q') || '';

            if (!q.includes('site:reddit.com')) {
                q = q.trim() + ' site:reddit.com';
                urlParams.set('q', q);
                window.location.href = '/search?' + urlParams.toString();
            }
        });

        // Append button next to search input (or to search form)
        const searchInput = searchForm.querySelector('input[name="q"]');
        if (searchInput && searchInput.parentElement) {
            searchInput.parentElement.appendChild(btn);
        } else {
            searchForm.appendChild(btn);
        }
    }

    
    function waitForSearchForm(retries = 20) {
        const searchForm = document.querySelector('form[role="search"]');
        if (searchForm) {
            createRedditButton();
        } else if (retries > 0) {
            setTimeout(() => waitForSearchForm(retries - 1), 500);
        }
    }

    waitForSearchForm();

    // Also observe page for NEW changes bruh
    const observer = new MutationObserver(() => {
        createRedditButton();
    });

    observer.observe(document.body, {childList: true, subtree: true});
})();
