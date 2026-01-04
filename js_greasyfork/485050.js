// ==UserScript==
// @name        500px照片详情页面按ESC关闭
// @namespace    http://tampermonkey.net/
// @description  500px照片详情页面,直接按ESC关闭
// @version      0.1
// @author       lihao
// @match        *://500px.com.cn/community/*


// @downloadURL https://update.greasyfork.org/scripts/485050/500px%E7%85%A7%E7%89%87%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2%E6%8C%89ESC%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/485050/500px%E7%85%A7%E7%89%87%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2%E6%8C%89ESC%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==
(function() {
  'use strict';
  console.clear()

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" || event.keyCode === 27) {
     $(".close").click();
    }
  });

})();
