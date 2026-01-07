// ==UserScript==
// @name          Linuxdo-share
// @namespace     http://tampermonkey.net/
// @version       0.15.36
// @description   从linux do论坛页面获取文章的板块、标题、链接、标签和内容总结，并在标题旁添加复制按钮。支持设置界面配置。
// @icon          data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cmVjdCB4PSIxOCIgeT0iMTQiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzOCIgcng9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRlNTk2OSIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHJlY3QgeD0iMTIiIHk9IjIwIiB3aWR0aD0iMzAiIGhlaWdodD0iMzgiIHJ4PSI2IiBmaWxsPSJub25lIiBzdHJva2U9IiMxNjRkZTUiIHN0cm9rZS13aWR0aD0iNCIvPjwvc3ZnPg==
// @icon64        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cmVjdCB4PSIxOCIgeT0iMTQiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzOCIgcng9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRlNTk2OSIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHJlY3QgeD0iMTIiIHk9IjIwIiB3aWR0aD0iMzAiIGhlaWdodD0iMzgiIHJ4PSI2IiBmaWxsPSJub25lIiBzdHJva2U9IiMxNjRkZTUiIHN0cm9rZS13aWR0aD0iNCIvPjwvc3ZnPg==
// @author        @Loveyless https://github.com/Loveyless/linuxdo-share
// @match         *://*.linux.do/*
// @match         *://*.idcflare.com/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @run-at        document-idle // 更可靠的运行时间，等待DOM和资源加载完成且浏览器空闲
// @downloadURL https://update.greasyfork.org/scripts/543581/Linuxdo-share.user.js
// @updateURL https://update.greasyfork.org/scripts/543581/Linuxdo-share.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // #region 脚本配置与常量
  // ==========================================================

  /**
   * @description 默认配置项，当油猴存储中没有对应值时使用。
   */
  const DEFAULT_CONFIG = {
    // 是否启用简洁模式：标题+摘要合并一段，隐藏作者/板块/标签，链接单独一行
    COMPACT_MODE: false,
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
    DIALOG_CLOSE_ANIMATION_MS: 200,
    // 历史复制内容：存储空间不足时的保底条数
    COPY_HISTORY_FALLBACK_LIMIT: 20
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

        html[style*="color-scheme: dark"] .copy-button,
        html.dark .copy-button {
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

        /* 设置界面样式 - shadcn 风格（简约） */
        .linuxdo-settings-dialog {
            /* 优先使用 Discourse 主题变量，自动适配深浅色；无变量时回退到浅色 */
            --ld-bg: var(--secondary, #ffffff);
            --ld-fg: var(--primary, #0f172a);
            --ld-muted: var(--primary-very-low, #f1f5f9);
            --ld-muted-fg: var(--primary-medium, #64748b);
            --ld-card: var(--secondary, #ffffff);
            --ld-border: var(--content-border-color, rgba(15, 23, 42, 0.12));
            --ld-ring: var(--tertiary-low, rgba(59, 130, 246, 0.45));
            --ld-primary: var(--primary, #0f172a);
            --ld-primary-fg: var(--secondary, #ffffff);

            border: none;
            padding: 0;
            width: min(720px, calc(100vw - 24px));
            max-height: min(85vh, 760px);
            background: transparent;
            overflow: visible;
            font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
        }

        .linuxdo-settings-dialog,
        .linuxdo-settings-dialog * {
            box-sizing: border-box;
        }

        html[style*="color-scheme: dark"] .linuxdo-settings-dialog,
        html.dark .linuxdo-settings-dialog {
            /* 深色模式兜底：仅当站点未提供主题变量时生效 */
            --ld-bg: var(--secondary, #0b1220);
            --ld-fg: var(--primary, #e2e8f0);
            --ld-muted: var(--primary-very-low, rgba(148, 163, 184, 0.12));
            --ld-muted-fg: var(--primary-medium, #94a3b8);
            --ld-card: var(--secondary, #0f172a);
            --ld-border: var(--content-border-color, rgba(148, 163, 184, 0.18));
            --ld-ring: var(--tertiary-low, rgba(59, 130, 246, 0.55));
            --ld-primary: var(--primary, #e2e8f0);
            --ld-primary-fg: var(--secondary, #0b1220);
        }

        .linuxdo-settings-dialog::backdrop {
            background: rgba(2, 6, 23, 0.65);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }

        .linuxdo-settings-content {
            background: var(--ld-bg);
            color: var(--ld-fg);
            border: 1px solid var(--ld-border);
            border-radius: 12px;
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
            display: flex;
            flex-direction: column;
            max-height: inherit;
            overflow: hidden;
        }

        .linuxdo-settings-dialog[closing] .linuxdo-settings-content {
            animation: ldDialogOut 0.16s ease-in forwards;
        }

        @keyframes ldDialogOut {
            to { opacity: 0; transform: translateY(6px) scale(0.985); }
        }

        .linuxdo-settings-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            padding: 16px 18px;
            border-bottom: 1px solid var(--ld-border);
            background: var(--ld-bg);
            flex-shrink: 0;
        }

        .linuxdo-settings-title {
            font-size: 16px;
            font-weight: 600;
            line-height: 1.25;
            margin: 0;
            letter-spacing: -0.01em;
        }

        .linuxdo-settings-subtitle {
            margin: 6px 0 0;
            font-size: 12px;
            color: var(--ld-muted-fg);
            line-height: 1.3;
        }

        .linuxdo-settings-close {
            appearance: none;
            border: 1px solid var(--ld-border);
            background: transparent;
            color: var(--ld-muted-fg);
            border-radius: 10px;
            width: 34px;
            height: 34px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
            flex-shrink: 0;
            line-height: 1;
        }

        .linuxdo-settings-close:hover {
            background: var(--ld-muted);
            color: var(--ld-fg);
        }

        .linuxdo-settings-close:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px var(--ld-ring);
        }

        .linuxdo-settings-form {
            padding: 18px;
            overflow-y: auto;
            flex: 1;
        }

        .linuxdo-settings-section + .linuxdo-settings-section {
            margin-top: 18px;
        }

        .linuxdo-settings-section-header {
            margin-bottom: 10px;
        }

        .linuxdo-settings-section-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--ld-muted-fg);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin: 0 0 4px;
        }

        .linuxdo-settings-section-desc {
            margin: 0;
            font-size: 12px;
            color: var(--ld-muted-fg);
        }

        .linuxdo-settings-card {
            border: 1px solid var(--ld-border);
            border-radius: 12px;
            background: var(--ld-card);
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .linuxdo-settings-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
        }

        .linuxdo-settings-item-text {
            min-width: 0;
            flex: 1;
        }

        .linuxdo-settings-item-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: var(--ld-fg);
            margin: 0;
        }

        .linuxdo-settings-description {
            font-size: 12px;
            color: var(--ld-muted-fg);
            margin-top: 6px;
            line-height: 1.4;
        }

        .linuxdo-settings-separator {
            height: 1px;
            width: 100%;
            background: var(--ld-border);
        }

        .linuxdo-settings-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .linuxdo-settings-field {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .linuxdo-settings-label {
            font-size: 11px;
            font-weight: 500;
            color: var(--ld-fg);
        }

        .linuxdo-settings-input,
        .linuxdo-settings-textarea {
            width: 100%;
            border: 1px solid var(--ld-border);
            background: var(--ld-bg);
            color: var(--ld-fg);
            border-radius: 9px;
            padding: 7px 9px;
            font-size: 11px;
            line-height: 1.4;
            font-family: inherit;
            outline: none;
            transition: box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        }

        .linuxdo-settings-control {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
        }

        .linuxdo-settings-input.small {
            width: 68px;
            text-align: center;
            padding: 6px 8px;
        }

        .linuxdo-settings-unit {
            font-size: 11px;
            color: var(--ld-muted-fg);
            line-height: 1;
        }

        .linuxdo-settings-input::placeholder,
        .linuxdo-settings-textarea::placeholder {
            color: var(--ld-muted-fg);
        }

        .linuxdo-settings-input:focus-visible,
        .linuxdo-settings-textarea:focus-visible {
            box-shadow: 0 0 0 3px var(--ld-ring);
            border-color: rgba(59, 130, 246, 0.65);
        }

        .linuxdo-settings-textarea {
            resize: vertical;
            min-height: 90px;
        }

        /* Switch */
        .linuxdo-settings-switch {
            position: relative;
            width: 44px;
            height: 24px;
            flex-shrink: 0;
        }

        .linuxdo-settings-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .linuxdo-settings-switch-slider {
            position: absolute;
            inset: 0;
            border-radius: 999px;
            border: 1px solid var(--ld-border);
            background: var(--ld-muted);
            cursor: pointer;
            transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .linuxdo-settings-switch-slider:before {
            position: absolute;
            content: "";
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            border-radius: 999px;
            background: var(--ld-bg);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
            transition: transform 0.15s ease, background 0.15s ease;
        }

        .linuxdo-settings-switch input:checked + .linuxdo-settings-switch-slider {
            background: var(--ld-primary);
            border-color: var(--ld-primary);
        }

        .linuxdo-settings-switch input:checked + .linuxdo-settings-switch-slider:before {
            transform: translateX(20px);
            background: var(--ld-primary-fg);
        }

        .linuxdo-settings-switch input:focus-visible + .linuxdo-settings-switch-slider {
            box-shadow: 0 0 0 3px var(--ld-ring);
        }

        .linuxdo-settings-footer {
            display: flex;
            gap: 10px;
            padding: 14px 18px;
            padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
            border-top: 1px solid var(--ld-border);
            background: var(--ld-bg);
            flex-shrink: 0;
        }

        .linuxdo-settings-button {
            flex: 1;
            padding: 10px 14px;
            border-radius: 10px;
            border: 1px solid var(--ld-border);
            background: transparent;
            color: var(--ld-fg);
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            font-family: inherit;
            transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
        }

        .linuxdo-settings-button:hover {
            background: var(--ld-muted);
        }

        .linuxdo-settings-button:active {
            transform: translateY(1px);
        }

        .linuxdo-settings-button:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px var(--ld-ring);
        }

        .linuxdo-settings-button.primary {
            background: var(--ld-primary);
            border-color: var(--ld-primary);
            color: var(--ld-primary-fg);
        }

        .linuxdo-settings-button.primary:hover {
            filter: brightness(0.98);
        }

        @media (max-width: 520px) {
            .linuxdo-settings-dialog {
                width: calc(100vw - 16px);
                max-height: 92vh;
            }

            .linuxdo-settings-form {
                padding: 14px;
            }

            .linuxdo-settings-header,
            .linuxdo-settings-footer {
                padding-left: 14px;
                padding-right: 14px;
            }

            .linuxdo-settings-grid {
                grid-template-columns: 1fr;
            }
        }

        /* 历史复制内容（搜索框右侧） */
        .linuxdo-copy-history-trigger {
            --ld-h-bg: var(--secondary, #ffffff);
            --ld-h-fg: var(--primary, #0f172a);
            --ld-h-muted: var(--primary-very-low, #f1f5f9);
            --ld-h-muted-fg: var(--primary-medium, #64748b);
            --ld-h-border: var(--primary-low, rgba(15, 23, 42, 0.12));
            --ld-h-ring: var(--tertiary-low, rgba(59, 130, 246, 0.45));

            appearance: none;
            border: 1px solid var(--ld-h-border);
            background: transparent;
            color: var(--ld-h-muted-fg);
            width: 32px;
            height: 32px;
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-left: 2px;
            margin-right: 2px;
            transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
        }

        html[style*="color-scheme: dark"] .linuxdo-copy-history-trigger,
        html.dark .linuxdo-copy-history-trigger {
            --ld-h-bg: var(--secondary, #111827);
            --ld-h-fg: var(--primary, #e5e7eb);
            --ld-h-muted: var(--primary-very-low, rgba(148, 163, 184, 0.12));
            --ld-h-muted-fg: var(--primary-medium, #9ca3af);
            --ld-h-border: var(--primary-low, rgba(148, 163, 184, 0.18));
            --ld-h-ring: var(--tertiary-low, rgba(59, 130, 246, 0.55));
        }

        .linuxdo-copy-history-trigger:hover {
            background: var(--ld-h-muted);
            color: var(--ld-h-fg);
        }

        .linuxdo-copy-history-trigger:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px var(--ld-h-ring);
        }

        .linuxdo-copy-history-trigger svg {
            width: 16px;
            height: 16px;
            display: block;
        }

        .linuxdo-copy-history-popover {
            --ld-h-bg: var(--secondary, #ffffff);
            --ld-h-fg: var(--primary, #0f172a);
            --ld-h-muted: var(--primary-very-low, #f1f5f9);
            --ld-h-muted-fg: var(--primary-medium, #64748b);
            --ld-h-border: var(--primary-low, rgba(15, 23, 42, 0.12));
            --ld-h-ring: var(--tertiary-low, rgba(59, 130, 246, 0.18));

            position: fixed;
            z-index: 100000;
            width: min(520px, calc(100vw - 24px));
            max-height: min(70vh, 520px);
            overflow: auto;
            background: var(--ld-h-bg);
            color: var(--ld-h-fg);
            border: 1px solid var(--ld-h-border);
            border-radius: 12px;
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
            padding: 10px;
            display: none;
        }

        html[style*="color-scheme: dark"] .linuxdo-copy-history-popover,
        html.dark .linuxdo-copy-history-popover {
            --ld-h-bg: var(--secondary, #111827);
            --ld-h-fg: var(--primary, #e5e7eb);
            --ld-h-muted: var(--primary-very-low, rgba(148, 163, 184, 0.12));
            --ld-h-muted-fg: var(--primary-medium, #9ca3af);
            --ld-h-border: var(--primary-low, rgba(148, 163, 184, 0.18));
            --ld-h-ring: var(--tertiary-low, rgba(59, 130, 246, 0.24));
            box-shadow: 0 24px 90px rgba(0, 0, 0, 0.52);
        }

        .linuxdo-copy-history-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 2px 2px 10px;
            border-bottom: 1px solid var(--ld-h-border);
            margin-bottom: 8px;
        }

        .linuxdo-copy-history-header-left {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            min-width: 0;
        }

        .linuxdo-copy-history-title {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--ld-h-muted-fg);
        }

        .linuxdo-copy-history-select-all {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 24px;
            padding: 0 10px;
            border-radius: 10px;
            border: 1px solid var(--ld-h-border);
            background: transparent;
            font-size: 12px;
            font-weight: 500;
            line-height: 1;
            color: var(--ld-h-muted-fg);
            user-select: none;
            cursor: pointer;
            white-space: nowrap;
            transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
        }

        .linuxdo-copy-history-select-all:hover {
            background: var(--ld-h-muted);
            color: var(--ld-h-fg);
            box-shadow: 0 0 0 3px var(--ld-h-ring);
        }

        .linuxdo-copy-history-select-all:active {
            transform: translateY(1px);
        }

        .linuxdo-copy-history-select-all input[type="checkbox"] {
            width: 14px;
            height: 14px;
            margin: 0;
            display: block;
            cursor: pointer;
            accent-color: var(--tertiary, #3b82f6);
        }

        .linuxdo-copy-history-settings-btn,
        .linuxdo-copy-history-delete-btn {
            appearance: none;
            border: 1px solid var(--ld-h-border);
            background: transparent;
            color: var(--ld-h-muted-fg);
            height: 24px;
            padding: 0 10px;
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            line-height: 1;
            transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
        }

        .linuxdo-copy-history-settings-btn:hover,
        .linuxdo-copy-history-delete-btn:hover {
            background: var(--ld-h-muted);
            color: var(--ld-h-fg);
            box-shadow: 0 0 0 3px var(--ld-h-ring);
        }

        .linuxdo-copy-history-settings-btn:active,
        .linuxdo-copy-history-delete-btn:active {
            transform: translateY(1px);
        }

        .linuxdo-copy-history-settings-btn:focus-visible,
        .linuxdo-copy-history-delete-btn:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px var(--ld-h-ring);
        }

        .linuxdo-copy-history-delete-btn {
            color: var(--danger, #b91c1c);
        }

        .linuxdo-copy-history-delete-btn:hover {
            background: var(--danger-low, rgba(239, 68, 68, 0.12));
            color: var(--danger, #991b1b);
            box-shadow: 0 0 0 3px var(--danger-low, rgba(239, 68, 68, 0.22));
        }

        .linuxdo-copy-history-delete-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .linuxdo-copy-history-delete-btn:disabled:hover {
            background: transparent;
            color: var(--ld-h-muted-fg);
            box-shadow: none;
        }

        .linuxdo-copy-history-hint {
            font-size: 12px;
            color: var(--ld-h-muted-fg);
            white-space: nowrap;
        }

        .linuxdo-copy-history-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .linuxdo-copy-history-item {
            border: 1px solid var(--ld-h-border);
            border-radius: 12px;
            padding: 10px;
            background: transparent;
            transition: background 0.15s ease, box-shadow 0.15s ease;
        }

        .linuxdo-copy-history-item.is-selected {
            background: var(--ld-h-muted);
            box-shadow: 0 0 0 3px var(--ld-h-ring);
        }

        .linuxdo-copy-history-item:hover {
            background: var(--ld-h-muted);
            box-shadow: 0 0 0 3px var(--ld-h-ring);
        }

        .linuxdo-copy-history-item-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 10px;
        }

        .linuxdo-copy-history-item-checkbox-wrap {
            display: inline-flex;
            align-items: flex-start;
            padding-top: 2px;
            flex-shrink: 0;
        }

        .linuxdo-copy-history-item-checkbox {
            width: 14px;
            height: 14px;
            margin: 0;
            display: block;
            cursor: pointer;
            accent-color: var(--tertiary, #3b82f6);
        }

        .linuxdo-copy-history-item-text {
            min-width: 0;
            flex: 1;
        }

        .linuxdo-copy-history-item-title {
            font-size: 13px;
            font-weight: 600;
            line-height: 1.35;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .linuxdo-copy-history-item-snippet {
            margin-top: 4px;
            font-size: 12px;
            color: var(--ld-h-muted-fg);
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .linuxdo-copy-history-actions {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
        }

        .linuxdo-copy-history-btn {
            appearance: none;
            border: 1px solid var(--ld-h-border);
            background: transparent;
            color: var(--ld-h-fg);
            border-radius: 10px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
            white-space: nowrap;
        }

        .linuxdo-copy-history-btn:hover {
            background: var(--ld-h-muted);
            box-shadow: 0 0 0 3px var(--ld-h-ring);
        }

        .linuxdo-copy-history-btn:active {
            transform: translateY(1px);
        }

        .linuxdo-copy-history-btn:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px var(--ld-h-ring);
        }

        .linuxdo-copy-history-empty {
            padding: 18px 8px;
            text-align: center;
            font-size: 12px;
            color: var(--ld-h-muted-fg);
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

  // #region 工具函数
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
   * @description 将文本规整为单行（用于简洁模式输出）。
   * @param {string} text - 原始文本。
   * @returns {string} 单行文本。
   */
  function normalizeToSingleLine(text) {
    return (text || '')
      .replace(/\r\n/g, '\n')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * @description 去除 AI 总结前缀，输出更干净。
   * @param {string} summary - 总结文本。
   * @returns {string} 去前缀后的总结文本。
   */
  function stripAiSummaryPrefix(summary) {
    return (summary || '').replace(/^\[AI\s*总结\]\s*:?\s*/i, '');
  }

  function isAiSummaryText(summary) {
    return /^\[AI\s*总结\]\s*:?\s*/i.test(summary || '');
  }

  /**
   * @description 根据配置格式化复制内容。
   * @param {object} articleData - 文章数据。
   * @returns {string} 最终要复制的文本。
   */
  function formatCopiedText(articleData) {
    if (CONFIG.COMPACT_MODE) {
      const rawSummary = articleData && articleData.summary;
      const title = normalizeToSingleLine(articleData && articleData.title);
      const summary = normalizeToSingleLine(stripAiSummaryPrefix(rawSummary));
      const author = String((articleData && articleData.username) || '').replace(/^@/, '').trim();
      const authorMention = author ? author.split(/\s+/)[0] : '';
      const authorSuffix = authorMention ? ` @${authorMention}` : '';

      const aiConfigured = !!(CONFIG.USE_AI_FOR_SUMMARY && CONFIG.API_KEY);
      const aiSucceeded = isAiSummaryText(rawSummary);

      // 简洁模式：默认不保留标题；但若 AI 总结失败（配置了 AI 且未生成 AI 总结），则回退为旧版简洁输出（标题：摘要）
      if (aiConfigured && !aiSucceeded) {
        let combined = title && summary ? `${title}：${summary}` : (title || summary);
        if (combined && authorSuffix) combined = `${combined}${authorSuffix}`;
        return [combined, articleData && articleData.link].filter(Boolean).join('\n').trim();
      }

      const summaryLine = summary && authorSuffix ? `${summary}${authorSuffix}` : summary;
      return [summaryLine, articleData && articleData.link].filter(Boolean).join('\n').trim();
    }

    const template = CONFIG.ARTICLE_COPY_TEMPLATE || DEFAULT_CONFIG.ARTICLE_COPY_TEMPLATE;
    let formattedText = String(template).replace(/{{(\w+)}}/g, (match, key) => {
      return articleData[key] !== undefined ? articleData[key] : match;
    });

    return formattedText.replace(/\n\n+/g, '\n\n').trim();
  }

  // #endregion

  // #region 历史复制内容（搜索框）
  // ==========================================================

  const COPY_HISTORY_STORAGE_KEY = 'COPY_HISTORY_V1';
  let copyHistoryPopoverEl = null;
  let copyHistoryHideTimer = null;
  let copyHistoryGlobalListenersBound = false;
  let copyHistorySelectedIds = new Set();

  /**
   * @description 读取历史复制内容列表。
   * @returns {Array<{id: string, title: string, summary: string, link: string, text: string, createdAt: number}>}
   */
  function getCopyHistoryItems() {
    const raw = GM_getValue(COPY_HISTORY_STORAGE_KEY, []);
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: String(item.id || ''),
        title: String(item.title || ''),
        summary: String(item.summary || ''),
        link: String(item.link || ''),
        text: String(item.text || ''),
        createdAt: Number(item.createdAt || 0),
      }))
      .filter((item) => item.id && item.text);
  }

  /**
   * @description 尝试持久化历史；若存储空间不足，则回退保留最近 N 条。
   * @param {Array} items - 历史列表。
   * @returns {Array} 实际保存的历史列表。
   */
  function persistCopyHistoryItems(items) {
    try {
      GM_setValue(COPY_HISTORY_STORAGE_KEY, items);
      return items;
    } catch (error) {
      console.warn('保存历史复制内容失败，尝试回退条数：', error);

      let trimmed = items.slice(0, SCRIPT_CONSTANTS.COPY_HISTORY_FALLBACK_LIMIT);
      while (trimmed.length > 0) {
        try {
          GM_setValue(COPY_HISTORY_STORAGE_KEY, trimmed);
          return trimmed;
        } catch (e) {
          trimmed = trimmed.slice(0, trimmed.length - 1);
        }
      }

      try {
        GM_setValue(COPY_HISTORY_STORAGE_KEY, []);
      } catch (_) {
        // ignore
      }
      return [];
    }
  }

  /**
   * @description 写入一条历史记录（新记录置顶，按链接去重）。
   * @param {object} param - 参数对象。
   * @param {object} param.articleData - 文章数据。
   * @param {string} param.copiedText - 最终复制文本。
   */
  function addCopyHistoryItem({ articleData, copiedText }) {
    const title = String((articleData && articleData.title) || '').trim();
    const link = String((articleData && articleData.link) || '').trim();
    const summary = String(stripAiSummaryPrefix((articleData && articleData.summary) || '')).trim();
    const text = String(copiedText || '').trim();
    if (!text) return;

    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const nextItem = { id, title, summary, link, text, createdAt: Date.now() };

    const existing = getCopyHistoryItems();
    const deduped = existing.filter((it) => !(link && it.link === link));
    const next = [nextItem, ...deduped];
    const saved = persistCopyHistoryItems(next);

    if (copyHistoryPopoverEl && copyHistoryPopoverEl.style.display !== 'none') {
      renderCopyHistoryPopover(saved);
    }
  }

  function ensureCopyHistoryPopover() {
    if (copyHistoryPopoverEl && document.body.contains(copyHistoryPopoverEl)) return copyHistoryPopoverEl;

    const popover = document.createElement('div');
    popover.className = 'linuxdo-copy-history-popover';
    popover.setAttribute('role', 'menu');
    popover.setAttribute('aria-label', '历史复制内容');
    document.body.appendChild(popover);

    popover.addEventListener('mouseenter', () => {
      if (copyHistoryHideTimer) {
        clearTimeout(copyHistoryHideTimer);
        copyHistoryHideTimer = null;
      }
    });

    popover.addEventListener('mouseleave', () => {
      scheduleHideCopyHistoryPopover();
    });

    popover.addEventListener('change', (e) => {
      const selectAll = e.target && e.target.closest && e.target.closest('input[type="checkbox"][data-action="select-all"]');
      if (selectAll) {
        const list = getCopyHistoryItems();
        if (selectAll.checked) {
          copyHistorySelectedIds = new Set(list.map((x) => x.id));
        } else {
          copyHistorySelectedIds.clear();
        }
        updateCopyHistorySelectionUI(list);
        return;
      }

      const itemCheckbox = e.target && e.target.closest && e.target.closest('input[type="checkbox"][data-action="select-item"][data-id]');
      if (itemCheckbox) {
        const id = String(itemCheckbox.getAttribute('data-id') || '').trim();
        if (!id) return;
        if (itemCheckbox.checked) {
          copyHistorySelectedIds.add(id);
        } else {
          copyHistorySelectedIds.delete(id);
        }
        updateCopyHistorySelectionUI();
      }
    });

    popover.addEventListener('click', (e) => {
      const settingsBtn = e.target.closest('button[data-action="settings"]');
      if (settingsBtn) {
        e.preventDefault();
        e.stopPropagation();
        hideCopyHistoryPopover();
        if (typeof showSettingsModal === 'function') showSettingsModal();
        return;
      }

      const deleteBtn = e.target.closest('button[data-action="delete-selected"]');
      if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();

        const count = copyHistorySelectedIds.size;
        if (count <= 0) return;

        const confirmed = window.confirm(`确定删除已选择的 ${count} 条记录吗？`);
        if (!confirmed) return;

        const items = getCopyHistoryItems();
        const next = items.filter((x) => !copyHistorySelectedIds.has(x.id));
        const saved = persistCopyHistoryItems(next);
        copyHistorySelectedIds.clear();
        renderCopyHistoryPopover(saved);
        return;
      }

      const btn = e.target.closest('button[data-action][data-id]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      const items = getCopyHistoryItems();
      const item = items.find((x) => x.id === id);
      if (!item) return;

      if (action === 'copy') {
        copyTextToClipboard({ element: btn, text: item.text });
      } else if (action === 'open') {
        if (item.link) window.open(item.link, '_blank', 'noopener,noreferrer');
      }
    });

    window.addEventListener('scroll', (e) => {
      // 不要在滚动弹窗自身时关闭（鼠标滚轮/拖动滚动条）
      if (!copyHistoryPopoverEl || copyHistoryPopoverEl.style.display === 'none') return;
      const target = e && e.target;
      if (target && copyHistoryPopoverEl.contains(target)) return;
      hideCopyHistoryPopover();
    }, true);
    window.addEventListener('resize', () => hideCopyHistoryPopover(), true);

    copyHistoryPopoverEl = popover;
    return popover;
  }

  function scheduleHideCopyHistoryPopover() {
    if (copyHistoryHideTimer) clearTimeout(copyHistoryHideTimer);
    copyHistoryHideTimer = setTimeout(() => hideCopyHistoryPopover(), 150);
  }

  function hideCopyHistoryPopover() {
    if (!copyHistoryPopoverEl) return;
    copyHistoryPopoverEl.style.display = 'none';
    copyHistorySelectedIds.clear();
  }

  function updateCopyHistorySelectionUI(items) {
    const popover = copyHistoryPopoverEl;
    if (!popover) return;

    const list = Array.isArray(items) ? items : getCopyHistoryItems();
    const validIds = new Set(list.map((x) => x.id));
    for (const id of copyHistorySelectedIds) {
      if (!validIds.has(id)) copyHistorySelectedIds.delete(id);
    }

    const selectedCount = copyHistorySelectedIds.size;
    const totalCount = list.length;

    const hintEl = popover.querySelector('.linuxdo-copy-history-hint');
    if (hintEl) {
      hintEl.textContent = selectedCount > 0
        ? `已选 ${selectedCount} / 共 ${totalCount}`
        : '勾选后可批量删除';
    }

    const deleteBtn = popover.querySelector('button[data-action="delete-selected"]');
    if (deleteBtn) {
      deleteBtn.disabled = selectedCount === 0;
      deleteBtn.textContent = selectedCount > 0 ? `删除(${selectedCount})` : '删除';
    }

    const selectAllEl = popover.querySelector('input[type="checkbox"][data-action="select-all"]');
    if (selectAllEl) {
      selectAllEl.disabled = totalCount === 0;
      selectAllEl.checked = totalCount > 0 && selectedCount === totalCount;
      selectAllEl.indeterminate = selectedCount > 0 && selectedCount < totalCount;
    }

    const itemEls = popover.querySelectorAll('.linuxdo-copy-history-item[data-item-id]');
    itemEls.forEach((itemEl) => {
      const id = itemEl.getAttribute('data-item-id');
      const checked = !!(id && copyHistorySelectedIds.has(id));
      itemEl.classList.toggle('is-selected', checked);
      const checkbox = itemEl.querySelector('input[type="checkbox"][data-action="select-item"][data-id]');
      if (checkbox) checkbox.checked = checked;
    });
  }

  function positionCopyHistoryPopover(triggerEl) {
    if (!copyHistoryPopoverEl || !triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const popoverRect = copyHistoryPopoverEl.getBoundingClientRect();

    const gap = 8;
    let top = rect.bottom + gap;
    let left = rect.right - popoverRect.width;

    const maxLeft = window.innerWidth - popoverRect.width - 12;
    const minLeft = 12;
    if (left > maxLeft) left = maxLeft;
    if (left < minLeft) left = minLeft;

    const maxTop = window.innerHeight - popoverRect.height - 12;
    if (top > maxTop) top = Math.max(12, rect.top - popoverRect.height - gap);

    copyHistoryPopoverEl.style.top = `${Math.round(top)}px`;
    copyHistoryPopoverEl.style.left = `${Math.round(left)}px`;
  }

  function renderCopyHistoryPopover(items) {
    const popover = ensureCopyHistoryPopover();
    const list = Array.isArray(items) ? items : getCopyHistoryItems();

    const header = `
        <div class="linuxdo-copy-history-header">
          <div class="linuxdo-copy-history-header-left">
            <label class="linuxdo-copy-history-select-all" title="全选/取消全选">
              <input type="checkbox" data-action="select-all" />
              全选
            </label>
            <div class="linuxdo-copy-history-title">历史复制</div>
            <button type="button" class="linuxdo-copy-history-settings-btn" data-action="settings" aria-label="打开设置" title="打开设置">设置</button>
            <button type="button" class="linuxdo-copy-history-delete-btn" data-action="delete-selected" aria-label="删除已选择" title="删除已选择" disabled>删除</button>
          </div>
          <div class="linuxdo-copy-history-hint">勾选后可批量删除</div>
        </div>
      `;

    if (!list || list.length === 0) {
      popover.innerHTML = header + `<div class="linuxdo-copy-history-empty">暂无历史记录</div>`;
      updateCopyHistorySelectionUI(list);
      return;
    }

    const html = list
      .slice(0, Math.max(list.length, 0))
      .map((item) => {
        const safeTitle = escapeHtml(item.title || '（无标题）');
        const snippet = escapeHtml((item.summary || item.text || '').trim());
        return `
          <div class="linuxdo-copy-history-item" role="menuitem" data-item-id="${escapeHtml(item.id)}">
            <div class="linuxdo-copy-history-item-top">
              <label class="linuxdo-copy-history-item-checkbox-wrap" title="选择">
                <input type="checkbox" class="linuxdo-copy-history-item-checkbox" data-action="select-item" data-id="${escapeHtml(item.id)}" aria-label="选择此条历史记录" />
              </label>
              <div class="linuxdo-copy-history-item-text">
                <div class="linuxdo-copy-history-item-title">${safeTitle}</div>
                <div class="linuxdo-copy-history-item-snippet">${snippet}</div>
              </div>
              <div class="linuxdo-copy-history-actions">
                <button type="button" class="linuxdo-copy-history-btn" data-action="copy" data-id="${escapeHtml(item.id)}">再次复制</button>
                <button type="button" class="linuxdo-copy-history-btn" data-action="open" data-id="${escapeHtml(item.id)}">打开链接</button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    popover.innerHTML = header + `<div class="linuxdo-copy-history-list">${html}</div>`;
    updateCopyHistorySelectionUI(list);
  }

  function findHeaderSearchActionsContainer() {
    const input = document.getElementById('header-search-input');
    if (input) {
      const searchInput = input.closest('.search-input') || input.closest('.search-input-wrapper');
      const searching = searchInput ? searchInput.querySelector('.searching') : null;
      if (searching) return searching;
    }
    return document.querySelector('.floating-search-input-wrapper .searching');
  }

  /**
   * @description 在搜索框右侧注入历史按钮（hover 展开）。
   */
  function ensureCopyHistoryTrigger() {
    const container = findHeaderSearchActionsContainer();
    if (!container) return;
    if (container.querySelector('.linuxdo-copy-history-trigger')) return;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'linuxdo-copy-history-trigger';
    trigger.title = '历史复制内容';
    trigger.setAttribute('aria-label', '历史复制内容');
    trigger.innerHTML = /*html*/`
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8v4l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M3 3v4h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const popover = ensureCopyHistoryPopover();

    trigger.addEventListener('mouseenter', () => {
      if (copyHistoryHideTimer) {
        clearTimeout(copyHistoryHideTimer);
        copyHistoryHideTimer = null;
      }
      renderCopyHistoryPopover();
      popover.style.display = 'block';
      positionCopyHistoryPopover(trigger);
    });

    trigger.addEventListener('mouseleave', () => {
      scheduleHideCopyHistoryPopover();
    });

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = popover.style.display !== 'none';
      if (isOpen) {
        hideCopyHistoryPopover();
      } else {
        renderCopyHistoryPopover();
        popover.style.display = 'block';
        positionCopyHistoryPopover(trigger);
      }
    });

    if (!copyHistoryGlobalListenersBound) {
      copyHistoryGlobalListenersBound = true;
      document.addEventListener('click', (e) => {
        if (!copyHistoryPopoverEl) return;
        if (copyHistoryPopoverEl.style.display === 'none') return;
        const anyTrigger = document.querySelector('.linuxdo-copy-history-trigger');
        if (anyTrigger && (e.target === anyTrigger || anyTrigger.contains(e.target))) return;
        if (copyHistoryPopoverEl.contains(e.target)) return;
        hideCopyHistoryPopover();
      }, true);
    }

    container.appendChild(trigger);
  }

  // #endregion

  // #region AI 总结与剪贴板
  // ==========================================================

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
      console.debug('文本已复制到剪贴板');
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
      return function (...args) {
        return func.apply(this, args);
      };
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
      const usernameElement = postAuthorContainer.querySelector('.username a, .names .first.full-name a');
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
        console.debug('尝试使用 AI 总结内容...');
        const titleForAi = normalizeToSingleLine(articleData.title);
        let contentToSummarize = '';
        if (titleForAi) {
          const header = `标题：${titleForAi}\n\n`;
          const remaining = Math.max(0, SCRIPT_CONSTANTS.AI_CONTENT_MAX_LENGTH - header.length);
          contentToSummarize = header + fullTextContent.substring(0, remaining);
        } else {
          contentToSummarize = fullTextContent.substring(0, SCRIPT_CONSTANTS.AI_CONTENT_MAX_LENGTH);
        }
        const customPrompt = CONFIG.CUSTOM_SUMMARY_PROMPT || DEFAULT_CONFIG.CUSTOM_SUMMARY_PROMPT;
        const prompt = customPrompt
          .replace('{maxChars}', CONFIG.LOCAL_SUMMARY_MAX_CHARS)
          .replace('{content}', contentToSummarize);

        try {
          articleData.summary = `[AI总结]:` + await callAiAPI(prompt, CONFIG.API_KEY, CONFIG.MODEL_NAME);
          console.debug('AI 总结完成:', CONFIG.MODEL_NAME);
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

        const formattedText = formatCopiedText(articleData);
        addCopyHistoryItem({ articleData, copiedText: formattedText });
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
          <div>
            <h2 class="linuxdo-settings-title">设置</h2>
            <p class="linuxdo-settings-subtitle">Linux do 分享助手</p>
          </div>
          <button class="linuxdo-settings-close" type="button" aria-label="关闭">×</button>
        </div>
        <form class="linuxdo-settings-form" method="dialog">
          <section class="linuxdo-settings-section">
            <div class="linuxdo-settings-section-header">
              <h3 class="linuxdo-settings-section-title">复制内容</h3>
              <p class="linuxdo-settings-section-desc">控制复制到剪贴板的格式与密度</p>
            </div>
            <div class="linuxdo-settings-card">
              <div class="linuxdo-settings-item">
                <div class="linuxdo-settings-item-text">
                  <label class="linuxdo-settings-item-label" for="compactMode">简洁模式</label>
                  <div class="linuxdo-settings-description">开启后：标题与摘要合并为一段；隐藏作者/板块/标签；链接单独一行且无空行</div>
                </div>
                <label class="linuxdo-settings-switch">
                  <input type="checkbox" id="compactMode" ${CONFIG.COMPACT_MODE ? 'checked' : ''}>
                  <span class="linuxdo-settings-switch-slider"></span>
                </label>
              </div>
            </div>
          </section>

          <section class="linuxdo-settings-section">
            <div class="linuxdo-settings-section-header">
              <h3 class="linuxdo-settings-section-title">AI 总结</h3>
              <p class="linuxdo-settings-section-desc">可选：使用 OpenAI Compatible 接口</p>
            </div>
            <div class="linuxdo-settings-card">
              <div class="linuxdo-settings-item">
                <div class="linuxdo-settings-item-text">
                  <label class="linuxdo-settings-item-label" for="useAiForSummary">启用 AI 总结</label>
                  <div class="linuxdo-settings-description">开启后将使用 AI 对文章内容进行智能总结</div>
                </div>
                <label class="linuxdo-settings-switch">
                  <input type="checkbox" id="useAiForSummary" ${CONFIG.USE_AI_FOR_SUMMARY ? 'checked' : ''}>
                  <span class="linuxdo-settings-switch-slider"></span>
                </label>
              </div>

              <div class="linuxdo-settings-separator"></div>

              <div class="linuxdo-settings-grid">
                <div class="linuxdo-settings-field">
                  <label class="linuxdo-settings-label" for="apiKey">API Key</label>
                  <input type="password" id="apiKey" class="linuxdo-settings-input" value="${escapeHtml(CONFIG.API_KEY)}" placeholder="输入 API Key" autocomplete="off">
                </div>
                <div class="linuxdo-settings-field">
                  <label class="linuxdo-settings-label" for="modelName">模型</label>
                  <input type="text" id="modelName" class="linuxdo-settings-input" value="${escapeHtml(CONFIG.MODEL_NAME)}" placeholder="gpt-4o-mini">
                </div>
              </div>

              <div class="linuxdo-settings-field">
                <label class="linuxdo-settings-label" for="apiBaseUrl">API 地址</label>
                <input type="text" id="apiBaseUrl" class="linuxdo-settings-input" value="${escapeHtml(CONFIG.API_BASE_URL)}" placeholder="https://api.openai.com/v1/chat/completions">
                <div class="linuxdo-settings-description">使用 OpenAI 兼容格式的完整 API 地址</div>
              </div>
            </div>
          </section>

          <section class="linuxdo-settings-section">
            <div class="linuxdo-settings-section-header">
              <h3 class="linuxdo-settings-section-title">总结设置</h3>
              <p class="linuxdo-settings-section-desc">控制粘贴板正文长度与 Prompt</p>
            </div>
            <div class="linuxdo-settings-card">
              <div class="linuxdo-settings-grid">
                <div class="linuxdo-settings-field">
                  <label class="linuxdo-settings-label" for="localSummaryMaxChars">最大字符数</label>
                  <input type="number" id="localSummaryMaxChars" class="linuxdo-settings-input" value="${CONFIG.LOCAL_SUMMARY_MAX_CHARS}" placeholder="90" min="1" max="10000">
                  <div class="linuxdo-settings-description">范围：1 - 10000</div>
                </div>
              </div>
              <div class="linuxdo-settings-field">
                <label class="linuxdo-settings-label" for="customPrompt">自定义 Prompt</label>
                <textarea id="customPrompt" class="linuxdo-settings-textarea" placeholder="输入自定义的总结提示词">${escapeHtml(CONFIG.CUSTOM_SUMMARY_PROMPT)}</textarea>
                <div class="linuxdo-settings-description">使用 {maxChars} 表示最大字符数，{content} 表示文章内容</div>
              </div>
            </div>
          </section>
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

      const compactMode = dialog.querySelector('#compactMode').checked;
      const useAiForSummary = dialog.querySelector('#useAiForSummary').checked;
      const apiKey = dialog.querySelector('#apiKey').value.trim();
      const apiBaseUrl = dialog.querySelector('#apiBaseUrl').value.trim();
      const localSummaryMaxChars = parseInt(dialog.querySelector('#localSummaryMaxChars').value.trim()) || DEFAULT_CONFIG.LOCAL_SUMMARY_MAX_CHARS;
      const customPrompt = dialog.querySelector('#customPrompt').value.trim();
      const modelName = dialog.querySelector('#modelName').value.trim();

      setConfig('COMPACT_MODE', compactMode);
      setConfig('USE_AI_FOR_SUMMARY', useAiForSummary);
      setConfig('API_KEY', apiKey);
      setConfig('API_BASE_URL', apiBaseUrl || DEFAULT_CONFIG.API_BASE_URL);
      setConfig('MODEL_NAME', modelName || DEFAULT_CONFIG.MODEL_NAME);
      setConfig('LOCAL_SUMMARY_MAX_CHARS', localSummaryMaxChars);
      setConfig('CUSTOM_SUMMARY_PROMPT', customPrompt || DEFAULT_CONFIG.CUSTOM_SUMMARY_PROMPT);

      const originalText = saveBtn.textContent;
      saveBtn.textContent = '已保存';
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
      console.debug('在 iframe 中，跳过显示设置界面');
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
      console.debug("在 iframe 中，跳过脚本初始化");
      return;
    }

    // console.log("油猴脚本已尝试初始化。");

    // 顶部搜索框：历史复制内容
    ensureCopyHistoryTrigger();

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
    } else if (document.querySelector('h1[data-topic-id]')) {
      console.debug('部分所需元素未找到，等待DOM更新:', {
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
