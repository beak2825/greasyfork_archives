// ==UserScript==
// @name         YouTube 一行顯示 5 條影片 & 隱藏Shorts
// @namespace    https://114514.1919.com/
// @version      1.1
// @description  自動調整 YouTube 影片縮圖大小，讓每列可顯示 5 條影片，並隱藏 Shorts
// @author       
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533023/YouTube%20%E4%B8%80%E8%A1%8C%E9%A1%AF%E7%A4%BA%205%20%E6%A2%9D%E5%BD%B1%E7%89%87%20%20%E9%9A%B1%E8%97%8FShorts.user.js
// @updateURL https://update.greasyfork.org/scripts/533023/YouTube%20%E4%B8%80%E8%A1%8C%E9%A1%AF%E7%A4%BA%205%20%E6%A2%9D%E5%BD%B1%E7%89%87%20%20%E9%9A%B1%E8%97%8FShorts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 定義要插入的自訂 CSS
  function addCustomStyles() {
    GM_addStyle(`
      /* 隱藏 Shorts 的常見容器 */
      ytd-reel-shelf-renderer,
      ytd-rich-shelf-renderer[is-shorts] {
        display: none !important;
      }

      /* 每列顯示 5 個影片縮圖，並調整左右間距 */
      ytd-rich-grid-media {
        max-width: 100% !important;
        margin-left: 1% !important;
        margin-right: 1% !important;
      }

      /* 讓整個列表一次排 5 列 */
      ytd-rich-grid-renderer {
        --ytd-rich-grid-items-per-row: 5 !important;
      }
    `);
  }

  // 先加一次樣式
  addCustomStyles();

  // 為避免 YouTube 延遲載入或動態更新，監聽 DOM 變化並重複套用
  const observer = new MutationObserver(() => {
    addCustomStyles();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
