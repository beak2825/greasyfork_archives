// ==UserScript==
// @name         黑白背景
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  浏览网站时黑白背景
// @author       袁煜914
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399519/%E9%BB%91%E7%99%BD%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/399519/%E9%BB%91%E7%99%BD%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==


(function() {
    GM_addStyle("* {filter: grayscale(100%);}");
    //GM_addStyle("* html { -webkit-filter: grayscale(100%);-moz-filter: grayscale(100%);-ms-filter: grayscale(100%);-o-filter: grayscale(100%);filter: grayscale(100%);}");
})();


