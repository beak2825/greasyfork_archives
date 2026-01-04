// ==UserScript==
// @name         refuse-tieba-app.js
// @description  显示手机版贴吧里被隐藏的楼层与翻页按钮
// @namespace    https://gist.github.com/godoway/5accb9279396a13457bece071b93d471
// @version      0.1
// @author       gwsl
// @match        *://tieba.baidu.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/377761/refuse-tieba-appjs.user.js
// @updateURL https://update.greasyfork.org/scripts/377761/refuse-tieba-appjs.meta.js
// ==/UserScript==

function t(){
    $("ul#pblist>li").forEach(function(e){
        var ee = $(e);
        var tid = ee.attr("tid");
        var content = ee.find(".list_item_top");
        content.append(`<div style="text-align:center;background-color: #eee;margin: 8px 0 0 42px;"><a style="padding:12px;display:block;" href="https://tieba.baidu.com/t/p/${tid}">查看回复</a></div>`);
    });
}

(function() {
    $("#pblist").css("padding-bottom","0");
    $("#pblist>li[fn]").css("display","block");
    $("#pblist>li:not([fn])").remove();
    var pager = $("#list_pager");
    pager.attr("style","visibility:visible !important");
    pager.css("padding","16px 0");
    $("#list_pager").height(16);
    $(".father_cut_daoliu").css("display","none");
    t();
    $("#list_pager>a").on("click",function(){setTimeout(t,3000);});
})();



