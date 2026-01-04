// ==UserScript==
// @name         Web of Science 自動展開「显示更多」(robust)
// @namespace    https://114514.1919.com/
// @version      1.0
// @description  在 Web of Science 自動點擊所有「显示更多 / Show more」等展開按鈕
// @author       
// @match        https://*.webofscience.com/*
// @grant        GM_addStyle
// @license MIT
// @run-at       document-idle            // 確保主要 DOM 已安靜
// @downloadURL https://update.greasyfork.org/scripts/534364/Web%20of%20Science%20%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E3%80%8C%E6%98%BE%E7%A4%BA%E6%9B%B4%E5%A4%9A%E3%80%8D%28robust%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534364/Web%20of%20Science%20%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E3%80%8C%E6%98%BE%E7%A4%BA%E6%9B%B4%E5%A4%9A%E3%80%8D%28robust%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /** 關鍵字正則，不分大小寫 */
  const KW = /显示更多|Show more/i;

  /** 取得當前畫面中「可點擊且文字符合」的元素 */
  function getTargets() {
    return Array.from(document.querySelectorAll("button, a, [role='button'], div, span"))
      .filter(el => KW.test(el.textContent.trim()))
      .map(el => el.closest("button, a, [role='button']") || el);
  }

  /** 逐一點擊，並避免重複 */
  function clickAll() {
    getTargets().forEach(el => {
      if (!el.dataset.__wosClicked) {
        el.dataset.__wosClicked = "1";
        el.click();
      }
    });
  }

  /* -------------------- 主程式 -------------------- */

  /** 第一次：延遲 1 秒，等 Ajax 首波內容進來 */
  setTimeout(clickAll, 1000);

  /** 其後：監聽動態載入 */
  const obs = new MutationObserver(clickAll);
  obs.observe(document.body, { childList: true, subtree: true });

  /** 快捷鍵 Ctrl+Shift+M 手動再掃瞄一次 */
  window.addEventListener("keydown", e => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyM") clickAll();
  });
})();
