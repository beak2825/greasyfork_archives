// ==UserScript==
// @name         Junjin Monkey - 掘金猴
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  better Juejin experience, remove ads and other useless things, make it clean and simple, just like a monkey!
// @author       Sherlock-V
// @match        https://juejin.cn
// @match        https://juejin.cn/*
// @icon         https://juejin.cn/favicon.ico
// @grant        GM_addStyle
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468239/Junjin%20Monkey%20-%20%E6%8E%98%E9%87%91%E7%8C%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/468239/Junjin%20Monkey%20-%20%E6%8E%98%E9%87%91%E7%8C%B4.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // Your code here...
  const cssText = `
  
  `;
  GM_addStyle(cssText);

  const style = document.createElement('style')
  const hides = [
    '#juejin > div.view-container div.sidebar.article-sidebar > ul.sidebar-bd-entry',
    '#juejin > div.view-container div.sidebar.article-sidebar > div.sidebar-block.wechat-sidebar-block.pure',
    '#juejin > div.view-container div.main-area.article-area > div.article-end > div.extension-banner',
    '#juejin > div.view-container li.nav-item.vip-entry',
    '#juejin > div.view-container ul > li.nav-item.link-item.special-activity-item',
    // 相关小册
    '#juejin > div.view-container div.main-area.article-area > div.wrap.category-course-recommend',
  ].filter(Boolean)

  style.innerHTML = [
    `${hides.join(',')}{ display: none !important; }`,
  ].join('')

  document.body.appendChild(style)
})();