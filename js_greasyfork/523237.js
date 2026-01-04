// ==UserScript==
// @name         Universal Search Enhancer
// @namespace    https://itzmehuman000.github.io/
// @version      1.0
// @description  Adds a universal search bar to all websites for quick searches on Google, Wikipedia, or YouTube.
// @author       DUSTIN
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523237/Universal%20Search%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/523237/Universal%20Search%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const searchContainer = document.createElement('div');
    searchContainer.style.position = 'fixed';
    searchContainer.style.top = '10px';
    searchContainer.style.right = '10px';
    searchContainer.style.zIndex = '9999';
    searchContainer.style.backgroundColor = '#ffffff';
    searchContainer.style.border = '1px solid #ccc';
    searchContainer.style.padding = '10px';
    searchContainer.style.borderRadius = '5px';
    searchContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    searchContainer.style.fontFamily = 'Arial, sans-serif';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search something...';
    searchInput.style.width = '200px';
    searchInput.style.padding = '5px';
    searchInput.style.marginRight = '5px';
    searchInput.style.border = '1px solid #ccc';
    searchInput.style.borderRadius = '3px';

    const searchDropdown = document.createElement('select');
    searchDropdown.style.padding = '5px';
    searchDropdown.style.border = '1px solid #ccc';
    searchDropdown.style.borderRadius = '3px';

    const platforms = [
        { name: 'Google', url: 'https://www.google.com/search?q=' },
        { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/' },
        { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
    ];

    platforms.forEach(platform => {
        const option = document.createElement('option');
        option.value = platform.url;
        option.textContent = platform.name;
        searchDropdown.appendChild(option);
    });


    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.style.padding = '5px 10px';
    searchButton.style.border = 'none';
    searchButton.style.backgroundColor = '#007bff';
    searchButton.style.color = '#fff';
    searchButton.style.borderRadius = '3px';
    searchButton.style.cursor = 'pointer';

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            const selectedPlatform = searchDropdown.value;
            window.open(selectedPlatform + encodeURIComponent(query), '_blank');
        }
    });

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchDropdown);
    searchContainer.appendChild(searchButton);

    document.body.appendChild(searchContainer);
})();
