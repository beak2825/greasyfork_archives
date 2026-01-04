// ==UserScript==
// @name         B站BV号极速转换工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于将B站BV号转换为超链接
// @author       WEN枫树
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      bilibili.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540330/B%E7%AB%99BV%E5%8F%B7%E6%9E%81%E9%80%9F%E8%BD%AC%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/540330/B%E7%AB%99BV%E5%8F%B7%E6%9E%81%E9%80%9F%E8%BD%AC%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 匹配BV号的正则表达式
    const bvRegex = /BV1[a-zA-Z0-9]{2}4[a-zA-Z0-9]1[a-zA-Z0-9]7[a-zA-Z0-9]{2}/g;

    // 缓存配置（7天有效期）
    const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7天

    // 请求并发控制
    const MAX_CONCURRENT_REQUESTS = 5;
    let activeRequests = 0;
    let requestQueue = [];

    // 添加自定义样式
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .bv-container {
                display: inline;
                white-space: normal;
            }
            .bv-link {
                color: #00a1d6 !important;
                text-decoration: none !important;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline;
            }
            .bv-link:hover {
                text-decoration: underline !important;
                color: #00c8ff !important;
            }
            .bv-title {
                color: #a9a9b3;
                font-style: italic;
                margin-left: 4px;
                display: inline;
                white-space: normal;
            }
            .loading {
                color: #777;
            }
            .cached {
                color: #4ade80;
            }
            .invalid-indicator {
                color: #ff6b6b;
                font-style: italic;
                display: inline;
                margin-left: 5px;
            }
            .invalid-indicator::before {
                content: "（！";
            }
            .invalid-indicator::after {
                content: "）";
            }
        `;
        document.head.appendChild(style);
    }

    // 获取缓存标题
    function getCachedTitle(bv) {
        const cache = GM_getValue(bv);
        if (cache && cache.expire > Date.now()) {
            return cache.title;
        }
        return null;
    }

    // 保存标题到缓存
    function saveToCache(bv, title) {
        GM_setValue(bv, {
            title: title,
            expire: Date.now() + CACHE_TTL
        });
    }

    // 主处理函数
    function processTextNode(node) {
        if (!node.textContent.match(bvRegex)) return;
        if (isInBVContainer(node) || isInPre(node)) return;

        const parent = node.parentNode;
        if (parent.tagName === 'A' || parent.classList.contains('processed-bv')) return;

        // 创建文档片段来保存替换内容
        const fragment = document.createDocumentFragment();
        const text = node.textContent;
        let lastIndex = 0;
        let match;

        while ((match = bvRegex.exec(text)) !== null) {
            // 添加匹配前的文本
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
            }

            // 处理BV号
            const bv = match[0];
            const container = createBVContainer(bv);
            fragment.appendChild(container);

            lastIndex = bvRegex.lastIndex;
        }

        // 添加剩余文本
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        // 替换原始节点
        parent.replaceChild(fragment, node);
    }

    // 创建BV容器元素
    function createBVContainer(bv) {
        const container = document.createElement('span');
        container.className = 'bv-container processed-bv';
        container.dataset.bv = bv;

        const link = document.createElement('a');
        link.href = `https://www.bilibili.com/video/${bv}`;
        link.target = '_blank';
        link.className = 'bv-link';
        link.textContent = bv;
        container.appendChild(link);

        // 检查缓存
        const cachedTitle = getCachedTitle(bv);
        if (cachedTitle) {
            const titleSpan = document.createElement('span');
            titleSpan.className = 'bv-title cached';
            titleSpan.textContent = `（${cachedTitle}）`;
            container.appendChild(titleSpan);
        } else {
            const titleSpan = document.createElement('span');
            titleSpan.className = 'bv-title loading';
            titleSpan.textContent = '（加载中...）';
            container.appendChild(titleSpan);

            // 添加到处理队列
            requestQueue.push({ bv, container });
        }

        return container;
    }

    // 处理请求队列
    function processRequestQueue() {
        // 先处理可见区域的请求
        const visibleRequests = [];
        const invisibleRequests = [];

        requestQueue.forEach(item => {
            if (isElementInViewport(item.container)) {
                visibleRequests.push(item);
            } else {
                invisibleRequests.push(item);
            }
        });

        // 处理可见请求
        processBatch(visibleRequests);

        // 处理不可见请求（延迟处理）
        if (invisibleRequests.length > 0) {
            setTimeout(() => {
                processBatch(invisibleRequests);
            }, 1500);
        }

        // 清空队列
        requestQueue = [];
    }

    // 批量处理请求
    function processBatch(requests) {
        const batchSize = 5;
        const batches = [];

        for (let i = 0; i < requests.length; i += batchSize) {
            batches.push(requests.slice(i, i + batchSize));
        }

        batches.forEach((batch, index) => {
            // 分批处理，避免一次性发起过多请求
            setTimeout(() => {
                batch.forEach(item => {
                    fetchVideoTitle(item.bv, item.container);
                });
            }, index * 500); // 每批间隔500ms
        });
    }

    // 获取视频标题
    function fetchVideoTitle(bv, container) {
        // 检查是否已有标题
        if (container.querySelector('.cached') || container.querySelector('.invalid-indicator')) {
            return;
        }

        // 并发控制
        if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
            setTimeout(() => fetchVideoTitle(bv, container), 200);
            return;
        }

        activeRequests++;

        const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bv}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            timeout: 3000,
            onload: function(res) {
                activeRequests--;
                if (res.status === 200) {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.code === 0) {
                            const title = data.data.title;
                            saveToCache(bv, title); // 保存到缓存
                            updateTitle(bv, container, title);
                        } else {
                            markAsInvalid(container);
                        }
                    } catch (e) {
                        markAsInvalid(container);
                    }
                } else {
                    markAsInvalid(container);
                }
            },
            onerror: () => {
                activeRequests--;
                markAsInvalid(container);
            },
            ontimeout: () => {
                activeRequests--;
                markAsInvalid(container);
            }
        });
    }

    // 检查元素是否在可视区域
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // 更新标题显示
    function updateTitle(bv, container, title) {
        const titleSpan = container.querySelector('.bv-title');
        if (titleSpan) {
            titleSpan.textContent = `（${title}）`;
            titleSpan.classList.remove('loading');
            titleSpan.classList.add('cached');
        }
    }

    // 标记为无效BV号
    function markAsInvalid(container) {
        const titleSpan = container.querySelector('.bv-title');
        if (titleSpan) {
            const invalidSpan = document.createElement('span');
            invalidSpan.className = 'invalid-indicator';
            invalidSpan.textContent = '该BV号已失效';
            container.replaceChild(invalidSpan, titleSpan);
        }
    }

    // 检查是否在已处理的容器内
    function isInBVContainer(node) {
        let parent = node.parentNode;
        while (parent) {
            if (parent.classList && parent.classList.contains('bv-container')) {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    }

    // 检查是否在pre标签内
    function isInPre(node) {
        let parent = node.parentNode;
        while (parent) {
            if (parent.tagName === 'PRE') {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    }

    // 扫描文本节点
    function scanTextNodes(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const nodes = [];
        let node;

        while ((node = walker.nextNode())) {
            if (node.textContent.match(bvRegex)) {
                nodes.push(node);
            }
        }

        return nodes;
    }

    // 初始化函数
    function init() {
        addCustomStyles();

        // 初始扫描
        const textNodes = scanTextNodes(document.body);
        textNodes.forEach(processTextNode);

        // 处理请求队列
        processRequestQueue();

        // 监听DOM变化
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const textNodes = scanTextNodes(node);
                            textNodes.forEach(processTextNode);

                            // 处理新添加的请求
                            if (requestQueue.length > 0) {
                                processRequestQueue();
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 滚动时加载新出现的BV号标题
        window.addEventListener('scroll', () => {
            document.querySelectorAll('.bv-container .loading').forEach(container => {
                if (isElementInViewport(container)) {
                    const bvContainer = container.closest('.bv-container');
                    const bv = bvContainer.dataset.bv;
                    fetchVideoTitle(bv, bvContainer);
                }
            });
        });
    }

    // 延迟执行以避免阻塞页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();