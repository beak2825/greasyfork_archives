// ==UserScript==
// @name         cyd油猴脚本测试
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  获取url参数，并且六秒后点击百度搜索框清除按钮,0.31版
// @author       XXX
// @match        *://*/*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-3.6.0.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/538529/cyd%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/538529/cyd%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==
(function () {
  'use strict';
  $(document).ready(function () {
    const paramString = window.location.search.substring(1); // 去掉开头的 '?'
    const paramArray = paramString.split('&');
    const params = {};

    for (let i = 0; i < paramArray.length; i++) {
      const param = paramArray[i].split('=');
      params[param[0]] = decodeURIComponent(param[1]);
    }
    GM_log(params, "version:0.31", $(document))
    setTimeout(() => {
      $(".quickdelete").click();
    }, 6666)
  });
})();
