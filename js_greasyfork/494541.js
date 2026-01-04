  // ==UserScript==
  // @name         优化百度网盘在线播放
  // @namespace    http://tampermonkey.net/
  // @description  自动加载高清画质；添加倍速播放，数字键1，2，3分别对应1，2，3倍速，4为1.5倍速，5为开启画中画模式； '[' 上一集； ']' 下一集。
  // @author       You
  // @match        https://pan.baidu.com/*
  // @icon         https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico
  // @grant        none
  // @license      MIT
  // @version      1.0.0
// @downloadURL https://update.greasyfork.org/scripts/494541/%E4%BC%98%E5%8C%96%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/494541/%E4%BC%98%E5%8C%96%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE.meta.js
  // ==/UserScript==

  (function () {
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey || ![49, 50, 51, 52, 53, 219, 221].includes(e.keyCode))
        return;
      const video = document.querySelector("video");
      const controlBtns = document.querySelectorAll(
        ".vp-video__control-bar--play .vp-video__control-bar--button-group"
      );
      if (!video || !controlBtns.length) return;
      switch (e.keyCode) {
        case 49:
          video.playbackRate = 1;
          savePlayBackRate(1);
          break;
        case 50:
          video.playbackRate = 2;
          savePlayBackRate(2);
          break;
        case 51:
          video.playbackRate = 3;
          savePlayBackRate(3);
          break;
        case 52:
          video.playbackRate = 1.5;
          savePlayBackRate(1.5);
          break;
        case 53:
          togglePictureInPictureMode(video);
          break;
        case 219:
          controlBtns[1]
            .querySelector(".vp-video__control-bar--button")
            .click();
          break;
        case 221:
          controlBtns[2]
            .querySelector(".vp-video__control-bar--button")
            .click();
          break;
      }
    });
    const savePlayBackRate = (playbackRate) => {
      sessionStorage.setItem("playBackRate", playbackRate);
    };
    const togglePictureInPictureMode = async (video) => {
      if (video !== document.pictureInPictureElement) {
        await video.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    };
    const mutation = new MutationObserver((mutation) => {
      for (let m of mutation) {
        if (m.target.classList && m.target.classList.contains("vjs-tech")) {
          const btns = document.querySelectorAll(
            ".vp-video__control-bar--video-resolution .vp-video__control-bar--video-button"
          );
          if (btns.length && !btns[1].classList.contains("is-selected")) {
            const highDefinitionBtn = btns[1].querySelector("button");
            highDefinitionBtn && highDefinitionBtn.click();
          }
          const video = document.querySelector("video");
          const playBackRate = sessionStorage.getItem("playBackRate") || 1;
          if (video && video.playbackRate !== +playBackRate) {
            video.playbackRate = +playBackRate;
          }
        }
      }
    });
    const config = {
      childList: true,
      attributes: true,
      subtree: true,
    };
    mutation.observe(document.body, config);
  })();