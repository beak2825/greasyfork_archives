// ==UserScript==
// @name         中国继续教育倍速控制
// @namespace    http://your-namespace.com
// @version      1.2
// @description  Adds a speed control UI to the left center of the page for controlling playback speed on NCME course videos.
// @match        https://www.ncme.org.cn/*
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470947/%E4%B8%AD%E5%9B%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/470947/%E4%B8%AD%E5%9B%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==
(function() {
  'use strict';

  const playbackSpeeds = [1.0, 10.0, 16.0]; // 可选的播放速度倍数
  let selectedSpeed = 10.0; // 默认选择10.0倍速
  let lastSetSpeed = 10.0; // 上一次设置的播放速度

  // 添加播放速度控制面板
  function addSpeedControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '50%';
    controlPanel.style.left = '10px';
    controlPanel.style.transform = 'translateY(-50%)';
    controlPanel.style.zIndex = '9999';

    // 添加速度按钮
    playbackSpeeds.forEach(speed => {
      const speedButton = document.createElement('button');
      speedButton.innerText = speed + 'X';
      speedButton.style.display = 'block';
      speedButton.style.margin = '5px 0';
      speedButton.addEventListener('click', () => {
        setPlaybackSpeed(speed);
      });
      controlPanel.appendChild(speedButton);
    });

    // 显示当前播放速度
    const speedDisplay = document.createElement('div');
    speedDisplay.id = 'speedDisplay';
    speedDisplay.innerText = '当前播放速度：' + selectedSpeed + 'X';
    controlPanel.appendChild(speedDisplay);

    document.body.appendChild(controlPanel);
  }

  // 设置视频播放速度
  function setPlaybackSpeed(speed) {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.playbackRate = speed;
      selectedSpeed = speed;
      lastSetSpeed = speed;
      updateSpeedDisplay();
    }
  }

  // 更新当前播放速度显示
  function updateSpeedDisplay() {
    const speedDisplay = document.querySelector('#speedDisplay');
    if (speedDisplay) {
      speedDisplay.innerText = '当前播放速度：' + selectedSpeed + 'X';
    }
  }

  // 获取当前视频播放速度
  function getCurrentPlaybackSpeed() {
    const videoElement = document.querySelector('video');
    return videoElement ? videoElement.playbackRate : null;
  }

  // 每10秒获取一次当前视频播放速度
  function updateCurrentPlaybackSpeed() {
    const currentSpeed = getCurrentPlaybackSpeed();
    if (currentSpeed !== null) {
      selectedSpeed = currentSpeed;
      updateSpeedDisplay();
      if (currentSpeed < lastSetSpeed) {
        setPlaybackSpeed(lastSetSpeed);
      }
    }
  }

  // 每10秒检查一次播放速度是否符合选择的倍数
  function checkPlaybackSpeed() {
    const currentSpeed = getCurrentPlaybackSpeed();
    if (currentSpeed !== selectedSpeed) {
      setPlaybackSpeed(selectedSpeed);
    }
  }

  // 保存和加载播放速度
  function saveSelectedSpeed() {
    localStorage.setItem('ncmeSelectedSpeed', selectedSpeed);
  }

  function loadSelectedSpeed() {
    const storedSpeed = localStorage.getItem('ncmeSelectedSpeed');
    selectedSpeed = storedSpeed ? parseFloat(storedSpeed) : 10.0;
    lastSetSpeed = selectedSpeed;
    setPlaybackSpeed(selectedSpeed);
  }

  // 触发on_player_start事件
  function triggerOnPlayerStart() {
    const event = new Event('on_player_start');
    window.dispatchEvent(event);
  }

  // 在页面加载完成后检查视频并自动播放视频
  function onPageLoaded() {
    loadSelectedSpeed(); // 加载之前保存的播放速度
    const videoElement = document.querySelector('video');
    if (videoElement && videoElement.paused) {
      videoElement.play();
    }

  }

  // 监听视频加载事件和修改播放速度事件
  window.addEventListener('on_cc_live_player_load', onPageLoaded);

  // 每10秒更新当前播放速度
  setInterval(updateCurrentPlaybackSpeed, 10000);

  // 每10秒检查一次播放速度是否符合选择的倍数
  setInterval(checkPlaybackSpeed, 10000);

  // 添加速度控制面板
  addSpeedControlPanel();

  // 在页面关闭前保存播放速度
  window.addEventListener('beforeunload', saveSelectedSpeed);
})();