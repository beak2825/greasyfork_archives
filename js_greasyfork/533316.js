// ==UserScript==
// @name         Bilibili 评论区等级过滤器
// @namespace    https://github.com/Misasasasasaka
// @version      2.1
// @description  优雅地过滤Bilibili评论区，支持拖动调节等级阈值与自动隐藏功能
// @author       Misasasasasaka
// @match        https://www.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533316/Bilibili%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%AD%89%E7%BA%A7%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533316/Bilibili%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%AD%89%E7%BA%A7%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

;(function() {
  'use strict';

  // 存储键和全局配置
  const CONFIG = {
    storageKey: 'bili_comment_level_threshold',
    defaultThreshold: 0,
    colors: {
      primary: '#fb7299',    // B站粉色
      secondary: '#23ade5',  // B站蓝色
      background: '#ffffff',
      text: '#333333',
      border: '#e1e1e1'
    },
    animation: {
      duration: '0.3s'
    }
  };

  // 获取用户设置
  let threshold = GM_getValue(CONFIG.storageKey, CONFIG.defaultThreshold);

  // 核心样式定义
  const styleDefinition = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500&display=swap');

    #bili-level-filter-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: 'Noto Sans SC', sans-serif;
      transition: all ${CONFIG.animation.duration} ease;
      opacity: 0.3;
    }

    #bili-level-filter-container:hover {
      opacity: 1;
    }

    #bili-level-filter-container.panel-open {
      opacity: 1;
    }

    #bili-level-filter-toggle {
      width: 36px;
      height: 36px;
      background: ${CONFIG.colors.primary};
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      transition: transform ${CONFIG.animation.duration} ease, background ${CONFIG.animation.duration} ease;
      position: relative;
      z-index: 10001;
    }

    #bili-level-filter-toggle:hover {
      background: ${CONFIG.colors.secondary};
      transform: scale(1.1);
    }

    #bili-level-filter-toggle svg {
      width: 18px;
      height: 18px;
      fill: white;
    }

    #bili-level-filter-panel {
      position: absolute;
      bottom: 50px;
      right: 0;
      background: ${CONFIG.colors.background};
      border-radius: 8px;
      box-shadow: 0 3px 15px rgba(0,0,0,0.12);
      padding: 16px;
      width: 260px;
      border: 1px solid ${CONFIG.colors.border};
      display: flex;
      flex-direction: column;
      gap: 12px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: opacity ${CONFIG.animation.duration} ease,
                  visibility ${CONFIG.animation.duration} ease,
                  transform ${CONFIG.animation.duration} ease;
    }

    #bili-level-filter-panel.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    #bili-level-filter-panel h4 {
      margin: 0 0 8px;
      color: ${CONFIG.colors.primary};
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 500;
    }

    #bili-level-filter-panel h4 svg {
      margin-right: 6px;
    }

    .level-filter-row {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }

    .level-filter-row label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      color: ${CONFIG.colors.text};
    }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .range-slider {
      flex: 1;
      height: 5px;
      -webkit-appearance: none;
      appearance: none;
      background: #e6e6e6;
      outline: none;
      border-radius: 3px;
    }

    .range-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      background: ${CONFIG.colors.primary};
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .range-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
      background: ${CONFIG.colors.secondary};
    }

    .value-display {
      background: ${CONFIG.colors.primary}22;
      min-width: 35px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 500;
      color: ${CONFIG.colors.primary};
    }

    .button-row {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    }

    .bili-btn {
      padding: 6px 14px;
      border: none;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      font-family: inherit;
    }

    .bili-btn-primary {
      background: ${CONFIG.colors.primary};
      color: white;
    }

    .bili-btn-primary:hover {
      background: #e45f84;
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .bili-btn-secondary {
      background: transparent;
      color: ${CONFIG.colors.text};
      border: 1px solid #ddd;
    }

    .bili-btn-secondary:hover {
      border-color: #ccc;
      background: #f9f9f9;
    }

    .filter-status {
      padding: 6px 10px;
      border-radius: 4px;
      background: #f0f9ff;
      border: 1px solid #e0f0ff;
      font-size: 12px;
      color: #0077cc;
      margin-top: 6px;
      text-align: center;
      transition: all ${CONFIG.animation.duration} ease;
    }

    .filter-active {
      background: #ecfaf0;
      border: 1px solid #d5f0db;
      color: #00a651;
    }

    #bili-toast {
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 13px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
      z-index: 10000;
      pointer-events: none;
    }

    #bili-toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    .hidden {
      display: none !important;
    }

    @media (max-width: 768px) {
      #bili-level-filter-panel {
        width: 220px;
      }
    }
  `;

  // 创建并添加插件UI
  function createFilterUI() {
    // 添加样式
    GM_addStyle(styleDefinition);

    // 创建主容器
    const container = document.createElement('div');
    container.id = 'bili-level-filter-container';

    // 添加切换按钮（小图标按钮）
    const toggleButton = document.createElement('button');
    toggleButton.id = 'bili-level-filter-toggle';
    toggleButton.setAttribute('aria-label', '打开评论过滤器设置');
    toggleButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18V12L3 5V3H21V5L14 12V18L10 21V18Z" fill="currentColor"/>
      </svg>
    `;

    // 创建设置面板
    const panel = document.createElement('div');
    panel.id = 'bili-level-filter-panel';

    // 面板标题和图标
    panel.innerHTML = `
      <h4>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 18V12L3 5V3H21V5L14 12V18L10 21V18Z" stroke="${CONFIG.colors.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        B站评论等级过滤器
      </h4>

      <div class="level-filter-row">
        <label for="bili-level-slider">最低用户等级 (0-6):</label>
        <div class="slider-container">
          <input type="range" id="bili-level-slider" class="range-slider" min="0" max="6" step="1" value="${threshold}">
          <div class="value-display" id="level-value">${threshold}</div>
        </div>
      </div>

      <div class="filter-status ${threshold > 0 ? 'filter-active' : ''}">
        <span id="status-message">${
          threshold > 0
            ? `当前已过滤 <b>Lv.${threshold}</b> 以下用户评论`
            : '过滤功能未启用'
        }</span>
      </div>

      <div class="button-row">
        <button id="bili-level-reset" class="bili-btn bili-btn-secondary">重置</button>
        <button id="bili-level-save" class="bili-btn bili-btn-primary">保存并应用</button>
      </div>
    `;

    // 创建toast通知
    const toast = document.createElement('div');
    toast.id = 'bili-toast';
    toast.textContent = '设置已保存';

    // 组装UI
    container.appendChild(toggleButton);
    container.appendChild(panel);
    document.body.appendChild(container);
    document.body.appendChild(toast);

    // 绑定事件
    setupEventListeners();
  }

  // 设置事件监听
  function setupEventListeners() {
    // 获取元素
    const container = document.getElementById('bili-level-filter-container');
    const toggleButton = document.getElementById('bili-level-filter-toggle');
    const panel = document.getElementById('bili-level-filter-panel');
    const slider = document.getElementById('bili-level-slider');
    const valueDisplay = document.getElementById('level-value');
    const saveButton = document.getElementById('bili-level-save');
    const resetButton = document.getElementById('bili-level-reset');
    const statusDiv = document.querySelector('.filter-status');
    const statusMessage = document.getElementById('status-message');

    // 控制面板显示隐藏
    let panelVisible = false;

    toggleButton.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel(!panelVisible);
    });

    // 点击其他区域关闭面板
    document.addEventListener('click', (e) => {
      if (panelVisible && !panel.contains(e.target) && e.target !== toggleButton) {
        togglePanel(false);
      }
    });

    // 面板内点击不传播
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 切换面板显示状态
    function togglePanel(show) {
      panelVisible = show;
      if (show) {
        panel.classList.add('visible');
        container.classList.add('panel-open');
      } else {
        panel.classList.remove('visible');
        container.classList.remove('panel-open');
      }
    }

    // 鼠标移出容器区域自动隐藏
    let hideTimeout;

    container.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
    });

    container.addEventListener('mouseleave', () => {
      if (panelVisible) {
        hideTimeout = setTimeout(() => {
          togglePanel(false);
        }, 1000); // 鼠标移出1秒后隐藏面板
      }
    });

    // 滑块值更新
    slider.addEventListener('input', () => {
      const value = slider.value;
      valueDisplay.textContent = value;

      // 实时预览状态变化
      if (value > 0) {
        statusDiv.classList.add('filter-active');
        statusMessage.innerHTML = `当前已过滤 <b>Lv.${value}</b> 以下用户评论`;
      } else {
        statusDiv.classList.remove('filter-active');
        statusMessage.innerHTML = '过滤功能未启用';
      }
    });

    // 保存设置
    saveButton.addEventListener('click', () => {
      const newThreshold = parseInt(slider.value);
      threshold = newThreshold;
      GM_setValue(CONFIG.storageKey, newThreshold);

      // 显示保存成功提示
      showToast(`设置已保存，将过滤 Lv.${newThreshold} 以下用户评论`);

      // 关闭面板
      togglePanel(false);

      // 刷新页面以应用更改
      setTimeout(() => {
        location.reload();
      }, 1000);
    });

    // 重置设置
    resetButton.addEventListener('click', () => {
      slider.value = CONFIG.defaultThreshold;
      valueDisplay.textContent = CONFIG.defaultThreshold;
      statusDiv.classList.remove('filter-active');
      statusMessage.innerHTML = '过滤功能未启用';

      if (threshold !== CONFIG.defaultThreshold) {
        threshold = CONFIG.defaultThreshold;
        GM_setValue(CONFIG.storageKey, CONFIG.defaultThreshold);
        showToast('设置已重置，过滤功能已关闭');

        // 关闭面板
        togglePanel(false);

        // 刷新页面以应用更改
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    });
  }

  // 显示toast通知
  function showToast(message, duration = 3000) {
    const toast = document.getElementById('bili-toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // 拦截并过滤评论请求
  function setupFetchInterceptor() {
    const origFetch = unsafeWindow.fetch;

    unsafeWindow.fetch = function(input, init) {
      let url = typeof input === 'string' ? input : input.url;

      // 针对评论接口进行处理
      if (url.includes('/x/v2/reply')) {
        return origFetch(input, init).then(res => {
          // 如果过滤级别为0，不进行过滤
          if (threshold <= 0) return res;

          const clone = res.clone();
          return clone.json().then(json => {
            // 确保响应格式正确
            if (json && json.code === 0 && json.data) {
              // 过滤主评论和热门评论
              ['replies', 'hots'].forEach(key => {
                if (Array.isArray(json.data[key])) {
                  const originalCount = json.data[key].length;
                  json.data[key] = json.data[key].filter(item => {
                    const lvl = item.member?.level_info?.current_level || 0;
                    return lvl >= threshold;
                  });

                  // 添加调试信息，在控制台显示过滤情况
                  if (originalCount > json.data[key].length) {
                    console.info(
                      `%c[B站评论过滤器] %c已过滤 ${originalCount - json.data[key].length} 条 Lv.${threshold} 以下用户评论`,
                      'color: #fb7299; font-weight: bold',
                      'color: #333'
                    );
                  }
                }
              });

              // 处理嵌套的回复
              if (json.data.replies) {
                json.data.replies.forEach(reply => {
                  if (Array.isArray(reply.replies)) {
                    const originalNestedCount = reply.replies.length;
                    reply.replies = reply.replies.filter(item => {
                      const lvl = item.member?.level_info?.current_level || 0;
                      return lvl >= threshold;
                    });
                  }
                });
              }
            }

            // 创建新的响应
            const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
            return new Response(blob, {
              status: res.status,
              statusText: res.statusText,
              headers: res.headers
            });
          });
        });
      }

      // 其它请求正常处理
      return origFetch(input, init);
    };
  }

  // 初始化函数
  function init() {
    // 创建UI
    createFilterUI();

    // 设置拦截器
    setupFetchInterceptor();

    // 打印初始化信息
    console.info(
      `%c[B站评论过滤器 v2.1] %c已启用 - 当前过滤 Lv.${threshold} 以下用户评论`,
      'color: #fb7299; font-weight: bold',
      'color: #333'
    );
  }

  // 当文档加载完成后初始化
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
})();