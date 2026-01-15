// ==UserScript==
// @name         MediaPlay 缓存优化（增强稳定版）
// @namespace    http://tampermonkey.net/
// @version      2.4.0-rebuild
// @description  基于拦截与预测算法的透明缓存助手。不接管播放器，利用 IndexedDB 持久化，自动识别分片序列进行无感预加载。
// @author       KiwiFruit
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529466/MediaPlay%20%E7%BC%93%E5%AD%98%E4%BC%98%E5%8C%96%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529466/MediaPlay%20%E7%BC%93%E5%AD%98%E4%BC%98%E5%8C%96%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================
    // 1. 配置与核心常量
    // ========================
    const CONFIG = {
        DEBUG: false,
        // 支持的媒体分片扩展名
        MEDIA_EXTENSIONS: /\.(ts|m4s|mp4)(\?.*)?$/i,
        // 最大缓存条目数 (基于 IndexedDB)
        MAX_CACHE_ENTRIES: 100,
        // 预读取深度 (当检测到当前分片时，预先读取后续 N 个)
        PREFETCH_DEPTH: 3,
        // 并发请求数
        MAX_CONCURRENT_PREFETCH: 2,
        // 缓存过期时间 (毫秒)
        CACHE_TTL: 24 * 60 * 60 * 1000 // 24小时
    };

    const DB_NAME = 'SmartMediaCacheDB';
    const STORE_NAME = 'segments';

    // ========================
    // 2. 超前技术：IndexedDB 管理器
    // ========================
    class IDBManager {
        constructor() {
            this.db = null;
            this.initPromise = null;
        }

        async init() {
            if (this.initPromise) return this.initPromise;

            this.initPromise = new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, 1);

                request.onerror = () => reject(new Error('IDB Open Failed'));
                request.onsuccess = (e) => {
                    this.db = e.target.result;
                    resolve(this.db);
                };

                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                };
            });
            return this.initPromise;
        }

        async get(url) {
            if (!this.db) await this.init();
            return new Promise((resolve) => {
                const tx = this.db.transaction([STORE_NAME], 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.get(url);
                req.onsuccess = () => {
                    const record = req.result;
                    if (!record) {
                        resolve(null);
                        return;
                    }
                    // 检查是否过期
                    if (Date.now() - record.timestamp > CONFIG.CACHE_TTL) {
                        this.delete(url).then(() => resolve(null));
                    } else {
                        resolve(record.blob);
                    }
                };
                req.onerror = () => resolve(null);
            });
        }

        async put(url, blob) {
            if (!this.db) await this.init();
            // 检查并清理旧数据 (简单的 LRU 策略)
            await this.cleanup();

            return new Promise((resolve, reject) => {
                const tx = this.db.transaction([STORE_NAME], 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const req = store.put({ url, blob, timestamp: Date.now() });
                req.onsuccess = () => resolve();
                req.onerror = () => reject();
            });
        }

        async delete(url) {
            if (!this.db) return;
            const tx = this.db.transaction([STORE_NAME], 'readwrite');
            tx.objectStore(STORE_NAME).delete(url);
        }

        async cleanup() {
            // 简单的计数清理，防止 IDB 爆炸
            return new Promise((resolve) => {
                const tx = this.db.transaction([STORE_NAME], 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const countReq = store.count();
                countReq.onsuccess = () => {
                    if (countReq.result > CONFIG.MAX_CACHE_ENTRIES) {
                        // 删除最旧的 10%
                        const index = store.index('timestamp');
                        const cursorReq = index.openCursor(null, 'next');
                        let deletedCount = 0;
                        const deleteLimit = Math.floor(CONFIG.MAX_CACHE_ENTRIES * 0.1);

                        cursorReq.onsuccess = (e) => {
                            const cursor = e.target.result;
                            if (cursor && deletedCount < deleteLimit) {
                                cursor.delete();
                                deletedCount++;
                                cursor.continue();
                            } else {
                                resolve();
                            }
                        };
                    } else {
                        resolve();
                    }
                };
            });
        }
    }

    // ========================
    // 3. 智能预测引擎
    // ========================
    class PredictorEngine {
        constructor() {
            this.pendingPrefetches = new Set();
        }

        /**
         * 尝试从当前 URL 推断下一个 URL
         * 支持: segment_0.ts -> segment_1.ts, video-10.m4s -> video-11.m4s
         */
        predictNextUrls(currentUrl, depth = 1) {
            const urls = [];
            // 正则匹配 URL 中的数字
            const match = currentUrl.match(/(.*?)(\d+)(\.\w+)(\?.*)?$/);

            if (!match) return urls;

            const [_, prefix, numStr, ext, query] = match;
            let currentNum = parseInt(numStr, 10);

            for (let i = 1; i <= depth; i++) {
                // 补零逻辑: 如果原数字是 001, 新数字应为 002
                const nextNum = currentNum + i;
                const paddedNum = numStr.startsWith('0') ? String(nextNum).padStart(numStr.length, '0') : String(nextNum);
                const nextUrl = `${prefix}${paddedNum}${ext}${query || ''}`;
                urls.push(nextUrl);
            }
            return urls;
        }

        async triggerPrefetch(targetUrl, signal) {
            if (this.pendingPrefetches.has(targetUrl)) return;

            // 检查 IDB 是否已有
            const cachedBlob = await CacheManager.get(targetUrl);
            if (cachedBlob) {
                console.log(`[Prefetch] Cache HIT: ${targetUrl}`);
                return;
            }

            this.pendingPrefetches.add(targetUrl);
            console.log(`[Prefetch] Fetching: ${targetUrl}`);

            try {
                const res = await fetch(targetUrl, {
                    signal,
                    cache: 'no-store', // 绕过 HTTP 缓存，强制存入我们的 IDB
                    credentials: 'include'
                });

                if (res.ok) {
                    const blob = await res.blob();
                    await CacheManager.put(targetUrl, blob);
                    console.log(`[Prefetch] Cached: ${targetUrl} (${(blob.size / 1024).toFixed(1)}KB)`);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.warn('[Prefetch] Failed', targetUrl, err.message);
                }
            } finally {
                this.pendingPrefetches.delete(targetUrl);
            }
        }
    }

    // ========================
    // 4. 核心缓存管理器
    // ========================
    const idbManager = new IDBManager();
    const predictor = new PredictorEngine();

    const CacheManager = {
        async init() {
            await idbManager.init();
        },
        async get(url) {
            return idbManager.get(url);
        },
        async put(url, blob) {
            return idbManager.put(url, blob);
        }
    };

    // ========================
    // 5. 网络拦截器
    // ========================
    function installInterceptor() {
        const originalFetch = window.fetch;

        window.fetch = async (input, init) => {
            const url = typeof input === 'string' ? input : input.url;

            // 仅拦截媒体分片
            if (!CONFIG.MEDIA_EXTENSIONS.test(url)) {
                return originalFetch(input, init);
            }

            console.log(`[Interceptor] Requesting: ${url}`);

            // 1. 尝试从缓存读取
            const cachedBlob = await CacheManager.get(url);
            if (cachedBlob) {
                console.log(`[Interceptor] Serving from IDB Cache: ${url}`);
                return new Response(cachedBlob, {
                    status: 200,
                    statusText: 'OK',
                    headers: { 'Content-Type': cachedBlob.type || 'video/mp2t' }
                });
            }

            // 2. 缓存未命中，发起网络请求
            const fetchPromise = originalFetch(input, init);

            // 3. 请求成功后，存入缓存 (后台进行，不阻塞返回)
            fetchPromise.then(async (response) => {
                if (!response.ok || response.type === 'opaque') return;

                try {
                    const clone = response.clone();
                    const blob = await clone.blob();
                    await CacheManager.put(url, blob);
                    console.log(`[Interceptor] Cached: ${url}`);

                    // 4. 触发预测预加载
                    const nextUrls = predictor.predictNextUrls(url, CONFIG.PREFETCH_DEPTH);
                    // 创建一个 AbortController 以便页面卸载时取消
                    const controller = new AbortController();
                    window.addEventListener('beforeunload', () => controller.abort(), { once: true });

                    // 限制并发数
                    const chunk = nextUrls.slice(0, CONFIG.MAX_CONCURRENT_PREFETCH);

                    // === 修改点开始 ===
                    // 使用 Promise.allSettled 确保即使某个预取失败，其他的也能继续
                    const results = await Promise.allSettled(chunk.map(u => predictor.triggerPrefetch(u, controller.signal)));

                    // 可选：简单的统计日志
                    const successCount = results.filter(r => r.status === 'fulfilled').length;
                    if (successCount > 0 && CONFIG.DEBUG) {
                        console.log(`[Interceptor] Prefetch batch done: ${successCount}/${results.length} succeeded.`);
                    }
                    // === 修改点结束 ===

                } catch (e) {
                    // 忽略克隆读取错误
                }
            });

            return fetchPromise;
        };
    }

    // ========================
    // 6. 启动逻辑
    // ========================
    (async function bootstrap() {
        try {
            console.log('[MediaPlay] Intelligent Cache Assistant Loaded.');
            await CacheManager.init();
            installInterceptor();

            // 简单的 HUD 指示器 (仅开发模式可见，或作为隐形开关)
            if (CONFIG.DEBUG) {
                const hud = document.createElement('div');
                hud.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.7);color:#0f0;padding:5px;z-index:999999;font-family:monospace;font-size:12px;pointer-events:none;';
                hud.innerText = 'MediaCache: ACTIVE';
                document.documentElement.appendChild(hud);
            }

        } catch (error) {
            console.error('[MediaPlay] Init Failed', error);
        }
    })();

})();