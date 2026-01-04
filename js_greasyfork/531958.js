// ==UserScript==
// @name         FFLogs 添加精确百分位显示
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在FFLogs带phase参数的页面添加对应阶段的真实百分位列
// @author       The.D
// @match        https://cn.fflogs.com/reports/*
// @match        https://www.fflogs.com/reports/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      fflogs.com
// @connect      cn.fflogs.com
// @connect      www.fflogs.com
// @connect      raw.githubusercontent.com
// @license      MIT
// @homepage     https://github.com/The-D66/fflogs-phase-color-show
// @supportURL   https://github.com/The-D66/fflogs-phase-color-show/issues
// @downloadURL https://update.greasyfork.org/scripts/531958/FFLogs%20%E6%B7%BB%E5%8A%A0%E7%B2%BE%E7%A1%AE%E7%99%BE%E5%88%86%E4%BD%8D%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/531958/FFLogs%20%E6%B7%BB%E5%8A%A0%E7%B2%BE%E7%A1%AE%E7%99%BE%E5%88%86%E4%BD%8D%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加样式
  GM_addStyle(`
        .percentile-column {
            text-align: center;
        }
        .legendary {
            color: #ff8000 !important;
        }
        .mythic {
            color: #e268a8 !important;
        }
        .epic {
            color: #a335ee !important;
        }
        .rare {
            color: #0070ff !important;
        }
        .uncommon {
            color: #00ff96 !important;
        }
        .common {
            color: #9d9d9d !important;
        }
            
    `);

  // 职业类名对照表（CSS类名 -> 中英文名称）
  const JOB_SPECS = {
    // CSS类名 -> [中文名称, 英文名称]
    'Warrior': ['战士', 'Warrior'],
    'Paladin': ['骑士', 'Paladin'],
    'DarkKnight': ['暗黑骑士', 'Dark Knight'],
    'Gunbreaker': ['绝枪战士', 'Gunbreaker'],
    'WhiteMage': ['白魔法师', 'White Mage'],
    'Scholar': ['学者', 'Scholar'],
    'Astrologian': ['占星术士', 'Astrologian'],
    'Sage': ['贤者', 'Sage'],
    'Monk': ['武僧', 'Monk'],
    'Dragoon': ['龙骑士', 'Dragoon'],
    'Ninja': ['忍者', 'Ninja'],
    'Samurai': ['武士', 'Samurai'],
    'Reaper': ['钐镰客', 'Reaper'],
    'Bard': ['吟游诗人', 'Bard'],
    'Machinist': ['机工士', 'Machinist'],
    'Dancer': ['舞者', 'Dancer'],
    'BlackMage': ['黑魔法师', 'Black Mage'],
    'Summoner': ['召唤师', 'Summoner'],
    'RedMage': ['赤魔法师', 'Red Mage'],
    'Pictomancer': ['绘灵法师', 'Pictomancer'],
    'Viper': ['蝰蛇剑士', 'Viper'],
    'LimitBreak': ['极限技', 'Limit Break']
  };

  // 默认DPS值 - 用于无法获取数据时的备用值
  const DEFAULT_DPS_VALUES = {

  };

  // 反向映射：中文名称 -> CSS类名
  const CN_TO_CLASS = {};
  // 反向映射：英文名称 -> CSS类名
  const EN_TO_CLASS = {};

  // 标准化文本（转小写并移除空格）
  function normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, '');
  }

  // 构建反向映射
  Object.entries(JOB_SPECS).forEach(([cssClass, [cnName, enName]]) => {
    // 标准名称
    CN_TO_CLASS[cnName] = cssClass;
    EN_TO_CLASS[enName] = cssClass;

    // 标准化的名称（小写且无空格）
    const normalizedCN = normalizeText(cnName);
    const normalizedEN = normalizeText(enName);

    // 添加标准化后的名称映射
    if (normalizedCN !== cnName) {
      CN_TO_CLASS[normalizedCN] = cssClass;
    }
    if (normalizedEN !== enName) {
      EN_TO_CLASS[normalizedEN] = cssClass;
    }

    // 处理空格问题，同时支持带空格和不带空格的英文职业名
    const noSpaceEnName = enName.replace(/\s+/g, '');
    if (noSpaceEnName !== enName) {
      EN_TO_CLASS[noSpaceEnName] = cssClass;
    }
  });

  // 百分位数据缓存
  const percentileCache = {};
  // CSV文件缓存
  const csvCache = {};
  // 缓存过期时间（毫秒）- 默认24小时
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

  // 初始化缓存
  function initCache() {
    try {
      // 从localStorage加载CSV缓存
      const savedCsvCache = localStorage.getItem('fflogs_csv_cache');
      if (savedCsvCache) {
        const parsedCache = JSON.parse(savedCsvCache);
        // 检查缓存是否过期
        if (parsedCache.timestamp && (Date.now() - parsedCache.timestamp < CACHE_EXPIRY)) {
          Object.assign(csvCache, parsedCache.data);
          console.log('已从localStorage加载CSV缓存');
        } else {
          console.log('CSV缓存已过期，将重新获取');
        }
      }
    } catch (error) {
      console.error('加载CSV缓存失败:', error);
    }
  }

  // 保存缓存到localStorage
  function saveCache() {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: csvCache
      };
      localStorage.setItem('fflogs_csv_cache', JSON.stringify(cacheData));
      console.log('CSV缓存已保存到localStorage');
    } catch (error) {
      console.error('保存CSV缓存失败:', error);
    }
  }

  // 检查是否在带phase参数的页面上
  function isPhaseReport() {
    return window.location.href.includes('phase=') && window.location.href.includes('type=damage-done');
  }

  // 检查是否是伤害统计页面
  function isDamageDonePage() {
    return window.location.href.includes('type=damage-done');
  }

  // 解析URL获取关键信息
  function parseUrl() {
    const url = window.location.href;
    const reportMatch = url.match(/reports\/([^?]+)/);
    const fightMatch = url.match(/fight=(\d+)/);
    const phaseMatch = url.match(/phase=(\d+)/);

    // 判断域名
    const domain = url.includes('cn.fflogs.com') ? 'cn' : 'www';

    // 尝试从URL获取boss信息，默认为当前版本raid
    // 实际应用中可能需要根据副本名称动态确定
    const bossId = '1079'; // 默认为Fatebreaker/破命斗士
    const zoneId = '65';   // 默认为当前版本raid

    return {
      reportId: reportMatch ? reportMatch[1] : null,
      fightId: fightMatch ? fightMatch[1] : null,
      phaseId: phaseMatch ? phaseMatch[1] : null,
      bossId: bossId,
      zoneId: zoneId,
      domain: domain
    };
  }

  // 从页面提取bossId
  function extractBossId() {
    const bossIcon = document.getElementById('filter-fight-boss-icon');
    if (bossIcon && bossIcon.src) {
      const match = bossIcon.src.match(/(\d+)-icon\.jpg$/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }

  // 根据bossId获取CSV文件名前缀
  function getCsvPrefix(bossId) {
    if (bossId === '1079') {
      return 'eden7.1';
    } else if (bossId === '1077') {
      return 'omega7.1';
    }
    // 默认返回eden7.1
    return 'eden7.1';
  }

  // 获取职业百分位数据
  async function fetchJobPercentileStats(jobClass, phaseId) {
    const cacheKey = `${jobClass}_${phaseId}`;
    if (percentileCache[cacheKey]) {
      return percentileCache[cacheKey];
    }

    const phaseNumber = phaseId || '1';
    const bossId = extractBossId();
    const csvPrefix = getCsvPrefix(bossId);
    const csvUrl = `https://raw.githubusercontent.com/ITX351/fflogs_phase_ranker/refs/heads/main/public/data/${csvPrefix}p${phaseNumber}.csv`;
    console.log('请求CSV数据:', csvUrl);

    try {
      // 检查CSV缓存
      if (csvCache[csvUrl]) {
        console.log('使用缓存的CSV数据');
        const dpsValues = parseCSVData(csvCache[csvUrl], jobClass);
        percentileCache[cacheKey] = dpsValues;
        return dpsValues;
      }

      // 使用GM_xmlhttpRequest替代fetch
      const csvText = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: csvUrl,
          onload: function (response) {
            if (response.status === 200) {
              resolve(response.responseText);
            } else {
              reject(new Error(`HTTP error! status: ${response.status}`));
            }
          },
          onerror: function (error) {
            reject(error);
          }
        });
      });

      // 保存到CSV缓存
      csvCache[csvUrl] = csvText;
      // 保存缓存到localStorage
      saveCache();

      const dpsValues = parseCSVData(csvText, jobClass);
      percentileCache[cacheKey] = dpsValues;
      return dpsValues;
    } catch (error) {
      console.error('获取CSV数据失败:', error);
      return null;
    }
  }

  // 解析CSV数据
  function parseCSVData(csvText, jobClass) {
    try {
      // 将CSV文本分割成行
      const lines = csvText.split('\n');
      if (lines.length < 2) {
        console.warn('CSV数据格式不正确');
        return null;
      }

      // 解析表头获取百分位点
      const headerLine = lines[0];
      const headers = headerLine.split(',');
      const percentilePoints = headers.slice(1).map(h => parseInt(h, 10));

      // 查找职业行
      let jobRow = null;
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const columns = line.split(',');
        if (columns.length > 0) {
          const rowJobClass = columns[0].trim();

          // 检查是否匹配职业
          if (rowJobClass === jobClass) {
            jobRow = columns;
            break;
          }

          // 检查中英文名称
          const jobInfo = JOB_SPECS[jobClass];
          if (jobInfo) {
            const [cnName, enName] = jobInfo;
            if (rowJobClass === cnName || rowJobClass === enName) {
              jobRow = columns;
              break;
            }
          }
        }
      }

      if (!jobRow) {
        console.warn(`在CSV中未找到职业 ${jobClass}`);
        return null;
      }

      // 提取各百分位的DPS值
      const results = {};
      for (let i = 0; i < percentilePoints.length; i++) {
        const percentile = percentilePoints[i];
        const dpsValue = parseFloat(jobRow[i + 1]);
        if (!isNaN(dpsValue)) {
          results[percentile] = dpsValue;
        }
      }

      return results;
    } catch (error) {
      console.error('解析CSV数据出错:', error);
      return null;
    }
  }

  // 获取页面内容
  function fetchPage(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        timeout: 10000, // 设置10秒超时
        onload: function (response) {
          if (response.status === 200) {
            resolve(response.responseText);
          } else {
            reject(`请求失败: ${response.status}`);
          }
        },
        onerror: function (error) {
          reject(error);
        },
        ontimeout: function () {
          reject('请求超时');
        }
      });
    });
  }

  // 根据DPS计算百分位
  function calculatePercentile(rdps, percentileData) {
    if (!percentileData || Object.keys(percentileData).length === 0) {
      return '-';
    }

    // 获取所有百分位点并排序
    const percentiles = Object.keys(percentileData)
      .map(Number)
      .sort((a, b) => b - a);

    // 如果高于最高百分位
    if (rdps >= percentileData[percentiles[0]]) {
      return 99; // 默认为最高的已知百分位
    }

    // 如果低于最低百分位
    if (rdps < percentileData[percentiles[percentiles.length - 1]]) {
      return Math.floor(percentiles[percentiles.length - 1] / 2); // 默认为最低已知百分位的一半
    }

    // 查找合适的区间并插值
    for (let i = 0; i < percentiles.length - 1; i++) {
      const higher = percentiles[i];
      const lower = percentiles[i + 1];

      if (rdps >= percentileData[lower] && rdps < percentileData[higher]) {
        // 线性插值计算更精确的百分位
        const ratio = (rdps - percentileData[lower]) /
          (percentileData[higher] - percentileData[lower]);
        return Math.round(lower + ratio * (higher - lower));
      }
    }

    return 50; // 默认值
  }

  // 从表格行获取RDPS值
  function getRDPS(row) {
    const rdpsCell = row.querySelector('.rdps');
    if (!rdpsCell) return null;

    // 提取数字并移除非数字字符
    const rdpsText = rdpsCell.textContent.trim();
    const rdps = parseFloat(rdpsText.replace(/,/g, ''));
    return isNaN(rdps) ? null : rdps;
  }

  // 检查是否有source参数
  function hasSourceParam() {
    return /source=\d+/.test(window.location.href);
  }

  // 处理表格更新
  function handleTableUpdate() {
    // 查找所有行
    const rows = document.querySelectorAll('tr[id^="main-table-row-"]');

    // 检查是否需要添加百分位列
    const needsPercentileColumn = rows.length > 0 && !document.querySelector('.percentile-column');

    // 检查是否有百分位列但内容为空
    const hasEmptyPercentileCells = document.querySelectorAll('.percentile-column span:empty').length > 0;

    // 检查是否有百分位列但显示"加载中..."
    const hasLoadingCells = Array.from(document.querySelectorAll('.percentile-column span')).some(
      span => span.textContent === '加载中...'
    );

    // 检查是否在非phase页面但存在百分位列
    const isNonPhasePage = !isPhaseReport();
    const hasPercentileColumn = document.querySelector('.percentile-column') !== null;

    // 检查是否在非伤害统计页面
    const isNonDamagePage = !isDamageDonePage();

    // 检查URL是否包含source参数
    const hasSource = hasSourceParam();

    // 如果在非phase页面但存在百分位列，或者不在伤害统计页面，或者URL包含source参数，则移除所有百分位列
    if ((isNonPhasePage && hasPercentileColumn) || isNonDamagePage || hasSource) {
      console.log('检测到非phase页面或非伤害统计页面或URL包含source参数，移除所有百分位列');
      removePercentileColumns();
      return;
    }

    // 如果有行但没有百分位列，或者有空的百分位单元格，或者有加载中的单元格
    if (needsPercentileColumn || hasEmptyPercentileCells || hasLoadingCells) {
      console.log('检测到表格需要更新，重新添加百分位列');
      addPercentileColumn();
    }
  }

  // 移除所有百分位列
  function removePercentileColumns() {
    const percentileColumns = document.querySelectorAll('.percentile-column');
    percentileColumns.forEach(column => {
      column.remove();
    });
  }

  // 添加百分位列
  async function addPercentileColumn() {
    // 等待表格加载完成
    await waitForElement('tr[id^="main-table-row-"]');

    const reportInfo = parseUrl();

    // 查找所有行
    const rows = document.querySelectorAll('tr[id^="main-table-row-"]');

    // 添加表头
    const tableElement = document.querySelector('table.summary-table');
    if (tableElement) {
      // 查找表头行
      const headerRow = tableElement.querySelector('thead tr');
      if (headerRow && !headerRow.querySelector('.percentile-column')) {
        // 创建表头单元格
        const headerCell = document.createElement('th');
        headerCell.className = 'percentile-column all sorting ui-state-default';
        headerCell.setAttribute('tabindex', '0');
        headerCell.setAttribute('aria-label', 'Parse %: activate to sort column ascending');

        // 创建内部HTML结构
        const wrapper = document.createElement('div');
        wrapper.className = 'DataTables_sort_wrapper';
        wrapper.textContent = 'Parse %';

        const sortIcon = document.createElement('span');
        sortIcon.className = 'DataTables_sort_icon css_right ui-icon ui-icon-caret-2-n-s';
        wrapper.appendChild(sortIcon);

        headerCell.appendChild(wrapper);

        // 插入到第一个位置
        headerRow.insertBefore(headerCell, headerRow.firstChild);

        console.log('已添加百分位表头');
      }
    }

    // 存储所有获取百分位的promise
    const promises = [];

    // 首先创建所有单元格，避免重排
    for (const row of rows) {
      // 跳过已处理的行
      if (row.querySelector('.percentile-column')) {
        continue;
      }

      // 创建百分位单元格（初始为空）
      const cell = document.createElement('td');
      cell.className = 'main-table-performance rank percentile-column';
      cell.innerHTML = '<span>加载中...</span>';

      // 插入单元格
      const firstCell = row.querySelector('td');
      if (firstCell) {
        row.insertBefore(cell, firstCell);
      }

      // 获取职业名称
      const jobClassElement = row.querySelector('.main-table-link a');
      if (!jobClassElement) continue;

      // 提取职业名称
      const jobClass = jobClassElement.className.trim();

      // 获取rdps值
      const rdps = getRDPS(row);
      if (rdps === null) {
        // 无RDPS数据，显示-
        updatePercentileCell(cell, '-');
        continue;
      }

      // 极限技特殊处理
      if (jobClass === 'LimitBreak') {
        updatePercentileCell(cell, '-');
        continue;
      }

      // 创建一个Promise来处理百分位计算
      const promise = (async () => {
        try {
          // 获取该职业在这个阶段的百分位统计数据
          const percentileData = await fetchJobPercentileStats(
            jobClass,
            reportInfo.phaseId
          );

          // 计算百分位
          const percentile = calculatePercentile(rdps, percentileData);

          // 更新单元格
          updatePercentileCell(cell, percentile);
        } catch (error) {
          console.error(`获取/计算百分位失败:`, error);
          updatePercentileCell(cell, '错误');
        }
      })();

      promises.push(promise);
    }

    // 等待所有百分位计算完成
    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('百分位计算出错:', error);
    }
  }

  // 更新百分位单元格
  function updatePercentileCell(cell, percentile) {
    // 创建链接元素
    const link = document.createElement('a');

    if (percentile === '加载中...' || percentile === '错误') {
      link.textContent = percentile;
    } else {
      link.className = getColorClass(percentile);
      link.textContent = percentile;
    }

    // 清空单元格并添加链接
    cell.innerHTML = '';
    cell.appendChild(link);
  }

  // 根据百分位值获取颜色类
  function getColorClass(percentile) {
    if (percentile === '-') return '';
    const numPercentile = parseInt(percentile, 10);
    if (numPercentile >= 99) return 'legendary';
    if (numPercentile >= 95) return 'mythic';
    if (numPercentile >= 75) return 'epic';
    if (numPercentile >= 50) return 'rare';
    if (numPercentile >= 25) return 'uncommon';
    return 'common';
  }

  // 等待元素加载
  function waitForElement(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve();
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // 设置超时
      setTimeout(() => {
        observer.disconnect();
        resolve();
      }, 10000);
    });
  }

  // 处理phase报告页面
  async function processPhaseReport() {
    console.log('FFLogs百分位显示脚本已加载');

    // 等待页面完全加载
    await new Promise(r => setTimeout(r, 2000));

    // 设置定期检查
    setInterval(() => {
      handleTableUpdate();
    }, 5000); // 每5秒检查一次

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
      // 检查是否有表格相关的变化
      const tableChanged = mutations.some(mutation => {
        // 检查目标元素是否是表格容器或其子元素
        const isTableContainer = mutation.target.id === 'main-table-container';
        const isTableChild = mutation.target.closest('#main-table-container');

        // 检查是否有节点添加或删除
        const hasNodeChanges = mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;

        return (isTableContainer || isTableChild) && hasNodeChanges;
      });

      if (tableChanged) {
        console.log('检测到表格变化，准备更新');
        // 使用setTimeout延迟处理，避免频繁更新
        setTimeout(() => {
          handleTableUpdate();
        }, 500);
      }
    });

    // 观察整个文档
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 首次尝试添加百分位列
    addPercentileColumn();
  }

  // 初始化
  function init() {
    // 初始化缓存
    initCache();

    // 检查是否在带phase参数的页面上
    if (isPhaseReport()) {
      console.log('检测到phase报告页面，开始处理...');
      processPhaseReport();
    }
  }

  // 启动脚本
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();