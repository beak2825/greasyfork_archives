// ==UserScript==
// @name         Drawaria menu by 𝘣𝘢𝘳𝘴𝘪𝘬 𝘴𝘯𝘰𝘴𝘦𝘳
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  я ваще хз честно
// @author       𝘣𝘢𝘳𝘴𝘪𝘬 𝘴𝘯𝘰𝘴𝘦𝘳
// @match        https://drawaria.online/*
// @grant        none
// @license      𝘣𝘢𝘳𝘴𝘪𝘬
// @downloadURL https://update.greasyfork.org/scripts/539787/Drawaria%20menu%20by%20%F0%9D%98%A3%F0%9D%98%A2%F0%9D%98%B3%F0%9D%98%B4%F0%9D%98%AA%F0%9D%98%AC%20%F0%9D%98%B4%F0%9D%98%AF%F0%9D%98%B0%F0%9D%98%B4%F0%9D%98%A6%F0%9D%98%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/539787/Drawaria%20menu%20by%20%F0%9D%98%A3%F0%9D%98%A2%F0%9D%98%B3%F0%9D%98%B4%F0%9D%98%AA%F0%9D%98%AC%20%F0%9D%98%B4%F0%9D%98%AF%F0%9D%98%B0%F0%9D%98%B4%F0%9D%98%A6%F0%9D%98%B3.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Ждём полной загрузки DOM
  window.addEventListener('load', () => {
    // CSS для загрузчика
    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
      #customLoader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
      }
      #customLoader.hide {
        opacity: 0;
        pointer-events: none;
      }
      .spinner {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #00ffff;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(loaderStyle);

    // HTML загрузчика
    const loader = document.createElement('div');
    loader.id = 'customLoader';
    loader.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loader);

    // Ждём canvas, потом 5 сек, потом показываем панель
    const waitForCanvas = setInterval(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas || !canvas.getContext) return;
      clearInterval(waitForCanvas);

      setTimeout(() => {
        loader.classList.add('hide');
        setTimeout(() => {
          loader.remove();
          initPanel(canvas);
        }, 500); // после fade out
      }, 5000); // 5 сек загрузки
    }, 500);
  });

  function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  }

  function initPanel(canvas) {
    const ctx = canvas.getContext('2d');
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes buttonPress {
        0% { transform: scale(1); }
        50% { transform: scale(0.9); }
        100% { transform: scale(1); }
      }
      @keyframes fadeIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      :root {
        --panel-bg: linear-gradient(270deg, #ff0000, #ffa500, #ffff00, #00ff00, #00ffff, #0000ff, #8a2be2, #ff0000);
        --panel-color: #fff;
        --panel-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
        --button-bg: rgba(255, 255, 255, 0.8);
        --button-text: #000;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --panel-bg: #333;
          --panel-color: #eee;
          --button-bg: #444;
          --button-text: #fff;
        }
      }
      #customGui {
        position: fixed;
        top: 100px;
        left: 100px;
        background: var(--panel-bg);
        background-size: 2000% 2000%;
        animation: rainbow 20s linear infinite;
        color: var(--panel-color);
        padding: 10px;
        border-radius: 10px;
        font-family: 'Segoe UI', sans-serif;
        z-index: 9999;
        width: 340px;
        box-shadow: var(--panel-shadow);
        user-select: none;
        transition: box-shadow 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeIn 1s ease forwards;
      }
      #customGui.collapsed #guiContent {
        max-height: 0;
        opacity: 0;
      }
      #guiContent {
        transition: all 0.4s ease;
        max-height: 2000px;
        opacity: 1;
        overflow: hidden;
      }
      #customGui button {
        width: 100%;
        margin: 5px 0;
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        background-color: var(--button-bg);
        color: var(--button-text);
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      #customGui button:active {
        animation: buttonPress 0.2s ease;
      }
      #customGui input[type="text"], #customGui input[type="number"] {
        width: 100%;
        padding: 6px;
        margin: 4px 0;
        border: none;
        border-radius: 5px;
      }
      #mousePos, #usageTimer, #signature {
        font-size: 11px;
        margin-top: 6px;
        color: #ccc;
        text-align: center;
      }
      #iframeContainer {
        margin-top: 8px;
        display: none;
      }
      #iframeContainer iframe {
        width: 100%;
        height: 260px;
        border: 1px solid #666;
        border-radius: 5px;
      }
    `;
    document.head.appendChild(style);

    const gui = document.createElement('div');
    gui.id = 'customGui';
    gui.innerHTML = `
      <div><strong class="label" data-en="Drawaria Tool Panel" data-ru="Панель Drawaria">Drawaria Tool Panel</strong></div>
      <button id="collapseBtn" class="label" data-en="Collapse" data-ru="Свернуть">Collapse</button>
      <div id="guiContent">
        <input id="customTextInput" type="text" placeholder="Text to draw" value="Hello">
        <button id="clearCanvasBtn" class="label" data-en="Clear Canvas" data-ru="Очистить холст">Clear Canvas</button>
        <button id="randomColorBtn" class="label" data-en="Random Color" data-ru="Случайный цвет">Random Color</button>
        <button id="autoDrawBtn" class="label" data-en="Auto Draw Text" data-ru="Авто-рисование">Auto Draw Text</button>
        <button id="toggleCanvasBtn" class="label" data-en="Toggle Canvas" data-ru="Скрыть холст">Toggle Canvas</button>
        <button id="mouseCoordsBtn" class="label" data-en="Toggle Mouse Coordinates" data-ru="Координаты мыши">Toggle Mouse Coordinates</button>
        <input id="timerInput" type="number" placeholder="Timer (sec)">
        <button id="startTimerBtn" class="label" data-en="Start Timer" data-ru="Старт таймера">Start Timer</button>
        <input id="urlInput" type="text" placeholder="https://example.com">
        <button id="openUrlBtn" class="label" data-en="Open Site" data-ru="Открыть сайт">Open Site</button>
        <div id="siteStatus"></div>
        <div id="iframeContainer"><iframe id="siteFrame" sandbox="allow-scripts allow-same-origin allow-forms"></iframe></div>
        <div id="mousePos">x: 0, y: 0</div>
        <div id="usageTimer">Session time: 00:00:00</div>
        <button id="langToggleBtn">🌐 Переключить язык</button>
        <div id="signature">Made by <i>𝘣𝘢𝘳𝘴𝘪𝘬</i></div>
      </div>
    `;
    document.body.appendChild(gui);

    // Функциональность кнопок
    document.getElementById('clearCanvasBtn').onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

    document.getElementById('randomColorBtn').onclick = () => {
      const color = `hsl(${Math.floor(Math.random() * 360)},100%,50%)`;
      const colorInput = document.querySelector('input[type=color]');
      if (colorInput) {
        colorInput.value = color;
        colorInput.dispatchEvent(new Event('input'));
      }
    };

    document.getElementById('autoDrawBtn').onclick = () => {
      const text = document.getElementById('customTextInput').value || 'Hello';
      ctx.font = '48px sans-serif';
      const colorInput = document.querySelector('input[type=color]');
      ctx.fillStyle = colorInput ? colorInput.value : '#000';
      ctx.fillText(text, 100, 100);
    };

    let canvasVisible = true;
    document.getElementById('toggleCanvasBtn').onclick = () => {
      canvasVisible = !canvasVisible;
      canvas.style.display = canvasVisible ? 'block' : 'none';
    };

    let mouseTracking = false;
    document.getElementById('mouseCoordsBtn').onclick = () => {
      mouseTracking = !mouseTracking;
      if (!mouseTracking) document.getElementById('mousePos').textContent = '';
    };

    canvas.addEventListener('mousemove', (e) => {
      if (mouseTracking) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        document.getElementById('mousePos').textContent = `x: ${x}, y: ${y}`;
      }
    });

    document.getElementById('startTimerBtn').onclick = () => {
      const seconds = parseInt(document.getElementById('timerInput').value);
      if (isNaN(seconds) || seconds <= 0) {
        alert(currentLang === 'ru' ? 'Введите число больше 0' : 'Enter number > 0');
        return;
      }
      let remaining = seconds;
      const btn = document.getElementById('startTimerBtn');
      btn.disabled = true;
      const interval = setInterval(() => {
        btn.textContent = `Time left: ${remaining--}s`;
        if (remaining < 0) {
          clearInterval(interval);
          btn.disabled = false;
          btn.textContent = currentLang === 'ru' ? 'Старт таймера' : 'Start Timer';
          alert(currentLang === 'ru' ? 'Время вышло!' : 'Time is up!');
        }
      }, 1000);
    };

    const iframe = document.getElementById('siteFrame');
    const iframeContainer = document.getElementById('iframeContainer');
    const siteStatus = document.getElementById('siteStatus');

    document.getElementById('openUrlBtn').onclick = () => {
      const url = document.getElementById('urlInput').value.trim();
      if (!/^https?:\/\//.test(url)) {
        alert(currentLang === 'ru' ? 'Введите корректный URL!' : 'Invalid URL!');
        return;
      }

      siteStatus.textContent = currentLang === 'ru' ? 'Загрузка...' : 'Loading...';
      iframe.src = '';
      iframeContainer.style.display = 'none';

      const timeout = setTimeout(() => {
        siteStatus.textContent = currentLang === 'ru' ? 'Ошибка. Открываю в новой вкладке' : 'Error. Opening in new tab';
        window.open(url, '_blank');
      }, 8000);

      iframe.onload = () => {
        clearTimeout(timeout);
        iframeContainer.style.display = 'block';
        siteStatus.textContent = currentLang === 'ru' ? 'Успешно загружено' : 'Loaded';
      };

      iframe.onerror = () => {
        clearTimeout(timeout);
        siteStatus.textContent = currentLang === 'ru' ? 'Ошибка загрузки' : 'Load error';
        window.open(url, '_blank');
      };

      iframe.src = url;
    };

    document.getElementById('collapseBtn').onclick = () => {
      gui.classList.toggle('collapsed');
      updateLanguage();
    };

    let drag = false, offsetX = 0, offsetY = 0;
    gui.addEventListener('mousedown', e => {
      drag = true;
      offsetX = e.clientX - gui.offsetLeft;
      offsetY = e.clientY - gui.offsetTop;
    });
    window.addEventListener('mouseup', () => drag = false);
    window.addEventListener('mousemove', e => {
      if (drag) {
        gui.style.left = `${e.clientX - offsetX}px`;
        gui.style.top = `${e.clientY - offsetY}px`;
      }
    });

    let currentLang = 'ru';
    const labels = gui.querySelectorAll('.label');
    function updateLanguage() {
      labels.forEach(el => {
        el.textContent = el.dataset[currentLang];
      });
      const collapsed = gui.classList.contains('collapsed');
      document.getElementById('collapseBtn').textContent = collapsed
        ? (currentLang === 'ru' ? 'Развернуть' : 'Expand')
        : (currentLang === 'ru' ? 'Свернуть' : 'Collapse');
    }
    document.getElementById('langToggleBtn').onclick = () => {
      currentLang = currentLang === 'ru' ? 'en' : 'ru';
      updateLanguage();
    };
    updateLanguage();

    let sessionSec = 0;
    setInterval(() => {
      sessionSec++;
      document.getElementById('usageTimer').textContent = `Session time: ${formatTime(sessionSec)}`;
    }, 1000);
  }
})();
