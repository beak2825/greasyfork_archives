// ==UserScript==
// @name         xin人xin事
// @namespace    http://tampermonkey.net/
// @version      0.1.16
// @description  获取今天之前的工时，可以准确计算年假、外出、出差和周末加班的时间，可以选择数据导出。修复了Cookie动态更换导致的数据获取问题。新增网络请求拦截功能，自动获取最新的Cookie。优化请求头以匹配真实网站请求，添加CSRF令牌支持。使用预数据请求URL获取初始Cookie，提高成功率。
// @author       You
// @match        https://s.xinrenxinshi.com/staff/home*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xinrenxinshi.com
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519031/xin%E4%BA%BAxin%E4%BA%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519031/xin%E4%BA%BAxin%E4%BA%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 初始化全局Cookie变量
  let globalCookies = '';
  let interceptedCookies = '';
  let hasInterceptedValidCookies = false;
  let csrfToken = '';
  let ssoToken = '';

  // 初始化函数，获取当前页面的Cookie
  function initializeCookies() {
    globalCookies = document.cookie;

    // 检查是否有必要的Cookie
    if (!globalCookies || globalCookies.indexOf('QJYDSID') === -1) {
      GM_log('⚠️ 警告：未检测到QJYDSID Cookie，可能需要先登录系统');
    }

    // 设置网络请求拦截
    setupNetworkInterception();

    // 尝试从URL中提取ssotoken
    extractSSOToken();

    // 尝试从页面中提取CSRF令牌
    extractCSRFToken();

    // 使用预数据请求获取初始Cookie和CSRF Token
    fetchInitialData();
  }

  // 从URL中提取ssotoken
  function extractSSOToken() {
    try {
      // 从当前URL中提取ssotoken
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('ssotoken');
      if (tokenFromUrl) {
        ssoToken = tokenFromUrl;
        GM_log('✅ [SSO] 从URL参数提取到ssotoken，长度:', ssoToken.length);
        return;
      }

      // 从Referer中提取ssotoken
      const refererMatch = window.location.href.match(/ssotoken=([^&]+)/);
      if (refererMatch && refererMatch[1]) {
        ssoToken = refererMatch[1];
        GM_log('✅ [SSO] 从href匹配提取到ssotoken，长度:', ssoToken.length);
        return;
      }

      GM_log('⚠️ [SSO] 未能从URL中提取到ssotoken');
    } catch (e) {
      GM_log('❌ 提取ssotoken时出错:', e);
    }
  }

  // 使用预数据请求获取初始Cookie
  function fetchInitialData() {
    if (!ssoToken) {
      return;
    }

    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://s.xinrenxinshi.com/support/service/storm/ajax-get-predata-v2?ssotoken=${ssoToken}`,
      headers: {
        "Accept": "*/*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "DNT": "1",
        "Pragma": "no-cache",
        "Referer": `https://s.xinrenxinshi.com/staff/home?ssotoken=${ssoToken}`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": navigator.userAgent,
        "X-CSRF-TOKEN": "",
        "Xrxs-Language": "zh",
        "Xrxs-Timezone": "+08:00",
        "sec-ch-ua": '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"'
      },
      onload: function(res) {
        GM_log('🔍 [预数据] 响应状态:', res.status);

        // 🔥 打印完整响应头以便调试
        if (res.responseHeaders) {
          GM_log('🔍 [预数据] 响应头内容:', res.responseHeaders.substring(0, 1000));
        } else {
          GM_log('⚠️ [预数据] 无响应头');
        }

        // 🔥 打印响应体
        if (res.response) {
          GM_log('🔍 [预数据] 响应体:', JSON.stringify(res.response).substring(0, 500));
        } else if (res.responseText) {
          GM_log('🔍 [预数据] responseText:', res.responseText.substring(0, 500));
        }

        // 从响应头中提取新Cookie
        const newCookies = extractCookiesFromHeaders(res.responseHeaders);
        if (newCookies && newCookies.includes('QJYDSID')) {
          globalCookies = newCookies;
          GM_log('✅ [预数据] 成功获取Cookie');
        }

        // 尝试从响应中提取CSRF Token
        try {
          if (res.responseHeaders) {
            const headers = res.responseHeaders.toLowerCase();
            if (headers.includes('x-csrf-token')) {
              const match = res.responseHeaders.match(/x-csrf-token:\s*([^\r\n]+)/i);
              if (match && match[1]) {
                csrfToken = match[1].trim();
                GM_log('✅ [预数据] 成功获取CSRF Token:', csrfToken.substring(0, 20) + '...');
              } else {
                GM_log('⚠️ [预数据] 响应头包含x-csrf-token但未能提取值');
              }
            } else {
              GM_log('⚠️ [预数据] 响应头中不包含x-csrf-token');
            }
          }

          // 🔥 尝试从响应体中提取CSRF Token
          GM_log('🔍 [预数据] res.response存在:', !!res.response);
          GM_log('🔍 [预数据] res.response.data存在:', !!(res.response && res.response.data));

          if (res.response && res.response.data) {
            GM_log('🔍 [预数据] data中所有key:', Object.keys(res.response.data));
            if (res.response.data.csrfToken) {
              csrfToken = res.response.data.csrfToken;
              GM_log('✅ [预数据] 从响应体data中获取CSRF Token:', csrfToken.substring(0, 20) + '...');
            } else {
              GM_log('⚠️ [预数据] data中没有csrfToken字段');
            }
          }

          // 尝试从responseText解析
          if (!csrfToken && res.responseText) {
            try {
              const parsedData = JSON.parse(res.responseText);
              if (parsedData.data && parsedData.data.csrfToken) {
                csrfToken = parsedData.data.csrfToken;
                GM_log('✅ [预数据] 从responseText解析获取CSRF Token:', csrfToken.substring(0, 20) + '...');
              }
            } catch (e) {
              GM_log('⚠️ [预数据] responseText解析失败');
            }
          }
        } catch (e) {
          GM_log('❌ [预数据] 提取CSRF Token失败:', e);
        }
      },
      onerror: function(err) {
        GM_log('❌ 预数据请求失败:', err);
      }
    });
  }

  // 生成 Sentry 追踪头
  function generateSentryTrace() {
    // 生成 32 位 trace_id
    const traceId = Array.from({length: 32}, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    // 生成 16 位 span_id
    const spanId = Array.from({length: 16}, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    // 格式: trace_id-span_id-sampled (0=不采样, 1=采样)
    return `${traceId}-${spanId}-0`;
  }

  // 从页面中提取CSRF令牌
  function extractCSRFToken() {
    try {
      // 尝试从meta标签中提取
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      if (metaTag && metaTag.getAttribute('content')) {
        csrfToken = metaTag.getAttribute('content');
        return;
      }

      // 尝试从全局变量中提取
      if (window.csrfToken) {
        csrfToken = window.csrfToken;
        return;
      }

      // 尝试从cookie中提取
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN' || name === 'csrf-token') {
          csrfToken = decodeURIComponent(value);
          return;
        }
      }

      // 尝试从localStorage中提取
      const localKeys = Object.keys(localStorage);
      for (const key of localKeys) {
        if (key.toLowerCase().includes('csrf') || key.toLowerCase().includes('token')) {
          const value = localStorage.getItem(key);
          if (value && typeof value === 'string' && value.length > 10 && value.length < 100) {
            csrfToken = value;
            return;
          }
        }
      }
    } catch (e) {
      GM_log('❌ 提取CSRF令牌时出错:', e);
    }
  }

  // 设置网络请求拦截
  function setupNetworkInterception() {
    // 保存原始的XMLHttpRequest和fetch
    const originalXHR = window.XMLHttpRequest;
    const originalFetch = window.fetch;

    // 拦截XMLHttpRequest
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      const originalSend = xhr.send;
      const originalSetRequestHeader = xhr.setRequestHeader;

      xhr.open = function(method, url, ...args) {
        this._method = method;
        this._url = url;
        return originalOpen.apply(this, [method, url, ...args]);
      };

      xhr.setRequestHeader = function(name, value) {
        if (!this._headers) this._headers = {};
        this._headers[name] = value;

        // 拦截CSRF令牌
        if (name.toLowerCase() === 'x-csrf-token') {
          csrfToken = value;
        }

        return originalSetRequestHeader.apply(this, arguments);
      };

      xhr.send = function(data) {
        const self = this;

        // 监听响应
        this.addEventListener('load', function() {
          try {
            // 检查是否是我们关心的API请求
            if (self._url && self._url.includes('xinrenxinshi.com')) {
              // 从响应头中获取Cookie
              const responseHeaders = self.getAllResponseHeaders();
              if (responseHeaders) {
                const cookies = extractCookiesFromHeaders(responseHeaders);
                if (cookies && cookies.includes('QJYDSID')) {
                  interceptedCookies = cookies;
                  hasInterceptedValidCookies = true;
                }
              }

              // 检查响应头中的CSRF Token
              if (responseHeaders && responseHeaders.toLowerCase().includes('x-csrf-token')) {
                const match = responseHeaders.match(/x-csrf-token:\s*([^\r\n]+)/i);
                if (match && match[1]) {
                  csrfToken = match[1].trim();
                }
              }
            }
          } catch (e) {
            // 忽略拦截错误
          }
        });

        return originalSend.apply(this, arguments);
      };

      return xhr;
    };

    // 拦截fetch请求
    window.fetch = function(url, options = {}) {
      // 拦截CSRF令牌
      if (options && options.headers) {
        if (options.headers['X-CSRF-TOKEN'] || options.headers['x-csrf-token']) {
          csrfToken = options.headers['X-CSRF-TOKEN'] || options.headers['x-csrf-token'];
        }
      }

      return originalFetch(url, options)
        .then(response => {
          try {
            // 检查是否是我们关心的API请求
            if (url && url.includes('xinrenxinshi.com')) {
              // 从响应头中获取Cookie
              const cookies = extractCookiesFromHeaders(response.headers);
              if (cookies && cookies.includes('QJYDSID')) {
                interceptedCookies = cookies;
                hasInterceptedValidCookies = true;
              }
            }
          } catch (e) {
            // 忽略拦截错误
          }

          return response;
        })
        .catch(error => {
          return Promise.reject(error);
        });
    };
  }

  // 从响应头中提取Cookie的函数
  function extractCookiesFromHeaders(responseHeaders) {
    if (!responseHeaders) return '';

    let cookieMap = new Map();

    // 处理不同类型的响应头格式
    if (typeof responseHeaders === 'string') {
      const headers = responseHeaders.split('\n');

      for (const header of headers) {
        const lowerHeader = header.trim().toLowerCase();
        if (lowerHeader.startsWith('set-cookie:')) {
          const colonIndex = header.indexOf(':');
          const cookieValue = header.substring(colonIndex + 1).trim();

          const match = cookieValue.match(/^([^=]+)=([^;]+)/);
          if (match) {
            const cookieName = match[1].trim();
            const cookieValue = match[2].trim();
            cookieMap.set(cookieName, cookieValue);
          }
        }
      }
    } else if (typeof responseHeaders === 'object') {
      try {
        const setCookieHeader = responseHeaders.get('set-cookie');
        if (setCookieHeader) {
          const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

          for (const cookie of cookies) {
            const match = cookie.match(/^([^=]+)=([^;]+)/);
            if (match) {
              const cookieName = match[1].trim();
              const cookieValue = match[2].trim();
              cookieMap.set(cookieName, cookieValue);
            }
          }
        }
      } catch (e) {
        // 忽略Headers对象处理错误
      }
    }

    return Array.from(cookieMap.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  // 构建完整的Cookie字符串
  function buildCompleteCookie(existingCookies) {
    let cookieMap = new Map();

    // 解析现有的Cookie
    if (existingCookies) {
      const cookiePairs = existingCookies.split(';');
      for (const pair of cookiePairs) {
        const [name, value] = pair.trim().split('=');
        if (name && value) {
          cookieMap.set(name, value);
        }
      }
    }

    // 如果有ssotoken，确保QJYDSID和WAVESSID使用ssotoken的值
    if (ssoToken) {
      cookieMap.set('QJYDSID', ssoToken);
      cookieMap.set('WAVESSID', ssoToken);
      GM_log('🔍 [Cookie] 使用ssotoken更新QJYDSID和WAVESSID');
    } else {
      GM_log('⚠️ [Cookie] ssotoken为空，无法更新QJYDSID和WAVESSID');
    }

    const finalCookie = Array.from(cookieMap.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');

    GM_log('🔍 [Cookie] 最终Cookie包含QJYDSID:', finalCookie.includes('QJYDSID'));
    GM_log('🔍 [Cookie] 最终Cookie包含WAVESSID:', finalCookie.includes('WAVESSID'));

    return finalCookie;
  }

  let script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.src = "https://momentjs.cn/downloads/moment.js";
  document.documentElement.appendChild(script);

  // 添加选择弹窗的HTML和样式
  function createDateSelector() {
    const selectorCard = document.createElement('div');
    selectorCard.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  padding: 20px;
  width: 300px;
  font-family: Arial, sans-serif;
  z-index: 9999;
`;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const selectorHTML = `
  <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
    <h3 style="margin: 0; color: #333; font-size: 18px;">选择查询日期</h3>
  </div>
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px;">年份:</label>
    <select id="yearSelect" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
      ${Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
        .map(year => `<option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>`)
        .join('')}
    </select>
  </div>
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px;">月份:</label>
    <select id="monthSelect" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
      ${Array.from({ length: 12 }, (_, i) => i + 1)
        .map(month => `<option value="${month}" ${month === currentMonth ? 'selected' : ''}>${month}月</option>`)
        .join('')}
    </select>
  </div>
  <div style="margin-bottom: 20px;">
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" id="exportJson" style="margin-right: 8px;">
      <span style="color: #666;">导出考勤数据到JSON文件</span>
    </label>
  </div>
  <div style="text-align: right;">
    <button id="startQuery" style="
      background: #1890ff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    ">开始查询</button>
  </div>
`;

    selectorCard.innerHTML = selectorHTML;
    document.body.appendChild(selectorCard);

    // 添加查询按钮事件
    document.getElementById('startQuery').addEventListener('click', () => {
      const targetYear = document.getElementById('yearSelect').value;
      const targetMonth = document.getElementById('monthSelect').value;
      const shouldExport = document.getElementById('exportJson').checked;
      document.body.removeChild(selectorCard);
      initQuery(parseInt(targetYear), parseInt(targetMonth), shouldExport);
    });
  }

  // 添加 loading 提示函数
  function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'queryLoading';
    loading.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  padding: 20px;
  text-align: center;
  z-index: 10000;
`;
    loading.innerHTML = `
  <div style="margin-bottom: 10px;">
    <div style="border: 3px solid #f3f3f3;
      border-radius: 50%;
      border-top: 3px solid #1890ff;
      width: 24px;
      height: 24px;
      margin: 0 auto;
      animation: spin 1s linear infinite;">
    </div>
  </div>
  <div style="color: #666;">正在计算考勤数据...</div>
`;

    // 添加旋转动画
    const style = document.createElement('style');
    style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
    document.head.appendChild(style);
    document.body.appendChild(loading);
  }

  // 初始化查询函数
  async function initQuery(targetYear, targetMonth, shouldExport) {
    showLoading();
    monthRecords = [];
    yearmo = '';
    startDate = 1;
    let currentMonth = targetMonth;
    if (currentMonth < 10) {
      currentMonth = '0' + currentMonth;
    }
    workDay = 0;
    yearmo = `${targetYear}${currentMonth}`;

    // 清除之前的月度缓存
    const monthCacheKey = `attendance_month_${yearmo}`;
    GM_setValue(monthCacheKey, null);

    window.shouldExportJson = shouldExport;

    // 等待CSRF Token
    await waitForCSRFToken(3000);

    getDateData();
  }

  // 添加显示结果的独立函数
  function displayResults(data) {
    const { totalTime, nowWorkDayNum, workDay, dailyRecords } = data;

    // 计算剩余工作日数
    const remainingWorkDays = workDay - nowWorkDayNum;

    // 目标平均工时数组
    const targetHours = [9, 9.5, 10, 10.5];

    // 计算目标工时信息
    let targetWorkHoursHTML = '';

    if (remainingWorkDays > 0) {
      targetWorkHoursHTML = `
    <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
      <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
        <h5 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">额外加班时间模拟：</h5>
        <div style="display: flex; align-items: center; gap: 8px;">
          <input type="number" id="extraOvertimeInput" placeholder="输入额外加班小时数"
                 style="flex: 1; padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;"
                 step="0.5" min="0" max="100">
          <button id="applyOvertimeBtn" style="
            background: #1890ff; color: white; border: none; padding: 4px 12px;
            border-radius: 4px; cursor: pointer; font-size: 13px;">确定</button>
          <button id="resetOvertimeBtn" style="
            background: #f0f0f0; color: #666; border: none; padding: 4px 12px;
            border-radius: 4px; cursor: pointer; font-size: 13px;">重置</button>
        </div>
      </div>
      <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">达到目标平均工时所需日均时间：</h4>
      <div class="target-hours-container" style="color: #666; font-size: 13px; line-height: 1.5;">`;

      targetHours.forEach(target => {
        const targetTotalMinutes = target * workDay * 60; // 目标总工作分钟数
        const remainingMinutes = targetTotalMinutes - totalTime; // 剩余需要的分钟数
        const dailyRequiredHours = remainingMinutes / remainingWorkDays / 60; // 每日需要的小时数

        let displayText = '';
        let textColor = '#666';

        if (remainingMinutes <= 0) {
          displayText = '已达到';
          textColor = '#52c41a';
        } else {
          displayText = `${dailyRequiredHours.toFixed(2)} 小时/天`;
          if (dailyRequiredHours > 12) {
            textColor = '#ff4d4f'; // 红色表示需要很长工作时间
          } else if (dailyRequiredHours > 10) {
            textColor = '#fa8c16'; // 橙色表示需要较长工作时间
          } else {
            textColor = '#1890ff'; // 蓝色表示正常工作时间
          }
        }

        targetWorkHoursHTML += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: ${textColor}; font-weight: bold;">${displayText}</span>
          <span>平均 ${target} 小时</span>
        </div>`;
      });

      targetWorkHoursHTML += `
      </div>
    </div>
    <div style="border-top: 1px solid #eee; margin-top: 12px; padding-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; color: #666; font-size: 13px;">
        <span>自定义日均工时：</span>
        <div style="display: flex; align-items: center; gap: 4px;">
          <input type="number" id="customDailyHours" placeholder="小时/天"
                 style="width: 80px; padding: 2px 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;"
                 step="0.1" min="0" max="24">
          <span style="font-size: 12px;">→</span>
          <span id="customAvgResult" style="color: #1890ff; font-weight: bold; font-size: 12px; min-width: 60px;">-</span>
        </div>
      </div>
    </div>`;
    } else {
      targetWorkHoursHTML = `
    <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
      <div style="color: #999; font-size: 13px; text-align: center; margin-bottom: 15px;">
        本月工作日已全部完成
      </div>
    </div>
    <div style="border-top: 1px solid #eee; margin-top: 12px; padding-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; color: #666; font-size: 13px;">
        <span>自定义日均工时：</span>
        <div style="display: flex; align-items: center; gap: 4px;">
          <input type="number" id="customDailyHours" placeholder="小时/天"
                 style="width: 80px; padding: 2px 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;"
                 step="0.1" min="0" max="24">
          <span style="font-size: 12px;">→</span>
          <span id="customAvgResult" style="color: #1890ff; font-weight: bold; font-size: 12px; min-width: 60px;">-</span>
        </div>
      </div>
    </div>`;
    }

    // 创建结果展示卡片
    const resultCard = document.createElement('div');
    resultCard.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  padding: 20px;
  width: 380px;
  font-family: Arial, sans-serif;
  z-index: 9999;
  max-height: 80vh;
  overflow-y: auto;
`;

    const resultHTML = `
  <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
    <h3 style="margin: 0; color: #333; font-size: 18px;">考勤统计结果</h3>
  </div>
  <div style="color: #666; font-size: 14px; line-height: 1.6;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <span>准确分钟数：</span>
      <span style="color: #1890ff; font-weight: bold;">${totalTime} 分</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <span>准确小时数：</span>
      <span style="color: #1890ff; font-weight: bold;">${(totalTime / 60).toFixed(2)} 小时</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <span>已上班天数：</span>
      <span style="color: #1890ff; font-weight: bold;">${nowWorkDayNum} 天</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <span>总工作日数：</span>
      <span style="color: #1890ff; font-weight: bold;">${workDay} 天</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <span>剩余工作日数：</span>
      <span style="color: #1890ff; font-weight: bold;">${remainingWorkDays} 天</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span>目前平均工时：</span>
      <span style="color: #1890ff; font-weight: bold;">${(totalTime / 60 / (nowWorkDayNum || 1)).toFixed(2)} 小时/天</span>
    </div>
  </div>
  ${targetWorkHoursHTML}
  <div style="text-align: right; margin-top: 15px;">
    <button id="closeResultCard" style="
      background: #f0f0f0;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      color: #666;
    ">关闭</button>
  </div>
`;

    resultCard.innerHTML = resultHTML;
    document.body.appendChild(resultCard);

    // 保存原始工时数据，用于重置功能
    let originalTotalTime = totalTime;
    // 当前生效的总工时（包含额外加班时间）
    let currentEffectiveTotalTime = totalTime;

    // 额外加班时间功能
    const extraOvertimeInput = document.getElementById('extraOvertimeInput');
    const applyOvertimeBtn = document.getElementById('applyOvertimeBtn');
    const resetOvertimeBtn = document.getElementById('resetOvertimeBtn');

    if (applyOvertimeBtn) {
      applyOvertimeBtn.addEventListener('click', () => {
        const extraHours = parseFloat(extraOvertimeInput.value) || 0;
        if (extraHours >= 0 && extraHours <= 100) {
          const extraMinutes = extraHours * 60;
          currentEffectiveTotalTime = originalTotalTime + extraMinutes;
          updateTargetWorkHours(currentEffectiveTotalTime);
          updateCustomDailyCalculation(); // 更新自定义日均工时计算
        } else {
          alert('请输入有效的加班小时数（0-100）');
        }
      });
    }

    if (resetOvertimeBtn) {
      resetOvertimeBtn.addEventListener('click', () => {
        extraOvertimeInput.value = '';
        currentEffectiveTotalTime = originalTotalTime;
        updateTargetWorkHours(originalTotalTime);
        updateCustomDailyCalculation(); // 更新自定义日均工时计算
      });
    }

    // 自定义日均工时功能
    const customDailyHours = document.getElementById('customDailyHours');
    const customAvgResult = document.getElementById('customAvgResult');

    // 更新自定义日均工时计算的函数
    function updateCustomDailyCalculation() {
      if (customDailyHours && customAvgResult) {
        const dailyHours = parseFloat(customDailyHours.value);
        if (dailyHours > 0 && dailyHours <= 24) {
          // 基于当前生效的总工时（包含额外加班）计算
          // 预计剩余总工时 = 自定义日均工时 × 剩余工作日
          const projectedRemainingMinutes = dailyHours * remainingWorkDays * 60;
          // 最终总工时 = 当前生效总工时 + 预计剩余总工时
          const finalTotalMinutes = currentEffectiveTotalTime + projectedRemainingMinutes;
          // 最终月平均工时 = 最终总工时 ÷ 总工作日数
          const finalAvgHours = finalTotalMinutes / 60 / workDay;
          customAvgResult.textContent = `${finalAvgHours.toFixed(2)}h/天`;
        } else {
          customAvgResult.textContent = '-';
        }
      }
    }

    if (customDailyHours) {
      customDailyHours.addEventListener('input', updateCustomDailyCalculation);
    }

    // 更新目标工时显示的函数
    function updateTargetWorkHours(newTotalTime) {
      const targetHoursContainer = document.querySelector('.target-hours-container');
      if (!targetHoursContainer) return;

      const targetHours = [9, 9.5, 10, 10.5];
      let updatedHTML = '';

      targetHours.forEach(target => {
        const targetTotalMinutes = target * workDay * 60;
        const remainingMinutes = targetTotalMinutes - newTotalTime;
        const dailyRequiredHours = remainingMinutes / remainingWorkDays / 60;

        let displayText = '';
        let textColor = '#666';

        if (remainingMinutes <= 0) {
          displayText = '已达到';
          textColor = '#52c41a';
        } else {
          displayText = `${dailyRequiredHours.toFixed(2)} 小时/天`;
          if (dailyRequiredHours > 12) {
            textColor = '#ff4d4f';
          } else if (dailyRequiredHours > 10) {
            textColor = '#fa8c16';
          } else {
            textColor = '#1890ff';
          }
        }

        updatedHTML += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: ${textColor}; font-weight: bold;">${displayText}</span>
          <span>平均 ${target} 小时</span>
        </div>`;
      });

      targetHoursContainer.innerHTML = updatedHTML;
    }

    document.getElementById('closeResultCard').addEventListener('click', () => {
      document.body.removeChild(resultCard);
    });

    // 处理JSON导出
    if (window.shouldExportJson && dailyRecords) {
      const jsonContent = JSON.stringify(dailyRecords, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `work_records_${yearmo}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  function getFullDays() {
    return new Date(yearmo.substring(0, 4), yearmo.substring(4, 6), 0).getDate();
  }

  let monthRecords = [];
  let yearmo = '';
  let startDate = 1;
  let workDay = 0;
  let totalTime = 0;
  let nowWorkDayNum = 0;
  let dailyRecords = [];

  // 新函数：处理新接口返回的所有天数据
  async function processAllDaysData(records) {
    const monthCacheKey = `attendance_month_${yearmo}`;

    // 初始化月度缓存数据
    let monthCache = {
      totalTime: 0,
      nowWorkDayNum: 0,
      workDay,
      dailyRecords: []
    };

    const today = moment().startOf('day');

    // 遍历所有记录并处理
    for (const record of records) {
      const { date, time, isWorkday, detailInfo, monthStatus } = record;

      // 跳过非当前月的数据
      if (monthStatus !== 0) continue;

      const recordDate = moment.unix(time).format('YYYYMMDD');
      const currentDate = moment.unix(time);

      // 今天以及后续的日期跳过
      if (date >= today.date()) {
        continue;
      }

      // 构建日期记录
      const dayRecord = {
        date: recordDate,
        clockIn: null,
        clockOut: null,
        workMinutes: 0,
        isWorkDay: !!isWorkday
      };

      // 处理有详细信息的记录或通过新API获取
      let processedSignTimeList = null;
      let processedStatusList = null;

      if (detailInfo) {
        // 使用已有的详细信息
        processedSignTimeList = detailInfo.signTimeList;
        processedStatusList = detailInfo.statusList;
      } else {
        // 对于没有详细信息的工作日，尝试从新API获取
        try {
          // 格式化日期为YYYYMMDD用于API调用
          const apiDate = recordDate;

          const singleDayData = await fetchSingleDayAttendance(apiDate);

          // 从单日API提取数据
          if (singleDayData) {
            processedSignTimeList = singleDayData.signTimeList || [];
            processedStatusList = singleDayData.statusList || [];
          }
        } catch (error) {
          GM_log(`⚠️ 获取日期 ${recordDate} 的数据失败`);
        }
      }

      // 正常打卡情况
      const clockInRecord = processedSignTimeList.find(item => item.clockAttribution === 1 && item.clockTime);
      const clockOutRecord = processedSignTimeList.find(item => item.clockAttribution === 2 && item.clockTime);
      dayRecord.clockIn = clockInRecord?.clockTime;
      dayRecord.clockOut = clockOutRecord?.clockTime;

      // 处理签到记录和状态
      if (processedSignTimeList && processedSignTimeList.length > 0) {
        // 检查是否是年假
        const record年假Day = processedStatusList?.find(m => m.statusName === '年假');

        if (record年假Day) {
          if (!record年假Day?.salaryDay || record年假Day.salaryDay != 1) {
            // 正常打卡情况
            const clockInRecord = processedSignTimeList.find(item => item.clockAttribution === 1 && item.clockTime);
            const clockOutRecord = processedSignTimeList.find(item => item.clockAttribution === 2 && item.clockTime);

            dayRecord.clockIn = clockInRecord?.clockTime || null;
            dayRecord.clockOut = clockOutRecord?.clockTime || null;
            dayRecord.workMinutes = 5 * 60//半天年假都是4个小时，但后续需要统一扣除中午午休时间，所以此处多加一个小时
          } else {
            // 整天年假情况
            dayRecord.clockIn = '09:00';
            dayRecord.clockOut = '18:00';
            dayRecord.workMinutes = 0;
          }
        }


        // 计算正常工作时间
        let todayTime = 0;
        if (dayRecord.clockIn && dayRecord.clockOut) {
          const dateStr = currentDate.format('YYYY-MM-DD');
          const start = moment(`${dateStr} ${dayRecord.clockIn}`);
          const end = moment(`${dateStr} ${dayRecord.clockOut}`);
          todayTime = end.diff(start, 'minutes');
        }


        // 检查是否是外出或出差
        const record外出Day = processedStatusList?.find(m => m.statusName === '外出');
        const record出差Day = processedStatusList?.find(m => m.statusName === '出差');

        if (record外出Day) {
          if (record外出Day.startTime && record外出Day.endTime) {
            dayRecord.workMinutes = moment.unix(record外出Day.endTime).diff(moment.unix(record外出Day.startTime), 'minutes');
            dayRecord.clockIn = moment.unix(record外出Day.startTime).format('HH:mm');
            dayRecord.clockOut = moment.unix(record外出Day.endTime).format('HH:mm');
          } else {
            dayRecord.workMinutes = 9 * 60;//整天外出正常8小时，后续统一扣除一个小时的中午午休时间，此处按照9小时计算
            dayRecord.clockIn = '09:00';
            dayRecord.clockOut = '18:00';
          }
        }

        if (record出差Day) {
          dayRecord.workMinutes = 9 * 60;//出差正常8小时，后续统一扣除一个小时的中午午休时间，此处按照9小时计算
          dayRecord.clockIn = '09:00';
          dayRecord.clockOut = '18:00';
        }

        // 工作日扣除午休时间
        if (isWorkday) {
          todayTime -= 60;
        }

        dayRecord.workMinutes += todayTime;
      }

      // 累加到月度统计
      monthCache.totalTime += dayRecord.workMinutes;
      if (isWorkday && currentDate.isBefore(today)) {
        monthCache.nowWorkDayNum++;
      }
      monthCache.dailyRecords.push(dayRecord);

      // 缓存单日数据
      const sendDate = String(date).padStart(2, '0');
      const dayCacheKey = `attendance_day_${yearmo}_${sendDate}`;
      const dayCacheData = {
        data: {
          dayRecord
        }
      };
      GM_setValue(dayCacheKey, dayCacheData);
    }

    // 保存月度缓存
    GM_setValue(monthCacheKey, monthCache);

    // 隐藏加载提示
    const loading = document.getElementById('queryLoading');
    if (loading) {
      document.body.removeChild(loading);
    }

    // 显示结果
    displayResults(monthCache);
  }



  // 获取单天考勤数据
  async function fetchSingleDayAttendance(date) {
    return new Promise((resolve, reject) => {
      // 优先使用拦截到的Cookie，其次是全局存储的Cookie，最后是document.cookie
      const baseCookies = hasInterceptedValidCookies ? interceptedCookies : (globalCookies || document.cookie);
      // 构建完整的Cookie，确保包含正确的QJYDSID和WAVESSID
      const cookies = buildCompleteCookie(baseCookies);

      // 获取当前页面的URL作为Referer
      const referer = window.location.href;

      // 生成 Sentry 追踪 ID
      const sentryTrace = generateSentryTrace();
      const traceId = sentryTrace.split('-')[0];

      const headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "DNT": "1",
        "Host": "s.xinrenxinshi.com",
        "Origin": "https://s.xinrenxinshi.com",
        "Pragma": "no-cache",
        "Referer": referer,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": navigator.userAgent,
        "X-CSRF-TOKEN": csrfToken || "y0kQJjlE0bx7bZzGLE5lJqzyXeuJLVD2",
        "Xrxs-Language": "zh",
        "Xrxs-Timezone": "+08:00",
        "baggage": `sentry-environment=none,sentry-transaction=home,sentry-public_key=b10e1ef4e17f425e8699509ad54658ec,sentry-trace_id=${traceId}`,
        "sentry-trace": sentryTrace,
        "sec-ch-ua": '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"'
      };

      GM_xmlhttpRequest({
        method: 'POST',
        headers: headers,
        cookie: cookies, // 添加Cookie
        responseType: 'json',
        url: "https://s.xinrenxinshi.com/employee-pc/service/attendancePC/ajax-get-attendance-record-by-date",
        data: "date=" + date + "&employee_id=&eid=",
        onerror: function (err) {
          GM_log('❌ 单日数据获取错误:', err);
          reject(err);
        },
        onload: function (res) {
          try {
            // 从响应头中提取新Cookie并更新全局Cookie
            const newCookies = extractCookiesFromHeaders(res.responseHeaders);
            if (newCookies) {
              globalCookies = newCookies;
            }

            // 尝试从不同位置获取响应数据
            let responseData;
            if (res.response) {
              responseData = res.response;
            } else if (res.responseText) {
              try {
                responseData = JSON.parse(res.responseText);
              } catch (e) {
                GM_log('❌ 解析单日响应数据失败');
                reject(new Error('无法解析单日响应数据'));
                return;
              }
            } else {
              GM_log('❌ 服务器没有返回单日数据');
              reject(new Error('服务器没有返回单日数据'));
              return;
            }

            resolve(responseData.data);
          } catch (error) {
            GM_log('❌ 处理单日响应数据出错:', error);
            reject(error);
          }
        }
      });
    });
  }

  // 等待CSRF Token的函数
  async function waitForCSRFToken(maxWaitTime = 5000) {
    const startTime = Date.now();

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (csrfToken) {
          clearInterval(checkInterval);
          resolve(true);
        } else if (Date.now() - startTime > maxWaitTime) {
          clearInterval(checkInterval);
          resolve(false);
        }
      }, 100);
    });
  }

  function getDateData() {
    // 优先使用拦截到的Cookie，其次是全局存储的Cookie，最后是document.cookie
    const baseCookies = hasInterceptedValidCookies ? interceptedCookies : (globalCookies || document.cookie);
    // 构建完整的Cookie，确保包含正确的QJYDSID和WAVESSID
    const cookies = buildCompleteCookie(baseCookies);

    GM_log('🔍 [主请求] ssotoken:', ssoToken ? ssoToken.substring(0, 20) + '...' : '未获取');
    GM_log('🔍 [主请求] Cookie前50字符:', cookies.substring(0, 50) + '...');
    GM_log('🔍 [主请求] CSRF Token:', csrfToken ? csrfToken.substring(0, 30) + '...' : '未获取');

    // 获取当前页面的URL作为Referer
    const referer = window.location.href;

    // 生成 Sentry 追踪 ID
    const sentryTrace = generateSentryTrace();
    const traceId = sentryTrace.split('-')[0];

    const headers = {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "DNT": "1",
      "Host": "s.xinrenxinshi.com",
      "Origin": "https://s.xinrenxinshi.com",
      "Pragma": "no-cache",
      "Referer": referer,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": navigator.userAgent,
      "X-CSRF-TOKEN": csrfToken || "y0kQJjlE0bx7bZzGLE5lJqzyXeuJLVD2",
      "Xrxs-Language": "zh",
      "Xrxs-Timezone": "+08:00",
      "baggage": `sentry-environment=none,sentry-transaction=home,sentry-public_key=b10e1ef4e17f425e8699509ad54658ec,sentry-trace_id=${traceId}`,
      "sentry-trace": sentryTrace,
      "sec-ch-ua": '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"'
    };

    GM_xmlhttpRequest({
      method: 'POST',
      headers: headers,
      cookie: cookies, // 添加Cookie
      responseType: 'json',
      url: "https://s.xinrenxinshi.com/employee-pc/service/attendancePC/ajax-get-attendance-record-list",
      data: `yearmo=${yearmo}&eid=`, // 添加年月参数
      onerror: function (err) {
        GM_log('请求错误:', err);
        // 隐藏加载提示
        const loading = document.getElementById('queryLoading');
        if (loading) {
          document.body.removeChild(loading);
        }
        // 显示错误通知
        GM_notification({
          title: '请求错误',
          text: '获取考勤数据时发生错误，请重试',
          timeout: 5000
        });
      },
      onload: function (res) {
        try {
          GM_log('🔍 [响应] HTTP状态码:', res.status, res.statusText);
          GM_log('🔍 [响应] 响应类型:', res.response ? 'response对象' : (res.responseText ? 'responseText' : '无响应'));

          // 从响应头中提取新Cookie并更新全局Cookie
          const newCookies = extractCookiesFromHeaders(res.responseHeaders);
          if (newCookies) {
            globalCookies = newCookies;
          }

          // 🔥 关键：尝试从响应头中提取CSRF Token
          try {
            if (res.responseHeaders) {
              const headers = res.responseHeaders.toLowerCase();
              if (headers.includes('x-csrf-token')) {
                const match = res.responseHeaders.match(/x-csrf-token:\s*([^\r\n]+)/i);
                if (match && match[1]) {
                  const newCsrfToken = match[1].trim();
                  if (newCsrfToken && newCsrfToken !== csrfToken) {
                    csrfToken = newCsrfToken;
                    GM_log('✅ [主请求] 从响应头中提取到新的CSRF Token:', newCsrfToken.substring(0, 20) + '...');
                  }
                }
              }
            }
          } catch (e) {
            GM_log('⚠️ [主请求] 提取响应头CSRF Token失败');
          }

          // 检查响应是否存在
          if (!res) {
            throw new Error('服务器响应为空');
          }

          // 尝试从不同位置获取响应数据
          let responseData;
          if (res.response) {
            responseData = res.response;
            GM_log('🔍 [响应] 使用res.response');
          } else if (res.responseText) {
            GM_log('🔍 [响应] 使用res.responseText，长度:', res.responseText.length);
            try {
              responseData = JSON.parse(res.responseText);
            } catch (e) {
              GM_log('❌ 解析响应数据失败');
              throw new Error('无法解析响应数据');
            }
          } else {
            GM_log('❌ 服务器没有返回数据');
            throw new Error('服务器没有返回数据');
          }

          // 检查响应数据是否为空
          if (!responseData || Object.keys(responseData).length === 0) {
            GM_log('❌ 响应数据为空，可能是Cookie认证失败');
            GM_log('🔍 [调试] responseData内容:', JSON.stringify(responseData));
            throw new Error('响应数据为空，可能是Cookie认证失败');
          }

          GM_log('🔍 [响应] responseData有data字段:', !!responseData.data);
          GM_log('🔍 [响应] responseData.code:', responseData.code);
          GM_log('🔍 [响应] responseData.message:', responseData.message);

          // 🔥 特殊处理：检查是否是 2007 错误（CSRF Token 无效）
          if (responseData.code === 2007 || responseData.message === '操作超时，请刷新页面') {
            GM_log('⚠️ [主请求] CSRF Token无效，触发预数据请求获取新Token...');

            // 发送预数据请求获取新的 CSRF Token 和 Cookie
            fetchInitialData();

            // 等待一小段时间后重试
            setTimeout(() => {
              getDateData();
            }, 1500);

            return; // 中止当前处理，等待重试
          }

          if (!responseData.data) {
            GM_log('🔍 [调试] 完整响应:', JSON.stringify(responseData).substring(0, 500));
            throw new Error('响应数据格式不正确');
          }

          const { attendanceArchive, attendanceStatistics, records } = responseData.data;
          monthRecords = records;
          const noWorkDay = attendanceStatistics.noWorkdayNum;
          workDay = getFullDays() - noWorkDay;

          GM_log('✅ [成功] 获取到考勤记录数:', records ? records.length : 0);

          // 使用新接口直接处理所有数据（异步处理）
          (async () => {
            try {
              await processAllDaysData(records);
            } catch (error) {
              console.error('处理考勤数据时出错:', error);
              // 隐藏加载提示
              const loading = document.getElementById('queryLoading');
              if (loading) {
                document.body.removeChild(loading);
              }
              // 显示错误通知
              GM_notification({
                title: '数据处理错误',
                text: '处理考勤数据时发生错误，请重试',
                timeout: 5000
              });
            }
          })();
        } catch (error) {
          GM_log('❌ 解析响应数据出错:', error.message);

          // 如果是Cookie相关错误，尝试重新初始化Cookie并重试一次
          if (error.message.includes('Cookie') || error.message.includes('认证') || error.message.includes('为空')) {
            initializeCookies();

            // 重试一次
            setTimeout(() => {
              getDateData();
            }, 1000);
            return;
          }
          
          // 隐藏加载提示
          const loading = document.getElementById('queryLoading');
          if (loading) {
            document.body.removeChild(loading);
          }
          // 显示错误通知
          GM_notification({
            title: '数据解析错误',
            text: '解析服务器响应时发生错误，请重试',
            timeout: 5000
          });
        }
      }
    })
  }

  // 添加悬浮图标
  function createFloatingIcon() {
    const iconButton = document.createElement('div');
    iconButton.style.cssText = `
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  background: #1890ff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  transition: transform 0.3s;
`;

    // 添加图标内容（使用文字或符号）
    iconButton.innerHTML = `
    <div style="color: white; font-size: 24px;">📅</div>
  `;

    // 添加悬停效果
    iconButton.addEventListener('mouseover', () => {
      iconButton.style.transform = 'scale(1.1)';
    });

    iconButton.addEventListener('mouseout', () => {
      iconButton.style.transform = 'scale(1)';
    });

    // 点击显示日期选择器
    iconButton.addEventListener('click', () => {
      createDateSelector();
    });

    document.body.appendChild(iconButton);
  }


  // 修改启动逻辑，不再自动显示弹窗，而是显示悬浮图标
  createFloatingIcon(); // 添加这行

  // 初始化Cookie
  initializeCookies();
})();