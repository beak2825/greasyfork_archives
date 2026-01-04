// ==UserScript==
// @name         BiliBackToBeginning
// @namespace    https://github.com/ImQQiaoO/BiliBackToBeginning
// @version      v0.2.0
// @description  打开或切换视频时，通过监听 video 元素的 loadstart 事件，精确地回到视频开头处
// @author       ImQQiaoO
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/list/*
// @match        *://*.bilibili.com/watchlater/*
// @match        *://*.bilibili.com/medialist/play/*
// @match        *://*.bilibili.com/bangumi/play/*
// @exclude      *://message.bilibili.com/*
// @exclude      *://data.bilibili.com/*
// @exclude      *://cm.bilibili.com/*
// @exclude      *://link.bilibili.com/*
// @exclude      *://passport.bilibili.com/*
// @exclude      *://api.bilibili.com/*
// @exclude      *://api.*.bilibili.com/*
// @exclude      *://*.chat.bilibili.com/*
// @exclude      *://member.bilibili.com/*
// @exclude      *://www.bilibili.com/tensou/*
// @exclude      *://www.bilibili.com/correspond/*
// @exclude      *://live.bilibili.com/* // 排除所有直播页面
// @exclude      *://www.bilibili.com/blackboard/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533710/BiliBackToBeginning.user.js
// @updateURL https://update.greasyfork.org/scripts/533710/BiliBackToBeginning.meta.js
// ==/UserScript==

// ==UserScript==
// @name         BiliBackToBeginning (v0.2.1 - 修复设置保存)
// @namespace    https://github.com/ImQQiaoO/BiliBackToBeginning
// @version      v0.2.1
// @description  打开或切换视频时，通过监听 video 元素的 loadstart 事件，精确地回到视频开头处
// @author       ImQQiaoO
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/list/*
// @match        *://*.bilibili.com/watchlater/*
// @match        *://*.bilibili.com/medialist/play/*
// @match        *://*.bilibili.com/bangumi/play/*
// @exclude      *://message.bilibili.com/*
// @exclude      *://data.bilibili.com/*
// @exclude      *://cm.bilibili.com/*
// @exclude      *://link.bilibili.com/*
// @exclude      *://passport.bilibili.com/*
// @exclude      *://api.bilibili.com/*
// @exclude      *://api.*.bilibili.com/*
// @exclude      *://*.chat.bilibili.com/*
// @exclude      *://member.bilibili.com/*
// @exclude      *://www.bilibili.com/tensou/*
// @exclude      *://www.bilibili.com/correspond/*
// @exclude      *://live.bilibili.com/* // 排除所有直播页面
// @exclude      *://www.bilibili.com/blackboard/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  // --- 设置和获取 localStorage ---
  const STORAGE_KEY = "reset_bili_video_enabled";
  function setEnabled(flag) {
    localStorage.setItem(STORAGE_KEY, flag ? "1" : "0");
    console.log(`[B站重置进度脚本] 设置已 ${flag ? "启用" : "禁用"}`);
  }
  function getEnabled() {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    const isEnabled = storedValue === null || storedValue === "1"; // 默认启用
    console.log(`[B站重置进度脚本] 获取设置状态: ${isEnabled ? "已启用" : "已禁用"} (存储值: ${storedValue})`);
    return isEnabled;
  }

  // --- 创建设置面板 ---
  function createSettingsPanel() {
    const style = `
              #biliResetPanel {
                  position: fixed; bottom: 30px; right: 30px;
                  z-index: 99999; background: #fff; color: #333;
                  border: 1px solid #bbb; border-radius: 8px;
                  box-shadow: 0 6px 16px rgba(0,0,0,.1);
                  padding: 18px 26px 18px 18px; font-size: 16px;
                  display: none;
              }
              #biliResetPanel input[type=checkbox] { transform: scale(1.3); margin-right:8px; vertical-align: middle;}
              #biliResetPanelClose { cursor:pointer;color: #f66; float:right; font-size: 18px; line-height: 1;}
              #biliResetPanelBtn {
                  position: fixed; bottom: 30px; right: 30px;
                  z-index: 99998; background: #ffe2a0; color: #333;
                  border: 1px solid #bbb; border-radius: 50%;
                  width: 42px; height: 42px; text-align:center; line-height: 42px;
                  font-size: 24px; cursor: pointer; box-shadow: 0 3px 12px rgba(0,0,0,.08);
                  user-select: none; /* 防止意外选中文本 */
              }
          `;
    
    // 添加样式
    const styleEl = document.createElement("style");
    styleEl.textContent = style;
    document.head.appendChild(styleEl);

    // 添加面板和按钮
    const panel = document.createElement("div");
    panel.id = "biliResetPanel";
    panel.innerHTML = `
              <span id="biliResetPanelClose" title="关闭设置面板">&times;</span>
              <label>
                  <input type="checkbox" id="biliResetSwitch">
                  启用自动重置进度到0秒
              </label>
          `;
    document.body.appendChild(panel);

    // 显示/隐藏按钮
    const btn = document.createElement("div");
    btn.id = "biliResetPanelBtn";
    btn.title = "打开【重置到0秒】设置";
    btn.textContent = "↩₀";
    document.body.appendChild(btn);

    // 获取元素
    const switchCheckbox = document.getElementById("biliResetSwitch");
    const closeButton = document.getElementById("biliResetPanelClose");

    // 绑定事件
    btn.onclick = (e) => {
      e.stopPropagation();
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    };
    
    closeButton.onclick = (e) => {
      e.stopPropagation();
      panel.style.display = "none";
    };
    
    document.addEventListener("click", (e) => {
      if (
        panel.style.display === "block" &&
        !panel.contains(e.target) &&
        !btn.contains(e.target)
      ) {
        panel.style.display = "none";
      }
    });

    // 设置复选框初始状态并绑定事件
    switchCheckbox.checked = getEnabled();
    switchCheckbox.onchange = (e) => {
      setEnabled(e.target.checked);
    };
    
    console.log(`[B站重置进度脚本] 复选框初始化完成，当前状态: ${getEnabled() ? "已启用" : "已禁用"}`);
  }

  // --- 核心功能：为视频元素添加重置逻辑 ---
  const processedVideoElements = new WeakSet();

  function setupVideoReset(videoElement) {
    if (!videoElement || processedVideoElements.has(videoElement)) {
      return;
    }

    console.log("[B站重置进度脚本] 开始为 video 元素设置重置监听器");
    processedVideoElements.add(videoElement);

    // 定义在元数据加载后执行的重置操作
    const onLoadedMetadata = () => {
      if (getEnabled()) {
        if (videoElement.currentTime > 0) {
          console.log(`[B站重置进度脚本] 检测到视频时间 ${videoElement.currentTime}秒，重置到 0 秒`);
          videoElement.currentTime = 0;
        }
      }
    };

    // 定义在每次视频开始加载时执行的操作
    const onLoadStart = () => {
      // 移除上一次可能遗留的监听器
      videoElement.removeEventListener("loadedmetadata", onLoadedMetadata);
      // 添加一次性的 'loadedmetadata' 监听器
      videoElement.addEventListener("loadedmetadata", onLoadedMetadata, {
        once: true,
      });
    };

    // 为 video 元素持续监听 'loadstart' 事件
    videoElement.addEventListener("loadstart", onLoadStart);

    // 处理初始状态
    if (videoElement.readyState >= 1 && videoElement.currentSrc) {
      onLoadedMetadata();
    }

    // 错误处理
    videoElement.addEventListener("error", (e) => {
      console.warn("[B站重置进度脚本] Video 元素报告错误:", e);
    });
  }

  // --- 使用 MutationObserver 监听 DOM 变化 ---
  function observeDOMForVideo() {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const videosToSetup = [];
              if (node.tagName === "VIDEO") {
                videosToSetup.push(node);
              } else if (typeof node.querySelectorAll === "function") {
                videosToSetup.push(...node.querySelectorAll("video"));
              }

              videosToSetup.forEach((video) => {
                if (!processedVideoElements.has(video)) {
                  setupVideoReset(video);
                }
              });
            }
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 检查页面加载时已经存在的 video 元素
    const existingVideos = document.querySelectorAll("video");
    existingVideos.forEach((video) => {
      if (!processedVideoElements.has(video)) {
        setupVideoReset(video);
      }
    });

    return observer;
  }

  // --- 初始化 ---
  function init() {
    if (document.body) {
      createSettingsPanel();
      observeDOMForVideo();
      console.log("[B站重置进度脚本] 初始化完成");
    } else {
      setTimeout(init, 100);
    }
  }

  // 确保在 DOM 加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // 页面完全加载后再次确认复选框状态
  window.addEventListener("load", () => {
    setTimeout(() => {
      const switchCheckbox = document.getElementById("biliResetSwitch");
      if (switchCheckbox) {
        switchCheckbox.checked = getEnabled();
        console.log(`[B站重置进度脚本] 页面加载完成后再次同步复选框状态: ${getEnabled() ? "已启用" : "已禁用"}`);
      }
    }, 500);
  });
})();
