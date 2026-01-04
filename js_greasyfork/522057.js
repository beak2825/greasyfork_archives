// ==UserScript==
// @name               Remove YouTube Shorts
// @name:zh-CN         移除 YouTube Shorts
// @name:zh-TW         移除 YouTube Shorts
// @name:ja            YouTube の Shorts を削除
// @name:ko            YouTube Shorts 제거
// @name:es            Eliminar YouTube Shorts
// @name:pt-BR         Remover YouTube Shorts
// @name:ru            Удалить YouTube Shorts
// @name:id            Hapus YouTube Shorts
// @name:hi            YouTube Shorts हटाएँ
// @namespace          https://github.com/strangeZombies
// @version            2025.4.4.0
// @description        Remove YouTube Shorts tags, dismissible elements, Shorts links, and Reel Shelf
// @description:zh-CN  移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf
// @description:zh-TW  移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf
// @description:ja     YouTube 上の Shorts タグ、ディスミッシブル要素、Shorts リンク、および Reel Shelf を削除
// @description:ko     YouTube의 Shorts 태그, 해제 가능한 요소, Shorts 링크 및 Reel 선반 제거
// @description:es     Eliminar etiquetas de Shorts de YouTube, elementos desechables, enlaces de Shorts y estante de carretes
// @description:pt-BR  Remover tags de Shorts do YouTube, elementos descartáveis, links de Shorts e prateleira de rolos
// @description:ru     Удалите теги YouTube Shorts, элементы, которые можно отклонить, ссылки на Shorts и полку с катушками
// @description:id     Hapus tag Shorts YouTube, elemen yang dapat dihapus, tautan Shorts, dan Rak Reel
// @description:hi     YouTube Shorts टैग, खारिज करने योग्य तत्व, Shorts लिंक और Reel Shelf निकालें
// @author             StrangeZombies
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match              https://*.youtube.com/*
// @match              https://m.youtube.com/*
// @grant              none
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/522057/Remove%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/522057/Remove%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置项
    const hideHistoryShorts = false; // 是否移除历史记录中的 Shorts 元素
    const debug = false; // 启用调试模式

    // 通用选择器
    const commonSelectors = [
        'a[href*="/shorts/"]',
        '[is-shorts]',
        'yt-chip-cloud-chip-renderer:has(a[href*="/shorts/"])',
        'ytd-reel-shelf-renderer',
        'ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]',
        '#guide [title="Shorts"]',
        '.ytd-mini-guide-entry-renderer[title="Shorts"]',
        '.ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    ];

    // 移动端选择器
    const mobileSelectors = [
        '.pivot-shorts',
        'ytm-reel-shelf-renderer',
        'ytm-search ytm-video-with-context-renderer [data-style="SHORTS"]',
    ];

    // 特定页面选择器
    const feedSelectors = [
        'ytd-browse[page-subtype="subscriptions"] ytd-grid-video-renderer [overlay-style="SHORTS"]',
        'ytd-browse[page-subtype="subscriptions"] ytd-video-renderer [overlay-style="SHORTS"]',
        'ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer [overlay-style="SHORTS"]',
    ];
    const channelSelectors = ['yt-tab-shape[tab-title="Shorts"]'];
    const historySelectors = ['ytd-browse[page-subtype="history"] ytd-reel-shelf-renderer'];

    // 移除 Shorts 元素的函数
    function removeElementsBySelectors(selectors) {
        selectors.forEach((selector) => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element) => {
                    if (element.dataset.removedByScript) return; // 跳过已处理的元素
                    let parent = element.closest(
                        'ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer, ytm-video-with-context-renderer'
                    );
                    if (!parent) parent = element;
                    parent.remove();
                    parent.dataset.removedByScript = 'true'; // 标记为已处理
                    if (debug) console.log(`Removed element: ${parent}`);
                });
            } catch (error) {
                if (debug) console.warn(`Error processing selector: ${selector}`, error);
            }
        });
    }

    // 根据 URL 定位要处理的选择器
    function removeElements() {
        const currentUrl = window.location.href;
        if (debug) console.log('Current URL:', currentUrl);

        if (currentUrl.includes('m.youtube.com')) {
            removeElementsBySelectors(mobileSelectors);
        }
        if (currentUrl.includes('/feed/subscriptions')) {
            removeElementsBySelectors(feedSelectors);
        }
        // 需要重新做，因为会多删除，还有其它bug在其它部分，还没来得及搞，能用就行
        //if (currentUrl.includes('/channel') || currentUrl.includes('/@')) {
        //    removeElementsBySelectors(channelSelectors);
        //}
        if (hideHistoryShorts && currentUrl.includes('/feed/history')) {
            removeElementsBySelectors(historySelectors);
        }

        // 通用选择器适用于所有页面
        removeElementsBySelectors(commonSelectors);
    }

    // 防抖函数
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const debouncedRemoveElements = debounce(removeElements, 300);

    // 初始化脚本
    function init() {
        if (debug) console.log('Remove YouTube Shorts script activated');
        removeElements(); // 初次加载时执行清理

        // 跨浏览器支持的导航事件
        const isFirefox = navigator.userAgent.includes('Firefox');
        if (isFirefox) {
            // Firefox 使用 popstate 监听导航变化
            window.addEventListener('popstate', removeElements);
        } else {
            // Chrome 使用 yt-navigate 事件
            document.addEventListener('yt-navigate-finish', removeElements);
        }

        // 监听 DOM 变化
        const observer = new MutationObserver(debouncedRemoveElements);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 等待 DOM 完全加载后初始化脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

//const selectors = [
//    https://gist.github.com/sumonst21/1779307b807509488d1a915d2bd370bd
//    '[is-shorts]', // YT Homepage - Hide the Shorts section
//    '#guide [title="Shorts"]', // YT Menu - Hide the Shorts button
//    '.ytd-mini-guide-entry-renderer[title="Shorts"]', // YT Menu - Hide the Shorts button
//    'ytd-search ytd-video-renderer [overlay-style="SHORTS"]:upward(ytd-video-renderer)', // YT Search - Hide Shorts
//    'ytd-reel-shelf-renderer',
//    'ytd-browse[page-subtype="channels"] [role="tab"]:nth-of-type(3):has-text(Shorts)', // YT Channels - Hide the Shorts tab
//    'ytd-browse[page-subtype="subscriptions"] ytd-grid-video-renderer [overlay-style="SHORTS"]:upward(ytd-grid-video-renderer)', // YT Subscriptions - Hide Shorts - Grid View
//    'ytd-browse[page-subtype="subscriptions"] ytd-video-renderer [overlay-style="SHORTS"]:upward(ytd-item-section-renderer)', // YT Subscriptions - Hide Shorts - List View
//    'ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer [overlay-style="SHORTS"]:upward(ytd-rich-item-renderer)', // YT Subscriptions - New Layout - Hide Shorts
//    '#related ytd-compact-video-renderer [overlay-style="SHORTS"]:upward(ytd-compact-video-renderer)', // YT Sidebar - Hide Shorts
//    '.pivot-shorts:upward(ytm-pivot-bar-item-renderer)', // YT Mobile - Hide the Shorts Menu button
//    'ytm-reel-shelf-renderer', // YT Mobile - Hide Shorts sections
//    'ytm-search ytm-video-with-context-renderer [data-style="SHORTS"]', // YT Mobile - Hide Shorts in search results
//];
