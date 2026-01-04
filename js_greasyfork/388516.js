// ==UserScript==
// @name         mzitu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  展示当前主题图片省翻页&打包下载
// @author       z0574
// @match        https://*.mzitu.com/*
// @downloadURL https://update.greasyfork.org/scripts/388516/mzitu.user.js
// @updateURL https://update.greasyfork.org/scripts/388516/mzitu.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //获取图片所在a标签
    var a=document.getElementsByClassName("main-image")[0].getElementsByTagName("a")[0]
    //移除点击属性
    a.removeAttribute("href")
    //得到图片url地址，并截取公共部分
    var url = a.getElementsByTagName("img")[0].src
    var urlLeft = url.substring(0,url.length-6)
    //获取总页数
    var pageDiv = document.getElementsByClassName("pagenavi")[0]
    var pageSpan=pageDiv.getElementsByTagName("span")
    var page = pageSpan[pageSpan.length-2].innerHTML
    //创建img元素
    for(var i = 2;i<=page;i++){
        var img = document.createElement("img")
        if(i<10){
            img.src=urlLeft+"0"+i+".jpg"
        }else{
            img.src=urlLeft+i+".jpg"
        }
        a.appendChild(img)
    }
})();