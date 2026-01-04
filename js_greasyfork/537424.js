// ==UserScript==
// @name         时间修改器（增强）
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  修改浏览器JS获取的本地时间，支持偏移和固定时间设置
// @author       Vap
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537424/%E6%97%B6%E9%97%B4%E4%BF%AE%E6%94%B9%E5%99%A8%EF%BC%88%E5%A2%9E%E5%BC%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537424/%E6%97%B6%E9%97%B4%E4%BF%AE%E6%94%B9%E5%99%A8%EF%BC%88%E5%A2%9E%E5%BC%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 配置存储键名
  const STORAGE_KEY = 'TIME_MODIFIER_CONFIG';

  // 默认配置
  const defaultConfig = {
    enabled: false,
    mode: 'offset', // 'offset' 或 'fixed'
    offsetHours: 0,
    offsetMinutes: 0,
    fixedDateTime: '',
    enabledDomains: [],
    uiCollapsed: false,
    position: { x: null, y: null }, // 新增：保存UI位置
  };

  // 获取当前域名
  const currentDomain = window.location.hostname;

  // 加载配置
  function loadConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored
        ? { ...defaultConfig, ...JSON.parse(stored) }
        : defaultConfig;
    } catch (e) {
      return defaultConfig;
    }
  }

  // 保存配置
  function saveConfig(config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  // 检查当前域名是否启用
  function isDomainEnabled(config) {
    return (
      config.enabledDomains.includes(currentDomain) ||
      config.enabledDomains.length === 0
    );
  }

  // 计算时间偏移
  function calculateTimeOffset(config) {
    if (config.mode === 'offset') {
      return (config.offsetHours * 60 + config.offsetMinutes) * 60 * 1000;
    } else if (config.mode === 'fixed' && config.fixedDateTime) {
      const fixedTime = new Date(config.fixedDateTime).getTime();
      const currentTime = Date.now();
      return fixedTime - currentTime;
    }
    return 0;
  }

  // 修改时间相关的原生方法
  function modifyTimeMethods(offsetMs) {
    const originalDate = window.Date;
    const originalNow = Date.now;
    const originalGetTime = Date.prototype.getTime;

    // 重写 Date 构造函数
    window.Date = function (...args) {
      if (args.length === 0) {
        const modifiedTime = new originalDate(originalNow() + offsetMs);
        return modifiedTime;
      }
      return new originalDate(...args);
    };

    // 继承原型
    window.Date.prototype = originalDate.prototype;

    // 重写静态方法
    window.Date.now = function () {
      return originalNow() + offsetMs;
    };

    // 重写其他静态方法
    Object.getOwnPropertyNames(originalDate).forEach(prop => {
      if (typeof originalDate[prop] === 'function' && prop !== 'now') {
        window.Date[prop] = originalDate[prop];
      }
    });

    // 重写 getTime 方法
    Date.prototype.getTime = function () {
      const originalTime = originalGetTime.call(this);
      if (this.constructor === window.Date && arguments.length === 0) {
        return originalTime + offsetMs;
      }
      return originalTime;
    };
  }

  // 格式化日期时间为本地输入格式
  function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // 创建UI界面
  function createUI() {
    const config = loadConfig();

    // 主容器
    const container = document.createElement('div');
    container.id = 'time-modifier-ui';

    // 基础样式
    const baseStyles = `
        position: fixed;
        z-index: 999999;
        font-family: Arial, sans-serif;
        font-size: 12px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
    `;

    // 展开状态样式
    const expandedStyles = `
        top: 20px;
        right: 20px;
        min-width: 320px;
    `;

    // 收起状态样式
    const collapsedStyles = `
        bottom: 20px;
        right: 20px;
        min-width: auto;
        cursor: move;
    `;

    // 应用初始样式
    container.style.cssText =
      baseStyles + (config.uiCollapsed ? collapsedStyles : expandedStyles);

    // 如果有保存的位置且UI是收起状态，应用保存的位置
    if (
      config.uiCollapsed &&
      config.position.x !== null &&
      config.position.y !== null
    ) {
      container.style.right = 'auto';
      container.style.bottom = 'auto';
      container.style.left = `${config.position.x}px`;
      container.style.top = `${config.position.y}px`;
    }

    // 标题栏
    const header = document.createElement('div');
    header.style.cssText = `
        background: #f5f5f5;
        padding: 8px 12px;
        border-bottom: ${config.uiCollapsed ? 'none' : '1px solid #ddd'};
        border-radius: 7px ${config.uiCollapsed ? '7px 7px' : '7px 0 0'};
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
    `;
    header.innerHTML = `
        <span style="font-weight: bold; color: #333;">${
          config.uiCollapsed ? '⏰' : '⏰ 时间修改器'
        }</span>
        <span id="toggle-btn" style="cursor: pointer; font-size: 14px;">${
          config.uiCollapsed ? '▼' : '▲'
        }</span>
    `;

    // 内容区域
    const content = document.createElement('div');
    content.id = 'time-modifier-content';
    content.style.cssText = `
        padding: 12px;
        ${config.uiCollapsed ? 'display: none;' : ''}
    `;

    // 启用开关
    const enableRow = document.createElement('div');
    enableRow.style.cssText =
      'margin-bottom: 12px; display: flex; align-items: center;';
    enableRow.innerHTML = `
        <label style="display: flex; align-items: center; cursor: pointer;">
            <input type="checkbox" id="enable-checkbox" ${
              config.enabled ? 'checked' : ''
            }
                   style="margin-right: 8px;">
            <span>启用时间修改</span>
        </label>
    `;

    // 模式选择
    const modeRow = document.createElement('div');
    modeRow.style.cssText = 'margin-bottom: 12px;';
    modeRow.innerHTML = `
        <div style="margin-bottom: 6px; color: #666; font-weight: bold;">修改模式：</div>
        <div style="display: flex; gap: 15px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="radio" name="mode" value="offset" ${
                  config.mode === 'offset' ? 'checked' : ''
                }
                       style="margin-right: 5px;">
                <span>时间偏移</span>
            </label>
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="radio" name="mode" value="fixed" ${
                  config.mode === 'fixed' ? 'checked' : ''
                }
                       style="margin-right: 5px;">
                <span>固定时间</span>
            </label>
        </div>
    `;

    // 时间偏移设置
    const offsetRow = document.createElement('div');
    offsetRow.id = 'offset-settings';
    offsetRow.style.cssText = `margin-bottom: 12px; ${
      config.mode === 'fixed' ? 'display: none;' : ''
    }`;
    offsetRow.innerHTML = `
        <div style="margin-bottom: 6px; color: #666;">时间偏移：</div>
        <div style="display: flex; gap: 10px; align-items: center;">
            <input type="number" id="hours-input" value="${config.offsetHours}"
                   style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;"
                   min="-23" max="23"> 小时
            <input type="number" id="minutes-input" value="${config.offsetMinutes}"
                   style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;"
                   min="-59" max="59"> 分钟
        </div>
    `;

    // 固定时间设置
    const fixedRow = document.createElement('div');
    fixedRow.id = 'fixed-settings';
    fixedRow.style.cssText = `margin-bottom: 12px; ${
      config.mode === 'offset' ? 'display: none;' : ''
    }`;
    const currentTime = new Date();
    const defaultDateTime =
      config.fixedDateTime || formatDateTimeLocal(currentTime);
    fixedRow.innerHTML = `
        <div style="margin-bottom: 6px; color: #666;">固定时间：</div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
            <input type="datetime-local" id="fixed-datetime-input" value="${defaultDateTime}"
                   style="padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
            <div style="display: flex; gap: 5px;">
                <button id="set-current-time" style="padding: 4px 8px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">设为当前时间</button>
                <button id="add-one-hour" style="padding: 4px 8px; background: #ffc107; color: black; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">+1小时</button>
                <button id="add-one-day" style="padding: 4px 8px; background: #fd7e14; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">+1天</button>
            </div>
        </div>
    `;

    // 域名管理
    const domainRow = document.createElement('div');
    domainRow.style.cssText = 'margin-bottom: 12px;';
    domainRow.innerHTML = `
        <div style="margin-bottom: 6px; color: #666;">启用域名 (留空表示所有域名)：</div>
        <div style="display: flex; gap: 5px; margin-bottom: 5px;">
            <input type="text" id="domain-input" placeholder="输入域名，如: example.com"
                   style="flex: 1; padding: 4px; border: 1px solid #ddd; border-radius: 4px; font-size: 11px;">
            <button id="add-domain-btn" style="padding: 4px 8px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;">添加</button>
        </div>
        <div id="domain-list" style="max-height: 80px; overflow-y: auto;"></div>
    `;

    // 当前状态显示
    const statusRow = document.createElement('div');
    statusRow.style.cssText =
      'margin-bottom: 12px; padding: 8px; background: #f9f9f9; border-radius: 4px; font-size: 11px;';
    statusRow.innerHTML = `
        <div><strong>当前域名:</strong> ${currentDomain}</div>
        <div><strong>系统时间:</strong> <span id="system-time">--</span></div>
        <div id="current-time"><strong>修改后时间:</strong> <span id="time-display">--</span></div>
        <div id="mode-status"><strong>当前模式:</strong> <span id="mode-display">${
          config.mode === 'offset' ? '时间偏移' : '固定时间'
        }</span></div>
    `;

    // 操作按钮
    const buttonRow = document.createElement('div');
    buttonRow.style.cssText =
      'display: flex; gap: 8px; justify-content: flex-end;';
    buttonRow.innerHTML = `
        <button id="apply-btn" style="padding: 6px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">应用</button>
        <button id="reset-btn" style="padding: 6px 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">重置</button>
    `;

    // 组装UI
    content.appendChild(enableRow);
    content.appendChild(modeRow);
    content.appendChild(offsetRow);
    content.appendChild(fixedRow);
    content.appendChild(domainRow);
    content.appendChild(statusRow);
    content.appendChild(buttonRow);

    container.appendChild(header);
    container.appendChild(content);

    return container;
  }

  // 更新域名列表显示
  function updateDomainList(container, config) {
    const domainList = container.querySelector('#domain-list');
    domainList.innerHTML = '';

    config.enabledDomains.forEach((domain, index) => {
      const domainItem = document.createElement('div');
      domainItem.style.cssText =
        'display: flex; justify-content: space-between; align-items: center; padding: 2px 0; font-size: 11px;';
      domainItem.innerHTML = `
            <span>${domain}</span>
            <button data-index="${index}" class="remove-domain" style="background: #dc3545; color: white; border: none; border-radius: 2px; padding: 1px 4px; cursor: pointer; font-size: 10px;">×</button>
        `;
      domainList.appendChild(domainItem);
    });
  }

  // 更新时间显示
  function updateTimeDisplay(container) {
    const systemTimeDisplay = container.querySelector('#system-time');
    const timeDisplay = container.querySelector('#time-display');
    const modeDisplay = container.querySelector('#mode-display');

    if (systemTimeDisplay) {
      systemTimeDisplay.textContent = new Date().toLocaleString();
    }

    if (timeDisplay) {
      const config = loadConfig();
      if (config.enabled && isDomainEnabled(config)) {
        const offsetMs = calculateTimeOffset(config);
        const modifiedTime = new Date(Date.now() + offsetMs);
        timeDisplay.textContent = modifiedTime.toLocaleString();
        timeDisplay.style.color = '#28a745';
        timeDisplay.style.fontWeight = 'bold';
      } else {
        timeDisplay.textContent = '未启用';
        timeDisplay.style.color = '#6c757d';
        timeDisplay.style.fontWeight = 'normal';
      }
    }

    if (modeDisplay) {
      const config = loadConfig();
      modeDisplay.textContent =
        config.mode === 'offset' ? '时间偏移' : '固定时间';
    }
  }

  // 使元素可拖动
  function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    // 鼠标按下事件
    element.addEventListener('mousedown', function (e) {
      // 只有在收起状态且点击标题栏时才能拖动
      const config = loadConfig();
      if (!config.uiCollapsed) return;

      // 确保点击的是标题栏
      const header = element.querySelector('div');
      if (e.target !== header && !header.contains(e.target)) return;

      isDragging = true;

      // 计算鼠标在元素内的偏移量
      const rect = element.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // 防止拖动时选中文本
      e.preventDefault();
    });

    // 鼠标移动事件
    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;

      // 计算新位置
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      // 限制在窗口内
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;

      const newX = Math.max(0, Math.min(x, maxX));
      const newY = Math.max(0, Math.min(y, maxY));

      // 应用新位置
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
      element.style.right = 'auto';
      element.style.bottom = 'auto';

      // 保存位置到配置
      const config = loadConfig();
      config.position = { x: newX, y: newY };
      saveConfig(config);
    });

    // 鼠标释放事件
    document.addEventListener('mouseup', function () {
      isDragging = false;
    });

    // 鼠标离开窗口事件
    document.addEventListener('mouseleave', function () {
      isDragging = false;
    });
  }

  // 绑定事件
  function bindEvents(container) {
    const config = loadConfig();

    // 使容器可拖动
    makeDraggable(container);

    // 折叠/展开
    const toggleBtn = container.querySelector('#toggle-btn');
    const content = container.querySelector('#time-modifier-content');
    const header = container.querySelector('div');

    header.addEventListener('click', e => {
      // 如果正在拖动，不触发折叠/展开
      if (container.isDragging) return;

      if (e.target === toggleBtn || e.target.parentElement === header) {
        const isCollapsed = content.style.display === 'none';
        content.style.display = isCollapsed ? 'block' : 'none';
        toggleBtn.textContent = isCollapsed ? '▲' : '▼';

        // 更新配置
        config.uiCollapsed = !isCollapsed;
        saveConfig(config);

        // 更新UI样式
        if (isCollapsed) {
          // 展开状态
          container.style.minWidth = '320px';
          container.style.top = '20px';
          container.style.right = '20px';
          container.style.left = 'auto';
          container.style.bottom = 'auto';
          container.style.cursor = 'default';
          header.style.borderBottom = '1px solid #ddd';
          header.style.borderRadius = '7px 7px 0 0';
          header.querySelector('span').textContent = '⏰ 时间修改器';
        } else {
          // 收起状态
          container.style.minWidth = 'auto';
          container.style.cursor = 'move';
          header.style.borderBottom = 'none';
          header.style.borderRadius = '7px';
          header.querySelector('span').textContent = '⏰';

          // 如果有保存的位置，使用保存的位置
          if (config.position.x !== null && config.position.y !== null) {
            container.style.left = `${config.position.x}px`;
            container.style.top = `${config.position.y}px`;
            container.style.right = 'auto';
            container.style.bottom = 'auto';
          } else {
            // 否则默认放在右下角
            container.style.bottom = '20px';
            container.style.right = '20px';
            container.style.top = 'auto';
            container.style.left = 'auto';
          }
        }
      }
    });

    // 模式切换
    const modeRadios = container.querySelectorAll('input[name="mode"]');
    modeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const offsetSettings = container.querySelector('#offset-settings');
        const fixedSettings = container.querySelector('#fixed-settings');

        if (radio.value === 'offset') {
          offsetSettings.style.display = 'block';
          fixedSettings.style.display = 'none';
        } else {
          offsetSettings.style.display = 'none';
          fixedSettings.style.display = 'block';
        }
        updateTimeDisplay(container);
      });
    });

    // 固定时间快捷按钮
    const setCurrentTimeBtn = container.querySelector('#set-current-time');
    const addOneHourBtn = container.querySelector('#add-one-hour');
    const addOneDayBtn = container.querySelector('#add-one-day');
    const fixedDatetimeInput = container.querySelector('#fixed-datetime-input');

    setCurrentTimeBtn.addEventListener('click', () => {
      fixedDatetimeInput.value = formatDateTimeLocal(new Date());
      updateTimeDisplay(container);
    });

    addOneHourBtn.addEventListener('click', () => {
      const currentValue = new Date(fixedDatetimeInput.value || new Date());
      currentValue.setHours(currentValue.getHours() + 1);
      fixedDatetimeInput.value = formatDateTimeLocal(currentValue);
      updateTimeDisplay(container);
    });

    addOneDayBtn.addEventListener('click', () => {
      const currentValue = new Date(fixedDatetimeInput.value || new Date());
      currentValue.setDate(currentValue.getDate() + 1);
      fixedDatetimeInput.value = formatDateTimeLocal(currentValue);
      updateTimeDisplay(container);
    });

    // 固定时间输入变化
    fixedDatetimeInput.addEventListener('change', () => {
      updateTimeDisplay(container);
    });

    // 偏移时间输入变化
    const hoursInput = container.querySelector('#hours-input');
    const minutesInput = container.querySelector('#minutes-input');
    [hoursInput, minutesInput].forEach(input => {
      input.addEventListener('input', () => {
        updateTimeDisplay(container);
      });
    });

    // 添加域名
    const addDomainBtn = container.querySelector('#add-domain-btn');
    const domainInput = container.querySelector('#domain-input');
    addDomainBtn.addEventListener('click', () => {
      const domain = domainInput.value.trim();
      if (domain && !config.enabledDomains.includes(domain)) {
        config.enabledDomains.push(domain);
        saveConfig(config);
        updateDomainList(container, config);
        domainInput.value = '';
      }
    });

    // 删除域名
    container.addEventListener('click', e => {
      if (e.target.classList.contains('remove-domain')) {
        const index = parseInt(e.target.dataset.index);
        config.enabledDomains.splice(index, 1);
        saveConfig(config);
        updateDomainList(container, config);
      }
    });

    // 应用设置
    const applyBtn = container.querySelector('#apply-btn');
    applyBtn.addEventListener('click', () => {
      const enabled = container.querySelector('#enable-checkbox').checked;
      const mode = container.querySelector('input[name="mode"]:checked').value;
      const hours =
        parseInt(container.querySelector('#hours-input').value) || 0;
      const minutes =
        parseInt(container.querySelector('#minutes-input').value) || 0;
      const fixedDateTime = container.querySelector(
        '#fixed-datetime-input',
      ).value;

      config.enabled = enabled;
      config.mode = mode;
      config.offsetHours = hours;
      config.offsetMinutes = minutes;
      config.fixedDateTime = fixedDateTime;
      saveConfig(config);

      if (enabled && isDomainEnabled(config)) {
        const offsetMs = calculateTimeOffset(config);
        modifyTimeMethods(offsetMs);
      }

      alert('设置已应用！刷新页面生效。');
    });

    // 重置设置
    const resetBtn = container.querySelector('#reset-btn');
    resetBtn.addEventListener('click', () => {
      if (confirm('确定要重置所有设置吗？')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    });

    // 初始化域名列表
    updateDomainList(container, config);

    // 定时更新时间显示
    setInterval(() => updateTimeDisplay(container), 1000);
    updateTimeDisplay(container);
  }

  // 初始化
  function init() {
    const config = loadConfig();

    // 如果启用且当前域名在列表中，则修改时间
    if (config.enabled && isDomainEnabled(config)) {
      const offsetMs = calculateTimeOffset(config);
      modifyTimeMethods(offsetMs);
    }

    // 页面加载完成后创建UI
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          const ui = createUI();
          document.body.appendChild(ui);
          bindEvents(ui);
        }, 1000);
      });
    } else {
      setTimeout(() => {
        const ui = createUI();
        document.body.appendChild(ui);
        bindEvents(ui);
      }, 1000);
    }
  }

  // 启动脚本
  init();
})();

