// ==UserScript==
// @name         视频助手
// @namespace    https://github.com/Aoerz/UserScripts
// @version      0.2
// @description  使用键盘控制视频播放
// @author       Aoerz
// @include      https://www.icourse163.org/*
// @include      https://www.xuetangx.com/*
// @include      https://www.coursera.org/*
// @include      https://www.bilibili.com/*
// @include      https://v.qq.com/*
// @include      https://www.iqiyi.com/*
// @include      https://v.youku.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381103/%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/381103/%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
  "use strict";
  var skipTime = 10;
  var skipVolume = 0.1;
  var volumeTemp;
  function xuetangxAssistant() {
    document.onkeydown = function(e) {
      var evt = e || window.event;
      var v = document.querySelector("video");
      event.preventDefault();
      switch (evt.keyCode) {
        case 90:
        case 37: {
          //left
          if (v.currentTime < skipTime) {
            v.currentTime = 0;
            alert("已到达视频开头，无法快退");
          }
          console.log("快退" + skipTime + "s");
          v.currentTime = v.currentTime - skipTime;
          break;
        }
        case 88:
        case 39: {
          //right
          if (v.currentTime > v.duration - skipTime) {
            alert("已到达视频末尾，无法快进");
            v.currentTime = v.duration;
          }
          console.log("快进" + skipTime + "s");
          v.currentTime = v.currentTime + skipTime;
          break;
        }
        case 68:
        case 38: {
          //up
          if (v.volume > 1 - skipVolume) {
            alert("到达最大音量");
            v.volume = 1;
            break;
          }
          console.log("音量放大" + skipVolume * 100 + "%");
          v.volume = v.volume + 0.1;
          break;
        }
        case 83:
        case 40: {
          //down
          if (v.volume < skipVolume) {
            alert("到达最小音量");
            v.volume = 0;
            break;
          }
          console.log("音量减小" + skipVolume * 100 + "%");
          v.volume = v.volume - skipVolume;
          break;
        }
        case 32: {
          //pause
          if (v.paused) {
            console.log("播放");
            v.play();
          } else {
            console.log("暂停");
            v.pause();
          }
          break;
        }
        case 70: {
          //fullscreen
          if (!document.fullscreenElement) {
            v.requestFullscreen();
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }
          break;
        }
        case 77: {
          //muse
          if (v.volume === 0) {
            v.volume = volumeTemp;
          } else {
            volumeTemp = v.volume;
            v.volume = 0;
          }
          break;
        }
        case 36: {
          //home
          v.currentTime = 0;
          break;
        }
        case 35: {
          //end
          v.currentTime = v.duration;
          break;
        }
      }
    };
  }
  xuetangxAssistant();
})();
