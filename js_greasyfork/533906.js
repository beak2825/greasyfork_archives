// ==UserScript==
// @name         DEOVRContentFilter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Filter videos by channel/keyword, manage filter lists
// @author       Twine1481
// @match        https://deovr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deovr.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533906/DEOVRContentFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/533906/DEOVRContentFilter.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const SCRIPT_PREFIX = "[DEOVRContentFilter]";
    console.log(`${SCRIPT_PREFIX} Script starting up...`);

    // -------------------------------------------------------------------------
    // 1) CONFIGURATION
    // -------------------------------------------------------------------------

    // Storage keys for persistence
    const STORAGE = {
        CHANNELS: "filteredChannels",
        KEYWORDS: "filteredKeywords",
        FREE_ONLY: "freeOnlyEnabled"
    };

    // Default filter lists (content-agnostic)
    const DEFAULT_CONFIG = {
        // Add your default filtered channels here
        filteredChannels: [
            // Empty by default
        ],

        // Add your default filtered keywords here
        filteredKeywords: [
            // Empty by default
        ],

        // Default state for free only videos filter
        freeOnlyEnabled: false
    };

    // -------------------------------------------------------------------------
    // 2) STATE MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * State management object for filter lists
     */
    const FilterState = {
        // Current filter lists
        filteredChannels: [],
        filteredKeywords: [],
        freeOnlyEnabled: false,

        /**
         * Initialize filter state from storage
         */
        initialize() {
            // Load stored channels
            const storedChannels = GM_getValue(STORAGE.CHANNELS);
            const normalizedStoredChannels = Array.isArray(storedChannels)
                 ? storedChannels.map(ch => ch.toLowerCase())
                 : [];

            // Load stored keywords
            const storedKeywords = GM_getValue(STORAGE.KEYWORDS);
            const normalizedStoredKeywords = Array.isArray(storedKeywords)
                 ? storedKeywords.map(kw => kw.toLowerCase())
                 : [];

            // Load free only setting
            const storedFreeOnly = GM_getValue(STORAGE.FREE_ONLY);
            this.freeOnlyEnabled = typeof storedFreeOnly === 'boolean' ? storedFreeOnly : DEFAULT_CONFIG.freeOnlyEnabled;

            // Merge default with stored values (removing duplicates)
            this.filteredChannels = [...new Set([
                        ...DEFAULT_CONFIG.filteredChannels.map(ch => ch.toLowerCase()),
                        ...normalizedStoredChannels
                    ])];

            this.filteredKeywords = [...new Set([
                        ...DEFAULT_CONFIG.filteredKeywords.map(kw => kw.toLowerCase()),
                        ...normalizedStoredKeywords
                    ])];

            // Log state
            this._logState();
        },

        /**
         * Add a channel to the filter list
         * @param {string} channel - Channel name to add
         * @returns {boolean} - Whether the channel was added
         */
        addChannel(channel) {
            if (!channel || typeof channel !== 'string')
                return false;

            const normalizedChannel = channel.toLowerCase().trim();
            if (!normalizedChannel)
                return false;

            if (this.filteredChannels.includes(normalizedChannel)) {
                return false; // Already in the list
            }

            this.filteredChannels.push(normalizedChannel);
            this._persistChannels();
            return true;
        },

        /**
         * Remove a channel from the filter list
         * @param {string} channel - Channel name to remove
         * @returns {boolean} - Whether the channel was removed
         */
        removeChannel(channel) {
            if (!channel || typeof channel !== 'string')
                return false;

            const normalizedChannel = channel.toLowerCase().trim();
            if (!normalizedChannel)
                return false;

            const initialLength = this.filteredChannels.length;
            this.filteredChannels = this.filteredChannels.filter(ch => ch !== normalizedChannel);

            if (this.filteredChannels.length !== initialLength) {
                this._persistChannels();
                return true;
            }

            return false;
        },

        /**
         * Add a keyword to the filter list
         * @param {string} keyword - Keyword to add
         * @returns {boolean} - Whether the keyword was added
         */
        addKeyword(keyword) {
            if (!keyword || typeof keyword !== 'string')
                return false;

            const normalizedKeyword = keyword.toLowerCase().trim();
            if (!normalizedKeyword)
                return false;

            if (this.filteredKeywords.includes(normalizedKeyword)) {
                return false; // Already in the list
            }

            this.filteredKeywords.push(normalizedKeyword);
            this._persistKeywords();
            return true;
        },

        /**
         * Remove a keyword from the filter list
         * @param {string} keyword - Keyword to remove
         * @returns {boolean} - Whether the keyword was removed
         */
        removeKeyword(keyword) {
            if (!keyword || typeof keyword !== 'string')
                return false;

            const normalizedKeyword = keyword.toLowerCase().trim();
            if (!normalizedKeyword)
                return false;

            const initialLength = this.filteredKeywords.length;
            this.filteredKeywords = this.filteredKeywords.filter(kw => kw !== normalizedKeyword);

            if (this.filteredKeywords.length !== initialLength) {
                this._persistKeywords();
                return true;
            }

            return false;
        },

        /**
         * Toggle free only mode
         * @returns {boolean} New state
         */
        toggleFreeOnly() {
            this.freeOnlyEnabled = !this.freeOnlyEnabled;
            this._persistFreeOnly();
            return this.freeOnlyEnabled;
        },

        /**
         * Get the current free only state
         * @returns {boolean}
         */
        getFreeOnlyState() {
            return this.freeOnlyEnabled;
        },

        /**
         * Set free only state
         * @param {boolean} state - New state
         */
        setFreeOnlyState(state) {
            if (typeof state !== 'boolean')
                return;

            this.freeOnlyEnabled = state;
            this._persistFreeOnly();
        },

        /**
         * Check if content should be filtered based on current filters
         * @param {string} text - Text content to check
         * @returns {Object} - Result with match details
         */
        shouldFilter(text) {
            if (!text || typeof text !== 'string') {
                return {
                    shouldFilter: false
                };
            }

            const normalizedText = text.toLowerCase();

            // Check for channel match
            const channelMatch = this.filteredChannels.some(channel =>
                    normalizedText.includes(channel));

            // Check for keyword match
            const keywordMatch = this.filteredKeywords.some(keyword =>
                    normalizedText.includes(keyword));

            return {
                shouldFilter: channelMatch || keywordMatch,
                channelMatch,
                keywordMatch
            };
        },

        /**
         * Persist channels to storage
         * @private
         */
        _persistChannels() {
            GM_setValue(STORAGE.CHANNELS, this.filteredChannels);
        },

        /**
         * Persist keywords to storage
         * @private
         */
        _persistKeywords() {
            GM_setValue(STORAGE.KEYWORDS, this.filteredKeywords);
        },

        /**
         * Persist free only state to storage
         * @private
         */
        _persistFreeOnly() {
            GM_setValue(STORAGE.FREE_ONLY, this.freeOnlyEnabled);
        },

        /**
         * Log current state to console
         * @private
         */
        _logState() {
            console.log(`${SCRIPT_PREFIX} Filtered Channels:`, this.filteredChannels);
            console.log(`${SCRIPT_PREFIX} Filtered Keywords:`, this.filteredKeywords);
            console.log(`${SCRIPT_PREFIX} Free Only Mode:`, this.freeOnlyEnabled ? 'Enabled' : 'Disabled');
        }
    };

    // -------------------------------------------------------------------------
    // 3) URL EXTRACTOR
    // -------------------------------------------------------------------------

    /**
     * URL extractor functionality
     */
    const UrlExtractor = {
        /**
         * Find the best video URL from the video data
         * @returns {Object} The best video object with url, quality, and other info
         */
        findBestVideoUrl() {
            console.log(`${SCRIPT_PREFIX} Finding best video URL...`);

            try {
                // Access the window.vrPlayerSettings object
                const vrPlayerSettings = unsafeWindow.vrPlayerSettings;

                if (!vrPlayerSettings || !vrPlayerSettings.videoData || !vrPlayerSettings.videoData.src) {
                    console.log(`${SCRIPT_PREFIX} No video data found.`);
                    return null;
                }

                const videoSources = vrPlayerSettings.videoData.src;
                console.log(`${SCRIPT_PREFIX} Video sources found:`, videoSources);

                if (!Array.isArray(videoSources) || videoSources.length === 0) {
                    console.log(`${SCRIPT_PREFIX} Video sources array is empty or invalid.`);
                    return null;
                }

                // First prioritize by encoding (h265 over h264)
                // Then by quality (highest resolution)

                // Group sources by encoding type
                const h265Sources = videoSources.filter(src => src.encoding === 'h265');
                const h264Sources = videoSources.filter(src => src.encoding === 'h264');

                // Function to find the highest quality stream
                const findHighestQuality = (sources) => {
                    if (!sources || sources.length === 0)
                        return null;

                    // Find the highest resolution source
                    // First attempt to sort by width*height (total pixels)
                    let bestSource = sources.reduce((best, current) => {
                        const bestResolution = best.width * best.height;
                        const currentResolution = current.width * current.height;

                        return currentResolution > bestResolution ? current : best;
                    }, sources[0]);

                    // If there's no width/height data, try to sort by the quality string (e.g., "4000p")
                    if (!bestSource.width || !bestSource.height) {
                        bestSource = sources.reduce((best, current) => {
                            // Extract numerical part from quality string
                            const getBestQuality = (quality) => {
                                const match = quality.match(/(\d+)p/);
                                return match ? parseInt(match[1], 10) : 0;
                            };

                            const bestQuality = getBestQuality(best.quality);
                            const currentQuality = getBestQuality(current.quality);

                            return currentQuality > bestQuality ? current : best;
                        }, sources[0]);
                    }

                    return bestSource;
                };

                // First try to find the best h265 source
                let bestSource = findHighestQuality(h265Sources);

                // If no h265 source found, try h264
                if (!bestSource) {
                    bestSource = findHighestQuality(h264Sources);
                }

                // If still no source found, use the first one in the array
                if (!bestSource && videoSources.length > 0) {
                    bestSource = videoSources[0];
                }

                console.log(`${SCRIPT_PREFIX} Best video source:`, bestSource);
                return bestSource;
            } catch (error) {
                console.error(`${SCRIPT_PREFIX} Error finding best URL:`, error);
                return null;
            }
        },

        /**
         * Copy the URL to clipboard
         * @param {string} url - The URL to copy
         * @returns {Promise<boolean>} - Promise resolving to whether the copy was successful
         */
        async copyToClipboard(url) {
            if (!url)
                return false;

            try {
                // Try using the modern Clipboard API first
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(url);
                    console.log(`${SCRIPT_PREFIX} URL copied using Clipboard API: ${url.substring(0, 50)}...`);
                    return true;
                }

                // Fallback to the older execCommand method
                console.log(`${SCRIPT_PREFIX} Clipboard API not available, trying execCommand fallback...`);
                const textarea = document.createElement('textarea');
                textarea.value = url;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);

                if (successful) {
                    console.log(`${SCRIPT_PREFIX} URL copied using execCommand fallback`);
                } else {
                    console.error(`${SCRIPT_PREFIX} execCommand fallback copy failed`);
                }

                return successful;
            } catch (error) {
                console.error(`${SCRIPT_PREFIX} Error copying to clipboard:`, error);
                return false;
            }
        },

        /**
         * Check if current page is a video page
         * @private
         * @returns {boolean}
         */
        _isVideoPage() {
            // Primary method: Check for the vrPlayerSettings object in the window
            const hasVideoData = Boolean(
                    unsafeWindow.vrPlayerSettings &&
                    unsafeWindow.vrPlayerSettings.videoData &&
                    unsafeWindow.vrPlayerSettings.videoData.src);

            if (hasVideoData) {
                return true;
            }

            // Secondary method: Check for video player UI elements
            const hasVideoPlayer = Boolean(
                    document.querySelector('.m-video-player') ||
                    document.querySelector('.c-video-details') ||
                    document.querySelector('.c-video-player'));

            // Additional check: Look for video-specific controls
            const hasVideoControls = Boolean(
                    document.querySelector('.c-like') || // Like button
                    document.querySelector('a[data-tabs-show="tabs-share"]') // Share button
                );

            console.log(`${SCRIPT_PREFIX} Video page detection: hasVideoData=${hasVideoData}, hasVideoPlayer=${hasVideoPlayer}, hasVideoControls=${hasVideoControls}`);

            // Return true if ANY of these conditions are met
            return hasVideoData || (hasVideoPlayer && hasVideoControls);
        },

        /**
         * Create and add the "Copy Best URL" button to the page
         */
        addCopyButton() {
            if (this._isVideoPage()) {
                console.log(`${SCRIPT_PREFIX} Adding copy URL button to video page...`);

                // Wait for page to be fully loaded
                setTimeout(() => {
                    // First check if any buttons already exist on the page
                    const existingButtons = document.querySelectorAll('.deovr-copy-url-button, .deovr-copy-url-inline-button');

                    if (existingButtons.length > 0) {
                        console.log(`${SCRIPT_PREFIX} Buttons already exist on the page. Count: ${existingButtons.length}`);

                        // Clean up duplicate buttons if more than one exists
                        if (existingButtons.length > 1) {
                            console.log(`${SCRIPT_PREFIX} Removing duplicate buttons...`);

                            // Keep only the first button, remove others
                            for (let i = 1; i < existingButtons.length; i++) {
                                const button = existingButtons[i];
                                // Remove the parent container if it's our custom container
                                const parentContainer = button.closest('.deovr-button-container');
                                if (parentContainer) {
                                    parentContainer.remove();
                                } else {
                                    button.remove();
                                }
                            }
                        }

                        return;
                    }

                    // Try to find the main toolbar first (the one with likes and shares)
                    // Look specifically for the div that contains the like button - this is more reliable
                    const likeButton = document.querySelector('.c-like');

                    if (likeButton) {
                        // Find the nearest parent toolbar
                        const toolbar = likeButton.closest('.u-flex.u-align-i--center');

                        if (toolbar) {
                            console.log(`${SCRIPT_PREFIX} Found main toolbar with like button`);
                            this._addInlineClipboardButton(toolbar);
                            return;
                        }
                    }

                    // If we couldn't find the main toolbar, try to find any toolbar
                    const controlsToolbars = document.querySelectorAll('.u-flex.u-align-i--center');
                    let buttonAdded = false;

                    console.log(`${SCRIPT_PREFIX} Found ${controlsToolbars.length} potential control toolbars`);

                    // Try each toolbar until we find one that works
                    for (let i = 0; i < controlsToolbars.length; i++) {
                        const toolbar = controlsToolbars[i];

                        // Check if this looks like the video controls toolbar by checking for some typical elements
                        const hasShareButton = !!toolbar.querySelector('a[data-tabs-show="tabs-share"]');
                        const hasLikeButton = !!toolbar.querySelector('.c-like');

                        console.log(`${SCRIPT_PREFIX} Toolbar ${i}: hasShareButton=${hasShareButton}, hasLikeButton=${hasLikeButton}`);

                        if (hasShareButton || hasLikeButton) {
                            this._addInlineClipboardButton(toolbar);
                            buttonAdded = true;
                            break; // Stop after adding one button
                        }
                    }

                    // If we didn't add a button to the toolbar, add the standalone button
                    if (!buttonAdded) {
                        // Fallback to adding a standalone button
                        const containers = [
                            document.querySelector('.c-video-details'),
                            document.querySelector('.m-video-player-controls'),
                            document.querySelector('.c-video-player'),
                            document.querySelector('.o-container')
                        ];

                        for (const container of containers) {
                            if (container) {
                                console.log(`${SCRIPT_PREFIX} Adding standalone button to fallback container`);
                                this._addStandaloneButton(container);
                                buttonAdded = true;
                                break;
                            }
                        }
                    }

                    if (!buttonAdded) {
                        console.log(`${SCRIPT_PREFIX} Could not find any suitable container for the button`);
                    }
                }, 2000); // Increased wait time to ensure the page is fully loaded
            }
        },

        /**
         * Add an inline clipboard button to the controls toolbar
         * @private
         * @param {HTMLElement} toolbar - The controls toolbar element
         */
        _addInlineClipboardButton(toolbar) {
            // Check if button already exists in this toolbar
            if (toolbar.querySelector('.deovr-copy-url-inline-button')) {
                return;
            }

            console.log(`${SCRIPT_PREFIX} Adding inline clipboard button to toolbar:`, toolbar);

            // Create a container div similar to other buttons in the toolbar
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'u-mr--one tablet:u-mr--two desktop:u-mr--two deovr-button-container';

            // Create the button with similar styling to other buttons
            const clipboardButton = document.createElement('button');
            clipboardButton.className = 'deovr-copy-url-inline-button o-btn2 o-btn2--medium-squared o-btn2--opt';
            clipboardButton.setAttribute('data-qa', 'copy-best-url-btn');
            clipboardButton.setAttribute('title', 'Copy Best Video URL');

            // Create clipboard icon SVG
            clipboardButton.innerHTML = `
        <span class="o-icon o-icon--medium">
            <svg class="o-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;" 
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 2h-4.2c-0.4-1.2-1.5-2-2.8-2s-2.4 0.8-2.8 2H5C3.9 2 3 2.9 3 4v16c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V4C21 2.9 20.1 2 19 2zM12 2.5c0.8 0 1.5 0.7 1.5 1.5S12.8 5.5 12 5.5S10.5 4.8 10.5 4S11.2 2.5 12 2.5zM19 20H5V4h2v3h10V4h2V20z"/>
            </svg>
        </span>
    `;

            // Add hover/active styles to match site styling
            clipboardButton.style.cssText = `
        color: var(--cUg, #7A7A7A);
        transition: color 0.2s ease;
        cursor: pointer;
    `;

            clipboardButton.addEventListener('mouseover', () => {
                clipboardButton.style.color = 'var(--cBl, #1673FF)';
            });

            clipboardButton.addEventListener('mouseout', () => {
                clipboardButton.style.color = 'var(--cUg, #7A7A7A)';
            });

            // Add click handler
            clipboardButton.addEventListener('click', async() => {
                const bestSource = this.findBestVideoUrl();
                if (bestSource && bestSource.url) {
                    try {
                        const success = await this.copyToClipboard(bestSource.url);
                        if (success) {
                            // Visual feedback - flash the button green
                            clipboardButton.style.color = '#4CAF50';

                            // Create and show a notification
                            const notification = document.createElement('div');
                            notification.textContent = 'URL Copied!';
                            notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: rgba(76, 175, 80, 0.9);
                        color: white;
                        padding: 10px 20px;
                        border-radius: 4px;
                        font-weight: bold;
                        z-index: 9999;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    `;

                            document.body.appendChild(notification);

                            // Reset after a short delay
                            setTimeout(() => {
                                clipboardButton.style.color = 'var(--cUg, #7A7A7A)';
                                notification.style.opacity = '0';
                                notification.style.transition = 'opacity 0.5s';

                                // Remove notification after fade out
                                setTimeout(() => {
                                    if (notification.parentNode) {
                                        document.body.removeChild(notification);
                                    }
                                }, 500);
                            }, 2000);
                        } else {
                            console.error(`${SCRIPT_PREFIX} Failed to copy URL`);
                        }
                    } catch (error) {
                        console.error(`${SCRIPT_PREFIX} Error during copy:`, error);
                    }
                } else {
                    console.error(`${SCRIPT_PREFIX} No URL found to copy`);
                    alert('No video URL found to copy.');
                }
            });

            // Add button to container and container to toolbar
            buttonContainer.appendChild(clipboardButton);

            // Find a good place to insert (before the dropdown menu)
            const dropdownMenu = toolbar.querySelector('.m-dropdown');

            // FIXED: Check if the dropdown menu is actually a child of this toolbar before using insertBefore
            if (dropdownMenu && dropdownMenu.parentNode === toolbar) {
                toolbar.insertBefore(buttonContainer, dropdownMenu);
            } else {
                // If no dropdown or not a child of this toolbar, just append to end
                toolbar.appendChild(buttonContainer);
            }

            console.log(`${SCRIPT_PREFIX} Inline clipboard button added to controls toolbar.`);
        },

        /**
         * Add a standalone button to the container
         * @private
         * @param {HTMLElement} container - The container element
         */
        _addStandaloneButton(container) {
            // Check if button already exists
            if (container.querySelector('.deovr-copy-url-button')) {
                return;
            }

            console.log(`${SCRIPT_PREFIX} Adding standalone button to container:`, container);

            // Create button
            const copyButton = document.createElement('button');
            copyButton.innerText = 'Copy Best URL';
            copyButton.classList.add('deovr-copy-url-button');
            copyButton.style.cssText = `
        background-color: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        margin: 10px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
        z-index: 1000;
        display: block;
    `;

            // Add hover effect
            copyButton.addEventListener('mouseover', () => {
                copyButton.style.backgroundColor = '#0d8aee';
            });

            copyButton.addEventListener('mouseout', () => {
                copyButton.style.backgroundColor = '#2196f3';
            });

            // Add click handler
            copyButton.addEventListener('click', async() => {
                const bestSource = this.findBestVideoUrl();
                if (bestSource && bestSource.url) {
                    try {
                        const success = await this.copyToClipboard(bestSource.url);
                        if (success) {
                            copyButton.innerText = 'URL Copied!';
                            copyButton.style.backgroundColor = '#4CAF50';

                            // Reset button text after a short delay
                            setTimeout(() => {
                                copyButton.innerText = 'Copy Best URL';
                                copyButton.style.backgroundColor = '#2196f3';
                            }, 2000);
                        } else {
                            copyButton.innerText = 'Copy Failed';
                            copyButton.style.backgroundColor = '#f44336';

                            setTimeout(() => {
                                copyButton.innerText = 'Copy Best URL';
                                copyButton.style.backgroundColor = '#2196f3';
                            }, 2000);
                        }
                    } catch (error) {
                        console.error(`${SCRIPT_PREFIX} Error during copy:`, error);
                        copyButton.innerText = 'Copy Failed';
                        copyButton.style.backgroundColor = '#f44336';

                        setTimeout(() => {
                            copyButton.innerText = 'Copy Best URL';
                            copyButton.style.backgroundColor = '#2196f3';
                        }, 2000);
                    }
                } else {
                    copyButton.innerText = 'No URL Found';
                    copyButton.style.backgroundColor = '#f44336';

                    setTimeout(() => {
                        copyButton.innerText = 'Copy Best URL';
                        copyButton.style.backgroundColor = '#2196f3';
                    }, 2000);
                }
            });

            // FIXED: Simply append the button instead of trying to insert it at the beginning
            // This avoids the "Child to insert before is not a child of this node" error
            container.appendChild(copyButton);
            console.log(`${SCRIPT_PREFIX} Standalone copy URL button added to page.`);
        },

        /**
         * Setup observer to listen for page changes
         * This helps detect when navigating between videos
         */
        setupPageObserver() {
            console.log(`${SCRIPT_PREFIX} Setting up page observer for URL extractor...`);

            // Create an observer instance
            const observer = new MutationObserver((mutations) => {
                // Check if button exists
                const buttonExists = document.querySelector('.deovr-copy-url-button') ||
                    document.querySelector('.deovr-copy-url-inline-button');

                if (!buttonExists && this._isVideoPage()) {
                    console.log(`${SCRIPT_PREFIX} Video page detected, adding copy button...`);
                    this.addCopyButton();
                }
            });

            // Start observing
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        /**
         * Set up additional timer to ensure button is added
         */
        setupButtonAdditionTimer() {
            // Check periodically if we need to add the button
            setInterval(() => {
                // Only proceed if we don't already have a button
                const buttonExists = document.querySelector('.deovr-copy-url-button') ||
                    document.querySelector('.deovr-copy-url-inline-button');

                if (!buttonExists && this._isVideoPage()) {
                    console.log(`${SCRIPT_PREFIX} Timer check: Video page detected without button, adding...`);
                    this.addCopyButton();
                }
            }, 3000); // Check every 3 seconds
        }
    };

    // -------------------------------------------------------------------------
    // 4) DOM INTERACTION
    // -------------------------------------------------------------------------

    /**
     * DOM utilities for filtering content and UI modifications
     */
    const DOMManager = {
        /**
         * Filter videos based on current filter state
         */
        filterContent() {
            console.log(`${SCRIPT_PREFIX} Filtering content...`);

            const articles = document.querySelectorAll("article");
            console.log(`${SCRIPT_PREFIX} Found ${articles.length} items to check.`);

            let filteredCount = 0;
            let filteredPremiumCount = 0;

            articles.forEach(article => {
                // Check for content filters (channels and keywords)
                const articleText = article.textContent;
                const result = FilterState.shouldFilter(articleText);

                // Check for premium content if free only mode is enabled
                let isPremium = false;
                if (FilterState.getFreeOnlyState()) {
                    // Check for premium badge
                    const premiumBadge = article.querySelector('.c-grid-badge--crown--square');
                    isPremium = !!premiumBadge;
                }

                // Hide if content filtered or (free only is on and it's premium)
                if (result.shouldFilter || (FilterState.getFreeOnlyState() && isPremium)) {
                    article.style.display = "none";
                    filteredCount++;

                    if (isPremium) {
                        filteredPremiumCount++;
                        console.log(
`${SCRIPT_PREFIX} Filtered premium item:`,
                            article);
                    } else if (result.shouldFilter) {
                        console.log(
`${SCRIPT_PREFIX} Filtered item:`,
                            article,
                            `channelMatch=${result.channelMatch}`, 
`keywordMatch=${result.keywordMatch}`);
                    }
                }
            });

            let filterSummary = `Filtered ${filteredCount} of ${articles.length} items.`;
            if (FilterState.getFreeOnlyState()) {
                filterSummary += ` (${filteredPremiumCount} premium videos hidden)`;
            }

            console.log(`${SCRIPT_PREFIX} ${filterSummary}`);
        },

        /**
         * Inject "Block Channel" button into dropdown menu
         * @param {HTMLElement} dropdownMenu - The dropdown menu element
         */
        injectBlockButton(dropdownMenu) {
            // Avoid duplicates
            if (dropdownMenu.querySelector(".filter-option"))
                return;

            const listItem = document.createElement("li");
            listItem.classList.add("filter-option");
            listItem.innerHTML = `
                <div class="u-cursor--pointer u-fs--fo u-p--four u-lh--one u-block u-nowrap u-transition--base js-m-dropdown" data-qa="block-channel" style="display: flex; align-items: center;">
                    <span class="o-icon u-mr--three u-dg" style="width:18px;">
                        <svg class="o-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"
                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"></path>
                        </svg>
                    </span>
                    <span class="u-inline-block u-align-y--m u-mr--four u-ug u-fw--semibold u-uppercase hover:u-bl">Block Channel</span>
                </div>
            `;

            // Add click handler
            listItem.addEventListener("click", () => this._handleBlockChannelClick(dropdownMenu));

            // Add to dropdown
            dropdownMenu.appendChild(listItem);
            console.log(`${SCRIPT_PREFIX} Block button added to dropdown menu:`, dropdownMenu);
        },

        /**
         * Create and inject "Free Videos Only" toggle switch
         */
        createFreeVideosToggle() {
            // Check if filters container exists
            const filtersForm = document.querySelector('form:has(label[for="switch-premium-only"])');
            if (!filtersForm) {
                console.log(`${SCRIPT_PREFIX} Filters form not found, free videos toggle not added.`);
                return;
            }

            console.log(`${SCRIPT_PREFIX} Found filters form, adding Free Videos toggle.`);

            // Create toggle container
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'u-block u-group u-mb--three';

            // Set checked state based on current filter state
            const isChecked = FilterState.getFreeOnlyState() ? 'checked' : '';

            // Create toggle HTML (based on the Premium Only toggle structure)
            toggleContainer.innerHTML = `
        <label for="switch-free-only" class="o-switch o-switch--base u-inline-block u-align-y--m u-transition--base">
            <a href="#" rel="tag" class="js-c-filters--free-only" id="free-only-toggle">
                <input type="checkbox" id="switch-free-only" ${isChecked}>
                <i class="o-switch-in"></i>
                <span class="o-switch-label u-inline-block u-align-y--m u-pl--three u-fw--bold group-hover:u-bl u-transition--base">
                    <span class="u-ml--half u-inline-block u-transform-none">Free videos only</span>
                </span>
            </a>
        </label>
    `;

            // Add event handler to toggle
            toggleContainer.querySelector('#free-only-toggle').addEventListener('click', (e) => {
                e.preventDefault();
                const checkbox = toggleContainer.querySelector('#switch-free-only');
                checkbox.checked = !checkbox.checked;

                // Update filter state
                FilterState.setFreeOnlyState(checkbox.checked);

                // Re-filter content
                this.filterContent();

                console.log(`${SCRIPT_PREFIX} Free Videos Only toggled to: ${checkbox.checked ? 'ON' : 'OFF'}`);
            });

            // FIX: Find the correct parent-child relationship
            const premiumToggleBlock = filtersForm.querySelector('div:has(label[for="switch-premium-only"])');

            if (premiumToggleBlock && premiumToggleBlock.parentNode === filtersForm) {
                // The premium toggle container is a direct child of the form
                filtersForm.insertBefore(toggleContainer, premiumToggleBlock);
                console.log(`${SCRIPT_PREFIX} Free Videos Only toggle added before Premium toggle.`);
            } else if (premiumToggleBlock) {
                // The premium toggle exists but isn't a direct child - insert adjacent
                premiumToggleBlock.parentNode.insertBefore(toggleContainer, premiumToggleBlock);
                console.log(`${SCRIPT_PREFIX} Free Videos Only toggle added via adjacent insertion.`);
            } else {
                // If premium toggle not found, just append to the form
                filtersForm.appendChild(toggleContainer);
                console.log(`${SCRIPT_PREFIX} Free Videos Only toggle appended to filters form.`);
            }
        },

        /**
         * Setup observer to watch for filter form changes
         * This ensures we add our toggle even if the filters load dynamically
         */
        setupFiltersObserver() {
            console.log(`${SCRIPT_PREFIX} Setting up observer for filters panel...`);

            // Watch for the filters form to appear in the DOM
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        const filterForm = document.querySelector('form:has(label[for="switch-premium-only"])');
                        if (filterForm && !document.querySelector('#switch-free-only')) {
                            this.createFreeVideosToggle();
                            // Observer can keep running to re-add if filters are refreshed
                        }
                    }
                }
            });

            // Start observing the document for filter form appearance
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Also try to add the toggle immediately if filters are already loaded
            setTimeout(() => {
                if (!document.querySelector('#switch-free-only')) {
                    this.createFreeVideosToggle();
                }
            }, 1000);
        },

        /**
         * Scan existing dropdowns for adding block buttons
         */
        scanExistingDropdowns() {
            console.log(`${SCRIPT_PREFIX} Scanning for existing dropdown menus...`);

            const dropdowns = document.querySelectorAll(
                    "#content .m-dropdown.m-dropdown--grid-item .m-dropdown-content ul.u-list.u-l");

            console.log(`${SCRIPT_PREFIX} Found ${dropdowns.length} existing dropdown menu(s).`);
            dropdowns.forEach(dropdown => this.injectBlockButton(dropdown));
        },

        /**
         * Set up observer for dynamically added dropdowns
         */
        setupDynamicObserver() {
            const contentElement = document.querySelector("#content") || document.body;

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the added node is a dropdown menu
                            if (node.matches && node.matches(".m-dropdown-content ul.u-list.u-l")) {
                                this.injectBlockButton(node);
                            } else {
                                // Check for dropdown menus within the added node
                                const nestedDropdowns = node.querySelectorAll ?
                                    node.querySelectorAll(".m-dropdown-content ul.u-list.u-l") :
                                    [];

                                nestedDropdowns.forEach(dropdown => this.injectBlockButton(dropdown));
                            }
                        }
                    });
                });
            });

            observer.observe(contentElement, {
                childList: true,
                subtree: true
            });
            console.log(`${SCRIPT_PREFIX} Dynamic observer set up for new dropdown menus.`);
        },

        /**
         * Handle click on "Block Channel" button
         * @private
         * @param {HTMLElement} dropdownMenu - The dropdown menu element
         */
        _handleBlockChannelClick(dropdownMenu) {
            console.log(`${SCRIPT_PREFIX} Block Channel button clicked.`);

            // Find parent article
            const article = dropdownMenu.closest("article");
            if (!article) {
                console.warn(`${SCRIPT_PREFIX} Could not find parent article.`);
                return;
            }

            // Find channel link
            const channelLink = article.querySelector('a[href^="/channel/"]');
            if (!channelLink) {
                console.warn(`${SCRIPT_PREFIX} No channel link found.`);
                return;
            }

            // Get channel name
            let channelName = channelLink.dataset.amplitudePropsChannel;
            if (!channelName || !channelName.trim()) {
                channelName = channelLink.textContent.trim();
            }
            channelName = channelName.toLowerCase();

            // Validate channel name
            if (channelName.length < 2) {
                if (!confirm(`Channel name is "${channelName}" (very short). Block anyway?`)) {
                    return;
                }
            }

            // Add to filter list
            if (FilterState.addChannel(channelName)) {
                alert(`Channel "${channelName}" added to block list.\nFiltering matching content...`);
                this.filterContent();
            } else {
                alert(`Channel "${channelName}" is already blocked.`);
            }
        }
    };

    // -------------------------------------------------------------------------
    // 5) USER INTERFACE - MENU COMMANDS
    // -------------------------------------------------------------------------

    /**
     * User interface for managing filter lists
     */
    const UserInterface = {
        /**
         * Register all Tampermonkey menu commands
         */
        registerMenuCommands() {
            GM_registerMenuCommand("Add Blocked Channel", () => this.addChannel());
            GM_registerMenuCommand("Remove Blocked Channel", () => this.removeChannel());
            GM_registerMenuCommand("Add Blocked Keyword", () => this.addKeyword());
            GM_registerMenuCommand("Remove Blocked Keyword", () => this.removeKeyword());
            GM_registerMenuCommand(`${FilterState.getFreeOnlyState() ? '✓ ' : ''}Free Videos Only`, () => this.toggleFreeOnly());
            GM_registerMenuCommand("Export Filter Lists", () => this.exportFilters());
            GM_registerMenuCommand("Import Filter Lists", () => this.importFilters());
            GM_registerMenuCommand("Copy Best Video URL", () => this.copyBestVideoUrl());

            console.log(`${SCRIPT_PREFIX} Menu commands registered.`);
        },

        /**
         * Menu command to copy the best video URL
         */
        async copyBestVideoUrl() {
            const bestSource = UrlExtractor.findBestVideoUrl();

            if (bestSource && bestSource.url) {
                try {
                    const success = await UrlExtractor.copyToClipboard(bestSource.url);
                    if (success) {
                        alert(`Best quality URL copied to clipboard!\n\nEncoding: ${bestSource.encoding}\nQuality: ${bestSource.quality}\nResolution: ${bestSource.width}x${bestSource.height}`);
                    } else {
                        alert('Failed to copy URL to clipboard.\n\nPlease try using the "Copy Best URL" button on the video page instead.');
                    }
                } catch (error) {
                    console.error(`${SCRIPT_PREFIX} Error in menu command copy:`, error);
                    alert('Error copying URL to clipboard.\n\nPlease try using the "Copy Best URL" button on the video page instead.');
                }
            } else {
                alert('No video URL found. Are you on a video page?');
            }
        },

        /**
         * Toggle free only mode
         */
        toggleFreeOnly() {
            const newState = FilterState.toggleFreeOnly();
            const actionText = newState ? 'Enabled' : 'Disabled';
            alert(`"Free Videos Only" mode ${actionText}.\nOnly free videos will be shown.`);

            // Update the toggle in the UI if it exists
            const checkbox = document.querySelector('#switch-free-only');
            if (checkbox) {
                checkbox.checked = newState;
            }

            // Re-register menu commands to update the checkmark
            this.registerMenuCommands();

            // Re-filter content with new settings
            DOMManager.filterContent();
        },

        /**
         * Prompt user to add a channel to the filter list
         */
        addChannel() {
            const newChannel = prompt("Enter channel name to block:").trim();
            if (!newChannel)
                return;

            if (FilterState.addChannel(newChannel)) {
                alert(`Channel "${newChannel}" added. Reload the page to update.`);
            } else {
                alert(`Channel "${newChannel}" is already blocked.`);
            }
        },

        /**
         * Prompt user to remove a channel from the filter list
         */
        removeChannel() {
            if (FilterState.filteredChannels.length === 0) {
                alert("No blocked channels.");
                return;
            }

            const listStr = FilterState.filteredChannels.join("\n");
            const toRemove = prompt("Blocked channels:\n" + listStr + "\n\nEnter channel name to remove:");
            if (!toRemove)
                return;

            if (FilterState.removeChannel(toRemove)) {
                alert(`Channel "${toRemove}" removed. Reload the page to update.`);
            } else {
                alert(`Channel "${toRemove}" not found.`);
            }
        },

        /**
         * Prompt user to add a keyword to the filter list
         */
        addKeyword() {
            const newKeyword = prompt("Enter a keyword to block:").trim();
            if (!newKeyword)
                return;

            if (FilterState.addKeyword(newKeyword)) {
                alert(`Keyword "${newKeyword}" added. Reload the page to update.`);
            } else {
                alert(`Keyword "${newKeyword}" is already blocked.`);
            }
        },

        /**
         * Prompt user to remove a keyword from the filter list
         */
        removeKeyword() {
            if (FilterState.filteredKeywords.length === 0) {
                alert("No blocked keywords.");
                return;
            }

            const listStr = FilterState.filteredKeywords.join("\n");
            const toRemove = prompt("Blocked keywords:\n" + listStr + "\n\nEnter keyword to remove:");
            if (!toRemove)
                return;

            if (FilterState.removeKeyword(toRemove)) {
                alert(`Keyword "${toRemove}" removed. Reload the page to update.`);
            } else {
                alert(`Keyword "${toRemove}" not found.`);
            }
        },

        /**
         * Export filter lists to JSON file
         */
        exportFilters() {
            const data = {
                filteredChannels: FilterState.filteredChannels,
                filteredKeywords: FilterState.filteredKeywords,
                freeOnlyEnabled: FilterState.getFreeOnlyState()
            };

            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], {
                type: "application/json"
            });
            const url = URL.createObjectURL(blob);

            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = "deovr_filter_lists.json";
            downloadLink.click();

            URL.revokeObjectURL(url);
        },

        /**
         * Import filter lists from JSON file
         * Uses a modal dialog approach to avoid browser security restrictions
         */
        importFilters() {
            console.log(`${SCRIPT_PREFIX} Starting import process with modal dialog...`);

            // Create modal container
            const modalOverlay = document.createElement('div');
            modalOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
            `;

            // Create modal dialog
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `;

            // Create heading
            const heading = document.createElement('h2');
            heading.textContent = 'Import Filter Lists';
            heading.style.cssText = `
                margin-top: 0;
                margin-bottom: 15px;
                font-size: 18px;
            `;

            // Create description
            const description = document.createElement('p');
            description.textContent = 'Select a JSON file containing filter lists.';
            description.style.marginBottom = '20px';

            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'application/json';
            fileInput.style.display = 'block';
            fileInput.style.marginBottom = '15px';
            fileInput.style.width = '100%';

            // Create buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            `;

            // Create cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.cssText = `
                padding: 8px 16px;
                background-color: #f1f1f1;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;

            // Create import button
            const importButton = document.createElement('button');
            importButton.textContent = 'Import';
            importButton.style.cssText = `
                padding: 8px 16px;
                background-color: #4285f4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
            importButton.disabled = true;

            // Add event listener to enable import button when file is selected
            fileInput.addEventListener('change', () => {
                importButton.disabled = !fileInput.files || fileInput.files.length === 0;
            });

            // Add cancel button functionality
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(modalOverlay);
            });

            // Add import button functionality
            importButton.addEventListener('click', () => {
                const file = fileInput.files[0];
                if (!file)
                    return;

                console.log(`${SCRIPT_PREFIX} Reading file: ${file.name}`);

                const reader = new FileReader();

                // Handle file reading errors
                reader.onerror = error => {
                    console.error(`${SCRIPT_PREFIX} Error reading file:`, error);
                    alert(`Error reading file: ${error.message || "Unknown error"}`);
                    document.body.removeChild(modalOverlay);
                };

                // Process file contents when loaded
                reader.onload = e => {
                    console.log(`${SCRIPT_PREFIX} File read complete, processing content...`);

                    try {
                        const imported = JSON.parse(e.target.result);
                        console.log(`${SCRIPT_PREFIX} Parsed JSON:`, imported);

                        let updated = false;

                        // Support both new and old property names for backward compatibility

                        // Check for channels (new property name)
                        if (imported.filteredChannels && Array.isArray(imported.filteredChannels)) {
                            console.log(`${SCRIPT_PREFIX} Importing filtered channels:`, imported.filteredChannels);
                            FilterState.filteredChannels = imported.filteredChannels.map(ch => ch.toLowerCase());
                            FilterState._persistChannels();
                            updated = true;
                        }
                        // Check for channels (old property name from original script)
                        else if (imported.blockedChannels && Array.isArray(imported.blockedChannels)) {
                            console.log(`${SCRIPT_PREFIX} Importing blocked channels (legacy format):`, imported.blockedChannels);
                            FilterState.filteredChannels = imported.blockedChannels.map(ch => ch.toLowerCase());
                            FilterState._persistChannels();
                            updated = true;
                        }

                        // Check for keywords (new property name)
                        if (imported.filteredKeywords && Array.isArray(imported.filteredKeywords)) {
                            console.log(`${SCRIPT_PREFIX} Importing filtered keywords:`, imported.filteredKeywords);
                            FilterState.filteredKeywords = imported.filteredKeywords.map(kw => kw.toLowerCase());
                            FilterState._persistKeywords();
                            updated = true;
                        }
                        // Check for keywords (old property name from original script)
                        else if (imported.blockedWords && Array.isArray(imported.blockedWords)) {
                            console.log(`${SCRIPT_PREFIX} Importing blocked words (legacy format):`, imported.blockedWords);
                            FilterState.filteredKeywords = imported.blockedWords.map(kw => kw.toLowerCase());
                            FilterState._persistKeywords();
                            updated = true;
                        }

                        // Check for freeOnly setting
                        if (typeof imported.freeOnlyEnabled === 'boolean') {
                            console.log(`${SCRIPT_PREFIX} Importing Free Only setting:`, imported.freeOnlyEnabled);
                            FilterState.setFreeOnlyState(imported.freeOnlyEnabled);

                            // Update UI toggle if it exists
                            const checkbox = document.querySelector('#switch-free-only');
                            if (checkbox) {
                                checkbox.checked = imported.freeOnlyEnabled;
                            }

                            updated = true;
                        }

                        document.body.removeChild(modalOverlay);

                        if (updated) {
                            alert("Filter lists imported successfully. Reload the page to update.");

                            // Re-register menu commands to update the checkmark
                            this.registerMenuCommands();

                            // Re-filter content with new settings
                            DOMManager.filterContent();
                        } else {
                            alert("No valid filter lists found in the imported file.");
                        }
                    } catch (error) {
                        console.error(`${SCRIPT_PREFIX} JSON parsing error:`, error);
                        alert(`Error importing JSON: ${error.message}`);
                        document.body.removeChild(modalOverlay);
                    }
                };

                // Start reading the file as text
                reader.readAsText(file);
            });

            // Assemble the modal
            buttonsContainer.appendChild(cancelButton);
            buttonsContainer.appendChild(importButton);

            modalContent.appendChild(heading);
            modalContent.appendChild(description);
            modalContent.appendChild(fileInput);
            modalContent.appendChild(buttonsContainer);

            modalOverlay.appendChild(modalContent);

            // Add modal to the page
            document.body.appendChild(modalOverlay);

            // Add click handler to close when clicking outside the modal
            modalOverlay.addEventListener('click', (event) => {
                if (event.target === modalOverlay) {
                    document.body.removeChild(modalOverlay);
                }
            });
        }
    };

    // -------------------------------------------------------------------------
    // 6) INITIALIZATION
    // -------------------------------------------------------------------------

    /**
     * Initialize the script
     */
    function initialize() {
        // Initialize state
        FilterState.initialize();

        // Register menu commands
        UserInterface.registerMenuCommands();

        // Set up filters toggle
        DOMManager.setupFiltersObserver();

        // Initial content filtering
        DOMManager.filterContent();

        // Set up UI for content filtering
        DOMManager.scanExistingDropdowns();
        DOMManager.setupDynamicObserver();

        // Set up URL extractor functionality
        UrlExtractor.setupPageObserver();
        UrlExtractor.setupButtonAdditionTimer();

        // Check if we're already on a video page and add the copy button if needed
        setTimeout(() => {
            if (UrlExtractor._isVideoPage()) {
                console.log(`${SCRIPT_PREFIX} Already on a video page, adding copy button...`);
                UrlExtractor.addCopyButton();
            }
        }, 2000); // Small delay to ensure the page is fully loaded

        console.log(`${SCRIPT_PREFIX} Script fully initialized!`);
    }

    // Start the script
    initialize();
})();
