// ==UserScript==
// @name         youtube去除视频播放完成之前的推荐
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  youtube去掉视频播放完成之前的推荐，视频即将播放完的前几秒，会弹出推荐视频挡住弹幕，该脚本可去除
// @author       kylin
// @grant    GM_addStyle
// @match        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/423633/youtube%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%AE%8C%E6%88%90%E4%B9%8B%E5%89%8D%E7%9A%84%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/423633/youtube%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%AE%8C%E6%88%90%E4%B9%8B%E5%89%8D%E7%9A%84%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let css =`
  .ytp-ce-element{
    display:none !important
  }
  `
  GM_addStyle(css)

})();