// ==UserScript==
// @name         B站倍速控制（简易版）
// @namespace    http://echo.namespace
// @version      4.0
// @description  控制哔哩哔哩视频的播放速度，点击脚本菜单出现倍速控制界面，调整好倍速不想再看到控制界面后点击红色关闭按钮控制界面消失，想要再切换速度刷新一下控制界面出现（界面很low,能用就行，在右边也不影响啥）
// @author       echo_y
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/479069/B%E7%AB%99%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%EF%BC%88%E7%AE%80%E6%98%93%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/479069/B%E7%AB%99%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%EF%BC%88%E7%AE%80%E6%98%93%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 获取之前保存的播放速度设置
  var playbackSpeed = parseFloat(localStorage.getItem('playbackSpeed')) || 1;
  var defaultPlaybackSpeed = playbackSpeed;

  GM_registerMenuCommand('打开B站倍速控制界面', displayjiemian);

  function displayjiemian() {
    // 创建控制按钮的容器
    var buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '50%';
    buttonContainer.style.right = '0';
    buttonContainer.style.transform = 'translateY(-50%)';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';

    // 创建滚动条
    var rangeInput = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.min = 0;
    rangeInput.max = 6;
    rangeInput.step = 0.1;
    rangeInput.value = playbackSpeed;

    // 创建显示倍速的 <div>
    var valueDisplay = document.createElement('div');
    valueDisplay.id = 'valueDisplay';
    valueDisplay.textContent = `当前倍速：${playbackSpeed}`;

    // 创建关闭按钮
    var closeButton = document.createElement('button');
    closeButton.innerHTML = '关闭';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.margin = '10px 0';
    closeButton.onclick = function () {
      buttonContainer.style.display = 'none';
    };

    // 添加按钮到容器
    buttonContainer.appendChild(rangeInput);
    buttonContainer.appendChild(valueDisplay);
    buttonContainer.appendChild(closeButton);

    // 添加容器到页面
    document.body.appendChild(buttonContainer);

    // 添加自定义CSS样式
    GM_addStyle(`
        button {
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
        }
    `);

    rangeInput.addEventListener("input", function () {
      playbackSpeed = parseFloat(rangeInput.value).toFixed(1);

      // 更新显示值的 <div>
      valueDisplay.textContent = `当前倍速：${playbackSpeed}`;
      localStorage.setItem('playbackSpeed', playbackSpeed);

      setPlaybackSpeed(playbackSpeed);
    });
  }

  setPlaybackSpeed(playbackSpeed);

  // 设置播放速度
  function setPlaybackSpeed(speed) {
    var videos = document.querySelectorAll('video');
    if (videos) {
      videos.forEach(function (video) {
        video.playbackRate = speed;
      });
    }
  }

  // 在每个视频页面初始化播放速度
  setPlaybackSpeed(playbackSpeed);

  // 监听页面变化，以便在自动切换到下一个视频时继续应用速度
  var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    return function (obj, callback) {
      if (!obj || !obj.nodeType === 1) return;
      if (MutationObserver) {
        var obs = new MutationObserver(function (mutations, observer) {
          mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
              callback();
            }
          });
        });
        obs.observe(obj, { childList: true, subtree: true });
      }
    };
  })();

  observeDOM(document, function () {
    setPlaybackSpeed(playbackSpeed);
  });

  // 处理页面跳转事件，保存默认速度
  window.addEventListener('beforeunload', function () {
    localStorage.setItem('defaultPlaybackSpeed', defaultPlaybackSpeed);
  });
})();
