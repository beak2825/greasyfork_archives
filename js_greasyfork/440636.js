// ==UserScript==
// @name         VoController
// @namespace    https://github.com/Thatchasingman/cite/blob/master/VoController.js
// @version      1.1.0
// @description  脱离鼠标点击，用键盘控制播放与选项！！！Q=> 暂停/播放；W => 打开字幕；A=> 选择左侧答案；D=>选择右侧答案；S=> 下一个视频；
// @author       星明窝
// @match        https://www.voscreen.com/*
// @include      https//*.voscreen.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voscreen.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/440636/VoController.user.js
// @updateURL https://update.greasyfork.org/scripts/440636/VoController.meta.js
// ==/UserScript==
 var count = 0 ;
document.addEventListener('keydown',(e)=>{
  const oplay = document.querySelector('.o-player__video');
  const next = document.querySelector('.o-player__next');
  const alsub = document.querySelectorAll('.o-player__subtitle-question');
  const alquest = document.querySelectorAll('.c-player-answer');
 const fscreen  = document.querySelector('.c-player-mode-switch__button');
  if(oplay && e.keyCode == 81){
    oplay.currentTime = 0;
    oplay.play();
  }
  // 下一个视频
  if(next && e.keyCode == 83){
    next.click();
  }
  // 显示隐藏字幕
  if(alsub.length && e.keyCode == 87){
    count++;
    alsub[count%2].click();
  }
  // 选择左侧
  if(alquest.length && e.keyCode == 65){
    alquest[0].click();
  }
  // 选择右侧
  if(alquest.length && e.keyCode == 68){
    alquest[1].click();
   //fullsreen
    if(fscreen && e.keyCode == 70) {
    fscreen.click();
    }
  }
});