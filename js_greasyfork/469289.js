// ==UserScript==
// @name         删除你赢广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除你赢广告，拯救你赢
// @author       yangrou
// @match        *://gitblock.cn/*
// @match        *://aerfaying.com/*
// @icon         https://cdn.gitblock.cn/Media?name=11E4D54652FE811D8AE24371393C95C2.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469289/%E5%88%A0%E9%99%A4%E4%BD%A0%E8%B5%A2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/469289/%E5%88%A0%E9%99%A4%E4%BD%A0%E8%B5%A2%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(`$("li:has('.comment_comment_P_hgY:not([id])')").remove()`,20);
})();