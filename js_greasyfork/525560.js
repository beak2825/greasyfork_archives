// ==UserScript==
// @name         Backloggd - Steam Review Integration
// @namespace    https://greasyfork.org/en/users/1410951-nzar-bayezid
// @version      1.0
// @description  Displays Steam reviews in unified format
// @icon         https://www.backloggd.com/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://backloggd.com/*
// @match        https://www.backloggd.com/*
// @grant        GM_xmlhttpRequest
// @connect      store.steampowered.com
// @license      MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/525560/Backloggd%20-%20Steam%20Review%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/525560/Backloggd%20-%20Steam%20Review%20Integration.meta.js
// ==/UserScript==

/*=========================  Version History  ==================================
v1.0 -
- Integrated Steam review data into Backloggd game pages
- Unified UI styling for consistent appearance with existing integrations
- Added support for displaying both recent and all-time Steam reviews
- Implemented dynamic color coding based on review sentiment (e.g., Positive, Negative)
- Optimized API request handling for Steam app ID and review data fetching
- Ensured proper error handling and fallbacks for missing or unavailable data
- Enhanced performance by minimizing redundant DOM manipulations
- Added MutationObserver to dynamically handle page updates and new content loading
- Improved localization of review counts using `toLocaleString` for better readability
*/

(function() {
    'use strict';
    const OBSERVER_CONFIG = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };

    const REVIEW_COLORS = {
        'Overwhelmingly Positive': '#388E3C',
        'Very Positive': '#689F38',
        'Positive': '#AFB42B',
        'Mostly Positive': '#C0A128',
        'Mixed': '#FFA000',
        'Mostly Negative': '#F57C00',
        'Negative': '#E53935',
        'Very Negative': '#C62828',
        'Overwhelmingly Negative': '#B71C1C'
    };

    let processing = false;
    let currentPath = '';

    async function mainExecutor() {
        if (processing) return;
        if (location.pathname === currentPath) return;
        if (!document.querySelector('#game-body')) return;

        currentPath = location.pathname;
        processing = true;

        cleanExistingElements();
        await processGameData();
        processing = false;
    }

    function cleanExistingElements() {
        $('.steam-integration').remove();
    }

    async function processGameData() {
        try {
            const gameName = document.querySelector("#title h1").textContent;
            const appId = await fetchSteamAppId(gameName);
            if (!appId) return;

            const reviewData = await fetchSteamReviews(appId);
            renderSteamReview(reviewData, appId);
        } catch (error) {
            console.error('Steam Integration Error:', error);
        }
    }

    function fetchSteamAppId(gameName) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}&category1=998`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                },
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const firstResult = doc.querySelector('.search_result_row');
                    resolve(firstResult?.dataset.dsAppid || null);
                },
                onerror: () => resolve(null),
                timeout: 5000
            });
        });
    }

    function fetchSteamReviews(appId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://store.steampowered.com/app/${appId}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9'
                },
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const userReviews = doc.querySelector('#userReviews');

                        if (!userReviews) return resolve(null);

                        // Extract Recent Reviews
                        const recent = userReviews.querySelector('.user_reviews_summary_row:nth-child(1)');
                        const recentRating = recent?.querySelector('.game_review_summary')?.textContent;
                        const recentCount = extractNumber(recent?.querySelector('.responsive_hidden')?.textContent);

                        // Extract All Reviews
                        const all = userReviews.querySelector('.user_reviews_summary_row[itemprop="aggregateRating"]');
                        const allRating = all?.querySelector('.game_review_summary')?.textContent;
                        const allCount = extractNumber(all?.querySelector('.responsive_hidden')?.textContent);

                        resolve({
                            recent: { rating: recentRating, count: recentCount },
                            all: { rating: allRating, count: allCount }
                        });
                    } catch {
                        resolve(null);
                    }
                },
                onerror: () => resolve(null),
                timeout: 5000
            });
        });
    }

    function extractNumber(text) {
        const match = text?.match(/\(([\d,]+)\)/);
        return match ? parseInt(match[1].replace(/,/g, '')) : null;
    }

    function formatReviewCount(num) {
        if (!num) return 'N/A';
        return num.toLocaleString();
    }

    function renderSteamReview(reviewData, appId) {
        if (!reviewData || !reviewData.all?.rating) return;

        const target = $("#game-body > div.col > div:nth-child(2) > div.col-12.col-lg-cus-32.mt-1.mt-lg-2");
        if (!target.length) return;

        const color = REVIEW_COLORS[reviewData.all.rating] || '#607D8B';

        const content = [];

        if (reviewData.recent?.rating) {
            content.push(`
                <div style="margin-bottom: 6px; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                    <span style="opacity: 0.8;">Recent Reviews:<br>
                    ${reviewData.recent.rating}
                    (${formatReviewCount(reviewData.recent.count)})
                </div>
            `);
        }

        content.push(`
            <div style="font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                <span style="opacity: 0.8;">All Reviews:<br>
                ${reviewData.all.rating}
                (${formatReviewCount(reviewData.all.count)})
            </div>
        `);

        const element = $(`
            <div class="steam-integration" style="margin-top:10px;">
                <a href="https://store.steampowered.com/app/${appId}"
                   target="_blank"
                   style="display: block;
                          background: ${color};
                          color: white;
                          padding: 12px;
                          border-radius: 4px;
                          text-decoration: none;
                          transition: transform 0.2s;
                          border:1px solid #d1d1d1;
                          line-height: 1.4;">
                    ${content.join('')}
                </a>
            </div>
        `);

        target.append(element);
    }

    // Mutation observer setup
    new MutationObserver(mutations => {
        if (document.querySelector('#game-body') && mutations.some(m => m.addedNodes.length)) {
            mainExecutor();
        }
    }).observe(document.documentElement, OBSERVER_CONFIG);

    // Initial execution
    window.addEventListener('load', mainExecutor);
})();