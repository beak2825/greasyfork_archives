// ==UserScript==
// @name         DeepSeek 自动重试
// @name:en      DeepSeek Auto-Retry
// @version      1.0
// @description  自动检测并点击重试按钮解决DeepSeek服务器繁忙问题
// @description:en  Automatically detects and clicks retry button to solve DeepSeek server busy issues
// @author       AI助手
// @match        *://*.deepseek.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1479767
// @downloadURL https://update.greasyfork.org/scripts/538546/DeepSeek%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/538546/DeepSeek%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 全局配置
    const CONFIG = {
      // 使用多个可能的错误消息片段进行模糊匹配
      errorKeywords: ["服务器繁忙", "请稍后重试", "请稍好再试", "请稍候再试", "请重试"],
      checkIntervalMS: 5000,
      mutationDelayMS: 2000,
      indicatorVisible: true,
      maxHistoricalScore: 50      // 历史匹配最高加分上限
    };

    // 全局状态变量
    let lastCheckTime = 0;
    let pendingCheck = null;
    let isEnabled = true;
    let successfulButtons = []; // 记录之前成功的按钮特征

    // 立即执行，确认脚本已加载
    console.log("DeepSeek自动重试插件已加载");

    // 向页面添加控制面板
    function createUI() {
      const indicator = document.createElement('div');
      indicator.id = 'deepseek-auto-retry-indicator';
      indicator.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 128, 0, 0.6);
        color: white;
        padding: 5px 8px;
        border-radius: 5px;
        font-size: 10px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        opacity: 0.7;
        transition: opacity 0.3s;
        cursor: pointer;
      `;
      indicator.textContent = 'DeepSeek自动重试: 已启用';
      
      // 点击显示下拉菜单
      indicator.addEventListener('click', () => {
        const menu = document.getElementById('deepseek-auto-retry-menu');
        if (menu) {
          menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
      });
      
      document.body.appendChild(indicator);
      
      // 下拉菜单
      const menu = document.createElement('div');
      menu.id = 'deepseek-auto-retry-menu';
      menu.style.cssText = `
        position: fixed;
        bottom: 35px;
        right: 10px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 5px 0;
        z-index: 10000;
        display: none;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        width: 180px;
      `;
      
      // 菜单选项
      const menuItems = [
        {id: 'toggle-current', text: '当前标签页: 启用', action: toggleCurrentTab},
        {id: 'toggle-site', text: `当前网站: 启用`, action: toggleCurrentSite},
        {id: 'toggle-global', text: '全局: 启用', action: toggleGlobalState}
      ];
      
      menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.id = item.id;
        menuItem.style.cssText = `
          padding: 8px 12px;
          cursor: pointer;
          font-size: 12px;
          color: #333;
          border-bottom: 1px solid #eee;
        `;
        menuItem.textContent = item.text;
        
        menuItem.addEventListener('mouseover', () => {
          menuItem.style.backgroundColor = '#f5f5f5';
        });
        
        menuItem.addEventListener('mouseout', () => {
          menuItem.style.backgroundColor = 'transparent';
        });
        
        menuItem.addEventListener('click', (e) => {
          e.stopPropagation();
          item.action();
          menu.style.display = 'none';
        });
        
        menu.appendChild(menuItem);
      });
      
      // 添加重置按钮记录选项
      const resetItem = document.createElement('div');
      resetItem.id = 'reset-data';
      resetItem.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        font-size: 12px;
        color: #f44336;
        border-top: 1px solid #eee;
        margin-top: 5px;
      `;
      resetItem.textContent = '重置按钮记录';

      resetItem.addEventListener('click', (e) => {
        e.stopPropagation();
        successfulButtons = [];
        saveState('successfulButtons', []);
        menu.style.display = 'none';
        showMessage('按钮记录已重置', 2000);
      });

      menu.appendChild(resetItem);
      
      // 添加说明文本
      const helpText = document.createElement('div');
      helpText.style.cssText = `
        padding: 8px 12px;
        font-size: 10px;
        color: #666;
        border-top: 1px solid #eee;
        margin-top: 5px;
      `;
      helpText.textContent = '提示: 标签页禁用仅本次有效，网站和全局禁用会被保存';
      menu.appendChild(helpText);
      
      document.body.appendChild(menu);
      
      // 点击其他区域关闭菜单
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#deepseek-auto-retry-indicator') && 
            !e.target.closest('#deepseek-auto-retry-menu')) {
          menu.style.display = 'none';
        }
      });
      
      // 从存储中加载状态
      loadState();
    }

    // 从存储中加载禁用状态
    function loadState() {
      try {
        const savedState = localStorage.getItem('deepseek-auto-retry-state');
        if (savedState) {
          const state = JSON.parse(savedState);
          
          if (state.globalDisabled === true) {
            isEnabled = false;
            updateMenuItem('toggle-global', false);
          }
          
          const currentDomain = window.location.hostname;
          if (state.disabledSites && state.disabledSites.includes(currentDomain)) {
            isEnabled = false;
            updateMenuItem('toggle-site', false);
          }
          
          // 加载之前成功的按钮特征
          if (state.successfulButtons && Array.isArray(state.successfulButtons)) {
            successfulButtons = state.successfulButtons;
          }
        }
        
        updateIndicator();
      } catch (error) {
        console.error("加载状态时出错:", error);
      }
    }

    // 保存状态
    function saveState(key, value) {
      try {
        const savedStateStr = localStorage.getItem('deepseek-auto-retry-state');
        const state = savedStateStr ? JSON.parse(savedStateStr) : {};
        
        if (key === 'globalDisabled') {
          state.globalDisabled = value;
        } 
        else if (key === 'disabledSites') {
          if (!state.disabledSites) state.disabledSites = [];
          
          const currentDomain = window.location.hostname;
          if (value === true) {
            if (!state.disabledSites.includes(currentDomain)) {
              state.disabledSites.push(currentDomain);
            }
          } else {
            state.disabledSites = state.disabledSites.filter(site => site !== currentDomain);
          }
        }
        else if (key === 'successfulButtons') {
          state.successfulButtons = value;
          // 限制存储的按钮特征数量，避免过多
          if (state.successfulButtons.length > 10) {
            state.successfulButtons = state.successfulButtons.slice(-10);
          }
        }
        
        localStorage.setItem('deepseek-auto-retry-state', JSON.stringify(state));
      } catch (error) {
        console.error("保存状态时出错:", error);
      }
    }

    // 更新菜单项显示
    function updateMenuItem(id, enabled) {
      const menuItem = document.getElementById(id);
      if (menuItem) {
        const label = id === 'toggle-current' ? '当前标签页' : 
                     (id === 'toggle-site' ? '当前网站' : '全局');
        menuItem.textContent = `${label}: ${enabled ? '启用' : '禁用'}`;
        menuItem.style.color = enabled ? '#333' : '#999';
      }
    }

    // 更新状态指示器
    function updateIndicator() {
      const indicator = document.getElementById('deepseek-auto-retry-indicator');
      if (!indicator) return;
      
      indicator.textContent = isEnabled ? 'DeepSeek自动重试: 已启用' : 'DeepSeek自动重试: 已禁用';
      indicator.style.backgroundColor = isEnabled ? 'rgba(0, 128, 0, 0.6)' : 'rgba(128, 128, 128, 0.6)';
    }

    // 控制函数
    function toggleCurrentTab() {
      isEnabled = !isEnabled;
      updateMenuItem('toggle-current', isEnabled);
      updateIndicator();
      
      if (isEnabled) {
        setupMonitoring();
      } else {
        clearTimeout(pendingCheck);
        pendingCheck = null;
      }
    }

    function toggleCurrentSite() {
      const newState = !isEnabled;
      isEnabled = newState;
      
      saveState('disabledSites', !newState);
      
      updateMenuItem('toggle-site', newState);
      updateMenuItem('toggle-current', newState);
      updateIndicator();
      
      if (newState) {
        setupMonitoring();
      } else {
        clearTimeout(pendingCheck);
        pendingCheck = null;
      }
    }

    function toggleGlobalState() {
      const newState = !isEnabled;
      isEnabled = newState;
      
      saveState('globalDisabled', !newState);
      
      updateMenuItem('toggle-global', newState);
      updateMenuItem('toggle-site', newState);
      updateMenuItem('toggle-current', newState);
      updateIndicator();
      
      if (newState) {
        setupMonitoring();
      } else {
        clearTimeout(pendingCheck);
        pendingCheck = null;
      }
    }

    // 智能查找并点击重试按钮，添加可视化反馈
    function findAndClickRetryButton(errorElement) {
      console.log("DeepSeek自动重试: 正在智能查找重试按钮...");
      
      // 记录找到的所有可能的按钮及其分数
      const candidates = [];
      
      // 策略1: 基于文本内容识别重试按钮
      const retryKeywords = ["重试", "重新", "再试", "刷新", "重新生成", "regenerate", "retry"];
      const allInteractiveElements = document.querySelectorAll('button, [role="button"], .btn, .button, a[href="#"], .ds-icon');
      
      allInteractiveElements.forEach(el => {
        let score = 0;
        
        // 1.1 检查元素文本内容
        const text = el.innerText || el.textContent || "";
        for (const keyword of retryKeywords) {
          if (text.includes(keyword)) {
            score += 40;
            break;
          }
        }
        
        // 1.2 检查ARIA属性和title属性
        const ariaLabel = el.getAttribute('aria-label') || "";
        const title = el.getAttribute('title') || "";
        const altText = el.getAttribute('alt') || "";
        
        for (const keyword of retryKeywords) {
          if (ariaLabel.includes(keyword) || title.includes(keyword) || altText.includes(keyword)) {
            score += 30;
            break;
          }
        }
        
        // 1.3 检查子元素内容
        const svgElements = el.querySelectorAll('svg');
        if (svgElements.length > 0) {
          score += 10; // 包含SVG图标的按钮更可能是操作按钮
          
          // 检查SVG路径和rect特征
          const paths = el.querySelectorAll('path');
          const rects = el.querySelectorAll('rect');
          
          paths.forEach(path => {
            const d = path.getAttribute('d');
            if (d && d.startsWith('M12')) score += 5; // 刷新图标的常见特征
          });
          
          rects.forEach(rect => {
            const id = rect.getAttribute('id');
            if (id && retryKeywords.some(keyword => id.includes(keyword))) {
              score += 20;
            }
          });
        }
        
        // 1.4 检查元素类名和ID
        const className = el.className || "";
        const id = el.id || "";
        
        for (const keyword of retryKeywords) {
          if (className.includes(keyword) || id.includes(keyword)) {
            score += 25;
            break;
          }
        }
        
        // 1.5 如果元素包含类名ds-icon，很可能是我们要找的按钮
        if (className.includes("ds-icon")) {
          score += 15;
        }
        
        // 1.6 根据按钮位置评分
        if (errorElement) {
          // 计算按钮与错误元素的距离
          const errorRect = errorElement.getBoundingClientRect();
          const buttonRect = el.getBoundingClientRect();
          
          const distance = Math.sqrt(
            Math.pow(errorRect.left - buttonRect.left, 2) +
            Math.pow(errorRect.top - buttonRect.top, 2)
          );
          
          // 距离错误消息越近的按钮分数越高
          const proximityScore = Math.max(0, 30 - distance / 10);
          score += proximityScore;
        }
        
        // 1.7 检查与历史成功按钮的相似度
        let historicalMatchScore = 0;
        
        for (const buttonFeature of successfulButtons) {
          let matchScore = 0;
          
          if (buttonFeature.className && className.includes(buttonFeature.className)) {
            matchScore += 15;
          }
          if (buttonFeature.id && id === buttonFeature.id) {
            matchScore += 20; 
          }
          if (buttonFeature.tagName && el.tagName === buttonFeature.tagName) {
            matchScore += 5;
          }
          if (buttonFeature.manual === true) {
            matchScore *= 1.5; // 手动选择的按钮更有可能是正确的
          }
          
          // 取最高的单次匹配分
          historicalMatchScore = Math.max(historicalMatchScore, matchScore);
        }
        
        // 限制历史匹配最高加分
        score += Math.min(historicalMatchScore, CONFIG.maxHistoricalScore);
        
        // 只有得分大于10的候选按钮才被记录
        if (score > 10) {
          candidates.push({
            element: el,
            score: score
          });
        }
      });
      
      // 按得分排序
      candidates.sort((a, b) => b.score - a.score);
      
      // 移除之前的可视化标记
      removeButtonHighlights();
      
      // 显示前3个候选按钮
      for (let i = 0; i < Math.min(3, candidates.length); i++) {
        // 给候选按钮添加视觉标记
        highlightButton(candidates[i].element, candidates[i].score, i === 0);
      }
      
      // 如果有候选按钮，点击得分最高的
      if (candidates.length > 0) {
        const bestCandidate = candidates[0];
        const element = bestCandidate.element;
        
        // 详细记录按钮信息，帮助调试
        console.log(`DeepSeek自动重试: 找到最佳候选按钮，分数: ${bestCandidate.score}`);
        console.log(`按钮信息:`, {
          tagName: element.tagName,
          className: element.className,
          id: element.id,
          text: element.innerText || element.textContent,
          disabled: element.disabled,
          ariaDisabled: element.getAttribute('aria-disabled'),
          style: element.style.cssText,
          rect: element.getBoundingClientRect()
        });
        
        // 使用多种方法尝试点击按钮
        const clickSuccess = forceClickElement(element);
        
        // 创建按钮特征指纹
        const buttonFeature = {
          className: element.className,
          id: element.id,
          tagName: element.tagName,
          innerText: (element.innerText || element.textContent || "").substring(0, 20)
        };
        
        // 特征指纹，用于判断是否重复
        const featureFingerprint = `${buttonFeature.tagName}-${buttonFeature.id}-${buttonFeature.className}`;
        
        // 检查是否已存在类似特征，避免重复添加
        const isDuplicate = successfulButtons.some(existing => {
          const existingFingerprint = `${existing.tagName || ''}-${existing.id || ''}-${existing.className || ''}`;
          return existingFingerprint === featureFingerprint;
        });
        
        // 只有非重复按钮才添加到历史记录
        if (!isDuplicate) {
          console.log("DeepSeek自动重试: 记录新的按钮特征");
          successfulButtons.push(buttonFeature);
          saveState('successfulButtons', successfulButtons);
        }
        
        return clickSuccess;
      }
      
      console.log("DeepSeek自动重试: 未找到合适的重试按钮");
      // 显示手动选择按钮
      const manualSelectBtn = document.getElementById('deepseek-manual-select');
      if (manualSelectBtn) {
        manualSelectBtn.style.display = 'block';
      }
      return false;
    }

    // 可视化标记按钮
    function highlightButton(element, score, isPrimary) {
      // 创建外部包装元素用于显示信息
      const highlighter = document.createElement('div');
      highlighter.className = 'deepseek-button-highlight';
      highlighter.style.cssText = `
        position: absolute;
        border: 2px solid ${isPrimary ? '#ff0000' : '#ffcc00'};
        border-radius: 4px;
        background-color: ${isPrimary ? 'rgba(255,0,0,0.2)' : 'rgba(255,204,0,0.1)'};
        z-index: 9999;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        text-shadow: 0 0 2px black;
      `;
      
      // 获取元素位置并设置高亮位置
      const rect = element.getBoundingClientRect();
      highlighter.style.width = `${rect.width + 4}px`;
      highlighter.style.height = `${rect.height + 4}px`;
      highlighter.style.top = `${rect.top + window.scrollY - 2}px`;
      highlighter.style.left = `${rect.left + window.scrollX - 2}px`;
      
      // 添加分数标签
      if (isPrimary) {
        highlighter.textContent = `分数: ${Math.round(score)}`;
      }
      
      document.body.appendChild(highlighter);
      
      // 5秒后自动移除高亮
      setTimeout(() => {
        if (document.body.contains(highlighter)) {
          document.body.removeChild(highlighter);
        }
      }, 5000);
    }

    // 移除所有高亮标记
    function removeButtonHighlights() {
      const highlights = document.querySelectorAll('.deepseek-button-highlight');
      highlights.forEach(el => {
        if (document.body.contains(el)) {
          document.body.removeChild(el);
        }
      });
    }

    // 强制点击元素，尝试多种点击方式
    function forceClickElement(element) {
      try {
        console.log("尝试点击方法 1: 原生click()");
        element.click();
        
        // 尝试方法2: 创建并触发鼠标事件
        console.log("尝试点击方法 2: 模拟鼠标事件");
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
          const event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            buttons: 1
          });
          element.dispatchEvent(event);
        });
        
        // 尝试方法3: 如果是A标签，模拟href导航
        if (element.tagName === 'A' && element.getAttribute('href')) {
          console.log("尝试点击方法 3: 链接导航");
          if (element.getAttribute('href') !== '#') {
            window.location.href = element.getAttribute('href');
          }
        }
        
        // 尝试方法4: 查找onclick属性并直接执行
        if (element.getAttribute('onclick')) {
          console.log("尝试点击方法 4: 执行onclick");
          const onClickFn = new Function(element.getAttribute('onclick'));
          onClickFn();
        }
        
        // 尝试方法5: 检查父元素是否可点击
        if (element.parentElement && 
            (element.parentElement.tagName === 'BUTTON' || 
             element.parentElement.getAttribute('role') === 'button')) {
          console.log("尝试点击方法 5: 点击父元素");
          element.parentElement.click();
        }
        
        return true;
      } catch (err) {
        console.error("点击按钮失败:", err);
        return false;
      }
    }

    // 检测页面错误
    function detectError() {
      // 创建包含所有错误关键词的正则表达式
      const errorPattern = new RegExp(CONFIG.errorKeywords.join('|'), 'i');
      
      // 检查页面内容
      if (errorPattern.test(document.body.innerText)) {
        // 尝试定位具体的错误元素
        const textNodes = [];
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let node;
        while(node = walker.nextNode()) {
          if (errorPattern.test(node.nodeValue)) {
            textNodes.push({
              node: node,
              element: node.parentElement
            });
          }
        }
        
        // 如果找到错误文本节点，返回第一个
        if (textNodes.length > 0) {
          return {
            found: true,
            element: textNodes[0].element,
            text: textNodes[0].node.nodeValue
          };
        }
        
        // 如果没找到具体节点但页面内容包含错误关键词，返回body
        return {
          found: true,
          element: document.body,
          text: "未能定位具体错误元素，但页面包含错误关键词"
        };
      }
      
      // 检查可能显示错误的特定元素
      const possibleErrorSelectors = [
        '.error-message', '.alert', '.notification', '.toast',
        '[role="alert"]', '.message-error', '.error'
      ];
      
      for (const selector of possibleErrorSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          if (errorPattern.test(element.innerText)) {
            return {
              found: true,
              element: element,
              text: element.innerText
            };
          }
        }
      }
      
      return { found: false };
    }

    // 显示临时消息
    function showMessage(text, duration) {
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 128, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 10002;
      `;
      message.textContent = text;
      document.body.appendChild(message);
      
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, duration || 3000);
    }

    // 检查页面是否存在错误信息并触发重试
    function checkForErrorAndRetry() {
      // 如果已禁用，不执行检查
      if (!isEnabled) return;
      
      const now = Date.now();
      lastCheckTime = now;
      pendingCheck = null;
      
      // 检查是否存在错误
      const errorResult = detectError();
      if (errorResult.found) {
        console.log(`DeepSeek自动重试: 检测到错误消息: "${errorResult.text.substring(0, 50)}..."`);
        
        // 更新指示器状态
        const indicator = document.getElementById('deepseek-auto-retry-indicator');
        if (indicator) {
          indicator.textContent = '检测到错误，尝试重试...';
          indicator.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';
          
          // 2秒后恢复原状
          setTimeout(() => updateIndicator(), 2000);
        }
        
        findAndClickRetryButton(errorResult.element);
      }
    }

    // 安排延迟检查
    function scheduleCheck() {
      // 如果已禁用或已有待处理检查，不安排新的
      if (!isEnabled || pendingCheck) return;
      
      // 计算距离上次检查的时间
      const now = Date.now();
      const elapsed = now - lastCheckTime;
      
      // 如果自上次检查以来已经过了足够时间，安排检查
      if (elapsed >= CONFIG.mutationDelayMS) {
        pendingCheck = setTimeout(() => {
          checkForErrorAndRetry();
        }, CONFIG.mutationDelayMS);
      }
    }

    // 添加手动选择按钮功能
    function addManualSelectionMode() {
      // 创建手动选择按钮
      const manualSelectBtn = document.createElement('div');
      manualSelectBtn.id = 'deepseek-manual-select';
      manualSelectBtn.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 10px;
        background: rgba(0, 0, 255, 0.7);
        color: white;
        padding: 5px 8px;
        border-radius: 5px;
        font-size: 10px;
        z-index: 10001;
        cursor: pointer;
        display: none;
      `;
      manualSelectBtn.textContent = '点击选择重试按钮';
      document.body.appendChild(manualSelectBtn);
      
      // 在错误状态下显示手动选择按钮
      document.addEventListener('keydown', (e) => {
        // Alt+R 组合键显示手动选择按钮
        if (e.altKey && e.key === 'r') {
          manualSelectBtn.style.display = manualSelectBtn.style.display === 'none' ? 'block' : 'none';
          if (manualSelectBtn.style.display === 'block') {
            startManualSelectionMode();
          } else {
            stopManualSelectionMode();
          }
        }
      });
      
      manualSelectBtn.addEventListener('click', () => {
        if (manualSelectBtn.textContent === '点击选择重试按钮') {
          startManualSelectionMode();
        } else {
          stopManualSelectionMode();
        }
      });
    }

    // 开始手动选择模式
    function startManualSelectionMode() {
      const manualSelectBtn = document.getElementById('deepseek-manual-select');
      if (!manualSelectBtn) return;
      
      manualSelectBtn.textContent = '取消选择模式';
      manualSelectBtn.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
      
      // 显示提示消息
      const message = document.createElement('div');
      message.id = 'deepseek-selection-message';
      message.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 10002;
      `;
      message.textContent = '请点击页面上的重试按钮，按ESC取消';
      document.body.appendChild(message);
      
      // 添加鼠标悬停效果
      document.addEventListener('mouseover', highlightElementOnHover);
      
      // 添加点击事件处理
      document.addEventListener('click', handleManualSelection);
      
      // 添加ESC键取消
      document.addEventListener('keydown', handleSelectionCancel);
    }

    // 手动选择模式的鼠标悬停效果
    function highlightElementOnHover(e) {
      // 移除之前的临时高亮
      const tempHighlight = document.getElementById('deepseek-temp-highlight');
      if (tempHighlight) {
        document.body.removeChild(tempHighlight);
      }
      
      // 忽略自身UI元素
      if (e.target.closest('#deepseek-manual-select') || 
          e.target.closest('#deepseek-selection-message') ||
          e.target.closest('#deepseek-auto-retry-indicator') ||
          e.target.closest('#deepseek-auto-retry-menu')) {
        return;
      }
      
      // 创建新的临时高亮
      const highlight = document.createElement('div');
      highlight.id = 'deepseek-temp-highlight';
      highlight.style.cssText = `
        position: absolute;
        border: 2px dashed blue;
        background-color: rgba(0, 0, 255, 0.1);
        z-index: 9998;
        pointer-events: none;
      `;
      
      const rect = e.target.getBoundingClientRect();
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      highlight.style.top = `${rect.top + window.scrollY}px`;
      highlight.style.left = `${rect.left + window.scrollX}px`;
      
      document.body.appendChild(highlight);
    }

    // 处理手动选择
    function handleManualSelection(e) {
      // 忽略自身UI元素
      if (e.target.closest('#deepseek-manual-select') || 
          e.target.closest('#deepseek-selection-message') ||
          e.target.closest('#deepseek-auto-retry-indicator') ||
          e.target.closest('#deepseek-auto-retry-menu')) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      // 记录用户选择的按钮
      const selectedElement = e.target;
      console.log("用户手动选择了按钮:", selectedElement);
      
      // 保存该按钮的特征
      const buttonFeature = {
        className: selectedElement.className,
        id: selectedElement.id,
        tagName: selectedElement.tagName,
        innerText: (selectedElement.innerText || "").substring(0, 20),
        manual: true  // 标记为手动选择
      };
      
      // 添加到历史成功按钮
      successfulButtons.push(buttonFeature);
      saveState('successfulButtons', successfulButtons);
      
      // 尝试点击按钮
      forceClickElement(selectedElement);
      
      // 结束选择模式
      stopManualSelectionMode();
      
      // 显示成功消息
      showMessage("已记录该按钮，下次遇到错误将自动点击", 3000);
    }

    // 取消选择模式
    function handleSelectionCancel(e) {
      if (e.key === 'Escape') {
        stopManualSelectionMode();
      }
    }

    // 停止手动选择模式
    function stopManualSelectionMode() {
      // 恢复按钮状态
      const manualSelectBtn = document.getElementById('deepseek-manual-select');
      if (manualSelectBtn) {
        manualSelectBtn.textContent = '点击选择重试按钮';
        manualSelectBtn.style.backgroundColor = 'rgba(0, 0, 255, 0.7)';
        manualSelectBtn.style.display = 'none';
      }
      
      // 移除提示消息
      const message = document.getElementById('deepseek-selection-message');
      if (message) {
        document.body.removeChild(message);
      }
      
      // 移除临时高亮
      const tempHighlight = document.getElementById('deepseek-temp-highlight');
      if (tempHighlight) {
        document.body.removeChild(tempHighlight);
      }
      
      // 移除事件监听
      document.removeEventListener('mouseover', highlightElementOnHover);
      document.removeEventListener('click', handleManualSelection);
      document.removeEventListener('keydown', handleSelectionCancel);
    }

    // 设置监控
    function setupMonitoring() {
      // 初次检查
      setTimeout(checkForErrorAndRetry, 1000);
      
      // 设置定时检查
      setInterval(() => {
        if (isEnabled && !pendingCheck) {
          checkForErrorAndRetry();
        }
      }, CONFIG.checkIntervalMS);
      
      // 设置MutationObserver
      const observer = new MutationObserver(scheduleCheck);
      
      // 开始监听页面变化
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    // 初始化插件
    function init() {
      if (CONFIG.indicatorVisible) {
        createUI();
      }
      
      // 添加手动选择按钮功能
      addManualSelectionMode();
      
      if (isEnabled) {
        setupMonitoring();
      }
      
      console.log("DeepSeek自动重试插件初始化完成");
    }

    // 确保页面已加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
})();