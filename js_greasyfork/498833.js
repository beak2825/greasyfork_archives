// ==UserScript==
// @name         继续播放2.1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学习平台自动继续播放
// @author       chan
// @match        https://edu.changan.com.cn/student/courseplay/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=changan.com.cn
// @grant        none
// @requirehttps://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/498833/%E7%BB%A7%E7%BB%AD%E6%92%AD%E6%94%BE21.user.js
// @updateURL https://update.greasyfork.org/scripts/498833/%E7%BB%A7%E7%BB%AD%E6%92%AD%E6%94%BE21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    printlog("开始检测暂停。。。");
    setInterval(playyyyy,1*60*1000);
    function playyyyy(){
        // var replay = $('[type="button"]');
        // var dombutton = document.getElementsByTagName("button");
        // console.log(dombutton);
        var play_ctrl = $(".vjs-paused .vjs-play-control");
        if(play_ctrl && play_ctrl.length > 0){
            setTimeout(function(){
              printlog("去掉确认框！");
              $(".el-message-box__wrapper").remove();
              $(".v-modal").remove();
            }, 1000);
            play_ctrl.click();
            printlog("又暂停了。。。")
        } else {
//             if(replay && replay.length > 0){
//                 console.log("暂停播放出现了！点击确认继续播放=> " + new Date().toLocaleTimeString())
//                 replay.click();
//                 $(".el-message-box__wrapper").remove();
//             }else{
//                 console.log("暂停播放没有出现！=> " + new Date().toLocaleTimeString())
//             }
          printlog("暂停播放没有出现！")
        }
    }
    // Your code here...
  function printlog(log){
    console.log(log + " => " + new Date().toLocaleTimeString())
  }
})();