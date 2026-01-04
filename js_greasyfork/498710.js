// ==UserScript==
// @name         继续教育刷课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  继续教育刷课，不用自己盯着看
// @author       You
// @match        *://m.mynj.cn:11188/*
// @grant        unsafeWindow
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mynj.cn
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/498710/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/498710/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function jumpNext(){
      let progress = document.querySelector(".learnpercent span span").innerText;
      if("已完成" == progress){
          let waitVideo = document.querySelector("#content");
          for(var i=0;i<waitVideo.childNodes.length;i++){
               if(waitVideo.childNodes[i].nodeType==1){
                if((waitVideo.children[i].innerText+"").indexOf("未开始") > 0){
                  console.log(waitVideo.children[i]);
                  document.querySelector("#content_" + (i+1) + "_a").click();
                  document.querySelector(".vjs-big-play-button").click();
                  break;
              }else{
                   console.log("全部完成....");
              }
            }
        }
      }else{
          let btn = document.querySelector("#example_video > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-playing");
          if(document.querySelector("#example_video > button") !=null && btn == null){
              document.querySelector("#example_video > div.vjs-poster").click()
          }
         console.log("没有完成....");
      }
      setTimeout(jumpNext, 3000);
    }
    // 每3s检查一次
    setTimeout(jumpNext, 3000)
})();