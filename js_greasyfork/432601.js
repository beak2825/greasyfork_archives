// ==UserScript==
// @name         多合一页面精简
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  移除简书、掘金页面上无用的元素
// @author       Miroxyz
// @match        *://*.jianshu.com/*
// @match        *://*.juejin.cn/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432601/%E5%A4%9A%E5%90%88%E4%B8%80%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/432601/%E5%A4%9A%E5%90%88%E4%B8%80%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var url = window.location.href;
  var isMobile = /(Android|iPhone|iPad)/i.test(navigator.userAgent);

  function cleanJianshu() {
    GM_addStyle("._3Pnjry{display:none !important}");
    GM_addStyle("._27yofX{display:none !important}");
    GM_addStyle("#__next > footer{display:none !important}");
  }

  function cleanJuejin() {
    if (isMobile) {
      window.localStorage.setItem("hideAppOpenDrawer", true);
      // 移除APP内打开
      GM_addStyle(".app-open-button{display:none !important}");
    } else {
      // 移除侧边栏点赞、评论、收藏
      GM_addStyle(".article-suspended-panel{display:none !important}");
      // 移除侧边栏APP下载
      GM_addStyle(".app-download-sidebar-block{display:none !important}");
      // 移除右下角建议反馈
      GM_addStyle(".meiqia-btn{display:none !important}");
    }
  }

  if (url.indexOf("jianshu.com") !== -1) {
    cleanJianshu();
  } else if (url.indexOf("juejin.cn") !== -1) {
    cleanJuejin();
  }
})();
