// ==UserScript==
// @name          从linux do获取论坛文章数据与复制
// @namespace     http://tampermonkey.net/
// @version       0.15.5
// @description   从linux do论坛页面获取文章的板块、标题、链接、标签和内容总结，并在标题旁添加复制按钮。支持设置界面配置。
// @author        @Loveyless https://github.com/Loveyless/linuxdo-share
// @match         *://*.linux.do/*
// @match         *://*.idcflare.com/*
// @match         *://*.nodeloc.com/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @run-at        document-idle // 更可靠的运行时间，等待DOM和资源加载完成且浏览器空闲
// @downloadURL https://update.greasyfork.org/scripts/543581/%E4%BB%8Elinux%20do%E8%8E%B7%E5%8F%96%E8%AE%BA%E5%9D%9B%E6%96%87%E7%AB%A0%E6%95%B0%E6%8D%AE%E4%B8%8E%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/543581/%E4%BB%8Elinux%20do%E8%8E%B7%E5%8F%96%E8%AE%BA%E5%9D%9B%E6%96%87%E7%AB%A0%E6%95%B0%E6%8D%AE%E4%B8%8E%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // #region 脚本配置与常量
  // ==========================================================

  /**
   * @description 默认配置项，当油猴存储中没有对应值时使用。
   */
  const DEFAULT_CONFIG = {
    // 是否启用 AI 进行内容总结
    USE_AI_FOR_SUMMARY: false,
    // AI Key，如果 USE_AI_FOR_SUMMARY 为 true，则需要填写此项
    API_KEY: '',
    // API 地址 (OpenAI Compatible 格式，完整地址如 https://api.openai.com/v1/chat/completions)
    API_BASE_URL: 'https://api.openai.com/v1/chat/completions',
    // 模型名称
    MODEL_NAME: 'gpt-4o-mini',
    // 总结后的最大字符数
    LOCAL_SUMMARY_MAX_CHARS: 90,
    // 自定义总结 Prompt
    CUSTOM_SUMMARY_PROMPT: `你是一个信息获取专家，可以精准的总结文章的精华内容和重点，请对以下文章内容进行归纳总结，回复不要有对我的问候语，或者(你好这是我的总结)(总结)等类似废话，直接返回你的总结，长度不超过{maxChars}个字符（或尽可能短，保持中文语义完整）： {content}`,
    // 文章复制模板
    ARTICLE_COPY_TEMPLATE: [
      `{{title}}`,
      `@{{username}}-{{category}}/{{tags}}`,
      ``,
      `{{summary}}`,
      `{{link}}`,
    ].join('\n')
  };

  /**
   * @description 脚本内部使用的常量配置
   */
  const SCRIPT_CONSTANTS = {
    // API 请求超时时间 (毫秒)
    API_TIMEOUT_MS: 30000,
    // AI 总结时发送的最大内容长度
    AI_CONTENT_MAX_LENGTH: 4000,
    // 脚本初始化节流时间 (毫秒)
    INIT_THROTTLE_MS: 300,
    // 复制成功提示显示时间 (毫秒)
    COPY_SUCCESS_DURATION_MS: 2000,
    // 复制失败提示显示时间 (毫秒)
    COPY_FAILURE_DURATION_MS: 3000,
    // 设置保存后关闭延迟 (毫秒)
    SETTINGS_CLOSE_DELAY_MS: 300,
    // Dialog 关闭动画时间 (毫秒)
    DIALOG_CLOSE_ANIMATION_MS: 200
  };

  // #endregion

  // #region 配置管理
  // ==========================================================

  /**
   * @description 从油猴存储中获取指定键的配置值。
   * @param {string} key - 配置项的键名。
   * @returns {*} 对应配置项的值，如果不存在则返回默认值。
   */
  function getConfig(key) {
    return GM_getValue(key, DEFAULT_CONFIG[key]);
  }

  /**
   * @description 将配置值保存到油猴存储中。
   * @param {string} key - 配置项的键名。
   * @param {*} value - 要保存的配置值。
   */
  function setConfig(key, value) {
    GM_setValue(key, value);
  }

  /**
   * @description 创建一个动态配置代理对象。
   * 当访问 CONFIG.someKey 时，会自动调用 getConfig('someKey')。
   * 当设置 CONFIG.someKey = value 时，会自动调用 setConfig('someKey', value)。
   */
  const CONFIG = new Proxy({}, {
    get(target, prop) {
      return getConfig(prop);
    },
    set(target, prop, value) {
      setConfig(prop, value);
      return true;
    }
  });
  // #endregion

  // #region 样式注入
  // ==========================================================

  /**
   * @description 脚本所需的全部 CSS 样式字符串。
   */
  const copyBtnStyle = /*css*/`
        .copy-button { /* 统一命名为 .copy-button */
            --button-bg: #e5e6eb;
            --button-hover-bg: #d7dbe2;
            --button-text-color: #4e5969;
            --button-hover-text-color: #164de5;
            --button-border-radius: 6px;
            --button-diameter: 24px;
            --button-outline-width: 2px;
            --button-outline-color: #9f9f9f;
            --tooltip-bg: #1d2129;
            --tooltip-border-radius: 4px;
            --tooltip-font-family: JetBrains Mono, Consolas, Menlo, Roboto Mono, monospace;
            --tooltip-font-size: 12px;
            --tooltip-text-color: #fff;
            --tooltip-padding-x: 7px;
            --tooltip-padding-y: 7px;
            --tooltip-offset: 8px;
        }

        html[style*="color-scheme: dark"] .copy-button {
            --button-bg: #353434;
            --button-hover-bg: #464646;
            --button-text-color: #ccc;
            --button-outline-color: #999;
            --button-hover-text-color: #8bb9fe;
            --tooltip-bg: #f4f3f3;
            --tooltip-text-color: #111;
        }

        .copy-button {
            box-sizing: border-box;
            width: var(--button-diameter);
            height: var(--button-diameter);
            border-radius: var(--button-border-radius);
            background-color: var(--button-bg);
            color: var(--button-text-color);
            border: none;
            cursor: pointer;
            position: relative;
            outline: var(--button-outline-width) solid transparent;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-left: 8px;
        }

        /* 调整标题的父元素 (h1[data-topic-id]) 为 flex 布局，确保按钮能紧随标题且对齐 */
        h1[data-topic-id] {
            display: flex !important; /* 强制 flexbox */
            align-items: center !important; /* 垂直居中对齐 */
            gap: 8px; /* 增加标题和按钮之间的间距 */
        }

        h1[data-topic-id] .fancy-title {
            margin-right: 0 !important; /* 覆盖可能存在的右外边距 */
        }

        .tooltip {
            position: absolute;
            opacity: 0;
            left: calc(100% + var(--tooltip-offset));
            top: 50%;
            transform: translateY(-50%);
            white-space: nowrap;
            font: var(--tooltip-font-size) var(--tooltip-font-family);
            color: var(--tooltip-text-color);
            background: var(--tooltip-bg);
            padding: var(--tooltip-padding-y) var(--tooltip-padding-x);
            border-radius: var(--tooltip-border-radius);
            pointer-events: none;
            transition: all var(--tooltip-transition-duration, 0.3s) cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 1000;
        }

        .tooltip::before {
            content: attr(data-text-initial);
        }

        .tooltip::after {
            content: "";
            width: var(--tooltip-padding-y);
            height: var(--tooltip-padding-y);
            background: inherit;
            position: absolute;
            top: 50%;
            left: calc(var(--tooltip-padding-y) / 2 * -1);
            transform: translateY(-50%) rotate(45deg);
            z-index: -999;
            pointer-events: none;
        }

        .copy-button svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .checkmark,
        .failedmark {
            display: none;
        }

        .copy-button:hover .tooltip,
        .copy-button:focus:not(:focus-visible) .tooltip {
            opacity: 1;
            visibility: visible;
        }

        .copy-button:focus:not(:focus-visible) .tooltip::before {
            content: attr(data-text-end);
        }
        .copy-button.copy-failed:focus:not(:focus-visible) .tooltip::before {
            content: attr(data-text-failed);
        }

        .copy-button:focus:not(:focus-visible) .clipboard {
            display: none;
        }

        .copy-button:focus:not(:focus-visible) .checkmark {
            display: block;
        }

        .copy-button.copy-failed:focus:not(:focus-visible) .checkmark {
            display: none;
        }

        .copy-button.copy-failed:focus:not(:focus-visible) .failedmark {
            display: block;
        }

        .copy-button:hover,
        .copy-button:focus {
            background-color: var(--button-hover-bg);
        }

        .copy-button:active {
            outline: var(--button-outline-width) solid var(--button-outline-color);
        }

        .copy-button:hover svg {
            color: var(--button-hover-text-color);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        /* 当按钮处于 loading 状态时，应用脉冲动画 */
        .copy-button.loading {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .copy-button.loading .checkmark,
        .copy-button.loading .failedmark {
            display: none; /* Loading 时隐藏对勾和叉号 */
        }

        /* 设置界面样式 - iOS 风格 */
        .linuxdo-settings-dialog {
            border: none;
            border-radius: 14px;
            padding: 0;
            width: 90%;
            max-width: 680px;
            max-height: 85vh;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
            background: transparent;
            overflow: hidden;
        }

        .linuxdo-settings-dialog::backdrop {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .linuxdo-settings-content {
            background: #f2f2f7;
            border-radius: 14px;
            display: flex;
            flex-direction: column;
            max-height: 85vh;
            overflow: hidden;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-content {
            background: #1c1c1e;
        }

        .linuxdo-settings-dialog[closing] {
            animation: iosSlideOut 0.2s ease-in forwards;
        }

        @keyframes iosSlideOut {
            to { opacity: 0; transform: scale(0.95); }
        }

        /* 顶部导航栏 */
        .linuxdo-settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: #f2f2f7;
            border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
            flex-shrink: 0;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-header {
            background: #1c1c1e;
            border-bottom-color: rgba(84, 84, 88, 0.65);
        }

        .linuxdo-settings-title {
            font-size: 17px;
            font-weight: 600;
            margin: 0;
            color: #000;
            letter-spacing: -0.4px;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-title {
            color: #fff;
        }

        .linuxdo-settings-close {
            background: rgba(120, 120, 128, 0.12);
            border: none;
            font-size: 15px;
            cursor: pointer;
            color: #8e8e93;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.15s ease;
        }

        .linuxdo-settings-close:hover {
            background: rgba(120, 120, 128, 0.2);
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-close {
            background: rgba(120, 120, 128, 0.32);
            color: #98989f;
        }

        /* 表单滚动区域 */
        .linuxdo-settings-form {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }

        /* iOS 分组列表 */
        .linuxdo-settings-group {
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 20px;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-group {
            background: #2c2c2e;
        }

        .linuxdo-settings-group-title {
            font-size: 13px;
            font-weight: 400;
            color: #6d6d72;
            text-transform: uppercase;
            letter-spacing: -0.08px;
            padding: 0 16px 8px;
            margin-bottom: 0;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-group-title {
            color: #8e8e93;
        }

        /* iOS 行样式 */
        .linuxdo-settings-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            min-height: 44px;
            border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
            box-sizing: border-box;
        }

        .linuxdo-settings-row:last-child {
            border-bottom: none;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-row {
            border-bottom-color: rgba(84, 84, 88, 0.65);
        }

        .linuxdo-settings-row-label {
            font-size: 17px;
            color: #000;
            flex-shrink: 0;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-row-label {
            color: #fff;
        }

        .linuxdo-settings-row-value {
            flex: 1;
            margin-left: 12px;
        }

        /* iOS 输入框 */
        .linuxdo-settings-input {
            width: 100%;
            padding: 11px 0;
            border: none;
            background: transparent;
            font-size: 17px;
            font-family: inherit;
            color: #8e8e93;
            text-align: right;
            outline: none;
            box-sizing: border-box;
        }

        .linuxdo-settings-input::placeholder {
            color: #c7c7cc;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-input {
            color: #98989f;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-input::placeholder {
            color: #636366;
        }

        /* 垂直布局的输入字段 */
        .linuxdo-settings-field-vertical {
            padding: 12px 16px;
            border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
        }

        .linuxdo-settings-field-vertical:last-child {
            border-bottom: none;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-field-vertical {
            border-bottom-color: rgba(84, 84, 88, 0.65);
        }

        .linuxdo-settings-field-vertical .linuxdo-settings-label {
            font-size: 13px;
            font-weight: 500;
            color: #6d6d72;
            margin-bottom: 8px;
            display: block;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-field-vertical .linuxdo-settings-label {
            color: #8e8e93;
        }

        .linuxdo-settings-field-vertical .linuxdo-settings-input {
            text-align: left;
            padding: 10px 12px;
            background: rgba(120, 120, 128, 0.08);
            border-radius: 8px;
            font-size: 15px;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-field-vertical .linuxdo-settings-input {
            background: rgba(120, 120, 128, 0.2);
            color: #fff;
        }

        /* 文本域 */
        .linuxdo-settings-textarea {
            width: 100%;
            padding: 10px 12px;
            border: none;
            background: rgba(120, 120, 128, 0.08);
            border-radius: 8px;
            font-size: 15px;
            font-family: inherit;
            color: #000;
            resize: vertical;
            min-height: 80px;
            line-height: 1.4;
            outline: none;
            box-sizing: border-box;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-textarea {
            background: rgba(120, 120, 128, 0.2);
            color: #fff;
        }

        .linuxdo-settings-textarea::placeholder {
            color: #c7c7cc;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-textarea::placeholder {
            color: #636366;
        }

        /* iOS 开关 */
        .linuxdo-settings-switch {
            position: relative;
            width: 51px;
            height: 31px;
            flex-shrink: 0;
        }

        .linuxdo-settings-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .linuxdo-settings-switch-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #e9e9eb;
            transition: 0.25s ease;
            border-radius: 31px;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-switch-slider {
            background-color: #39393d;
        }

        .linuxdo-settings-switch-slider:before {
            position: absolute;
            content: "";
            height: 27px;
            width: 27px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: 0.25s ease;
            border-radius: 50%;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15), 0 1px 1px rgba(0, 0, 0, 0.06);
        }

        .linuxdo-settings-switch input:checked + .linuxdo-settings-switch-slider {
            background-color: #34c759;
        }

        .linuxdo-settings-switch input:checked + .linuxdo-settings-switch-slider:before {
            transform: translateX(20px);
        }

        /* 描述文字 */
        .linuxdo-settings-description {
            font-size: 13px;
            color: #6d6d72;
            margin-top: 6px;
            line-height: 1.35;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-description {
            color: #8e8e93;
        }

        .linuxdo-settings-group-footer {
            font-size: 13px;
            color: #6d6d72;
            padding: 8px 16px 0;
            line-height: 1.35;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-group-footer {
            color: #8e8e93;
        }

        /* 底部按钮区域 - 固定在底部 */
        .linuxdo-settings-footer {
            display: flex;
            gap: 12px;
            padding: 16px 20px;
            padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
            background: #f2f2f7;
            border-top: 0.5px solid rgba(60, 60, 67, 0.12);
            flex-shrink: 0;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-footer {
            background: #1c1c1e;
            border-top-color: rgba(84, 84, 88, 0.65);
        }

        .linuxdo-settings-button {
            flex: 1;
            padding: 14px 20px;
            border: none;
            border-radius: 10px;
            background: #fff;
            color: #007aff;
            cursor: pointer;
            font-size: 17px;
            font-weight: 400;
            font-family: inherit;
            transition: all 0.15s ease;
        }

        .linuxdo-settings-button:active {
            background: #e5e5ea;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-button {
            background: #2c2c2e;
            color: #0a84ff;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-button:active {
            background: #3a3a3c;
        }

        .linuxdo-settings-button.primary {
            background: #007aff;
            color: white;
            font-weight: 600;
        }

        .linuxdo-settings-button.primary:active {
            background: #0066d6;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-button.primary {
            background: #0a84ff;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-button.primary:active {
            background: #0077e6;
        }

        /* 响应式 */
        @media (max-width: 500px) {
            .linuxdo-settings-dialog {
                width: 100%;
                max-width: 100%;
                max-height: 100vh;
                border-radius: 0;
            }
            .linuxdo-settings-content {
                border-radius: 0;
                max-height: 100vh;
            }
        }
    `;

  /**
   * @description 将 CSS 样式注入到页面中。
   * 优先使用 GM_addStyle API，如果不可用，则创建一个 <style> 标签并插入到 <head> 中。
   * @param {string} cssText - 要注入的 CSS 样式字符串。
   */
  function addStyle(cssText) {
    if (typeof GM_addStyle !== 'undefined') {
      GM_addStyle(cssText);
    } else {
      const styleNode = document.createElement('style');
      styleNode.appendChild(document.createTextNode(cssText));
      (document.head || document.documentElement).appendChild(styleNode);
    }
  }
  // #endregion

  // #region 通用辅助函数
  // ==========================================================

  /**
   * @description 转义 HTML 特殊字符，防止 XSS 攻击。
   * @param {string} str - 要转义的字符串。
   * @returns {string} 转义后的安全字符串。
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * @description 调用 AI 以获取内容总结 (OpenAI Compatible 格式)。
   * @param {string} prompt - 发送给 API 的完整提示词。
   * @param {string} apiKey - 用户的 API Key。
   * @param {string} [model='gpt-4o-mini'] - 要使用的模型名称。
   * @returns {Promise<string>} 返回 API 生成的文本内容的 Promise。
   */
  async function callAiAPI(prompt, apiKey, model = 'gpt-4o-mini') {
    const url = CONFIG.API_BASE_URL || DEFAULT_CONFIG.API_BASE_URL;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    const body = JSON.stringify({
      model: model,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: headers,
        data: body,
        timeout: SCRIPT_CONSTANTS.API_TIMEOUT_MS, // API 请求超时
        onload: function (response) {
          // 检查 HTTP 状态码
          if (response.status < 200 || response.status >= 300) {
            reject(new Error(`HTTP Error: ${response.status} ${response.statusText}`));
            return;
          }
          try {
            const data = JSON.parse(response.responseText);
            if (data.choices && data.choices.length > 0) {
              resolve(data.choices[0].message.content);
            } else if (data.error) {
              reject(new Error(`AI Error: ${JSON.stringify(data.error)}`));
            } else {
              reject(new Error(`AI returned an unexpected response: ${JSON.stringify(data)}`));
            }
          } catch (e) {
            reject(new Error(`Failed to parse AI response: ${e.message}\nResponse: ${response.responseText}`));
          }
        },
        onerror: function (error) {
          reject(new Error(`GM_xmlhttpRequest failed: ${error.statusText || 'Unknown error'}`));
        },
        ontimeout: function () {
          reject(new Error(`API request timed out after ${SCRIPT_CONSTANTS.API_TIMEOUT_MS / 1000} seconds`));
        }
      });
    });
  }

  /**
   * @description 处理复制操作失败后的 UI 反馈。
   * @param {object} param - 参数对象。
   * @param {HTMLElement} param.element - 触发复制操作的按钮元素。
   * @param {Error} [param.error=new Error()] - 捕获到的错误对象。
   */
  function handleCopyError({ element, error = new Error() }) {
    element.classList.add('copy-failed');
    console.error('复制失败:', error);
    setTimeout(() => {
      element.classList.remove('copy-failed');
      element.blur(); // 移除焦点，重置提示
    }, SCRIPT_CONSTANTS.COPY_FAILURE_DURATION_MS);
  }

  /**
   * @description 将指定的文本复制到用户的剪贴板。
   * @param {object} param - 参数对象。
   * @param {HTMLElement} param.element - 触发复制操作的按钮元素。
   * @param {string} param.text - 要复制到剪贴板的文本。
   */
  function copyTextToClipboard({ element, text }) {
    navigator.clipboard.writeText(text).then(function () {
      console.log('文本已复制到剪贴板');
      console.log(text);
      element.focus(); // 触发 :focus 样式显示“已复制”
      setTimeout(() => {
        element.blur(); // 移除焦点，重置提示
      }, SCRIPT_CONSTANTS.COPY_SUCCESS_DURATION_MS);
    }).catch(function (error) {
      handleCopyError({ element, error });
    });
  }
  /**
   * 创建一个节流函数，在 wait 秒内最多执行 func 一次。
   * 该函数提供一个 options 对象来决定是否应禁用前缘或后缘的调用。
   *
   * @param {Function} func 要节流的函数。
   * @param {number} wait 等待的毫秒数。
   * @param {object} [options={}] 选项对象。
   * @param {boolean} [options.leading=true] 指定在节流开始前（前缘）调用。
   * @param {boolean} [options.trailing=true] 指定在节流结束后（后缘）调用。
   * @returns {Function} 返回新的节流函数。
   */
  function throttleInit(func, wait, options = {}) {
    let timeout = null;
    let lastArgs = null;
    let lastThis = null;
    let result;
    let previous = 0; // 上次执行的时间戳

    // 默认开启 leading 和 trailing，trailing 默认开启以保持您之前版本的功能性
    const { leading = true, trailing = true } = options;

    // 如果 wait 小于等于 0，则无论如何都立即执行
    if (wait <= 0) {
      return (...args) => func.apply(this, args);
    }

    // 定时器触发时执行的函数，用于处理 trailing 调用
    function later() {
      // 如果 leading 为 false，则重置 previous，允许在静默期后立即触发下一次 leading
      // 否则，将 previous 设为当前时间，作为新的节流周期的开始
      previous = leading === false ? 0 : Date.now();
      timeout = null;

      // 如果在节流期间有新的调用，则执行最后一次调用
      if (lastArgs) {
        result = func.apply(lastThis, lastArgs);
        // 清理，防止内存泄漏
        if (!timeout) {
          lastThis = lastArgs = null;
        }
      }
    }

    // 返回的节流函数
    function throttled(...args) {
      const now = Date.now();

      // 如果是第一次调用，且禁用了 leading，则记录当前时间戳作为节流周期的开始
      if (!previous && leading === false) {
        previous = now;
      }

      // 计算距离下次可执行的时间
      const remaining = wait - (now - previous);
      lastArgs = args;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      lastThis = this;

      // ---- 核心判断逻辑 ----
      // 1. 时间已到 (remaining <= 0) 或 2. 系统时间被向后调整 (remaining > wait)
      if (remaining <= 0 || remaining > wait) {
        // 清除可能存在的 trailing 定时器，因为我们要立即执行
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        // 更新时间戳，开始新的节流周期
        previous = now;
        // 立即执行（leading call）
        result = func.apply(lastThis, lastArgs);
        if (!timeout) {
          lastThis = lastArgs = null;
        }
      } else if (!timeout && trailing !== false) {
        // 如果时间未到，且没有设置定时器，并且需要 trailing 调用
        // 则设置一个定时器，在剩余时间后执行 later 函数
        timeout = setTimeout(later, remaining);
      }

      // 返回上一次执行的结果
      return result;
    }

    // 添加取消功能
    throttled.cancel = () => {
      clearTimeout(timeout);
      previous = 0;
      timeout = lastThis = lastArgs = null;
    };

    return throttled;
  }

  // #endregion

  // #region 核心数据提取
  // ==========================================================

  /**
   * @description 从页面 DOM 中提取当前文章的作者、分类和标签信息。
   * @returns {{username: string, category: string, tags: string}} 包含用户、分类和标签数据的对象。
   */
  function getUserData() {
    const userData = {
      username: '',
      category: '', // 统一使用 category
      tags: '',
    };

    // 获取板块名称
    const categoryElements = document.querySelectorAll('.topic-category .badge-category__wrapper');
    if (categoryElements.length > 0) {
      const lastIndex = categoryElements.length - 1;
      userData.category = categoryElements[lastIndex].textContent.trim();
    }

    // 获取用户名
    const postAuthorContainer = document.querySelector('.topic-meta-data, .post-stream .post:first-of-type');
    if (postAuthorContainer) {
      const usernameElement = postAuthorContainer.querySelector('.names .first.full-name a, .username a');
      if (usernameElement) {
        userData.username = usernameElement.textContent.trim();
      }
    }

    // 获取标签
    const TagsElement = document.querySelector('.list-tags');
    if (TagsElement) {
      userData.tags = TagsElement.textContent.trim();
    }

    return userData;
  }

  /**
   * @description 从页面 DOM 中提取当前登录用户的用户名（用于分享链接参数 u）。
   * @returns {string} 用户名（小写）；未获取到则返回空字符串。
   */
  function getSharerUsername() {
    const currentUserToggle = document.getElementById('toggle-current-user');
    if (!currentUserToggle) return '';

    const avatarImg = currentUserToggle.querySelector('img.avatar');
    if (avatarImg) {
      const src = avatarImg.getAttribute('src') || '';
      const match = src.match(/\/user_avatar\/[^/]+\/([^/]+)\//i);
      if (match) return match[1].trim().toLowerCase();
    }

    return '';
  }

  /**
   * @description 将 u=<username> 拼接到链接中（兼容已有查询参数）。
   * @param {string} link - 原始链接。
   * @param {string} username - 用户名（建议已转小写）。
   * @returns {string} 拼接后的链接。
   */
  function appendSharerParamToLink(link, username) {
    if (!link || !username) return link || '';

    try {
      const url = new URL(link, window.location.origin);
      url.searchParams.set('u', username);
      return url.toString();
    } catch (error) {
      const separator = link.includes('?') ? '&' : '?';
      return `${link}${separator}u=${encodeURIComponent(username)}`;
    }
  }

  /**
   * @description 从页面 DOM 中提取并整合文章的完整数据。
   * @param {HTMLElement} titleElement - 文章标题的 <a> 元素。
   * @param {HTMLElement} articleRootElement - 文章内容的根元素 (通常是 .cooked)。
   * @returns {Promise<object>} 返回一个包含文章所有数据的 Promise 对象。
   */
  async function getArticleData(titleElement, articleRootElement) {
    const userData = getUserData(); // 获取用户、分类、标签数据

    const articleData = {
      ...userData, // 合并用户、分类和标签数据
      title: '',
      link: '',
      summary: '',
    };

    if (titleElement) {
      articleData.title = titleElement.textContent.trim();
      articleData.link = titleElement.href || '';
      articleData.link = appendSharerParamToLink(articleData.link, getSharerUsername());
    }

    // 获取内容并进行总结
    if (articleRootElement) {
      const clonedArticleContent = articleRootElement.cloneNode(true);

      // 移除不用于总结的内容元素
      clonedArticleContent.querySelectorAll(
        'pre, code, blockquote, img, .meta, .discourse-footnote-link, .emoji, ' +
        '.signature, .system-message, .post-links, .hidden'
      ).forEach(el => el.remove());

      let fullTextContent = clonedArticleContent.textContent.trim();
      fullTextContent = fullTextContent.replace(/\s*\n\s*/g, '\n').replace(/\n{2,}/g, '\n\n').trim();

      if (CONFIG.USE_AI_FOR_SUMMARY && CONFIG.API_KEY) {
        console.log('尝试使用 AI 总结内容...');
        const contentToSummarize = fullTextContent.substring(0, SCRIPT_CONSTANTS.AI_CONTENT_MAX_LENGTH);
        const customPrompt = CONFIG.CUSTOM_SUMMARY_PROMPT || DEFAULT_CONFIG.CUSTOM_SUMMARY_PROMPT;
        const prompt = customPrompt
          .replace('{maxChars}', CONFIG.LOCAL_SUMMARY_MAX_CHARS)
          .replace('{content}', contentToSummarize);

        try {
          articleData.summary = `[AI总结]:` + await callAiAPI(prompt, CONFIG.API_KEY, CONFIG.MODEL_NAME);
          console.log('OpenAI Compatible', CONFIG.MODEL_NAME, '总结:', articleData.summary);
          articleData.summary = articleData.summary.replace(/^(.)\s*(\S+)/, '$1$2').trim();
        } catch (error) {
          console.error('AI 总结失败:', error);
          articleData.summary = fullTextContent.substring(0, CONFIG.LOCAL_SUMMARY_MAX_CHARS) + (fullTextContent.length > CONFIG.LOCAL_SUMMARY_MAX_CHARS ? '...' : '');
        }
      } else {
        articleData.summary = fullTextContent.substring(0, CONFIG.LOCAL_SUMMARY_MAX_CHARS) + (fullTextContent.length > CONFIG.LOCAL_SUMMARY_MAX_CHARS ? '...' : '');
        if (!CONFIG.API_KEY && CONFIG.USE_AI_FOR_SUMMARY) {
          console.warn('未提供 AI Key 或未启用 API 总结，将使用本地简单截取。');
        }
      }
    }

    return articleData;
  }
  // #endregion

  // #region UI 交互
  // ==========================================================

  /**
   * @description 在文章标题旁边创建一个复制按钮并添加到页面中。
   * @param {HTMLElement} titleElement - 文章标题的 <a> 元素。
   */
  function addCopyButtonToArticleTitle(titleElement) {
    // 可能导致判断不准确 重复添加copy按钮原因未知
    // if (titleElement.nextElementSibling && titleElement.nextElementSibling.classList.contains('article-copy-button')) {
    if (titleElement.parentNode.querySelectorAll('.article-copy-button').length > 0) {
      // console.log('复制按钮已存在，跳过添加。');
      return;
    }

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button article-copy-button';
    copyButton.innerHTML = /*html*/`
            <span data-text-initial="复制文章信息" data-text-end="已复制" data-text-failed="复制失败" class="tooltip"></span>
            <span>
                <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 6.35 6.35" y="0" x="0"
                    height="14" width="14" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" class="clipboard">
                    <g>
                        <path fill="currentColor"
                            d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z">
                        </path>
                    </g>
                </svg>
                <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0" height="14"
                    width="14" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    class="checkmark">
                    <g>
                        <path data-original="#000000" fill="currentColor"
                            d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z">
                        </path>
                    </g>
                </svg>
                <svg class="failedmark" xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512">
                    <path fill="#FF473E"
                        d="m330.443 256l136.765-136.765c14.058-14.058 14.058-36.85 0-50.908l-23.535-23.535c-14.058-14.058-36.85-14.058-50.908 0L256 181.557L119.235 44.792c-14.058-14.058-36.85-14.058-50.908 0L44.792 68.327c-14.058 14.058-14.058 36.85 0 50.908L181.557 256L44.792 392.765c-14.058 14.058-14.058 36.85 0 50.908l23.535 23.535c14.058 14.058 36.85 14.058 50.908 0L256 330.443l136.765 136.765c14.058 14.058 36.85 14.058 50.908 0l23.535-23.535c14.058-14.058 14.058-36.85 0-50.908z" />
                </svg>
            </span>
        `;

    titleElement.parentNode.insertBefore(copyButton, titleElement.nextSibling);

    copyButton.addEventListener('click', async (e) => {
      e.stopPropagation();

      if (copyButton.classList.contains('loading')) {
        return;
      }

      copyButton.classList.add('loading');
      copyButton.disabled = true;

      try {
        // 每次点击时重新获取当前页面的DOM元素，避免SPA页面切换后闭包持有旧引用
        const currentTitleElement = document.querySelector('h1[data-topic-id] a.fancy-title');
        const currentArticleRootElement = document.querySelector('.cooked');
        const articleData = await getArticleData(currentTitleElement, currentArticleRootElement);
        console.log('获取到的文章数据:', articleData);

        let formattedText = CONFIG.ARTICLE_COPY_TEMPLATE.replace(/{{(\w+)}}/g, (match, key) => {
          return articleData[key] !== undefined ? articleData[key] : match;
        });
        formattedText = formattedText.replace(/\n\n+/g, '\n\n').trim();

        copyTextToClipboard({ element: copyButton, text: formattedText });
      } catch (error) {
        handleCopyError({ element: copyButton, error });
      } finally {
        copyButton.classList.remove('loading');
        copyButton.disabled = false;
      }
    });
  }
  // #endregion

  // #region 设置界面
  // ==========================================================

  /**
   * @description 创建设置界面的 HTML 结构。
   * @returns {HTMLDialogElement} 返回创建的 dialog 元素。
   */
  function createSettingsModal() {
    const dialog = document.createElement('dialog');
    dialog.className = 'linuxdo-settings-dialog';

    dialog.innerHTML = `
      <div class="linuxdo-settings-content">
        <div class="linuxdo-settings-header">
          <h2 class="linuxdo-settings-title">设置</h2>
          <button class="linuxdo-settings-close" type="button">&times;</button>
        </div>
        <form class="linuxdo-settings-form" method="dialog">
          <!-- AI 总结开关 -->
          <div class="linuxdo-settings-group">
            <div class="linuxdo-settings-row">
              <span class="linuxdo-settings-row-label">启用 AI 总结</span>
              <label class="linuxdo-settings-switch">
                <input type="checkbox" id="useAiForSummary" ${CONFIG.USE_AI_FOR_SUMMARY ? 'checked' : ''}>
                <span class="linuxdo-settings-switch-slider"></span>
              </label>
            </div>
          </div>
          <p class="linuxdo-settings-group-footer">开启后将使用 AI 对文章内容进行智能总结</p>

          <!-- API 配置 -->
          <p class="linuxdo-settings-group-title" style="margin-top: 24px;">API 配置</p>
          <div class="linuxdo-settings-group">
            <div class="linuxdo-settings-row">
              <span class="linuxdo-settings-row-label">API Key</span>
              <div class="linuxdo-settings-row-value">
                <input type="password" id="apiKey" class="linuxdo-settings-input" value="${escapeHtml(CONFIG.API_KEY)}" placeholder="输入 API Key">
              </div>
            </div>
            <div class="linuxdo-settings-row">
              <span class="linuxdo-settings-row-label">模型</span>
              <div class="linuxdo-settings-row-value">
                <input type="text" id="modelName" class="linuxdo-settings-input" value="${escapeHtml(CONFIG.MODEL_NAME)}" placeholder="gpt-4o-mini">
              </div>
            </div>
            <div class="linuxdo-settings-field-vertical">
              <label class="linuxdo-settings-label">API 地址</label>
              <input type="text" id="apiBaseUrl" class="linuxdo-settings-input" value="${escapeHtml(CONFIG.API_BASE_URL)}" placeholder="https://api.openai.com/v1/chat/completions">
            </div>
          </div>
          <p class="linuxdo-settings-group-footer">使用 OpenAI 兼容格式的完整 API 地址</p>

          <!-- 总结设置 -->
          <p class="linuxdo-settings-group-title" style="margin-top: 24px;">总结设置</p>
          <div class="linuxdo-settings-group">
            <div class="linuxdo-settings-row">
              <span class="linuxdo-settings-row-label">最大字符数</span>
              <div class="linuxdo-settings-row-value">
                <input type="number" id="localSummaryMaxChars" class="linuxdo-settings-input" value="${CONFIG.LOCAL_SUMMARY_MAX_CHARS}" placeholder="90" min="1" max="10000">
              </div>
            </div>
            <div class="linuxdo-settings-field-vertical">
              <label class="linuxdo-settings-label">自定义 Prompt</label>
              <textarea id="customPrompt" class="linuxdo-settings-textarea" placeholder="输入自定义的总结提示词">${escapeHtml(CONFIG.CUSTOM_SUMMARY_PROMPT)}</textarea>
              <div class="linuxdo-settings-description">使用 {maxChars} 表示最大字符数，{content} 表示文章内容</div>
            </div>
          </div>
        </form>
        <div class="linuxdo-settings-footer">
          <button type="button" class="linuxdo-settings-button" id="cancelSettings">取消</button>
          <button type="button" class="linuxdo-settings-button primary" id="saveSettings">保存</button>
        </div>
      </div>
    `;

    return dialog;
  }

  /**
   * @description 为设置界面的所有可交互元素绑定事件监听器。
   * @param {HTMLDialogElement} dialog - 设置界面的 dialog 元素。
   */
  function bindSettingsEvents(dialog) {
    const closeBtn = dialog.querySelector('.linuxdo-settings-close');
    const cancelBtn = dialog.querySelector('#cancelSettings');
    const saveBtn = dialog.querySelector('#saveSettings');

    const closeDialog = () => {
      if (typeof dialog.close === 'function') {
        dialog.setAttribute('closing', '');
        setTimeout(() => {
          dialog.close();
          dialog.remove();
        }, SCRIPT_CONSTANTS.DIALOG_CLOSE_ANIMATION_MS);
      } else {
        dialog.remove();
        const backdrop = document.querySelector('.dialog-backdrop-fallback');
        if (backdrop) backdrop.remove();
      }
    };

    closeBtn.addEventListener('click', closeDialog);
    cancelBtn.addEventListener('click', closeDialog);

    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeDialog();
    });

    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const useAiForSummary = dialog.querySelector('#useAiForSummary').checked;
      const apiKey = dialog.querySelector('#apiKey').value.trim();
      const apiBaseUrl = dialog.querySelector('#apiBaseUrl').value.trim();
      const localSummaryMaxChars = parseInt(dialog.querySelector('#localSummaryMaxChars').value.trim()) || DEFAULT_CONFIG.LOCAL_SUMMARY_MAX_CHARS;
      const customPrompt = dialog.querySelector('#customPrompt').value.trim();
      const modelName = dialog.querySelector('#modelName').value.trim();

      setConfig('USE_AI_FOR_SUMMARY', useAiForSummary);
      setConfig('API_KEY', apiKey);
      setConfig('API_BASE_URL', apiBaseUrl || DEFAULT_CONFIG.API_BASE_URL);
      setConfig('MODEL_NAME', modelName || DEFAULT_CONFIG.MODEL_NAME);
      setConfig('LOCAL_SUMMARY_MAX_CHARS', localSummaryMaxChars);
      setConfig('CUSTOM_SUMMARY_PROMPT', customPrompt || DEFAULT_CONFIG.CUSTOM_SUMMARY_PROMPT);

      const originalText = saveBtn.textContent;
      saveBtn.textContent = '已保存 ✓';
      saveBtn.disabled = true;

      setTimeout(() => {
        closeDialog();
      }, SCRIPT_CONSTANTS.SETTINGS_CLOSE_DELAY_MS);
    });
  }

  /**
   * @description 显示设置界面模态框。
   */
  function showSettingsModal() {
    if (window !== window.top) {
      console.log('在 iframe 中，跳过显示设置界面');
      return;
    }

    const existingDialog = document.querySelector('.linuxdo-settings-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    const dialog = createSettingsModal();
    document.body.appendChild(dialog);

    bindSettingsEvents(dialog);

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.style.display = 'block';
      dialog.style.position = 'fixed';
      dialog.style.top = '50%';
      dialog.style.left = '50%';
      dialog.style.transform = 'translate(-50%, -50%)';
      dialog.style.zIndex = '10000';

      const backdrop = document.createElement('div');
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999;
      `;
      backdrop.className = 'dialog-backdrop-fallback';
      document.body.appendChild(backdrop);

      console.warn('浏览器不支持 dialog 元素，使用降级方案');
    }
  }
  // #endregion

  // #region 脚本初始化与执行
  // ==========================================================

  /**
   * @description 脚本的主要初始化函数。
   * 负责查找页面上的关键元素，并在找到后调用函数添加复制按钮。
   */
  function initializeScript() {
    if (window !== window.top) {
      console.log("在 iframe 中，跳过脚本初始化");
      return;
    }

    // console.log("油猴脚本已尝试初始化。");

    const titleLinkElement = document.querySelector('h1[data-topic-id] a.fancy-title');
    const articleRootElement = document.querySelector('.cooked');
    const userDataContainer = document.querySelector('.topic-meta-data');
    const categoryBadge = document.querySelector('.topic-category .badge-category__wrapper');
    const tagsElement = document.querySelector('.list-tags');

    if (titleLinkElement && articleRootElement && userDataContainer && categoryBadge) {
      if (titleLinkElement.parentNode && titleLinkElement.parentNode.tagName === 'H1') {
        const parentH1 = titleLinkElement.parentNode;
        if (!parentH1.style.display || !parentH1.style.display.includes('flex')) {
          parentH1.style.display = 'flex';
          parentH1.style.alignItems = 'center';
          parentH1.style.gap = '8px';
          // console.log('已调整 H1 父元素样式为 flex。');
        }
      }

      addCopyButtonToArticleTitle(titleLinkElement);
    } else {
      console.log('部分所需元素未找到，等待DOM更新:', {
        title: !!titleLinkElement,
        content: !!articleRootElement,
        userData: !!userDataContainer,
        category: !!categoryBadge,
        tags: !!tagsElement
      });
    }
  }

  // 脚本执行入口
  if (window === window.top) {

    // 添加复制按钮函数增加节流
    let throttledInitialize = throttleInit(initializeScript, SCRIPT_CONSTANTS.INIT_THROTTLE_MS);

    // 注入样式
    addStyle(copyBtnStyle);

    // 注册油猴菜单命令
    GM_registerMenuCommand('设置', showSettingsModal);

    // 使用 MutationObserver 监听 DOM 变化，以适应动态加载内容的单页应用 (SPA)
    const observer = new MutationObserver((mutationsList, observerInstance) => {
      throttledInitialize();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始加载时也尝试运行一次
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', throttledInitialize);
    } else {
      throttledInitialize();
    }
  } else {
    // console.log("在 iframe 中，跳过脚本功能初始化");
  }
  // #endregion

})();
