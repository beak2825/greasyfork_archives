// ==UserScript==
// @name         视频精确控制工具（优化版）
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  为手机端视频添加可开关的悬浮精确控制工具条，完全透明背景不影响观看内容
// @author       wen2so
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528200/%E8%A7%86%E9%A2%91%E7%B2%BE%E7%A1%AE%E6%8E%A7%E5%88%B6%E5%B7%A5%E5%85%B7%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528200/%E8%A7%86%E9%A2%91%E7%B2%BE%E7%A1%AE%E6%8E%A7%E5%88%B6%E5%B7%A5%E5%85%B7%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置 - 调整为完全透明背景
  const CONFIG = {
    defaultEnabled: true,
    panelWidth: '94%',
    borderRadius: '18px',
    backgroundColor: 'rgba(30, 30, 30, 0.4)', // 更透明的背景
    buttonColor: 'rgba(50, 50, 50, 0.6)',
    accentColor: 'rgba(80, 110, 190, 0.5)',
    textColor: 'rgba(240, 240, 240, 0.95)',
    fontSize: '14px',
    buttonPadding: '8px 12px',
    gap: '8px'
  };

  // 状态管理
  let isEnabled = GM_getValue('videoControllerEnabled', CONFIG.defaultEnabled);
  let controller = null;
  let toggleButton = null;
  let timeUpdateInterval = null;

  // 创建主控制面板
  function createController() {
    if (controller) return;

    controller = document.createElement("div");
    controller.id = "video-precise-controller";
    controller.style.cssText = `
      position: fixed;
      bottom: 85px;
      left: 50%;
      transform: translateX(-50%);
      background: ${CONFIG.backgroundColor};
      padding: 16px;
      border-radius: ${CONFIG.borderRadius};
      display: flex;
      flex-direction: column;
      gap: ${CONFIG.gap};
      z-index: 2147483647;
      /* 移除磨砂效果，让背景完全清晰可见 */
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      width: ${CONFIG.panelWidth};
      max-width: 420px;
      font-size: ${CONFIG.fontSize};
      color: ${CONFIG.textColor};
      transition: all 0.3s ease;
      border: 1px solid rgba(255,255,255,0.08);
      ${isEnabled ? 'opacity: 1; transform: translateX(-50%) translateY(0);' : 'opacity: 0; transform: translateX(-50%) translateY(20px); pointer-events: none;'}
    `;

    // 创建主控制区域 - 充分利用空间的网格布局
    const mainGrid = document.createElement("div");
    mainGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${CONFIG.gap};
      margin-bottom: 12px;
    `;

    // 第一行：大按钮
    const largeButtonRow = document.createElement("div");
    largeButtonRow.style.cssText = `
      display: flex;
      gap: ${CONFIG.gap};
      grid-column: 1 / -1;
    `;

    // 添加5s/30s/1min按钮（按要求修改）
    const jumpButtons = [
      { text: "« 1min", seconds: -60 },
      { text: "« 30s", seconds: -30 },
      { text: "« 5s", seconds: -5 },
      { text: "5s »", seconds: 5 },
      { text: "30s »", seconds: 30 },
      { text: "1min »", seconds: 60 }
    ];

    jumpButtons.forEach(btnConfig => {
      const button = createLargeButton(btnConfig.text, () => adjustVideoTime(btnConfig.seconds));
      largeButtonRow.appendChild(button);
    });

    mainGrid.appendChild(largeButtonRow);
    controller.appendChild(mainGrid);

    // 创建底部工具栏 - 水平排列充分利用空间
    const toolsContainer = document.createElement("div");
    toolsContainer.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 0 0 0;
    `;

    // 左侧：播放速度控制
    const speedContainer = document.createElement("div");
    speedContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    const speedLabel = document.createElement("span");
    speedLabel.textContent = "速度:";
    speedLabel.style.cssText = `font-size: 13px;`;

    const speedControl = document.createElement("select");
    speedControl.innerHTML = `
      <option value="0.25">0.25x</option>
      <option value="0.5">0.5x</option>
      <option value="0.75">0.75x</option>
      <option value="1" selected>1x</option>
      <option value="1.25">1.25x</option>
      <option value="1.5">1.5x</option>
      <option value="2">2x</option>
      <option value="4">4x</option>
    `;
    speedControl.style.cssText = `
      background: ${CONFIG.buttonColor};
      color: ${CONFIG.textColor};
      border: none;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 13px;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      min-width: 65px;
    `;
    speedControl.onchange = (e) => {
      document.querySelectorAll("video").forEach((v) => {
        v.playbackRate = parseFloat(e.target.value);
      });
    };

    speedContainer.appendChild(speedLabel);
    speedContainer.appendChild(speedControl);

    // 右侧：精确时间控制
    const timeContainer = document.createElement("div");
    timeContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    const currentTimeDisplay = document.createElement("span");
    currentTimeDisplay.textContent = "00:00:00 / 00:00:00";
    currentTimeDisplay.style.cssText = `
      font-size: 13px;
      font-family: monospace;
      min-width: 120px;
      text-align: right;
    `;

    const timeInput = document.createElement("input");
    timeInput.type = "number";
    timeInput.min = 0;
    timeInput.step = 1;
    timeInput.placeholder = "秒";
    timeInput.style.cssText = `
      width: 65px;
      padding: 6px 8px;
      border: none;
      border-radius: 8px;
      background: ${CONFIG.buttonColor};
      color: ${CONFIG.textColor};
      font-size: 13px;
      text-align: center;
    `;

    const applyButton = createIconButton("✓", () => {
      const time = parseFloat(timeInput.value);
      if (!isNaN(time)) {
        document.querySelectorAll("video").forEach((v) => {
          const validTime = Math.max(0, Math.min(time, v.duration || Infinity));
          v.currentTime = validTime;
        });
      }
    });
    applyButton.style.cssText += `padding: 6px 10px;`;

    timeContainer.appendChild(currentTimeDisplay);
    timeContainer.appendChild(timeInput);
    timeContainer.appendChild(applyButton);

    toolsContainer.appendChild(speedContainer);
    toolsContainer.appendChild(timeContainer);
    controller.appendChild(toolsContainer);

    // 插入到页面
    document.body.appendChild(controller);

    // 开始更新时间显示
    if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    timeUpdateInterval = setInterval(updateTimeDisplay.bind(null, currentTimeDisplay, timeInput), 300);

    // 动态内容检测
    const observer = new MutationObserver(() => {
      if (!document.body.contains(controller)) {
        document.body.appendChild(controller);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 创建大型按钮（用于5s/30s/1min控制）
  function createLargeButton(text, onClick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.cssText = `
      flex: 1;
      padding: 12px 8px;
      border: none;
      border-radius: 10px;
      background: ${CONFIG.accentColor};
      color: ${CONFIG.textColor};
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      text-align: center;
    `;
    btn.addEventListener("click", onClick);
    btn.addEventListener("touchstart", () => {
      btn.style.transform = "scale(0.97)";
      btn.style.opacity = "0.9";
    });
    btn.addEventListener("touchend", () => {
      btn.style.transform = "scale(1)";
      btn.style.opacity = "1";
    });
    return btn;
  }

  // 创建图标按钮
  function createIconButton(icon, onClick) {
    const btn = document.createElement("button");
    btn.innerHTML = icon;
    btn.style.cssText = `
      padding: 6px 10px;
      border: none;
      border-radius: 8px;
      background: ${CONFIG.buttonColor};
      color: ${CONFIG.textColor};
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    btn.addEventListener("click", onClick);
    btn.addEventListener("touchstart", () => {
      btn.style.transform = "scale(0.95)";
      btn.style.opacity = "0.9";
    });
    btn.addEventListener("touchend", () => {
      btn.style.transform = "scale(1)";
      btn.style.opacity = "1";
    });
    return btn;
  }

  // 切换控制器开关
  function toggleController() {
    isEnabled = !isEnabled;
    GM_setValue('videoControllerEnabled', isEnabled);

    if (isEnabled) {
      if (!controller) createController();
      else {
        controller.style.opacity = "1";
        controller.style.transform = "translateX(-50%) translateY(0)";
        controller.style.pointerEvents = "auto";
      }
    } else {
      if (controller) {
        controller.style.opacity = "0";
        controller.style.transform = "translateX(-50%) translateY(20px)";
        controller.style.pointerEvents = "none";
      }
    }
  }

  // 创建悬浮开关按钮
  function createToggleButton() {
    if (toggleButton) return;

    toggleButton = document.createElement("div");
    toggleButton.id = "video-controller-toggle";
    toggleButton.style.cssText = `
      position: fixed;
      bottom: 25px;
      right: 25px;
      width: 45px;
      height: 45px;
      background: ${isEnabled ? CONFIG.accentColor : CONFIG.buttonColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${CONFIG.textColor};
      font-size: 20px;
      font-weight: bold;
      z-index: 2147483646;
      box-shadow: 0 3px 8px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(255,255,255,0.1);
    `;
    toggleButton.textContent = isEnabled ? "❚❚" : "▶";

    toggleButton.addEventListener("click", toggleController);
    toggleButton.addEventListener("touchstart", () => {
      toggleButton.style.transform = "scale(0.92)";
      toggleButton.style.opacity = "0.9";
    });
    toggleButton.addEventListener("touchend", () => {
      toggleButton.style.transform = "scale(1)";
      toggleButton.style.opacity = "1";
    });

    document.body.appendChild(toggleButton);
  }

  // 调整视频时间
  function adjustVideoTime(seconds) {
    const videos = document.querySelectorAll("video");
    if (videos.length === 0) return;

    videos.forEach((video) => {
      try {
        const newTime = video.currentTime + seconds;
        video.currentTime = Math.max(0, Math.min(newTime, video.duration || Infinity));
      } catch (error) {
        console.log("视频控制错误:", error);
      }
    });
  }

  // 更新时间显示（支持小时显示）
  function updateTimeDisplay(currentTimeDisplay, timeInput) {
    const video = document.querySelector("video");
    if (!video) return;

    const currentTime = Math.floor(video.currentTime);
    const duration = Math.floor(video.duration || 0);
    currentTimeDisplay.textContent = `${formatTimeHHMMSS(currentTime)} / ${formatTimeHHMMSS(duration)}`;

    // 仅在输入框未聚焦时更新其值
    if (document.activeElement !== timeInput) {
      timeInput.value = currentTime;
    }
  }

  // 格式化时间为 HH:MM:SS 格式
  function formatTimeHHMMSS(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "--:--:--";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
    } else {
      return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    }
  }

  // 初始化
  function init() {
    // 创建开关按钮
    createToggleButton();

    // 如果启用，则创建控制器
    if (isEnabled) {
      createController();
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();