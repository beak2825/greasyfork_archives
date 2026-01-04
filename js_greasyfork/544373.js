// ==UserScript==
// @name         xHamster Favorites Video Scraper and Auto-Player
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Scrapes video URLs from xHamster favorites across all pages, displays them in a scrollable list with a search button, and auto-plays them sequentially.
// @match        https://xhamster3.com/my/favorites/videos*
// @match        https://xhamster3.com/videos/*
// @grant        none
// @license      none
// @copyright    Copyright (c) 2025 carlyiooo
// @downloadURL https://update.greasyfork.org/scripts/544373/xHamster%20Favorites%20Video%20Scraper%20and%20Auto-Player.user.js
// @updateURL https://update.greasyfork.org/scripts/544373/xHamster%20Favorites%20Video%20Scraper%20and%20Auto-Player.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    console.log('Script started at:', new Date().toISOString());

    // Helper function: Wait for element
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);

            const observer = new MutationObserver(() => {
                const target = document.querySelector(selector);
                if (target) {
                    observer.disconnect();
                    resolve(target);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout waiting for selector: ${selector}`));
            }, timeout);
        });
    }

    // Scrape video URLs from a single page
    function scrapeVideoURLsFromPage(doc) {
        const videoLinks = [];
        const videoElements = doc.querySelectorAll('.thumb-list__item.video-thumb a.video-thumb__image-container');
        console.log(`Found ${videoElements.length} video elements on page`);
        videoElements.forEach(element => {
            const url = element.getAttribute('href');
            if (url && url.includes('/videos/')) {
                videoLinks.push(url);
            }
        });
        return videoLinks;
    }

    // Fetch all video URLs from all pages
    async function fetchAllVideoURLs() {
        let allVideoURLs = [];
        let maxPages = 1;
        try {
            const pagerElement = await waitForElement('.test-pager li:nth-last-child(2) a');
            maxPages = parseInt(pagerElement.textContent) || 1;
            console.log(`Detected ${maxPages} pages`);
        } catch (error) {
            console.error('Pagination not found, assuming single page:', error);
        }

        const baseURL = 'https://xhamster3.com/my/favorites/videos';
        for (let page = 1; page <= maxPages; page++) {
            const url = page === 1 ? baseURL : `${baseURL}/${page}`;
            console.log(`Fetching page ${page}: ${url}`);
            let attempts = 3;
            while (attempts > 0) {
                try {
                    const response = await fetch(url, { credentials: 'include' });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const text = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const pageURLs = scrapeVideoURLsFromPage(doc);
                    console.log(`Page ${page} yielded ${pageURLs.length} URLs`);
                    allVideoURLs = allVideoURLs.concat(pageURLs);
                    break;
                } catch (error) {
                    console.error(`Error fetching page ${page} (attempt ${4 - attempts}):`, error);
                    attempts--;
                    if (attempts === 0) console.error(`Failed to fetch page ${page} after retries`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        return allVideoURLs;
    }

    // Create UI for video list with search
    function createVideoListUI(videoURLs) {
        console.log('Creating video list UI...');
        const container = document.createElement('div');
        container.id = 'custom-video-list';
        container.style.cssText = `
            position: fixed; top: 20px; left: 20px; width: 350px; max-height: 80vh;
            overflow-y: auto; background: #ffffff; border: 2px solid #000000;
            padding: 15px; z-index: 99999; box-shadow: 0 0 15px rgba(0,0,0,0.7);
            font-family: Arial, sans-serif; color: #000000;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Favorite Videos';
        title.style.cssText = 'margin: 0 0 10px; color: #000000;';
        container.appendChild(title);

        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = 'margin-bottom: 10px; display: flex; gap: 5px;';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search videos...';
        searchInput.style.cssText = 'flex: 1; padding: 5px;';
        const searchButton = document.createElement('button');
        searchButton.textContent = 'Search';
        searchButton.style.cssText = 'padding: 5px 10px; background: #007BFF; color: #ffffff; border: none; cursor: pointer;';
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        container.appendChild(searchContainer);

        const ul = document.createElement('ul');
        ul.id = 'video-list';
        ul.style.cssText = 'list-style: none; padding: 0; margin: 0;';
        container.appendChild(ul);

        function renderVideoList(filter = '') {
            ul.innerHTML = '';
            const filteredURLs = filter
                ? videoURLs.filter(url => url.split('/').pop().toLowerCase().includes(filter.toLowerCase()))
                : videoURLs;

            if (filteredURLs.length === 0) {
                const noVideos = document.createElement('p');
                noVideos.textContent = 'No videos found.';
                ul.appendChild(noVideos);
            } else {
                filteredURLs.forEach((url, index) => {
                    const li = document.createElement('li');
                    li.style.marginBottom = '5px';
                    const a = document.createElement('a');
                    a.href = url;
                    a.textContent = `Video ${index + 1}: ${url.split('/').pop()}`;
                    a.style.cssText = 'color: #007BFF; text-decoration: underline; cursor: pointer;';
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        const originalIndex = videoURLs.indexOf(url);
                        if (originalIndex !== -1) {
                            localStorage.setItem('currentVideoIndex', originalIndex);
                            window.location.href = url;
                        } else {
                            console.error('Video URL not found in original list');
                        }
                    });
                    li.appendChild(a);
                    ul.appendChild(li);
                });
            }
        }

        renderVideoList();

        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            console.log(`Searching for: ${searchTerm}`);
            renderVideoList(searchTerm);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });

        document.body.appendChild(container);
        console.log('Video list UI appended to document.body');
    }

    // Main logic based on current page
    if (window.location.pathname.startsWith('/my/favorites/videos')) {
        try {
            await waitForElement('.thumb-list__item.video-thumb', 10000);
            const videoURLs = await fetchAllVideoURLs();
            console.log(`Total video URLs collected: ${videoURLs.length}`, videoURLs);
            localStorage.setItem('favoriteVideoURLs', JSON.stringify(videoURLs));
            createVideoListUI(videoURLs);
        } catch (error) {
            console.error('Script execution failed:', error);
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed; top: 20px; left: 20px; background: #ffcccc;
                border: 2px solid #ff0000; padding: 10px; z-index: 99999;
            `;
            errorDiv.textContent = 'Error: Could not load video list. Check console for details.';
            document.body.appendChild(errorDiv);
        }
    } else if (window.location.pathname.startsWith('/videos/')) {
        const videoURLs = JSON.parse(localStorage.getItem('favoriteVideoURLs') || '[]');
        const currentIndex = parseInt(localStorage.getItem('currentVideoIndex') || '-1');
        if (videoURLs.length > 0 && currentIndex >= 0 && currentIndex < videoURLs.length) {
            try {
                const videoElement = await waitForElement('video', 15000);
                videoElement.addEventListener('ended', () => {
                    const nextIndex = currentIndex + 1;
                    if (nextIndex < videoURLs.length) {
                        localStorage.setItem('currentVideoIndex', nextIndex);
                        window.location.href = videoURLs[nextIndex];
                    } else {
                        console.log('All videos played.');
                        localStorage.removeItem('favoriteVideoURLs');
                        localStorage.removeItem('currentVideoIndex');
                    }
                }, { once: true });
            } catch (error) {
                console.error('Video element not found:', error);
            }
        }
    }
})();