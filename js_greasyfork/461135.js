// ==UserScript==
// @name         站长工具屏蔽所有广告（2023最新版）
// @homepageURL  https://zhujicankao.com/
// @description  去除站长工具chinaz.com站点下的所有ad广告，适用于tool.chinaz.com站长工具
// @namespace    zhujicankao.com
// @version      1.0
// @match        *://*.chinaz.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461135/%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7%E5%B1%8F%E8%94%BD%E6%89%80%E6%9C%89%E5%B9%BF%E5%91%8A%EF%BC%882023%E6%9C%80%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/461135/%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7%E5%B1%8F%E8%94%BD%E6%89%80%E6%9C%89%E5%B9%BF%E5%91%8A%EF%BC%882023%E6%9C%80%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Get all elements with IDs starting with "AD" or "toolLeftImg"
  var adElements = document.querySelectorAll('[id^="AD"], [id^="toolLeftImg"]');

  // Loop through each element and hide it
  for (var i = 0; i < adElements.length; i++) {
    adElements[i].style.display = 'none';
  }
})();