// ==UserScript==
// @name         其乐社区-自动点击下一页
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  其乐社区自动点击下一页
// @author       一二
// @match        *://*.keylol.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keylol.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499378/%E5%85%B6%E4%B9%90%E7%A4%BE%E5%8C%BA-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E4%B8%8B%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/499378/%E5%85%B6%E4%B9%90%E7%A4%BE%E5%8C%BA-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E4%B8%8B%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
let box = document.getElementById('autopbn');
    window.addEventListener('scroll', function() {
  // 获取页面的总高度
  var totalHeight = document.documentElement.scrollHeight;

  // 获取窗口的高度
  var windowHeight = window.innerHeight;

  // 获取滚动条的位置
  var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  // 判断滚动条是否接近底部
  if (Math.ceil(scrollPosition + windowHeight) >= totalHeight) {
    box.textContent ="下一页66666"
     box.click();
  }
});
    // Your code here...
})();