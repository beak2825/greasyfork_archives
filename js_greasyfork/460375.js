// ==UserScript==
// @name         删除-alias
// @namespace    https://djzhao.js.org
// @version      0.1.1
// @description  删除本地开发中的-alias
// @author       djzhao
// @match        *localhost*/fcp-alias/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @grant        none
// @run-at       document_start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460375/%E5%88%A0%E9%99%A4-alias.user.js
// @updateURL https://update.greasyfork.org/scripts/460375/%E5%88%A0%E9%99%A4-alias.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href) {
        window.location.href = window.location.href.replaceAll('-alias', '');
    }
})();