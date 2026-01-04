// ==UserScript==
// @name         樱花动漫：去除广告&点击后直接在当前页播放
// @namespace    http://modaiwang.net/
// @version      0.2
// @description  噔噔，可以把页面变清爽一点
// @author       You
// @match        http://www.imomoe.io/*
// @match        http://www.imomoe.in/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/393075/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%EF%BC%9A%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E7%82%B9%E5%87%BB%E5%90%8E%E7%9B%B4%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/393075/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%EF%BC%9A%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E7%82%B9%E5%87%BB%E5%90%8E%E7%9B%B4%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    $('#adl').remove();
    $('#adr').remove();
    $('#play_0').next().remove();
    $('.side').children('a').remove();
    $('.movurls').each(function(index,element){console.log($(element).children().children().children().attr('target','_parent'));});
    $('#note').remove();
    $('img#close').parents('div').remove();



})();