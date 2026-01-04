// ==UserScript==
// @name         Furuke ed_mosaic+ 助手 v1.00
// @namespace    https://www.facebook.com/airlife917339
// @version      1.00
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @license      None
// @match        https://www.furuke.com/ed_mosaic*
// @icon         https://www.furuke.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488468/Furuke%20ed_mosaic%2B%20%E5%8A%A9%E6%89%8B%20v100.user.js
// @updateURL https://update.greasyfork.org/scripts/488468/Furuke%20ed_mosaic%2B%20%E5%8A%A9%E6%89%8B%20v100.meta.js
// ==/UserScript==

(function () {
  'use strict';

    let scrollCount = 0;		// 滾動次數的計數器
    let maxScrollCount = 250;	// 最大滾動次數限制
    let scrollInterval = 100;	// 每次滾動的時間間隔（毫秒）
    let scrollDistance = 900;	// 最後停留的位置離頂部的距離（像素）

    function scrollToBottomAndTop() {
        console.log("Scrolling to bottom...");
        // 開始一次滾動
        window.scrollTo(0, document.body.scrollHeight);

        // 每次滾動完後的處理
        scrollCount++;

        // 如果滾動次數達到最大次數或者到達底部，則停止滾動
        if (scrollCount < maxScrollCount) {
            // 使用 setTimeout 模擬單次執行
            setTimeout(function() {
                scrollToBottomAndTop();
            }, scrollInterval);
        } else {
			//console.log("Scrolling to top...");
			// 將網頁滾回指定位置(最上面)
            window.scrollTo(0, scrollDistance);
			//console.log("Finished scrolling.");
        }
    }

    // 開始執行
    scrollToBottomAndTop();


})();