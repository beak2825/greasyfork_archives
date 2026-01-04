// ==UserScript==
// @name         YouTube Playlist Search Bar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a search bar to YouTube playlists. Does NOT work with shorts or when playlist video filter is set to "Shorts".
// @match        https://www.youtube.com/playlist*
// @author       Setnour6
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/517253/YouTube%20Playlist%20Search%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/517253/YouTube%20Playlist%20Search%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createSearchBar() {
        // Check if custom search bar already exists
        if (document.getElementById('playlist-search-bar')) return;

        // Find target element to place search bar under sorting options (works best)
        const target = document.querySelector('#page-manager ytd-playlist-video-list-renderer');

        // Only proceed if target element exists
        if (!target) return;

        const container = document.createElement('div');
        container.id = 'playlist-search-bar';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.marginBottom = '12px';
        container.style.padding = '6px 12px';
        container.style.borderRadius = '4px';
        container.style.border = '1px solid var(--yt-border-color)';
        container.style.backgroundColor = 'var(--yt-spec-general-background-a)';

        container.style.width = '93%';
        container.style.marginLeft = 'auto';
        container.style.marginRight = 'auto';

        const input = document.createElement('input');
        input.id = 'playlist-search-input';
        input.placeholder = 'Filter videos by title...';
        input.style.flex = '1';
        input.style.padding = '10px 12px';
        input.style.marginRight = '0';
        input.style.border = '1px solid var(--yt-border-color)';
        input.style.borderRadius = '20px 0 0 20px';
        input.style.color = 'var(--yt-spec-text-primary)';
        input.style.backgroundColor = 'var(--yt-spec-badge-chip-background)';
        input.style.fontFamily = 'Roboto, Noto, sans-serif';
        input.style.fontSize = '14px';

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                button.click();
            }
        });

        const button = document.createElement('button');
        button.textContent = 'Search';
        button.style.padding = '10px 16px';
        button.style.border = 'none';
        button.style.borderRadius = '0 20px 20px 0';
        button.style.backgroundColor = '#FF0000';
        button.style.color = '#fff';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Roboto, Noto, sans-serif';
        button.style.fontSize = '14px';

        button.addEventListener('click', () => {
            const query = input.value.toLowerCase();
            if (query) {
                filterVideos(query);
            } else {
                resetFilter();
            }
        });

        container.appendChild(input);
        container.appendChild(button);

        target.parentNode.insertBefore(container, target);
    }

    function filterVideos(query) {
        const videos = document.querySelectorAll('#contents ytd-playlist-video-renderer');

        videos.forEach(video => {
            const title = video.querySelector('#video-title').textContent.toLowerCase();

            const matches = title.includes(query);
            video.style.display = matches ? 'flex' : 'none';
        });
    }

    function resetFilter() {
        const videos = document.querySelectorAll('#contents ytd-playlist-video-renderer');
        videos.forEach(video => {
            video.style.display = 'flex';
        });
    }

    const observer = new MutationObserver(() => {
        createSearchBar();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    createSearchBar();
})();
