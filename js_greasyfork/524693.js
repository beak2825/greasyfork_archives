// ==UserScript==
// @name         Any Hackernews Link Utils
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Utility functions for Any Hackernews Link
// @author       RoCry
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      hn.algolia.com
// @license      MIT
// ==/UserScript==

/**
 * GM_* API Polyfills for Safari and other browsers
 */
const GMPolyfills = {
    initialize() {
        if (typeof GM_addStyle === 'undefined') {
            window.GM_addStyle = function (css) {
                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
                return style;
            };
        }

        if (typeof GM_getValue === 'undefined') {
            window.GM_getValue = function (key, defaultValue) {
                const value = localStorage.getItem('GM_' + key);
                return value === null ? defaultValue : JSON.parse(value);
            };
        }

        if (typeof GM_setValue === 'undefined') {
            window.GM_setValue = function (key, value) {
                localStorage.setItem('GM_' + key, JSON.stringify(value));
            };
        }
    }
};

/**
 * UI Constants
 */
const UI_CONSTANTS = {
    POSITIONS: {
        BOTTOM_LEFT: { bottom: '20px', left: '20px', top: 'auto', right: 'auto' },
        BOTTOM_RIGHT: { bottom: '20px', right: '20px', top: 'auto', left: 'auto' },
        TOP_LEFT: { top: '20px', left: '20px', bottom: 'auto', right: 'auto' },
        TOP_RIGHT: { top: '20px', right: '20px', bottom: 'auto', left: 'auto' }
    },

    STYLES: `
        @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        #hn-float {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.98);
            padding: 8px 12px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
            cursor: move;
            user-select: none;
            transition: all 0.2s ease;
            max-width: 50px;
            overflow: hidden;
            opacity: 0.95;
            height: 40px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            animation: fadeIn 0.3s ease forwards;
            will-change: transform, max-width, box-shadow;
            color: #111827;
            display: flex;
            align-items: center;
            height: 40px;
            box-sizing: border-box;
        }
        #hn-float:hover {
            max-width: 600px;
            opacity: 1;
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
        }
        #hn-float .hn-icon {
            min-width: 24px;
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #ff6600, #ff7f33);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border-radius: 6px;
            flex-shrink: 0;
            position: relative;
            font-size: 13px;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
            line-height: 1;
            padding-bottom: 1px;
        }
        #hn-float:hover .hn-icon {
            transform: scale(1.05);
        }
        #hn-float .hn-icon.not-found {
            background: #9ca3af;
        }
        #hn-float .hn-icon.found {
            background: linear-gradient(135deg, #ff6600, #ff7f33);
        }
        #hn-float .hn-icon.loading {
            background: #6b7280;
            animation: pulse 1.5s infinite;
        }
        #hn-float .hn-icon .badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            border-radius: 8px;
            min-width: 14px;
            height: 14px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 3px;
            font-weight: 600;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1.5px solid white;
        }
        #hn-float .hn-info {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.4;
            font-size: 13px;
            opacity: 0;
            transition: opacity 0.2s ease;
            width: 0;
            flex: 0;
        }
        #hn-float:hover .hn-info {
            opacity: 1;
            width: auto;
            flex: 1;
        }
        #hn-float .hn-info a {
            color: inherit;
            font-weight: 500;
            text-decoration: none;
        }
        #hn-float .hn-info a:hover {
            text-decoration: underline;
        }
        #hn-float .hn-stats {
            color: #6b7280;
            font-size: 12px;
            margin-top: 2px;
        }
        @media (prefers-color-scheme: dark) {
            #hn-float {
                background: rgba(17, 24, 39, 0.95);
                color: #e5e7eb;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
            }
            #hn-float:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
            }
            #hn-float .hn-stats {
                color: #9ca3af;
            }
            #hn-float .hn-icon .badge {
                border-color: rgba(17, 24, 39, 0.95);
            }
        }
    `
};

/**
 * Configuration
 */
