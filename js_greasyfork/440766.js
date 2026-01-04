// ==UserScript==
// @name         小叶的b站学习助手（视频时间查询器+视频倍速播放）
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  这一款专为B站用户打造的实用小工具，包含了B站视频的倍速播放（支持快捷键和控制面板设置），以及视频时间查询器（够便捷地计算视频的总时长，并根据不同的倍速计算实际的观看时间）。这款工具除了提供精确的时间统计，还具备窗口拖动、动态样式调整等功能，非常适合在B站学习课程的用户使用；2.x版本将“倍速功能”单独拆分到独立UI和单独热键监听中，并且原来的“时间计算”功能保持不变。
// @author       小叶
// @license      AGPL License
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/440766/%E5%B0%8F%E5%8F%B6%E7%9A%84b%E7%AB%99%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E6%9F%A5%E8%AF%A2%E5%99%A8%2B%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/440766/%E5%B0%8F%E5%8F%B6%E7%9A%84b%E7%AB%99%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E6%9F%A5%E8%AF%A2%E5%99%A8%2B%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ================== 配置 ==================
  const CONFIG = {
    UI: {
      TRIGGER_ID: 'popup-trigger-container',
      CONTAINER_ID: 'time-calculator-container',
      RESULT_DIV_ID: 'resultDiv',
      DEFAULT_OPACITY: 0.8,
      Z_INDEX: 999999,
      ICON_URL: 'https://www.bilibili.com/favicon.ico'
    },
    SPEED_UI: { SHOW_SPEED_UI: true },
    STYLE: {
      COLORS: {
        PRIMARY: '#00A1D6',
        SECONDARY: '#40E0D0',
        WARNING: '#FF6347',
        HOVER: '#008BB5',
        TEXT: { PRIMARY: '#333', SECONDARY: '#888' }
      },
      BORDER_RADIUS: { SMALL: '4px', MEDIUM: '8px', LARGE: '16px' },
      TRANSITIONS: { DEFAULT: 'all 0.3s ease' }
    },
    FEATURES: {
      RESULT_DISPLAY_TIME: 15000,
      MIN_EPISODE: 1,
      MIN_SPEED: 0.5,
      SPEED_STEP: 0.1,
      DEFAULT_SPEED: 1,
      TIME_FORMATS: ['时分秒', '仅小时', '仅分钟', '仅秒']
    },
    LAYOUT: {
      SNAP_PADDING: 20,
      CONTAINER_WIDTH: '280px',
      TRIGGER_WIDTH: { DEFAULT: '40px', EXPANDED: '80px' }
    },
    TEXT: {
      TRIGGER_TEXT: '小叶计时器',
      CLOSE_TEXT: '关闭计时器',
      TITLE: '小叶的B站时间查询器',
      FOOTER: '小叶计时器',
      MESSAGES: {
        INVALID_INPUT: '请输入有效的数值。',
        MIN_EPISODE: '最小为第1集',
        INVALID_RANGE: '输入的集数范围不正确。',
        NO_DURATION: '无法获取视频时长，请确保已加载视频列表。',
        MAX_EPISODE: '最大为第{count}集'
      }
    },
    CLASSES: { DURATION: 'duration', STATS: 'stats' }
  };

  // 本地存储键
  const STORAGE_KEYS = {
    OPACITY: 'containerOpacity',
    FACTOR: 'calcFactor',           // 仅用于时间计算的倍数
    CALC_POS: 'calcPosition',       // 时间计算面板位置
    SPEED_POS: 'speedUiPosition',   // 倍速面板位置
    PLAYBACK: 'playbackSpeed'       // 实际播放倍速
  };

  // ============ 状态 ============
  let containerOpacity = GM_getValue(STORAGE_KEYS.OPACITY, CONFIG.UI.DEFAULT_OPACITY);
  let userSpeedFactor = parseFloat(GM_getValue(STORAGE_KEYS.FACTOR, 1.0)) || 1.0; // 计算倍数（>0）
  let isPopupVisible = false;
  let resultTimeoutId = null;

  // 实际视频倍速（可记忆）
  let currentSpeed = parseFloat(GM_getValue(STORAGE_KEYS.PLAYBACK, 1.0)) || 1.0;
  let originalSpeed = 1.0;

  // ============ 通用：拖拽并记忆位置 ============
  function makeElementDraggable(el, storageKey) {
    let offsetX = 0, offsetY = 0, isDragging = false;

    el.addEventListener('mousedown', (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.button !== 0) return;
      isDragging = true;
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      el.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
      el.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      el.style.transition = CONFIG.STYLE.TRANSITIONS.DEFAULT;
      if (storageKey) {
        const rect = el.getBoundingClientRect();
        GM_setValue(storageKey, JSON.stringify({ left: rect.left, top: rect.top }));
      }
    });

    // 初次挂载时恢复位置
    if (storageKey) {
      const posRaw = GM_getValue(storageKey, null);
      if (posRaw) {
        try {
          const pos = JSON.parse(posRaw);
          if (typeof pos.left === 'number' && typeof pos.top === 'number') {
            el.style.left = `${pos.left}px`;
            el.style.top = `${pos.top}px`;
            el.style.right = 'auto';
          }
        } catch (_) { }
      }
    }
  }

  // ============ 一、时间计算触发器 ============
  const createPopupTrigger = () => {
    if (!document.querySelector(`.${CONFIG.CLASSES.STATS}`)) {
      console.log('没有找到视频元素，触发器不会显示。');
      return;
    }
    const existingTrigger = document.getElementById(CONFIG.UI.TRIGGER_ID);
    if (existingTrigger) existingTrigger.remove();

    const body = document.body;
    const triggerContainer = document.createElement('div');
    triggerContainer.id = CONFIG.UI.TRIGGER_ID;
    triggerContainer.style.cssText = `
      position: fixed;
      right: 0;
      top: 12%;
      transform: translateY(-50%);
      z-index: ${CONFIG.UI.Z_INDEX};
      text-align: center;
      border: 1px solid ${CONFIG.STYLE.COLORS.PRIMARY};
      border-radius: ${CONFIG.STYLE.BORDER_RADIUS.MEDIUM};
      background-color: rgba(255,255,255,${containerOpacity});
      padding: 8px;
      width: ${CONFIG.LAYOUT.TRIGGER_WIDTH.DEFAULT};
      transition: ${CONFIG.STYLE.TRANSITIONS.DEFAULT};
      cursor: pointer;
      margin-left: 5px;
    `;

    const icon = document.createElement('img');
    icon.src = CONFIG.UI.ICON_URL;
    icon.alt = 'B站图标';
    icon.style.cssText = `
      width: 24px; height: 24px; display: block; margin: 0 auto;
      transition: ${CONFIG.STYLE.TRANSITIONS.DEFAULT};
    `;

    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
      font-size: 12px; color: ${CONFIG.STYLE.COLORS.PRIMARY};
      margin-top: 4px; white-space: nowrap; overflow: hidden; display: none;
    `;
    textContainer.innerText = CONFIG.TEXT.TRIGGER_TEXT;

    triggerContainer.onmouseenter = () => {
      triggerContainer.style.width = CONFIG.LAYOUT.TRIGGER_WIDTH.EXPANDED;
      textContainer.style.display = 'block';
    };
    triggerContainer.onmouseleave = () => {
      if (!isPopupVisible) {
        triggerContainer.style.width = CONFIG.LAYOUT.TRIGGER_WIDTH.DEFAULT;
        textContainer.style.display = 'none';
      }
    };

    triggerContainer.onclick = togglePopup;
    triggerContainer.appendChild(icon);
    triggerContainer.appendChild(textContainer);
    body.appendChild(triggerContainer);
    return triggerContainer;
  };

  const togglePopup = () => {
    isPopupVisible = !isPopupVisible;
    const triggerContainer = document.getElementById(CONFIG.UI.TRIGGER_ID);
    const textContainer = triggerContainer ? triggerContainer.querySelector('div') : null;

    if (isPopupVisible) {
      createTimeCalcUI();
      if (triggerContainer && textContainer) {
        triggerContainer.style.width = '80px';
        textContainer.style.display = 'block';
        textContainer.style.color = '#FF0000';
        textContainer.innerText = CONFIG.TEXT.CLOSE_TEXT;
      }
    } else {
      closeTimeCalcUI();
      if (triggerContainer && textContainer) {
        triggerContainer.style.width = '40px';
        textContainer.style.color = CONFIG.STYLE.COLORS.PRIMARY;
        textContainer.innerText = CONFIG.TEXT.TRIGGER_TEXT;
      }
    }
  };

  // ============ 二、时间计算 UI ============
  const createTimeCalcUI = () => {
    const existingDiv = document.getElementById(CONFIG.UI.CONTAINER_ID);
    if (existingDiv) existingDiv.remove();

    const body = document.body;
    const container = document.createElement('div');
    container.id = CONFIG.UI.CONTAINER_ID;
    container.style.cssText = `
      padding: 20px;
      background-color: rgba(255,255,255,${containerOpacity});
      position: fixed;
      right: 20px;
      top: 20%;
      width: 280px; max-width: 90%;
      border-radius: 16px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      border: 1px solid ${CONFIG.STYLE.COLORS.SECONDARY};
      z-index: 999999;
      text-align: center;
      font-size: 14px; color: ${CONFIG.STYLE.COLORS.TEXT.PRIMARY};
    `;

    makeElementDraggable(container, STORAGE_KEYS.CALC_POS);

    const closeButton = document.createElement('button');
    closeButton.innerText = '关闭';
    closeButton.style.cssText = `
      position: absolute; top: 5px; right: 5px;
      border: none; background-color: ${CONFIG.STYLE.COLORS.WARNING};
      color: #FFF; padding: 5px 10px; cursor: pointer;
      border-radius: ${CONFIG.STYLE.BORDER_RADIUS.SMALL};
    `;
    closeButton.onclick = togglePopup;
    container.appendChild(closeButton);

    const title = document.createElement('h4');
    title.innerText = CONFIG.TEXT.TITLE;
    title.style.cssText = `
      margin-bottom: 20px; color: ${CONFIG.STYLE.COLORS.PRIMARY};
      font-weight: bold; text-align: center;
    `;
    container.appendChild(title);

    // 区间输入
    const inputDiv = document.createElement('div');
    inputDiv.style.cssText = 'margin-bottom: 15px; display:flex; justify-content:center; align-items:center;';
    const label1 = document.createElement('label'); label1.innerText = '从第'; label1.style.cssText = 'margin-right:5px;'; inputDiv.appendChild(label1);
    const input1 = document.createElement('input');
    input1.type = 'number'; input1.min = '1';
    input1.style.cssText = 'border:1px solid deepskyblue;width:50px;text-align:center;margin-right:5px;padding:5px;border-radius:4px;';
    inputDiv.appendChild(input1);
    const label2 = document.createElement('label'); label2.innerText = '集 到'; label2.style.cssText = 'margin-right:5px;'; inputDiv.appendChild(label2);
    const input2 = document.createElement('input');
    input2.type = 'number'; input2.min = '1';
    input2.style.cssText = 'border:1px solid deepskyblue;width:50px;text-align:center;padding:5px;border-radius:4px;';
    inputDiv.appendChild(input2);
    container.appendChild(inputDiv);

    // 显示格式
    const formatDiv = document.createElement('div');
    formatDiv.style.cssText = 'margin-bottom: 15px; display:flex; justify-content:center; align-items:center;';
    const fLabel = document.createElement('label'); fLabel.innerText = '显示格式：'; fLabel.style.cssText = 'margin-right:5px;'; formatDiv.appendChild(fLabel);
    const formatSelect = document.createElement('select');
    formatSelect.style.cssText = 'padding:5px;border-radius:4px;border:1px solid deepskyblue;';
    CONFIG.FEATURES.TIME_FORMATS.forEach(t => {
      const opt = document.createElement('option'); opt.value = t; opt.innerText = t; formatSelect.appendChild(opt);
    });
    formatDiv.appendChild(formatSelect);
    container.appendChild(formatDiv);

    // —— 新增：倍数计算（放在透明度上方）——
    const factorDiv = document.createElement('div');
    factorDiv.style.cssText = 'margin-bottom: 15px; display:flex; justify-content:center; align-items:center; gap:6px; flex-wrap:wrap;';
    const factorLabel = document.createElement('label'); factorLabel.innerText = '倍数（仅计算）：'; factorDiv.appendChild(factorLabel);
    const factorInput = document.createElement('input');
    factorInput.type = 'number'; factorInput.min =    factorDiv.appendChild(factorInput);

    // 一键把“计算倍数”应用为“实际播放倍速”
    const applyFactorBtn = document.createElement('button');
    applyFactorBtn.innerText = '用此倍数设为播放倍速';
    applyFactorBtn.style.cssText = 'border:none;background:#00A1D6;color:#fff;padding:4px 8px;cursor:pointer;border-radius:4px;';
    applyFactorBtn.onclick = () => {
      const v = parseFloat(factorInput.value);
      if (isNaN(v) || v <= 0) { alert('倍数需大于0'); return; }
      setAllVideoPlaybackRate(v);
      GM_setValue(STORAGE_KEYS.PLAYBACK, v);
    };
    factorDiv.appendChild(applyFactorBtn);
    container.appendChild(factorDiv);

    // 透明度
    const transparencyDiv = document.createElement('div');
    transparencyDiv.style.cssText = 'margin-bottom: 15px; text-align:center;';
    const tLabel = document.createElement('label'); tLabel.innerText = '调整透明度：'; transparencyDiv.appendChild(tLabel);
    const tSlider = document.createElement('input');
    tSlider.type = 'range'; tSlider.min = 0.1; tSlider.max = 1; tSlider.step = 0.1; tSlider.value = containerOpacity;
    tSlider.style.cssText = 'margin-left: 10px;';
    tSlider.oninput = (e) => {
      containerOpacity = parseFloat(e.target.value);
      container.style.backgroundColor = `rgba(255,255,255,${containerOpacity})`;
      const trig = document.getElementById(CONFIG.UI.TRIGGER_ID);
      if (trig) trig.style.backgroundColor = `rgba(255,255,255,${containerOpacity})`;
      GM_setValue(STORAGE_KEYS.OPACITY, containerOpacity);
    };
    transparencyDiv.appendChild(tSlider);
    container.appendChild(transparencyDiv);

    // 计算按钮
    const btn = document.createElement('button');
    btn.innerText = '计算时间';
    btn.style.cssText = `
      width:100%; padding:12px; border:none; background-color:${CONFIG.STYLE.COLORS.PRIMARY};
      color:#fff; cursor:pointer; border-radius:8px; font-size:16px; margin-bottom: 12px;
    `;
    btn.onmouseover = () => { btn.style.backgroundColor = CONFIG.STYLE.COLORS.HOVER; };
    btn.onmouseout = () => { btn.style.backgroundColor = CONFIG.STYLE.COLORS.PRIMARY; };
    btn.onclick = () => {
      calculateTime(formatSelect.value, input1.value, input2.value, factorInput.value);
    };
    container.appendChild(btn);

    // 结果
    const resultDiv = document.createElement('div');
    resultDiv.id = CONFIG.UI.RESULT_DIV_ID;
    resultDiv.style.cssText = 'margin-top: 8px; color:#333; font-weight:bold; text-align:center; white-space:pre-line;';
    container.appendChild(resultDiv);

    const tip = document.createElement('div');
    tip.style.cssText = 'margin-top:6px;color:#888;font-size:12px;';
    tip.innerText = '说明：上方“倍数”只影响时间计算；实际播放倍速请用右侧倍速UI或上面的同步按钮。';
    container.appendChild(tip);

    const footer = document.createElement('div');
    footer.innerText = CONFIG.TEXT.FOOTER;
    footer.style.cssText = 'margin-top: 10px; color:#888; font-size:12px; text-align:center;';
    container.appendChild(footer);

    body.appendChild(container);
  };

  const closeTimeCalcUI = () => {
    const existingDiv = document.getElementById(CONFIG.UI.CONTAINER_ID);
    if (existingDiv) existingDiv.remove();
  };

  // ============ 三、时间计算逻辑（支持倍数换算） ============
  function calculateTime(format, startStr, endStr, factorStr) {
    const allDurations = document.getElementsByClassName(CONFIG.CLASSES.DURATION);
    const durations = Array.from(allDurations).filter(el => el.parentElement.className.includes(CONFIG.CLASSES.STATS));

    const s = parseInt(startStr, 10);
    const e = parseInt(endStr, 10);
    const f = parseFloat(factorStr);
    if (isNaN(s) || isNaN(e)) { return updateResult(CONFIG.TEXT.MESSAGES.INVALID_INPUT); }
    if (s < CONFIG.FEATURES.MIN_EPISODE) { return updateResult(CONFIG.TEXT.MESSAGES.MIN_EPISODE); }
    if (e < s) { return updateResult(CONFIG.TEXT.MESSAGES.INVALID_RANGE); }
    if (durations.length === 0) { return updateResult(CONFIG.TEXT.MESSAGES.NO_DURATION); }
    if (e > durations.length) {
      const msg = CONFIG.TEXT.MESSAGES.MAX_EPISODE.replace('{count}', durations.length);
      return updateResult(msg);
    }
    if (isNaN(f) || f <= 0) { alert('倍数需大于0'); return; }

    GM_setValue(STORAGE_KEYS.FACTOR, f); // 记忆倍数

    // 求原总秒数
    let totalSeconds = 0;
    for (let i = s - 1; i < e; i++) {
      const t = durations[i].innerText.trim();
      const parts = t.split(':').map(Number);
      let sec = parts.pop() || 0;
      let min = parts.pop() || 0;
      let hr = parts.pop() || 0;
      totalSeconds += hr * 3600 + min * 60 + sec;
    }

    // 原始时长
    const origin = formatTime(totalSeconds, format);
    // 按倍数折算后的“实际观看时长”
    const adjustedSeconds = totalSeconds / f;
    const adjusted = formatTime(adjustedSeconds, format);

    // 同时显示两行（更直观）
    updateResult(`原总时长：${origin}\n按倍数×${f} 后：${adjusted}`);
  }

  function formatTime(totalSeconds, format) {
    const s = Math.floor(totalSeconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    switch (format) {
      case '时分秒': return `${h}时${m}分${sec}秒`;
      case '仅小时': return `${(s / 3600).toFixed(2)} 小时`;
      case '仅分钟': return `${(s / 60).toFixed(2)} 分钟`;
      case '仅秒':   return `${s} 秒`;
      default:       return `${h}时${m}分${sec}秒`;
    }
  }

  function updateResult(text) {
    const resultDiv = document.getElementById(CONFIG.UI.RESULT_DIV_ID);
    if (!resultDiv) return;
    resultDiv.innerText = text;
    if (resultTimeoutId) clearTimeout(resultTimeoutId);
    resultTimeoutId = setTimeout(() => {
      if (resultDiv) resultDiv.innerText = '';
      resultTimeoutId = null;
    }, CONFIG.FEATURES.RESULT_DISPLAY_TIME);
  }

  // ============ 四、实际视频倍速（保留原功能 + 记忆 + UI + 快捷键） ============
  function setAllVideoPlaybackRate(speed) {
    if (!speed || isNaN(speed) || speed <= 0) return;
    currentSpeed = speed;
    const videos = document.querySelectorAll('video');
    videos.forEach(v => { try { v.playbackRate = speed; } catch (e) {} });
    displaySpeedOnVideo(speed);
    updateSpeedDisplay(speed);
  }

  function displaySpeedOnVideo(speed) {
    const videoElement = document.querySelector('video');
    if (!videoElement) return;
    let existing = videoElement.parentElement.querySelector('.speed-display');
    if (existing) existing.remove();
    const speedDisplay = document.createElement('div');
    speedDisplay.innerText = `倍速：${speed}`;
    speedDisplay.style.position = 'absolute';
    speedDisplay.style.top = '10px';
    speedDisplay.style.left = '10px';
    speedDisplay.style.padding = '5px';
    speedDisplay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    speedDisplay.style.color = '#fff';
    speedDisplay.style.fontSize = '16px';
    speedDisplay.style.fontWeight = 'bold';
    speedDisplay.style.borderRadius = '5px';
    speedDisplay.className = 'speed-display';
    videoElement.parentElement.appendChild(speedDisplay);
    setTimeout(() => { speedDisplay.remove(); }, 3000);
  }

  function updateSpeedDisplay(speed) {
    const label = document.getElementById('current-speed-label');
    if (label) label.innerText = `当前倍速：${speed}x`;
    GM_setValue(STORAGE_KEYS.PLAYBACK, speed);
  }

  // 右侧“倍速”触发器 + 面板
  const SPEED_TRIGGER_ID = 'speed-trigger-container';
  let isSpeedPopupVisible = false;

  function createSpeedTrigger() {
    if (!CONFIG.SPEED_UI.SHOW_SPEED_UI) return;
    const ex = document.getElementById(SPEED_TRIGGER_ID);
    if (ex) ex.remove();

    const body = document.body;
    const trigger = document.createElement('div');
    trigger.id = SPEED_TRIGGER_ID;
    trigger.style.cssText = `
      position: fixed; right: 0; top: 25%; transform: translateY(-50%);
      z-index: 999999; text-align: center; border:1px solid #FF8C00;
      border-radius: 8px; background-color: rgba(255,255,255,${containerOpacity});
      padding: 8px; width: 40px; transition: all .3s ease; cursor: pointer;
    `;
    const icon = document.createElement('div');
    icon.innerText = '倍速';
    icon.style.cssText = `font-size:14px;color:#FF8C00;text-align:center;user-select:none;`;
    trigger.appendChild(icon);

    trigger.addEventListener('click', toggleSpeedPopup);
    trigger.onmouseenter = () => { trigger.style.width = '80px'; };
    trigger.onmouseleave = () => { if (!isSpeedPopupVisible) trigger.style.width = '40px'; };
    body.appendChild(trigger);
  }

  function toggleSpeedPopup() {
    isSpeedPopupVisible = !isSpeedPopupVisible;
    const trig = document.getElementById(SPEED_TRIGGER_ID);
    if (isSpeedPopupVisible) {
      createSpeedUI();
      if (trig) trig.style.width = '80px';
    } else {
      closeSpeedUI();
      if (trig) trig.style.width = '40px';

    }
  }

  function createSpeedUI() {
    if (document.getElementById('speed-ui-container')) return;
    const body = document.body;
    const container = document.createElement('div');
    container.id = 'speed-ui-container';
    container.style.cssText = `
      padding: 10px; background-color: rgba(255,255,255,${containerOpacity});
      position: fixed; right: 80px; top: 25%; width: 220px; max-width: 60%;
      border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      border: 1px solid #FF8C00; z-index: 999999; text-align: center;
      font-size: 14px; color:#444;
    `;
    makeElementDraggable(container, STORAGE_KEYS.SPEED_POS);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = '关闭';
    closeBtn.style.cssText = `
      position:absolute; top:5px; right:5px; border:none; background:#f90;
      color:#fff; padding:2px 6px; cursor:pointer; border-radius:4px;
    `;
    closeBtn.onclick = toggleSpeedPopup;
    container.appendChild(closeBtn);

    const title = document.createElement('h4');
    title.innerText = '视频倍速设置';
    title.style.cssText = 'margin-bottom:8px;color:#FF8C00;font-weight:bold;';
    container.appendChild(title);

    const label = document.createElement('label');
    label.innerText = '请输入倍速：';
    label.style.cssText = 'margin-right:5px;';
    container.appendChild(label);

    const speedInput = document.createElement('input');
    speedInput.type = 'number';
    speedInput.value = currentSpeed;
    speedInput.min = '0.1'; speedInput.step = '0.1';
    speedInput.style.cssText = 'width:70px;text-align:center;border-radius:4px;border:1px solid #ccc;margin-bottom:10px;';
    container.appendChild(speedInput);

    const currentSpeedLabel = document.createElement('div');
    currentSpeedLabel.id = 'current-speed-label';
    currentSpeedLabel.style.cssText = 'margin-top:8px;color:#555;font-size:14px;';
    currentSpeedLabel.innerText = `当前倍速：${currentSpeed}x`;
    container.appendChild(currentSpeedLabel);

    const setBtn = document.createElement('button');
    setBtn.innerText = '应用';
    setBtn.style.cssText = 'margin-left:8px;background:#00A1D6;color:#fff;border:none;padding:4px 8px;cursor:pointer;border-radius:4px;';
    setBtn.onclick = () => {
      const val = parseFloat(speedInput.value) || 1;
      if (val <= 0) { alert('非法倍速值！'); return; }
      setAllVideoPlaybackRate(val);
      GM_setValue(STORAGE_KEYS.PLAYBACK, val);
    };
    container.appendChild(setBtn);

    const tips = document.createElement('div');
    tips.style.cssText = 'margin-top:10px;color:#888;font-size:12px;white-space:pre-line;';
    tips.innerText = '快捷键：\n1-4：设为1x/2x/3x/4x\nC/X：加速/减速0.1\nShift+↑/↓：加速/减速0.1\nShift+0：复位1.0x\nZ：在当前倍速与原始1.0x之间切换';
    container.appendChild(tips);

    body.appendChild(container);
  }

  function closeSpeedUI() {
    const el = document.getElementById('speed-ui-container');
    if (el) el.remove();
  }

  // 键盘快捷键（保持原逻辑）
  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (e.shiftKey && !e.ctrlKey && !e.altKey) {
      if (e.key === 'ArrowUp') {
        currentSpeed = parseFloat((currentSpeed + 0.1).toFixed(2));
        setAllVideoPlaybackRate(currentSpeed);
      } else if (e.key === 'ArrowDown') {
        let ns = parseFloat((currentSpeed - 0.1).toFixed(2));
        if (ns < 0.1) ns = 0.1;
        currentSpeed = ns;
        setAllVideoPlaybackRate(currentSpeed);
      } else if (e.key === '0') {
        currentSpeed = 1.0;
        setAllVideoPlaybackRate(1.0);
      }
    }

      if (e.shiftKey && !e.ctrlKey && !e.altKey && (e.key === 'u' || e.key === 'U')) {//显示关闭UI
          toggleSpeedPopup();
          togglePopup();
    }

    if (e.key >= '1' && e.key <= '4') {
      const map = { '1': 1.0, '2': 2.0, '3': 3.0, '4': 4.0 };
      setAllVideoPlaybackRate(map[e.key]);
    }

    if (e.key === 'c' || e.key === 'C') {
      currentSpeed = parseFloat((currentSpeed + 0.1).toFixed(2));
      setAllVideoPlaybackRate(currentSpeed);
    }
    if (e.key === 'x' || e.key === 'X') {
      currentSpeed = parseFloat((currentSpeed - 0.1).toFixed(2));
      if (currentSpeed < 0.1) currentSpeed = 0.1;
      setAllVideoPlaybackRate(currentSpeed);
    }
    if (e.key === 'z' || e.key === 'Z') {
      if (currentSpeed === 1.0) {
        setAllVideoPlaybackRate(originalSpeed);
      } else {
        originalSpeed = currentSpeed;
        setAllVideoPlaybackRate(1.0);
      }
    }
  });

  // ============ 初始化 ============
  createPopupTrigger();
  createSpeedTrigger();

  // 页面加载时自动应用上次的“实际播放倍速”
  if (currentSpeed && currentSpeed > 0 && currentSpeed !== 1.0) {
    setAllVideoPlaybackRate(currentSpeed);
  }

})();
