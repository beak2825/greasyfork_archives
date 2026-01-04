// ==UserScript==
// @name         自动隐藏b站视频内内嵌奇怪弹窗
// @namespace    kuubee
// @version      0.1.4
// @description  自动隐藏bilibili视频内内嵌奇怪弹窗
// @author       kuubee
// @include      *://www.bilibili.com/video/av*
// @include      *://www.bilibili.com/video/BV*
// @include      *://www.bilibili.com/medialist/play/watchlater/BV*
// @include      *://www.bilibili.com/medialist/play/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424094/%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8Fb%E7%AB%99%E8%A7%86%E9%A2%91%E5%86%85%E5%86%85%E5%B5%8C%E5%A5%87%E6%80%AA%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/424094/%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8Fb%E7%AB%99%E8%A7%86%E9%A2%91%E5%86%85%E5%86%85%E5%B5%8C%E5%A5%87%E6%80%AA%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.onload = () => {
    const timer = setInterval(() => {
      main();
    }, 100);
    function main() {
      // 视频根
      const watchRootDom = document.querySelector("#bilibili-player");
      // 弹出层
      const watchPopupDom = document.querySelector(
        ".bilibili-player-video-popup"
      );
      // 新增的弹出层
      const watchVideoInnerDom = document.querySelector(
        ".bilibili-player-video-inner"
      );
      if (!watchRootDom || !watchPopupDom || !watchVideoInnerDom) return;
      if (timer) clearInterval(timer);
      const rootObs = new MutationObserver(rootCallback);
      const popupObs = new MutationObserver(popupCallback);
      const videoInnerObs = new MutationObserver(popupCallback);

      const popupConfig = {
        childList: true,
        attributes: true,
        subtree: true
      };

      // 启动函数
      function startRootObs() {
        rootObs.observe(watchRootDom, {
          childList: true,
          attributes: false,
          subtree: false
        });
      }
      function startPopupObs(target = watchPopupDom) {
        popupObs.observe(target, popupConfig);
      }
      function startVideoInnerObs(target = watchVideoInnerDom) {
        videoInnerObs.observe(target, popupConfig);
      }
      // 重启函数
      function restartPopupObs() {
        const watchPopupDom = document.querySelector(
          ".bilibili-player-video-popup"
        );
        const watchVideoInnerDom = document.querySelector(
          ".bilibili-player-video-inner"
        );
        if (!watchPopupDom || !watchVideoInnerDom) {
          setTimeout(() => {
            restartPopupObs();
          }, 100);
        }
        startPopupObs(watchPopupDom);
        startVideoInnerObs(watchVideoInnerDom);
      }
      // 变化回调
      function rootCallback() {
        // 每当视频根切换时
        // 重启弹出层监听
        popupObs.disconnect();
        videoInnerObs.disconnect();
        restartPopupObs();
      }
      function popupCallback(mutations, _observer) {
        if (!mutations[0]) return;
        const targetDom = mutations[0].target;
        targetDom.style.display = "none";
      }
      // 初次启动
      startRootObs();
      startPopupObs();
      startVideoInnerObs();
      console.log("注入成功!");
    }
  };
})();