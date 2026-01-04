// ==UserScript==
// @name         Xclient.info快速下载文件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Xclient.info下载文件快速定位下载页面，百度链接需要配置密码自动填充脚本实现
// @author       haiifenng
// @match        https://xclient.info/s/*
// @require      http://code.jquery.com/jquery-1.9.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33169/Xclientinfo%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/33169/Xclientinfo%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var link = $(".btn_down_link");
    if(link.length>0) {
        var isBaidu = link.attr("data-clipboard-text");
        if (isBaidu) {
            var url = link.attr("data-link")+"#"+link.attr("data-clipboard-text");
            link.attr("href",url);
        }
        window.location = link[0].href;
    }
})();