// ==UserScript==
// @name         Tavriav Lazy Load Scroll Catalog
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Lazy load two subsequent pages on Tavriav's catalog pages with 1-second delay, display current page number, and show distance from the bottom
// @author       You
// @match        https://www.tavriav.ua/catalog/*/
// @match        https://www.tavriav.ua/catalog/*/?*
// @match        https://www.tavriav.ua/subcatalog/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477840/Tavriav%20Lazy%20Load%20Scroll%20Catalog.user.js
// @updateURL https://update.greasyfork.org/scripts/477840/Tavriav%20Lazy%20Load%20Scroll%20Catalog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = urlParams.has('page') ? parseInt(urlParams.get('page'), 10) : 1;
    const distanceFromBottom = 4000;
    let loading = false;
    let pagesToLoad = 3;

    // Create and style the display divs
    GM_addStyle(`
        #displayDiv {
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.7);
            color: #fff;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 1000;
        }
    `);

    const pageNumberDisplay = document.createElement('div');
    pageNumberDisplay.id = "displayDiv";
    document.body.appendChild(pageNumberDisplay);

    window.addEventListener('scroll', () => {
        const distance = document.body.offsetHeight - (window.innerHeight + window.scrollY);
        pageNumberDisplay.innerHTML = `Page: ${currentPage}<br>Distance from bottom: ${Math.round(distance)}px`;

        if (!loading && distance <= distanceFromBottom) {
            currentPage++;
            loadMultiplePages(currentPage, pagesToLoad);
        }
    });

    function appendContent(text) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const newContent = doc.querySelector('.catalog-products__container');

        if (newContent) {
            document.querySelector('.catalog-products__container').appendChild(newContent);
        }
    }

    function fetchPage(pageNum) {
        const currentURL = new URL(window.location.href);
        const params = currentURL.searchParams;
        params.set('page', pageNum);

        return fetch(`${currentURL.origin}${currentURL.pathname}?${params.toString()}`)
            .then(response => response.text());
    }

    function loadMultiplePages(startPage, count) {
        if (count === 0) {
            loading = false;
            return;
        }

        loading = true;
        fetchPage(startPage).then(text => {
            appendContent(text);
            setTimeout(() => {
                loadMultiplePages(startPage + 1, count - 1);
            }, 1000); // 1-second delay before fetching the next page
        });
    }

    loadMultiplePages(currentPage + 1, pagesToLoad); // Start fetching the next two pages immediately
})();
