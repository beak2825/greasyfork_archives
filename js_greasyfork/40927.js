// ==UserScript==
// @name         去除汽车之家论坛列表页视频预览图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  汽车之家论坛视频帖在论坛列表页里会显示视频预览图，严重影响阅读体验，此脚本可以屏蔽视频预览图。
// @author       李多多
// @match        *://club.autohome.com.cn/bbs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40927/%E5%8E%BB%E9%99%A4%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E8%AE%BA%E5%9D%9B%E5%88%97%E8%A1%A8%E9%A1%B5%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/40927/%E5%8E%BB%E9%99%A4%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E8%AE%BA%E5%9D%9B%E5%88%97%E8%A1%A8%E9%A1%B5%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("dd.outvideo").hide();
})();