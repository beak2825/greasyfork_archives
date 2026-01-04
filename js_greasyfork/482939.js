// ==UserScript==
// @name         课件站文件下载
// @namespace    http://www.kjzhan.com/
// @icon         http://www.kjzhan.com/favicon.ico
// @version      1.1
// @description  课件站下载页自动展示本地下载按钮，使用者可以点击按钮直接下载，无需提取码
// @author       老胡
// @match        http://www.kjzhan.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482939/%E8%AF%BE%E4%BB%B6%E7%AB%99%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/482939/%E8%AF%BE%E4%BB%B6%E7%AB%99%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    showDownloadButton();
 
    function showDownloadButton() {
        $("#ys").hide();
		$("#dow").show();
    }
})();