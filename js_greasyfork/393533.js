// ==UserScript==
// @name         恢复简书图片
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  恢复简书中无法显示的图片、调整简书布局为宽屏
// @author       山岚|ShanLan
// @match        *://www.jianshu.com/p/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393533/%E6%81%A2%E5%A4%8D%E7%AE%80%E4%B9%A6%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/393533/%E6%81%A2%E5%A4%8D%E7%AE%80%E4%B9%A6%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $.each($(".image-view > img"),function(i,obj){
        var $o = $(obj);
        var link = $o.attr("data-original-src");
        $o.attr("src",link); $o.addClass("illustration");
        $o.removeClass("image-loading");
        var $fu = $(obj.parentNode); });
    $(".image-view-maintain").removeClass("image-view-maintain");

    //调整页面布局
    //父级元素宽度
    $("div[role=main]")[0].style.width = '80%';
    //子元素
    $("div[role=main]")[0].children[0].style.width = '100%';
    //点赞框
    $("#__next")[0].children[3].style.left = '5px';
})();