// ==UserScript==
// @name            绯月校验保存补充
// @version         1.3
// @icon            https://gitee.com/miaolapd/KF_Online_Assistant/raw/master/icon.png
// @description     保存绯月的帖子和用户校验值到本地，并且在需要时补充
// @include         https://*kfpromax.com/*
// @include         https://*9shenmi.com/*
// @include         https://*kfmax.com/*
// @include         https://*bakabbs.com/*
// @include         https://*365gal.com/*
// @include         https://*365galgame.com/*
// @include         https://*fygal.com/*
// @namespace       https://greasyfork.org/users/1143233
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/525656/%E7%BB%AF%E6%9C%88%E6%A0%A1%E9%AA%8C%E4%BF%9D%E5%AD%98%E8%A1%A5%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/525656/%E7%BB%AF%E6%9C%88%E6%A0%A1%E9%AA%8C%E4%BF%9D%E5%AD%98%E8%A1%A5%E5%85%85.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let db;
    let isProcessing = false;

    // 初始化 IndexedDB
    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ForumLinkParserDB', 1);
            request.onerror = reject;
            request.onsuccess = e => {
                db = e.target.result;
                resolve();
            };
            request.onupgradeneeded = e => {
                db = e.target.result;
                db.createObjectStore('linkCache', { keyPath: 'id' });
            };
        });
    }

    // 从 IndexedDB 获取或存储缓存项
    function dbOperation(storeName, mode, action, data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], mode);
            const store = transaction.objectStore(storeName);
            const request = action === 'get' ? store.get(data) : store.put(data);
            request.onerror = reject;
            request.onsuccess = e => resolve(e.target.result);
        });
    }

    // 处理 URL，提取 id 和 sf
    function processUrl(url, needSf = true) {
        try {
            const params = new URLSearchParams(url.search);
            const paramEntries = Array.from(params.entries());
            let results = [];

            // 遍历参数，查找tid/uid及其对应的sf
            for (let i = 0; i < paramEntries.length; i++) {
                const [key, value] = paramEntries[i];

                if (key === 'tid' && value) {
                    // 查找下一个sf参数
                    const sfEntry = paramEntries.slice(i + 1).find(([k]) => k === 'sf');
                    if (!needSf || sfEntry) {
                        results.push({
                            id: 't' + value,
                            sf: sfEntry ? sfEntry[1] : null
                        });
                    }
                } else if (key === 'uid' && value && value !== 'null' && value !== '') {
                    // 查找下一个sf参数
                    const sfEntry = paramEntries.slice(i + 1).find(([k]) => k === 'sf');
                    if (!needSf || sfEntry) {
                        results.push({
                            id: 'u' + value,
                            sf: sfEntry ? sfEntry[1] : null
                        });
                    }
                }
            }

            return results;
        } catch (error) {
            console.error('Error processing URL:', error);
            return [];
        }
    }

    // 检查当前URL并在必要时补充sf参数
    async function checkCurrentUrl() {
        try {
            const currentUrl = new URL(window.location.href);
            if (currentUrl.searchParams.has('sf')) return;

            const results = processUrl(currentUrl, false);
            for (const result of results) {
                const cacheItem = await dbOperation('linkCache', 'readonly', 'get', result.id);
                if (cacheItem?.sf) {
                    // 在对应的tid或uid后添加sf参数
                    const params = new URLSearchParams(currentUrl.search);
                    const paramEntries = Array.from(params.entries());
                    const newParams = new URLSearchParams();

                    for (const [key, value] of paramEntries) {
                        newParams.append(key, value);
                        if ((key === 'tid' && result.id.startsWith('t')) ||
                            (key === 'uid' && result.id.startsWith('u'))) {
                            newParams.append('sf', cacheItem.sf);
                        }
                    }

                    currentUrl.search = newParams.toString();
                    console.log('[校验补充] 当前页面补充校验参数，准备跳转');
                    window.location.href = currentUrl.href;
                    break;
                }
            }
        } catch (error) {
            console.error('Error checking current URL:', error);
        }
    }

    async function parseLinks() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            const links = document.getElementsByTagName('a');
            const newData = new Map();
            let addedCount = 0;

            // 第一步：收集有 sf 的链接数据
            for (const link of links) {
                const href = link.getAttribute('href');
                if (!href) continue;

                try {
                    const url = new URL(href, window.location.origin);
                    const results = processUrl(url);
                    for (const result of results) {
                        if (result.sf) {
                            newData.set(result.id, result.sf);
                        }
                    }
                } catch {
                    continue;
                }
            }

            // 第二步：存储新数据（仅当sf值不同时更新）
            for (const [id, sf] of newData) {
                const existing = await dbOperation('linkCache', 'readonly', 'get', id);
                if (!existing || existing.sf !== sf) {
                    await dbOperation('linkCache', 'readwrite', 'put', { id, sf });
                    addedCount++;
                }
            }

            if (addedCount > 0) {
                console.log(`[校验补充] 新增了 ${addedCount} 条校验数据`);
            }

            // 第三步：补充没有 sf 的链接
            for (const link of links) {
                const href = link.getAttribute('href');
                if (!href) continue;

                try {
                    const url = new URL(href, window.location.origin);
                    if (url.searchParams.has('sf')) continue;

                    const results = processUrl(url, false);
                    for (const result of results) {
                        const cacheItem = await dbOperation('linkCache', 'readonly', 'get', result.id);
                        if (cacheItem?.sf) {
                            // 在对应的tid或uid后添加sf参数
                            const params = new URLSearchParams(url.search);
                            const paramEntries = Array.from(params.entries());
                            const newParams = new URLSearchParams();

                            for (const [key, value] of paramEntries) {
                                newParams.append(key, value);
                                if ((key === 'tid' && result.id.startsWith('t')) ||
                                    (key === 'uid' && result.id.startsWith('u'))) {
                                    newParams.append('sf', cacheItem.sf);
                                }
                            }

                            url.search = newParams.toString();
                            link.setAttribute('href', url.href);
                            break;
                        }
                    }
                } catch {
                    continue;
                }
            }
        } finally {
            isProcessing = false;
        }
    }

    try {
        await initDB();

        // 先检查当前URL
        await checkCurrentUrl();

        // 然后处理页面链接
        await parseLinks();

        // 使用防抖包装 parseLinks
        let timeout;
        const observer = new MutationObserver(() => {
            clearTimeout(timeout);
            timeout = setTimeout(parseLinks, 250);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } catch (error) {
        console.error('Initialization error:', error);
    }
})();