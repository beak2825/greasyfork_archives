// ==UserScript==
// @name         WPS护眼模式
// @namespace    yournamespace
// @version      1.0
// @description  将网页背景色设置为WPS护眼模式豆沙色，文字颜色设置为黑色
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471795/WPS%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/471795/WPS%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('body { background-color: #CCE8CF !important; color: black !important; }');
})();