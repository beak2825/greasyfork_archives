// ==UserScript==
// @name         58 copy text
// @namespace    http://zhiyuan4j.red
// @version      0.1
// @description  解决58某些板块详情页无法复制网页内容
// @author       zhiyuan.wang
// @match        *://*.58.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393657/58%20copy%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/393657/58%20copy%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 58可复制
    document.getElementsByTagName("html")[0].style.cssText='-webkit-touch-callout: text; -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text';
})();