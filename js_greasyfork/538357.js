// ==UserScript==
// @name        ExHentai Lanraragi Checker 1.4
// @namespace   https://github.com/Putarku
// @match       https://exhentai.org/*
// @match       https://e-hentai.org/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @license MIT
// @version     1.4
// @author      Putarku
// @description Checks if galleries on ExHentai/E-Hentai are already in your Lanraragi library and marks them by inserting a span at the beginning of the title.
// @downloadURL https://update.greasyfork.org/scripts/538357/ExHentai%20Lanraragi%20Checker%2014.user.js
// @updateURL https://update.greasyfork.org/scripts/538357/ExHentai%20Lanraragi%20Checker%2014.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 用户配置开始 ---
    const LRR_SERVER_URL = 'http://localhost:3000'; // 替换为您的 Lanraragi 服务器地址
    const LRR_API_KEY = ''; // 如果您的 Lanraragi API 需要密钥，请填写
    const MAX_CONCURRENT_REQUESTS = 5; // 最大并发请求数，避免服务器过载
    // --- 用户配置结束 ---

    GM_addStyle(`
        .lrr-marker-span {
            font-weight: bold;
            border-radius: 3px;
            padding: 0px 3px;
            margin-right: 4px; /* 与 visied.js 的 ● 标记或标题文本的间距 */
            font-size: 0.9em;
        }

        .lrr-marker-downloaded {
            color: #28a745; /* 绿色 */
            background-color: #49995d;
        }

        .lrr-marker-file {
            color: #356ddc; /* 蓝色 */
            background-color: #894ab0;
        }

        .lrr-marker-error {
            color: #dc3545; /* 红色 */
            background-color: #fbe9ea;
        }
    `);

    const CACHE_DURATION = 60 * 60 * 1000; // 1h in milliseconds
    const CLEANUP_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days cleanup interval

    function getCache(key) {
        const cached = localStorage.getItem(key);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }
        return null;
    }

    function setCache(key, data) {
        const item = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    // 清理过期缓存
    function cleanupExpiredCache() {
        const lastCleanup = localStorage.getItem('lrr-cache-last-cleanup');
        const currentTime = Date.now();

        // 如果距离上次清理超过7天，执行清理
        if (!lastCleanup || (currentTime - parseInt(lastCleanup)) > CLEANUP_INTERVAL) {
            console.log('[LRR Checker] Starting cache cleanup...');
            let removedCount = 0;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('lrr-checker-')) {
                    try {
                        const item = localStorage.getItem(key);
                        if (item) {
                            const cacheData = JSON.parse(item);
                            if (currentTime - cacheData.timestamp > CACHE_DURATION) {
                                localStorage.removeItem(key);
                                removedCount++;
                                i--; // 因为删除后数组长度变化
                            }
                        }
                    } catch (e) {
                        console.error(`[LRR Checker] Error cleaning up cache key ${key}:`, e);
                    }
                }
            }

            localStorage.setItem('lrr-cache-last-cleanup', currentTime.toString());
            console.log(`[LRR Checker] Cache cleanup completed. Removed ${removedCount} expired items.`);
        }
    }

    // 将GM_xmlhttpRequest包装为Promise
    function makeRequest(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method,
                url: options.url,
                headers: options.headers,
                onload: function(response) {
                    resolve(response);
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 限制并发请求数量的函数
    async function processInBatches(items, processFn, batchSize) {
        const results = [];
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            const batchPromises = batch.map(processFn);
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }
        return results;
    }

    // 收集需要查询的画廊信息
    const galleryLinks = document.querySelectorAll('.itg .gl1t a[href*="/g/"]');
    const galleriesToCheck = [];

    galleryLinks.forEach(linkElement => {
        const galleryUrl = linkElement.href;
        const titleElement = linkElement.querySelector('.glink');

        if (!galleryUrl || !titleElement) {
            return;
        }

        if (titleElement.querySelector('.lrr-marker-span')) {
            return;
        }

        const cacheKey = `lrr-checker-${galleryUrl}`;
        const cachedData = getCache(cacheKey);

        if (cachedData) {
            console.log(`[LRR Checker] Using cached data for: ${galleryUrl}`);
            handleResponse(cachedData, titleElement, galleryUrl);
            return;
        }

        galleriesToCheck.push({
            galleryUrl,
            titleElement,
            cacheKey
        });
    });

    // 处理单个画廊的查询
    async function processGallery(gallery) {
        const { galleryUrl, titleElement, cacheKey } = gallery;
        const apiUrl = `${LRR_SERVER_URL}/api/plugins/use?plugin=urlfinder&arg=${encodeURIComponent(galleryUrl)}`;
        const headers = {};
        if (LRR_API_KEY) {
            headers['Authorization'] = `Bearer ${LRR_API_KEY}`;
        }

        try {
            const response = await makeRequest({
                method: 'POST',
                url: apiUrl,
                headers: headers
            });

            try {
                const result = JSON.parse(response.responseText);
                setCache(cacheKey, result);
                handleResponse(result, titleElement, galleryUrl);
                return { success: true, galleryUrl };
            } catch (e) {
                console.error(`[LRR Checker] Error parsing JSON for ${galleryUrl}:`, e, response.responseText);
                let markerSpan = document.createElement('span');
                markerSpan.classList.add('lrr-marker-span', 'lrr-marker-error');
                markerSpan.textContent = '(LRR ❓)';
                if (titleElement) titleElement.prepend(markerSpan);
                return { success: false, galleryUrl, error: e };
            }
        } catch (error) {
            console.error(`[LRR Checker] Network error checking ${galleryUrl}:`, error);
            let markerSpan = document.createElement('span');
            markerSpan.classList.add('lrr-marker-span', 'lrr-marker-error');
            markerSpan.textContent = '(LRR ❓)';
            if (titleElement) titleElement.prepend(markerSpan);
            return { success: false, galleryUrl, error };
        }
    }

    // 执行缓存清理
    cleanupExpiredCache();

    // 并行处理所有画廊查询，限制并发数
    if (galleriesToCheck.length > 0) {
        console.log(`[LRR Checker] Processing ${galleriesToCheck.length} galleries in parallel batches`);
        processInBatches(galleriesToCheck, processGallery, MAX_CONCURRENT_REQUESTS)
            .then(results => {
                console.log(`[LRR Checker] Completed all gallery checks. Success: ${results.filter(r => r.success).length}, Failed: ${results.filter(r => !r.success).length}`);
            })
            .catch(error => {
                console.error(`[LRR Checker] Error in batch processing:`, error);
            });
    }

    // 将备用搜索也改为Promise方式
    async function performAlternativeSearch(searchQuery, titleElement) {
        const randomSearchUrl = `${LRR_SERVER_URL}/api/search/random?filter=${encodeURIComponent(searchQuery)}`;
        const headers = {};
        if (LRR_API_KEY) {
            headers['Authorization'] = `Bearer ${LRR_API_KEY}`;
        }

        try {
            const response = await makeRequest({
                method: 'GET',
                url: randomSearchUrl,
                headers: headers
            });

            try {
                const randomResult = JSON.parse(response.responseText);
                if (randomResult && randomResult.data && randomResult.data.length > 0) {
                    console.log(`[LRR Checker] Found via alternative search: ${searchQuery}`);
                    let altMarkerSpan = document.createElement('span');
                    altMarkerSpan.classList.add('lrr-marker-span');
                    altMarkerSpan.textContent = '(LRR！)';
                    altMarkerSpan.classList.add('lrr-marker-file');
                    titleElement.prepend(altMarkerSpan);
                    return { success: true, searchQuery };
                } else {
                    console.log(`[LRR Checker] Not found via alternative search: ${searchQuery}`);
                    return { success: false, searchQuery };
                }
            } catch (e) {
                console.error(`[LRR Checker] Error parsing JSON for alternative search:`, e, response.responseText);
                return { success: false, searchQuery, error: e };
            }
        } catch (error) {
            console.error(`[LRR Checker] Network error during alternative search:`, error);
            return { success: false, searchQuery, error };
        }
    }

    function handleResponse(result, titleElement, galleryUrl) {
        let markerSpan = document.createElement('span');
        markerSpan.classList.add('lrr-marker-span');

        if (result.success === 1) {
            console.log(`[LRR Checker] Found: ${galleryUrl} (ID: ${result.data.id})`);
            markerSpan.textContent = '(LRR ✔)';
            markerSpan.classList.add('lrr-marker-downloaded');
            titleElement.prepend(markerSpan);
        } else {
            console.log(`[LRR Checker] Not found or error: ${galleryUrl} - ${result.error}`);
            const fullTitle = titleElement.textContent.trim();
            const authorRegex = /\[((?!汉化|漢化|DL版|中国翻訳)[^\]]+)\]/;
            const authorMatch = fullTitle.match(authorRegex);
            const author = authorMatch ? authorMatch[1] : null;
            if (!author) {
                console.log(`[LRR Checker] Skipping due to missing ${fullTitle}`);
                return;
            }

            const titleRegex = /\]([^\[\]\(\)]+)/;
            const titleMatch = fullTitle.match(titleRegex);
            const title = titleMatch ? titleMatch[1] : null;

            if (author === title || title === null) {
                console.log(`[LRR Checker] Skipping due to missing ${fullTitle}`);
                return;
            }

            const searchQuery = `${author},${title}`;
            console.log(`[LRR Checker] Trying alternative search with: ${searchQuery}`);

            // 执行备用搜索
            performAlternativeSearch(searchQuery, titleElement);
        }
        }
    })();
