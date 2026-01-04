// ==UserScript==
// @name         Rule34Hentai Animated Post Sorter & Info
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhances Rule34Hentai's animated section by collecting, sorting by duration/size, and displaying video details.
// @author       0wn3dbot
// @license      MIT
// @match        https://rule34hentai.net/post/list*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/533057/Rule34Hentai%20Animated%20Post%20Sorter%20%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/533057/Rule34Hentai%20Animated%20Post%20Sorter%20%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONSTANTS AND STYLES ---
    const STORAGE_KEY = 'r34hentai_collected_posts';
    const CONTAINER_SELECTOR = '#image-list .blockbody';
    const LOGGED_IN_SECTION_SELECTOR = 'section[id^="Logged_in_as_"]';
    const LOGIN_HEAD_SELECTOR = '#Loginhead';

    GM_addStyle(`
        /* Control panel styles */
        .r34h-collection-controls {
            background: #FCD9A9; /* Website background color */
            padding: 10px;
            border: 1px solid #B89F7C; /* Website border color */
            border-radius: 5px;
            margin: 10px 0;
            color: #665844; /* Website text color */
            font-size: 0.9em;
        }
        .r34h-controls-grid {
            display: grid;
            grid-template-columns: auto auto auto;
            gap: 8px;
            align-items: center;
        }
        .r34h-control-row {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .r34h-collection-controls label {
            font-weight: bold;
        }
        .r34h-collection-controls input[type="number"] {
            padding: 6px;
            border: 1px solid #B89F7C;
            border-radius: 3px;
            width: 60px;
        }
        .r34h-collection-controls button {
            padding: 7px 10px;
            cursor: pointer;
            background-color: #DABC92; /* Website section header color */
            color: #665844;
            border: 1px solid #B89F7C;
            border-radius: 3px;
            transition: background-color 0.2s;
        }
        .r34h-collection-controls button:hover {
            background-color: #B89F7C;
            color: white;
        }
        .r34h-collection-status {
            margin-top: 5px;
            font-style: italic;
            color: #555;
            min-height: 1em;
        }
        /* Output sections styles */
        .r34h-collected-section {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px solid #B89F7C;
        }
        .r34h-collected-section h2 {
            margin-bottom: 10px;
            color: #444;
            font-size: 1.1em;
        }

        /* --- OVERLAY STYLES --- */
        .thumb.shm-thumb.shm-thumb-link { /* Parent container of the thumbnail */
            position: relative; /* Necessary for absolute positioning of child overlays */
            display: inline-block; /* So position:relative works correctly */
        }
        .r34h-overlay {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent dark background */
            color: white;
            font-size: 0.7em; /* Small font */
            padding: 1px 4px;
            border-radius: 3px;
            pointer-events: none; /* So it doesn't interfere with clicking the link */
            line-height: 1.2;
            white-space: nowrap; /* Prevent text wrapping */
            box-shadow: 0 0 2px rgba(0,0,0,0.5);
        }
        .r34h-duration-overlay {
            top: 2px;    /* Spacing from the top */
            left: 2px;   /* Spacing from the left */
        }
        .r34h-size-overlay {
            top: 2px;     /* Spacing from the top */
            right: 2px;   /* Spacing from the right */
        }
    `);

    // --- HTML FOR THE CONTROL PANEL ---
    const controlsHTML = `
        <div class="r34h-collection-controls">
            <div class="r34h-controls-grid">
                <div class="r34h-control-row">
                    <label for="r34h_startPage">From:</label>
                    <input type="number" id="r34h_startPage" placeholder="Start" min="1">
                </div>
                <div class="r34h-control-row">
                    <label for="r34h_endPage">To:</label>
                    <input type="number" id="r34h_endPage" placeholder="End" min="1">
                </div>
                <div>
                    <button id="r34h_collectButton">Collect Posts</button>
                </div>
                <div>
                    <button id="r34h_showCollected">Show Collected</button>
                </div>
                <div>
                    <button id="r34h_clearStorage">Clear Storage</button>
                </div>
                <div id="r34h_collectionStatus" class="r34h-collection-status" style="grid-column: 1 / -1;"></div>
            </div>
        </div>
    `;

    // --- INSERTING THE CONTROL PANEL ---
    let inserted = false;
    const loggedInSection = document.querySelector(LOGGED_IN_SECTION_SELECTOR);

    if (loggedInSection) {
        loggedInSection.insertAdjacentHTML('afterend', controlsHTML);
        inserted = true;
    } else {
        const loginHeadElement = document.querySelector(LOGIN_HEAD_SELECTOR);
        if (loginHeadElement) {
            loginHeadElement.insertAdjacentHTML('afterend', controlsHTML);
            inserted = true;
        }
    }

    if (!inserted) {
        console.warn('Target element for control panel not found. Appending to body.');
        document.body.insertAdjacentHTML('afterbegin', controlsHTML);
    }

    // --- NEW FORMATTING FUNCTIONS ---
    /**
     * Formats duration from seconds into hh:mm:ss or mm:ss string.
     * @param {number|null} totalSeconds - Total number of seconds.
     * @returns {string|null} Formatted string or null.
     */
    function formatDuration(totalSeconds) {
        if (totalSeconds === null || isNaN(totalSeconds) || totalSeconds <= 0) {
            return null;
        }
        totalSeconds = Math.round(totalSeconds); // Round to whole seconds

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const paddedSeconds = seconds.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');

        if (hours > 0) {
            const paddedHours = hours.toString().padStart(2, '0');
            return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        } else {
            return `${paddedMinutes}:${paddedSeconds}`;
        }
    }

    /**
     * Formats file size from bytes into a readable string (KB, MB, GB).
     * @param {number|null} bytes - Size in bytes.
     * @param {number} decimals - Number of decimal places (default 1).
     * @returns {string|null} Formatted string or null.
     */
    function formatBytes(bytes, decimals = 1) {
        if (bytes === null || isNaN(bytes) || bytes === 0) return null;

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        // Do not show decimals for bytes
        const formattedValue = (i === 0)
            ? bytes
            : parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedValue} ${sizes[i]}`;
    }


    // --- PARSING AND LOADING FUNCTIONS ---
    const statusDiv = document.getElementById('r34h_collectionStatus');
    function updateStatus(message) { if (statusDiv) { statusDiv.textContent = message; } }

    function parseFileSizeToBytes(sizeStr) {
        if (!sizeStr) return null;
        const match = sizeStr.match(/(\d+(\.\d+)?)\s*(KB|MB|GB)/i);
        if (!match) return null;
        const value = parseFloat(match[1]);
        const unit = match[3].toUpperCase();
        switch (unit) {
            case 'KB': return Math.round(value * 1024);
            case 'MB': return Math.round(value * 1024 * 1024);
            case 'GB': return Math.round(value * 1024 * 1024 * 1024);
            default: return null;
        }
    }

    function parseMetadata(titleText) {
        let duration = null;
        let size = null;
        if (titleText) {
            const durationMatch = titleText.match(/,\s*(\d+(\.\d+)?)\s*s\s*\/\//i);
            if (durationMatch) { duration = parseFloat(durationMatch[1]); }

            // Search for file size in the title to get the string (e.g., "1.3MB")
            const sizeMatchStr = titleText.match(/(\d+(\.\d+)?\s*(KB|MB|GB))/i);
            if (sizeMatchStr) {
                size = parseFileSizeToBytes(sizeMatchStr[0]); // Get bytes for sorting
                // We will use the string representation from the title for display
            }
        }
        // Return bytes for sorting
        return { duration, size };
    }

    async function fetchPage(page) {
        const currentUrl = new URL(window.location.href);
        const pathParts = currentUrl.pathname.split('/').filter(part => part !== '');
        const lastPartIndex = pathParts.length - 1;
        if (!isNaN(parseInt(pathParts[lastPartIndex]))) { pathParts[lastPartIndex] = page.toString(); }
        else { pathParts.push(page.toString()); }
        currentUrl.pathname = '/' + pathParts.join('/');
        currentUrl.search = '';
        updateStatus(`Loading page ${page}...`);
        try {
            const response = await fetch(currentUrl.href);
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const postElements = doc.querySelectorAll('a.thumb.shm-thumb.shm-thumb-link');
            return Array.from(postElements).map(post => {
                const img = post.querySelector('img');
                const title = img ? img.getAttribute('title') : '';
                const metadata = parseMetadata(title); // Get {duration, size}
                const href = post.getAttribute('href');
                const idMatch = href ? href.match(/\/post\/view\/(\d+)/) : null;
                const id = idMatch ? idMatch[1] : null;
                const postHtml = post.outerHTML;
                // Add title to the object to access the original size string
                return { html: postHtml, metadata: metadata, id: id, title: title };
            }).filter(p => p.id !== null);
        } catch (error) {
            updateStatus(`Error loading page ${page}: ${error.message}`);
            console.error('Error fetching page:', page, error);
            return [];
        }
    }

    async function collectPages(startPage, endPage) {
        let collected = GM_getValue(STORAGE_KEY, []);
        const existingIds = new Set(collected.map(p => p.id));
        let collectedCountOnRun = 0;
        let newPostsCount = 0;
        updateStatus(`Starting collection from page ${startPage} to ${endPage}...`);
        for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
            const postsOnPage = await fetchPage(currentPage);
            const newPosts = postsOnPage.filter(p => !existingIds.has(p.id));
            if (newPosts.length > 0) {
                collected.push(...newPosts);
                newPosts.forEach(p => existingIds.add(p.id));
                newPostsCount += newPosts.length;
            }
            collectedCountOnRun += postsOnPage.length;
            updateStatus(`Page ${currentPage} of ${endPage} processed. New: ${newPosts.length}. Total in storage: ${collected.length}.`);
            GM_setValue(STORAGE_KEY, collected);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        updateStatus(`Collection finished. Posts processed this session: ${collectedCountOnRun}. New posts added: ${newPostsCount}. Total in storage: ${collected.length}.`);
        alert(`Collection finished! Total ${collected.length} posts in storage.`);
    }

    /**
     * Displays collected posts and adds overlays.
     */
    function displayCollected() {
        const collected = GM_getValue(STORAGE_KEY, []);
        updateStatus(`Preparing to display ${collected.length} posts...`);

        if (collected.length === 0) {
            updateStatus('No collected posts to display.');
            alert('No collected posts!');
            return;
        }

        const withDuration = [];
        const withSizeOnly = [];
        const withNeither = [];

        collected.forEach(p => {
            const hasDuration = p.metadata?.duration > 0;
            const hasSize = p.metadata?.size > 0;
            if (hasDuration) withDuration.push(p);
            else if (hasSize) withSizeOnly.push(p);
            else withNeither.push(p);
        });

        withDuration.sort((a, b) => (b.metadata?.duration || 0) - (a.metadata?.duration || 0));
        withSizeOnly.sort((a, b) => (b.metadata?.size || 0) - (a.metadata?.size || 0));
        withNeither.sort((a, b) => parseInt(b.id || '0') - parseInt(a.id || '0'));

        const container = document.querySelector(CONTAINER_SELECTOR);
        if (!container) {
            console.error('Container element not found:', CONTAINER_SELECTOR);
            alert('Error: container for displaying posts not found.');
            return;
        }

        container.innerHTML = ''; // Clear

        // Create a Map for quick access to post data by ID
        const postDataMap = new Map(collected.map(p => [p.id, p]));

        // Function to create and add a section
        const addSection = (title, postsArray) => {
            if (postsArray.length > 0) {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'r34h-collected-section';
                sectionDiv.innerHTML = `<h2>${title} (${postsArray.length} items)</h2>`;
                // Just add HTML, overlays will be added later
                sectionDiv.innerHTML += postsArray.map(p => p.html).join('');
                container.appendChild(sectionDiv);
            }
        };

        // Add sections
        addSection('Sorted by Duration', withDuration);
        addSection('Sorted by Size (no duration data)', withSizeOnly);
        addSection('No Duration or Size Data', withNeither);

        // --- ADDING OVERLAYS AFTER RENDERING ---
        const renderedThumbs = container.querySelectorAll('a.thumb.shm-thumb.shm-thumb-link');
        renderedThumbs.forEach(thumbEl => {
            const postId = thumbEl.dataset.postId;
            if (!postId) return; // Skip if no ID

            const postData = postDataMap.get(postId);
            if (!postData || !postData.metadata) return; // Skip if no data for this ID

            // Add duration overlay
            const formattedDuration = formatDuration(postData.metadata.duration);
            if (formattedDuration) {
                const durationOverlay = document.createElement('div');
                durationOverlay.className = 'r34h-overlay r34h-duration-overlay';
                durationOverlay.textContent = formattedDuration;
                thumbEl.appendChild(durationOverlay);
            }

            // Add size overlay
            // Use the original title to get the size string if bytes are available
            if (postData.metadata.size > 0 && postData.title) {
                const sizeMatchStr = postData.title.match(/(\d+(\.\d+)?\s*(KB|MB|GB))/i);
                if (sizeMatchStr) {
                    const formattedSize = sizeMatchStr[0]; // Take the string as is from the title
                    const sizeOverlay = document.createElement('div');
                    sizeOverlay.className = 'r34h-overlay r34h-size-overlay';
                    sizeOverlay.textContent = formattedSize;
                    thumbEl.appendChild(sizeOverlay);
                }
            }
        });

        const paginator = document.querySelector('#paginator');
        if (paginator) { paginator.style.display = 'none'; }

        updateStatus(`Displayed ${collected.length} posts (${withDuration.length} by duration, ${withSizeOnly.length} by size, ${withNeither.length} without data). Overlays added.`);
    }

    // --- ASSIGNING EVENT LISTENERS ---
    document.getElementById('r34h_collectButton').addEventListener('click', () => {
        const startPageInput = document.getElementById('r34h_startPage');
        const endPageInput = document.getElementById('r34h_endPage');
        const startPage = parseInt(startPageInput.value) || 1;
        const endPage = parseInt(endPageInput.value) || startPage;
        if (startPage < 1 || endPage < 1) { alert('Page number cannot be less than 1!'); return; }
        if (startPage > endPage) { alert('Start page cannot be greater than end page!'); return; }
        collectPages(startPage, endPage);
    });

    document.getElementById('r34h_showCollected').addEventListener('click', displayCollected);

    document.getElementById('r34h_clearStorage').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all collected posts?')) {
            GM_setValue(STORAGE_KEY, []);
            updateStatus('Storage cleared.');
            alert('Storage cleared!');
            const container = document.querySelector(CONTAINER_SELECTOR);
            if (container) container.innerHTML = '<p>Storage cleared. Refresh the page or collect new posts.</p>';
            const paginator = document.querySelector('#paginator');
            if (paginator) { paginator.style.display = ''; }
        }
    });

    // --- INITIALIZING STATUS ---
    const initialCollected = GM_getValue(STORAGE_KEY, []);
    updateStatus(`In storage: ${initialCollected.length} posts.`);

})();