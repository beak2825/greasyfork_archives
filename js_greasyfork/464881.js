// ==UserScript==
// @name         去除弹窗
// @version      1
// @description  Hides elements with ids "popup-overlay" and "popup"
// @match        https://chatgpt6.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1068094
// @downloadURL https://update.greasyfork.org/scripts/464881/%E5%8E%BB%E9%99%A4%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/464881/%E5%8E%BB%E9%99%A4%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("#popup-overlay { display: none !important; }");

    GM_addStyle("#popup { display: none !important; }");
})();
