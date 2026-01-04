// ==UserScript==
// @name         B站全场景优质视频标记(完整版+UP主主页)
// @namespace    http://tampermonkey.net/
// @version      4.6
// @license MIT
// @description  支持主页、搜索页、视频推荐和UP主主页的优质视频标记，新增顶级标签，已修复标签颜色和位置问题
// @author       Deepseek R1 & Claude3.5s & Claude3.7s
// @match        *://www.bilibili.com/*
// @match        *://search.bilibili.com/*
// @match        *://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      bilibili.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528024/B%E7%AB%99%E5%85%A8%E5%9C%BA%E6%99%AF%E4%BC%98%E8%B4%A8%E8%A7%86%E9%A2%91%E6%A0%87%E8%AE%B0%28%E5%AE%8C%E6%95%B4%E7%89%88%2BUP%E4%B8%BB%E4%B8%BB%E9%A1%B5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528024/B%E7%AB%99%E5%85%A8%E5%9C%BA%E6%99%AF%E4%BC%98%E8%B4%A8%E8%A7%86%E9%A2%91%E6%A0%87%E8%AE%B0%28%E5%AE%8C%E6%95%B4%E7%89%88%2BUP%E4%B8%BB%E4%B8%BB%E9%A1%B5%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        MIN_SCORE: 0.06,               // 精选的最低点赞/播放比例
        MIN_VIEWS: 1000,               // 精选的最低播放量
        TAG_COLOR: 'linear-gradient(135deg, #FF6B6B, #FF4D4D)', // 精选标签颜色
        TAG_TEXT: '🔥 精选',           // 精选标签文本
        TOP_TAG_COLOR: 'linear-gradient(135deg, #FFD700, #FFA500)', // 顶级标签颜色
        TOP_TAG_TEXT: '🏆 顶级',       // 顶级标签文本
        LOADING_ICON: '⏳',
        RETRY_LIMIT: 3,
        DEBOUNCE_TIME: 200,
        INIT_DELAY: 800,              // 初始化延迟
        CHECK_INTERVAL: 3000,         // 检查间隔
        SHOW_PERCENT: false           // 是否显示百分比
    };

    // Updated CSS: 修复UP主主页视频卡片标签位置
    GM_addStyle(`
        .bili-quality-tag {
            display: inline-flex !important;
            align-items: center;
            color: white !important;
            padding: 3px 10px !important;
            border-radius: 15px !important;
            margin-right: 10px !important;
            font-size: 12px !important;
            animation: badgeSlideIn 0.3s ease-out !important;
            position: relative;
            z-index: 2;
        }

        .video-page-card-small .bili-quality-tag,
        .bili-video-card__wrap .bili-quality-tag {
            position: absolute;
            left: 8px;
            top: 8px;
            transform: scale(0.9);
        }

        /* UP主主页视频卡片标签样式 */
        .up-main-video-card .bili-quality-tag,
        .small-item .bili-quality-tag {
            position: absolute !important;
            left: 8px !important;
            top: 8px !important;
            z-index: 10 !important;
            transform: scale(0.9);
        }

        /* 确保封面容器使用相对定位，让标签的绝对定位能够正确参照 */
        .up-main-video-card .cover-container,
        .up-main-video-card .cover,
        .small-item .cover {
            position: relative !important;
        }

        @keyframes badgeSlideIn {
            0% { opacity: 0; transform: translateX(-15px) scale(0.9); }
            100% { opacity: 1; transform: translateX(0) scale(0.9); }
        }
    `);

    class VideoProcessor {
        constructor() {
            this.observer = null;
            this.pendingRequests = new Map();
            this.statsCache = new Map(); // Added stats cache
            this.abortController = new AbortController();
            this.processQueue = new Set();
            this.isProcessing = false;
        }

        initScrollHandler() {
            let timeout;
            window.addEventListener('scroll', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.checkNewCards(), CONFIG.DEBOUNCE_TIME);
            }, { signal: this.abortController.signal });
        }

        checkNewCards() {
            if (document.visibilityState === 'hidden') return;

            const cards = document.querySelectorAll(`
                .bili-video-card:not([data-quality-checked]),
                .video-page-card-small:not([data-quality-checked]),
                .video-page-card:not([data-quality-checked]),
                .up-main-video-card:not([data-quality-checked]),
                .small-item:not([data-quality-checked])
            `);

            cards.forEach(card => {
                if (!card.dataset.qualityChecked) {
                    this.processQueue.add(card);
                }
            });

            this.processNextBatch();
        }

        async processNextBatch() {
            if (this.isProcessing || this.processQueue.size === 0) return;

            this.isProcessing = true;
            const batchSize = 5;
            const batch = Array.from(this.processQueue).slice(0, batchSize);

            try {
                await Promise.all(batch.map(card => this.processCard(card)));
            } catch (error) {
                console.debug('[BiliMarker] Batch processing error:', error);
            }

            batch.forEach(card => this.processQueue.delete(card));
            this.isProcessing = false;

            if (this.processQueue.size > 0) {
                setTimeout(() => this.processNextBatch(), 100);
            }
        }

        async processCard(card) {
            if (card.dataset.qualityChecked === 'true') return;
            if (!document.body.contains(card)) return;

            card.dataset.qualityChecked = 'processing';

            const link = card.querySelector('a[href*="/video/BV"]');
            if (!link) {
                card.dataset.qualityChecked = 'true';
                return;
            }

            const bvid = this.extractBVID(link.href);
            if (!bvid) {
                card.dataset.qualityChecked = 'true';
                return;
            }

            const container = this.findBadgeContainer(card);
            if (!container) {
                card.dataset.qualityChecked = 'true';
                return;
            }

            try {
                const stats = await this.fetchWithRetry(bvid);
                if (!document.body.contains(card)) return;

                if (this.isHighQuality(stats)) {
                    const badge = this.createBadge(stats);
                    const existingBadge = container.querySelector('.bili-quality-tag');
                    if (!existingBadge) {
                        if (container.firstChild) {
                            container.insertBefore(badge, container.firstChild);
                        } else {
                            container.appendChild(badge);
                        }
                    }
                }
            } catch (error) {
                console.debug('[BiliMarker] API请求失败:', error);
            } finally {
                if (document.body.contains(card)) {
                    card.dataset.qualityChecked = 'true';
                }
            }
        }

        findBadgeContainer(card) {
            // UP主主页视频卡片
            if (card.classList.contains('up-main-video-card') || card.classList.contains('small-item')) {
                return card.querySelector('.cover-container, .cover, .pic-box') || card;
            }

            // 其他页面视频卡片
            if (card.classList.contains('video-page-card-small')) {
                return card.querySelector('.pic-box');
            }
            if (card.classList.contains('video-page-card')) {
                return card.querySelector('.pic');
            }
            return card.querySelector('.bili-video-card__cover, .cover, .pic, .bili-video-card__info') ||
                   card.closest('.bili-video-card')?.querySelector('.bili-video-card__cover');
        }

        isHighQuality(stats) {
            return stats?.view >= CONFIG.MIN_VIEWS && stats.like / stats.view >= CONFIG.MIN_SCORE;
        }

        isTopQuality(stats) {
            return stats?.coin >= stats?.like; // Note: May need adjustment based on actual data
        }

        createBadge(stats) {
            const badge = document.createElement('span');
            badge.className = 'bili-quality-tag';
            if (this.isTopQuality(stats)) {
                badge.style.background = CONFIG.TOP_TAG_COLOR;
                badge.innerHTML = CONFIG.TOP_TAG_TEXT;
            } else {
                badge.style.background = CONFIG.TAG_COLOR;
                if (CONFIG.SHOW_PERCENT) {
                    badge.innerHTML = `<span>${(stats.like / stats.view * 100).toFixed(1)}%</span>${CONFIG.TAG_TEXT}`;
                } else {
                    badge.innerHTML = CONFIG.TAG_TEXT;
                }
            }
            return badge;
        }

        extractBVID(url) {
            try {
                return new URL(url).pathname.match(/video\/(BV\w+)/)?.[1];
            } catch {
                return null;
            }
        }

        async fetchWithRetry(bvid, retry = 0) {
            // Check cache first
            if (this.statsCache.has(bvid)) {
                return this.statsCache.get(bvid);
            }

            if (this.pendingRequests.has(bvid)) {
                return this.pendingRequests.get(bvid);
            }

            const promise = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
                    timeout: 5000,
                    onload: (res) => {
                        try {
                            const data = JSON.parse(res.responseText);
                            if (data?.code === 0 && data?.data?.stat) {
                                this.statsCache.set(bvid, data.data.stat); // Store in cache
                                resolve(data.data.stat);
                            } else {
                                reject(new Error('Invalid API response'));
                            }
                        } catch (error) {
                            if (retry < CONFIG.RETRY_LIMIT) {
                                setTimeout(() => {
                                    this.fetchWithRetry(bvid, retry + 1).then(resolve).catch(reject);
                                }, 1000 * (retry + 1));
                            } else {
                                reject(error);
                            }
                        }
                    },
                    onerror: () => {
                        if (retry < CONFIG.RETRY_LIMIT) {
                            setTimeout(() => {
                                this.fetchWithRetry(bvid, retry + 1).then(resolve).catch(reject);
                            }, 1000 * (retry + 1));
                        } else {
                            reject(new Error('Request failed'));
                        }
                    }
                });
            });

            this.pendingRequests.set(bvid, promise);
            return promise.finally(() => {
                this.pendingRequests.delete(bvid);
            });
        }

        initObserver() {
            this.observer = new MutationObserver((mutations) => {
                let shouldCheck = false;
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        shouldCheck = true;
                        break;
                    }
                }
                if (shouldCheck) {
                    this.checkNewCards();
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        start() {
            setTimeout(() => {
                this.initScrollHandler();
                this.initObserver();
                this.checkNewCards();
            }, CONFIG.INIT_DELAY);
        }

        destroy() {
            this.observer?.disconnect();
            this.abortController.abort();
            this.processQueue.clear();
            this.pendingRequests.clear();
            this.statsCache.clear();
        }
    }

    class SearchResultProcessor extends VideoProcessor {
        findBadgeContainer(card) {
            return card.querySelector('.bili-video-card__cover, .imgbox') ||
                   card.closest('.bili-video-card')?.querySelector('.bili-video-card__cover');
        }
    }

    class UpPageProcessor extends VideoProcessor {
        findBadgeContainer(card) {
            // 确保返回正确的封面容器元素
            const coverElement = card.querySelector('.cover-container, .cover, .pic-box');
            if (coverElement) {
                // 确保容器有相对定位，以便标签能正确定位
                coverElement.style.position = 'relative';
                return coverElement;
            }
            return card;
        }

        createBadge(stats) {
            const badge = super.createBadge(stats);
            // 确保UP主页上的标签使用绝对定位并位于正确位置
            badge.style.position = 'absolute';
            badge.style.left = '8px';
            badge.style.top = '8px';
            badge.style.zIndex = '10';
            return badge;
        }
    }

    let processor = null;

    if (document.readyState === 'complete') {
        initProcessor();
    } else {
        window.addEventListener('load', initProcessor, { once: true });
    }

    function initProcessor() {
        if (location.host.includes('search')) {
            processor = new SearchResultProcessor();
        } else if (location.host.includes('space')) {
            processor = new UpPageProcessor();
        } else {
            processor = new VideoProcessor();
        }

        processor.start();
    }

    window.addEventListener('beforeunload', () => {
        processor?.destroy();
    });
})();