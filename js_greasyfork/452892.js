// ==UserScript==
// @name         FB资料库视频图片高度脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.25
// @description  应对2022年10月11日fb资料库视频和图片尺寸缩小导致看不清的脚本，3秒定时器执行。视频默认100%，图片默认349px，可自行修改。 -脚本随缘更新
// @author       LYL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @include     *://www.facebook.com/ads/library/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452892/FB%E8%B5%84%E6%96%99%E5%BA%93%E8%A7%86%E9%A2%91%E5%9B%BE%E7%89%87%E9%AB%98%E5%BA%A6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/452892/FB%E8%B5%84%E6%96%99%E5%BA%93%E8%A7%86%E9%A2%91%E5%9B%BE%E7%89%87%E9%AB%98%E5%BA%A6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("FB资料库视频图片高度脚本启动");
    //视频尺寸
    var imgVideoHeight = "100%";
    timer = setInterval(function() {
        var videoElearr = document.getElementsByTagName("video");
        //2024年2月1日后
        //var videoElearr = document.getElementsByTagName("video");
        var videoElearr = document.querySelectorAll('.x1azusnw.xh8yej3');
        for(var i=0; i< videoElearr.length; i++){
            videoElearr[i].setAttribute("style","height:"+imgVideoHeight +"!important;");
        };
        var imgElearr = document.getElementsByClassName("x1ll5gia");
        for(var j=0; j< imgElearr.length; j++){
            imgElearr[j].setAttribute("style","max-height:"+imgVideoHeight +"!important;");
        };
    }, 3000)
})();