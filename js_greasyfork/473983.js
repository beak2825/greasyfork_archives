// ==UserScript==
// @name         Cubox助手
// @author       岚浅浅
// @description  在Cubox左上角添加一个随机漫游的按钮（也可使用Ctrl+R触发）
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @include      *cubox.pro/*
// @exclude      *image.cubox.pro/*
// @grant        GM_addStyle
// @license      GPL-3.0 License
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/473983/Cubox%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473983/Cubox%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

$(function () {
    'use strict';

    const HOST = location.hostname;
    const API_ENDPOINTS = {
        INBOX: `https://${HOST}/c/api/v2/search_engine/inbox`,
        MY: `https://${HOST}/c/api/v2/search_engine/my`
    };

    const MAX_VISITED_CARDS = 1000;
    const PAGE_CACHE_DURATION = 60 * 1000; // 1分钟
    const RETRY_COUNT = 10;

    const REQUEST_INTERVAL = 100;
    const REQUEST_TIMEOUT = 10000;

    const POPUP_DURATION = 3000;
    const FADE_DURATION = 300;

    class CacheManager {
        constructor() {
            this.initialize();
        }

        initialize() {
            this.token = this.loadToken();
            this.pageCache = this.loadPageCache();
            this.visitedCards = this.loadVisitedCards();
        }

        loadToken() {
            return localStorage.getItem('token');
        }

        loadApiSearchUrl() {
            const apiSearchUrl = localStorage.getItem('cuboxAssistant_apiSearchUrl');
            if (!apiSearchUrl) {
                console.log(location.href);
                throw new Error('URL信息缺失');
            }
            return apiSearchUrl;
        }

        loadPageCache() {
            const storedCacheJson = localStorage.getItem('cuboxAssistant_pageCache');
            if (!storedCacheJson) return {};

            const storedCache = JSON.parse(storedCacheJson);
            const now = Date.now();

            // 清理过期缓存
            const validCache = Object.fromEntries(
                Object.entries(storedCache).filter(([, value]) =>
                    now <= value.expirationTime
                )
            );

            if (Object.keys(validCache).length !== Object.keys(storedCache).length) {
                this.setPageCache(validCache);
            }

            return validCache;
        }

        loadVisitedCards() {
            const ids = localStorage.getItem('cuboxAssistant_visitedCards');
            return ids ? ids.split(',') : [];
        }

        getToken() {
            return this.token;
        }

        getVisitedCards() {
            return this.visitedCards;
        }

        setApiSearchUrl(url) {
            localStorage.setItem('cuboxAssistant_apiSearchUrl', url);
        }

        setPageCache(cache = this.pageCache) {
            localStorage.setItem('cuboxAssistant_pageCache', JSON.stringify(cache));
        }

        setVisitedCards(cards = this.visitedCards) {
            if (cards.length > MAX_VISITED_CARDS) {
                cards.splice(0, cards.length - MAX_VISITED_CARDS);
            }
            localStorage.setItem('cuboxAssistant_visitedCards', cards.join(','));
        }

        cacheSinglePage(apiSearchUrl, pageCount, page, lastBookmarkId) {
            const key = `${Utils.hash(apiSearchUrl)}_${page}`;
            this.pageCache[key] = {
                lastBookmarkId,
                expirationTime: Date.now() + pageCount * PAGE_CACHE_DURATION
            };
            this.setPageCache();
        }

        markCardAsVisited(cardId) {
            this.visitedCards.push(cardId);
            this.setVisitedCards();
        }

        findLatestPage(apiSearchUrl, targetPage) {
            const hashPrefix = Utils.hash(apiSearchUrl);
            let bestJump = { page: 1, lastBookmarkId: '' };

            Object.entries(this.pageCache).forEach(([key, value]) => {
                if (key.startsWith(hashPrefix)) {
                    const page = parseInt(key.split('_')[1]);
                    if (page < targetPage && page > bestJump.page) {
                        bestJump = { page, lastBookmarkId: value.lastBookmarkId };
                    }
                }
            });

            return bestJump;
        }

        clear() {
            this.setPageCache({});
            this.setVisitedCards([]);
            this.initialize();
        }
    }

    class CuboxAssistant {
        constructor() {
            StyleManager.initialize();
            this.bindEvents();
            this.initialize();
        }

        bindEvents() {
            const handleRandom = (e) => {
                e.preventDefault();
                this.startRandomNavigation();
            };

            $(document).on('click', '#cubox-start-btn', handleRandom);

            document.addEventListener('keydown', (event) => {
                if (event.ctrlKey && event.key === 'r') handleRandom(event);
            });

            // URL变化监听
            new MutationObserver(() => this.initialize())
                .observe(document, { subtree: true, childList: true });
        }

        async initialize() {
            if (this.currentUrl === location.href) {
                return;
            }

            this.currentUrl = location.href;
            StyleManager.updatePosition(this.currentUrl);

            const currentApiSearchUrl = Utils.matchApiSearchUrl(this.currentUrl) || cacheManager.loadApiSearchUrl();
            if (currentApiSearchUrl && currentApiSearchUrl !== this.apiSearchUrl) {
                this.apiSearchUrl = currentApiSearchUrl;
                cacheManager.setApiSearchUrl(currentApiSearchUrl);
                await this.preloadPageCount();
                await this.preloadPageCache();
            }
        }

        async startRandomNavigation() {
            StyleManager.updateState(true);

            try {
                let isSuccess = false;
                for (let i = 0; i < RETRY_COUNT && !isSuccess; i++) {
                    const randomPage = Math.floor(Math.random() * this.pageCount) + 1;
                    const response = await this.requestPageWithCache(randomPage);
                    isSuccess = this.navigateToRandomCard(response.data);
                }

                if (!isSuccess) {
                    cacheManager.clear();
                    StyleManager.showPopup('缓存过多，已自动清理，请重试');
                }
            } catch (error) {
                console.log(error);
                StyleManager.showPopup(`操作失败: ${error.message}`);
            } finally {
                StyleManager.updateState(false);
            }
        }

        async preloadPageCount() {
            const response = await Utils.safeRequest(this.apiSearchUrl);
            this.pageCount = response.pageCount || 1;
            console.log(`[Cubox助手] 共${this.pageCount}页`);

            const lastBookmarkId = Utils.extractLastBookmarkId(response);
            cacheManager.cacheSinglePage(this.apiSearchUrl, this.pageCount, 1, lastBookmarkId);
        }

        async preloadPageCache() {
            const missingPages = [];
            const hashPrefix = Utils.hash(this.apiSearchUrl);

            for (let page = 2; page <= this.pageCount; page++) {
                if (!cacheManager.pageCache[`${hashPrefix}_${page}`]) {
                    missingPages.push(page);
                }
            }
            console.log(`[Cubox助手] ${missingPages.length}页需要预加载`);

            for (const page of missingPages) {
                await this.requestPageWithCache(page);
                await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL));
            }
        }

        async requestPageWithCache(targetPage) {
            if (targetPage === 1) {
                return await Utils.safeRequest(this.apiSearchUrl);
            }
            let { page, lastBookmarkId } = cacheManager.findLatestPage(this.apiSearchUrl, targetPage);
            let response;
            page++;
            while (page <= targetPage) {
                const url = `${this.apiSearchUrl.replace('page=1', `page=${page}`)}${lastBookmarkId ? `&lastBookmarkId=${lastBookmarkId}` : ''}`;
                response = await Utils.safeRequest(url);
                lastBookmarkId = Utils.extractLastBookmarkId(response);
                cacheManager.cacheSinglePage(this.apiSearchUrl, this.pageCount, page, lastBookmarkId);
                console.info(`[Cubox助手] 加载页面${page}成功`);
                page++;
            }
            return response;
        }

        navigateToRandomCard(cards) {
            const cardIds = cards.map(item => item.userSearchEngineID);
            const visitedIds = cacheManager.getVisitedCards();
            const unvisitedIds = cardIds.filter(id => !visitedIds.includes(id));

            if (unvisitedIds.length === 0) {
                return false;
            }

            const cardId = unvisitedIds[Math.floor(Math.random() * unvisitedIds.length)];
            cacheManager.markCardAsVisited(cardId);
            window.open(`https://${HOST}/my/card?id=${cardId}`, '_self');
            return true;
        }
    }

    class StyleManager {
        static initialize() {
            $('body').append(`
                <div id="cubox-assistant-toolbar">
                    <button id="cubox-start-btn" type="button">随机漫游</button>
                </div>
            `);
            GM_addStyle(`
                #cubox-assistant-toolbar {
                    position: fixed;
                    z-index: 999999;
                    width: 120px;
                    opacity: 0.8;
                    border: 1px solid #a38a54;
                    border-radius: 6px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
                    transition: all 0.3s ease;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                #cubox-assistant-toolbar:hover { opacity: 1; transform: translateY(-1px); }
                #cubox-start-btn {
                    display: block;
                    width: 100%;
                    padding: 8px 12px;
                    margin: 0;
                    border: none;
                    background: transparent;
                    color: #a38a54;
                    text-align: center;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }
                #cubox-start-btn:hover:not(:disabled) { background: rgba(163, 138, 84, 0.1); }
                #cubox-start-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .cubox-popup {
                    position: fixed;
                    top: 50px;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 20px 30px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    color: #333;
                    font-size: 16px;
                    border-radius: 8px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    z-index: 1000000;
                    max-width: 400px;
                    text-align: center;
                    animation: fadeInScale 0.3s ease;
                }
                @keyframes fadeInScale {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `);
        }

        static updatePosition(currentUrl) {
            const isCardPage = /.*cubox\.pro\/my\/card\?id=(\d+)/.test(currentUrl);
            const top = isCardPage ? 10 : 20;
            const left = isCardPage ? 120 : 180;

            GM_addStyle(`#cubox-assistant-toolbar { top: ${top}px; left: ${left}px; }`);
        }

        static updateState(isLoading) {
            $('#cubox-start-btn').text(isLoading ? '加载中...' : '随机漫游').prop('disabled', isLoading);
        }

        static showPopup(message) {
            $('.cubox-popup').remove();
            const popup = $(`<div class="cubox-popup">${$('<div>').text(message).html()}</div>`);
            $('body').append(popup);
            setTimeout(() => popup.fadeOut(FADE_DURATION, () => popup.remove()), POPUP_DURATION);
        }
    }

    class Utils {
        static matchApiSearchUrl(url) {
            const baseParams = 'asc=false&page=1&filters=&archiving=false';
            if (url.includes('cubox.pro/my/inbox')) {
                return `${API_ENDPOINTS.INBOX}?${baseParams}`;
            }
            if (url.includes('cubox.pro/my/all')) {
                return `${API_ENDPOINTS.MY}?${baseParams}`;
            }
            if (url.includes('cubox.pro/my/folder?id=')) {
                const folderId = url.match(/id=([^&]*)/)?.[1];
                if (folderId) {
                    return `${API_ENDPOINTS.MY}?${baseParams}&groupId=${folderId}`;
                }
            }
            if (url.includes('cubox.pro/my/tag?id=')) {
                const tagId = url.match(/id=([^&]*)/)?.[1];
                if (tagId) {
                    return `${API_ENDPOINTS.MY}?${baseParams}&tagId=${tagId}`;
                }
            }
        }

        static hash(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash = hash & hash;
            }
            return Math.abs(hash).toString(36);
        }

        static async safeRequest(url) {
            const response = await fetch(url, {
                headers: { 'Authorization': cacheManager.getToken() },
                signal: AbortSignal.timeout(REQUEST_TIMEOUT)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        }

        static extractLastBookmarkId(response) {
            return response.data?.at(-1)?.userSearchEngineID
                || (() => { throw new Error('响应数据为空') })();
        }
    }

    const cacheManager = new CacheManager();
    new CuboxAssistant();
});