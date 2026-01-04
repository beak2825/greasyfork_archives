// ==UserScript==
// @name        黑白网页恢复
// @namespace   me.milly
// @version     0.2
// @license     Apache 2.0
// @author      MillyLee
// @description 常用站点灰色滤镜恢复，还你彩色显示器！！！
// @match       *://*/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455994/%E9%BB%91%E7%99%BD%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/455994/%E9%BB%91%E7%99%BD%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D.meta.js
// ==/UserScript==

GM_addStyle(`
  html {
      filter:grayscale(0) !important;
      -webkit-filter:grayscale(0) !important;
  }
`);