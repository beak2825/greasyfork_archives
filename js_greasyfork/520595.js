// ==UserScript==
// @name         MyDramaList to Avistaz Search
// @namespace    https://mydramalist.com/
// @version      1.2
// @description  Add a button to search dramas and movies on Avistaz from MyDramaList.
// @author       ChatGPT
// @match        https://mydramalist.com/shows/*
// @match        https://mydramalist.com/movies/*
// @match        https://mydramalist.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520595/MyDramaList%20to%20Avistaz%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/520595/MyDramaList%20to%20Avistaz%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to create the search button
    function createSearchButton(name, year, type) {
        const button = document.createElement('button');
        button.textContent = 'Search on Avistaz';
        button.style.marginLeft = '10px';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#1E90FF';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        const query = encodeURIComponent(name);
        const url = `https://avistaz.to/${type}?search=${query}&year_start=${year}&year_end=${year}`;

        button.addEventListener('click', () => {
            window.open(url, '_blank');
        });

        return button;
    }

    function addSearchButtons(containerSelector) {
        const items = document.querySelectorAll(containerSelector);
        items.forEach(item => {
            const titleElement = item.querySelector('.title a');
            const metadataElement = item.querySelector('.text-muted');

            if (titleElement && metadataElement) {
                const name = titleElement.textContent.trim();
                const metadata = metadataElement.textContent.trim();
                const yearMatch = metadata.match(/-\s(\d{4})/);
                const typeMatch = metadata.match(/(Drama|Movie)/);

                if (yearMatch && typeMatch) {
                    const year = yearMatch[1];
                    const type = typeMatch[1] === 'Drama' ? 'tv-shows' : 'movies';
                    const searchButton = createSearchButton(name, year, type);
                    titleElement.parentElement.appendChild(searchButton);
                }
            }
        });
    }

    // Determine page and apply logic
    if (window.location.pathname.includes('/shows/') || window.location.pathname.includes('/movies/')) {
        addSearchButtons('.box .box-body .content');
    } else if (window.location.pathname.includes('/search')) {
        addSearchButtons('.box .box-body .content');
    }
})();
