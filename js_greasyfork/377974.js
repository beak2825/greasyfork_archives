// ==UserScript==
// @name         mebook小书屋在书目添加快速下载功能
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  结合插件【mebook小书屋自动跳转百度云并填写密码】实现在首页即可直接快捷下载图书的功能
// @author       Kakyuren
// @match        http://mebook.cc/*
// @match        http://www.shuwu.mobi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377974/mebook%E5%B0%8F%E4%B9%A6%E5%B1%8B%E5%9C%A8%E4%B9%A6%E7%9B%AE%E6%B7%BB%E5%8A%A0%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/377974/mebook%E5%B0%8F%E4%B9%A6%E5%B1%8B%E5%9C%A8%E4%B9%A6%E7%9B%AE%E6%B7%BB%E5%8A%A0%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hrefs = document.getElementsByClassName("link");
    var i = 0;
    for(;hrefs.item(i).innerHTML;)
    {
        var reg = /[0-9]+/g;
        var booknum =hrefs.item(i).innerHTML.match(reg);
        var domain = window.location.host;
        var url = booknum+".html";
        if(url){
            hrefs.item(i).innerHTML='<a href="http://'+domain+'/'+booknum+'.html">阅读全文...</a> <a href="http://'+domain+'/download.php?id='+booknum+'">百度云盘快速下载</a>';
        }
        i++;
    }
})();