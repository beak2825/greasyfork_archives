// ==UserScript==
// @name         Boss直聘职位数据采集
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  采集Boss直聘上的职位数据
// @author       You
// @match        https://www.zhipin.com/*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/535486/Boss%E7%9B%B4%E8%81%98%E8%81%8C%E4%BD%8D%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/535486/Boss%E7%9B%B4%E8%81%98%E8%81%8C%E4%BD%8D%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 存储token和数据
  let token = GM_getValue('zp_token', '');
  let zp_token = GM_getValue('zp_zp_token', '');
  let cachedData = GM_getValue('zp_cached_data', null);
  let lastFetchTime = GM_getValue('zp_last_fetch', 0);

  // 添加样式
  GM_addStyle(`
    .zp-data-btn {
      position: fixed;
      bottom: 100px;
      right: 20px;
      z-index: 9999;
      background: linear-gradient(135deg, #3a7bd5, #00d2ff);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .zp-data-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    .zp-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    }

    .zp-modal-content {
      background: white;
      padding: 30px;
      border-radius: 10px;
      width: 400px;
      max-width: 90%;
      box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
    }

    .zp-modal-title {
      font-size: 20px;
      margin-bottom: 20px;
      color: #333;
    }

    .zp-input-group {
      margin-bottom: 20px;
    }

    .zp-input-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
      color: #555;
    }

    .zp-input-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
    }

    .zp-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .zp-btn {
      padding: 10px 20px;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      font-weight: bold;
    }

    .zp-btn-primary {
      background: linear-gradient(135deg, #3a7bd5, #00d2ff);
      color: white;
    }

    .zp-btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    /* 数据展示浮窗样式 */
    .zp-data-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      height: 80%;
      max-width: 1000px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
      z-index: 10001;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .zp-data-container.minimized {
      height: 50px;
      width: 200px;
      overflow: hidden;
    }

    .zp-data-header {
      padding: 15px 20px;
      background: linear-gradient(135deg, #3a7bd5, #00d2ff);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    .zp-data-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-left: 10px;
    }

    .zp-data-toolbar {
      padding: 15px 20px;
      background: #f5f5f5;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .zp-data-search {
      flex: 1;
      min-width: 200px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .zp-data-filter {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      min-width: 150px;
    }

    .zp-data-date-filter {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .zp-data-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .zp-data-item {
      padding: 15px;
      border: 1px solid #eee;
      border-radius: 8px;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      height: fit-content;
    }

    .zp-data-item:hover {
      background: #f9f9f9;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .zp-data-item-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .zp-data-logo {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      margin-right: 10px;
      object-fit: cover;
      background: #f5f5f5;
    }

    .zp-data-company-wrapper {
      flex: 1;
      min-width: 0;
    }

    .zp-data-company {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 5px;
      color: #3a7bd5;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .zp-data-job {
      font-size: 15px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }

    .zp-data-salary {
      color: #ff6b6b;
      font-weight: bold;
    }

    .zp-data-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 13px;
      color: #666;
      margin-bottom: 8px;
    }

    .zp-data-time {
      font-size: 12px;
      color: #999;
      margin-top: auto;
    }

    .zp-data-link {
      display: inline-block;
      margin-top: 8px;
      color: #3a7bd5;
      text-decoration: none;
      font-size: 13px;
    }

    .zp-data-link:hover {
      text-decoration: underline;
    }

    .zp-data-refresh {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      margin-left: 10px;
    }

    .zp-data-count {
      font-size: 14px;
      opacity: 0.9;
    }
  `);

  // 创建按钮
  function createButton() {
    const btn = document.createElement('button');
    btn.className = 'zp-data-btn';
    btn.textContent = '获取职位数据';
    btn.addEventListener('click', handleButtonClick);
    document.body.appendChild(btn);
  }

  // 显示token输入弹窗
  function showTokenModal() {
    const modal = document.createElement('div');
    modal.className = 'zp-modal';

    modal.innerHTML = `
      <div class="zp-modal-content">
        <h3 class="zp-modal-title">请输入Token信息</h3>
        <div class="zp-input-group">
          <label for="token">Token</label>
          <input type="text" id="token" placeholder="输入token" value="${token}">
        </div>
        <div class="zp-input-group">
          <label for="zp_token">Zp Token</label>
          <input type="text" id="zp_token" placeholder="输入zp_token" value="${zp_token}">
        </div>
        <div class="zp-modal-actions">
          <button class="zp-btn zp-btn-secondary" id="cancel-token">取消</button>
          <button class="zp-btn zp-btn-primary" id="save-token">确认</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const cancelBtn = modal.querySelector('#cancel-token');
    const saveBtn = modal.querySelector('#save-token');

    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    saveBtn.addEventListener('click', () => {
      const tokenInput = modal.querySelector('#token');
      const zpTokenInput = modal.querySelector('#zp_token');

      token = tokenInput.value.trim();
      zp_token = zpTokenInput.value.trim();

      if (!token || !zp_token) {
        alert('请输入完整的token信息');
        return;
      }

      // 保存token
      GM_setValue('zp_token', token);
      GM_setValue('zp_zp_token', zp_token);

      document.body.removeChild(modal);
      fetchAndDisplayData();
    });
  }

  // 格式化时间
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  // 生成岗位链接
  function generateJobLink(encryptJobId) {
    return `https://www.zhipin.com/job_detail/${encryptJobId}.html?ka=personal_sawme_job_${encryptJobId}`;
  }

  // 获取职位数据
  async function fetchJobData(page) {
    const timestamp = Date.now();
    const url = `https://www.zhipin.com/wapi/zprelation/interaction/geekGetJob?page=${page}&tag=2&_=${timestamp}`;

    const response = await fetch(url, {
      headers: {
        "accept": "application/json, text/plain, */*",
        "token": token,
        "zp_token": zp_token
      },
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) throw new Error(`请求第 ${page} 页失败`);
    return response.json();
  }

  // 处理并显示数据
  async function fetchAndDisplayData(forceRefresh = false) {
    try {
      // 检查缓存是否有效（1小时内）
      const now = Date.now();
      const cacheValid = now - lastFetchTime < 3600000; // 1小时缓存

      if (cachedData && cacheValid && !forceRefresh) {
        console.log('使用缓存数据');
        showData(processData(cachedData));
        return;
      }

      console.log('开始获取数据...');

      // 显示加载状态
      const loading = document.createElement('div');
      loading.className = 'zp-modal';
      loading.innerHTML = `
        <div class="zp-modal-content" style="text-align: center;">
          <h3>正在获取数据，请稍候...</h3>
        </div>
      `;
      document.body.appendChild(loading);

      // 获取25页数据
      const allData = [];
      for (let page = 1; page <= 25; page++) {
        console.log(`正在获取第 ${page} 页...`);
        const data = await fetchJobData(page);
        if(data.zpData && data.zpData.cardList) {
          allData.push(...data.zpData.cardList);
        }
        // 添加延迟避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 保存数据和获取时间
      cachedData = allData;
      lastFetchTime = now;
      GM_setValue('zp_cached_data', allData);
      GM_setValue('zp_last_fetch', now);

      // 移除加载状态
      document.body.removeChild(loading);

      // 处理数据
      const processedData = processData(allData);
      showData(processedData);

    } catch (error) {
      console.error('获取数据失败:', error);
      GM_notification({
        title: '获取数据失败',
        text: error.message,
        timeout: 3000
      });
    }
  }

  // 处理数据
  function processData(data) {
    // 按时间排序
    const sortedData = data.sort((a, b) => {
      return new Date(b.happenTime) - new Date(a.happenTime);
    });

    // 按公司名分组
    const companyMap = {};
    sortedData.forEach(item => {
      if (!item.brandName) return;
      if (!companyMap[item.brandName]) {
        companyMap[item.brandName] = [];
      }
      companyMap[item.brandName].push(item);
    });

    return { sortedData, companyMap };
  }

  // 显示数据浮窗
  function showData(data) {
    // 如果已经存在容器，则更新内容
    let container = document.querySelector('.zp-data-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'zp-data-container';
      document.body.appendChild(container);
    } else {
      // 如果已经最小化，则展开
      container.classList.remove('minimized');
    }

    container.innerHTML = `
      <div class="zp-data-header">
        <div>
          <span>职位数据</span>
          <span class="zp-data-count">(共 ${data.sortedData.length} 条)</span>
        </div>
        <div>
          <button class="zp-data-refresh" title="刷新数据">↻</button>
          <button class="zp-data-close" title="最小化">−</button>
          <button class="zp-data-close" title="关闭">&times;</button>
        </div>
      </div>
      <div class="zp-data-toolbar">
        <input type="text" class="zp-data-search" placeholder="搜索公司/职位...">
        <select class="zp-data-filter">
          <option value="all">全部公司</option>
          ${Object.keys(data.companyMap).map(company =>
        `<option value="${company}">${company}</option>`
    ).join('')}
        </select>
        <input type="date" class="zp-data-date-filter" id="date-from" placeholder="开始日期">
        <input type="date" class="zp-data-date-filter" id="date-to" placeholder="结束日期">
      </div>
      <div class="zp-data-content" id="data-content">
        ${renderDataItems(data.sortedData)}
      </div>
    `;

    // 关闭按钮
    const closeBtns = container.querySelectorAll('.zp-data-close');
    closeBtns[0].addEventListener('click', () => {
      container.classList.add('minimized');
    });
    closeBtns[1].addEventListener('click', () => {
      document.body.removeChild(container);
    });

    // 刷新按钮
    const refreshBtn = container.querySelector('.zp-data-refresh');
    refreshBtn.addEventListener('click', () => {
      fetchAndDisplayData(true);
    });

    // 搜索功能
    const searchInput = container.querySelector('.zp-data-search');
    searchInput.addEventListener('input', () => {
      filterData();
    });

    // 筛选功能
    const filterSelect = container.querySelector('.zp-data-filter');
    filterSelect.addEventListener('change', () => {
      filterData();
    });

    // 日期筛选功能
    const dateFrom = container.querySelector('#date-from');
    const dateTo = container.querySelector('#date-to');
    dateFrom.addEventListener('change', filterData);
    dateTo.addEventListener('change', filterData);

    // 综合筛选函数
    function filterData() {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedCompany = filterSelect.value;
      const fromDate = dateFrom.value ? new Date(dateFrom.value).getTime() : 0;
      const toDate = dateTo.value ? new Date(dateTo.value).getTime() + 86400000 : Infinity;

      let filtered = data.sortedData;

      // 公司筛选
      if (selectedCompany !== 'all') {
        filtered = data.companyMap[selectedCompany] || [];
      }


      // 搜索筛选
      filtered = filtered.filter(item => {
        const company = item.brandName?.toLowerCase() || '';
        const job = item.jobName?.toLowerCase() || '';
        return company.includes(searchTerm) || job.includes(searchTerm);
      });

      // 日期筛选
      filtered = filtered.filter(item => {
        const itemTime = new Date(item.happenTime).getTime();
        return itemTime >= fromDate && itemTime <= toDate;
      });

      updateDataContent(filtered);
    }
  }



  function renderDataItems(items) {
    return items.map(item => {
      if (!item.encryptJobId) return '';

      const jobLink = generateJobLink(item.encryptJobId);
      const logoUrl = item.brandLogo || 'https://www.zhipin.com/favicon.ico';
      const defaultLogo = 'https://www.zhipin.com/favicon.ico';

      return `
      <div class="zp-data-item">
        <div class="zp-data-item-header">
          <img class="zp-data-logo"
               src="${logoUrl}"
               alt="${item.brandName || '公司logo'}"
               onerror="this.src='${defaultLogo}'">
          <div class="zp-data-company-wrapper">
            <div class="zp-data-company" title="${item.brandName || '未知公司'}">
              ${item.brandName || '未知公司'}
            </div>
            <div class="zp-data-job">
              <span>${item.jobName || '未知岗位'}</span>
              <span class="zp-data-salary">${item.jobSalary || '薪资面议'}</span>
            </div>
          </div>
        </div>
        <div class="zp-data-meta">
          <span>${item.bossName || '未知'}</span>
          <span>${item.bossTitle || '未知职位'}</span>
          <span style="color: blue">${item.itemSource || ''}</>
        </div>
        <div class="zp-data-meta">
          <span>${item.scaleName || '未知'}</span>
          <span>${item.jobLabels[0] || '未知'}</span>
        </div>
        <div class="zp-data-time">${formatTime(item.happenTime)}</div>
        <a href="${jobLink}" target="_blank" class="zp-data-link">
          查看职位详情
        </a>
      </div>
    `;
    }).join('');
  }
  // 更新数据内容
  function updateDataContent(items) {
    const content = document.getElementById('data-content');
    if (content) {
      content.innerHTML = renderDataItems(items);
      // 更新计数
      const countElement = document.querySelector('.zp-data-count');
      if (countElement) {
        countElement.textContent = `(共 ${items.length} 条)`;
      }
    }
  }

// 处理按钮点击
  async function handleButtonClick() {
    try {
      // 如果有缓存且token存在，直接使用缓存
      if (cachedData && token && zp_token) {
        const processedData = processData(cachedData);
        showData(processedData);
        return;
      }

      // 尝试获取第一页数据测试token是否有效
      await fetchJobData(1);
      fetchAndDisplayData();
    } catch (error) {
      console.log('需要输入token:', error);
      showTokenModal();
    }
  }

// 初始化
  function init() {
    createButton();

    // 如果有缓存数据，直接显示
    if (cachedData && token && zp_token) {
      const processedData = processData(cachedData);
      showData(processedData);
    }
  }

// 页面加载完成后执行
  window.addEventListener('load', init);
})();
