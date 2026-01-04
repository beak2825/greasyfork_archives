// ==UserScript==
// @name        web小说机翻站跳转 (增强版)
// @version     1.40
// @description Kakuyomu和Syosetu书签列表跳转, 并为多个小说网站添加机翻站跳转按钮至n.novelia.cc
// @author      wtyrambo
// @match       https://kakuyomu.jp/my/antenna/works/all*
// @match       https://syosetu.com/favnovelmain/list*
// @match       https://syosetu.com/favnovelmain18/list*
// @match       https://ncode.syosetu.com/favnovelmain/list*
// @match       https://novel18.syosetu.com/favnovelmain/list*
// @match       https://novel18.syosetu.com/*
// @match       https://ncode.syosetu.com/*
// @match       https://pixiv.net/novel/series/*
// @match       https://pixiv.net/novel/show.php?id=*
// @match       https://www.alphapolis.co.jp/novel/*
// @match       https://kakuyomu.jp/works/*
// @match       https://novelup.plus/story/*
// @match       https://syosetu.org/novel/*
// @match       https://novelism.jp/novel/*
// @grant       none
// @namespace https://greasyfork.org/users/1019438
// @downloadURL https://update.greasyfork.org/scripts/530924/web%E5%B0%8F%E8%AF%B4%E6%9C%BA%E7%BF%BB%E7%AB%99%E8%B7%B3%E8%BD%AC%20%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530924/web%E5%B0%8F%E8%AF%B4%E6%9C%BA%E7%BF%BB%E7%AB%99%E8%B7%B3%E8%BD%AC%20%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHostname = window.location.hostname;
    const currentPath = window.location.pathname;
    const currentURL = window.location.href;

    // --- 功能1: 修改列表页面的链接 (来自原脚本1) ---
    const listLinkReplacementText = 'NTR'; // 列表页链接替换文本

    // Kakuyomu 列表页逻辑
    if (currentHostname === 'kakuyomu.jp' && currentPath.startsWith('/my/antenna/works/all')) {
        const targetClassNameK = 'widget-antennaList-continueReading';
        const newBaseURLK = 'https://n.novelia.cc/novel/kakuyomu/';
        const continueReadingLinksK = document.querySelectorAll(`a.${targetClassNameK}`);

        continueReadingLinksK.forEach(link => {
            const originalHref = link.getAttribute('href');
            if (originalHref && originalHref.includes('/works/') && originalHref.includes('/resume_reading')) {
                const parts = originalHref.split('/');
                const workIdIndex = parts.indexOf('works');
                if (workIdIndex !== -1 && workIdIndex + 1 < parts.length) {
                    const workId = parts[workIdIndex + 1];
                    const newHref = `${newBaseURLK}${workId}`;
                    link.setAttribute('href', newHref);
                    const spanElement = link.querySelector('span');
                    if (spanElement) {
                        spanElement.textContent = listLinkReplacementText;
                    }
                }
            }
        });
    }
    // Syosetu 列表页逻辑 (包括 ncode 和 novel18 的 favnovelmain)
    else if (currentHostname.includes('syosetu.com') &&
             (currentPath.startsWith('/favnovelmain/list') || currentPath.startsWith('/favnovelmain18/list'))) {
        const targetClassNameS = 'p-up-bookmark-item__button';
        const requiredClass2 = 'c-button--primary';
        const newBaseURLS = 'https://n.novelia.cc/novel/syosetu/';
        const bookmarkLinksS = document.querySelectorAll(`a.${targetClassNameS}.${requiredClass2}`);

        bookmarkLinksS.forEach(link => {
            const originalHref = link.getAttribute('href');
            if (!originalHref) return;

            const urlMatch = originalHref.match(/syosetu\.com\/([^\/]+)/);
            if (urlMatch && urlMatch[1]) {
                const novelId = urlMatch[1];
                if (/^n\d+[a-zA-Z]+$/.test(novelId) || /^[a-zA-Z]+\d+$/.test(novelId) || /^[a-zA-Z]{2}\d+[a-zA-Z]{2}$/.test(novelId) ) { // 更通用的 syosetu ID 匹配
                    const newHref = `${newBaseURLS}${novelId}`;
                    link.setAttribute('href', newHref);

                    const unreadSpan = link.querySelector('span.p-up-bookmark-item__unread');
                    if (unreadSpan) {
                        unreadSpan.remove();
                    }

                    const linkText = link.textContent.trim();
                    const chapterPattern = /^ep\.\d+$/;
                    const readFromStartText = '最初から読む';

                    if (chapterPattern.test(linkText) || linkText === readFromStartText) {
                        link.textContent = listLinkReplacementText;
                    }
                }
            }
        });
    }

    // --- 功能2: 在小说内容页面添加跳转按钮 (来自原脚本2) ---
    const providers = {
        kakuyomu: (url) => /kakuyomu\.jp\/works\/([0-9]+)/.exec(url)?.[1],
        syosetu: (url) => {
            // ncode.syosetu.com/n1234ab/ or novel18.syosetu.com/n1234ab/
            let novelId = /(?:ncode|novel18)\.syosetu\.com\/([a-zA-Z0-9]+)\//.exec(url)?.[1];
            if (!novelId) { // syosetu.com/novelid/ (可能不常用，但兼容)
                novelId = /syosetu\.com\/([a-zA-Z0-9]+)\//.exec(url)?.[1];
            }
            return novelId?.toLowerCase();
        },
        novelup: (url) => /novelup\.plus\/story\/([0-9]+)/.exec(url)?.[1],
        hameln: (url) => /syosetu\.org\/novel\/([0-9]+)/.exec(url)?.[1], // syosetu.org is often referred to as Hameln
        pixiv: (url) => {
            let novelId = /pixiv\.net\/novel\/series\/([0-9]+)/.exec(url)?.[1];
            if (novelId === undefined) {
                novelId = /pixiv\.net\/novel\/show\.php\?id=([0-9]+)/.exec(url)?.[1];
                if (novelId !== undefined) {
                    novelId = 's' + novelId; // Prepend 's' for single stories to distinguish in fishhawk if needed, or fishhawk handles it
                }
            }
            return novelId;
        },
        alphapolis: (url) => {
            const matched = /www\.alphapolis\.co\.jp\/novel\/([0-9]+)\/([0-9]+)/.exec(url);
            if (matched) {
                return `${matched[1]}-${matched[2]}`;
            }
            // Handle series pages like https://www.alphapolis.co.jp/novel/somenumber
            const seriesMatch = /www\.alphapolis\.co\.jp\/novel\/([0-9]+)$/.exec(url);
            if(seriesMatch && !url.includes('/episode/')) { // check if it's not an episode page
                 const parts = url.split('/');
                 const lastPart = parts[parts.length -1];
                 if (/^\d+$/.test(lastPart) && !/^\d+\/\d+$/.test(parts[parts.length-2] + '/' + lastPart)) {
                     return lastPart; // Assuming this is the series ID for pages like /novel/SERIES_ID
                 }
            }
            return undefined;
        },
        novelism: (url) => /novelism\.jp\/novel\/([^\/]+)/.exec(url)?.[1],
    };

    let novelIdForButton;
    let providerKeyForButton;

    for (const pKey in providers) {
        const id = providers[pKey](currentURL);
        if (id) {
            novelIdForButton = id;
            providerKeyForButton = pKey;
            break;
        }
    }

    // 只有当成功提取到 novelId 并且当前页面不是脚本1处理的列表页时，才添加按钮
    if (novelIdForButton && providerKeyForButton) {
        const isListPageHandledByScript1 =
            (currentHostname === 'kakuyomu.jp' && currentPath.startsWith('/my/antenna/works/all')) ||
            (currentHostname.includes('syosetu.com') &&
             (currentPath.startsWith('/favnovelmain/list') || currentPath.startsWith('/favnovelmain18/list')));

        if (!isListPageHandledByScript1) {
            const toTopBtn = document.createElement('button');
            toTopBtn.innerHTML = "跳转";
            toTopBtn.className = "merged-fishhawk-redirect-button"; // 使用一个唯一的类名
            toTopBtn.onclick = function () {
                window.location.href = `https://n.novelia.cc/novel/${providerKeyForButton}/${novelIdForButton}`;
            };

            const style = document.createElement('style');
            style.id = "merged-fishhawk-redirect-style";
            const css = `
                .merged-fishhawk-redirect-button {
                    position: fixed;
                    bottom: 80%; /* 原脚本2的位置，可以调整 */
                    right: 80%;  /* 调整了right值，原先85%太靠左了 */
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    font-size: 16px; /* 稍微调大字体 */
                    background-color: #4CAF50; /* 按钮颜色 */
                    color: white;
                    border: none;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    z-index: 9999; /* 确保在最上层 */
                    cursor: pointer;
                    overflow: hidden; /* 这个可能不需要，取决于文本内容 */
                    display: flex; /* 用于居中文本 */
                    align-items: center; /* 用于居中文本 */
                    justify-content: center; /* 用于居中文本 */
					opacity: 0.85;
					transition: opacity 0.3s ease;
                }
                .merged-fishhawk-redirect-button:hover {
                    background-color: #0056b3;
                }`;

            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            document.body.appendChild(toTopBtn);
            document.head.appendChild(style); // 将style添加到head中更规范
        }
    }
})();