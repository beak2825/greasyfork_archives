// ==UserScript==
// @name         清空PT站收藏夹
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  清空PT站收藏夹,使用方法：安装并启用插件后，进入支持的网站收藏夹，自动遍历点击取消收藏，自动刷新页面，直到清空为止
// @author       woodj
// @license      MIT
// @include        *://open.cd/*torrents.php?*inclbookmarked=1*
// @include        *://ourbits.club/torrents.php?*inclbookmarked=1*
// @include        *://hdsky.me/torrents.php?*inclbookmarked=1*
// @include        *://tp.m-team.cc/torrents.php?*inclbookmarked=1*
// @include        *://tp.m-team.cc/movie.php?*inclbookmarked=1*
// @include        *://tp.m-team.cc/adult.php?*inclbookmarked=1*
// @include        *://hdcmct.org/torrents.php?*inclbookmarked=1*
// @include        *://totheglory.im/mycarts.php*
// @icon           https://ss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/d53f8794a4c27d1e9efa8b2a1ad5ad6edcc4387b.jpg
// @downloadURL https://update.greasyfork.org/scripts/370445/%E6%B8%85%E7%A9%BAPT%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/370445/%E6%B8%85%E7%A9%BAPT%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.location.href.indexOf("totheglory.im") > -1) {
        // ttg 比较特殊， rss用的是小货车，有全选批量操作功能
        if ($(".select_t").length > 0) {
            $("#select_all").click()
            $("#bulkdelete").click()
            window.location.href = window.location.href;
        }
    } else if (window.location.href.indexOf("tp.m-team.cc") > -1) {
        let lst = document.getElementsByClassName("bookmark");
        if (lst.length == 0) return;
        let item = document.getElementsByTagName("h1")[0].children[1];
        item.click();
    } else {
        let lst = document.getElementsByClassName("bookmark");
        var refresh = false;
        if (lst.length > 0) {
            refresh = true;
            while (lst.length > 0) {
                lst[0].click();
                lst = document.getElementsByClassName("bookmark");
            }
            console.log("wood");
            if (refresh) { window.location.href = window.location.href; }
        }
    }
})();
