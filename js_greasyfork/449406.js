// ==UserScript==
// @name        accschool刷课防暂停
// @namespace   accschool
// @match       https://accschool.asus.com.cn/kng/*
// @require     https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant       unsafeWindow
// @grant       none
// @version     1.1
// @author      jackson
// @description 华硕学院防暂停
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449406/accschool%E5%88%B7%E8%AF%BE%E9%98%B2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/449406/accschool%E5%88%B7%E8%AF%BE%E9%98%B2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==
'use strict';
setTimeout(function(){
  document.title = '刷课中……';
  // 设置间隔定时器
  setInterval(function(){
      // 选中播放按钮
      var video = $('#videocontainer .vjs-tech #vjs_video_1_html5_api')[0];
      video.pause();
      video.play();
  },600000);
  //alert("防暂停脚本已运行");
}, 3000);