// ==UserScript==
// @name         跳过bilibili充电鸣谢
// @namespace    我的博客地址
// @version      0.2
// @description  描述我的功能
// @author       Dly  名字
// @match        https://www.bilibili.com/video/*
// @icon         https://iconfont.alicdn.com/t/08cb107f-5ce1-464a-b2d4-9ccea0b83831.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440573/%E8%B7%B3%E8%BF%87bilibili%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/440573/%E8%B7%B3%E8%BF%87bilibili%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.meta.js
// ==/UserScript==
(function() {
     setTimeout(()=>{
      //获取视频元素dom                         绑定一个视频播放完之后的事件
          document.getElementsByTagName('bwp-video')[0].onended=()=>{
          //获取播放下一个视频的按钮  点击
              document.getElementsByClassName('bilibili-player-video-btn-next')[0].click()
          }
      },5000)
      
})();