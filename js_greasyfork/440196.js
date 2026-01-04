// ==UserScript==
// @name         【个人】固定微博漂浮物
// @namespace    eezTool
// @description  固定微博网页上的漂浮元素，方便截图
// @version      0.13
// @author       eezTool
// @match        *://*.weibo.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440196/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91%E5%9B%BA%E5%AE%9A%E5%BE%AE%E5%8D%9A%E6%BC%82%E6%B5%AE%E7%89%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/440196/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91%E5%9B%BA%E5%AE%9A%E5%BE%AE%E5%8D%9A%E6%BC%82%E6%B5%AE%E7%89%A9.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var pbStyle = document.createElement('style');

  pbStyle.textContent = `
  div.WB_global_nav.WB_global_nav_v2.UI_top_hidden.WB_global_nav_aria {
    position: static !important
  }`

  pbStyle.textContent += `
  div.webim_fold.webim_fold_v2.clearfix{
    display: none !important
  }`

  document.head.appendChild(pbStyle);


})();

