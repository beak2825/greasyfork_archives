// ==UserScript==
// @name         Custom Search Engine Redirect (Enhanced)
// @description  Redirects searches from popular search engines to your preferred engine and adds a sleek, auto-hiding search bar for instant custom searches.
// @author       SijosxStudio
// @version      1.0
// @license       MIT
// @match        *://*/*
// @grant        none
// @inject-into  auto
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1375139

// @downloadURL https://update.greasyfork.org/scripts/530134/Custom%20Search%20Engine%20Redirect%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530134/Custom%20Search%20Engine%20Redirect%20%28Enhanced%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // CONFIGURATION: Replace with your preferred search engine URL.
    const searchEngineURL = 'https://startpage.com/search?q='; 

    const defaultEngines = [
        'duckduckgo.com',
        'google.com',
        'bing.com',
        'yahoo.com',
        'search.yahoo.com'
    ];

    // REDIRECTION LOGIC
    const currentURL = window.location.href;

    if (defaultEngines.some(engine => currentURL.includes(engine))) {
        const queryParam = new URLSearchParams(window.location.search);
        const query = queryParam.get('q') || queryParam.get('query') || queryParam.get('p');
        if (query) {
            window.location.href = searchEngineURL + encodeURIComponent(query);
        }
    }

    // FLOATING SEARCH BAR (WITH AUTO-HIDE)
    window.addEventListener('DOMContentLoaded', function () {
        const searchBar = document.createElement('div');
        searchBar.id = 'floating-search-bar';
        searchBar.style.position = 'fixed';
        searchBar.style.top = '10px';
        searchBar.style.right = '-220px'; // Start hidden
        searchBar.style.zIndex = '9999';
        searchBar.style.background = 'rgba(0, 0, 0, 0.8)';
        searchBar.style.border = '2px solid #00bfff';
        searchBar.style.borderRadius = '8px';
        searchBar.style.padding = '5px';
        searchBar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        searchBar.style.display = 'flex';
        searchBar.style.alignItems = 'center';
        searchBar.style.transition = 'right 0.3s ease-in-out';

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Custom Search...';
        inputField.style.border = 'none';
        inputField.style.outline = 'none';
        inputField.style.padding = '5px';
        inputField.style.flexGrow = '1';
        inputField.style.width = '150px';
        inputField.style.background = 'transparent';
        inputField.style.color = '#fff';

        const searchButton = document.createElement('button');
        searchButton.textContent = 'Go';
        searchButton.style.background = '#00bfff';
        searchButton.style.color = '#fff';
        searchButton.style.border = 'none';
        searchButton.style.padding = '5px 10px';
        searchButton.style.cursor = 'pointer';
        searchButton.style.borderRadius = '4px';

        searchButton.onclick = function () {
            const query = inputField.value.trim();
            if (query) {
                window.location.href = searchEngineURL + encodeURIComponent(query);
            }
        };

        inputField.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });

        // Auto-hide logic
        const toggleArea = document.createElement('div');
        toggleArea.style.position = 'fixed';
        toggleArea.style.top = '10px';
        toggleArea.style.right = '0';
        toggleArea.style.width = '30px';
        toggleArea.style.height = '30px';
        toggleArea.style.zIndex = '9998';

        toggleArea.addEventListener('mouseenter', () => {
            searchBar.style.right = '10px'; // Show search bar on hover
        });

        searchBar.addEventListener('mouseleave', () => {
            searchBar.style.right = '-220px'; // Auto-hide on mouse leave
        });

        searchBar.appendChild(inputField);
        searchBar.appendChild(searchButton);
        document.body.appendChild(searchBar);
        document.body.appendChild(toggleArea);
    });
})();