// ==UserScript==
// @name         自动学习
// @namespace    http://play.hnzjpx.net/
// @version      0.321
// @description  自动切换，自动模拟鼠标移动--- 开放大学  1.打开播放界面即可（脚本会自动模拟鼠标移动与切换下个视频）. 2.选择地址里面较小的（如http://play.hnzjpx.net/player/483/play?package_id=80） 3.仅仅适配湖南广播大学/湖南开发大学    4.出现播放卡顿，建议上下切换视频         
// @author       MEN
// @match        http://play.hnzjpx.net/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440224/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/440224/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 483 -496
var tag =1

//设置当前播放倍速为15倍
function playback_(){
    console.log("设置视频播放倍速为15")
    document.getElementById(document.getElementById("video").childNodes[0].childNodes[0].id).playbackRate =16
}

//换一段视频
function next_() {
    console.log("执行换视频事件！！！")
    window.location.href = window.location.href.replace(/[0-9][0-9][0-9]/,parseInt(window.location.href.match(/[0-9][0-9][0-9]/))+1);
}

//触发鼠标点击事件
function mouse_(){
   if(tag !== 0){
      console.log("执行鼠标事件")
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("mousemove", false, false);
      document.dispatchEvent(evt);
  }
}

//监听当前播放状态

function video_() {
    console.log("执行播放监听事件"+tag)
    document.getElementById(document.getElementById("video").childNodes[0].childNodes[0].id).addEventListener("playing",function (){
       console.log("播放没有结束，修改切换标志")
        tag = 1;
    })
    if(tag === 0){
     document.getElementById(document.getElementById("video").childNodes[0].childNodes[0].id).addEventListener("ended",next_())
    }

    document.getElementById(document.getElementById("video").childNodes[0].childNodes[0].id).addEventListener("ended",function (){
       console.log("播放可能结束，执行切换下一页事件")
        tag = 0;
    })
    mouse_();
}
setInterval(playback_,12000)  //设置延迟1分钟启动15倍速播放，防止网络卡顿
setInterval(video_,600000)
setInterval(mouse_,120000)



})();