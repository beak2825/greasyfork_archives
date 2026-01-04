// ==UserScript==
// @name         iQRPG 刷新自动次数
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  每30分钟自动点击 .action-timer，带可拖动开关和倒计时（小字体+提示文字+位置记忆），防后台休眠
// @match        https://www.iqrpg.com/game.html*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546673/iQRPG%20%E5%88%B7%E6%96%B0%E8%87%AA%E5%8A%A8%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/546673/iQRPG%20%E5%88%B7%E6%96%B0%E8%87%AA%E5%8A%A8%E6%AC%A1%E6%95%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const INTERVAL_MS = 30 * 60 * 1000; // 30分钟
  let enabled = true;                  
  let timer = null;
  let countdownTimer = null;
  let remainingSec = INTERVAL_MS / 1000; 

  const POS_KEY = "iqrpg_auto_clicker_pos"; 

  function simulateClick(el) {
    try {
      const evt = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
      el.dispatchEvent(evt);
    } catch (e) {
      console.error("[iQRPG Auto] simulateClick error:", e);
    }
  }

  function clickActionTimers() {
    if (!enabled) return;
    try {
      const nodes = document.querySelectorAll('.action-timer');
      nodes.forEach((el) => {
        const disabled = el.disabled || el.getAttribute?.('disabled') !== null;
        if (!disabled) simulateClick(el);
      });
    } catch (e) {
      console.error('[iQRPG Auto] Error:', e);
    }
  }

  function resetCountdown(label) {
    remainingSec = INTERVAL_MS / 1000;
    if (countdownTimer) clearInterval(countdownTimer);
    label.innerText = `⏳ ${remainingSec}s`;
    countdownTimer = setInterval(() => {
      if (!enabled) return;
      remainingSec--;
      if (remainingSec < 0) remainingSec = 0;
      label.innerText = `⏳ ${remainingSec}s`;
    }, 1000);
  }

  function startTimer(label) {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      clickActionTimers();
      resetCountdown(label);
    }, INTERVAL_MS);
    resetCountdown(label); 
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = null;
  }

  function createSwitch() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.zIndex = '99999';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.cursor = 'move';
    container.style.userSelect = 'none';
    container.style.padding = '4px 8px';
    container.style.borderRadius = '8px';
    container.style.background = 'rgba(0, 0, 0, 0.6)';
    container.style.color = '#fff';
    container.style.fontSize = '14px';
    container.style.fontWeight = 'normal';
    container.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';

    let savedPos = localStorage.getItem(POS_KEY);
    if (savedPos) {
      try {
        let pos = JSON.parse(savedPos);
        container.style.left = pos.x + 'px';
        container.style.top = pos.y + 'px';
      } catch {}
    } else {
      container.style.top = '20px';
      container.style.left = '20px';
    }

    // 前置文字
    const textLabel = document.createElement('span');
    textLabel.innerText = "刷新自动次数：";
    textLabel.style.marginRight = "6px";

    // Switch 外框（缩小版）
    const switchBox = document.createElement('div');
    switchBox.style.width = '40px';
    switchBox.style.height = '20px';
    switchBox.style.borderRadius = '10px';
    switchBox.style.background = enabled ? '#4caf50' : '#f44336';
    switchBox.style.display = 'flex';
    switchBox.style.alignItems = 'center';
    switchBox.style.padding = '2px';
    switchBox.style.marginRight = '8px';
    switchBox.style.cursor = 'pointer';

    // Switch 滑块
    const knob = document.createElement('div');
    knob.style.width = '16px';
    knob.style.height = '16px';
    knob.style.borderRadius = '50%';
    knob.style.background = '#fff';
    knob.style.transition = 'all 0.2s ease';
    knob.style.transform = enabled ? 'translateX(20px)' : 'translateX(0px)';

    switchBox.appendChild(knob);

    // 倒计时文本
    const label = document.createElement('div');
    label.style.fontSize = "13px";
    label.innerText = `⏳ ${remainingSec}s`;

    container.appendChild(textLabel);
    container.appendChild(switchBox);
    container.appendChild(label);
    document.body.appendChild(container);

    function toggleSwitch() {
      enabled = !enabled;
      if (enabled) {
        switchBox.style.background = '#4caf50';
        knob.style.transform = 'translateX(20px)';
        startTimer(label);
        clickActionTimers();
      } else {
        switchBox.style.background = '#f44336';
        knob.style.transform = 'translateX(0px)';
        stopTimer();
      }
    }

    switchBox.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSwitch();
    });

    let isDragging = false, startX, startY, origX, origY;
    container.addEventListener('mousedown', (e) => {
      if (e.target === switchBox || e.target === knob) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origX = container.offsetLeft;
      origY = container.offsetTop;
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        container.style.left = origX + dx + 'px';
        container.style.top = origY + dy + 'px';
      }
    });
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        localStorage.setItem(POS_KEY, JSON.stringify({
          x: container.offsetLeft,
          y: container.offsetTop
        }));
      }
    });

    startTimer(label);
  }

  function keepAwake() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      oscillator.connect(ctx.destination);
      oscillator.start();
      oscillator.disconnect();
    } catch {}
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      clickActionTimers();
    }
  });

  createSwitch();
  keepAwake();
  clickActionTimers();

})();
