// ==UserScript==
// @name         國立空中大學 自動播放課程
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動播放影片並自動切換下一部，支援國立空中大學數位學習平台。
// @author       YourName
// @match        *://*.nou.edu.tw/*
// @icon         https://www.nou.edu.tw/base/10001/door/tpl/icon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531625/%E5%9C%8B%E7%AB%8B%E7%A9%BA%E4%B8%AD%E5%A4%A7%E5%AD%B8%20%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE%E8%AA%B2%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531625/%E5%9C%8B%E7%AB%8B%E7%A9%BA%E4%B8%AD%E5%A4%A7%E5%AD%B8%20%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE%E8%AA%B2%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 等待 s_main frame 載入
  function waitForSMainFrame(callback) {
    const frame = document.querySelector('frame[name="s_main"]');
    if (!frame) {
      setTimeout(() => waitForSMainFrame(callback), 1000);
      return;
    }

    frame.addEventListener('load', () => {
      callback(frame);
    });

    // 如果已經載入過
    if (frame.contentDocument?.readyState === 'complete') {
      callback(frame);
    }
  }

  function tryAutoPlay(frame) {
    const doc = frame.contentDocument;
    if (!doc) return;

    const video = doc.querySelector('video');
    if (video) {
      if (video.paused) {
        video.play().catch(err => console.log('播放失敗：', err));
      }

      // 加入自動播放下一部的功能
      video.addEventListener('ended', () => {
        setTimeout(() => {
          const nextBtn = doc.querySelector('.next-button, #next, input[value="下一部"], button:contains(\"下一部\")');
          if (nextBtn) {
            nextBtn.click();
          } else {
            console.log('找不到下一部按鈕');
          }
        }, 1500);
      });
    } else {
      console.log('找不到影片元素');
    }
  }

  // 主流程
  function init() {
    waitForSMainFrame((frame) => {
      setTimeout(() => {
        tryAutoPlay(frame);
      }, 1500);
    });
  }

  window.addEventListener('load', () => {
    setTimeout(init, 3000);
  });
})();
