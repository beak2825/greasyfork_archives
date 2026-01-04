// ==UserScript==
// @name         LKML last100 → last1000 redirector
// @namespace    https://your-site.example/
// @version      1.0
// @description  自動把 https://lkml.org/lkml/last100/ 系列網址導向至 last1000/；分頁路徑亦同。
// @author       abc0922001
// @match        https://lkml.org/lkml/last100/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538451/LKML%20last100%20%E2%86%92%20last1000%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/538451/LKML%20last100%20%E2%86%92%20last1000%20redirector.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // 僅於 /lkml/last100/ 路徑下運作
  const path = location.pathname;
  if (!/^\/lkml\/last100(\/.*)?$/.test(path)) return;

  // 替換路徑並保留分頁、查詢與錨點
  const newPath = path.replace('/last100', '/last1000');
  const newURL  = `${location.origin}${newPath}${location.search}${location.hash}`;

  // 避免無限迴圈
  if (newURL !== location.href) {
    // replace 不留瀏覽紀錄
    location.replace(newURL);
  }
})();
