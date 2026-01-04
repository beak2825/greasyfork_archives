// ==UserScript==
// @name         通用视频倍速播放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  倍速播放看 国家中小学智慧教育平台的视频、国家职业教育智慧平台...
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @match        https://www.zjzx.ah.cn/courseplay*
// @match        https://study.enaea.edu.cn/viewerforccvideo*
// @downloadURL https://update.greasyfork.org/scripts/544910/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/544910/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 创建按钮容器
    const container = document.createElement('div');
    container.id = "sp-ac-container";
    container.style.cssText = `
        position: fixed;
        left: 20px;
        top: 20px;
        z-index: 999999;
    `;

    // 添加按钮
    container.innerHTML = `
      <button id="one" style="
        position: absolute;
        left: 10px;
        top: 10px;
        padding: 6px 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      ">
        播放速度调节
      </button>
    `;
    document.body.appendChild(container);

    // 创建右上角悬浮速度标签
    const speedTag = document.createElement('div');
    speedTag.id = 'video-speed-tag';
    speedTag.style.cssText = `
      position: fixed;
      right: 20px;
      top: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      z-index: 999999;
      pointer-events: none;
      font-family: sans-serif;
    `;
    speedTag.innerText = '';
    document.body.appendChild(speedTag);

    // 更新速度标签内容
    function updateSpeedDisplay(rate) {
        speedTag.innerText = `× ${rate}`;
    }

    // 轻提示
   function showAlert(msg) {
    const alert = document.createElement('div');
    alert.textContent = msg;
    alert.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-family: sans-serif;
      z-index: 1000000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      opacity: 0.95;
      transition: opacity 0.3s ease-in-out;
    `;
    document.body.appendChild(alert);
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
      }, 2000);
    }
    // 绑定点击逻辑
    container.onclick = function () {
        const video = document.querySelector('video');
        if (!video) {
            console.warn("未找到视频元素");
            showAlert("未找到视频元素");
            return;
        }

        const speeds = [1, 2, 4, 8, 16];
        const currentIndex = speeds.indexOf(video.playbackRate);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newRate = speeds[nextIndex];
        video.playbackRate = newRate;

        updateSpeedDisplay(newRate);
        showAlert(`播放速度 ${newRate} 倍`);
    };

    // 自动监听视频播放速率变化（例如用户自己设置）
    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) updateSpeedDisplay(video.playbackRate);
    });

    const checkVideo = () => {
        const video = document.querySelector('video');
        if (video) {
            updateSpeedDisplay(video.playbackRate);
            observer.observe(video, { attributes: true, attributeFilter: ['playbackRate'] });
        }
    };

    // 初始尝试一次，延迟确保页面加载完成
    setTimeout(checkVideo, 1000);
})();

