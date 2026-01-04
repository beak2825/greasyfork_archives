// ==UserScript==
// @name         解除复制限制
// @description  解除网站的禁止复制
// @version      1.0
// @author       WJ
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/542563/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542563/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* 1. 阻止事件拦截（JS 层面） */
  ['copy','touchstart','contextmenu','selectstart'].forEach(evt => {
    document.addEventListener(evt, e => e.stopImmediatePropagation(), true);
  });

  /* 2. 覆盖 CSS 禁止选择 */
  GM_addStyle('*{user-select:auto!important;}');
})();
