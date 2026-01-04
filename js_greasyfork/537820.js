// ==UserScript==
// @name         Plex Dynamic Title
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Change the title of Plex pages to reflect the current content being viewed
// @author       azizLIGHT
// @match        https://app.plex.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537820/Plex%20Dynamic%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/537820/Plex%20Dynamic%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateTitle() {
        const url = window.location.href;
        let newTitle = 'Plex';

        // Determine the title based on the current URL
        if (url.includes('/desktop/#!/')) {
            if (url === 'https://app.plex.tv/desktop/#!/') {
                newTitle = 'Plex: Home';
            } else if (url.includes('source=watchlist')) {
                newTitle = 'Plex: Watchlist';
            } else if (url.includes('source=home')) {
                newTitle = 'Plex: Discover';
            } else if (url.includes('/search?')) {
                const searchQueryMatch = url.match(/query=([^&]+)/);
                if (searchQueryMatch) {
                    const searchQuery = decodeURIComponent(searchQueryMatch[1]);
                    newTitle = `Plex: Top Results for "${searchQuery}"`;
                }
            } else if (url.includes('/settings/')) {
                // Handle settings pages
                const settingsHeader = document.querySelector('h2.SettingsPageHeader-header-Ra2WXw');
                if (settingsHeader) {
                    newTitle = `Plex: ${settingsHeader.innerText}`;
                }
            } else if (url.includes('/media/')) {
                // Handle library pages
                const libraryTitleElement = document.querySelector('div.PageHeaderTitle-title-W0yjas');
                if (libraryTitleElement) {
                    const libraryName = libraryTitleElement.innerText;
                    newTitle = `Plex: ${libraryName}`;
                }
            }

            // Check for active tab titles on non-library pages
            const selectedTab = document.querySelector('.TabButton-selected-wnNjlr');
            if (selectedTab) {
                const tabTitle = selectedTab.innerText;
                if (url.includes('source=home')) {
                    newTitle = `Plex: Home - ${tabTitle}`;
                } else if (url.includes('source=watchlist')) {
                    newTitle = `Plex: Watchlist - ${tabTitle}`;
                } else {
                    newTitle = `Plex: ${tabTitle}`;
                }
            }
        }

        // Check for movie/show titles
        const titleElement = document.querySelector('h1[data-testid="metadata-title"]');
        const libraryTitleElement = document.querySelector('div.PageHeaderTitle-title-W0yjas');

        if (titleElement && libraryTitleElement) {
            const movieName = titleElement.innerText;
            const libraryName = libraryTitleElement.innerText;

            // Check for subtitle
            const subtitleElement = document.querySelector('h2[data-testid="metadata-subtitle"]');
            if (subtitleElement) {
                const subtitleText = subtitleElement.innerText;

                // Check if the subtitle contains "Directed by"
                if (subtitleText.startsWith("Directed by")) {
                    // It's a movie, so exclude the director info
                    newTitle = `Plex: ${libraryName} - ${movieName}`;
                } else {
                    // It's likely a TV show with season info
                    newTitle = `Plex: ${libraryName} - ${movieName}: ${subtitleText}`;
                }
            } else {
                // No subtitle, just set the title
                newTitle = `Plex: ${libraryName} - ${movieName}`;
            }
        } else if (libraryTitleElement) {
            const libraryName = libraryTitleElement.innerText;
            if (url.includes('pivot=recommended')) {
                newTitle = `Plex: ${libraryName} - Recommended`;
            } else if (url.includes('pivot=library')) {
                newTitle = `Plex: ${libraryName} - Library`;
            } else if (url.includes('pivot=collections')) {
                newTitle = `Plex: ${libraryName} - Collections`;
            } else if (url.includes('pivot=playlists')) {
                newTitle = `Plex: ${libraryName} - Playlists`;
            } else if (url.includes('pivot=categories')) {
                newTitle = `Plex: ${libraryName} - Categories`;
            } else {
                newTitle = `Plex: ${libraryName}`;
            }
        }

        document.title = newTitle;
    }

    // Run the function on page load
    updateTitle();

    // Observe changes in the DOM to update the title dynamically
    const observer = new MutationObserver(updateTitle);
    observer.observe(document.body, { childList: true, subtree: true });
})();

