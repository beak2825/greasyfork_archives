// ==UserScript==
// @name         清爽B站
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删了些不想要的模块
// @author       LaprasC
// @match        *://www.bilibili.com/*
// @match        *://www.bilibili.com/v/anime/serial/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39135/%E6%B8%85%E7%88%BDB%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/39135/%E6%B8%85%E7%88%BDB%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#bili_live").remove();//主页的直播
    $(".video-floor-m").remove();//新番区的动态
    $(".tag-list-wrp").remove();//新番区的热门标签
})();