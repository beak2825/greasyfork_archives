// ==UserScript==
// @name         手柄按键动态映射
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  手柄按键与键盘实时绑定，支持导入导出、最小化、可拖动面板、查看网址等功能。
// @author       白陌尘
// @match        *://*.4399.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538853/%E6%89%8B%E6%9F%84%E6%8C%89%E9%94%AE%E5%8A%A8%E6%80%81%E6%98%A0%E5%B0%84.user.js
// @updateURL https://update.greasyfork.org/scripts/538853/%E6%89%8B%E6%9F%84%E6%8C%89%E9%94%AE%E5%8A%A8%E6%80%81%E6%98%A0%E5%B0%84.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let mapping = JSON.parse(localStorage.getItem('gamepadKeyMapping') || '{}');
  let activeKeys = new Set();
  let lastPressedButtons = new Set();
  let waitingForKey = false;
  let currentButtonIndex = null;
  let mappingEnabled = true;

  // 创建面板
  const overlay = document.createElement('div');
  overlay.id = 'gamepad-mapping-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '20px',
    left: '20px',
    width: '360px',
    backgroundColor: 'rgba(0,0,0,0.85)',
    color: 'lime',
    fontFamily: 'monospace',
    fontSize: '13px',
    padding: '0',
    zIndex: '999999',
    border: '1px solid lime',
    borderRadius: '6px',
    userSelect: 'none'
  });

  overlay.innerHTML = `
<div id="overlay-header" style="cursor:move; display:flex; justify-content:space-between; align-items:center; background:#111; padding:4px;">
  <div style="font-weight:bold;">🎮 映射工具</div>
  <div>
    <button id="minimizeBtn" style="padding:2px 6px;">⛶</button>
    <button id="exitBtn" style="padding:2px 6px;">❌</button>
  </div>
</div>
<div id="overlay-body" style="padding:8px;">
  <div id="status">点击“增加映射”后再按手柄按钮开始绑定</div>
  <div>🌐 当前网址：<code>${location.href}</code></div>
  <div style="margin:6px 0;">
    <button id="toggleMappingBtn">🟢 映射开启</button>
    <button id="showBindingsBtn">🔧 设置映射</button>
  </div>
  <div id="mappingPanel" style="display:none; background:#000; border:1px solid #0f0; padding:6px; max-height:200px; overflow:auto;">
    <div id="bindingsList">当前绑定:</div>
    <div style="margin-top:6px;">
      <button id="addMappingBtn">➕ 增加映射</button>
      <button id="clearMappingsBtn">🧹 清除</button>
      <button id="importBtn">📥 导入</button>
      <button id="exportBtn">📤 导出</button>
    </div>
  </div>
</div>
`;

  document.body.appendChild(overlay);

  // 拖动功能
  (function makeDraggable(el) {
    const header = el.querySelector('#overlay-header');
    let isDragging = false, offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
    });
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        el.style.left = (e.clientX - offsetX) + 'px';
        el.style.top = (e.clientY - offsetY) + 'px';
      }
    });
  })(overlay);

  const status = overlay.querySelector('#status');
  const minimizeBtn = overlay.querySelector('#minimizeBtn');
  const exitBtn = overlay.querySelector('#exitBtn');
  const mappingPanel = overlay.querySelector('#mappingPanel');
  const toggleMappingBtn = overlay.querySelector('#toggleMappingBtn');
  const showBindingsBtn = overlay.querySelector('#showBindingsBtn');
  const bindingsList = overlay.querySelector('#bindingsList');
  const addMappingBtn = overlay.querySelector('#addMappingBtn');
  const clearMappingsBtn = overlay.querySelector('#clearMappingsBtn');
  const importBtn = overlay.querySelector('#importBtn');
  const exportBtn = overlay.querySelector('#exportBtn');

  function updateBindingsView() {
    bindingsList.innerHTML = '<strong>当前绑定:</strong><br>';
    if (Object.keys(mapping).length === 0) {
      bindingsList.innerHTML += '（无绑定）';
    } else {
      for (const [btn, key] of Object.entries(mapping)) {
        bindingsList.innerHTML += `🎮 按钮 ${btn} → 键 "${key}"<br>`;
      }
    }
  }

  function simulateKeyEvent(key, type) {
    const event = new KeyboardEvent(type, {
      key: key,
      code: key.toUpperCase(),
      keyCode: key.toUpperCase().charCodeAt(0),
      which: key.toUpperCase().charCodeAt(0),
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  function startWaitingForKey() {
    waitingForKey = true;
    currentButtonIndex = null;
    status.textContent = '请按下手柄按钮以开始绑定...';
  }

  function pollGamepad() {
    const gps = navigator.getGamepads();

    if (waitingForKey && currentButtonIndex === null) {
      for (const gp of gps) {
        if (!gp) continue;
        for (let i = 0; i < gp.buttons.length; i++) {
          if (gp.buttons[i].pressed && !lastPressedButtons.has(i)) {
            currentButtonIndex = i;
            status.textContent = `检测到按钮 ${i}，请按键盘键绑定`;
            return requestAnimationFrame(pollGamepad);
          }
        }
      }
    }

    if (mappingEnabled && !waitingForKey) {
      for (const gp of gps) {
        if (!gp) continue;
        gp.buttons.forEach((btn, index) => {
          const mappedKey = mapping[index];
          if (mappedKey) {
            if (btn.pressed && !activeKeys.has(mappedKey)) {
              simulateKeyEvent(mappedKey, 'keydown');
              activeKeys.add(mappedKey);
            } else if (!btn.pressed && activeKeys.has(mappedKey)) {
              simulateKeyEvent(mappedKey, 'keyup');
              activeKeys.delete(mappedKey);
            }
          }
        });
      }
    }

    lastPressedButtons.clear();
    for (const gp of gps) {
      if (!gp) continue;
      for (let i = 0; i < gp.buttons.length; i++) {
        if (gp.buttons[i].pressed) {
          lastPressedButtons.add(i);
        }
      }
    }

    requestAnimationFrame(pollGamepad);
  }

  window.addEventListener('keydown', handleKey, true);
  function handleKey(e) {
    if (waitingForKey && currentButtonIndex !== null) {
      const key = e.key.toLowerCase();
      if (/^[a-z0-9]$/.test(key)) {
        mapping[currentButtonIndex] = key;
        localStorage.setItem('gamepadKeyMapping', JSON.stringify(mapping));
        status.textContent = `绑定成功：按钮 ${currentButtonIndex} → "${key}"`;
        updateBindingsView();
      } else {
        status.textContent = `❌ 无效的按键 "${key}"，请重试`;
      }
      waitingForKey = false;
      currentButtonIndex = null;
      e.preventDefault();
    }
  }

  minimizeBtn.onclick = () => {
    const body = overlay.querySelector('#overlay-body');
    const isVisible = body.style.display !== 'none';
    body.style.display = isVisible ? 'none' : 'block';
    minimizeBtn.textContent = isVisible ? '🗖' : '⛶';
  };

  exitBtn.onclick = () => {
    if (confirm('确定要关闭并退出映射工具？')) {
      cancelAnimationFrame(pollGamepad);
      window.removeEventListener('keydown', handleKey, true);
      overlay.remove();
    }
  };

  toggleMappingBtn.onclick = () => {
    mappingEnabled = !mappingEnabled;
    toggleMappingBtn.textContent = mappingEnabled ? '🟢 映射开启' : '🔴 映射关闭';
  };

  showBindingsBtn.onclick = () => {
    mappingPanel.style.display = mappingPanel.style.display === 'none' ? 'block' : 'none';
  };

  addMappingBtn.onclick = () => {
    startWaitingForKey();
  };

  clearMappingsBtn.onclick = () => {
    if (confirm('确认清除所有绑定？')) {
      mapping = {};
      localStorage.removeItem('gamepadKeyMapping');
      updateBindingsView();
      status.textContent = '所有绑定已清除';
    }
  };

  importBtn.onclick = () => {
    const json = prompt('请粘贴导入的配置（JSON）');
    try {
      const obj = JSON.parse(json);
      if (typeof obj === 'object') {
        mapping = obj;
        localStorage.setItem('gamepadKeyMapping', JSON.stringify(mapping));
        updateBindingsView();
        alert('导入成功！');
      }
    } catch {
      alert('导入失败，请确认格式正确');
    }
  };

  exportBtn.onclick = () => {
    const json = JSON.stringify(mapping, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      alert('配置已复制到剪贴板');
    });
  };

  updateBindingsView();
  pollGamepad();
})();
