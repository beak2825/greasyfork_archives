// ==UserScript==
// @name         Pixiv 推送识别器（增强修复版）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在 Pixiv 上标记作品为“新推送”或“已查看”，并统计被推荐次数，支持动态加载。
// @author       Gemini
// @match        https://www.pixiv.net/*
// @grant        none
// @run-at       document-idle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/542444/Pixiv%20%E6%8E%A8%E9%80%81%E8%AF%86%E5%88%AB%E5%99%A8%EF%BC%88%E5%A2%9E%E5%BC%BA%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542444/Pixiv%20%E6%8E%A8%E9%80%81%E8%AF%86%E5%88%AB%E5%99%A8%EF%BC%88%E5%A2%9E%E5%BC%BA%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
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
        const match = url.match(/artworks\/(\d+)/);
        return match ? match[1] : null;
    }

    function markArtwork(element, count) {
        const tag = document.createElement('span');
        const isNew = count === 1;

        tag.style.cssText = `
            position: absolute !important;
            top: 6px !important;
            left: 6px !important;
            background: ${isNew ? '#1e90ff' : '#0055aa'} !important;
            color: white !important;
            padding: 4px 10px !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            border-radius: 6px !important;
            z-index: 9999 !important;
            pointer-events: none !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.6) !important;
            line-height: 1.2 !important;
            text-transform: none !important;
            font-family: "Arial", "Microsoft YaHei", sans-serif !important;
        `;

        tag.textContent = isNew ? '新推送' : `已推送 ×${count}`;
        element.style.position = 'relative';
        element.appendChild(tag);
    }

    function processPage() {
        console.log("[Pixiv 推送识别器] 正在处理作品...");
        const history = loadHistory();
        let updated = false;

        const linkElements = document.querySelectorAll('a[href*="/artworks/"]');

        linkElements.forEach(linkElement => {
            const id = extractArtworkId(linkElement.getAttribute('href'));
            if (!id) return;

            const container = linkElement.closest('li') || linkElement.closest('div');
            if (!container || container.classList.contains(PROCESSED_MARKER)) return;
            container.classList.add(PROCESSED_MARKER);

            let title = '';
            const img = container.querySelector('img[alt]');
            if (img) {
                title = img.getAttribute('alt');
            } else {
                const titleEl = container.querySelector('h2');
                if (titleEl) title = titleEl.textContent;
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
