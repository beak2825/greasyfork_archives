// ==UserScript==
// @name         提示音定时器（自定义间隔 + 保存设置 + 自定义声音）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  自定义提示音间隔，自定义声音，自动保存设置，支持通知与静音等功能。
// @author       Knan
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534641/%E6%8F%90%E7%A4%BA%E9%9F%B3%E5%AE%9A%E6%97%B6%E5%99%A8%EF%BC%88%E8%87%AA%E5%AE%9A%E4%B9%89%E9%97%B4%E9%9A%94%20%2B%20%E4%BF%9D%E5%AD%98%E8%AE%BE%E7%BD%AE%20%2B%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%A3%B0%E9%9F%B3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534641/%E6%8F%90%E7%A4%BA%E9%9F%B3%E5%AE%9A%E6%97%B6%E5%99%A8%EF%BC%88%E8%87%AA%E5%AE%9A%E4%B9%89%E9%97%B4%E9%9A%94%20%2B%20%E4%BF%9D%E5%AD%98%E8%AE%BE%E7%BD%AE%20%2B%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%A3%B0%E9%9F%B3%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 防止重复注入
  if (window.__soundTimerInjected) return;
  window.__soundTimerInjected = true;

  // 默认设置
  const DEFAULT_SETTINGS = {
    A_MIN: 3,
    A_MAX: 5,
    B_INTERVAL: 90,
    B_PAUSE: 20,
    A_PAUSE: 10,
    A_URL: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    B_URL: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
    PANEL_X: null,
    PANEL_Y: null,
  };

  // 状态管理
  const state = {
    settings: { ...DEFAULT_SETTINGS },
    isRunning: false,
    isMuted: false,
    isPaused: false,
    isNotifyEnabled: true,
    aTimer: null,
    bTimer: null,
    countdownInterval: null,
    nextATime: null,
    nextBTime: null,
    currentAudio: null,
    isDragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    isMinimized: false,
  };

  // DOM元素引用
  const dom = {
    panel: null,
    nextADisplay: null,
    nextBDisplay: null,
    inputs: {},
  };

  // 初始化函数
  function init() {
    loadSettings();
    createUI();
    // 直接最小化
    toggleMinimize(true);
    setupEventListeners();
  }

  // 加载设置
  function loadSettings() {
    try {
      const saved = localStorage.getItem("sound_timer_settings");
      if (saved) {
        Object.assign(state.settings, JSON.parse(saved));
      }
    } catch (e) {
      console.warn("加载设置失败", e);
    }
  }

  // 保存设置
  function saveSettings() {
    localStorage.setItem(
      "sound_timer_settings",
      JSON.stringify(state.settings)
    );
  }

  // 创建UI界面
  function createUI() {
    // 主面板
    dom.panel = document.createElement("div");
    dom.panel.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #ccc;
      padding: 10px;
      z-index: 999999;
      font-size: 14px;
      font-family: sans-serif;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      max-width: 280px;
      cursor: move;
      user-select: none;
      touch-action: none;
    `;

    // 设置初始位置
    if (state.settings.PANEL_X !== null && state.settings.PANEL_Y !== null) {
      dom.panel.style.left = `${state.settings.PANEL_X}px`;
      dom.panel.style.top = `${state.settings.PANEL_Y}px`;
    } else {
      dom.panel.style.bottom = "20px";
      dom.panel.style.right = "20px";
    }

    // 面板HTML内容
    dom.panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
        <button id="minimizeBtn">🔽</button>
        <strong>提示音定时器</strong>
        <button id="closeBtn" style="color: red;">✖</button>
      </div>
      <button id="startBtn">开始</button>
      <button id="stopBtn">停止</button>
      <button id="pauseBtn">⏸ 暂停</button>
      <button id="resetBtn">重置</button>
      <button id="muteBtn">🔈 静音</button>
      <button id="notifyBtn">🔔 通知</button>
      <hr/>
      <div>
        <b>A 音间隔设置：</b><br/>
        A 音间隔：最小 <input id="aMin" type="number" style="width: 40px;" min="1" /> ~
        最大 <input id="aMax" type="number" style="width: 40px;" min="1" /> 分钟<br/>
        播放后暂停：<input id="aPause" type="number" style="width: 50px;" min="1" /> 秒
      </div>
      <hr/>
      <div>
        <b>B 音间隔设置：</b><br/>
        B 音间隔 <input id="bInt" type="number" style="width: 50px;" min="1" /> 分钟<br/>
        播放后暂停 <input id="bPause" type="number" style="width: 50px;" min="1" /> 分钟
      </div>
      <hr/>
      <div>
        <b>声音链接（可选）：</b><br/>
        A 音 URL：<input id="aUrl" type="text" placeholder="mp3/ogg 链接" style="width: 100%;" /><br/>
        B 音 URL：<input id="bUrl" type="text" placeholder="mp3/ogg 链接" style="width: 100%;" />
      </div>
      <div style="margin-top: 10px;">
        下次 A 音：<span id="nextA">--</span><br/>
        下次 B 音：<span id="nextB">--</span>
      </div>
      <hr/>
      <div>
        <button id="aPreviewBtn">试听 A 音</button>
        <button id="bPreviewBtn">试听 B 音</button>
      </div>
    `;
    document.body.appendChild(dom.panel);

    // 获取DOM元素引用
    dom.nextADisplay = document.getElementById("nextA");
    dom.nextBDisplay = document.getElementById("nextB");

    // 输入元素
    dom.inputs = {
      aMin: document.getElementById("aMin"),
      aMax: document.getElementById("aMax"),
      bInt: document.getElementById("bInt"),
      bPause: document.getElementById("bPause"),
      aUrl: document.getElementById("aUrl"),
      bUrl: document.getElementById("bUrl"),
      aPause: document.getElementById("aPause"),
    };

    // 设置输入框初始值
    dom.inputs.aMin.value = state.settings.A_MIN;
    dom.inputs.aMax.value = state.settings.A_MAX;
    dom.inputs.bInt.value = state.settings.B_INTERVAL;
    dom.inputs.bPause.value = state.settings.B_PAUSE;
    dom.inputs.aUrl.value = state.settings.A_URL || "";
    dom.inputs.bUrl.value = state.settings.B_URL || "";
    dom.inputs.aPause.value = state.settings.A_PAUSE;
  }

  // 设置事件监听器
  function setupEventListeners() {
    // 拖拽功能
    dom.panel.addEventListener("mousedown", startDrag);
    dom.panel.addEventListener("touchstart", startDrag, { passive: false });

    // 按钮事件
    document.getElementById("startBtn").addEventListener("click", start);
    document.getElementById("stopBtn").addEventListener("click", stop);
    document.getElementById("muteBtn").addEventListener("click", toggleMute);
    document.getElementById("pauseBtn").addEventListener("click", togglePause);
    document
      .getElementById("notifyBtn")
      .addEventListener("click", toggleNotify);
    document
      .getElementById("resetBtn")
      .addEventListener("click", resetSettings);
    document
      .getElementById("minimizeBtn")
      .addEventListener("click", toggleMinimize);
    document
      .getElementById("aPreviewBtn")
      .addEventListener("click", () => previewSound("A"));
    document
      .getElementById("bPreviewBtn")
      .addEventListener("click", () => previewSound("B"));
    // 添加关闭按钮事件
    document.getElementById("closeBtn").addEventListener("click", closePanel);

    // 输入框事件
    Object.keys(dom.inputs).forEach((key) => {
      dom.inputs[key].addEventListener("change", updateSettingsFromInputs);
      if (key === "aUrl" || key === "bUrl") {
        dom.inputs[key].addEventListener("input", updateSettingsFromInputs);
      }
    });
  }

  // 关闭面板
  function closePanel() {
    // 停止所有定时器
    stop();

    // 保存当前设置
    saveSettings();

    // 清除缓存配置
    localStorage.removeItem("sound_timer_settings");

    // 移除面板
    if (dom.panel && dom.panel.parentNode) {
      dom.panel.parentNode.removeChild(dom.panel);
    }

    // 重置注入标记，允许重新注入
    window.__soundTimerInjected = false;

    log("面板已关闭");
  }

  // 拖拽开始
  function startDrag(e) {
    // 如果点击的是按钮或输入框，则不拖拽
    if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") {
      return;
    }

    e.preventDefault();
    state.isDragging = true;

    const rect = dom.panel.getBoundingClientRect();
    if (e.type === "mousedown") {
      state.dragOffsetX = e.clientX - rect.left;
      state.dragOffsetY = e.clientY - rect.top;
    } else {
      state.dragOffsetX = e.touches[0].clientX - rect.left;
      state.dragOffsetY = e.touches[0].clientY - rect.top;
    }

    // 移除可能存在的bottom/right定位
    dom.panel.style.bottom = "auto";
    dom.panel.style.right = "auto";

    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag, { passive: false });
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  }

  // 拖拽过程
  function drag(e) {
    if (!state.isDragging) return;
    e.preventDefault();

    const clientX = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === "mousemove" ? e.clientY : e.touches[0].clientY;

    // 计算新位置
    let newX = clientX - state.dragOffsetX;
    let newY = clientY - state.dragOffsetY;

    // 限制在视窗范围内
    const panelWidth = dom.panel.offsetWidth;
    const panelHeight = dom.panel.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    newX = Math.max(0, Math.min(newX, windowWidth - panelWidth));
    newY = Math.max(0, Math.min(newY, windowHeight - panelHeight));

    dom.panel.style.left = `${newX}px`;
    dom.panel.style.top = `${newY}px`;
  }

  // 拖拽结束
  function endDrag() {
    state.isDragging = false;

    // 保存位置
    const rect = dom.panel.getBoundingClientRect();
    state.settings.PANEL_X = rect.left;
    state.settings.PANEL_Y = rect.top;
    saveSettings();

    document.removeEventListener("mousemove", drag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchend", endDrag);
  }

  // 最小化/最大化面板
  function toggleMinimize() {
    state.isMinimized = !state.isMinimized;
    const minimizeBtn = document.getElementById("minimizeBtn");
    minimizeBtn.textContent = state.isMinimized ? "🔼" : "🔽";

    const elements = dom.panel.querySelectorAll("button, div, hr");
    elements.forEach((el) => {
      if (el !== minimizeBtn && el.id !== "closeBtn") {
        el.style.display = state.isMinimized ? "none" : "block";
      }
    });

    // 确保关闭按钮在最小化状态下仍然可见
    const closeBtn = document.getElementById("closeBtn");
    if (closeBtn) {
      closeBtn.style.display = "block";
    }

    if (!state.isMinimized) {
      // 恢复面板样式
      dom.panel.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #ccc;
        padding: 10px;
        z-index: 999999;
        font-size: 14px;
        font-family: sans-serif;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        max-width: 280px;
        cursor: move;
        user-select: none;
        touch-action: none;
      `;

      // 恢复位置
      if (state.settings.PANEL_X !== null && state.settings.PANEL_Y !== null) {
        dom.panel.style.left = `${state.settings.PANEL_X}px`;
        dom.panel.style.top = `${state.settings.PANEL_Y}px`;
      } else {
        dom.panel.style.bottom = "20px";
        dom.panel.style.right = "20px";
      }

      const buttons = dom.panel.querySelectorAll("button");
      buttons.forEach((btn) => {
        btn.style.display = "inline-block";
        btn.style.margin = "2px";
      });
    } else {
      // 在最小化状态下，确保标题和按钮在同一行
      const headerDiv = dom.panel.querySelector("div");
      if (headerDiv) {
        headerDiv.style.display = "flex";
      }
    }
  }

  // 从输入框更新设置
  function updateSettingsFromInputs() {
    state.settings.A_MIN = Math.max(
      1,
      parseInt(dom.inputs.aMin.value) || DEFAULT_SETTINGS.A_MIN
    );
    state.settings.A_MAX = Math.max(
      state.settings.A_MIN,
      parseInt(dom.inputs.aMax.value) || DEFAULT_SETTINGS.A_MAX
    );
    dom.inputs.aMax.value = state.settings.A_MAX;

    state.settings.B_INTERVAL = Math.max(
      1,
      parseInt(dom.inputs.bInt.value) || DEFAULT_SETTINGS.B_INTERVAL
    );
    state.settings.B_PAUSE = Math.max(
      1,
      parseInt(dom.inputs.bPause.value) || DEFAULT_SETTINGS.B_PAUSE
    );
    state.settings.A_PAUSE = Math.max(
      1,
      parseInt(dom.inputs.aPause.value) || DEFAULT_SETTINGS.A_PAUSE
    );
    state.settings.A_URL =
      dom.inputs.aUrl.value.trim() || DEFAULT_SETTINGS.A_URL;
    state.settings.B_URL =
      dom.inputs.bUrl.value.trim() || DEFAULT_SETTINGS.B_URL;
    saveSettings();
  }

  // 格式化时间显示
  function formatTime(ms) {
    if (!ms || ms <= 0) return "--";
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}分${sec.toString().padStart(2, "0")}秒`;
  }

  // 更新倒计时显示
  function updateCountdownDisplay() {
    const now = Date.now();
    dom.nextADisplay.textContent = formatTime(
      state.nextATime ? Math.max(0, state.nextATime - now) : null
    );
    dom.nextBDisplay.textContent = formatTime(
      state.nextBTime ? Math.max(0, state.nextBTime - now) : null
    );
  }

  // 开始倒计时更新器
  function startCountdownUpdater() {
    clearInterval(state.countdownInterval);
    state.countdownInterval = setInterval(updateCountdownDisplay, 1000);
  }

  // 停止倒计时更新器
  function stopCountdownUpdater() {
    clearInterval(state.countdownInterval);
    dom.nextADisplay.textContent = "--";
    dom.nextBDisplay.textContent = "--";
  }

  // 发送通知
  function notify(title, body) {
    if (!state.isNotifyEnabled) return;

    // 如果通知权限已经授予
    if (Notification.permission === "granted") {
      try {
        new Notification(title, { body });
      } catch (e) {
        console.warn("通知发送失败:", e);
      }
    }
    // 如果通知权限还未请求
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  }

  // 切换静音状态
  function toggleMute() {
    state.isMuted = !state.isMuted;
    const muteBtn = document.getElementById("muteBtn");
    muteBtn.textContent = state.isMuted ? "🔇 已静音" : "🔈 静音";
    log(state.isMuted ? "已静音" : "取消静音");

    if (state.isMuted && state.currentAudio) {
      state.currentAudio.pause();
      log("当前音频已暂停");
    } else if (
      !state.isMuted &&
      state.currentAudio &&
      !state.currentAudio.ended
    ) {
      state.currentAudio.play().catch((err) => {
        log("音频继续播放失败: " + err.message);
      });
    }
  }

  // 试听声音
  function previewSound(type) {
    const url = type === "A" ? state.settings.A_URL : state.settings.B_URL;
    const label = `${type} 提示音`;
    playSound(url, label, () => {});
  }

  // 播放声音
  function playSound(url, label, onComplete) {
    if (state.isPaused) {
      log(`${label} 已暂停，延后播放`);
      setTimeout(() => playSound(url, label, onComplete), 5000);
      return;
    }

    if (state.currentAudio && !state.currentAudio.ended) {
      log(`当前正在播放音频，跳过新的播放请求`);
      return;
    }

    notify(label, `即将播放 ${label}`);
    if (state.isMuted) {
      log(`${label} 静音中，跳过播放`);
      setTimeout(onComplete, 100);
      return;
    }

    const audio = new Audio(url);
    state.currentAudio = audio;

    audio
      .play()
      .then(() => {
        log(`${label} 播放中...`);
        audio.onended = () => {
          log(`${label} 播放完成`);
          onComplete();
        };
      })
      .catch((err) => {
        log(`${label} 播放失败: ${err.message}`);
        onComplete();
      });
  }

  // 随机安排A音
  function scheduleRandomA() {
    if (!state.isRunning) return;
    updateSettingsFromInputs();

    const delay = getRandomDelay(
      state.settings.A_MIN * 60 * 1000,
      state.settings.A_MAX * 60 * 1000
    );

    state.nextATime = Date.now() + delay;
    updateCountdownDisplay();
    log(`A 音将在 ${Math.round(delay / 1000)} 秒后播放`);

    state.aTimer = setTimeout(() => {
      playSound(state.settings.A_URL, "A 提示音", () => {
        log(`A 音播放后暂停 ${state.settings.A_PAUSE} 秒...`);
        state.nextATime = Date.now() + state.settings.A_PAUSE * 1000;
        updateCountdownDisplay();
        setTimeout(scheduleRandomA, state.settings.A_PAUSE * 1000);
      });
    }, delay);
  }

  // 安排B音
  function scheduleLoopB() {
    if (!state.isRunning) return;
    updateSettingsFromInputs();

    const delay = state.settings.B_INTERVAL * 60 * 1000;
    state.nextBTime = Date.now() + delay;
    updateCountdownDisplay();
    log(`B 音将在 ${state.settings.B_INTERVAL} 分钟后播放`);

    state.bTimer = setTimeout(() => {
      playSound(state.settings.B_URL, "B 提示音", () => {
        log(`B 音播放后暂停 ${state.settings.B_PAUSE} 分钟...`);
        state.nextBTime = Date.now() + state.settings.B_PAUSE * 60 * 1000;
        updateCountdownDisplay();
        setTimeout(scheduleLoopB, state.settings.B_PAUSE * 60 * 1000);
      });
    }, delay);
  }

  // 获取随机延迟时间
  function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 开始定时器
  function start() {
    if (state.isRunning) return log("已经启动");

    // 尝试播放音频以解锁权限
    const unlock = new Audio(state.settings.A_URL);
    unlock
      .play()
      .then(() => {
        unlock.pause();
        unlock.currentTime = 0;
        log("已解锁音频播放权限，开始定时");

        state.isRunning = true;
        state.isPaused = false;
        document.getElementById("pauseBtn").textContent = "⏸ 暂停";

        Notification.requestPermission().catch(() => {});
        startCountdownUpdater();
        scheduleRandomA();
        scheduleLoopB();
      })
      .catch((err) => {
        alert("请先点击页面并允许播放音频，然后再点击开始按钮");
        log("音频权限未授予：" + err.message);
      });
  }

  // 停止定时器
  function stop() {
    if (!state.isRunning) return log("已停止");

    state.isRunning = false;
    clearTimeout(state.aTimer);
    clearTimeout(state.bTimer);
    stopCountdownUpdater();
    log("已停止所有定时任务");
  }

  // 切换暂停状态
  function togglePause() {
    state.isPaused = !state.isPaused;
    const pauseBtn = document.getElementById("pauseBtn");
    pauseBtn.textContent = state.isPaused ? "▶️ 恢复" : "⏸ 暂停";
    log(state.isPaused ? "已暂停播放" : "已恢复播放");

    if (state.isPaused) {
      // 保存剩余时间并清除定时器
      if (state.nextATime) {
        window.__pausedATimeRemaining = Math.max(
          0,
          state.nextATime - Date.now()
        );
        clearTimeout(state.aTimer);
      }
      if (state.nextBTime) {
        window.__pausedBTimeRemaining = Math.max(
          0,
          state.nextBTime - Date.now()
        );
        clearTimeout(state.bTimer);
      }
      clearInterval(state.countdownInterval);
    } else {
      // 恢复定时器
      if (window.__pausedATimeRemaining) {
        state.nextATime = Date.now() + window.__pausedATimeRemaining;
        state.aTimer = setTimeout(() => {
          playSound(state.settings.A_URL, "A 提示音", () => {
            log(`A 音播放后暂停 ${state.settings.A_PAUSE} 秒...`);
            state.nextATime = Date.now() + state.settings.A_PAUSE * 1000;
            updateCountdownDisplay();
            setTimeout(scheduleRandomA, state.settings.A_PAUSE * 1000);
          });
        }, window.__pausedATimeRemaining);
        window.__pausedATimeRemaining = null;
      }
      if (window.__pausedBTimeRemaining) {
        state.nextBTime = Date.now() + window.__pausedBTimeRemaining;
        state.bTimer = setTimeout(() => {
          playSound(state.settings.B_URL, "B 提示音", () => {
            log(`B 音播放后暂停 ${state.settings.B_PAUSE} 分钟...`);
            state.nextBTime = Date.now() + state.settings.B_PAUSE * 60 * 1000;
            updateCountdownDisplay();
            setTimeout(scheduleLoopB, state.settings.B_PAUSE * 60 * 1000);
          });
        }, window.__pausedBTimeRemaining);
        window.__pausedBTimeRemaining = null;
      }
      startCountdownUpdater();
    }
    updateCountdownDisplay();
  }

  // 切换通知状态
  function toggleNotify() {
    state.isNotifyEnabled = !state.isNotifyEnabled;
    const notifyBtn = document.getElementById("notifyBtn");
    notifyBtn.textContent = state.isNotifyEnabled ? "🔔 通知" : "🔕 静默";
    log(state.isNotifyEnabled ? "已开启通知" : "已关闭通知");
  }

  // 重置设置
  function resetSettings() {
    if (!confirm("确定要重置所有设置为默认值吗？")) return;

    state.settings = { ...DEFAULT_SETTINGS };

    // 更新UI
    dom.inputs.aMin.value = state.settings.A_MIN;
    dom.inputs.aMax.value = state.settings.A_MAX;
    dom.inputs.bInt.value = state.settings.B_INTERVAL;
    dom.inputs.bPause.value = state.settings.B_PAUSE;
    dom.inputs.aUrl.value = state.settings.A_URL;
    dom.inputs.bUrl.value = state.settings.B_URL;
    dom.inputs.aPause.value = state.settings.A_PAUSE;

    // 重置面板位置
    dom.panel.style.bottom = "20px";
    dom.panel.style.right = "20px";
    dom.panel.style.left = "auto";
    dom.panel.style.top = "auto";
    state.settings.PANEL_X = null;
    state.settings.PANEL_Y = null;

    localStorage.removeItem("sound_timer_settings");
    log("设置已重置为默认值");
  }

  // 日志函数
  function log(msg) {
    console.log(`[提示音定时器] ${msg}`);
  }

  // 初始化应用
  init();
})();
