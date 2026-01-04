// ==UserScript==
// @name         2023_福建药师协会_执业药师继续教育学习平台-学习助手    切换屏幕,视频不暂停,自动下一个
// @version      0.2.3
// @description  切换屏幕,视频不暂停
// @author       You
// @match        fjlpa.mtnet.com.cn/video/*
// @grant        none
// @license     MIT
// @namespace https://greasyfork.org/users/720128
// @downloadURL https://update.greasyfork.org/scripts/479511/2023_%E7%A6%8F%E5%BB%BA%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A_%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%20%20%20%E5%88%87%E6%8D%A2%E5%B1%8F%E5%B9%95%2C%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C%2C%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E4%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/479511/2023_%E7%A6%8F%E5%BB%BA%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A_%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%20%20%20%E5%88%87%E6%8D%A2%E5%B1%8F%E5%B9%95%2C%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C%2C%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E4%B8%AA.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.onload = function() {
    // 滚动到页面底部
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    window.scrollTo(0, scrollHeight);

    // 设置定时器，每隔一段时间执行操作
    setInterval(() => {
      try {
        const currentUrl = location.href;

        // 处理视频页面的特定逻辑
        if (currentUrl.includes("https://fjlpa.mtnet.com.cn/video")) {
          window.onblur = function () {}; // 防止窗口失去焦点时暂停视频

          const videoElement = document.querySelector("video");
          if (videoElement) {
            // 阻止可能触发暂停弹窗的事件
            videoElement.addEventListener('click', function(event) {
              event.stopPropagation();
              event.preventDefault();
            }, true);

            // 如果视频处于暂停状态，则尝试播放
            if (videoElement.paused) {
              videoElement.play().catch(error => {
                console.error('播放视频时发生错误:', error);
              });
            }
          }

          // 隐藏可能出现的暂停弹窗
          const pausePopup = document.querySelector('.pause-popup'); // 假设暂停弹窗有一个类名为'pause-popup'
          if (pausePopup) {
            pausePopup.style.display = 'none'; // 隐藏弹窗
          }

          // 自动点击播放进度为0%的视频
          const chapterList = document.querySelector(".chapterlist");
          const currProgress = chapterList && chapterList.querySelector(".chapterPro .floatR .currProgress");
          const toPlayButton = chapterList && chapterList.querySelector(".floatR .toPlay");

          if (currProgress && currProgress.textContent.trim() === "0%") {
            toPlayButton.click();
          }
        }
      } catch (error) {
        console.error('执行操作时发生错误:', error);
      }
    }, 5000); // 每隔5秒执行一次

    // 每隔20分钟刷新页面
    setInterval(function(){
      window.location.reload();
    }, 20 * 60 * 1000);

    // 隐藏继续看视频弹窗
    $('.el-dialog__footer').hide();
  };
})();