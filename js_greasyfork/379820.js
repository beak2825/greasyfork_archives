// ==UserScript==
// @name 稍后再看自动跳转
// @description 修改稍后再看列表页面链接至正常页面，稍后再看播放页面自动跳转到正常页面。
// @namespace 稍后再看自动跳转
// @match *://www.bilibili.com/watchlater/*
// @grant none
// @version 0.0.1.20191124045741
// @downloadURL https://update.greasyfork.org/scripts/379820/%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/379820/%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


var url = location.href;
var protocol = location.protocol;
var av = url.indexOf("av");
var p = url.lastIndexOf("p");

if(url.indexOf("watchlater/"&&"/av")!=-1)
{
    location.href=(protocol + "//www.bilibili.com/" + url.substring(av,p) + "?p=" + url.substring(p+1));
}

window.onload = function()
{
    var fff = document.getElementsByTagName("a");
    for(var i=0;i< fff.length;i++)
    {
        if(fff[i].href.indexOf("watchlater")!=-1)
        {
            
            fff[i].href = fff[i].href.replace(/\/watchlater\/#\/av/, "/av");
            fff[i].href = fff[i].href.replace(/\/p/, "?p=");
        }
    }
}
