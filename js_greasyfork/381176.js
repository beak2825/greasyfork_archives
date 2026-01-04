// ==UserScript==
// @name         youtube播放视频倍速自定义，可记忆
// @namespace    EsfB3XVPmbThEv39bdxQR2hzid30iMF9
// @version      1.6
// @description  youtube播放视频倍速自定义，刷新浏览器也不会丢失之前设置的速度
// @author       朋也
// @include      http*://*youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381176/youtube%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E5%8F%AF%E8%AE%B0%E5%BF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/381176/youtube%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E5%8F%AF%E8%AE%B0%E5%BF%86.meta.js
// ==/UserScript==

(function () {

  if (window.trustedTypes && window.trustedTypes.createPolicy) {
      window.trustedTypes.createPolicy('default', {
          createHTML: (string, sink) => string
      });
  }
  // --------------------------------------------------------------

  let videoSpeedElement, videoDom;

  setInterval(function () {
    if (location.href.indexOf("short") > -1 || location.href.indexOf("channel") > -1) return;
    if (document.querySelector("#above-the-fold") && document.getElementById("video_speed_div") === null) {
      addSpeedBtn();
      initSpeed();
    }
    if (!videoDom) {
      videoDom = document.querySelector(".html5-main-video");
      if (videoDom && !videoDom.onloadstart) {
        setPlaybackRate();
        videoDom.onloadstart = function (event) {
          setPlaybackRate();
        }
      }
    }

    let skip_ad_btn = document.querySelector(".ytp-skip-ad-button");
    if (skip_ad_btn) {
      skip_ad_btn.click();
    }
  }, 1000);

  function addSpeedBtn() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = "#video_speed_div button { outline: 0; padding: 5px 7px; margin-left: 10px; background-color: #ede9e9; border: 0; border-radius: 12px; color: #222; cursor: pointer;} #video_speed_div button:first-child{margin-left:0;} #video_speed_div button:hover{background-color: #e2e0e0;} .video_speed_div-button-active { border: 0!important; background-color: #ff0000!important; color: #fff!important; }";
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

    // let targetElement = document.querySelectorAll("[id='count']");
    // for (var i = 0; i < targetElement.length; i++) {
    //   if (targetElement[i].className.indexOf("ytd-video-primary-info-renderer") > -1) {
    //     targetElement[i].appendChild(videoSpeedElement);
    //   }
    // }

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

    // let videoDom = document.querySelector(".html5-main-video");
    if (!videoDom) return;
    videoDom.playbackRate = third_video_plugin_speed;
  }

  function btnClicked(e) {
    let speed = parseFloat(e.target.innerHTML.replace("x", ""));
    localStorage.setItem("third_video_plugin_speed", speed);
    // let videoDom = document.querySelector(".html5-main-video");
    // if (!videoDom) return;
    // videoDom.playbackRate = speed;

    setPlaybackRate(speed);

    for (let i = 0; i < videoSpeedElement.childNodes.length; i++) {
      let btn = videoSpeedElement.childNodes[i];
      btn.setAttribute("class", "");
    }
    e.target.setAttribute("class", "video_speed_div-button-active");
  }

})();