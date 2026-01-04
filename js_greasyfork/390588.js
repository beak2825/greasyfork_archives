// ==UserScript==
// @name         虎牙自动最高画质
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  直播间自动切换最高画质
// @author       Cosil
// @include      *www.huya.com/*
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/390588/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/390588/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==
$(function() {
     var t1 = setInterval(function(){
          console.log("t1 is live");
          if($(".player-videotype-cur").html()!=$(".player-videotype-list li:first").html()){
               $(".player-videotype-list li:first").click();
               /*var watch = setInterval(function(){
                    console.log("watch is live");
                    if($(".player-play-big")[0].style.display=="block"){
                         $(".player-play-big").click();
                         clearInterval(watch);
                    }
               },1000);*/
          }else{
               clearInterval(t1);
          }
     },2000);
})