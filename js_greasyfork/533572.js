// ==UserScript==
// @name         8chan YouTube Link Enhancer
// @namespace    nipah-scripts-8chan
// @version      3.3.1
// @description  Cleans up YouTube links, adds titles, optional thumbnail previews, and settings via STM.
// @author       nipah, Gemini
// @license      MIT
// @match        https://8chan.moe/*
// @match        https://8chan.se/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @connect      youtube.com
// @connect      i.ytimg.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533572/8chan%20YouTube%20Link%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/533572/8chan%20YouTube%20Link%20Enhancer.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- Constants ---
    const SCRIPT_NAME = 'YTLE';
    const SCRIPT_ID = 'YTLE'; // Unique ID for Settings Tab Manager
    const CACHE_KEY_SETTINGS = 'ytleSettings';
    const CACHE_KEY_TITLES = 'ytleTitleCache';

    const DEFAULTS = Object.freeze({
        CACHE_EXPIRY_DAYS: 7,
        SHOW_THUMBNAILS: false,
        API_DELAY_MS: 200,
        CACHE_CLEANUP_PROBABILITY: 0.1, // 10% chance per run
        THUMBNAIL_POPUP_ID: 'ytle-thumbnail-popup',
        THUMBNAIL_HIDE_DELAY_MS: 150,
    });

    const REGEX = Object.freeze({
        YOUTUBE: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&#]|$)/i, // Simplified slightly, captures ID
        YOUTUBE_TRACKING_PARAMS: /[?&](si|feature|ref|fsi|source|utm_source|utm_medium|utm_campaign|gclid|gclsrc|fbclid)=[^&]+/gi,
    });

    const URL_TEMPLATES = Object.freeze({
        OEMBED: "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json",
        THUMBNAIL_WEBP: "https://i.ytimg.com/vi_webp/VIDEO_ID/maxresdefault.webp",
        // Fallback might be needed if maxresdefault webp fails often, e.g., mqdefault.jpg
        // THUMBNAIL_JPG_HQ: "https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg",
    });

    const PLACEHOLDER_IMG_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Transparent pixel
    const YOUTUBE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#FF0000" d="M549.7 124.1c-6.3-23.7-24.9-42.4-48.6-48.6C456.5 64 288 64 288 64s-168.5 0-213.1 11.5c-23.7 6.3-42.4 24.9-48.6 48.6C16 168.5 16 256 16 256s0 87.5 10.3 131.9c6.3 23.7 24.9 42.4 48.6 48.6C119.5 448 288 448 288 448s168.5 0 213.1-11.5c23.7-6.3 42.4-24.9 48.6-48.6 10.3-44.4 10.3-131.9 10.3-131.9s0-87.5-10.3-131.9zM232 334.1V177.9L361 256 232 334.1z"/></svg>`;

    // --- Utilities ---
    const Logger = {
        prefix: `[${SCRIPT_NAME}]`,
        log: (...args) => console.log(Logger.prefix, ...args),
        warn: (...args) => console.warn(Logger.prefix, ...args),
        error: (...args) => console.error(Logger.prefix, ...args),
    };

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getVideoId(href) {
        if (!href) return null;
        const match = href.match(REGEX.YOUTUBE);
        return match ? match[1] : null;
    }

    // --- Settings Manager ---
    class SettingsManager {
        constructor() {
            this.settings = {
                cacheExpiryDays: DEFAULTS.CACHE_EXPIRY_DAYS,
                showThumbnails: DEFAULTS.SHOW_THUMBNAILS
            };
        }

        async load() {
            try {
                const loadedSettings = await GM.getValue(CACHE_KEY_SETTINGS, this.settings);

                // Validate and merge loaded settings
                this.settings.cacheExpiryDays = (typeof loadedSettings.cacheExpiryDays === 'number' && Number.isInteger(loadedSettings.cacheExpiryDays) && loadedSettings.cacheExpiryDays > 0)
                    ? loadedSettings.cacheExpiryDays
                    : DEFAULTS.CACHE_EXPIRY_DAYS;

                this.settings.showThumbnails = (typeof loadedSettings.showThumbnails === 'boolean')
                    ? loadedSettings.showThumbnails
                    : DEFAULTS.SHOW_THUMBNAILS;

                Logger.log('Settings loaded:', this.settings);
            } catch (e) {
                Logger.warn('Failed to load settings, using defaults.', e);
                // Reset to defaults on error
                this.settings = {
                    cacheExpiryDays: DEFAULTS.CACHE_EXPIRY_DAYS,
                    showThumbnails: DEFAULTS.SHOW_THUMBNAILS
                };
            }
        }

        async save() {
            try {
                // Ensure types before saving
                this.settings.cacheExpiryDays = Math.max(1, Math.floor(this.settings.cacheExpiryDays || DEFAULTS.CACHE_EXPIRY_DAYS));
                this.settings.showThumbnails = !!this.settings.showThumbnails;

                await GM.setValue(CACHE_KEY_SETTINGS, this.settings);
                Logger.log('Settings saved:', this.settings);
            } catch (e) {
                Logger.error('Failed to save settings.', e);
            }
        }

        get cacheExpiryDays() {
            return this.settings.cacheExpiryDays;
        }

        set cacheExpiryDays(days) {
            const val = parseInt(days, 10);
            if (!isNaN(val) && val > 0) {
                this.settings.cacheExpiryDays = val;
            } else {
                 Logger.warn(`Attempted to set invalid cacheExpiryDays: ${days}`);
            }
        }

        get showThumbnails() {
            return this.settings.showThumbnails;
        }

        set showThumbnails(value) {
            this.settings.showThumbnails = !!value;
        }
    }

    // --- Title Cache ---
    class TitleCache {
        constructor(settingsManager) {
            this.settings = settingsManager; // Reference to settings
            this.cache = null; // Lazy loaded
        }

        async _loadCache() {
            if (this.cache === null) {
                try {
                    this.cache = await GM.getValue(CACHE_KEY_TITLES, {});
                } catch (e) {
                    Logger.warn('Failed to load title cache:', e);
                    this.cache = {}; // Use empty cache on error
                }
            }
            return this.cache;
        }

        async _saveCache() {
            if (this.cache === null) return; // Don't save if never loaded
            try {
                await GM.setValue(CACHE_KEY_TITLES, this.cache);
            } catch (e) {
                Logger.warn('Failed to save title cache:', e);
            }
        }

        async getTitle(videoId) {
            const cache = await this._loadCache();
            const item = cache[videoId];
            if (item && typeof item.expiry === 'number' && item.expiry > Date.now()) {
                return item.title;
            }
            // If expired or not found, remove old entry (if exists) and return null
            if (item) {
                delete cache[videoId];
                await this._saveCache(); // Save removal
            }
            return null;
        }

        async setTitle(videoId, title) {
            if (!videoId || typeof title !== 'string') return;
            const cache = await this._loadCache();
            const expiryDays = this.settings.cacheExpiryDays;
            const expiryTime = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);

            cache[videoId] = { title: title, expiry: expiryTime };
            await this._saveCache();
        }

        async clearExpired() {
            // Only run cleanup occasionally
            if (Math.random() >= DEFAULTS.CACHE_CLEANUP_PROBABILITY) return 0;

            const cache = await this._loadCache();
            const now = Date.now();
            let changed = false;
            let malformedCount = 0;
            let expiredCount = 0;

            for (const videoId in cache) {
                if (Object.hasOwnProperty.call(cache, videoId)) {
                    const item = cache[videoId];
                    // Check for invalid format or expiry
                    if (!item || typeof item.title !== 'string' || typeof item.expiry !== 'number' || item.expiry <= now) {
                         delete cache[videoId];
                         changed = true;
                         if (item && item.expiry <= now) expiredCount++;
                         else malformedCount++;
                         if (!item || typeof item.title !== 'string' || typeof item.expiry !== 'number') {
                             Logger.warn(`Removed malformed cache entry: ${videoId}`);
                         }
                    }
                }
            }

            if (changed) {
                await this._saveCache();
                const totalCleared = malformedCount + expiredCount;
                if (totalCleared > 0) {
                    Logger.log(`Cleared ${totalCleared} cache entries (${expiredCount} expired, ${malformedCount} malformed).`);
                }
            }
            return expiredCount + malformedCount;
        }

        async purgeAll() {
            try {
                this.cache = {}; // Clear in-memory cache
                await GM.setValue(CACHE_KEY_TITLES, {}); // Clear storage
                Logger.log('Title cache purged successfully.');
                return true;
            } catch (e) {
                Logger.error('Failed to purge title cache:', e);
                return false;
            }
        }
    }

    // --- API Fetcher ---
    class ApiFetcher {
        async fetchVideoData(videoId) {
            const url = URL_TEMPLATES.OEMBED.replace('VIDEO_ID', videoId);
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "json",
                    timeout: 10000,
                    onload: (response) => {
                        if (response.status === 200 && response.response?.title) {
                            resolve(response.response);
                        } else if ([401, 403, 404].includes(response.status)) {
                            reject(new Error(`Video unavailable (Status: ${response.status})`));
                        } else {
                            reject(new Error(`oEmbed request failed (${response.statusText || `Status ${response.status}`})`));
                        }
                    },
                    onerror: (err) => reject(new Error(`GM.xmlHttpRequest error: ${err.error || 'Network error'}`)),
                    ontimeout: () => reject(new Error('oEmbed request timed out')),
                });
            });
        }

        async fetchThumbnailAsDataURL(videoId) {
            const thumbnailUrl = URL_TEMPLATES.THUMBNAIL_WEBP.replace('VIDEO_ID', videoId);
            return new Promise((resolve) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: thumbnailUrl,
                    responseType: 'blob',
                    timeout: 8000, // Slightly shorter timeout for images
                    onload: (response) => {
                        if (response.status === 200 && response.response) {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result); // result is the Data URL
                            reader.onerror = (err) => {
                                Logger.warn(`FileReader error for thumbnail ${videoId}:`, err);
                                resolve(null); // Resolve with null on reader error
                            };
                            reader.readAsDataURL(response.response);
                        } else {
                            // Log non-200 status for debugging, but still resolve null
                             if(response.status !== 404) Logger.warn(`Thumbnail fetch failed for ${videoId} (Status: ${response.status})`);
                            resolve(null);
                        }
                    },
                    onerror: (err) => {
                        Logger.error(`GM.xmlHttpRequest error fetching thumbnail for ${videoId}:`, err);
                        resolve(null);
                    },
                    ontimeout: () => {
                        Logger.warn(`Timeout fetching thumbnail for ${videoId}`);
                        resolve(null);
                    }
                });
            });
        }
    }

    // --- Link Enhancer (DOM Manipulation) ---
    class LinkEnhancer {
        constructor(titleCache, apiFetcher, settingsManager) {
            this.cache = titleCache;
            this.api = apiFetcher;
            this.settings = settingsManager;
            this.styleAdded = false;
            this.processingLinks = new Set(); // Track links currently being fetched
        }

        addStyles() {
            if (this.styleAdded) return;
            const encodedSvg = `data:image/svg+xml;base64,${btoa(YOUTUBE_ICON_SVG)}`;
            const styles = `
                .youtubelink {
                    position: relative;
                    padding-left: 20px; /* Space for icon */
                    display: inline-block; /* Prevent line breaks inside link */
                    white-space: nowrap;
                    text-decoration: none !important;
                    /* Optional: slightly adjust vertical alignment if needed */
                    /* vertical-align: middle; */
                }
                .youtubelink:hover {
                    text-decoration: underline !important;
                }
                .youtubelink::before {
                    content: '';
                    position: absolute;
                    left: 0px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 16px; /* Icon size */
                    height: 16px;
                    background-image: url("${encodedSvg}");
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center;
                    /* vertical-align: middle; /* Align icon with text */
                }
                /* Thumbnail Popup Styles */
                #${DEFAULTS.THUMBNAIL_POPUP_ID} {
                    position: fixed; display: none; z-index: 10000;
                    border: 1px solid #555; background-color: #282828;
                    padding: 2px; border-radius: 2px;
                    box-shadow: 3px 3px 8px rgba(0,0,0,0.4);
                    pointer-events: none; /* Don't interfere with mouse events */
                    max-width: 320px; max-height: 180px; overflow: hidden;
                }
                #${DEFAULTS.THUMBNAIL_POPUP_ID} img {
                    display: block; width: 100%; height: auto;
                    max-height: 176px; /* Max height inside padding */
                    object-fit: contain; background-color: #111;
                }
                /* Settings Panel Content (Scoped to parent div) */
                #${SCRIPT_ID}-panel-content > div { margin-bottom: 10px; }
                #${SCRIPT_ID}-panel-content input[type="number"] {
                    width: 60px; padding: 3px; margin-left: 5px;
                    border: 1px solid var(--settings-input-border, #ccc);
                    background-color: var(--settings-input-bg, #fff);
                    color: var(--settings-text, #000); box-sizing: border-box;
                }
                #${SCRIPT_ID}-panel-content input[type="checkbox"] { margin-right: 5px; vertical-align: middle; }
                #${SCRIPT_ID}-panel-content label.small { vertical-align: middle; font-size: 0.95em; }
                #${SCRIPT_ID}-panel-content button { margin-top: 5px; margin-right: 10px; padding: 4px 8px; }
                #${SCRIPT_ID}-save-status, #${SCRIPT_ID}-purge-status {
                    margin-left: 10px; font-size: 0.9em;
                    color: var(--settings-text, #ccc); font-style: italic;
                }
            `;
            GM_addStyle(styles);
            this.styleAdded = true;
            Logger.log('Styles added.');
        }

        cleanLinkUrl(linkElement) {
            if (!linkElement?.href) return;
            const originalHref = linkElement.href;
            let cleanHref = originalHref;

            // Normalize youtu.be, /live/, /shorts/ to standard watch?v= format
             if (cleanHref.includes('youtu.be/')) {
                const videoId = getVideoId(cleanHref);
                 if (videoId) {
                     const url = new URL(cleanHref);
                     const timestamp = url.searchParams.get('t');
                     cleanHref = `https://www.youtube.com/watch?v=${videoId}${timestamp ? `&t=${timestamp}` : ''}`;
                 }
            } else {
                cleanHref = cleanHref.replace('/live/', '/watch?v=')
                                      .replace('/shorts/', '/watch?v=')
                                      .replace('/embed/', '/watch?v=')
                                      .replace('/v/', '/watch?v=');
             }

            // Remove tracking parameters more reliably using URL API
            try {
                const url = new URL(cleanHref);
                const paramsToRemove = ['si', 'feature', 'ref', 'fsi', 'source', 'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'gclsrc', 'fbclid'];
                let changedParams = false;
                paramsToRemove.forEach(param => {
                    if (url.searchParams.has(param)) {
                        url.searchParams.delete(param);
                        changedParams = true;
                    }
                });
                if (changedParams) {
                    cleanHref = url.toString();
                }
            } catch (e) {
                // Fallback to regex if URL parsing fails (e.g., malformed URL initially)
                cleanHref = cleanHref.replace(REGEX.YOUTUBE_TRACKING_PARAMS, '');
                cleanHref = cleanHref.replace(/(\?|&)$/, ''); // Remove trailing ? or &
                cleanHref = cleanHref.replace('?&', '?');     // Fix "?&" case
            }


            if (cleanHref !== originalHref) {
                try {
                    linkElement.href = cleanHref;
                    // Only update text if it exactly matched the old URL
                    if (linkElement.textContent.trim() === originalHref.trim()) {
                        linkElement.textContent = cleanHref;
                    }
                } catch (e) {
                    // This can happen if the element is removed from DOM during processing
                    Logger.warn("Failed to update link href/text (element might be gone):", linkElement.textContent, e);
                }
            }
        }

        findLinksInNode(node) {
            if (!node || node.nodeType !== Node.ELEMENT_NODE) return [];

            const links = [];
            // Check if the node itself is a link in the target area
            if (node.matches && node.matches('.divMessage a')) {
                links.push(node);
            }
            // Find links within the node (or descendants) that are inside a .divMessage
            if (node.querySelectorAll) {
                 const potentialLinks = node.querySelectorAll('.divMessage a');
                 potentialLinks.forEach(link => {
                     // Ensure the link is actually *within* a .divMessage that is a descendant of (or is) the input node
                     if (node.contains(link) && link.closest('.divMessage')) {
                         links.push(link);
                     }
                 });
            }
            // Return unique links only
             return [...new Set(links)];
        }


        async processLinks(links) {
            if (!links || links.length === 0) return;

            // Perform opportunistic cache cleanup *before* heavy processing
            await this.cache.clearExpired();

            const linksToFetch = [];

            for (const link of links) {
                // Skip if already enhanced, marked as failed for a different reason, or currently being fetched
                // Note: We specifically allow reprocessing if ytFailed is 'no-id' from a previous incorrect run
                if (link.dataset.ytEnhanced ||
                    (link.dataset.ytFailed && link.dataset.ytFailed !== 'no-id') ||
                    this.processingLinks.has(link)) {
                    continue;
                }

                // --- Skip quotelinks ---
                if (link.classList.contains('quoteLink')) {
                    // Mark as skipped so we don't check again
                    link.dataset.ytFailed = 'skipped-type';
                    continue; // Skip this link entirely, don't process further
                }

                // --- PRIMARY FIX: Check for Video ID FIRST ---
                const videoId = getVideoId(link.href);

                if (!videoId) {
                    // It's NOT a YouTube link, or not one we can parse.
                    // Mark as failed so we don't re-check it constantly.
                    // Crucially, DO NOT call cleanLinkUrl or _applyTitle.
                    link.dataset.ytFailed = 'no-id';
                    // Optional: Remove old enhancement classes/data if they exist from a bad run
                    // link.classList.remove("youtubelink");
                    // delete link.dataset.videoId;
                    continue; // Move to the next link in the list
                }

                // --- If we reach here, it IS a potential YouTube link ---

                // Now it's safe to clean the URL (only affects confirmed YT links)
                this.cleanLinkUrl(link);

                // Add video ID attribute now that we know it's a YT link
                link.dataset.videoId = videoId;
                // Clear any previous 'no-id' failure flag if it existed
                delete link.dataset.ytFailed;

                // Check cache for the title
                const cachedTitle = await this.cache.getTitle(videoId);

                if (cachedTitle !== null) {
                    // Title found in cache, apply it directly
                    this._applyTitle(link, videoId, cachedTitle);
                } else {
                    // Title not cached, mark for fetching
                    this.processingLinks.add(link);
                    linksToFetch.push({ link, videoId });
                }
            } // End of loop through links

            // --- Process the batch of links needing API fetches ---
            if (linksToFetch.length === 0) {
                 // Log only if there were links initially, but none needed fetching
                 if (links.length > 0) Logger.log('No new links require title fetching.');
                 return;
             }

            Logger.log(`Fetching titles for ${linksToFetch.length} links...`);

            // Fetch titles sequentially with delay
            for (let i = 0; i < linksToFetch.length; i++) {
                const { link, videoId } = linksToFetch[i];

                // Double check if link still exists in DOM before fetching
                if (!document.body.contains(link)) {
                    this.processingLinks.delete(link);
                    Logger.warn(`Link removed from DOM before title fetch: ${videoId}`);
                    continue;
                }

                // Also check if it somehow got enhanced while waiting (e.g., duplicate link processed faster)
                if (link.dataset.ytEnhanced) {
                    this.processingLinks.delete(link);
                    continue;
                }

                try {
                    const videoData = await this.api.fetchVideoData(videoId);
                    const title = videoData.title.trim() || '[Untitled Video]'; // Handle empty titles
                    this._applyTitle(link, videoId, title);
                    await this.cache.setTitle(videoId, title);
                } catch (e) {
                    Logger.warn(`Failed to enhance link ${videoId}: ${e.message}`);
                    // Apply error state visually AND cache it
                    this._applyTitle(link, videoId, "[YT Fetch Error]"); // Show error to user
                    await this.cache.setTitle(videoId, "[YT Fetch Error]"); // Cache error state
                    link.dataset.ytFailed = 'fetch-error'; // Mark specific failure type
                } finally {
                    this.processingLinks.delete(link); // Remove from processing set regardless of outcome
                }

                // Apply delay between API calls
                if (i < linksToFetch.length - 1) {
                    await delay(DEFAULTS.API_DELAY_MS);
                }
            }
            Logger.log(`Finished fetching batch.`);
        }

        _applyTitle(link, videoId, title) {
             // Check if link still exists before modifying
             if (!document.body.contains(link)) {
                  Logger.warn(`Link removed from DOM before applying title: ${videoId}`);
                 return;
             }
            const displayTitle = (title === "[YT Fetch Error]") ? '[YT Error]' : title;
            // Use textContent for security, avoid potential HTML injection from titles
            link.textContent = `${displayTitle} [${videoId}]`;
            link.classList.add("youtubelink");
            link.dataset.ytEnhanced = "true"; // Mark as successfully enhanced
            delete link.dataset.ytFailed; // Remove failed flag if it was set previously
        }

        // Force re-enhancement of all currently enhanced/failed links
        async reEnhanceAll() {
             Logger.log('Triggering re-enhancement of all detected YouTube links...');
             const links = document.querySelectorAll('a[data-video-id]');
             links.forEach(link => {
                 delete link.dataset.ytEnhanced;
                 delete link.dataset.ytFailed;
                 // Reset text content only if it looks like our format, otherwise leave user-edited text
                 if (link.classList.contains('youtubelink')) {
                      const videoId = link.dataset.videoId;
                      // Basic reset, might need refinement based on how cleanLinkUrl behaves
                      link.textContent = link.href;
                     this.cleanLinkUrl(link); // Re-clean the URL just in case
                 }
                 link.classList.remove('youtubelink');
             });
             await this.processLinks(Array.from(links)); // Process them again
             Logger.log('Re-enhancement process finished.');
         }
    }

    // --- Thumbnail Preview ---
    class ThumbnailPreview {
        constructor(settingsManager, apiFetcher) {
            this.settings = settingsManager;
            this.api = apiFetcher;
            this.popupElement = null;
            this.imageElement = null;
            this.currentVideoId = null;
            this.isHovering = false;
            this.hideTimeout = null;
            this.fetchController = null; // AbortController for fetch
        }

        createPopupElement() {
            if (document.getElementById(DEFAULTS.THUMBNAIL_POPUP_ID)) {
                this.popupElement = document.getElementById(DEFAULTS.THUMBNAIL_POPUP_ID);
                this.imageElement = this.popupElement.querySelector('img');
                if (!this.imageElement) { // Fix if img somehow got removed
                    this.imageElement = document.createElement('img');
                    this.imageElement.alt = "YouTube Thumbnail Preview";
                    this.popupElement.appendChild(this.imageElement);
                 }
                 Logger.log('Re-using existing thumbnail popup element.');
                return;
            }
            this.popupElement = document.createElement('div');
            this.popupElement.id = DEFAULTS.THUMBNAIL_POPUP_ID;

            this.imageElement = document.createElement('img');
            this.imageElement.alt = "YouTube Thumbnail Preview";
            this.imageElement.src = PLACEHOLDER_IMG_SRC;
            this.imageElement.onerror = () => {
                // Don't log error if we aborted the load or hid the popup
                if (this.isHovering && this.imageElement.src !== PLACEHOLDER_IMG_SRC) {
                   Logger.warn(`Thumbnail image failed to load data for video ${this.currentVideoId || '(unknown)'}.`);
                }
                this.hide(); // Hide on error
            };

            this.popupElement.appendChild(this.imageElement);
            document.body.appendChild(this.popupElement);
            Logger.log('Thumbnail popup created.');
        }

        handleMouseOver(event) {
            if (!this.settings.showThumbnails || !this.popupElement) return;

            const link = event.target.closest('.youtubelink[data-video-id]');
            if (!link) return;

            const videoId = link.dataset.videoId;
            if (!videoId) return;

            // Clear any pending hide action
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = null;
            }

            this.isHovering = true;

            // If it's a different video or the popup is hidden, show it
            if (videoId !== this.currentVideoId || this.popupElement.style.display === 'none') {
                this.currentVideoId = videoId;
                // Abort previous fetch if any
                this.fetchController?.abort();
                this.fetchController = new AbortController();
                this.show(event, videoId, this.fetchController.signal);
            }
        }

        handleMouseOut(event) {
            if (!this.settings.showThumbnails || !this.isHovering) return;

             const link = event.target.closest('.youtubelink[data-video-id]');
             if (!link) return; // Mouse out event not from a target link or its children

             // Check if the mouse moved to the popup itself (though pointer-events: none should prevent this)
             // or to another element still within the original link
             if (event.relatedTarget && (link.contains(event.relatedTarget) || this.popupElement?.contains(event.relatedTarget))) {
                 return;
             }

            // Use a short delay before hiding
            this.hideTimeout = setTimeout(() => {
                 this.isHovering = false;
                 this.currentVideoId = null;
                 this.fetchController?.abort(); // Abort fetch if mouse moves away quickly
                 this.fetchController = null;
                 this.hide();
                 this.hideTimeout = null;
             }, DEFAULTS.THUMBNAIL_HIDE_DELAY_MS);
        }

        async show(event, videoId, signal) {
             if (!this.isHovering || !this.popupElement || !this.imageElement) return;

             // Reset image while loading
             this.imageElement.src = PLACEHOLDER_IMG_SRC;
             this.popupElement.style.display = 'block'; // Show popup frame immediately
             this.positionPopup(event); // Position based on initial event

             try {
                const dataUrl = await this.api.fetchThumbnailAsDataURL(videoId);

                // Check if fetch was aborted or if state changed during await
                if (signal?.aborted || !this.isHovering || videoId !== this.currentVideoId) {
                    if (this.popupElement.style.display !== 'none') this.hide();
                    return;
                }

                if (dataUrl) {
                    this.imageElement.src = dataUrl;
                     // Reposition after image loads, as dimensions might change slightly
                     // Use requestAnimationFrame for smoother updates if needed, but direct might be fine
                     this.positionPopup(event);
                    this.popupElement.style.display = 'block'; // Ensure it's visible
                } else {
                    Logger.warn(`No thumbnail data URL received for ${videoId}. Hiding popup.`);
                    this.hide();
                }

             } catch (error) {
                 if (error.name === 'AbortError') {
                     Logger.log(`Thumbnail fetch aborted for ${videoId}.`);
                 } else {
                      Logger.error(`Error fetching thumbnail for ${videoId}:`, error);
                 }
                 this.hide(); // Hide on error
             }
        }

         positionPopup(event) {
             if (!this.popupElement) return;

             const offsetX = 15;
             const offsetY = 15;
             const buffer = 5; // Buffer from window edge

             // Get potential dimensions (use max dimensions as fallback)
             const popupWidth = this.popupElement.offsetWidth || 320;
             const popupHeight = this.popupElement.offsetHeight || 180;
             const winWidth = window.innerWidth;
             const winHeight = window.innerHeight;
             const mouseX = event.clientX;
             const mouseY = event.clientY;

             let x = mouseX + offsetX;
             let y = mouseY + offsetY;

             // Adjust horizontal position
             if (x + popupWidth + buffer > winWidth) {
                 x = mouseX - popupWidth - offsetX; // Flip to left
             }
             x = Math.max(buffer, x); // Ensure it's not off-screen left

             // Adjust vertical position
             if (y + popupHeight + buffer > winHeight) {
                 y = mouseY - popupHeight - offsetY; // Flip to top
             }
             y = Math.max(buffer, y); // Ensure it's not off-screen top

             this.popupElement.style.left = `${x}px`;
             this.popupElement.style.top = `${y}px`;
         }


        hide() {
             if (this.popupElement) {
                 this.popupElement.style.display = 'none';
             }
             if (this.imageElement) {
                 this.imageElement.src = PLACEHOLDER_IMG_SRC; // Reset image
             }
             // Don't reset currentVideoId here, mouseover might happen again quickly
         }

         attachListeners() {
            document.body.addEventListener('mouseover', this.handleMouseOver.bind(this));
            document.body.addEventListener('mouseout', this.handleMouseOut.bind(this));
            Logger.log('Thumbnail hover listeners attached.');
        }
    }

    // --- Settings UI (STM Integration) ---
    class SettingsUI {
        constructor(settingsManager, titleCache, linkEnhancer) {
            this.settings = settingsManager;
            this.cache = titleCache;
            this.enhancer = linkEnhancer;
            this.stmRegistrationAttempted = false; // Prevent multiple attempts if somehow called again
        }

        // Called by STM when the panel needs to be initialized
        initializePanel(panelElement) {
            Logger.log(`STM Initializing panel for ${SCRIPT_ID}`);
            // Use a specific ID for the content wrapper for easier targeting
            panelElement.innerHTML = `
                <div id="${SCRIPT_ID}-panel-content">
                    <div>
                        <strong>Title Cache:</strong><br>
                        <label for="${SCRIPT_ID}-cache-expiry" class="small">Title Cache Expiry (Days):</label>
                        <input type="number" id="${SCRIPT_ID}-cache-expiry" min="1" step="1" value="${this.settings.cacheExpiryDays}" title="Number of days to cache YouTube video titles">
                    </div>
                    <div>
                        <button id="${SCRIPT_ID}-purge-cache">Purge Title Cache</button>
                        <span id="${SCRIPT_ID}-purge-status"></span>
                    </div>
                    <hr style="border-color: #444; margin: 10px 0;">
                    <div>
                        <strong>Thumbnail Preview:</strong><br>
                        <input type="checkbox" id="${SCRIPT_ID}-show-thumbnails" ${this.settings.showThumbnails ? 'checked' : ''}>
                        <label for="${SCRIPT_ID}-show-thumbnails" class="small">Show Thumbnails on Hover</label>
                    </div>
                    <hr style="border-color: #444; margin: 15px 0 10px;">
                    <div>
                         <button id="${SCRIPT_ID}-save-settings">Save Settings</button>
                         <span id="${SCRIPT_ID}-save-status"></span>
                    </div>
                </div>`;

            // Attach listeners using the specific IDs
            panelElement.querySelector(`#${SCRIPT_ID}-save-settings`)?.addEventListener('click', () => this.handleSaveClick(panelElement));
            panelElement.querySelector(`#${SCRIPT_ID}-purge-cache`)?.addEventListener('click', () => this.handlePurgeClick(panelElement));
        }

        // Called by STM when the tab is activated
        activatePanel(panelElement) {
            Logger.log(`STM Activating panel for ${SCRIPT_ID}`);
             const contentWrapper = panelElement.querySelector(`#${SCRIPT_ID}-panel-content`);
             if (!contentWrapper) return;

             // Update input values from current settings
             const expiryInput = contentWrapper.querySelector(`#${SCRIPT_ID}-cache-expiry`);
             const thumbCheckbox = contentWrapper.querySelector(`#${SCRIPT_ID}-show-thumbnails`);
             const saveStatusSpan = contentWrapper.querySelector(`#${SCRIPT_ID}-save-status`);
             const purgeStatusSpan = contentWrapper.querySelector(`#${SCRIPT_ID}-purge-status`);

             if (expiryInput) expiryInput.value = this.settings.cacheExpiryDays;
             if (thumbCheckbox) thumbCheckbox.checked = this.settings.showThumbnails;

             // Clear status messages on activation
             if (saveStatusSpan) saveStatusSpan.textContent = '';
             if (purgeStatusSpan) purgeStatusSpan.textContent = '';
        }

        async handleSaveClick(panelElement) {
            const contentWrapper = panelElement.querySelector(`#${SCRIPT_ID}-panel-content`);
            if (!contentWrapper) { Logger.error("Cannot find panel content for saving."); return; }

            const expiryInput = contentWrapper.querySelector(`#${SCRIPT_ID}-cache-expiry`);
            const thumbCheckbox = contentWrapper.querySelector(`#${SCRIPT_ID}-show-thumbnails`);
            const statusSpan = contentWrapper.querySelector(`#${SCRIPT_ID}-save-status`);

            if (!expiryInput || !thumbCheckbox || !statusSpan) { Logger.error("Missing settings elements in panel."); return; }

            const days = parseInt(expiryInput.value, 10);

            if (isNaN(days) || days <= 0 || !Number.isInteger(days)) {
                this.showStatus(statusSpan, 'Invalid number of days!', 'red');
                Logger.warn('Attempted to save invalid cache expiry days:', expiryInput.value);
                return;
            }

            // Update settings via the SettingsManager instance
            this.settings.cacheExpiryDays = days;
            this.settings.showThumbnails = thumbCheckbox.checked;
            await this.settings.save();

            this.showStatus(statusSpan, 'Settings saved!', 'lime');
            Logger.log(`Settings saved via UI: Cache expiry ${days} days, Show Thumbnails ${thumbCheckbox.checked}.`);

             // Apply thumbnail setting change immediately
             if (!this.settings.showThumbnails) {
                 // Hide any currently visible thumbnail popup if setting is disabled
                 const thumbnailPreview = window.ytle?.thumbnailPreview; // Access instance if exposed
                 thumbnailPreview?.hide();
             }
        }

        async handlePurgeClick(panelElement) {
            const contentWrapper = panelElement.querySelector(`#${SCRIPT_ID}-panel-content`);
             if (!contentWrapper) { Logger.error("Cannot find panel content for purging."); return; }
             const statusSpan = contentWrapper.querySelector(`#${SCRIPT_ID}-purge-status`);
             if (!statusSpan) { Logger.error("Missing purge status element."); return; }


            if (!confirm('Are you sure you want to purge the entire YouTube title cache?\nThis cannot be undone and will trigger re-fetching of all titles.')) {
                this.showStatus(statusSpan, 'Purge cancelled.', 'grey');
                return;
            }

            this.showStatus(statusSpan, 'Purging cache...', 'orange');
            const success = await this.cache.purgeAll();

            if (success) {
                this.showStatus(statusSpan, 'Cache purged! Re-enhancing links...', 'lime');
                // Trigger a re-enhancement of all known links
                await this.enhancer.reEnhanceAll();
                this.showStatus(statusSpan, 'Cache purged! Re-enhancement complete.', 'lime', 3000); // Update message after re-enhancement
            } else {
                this.showStatus(statusSpan, 'Purge failed!', 'red');
            }
        }

        showStatus(spanElement, message, color, duration = 3000) {
            if (!spanElement) return;
            spanElement.textContent = message;
            spanElement.style.color = color;
            // Clear message after duration, only if the message hasn't changed
            setTimeout(() => {
                if (spanElement.textContent === message) {
                    spanElement.textContent = '';
                    spanElement.style.color = 'var(--settings-text, #ccc)'; // Reset color
                }
            }, duration);
        }

        // --- Updated STM Registration with Timeout ---
        async registerWithSTM() {
            if (this.stmRegistrationAttempted) {
                Logger.log('STM registration already attempted, skipping.');
                return;
            }
            this.stmRegistrationAttempted = true;

            let stmAttempts = 0;
            const MAX_STM_ATTEMPTS = 20; // 20 attempts
            const STM_RETRY_DELAY_MS = 250; // 250ms delay
            const MAX_WAIT_TIME_MS = MAX_STM_ATTEMPTS * STM_RETRY_DELAY_MS; // ~5 seconds total

            const checkAndRegister = () => {
                stmAttempts++;
                // Use Logger.log for debugging attempts if needed
                // Logger.log(`STM check attempt ${stmAttempts}/${MAX_STM_ATTEMPTS}...`);

                // *** Check unsafeWindow directly ***
                if (typeof unsafeWindow !== 'undefined'
                    && typeof unsafeWindow.SettingsTabManager !== 'undefined'
                    && typeof unsafeWindow.SettingsTabManager.ready !== 'undefined')
                {
                    Logger.log('Found SettingsTabManager on unsafeWindow. Proceeding with registration...');
                    // Found it, call the async registration function, but don't wait for it here.
                    // Let the rest of the script initialization continue.
                    performStmRegistration().catch(err => {
                        Logger.error("Async registration with STM failed after finding it:", err);
                        // Even if registration fails *after* finding STM, we proceed without the panel.
                    });
                    // STM found (or at least its .ready property), stop polling.
                    return; // Exit the polling function
                }

                // STM not found/ready yet, check if we should give up
                if (stmAttempts >= MAX_STM_ATTEMPTS) {
                    Logger.warn(`SettingsTabManager not found or not ready after ${MAX_STM_ATTEMPTS} attempts (${(MAX_WAIT_TIME_MS / 1000).toFixed(1)} seconds). Proceeding without settings panel.`);
                    // Give up polling, DO NOT call setTimeout again.
                    return; // Exit the polling function
                }

                // STM not found, limit not reached, schedule next attempt
                // Optional: Log if STM exists but .ready is missing
                // if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.SettingsTabManager !== 'undefined') {
                //      Logger.log('Found SettingsTabManager on unsafeWindow, but .ready property is missing. Waiting...');
                // } else {
                //      Logger.log('SettingsTabManager not found on unsafeWindow or not ready yet. Waiting...');
                // }
                setTimeout(checkAndRegister, STM_RETRY_DELAY_MS); // Retry after a delay
            };

            const performStmRegistration = async () => {
                 // This function now only runs if STM.ready was detected
                 try {
                     // *** Access via unsafeWindow ***
                     // Ensure SettingsTabManager and .ready still exist before awaiting
                     if (typeof unsafeWindow?.SettingsTabManager?.ready === 'undefined') {
                         // Should not happen if called correctly, but check defensively
                         Logger.error('SettingsTabManager.ready disappeared before registration could complete.');
                         return; // Cannot register
                     }
                     const STM = await unsafeWindow.SettingsTabManager.ready;
                     // *** End Access via unsafeWindow ***

                     Logger.log('SettingsTabManager ready, registering tab...');
                     const registrationSuccess = STM.registerTab({
                         scriptId: SCRIPT_ID,
                         tabTitle: SCRIPT_NAME,
                         order: 110, // Keep your desired order
                         onInit: this.initializePanel.bind(this),
                         onActivate: this.activatePanel.bind(this)
                     });

                     if (registrationSuccess) {
                          Logger.log(`Tab registration request sent successfully for ${SCRIPT_ID}.`);
                     } else {
                          Logger.warn(`STM registration for ${SCRIPT_ID} returned false (tab might already exist or other issue).`);
                     }

                 } catch (err) {
                     Logger.error('Failed during SettingsTabManager.ready await or registerTab call:', err);
                     // No need to retry here, just log the failure.
                 }
            };

            // Start the check/wait process *asynchronously*.
            // This allows the main script initialization to continue immediately.
            checkAndRegister();
        }
    }

    // --- Main Application Class ---
    class YouTubeLinkEnhancerApp {
        constructor() {
            this.settingsManager = new SettingsManager();
            this.titleCache = new TitleCache(this.settingsManager);
            this.apiFetcher = new ApiFetcher();
            this.linkEnhancer = new LinkEnhancer(this.titleCache, this.apiFetcher, this.settingsManager);
            this.thumbnailPreview = new ThumbnailPreview(this.settingsManager, this.apiFetcher);
            this.settingsUI = new SettingsUI(this.settingsManager, this.titleCache, this.linkEnhancer);
            this.observer = null;

             // Expose instances for debugging/potential external interaction (optional)
             // Be cautious with exposing internal state/methods
             window.ytle = {
                 settings: this.settingsManager,
                 cache: this.titleCache,
                 enhancer: this.linkEnhancer,
                 thumbnailPreview: this.thumbnailPreview,
                 ui: this.settingsUI
             };
        }

        async initialize() {
            Logger.log('Initializing...');

            // 1. Load settings
            await this.settingsManager.load();

            // 2. Add styles & create UI elements
            this.linkEnhancer.addStyles();
            this.thumbnailPreview.createPopupElement();

            // 3. Attach global listeners
            this.thumbnailPreview.attachListeners();

            // 4. Register settings UI
            await this.settingsUI.registerWithSTM();

            // 5. Initial scan & process existing links
            Logger.log('Running initial link processing...');
            const initialLinks = this.linkEnhancer.findLinksInNode(document.body);
            await this.linkEnhancer.processLinks(initialLinks);
            Logger.log('Initial processing complete.');

            // 6. Setup MutationObserver
            this.setupObserver();

            Logger.log('Initialization complete.');
        }

        setupObserver() {
            this.observer = new MutationObserver(async (mutationsList) => {
                let linksToProcess = new Set();

                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for (const addedNode of mutation.addedNodes) {
                           // Only process element nodes
                            if (addedNode.nodeType === Node.ELEMENT_NODE) {
                                const foundLinks = this.linkEnhancer.findLinksInNode(addedNode);
                                foundLinks.forEach(link => {
                                    // Add link if it's potentially enhanceable (no videoId yet, or failed/not enhanced)
                                     if (!link.dataset.videoId || !link.dataset.ytEnhanced || link.dataset.ytFailed) {
                                         linksToProcess.add(link);
                                     }
                                });
                            }
                        }
                    }
                     // Optional: Handle attribute changes if needed (e.g., href changes on existing links)
                     // else if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                     //    const targetLink = mutation.target;
                     //    if (targetLink.matches && targetLink.matches('.divMessage a') && targetLink.closest('.divMessage')) {
                     //        // Handle potential re-enhancement if href changed
                     //        delete targetLink.dataset.ytEnhanced;
                     //        delete targetLink.dataset.ytFailed;
                     //        delete targetLink.dataset.videoId;
                     //        targetLink.classList.remove('youtubelink');
                     //        linksToProcess.add(targetLink);
                     //    }
                     //}
                }

                if (linksToProcess.size > 0) {
                     // Debounce slightly? Or process immediately? Immediate is simpler.
                     Logger.log(`Observer detected ${linksToProcess.size} new/updated potential links.`);
                     await this.linkEnhancer.processLinks([...linksToProcess]);
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                // attributes: true, // Uncomment if you want to observe href changes
                // attributeFilter: ['href'] // Only observe href attribute changes
            });
            Logger.log('MutationObserver started.');
        }
    }

    // --- Script Entry Point ---
    const app = new YouTubeLinkEnhancerApp();
    app.initialize().catch(err => {
        Logger.error("Initialization failed:", err);
    });

})();