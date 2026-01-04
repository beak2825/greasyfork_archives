// ==UserScript==
// @name         Universal Website Optimizer (WIP Beta Ver) / 通用網站優化工具 (實驗性)
// @name:zh-TW   通用網站優化工具 (實驗性)
// @namespace    https://github.com/jmsch23280866
// @version      2.7.9
// @description  Optimizes website loading speed, reduces CPU and RAM usage, disables telemetry. (Script assisted by ChatGPT)
// @description:zh-TW 加速網站載入速度、減少CPU和RAM使用、禁用遙測。（此腳本由ChatGPT協助撰寫）
// @author       特務E04
// @supportURL   https://github.com/jmsch23280866/Universal-Website-Optimizer/issues/
// @license      MIT
// @noframes
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501085/Universal%20Website%20Optimizer%20%28WIP%20Beta%20Ver%29%20%20%E9%80%9A%E7%94%A8%E7%B6%B2%E7%AB%99%E5%84%AA%E5%8C%96%E5%B7%A5%E5%85%B7%20%28%E5%AF%A6%E9%A9%97%E6%80%A7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501085/Universal%20Website%20Optimizer%20%28WIP%20Beta%20Ver%29%20%20%E9%80%9A%E7%94%A8%E7%B6%B2%E7%AB%99%E5%84%AA%E5%8C%96%E5%B7%A5%E5%85%B7%20%28%E5%AF%A6%E9%A9%97%E6%80%A7%29.meta.js
// ==/UserScript==

