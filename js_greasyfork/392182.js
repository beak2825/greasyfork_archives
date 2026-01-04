// ==UserScript==
// @name         极客时间深色主题
// @namespace    http://youguanxinqing.xyz/
// @version      0.4
// @description  Change Color During Reading!
// @author       youguanxinqing
// @match        https://time.geekbang.org/column/article/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @grant        none
// @note         参考 极客时间专栏 WEB 页面剪贴板功能还原 实现，感谢作者
// @downloadURL https://update.greasyfork.org/scripts/392182/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/392182/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

var backgroundSelector = "#app > div"
var wordSelector = "#app > div.ArticlePC_wrap_1ysv2 > div.ArticlePC_main_1Q_iz > div.ArticlePC_contentWrap_ibY_s > div > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div > div.ArticlePC_articleContent_2SKln > div.RichContentPC_main_1kh1i.ArticlePC_richConent_2i1yt > div.RichContentPC_wrap_3TuZW > div > div"
var commentSelector = "#app > div > div > div > div > div > ul > li > div > div > div"
var boldWordSelector = "span[data-slate-object=mark][data-slate-type=bold]"
var leftTitleSelector1 = ".simplebar-content ._2NgRM2G9_0"
var leftTitleSelector2 = ".simplebar-content ._3DJrlH2u_0"

waitForKeyElements (backgroundSelector, changeBackground);
waitForKeyElements (wordSelector, changeWordColor);
waitForKeyElements (commentSelector, changeCommentColor);
waitForKeyElements (boldWordSelector, changeBoldWordColor);
waitForKeyElements (leftTitleSelector1, changeLeftColor1);
waitForKeyElements (leftTitleSelector2, changeLeftColor2);


function changeBackground() {
    'use strict';

    // Your code here...
    $("#app > div > div").css({"background": "rgb(45,49,44)", "border": "0px"}) // 右上
    $("#app > div > div > div").css({"background": "rgb(45,49,44)", "border": "0px"}) // 页眉，正文，左栏背景
    $("#app > div:first > div:first > div:first").css({"background": "", "border": "0px"}) // 显示 logo
    $("#app > div > div > div > div").css({"color": "gray", "border": "0px"}) // 左栏边框
    // $(backgroundSelector).css({"background": "white"})  // 右下（正文块背景）
}

function changeWordColor() {
    $(wordSelector).css({"color": "wheat"})  // 正文

    $("").css("color", "wheat")
    // $("#app > div > div > div > div > div > div > div").css({"color": "wheat"}) // 左栏章节
    // h1 ... h6
    var hArray = new Array("h1", "h2", "h3", "h4", "h5", "h6")
    hArray.forEach(function(item, i){
        $(item).css({"color": "wheat"})
    })
}

function changeLeftColor1() {
    $(".simplebar-content ._2NgRM2G9_0").css("color", "wheat")
}

function changeLeftColor2() {
    $(".simplebar-content ._3DJrlH2u_0").css("color", "wheat")
}

function changeCommentColor() {
    $('.CommentItemPC_main_2sjJG').each((_, item) => { $(item).find("div.CommentItemPC_bd_2_Qra").css({"color": "wheat"}) })
    $(commentSelector).css({"color": "wheat"})
}

function changeBoldWordColor() {
    $(boldWordSelector).css({"color": "#ce7a12"}) // 正文加粗
}