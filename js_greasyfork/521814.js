// ==UserScript==
// @namespace    https://openuserjs.org/users/SB100
// @name         靓仔专用DC开水
// @description  Auto post a message to a discord channel every random interval within a range
// @version      1.3.0
// @author       SB100
// @copyright    2021, SB100
// @license      MIT
// @match        https://discord.com/channels/*
// @downloadURL https://update.greasyfork.org/scripts/521814/%E9%9D%93%E4%BB%94%E4%B8%93%E7%94%A8DC%E5%BC%80%E6%B0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/521814/%E9%9D%93%E4%BB%94%E4%B8%93%E7%94%A8DC%E5%BC%80%E6%B0%B4.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

let timer = null;
let sentMessageCount = 0; // 记录已发送消息数量

// 获取当前频道的 ID
function getChannel() {
  return document.location.pathname.split('/').pop();
}

// 发送消息到指定频道
function sendMessage(token, channel, message) {
  fetch(`https://discord.com/api/v9/channels/${channel}/messages`, {
    method: 'POST',
    headers: {
      'authorization': token,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ content: message })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`状态码：${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      sentMessageCount++; // 成功发送后递增计数器
      updateSentMessageCountDisplay(); // 更新计数器显示
      logMessage(`发送成功: ${message} (时间: ${new Date().toLocaleTimeString()})`);
    })
    .catch(error => {
      logMessage(`发送失败: ${error.message}`, true);
    });
}

// 更新已发送消息数量显示
function updateSentMessageCountDisplay() {
  const countDisplay = document.getElementById('auto--message-count');
  countDisplay.textContent = `已发送消息数量：${sentMessageCount}`;
}

// 显示日志信息
function logMessage(message, isError = false) {
  const logArea = document.getElementById('auto--log');
  const logMessage = document.createElement('div');
  logMessage.style.color = isError ? 'red' : 'green';
  logMessage.textContent = message;
  logArea.appendChild(logMessage);
  logArea.scrollTop = logArea.scrollHeight;
}

// 复制日志功能
function copyLogs() {
  const logArea = document.getElementById('auto--log');
  const logs = Array.from(logArea.children).map(log => log.textContent).join('\n');
  navigator.clipboard.writeText(logs).then(() => {
    alert('日志已复制到剪贴板！');
  });
}

// 显示或隐藏设置面板
function showOrHideSettings(isShow) {
  const settings = document.getElementById('auto--settings');
  settings.style.display = isShow ? 'block' : 'none';

  // 如果显示设置界面，取消自动发送
  if (isShow && timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

// 保存设置并开始自动发送
function saveSettings() {
  const token = document.getElementById('auto--token').value.trim();
  const messages = document.getElementById('auto--messages').value.trim().split('\n').filter(msg => msg.length > 0);
  const minInterval = parseInt(document.getElementById('auto--min-interval').value, 10);
  const maxInterval = parseInt(document.getElementById('auto--max-interval').value, 10);

  // 校验输入范围
  if (!token || messages.length === 0 || isNaN(minInterval) || isNaN(maxInterval) || minInterval >= maxInterval) {
    alert('请确保所有字段都已正确填写，且最小时间小于最大时间！');
    return;
  }
  if (minInterval < 1 || minInterval > 1200 || maxInterval < 1 || maxInterval > 1200) {
    alert('发送间隔应在 1 到 1200 秒之间，请重新输入！');
    return;
  }

  localStorage.setItem('discord_token', token); // 保存 Token 到 localStorage

  const channel = getChannel();
  showOrHideSettings(false);

  function scheduleNextMessage() {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;

    sendMessage(token, channel, randomMessage);

    timer = setTimeout(scheduleNextMessage, randomInterval * 1000);
  }

  scheduleNextMessage();
}

// 创建设置面板
function createSettings() {
  const settingsDiv = document.createElement('div');
  settingsDiv.id = 'auto--settings';
  settingsDiv.innerHTML = `
    <h3 style='text-align: center; margin-bottom: 10px;'>自动消息发送设置</h3>
    <label for='auto--token' style='display: block; margin-bottom: 10px;'>
      <div>Discord Token：</div>
      <input id='auto--token' style='padding: 5px; width: 100%;' type='text' placeholder='请输入您的 Token' value='${localStorage.getItem('discord_token') || ''}' />
    </label>
    <label for='auto--messages' style='display: block; margin-bottom: 10px;'>
      <div>消息模板（每行一条消息）：</div>
      <textarea id='auto--messages' style='padding: 5px; width: 100%; height: 100px;' placeholder='请输入消息模板，每行一条'></textarea>
    </label>
    <label for='auto--min-interval' style='display: block; margin-bottom: 10px;'>
      <div>最小发送间隔（秒）：</div>
      <input id='auto--min-interval' style='padding: 5px; width: 100%;' type='number' placeholder='1' value='1' min='1' max='1200' />
    </label>
    <label for='auto--max-interval' style='display: block; margin-bottom: 10px;'>
      <div>最大发送间隔（秒）：</div>
      <input id='auto--max-interval' style='padding: 5px; width: 100%;' type='number' placeholder='1200' value='1200' min='1' max='1200' />
    </label>
    <div id='auto--message-count' style='margin-top: 20px; color: #FFD700; font-weight: bold; text-align: center;'>
      已发送消息数量：0
    </div>
    <div style='text-align: center; margin-top: 20px;'>
      <button id='auto--start' style='padding: 5px 10px; margin-right: 10px;'>开始发送</button>
      <button id='auto--cancel' style='padding: 5px 10px;'>取消</button>
    </div>
    <h4 style='margin-top: 20px;'>消息日志：</h4>
    <div id='auto--log' style='background: #333; color: #fff; padding: 5px; height: 150px; overflow-y: auto; border: 1px solid #444;'></div>
    <button id='auto--copy-log' style='margin-top: 10px; padding: 5px 10px; width: 100%;'>复制日志</button>
  `;
  settingsDiv.style.display = 'none';
  settingsDiv.style.position = 'absolute';
  settingsDiv.style.width = '400px';
  settingsDiv.style.top = '50%';
  settingsDiv.style.left = '50%';
  settingsDiv.style.transform = 'translate(-50%, -50%)';
  settingsDiv.style.background = '#202225';
  settingsDiv.style.color = '#fff';
  settingsDiv.style.padding = '20px';
  settingsDiv.style.borderRadius = '10px';
  settingsDiv.style.zIndex = 1000;

  document.body.appendChild(settingsDiv);

  document.getElementById('auto--start').onclick = saveSettings;
  document.getElementById('auto--cancel').onclick = () => showOrHideSettings(false);
  document.getElementById('auto--copy-log').onclick = copyLogs;
}

// 创建设置按钮
function createSettingsButton() {
  const button = document.createElement('button');
  button.textContent = '自动消息设置';
  button.style.position = 'absolute';
  button.style.top = '10px';
  button.style.left = '10px';
  button.style.padding = '5px 10px';
  button.style.zIndex = 1000;
  button.onclick = () => showOrHideSettings(true);
  document.body.appendChild(button);
}

// 主入口
(function () {
  'use strict';

  createSettings();
  createSettingsButton();
})();
