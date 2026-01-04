// ==UserScript==
// @name         自动学习
// @namespace    http://tampermonkey.net/
// @version     2027.7.13
// @author      nome
// @description  2024
// @match        https://zyjstest.lngbzx.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlteacher.com
// @license      NOME
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500529/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/500529/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
  // 监听，如果窗口变为活跃，那么强制刷新页面
 (function () {
  'use strict';
  function open() {
    window.location.reload();
  }
  // 监听，如果窗口变为活跃，那么强制刷新页面
  function isFocus() {
    if (!document.hidden) {
      window.location.reload();
      console.log("Refresh the course status!");
    }
  }
  document.addEventListener("visibilitychange", isFocus);

  function coursesPage() {
      // 当且仅当窗口活跃
      if (!document.hidden) {
        setTimeout(() => console.log("mainpage waiting..."), 500);
        var buttons = document.getElementsByClassName("Save");

        // 寻找并点击下一个未点击过的"继续学习"按钮
      // 优先寻找并点击“开始学习”按钮
        for (var i = 0; i < buttons.length; i++) {
          var spans = document.getElementsByClassName("Save");
          for (var j = 0; j < spans.length; j++) {
            if (spans[j].innerText && spans[j].innerText.includes("开始学习")) {
              buttons[i].click();
              return;
            }
          }
        }
        console.log("没有找到可点击的按钮，重置状态");
       
      }
    }


  setInterval(coursesPage, 3000);


  function play() {
   // document.getElementsByClassName("el-button").click()
    var butt = document.getElementsByClassName("el-button");
      // for (var k = 0; k < butt.length; k++) {

           if (document.getElementsByClassName("el-dialog__body").length> 0 ){
        butt[1].click();

      }

           //}
      // 播放视频



         console.log("没有找到可点击的按钮，没有播放")
            const video = document.querySelector('video')
            video.play();
            video.addEventListener('ratechange',function(){
                video.playbackRate=2.5
            })
            video.playbackRate=2.5
             video.addEventListener("ended", function() {
           setTimeout(()=>{window.close();},1000)
                // setTimeout(() => { location.reload();},1000)
               })
  }

  setInterval(play, 1000)
})();
