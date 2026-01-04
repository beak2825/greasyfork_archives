// ==UserScript==
// @name         粉笔视频显示控制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  控制粉笔公考网站视频容器的显示/隐藏
// @author       陈朗
// @match        https://spa.fenbi.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535741/%E7%B2%89%E7%AC%94%E8%A7%86%E9%A2%91%E6%98%BE%E7%A4%BA%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/535741/%E7%B2%89%E7%AC%94%E8%A7%86%E9%A2%91%E6%98%BE%E7%A4%BA%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 初始化函数
  function initialize() {
    console.log('开始初始化视频控制...');

    // 默认隐藏视频容器
    const videoContainers = document.querySelectorAll(
      '.solution-video-container'
    );
    if (videoContainers.length > 0) {
      videoContainers.forEach((container) => {
        container.style.display = 'none';
      });
      console.log('已隐藏视频容器');
    } else {
      console.log('未找到视频容器，等待加载...');
      // 持续监听视频容器的出现
      const observer = new MutationObserver((mutations) => {
        const containers = document.querySelectorAll(
          '.solution-video-container'
        );
        if (containers.length > 0) {
          containers.forEach((container) => {
            container.style.display = 'none';
          });
          console.log('新视频容器已隐藏');
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  // 等待页面加载完成后执行初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // 监听页面变化（针对单页应用）
  const observer = new MutationObserver((mutations) => {
    if (!document.querySelector('button[style*="position: fixed"]')) {
      initialize();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
