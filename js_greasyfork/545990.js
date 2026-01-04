// ==UserScript==
// @name         Pixiv 推送识别器（增强修复版）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在 Pixiv 上标记作品为“新推送”或“已查看”，并统计被推荐次数，支持动态加载。
// @author       Flycat
// @match        https://www.pixiv.net/*
// @grant        none
// @run-at       document-idle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/545990/Pixiv%20%E6%8E%A8%E9%80%81%E8%AF%86%E5%88%AB%E5%99%A8%EF%BC%88%E5%A2%9E%E5%BC%BA%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545990/Pixiv%20%E6%8E%A8%E9%80%81%E8%AF%86%E5%88%AB%E5%99%A8%EF%BC%88%E5%A2%9E%E5%BC%BA%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'pixiv_push_history';
    const PROCESSED_MARKER = 'pixiv-push-identifier-processed';

    function loadHistory() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    }

    function saveHistory(history) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }

    function extractArtworkId(url) {
        if (!url) return null;
        // 匹配artworks、novels路径、novel/show.php、novel/series和novel/works格式
        const match = url.match(/(?:artworks|novels|novel\/series|novel\/works)\/(\d+)|novel\/show\.php\?id=(\d+)/);
        if (!match) {
            console.log(`[Pixiv 推送识别器] 无法提取作品ID: ${url}`);
            return null;
        }
        // 返回第一个非null的捕获组
        return match[1] || match[2];
    }

    function markArtwork(element, count) {
        const tag = document.createElement('span');
        const isNew = count === 1;

        tag.style.cssText = `
            background: ${isNew ? '#1e90ff' : '#0055aa'} !important;
            color: white !important;
            padding: 2px 6px !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            border-radius: 4px !important;
            margin-left: 6px !important;
            line-height: 1.2 !important;
            text-transform: none !important;
            font-family: "Arial", "Microsoft YaHei", sans-serif !important;
            display: inline-block !important;
        `;

        tag.textContent = isNew ? '新推送' : `×${count}`;

        // 尝试找到作者名元素并将标签添加到其后
        let authorElement = element.querySelector('a[href*="/users/"]');
        if (!authorElement) {
            // 如果找不到作者元素，回退到原始的左上角显示方式
            element.style.position = 'relative';
            tag.style.position = 'absolute';
            tag.style.top = '6px';
            tag.style.left = '6px';
            tag.style.zIndex = '9999';
            tag.style.pointerEvents = 'none';
            tag.style.boxShadow = '0 2px 6px rgba(0,0,0,0.6)';
            element.appendChild(tag);
        } else {
            authorElement.parentNode.insertBefore(tag, authorElement.nextSibling);
        }
    }

    function processPage() {
        console.log("[Pixiv 推送识别器] 正在处理作品...");
        const history = loadHistory();
        let updated = false;
        let processedCount = 0;
        let novelCount = 0;

        // 同时选择artworks、novels链接、novel/show.php、novel/series和novel/works格式链接
        const linkElements = document.querySelectorAll('a[href*="/artworks/"] , a[href*="/novels/"] , a[href*="/novel/show.php?id="] , a[href*="/novel/series/"] , a[href*="/novel/works/"]');

        linkElements.forEach(linkElement => {
            const url = linkElement.getAttribute('href');
            const id = extractArtworkId(url);
            if (!id) return;

            // 检查是否为小说链接
            const isNovel = url.includes('/novels/') || url.includes('/novel/series/') || url.includes('/novel/show.php?id=') || url.includes('/novel/works/');
            if (isNovel) {
                novelCount++;
            }

            // 改进容器选择逻辑，适应不同的DOM结构
            let container = linkElement.closest('li.sc-9111aad9-0, li.PKpFw, li.sc-b65871b3-0, li.sc-aaf7f564-1, li.fUhAWv, li');
            if (!container) container = linkElement.closest('div.sc-b65871b3-0, div.sc-b83eae98-0, div');
            if (!container) container = linkElement.closest('article');
            if (!container) container = linkElement.closest('figure');
            if (!container || container.classList.contains(PROCESSED_MARKER)) return;
            container.classList.add(PROCESSED_MARKER);
            processedCount++;

            let title = '';
            // 改进标题获取逻辑，尝试多种方式
            const img = container.querySelector('img[alt]');
            if (img) {
                title = img.getAttribute('alt');
            } else {
                const titleEl = container.querySelector('h2, h3, .title');
                if (titleEl) title = titleEl.textContent;
                else title = '未命名作品';
            }

            if (history[id]) {
                history[id].count += 1;
                history[id].lastSeen = new Date().toISOString();
            } else {
                history[id] = {
                    title: title,
                    count: 1,
                    firstSeen: new Date().toISOString()
                };
            }

            markArtwork(container, history[id].count);
            updated = true;
        });

        if (updated) {
            saveHistory(history);
        }

        console.log(`[Pixiv 推送识别器] 处理完成: 共处理 ${processedCount} 个作品, 其中小说 ${novelCount} 个`);
    }

    const observer = new MutationObserver(mutationsList => {
        let found = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                found = true;
                break;
            }
        }
        if (found) {
            clearTimeout(observer._debounce);
            observer._debounce = setTimeout(processPage, 500);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(processPage, 1000);
})();
