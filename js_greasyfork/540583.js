// ==UserScript==
// @name         跳过掘金链接跳转提示
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  跳过掘金外部链接提示
// @author       me
// @match        https://link.juejin.cn/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540583/%E8%B7%B3%E8%BF%87%E6%8E%98%E9%87%91%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/540583/%E8%B7%B3%E8%BF%87%E6%8E%98%E9%87%91%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";
    if (/target=([^&]+)/.test(location.search)) {
        location.href = decodeURIComponent(
            location.search.match(/target=([^&]+)/)[1]
        );
    }
})();