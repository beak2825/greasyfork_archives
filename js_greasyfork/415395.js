// ==UserScript==
// @name         今日头条PC网站适应宽屏
// @namespace    http://www.rc3cr.net/
// @version      0.3
// @description  今日头条适应宽屏，全屏或带鱼屏
// @author       炔点软件
// @match        https://www.toutiao.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415395/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1PC%E7%BD%91%E7%AB%99%E9%80%82%E5%BA%94%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/415395/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1PC%E7%BD%91%E7%AB%99%E9%80%82%E5%BA%94%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".main-content").width("100%");
    $(".syl-page-img").width("100%");
    $(".middlebar-inner").width("100%");

    $(".detail-content-wrapper").width("100%");
    $(".article-content").css('width', '100%').css('width', '-=500px');
    $(".tab-container").css('width', '100%').css('width', '-=380px');
    $(".feed-container").css('width', '100%').css('width', '-=500px');
    $(".feedbox-wrapper").width("100%");
})();