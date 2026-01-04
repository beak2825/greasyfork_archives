// ==UserScript==
// @name         水木社区 - 自动翻页
// @version      1.0
// @author       Siukei
// @description  水木社区自动翻页，方向左键上一页，方向右键上一页
// @match        *://*.newsmth.net/*
// @icon         https://static.mysmth.net/nForum/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://www.newsmth.net
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/471206/%E6%B0%B4%E6%9C%A8%E7%A4%BE%E5%8C%BA%20-%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/471206/%E6%B0%B4%E6%9C%A8%E7%A4%BE%E5%8C%BA%20-%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') { // ArrowRight 表示键盘右箭头键的键码
            nextPage(true);
        }
        if (event.key === 'ArrowLeft') { // ArrowLeft 表示键盘右箭头键的键码
            nextPage(false);
        }
    });

    window.onscroll = function () {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            // nextPage(true);
        }
    };

    function nextPage(isNext) {
        var selector = isNext ? 'last-child' : 'first-child'
        var a = document.querySelector(`ul.pagination > li > ol.page-main > li:${selector} > a`);
        if (a) {
            a.click(); // 触发点击事件
        }
    }
})();


