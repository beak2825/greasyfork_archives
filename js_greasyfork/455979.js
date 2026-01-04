// ==UserScript==
// @name         取消B站首页灰色显示
// @namespace    https://www.52pojie.cn/home.php?mod=space&uid=508077
// @version      0.1
// @description  临时处理-取消B站首页灰度显示
// @author       未知的动力
// @match        https://*/*
// @grant        none
// @run-at      document-end
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/455979/%E5%8F%96%E6%B6%88B%E7%AB%99%E9%A6%96%E9%A1%B5%E7%81%B0%E8%89%B2%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/455979/%E5%8F%96%E6%B6%88B%E7%AB%99%E9%A6%96%E9%A1%B5%E7%81%B0%E8%89%B2%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.querySelector(`html`).classList.remove(`gray`);
})();
