// ==UserScript==
// @name YouTube Playlist Search Bar (Inchbrayock's Branch)
// @namespace http://tampermonkey.net/
// @version 1.1
// @description Adds a search bar to YouTube playlists. Search by title or channel name (using @). Does NOT work with shorts or when playlist video filter is set to "Shorts".
// @match https://www.youtube.com/playlist*
// @author Setnour6
// @author Inchbrayock
// @homepageURL https://github.com/Setnour6/Helpful-Userscripts
// @grant none
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/533651/YouTube%20Playlist%20Search%20Bar%20%28Inchbrayock%27s%20Branch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533651/YouTube%20Playlist%20Search%20Bar%20%28Inchbrayock%27s%20Branch%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Array of placeholder texts that will be animated in the search input
    const PLACEHOLDERS = [
        'Search in playlist...',
        'Type @ to search by channel...',
        'Find your favorite videos...',
        'Search through your collection...',
        'Looking for something specific?',
        'Filter playlist content...'
    ];

    // CSS styles for the search bar components
    const STYLES = {
        container: `
            display: flex;
            align-items: center;
            margin: 24px auto 20px;
            padding: 0 24px;
            width: 100%;
            max-width: 800px;
            box-sizing: border-box;
            transition: all 0.3s ease;
            `,
        searchContainer: `
            display: flex;
            align-items: center;
            width: 100%;
            background-color: var(--yt-spec-badge-chip-background);
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            `,
        input: `
            flex: 1;
            padding: 14px 20px;
            border: none;
            border-radius: 12px;
            color: var(--yt-spec-text-primary);
            background-color: transparent;
            font-family: 'YouTube Sans', Roboto, sans-serif;
            font-size: 15px;
            height: 48px;
            box-sizing: border-box;
            outline: none;
            transition: all 0.3s ease;
            `
    };

    // Global variables to track state
    let originalVideos = []; // Stores the original list of videos before filtering
    let isTyping = true; // Controls typing animation direction (typing vs deleting)
    let isAnimating = false; // Prevents multiple animations from running simultaneously
    let currentPlaceholderIndex = 0; // Tracks which placeholder text is currently being shown

    // Handles the animated typing effect for placeholder text
    async function animatePlaceholder(input) {
        if (isAnimating) return;
        isAnimating = true;

        while (document.getElementById('playlist-search-input') && !input.value && !input.matches(':focus')) {
            const placeholder = PLACEHOLDERS[currentPlaceholderIndex];

            if (isTyping) {
                // Typing effect
                input.placeholder = ''; // Clear before starting
                for (let i = 0; i <= placeholder.length; i++) {
                    if (!document.getElementById('playlist-search-input') || input.value || input.matches(':focus')) {
                        isAnimating = false;
                        return;
                    }
                    input.placeholder = placeholder.slice(0, i);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
                isTyping = false;
            } else {
                // Deleting effect
                for (let i = placeholder.length; i >= 0; i--) {
                    if (!document.getElementById('playlist-search-input') || input.value || input.matches(':focus')) {
                        isAnimating = false;
                        return;
                    }
                    input.placeholder = placeholder.slice(0, i);
                    await new Promise(resolve => setTimeout(resolve, 30));
                }
                currentPlaceholderIndex = (currentPlaceholderIndex + 1) % PLACEHOLDERS.length;
                isTyping = true;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        isAnimating = false;
    }

    // Handles visual changes when the search input is focused
    function handleFocus(searchContainer, input) {
        searchContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
        searchContainer.style.transform = 'translateY(-1px)';
        searchContainer.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        input.placeholder = '';
    }

    // Handles visual changes when the search input loses focus
    function handleBlur(searchContainer, input) {
        searchContainer.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        searchContainer.style.transform = 'none';
        searchContainer.style.borderColor = 'rgba(255, 255, 255, 0.1)';

        // Only restart animation if the input is empty
        if (!input.value) {
            // Reset all animation states
            isAnimating = false;
            isTyping = true;
            currentPlaceholderIndex = 0;
            input.placeholder = '';
            setTimeout(() => {
                if (!input.value && !input.matches(':focus')) {
                    animatePlaceholder(input);
                }
            }, 500); // Delay restart of animation
        }
    }

    // Filters the playlist videos based on search query
    function filterVideos(query) {
        const playlistContents = document.querySelector('#contents.ytd-playlist-video-list-renderer');
        if (!playlistContents) return;

        // Store original videos on first search
        if (originalVideos.length === 0) {
            originalVideos = Array.from(document.querySelectorAll('#contents ytd-playlist-video-renderer'));
        }

        // Check if searching by channel name (using @) or video title
        const isChannelSearch = query.startsWith('@');
        const searchQuery = isChannelSearch ? query.slice(1).toLowerCase() : query.toLowerCase();

        // Filter videos based on search criteria
        const matchingVideos = originalVideos.filter(video => {
            const title = video.querySelector('#video-title').textContent.toLowerCase();
            const channelName = video.querySelector('#channel-name a').textContent.toLowerCase();
            return isChannelSearch ? channelName.includes(searchQuery) : title.includes(searchQuery);
        });

        updatePlaylistContents(playlistContents, matchingVideos);
    }

    // Resets the playlist to show all videos
    function resetFilter() {
        const playlistContents = document.querySelector('#contents.ytd-playlist-video-list-renderer');
        if (!playlistContents) return;
        updatePlaylistContents(playlistContents, originalVideos);
    }

    // Updates the playlist container with filtered videos
    function updatePlaylistContents(container, videos) {
        // Clear the container first
        container.textContent = '';

        // Process videos in batches
        const BATCH_SIZE = 10;
        let currentIndex = 0;

        function processBatch() {
            const batch = videos.slice(currentIndex, currentIndex + BATCH_SIZE);
            if (batch.length === 0) return;

            requestAnimationFrame(() => {
                batch.forEach(video => container.appendChild(video));
                currentIndex += BATCH_SIZE;

                // Schedule next batch
                if (currentIndex < videos.length) {
                    setTimeout(processBatch, 16); // Roughly aims for 60fps
                }
            });
        }

        processBatch();
    }

    /**
    * Scrolls the page to load all videos in the playlist.
    * Keeps scrolling until the number of loaded <ytd-playlist-video-renderer> nodes
    * stops increasing for two consecutive passes.
    */
    async function loadAllVideos() {
        const selector = '#contents ytd-playlist-video-renderer';
        let prevCount = 0;
        let stablePasses = 0;
        // keep scrolling until count stabilizes twice
        while (stablePasses < 2) {
            window.scrollTo(0, document.documentElement.scrollHeight);
            // allow YouTube's infinite‑scroll to fetch more items
            await new Promise(res => setTimeout(res, 1000));
            const currentCount = document.querySelectorAll(selector).length;
            if (currentCount === prevCount) {
                stablePasses++;
            } else {
                stablePasses = 0;
                prevCount = currentCount;
            }
        }
    }

    // Creates and injects the search bar into the YouTube playlist page
    function createSearchBar() {
        // Prevent duplicate search bars
        if (document.getElementById('playlist-search-bar')) return;

        const target = document.querySelector('#page-manager ytd-playlist-video-list-renderer');
        if (!target) return;

        const container = document.createElement('div');
        container.id = 'playlist-search-bar';
        container.style.cssText = STYLES.container;

        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = STYLES.searchContainer;

        const input = document.createElement('input');
        input.id = 'playlist-search-input';
        input.placeholder = '';
        input.style.cssText = STYLES.input;

        input.addEventListener('focus', () => handleFocus(searchContainer, input));
        input.addEventListener('blur', () => handleBlur(searchContainer, input));
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            query ? filterVideos(query) : resetFilter();
        });

        // New: on Enter, first load all videos, then redo the filter
        input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
            e.preventDefault();
            const query = input.value.trim();
            // clear any previous cache so we recapture everything
            originalVideos = [];
            // load all the videos in the playlist
            await loadAllVideos();
            // rebuild originalVideos from the fully‑loaded list
            originalVideos = Array.from(document.querySelectorAll('#contents ytd-playlist-video-renderer'));
            // reapply the current filter (or reset if empty)
            query ? filterVideos(query) : resetFilter();
            }
        });

        searchContainer.appendChild(input);
        container.appendChild(searchContainer);
        target.parentNode.insertBefore(container, target);

        requestAnimationFrame(() => animatePlaceholder(input));
    }

    // Initialize the script
    // Use MutationObserver to handle YouTube's dynamic page loading
    const observer = new MutationObserver(createSearchBar);
    observer.observe(document.body, { childList: true, subtree: true });
    createSearchBar();
})();