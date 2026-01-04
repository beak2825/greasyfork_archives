// ==UserScript==
// @name         小米搶折價卷
// @version      0.2
// @description  try to take over the world!
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require 		 http://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/17404
// @downloadURL https://update.greasyfork.org/scripts/374112/%E5%B0%8F%E7%B1%B3%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/374112/%E5%B0%8F%E7%B1%B3%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 時間 1541685600 為 11/08/2018 @ 2:00pm (UTC)  
	let start = [/* 1541685600, 1541728800, 1541736000, 1541743200,*/ 1541750400, 1541757600, 1541764800, 1541772000, 1541815200, 1541822400, 1541829600, 1541836800, 1541844000, 1541851200, 1541858400, 1541901600, 1541908800, 1541916000, 1541923200, 1541930400, 1541937600, 1541944800];
	// 時間到就開始點擊, 經過一分鐘後移除 start 第一項
	function checkForMoniDisplayChange() {
    let now_time = Math.floor(Date.now() / 1000);
    if (now_time >= start[0]) {
      $(".J_couponArea").removeAttr("disabled");
      $(".J_couponArea").click();
      console.log("get it");
    }
    // 搶一分鐘
    if (now_time == start[0] + 60) {
      console.log("Remove item " + start[0].toString());
      start.shift();
    }
  }
  window.setInterval(checkForMoniDisplayChange, 1);
  alert = {}
})();
