// ==UserScript==
// @name         DOM + FPS Indicator (Draggable + Minimize)
// @namespace    https://github.com/aket0r/
// @version      2.1b
// @description  DOM/FPS индикатор: перетаскивание, двойной клик — компактный кружок, позиция и состояние сохраняются; спарклайн ms/кадр (опц.)
// @author       aket0r
// @match        http://*/*
// @match        https://*/*
// @exclude      https://chat.openai.com/*
// @exclude      https://chatgpt.com/*
// @grant        none
// @license      MIT
// @icon         https://raw.githubusercontent.com/aket0r/dom-indicator-loading/main/DOM-indicator-loading.png
// @downloadURL https://update.greasyfork.org/scripts/541958/DOM%20%2B%20FPS%20Indicator%20%28Draggable%20%2B%20Minimize%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541958/DOM%20%2B%20FPS%20Indicator%20%28Draggable%20%2B%20Minimize%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ===== Настройки =====
  const DOM_THRESHOLDS = { warn: 15000, danger: 30000 };
  const DOM_UPDATE_EVERY_MS = 1000;

  const FPS_ENABLED = true;
  const FPS_WINDOW = 60;
  const FPS_UI_UPDATE_MS = 1000;

  const SPARKLINE_ENABLED = true;
  const SPARK = {
    length: 120,
    width: 140,
    height: 28,
    padX: 4,
    padY: 3,
    clampMs: { min: 8, max: 100 }
  };

  const LS_KEY = 'dom_fps_indicator_state_v12'; // позиция/минимизация

  // ===== Ранний выход для iframes =====
  if (window.top !== window.self) return;

  // ===== Состояние UI (позиция/минимизация) =====
  const state = loadState() || { x: null, y: null, minimized: false };

  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  }
  function loadState() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; }
  }

  // ===== FPS-модуль =====
  const FPSMeter = (() => {
    let rafId = null;
    let last = 0;
    let samples = [];
    let lastUiUpdate = 0;
    const msBuf = [];

    function loop(ts) {
      if (!last) last = ts;
      const delta = ts - last;
      last = ts;

      if (delta > 0 && delta < 250) {
        const fps = 1000 / delta;
        samples.push(fps);
        if (samples.length > FPS_WINDOW) samples.shift();

        if (SPARKLINE_ENABLED) {
          msBuf.push(delta);
          if (msBuf.length > SPARK.length) msBuf.shift();
        }
      }

      if (FPS_ENABLED && ts - lastUiUpdate >= FPS_UI_UPDATE_MS) {
        lastUiUpdate = ts;
        updateFPSLine(getStats(), msBuf);
        if (SPARKLINE_ENABLED) drawSparkline(msBuf);
      }

      rafId = requestAnimationFrame(loop);
    }

    function getStats() {
      if (samples.length === 0) return { avg: 0, min: 0, max: 0 };
      let sum = 0, min = Infinity, max = -Infinity;
      for (const v of samples) { sum += v; if (v < min) min = v; if (v > max) max = v; }
      return { avg: sum / samples.length, min, max };
    }

    function start() {
      if (rafId != null || !FPS_ENABLED) return;
      samples = [];
      last = 0;
      lastUiUpdate = 0;
      rafId = requestAnimationFrame(loop);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') last = performance.now();
    });

    return { start };
  })();

  // ===== UI бейдж (перетаскиваемый + компактный режим) =====
  function initBadge() {
    console.log(`%c[${new Date().toLocaleString()}] DOM + FPS indicator loaded.`, 'color: lime;');

    let badge = document.getElementById('dom-indicator');
    if (badge) return;

    // Контейнер
    badge = document.createElement('div');
    badge.id = 'dom-indicator';
    badge.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 80px;
      background: #222;
      color: #0f0;
      font-family: monospace;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 13px;
      z-index: 2147483647;
      box-shadow: 0 0 4px rgba(0,0,0,0.4);
      user-select: none;
      pointer-events: auto;  /* ВАЖНО: кликабельно */
      line-height: 1.25;
      white-space: nowrap;
      cursor: grab;          /* перетаскивание */
    `;

    // Внутреннее содержимое
    const domLine = document.createElement('div');
    domLine.id = 'dom-line';
    domLine.textContent = 'DOM nodes: loading...';

    const fpsLine = document.createElement('div');
    fpsLine.id = 'fps-line';
    if (FPS_ENABLED) fpsLine.textContent = 'FPS: --.- (ms: --.-)';

    const spark = document.createElement('canvas');
    spark.id = 'fps-spark';
    spark.width = SPARK.width;
    spark.height = SPARK.height;
    spark.style.cssText = 'display:block;margin-top:4px;opacity:.9;';

    badge.appendChild(domLine);
    if (FPS_ENABLED) badge.appendChild(fpsLine);
    if (SPARKLINE_ENABLED) badge.appendChild(spark);
    document.body.prepend(badge);

    // Применить сохранённую позицию/режим
    if (state.x !== null && state.y !== null) {
      applyPosition(badge, state.x, state.y);
    } else {
      // дефолтная позиция — правый-низ (уже задана через bottom/right)
      clampToViewport(badge);
    }
    if (state.minimized) {
      setMinimized(badge, true);
    }

    // Обработчики перетаскивания
    makeDraggable(badge);

    // Двойной клик — переключить режим (полный/компакт)
    badge.addEventListener('dblclick', () => {
      setMinimized(badge, !state.minimized);
      saveState();
    });

    // Запуск DOM-счётчика
    setInterval(updateDOMLine, DOM_UPDATE_EVERY_MS);

    // На ресайз — не уезжаем за экран
    window.addEventListener('resize', () => clampToViewport(badge));
  }

  function setMinimized(badge, minimized) {
    state.minimized = minimized;

    const domLine = badge.querySelector('#dom-line');
    const fpsLine = badge.querySelector('#fps-line');
    const spark = badge.querySelector('#fps-spark');

    if (minimized) {
      // Компактный кружок — только число DOM
      badge.style.width = '42px';
      badge.style.height = '42px';
      badge.style.borderRadius = '999px';
      badge.style.padding = '0';
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.style.cursor = 'grab';

      // Покажем только число (без «DOM nodes: »)
      const count = document.querySelectorAll('*').length;
      domLine.textContent = `${count}`;
      domLine.style.display = 'block';
      domLine.style.fontWeight = '700';
      domLine.style.fontSize = '14px';

      if (fpsLine) fpsLine.style.display = 'none';
      if (spark) spark.style.display = 'none';
    } else {
      // Полный режим
      badge.style.width = '';
      badge.style.height = '';
      badge.style.borderRadius = '8px';
      badge.style.padding = '6px 10px';
      badge.style.display = 'block';
      badge.style.cursor = 'grab';

      // Вернём текстовую метку
      const count = document.querySelectorAll('*').length;
      domLine.textContent = `DOM nodes: ${count}`;
      domLine.style.fontWeight = '';
      domLine.style.fontSize = '';

      if (fpsLine) fpsLine.style.display = '';
      if (spark && SPARKLINE_ENABLED) spark.style.display = 'block';
    }
  }

  function updateDOMLine() {
    const badge = document.getElementById('dom-indicator');
    const domLine = document.getElementById('dom-line');
    if (!badge || !domLine) return;

    const count = document.querySelectorAll('*').length;
    if (state.minimized) {
      domLine.textContent = `${count}`;
    } else {
      domLine.textContent = `DOM nodes: ${count}`;
    }

    if (count > DOM_THRESHOLDS.danger) {
      badge.style.color = '#f55';
      badge.style.background = '#300';
    } else if (count > DOM_THRESHOLDS.warn) {
      badge.style.color = '#ff0';
      badge.style.background = '#442';
    } else {
      badge.style.color = '#0f0';
      badge.style.background = '#222';
    }
  }

  function updateFPSLine(stats, msBuf) {
    if (!FPS_ENABLED) return;
    const el = document.getElementById('fps-line');
    const badge = document.getElementById('dom-indicator');
    if (!el || !badge) return;

    const avg = stats.avg || 0;
    const ms = avg > 0 ? (1000 / avg) : 0;
    if (!state.minimized) {
      el.textContent = `FPS: ${avg.toFixed(1)} (ms: ${ms.toFixed(1)})`;
    }

    // Лёгкая подсветка по усреднённому ms, если фон дефолтный
    const bg = badge.style.background;
    const looksDefault = !bg || bg === '#222' || bg === 'rgb(34, 34, 34)';
    if (looksDefault) {
      if (ms <= 18) {
        badge.style.background = '#1f2a1f';
        badge.style.color = '#aef1ae';
      } else if (ms <= 25) {
        badge.style.background = '#2a281f';
        badge.style.color = '#ffe9a6';
      } else {
        badge.style.background = '#2a1f1f';
        badge.style.color = '#ffb3b3';
      }
    }
  }

  // ===== Спарклайн =====
  function drawSparkline(msBuf) {
    if (!SPARKLINE_ENABLED || state.minimized) return;
    const canvas = document.getElementById('fps-spark');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    ctx.imageSmoothingEnabled = false;

    const W = canvas.width, H = canvas.height;
    const px = SPARK.padX, py = SPARK.padY;
    const plotW = W - px * 2, plotH = H - py * 2;

    ctx.clearRect(0, 0, W, H);
    if (!msBuf || msBuf.length < 2) return;

    let min = Math.min(...msBuf);
    let max = Math.max(...msBuf);
    min = Math.max(min, SPARK.clampMs.min);
    max = Math.min(Math.max(max, min + 1), SPARK.clampMs.max);

    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ffffff';
    const ms60 = 1000 / 60, ms30 = 1000 / 30;
    const y60 = py + (plotH * (max - ms60) / (max - min));
    const y30 = py + (plotH * (max - ms30) / (max - min));
    ctx.fillRect(px, Math.max(py, Math.min(H - py - 1, y60)), plotW, 1);
    ctx.fillRect(px, Math.max(py, Math.min(H - py - 1, y30)), plotW, 1);
    ctx.globalAlpha = 1;

    const lastMs = msBuf[msBuf.length - 1];
    const stroke = lastMs <= 18 ? '#aef1ae' : lastMs <= 25 ? '#ffe9a6' : '#ffb3b3';

    ctx.lineWidth = 1;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    for (let i = 0; i < msBuf.length; i++) {
      const ms = Math.min(Math.max(msBuf[i], min), max);
      const x = px + (i / (SPARK.length - 1)) * plotW;
      const y = py + (plotH * (max - ms) / (max - min));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    const grad = ctx.createLinearGradient(0, py, 0, H - py);
    grad.addColorStop(0, 'rgba(255,255,255,0.18)');
    grad.addColorStop(1, 'rgba(255,255,255,0.02)');
    ctx.fillStyle = grad;
    ctx.lineTo(px + plotW, H - py);
    ctx.lineTo(px, H - py);
    ctx.closePath();
    ctx.fill();
  }

  // ===== Перетаскивание =====
  function makeDraggable(el) {
    let dragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    // Если позиция сохранена — используем left/top, а не bottom/right
    if (state.x !== null && state.y !== null) {
      el.style.left = `${state.x}px`;
      el.style.top = `${state.y}px`;
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    }

    const onDown = (clientX, clientY) => {
      dragging = true;
      el.style.cursor = 'grabbing';

      const rect = el.getBoundingClientRect();
      startX = clientX;
      startY = clientY;
      startLeft = rect.left + window.scrollX;
      startTop = rect.top + window.scrollY;

      // Переключаемся на абсолютные координаты
      el.style.left = `${startLeft}px`;
      el.style.top = `${startTop}px`;
      el.style.right = 'auto';
      el.style.bottom = 'auto';

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    };

    const onMouseDown = (e) => {
      // ЛКМ
      if (e.button !== 0) return;
      onDown(e.clientX, e.clientY);
      e.preventDefault();
    };

    const onTouchStart = (e) => {
      const t = e.touches[0];
      if (!t) return;
      onDown(t.clientX, t.clientY);
    };

    const onMove = (clientX, clientY) => {
      if (!dragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;

      const newLeft = startLeft + dx;
      const newTop = startTop + dy;

      applyPosition(el, newLeft, newTop);
    };

    const onMouseMove = (e) => {
      onMove(e.clientX, e.clientY);
      e.preventDefault();
    };

    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (!t) return;
      onMove(t.clientX, t.clientY);
      e.preventDefault();
    };

    const finishDrag = () => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = 'grab';
      clampToViewport(el);
      saveState();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    const onMouseUp = () => finishDrag();
    const onTouchEnd = () => finishDrag();

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
  }

  function applyPosition(el, x, y) {
    // Безопасные границы (с учётом размеров элемента)
    const rect = el.getBoundingClientRect();
    const minLeft = 0;
    const minTop = 0;
    const maxLeft = window.innerWidth - rect.width;
    const maxTop = window.innerHeight - rect.height;

    const clampedX = Math.max(minLeft, Math.min(x, maxLeft)) | 0;
    const clampedY = Math.max(minTop, Math.min(y, maxTop)) | 0;

    el.style.left = `${clampedX}px`;
    el.style.top = `${clampedY}px`;
    el.style.right = 'auto';
    el.style.bottom = 'auto';

    state.x = clampedX;
    state.y = clampedY;
  }

  function clampToViewport(el) {
    if (state.x === null || state.y === null) return;
    applyPosition(el, state.x, state.y);
    saveState();
  }

  // ===== Старт =====
  window.addEventListener('load', () => {
    setTimeout(() => {
      initBadge();
      if (FPS_ENABLED) FPSMeter.start();
    }, 200);
  });
})();
