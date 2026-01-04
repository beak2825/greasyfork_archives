// ==UserScript==
// @name         webAI聊天问题列表导航
// @namespace    http://tampermonkey.net/
// @version      4.1.1
// @description  通过点击按钮显示用户问题列表，支持导航到特定问题、分页功能、正序/倒序切换，智能脉冲式加载历史记录突破懒加载，自动适配暗黑模式，按钮可拖动并保存位置，悬浮窗智能展开方向，无极调整按钮大小，新增NotebookLM支持
// @author       yutao
// @match        https://github.com/copilot/*
// @match        https://yuanbao.tencent.com/chat/*
// @match        https://chat.qwen.ai/c/*
// @match        https://copilot.microsoft.com/chats/*
// @match        https://chatgpt.com/c/*
// @match        https://chat.deepseek.com/a/chat/*
// @match        https://www.tongyi.com/*
// @match        https://www.qianwen.com/*
// @match        https://www.doubao.com/*
// @match        https://www.chatglm.cn/*
// @match        https://www.kimi.com/chat/*
// @match        https://copilot.wps.cn/*
// @match        https://notebooklm.google.com/*
// @match        https://gemini.google.com/*
// @match        https://lmarena.ai/*
// @match        https://agent.minimaxi.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// MIT License
//
// Copyright (c) [2025] [yutao]
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.@license
// @downloadURL https://update.greasyfork.org/scripts/528739/webAI%E8%81%8A%E5%A4%A9%E9%97%AE%E9%A2%98%E5%88%97%E8%A1%A8%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/528739/webAI%E8%81%8A%E5%A4%A9%E9%97%AE%E9%A2%98%E5%88%97%E8%A1%A8%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  
  // 配置工厂函数 - 创建统一的网站配置结构
  function createSiteConfig(options) {
    return {
      messageSelector: options.messageSelector,
      textSelector: options.textSelector !== undefined ? options.textSelector : null,
      userCondition: options.userCondition || ((element) => true),
      scrollContainerSelector: options.scrollContainerSelector || 
        'div[class*="overflow"], div[class*="scroll"], main',
      useScrollContainerForMessages: options.useScrollContainerForMessages || false,
    };
  }

  // 预定义的用户条件函数
  const userConditions = {
    // 默认条件：所有消息都是用户消息
    alwaysTrue: (element) => true,
    
    // 检查类名是否包含特定字符串
    hasClass: (className) => (element) => element.classList.contains(className),
  };

  // 配置对象，定义不同网站的聊天消息选择器和条件
  const config = {
      "lmarena.ai": createSiteConfig({
      messageSelector: '.self-end',
      textSelector: '.text-wrap ',
      scrollContainerSelector: 'div[data-radix-scroll-area-viewport][style*="overflow"]'

    }),

    "gemini.google.com": createSiteConfig({
      messageSelector: '.user-query-bubble-container,.user-query-bubble-with-background',
      textSelector: '.query-text',
      scrollContainerSelector: 'infinite-scroller.chat-history, .chat-history-scroll-container',
    }),
    "agent.minimaxi.com": createSiteConfig({
      messageSelector: '.message.sent',
      textSelector: '.message-content .text-pretty',
      scrollContainerSelector: '#message-container',
    }),
    "chat.qwen.ai": createSiteConfig({
      messageSelector: "div.rounded-3xl.bg-gray-50.dark\\:bg-gray-850",
      textSelector: "p",
      scrollContainerSelector: 'div.overflow-y-auto, div[class*="chat-content"]',
    }),

    "tongyi.com": createSiteConfig({
      messageSelector: 'div[class*="questionItem"]',
      textSelector: 'div[class*="contentBox"] div[class*="bubble"]',
      scrollContainerSelector: 'div[class*="contentWrapper"], main, div[class*="chat-content"], div[class*="chatContent"]',
    }),

    "qianwen.com": createSiteConfig({
      messageSelector: 'div[class*="questionItem"]',
      textSelector: 'div[class*="contentBox"] div[class*="bubble"]',
      scrollContainerSelector: 'div[class*="contentWrapper"], main, div[class*="chat-content"], div[class*="chatContent"]',
    }),

    "yuanbao.tencent.com": createSiteConfig({
      messageSelector: "div.agent-chat__bubble__content",
      textSelector: "div.hyc-content-text",
      scrollContainerSelector: ".agent-chat__bubble-wrap",
    }),

    "doubao.com": createSiteConfig({
      messageSelector: 'div[data-testid="send_message"]',
      textSelector: 'div[data-testid="message_text_content"]',
      scrollContainerSelector: 'div[class*="scrollable-"][class*="show-scrollbar-"]',
    }),

    "copilot.wps.cn": createSiteConfig({
      messageSelector: 'li.item--user, div[class*="item--user"], li[class*="item--user"], .item.item--user',
      textSelector: '.item__value span, div[class*="item__value"] span, .item__value, [class*="item__value"]',
      scrollContainerSelector: '.chat, .p__main, div[class*="scrollbar"], div[class*="chat-list"], div[class*="scroll"], .scroll-container',
    }),

    "www.kimi.com": createSiteConfig({
      messageSelector: 'div.segment-user, div[class*="segment-user"]',
      textSelector: '.user-content, div[class*="user-content"]',
      scrollContainerSelector: 'div[class*="scrollbar"], div[class*="chat-history"]',
    }),

    "chatglm.cn": createSiteConfig({
      messageSelector: 'div.conversation.question, div[id*="row-question"]',
      textSelector: '.question-txt span, div[id*="row-question-p"] span',
      scrollContainerSelector: 'div[class*="chat-history"], div[class*="scrollable"]',
    }),

    "chat.deepseek.com": createSiteConfig({
      messageSelector: "div.fbb737a4",
      scrollContainerSelector: ".scroll-container",
    }),

    "github.com": createSiteConfig({
      messageSelector: "div.UserMessage-module__container--cAvvK.ChatMessage-module__userMessage--xvIFp",
      userCondition: userConditions.hasClass("ChatMessage-module__userMessage--xvIFp"),
      scrollContainerSelector: ".react-scroll-to-bottom--css-xgtui-79elbk",
    }),

    "copilot.microsoft.com": createSiteConfig({
      messageSelector: "div.self-end.rounded-2xl",
      userCondition: userConditions.hasClass("self-end"),
      scrollContainerSelector: ".overflow-y-auto.flex-1",
    }),

    "chatgpt.com": createSiteConfig({
      messageSelector: "div.rounded-3xl.bg-token-message-surface",
      textSelector: "div.whitespace-pre-wrap",
      scrollContainerSelector: "main div.overflow-y-auto",
    }),

    "notebooklm.google.com": createSiteConfig({
      messageSelector: '.from-user-container',
      textSelector: 'div, p, span',
      userCondition: userConditions.hasClass('from-user-container'),
      scrollContainerSelector: '.chat-panel-content, chat-pane, .chat-panel, main, div[class*="scroll"]',
      useScrollContainerForMessages: true,
    }),
  };

  const genericConfig = {
    // 消息选择器：匹配常见的消息元素模式
    messageSelector:
      'div[class*="message"], div[class*="chat"], div[class*="user"], div[class*="question"], div[class*="questionItem"]',

    // 文本选择器：匹配常见的文本容器
    textSelector:
      'div[class*="text"], div[class*="content"], p, span[class*="content"], div[class*="contentBox"]',

    // 用户消息条件：使用多种通用的方法识别用户消息
    userCondition: (element) => {
      // 检查常见的用户消息类名
      if (
        element.classList.toString().includes("user") ||
        element.classList.toString().includes("question") ||
        element.classList.toString().includes("self") ||
        element.classList.toString().includes("right") ||
        element.classList.toString().includes("message")
      )
        return true;

      // 检查常见的用户角色属性
      if (
        element.getAttribute("data-role") === "user" ||
        element.getAttribute("data-author") === "user" ||
        element.getAttribute("data-message-author-role") === "user"
      )
        return true;

      // 检查布局特征 (右对齐通常表示用户消息)
      const style = window.getComputedStyle(element);
      if (
        style.justifyContent === "flex-end" ||
        style.textAlign === "right" ||
        style.alignSelf === "flex-end"
      )
        return true;

      // 检查文本内容特征：如果没有包含AI常用的前缀标识
      const text = element.textContent.trim().toLowerCase();
      if (
        text &&
        text.length > 0 &&
        !text.startsWith("ai:") &&
        !text.startsWith("assistant:") &&
        !text.startsWith("bot:")
      )
        return true;

      return false;
    },

    // 滚动容器选择器：匹配常见的滚动容器
    scrollContainerSelector:
      'div[class*="overflow"], div[class*="scroll"], div[class*="chat-container"], div[class*="message-container"], #messages-container, main',
  };

  // 获取当前域名并选择配置
  const hostname = window.location.hostname;

  // 获取当前网站的配置，如果没有特定配置则使用通用配置
  const currentConfig = config[hostname] || genericConfig;

  // 暗黑模式检测和主题管理
  const themeManager = {
    isDark: false,
    
    // 检测暗黑模式
    detectDarkMode() {
      // 1. 检查系统偏好
      const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // 2. 检查网站是否使用暗黑模式
      const htmlDark = document.documentElement.classList.contains('dark') || 
                       document.documentElement.getAttribute('data-theme') === 'dark';
      const bodyDark = document.body.classList.contains('dark') || 
                       document.body.getAttribute('data-theme') === 'dark';
      
      // 3. 检查背景色
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const bgDark = this.isColorDark(bodyBg);
      
      this.isDark = htmlDark || bodyDark || bgDark || systemDark;
      return this.isDark;
    },
    
    // 判断颜色是否为暗色
    isColorDark(color) {
      const rgb = color.match(/\d+/g);
      if (!rgb || rgb.length < 3) return false;
      const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
      return brightness < 128;
    },
    
    // 获取主题颜色
    getColors() {
      if (this.isDark) {
        return {
          // 暗黑模式
          buttonBg: "linear-gradient(135deg, #1e40af, #0ea5e9)",
          buttonColor: "#e5e7eb",
          windowBg: "#1f2937",
          windowBorder: "#374151",
          windowShadow: "0 4px 12px rgba(0,0,0,0.5)",
          textPrimary: "#f3f4f6",
          textSecondary: "#9ca3af",
          itemHoverBg: "#374151",
          itemBorder: "#4b5563",
          buttonPrimaryBg: "#10b981",
          buttonPrimaryHover: "#059669",
          buttonSecondaryBg: "#3b82f6",
          buttonSecondaryHover: "#2563eb",
          statusBg: "#374151",
          statusBorder: "#4b5563",
          paginationBg: "#374151",
          paginationActiveBg: "#3b82f6",
          paginationColor: "#e5e7eb",
        };
      } else {
        return {
          // 亮色模式
          buttonBg: "linear-gradient(135deg, #007BFF, #00C4FF)",
          buttonColor: "#fff",
          windowBg: "#ffffff",
          windowBorder: "#e0e0e0",
          windowShadow: "0 4px 12px rgba(0,0,0,0.15)",
          textPrimary: "#333",
          textSecondary: "#666",
          itemHoverBg: "#f5f5f5",
          itemBorder: "#f0f0f0",
          buttonPrimaryBg: "#28a745",
          buttonPrimaryHover: "#218838",
          buttonSecondaryBg: "#007BFF",
          buttonSecondaryHover: "#0069d9",
          statusBg: "#f8f9fa",
          statusBorder: "#e0e0e0",
          paginationBg: "#f0f0f0",
          paginationActiveBg: "#007BFF",
          paginationColor: "#333",
        };
      }
    }
  };

  // 初始化主题
  themeManager.detectDarkMode();
  const colors = themeManager.getColors();

  // 按钮样式工厂 - 类似 Vue 组件的按钮创建器
  const ButtonFactory = {
    // 按钮样式预设（类似 Vue 的 props）
    presets: {
      primary: {
        background: colors.buttonPrimaryBg,
        hoverBackground: colors.buttonPrimaryHover,
        color: "#fff",
      },
      secondary: {
        background: colors.buttonSecondaryBg,
        hoverBackground: colors.buttonSecondaryHover,
        color: "#fff",
      },
      default: {
        background: colors.paginationBg,
        hoverBackground: colors.itemHoverBg,
        color: colors.paginationColor,
      },
      disabled: {
        background: colors.paginationBg,
        hoverBackground: colors.paginationBg,
        color: colors.textSecondary,
      },
    },

    // 创建按钮（类似 Vue 的 render 函数）
    create(options = {}) {
      const {
        text = "",
        preset = "default",
        onClick = null,
        disabled = false,
        padding = "5px 10px",
        fontSize = "12px",
        borderRadius = "4px",
        customStyle = {},
      } = options;

      const button = document.createElement("button");
      const style = this.presets[disabled ? "disabled" : preset];

      // 设置按钮文本
      button.textContent = text;

      // 应用基础样式
      Object.assign(button.style, {
        padding,
        background: style.background,
        color: style.color,
        border: "none",
        borderRadius,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize,
        transition: "background 0.2s",
        fontFamily: "Arial, sans-serif",
        ...customStyle,
      });

      // 设置禁用状态
      button.disabled = disabled;

      // 添加悬停效果（类似 Vue 的事件处理）
      if (!disabled) {
        button.addEventListener("mouseover", () => {
          button.style.background = style.hoverBackground;
        });
        button.addEventListener("mouseout", () => {
          button.style.background = style.background;
        });
      }

      // 添加点击事件
      if (onClick && !disabled) {
        button.addEventListener("click", onClick);
      }

      return button;
    },

    // 创建分页按钮（特殊类型）
    createPaginationButton(options = {}) {
      const { page, isActive = false, onClick = null } = options;

      return this.create({
        text: String(page),
        preset: isActive ? "secondary" : "default",
        onClick,
        customStyle: {
          background: isActive ? colors.paginationActiveBg : colors.paginationBg,
          color: isActive ? "#fff" : colors.paginationColor,
        },
      });
    },

    // 创建导航按钮（上一页/下一页）
    createNavButton(options = {}) {
      const { text, disabled = false, onClick = null } = options;

      return this.create({
        text,
        preset: disabled ? "disabled" : "secondary",
        disabled,
        onClick,
        customStyle: {
          background: disabled ? colors.paginationBg : colors.paginationActiveBg,
          color: disabled ? colors.textSecondary : "#fff",
        },
      });
    },
  };

  // 右键菜单管理器
  const contextMenuManager = {
    menu: null,
    
    // 创建菜单
    create() {
      if (this.menu) {
        this.destroy();
      }
      
      this.menu = document.createElement('div');
      this.menu.style.cssText = `
        position: fixed;
        background: ${colors.windowBg};
        border: 1px solid ${colors.windowBorder};
        border-radius: 8px;
        box-shadow: ${colors.windowShadow};
        padding: 8px 0;
        min-width: 160px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 13px;
        display: none;
      `;
      
      document.body.appendChild(this.menu);
      return this.menu;
    },
    
    // 添加菜单项
    addItem(text, icon, onClick, isActive = false) {
      const item = document.createElement('div');
      item.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        color: ${colors.textPrimary};
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.2s;
        ${isActive ? `background: ${colors.itemHoverBg};` : ''}
      `;
      
      // 使用 DOM API 而不是 innerHTML，避免 Trusted Types 问题
      const iconSpan = document.createElement('span');
      iconSpan.style.cssText = 'width: 16px; text-align: center;';
      iconSpan.textContent = icon;
      
      const textSpan = document.createElement('span');
      textSpan.style.cssText = 'flex: 1;';
      textSpan.textContent = text;
      
      item.appendChild(iconSpan);
      item.appendChild(textSpan);
      
      if (isActive) {
        const checkSpan = document.createElement('span');
        checkSpan.style.color = colors.buttonSecondaryBg;
        checkSpan.textContent = '✓';
        item.appendChild(checkSpan);
      }
      
      item.addEventListener('mouseover', () => {
        item.style.background = colors.itemHoverBg;
      });
      
      item.addEventListener('mouseout', () => {
        item.style.background = isActive ? colors.itemHoverBg : 'transparent';
      });
      
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        onClick();
        this.hide();
      });
      
      this.menu.appendChild(item);
    },
    
    // 添加分隔线
    addSeparator() {
      const separator = document.createElement('div');
      separator.style.cssText = `
        height: 1px;
        background: ${colors.itemBorder};
        margin: 4px 0;
      `;
      this.menu.appendChild(separator);
    },
    
    // 显示菜单
    show(x, y) {
      if (!this.menu) return;
      
      // 清空现有内容（使用 DOM API 避免 Trusted Types 问题）
      while (this.menu.firstChild) {
        this.menu.removeChild(this.menu.firstChild);
      }
      
      // 构建菜单项
      this.buildMenu();
      
      // 调整位置防止超出屏幕
      const rect = this.menu.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width - 10;
      const maxY = window.innerHeight - rect.height - 10;
      
      x = Math.min(x, maxX);
      y = Math.min(y, maxY);
      
      this.menu.style.left = x + 'px';
      this.menu.style.top = y + 'px';
      this.menu.style.display = 'block';
      
      // 点击其他地方关闭菜单
      setTimeout(() => {
        document.addEventListener('click', this.hide.bind(this), { once: true });
      }, 0);
    },
    
    // 构建菜单内容
    buildMenu() {
      // 按钮大小调整
      this.addItem('调整按钮大小', '📏', () => this.openSizeAdjuster());
      
      this.addSeparator();
      
      // 位置和其他设置
      this.addItem('重置位置', '📍', () => this.resetPosition());
      this.addItem('重置所有设置', '🔄', () => this.resetAllSettings());
      
      // 未来可扩展的设置项
      // this.addSeparator();
      // this.addItem('主题设置', '🎨', () => this.openThemeSettings());
      // this.addItem('高级设置', '⚙️', () => this.openAdvancedSettings());
    },
    
    // 打开大小调整器
    openSizeAdjuster() {
      sizeAdjusterManager.show();
    },
    

    
    // 重置位置
    resetPosition() {
      const defaultPos = settingsManager.defaults.position;
      settingsManager.set('position', defaultPos);
      button.style.bottom = defaultPos.bottom + 'px';
      button.style.right = defaultPos.right + 'px';
      updateFloatWindowPosition();
    },
    
    // 重置所有设置
    resetAllSettings() {
      if (confirm('确定要重置所有设置吗？这将恢复默认的按钮大小和位置。')) {
        settingsManager.reset();
        location.reload(); // 简单粗暴的重置方法
      }
    },
    
    // 隐藏菜单
    hide() {
      if (this.menu) {
        this.menu.style.display = 'none';
      }
    },
    
    // 销毁菜单
    destroy() {
      if (this.menu) {
        this.menu.remove();
        this.menu = null;
      }
    }
  };
  
  // 应用按钮大小
  function applyButtonSize(scale) {
    const style = settingsManager.getButtonStyle(scale);
    button.style.padding = style.padding;
    button.style.fontSize = style.fontSize;
    button.style.borderRadius = style.borderRadius;
    
    // 更新悬浮窗位置（因为按钮大小变了）
    setTimeout(updateFloatWindowPosition, 0);
  }

  // 统一存储适配器 - 优先使用 GM API，回退到 localStorage
  const StorageAdapter = {
    // 检测是否支持 GM API
    hasGMSupport() {
      const hasSupport = typeof GM_setValue !== 'undefined' && typeof GM_getValue !== 'undefined';
      // 首次检测时输出日志
      if (!this._loggedSupport) {
        console.log('[存储适配器] GM API 支持:', hasSupport ? '✅ 是' : '❌ 否，使用 localStorage');
        this._loggedSupport = true;
      }
      return hasSupport;
    },
    
    // 设置值
    set(key, value) {
      try {
        if (this.hasGMSupport()) {
          GM_setValue(key, value);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
        return true;
      } catch (e) {
        console.warn(`存储失败: ${key}`, e);
        return false;
      }
    },
    
    // 获取值
    get(key, defaultValue = null) {
      try {
        if (this.hasGMSupport()) {
          return GM_getValue(key, defaultValue);
        } else {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : defaultValue;
        }
      } catch (e) {
        console.warn(`读取失败: ${key}`, e);
        return defaultValue;
      }
    },
    
    // 删除值
    delete(key) {
      try {
        if (this.hasGMSupport()) {
          GM_deleteValue(key);
        } else {
          localStorage.removeItem(key);
        }
        return true;
      } catch (e) {
        console.warn(`删除失败: ${key}`, e);
        return false;
      }
    },
    
    // 列出所有键
    listKeys() {
      try {
        if (this.hasGMSupport()) {
          return GM_listValues();
        } else {
          return Object.keys(localStorage);
        }
      } catch (e) {
        console.warn('列出键失败', e);
        return [];
      }
    }
  };

  // 设置管理器 - 统一管理所有用户设置
  const settingsManager = {
    storageKeys: {
      position: 'questionListButton_position',
      size: 'questionListButton_size',
      theme: 'questionListButton_theme',
      pageSize: 'questionListButton_pageSize'
    },
    
    // 默认设置
    defaults: {
      position: { bottom: 20, right: 20 },
      buttonScale: 100, // 按钮缩放比例 (50-200)
      theme: 'auto',
      pageSize: 10
    },
    
    // 根据缩放比例计算按钮样式
    getButtonStyle(scale) {
      // 基础样式 (scale = 100 时的标准大小)
      const basePadding = 10; // 10px
      const baseFontSize = 14; // 14px
      const baseBorderRadius = 8; // 8px
      
      // 计算实际值
      const factor = scale / 100;
      const padding = Math.round(basePadding * factor);
      const fontSize = Math.round(baseFontSize * factor);
      const borderRadius = Math.round(baseBorderRadius * factor);
      
      return {
        padding: `${padding}px ${Math.round(padding * 1.5)}px`,
        fontSize: `${fontSize}px`,
        borderRadius: `${borderRadius}px`
      };
    },
    
    // 获取设置
    get(key) {
      return StorageAdapter.get(this.storageKeys[key], this.defaults[key]);
    },
    
    // 保存设置
    set(key, value) {
      return StorageAdapter.set(this.storageKeys[key], value);
    },
    
    // 重置所有设置
    reset() {
      Object.keys(this.storageKeys).forEach(key => {
        StorageAdapter.delete(this.storageKeys[key]);
      });
    }
  };

  // 创建美化后的浮动按钮
  const button = document.createElement("button");
  button.textContent = "问题列表";
  button.style.position = "fixed";
  button.style.zIndex = "2147483647"; // 最大 z-index 值
  button.style.background = colors.buttonBg;
  button.style.color = colors.buttonColor;
  button.style.border = "none";
  button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
  button.style.cursor = "move";
  button.style.fontFamily = "Arial, sans-serif";
  button.style.transition = "transform 0.2s, box-shadow 0.2s";
  button.style.userSelect = "none";
  
  // 恢复保存的位置和大小
  const savedPos = settingsManager.get('position');
  const savedScale = settingsManager.get('buttonScale');
  
  // 验证位置是否在屏幕范围内
  const maxRight = window.innerWidth - 100; // 至少留100px可见
  const maxBottom = window.innerHeight - 50;
  const validRight = Math.min(Math.max(10, savedPos.right), maxRight);
  const validBottom = Math.min(Math.max(10, savedPos.bottom), maxBottom);
  
  button.style.bottom = validBottom + "px";
  button.style.right = validRight + "px";
  
  console.log('[问题列表导航] 位置验证:', {
    保存的位置: savedPos,
    验证后位置: { bottom: validBottom, right: validRight },
    屏幕尺寸: { width: window.innerWidth, height: window.innerHeight }
  });
  
  // 窗口大小变化时重新验证按钮位置
  window.addEventListener('resize', () => {
    const currentRight = parseInt(button.style.right);
    const currentBottom = parseInt(button.style.bottom);
    const newMaxRight = window.innerWidth - 100;
    const newMaxBottom = window.innerHeight - 50;
    
    if (currentRight > newMaxRight || currentBottom > newMaxBottom) {
      button.style.right = Math.min(currentRight, newMaxRight) + "px";
      button.style.bottom = Math.min(currentBottom, newMaxBottom) + "px";
    }
  });
  
  // 应用保存的按钮大小
  applyButtonSize(savedScale);
  
  // 创建右键菜单
  contextMenuManager.create();

  // 大小调整器管理器
  const sizeAdjusterManager = {
    panel: null,
    slider: null,
    input: null,
    
    // 创建调整面板
    create() {
      if (this.panel) {
        this.destroy();
      }
      
      this.panel = document.createElement('div');
      this.panel.style.cssText = `
        position: fixed;
        background: ${colors.windowBg};
        border: 1px solid ${colors.windowBorder};
        border-radius: 12px;
        box-shadow: ${colors.windowShadow};
        padding: 20px;
        width: 300px;
        z-index: 10001;
        font-family: Arial, sans-serif;
        display: none;
      `;
      
      // 标题
      const title = document.createElement('div');
      title.textContent = '调整按钮大小';
      title.style.cssText = `
        font-size: 16px;
        font-weight: bold;
        color: ${colors.textPrimary};
        margin-bottom: 15px;
        text-align: center;
      `;
      
      // 滑块容器
      const sliderContainer = document.createElement('div');
      sliderContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 15px;
      `;
      
      // 滑块
      this.slider = document.createElement('input');
      this.slider.type = 'range';
      this.slider.min = '50';
      this.slider.max = '200';
      this.slider.step = '5';
      this.slider.style.cssText = `
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: ${colors.itemBorder};
        outline: none;
        cursor: pointer;
      `;
      
      // 数值输入框
      this.input = document.createElement('input');
      this.input.type = 'number';
      this.input.min = '50';
      this.input.max = '200';
      this.input.step = '5';
      this.input.style.cssText = `
        width: 60px;
        padding: 6px 8px;
        border: 1px solid ${colors.windowBorder};
        border-radius: 4px;
        background: ${colors.windowBg};
        color: ${colors.textPrimary};
        font-size: 13px;
        text-align: center;
      `;
      
      // 按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: center;
      `;
      
      // 确定按钮
      const okButton = document.createElement('button');
      okButton.textContent = '确定';
      okButton.style.cssText = `
        padding: 8px 16px;
        background: ${colors.buttonSecondaryBg};
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
      `;
      
      // 取消按钮
      const cancelButton = document.createElement('button');
      cancelButton.textContent = '取消';
      cancelButton.style.cssText = `
        padding: 8px 16px;
        background: ${colors.paginationBg};
        color: ${colors.textPrimary};
        border: 1px solid ${colors.windowBorder};
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
      `;
      
      // 组装面板
      sliderContainer.appendChild(this.slider);
      sliderContainer.appendChild(this.input);
      buttonContainer.appendChild(okButton);
      buttonContainer.appendChild(cancelButton);
      
      this.panel.appendChild(title);
      this.panel.appendChild(sliderContainer);
      this.panel.appendChild(buttonContainer);
      
      document.body.appendChild(this.panel);
      
      // 事件监听
      this.setupEvents(okButton, cancelButton);
    },
    
    // 设置事件监听
    setupEvents(okButton, cancelButton) {
      // 滑块变化
      this.slider.addEventListener('input', () => {
        const value = parseInt(this.slider.value);
        this.input.value = value;
        this.previewSize(value);
      });
      
      // 输入框变化
      this.input.addEventListener('input', () => {
        let value = parseInt(this.input.value);
        if (isNaN(value)) return;
        
        value = Math.max(50, Math.min(200, value));
        this.slider.value = value;
        this.previewSize(value);
      });
      
      // 确定按钮
      okButton.addEventListener('click', () => {
        const value = parseInt(this.slider.value);
        settingsManager.set('buttonScale', value);
        this.hide();
      });
      
      // 取消按钮
      cancelButton.addEventListener('click', () => {
        // 恢复原始大小
        const originalScale = settingsManager.get('buttonScale');
        applyButtonSize(originalScale);
        this.hide();
      });
      
      // 点击外部关闭
      setTimeout(() => {
        document.addEventListener('click', (e) => {
          if (!this.panel.contains(e.target)) {
            cancelButton.click();
          }
        }, { once: true });
      }, 0);
    },
    
    // 预览大小变化
    previewSize(scale) {
      applyButtonSize(scale);
    },
    
    // 显示面板
    show() {
      if (!this.panel) {
        this.create();
      }
      
      // 设置当前值
      const currentScale = settingsManager.get('buttonScale');
      this.slider.value = currentScale;
      this.input.value = currentScale;
      
      // 居中显示
      const rect = this.panel.getBoundingClientRect();
      const x = (window.innerWidth - 300) / 2;
      const y = (window.innerHeight - rect.height) / 2;
      
      this.panel.style.left = x + 'px';
      this.panel.style.top = y + 'px';
      this.panel.style.display = 'block';
      
      // 聚焦到滑块
      setTimeout(() => this.slider.focus(), 100);
    },
    
    // 隐藏面板
    hide() {
      if (this.panel) {
        this.panel.style.display = 'none';
      }
    },
    
    // 销毁面板
    destroy() {
      if (this.panel) {
        this.panel.remove();
        this.panel = null;
        this.slider = null;
        this.input = null;
      }
    }
  };
  
  // 拖动功能
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let buttonStartBottom = 0;
  let buttonStartRight = 0;
  
  button.addEventListener("mousedown", (e) => {
    // 只在左键点击时开始拖动
    if (e.button !== 0) return;
    
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    buttonStartBottom = parseInt(button.style.bottom);
    buttonStartRight = parseInt(button.style.right);
    
    button.style.cursor = "grabbing";
    e.preventDefault();
  });
  
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    
    const deltaX = dragStartX - e.clientX;
    const deltaY = dragStartY - e.clientY; // 修正：向下拖动时 deltaY 应该为负
    
    let newBottom = buttonStartBottom + deltaY;
    let newRight = buttonStartRight + deltaX;
    
    // 限制在窗口范围内
    const maxBottom = window.innerHeight - button.offsetHeight - 10;
    const maxRight = window.innerWidth - button.offsetWidth - 10;
    
    newBottom = Math.max(10, Math.min(newBottom, maxBottom));
    newRight = Math.max(10, Math.min(newRight, maxRight));
    
    button.style.bottom = newBottom + "px";
    button.style.right = newRight + "px";
    
    e.preventDefault();
  });
  
  document.addEventListener("mouseup", (e) => {
    if (isDragging) {
      isDragging = false;
      button.style.cursor = "move";
      
      // 保存位置
      const bottom = parseInt(button.style.bottom);
      const right = parseInt(button.style.right);
      settingsManager.set('position', { bottom, right });
      
      // 更新悬浮窗位置
      updateFloatWindowPosition();
      
      // 如果移动距离很小，视为点击
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - dragStartX, 2) + 
        Math.pow(e.clientY - dragStartY, 2)
      );
      
      if (moveDistance < 5) {
        // 触发点击事件
        setTimeout(() => {
          toggleFloatWindow();
        }, 0);
      }
    }
  });
  
  button.addEventListener("mouseover", () => {
    if (!isDragging) {
      button.style.transform = "scale(1.05)";
      button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    }
  });
  button.addEventListener("mouseout", () => {
    if (!isDragging) {
      button.style.transform = "scale(1)";
      button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    }
  });
  
  // 右键菜单事件
  button.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    contextMenuManager.show(e.clientX, e.clientY);
  });
  
  console.log('[问题列表导航] 准备添加按钮到页面...');
  console.log('[问题列表导航] document.body 存在:', !!document.body);
  console.log('[问题列表导航] 按钮样式:', {
    position: button.style.position,
    bottom: button.style.bottom,
    right: button.style.right,
    zIndex: button.style.zIndex,
    background: button.style.background,
    display: button.style.display,
    visibility: button.style.visibility
  });
  
  if (document.body) {
    document.body.appendChild(button);
    console.log('[问题列表导航] ✅ 按钮已添加到页面');
    console.log('[问题列表导航] 按钮尺寸:', button.offsetWidth, 'x', button.offsetHeight);
    console.log('[问题列表导航] 按钮在DOM中:', document.body.contains(button));
    
    // 检查按钮是否被隐藏
    const computedStyle = window.getComputedStyle(button);
    console.log('[问题列表导航] 计算样式:', {
      display: computedStyle.display,
      visibility: computedStyle.visibility,
      opacity: computedStyle.opacity,
      zIndex: computedStyle.zIndex
    });
  } else {
    console.error('[问题列表导航] ❌ document.body 不存在！');
    // 等待 body 加载后再添加
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(button);
      console.log('[问题列表导航] ✅ 按钮已添加到页面 (DOMContentLoaded)');
    });
  }

  // 创建美化后的悬浮窗
  const floatWindow = document.createElement("div");
  floatWindow.style.position = "fixed";
  floatWindow.style.width = "320px";
  floatWindow.style.maxHeight = "420px";
  floatWindow.style.background = colors.windowBg;
  floatWindow.style.border = `1px solid ${colors.windowBorder}`;
  floatWindow.style.borderRadius = "10px";
  floatWindow.style.boxShadow = colors.windowShadow;
  floatWindow.style.padding = "15px";
  floatWindow.style.overflowY = "auto";
  floatWindow.style.display = "none";
  floatWindow.style.zIndex = "2147483646"; // 比按钮低一点
  floatWindow.style.fontFamily = "Arial, sans-serif";
  floatWindow.style.transition = "opacity 0.2s";
  
  // 更新悬浮窗位置的函数 - 智能选择展开方向
  function updateFloatWindowPosition() {
    const buttonBottom = parseInt(button.style.bottom);
    const buttonRight = parseInt(button.style.right);
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const floatWindowWidth = 320;
    const floatWindowHeight = 420; // maxHeight
    const gap = 10; // 间距
    
    // 计算按钮在屏幕上的实际位置
    const buttonLeft = windowWidth - buttonRight - buttonWidth;
    const buttonTop = windowHeight - buttonBottom - buttonHeight;
    
    // 重置之前的定位属性
    floatWindow.style.top = 'auto';
    floatWindow.style.bottom = 'auto';
    floatWindow.style.left = 'auto';
    floatWindow.style.right = 'auto';
    
    // 1. 判断垂直方向：上方还是下方展开
    const spaceAbove = buttonTop; // 按钮上方的空间
    const spaceBelow = windowHeight - buttonTop - buttonHeight; // 按钮下方的空间
    
    if (spaceAbove >= floatWindowHeight || spaceAbove >= spaceBelow) {
      // 上方空间足够，在按钮上方展开
      floatWindow.style.bottom = (buttonBottom + buttonHeight + gap) + "px";
    } else {
      // 上方空间不足，在按钮下方展开
      floatWindow.style.top = (buttonTop + buttonHeight + gap) + "px";
    }
    
    // 2. 判断水平方向：左侧还是右侧对齐
    const spaceOnRight = buttonLeft + buttonWidth;
    const spaceOnLeft = windowWidth - buttonLeft;
    
    if (spaceOnRight >= floatWindowWidth) {
      // 右对齐（悬浮窗在按钮左侧或与按钮右边缘对齐）
      floatWindow.style.right = buttonRight + "px";
    } else if (spaceOnLeft >= floatWindowWidth) {
      // 左对齐（悬浮窗在按钮右侧或与按钮左边缘对齐）
      floatWindow.style.left = buttonLeft + "px";
    } else {
      // 空间不足，居中显示
      const centerLeft = Math.max(gap, (windowWidth - floatWindowWidth) / 2);
      floatWindow.style.left = centerLeft + "px";
    }
  }
  
  // 初始化悬浮窗位置
  updateFloatWindowPosition();
  
  document.body.appendChild(floatWindow);

  // 手动检测当前浏览位置（调试用）
  window.detectPosition = function() {
    console.log('=== 手动检测浏览位置 ===');
    console.log('问题总数:', questions.length);
    console.log('当前索引:', currentViewingIndex);
    
    if (questions.length === 0) {
      console.log('没有问题，请先打开问题列表');
      return;
    }
    
    // 强制检测
    const oldIndex = currentViewingIndex;
    currentViewingIndex = -1; // 重置以强制更新
    detectCurrentViewingMessage();
    
    console.log('检测后索引:', currentViewingIndex);
    if (currentViewingIndex >= 0) {
      console.log('当前浏览的问题:', questions[currentViewingIndex].text.substring(0, 50));
    }
  };

  // 存储测试函数（开发调试用）
  window.testStorage = function() {
    console.log('=== 存储测试开始 ===');
    
    // 测试1: 检测 GM API
    console.log('1. GM API 支持:', StorageAdapter.hasGMSupport());
    
    // 测试2: 写入测试
    const testKey = 'test_storage_' + Date.now();
    const testValue = { time: Date.now(), data: '测试数据' };
    console.log('2. 写入测试数据:', testValue);
    const writeSuccess = StorageAdapter.set(testKey, testValue);
    console.log('   写入结果:', writeSuccess ? '✅ 成功' : '❌ 失败');
    
    // 测试3: 读取测试
    const readValue = StorageAdapter.get(testKey);
    console.log('3. 读取测试数据:', readValue);
    console.log('   读取结果:', JSON.stringify(readValue) === JSON.stringify(testValue) ? '✅ 成功' : '❌ 失败');
    
    // 测试4: 删除测试
    StorageAdapter.delete(testKey);
    const afterDelete = StorageAdapter.get(testKey);
    console.log('4. 删除后读取:', afterDelete);
    console.log('   删除结果:', afterDelete === null ? '✅ 成功' : '❌ 失败');
    
    // 测试5: 收藏功能
    console.log('5. 当前页面ID:', FavoriteManager.getPageId());
    console.log('   当前收藏:', FavoriteManager.getAll());
    
    console.log('=== 存储测试完成 ===');
    console.log('提示: 刷新页面后再次运行 testStorage() 检查数据是否持久化');
  };

  // 消息计数管理器 - 记录每个页面的消息总数
  const MessageCountManager = {
    storageKey: 'questionList_messageCounts',
    
    // 获取当前页面的唯一标识
    getPageId() {
      return window.location.pathname + window.location.search;
    },
    
    // 获取记录的消息总数
    getCount() {
      const pageId = this.getPageId();
      const allCounts = StorageAdapter.get(this.storageKey, {});
      return allCounts[pageId] || 0;
    },
    
    // 保存消息总数
    saveCount(count) {
      const pageId = this.getPageId();
      const allCounts = StorageAdapter.get(this.storageKey, {});
      // 只在数量变化时保存和输出日志
      if (allCounts[pageId] !== count) {
        allCounts[pageId] = count;
        StorageAdapter.set(this.storageKey, allCounts);
        console.log('[消息计数] 保存消息总数:', count);
      }
    },
    
    // 检查是否需要加载历史
    shouldLoadHistory(currentCount) {
      const savedCount = this.getCount();
      return savedCount > 0 && currentCount < savedCount;
    }
  };

  // 收藏管理器（带缓存优化）
  const FavoriteManager = {
    storageKey: 'questionList_favorites',
    _cache: null,        // 缓存当前页面的收藏列表
    _cachePageId: null,  // 缓存对应的页面ID
    
    // 获取当前页面的唯一标识（用于区分不同对话）
    getPageId() {
      return window.location.pathname + window.location.search;
    },
    
    // 使缓存失效
    invalidateCache() {
      this._cache = null;
      this._cachePageId = null;
    },
    
    // 获取所有收藏（带缓存）
    getAll() {
      const pageId = this.getPageId();
      
      // 如果缓存有效，直接返回
      if (this._cache !== null && this._cachePageId === pageId) {
        return this._cache;
      }
      
      // 从存储读取并缓存
      const allFavorites = StorageAdapter.get(this.storageKey, {});
      this._cache = allFavorites[pageId] || [];
      this._cachePageId = pageId;
      return this._cache;
    },
    
    // 保存收藏（同时更新缓存）
    saveAll(favorites) {
      const pageId = this.getPageId();
      const allFavorites = StorageAdapter.get(this.storageKey, {});
      allFavorites[pageId] = favorites;
      StorageAdapter.set(this.storageKey, allFavorites);
      
      // 更新缓存
      this._cache = favorites;
      this._cachePageId = pageId;
    },
    
    // 检查是否已收藏
    isFavorite(questionText) {
      return this.getAll().includes(questionText);
    },
    
    // 添加收藏
    add(questionText) {
      const favorites = this.getAll().slice(); // 复制数组
      if (!favorites.includes(questionText)) {
        favorites.push(questionText);
        this.saveAll(favorites);
      }
    },
    
    // 移除收藏
    remove(questionText) {
      const favorites = this.getAll().filter(text => text !== questionText);
      this.saveAll(favorites);
    },
    
    // 切换收藏状态
    toggle(questionText) {
      const isFav = this.isFavorite(questionText);
      if (isFav) {
        this.remove(questionText);
        return false;
      } else {
        this.add(questionText);
        return true;
      }
    },
    
    // 获取收藏的问题对象
    getFavoriteQuestions(allQuestions) {
      const favorites = this.getAll();
      return allQuestions.filter(q => favorites.includes(q.text));
    }
  };

  // 分页相关变量
  let questions = [];
  const pageSize = 10;
  let currentPage = 1;
  let isReversed = false;
  let isLoading = false; // 加载状态标志
  let autoLoadCompleted = false; // 标记自动加载是否已完成
  let currentViewingIndex = -1; // 当前正在浏览的消息索引

  // 创建顶部按钮容器
  const topButtonContainer = document.createElement("div");
  topButtonContainer.style.display = "flex";
  topButtonContainer.style.justifyContent = "space-between";
  topButtonContainer.style.marginBottom = "15px";

  // 使用按钮工厂创建加载历史按钮
  const loadButton = ButtonFactory.create({
    text: "加载历史",
    preset: "primary",
    onClick: () => loadHistoryRecords(),
  });

  // 使用按钮工厂创建排序切换按钮
  const sortButton = ButtonFactory.create({
    text: "正序",
    preset: "secondary",
    onClick: () => {
      isReversed = !isReversed;
      sortButton.textContent = isReversed ? "倒序" : "正序";
      findAllQuestionsWithDeduplication();
    },
  });

  // 状态显示标签
  const statusLabel = document.createElement("div");
  statusLabel.textContent = "正在加载历史...";
  statusLabel.style.fontSize = "12px";
  statusLabel.style.color = colors.textSecondary;
  statusLabel.style.padding = "5px 0";
  statusLabel.style.display = "none"; // 默认隐藏

  // 将按钮添加到容器中
  topButtonContainer.appendChild(statusLabel);
  topButtonContainer.appendChild(loadButton);
  topButtonContainer.appendChild(sortButton);
  floatWindow.appendChild(topButtonContainer);

  // 创建分页控件
  const paginationContainer = document.createElement("div");
  paginationContainer.style.display = "flex";
  paginationContainer.style.justifyContent = "center";
  paginationContainer.style.marginTop = "10px";
  paginationContainer.style.gap = "5px";

  // 创建收藏区域容器
  const favoriteContainer = document.createElement("div");
  favoriteContainer.style.marginBottom = "10px";
  favoriteContainer.style.display = "none"; // 默认隐藏，有收藏时才显示
  
  const favoriteTitle = document.createElement("div");
  favoriteTitle.style.fontSize = "12px";
  favoriteTitle.style.fontWeight = "bold";
  favoriteTitle.style.color = colors.textPrimary;
  favoriteTitle.style.padding = "5px 0";
  favoriteTitle.style.borderBottom = `2px solid ${colors.buttonPrimaryBg}`;
  favoriteTitle.style.marginBottom = "5px";
  favoriteTitle.textContent = "📌 收藏";
  
  const favoriteList = document.createElement("ul");
  favoriteList.style.listStyle = "none";
  favoriteList.style.padding = "0";
  favoriteList.style.margin = "0 0 10px 0";
  
  favoriteContainer.appendChild(favoriteTitle);
  favoriteContainer.appendChild(favoriteList);
  floatWindow.appendChild(favoriteContainer);

  // 创建问题计数显示区域
  const questionCountDisplay = document.createElement("div");
  questionCountDisplay.style.fontSize = "12px";
  questionCountDisplay.style.color = colors.textSecondary;
  questionCountDisplay.style.textAlign = "center";
  questionCountDisplay.style.margin = "5px 0 10px 0";
  floatWindow.appendChild(questionCountDisplay);

  // 问题列表容器
  const listContainer = document.createElement("ul");
  listContainer.style.listStyle = "none";
  listContainer.style.padding = "0";
  listContainer.style.margin = "0";
  floatWindow.appendChild(listContainer);
  floatWindow.appendChild(paginationContainer);

  // 更新问题计数显示
  function updateQuestionCountDisplay() {
    questionCountDisplay.textContent = `共找到 ${questions.length} 个问题`;
  }

  // 获取文本内容的辅助函数
  function getTextContent(element) {
    return element ? element.textContent.trim() : "";
  }

  // 查找所有用户问题并去重的函数
  function findAllQuestionsWithDeduplication() {
    // 选择聊天容器
    let chatContainer = null;
    
    // 检查配置是否要求使用滚动容器来查找消息
    if (currentConfig.useScrollContainerForMessages && currentConfig.scrollContainerSelector) {
      // 使用配置的滚动容器选择器
      const selectors = currentConfig.scrollContainerSelector.split(',');
      for (const selector of selectors) {
        chatContainer = document.querySelector(selector.trim());
        if (chatContainer) break;
      }
    }
    
    // 如果没找到，使用通用选择器
    if (!chatContainer) {
      chatContainer = document.querySelector(".chat-container, #chat, main, article") || document.body;
    }
    
    const potentialMessages = chatContainer.querySelectorAll(
      currentConfig.messageSelector
    );

    // 调试信息（仅在找不到消息时输出）
    if (potentialMessages.length === 0) {
      console.log('[问题列表导航] 调试信息:', {
        网站: hostname,
        消息选择器: currentConfig.messageSelector,
        找到的元素数量: potentialMessages.length,
        提示: '如果一直为0，说明选择器不匹配当前页面结构'
      });
    }

    // 临时存储所有找到的问题
    const foundQuestions = [];
    const seenTexts = new Set(); // 用于去重
    let filteredCount = 0; // 被过滤掉的消息数量

    for (let i = 0; i < potentialMessages.length; i++) {
      const element = potentialMessages[i];
      const textElement = currentConfig.textSelector
        ? element.querySelector(currentConfig.textSelector)
        : element;
      const text = getTextContent(textElement);

      // 如果文本内容有效且符合用户消息条件
      if (text && text.length > 2) {
        if (currentConfig.userCondition(element)) {
          // 使用文本内容进行去重
          if (!seenTexts.has(text)) {
            seenTexts.add(text);
            foundQuestions.push({ element, text });
          }
        } else {
          filteredCount++;
        }
      }
    }

    // 调试信息（仅在找到元素但没有用户消息时输出）
    if (potentialMessages.length > 0 && foundQuestions.length === 0) {
      console.log('[问题列表导航] 调试信息:', {
        网站: hostname,
        找到的消息元素: potentialMessages.length,
        通过用户条件的: foundQuestions.length,
        被过滤的: filteredCount,
        提示: '找到了消息元素，但 userCondition 过滤掉了所有消息。可能需要调整 userCondition 逻辑'
      });
    }

    // 更新全局问题列表
    questions = foundQuestions;

    // 确保排序正确
    if (isReversed) {
      questions.reverse();
    }

    // 更新界面
    updateQuestionCountDisplay();
    renderPage(currentPage);
    updatePagination();
  }

  // 改进的懒加载突破函数 - 使用脉冲式滚动和智能检测
  async function loadHistoryRecords() {
    if (isLoading) {
      // 如果正在加载，点击按钮可以停止加载
      isLoading = false;
      statusLabel.textContent = "已停止加载";
      setTimeout(() => {
        statusLabel.style.display = "none";
      }, 2000);
      return;
    }

    isLoading = true;
    statusLabel.textContent = "正在加载历史... (再次点击停止)";
    statusLabel.style.display = "block";

    // 智能查找滚动容器（排除侧边栏）
    function findScrollContainer() {
      // 辅助函数：判断是否是侧边栏（通常宽度较小，在左侧）
      function isSidebar(element) {
        const rect = element.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        // 侧边栏特征：宽度小于窗口的30%，且在左侧
        return rect.width < windowWidth * 0.3 && rect.left < 100;
      }

      // 1. 尝试配置的选择器（支持多个选择器，用逗号分隔）
      const selectors = currentConfig.scrollContainerSelector.split(",");
      for (const selector of selectors) {
        const container = document.querySelector(selector.trim());
        if (
          container &&
          container.scrollHeight > container.clientHeight &&
          !isSidebar(container)
        ) {
          return container;
        }
      }

      // 2. 尝试常见的容器
      const commonSelectors = [
        "main",
        "#chat-history",
        '[class*="chat-content"]',
        '[class*="message-container"]',
        '[class*="chatContent"]',
      ];

      for (const selector of commonSelectors) {
        const container = document.querySelector(selector);
        if (
          container &&
          container.scrollHeight > container.clientHeight &&
          !isSidebar(container)
        ) {
          return container;
        }
      }

      // 3. 启发式查找：找到最后一条消息的可滚动父元素（排除侧边栏）
      const lastMessage = document.querySelector(
        currentConfig.messageSelector
      );
      if (lastMessage) {
        let parent = lastMessage.parentElement;
        while (parent && parent !== document.body) {
          const style = window.getComputedStyle(parent);
          if (
            (style.overflowY === "auto" || style.overflowY === "scroll") &&
            parent.scrollHeight > parent.clientHeight &&
            !isSidebar(parent)
          ) {
            return parent;
          }
          parent = parent.parentElement;
        }
      }

      // 4. 回退到 documentElement
      return document.documentElement;
    }

    const container = findScrollContainer();
    const originalScrollTop = container.scrollTop;
    const initialQuestionCount = questions.length;

    let consecutiveNoChange = 0;
    let lastQuestionCount = questions.length;
    let iteration = 0;
    const maxRetryAfterNoChange = 2; // 没有新内容后，再尝试2次确认

    // 脉冲式滚动加载循环
    while (isLoading && consecutiveNoChange <= maxRetryAfterNoChange) {
      iteration++;

      // 1. 脉冲式滚动 - 模拟用户滚动行为
      // 先向下滚动一点，再滚动到顶部，触发懒加载机制
      container.scrollTop = Math.min(100, container.scrollHeight * 0.1);
      await new Promise((resolve) => setTimeout(resolve, 100));

      container.scrollTop = 0;
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 2. 触发滚动事件（某些框架需要）
      container.dispatchEvent(new Event("scroll", { bubbles: true }));

      // 3. 动态等待 - 根据是否有新内容调整
      // 如果一直有新内容，等待时间短一些；如果没有新内容，等待时间长一些确认
      const waitTime = consecutiveNoChange === 0 ? 600 : 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      // 4. 扫描新内容
      const preCount = questions.length;
      findAllQuestionsWithDeduplication();
      const postCount = questions.length;

      // 5. 检测变化
      const questionsChanged = postCount > lastQuestionCount;
      const newQuestionsCount = postCount - lastQuestionCount;

      if (questionsChanged) {
        // 发现新内容
        consecutiveNoChange = 0;
        lastQuestionCount = postCount;

        statusLabel.textContent = `已加载 ${postCount} 个问题 (+${newQuestionsCount})`;
        console.log(`[历史加载] 第${iteration}次: 新增 ${newQuestionsCount} 个问题，总计 ${postCount} 个`);
      } else {
        // 没有新内容
        consecutiveNoChange++;
        statusLabel.textContent = `检查中... (${consecutiveNoChange}/${maxRetryAfterNoChange + 1})`;
        console.log(`[历史加载] 第${iteration}次: 没有新内容，连续 ${consecutiveNoChange} 次`);
        
        // 如果已经连续多次没有新内容，说明已经到底了
        if (consecutiveNoChange > maxRetryAfterNoChange) {
          console.log(`[历史加载] 连续 ${consecutiveNoChange} 次没有新内容，停止加载`);
          break;
        }
      }

      // 6. 额外的触发机制：模拟鼠标滚轮事件（每3次触发一次）
      if (iteration % 3 === 0) {
        const wheelEvent = new WheelEvent("wheel", {
          deltaY: -100,
          bubbles: true,
          cancelable: true,
        });
        container.dispatchEvent(wheelEvent);
      }
    }

    // 恢复原始滚动位置
    container.scrollTop = originalScrollTop;

    // 完成加载
    const newQuestions = questions.length - initialQuestionCount;
    isLoading = false;
    autoLoadCompleted = true;

    // 生成加载结果提示
    let resultMessage;
    if (newQuestions > 0) {
      resultMessage = `✓ 成功加载 ${newQuestions} 条新记录 (共${questions.length}条)`;
      console.log(`[历史加载] 完成: 新增 ${newQuestions} 条，总计 ${questions.length} 条，共尝试 ${iteration} 次`);
    } else {
      resultMessage = consecutiveNoChange > maxRetryAfterNoChange 
        ? "已加载所有历史记录" 
        : "未找到更多历史记录";
      console.log(`[历史加载] 完成: 没有新内容，共尝试 ${iteration} 次`);
    }
    
    statusLabel.textContent = resultMessage;

    // 保存消息总数（用于下次刷新时判断）
    if (questions.length > 0) {
      MessageCountManager.saveCount(questions.length);
    }

    // 延迟隐藏状态标签
    setTimeout(() => {
      statusLabel.style.display = "none";
    }, 4000);
  }

  // 创建问题列表项（带收藏功能）
  function createQuestionItem(q, index, isFavoriteItem = false) {
    // 找到问题在 questions 数组中的实际索引
    const actualIndex = questions.findIndex(item => item.text === q.text);
    const isCurrentViewing = actualIndex === currentViewingIndex;
    
    const listItem = document.createElement("li");
    listItem.style.padding = "8px 12px";
    listItem.style.fontSize = "13px";
    listItem.style.color = colors.textPrimary;
    listItem.style.borderBottom = `1px solid ${colors.itemBorder}`;
    listItem.style.transition = "background 0.2s, border-left 0.2s";
    listItem.style.borderRadius = "4px";
    listItem.style.display = "flex";
    listItem.style.alignItems = "center";
    listItem.style.gap = "8px";
    listItem.title = q.text;
    listItem.dataset.questionIndex = actualIndex; // 存储索引用于更新
    
    // 当前浏览位置标记
    if (isCurrentViewing) {
      listItem.style.borderLeft = `3px solid ${colors.buttonSecondaryBg}`;
      listItem.style.background = colors.itemHoverBg;
      listItem.style.paddingLeft = "9px"; // 补偿边框宽度
    }
    
    // 位置指示器
    const positionIndicator = document.createElement("span");
    positionIndicator.style.fontSize = "10px";
    positionIndicator.style.marginRight = "4px";
    positionIndicator.style.flexShrink = "0";
    positionIndicator.textContent = isCurrentViewing ? "👁️" : "";
    
    // 问题文本容器
    const textContainer = document.createElement("div");
    textContainer.style.flex = "1";
    textContainer.style.cursor = "pointer";
    textContainer.style.whiteSpace = "nowrap";
    textContainer.style.overflow = "hidden";
    textContainer.style.textOverflow = "ellipsis";
    
    const shortText = q.text.substring(0, 18) + (q.text.length > 18 ? "..." : "");
    textContainer.textContent = `${index}: ${shortText}`;
    
    // 星标按钮（只调用一次 isFavorite）
    const isFav = FavoriteManager.isFavorite(q.text);
    const starButton = document.createElement("span");
    starButton.textContent = isFav ? "⭐" : "☆";
    starButton.style.cursor = "pointer";
    starButton.style.fontSize = "16px";
    starButton.style.flexShrink = "0";
    starButton.style.transition = "transform 0.2s";
    starButton.title = isFav ? "取消收藏" : "收藏";
    
    // 星标按钮事件
    starButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const isFavorited = FavoriteManager.toggle(q.text);
      starButton.textContent = isFavorited ? "⭐" : "☆";
      starButton.title = isFavorited ? "取消收藏" : "收藏";
      
      // 重新渲染收藏区域和当前页
      renderFavorites();
      renderPage(currentPage);
    });
    
    starButton.addEventListener("mouseover", () => {
      starButton.style.transform = "scale(1.2)";
    });
    
    starButton.addEventListener("mouseout", () => {
      starButton.style.transform = "scale(1)";
    });
    
    // 文本容器点击事件
    textContainer.addEventListener("click", () => {
      // 立即更新当前浏览位置
      currentViewingIndex = actualIndex;
      updateCurrentViewingIndicator();
      
      // 滚动到目标位置
      q.element.scrollIntoView({ behavior: "smooth", block: "start" });
      floatWindow.style.opacity = "0";
      setTimeout(() => (floatWindow.style.display = "none"), 200);
      button.textContent = "问题列表";
    });
    
    // 悬停效果（保留当前浏览的背景色）
    listItem.addEventListener("mouseover", () => {
      listItem.style.background = colors.itemHoverBg;
    });
    listItem.addEventListener("mouseout", () => {
      // 如果是当前浏览的消息，保持背景色
      const idx = parseInt(listItem.dataset.questionIndex);
      if (idx === currentViewingIndex) {
        listItem.style.background = colors.itemHoverBg;
      } else {
        listItem.style.background = "none";
      }
    });
    
    listItem.appendChild(positionIndicator);
    listItem.appendChild(textContainer);
    listItem.appendChild(starButton);
    
    return listItem;
  }

  // 检测当前正在浏览的消息
  function detectCurrentViewingMessage() {
    if (questions.length === 0) return;
    
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 3; // 使用视口上1/3作为检测点
    
    let closestIndex = -1;
    let closestDistance = Infinity;
    
    for (let i = 0; i < questions.length; i++) {
      const element = questions[i].element;
      if (!element) continue;
      
      const rect = element.getBoundingClientRect();
      // 检查元素是否在视口中
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // 计算元素中心到视口检测点的距离
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }
    }
    
    // 如果找到了新的当前消息，更新显示
    if (closestIndex !== -1 && closestIndex !== currentViewingIndex) {
      currentViewingIndex = closestIndex;
      // 只在悬浮窗可见时更新 UI
      if (floatWindow.style.display !== "none") {
        updateCurrentViewingIndicator();
      }
    }
  }
  
  // 更新当前浏览位置指示器
  function updateCurrentViewingIndicator() {
    // 更新列表中的所有项
    const allItems = listContainer.querySelectorAll('li');
    allItems.forEach(item => {
      const index = parseInt(item.dataset.questionIndex);
      const isCurrentViewing = index === currentViewingIndex;
      
      // 更新样式
      if (isCurrentViewing) {
        item.style.borderLeft = `3px solid ${colors.buttonSecondaryBg}`;
        item.style.background = colors.itemHoverBg;
        item.style.paddingLeft = "9px";
      } else {
        item.style.borderLeft = "none";
        item.style.background = "none";
        item.style.paddingLeft = "12px";
      }
      
      // 更新位置指示器
      const indicator = item.querySelector('span:first-child');
      if (indicator) {
        indicator.textContent = isCurrentViewing ? "👁️" : "";
      }
    });
    
    // 同时更新收藏区域
    const favoriteItems = favoriteList.querySelectorAll('li');
    favoriteItems.forEach(item => {
      const index = parseInt(item.dataset.questionIndex);
      const isCurrentViewing = index === currentViewingIndex;
      
      if (isCurrentViewing) {
        item.style.borderLeft = `3px solid ${colors.buttonSecondaryBg}`;
        item.style.background = colors.itemHoverBg;
        item.style.paddingLeft = "9px";
      } else {
        item.style.borderLeft = "none";
        item.style.background = "none";
        item.style.paddingLeft = "12px";
      }
      
      const indicator = item.querySelector('span:first-child');
      if (indicator) {
        indicator.textContent = isCurrentViewing ? "👁️" : "";
      }
    });
  }
  
  // 设置滚动监听（节流）
  let scrollThrottleTimer = null;
  let scrollListenerSetup = false;
  
  function setupScrollListener() {
    if (scrollListenerSetup) return;
    
    // 滚动处理函数
    const handleScroll = () => {
      if (scrollThrottleTimer) return;
      
      scrollThrottleTimer = setTimeout(() => {
        detectCurrentViewingMessage();
        scrollThrottleTimer = null;
      }, 150); // 150ms 节流
    };
    
    // 查找所有可能的滚动容器并添加监听
    const selectors = currentConfig.scrollContainerSelector.split(",");
    let foundContainer = false;
    
    for (const selector of selectors) {
      const containers = document.querySelectorAll(selector.trim());
      containers.forEach(container => {
        if (container && container.scrollHeight > container.clientHeight) {
          container.addEventListener('scroll', handleScroll, { passive: true });
          foundContainer = true;
        }
      });
    }
    
    // 始终监听 window 和 document 滚动（兜底）
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // 监听 documentElement 滚动
    if (document.documentElement) {
      document.documentElement.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    scrollListenerSetup = true;
    
    // 初始检测
    setTimeout(detectCurrentViewingMessage, 1000);
  }

  // 渲染收藏区域
  function renderFavorites() {
    // 清空收藏列表
    while (favoriteList.firstChild) {
      favoriteList.removeChild(favoriteList.firstChild);
    }
    
    const favoriteQuestions = FavoriteManager.getFavoriteQuestions(questions);
    
    if (favoriteQuestions.length > 0) {
      favoriteContainer.style.display = "block";
      favoriteTitle.textContent = `📌 收藏 (${favoriteQuestions.length})`;
      
      favoriteQuestions.forEach((q) => {
        // 找到问题的原始索引
        const originalIndex = questions.findIndex(item => item.text === q.text);
        const displayIndex = isReversed ? questions.length - originalIndex : originalIndex + 1;
        
        const item = createQuestionItem(q, displayIndex, true);
        favoriteList.appendChild(item);
      });
    } else {
      favoriteContainer.style.display = "none";
    }
  }

  // 使找到的问题定位在屏幕中
  function renderPage(page) {
    // 清空列表容器
    while (listContainer.firstChild) {
      listContainer.removeChild(listContainer.firstChild);
    }

    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    const pageQuestions = questions.slice(start, end);

    pageQuestions.forEach((q, idx) => {
      const displayIndex = isReversed ? questions.length - start - idx : start + idx + 1;
      const item = createQuestionItem(q, displayIndex);
      listContainer.appendChild(item);
    });
    
    // 同时更新收藏区域
    renderFavorites();
  }

  // 更新分页控件
  function updatePagination() {
    // 清空分页容器
    while (paginationContainer.firstChild) {
      paginationContainer.removeChild(paginationContainer.firstChild);
    }

    const totalPages = Math.ceil(questions.length / pageSize);
    if (totalPages) {
      // 使用按钮工厂创建上一页按钮
      const prevButton = ButtonFactory.createNavButton({
        text: "上一页",
        disabled: currentPage === 1,
        onClick: () => {
          if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
            updatePagination();
          }
        },
      });
      paginationContainer.appendChild(prevButton);

      // 显示页码按钮，但限制最多显示5个
      const maxButtons = 5;
      let startPage = Math.max(
        1,
        Math.min(
          currentPage - Math.floor(maxButtons / 2),
          totalPages - maxButtons + 1
        )
      );
      if (startPage < 1) startPage = 1;
      const endPage = Math.min(startPage + maxButtons - 1, totalPages);

      if (startPage > 1) {
        // 使用按钮工厂创建第一页按钮
        const firstPageButton = ButtonFactory.createPaginationButton({
          page: 1,
          isActive: false,
          onClick: () => {
            currentPage = 1;
            renderPage(currentPage);
            updatePagination();
          },
        });
        paginationContainer.appendChild(firstPageButton);

        if (startPage > 2) {
          const ellipsis = document.createElement("span");
          ellipsis.textContent = "...";
          ellipsis.style.padding = "5px";
          ellipsis.style.color = colors.textSecondary;
          paginationContainer.appendChild(ellipsis);
        }
      }

      // 使用按钮工厂创建页码按钮
      for (let i = startPage; i <= endPage; i++) {
        const pageButton = ButtonFactory.createPaginationButton({
          page: i,
          isActive: currentPage === i,
          onClick: () => {
            currentPage = i;
            renderPage(currentPage);
            updatePagination();
          },
        });
        paginationContainer.appendChild(pageButton);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsis = document.createElement("span");
          ellipsis.textContent = "...";
          ellipsis.style.padding = "5px";
          ellipsis.style.color = colors.textSecondary;
          paginationContainer.appendChild(ellipsis);
        }

        // 使用按钮工厂创建最后一页按钮
        const lastPageButton = ButtonFactory.createPaginationButton({
          page: totalPages,
          isActive: false,
          onClick: () => {
            currentPage = totalPages;
            renderPage(currentPage);
            updatePagination();
          },
        });
        paginationContainer.appendChild(lastPageButton);
      }

      // 使用按钮工厂创建下一页按钮
      const nextButton = ButtonFactory.createNavButton({
        text: "下一页",
        disabled: currentPage === totalPages,
        onClick: () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
            updatePagination();
          }
        },
      });
      paginationContainer.appendChild(nextButton);
    }
  }

  // 切换悬浮窗显示状态的函数
  function toggleFloatWindow() {
    if (
      floatWindow.style.display === "none" ||
      floatWindow.style.display === ""
    ) {
      findAllQuestionsWithDeduplication();
      // 打开时检测当前浏览位置
      detectCurrentViewingMessage();
      updateFloatWindowPosition(); // 更新位置
      floatWindow.style.display = "block";
      floatWindow.style.opacity = "1";
      button.textContent = "隐藏列表";
    } else {
      floatWindow.style.opacity = "0";
      setTimeout(() => {
        floatWindow.style.display = "none";
        button.textContent = "问题列表";
      }, 200);
    }
  }
  
  // 注意：点击事件已在拖动逻辑中处理（mouseup 事件）

  // 监听用户输入新问题后触发查找
  function setupInputListener() {
    const input = document.querySelector(
      'textarea, input[type="text"], [contenteditable]'
    );
    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          setTimeout(findAllQuestionsWithDeduplication, 1000);
        }
      });
    }

    // 监听可能的发送按钮点击
    const sendButtons = document.querySelectorAll(
      'button[type="submit"], button[aria-label*="send"], button[aria-label*="发送"]'
    );
    sendButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setTimeout(findAllQuestionsWithDeduplication, 1000);
      });
    });
  }

  // 初始化函数 - 扫描消息并检查是否需要加载历史
  function initializePage() {
    const isAngularApp = hostname.includes('notebooklm') || document.querySelector('[ng-version]');
    const delay = isAngularApp ? 3000 : 1000;
    
    setTimeout(() => {
      // 重置问题列表和缓存
      questions = [];
      currentPage = 1;
      FavoriteManager.invalidateCache();
      
      findAllQuestionsWithDeduplication();
      setupInputListener();
      setupScrollListener();
      
      // NotebookLM 特殊处理
      if (isAngularApp && questions.length === 0) {
        let retryCount = 0;
        const retryInterval = setInterval(() => {
          findAllQuestionsWithDeduplication();
          retryCount++;
          
          if (questions.length > 0 || retryCount >= 3) {
            clearInterval(retryInterval);
          }
        }, 2000);
      }
      
      // 智能加载历史记录
      setTimeout(() => {
        const currentCount = questions.length;
        const shouldLoad = MessageCountManager.shouldLoadHistory(currentCount);
        
        if (shouldLoad) {
          statusLabel.style.display = 'none';
          loadHistoryRecords();
        } else {
          if (currentCount > 0) {
            MessageCountManager.saveCount(currentCount);
          }
        }
      }, delay + 1000);
    }, delay);
  }

  // 监听 URL 变化（SPA 路由切换）
  let lastUrl = window.location.href;
  
  function checkUrlChange() {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      // URL 变化时使收藏缓存失效
      FavoriteManager.invalidateCache();
      // 延迟初始化，等待新页面内容加载
      setTimeout(initializePage, 500);
    }
  }
  
  // 使用多种方式监听 URL 变化
  // 1. 监听 popstate（浏览器前进/后退）
  window.addEventListener('popstate', () => {
    setTimeout(checkUrlChange, 100);
  });
  
  // 2. 监听 hashchange
  window.addEventListener('hashchange', () => {
    setTimeout(checkUrlChange, 100);
  });
  
  // 3. 定时检查 URL（兜底方案，处理 pushState/replaceState）
  setInterval(checkUrlChange, 1000);
  
  // 4. 拦截 pushState 和 replaceState
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    setTimeout(checkUrlChange, 100);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    setTimeout(checkUrlChange, 100);
  };

  // 页面加载后初始化
  window.addEventListener("load", () => {
    initializePage();
  });
  
  // 页面可见性变化时检查（从其他标签切回来）
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkUrlChange();
    }
  });

  // MutationObserver 监听DOM变化，动态更新问题列表
  const observerConfig = { childList: true, subtree: true };
  const observer = new MutationObserver((mutationsList) => {
    // 检查是否需要更新问题列表
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // 检查是否添加了新的消息元素
        const hasNewMessages = Array.from(mutation.addedNodes).some((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            return (
              (node.matches && node.matches(currentConfig.messageSelector)) ||
              (node.querySelector &&
                node.querySelector(currentConfig.messageSelector))
            );
          }
          return false;
        });

        if (hasNewMessages) {
          // 使用节流技术避免频繁更新
          if (!observer.updateTimeout) {
            observer.updateTimeout = setTimeout(() => {
              findAllQuestionsWithDeduplication();
              observer.updateTimeout = null;
            }, 500);
          }
          break;
        }
      }
    }
  });

  // 开始观察DOM变化
  setTimeout(() => {
    const chatContainer =
      document.querySelector(".chat-container, #chat, main, article") ||
      document.body;
    observer.observe(chatContainer, observerConfig);
  }, 1500);
})();
