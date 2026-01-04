// ==UserScript==
// @name             闲鱼简单搜索框 by xspio
// @namespace    https://www.xspio.com
// @version          0.3
// @icon               https://www.taobao.com/favicon.ico
// @description    闲鱼添加简单的搜索框
// @author           xspio
// @require          https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @include          https://www.taobao.com
// @include          *://2.taobao.com/*
// @include          *://s.2.taobao.com/*
// @grant             none
// @namespace    https://greasyfork.org/zh-CN/scripts/374930-%E9%97%B2%E9%B1%BC%E7%AE%80%E5%8D%95%E6%90%9C%E7%B4%A2%E6%A1%86-by-xspio
// @downloadURL https://update.greasyfork.org/scripts/374930/%E9%97%B2%E9%B1%BC%E7%AE%80%E5%8D%95%E6%90%9C%E7%B4%A2%E6%A1%86%20by%20xspio.user.js
// @updateURL https://update.greasyfork.org/scripts/374930/%E9%97%B2%E9%B1%BC%E7%AE%80%E5%8D%95%E6%90%9C%E7%B4%A2%E6%A1%86%20by%20xspio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$;
    // 自定义搜索框
    var search=$('<div style="margin:0 auto;padding:8px 0;width:990px;height:40px;display:flex;flex-wrap:nowrap;justify-content:space-between;align-items:stretch;"><input class="searchInput" type="text" value="" title="输入要搜索的内容" style="flex: 0 0 90%;padding: 0 5px;font-size:18px;border-radius: 4px;border: 1px solid #DBDBDB;"><button class="searchBtn" style="flex: 0 0 8%;font-size:18px;border-radius: 4px;border: 1px solid #DBDBDB;cursor:pointer;">搜索</button></div>');
    // 首页搜索框
    $(".banner-wrap").after(search);
    // 列表页搜索框
    $("#content").prepend(search);

    // 搜索按钮
    $(".searchBtn").click(function () {
        var searchInput = $(".searchInput").val();
        searchInput = $.trim(searchInput);
        location.href = "https://2.taobao.com/list/list.htm?q=" + searchInput;
    });

    // 去除详情页二维码图片
    $(".mau-guide").remove();

    // 回车按键搜索
    $(document).keyup(function(event){
        if(event.keyCode ==13){
            $(".searchBtn").trigger("click");
        }
    });

})();