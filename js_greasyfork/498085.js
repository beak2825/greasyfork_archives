// ==UserScript==
// @name         Remove URL Tracking Parameters
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  移除網址中的跟踪參數
// @author       abc0922001
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498085/Remove%20URL%20Tracking%20Parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/498085/Remove%20URL%20Tracking%20Parameters.meta.js
// ==/UserScript==

(function () {
  "use strict";

  //  此函式內所使用的追蹤參數集合，包含各大行銷工具常見的參數，設計考量在於方便統一移除 URL 中所有可能的追蹤參數。
  const trackingParams = new Set([
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
    "yclid",
    "mc_cid",
    "mc_eid",
    "dclid",
    "from",
    "utm_channel",
    "utm_id",
    "msclkid",
    "mkt_tok",
    "pk_campaign",
    "pk_kwd",
    "affid",
  ]);

  /*
   * 此函式　removeTrackingParams　用來移除傳入 URL 中之跟踪參數，
   * 並回傳處理後之 URL 字串，
   * 設計考量在於提升空間與時間 複 雜 度 效能。
   */
  function removeTrackingParams(url) {
    const urlObj = new URL(url);
    let removed = false;
    for (const key of Array.from(urlObj.searchParams.keys())) {
      if (trackingParams.has(key)) {
        urlObj.searchParams.delete(key);
        removed = true;
      }
    }
    return removed ? urlObj.toString() : url;
  }

  /*
   * 此函式　cleanURL　用來更新當前瀏覽器 URL，
   * 移除其中之跟踪參數並同步更新歷史記錄，
   * 旨在優化使用者隱私與瀏覽體驗。
   */
  function cleanURL() {
    try {
      const currentUrl = window.location.href;
      const cleanedUrl = removeTrackingParams(currentUrl);
      if (cleanedUrl !== currentUrl) {
        window.history.replaceState({}, document.title, cleanedUrl);
      }
    } catch (error) {
      console.error("Error processing URL:", error);
    }
  }

  // 初始 URL 清理
  cleanURL();

  // 監聽瀏覽器歷史狀態變更
  window.addEventListener("popstate", cleanURL);

  // 若需支援單頁應用程式，可額外監聽自訂路由事件
  // window.addEventListener('routechange', cleanURL);
})();
