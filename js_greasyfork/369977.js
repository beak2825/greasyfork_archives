// ==UserScript==
// @name         YYETS字幕查找
// @namespace    http://tampermonkey.net/
// @version      0.1
// @icon         http://files.zmzjstu.com/images/dibulogo.png
// @description  YYTES网站下载页面添加zimuku直接搜索按钮
// @author       qhq
// @match        http://zmz003.com/*
// @downloadURL https://update.greasyfork.org/scripts/369977/YYETS%E5%AD%97%E5%B9%95%E6%9F%A5%E6%89%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/369977/YYETS%E5%AD%97%E5%B9%95%E6%9F%A5%E6%89%BE.meta.js
// ==/UserScript==

(function() {

    var TAB = $("div[id$='-720P']");
    var ITEMS = $(TAB).children(".down-list").children(".item");
    [].forEach.call(ITEMS, function (ITEM) {
        var filename=$(ITEM).children(".title").children("span[class='filename']").attr("data-original-title");
        var title = filename.substr(0,filename.length-4);
        var downlink=$(ITEM).children(".down-links").children();
        var pianyuanBtn = '<li><a class="btn btn-download" href="https://www.zimuku.cn/search?q=' + title + '" target="_blank"><p class="desc">字幕</p></a></li>';
        var btnDownload = $(downlink).parent();
        btnDownload.append(pianyuanBtn);
        //console.log(title);
    });
})();