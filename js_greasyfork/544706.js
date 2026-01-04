// ==UserScript==
// @name         Discord Token Login UI (iOS Safe)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Token login UI for Discord, iOS-safe (educational use only)
// @author       チャト
// @match        https://discord.com/login
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544706/Discord%20Token%20Login%20UI%20%28iOS%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544706/Discord%20Token%20Login%20UI%20%28iOS%20Safe%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // トグルボタン
  const toggleBtn = document.createElement('div');
  toggleBtn.innerText = '🔓 Token Login';
  Object.assign(toggleBtn.style, {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: '9999',
    background: '#5865F2',
    color: '#fff',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'move',
    userSelect: 'none',
  });
  document.body.appendChild(toggleBtn);

  let isDragging = false, offsetX = 0, offsetY = 0;
  toggleBtn.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - toggleBtn.offsetLeft;
    offsetY = e.clientY - toggleBtn.offsetTop;
  });
  document.addEventListener('mousemove', e => {
    if (isDragging) {
      toggleBtn.style.left = `${e.clientX - offsetX}px`;
      toggleBtn.style.top = `${e.clientY - offsetY}px`;
    }
  });
  document.addEventListener('mouseup', () => isDragging = false);

  // UIパネル
  const ui = document.createElement('div');
  Object.assign(ui.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#2f3136',
    color: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px #000',
    zIndex: '10000',
    display: 'none',
    minWidth: '300px',
  });

  ui.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <strong>Token Login</strong>
      <button id="close-ui" style="background: transparent; border: none; color: white; font-size: 18px; cursor: pointer;">✖</button>
    </div>
    <input type="text" id="token-input" placeholder="Enter your token here" style="width: 100%; padding: 8px; border-radius: 5px; border: none;">
    <button id="login-token" style="margin-top: 10px; width: 100%; padding: 10px; border: none; border-radius: 5px; background: #7289DA; color: white; cursor: pointer;">Login</button>
  `;
  document.body.appendChild(ui);

  // 表示切替
  toggleBtn.addEventListener('click', () => {
    ui.style.display = ui.style.display === 'none' ? 'block' : 'none';
  });

  // UIのボタン操作
  ui.addEventListener('click', (e) => {
    if (e.target.id === 'close-ui') {
      ui.style.display = 'none';
    } else if (e.target.id === 'login-token') {
      const token = document.getElementById('token-input').value;
      if (!token) return alert('Tokenを入力してください');

      try {
        localStorage.setItem('token', `"${token}"`);
        alert('Tokenを保存しました。自動で再読み込みします。');
        setTimeout(() => location.reload(), 1000);
      } catch (err) {
        console.error('localStorage書き込み失敗:', err);
        alert('localStorageの書き込みに失敗しました。');
      }
    }
  });
})();
