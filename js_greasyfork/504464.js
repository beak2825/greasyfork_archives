// ==UserScript==
// @name         干部在线
// @namespace    http://tampermonkey.net/
// @version      3.2
// @author       NOME
// @description  2024
// @match        https://zyjstest.lngbzx.gov.cn/pc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlteacher.com
// @license      NOME
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504464/%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/504464/%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF.meta.js
// ==/UserScript==
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
  let currentButtonIndex = -1;
  let clickedButtons = new Set();
//关闭弹窗
    function closewin(){
     var cl = document.getElementsByClassName("v-modal")
     if (cl.length >0 ){
 document.getElementsByClassName("el-message-box__wrapper")[0].remove()
         cl[0].remove()
     }
    }
setInterval(closewin, 1000)
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
       // console.log("没有找到可点击的按钮，重置状态");
        currentButtonIndex = -1;
        clickedButtons.clear();
      }
    }
setInterval(coursesPage, 3000);
function courset(){
    var a=document.getElementsByClassName("el-message-box__title")
    if (a.length > 0){
var index=parent.layer.getFrameIndex(window.name);
parent.layer.close(index);
    }
}
  setInterval(courset, 3000);
  function play() {
   // document.getElementsByClassName("el-button").click()
  // var valu= document.getElementsByClassName("el-progress el-progress--line")[0];
   //进度
   var butt = document.getElementsByClassName("el-button");
      // for (var k = 0; k < butt.length; k++) {
           if (document.getElementsByClassName("el-dialog__body").length> 0 ){
        butt[1].click();
//let video = document.getElementsByTagName('video')
	//video[0].play();
	//video[0].pause();
  //  video[0].currentTime = video[0].duration-10
	//video[0].play();
}
             //}
      // 播放视频
        // console.log("没有找到可点击的按钮，没有播放")
            const video = document.querySelector('video')
            video.play();
            video.addEventListener('ratechange',function(){

                if (video.currentTime < video.duration -60){
                   video.playbackRate=5
                }else {
                      video.playbackRate=1
                }

            })
         if (video.currentTime < video.duration -60){
                   video.playbackRate=5
                }else {
                      video.playbackRate=1
                }
             video.addEventListener("ended", function() {
           setTimeout(()=>{window.close();},1000)
                // setTimeout(() => { location.reload();},1000)
               })
  }

  setInterval(play, 1000)
})();
