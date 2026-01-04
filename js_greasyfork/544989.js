// ==UserScript==
// @name         Everyday Profit Fullscreen Enhanced
// @namespace    http://tampermonkey.net/
// @version      2025.08.08.2
// @description  记录每日净资产，显示今日盈亏，手机支持点击📊全屏看历史曲线（兼容iOS/Gear）
// @author       VictoryWinWinWin + ChatGPT
// @match        https://www.milkywayidle.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544989/Everyday%20Profit%20Fullscreen%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/544989/Everyday%20Profit%20Fullscreen%20Enhanced.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    #deltaNetworthChartModal {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: #1e1e1e;
      z-index: 99999;
      flex-direction: column;
      color: white;
    }
    #deltaNetworthChartHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #007aff;
      padding: 10px 15px;
      font-weight: bold;
      font-size: 18px;
    }
    #deltaNetworthChartClose {
      cursor: pointer;
      font-size: 22px;
      user-select: none;
    }
    #netWorthChartBody {
      flex: 1;
      padding: 10px;
      position: relative;
    }
    #netWorthChart {
      width: 100% !important;
      height: 100% !important;
    }
    #deltaNetworthDiv {
      text-align: left;
      color: #fff;
      font-size: 20px;
      margin: 10px 0;
    }
    #deltaNetworthDiv span {
      vertical-align: middle;
    }
    #showHistoryIcon {
      cursor: pointer;
      margin-left: 8px;
      font-size: 18px;
      user-select: none;
    }
  `);

  // 解析带单位数字字符串转数字
  function parseFormattedNumber(str) {
    const cleanStr = str.replace(/[^\d.,-]/g, '').replace(',', '.');
    const num = parseFloat(cleanStr);
    if (isNaN(num)) return 0;
    if (str.match(/[Bb]/)) return num * 1e9;
    if (str.match(/[Mm]/)) return num * 1e6;
    if (str.match(/[Kk]/)) return num * 1e3;
    return num;
  }

  // 格式化大数字带单位
  function formatLargeNumber(num) {
    const abs = Math.abs(num);
    if (abs >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  }

  class DailyDataStore {
    constructor(storageKey = 'kbd_calc_data', maxDays = 30, currentRole = 'default') {
      this.storageKey = storageKey;
      this.maxDays = maxDays;
      this.currentRole = currentRole;
      this.data = this.loadFromStorage();
    }
    setRole(roleId) {
      this.currentRole = roleId;
    }
    getRoleData() {
      if (!this.data[this.currentRole]) this.data[this.currentRole] = {};
      return this.data[this.currentRole];
    }
    getTodayKey() {
      const now = new Date();
      const utcPlus8 = new Date(now.getTime() + 8 * 3600000);
      return utcPlus8.toISOString().split('T')[0];
    }
    getYesterdayKey() {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 3600000);
      const utcPlus8 = new Date(yesterday.getTime() + 8 * 3600000);
      return utcPlus8.toISOString().split('T')[0];
    }
    loadFromStorage() {
      const raw = localStorage.getItem(this.storageKey);
      try {
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    }
    saveToStorage() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }
    setTodayValue(value) {
      const roleData = this.getRoleData();
      const today = this.getTodayKey();
      roleData[today] = value;
      this.cleanupOldData();
      this.saveToStorage();
    }
    cleanupOldData() {
      const roleData = this.getRoleData();
      const keys = Object.keys(roleData).sort();
      const today = this.getTodayKey();
      const indexToday = keys.indexOf(today);
      if (indexToday !== -1) {
        const startIdx = Math.max(0, indexToday - this.maxDays + 1);
        const newKeys = keys.slice(startIdx, indexToday + 1);
        const newData = {};
        newKeys.forEach(k => { newData[k] = roleData[k]; });
        this.data[this.currentRole] = newData;
      }
    }
    getTodayDelta() {
      const roleData = this.getRoleData();
      const todayKey = this.getTodayKey();
      const yesterdayKey = this.getYesterdayKey();
      const todayValue = roleData[todayKey] || 0;
      const yesterdayValue = roleData[yesterdayKey] || 0;
      return todayValue - yesterdayValue;
    }
    getHistoryData() {
      const roleData = this.getRoleData();
      const sorted = Object.entries(roleData).sort(([a], [b]) => new Date(a) - new Date(b));
      const labels = sorted.map(([d]) => d);
      const values = sorted.map(([, v]) => v);
      return { labels, values };
    }
  }

  // 创建弹窗DOM
  function createModal() {
    if (document.getElementById('deltaNetworthChartModal')) return;
    const modal = document.createElement('div');
    modal.id = 'deltaNetworthChartModal';
    modal.style.display = 'none';
    modal.style.flexDirection = 'column';
    modal.innerHTML = `
      <div id="deltaNetworthChartHeader">
        <span>净资产历史曲线</span>
        <span id="deltaNetworthChartClose" title="关闭弹窗">✖</span>
      </div>
      <div id="netWorthChartBody">
        <canvas id="netWorthChart"></canvas>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('deltaNetworthChartClose').onclick = () => {
      modal.style.display = 'none';
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    };
  }

  let chartInstance = null;
  function renderChart(labels, values) {
    const ctx = document.getElementById('netWorthChart').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: '净资产历史',
          data: values,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: ctx => formatLargeNumber(ctx.raw)
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: val => formatLargeNumber(val)
            }
          }
        }
      }
    });
  }

  function showModal() {
    const modal = document.getElementById('deltaNetworthChartModal');
    modal.style.display = 'flex';
  }

  // 更新盈亏显示及事件绑定
  function updateDeltaDisplay(store, totalNetworth) {
    let insertDom = document.getElementById('netWorthDetails');
    if (!insertDom) {
      insertDom = document.querySelector('.NetWorthContainer') || document.body;
    }
    if (!insertDom) return;

    store.setTodayValue(totalNetworth);
    const delta = store.getTodayDelta();
    const formattedDelta = formatLargeNumber(delta);
    const color = delta > 0 ? 'green' : (delta < 0 ? 'red' : 'gray');

    let deltaDom = document.getElementById('deltaNetworthDiv');
    if (!deltaDom) {
      insertDom.insertAdjacentHTML('afterend', `
        <div id="deltaNetworthDiv" style="text-align:left;color:#fff;font-size:20px;margin:10px 0;">
          <span style="font-weight:bold;">💰今日盈亏: </span>
          <span style="color:${color};font-weight:bold;">${formattedDelta}</span>
          <span id="showHistoryIcon" style="cursor:pointer; margin-left:8px; font-size:18px;" title="查看历史曲线">📊</span>
        </div>
      `);
      deltaDom = document.getElementById('deltaNetworthDiv');
      document.getElementById('showHistoryIcon').onclick = () => {
        const { labels, values } = store.getHistoryData();
        showModal();
        renderChart(labels, values);
      };
    } else {
      deltaDom.innerHTML = `
        <span style="font-weight:bold;">💰今日盈亏: </span>
        <span style="color:${color};font-weight:bold;">${formattedDelta}</span>
        <span id="showHistoryIcon" style="cursor:pointer; margin-left:8px; font-size:18px;" title="查看历史曲线">📊</span>
      `;
      document.getElementById('showHistoryIcon').onclick = () => {
        const { labels, values } = store.getHistoryData();
        showModal();
        renderChart(labels, values);
      };
    }
  }

  // 监听净资产数字变化，自动更新盈亏
  function observeNetworthChanges() {
    const target = document.querySelector('#toggleNetWorth');
    if (!target) return;

    const store = new DailyDataStore();

    let username = 'defaultUser';
    const divElement = document.querySelector('.CharacterName_name__1amXp');
    if (divElement && divElement.querySelector('span')) {
      username = divElement.querySelector('span').textContent.trim();
    }
    store.setRole(username);

    const updateFunc = () => {
      const textContent = target.textContent.trim();
      if (!textContent) return;
      const totalNetworth = parseFormattedNumber(textContent);
      if (!totalNetworth) return;
      updateDeltaDisplay(store, totalNetworth);
    };
    updateFunc();

    const observer = new MutationObserver(() => {
      updateFunc();
    });
    observer.observe(target, { childList: true, characterData: true, subtree: true });
  }

  // 动态加载 Chart.js
  function loadChartJs(callback) {
    if (window.Chart) {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  // 初始化函数，页面加载后运行
  function init() {
    createModal();
    loadChartJs(() => {
      observeNetworthChanges();
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 1000);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(init, 1000);
    });
  }
})();
