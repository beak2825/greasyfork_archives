// ==UserScript==
// @name         AucFox搜索影视插件 - 支持腾讯视频、爱奇艺、芒果、优酷、搜狐影视快捷搜索到AucFox影视
// @namespace    http://tampermonkey.net/
// @version      12.26
// @description  AucFox影视搜索是一个轻量型的搜剧引擎。安装脚本后在播放页右下角可以看到AucFox影视搜索框，可以跳转到AucFox影视搜索看剧
// @author       AucFox搜索
// @match        *://v.qq.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://*.bilibili.com/*
// @match        *://tv.sohu.com/*
// @icon         https://www.aucfox.fun/mxtheme/images/favicon.png
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/474117/AucFox%E6%90%9C%E7%B4%A2%E5%BD%B1%E8%A7%86%E6%8F%92%E4%BB%B6%20-%20%E6%94%AF%E6%8C%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E6%90%9C%E7%8B%90%E5%BD%B1%E8%A7%86%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2%E5%88%B0AucFox%E5%BD%B1%E8%A7%86.user.js
// @updateURL https://update.greasyfork.org/scripts/474117/AucFox%E6%90%9C%E7%B4%A2%E5%BD%B1%E8%A7%86%E6%8F%92%E4%BB%B6%20-%20%E6%94%AF%E6%8C%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E6%90%9C%E7%8B%90%E5%BD%B1%E8%A7%86%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2%E5%88%B0AucFox%E5%BD%B1%E8%A7%86.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
    var url = `https://www.aucfox.fun`
    var html = `<style>
    #player{position: relative;}
    .sanu{
        position: absolute;
    bottom: 131px;
    right: 5px;
        height: 35px;
        display: flex;
        line-height: 35px;
        text-align: center;
        border-radius: 15px;
        z-index:1000000000000000000;
        background-color: rgba(255,255,255,.1);
    }
    .sanu input{
        width: 200px;
            outline: none;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        padding-left:10px;
        border:0;
        background-color: rgba(255,255,255,.1);
        color:#fff;
    }
    .sanu div{
        display: block;
        text-decoration: none;
            cursor: pointer;
        width: 90px;
        padding: 0 5px;
        background:#007aff;
        color:#fff;
            display: flex;
    align-items: center;
    justify-content: space-around;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
    }
</style>
<div class="sanu">
    <input id="inputs" placeholder="电影 / 电视 / 动漫" type="text"/>
    <div id="myc"><svg class="svg_icon svg_icon_search" viewBox="0 0 18 18" width="18" height="18"><path d="M4.5 4.5c-1.9 1.9-1.9 5.1 0 7.1s5.1 1.9 7.1 0 1.9-5.1 0-7.1-5.2-2-7.1 0zm10.8 12.2l-3.1-3.1c-2.7 2-6.6 1.9-9.1-.6C.3 10.2.3 5.8 3 3 5.7.3 10.2.3 12.9 3c2.5 2.5 2.7 6.4.6 9.1l3.1 3.1c.4.4.4 1 0 1.4-.3.5-.9.5-1.3.1z" fill="currentColor"></path></svg>AUC搜索</div>
</div>`
var llqurl = window.location.href
//爱奇艺
if(llqurl.indexOf(`iqiyi.com`) !== -1){
    var timeFun = setTimeout(function () {
    $("meta").each(function(){
        let title = $(this).attr("name")
    if(title == "irAlbumName"){
            title = $(this).attr("content")
    $("#inputs").val(title)
}
    })
    clearTimeout(timeFun)
}, 5000);
$(".iqp-player-videolayer-inner").prepend(html)
 
}
//腾讯视频
if(llqurl.indexOf(`v.qq.com`) !== -1){
$("#player").prepend(html)
    let title = $(".playlist-intro__title").text()
    $("#inputs").val(title)
}
//芒果
if(llqurl.indexOf(`mgtv.com`) !== -1){
$("container").prepend(html)
let title = $("div.m-aside-header.m-aside-header-ie > h2 > div").text()
$("#inputs").val(title)
}
//优酷
if(llqurl.indexOf(`youku.com`) !== -1){
$(".play-paction-wrap").prepend(html)
let title = $("#module_basic_dayu_sub > div > div.thesis-wrap > a").text()
    $("#inputs").val(title)
}
    //乐视
if(llqurl.indexOf(`le.com`) !== -1){
$("#video").prepend(html)
let title = $("div.juji_bar.j_jujiName").text()
    $("#inputs").val(title)
}
    //哔哩哔哩
if(llqurl.indexOf(`bilibili.com`) !== -1){
$("#bilibili-player").prepend(html)
let title = $("#viewbox_report > h1").text()
    $("#inputs").val(title)
}
        //搜狐
if(llqurl.indexOf(`sohu.com`) !== -1){
$(".x-player").prepend(html)
let timeFun = setTimeout(function () {
    $("meta").each(function(){
let title = $(this).attr("name")
if(title == "album"){
title = $(this).attr("content")
    $("#inputs").val(title)
}
    })
    clearTimeout(timeFun)
}, 5000);
}
$("#myc").click(function(){
    let tit = $("#inputs").val()
    window.open(`${url}/vodsearch/-------------.html?wd=${tit}`);
})
})();