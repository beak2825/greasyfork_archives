// ==UserScript==
// @license MIT
// @name         微信公众号迁移直接跳转
// @name:zh-CN   微信公众号迁移直接跳转
// @name:zh-TW   微信公眾號遷移直接跳轉
// @name:zh-HK   微信公眾號遷移直接跳轉
// @name:zh-MO   微信公眾號遷移直接跳轉
// @namespace   Violentmonkey Scripts
// @match       https://mp.weixin.qq.com/*
// @grant       none
// @version     1.0
// @author      ddatsh
// @description         wechat redirect
// @description:zh-CN   脚本用于微信公众号迁移直接跳转
// @description:zh-TW   腳本用於微信公众号迁移直接跳转
// @description:zh-HK   腳本用於微信公众号迁移直接跳转
// @description:zh-MO   腳本用於微信公众号迁移直接跳转

// @downloadURL https://update.greasyfork.org/scripts/525125/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E8%BF%81%E7%A7%BB%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/525125/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E8%BF%81%E7%A7%BB%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


(function() {
    `use strict`;

  const title = document.title;
  if (title=="账号已迁移"){
    const element = document.getElementById('js_access_msg');

    // 检查元素是否存在
    if (element) {
        // 模拟点击
        element.click();
    }
  }

})();