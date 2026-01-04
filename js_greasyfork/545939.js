// ==UserScript==
// @name         Google Search 100 Result (Expired in Sep 2025)
// @description  在使用Google搜尋時，讓一頁顯示100條結果，而非預設的10條結果 ※2025年9月開始，Google已禁用Num=100的參數，此腳本已失效
// @icon https://www.google.com/favicon.ico
// @author       Kamikiri
// @namespace    kamikiriptt@gmail.com
// @match        https://www.google.com/search*
// @license      GPL
// @version      1.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545939/Google%20Search%20100%20Result%20%28Expired%20in%20Sep%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545939/Google%20Search%20100%20Result%20%28Expired%20in%20Sep%202025%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 取得當前的 URL
    var url = new URL(window.location.href);
    var params = url.searchParams;

    // 檢查 num 參數，若不存在或不等於 100，則修改
    if (!params.has("num") || params.get("num") !== "100") {
        params.set("num", "100");

        // 重新導向至修改後的網址
        window.location.replace(url.toString());
    }
})();
