// ==UserScript==
// @name         GitHub View Bookmarked Repositories
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add a "Bookmarked Repositories" option to your GitHub profile page and handle bookmarks display
// @author       low mist
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506578/GitHub%20View%20Bookmarked%20Repositories.user.js
// @updateURL https://update.greasyfork.org/scripts/506578/GitHub%20View%20Bookmarked%20Repositories.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate the bookmarks page content
    function generateBookmarksPage() {
        const bookmarks = JSON.parse(localStorage.getItem('ghBookmarks') || '{}');
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.style.maxWidth = '800px';
        container.style.margin = 'auto';
        container.style.backgroundColor = '#0d1117'; // Background color to match GitHub's dark theme
        container.style.color = '#c9d1d9'; // Text color for dark mode
        container.style.borderRadius = '6px';

        const title = document.createElement('h2');
        title.textContent = 'Bookmarked Repositories';
        title.style.textAlign = 'center';
        title.style.color = '#58a6ff'; // GitHub blue for the title
        container.appendChild(title);

        if (Object.keys(bookmarks).length === 0) {
            const noBookmarks = document.createElement('p');
            noBookmarks.textContent = 'You have no bookmarked repositories.';
            noBookmarks.style.textAlign = 'center';
            container.appendChild(noBookmarks);
        } else {
            Object.keys(bookmarks).forEach(list => {
                const listTitle = document.createElement('h3');
                listTitle.textContent = list;
                listTitle.style.marginTop = '20px';
                listTitle.style.color = '#58a6ff'; // GitHub blue for list titles
                container.appendChild(listTitle);

                const repoList = document.createElement('ul');
                bookmarks[list].forEach(bookmark => {
                    const listItem = document.createElement('li');
                    const repoLink = document.createElement('a');
                    repoLink.href = bookmark.repoUrl;
                    repoLink.textContent = bookmark.repo;
                    repoLink.style.color = '#c9d1d9'; // Link color for dark mode
                    repoLink.style.textDecoration = 'none';
                    listItem.appendChild(repoLink);
                    repoList.appendChild(listItem);
                });
                container.appendChild(repoList);
            });
        }

        document.body.innerHTML = ''; // Clear the current content
        document.body.appendChild(container);
    }

    // Function to add the "Bookmarked Repositories" option to the profile page
    function addBookmarksToProfilePage() {
        const profileTabs = document.querySelector('.UnderlineNav-body');
        if (profileTabs && !document.querySelector('#bookmarked-repos-link')) {
            const bookmarksTab = document.createElement('a');
            bookmarksTab.id = 'bookmarked-repos-link';
            bookmarksTab.className = 'UnderlineNav-item';
            bookmarksTab.href = '/bookmarked-repositories';
            bookmarksTab.textContent = 'Bookmarked Repositories';
            bookmarksTab.style.display = 'flex';
            bookmarksTab.style.alignItems = 'center';

            const icon = document.createElement('img');
            // icon.src = 'https://github.githubassets.com/images/icons/emoji/unicode/1f4c1.png'; // Black-and-white folder icon
            // icon.alt = 'Bookmarks Icon';
            // icon.style.width = '16px';
            // icon.style.height = '16px';
            // icon.style.marginRight = '8px';

            bookmarksTab.prepend(icon);
            profileTabs.appendChild(bookmarksTab);
        }

        // Route to bookmarks page
        if (window.location.pathname === '/bookmarked-repositories') {
            generateBookmarksPage();
        }
    }

    // Initialize the script
    function init() {
        // Check if the current page is the user's profile page
        const isProfilePage = window.location.pathname.startsWith('/');

        // Only add the bookmark option if it's the user's profile page
        if (isProfilePage) {
            // Ensure we only add the bookmarks tab to the profile page
            addBookmarksToProfilePage();
        } else if (window.location.pathname === '/bookmarked-repositories') {
            generateBookmarksPage();
        }
    }

    // Run the script when the DOM is fully loaded
    window.addEventListener('load', init);
})();