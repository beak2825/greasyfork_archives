// ==UserScript==
// @name         GeoGuessr PlonkIt Button
// @description  Adds a button that links to the Plonk It page for that respective country, after the round ends
// @version      1.0
// @author       ArunSomasundaram
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        GM_openInTab
// @run-at       document-start
// @namespace https://greasyfork.org/users/1484321
// @downloadURL https://update.greasyfork.org/scripts/539558/GeoGuessr%20PlonkIt%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/539558/GeoGuessr%20PlonkIt%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // CONSTANTS AND CONFIGURATION
    // ============================================================================

    /**
     * Mapping of ISO 3166-1 alpha-2 country codes to PlonkIt URL slugs
     */
    const COUNTRY_DICT = {
        'ad': 'andorra', 'ae': 'united-arab-emirates', 'af': 'afghanistan', 'ag': 'antigua-and-barbuda',
        'ai': 'anguilla', 'al': 'albania', 'am': 'armenia', 'ao': 'angola', 'aq': 'antarctica',
        'ar': 'argentina', 'as': 'american-samoa', 'at': 'austria', 'au': 'australia', 'aw': 'aruba',
        'ax': 'aland-islands', 'az': 'azerbaijan', 'ba': 'bosnia-and-herzegovina', 'bb': 'barbados',
        'bd': 'bangladesh', 'be': 'belgium', 'bf': 'burkina-faso', 'bg': 'bulgaria', 'bh': 'bahrain',
        'bi': 'burundi', 'bj': 'benin', 'bl': 'saint-barthelemy', 'bm': 'bermuda', 'bn': 'brunei',
        'bo': 'bolivia', 'bq': 'caribbean-netherlands', 'br': 'brazil', 'bs': 'bahamas', 'bt': 'bhutan',
        'bv': 'bouvet-island', 'bw': 'botswana', 'by': 'belarus', 'bz': 'belize', 'ca': 'canada',
        'cc': 'cocos-keeling-islands', 'cd': 'democratic-republic-of-the-congo', 'cf': 'central-african-republic',
        'cg': 'republic-of-the-congo', 'ch': 'switzerland', 'ci': 'ivory-coast', 'ck': 'cook-islands',
        'cl': 'chile', 'cm': 'cameroon', 'cn': 'china', 'co': 'colombia', 'cr': 'costa-rica',
        'cu': 'cuba', 'cv': 'cape-verde', 'cw': 'curacao', 'cx': 'christmas-island', 'cy': 'cyprus',
        'cz': 'czech-republic', 'de': 'germany', 'dj': 'djibouti', 'dk': 'denmark', 'dm': 'dominica',
        'do': 'dominican-republic', 'dz': 'algeria', 'ec': 'ecuador', 'ee': 'estonia', 'eg': 'egypt',
        'eh': 'western-sahara', 'er': 'eritrea', 'es': 'spain', 'et': 'ethiopia', 'fi': 'finland',
        'fj': 'fiji', 'fk': 'falkland-islands', 'fm': 'micronesia', 'fo': 'faroe-islands',
        'fr': 'france', 'ga': 'gabon', 'gb': 'united-kingdom', 'gd': 'grenada', 'ge': 'georgia',
        'gf': 'french-guiana', 'gg': 'guernsey', 'gh': 'ghana', 'gi': 'gibraltar', 'gl': 'greenland',
        'gm': 'gambia', 'gn': 'guinea', 'gp': 'guadeloupe', 'gq': 'equatorial-guinea', 'gr': 'greece',
        'gs': 'south-georgia-and-south-sandwich-islands', 'gt': 'guatemala', 'gu': 'guam', 'gw': 'guinea-bissau',
        'gy': 'guyana', 'hk': 'hong-kong', 'hm': 'heard-island-and-mcdonald-islands', 'hn': 'honduras',
        'hr': 'croatia', 'ht': 'haiti', 'hu': 'hungary', 'id': 'indonesia', 'ie': 'ireland',
        'il': 'israel', 'im': 'isle-of-man', 'in': 'india', 'io': 'british-indian-ocean-territory',
        'iq': 'iraq', 'ir': 'iran', 'is': 'iceland', 'it': 'italy', 'je': 'jersey', 'jm': 'jamaica',
        'jo': 'jordan', 'jp': 'japan', 'ke': 'kenya', 'kg': 'kyrgyzstan', 'kh': 'cambodia',
        'ki': 'kiribati', 'km': 'comoros', 'kn': 'saint-kitts-and-nevis', 'kp': 'north-korea',
        'kr': 'south-korea', 'kw': 'kuwait', 'ky': 'cayman-islands', 'kz': 'kazakhstan', 'la': 'laos',
        'lb': 'lebanon', 'lc': 'saint-lucia', 'li': 'liechtenstein', 'lk': 'sri-lanka', 'lr': 'liberia',
        'ls': 'lesotho', 'lt': 'lithuania', 'lu': 'luxembourg', 'lv': 'latvia', 'ly': 'libya',
        'ma': 'morocco', 'mc': 'monaco', 'md': 'moldova', 'me': 'montenegro', 'mf': 'saint-martin',
        'mg': 'madagascar', 'mh': 'marshall-islands', 'mk': 'north-macedonia', 'ml': 'mali', 'mm': 'myanmar',
        'mn': 'mongolia', 'mo': 'macau', 'mp': 'northern-mariana-islands', 'mq': 'martinique',
        'mr': 'mauritania', 'ms': 'montserrat', 'mt': 'malta', 'mu': 'mauritius', 'mv': 'maldives',
        'mw': 'malawi', 'mx': 'mexico', 'my': 'malaysia', 'mz': 'mozambique', 'na': 'namibia',
        'nc': 'new-caledonia', 'ne': 'niger', 'nf': 'norfolk-island', 'ng': 'nigeria', 'ni': 'nicaragua',
        'nl': 'netherlands', 'no': 'norway', 'np': 'nepal', 'nr': 'nauru', 'nu': 'niue', 'nz': 'new-zealand',
        'om': 'oman', 'pa': 'panama', 'pe': 'peru', 'pf': 'french-polynesia', 'pg': 'papua-new-guinea',
        'ph': 'philippines', 'pk': 'pakistan', 'pl': 'poland', 'pm': 'saint-pierre-and-miquelon',
        'pn': 'pitcairn-islands', 'pr': 'puerto-rico', 'ps': 'palestine', 'pt': 'portugal', 'pw': 'palau',
        'py': 'paraguay', 'qa': 'qatar', 're': 'reunion', 'ro': 'romania', 'rs': 'serbia', 'ru': 'russia',
        'rw': 'rwanda', 'sa': 'saudi-arabia', 'sb': 'solomon-islands', 'sc': 'seychelles', 'sd': 'sudan',
        'se': 'sweden', 'sg': 'singapore', 'sh': 'saint-helena', 'si': 'slovenia', 'sj': 'svalbard-and-jan-mayen',
        'sk': 'slovakia', 'sl': 'sierra-leone', 'sm': 'san-marino', 'sn': 'senegal', 'so': 'somalia',
        'sr': 'suriname', 'ss': 'south-sudan', 'st': 'sao-tome-and-principe', 'sv': 'el-salvador',
        'sx': 'sint-maarten', 'sy': 'syria', 'sz': 'eswatini', 'tc': 'turks-and-caicos-islands',
        'td': 'chad', 'tf': 'french-southern-and-antarctic-lands', 'tg': 'togo', 'th': 'thailand',
        'tj': 'tajikistan', 'tk': 'tokelau', 'tl': 'east-timor', 'tm': 'turkmenistan', 'tn': 'tunisia',
        'to': 'tonga', 'tr': 'turkey', 'tt': 'trinidad-and-tobago', 'tv': 'tuvalu', 'tw': 'taiwan',
        'tz': 'tanzania', 'ua': 'ukraine', 'ug': 'uganda', 'um': 'united-states-minor-outlying-islands',
        'us': 'united-states', 'uy': 'uruguay', 'uz': 'uzbekistan', 'va': 'vatican-city', 'vc': 'saint-vincent-and-the-grenadines',
        've': 'venezuela', 'vg': 'british-virgin-islands', 'vi': 'united-states-virgin-islands', 'vn': 'vietnam',
        'vu': 'vanuatu', 'wf': 'wallis-and-futuna', 'ws': 'samoa', 'ye': 'yemen', 'yt': 'mayotte',
        'za': 'south-africa', 'zm': 'zambia', 'zw': 'zimbabwe'
    };

    /**
     * Configuration constants
     */
    const CONFIG = {
        BUTTON_ID: 'plonkit-button',
        POLLING_INTERVAL: 1500,
        PLONKIT_BASE_URL: 'https://plonkit.net',
        FLAG_CDN_URL: 'https://flagcdn.com/24x18'
    };

    /**
     * CSS selectors for DOM elements
     */
    const SELECTORS = {
        RESULT_LAYOUT: '[class*="result-layout_root"]',
        PLAY_AGAIN_BUTTON: 'button[data-qa="play-again-button"]',
        GAME_FINISHED: 'div[class*="game-finished_root"]',
        GAME_SUMMARY: 'div[class*="game-summary_root"]'
    };

    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================

    /**
     * Set to track processed rounds to prevent duplicate button creation
     */
    const processedRounds = new Set();

    /**
     * Track the last URL to detect navigation changes
     */
    let lastUrl = location.href;

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    /**
     * Generates a flag image URL for the given country code
     * @param {string} countryCode - Two-letter ISO country code
     * @returns {string|null} Flag image URL or null if invalid code
     */
    function getFlagImageUrl(countryCode) {
        if (!countryCode || countryCode.length !== 2) {
            return null;
        }
        return `${CONFIG.FLAG_CDN_URL}/${countryCode.toLowerCase()}.png`;
    }

    /**
     * Checks if the current page is in game or challenge mode
     * @returns {boolean} True if in game/challenge mode
     */
    function isGameMode() {
        return /\/(game|challenge)\//.test(location.pathname);
    }

    /**
     * Extracts country code from game round data
     * @param {Object} roundData - Round data from API response
     * @returns {string|null} Country code or null if not found
     */
    function extractCountryCode(roundData) {
        if (!roundData) return null;

        const code = (
            roundData.streakLocationCode ||
            roundData.locationCode ||
            roundData.countryCode ||
            roundData.country
        )?.toLowerCase();

        return code;
    }

    /**
     * Generates PlonkIt URL for a given country code
     * @param {string} countryCode - Two-letter ISO country code
     * @returns {string|null} PlonkIt URL or null if country not supported
     */
    function getPlonkItUrl(countryCode) {
        const slug = COUNTRY_DICT[countryCode.toLowerCase()];
        return slug ? `${CONFIG.PLONKIT_BASE_URL}/${slug}` : null;
    }

    // ============================================================================
    // BUTTON MANAGEMENT
    // ============================================================================

    /**
     * Creates and displays the PlonkIt button with country flag
     * @param {string} url - PlonkIt URL to open
     * @param {string} countryCode - Two-letter ISO country code
     */
    function createPlonkItButton(url, countryCode) {
        removeButton();

        const button = document.createElement('button');
        button.id = CONFIG.BUTTON_ID;

        const flagImageUrl = getFlagImageUrl(countryCode);
        console.log('Creating PlonkIt button for country:', countryCode, 'with flag URL:', flagImageUrl);

        // Set button content with flag image or fallback emoji
        if (flagImageUrl) {
            button.innerHTML = `
                <img src="${flagImageUrl}"
                     alt="${countryCode.toUpperCase()} flag"
                     style="width: 20px; height: 15px; margin-right: 8px; border-radius: 2px; object-fit: cover;"
                     onerror="this.style.display='none'">
                <span>PlonkIt</span>
            `;
        } else {
            button.innerHTML = '<span>🌍 PlonkIt</span>';
        }

        button.classList.add('plonkit-btn');
        button.onclick = () => window.open(url, '_blank');

        // Apply styles
        applyButtonStyles(button);

        document.body.appendChild(button);
    }

    /**
     * Applies CSS styles to the PlonkIt button
     * @param {HTMLElement} button - Button element to style
     */
    function applyButtonStyles(button) {
        // Inject CSS styles if not already present
        if (!document.getElementById('plonkit-styles')) {
            const style = document.createElement('style');
            style.id = 'plonkit-styles';
            style.textContent = `
                .plonkit-btn {
                    position: relative;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .plonkit-btn img {
                    flex-shrink: 0;
                    vertical-align: middle;
                }

                .plonkit-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 10px rgba(0, 255, 123, 0.4);
                }

                .plonkit-btn::after {
                    position: absolute;
                    bottom: 120%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #333;
                    color: white;
                    padding: 6px 10px;
                    border-radius: 4px;
                    white-space: nowrap;
                    font-size: 12px;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                    z-index: 9999;
                }

                .plonkit-btn:hover::after {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }

        // Apply inline styles
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        `;

        // Add hover effects
        button.onmouseover = () => button.style.transform = 'scale(1.05)';
        button.onmouseout = () => button.style.transform = 'scale(1)';
    }

    /**
     * Removes the PlonkIt button from the page
     */
    function removeButton() {
        const button = document.getElementById(CONFIG.BUTTON_ID);
        if (button) {
            button.remove();
        }
    }

    // ============================================================================
    // GAME DATA HANDLING
    // ============================================================================

    /**
     * Fetches game data from GeoGuessr API and creates button if appropriate
     */
    async function fetchGameData() {
        if (!isGameMode()) return;

        try {
            const token = location.pathname.split('/').pop().split('?')[0];
            const isChallenge = location.pathname.includes('/challenge/');
            const apiUrl = isChallenge
            ? `https://www.geoguessr.com/api/v3/challenges/${token}/game`
                : `https://www.geoguessr.com/api/v3/games/${token}`;

            const response = await fetch(apiUrl);
            if (!response.ok) return;

            const data = await response.json();
            const round = data.player?.guesses?.length || 0;
            const roundData = data.rounds?.[round - 1];

            if (!roundData) return;

            const countryCode = extractCountryCode(roundData);
            if (!countryCode) return;

            // Check if this round has already been processed
            const gameId = data.token || token;
            const roundKey = `${gameId}-${round}`;
            if (processedRounds.has(roundKey)) return;

            // Create button if country is supported
            const plonkItUrl = getPlonkItUrl(countryCode);
            if (plonkItUrl) {
                createPlonkItButton(plonkItUrl, countryCode);
                processedRounds.add(roundKey);
            }

        } catch (error) {
            console.error('Error fetching GeoGuessr game data:', error);
        }
    }

    // ============================================================================
    // EVENT HANDLING AND INITIALIZATION
    // ============================================================================

    /**
     * Handles URL changes and page state updates
     */
    function handlePageUpdate() {
        if (!isGameMode()) {
            removeButton();
            return;
        }

        // Handle URL changes
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            processedRounds.clear();
            removeButton();
        }

        // Remove button if result overlay disappears (new round or screen change)
        const resultElement = document.querySelector(SELECTORS.RESULT_LAYOUT);
        if (!resultElement) {
            removeButton();
        }

        // Remove button on final screen after all rounds completed
        const finalScreenSelectors = [
            SELECTORS.PLAY_AGAIN_BUTTON,
            SELECTORS.GAME_FINISHED,
            SELECTORS.GAME_SUMMARY
        ];

        const finalSummary = finalScreenSelectors.some(selector =>
                                                       document.querySelector(selector)
                                                      );

        if (finalSummary) {
            removeButton();
            return;
        }

        // Fetch game data and potentially create button
        fetchGameData();
    }

    /**
     * Initialize the script
     */
    function initialize() {
        console.log('✅ GeoGuessr PlonkIt Button script loaded');

        // Set up DOM mutation observer
        const observer = new MutationObserver(handlePageUpdate);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Set up fallback polling mechanism
        setInterval(handlePageUpdate, CONFIG.POLLING_INTERVAL);
    }

    // ============================================================================
    // SCRIPT EXECUTION
    // ============================================================================

    // Initialize the script when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();