// ==UserScript==
// @name         百度首页自定义
// @namespace    http://customfirstpage.com/
// @version      0.1
// @description  定制百度首页网址收藏的样式!
// @author       You
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403191/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/403191/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 移除元素
    /*
    $(".s-menu-container").remove();
    $(".tips-manager-area").remove();
    $(".s-mblock-title").remove();*/
    $("#bottom_layer").remove();

    // 变更样式
    $(".s-code-blocks").css("box-shadow", "initial");
    $("#s_main").css({ "background": "rgba(255,255,255,0.35)", "border-radius": "6px" });
    /*$(".s-block-container").css("padding", "0");
    $(".s-mine-wrapper").css("margin-top", "0");
    
    $(".nav-icon-normal").css({ "height": "22px", "line-height": "22px", "width": "22px", "font-size": "12px" });
    $(".nav-icon img").css({ "width": "22px", "height": "22px" });
    $(".nav-icon").css({ "width": "22px", "height": "22px" });
    $(".s-code-blocks .nav-item").css({ "height": "22px", "line-height": "16px", "margin-left": "4px", "margin-right": "0px" });
    $(".s-content").css({ "padding-bottom": "0" });
    $(".nav-icon-add").css({ "width": "22px", "height": "22px", "line-height": "22px" });

    // 无图标的项，设置为显示首字符
    $(".nav-icon-normal").each(function () {
        var iconText = $(this).html();
        var firstWord = iconText[0];
        $(this).html(firstWord);
    });*/
})();