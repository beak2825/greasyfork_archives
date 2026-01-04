// ==UserScript==
// @name         youtube自定义倍数
// @license No License
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  可自定义YouTube播放倍数
// @author       CunShao
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/503368/youtube%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/503368/youtube%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E6%95%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
      window.trustedTypes.createPolicy('default', {
        createHTML: (string, sink) => string
      });
    }

    let videoSpeedElement;

    setInterval(function () {
      if (location.href.indexOf("short") > -1 || location.href.indexOf("channel") > -1) return;
      if (document.querySelector("#above-the-fold") && document.getElementById("video_speed_div") === null) {
        console.log('开始添加按钮');
        addSpeedBtn();
        initSpeed();
      }
      setPlaybackRate();
    }, 500);

    function addSpeedBtn() {
      let style = document.createElement('style');
      style.type = 'text/css';
      style.textContent = `
    #video_speed_div button {
        outline: 0;
        padding: 5px 7px;
        margin-left: 10px;
        background-color: #4CAF50;
        border: 0;
        border-radius: 12px;
        color: white;
        cursor: pointer;
    }
    #video_speed_div button:first-child {
        margin-left: 0;
    }
    #video_speed_div button:hover {
        background-color: #e2e0e0;
    }
    .video_speed_div-button-active {
        border: 0!important;
        background-color: #ff0000!important;
        color: #fff!important;
    }
`;
      document.getElementsByTagName('head').item(0).appendChild(style);

      videoSpeedElement = document.createElement("div");
      videoSpeedElement.setAttribute("id", "video_speed_div");

      let speedArr = [0.5, 1, 1.5, 1.75, 2, 2.5, 3];

      for (let i = 0; i < speedArr.length; i++) {
        let speed = speedArr[i];
        let btn = document.createElement("button");
        btn.innerHTML = "x" + speed;
        btn.style.width = "45px";
        btn.setAttribute("id", "third_video_plugin_btn_" + speed);
        btn.addEventListener("click", btnClicked);
        videoSpeedElement.appendChild(btn);
      }

      videoSpeedElement.style.width = "100%";
      videoSpeedElement.style.height = "30px";
      let targetElement = document.querySelector("#above-the-fold");
      targetElement.insertBefore(videoSpeedElement, targetElement.firstChild);
    }

    // 加载之前已经设置的速度
    function initSpeed() {
      if (!videoSpeedElement) return;
      let third_video_plugin_speed = localStorage.getItem("third_video_plugin_speed");
      if (!third_video_plugin_speed) third_video_plugin_speed = '1';

      for (let i = 0; i < videoSpeedElement.childNodes.length; i++) {
        let btn = videoSpeedElement.childNodes[i];
        if (btn.getAttribute("id") === "third_video_plugin_btn_" + third_video_plugin_speed && btn.className.indexOf("video_speed_div-button-active") === -1) {
          btn.click();
        }
      }
      document.getElementById("third_video_plugin_btn_" + third_video_plugin_speed).click();
    }

    function setPlaybackRate(speed) {
      if (!videoSpeedElement) return;
      let third_video_plugin_speed = speed || localStorage.getItem("third_video_plugin_speed");
      if (!third_video_plugin_speed) return;

      let videoDom = document.querySelector(".html5-main-video");
      if (!videoDom) return;
      videoDom.playbackRate = third_video_plugin_speed;
    }

    function btnClicked(e) {
      let speed = parseFloat(e.target.innerHTML.replace("x", ""));
      localStorage.setItem("third_video_plugin_speed", speed);

      setPlaybackRate(speed);

      for (let i = 0; i < videoSpeedElement.childNodes.length; i++) {
        let btn = videoSpeedElement.childNodes[i];
        btn.setAttribute("class", "");
      }
      e.target.setAttribute("class", "video_speed_div-button-active");
    }

  })();