const CONFIG = {
    // Additional domains to ignore that couldn't be handled by @exclude
    IGNORED_DOMAINS: [
        'gmail.com',
        'accounts.google.com',
        'accounts.youtube.com',
        'signin.',
        'login.',
        'auth.',
        'oauth.',
    ],

    // Patterns that indicate a search page
    SEARCH_PATTERNS: [
        '/search?',
        '/search/',
        '/search#',
        '/webhp',
        '/results',
        '?q=',
        '?query=',
        '?search=',
        '?s='
    ],

    // URL parameters to remove during normalization
    TRACKING_PARAMS: [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'fbclid',
        'gclid',
        '_ga',
        'ref',
        'source'
    ],

    // Minimum ratio of ASCII characters to consider content as English
    MIN_ASCII_RATIO: 0.9,

    // Number of characters to check for language detection
    CHARS_TO_CHECK: 300
};

/**
 * URL Utilities
 */
const URLUtils = {
    /**
     * Check if a URL should be ignored based on domain or search patterns
     * @param {string} url - URL to check
     * @returns {boolean} - True if URL should be ignored
     */
    shouldIgnoreUrl(url) {
        try {
            const urlObj = new URL(url);

            // Check remaining ignored domains
            if (CONFIG.IGNORED_DOMAINS.some(domain => urlObj.hostname.includes(domain))) {
                return true;
            }

            // Check if it's a search page
            if (CONFIG.SEARCH_PATTERNS.some(pattern =>
                urlObj.pathname.includes(pattern) || urlObj.search.includes(pattern))) {
                return true;
            }

            return false;
        } catch (e) {
            console.error('Error checking URL:', e);
            return false;
        }
    },

    /**
     * Normalize URL by removing tracking parameters and standardizing format
     * @param {string} url - URL to normalize
     * @returns {string} - Normalized URL
     */
    normalizeUrl(url) {
        try {
            const urlObj = new URL(url);

            // Remove tracking parameters
            CONFIG.TRACKING_PARAMS.forEach(param => urlObj.searchParams.delete(param));

            // Remove sepecial parameter for all hosts
            // https://github.com/HackerNews/API?tab=readme-ov-file -> https://github.com/HackerNews/API
            urlObj.searchParams.delete('tab');

            // Handle GitHub repository paths
            if (urlObj.hostname === 'github.com') {
                // Split path into segments
                const pathSegments = urlObj.pathname.split('/').filter(Boolean);

                // Only process if we have at least username/repo
                if (pathSegments.length >= 2) {
                    const [username, repo, ...rest] = pathSegments;

                    // If path contains tree/master, blob/master, or similar, remove them
                    if (rest.length > 0 && (rest[0] === 'tree' || rest[0] === 'blob')) {
                        urlObj.pathname = `/${username}/${repo}`;
                    }
                }
            }
            // for arxiv
            // https://arxiv.org/pdf/1706.03762 -> https://arxiv.org/abs/1706.03762
            if (urlObj.hostname === 'arxiv.org') {
                urlObj.pathname = urlObj.pathname.replace('/pdf/', '/abs/');
            }

            // Remove hash
            urlObj.hash = '';

            // Remove trailing slash for consistency
            let normalizedUrl = urlObj.toString();
            if (normalizedUrl.endsWith('/')) {
                normalizedUrl = normalizedUrl.slice(0, -1);
            }

            return normalizedUrl;
        } catch (e) {
            console.error('Error normalizing URL:', e);
            return url;
        }
    },

    /**
     * Compare two URLs for equality after normalization
     * @param {string} url1 - First URL
     * @param {string} url2 - Second URL
     * @returns {boolean} - True if URLs match
     */
    urlsMatch(url1, url2) {
        try {
            const u1 = new URL(this.normalizeUrl(url1));
            const u2 = new URL(this.normalizeUrl(url2));

            return u1.hostname.toLowerCase() === u2.hostname.toLowerCase() &&
                u1.pathname.toLowerCase() === u2.pathname.toLowerCase() &&
                u1.search === u2.search;
        } catch (e) {
            console.error('Error comparing URLs:', e);
            return false;
        }
    }
};

/**
 * Content Utilities
 */
