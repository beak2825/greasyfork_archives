// ==UserScript==
// @name         无忧考网文件下载
// @namespace    https://www.51test.net/
// @icon         https://www.51test.net/favicon.ico
// @version      1.3
// @description  无忧考网文件免费下载
// @author       老胡
// @match        https://www.51test.net/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482942/%E6%97%A0%E5%BF%A7%E8%80%83%E7%BD%91%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/482942/%E6%97%A0%E5%BF%A7%E8%80%83%E7%BD%91%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    showDownloadButton();

    function showDownloadButton() {
        var downloadUrl="https://tikuview.51test.net/view_article/?id=" + str_articleid + "&token=e6b7ac78b017ae2cc429becd5f300ceb&app=other";
        $('#content-txt').append("<a href='" + downloadUrl + "'>开始下载吧</a>");
    }
})();