// ==UserScript==
// @name         Gelbooru to Danbooru Direct
// @namespace    github.com/Brawl345
// @version      2.0
// @description  Adds a link to search Gelbooru images directly on Danbooru via API
// @author       Claude 4 Sonnet (Reasoning)
// @match        https://gelbooru.com/index.php?page=post&s=view&id=*
// @grant        none
// @icon         https://gelbooru.com/favicon.png
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/530845/Gelbooru%20to%20Danbooru%20Direct.user.js
// @updateURL https://update.greasyfork.org/scripts/530845/Gelbooru%20to%20Danbooru%20Direct.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalLink = document.querySelector('li > a[href*="/images/"][target="_blank"][rel="noopener"]');

    if (originalLink && originalLink.textContent === 'Original image') {
        const href = originalLink.getAttribute('href');
        const filename = href.split('/').pop();
        const md5 = filename.split('.')[0];

        const newLi = document.createElement('li');
        const searchButton = document.createElement('a');
        searchButton.textContent = 'Search on Danbooru';
        searchButton.href = '#';
        searchButton.target = '_blank';
        searchButton.style.fontWeight = 'bold';
        searchButton.style.cursor = 'pointer';

        const clickHandler = async (e) => {
            e.preventDefault();

            searchButton.textContent = 'Searching...';
            searchButton.style.color = 'orange';

            try {
                const response = await fetch(`https://danbooru.donmai.us/posts.json?tags=md5:${md5}`);
                const posts = await response.json();

                if (posts.length > 0) {
                    const postId = posts[0].id;
                    const postUrl = `https://danbooru.donmai.us/posts/${postId}`;

                    searchButton.removeEventListener('click', clickHandler);
                    searchButton.href = postUrl;
                    searchButton.textContent = 'Open on Danbooru';
                    searchButton.style.color = 'green';
                    searchButton.style.cursor = 'pointer';

                    window.open(postUrl, '_blank');
                } else {
                    searchButton.textContent = 'Not found';
                    searchButton.style.color = 'red';
                    setTimeout(() => {
                        searchButton.textContent = 'Search on Danbooru';
                        searchButton.style.color = '';
                    }, 2000);
                }
            } catch (error) {
                console.error('Danbooru API error:', error);
                searchButton.textContent = 'Error';
                searchButton.style.color = 'red';
                setTimeout(() => {
                    searchButton.textContent = 'Search on Danbooru';
                    searchButton.style.color = '';
                }, 2000);
            }
        };

        searchButton.addEventListener('click', clickHandler);

        newLi.appendChild(searchButton);
        originalLink.parentNode.parentNode.insertBefore(newLi, originalLink.parentNode.nextSibling);
    }
})();