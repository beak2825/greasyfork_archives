// ==UserScript==
// @name         Pixiv AI Artwork Marker
// @name:zh-CN   Pixiv AI 作品标识
// @namespace    https://greasyfork.org/users/your-name
// @version      3.0
// @description  Adds badges to AI art's preview
// @description:zh-CN 为Pixiv作品预览添加AI标识
// @author       YourName
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      pixiv.net
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544700/Pixiv%20AI%20Artwork%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/544700/Pixiv%20AI%20Artwork%20Marker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const MAX_CONCURRENT_REQUESTS = 10; // 最大并发请求数
    const MAX_RETRIES = 5; // 429错误最大重试次数
    const RETRY_DELAY = 1500; // 重试延迟（毫秒）
    const DEBUG_PREFIX = '[Pixiv AI Marker]';

    // --- 样式定义 ---
    GM_addStyle(`
        .pixiv-marker-base {
            position: absolute; bottom: 8px; left: 8px;
            padding: 3px 6px; color: white; border-radius: 5px;
            font-size: 12px; font-weight: bold; font-family: sans-serif;
            z-index: 100; pointer-events: none;
            box-shadow: 0 1px 4px rgba(0,0,0,0.4);
            text-shadow: 0 0 2px rgba(0,0,0,0.6);
            line-height: 1;
            transition: all 0.3s ease;
        }
        .ai-artwork-badge { background: linear-gradient(135deg, #f76b1c, #f03e3e); }
        .checking-artwork-badge { background-color: rgba(100, 100, 100, 0.75); }
    `);

    // --- 状态管理 ---
    const processedArtworkIDs = new Set(); // 存储已加入队列的作品ID，防止重复处理
    const requestQueue = []; // 待处理的任务队列
    let activeRequests = 0; // 当前正在进行的请求数

    console.log(`${DEBUG_PREFIX} 脚本启动 (v3.0)。并发数: ${MAX_CONCURRENT_REQUESTS}, 重试次数: ${MAX_RETRIES}`);

    // --- DOM 操作函数 ---
    const getContainer = (link) => {
        const container = link.parentElement;
        if (container && window.getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }
        return container;
    };

    const addCheckingBadge = (link) => {
        const container = getContainer(link);
        if (!container || container.querySelector('.pixiv-marker-base')) return;
        const badge = document.createElement('span');
        badge.textContent = 'AI?';
        badge.className = 'pixiv-marker-base checking-artwork-badge';
        container.appendChild(badge);
    };

    const updateBadge = (link, isAI) => {
        const container = getContainer(link);
        const badge = container?.querySelector('.checking-artwork-badge');
        if (isAI) {
            if (badge) {
                badge.textContent = 'AI';
                badge.classList.remove('checking-artwork-badge');
                badge.classList.add('ai-artwork-badge');
            } else if (!container.querySelector('.ai-artwork-badge')) {
                const newBadge = document.createElement('span');
                newBadge.textContent = 'AI';
                newBadge.className = 'pixiv-marker-base ai-artwork-badge';
                container.appendChild(newBadge);
            }
        } else {
            badge?.remove();
        }
    };

    // --- 核心网络请求与队列处理 ---
    /**
     * 执行单个作品的API检查
     * @param {object} task - 任务对象 { linkElement, illustId, retries }
     */
    function performCheck(task) {
        const { linkElement, illustId, retries } = task;

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://www.pixiv.net/touch/ajax/illust/details?illust_id=${illustId}`,
            responseType: 'json',
            onload: function(response) {
                activeRequests--; // 请求完成，释放一个并发名额

                if (response.status >= 200 && response.status < 300) {
                    const isAI = response.response?.body?.illust_details?.ai_type === 2;
                    // console.log(`${DEBUG_PREFIX} ID: ${illustId} 检查成功. ${isAI ? '是AI作品' : '非AI作品'}.`);
                    updateBadge(linkElement, isAI);
                } else if (response.status === 429 && retries < MAX_RETRIES) {
                    console.warn(`${DEBUG_PREFIX} ID: ${illustId} 遭遇429速率限制. 将在 ${RETRY_DELAY / 1000}s 后重试 (${retries + 1}/${MAX_RETRIES})...`);
                    task.retries++;
                    // 将任务重新推回队列头部，并延迟后处理
                    setTimeout(() => {
                        requestQueue.unshift(task);
                        processQueue();
                    }, RETRY_DELAY);
                    return; // 提前返回，不触发下面的 processQueue
                } else {
                    console.error(`${DEBUG_PREFIX} ID: ${illustId} API请求失败. 状态: ${response.status}`);
                    updateBadge(linkElement, false); // 失败则移除角标
                }
                processQueue(); // 处理队列中的下一个任务
            },
            onerror: function(error) {
                activeRequests--; // 请求完成，释放一个并发名额
                console.error(`${DEBUG_PREFIX} ID: ${illustId} 网络请求错误:`, error);
                updateBadge(linkElement, false); // 失败则移除角标
                processQueue(); // 处理队列中的下一个任务
            }
        });
    }

    /**
     * 处理任务队列，维持并发数
     */
    function processQueue() {
        while (requestQueue.length > 0 && activeRequests < MAX_CONCURRENT_REQUESTS) {
            const task = requestQueue.shift();
            if (task) {
                activeRequests++;
                // console.log(`${DEBUG_PREFIX} 发起请求 ID: ${task.illustId}. 当前并发: ${activeRequests}/${MAX_CONCURRENT_REQUESTS}. 队列剩余: ${requestQueue.length}`);
                performCheck(task);
            }
        }
    }

    /**
     * 扫描页面，将新发现的作品加入任务队列
     */
    function scanForArtworks() {
        const links = document.querySelectorAll('a[href*="/artworks/"]');
        let newFoundCount = 0;

        for (const link of links) {
            if (!link.querySelector('img')) continue;

            const match = link.href.match(/\/artworks\/(\d+)/);
            if (match && match[1]) {
                const illustId = match[1];
                if (!processedArtworkIDs.has(illustId)) {
                    processedArtworkIDs.add(illustId);
                    newFoundCount++;
                    addCheckingBadge(link);
                    requestQueue.push({ linkElement: link, illustId, retries: 0 });
                }
            }
        }

        if (newFoundCount > 0) {
            console.log(`${DEBUG_PREFIX} 扫描发现 ${newFoundCount} 个新作品，已加入队列。`);
            processQueue();
        }
    }

    // --- 启动与监控 ---
    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(scanForArtworks, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始执行
    scanForArtworks();

})();
