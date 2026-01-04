// ==UserScript==
// @name         Boss 直聘拉黑公司列表
// @namespace    https://github.com/anghunk/UserScript
// @version      1.0.3
// @description  过滤职位列表中的黑名单公司，支持导入导出，一键拉黑功能。
// @author       anghunk
// @match        *://*.zhipin.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      Apache-2.0 license
// @icon         https://static.zhipin.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/539272/Boss%20%E7%9B%B4%E8%81%98%E6%8B%89%E9%BB%91%E5%85%AC%E5%8F%B8%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539272/Boss%20%E7%9B%B4%E8%81%98%E6%8B%89%E9%BB%91%E5%85%AC%E5%8F%B8%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加样式
  GM_addStyle(`
        .blacklisted {
            height: 40px !important;
            overflow: hidden !important;
            opacity: 0.5;
            position: relative;
            background-color: #f5f5f5;
        }
        .blacklisted .job-info,
        .blacklisted .company-location,
        .blacklisted .boss-logo,
        .blacklisted .job-tag-icon,
        .blacklisted .block-btn  {
            display: none !important;
        }
        .blacklisted .boss-name {
            display: block !important;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 14px;
            color: #666;
        }
        .blacklisted .boss-info {
            display: block !important;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        .blacklisted::before {
            content: "已屏蔽";
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            z-index: 10;
            font-size: 12px;
        }
        .block-btn {
            background-color: #ff6b6b;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 2px 6px;
            margin-left: 8px;
            cursor: pointer;
            font-size: 12px;
            white-space: nowrap;
        }
        .block-btn:hover {
            background-color: #e74c3c;
        }
        .blacklist-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            z-index: 9999;
            padding: 15px;
            display: none;
        }
        .blacklist-panel h3 {
            margin-top: 0;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .blacklist-panel ul {
            max-height: 300px;
            overflow-y: auto;
            padding: 0;
            margin: 0;
            list-style: none;
        }
        .blacklist-panel li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f5f5f5;
        }
        .blacklist-panel button {
            background-color: #ff6b6b;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 2px 6px;
            cursor: pointer;
        }
        .blacklist-btn {
            margin-right: 8px;
        }
        .panel-toggle {
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: #1e88e5;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        .import-export-section {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .import-export-section button {
            margin-right: 10px;
            background-color: #1e88e5;
        }
        .file-input {
            display: none;
        }
        .status-message {
            margin-top: 10px;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
        }
        .success-message {
            background-color: #d4edda;
            color: #155724;
        }
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
        }
    `);

  // 获取黑名单
  let blacklist = GM_getValue('companyBlacklist', []);

  // 创建黑名单面板
  function createBlacklistPanel() {
    const panel = document.createElement('div');
    panel.className = 'blacklist-panel';
    panel.id = 'blacklistPanel';
    panel.innerHTML = `
            <h3>公司黑名单</h3>
            <ul id="blacklistItems"></ul>
            <div class="import-export-section">
                <button id="exportBlacklist" class="blacklist-btn">导出黑名单</button>
                <button id="importBlacklistBtn" class="blacklist-btn">导入黑名单</button>
                <input type="file" id="importBlacklist" class="file-input" accept=".json">
                <div id="statusMessage" class="status-message"></div>
            </div>
            <div style="margin-top: 15px;">
                <button id="clearBlacklist" style="background-color: #e74c3c;">清空黑名单</button>
            </div>
        `;
    document.body.appendChild(panel);

    // 添加面板开关按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'panel-toggle';
    toggleBtn.textContent = '黑名单管理';
    toggleBtn.addEventListener('click', () => {
      const panel = document.getElementById('blacklistPanel');
      if (panel.style.display === 'block') {
        panel.style.display = 'none';
      } else {
        panel.style.display = 'block';
        updateBlacklistPanel();
      }
    });
    document.body.appendChild(toggleBtn);

    // 清空黑名单按钮事件
    document.getElementById('clearBlacklist').addEventListener('click', () => {
      if (confirm('确定要清空黑名单吗？')) {
        blacklist = [];
        GM_setValue('companyBlacklist', blacklist);
        updateBlacklistPanel();
        processJobList();
        showStatusMessage('黑名单已清空', true);
      }
    });

    // 导出黑名单按钮事件
    document.getElementById('exportBlacklist').addEventListener('click', exportBlacklist);

    // 导入黑名单按钮触发文件选择
    document.getElementById('importBlacklistBtn').addEventListener('click', () => {
      document.getElementById('importBlacklist').click();
    });

    // 导入黑名单文件变化事件
    document.getElementById('importBlacklist').addEventListener('change', importBlacklist);

    // 点击面板外部区域关闭面板
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('blacklistPanel');
      const toggleBtn = document.querySelector('.panel-toggle');

      if (panel && panel.style.display === 'block' &&
        !panel.contains(e.target) &&
        e.target !== toggleBtn) {
        panel.style.display = 'none';
      }
    });
  }

  // 显示状态消息
  function showStatusMessage(message, isSuccess) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = 'status-message ' + (isSuccess ? 'success-message' : 'error-message');
    statusElement.style.display = 'block';

    // 3 秒后自动隐藏消息
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }

  // 导出黑名单
  function exportBlacklist() {
    if (blacklist.length === 0) {
      showStatusMessage('黑名单为空，无法导出', false);
      return;
    }

    const data = JSON.stringify(blacklist, null, 2);
    const blob = new Blob([data], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const dateStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
    const filename = `公司黑名单_${dateStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showStatusMessage('黑名单已导出', true);
  }

  // 导入黑名单
  function importBlacklist(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!Array.isArray(importedData)) {
          throw new Error('文件格式不正确');
        }

        // 过滤掉非字符串项
        const validItems = importedData.filter(item => typeof item === 'string');

        // 合并黑名单，去除重复项
        const uniqueItems = [...new Set([...blacklist, ...validItems])];
        blacklist = uniqueItems;

        GM_setValue('companyBlacklist', blacklist);
        updateBlacklistPanel();
        processJobList();

        showStatusMessage(`成功导入 ${validItems.length} 个公司到黑名单`, true);
      } catch (error) {
        showStatusMessage('导入失败：' + error.message, false);
      }

      // 重置文件输入框
      event.target.value = '';
    };

    reader.onerror = function () {
      showStatusMessage('读取文件时出错', false);
      event.target.value = '';
    };

    reader.readAsText(file);
  }

  // 更新黑名单面板
  function updateBlacklistPanel() {
    const container = document.getElementById('blacklistItems');
    container.innerHTML = '';

    if (blacklist.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.textContent = '黑名单为空';
      emptyItem.style.color = '#999';
      container.appendChild(emptyItem);
      return;
    }

    blacklist.forEach((company, index) => {
      const item = document.createElement('li');

      const companyName = document.createElement('span');
      companyName.textContent = company;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '移除';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡
        blacklist.splice(index, 1);
        GM_setValue('companyBlacklist', blacklist);
        updateBlacklistPanel();
        processJobList();
      });

      item.appendChild(companyName);
      item.appendChild(removeBtn);
      container.appendChild(item);
    });
  }

  // 处理职位列表
  function processJobList() {
    const jobCards = document.querySelectorAll('.job-card-box');

    jobCards.forEach(card => {
      const companyNameElement = card.querySelector('.boss-name');

      if (companyNameElement) {
        const companyName = companyNameElement.textContent.trim();

        // 检查公司是否在黑名单中
        if (blacklist.includes(companyName)) {
          card.classList.add('blacklisted');
        } else {
          card.classList.remove('blacklisted');

          // 如果没有添加过拉黑按钮，则添加
          if (!card.querySelector('.block-btn')) {
            const blockBtn = document.createElement('button');
            blockBtn.className = 'block-btn';
            blockBtn.textContent = '拉黑';
            blockBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!blacklist.includes(companyName)) {
                blacklist.push(companyName);
                GM_setValue('companyBlacklist', blacklist);
                updateBlacklistPanel();
                processJobList();
              }
            });

            companyNameElement.parentNode.appendChild(blockBtn);
          }
        }
      }
    });
  }

  // 初始化
  function initialize() {
    createBlacklistPanel();
    processJobList();

    // 监听 DOM 变化，处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;

      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          shouldProcess = true;
        }
      });

      if (shouldProcess) {
        processJobList();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();