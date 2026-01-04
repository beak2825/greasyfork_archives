// ==UserScript==
// @name         太保学习自动化流程
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  自动播放一组学习视频并处理新标签页播放
// @author       yqqyyq
// @match        *://university.cpic.com.cn/*
// @grant        none
// @icon         https://university.cpic.com.cn/default/M00/02/22/FQrxb2DcHXGACOpZAAAWLHrJuBw186.png
// @downloadURL https://update.greasyfork.org/scripts/508975/%E5%A4%AA%E4%BF%9D%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E5%8C%96%E6%B5%81%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/508975/%E5%A4%AA%E4%BF%9D%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E5%8C%96%E6%B5%81%E7%A8%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function openNextVideo() {
    var currentUrl = window.location.href;
    if (!currentUrl.includes("/#/study/subject/detail")) {
      return;
    }
    let videoDivs = document.querySelectorAll('.catalog-state-info .item.current-hover');
    for (var i = 0; i < videoDivs.length; i++) {
      const item = videoDivs[i]
      let sectionType = item.dataset.sectionType
      let innerText = item.innerText
      let playVideo = item.querySelector('.operation')
      if (sectionType == 10 && innerText.indexOf("100% 已完成") < 0) {
        playVideo.click()
      }
    }
  }

  function videoEnd() {
    //chrome://settings/content/sound
    var currentUrl = window.location.href;
    if (!currentUrl.includes("/#/study/course/detail")) {
        return;
    }
    const classList = document.querySelectorAll('.chapter-list-box')
    const video = document.querySelector('video');
    if (video&&classList.length===1) {
      video.addEventListener('ended', function () {
        const timer = setTimeout(() => {
          console.log('发送新窗口关闭的消息');
          window.opener.postMessage('video-ended', 'https://university.cpic.com.cn');
          console.log('关闭新窗口');
          window.close();
          clearTimeout(timer)
        }, 2000)
      });
    } else if (video&&classList.length > 1) {
      video.addEventListener('ended', function () {
        const timer = setTimeout(() => {
          const classList = document.querySelectorAll('.chapter-list-box')
          for (var i = 0; i < classList.length; i++) {
            if(classList[i].querySelector('.progress').innerText !== '100%'){
              classList[i].click();
              const timer = setTimeout(() => {
                location.reload();
                clearTimeout(timer);
              }, 2000)
              break;
            }
          }
          clearTimeout(timer)
        }, 2000)
      });
    }
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== 'https://university.cpic.com.cn') {
      console.log('收到新窗口关闭的消息x');
      return;
    }
    if (event.data === 'video-ended') {
      console.log('收到新窗口关闭的消息');
      location.reload();
    }
  });

  // 当页面加载完毕时启动脚本
  window.addEventListener('load', function () {
    const timer = setTimeout(() => {
      openNextVideo()
      videoEnd()
      clearTimeout(timer)
    }, 3000)
  });

})();