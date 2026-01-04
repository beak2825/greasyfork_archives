// ==UserScript==
// @name         Threads 搜尋結果 ‑ 隱藏已追蹤帳號
// @namespace    https://threads.com
// @version      0.2
// @description  在 Threads 搜尋頁，只顯示「尚未追蹤」的帳號 (卡片內會出現「追蹤 / Follow」按鈕)。
// @match        https://www.threads.com/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535497/Threads%20%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%20%E2%80%91%20%E9%9A%B1%E8%97%8F%E5%B7%B2%E8%BF%BD%E8%B9%A4%E5%B8%B3%E8%99%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/535497/Threads%20%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%20%E2%80%91%20%E9%9A%B1%E8%97%8F%E5%B7%B2%E8%BF%BD%E8%B9%A4%E5%B8%B3%E8%99%9F.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /** 判斷要不要保留這張搜尋結果卡片 */
  const shouldKeep = (card) => {
    // 依需求增減關鍵字 (多語系)
    const keywords = ['追蹤', 'Follow', 'フォロー'];
    return keywords.some(kw => card.textContent.includes(kw));
  };

  /** 處理(新增的)卡片節點 */
  const processCard = (card) => {
    if (!shouldKeep(card)) {
      card.style.display = 'none';
    }
  };

  /** 一開始就先跑一次，處理已渲染好的卡片 */
  const initialScan = () => {
    document.querySelectorAll('div[data-pressable-container="true"]').forEach(processCard);
  };

  /** 監聽接下來動態載入的搜尋結果 */
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;          // 只處理 element
        if (node.matches?.('div[data-pressable-container="true"]')) {
          processCard(node);
        }
        node.querySelectorAll?.('div[data-pressable-container="true"]').forEach(processCard);
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  initialScan();   // 首次執行
})();