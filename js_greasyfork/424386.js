// ==UserScript==
// @name         阿里云盘网页播放增强(视频前进后退5秒/音量10级调整)
// @namespace    cocoa.yui
// @version      0.3.1
// @description  空格键控制播放，左右键控制前进后退5秒，上下键控制音量10级调整。配合使用阿里云盘(隐藏进度条...)页面优化(css)脚本https://greasyfork.org/zh-CN/scripts/424170
// @author       You
// @match        https://www.aliyundrive.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424386/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E7%BD%91%E9%A1%B5%E6%92%AD%E6%94%BE%E5%A2%9E%E5%BC%BA%28%E8%A7%86%E9%A2%91%E5%89%8D%E8%BF%9B%E5%90%8E%E9%80%805%E7%A7%92%E9%9F%B3%E9%87%8F10%E7%BA%A7%E8%B0%83%E6%95%B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424386/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E7%BD%91%E9%A1%B5%E6%92%AD%E6%94%BE%E5%A2%9E%E5%BC%BA%28%E8%A7%86%E9%A2%91%E5%89%8D%E8%BF%9B%E5%90%8E%E9%80%805%E7%A7%92%E9%9F%B3%E9%87%8F10%E7%BA%A7%E8%B0%83%E6%95%B4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
var ttt=1
document.onkeyup = function (event) {
console.log("keyCode:" + event.keyCode);
var e = event || window.event || arguments.callee.caller.arguments[0];
if (e && e.keyCode === 37) {
var videoElement = document.getElementsByClassName("video--26SLZ")[0]//[0]
videoElement.currentTime -= 5;
return false;
} else if (e && e.keyCode === 32) {
videoElement = document.getElementsByClassName("video--26SLZ")[0]
if(ttt==1){videoElement.pause();ttt=0}else{videoElement.play();ttt=1}
return false;
}else if (e && e.keyCode === 39) {
//2-50
videoElement = document.getElementsByClassName("video--26SLZ")[0]//[0]
videoElement.currentTime += 5;
return false;
}else if (e && e.keyCode === 38) {
videoElement = document.getElementsByClassName("video--26SLZ")[0]
videoElement.volume+=.1;
return false;
}else if (e && e.keyCode === 40) {
videoElement = document.getElementsByClassName("video--26SLZ")[0]
videoElement.volume-=.1;
return false;}} //  },5000)
    // Your code here...
})();