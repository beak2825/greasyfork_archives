// ==UserScript==
// @name         bilibili播放视频倍速自定义，自定义版
// @namespace    EsfB2XVPmbThEv39bdxQR2hzid30iMF9
// @version      0.8
// @description  bilibili播放视频倍速自定义，刷新浏览器也不会丢失之前设置的速度
// @author       tomoya
// @include      http*://*bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390008/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E8%87%AA%E5%AE%9A%E4%B9%89%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/390008/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E8%87%AA%E5%AE%9A%E4%B9%89%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let videoSpeedElement;

  let style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = "#video_speed_div button { outline: 0; padding: 3px 5px; margin-left: 10px; background-color: #e2e0e0; border: 0; color: #222; cursor: pointer;} .video_speed_div-button-active { border: 0!important; background-color: #ffafc9!important; color: #fff!important; }";
  document.getElementsByTagName('head').item(0).appendChild(style);

  let _interval = setInterval(function () {
    if (document.querySelector(".bb-comment") && document.getElementById("video_speed_div") === null) {
      addSpeedBtns();
    }
  }, 100);

  function addSpeedBtns() {
    videoSpeedElement = document.createElement("div");
    videoSpeedElement.setAttribute("id", "video_speed_div");

    let speedArr = [0.5, 1, 1.1,1.2,1.25,1.3,1.4,1.5, 1.6, 1.7,1.8, 2.0, 2.2, 2.5];

    for (let i = 0; i < speedArr.length; i++) {
      let speed = speedArr[i];
      let btn = document.createElement("button");
      btn.innerHTML = "x" + speed;
      btn.style.width = "40px";
      btn.setAttribute("id", "third_video_plugin_btn_" + speed);
      btn.addEventListener("click", changeVideoSpeed);
      videoSpeedElement.appendChild(btn);
    }

    videoSpeedElement.style.width = "100%";
    videoSpeedElement.style.height = "30px";

    document.querySelector("#viewbox_report").querySelector(".video-data:last-child").appendChild(videoSpeedElement);

    clearInterval(_interval);

    // 加载之间已经设置的速度, 在同一个页面中切换视频后，设置的速度就没了，这里用一个定时器，200ms设置一下
    setInterval(function () {
      let third_video_plugin_speed = localStorage.getItem("third_video_plugin_speed");
      if (!third_video_plugin_speed) {
          third_video_plugin_speed = '1';
          localStorage.setItem("third_video_plugin_speed", third_video_plugin_speed);
      }
      // 设置倍速按钮高亮
      hightlightBtn(third_video_plugin_speed);
      document.querySelector("video:first-child").playbackRate = third_video_plugin_speed;
    }, 200);
  }

  function changeVideoSpeed(e) {
    let speed = parseFloat(e.target.innerHTML.replace("x", ""));
    localStorage.setItem("third_video_plugin_speed", speed);
    hightlightBtn(speed);
  }

  function hightlightBtn(speed) {
      let currentSpeedBtn = document.getElementById("third_video_plugin_btn_" + speed);
      if (currentSpeedBtn.className.indexOf("video_speed_div-button-active") === -1) {
          for (let i = 0; i < videoSpeedElement.childNodes.length; i++) {
              let btn = videoSpeedElement.childNodes[i];
              btn.setAttribute("class", "");
          }
          currentSpeedBtn.setAttribute("class", "video_speed_div-button-active");
      }
  }

})();