// ==UserScript==
// @name         Duolingo Account Generator UI (Modern)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Tạo tài khoản Duolingo với giao diện hiện đại, xem lại tài khoản đã tạo và truy cập Discord (demo)
// @author       You
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538086/Duolingo%20Account%20Generator%20UI%20%28Modern%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538086/Duolingo%20Account%20Generator%20UI%20%28Modern%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const accountLog = [];

  function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  function generateEmail(domain = 'example.com') {
    return `${generateRandomString(10)}@${domain}`;
  }

  function generatePassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  async function createDuolingoAccount() {
    const email = generateEmail();
    const password = generatePassword();
    const username = email.split('@')[0];

    const payload = {
      email: email,
      password: password,
      username: username,
      age: 25,
      fromLanguage: 'en',
      learningLanguage: 'es'
    };

    try {
      const response = await fetch('https://www.duolingo.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const accountInfo = `✅ Username: ${username}\n📧 Email: ${email}\n🔒 Password: ${password}`;
        accountLog.push(accountInfo);
        updateStatus(`🎉 Tạo thành công!\n${accountInfo}`);
      } else {
        const errorText = await response.text();
        updateStatus(`❌ Thất bại: ${response.status}\n${errorText}`);
      }
    } catch (err) {
      updateStatus(`❌ Lỗi kết nối: ${err.message}`);
    }
  }

  function createUI() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.padding = '20px';
    container.style.background = '#1cb0f6';
    container.style.color = 'white';
    container.style.borderRadius = '16px';
    container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    container.style.fontFamily = 'Segoe UI, sans-serif';
    container.style.maxWidth = '320px';

    const title = document.createElement('div');
    title.innerText = '🚀 Duolingo Account Generator';
    title.style.fontWeight = '600';
    title.style.fontSize = '16px';
    title.style.marginBottom = '12px';
    container.appendChild(title);

    const btnCreate = document.createElement('button');
    btnCreate.innerText = 'Tạo tài khoản';
    styleButton(btnCreate);
    btnCreate.onclick = createDuolingoAccount;
    container.appendChild(btnCreate);

    const btnView = document.createElement('button');
    btnView.innerText = 'Xem tài khoản đã tạo';
    styleButton(btnView);
    btnView.style.marginTop = '10px';
    btnView.onclick = () => {
      if (accountLog.length === 0) {
        updateStatus('📭 Chưa có tài khoản nào được tạo.');
      } else {
        updateStatus(accountLog.join('\n\n'));
      }
    };
    container.appendChild(btnView);

    const btnDiscord = document.createElement('button');
    btnDiscord.innerText = '🔗 Mở Discord';
    styleButton(btnDiscord);
    btnDiscord.style.marginTop = '10px';
    btnDiscord.onclick = () => {
      window.open('https://discord.com/invite/your-invite-code', '_blank');
    };
    container.appendChild(btnDiscord);

    const status = document.createElement('pre');
    status.id = 'account-status';
    status.style.marginTop = '15px';
    status.style.background = 'rgba(255,255,255,0.1)';
    status.style.padding = '10px';
    status.style.borderRadius = '8px';
    status.style.whiteSpace = 'pre-wrap';
    status.style.fontSize = '12px';
    container.appendChild(status);

    document.body.appendChild(container);
  }

  function styleButton(btn) {
    btn.style.padding = '10px 15px';
    btn.style.background = '#fff';
    btn.style.color = '#1cb0f6';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = 'bold';
    btn.style.width = '100%';
    btn.onmouseenter = () => btn.style.opacity = '0.9';
    btn.onmouseleave = () => btn.style.opacity = '1';
  }

  function updateStatus(message) {
    const status = document.getElementById('account-status');
    if (status) status.textContent = message;
  }

  window.addEventListener('load', createUI);
})();
