// ==UserScript==
// @name         抖音下载
// @namespace    https://greasyfork.org/zh-CN/scripts/458392-%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD
// @version      1.0.2
// @description  抖音视频下载
// @author       Yong_Hu_Ming
// @license      Apache License 2.0
// @match        *://www.douyin.com/video/*
// @grant        none
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/458392/%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/458392/%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

'use strict';


var $ = window.jQuery;

(window.onload=function() {
    setTimeout(function() {
        $("div#xiazai").remove()
        $('div[data-e2e="detail-video-info"] > div:last-child > div:last-child').prepend('<div id="xiazai"><span style="margin-right: 20px;cursor: pointer;">下载</span></div>');
        // $("div.aryhJWD7").before('<div class="aryhJWD7" id="xiazai"><span class="aryhJWD7">下载</span></div>');
        $('div#xiazai').click(function(){
            window.location.href = "https:"+$("video > source:first-child").attr("src");
        })
    }, 2000);
})();
