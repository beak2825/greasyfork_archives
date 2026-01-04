// ==UserScript==
// @name         珠江培训中心视频 自动播放下一节
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学习用
// @author       阿礼 亮
// @match        https://grcbank.21tb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=21tb.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482216/%E7%8F%A0%E6%B1%9F%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83%E8%A7%86%E9%A2%91%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/482216/%E7%8F%A0%E6%B1%9F%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83%E8%A7%86%E9%A2%91%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('head').append($(`
  <!-- JS部分 -->
  <script>
     function next() {
      for (var i = 0; i < 1080; i++) {
      setTimeout(
       (from_HL) => {
       if (!(document.querySelector(".next-button"))){console.log("try to click next button");}
       else{document.querySelector(".next-button").click();console.log("click successful");}
      }, 10000*i, i,);
    } //每10秒钟尝试点击一次，最多持续3小时
    };
    next();
  </script>`));
    // Your code here...
})();