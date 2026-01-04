// ==UserScript==
// @name         拓元 outside 跳出後
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自動點擊立即訂購按鈕，並在特定條件下跳轉到指定網站。
// @author       你
// @license      MIT
// @match        https://tixcraft.com/activity
// @match        https://tixcraft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520543/%E6%8B%93%E5%85%83%20outside%20%E8%B7%B3%E5%87%BA%E5%BE%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/520543/%E6%8B%93%E5%85%83%20outside%20%E8%B7%B3%E5%87%BA%E5%BE%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查并清除指定的键
    if(window.location.href === "https://tixcraft.com/"){
          console.log("清除")
          localStorage.removeItem("urls");
       }

      if(window.location.href === "https://tixcraft.com/activity"){
          //設定要轉跳的網站 後續因該設定為選位圖
          let urls = JSON.parse(localStorage.getItem('urls'));

          if (urls || urls.length !== 0) {
              window.location.href = urls[0];
    }
       }




})();
