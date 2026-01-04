// ==UserScript==
    // @name         WayBackTube (Hyper-Optimized + Search Terms)
    // @namespace    http://tampermonkey.net/
    // @license MIT
    // @version      80
    // @description  Travel back in time on YouTube with subscriptions, search terms, AND simple 2011 theme! Complete time travel experience with custom recommendation algorithm and clean vintage styling.
    // @author       You
    // @match        https://www.youtube.com/*
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @grant        GM_deleteValue
    // @grant        GM_listValues
    // @grant        GM_addStyle
    // @grant        GM_xmlhttpRequest
    // @connect      youtube.com
    // @connect      googleapis.com
    // @connect      worldtimeapi.org
    // @connect      ipgeolocation.io
    // @connect      worldclockapi.com
    // @connect      *
    // @connect      httpbin.org
    // @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542809/WayBackTube%20%28Hyper-Optimized%20%2B%20Search%20Terms%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542809/WayBackTube%20%28Hyper-Optimized%20%2B%20Search%20Terms%29.meta.js
    // ==/UserScript==
     
    (function() {
        'use strict';
     
        // === HYPER-OPTIMIZED CONFIG ===
        const CONFIG = {
            updateInterval: 50,
            debugMode: true,
            videosPerChannel: 30,
            maxHomepageVideos: 60,
            maxVideoPageVideos: 30,
            channelPageVideosPerMonth: 50,
            watchNextVideosCount: 30,
            seriesMatchVideosCount: 3,
            cacheExpiry: {
                videos: 7200000, // 2 hours
                channelVideos: 3600000, // 1 hour
                searchResults: 1800000 // 30 minutes
            },
            maxConcurrentRequests: 2,
            batchSize: 3,
            apiCooldown: 200,
            autoLoadOnHomepage: false,
            autoLoadDelay: 1500,
            autoAdvanceDays: true,
            autoRefreshInterval: 21600000, // 6 hours
            refreshVideoPercentage: 0.5,
            homepageLoadMoreSize: 12,
            aggressiveNukingInterval: 10,
            viralVideoPercentage: 0.15,
            viralVideosCount: 20,
            RECOMMENDATION_COUNT: 20,
            SAME_CHANNEL_RATIO: 0.6,
            OTHER_CHANNELS_RATIO: 0.4,
            KEYWORD_RATIO: 0.5,
            FRESH_VIDEOS_COUNT: 15,
            KEYWORD_MATCH_RATIO: 0.5,
     
            // Video weighting configuration - UPDATED: 60/40 subscription-search split
            searchTermVideoPercentage: 0.40,  // 40% search term videos (user requested more subscriptions)
            sameChannelVideoPercentage: 0.00, // 0% same channel videos - ONLY next episode goes to top
            subscriptionVideoPercentage: 0.60, // 60% subscription videos (user requested increase)
     
     
     
            // Pre-compiled selectors for performance
            SHORTS_SELECTORS: [
                'ytd-reel-shelf-renderer',
                'ytd-rich-shelf-renderer[is-shorts]',
                '[aria-label*="Shorts"]',
                '[title*="Shorts"]',
                'ytd-video-renderer[is-shorts]',
                '.ytd-reel-shelf-renderer',
                '.shorts-shelf',
                '.reel-shelf-renderer',
                '.shortsLockupViewModelHost',
                '.ytGridShelfViewModelHost',
                '[overlay-style="SHORTS"]',
                '[href*="/shorts/"]'
            ],
     
     
     
            CHANNEL_PAGE_SELECTORS: [
                'ytd-browse[page-subtype="channels"] ytd-video-renderer',
                'ytd-browse[page-subtype="channel"] ytd-video-renderer',
                'ytd-browse[page-subtype="channels"] ytd-grid-video-renderer',
                'ytd-browse[page-subtype="channel"] ytd-grid-video-renderer',
                'ytd-browse[page-subtype="channels"] ytd-rich-item-renderer',
                'ytd-browse[page-subtype="channel"] ytd-rich-item-renderer',
                'ytd-c4-tabbed-header-renderer ytd-video-renderer',
                'ytd-channel-video-player-renderer ytd-video-renderer',
                '#contents ytd-video-renderer',
                '#contents ytd-grid-video-renderer',
                '#contents ytd-rich-item-renderer',
                'ytd-browse[page-subtype="channel"] ytd-shelf-renderer',
                'ytd-browse[page-subtype="channel"] ytd-rich-shelf-renderer',
                'ytd-browse[page-subtype="channel"] ytd-item-section-renderer',
                'ytd-browse[page-subtype="channel"] ytd-section-list-renderer',
                'ytd-browse[page-subtype="channel"] ytd-horizontal-card-list-renderer',
                'ytd-browse[page-subtype="channel"] ytd-playlist-renderer',
                'ytd-browse[page-subtype="channel"] ytd-compact-playlist-renderer',
                'ytd-browse[page-subtype="channel"] ytd-grid-playlist-renderer',
                '#contents ytd-shelf-renderer',
                '#contents ytd-rich-shelf-renderer',
                '#contents ytd-item-section-renderer',
                '#contents ytd-section-list-renderer',
                '#contents ytd-horizontal-card-list-renderer',
                '#contents ytd-playlist-renderer',
                '#contents ytd-compact-playlist-renderer',
                '#contents ytd-grid-playlist-renderer',
                'ytd-browse[page-subtype="channel"] #contents > *',
                'ytd-browse[page-subtype="channel"] #primary-inner > *:not(ytd-c4-tabbed-header-renderer)',
                '[data-target-id="browse-feed-tab"]',
                'ytd-browse[page-subtype="channel"] ytd-browse-feed-actions-renderer'
            ],
     
            // Feed filter chip selectors for hiding "All", "Music", "Gaming", etc.
            FEED_CHIP_SELECTORS: [
                'ytd-feed-filter-chip-bar-renderer',
                'ytd-chip-cloud-renderer',
                'ytd-chip-cloud-chip-renderer',
                'ytd-feed-filter-renderer',
                '#chips',
                '.ytd-feed-filter-chip-bar-renderer',
                '[role="tablist"]',
                'iron-selector[role="tablist"]'
            ]
        };
     
        // === OPTIMIZED UTILITIES ===
        class OptimizedUtils {
            static cache = new Map();
            static domCache = new WeakMap();
            static selectorCache = new Map();
     
            static log(message, ...args) {
                if (CONFIG.debugMode) {
                    console.log(`[WayBackTube] ${message}`, ...args);
                }
            }
     
            static memoize(fn, keyFn) {
                const cache = new Map();
                return function(...args) {
                    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
                    if (cache.has(key)) return cache.get(key);
                    const result = fn.apply(this, args);
                    cache.set(key, result);
                    return result;
                };
            }
     
            static throttle(func, wait) {
                let timeout;
                let previous = 0;
                return function(...args) {
                    const now = Date.now();
                    const remaining = wait - (now - previous);
     
                    if (remaining <= 0 || remaining > wait) {
                        if (timeout) {
                            clearTimeout(timeout);
                            timeout = null;
                        }
                        previous = now;
                        return func.apply(this, args);
                    } else if (!timeout) {
                        timeout = setTimeout(() => {
                            previous = Date.now();
                            timeout = null;
                            func.apply(this, args);
                        }, remaining);
                    }
                };
            }
     
            static debounce(func, wait) {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            }
     
            static $(selector, context = document) {
                const key = `${selector}-${context === document ? 'doc' : 'ctx'}`;
                if (this.selectorCache.has(key)) {
                    return this.selectorCache.get(key);
                }
                const element = context.querySelector(selector);
                if (element) this.selectorCache.set(key, element);
                return element;
            }
     
            static $$(selector, context = document) {
                return Array.from(context.querySelectorAll(selector));
            }
     
            static parseDate(dateStr) {
                if (!dateStr) return null;
                const formats = [
                    /^\d{4}-\d{2}-\d{2}$/,
                    /^\d{2}\/\d{2}\/\d{4}$/,
                    /^\d{4}\/\d{2}\/\d{2}$/
                ];
     
                if (formats[0].test(dateStr)) {
                    return new Date(dateStr + 'T00:00:00');
                } else if (formats[1].test(dateStr)) {
                    const [month, day, year] = dateStr.split('/');
                    return new Date(year, month - 1, day);
                } else if (formats[2].test(dateStr)) {
                    const [year, month, day] = dateStr.split('/');
                    return new Date(year, month - 1, day);
                }
                return new Date(dateStr);
            }
     
            static formatDate(date, format = 'YYYY-MM-DD') {
                if (!date) return '';
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
     
                return format
                    .replace('YYYY', year)
                    .replace('MM', month)
                    .replace('DD', day);
            }
     
            static addDays(date, days) {
                const result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            }
     
            static getRandomElement(array) {
                return array[Math.floor(Math.random() * array.length)];
            }
     
            static shuffleArray(array) {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            }
     
            static removeDuplicates(videos) {
                const seenIds = new Set();
                const uniqueVideos = [];
     
                for (const video of videos) {
                    const videoId = video.id?.videoId || video.id || video.snippet?.resourceId?.videoId;
                    if (videoId && !seenIds.has(videoId)) {
                        seenIds.add(videoId);
                        uniqueVideos.push(video);
                    }
                }
     
                return uniqueVideos;
            }
     
            static weightedShuffleByDate(videos, maxDate) {
                if (!videos || videos.length === 0) return [];
     
                // Sort videos by publish date first - newest to oldest
                const sortedVideos = [...videos].sort((a, b) => {
                    const dateA = new Date(a.snippet?.publishedAt || a.publishedAt || '2005-01-01');
                    const dateB = new Date(b.snippet?.publishedAt || b.publishedAt || '2005-01-01');
                    return dateB - dateA; // Newest first
                });
     
                // Create weighted array based on video publish dates with HEAVY bias towards recent content
                const weightedVideos = sortedVideos.map((video, index) => {
                    const publishDate = new Date(video.snippet?.publishedAt || video.publishedAt || '2005-01-01');
                    const hoursDiff = Math.max(1, Math.floor((maxDate - publishDate) / (1000 * 60 * 60)));
                    const daysDiff = Math.max(1, Math.floor(hoursDiff / 24));
     
                    // HEAVY weight bias towards very recent content
                    let weight;
                    if (hoursDiff <= 6) {
                        weight = 100; // Last 6 hours - MAXIMUM priority
                    } else if (hoursDiff <= 24) {
                        weight = 50;  // Last 24 hours - VERY high priority
                    } else if (daysDiff <= 3) {
                        weight = 25;  // Last 3 days - High priority
                    } else if (daysDiff <= 7) {
                        weight = 15;  // Last week - Good priority
                    } else if (daysDiff <= 30) {
                        weight = 8;   // Last month - Medium priority
                    } else if (daysDiff <= 90) {
                        weight = 4;   // Last 3 months - Lower priority
                    } else if (daysDiff <= 365) {
                        weight = 2;   // Last year - Low priority
                    } else {
                        weight = 1;   // Older than 1 year - Minimal priority
                    }
     
                    // Position bonus: videos already sorted newest first get additional weight
                    // This ensures the newest videos stay at the top
                    const positionBonus = Math.max(0, 20 - Math.floor(index / 5)); // Top 100 videos get position bonus
                    weight += positionBonus;
     
                    return { video, weight, publishDate, hoursDiff };
                });
     
                // Separate videos into tiers for better control
                const recentVideos = weightedVideos.filter(v => v.hoursDiff <= 24);   // Last 24 hours
                const newVideos = weightedVideos.filter(v => v.hoursDiff > 24 && v.hoursDiff <= 168); // Last week
                const olderVideos = weightedVideos.filter(v => v.hoursDiff > 168);    // Older than a week
     
                // Create weighted selection with heavy bias towards recent content
                const weightedSelection = [];
     
                // Add recent videos with maximum representation
                recentVideos.forEach(({ video, weight }) => {
                    for (let i = 0; i < weight; i++) {
                        weightedSelection.push(video);
                    }
                });
     
                // Add new videos with good representation
                newVideos.forEach(({ video, weight }) => {
                    for (let i = 0; i < weight; i++) {
                        weightedSelection.push(video);
                    }
                });
     
                // Add older videos with minimal representation
                olderVideos.forEach(({ video, weight }) => {
                    for (let i = 0; i < weight; i++) {
                        weightedSelection.push(video);
                    }
                });
     
                // Shuffle the weighted array and remove duplicates while preserving heavy recent bias
                const shuffled = this.shuffleArray(weightedSelection);
                const uniqueVideos = [];
                const seenIds = new Set();
     
                for (const video of shuffled) {
                    const videoId = video.id?.videoId || video.id || video.snippet?.resourceId?.videoId;
                    if (videoId && !seenIds.has(videoId)) {
                        seenIds.add(videoId);
                        uniqueVideos.push(video);
                    }
                }
     
                return uniqueVideos;
            }
     
            static waitFor(condition, timeout = 10000, interval = 100) {
                return new Promise((resolve, reject) => {
                    const startTime = Date.now();
                    const check = () => {
                        if (condition()) {
                            resolve();
                        } else if (Date.now() - startTime >= timeout) {
                            reject(new Error('Timeout waiting for condition'));
                        } else {
                            setTimeout(check, interval);
                        }
                    };
                    check();
                });
            }
     
            static sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
     
            static isValidVideoId(videoId) {
                return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
            }
     
            static extractVideoId(url) {
                if (!url) return null;
                const match = url.match(/(?:v=|\/embed\/|\/watch\?v=|\/v\/|youtu\.be\/)([^&\n?#]+)/);
                return match ? match[1] : null;
            }
     
            static extractChannelId(url) {
                if (!url) return null;
                const patterns = [
                    /\/channel\/([a-zA-Z0-9_-]+)/,
                    /\/c\/([a-zA-Z0-9_-]+)/,
                    /\/user\/([a-zA-Z0-9_-]+)/,
                    /\/@([a-zA-Z0-9_-]+)/
                ];
     
                for (const pattern of patterns) {
                    const match = url.match(pattern);
                    if (match) return match[1];
                }
                return null;
            }
     
            static cleanTitle(title) {
                if (!title) return '';
                return title
                    .replace(/[\u200B-\u200D\uFEFF]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
            }
     
            static extractKeywords(title) {
                if (!title) return [];
                return title
                    .toLowerCase()
                    .replace(/[^\w\s]/g, '')
                    .split(/\s+/)
                    .filter(word => word.length > 2)
                    .slice(0, 5);
            }
     
            static getCurrentPage() {
                const path = window.location.pathname;
                if (path === '/') return 'home';
                if (path.startsWith('/watch')) return 'video';
                if (path.startsWith('/channel') || path.startsWith('/c/') || path.startsWith('/user/') || path.startsWith('/@')) return 'channel';
                if (path.startsWith('/results')) return 'search';
                return 'other';
            }
     
            static getPageContext() {
                return {
                    page: this.getCurrentPage(),
                    url: window.location.href,
                    videoId: this.extractVideoId(window.location.href),
                    channelId: this.extractChannelId(window.location.href)
                };
            }
     
            static calculateRelativeDate(uploadDate, maxDate) {
                if (!uploadDate || !maxDate) return '';
     
                const upload = new Date(uploadDate);
                const max = new Date(maxDate);
     
                if (upload > max) return 'In the future';
     
                // Calculate proper date differences
                let years = max.getFullYear() - upload.getFullYear();
                let months = max.getMonth() - upload.getMonth();
                let days = max.getDate() - upload.getDate();
     
                // Adjust for negative days
                if (days < 0) {
                    months--;
                    const prevMonth = new Date(max.getFullYear(), max.getMonth(), 0);
                    days += prevMonth.getDate();
                }
     
                // Adjust for negative months
                if (months < 0) {
                    years--;
                    months += 12;
                }
     
                // Calculate total days for smaller units
                const totalMilliseconds = max - upload;
                const totalDays = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
                const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
                const totalMinutes = Math.floor(totalMilliseconds / (1000 * 60));
     
                // Return the most appropriate unit
                if (years > 0) {
                    return `${years} year${years > 1 ? 's' : ''} ago`;
                }
                if (months > 0) {
                    return `${months} month${months > 1 ? 's' : ''} ago`;
                }
                if (totalDays >= 7) {
                    const weeks = Math.floor(totalDays / 7);
                    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
                }
                if (totalDays > 0) {
                    return `${totalDays} day${totalDays > 1 ? 's' : ''} ago`;
                }
                if (totalHours > 0) {
                    return `${totalHours} hour${totalHours > 1 ? 's' : ''} ago`;
                }
                if (totalMinutes > 0) {
                    return `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''} ago`;
                }
                return 'Just now';
            }
     
            // Filter relative date text elements to show time relative to selected date
            static filterRelativeDates(maxDate) {
                if (!maxDate) return;
     
                const relativePatterns = [
                    /(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/gi,
                    /(\d+)\s+(sec|min|hr|hrs|d|w|mo|yr)s?\s+ago/gi
                ];
     
                // Find all text nodes with relative dates in search results ONLY
                const walker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode: function(node) {
                            if (!node.parentElement) return NodeFilter.FILTER_REJECT;
     
                            // Skip our own UI elements
                            if (node.parentElement.closest('.wayback-container, .yt-time-machine-ui, #wayback-channel-content, .wayback-channel-video-card, .tm-video-card')) {
                                return NodeFilter.FILTER_REJECT;
                            }
     
                            // Skip homepage content that we've replaced
                            if (node.parentElement.closest('ytd-browse[page-subtype="home"]')) {
                                return NodeFilter.FILTER_REJECT;
                            }
     
                            // Skip watch next sidebar (our content)
                            if (node.parentElement.closest('#secondary #related')) {
                                return NodeFilter.FILTER_REJECT;
                            }
     
                            // ONLY process search results - look for search result containers
                            const isInSearchResults = node.parentElement.closest('#contents ytd-search, ytd-search-section-renderer, ytd-video-renderer, ytd-shelf-renderer');
                            if (!isInSearchResults) {
                                return NodeFilter.FILTER_REJECT;
                            }
     
                            const text = node.textContent.trim();
                            return relativePatterns.some(pattern => pattern.test(text)) ? 
                                NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                        }
                    }
                );
     
                const textNodes = [];
                let node;
                while (node = walker.nextNode()) {
                    textNodes.push(node);
                }
     
                // Track processed nodes to avoid double-processing
                const processedNodes = new Set();
     
                // Update each text node with corrected relative date
                textNodes.forEach(textNode => {
                    if (processedNodes.has(textNode)) return;
                    processedNodes.add(textNode);
     
                    let originalText = textNode.textContent;
                    let newText = originalText;
     
                    relativePatterns.forEach(pattern => {
                        newText = newText.replace(pattern, (match, amount, unit) => {
                            // Convert original upload date to be relative to our selected date
                            const normalizedUnit = this.normalizeTimeUnit(unit);
                            const originalUploadDate = this.calculateOriginalDate(amount, normalizedUnit, new Date());
     
                            // Apply 1-year leniency for future date detection
                            const maxDateWithLeniency = new Date(maxDate);
                            maxDateWithLeniency.setFullYear(maxDateWithLeniency.getFullYear() + 1);
     
                            if (originalUploadDate <= maxDate) {
                                // Video is within time machine date - update normally
                                const relativeToSelected = this.calculateRelativeDate(originalUploadDate, maxDate);
                                return relativeToSelected || match;
                            } else if (originalUploadDate <= maxDateWithLeniency) {
                                // Video is within 1-year leniency - show random months from 6-11
                                const randomMonths = Math.floor(Math.random() * 6) + 6; // 6-11 months
                                return `${randomMonths} month${randomMonths > 1 ? 's' : ''} ago`;
                            } else {
                                // Video is more than 1 year in the future - mark for removal
                                const videoElement = textNode.parentElement.closest('ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer');
                                if (videoElement) {
                                    setTimeout(() => {
                                        OptimizedUtils.log(`Removing future video from search: ${match} (uploaded after ${OptimizedUtils.formatDate(maxDateWithLeniency)})`);
                                        videoElement.style.display = 'none';
                                        videoElement.remove();
                                    }, 0);
                                }
                                return match; // Return original temporarily before removal
                            }
                        });
                    });
     
                    if (newText !== originalText) {
                        if (textNode) textNode.textContent = newText;
                    }
                });
            }
     
            static normalizeTimeUnit(unit) {
                const unitMap = {
                    'sec': 'second', 'min': 'minute', 'hr': 'hour', 'hrs': 'hour',
                    'd': 'day', 'w': 'week', 'mo': 'month', 'yr': 'year'
                };
                return unitMap[unit.toLowerCase()] || unit.toLowerCase();
            }
     
            static calculateOriginalDate(amount, unit, fromDate) {
                const date = new Date(fromDate);
                const value = parseInt(amount);
     
                switch (unit) {
                    case 'second':
                        date.setSeconds(date.getSeconds() - value);
                        break;
                    case 'minute':
                        date.setMinutes(date.getMinutes() - value);
                        break;
                    case 'hour':
                        date.setHours(date.getHours() - value);
                        break;
                    case 'day':
                        date.setDate(date.getDate() - value);
                        break;
                    case 'week':
                        date.setDate(date.getDate() - (value * 7));
                        break;
                    case 'month':
                        date.setMonth(date.getMonth() - value);
                        break;
                    case 'year':
                        date.setFullYear(date.getFullYear() - value);
                        break;
                }
     
                return date;
            }
        }
     
        // === OPTIMIZED API MANAGER ===
        class OptimizedAPIManager {
            constructor() {
                // Make API keys persistent across versions - use wayback_persistent prefix
                this.keys = GM_getValue('wayback_persistent_api_keys', []);
                this.currentKeyIndex = GM_getValue('wayback_persistent_current_key_index', 0);
                this.keyStats = GM_getValue('wayback_persistent_key_stats', {});
                this.baseUrl = 'https://www.googleapis.com/youtube/v3';
                this.viralVideoCache = new Map();
                this.requestQueue = [];
                this.activeRequests = 0;
                this.rateLimiter = new Map();
     
     
     
                this.init();
            }
     
            init() {
                const now = Date.now();
                const oneDayAgo = now - 86400000; // 24 hours
     
                // Reset failed keys older than 24 hours
                Object.keys(this.keyStats).forEach(key => {
                    const stats = this.keyStats[key];
                    if (stats.lastFailed && stats.lastFailed < oneDayAgo) {
                        stats.failed = false;
                        stats.quotaExceeded = false;
                    }
                });
     
                this.validateKeyIndex();
                OptimizedUtils.log(`API Manager initialized with ${this.keys.length} keys`);
            }
     
            validateKeyIndex() {
                if (this.currentKeyIndex >= this.keys.length) {
                    this.currentKeyIndex = 0;
                }
            }
     
            get currentKey() {
                return this.keys.length > 0 ? this.keys[this.currentKeyIndex] : null;
            }
     
            addKey(apiKey) {
                if (!apiKey || apiKey.length < 35 || this.keys.includes(apiKey)) {
                    return false;
                }
     
                this.keys.push(apiKey);
                this.keyStats[apiKey] = {
                    failed: false,
                    quotaExceeded: false,
                    lastUsed: 0,
                    requestCount: 0,
                    successCount: 0
                };
                this.saveKeys();
                OptimizedUtils.log(`Added API key: ${apiKey.substring(0, 8)}...`);
                return true;
            }
     
            removeKey(apiKey) {
                const index = this.keys.indexOf(apiKey);
                if (index === -1) return false;
     
                this.keys.splice(index, 1);
                delete this.keyStats[apiKey];
     
                // Adjust current index
                if (this.currentKeyIndex >= this.keys.length) {
                    this.currentKeyIndex = Math.max(0, this.keys.length - 1);
                } else if (index <= this.currentKeyIndex && this.currentKeyIndex > 0) {
                    this.currentKeyIndex--;
                }
     
                this.saveKeys();
                OptimizedUtils.log(`Removed API key: ${apiKey.substring(0, 8)}...`);
                return true;
            }
     
            rotateToNextKey() {
                if (this.keys.length <= 1) return false;
     
                const startIndex = this.currentKeyIndex;
                let attempts = 0;
     
                while (attempts < this.keys.length) {
                    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
                    attempts++;
     
                    const currentKey = this.currentKey;
                    const stats = this.keyStats[currentKey];
     
                    if (!stats || (!stats.quotaExceeded && !stats.failed)) {
                        this.saveKeys();
                        OptimizedUtils.log(`Rotated to key ${this.currentKeyIndex + 1}/${this.keys.length}`);
                        return true;
                    }
                }
     
                this.currentKeyIndex = 0;
                this.saveKeys();
                OptimizedUtils.log('All keys have issues, reset to first key');
                return false;
            }
     
            markKeySuccess(apiKey) {
                const stats = this.keyStats[apiKey] || {};
                Object.assign(stats, {
                    lastUsed: Date.now(),
                    requestCount: (stats.requestCount || 0) + 1,
                    successCount: (stats.successCount || 0) + 1,
                    failed: false
                });
                this.keyStats[apiKey] = stats;
                this.saveKeys();
            }
     
            markKeyFailed(apiKey, errorMessage) {
                const stats = this.keyStats[apiKey] || {};
                stats.failed = true;
                stats.lastFailed = Date.now();
     
                const quotaErrors = ['quota', 'exceeded', 'dailylimitexceeded', 'ratelimitexceeded'];
                if (quotaErrors.some(error => errorMessage.toLowerCase().includes(error))) {
                    stats.quotaExceeded = true;
                }
     
                this.keyStats[apiKey] = stats;
                this.saveKeys();
                OptimizedUtils.log(`Key failed: ${apiKey.substring(0, 8)}... - ${errorMessage}`);
            }
     
            saveKeys() {
                // Use persistent storage for API keys across versions
                GM_setValue('wayback_persistent_api_keys', this.keys);
                GM_setValue('wayback_persistent_current_key_index', this.currentKeyIndex);
                GM_setValue('wayback_persistent_key_stats', this.keyStats);
            }
     
     
     
            getRandomUserAgent() {
                const userAgents = [
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'
                ];
                return userAgents[Math.floor(Math.random() * userAgents.length)];
            }
     
            async testAPIKey(apiKey) {
                try {
                    const response = await this.makeRequest(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=test&key=${apiKey}`);
                    if (response && response.items) {
                        return { success: true, message: 'Working perfectly' };
                    } else {
                        return { success: false, message: 'Invalid response format' };
                    }
                } catch (error) {
                    const errorMsg = error.message || error.toString();
                    if (errorMsg.includes('quotaExceeded') || errorMsg.includes('dailyLimitExceeded')) {
                        return { success: false, message: 'quotaExceeded - Daily quota exceeded' };
                    } else if (errorMsg.includes('keyInvalid') || errorMsg.includes('invalid')) {
                        return { success: false, message: 'keyInvalid - API key is invalid' };
                    } else if (errorMsg.includes('accessNotConfigured')) {
                        return { success: false, message: 'accessNotConfigured - YouTube Data API not enabled' };
                    } else {
                        return { success: false, message: errorMsg };
                    }
                }
            }
     
            async testAllKeys() {
                const results = [];
                for (let i = 0; i < this.keys.length; i++) {
                    const key = this.keys[i];
                    const result = await this.testAPIKey(key);
                    results.push({
                        keyIndex: i,
                        keyPreview: `${key.substring(0, 8)}...`,
                        result: result.success ? 'Working perfectly' : result.message
                    });
                    // Add delay between requests to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                return results;
            }
     
            getCache(key, forceRefresh = false) {
                if (forceRefresh) return null;
     
                const cached = GM_getValue(`cache_${key}`, null);
                if (cached) {
                    try {
                        const data = JSON.parse(cached);
                        if (Date.now() - data.timestamp < CONFIG.cacheExpiry.videos) {
                            return data.value;
                        }
                    } catch (e) {
                        // Invalid cache entry
                    }
                }
                return null;
            }
     
            setCache(key, value, forceRefresh = false) {
                const cacheData = {
                    timestamp: Date.now(),
                    value: value
                };
                GM_setValue(`cache_${key}`, JSON.stringify(cacheData));
            }
     
            clearCache() {
                const keys = GM_listValues();
                keys.forEach(key => {
                    if (key.startsWith('cache_')) {
                        GM_deleteValue(key);
                    }
                });
            }
     
            generateRealisticViewCount(publishedAt, referenceDate) {
                const videoDate = new Date(publishedAt);
                const refDate = new Date(referenceDate);
                const daysSinceUpload = Math.floor((refDate - videoDate) / (1000 * 60 * 60 * 24));
     
                let minViews, maxViews;
     
                if (daysSinceUpload <= 1) {
                    minViews = 50;
                    maxViews = 10000;
                } else if (daysSinceUpload <= 7) {
                    minViews = 500;
                    maxViews = 100000;
                } else if (daysSinceUpload <= 30) {
                    minViews = 2000;
                    maxViews = 500000;
                } else if (daysSinceUpload <= 365) {
                    minViews = 5000;
                    maxViews = 2000000;
                } else {
                    minViews = 10000;
                    maxViews = 5000000;
                }
     
                const randomViews = Math.floor(Math.random() * (maxViews - minViews) + minViews);
                return this.formatViewCount(randomViews);
            }
     
            formatViewCount(count) {
                if (count >= 1000000) {
                    return (count / 1000000).toFixed(1) + 'M';
                } else if (count >= 1000) {
                    return (count / 1000).toFixed(1) + 'K';
                }
                return count.toString();
            }
     
            async makeRequest(endpoint, params) {
                return new Promise((resolve, reject) => {
                    if (this.keys.length === 0) {
                        reject(new Error('No API keys available'));
                        return;
                    }
     
                    this.requestQueue.push({ endpoint, params, resolve, reject, attempts: 0 });
                    this.processQueue();
                });
            }
     
            async processQueue() {
                if (this.activeRequests >= CONFIG.maxConcurrentRequests || this.requestQueue.length === 0) {
                    return;
                }
     
                const request = this.requestQueue.shift();
                this.activeRequests++;
     
                try {
                    const result = await this.executeRequest(request);
                    request.resolve(result);
                } catch (error) {
                    request.reject(error);
                } finally {
                    this.activeRequests--;
                    setTimeout(() => this.processQueue(), CONFIG.apiCooldown);
                }
            }
     
            async executeRequest(request) {
                const maxAttempts = Math.min(this.keys.length, 10);
     
                if (request.attempts >= maxAttempts) {
                    throw new Error('All API keys exhausted');
                }
     
                const currentKey = this.currentKey;
                if (!currentKey) {
                    throw new Error('No valid API key');
                }
     
                // Rate limiting per key
                const now = Date.now();
                const keyRateLimit = this.rateLimiter.get(currentKey) || 0;
                if (now < keyRateLimit) {
                    await OptimizedUtils.sleep(keyRateLimit - now);
                }
     
                const urlParams = new URLSearchParams({ ...request.params, key: currentKey });
                const url = `${request.endpoint}?${urlParams}`;
     
                OptimizedUtils.log(`Request attempt ${request.attempts + 1} with key ${this.currentKeyIndex + 1}`);
     
                return new Promise((resolve, reject) => {
                    // Get proxy configuration if enabled
                    const requestConfig = {
                        method: 'GET',
                        url: url,
                        timeout: 10000,
                        headers: { 
                            'Accept': 'application/json',
                            'User-Agent': this.getRandomUserAgent()
                        }
                    };
     
     
     
                    GM_xmlhttpRequest({
                        ...requestConfig,
                        onload: (response) => {
                            this.rateLimiter.set(currentKey, Date.now() + 100); // 100ms rate limit per key
     
                            // Debug logging for API responses
                            OptimizedUtils.log(`📥 API Response: ${response.status} for ${url.split('?')[0]}`);
                            if (requestConfig.proxy) {
                                OptimizedUtils.log(`🔄 Response came through proxy: ${requestConfig.proxy.host}:${requestConfig.proxy.port}`);
                            }
     
                            if (response.status === 200) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    this.markKeySuccess(currentKey);
     
                                    // Log success stats
                                    const itemCount = data.items ? data.items.length : 0;
                                    OptimizedUtils.log(`✅ API Success: Retrieved ${itemCount} items`);
     
                                    resolve(data);
                                } catch (e) {
                                    OptimizedUtils.log(`❌ JSON Parse Error: ${e.message}`);
                                    reject(new Error('Invalid JSON response'));
                                }
                            } else if (response.status === 403) {
                                // Specific handling for quota exceeded
                                let errorMessage = `HTTP ${response.status}`;
                                try {
                                    const errorData = JSON.parse(response.responseText);
                                    if (errorData.error?.message) {
                                        errorMessage = errorData.error.message;
                                        if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
                                            OptimizedUtils.log(`🚫 Quota exceeded for key ${this.currentKeyIndex + 1}: ${errorMessage}`);
                                            this.keyStats[currentKey].quotaExceeded = true;
                                        }
                                    }
                                } catch (e) {
                                    // Use default error message
                                }
     
                                this.markKeyFailed(currentKey, errorMessage);
     
                                if (this.rotateToNextKey()) {
                                    request.attempts++;
                                    OptimizedUtils.log(`🔄 Rotating to next key after quota error, attempt ${request.attempts}`);
                                    setTimeout(() => {
                                        this.executeRequest(request).then(resolve).catch(reject);
                                    }, 500);
                                } else {
                                    reject(new Error(`API Error: ${errorMessage}`));
                                }
                            } else {
                                let errorMessage = `HTTP ${response.status}`;
                                try {
                                    const errorData = JSON.parse(response.responseText);
                                    if (errorData.error?.message) {
                                        errorMessage = errorData.error.message;
                                    }
                                } catch (e) {
                                    // Use default error message
                                }
     
                                OptimizedUtils.log(`❌ API Error ${response.status}: ${errorMessage}`);
                                this.markKeyFailed(currentKey, errorMessage);
     
                                if (this.rotateToNextKey()) {
                                    request.attempts++;
                                    setTimeout(() => {
                                        this.executeRequest(request).then(resolve).catch(reject);
                                    }, 500);
                                } else {
                                    reject(new Error(`API Error: ${errorMessage}`));
                                }
                            }
                        },
                        onerror: (error) => {
                            OptimizedUtils.log(`🔥 Network Error for ${url.split('?')[0]}:`, error);
     
     
     
                            this.markKeyFailed(currentKey, 'Network error');
                            if (this.rotateToNextKey()) {
                                request.attempts++;
                                OptimizedUtils.log(`🔄 Retrying after network error, attempt ${request.attempts}`);
                                setTimeout(() => {
                                    this.executeRequest(request).then(resolve).catch(reject);
                                }, 1000);
                            } else {
                                reject(new Error(`Network error: ${error.error || 'Connection failed'}`));
                            }
                        }
                    });
                });
            }
     
            async searchVideos(query, options = {}) {
                const params = {
                    part: 'snippet',
                    type: 'video',
                    order: options.order || 'relevance',
                    maxResults: options.maxResults || 50,
                    q: query,
                    ...options.additionalParams
                };
     
                if (options.publishedAfter) {
                    params.publishedAfter = options.publishedAfter.toISOString();
                }
                if (options.publishedBefore) {
                    params.publishedBefore = options.publishedBefore.toISOString();
                }
     
                try {
                    const data = await this.makeRequest(`${this.baseUrl}/search`, params);
                    // Normalize search results to match video format expected by other parts of the code
                    const items = data.items || [];
                    return items.map(item => ({
                        id: item.id?.videoId || item.id,
                        snippet: item.snippet
                    }));
                } catch (error) {
                    OptimizedUtils.log('Search videos error:', error.message);
                    return [];
                }
            }
     
            async getChannelVideos(channelId, options = {}) {
                const params = {
                    part: 'snippet',
                    channelId: channelId,
                    type: 'video',
                    order: options.order || 'date',
                    maxResults: options.maxResults || CONFIG.videosPerChannel,
                    ...options.additionalParams
                };
     
                if (options.publishedAfter) {
                    params.publishedAfter = options.publishedAfter.toISOString();
                }
                if (options.publishedBefore) {
                    params.publishedBefore = options.publishedBefore.toISOString();
                }
     
                try {
                    const data = await this.makeRequest(`${this.baseUrl}/search`, params);
                    // Normalize search results to match video format expected by other parts of the code
                    const items = data.items || [];
                    return items.map(item => ({
                        id: item.id?.videoId || item.id,
                        snippet: item.snippet
                    }));
                } catch (error) {
                    OptimizedUtils.log('Channel videos error:', error.message);
                    return [];
                }
            }
     
            async getVideoDetails(videoIds) {
                if (!Array.isArray(videoIds)) videoIds = [videoIds];
     
                const params = {
                    part: 'snippet,statistics',
                    id: videoIds.join(',')
                };
     
                try {
                    const data = await this.makeRequest(`${this.baseUrl}/videos`, params);
                    return data.items || [];
                } catch (error) {
                    OptimizedUtils.log('Video details error:', error.message);
                    return [];
                }
            }
     
            async getChannelDetails(channelId) {
                const params = {
                    part: 'snippet,statistics',
                    id: channelId
                };
     
                try {
                    const data = await this.makeRequest(`${this.baseUrl}/channels`, params);
                    return data.items?.[0] || null;
                } catch (error) {
                    OptimizedUtils.log('Channel details error:', error.message);
                    return null;
                }
            }
     
            async getViralVideos(timeframe) {
                const cacheKey = `viral_${timeframe.start}_${timeframe.end}`;
     
                if (this.viralVideoCache.has(cacheKey)) {
                    const cached = this.viralVideoCache.get(cacheKey);
                    if (Date.now() - cached.timestamp < CONFIG.cacheExpiry.videos) {
                        return cached.data;
                    }
                }
     
                try {
                    const params = {
                        part: 'snippet,statistics',
                        chart: 'mostPopular',
                        maxResults: CONFIG.viralVideosCount,
                        publishedAfter: timeframe.start.toISOString(),
                        publishedBefore: timeframe.end.toISOString()
                    };
     
                    const data = await this.makeRequest(`${this.baseUrl}/videos`, params);
                    const videos = data.items || [];
     
                    this.viralVideoCache.set(cacheKey, {
                        data: videos,
                        timestamp: Date.now()
                    });
     
                    return videos;
                } catch (error) {
                    OptimizedUtils.log('Viral videos error:', error.message);
                    return [];
                }
            }
     
            getKeyStats() {
                return {
                    totalKeys: this.keys.length,
                    currentKey: this.currentKeyIndex + 1,
                    stats: this.keyStats
                };
            }
     
            clearCache() {
                this.viralVideoCache.clear();
                OptimizedUtils.log('API cache cleared');
            }
        }
     
        // === PERSISTENT VIDEO CACHE ===
        class PersistentVideoCache {
            constructor() {
                this.prefix = 'wayback_video_cache_';
                this.indexKey = 'wayback_video_cache_index';
                this.loadIndex();
            }
     
            loadIndex() {
                this.index = GM_getValue(this.indexKey, {});
            }
     
            saveIndex() {
                GM_setValue(this.indexKey, this.index);
            }
     
            get(key) {
                const fullKey = this.prefix + key;
                const cached = GM_getValue(fullKey, null);
                
                if (!cached) {
                    OptimizedUtils.log(`Cache MISS: ${key}`);
                    return null;
                }
     
                try {
                    const data = typeof cached === 'string' ? JSON.parse(cached) : cached;
                    
                    // Check if cache has expired
                    if (data.expiry && Date.now() > data.expiry) {
                        OptimizedUtils.log(`Cache EXPIRED: ${key}`);
                        this.delete(key);
                        return null;
                    }
                    
                    OptimizedUtils.log(`Cache HIT: ${key} - ${data.value ? data.value.length : 0} videos`);
                    return data.value;
                } catch (e) {
                    OptimizedUtils.log('Cache parse error:', e);
                    this.delete(key);
                    return null;
                }
            }
     
            set(key, value, expiryMs = CONFIG.cacheExpiry.videos) {
                const fullKey = this.prefix + key;
                const data = {
                    value: value,
                    timestamp: Date.now(),
                    expiry: Date.now() + expiryMs
                };
                
                GM_setValue(fullKey, JSON.stringify(data));
                
                // Update index
                this.index[key] = {
                    timestamp: data.timestamp,
                    expiry: data.expiry,
                    size: value ? value.length : 0
                };
                this.saveIndex();
                
                OptimizedUtils.log(`Cache SET: ${key} - ${value ? value.length : 0} videos (expires in ${Math.round(expiryMs/1000/60)} minutes)`);
            }
     
            has(key) {
                return this.get(key) !== null;
            }
     
            delete(key) {
                const fullKey = this.prefix + key;
                GM_deleteValue(fullKey);
                delete this.index[key];
                this.saveIndex();
                OptimizedUtils.log(`Cache DELETE: ${key}`);
            }
     
            clear() {
                // Clear all cached entries
                Object.keys(this.index).forEach(key => {
                    const fullKey = this.prefix + key;
                    GM_deleteValue(fullKey);
                });
                
                // Clear index
                this.index = {};
                this.saveIndex();
                OptimizedUtils.log('Video cache CLEARED');
            }
     
            size() {
                return Object.keys(this.index).length;
            }
     
            // For debugging - show all cache entries
            debug() {
                console.log('=== Video Cache Debug ===');
                console.log(`Total entries: ${this.size()}`);
                Object.entries(this.index).forEach(([key, info]) => {
                    const remaining = info.expiry - Date.now();
                    const minutes = Math.round(remaining / 1000 / 60);
                    console.log(`${key}: ${info.size} videos, expires in ${minutes} minutes`);
                });
            }
        }
     
        // === OPTIMIZED CACHE MANAGER ===
        class OptimizedCacheManager {
            constructor() {
                this.prefix = 'ytCache_';
                this.memoryCache = new Map();
                this.maxMemoryCacheSize = 1000;
                this.cacheHitCount = 0;
                this.cacheMissCount = 0;
            }
     
            generateKey(type, ...params) {
                return `${this.prefix}${type}_${params.join('_')}`;
            }
     
            set(type, data, expiry = CONFIG.cacheExpiry.videos, ...params) {
                const key = this.generateKey(type, ...params);
                const cacheData = {
                    data,
                    timestamp: Date.now(),
                    expiry
                };
     
                // Store in memory cache with size limit
                if (this.memoryCache.size >= this.maxMemoryCacheSize) {
                    const firstKey = this.memoryCache.keys().next().value;
                    this.memoryCache.delete(firstKey);
                }
     
                this.memoryCache.set(key, cacheData);
     
                // Store in GM storage for persistence
                try {
                    GM_setValue(key, JSON.stringify(cacheData));
                } catch (error) {
                    OptimizedUtils.log('Cache set error:', error.message);
                }
            }
     
            get(type, ...params) {
                const key = this.generateKey(type, ...params);
     
                // Check memory cache first
                if (this.memoryCache.has(key)) {
                    const cached = this.memoryCache.get(key);
                    if (Date.now() - cached.timestamp < cached.expiry) {
                        this.cacheHitCount++;
                        return cached.data;
                    } else {
                        this.memoryCache.delete(key);
                    }
                }
     
                // Check GM storage
                try {
                    const cached = GM_getValue(key);
                    if (cached) {
                        const parsedCache = JSON.parse(cached);
                        if (Date.now() - parsedCache.timestamp < parsedCache.expiry) {
                            // Add back to memory cache
                            this.memoryCache.set(key, parsedCache);
                            this.cacheHitCount++;
                            return parsedCache.data;
                        } else {
                            GM_deleteValue(key);
                        }
                    }
                } catch (error) {
                    OptimizedUtils.log('Cache get error:', error.message);
                }
     
                this.cacheMissCount++;
                return null;
            }
     
            delete(type, ...params) {
                const key = this.generateKey(type, ...params);
                this.memoryCache.delete(key);
                try {
                    GM_deleteValue(key);
                } catch (error) {
                    OptimizedUtils.log('Cache delete error:', error.message);
                }
            }
     
            clear(pattern = null) {
                if (!pattern) {
                    this.memoryCache.clear();
                    try {
                        const keys = GM_listValues().filter(key => key.startsWith(this.prefix));
                        keys.forEach(key => GM_deleteValue(key));
                        OptimizedUtils.log('All cache cleared');
                    } catch (error) {
                        OptimizedUtils.log('Cache clear error:', error.message);
                    }
                    return;
                }
     
                // Clear by pattern
                const keysToDelete = [];
                for (const [key] of this.memoryCache) {
                    if (key.includes(pattern)) {
                        keysToDelete.push(key);
                    }
                }
     
                keysToDelete.forEach(key => {
                    this.memoryCache.delete(key);
                    try {
                        GM_deleteValue(key);
                    } catch (error) {
                        OptimizedUtils.log('Cache pattern delete error:', error.message);
                    }
                });
     
                OptimizedUtils.log(`Cache cleared for pattern: ${pattern}`);
            }
     
            getStats() {
                const hitRate = this.cacheHitCount + this.cacheMissCount > 0 
                    ? (this.cacheHitCount / (this.cacheHitCount + this.cacheMissCount) * 100).toFixed(2)
                    : 0;
     
                return {
                    memorySize: this.memoryCache.size,
                    hitRate: `${hitRate}%`,
                    hits: this.cacheHitCount,
                    misses: this.cacheMissCount
                };
            }
     
            cleanup() {
                const now = Date.now();
                const expiredKeys = [];
     
                for (const [key, cached] of this.memoryCache) {
                    if (now - cached.timestamp >= cached.expiry) {
                        expiredKeys.push(key);
                    }
                }
     
                expiredKeys.forEach(key => {
                    this.memoryCache.delete(key);
                    try {
                        GM_deleteValue(key);
                    } catch (error) {
                        OptimizedUtils.log('Cache cleanup error:', error.message);
                    }
                });
     
                if (expiredKeys.length > 0) {
                    OptimizedUtils.log(`Cleaned up ${expiredKeys.length} expired cache entries`);
                }
            }
        }
     
        // === OPTIMIZED VIDEO MANAGER ===
        class OptimizedVideoManager {
            constructor(apiManager, cacheManager) {
                this.api = apiManager;
                this.cache = cacheManager;
                this.currentTimeframe = this.getCurrentTimeframe();
                this.processingQueue = [];
                this.isProcessing = false;
                this.videoPool = new Map();
                this.channelVideoCache = new Map();
            }
     
            getCurrentTimeframe() {
                const selectedDate = GM_getValue('ytSelectedDate', this.getDefaultDate());
                const date = OptimizedUtils.parseDate(selectedDate);
     
                return {
                    start: new Date(date.getFullYear(), date.getMonth(), 1),
                    end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
                    selectedDate: date
                };
            }
     
            getDefaultDate() {
                const now = new Date();
                return OptimizedUtils.formatDate(new Date(now.getFullYear() - 10, now.getMonth(), now.getDate()));
            }
     
            setTimeframe(dateStr) {
                const date = OptimizedUtils.parseDate(dateStr);
                if (!date) return false;
     
                this.currentTimeframe = {
                    start: new Date(date.getFullYear(), date.getMonth(), 1),
                    end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
                    selectedDate: date
                };
     
                GM_setValue('ytSelectedDate', OptimizedUtils.formatDate(date));
                OptimizedUtils.log(`Timeframe set to: ${OptimizedUtils.formatDate(date)}`);
                return true;
            }
     
            async getVideosForChannel(channelId, count = CONFIG.videosPerChannel) {
                const cacheKey = `channel_${channelId}_${this.currentTimeframe.start.getTime()}`;
     
                // Check cache first
                let videos = this.cache.get('channelVideos', cacheKey);
                if (videos) {
                    return OptimizedUtils.shuffleArray(videos).slice(0, count);
                }
     
                // Check memory pool
                if (this.channelVideoCache.has(channelId)) {
                    const cached = this.channelVideoCache.get(channelId);
                    if (Date.now() - cached.timestamp < CONFIG.cacheExpiry.channelVideos) {
                        return OptimizedUtils.shuffleArray(cached.videos).slice(0, count);
                    }
                }
     
                try {
                    videos = await this.api.getChannelVideos(channelId, {
                        publishedAfter: this.currentTimeframe.start,
                        publishedBefore: this.currentTimeframe.end,
                        maxResults: count * 2, // Get more for better randomization
                        order: 'relevance'
                    });
     
                    if (videos.length > 0) {
                        this.cache.set('channelVideos', videos, CONFIG.cacheExpiry.channelVideos, cacheKey);
                        this.channelVideoCache.set(channelId, {
                            videos,
                            timestamp: Date.now()
                        });
                    }
     
                    return OptimizedUtils.shuffleArray(videos).slice(0, count);
                } catch (error) {
                    OptimizedUtils.log(`Error getting videos for channel ${channelId}:`, error.message);
                    return [];
                }
            }
     
            async getHomepageVideos(count = CONFIG.maxHomepageVideos) {
                const cacheKey = `homepage_${this.currentTimeframe.selectedDate.getTime()}`;
     
                // Check cache
                let videos = this.cache.get('homepage', cacheKey);
                if (videos && videos.length >= count) {
                    return OptimizedUtils.shuffleArray(videos).slice(0, count);
                }
     
                try {
                    // Combine multiple search strategies
                    const searchTerms = [
                        '', // General popular videos
                        'music', 'gaming', 'sports', 'news', 'entertainment',
                        'tutorial', 'review', 'funny', 'technology', 'science'
                    ];
     
                    const videoBatches = await Promise.allSettled(
                        searchTerms.slice(0, 5).map(term => 
                            this.api.searchVideos(term, {
                                publishedAfter: this.currentTimeframe.start,
                                publishedBefore: this.currentTimeframe.end,
                                order: 'relevance',
                                maxResults: Math.ceil(count / 5)
                            })
                        )
                    );
     
                    videos = videoBatches
                        .filter(result => result.status === 'fulfilled')
                        .flatMap(result => result.value)
                        .filter(video => this.isValidVideo(video));
     
                    // Add some viral videos for the period
                    const viralVideos = await this.api.getViralVideos(this.currentTimeframe);
                    const viralCount = Math.floor(count * CONFIG.viralVideoPercentage);
                    videos = videos.concat(viralVideos.slice(0, viralCount));
     
                    // Remove duplicates and cache
                    videos = this.removeDuplicateVideos(videos);
     
                    if (videos.length > 0) {
                        this.cache.set('homepage', videos, CONFIG.cacheExpiry.videos, cacheKey);
                    }
     
                    return OptimizedUtils.shuffleArray(videos).slice(0, count);
                } catch (error) {
                    OptimizedUtils.log('Error getting homepage videos:', error.message);
                    return [];
                }
            }
     
            async getRecommendationVideos(currentVideoId, count = CONFIG.RECOMMENDATION_COUNT) {
                const cacheKey = `recommendations_${currentVideoId}_${this.currentTimeframe.selectedDate.getTime()}`;
     
                // Check cache
                let videos = this.cache.get('recommendations', cacheKey);
                if (videos && videos.length >= count) {
                    return OptimizedUtils.shuffleArray(videos).slice(0, count);
                }
     
                try {
                    const currentVideo = (await this.api.getVideoDetails([currentVideoId]))[0];
                    if (!currentVideo) return [];
     
                    const channelId = currentVideo.snippet.channelId;
                    const title = currentVideo.snippet.title;
                    const keywords = OptimizedUtils.extractKeywords(title);
     
                    // Get videos from same channel
                    const sameChannelCount = Math.floor(count * CONFIG.SAME_CHANNEL_RATIO);
                    const sameChannelVideos = await this.getVideosForChannel(channelId, sameChannelCount);
     
                    // Get videos from other channels using keywords
                    const otherChannelCount = count - sameChannelCount;
                    const keywordVideos = await this.getKeywordBasedVideos(keywords, otherChannelCount, channelId);
     
                    videos = [...sameChannelVideos, ...keywordVideos];
                    videos = this.removeDuplicateVideos(videos);
     
                    if (videos.length > 0) {
                        this.cache.set('recommendations', videos, CONFIG.cacheExpiry.videos, cacheKey);
                    }
     
                    return OptimizedUtils.shuffleArray(videos).slice(0, count);
                } catch (error) {
                    OptimizedUtils.log('Error getting recommendation videos:', error.message);
                    return [];
                }
            }
     
            async getKeywordBasedVideos(keywords, count, excludeChannelId = null) {
                if (!keywords.length) return [];
     
                const searchPromises = keywords.slice(0, 3).map(keyword =>
                    this.api.searchVideos(keyword, {
                        publishedAfter: this.currentTimeframe.start,
                        publishedBefore: this.currentTimeframe.end,
                        maxResults: Math.ceil(count / 3),
                        order: 'relevance'
                    })
                );
     
                try {
                    const results = await Promise.allSettled(searchPromises);
                    let videos = results
                        .filter(result => result.status === 'fulfilled')
                        .flatMap(result => result.value)
                        .filter(video => this.isValidVideo(video));
     
                    if (excludeChannelId) {
                        videos = videos.filter(video => video.snippet.channelId !== excludeChannelId);
                    }
     
                    return this.removeDuplicateVideos(videos).slice(0, count);
                } catch (error) {
                    OptimizedUtils.log('Error getting keyword-based videos:', error.message);
                    return [];
                }
            }
     
            async getChannelPageVideos(channelId, count = CONFIG.channelPageVideosPerMonth) {
                const cacheKey = `channelPage_${channelId}_${this.currentTimeframe.selectedDate.getTime()}`;
     
                let videos = this.cache.get('channelPage', cacheKey);
                if (videos && videos.length >= count) {
                    return videos.slice(0, count);
                }
     
                try {
                    videos = await this.api.getChannelVideos(channelId, {
                        publishedAfter: this.currentTimeframe.start,
                        publishedBefore: this.currentTimeframe.end,
                        maxResults: count,
                        order: 'date'
                    });
     
                    videos = videos.filter(video => this.isValidVideo(video));
     
                    if (videos.length > 0) {
                        this.cache.set('channelPage', videos, CONFIG.cacheExpiry.channelVideos, cacheKey);
                    }
     
                    return videos;
                } catch (error) {
                    OptimizedUtils.log(`Error getting channel page videos for ${channelId}:`, error.message);
                    return [];
                }
            }
     
            async searchVideos(query, count = 50) {
                const cacheKey = `search_${query}_${this.currentTimeframe.selectedDate.getTime()}`;
     
                let videos = this.cache.get('search', cacheKey);
                if (videos && videos.length >= count) {
                    return videos.slice(0, count);
                }
     
                try {
                    videos = await this.api.searchVideos(query, {
                        publishedAfter: this.currentTimeframe.start,
                        publishedBefore: this.currentTimeframe.end,
                        maxResults: count,
                        order: 'relevance'
                    });
     
                    videos = videos.filter(video => this.isValidVideo(video));
     
                    if (videos.length > 0) {
                        this.cache.set('search', videos, CONFIG.cacheExpiry.searchResults, cacheKey);
                    }
     
                    return videos;
                } catch (error) {
                    OptimizedUtils.log(`Error searching videos for "${query}":`, error.message);
                    return [];
                }
            }
     
            isValidVideo(video) {
                if (!video || !video.snippet) return false;
     
                const publishedAt = new Date(video.snippet.publishedAt);
     
                // Check if video is within timeframe
                if (publishedAt < this.currentTimeframe.start || publishedAt > this.currentTimeframe.end) {
                    return false;
                }
     
                return true;
            }
     
            removeDuplicateVideos(videos) {
                const seen = new Set();
                return videos.filter(video => {
                    const id = video.id?.videoId || video.id;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
            }
     
            addToProcessingQueue(task) {
                this.processingQueue.push(task);
                if (!this.isProcessing) {
                    this.processQueue();
                }
            }
     
            async processQueue() {
                if (this.processingQueue.length === 0) {
                    this.isProcessing = false;
                    return;
                }
     
                this.isProcessing = true;
     
                const batch = this.processingQueue.splice(0, CONFIG.batchSize);
                const promises = batch.map(task => this.executeTask(task));
     
                try {
                    await Promise.allSettled(promises);
                    await OptimizedUtils.sleep(CONFIG.apiCooldown);
                    this.processQueue(); // Process next batch
                } catch (error) {
                    OptimizedUtils.log('Queue processing error:', error.message);
                    this.isProcessing = false;
                }
            }
     
            async executeTask(task) {
                try {
                    const result = await task.execute();
                    if (task.callback) {
                        task.callback(result);
                    }
                    return result;
                } catch (error) {
                    OptimizedUtils.log('Task execution error:', error.message);
                    if (task.errorCallback) {
                        task.errorCallback(error);
                    }
                    throw error;
                }
            }
     
            clearCache() {
                this.cache.clear('homepage');
                this.cache.clear('channelPage');
                this.cache.clear('recommendations');
                this.cache.clear('search');
                this.channelVideoCache.clear();
                this.videoPool.clear();
                OptimizedUtils.log('Video manager cache cleared');
            }
     
            getStats() {
                return {
                    currentTimeframe: this.currentTimeframe,
                    queueSize: this.processingQueue.length,
                    isProcessing: this.isProcessing,
                    videoPoolSize: this.videoPool.size,
                    channelCacheSize: this.channelVideoCache.size
                };
            }
        }
     
        // === OPTIMIZED UI MANAGER ===
        class OptimizedUIManager {
            constructor(videoManager, apiManager, cacheManager) {
                this.videoManager = videoManager;
                this.apiManager = apiManager;
                this.cacheManager = cacheManager;
                this.elements = new Map();
                this.observers = new Map();
                this.eventListeners = new Map();
                this.isInitialized = false;
                this.cssInjected = false;
            }
     
            async init() {
                if (this.isInitialized) return;
     
                await this.waitForPageLoad();
                this.injectStyles();
                this.createMainInterface();
                this.setupEventListeners();
                this.startObservers();
     
                this.isInitialized = true;
                OptimizedUtils.log('UI Manager initialized');
            }
     
            async waitForPageLoad() {
                await OptimizedUtils.waitFor(() => document.body && document.head, 10000);
                await OptimizedUtils.sleep(100); // Small delay for page stabilization
            }
     
            injectStyles() {
                if (this.cssInjected) return;
     
                const styles = `
                    /* WayBackTube Optimized Styles */
                    #wayback-interface {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 10000;
                        background: rgba(0, 0, 0, 0.9);
                        border-radius: 8px;
                        padding: 15px;
                        color: white;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                        font-size: 14px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        min-width: 280px;
                        transition: all 0.3s ease;
                    }
     
                    #wayback-interface.minimized {
                        padding: 10px;
                        min-width: auto;
                    }
     
                    #wayback-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                        padding-bottom: 10px;
                    }
     
                    #wayback-title {
                        font-weight: bold;
                        font-size: 16px;
                        color: #ff6b6b;
                    }
     
                    .wayback-controls {
                        display: grid;
                        grid-template-columns: 1fr auto;
                        gap: 10px;
                        align-items: center;
                        margin-bottom: 10px;
                    }
     
                    .wayback-input {
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        border-radius: 4px;
                        padding: 8px;
                        color: white;
                        font-size: 13px;
                        transition: all 0.2s ease;
                    }
     
                    .wayback-input:focus {
                        outline: none;
                        border-color: #ff6b6b;
                        background: rgba(255, 255, 255, 0.15);
                    }
     
                    .wayback-button {
                        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                        border: none;
                        border-radius: 4px;
                        color: white;
                        padding: 8px 12px;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-weight: 500;
                    }
     
                    .wayback-button:hover {
                        background: linear-gradient(135deg, #ee5a52, #dd4a41);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
                    }
     
                    .wayback-button:active {
                        transform: translateY(0);
                    }
     
                    .wayback-button.small {
                        padding: 6px 10px;
                        font-size: 11px;
                    }
     
                    .wayback-stats {
                        margin-top: 15px;
                        padding-top: 10px;
                        border-top: 1px solid rgba(255, 255, 255, 0.2);
                        font-size: 11px;
                        line-height: 1.4;
                    }
     
                    .wayback-stat-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 4px;
                    }
     
                    .wayback-status {
                        display: inline-block;
                        padding: 2px 6px;
                        border-radius: 10px;
                        font-size: 10px;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
     
                    .wayback-status.active {
                        background: rgba(76, 175, 80, 0.3);
                        color: #4CAF50;
                    }
     
                    .wayback-status.loading {
                        background: rgba(255, 193, 7, 0.3);
                        color: #FFC107;
                    }
     
                    .wayback-status.error {
                        background: rgba(244, 67, 54, 0.3);
                        color: #F44336;
                    }
     
                    .wayback-hidden {
                        display: none !important;
                    }
     
                    .wayback-loading {
                        opacity: 0.7;
                        position: relative;
                    }
     
                    .wayback-loading::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                        animation: wayback-shimmer 1.5s infinite;
                    }
     
                    @keyframes wayback-shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
     
                    /* Hide modern YouTube elements */
                    ${CONFIG.SHORTS_SELECTORS.map(selector => `${selector}`).join(', ')} {
                        display: none !important;
                    }
     
                    ${CONFIG.CHANNEL_PAGE_SELECTORS.map(selector => `${selector}`).join(', ')} {
                        visibility: hidden !important;
                        height: 0 !important;
                        overflow: hidden !important;
                    }
     
                    /* Modern content warning */
                    .wayback-warning {
                        background: rgba(255, 152, 0, 0.1);
                        border: 1px solid rgba(255, 152, 0, 0.3);
                        border-radius: 4px;
                        padding: 8px;
                        margin-top: 10px;
                        font-size: 11px;
                        color: #FF9800;
                    }
     
                    /* New sections styles */
                    .wayback-section {
                        margin-top: 15px;
                        padding-top: 15px;
                        border-top: 1px solid rgba(255, 255, 255, 0.2);
                    }
     
                    .wayback-section-header {
                        margin-bottom: 10px;
                    }
     
                    .wayback-section-header h4 {
                        margin: 0 0 4px 0;
                        font-size: 14px;
                        color: #ff6b6b;
                        font-weight: bold;
                    }
     
                    .wayback-section-desc {
                        font-size: 11px;
                        color: rgba(255, 255, 255, 0.7);
                        line-height: 1.3;
                    }
     
                    .wayback-list {
                        max-height: 120px;
                        overflow-y: auto;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 4px;
                        margin: 8px 0;
                        padding: 4px;
                    }
     
                    .wayback-list::-webkit-scrollbar {
                        width: 6px;
                    }
     
                    .wayback-list::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 3px;
                    }
     
                    .wayback-list::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 3px;
                    }
     
                    .wayback-list-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 6px 8px;
                        margin: 2px 0;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 3px;
                        font-size: 12px;
                    }
     
                    .wayback-list-item:hover {
                        background: rgba(255, 255, 255, 0.1);
                    }
     
                    .wayback-item-text {
                        flex: 1;
                        color: white;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        margin-right: 8px;
                    }
     
                    .wayback-remove-btn {
                        background: rgba(244, 67, 54, 0.8);
                        border: none;
                        border-radius: 50%;
                        color: white;
                        width: 20px;
                        height: 20px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    }
     
                    .wayback-remove-btn:hover {
                        background: rgba(244, 67, 54, 1);
                        transform: scale(1.1);
                    }
     
                    .wayback-button.secondary {
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        color: rgba(255, 255, 255, 0.9);
                    }
     
                    .wayback-button.secondary:hover {
                        background: rgba(255, 255, 255, 0.2);
                        border-color: rgba(255, 255, 255, 0.5);
                        transform: translateY(-1px);
                    }
     
                    /* Responsive design */
                    @media (max-width: 768px) {
                        #wayback-interface {
                            position: fixed;
                            top: auto;
                            bottom: 20px;
                            right: 20px;
                            left: 20px;
                            min-width: auto;
                        }
                    }
                `;
     
                // Simple 2011 Theme: Blue text + Square corners
                const vintage2011CSS = `
                    /* Simple 2011 Theme - VERY VISIBLE TEST */
                    body.wayback-2011-theme {
                        /* Blue text for all links and video titles */
                        --yt-spec-text-primary: #0066cc !important;
                        --yt-spec-text-secondary: #0066cc !important;
                        /* Normal background - remove testing colors */
                    }
     
                    /* Video titles - blue text with more specific selectors */
                    body.wayback-2011-theme h3 a,
                    body.wayback-2011-theme #video-title,
                    body.wayback-2011-theme ytd-video-renderer h3 a,
                    body.wayback-2011-theme .ytd-video-renderer h3 a,
                    body.wayback-2011-theme a[id="video-title-link"],
                    body.wayback-2011-theme ytd-video-primary-info-renderer h1 a {
                        color: #0066cc !important;
                    }
     
                    /* Channel names - blue text */
                    body.wayback-2011-theme ytd-channel-name a,
                    body.wayback-2011-theme .ytd-channel-name a,
                    body.wayback-2011-theme #channel-name a,
                    body.wayback-2011-theme .ytd-video-secondary-info-renderer a {
                        color: #0066cc !important;
                    }
     
                    /* All links should be blue */
                    body.wayback-2011-theme a {
                        color: #0066cc !important;
                    }
     
                    /* Remove ALL rounded corners - make everything square */
                    body.wayback-2011-theme *,
                    body.wayback-2011-theme *:before,
                    body.wayback-2011-theme *:after {
                        border-radius: 0 !important;
                        -webkit-border-radius: 0 !important;
                        -moz-border-radius: 0 !important;
                    }
     
                    /* Square thumbnails */
                    body.wayback-2011-theme ytd-thumbnail img,
                    body.wayback-2011-theme .ytd-thumbnail img,
                    body.wayback-2011-theme img {
                        border-radius: 0 !important;
                    }
     
                    /* Square buttons */
                    body.wayback-2011-theme button,
                    body.wayback-2011-theme .yt-spec-button-shape-next,
                    body.wayback-2011-theme .yt-spec-button-shape-next__button {
                        border-radius: 0 !important;
                    }
     
                    /* Square search box */
                    body.wayback-2011-theme input,
                    body.wayback-2011-theme #search-form,
                    body.wayback-2011-theme ytd-searchbox,
                    body.wayback-2011-theme #search-form input {
                        border-radius: 0 !important;
                    }
     
                    /* Square video containers */
                    body.wayback-2011-theme ytd-video-renderer,
                    body.wayback-2011-theme ytd-rich-item-renderer,
                    body.wayback-2011-theme .ytd-video-renderer,
                    body.wayback-2011-theme .ytd-rich-item-renderer {
                        border-radius: 0 !important;
                    }
     
                    /* Remove ALL modern animations and hover effects */
                    body.wayback-2011-theme *,
                    body.wayback-2011-theme *:before,
                    body.wayback-2011-theme *:after {
                        transition: none !important;
                        animation: none !important;
                        transform: none !important;
                        -webkit-transition: none !important;
                        -webkit-animation: none !important;
                        -webkit-transform: none !important;
                        -moz-transition: none !important;
                        -moz-animation: none !important;
                        -moz-transform: none !important;
                    }
     
                    /* Disable hover animations on video thumbnails and containers */
                    body.wayback-2011-theme ytd-video-renderer:hover,
                    body.wayback-2011-theme ytd-rich-item-renderer:hover,
                    body.wayback-2011-theme .ytd-video-renderer:hover,
                    body.wayback-2011-theme .ytd-rich-item-renderer:hover {
                        transform: none !important;
                        box-shadow: none !important;
                        transition: none !important;
                    }
     
                    /* Disable thumbnail hover effects */
                    body.wayback-2011-theme ytd-thumbnail:hover,
                    body.wayback-2011-theme .ytd-thumbnail:hover {
                        transform: none !important;
                        transition: none !important;
                    }
     
                    /* Disable button hover animations */
                    body.wayback-2011-theme button:hover,
                    body.wayback-2011-theme .yt-spec-button-shape-next:hover {
                        transform: none !important;
                        transition: none !important;
                    }
     
                    /* Remove elevation/shadow effects */
                    body.wayback-2011-theme * {
                        box-shadow: none !important;
                        filter: none !important;
                        backdrop-filter: none !important;
                    }
                `;
     
                // Inject styles into page head for better CSS priority
                const styleElement = document.createElement('style');
                styleElement.textContent = styles + '\n' + vintage2011CSS;
                document.head.appendChild(styleElement);
                
                // Also use GM_addStyle as backup
                GM_addStyle(styles);
                GM_addStyle(vintage2011CSS);
                
                this.cssInjected = true;
                OptimizedUtils.log('Styles injected successfully (including 2011 vintage theme)');
            }
     
            createMainInterface() {
                if (this.elements.has('main')) return;
     
                const mainDiv = document.createElement('div');
                mainDiv.id = 'wayback-interface';
     
                const selectedDate = GM_getValue('ytSelectedDate', this.videoManager.getDefaultDate());
                const isActive = GM_getValue('ytActive', false);
     
                mainDiv.innerHTML = `
                    <div id="wayback-header">
                        <div id="wayback-title">⏰ WayBackTube</div>
                        <button id="wayback-minimize" class="wayback-button small">–</button>
                    </div>
                    <div id="wayback-content">
                        <div class="wayback-controls">
                            <input type="date" id="wayback-date-input" class="wayback-input" value="${selectedDate}">
                            <button id="wayback-toggle" class="wayback-button">${isActive ? 'Disable' : 'Enable'}</button>
                        </div>
     
                        <div class="wayback-controls">
                            <button id="wayback-refresh" class="wayback-button">🔄 Refresh</button>
                            <button id="wayback-advance-date" class="wayback-button">📅 Advance Date</button>
                            <button id="wayback-vintage-toggle" class="wayback-button wayback-vintage-toggle">🕰️ 2011 Theme</button>
                            <button id="wayback-settings" class="wayback-button">⚙️</button>
                        </div>
     
                        <div id="wayback-stats" class="wayback-stats">
                            <div class="wayback-stat-row">
                                <span>Status:</span>
                                <span class="wayback-status ${isActive ? 'active' : 'error'}" id="wayback-status">
                                    ${isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div class="wayback-stat-row">
                                <span>Date:</span>
                                <span id="wayback-current-date">${selectedDate}</span>
                            </div>
                            <div class="wayback-stat-row">
                                <span>Page:</span>
                                <span id="wayback-current-page">${OptimizedUtils.getCurrentPage()}</span>
                            </div>
                            <div class="wayback-stat-row">
                                <span>Clock:</span>
                                <span id="wayback-clock-display" style="font-family: monospace; color: #00ff00;">
                                    ${GM_getValue('ytTestClockEnabled', false) ? 'Day 0, 00:00:00' : 'Not running'}
                                </span>
                            </div>
                        </div>
     
                        <div id="wayback-api-section" style="display: none;">
                            <div class="wayback-controls">
                                <input type="password" id="wayback-api-key" class="wayback-input" placeholder="Enter YouTube API Key">
                                <button id="wayback-add-key" class="wayback-button">Add</button>
                            </div>
                            <div class="wayback-controls">
                                <button id="wayback-test-keys" class="wayback-button" style="width: 100%;">Test All API Keys</button>
                            </div>
                            <div id="wayback-key-stats"></div>
                        </div>
     
                        <!-- Subscriptions Management Section -->
                        <div class="wayback-section">
                            <div class="wayback-section-header">
                                <h4>📺 Channel Subscriptions</h4>
                                <span class="wayback-section-desc">Add channel names to load videos from</span>
                            </div>
                            <div class="wayback-controls">
                                <input type="text" id="wayback-subscription-input" class="wayback-input" placeholder="Enter channel name..." maxlength="50">
                                <button id="wayback-add-subscription" class="wayback-button">Add</button>
                            </div>
                            <div id="wayback-subscriptions-list" class="wayback-list">
                                <!-- Subscriptions will be populated here -->
                            </div>
                            <div class="wayback-controls">
                                <button id="wayback-clear-subscriptions" class="wayback-button secondary">Clear All</button>
                                <button id="wayback-load-homepage" class="wayback-button">Load Videos</button>
                            </div>
                        </div>
     
                        <!-- Search Terms Management Section -->
                        <div class="wayback-section">
                            <div class="wayback-section-header">
                                <h4>🔍 Search Terms</h4>
                                <span class="wayback-section-desc">Add search terms to discover content (memes, gaming, etc.)</span>
                            </div>
                            <div class="wayback-controls">
                                <input type="text" id="wayback-search-term-input" class="wayback-input" placeholder="Enter search term..." maxlength="50">
                                <button id="wayback-add-search-term" class="wayback-button">Add</button>
                            </div>
                            <div id="wayback-search-terms-list" class="wayback-list">
                                <!-- Search terms will be populated here -->
                            </div>
                            <div class="wayback-controls">
                                <button id="wayback-clear-search-terms" class="wayback-button secondary">Clear All</button>
                                <button id="wayback-load-search-videos" class="wayback-button">Load Videos</button>
                            </div>
                        </div>
                    </div>
                `;
     
                document.body.appendChild(mainDiv);
                this.elements.set('main', mainDiv);
     
                // Setup element references
                this.elements.set('dateInput', OptimizedUtils.$('#wayback-date-input'));
                this.elements.set('toggleButton', OptimizedUtils.$('#wayback-toggle'));
                this.elements.set('refreshButton', OptimizedUtils.$('#wayback-refresh'));
                this.elements.set('advanceDateButton', OptimizedUtils.$('#wayback-advance-date'));
                this.elements.set('vintageToggleButton', OptimizedUtils.$('#wayback-vintage-toggle'));
                this.elements.set('settingsButton', OptimizedUtils.$('#wayback-settings'));
                this.elements.set('minimizeButton', OptimizedUtils.$('#wayback-minimize'));
                this.elements.set('statusElement', OptimizedUtils.$('#wayback-status'));
                this.elements.set('currentDate', OptimizedUtils.$('#wayback-current-date'));
                this.elements.set('currentPage', OptimizedUtils.$('#wayback-current-page'));
                this.elements.set('apiSection', OptimizedUtils.$('#wayback-api-section'));
                this.elements.set('apiKeyInput', OptimizedUtils.$('#wayback-api-key'));
                this.elements.set('addKeyButton', OptimizedUtils.$('#wayback-add-key'));
                this.elements.set('testKeysButton', OptimizedUtils.$('#wayback-test-keys'));
                this.elements.set('keyStatsDiv', OptimizedUtils.$('#wayback-key-stats'));
     
                // Subscription management elements
                this.elements.set('subscriptionInput', OptimizedUtils.$('#wayback-subscription-input'));
                this.elements.set('addSubscriptionButton', OptimizedUtils.$('#wayback-add-subscription'));
                this.elements.set('subscriptionsList', OptimizedUtils.$('#wayback-subscriptions-list'));
                this.elements.set('clearSubscriptionsButton', OptimizedUtils.$('#wayback-clear-subscriptions'));
                this.elements.set('loadHomepageButton', OptimizedUtils.$('#wayback-load-homepage'));
     
                // Search terms management elements
                this.elements.set('searchTermInput', OptimizedUtils.$('#wayback-search-term-input'));
                this.elements.set('addSearchTermButton', OptimizedUtils.$('#wayback-add-search-term'));
                this.elements.set('searchTermsList', OptimizedUtils.$('#wayback-search-terms-list'));
                this.elements.set('clearSearchTermsButton', OptimizedUtils.$('#wayback-clear-search-terms'));
                this.elements.set('loadSearchVideosButton', OptimizedUtils.$('#wayback-load-search-videos'));
     
                // Initialize the UI with existing data
                this.initializeUI();
     
                OptimizedUtils.log('Main interface created');
            }
     
            setupEventListeners() {
                const throttledRefresh = OptimizedUtils.throttle(() => this.handleRefresh(), 1000);
                const debouncedDateChange = OptimizedUtils.debounce((date) => this.handleDateChange(date), 500);
     
                // Main controls
                this.addEventListenerSafe('dateInput', 'change', (e) => {
                    debouncedDateChange(e.target.value);
                });
     
                this.addEventListenerSafe('toggleButton', 'click', () => this.handleToggle());
                this.addEventListenerSafe('refreshButton', 'click', throttledRefresh);
                this.addEventListenerSafe('advanceDateButton', 'click', () => this.handleAdvanceDate());
                this.addEventListenerSafe('vintageToggleButton', 'click', () => this.handleVintageToggle());
                this.addEventListenerSafe('settingsButton', 'click', () => this.toggleApiSection());
                this.addEventListenerSafe('minimizeButton', 'click', () => this.toggleMinimize());
     
                // API management
                this.addEventListenerSafe('addKeyButton', 'click', () => this.handleAddApiKey());
                this.addEventListenerSafe('testKeysButton', 'click', () => this.handleTestApiKeys());
                this.addEventListenerSafe('apiKeyInput', 'keypress', (e) => {
                    if (e.key === 'Enter') this.handleAddApiKey();
                });
     
                // Subscription management
                this.addEventListenerSafe('addSubscriptionButton', 'click', () => this.handleAddSubscription());
                this.addEventListenerSafe('subscriptionInput', 'keypress', (e) => {
                    if (e.key === 'Enter') this.handleAddSubscription();
                });
                this.addEventListenerSafe('clearSubscriptionsButton', 'click', () => this.handleClearSubscriptions());
                this.addEventListenerSafe('loadHomepageButton', 'click', () => this.handleLoadHomepage());
     
                // Search terms management
                this.addEventListenerSafe('addSearchTermButton', 'click', () => this.handleAddSearchTerm());
                this.addEventListenerSafe('searchTermInput', 'keypress', (e) => {
                    if (e.key === 'Enter') this.handleAddSearchTerm();
                });
                this.addEventListenerSafe('clearSearchTermsButton', 'click', () => this.handleClearSearchTerms());
                this.addEventListenerSafe('loadSearchVideosButton', 'click', () => this.handleLoadSearchVideos());
     
                // Event delegation for remove buttons
                this.elements.get('main').addEventListener('click', (e) => {
                    if (e.target.classList.contains('wayback-remove-btn')) {
                        if (e.target.dataset.subscription) {
                            this.handleRemoveSubscription(e.target.dataset.subscription);
                        } else if (e.target.dataset.searchTerm) {
                            this.handleRemoveSearchTerm(e.target.dataset.searchTerm);
                        }
                    }
                });
     
                // URL change detection
                let lastUrl = location.href;
                const urlObserver = new MutationObserver(() => {
                    if (location.href !== lastUrl) {
                        lastUrl = location.href;
                        this.handleUrlChange();
                    }
                });
     
                urlObserver.observe(document, { subtree: true, childList: true });
                this.observers.set('url', urlObserver);
     
                OptimizedUtils.log('Event listeners setup complete');
            }
     
            addEventListenerSafe(elementKey, event, handler) {
                const element = this.elements.get(elementKey);
                if (element) {
                    element.addEventListener(event, handler);
     
                    // Store for cleanup
                    const key = `${elementKey}_${event}`;
                    if (!this.eventListeners.has(key)) {
                        this.eventListeners.set(key, []);
                    }
                    this.eventListeners.get(key).push({ element, event, handler });
                }
            }
     
            handleDateChange(dateStr) {
                if (this.videoManager.setTimeframe(dateStr)) {
                    this.updateInterface();
                    this.handleRefresh();
                    OptimizedUtils.log(`Date changed to: ${dateStr}`);
                }
            }
     
            handleToggle() {
                const isActive = GM_getValue('ytActive', false);
                const newState = !isActive;
     
                GM_setValue('ytActive', newState);
                this.updateInterface();
     
                if (newState) {
                    this.handleRefresh();
                }
     
                OptimizedUtils.log(`WayBackTube ${newState ? 'enabled' : 'disabled'}`);
            }
     
            async handleRefresh() {
                if (!GM_getValue('ytActive', false)) return;
     
                this.setLoadingState(true);
     
                try {
                    // Clear caches
                    this.videoManager.clearCache();
                    this.cacheManager.cleanup();
     
                    // Wait a bit for page to stabilize
                    await OptimizedUtils.sleep(500);
     
                    // Refresh current page content
                    await this.refreshCurrentPage();
     
                    this.setLoadingState(false);
                    OptimizedUtils.log('Refresh completed');
                } catch (error) {
                    this.setLoadingState(false);
                    OptimizedUtils.log('Refresh error:', error.message);
                    this.showError('Refresh failed. Please try again.');
                }
            }
     
            handleAdvanceDate() {
                // Force advance date by one day
                const currentDate = new Date(this.videoManager.settings.date);
                currentDate.setDate(currentDate.getDate() + 1);
     
                const newDateString = currentDate.toISOString().split('T')[0];
                this.videoManager.setDate(newDateString);
     
                // Update the date input field
                const dateInput = this.elements.get('dateInput');
                if (dateInput) {
                    dateInput.value = newDateString;
                }
     
                // Update last rotation time to now
                this.videoManager.settings.lastDateRotation = Date.now();
                GM_setValue('ytLastDateRotation', Date.now());
     
                this.showSuccess(`Date advanced to: ${newDateString}`);
                OptimizedUtils.log(`🗓️ Date manually advanced to: ${newDateString}`);
     
                // Refresh content with new date
                if (GM_getValue('ytActive', false)) {
                    setTimeout(() => this.handleRefresh(), 500);
                }
            }
     
            handleVintageToggle() {
                // Let TimeMachineUI handle all vintage toggle logic to avoid conflicts
                // This method is kept for compatibility but delegates to global function
                if (window.handleGlobalVintageToggle) {
                    window.handleGlobalVintageToggle();
                }
            }
     
            async refreshCurrentPage() {
                const context = OptimizedUtils.getPageContext();
     
                switch (context.page) {
                    case 'home':
                        await this.refreshHomepage();
                        break;
                    case 'video':
                        await this.refreshVideoPage(context.videoId);
                        break;
                    case 'channel':
                        await this.refreshChannelPage(context.channelId);
                        break;
                    case 'search':
                        await this.refreshSearchPage();
                        break;
                    default:
                        OptimizedUtils.log('Page type not supported for refresh:', context.page);
                }
            }
     
            async refreshHomepage() {
                OptimizedUtils.log('Refreshing homepage...');
     
                // Get new videos
                const videos = await this.videoManager.getHomepageVideos();
     
                if (videos.length === 0) {
                    this.showWarning('No videos found for selected date range');
                    return;
                }
     
                // Replace homepage content
                this.replaceHomepageVideos(videos);
            }
     
            async refreshVideoPage(videoId) {
                if (!videoId) return;
     
                OptimizedUtils.log('Refreshing video page recommendations...');
     
                const videos = await this.videoManager.getRecommendationVideos(videoId);
                this.replaceVideoPageRecommendations(videos);
            }
     
            async refreshChannelPage(channelId) {
                if (!channelId) return;
     
                OptimizedUtils.log('Refreshing channel page...');
     
                // Get all cached videos for this channel, sorted by date
                const videos = this.getAllCachedChannelVideos(channelId);
                this.replaceChannelPageVideos(videos, channelId);
            }
     
            getAllCachedChannelVideos(channelId) {
                // Get videos from all cached sources for this channel
                const allVideos = [];
     
                // Get from subscription cache
                const subscriptionVideos = this.videoManager.videoCache.get('subscription_videos_only') || [];
                const channelSubVideos = subscriptionVideos.filter(video => video.channelId === channelId);
                allVideos.push(...channelSubVideos);
     
                // Get from search term cache
                const searchTermVideos = this.videoManager.videoCache.get('search_term_videos_only') || [];
                const channelSearchVideos = searchTermVideos.filter(video => video.channelId === channelId);
                allVideos.push(...channelSearchVideos);
     
                // Get from watched videos cache
                const watchedVideos = GM_getValue('wayback_watched_videos_cache', []);
                const channelWatchedVideos = watchedVideos.filter(video => video.channelId === channelId);
                allVideos.push(...channelWatchedVideos);
     
                // Remove duplicates and sort by upload date (newest first)
                const uniqueVideos = OptimizedUtils.removeDuplicates(allVideos);
                return uniqueVideos.sort((a, b) => {
                    const dateA = new Date(a.publishedAt || a.snippet?.publishedAt || '2005-01-01');
                    const dateB = new Date(b.publishedAt || b.snippet?.publishedAt || '2005-01-01');
                    return dateB - dateA; // Newest first
                });
            }
     
            async refreshSearchPage() {
                const urlParams = new URLSearchParams(window.location.search);
                const query = urlParams.get('search_query');
     
                if (!query) return;
     
                OptimizedUtils.log('Refreshing search results...');
     
                const videos = await this.videoManager.searchVideos(query);
                this.replaceSearchResults(videos);
            }
     
            replaceHomepageVideos(videos) {
                // Implementation for replacing homepage videos
                const containers = OptimizedUtils.$$('#contents ytd-rich-item-renderer, #contents ytd-video-renderer');
     
                let videoIndex = 0;
                containers.forEach((container, index) => {
                    if (videoIndex >= videos.length) return;
     
                    const video = videos[videoIndex];
                    this.replaceVideoElement(container, video);
                    videoIndex++;
                });
     
                OptimizedUtils.log(`Replaced ${Math.min(videoIndex, videos.length)} homepage videos`);
            }
     
            replaceVideoPageRecommendations(videos) {
                const containers = OptimizedUtils.$$('#secondary ytd-compact-video-renderer');
     
                videos.slice(0, containers.length).forEach((video, index) => {
                    if (containers[index]) {
                        this.replaceVideoElement(containers[index], video);
                    }
                });
     
                OptimizedUtils.log(`Replaced ${Math.min(videos.length, containers.length)} recommendation videos`);
            }
     
            replaceChannelPageVideos(videos, channelId) {
                // Hide all channel content first (home and videos sections)
                CONFIG.CHANNEL_PAGE_SELECTORS.forEach(selector => {
                    OptimizedUtils.$$(selector).forEach(element => {
                        element.style.display = 'none';
                    });
                });
     
                // Completely replace with our cached videos and search button
                this.showChannelVideosWithSearchButton(videos, channelId);
            }
     
            showChannelVideosWithSearchButton(videos, channelId) {
                // Create a container for cached videos from all sources
                const channelContent = OptimizedUtils.$('#contents, #primary-inner');
                if (!channelContent) return;
     
                // Remove existing content
                const existingContent = OptimizedUtils.$('#wayback-channel-content');
                if (existingContent) {
                    existingContent.remove();
                }
     
                // Get channel name from first video or fallback
                const channelName = videos.length > 0 ? (videos[0].channel || videos[0].snippet?.channelTitle || 'This Channel') : 'This Channel';
     
                // Create new channel content with search button
                const channelContainer = document.createElement('div');
                channelContainer.id = 'wayback-channel-content';
                channelContainer.innerHTML = `
                    <div style="padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 style="margin: 0; color: #333;">
                                ${channelName} Videos (${videos.length} cached)
                            </h3>
                            <button id="wayback-search-more-channel" class="wayback-button" style="
                                background: #ff4444; color: white; border: none; padding: 8px 16px; 
                                border-radius: 4px; cursor: pointer; font-size: 14px;
                            ">
                                🔍 Search More Videos
                            </button>
                        </div>
                        <div id="channel-video-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
                            ${videos.length > 0 ? videos.map(video => this.createChannelVideoCard(video)).join('') : '<p style="color: #666; grid-column: 1/-1; text-align: center;">No cached videos found for this channel.</p>'}
                        </div>
                    </div>
                `;
     
                channelContent.insertBefore(channelContainer, channelContent.firstChild);
     
                // Add click handler for search button
                const searchButton = OptimizedUtils.$('#wayback-search-more-channel');
                if (searchButton) {
                    searchButton.addEventListener('click', () => this.searchMoreChannelVideos(channelId, channelName));
                }
            }
     
            createChannelVideoCard(video) {
                const videoId = video.id?.videoId || video.id;
                const snippet = video.snippet || video;
     
                if (!videoId || !snippet) return '';
     
                const thumbnailUrl = snippet.thumbnails?.medium?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || snippet.thumbnail;
                const publishedDate = new Date(snippet.publishedAt || video.publishedAt || '2005-01-01');
                const title = snippet.title || video.title || 'Unknown Title';
                const description = snippet.description || video.description || '';
                const viewCount = video.statistics?.viewCount || video.viewCount || 'Unknown views';
     
                return `
                    <div class="wayback-channel-video-card" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s;" 
                         onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <a href="/watch?v=${videoId}" style="display: block; text-decoration: none; color: inherit;" onclick="window.waybackTubeManager.cacheWatchedVideo('${videoId}')">
                            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                                <img src="${thumbnailUrl}" alt="${title}" 
                                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div style="padding: 12px;">
                                <h4 style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.3; color: #333; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                    ${OptimizedUtils.cleanTitle(title)}
                                </h4>
                                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                                    ${this.formatRelativeTime(publishedDate)}
                                </div>
                                <div style="font-size: 11px; color: #888;">
                                    ${typeof viewCount === 'number' ? this.formatViewCount(viewCount) : viewCount}
                                </div>
                                ${description ? `<p style="font-size: 11px; color: #999; margin: 8px 0 0 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${description.substring(0, 100)}...</p>` : ''}
                            </div>
                        </a>
                    </div>
                `;
            }
     
            async searchMoreChannelVideos(channelId, channelName) {
                const searchButton = OptimizedUtils.$('#wayback-search-more-channel');
                if (searchButton) {
                    if (searchButton) searchButton.textContent = '🔍 Searching...';
                    searchButton.disabled = true;
                }
     
                try {
                    // Search for more videos from this channel using current date constraints
                    const maxDate = new Date(this.settings.date);
                    const newVideos = await this.apiManager.getChannelVideos(channelId, {
                        publishedBefore: maxDate,
                        maxResults: 50,
                        order: 'date'
                    });
     
                    if (newVideos && newVideos.length > 0) {
                        // Cache the new videos for this channel
                        this.cacheChannelVideos(channelId, newVideos);
     
                        // Refresh the channel page with updated cache
                        const allVideos = this.getAllCachedChannelVideos(channelId);
                        this.showChannelVideosWithSearchButton(allVideos, channelId);
     
                        this.showSuccess(`Found ${newVideos.length} more videos for ${channelName}!`);
                    } else {
                        this.showWarning(`No additional videos found for ${channelName} before ${maxDate.toDateString()}`);
                    }
     
                } catch (error) {
                    OptimizedUtils.log('Error searching for more channel videos:', error);
                    this.showError('Failed to search for more videos. Check your API keys.');
                }
     
                if (searchButton) {
                    if (searchButton) searchButton.textContent = '🔍 Search More Videos';
                    searchButton.disabled = false;
                }
            }
     
            cacheChannelVideos(channelId, videos) {
                // Add videos to watched cache for persistence
                const existingWatchedVideos = GM_getValue('wayback_watched_videos_cache', []);
     
                const videosToCache = videos.map(video => ({
                    id: video.id?.videoId || video.id,
                    title: video.snippet?.title || 'Unknown Title',
                    channel: video.snippet?.channelTitle || 'Unknown Channel',
                    channelId: video.snippet?.channelId || channelId,
                    thumbnail: video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url || '',
                    publishedAt: video.snippet?.publishedAt || new Date().toISOString(),
                    description: video.snippet?.description || '',
                    viewCount: video.statistics?.viewCount || 'Unknown',
                    cachedAt: new Date().toISOString(),
                    source: 'channel_search'
                }));
     
                // Merge with existing and remove duplicates
                const allVideos = [...existingWatchedVideos, ...videosToCache];
                const uniqueVideos = OptimizedUtils.removeDuplicates(allVideos);
     
                // Limit cache size to prevent storage issues
                const maxCacheSize = 5000;
                if (uniqueVideos.length > maxCacheSize) {
                    uniqueVideos.sort((a, b) => new Date(b.cachedAt) - new Date(a.cachedAt));
                    uniqueVideos.splice(maxCacheSize);
                }
     
                GM_setValue('wayback_watched_videos_cache', uniqueVideos);
                OptimizedUtils.log(`Cached ${videosToCache.length} new videos for channel ${channelId}`);
            }
     
            replaceSearchResults(videos) {
                const containers = OptimizedUtils.$$('#contents ytd-video-renderer');
     
                videos.slice(0, containers.length).forEach((video, index) => {
                    if (containers[index]) {
                        this.replaceVideoElement(containers[index], video);
                    }
                });
     
                OptimizedUtils.log(`Replaced ${Math.min(videos.length, containers.length)} search results`);
            }
     
            replaceVideoElement(container, video) {
                try {
                    const videoId = video.id?.videoId || video.id;
                    const snippet = video.snippet;
     
                    if (!videoId || !snippet) return;
     
                    // Update thumbnail
                    const thumbnailImg = container.querySelector('img');
                    if (thumbnailImg) {
                        const thumbnailUrl = snippet.thumbnails?.high?.url || 
                                           snippet.thumbnails?.medium?.url || 
                                           snippet.thumbnails?.default?.url;
                        if (thumbnailUrl) {
                            thumbnailImg.src = thumbnailUrl;
                            thumbnailImg.alt = snippet.title;
                        }
                    }
     
                    // Update title
                    const titleElement = container.querySelector('#video-title, .ytd-video-meta-block #video-title, a[aria-describedby]');
                    if (titleElement) {
                        if (titleElement) titleElement.textContent = OptimizedUtils.cleanTitle(snippet.title);
                        titleElement.title = snippet.title;
     
                        // Update href
                        if (titleElement.tagName === 'A') {
                            titleElement.href = `/watch?v=${videoId}`;
                        }
                    }
     
                    // Update channel name
                    const channelElement = container.querySelector('.ytd-channel-name a, #channel-name a, #text.ytd-channel-name');
                    if (channelElement) {
                        if (channelElement) channelElement.textContent = snippet.channelTitle;
                        if (channelElement.href) {
                            channelElement.href = `/channel/${snippet.channelId}`;
                        }
                    }
     
                    // Update published date
                    const dateElement = container.querySelector('#published-time-text, .ytd-video-meta-block #published-time-text');
                    if (dateElement) {
                        const publishedDate = new Date(snippet.publishedAt);
                        if (dateElement) dateElement.textContent = this.formatRelativeTime(publishedDate);
                    }
     
                    // Update view count if available
                    const viewCountElement = container.querySelector('#metadata-line span:first-child, .ytd-video-meta-block span:first-child');
                    if (viewCountElement && video.statistics?.viewCount) {
                        if (viewCountElement) viewCountElement.textContent = this.formatViewCount(video.statistics.viewCount);
                    }
     
                    // Update links
                    const linkElements = container.querySelectorAll('a[href*="/watch"]');
                    linkElements.forEach(link => {
                        link.href = `/watch?v=${videoId}`;
                    });
     
                    // Mark as replaced
                    container.setAttribute('data-wayback-replaced', 'true');
                    container.setAttribute('data-wayback-video-id', videoId);
     
                } catch (error) {
                    OptimizedUtils.log('Error replacing video element:', error.message);
                }
            }
     
            showChannelVideosForPeriod(videos) {
                // Create a container for period videos
                const channelContent = OptimizedUtils.$('#contents, #primary-inner');
                if (!channelContent) return;
     
                // Remove existing period content
                const existingPeriodContent = OptimizedUtils.$('#wayback-period-content');
                if (existingPeriodContent) {
                    existingPeriodContent.remove();
                }
     
                if (videos.length === 0) {
                    this.showNoVideosMessage(channelContent);
                    return;
                }
     
                // Create new period content
                const periodContainer = document.createElement('div');
                periodContainer.id = 'wayback-period-content';
                periodContainer.innerHTML = `
                    <div style="padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 15px 0; color: #333;">
                            Videos from ${OptimizedUtils.formatDate(this.videoManager.currentTimeframe.selectedDate, 'MMMM YYYY')}
                        </h3>
                        <div id="period-video-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                            ${videos.map(video => this.createVideoCard(video)).join('')}
                        </div>
                    </div>
                `;
     
                channelContent.insertBefore(periodContainer, channelContent.firstChild);
            }
     
            createVideoCard(video) {
                const videoId = video.id?.videoId || video.id;
                const snippet = video.snippet;
     
                if (!videoId || !snippet) return '';
     
                const thumbnailUrl = snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;
                const publishedDate = new Date(snippet.publishedAt);
     
                return `
                    <div class="wayback-video-card" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <a href="/watch?v=${videoId}" style="display: block; text-decoration: none; color: inherit;">
                            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                                <img src="${thumbnailUrl}" alt="${snippet.title}" 
                                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div style="padding: 12px;">
                                <h4 style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.3; color: #333; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                    ${OptimizedUtils.cleanTitle(snippet.title)}
                                </h4>
                                <div style="font-size: 12px; color: #666;">
                                    ${this.formatRelativeTime(publishedDate)}
                                </div>
                            </div>
                        </a>
                    </div>
                `;
            }
     
            showNoVideosMessage(container) {
                const messageDiv = document.createElement('div');
                messageDiv.id = 'wayback-period-content';
                messageDiv.innerHTML = `
                    <div style="padding: 40px; text-align: center; background: #f9f9f9; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #666;">No Videos Found</h3>
                        <p style="margin: 0; color: #888;">
                            This channel had no videos published in ${OptimizedUtils.formatDate(this.videoManager.currentTimeframe.selectedDate, 'MMMM YYYY')}.
                            <br>Try selecting a different date.
                        </p>
                    </div>
                `;
                container.insertBefore(messageDiv, container.firstChild);
            }
     
            formatRelativeTime(date) {
                const now = new Date();
                const diffMs = now - date;
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const diffMonths = Math.floor(diffDays / 30);
                const diffYears = Math.floor(diffDays / 365);
     
                if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
                if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
                if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                return 'Today';
            }
     
            formatViewCount(count) {
                const num = parseInt(count);
                if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
                if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
                return `${num} views`;
            }
     
            handleAddApiKey() {
                const input = this.elements.get('apiKeyInput');
                const key = input.value.trim();
     
                if (this.apiManager.addKey(key)) {
                    input.value = '';
                    this.updateApiStats();
                    this.showSuccess('API key added successfully!');
                } else {
                    this.showError('Invalid API key or key already exists');
                }
            }
     
            async handleTestApiKeys() {
                const testButton = this.elements.get('testKeysButton');
                const keyStatsDiv = this.elements.get('keyStatsDiv');
     
                if (!testButton || !keyStatsDiv) return;
     
                if (this.apiManager.keys.length === 0) {
                    this.showError('No API keys to test. Add some first.');
                    return;
                }
     
                // Disable button and show loading
                testButton.disabled = true;
                if (testButton) testButton.textContent = 'Testing...';
                if (keyStatsDiv) keyStatsDiv.textContent = '';
                const testingDiv = document.createElement('div');
                testingDiv.style.color = '#ffa500';
                if (testingDiv) testingDiv.textContent = 'Testing API keys...';
                keyStatsDiv.appendChild(testingDiv);
     
                try {
                    const results = await this.apiManager.testAllKeys();
     
                    // Display results
                    let resultHtml = '<div style="margin-top: 10px;"><h4>API Key Test Results:</h4>';
                    results.forEach((result, index) => {
                        const statusColor = result.result === 'Working perfectly' ? '#4CAF50' : '#f44336';
                        resultHtml += `
                            <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px;">
                                <div style="font-size: 12px;">${result.keyPreview}</div>
                                <div style="color: ${statusColor}; font-size: 11px;">${result.result}</div>
                            </div>
                        `;
                    });
                    resultHtml += '</div>';
     
                    if (keyStatsDiv) keyStatsDiv.textContent = '';
                    const resultDiv = document.createElement('div');
                    if (resultDiv) resultDiv.textContent = resultHtml.replace(/<[^>]*>/g, ''); // Strip HTML tags
                    keyStatsDiv.appendChild(resultDiv);
                    this.showSuccess(`Tested ${results.length} API keys successfully!`);
                } catch (error) {
                    if (keyStatsDiv) keyStatsDiv.textContent = '';
                    const errorDiv = document.createElement('div');
                    errorDiv.style.color = '#f44336';
                    if (errorDiv) errorDiv.textContent = `Error testing keys: ${error.message}`;
                    keyStatsDiv.appendChild(errorDiv);
                    this.showError('Failed to test API keys');
                } finally {
                    // Re-enable button
                    testButton.disabled = false;
                    testButton.textContent = 'Test All API Keys';
                }
            }
     
            toggleApiSection() {
                const section = this.elements.get('apiSection');
                const isVisible = section.style.display !== 'none';
     
                section.style.display = isVisible ? 'none' : 'block';
     
                if (!isVisible) {
                    this.updateApiStats();
                }
            }
     
            toggleMinimize() {
                const mainInterface = this.elements.get('main');
                const content = OptimizedUtils.$('#wayback-content');
                const minimizeButton = this.elements.get('minimizeButton');
     
                const isMinimized = mainInterface.classList.contains('minimized');
     
                if (isMinimized) {
                    mainInterface.classList.remove('minimized');
                    content.style.display = 'block';
                    minimizeButton.textContent = '–';
                } else {
                    mainInterface.classList.add('minimized');
                    content.style.display = 'none';
                    minimizeButton.textContent = '+';
                }
            }
     
            updateInterface() {
                const isActive = GM_getValue('ytActive', false);
                const selectedDate = GM_getValue('ytSelectedDate', this.videoManager.getDefaultDate());
                const currentPage = OptimizedUtils.getCurrentPage();
     
                // Update status
                const statusElement = this.elements.get('statusElement');
                const toggleButton = this.elements.get('toggleButton');
     
                if (statusElement) {
                    statusElement.className = `wayback-status ${isActive ? 'active' : 'error'}`;
                    statusElement.textContent = isActive ? 'Active' : 'Inactive';
                }
     
                if (toggleButton) {
                    toggleButton.textContent = isActive ? 'Disable' : 'Enable';
                }
     
                // Update date display
                const currentDateElement = this.elements.get('currentDate');
                if (currentDateElement) {
                    currentDateElement.textContent = selectedDate;
                }
     
                // Update current page
                const currentPageElement = this.elements.get('currentPage');
                if (currentPageElement) {
                    currentPageElement.textContent = currentPage;
                }
     
                // Update date input
                const dateInput = this.elements.get('dateInput');
                if (dateInput && dateInput.value !== selectedDate) {
                    dateInput.value = selectedDate;
                }
            }
     
            updateApiStats() {
                const statsDiv = this.elements.get('keyStatsDiv');
                if (!statsDiv) return;
     
                const stats = this.apiManager.getKeyStats();
                const cacheStats = this.cacheManager.getStats();
     
                statsDiv.innerHTML = `
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 11px;">
                        <div class="wayback-stat-row">
                            <span>API Keys:</span>
                            <span>${stats.totalKeys} (Current: ${stats.currentKey}/${stats.totalKeys})</span>
                        </div>
                        <div class="wayback-stat-row">
                            <span>Cache Hit Rate:</span>
                            <span>${cacheStats.hitRate}</span>
                        </div>
                        <div class="wayback-stat-row">
                            <span>Memory Cache:</span>
                            <span>${cacheStats.memorySize} items</span>
                        </div>
                    </div>
                `;
            }
     
            setLoadingState(isLoading) {
                const refreshButton = this.elements.get('refreshButton');
                const statusElement = this.elements.get('statusElement');
     
                if (refreshButton) {
                    refreshButton.disabled = isLoading;
                    refreshButton.textContent = isLoading ? '🔄 Loading...' : '🔄 Refresh';
                }
     
                if (statusElement && isLoading) {
                    statusElement.className = 'wayback-status loading';
                    statusElement.textContent = 'Loading';
                } else if (statusElement && !isLoading) {
                    const isActive = GM_getValue('ytActive', false);
                    statusElement.className = `wayback-status ${isActive ? 'active' : 'error'}`;
                    statusElement.textContent = isActive ? 'Active' : 'Inactive';
                }
            }
     
            showSuccess(message) {
                this.showNotification(message, 'success');
            }
     
            showError(message) {
                this.showNotification(message, 'error');
            }
     
            showWarning(message) {
                this.showNotification(message, 'warning');
            }
     
            showNotification(message, type = 'info') {
                // Create notification element
                const notification = document.createElement('div');
                notification.className = `wayback-notification wayback-notification-${type}`;
                notification.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 10001;
                        background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#4caf50'};
                        color: white;
                        padding: 12px 20px;
                        border-radius: 4px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                        font-size: 14px;
                        max-width: 400px;
                        text-align: center;
                        animation: wayback-notification-slide 0.3s ease;
                    ">
                        ${message}
                    </div>
                `;
     
                document.body.appendChild(notification);
     
                // Auto remove after 3 seconds
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            }
     
            startObservers() {
                // Content observer for dynamic page changes
                const contentObserver = new MutationObserver(OptimizedUtils.throttle(() => {
                    if (GM_getValue('ytActive', false)) {
                        this.handleContentChange();
                    }
                }, 1000));
     
                const targetNode = document.body;
                if (targetNode) {
                    contentObserver.observe(targetNode, {
                        childList: true,
                        subtree: true,
                        attributes: false
                    });
     
                    this.observers.set('content', contentObserver);
                }
     
                OptimizedUtils.log('Content observers started');
            }
     
            handleContentChange() {
                // Aggressive content blocking
                this.blockModernContent();
                this.updateCurrentPageContent();
            }
     
            blockModernContent() {
                // Block Shorts
                CONFIG.SHORTS_SELECTORS.forEach(selector => {
                    OptimizedUtils.$$(selector).forEach(element => {
                        if (!element.hasAttribute('data-wayback-blocked')) {
                            element.style.display = 'none';
                            element.setAttribute('data-wayback-blocked', 'true');
                        }
                    });
                });
     
                // Block modern channel content and replace with cached videos
                if (OptimizedUtils.getCurrentPage() === 'channel') {
                    CONFIG.CHANNEL_PAGE_SELECTORS.forEach(selector => {
                        OptimizedUtils.$$(selector).forEach(element => {
                            if (!element.hasAttribute('data-wayback-blocked')) {
                                element.style.visibility = 'hidden';
                                element.style.height = '0';
                                element.style.overflow = 'hidden';
                                element.setAttribute('data-wayback-blocked', 'true');
                            }
                        });
                    });
     
                    // Replace with cached channel videos
                    this.replaceChannelPageWithCache();
                }
            }
     
            async updateCurrentPageContent() {
                const context = OptimizedUtils.getPageContext();
     
                // Update page info in UI
                const currentPageElement = this.elements.get('currentPage');
                if (currentPageElement) {
                    currentPageElement.textContent = context.page;
                }
            }
     
            handleUrlChange() {
                OptimizedUtils.log('URL changed, updating content...');
                this.updateInterface();
     
                if (GM_getValue('ytActive', false)) {
                    // Small delay to let page load
                    setTimeout(() => {
                        this.handleContentChange();
                    }, 1000);
                }
            }
     
            cleanup() {
                // Remove event listeners
                this.eventListeners.forEach((listeners, key) => {
                    listeners.forEach(({ element, event, handler }) => {
                        element.removeEventListener(event, handler);
                    });
                });
                this.eventListeners.clear();
     
                // Disconnect observers
                this.observers.forEach(observer => {
                    observer.disconnect();
                });
                this.observers.clear();
     
                // Remove elements
                this.elements.forEach((element, key) => {
                    if (element && element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                });
                this.elements.clear();
     
                OptimizedUtils.log('UI Manager cleaned up');
            }
     
            // === SUBSCRIPTION MANAGEMENT HANDLERS ===
            handleAddSubscription() {
                const input = this.elements.get('subscriptionInput');
                const channelName = input.value.trim();
     
                if (!channelName) return;
     
                const subscriptions = this.loadSubscriptions();
                if (!subscriptions.find(sub => sub.name.toLowerCase() === channelName.toLowerCase())) {
                    subscriptions.push({ name: channelName, id: null });
                    this.saveSubscriptions(subscriptions);
                    this.updateSubscriptionsList();
                    input.value = '';
                    OptimizedUtils.log(`Added subscription: ${channelName}`);
                } else {
                    OptimizedUtils.log(`Subscription already exists: ${channelName}`);
                }
            }
     
            handleRemoveSubscription(channelName) {
                const subscriptions = this.loadSubscriptions();
                const index = subscriptions.findIndex(sub => sub.name === channelName);
                if (index > -1) {
                    subscriptions.splice(index, 1);
                    this.saveSubscriptions(subscriptions);
                    this.updateSubscriptionsList();
                    OptimizedUtils.log(`Removed subscription: ${channelName}`);
                }
            }
     
            handleClearSubscriptions() {
                this.saveSubscriptions([]);
                this.updateSubscriptionsList();
                OptimizedUtils.log('Cleared all subscriptions');
            }
     
            async handleLoadHomepage() {
                if (!GM_getValue('ytActive', false)) {
                    OptimizedUtils.log('WayBackTube is not active');
                    return;
                }
     
                const subscriptions = this.loadSubscriptions();
                const searchTerms = this.loadSearchTerms();
     
                if (subscriptions.length === 0 && searchTerms.length === 0) {
                    OptimizedUtils.log('No subscriptions or search terms to load from');
                    return;
                }
     
                try {
                    this.setLoadingState(true);
                    await this.refreshHomepage();
                    this.setLoadingState(false);
                    OptimizedUtils.log('Homepage videos loaded successfully');
                } catch (error) {
                    this.setLoadingState(false);
                    OptimizedUtils.log('Failed to load homepage videos:', error);
                }
            }
     
            // === SEARCH TERMS MANAGEMENT HANDLERS ===
            handleAddSearchTerm() {
                const input = this.elements.get('searchTermInput');
                const searchTerm = input.value.trim();
     
                if (!searchTerm) return;
     
                const searchTerms = this.loadSearchTerms();
                if (!searchTerms.includes(searchTerm.toLowerCase())) {
                    searchTerms.push(searchTerm.toLowerCase());
                    this.saveSearchTerms(searchTerms);
                    this.updateSearchTermsList();
                    input.value = '';
                    OptimizedUtils.log(`Added search term: ${searchTerm}`);
                } else {
                    OptimizedUtils.log(`Search term already exists: ${searchTerm}`);
                }
            }
     
            handleRemoveSearchTerm(searchTerm) {
                const searchTerms = this.loadSearchTerms();
                const index = searchTerms.indexOf(searchTerm);
                if (index > -1) {
                    searchTerms.splice(index, 1);
                    this.saveSearchTerms(searchTerms);
                    this.updateSearchTermsList();
                    OptimizedUtils.log(`Removed search term: ${searchTerm}`);
                }
            }
     
            handleClearSearchTerms() {
                this.saveSearchTerms([]);
                this.updateSearchTermsList();
                OptimizedUtils.log('Cleared all search terms');
            }
     
            async handleLoadSearchVideos() {
                if (!GM_getValue('ytActive', false)) {
                    OptimizedUtils.log('WayBackTube is not active');
                    return;
                }
     
                const searchTerms = this.loadSearchTerms();
     
                if (searchTerms.length === 0) {
                    OptimizedUtils.log('No search terms to load videos from');
                    return;
                }
     
                try {
                    this.setLoadingState(true);
                    await this.refreshHomepage();
                    this.setLoadingState(false);
                    OptimizedUtils.log('Search term videos loaded successfully');
                } catch (error) {
                    this.setLoadingState(false);
                    OptimizedUtils.log('Failed to load search term videos:', error);
                }
            }
     
            // === DATA MANAGEMENT HELPERS ===
            loadSubscriptions() {
                const saved = GM_getValue('wayback_subscriptions', '[]');
                try {
                    const subscriptions = JSON.parse(saved);
                    return subscriptions.length > 0 ? subscriptions : this.getDefaultSubscriptions();
                } catch {
                    return this.getDefaultSubscriptions();
                }
            }
     
            saveSubscriptions(subscriptions) {
                GM_setValue('wayback_subscriptions', JSON.stringify(subscriptions));
            }
     
            getDefaultSubscriptions() {
                return [
                    { name: 'PewDiePie', id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw' },
                    { name: 'Markiplier', id: 'UC7_YxT-KID8kRbqZo7MyscQ' },
                    { name: 'Jacksepticeye', id: 'UCYzPXprvl5Y-Sf0g4vX-m6g' }
                ];
            }
     
            loadSearchTerms() {
                const saved = GM_getValue('wayback_search_terms', '[]');
                try {
                    const searchTerms = JSON.parse(saved);
                    return searchTerms.length > 0 ? searchTerms : this.getDefaultSearchTerms();
                } catch {
                    return this.getDefaultSearchTerms();
                }
            }
     
            saveSearchTerms(searchTerms) {
                GM_setValue('wayback_search_terms', JSON.stringify(searchTerms));
            }
     
            getDefaultSearchTerms() {
                return ['memes', 'gaming', 'funny', 'music', 'tutorial'];
            }
     
            // === UI UPDATE HELPERS ===
            updateSubscriptionsList() {
                const container = this.elements.get('subscriptionsList');
                if (!container) return;
     
                const subscriptions = this.loadSubscriptions();
                container.innerHTML = subscriptions.map(sub => `
                    <div class="wayback-list-item">
                        <span class="wayback-item-text">${sub.name}</span>
                        <button class="wayback-remove-btn" data-subscription="${sub.name}">×</button>
                    </div>
                `).join('');
            }
     
            updateSearchTermsList() {
                const container = this.elements.get('searchTermsList');
                if (!container) return;
     
                const searchTerms = this.loadSearchTerms();
                container.innerHTML = searchTerms.map(term => `
                    <div class="wayback-list-item">
                        <span class="wayback-item-text">${term}</span>
                        <button class="wayback-remove-btn" data-search-term="${term}">×</button>
                    </div>
                `).join('');
            }
     
            // Initialize the UI with existing data
            initializeUI() {
                this.updateSubscriptionsList();
                this.updateSearchTermsList();
                this.initializeVintageTheme();
            }
     
            initializeVintageTheme() {
                const isVintageActive = GM_getValue('ytVintage2011Theme', false);
                const button = this.elements.get('vintageToggleButton');
                
                // Apply saved theme state
                if (isVintageActive) {
                    document.body.classList.add('wayback-2011-theme');
                }
                
                // Update button state
                if (button) {
                    button.textContent = isVintageActive ? '🕰️ Modern Theme' : '🕰️ 2011 Theme';
                    if (isVintageActive) {
                        button.classList.add('wayback-vintage-active');
                    }
                }
                
                OptimizedUtils.log(`2011 Vintage Theme initialized: ${isVintageActive ? 'active' : 'inactive'}`);
            }
        }
     
        // === COMPLETE MAIN APPLICATION CLASS ===
        class WayBackTubeOptimized {
            constructor() {
                // Settings and state MUST be initialized first
                const now = Date.now();
                this.settings = {
                    active: GM_getValue('ytActive', false),
                    uiVisible: GM_getValue('ytTimeMachineUIVisible', true),
                    date: GM_getValue('ytSelectedDate', '2012-01-01'),
                    lastDateRotation: GM_getValue('ytLastDateRotation', now - (25 * 60 * 60 * 1000)), // Default to 25 hours ago to trigger rotation
                    dateRotationEnabled: GM_getValue('ytDateRotationEnabled', true)
                };
     
                // Initialize all managers with complete functionality
                this.apiManager = new OptimizedAPIManager();
                this.subscriptionManager = new SubscriptionManager();
                this.feedChipHider = new FeedChipHider();
                this.searchEnhancement = new OptimizedSearchEnhancement(this);
                this.tabHider = new TabHider();
     
                this.maxDate = new Date(this.settings.date);
                // FIXED: Use persistent cache manager instead of Map()
                this.videoCache = new PersistentVideoCache();
                this.stats = {
                    processed: 0,
                    filtered: 0,
                    apiCalls: 0,
                    cacheHits: 0
                };
     
                // Initialize components
                this.searchManager = new SearchManager(this.apiManager, this.maxDate);
                this.uiManager = new EnhancedUIManager(this);
     
                this.isInitialized = false;
                this.autoRefreshTimer = null;
                this.filterTimer = null;
                this.isProcessing = false;
     
                this.init();
            }
     
            async init() {
                if (this.isInitialized) return;
     
                try {
                    OptimizedUtils.log('Initializing Complete WayBackTube...');
     
                    // Check for date rotation on startup
                    this.checkDateRotation();
     
                    // Wait for page to be ready
                    await OptimizedUtils.waitFor(() => document.readyState === 'complete', 15000);
     
                    // Set up channel page monitoring
                    this.setupChannelPageMonitoring();
     
                    // Start filtering and content replacement
                    this.startFiltering();
                    this.startHomepageReplacement();
                    this.startVideoPageEnhancement();
                    this.tabHider.init();
     
                    // Auto-load if enabled and on homepage
                    if (CONFIG.autoLoadOnHomepage && this.isHomePage() && this.settings.active) {
                        setTimeout(() => {
                            this.loadAllVideos(false); // Don't refresh, use cache if available
                        }, CONFIG.autoLoadDelay);
                    }
     
                    // Setup auto-refresh
                    this.setupAutoRefresh();
     
                    // Setup date rotation check (every hour)
                    this.setupDateRotationTimer();
     
                    this.isInitialized = true;
                    OptimizedUtils.log('Complete WayBackTube initialized successfully');
     
                } catch (error) {
                    OptimizedUtils.log('Initialization error:', error.message);
                    console.error('WayBackTube initialization failed:', error);
                }
            }
     
            // === TIME MACHINE CONTROLS ===
            setDate(dateString) {
                this.settings.date = dateString;
                this.maxDate = new Date(dateString);
                this.searchManager.updateMaxDate(this.maxDate);
     
                GM_setValue('ytSelectedDate', dateString);
                OptimizedUtils.log(`Date set to: ${dateString}`);
     
                // Clear caches and reload content
                this.apiManager.clearCache();
                this.videoCache.clear(); // Also clear persistent video cache
                if (this.settings.active) {
                    this.loadAllVideos(true); // Force refresh after clearing cache
                }
            }
     
            checkDateRotation() {
                if (!this.settings.dateRotationEnabled) {
                    OptimizedUtils.log('Date rotation is disabled');
                    return;
                }
     
                const now = Date.now();
                const lastRotation = this.settings.lastDateRotation;
                const timeSinceLastRotation = now - lastRotation;
                const oneDayMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
                const hoursElapsed = timeSinceLastRotation / (60 * 60 * 1000);
     
                OptimizedUtils.log(`Date rotation check: ${hoursElapsed.toFixed(1)} hours since last rotation (need 24+)`);
     
                if (timeSinceLastRotation >= oneDayMs) {
                    // Advance the date by one day
                    const currentDate = new Date(this.settings.date);
                    currentDate.setDate(currentDate.getDate() + 1);
     
                    const newDateString = currentDate.toISOString().split('T')[0];
                    this.setDate(newDateString);
     
                    // Update last rotation time
                    this.settings.lastDateRotation = now;
                    GM_setValue('ytLastDateRotation', now);
     
                    OptimizedUtils.log(`🗓️ Date automatically rotated to: ${newDateString} (simulating daily uploads)`);
     
                    // Clear cache and refresh content to show "new" videos for the day
                    this.apiManager.clearCache();
                    this.videoCache.clear(); // Also clear persistent video cache
                    if (this.settings.active) {
                        setTimeout(() => {
                            this.loadAllVideos(true); // Force refresh for new daily content
                        }, 1000);
                    }
                }
            }
     
            setupDateRotationTimer() {
                // Check for date rotation every hour
                setInterval(() => {
                    this.checkDateRotation();
                }, 60 * 60 * 1000); // 1 hour
     
                // Setup fast test clock that simulates 24 hours in 2 minutes for testing
                this.setupTestClock();
            }
     
            setupTestClock() {
                // Real-time clock: actual 24 hours = 24 hours, new videos every 4 real hours
                const testClockEnabled = GM_getValue('wayback_persistent_clock_enabled', false);
                if (!testClockEnabled) return;
     
                // Store clock data with version-independent keys to persist across updates
                const startTime = GM_getValue('wayback_persistent_clock_start', Date.now());
                const lastVideoCheck = GM_getValue('wayback_persistent_last_video_check', 0);
     
                // Save initial start time to version-independent storage if not already set
                if (!GM_getValue('wayback_persistent_clock_start')) {
                    GM_setValue('wayback_persistent_clock_start', startTime);
                }
     
                this.testClockTimer = setInterval(() => {
                    const now = Date.now();
                    const timeElapsed = now - startTime;
     
                    // Calculate hours elapsed since start
                    const hoursElapsed = timeElapsed / (1000 * 60 * 60); // Real hours
                    const currentHour = Math.floor(hoursElapsed % 24); // 0-23 hour format
     
                    // Check for 4-hour intervals for new videos (every 4 real hours)
                    const currentInterval = Math.floor(hoursElapsed / 4);
                    const lastInterval = GM_getValue('wayback_persistent_last_interval', -1);
     
                    if (currentInterval !== lastInterval && currentInterval > 0) {
                        GM_setValue('wayback_persistent_last_interval', currentInterval);
                        OptimizedUtils.log(`🕐 4-hour mark reached (${hoursElapsed.toFixed(1)}h total) - New videos available!`);
     
                        // Clear video cache to simulate new uploads - but only when clock advances
                        this.apiManager.clearCache();
                        this.videoCache.clear(); // Clear persistent video cache
                        if (this.settings.active) {
                            OptimizedUtils.log('Clock advanced - reloading videos with fresh API calls');
                            this.loadAllVideos(true); // Force refresh for new content
                        }
                    }
     
                    // Check for 24-hour date rotation (every 24 real hours)
                    const daysSinceStart = Math.floor(hoursElapsed / 24);
                    const lastRotationDay = GM_getValue('wayback_persistent_last_rotation_day', -1);
     
                    if (daysSinceStart > lastRotationDay && daysSinceStart > 0) {
                        GM_setValue('wayback_persistent_last_rotation_day', daysSinceStart);
     
                        // Advance the date by one day
                        const currentDate = new Date(this.settings.date);
                        currentDate.setDate(currentDate.getDate() + 1);
     
                        const newDateString = currentDate.toISOString().split('T')[0];
                        this.setDate(newDateString);
     
                        OptimizedUtils.log(`🗓️ REAL CLOCK: Date advanced to ${newDateString} (Day ${daysSinceStart})`);
                    }
     
                    // Update UI with real time
                    this.updateTestClockDisplay(hoursElapsed);
     
                }, 1000); // Update every second for seconds display
            }
     
            updateTestClockDisplay(totalHours) {
                const days = Math.floor(totalHours / 24);
                const hours = Math.floor(totalHours % 24);
                const minutes = Math.floor((totalHours - Math.floor(totalHours)) * 60);
                const seconds = Math.floor(((totalHours - Math.floor(totalHours)) * 60 - minutes) * 60);
     
                const timeString = `Day ${days}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
     
                // Update UI clock display instead of floating overlay
                const clockElement = document.getElementById('wayback-clock-display');
                if (clockElement) {
                    clockElement.textContent = timeString;
                }
     
                // Also update the alternative UI if it exists
                const tmClockElement = document.getElementById('tm-clock-display');
                if (tmClockElement) {
                    tmClockElement.textContent = timeString;
                }
            }
     
            toggleTestClock(enabled) {
                GM_setValue('wayback_persistent_clock_enabled', enabled);
     
                if (enabled) {
                    // Initialize start time if not set
                    if (!GM_getValue('wayback_persistent_clock_start')) {
                        GM_setValue('wayback_persistent_clock_start', Date.now());
                    }
                    this.setupTestClock();
                    OptimizedUtils.log('🕐 Real-time clock enabled: 24 real hours = 1 day, new videos every 4 real hours');
                } else {
                    if (this.testClockTimer) {
                        clearInterval(this.testClockTimer);
                        this.testClockTimer = null;
                    }
                    // Clear clock display in UI
                    const clockElement = document.getElementById('wayback-clock-display');
                    if (clockElement) {
                        clockElement.textContent = 'Clock stopped';
                    }
                    OptimizedUtils.log('🕐 Real-time clock disabled');
                }
            }
     
            enableDateRotation(enabled) {
                this.settings.dateRotationEnabled = enabled;
                GM_setValue('ytDateRotationEnabled', enabled);
                OptimizedUtils.log(`Date rotation ${enabled ? 'enabled' : 'disabled'}`);
            }
     
            setRandomDate() {
                const startDate = new Date('2005-04-23'); // YouTube founded
                const endDate = new Date('2018-12-31');   // Pre-modern era
     
                const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
                const randomDate = new Date(randomTime);
     
                this.setDate(randomDate.toISOString().split('T')[0]);
            }
     
            getDateString() {
                return this.settings.date;
            }
     
            toggle() {
                this.settings.active = !this.settings.active;
                GM_setValue('ytActive', this.settings.active);
     
                OptimizedUtils.log(`Time Machine ${this.settings.active ? 'enabled' : 'disabled'}`);
     
                if (this.settings.active) {
                    // Only load if we don't have cached videos
                    const hasSubscriptionCache = (this.videoCache.get('subscription_videos_only') || []).length > 0;
                    const hasSearchTermCache = (this.videoCache.get('search_term_videos_only') || []).length > 0;
                    const searchTerms = this.uiManager.getSearchTerms();
                    const subscriptions = this.subscriptionManager.getSubscriptions();
                    
                    const needsLoading = (subscriptions.length > 0 && !hasSubscriptionCache) || 
                                       (searchTerms.length > 0 && !hasSearchTermCache);
                    
                    if (needsLoading) {
                        OptimizedUtils.log('Loading videos for first time activation...');
                        this.loadAllVideos(false); // Don't refresh, use cache if available
                    } else {
                        OptimizedUtils.log('Using existing cached videos - no API calls needed');
                    }
                }
            }
     
            // === SERIES ADVANCEMENT FUNCTIONALITY ===
            async findNextEpisodeInSeries(currentVideoTitle, currentChannelName) {
                // Extract episode patterns from current video title
                const episodePatterns = [
                    /episode\s*(\d+)/i,
                    /ep\.?\s*(\d+)/i,
                    /part\s*(\d+)/i,
                    /#(\d+)/i,
                    /(\d+)(?=\s*[-–—]\s*)/i, // Number followed by dash
                    /(\d+)(?=\s*$)/i // Number at end of title
                ];
     
                let episodeNumber = null;
                let patternUsed = null;
                let baseTitle = currentVideoTitle;
     
                // Try to find episode number
                for (const pattern of episodePatterns) {
                    const match = currentVideoTitle.match(pattern);
                    if (match) {
                        episodeNumber = parseInt(match[1]);
                        patternUsed = pattern;
                        // Create base title by removing the episode number
                        baseTitle = currentVideoTitle.replace(pattern, '').trim();
                        break;
                    }
                }
     
                if (!episodeNumber) {
                    OptimizedUtils.log('No episode pattern found in:', currentVideoTitle);
                    return null;
                }
     
                const nextEpisodeNumber = episodeNumber + 1;
                OptimizedUtils.log(`Found episode ${episodeNumber}, searching for episode ${nextEpisodeNumber}`);
     
                // Generate search query for next episode
                const searchQueries = [
                    `${currentChannelName} ${baseTitle} episode ${nextEpisodeNumber}`,
                    `${currentChannelName} ${baseTitle} ep ${nextEpisodeNumber}`,
                    `${currentChannelName} ${baseTitle} part ${nextEpisodeNumber}`,
                    `${currentChannelName} ${baseTitle} #${nextEpisodeNumber}`,
                    `${currentChannelName} ${baseTitle} ${nextEpisodeNumber}`
                ];
     
                // Try each search query to find the next episode
                for (const query of searchQueries) {
                    try {
                        OptimizedUtils.log(`Searching for next episode: "${query}"`);
                        const results = await this.apiManager.searchVideos(query.trim(), {
                            publishedBefore: this.maxDate,
                            maxResults: 10,
                            order: 'relevance'
                        });
     
                        if (results && results.length > 0) {
                            // Look for exact episode match in results
                            const nextEpisode = results.find(video => {
                                const title = video.snippet?.title || '';
                                const channel = video.snippet?.channelTitle || '';
                                
                                // Check if it's from same channel and contains next episode number
                                if (channel.toLowerCase() !== currentChannelName.toLowerCase()) {
                                    return false;
                                }
     
                                // Check if title contains the next episode number
                                return episodePatterns.some(pattern => {
                                    const match = title.match(pattern);
                                    return match && parseInt(match[1]) === nextEpisodeNumber;
                                });
                            });
     
                            if (nextEpisode) {
                                OptimizedUtils.log(`✓ Found next episode: "${nextEpisode.snippet.title}"`);
                                return {
                                    id: nextEpisode.id,
                                    title: nextEpisode.snippet?.title || 'Next Episode',
                                    channel: nextEpisode.snippet?.channelTitle || currentChannelName,
                                    channelId: nextEpisode.snippet?.channelId || '',
                                    thumbnail: nextEpisode.snippet?.thumbnails?.medium?.url || 
                                             nextEpisode.snippet?.thumbnails?.high?.url || 
                                             nextEpisode.snippet?.thumbnails?.default?.url || '',
                                    publishedAt: nextEpisode.snippet?.publishedAt || new Date().toISOString(),
                                    description: nextEpisode.snippet?.description || '',
                                    viewCount: this.apiManager.generateRealisticViewCount(
                                        nextEpisode.snippet?.publishedAt || new Date().toISOString(), 
                                        this.maxDate
                                    ),
                                    relativeDate: OptimizedUtils.calculateRelativeDate(
                                        nextEpisode.snippet?.publishedAt || new Date().toISOString(), 
                                        this.maxDate
                                    ),
                                    isNextEpisode: true // Mark as series advancement
                                };
                            }
                        }
                    } catch (error) {
                        OptimizedUtils.log(`Error searching for "${query}":`, error);
                    }
                }
     
                OptimizedUtils.log('No next episode found');
                return null;
            }
     
            // === VIDEO LOADING AND MANAGEMENT ===
            async loadVideosFromSearchTerms(isRefresh = false) {
                const searchTerms = this.uiManager.getSearchTerms();
     
                if (searchTerms.length === 0) {
                    return [];
                }
     
                // Check cache first - same behavior as subscriptions
                const cacheKey = `search_videos_${JSON.stringify(searchTerms.sort())}_${this.maxDate.toDateString()}`;
                const cachedVideos = this.videoCache.get(cacheKey);
                if (cachedVideos && cachedVideos.length > 0 && !isRefresh) {
                    OptimizedUtils.log(`✓ Using cached search term videos (${cachedVideos.length} videos) - SAVED API QUOTA`);
                    return cachedVideos;
                }
                
                OptimizedUtils.log(`⚠️ Loading search term videos from API (cache miss or refresh) - using API quota`);
     
                OptimizedUtils.log(`Loading videos from ${searchTerms.length} search terms...`);
     
                let allVideos = [];
                const videosPerTerm = Math.ceil(CONFIG.maxHomepageVideos / searchTerms.length);
     
                for (const term of searchTerms) {
                    try {
                        const endDate = new Date(this.maxDate);
                        const videos = await this.apiManager.searchVideos(term, {
                            publishedBefore: endDate,
                            maxResults: videosPerTerm,
                            order: 'relevance'
                        });
                        if (videos && videos.length > 0) {
                            // Flatten video structure to match subscription videos format
                            const flattenedVideos = videos.map(video => ({
                                id: video.id,
                                title: video.snippet?.title || 'Unknown Title',
                                channel: video.snippet?.channelTitle || 'Unknown Channel',
                                channelId: video.snippet?.channelId || '',
                                thumbnail: video.snippet?.thumbnails?.medium?.url || 
                                         video.snippet?.thumbnails?.high?.url || 
                                         video.snippet?.thumbnails?.default?.url || '',
                                publishedAt: video.snippet?.publishedAt || new Date().toISOString(),
                                description: video.snippet?.description || '',
                                viewCount: this.apiManager.generateRealisticViewCount(
                                    video.snippet?.publishedAt || new Date().toISOString(), 
                                    endDate
                                ),
                                relativeDate: OptimizedUtils.calculateRelativeDate(video.snippet?.publishedAt || new Date().toISOString(), endDate)
                            }));
     
                            OptimizedUtils.log(`Flattened ${flattenedVideos.length} search videos for "${term}"`);
                            allVideos = allVideos.concat(flattenedVideos);
                        }
                        OptimizedUtils.log(`Found ${videos?.length || 0} videos for search term: ${term}`);
                    } catch (error) {
                        OptimizedUtils.log(`Error loading videos for search term "${term}":`, error);
                    }
                }
     
                // Remove duplicates and limit total
                const uniqueVideos = OptimizedUtils.removeDuplicates(allVideos);
                const limitedVideos = uniqueVideos.slice(0, CONFIG.maxHomepageVideos);
     
                // Cache the results with same expiry as subscription videos
                this.videoCache.set(cacheKey, limitedVideos, CONFIG.cacheExpiry.videos);
     
                OptimizedUtils.log(`Loaded ${limitedVideos.length} unique videos from search terms`);
                return limitedVideos;
            }
     
            async loadAllVideos(isRefresh = false) {
                const subscriptions = this.uiManager.getSubscriptions(); // FIX: Use uiManager, not subscriptionManager
                const searchTerms = this.uiManager.getSearchTerms();
     
                OptimizedUtils.log(`🚀 LOADING ALL VIDEOS DEBUG:`);
                OptimizedUtils.log(`   Subscriptions: ${subscriptions.length} (${subscriptions.map(s => s.name).join(', ')})`);
                OptimizedUtils.log(`   Search terms: ${searchTerms.length} (${searchTerms.join(', ')})`);
                OptimizedUtils.log(`   Refresh: ${isRefresh}`);
     
                if (subscriptions.length === 0 && searchTerms.length === 0) {
                    OptimizedUtils.log('❌ No subscriptions or search terms found - cannot load videos');
                    throw new Error('No subscriptions or search terms to load from');
                }
     
                // Use SINGLE unified cache key for all videos
                const cacheKey = `all_videos_unified_${this.maxDate.toDateString()}`;
                let cachedVideos = this.videoCache.get(cacheKey) || [];
                
                if (cachedVideos.length > 0 && !isRefresh) {
                    OptimizedUtils.log(`✓ Using ${cachedVideos.length} cached unified videos - NO API CALLS`);
                    this.videoCache.set('all_videos', cachedVideos); // Also set legacy cache
                    return cachedVideos;
                }
     
                OptimizedUtils.log('Loading all videos from subscriptions and search terms...');
                
                let allVideos = [];
                
                // Load subscription videos if we have subscriptions
                let subscriptionVideos = [];
                if (subscriptions.length > 0) {
                    OptimizedUtils.log(`📥 Loading ${subscriptions.length} subscription channels...`);
                    subscriptionVideos = await this.loadVideosFromSubscriptions(isRefresh);
                    OptimizedUtils.log(`✓ Loaded ${subscriptionVideos.length} subscription videos`);
                    allVideos.push(...subscriptionVideos);
                }
                
                // Load search term videos if we have search terms
                let searchTermVideos = [];
                if (searchTerms.length > 0) {
                    OptimizedUtils.log(`🔍 Loading ${searchTerms.length} search terms...`);
                    searchTermVideos = await this.loadVideosFromSearchTerms(isRefresh);
                    OptimizedUtils.log(`✓ Loaded ${searchTermVideos.length} search term videos`);
                    allVideos.push(...searchTermVideos);
                }
     
                // Apply weighted mixing and remove duplicates
                const uniqueVideos = OptimizedUtils.removeDuplicates(allVideos);
                const finalVideos = this.mixVideosByWeight(
                    allVideos.filter(v => subscriptions.some(sub => sub.name === v.channel || sub.id === v.channelId)),
                    allVideos.filter(v => !subscriptions.some(sub => sub.name === v.channel || sub.id === v.channelId))
                );
     
                // Store in SINGLE unified cache
                this.videoCache.set(cacheKey, finalVideos, CONFIG.cacheExpiry.videos);
                this.videoCache.set('all_videos', finalVideos); // Legacy cache for compatibility
                
                OptimizedUtils.log(`✓ Stored ${finalVideos.length} videos in unified cache`);
                const searchInFinal = finalVideos.filter(v => searchTermVideos.some(s => s.id === v.id)).length;
                const subInFinal = finalVideos.filter(v => subscriptionVideos.some(s => s.id === v.id)).length;
                OptimizedUtils.log(`   Final homepage mix: ${searchInFinal} search + ${subInFinal} subscription = ${finalVideos.length} total`);
                return finalVideos;
            }
     
            mixVideosByWeight(subscriptionVideos, searchTermVideos) {
                // Debug logging to see what's happening
                OptimizedUtils.log(`🎯 HOMEPAGE MIXING DEBUG:`);
                OptimizedUtils.log(`   Subscription videos: ${subscriptionVideos.length}`);
                OptimizedUtils.log(`   Search term videos: ${searchTermVideos.length}`);
                OptimizedUtils.log(`   Search percentage: ${CONFIG.searchTermVideoPercentage * 100}%`);
                OptimizedUtils.log(`   Subscription percentage: ${CONFIG.subscriptionVideoPercentage * 100}%`);
     
                // Don't limit total count - let users load more via pagination
                const totalVideos = subscriptionVideos.length + searchTermVideos.length;
                const searchCount = Math.floor(totalVideos * CONFIG.searchTermVideoPercentage);
                const subscriptionCount = totalVideos - searchCount;
     
                OptimizedUtils.log(`   Target search videos: ${searchCount}`);
                OptimizedUtils.log(`   Target subscription videos: ${subscriptionCount}`);
     
                const selectedSearch = OptimizedUtils.shuffleArray([...searchTermVideos]).slice(0, searchCount);
                const selectedSubscription = OptimizedUtils.shuffleArray([...subscriptionVideos]).slice(0, subscriptionCount);
     
                OptimizedUtils.log(`   Actually selected search: ${selectedSearch.length}`);
                OptimizedUtils.log(`   Actually selected subscription: ${selectedSubscription.length}`);
     
                const combined = [...selectedSearch, ...selectedSubscription];
                const uniqueVideos = OptimizedUtils.removeDuplicates(combined);
     
                // Apply heavy recent bias to the mixed results
                const recentlyBiasedVideos = OptimizedUtils.weightedShuffleByDate(uniqueVideos, this.maxDate);
     
                OptimizedUtils.log(`Video weighting: ${selectedSearch.length} search (${CONFIG.searchTermVideoPercentage * 100}%) + ${selectedSubscription.length} subscription = ${recentlyBiasedVideos.length} total with HEAVY recent bias`);
                return recentlyBiasedVideos;
            }
     
            getCurrentVideoId() {
                const url = window.location.href;
                const match = url.match(/[?&]v=([^&]+)/);
                return match ? match[1] : null;
            }
     
            async getCurrentChannelId(videoId) {
                if (!videoId) return null;
     
                try {
                    const videoDetails = await this.apiManager.getVideoDetails([videoId]);
                    if (videoDetails && videoDetails.length > 0) {
                        return videoDetails[0].snippet?.channelId;
                    }
                } catch (error) {
                    OptimizedUtils.log('Error getting current channel ID:', error);
                }
                return null;
            }
     
            getCurrentVideoTitle() {
                // Try multiple selectors to get the video title
                const titleSelectors = [
                    'h1.title.style-scope.ytd-video-primary-info-renderer',
                    'h1.ytd-video-primary-info-renderer',
                    'h1[class*="title"]',
                    '.title.style-scope.ytd-video-primary-info-renderer',
                    'ytd-video-primary-info-renderer h1',
                    '#container h1'
                ];
     
                for (const selector of titleSelectors) {
                    const titleElement = document.querySelector(selector);
                    if (titleElement && titleElement.textContent.trim()) {
                        const title = titleElement.textContent.trim();
                        OptimizedUtils.log(`Found video title: "${title}"`);
                        return title;
                    }
                }
     
                OptimizedUtils.log('Could not find video title on page');
                return null;
            }
     
            getCurrentChannelName() {
                // Try multiple selectors to get the channel name
                const channelSelectors = [
                    'ytd-video-owner-renderer .ytd-channel-name a',
                    'ytd-channel-name #text a',
                    '#owner-text a',
                    '.ytd-channel-name a',
                    'a.yt-simple-endpoint.style-scope.yt-formatted-string',
                    '#upload-info #channel-name a'
                ];
     
                for (const selector of channelSelectors) {
                    const channelElement = document.querySelector(selector);
                    if (channelElement && channelElement.textContent.trim()) {
                        const channelName = channelElement.textContent.trim();
                        OptimizedUtils.log(`Found channel name: "${channelName}"`);
                        return channelName;
                    }
                }
     
                OptimizedUtils.log('Could not find channel name on page');
                return null;
            }
     
            async createWatchNextWeightedVideos(allVideos, currentChannelId, currentVideoTitle = null, currentChannelName = null) {
                let nextEpisode = null;
     
                // First, try to find the next episode in the series
                if (currentVideoTitle && currentChannelName) {
                    try {
                        nextEpisode = await this.findNextEpisodeInSeries(currentVideoTitle, currentChannelName);
                    } catch (error) {
                        OptimizedUtils.log('Error finding next episode:', error);
                    }
                }
     
                // Use SINGLE unified cache for weighting - no separate caches
                const cacheKey = `all_videos_unified_${this.maxDate.toDateString()}`;
                const allCachedVideos = this.videoCache.get(cacheKey) || this.videoCache.get('all_videos') || [];
                
                // Separate cached videos by type for weighting
                const subscriptions = this.subscriptionManager.getSubscriptions();
                const subscriptionVideos = allCachedVideos.filter(v => subscriptions.some(sub => sub.name === v.channel || sub.id === v.channelId));
                const searchTermVideos = allCachedVideos.filter(v => !subscriptions.some(sub => sub.name === v.channel || sub.id === v.channelId));
     
                // Separate same channel videos if we have a channel ID
                let sameChannelVideos = [];
                let otherVideos = allCachedVideos;
     
                if (currentChannelId) {
                    sameChannelVideos = allCachedVideos.filter(video => video.channelId === currentChannelId);
                    otherVideos = allCachedVideos.filter(video => video.channelId !== currentChannelId);
                }
     
                const totalCount = CONFIG.maxVideoPageVideos;
                
                // Reserve slot for next episode if found
                const reservedSlots = nextEpisode ? 1 : 0;
                const availableSlots = totalCount - reservedSlots;
                
                const sameChannelCount = Math.floor(availableSlots * CONFIG.sameChannelVideoPercentage);
                const searchTermCount = Math.floor((availableSlots - sameChannelCount) * CONFIG.searchTermVideoPercentage);
                const subscriptionCount = availableSlots - sameChannelCount - searchTermCount;
     
                // Select videos with weighting
                const selectedSameChannel = OptimizedUtils.shuffleArray(sameChannelVideos).slice(0, sameChannelCount);
                const selectedSearch = OptimizedUtils.shuffleArray(searchTermVideos).slice(0, searchTermCount);
                const selectedSubscription = OptimizedUtils.shuffleArray(subscriptionVideos).slice(0, subscriptionCount);
     
                // Fill remaining slots if any category doesn't have enough videos
                let combinedVideos = [...selectedSameChannel, ...selectedSearch, ...selectedSubscription];
                if (combinedVideos.length < availableSlots) {
                    const remaining = availableSlots - combinedVideos.length;
                    const additionalVideos = OptimizedUtils.shuffleArray(otherVideos).slice(0, remaining);
                    combinedVideos = [...combinedVideos, ...additionalVideos];
                }
     
                const finalVideos = OptimizedUtils.removeDuplicates(combinedVideos);
     
                // Add next episode at the VERY TOP if found
                if (nextEpisode) {
                    finalVideos.unshift(nextEpisode);
                    OptimizedUtils.log(`🎬 Next episode added to top: "${nextEpisode.title}"`);
                }
     
                OptimizedUtils.log(`Watch Next weighting: ${nextEpisode ? '1 next episode + ' : ''}${selectedSameChannel.length} same channel (${CONFIG.sameChannelVideoPercentage * 100}%) + ${selectedSearch.length} search (${CONFIG.searchTermVideoPercentage * 100}%) + ${selectedSubscription.length} subscription`);
     
                return finalVideos; // Don't shuffle to keep next episode at top
            }
     
            async loadVideosFromSubscriptions(isRefresh = false) {
                const subscriptions = this.subscriptionManager.getSubscriptions();
     
                if (subscriptions.length === 0) {
                    return [];
                }
     
                OptimizedUtils.log('Loading videos from subscriptions' + (isRefresh ? ' (refresh mode)' : '') + '...');
     
                const existingVideos = this.videoCache.get('subscription_videos') || [];
                const allVideos = [];
                const endDate = new Date(this.maxDate);
                endDate.setHours(23, 59, 59, 999);
     
                // Load viral videos
                const viralVideos = await this.apiManager.getViralVideos(endDate, isRefresh);
                OptimizedUtils.log('Loaded ' + viralVideos.length + ' viral videos');
     
                // Load from subscriptions in batches
                for (let i = 0; i < subscriptions.length; i += CONFIG.batchSize) {
                    const batch = subscriptions.slice(i, i + CONFIG.batchSize);
     
                    const batchPromises = batch.map(async (sub) => {
                        try {
                            let channelId = sub.id;
                            if (!channelId) {
                                channelId = await this.getChannelIdByName(sub.name);
                            }
     
                            if (channelId) {
                                const videos = await this.getChannelVideos(channelId, sub.name, endDate, isRefresh);
                                return videos;
                            }
                            return [];
                        } catch (error) {
                            OptimizedUtils.log('Failed to load videos for ' + sub.name + ':', error);
                            return [];
                        }
                    });
     
                    const batchResults = await Promise.all(batchPromises);
                    batchResults.forEach(videos => allVideos.push(...videos));
     
                    if (i + CONFIG.batchSize < subscriptions.length) {
                        await OptimizedUtils.sleep(CONFIG.apiCooldown);
                    }
                }
     
                // Mix videos for refresh mode
                let finalVideos = allVideos;
                if (isRefresh && existingVideos.length > 0) {
                    const existingViralVideos = this.videoCache.get('viral_videos') || [];
                    finalVideos = this.mixVideosForRefresh(finalVideos, existingVideos, viralVideos, existingViralVideos);
                    OptimizedUtils.log('Mixed ' + finalVideos.length + ' new videos with ' + existingVideos.length + ' existing videos');
                } else {
                    finalVideos = finalVideos.concat(viralVideos);
                }
     
                // Remove duplicates and shuffle final result
                finalVideos = OptimizedUtils.removeDuplicates(finalVideos);
                finalVideos = OptimizedUtils.shuffleArray(finalVideos);
     
                // Cache results
                this.videoCache.set('viral_videos', viralVideos);
                this.videoCache.set('subscription_videos', finalVideos);
                OptimizedUtils.log('Loaded ' + finalVideos.length + ' total videos from subscriptions');
     
                return finalVideos;
            }
     
            mixVideosForRefresh(newVideos, existingVideos, newViralVideos = [], existingViralVideos = []) {
                const totalDesired = Math.max(CONFIG.maxHomepageVideos, existingVideos.length);
                const viralVideoCount = Math.floor(totalDesired * CONFIG.viralVideoPercentage);
                const remainingSlots = totalDesired - viralVideoCount;
                const newVideoCount = Math.floor(remainingSlots * CONFIG.refreshVideoPercentage);
                const existingVideoCount = remainingSlots - newVideoCount;
     
                OptimizedUtils.log('Mixing videos: ' + newVideoCount + ' new + ' + existingVideoCount + ' existing + ' + viralVideoCount + ' viral');
     
                const selectedNew = OptimizedUtils.shuffleArray(newVideos).slice(0, newVideoCount);
                const selectedExisting = OptimizedUtils.shuffleArray(existingVideos).slice(0, existingVideoCount);
     
                const allViralVideos = newViralVideos.concat(existingViralVideos);
                const selectedViral = OptimizedUtils.shuffleArray(allViralVideos).slice(0, viralVideoCount);
     
                const mixedVideos = selectedNew.concat(selectedExisting).concat(selectedViral);
                return OptimizedUtils.shuffleArray(mixedVideos);
            }
     
            async getChannelIdByName(channelName) {
                const cacheKey = 'channel_id_' + channelName;
                let channelId = this.apiManager.getCache(cacheKey);
     
                if (!channelId) {
                    try {
                        const response = await this.apiManager.makeRequest(`${this.apiManager.baseUrl}/search`, {
                            part: 'snippet',
                            q: channelName,
                            type: 'channel',
                            maxResults: 1
                        });
     
                        if (response.items && response.items.length > 0) {
                            channelId = response.items[0].snippet.channelId;
                            this.apiManager.setCache(cacheKey, channelId);
                            this.stats.apiCalls++;
                        }
                    } catch (error) {
                        OptimizedUtils.log('Failed to find channel ID for ' + channelName + ':', error);
                    }
                } else {
                    this.stats.cacheHits++;
                }
     
                return channelId;
            }
     
            async getChannelVideos(channelId, channelName, endDate, forceRefresh = false) {
                const cacheKey = 'channel_videos_' + channelId + '_' + this.settings.date;
                let videos = this.apiManager.getCache(cacheKey, forceRefresh);
     
                if (!videos) {
                    try {
                        const response = await this.apiManager.makeRequest(`${this.apiManager.baseUrl}/search`, {
                            part: 'snippet',
                            channelId: channelId,
                            type: 'video',
                            order: 'date',
                            publishedBefore: endDate.toISOString(),
                            maxResults: CONFIG.videosPerChannel
                        });
     
                        videos = response.items ? response.items.map(item => ({
                            id: item.id.videoId,
                            title: item.snippet.title,
                            channel: item.snippet.channelTitle || channelName,
                            channelId: item.snippet.channelId,
                            thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
                            publishedAt: item.snippet.publishedAt,
                            description: item.snippet.description || '',
                            viewCount: this.apiManager.generateRealisticViewCount(item.snippet.publishedAt, endDate),
                            relativeDate: OptimizedUtils.calculateRelativeDate(item.snippet.publishedAt, endDate)
                        })) : [];
     
                        this.apiManager.setCache(cacheKey, videos, forceRefresh);
                        this.stats.apiCalls++;
                    } catch (error) {
                        OptimizedUtils.log('Failed to get videos for channel ' + channelName + ':', error);
                        videos = [];
                    }
                } else {
                    this.stats.cacheHits++;
                }
     
                return videos;
            }
     
            // === PAGE HANDLING ===
            startFiltering() {
                OptimizedUtils.log('Starting ultra-aggressive video filtering...');
     
                const filterVideos = () => {
                    if (this.isProcessing || !this.settings.active) return;
                    this.isProcessing = true;
     
                    const videoSelectors = [
                        'ytd-video-renderer',
                        'ytd-grid-video-renderer',
                        'ytd-rich-item-renderer',
                        'ytd-compact-video-renderer',
                        'ytd-movie-renderer',
                        'ytd-playlist-renderer'
                    ];
     
                    let processed = 0;
                    let filtered = 0;
     
                    videoSelectors.forEach(selector => {
                        const videos = document.querySelectorAll(selector);
                        videos.forEach(video => {
                            if (video.dataset.tmProcessed) return;
     
                            video.dataset.tmProcessed = 'true';
                            processed++;
     
                            if (this.shouldHideVideo(video)) {
                                video.style.display = 'none';
                                filtered++;
                            }
                        });
                    });
     
                    if (processed > 0) {
                        this.stats.processed += processed;
                        this.stats.filtered += filtered;
                    }
     
                    this.isProcessing = false;
                };
     
                setInterval(filterVideos, CONFIG.updateInterval);
            }
     
            shouldHideVideo(videoElement) {
                // Check for Shorts
                if (this.isShorts(videoElement)) {
                    return true;
                }
     
                // Check video date
                const videoDate = this.extractVideoDate(videoElement);
                if (videoDate && videoDate > this.maxDate) {
                    return true;
                }
     
                return false;
            }
     
            isShorts(element) {
                const shortsIndicators = CONFIG.SHORTS_SELECTORS;
     
                return shortsIndicators.some(selector => {
                    try {
                        return element.matches(selector) || element.querySelector(selector);
                    } catch (e) {
                        return false;
                    }
                });
            }
     
            extractVideoDate(videoElement) {
                const dateSelectors = [
                    '#metadata-line span:last-child',
                    '#published-time-text',
                    '[aria-label*="ago"]'
                ];
     
                for (const selector of dateSelectors) {
                    const element = videoElement.querySelector(selector);
                    if (element) {
                        const dateText = element.textContent?.trim();
                        if (dateText) {
                            return this.parseRelativeDate(dateText);
                        }
                    }
                }
     
                return null;
            }
     
            parseRelativeDate(dateText) {
                const now = this.maxDate;
                const text = dateText.toLowerCase();
     
                const minuteMatch = text.match(/(\d+)\s*minutes?\s*ago/);
                if (minuteMatch) {
                    return new Date(now.getTime() - parseInt(minuteMatch[1]) * 60 * 1000);
                }
     
                const hourMatch = text.match(/(\d+)\s*hours?\s*ago/);
                if (hourMatch) {
                    return new Date(now.getTime() - parseInt(hourMatch[1]) * 60 * 60 * 1000);
                }
     
                const dayMatch = text.match(/(\d+)\s*days?\s*ago/);
                if (dayMatch) {
                    return new Date(now.getTime() - parseInt(dayMatch[1]) * 24 * 60 * 60 * 1000);
                }
     
                const weekMatch = text.match(/(\d+)\s*weeks?\s*ago/);
                if (weekMatch) {
                    return new Date(now.getTime() - parseInt(weekMatch[1]) * 7 * 24 * 60 * 60 * 1000);
                }
     
                const monthMatch = text.match(/(\d+)\s*months?\s*ago/);
                if (monthMatch) {
                    return new Date(now.getTime() - parseInt(monthMatch[1]) * 30 * 24 * 60 * 60 * 1000);
                }
     
                const yearMatch = text.match(/(\d+)\s*years?\s*ago/);
                if (yearMatch) {
                    return new Date(now.getTime() - parseInt(yearMatch[1]) * 365 * 24 * 60 * 60 * 1000);
                }
     
                return null;
            }
     
            startHomepageReplacement() {
                // More aggressive immediate hiding of original homepage
                const nukeOriginalContent = () => {
                    if (!this.isHomePage()) return;
     
                    const selectors = [
                        'ytd-rich-grid-renderer',
                        'ytd-rich-section-renderer', 
                        '#contents ytd-rich-item-renderer',
                        'ytd-browse[page-subtype="home"] #contents',
                        '.ytd-rich-grid-renderer'
                    ];
     
                    selectors.forEach(selector => {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(el => {
                            if (!el.dataset.tmNuked && !el.dataset.tmReplaced) {
                                el.style.opacity = '0';
                                el.style.visibility = 'hidden';
                                el.dataset.tmNuked = 'true';
                            }
                        });
                    });
                };
     
                const replaceHomepage = () => {
                    if (this.isHomePage() && this.settings.active) {
                        const container = document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer');
                        if (container && !container.dataset.tmReplaced) {
                            container.dataset.tmReplaced = 'true';
                            container.style.opacity = '1';
                            container.style.visibility = 'visible';
                            this.replaceHomepage(container);
                        }
                    }
                };
     
                // Immediately nuke original content
                nukeOriginalContent();
     
                // Continuous nuking and replacement
                setInterval(() => {
                    nukeOriginalContent();
                    replaceHomepage();
                }, 100); // More frequent to catch dynamic content
            }
     
            isHomePage() {
                return location.pathname === '/' || location.pathname === '';
            }
     
            async replaceHomepage(container, isRefresh = false) {
                OptimizedUtils.log('Replacing homepage' + (isRefresh ? ' (refresh)' : '') + '...');
     
                container.innerHTML = '<div class="tm-loading">Loading...</div>';
     
                try {
                    // Use SINGLE unified cache - no separate checking
                    const cacheKey = `all_videos_unified_${this.maxDate.toDateString()}`;
                    let videos = this.videoCache.get(cacheKey) || this.videoCache.get('all_videos');
                    
                    OptimizedUtils.log('Homepage cache check:', videos ? `${videos.length} cached videos found` : 'No cached videos');
     
                    if (!videos || videos.length === 0) {
                        // Keep trying without timeout - let it load as long as needed
                        try {
                            videos = await this.loadAllVideos(isRefresh);
                        } catch (error) {
                            OptimizedUtils.log('Failed to load videos:', error);
                            videos = [];
                        }
                    }
     
                    if (videos && videos.length > 0) {
                        // Completely randomize videos each time
                        // Use weighted shuffle to favor newer videos while keeping older ones visible
                        this.allHomepageVideos = OptimizedUtils.weightedShuffleByDate(videos, this.maxDate);
                        this.currentVideoIndex = 0;
     
                        // Show initial batch - use smaller initial count to ensure "Load more" appears
                        const initialBatchSize = Math.min(CONFIG.homepageLoadMoreSize || 20, this.allHomepageVideos.length);
                        const initialVideos = this.allHomepageVideos.slice(0, initialBatchSize);
                        this.currentVideoIndex = initialBatchSize;
     
                        const videoCards = initialVideos.map(video => `
                            <div class="tm-video-card" data-video-id="${video.id}">
                                <img src="${video.thumbnail}" alt="${video.title}">
                                <div class="tm-video-info">
                                    <div class="tm-video-title">${video.title}</div>
                                    <div class="tm-video-channel">${video.channel}</div>
                                    <div class="tm-video-meta">
                                        <span>${video.viewCount} views</span>
                                        <span>•</span>
                                        <span>${video.relativeDate}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('');
     
                        const hasMoreVideos = this.currentVideoIndex < this.allHomepageVideos.length;
     
                        container.innerHTML = `
                            <div style="margin-bottom: 20px; text-align: center;">
                                <button id="tm-new-videos-btn" style="
                                    background: #ff0000; 
                                    color: white; 
                                    border: none; 
                                    padding: 12px 24px; 
                                    border-radius: 6px; 
                                    font-size: 14px; 
                                    font-weight: 500;
                                    cursor: pointer;
                                    transition: background-color 0.2s;
                                ">New videos</button>
                            </div>
                            <div class="tm-homepage-grid" id="tm-video-grid">${videoCards}</div>
                            ${hasMoreVideos ? `
                            <div style="margin: 30px 0; text-align: center;">
                                <button id="tm-load-more-btn" style="
                                    background: #333; 
                                    color: white; 
                                    border: none; 
                                    padding: 12px 24px; 
                                    border-radius: 6px; 
                                    font-size: 14px; 
                                    cursor: pointer;
                                    transition: background-color 0.2s;
                                ">Load more videos</button>
                            </div>
                            ` : ''}
                        `;
     
                        this.attachHomepageClickHandlers();
                        this.attachNewVideosButton();
                        this.attachLoadMoreButton();
                    } else {
                        // Show helpful message when no videos are available
                        container.innerHTML = `
                            <div class="tm-no-content" style="text-align: center; padding: 40px;">
                                <h3>No videos found for ${this.maxDate.toLocaleDateString()}</h3>
                                <p>This could mean:</p>
                                <ul style="text-align: left; display: inline-block;">
                                    <li>No API keys are configured</li>
                                    <li>No subscriptions are set up</li>
                                    <li>No videos were uploaded before this date</li>
                                </ul>
                                <p>Click the ⚙️ button to add API keys and configure subscriptions.</p>
                            </div>
                        `;
                    }
                } catch (error) {
                    OptimizedUtils.log('Homepage replacement failed:', error);
                    container.innerHTML = `
                        <div class="tm-error" style="text-align: center; padding: 40px; color: #f44336;">
                            <h3>Failed to load content</h3>
                            <p>Error: ${error.message}</p>
                            <p>Check your API keys and try again.</p>
                        </div>
                    `;
                }
            }
     
            attachHomepageClickHandlers() {
                document.querySelectorAll('.tm-video-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const videoId = card.dataset.videoId;
                        if (videoId) {
                            window.location.href = '/watch?v=' + videoId;
                        }
                    });
                });
            }
     
            attachNewVideosButton() {
                const button = document.getElementById('tm-new-videos-btn');
                if (button) {
                    button.addEventListener('click', async () => {
                        button.textContent = 'Loading...';
                        button.disabled = true;
     
                        try {
                            await this.loadAllVideos(true);
                            const container = document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer');
                            if (container) {
                                container.dataset.tmReplaced = '';
                                this.replaceHomepage(container, true);
                            }
                        } catch (error) {
                            OptimizedUtils.log('Failed to load new videos:', error);
                            button.textContent = 'New videos';
                            button.disabled = false;
                        }
                    });
     
                    button.addEventListener('mouseenter', () => {
                        button.style.backgroundColor = '#d50000';
                    });
     
                    button.addEventListener('mouseleave', () => {
                        button.style.backgroundColor = '#ff0000';
                    });
                }
            }
     
            attachLoadMoreButton() {
                const button = document.getElementById('tm-load-more-btn');
                if (!button) return;
     
                button.addEventListener('click', () => {
                    const videoGrid = document.getElementById('tm-video-grid');
                    if (!videoGrid || !this.allHomepageVideos || this.currentVideoIndex >= this.allHomepageVideos.length) return;
     
                    const nextBatch = this.allHomepageVideos.slice(
                        this.currentVideoIndex, 
                        this.currentVideoIndex + CONFIG.homepageLoadMoreSize
                    );
     
                    if (nextBatch.length === 0) return;
     
                    const videoCards = nextBatch.map(video => `
                        <div class="tm-video-card" data-video-id="${video.id}">
                            <img src="${video.thumbnail}" alt="${video.title}">
                            <div class="tm-video-info">
                                <div class="tm-video-title">${video.title}</div>
                                <div class="tm-video-channel">${video.channel}</div>
                                <div class="tm-video-meta">
                                    <span>${video.viewCount} views</span>
                                    <span>•</span>
                                    <span>${video.relativeDate}</span>
                                </div>
                            </div>
                        </div>
                    `).join('');
     
                    videoGrid.innerHTML += videoCards;
                    this.currentVideoIndex += nextBatch.length;
     
                    // Attach click handlers to new cards - use event delegation
                    this.attachHomepageClickHandlers();
     
                    // Hide button if no more videos
                    if (this.currentVideoIndex >= this.allHomepageVideos.length) {
                        button.style.display = 'none';
                    }
                });
     
                button.addEventListener('mouseenter', () => {
                    button.style.backgroundColor = '#555';
                });
     
                button.addEventListener('mouseleave', () => {
                    button.style.backgroundColor = '#333';
                });
            }
     
            startVideoPageEnhancement() {
                // Watch for URL changes to detect new video clicks
                let currentVideoId = new URL(location.href).searchParams.get('v');
     
                const checkVideoPage = () => {
                    if (location.pathname === '/watch' && this.settings.active) {
                        const newVideoId = new URL(location.href).searchParams.get('v');
     
                        // More aggressive and frequent content nuking
                        this.nukeOriginalWatchNextContent();
     
                        const sidebar = document.querySelector('#secondary #secondary-inner');
                        if (sidebar) {
                            if (!sidebar.dataset.tmEnhanced || newVideoId !== currentVideoId) {
                                sidebar.dataset.tmEnhanced = 'true';
                                currentVideoId = newVideoId;
                                this.enhanceVideoPage(sidebar);
                            }
                            // Continuously nuke original content to prevent it from reappearing
                            setTimeout(() => this.nukeOriginalWatchNextContent(), 100);
                            setTimeout(() => this.nukeOriginalWatchNextContent(), 500);
                            setTimeout(() => this.nukeOriginalWatchNextContent(), 1000);
                        }
                    }
                };
     
                // Check more frequently
                setInterval(checkVideoPage, 200);
     
                // Listen for popstate events (back/forward navigation)
                window.addEventListener('popstate', () => setTimeout(checkVideoPage, 50));
     
                // Listen for pushstate events (clicking on videos)
                const originalPushState = history.pushState;
                history.pushState = function() {
                    originalPushState.apply(this, arguments);
                    setTimeout(checkVideoPage, 50);
                };
     
                // Also listen for replaceState
                const originalReplaceState = history.replaceState;
                history.replaceState = function() {
                    originalReplaceState.apply(this, arguments);
                    setTimeout(checkVideoPage, 50);
                };
            }
     
            nukeOriginalWatchNextContent() {
                const selectors = [
                    '#related', 
                    'ytd-watch-next-secondary-results-renderer',
                    '#secondary #secondary-inner > *:not(.tm-watch-next):not([data-tm-enhanced])',
                    'ytd-compact-video-renderer:not([data-tm-enhanced])',
                    'ytd-continuation-item-renderer',
                    '#secondary-inner ytd-item-section-renderer:not([data-tm-enhanced])',
                    '#secondary-inner ytd-shelf-renderer:not([data-tm-enhanced])',
                    'ytd-watch-next-secondary-results-renderer *',
                    '#secondary-inner > ytd-watch-next-secondary-results-renderer'
                ];
     
                selectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        if (!el.classList.contains('tm-watch-next') && !el.dataset.tmEnhanced) {
                            el.style.display = 'none !important';
                            el.style.visibility = 'hidden';
                            el.style.height = '0';
                            el.style.overflow = 'hidden';
                            el.setAttribute('data-tm-nuked', 'true');
                        }
                    });
                });
            }
     
            async enhanceVideoPage(sidebar) {
                if (!this.settings.active) return;
     
                OptimizedUtils.log('Enhancing video page...');
     
                // Clear everything first
                this.clearSidebar(sidebar);
     
                // Create permanent container
                const permanentContainer = document.createElement('div');
                permanentContainer.id = 'tm-permanent-sidebar';
                permanentContainer.dataset.tmEnhanced = 'true';
                permanentContainer.style.cssText = `
                    position: relative !important;
                    z-index: 999999 !important;
                    background: #0f0f0f !important;
                    min-height: 400px !important;
                `;
     
                // Silent loading - no visible indicator
                permanentContainer.innerHTML = '<div style="height: 20px;"></div>';
     
                sidebar.innerHTML = '';
                sidebar.appendChild(permanentContainer);
     
                try {
                    // Get current video information for same-channel weighting and series advancement
                    const currentVideoId = this.getCurrentVideoId();
                    const currentChannelId = await this.getCurrentChannelId(currentVideoId);
                    
                    // Get current video title and channel name from page DOM
                    const currentVideoTitle = this.getCurrentVideoTitle();
                    const currentChannelName = this.getCurrentChannelName();
     
                    // FIXED: Use SINGLE unified cache - no separate checking or combining
                    const cacheKey = `all_videos_unified_${this.maxDate.toDateString()}`;
                    let videos = this.videoCache.get(cacheKey) || this.videoCache.get('all_videos');
                    
                    if (!videos || videos.length === 0) {
                        // Only load if absolutely no cached videos exist
                        OptimizedUtils.log('No cached videos found, loading initial set...');
                        videos = await this.loadAllVideos(false); 
                    } else {
                        OptimizedUtils.log(`Using ${videos.length} cached videos for watch next (no reload)`);
                    }
     
                    if (videos && videos.length > 0) {
                        // Apply watch next weighting with same channel priority and series advancement
                        const weightedVideos = await this.createWatchNextWeightedVideos(videos, currentChannelId, currentVideoTitle, currentChannelName);
     
                        // Store all videos for load more functionality
                        this.allWatchNextVideos = weightedVideos;
                        this.currentWatchNextIndex = 0;
     
                        // Use smaller initial batch to ensure "Load more" appears
                        const initialBatchSize = Math.min(CONFIG.homepageLoadMoreSize || 12, this.allWatchNextVideos.length);
                        const initialBatch = this.allWatchNextVideos.slice(0, initialBatchSize);
                        this.currentWatchNextIndex = initialBatch.length;
     
                        this.createWatchNextSectionInContainer(permanentContainer, initialBatch);
                    } else {
                        permanentContainer.innerHTML = `
                            <div style="padding: 20px; text-align: center; border: 1px solid #f44336; margin: 10px 0;">
                                <div style="color: #f44336; font-weight: bold;">No videos found for ${this.maxDate.toLocaleDateString()}</div>
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">Check your API keys in settings</div>
                            </div>
                        `;
                    }
                } catch (error) {
                    OptimizedUtils.log('Video page enhancement failed:', error);
                    permanentContainer.innerHTML = `
                        <div style="padding: 20px; text-align: center; border: 1px solid #f44336; margin: 10px 0;">
                            <div style="color: #f44336; font-weight: bold;">Error loading content</div>
                            <div style="font-size: 12px; color: #666; margin-top: 5px;">${error.message}</div>
                        </div>
                    `;
                }
     
                // Protect our container from being removed
                this.protectSidebarContent(permanentContainer);
            }
     
            clearSidebar(sidebar) {
                // Completely clear sidebar
                const children = [...sidebar.children];
                children.forEach(child => {
                    if (!child.dataset.tmEnhanced) {
                        child.remove();
                    }
                });
            }
     
            protectSidebarContent(container) {
                // Set up mutation observer to protect our content
                if (this.sidebarProtector) {
                    this.sidebarProtector.disconnect();
                }
     
                this.sidebarProtector = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            // If our container was removed, re-add it
                            if (!document.getElementById('tm-permanent-sidebar')) {
                                const sidebar = document.querySelector('#secondary #secondary-inner');
                                if (sidebar && container.parentNode !== sidebar) {
                                    sidebar.innerHTML = '';
                                    sidebar.appendChild(container);
                                }
                            }
     
                            // Remove any new content that's not ours
                            const sidebar = document.querySelector('#secondary #secondary-inner');
                            if (sidebar) {
                                const children = [...sidebar.children];
                                children.forEach(child => {
                                    if (child.id !== 'tm-permanent-sidebar' && !child.dataset.tmEnhanced) {
                                        child.style.display = 'none';
                                    }
                                });
                            }
                        }
                    });
                });
     
                const sidebar = document.querySelector('#secondary #secondary-inner');
                if (sidebar) {
                    this.sidebarProtector.observe(sidebar, {
                        childList: true,
                        subtree: true
                    });
                }
            }
     
            createWatchNextSectionInContainer(container, videos) {
                const videoCards = videos.map(video => {
                    // Remove the "NEXT EPISODE" badge as requested
                    const nextEpisodeBadge = '';
                    
                    return `
                        <div class="tm-watch-next-card" data-video-id="${video.id}" style="position: relative;">
                            ${nextEpisodeBadge}
                            <img src="${video.thumbnail}" alt="${video.title}">
                            <div class="tm-watch-next-info">
                                <div class="tm-watch-next-title">${video.title}</div>
                                <div class="tm-watch-next-channel">${video.channel}</div>
                                <div class="tm-watch-next-meta">${video.viewCount} views • ${video.relativeDate}</div>
                            </div>
                        </div>
                    `;
                }).join('');
     
                container.innerHTML = `
                    <div class="tm-watch-next">
                        <h3>Watch next</h3>
                        <div class="tm-watch-next-grid" id="tm-watch-next-grid">${videoCards}</div>
                    </div>
                `;
     
                this.attachWatchNextClickHandlers();
                this.setupWatchNextLoadMore(container);
            }
     
            setupWatchNextLoadMore(container) {
                // Add load more button if there are more videos
                if (this.allWatchNextVideos && this.currentWatchNextIndex < this.allWatchNextVideos.length) {
                    const loadMoreBtn = document.createElement('button');
                    loadMoreBtn.id = 'tm-watch-next-load-more';
                    loadMoreBtn.style.cssText = `
                        width: 100%;
                        background: #333;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 6px;
                        font-size: 14px;
                        cursor: pointer;
                        margin-top: 16px;
                        transition: background-color 0.2s;
                    `;
                    loadMoreBtn.textContent = 'Load more suggestions';
     
                    const watchNextSection = container.querySelector('.tm-watch-next');
                    watchNextSection.appendChild(loadMoreBtn);
     
                    loadMoreBtn.addEventListener('click', () => {
                        const watchNextGrid = document.getElementById('tm-watch-next-grid');
                        if (!watchNextGrid || !this.allWatchNextVideos || this.currentWatchNextIndex >= this.allWatchNextVideos.length) return;
     
                        const nextBatch = this.allWatchNextVideos.slice(
                            this.currentWatchNextIndex,
                            this.currentWatchNextIndex + CONFIG.homepageLoadMoreSize
                        );
     
                        if (nextBatch.length === 0) return;
     
                        const videoCards = nextBatch.map(video => `
                            <div class="tm-watch-next-card" data-video-id="${video.id}">
                                <img src="${video.thumbnail}" alt="${video.title}">
                                <div class="tm-watch-next-info">
                                    <div class="tm-watch-next-title">${video.title}</div>
                                    <div class="tm-watch-next-channel">${video.channel}</div>
                                    <div class="tm-watch-next-meta">${video.viewCount} views • ${video.relativeDate}</div>
                                </div>
                            </div>
                        `).join('');
     
                        watchNextGrid.innerHTML += videoCards;
                        this.currentWatchNextIndex += nextBatch.length;
     
                        // Reattach click handlers
                        this.attachWatchNextClickHandlers();
     
                        // Hide button if no more videos
                        if (this.currentWatchNextIndex >= this.allWatchNextVideos.length) {
                            loadMoreBtn.style.display = 'none';
                        }
                    });
     
                    loadMoreBtn.addEventListener('mouseenter', () => {
                        loadMoreBtn.style.backgroundColor = '#555';
                    });
     
                    loadMoreBtn.addEventListener('mouseleave', () => {
                        loadMoreBtn.style.backgroundColor = '#333';
                    });
                }
            }
     
     
     
            attachWatchNextClickHandlers() {
                document.querySelectorAll('.tm-watch-next-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const videoId = card.dataset.videoId;
                        if (videoId) {
                            window.location.href = '/watch?v=' + videoId;
                        }
                    });
                });
            }
     
     
     
            setupAutoRefresh() {
                if (CONFIG.autoRefreshInterval) {
                    OptimizedUtils.log('Setting up auto-refresh every ' + (CONFIG.autoRefreshInterval / 60000) + ' minutes');
     
                    setInterval(() => {
                        if (this.isHomePage() && this.settings.active) {
                            OptimizedUtils.log('Auto-refresh triggered');
                            this.loadAllVideos(true).then(() => {
                                const container = document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer');
                                if (container) {
                                    this.replaceHomepage(container, true);
                                }
                            });
                        }
                    }, CONFIG.autoRefreshInterval);
                }
            }
     
            // === PUBLIC API METHODS ===
            removeApiKey(index) {
                if (this.apiManager.removeKey(this.apiManager.keys[index])) {
                    this.uiManager.updateUI();
                }
            }
     
            removeSubscription(index) {
                if (this.subscriptionManager.removeSubscription(index)) {
                    this.uiManager.updateUI();
                }
            }
     
            getStats() {
                return {
                    apiCalls: this.stats.apiCalls,
                    processed: this.stats.processed,
                    cacheHits: this.stats.cacheHits,
                    filtered: this.stats.filtered,
                    isActive: this.settings.active,
                    currentDate: this.settings.date
                };
            }
     
            cleanup() {
                if (this.autoRefreshTimer) {
                    clearInterval(this.autoRefreshTimer);
                }
                if (this.filterTimer) {
                    clearInterval(this.filterTimer);
                }
     
                OptimizedUtils.log('Application cleaned up');
            }
     
            getMaxDate() {
                return new Date(this.settings.date);
            }
     
            // Cache watched videos for channel page and general use
            cacheWatchedVideo(videoId) {
                if (!videoId) return;
     
                // Get current video details from page if possible
                const videoData = this.extractCurrentVideoData(videoId);
     
                if (videoData) {
                    const existingWatchedVideos = GM_getValue('wayback_watched_videos_cache', []);
     
                    const videoToCache = {
                        id: videoId,
                        title: videoData.title || 'Unknown Title',
                        channel: videoData.channel || 'Unknown Channel',
                        channelId: videoData.channelId || '',
                        thumbnail: videoData.thumbnail || '',
                        publishedAt: videoData.publishedAt || new Date().toISOString(),
                        description: videoData.description || '',
                        viewCount: videoData.viewCount || 'Unknown',
                        cachedAt: new Date().toISOString(),
                        source: 'watched_video'
                    };
     
                    // Check if already cached
                    const existingIndex = existingWatchedVideos.findIndex(v => v.id === videoId);
                    if (existingIndex >= 0) {
                        // Update existing entry
                        existingWatchedVideos[existingIndex] = videoToCache;
                    } else {
                        // Add new entry
                        existingWatchedVideos.push(videoToCache);
                    }
     
                    // Limit cache size
                    if (existingWatchedVideos.length > 5000) {
                        existingWatchedVideos.sort((a, b) => new Date(b.cachedAt) - new Date(a.cachedAt));
                        existingWatchedVideos.splice(5000);
                    }
     
                    GM_setValue('wayback_watched_videos_cache', existingWatchedVideos);
                    OptimizedUtils.log(`Cached watched video: ${videoToCache.title}`);
                }
            }
     
            extractCurrentVideoData(videoId) {
                // Try to extract video data from current page
                try {
                    const titleElement = document.querySelector('h1.title yt-formatted-string, h1.ytd-video-primary-info-renderer yt-formatted-string');
                    const channelElement = document.querySelector('#owner-name a, #upload-info #channel-name a, ytd-channel-name a');
                    const publishElement = document.querySelector('#info-strings yt-formatted-string, #date yt-formatted-string');
                    const descElement = document.querySelector('#description yt-formatted-string, #meta-contents yt-formatted-string');
                    const thumbnailElement = document.querySelector('video');
     
                    return {
                        title: titleElement?.textContent?.trim() || 'Unknown Title',
                        channel: channelElement?.textContent?.trim() || 'Unknown Channel',
                        channelId: OptimizedUtils.extractChannelId(channelElement?.href || '') || '',
                        thumbnail: thumbnailElement?.poster || '',
                        publishedAt: this.parsePublishDate(publishElement?.textContent?.trim()) || new Date().toISOString(),
                        description: descElement?.textContent?.trim()?.substring(0, 200) || '',
                        viewCount: this.extractViewCount() || 'Unknown'
                    };
                } catch (error) {
                    OptimizedUtils.log('Error extracting video data:', error);
                    return null;
                }
            }
     
            parsePublishDate(dateText) {
                if (!dateText) return null;
     
                // Handle "X years ago", "X months ago", etc.
                const relativeMatch = dateText.match(/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);
                if (relativeMatch) {
                    const amount = parseInt(relativeMatch[1]);
                    const unit = relativeMatch[2].toLowerCase();
                    const date = new Date();
     
                    switch (unit) {
                        case 'second':
                            date.setSeconds(date.getSeconds() - amount);
                            break;
                        case 'minute':
                            date.setMinutes(date.getMinutes() - amount);
                            break;
                        case 'hour':
                            date.setHours(date.getHours() - amount);
                            break;
                        case 'day':
                            date.setDate(date.getDate() - amount);
                            break;
                        case 'week':
                            date.setDate(date.getDate() - (amount * 7));
                            break;
                        case 'month':
                            date.setMonth(date.getMonth() - amount);
                            break;
                        case 'year':
                            date.setFullYear(date.getFullYear() - amount);
                            break;
                    }
     
                    return date.toISOString();
                }
     
                return null;
            }
     
            extractViewCount() {
                const viewElement = document.querySelector('#count .view-count, #info-strings yt-formatted-string');
                if (viewElement) {
                    const viewText = viewElement.textContent.trim();
                    const viewMatch = viewText.match(/([\d,]+)\s*views?/i);
                    return viewMatch ? viewMatch[1].replace(/,/g, '') : null;
                }
                return null;
            }
     
            replaceChannelPageWithCache() {
                const channelId = OptimizedUtils.extractChannelId(window.location.href);
                if (!channelId) return;
     
                const cachedVideos = this.getAllCachedChannelVideos(channelId);
                if (cachedVideos.length > 0) {
                    this.replaceChannelPageVideos(cachedVideos, channelId);
                } else {
                    // Show placeholder for empty cache
                    this.showEmptyChannelCache(channelId);
                }
            }
     
            getAllCachedChannelVideos(channelId) {
                // Check multiple sources for channel videos
                const watchedVideos = GM_getValue('wayback_watched_videos_cache', []);
                const subscriptionVideos = this.videoCache.get('subscription_videos_only') || [];
                const searchTermVideos = this.videoCache.get('search_term_videos_only') || [];
                const allCachedVideos = this.videoCache.get('all_videos') || [];
                
                // Combine all sources and filter by channel
                const allVideoSources = [...watchedVideos, ...subscriptionVideos, ...searchTermVideos, ...allCachedVideos];
                
                OptimizedUtils.log(`Searching for channel videos with ID: "${channelId}"`);
                OptimizedUtils.log(`Total videos to search: ${allVideoSources.length}`);
                
                // Filter videos for this channel and sort by date (newest first)  
                const channelVideos = allVideoSources
                    .filter(video => video.channelId === channelId)
                    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
     
                OptimizedUtils.log(`Found ${channelVideos.length} cached videos for channel ${channelId}`);
                return channelVideos;
            }
     
            showEmptyChannelCache(channelId) {
                // More aggressive channel content clearing
                const channelSelectors = [
                    '#contents', 
                    '#primary-inner', 
                    'div[page-subtype="channels"]',
                    '.page-container',
                    '#page-manager',
                    'ytd-browse[page-subtype="channels"]'
                ];
     
                let channelContent = null;
                for (const selector of channelSelectors) {
                    channelContent = document.querySelector(selector);
                    if (channelContent) break;
                }
     
                if (!channelContent) {
                    // Fallback: use body if we can't find specific containers
                    channelContent = document.body;
                }
     
                // Remove ALL existing YouTube channel content more aggressively
                const contentToRemove = channelContent.querySelectorAll(`
                    ytd-c4-tabbed-header-renderer,
                    ytd-channel-video-player-renderer,
                    ytd-section-list-renderer,
                    ytd-item-section-renderer,
                    ytd-grid-renderer,
                    ytd-shelf-renderer,
                    .ytd-browse,
                    #contents > *:not(#wayback-channel-content),
                    .channel-header,
                    .branded-page-v2-container
                `);
                
                contentToRemove.forEach(element => {
                    if (element.id !== 'wayback-channel-content') {
                        element.style.display = 'none';
                    }
                });
     
                // Remove existing wayback content
                const existingContent = document.querySelector('#wayback-channel-content');
                if (existingContent) {
                    existingContent.remove();
                }
     
                // Create our replacement content
                const channelContainer = document.createElement('div');
                channelContainer.id = 'wayback-channel-content';
                channelContainer.style.cssText = `
                    position: relative;
                    z-index: 9999;
                    background: white;
                    min-height: 400px;
                    width: 100%;
                    padding: 20px;
                `;
                
                channelContainer.innerHTML = `
                    <div style="padding: 40px; background: #f9f9f9; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <h3 style="margin: 0 0 16px 0; color: #333;">No Cached Videos Found</h3>
                        <p style="margin: 0 0 20px 0; color: #666;">
                            No videos have been cached for this channel yet. Watch some videos from this channel 
                            or use the search button below to find historical content.
                        </p>
                        <button id="wayback-search-more-channel" class="wayback-button" style="
                            background: #ff4444; color: white; border: none; padding: 12px 24px; 
                            border-radius: 4px; cursor: pointer; font-size: 14px;
                        ">
                            🔍 Search Channel Videos
                        </button>
                    </div>
                `;
     
                // Insert at the very beginning
                if (channelContent.firstChild) {
                    channelContent.insertBefore(channelContainer, channelContent.firstChild);
                } else {
                    channelContent.appendChild(channelContainer);
                }
     
                // Fix the function reference - get the correct context
                const searchButton = document.querySelector('#wayback-search-more-channel');
                if (searchButton) {
                    searchButton.addEventListener('click', () => {
                        // Access through the global waybackTubeManager reference
                        if (window.waybackTubeManager && window.waybackTubeManager.searchMoreChannelVideos) {
                            window.waybackTubeManager.searchMoreChannelVideos(channelId, 'This Channel');
                        } else {
                            console.error('WayBackTube: searchMoreChannelVideos function not available');
                        }
                    });
                }
            }
     
            setupChannelPageMonitoring() {
                // Monitor for URL changes to detect channel page navigation
                let currentUrl = window.location.href;
     
                const checkUrlChange = () => {
                    if (window.location.href !== currentUrl) {
                        currentUrl = window.location.href;
                        if (OptimizedUtils.getCurrentPage() === 'channel' && this.settings.active) {
                            setTimeout(() => {
                                this.replaceChannelPageWithCache();
                            }, 1500); // Give page time to load
                        }
                    }
                };
     
                // Check URL changes frequently
                setInterval(checkUrlChange, 1000);
     
                // Also monitor DOM changes for channel page content
                const observer = new MutationObserver(() => {
                    if (OptimizedUtils.getCurrentPage() === 'channel' && this.settings.active) {
                        // Debounce the replacement to avoid excessive calls
                        clearTimeout(this.channelReplaceTimeout);
                        this.channelReplaceTimeout = setTimeout(() => {
                            this.replaceChannelPageWithCache();
                        }, 2000);
                    }
                });
     
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }
     
        // === WORKING SEARCH ENHANCEMENT (COPIED VERBATIM) ===
        class OptimizedSearchEnhancement {
            constructor(timeMachine) {
                this.timeMachine = timeMachine;
                this.maxDate = timeMachine.getMaxDate();
                this.interceptedElements = new Set();
                this.init();
            }
     
            init() {
                this.log('Search enhancement starting...');
                this.setupSearchInterception();
                this.cleanupSearchResults();
                this.hideSearchSuggestions();
            }
     
            log(message, ...args) {
                if (CONFIG.debugMode) {
                    console.log('[WayBackTube Search]', message, ...args);
                }
            }
     
            setupSearchInterception() {
                // Monitor for new elements being added to the page
                const observer = new MutationObserver(() => {
                    this.interceptSearchInputs();
                    this.interceptSearchButtons();
                });
     
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
     
                // Initial setup
                this.interceptSearchInputs();
                this.interceptSearchButtons();
            }
     
            interceptSearchInputs() {
                const interceptInput = (input) => {
                    if (this.interceptedElements.has(input)) return;
                    this.interceptedElements.add(input);
     
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.performSearch(input.value.trim(), input);
                        }
                    });
     
                    // Also intercept form submissions
                    const form = input.closest('form');
                    if (form && !this.interceptedElements.has(form)) {
                        this.interceptedElements.add(form);
                        form.addEventListener('submit', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.performSearch(input.value.trim(), input);
                        });
                    }
                };
     
                // Find all search inputs
                const searchInputs = document.querySelectorAll('input#search, input[name="search_query"]');
                searchInputs.forEach(interceptInput);
            }
     
            interceptSearchButtons() {
                const interceptButton = (btn) => {
                    if (this.interceptedElements.has(btn)) return;
                    this.interceptedElements.add(btn);
     
                    btn.addEventListener('click', (e) => {
                        const input = document.querySelector('input#search, input[name="search_query"]');
                        if (input && input.value.trim()) {
                            e.preventDefault();
                            e.stopPropagation();
                            this.performSearch(input.value.trim(), input);
                        }
                    });
                };
     
                // Find all search buttons
                const searchButtons = document.querySelectorAll(
                    '#search-icon-legacy button, ' +
                    'button[aria-label="Search"], ' +
                    'ytd-searchbox button, ' +
                    '.search-button'
                );
                searchButtons.forEach(interceptButton);
            }
     
            performSearch(query, inputElement) {
                this.log('Intercepting search for:', query);
     
                // Don't add before: if it already exists
                if (query.includes('before:')) {
                    this.log('Search already contains before: filter, proceeding normally');
                    this.executeSearch(query, inputElement);
                    return;
                }
     
                // Add the before: filter to the actual search
                const beforeDate = this.maxDate.toISOString().split('T')[0];
                const modifiedQuery = query + ' before:' + beforeDate;
     
                this.log('Modified search query:', modifiedQuery);
     
                // Execute the search with the modified query
                this.executeSearch(modifiedQuery, inputElement);
     
                // Keep the original query visible in the input - multiple attempts
                const restoreOriginalQuery = () => {
                    const searchInputs = document.querySelectorAll('input#search, input[name="search_query"]');
                    searchInputs.forEach(input => {
                        if (input.value.includes('before:')) {
                            input.value = query;
                        }
                    });
                };
     
                // Restore immediately and with delays
                restoreOriginalQuery();
                setTimeout(restoreOriginalQuery, 50);
                setTimeout(restoreOriginalQuery, 100);
                setTimeout(restoreOriginalQuery, 200);
                setTimeout(restoreOriginalQuery, 500);
                setTimeout(restoreOriginalQuery, 1000);
            }
     
            executeSearch(searchQuery, inputElement) {
                // Method 1: Try to use YouTube's search API directly
                if (this.tryYouTubeSearch(searchQuery)) {
                    return;
                }
     
                // Method 2: Modify the URL and navigate
                const searchParams = new URLSearchParams();
                searchParams.set('search_query', searchQuery);
     
                const searchUrl = '/results?' + searchParams.toString();
                this.log('Navigating to search URL:', searchUrl);
     
                // Show loading indicator to prevent "offline" message
                this.showSearchLoading();
     
                window.location.href = searchUrl;
            }
     
            showSearchLoading() {
                // Create a temporary loading overlay to prevent offline message
                const loadingOverlay = document.createElement('div');
                loadingOverlay.id = 'tm-search-loading';
                loadingOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(15, 15, 15, 0.95);
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-family: Roboto, Arial, sans-serif;
                    font-size: 16px;
                `;
     
                loadingOverlay.innerHTML = `
                    <div style="text-align: center;">
                        <div style="border: 2px solid #333; border-top: 2px solid #ff0000; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
                        <div>Searching...</div>
                    </div>
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                `;
     
                document.body.appendChild(loadingOverlay);
     
                // Remove loading overlay after a delay (in case search doesn't redirect)
                setTimeout(() => {
                    const overlay = document.getElementById('tm-search-loading');
                    if (overlay) overlay.remove();
                }, 5000);
            }
     
            tryYouTubeSearch(query) {
                try {
                    // Try to trigger YouTube's internal search mechanism
                    if (typeof window !== 'undefined' && window.ytplayer && window.ytplayer.config) {
                        // Use YouTube's internal router if available
                        if (typeof window.yt !== 'undefined' && window.yt && window.yt.www && window.yt.www.routing) {
                            window.yt.www.routing.navigate('/results?search_query=' + encodeURIComponent(query));
                            return true;
                        }
                    }
                    return false;
                } catch (e) {
                    OptimizedUtils.log('YouTube internal search failed:', e);
                    return false;
                }
            }
     
            cleanupSearchResults() {
                // Hide search filter chips that show the before: date
                const hideBeforeChips = () => {
                    // Hide all elements that contain "before:" text
                    const allElements = document.querySelectorAll('*');
                    allElements.forEach(element => {
                        if (element.dataset.tmProcessedForBefore) return;
     
                        const text = element.textContent || element.innerText || '';
                        const ariaLabel = element.getAttribute('aria-label') || '';
                        const title = element.getAttribute('title') || '';
     
                        if (text.includes('before:') || ariaLabel.includes('before:') || title.includes('before:')) {
                            // Check if it's a search filter chip or similar element
                            if (element.matches('ytd-search-filter-renderer, ytd-toggle-button-renderer, [role="button"], .ytd-search-filter-renderer, .filter-chip')) {
                                element.style.display = 'none';
                                element.setAttribute('data-hidden-by-time-machine', 'true');
                                element.dataset.tmProcessedForBefore = 'true';
                            }
                        }
                    });
                };
     
                // Run cleanup immediately and periodically
                hideBeforeChips();
                setInterval(hideBeforeChips, 200); // More frequent cleanup
     
                // Also run cleanup on page mutations
                const observer = new MutationObserver(() => {
                    setTimeout(hideBeforeChips, 50);
                    // Also restore search input if it shows before:
                    setTimeout(() => {
                        const searchInputs = document.querySelectorAll('input#search, input[name="search_query"]');
                        searchInputs.forEach(input => {
                            if (input.value.includes('before:')) {
                                const originalQuery = input.value.replace(/\s*before:\d{4}-\d{2}-\d{2}/, '').trim();
                                if (originalQuery) {
                                    input.value = originalQuery;
                                }
                            }
                        });
                    }, 10);
                });
     
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
     
                // Continuous monitoring of search input
                const self = this;
                setInterval(() => {
                    const searchInputs = document.querySelectorAll('input#search, input[name="search_query"]');
                    searchInputs.forEach(input => {
                        if (input.value.includes('before:')) {
                            const originalQuery = input.value.replace(/\s*before:\d{4}-\d{2}-\d{2}/, '').trim();
                            if (originalQuery) {
                                input.value = originalQuery;
                            }
                        }
                    });
     
                    // Note: Date modification is handled by SearchManager, not FeedChipHider
                }, 100);
            }
     
            hideBeforeTags() {
                const beforeTags = document.querySelectorAll('span, div');
                beforeTags.forEach(element => {
                    const text = element.textContent;
                    if (text && text.includes('before:') && text.includes(this.maxDate.toISOString().split('T')[0])) {
                        element.style.display = 'none';
                        element.setAttribute('data-hidden-by-time-machine', 'true');
                    }
                });
     
                const filterChips = document.querySelectorAll('ytd-search-filter-renderer');
                filterChips.forEach(chip => {
                    const text = chip.textContent;
                    if (text && text.includes('before:')) {
                        chip.style.display = 'none';
                        chip.setAttribute('data-hidden-by-time-machine', 'true');
                    }
                });
            }
     
            hideSearchSuggestions() {
                // Hide search suggestions dropdown/autocomplete
                const hideSearchDropdown = () => {
                    const selectors = [
                        'ytd-search-suggestions-renderer',
                        '.sbsb_a', // Google search suggestions
                        '#suggestions-wrapper',
                        '#suggestions',
                        '.search-suggestions',
                        'ytd-searchbox #suggestions',
                        'tp-yt-iron-dropdown',
                        '.ytp-suggestions-container',
                        '#masthead-search-suggestions',
                        '.search-autocomplete'
                    ];
     
                    selectors.forEach(selector => {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(el => {
                            if (!el.dataset.tmSuggestionHidden) {
                                el.style.display = 'none !important';
                                el.style.visibility = 'hidden !important';
                                el.style.opacity = '0 !important';
                                el.style.height = '0 !important';
                                el.style.overflow = 'hidden !important';
                                el.setAttribute('data-tm-suggestion-hidden', 'true');
                            }
                        });
                    });
                };
     
                // Hide immediately and continuously
                hideSearchDropdown();
                setInterval(hideSearchDropdown, 100);
     
                // Set up mutation observer for dynamic suggestions
                const observer = new MutationObserver(() => {
                    hideSearchDropdown();
                });
     
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
     
                // Also disable autocomplete attributes on search inputs
                const disableAutocomplete = () => {
                    const searchInputs = document.querySelectorAll('input#search, input[name="search_query"]');
                    searchInputs.forEach(input => {
                        if (!input.dataset.tmAutocompleteDisabled) {
                            input.setAttribute('autocomplete', 'off');
                            input.setAttribute('spellcheck', 'false');
                            input.dataset.tmAutocompleteDisabled = 'true';
                        }
                    });
                };
     
                disableAutocomplete();
                setInterval(disableAutocomplete, 1000);
            }
        }
     
        // === TAB HIDING FUNCTIONALITY ===
        class TabHider {
            constructor() {
                this.tabsToHide = ['All', 'Music', 'Gaming', 'News', 'Live', 'Sports', 'Learning', 'Fashion & Beauty', 'Podcasts'];
                this.isActive = false;
            }
     
            init() {
                this.isActive = true;
                this.startHiding();
                OptimizedUtils.log('Tab hider initialized');
            }
     
            startHiding() {
                // Hide tabs immediately and then continuously
                this.hideTabs();
                setInterval(() => this.hideTabs(), 500);
            }
     
            hideTabs() {
                if (!this.isActive) return;
     
                // Hide YouTube navigation tabs
                const tabSelectors = [
                    'tp-yt-paper-tab', 
                    '.ytd-feed-filter-chip-bar-renderer',
                    'ytd-feed-filter-chip-bar-renderer yt-chip-cloud-chip-renderer',
                    '[role="tab"]'
                ];
     
                tabSelectors.forEach(selector => {
                    const tabs = OptimizedUtils.$$(selector);
                    tabs.forEach(tab => {
                        const text = tab.textContent?.trim();
                        if (text && this.tabsToHide.includes(text)) {
                            tab.style.display = 'none';
                            tab.setAttribute('data-hidden-by-wayback', 'true');
                        }
                    });
                });
     
                // Hide feed filter chips
                const chipSelectors = [
                    'yt-chip-cloud-chip-renderer',
                    '.ytd-feed-filter-chip-bar-renderer yt-chip-cloud-chip-renderer',
                    'ytd-feed-filter-chip-bar-renderer [role="tab"]'
                ];
     
                chipSelectors.forEach(selector => {
                    const chips = OptimizedUtils.$$(selector);
                    chips.forEach(chip => {
                        const text = chip.textContent?.trim();
                        if (text && this.tabsToHide.includes(text)) {
                            chip.style.display = 'none';
                            chip.setAttribute('data-hidden-by-wayback', 'true');
                        }
                    });
                });
     
                // Hide entire filter bar if needed
                const filterBars = OptimizedUtils.$$('ytd-feed-filter-chip-bar-renderer');
                filterBars.forEach(bar => {
                    const visibleChips = bar.querySelectorAll('yt-chip-cloud-chip-renderer:not([data-hidden-by-wayback])');
                    if (visibleChips.length === 0) {
                        bar.style.display = 'none';
                    }
                });
            }
     
            stop() {
                this.isActive = false;
                // Restore hidden tabs
                const hiddenElements = OptimizedUtils.$$('[data-hidden-by-wayback]');
                hiddenElements.forEach(element => {
                    element.style.display = '';
                    element.removeAttribute('data-hidden-by-wayback');
                });
            }
        }
     
        // === SUBSCRIPTION MANAGER ===
        class SubscriptionManager {
            constructor() {
                this.subscriptions = this.loadSubscriptions();
            }
     
            loadSubscriptions() {
                const saved = GM_getValue('ytSubscriptions', '[]');
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    OptimizedUtils.log('Failed to parse subscriptions, using defaults');
                    return this.getDefaultSubscriptions();
                }
            }
     
            getDefaultSubscriptions() {
                return [
                    { name: 'PewDiePie', id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw' },
                    { name: 'Markiplier', id: 'UC7_YxT-KID8kRbqZo7MyscQ' },
                    { name: 'Jacksepticeye', id: 'UCYzPXprvl5Y-Sf0g4vX-m6g' },
                    { name: 'VanossGaming', id: 'UCKqH_9mk1waLgBiL2vT5b9g' },
                    { name: 'nigahiga', id: 'UCSAUGyc_xA8uYzaIVG6MESQ' },
                    { name: 'Smosh', id: 'UCY30JRSgfhYXA6i6xX1erWg' },
                    { name: 'RayWilliamJohnson', id: 'UCGt7X90Au6BV8rf49BiM6Dg' },
                    { name: 'Fred', id: 'UCJKjhgPJcPlW0WV_YQCXq_A' },
                    { name: 'Shane', id: 'UCtinbF-Q-fVthA0qrFQTgXQ' },
                    { name: 'TheFineBros', id: 'UC0v-tlzsn0QZwJnkiaUSJVQ' }
                ];
            }
     
            saveSubscriptions() {
                GM_setValue('ytSubscriptions', JSON.stringify(this.subscriptions));
            }
     
            getSubscriptions() {
                return this.subscriptions;
            }
     
            addSubscription(name, id = null) {
                if (!name.trim()) return false;
     
                const subscription = { 
                    name: name.trim(), 
                    id: id 
                };
     
                // Check for duplicates
                const exists = this.subscriptions.some(sub => 
                    sub.name.toLowerCase() === subscription.name.toLowerCase()
                );
     
                if (!exists) {
                    this.subscriptions.push(subscription);
                    this.saveSubscriptions();
                    OptimizedUtils.log(`Added subscription: ${subscription.name}`);
                    return true;
                }
     
                return false;
            }
     
            removeSubscription(index) {
                if (index >= 0 && index < this.subscriptions.length) {
                    const removed = this.subscriptions.splice(index, 1)[0];
                    this.saveSubscriptions();
                    OptimizedUtils.log(`Removed subscription: ${removed.name}`);
                    return true;
                }
                return false;
            }
     
            clearAllSubscriptions() {
                this.subscriptions = [];
                this.saveSubscriptions();
                OptimizedUtils.log('Cleared all subscriptions');
            }
        }
     
        // === FEED CHIP HIDER ===
        class FeedChipHider {
            constructor() {
                this.hiddenChips = new Set();
                this.initializeHiding();
            }
     
            initializeHiding() {
                setInterval(() => {
                    this.hideTopTabs();
                }, 200);
            }
     
            hideTopTabs() {
                // Hide feed filter chips (All, Music, Gaming, etc.)
                CONFIG.FEED_CHIP_SELECTORS.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (!element.dataset.tmHidden) {
                            element.style.display = 'none !important';
                            element.style.visibility = 'hidden !important';
                            element.style.opacity = '0 !important';
                            element.style.height = '0 !important';
                            element.style.maxHeight = '0 !important';
                            element.style.overflow = 'hidden !important';
                            element.dataset.tmHidden = 'true';
                            this.hiddenChips.add(element);
                        }
                    });
                });
     
                // Hide specific tab-like elements by text content
                const tabSelectors = [
                    'yt-chip-cloud-chip-renderer',
                    'ytd-feed-filter-chip-renderer',
                    'paper-tab[role="tab"]',
                    '[role="tab"]'
                ];
     
                tabSelectors.forEach(selector => {
                    const tabs = document.querySelectorAll(selector);
                    tabs.forEach(tab => {
                        const text = tab.textContent?.toLowerCase().trim();
                        if (text && ['all', 'music', 'gaming', 'news', 'live', 'sports', 'learning', 'fashion & beauty', 'gaming'].includes(text)) {
                            if (!tab.dataset.tmHidden) {
                                tab.style.display = 'none !important';
                                tab.style.visibility = 'hidden !important';
                                tab.dataset.tmHidden = 'true';
                                this.hiddenChips.add(tab);
                            }
                        }
                    });
                });
            }
     
            hideSearchFilters() {
                const elementsToCheck = document.querySelectorAll('*:not([data-tm-processed-for-before])');
     
                elementsToCheck.forEach(element => {
                    const text = element.textContent || '';
                    const ariaLabel = element.getAttribute('aria-label') || '';
                    const title = element.getAttribute('title') || '';
     
                    if (text.includes('before:') || ariaLabel.includes('before:') || title.includes('before:')) {
                        if (element.matches('ytd-search-filter-renderer, .search-filter-chip, ytd-chip-cloud-chip-renderer, ytd-search-sub-menu-renderer *')) {
                            element.style.display = 'none !important';
                            element.style.visibility = 'hidden !important';
                            element.style.opacity = '0 !important';
                            element.style.height = '0 !important';
                            element.style.width = '0 !important';
                            element.style.position = 'absolute !important';
                            element.style.left = '-9999px !important';
                            element.setAttribute('data-hidden-by-time-machine', 'true');
                        }
     
                        let parent = element.parentElement;
                        while (parent && parent !== document.body) {
                            if (parent.matches('ytd-search-filter-renderer, ytd-chip-cloud-chip-renderer, ytd-search-sub-menu-renderer')) {
                                parent.style.display = 'none !important';
                                parent.setAttribute('data-hidden-by-time-machine', 'true');
                                break;
                            }
                            parent = parent.parentElement;
                        }
                    }
     
                    element.dataset.tmProcessedForBefore = 'true';
                });
     
                const specificSelectors = [
                    'ytd-search-filter-renderer',
                    'ytd-chip-cloud-chip-renderer',
                    'ytd-search-sub-menu-renderer',
                    '.search-filter-chip',
                    '[data-text*="before:"]',
                    '[aria-label*="before:"]',
                    '[title*="before:"]'
                ];
     
                specificSelectors.forEach(selector => {
                    try {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            element.style.display = 'none !important';
                            element.setAttribute('data-hidden-by-time-machine', 'true');
                        });
                    } catch (e) {
                        // Ignore selector errors
                    }
                });
            }
        }
     
        // === ENHANCED SEARCH MANAGER ===
        class SearchManager {
            constructor(apiManager, maxDate) {
                this.apiManager = apiManager;
                this.maxDate = maxDate;
                this.feedChipHider = new FeedChipHider();
                this.initializeSearchHiding();
            }
     
            initializeSearchHiding() {
                setInterval(() => {
                    this.feedChipHider.hideSearchFilters();
                    // Also modify dates in search results from the correct context
                    if (OptimizedUtils.getCurrentPage() === 'search') {
                        this.modifyDatesInSearchResults();
                    }
                    // Process comments on watch pages
                    if (OptimizedUtils.getCurrentPage() === 'watch') {
                        this.modifyCommentDates();
                    }
                }, 500); // Increased interval to reduce excessive logging
     
                const observer = new MutationObserver(() => {
                    setTimeout(() => {
                        this.feedChipHider.hideSearchFilters();
                        if (OptimizedUtils.getCurrentPage() === 'search') {
                            this.modifyDatesInSearchResults();
                        }
                        if (OptimizedUtils.getCurrentPage() === 'watch') {
                            this.modifyCommentDates();
                        }
                    }, 2000); // Increased delay to prevent excessive processing
                });
     
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
     
            modifyDatesInSearchResults() {
                if (OptimizedUtils.getCurrentPage() !== 'search') return;
     
                // Find all video duration/date elements in search results
                const videoElements = document.querySelectorAll('ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer');
     
                videoElements.forEach(videoElement => {
                    if (videoElement.dataset.tmDateModified) return;
     
                    // Look for upload date elements - using valid CSS selectors only
                    const dateSelectors = [
                        '.ytd-video-meta-block .ytd-video-meta-block span:nth-child(2)',
                        '#metadata .ytd-video-meta-block span:nth-child(2)', 
                        '.ytd-video-meta-block div:nth-child(2)',
                        '.ytd-video-meta-block [aria-label*="ago"]',
                        '#metadata-line .ytd-video-meta-block span',
                        '#metadata .published-time-text',
                        '.video-time',
                        '.ytd-video-meta-block span:last-child'
                    ];
     
                    // Find elements containing "ago" text manually
                    const metadataSpans = videoElement.querySelectorAll('[id*="metadata"] span');
                    metadataSpans.forEach(span => {
                        if (span.textContent && span.textContent.includes('ago')) {
                            if (this.isRelativeDateElement(span)) {
                                this.updateRelativeDate(span);
                                videoElement.dataset.tmDateModified = 'true';
                            }
                        }
                    });
     
                    // Process other selectors
                    for (const selector of dateSelectors) {
                        try {
                            const dateElement = videoElement.querySelector(selector);
                            if (dateElement && this.isRelativeDateElement(dateElement)) {
                                this.updateRelativeDate(dateElement);
                                videoElement.dataset.tmDateModified = 'true';
                                break;
                            }
                        } catch (error) {
                            // Skip invalid selectors
                            continue;
                        }
                    }
                });
            }
     
            isRelativeDateElement(element) {
                const text = element.textContent || element.innerText || '';
                const relativePatterns = [
                    /\d+\s+(year|month|week|day|hour|minute)s?\s+ago/i,
                    /\d+\s+(yr|mo|wk|day|hr|min)s?\s+ago/i,
                    /(yesterday|today)/i
                ];
     
                return relativePatterns.some(pattern => pattern.test(text));
            }
     
            updateRelativeDate(element) {
                const originalText = element.textContent || element.innerText || '';
                const maxDate = this.maxDate;
     
                if (!maxDate) return;
     
                // Parse the original relative date
                const match = originalText.match(/(\d+)\s+(year|month|week|day|hour|minute)s?\s+ago/i);
     
                if (match) {
                    const value = parseInt(match[1]);
                    const unit = match[2].toLowerCase();
     
                    // Calculate original upload date from current time (not time machine date)
                    const now = new Date();
                    let uploadDate = new Date(now);
     
                    // Use proper date arithmetic for accurate calculations
                    switch (unit) {
                        case 'year':
                            uploadDate.setFullYear(uploadDate.getFullYear() - value);
                            break;
                        case 'month':
                            uploadDate.setMonth(uploadDate.getMonth() - value);
                            break;
                        case 'week':
                            uploadDate.setDate(uploadDate.getDate() - (value * 7));
                            break;
                        case 'day':
                            uploadDate.setDate(uploadDate.getDate() - value);
                            break;
                        case 'hour':
                            uploadDate.setHours(uploadDate.getHours() - value);
                            break;
                        case 'minute':
                            uploadDate.setMinutes(uploadDate.getMinutes() - value);
                            break;
                    }
     
                    // Apply 1-year leniency for future date detection
                    const maxDateWithLeniency = new Date(maxDate);
                    maxDateWithLeniency.setFullYear(maxDateWithLeniency.getFullYear() + 1);
     
                    if (uploadDate <= maxDate) {
                        // Video is within the time machine date - update normally
                        const newRelativeDate = OptimizedUtils.calculateRelativeDate(uploadDate, maxDate);
     
                        if (newRelativeDate && newRelativeDate !== originalText) {
                            element.textContent = newRelativeDate;
                            element.title = `Original: ${originalText} | Adjusted for ${OptimizedUtils.formatDate(maxDate)}`;
                        }
                    } else if (uploadDate <= maxDateWithLeniency) {
                        // Video is within 1-year leniency - show random months from 6-11
                        const randomMonths = Math.floor(Math.random() * 6) + 6; // 6-11 months
                        element.textContent = `${randomMonths} month${randomMonths > 1 ? 's' : ''} ago`;
                        element.title = `Original: ${originalText} | Within grace period, showing random months`;
                        return;
                    } else {
                        // Video is more than 1 year in the future - remove completely
                        const videoElement = element.closest('ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer');
                        if (videoElement) {
                            OptimizedUtils.log(`Removing future video from search: ${originalText} (uploaded after ${OptimizedUtils.formatDate(maxDateWithLeniency)})`);
                            videoElement.style.display = 'none';
                            videoElement.remove();
                        }
                    }
                }
            }
     
            modifyCommentDates() {
                const currentPage = OptimizedUtils.getCurrentPage();
                if (currentPage !== 'watch') {
                    // OptimizedUtils.log(`Not on watch page, current page: ${currentPage}`);
                    return;
                }
     
                // Find all comment date elements with multiple selectors
                const commentSelectors = [
                    'ytd-comment-view-model',
                    'ytd-comment-replies-renderer', 
                    'ytd-comment-thread-renderer',
                    '#comments #contents',
                    'ytd-comments',
                    '#comment'
                ];
     
                let commentElements = [];
                commentSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    commentElements = [...commentElements, ...Array.from(elements)];
                });
     
                // Also try to find comment date links directly with more selectors
                const allDateLinks = document.querySelectorAll(`
                    a.yt-simple-endpoint[href*="lc="], 
                    a[href*="lc="],
                    .published-time-text,
                    [aria-label*="ago"],
                    #published-time-text,
                    .style-scope.ytd-comment-view-model a
                `);
     
                // Debug elements found
                OptimizedUtils.log(`Found ${commentElements.length} comment containers and ${allDateLinks.length} date links`);
     
                // Process direct date links first
                allDateLinks.forEach(dateLink => {
                    if (dateLink.dataset.tmCommentDateModified) return;
     
                    const dateText = dateLink.textContent.trim();
                    OptimizedUtils.log(`Processing comment date link: "${dateText}"`);
     
                    // Check if this looks like a relative date
                    if (this.isRelativeDateElement({ textContent: dateText })) {
                        this.updateCommentDate(dateLink, dateText);
                        dateLink.dataset.tmCommentDateModified = 'true';
                    }
                });
     
                // Also process within comment containers
                commentElements.forEach(commentElement => {
                    if (commentElement.dataset.tmCommentDateModified) return;
     
                    // Look for comment date links - using broader selectors
                    const dateLinks = commentElement.querySelectorAll('a[href*="lc="], .published-time-text, [class*="published"], [class*="time"]');
     
                    dateLinks.forEach(dateLink => {
                        if (dateLink.dataset.tmCommentDateModified) return;
     
                        const dateText = dateLink.textContent.trim();
     
                        // Check if this looks like a relative date
                        if (this.isRelativeDateElement({ textContent: dateText })) {
                            OptimizedUtils.log(`Processing comment in container: "${dateText}"`);
                            this.updateCommentDate(dateLink, dateText);
                            dateLink.dataset.tmCommentDateModified = 'true';
                        }
                    });
     
                    commentElement.dataset.tmCommentDateModified = 'true';
                });
            }
     
            updateCommentDate(element, originalText) {
                const maxDate = this.maxDate;
     
                if (!maxDate) {
                    OptimizedUtils.log('No maxDate available for comment processing');
                    return;
                }
     
                OptimizedUtils.log(`Updating comment date: "${originalText}" with maxDate: ${OptimizedUtils.formatDate(maxDate)}`);
     
                // Parse the original relative date
                const match = originalText.match(/(\d+)\s+(year|month|week|day|hour|minute)s?\s+ago/i);
     
                if (match) {
                    OptimizedUtils.log(`Matched comment date pattern: ${match[1]} ${match[2]}`);
                    const value = parseInt(match[1]);
                    const unit = match[2].toLowerCase();
     
                    // Calculate original comment date from current time
                    const now = new Date();
                    let commentDate = new Date(now);
     
                    // Use proper date arithmetic for accurate calculations
                    switch (unit) {
                        case 'year':
                            commentDate.setFullYear(commentDate.getFullYear() - value);
                            break;
                        case 'month':
                            commentDate.setMonth(commentDate.getMonth() - value);
                            break;
                        case 'week':
                            commentDate.setDate(commentDate.getDate() - (value * 7));
                            break;
                        case 'day':
                            commentDate.setDate(commentDate.getDate() - value);
                            break;
                        case 'hour':
                            commentDate.setHours(commentDate.getHours() - value);
                            break;
                        case 'minute':
                            commentDate.setMinutes(commentDate.getMinutes() - value);
                            break;
                    }
     
                    // Apply 1-year leniency for future date detection
                    const maxDateWithLeniency = new Date(maxDate);
                    maxDateWithLeniency.setFullYear(maxDateWithLeniency.getFullYear() + 1);
     
                    if (commentDate <= maxDate) {
                        // Comment is within time machine date - update normally
                        const newRelativeDate = OptimizedUtils.calculateRelativeDate(commentDate, maxDate);
     
                        if (newRelativeDate && newRelativeDate !== originalText) {
                            element.textContent = newRelativeDate;
                            element.title = `Original: ${originalText} | Adjusted for ${OptimizedUtils.formatDate(maxDate)}`;
                        }
                    } else if (commentDate <= maxDateWithLeniency) {
                        // Comment is within 1-year leniency - show random months from 6-11
                        const randomMonths = Math.floor(Math.random() * 6) + 6; // 6-11 months
                        element.textContent = `${randomMonths} month${randomMonths > 1 ? 's' : ''} ago`;
                        element.title = `Original: ${originalText} | Within grace period, showing random months`;
                    } else {
                        // Comment is more than 1 year in the future - remove completely
                        const commentContainer = element.closest('ytd-comment-view-model, ytd-comment-replies-renderer, ytd-comment-thread-renderer');
                        if (commentContainer) {
                            OptimizedUtils.log(`Removing future comment: ${originalText} (posted after ${OptimizedUtils.formatDate(maxDateWithLeniency)})`);
                            commentContainer.style.display = 'none';
                            commentContainer.remove();
                        }
                    }
                }
            }
     
            injectSearchDateFilter() {
                if (location.pathname !== '/results') return;
     
                const urlParams = new URLSearchParams(location.search);
                let searchQuery = urlParams.get('search_query') || urlParams.get('q') || '';
     
                if (!searchQuery.includes('before:') && this.maxDate) {
                    const beforeDate = this.maxDate.toISOString().split('T')[0];
                    const newQuery = `${searchQuery} before:${beforeDate}`;
     
                    urlParams.set('search_query', newQuery);
                    const newUrl = `${location.pathname}?${urlParams.toString()}`;
     
                    if (newUrl !== location.href) {
                        OptimizedUtils.log(`Injecting date filter: ${beforeDate}`);
                        window.history.replaceState({}, '', newUrl);
                    }
                }
            }
     
            updateMaxDate(newMaxDate) {
                this.maxDate = newMaxDate;
            }
        }
     
        // === ENHANCED UI MANAGER ===
        class EnhancedUIManager {
            constructor(timeMachine) {
                this.timeMachine = timeMachine;
                this.isVisible = GM_getValue('ytTimeMachineUIVisible', true);
                this.init();
            }
     
            init() {
                // Wait for DOM to be ready before creating UI
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                        this.createUI();
                        this.setupKeyboardShortcuts();
                    });
                } else {
                    this.createUI();
                    this.setupKeyboardShortcuts();
                }
            }
     
            createUI() {
                GM_addStyle(`
                    .yt-time-machine-ui {
                        position: fixed;
                        top: 10px;
                        right: 10px;
                        width: 320px;
                        max-height: 80vh;
                        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                        border: 1px solid #444;
                        border-radius: 12px;
                        padding: 16px;
                        font-family: 'Roboto', sans-serif;
                        font-size: 13px;
                        color: #fff;
                        z-index: 10000;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                        backdrop-filter: blur(10px);
                        transition: opacity 0.3s ease;
                        overflow-y: auto;
                        overflow-x: hidden;
                    }
     
                    .yt-time-machine-ui::-webkit-scrollbar {
                        width: 8px;
                    }
     
                    .yt-time-machine-ui::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 4px;
                    }
     
                    .yt-time-machine-ui::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 4px;
                    }
     
                    .yt-time-machine-ui::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.5);
                    }
     
                    .yt-time-machine-ui.hidden {
                        opacity: 0;
                        pointer-events: none;
                    }
     
                    .yt-time-machine-toggle {
                        position: fixed;
                        top: 10px;
                        right: 10px;
                        width: 40px;
                        height: 40px;
                        background: #c41e3a;
                        border: none;
                        border-radius: 50%;
                        color: white;
                        font-size: 16px;
                        cursor: pointer;
                        z-index: 10001;
                        display: none;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 16px rgba(196, 30, 58, 0.4);
                    }
     
                    .yt-time-machine-toggle.visible {
                        display: flex;
                    }
     
                    .tm-title {
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 12px;
                        color: #ff6b6b;
                        text-align: center;
                        position: relative;
                    }
     
                    .tm-minimize-btn {
                        position: absolute;
                        right: 0;
                        top: -2px;
                        background: #666;
                        color: white;
                        border: none;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
     
                    .tm-minimize-btn:hover {
                        background: #888;
                    }
     
                    .tm-input {
                        width: 100%;
                        padding: 8px 10px;
                        margin: 4px 0;
                        border: 1px solid #555;
                        border-radius: 6px;
                        background: #333;
                        color: #fff;
                        font-size: 12px;
                    }
     
                    .tm-button {
                        padding: 8px 12px;
                        margin: 4px 2px;
                        border: none;
                        border-radius: 6px;
                        background: #4a90e2;
                        color: white;
                        cursor: pointer;
                        font-size: 11px;
                        transition: background 0.2s ease;
                    }
     
                    .tm-button:hover {
                        background: #357abd;
                    }
     
                    .tm-button:disabled {
                        background: #666;
                        cursor: not-allowed;
                    }
     
                    .tm-button.tm-danger {
                        background: #dc3545;
                    }
     
                    .tm-button.tm-danger:hover {
                        background: #c82333;
                    }
     
                    .tm-section {
                        margin: 12px 0;
                        padding: 10px;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 8px;
                    }
     
                    .tm-section h3 {
                        margin: 0 0 8px 0;
                        font-size: 12px;
                        color: #4a90e2;
                    }
     
                    .tm-stats {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 8px;
                        font-size: 11px;
                    }
     
                    .tm-stat {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 6px;
                        border-radius: 4px;
                        text-align: center;
                    }
     
                    .tm-subscription-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 4px 0;
                        border-bottom: 1px solid #444;
                    }
     
                    .tm-subscription-item:last-child {
                        border-bottom: none;
                    }
     
                    .tm-subscription-name {
                        flex: 1;
                        font-size: 11px;
                    }
     
                    .tm-remove-btn {
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 3px;
                        padding: 2px 6px;
                        font-size: 10px;
                        cursor: pointer;
                    }
     
                    .tm-loading {
                        text-align: center;
                        padding: 20px;
                        color: #4a90e2;
                    }
     
                    /* Homepage Video Cards */
                    .tm-homepage-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 16px;
                        padding: 16px;
                    }
     
                    .tm-video-card {
                        background: #0f0f0f;
                        border-radius: 12px;
                        overflow: hidden;
                        cursor: pointer;
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }
     
                    .tm-video-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    }
     
                    .tm-video-card img {
                        width: 100%;
                        height: 135px;
                        object-fit: cover;
                        border-radius: 0;
                    }
     
                    .tm-video-info {
                        padding: 12px;
                    }
     
                    .tm-video-title {
                        font-size: 14px;
                        font-weight: 500;
                        color: #fff;
                        line-height: 1.3;
                        margin-bottom: 8px;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
     
                    .tm-video-channel {
                        font-size: 12px;
                        color: #aaa;
                        margin-bottom: 4px;
                    }
     
                    .tm-video-meta {
                        font-size: 12px;
                        color: #aaa;
                    }
     
                    .tm-video-meta span {
                        margin-right: 8px;
                    }
     
                    /* Vintage theme toggle button */
                    .tm-vintage-toggle {
                        background: linear-gradient(135deg, #8b4513, #a0522d) !important;
                        color: white !important;
                    }
                    
                    .tm-vintage-toggle:hover {
                        background: linear-gradient(135deg, #a0522d, #d2b48c) !important;
                        color: #333 !important;
                    }
                    
                    .tm-vintage-toggle.active {
                        background: linear-gradient(135deg, #228b22, #32cd32) !important;
                        color: white !important;
                    }
                    
                    .tm-vintage-toggle.active:hover {
                        background: linear-gradient(135deg, #32cd32, #90ee90) !important;
                        color: #333 !important;
                    }
     
                    /* Watch Next Cards - Enhanced and bigger */
                    .tm-watch-next {
                        background: #0f0f0f;
                        padding: 16px;
                        margin-bottom: 16px;
                        position: relative;
                        z-index: 999999 !important;
                        min-height: 400px;
                    }
     
                    .tm-watch-next h3 {
                        color: #fff;
                        font-size: 16px;
                        margin: 0 0 16px 0;
                        font-weight: normal;
                    }
     
                    .tm-watch-next-grid {
                        display: flex;
                        flex-direction: column;
                        gap: 0;
                    }
     
                    .tm-watch-next-card {
                        display: flex;
                        cursor: pointer;
                        padding: 12px 0;
                        border-bottom: 1px solid #333;
                    }
     
                    .tm-watch-next-card:hover {
                        background: #1a1a1a;
                    }
     
                    .tm-watch-next-card img {
                        width: 140px;
                        height: 78px;
                        object-fit: cover;
                        margin-right: 12px;
                    }
     
                    .tm-watch-next-info {
                        flex: 1;
                    }
     
                    .tm-watch-next-title {
                        font-size: 13px;
                        color: #fff;
                        line-height: 1.3;
                        margin-bottom: 4px;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
     
                    .tm-watch-next-channel {
                        font-size: 12px;
                        color: #999;
                        margin-bottom: 3px;
                    }
     
                    .tm-watch-next-meta {
                        font-size: 11px;
                        color: #666;
                    }
                `);
     
                const uiHTML = `
                    <div id="timeMachineUI" class="yt-time-machine-ui ${this.isVisible ? '' : 'hidden'}">
                        <div class="tm-title">
                            ⏰ WayBackTube
                            <button class="tm-minimize-btn" id="tmMinimizeBtn">×</button>
                        </div>
     
                        <div class="tm-section">
                            <label>Travel to date:</label>
                            <input type="date" id="tmDateInput" class="tm-input" value="${this.timeMachine.getDateString()}">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
                                <button id="tmApplyDate" class="tm-button">Apply Date</button>
                                <button id="tmRandomDate" class="tm-button">Random Date</button>
                            </div>
                        </div>
     
                        <div class="tm-section">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button id="tmToggle" class="tm-button">${this.timeMachine.settings.active ? 'Disable' : 'Enable'}</button>
                                <button id="tmClearCache" class="tm-button">Clear Cache</button>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
                                <button id="tmRefreshVideosBtn" class="tm-button">Refresh Videos</button>
                                <button id="tmVintageToggle" class="tm-button tm-vintage-toggle">🕰️ 2011 Theme</button>
                            </div>
                            <div style="margin-top: 8px;">
                                <label style="display: flex; align-items: center; color: #fff; font-size: 12px;">
                                    <input type="checkbox" id="tmDateRotation" style="margin-right: 6px;">
                                    Auto-advance date daily (simulates real uploads)
                                </label>
                            </div>
                            <div style="margin-top: 8px;">
                                <label style="display: flex; align-items: center; color: #fff; font-size: 12px;">
                                    <input type="checkbox" id="tmTestClock" style="margin-right: 6px;">
                                    Real-time Clock (new videos every 4h, date advances daily)
                                </label>
                            </div>
                        </div>
     
                        <div class="tm-section">
                            <h3>Search Terms</h3>
                            <input type="text" id="tmSearchTermInput" class="tm-input" placeholder="Enter search term (e.g. memes, gaming)">
                            <button id="tmAddSearchTerm" class="tm-button" style="width: 100%; margin-top: 4px;">Add Search Term</button>
                            <div id="tmSearchTermList"></div>
                            <button id="tmClearSearchTerms" class="tm-button" style="width: 100%; margin-top: 8px; background: #dc3545;">Clear All Search Terms</button>
                        </div>
     
                        <div class="tm-section">
                            <h3>Real-Time Clock</h3>
                            <div style="text-align: center; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 6px; margin-bottom: 12px;">
                                <div style="font-family: monospace; font-size: 18px; color: #00ff00; font-weight: bold;" id="tm-clock-display">
                                    ${GM_getValue('ytTestClockEnabled', false) ? 'Day 0, 00:00:00' : 'Clock not running'}
                                </div>
                                <div style="font-size: 11px; color: #888; margin-top: 4px;">
                                    New videos every 4 hours • Date advances every 24 hours
                                </div>
                            </div>
                        </div>
     
                        <div class="tm-section">
                            <h3>Statistics</h3>
                            <div class="tm-stats">
                                <div class="tm-stat">
                                    <div>API Calls</div>
                                    <div id="tmApiCalls">0</div>
                                </div>
                                <div class="tm-stat">
                                    <div>Videos Processed</div>
                                    <div id="tmVideosProcessed">0</div>
                                </div>
                                <div class="tm-stat">
                                    <div>Cache Hits</div>
                                    <div id="tmCacheHits">0</div>
                                </div>
                                <div class="tm-stat">
                                    <div>Videos Filtered</div>
                                    <div id="tmVideosFiltered">0</div>
                                </div>
                            </div>
                        </div>
     
                        <div class="tm-section">
                            <h3>API Keys</h3>
                            <input type="text" id="tmApiKeyInput" class="tm-input" placeholder="Enter YouTube API key">
                            <div style="display: flex; gap: 4px; margin-top: 4px;">
                                <button id="tmAddApiKey" class="tm-button" style="flex: 1;">Add Key</button>
                                <button id="tmTestAllKeys" class="tm-button" style="flex: 1;">Test All</button>
                            </div>
                            <div id="tmApiKeyList"></div>
                        </div>
     
     
     
                        <div class="tm-section">
                            <h3>Subscriptions</h3>
                            <input type="text" id="tmSubscriptionInput" class="tm-input" placeholder="Enter channel name">
                            <button id="tmAddSubscription" class="tm-button" style="width: 100%; margin-top: 4px;">Add Channel</button>
                            <div id="tmSubscriptionList"></div>
                        </div>
     
                        <div style="font-size: 10px; color: #666; text-align: center; margin-top: 15px;">
                            Press Ctrl+Shift+T to toggle UI
                        </div>
                    </div>
     
                    <button id="timeMachineToggle" class="yt-time-machine-toggle ${this.isVisible ? '' : 'visible'}">⏰</button>
                `;
     
                // Safely insert UI with error handling
                this.safeInsertUI(uiHTML);
            }
     
            safeInsertUI(uiHTML) {
                const insertUI = () => {
                    try {
                        if (!document.body) {
                            // Body not ready yet, wait a bit
                            setTimeout(insertUI, 100);
                            return;
                        }
                        
                        // Remove any existing UI first
                        const existingUI = document.querySelector('.yt-time-machine-ui');
                        const existingToggle = document.querySelector('.yt-time-machine-toggle');
                        if (existingUI) existingUI.remove();
                        if (existingToggle) existingToggle.remove();
                        
                        // Create elements using safe DOM construction
                        this.createUIElements();
                        
                        this.attachEventListeners();
                        this.initializeVintageTheme();
                        // Defer updateUI to ensure timeMachine is fully initialized
                        setTimeout(() => {
                            if (this.timeMachine && this.timeMachine.isInitialized) {
                                this.updateUI();
                            }
                        }, 100);
                        OptimizedUtils.log('UI successfully created');
                    } catch (error) {
                        OptimizedUtils.log('UI creation error:', error);
                        // Don't retry to prevent infinite loops
                        console.error('[WayBackTube] UI creation failed permanently:', error);
                    }
                };
                
                insertUI();
            }
     
            createUIElements() {
                // Create main UI container
                const uiContainer = document.createElement('div');
                uiContainer.className = `yt-time-machine-ui ${this.isVisible ? '' : 'hidden'}`;
                uiContainer.id = 'timeMachineUI';
                
                // Create title section
                const titleDiv = document.createElement('div');
                titleDiv.className = 'tm-title';
                titleDiv.textContent = '⏰ WayBackTube';
                
                const minimizeBtn = document.createElement('button');
                minimizeBtn.className = 'tm-minimize-btn';
                minimizeBtn.id = 'tmMinimizeBtn';
                minimizeBtn.textContent = '×';
                titleDiv.appendChild(minimizeBtn);
                
                uiContainer.appendChild(titleDiv);
                
                // Create date section
                const dateSection = document.createElement('div');
                dateSection.className = 'tm-section';
                
                const dateLabel = document.createElement('label');
                dateLabel.textContent = 'Travel to date:';
                dateSection.appendChild(dateLabel);
                
                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.id = 'tmDateInput';
                dateInput.className = 'tm-input';
                dateSection.appendChild(dateInput);
                
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'display: flex; gap: 4px; margin-top: 4px;';
                
                const applyBtn = document.createElement('button');
                applyBtn.id = 'tmApplyDate';
                applyBtn.className = 'tm-button';
                applyBtn.style.flex = '1';
                applyBtn.textContent = 'Apply';
                
                const randomBtn = document.createElement('button');
                randomBtn.id = 'tmRandomDate';
                randomBtn.className = 'tm-button';
                randomBtn.style.flex = '1';
                randomBtn.textContent = 'Random';
                
                buttonContainer.appendChild(applyBtn);
                buttonContainer.appendChild(randomBtn);
                dateSection.appendChild(buttonContainer);
                
                uiContainer.appendChild(dateSection);
                
                // Create control section
                const controlSection = document.createElement('div');
                controlSection.className = 'tm-section';
                
                const controlGrid = document.createElement('div');
                controlGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px;';
                
                const toggleBtn = document.createElement('button');
                toggleBtn.id = 'tmToggle';
                toggleBtn.className = 'tm-button primary';
                toggleBtn.textContent = 'Activate';
                
                const vintageBtn = document.createElement('button');
                vintageBtn.id = 'tmVintageToggle';
                vintageBtn.className = 'tm-button';
                vintageBtn.textContent = '2011 Theme';
                
                controlGrid.appendChild(toggleBtn);
                controlGrid.appendChild(vintageBtn);
                controlSection.appendChild(controlGrid);
                
                uiContainer.appendChild(controlSection);
                
                // Create statistics section
                const statsSection = document.createElement('div');
                statsSection.className = 'tm-section';
                
                const statsTitle = document.createElement('h3');
                statsTitle.textContent = 'Statistics';
                statsSection.appendChild(statsTitle);
                
                const statsGrid = document.createElement('div');
                statsGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;';
                
                // Create stat items
                const createStat = (label, id) => {
                    const statDiv = document.createElement('div');
                    statDiv.className = 'tm-stat';
                    
                    const labelDiv = document.createElement('div');
                    labelDiv.textContent = label;
                    statDiv.appendChild(labelDiv);
                    
                    const valueDiv = document.createElement('div');
                    valueDiv.id = id;
                    valueDiv.textContent = '0';
                    statDiv.appendChild(valueDiv);
                    
                    return statDiv;
                };
                
                statsGrid.appendChild(createStat('API Calls', 'tmApiCalls'));
                statsGrid.appendChild(createStat('Videos Processed', 'tmVideosProcessed'));
                statsGrid.appendChild(createStat('Cache Hits', 'tmCacheHits'));
                statsGrid.appendChild(createStat('Videos Filtered', 'tmVideosFiltered'));
                
                statsSection.appendChild(statsGrid);
                uiContainer.appendChild(statsSection);
                
                // Create API Keys section
                const apiSection = document.createElement('div');
                apiSection.className = 'tm-section';
                
                const apiTitle = document.createElement('h3');
                apiTitle.textContent = 'API Keys';
                apiSection.appendChild(apiTitle);
                
                const apiKeyInput = document.createElement('input');
                apiKeyInput.type = 'text';
                apiKeyInput.id = 'tmApiKeyInput';
                apiKeyInput.className = 'tm-input';
                apiKeyInput.placeholder = 'Enter YouTube API key';
                apiSection.appendChild(apiKeyInput);
                
                const apiButtonContainer = document.createElement('div');
                apiButtonContainer.style.cssText = 'display: flex; gap: 4px; margin-top: 4px;';
                
                const addKeyBtn = document.createElement('button');
                addKeyBtn.id = 'tmAddApiKey';
                addKeyBtn.className = 'tm-button';
                addKeyBtn.style.flex = '1';
                addKeyBtn.textContent = 'Add Key';
                
                const testKeysBtn = document.createElement('button');
                testKeysBtn.id = 'tmTestAllKeys';
                testKeysBtn.className = 'tm-button';
                testKeysBtn.style.flex = '1';
                testKeysBtn.textContent = 'Test All';
                
                apiButtonContainer.appendChild(addKeyBtn);
                apiButtonContainer.appendChild(testKeysBtn);
                apiSection.appendChild(apiButtonContainer);
                
                const apiKeyList = document.createElement('div');
                apiKeyList.id = 'tmApiKeyList';
                apiSection.appendChild(apiKeyList);
                
                uiContainer.appendChild(apiSection);
                
                // Create Subscriptions section
                const subSection = document.createElement('div');
                subSection.className = 'tm-section';
                
                const subTitle = document.createElement('h3');
                subTitle.textContent = 'Subscriptions';
                subSection.appendChild(subTitle);
                
                const subInput = document.createElement('input');
                subInput.type = 'text';
                subInput.id = 'tmSubscriptionInput';
                subInput.className = 'tm-input';
                subInput.placeholder = 'Enter channel name';
                subSection.appendChild(subInput);
                
                const addSubBtn = document.createElement('button');
                addSubBtn.id = 'tmAddSubscription';
                addSubBtn.className = 'tm-button';
                addSubBtn.style.cssText = 'width: 100%; margin-top: 4px;';
                addSubBtn.textContent = 'Add Channel';
                subSection.appendChild(addSubBtn);
                
                const subList = document.createElement('div');
                subList.id = 'tmSubscriptionList';
                subSection.appendChild(subList);
                
                uiContainer.appendChild(subSection);
                
                // Create Search Terms section
                const searchSection = document.createElement('div');
                searchSection.className = 'tm-section';
                
                const searchTitle = document.createElement('h3');
                searchTitle.textContent = 'Search Terms';
                searchSection.appendChild(searchTitle);
                
                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.id = 'tmSearchTermInput';
                searchInput.className = 'tm-input';
                searchInput.placeholder = 'Enter search term';
                searchSection.appendChild(searchInput);
                
                const addSearchBtn = document.createElement('button');
                addSearchBtn.id = 'tmAddSearchTerm';
                addSearchBtn.className = 'tm-button';
                addSearchBtn.style.cssText = 'width: 100%; margin-top: 4px;';
                addSearchBtn.textContent = 'Add Search Term';
                searchSection.appendChild(addSearchBtn);
                
                const searchList = document.createElement('div');
                searchList.id = 'tmSearchTermList';
                searchSection.appendChild(searchList);
                
                uiContainer.appendChild(searchSection);
                
                // Create footer text
                const footerDiv = document.createElement('div');
                footerDiv.style.cssText = 'font-size: 10px; color: #666; text-align: center; margin-top: 15px;';
                footerDiv.textContent = 'Press Ctrl+Shift+T to toggle UI';
                uiContainer.appendChild(footerDiv);
                
                // Create toggle button
                const toggleButton = document.createElement('button');
                toggleButton.id = 'timeMachineToggle';
                toggleButton.className = `yt-time-machine-toggle ${this.isVisible ? '' : 'visible'}`;
                toggleButton.textContent = '⏰';
                
                // Append to body
                document.body.appendChild(uiContainer);
                document.body.appendChild(toggleButton);
            }
     
            attachEventListeners() {
                // Toggle button
                document.getElementById('timeMachineToggle')?.addEventListener('click', () => {
                    this.toggleUI();
                });
     
                // Minimize button
                document.getElementById('tmMinimizeBtn')?.addEventListener('click', () => {
                    this.toggleUI();
                });
     
                // Date controls
                document.getElementById('tmApplyDate')?.addEventListener('click', () => {
                    const dateInput = document.getElementById('tmDateInput');
                    if (dateInput.value) {
                        this.timeMachine.setDate(dateInput.value);
                        this.updateUI();
                    }
                });
     
                document.getElementById('tmRandomDate')?.addEventListener('click', () => {
                    this.timeMachine.setRandomDate();
                    this.updateUI();
                });
     
                // Main controls
                document.getElementById('tmToggle')?.addEventListener('click', () => {
                    this.timeMachine.toggle();
                    this.updateUI();
                });
     
                document.getElementById('tmClearCache')?.addEventListener('click', () => {
                    this.timeMachine.apiManager.clearCache();
                    this.timeMachine.videoCache.clear(); // Also clear persistent video cache
                    this.updateUI();
                });
     
                // Vintage theme toggle
                document.getElementById('tmVintageToggle')?.addEventListener('click', () => {
                    this.handleVintageToggle();
                });
     
                // Refresh button
                const refreshBtn = document.getElementById('tmRefreshVideosBtn');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', () => {
                        refreshBtn.disabled = true;
                        refreshBtn.textContent = 'Refreshing...';
     
                        this.timeMachine.loadAllVideos(true).then(() => {
                            const container = document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer');
                            if (container) {
                                this.timeMachine.replaceHomepage(container, true);
                            }
                            refreshBtn.textContent = 'Refreshed!';
                        }).catch(error => {
                            refreshBtn.textContent = 'Refresh Failed';
                            OptimizedUtils.log('Manual refresh failed:', error);
                        }).finally(() => {
                            setTimeout(() => {
                                refreshBtn.disabled = false;
                                refreshBtn.textContent = 'Refresh Videos';
                            }, 2000);
                        });
                    });
                }
     
                // API key management
                document.getElementById('tmAddApiKey')?.addEventListener('click', () => {
                    const input = document.getElementById('tmApiKeyInput');
                    if (input.value.trim()) {
                        this.timeMachine.apiManager.addKey(input.value.trim());
                        input.value = '';
                        this.updateUI();
                    }
                });
     
                document.getElementById('tmTestAllKeys')?.addEventListener('click', async () => {
                    const testBtn = document.getElementById('tmTestAllKeys');
                    testBtn.disabled = true;
                    testBtn.textContent = 'Testing...';
     
                    try {
                        const result = await this.timeMachine.apiManager.testAllKeys();
                        this.showStatusMessage(result.message, result.success ? 'success' : 'error');
                        this.updateUI(); // Refresh to show updated key statuses
                    } catch (error) {
                        this.showStatusMessage('Error testing keys: ' + error.message, 'error');
                    }
     
                    testBtn.disabled = false;
                    testBtn.textContent = 'Test All';
                });
     
                // Proxy management
                document.getElementById('tmProxyEnabled')?.addEventListener('change', (e) => {
                    this.timeMachine.apiManager.enableProxies(e.target.checked);
                    this.updateUI();
                });
     
     
     
                // Date rotation toggle
                document.getElementById('tmDateRotation')?.addEventListener('change', (e) => {
                    this.timeMachine.enableDateRotation(e.target.checked);
                    this.updateUI();
                });
     
                document.getElementById('tmTestClock')?.addEventListener('change', (e) => {
                    this.timeMachine.toggleTestClock(e.target.checked);
                    this.updateUI();
                });
     
                // Subscription management
                document.getElementById('tmAddSubscription')?.addEventListener('click', () => {
                    const input = document.getElementById('tmSubscriptionInput');
                    if (input.value.trim()) {
                        this.timeMachine.subscriptionManager.addSubscription(input.value.trim());
                        input.value = '';
                        this.updateUI();
                    }
                });
     
                // Search Terms management
                document.getElementById('tmAddSearchTerm')?.addEventListener('click', () => {
                    const input = document.getElementById('tmSearchTermInput');
                    if (input.value.trim()) {
                        this.addSearchTerm(input.value.trim());
                        input.value = '';
                        this.updateSearchTermsList();
                    }
                });
     
                document.getElementById('tmSearchTermInput')?.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const input = document.getElementById('tmSearchTermInput');
                        if (input.value.trim()) {
                            this.addSearchTerm(input.value.trim());
                            input.value = '';
                            this.updateSearchTermsList();
                        }
                    }
                });
     
                document.getElementById('tmClearSearchTerms')?.addEventListener('click', () => {
                    this.clearAllSearchTerms();
                    this.updateSearchTermsList();
                });
     
                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                        e.preventDefault();
                        this.toggleUI();
                    }
                });
            }
     
            setupKeyboardShortcuts() {
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                        e.preventDefault();
                        this.toggleUI();
                    }
                });
            }
     
            toggleUI() {
                this.isVisible = !this.isVisible;
                GM_setValue('ytTimeMachineUIVisible', this.isVisible);
     
                const ui = document.getElementById('timeMachineUI');
                const toggle = document.getElementById('timeMachineToggle');
     
                if (this.isVisible) {
                    ui?.classList.remove('hidden');
                    toggle?.classList.remove('visible');
                } else {
                    ui?.classList.add('hidden');
                    toggle?.classList.add('visible');
                }
            }
     
            updateUI() {
                // Early exit if timeMachine is not ready
                if (!this.timeMachine || !this.timeMachine.isInitialized) {
                    console.warn('[WayBackTube] UpdateUI called before timeMachine initialization');
                    return;
                }
     
                // Update date input
                const dateInput = document.getElementById('tmDateInput');
                if (dateInput && this.timeMachine.getDateString) {
                    dateInput.value = this.timeMachine.getDateString();
                }
     
                // Update toggle button
                const toggleBtn = document.getElementById('tmToggle');
                if (toggleBtn && this.timeMachine && this.timeMachine.settings) {
                    toggleBtn.textContent = this.timeMachine.settings.active ? 'Disable' : 'Enable';
                }
     
                // Only update statistics if elements exist
                if (document.getElementById('tmApiCalls')) {
                    this.updateStatistics();
                }
     
                // Update API keys list
                this.updateApiKeysList();
     
                // Update subscriptions list
                this.updateSubscriptionsList();
     
                // Update search terms list
                this.updateSearchTermsList();
     
                // Update date rotation checkbox
                const dateRotationCheckbox = document.getElementById('tmDateRotation');
                if (dateRotationCheckbox) {
                    dateRotationCheckbox.checked = this.timeMachine.settings.dateRotationEnabled;
                }
     
                const testClockCheckbox = document.getElementById('tmTestClock');
                if (testClockCheckbox) {
                    testClockCheckbox.checked = GM_getValue('wayback_persistent_clock_enabled', false);
                }
            }
     
            showStatusMessage(message, type = 'info') {
                // Create a temporary message overlay
                const messageDiv = document.createElement('div');
                messageDiv.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 16px;
                    border-radius: 6px;
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 14px;
                    z-index: 999999;
                    max-width: 300px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                `;
     
                const colors = {
                    success: '#4CAF50',
                    error: '#f44336',
                    warning: '#ff9800',
                    info: '#2196F3'
                };
     
                messageDiv.style.backgroundColor = colors[type] || colors.info;
                messageDiv.textContent = message;
     
                document.body.appendChild(messageDiv);
     
                // Auto-remove after 3 seconds
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 3000);
     
                console.log(`[WayBackTube] ${type.toUpperCase()}: ${message}`);
            }
     
     
     
     
     
            updateStatistics() {
                try {
                    // Check if statistics elements exist before trying to update
                    const apiCallsEl = document.getElementById('tmApiCalls');
                    const videosProcessedEl = document.getElementById('tmVideosProcessed');
                    const cacheHitsEl = document.getElementById('tmCacheHits');
                    const videosFilteredEl = document.getElementById('tmVideosFiltered');
     
                    // If no statistics elements exist, skip update
                    if (!apiCallsEl && !videosProcessedEl && !cacheHitsEl && !videosFilteredEl) {
                        return;
                    }
     
                    // Ensure timeMachine exists and has getStats method
                    if (!this.timeMachine || typeof this.timeMachine.getStats !== 'function') {
                        console.warn('[WayBackTube] TimeMachine not ready for statistics update');
                        return;
                    }
     
                    const stats = this.timeMachine.getStats() || {};
     
                    // Double-check each element exists before setting textContent
                    try {
                        if (apiCallsEl && apiCallsEl.parentNode) apiCallsEl.textContent = stats.apiCalls || '0';
                    } catch (e) { /* Ignore */ }
                    
                    try {
                        if (videosProcessedEl && videosProcessedEl.parentNode) videosProcessedEl.textContent = stats.processed || '0';
                    } catch (e) { /* Ignore */ }
                    
                    try {
                        if (cacheHitsEl && cacheHitsEl.parentNode) cacheHitsEl.textContent = stats.cacheHits || '0';
                    } catch (e) { /* Ignore */ }
                    
                    try {
                        if (videosFilteredEl && videosFilteredEl.parentNode) videosFilteredEl.textContent = stats.filtered || '0';
                    } catch (e) { /* Ignore */ }
                } catch (error) {
                    // Silently ignore all statistics update errors to prevent retry loops
                    console.warn('[WayBackTube] Statistics update failed:', error);
                }
            }
     
            updateApiKeysList() {
                const container = document.getElementById('tmApiKeyList');
                if (!container) return;
     
                const keys = this.timeMachine.apiManager.keys;
                const currentKeyIndex = this.timeMachine.apiManager.currentKeyIndex;
                const keyStats = this.timeMachine.apiManager.keyStats;
     
                if (keys.length === 0) {
                    container.textContent = '';
                    const noKeysDiv = document.createElement('div');
                    noKeysDiv.style.cssText = 'color: #666; font-size: 11px; text-align: center; padding: 8px;';
                    noKeysDiv.textContent = 'No API keys added';
                    container.appendChild(noKeysDiv);
                    return;
                }
     
                container.textContent = '';
                keys.forEach((key, index) => {
                    const isActive = index === currentKeyIndex;
                    const stats = keyStats[key] || {};
     
                    let status = 'Unknown';
                    let statusIcon = '❓';
                    let statusColor = '#666';
     
                    if (stats.quotaExceeded) {
                        status = 'Quota Exceeded';
                        statusIcon = '🚫';
                        statusColor = '#ff4444';
                    } else if (stats.failed) {
                        status = 'Failed';
                        statusIcon = '❌';
                        statusColor = '#ff6666';
                    } else if (isActive) {
                        status = 'Active';
                        statusIcon = '✅';
                        statusColor = '#4CAF50';
                    } else if (stats.successCount > 0) {
                        status = 'Standby';
                        statusIcon = '⏸️';
                        statusColor = '#ff9800';
                    } else {
                        status = 'Untested';
                        statusIcon = '⚪';
                        statusColor = '#999';
                    }
     
                    // Create key item using DOM methods
                    const keyItem = document.createElement('div');
                    keyItem.className = 'tm-api-key-item';
                    keyItem.dataset.key = key;
                    keyItem.style.cssText = 'margin-bottom: 8px; padding: 8px; background: #2a2a2a; border-radius: 4px;';
                    
                    const flexDiv = document.createElement('div');
                    flexDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
                    
                    const infoDiv = document.createElement('div');
                    infoDiv.style.cssText = 'flex: 1; min-width: 0;';
                    
                    const keyDiv = document.createElement('div');
                    keyDiv.style.cssText = 'font-size: 11px; color: #fff; margin-bottom: 4px;';
                    keyDiv.textContent = `${statusIcon} ${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
                    
                    const statsDiv = document.createElement('div');
                    statsDiv.style.cssText = 'display: flex; gap: 12px; font-size: 10px; color: #999;';
                    
                    const statusSpan = document.createElement('span');
                    statusSpan.style.color = statusColor;
                    statusSpan.textContent = status;
                    
                    const requestsSpan = document.createElement('span');
                    requestsSpan.textContent = `${stats.requestCount || 0} requests`;
                    
                    const successSpan = document.createElement('span');
                    successSpan.textContent = `${stats.successCount || 0} successful`;
                    
                    statsDiv.appendChild(statusSpan);
                    statsDiv.appendChild(requestsSpan);
                    statsDiv.appendChild(successSpan);
                    
                    infoDiv.appendChild(keyDiv);
                    infoDiv.appendChild(statsDiv);
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'tm-remove-key';
                    removeBtn.dataset.key = key;
                    removeBtn.style.cssText = 'background: #ff4444; border: none; color: white; padding: 4px 8px; border-radius: 3px; font-size: 10px; cursor: pointer; margin-left: 8px;';
                    removeBtn.textContent = 'Remove';
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.timeMachine.apiManager.removeKey(key);
                        this.updateUI();
                    });
                    
                    flexDiv.appendChild(infoDiv);
                    flexDiv.appendChild(removeBtn);
                    keyItem.appendChild(flexDiv);
                    container.appendChild(keyItem);
                });
            }
     
            updateSubscriptionsList() {
                const container = document.getElementById('tmSubscriptionList');
                if (!container) return;
     
                const subscriptions = this.timeMachine.subscriptionManager.getSubscriptions();
     
                container.textContent = '';
     
                if (subscriptions.length === 0) {
                    const noSubsDiv = document.createElement('div');
                    noSubsDiv.style.cssText = 'padding: 8px; text-align: center; color: #666;';
                    noSubsDiv.textContent = 'No subscriptions added';
                    container.appendChild(noSubsDiv);
                    return;
                }
     
                subscriptions.forEach((sub, index) => {
                    const subItem = document.createElement('div');
                    subItem.className = 'tm-subscription-item';
                    
                    const subName = document.createElement('span');
                    subName.className = 'tm-subscription-name';
                    subName.textContent = sub.name;
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'tm-remove-btn';
                    removeBtn.textContent = 'Remove';
                    removeBtn.addEventListener('click', () => {
                        this.timeMachine.removeSubscription(index);
                    });
                    
                    subItem.appendChild(subName);
                    subItem.appendChild(removeBtn);
                    container.appendChild(subItem);
                });
            }
     
            // Search Terms Management Methods
            loadSearchTerms() {
                try {
                    const searchTerms = JSON.parse(GM_getValue('ytSearchTerms', '[]'));
                    return searchTerms.length > 0 ? searchTerms : this.getDefaultSearchTerms();
                } catch (error) {
                    return this.getDefaultSearchTerms();
                }
            }
     
            saveSearchTerms(searchTerms) {
                GM_setValue('ytSearchTerms', JSON.stringify(searchTerms));
            }
     
            getDefaultSearchTerms() {
                return ['memes', 'gaming', 'funny', 'music', 'tutorial'];
            }
     
            addSearchTerm(term) {
                const searchTerms = this.loadSearchTerms();
                if (!searchTerms.includes(term.toLowerCase())) {
                    searchTerms.push(term.toLowerCase());
                    this.saveSearchTerms(searchTerms);
                }
            }
     
            removeSearchTerm(index) {
                const searchTerms = this.loadSearchTerms();
                searchTerms.splice(index, 1);
                this.saveSearchTerms(searchTerms);
            }
     
            clearAllSearchTerms() {
                this.saveSearchTerms([]);
            }
     
            getSearchTerms() {
                return this.loadSearchTerms();
            }
     
            updateSearchTermsList() {
                const container = document.getElementById('tmSearchTermList');
                if (!container) return;
     
                const searchTerms = this.loadSearchTerms();
     
                container.textContent = '';
     
                if (searchTerms.length === 0) {
                    const noTermsDiv = document.createElement('div');
                    noTermsDiv.style.cssText = 'padding: 8px; text-align: center; color: #666;';
                    noTermsDiv.textContent = 'No search terms added';
                    container.appendChild(noTermsDiv);
                    return;
                }
     
                searchTerms.forEach((term, index) => {
                    const termItem = document.createElement('div');
                    termItem.className = 'tm-subscription-item';
                    
                    const termName = document.createElement('span');
                    termName.className = 'tm-subscription-name';
                    termName.textContent = term;
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'tm-remove-btn';
                    removeBtn.textContent = 'Remove';
                    removeBtn.addEventListener('click', () => {
                        this.removeSearchTerm(index);
                        this.updateSearchTermsList();
                    });
                    
                    termItem.appendChild(termName);
                    termItem.appendChild(removeBtn);
                    container.appendChild(termItem);
                });
            }
     
            handleVintageToggle() {
                const currentState = GM_getValue('ytVintage2011Theme', false);
                const newState = !currentState;
                
                // Save the new state
                GM_setValue('ytVintage2011Theme', newState);
                
                // Force CSS re-injection if enabling theme
                if (newState && !document.querySelector('style[data-wayback-vintage]')) {
                    OptimizedUtils.log('Re-injecting vintage CSS...');
                    this.injectVintageCSS();
                }
                
                // Update the DOM
                if (newState) {
                    document.body.classList.add('wayback-2011-theme');
                    OptimizedUtils.log('Added wayback-2011-theme class to body');
                } else {
                    document.body.classList.remove('wayback-2011-theme');
                    OptimizedUtils.log('Removed wayback-2011-theme class from body');
                }
                
                // Update ALL possible buttons (both UI systems)
                const buttons = [
                    document.getElementById('tmVintageToggle'),
                    document.getElementById('wayback-vintage-toggle')
                ];
                
                buttons.forEach(button => {
                    if (button) {
                        button.textContent = newState ? '🕰️ Modern Theme' : '🕰️ 2011 Theme';
                        button.classList.toggle('active', newState);
                        OptimizedUtils.log(`Button updated: ${button.textContent}`);
                    }
                });
                
                // Debug: Check if class is actually on body
                OptimizedUtils.log(`Body classes: ${document.body.className}`);
                OptimizedUtils.log(`2011 Vintage Theme ${newState ? 'enabled' : 'disabled'}`);
            }
     
            injectVintageCSS() {
                // Make sure vintage CSS is injected
                const vintage2011CSS = `
                    /* Simple 2011 Theme - NO BLUE TEXT (user request) */
                    body.wayback-2011-theme {
                        /* Remove blue text styling completely */
                    }
     
                    /* Remove ALL rounded corners - make everything square */
                    body.wayback-2011-theme *,
                    body.wayback-2011-theme *:before,
                    body.wayback-2011-theme *:after {
                        border-radius: 0 !important;
                        -webkit-border-radius: 0 !important;
                        -moz-border-radius: 0 !important;
                    }
     
                    /* FIXED: Square thumbnails with normal sizing */
                    body.wayback-2011-theme ytd-thumbnail img,
                    body.wayback-2011-theme .ytd-thumbnail img {
                        border-radius: 0 !important;
                        object-fit: cover !important; /* Use cover for normal thumbnail behavior */
                    }
     
                    /* Fix thumbnail containers */
                    body.wayback-2011-theme ytd-thumbnail,
                    body.wayback-2011-theme .ytd-thumbnail,
                    body.wayback-2011-theme #thumbnail {
                        border-radius: 0 !important;
                    }
     
                    /* Don't break all images - only target thumbnails specifically */
                    body.wayback-2011-theme ytd-video-renderer ytd-thumbnail img,
                    body.wayback-2011-theme ytd-rich-item-renderer ytd-thumbnail img,
                    body.wayback-2011-theme ytd-grid-video-renderer ytd-thumbnail img {
                        border-radius: 0 !important;
                        object-fit: cover !important;
                    }
     
                    /* Fix channel profile pictures - keep normal size */
                    body.wayback-2011-theme yt-img-shadow img,
                    body.wayback-2011-theme ytd-channel-avatar img,
                    body.wayback-2011-theme #avatar img,
                    body.wayback-2011-theme .ytd-channel-avatar img {
                        border-radius: 0 !important;
                        max-width: 36px !important;
                        max-height: 36px !important;
                        width: 36px !important;
                        height: 36px !important;
                    }
     
                    /* Square buttons */
                    body.wayback-2011-theme button,
                    body.wayback-2011-theme .yt-spec-button-shape-next,
                    body.wayback-2011-theme .yt-spec-button-shape-next__button {
                        border-radius: 0 !important;
                    }
     
                    /* Square search box */
                    body.wayback-2011-theme input,
                    body.wayback-2011-theme #search-form,
                    body.wayback-2011-theme ytd-searchbox,
                    body.wayback-2011-theme #search-form input {
                        border-radius: 0 !important;
                    }
     
                    /* Square video containers */
                    body.wayback-2011-theme ytd-video-renderer,
                    body.wayback-2011-theme ytd-grid-video-renderer,
                    body.wayback-2011-theme ytd-rich-item-renderer {
                        border-radius: 0 !important;
                    }
     
                    /* FIXED: Remove ALL hover elevation effects and animations */
                    body.wayback-2011-theme *,
                    body.wayback-2011-theme *:before,
                    body.wayback-2011-theme *:after,
                    body.wayback-2011-theme *:hover,
                    body.wayback-2011-theme *:hover:before,
                    body.wayback-2011-theme *:hover:after {
                        transition: none !important;
                        animation: none !important;
                        transform: none !important;
                        box-shadow: none !important;
                        -webkit-transition: none !important;
                        -webkit-animation: none !important;
                        -webkit-transform: none !important;
                        -webkit-box-shadow: none !important;
                        -moz-transition: none !important;
                        -moz-animation: none !important;
                        -moz-transform: none !important;
                        -moz-box-shadow: none !important;
                    }
     
                    /* Specifically disable hover effects on video containers */
                    body.wayback-2011-theme ytd-video-renderer:hover,
                    body.wayback-2011-theme ytd-rich-item-renderer:hover,
                    body.wayback-2011-theme ytd-grid-video-renderer:hover,
                    body.wayback-2011-theme .ytd-video-renderer:hover,
                    body.wayback-2011-theme .ytd-rich-item-renderer:hover,
                    body.wayback-2011-theme .ytd-grid-video-renderer:hover {
                        transform: none !important;
                        box-shadow: none !important;
                        transition: none !important;
                        animation: none !important;
                        -webkit-transform: none !important;
                        -webkit-box-shadow: none !important;
                        -webkit-transition: none !important;
                        -webkit-animation: none !important;
                    }
     
                    /* Disable thumbnail hover scaling/animations */
                    body.wayback-2011-theme ytd-thumbnail:hover img,
                    body.wayback-2011-theme .ytd-thumbnail:hover img,
                    body.wayback-2011-theme #thumbnail:hover img {
                        transform: none !important;
                        transition: none !important;
                        animation: none !important;
                        -webkit-transform: none !important;
                        -webkit-transition: none !important;
                        -webkit-animation: none !important;
                    }
     
                    /* Fix oversized watch next section */
                    body.wayback-2011-theme #secondary #secondary-inner,
                    body.wayback-2011-theme ytd-watch-next-secondary-results-renderer {
                        max-width: 400px !important;
                    }
                    
                    body.wayback-2011-theme #secondary ytd-compact-video-renderer ytd-thumbnail,
                    body.wayback-2011-theme #secondary .ytd-compact-video-renderer .ytd-thumbnail {
                        width: 220px !important;
                        height: 124px !important;
                        min-width: 220px !important;
                        flex-shrink: 0 !important;
                    }
     
                    body.wayback-2011-theme #secondary ytd-compact-video-renderer ytd-thumbnail img,
                    body.wayback-2011-theme #secondary .ytd-compact-video-renderer .ytd-thumbnail img {
                        width: 220px !important;
                        height: 124px !important;
                        object-fit: cover !important;
                        border-radius: 0 !important;
                    }
     
                    /* Fix oversized emojis - be more specific to avoid breaking thumbnails */
                    body.wayback-2011-theme .emoji,
                    body.wayback-2011-theme img[src*="emoji"] {
                        max-width: 20px !important;
                        max-height: 20px !important;
                        width: auto !important;
                        height: auto !important;
                    }
     
                    /* Don't break main video thumbnails */
                    body.wayback-2011-theme ytd-video-renderer:not(#secondary *) ytd-thumbnail,
                    body.wayback-2011-theme ytd-rich-item-renderer:not(#secondary *) ytd-thumbnail,
                    body.wayback-2011-theme ytd-grid-video-renderer:not(#secondary *) ytd-thumbnail {
                        width: auto !important;
                        height: auto !important;
                    }
                `;
     
                // Create style element with marker
                const styleElement = document.createElement('style');
                styleElement.setAttribute('data-wayback-vintage', 'true');
                styleElement.textContent = vintage2011CSS;
                document.head.appendChild(styleElement);
                
                // Also use GM_addStyle as backup
                GM_addStyle(vintage2011CSS);
                
                OptimizedUtils.log('Vintage 2011 CSS injected');
            }
     
            initializeVintageTheme() {
                const isVintageActive = GM_getValue('ytVintage2011Theme', false);
                const button = document.getElementById('tmVintageToggle');
                
                // Always inject vintage CSS on initialization
                this.injectVintageCSS();
                
                // Apply saved theme state
                if (isVintageActive) {
                    document.body.classList.add('wayback-2011-theme');
                }
                
                // Update button state
                if (button) {
                    button.textContent = isVintageActive ? '🕰️ Modern Theme' : '🕰️ 2011 Theme';
                    button.classList.toggle('active', isVintageActive);
                }
                
                // Expose global vintage toggle function for compatibility
                window.handleGlobalVintageToggle = () => this.handleVintageToggle();
                
                OptimizedUtils.log(`2011 Vintage Theme initialized: ${isVintageActive ? 'active' : 'inactive'}`);
            }
     
            handleUrlChange() {
                // Re-initialize elements that may have been replaced by navigation
                setTimeout(() => {
                    this.timeMachine.searchManager?.injectSearchDateFilter();
                }, 500);
            }
        }
     
        // === INITIALIZATION ===
        let wayBackTubeApp;
     
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
     
        function initializeApp() {
            try {
                wayBackTubeApp = new WayBackTubeOptimized();
     
                // Global access for debugging and video caching
                window.WayBackTube = wayBackTubeApp;
                window.waybackTubeManager = wayBackTubeApp; // For video caching compatibility
     
                // Removed relative date filtering to prevent double-processing and "in the future" issues
     
                OptimizedUtils.log('WayBackTube Optimized loaded successfully');
            } catch (error) {
                console.error('Failed to initialize WayBackTube:', error);
            }
        }
     
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (wayBackTubeApp) {
                wayBackTubeApp.cleanup();
            }
        });
     
        // Handle navigation changes (for SPAs like YouTube)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (wayBackTubeApp && wayBackTubeApp.isInitialized) {
                    // Re-initialize UI for new page if needed
                    setTimeout(() => {
                        wayBackTubeApp.uiManager.handleUrlChange();
                    }, 500);
                }
            }
        }).observe(document, { subtree: true, childList: true });
     
        OptimizedUtils.log('WayBackTube Optimized script loaded');
     
    })();

