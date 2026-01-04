// ==UserScript==
// @name         微博图片别裂
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  感恩戴德地为新浪图片添加微博Referer，支持单独访问和页面嵌入两种情况
// @author       YourName
// @match        *://*/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.onurlchange
// @connect      sinaimg.cn
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/538961/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%88%AB%E8%A3%82.user.js
// @updateURL https://update.greasyfork.org/scripts/538961/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%88%AB%E8%A3%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        TARGET_DOMAINS: ['sinaimg.cn', 'sinaimg.com'],  // 需要处理的图片域名
        REFERER_URL: 'https://weibo.com',               // 要添加的Referer
        WHITELIST_DOMAINS: ['weibo.com', 'weibo.cn'],   // 不处理的域名
        CACHE_PREFIX: 'sess_img_',                      // 缓存前缀
        MEMORY_CACHE_MAX: 50,                           // 内存缓存最大数量
        DEBUG: false                                    // 调试模式
    };

    // 调试日志
    function debugLog(...args) {
        if (CONFIG.DEBUG) {
            console.log('[RefererFix]', ...args);
        }
    }

    // 会话缓存系统
    const SessionCache = {
        // 内存缓存(快速访问)
        memoryCache: new Map(),

        // 持久化缓存键列表(当前会话)
        sessionKeys: new Set(),

        // 获取当前会话ID
        getSessionId: function() {
            let sessionId = sessionStorage.getItem('refererFixSessionId');
            if (!sessionId) {
                sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
                sessionStorage.setItem('refererFixSessionId', sessionId);
            }
            return sessionId;
        },

        // 生成完整缓存键
        getCacheKey: function(url) {
            return CONFIG.CACHE_PREFIX + this.getSessionId() + '_' + btoa(url).replace(/=/g, '');
        },

        // 存入缓存
        set: function(url, blobUrl) {
            const key = this.getCacheKey(url);

            // 内存缓存
            if (this.memoryCache.size >= CONFIG.MEMORY_CACHE_MAX) {
                // 移除最老的缓存项
                const oldestKey = this.memoryCache.keys().next().value;
                this.memoryCache.delete(oldestKey);
            }
            this.memoryCache.set(url, blobUrl);

            // 持久化缓存
            GM_setValue(key, {
                url: url,
                blobUrl: blobUrl,
                timestamp: Date.now()
            });
            this.sessionKeys.add(key);

            debugLog('缓存已存储:', url, '键:', key);
        },

        // 获取缓存
        get: function(url) {
            // 先检查内存缓存
            if (this.memoryCache.has(url)) {
                debugLog('从内存缓存读取:', url);
                return this.memoryCache.get(url);
            }

            // 检查持久化缓存
            const key = this.getCacheKey(url);
            const cached = GM_getValue(key);
            if (cached && cached.url === url) {
                debugLog('从持久化缓存读取:', url);

                // 存入内存缓存以便快速访问
                this.memoryCache.set(url, cached.blobUrl);
                this.sessionKeys.add(key);

                return cached.blobUrl;
            }

            return null;
        },

        // 清理当前会话缓存
        cleanup: function() {
            // 清理内存缓存
            this.memoryCache.clear();

            // 清理持久化缓存
            if (GM_listValues) {
                const allKeys = GM_listValues();
                const currentSession = this.getSessionId();

                allKeys.forEach(key => {
                    if (key.startsWith(CONFIG.CACHE_PREFIX)) {
                        // 清理不属于当前会话的缓存
                        if (!this.sessionKeys.has(key)) {
                            const sessionId = key.split('_')[2];
                            if (sessionId !== currentSession) {
                                GM_deleteValue(key);
                                debugLog('清理过期缓存:', key);
                            }
                        }
                    }
                });
            }

            debugLog('会话缓存已清理');
        },

        // 初始化会话
        init: function() {
            this.cleanup();

            // 页面卸载时清理
            window.addEventListener('beforeunload', () => {
                if (window.self === window.top) {
                    this.cleanup();
                }
            });

            // SPA应用处理
            if (typeof unsafeWindow !== 'undefined' && unsafeWindow.onurlchange === null) {
                unsafeWindow.addEventListener('urlchange', () => {
                    this.cleanup();
                });
            }
        }
    };

    // 判断是否为图片URL
    function isImageUrl(url) {
        return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
    }

    // 判断是否为新浪图片
    function isSinaImage(url) {
        try {
            const domain = new URL(url).hostname;
            return CONFIG.TARGET_DOMAINS.some(d => domain.includes(d));
        } catch {
            return false;
        }
    }

    // 判断是否在白名单域名
    function isWhitelistedDomain() {
        const domain = window.location.hostname;
        return CONFIG.WHITELIST_DOMAINS.some(d => domain.includes(d));
    }

    // 带Referer加载图片
    function loadImageWithReferer(url, callback) {
        // 检查缓存
        const cachedUrl = SessionCache.get(url);
        if (cachedUrl) {
            callback(cachedUrl);
            return;
        }

        debugLog('开始加载图片:', url);

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Referer': CONFIG.REFERER_URL,
                'X-Requested-With': 'XMLHttpRequest'
            },
            responseType: 'blob',
            onload: function(response) {
                if (response.status === 200) {
                    const blobUrl = URL.createObjectURL(response.response);

                    // 存入缓存
                    SessionCache.set(url, blobUrl);

                    debugLog('图片加载成功:', url);
                    callback(blobUrl);
                } else {
                    debugLog('图片加载失败:', url, response.status);
                    callback(null);
                }
            },
            onerror: function(error) {
                debugLog('图片请求错误:', url, error);
                callback(null);
            }
        });
    }

    // 处理直接访问图片的情况
    function handleDirectImageAccess() {
        if (!isImageUrl(location.pathname) || !isSinaImage(location.href)) return;

        debugLog('检测到直接访问新浪图片:', location.href);

        // 停止原始加载
        window.stop();
        document.close();

        // 创建基础页面结构
        const basePage = `
            <!DOCTYPE html>
<html style="background:#f0f2f5;height:100%">
<head>
    <meta charset="utf-8">
    <title>图片查看器</title>
    <style>
        body, html { margin:0; padding:0; height:100%; }
        .container {
            max-width:100%;
            height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            overflow: auto;
            cursor: zoom-in;
        }
        .container.zoomed {
            align-items: flex-start;
            cursor: zoom-out;
        }
        .container.zoomed img {
            max-width: none;
            max-height: none;
            width: auto;
            height: auto;
        }
        img {
            max-width:100%;
            max-height:100%;
            margin:0 auto;
            display:block;
            box-shadow:0 2px 10px rgba(0,0,0,0.1);
            object-fit: contain;
        }
        .error {
            color: #ff4d4f;
            padding: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <img id="refreshedImage" alt="带Referer加载的图片">
    </div>
    <script>
        // 图片点击切换缩放状态
        const container = document.querySelector('.container');
        const img = document.getElementById('refreshedImage');

        // 记录点击时的滚动位置
        let scrollPosition = { left: 0, top: 0 };

        container.addEventListener('click', function(e) {
            // 切换前保存当前滚动位置
            scrollPosition = {
                left: container.scrollLeft,
                top: container.scrollTop
            };

            // 切换缩放状态
            this.classList.toggle('zoomed');

            // 恢复之前的滚动位置
            setTimeout(() => {
                container.scrollTo(scrollPosition);
            }, 0);
        });

        // 保留油猴脚本功能
        if (window._originalGM) {
            window.GM = window._originalGM;
        }
    </script>
</body>
</html>
        `;

        // 写入基本结构
        document.open();
        document.write(basePage);
        document.close();

        // 加载图片
        const img = document.getElementById('refreshedImage');
        loadImageWithReferer(location.href, function(blobUrl) {
            if (blobUrl) {
                img.src = blobUrl;

                // 图片卸载时释放资源
                img.onload = function() {
                    URL.revokeObjectURL(blobUrl);
                };
            } else {
                const container = document.querySelector('.container');
                container.innerHTML = '<div class="error">图片加载失败，请刷新重试</div>';
            }
        });
    }

    // 处理页面中的新浪图片
    function handlePageImages() {
        if (isWhitelistedDomain()) return;

        // 处理现有图片
        document.querySelectorAll('img').forEach(img => {
            processImageElement(img);
        });

        // 监听动态添加的图片
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'IMG') {
                        processImageElement(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('img').forEach(img => {
                            processImageElement(img);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 处理单个图片元素
    function processImageElement(img) {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-original');

        if (!src || !isImageUrl(src) || !isSinaImage(src)) return;

        debugLog('发现新浪图片:', src);

        // 跳过已处理的图片
        if (img.dataset.refererFixed) return;
        img.dataset.refererFixed = 'true';

        // 保存原始src
        const originalSrc = img.src;
        img.dataset.originalSrc = originalSrc;

        // 显示加载中状态
        img.style.opacity = '0.5';
        img.style.transition = 'opacity 0.3s';

        // 替换为带Referer的图片
        loadImageWithReferer(originalSrc, function(blobUrl) {
            if (blobUrl) {
                img.src = blobUrl;
                img.style.opacity = '1';

                // 图片卸载时释放资源
                img.onload = function() {
                    URL.revokeObjectURL(blobUrl);
                };
            } else {
                img.style.opacity = '1';
                img.style.filter = 'grayscale(100%)';
                img.title = '图片加载失败，原始URL: ' + originalSrc;
            }
        });
    }

    // 主函数
    function main() {
        // 初始化会话缓存
        SessionCache.init();

        // 处理直接访问图片的情况
        handleDirectImageAccess();

        // 如果不是直接访问图片，处理页面中的图片
        if (!isImageUrl(location.pathname)) {
            // 延迟执行确保DOM加载
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', handlePageImages);
            } else {
                handlePageImages();
            }
        }
    }

    // 启动脚本
    try {
        // 保存原始GM对象（防止被覆盖）
        if (typeof unsafeWindow !== 'undefined' && !unsafeWindow._originalGM) {
            unsafeWindow._originalGM = unsafeWindow.GM;
        }

        main();
    } catch (e) {
        console.error('[RefererFix] 脚本错误:', e);
    }
})();