// ==UserScript==
// @name         bilibili-app-recommend补丁
// @namespace    https://greasyfork.org/zh-CN/scripts/466238-bilibili-app-recommend补丁
// @version      0.1.1
// @description  解决安装bilibili-app-recommend脚本后出现两个分类栏
// @author       MilkSC_
// @match        https://www.bilibili.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466238/bilibili-app-recommend%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/466238/bilibili-app-recommend%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 等待页面加载完成
  window.addEventListener('load', function() {
      // 找到需要删除的 div 标签
      var headerChannelFixedDiv = document.querySelector('.header-channel-fixed');
      if (headerChannelFixedDiv) {
          // 从 DOM 中删除该标签
          headerChannelFixedDiv.parentNode.removeChild(headerChannelFixedDiv);
      }
  });
})();
