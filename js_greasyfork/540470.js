// ==UserScript==
// @name       点击网址链接变色 Persistent Red Link
// @namespace   http://tampermonkey.net/
// @match       *://*/*
// @grant       市政502
// @version      2025.7.4
// @description   zh-cn
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/540470/%E7%82%B9%E5%87%BB%E7%BD%91%E5%9D%80%E9%93%BE%E6%8E%A5%E5%8F%98%E8%89%B2%20Persistent%20Red%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/540470/%E7%82%B9%E5%87%BB%E7%BD%91%E5%9D%80%E9%93%BE%E6%8E%A5%E5%8F%98%E8%89%B2%20Persistent%20Red%20Link.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 存储配置
    const STORAGE_KEY = 'visitedLinks_v3';
    const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB安全阈值
    const SAVE_INTERVAL = 30000; // 30秒定期保存
    const DEBOUNCE_DELAY = 1000; // 1秒防抖

    // 内存数据结构
    let visitedLinks = new Set();
    let pendingChanges = new Set(); // 待保存的变更集
    let saveTimeout = null;

    // 初始化存储
    function initStorage() {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const parsed = JSON.parse(storedData);
                if (Array.isArray(parsed)) {
                    for (const url of parsed) {
                        visitedLinks.add(url);
                    }
                }
            }
        } catch (e) {
            console.warn('存储解析失败，使用空集合初始化');
            visitedLinks = new Set();
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    // 智能保存策略
    function scheduleSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(persistStorage, DEBOUNCE_DELAY);
    }

    // 核心持久化方法
    function persistStorage() {
        try {
            // 合并变更
            for (const url of pendingChanges) {
                visitedLinks.add(url);
            }
            pendingChanges.clear();

            // 数据压缩
            const compressed = compressData(Array.from(visitedLinks));

            // 存储前检查空间
            if (compressed.length > MAX_STORAGE_SIZE - 1024) { // 保留1KB缓冲
                handleStorageOverflow();
                return;
            }

            localStorage.setItem(STORAGE_KEY, compressed);
            console.debug('成功保存', visitedLinks.size, '条记录');
        } catch (e) {
            handleStorageError(e);
        }
    }

    // 数据压缩算法
    function compressData(urls) {
        // 实现简单去重+排序压缩
        return JSON.stringify(urls.sort());
    }

    // 存储空间不足处理
    function handleStorageOverflow() {
        const currentSize = localStorage.getItem(STORAGE_KEY)?.length || 0;
        console.warn(`存储空间不足: 当前使用 ${currentSize} 字节，建议清理缓存`);

        // 尝试删除旧数据（示例策略：保留最近10000条）
        if (visitedLinks.size > 10000) {
            const newSet = Array.from(visitedLinks).slice(-10000);
            visitedLinks = new Set(newSet);
            pendingChanges.clear();
            scheduleSave();
        }
    }

    // 存储错误处理
    function handleStorageError(error) {
        if ((error.name === 'QuotaExceededError' || error.code === 22)) {
            alert('存储空间不足，请清理浏览器缓存');
        } else {
            console.error('存储异常:', error);
        }
    }

    // 链接处理核心逻辑
    function handleLink(link) {
        const linkUrl = link.href;

        if (visitedLinks.has(linkUrl)) {
            applyVisitedStyle(link);
            return;
        }

        link.addEventListener('click', () => {
            if (!visitedLinks.has(linkUrl)) {
                pendingChanges.add(linkUrl);
                applyVisitedStyle(link);
                scheduleSave();
            }
        });
    }

    // 样式应用
    function applyVisitedStyle(link) {
        link.style.setProperty('color', '#FF0000', 'important');
    }

    // 初始处理
    function initializePage() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (visitedLinks.has(link.href)) {
                applyVisitedStyle(link);
            }
            handleLink(link);
        });
    }

    // 动态内容监控
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const links = node.querySelectorAll('a');
                    links.forEach(link => {
                        handleLink(link);
                        if (visitedLinks.has(link.href)) {
                            applyVisitedStyle(link);
                        }
                    });
                }
            });
        });
    });

    // 初始化流程
    (function init() {
        initStorage();
        initializePage();
        observer.observe(document.body, { childList: true, subtree: true });

        // 定期保存
        setInterval(persistStorage, SAVE_INTERVAL);

        // 页面卸载时保存
        window.addEventListener('beforeunload', persistStorage);
    })();

})();