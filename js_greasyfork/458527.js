// ==UserScript==
// @name         哔站自律脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  调整哔站首页推荐内容，只保留搜索框及部分图标。强行自律，不让自己被推荐内容所吸引，一心学习！【滑稽】
// @author       is Mr.Sun
// @match        *://*.bilibili.com/?*
// @match        *://*.bilibili.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        unsafeWindow
// @require       https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/458527/%E5%93%94%E7%AB%99%E8%87%AA%E5%BE%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/458527/%E5%93%94%E7%AB%99%E8%87%AA%E5%BE%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("div.feed2").remove();//移除推荐内容
    $("div.bili-header__channel").remove(); //移除小图标列表
    $("div.bili-header__banner").remove(); //移除head
    $("#bili-header-banner-img").remove(); //移除搜索框下图片
    $("ul.left-entry").remove(); //移除左侧ul
    // 添加哔站logo
    $("div.bili-header__bar").append("<div id='blibli-icon'><img src='https://s1.ax1x.com/2023/01/19/pS8thA1.jpg'style='width:100%;height:100%;border-width=0'></div>");
    var css_blibli_icon = {
        'width':'300px',
        'height':'300px',
        'border-width':'0',
        'margin-top': '60px',
    };
    $("#blibli-icon").css(css_blibli_icon);

    // 调整背景及调整搜索框与其右侧ul位置
    var css_bili_header__bar = {
        'flex-direction': 'column',
        'justify-content':'flex-start',
        'align-items':'center',
        'height':'100%',
        'position': 'fixed',
        'background-color':"#00a1d6",
    };
    $("div.bili-header__bar").css(css_bili_header__bar);

    // 调整搜索框
    var css_center_search_container = {
        'flex':'none',
        'width':'600px',
        'margin-top': '140px',
        'margin-bottom': '30px',
        'z-index':'999',
    };
    $("div.center-search-container").css(css_center_search_container);


})();