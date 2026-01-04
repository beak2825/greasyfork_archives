// ==UserScript==
// @name         Shafa Endless
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Lazy load subsequent pages on catalog pages with a 1-second delay, display current page number, and show distance from the bottom
// @author       You
// @match        https://shafa.ua/*
// @match        https://www.tavriav.ua/subcatalog/209/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478640/Shafa%20Endless.user.js
// @updateURL https://update.greasyfork.org/scripts/478640/Shafa%20Endless.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = urlParams.has('page') ? parseInt(urlParams.get('page'), 10) : 1;
    const distanceFromBottom = 4000;
    let loading = false;
    let pagesToLoad = 1;

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
        //const distance = Math.max(document.body.offsetHeight - (window.innerHeight + window.scrollY), 0); // Ensure the value doesn't go negative
        const distance = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;;
        pageNumberDisplay.innerHTML = `Page: ${currentPage}<br>${document.body.offsetHeight}<br>${(window.innerHeight + window.scrollY)}<br>Distance from bottom: ${Math.round(distance)}px`;

        if (!loading && distance <= distanceFromBottom) {
            currentPage++;
            loadMultiplePages(currentPage, pagesToLoad);
        }
    });

// Modify the appendContent function:

function appendContent(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const newContentItems = doc.querySelectorAll('.b-catalog__item');

    const catalog = document.querySelector('.b-catalog.b-catalog_max-columns_4.b-block');
    newContentItems.forEach(item => {
        catalog.appendChild(item.cloneNode(true));
    });

    // Append a separation line after the content
    const separator = document.createElement('hr');
    catalog.appendChild(separator);
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
            }, 1000);
        });
    }
})();
