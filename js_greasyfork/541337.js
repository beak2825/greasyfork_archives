// ==UserScript==
// @name         禁止打开新标签
// @description  强制所有顽固跳转的链接都在当前标签页打开
// @version      1.1
// @author       WJ
// @match        *://*/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/541337/%E7%A6%81%E6%AD%A2%E6%89%93%E5%BC%80%E6%96%B0%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/541337/%E7%A6%81%E6%AD%A2%E6%89%93%E5%BC%80%E6%96%B0%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(() => {
  'use strict';
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (a?.href) { location = a.href; e.preventDefault(); }
  }, true);
})();