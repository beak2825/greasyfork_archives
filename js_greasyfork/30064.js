// ==UserScript==
// @name 删除百度搜索广告
// @namespace 删除百度搜索广告
// @match *:https://www.baidu.com/*
// @description 删除百度上面的推广和右侧广告
// @version v1.3
// @grant none

// @downloadURL https://update.greasyfork.org/scripts/30064/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/30064/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
$(function(){
   var interval=window.setInterval(function(){
    $("div[data-pos='12']").remove();
     $("div[data-pos='13']").remove();
    $("#content_right").remove() ;
     $("#1").remove()
   },1)
  window.setTimeout(function(){
    window.clearInterval(interval)
  },20000)
   
 })