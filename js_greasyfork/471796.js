// ==UserScript==
// @name         强制网页为白底黑字
// @namespace    yournamespace
// @version      1.0
// @description  将网页背景设置为白色，文字颜色设置为黑色
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471796/%E5%BC%BA%E5%88%B6%E7%BD%91%E9%A1%B5%E4%B8%BA%E7%99%BD%E5%BA%95%E9%BB%91%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/471796/%E5%BC%BA%E5%88%B6%E7%BD%91%E9%A1%B5%E4%B8%BA%E7%99%BD%E5%BA%95%E9%BB%91%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('body { background-color: white !important; color: black !important; }');
})();