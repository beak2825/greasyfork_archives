// ==UserScript==
// @name         自用雨课堂防止自动暂停
// @namespace    http://tampermonkey.net/
// @version      2025-06-12
// @description Prevent YKT video auto pause
// @author       You
// @match        https://*.yuketang.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539185/%E8%87%AA%E7%94%A8%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%98%B2%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/539185/%E8%87%AA%E7%94%A8%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%98%B2%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 等待视频加载完成
  const waitForVideo = setInterval(() => {
    const videos = document.querySelectorAll('video');
    if (videos.length > 0) {
      clearInterval(waitForVideo);
      
      // 批量劫持 pause 方法
      videos.forEach(video => {
        video.pause = function() {
          console.log("阻止了暂停！");
        };
      });
    }
  }, 1000);
})();