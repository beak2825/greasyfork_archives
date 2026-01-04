// ==UserScript==
// @name         GitHub Bookmark Repositories with Lists and Removal
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Bookmark GitHub repositories into different lists, remove bookmarks, and manage them without starring the repos
// @author       low mist
// @match        https://github.com/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506571/GitHub%20Bookmark%20Repositories%20with%20Lists%20and%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/506571/GitHub%20Bookmark%20Repositories%20with%20Lists%20and%20Removal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultList = 'General';

    // Function to get repository info
    function getRepoInfo() {
        const repo = window.location.pathname.split('/').slice(1, 3).join('/');
        const repoUrl = window.location.href;
        return { repo, repoUrl };
    }

    // Function to save a bookmark
    function saveBookmark(repo, repoUrl, list) {
        const bookmarks = JSON.parse(localStorage.getItem('ghBookmarks') || '{}');
        if (!bookmarks[list]) bookmarks[list] = [];
        if (!bookmarks[list].some(b => b.repo === repo)) {
            bookmarks[list].push({ repo, repoUrl });
            localStorage.setItem('ghBookmarks', JSON.stringify(bookmarks));
            updateBookmarkButton(true);
        }
    }

    // Function to remove a bookmark
    function removeBookmark(repo, list) {
        let bookmarks = JSON.parse(localStorage.getItem('ghBookmarks') || '{}');
        if (bookmarks[list]) {
            bookmarks[list] = bookmarks[list].filter(b => b.repo !== repo);
            if (bookmarks[list].length === 0) delete bookmarks[list];
            localStorage.setItem('ghBookmarks', JSON.stringify(bookmarks));
            updateBookmarkButton(false);
        }
    }

    // Function to check if a repository is bookmarked in any list
    function isBookmarked(repo) {
        const bookmarks = JSON.parse(localStorage.getItem('ghBookmarks') || '{}');
        return Object.keys(bookmarks).some(list => bookmarks[list].some(b => b.repo === repo));
    }

    // Function to check if a repository is bookmarked in a specific list
    function isBookmarkedInList(repo, list) {
        const bookmarks = JSON.parse(localStorage.getItem('ghBookmarks') || '{}');
        return bookmarks[list] && bookmarks[list].some(b => b.repo === repo);
    }

    // Function to update bookmark button state
    function updateBookmarkButton(bookmarked) {
        const button = document.getElementById('bookmarkButton');
        button.textContent = bookmarked ? 'Bookmarked' : 'Bookmark';
    }

    // Function to add a new list
    function addNewList(listName) {
        const lists = JSON.parse(localStorage.getItem('ghBookmarkLists') || '["General"]');
        if (!lists.includes(listName)) {
            lists.push(listName);
            localStorage.setItem('ghBookmarkLists', JSON.stringify(lists));
        }
    }

    // Inject the bookmark button and dropdown into the page
    function addBookmarkButton() {
        const { repo, repoUrl } = getRepoInfo();
        const actionBar = document.querySelector('.pagehead-actions');
        if (actionBar) {
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.display = 'inline-block';

            const button = document.createElement('button');
            button.id = 'bookmarkButton';
            button.className = 'btn btn-sm';
            button.style.marginLeft = '8px';
            button.textContent = isBookmarked(repo) ? 'Bookmarked' : 'Bookmark';

            const dropdown = document.createElement('div');
            dropdown.style.display = 'none';
            dropdown.style.position = 'absolute';
            dropdown.style.backgroundColor = '#2d333b'; // Dark background color to match GitHub dark theme
            dropdown.style.border = '1px solid #444c56'; // Dark border color
            dropdown.style.boxShadow = '0 3px 12px rgba(0, 0, 0, .15)'; // Darker shadow
            dropdown.style.zIndex = '1000';
            dropdown.style.right = '0';
            dropdown.style.top = '28px';
            dropdown.style.width = '200px';
            dropdown.style.borderRadius = '6px';
            dropdown.style.color = '#c9d1d9'; // Light text color for dark mode

            const lists = JSON.parse(localStorage.getItem('ghBookmarkLists') || '["General"]');

            lists.forEach(list => {
                const listItem = document.createElement('div');
                listItem.textContent = isBookmarkedInList(repo, list) ? `${list} (Remove)` : list;
                listItem.style.padding = '8px 16px';
                listItem.style.cursor = 'pointer';
                listItem.style.borderBottom = '1px solid #444c56'; // Dark border between items
                listItem.addEventListener('click', () => {
                    if (isBookmarkedInList(repo, list)) {
                        removeBookmark(repo, list);
                        listItem.textContent = list;
                    } else {
                        saveBookmark(repo, repoUrl, list);
                        listItem.textContent = `${list} (Remove)`;
                    }
                    updateBookmarkButton(isBookmarked(repo));
                });
                listItem.addEventListener('mouseover', () => {
                    listItem.style.backgroundColor = '#444c56'; // Highlight on hover
                });
                listItem.addEventListener('mouseout', () => {
                    listItem.style.backgroundColor = '#2d333b'; // Revert to dark background on mouse out
                });
                dropdown.appendChild(listItem);
            });

            const addListButton = document.createElement('div');
            addListButton.textContent = 'Add new list';
            addListButton.style.padding = '8px 16px';
            addListButton.style.cursor = 'pointer';
            addListButton.style.borderTop = '1px solid #444c56'; // Dark separator for the "Add new list" option
            addListButton.style.fontWeight = 'bold';
            addListButton.addEventListener('click', () => {
                const newList = prompt('Enter new list name:');
                if (newList) {
                    addNewList(newList);
                    const newListItem = document.createElement('div');
                    newListItem.textContent = newList;
                    newListItem.style.padding = '8px 16px';
                    newListItem.style.cursor = 'pointer';
                    newListItem.style.borderBottom = '1px solid #444c56';
                    newListItem.addEventListener('click', () => {
                        if (isBookmarkedInList(repo, newList)) {
                            removeBookmark(repo, newList);
                            newListItem.textContent = newList;
                        } else {
                            saveBookmark(repo, repoUrl, newList);
                            newListItem.textContent = `${newList} (Remove)`;
                        }
                        updateBookmarkButton(isBookmarked(repo));
                    });
                    newListItem.addEventListener('mouseover', () => {
                        newListItem.style.backgroundColor = '#444c56'; // Highlight on hover
                    });
                    newListItem.addEventListener('mouseout', () => {
                        newListItem.style.backgroundColor = '#2d333b'; // Revert to dark background on mouse out
                    });
                    dropdown.insertBefore(newListItem, addListButton);
                }
            });
            dropdown.appendChild(addListButton);

            button.addEventListener('click', function() {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });

            // Close dropdown if clicked outside
            document.addEventListener('click', function(event) {
                if (!container.contains(event.target)) {
                    dropdown.style.display = 'none';
                }
            });

            container.appendChild(button);
            container.appendChild(dropdown);
            actionBar.appendChild(container);
        }
    }

    // Initialize the script
    function init() {
        addBookmarkButton();
    }

    // Run the script when the DOM is fully loaded
    window.addEventListener('load', init);
})();
