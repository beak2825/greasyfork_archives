// ==UserScript==
// @name         Search book in THU lib
// @namespace    github.com/tandf
// @version      0.2
// @description  在清华图书馆搜索豆瓣中的图书
// @author       tandf
// @match        https://book.douban.com/subject/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369896/Search%20book%20in%20THU%20lib.user.js
// @updateURL https://update.greasyfork.org/scripts/369896/Search%20book%20in%20THU%20lib.meta.js
// ==/UserScript==

$(document).ready(function(){
    var titleSpan = $("[property = 'v:itemreviewed']");
    var title = titleSpan.text();
    var url = 'https://tsinghua-primo.hosted.exlibrisgroup.com/primo-explore/search?query=any,contains,' + title +'&tab=default_tab&search_scope=default_scope&vid=86THU&lang=zh_CN';

    var btn = document.createElement("button");
    btn.id = "searchBtn";
    titleSpan.after(btn);

    $("#searchBtn").text("在清华大学图书馆搜索").css({"background-color": "transparent", "padding": "2px 2px", "font-size": "14px", "border": "0px", "color": "#3377aa", "text-align": "center"});
    $("#searchBtn").mouseenter(function(){$("#searchBtn").css({"background-color": "#3377aa", "color": "white", "cursor": "pointer"})});
    $("#searchBtn").mouseleave(function(){$("#searchBtn").css({"background-color": "transparent", "color": "#3377aa"})});
    $("#searchBtn").click(function(){
        window.open(url);
    })
})