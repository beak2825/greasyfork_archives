// ==UserScript==
// @name         专技天下自动播放
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  当视频播放超时建议休息时，自动点击确定，并且开始播放。监听到播放完当前小节后，自动播放下一节。
// @author       高大大
// @match        https://*.zgzjzj.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395162/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/395162/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".vjs-big-play-button").click();
    setInterval(function(){
        if($(".vjs-play-progress").attr("style")){
           var a  = $(".vjs-play-progress").attr("style");
           var b = a.substring(7);
        }
        $("video.vjs-tech").prop("muted",true);
        //console.log(b)
        if($(".vjs-play-control").attr("title") == "Play"){
           $(".vjs-play-control").click();
           }else if(b == "100%;"){
           $("div.navigate > ul > li").children().eq(2).click();
               //console.log("ok")
           }else if($("div.el-message-box__wrapper").css("display")!=="none"){
                   $("div.el-message-box__btns").children("button.el-button").click()
         }
    }, 3000);
})();