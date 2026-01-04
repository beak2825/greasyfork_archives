// ==UserScript==
// @name         巴哈姆特 手機版 不跳 APP 詢問框
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  略過巴哈姆特論壇手機版惱人的 APP 詢問框
// @author       Rplus
// @match        https://m.gamer.com.tw/forum/*.php?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446539/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20%E6%89%8B%E6%A9%9F%E7%89%88%20%E4%B8%8D%E8%B7%B3%20APP%20%E8%A9%A2%E5%95%8F%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/446539/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20%E6%89%8B%E6%A9%9F%E7%89%88%20%E4%B8%8D%E8%B7%B3%20APP%20%E8%A9%A2%E5%95%8F%E6%A1%86.meta.js
// ==/UserScript==

(function() {
  if (MB_showBottomDownloadApp) {
    MB_showBottomDownloadApp = i => { if (i) { location.href = i } }
  }
})();