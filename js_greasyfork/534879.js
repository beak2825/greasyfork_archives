// ==UserScript==
// @name         boss-自动投递脚本
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  自动化预览处理与沟通脚本 - 控制面板可隐藏，优化布局，日志输出，状态切换，新增已沟通候选人去除功能 + 成功计数 + 状态重置
// @match        https://www.zhipin.com/web/geek/*
// @match        *://www.zhipin.com/chat/*
// @author       illilli
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534879/boss-%E8%87%AA%E5%8A%A8%E6%8A%95%E9%80%92%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/534879/boss-%E8%87%AA%E5%8A%A8%E6%8A%95%E9%80%92%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let currentIndex = 0;
  let isRunning = false;
  const enableOnlineCheck = true;
  let successCount = parseInt(localStorage.getItem('successCount')) || 0;

  function createControlPanel() {
    if (document.getElementById('bossAutoPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'bossAutoPanel';
    panel.style.position = 'fixed';
    panel.style.top = '20px';
    panel.style.left = '20px';
    panel.style.padding = '20px';
    panel.style.backgroundColor = '#333';
    panel.style.color = '#fff';
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    panel.style.zIndex = '1000';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.fontSize = '14px';
    panel.style.width = '300px';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '10px';
    header.innerHTML = `<span style="font-weight:bold;">脚本控制面板</span>`;

    const closeBtn = document.createElement('button');
    closeBtn.innerText = '×';
    closeBtn.style.background = 'transparent';
    closeBtn.style.color = '#fff';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '16px';
    closeBtn.title = '隐藏控制台';
    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none';
      showToggleButton();
    });

    header.appendChild(closeBtn);
    panel.appendChild(header);

    const scriptInfo = document.createElement('div');
    scriptInfo.style.fontSize = '12px';
    scriptInfo.style.marginBottom = '10px';
    scriptInfo.innerHTML = `
      <strong>脚本名:</strong> boss-自动投递脚本<br>
      <strong>说明:</strong> 请自行筛选岗位后再进行投递。`;
    panel.appendChild(scriptInfo);

    const statusInfo = document.createElement('div');
    statusInfo.id = 'statusInfo';
    statusInfo.style.marginBottom = '15px';
    statusInfo.innerHTML = `<strong>成功沟通数:</strong> <span id="successCount">${successCount}</span>`;
    panel.appendChild(statusInfo);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';

    const startButton = document.createElement('button');
    startButton.innerText = '开始';
    startButton.style.width = '100%';
    styleButton(startButton, '#28a745');
    startButton.addEventListener('click', () => {
      if (!isRunning) {
        isRunning = true;
        toggleButtons(startButton, stopButton);
        log('脚本已启动');
        processNextItem();
      }
    });

    const stopButton = document.createElement('button');
    stopButton.innerText = '停止';
    stopButton.style.width = '100%';
    styleButton(stopButton, '#dc3545');
    stopButton.style.display = 'none';
    stopButton.addEventListener('click', () => {
      isRunning = false;
      toggleButtons(startButton, stopButton);
      log('脚本已停止');
    });

    const resetButton = document.createElement('button');
    resetButton.innerText = '重置计数';
    resetButton.style.width = '100%';
    styleButton(resetButton, '#ffc107');
    resetButton.addEventListener('click', () => {
      successCount = 0;
      localStorage.setItem('successCount', successCount);
      document.getElementById('successCount').innerText = successCount;
      log('已重置成功沟通计数');
    });

    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(stopButton);
    buttonContainer.appendChild(resetButton);
    panel.appendChild(buttonContainer);

    const logPanel = document.createElement('div');
    logPanel.style.marginTop = '10px';
    logPanel.style.borderTop = '1px solid #ccc';
    logPanel.style.paddingTop = '10px';

    const logHeader = document.createElement('div');
    logHeader.style.cursor = 'pointer';
    logHeader.style.textAlign = 'center';
    logHeader.style.fontWeight = 'bold';
    logHeader.innerText = '日志输出 (点击折叠/展开)';
    logHeader.addEventListener('click', () => {
      const isVisible = logArea.style.display !== 'none';
      logArea.style.display = isVisible ? 'none' : 'block';
      logHeader.innerText = isVisible ? '日志输出 (点击展开)' : '日志输出 (点击折叠)';
    });

    const logArea = document.createElement('div');
    logArea.id = 'logArea';
    logArea.style.maxHeight = '200px';
    logArea.style.overflowY = 'auto';
    logArea.style.marginTop = '10px';
    logArea.style.color = '#ddd';
    logArea.style.fontSize = '12px';
    logArea.style.fontFamily = 'Courier New, monospace';

    logPanel.appendChild(logHeader);
    logPanel.appendChild(logArea);
    panel.appendChild(logPanel);

    document.body.appendChild(panel);
  }

  function showToggleButton() {
    let toggle = document.getElementById('toggleConsoleBtn');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.id = 'toggleConsoleBtn';
      toggle.innerText = '显示控制台';
      styleButton(toggle, '#007bff');
      toggle.style.position = 'fixed';
      toggle.style.top = '20px';
      toggle.style.left = '20px';
      toggle.style.zIndex = '1000';
      toggle.addEventListener('click', () => {
        document.getElementById('bossAutoPanel').style.display = 'block';
        toggle.remove();
      });
      document.body.appendChild(toggle);
    }
  }

  function styleButton(btn, bgColor) {
    btn.style.padding = '10px';
    btn.style.backgroundColor = bgColor;
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '14px';
    btn.style.marginTop = '5px';
  }

  function toggleButtons(startBtn, stopBtn) {
    startBtn.style.display = isRunning ? 'none' : 'inline-block';
    stopBtn.style.display = isRunning ? 'inline-block' : 'none';
  }

  function log(message) {
    const logArea = document.getElementById('logArea');
    const entry = document.createElement('div');
    entry.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
    logArea.appendChild(entry);
    logArea.scrollTop = logArea.scrollHeight;
  }

  function getPreviewItems() {
    return document.querySelectorAll('.job-card-box');
  }

  function randomDelay(min, max) {
    return Math.random() * (max - min) + min;
  }

  function shouldClickGoutong() {
    if (!enableOnlineCheck) return true;
    const onlineTag = document.querySelector('.boss-online-tag');
    const activeTag = document.querySelector('.boss-active-time');
    const activeText = activeTag ? activeTag.innerText.trim() : '';
    return (
      (onlineTag && onlineTag.innerText.trim() === '在线') ||
      ['刚刚活跃', '今日活跃', '3日内活跃'].includes(activeText)
    );
  }

  function clickGoutongButton() {
    const button = document.querySelector('.op-btn-chat');
    if (button && shouldClickGoutong()) {
      log('点击：立即沟通');
      button.click();
      successCount++;
      document.getElementById('successCount').innerText = successCount;
      localStorage.setItem('successCount', successCount);
      waitForCancel();
    } else {
      log('未满足沟通条件，跳过');
      processNextItem();
    }
  }

  function waitForCancel() {
    const interval = setInterval(() => {
      const cancelBtn = document.querySelector('.cancel-btn');
      if (cancelBtn) {
        log('点击：留在此页');
        cancelBtn.click();
        clearInterval(interval);
        setTimeout(processNextItem, randomDelay(1000, 2000));
      }
    }, 500);
  }

  function processNextItem() {
    if (!isRunning) return;

    const items = getPreviewItems();
    if (currentIndex >= items.length) {
      log('已处理完所有项目');
      return;
    }

    const item = items[currentIndex];
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    item.click();
    currentIndex++;

    setTimeout(() => {
      clickGoutongButton();
    }, randomDelay(1000, 2000));
  }

  function filterCandidate() {
    const candidates = Array.from(document.querySelectorAll('.candidate-card'));
    candidates.forEach(candidate => {
      const status = candidate.querySelector('.status');
      if (status && status.innerText.includes('已沟通')) {
        candidate.remove();
        log('已移除已沟通候选人');
      }
    });
  }

  // 状态重置
  window.addEventListener('beforeunload', () => {
    currentIndex = 0;
  });

  // 启动脚本
  createControlPanel();
  filterCandidate();
})();
