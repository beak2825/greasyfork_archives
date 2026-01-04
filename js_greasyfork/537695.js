// ==UserScript==
// @name         Tampermonkey Video Filter v4 (video duration)
// @namespace    http://tampermonkey.net/
// @version      1.4.4
// @description  Filters and sorts posts by video duration, supports popular pages, and includes SPA navigation handling. Skips duration check if field is empty or timeout is reached.
// @author       harryangstrom, xdegeneratex, remuru, AI Assistant
// @match        https://*.coomer.party/*
// @match        https://*.coomer.su/*
// @match        https://*.coomer.st/*
// @match        https://*.kemono.su/*
// @match        https://*.kemono.party/*
// @match        https://*.kemono.cr/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537695/Tampermonkey%20Video%20Filter%20v4%20%28video%20duration%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537695/Tampermonkey%20Video%20Filter%20v4%20%28video%20duration%29.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // --- SCRIPT CONFIGURATION AND CONSTANTS ---
    const CUSTOM_STYLES = ` select option { color: var(--colour0-primary) !important; } `;
    GM_addStyle(CUSTOM_STYLES);

    const VIDEO_EXTENSIONS = ['mp4', 'm4v', 'mov', 'webm'];
    const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
    const POSTS_PER_PAGE = 50;
    const API_DELAY = 1000; // Delay between API page requests
    const SUBSTRING_TITLE_LENGTH = 100;
    const LS_COLLAPSE_KEY = 'videoFilterPanelCollapsed_v2';
    const LS_PAGES_KEY = 'videoFilterPageRange_v2';
    const LS_DURATION_KEY = 'videoFilterDurationRange_v2';
    const LS_SORT_KEY = 'videoFilterSortBy_v2';
    const VIDEO_DURATION_CHECK_TIMEOUT = 50000;
    const MAX_CONCURRENT_METADATA_REQUESTS = 25;

    // --- GLOBAL STATE VARIABLES ---
    let currentDomain = window.location.hostname;
    let allFoundVideoUrls = [];
    let videoIntersectionObserver = null;
    let isPanelCollapsed = false;

    // --- UI ELEMENT CREATION AND STYLING ---
    const uiContainer = document.createElement('div');
    uiContainer.id = 'video-filter-ui';
    uiContainer.style.cssText = 'position:fixed; bottom:10px; right:10px; background-color:#2c2c2e; color:#e0e0e0; border:1px solid #444; padding:12px; z-index:9999; font-family:Arial,sans-serif; font-size:14px; box-shadow:0 2px 8px rgba(0,0,0,0.5); border-radius:4px; transition:all 0.2s ease-in-out;';
    const initialUiContainerPadding = '12px';
    const collapseButton = document.createElement('button');
    collapseButton.id = 'video-filter-collapse-button';
    collapseButton.innerHTML = '»';
    collapseButton.title = 'Collapse/Expand Panel';
    collapseButton.style.cssText = 'position:absolute; bottom:8px; left:8px; width:25px; height:60px; display:flex; align-items:center; justify-content:center; padding:0; font-size:16px; background-color:#4a4a4c; color:#f0f0f0; border:1px solid #555; border-radius:3px; cursor:pointer; z-index:1;';
    const panelMainContent = document.createElement('div');
    panelMainContent.id = 'video-filter-main-content';
    panelMainContent.style.marginLeft = '30px';
    const pageRangeInput = document.createElement('input');
    pageRangeInput.type = 'text';
    pageRangeInput.id = 'video-filter-page-range';
    pageRangeInput.value = '1';
    pageRangeInput.placeholder = 'e.g., 1, 2-5, 7';
    pageRangeInput.style.cssText = 'width:100px; margin-right:8px; padding:6px 8px; background-color:#1e1e1e; color:#e0e0e0; border:1px solid #555; border-radius:3px;';
    const durationLabel = document.createElement('label');
    durationLabel.htmlFor = 'video-filter-duration-range';
    durationLabel.textContent = 'Duration (s): ';
    durationLabel.style.marginLeft = '10px';
    const durationRangeInput = document.createElement('input');
    durationRangeInput.type = 'text';
    durationRangeInput.id = 'video-filter-duration-range';
    durationRangeInput.placeholder = 'e.g., 10-30, 60-, -120';
    durationRangeInput.title = 'Filter by video duration in seconds. Examples:\n"10-30": 10 to 30 seconds\n"60-": 60 seconds or more\n"-120": up to 120 seconds\nLeave empty for no duration filter.';
    durationRangeInput.style.cssText = 'width:100px; margin-right:8px; padding:6px 8px; background-color:#1e1e1e; color:#e0e0e0; border:1px solid #555; border-radius:3px;';
    const sortLabel = document.createElement('label');
    sortLabel.htmlFor = 'video-filter-sort-by';
    sortLabel.textContent = 'Sort by: ';
    sortLabel.style.marginLeft = '10px';
    const sortBySelect = document.createElement('select');
    sortBySelect.id = 'video-filter-sort-by';
    sortBySelect.style.cssText = 'padding:6px 8px; background-color:#1e1e1e; color:var(--colour0-primary, #e0e0e0); border:1px solid #555; border-radius:3px;';
    sortBySelect.innerHTML = `<option value="date_desc">Date (Newest First)</option><option value="date_asc">Date (Oldest First)</option><option value="duration_desc">Duration (Longest First)</option><option value="duration_asc">Duration (Shortest First)</option>`;
    const filterButton = document.createElement('button');
    filterButton.id = 'video-filter-button';
    filterButton.textContent = 'Filter Videos';
    const copyUrlsButton = document.createElement('button');
    copyUrlsButton.id = 'video-copy-urls-button';
    copyUrlsButton.textContent = 'Copy Video URLs';
    copyUrlsButton.disabled = true;
    const baseButtonBg = '#3a3a3c',
        hoverButtonBg = '#4a4a4c',
        disabledButtonBg = '#303030',
        disabledButtonColor = '#777777';

    function styleButton(button, disabled = false) {
        if (disabled) {
            button.style.backgroundColor = disabledButtonBg;
            button.style.color = disabledButtonColor;
            button.style.cursor = 'default';
        } else {
            button.style.backgroundColor = baseButtonBg;
            button.style.color = '#f0f0f0';
            button.style.cursor = 'pointer';
        }
        button.style.marginRight = '8px';
        button.style.padding = '6px 12px';
        button.style.border = '1px solid #555555';
        button.style.borderRadius = '3px';
    }
    [filterButton, copyUrlsButton].forEach(btn => {
        styleButton(btn, btn.disabled);
        btn.onmouseenter = () => {
            if (!btn.disabled) btn.style.backgroundColor = hoverButtonBg;
        };
        btn.onmouseleave = () => {
            if (!btn.disabled) btn.style.backgroundColor = baseButtonBg;
        };
    });
    collapseButton.onmouseenter = () => {
        if (collapseButton.style.backgroundColor !== disabledButtonBg) collapseButton.style.backgroundColor = hoverButtonBg;
    };
    collapseButton.onmouseleave = () => {
        if (collapseButton.style.backgroundColor !== disabledButtonBg) collapseButton.style.backgroundColor = '#4a4a4c';
    };
    const statusMessage = document.createElement('div');
    statusMessage.id = 'video-filter-status';
    statusMessage.style.cssText = 'margin-top:8px; font-size:12px; min-height:15px; color:#cccccc;';
    const topControlsContainer = document.createElement('div');
    topControlsContainer.style.marginBottom = '8px';
    topControlsContainer.appendChild(document.createTextNode('Pages: '));
    topControlsContainer.appendChild(pageRangeInput);
    topControlsContainer.appendChild(durationLabel);
    topControlsContainer.appendChild(durationRangeInput);
    const bottomControlsContainer = document.createElement('div');
    bottomControlsContainer.appendChild(filterButton);
    bottomControlsContainer.appendChild(copyUrlsButton);
    bottomControlsContainer.appendChild(sortLabel);
    bottomControlsContainer.appendChild(sortBySelect);
    panelMainContent.appendChild(topControlsContainer);
    panelMainContent.appendChild(bottomControlsContainer);
    panelMainContent.appendChild(statusMessage);
    uiContainer.appendChild(collapseButton);
    uiContainer.appendChild(panelMainContent);
    document.body.appendChild(uiContainer);

    // --- UI HELPER FUNCTIONS ---

    /**
     * Toggles the visibility of the filter panel and saves its state to localStorage.
     */
    function togglePanelCollapse() {
        isPanelCollapsed = !isPanelCollapsed;
        if (isPanelCollapsed) {
            panelMainContent.style.display = 'none';
            collapseButton.innerHTML = '«';
            uiContainer.style.width = '41px';
            uiContainer.style.height = '80px';
            uiContainer.style.padding = '0';
        } else {
            panelMainContent.style.display = 'block';
            collapseButton.innerHTML = '»';
            uiContainer.style.width = '';
            uiContainer.style.height = '';
            uiContainer.style.padding = initialUiContainerPadding;
        }
        localStorage.setItem(LS_COLLAPSE_KEY, isPanelCollapsed.toString());
    }

    /**
     * Initializes or resets the IntersectionObserver for lazy-loading videos.
     */
    function setupVideoIntersectionObserver() {
        if (videoIntersectionObserver) {
            videoIntersectionObserver.disconnect();
        }
        const options = {
            root: null,
            rootMargin: '200px 0px',
            threshold: 0.01
        };
        videoIntersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const videoElement = entry.target;
                    const sourceElement = videoElement.querySelector('source[data-src]');
                    if (sourceElement) {
                        const videoUrl = sourceElement.getAttribute('data-src');
                        sourceElement.setAttribute('src', videoUrl);
                        videoElement.load();
                        sourceElement.removeAttribute('data-src');
                        observer.unobserve(videoElement);
                    }
                }
            });
        }, options);
    }

    /**
     * Displays a message in the status area of the UI panel.
     * @param {string} message - The message to display.
     * @param {string} type - The type of message ('info', 'success', 'error').
     */
    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        switch (type) {
            case 'error':
                statusMessage.style.color = '#ff6b6b';
                break;
            case 'success':
                statusMessage.style.color = '#76c7c0';
                break;
            case 'info':
            default:
                statusMessage.style.color = '#cccccc';
                break;
        }
        if (type === 'success' && message.includes("Copied")) {
            setTimeout(() => {
                if (statusMessage.textContent === message) {
                    statusMessage.textContent = '';
                    statusMessage.style.color = '#cccccc';
                }
            }, 3000);
        }
    }

    /**
     * Parses the user-provided page range string (e.g., "1, 3-5") into an array of page numbers.
     * @param {string} inputStr - The input string from the page range text field.
     * @returns {number[]|null} An array of page numbers or null if parsing fails.
     */
    function parsePageRange(inputStr) {
        const pages = new Set();
        if (!inputStr || inputStr.trim() === '') {
            showStatus('Error: Page range cannot be empty.', 'error');
            return null;
        }
        const parts = inputStr.split(',');
        for (const part of parts) {
            if (part.includes('-')) {
                const [startStr, endStr] = part.split('-');
                const start = parseInt(startStr, 10);
                const end = parseInt(endStr, 10);
                if (isNaN(start) || isNaN(end) || start <= 0 || end < start) {
                    showStatus(`Error: Invalid range "${part}". Start must be > 0 and end >= start.`, 'error');
                    return null;
                }
                for (let i = start; i <= end; i++) pages.add(i);
            } else {
                const page = parseInt(part, 10);
                if (isNaN(page) || page <= 0) {
                    showStatus(`Error: Invalid page number "${part}". Must be > 0.`, 'error');
                    return null;
                }
                pages.add(page);
            }
        }
        if (pages.size === 0) {
            showStatus('Error: No valid pages specified.', 'error');
            return null;
        }
        return Array.from(pages).sort((a, b) => a - b);
    }

    /**
     * Parses the user-provided duration range string (e.g., "10-30", "60-") into a min/max object.
     * @param {string} inputStr - The input string from the duration range text field.
     * @returns {object|null} An object with min/max properties or an error object.
     */
    function parseDurationRange(inputStr) {
        if (!inputStr || inputStr.trim() === '') return null;
        const trimmedInput = inputStr.trim();
        let match;
        match = trimmedInput.match(/^(\d+)-(\d+)$/);
        if (match) return {
            min: parseInt(match[1], 10),
            max: parseInt(match[2], 10)
        };
        match = trimmedInput.match(/^(\d+)-$/);
        if (match) return {
            min: parseInt(match[1], 10),
            max: Infinity
        };
        match = trimmedInput.match(/^-(\d+)$/);
        if (match) return {
            min: 0,
            max: parseInt(match[1], 10)
        };
        showStatus(`Error: Invalid duration format "${trimmedInput}". Use e.g. "10-30", "60-", or "-120".`, 'error');
        return {
            error: true
        };
    }

    // --- VIDEO DURATION FETCHING LOGIC ---

    /**
     * Fetches the duration of a single video by loading its metadata. Includes a timeout mechanism.
     * @param {string} videoUrl - The URL of the video to check.
     * @returns {Promise<number>} A promise that resolves with the video duration in seconds.
     */
    function _getVideoDurationInternal(videoUrl) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.style.display = 'none';
            document.body.appendChild(video);
            let resolved = false;
            let timeoutId = null;
            const cleanup = () => {
                if (timeoutId) clearTimeout(timeoutId);
                video.onloadedmetadata = video.onerror = video.onabort = null;
                try {
                    video.src = '';
                    video.removeAttribute('src');
                    while (video.firstChild) {
                        video.removeChild(video.firstChild);
                    }
                } catch (e) {
                    /* ignore */ }
                if (video.parentNode) video.parentNode.removeChild(video);
            };
            timeoutId = setTimeout(() => {
                if (resolved) return;
                resolved = true;
                const errorMsg = `Timeout loading metadata for ${videoUrl.split('/').pop()} after ${VIDEO_DURATION_CHECK_TIMEOUT / 1000}s.`;
                console.warn(errorMsg);
                reject(new Error(errorMsg));
                cleanup();
            }, VIDEO_DURATION_CHECK_TIMEOUT);
            video.onloadedmetadata = () => {
                if (resolved) return;
                resolved = true;
                const duration = video.duration;
                if (typeof duration === 'number' && !isNaN(duration) && isFinite(duration)) {
                    resolve(duration);
                } else {
                    reject(new Error(`Invalid or infinite duration for ${videoUrl.split('/').pop()}: ${duration}`));
                }
                cleanup();
            };
            video.onerror = () => {
                if (resolved) return;
                resolved = true;
                reject(new Error(`Error loading metadata for ${videoUrl.split('/').pop()}`));
                cleanup();
            };
            video.onabort = () => {
                if (resolved) return;
                resolved = true;
                reject(new Error(`Metadata loading aborted for ${videoUrl.split('/').pop()}.`));
                cleanup();
            };
            const sourceElement = document.createElement('source');
            sourceElement.src = videoUrl;
            video.appendChild(sourceElement);
            video.load();
        });
    }

    /**
     * Manages a pool of concurrent requests to get video durations,
     * preventing too many simultaneous requests.
     */
    class DurationCheckerPool {
        constructor(maxConcurrent) {
            this.maxConcurrent = maxConcurrent;
            this.queue = [];
            this.activeCount = 0;
        }

        /**
         * Adds a video URL to the processing queue and returns a promise that resolves with the duration.
         * @param {string} videoUrl - The video URL to process.
         * @returns {Promise<number>} A promise for the video's duration.
         */
        add(videoUrl) {
            return new Promise((resolve, reject) => {
                this.queue.push({
                    videoUrl,
                    resolve,
                    reject
                });
                this._processQueue();
            });
        }

        /**
         * Internal method to process the next item in the queue if the concurrent limit is not reached.
         */
        _processQueue() {
            if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) return;
            this.activeCount++;
            const {
                videoUrl,
                resolve,
                reject
            } = this.queue.shift();
            const videoFileNameForStatus = videoUrl.split('/').pop();
            showStatus(`Dur. check (${this.activeCount}/${this.maxConcurrent}, Q:${this.queue.length}): ${videoFileNameForStatus.substring(0, 15)}...`, 'info');
            _getVideoDurationInternal(videoUrl)
                .then(duration => resolve(duration))
                .catch(error => reject(error))
                .finally(() => {
                    this.activeCount--;
                    this._processQueue();
                });
        }
    }

    // --- PAGE CONTEXT AND API HANDLING ---

    /**
     * Analyzes the current URL to determine the page context (e.g., user profile, search results, popular posts).
     * @returns {object|null} A context object or null if the context is not recognized.
     */
    function determinePageContext() {
        const pathname = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('q');
        const userProfileMatch = pathname.match(/^\/([^/]+)\/user\/([^/]+)$/);
        if (userProfileMatch && !query) return {
            type: 'profile',
            service: userProfileMatch[1],
            userId: userProfileMatch[2]
        };
        if (userProfileMatch && query) return {
            type: 'user_search',
            service: userProfileMatch[1],
            userId: userProfileMatch[2],
            query
        };
        if (pathname === '/posts/popular') {
            return {
                type: 'popular_posts',
                date: searchParams.get('date') || 'none',
                period: searchParams.get('period') || 'recent'
            };
        };
        if (pathname === '/posts') return {
            type: 'global_search',
            query: query || null
        };
        console.error('Video Filter: Unknown page structure for context.', pathname, window.location.search);
        return null;
    }

    /**
     * Constructs the appropriate API URL based on the determined page context and offset.
     * @param {object} context - The context object from determinePageContext.
     * @param {number} offset - The post offset for pagination.
     * @returns {string|null} The constructed API URL or null.
     */
    function buildApiUrl(context, offset) {
        let baseApiUrl = `https://${currentDomain}/api/v1`;
        let queryParams = [`o=${offset}`];
        switch (context.type) {
            case 'profile':
                return `${baseApiUrl}/${context.service}/user/${context.userId}/posts?${queryParams.join('&')}`;
            case 'user_search':
                queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseApiUrl}/${context.service}/user/${context.userId}/posts?${queryParams.join('&')}`;
            case 'global_search':
                if (context.query) queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseApiUrl}/posts?${queryParams.join('&')}`;
            case 'popular_posts':
                if(context.date !='none' && context.period!="recent") queryParams.push(`date=${encodeURIComponent(context.date)}`);
                if(offset>0) queryParams.push(`o=${offset}`);
                queryParams.push(`period=${encodeURIComponent(context.period)}`);
                return `${baseApiUrl}/posts/popular?${queryParams.join('&')}`;
            default:
                return null;
        }
    }

    /**
     * Fetches data from a given API URL using GM_xmlhttpRequest and returns a promise with the parsed JSON.
     * @param {string} apiUrl - The URL to fetch data from.
     * @returns {Promise<object>} A promise that resolves with the parsed JSON response.
     */
    function fetchData(apiUrl) {
        console.log('apiUrl - ',apiUrl);
        const headers = {
            "Accept": "text/css",
            "Referer": window.location.href,
            "User-Agent": navigator.userAgent,
            "X-Requested-With": "XMLHttpRequest"
        };
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: headers,
                onload: resp => {
                    if (resp.status >= 200 && resp.status < 300) {
                        try {
                            resolve(JSON.parse(resp.responseText));
                        } catch (e) {
                            reject(`Error parsing JSON: ${e.message}`);
                        }
                    } else {
                        reject(`API request failed: ${resp.status} ${resp.statusText}`);
                    }
                },
                onerror: resp => reject(`Network error: ${resp.statusText || 'Unknown'}`)
            });
        });
    }

    // --- GENERAL HELPER FUNCTIONS ---
    function isVideoFile(p) {
        return p ? VIDEO_EXTENSIONS.some(e => p.toLowerCase().endsWith('.' + e)) : false;
    }

    function isImageFile(p) {
        return p ? IMAGE_EXTENSIONS.some(e => p.toLowerCase().endsWith('.' + e)) : false;
    }

    function getPostPreviewUrl(post, apiPreviewsEntry) {
        if (apiPreviewsEntry && apiPreviewsEntry.length > 0 && apiPreviewsEntry[0]?.server && apiPreviewsEntry[0]?.path) {
            return `${apiPreviewsEntry[0].server}${apiPreviewsEntry[0].path}`;
        }
        if (post.file?.path && isImageFile(post.file.path)) return `https://${currentDomain}/data${post.file.path}`;
        if (post.attachments) {
            for (const a of post.attachments) {
                if (a.path && isImageFile(a.path)) return `https://${currentDomain}/data${a.path}`;
            }
        }
        return null;
    }

    function getAllVideoUrlsFromPost(post) {
        const d = `https://${currentDomain}/data`,
            u = [];
        if (post.file?.path && isVideoFile(post.file.path)) u.push(d + post.file.path);
        if (post.attachments) {
            for (const a of post.attachments) {
                if (a.path && isVideoFile(a.path)) u.push(d + a.path);
            }
        }
        return [...new Set(u)];
    }

    function getFirstVideoUrlForDisplay(post) {
        const v = getAllVideoUrlsFromPost(post);
        return v.length > 0 ? v[0] : null;
    }

    /**
     * Generates the HTML string for a single post card, including data-attributes for sorting.
     * @param {object} postData - The post object and its metadata.
     * @param {string} previewUrl - The URL for the post's preview image.
     * @param {number|null} videoDurationToDisplay - The duration of the video to display on the card.
     * @returns {string} The HTML string for the post card.
     */
    function createPostCardHtml(postData, previewUrl, videoDurationToDisplay = null) {
        const {
            post,
            postDate
        } = postData;
        const formattedDate = postDate.toLocaleString();
        const attachmentCount = post.attachments?.length || 0;
        const attachmentText = attachmentCount === 1 ? "1 Attachment" : `${attachmentCount} Attachments`;
        let displayTitle = (post.title || '').trim();
        if (!displayTitle) {
            const div = document.createElement('div');
            div.innerHTML = post.content || '';
            displayTitle = (div.textContent || "").trim().substring(0, SUBSTRING_TITLE_LENGTH);
        }
        displayTitle = displayTitle || 'No Title';
        const firstVideoUrlForCard = getFirstVideoUrlForDisplay(post);
        const durationDisplay = videoDurationToDisplay !== null ? `<div style="position:absolute;bottom:5px;right:5px;background:rgba(0,0,0,0.7);color:white;padding:2px 5px;font-size:0.8em;border-radius:3px;">${Math.round(videoDurationToDisplay)}s</div>` : '';
        let mediaHtml = '';
        if (firstVideoUrlForCard) {
            const poster = previewUrl ? `poster="${previewUrl}"` : '';
            mediaHtml = `<div style="position:relative;background:#000;"><video class="lazy-load-video" controls preload="none" width="100%" style="max-height:265px;display:block;" ${poster}><source data-src="${firstVideoUrlForCard}" type="video/mp4"></video>${durationDisplay}</div>`;
        } else if (previewUrl) {
            mediaHtml = `<div><img src="${previewUrl}" style="max-width:100%;max-height:200px;object-fit:contain;"></div>`;
        } else {
            mediaHtml = `<div style="height:100px;display:flex;align-items:center;justify-content:center;background:#333;color:#aaa;">No Preview</div>`;
        }
        const postLink = `/${post.service}/user/${post.user}/post/${post.id}`;
        const sortDate = postDate.getTime();
        const sortDuration = videoDurationToDisplay !== null ? Math.round(videoDurationToDisplay) : -1;
        return `<article class="post-card post-card--preview" data-sort-date="${sortDate}" data-sort-duration="${sortDuration}"><a class="fancy-link" href="${postLink}" target="_blank" rel="noopener noreferrer"><header class="post-card__header" title="${displayTitle.replace(/"/g, '"')}">${displayTitle}</header>${mediaHtml}<footer class="post-card__footer"><div><div><time datetime="${postDate.toISOString()}">${formattedDate}</time><div>${attachmentCount > 0 ? attachmentText : 'No Attachments'}</div></div></div></footer></a></article>`;
    }


    // --- CORE LOGIC: MAIN FILTERING AND DISPLAY FUNCTION ---

    /**
     * The main function that orchestrates the entire filtering process.
     * It fetches data from multiple pages, processes each post asynchronously to find videos
     * and their durations, renders the results as they become available, and then sorts the
     * final DOM elements.
     */
    async function handleFilter() {
        showStatus('');
        filterButton.textContent = 'Filtering...';
        styleButton(filterButton, true);
        filterButton.disabled = true;
        styleButton(copyUrlsButton, true);
        copyUrlsButton.disabled = true;
        allFoundVideoUrls = [];
        setupVideoIntersectionObserver();

        const pagesToFetch = parsePageRange(pageRangeInput.value);
        if (!pagesToFetch) {
            styleButton(filterButton, false);
            filterButton.disabled = false;
            return;
        }

        const parsedDurationFilter = parseDurationRange(durationRangeInput.value);
        if (parsedDurationFilter?.error) {
            styleButton(filterButton, false);
            filterButton.disabled = false;
            return;
        }

        localStorage.setItem(LS_PAGES_KEY, pageRangeInput.value);
        localStorage.setItem(LS_DURATION_KEY, durationRangeInput.value);
        localStorage.setItem(LS_SORT_KEY, sortBySelect.value);

        const context = determinePageContext();
        if (!context) {
            showStatus('Filter disabled, context not recognized.', 'error');
            styleButton(filterButton, false);
            filterButton.disabled = false;
            return;
        }

        const postListContainer = document.querySelector('.card-list__items');
        if (!postListContainer) {
            showStatus('Error: Post container not found.', 'error');
            styleButton(filterButton, false);
            filterButton.disabled = false;
            return;
        }

        postListContainer.style.setProperty('--card-size', '350px');
        postListContainer.innerHTML = '';
        document.querySelectorAll('.paginator menu, .content > menu.Paginator').forEach(m => m.style.display = 'none');
        const paginatorInfo = document.querySelector('.paginator > small, .content > div > small.subtle-text');
        if (paginatorInfo) paginatorInfo.textContent = `Filtering posts...`;

        const sortOption = sortBySelect.value;
        const needsDurationCheck = !!parsedDurationFilter || sortOption.startsWith('duration_');
        const durationCheckerPool = new DurationCheckerPool(MAX_CONCURRENT_METADATA_REQUESTS);

        let postsProcessedCounter = 0;
        const allProcessingPromises = [];

        for (let i = 0; i < pagesToFetch.length; i++) {
            const pageNum = pagesToFetch[i];
            const offset = (pageNum - 1) * POSTS_PER_PAGE;
            const apiUrl = buildApiUrl(context, offset);
            if (!apiUrl) {
                showStatus('Error: Could not build API URL.', 'error');
                break;
            }

            filterButton.textContent = `Fetching Page ${i + 1}/${pagesToFetch.length}...`;
            try {
                const apiResponse = await fetchData(apiUrl);
                const posts = Array.isArray(apiResponse) ? apiResponse : (apiResponse.results || apiResponse.posts || []);
                const resultPreviews = apiResponse.result_previews;

                for (const post of posts) {
                    postsProcessedCounter++;
                    const postProcessingPromise = (async () => {
                        const postVideoUrls = getAllVideoUrlsFromPost(post);
                        if (postVideoUrls.length === 0) return false;

                        let postDuration = null;
                        let matchesDurationFilter = !parsedDurationFilter;

                        if (needsDurationCheck) {
                            const durationPromises = postVideoUrls.map(url => durationCheckerPool.add(url));
                            const results = await Promise.allSettled(durationPromises);

                            for (const result of results) {
                                if (result.status === 'fulfilled') {
                                    const duration = result.value;
                                    if (postDuration === null) postDuration = duration;

                                    if (parsedDurationFilter && duration >= parsedDurationFilter.min && duration <= parsedDurationFilter.max) {
                                        matchesDurationFilter = true;
                                        postDuration = duration;
                                        break;
                                    }
                                } else {
                                    console.warn(`Could not get duration for a video in post ${post.id}:`, result.reason.message);
                                }
                            }
                            if (!parsedDurationFilter && postDuration !== null) {
                                matchesDurationFilter = true;
                            }
                        }

                        if (matchesDurationFilter) {
                            allFoundVideoUrls.push(...postVideoUrls);
                            const apiPreviewEntry = resultPreviews ? (resultPreviews[post.id] || (Array.isArray(resultPreviews) ? resultPreviews.find(p => p.id === post.id) : null)) : null;
                            const postData = {
                                post,
                                postDate: new Date(post.published || post.added)
                            };

                            const cardHtml = createPostCardHtml(postData, getPostPreviewUrl(post, apiPreviewEntry), postDuration);
                            postListContainer.insertAdjacentHTML('beforeend', cardHtml);

                            const newCard = postListContainer.lastElementChild;
                            const newVideo = newCard.querySelector('video.lazy-load-video');
                            if (newVideo) videoIntersectionObserver.observe(newVideo);
                            return true;
                        }

                        return false;
                    })();

                    allProcessingPromises.push(postProcessingPromise);
                }
            } catch (error) {
                showStatus(`Error on page ${pageNum}: ${error}`, 'error');
                console.error("Filter error:", error);
            }
            if (i < pagesToFetch.length - 1) await new Promise(r => setTimeout(r, API_DELAY));
        }

        showStatus('Processing remaining videos...', 'info');

        const results = await Promise.all(allProcessingPromises);
        const matchedPostsCounter = results.filter(Boolean).length;

        showStatus('Sorting results...', 'info');

        const cards = Array.from(postListContainer.children);
        cards.sort((a, b) => {
            const aDate = Number(a.dataset.sortDate);
            const bDate = Number(b.dataset.sortDate);
            const aDuration = Number(a.dataset.sortDuration);
            const bDuration = Number(b.dataset.sortDuration);

            switch (sortOption) {
                case 'date_asc':
                    return aDate - bDate;
                case 'duration_desc':
                    return bDuration - aDuration;
                case 'duration_asc':
                    return aDuration - bDuration;
                case 'date_desc':
                default:
                    return bDate - aDate;
            }
        });

        cards.forEach(card => postListContainer.appendChild(card));

        if (paginatorInfo) paginatorInfo.textContent = `Showing ${matchedPostsCounter} video posts. Processed ${postsProcessedCounter} posts.`;
        filterButton.textContent = 'Filter Videos';
        styleButton(filterButton, false);
        filterButton.disabled = false;

        if (matchedPostsCounter > 0) {
            showStatus(`Filter complete. Found ${matchedPostsCounter} video posts.`, 'success');
            styleButton(copyUrlsButton, false);
            copyUrlsButton.disabled = false;
        } else {
            showStatus(`Filter complete. No matching video posts found.`, 'info');
        }
    }

    // --- EVENT HANDLERS AND SCRIPT INITIALIZATION ---

    /**
     * Handles the 'Copy Video URLs' button click event.
     */
    function handleCopyUrls() {
        if (allFoundVideoUrls.length === 0) {
            showStatus("No video URLs to copy.", 'error');
            return;
        }
        const uniqueUrls = [...new Set(allFoundVideoUrls)];
        GM_setClipboard(uniqueUrls.join('\n'));
        copyUrlsButton.textContent = `Copied ${uniqueUrls.length} URLs!`;
        showStatus(`Copied ${uniqueUrls.length} unique video URLs!`, 'success');
        setTimeout(() => {
            copyUrlsButton.textContent = 'Copy Video URLs';
        }, 3000);
    }

    /**
     * Resets the script's state when the URL changes (for Single Page Application support).
     */
    function handleUrlChangeAndSetStatus() {
        setTimeout(() => {
            const currentContext = determinePageContext();
            allFoundVideoUrls = [];
            styleButton(copyUrlsButton, true);
            copyUrlsButton.disabled = true;
            if (videoIntersectionObserver) videoIntersectionObserver.disconnect();
            if (currentContext) {
                showStatus("Video filter ready. Set filters and click 'Filter Videos'.", 'info');
                styleButton(filterButton, false);
                filterButton.disabled = false;
            } else {
                showStatus("Page context not recognized. Filter disabled on this page.", 'error');
                styleButton(filterButton, true);
                filterButton.disabled = true;
            }
        }, 100);
    }


    function loadFilterSettings() {
        const savedPages = localStorage.getItem(LS_PAGES_KEY);
        const savedDuration = localStorage.getItem(LS_DURATION_KEY);
        const savedSort = localStorage.getItem(LS_SORT_KEY);

        if (savedPages) {
            pageRangeInput.value = savedPages;
        }
        if (savedDuration) {
            durationRangeInput.value = savedDuration;
        }
        if (savedSort) {
            sortBySelect.value = savedSort;
        }
    }

    // Attaching event listeners to UI elements and browser navigation events.
    filterButton.addEventListener('click', handleFilter);
    copyUrlsButton.addEventListener('click', handleCopyUrls);
    collapseButton.addEventListener('click', togglePanelCollapse);
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event('custompushstate'));
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('customreplacestate'));
    };
    window.addEventListener('popstate', handleUrlChangeAndSetStatus);
    window.addEventListener('custompushstate', handleUrlChangeAndSetStatus);
    window.addEventListener('customreplacestate', handleUrlChangeAndSetStatus);

    // Initial setup on script load.
    const initiallyCollapsed = localStorage.getItem(LS_COLLAPSE_KEY) === 'true';
    if (initiallyCollapsed) togglePanelCollapse();
    loadFilterSettings();
    handleUrlChangeAndSetStatus();

})();