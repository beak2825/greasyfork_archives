// ==UserScript==
// @name         江苏教师
// @namespace    http://tampermonkey.net/
// @homepage     https://www.wangxingyang.com/jstescript.html
// @version      0.1
// @description  江苏教师教育自动刷课助手
// @author       freefitter
// @match        *://jste.lexiangla.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/454809/%E6%B1%9F%E8%8B%8F%E6%95%99%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/454809/%E6%B1%9F%E8%8B%8F%E6%95%99%E5%B8%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function jumpNext(){
      //console.log("开始执行跳过脚本");
      // 确定按钮
      let okBtn = document.getElementsByClassName("venom-btn-primary").length;
      // 播放按钮
      let playBtn = document.getElementsByClassName("vjs-big-play-button").length;
      // 是否正在播放
      let isPlay = document.getElementsByClassName("vjs-playing").length;
      if(okBtn > 0){
          document.getElementsByClassName("venom-btn-primary")[0].click();
          console.log("模拟点击确定按钮");
      }

      if(playBtn > 0 && isPlay == 0){
          document.getElementsByClassName("vjs-big-play-button")[0].click();
          document.getElementsByClassName("vjs-paused")[0].click();
          console.log("模拟点击播放按钮");
          document.getElementsByClassName("vjs-mute-control")[0].click();
          console.log("模拟点击静音按钮");
      }
      setTimeout(jumpNext, 3000);
    }
    // 每3s检查一次
    setTimeout(jumpNext, 3000)
})();