// ==UserScript==
// @name         B站去广告
// @namespace    wushx
// @version      1.0
// @description  B站去广告视频页面的广告去除与美化视频播放页面
// @author       wushx
// @match        https://www.bilibili.com/video/*
// @requires     jQuery
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441052/B%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/441052/B%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setInterval(function(){
        //去除广告
         $('.vcd').remove();
         $('#activity_vote').remove();

        $('.ad-report').remove();
        $('#live_recommand_report').remove();
        //去更多播放（如果你需要可以去除这一句，我喜欢简单清晰的页面）
         $('#reco_list').remove();
　　},1000);　
　　
　　//随机函数
　　function randoms(max,min){
    if(min===undefined) min=0;
    return Math.floor(Math.random()*(max-min)+min);
 }
 
 //随机颜色
 function randomColor(){
    var col="#";
     for(var i=0;i<6;i++){
         col+=this.randoms(16).toString(16);
     }
     return col;
 }
　//获取浏览器名称
　function getBrowserRV(){
     var str=navigator.userAgent;
     // 判断是否是Chrome
     if(str.indexOf("Chrome")>-1){
         var index=str.indexOf("Chrome");
         return str.slice(index,str.indexOf(" ",index+1)).split("/");
     }
      // 判断是否是Firefox
     if(str.indexOf("Firefox")>-1){
         var index=str.indexOf("Firefox");
         return str.slice(index).split("/");
     }
     // 判断是否是IE11
     if(str.indexOf("rv:")>-1 && str.indexOf("Trident")>-1){
         return ["IE","11"];
     }
     // 判断是否是IE10及以下
     if(str.indexOf("Trident")>-1){
         var index=str.indexOf("MSIE");
         return ["IE",str.slice(index,str.indexOf(";",index)).split(" ")[1]];
     }
 }
　　
　　
})();