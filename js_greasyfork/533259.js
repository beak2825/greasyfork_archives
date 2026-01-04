// ==UserScript==
// @name         YouTube 自适应列数 + 居中 + 卡片统一高度
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  自动根据窗口大小调整 YouTube 首页视频列数，居中排版，封面尺寸统一，频道页不影响！
// @author       ChatGPT
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533259/YouTube%20%E8%87%AA%E9%80%82%E5%BA%94%E5%88%97%E6%95%B0%20%2B%20%E5%B1%85%E4%B8%AD%20%2B%20%E5%8D%A1%E7%89%87%E7%BB%9F%E4%B8%80%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/533259/YouTube%20%E8%87%AA%E9%80%82%E5%BA%94%E5%88%97%E6%95%B0%20%2B%20%E5%B1%85%E4%B8%AD%20%2B%20%E5%8D%A1%E7%89%87%E7%BB%9F%E4%B8%80%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isHomePage = location.pathname === "/" && !location.pathname.startsWith("/channel") && !location.pathname.startsWith("/@");
    if (!isHomePage) return;

    const style = document.createElement('style');
    style.innerHTML = `
    ytd-rich-grid-renderer #contents {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
        column-gap: 16px !important;
        row-gap: 0px !important;
        max-width: 100% !important;
        margin: 0 auto !important;
        padding: 0 24px !important;
        box-sizing: border-box !important;
    }

    ytd-rich-item-renderer {
        width: 100% !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        height: 300px !important;
        overflow: hidden !important;
    }

    ytd-thumbnail.ytd-rich-grid-media {
        aspect-ratio: 16 / 9 !important;
        height: auto !important;
        width: 100% !important;
        overflow: hidden !important;
    }

    ytd-thumbnail.ytd-rich-grid-media img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
    }

    ytd-thumbnail.ytd-rich-grid-media img {
        height: 100% !important;
        object-fit: cover !important;
    }

    #video-title {
        max-height: 2.8em !important;
        overflow: hidden !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
    }

    ytd-rich-section-renderer {
        display: none !important;
    }
    `;

    document.head.appendChild(style);
})();