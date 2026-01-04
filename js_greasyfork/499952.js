// ==UserScript==
// @name         Model Lookup
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds a magnifying glass button to search models on Simpcity.su from any website.
// @match        *://*/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/499952/Model%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/499952/Model%20Lookup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
           .lookup-button {
                position: fixed;
                top: 50px;
                right: 50px;
                z-index: 9999;
                font-size: 30px;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 50%;
                padding: 10px;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }
           .lookup-button:hover {
                transform: scale(1.1);
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
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
        button.innerHTML = '<i class="fa fa-search" style="font-size: 30px;"></i>';
        button.addEventListener('click', showSearchInput);

        document.body.appendChild(button);
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