// ==UserScript==
// @name         自定义视频倍速播放
// @version      2.7
// @description  自定义视频播放速度
// @author       DeepSeek
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/470796/%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/470796/%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // 全局变量
  let currentSpeed = parseFloat(GM_getValue('videoSpeed')) || 1;
  let controlBtn = null;
  let inputPanel = null;
  let speedInput = null;
  let initialized = false;
  let isProcessingClick = false; // 防止重复点击处理
  let speedCheckInterval = null; // 速度检查间隔
  let isFullscreen = false; // 全屏状态
  
  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // 获取所有视频元素
  function getAllVideoElements() {
    return document.querySelectorAll('video,[class*="player"] *');
  }
  
  // 获取所有有效的视频元素（包含video标签或具有playbackRate属性的元素）
  function getAllValidVideoElements() {
    const elements = getAllVideoElements();
    const validVideos = [];
    
    elements.forEach(element => {
      try {
        if (element.tagName === 'VIDEO' && element.readyState > 0) {
          validVideos.push(element);
        } else if ('playbackRate' in element && element.playbackRate !== undefined) {
          validVideos.push(element);
        } else {
          // 检查子元素中的video
          const videoChild = element.querySelector('video');
          if (videoChild && videoChild.readyState > 0) {
            validVideos.push(videoChild);
          }
        }
      } catch (e) {
        // 忽略错误
      }
    });
    
    return validVideos;
  }
  
  // 检测并纠正视频速度
  function checkAndCorrectVideoSpeed() {
    // 如果处于全屏模式，不进行检测和纠正
    if (document.fullscreenElement || document.webkitFullscreenElement || 
        document.mozFullScreenElement || document.msFullscreenElement) {
      isFullscreen = true;
      return;
    }
    
    isFullscreen = false;
    
    const videos = getAllValidVideoElements();
    if (videos.length === 0) return;
    
    let needCorrection = false;
    
    videos.forEach(video => {
      try {
        // 检查速度是否与设置的不一致（容差0.01）
        if (Math.abs(video.playbackRate - currentSpeed) > 0.01) {
          console.log(`检测到速度不一致: ${video.playbackRate}x -> ${currentSpeed}x`);
          video.playbackRate = currentSpeed;
          needCorrection = true;
        }
      } catch (e) {
        // 忽略权限错误
      }
    });
    
    // 如果有纠正，更新按钮显示
    if (needCorrection && controlBtn) {
      controlBtn.textContent = `倍速: ${currentSpeed}x`;
    }
  }
  
  // 启动速度检查
  function startSpeedCheck() {
    if (speedCheckInterval) {
      clearInterval(speedCheckInterval);
    }
    
    // 每2秒检查一次速度
    speedCheckInterval = setInterval(checkAndCorrectVideoSpeed, 2000);
  }
  
  // 停止速度检查
  function stopSpeedCheck() {
    if (speedCheckInterval) {
      clearInterval(speedCheckInterval);
      speedCheckInterval = null;
    }
  }
  
  // 主初始化函数
  function init() {
    if (initialized || document.fullscreenElement) return;
    
    let videos = getAllVideoElements();
    if (videos.length === 0) return;
    
    initialized = true;
    
    // 应用速度到当前视频
    applySpeedToVideos(videos, currentSpeed);
    
    // 创建控制按钮（如果不存在）
    if (!controlBtn || !controlBtn.parentNode) {
      createControlButton();
    }
    
    // 启动速度检查
    startSpeedCheck();
    
    // 监听全屏变化
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  }
  
  // 处理全屏变化
  function handleFullscreenChange() {
    const isNowFullscreen = !!(document.fullscreenElement || 
                               document.webkitFullscreenElement ||
                               document.mozFullScreenElement ||
                               document.msFullscreenElement);
    
    if (isNowFullscreen !== isFullscreen) {
      isFullscreen = isNowFullscreen;
      
      if (isFullscreen) {
        // 进入全屏，停止检查
        stopSpeedCheck();
        if (inputPanel && inputPanel.parentNode) {
          hideSpeedInput();
        }
      } else {
        // 退出全屏，重新开始检查并纠正
        setTimeout(() => {
          startSpeedCheck();
          checkAndCorrectVideoSpeed();
        }, 500);
      }
    }
  }
  
  // 创建控制按钮
  function createControlButton() {
    // 如果已存在，先移除
    if (controlBtn && controlBtn.parentNode) {
      controlBtn.parentNode.removeChild(controlBtn);
    }
    
    controlBtn = document.createElement('div');
    controlBtn.textContent = `倍速: ${currentSpeed}x`;
    controlBtn.title = '点击修改播放倍速（自动检测和纠正中）';
    controlBtn.style.cssText = `
      position: fixed;
      right: 5px;
      top: 30px;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border: 1px solid #555;
      border-radius: 4px;
      cursor: pointer;
      z-index: 9999;
      font-size: 14px;
      font-family: Arial, sans-serif;
      user-select: none;
      min-width: 70px;
      text-align: center;
      pointer-events: auto;
    `;
    
    // 使用防抖防止快速多次点击
    controlBtn.addEventListener('click', debounce(handleControlBtnClick, 300));
    document.body.appendChild(controlBtn);
  }
  
  // 处理控制按钮点击
  function handleControlBtnClick() {
    if (isProcessingClick) return;
    
    isProcessingClick = true;
    try {
      showSpeedInput();
    } finally {
      setTimeout(() => {
        isProcessingClick = false;
      }, 100);
    }
  }
  
  // 显示速度输入框
  function showSpeedInput() {
    // 如果已经有输入面板，先移除
    if (inputPanel && inputPanel.parentNode) {
      hideSpeedInput();
      return;
    }
    
    // 创建输入框面板
    inputPanel = document.createElement('div');
    inputPanel.style.cssText = `
      position: fixed;
      right: 5px;
      top: 70px;
      background: rgba(0, 0, 0, 0.85);
      border: 1px solid #555;
      border-radius: 6px;
      z-index: 10000;
      font-size: 14px;
      font-family: Arial, sans-serif;
      user-select: none;
      min-width: 150px;
      padding: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: auto;
    `;
    
    // 创建标题
    const title = document.createElement('div');
    title.textContent = '设置播放倍速';
    title.style.cssText = `
      color: white;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 5px;
      text-align: center;
    `;
    
    // 创建输入框
    speedInput = document.createElement('input');
    speedInput.type = 'number';
    speedInput.value = currentSpeed;
    speedInput.min = '0.1';
    speedInput.max = '16';
    speedInput.step = '0.1';
    speedInput.style.cssText = `
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #666;
      border-radius: 4px;
      background: #333;
      color: white;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
    `;
    
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 8px;
      justify-content: space-between;
      margin-top: 5px;
    `;
    
    // 创建取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = `
      flex: 1;
      padding: 8px 0;
      background: #666;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: bold;
      transition: background 0.2s;
    `;
    
    // 创建确定按钮
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确定';
    confirmBtn.style.cssText = `
      flex: 1;
      padding: 8px 0;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: bold;
      transition: background 0.2s;
    `;
    
    // 按钮悬停效果
    cancelBtn.addEventListener('mouseover', () => {
      cancelBtn.style.background = '#777';
    });
    
    cancelBtn.addEventListener('mouseout', () => {
      cancelBtn.style.background = '#666';
    });
    
    confirmBtn.addEventListener('mouseover', () => {
      confirmBtn.style.background = '#45a049';
    });
    
    confirmBtn.addEventListener('mouseout', () => {
      confirmBtn.style.background = '#4CAF50';
    });
    
    // 按钮事件处理
    cancelBtn.addEventListener('click', () => {
      hideSpeedInput();
    });
    
    confirmBtn.addEventListener('click', () => {
      applyNewSpeed();
    });
    
    // 输入框回车和ESC事件
    speedInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        applyNewSpeed();
      } else if (e.key === 'Escape') {
        hideSpeedInput();
      }
    });
    
    // 创建常用倍速按钮容器
    const quickButtons = document.createElement('div');
    quickButtons.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 5px;
    `;
    
    // 常用倍速按钮
    const quickSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0, 5.0];
    
    quickSpeeds.forEach(speed => {
      const btn = document.createElement('button');
      btn.textContent = `${speed}x`;
      btn.style.cssText = `
        flex: 1;
        min-width: calc(33% - 4px);
        padding: 6px 0;
        background: ${Math.abs(speed - currentSpeed) < 0.01 ? '#2196F3' : '#555'};
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s;
      `;
      
      btn.addEventListener('click', () => {
        setSpeed(speed);
        hideSpeedInput();
      });
      
      btn.addEventListener('mouseover', () => {
        if (Math.abs(speed - currentSpeed) >= 0.01) {
          btn.style.background = '#666';
        }
      });
      
      btn.addEventListener('mouseout', () => {
        if (Math.abs(speed - currentSpeed) >= 0.01) {
          btn.style.background = '#555';
        }
      });
      
      quickButtons.appendChild(btn);
    });
    
    // 组装所有元素
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(confirmBtn);
    
    inputPanel.appendChild(title);
    inputPanel.appendChild(speedInput);
    inputPanel.appendChild(buttonContainer);
    inputPanel.appendChild(quickButtons);
    
    document.body.appendChild(inputPanel);
    
    // 自动选中输入框内容并聚焦
    setTimeout(() => {
      speedInput.focus();
      speedInput.select();
    }, 10);
    
    // 点击外部关闭
    document.addEventListener('click', handleOutsideClick, true);
  }
  
  // 处理外部点击
  function handleOutsideClick(e) {
    if (inputPanel && 
        !inputPanel.contains(e.target) && 
        !controlBtn.contains(e.target)) {
      hideSpeedInput();
    }
  }
  
  // 隐藏输入框
  function hideSpeedInput() {
    if (inputPanel && inputPanel.parentNode) {
      document.body.removeChild(inputPanel);
      inputPanel = null;
      speedInput = null;
    }
    
    // 移除事件监听器
    document.removeEventListener('click', handleOutsideClick, true);
  }
  
  // 应用新速度
  function applyNewSpeed() {
    let newSpeed = parseFloat(speedInput.value);
    if (!isNaN(newSpeed) && newSpeed >= 0.1 && newSpeed <= 16) {
      setSpeed(newSpeed);
      hideSpeedInput();
    } else {
      // 无效输入，恢复原值
      speedInput.value = currentSpeed;
      alert('请输入有效的倍速值 (0.1 - 16)');
      speedInput.focus();
      speedInput.select();
    }
  }
  
  // 设置速度（主函数）
  function setSpeed(newSpeed) {
    // 更新当前速度
    currentSpeed = parseFloat(newSpeed.toFixed(2));
    GM_setValue('videoSpeed', currentSpeed);
    
    // 更新控制按钮显示
    if (controlBtn) {
      controlBtn.textContent = `倍速: ${currentSpeed}x`;
    }
    
    // 应用新速度到当前文档的所有视频
    let videos = getAllVideoElements();
    applySpeedToVideos(videos, currentSpeed);
    
    // 立即检查并纠正
    checkAndCorrectVideoSpeed();
    
    // 触发自定义事件（用于页面内通信）
    window.dispatchEvent(new CustomEvent('speedChanged', {
      detail: { speed: currentSpeed }
    }));
  }
  
  // 应用速度到视频元素
  function applySpeedToVideos(videoElements, speed) {
    videoElements.forEach(element => {
      try {
        if (element.tagName === 'VIDEO') {
          element.playbackRate = speed;
        } else {
          let video = element.querySelector('video');
          if (video) {
            video.playbackRate = speed;
          } else if ('playbackRate' in element) {
            element.playbackRate = speed;
          }
        }
      } catch (e) {
        // 忽略错误
      }
    });
  }
  
  // 优化检查新视频函数
  function checkForNewVideos() {
    if (document.fullscreenElement || !document.body) return;
    
    let videos = getAllVideoElements();
    if (videos.length > 0) {
      // 应用速度但不重复创建控制按钮
      if (!controlBtn || !controlBtn.parentNode) {
        createControlButton();
      }
      
      // 只对新视频或速度不同的视频应用速度
      videos.forEach(video => {
        try {
          if (video.tagName === 'VIDEO' && Math.abs(video.playbackRate - currentSpeed) > 0.01) {
            video.playbackRate = currentSpeed;
          }
        } catch (e) {
          // 忽略错误
        }
      });
      
      // 检查并纠正速度
      checkAndCorrectVideoSpeed();
    }
  }
  
  // 节流函数
  let throttleTimer;
  function throttleCheck() {
    if (throttleTimer) return;
    throttleTimer = setTimeout(() => {
      checkForNewVideos();
      throttleTimer = null;
    }, 1500);
  }
  
  // 优化 MutationObserver 配置
  let observer = null;
  
  function initObserver() {
    if (observer) {
      observer.disconnect();
    }
    
    observer = new MutationObserver(debounce(throttleCheck, 500));
    
    // 只监听子节点变化，减少监听范围
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 延迟初始化
  function delayedInit() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(init, 1000);
        setTimeout(initObserver, 1500);
      });
    } else {
      setTimeout(init, 1000);
      setTimeout(initObserver, 1500);
    }
  }
  
  // 初始运行
  delayedInit();
  
  // 清理函数
  window.addEventListener('beforeunload', () => {
    stopSpeedCheck();
    if (observer) {
      observer.disconnect();
    }
  });
  
  // 添加全局函数以便其他脚本调用
  window.setVideoSpeed = setSpeed;
  window.getCurrentVideoSpeed = () => currentSpeed;
  window.enableAutoSpeedCorrection = startSpeedCheck;
  window.disableAutoSpeedCorrection = stopSpeedCheck;
  
})();