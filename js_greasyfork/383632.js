// ==UserScript==
// @name         视频网站播放去LOGO水印
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  try to take over the world!
// @author       JusTay
// @match        *://*.iqiyi.com/*
// @match        *://v.youku.com/*
// @match        *://v.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383632/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E6%92%AD%E6%94%BE%E5%8E%BBLOGO%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/383632/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E6%92%AD%E6%94%BE%E5%8E%BBLOGO%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var videoSite = window.location.href;
    var reYk = /youku/i;
    var reAqy = /iqiyi/i;
    var reTX = /qq/i;
     // 优酷
    if(reYk.test(videoSite)){
var count = 0;
var sbTx = setInterval(function(){
        count++;
        var txDd = document.querySelectorAll("[class^='youku-layer-logo']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           clearInterval(sbTx)
         }
     },500)
    }

    // 爱奇艺
    if(reAqy.test(videoSite)){
var count1 = 0;
var sbTx1 = setInterval(function(){
        count1++;
        var txDd = document.querySelectorAll("[class^='iqp-logo-box']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           clearInterval(sbTx1)
         }
     },500)
    }
    //腾讯视频
    if(reTX.test(videoSite)){
           var count2 = 0;
var sbTx2 = setInterval(function(){
        count2++;
        var txDd = document.querySelectorAll("[class^='txp_waterMark_pic']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           clearInterval(sbTx2)
         }
     },500)
    }

    //腾讯视频独播
    if(reTX.test(videoSite)){
           var count3 = 0;
var sbTx3 = setInterval(function(){
        count3++;
        var txDd = document.querySelectorAll("[class^='txp-watermark']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           clearInterval(sbTx3)
         }
     },500)
    }
    if(reTX.test(videoSite)){
           var count4 = 0;
var sbTx4 = setInterval(function(){
        count4++;
        var txDd = document.querySelectorAll("[class^='txp-watermark-action']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           clearInterval(sbTx4)
         }
     },500)
    }

     // 优酷独播
    if(reTX.test(videoSite)){
           var count5 = 0;
var sbTx5 = setInterval(function(){
        count5++;
        var txDd = document.querySelectorAll("[class^='spv-exclusive']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           clearInterval(sbTx5)
         }
     },500)
    }





})();