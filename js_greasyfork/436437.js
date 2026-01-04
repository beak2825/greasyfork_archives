// ==UserScript==
// @name         LVV2网页快照快速跳转原文链接
// @namespace    http://zhaoji.wang/
// @version      0.1
// @description  LVV2网页快照的原文需要拉到最底下才能看到，这个脚本可以将快照的标题直接变为可以点击的原文链接！
// @author       Zhaoji Wang
// @include      https://instant.lvv2.com/*
// @icon         https://www.google.com/s2/favicons?domain=lvv2.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/436437/LVV2%E7%BD%91%E9%A1%B5%E5%BF%AB%E7%85%A7%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC%E5%8E%9F%E6%96%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/436437/LVV2%E7%BD%91%E9%A1%B5%E5%BF%AB%E7%85%A7%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC%E5%8E%9F%E6%96%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var $h1 = document.querySelector("h1");
  var title = $h1.innerText;
  var originalUrl = document.querySelector("#_via a").getAttribute("href");
  $h1.innerHTML = '<a href="'
    .concat(
      originalUrl,
      '" target="_self" title="\u539F\u6587\u94FE\u63A5\uFF1A'
    )
    .concat(originalUrl, '">')
    .concat(title, "</a>");
})();
