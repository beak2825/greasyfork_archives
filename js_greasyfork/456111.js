// ==UserScript==
// @name         戴森球计划量化计算器工具：页面优化
// @namespace    huods
// @version      0.3
// @description  优化显示“戴森球计划量化计算器工具”页面，优化布局样式等。
// @author       huods
// @match        *://*.svlik.com/*
// @icon         https://imgsa.baidu.com/forum/pic/item/42676ddfb48f8c5428fece4935292df5e0fe7f5b.jpg
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/mdui/1.0.2/js/mdui.min.js
// @resource css https://cdn.bootcdn.net/ajax/libs/mdui/1.0.2/css/mdui.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456111/%E6%88%B4%E6%A3%AE%E7%90%83%E8%AE%A1%E5%88%92%E9%87%8F%E5%8C%96%E8%AE%A1%E7%AE%97%E5%99%A8%E5%B7%A5%E5%85%B7%EF%BC%9A%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/456111/%E6%88%B4%E6%A3%AE%E7%90%83%E8%AE%A1%E5%88%92%E9%87%8F%E5%8C%96%E8%AE%A1%E7%AE%97%E5%99%A8%E5%B7%A5%E5%85%B7%EF%BC%9A%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("css"));
    $("button").attr("class", "mdui-btn mdui-btn-raised mdui-ripple mdui-color-blue-600");
    $("button").attr("style", "margin-bottom:2px");
    var top_allimga = $($("body").children()[3]);
    var top_allimg = $($(top_allimga).children()[0]);
    top_allimg.attr("style", "margin-bottom: -" + (((top_allimg.height() - top_allimga.height()) / 2) + 3.5) + "px;");
    $(".list").attr("style", "margin:0;margin-top:10px");
    $("#txtnumber").attr("class", "mdui-textfield-input");
    $("#selmaince").attr("class", "mdui-select mdui-ripple");
    $("#selmaince").attr("style", "text-align:center");
    $("#seldata").attr("class", "mdui-select mdui-ripple");
    $("#seldata").attr("style", "text-align:center");
    $("#txtnumber").attr("style", "display:inline;text-align:center;height:" + $("#seldata").height() + "px;");

    var top2_div = $($("body").children()[7]);
    top2_div.attr("style", "margin-top:5px;display:flex;flex-direction:row;align-items:center;flex-wrap:wrap;");
    $("#selmodein").attr("class", "mdui-select mdui-ripple");
    $("#selmodein").attr("style", "text-align:center;margin-left:5px;");
    $("#furnace").attr("class", "mdui-select mdui-ripple");
    $("#furnace").attr("style", "text-align:center;margin-left:5px;");
    $("#chemical").attr("class", "mdui-select mdui-ripple");
    $("#chemical").attr("style", "text-align:center;margin-left:5px;");
    $("#accType").attr("class", "mdui-select mdui-ripple");
    $("#accType").attr("style", "text-align:center;margin-left:5px;");
    $("#accValue").attr("class", "mdui-select mdui-ripple");
    $("#accValue").attr("style", "text-align:center;margin-left:5px;");
    $("#selore").attr("class", "mdui-textfield-input");
    $("#selore").attr("style", "display:inline;text-align:center;height:" + $("#seldata").height() + "px;width:40px");
    $("#btnReset2").attr("style", "margin-right:5px");
    $("#btnReset4").attr("style", "margin-right:5px");
    $("#selfAcc").attr("style", "margin-left:5px;margin-right:5px");
    $("#showMaxOneBelt").attr("style", "margin-left:5px;margin-right:5px");
    $(top2_div.children()[11]).attr("style", "margin-left:5px");
    GM_addStyle("#hideSource{margin-right:5px}");

    GM_addStyle("#MoreSetting{margin:0}");
    GM_addStyle(".ms{justify-content: center}");
    GM_addStyle(".number1{display: flex;justify-content: center;}");
    GM_addStyle(".number2{display: flex;justify-content: center;align-items: flex-end;}");
    GM_addStyle(".sicon{margin-right:5px}");
    GM_addStyle(".m{display: flex;justify-content: center;align-items: center;}");

    $(".icon").on('click', function(){
        if(app.xqs.length > 0){
            $($($(".list")[0]).children(":last-child").children()[0]).attr("class", "mdui-btn mdui-btn-raised mdui-ripple mdui-color-blue-600");
            $($($(".list")[0]).children(":last-child").children()[0]).attr("style", "margin-bottom:12.5px");
            $($($(".list")[0]).children(":last-child").children()[1]).attr("class", "mdui-btn mdui-btn-raised mdui-ripple mdui-color-blue-600");
            $($($(".list")[0]).children(":last-child").children()[1]).attr("style", "margin-bottom:12.5px");
            $($($(".list")[0]).children(":last-child").children()[2]).attr("class", "mdui-btn mdui-btn-raised mdui-ripple mdui-color-blue-600");
            $($($(".list")[0]).children(":last-child").children()[2]).attr("style", "margin-bottom:12.5px");

            $($(".cell-name").children()).attr("style", "width: 40px; height: 40px; margin-left:" + (($(".cell-name").width() - 40) / 2) + "px;");
            $('sub').attr("style", "margin-right:5px");
            $('.pf').attr("style", "display:flex;flex-direction:row;align-items:center");
            $('.to').attr("style", "margin-left:3px;margin-right:5px");
            $(".sicon").attr("style", "margin-right:5px");
            $($(".m").children()).attr("style", "margin-right:5px");
        }
    });

})();