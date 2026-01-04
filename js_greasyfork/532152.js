// ==UserScript==
// @name         妖火获取帖子完整标题
// @namespace    https://www.yaohuo.me
// @version      1.0.1
// @description  替换妖火论坛首页的帖子标题为完整标题
// @author       3iXi
// @match        https://www.yaohuo.me/*
// @icon         https://www.yaohuo.me/css/favicon.ico
// @license      Apache 2
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532152/%E5%A6%96%E7%81%AB%E8%8E%B7%E5%8F%96%E5%B8%96%E5%AD%90%E5%AE%8C%E6%95%B4%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/532152/%E5%A6%96%E7%81%AB%E8%8E%B7%E5%8F%96%E5%B8%96%E5%AD%90%E5%AE%8C%E6%95%B4%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LIST_SELECTOR = 'div.list';
    const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 缓存有效期：7天

    // 获取缓存数据
    function getCache() {
        return GM_getValue('titleCache', {});
    }

    // 保存缓存数据
    function saveCache(cache) {
        GM_setValue('titleCache', cache);
    }

    // 清理过期缓存
    function cleanExpiredCache() {
        const cache = getCache();
        const now = Date.now();

        Object.keys(cache).forEach(id => {
            if (now - cache[id].timestamp > CACHE_EXPIRY) {
                delete cache[id];
            }
        });

        saveCache(cache);
    }

    // 从URL获取帖子ID
    function getPostIdFromUrl(url) {
        const match = url.match(/\/bbs-(\d+)\.html/);
        return match ? match[1] : null;
    }

    // 获取帖子完整标题
    function fetchFullTitle(postId) {
        return new Promise((resolve, reject) => {
            const url = `https://www.yaohuo.me/bbs/Book_View_admin.aspx?id=${postId}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const contentDiv = doc.querySelector('div.content');

                    if (contentDiv) {
                        // 查找标题元素
                        const titleElem = contentDiv.querySelector('a[href^="/bbs-"]');
                        if (titleElem) {
                            resolve(titleElem.textContent.trim());
                        } else {
                            reject('未找到标题元素');
                        }
                    } else {
                        reject('未找到内容区域');
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 处理帖子列表
    async function processPostList() {
        const listDiv = document.querySelector(LIST_SELECTOR);
        if (!listDiv) return;

        const cache = getCache();
        const now = Date.now();
        const links = listDiv.querySelectorAll('a[href^="/bbs-"]');
        const pendingFetches = [];

        // 收集需要获取标题的帖子
        for (const link of links) {
            const postId = getPostIdFromUrl(link.href);
            if (!postId) continue;

            const cachedData = cache[postId];
            if (cachedData && now - cachedData.timestamp < CACHE_EXPIRY) {
                // 从缓存中更新标题
                link.textContent = cachedData.title;
            } else {
                // 需要获取新标题
                pendingFetches.push({ link, postId });
            }
        }

        // 按顺序获取帖子标题（避免并发请求过多）
        for (const { link, postId } of pendingFetches) {
            try {
                const fullTitle = await fetchFullTitle(postId);
                link.textContent = fullTitle;

                // 更新缓存
                cache[postId] = {
                    title: fullTitle,
                    timestamp: Date.now()
                };
                saveCache(cache);

                // 小延迟避免请求过快
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (error) {
                console.error(`获取帖子 ${postId} 标题失败:`, error);
            }
        }
    }

    // 启动脚本
    function init() {
        // 清理过期缓存
        cleanExpiredCache();

        // 处理帖子列表
        processPostList();
    }

    // 延迟启动，确保页面已完全加载
    setTimeout(init, 100);
})();