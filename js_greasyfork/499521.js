// ==UserScript==
// @name         OnlyFans and Privacy Lookup
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds a magnifying glass button to search models on Simpcity.su directly from OnlyFans and Privacy.com pages.
// @match        https://onlyfans.com/*
// @match        https://privacy.*/*
// @match        https://www.instagram.com/*/
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/499521/OnlyFans%20and%20Privacy%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/499521/OnlyFans%20and%20Privacy%20Lookup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .lookup-button {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                font-size: 20px;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 5px;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .search-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10000;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
            .search-container input {
                margin-right: 10px;
                padding: 5px;
                font-size: 14px;
            }
            .search-container button {
                padding: 5px 10px;
                cursor: pointer;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    function createLookupButton() {
        const button = document.createElement('div');
        button.classList.add('lookup-button');
        button.innerHTML = '<i class="fa fa-search"></i>';
        button.addEventListener('click', showSearchInput);

        const container = document.createElement('div');
        container.classList.add('lookup-container');
        container.appendChild(button);
        document.body.appendChild(container);
    }

    function showSearchInput() {
        const searchContainer = document.createElement('div');
        searchContainer.classList.add('search-container');

        const searchInput = document.createElement('input');
        searchInput.placeholder = 'Enter model name';

        const searchButton = document.createElement('button');
        searchButton.textContent = 'Search';
        searchButton.addEventListener('click', () => {
            const modelName = searchInput.value.trim();
            if (modelName) {
                openSimpcitySite(modelName);
                document.body.removeChild(searchContainer);
            }
        });

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        document.body.appendChild(searchContainer);
    }

    function openSimpcitySite(modelName) {
        const url = `https://simpcity.su/search/14138808/?q=${encodeURIComponent(modelName)}&o=date`;
        GM_openInTab(url, { active: true });
    }

    // Add styles and the magnifying glass button to the page
    addStyles();
    createLookupButton();
})();