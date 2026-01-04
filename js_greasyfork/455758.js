// ==UserScript==
// @name        黑白页面恢复彩色
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      -
// @description 2022/12/1 14:26:18
// @downloadURL https://update.greasyfork.org/scripts/455758/%E9%BB%91%E7%99%BD%E9%A1%B5%E9%9D%A2%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455758/%E9%BB%91%E7%99%BD%E9%A1%B5%E9%9D%A2%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==


(function () {
  let css = 'html,body,[class*="gray"]{filter:none!important}';
  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    let styleNode = document.createElement('style');
    styleNode.appendChild(document.createTextNode(css));
    (document.querySelector('head') || document.documentElement).appendChild(
      styleNode,
    );
  }
})();