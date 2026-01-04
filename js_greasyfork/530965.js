// ==UserScript==
// @name         Shikimori Anime Ratings Display
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Отображает рейтинг аниме на Shikimori
// @author       MidTano
// @match        https://shikimori.one/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530965/Shikimori%20Anime%20Ratings%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/530965/Shikimori%20Anime%20Ratings%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const USER_SETTINGS = {
        RATING_BAR_HEIGHT: 20,
        REQUEST_DELAY: 150,
        BATCH_PROCESSING_DELAY: 2000,
        MAX_RETRY_ATTEMPTS: 3,
        NO_RATING_TEXT: '★ Н/Д',
        RATE_LIMIT_WAIT_TIME: 45000,
        FETCH_TIMEOUT: 5000,
        CACHE_EXPIRATION_DAYS: 15,
        CHECK_INTERVAL: 1000
    };

    const CACHE_KEY = 'shikimori_ratings_cache';

    const loadedRatings = new Set();
    const loadingEntries = new Set();
    const retryAttempts = new Map();
    const failedEntries = new Set();
    let loadQueue = [];
    let isProcessingQueue = false;
    let isWaitingAfter429 = false;
    let pageLoadingInProgress = false;

    const style = document.createElement('style');
    style.textContent = `
        .inline-anime-rating-bar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: ${USER_SETTINGS.RATING_BAR_HEIGHT}px;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
            z-index: 4;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.5);
        }

        .inline-anime-rating {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: ${USER_SETTINGS.RATING_BAR_HEIGHT}px;
            color: white;
            font-weight: bold;
            font-size: 14px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
            z-index: 5;
        }

        .inline-anime-rating.high {
            color: #8AFF8A;
        }

        .inline-anime-rating.medium {
            color: #FFFF8A;
        }

        .inline-anime-rating.low {
            color: #FF8A8A;
        }

        .inline-anime-rating.failed {
            color: #CCCCCC;
        }

        .inline-anime-rating.waiting {
            color: #FFA07A;
        }

        .inline-anime-rating-loading:after {
            content: "...";
            animation: loadingDots 1.5s infinite;
        }

        @keyframes loadingDots {
            0% { content: "."; }
            33% { content: ".."; }
            66% { content: "..."; }
        }
    `;
    document.head.appendChild(style);

    function getCachedRating(animeId) {
        try {
            const cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
            if (cache[animeId]) {
                const cacheTime = new Date(cache[animeId].timestamp);
                const now = new Date();
                const diffDays = (now - cacheTime) / (1000 * 60 * 60 * 24);

                if (diffDays < USER_SETTINGS.CACHE_EXPIRATION_DAYS) {
                    return cache[animeId].rating;
                }
            }
        } catch (e) {}
        return null;
    }

    function saveCachedRating(animeId, rating) {
        try {
            const cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
            cache[animeId] = {
                rating: rating,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (e) {}
    }

    function cleanupExpiredCache() {
        try {
            const cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
            const now = new Date();
            let hasChanges = false;

            for (const animeId in cache) {
                const cacheTime = new Date(cache[animeId].timestamp);
                const diffDays = (now - cacheTime) / (1000 * 60 * 60 * 24);

                if (diffDays >= USER_SETTINGS.CACHE_EXPIRATION_DAYS) {
                    delete cache[animeId];
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            }
        } catch (e) {}
    }

    function getRatingClass(score) {
        const numScore = parseFloat(score);
        if (isNaN(numScore)) return '';
        if (numScore >= 7.5) return 'high';
        if (numScore >= 6) return 'medium';
        return 'low';
    }

    function handleRateLimitError() {
        if (isWaitingAfter429) {
            return;
        }

        isWaitingAfter429 = true;

        const loadingElements = document.querySelectorAll('.inline-anime-rating-loading');
        loadingElements.forEach(el => {
            el.textContent = 'Ожидание';
            el.classList.add('waiting');
        });

        setTimeout(() => {
            isWaitingAfter429 = false;

            const waitingElements = document.querySelectorAll('.inline-anime-rating.waiting');
            waitingElements.forEach(el => {
                el.textContent = 'Загрузка';
                el.classList.remove('waiting');
            });

            if (!isProcessingQueue && !pageLoadingInProgress) {
                setTimeout(processLoadQueue, 1000);
            }
        }, USER_SETTINGS.RATE_LIMIT_WAIT_TIME);
    }

    function resetPageState() {
        loadedRatings.clear();
        loadingEntries.clear();
        failedEntries.clear();
        retryAttempts.clear();
        loadQueue = [];
        isProcessingQueue = false;
    }

    function addRatingToDOM(animeEntry, rating, isLoading = false, isFailed = false, isWaiting = false, isCached = false) {
        const animeId = animeEntry.id;

        if (!isLoading && !isFailed && !isWaiting) {
            const hasRatingInDOM = animeEntry.querySelector('.inline-anime-rating:not(.inline-anime-rating-loading):not(.waiting)');

            if (hasRatingInDOM && (loadedRatings.has(animeId) || failedEntries.has(animeId))) {
                return false;
            }
        }

        const imageContainer = animeEntry.querySelector('.image-decor');
        if (!imageContainer) {
            return false;
        }

        imageContainer.style.position = 'relative';

        let ratingBar = imageContainer.querySelector('.inline-anime-rating-bar');
        if (!ratingBar) {
            ratingBar = document.createElement('div');
            ratingBar.className = 'inline-anime-rating-bar';
            imageContainer.appendChild(ratingBar);
        }

        let ratingDisplay = imageContainer.querySelector('.inline-anime-rating');

        if (!ratingDisplay) {
            ratingDisplay = document.createElement('div');
            ratingDisplay.className = 'inline-anime-rating';
            imageContainer.appendChild(ratingDisplay);
        } else {
            ratingDisplay.className = 'inline-anime-rating';
        }

        if (isWaiting) {
            ratingDisplay.textContent = 'Ожидание';
            ratingDisplay.classList.add('waiting');
        } else if (isLoading) {
            ratingDisplay.textContent = 'Загрузка';
            ratingDisplay.classList.add('inline-anime-rating-loading');
        } else if (isFailed) {
            ratingDisplay.textContent = USER_SETTINGS.NO_RATING_TEXT;
            ratingDisplay.classList.add('failed');
            failedEntries.add(animeId);
            loadingEntries.delete(animeId);
        } else {
            ratingDisplay.textContent = '★ ' + rating;
            ratingDisplay.classList.remove('inline-anime-rating-loading');
            const ratingClass = getRatingClass(rating);
            if (ratingClass) ratingDisplay.classList.add(ratingClass);
            loadedRatings.add(animeId);
            loadingEntries.delete(animeId);

            if (!isCached) {
                saveCachedRating(animeId, rating);
            }
        }

        return true;
    }

    function extractRatingsFromTooltips() {
        if (isWaitingAfter429 || pageLoadingInProgress) {
            return;
        }

        const tooltips = document.querySelectorAll('.tooltip');

        tooltips.forEach(tooltip => {
            const ratingElement = tooltip.querySelector('.rating span');
            if (!ratingElement) return;

            const rating = ratingElement.textContent.trim();
            if (!rating) return;

            const animeLink = tooltip.querySelector('a.name');
            if (!animeLink) return;

            const animeUrl = animeLink.getAttribute('href');
            if (!animeUrl) return;

            const animeIdMatch = animeUrl.match(/\/animes\/(\d+)-/);
            if (!animeIdMatch || !animeIdMatch[1]) return;

            const animeId = animeIdMatch[1];

            const animeEntry = document.getElementById(animeId);
            if (!animeEntry) return;

            if (!loadedRatings.has(animeId) && !failedEntries.has(animeId)) {
                addRatingToDOM(animeEntry, rating);
            }
        });
    }

    async function loadRatingFromTooltip(entry) {
        const animeId = entry.id;

        if (loadedRatings.has(animeId) || failedEntries.has(animeId) || pageLoadingInProgress) {
            return true;
        }

        const cachedRating = getCachedRating(animeId);
        if (cachedRating) {
            addRatingToDOM(entry, cachedRating, false, false, false, true);
            return true;
        }

        loadingEntries.add(animeId);

        const coverElement = entry.querySelector('.cover');
        if (!coverElement || !coverElement.getAttribute('data-tooltip_url')) {
            loadingEntries.delete(animeId);

            const attempts = (retryAttempts.get(animeId) || 0) + 1;
            retryAttempts.set(animeId, attempts);

            if (attempts >= USER_SETTINGS.MAX_RETRY_ATTEMPTS) {
                addRatingToDOM(entry, '', false, true);
                return true;
            }

            return false;
        }

        const tooltipUrl = coverElement.getAttribute('data-tooltip_url');

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), USER_SETTINGS.FETCH_TIMEOUT);

            const response = await fetch(tooltipUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.status === 429) {
                handleRateLimitError();
                return false;
            }

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const html = await response.text();

            if (!html || html.trim() === '') {
                throw new Error('Empty response');
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const ratingElement = doc.querySelector('.rating span');

            if (ratingElement && ratingElement.textContent.trim()) {
                addRatingToDOM(entry, ratingElement.textContent.trim());
                return true;
            } else {
                throw new Error('Rating not found in response');
            }
        } catch (e) {
            loadingEntries.delete(animeId);

            const attempts = (retryAttempts.get(animeId) || 0) + 1;
            retryAttempts.set(animeId, attempts);

            if (attempts >= USER_SETTINGS.MAX_RETRY_ATTEMPTS) {
                addRatingToDOM(entry, '', false, true);
                return true;
            }

            return false;
        }
    }

    async function processLoadQueue() {
        if (isProcessingQueue || loadQueue.length === 0 || isWaitingAfter429 || pageLoadingInProgress) {
            return;
        }

        isProcessingQueue = true;

        const entry = loadQueue.shift();

        if (!entry.id || loadedRatings.has(entry.id) || failedEntries.has(entry.id)) {
            isProcessingQueue = false;
            setTimeout(processLoadQueue, 10);
            return;
        }

        const success = await loadRatingFromTooltip(entry);

        if (isWaitingAfter429) {
            loadQueue.unshift(entry);
            isProcessingQueue = false;
            return;
        }

        if (!success && !failedEntries.has(entry.id)) {
            loadQueue.push(entry);
        }

        setTimeout(() => {
            isProcessingQueue = false;
            if (!pageLoadingInProgress) {
                processLoadQueue();
            }
        }, USER_SETTINGS.REQUEST_DELAY);
    }

    function updateLoadingStatus(isWaiting) {
        document.querySelectorAll('.b-catalog_entry.c-anime').forEach(entry => {
            const animeId = entry.id;

            if (!animeId || loadedRatings.has(animeId) || failedEntries.has(animeId)) {
                return;
            }

            const ratingElement = entry.querySelector('.inline-anime-rating');
            if (ratingElement && ratingElement.classList.contains('inline-anime-rating-loading')) {
                if (isWaiting) {
                    addRatingToDOM(entry, '', false, false, true);
                } else {
                    addRatingToDOM(entry, '', true);
                }
            }
        });
    }

    function markAllAnimeAsLoading() {
        if (isWaitingAfter429 || pageLoadingInProgress) {
            return;
        }

        const animeEntries = document.querySelectorAll('.b-catalog_entry.c-anime');

        animeEntries.forEach(entry => {
            if (!entry.id || loadedRatings.has(entry.id) || failedEntries.has(entry.id) ||
                entry.querySelector('.inline-anime-rating-loading') ||
                entry.querySelector('.inline-anime-rating.waiting')) {
                return;
            }

            const cachedRating = getCachedRating(entry.id);
            if (cachedRating) {
                addRatingToDOM(entry, cachedRating, false, false, false, true);
            } else {
                addRatingToDOM(entry, '', true);
            }
        });
    }

    function queueAllAnimeEntries() {
        if (pageLoadingInProgress) {
            return;
        }

        const animeEntries = Array.from(document.querySelectorAll('.b-catalog_entry.c-anime'))
        .filter(entry => entry.id && !loadedRatings.has(entry.id) && !failedEntries.has(entry.id));

        animeEntries.forEach(entry => {
            const animeId = entry.id;
            const cachedRating = getCachedRating(animeId);

            if (cachedRating) {
                addRatingToDOM(entry, cachedRating, false, false, false, true);
            }
        });

        if (isWaitingAfter429) {
            updateLoadingStatus(true);
        } else {
            markAllAnimeAsLoading();
        }

        const queueIds = loadQueue.map(entry => entry.id);
        const newEntries = animeEntries.filter(entry =>
                                               !queueIds.includes(entry.id) &&
                                               !loadedRatings.has(entry.id) &&
                                               !getCachedRating(entry.id));

        if (newEntries.length > 0) {
            loadQueue = loadQueue.concat(newEntries);

            if (!isProcessingQueue && !isWaitingAfter429 && !pageLoadingInProgress) {
                processLoadQueue();
            }
        }
    }

    function processNewAnimeEntries() {
        if (pageLoadingInProgress) {
            return;
        }

        if (isWaitingAfter429) {
            updateLoadingStatus(true);
        } else {
            markAllAnimeAsLoading();
        }

        queueAllAnimeEntries();
    }

    function checkAllAnimeRatings() {
        const animeElements = document.querySelectorAll('.b-catalog_entry.c-anime');

        animeElements.forEach(animeElement => {
            const animeId = animeElement.id;
            if (!animeId) return;

            const ratingDisplay = animeElement.querySelector('.inline-anime-rating');
            const ratingBar = animeElement.querySelector('.inline-anime-rating-bar');

            if (!ratingDisplay || !ratingBar ||
                (ratingDisplay && (ratingDisplay.classList.contains('inline-anime-rating-loading') ||
                                   ratingDisplay.classList.contains('waiting')))) {

                if (!ratingDisplay || !ratingBar) {
                    const imageDecor = animeElement.querySelector('.image-decor');
                    if (imageDecor) {
                        if (ratingDisplay) ratingDisplay.remove();
                        if (ratingBar) ratingBar.remove();

                        const cachedRating = getCachedRating(animeId);
                        if (cachedRating) {
                            addRatingToDOM(animeElement, cachedRating, false, false, false, true);
                        } else if (!loadingEntries.has(animeId) && !failedEntries.has(animeId)) {
                            addRatingToDOM(animeElement, '', true);
                            if (!loadQueue.find(entry => entry.id === animeId)) {
                                loadQueue.push(animeElement);
                            }
                        }
                    }
                }
            }
        });

        if (!isProcessingQueue && !isWaitingAfter429 && loadQueue.length > 0) {
            processLoadQueue();
        }
    }

    function detectPageNavigation() {
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('loadstart', function() {
                const url = this._url || arguments[1];
                if (url && (url.includes('/page/') || url.includes('.json'))) {
                    pageLoadingInProgress = true;
                }
            });

            this.addEventListener('loadend', function() {
                setTimeout(() => {
                    pageLoadingInProgress = false;
                    checkAllAnimeRatings();
                }, 500);
            });

            this._url = arguments[1];
            return origOpen.apply(this, arguments);
        };

        document.addEventListener('click', (e) => {
            const paginationLink = e.target.closest('.pagination a');
            if (paginationLink) {
                resetPageState();
                setTimeout(() => {
                    checkAllAnimeRatings();
                }, 1000);
            }
        });
    }

    window.addEventListener('popstate', (e) => {
        resetPageState();
        setTimeout(() => {
            pageLoadingInProgress = false;
            checkAllAnimeRatings();
        }, 500);
    });

    window.addEventListener('hashchange', (e) => {
        resetPageState();
        setTimeout(() => {
            pageLoadingInProgress = false;
            checkAllAnimeRatings();
        }, 500);
    });

    let lastUrl = location.href;

    const urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            resetPageState();
            setTimeout(() => {
                checkAllAnimeRatings();
            }, 500);
        }
    });

    const domReadyCheck = () => {
        urlObserver.observe(document, {subtree: true, childList: true});

        setInterval(() => {
            if (!pageLoadingInProgress && !isWaitingAfter429) {
                checkAllAnimeRatings();
            }
        }, USER_SETTINGS.CHECK_INTERVAL);
    };

    function forceRestoreRatings() {
        loadingEntries.clear();
        failedEntries.clear();

        const animeElements = document.querySelectorAll('.b-catalog_entry.c-anime');

        animeElements.forEach(animeElement => {
            const animeId = animeElement.id;
            if (!animeId) return;

            const imageDecor = animeElement.querySelector('.image-decor');
            if (imageDecor) {
                const existingBar = imageDecor.querySelector('.inline-anime-rating-bar');
                const existingRating = imageDecor.querySelector('.inline-anime-rating');

                if (existingBar) existingBar.remove();
                if (existingRating) existingRating.remove();

                const cachedRating = getCachedRating(animeId);
                if (cachedRating) {
                    addRatingToDOM(animeElement, cachedRating, false, false, false, true);
                } else {
                    addRatingToDOM(animeElement, '', true);

                    if (!loadQueue.find(entry => entry.id === animeId)) {
                        loadQueue.push(animeElement);
                    }
                }
            }
        });

        if (!isProcessingQueue && !isWaitingAfter429 && loadQueue.length > 0) {
            processLoadQueue();
        }
    }

    setInterval(() => {
        if (!pageLoadingInProgress && !isWaitingAfter429) {
            const anyRatingExists = document.querySelector('.inline-anime-rating');
            const animeExists = document.querySelector('.b-catalog_entry.c-anime');

            if (animeExists && !anyRatingExists) {
                forceRestoreRatings();
            }
        }
    }, 2000);

    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        resetPageState();
        setTimeout(() => {
            checkAllAnimeRatings();
        }, 500);
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        resetPageState();
        setTimeout(() => {
            checkAllAnimeRatings();
        }, 500);
    };

    function initialize() {
        cleanupExpiredCache();

        extractRatingsFromTooltips();
        markAllAnimeAsLoading();
        queueAllAnimeEntries();

        setTimeout(() => {
            checkAllAnimeRatings();
        }, 500);

        domReadyCheck();
    }

    detectPageNavigation();

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initialize, 200);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initialize, 200);
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            checkAllAnimeRatings();
        }, 500);
    });

    const BATCH_SIZE = 10;
    function processInBatches() {
        if (pageLoadingInProgress) return;

        const batch = Array.from(document.querySelectorAll('.b-catalog_entry.c-anime:not(.ratings-processed)'));
        let count = 0;

        batch.forEach(entry => {
            if (count < BATCH_SIZE && !loadedRatings.has(entry.id) && !failedEntries.has(entry.id)) {
                entry.classList.add('ratings-processed');

                const cachedRating = getCachedRating(entry.id);
                if (cachedRating) {
                    addRatingToDOM(entry, cachedRating, false, false, false, true);
                } else {
                    addRatingToDOM(entry, '', true);
                }

                count++;
            }
        });

        if (count > 0 && !isProcessingQueue && !isWaitingAfter429) {
            processNewAnimeEntries();
        }
    }

    setInterval(processInBatches, USER_SETTINGS.BATCH_PROCESSING_DELAY);
})();