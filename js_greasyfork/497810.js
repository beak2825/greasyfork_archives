// ==UserScript==
// @name         SHUAKEBLALALA--ZJX
// @namespace    http://tampermonkey.net/zhangjiaxiang
// @version      2.2
// @description  ADBC刷课
// @author       Zhangjiaxiang——BLalalala
// @match        https://ce.esnai.net/c/public/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497810/SHUAKEBLALALA--ZJX.user.js
// @updateURL https://update.greasyfork.org/scripts/497810/SHUAKEBLALALA--ZJX.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var num = 0;
    setInterval(function () {
   // alert("2");
    var current_video = document.getElementsByTagName('video')[0];
   // alert("3");
    try{
        var button = document.getElementsByClassName("l-btn l-btn-small").item(1);
        if(button != null){
            button.click();
            if(!current_video.paused){
                num += 1;
                console.log("为你解除暂停" + num + "次");
            }
        }
        if(current_video.paused){
          //current_video.play();
         // alert("4");
          try{
              var playbut = document.getElementsByClassName("pv-icon-btn-play pv-iconfont").item(0);
              playbut.click();
              if(!current_video.paused){
                  num+=1;
                  console.log("为你解除暂停" + num + "次");
              }
          }catch(error){
              console.log(error);
          }
          if(current_video.paused){
              try{
                  document.getElementsByClassName("pv-playpause pv-iconfont pv-icon-btn-play").item(0).click();
              }catch(error){
                  console.log(error);
              }
              if(current_video.paused){
                  current_video.play();
              }
              if(!current_video.paused){
                  num+=1;
                  console.log("为你解除暂停" + num + "次");
              }
          }
        }else{
         // alert("视频正在播放");
        }
    }catch(error){
        console.log(error);
    }}, 5000);
    // Your code here...
})();