// ==UserScript==
// @name         自动网页全屏播放
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.9
// @description  自动网页全屏播放，已支持Bilibili，腾讯视频
// @author       tmr
// @match        https://www.bilibili.com/video/av*
// @match        https://www.bilibili.com/bangumi/play/ss*
// @match        https://www.bilibili.com/bangumi/play/ep*
// @match        https://v.qq.com/x/page/*
// @match        https://v.qq.com/x/cover/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384233/%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/384233/%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let counter = 0;
  function fullscreen() {
    console.log('web fullscreen start');
    webFull();
    function webFull() {
      console.log('web fullscreen ing ' + counter);
      counter++;
      let fullscreenClass;
      if (location.host == 'www.bilibili.com') {
        fullscreenClass = '.bilibili-player-video-web-fullscreen';
      } else if (location.host == 'v.qq.com') {
        fullscreenClass = '.txp_btn_fake';
      }
      if (fullscreenClass) {
        // 尝试全屏
        if (document.querySelector(fullscreenClass)) {
          // 网页全屏
          document.querySelector(fullscreenClass).click();
          console.log('web fullscreen success');
          // 重置计数
          counter = 0;
          // 移除监听
          document.removeEventListener('visibilitychange', fullscreen);
        }
        // 失败并重试
        else {
          // 超过30次就退出
          if (counter > 30) {
            console.log('web fullscreen fail');
            return;
          }
          // 延迟0.5秒重试
          setTimeout(webFull, 500);
        }
      }
    }
  }
  clickVideoLink();
  function clickVideoLink() {
    window.onclick = function (mClick) {
      let mClickElement = mClick.target;
      // 视频链接
      let videoUrlList;
      // 视频Class
      let videoClassList;
      if (location.host == 'www.bilibili.com') {
        videoUrlList = [
          'https://www.bilibili.com/video/av',
          'https://www.bilibili.com/bangumi/play/ss',
          'https://www.bilibili.com/bangumi/play/ep',
        ];
        videoClassList = [
          'bilibili-player-ending-panel-box-recommend-cover',
          'bilibili-player-ending-panel-box-recommend',
          'ep-title',
          'ep-item',
        ];
      } else if (location.host == 'v.qq.com') {
        videoUrlList = ['https://v.qq.com/x/page/'];
        videoClassList = [];
      }
      // 优先Class处理
      videoClassList.forEach(function (videoClass) {
        if (mClickElement.classList.contains(videoClass)) {
          fullscreen();
          return;
        }
      });
      // 链接处理
      let mClickElementTmp = mClickElement;
      // 判断是否是a标签的子元素
      while (mClickElementTmp) {
        // 元素是a标签
        if (mClickElementTmp.tagName == 'A') {
          // 新tab打开不处理
          if (mClickElementTmp.target == '_blank') {
            break;
          } else {
            // 循环判断链接
            videoUrlList.some(function (videoUrl) {
              if (String(mClickElementTmp.href).indexOf(videoUrl) == 0) {
                fullscreen();
                return true;
              }
            });
            break;
          }
        }
        // 不是a标签就循环父级元素
        else {
          mClickElementTmp = mClickElementTmp.parentElement;
        }
      }
    };
  }
  window.addEventListener('load', function () {
    // 判断后台打开
    if (document.visibilityState == 'hidden') {
      console.log('now hidden, wait visible');
      document.addEventListener('visibilitychange', fullscreen);
    }
    // 前台打开，直接直行
    else {
      fullscreen();
    }
  });
})();
