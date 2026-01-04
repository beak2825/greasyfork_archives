// ==UserScript==
// @name         管理系统改造
// @namespace    niansi
// @version      0.0.2
// @description  换换样式
// @author       廿四
// @match        http://www.wbingqiang.cn:8080/*
// @icon         http://www.wbingqiang.cn:8080/myadmin/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528555/%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E6%94%B9%E9%80%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/528555/%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E6%94%B9%E9%80%A0.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  const style = document.createElement('style');
  style.textContent = `
    .progress-container {
      width: 100px;
      height: 20px;
      background-color: #e9ecef;
      border-radius: 10px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background-color: #28a745;
      transition: width 0.3s ease;
      text-align: center;
      font-size: 12px;
      line-height: 20px;
      color: #000;
    }
    .custom-status-text {
      padding: 4px 6px;
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);
 
  const ths = document.querySelectorAll('.qcrwTable th');
  let progressIndex = -1;
  let statusIndex = -1;
  let confirmIndex = -1;
 
  ths.forEach((th, index) => {
    const text = th.textContent.trim();
    if (text === '开发进度%') progressIndex = index;
    if (text === '状态') statusIndex = index;
    if (text === '确认状态') confirmIndex = index;
  });
 
  const updateProgressBar = (progress, progressValue) => {
    progress.innerHTML = `
      <div class="progress-container">
        <div class="progress-bar" style="width: ${progressValue}%">${progressValue}%</div>
      </div>
    `;
  };
 
  const updateStatus = (status, statusText) => {
    const statusMap = {
      '新建': { bgColor: 'rgba(0, 151, 225, 0.2)', color: 'rgb(0, 151, 225)' },
      '编码中': { bgColor: 'rgba(250, 143, 0, 0.2)', color: 'rgb(250, 143, 0)' },
      '提交测试': { bgColor: 'rgba(124, 189, 0, 0.2)', color: 'rgb(124, 189, 0)' },
      '已关闭': { bgColor: 'rgba(198, 137, 190, 0.2)', color: 'rgb(198, 137, 190)' }
    };
 
    if (statusMap[statusText]) {
      const { bgColor, color } = statusMap[statusText];
      status.innerHTML = `
        <div class="custom-status">
          <span class="custom-status-text" style="background-color: ${bgColor}; color: ${color}">${statusText}</span>
        </div>
      `;
    }
  };
 
  const updateConfirmStatus = (confirm, confirmText) => {
    const confirmMap = {
      '未确认': { bgColor: '#ff4d4f', color: '#fff' },
      '已确认': { bgColor: '#5d9cec', color: '#fff' }
    };
 
    if (confirmMap[confirmText]) {
      const { bgColor, color } = confirmMap[confirmText];
      confirm.innerHTML = `
        <div class="custom-status">
          <span class="custom-status-text" style="background-color: ${bgColor}; color: ${color}">${confirmText}</span>
        </div>
      `;
    }
  };
 
  const updateTable = () => {
    const trs = document.querySelectorAll('.qcrwTable #bootstrap-table tbody tr');
    trs.forEach(tr => {
      const tds = tr.querySelectorAll('td');
      if (progressIndex !== -1) {
        const progress = tds[progressIndex];
        if (progress) {
          const rawText = progress.textContent.trim();
          const progressValue = rawText.replace(/[^0-9.]/g, '') || 0;
          updateProgressBar(progress, progressValue);
        }
      }
 
      if (statusIndex !== -1) {
        const status = tds[statusIndex];
        if (status) {
          const statusText = status.textContent.trim();
          updateStatus(status, statusText);
        }
      }
 
      if (confirmIndex !== -1) {
        const confirm = tds[confirmIndex];
        if (confirm) {
          const confirmText = confirm.textContent.trim();
          updateConfirmStatus(confirm, confirmText);
        }
      }
    });
  };
 
  window.addEventListener('resize', () => {
    updateTable();
  });
 
  const observer = new MutationObserver(() => {
    updateTable();
  });
 
  observer.observe(document.querySelector('.qcrwTable #bootstrap-table tbody'), { childList: true });
 
  // Initial update
  updateTable();
})();