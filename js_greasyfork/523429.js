// ==UserScript==
// @name         视频倍速播放
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  长按右方向键倍速播放，松开恢复原速，按 + 键增加倍速，按 - 键减少倍速，单击右方向键快进5秒。 按 ] 键从 1.5 倍速开始，每按一次增加 0.5 倍速，按 [ 键每次减少 0.5 倍速，按P键恢复1.0倍速。适配大部分网页播放器，尤其适配jellyfin等播放器播放nas内容。
// @license MIT
// @author       diyun
// @include      http://*/*
// @include      https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523429/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/523429/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
(function () {
  "use strict";
  let currentUrl = location.href;
  let keydownListener = null;
  let keyupListener = null;
  let urlObserver = null;
  let videoObserver = null;  // 添加此行
  let videoChangeObserver = null;
  let activeObservers = new Set();
  // 完整的清理函数
  function cleanup() {
    // 清理所有事件监听器
    if (keydownListener) {
      document.removeEventListener("keydown", keydownListener, true);
      keydownListener = null;
    }
    if (keyupListener) {
      document.removeEventListener("keyup", keyupListener, true);
      keyupListener = null;
    }
    // 清理所有观察器
    activeObservers.forEach((observer) => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });
    activeObservers.clear();
    videoObserver = null;
    urlObserver = null;
    videoChangeObserver = null;
  }
  // 等待视频元素加载
  function waitForVideoElement() {
    return new Promise((resolve, reject) => {
      const maxAttempts = 10;
      let attempts = 0;
      const checkVideo = () => {
        const video = document.querySelector("video");
        if (video && video.readyState >= 1) {
          return video;
        }
        return null;
      };
      // 立即检查
      const video = checkVideo();
      if (video) {
        resolve(video);
        return;
      }
      // 创建观察器
      const observer = new MutationObserver(() => {
        attempts++;
        const video = checkVideo();
        if (video) {
          observer.disconnect();
          resolve(video);
        } else if (attempts >= maxAttempts) {
          observer.disconnect();
          console.warn("未找到视频元素，脚本已停止运行");
          reject({ type: "no_video" }); // 使用对象替代 Error
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      activeObservers.add(observer);
      // 设置超时
      setTimeout(() => {
        observer.disconnect();
        activeObservers.delete(observer);
        console.warn("等待视频元素超时，脚本已停止运行");
        reject({ type: "timeout" }); // 使用对象替代 Error
      }, 10000);
    });
  }
  // 显示浮动提示
  function showFloatingMessage(message) {
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .floating-message {
        position: fixed;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 2147483647;
        pointer-events: none;
        font-size: 1.1em;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s ease;
      }
    `;
    document.head.appendChild(style);

    // 清除已存在的提示
    const existingMessages = document.querySelectorAll('.floating-message');
    existingMessages.forEach(el => el.remove());

    // 创建并显示新提示
    const messageEl = document.createElement('div');
    messageEl.className = 'floating-message';
    messageEl.textContent = message;

    // 获取全屏元素或回退到body
    const fullscreenElement = document.fullscreenElement || 
                             document.webkitFullscreenElement || 
                             document.mozFullScreenElement || 
                             document.msFullscreenElement;
    
    const targetContainer = fullscreenElement || document.body;
    targetContainer.appendChild(messageEl);

    // 2秒后自动移除
    setTimeout(() => {
      if (messageEl.parentElement) {
        messageEl.remove();
      }
    }, 2000);
  }
  
  // 检查是否在可输入元素中
  function isInInputElement(event) {
    const target = event.target;
    // 检查元素是否是输入类型
    if (target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.isContentEditable) {
      return true;
    }
    
    // 检查元素是否在编辑器中 (常见的编辑器包含这些类名或ID)
    const editorElements = ['editor', 'ace_editor', 'monaco-editor', 'CodeMirror'];
    for (const className of editorElements) {
      if (target.closest(`.${className}`) || target.closest(`#${className}`)) {
        return true;
      }
    }
    
    return false;
  }
  
  // 初始化脚本
  async function init() {
    cleanup();
    try {
      const video = await waitForVideoElement();
      console.log("找到视频元素：", video);
      const key = "ArrowRight"; // 监听的按键
      const increaseKey = "Equal"; // + 键
      const decreaseKey = "Minus"; // - 键
      const quickIncreaseKey = "BracketRight"; // 】键
      const quickDecreaseKey = "BracketLeft"; // 【键
      const resetSpeedKey = "KeyP"; // P键
      let targetRate = 2; // 目标倍速
      let currentQuickRate = 1.0; // 当前快速倍速
      let keyDownTime = 0; // 添加按键开始时间记录
      let originalRate = video.playbackRate; // 保存原始播放速度
      let isSpeedUp = false; // 添加一个标记来跟踪是否处于加速状态
      // 监听视频元素变化
      if (video.parentElement) {
        videoChangeObserver = new MutationObserver((mutations) => {
          const hasVideoChanges = mutations.some(
            (mutation) =>
              Array.from(mutation.removedNodes).some(
                (node) => node.tagName === "VIDEO"
              ) ||
              Array.from(mutation.addedNodes).some(
                (node) => node.tagName === "VIDEO"
              )
          );
          if (hasVideoChanges) {
            console.log("视频元素变化，重新初始化");
            cleanup();
            init().catch(console.error);
          }
        });
        videoChangeObserver.observe(video.parentElement, {
          childList: true,
          subtree: true,
        });
        activeObservers.add(videoChangeObserver);
      }
      // 创建新的事件监听器
      keydownListener = (e) => {
        // 首先检查是否在输入元素中，如果是则不处理快捷键
        if (isInInputElement(e)) {
          return;
        }
        
        if (e.code === key) {
          e.preventDefault();
          e.stopImmediatePropagation();
          
          // 记录按下时间
          if (!keyDownTime) {
            keyDownTime = Date.now();
          }
          
          // 如果按下超过300ms，认为是长按，进入加速模式
          if (!isSpeedUp && Date.now() - keyDownTime > 300) {
            isSpeedUp = true;
            originalRate = video.playbackRate;
            video.playbackRate = targetRate;
            showFloatingMessage(`开始 ${targetRate} 倍速播放`);
          }
        }
        // 按】键增加当前播放倍速
        if (e.code === quickIncreaseKey) {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (currentQuickRate === 1.0) {
            currentQuickRate = 1.5;
          } else {
            currentQuickRate += 0.5;
          }
          video.playbackRate = currentQuickRate;
          showFloatingMessage(`当前播放速度：${currentQuickRate}x`);
        }
        // 按【键减少当前播放倍速
        if (e.code === quickDecreaseKey) {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (currentQuickRate > 0.5) {
            currentQuickRate -= 0.5;
            video.playbackRate = currentQuickRate;
            showFloatingMessage(`当前播放速度：${currentQuickRate}x`);
          }
        }
        // 按P键恢复1.0倍速
        if (e.code === resetSpeedKey || e.key.toLowerCase() === "p") {
          e.preventDefault();
          e.stopImmediatePropagation();
          currentQuickRate = 1.0;
          video.playbackRate = 1.0;
          showFloatingMessage("恢复正常播放速度");
        }
        // 按 + 键：增加 targetRate 的值
        if (e.code === increaseKey) {
          e.preventDefault();
          e.stopImmediatePropagation();
          targetRate += 0.5;
          showFloatingMessage(`下次倍速：${targetRate}`);
        }
        // 按 - 键：减少 targetRate 的值
        if (e.code === decreaseKey) {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (targetRate > 0.5) {
            targetRate -= 0.5;
            showFloatingMessage(`下次倍速：${targetRate}`);
          } else {
            showFloatingMessage("倍速已达到最小值 0.5");
          }
        }
      };
      keyupListener = (e) => {
        // 首先检查是否在输入元素中，如果是则不处理快捷键
        if (isInInputElement(e)) {
          return;
        }
        
        if (e.code === key) {
          e.preventDefault();
          e.stopImmediatePropagation();
          
          const pressTime = Date.now() - keyDownTime;
          
          // 如果按下时间小于300ms，认为是点击，快进5秒
          if (pressTime < 300) {
            video.currentTime += 5;
          }
          
          // 如果处于加速状态，恢复原速
          if (isSpeedUp) {
            video.playbackRate = originalRate;
            showFloatingMessage(`恢复 ${originalRate} 倍速播放`);
            isSpeedUp = false;
          }
          
          // 重置状态
          keyDownTime = 0;
        }
      };
      // 绑定事件监听器
      document.addEventListener("keydown", keydownListener, true);
      document.addEventListener("keyup", keyupListener, true);
      return true;
    } catch (error) {
      console.error("初始化失败:", error);
      return false;
    }
  }
  // 监听 URL 变化
  function watchUrlChange() {
    urlObserver = new MutationObserver(() => {
      if (location.href !== currentUrl) {
        currentUrl = location.href;
        console.log("URL变化，重新初始化");
        cleanup();
        setTimeout(() => init().catch(console.error), 1000);
      }
    });
    urlObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    activeObservers.add(urlObserver);
    // 增强的 History API 监听
    const handleStateChange = () => {
      if (location.href !== currentUrl) {
        currentUrl = location.href;
        cleanup();
        setTimeout(() => init().catch(console.error), 1000);
      }
    };
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function () {
      originalPushState.apply(this, arguments);
      handleStateChange();
    };
    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      handleStateChange();
    };
    window.addEventListener("popstate", handleStateChange);
  }
  // 启动脚本
  const startScript = async () => {
    let retryCount = 0;
    const maxRetries = 3;
    const tryInit = async () => {
      try {
        const success = await init();
        if (success) {
          watchUrlChange();
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.warn(`初始化重试 (${retryCount}/${maxRetries})`); // 改为警告
          setTimeout(tryInit, 2000);
        }
      } catch (error) {
        // 检查错误类型
        if (error && (error.type === "no_video" || error.type === "timeout")) {
          return; // 直接返回，不做额外处理
        }
        console.warn("启动失败:", error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(tryInit, 2000);
        }
      }
    };
    tryInit();
  };
  startScript();
})();