const ContentUtils = {
    /**
     * Check if text is primarily English by checking ASCII ratio
     * @param {string} text - Text to analyze
     * @returns {boolean} - True if content is likely English
     */
    isEnglishContent() {
        try {
            // Get text from title and first paragraph or relevant content
            const title = document.title || '';
            const firstParagraphs = Array.from(document.getElementsByTagName('p'))
                .slice(0, 3)
                .map(p => p.textContent)
                .join(' ');

            const textToAnalyze = (title + ' ' + firstParagraphs)
                .slice(0, CONFIG.CHARS_TO_CHECK)
                .replace(/\s+/g, ' ')
                .trim();

            if (!textToAnalyze) return true; // If no text found, assume English

            // Count ASCII characters (excluding spaces and common punctuation)
            const asciiChars = textToAnalyze.replace(/[\s\.,\-_'"!?()]/g, '')
                .split('')
                .filter(char => char.charCodeAt(0) <= 127).length;

            const totalChars = textToAnalyze.replace(/[\s\.,\-_'"!?()]/g, '').length;

            if (totalChars === 0) return true;

            const asciiRatio = asciiChars / totalChars;
            console.log('🈂️ ASCII Ratio:', asciiRatio.toFixed(2));

            return asciiRatio >= CONFIG.MIN_ASCII_RATIO;
        } catch (e) {
            console.error('Error checking content language:', e);
            return true; // Default to allowing English in case of error
        }
    }
};

/**
 * UI Helper Utilities
 */
const UIHelpers = {
    /**
     * Apply position to an element
     * @param {HTMLElement} element - Element to position
     * @param {Object} position - Position object with top/bottom/left/right properties
     */
    applyPosition(element, position) {
        Object.assign(element.style, position);
    },

    /**
     * Get the closest corner position based on coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {string} - Position key (e.g., 'TOP_LEFT')
     */
    getClosestPosition(x, y) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isTop = y < viewportHeight / 2;
        const isLeft = x < viewportWidth / 2;

        if (isTop) {
            return isLeft ? 'TOP_LEFT' : 'TOP_RIGHT';
        } else {
            return isLeft ? 'BOTTOM_LEFT' : 'BOTTOM_RIGHT';
        }
    },

    /**
     * Create HN badge element
     * @param {number} count - Number to display in badge
     * @returns {HTMLElement} - Badge element
     */
    createBadge(count) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = count > 999 ? '999+' : count.toString();
        return badge;
    },

    /**
     * Create stats element
     * @param {Object} data - HN post data
     * @returns {HTMLElement} - Stats element
     */
    createStatsElement(data) {
        const statsDiv = document.createElement('div');
        statsDiv.className = 'hn-stats';
        statsDiv.textContent = `${data.points} points | ${data.comments} comments | ${data.posted}`;
        return statsDiv;
    },

    /**
     * Create and setup drag handlers for an element
     * @param {HTMLElement} element - Element to make draggable
     * @param {Function} onDragEnd - Callback when drag ends with (x, y) coordinates
     */
    makeDraggable(element, onDragEnd) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        element.addEventListener('mousedown', e => {
            if (e.target.tagName === 'A') return; // Don't drag when clicking links

            isDragging = true;
            element.style.transition = 'none';

            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;

            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // Keep the element within viewport bounds
            currentX = Math.max(0, Math.min(currentX, window.innerWidth - element.offsetWidth));
            currentY = Math.max(0, Math.min(currentY, window.innerHeight - element.offsetHeight));

            element.style.left = `${currentX}px`;
            element.style.top = `${currentY}px`;
            element.style.bottom = 'auto';
            element.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;

            isDragging = false;
            element.style.transition = 'all 0.2s ease';

            if (onDragEnd && currentX !== undefined && currentY !== undefined) {
                onDragEnd(currentX + element.offsetWidth / 2, currentY + element.offsetHeight / 2);
            }
        });
    },

    /**
     * Create the floating HN element
     * @returns {HTMLElement} - The created floating element
     */
    createFloatingElement() {
        const div = document.createElement('div');
        div.id = 'hn-float';

        // Create icon element
        const iconDiv = document.createElement('div');
        iconDiv.className = 'hn-icon loading';
        iconDiv.textContent = 'Y';

        // Create info element
        const infoDiv = document.createElement('div');
        infoDiv.className = 'hn-info';
        infoDiv.textContent = 'Checking HN...';

        // Append children
        div.appendChild(iconDiv);
        div.appendChild(infoDiv);

        return div;
    },

    /**
     * Update the floating element with HN data
     * @param {HTMLElement} floatElement - The floating element
     * @param {Object|null} data - HN post data or null if not found
     */
    updateFloatingElement(floatElement, data) {
        const iconDiv = floatElement.querySelector('.hn-icon');
        const infoDiv = floatElement.querySelector('.hn-info');

        iconDiv.classList.remove('loading');

        if (!data) {
            iconDiv.classList.add('not-found');
            iconDiv.classList.remove('found');
            iconDiv.textContent = 'Y';
            infoDiv.textContent = 'Not found on HN';
            return;
        }

        iconDiv.classList.remove('not-found');
        iconDiv.classList.add('found');
        // Clear existing content
        iconDiv.textContent = 'Y';

        // Make icon clickable
        iconDiv.style.cursor = 'pointer';
        iconDiv.onclick = (e) => {
            e.stopPropagation();
            window.open(data.link, '_blank');
        };

        // Add badge if there are comments
        if (data.comments > 0) {
            iconDiv.appendChild(this.createBadge(data.comments));
        }

        // Clear and rebuild info content
        infoDiv.textContent = '';

        const titleDiv = document.createElement('div');
        const titleLink = document.createElement('a');
        titleLink.href = data.link;
        titleLink.target = '_blank';
        titleLink.textContent = data.title;
        titleDiv.appendChild(titleLink);

        const statsDiv = this.createStatsElement(data);

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(statsDiv);
    }
};

/**
 * HackerNews API Handler
 */
const HNApi = {
    /**
     * Search for a URL on HackerNews
     * @param {string} normalizedUrl - URL to search for
     * @param {Function} updateUI - Callback function to update UI with results
     */
    checkHackerNews(normalizedUrl, updateUI) {
        const apiUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(normalizedUrl)}&restrictSearchableAttributes=url`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: (response) => this.handleApiResponse(response, normalizedUrl, updateUI),
            onerror: (error) => {
                console.error('Error fetching from HN API:', error);
                updateUI(null);
            }
        });
    },

    /**
     * Handle the API response
     * @param {Object} response - API response
     * @param {string} normalizedUrl - Original normalized URL
     * @param {Function} updateUI - Callback function to update UI with results
     */
    handleApiResponse(response, normalizedUrl, updateUI) {
        try {
            const data = JSON.parse(response.responseText);
            const matchingHits = data.hits.filter(hit => URLUtils.urlsMatch(hit.url, normalizedUrl));

            if (matchingHits.length === 0) {
                console.log('🔍 URL not found on Hacker News');
                updateUI(null);
                return;
            }

            const topHit = matchingHits.sort((a, b) => (b.points || 0) - (a.points || 0))[0];
            const result = {
                title: topHit.title,
                points: topHit.points || 0,
                comments: topHit.num_comments || 0,
                link: `https://news.ycombinator.com/item?id=${topHit.objectID}`,
                posted: new Date(topHit.created_at).toLocaleDateString()
            };

            console.log('📰 Found on Hacker News:', result);
            updateUI(result);
        } catch (e) {
            console.error('Error parsing HN API response:', e);
            updateUI(null);
        }
    }
};

// Export all utilities to global scope for use in the main script
if (typeof window !== 'undefined') {
    window.GMPolyfills = GMPolyfills;
    window.UI_CONSTANTS = UI_CONSTANTS;
    window.CONFIG = CONFIG;
    window.URLUtils = URLUtils;
    window.ContentUtils = ContentUtils;
    window.UIHelpers = UIHelpers;
    window.HNApi = HNApi;
}