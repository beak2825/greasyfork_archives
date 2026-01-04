// ==UserScript==
// @name         Reddit on SearXNG Search for mobile
// @namespace    https://github.com/Kdroidwin/Reddit-on-SearXNG-Search
// @version      0.33
// @description  Add site:reddit.com to SearXNG search queries on button click
// @author       Kdroidwim
// @license      GPL-3.0 license
// @match        https://priv.au/*
// @match        https://search.inetol.net/*
// @match        https://searx.tiekoetter.com/*
// @match        https://searx.be/search*
// @match        https://opnxng.com/search*
// @match        https://searxng.hweeren.com/search*
// @match        https://searx.perennialte.ch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503249/Reddit%20on%20SearXNG%20Search%20for%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/503249/Reddit%20on%20SearXNG%20Search%20for%20mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searchForm = document.querySelector('form[action="/search"]');
    const searchInput = document.querySelector('input[name="q"]');

    const redditButton = document.createElement('button');
    redditButton.textContent = 'Search Reddit';
    redditButton.type = 'button';

    // ダークでかっこいいスタイルを適用
    redditButton.style.cssText = `
        margin-left: 10px;
        padding: 8px 14px;
        background-color: #1e1e1e;
        color: #f0f0f0;
        border: 1px solid #333;
        border-radius: 6px;
        font-weight: bold;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    `;

    redditButton.addEventListener('mouseover', () => {
        redditButton.style.backgroundColor = '#333';
    });
    redditButton.addEventListener('mouseout', () => {
        redditButton.style.backgroundColor = '#1e1e1e';
    });
    redditButton.addEventListener('mousedown', () => {
        redditButton.style.transform = 'scale(0.95)';
    });
    redditButton.addEventListener('mouseup', () => {
        redditButton.style.transform = 'scale(1)';
    });

    redditButton.addEventListener('click', function() {
        let query = searchInput.value;
        if (!query.includes('site:reddit.com')) {
            searchInput.value = query + ' site:reddit.com';
        }
        searchForm.submit();
    });

    if (searchForm) {
        searchForm.appendChild(redditButton);
    }
})();