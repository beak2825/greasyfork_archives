// ==UserScript==
// @name         Milkyway Idle 食物消耗计算器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  左上角小黑白按钮，字体统一放大，界面优化
// @author       noonsleepbox
// @match        https://milkywayidle.com/*
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543196/Milkyway%20Idle%20%E9%A3%9F%E7%89%A9%E6%B6%88%E8%80%97%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543196/Milkyway%20Idle%20%E9%A3%9F%E7%89%A9%E6%B6%88%E8%80%97%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    #floatingButton {
      position: fixed;
      top: 20px;
      left: 20px;
      background: white;
      color: black;
      font-size: 36px;
      font-weight: bold;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      text-align: center;
      line-height: 60px;
      cursor: move;
      z-index: 10000;
      user-select: none;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      border: 2px solid black;
    }

    #calcPanel {
      display: none;
      position: fixed;
      top: 100px;
      left: 20px;
      width: 800px;
      padding: 25px;
      background: #f9f9f9;
      border: 2px solid #bbb;
      border-radius: 14px;
      z-index: 10000;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      font-size: 28px;
    }

    #calcPanel h3 {
      margin-top: 0;
      font-size: 28px;
      color: #2c3e50;
    }

    #calcPanel textarea {
      width: 100%;
      height: 200px;
      font-size: 28px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      resize: none;
    }

    #calcPanel table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 28px;
    }

    #calcPanel th, #calcPanel td {
      border: 1px solid #aaa;
      padding: 10px;
      text-align: center;
    }

    #calcPanel input[type="number"] {
      width: 150px;
      font-size: 28px;
      margin-left: 10px;
    }

    #calcPanel button {
      font-size: 28px;
      padding: 8px 16px;
      margin-left: 10px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('div');
  button.id = 'floatingButton';
  button.innerText = '+';

  const panel = document.createElement('div');
  panel.id = 'calcPanel';
  panel.innerHTML = `
    <h3>食物消耗量计算器</h3>
    <textarea id="inputText" placeholder="格式：食物\\n数值\\n..."></textarea><br><br>
    天数: <input type="number" id="days" value="1" min="1">
    <button id="confirmBtn">确认</button>
    <div id="output" style="margin-top: 20px;"></div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(panel);

  // 拖动按钮逻辑
  let offsetX, offsetY, isDragging = false;
  button.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - button.getBoundingClientRect().left;
    offsetY = e.clientY - button.getBoundingClientRect().top;
  });
  document.addEventListener('mouseup', function() { isDragging = false; });
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
      const maxX = window.innerWidth - button.offsetWidth;
      const maxY = window.innerHeight - button.offsetHeight;
      x = Math.min(Math.max(0, x), maxX);
      y = Math.min(Math.max(0, y), maxY);
      button.style.left = x + 'px';
      button.style.top = y + 'px';
    }
  });

  // 拖动 panel（点击空白处）
  panel.addEventListener('mousedown', function(e) {
    if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
      e.preventDefault();
    }
  });
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
      const maxX = window.innerWidth - panel.offsetWidth;
      const maxY = window.innerHeight - panel.offsetHeight;
      panel.style.left = Math.min(Math.max(0, x), maxX) + 'px';
      panel.style.top = Math.min(Math.max(0, y), maxY) + 'px';
    }
  });
  document.addEventListener('mouseup', function() { isDragging = false; });

  // 显示/隐藏面板
  let panelVisible = false;
  button.addEventListener('click', () => {
    panelVisible = !panelVisible;
    panel.style.display = panelVisible ? 'block' : 'none';
  });

  // 计算逻辑
  document.addEventListener('click', (e) => {
    if (e.target.id === 'confirmBtn') {
      const input = document.getElementById('inputText').value.trim();
      const days = parseInt(document.getElementById('days').value);
      const lines = input.split('\n').map(l => l.trim()).filter(l => l !== '');
      const result = [];

      for (let i = 0; i < lines.length - 1; i += 2) {
        const name = lines[i];
        const value = parseFloat(lines[i + 1]);
        if (!isNaN(value)) {
          const daily = value * 24;
          const total = daily * days;
          result.push({ name, value, daily, total });
        }
      }

      let html = `<table>
        <tr><th>食物</th><th>每小时</th><th>每天</th><th>${days}天</th></tr>`;
      for (const item of result) {
        html += `<tr>
          <td>${item.name}</td>
          <td>${item.value}</td>
          <td>${item.daily}</td>
          <td>${item.total}</td>
        </tr>`;
      }
      html += `</table>`;

      document.getElementById('output').innerHTML = html;
    }
  });

  // 粘贴自动填充
  window.addEventListener('paste', (event) => {
    const text = event.clipboardData.getData('text');
    if (panelVisible && text.includes('\n')) {
      document.getElementById('inputText').value = text;
    }
  });

})();
