// ==UserScript==
// @name         Fix YouTube Renderer
// @name:zh-CN   隐藏油管搜索页面的推荐
// @name:zh-TW   隱藏油管搜索頁面的推薦
// @namespace    youtube.com
// @version      2.04
// @description  Fix empty grid slots in YouTube renderer caused by adblockers.
// @description:zh-CN 修复由于广告拦截器导致的油管渲染器中的空网格槽。
// @description:zh-TW 修復由於廣告攔截器導致的油管渲染器中的空網格槽。
// @author       Zach Kosove
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/486635/Fix%20YouTube%20Renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/486635/Fix%20YouTube%20Renderer.meta.js
// ==/UserScript==

GM_addStyle(`
/* Containers */
ytd-rich-grid-row,
ytd-rich-grid-row > #contents {
    display: contents !important;
}

/* Bloat Removal (Includes Empty Sections) */
ytd-rich-grid-renderer > #contents.ytd-rich-grid-renderer > :not(ytd-rich-item-renderer, ytd-rich-grid-row, ytd-continuation-item-renderer) {
    display: none !important;
}
`);