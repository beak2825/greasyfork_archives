// ==UserScript==
// @name         多倍速调节+倍速同步+回车全屏+播完退出全屏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  按自己的使用习惯用ChatGPT写的脚本，我自己测试过了没啥问题，分享给有同样习惯的小伙伴，以后应该不怎么改了，有自己需求的可以自行更改。
// @author       ChatGPT
// @match        *://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472322/%E5%A4%9A%E5%80%8D%E9%80%9F%E8%B0%83%E8%8A%82%2B%E5%80%8D%E9%80%9F%E5%90%8C%E6%AD%A5%2B%E5%9B%9E%E8%BD%A6%E5%85%A8%E5%B1%8F%2B%E6%92%AD%E5%AE%8C%E9%80%80%E5%87%BA%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/472322/%E5%A4%9A%E5%80%8D%E9%80%9F%E8%B0%83%E8%8A%82%2B%E5%80%8D%E9%80%9F%E5%90%8C%E6%AD%A5%2B%E5%9B%9E%E8%BD%A6%E5%85%A8%E5%B1%8F%2B%E6%92%AD%E5%AE%8C%E9%80%80%E5%87%BA%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
  'use strict';

      // 创建音量提示的div元素
    var volumeHint = document.createElement('div');
    volumeHint.classList.add('bpx-player-volume-hint');
    volumeHint.style.display = 'none';  // 初始隐藏

    // 创建音量提示文本元素
    var volumeText = document.createElement('span');
    volumeText.classList.add('bpx-player-volume-hint-text');
    volumeHint.appendChild(volumeText);

    // 将音量提示添加到B站播放器容器中
    var playerContainer = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area");
    playerContainer.appendChild(volumeHint);

  const BILIBILI_PLAYBACKRATE = "bilibili_playbackRate";

  // 监听视频播放事件
  const videoElement = document.querySelector('video');
  if (!videoElement) return;

  // 退出全屏函数
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  function triggerFullScreenButton() {
    const fullScreenButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-full');
    if (fullScreenButton) {
      fullScreenButton.click();
    }
  }

  // 监听回车键事件
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      triggerFullScreenButton();
    }else if (event.key === 'PageUp' || event.key === '+') {
        setVideoPlaybackRate(getSavedPlaybackRate() + 0.5,true);
        event.preventDefault();
    } else if (event.key === 'PageDown' || event.key === '-') {
        setVideoPlaybackRate(getSavedPlaybackRate() - 0.5,true);
        event.preventDefault();
    }
  });

  videoElement.addEventListener('ended', () => {
    // 判断当前是否处于全屏状态
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
      // 连播状态是否开启，开启状态则不退出
      const switchButtonSpan = document.querySelector('.switch-button:not(.on)');
      if (switchButtonSpan) {
        // 退出全屏
        exitFullscreen();
      }
    }
  });

  // 设置视频倍速
  const observer = new MutationObserver(() => {
    const menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
    if (!menu) {
      return;
    }

    observer.disconnect();

    const speeds = [4.0, 3.5, 3.0, 2.5, 2.0, 1.75, 1.5, 1.25, 1.0, 0.75, 0.5];

    const items = menu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item');
    items.forEach(item => item.remove());

    speeds.forEach(speed => {
      const item = document.createElement('li');
      item.classList.add('bpx-player-ctrl-playbackrate-menu-item');
      item.setAttribute('data-value', speed.toString());
      item.textContent = speed.toString();
      menu.appendChild(item);

      // 添加点击事件处理程序
      item.addEventListener('click', () => {
        const selectedSpeed = parseFloat(item.getAttribute('data-value'));
        // 将选中的倍速值保存到localStorage
        localStorage.setItem(BILIBILI_PLAYBACKRATE, selectedSpeed.toString());

        // 移除其他项的选中状态，只在点击的项上添加选中状态
        items.forEach(otherItem => otherItem.classList.remove('bpx-state-active'));
        item.classList.add('bpx-state-active');

        setVideoPlaybackRate(selectedSpeed); // 设置视频倍速
      });
    });

    const defaultSpeed = 1.0;
    const savedSpeed = getSavedPlaybackRate();
    if (savedSpeed) {
      setVideoPlaybackRate(savedSpeed);
      const activeItem = menu.querySelector(`.bpx-player-ctrl-playbackrate-menu-item[data-value="${savedSpeed}"]`);
      if (activeItem) {
        activeItem.classList.add('bpx-state-active');
      }
      console.log('设置为上次设置的倍速: ', savedSpeed);
    } else {
      setVideoPlaybackRate(defaultSpeed);
      const activeItem = menu.querySelector(`.bpx-player-ctrl-playbackrate-menu-item[data-value="${defaultSpeed}"]`);
      if (activeItem) {
        activeItem.classList.add('bpx-state-active');
      }
      console.log('缓存未找到上次设置的倍速，使用默认倍速: ', defaultSpeed);
    }

  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // 读取localStorage中的倍速值
  function getSavedPlaybackRate() {
    const savedSpeed = localStorage.getItem(BILIBILI_PLAYBACKRATE);
    if (savedSpeed) {
      return parseFloat(savedSpeed);
    }
    return null;
  }

  function formatNumber(number) {
    // 判断是否为整数
    if (number % 1 === 0) {
        return number + '.0';
    } else {
        return number.toString();
    }
  }

  // 定义一个函数来设置视频倍速
  function setVideoPlaybackRate(rate,isHint) {
    const menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
    if (!menu) return;

    const menuItem = menu.querySelector(`.bpx-player-ctrl-playbackrate-menu-item[data-value="${rate}"]`);
    if (menuItem) {
      menuItem.click(); // Simulate clicking the menu item
    }

    if(isHint){
      // 在事件处理程序中设置音量提示文本
      var customText = '倍速 ' + formatNumber(getSavedPlaybackRate());  // 替换为您想要的文本
      volumeText.textContent = customText;

      // 显示音量提示
      volumeHint.style.display = 'block';

      // 设置1秒后自动隐藏音量提示
      setTimeout(function() {
          volumeHint.style.display = 'none';
      }, 500); // 1秒后隐藏
    }
  }

})();