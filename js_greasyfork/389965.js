// ==UserScript==
// @icon            http://weibo.com/favicon.ico
// @name            大伟吉他教室破解vip乐谱
// @namespace       [url=mailto:QAZgwc123@qq.com]QAZgwc123@qq.com[/url]
// @author          NMSL
// @description     免费观看vip乐谱
// @match           *://www.daweijita.com/*
// @version         0.0.1
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/389965/%E5%A4%A7%E4%BC%9F%E5%90%89%E4%BB%96%E6%95%99%E5%AE%A4%E7%A0%B4%E8%A7%A3vip%E4%B9%90%E8%B0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/389965/%E5%A4%A7%E4%BC%9F%E5%90%89%E4%BB%96%E6%95%99%E5%AE%A4%E7%A0%B4%E8%A7%A3vip%E4%B9%90%E8%B0%B1.meta.js
// ==/UserScript==
(function () {
    'use strict';
    window.onload = function(){
  var a=document.querySelectorAll("img[alt^=fufei]")[0].src ;
  var b=a.replace(/fufei_(.*)\.gif/,"tab_$1_1.gif").replace("_guitar_","_") ;
  var c=a.replace(/fufei_(.*)\.gif/,"tab_$1_2.gif").replace("_guitar_","_") ;
  var d=a.replace(/fufei_(.*)\.gif/,"tab_$1_3.gif").replace("_guitar_","_") ;
  var e=a.replace(/fufei_(.*)\.gif/,"tab_$1_4.gif").replace("_guitar_","_") ;
  var f=a.replace(/fufei_(.*)\.gif/,"tab_$1_5.gif").replace("_guitar_","_") ;
  var g=a.replace(/fufei_(.*)\.gif/,"tab_$1_6.gif").replace("_guitar_","_") ;
  var h=a.replace(/fufei_(.*)\.gif/,"tab_$1_7.gif").replace("_guitar_","_") ;
  var i=a.replace(/fufei_(.*)\.gif/,"tab_$1_8.gif").replace("_guitar_","_") ;
  document.getElementById('paydown').innerHTML = "<img src=" + b + "><img src=" + c + "><img src=" + d + "><img src=" + e + "><img src=" + f + "><img src=" + g + "><img src=" + g + "><img src=" + i + ">";
  document.getElementsByClassName("widget-content")[4].remove()
  
    
    
    }
 })();