(() => {
    'use strict';


    // 錯誤日誌函數，只在發生錯誤時輸出到控制台
    const logError = (message, error) => {
        console.error(`[Universal Website Optimizer] ${message}`, error);
        // 新增錯誤提示
        alert(`Error: ${message}`);
    };

    // 需要阻擋的資源列表
    const blockList = [
        'google\\.analytics\\.com', 'analytics\\.js', 'gtag\\/js',
        'doubleclick\\.net', 'adsbygoogle\\.js', 'googlesyndication\\.com', 'googletagmanager\\.com',
    ].map(pattern => new RegExp(pattern));

    // 防抖函數
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // 本地快取
    const MAX_CACHE_SIZE = 48 * 1024 * 1024; // 48MB
    const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

    const localCache = new Map();
    let currentCacheSize = 0;

    // 檢查是否為可快取的資源
    const isCacheable = (url) => {
        const img = new Image();
        img.src = url;
        const fileName = url.split('/').pop();
        const isNumericFileName = /^\d+$/.test(fileName.split('.').shift());
        return !isNumericFileName && (img.complete || /\.(css|woff|woff2|ttf|eot|js)$/i.test(url)); // 添加對 .js 文件的檢查
    };


    const cachedFetch = (url) => {
        const now = Date.now();

        if (localCache.has(url)) {
            const { data, timestamp } = localCache.get(url);
            if (now - timestamp < CACHE_EXPIRY_TIME) {
                // 如果快取未過期，重置時間戳並返回快取的內容
                localCache.set(url, { data, timestamp: now });
                return Promise.resolve(data);
            } else {
                // 如果快取已過期，移除快取項目
                localCache.delete(url);
                currentCacheSize -= data.length;
            }
        }

        return fetch(url)
            .then(response => {
                const contentLength = response.headers.get('Content-Length');
                if (contentLength && parseInt(contentLength) > 1048576) { // 1MB = 1048576 bytes
                    return response.text();
                }

                return response.text().then(data => {
                    if (currentCacheSize + data.length <= MAX_CACHE_SIZE) {
                        localCache.set(url, { data, timestamp: now });
                        currentCacheSize += data.length;
                    }
                    return data;
                });
            });
    };

    // 攔截請求函數
    const interceptRequests = () => {
        // 攔截 XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (blockList.some(regex => regex.test(url))) {
                return;
            }
            originalOpen.call(this, method, url, ...args);
        };


        // 攔截 Fetch API
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
            if (typeof input === 'string' && blockList.some(regex => regex.test(input))) {
                return Promise.reject(new Error('Request blocked by Userscript'));
            }

            if (typeof input === 'string' && isCacheable(input)) {
                return cachedFetch(input);
            }

            return originalFetch.call(this, input, init);
        };

        // 使用防抖處理 DOM 變化
        const handleMutations = debounce((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;
                    if ((node.tagName === 'SCRIPT' && node.src && blockList.some(regex => regex.test(node.src))) ||
                        (node.tagName === 'LINK' && node.rel === 'stylesheet' && node.href && blockList.some(regex => regex.test(node.href)))) {
                        node.remove();
                    }
                }
            }
        }, 100); // 100毫秒的防抖延遲

        // 觀察 DOM 變化
        new MutationObserver(handleMutations).observe(document, { childList: true, subtree: true });
    };

    // 增強的延遲加載函數
    const enhancedLazyLoad = () => {
        const lazyLoadElements = (selector, loadingAttribute = 'src') => {
            const elements = document.querySelectorAll(selector);
            if ('loading' in HTMLImageElement.prototype) {
                elements.forEach(el => {
                    if (!el.hasAttribute('loading')) {
                        el.setAttribute('loading', 'lazy');
                    }
                    // 如果有data-src，則將其設置為src
                    if (el.dataset.src) {
                        el[loadingAttribute] = el.dataset.src;
                    }
                });
            } else {
                // 使用 IntersectionObserver 作為後備方案
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const el = entry.target;
                            if (el.dataset.src) {
                                el[loadingAttribute] = el.dataset.src;
                            }
                            observer.unobserve(el);
                        }
                    });
                });

                elements.forEach(el => observer.observe(el));
            }
        };

        // 延遲加載圖片
        lazyLoadElements('img');

        // 延遲加載 iframe
        lazyLoadElements('iframe', 'src');
    };

    // 預加載關鍵資源
    const preloadCriticalResources = () => {
        const preloadLinks = new Set();

        // 預加載關鍵圖片
        document.querySelectorAll('img[data-critical]').forEach(img => {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = img.src;
            preloadLinks.add(preloadLink);
        });

        // 預加載關鍵 CSS
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            if (link.getAttribute('data-critical') === 'true') {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'style';
                preloadLink.href = link.href;
                preloadLinks.add(preloadLink);
            }
        });

        preloadLinks.forEach(link => document.head.appendChild(link));
    };


    // 替換 document.write
    const replaceDocumentWrite = () => {
        const originalWrite = document.write;

        document.write = document.writeln = (content) => {
            if (typeof content !== 'string') return logError('內容必須是字符串');
            try {
                if (document.body) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = content;
                    document.body.appendChild(tempDiv);
                } else {
                    // 如果body不存在，使用原始方法
                    originalWrite.call(document, content);
                }
            } catch (err) {
                logError('內容插入失敗:', err);
                // 回退到原始的document.write
                originalWrite.call(document, content);
            }
        };
    };

    // 清理 HTML 元素
    const cleanupHTMLElements = () => {
        // 移除無障礙屬性
        const accessibilityAttributes = ['aria-label', 'aria-describedby', 'aria-details', 'alt'];
        const selector = accessibilityAttributes.map(attr => `[${attr}]`).join(',');
        document.querySelectorAll(selector).forEach(el => {
            accessibilityAttributes.forEach(attr => el.removeAttribute(attr));
        });


        // 定義需要移除的 <meta> 標籤黑名單
        const metaTagBlacklist = [
            'keywords', 'description', 'author', 'generator',
            'robots', 'googlebot', 'revisit-after',
            'apple-itunes-app', 'apple-mobile-web-app',  //Apple 應用程式
            'og:',  //Open Graph 協議相關標籤
            'twitter:', //Twitter 卡片相關標籤
            'fb:', //Facebook 相關標籤
            'juicyads-site-verification', 'exoclick-site-verification', 'trafficjunky-site-verification', //垃圾廣告
            'ero_verify', 'linkbuxverifycode', //垃圾廣告
        ];

        // 定義需要移除的 <script> 標籤黑名單
        const scriptBlacklist = [
            'google-analytics', 'googletagmanager', 'adsbygoogle', 'doubleclick.net'
        ];

        // 移除黑名單中的 <meta> 標籤
        document.querySelectorAll('meta').forEach(meta => {
            const name = meta.getAttribute('name');
            const property = meta.getAttribute('property');
            const httpEquiv = meta.getAttribute('http-equiv');

            if (name && metaTagBlacklist.some(blacklisted => name.toLowerCase().startsWith(blacklisted))) {
                meta.remove();
            } else if (property && metaTagBlacklist.some(blacklisted => property.toLowerCase().startsWith(blacklisted))) {
                meta.remove();
            } else if (httpEquiv && metaTagBlacklist.some(blacklisted => httpEquiv.toLowerCase().startsWith(blacklisted))) {
                meta.remove();
            }
        });


        // 移除黑名單中的 <script> 標籤
        document.querySelectorAll('script').forEach(script => {
            const src = script.getAttribute('src');
            if (src && scriptBlacklist.some(blacklisted => src.includes(blacklisted))) {
                script.remove();
            }
        });

        // 移除 <noscript> 標籤
        document.querySelectorAll('noscript').forEach(noscript => noscript.remove());

        // 移除 <p>&nbsp; 標籤
        document.querySelectorAll('p').forEach(p => p.innerHTML.trim() === '&nbsp;' && p.remove());
    };

    // 啟用 YouTube 隱私模式
    const enableYouTubePrivacyMode = () => {
        document.querySelectorAll('iframe').forEach(iframe => {
            if (iframe.src.includes('youtube.com/embed/')) {
                iframe.src = iframe.src.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/');
            }
        });
    };

    // 立即執行的優化
    const immediateOptimizations = () => {
        try {
            interceptRequests();
            replaceDocumentWrite();
            preloadCriticalResources();
        } catch (error) {
            logError('立即優化過程中發生錯誤:', error);
        }
    };

    // DOM 內容加載完成後執行的優化
    const domContentLoadedOptimizations = () => {
        try {
            enhancedLazyLoad();
            cleanupHTMLElements();
            enableYouTubePrivacyMode();
        } catch (error) {
            logError('DOM 內容加載優化過程中發生錯誤:', error);
        }
    };

    // 立即執行優化
    immediateOptimizations();

    // 在 DOM 內容加載完成後執行其他優化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', domContentLoadedOptimizations);
    } else {
        domContentLoadedOptimizations();
    }
})();