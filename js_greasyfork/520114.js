// ==UserScript==
// @name        碗碗妈咪实验组2.1
// @namespace   碗碗妈咪实验组2.1
// @match       https://book.douban.com/subject/25867851/*
// @grant       none
// @version     1.0
// @author      二咪妈咪
// @description 2024/12/6 19:20:45
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520114/%E7%A2%97%E7%A2%97%E5%A6%88%E5%92%AA%E5%AE%9E%E9%AA%8C%E7%BB%8421.user.js
// @updateURL https://update.greasyfork.org/scripts/520114/%E7%A2%97%E7%A2%97%E5%A6%88%E5%92%AA%E5%AE%9E%E9%AA%8C%E7%BB%8421.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 页面加载后停留 5 秒
  console.log('页面加载完毕，准备停留 5 秒...');
  setTimeout(() => {
    // 停留 5 秒后跳转到目标页面
    console.log('五秒后跳转到目标页面...');
    window.location.href = 'https://book.douban.com/subject/22746581/'; // 刷量页面 URL
  }, 5000); // 5000 毫秒 = 5 秒
})();
