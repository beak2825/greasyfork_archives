// ==UserScript==
// @name         豆瓣翻页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用方向键进行上下翻页，方便浏览网页或文章，适用于豆瓣
// @author       You
// @match        https://www.douban.com/**
// @icon         http://douban.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466580/%E8%B1%86%E7%93%A3%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/466580/%E8%B1%86%E7%93%A3%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let upKeys = [37]; // 上翻键设为 Left
    let downKeys = [39]; // 下翻键设为 Right
    document.addEventListener('keydown', function (evt) {
        if (upKeys.indexOf(evt.keyCode) !== -1) {
            let prevPage = document.querySelector("div.paginator span.prev a"); // 查找上一页链接
            if (prevPage) {
                prevPage.click(); // 点击上一页链接
            }
        } else if (downKeys.indexOf(evt.keyCode) !== -1) {
            let nextPage = document.querySelector("div.paginator span.next a"); // 查找下一页链接
            if (nextPage) {
                nextPage.click(); // 点击下一页链接
            }
        }
    });
})();