// ==UserScript==
// @name        虎扑手机版跳转网页版
// @namespace    https://wangtwothree.com/
// @version      0.2
// @description  虎扑手机版自动跳转网页版
// @author        wangtwothree
// @match        *://m.hupu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515775/%E8%99%8E%E6%89%91%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/515775/%E8%99%8E%E6%89%91%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%89%88.meta.js
// ==/UserScript==
(function() {
    // 获取当前页面 URL
    const currentUrl = window.location.href;
    if(currentUrl.includes('m.hupu.com')){
        // 提取 URL 中的数字部分
      const postId = currentUrl.match(/\/(\d+)\.html/)[1];
      // 新的 URL
      const newUrl = `https://bbs.hupu.com/${postId}.html`;
      // 页面跳转
      window.location.href = newUrl;
    }
})();