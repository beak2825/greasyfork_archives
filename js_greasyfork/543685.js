// ==UserScript==
// @name         S1 Plus - Stage1st 体验增强套件
// @namespace    http://tampermonkey.net/
// @version      6.2.1
// @description  为Stage1st论坛提供帖子/用户屏蔽、导航栏自定义、自动签到、阅读进度跟踪、回复收藏、远程同步等多种功能，全方位优化你的论坛体验。
// @author       moekyo
// @match        https://stage1st.com/2b/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      api.github.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543685/S1%20Plus%20-%20Stage1st%20%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/543685/S1%20Plus%20-%20Stage1st%20%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SCRIPT_VERSION = "6.2.1";
  const SCRIPT_RELEASE_DATE = "2025-10-23";

  // --- [新增] SHA-256 哈希计算库 (基于 Web Crypto API) ---
  /**
   * 计算字符串的 SHA-256 哈希值。
   * @param {string} message - 要计算哈希的字符串。
   * @returns {Promise<string>} 64个字符的十六进制哈希字符串。
   */
  const sha256 = async (message) => {
    // 将消息编码为 Uint8Array
    const msgUint8 = new TextEncoder().encode(message);
    // 使用 subtle.digest 进行哈希计算
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    // 将 ArrayBuffer 转换为字节数组
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // 将字节数组转换为十六进制字符串
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // --- [新增] 确定性JSON序列化与哈希计算辅助函数 ---

  /**
   * 对对象进行深度排序，确保键的顺序一致，以便生成稳定的哈希值。
   * @param {any} obj 要排序的对象。
   * @returns {any} 键已排序的对象。
   */
  const deterministicSort = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(deterministicSort);
    }
    const sortedKeys = Object.keys(obj).sort();
    const newObj = {};
    for (const key of sortedKeys) {
      newObj[key] = deterministicSort(obj[key]);
    }
    return newObj;
  };

  // --- [新增] 全局状态标志，用于防止启动时的同步竞态条件 ---
  let isInitialSyncInProgress = false;

  /**
   * 计算数据对象的 SHA-256 哈希值。
   * @param {object} dataObject - 要计算哈希的数据对象 (即 `data` 字段的内容)。
   * @returns {Promise<string>} 计算出的哈希值。
   */
  const calculateDataHash = async (dataObject) => {
    // 1. 深度排序对象键，确保序列化结果的确定性
    const sortedData = deterministicSort(dataObject);
    // 2. 序列化为JSON字符串
    const stringifiedData = JSON.stringify(sortedData);
    // 3. 计算SHA-256哈希
    return await sha256(stringifiedData);
  };
  const SVG_ICON_DELETE_DEFAULT = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0' /%3E%3C/svg%3E`;
  const SVG_ICON_DELETE_HOVER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0' /%3E%3C/svg%3E`;
  const SVG_ICON_ARROW_MASK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 16'%3E%3Cpath d='M2 2L8 8L2 14' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E`;

  GM_addStyle(`
    /* --- 通用颜色 --- */
    :root {
      /* -- 基础调色板 -- */
      --s1p-bg: #ecedeb;
      --s1p-pri: #d1d9c1;
      --s1p-sub: #e9ebe8;
      --s1p-white: #ffffff;
      --s1p-black-rgb: 0, 0, 0;

      /* -- [新增] 阴影 -- */
      --s1p-shadow-color-rgb: 0, 0, 0;

      /* -- 主题色 -- */
      --s1p-t: #022c80;
      --s1p-desc-t: #10388a;
      --s1p-sec: #2563eb;
      --s1p-sec-h: #306bebff;
      --s1p-sub-h: #2563eb;
      --s1p-sub-h-t: var(--s1p-white);

      /* -- 状态色 -- */
      --s1p-red: #ef4444;
      --s1p-red-h: #dc2626;
      --s1p-green: #22c55e;
      --s1p-green-h: #28b05aff;
      --s1p-success-bg: #d1fae5;
      --s1p-success-text: #065f46;
      --s1p-error-bg: #fee2e2;

      /* -- 组件专属 -- */
      --s1p-text-empty: #888;
      --s1p-icon-color: #a1a1aa;
      --s1p-icon-close: #9ca3af;
      --s1p-icon-arrow: #6b7280;
      --s1p-confirm-hover-bg: #27da80;
      --s1p-cancel-hover-bg: #ff6464;
      --s1p-secondary-bg: #e5e7eb;
      --s1p-secondary-text: #374151;
      --s1p-code-bg: #eee;
      --s1p-readprogress-bg: #b8d56f;

      --s1p-list-item-status-bg: #dddddd;

      /* -- 阅读进度 -- */
      --s1p-progress-hot: rgb(192, 51, 34);
      --s1p-progress-cold: rgb(107, 114, 128);
    }

    @keyframes s1p-tab-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* --- [FIX] 导航栏垂直居中对齐修正 --- */
    #nv > ul {
      display: flex !important;
      align-items: center !important;
    }

    /* --- [MODIFIED] 手动同步导航按钮 (v5) --- */
    #s1p-nav-sync-btn {
      flex-shrink: 0;
      margin-left: 8px;
    }

    #s1p-nav-sync-btn a {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      vertical-align: middle;
      padding: 0 10px;
      box-sizing: border-box;
    }
    #s1p-nav-sync-btn svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      color: var(--s1p-t);
      transition: color 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      top: 1.5px;
    }
    /* [新增] 通过为图标的路径同时应用填充和同色描边，来实现视觉上的“加粗”效果 */
    #s1p-nav-sync-btn svg path {
      stroke: currentColor; /* 描边颜色与填充色(currentColor)一致 */
      stroke-width: 0.6px; /* 描边宽度，可调整此值改变加粗程度 */
      stroke-linejoin: round; /* 让描边的边角更平滑 */
    }
    #s1p-nav-sync-btn a:hover svg {
      color: var(--s1p-t);
      transform: scale(1.1);
    }

    /* --- [核心修复] 针对 S1 NUX 窄屏模式的兼容性适配 --- */
    @media (max-width: 909px) {
      #nv ul #s1p-nav-sync-btn {
        margin-left: 0 !important; /* 移除外边距，解决背景断裂问题 */
      }
      #nv ul #s1p-nav-sync-btn a {
        /* [修改] 增加了左侧内边距，使其与左侧按钮的视觉间距更协调 */
        padding: 0 4px 0 8px !important;
      }
    }

    /* --- [MODIFIED] 最终简化版同步动画 (只有旋转) --- */
    @keyframes s1p-sync-simple-rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    #s1p-nav-sync-btn svg.s1p-syncing {
      animation: s1p-sync-simple-rotate 0.8s linear infinite;
      pointer-events: none;
    }
    #s1p-nav-sync-btn svg.s1p-sync-success {
      /* 移除了所有成功状态的视觉效果 */
    }
    #s1p-nav-sync-btn svg.s1p-sync-error {
      /* 移除了所有失败状态的视觉效果 */
    }

    /* --- 手动同步弹窗样式 --- */
    .s1p-sync-choice-info {
      background-color: var(--s1p-sub);
      border-radius: 6px;
      padding: 12px;
      margin-top: 12px;
      font-size: 13px;
      line-height: 1.7;
    }
    .s1p-sync-choice-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .s1p-sync-choice-info-label {
      font-weight: 500;
      color: var(--s1p-t);
    }
    .s1p-sync-choice-info-time {
      font-family: monospace, sans-serif;
    }
    .s1p-sync-choice-newer {
      color: var(--s1p-success-text);
      font-weight: bold;
    }

    /* --- [MODIFIED V3] 手动同步对比弹窗样式 (美化版) --- */
    .s1p-sync-last-action {
      font-size: 13px;
      color: var(--s1p-desc-t);
      text-align: center;
      margin: 12px 0 4px 0;
      padding: 8px;
      background-color: var(--s1p-sub);
      border-radius: 6px;
    }
    .s1p-sync-comparison-table {
      margin-top: 16px;
      border: 1px solid var(--s1p-pri);
      border-radius: 8px;
      overflow: hidden;
      font-size: 14px;
    }
    .s1p-sync-comparison-row {
      display: grid;
      grid-template-columns: auto 1fr 1fr; /* <-- [核心修改] 使用 auto 关键字 */
      align-items: center;
      border-bottom: 1px solid var(--s1p-pri);
      transition: background-color 0.2s ease;
    }
    .s1p-sync-comparison-row:last-child {
      border-bottom: none;
    }
    /* 斑马条纹效果 */
    .s1p-sync-comparison-row:nth-child(even) {
      background-color: var(--s1p-sub);
    }
    .s1p-sync-comparison-row:hover {
      background-color: var(--s1p-pri);
    }
    /* 表头样式 */
    .s1p-sync-comparison-header {
      font-weight: 600;
      background-color: var(--s1p-pri) !important;
      color: var(--s1p-t);
      border-bottom: 1px solid var(--s1p-pri);
    }
    .s1p-sync-comparison-header > div {
      padding: 10px 14px;
      text-align: center;
    }
    .s1p-sync-comparison-header > div:first-child {
      text-align: left;
    }
    /* 单元格样式 */
    .s1p-sync-comparison-label,
    .s1p-sync-comparison-value {
      padding: 10px 14px;
    }
    .s1p-sync-comparison-label {
      font-weight: 500;
      color: var(--s1p-t);
      white-space: nowrap;
      font-size: 13px;
    }
    .s1p-sync-comparison-value {
      /* [S1P-FIX] 使用 Flexbox 实现完美的垂直居中对齐 */
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px; /* 使用 gap 定义元素间距，比 margin 更现代 */
      font-family: monospace, sans-serif;
      font-size: 13px;
    }
    .s1p-newer-badge {
      /* [S1P-FIX V4] 统一字体以解决跨平台对齐根源问题 */
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
      color: var(--s1p-success-text);
      font-weight: bold;
      font-size: 12px;
      position: relative;
      /* [S1P-FIX V4] 统一为在 Windows 上视觉对齐的偏移值 */
      top: -1px;
    }
    /* --- [新增] 为手动同步弹窗设定更宽的尺寸 --- */
    .s1p-sync-modal .s1p-confirm-content {
      width: 580px;
    }

    .s1p-progress-update-badge {
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
      color: var(--s1p-sec);
      font-weight: bold;
      /* [S1P-FIX V4] 统一为在 Windows 上视觉对齐的偏移值 */
      position: relative;
      top: -1px;
      /* margin-left 已被父元素的 gap 替代 */
      /* vertical-align 在 Flexbox 布局中无效 */
    }

    /* --- 提示框样式 --- */
    .s1p-notice {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background-color: var(--s1p-sub);
      border: 1px solid var(--s1p-pri);
      border-radius: 6px;
      padding: 12px;
      margin-top: 12px;
    }
    .s1p-notice-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      background-color: var(--s1p-t);
      mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3e%3cpath d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z'%3e%3c/path%3e%3c/svg%3e");
      mask-size: contain;
      mask-position: center;
      mask-repeat: no-repeat;
      margin-top: 1px;
    }
    .s1p-notice-content {
      font-size: 13px;
      line-height: 1.6;
      color: var(--s1p-desc-t);
    }
    .s1p-notice-content a {
      color: var(--s1p-t);
      font-weight: 500;
      text-decoration: none;
    }
    .s1p-notice-content a:hover {
      text-decoration: underline;
    }
    .s1p-notice-content p {
      margin: 4px 0 0 0;
      padding: 0;
    }

    /* --- 滑块式分段控件样式 --- */
    .s1p-segmented-control {
      position: relative;
      display: inline-flex;
      background-color: var(--s1p-sub);
      border-radius: 6px;
      padding: 2px;
      user-select: none;
    }
    .s1p-segmented-control-slider {
      position: absolute;
      top: 2px;
      left: 0;
      height: calc(100% - 4px);
      background-color: var(--s1p-sec);
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(var(--s1p-shadow-color-rgb), 0.1);
      transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .s1p-segmented-control:hover .s1p-segmented-control-slider {
      box-shadow: 0 2px 6px rgba(var(--s1p-shadow-color-rgb), 0.15);
    }
    .s1p-segmented-control-option {
      position: relative;
      z-index: 1;
      padding: 4px 12px;
      color: var(--s1p-desc-t);
      cursor: pointer;
      transition: color 0.25s ease-in-out, background-color 0.2s ease-in-out;
      font-size: 13px;
      line-height: 1.5;
      white-space: nowrap;
      border-radius: 4px;
    }
    .s1p-segmented-control-option.active {
      color: var(--s1p-white);
      font-weight: 500;
      cursor: default;
    }
    .s1p-segmented-control-option:not(.active):hover {
      background-color: var(--s1p-pri);
      color: var(--s1p-t);
    }

    /* --- [S1PLUS-MOD] 帖子列表最终布局修正 --- */
    /* [MODIFIED] 此处已移除隐藏 .icn 和 .icn_new 的样式规则 */
    #atarget,
    a.closeprev.y[title="隐藏置顶帖"] {
      display: none !important;
    }

    /* 2. 为脚本注入的“操作列”及“表头占位符”提供统一、明确的样式 */
    #threadlisttableid .th .s1p-header-placeholder {
      width: 32px !important;
      padding: 0 8px !important;
      box-sizing: border-box !important;
    }
    .s1p-options-cell {
      position: relative;
      text-align: center;
      vertical-align: middle;
      width: 20px !important;
      padding: 0px !important;
      box-sizing: border-box !important;
    }

    /* --- 核心修复与通用布局 --- */
    #p_pop {
      display: none !important;
    }

    /* 1. [核心修正] 精确隐藏作为“空白分隔符”的 separatorline，
        通过 .emptb 类来识别，避免隐藏“版块主题”行。*/
    #separatorline.emptb {
      display: none !important;
    }

    /* 3. 统一所有列的对齐方式为左对齐，以匹配原始样式 */
    #threadlisttableid td.by,
    #threadlisttableid td.num,
    #threadlisttableid .th .by,
    #threadlisttableid .th .num {
      text-align: left !important;
    }

    /* --- 关键字屏蔽样式 --- */
    .s1p-hidden-by-keyword,
    .s1p-hidden-by-quote {
      display: none !important;
    }

    /* --- 按钮通用样式 (V4 - 精致阴影与安全区适配) --- */
    .s1p-btn,
    .s1p-confirm-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 14px;
      border-radius: 6px;
      background-color: var(--s1p-sub);
      color: var(--s1p-t);
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      border: none;
      /* [MODIFIED] 采用更收敛、精致的默认阴影，并微调Y轴位移 */
      box-shadow: 0 1px 2px rgba(var(--s1p-shadow-color-rgb), 0.12);
      transform: translateY(-1px);
      /* [MODIFIED] 优化过渡动画曲线，使其更平滑 */
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .s1p-btn:hover,
    .s1p-confirm-btn:hover {
      background-color: var(--s1p-sub-h);
      color: var(--s1p-sub-h-t);
      /* [MODIFIED] 同样采用更收敛的悬停阴影，并微调Y轴位移 */
      transform: translateY(-3px);
      box-shadow: 0 3px 6px rgba(var(--s1p-shadow-color-rgb), 0.18);
    }

    /* --- [MODIFIED] 危险/红色按钮样式 - 仅在高亮时变色 --- */

    /* * 注意：原有的 .s1p-red-btn 默认红色样式已被移除。
    * 现在，所有带 .s1p-red-btn 或 .s1p-danger 类的按钮，
    * 在默认状态下都将显示上方 .s1p-btn 定义的通用灰色样式。
    */

    /* [MODIFIED] 将所有危险/红色按钮的变色逻辑统一到 hover 状态 */
    .s1p-btn.s1p-red-btn:hover,
    .s1p-btn.s1p-danger:hover,
    .s1p-confirm-btn.s1p-confirm:hover {
      background-color: var(--s1p-red-h); /* 使用更深的红色作为悬停色 */
      border-color: transparent; /* 确保没有边框颜色 */
      color: var(--s1p-white);
    }

    /* --- 帖子操作按钮 (三点图标) --- */
    .s1p-options-btn {
      position: relative; /* 为 ::after 伪元素提供定位上下文 */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      color: var(--s1p-icon-color);
      opacity: 0.4;
      transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
    }
    /* [S1PLUS-REPLACE-BLOCK] */
    /* [MODIFIED] 创建一个透明的“交互桥梁”，覆盖按钮和菜单之间的物理间隙 */
    .s1p-options-btn::after {
      content: '';
      position: absolute;
      top: 0;
      right: 100%; /* [S1P-MODIFIED] 从 left 改为 right，适配右侧按钮 */
      width: 2px; /* [核心修改] 大幅缩减桥梁宽度，防止其影响旁边的元素 */
      height: 100%;
    }
    .s1p-options-btn:hover {
      background-color: var(--s1p-pri);
      color: var(--s1p-t);
      opacity: 1;
    }
    .s1p-options-menu {
      position: absolute;
      top: 50%;
      right: 100%; /* [S1P-MODIFIED] 从 left 改为 right，让菜单在按钮左侧弹出 */
      /* [S1P-FIX] 移除 margin-left，将间距改为 padding-right，从而消除按钮和菜单间的交互断层 */
      margin-left: 0;
      transform: translateY(-50%);
      z-index: 10;
      background-color: var(--s1p-bg);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(var(--s1p-shadow-color-rgb), 0.1);
      /* [S1P-MODIFIED] 将内边距调整到右侧，以在视觉上保持间距 */
      padding: 5px 11px 5px 5px;
      min-width: 110px;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.15s ease-out, visibility 0.15s;
    }
    /* [修改] 将菜单的触发条件改为悬停图标按钮，并让菜单自身在悬停时保持显示 */
    .s1p-options-btn:hover + .s1p-options-menu,
    .s1p-options-menu:hover {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    /* --- [MODIFIED] 直接确认UI (整体缩小) --- */
    .s1p-direct-confirm {
      display: flex;
      align-items: center;
      gap: 8px; /* 减小间距 */
      font-size: 13px; /* 减小字体 */
      color: var(--s1p-t);
      padding: 4px 6px; /* 减小内边距 */
      white-space: nowrap;
    }
    .s1p-confirm-separator {
      border-left: 1px solid var(--s1p-pri);
      height: 16px; /* 减小高度 */
      margin: 0 2px 0 6px;
    }
    .s1p-confirm-action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px; /* 减小尺寸 */
      height: 28px; /* 减小尺寸 */
      border: none;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease,
        background-image 0.2s ease;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 55%; /* 减小图标大小 */
      flex-shrink: 0;
    }
    .s1p-confirm-action-btn:active {
      transform: scale(0.95);
    }
    .s1p-confirm-action-btn.s1p-confirm {
      background-color: transparent;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2.5' stroke='%2322c55e'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M4.5 12.75l6 6 9-13.5' /%3e%3c/svg%3e");
    }
    .s1p-confirm-action-btn.s1p-confirm:hover {
      background-color: var(--s1p-confirm-hover-bg);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2.5' stroke='%23ffffff'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M4.5 12.75l6 6 9-13.5' /%3e%3c/svg%3e");
    }
    .s1p-confirm-action-btn.s1p-cancel {
      background-color: transparent;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2.5' stroke='%23ef4444'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' /%3e%3c/svg%3e");
    }
    .s1p-confirm-action-btn.s1p-cancel:hover {
      background-color: var(--s1p-cancel-hover-bg);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2.5' stroke='%23ffffff'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' /%3e%3c/svg%3e");
    }

    /* --- 行内确认菜单样式 (带动画) --- */
    .s1p-options-menu.s1p-inline-confirm-menu {
      transform: translateY(0) !important;
      z-index: 10004;
      opacity: 0;
      transform: translateX(-8px) scale(0.95) !important;
      transition: opacity 0.15s ease-out, transform 0.15s ease-out;
      pointer-events: none;
      visibility: visible !important;
      /* [MODIFIED] 将 padding 从 4px 减为 2px */
      padding: 2px;
    }
    .s1p-inline-confirm-menu.visible {
      opacity: 1;
      transform: translateX(0) scale(1) !important;
      pointer-events: auto;
    }

    /* --- [NEW] Inline Action Menu --- */
    .s1p-inline-action-menu {
      position: absolute;
      z-index: 10004;
      display: flex;
      align-items: center;
      gap: 4px;
      background-color: var(--s1p-bg);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(var(--s1p-shadow-color-rgb), 0.1);
      padding: 5px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(5px) scale(0.95);
      transition: opacity 0.15s ease-out, transform 0.15s ease-out,
        visibility 0.15s;
      pointer-events: none;
    }
    .s1p-inline-action-menu.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .s1p-inline-action-menu .s1p-action-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      color: var(--s1p-t);
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .s1p-inline-action-menu .s1p-action-btn:hover {
      background-color: var(--s1p-sub);
    }

    /* --- [MODIFIED] Icon Styling within Action Buttons --- */
    .s1p-inline-action-menu .s1p-action-btn svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0; /* 防止图标被压缩 */
    }

    /* --- 阅读进度UI样式 --- */
    .s1p-progress-container {
      display: inline-flex;
      align-items: center;
      margin: 0 8px;
      vertical-align: middle;
      line-height: 1;
    }
    .s1p-progress-jump-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: bold;
      text-decoration: none;
      border: 1px solid;
      border-radius: 4px;
      padding: 1px 6px 1px 4px;
      transition: all 0.2s ease-in-out;
      line-height: 1.4;
    }
    .s1p-progress-jump-btn::before {
      content: "";
      display: inline-block;
      width: 1.1em;
      height: 1.1em;
      background-color: currentColor;
      mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z' fill='black'/%3e%3c/svg%3e");
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
    }
    .s1p-new-replies-badge {
      display: inline-block;
      color: var(--s1p-white);
      font-size: 12px;
      font-weight: bold;
      padding: 1px 5px;
      border: 1px solid;
      border-left: none;
      border-radius: 0 4px 4px 0;
      line-height: 1.4;
      user-select: none;
    }

    /* --- 通用输入框样式 --- */
    .s1p-input {
      width: 100%;
      background: var(--s1p-bg);
      border: 1px solid var(--s1p-pri);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.2s ease-in-out,
        background-color 0.2s ease-in-out;
      color: var(--s1p-t);
    }
    .s1p-input:focus {
      outline: none;
      border-color: var(--s1p-sec);
      background-color: var(--s1p-white);
    }
    .s1p-textarea {
      resize: vertical;
      min-height: 80px;
    }

    /* --- [新增] 优化 Windows 下密码输入框样式 --- */
    #s1p-remote-pat-input {
      /* 修正部分 Windows 系统下字体渲染问题 */
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, sans-serif;
      /* 增加字符间距，让星号 (*) 显示更清晰 */
      letter-spacing: 1.5px;
    }
    #s1p-remote-pat-input::-ms-reveal {
      /* 隐藏 Windows Edge/IE 浏览器自带的显示密码图标 */
      display: none;
    }

    /* --- 用户标记悬浮窗 --- */
    .s1p-tag-popover {
      position: absolute;
      z-index: 10001;
      width: 300px;
      background-color: var(--s1p-bg);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(var(--s1p-shadow-color-rgb), 0.08);
      opacity: 0;
      visibility: hidden;
      transform: translateY(5px) scale(0.98);
      transition: opacity 0.2s ease-out, transform 0.2s ease-out,
        visibility 0.2s;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, sans-serif;
    }
    .s1p-tag-popover.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .s1p-popover-content {
      padding: 16px;
    }
    .s1p-popover-main-content {
      font-size: 14px;
      line-height: 1.6;
      color: var(--s1p-t);
      padding: 4px 4px 20px 4px;
      min-height: 30px;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
    .s1p-popover-main-content.s1p-empty {
      text-align: center;
      color: var(--s1p-text-empty);
    }
    .s1p-popover-hr {
      border: none;
      border-top: 1px solid var(--s1p-pri);
      margin: 0;
    }
    .s1p-popover-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 16px;
    }
    .s1p-popover-user-container {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .s1p-popover-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      background-color: var(--s1p-pri);
    }
    .s1p-popover-user-info {
      flex-grow: 1;
      min-width: 0;
    }
    .s1p-popover-username {
      font-weight: 500;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .s1p-popover-user-id {
      font-size: 12px;
      color: var(--s1p-desc-t);
      white-space: nowrap;
    }
    .s1p-popover-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    .s1p-edit-mode-header {
      font-weight: 600;
      font-size: 15px;
      margin-bottom: 12px;
    }
    .s1p-edit-mode-textarea {
      height: 90px;
      margin-bottom: 12px;
    }
    .s1p-edit-mode-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    /* --- [NEW] 通用显示悬浮窗 --- */
    .s1p-generic-display-popover {
      position: absolute;
      z-index: 10003;
      max-width: 350px;
      background-color: var(--s1p-bg);
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(var(--s1p-shadow-color-rgb), 0.12);
      padding: 10px 14px;
      font-size: 13px;
      line-height: 1.6;
      color: var(--s1p-t);
      opacity: 0;
      visibility: hidden;
      transform: translateY(5px);
      transition: opacity 0.15s ease-out, transform 0.15s ease-out;
      pointer-events: none;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .s1p-generic-display-popover.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    /* --- [ULTIMATE FIX V2.1] Flexbox Layout Fix (Ultimate Version) --- */
    .pi {
      display: flex !important;
      align-items: center;
      gap: 8px;
      position: relative !important; /* <-- [新增] 为绝对定位的子元素提供定位上下文 */
    }
    .pi > .pti {
      min-width: 0;
      position: static !important;
      z-index: auto !important;
      order: 1;
      overflow: hidden;
    }
    /* [新增] 布局伸缩器，永久固定右侧元素 */
    .s1p-layout-spacer {
      margin-left: auto;
      order: 2;
    }
    .pi > strong {
      flex-shrink: 0;
      order: 4;
      visibility: hidden; /* <-- 核心修改：初始不可见 */
      transition: visibility 0s; /* 确保状态改变是瞬时的 */
    }
    .pi > strong.s1p-layout-ready {
      visibility: visible; /* <-- 脚本添加此类后立即显示 */
    }
    .pi > #fj {
      margin-left: 0;
      order: 5;
      flex-shrink: 0;
      position: static !important;
      z-index: auto !important;
    }
    .authi {
      display: flex !important;
      align-items: center;
      flex-wrap: nowrap;
      overflow: hidden;
      white-space: nowrap !important;
    }

    /* 1. 最外层容器: flex布局，这是基础 */
    .s1p-authi-container {
      display: flex;
      align-items: center;
      min-width: 0;
    }

    /* 2. 原生按钮容器: 绝对不允许被压缩 */
    .s1p-authi-container > .authi {
      flex-shrink: 0;
      white-space: nowrap;
    }

    /* 3. 脚本按钮总容器: 作为被压缩的主要对象，内部强制不换行 */
    .s1p-authi-container > .s1p-authi-actions-wrapper {
      display: flex;
      align-items: center;
      flex-shrink: 1;
      min-width: 0;
      flex-wrap: nowrap;
    }

    /* 4. [已修正冲突] 脚本容器 *内部* 元素的精确规则: */

    /* a) 用户标记容器(.s1p-user-tag-container): 这是唯一允许被压缩的元素 */
    .s1p-authi-actions-wrapper > .s1p-user-tag-container {
      flex-shrink: 1;
      min-width: 30px;
    }

    /* b) 其他所有按钮(<a>)和分隔符(<span>): 绝对不允许被压缩 */
    .s1p-authi-actions-wrapper > a.s1p-authi-action,
    .s1p-authi-actions-wrapper > span.pipe {
      flex-shrink: 0;
    }

    .s1p-authi-actions-wrapper {
      display: inline-flex;
      align-items: center;
      min-width: 0;
      vertical-align: middle;
    }
    .s1p-user-tag-container {
      display: inline-flex;
      align-items: center;
      flex-shrink: 1;
      min-width: 30px;
      vertical-align: middle;
      overflow: hidden;
      border-radius: 6px;
    }
    .s1p-user-tag-display {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      background-color: var(--s1p-sub);
      color: var(--s1p-t);
      padding: 2px 8px;
      font-size: 12px;
      cursor: default;
    }
    .s1p-user-tag-options {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--s1p-sub);
      color: var(--s1p-t);
      padding: 0 8px;
      flex-shrink: 0;
      align-self: stretch;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
    }
    .s1p-user-tag-options:hover {
      background-color: var(--s1p-pri);
    }

    /* --- [MODIFIED] Tag Options Menu (高度比例调整) --- */
    .s1p-tag-options-menu {
      position: absolute;
      z-index: 10002;
      background-color: var(--s1p-bg);
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(var(--s1p-shadow-color-rgb), 0.15);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: max-content;
    }
    .s1p-tag-options-menu button {
      background: none;
      border: none;
      /* [MODIFIED] 增加垂直内边距，以达到目标高度 */
      padding: 8px 10px;
      text-align: left;
      cursor: pointer;
      border-radius: 4px;
      font-size: 13px;
      color: var(--s1p-t);
      white-space: nowrap;
      line-height: 1.5;
    }
    .s1p-tag-options-menu button:hover {
      background-color: var(--s1p-sub-h);
      color: var(--s1p-sub-h-t);
    }
    .s1p-tag-options-menu button.s1p-delete:hover {
      background-color: var(--s1p-red);
      color: var(--s1p-white);
    }

    /* --- 设置面板样式 --- */
    .s1p-modal {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(var(--s1p-black-rgb), 0.5);
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .s1p-modal-content {
      background-color: var(--s1p-bg);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(var(--s1p-shadow-color-rgb), 0.1);
      width: 600px;
      max-width: 90%;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;

      /* [优化] 为设置面板设定统一的字体族和渲染方式 */
      font-family: -apple-system, "BlinkMacSystemFont", "Segoe UI", "Roboto",
        "Helvetica Neue", "Arial", "PingFang SC", "Hiragino Sans GB",
        "Microsoft YaHei", sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .s1p-modal-header {
      background: var(--s1p-pri);
      padding: 16px;
      border-bottom: 1px solid var(--s1p-pri);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .s1p-modal-title {
      /* [优化 V2] 微调主标题尺寸 */
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .s1p-modal-close {
      width: 12px;
      height: 12px;
      cursor: pointer;
      color: var(--s1p-icon-close);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M2 2L14 14M14 2L2 14' stroke='currentColor' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;
      transform: rotate(0deg);
    }
    .s1p-modal-close:hover {
      color: var(--s1p-red);
      transform: rotate(90deg);
    }
    .s1p-modal-body {
      padding: 8px 16px 16px;
      overflow-y: auto;
      flex-grow: 1;
      /* --- [调试新增] --- */
      transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      /* 暂时移除 flex-grow 以便手动控制高度 */
      flex-grow: 0;
    }
    .s1p-modal-footer {
      /* [MODIFIED] 增加上下内边距，为按钮阴影提供空间 */
      padding: 16px;
      border-top: 1px solid var(--s1p-pri);
      text-align: right;
      font-size: 12px;
    }

    /* --- [OPTIMIZED] 设置面板Tabs样式 (Pill / 滑块样式) --- */
    .s1p-tabs {
      position: relative;
      display: inline-flex; /* 使容器宽度自适应内容 */
      background-color: var(--s1p-sub);
      border-radius: 6px;
      padding: 4px;
      margin-bottom: 16px;
    }
    .s1p-tab-slider {
      position: absolute;
      top: 4px;
      left: 0;
      height: calc(100% - 8px);
      background-color: var(--s1p-white);
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(var(--s1p-shadow-color-rgb), 0.1);
    }
    .s1p-tab-content.active {
      display: block;
    }
    .s1p-tab-btn {
      position: relative;
      z-index: 1;
      padding: 6px 16px;
      cursor: pointer;
      border: none;
      background-color: transparent;
      font-size: 14px;
      font-weight: 500;
      color: var(--s1p-desc-t);
      white-space: nowrap;
      border-radius: 4px;
      /* [修改] 增加 background-color 的过渡动画 */
      transition: color 0.25s ease, background-color 0.2s ease;
    }
    .s1p-tab-btn:hover:not(.active) {
      color: var(--s1p-t);
      /* [新增] 添加背景色高亮效果 */
      background-color: var(--s1p-pri);
    }
    .s1p-tab-btn.active {
      color: var(--s1p-t);
      cursor: default;
    }
    .s1p-tab-content {
      display: none;
      padding-top: 0;
    }

    .s1p-tabs-wrapper {
      display: flex;
      justify-content: center;
    }
    .s1p-empty {
      text-align: center;
      padding: 24px;
      color: var(--s1p-desc-t);
    }
    .s1p-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .s1p-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px;
      border-radius: 6px;
      background-color: var(--s1p-bg);
      border: 1px solid var(--s1p-pri);
    }
    .s1p-item-info {
      flex-grow: 1;
      min-width: 0;
    }
    .s1p-item-title {
      /* [优化] 统一列表项标题样式 */
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .s1p-item-meta {
      /* [优化] 统一列表项元信息样式 */
      font-size: 12px;
      color: var(--s1p-desc-t);
    }
    .s1p-item-toggle {
      font-size: 12px;
      color: var(--s1p-desc-t);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .s1p-item-toggle input {
      /* Handled by .s1p-switch */
    }
    .s1p-unblock-btn:hover {
      background-color: var(--s1p-red-h);
    }
    .s1p-sync-title {
      /* [优化] 调整同步标题的样式，与分组标题统一 */
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .s1p-local-sync-desc {
      /* [优化] 调整描述文字样式，提升可读性 */
      font-size: 13px;
      color: var(--s1p-desc-t);
      margin-bottom: 16px;
      line-height: 1.7;
    }
    .s1p-local-sync-buttons {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    .s1p-sync-textarea {
      width: 100%;
      min-height: 80px;
      margin-bottom: 8px;
    }
    /* --- [新增] 论坛黑名单同步状态提示 --- */
    .s1p-native-sync-status {
      display: inline-block;
      background-color: var(--s1p-list-item-status-bg);
      color: var(--s1p-t);
      padding: 2px 8px;
      border-radius: 7px;
      font-style: normal;
      font-weight: 500;
      font-size: 11px;
      margin-left: 8px;
      vertical-align: middle;
      position: relative;
      top: -1px;
    }
    /* --- [OPTIMIZED] Sync Settings Panel Disabled State --- */
    #s1p-remote-sync-controls-wrapper {
      transition: opacity 0.3s ease-out;
    }
    #s1p-remote-sync-controls-wrapper.is-disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    /* --- 悬浮提示框 (Toast Notification) --- */
    @keyframes s1p-toast-shake {
      10%,
      90% {
        transform: translate(-51%, 0);
      }
      20%,
      80% {
        transform: translate(-49%, 0);
      }
      30%,
      50%,
      70% {
        transform: translate(-52%, 0);
      }
      40%,
      60% {
        transform: translate(-48%, 0);
      }
    }
    .s1p-toast-notification {
      position: fixed;
      left: 50%;
      bottom: 20px;
      transform: translate(-50%, 50px);
      z-index: 10005;
      padding: 10px 18px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: var(--s1p-t); /* <-- 修改了此行 */
      background-color: var(--s1p-bg); /* <-- 修改了此行 */
      box-shadow: 0 4px 12px rgba(var(--s1p-shadow-color-rgb), 0.15);
      opacity: 0;
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
      pointer-events: none;
      white-space: nowrap;
      text-align: center;
    }
    .s1p-modal-content .s1p-toast-notification {
      position: absolute;
      bottom: 15px;
    }
    .s1p-toast-notification.visible {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    .s1p-toast-notification.success {
      background-color: #27da80;
      color: var(--s1p-white); /* 确保成功状态字体为白色 */
      border-color: #27da80; /* 覆盖边框颜色 */
    }
    .s1p-toast-notification.error {
      background-color: var(--s1p-red);
      color: var(--s1p-white); /* 确保失败状态字体为白色 */
      border-color: var(--s1p-red); /* 覆盖边框颜色 */
    }
    .s1p-toast-notification.error.visible {
      animation: s1p-toast-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }

    /* --- 确认弹窗样式 --- */
    @keyframes s1p-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes s1p-scale-in {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    @keyframes s1p-fade-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
    @keyframes s1p-scale-out {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(0.97);
        opacity: 0;
      }
    }
    .s1p-confirm-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(var(--s1p-black-rgb), 0.65);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      animation: s1p-fade-in 0.2s ease-out;
    }
    .s1p-confirm-content {
      background-color: var(--s1p-bg);
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(var(--s1p-shadow-color-rgb), 0.1),
        0 10px 10px -5px rgba(var(--s1p-shadow-color-rgb), 0.04);
      width: 480px;
      max-width: 90%;
      text-align: left;
      overflow: hidden;
      animation: s1p-scale-in 0.25s ease-out;
    }
    .s1p-confirm-body {
      padding: 20px 24px;
      font-size: 16px;
      line-height: 1.6;
    }
    .s1p-confirm-body .s1p-confirm-title {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 8px;
    }
    .s1p-confirm-body .s1p-confirm-subtitle {
      font-size: 14px;
      color: var(--s1p-desc-t);
    }
    .s1p-confirm-footer {
      padding: 12px 24px 20px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .s1p-confirm-footer.s1p-centered {
      justify-content: center;
    }

    /* --- [MODIFIED] Collapsible Section (V7 - Mask Image Fix) --- */
    .s1p-collapsible-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
    }
    .s1p-settings-group-title.s1p-collapsible-header {
      margin-bottom: 0;
      transition: color 0.2s ease;
    }
    .s1p-settings-group-title.s1p-collapsible-header:hover {
      color: var(--s1p-sec);
    }
    .s1p-expander-arrow {
      display: inline-block;
      width: 12px;
      height: 12px;
      /* [NEW METHOD] 使用 mask 定义图标形状 */
      -webkit-mask-image: url("${SVG_ICON_ARROW_MASK}");
      mask-image: url("${SVG_ICON_ARROW_MASK}");
      -webkit-mask-size: contain;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
      /* [NEW METHOD] 使用 background-color 来上色 */
      background-color: var(--s1p-icon-arrow); /* 默认颜色 */
      /* [NEW METHOD] 为 background-color 和 transform 添加过渡效果 */
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        background-color 0.2s ease;
    }
    .s1p-settings-group-title.s1p-collapsible-header:hover .s1p-expander-arrow {
      background-color: var(--s1p-sec); /* 悬停颜色 */
    }
    .s1p-expander-arrow.expanded {
      transform: rotate(90deg);
    }
    .s1p-collapsible-content {
      display: grid;
      grid-template-rows: 0fr;
      padding-top: 0;
      transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        padding-top 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .s1p-collapsible-content > div {
      overflow: hidden;
    }
    .s1p-collapsible-content.expanded {
      grid-template-rows: 1fr;
      padding-top: 12px;
    }

    /* --- Feature Content Animation --- */
    .s1p-feature-content {
      display: grid;
      grid-template-rows: 0fr;
      /* [调试] 暂时禁用这里的动画，以便测试我们自己的 height 动画 */
      transition: none;
      margin-top: 0;
    }
    .s1p-feature-content.expanded {
      grid-template-rows: 1fr;
      margin-top: 0px;
    }
    .s1p-feature-content > div {
      overflow: hidden;
      /* [调试] 暂时禁用这里的动画 */
      transition: none;
    }
    .s1p-feature-content:not(.expanded) > div {
      opacity: 0;
      transition-duration: 0s;
    }
    .s1p-feature-content.expanded > div {
      opacity: 1;
      transition-delay: 0s;
    }

    /* --- 界面定制设置样式 --- */
    .s1p-settings-group {
      // margin-bottom: 0;
      padding: 8px;
    }
    .s1p-settings-group-title {
      /* [优化 V2] 调整次级分组标题，拉开层级 */
      font-size: 15px;
      font-weight: 500;
      border-bottom: 1px solid var(--s1p-pri);
      padding-bottom: 12px;
      margin-bottom: 16px;
    }

    /* --- [修改] 统一的设置子选项分组缩进样式 --- */
    .s1p-settings-sub-group {
      padding-left: 20px;
      border-left: none;
      margin-left: 8px;
      margin-top: 8px;
      transition: all 0.3s ease;
    }

    .s1p-settings-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
    }
    .s1p-settings-item .s1p-input {
      width: auto;
      min-width: 200px;
    }
    .s1p-settings-label {
      /* [优化] 设定设置项标签的基础样式 */
      font-size: 14px;
      font-weight: 500;
    }
    .s1p-settings-section-title-label {
      /* [优化 V2] 调整主要分组标题，响应用户反馈 */
      font-size: 16px;
      font-weight: 600;
    }
    .s1p-settings-checkbox {
      /* Handled by .s1p-switch */
    }
    .s1p-setting-desc {
      /* [优化] 统一描述文字的样式，提升可读性 */
      font-size: 13px;
      color: var(--s1p-desc-t);
      margin: -4px 0 12px 0;
      padding: 0;
      line-height: 1.7;
    }
    /* --- [新增] 警告文本样式 --- */
    .s1p-warning-text {
      font-weight: bold;
      color: var(--s1p-red);
    }
    .s1p-editor-item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 8px;
      align-items: center;
      padding: 6px;
      border-radius: 4px;
      background: var(--s1p-bg);
    }
    .s1p-editor-item select {
      background: var(--s1p-bg);
      width: 100%;
      border: 1px solid var(--s1p-pri);
      border-radius: 4px;
      padding: 6px 8px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .s1p-editor-item-controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .s1p-editor-btn {
      padding: 4px;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      border-radius: 4px;
      border: none;
      background: transparent;
      color: #9ca3af;
    }
    /* --- [修正] 使用 :not() 伪类来排除删除按钮，防止其悬浮样式被覆盖 --- */
    .s1p-editor-btn:not(.s1p-delete-button):hover {
      background: var(--s1p-secondary-bg);
      color: var(--s1p-secondary-text);
    }
    /* --- [新增] 为删除按钮定义统一的尺寸和边距 (骨架) --- */
    .s1p-editor-btn.s1p-delete-button {
      width: 26px;
      height: 26px;
      padding: 4px;
      box-sizing: border-box;
      font-size: 0;
    }
    /* --- [修改] 固化S1 Plus经典删除按钮样式 --- */
    .s1p-editor-btn.s1p-delete-button {
      font-size: 0 !important;
      width: 26px !important;
      height: 26px !important;
      padding: 4px !important;
      box-sizing: border-box !important;
      background-image: url("${SVG_ICON_DELETE_DEFAULT}") !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      background-size: 18px 18px !important;
      background-color: transparent !important;
      mask: none !important;
      transition: all 0.2s ease;
    }
    .s1p-editor-btn.s1p-delete-button:hover {
      background-color: var(--s1p-red) !important;
      background-image: url("${SVG_ICON_DELETE_HOVER}") !important;
    }
    .s1p-drag-handle {
      font-size: 18pt;
      cursor: grab;
    }
    .s1p-editor-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
    }

    /* --- 带图标的搜索框 --- */
    .s1p-search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .s1p-search-input-wrapper .s1p-input {
      padding-left: 34px;
      padding-right: 34px;
    }
    .s1p-search-input-wrapper svg.s1p-search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--s1p-icon-color);
      pointer-events: none;
      transition: color 0.2s ease-in-out;
    }
    .s1p-search-input-wrapper .s1p-input:focus + svg.s1p-search-icon {
      color: var(--s1p-sec);
    }

    /* --- 搜索框清空按钮 --- */
    .s1p-search-clear-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      opacity: 1;
      transition: background-color 0.2s ease, opacity 0.2s ease,
        transform 0.2s ease;
      padding: 0;
    }
    .s1p-search-clear-btn.hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-50%) scale(0.8);
    }
    .s1p-search-clear-btn:hover {
      background-color: var(--s1p-pri);
    }
    .s1p-search-clear-btn svg {
      width: 12px;
      height: 12px;
      color: var(--s1p-icon-arrow);
    }

    /* --- 搜索关键词高亮 --- */
    mark.s1p-highlight {
      background-color: var(--s1p-pri);
      color: var(--s1p-t);
      font-weight: bold;
      padding: 1px 3px;
      border-radius: 3px;
      text-decoration: none;
    }

    /* --- Modern Toggle Switch --- */
    .s1p-switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 22px;
      vertical-align: middle;
      flex-shrink: 0;
    }
    .s1p-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .s1p-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--s1p-pri);
      transition: 0.3s;
      border-radius: 22px;
    }
    .s1p-slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background-color: var(--s1p-white);
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(var(--s1p-shadow-color-rgb), 0.1);
    }
    input:checked + .s1p-slider {
      background-color: var(--s1p-sec);
    }
    input:checked + .s1p-slider:before {
      transform: translateX(18px);
    }

    /* --- Nav Editor Dragging --- */
    .s1p-editor-item.s1p-dragging {
      opacity: 0.5;
    }

    /* --- 用户标记设置面板专属样式 --- */
    .s1p-item-meta-id {
      font-family: monospace;
      background-color: var(--s1p-bg);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 11px;
      color: var(--s1p-t);
    }
    .s1p-item-content {
      /* [优化] 调整列表项正文内容的样式 */
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--s1p-pri);
      color: var(--s1p-t);
      font-size: 14px;
      font-weight: 400; /* 使用常规字重 */
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
    }
    /* --- [微调] 统一调整用户标记和回复收藏列表的内容区样式 --- */
    #s1p-tags-list-container .s1p-item-content,
    #s1p-bookmarks-list-container .s1p-item-content {
      font-size: 14px;
    }
    #s1p-tab-bookmarks .s1p-item-content {
      background-color: transparent;
      border: none;
      border-bottom: 1px solid var(--s1p-pri);
      border-radius: 0;
      padding: 0 0 10px 0;
      margin-top: 0;
      margin-bottom: 10px;
    }
    .s1p-item-editor textarea {
      width: 100%;
      min-height: 60px;
      margin-top: 8px;
    }
    .s1p-item-actions {
      display: flex;
      align-self: flex-start;
      flex-shrink: 0;
      gap: 8px;
      margin-left: 16px;
    }
    .s1p-item-actions .s1p-btn.s1p-primary {
      background-color: #3b82f6;
      color: var(--s1p-white);
    }
    .s1p-item-actions .s1p-btn.s1p-primary:hover {
      background-color: #2563eb;
    }

    /* [MODIFIED] 移除了 .s1p-item-actions .s1p-btn.s1p-danger 的默认红色背景规则 */

    /* [MODIFIED] 将危险按钮的红色样式只应用在 hover 状态 */
    .s1p-item-actions .s1p-btn.s1p-danger:hover {
      background-color: var(--s1p-red-h);
      border-color: transparent; /* 再次确保边框透明 */
      color: var(--s1p-white);
    }

    /* --- 引用屏蔽占位符 --- */
    .s1p-quote-placeholder {
      background-color: var(--s1p-bg);
      border: 1px solid var(--s1p-pri);
      padding: 8px 12px;
      border-radius: 6px;
      margin: 10px 0;
      font-size: 13px;
      color: var(--s1p-desc-t);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    div.s1p-quote-placeholder span.s1p-quote-toggle {
      color: var(--s1p-t);
      font-weight: 500;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    div.s1p-quote-placeholder span.s1p-quote-toggle:hover {
      background-color: var(--s1p-sub);
      color: var(--s1p-t);
    }
    .s1p-quote-wrapper {
      overflow: hidden;
      transition: max-height 0.35s ease-in-out;
    }

    /* --- [新增] 通知/提醒屏蔽样式 --- */
    .s1p-notification-placeholder {
      background-color: var(--s1p-bg);
      border: 1px solid var(--s1p-pri);
      padding: 8px 12px;
      border-radius: 6px;
      margin-top: 10px;
      font-size: 13px;
      color: var(--s1p-desc-t);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .s1p-notification-placeholder .s1p-notification-toggle {
      color: var(--s1p-t);
      font-weight: 500;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .s1p-notification-placeholder .s1p-notification-toggle:hover {
      background-color: var(--s1p-sub);
      color: var(--s1p-t);
    }
    .s1p-notification-wrapper {
      overflow: hidden;
      transition: max-height 0.35s ease-in-out;
      margin-bottom: 10px;
    }

    /* --- Image Hiding --- */
    .s1p-image-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      margin: 8px 0;
    }
    .s1p-image-placeholder {
      display: inline-flex;
      align-items: center;
      /* gap: 6px; */ /* [S1P-MOD] 移除gap，因为没有图标 */
      padding: 6px 14px; /* [S1P-MOD] 匹配 s1p-btn 内边距 */
      border-radius: 6px;
      background-color: var(--s1p-pri);
      color: var(--s1p-t);
      border: none; /* [S1P-MOD] 匹配 s1p-btn 边框 */
      cursor: pointer;
      font-size: 14px; /* [S1P-MOD] 匹配 s1p-btn 字体大小 */
      font-weight: bold; /* [S1P-MOD] 匹配 s1p-btn 字体粗细 */
      transition: all 0.2s ease;
      /* [S1P-MOD] 模拟 s1p-btn 的其他属性 */
      justify-content: center;
      user-select: none;
      white-space: nowrap;
    }
    .s1p-image-placeholder:hover {
      background-color: var(--s1p-sub-h);
      color: var(--s1p-sub-h-t);
      /* [S1P-MOD] 移除 border-color，因为 border: none */
    }
    .s1p-image-container.hidden > .zoom {
      display: none;
    }
    .s1p-image-toggle-all-container {
      margin-bottom: 10px;
    }
    .s1p-image-toggle-all-btn {
      display: inline-flex;
      align-items: center;
      /* gap: 6px; */ /* [S1P-MOD] 移除gap，因为没有图标 */
      padding: 6px 14px; /* [S1P-MOD] 匹配 s1p-btn 内边距 */
      border-radius: 6px;
      background-color: var(--s1p-pri);
      color: var(--s1p-t);
      border: none; /* [S1P-MOD] 匹配 s1p-btn 边框 */
      cursor: pointer;
      font-size: 14px; /* [S1P-MOD] 匹配 s1p-btn 字体大小 */
      font-weight: bold; /* [S1P-MOD] 匹配 s1p-btn 字体粗细 */
      transition: all 0.2s ease;
      /* [S1P-MOD] 模拟 s1p-btn 的其他属性 */
      justify-content: center;
      user-select: none;
      white-space: nowrap;
    }
    .s1p-image-toggle-all-btn:hover {
      background-color: var(--s1p-sub-h);
      color: var(--s1p-sub-h-t);
      /* [S1P-MOD] 移除 border-color，因为 border: none */
    }

    /* --- [新增 V9] 可禁用/启用的增强型悬浮控件 --- */
    /* --- 模式 B: 增强控件关闭 (默认状态) --- */
    /* 默认隐藏脚本创建的控件 */
    #s1p-floating-controls-wrapper {
      display: none;
    }

    /* --- 模式 A: 增强控件开启 (当 body 有 s1p-enhanced-controls-active 时) --- */
    /* 1. 让脚本控件显示出来 */
    body.s1p-enhanced-controls-active #s1p-floating-controls-wrapper {
      display: block;
    }
    /* 2. 同时，彻底隐藏原生控件 */
    body.s1p-enhanced-controls-active #scrolltop {
      display: none !important;
    }

    /* 3. 以下是脚本控件自身的样式 (与之前版本类似，但选择器更严谨) */
    #s1p-floating-controls-wrapper {
      position: fixed;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      z-index: 9998;
      pointer-events: none; /* <--- 把这一行加在这里 */
    }
    #s1p-controls-handle {
      position: absolute;
      top: 50%;
      right: -10px;
      transform: translateY(-50%);
      width: 20px;
      height: 40px;
      background-color: var(--s1p-bg);
      border-right: none;
      border-radius: 10px 0 0 10px;
      box-shadow: -2px 2px 8px rgba(var(--s1p-shadow-color-rgb), 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.3s ease 0.1s;
      pointer-events: auto; /* [新增] 唯独让手柄可以响应鼠标 */
    }
    #s1p-controls-handle::before {
      content: "";
      display: block;
      width: 4px;
      height: 16px;
      background-color: var(--s1p-icon-color);
      -webkit-mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 16' fill='currentColor'%3e%3ccircle cx='2' cy='2' r='1.5'/%3e%3ccircle cx='2' cy='8' r='1.5'/%3e%3ccircle cx='2' cy='14' r='1.5'/%3e%3c/svg%3e");
      mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 16' fill='currentColor'%3e%3ccircle cx='2' cy='2' r='1.5'/%3e%3ccircle cx='2' cy='8' r='1.5'/%3e%3ccircle cx='2' cy='14' r='1.5'/%3e%3c/svg%3e");
      -webkit-mask-size: contain;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
    }
    #s1p-floating-controls {
      transform: translateX(100%);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      /* [S1PLUS-MODIFIED] 将左侧内边距设为一个 >20px 的值，从而制造按钮和屏幕边缘的间距 */
      padding-left: 35px;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease,
        visibility 0.3s;
    }
    #s1p-floating-controls-wrapper:hover #s1p-controls-handle {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }
    #s1p-floating-controls-wrapper:hover #s1p-floating-controls {
      transform: translateX(0);
      opacity: 1;
      visibility: visible;
      pointer-events: auto; /* [修改] 之前是auto，现在明确写出以确保逻辑完整 */
    }
    #s1p-floating-controls a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--s1p-bg);
      box-shadow: 0 2px 8px rgba(var(--s1p-shadow-color-rgb), 0.15);
      transition: all 0.2s ease-in-out;
      padding: 0;
      box-sizing: border-box;
    }
    #s1p-floating-controls a:hover {
      background-color: var(--s1p-pri);
      transform: scale(1.1);
      fill-opacity: 1;
    }
    #s1p-floating-controls a svg {
      width: 18px;
      height: 18px;
      color: var(--s1p-t);
      fill-opacity: 0.5;
    }
    #s1p-floating-controls a svg:hover {
      fill-opacity: 1;
    }
    #s1p-floating-controls a.s1p-scroll-btn svg {
      width: 22px;
      height: 22px;
      fill-opacity: 0.5;
    }
    #s1p-floating-controls a.s1p-scroll-btn svg:hover {
      fill-opacity: 1;
    }
    /* --- [更新] 回复收藏内容切换 V3 --- */
    .s1p-bookmark-preview,
    .s1p-bookmark-full {
      /* 保留换行和空格，确保纯文本格式正确显示 */
      white-space: pre-wrap;
      word-break: break-word;
    }
    .s1p-bookmark-full {
      display: none;
    }
    .s1p-bookmark-toggle {
      /* 保持为行内元素，自然跟在文字后方 */
      display: inline;
      margin-left: 4px; /* 与文字稍微隔开 */
      font-weight: 500;
      color: var(--s1p-t);
      cursor: pointer;
      text-decoration: none;
      font-size: 13px;
    }
    .s1p-bookmark-toggle:hover {
      color: var(--s1p-sec);
      text-decoration: underline;
    }

    /* --- [修改] 收藏夹内帖子跳转链接样式 --- */
    .s1p-bookmark-meta-line {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
    }
    .s1p-bookmark-meta-line > span {
      flex-shrink: 0;
      white-space: nowrap;
    }
    .s1p-bookmark-thread-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      text-decoration: none;
      font-weight: 500;
      color: var(--s1p-desc-t);
      transition: color 0.2s ease;
      min-width: 0; /* 核心修复：允许此弹性项目收缩至小于其内容宽度 */
    }
    .s1p-bookmark-thread-link:hover {
      color: var(--s1p-sec);
      text-decoration: underline;
    }
    .s1p-bookmark-thread-link svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0; /* 防止图标被压缩 */
    }
    .s1p-bookmark-title-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* --- [修改] 阅读进度提示条 - 渐变动画 --- */
    @keyframes s1p-indicator-fade-in {
      from {
        opacity: 0;
        /* 保持垂直居中，并从一个轻微的放大状态恢复，使出现动画更柔和 */
        transform: translateY(-50%) scale(1.05);
      }
      to {
        opacity: 1;
        transform: translateY(-50%) scale(1);
      }
    }
    @keyframes s1p-indicator-fade-out {
      from {
        opacity: 1;
        transform: translateY(-50%) scale(1);
      }
      to {
        opacity: 0;
        /* 消失时轻微缩小，使其更自然 */
        transform: translateY(-50%) scale(0.95);
      }
    }
    .s1p-read-indicator.s1p-anim-appear {
      /* 使用新的 fade-in 动画，时长0.3秒 */
      animation: s1p-indicator-fade-in 0.3s ease-out forwards;
    }
    .s1p-read-indicator.s1p-anim-disappear {
      /* 使用新的 fade-out 动画，时长0.25秒 */
      animation: s1p-indicator-fade-out 0.25s ease-in forwards;
    }

    .s1p-read-indicator {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background-color: var(--s1p-readprogress-bg);
      color: var(--s1p-white);
      padding: 3px 8px 4px; /* <-- [修改] 使用非对称内边距修正视觉重心 */
      border-radius: 16px;
      font-size: 11px;
      font-weight: bold;
      user-select: none;
      white-space: nowrap;
      box-shadow: 0 0 4px rgba(var(--s1p-shadow-color-rgb), 0.1);
      line-height: 1;
    }
    .s1p-read-indicator-icon {
      width: 14px; /* <-- [核心修改] 减小图标宽度 */
      height: 14px; /* <-- [核心修改] 减小图标高度 */
      background-color: currentColor;
      mask-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3e%3cpath d='M2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM11 5H4V19H11V5ZM13 5V19H20V5H13ZM14 7H19V9H14V7ZM14 10H19V12H14V10Z'%3e%3c/path%3e%3c/svg%3e");
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      /* -- [新增] 针对Windows平台的垂直对齐微调 -- */
      position: relative;
      top: 1px;
    }
    /* --- [新增] S1 NUX 推荐弹窗按钮专属样式 --- */
    .s1p-nux-recommend-modal .s1p-confirm-btn.s1p-confirm:hover {
      background-color: var(--s1p-sub-h);
      color: var(--s1p-white);
      border-color: transparent;
    }
    .s1p-nux-recommend-modal .s1p-confirm-btn.s1p-cancel:hover {
      background-color: var(--s1p-red-h);
      color: var(--s1p-white);
      border-color: transparent;
    }

    /* --- [新增] 深色模式样式覆写 --- */
    @media (prefers-color-scheme: dark) {
      :root {
        /* 将阅读进度条背景改为更柔和的橄榄绿 */
        --s1p-readprogress-bg: #99a17a;
        --s1p-list-item-status-bg: #3e3d3d;
      }

      /* 删除按钮：默认状态下使用白色图标 */
      .s1p-editor-btn.s1p-delete-button {
        background-image: url("${SVG_ICON_DELETE_HOVER}") !important;
      }

      /* --- [新增] 深色模式阴影适配 --- */
      .s1p-segmented-control-slider {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
      .s1p-segmented-control:hover .s1p-segmented-control-slider {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      }
      .s1p-btn,
      .s1p-confirm-btn {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }
      .s1p-btn:hover,
      .s1p-confirm-btn:hover {
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.07);
      }
      .s1p-options-menu,
      .s1p-inline-action-menu {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
      }
      .s1p-tag-popover {
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
      }
      .s1p-generic-display-popover {
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.35);
      }
      .s1p-tag-options-menu {
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
      }
      .s1p-modal-content {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      }
      .s1p-tab-slider {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
      }
      .s1p-toast-notification {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      }
      .s1p-confirm-content {
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
      }
      .s1p-slider:before {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      .s1p-read-indicator {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      }
      #s1p-controls-handle {
        box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.25);
      }
      #s1p-floating-controls a {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .s1p-toast-notification {
        background-color: #303030;
        // color: var(--s1p-bg);
      }
      .s1p-toast-notification.success {
        /* 使用一个更柔和的绿色 */
        background-color: var(--s1p-green-h);
      }
      .s1p-toast-notification.error {
        /* 使用一个更深的红色 */
        background-color: var(--s1p-red-h);
      }

      /* --- [新增] 深色模式下更柔和的警告文本颜色 --- */
      .s1p-warning-text {
        color: #f87171; /* A softer, less jarring red for dark backgrounds */
      }
    }
  `);

  // --- S1 NUX 兼容性检测 ---
  let isS1NuxEnabled = false;
  const detectS1Nux = () => {
    const archiverLink = document.querySelector('a[href*="archiver"]');
    if (archiverLink) {
      const style = window.getComputedStyle(archiverLink, "::before");
      if (style && style.content.includes("NUXISENABLED")) {
        console.log("S1 Plus: S1 NUX is enabled");
        isS1NuxEnabled = true;
      } else {
        console.log("S1 Plus: S1 NUX is not enabled");
      }
    }
  };

  let dynamicallyHiddenThreads = {};

  // [MODIFIED] 为远程推送增加防抖机制，并防止与初始同步冲突
  let remotePushTimeout;
  const debouncedTriggerRemoteSyncPush = () => {
    // [OPTIMIZATION] 如果初始同步正在进行，则跳过由数据变更触发的推送
    if (isInitialSyncInProgress) {
      console.log("S1 Plus: 初始同步进行中，已跳过本次自动推送请求。");
      return;
    }

    const settings = getSettings();
    // [MODIFIED] 增加对自动同步子开关的判断
    if (
      !settings.syncRemoteEnabled ||
      !settings.syncAutoEnabled ||
      !settings.syncRemoteGistId ||
      !settings.syncRemotePat
    ) {
      return;
    }
    clearTimeout(remotePushTimeout);
    // 延迟5秒推送，如果在5秒内有新的数据变动，则重新计时
    remotePushTimeout = setTimeout(() => {
      triggerRemoteSyncPush();
    }, 5000);
  };

  // 只有在数据实际变动时才更新时间戳并触发同步
  const updateLastModifiedTimestamp = () => {
    // 如果初始同步正在进行，则阻止更新时间戳，以防因数据迁移导致错误的覆盖。
    if (isInitialSyncInProgress) {
      console.log(
        "S1 Plus: 同步进行中，已阻止本次 last_modified 时间戳更新，以防数据覆盖。"
      );
      return;
    }
    GM_setValue("s1p_last_modified", Date.now());
    debouncedTriggerRemoteSyncPush();
  };

  // [NEW] 更新上次同步时间的显示
  const updateLastSyncTimeDisplay = () => {
    const container = document.querySelector("#s1p-last-sync-time-container");
    if (!container) return;
    const lastSyncTs = GM_getValue("s1p_last_sync_timestamp", 0);
    if (lastSyncTs > 0) {
      container.textContent = `上次成功同步于: ${new Date(
        lastSyncTs
      ).toLocaleString("zh-CN", { hour12: false })}`;
    } else {
      container.textContent = "尚未进行过远程同步。";
    }
  };

  /**
   * 从当前页面获取 formhash，用于安全验证。
   * @returns {string|null} 成功则返回 formhash 字符串，否则返回 null。
   */
  const getFormhash = () => {
    const formhashInput = document.querySelector('input[name="formhash"]');
    if (formhashInput && formhashInput.value) {
      return formhashInput.value;
    }
    console.error("S1 Plus: 未能获取到 formhash，无法同步论坛黑名单。");
    return null;
  };

  /**
   * 异步将指定用户添加到论坛黑名单。
   * @param {string} username - 要屏蔽的用户名。
   * @param {string} formhash - 安全验证令牌。
   * @returns {Promise<void>}
   */
  const addToNativeBlacklist = (username, formhash) => {
    return new Promise((resolve, reject) => {
      const url = "home.php?mod=spacecp&ac=friend&op=blacklist&start=";
      const postData = `username=${encodeURIComponent(
        username
      )}&formhash=${formhash}&blacklistsubmit_btn=true&blacklistsubmit=true`;
      const refererUrl =
        "https://stage1st.com/2b/home.php?mod=spacecp&ac=friend&op=blacklist";

      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: refererUrl,
        },
        data: postData,
        onload: (response) => {
          if (
            response.status === 200 &&
            response.responseText.includes("操作成功")
          ) {
            console.log(`S1 Plus: 已成功将用户 ${username} 同步到论坛黑名单。`);
            resolve();
          } else {
            console.error(`S1 Plus: 同步论坛黑名单失败 (添加)。`, response);
            reject(
              new Error(`HTTP status ${response.status} 或未找到成功标识`)
            );
          }
        },
        onerror: (error) => {
          console.error("S1 Plus: 同步论坛黑名单网络请求失败 (添加)", error);
          reject(error);
        },
      });
    });
  };

  /**
   * 异步将指定用户从论坛黑名单中移除。
   * @param {string} uid - 要取消屏蔽的用户ID。
   * @param {string} formhash - 安全验证令牌。
   * @returns {Promise<void>}
   */
  const removeFromNativeBlacklist = (uid, formhash) => {
    return new Promise((resolve, reject) => {
      // 根据用户提供的网络日志，精确模拟请求
      const url = `home.php?mod=spacecp&ac=friend&op=blacklist&subop=delete&uid=${uid}`;
      const refererUrl = `https://stage1st.com/2b/home.php?mod=space&do=friend&view=blacklist`;

      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
          Referer: refererUrl,
        },
        onload: (response) => {
          // [最终修正] 采用用户发现的通用成功标识 "操作成功"
          if (
            response.status === 200 &&
            response.responseText.includes("操作成功")
          ) {
            console.log(`S1 Plus: 已成功将 UID:${uid} 从论坛黑名单同步移除。`);
            resolve();
          } else {
            console.error(`S1 Plus: 同步论坛黑名单失败 (移除)。`, response);
            reject(
              new Error(`HTTP status ${response.status} 或未找到成功标识`)
            );
          }
        },
        onerror: (error) => {
          console.error("S1 Plus: 同步论坛黑名单网络请求失败 (移除)", error);
          reject(error);
        },
      });
    });
  };

  // --- 数据处理 & 核心功能 ---
  const getBlockedThreads = () => GM_getValue("s1p_blocked_threads", {});
  const saveBlockedThreads = (threads) => {
    GM_setValue("s1p_blocked_threads", threads);
    updateLastModifiedTimestamp();
  };
  const getBlockedUsers = () => GM_getValue("s1p_blocked_users", {});
  const saveBlockedUsers = (users) => {
    GM_setValue("s1p_blocked_users", users);
    updateLastModifiedTimestamp();
  };
  const saveUserTags = (tags) => {
    GM_setValue("s1p_user_tags", tags);
    updateLastModifiedTimestamp();
  };
  // [NEW] Bookmarked Replies data functions
  const getBookmarkedReplies = () => GM_getValue("s1p_bookmarked_replies", {});
  const saveBookmarkedReplies = (replies) => {
    GM_setValue("s1p_bookmarked_replies", replies);
    updateLastModifiedTimestamp();
  };

  // [MODIFIED] 升级并获取用户标记，自动迁移旧数据
  const getUserTags = () => {
    const tags = GM_getValue("s1p_user_tags", {});
    let needsMigration = false;
    const migratedTags = { ...tags };

    Object.keys(migratedTags).forEach((id) => {
      if (typeof migratedTags[id] === "string" || !migratedTags[id].timestamp) {
        needsMigration = true;
        const oldTag =
          typeof migratedTags[id] === "string"
            ? migratedTags[id]
            : migratedTags[id].tag;
        const oldName =
          migratedTags[id] && migratedTags[id].name
            ? migratedTags[id].name
            : `用户 #${id}`;
        migratedTags[id] = {
          name: oldName,
          tag: oldTag,
          timestamp:
            (migratedTags[id] && migratedTags[id].timestamp) || Date.now(),
        };
      }
    });

    if (needsMigration) {
      console.log("S1 Plus: 正在将用户标记迁移到新版数据结构...");
      saveUserTags(migratedTags);
      return migratedTags;
    }

    return tags;
  };

  const getTitleFilterRules = () => {
    const rules = GM_getValue("s1p_title_filter_rules", null);
    if (rules !== null) return rules;

    // --- 向下兼容：迁移旧的关键字数据 ---
    const oldKeywords = GM_getValue("s1p_title_keywords", null);
    if (Array.isArray(oldKeywords)) {
      const newRules = oldKeywords.map((k) => ({
        pattern: k,
        enabled: true,
        id: `rule_${Date.now()}_${Math.random()}`,
      }));
      saveTitleFilterRules(newRules);
      GM_setValue("s1p_title_keywords", null); // 清理旧数据
      return newRules;
    }
    return [];
  };
  const saveTitleFilterRules = (rules) => {
    GM_setValue("s1p_title_filter_rules", rules);
    updateLastModifiedTimestamp();
  };

  const blockThread = (id, title, reason = "manual") => {
    const b = getBlockedThreads();
    if (b[id]) return;
    b[id] = { title, timestamp: Date.now(), reason };
    saveBlockedThreads(b);
    hideThread(id);
  };
  const unblockThread = (id) => {
    const b = getBlockedThreads();
    delete b[id];
    saveBlockedThreads(b);
    showThread(id);
  };
  const hideThread = (id) => {
    (
      document.getElementById(`normalthread_${id}`) ||
      document.getElementById(`stickthread_${id}`)
    )?.setAttribute("style", "display: none !important");
  };
  const showThread = (id) => {
    (
      document.getElementById(`normalthread_${id}`) ||
      document.getElementById(`stickthread_${id}`)
    )?.removeAttribute("style");
  };
  const hideBlockedThreads = () =>
    Object.keys(getBlockedThreads()).forEach(hideThread);

  const blockUser = async (id, name) => {
    // [优化] 函数变为异步并返回布尔值
    const settings = getSettings();
    const b = getBlockedUsers();
    b[id] = {
      name,
      timestamp: Date.now(),
      blockThreads: settings.blockThreadsOnUserBlock,
      // [新增] 根据设置决定是否添加同步标记
      addedToNativeBlacklist: settings.syncWithNativeBlacklist,
    };
    saveBlockedUsers(b);

    // [修改] 只有在开关开启时才执行同步操作
    if (settings.syncWithNativeBlacklist) {
      const formhash = getFormhash();
      if (formhash) {
        try {
          await addToNativeBlacklist(name, formhash);
        } catch (e) {
          return false; // 同步失败
        }
      }
    }

    hideUserPosts(id);
    hideBlockedUserQuotes();
    hideBlockedUserRatings();
    if (b[id].blockThreads) applyUserThreadBlocklist();
    return true; // 全部成功
  };

  const unblockUser = async (id) => {
    // [优化] 函数变为异步并返回布尔值
    const b = getBlockedUsers();
    // [修改] 先获取要删除的用户数据
    const userToUnblock = b[id];

    // 如果用户不存在，直接返回成功
    if (!userToUnblock) return true;

    // 从脚本存储中删除用户
    delete b[id];
    saveBlockedUsers(b);

    // [修改] 只有当用户有“已同步”标记时，才执行移除操作
    if (userToUnblock.addedToNativeBlacklist === true) {
      const formhash = getFormhash();
      if (formhash) {
        try {
          await removeFromNativeBlacklist(id, formhash);
        } catch (e) {
          return false; // 同步失败
        }
      }
    }

    showUserPosts(id);
    hideBlockedUserQuotes();
    hideBlockedUserRatings();
    unblockThreadsByUser(id);
    return true; // 全部成功
  };

  // [FIX] 更精确地定位帖子作者，避免错误隐藏被评分的帖子
  const hideUserPosts = (id) => {
    document
      .querySelectorAll(`.authi a[href*="space-uid-${id}.html"]`)
      .forEach((l) =>
        l
          .closest("table.plhin")
          ?.setAttribute("style", "display: none !important")
      );
  };
  const showUserPosts = (id) => {
    document
      .querySelectorAll(`.authi a[href*="space-uid-${id}.html"]`)
      .forEach((l) => l.closest("table.plhin")?.removeAttribute("style"));
  };

  const hideBlockedUsersPosts = () =>
    Object.keys(getBlockedUsers()).forEach(hideUserPosts);

  const hideBlockedUserQuotes = () => {
    const settings = getSettings();
    const blockedUsers = getBlockedUsers();
    const blockedUserNames = Object.values(blockedUsers).map((u) => u.name);

    document.querySelectorAll("div.quote").forEach((quoteElement) => {
      const quoteAuthorElement = quoteElement.querySelector(
        'blockquote font[color="#999999"]'
      );
      if (!quoteAuthorElement) return;

      const text = quoteAuthorElement.textContent.trim();
      const match = text.match(/^(.*)\s发表于\s.*$/);
      if (!match || !match[1]) return;

      const authorName = match[1];
      const isBlocked =
        settings.enableUserBlocking && blockedUserNames.includes(authorName);

      const wrapper = quoteElement.parentElement.classList.contains(
        "s1p-quote-wrapper"
      )
        ? quoteElement.parentElement
        : null;

      if (isBlocked) {
        if (!wrapper) {
          const newWrapper = document.createElement("div");
          newWrapper.className = "s1p-quote-wrapper";
          quoteElement.parentNode.insertBefore(newWrapper, quoteElement);
          newWrapper.appendChild(quoteElement);
          newWrapper.style.maxHeight = "0";

          const newPlaceholder = document.createElement("div");
          newPlaceholder.className = "s1p-quote-placeholder";
          newPlaceholder.innerHTML = `<span>一条来自已屏蔽用户的引用已被隐藏。</span><span class="s1p-quote-toggle s1p-popover-btn">点击展开</span>`;
          newWrapper.parentNode.insertBefore(newPlaceholder, newWrapper);

          newPlaceholder
            .querySelector(".s1p-quote-toggle")
            .addEventListener("click", function () {
              const isCollapsed = newWrapper.style.maxHeight === "0px";
              if (isCollapsed) {
                const style = window.getComputedStyle(quoteElement);
                const marginTop = parseFloat(style.marginTop);
                const marginBottom = parseFloat(style.marginBottom);
                newWrapper.style.maxHeight =
                  quoteElement.offsetHeight + marginTop + marginBottom + "px";
                this.textContent = "点击折叠";
              } else {
                newWrapper.style.maxHeight = "0px";
                this.textContent = "点击展开";
              }
            });
        }
      } else {
        if (wrapper) {
          const placeholder = wrapper.previousElementSibling;
          if (
            placeholder &&
            placeholder.classList.contains("s1p-quote-placeholder")
          ) {
            placeholder.remove();
          }
          wrapper.parentNode.insertBefore(quoteElement, wrapper);
          wrapper.remove();
        }
      }
    });
  };

  // [MODIFIED] 函数现在可以同时处理隐藏和显示，是一个完整的“刷新”功能
  const hideBlockedUserRatings = () => {
    const settings = getSettings();
    const blockedUserIds = Object.keys(getBlockedUsers());
    document.querySelectorAll("tbody.ratl_l tr").forEach((row) => {
      const userLink = row.querySelector('a[href*="space-uid-"]');
      if (userLink) {
        const uidMatch = userLink.href.match(/space-uid-(\d+)/);
        if (uidMatch && uidMatch[1]) {
          const isBlocked =
            settings.enableUserBlocking && blockedUserIds.includes(uidMatch[1]);
          row.style.display = isBlocked ? "none" : "";
        }
      }
    });
  };

  // [修改 V2] 隐藏来自已屏蔽用户的消息提醒 (占位符替换模式)
  const hideBlockedUserNotifications = () => {
    const noticeContainer = document.querySelector(".xld.xlda");
    if (!noticeContainer) return;

    const settings = getSettings();
    if (!settings.enableUserBlocking) return;

    const blockedUserIds = Object.keys(getBlockedUsers());

    // 遍历所有提醒元素或已存在的占位符的下一个元素
    noticeContainer
      .querySelectorAll(
        "dl.cl, .s1p-notification-placeholder + .s1p-notification-wrapper"
      )
      .forEach((element) => {
        let dlElement;
        // 确定我们正在处理的是原始dl还是wrapper内的dl
        if (element.classList.contains("s1p-notification-wrapper")) {
          dlElement = element.querySelector("dl.cl");
        } else {
          dlElement = element;
        }

        if (!dlElement) return;

        const userLink = dlElement.querySelector('a[href*="space-uid-"]');
        if (!userLink) return;

        const uidMatch = userLink.href.match(/space-uid-(\d+)/);
        const authorId = uidMatch ? uidMatch[1] : null;
        const isBlocked = authorId && blockedUserIds.includes(authorId);

        const wrapper = dlElement.parentElement.classList.contains(
          "s1p-notification-wrapper"
        )
          ? dlElement.parentElement
          : null;

        if (isBlocked) {
          if (!wrapper) {
            // 需要屏蔽，但尚未被包装 -> 执行包装和隐藏
            const newWrapper = document.createElement("div");
            newWrapper.className = "s1p-notification-wrapper";
            dlElement.parentNode.insertBefore(newWrapper, dlElement);
            newWrapper.appendChild(dlElement);

            // 关键：先获取高度，再设置为0，以便动画生效
            const initialHeight = dlElement.scrollHeight;
            newWrapper.style.maxHeight = initialHeight + "px"; // 确保初始状态正确

            requestAnimationFrame(() => {
              newWrapper.style.maxHeight = "0px";
            });

            const placeholder = document.createElement("div");
            placeholder.className = "s1p-notification-placeholder";
            placeholder.innerHTML = `<span>一条来自已屏蔽用户的提醒已被隐藏。</span><span class="s1p-notification-toggle">点击展开</span>`;
            newWrapper.parentNode.insertBefore(placeholder, newWrapper);

            placeholder
              .querySelector(".s1p-notification-toggle")
              .addEventListener("click", function () {
                const isCollapsed = newWrapper.style.maxHeight === "0px";
                if (isCollapsed) {
                  newWrapper.style.maxHeight = dlElement.scrollHeight + "px";
                  this.textContent = "点击折叠";
                } else {
                  newWrapper.style.maxHeight = "0px";
                  this.textContent = "点击展开";
                }
              });
          }
        } else {
          if (wrapper) {
            // 不需要屏蔽，但已被包装 -> 解除包装
            const placeholder = wrapper.previousElementSibling;
            if (
              placeholder &&
              placeholder.classList.contains("s1p-notification-placeholder")
            ) {
              placeholder.remove();
            }
            wrapper.parentNode.insertBefore(dlElement, wrapper);
            wrapper.remove();
          }
        }
      });
  };

  const hideThreadsByTitleKeyword = () => {
    const rules = getTitleFilterRules().filter((r) => r.enabled && r.pattern);
    const newHiddenThreads = {};

    const regexes = rules
      .map((r) => {
        try {
          return { regex: new RegExp(r.pattern), pattern: r.pattern };
        } catch (e) {
          console.error(
            `S1 Plus: 屏蔽规则 "${r.pattern}" 不是一个有效的正则表达式，将被忽略。`,
            e
          );
          return null;
        }
      })
      .filter(Boolean);

    document
      .querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]')
      .forEach((row) => {
        const titleElement = row.querySelector("th a.s.xst");
        if (!titleElement) return;

        const title = titleElement.textContent.trim();
        const threadId = row.id.replace(/^(normalthread_|stickthread_)/, "");
        let isHidden = false;

        if (regexes.length > 0) {
          const matchingRule = regexes.find((r) => r.regex.test(title));
          if (matchingRule) {
            newHiddenThreads[threadId] = {
              title,
              pattern: matchingRule.pattern,
            };
            row.classList.add("s1p-hidden-by-keyword");
            isHidden = true;
          }
        }

        if (!isHidden) {
          row.classList.remove("s1p-hidden-by-keyword");
        }
      });
    dynamicallyHiddenThreads = newHiddenThreads;
  };

  const getReadProgress = () => GM_getValue("s1p_read_progress", {});
  const saveReadProgress = (progress, suppressSyncTrigger = false) => {
    GM_setValue("s1p_read_progress", progress);
    if (!suppressSyncTrigger) {
      updateLastModifiedTimestamp();
    }
  };
  const updateThreadProgress = (threadId, postId, page, lastReadFloor) => {
    if (!postId || !page || !lastReadFloor) return;
    const progress = getReadProgress();
    progress[threadId] = {
      postId,
      page,
      timestamp: Date.now(),
      lastReadFloor: lastReadFloor,
    };
    saveReadProgress(progress);
  };

  const applyUserThreadBlocklist = () => {
    const blockedUsers = getBlockedUsers();
    const usersToBlockThreads = Object.keys(blockedUsers).filter(
      (uid) => blockedUsers[uid].blockThreads
    );
    if (usersToBlockThreads.length === 0) return;

    document
      .querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]')
      .forEach((row) => {
        const authorLink = row.querySelector(
          'td.by cite a[href*="space-uid-"]'
        );
        if (authorLink) {
          const uidMatch = authorLink.href.match(/space-uid-(\d+)\.html/);
          const authorId = uidMatch ? uidMatch[1] : null;
          if (authorId && usersToBlockThreads.includes(authorId)) {
            const threadId = row.id.replace(
              /^(normalthread_|stickthread_)/,
              ""
            );
            const titleElement = row.querySelector("th a.s.xst");
            if (threadId && titleElement) {
              blockThread(
                threadId,
                titleElement.textContent.trim(),
                `user_${authorId}`
              );
            }
          }
        }
      });
  };

  const unblockThreadsByUser = (userId) => {
    const allBlockedThreads = getBlockedThreads();
    const reason = `user_${userId}`;
    Object.keys(allBlockedThreads).forEach((threadId) => {
      if (allBlockedThreads[threadId].reason === reason) {
        unblockThread(threadId);
      }
    });
  };

  const updatePostImageButtonState = (postContainer) => {
    const toggleButton = postContainer.querySelector(
      ".s1p-image-toggle-all-btn"
    );
    if (!toggleButton) return;

    const totalImages = postContainer.querySelectorAll(
      ".s1p-image-container"
    ).length;
    if (totalImages <= 1) {
      const container = toggleButton.closest(".s1p-image-toggle-all-container");
      if (container) container.remove();
      return;
    }

    const hiddenImages = postContainer.querySelectorAll(
      ".s1p-image-container.hidden"
    ).length;

    if (hiddenImages > 0) {
      toggleButton.textContent = `显示本楼所有图片 (${hiddenImages}/${totalImages})`;
    } else {
      toggleButton.textContent = `隐藏本楼所有图片 (${totalImages}/${totalImages})`;
    }
  };

  const manageImageToggleAllButtons = () => {
    const settings = getSettings();

    // 如果没有开启“默认隐藏图片”，则移除所有切换按钮并直接返回
    if (!settings.hideImagesByDefault) {
      document
        .querySelectorAll(".s1p-image-toggle-all-container")
        .forEach((el) => el.remove());
      return;
    }

    document.querySelectorAll("table.plhin").forEach((postContainer) => {
      const imageContainers = postContainer.querySelectorAll(
        ".s1p-image-container"
      );
      const postContentArea = postContainer.querySelector("td.t_f");

      if (!postContentArea) return;

      let toggleButtonContainer = postContainer.querySelector(
        ".s1p-image-toggle-all-container"
      );

      if (imageContainers.length <= 1) {
        if (toggleButtonContainer) toggleButtonContainer.remove();
        return;
      }

      if (!toggleButtonContainer) {
        toggleButtonContainer = document.createElement("div");
        toggleButtonContainer.className = "s1p-image-toggle-all-container";

        const toggleButton = document.createElement("button");
        toggleButton.className = "s1p-image-toggle-all-btn";
        toggleButtonContainer.appendChild(toggleButton);

        toggleButton.addEventListener("click", (e) => {
          e.preventDefault();
          const imagesInPost = postContainer.querySelectorAll(
            ".s1p-image-container"
          );
          const shouldShowAll = postContainer.querySelector(
            ".s1p-image-container.hidden"
          );

          if (shouldShowAll) {
            imagesInPost.forEach((container) => {
              container.classList.remove("hidden");
              container.dataset.manualShow = "true";
            });
          } else {
            imagesInPost.forEach((container) => {
              container.classList.add("hidden");
              delete container.dataset.manualShow;
            });
          }
          updatePostImageButtonState(postContainer);
        });

        postContentArea.prepend(toggleButtonContainer);
      }

      updatePostImageButtonState(postContainer);
    });
  };

  // --- [新增] 修改“只看该作者”为“只看该用户”的函数 ---
  const renameAuthorLinks = () => {
    document
      .querySelectorAll('div.authi a[href*="authorid="]')
      .forEach((link) => {
        if (link.textContent.trim() === "只看该作者") {
          link.textContent = "只看该用户";
        }
      });
  };

  // [MODIFIED] 图片隐藏功能的核心逻辑 (支持实时切换)
  const applyImageHiding = () => {
    const settings = getSettings();

    // 如果功能未开启，则移除所有包装和占位符
    if (!settings.hideImagesByDefault) {
      document.querySelectorAll(".s1p-image-container").forEach((container) => {
        const originalElement =
          container.querySelector("img.zoom")?.closest("a") ||
          container.querySelector("img.zoom");
        if (originalElement) {
          container.parentNode.insertBefore(originalElement, container);
        }
        container.remove();
      });
      return;
    }

    // 步骤 1: 遍历所有帖子图片，确保它们都被容器包裹并绑定切换事件
    document.querySelectorAll("div.t_fsz img.zoom").forEach((img) => {
      if (img.closest(".s1p-image-container")) return; // 如果已被包裹，则跳过

      const targetElement = img.closest("a") || img;
      const container = document.createElement("div");
      container.className = "s1p-image-container";

      const placeholder = document.createElement("span");
      placeholder.className = "s1p-image-placeholder";
      // 初始文本不重要，会在步骤2中被正确设置
      placeholder.textContent = "图片处理中...";

      targetElement.parentNode.insertBefore(container, targetElement);
      container.appendChild(placeholder);
      container.appendChild(targetElement);

      placeholder.addEventListener("click", (e) => {
        e.preventDefault();
        const isHidden = container.classList.toggle("hidden");

        if (isHidden) {
          placeholder.textContent = "显示图片";
          delete container.dataset.manualShow;
        } else {
          placeholder.textContent = "隐藏图片";
          container.dataset.manualShow = "true";
        }

        const postContainer = container.closest("table.plhin");
        if (postContainer) {
          updatePostImageButtonState(postContainer);
        }
      });
    });

    // 步骤 2: 根据当前设置和图片状态，同步所有容器的 class 和占位符文本
    document.querySelectorAll(".s1p-image-container").forEach((container) => {
      const placeholder = container.querySelector(".s1p-image-placeholder");
      if (!placeholder) return;

      const shouldBeHidden =
        settings.hideImagesByDefault && container.dataset.manualShow !== "true";

      container.classList.toggle("hidden", shouldBeHidden);

      if (shouldBeHidden) {
        placeholder.textContent = "显示图片";
      } else {
        placeholder.textContent = "隐藏图片";
      }
    });
  };

  const globalLinkClickHandler = (e) => {
    const settings = getSettings();
    const openTabSettings = settings.openInNewTab;

    if (!openTabSettings.master) return;

    const anchor = e.target.closest("a[href]");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (
      href.startsWith("javascript:") ||
      href.includes("mod=logging&action=logout") ||
      anchor.closest(
        ".s1p-modal, .s1p-confirm-modal, .s1p-options-menu, .s1p-tag-popover, .pob, .pgs, .pgbtn, #s1p-nav-link, #s1p-nav-sync-btn"
      )
    ) {
      return;
    }

    // --- [核心重构 V2] 真正与执行顺序无关的精确识别 ---
    const getLinkType = (targetAnchor) => {
      // 步骤 1: 识别链接所具备的所有身份，不提前返回
      const identities = [];
      if (
        targetAnchor.classList.contains("s1p-progress-jump-btn") &&
        targetAnchor.closest("#threadlist")
      ) {
        identities.push("progress_jump");
      }
      if (targetAnchor.closest("#threadlist")) {
        identities.push("thread_list");
      }
      if (targetAnchor.closest(".xld.xlda")) {
        identities.push("notification");
      }
      if (targetAnchor.closest(".wp")) {
        identities.push("header");
      }

      // 如果没有任何身份，则为未处理
      if (identities.length === 0) {
        return "unhandled";
      }

      // 步骤 2: 定义身份的优先级顺序 (从最具体到最宽泛)
      const priorityOrder = [
        "progress_jump",
        "thread_list",
        "notification",
        "header",
      ];

      // 步骤 3: 根据优先级列表，返回链接身份中优先级最高的一个
      for (const priorityType of priorityOrder) {
        if (identities.includes(priorityType)) {
          return priorityType;
        }
      }

      // 理论上不会执行到这里，作为安全保障
      return "unhandled";
    };

    const linkType = getLinkType(anchor);

    let open = false;
    let background = false;
    let settingApplied = false;

    // --- 根据精确识别的类型，应用对应设置 (此部分逻辑不变) ---
    switch (linkType) {
      case "progress_jump":
        if (openTabSettings.progress) {
          open = true;
          background = openTabSettings.progressInBackground;
          settingApplied = true;
        }
        break;
      case "thread_list":
      case "notification":
        if (openTabSettings.threadList) {
          open = true;
          background = openTabSettings.threadListInBackground;
          settingApplied = true;
        }
        break;
      case "header":
        if (openTabSettings.nav) {
          open = true;
          background = openTabSettings.navInBackground;
          settingApplied = true;
        }
        break;
      case "unhandled":
      default:
        // 对于未处理的链接类型，直接返回，保持默认行为
        return;
    }

    if (open && settingApplied) {
      e.preventDefault();
      e.stopPropagation();
      GM_openInTab(anchor.href, { active: !background });
    }
  };

  const applyGlobalLinkBehavior = () => {
    document.body.removeEventListener("click", globalLinkClickHandler);
    const settings = getSettings();
    if (settings.openInNewTab.master) {
      document.body.addEventListener("click", globalLinkClickHandler);
    }
  };

  // [MODIFIED] 导出数据对象，采用新的嵌套结构并包含内容哈希
  const exportLocalDataObject = async () => {
    const lastUpdated = GM_getValue("s1p_last_modified", 0);
    const lastUpdatedFormatted = new Date(lastUpdated).toLocaleString("zh-CN", {
      hour12: false,
    });

    // --- [FIX] 从要同步的设置中排除 Gist ID 和 PAT ---
    const allSettings = getSettings();
    const { syncRemoteGistId, syncRemotePat, ...syncedSettings } = allSettings;
    // -----------------------------------------------------

    const data = {
      settings: syncedSettings, // 使用过滤后的设置对象
      threads: getBlockedThreads(),
      users: getBlockedUsers(),
      user_tags: getUserTags(),
      title_filter_rules: getTitleFilterRules(),
      read_progress: getReadProgress(),
      bookmarked_replies: getBookmarkedReplies(),
    };

    const contentHash = await calculateDataHash(data);

    return {
      version: 4.0, // 版本号升级
      lastUpdated,
      lastUpdatedFormatted,
      contentHash, // 新增内容哈希字段
      data, // 所有用户数据被封装在 data 对象中
    };
  };

  const exportLocalData = async () =>
    JSON.stringify(await exportLocalDataObject(), null, 2);

  // [MODIFIED] 导入数据，兼容新旧两种数据结构，并增加控制选项
  const importLocalData = (jsonStr, options = {}) => {
    const { suppressPostSync = false } = options;
    try {
      // [S1P-FIX-A] 在导入任何数据之前，立刻断开当前页面的阅读进度观察器，修复潜在的竞态条件问题。
      if (pageObserver) {
        pageObserver.disconnect();
        console.log(
          "S1 Plus: 已在导入数据前断开阅读进度观察器，防止数据覆盖。"
        );
      }

      const imported = JSON.parse(jsonStr);
      if (typeof imported !== "object" || imported === null)
        throw new Error("无效数据格式");

      const dataToImport =
        imported.data && imported.version >= 4.0 ? imported.data : imported;

      let threadsImported = 0,
        usersImported = 0,
        progressImported = 0,
        rulesImported = 0,
        tagsImported = 0,
        bookmarksImported = 0;

      const upgradeDataStructure = (type, importedData) => {
        if (!importedData || typeof importedData !== "object") return {};
        Object.keys(importedData).forEach((id) => {
          const item = importedData[id];
          if (type === "users" && typeof item.blockThreads === "undefined")
            item.blockThreads = false;
          if (type === "threads" && typeof item.reason === "undefined")
            item.reason = "manual";
        });
        return importedData;
      };

      if (dataToImport.settings) {
        const importedSettings = { ...dataToImport.settings };
        delete importedSettings.syncRemoteGistId;
        delete importedSettings.syncRemotePat;
        saveSettings({ ...getSettings(), ...importedSettings });
      }

      const threadsToSave = upgradeDataStructure(
        "threads",
        dataToImport.threads || {}
      );
      saveBlockedThreads(threadsToSave);
      threadsImported = Object.keys(threadsToSave).length;

      const usersToSave = upgradeDataStructure(
        "users",
        dataToImport.users || {}
      );
      saveBlockedUsers(usersToSave);
      usersImported = Object.keys(usersToSave).length;

      if (
        dataToImport.user_tags &&
        typeof dataToImport.user_tags === "object"
      ) {
        saveUserTags(dataToImport.user_tags);
        tagsImported = Object.keys(dataToImport.user_tags).length;
      }

      if (
        dataToImport.title_filter_rules &&
        Array.isArray(dataToImport.title_filter_rules)
      ) {
        saveTitleFilterRules(dataToImport.title_filter_rules);
        rulesImported = dataToImport.title_filter_rules.length;
      } else if (
        dataToImport.title_keywords &&
        Array.isArray(dataToImport.title_keywords)
      ) {
        const newRules = dataToImport.title_keywords.map((k) => ({
          pattern: k,
          enabled: true,
          id: `rule_${Date.now()}_${Math.random()}`,
        }));
        saveTitleFilterRules(newRules);
        rulesImported = newRules.length;
      }

      if (dataToImport.read_progress) {
        saveReadProgress(dataToImport.read_progress);
        progressImported = Object.keys(dataToImport.read_progress).length;
      }

      if (dataToImport.bookmarked_replies) {
        saveBookmarkedReplies(dataToImport.bookmarked_replies);
        bookmarksImported = Object.keys(dataToImport.bookmarked_replies).length;
      }

      GM_setValue("s1p_last_modified", imported.lastUpdated || 0);

      hideBlockedThreads();
      hideBlockedUsersPosts();
      applyUserThreadBlocklist();
      hideThreadsByTitleKeyword();
      initializeNavbar();
      applyInterfaceCustomizations();

      // [S1P-FIX-B] 只有在非抑制模式下（例如手动编辑文本框导入）才触发后续同步，修复强制拉取后的冗余操作问题。
      if (!suppressPostSync) {
        triggerRemoteSyncPush();
      }

      return {
        success: true,
        message: `成功导入 ${threadsImported} 条帖子、${usersImported} 条用户、${tagsImported} 条标记、${bookmarksImported} 条收藏、${rulesImported} 条标题规则、${progressImported} 条阅读进度及相关设置。`,
      };
    } catch (e) {
      return { success: false, message: `导入失败: ${e.message}` };
    }
  };

  const fetchRemoteData = () =>
    new Promise((resolve, reject) => {
      const { syncRemoteGistId, syncRemotePat } = getSettings();
      if (!syncRemoteGistId || !syncRemotePat) {
        return reject(new Error("配置不完整"));
      }
      const syncRemoteApiUrl = `https://api.github.com/gists/${syncRemoteGistId}`;

      GM_xmlhttpRequest({
        method: "GET",
        url: syncRemoteApiUrl,
        headers: {
          Authorization: `Bearer ${syncRemotePat}`,
          Accept: "application/vnd.github.v3+json",
          // [新增] 增加此行以禁用API缓存，确保每次都获取最新数据
          "Cache-Control": "no-cache",
        },
        onload: (response) => {
          if (response.status === 200) {
            try {
              const gistData = JSON.parse(response.responseText);
              const fileContent = gistData.files["s1plus_sync.json"]?.content;
              if (fileContent) {
                resolve(JSON.parse(fileContent));
              } else {
                // If file doesn't exist, it's not an error, just means it's the first sync.
                // Return an empty object so it can be populated.
                resolve({});
              }
            } catch (e) {
              reject(new Error(`解析Gist数据失败: ${e.message}`));
            }
          } else {
            reject(new Error(`GitHub API请求失败，状态码: ${response.status}`));
          }
        },
        onerror: () => {
          reject(new Error("网络请求失败。"));
        },
      });
    });

  const pushRemoteData = (dataObject) =>
    new Promise((resolve, reject) => {
      const { syncRemoteGistId, syncRemotePat } = getSettings();
      if (!syncRemoteGistId || !syncRemotePat) {
        return reject(new Error("配置不完整"));
      }
      const syncRemoteApiUrl = `https://api.github.com/gists/${syncRemoteGistId}`;

      const payload = {
        files: {
          "s1plus_sync.json": {
            content: JSON.stringify(dataObject, null, 2),
          },
        },
      };

      GM_xmlhttpRequest({
        method: "PATCH",
        url: syncRemoteApiUrl,
        headers: {
          Authorization: `Bearer ${syncRemotePat}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify(payload),
        onload: (response) => {
          if (response.status === 200) {
            resolve({ success: true, message: "数据已成功推送到Gist。" });
          } else {
            // [S1PLUS-MODIFIED] 优化 Gist API 错误信息处理
            let errorMessage = `Gist 更新失败 (状态码: ${response.status})。`;
            try {
              const apiResponse = JSON.parse(response.responseText);
              // 优先使用 API 返回的 message 字段
              if (apiResponse && apiResponse.message) {
                errorMessage += `原因: ${apiResponse.message}`;
              }
            } catch (e) {
              // 如果响应不是有效的 JSON，则不附加额外信息
              errorMessage += "请检查网络连接或 Gist 配置。";
            }
            reject(new Error(errorMessage));
          }
        },
        onerror: () => {
          reject(new Error("网络请求失败。"));
        },
      });
    });

  // [MODIFIED] 触发式推送函数，现在是异步的
  const triggerRemoteSyncPush = () => {
    // 异步执行，不阻塞主流程
    (async () => {
      const settings = getSettings();
      if (
        !settings.syncRemoteEnabled ||
        !settings.syncAutoEnabled || // [修正] 确保自动同步子开关也开启
        !settings.syncRemoteGistId ||
        !settings.syncRemotePat
      ) {
        return;
      }

      console.log("S1 Plus: 检测到数据变更，触发后台智能同步检查...");

      // [核心修改] 不再是“盲目推送”，而是调用完整的智能同步引擎
      const result = await performAutoSync();

      // [新增] 根据智能同步的结果，决定是否需要用户交互
      switch (result.status) {
        case "conflict":
          // 如果检测到冲突，则调用与启动时同步完全相同的弹窗，让用户解决
          createAdvancedConfirmationModal(
            "检测到后台同步冲突",
            "<p>S1 Plus在后台自动同步时发现，您的本地数据和云端备份可能都已更改，为防止数据丢失，自动同步已暂停。</p><p>请手动选择要保留的版本来解决冲突。</p>",
            [
              {
                text: "稍后处理",
                className: "s1p-cancel",
                action: () => {
                  showMessage("同步已暂停，您可以在设置中手动同步。", null);
                },
              },
              {
                text: "立即解决",
                className: "s1p-confirm",
                action: () => {
                  handleManualSync(); // 调用功能最完善的手动同步流程
                },
              },
            ]
          );
          break;

        case "failure":
          // 如果同步失败，用一个无打扰的toast提示用户
          showMessage(`后台同步失败: ${result.error}`, false);
          break;

        case "success":
          if (result.action === "pulled") {
            // 如果后台自动拉取了数据，提示用户，因为页面内容可能已过期
            showMessage(
              "后台同步完成：云端有更新已被自动拉取。建议刷新页面。",
              true
            );
          }
          // 对于推送成功(pushed)或无需更改(no_change)的情况，控制台日志已足够，无需打扰用户
          break;
      }
    })();
  };

  /**
   * [新增] 迁移并校验远程数据
   * @param {object} remoteGistObject - 从 Gist 拉取的原始对象
   * @returns {Promise<object>} 返回一个包含 data, version, contentHash, lastUpdated 的规范化对象
   */
  const migrateAndValidateRemoteData = async (remoteGistObject) => {
    if (!remoteGistObject || typeof remoteGistObject !== "object") {
      throw new Error("远程数据为空或格式无效");
    }

    let data, version, contentHash, lastUpdated;

    // 场景1: 新版数据结构 (v4.0+)
    if (remoteGistObject.data && remoteGistObject.version >= 4.0) {
      data = remoteGistObject.data;
      version = remoteGistObject.version;
      contentHash = remoteGistObject.contentHash;
      lastUpdated = remoteGistObject.lastUpdated;

      // --- 核心校验逻辑 ---
      const calculatedHash = await calculateDataHash(data);
      if (calculatedHash !== contentHash) {
        throw new Error(
          "云端备份已损坏 (哈希校验失败)，同步已暂停以保护您的本地数据。"
        );
      }

      // 场景2: 旧版扁平数据结构 (需要迁移)
    } else {
      console.log("S1 Plus: 检测到旧版云端数据格式，将进行自动迁移。");
      version = remoteGistObject.version || 3.2; // 假设旧版版本
      lastUpdated = remoteGistObject.lastUpdated || 0;
      // 从顶层属性中提取数据
      data = {
        settings: remoteGistObject.settings || defaultSettings,
        threads: remoteGistObject.threads || {},
        users: remoteGistObject.users || {},
        user_tags: remoteGistObject.user_tags || {},
        title_filter_rules: remoteGistObject.title_filter_rules || [],
        read_progress: remoteGistObject.read_progress || {},
        bookmarked_replies: remoteGistObject.bookmarked_replies || {},
      };
      // 旧版数据没有哈希，我们计算一个用于后续比较
      contentHash = await calculateDataHash(data);
    }

    return { data, version, contentHash, lastUpdated, full: remoteGistObject };
  };

  // [MODIFIED] 自动同步控制器 (逻辑优化版)
  const performAutoSync = async (isStartupSync = false) => {
    const settings = getSettings();
    if (
      !settings.syncRemoteEnabled ||
      !settings.syncRemoteGistId ||
      !settings.syncRemotePat
    ) {
      return { status: "skipped", reason: "disabled" };
    }

    isInitialSyncInProgress = true;
    console.log(
      `S1 Plus (Sync): 启动同步检查... (模式: ${
        isStartupSync ? "Startup" : "Normal"
      })`
    );

    try {
      const rawRemoteData = await fetchRemoteData();
      if (Object.keys(rawRemoteData).length === 0) {
        console.log(`S1 Plus (Sync): 远程为空，推送本地数据...`);
        const localData = await exportLocalDataObject();
        await pushRemoteData(localData);
        GM_setValue("s1p_last_sync_timestamp", Date.now());
        return { status: "success", action: "pushed_initial" };
      }

      const remote = await migrateAndValidateRemoteData(rawRemoteData);
      const localDataObject = await exportLocalDataObject();

      // --- 决策阶段 (V2: 调整冲突检查的优先级) ---
      let syncAction = null;
      if (remote.contentHash === localDataObject.contentHash) {
        syncAction = "no_change";
      } else if (localDataObject.lastUpdated === remote.lastUpdated) {
        // [核心修改] 将冲突检查的优先级提到 force_pull 之前
        syncAction = "conflict";
      } else if (isStartupSync && settings.syncForcePullOnStartup) {
        syncAction = "force_pull";
      } else if (remote.lastUpdated > localDataObject.lastUpdated) {
        syncAction = "pull";
      } else if (localDataObject.lastUpdated > remote.lastUpdated) {
        syncAction = isStartupSync ? "skip_push_on_startup" : "push";
      } else {
        // Fallback, should not be reached with the new logic, but kept for safety
        syncAction = "conflict";
      }

      // --- 执行阶段 ---
      switch (syncAction) {
        case "no_change":
          console.log(`S1 Plus (Sync): 本地与远程数据哈希一致，无需同步。`);
          return { status: "success", action: "no_change" };

        case "force_pull":
          console.log(
            `S1 Plus (Sync): 检测到启动时强制拉取已开启，将使用云端数据覆盖本地。`
          );
          importLocalData(JSON.stringify(remote.full), {
            suppressPostSync: true,
          });
          GM_setValue("s1p_last_sync_timestamp", Date.now());
          return { status: "success", action: "force_pulled" };

        case "pull":
          console.log(`S1 Plus (Sync): 远程数据比本地新，正在后台应用...`);
          importLocalData(JSON.stringify(remote.full), {
            suppressPostSync: true,
          });
          GM_setValue("s1p_last_sync_timestamp", Date.now());
          return { status: "success", action: "pulled" };

        case "skip_push_on_startup":
          console.warn(
            `S1 Plus (Sync): 启动同步检测到本地数据较新，已跳过自动推送以确保数据安全。如有需要，请手动同步。`
          );
          return { status: "success", action: "skipped_push_on_startup" };

        case "push":
          console.log(`S1 Plus (Sync): 本地数据比远程新，正在后台推送...`);
          await pushRemoteData(localDataObject);
          GM_setValue("s1p_last_sync_timestamp", Date.now());
          return { status: "success", action: "pushed" };

        case "conflict":
          console.warn(
            `S1 Plus (Sync): 检测到同步冲突 (时间戳相同但内容不同)，自动同步已暂停。请手动同步以解决冲突。`
          );
          return {
            status: "conflict",
            reason: "timestamps match but hashes differ",
          };
      }
    } catch (error) {
      console.error("S1 Plus: 自动同步失败:", error);
      return { status: "failure", error: error.message };
    } finally {
      isInitialSyncInProgress = false;
      console.log("S1 Plus (Sync): 同步检查完成。");
    }
  };

  const defaultSettings = {
    enablePostBlocking: true,
    enableGeneralSettings: true,
    enableUserBlocking: true,
    enableUserTagging: true,
    enableReadProgress: true,
    showReadIndicator: true,
    enableBookmarkReplies: true,
    readingProgressCleanupDays: 0,
    openInNewTab: {
      master: false,
      threadList: true,
      threadListInBackground: false,
      progress: true,
      progressInBackground: false,
      nav: true,
      navInBackground: false,
    },
    enableNavCustomization: true,
    changeLogoLink: true,
    hideBlacklistTip: true,
    blockThreadsOnUserBlock: true,
    syncWithNativeBlacklist: true,
    showBlockedByKeywordList: false,
    showManuallyBlockedList: false,
    hideImagesByDefault: false,
    enhanceFloatingControls: true,
    recommendS1Nux: true,
    threadBlockHoverDelay: 1,
    customTitleSuffix: " - STAGE1ₛₜ",
    customNavLinks: [
      { name: "论坛", href: "forum.php" },
      { name: "归墟", href: "forum-157-1.html" },
      { name: "漫区", href: "forum-6-1.html" },
      { name: "游戏", href: "forum-4-1.html" },
      { name: "影视", href: "forum-48-1.html" },
      { name: "PC数码", href: "forum-51-1.html" },
      { name: "黑名单", href: "home.php?mod=space&do=friend&view=blacklist" },
    ],
    syncRemoteEnabled: false,
    syncDailyFirstLoad: true,
    syncAutoEnabled: true,
    syncForcePullOnStartup: false, // <-- [新增] 新增功能开关
    syncDirectChoiceMode: false,
    syncRemoteGistId: "",
    syncRemotePat: "",
  };

  const getSettings = () => {
    const saved = GM_getValue("s1p_settings", {});
    const settings = { ...defaultSettings, ...saved };

    // --- [NEW V2] 数据迁移逻辑 ---
    // 检查是否存在旧的、独立的设置项，或旧的 openInNewTab 结构
    if (
      typeof saved.openThreadsInNewTab !== "undefined" ||
      (saved.openInNewTab && typeof saved.openInNewTab.threads !== "undefined")
    ) {
      console.log(
        "S1 Plus: 检测到旧版“在新标签页打开”设置，正在执行自动迁移..."
      );

      const oldOpenTab = saved.openInNewTab || {};
      const newOpenInNewTab = {
        master: oldOpenTab.threads ?? saved.openThreadsInNewTab ?? false,
        threadList: oldOpenTab.threads ?? saved.openThreadsInNewTab ?? true,
        threadListInBackground:
          oldOpenTab.threadsInBackground ??
          saved.openThreadsInBackground ??
          false,
        progress: oldOpenTab.progress ?? saved.openProgressInNewTab ?? true,
        progressInBackground:
          oldOpenTab.progressInBackground ??
          saved.openProgressInBackground ??
          false,
        nav: oldOpenTab.nav ?? true, // 旧版无此设置，迁移时默认为 true
        navInBackground: oldOpenTab.navInBackground ?? false,
      };

      settings.openInNewTab = newOpenInNewTab;

      // 从设置中删除已迁移的旧键
      delete settings.openThreadsInNewTab;
      delete settings.openThreadsInBackground;
      delete settings.openProgressInNewTab;
      delete settings.openProgressInBackground;
      if (settings.openInNewTab) {
        delete settings.openInNewTab.threads;
        delete settings.openInNewTab.threadsInBackground;
        delete settings.openInNewTab.sidebar;
        delete settings.openInNewTab.sidebarInBackground;
      }

      // 立即保存迁移后的新设置
      saveSettings(settings);
      console.log("S1 Plus: 设置迁移完成。");
    } else {
      // 确保即使在迁移后，openInNewTab 对象也与默认值合并，以添加可能的新子属性
      settings.openInNewTab = {
        ...defaultSettings.openInNewTab,
        ...(saved.openInNewTab || {}),
      };
    }

    if (saved.customNavLinks && Array.isArray(saved.customNavLinks)) {
      settings.customNavLinks = saved.customNavLinks;
    }

    return settings;
  };

  // [S1PLUS-ADD-ABOVE: saveSettings]
  /**
   * [NEW] 设置一个嵌套对象的值。
   * @param {object} obj - 要修改的对象。
   * @param {string} path - 属性路径，用点号分隔，例如 'openInNewTab.threads'。
   * @param {any} value - 要设置的值。
   */
  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (typeof current[keys[i]] === "undefined") {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  };

  // [MODIFIED] 增加 suppressSyncTrigger 参数以阻止在特定情况下触发自动同步
  const saveSettings = (settings, suppressSyncTrigger = false) => {
    GM_setValue("s1p_settings", settings);
    if (!suppressSyncTrigger) {
      updateLastModifiedTimestamp();
    }
  };

  // --- 界面定制功能 ---
  const applyInterfaceCustomizations = () => {
    const settings = getSettings();
    if (settings.changeLogoLink)
      document.querySelector("#hd h2 a")?.setAttribute("href", "./forum.php");
    if (settings.hideBlacklistTip)
      document.getElementById("hiddenpoststip")?.remove();

    // 添加标题后缀修改
    if (settings.customTitleSuffix) {
      const titlePattern =
        /^(.+?)(?:论坛)?(?:\s*-\s*Stage1st)?\s*-\s*stage1\/s1\s+游戏动漫论坛$/;
      if (titlePattern.test(document.title)) {
        document.title =
          document.title.replace(titlePattern, "$1") +
          settings.customTitleSuffix;
      }
    }
  };

  /**
   * [NEW & EXTENDED V6 - SVG & ClassName Support] 创建一个更通用的行内动作菜单
   * @param {HTMLElement} anchorElement - 菜单定位的锚点元素
   * @param {Array<Object>} buttons - 按钮配置数组，例如 [{ label, title, action, className, callback }]
   * @param {Function} [onCloseCallback] - 菜单关闭时执行的回调函数
   */
  const createInlineActionMenu = (anchorElement, buttons, onCloseCallback) => {
    // 确保同一时间只有一个菜单
    document.querySelector(".s1p-inline-action-menu")?.remove();

    const menu = document.createElement("div");
    menu.className = "s1p-inline-action-menu";

    let isClosing = false;
    const closeMenu = () => {
      if (isClosing) return;
      isClosing = true;
      menu.classList.remove("visible");
      setTimeout(() => {
        if (menu.parentNode) menu.remove();
        if (onCloseCallback) onCloseCallback();
      }, 200);
    };

    buttons.forEach((btnConfig) => {
      const button = document.createElement("button");
      button.className = "s1p-action-btn";
      // [新增] 支持自定义 className
      if (btnConfig.className) {
        button.classList.add(...btnConfig.className.split(" "));
      }

      button.dataset.action = btnConfig.action;
      // [核心修正] 使用 innerHTML 替代 textContent 来渲染 SVG
      button.innerHTML = btnConfig.label;
      menu.appendChild(button);

      button.addEventListener("click", (e) => {
        e.stopPropagation();
        if (btnConfig.callback) {
          btnConfig.callback();
        }
        closeMenu();
      });

      const popover = document.getElementById("s1p-generic-display-popover");
      if (popover && popover.s1p_api && btnConfig.title) {
        button.addEventListener("mouseover", (e) =>
          popover.s1p_api.show(e.currentTarget, btnConfig.title)
        );
        button.addEventListener("mouseout", () => popover.s1p_api.hide());
      }
    });

    document.body.appendChild(menu);

    // --- 定位与显示 ---
    const anchorRect = anchorElement.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const top =
      anchorRect.top +
      window.scrollY +
      anchorRect.height / 2 -
      menuRect.height / 2;
    let left;

    const spaceOnRight = window.innerWidth - anchorRect.right;
    const requiredSpace = menuRect.width + 16;

    if (spaceOnRight >= requiredSpace) {
      left = anchorRect.right + window.scrollX + 8;
    } else {
      left = anchorRect.left + window.scrollX - menuRect.width - 8;
    }

    if (left < window.scrollX) {
      left = window.scrollX + 8;
    }

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;

    // --- 交互逻辑 ---
    let hideTimeout;
    const startHideTimer = () => {
      hideTimeout = setTimeout(closeMenu, 300);
    };
    const cancelHideTimer = () => {
      clearTimeout(hideTimeout);
    };

    anchorElement.addEventListener("mouseleave", startHideTimer);
    menu.addEventListener("mouseenter", cancelHideTimer);
    menu.addEventListener("mouseleave", startHideTimer);

    requestAnimationFrame(() => {
      menu.classList.add("visible");
    });

    return menu;
  };

  /**
   * [NEW] 强制推送处理器，用于手动将本地数据覆盖到云端。
   */
  const handleForcePush = async () => {
    const icon = document.querySelector("#s1p-nav-sync-btn svg");
    if (icon) icon.classList.add("s1p-syncing");
    showMessage("正在向云端推送数据...", null);
    try {
      const localData = await exportLocalDataObject();
      await pushRemoteData(localData);
      GM_setValue("s1p_last_sync_timestamp", Date.now());
      updateLastSyncTimeDisplay();
      showMessage("推送成功！已更新云端备份。", true);
    } catch (e) {
      showMessage(`推送失败: ${e.message}`, false);
    } finally {
      if (icon) {
        icon.classList.remove("s1p-syncing");
        setTimeout(() => (icon.style.transform = ""), 1200); // 重置 transform
      }
    }
  };

  const handleForcePull = async () => {
    const icon = document.querySelector("#s1p-nav-sync-btn svg");
    if (icon) icon.classList.add("s1p-syncing");
    showMessage("正在从云端拉取数据...", null);
    try {
      const remoteData = await fetchRemoteData();
      if (Object.keys(remoteData).length === 0) {
        throw new Error("云端没有数据，无法拉取。");
      }
      const validatedRemote = await migrateAndValidateRemoteData(remoteData);
      // [S1P-FIX] 调用导入时，传入 suppressPostSync 选项来阻止不必要的二次同步
      const result = importLocalData(JSON.stringify(validatedRemote.full), {
        suppressPostSync: true,
      });
      if (result.success) {
        GM_setValue("s1p_last_sync_timestamp", Date.now());
        updateLastSyncTimeDisplay();
        showMessage("拉取成功！页面即将刷新以应用新数据。", true);
        setTimeout(() => location.reload(), 1500);
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      showMessage(`拉取失败: ${e.message}`, false);
    } finally {
      if (icon) {
        icon.classList.remove("s1p-syncing");
        setTimeout(() => (icon.style.transform = ""), 1200); // 重置 transform
      }
    }
  };

  const updateNavbarSyncButton = () => {
    const settings = getSettings();
    const existingBtnLi = document.getElementById("s1p-nav-sync-btn");
    const managerLink = document.getElementById("s1p-nav-link");

    if (!settings.syncRemoteEnabled) {
      if (existingBtnLi) existingBtnLi.remove();
      return;
    }

    if (existingBtnLi || !managerLink) return;

    const li = document.createElement("li");
    li.id = "s1p-nav-sync-btn";
    const a = document.createElement("a");
    a.href = "javascript:void(0);";
    // --- [核心修正] 恢复为原始的、基于“填充(fill)”的实心图标定义 ---
    a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4C14.7486 4 17.1749 5.38626 18.6156 7.5H16V9.5H22V3.5H20V5.99936C18.1762 3.57166 15.2724 2 12 2C6.47715 2 2 6.47715 2 12H4C4 7.58172 7.58172 4 12 4ZM20 12C20 16.4183 16.4183 20 12 20C9.25144 20 6.82508 18.6137 5.38443 16.5H8V14.5H2V20.5H4V18.0006C5.82381 20.4283 8.72764 22 12 22C17.5228 22 22 17.5228 22 12H20Z"></path></svg>`;
    li.appendChild(a);

    if (settings.syncDirectChoiceMode) {
      // --- [MODIFIED] 模式2: 高级模式 (点击->智能判断 | 悬停->直接选择) ---
      let activeMenu = null;

      // [核心修改] 为高级模式下的按钮增加与默认模式完全相同的“点击”行为
      a.addEventListener("click", async (e) => {
        e.preventDefault();
        const icon = a.querySelector("svg");
        if (!icon || icon.classList.contains("s1p-syncing")) return;

        icon.classList.remove("s1p-sync-success", "s1p-sync-error");
        icon.classList.add("s1p-syncing");

        try {
          // 调用我们已优化的核心同步函数
          await handleManualSync();
          // 注意：由于handleManualSync现在自己处理所有反馈，这里不再需要处理其返回值来增删图标class
          icon.classList.remove("s1p-syncing");
        } catch (error) {
          icon.classList.remove("s1p-syncing");
          console.error("S1 Plus: Manual sync handler threw an error:", error);
        } finally {
          // 移除动画类，并重置可能存在的transform
          setTimeout(() => {
            icon.classList.remove("s1p-sync-success", "s1p-sync-error");
            icon.style.transform = "";
          }, 1200);
        }
      });

      const pullIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 14.5C1 12.1716 2.22429 10.1291 4.06426 8.9812C4.56469 5.044 7.92686 2 12 2C16.0731 2 19.4353 5.044 19.9357 8.9812C21.7757 10.1291 23 12.1716 23 14.5C23 17.9216 20.3562 20.7257 17 20.9811L7 21C3.64378 20.7257 1 17.9216 1 14.5ZM16.8483 18.9868C19.1817 18.8093 21 16.8561 21 14.5C21 12.927 20.1884 11.4962 18.8771 10.6781L18.0714 10.1754L17.9517 9.23338C17.5735 6.25803 15.0288 4 12 4C8.97116 4 6.42647 6.25803 6.0483 9.23338L5.92856 10.1754L5.12288 10.6781C3.81156 11.4962 3 12.927 3 14.5C3 16.8561 4.81833 18.8093 7.1517 18.9868L7.325 19H16.675L16.8483 18.9868ZM13 12H16L12 17L8 12H11V8H13V12Z"></path></svg>`;
      const pushIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 14.5C1 12.1716 2.22429 10.1291 4.06426 8.9812C4.56469 5.044 7.92686 2 12 2C16.0731 2 19.4353 5.044 19.9357 8.9812C21.7757 10.1291 23 12.1716 23 14.5C23 17.9216 20.3562 20.7257 17 20.9811L7 21C3.64378 20.7257 1 17.9216 1 14.5ZM16.8483 18.9868C19.1817 18.8093 21 16.8561 21 14.5C21 12.927 20.1884 11.4962 18.8771 10.6781L18.0714 10.1754L17.9517 9.23338C17.5735 6.25803 15.0288 4 12 4C8.97116 4 6.42647 6.25803 6.0483 9.23338L5.92856 10.1754L5.12288 10.6781C3.81156 11.4962 3 12.927 3 14.5C3 16.8561 4.81833 18.8093 7.1517 18.9868L7.325 19H16.675L16.8483 18.9868ZM13 13V17H11V13H8L12 8L16 13H13Z"></path></svg>`;

      li.addEventListener("mouseenter", () => {
        const existingMenu = document.querySelector(".s1p-inline-action-menu");
        if (existingMenu) {
          existingMenu.dispatchEvent(new MouseEvent("mouseenter"));
        } else {
          activeMenu = createInlineActionMenu(
            li,
            [
              {
                label: `${pullIconSVG} <span>拉取</span>`,
                action: "pull",
                title:
                  "用云端备份覆盖您当前的本地数据，本地未同步的修改将丢失！",
                callback: handleForcePull,
              },
              {
                label: `${pushIconSVG} <span>推送</span>`,
                action: "push",
                title: "将您当前的本地数据覆盖到云端备份，此操作不可逆。",
                callback: handleForcePush,
              },
            ],
            () => {
              activeMenu = null;
            }
          );
        }
      });
    } else {
      // --- 模式1: 默认模式 (点击后智能判断) ---
      a.addEventListener("click", async (e) => {
        e.preventDefault();
        const icon = a.querySelector("svg");
        if (!icon || icon.classList.contains("s1p-syncing")) return;

        icon.classList.remove("s1p-sync-success", "s1p-sync-error");
        icon.classList.add("s1p-syncing");

        try {
          // 调用我们已优化的核心同步函数
          await handleManualSync();
          icon.classList.remove("s1p-syncing");
        } catch (error) {
          icon.classList.remove("s1p-syncing");
          console.error("S1 Plus: Manual sync handler threw an error:", error);
        } finally {
          setTimeout(() => {
            icon.classList.remove("s1p-sync-success", "s1p-sync-error");
            icon.style.transform = "";
          }, 1200);
        }
      });

      a.addEventListener("mouseover", (e) => {
        const popover = document.getElementById("s1p-generic-display-popover");
        if (popover && popover.s1p_api) {
          popover.s1p_api.show(e.currentTarget, "手动同步数据 (智能判断)");
        }
      });
      a.addEventListener("mouseout", () => {
        const popover = document.getElementById("s1p-generic-display-popover");
        if (popover && popover.s1p_api) {
          popover.s1p_api.hide();
        }
      });
    }

    managerLink.insertAdjacentElement("afterend", li);
  };

  const initializeNavbar = () => {
    const settings = getSettings();
    const navUl = document.querySelector("#nv > ul");
    if (!navUl) return;

    const createManagerLink = () => {
      const li = document.createElement("li");
      li.id = "s1p-nav-link";
      const a = document.createElement("a");
      a.href = "javascript:void(0);";
      a.textContent = "S1 Plus 设置";
      a.addEventListener("click", createManagementModal);
      li.appendChild(a);
      return li;
    };

    document.getElementById("s1p-nav-link")?.remove();
    document.getElementById("s1p-nav-sync-btn")?.remove();

    if (settings.enableNavCustomization) {
      navUl.innerHTML = "";
      (settings.customNavLinks || []).forEach((link) => {
        if (!link.name || !link.href) return;
        const li = document.createElement("li");
        if (window.location.href.includes(link.href)) li.className = "a";
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.name;
        a.setAttribute("hidefocus", "true");
        li.appendChild(a);
        navUl.appendChild(li);
      });
    }
    navUl.appendChild(createManagerLink());
    updateNavbarSyncButton();
  };

  // --- [NEW] Helper function for search component
  /**
   * Escapes special characters in a string for use in a regular expression.
   * @param {string} str The string to escape.
   * @returns {string} The escaped string.
   */
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Recursively finds and highlights text in a DOM node without breaking HTML.
   * @param {Node} node The starting DOM node.
   * @param {RegExp} regex The regex to match text with.
   */
  function highlightTextInNode(node, regex) {
    if (node.nodeType === 3) {
      // Text node
      const text = node.textContent;
      const matches = [...text.matchAll(regex)];
      if (matches.length > 0) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        matches.forEach((match) => {
          if (match.index > lastIndex) {
            fragment.appendChild(
              document.createTextNode(text.substring(lastIndex, match.index))
            );
          }
          const mark = document.createElement("mark");
          mark.className = "s1p-highlight";
          mark.textContent = match[0];
          fragment.appendChild(mark);
          lastIndex = match.index + match[0].length;
        });
        if (lastIndex < text.length) {
          fragment.appendChild(
            document.createTextNode(text.substring(lastIndex))
          );
        }
        node.parentNode.replaceChild(fragment, node);
      }
    } else if (
      node.nodeType === 1 &&
      node.childNodes &&
      !/^(script|style)$/i.test(node.tagName)
    ) {
      // Element node
      const children = Array.from(node.childNodes);
      for (const child of children) {
        highlightTextInNode(child, regex);
      }
    }
  }

  // [REPLACED] Bookmark search component with safe highlighting
  /**
   * Sets up the interactive search functionality for the bookmarks tab.
   * @param {HTMLElement} bookmarksTabElement The container element for the bookmarks tab.
   */
  function setupBookmarkSearchComponent(bookmarksTabElement) {
    const searchInput = bookmarksTabElement.querySelector(
      "#s1p-bookmark-search-input"
    );
    const clearButton = bookmarksTabElement.querySelector(
      "#s1p-bookmark-search-clear-btn"
    );
    const list = bookmarksTabElement.querySelector("#s1p-bookmarks-list");
    const noResultsMessage = bookmarksTabElement.querySelector(
      "#s1p-bookmarks-no-results"
    );
    const emptyMessage = bookmarksTabElement.querySelector(
      "#s1p-bookmarks-empty-message"
    );

    if (!searchInput || !list || !clearButton || !noResultsMessage) return;

    const allItems = Array.from(list.querySelectorAll(".s1p-item"));
    const itemCache = allItems.map((item) => {
      const contentEl = item.querySelector(".s1p-item-content");
      const metaEl = item.querySelector(".s1p-item-meta");

      // Store original HTML if not already stored
      if (!contentEl.dataset.originalHtml) {
        contentEl.dataset.originalHtml = contentEl.innerHTML;
      }
      if (!metaEl.dataset.originalHtml) {
        metaEl.dataset.originalHtml = metaEl.innerHTML;
      }

      return {
        element: item,
        searchableText: (
          contentEl.textContent +
          " " +
          metaEl.textContent
        ).toLowerCase(),
        contentEl: contentEl,
        metaEl: metaEl,
      };
    });

    const performSearch = () => {
      const query = searchInput.value.toLowerCase().trim();
      clearButton.classList.toggle("hidden", query.length === 0);

      const keywords = query.split(/\s+/).filter((k) => k);
      let visibleCount = 0;

      const highlightRegex =
        keywords.length > 0
          ? new RegExp(keywords.map(escapeRegExp).join("|"), "gi")
          : null;

      for (const item of itemCache) {
        const isVisible =
          keywords.length === 0 ||
          keywords.every((keyword) => item.searchableText.includes(keyword));

        // Reset highlights first by restoring original HTML
        item.contentEl.innerHTML = item.contentEl.dataset.originalHtml;
        item.metaEl.innerHTML = item.metaEl.dataset.originalHtml;
        item.element.style.display = isVisible ? "flex" : "none";

        if (isVisible) {
          visibleCount++;
          if (highlightRegex) {
            // Apply new, safe highlighting that only targets text nodes
            highlightTextInNode(item.contentEl, highlightRegex);
            highlightTextInNode(item.metaEl, highlightRegex);
          }
        }
      }

      const hasAnyItems = allItems.length > 0;
      list.style.display = hasAnyItems ? "flex" : "none";
      emptyMessage.style.display = !hasAnyItems ? "block" : "none";
      noResultsMessage.style.display =
        hasAnyItems && visibleCount === 0 && query.length > 0
          ? "block"
          : "none";
    };

    searchInput.addEventListener("input", performSearch);

    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      performSearch();
      searchInput.focus();
    });

    clearButton.classList.toggle("hidden", searchInput.value.length === 0);
  }

  // --- UI 创建 ---
  const formatDate = (timestamp) => new Date(timestamp).toLocaleString("zh-CN");

  let currentToast = null; // 用一个全局变量来管理当前的提示框实例

  /**
   * [MODIFIED] 显示消息，支持 true(成功)/false(失败)/null(中立) 三种状态
   * @param {string} message - 要显示的消息内容。
   * @param {boolean|null} isSuccess - 消息状态。
   */
  const showMessage = (message, isSuccess) => {
    // 如果上一个提示框还存在，立即移除，防止重叠
    if (currentToast) {
      currentToast.remove();
    }

    const toast = document.createElement("div");
    toast.textContent = message;

    // --- [核心修正] ---
    // 使用更完善的逻辑来处理三种状态
    let toastClass = "s1p-toast-notification";
    if (isSuccess === true) {
      toastClass += " success";
    } else if (isSuccess === false) {
      toastClass += " error";
    }
    // 如果 isSuccess 是 null 或 undefined，则不添加额外 class，显示默认的黑灰色样式
    toast.className = toastClass;
    // --- [修正结束] ---

    const modalContent = document.querySelector(".s1p-modal-content");
    if (modalContent) {
      modalContent.appendChild(toast);
    } else {
      document.body.appendChild(toast);
    }
    currentToast = toast;

    // 让动画生效
    setTimeout(() => {
      toast.classList.add("visible");
    }, 50);

    // 3秒后自动消失
    setTimeout(() => {
      toast.classList.remove("visible");
      toast.addEventListener(
        "transitionend",
        () => {
          if (toast.parentNode) {
            toast.remove();
          }
          if (currentToast === toast) {
            currentToast = null;
          }
        },
        { once: true }
      );
    }, 3000);
  };

  const createConfirmationModal = (
    title,
    subtitle,
    onConfirm,
    confirmText = "确定"
  ) => {
    document.querySelector(".s1p-confirm-modal")?.remove();
    const modal = document.createElement("div");
    modal.className = "s1p-confirm-modal";
    modal.innerHTML = `<div class="s1p-confirm-content"><div class="s1p-confirm-body"><div class="s1p-confirm-title">${title}</div><div class="s1p-confirm-subtitle">${subtitle}</div></div><div class="s1p-confirm-footer"><button class="s1p-confirm-btn s1p-cancel">取消</button><button class="s1p-confirm-btn s1p-confirm">${confirmText}</button></div></div>`;
    const closeModal = () => {
      modal.querySelector(".s1p-confirm-content").style.animation =
        "s1p-scale-out 0.25s ease-out forwards";
      modal.style.animation = "s1p-fade-out 0.25s ease-out forwards";
      setTimeout(() => modal.remove(), 250);
    };
    modal.querySelector(".s1p-confirm").addEventListener("click", () => {
      onConfirm();
      closeModal();
    });
    modal.querySelector(".s1p-cancel").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.body.appendChild(modal);
  };

  /**
   * [MODIFIED] 创建一个行内确认菜单 (V2: 带智能定位和动画)
   * @param {HTMLElement} anchorElement - 菜单定位的锚点元素
   * @param {string} confirmText - 确认提示文本
   * @param {Function} onConfirm - 点击确认后执行的回调函数
   */
  const createInlineConfirmMenu = (anchorElement, confirmText, onConfirm) => {
    document.querySelector(".s1p-inline-confirm-menu")?.remove();

    const menu = document.createElement("div");
    menu.className = "s1p-options-menu s1p-inline-confirm-menu";
    menu.style.width = "max-content";

    menu.innerHTML = `
            <div class="s1p-direct-confirm">
                <span>${confirmText}</span>
                <span class="s1p-confirm-separator"></span>
                <button class="s1p-confirm-action-btn s1p-cancel" title="取消"></button>
                <button class="s1p-confirm-action-btn s1p-confirm" title="确认"></button>
            </div>
        `;

    document.body.appendChild(menu);
    const anchorRect = anchorElement.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const top =
      anchorRect.top +
      window.scrollY +
      anchorRect.height / 2 -
      menuRect.height / 2;
    let left;

    const spaceOnRight = window.innerWidth - anchorRect.right;
    const requiredSpace = menuRect.width + 16;

    if (spaceOnRight >= requiredSpace) {
      left = anchorRect.right + window.scrollX + 8;
    } else {
      left = anchorRect.left + window.scrollX - menuRect.width - 8;
    }

    if (left < window.scrollX) {
      left = window.scrollX + 8;
    }

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;

    let isClosing = false;
    const closeMenu = () => {
      if (isClosing) return;
      isClosing = true;
      document.removeEventListener("click", closeMenu);
      menu.classList.remove("visible");

      setTimeout(() => {
        if (menu.parentNode) {
          menu.remove();
        }
      }, 200);
    };

    menu.querySelector(".s1p-confirm").addEventListener("click", (e) => {
      e.stopPropagation();
      onConfirm();
      closeMenu();
    });

    menu.querySelector(".s1p-cancel").addEventListener("click", (e) => {
      e.stopPropagation();
      closeMenu();
    });

    requestAnimationFrame(() => {
      menu.classList.add("visible");
    });

    setTimeout(() => {
      document.addEventListener("click", closeMenu, { once: true });
    }, 0);
  };

  const removeProgressJumpButtons = () =>
    document
      .querySelectorAll(".s1p-progress-container")
      .forEach((el) => el.remove());
  const removeBlockButtonsFromThreads = () =>
    document.querySelectorAll(".s1p-options-cell").forEach((el) => el.remove());

  const refreshUserPostsOnPage = (userId) => {
    if (!userId) return;
    document
      .querySelectorAll(`.authi a[href*="space-uid-${userId}"]`)
      .forEach((userLink) => {
        const postTable = userLink.closest('table[id^="pid"]');
        if (postTable) {
          const postId = postTable.id.replace("pid", "");
          refreshSinglePostActions(postId);
        }
      });
  };
  // [最终版] 用于移动Tabs滑块的辅助函数
  const moveTabSlider = (tabContainer) => {
    if (!tabContainer) return;
    const slider = tabContainer.querySelector(".s1p-tab-slider");
    const activeTab = tabContainer.querySelector(".s1p-tab-btn.active");

    if (slider && activeTab) {
      // --- [核心修正] 动画参数现在由JS直接控制 ---
      // 您可以在这里轻松修改动画时长，单位是秒(s)
      const animationDuration = "0.45s";
      const animationEasing = "cubic-bezier(0.4, 0, 0.2, 1)";
      // ---------------------------------------------

      const newWidth = activeTab.offsetWidth;
      const newLeft = activeTab.offsetLeft;

      // 1. 在下一帧，立即为滑块应用过渡动画效果
      requestAnimationFrame(() => {
        slider.style.transition = `width ${animationDuration} ${animationEasing}, transform ${animationDuration} ${animationEasing}`;

        // 2. 紧接着，设置滑块的目标宽度和位置，这将触发动画
        slider.style.width = `${newWidth}px`;
        slider.style.transform = `translateX(${newLeft}px)`;
      });

      // 3. [优化] 监听动画结束事件，结束后移除内联的 transition 样式
      // 这样做的好处是，将控制权交还给CSS，避免潜在的样式冲突，是更规范的做法。
      slider.addEventListener(
        "transitionend",
        () => {
          slider.style.transition = "";
        },
        { once: true }
      ); // { once: true } 确保事件只触发一次后自动移除
    }
  };
  const createManagementModal = () => {
    const calculateModalWidth = () => {
      const measureContainer = document.createElement("div");
      measureContainer.style.cssText =
        "position: absolute; left: -9999px; top: -9999px; visibility: hidden; pointer-events: none;";

      const tabsDiv = document.createElement("div");
      tabsDiv.className = "s1p-tabs";
      tabsDiv.style.display = "inline-flex";
      tabsDiv.innerHTML = `
                <button class="s1p-tab-btn">通用设置</button>
                <button class="s1p-tab-btn">帖子屏蔽</button>
                <button class="s1p-tab-btn">用户屏蔽</button>
                <button class="s1p-tab-btn">用户标记</button>
                <button class="s1p-tab-btn">回复收藏</button>
                <button class="s1p-tab-btn">导航栏定制</button>
                <button class="s1p-tab-btn">设置同步</button>
            `;
      measureContainer.appendChild(tabsDiv);
      document.body.appendChild(measureContainer);

      let totalTabsWidth = 0;
      tabsDiv.querySelectorAll(".s1p-tab-btn").forEach((btn) => {
        const style = window.getComputedStyle(btn);
        totalTabsWidth +=
          btn.offsetWidth +
          parseFloat(style.marginLeft) +
          parseFloat(style.marginRight);
      });
      document.body.removeChild(measureContainer);

      return totalTabsWidth + 32; // 32px for padding
    };
    const requiredWidth = calculateModalWidth();
    document.querySelector(".s1p-modal")?.remove();

    const modal = document.createElement("div");
    modal.className = "s1p-modal";
    modal.style.opacity = "0";
    modal.innerHTML = `<div class="s1p-modal-content">
            <div class="s1p-modal-header"><div class="s1p-modal-title">S1 Plus 设置</div><div class="s1p-modal-close"></div></div>
            <div class="s1p-modal-body">
                <div class="s1p-tabs-wrapper">
                    <div class="s1p-tabs">
                        <div class="s1p-tab-slider"></div>
                        <button class="s1p-tab-btn active" data-tab="general-settings">通用设置</button>
                        <button class="s1p-tab-btn" data-tab="threads">帖子屏蔽</button>
                        <button class="s1p-tab-btn" data-tab="users">用户屏蔽</button>
                        <button class="s1p-tab-btn" data-tab="tags">用户标记</button>
                        <button class="s1p-tab-btn" data-tab="bookmarks">回复收藏</button>
                        <button class="s1p-tab-btn" data-tab="nav-settings">导航栏定制</button>
                        <button class="s1p-tab-btn" data-tab="sync">设置同步</button>
                    </div>
                </div>
                <div id="s1p-tab-general-settings" class="s1p-tab-content active"></div>
                <div id="s1p-tab-threads" class="s1p-tab-content"></div>
                <div id="s1p-tab-users" class="s1p-tab-content"></div>
                <div id="s1p-tab-tags" class="s1p-tab-content"></div>
                <div id="s1p-tab-bookmarks" class="s1p-tab-content"></div>
                <div id="s1p-tab-nav-settings" class="s1p-tab-content"></div>
                <div id="s1p-tab-sync" class="s1p-tab-content">
                    <div class="s1p-settings-group">
                        <div class="s1p-settings-group-title s1p-settings-section-title-label">本地备份与恢复</div>
                        <div class="s1p-local-sync-desc">通过手动复制/粘贴数据，在不同浏览器或设备间迁移或备份你的所有S1 Plus配置，包括屏蔽列表、导航栏、阅读进度和各项开关设置。</div>
                        <div class="s1p-local-sync-buttons">
                            <button id="s1p-local-export-btn" class="s1p-btn">导出数据</button>
                            <button id="s1p-local-import-btn" class="s1p-btn">导入数据</button>
                        </div>
                        <textarea id="s1p-local-sync-textarea" class="s1p-input s1p-textarea s1p-sync-textarea" placeholder="在此粘贴导入数据或从此处复制导出数据" autocomplete="off"></textarea>
                    </div>

                    <div class="s1p-settings-group">
                        <div class="s1p-settings-group-title s1p-settings-section-title-label">远程同步 (通过GitHub Gist)</div>
                        <div id="s1p-last-sync-time-container" class="s1p-setting-desc" style="margin-top: -8px; margin-bottom: 16px;"></div>
                        <div class="s1p-settings-item">
                            <label class="s1p-settings-label" for="s1p-remote-enabled-toggle">启用远程同步</label>
                            <label class="s1p-switch">
                                <input type="checkbox" id="s1p-remote-enabled-toggle" class="s1p-settings-checkbox">
                                <span class="s1p-slider"></span>
                            </label>
                        </div>
                         <p class="s1p-setting-desc">启用后，你可以在导航栏手动同步，或开启下面的自动同步。</p>

                        <div id="s1p-remote-sync-controls-wrapper">
                            <div class="s1p-settings-item">
                                <label class="s1p-settings-label" for="s1p-daily-first-load-sync-enabled-toggle">启用每日首次加载时同步</label>
                                <label class="s1p-switch">
                                    <input type="checkbox" id="s1p-daily-first-load-sync-enabled-toggle" class="s1p-settings-checkbox" data-s1p-sync-control>
                                    <span class="s1p-slider"></span>
                                </label>
                            </div>
                            <p class="s1p-setting-desc">启用后，每天第一次打开论坛时会自动检查并同步数据。此功能独立于下方的“自动后台同步”。</p>
                            
                            <div class="s1p-settings-sub-group">
                                <div class="s1p-settings-item">
                                    <label class="s1p-settings-label" for="s1p-force-pull-on-startup-toggle">启动时强制拉取云端数据</label>
                                    <label class="s1p-switch">
                                        <input type="checkbox" id="s1p-force-pull-on-startup-toggle" class="s1p-settings-checkbox" data-setting="syncForcePullOnStartup" data-s1p-sync-control>
                                        <span class="s1p-slider"></span>
                                    </label>
                                </div>
                                <p class="s1p-setting-desc s1p-warning-text">开启后，每日首次加载时若检测到云端与本地数据不一致，将总是使用云端数据覆盖本地，不再进行提示。请谨慎开启，这可能导致本地未同步的修改丢失。</p>
                            </div>
                            <div class="s1p-settings-item">
                                <label class="s1p-settings-label" for="s1p-auto-sync-enabled-toggle">启用自动后台同步</label>
                                <label class="s1p-switch">
                                    <input type="checkbox" id="s1p-auto-sync-enabled-toggle" class="s1p-settings-checkbox" data-s1p-sync-control>
                                    <span class="s1p-slider"></span>
                                </label>
                            </div>
                            <p class="s1p-setting-desc">启用后，数据将在停止操作5秒后自动同步。关闭后将切换为纯手动同步模式。</p>
                            <div class="s1p-settings-item">
                                <label class="s1p-settings-label" for="s1p-direct-choice-mode-toggle">启用手动同步高级模式 (悬停选择)</label>
                                <label class="s1p-switch">
                                    <input type="checkbox" id="s1p-direct-choice-mode-toggle" class="s1p-settings-checkbox" data-setting="syncDirectChoiceMode">
                                    <span class="s1p-slider"></span>
                                </label>
                            </div>
                            <p class="s1p-setting-desc">关闭时，点击同步按钮将智能判断；开启时，悬停同步按钮可直接选择推送或拉取。</p>
                            <div class="s1p-settings-item" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                                <label class="s1p-settings-label" for="s1p-remote-gist-id-input">Gist ID</label>
                                <input type="text" id="s1p-remote-gist-id-input" class="s1p-input" placeholder="从 Gist 网址中复制的那一长串 ID" style="width: 100%;" autocomplete="off" data-s1p-sync-control>
                            </div>
                            <div class="s1p-settings-item" style="flex-direction: column; align-items: flex-start; gap: 4px; margin-top: 12px;">
                                <label class="s1p-settings-label" for="s1p-remote-pat-input">GitHub Personal Access Token (PAT)</label>
                                <input type="password" id="s1p-remote-pat-input" class="s1p-input" placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" style="width: 100%;" autocomplete="new-password" data-s1p-sync-control>
                            </div>
                            <div class="s1p-notice">
                                <div class="s1p-notice-icon"></div>
                                <div class="s1p-notice-content">
                                    <a href="https://silver-s1plus.netlify.app/" target="_blank">点击此处查看设置教程</a>
                                    <p>Token只会保存在你的浏览器本地，不会上传到任何地方。</p>
                                </div>
                            </div>
                            <div class="s1p-editor-footer" style="margin-top: 16px; justify-content: flex-end; gap: 8px;">
                                 <button id="s1p-remote-save-btn" class="s1p-btn" data-s1p-sync-control>保存设置</button>
                                 <button id="s1p-remote-manual-sync-btn" class="s1p-btn" data-s1p-sync-control>手动同步</button>
                                 <button id="s1p-open-gist-page-btn" class="s1p-btn" data-s1p-sync-control>打开 Gist 页面</button>
                            </div>
                        </div>
                    </div>

                    <div class="s1p-sync-title">危险操作</div>
                    <div class="s1p-local-sync-desc">以下操作会立即清空脚本在<b>当前浏览器</b>中的所选数据，且无法撤销。请在操作前务必通过“导出数据”功能进行备份。</div>
                    <div id="s1p-clear-data-options" style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; background-color: var(--s1p-bg); border: 1px solid var(--s1p-pri); border-radius: 6px; padding: 12px;">
                        </div>
                    <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <label class="s1p-settings-label" for="s1p-clear-select-all">全选</label>
                            <label class="s1p-switch">
                                <input type="checkbox" id="s1p-clear-select-all">
                                <span class="s1p-slider"></span>
                            </label>
                        </div>
                        <button id="s1p-clear-selected-btn" class="s1p-btn s1p-red-btn">清除选中数据</button>
                    </div>
                </div>
            </div>
            <div class="s1p-modal-footer">版本: ${SCRIPT_VERSION} (${SCRIPT_RELEASE_DATE})</div>
        </div>`;

    const modalContent = modal.querySelector(".s1p-modal-content");
    if (requiredWidth > 600) {
      modalContent.style.width = `${requiredWidth}px`;
    }

    document.body.appendChild(modal);
    updateLastSyncTimeDisplay();

    const tabs = {
      "general-settings": modal.querySelector("#s1p-tab-general-settings"),
      threads: modal.querySelector("#s1p-tab-threads"),
      users: modal.querySelector("#s1p-tab-users"),
      tags: modal.querySelector("#s1p-tab-tags"),
      bookmarks: modal.querySelector("#s1p-tab-bookmarks"),
      "nav-settings": modal.querySelector("#s1p-tab-nav-settings"),
      sync: modal.querySelector("#s1p-tab-sync"),
    };
    const dataClearanceConfig = {
      blockedThreads: {
        label: "手动屏蔽的帖子和用户主题帖",
        clear: () => saveBlockedThreads({}),
      },
      blockedUsers: {
        label: "屏蔽的用户列表",
        clear: () => saveBlockedUsers({}),
      },
      userTags: { label: "全部用户标记", clear: () => saveUserTags({}) },
      titleFilterRules: {
        label: "标题关键字屏蔽规则",
        clear: () => {
          saveTitleFilterRules([]);
          GM_setValue("s1p_title_keywords", null);
        },
      },
      readProgress: {
        label: "所有帖子阅读进度",
        clear: () => saveReadProgress({}),
      },
      bookmarkedReplies: {
        label: "收藏的回复",
        clear: () => saveBookmarkedReplies({}),
      },
      settings: {
        label: "界面、导航栏及其他设置",
        clear: () => saveSettings(defaultSettings),
      },
    };
    const clearDataOptionsContainer = modal.querySelector(
      "#s1p-clear-data-options"
    );
    if (clearDataOptionsContainer) {
      clearDataOptionsContainer.innerHTML = Object.keys(dataClearanceConfig)
        .map(
          (key) => `
                <div class="s1p-settings-item" style="padding: 8px 0;">
                    <label class="s1p-settings-label" for="s1p-clear-chk-${key}">${dataClearanceConfig[key].label}</label>
                    <label class="s1p-switch">
                        <input type="checkbox" class="s1p-clear-data-checkbox" id="s1p-clear-chk-${key}" data-clear-key="${key}">
                        <span class="s1p-slider"></span>
                    </label>
                </div>
            `
        )
        .join("");
    }

    const remoteToggle = modal.querySelector("#s1p-remote-enabled-toggle");
    const controlsWrapper = modal.querySelector(
      "#s1p-remote-sync-controls-wrapper"
    );
    const updateRemoteSyncInputsState = () => {
      const isMasterEnabled = remoteToggle.checked;
      controlsWrapper.classList.toggle("is-disabled", !isMasterEnabled);
      controlsWrapper
        .querySelectorAll("[data-s1p-sync-control]")
        .forEach((el) => {
          el.disabled = !isMasterEnabled;
        });
    };

    // [MODIFIED] Start of changes
    const dailySyncToggle = modal.querySelector(
      "#s1p-daily-first-load-sync-enabled-toggle"
    );
    const forcePullWrapper = modal.querySelector(
      "#s1p-tab-sync .s1p-settings-sub-group"
    );
    const forcePullToggle = modal.querySelector(
      "#s1p-force-pull-on-startup-toggle"
    );

    const updateForcePullState = () => {
      const isDailySyncEnabled = dailySyncToggle.checked;
      if (isDailySyncEnabled) {
        forcePullWrapper.style.opacity = "1";
        forcePullWrapper.style.pointerEvents = "auto";
        forcePullToggle.disabled = false;
      } else {
        forcePullWrapper.style.opacity = "0.5";
        forcePullWrapper.style.pointerEvents = "none";
        forcePullToggle.checked = false;
        forcePullToggle.disabled = true;
        // 触发一次change事件以确保设置能被保存
        forcePullToggle.dispatchEvent(new Event("change"));
      }
    };

    dailySyncToggle.addEventListener("change", updateForcePullState);
    // End of changes

    const settings = getSettings();
    remoteToggle.checked = settings.syncRemoteEnabled;
    const directChoiceModeToggle = modal.querySelector(
      "#s1p-direct-choice-mode-toggle"
    );
    if (directChoiceModeToggle) {
      directChoiceModeToggle.checked = settings.syncDirectChoiceMode;
      directChoiceModeToggle.addEventListener("change", (e) => {
        const currentSettings = getSettings();
        currentSettings.syncDirectChoiceMode = e.target.checked;
        saveSettings(currentSettings);
        initializeNavbar();
      });
    }

    modal.querySelector("#s1p-daily-first-load-sync-enabled-toggle").checked =
      settings.syncDailyFirstLoad;
    modal.querySelector("#s1p-auto-sync-enabled-toggle").checked =
      settings.syncAutoEnabled;
    modal.querySelector("#s1p-force-pull-on-startup-toggle").checked =
      settings.syncForcePullOnStartup;
    modal.querySelector("#s1p-remote-gist-id-input").value =
      settings.syncRemoteGistId || "";
    modal.querySelector("#s1p-remote-pat-input").value =
      settings.syncRemotePat || "";

    remoteToggle.addEventListener("change", updateRemoteSyncInputsState);
    updateRemoteSyncInputsState();
    updateForcePullState(); // [MODIFIED] 初始化子选项的状态

    const renderTagsTab = (options = {}) => {
      const editingUserId = options.editingUserId;
      const settings = getSettings();
      const isEnabled = settings.enableUserTagging;

      const toggleHTML = `
                <div class="s1p-settings-group">
                    <div class="s1p-settings-item" style="padding: 0; padding-bottom: 16px; border-bottom: 1px solid var(--s1p-pri);">
                        <label class="s1p-settings-label s1p-settings-section-title-label" for="s1p-enableUserTagging">启用用户标记功能</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-enableUserTagging" data-feature="enableUserTagging" class="s1p-feature-toggle" ${
                          isEnabled ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                </div>
            `;
      const userTags = getUserTags();
      const tagItems = Object.entries(userTags).sort(
        ([, a], [, b]) => (b.timestamp || 0) - (a.timestamp || 0)
      );
      const contentHTML = `
                <div class="s1p-settings-group">
                    <div class="s1p-sync-title">用户标记管理</div>
                    <p class="s1p-setting-desc" style="margin-top: 0; margin-bottom: 16px;">
                        在此集中管理、编辑、导出或导入您为所有用户添加的标记。
                    </p>
                    <div class="s1p-local-sync-buttons">
                        <button id="s1p-export-tags-btn" class="s1p-btn">导出全部标记</button>
                        <button id="s1p-import-tags-btn" class="s1p-btn">导入标记</button>
                    </div>
                    <textarea id="s1p-tags-sync-textarea" class="s1p-input s1p-textarea s1p-sync-textarea" placeholder="在此粘贴导入数据或从此处复制导出数据..." autocomplete="off"></textarea>
                </div>

                <div class="s1p-settings-group">
                    <div id="s1p-tags-list-container">
                        ${
                          tagItems.length === 0
                            ? `<div class="s1p-empty">暂无用户标记</div>`
                            : `<div class="s1p-list">${tagItems
                                .map(([id, data]) => {
                                  if (id === editingUserId) {
                                    return `
                                <div class="s1p-item" data-user-id="${id}">
                                    <div class="s1p-item-info">
                                        <div class="s1p-item-title">${data.name}</div>
                                        <div class="s1p-item-meta">
                                            ID: <span class="s1p-item-meta-id">${id}</span>
                                        </div>
                                        <div class="s1p-item-editor">
                                            <textarea class="s1p-input s1p-textarea s1p-tag-edit-area" autocomplete="off">${data.tag}</textarea>
                                        </div>
                                    </div>
                                    <div class="s1p-item-actions">
                                        <button class="s1p-btn s1p-primary" data-action="save-tag-edit" data-user-id="${id}" data-user-name="${data.name}">保存</button>
                                        <button class="s1p-btn" data-action="cancel-tag-edit">取消</button>
                                    </div>
                                </div>`;
                                  } else {
                                    return `
                                <div class="s1p-item" data-user-id="${id}">
                                    <div class="s1p-item-info">
                                        <div class="s1p-item-title">${
                                          data.name
                                        }</div>
                                        <div class="s1p-item-meta">
                                            ID: <span class="s1p-item-meta-id">${id}</span> &nbsp;
                                            标记于: ${formatDate(
                                              data.timestamp
                                            )}
                                        </div>
                                        <div class="s1p-item-content">用户标记：${
                                          data.tag
                                        }</div>
                                    </div>
                                    <div class="s1p-item-actions">
                                        <button class="s1p-btn" data-action="edit-tag-item" data-user-id="${id}">编辑</button>
                                        <button class="s1p-btn s1p-danger" data-action="delete-tag-item" data-user-id="${id}" data-user-name="${
                                      data.name
                                    }">删除</button>
                                    </div>
                                </div>`;
                                  }
                                })
                                .join("")}</div>`
                        }
                    </div>
                </div>
            `;
      tabs["tags"].innerHTML = `
                ${toggleHTML}
                <div class="s1p-feature-content ${isEnabled ? "expanded" : ""}">
                    <div>${contentHTML}</div>
                </div>
            `;
      if (editingUserId) {
        const textarea = tabs["tags"].querySelector(".s1p-tag-edit-area");
        if (textarea) {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd =
            textarea.value.length;
        }
      }
    };
    const renderBookmarksTab = () => {
      const settings = getSettings();
      const isEnabled = settings.enableBookmarkReplies;

      const toggleHTML = `
                <div class="s1p-settings-group">
                    <div class="s1p-settings-item" style="padding: 0; padding-bottom: 16px; border-bottom: 1px solid var(--s1p-pri);">
                        <label class="s1p-settings-label s1p-settings-section-title-label" for="s1p-enableBookmarkReplies">启用回复收藏功能</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-enableBookmarkReplies" data-feature="enableBookmarkReplies" class="s1p-feature-toggle" ${
                          isEnabled ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                </div>
            `;
      const bookmarkedReplies = getBookmarkedReplies();
      const bookmarkItems = Object.values(bookmarkedReplies).sort(
        (a, b) => b.timestamp - a.timestamp
      );

      const hasBookmarks = bookmarkItems.length > 0;
      const contentHTML = `
                ${
                  hasBookmarks
                    ? `
                <div class="s1p-settings-group" style="margin-bottom: 16px;">
                    <div class="s1p-search-input-wrapper">
                        <input type="text" id="s1p-bookmark-search-input" class="s1p-input" placeholder="搜索内容、作者、标题..." autocomplete="off">
                        <svg class="s1p-search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                        <button id="s1p-bookmark-search-clear-btn" class="s1p-search-clear-btn hidden" title="清空搜索" aria-label="清空搜索">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                        </button>
                    </div>
                </div>`
                    : ""
                }
                <div class="s1p-settings-group">
                    <div id="s1p-bookmarks-list-container">
                        ${
                          !hasBookmarks
                            ? `<div id="s1p-bookmarks-empty-message" class="s1p-empty">暂无收藏的回复</div>`
                            : `<div class="s1p-list" id="s1p-bookmarks-list">
                            ${bookmarkItems
                              .map((item) => {
                                const fullText = item.postContent || "";
                                const isLong = fullText.length > 150;
                                let contentBlock;
                                if (isLong) {
                                  const previewText = fullText.substring(
                                    0,
                                    150
                                  );
                                  contentBlock = `<div class="s1p-bookmark-preview"><span>${previewText}... </span><a href="javascript:void(0);" class="s1p-bookmark-toggle" data-action="toggle-bookmark-content">查看完整回复</a></div><div class="s1p-bookmark-full" style="display: none;"><span>${fullText} </span><a href="javascript:void(0);" class="s1p-bookmark-toggle" data-action="toggle-bookmark-content">收起</a></div>`;
                                } else {
                                  contentBlock = `<div class="s1p-bookmark-preview"><span>${fullText}</span></div>`;
                                }
                                return `
                            <div class="s1p-item" data-post-id="${
                              item.postId
                            }" style="position: relative;">
                                <button class="s1p-btn s1p-danger" data-action="remove-bookmark" data-post-id="${
                                  item.postId
                                }" style="position: absolute; top: 12px; right: 12px; padding: 4px 8px;">取消收藏</button>
                                <div class="s1p-item-info" style="width: 100%; padding-right: 100px;">
                                    <div class="s1p-item-content">${contentBlock}</div>
                                    <div class="s1p-item-meta" style="margin-top: 10px;">
                                        <strong>${
                                          item.authorName
                                        }</strong> · 收藏于: ${formatDate(
                                  item.timestamp
                                )}
                                        <div class="s1p-bookmark-meta-line">
                                          <span>来自：</span>
                                          <a class="s1p-bookmark-thread-link" href="forum.php?mod=redirect&goto=findpost&ptid=${
                                            item.threadId
                                          }&pid=${
                                  item.postId
                                }" target="_blank" title="${item.threadTitle}">
                                            <span class="s1p-bookmark-title-text">${
                                              item.threadTitle
                                            }</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                          </a>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                              })
                              .join("")}
                        </div>`
                        }
                    </div>
                    <div id="s1p-bookmarks-no-results" class="s1p-empty" style="display: none;">没有找到匹配的收藏</div>
                </div>
            `;
      tabs["bookmarks"].innerHTML = `
                ${toggleHTML}
                <div class="s1p-feature-content ${isEnabled ? "expanded" : ""}">
                    <div>${contentHTML}</div>
                </div>
            `;
      tabs["bookmarks"].addEventListener("click", (e) => {
        const toggleLink = e.target.closest(
          '[data-action="toggle-bookmark-content"]'
        );
        if (toggleLink) {
          e.preventDefault();
          e.stopPropagation();
          const contentItem = toggleLink.closest(".s1p-item-content");
          if (!contentItem) return;
          const preview = contentItem.querySelector(".s1p-bookmark-preview");
          const full = contentItem.querySelector(".s1p-bookmark-full");
          if (!preview || !full) return;

          const isCurrentlyCollapsed =
            window.getComputedStyle(full).display === "none";
          if (isCurrentlyCollapsed) {
            full.style.display = "block";
            preview.style.display = "none";
          } else {
            full.style.display = "none";
            preview.style.display = "block";
          }
        }
      });
      if (hasBookmarks) {
        setupBookmarkSearchComponent(tabs["bookmarks"]);
      }
    };
    const renderUserTab = () => {
      const settings = getSettings();
      const isEnabled = settings.enableUserBlocking;

      const toggleHTML = `
                <div class="s1p-settings-group">
                    <div class="s1p-settings-item" style="padding: 0; padding-bottom: 16px; border-bottom: 1px solid var(--s1p-pri);">
                        <label class="s1p-settings-label s1p-settings-section-title-label" for="s1p-enableUserBlocking">启用用户屏蔽功能</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-enableUserBlocking" data-feature="enableUserBlocking" class="s1p-feature-toggle" ${
                          isEnabled ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                </div>
            `;
      const blockedUsers = getBlockedUsers();
      const userItemIds = Object.keys(blockedUsers).sort(
        (a, b) => blockedUsers[b].timestamp - blockedUsers[a].timestamp
      );
      const contentHTML = `
                <div class="s1p-settings-group" style="margin-bottom: 16px; padding-bottom: 0;">
                    <div class="s1p-settings-item">
                        <label class="s1p-settings-label" for="s1p-blockThreadsOnUserBlock">屏蔽用户时，默认屏蔽其所有主题帖</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-blockThreadsOnUserBlock" class="s1p-settings-checkbox" ${
                          settings.blockThreadsOnUserBlock ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div> 
                    <p class="s1p-setting-desc" style="margin-top: 8px; margin-bottom: 16px;">
                        <strong>提示</strong>：顶部总开关仅影响<strong>未来新屏蔽用户</strong>的默认设置。每个用户下方的独立开关，才是控制该用户主题帖的<strong>最终开关</strong>，拥有最高优先级。
                    </p>                   
                    <div class="s1p-settings-item" style="margin-top: 8px;">
                        <label class="s1p-settings-label" for="s1p-syncWithNativeBlacklist">同步至论坛黑名单</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-syncWithNativeBlacklist" class="s1p-settings-checkbox" data-setting="syncWithNativeBlacklist" ${
                          settings.syncWithNativeBlacklist ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>

                    <p class="s1p-setting-desc" style="margin-top: 8px; margin-bottom: 16px;">
                        <strong>提示</strong>：开启“同步至论坛黑名单”后，新屏蔽的用户会同时加入论坛黑名单。
                    </p>
                </div>
                <div class="s1p-settings-group">
                    <div id="s1p-blocked-user-list-container">
                        ${
                          userItemIds.length === 0
                            ? `<div class="s1p-empty">暂无屏蔽的用户</div>`
                            : `<div class="s1p-list">${userItemIds
                                .map((id) => {
                                  const item = blockedUsers[id];
                                  // [新增] 根据标记生成状态提示
                                  const syncStatusHtml =
                                    item.addedToNativeBlacklist === true
                                      ? '<span class="s1p-native-sync-status">已同步至论坛黑名单</span>'
                                      : "";
                                  return `<div class="s1p-item" data-user-id="${id}"><div class="s1p-item-info"><div class="s1p-item-title">${
                                    item.name || `用户 #${id}`
                                  }${syncStatusHtml}</div><div class="s1p-item-meta">屏蔽时间: ${formatDate(
                                    item.timestamp
                                  )}</div><div class="s1p-item-toggle"><label class="s1p-switch"><input type="checkbox" class="s1p-user-thread-block-toggle" data-user-id="${id}" ${
                                    item.blockThreads ? "checked" : ""
                                  }><span class="s1p-slider"></span></label><span>屏蔽该用户的主题帖</span></div></div><button class="s1p-unblock-btn s1p-btn" data-unblock-user-id="${id}">取消屏蔽</button></div>`;
                                })
                                .join("")}</div>`
                        }
                    </div>
                </div>
            `;
      tabs["users"].innerHTML = `
                ${toggleHTML}
                <div class="s1p-feature-content ${isEnabled ? "expanded" : ""}">
                    <div>${contentHTML}</div>
                </div>
            `;
    };
    const renderThreadTab = () => {
      const settings = getSettings();
      const isEnabled = settings.enablePostBlocking;

      const toggleHTML = `
                <div class="s1p-settings-group">
                    <div class="s1p-settings-item" style="padding: 0; padding-bottom: 16px; border-bottom: 1px solid var(--s1p-pri);">
                        <label class="s1p-settings-label s1p-settings-section-title-label" for="s1p-enablePostBlocking">启用帖子屏蔽功能</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-enablePostBlocking" data-feature="enablePostBlocking" class="s1p-feature-toggle" ${
                          isEnabled ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                </div>
            `;
      const blockedThreads = getBlockedThreads();
      const manualItemIds = Object.keys(blockedThreads).sort(
        (a, b) => blockedThreads[b].timestamp - blockedThreads[a].timestamp
      );
      const contentHTML = `
                <div class="s1p-settings-group">
                    <div class="s1p-settings-group-title">标题关键字屏蔽规则</div>
                    <p class="s1p-setting-desc">将自动屏蔽标题匹配已启用规则的帖子，支持正则表达式。修改后请点击“保存规则”以生效。</p>
                    <div id="s1p-keyword-rules-list" style="display: flex; flex-direction: column; gap: 8px;"></div>
                    <div class="s1p-editor-footer" style="justify-content: flex-start; gap: 8px;">
                         <button id="s1p-keyword-rule-add-btn" class="s1p-btn">添加新规则</button>
                         <button id="s1p-keyword-rules-save-btn" class="s1p-btn">保存规则</button>
                    </div>
                </div>

                <div class="s1p-settings-group">
                    <div id="s1p-blocked-by-keyword-header" class="s1p-settings-group-title s1p-collapsible-header">
                        <span>关键字/规则的屏蔽帖子列表</span>
                        <span class="s1p-expander-arrow ${
                          settings.showBlockedByKeywordList ? "expanded" : ""
                        }"></span>
                    </div>
                    <div id="s1p-dynamically-hidden-list-container" class="s1p-collapsible-content ${
                      settings.showBlockedByKeywordList ? "expanded" : ""
                    }">
                        <div id="s1p-dynamically-hidden-list"></div>
                    </div>
                </div>

                <div class="s1p-settings-group">
                     <div id="s1p-manually-blocked-header" class="s1p-settings-group-title s1p-collapsible-header">
                        <span>手动屏蔽的帖子列表</span>
                        <span class="s1p-expander-arrow ${
                          settings.showManuallyBlockedList ? "expanded" : ""
                        }"></span>
                    </div>
                    <div id="s1p-manually-blocked-list-container" class="s1p-collapsible-content ${
                      settings.showManuallyBlockedList ? "expanded" : ""
                    }">
                    <div>
                    ${
                      manualItemIds.length === 0
                        ? `<div class="s1p-empty">暂无手动屏蔽的帖子</div>`
                        : `<div class="s1p-list">${manualItemIds
                            .map((id) => {
                              const item = blockedThreads[id];
                              return `<div class="s1p-item" data-thread-id="${id}"><div class="s1p-item-info"><div class="s1p-item-title">${
                                item.title || `帖子 #${id}`
                              }</div><div class="s1p-item-meta">屏蔽时间: ${formatDate(
                                item.timestamp
                              )} ${
                                item.reason && item.reason !== "manual"
                                  ? `(因屏蔽用户${item.reason.replace(
                                      "user_",
                                      ""
                                    )})`
                                  : ""
                              }</div></div><button class="s1p-unblock-btn s1p-btn" data-unblock-thread-id="${id}">取消屏蔽</button></div>`;
                            })
                            .join("")}</div>`
                    }
                    </div>
                    </div>
                </div>
            `;

      tabs["threads"].innerHTML = `
                ${toggleHTML}
                <div class="s1p-feature-content ${isEnabled ? "expanded" : ""}">
                    <div>${contentHTML}</div>
                </div>
            `;

      const renderDynamicallyHiddenList = () => {
        const listContainer = tabs["threads"].querySelector(
          "#s1p-dynamically-hidden-list"
        );
        const hiddenItems = Object.entries(dynamicallyHiddenThreads);
        if (hiddenItems.length === 0) {
          listContainer.innerHTML = `<div class="s1p-empty" style="padding-top: 12px;">当前页面没有被关键字屏蔽的帖子</div>`;
        } else {
          listContainer.innerHTML = `<div class="s1p-list">${hiddenItems
            .map(
              ([id, item]) => `
                        <div class="s1p-item" data-thread-id="${id}">
                            <div class="s1p-item-info">
                                <div class="s1p-item-title" title="${item.title}">${item.title}</div>
                                <div class="s1p-item-meta">匹配规则: <code style="background: var(--s1p-code-bg); padding: 2px 4px; border-radius: 3px;">${item.pattern}</code></div>
                            </div>
                        </div>
                    `
            )
            .join("")}</div>`;
        }
      };
      const renderRules = () => {
        const rules = getTitleFilterRules();
        const container = tabs["threads"].querySelector(
          "#s1p-keyword-rules-list"
        );
        if (!container) return;
        container.innerHTML = rules
          .map(
            (rule) => `
                    <div class="s1p-editor-item" data-rule-id="${rule.id}">
                        <label class="s1p-switch"><input type="checkbox" class="s1p-settings-checkbox s1p-keyword-rule-enable" ${
                          rule.enabled ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                        <input type="text" class="s1p-input s1p-keyword-rule-pattern" placeholder="输入关键字或正则表达式" value="${
                          rule.pattern || ""
                        }" autocomplete="off">
                        <div class="s1p-editor-item-controls">
                            <button class="s1p-editor-btn s1p-delete-button" data-action="delete" title="删除规则"></button>
                        </div>
                    </div>
                `
          )
          .join("");
        if (rules.length === 0) {
          container.innerHTML = `<div class="s1p-empty" style="padding: 12px;">暂无规则</div>`;
        }
      };

      renderRules();
      renderDynamicallyHiddenList();
      const saveKeywordRules = () => {
        const newRules = [];
        tabs["threads"]
          .querySelectorAll("#s1p-keyword-rules-list .s1p-editor-item")
          .forEach((item) => {
            const pattern = item
              .querySelector(".s1p-keyword-rule-pattern")
              .value.trim();
            if (pattern) {
              let id = item.dataset.ruleId;
              if (id.startsWith("new_")) {
                id = `rule_${Date.now()}_${Math.random()}`;
              }
              newRules.push({
                id: id,
                enabled: item.querySelector(".s1p-keyword-rule-enable").checked,
                pattern: pattern,
              });
            }
          });
        saveTitleFilterRules(newRules);
        hideThreadsByTitleKeyword();
        renderDynamicallyHiddenList();
        renderRules();
      };

      tabs["threads"].addEventListener("click", (e) => {
        const target = e.target;
        const header = target.closest(".s1p-collapsible-header");

        if (header) {
          if (header.id === "s1p-blocked-by-keyword-header") {
            const currentSettings = getSettings();
            const isNowExpanded = !currentSettings.showBlockedByKeywordList;
            currentSettings.showBlockedByKeywordList = isNowExpanded;
            saveSettings(currentSettings);

            header
              .querySelector(".s1p-expander-arrow")
              .classList.toggle("expanded", isNowExpanded);
            tabs["threads"]
              .querySelector("#s1p-dynamically-hidden-list-container")
              .classList.toggle("expanded", isNowExpanded);
          } else if (header.id === "s1p-manually-blocked-header") {
            const currentSettings = getSettings();
            const isNowExpanded = !currentSettings.showManuallyBlockedList;
            currentSettings.showManuallyBlockedList = isNowExpanded;
            saveSettings(currentSettings);

            header
              .querySelector(".s1p-expander-arrow")
              .classList.toggle("expanded", isNowExpanded);
            tabs["threads"]
              .querySelector("#s1p-manually-blocked-list-container")
              .classList.toggle("expanded", isNowExpanded);
          }
        } else if (target.id === "s1p-keyword-rule-add-btn") {
          const container = tabs["threads"].querySelector(
            "#s1p-keyword-rules-list"
          );
          const emptyMsg = container.querySelector(".s1p-empty");
          if (emptyMsg) emptyMsg.remove();

          const newItem = document.createElement("div");
          newItem.className = "s1p-editor-item";
          newItem.dataset.ruleId = `new_${Date.now()}`;
          newItem.innerHTML = `
                        <label class="s1p-switch"><input type="checkbox" class="s1p-settings-checkbox s1p-keyword-rule-enable" checked><span class="s1p-slider"></span></label>
                        <input type="text" class="s1p-input s1p-keyword-rule-pattern" placeholder="输入关键字或正则表达式" value="" autocomplete="off">
                        <div class="s1p-editor-item-controls">
                            <button class="s1p-editor-btn s1p-delete-button" data-action="delete" title="删除规则"></button>
                        </div>
                    `;
          container.appendChild(newItem);
          newItem.querySelector('input[type="text"]').focus();
        } else if (target.closest(".s1p-delete-button")) {
          const item = target.closest(".s1p-editor-item");
          if (item) {
            const pattern =
              item.querySelector(".s1p-keyword-rule-pattern").value.trim() ||
              "空规则";
            createConfirmationModal(
              "确认删除该屏蔽规则吗？",
              `规则内容: <code style="background-color: var(--s1p-secondary-bg); padding: 2px 4px; border-radius: 4px;">${pattern}</code><br>此操作将立即生效并从存储中删除该规则。`,
              () => {
                const ruleIdToDelete = item.dataset.ruleId;
                if (!ruleIdToDelete || ruleIdToDelete.startsWith("new_")) {
                  item.remove();
                  const container = tabs["threads"].querySelector(
                    "#s1p-keyword-rules-list"
                  );
                  if (container.children.length === 0) {
                    container.innerHTML = `<div class="s1p-empty" style="padding: 12px;">暂无规则</div>`;
                  }
                  showMessage("未保存的新规则已移除。", null);
                  return;
                }
                const currentRules = getTitleFilterRules();
                const newRules = currentRules.filter(
                  (rule) => rule.id !== ruleIdToDelete
                );
                saveTitleFilterRules(newRules);
                hideThreadsByTitleKeyword();
                renderDynamicallyHiddenList();
                renderRules();
                showMessage("规则已成功删除。", true);
              },
              "确认删除"
            );
          }
        } else if (target.id === "s1p-keyword-rules-save-btn") {
          saveKeywordRules();
          showMessage("规则已保存！", true);
        }
      });
    };
    const renderGeneralSettingsTab = () => {
      const settings = getSettings();
      const openTabSettings = settings.openInNewTab;

      tabs["general-settings"].innerHTML = `
        <div class="s1p-settings-group">
            <div class="s1p-settings-item" style="padding: 0; padding-bottom: 16px; border-bottom: 1px solid var(--s1p-pri);">
                <label class="s1p-settings-label s1p-settings-section-title-label" for="s1p-enableGeneralSettings">启用通用设置</label>
                <label class="s1p-switch">
                    <input type="checkbox" id="s1p-enableGeneralSettings" data-feature="enableGeneralSettings" class="s1p-feature-toggle" ${
                      settings.enableGeneralSettings ? "checked" : ""
                    }>
                    <span class="s1p-slider"></span>
                </label>
            </div>
        </div>

        <div class="s1p-feature-content ${
          settings.enableGeneralSettings ? "expanded" : ""
        }">
            <div>
                <div class="s1p-settings-group">
                    <div class="s1p-settings-group-title">阅读/浏览增强</div>
                    <div class="s1p-settings-item">
                        <label class="s1p-settings-label" for="s1p-openInNewTab-master">在新标签页打开帖子/版块等链接</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-openInNewTab-master" class="s1p-settings-checkbox" data-setting="openInNewTab.master" ${
                          openTabSettings.master ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                    <p class="s1p-setting-desc" style="margin-top: -4px;">开启后，下方选中的链接类型将在新标签页打开。仅对顶部导航、帖子列表、消息提醒区域内的链接生效。</p>
                    
                    <div class="s1p-settings-sub-group" style="${
                      !openTabSettings.master
                        ? "opacity: 0.5; pointer-events: none;"
                        : ""
                    }">

                        <div class="s1p-settings-item">
                            <label class="s1p-settings-label" for="s1p-openThreadListInNewTab">在新标签页打开帖子/消息链接</label>
                            <label class="s1p-switch"><input type="checkbox" id="s1p-openThreadListInNewTab" class="s1p-settings-checkbox" data-setting="openInNewTab.threadList" ${
                              openTabSettings.threadList ? "checked" : ""
                            }><span class="s1p-slider"></span></label>
                        </div>
                         <p class="s1p-setting-desc" style="margin-top: -4px;">控制帖子列表和消息提醒区域内的常规链接。</p>
                        <div class="s1p-settings-item" id="s1p-openThreadListInBackground-item" style="padding-left: 20px; ${
                          !openTabSettings.threadList ? "display: none;" : ""
                        }">
                            <label class="s1p-settings-label">在后台打开</label>
                            <label class="s1p-switch"><input type="checkbox" id="s1p-openThreadListInBackground" class="s1p-settings-checkbox" data-setting="openInNewTab.threadListInBackground" ${
                              openTabSettings.threadListInBackground
                                ? "checked"
                                : ""
                            }><span class="s1p-slider"></span></label>
                        </div>

                        <div style="margin: 12px 0 8px 0; border-top: 1px solid var(--s1p-pri);"></div>

                        <div class="s1p-settings-item">
                            <label class="s1p-settings-label" for="s1p-openProgressInNewTab">在新标签页打开阅读进度跳转</label>
                            <label class="s1p-switch"><input type="checkbox" id="s1p-openProgressInNewTab" class="s1p-settings-checkbox" data-setting="openInNewTab.progress" ${
                              openTabSettings.progress ? "checked" : ""
                            }><span class="s1p-slider"></span></label>
                        </div>
                        <div class="s1p-settings-item" id="s1p-openProgressInBackground-item" style="padding-left: 20px; ${
                          !openTabSettings.progress ? "display: none;" : ""
                        }">
                            <label class="s1p-settings-label">在后台打开</label>
                            <label class="s1p-switch"><input type="checkbox" id="s1p-openProgressInBackground" class="s1p-settings-checkbox" data-setting="openInNewTab.progressInBackground" ${
                              openTabSettings.progressInBackground
                                ? "checked"
                                : ""
                            }><span class="s1p-slider"></span></label>
                        </div>

                        <div style="margin: 12px 0 8px 0; border-top: 1px solid var(--s1p-pri);"></div>

                        <div class="s1p-settings-item">
                            <label class="s1p-settings-label" for="s1p-openNavInNewTab">在新标签页打开顶部导航/菜单链接</label> 
                            <label class="s1p-switch"><input type="checkbox" id="s1p-openNavInNewTab" class="s1p-settings-checkbox" data-setting="openInNewTab.nav" ${
                              openTabSettings.nav ? "checked" : ""
                            }><span class="s1p-slider"></span></label>
                        </div>
                        <div class="s1p-settings-item" id="s1p-openNavInBackground-item" style="padding-left: 20px; ${
                          !openTabSettings.nav ? "display: none;" : ""
                        }">
                            <label class="s1p-settings-label" >在后台打开</label>
                            <label class="s1p-switch"><input type="checkbox" id="s1p-openNavInBackground" class="s1p-settings-checkbox" data-setting="openInNewTab.navInBackground" ${
                              openTabSettings.navInBackground ? "checked" : ""
                            }><span class="s1p-slider"></span></label>
                        </div>
                    </div>

                     <div class="s1p-settings-item" style="margin-top: 16px;">
                        <label class="s1p-settings-label" for="s1p-enableReadProgress">启用阅读进度跟踪</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-enableReadProgress" data-feature="enableReadProgress" class="s1p-feature-toggle" ${
                          settings.enableReadProgress ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                    <div class="s1p-feature-content ${
                      settings.enableReadProgress ? "expanded" : ""
                    }">
                      <div class="s1p-settings-sub-group">
                        <div class="s1p-settings-item" id="s1p-showReadIndicator-container">
                            <label class="s1p-settings-label" for="s1p-showReadIndicator">显示“当前阅读位置”浮动标识</label>
                            <label class="s1p-switch"><input type="checkbox" id="s1p-showReadIndicator" class="s1p-settings-checkbox" data-setting="showReadIndicator" ${
                              settings.showReadIndicator ? "checked" : ""
                            }><span class="s1p-slider"></span></label>
                        </div>
                        <div class="s1p-settings-item" id="s1p-readingProgressCleanupContainer">
                            <label class="s1p-settings-label">自动清理超过以下时间的阅读记录</label>
                            <div id="s1p-readingProgressCleanupDays-control" class="s1p-segmented-control">
                                <div class="s1p-segmented-control-slider"></div>
                                <div class="s1p-segmented-control-option ${
                                  settings.readingProgressCleanupDays == 30
                                    ? "active"
                                    : ""
                                }" data-value="30">1个月</div>
                                <div class="s1p-segmented-control-option ${
                                  settings.readingProgressCleanupDays == 90
                                    ? "active"
                                    : ""
                                }" data-value="90">3个月</div>
                                <div class="s1p-segmented-control-option ${
                                  settings.readingProgressCleanupDays == 180
                                    ? "active"
                                    : ""
                                }" data-value="180">6个月</div>
                                <div class="s1p-segmented-control-option ${
                                  settings.readingProgressCleanupDays == 0
                                    ? "active"
                                    : ""
                                }" data-value="0">永不</div>
                            </div>
                        </div>
                      </div>
                    </div>
                     <div class="s1p-settings-item">
                        <label class="s1p-settings-label" for="s1p-hideImagesByDefault">默认隐藏帖子图片</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-hideImagesByDefault" class="s1p-settings-checkbox" data-setting="hideImagesByDefault" ${
                          settings.hideImagesByDefault ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                </div>
                <div class="s1p-settings-group">
                    <div class="s1p-settings-group-title">界面与个性化</div>
                    <div class="s1p-settings-item">
                        <label class="s1p-settings-label" for="s1p-recommendS1Nux">推荐 S1 NUX 安装</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-recommendS1Nux" class="s1p-settings-checkbox" data-setting="recommendS1Nux" ${
                          settings.recommendS1Nux ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                    <p class="s1p-setting-desc">S1 Plus 与 S1 NUX 论坛美化美化扩展搭配使用效果更佳。开启后，若检测到您未安装 S1 NUX，脚本会适时弹出对话框进行推荐。</p>
                    <div class="s1p-settings-item">
                        <label class="s1p-settings-label" for="s1p-enhanceFloatingControls">使用 S1 Plus 增强型悬浮控件</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-enhanceFloatingControls" class="s1p-settings-checkbox" data-setting="enhanceFloatingControls" ${
                          settings.enhanceFloatingControls ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                    <p class="s1p-setting-desc">开启后，将使用脚本提供的全新悬停展开式控件；关闭则恢复使用论坛原生的滚动控件。</p>
                    <div class="s1p-settings-item">
                        <label class="s1p-settings-label" for="s1p-changeLogoLink">修改论坛Logo链接 (指向论坛首页)</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-changeLogoLink" class="s1p-settings-checkbox" data-setting="changeLogoLink" ${
                          settings.changeLogoLink ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                    <div class="s1p-settings-item">
                        <label class="s1p-settings-label" for="s1p-hideBlacklistTip">隐藏已屏蔽用户发言的黄条提示</label>
                        <label class="s1p-switch"><input type="checkbox" id="s1p-hideBlacklistTip" class="s1p-settings-checkbox" data-setting="hideBlacklistTip" ${
                          settings.hideBlacklistTip ? "checked" : ""
                        }><span class="s1p-slider"></span></label>
                    </div>
                    <div class="s1p-settings-item">
                        <label class="s1p-settings-label" for="s1p-customTitleSuffix">自定义标题后缀</label>
                        <input type="text" id="s1p-customTitleSuffix" class="s1p-input" data-setting="customTitleSuffix" value="${
                          settings.customTitleSuffix || ""
                        }" autocomplete="off">
                    </div>
                </div>
            </div>
        </div>`;

      const tabContent = tabs["general-settings"];
      const masterSwitch = tabContent.querySelector("#s1p-openInNewTab-master");
      const subOptionsContainer = tabContent.querySelector(
        ".s1p-settings-sub-group"
      );

      const setupSubSwitch = (mainSwitchId, subItemContainerId) => {
        const mainSwitch = tabContent.querySelector(`#${mainSwitchId}`);
        const subItemContainer = tabContent.querySelector(
          `#${subItemContainerId}`
        );
        if (mainSwitch && subItemContainer) {
          mainSwitch.addEventListener("change", (e) => {
            subItemContainer.style.display = e.target.checked ? "flex" : "none";
          });
        }
      };

      masterSwitch.addEventListener("change", (e) => {
        if (e.target.checked) {
          subOptionsContainer.style.opacity = "1";
          subOptionsContainer.style.pointerEvents = "auto";
        } else {
          subOptionsContainer.style.opacity = "0.5";
          subOptionsContainer.style.pointerEvents = "none";
        }
      });

      setupSubSwitch(
        "s1p-openThreadListInNewTab",
        "s1p-openThreadListInBackground-item"
      );
      setupSubSwitch(
        "s1p-openProgressInNewTab",
        "s1p-openProgressInBackground-item"
      );
      setupSubSwitch("s1p-openNavInNewTab", "s1p-openNavInBackground-item");

      const moveSlider = (control) => {
        if (!control) return;
        requestAnimationFrame(() => {
          const slider = control.querySelector(".s1p-segmented-control-slider");
          const activeOption = control.querySelector(
            ".s1p-segmented-control-option.active"
          );
          if (
            slider &&
            activeOption &&
            activeOption.offsetWidth > 0 &&
            activeOption.offsetParent !== null
          ) {
            slider.style.width = `${activeOption.offsetWidth}px`;
            slider.style.transform = `translateX(${activeOption.offsetLeft}px)`;
          } else if (slider && activeOption) {
            setTimeout(() => moveSlider(control), 100);
          }
        });
      };

      const cleanupControl = tabs["general-settings"].querySelector(
        "#s1p-readingProgressCleanupDays-control"
      );
      if (cleanupControl) {
        moveSlider(cleanupControl);
        cleanupControl.addEventListener("click", (e) => {
          const target = e.target.closest(".s1p-segmented-control-option");
          if (!target || target.classList.contains("active")) return;
          const newValue = parseInt(target.dataset.value, 10);
          const currentSettings = getSettings();
          currentSettings.readingProgressCleanupDays = newValue;
          saveSettings(currentSettings);
          cleanupControl
            .querySelectorAll(".s1p-segmented-control-option")
            .forEach((opt) => opt.classList.remove("active"));
          target.classList.add("active");
          moveSlider(cleanupControl);
        });
      }
    };
    const renderNavSettingsTab = () => {
      const settings = getSettings();
      tabs["nav-settings"].innerHTML = `
        <div class="s1p-settings-group">
            <div class="s1p-settings-item" style="padding: 0; padding-bottom: 16px; border-bottom: 1px solid var(--s1p-pri);">
                <label class="s1p-settings-label s1p-settings-section-title-label" for="s1p-enableNavCustomization">启用自定义导航栏</label>
                <label class="s1p-switch">
                    <input type="checkbox" id="s1p-enableNavCustomization" data-feature="enableNavCustomization" class="s1p-feature-toggle" ${
                      settings.enableNavCustomization ? "checked" : ""
                    }>
                    <span class="s1p-slider"></span>
                </label>
            </div>
        </div>

        <div class="s1p-feature-content ${
          settings.enableNavCustomization ? "expanded" : ""
        }">
            <div>
                <div class="s1p-settings-group">
                    <div class="s1p-settings-group-title">导航链接编辑器</div>
                    <div class="s1p-list s1p-nav-editor-list"></div>
                    <div class="s1p-editor-footer">
                        <div style="display: flex; gap: 8px;">
                            <button id="s1p-nav-add-btn" class="s1p-btn">添加新链接</button>
                            <button id="s1p-settings-save-btn" class="s1p-btn">保存设置</button>
                        </div>
                        <button id="s1p-nav-restore-btn" class="s1p-btn s1p-red-btn">恢复默认导航</button>
                    </div>
                </div>
            </div>
        </div>`;

      const navListContainer = tabs["nav-settings"].querySelector(
        ".s1p-nav-editor-list"
      );
      const renderNavList = (links) => {
        navListContainer.innerHTML = (links || [])
          .map(
            (link, index) => `
            <div class="s1p-editor-item" draggable="true" data-index="${index}" style="grid-template-columns: auto 1fr 1fr auto; user-select: none;">
                <div class="s1p-drag-handle">::</div>
                <input type="text" class="s1p-input s1p-nav-name" placeholder="名称" value="${
                  link.name || ""
                }" autocomplete="off">
                <input type="text" class="s1p-input s1p-nav-href" placeholder="链接" value="${
                  link.href || ""
                }" autocomplete="off">
                <div class="s1p-editor-item-controls"><button class="s1p-editor-btn s1p-delete-button" data-action="delete" title="删除链接"></button></div>
            </div>`
          )
          .join("");
      };

      renderNavList(settings.customNavLinks);

      let draggedItem = null;
      navListContainer.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("s1p-editor-item")) {
          draggedItem = e.target;
          setTimeout(() => {
            e.target.classList.add("s1p-dragging");
          }, 0);
        }
      });
      navListContainer.addEventListener("dragend", (e) => {
        if (draggedItem) {
          draggedItem.classList.remove("s1p-dragging");
          draggedItem = null;
        }
      });
      navListContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (!draggedItem) return;

        const container = e.currentTarget;
        const otherItems = [
          ...container.querySelectorAll(".s1p-editor-item:not(.s1p-dragging)"),
        ];
        const nextSibling = otherItems.find((item) => {
          const rect = item.getBoundingClientRect();
          return e.clientY < rect.top + rect.height / 2;
        });

        if (nextSibling) {
          container.insertBefore(draggedItem, nextSibling);
        } else {
          container.appendChild(draggedItem);
        }
      });
      tabs["nav-settings"].addEventListener("click", (e) => {
        const target = e.target;
        if (target.id === "s1p-nav-add-btn") {
          const newItem = document.createElement("div");
          newItem.className = "s1p-editor-item";
          newItem.draggable = true;
          newItem.style.gridTemplateColumns = "auto 1fr 1fr auto";
          newItem.innerHTML = `<div class="s1p-drag-handle">::</div><input type="text" class="s1p-input s1p-nav-name" placeholder="新链接" autocomplete="off"><input type="text" class="s1p-input s1p-nav-href" placeholder="forum.php" autocomplete="off"><div class="s1p-editor-item-controls"><button class="s1p-editor-btn s1p-delete-button" data-action="delete" title="删除链接"></button></div>`;
          navListContainer.appendChild(newItem);
        } else if (target.closest(".s1p-delete-button")) {
          const item = target.closest(".s1p-editor-item");
          if (item) {
            const name =
              item.querySelector(".s1p-nav-name").value.trim() || "未命名链接";
            createConfirmationModal(
              "确认删除该导航链接吗？",
              `链接名称: ${name}<br>此操作仅在UI上移除，需要点击下方的“保存设置”按钮才会真正生效。`,
              () => {
                item.remove();
                showMessage("链接已从列表移除。", true);
              },
              "确认删除"
            );
          }
        } else if (target.id === "s1p-nav-restore-btn") {
          createConfirmationModal(
            "确认要恢复默认导航栏吗？",
            "您当前的自定义导航链接将被重置为脚本的默认设置。",
            () => {
              const currentSettings = getSettings();
              currentSettings.enableNavCustomization =
                defaultSettings.enableNavCustomization;
              currentSettings.customNavLinks = defaultSettings.customNavLinks;
              saveSettings(currentSettings);
              renderNavSettingsTab();
              initializeNavbar();
              showMessage("导航栏已恢复为默认设置！", true);
            },
            "确认恢复"
          );
        } else if (target.id === "s1p-settings-save-btn") {
          const newSettings = {
            ...getSettings(),
            enableNavCustomization: tabs["nav-settings"].querySelector(
              "#s1p-enableNavCustomization"
            ).checked,
            customNavLinks: Array.from(
              navListContainer.querySelectorAll(".s1p-editor-item")
            )
              .map((item) => ({
                name: item.querySelector(".s1p-nav-name").value.trim(),
                href: item.querySelector(".s1p-nav-href").value.trim(),
              }))
              .filter((l) => l.name && l.href),
          };
          saveSettings(newSettings);
          initializeNavbar();
          showMessage("设置已保存！", true);
        }
      });
    };

    renderGeneralSettingsTab();
    renderThreadTab();
    renderUserTab();
    renderTagsTab();
    renderBookmarksTab();
    renderNavSettingsTab();

    const tabContainer = modal.querySelector(".s1p-tabs");
    setTimeout(() => moveTabSlider(tabContainer), 50);

    modal.style.transition = "opacity 0.2s ease-out";
    requestAnimationFrame(() => {
      modal.style.opacity = "1";
    });
    // [REPLACE ENTIRE EVENT LISTENER BLOCK]
    modal.addEventListener("change", (e) => {
      const target = e.target;
      const settings = getSettings();
      const featureKey = target.dataset.feature;
      const settingKey = target.dataset.setting;

      if (settingKey) {
        const value =
          target.type === "checkbox"
            ? target.checked
            : target.type === "number" || target.tagName === "SELECT"
            ? parseInt(target.value, 10)
            : target.value;

        // [MODIFIED] 使用新的辅助函数来处理嵌套和非嵌套设置
        setNestedValue(settings, settingKey, value);
        saveSettings(settings);

        if (settingKey === "enhanceFloatingControls") {
          applyChanges();
          return;
        }

        applyInterfaceCustomizations();
        if (settingKey === "showReadIndicator" && !target.checked) {
          updateReadIndicatorUI(null);
        }
        if (settingKey === "hideImagesByDefault") {
          applyImageHiding();
          manageImageToggleAllButtons();
        }
        // [MODIFIED] 当任何一个新标签页设置改变时，都重新应用全局行为
        if (settingKey.startsWith("openInNewTab.")) {
          applyGlobalLinkBehavior();
          // 如果是阅读进度相关的设置改变了，则刷新按钮
          if (settingKey.includes("progress")) {
            removeProgressJumpButtons();
            addProgressJumpButtons();
          }
        }
      }

      if (featureKey && target.classList.contains("s1p-feature-toggle")) {
        let contentWrapper =
          target.closest(".s1p-settings-item")?.nextElementSibling;
        if (
          !contentWrapper ||
          !contentWrapper.classList.contains("s1p-feature-content")
        ) {
          contentWrapper = target.closest(
            ".s1p-settings-group"
          )?.nextElementSibling;
        }

        const modalBody = modal.querySelector(".s1p-modal-body");

        if (
          !modalBody ||
          !contentWrapper ||
          !contentWrapper.classList.contains("s1p-feature-content")
        ) {
          console.warn(
            "S1 Plus Debug: Animation structure not found for this toggle, but will proceed with saving."
          );
        }

        const isChecked = target.checked;
        settings[featureKey] = isChecked;
        saveSettings(settings);

        if (
          contentWrapper &&
          contentWrapper.classList.contains("s1p-feature-content")
        ) {
          const oldHeight = modalBody.offsetHeight;
          modalBody.style.height = `${oldHeight}px`;
          contentWrapper.classList.toggle("expanded", isChecked);
          requestAnimationFrame(() => {
            modalBody.style.height = "auto";
            const newHeight = modalBody.offsetHeight;
            modalBody.style.height = `${oldHeight}px`;
            requestAnimationFrame(() => {
              modalBody.style.height = `${newHeight}px`;
            });
          });
          modalBody.addEventListener(
            "transitionend",
            function onEnd() {
              modalBody.removeEventListener("transitionend", onEnd);
              modalBody.style.height = "auto";
            },
            { once: true }
          );
        }

        switch (featureKey) {
          case "enableGeneralSettings":
            applyInterfaceCustomizations();
            applyGlobalLinkBehavior();
            applyImageHiding();
            manageImageToggleAllButtons();
            if (isChecked) {
              addProgressJumpButtons();
            } else {
              removeProgressJumpButtons();
              updateReadIndicatorUI(null);
            }
            renderGeneralSettingsTab();
            break;
          case "enablePostBlocking":
            isChecked
              ? addBlockButtonsToThreads()
              : removeBlockButtonsFromThreads();
            renderThreadTab();
            break;
          case "enableUserBlocking":
            refreshAllAuthiActions();
            if (isChecked) {
              hideBlockedUsersPosts();
              hideBlockedUserQuotes();
              hideBlockedUserRatings();
            } else {
              Object.keys(getBlockedUsers()).forEach(showUserPosts);
            }
            renderUserTab();
            break;
          case "enableUserTagging":
            refreshAllAuthiActions();
            renderTagsTab();
            break;
          case "enableReadProgress":
            renderGeneralSettingsTab();
            isChecked ? addProgressJumpButtons() : removeProgressJumpButtons();
            if (!isChecked) {
              updateReadIndicatorUI(null);
            }
            break;
          case "enableBookmarkReplies":
            refreshAllAuthiActions();
            renderBookmarksTab();
            break;
          case "enableNavCustomization":
            initializeNavbar();
            renderNavSettingsTab(); // 重新渲染以更新其内部的设置状态
            break;
        }
        return;
      } else if (target.matches(".s1p-user-thread-block-toggle")) {
        const userId = target.dataset.userId;
        const blockThreads = target.checked;
        const users = getBlockedUsers();
        if (users[userId]) {
          users[userId].blockThreads = blockThreads;
          saveBlockedUsers(users);
          if (blockThreads) applyUserThreadBlocklist();
          else unblockThreadsByUser(userId);
          renderThreadTab();
        }
      } else if (target.matches("#s1p-blockThreadsOnUserBlock")) {
        const currentSettings = getSettings();
        currentSettings.blockThreadsOnUserBlock = target.checked;
        saveSettings(currentSettings);
      }
    });

    function removeListItem(triggerElement, emptyHTML, onEmptyCallback) {
      const item = triggerElement.closest(".s1p-item");
      if (!item) return;

      const list = item.parentElement;
      item.remove();

      if (list && list.children.length === 0) {
        const container = list.parentElement;
        if (container) {
          container.innerHTML = emptyHTML;
        }
        if (onEmptyCallback) {
          onEmptyCallback(container);
        }
      }
    }

    modal.addEventListener("click", async (e) => {
      const target = e.target;
      if (e.target.matches(".s1p-modal, .s1p-modal-close")) modal.remove();
      if (e.target.matches(".s1p-tab-btn")) {
        const tabContainer = e.target.closest(".s1p-tabs");
        modal
          .querySelectorAll(".s1p-tab-btn, .s1p-tab-content")
          .forEach((el) => el.classList.remove("active"));
        e.target.classList.add("active");
        const activeTab = tabs[e.target.dataset.tab];
        if (activeTab) activeTab.classList.add("active");
        moveTabSlider(tabContainer);
      }

      const unblockThreadId = e.target.dataset.unblockThreadId;
      if (unblockThreadId) {
        const item = target.closest(".s1p-item");
        const title = item
          ? item.querySelector(".s1p-item-title").textContent.trim()
          : `帖子 #${unblockThreadId}`;
        createConfirmationModal(
          "确认取消屏蔽该帖子吗？",
          `帖子标题: ${title}`,
          () => {
            unblockThread(unblockThreadId);
            removeListItem(
              target,
              '<div class="s1p-empty">暂无手动屏蔽的帖子</div>'
            );
            showMessage("帖子已取消屏蔽。", true);
          },
          "确认取消"
        );
      }

      const unblockUserId = e.target.dataset.unblockUserId;
      if (unblockUserId) {
        const item = target.closest(".s1p-item");

        // 通过克隆、移除状态元素的方式，来安全地获取纯净的用户名。
        let userName;
        if (item) {
          const titleEl = item.querySelector(".s1p-item-title");
          if (titleEl) {
            const titleClone = titleEl.cloneNode(true);
            const statusSpan = titleClone.querySelector(
              ".s1p-native-sync-status"
            );
            if (statusSpan) {
              statusSpan.remove();
            }
            userName = titleClone.textContent.trim();
          } else {
            userName = `用户 #${unblockUserId}`;
          }
        } else {
          userName = `用户 #${unblockUserId}`;
        }

        createConfirmationModal(
          `确认取消屏蔽 “${userName}” 吗？`,
          "该用户及其主题帖（如果已关联屏蔽）将被取消屏蔽。",
          async () => {
            const allBlockedThreads = getBlockedThreads();
            const threadsToUnblock = Object.keys(allBlockedThreads).filter(
              (threadId) =>
                allBlockedThreads[threadId].reason === `user_${unblockUserId}`
            );

            const blockedUsers = getBlockedUsers();
            const userToUnblockData = blockedUsers[unblockUserId];
            const wasSynced =
              userToUnblockData?.addedToNativeBlacklist === true;

            const success = await unblockUser(unblockUserId);

            if (success) {
              removeListItem(
                target,
                '<div class="s1p-empty">暂无屏蔽的用户</div>'
              );

              const threadList = document.querySelector(
                "#s1p-manually-blocked-list-container .s1p-list"
              );
              if (threadList) {
                threadsToUnblock.forEach((threadId) => {
                  const threadItemToRemove = threadList.querySelector(
                    `.s1p-item[data-thread-id="${threadId}"]`
                  );
                  threadItemToRemove?.remove();
                });
                if (threadList.children.length === 0) {
                  const container = threadList.closest(
                    "#s1p-manually-blocked-list-container"
                  );
                  if (container) {
                    container.innerHTML =
                      '<div class="s1p-empty">暂无手动屏蔽的帖子</div>';
                  }
                }
              }
              const message = wasSynced
                ? `已取消对 ${userName} 的屏蔽并从论坛同步移除。`
                : `已取消对 ${userName} 的屏蔽。`;
              showMessage(message, true);
            } else {
              showMessage(
                `脚本内取消屏蔽成功，但同步移除论坛黑名单失败。`,
                false
              );
            }
          },
          "确认取消"
        );
      }

      const removeBookmarkId = target.closest('[data-action="remove-bookmark"]')
        ?.dataset.postId;
      if (removeBookmarkId) {
        createConfirmationModal(
          "确认取消收藏该回复吗？",
          "此操作将从您的收藏列表中永久移除该条目。",
          () => {
            const bookmarks = getBookmarkedReplies();
            delete bookmarks[removeBookmarkId];
            saveBookmarkedReplies(bookmarks);
            refreshSinglePostActions(removeBookmarkId);
            removeListItem(
              target,
              '<div class="s1p-empty">暂无收藏的回复</div>',
              () => {
                document
                  .querySelector("#s1p-bookmark-search-input")
                  ?.closest(".s1p-settings-group")
                  ?.remove();
              }
            );
            showMessage("已取消收藏。", true);
          },
          "确认取消"
        );
      }

      const syncTextarea = modal.querySelector("#s1p-local-sync-textarea");
      if (e.target.id === "s1p-local-export-btn") {
        const dataToExport = await exportLocalData();
        syncTextarea.value = dataToExport;
        syncTextarea.select();
        navigator.clipboard
          .writeText(dataToExport)
          .then(() => {
            showMessage("数据已导出并复制到剪贴板", true);
          })
          .catch(() => {
            showMessage("自动复制失败，请手动复制", false);
          });
      }
      if (e.target.id === "s1p-local-import-btn") {
        const jsonStr = syncTextarea.value.trim();
        if (!jsonStr) return showMessage("请先粘贴要导入的数据", false);
        const result = importLocalData(jsonStr);
        showMessage(result.message, result.success);
        if (result.success) {
          renderThreadTab();
          renderUserTab();
          renderGeneralSettingsTab();
          renderTagsTab();
          renderBookmarksTab();
        }
      }
      if (e.target.id === "s1p-clear-select-all") {
        const isChecked = e.target.checked;
        modal
          .querySelectorAll(".s1p-clear-data-checkbox")
          .forEach((chk) => (chk.checked = isChecked));
      }

      if (e.target.id === "s1p-clear-selected-btn") {
        const selectedKeys = Array.from(
          modal.querySelectorAll(".s1p-clear-data-checkbox:checked")
        ).map((chk) => chk.dataset.clearKey);
        if (selectedKeys.length === 0) {
          return showMessage("请至少选择一个要清除的数据项。", false);
        }

        const itemsToClear = selectedKeys
          .map((key) => `“${dataClearanceConfig[key].label}”`)
          .join("、");
        createConfirmationModal(
          "确认要清除所选数据吗？",
          `即将删除 ${itemsToClear} 的所有数据，此操作不可逆！`,
          () => {
            selectedKeys.forEach((key) => {
              if (dataClearanceConfig[key]) {
                dataClearanceConfig[key].clear();
              }
            });

            if (selectedKeys.includes("settings")) {
              modal.querySelector("#s1p-remote-enabled-toggle").checked = false;
              modal.querySelector(
                "#s1p-daily-first-load-sync-enabled-toggle"
              ).checked = true;
              modal.querySelector(
                "#s1p-auto-sync-enabled-toggle"
              ).checked = true;
              modal.querySelector("#s1p-remote-gist-id-input").value = "";
              modal.querySelector("#s1p-remote-pat-input").value = "";
              updateRemoteSyncInputsState();
            }

            hideBlockedThreads();
            hideBlockedUsersPosts();
            applyUserThreadBlocklist();
            hideThreadsByTitleKeyword();
            initializeNavbar();
            applyInterfaceCustomizations();
            document
              .querySelectorAll(".s1p-progress-container")
              .forEach((el) => el.remove());

            renderThreadTab();
            renderUserTab();
            renderGeneralSettingsTab();
            renderTagsTab();
            renderBookmarksTab();
            showMessage("选中的本地数据已成功清除。", true);
          },
          "确认清除"
        );
      }

      if (e.target.id === "s1p-remote-save-btn") {
        const button = e.target;
        button.disabled = true;
        button.textContent = "正在保存...";

        const currentSettings = getSettings();
        currentSettings.syncRemoteEnabled = modal.querySelector(
          "#s1p-remote-enabled-toggle"
        ).checked;
        currentSettings.syncDailyFirstLoad = modal.querySelector(
          "#s1p-daily-first-load-sync-enabled-toggle"
        ).checked;
        currentSettings.syncAutoEnabled = modal.querySelector(
          "#s1p-auto-sync-enabled-toggle"
        ).checked;
        currentSettings.syncRemoteGistId = modal
          .querySelector("#s1p-remote-gist-id-input")
          .value.trim();
        currentSettings.syncRemotePat = modal
          .querySelector("#s1p-remote-pat-input")
          .value.trim();

        saveSettings(currentSettings, true);
        updateNavbarSyncButton();

        if (currentSettings.syncRemoteGistId && currentSettings.syncRemotePat) {
          showMessage("设置已保存，正在启动首次同步检查...", null);
          await handleManualSync();
        } else {
          showMessage("远程同步设置已保存。", true);
        }
        button.disabled = false;
        button.textContent = "保存设置";
      }

      if (e.target.id === "s1p-remote-manual-sync-btn") {
        handleManualSync();
      }

      if (e.target.id === "s1p-open-gist-page-btn") {
        const gistId = modal
          .querySelector("#s1p-remote-gist-id-input")
          .value.trim();
        if (gistId) {
          GM_openInTab(`https://gist.github.com/${gistId}`, true);
        } else {
          showMessage("请先填写 Gist ID。", false);
        }
      }

      const targetTab = target.closest("#s1p-tab-tags");
      if (targetTab) {
        const action = target.dataset.action;
        const userId = target.dataset.userId;

        if (action === "edit-tag-item")
          renderTagsTab({ editingUserId: userId });
        if (action === "cancel-tag-edit") renderTagsTab();
        if (action === "delete-tag-item") {
          const userName = target.dataset.userName;
          createConfirmationModal(
            `确认删除对 "${userName}" 的标记吗?`,
            "此操作不可撤销。",
            () => {
              const tags = getUserTags();
              delete tags[userId];
              saveUserTags(tags);
              refreshUserPostsOnPage(userId);
              removeListItem(
                target,
                `<div class="s1p-empty">暂无用户标记</div>`
              );
              showMessage(`已删除对 ${userName} 的标记。`, true);
            },
            "确认删除"
          );
        } else if (action === "save-tag-edit") {
          const userName = target.dataset.userName;
          const newTag = targetTab
            .querySelector(
              `.s1p-item[data-user-id="${userId}"] .s1p-tag-edit-area`
            )
            .value.trim();
          const tags = getUserTags();
          if (newTag) {
            tags[userId] = {
              ...tags[userId],
              tag: newTag,
              timestamp: Date.now(),
              name: userName,
            };
            saveUserTags(tags);
            refreshUserPostsOnPage(userId);
            renderTagsTab();
            showMessage(`已更新对 ${userName} 的标记。`, true);
          } else {
            createConfirmationModal(
              `标记内容为空`,
              "您希望删除对该用户的标记吗？",
              () => {
                delete tags[userId];
                saveUserTags(tags);
                refreshUserPostsOnPage(userId);
                renderTagsTab();
                showMessage(`已删除对 ${userName} 的标记。`, true);
              },
              "确认删除"
            );
          }
        } else if (target.id === "s1p-export-tags-btn") {
          const textarea = targetTab.querySelector("#s1p-tags-sync-textarea");
          const dataToExport = JSON.stringify(getUserTags(), null, 2);
          textarea.value = dataToExport;
          textarea.select();
          navigator.clipboard
            .writeText(dataToExport)
            .then(() => {
              showMessage("用户标记已导出并复制到剪贴板。", true);
            })
            .catch(() => {
              showMessage("复制失败，请手动复制。", false);
            });
        } else if (target.id === "s1p-import-tags-btn") {
          const textarea = targetTab.querySelector("#s1p-tags-sync-textarea");
          const jsonStr = textarea.value.trim();
          if (!jsonStr) return showMessage("请先粘贴要导入的数据。", false);

          try {
            const imported = JSON.parse(jsonStr);
            if (
              typeof imported !== "object" ||
              imported === null ||
              Array.isArray(imported)
            )
              throw new Error("无效数据格式，应为一个对象。");
            for (const key in imported) {
              const item = imported[key];
              if (
                typeof item !== "object" ||
                item === null ||
                typeof item.tag === "undefined" ||
                typeof item.name === "undefined"
              )
                throw new Error(`用户 #${key} 的数据格式不正确。`);
            }
            createConfirmationModal(
              "确认导入用户标记吗？",
              "导入的数据将覆盖现有相同用户的标记。",
              () => {
                const currentTags = getUserTags();
                const mergedTags = { ...currentTags, ...imported };
                saveUserTags(mergedTags);
                renderTagsTab();
                showMessage(
                  `成功导入/更新 ${Object.keys(imported).length} 条用户标记。`,
                  true
                );
                textarea.value = "";
                refreshAllAuthiActions();
              },
              "确认导入"
            );
          } catch (e) {
            showMessage(`导入失败: ${e.message}`, false);
          }
        }
      }
    });
  };

  /**
   * [MODIFIED V4] 创建手动同步时的对比详情HTML (增加阅读进度智能更新提示)
   * @param {object} localDataObj - 本地数据对象
   * @param {object} remoteDataObj - 远程数据对象
   * @param {boolean} isConflict - 是否为冲突状态
   * @param {number} pendingCleanupCount - [S1PLUS-CLEANUP-FIX] 待处理计数
   * @returns {string} - 用于弹窗的HTML字符串
   */
  const createSyncComparisonHtml = (
    localDataObj,
    remoteDataObj,
    isConflict,
    pendingCleanupCount = 0
  ) => {
    const lastSyncInfo = GM_getValue("s1p_last_manual_sync_info", null);
    let lastActionHtml = "";
    if (lastSyncInfo && lastSyncInfo.timestamp && lastSyncInfo.action) {
      const actionText = lastSyncInfo.action === "push" ? "推送" : "拉取";
      const formattedTime = new Date(lastSyncInfo.timestamp).toLocaleString(
        "zh-CN",
        { hour12: false }
      );
      lastActionHtml = `<div class="s1p-sync-last-action">这台电脑上次手动操作: 于 ${formattedTime} <strong>${actionText}</strong>了数据</div>`;
    }

    // [融合版] 使用 Kyo 方案的解释性措辞，配合 Cosmo 方案的判断条件
    let cleanupNoticeHtml = "";
    if (isConflict && pendingCleanupCount > 0) {
      cleanupNoticeHtml = `
        <div class="s1p-notice" style="margin-top: 16px;">
            <div class="s1p-notice-icon"></div>
            <div class="s1p-notice-content">根据您的设置，S1 Plus 自动清理了 <strong>${pendingCleanupCount}</strong> 条陈旧的阅读记录，导致本地数据与云端不一致。</div>
        </div>
      `;
    }

    const localNewer = localDataObj.lastUpdated > remoteDataObj.lastUpdated;
    let title = "";
    if (isConflict) {
      title = `<h2 style="color: var(--s1p-red);">检测到同步冲突！</h2><p>时间戳相同但内容不同，请仔细选择要保留的版本。</p>`;
    } else if (localNewer) {
      title = `<h2>本地数据较新</h2><p>建议选择“推送”以更新云端备份。</p>`;
    } else {
      title = `<h2>云端备份较新</h2><p>建议选择“拉取”以更新本地数据。</p>`;
    }

    const formatTime = (ts) =>
      new Date(ts || 0).toLocaleString("zh-CN", { hour12: false });
    const localTime = formatTime(localDataObj.lastUpdated);
    const remoteTime = formatTime(remoteDataObj.lastUpdated);
    const newerBadge = '<span class="s1p-newer-badge">(较新)</span>';

    const categories = [
      { label: "屏蔽用户", key: "users" },
      { label: "屏蔽帖子", key: "threads" },
      { label: "用户标记", key: "user_tags" },
      { label: "回复收藏", key: "bookmarked_replies" },
      { label: "标题规则", key: "title_filter_rules" },
      { label: "阅读进度", key: "read_progress" },
    ];

    const sortAndStringify = (obj) => {
      // 一个简化的确定性序列化，用于对比
      if (!obj || typeof obj !== "object") return JSON.stringify(obj);
      return JSON.stringify(
        Object.keys(obj)
          .sort()
          .reduce((result, key) => {
            result[key] = obj[key];
            return result;
          }, {})
      );
    };

    const tableRows = categories
      .map((cat) => {
        const localData = localDataObj.data[cat.key] || {};
        const remoteData = remoteDataObj.data[cat.key] || {};
        const localCount = Object.keys(localData).length;
        const remoteCount = Object.keys(remoteData).length;

        let localBadge = "";
        let remoteBadge = "";

        // [核心升级] 仅对“阅读进度”进行智能更新检查
        if (
          cat.key === "read_progress" &&
          localCount === remoteCount &&
          localCount > 0
        ) {
          const localContentStr = sortAndStringify(localData);
          const remoteContentStr = sortAndStringify(remoteData);

          if (localContentStr !== remoteContentStr) {
            // 内容不一致，根据整体时间戳判断哪边是更新的
            const updateBadge =
              '<span class="s1p-progress-update-badge">(内容更新)</span>';
            if (localNewer) {
              localBadge = updateBadge;
            } else {
              remoteBadge = updateBadge;
            }
          }
        }

        return `
            <div class="s1p-sync-comparison-row">
                <div class="s1p-sync-comparison-label">${cat.label}</div>
                <div class="s1p-sync-comparison-value">${localCount} ${localBadge}</div>
                <div class="s1p-sync-comparison-value">${remoteCount} ${remoteBadge}</div>
            </div>
        `;
      })
      .join("");

    return `
        ${title}
        ${cleanupNoticeHtml}
        ${lastActionHtml}
        <div class="s1p-sync-comparison-table">
            <div class="s1p-sync-comparison-row s1p-sync-comparison-header">
                <div>数据项</div>
                <div>本地数量</div>
                <div>云端数量</div>
            </div>
            ${tableRows}
            <div class="s1p-sync-comparison-row">
                <div class="s1p-sync-comparison-label">最后更新</div>
                <div class="s1p-sync-comparison-value" style="font-size: 13px;">${localTime} ${
      localNewer && !isConflict ? newerBadge : ""
    }</div>
                <div class="s1p-sync-comparison-value" style="font-size: 13px;">${remoteTime} ${
      !localNewer && !isConflict ? newerBadge : ""
    }</div>
            </div>
        </div>
    `;
  };

  /**
   * [NEW] 获取当前页面的帖子ID
   * @returns {string|null} 帖子ID或null
   */
  const getCurrentThreadId = () => {
    const threadIdMatch = window.location.href.match(/thread-(\d+)-/);
    if (threadIdMatch && threadIdMatch[1]) {
      return threadIdMatch[1];
    }
    const params = new URLSearchParams(window.location.search);
    const tid = params.get("tid") || params.get("ptid");
    if (tid) {
      return tid;
    }
    const tidInput = document.querySelector('input[name="tid"]#tid');
    if (tidInput && tidInput.value) {
      return tidInput.value;
    }
    return null;
  };

  const handleManualSync = (suppressInitialMessage = false) => {
    return new Promise(async (resolve) => {
      const settings = getSettings();
      if (
        !settings.syncRemoteEnabled ||
        !settings.syncRemoteGistId ||
        !settings.syncRemotePat
      ) {
        showMessage("远程同步未启用或配置不完整。", false);
        return resolve(false);
      }

      if (!suppressInitialMessage) {
        showMessage("正在检查云端数据...", null);
      }

      try {
        const rawRemoteData = await fetchRemoteData();

        if (Object.keys(rawRemoteData).length === 0) {
          const pushAction = {
            text: "推送本地数据到云端",
            className: "s1p-confirm",
            action: async () => {
              showMessage("正在向云端推送数据...", null);
              try {
                const localData = await exportLocalDataObject();
                await pushRemoteData(localData);
                GM_setValue("s1p_last_sync_timestamp", Date.now());
                GM_setValue("s1p_last_manual_sync_info", {
                  action: "push",
                  timestamp: Date.now(),
                });
                updateLastSyncTimeDisplay();
                showMessage("推送成功！已初始化云端备份。", true);
                resolve(true);
              } catch (e) {
                showMessage(`推送失败: ${e.message}`, false);
                resolve(false);
              }
            },
          };
          const cancelAction = {
            text: "取消",
            className: "s1p-cancel",
            action: () => {
              showMessage("操作已取消。", null);
              resolve(null);
            },
          };
          createAdvancedConfirmationModal(
            "初始化云端同步",
            "<p>检测到云端备份为空，是否将当前本地数据作为初始版本推送到云端？</p>",
            [pushAction, cancelAction],
            { modalClassName: "s1p-sync-modal" }
          );
          return;
        }

        const remote = await migrateAndValidateRemoteData(rawRemoteData);
        const localDataObject = await exportLocalDataObject();

        if (remote.contentHash === localDataObject.contentHash) {
          showMessage("数据已是最新，无需同步。", true);
          GM_setValue("s1p_last_sync_timestamp", Date.now());
          updateLastSyncTimeDisplay();
          return resolve(true);
        }

        // [S1PLUS-SMART-SYNC V2 - LOGIC FIXED]
        const currentThreadId = getCurrentThreadId();
        if (currentThreadId && !isInitialSyncInProgress) {
          const sanitizedLocalData = JSON.parse(
            JSON.stringify(localDataObject.data)
          );
          const sanitizedRemoteData = JSON.parse(JSON.stringify(remote.data));
          const currentThreadLocalProgress = sanitizedLocalData.read_progress
            ? sanitizedLocalData.read_progress[currentThreadId]
            : undefined;

          if (sanitizedLocalData.read_progress)
            delete sanitizedLocalData.read_progress[currentThreadId];
          if (sanitizedRemoteData.read_progress)
            delete sanitizedRemoteData.read_progress[currentThreadId];

          const sanitizedLocalHash = await calculateDataHash(
            sanitizedLocalData
          );
          const sanitizedRemoteHash = await calculateDataHash(
            sanitizedRemoteData
          );

          if (sanitizedLocalHash === sanitizedRemoteHash) {
            // [逻辑修正] 在确认唯一区别是当前帖子进度后，必须再根据时间戳判断同步方向
            if (localDataObject.lastUpdated > remote.lastUpdated) {
              // 场景A: 本地较新 (用户主动阅读导致)，执行无感推送
              showMessage(
                "智能同步：本地进度已更新，正在自动推送到云端...",
                null
              );
              try {
                await pushRemoteData(localDataObject);
                GM_setValue("s1p_last_sync_timestamp", Date.now());
                updateLastSyncTimeDisplay();
                showMessage("智能同步成功！已将本地最新进度推送到云端。", true);
                return resolve(true);
              } catch (e) {
                showMessage(`智能推送失败: ${e.message}`, false);
                return resolve(false);
              }
            } else {
              // 场景B: 云端较新 (被动打开帖子)，执行无感拉取与合并
              showMessage("智能同步：正在合并云端数据与当前阅读进度...", null);
              importLocalData(JSON.stringify(remote.full), {
                suppressPostSync: true,
              });
              if (currentThreadLocalProgress) {
                const progress = getReadProgress();
                progress[currentThreadId] = currentThreadLocalProgress;
                saveReadProgress(progress);
              }
              GM_setValue("s1p_last_sync_timestamp", Date.now());
              updateLastSyncTimeDisplay();
              showMessage("智能同步成功！已保留当前帖子的最新阅读进度。", true);
              return resolve(true);
            }
          }
        }

        const isConflict = localDataObject.lastUpdated === remote.lastUpdated;
        // [S1PLUS-CLEANUP-FIX] 检查是否有待处理的自动清理
        const pendingCleanupCount = GM_getValue("s1p_pending_cleanup_info", 0);
        const bodyHtml = createSyncComparisonHtml(
          localDataObject,
          remote,
          isConflict,
          pendingCleanupCount // [S1PLUS-CLEANUP-FIX] 传入待处理计数
        );
        const pullAction = {
          text: "从云端拉取",
          className: "s1p-confirm",
          action: () => {
            const result = importLocalData(JSON.stringify(remote.full), {
              suppressPostSync: true,
            });
            if (result.success) {
              GM_deleteValue("s1p_pending_cleanup_info"); // <-- [S1PLUS-CLEANUP-FIX]
              GM_setValue("s1p_last_sync_timestamp", Date.now());
              GM_setValue("s1p_last_manual_sync_info", {
                action: "pull",
                timestamp: Date.now(),
              });
              updateLastSyncTimeDisplay();
              showMessage(`拉取成功！页面即将刷新。`, true);
              setTimeout(() => location.reload(), 1200);
              resolve(true);
            } else {
              showMessage(`导入失败: ${result.message}`, false);
              resolve(false);
            }
          },
        };
        const pushAction = {
          text: "向云端推送",
          className: "s1p-confirm",
          action: async () => {
            try {
              await pushRemoteData(localDataObject);
              GM_deleteValue("s1p_pending_cleanup_info"); // <-- [S1PLUS-CLEANUP-FIX]
              GM_setValue("s1p_last_sync_timestamp", Date.now());
              GM_setValue("s1p_last_manual_sync_info", {
                action: "push",
                timestamp: Date.now(),
              });
              updateLastSyncTimeDisplay();
              showMessage("推送成功！已更新云端备份。", true);
              resolve(true);
            } catch (e) {
              showMessage(`推送失败: ${e.message}`, false);
              resolve(false);
            }
          },
        };
        const cancelAction = {
          text: "取消",
          className: "s1p-cancel",
          action: () => {
            showMessage("操作已取消。", null);
            resolve(null);
          },
        };
        createAdvancedConfirmationModal(
          "手动同步选择",
          bodyHtml,
          [pullAction, pushAction, cancelAction],
          { modalClassName: "s1p-sync-modal" }
        );
      } catch (error) {
        const corruptionErrorMessage = "云端备份已损坏";
        if (error?.message.includes(corruptionErrorMessage)) {
          const forcePushAction = {
            text: "强制推送，覆盖云端",
            className: "s1p-confirm",
            action: async () => {
              try {
                const localDataObjectForPush = await exportLocalDataObject();
                await pushRemoteData(localDataObjectForPush);
                GM_setValue("s1p_last_sync_timestamp", Date.now());
                GM_setValue("s1p_last_manual_sync_info", {
                  action: "push",
                  timestamp: Date.now(),
                });
                updateLastSyncTimeDisplay();
                showMessage("推送成功！已使用本地数据修复云端备份。", true);
                resolve(true);
              } catch (e) {
                showMessage(`强制推送失败: ${e.message}`, false);
                resolve(false);
              }
            },
          };
          const cancelAction = {
            text: "暂不处理",
            className: "s1p-cancel",
            action: () => {
              showMessage("操作已取消。云端备份仍处于损坏状态。", null);
              resolve(null);
            },
          };
          createAdvancedConfirmationModal(
            "检测到云端备份损坏",
            `<p style="color: var(--s1p-red);">云端备份文件校验失败，为保护数据已暂停同步。</p><p>是否用当前健康的本地数据强制覆盖云端损坏的备份？</p>`,
            [forcePushAction, cancelAction],
            { modalClassName: "s1p-sync-modal" }
          );
        } else {
          showMessage(`操作失败: ${error.message}`, false);
          resolve(false);
        }
      }
    });
  };

  const createAdvancedConfirmationModal = (
    title,
    bodyHtml,
    buttons,
    options = {}
  ) => {
    // [修改] 增加 options 参数
    document.querySelector(".s1p-confirm-modal")?.remove();
    const modal = document.createElement("div");
    modal.className = "s1p-confirm-modal";

    // [新增] 如果传入了自定义类名，则添加到 modal 元素上
    if (options.modalClassName) {
      modal.classList.add(options.modalClassName);
    }

    const footerButtons = buttons
      .map(
        (btn, index) =>
          `<button class="s1p-confirm-btn ${
            btn.className || ""
          }" data-btn-index="${index}">${btn.text}</button>`
      )
      .join("");

    modal.innerHTML = `
            <div class="s1p-confirm-content">
                <div class="s1p-confirm-body">
                    <div class="s1p-confirm-title">${title}</div>
                    <div class="s1p-confirm-subtitle">${bodyHtml}</div>
                </div>
                <div class="s1p-confirm-footer s1p-centered">
                    ${footerButtons}
                </div>
            </div>`;

    const closeModal = () => {
      modal.querySelector(".s1p-confirm-content").style.animation =
        "s1p-scale-out 0.25s ease-out forwards";
      modal.style.animation = "s1p-fade-out 0.25s ease-out forwards";
      setTimeout(() => modal.remove(), 250);
    };

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        const cancelButton = modal.querySelector(".s1p-confirm-btn.s1p-cancel");
        if (cancelButton) {
          cancelButton.click();
        } else {
          closeModal();
        }
      }
    });

    buttons.forEach((btn, index) => {
      const buttonEl = modal.querySelector(`[data-btn-index="${index}"]`);
      if (buttonEl) {
        buttonEl.addEventListener("click", () => {
          if (btn.action) btn.action();
          closeModal();
        });
      }
    });

    document.body.appendChild(modal);
  };

  const addBlockButtonsToThreads = () => {
    // 核心修复：注入一个空的表头单元格，以匹配内容行的列数。
    // S1Plus 原脚本会给每个内容行动态添加一个“操作列”单元格，但没有给表头行添加，导致列数不匹配。
    // 此代码通过给表头也添加一个对应的占位单元格，使得结构恢复一致，从而让浏览器能够正确对齐所有列。
    const headerTr = document.querySelector("#threadlisttableid .th tr");
    if (headerTr && !headerTr.querySelector(".s1p-header-placeholder")) {
      const placeholderCell = document.createElement("td");
      placeholderCell.className = "s1p-header-placeholder";
      headerTr.appendChild(placeholderCell);
    }

    document
      .querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]')
      .forEach((row) => {
        const tr = row.querySelector("tr");
        if (
          !tr ||
          row.querySelector(".s1p-options-cell") ||
          tr.classList.contains("ts") ||
          tr.classList.contains("th")
        )
          return;

        const titleElement = row.querySelector("th a.s.xst");
        if (!titleElement) return;

        const threadId = row.id.replace(/^(normalthread_|stickthread_)/, "");
        const threadTitle = titleElement.textContent.trim();

        const optionsCell = document.createElement("td");
        optionsCell.className = "s1p-options-cell";

        const optionsBtn = document.createElement("div");
        optionsBtn.className = "s1p-options-btn";
        optionsBtn.title = "屏蔽此贴";
        optionsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`;

        const optionsMenu = document.createElement("div");
        optionsMenu.className = "s1p-options-menu";
        // [S1P-MODIFIED] 调整了确认框内部所有元素的顺序
        optionsMenu.innerHTML = `
                <div class="s1p-direct-confirm">
                    <button class="s1p-confirm-action-btn s1p-confirm" title="确认屏蔽"></button>
                    <button class="s1p-confirm-action-btn s1p-cancel" title="取消"></button>
                    <span class="s1p-confirm-separator"></span>
                    <span>屏蔽该帖子吗？</span>
                </div>
            `;

        const cancelBtn = optionsMenu.querySelector(".s1p-cancel");
        const confirmBtn = optionsMenu.querySelector(".s1p-confirm");

        cancelBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const parentCell = e.currentTarget.closest(".s1p-options-cell");
          if (parentCell) {
            optionsMenu.style.visibility = "hidden";
            optionsMenu.style.opacity = "0";
            parentCell.style.pointerEvents = "none";
            setTimeout(() => {
              optionsMenu.style.removeProperty("visibility");
              optionsMenu.style.removeProperty("opacity");
              parentCell.style.removeProperty("pointer-events");
            }, 200);
          }
        });

        confirmBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          blockThread(threadId, threadTitle);
        });

        optionsCell.appendChild(optionsBtn);
        optionsCell.appendChild(optionsMenu);
        tr.appendChild(optionsCell);

        const separatorRow = document.querySelector("#separatorline > tr.ts");
        if (separatorRow && separatorRow.childElementCount < 6) {
          const emptyTd = document.createElement("td");
          separatorRow.appendChild(emptyTd);
        }
      });
  };

  const initializeTaggingPopover = () => {
    let popover = document.getElementById("s1p-tag-popover-main");
    if (!popover) {
      popover = document.createElement("div");
      popover.id = "s1p-tag-popover-main";
      popover.className = "s1p-tag-popover";
      document.body.appendChild(popover);
    }

    // --- [S1P-FIX START] 优化交互逻辑为“点击外部关闭” ---
    let currentAnchor = null; // 保存触发弹窗的锚点元素

    const closePopover = () => {
      popover.classList.remove("visible");
      // 移除全局点击监听器，避免内存泄漏
      document.removeEventListener("click", handleOutsideClick);
      currentAnchor = null;
    };

    const handleOutsideClick = (e) => {
      // 如果点击事件发生在弹窗内部，或者发生在触发弹窗的原始锚点上，则不关闭
      if (
        popover.contains(e.target) ||
        (currentAnchor && currentAnchor.contains(e.target))
      ) {
        return;
      }
      closePopover();
    };
    // --- [S1P-FIX END] ---

    const repositionPopover = (anchorElement) => {
      if (!anchorElement) return;
      const rect = anchorElement.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();

      let top = rect.bottom + window.scrollY + 5;
      let left = rect.left + window.scrollX;

      if (left + popoverRect.width > window.innerWidth - 10) {
        left = window.innerWidth - popoverRect.width - 10;
      }
      if (left < 10) {
        left = 10;
      }

      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;
    };

    const renderEditMode = (userName, userId, currentTag = "") => {
      popover.innerHTML = `
                 <div class="s1p-popover-content">
                    <div class="s1p-edit-mode-header">为 ${userName} ${
        currentTag ? "编辑" : "添加"
      }标记</div>
                    <textarea class="s1p-input s1p-textarea s1p-edit-mode-textarea" placeholder="输入标记内容..." autocomplete="off">${currentTag}</textarea>
                    <div class="s1p-edit-mode-actions">
                        <button class="s1p-btn" data-action="cancel-edit">取消</button>
                        <button class="s1p-btn" data-action="save">保存</button>
                    </div>
                </div>`;
      popover.querySelector("textarea").focus();
    };

    const show = (anchorElement, userId, userName) => {
      // --- [S1P-FIX START] 更新显示逻辑 ---
      // 如果弹窗已显示且由同一个锚点触发，则不执行任何操作（防止重复打开）
      if (
        popover.classList.contains("visible") &&
        currentAnchor === anchorElement
      ) {
        return;
      }

      currentAnchor = anchorElement; // 保存当前触发的锚点

      popover.dataset.userId = userId;
      popover.dataset.userName = userName;

      const userTags = getUserTags();
      renderEditMode(userName, userId, userTags[userId]?.tag || "");

      popover.classList.add("visible");
      repositionPopover(anchorElement);

      // 延迟添加全局监听器，以防止触发弹窗的同一次点击事件立即将其关闭
      setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
      }, 0);
      // --- [S1P-FIX END] ---
    };

    popover.show = show;

    popover.addEventListener("click", (e) => {
      const target = e.target.closest("button[data-action]");
      if (!target) return;

      const { userId, userName } = popover.dataset;
      const userTags = getUserTags();

      switch (target.dataset.action) {
        case "save":
          const newTag = popover.querySelector("textarea").value.trim();
          if (newTag) {
            userTags[userId] = {
              name: userName,
              tag: newTag,
              timestamp: Date.now(),
            };
          } else {
            delete userTags[userId];
          }
          saveUserTags(userTags);
          refreshUserPostsOnPage(userId);
          closePopover(); // [S1P-FIX] 改为调用新的关闭函数
          break;
        case "cancel-edit":
          closePopover(); // [S1P-FIX] 改为调用新的关闭函数
          break;
      }
    });
  };

  const initializeGenericDisplayPopover = () => {
    let popover = document.getElementById("s1p-generic-display-popover");
    if (!popover) {
      popover = document.createElement("div");
      popover.id = "s1p-generic-display-popover";
      popover.className = "s1p-generic-display-popover";
      document.body.appendChild(popover);
    }

    let showTimeout, hideTimeout;

    const show = (anchor, text) => {
      clearTimeout(hideTimeout);
      showTimeout = setTimeout(() => {
        popover.textContent = text;
        const rect = anchor.getBoundingClientRect();

        popover.style.display = "block";
        let top = rect.top + window.scrollY - popover.offsetHeight - 6;
        let left =
          rect.left + window.scrollX + rect.width / 2 - popover.offsetWidth / 2;
        if (top < window.scrollY) {
          top = rect.bottom + window.scrollY + 6;
        }

        if (left < 10) left = 10;
        if (left + popover.offsetWidth > window.innerWidth) {
          left = window.innerWidth - popover.offsetWidth - 10;
        }

        popover.style.top = `${top}px`;
        popover.style.left = `${left}px`;
        popover.classList.add("visible");
      }, 50);
    };

    const hide = () => {
      clearTimeout(showTimeout);
      hideTimeout = setTimeout(() => {
        popover.classList.remove("visible");
      }, 100);
    };

    // [MODIFIED] Attach API to the element for external use
    if (!popover.s1p_api) {
      popover.s1p_api = { show, hide };
    }

    // Keep existing listeners for user tags
    document.body.addEventListener("mouseover", (e) => {
      const tagDisplay = e.target.closest(".s1p-user-tag-display");
      if (
        tagDisplay &&
        tagDisplay.dataset.fullTag &&
        tagDisplay.scrollWidth > tagDisplay.clientWidth
      ) {
        show(tagDisplay, tagDisplay.dataset.fullTag);
      }
    });

    document.body.addEventListener("mouseout", (e) => {
      const tagDisplay = e.target.closest(".s1p-user-tag-display");
      if (tagDisplay) {
        hide();
      }
    });
  };

  const getTimeBasedColor = (hours) => {
    if (hours <= 1) return "var(--s1p-progress-hot)";
    if (hours <= 24)
      return `rgb(${Math.round(192 - hours * 4)}, ${Math.round(
        51 + hours * 2
      )}, ${Math.round(34 + hours * 2)})`;
    if (hours <= 168)
      return `rgb(${Math.round(100 - (hours - 24) / 3)}, ${Math.round(
        100 + (hours - 24) / 4
      )}, ${Math.round(80 + (hours - 24) / 4)})`;
    return "var(--s1p-progress-cold)";
  };

  const addProgressJumpButtons = () => {
    const settings = getSettings();
    const progressData = getReadProgress();
    if (Object.keys(progressData).length === 0) return;

    const now = Date.now();

    document
      .querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]')
      .forEach((row) => {
        const container = row.querySelector("th");
        if (!container || container.querySelector(".s1p-progress-container"))
          return;

        const threadIdMatch = row.id.match(
          /(?:normalthread_|stickthread_)(\d+)/
        );
        if (!threadIdMatch) return;
        const threadId = threadIdMatch[1];

        const progress = progressData[threadId];
        if (progress && progress.page) {
          const {
            postId,
            page,
            timestamp,
            lastReadFloor: savedFloor,
          } = progress;
          const hoursDiff = (now - (timestamp || 0)) / 3600000;
          const fcolor = getTimeBasedColor(hoursDiff);

          const replyEl = row.querySelector("td.num a.xi2");
          const currentReplies = replyEl
            ? parseInt(replyEl.textContent.replace(/,/g, "")) || 0
            : 0;
          const latestFloor = currentReplies + 1;
          const newReplies =
            savedFloor !== undefined && latestFloor > savedFloor
              ? latestFloor - savedFloor
              : 0;

          const progressContainer = document.createElement("span");
          progressContainer.className = "s1p-progress-container";

          const jumpBtn = document.createElement("a");
          jumpBtn.className = "s1p-progress-jump-btn";
          if (savedFloor) {
            jumpBtn.textContent = `P${page}-#${savedFloor}`;
            jumpBtn.title = `跳转至上次离开的第 ${page} 页，第 ${savedFloor} 楼`;
          } else {
            jumpBtn.textContent = `P${page}`;
            jumpBtn.title = `跳转至上次离开的第 ${page} 页`;
          }

          jumpBtn.href = `forum.php?mod=redirect&goto=findpost&ptid=${threadId}&pid=${postId}`;
          jumpBtn.style.color = fcolor;
          jumpBtn.style.borderColor = fcolor;

          // [MODIFIED] 移除了此处的 click 事件监听器

          jumpBtn.addEventListener("mouseover", () => {
            jumpBtn.style.backgroundColor = fcolor;
            jumpBtn.style.color = "var(--s1p-white)";
          });
          jumpBtn.addEventListener("mouseout", () => {
            jumpBtn.style.backgroundColor = "transparent";
            jumpBtn.style.color = fcolor;
          });

          progressContainer.appendChild(jumpBtn);
          if (newReplies > 0) {
            const newRepliesBadge = document.createElement("span");
            newRepliesBadge.className = "s1p-new-replies-badge";
            newRepliesBadge.textContent = `+${newReplies}`;
            newRepliesBadge.title = `有 ${newReplies} 条新回复`;
            newRepliesBadge.style.backgroundColor = fcolor;
            newRepliesBadge.style.borderColor = fcolor;
            progressContainer.appendChild(newRepliesBadge);
            jumpBtn.style.borderTopRightRadius = "0";
            jumpBtn.style.borderBottomRightRadius = "0";
          }

          container.appendChild(progressContainer);
        }
      });
  };

  const updateReadIndicatorUI = (targetPostId) => {
    // [核心修复] 在函数入口处直接检查设置状态
    // 如果开关关闭，则强制将目标ID设为null，这将触发后续的隐藏逻辑
    if (!getSettings().showReadIndicator) {
      targetPostId = null;
    }

    if (!readIndicatorElement) {
      readIndicatorElement = document.createElement("div");
      readIndicatorElement.className = "s1p-read-indicator";
      readIndicatorElement.innerHTML = `
                <span class="s1p-read-indicator-icon"></span>
                <span>当前阅读位置</span>
            `;
    }
    const indicator = readIndicatorElement;
    const currentPostId = currentIndicatorParent
      ?.closest('table[id^="pid"]')
      ?.id.replace("pid", "");

    if (targetPostId === currentPostId) {
      return;
    }

    const oldParentPi = currentIndicatorParent;
    const isVisible = !!currentIndicatorParent;

    if (isVisible) {
      indicator.classList.remove("s1p-anim-appear");
      indicator.classList.add("s1p-anim-disappear");
    }

    setTimeout(
      () => {
        let indicatorWidth = 0;
        if (oldParentPi) {
          const oldPti = oldParentPi.querySelector(".pti");
          if (oldPti) {
            oldPti.style.paddingRight = "";
          }
        }
        if (indicator.parentElement) {
          indicatorWidth = indicator.offsetWidth;
          indicator.parentElement.removeChild(indicator);
        }
        currentIndicatorParent = null;

        if (targetPostId) {
          const postTable = document.getElementById(`pid${targetPostId}`);
          const newParentPi = postTable?.querySelector("td.plc .pi");
          if (newParentPi) {
            if (indicatorWidth === 0) {
              newParentPi.appendChild(indicator);
              indicatorWidth = indicator.offsetWidth;
            }
            const newPti = newParentPi.querySelector(".pti");
            const gap = 8;
            if (newPti && indicatorWidth > 0) {
              newPti.style.paddingRight = `${indicatorWidth + gap}px`;
            }
            if (!indicator.parentElement) {
              newParentPi.appendChild(indicator);
            }
            const floorEl = newParentPi.querySelector("strong");
            const actionsEl = newParentPi.querySelector("#fj");
            const rightOffset =
              (floorEl ? floorEl.offsetWidth : 0) +
              (actionsEl ? actionsEl.offsetWidth : 0) +
              gap;
            indicator.style.right = `${rightOffset}px`;
            currentIndicatorParent = newParentPi;

            indicator.classList.remove("s1p-anim-disappear");
            requestAnimationFrame(() => {
              indicator.classList.add("s1p-anim-appear");
            });
          }
        }
      },
      isVisible ? 300 : 0
    );
  };

  let readIndicatorElement = null;
  let currentIndicatorParent = null;
  let pageObserver = null;
  let currentLoggedInUid = null; // [新增] 缓存当前登录用户的UID
  /**
   * [新增 & 修正] 获取当前登录用户的UID
   * (根据用户提供的HTML片段修正了选择器和正则表达式)
   * @returns {string|null} 当前登录用户的UID，如果未找到则返回null
   */
  const getCurrentLoggedInUid = () => {
    if (currentLoggedInUid) {
      return currentLoggedInUid;
    }

    // 方案 1: 查找 #um strong.vwmy a (来自用户截图)
    // <strong class="vwmy"><a href="space-uid-425635.html" ...>moekyo</a></strong>
    let userSpaceLink = document.querySelector(
      '#um strong.vwmy a[href*="space-uid-"]'
    );
    if (userSpaceLink) {
      const match = userSpaceLink.href.match(/space-uid-(\d+)/);
      if (match && match[1]) {
        currentLoggedInUid = match[1];
        // console.log("S1 Plus: 当前登录用户 UID (vwmy) ->", currentLoggedInUid);
        return currentLoggedInUid;
      }
    }

    console.warn(
      "S1 Plus: 无法确定当前登录用户的 UID。屏蔽/标记按钮可能也会显示在自己的帖子上。"
    );
    return null;
  };

  const trackReadProgressInThread = () => {
    const settings = getSettings();
    if (!settings.enableReadProgress || !document.getElementById("postlist"))
      return;

    let threadId = null;
    const threadIdMatch = window.location.href.match(/thread-(\d+)-/);
    if (threadIdMatch) {
      threadId = threadIdMatch[1];
    } else {
      const params = new URLSearchParams(window.location.search);
      threadId = params.get("tid") || params.get("ptid");
    }
    if (!threadId) {
      const tidInput = document.querySelector('input[name="tid"]#tid');
      if (tidInput) {
        threadId = tidInput.value;
      }
    }
    if (!threadId) return;

    let currentPage = "1";
    const threadPageMatch = window.location.href.match(/thread-\d+-(\d+)-/);
    const params = new URLSearchParams(window.location.search);
    if (threadPageMatch) {
      currentPage = threadPageMatch[1];
    } else if (params.has("page")) {
      currentPage = params.get("page");
    } else {
      const currentPageElement = document.querySelector("div.pg strong");
      if (currentPageElement && !isNaN(currentPageElement.textContent.trim())) {
        currentPage = currentPageElement.textContent.trim();
      }
    }

    // --- [核心修改] 确保 pageObserver 只初始化一次，并能监控后续新增的元素 ---

    // 仅当 pageObserver 未被创建时才创建，确保全局唯一
    if (!pageObserver) {
      let visiblePosts = new Map();
      let saveTimeout;

      const getFloorFromElement = (el) => {
        const floorElement = el.querySelector(".pi em");
        return floorElement ? parseInt(floorElement.textContent) || 0 : 0;
      };

      const saveCurrentProgress = () => {
        if (visiblePosts.size === 0) return;
        let maxFloor = 0;
        let finalPostId = null;

        visiblePosts.forEach((floor, postId) => {
          if (floor > maxFloor) {
            maxFloor = floor;
            finalPostId = postId;
          }
        });

        if (finalPostId && maxFloor > 0) {
          if (getSettings().showReadIndicator) {
            updateReadIndicatorUI(finalPostId);
          }
          updateThreadProgress(threadId, finalPostId, currentPage, maxFloor);
        }
      };

      const debouncedSave = () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveCurrentProgress, 1500);
      };

      pageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const postId = entry.target.id.replace("pid", "");
            if (entry.isIntersecting) {
              const floor = getFloorFromElement(entry.target);
              if (floor > 0) {
                visiblePosts.set(postId, floor);
              }
            } else {
              visiblePosts.delete(postId);
            }
          });
          debouncedSave();
        },
        { threshold: 0.3 }
      );

      const finalSave = () => {
        clearTimeout(saveTimeout);
        saveCurrentProgress();
      };

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          finalSave();
        }
      });
      window.addEventListener("beforeunload", finalSave);
    }

    // [新增] 每次函数运行时（包括页面动态变化后），都检查并添加未被监控的帖子
    document.querySelectorAll('table[id^="pid"]').forEach((el) => {
      // 使用一个自定义属性来避免重复添加监控
      if (!el.dataset.s1pObserved) {
        pageObserver.observe(el);
        el.dataset.s1pObserved = "true";
      }
    });
  };

  const refreshAllAuthiActions = () => {
    // 遍历每个由脚本创建的、用于包裹原生按钮和脚本按钮的总容器
    document.querySelectorAll(".s1p-authi-container").forEach((container) => {
      // 在容器中找到原生的 .authi 元素
      const authiDiv = container.querySelector(".authi");
      if (authiDiv) {
        // 将原生 .authi 元素移回其原始位置（即总容器的前面）
        container.parentElement.insertBefore(authiDiv, container);
      }
      // 彻底移除脚本创建的总容器，这样里面的脚本按钮（.s1p-authi-actions-wrapper）也会一并被移除
      container.remove();
    });

    // 在完成彻底的清理后，重新调用主函数，根据当前最新的设置来添加按钮
    addActionsToPostFooter();
  };

  const refreshSinglePostActions = (postId) => {
    const postTable = document.querySelector(`table#pid${postId}`);
    if (!postTable) return;

    const container = postTable.querySelector(".s1p-authi-container");
    if (container) {
      const authiDiv = container.querySelector(".authi");
      if (authiDiv) {
        container.parentElement.insertBefore(authiDiv, container);
      }
      container.remove();
    }
    addActionsToSinglePost(postTable);
  };

  const createTagDeleteConfirmMenu = (anchorElement, tagOptionsAnchor) => {
    // 清理任何已存在的确认菜单
    document
      .querySelector(".s1p-inline-confirm-menu[data-s1p-confirm-for-tag]")
      ?.remove();

    const { userId, userName } = tagOptionsAnchor.dataset;

    const menu = document.createElement("div");
    menu.className = "s1p-options-menu s1p-inline-confirm-menu";
    menu.dataset.s1pConfirmForTag = "true"; // 添加唯一标识
    menu.style.width = "max-content";
    menu.innerHTML = `
        <div class="s1p-direct-confirm">
            <span>确认删除？</span>
            <span class="s1p-confirm-separator"></span>
            <button class="s1p-confirm-action-btn s1p-cancel" title="取消"></button>
            <button class="s1p-confirm-action-btn s1p-confirm" title="确认"></button>
        </div>
    `;
    document.body.appendChild(menu);

    // --- [修正] 智能定位 (修正垂直对齐逻辑) ---
    const anchorRect = anchorElement.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    // 直接将确认菜单的顶部与触发它的“删除标记”按钮的顶部对齐
    const top = anchorRect.top + window.scrollY - 2;

    let left;
    const spaceOnRight = window.innerWidth - anchorRect.right;
    const requiredSpace = menuRect.width + 10;

    if (spaceOnRight >= requiredSpace) {
      // 右侧定位: 在按钮右侧留出 10px 间距
      left = anchorRect.right + window.scrollX + 8;
    } else {
      // [最终修正 V2] 左侧定位:
      // 在理论值 17px 的基础上，增加 7px 的安全边距，总偏移量为 24px。
      // 这足以覆盖浏览器渲染时产生的未知布局偏差。
      left = anchorRect.left + window.scrollX - menuRect.width - 28;
    }

    if (left < window.scrollX) {
      left = window.scrollX + 8;
    }

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;

    // --- 交互逻辑 ---
    let isClosing = false;
    const optionsMenu = anchorElement.closest(".s1p-tag-options-menu");

    const closeAllMenus = () => {
      if (isClosing) return;
      isClosing = true;
      document.removeEventListener("click", closeAllMenusOnClick);

      menu.classList.remove("visible");
      if (optionsMenu) optionsMenu.remove();
      setTimeout(() => menu.remove(), 200);
    };

    const closeAllMenusOnClick = (e) => {
      if (
        !e.target.closest(
          ".s1p-tag-options-menu, .s1p-inline-confirm-menu[data-s1p-confirm-for-tag]"
        )
      ) {
        closeAllMenus();
      }
    };

    menu.querySelector(".s1p-confirm").addEventListener("click", (e) => {
      e.stopPropagation();
      const tags = getUserTags();
      delete tags[userId];
      saveUserTags(tags);
      refreshUserPostsOnPage(userId);
      closeAllMenus();
    });

    menu.querySelector(".s1p-cancel").addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllMenus();
    });

    // 让确认菜单也参与到主菜单的悬停逻辑中
    if (optionsMenu && optionsMenu.s1p_api) {
      menu.addEventListener("mouseenter", optionsMenu.s1p_api.cancelHideTimer);
      menu.addEventListener("mouseleave", optionsMenu.s1p_api.startHideTimer);
    }

    // 添加全局点击监听器，用于在点击空白处时关闭所有菜单
    setTimeout(
      () => document.addEventListener("click", closeAllMenusOnClick),
      0
    );

    // 动画入场
    requestAnimationFrame(() => menu.classList.add("visible"));
  };

  const createOptionsMenu = (anchorElement) => {
    // 如果菜单已存在，则取消其隐藏计时器，防止因快速移入移出导致闪烁
    const existingMenu = document.querySelector(".s1p-tag-options-menu");
    if (existingMenu) {
      if (existingMenu.s1p_api) existingMenu.s1p_api.cancelHideTimer();
      return;
    }

    // 在创建新菜单前，清理所有可能残留的菜单
    document
      .querySelector(".s1p-inline-confirm-menu[data-s1p-confirm-for-tag]")
      ?.remove();

    const { userId, userName } = anchorElement.dataset;
    const menu = document.createElement("div");
    menu.className = "s1p-tag-options-menu";
    menu.innerHTML = `
            <button data-action="edit">编辑标记</button>
            <button data-action="delete" class="s1p-delete">删除标记</button>
        `;
    document.body.appendChild(menu);

    // --- 悬停与计时器逻辑 ---
    let hideTimeout;
    const closeAllMenus = () => {
      menu.remove();
      document
        .querySelector(".s1p-inline-confirm-menu[data-s1p-confirm-for-tag]")
        ?.remove();
    };

    const startHideTimer = () => {
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        const confirmMenu = document.querySelector(
          ".s1p-inline-confirm-menu[data-s1p-confirm-for-tag]"
        );
        // 如果鼠标不在触发点、选项菜单或确认菜单上，则关闭所有
        if (
          !anchorElement.matches(":hover") &&
          !menu.matches(":hover") &&
          (!confirmMenu || !confirmMenu.matches(":hover"))
        ) {
          closeAllMenus();
        }
      }, 300);
    };

    const cancelHideTimer = () => clearTimeout(hideTimeout);

    // 将API附加到菜单元素上，以便其他部分（如确认菜单）可以调用
    menu.s1p_api = { startHideTimer, cancelHideTimer };

    anchorElement.addEventListener("mouseleave", startHideTimer);
    menu.addEventListener("mouseenter", cancelHideTimer);
    menu.addEventListener("mouseleave", startHideTimer);

    // --- 定位 ---
    const rect = anchorElement.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY + 2}px`;
    menu.style.left = `${rect.right + window.scrollX - menu.offsetWidth}px`;

    // --- 按钮事件 ---
    menu.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetButton = e.target.closest("button");
      if (!targetButton) return;
      const action = targetButton.dataset.action;

      if (action === "edit") {
        const popover = document.getElementById("s1p-tag-popover-main");
        if (popover && popover.show) {
          popover.show(anchorElement, userId, userName);
        }
        closeAllMenus();
      } else if (action === "delete") {
        // 点击删除时，取消隐藏计时器并弹出确认菜单
        cancelHideTimer();
        createTagDeleteConfirmMenu(targetButton, anchorElement);
      }
    });

    // 初始调用，防止鼠标快速划过时意外触发关闭
    cancelHideTimer();
  };

  /**
   * [修改] 帖子楼层内操作按钮注入 (V2 - 增加当前用户判断)
   * * @param {HTMLElement} postTable - 帖子的 <table> DOM 元素
   */
  const addActionsToSinglePost = (postTable) => {
    const settings = getSettings();
    const authiDiv = postTable.querySelector(".plc .authi");
    if (!authiDiv) return;

    // --- [核心修改] 将 pi 容器作为操作目标 ---
    const piContainer = authiDiv.closest(".pi");
    if (!piContainer) return;

    // --- [这里是新增的“伸缩器”逻辑] ---
    // 检查并添加永久的布局伸缩器，确保布局稳定
    if (!piContainer.querySelector(".s1p-layout-spacer")) {
      const spacer = document.createElement("div");
      spacer.className = "s1p-layout-spacer";
      piContainer.appendChild(spacer);
    }
    // --- [新增逻辑结束] ---

    if (authiDiv.parentElement.classList.contains("s1p-authi-container")) {
      // --- [新增] 即使容器已存在，也要确保楼层号可见 ---
      const floorNumberEl = piContainer.querySelector("strong");
      if (floorNumberEl) {
        floorNumberEl.classList.add("s1p-layout-ready");
      }
      return;
    }

    const plsCell = postTable.querySelector("td.pls");
    if (!plsCell) return;
    const userProfileLink = plsCell.querySelector('a[href*="space-uid-"]');
    if (!userProfileLink) return;
    const uidMatch = userProfileLink.href.match(/space-uid-(\d+)\.html/);
    const userId = uidMatch ? uidMatch[1] : null; // 这是帖子作者的 UID
    if (!userId) return;

    // --- [新增] 获取当前登录用户的UID，并进行比较 ---
    const loggedInUid = getCurrentLoggedInUid();
    const isCurrentUserPost = loggedInUid && loggedInUid === userId;
    // ------------------------------------------

    const postId = postTable.id.replace("pid", "");
    const floorElement = postTable.querySelector(`#postnum${postId} em`);
    const floor = floorElement ? parseInt(floorElement.textContent, 10) : 0;
    const userName = userProfileLink.textContent.trim();
    const userAvatar = plsCell.querySelector(".avatar img")?.src;

    const newContainer = document.createElement("div");
    newContainer.className = "s1p-authi-container";
    const scriptActionsWrapper = document.createElement("span");
    scriptActionsWrapper.className = "s1p-authi-actions-wrapper";

    if (settings.enableBookmarkReplies) {
      const bookmarkedReplies = getBookmarkedReplies();
      const isBookmarked = !!bookmarkedReplies[postId];
      const pipe = document.createElement("span");
      pipe.className = "pipe";
      pipe.textContent = "|";
      scriptActionsWrapper.appendChild(pipe);
      const bookmarkLink = document.createElement("a");
      bookmarkLink.href = "javascript:void(0);";
      bookmarkLink.className = "s1p-authi-action s1p-bookmark-reply";
      bookmarkLink.textContent = isBookmarked ? "该回复已收藏" : "收藏该回复";
      bookmarkLink.addEventListener("click", (e) => {
        e.preventDefault();
        const currentBookmarks = getBookmarkedReplies();
        const wasBookmarked = !!currentBookmarks[postId];
        if (wasBookmarked) {
          delete currentBookmarks[postId];
          saveBookmarkedReplies(currentBookmarks);
          bookmarkLink.textContent = "收藏该回复";
          showMessage("已取消收藏该回复。", true);
        } else {
          const threadTitleEl = document.querySelector("#thread_subject");
          const threadTitle = threadTitleEl
            ? threadTitleEl.textContent.trim()
            : "未知标题";
          const threadIdMatch = window.location.href.match(/thread-(\d+)-/);
          const params = new URLSearchParams(window.location.search);
          const threadId = threadIdMatch
            ? threadIdMatch[1]
            : params.get("tid") || params.get("ptid");
          const contentEl = postTable.querySelector("td.t_f");

          let postContent = "无法获取内容";
          if (contentEl) {
            const contentClone = contentEl.cloneNode(true);
            contentClone
              .querySelectorAll(
                ".pstatus, .quote, .s1p-image-toggle-all-container, .s1p-quote-placeholder"
              )
              .forEach((el) => el.remove());
            postContent = contentClone.innerText
              .trim()
              .replace(/\n{3,}/g, "\n\n");
          }

          if (!threadId) {
            showMessage("无法获取帖子ID，收藏失败。", false);
            return;
          }
          currentBookmarks[postId] = {
            postId,
            threadId,
            threadTitle,
            floor,
            authorId: userId,
            authorName: userName,
            postContent: postContent,
            timestamp: Date.now(),
          };
          saveBookmarkedReplies(currentBookmarks);
          bookmarkLink.textContent = "该回复已收藏";
          showMessage("已收藏该回复。", true);
        }
      });
      scriptActionsWrapper.appendChild(bookmarkLink);
    }

    if (!isCurrentUserPost) {
      if (settings.enableUserBlocking) {
        const pipe = document.createElement("span");
        pipe.className = "pipe";
        pipe.textContent = "|";
        scriptActionsWrapper.appendChild(pipe);
        const blockLink = document.createElement("a");
        blockLink.href = "javascript:void(0);";
        blockLink.textContent = "屏蔽该用户";
        blockLink.className = "s1p-authi-action s1p-block-user-in-authi";
        blockLink.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const currentSettings = getSettings();
          let confirmText = currentSettings.blockThreadsOnUserBlock
            ? `屏蔽用户并隐藏其主题帖？`
            : `确认屏蔽该用户？`;
          if (currentSettings.syncWithNativeBlacklist) {
            confirmText += " (将同步至论坛黑名单)";
          }

          // 将 e.currentTarget (即被点击的 a 标签)作为第一个参数传入
          createInlineConfirmMenu(e.currentTarget, confirmText, async () => {
            const success = await blockUser(userId, userName);

            const currentSettings = getSettings();
            if (success) {
              const message = currentSettings.syncWithNativeBlacklist
                ? `已屏蔽用户 ${userName} 并同步至论坛黑名单。`
                : `已屏蔽用户 ${userName}。`;
              showMessage(message, true);
            } else {
              showMessage(`脚本内屏蔽成功，但同步论坛黑名单失败。`, false);
            }
          });
        });
        scriptActionsWrapper.appendChild(blockLink);
      }

      if (settings.enableUserTagging) {
        const userTags = getUserTags();
        const userTag = userTags[userId];
        const pipe = document.createElement("span");
        pipe.className = "pipe";
        pipe.textContent = "|";
        scriptActionsWrapper.appendChild(pipe);
        if (userTag && userTag.tag) {
          const tagContainer = document.createElement("span");
          tagContainer.className = "s1p-authi-action s1p-user-tag-container";
          const fullTagText = userTag.tag;
          const tagDisplay = document.createElement("span");
          tagDisplay.className = "s1p-user-tag-display";
          tagDisplay.textContent = `用户标记：${fullTagText}`;
          tagDisplay.dataset.fullTag = fullTagText;
          tagDisplay.removeAttribute("title");
          const optionsIcon = document.createElement("span");
          optionsIcon.className = "s1p-user-tag-options";
          optionsIcon.innerHTML = "&#8942;";
          optionsIcon.dataset.userId = userId;
          optionsIcon.dataset.userName = userName;
          optionsIcon.addEventListener("mouseenter", (e) => {
            e.preventDefault();
            e.stopPropagation();
            createOptionsMenu(e.currentTarget);
          });
          tagContainer.appendChild(tagDisplay);
          tagContainer.appendChild(optionsIcon);
          scriptActionsWrapper.appendChild(tagContainer);
        } else {
          const tagLink = document.createElement("a");
          tagLink.href = "javascript:void(0);";
          tagLink.textContent = "标记该用户";
          tagLink.className = "s1p-authi-action s1p-tag-user-in-authi";
          tagLink.addEventListener("click", (e) => {
            e.preventDefault();
            const popover = document.getElementById("s1p-tag-popover-main");
            if (popover && popover.show) {
              popover.show(e.currentTarget, userId, userName, userAvatar);
            }
          });
          scriptActionsWrapper.appendChild(tagLink);
        }
      }
    }

    if (scriptActionsWrapper.hasChildNodes()) {
      authiDiv.parentElement.insertBefore(newContainer, authiDiv);
      newContainer.appendChild(authiDiv);
      newContainer.appendChild(scriptActionsWrapper);
    }

    const floorNumberEl = piContainer.querySelector("strong");
    if (floorNumberEl) {
      floorNumberEl.classList.add("s1p-layout-ready");
    }
  };

  const addActionsToPostFooter = () => {
    const settings = getSettings();
    if (
      !settings.enableUserBlocking &&
      !settings.enableUserTagging &&
      !settings.enableBookmarkReplies
    )
      return;
    document
      .querySelectorAll('table[id^="pid"]')
      .forEach(addActionsToSinglePost);
  };

  // [新增] S1 NUX 安装推荐函数
  const handleNuxRecommendation = () => {
    // 1. 如果已启用 NUX，则不执行任何操作
    if (isS1NuxEnabled) return;

    // 2. 检查用户是否在设置中关闭了推荐
    const settings = getSettings();
    if (!settings.recommendS1Nux) return;

    // 3. 频率控制：每7天最多推荐一次
    const LAST_REC_KEY = "s1p_last_nux_recommendation_timestamp";
    const lastRecommendationTimestamp = GM_getValue(LAST_REC_KEY, 0);
    const now = Date.now();
    const threeDaysInMillis = 7 * 24 * 60 * 60 * 1000;

    if (now - lastRecommendationTimestamp < threeDaysInMillis) {
      console.log(
        "S1 Plus: S1 NUX recommendation throttled (less than 7 days ago)."
      );
      return;
    }

    // 4. 创建并显示推荐弹窗
    const bodyHtml = `
        <p>检测到您尚未安装 <strong>S1 NUX</strong> 论坛美化扩展。</p>
        <p>S1 Plus 与 S1 NUX 搭配使用可获得最佳论坛浏览体验，强烈推荐安装！</p>
        <div class="s1p-notice" style="margin-top: 16px; gap: 8px;">
             <div class="s1p-notice-icon"></div>
             <div class="s1p-notice-content">
                <a href="https://stage1st.com/2b/thread-1826103-1-2.html" target="_blank">点击此处，了解 S1 NUX 详情</a>
                <p>一个由 S1 用户创作的、旨在优化论坛视觉和交互的 CSS 样式扩展。</p>
             </div>
        </div>
    `;

    const installButton = {
      text: "前往安装",
      className: "s1p-confirm",
      action: () => {
        GM_openInTab("https://userstyles.world/style/539", true);
        const currentSettings = getSettings();
        if (currentSettings.recommendS1Nux) {
          currentSettings.recommendS1Nux = false;
          saveSettings(currentSettings);
        }
      },
    };

    const disableButton = {
      text: "不再提示",
      className: "s1p-cancel",
      action: () => {
        const currentSettings = getSettings();
        currentSettings.recommendS1Nux = false;
        saveSettings(currentSettings);
        showMessage("好的，将不再为您推荐 S1 NUX。", true);
      },
    };

    // [核心修改] 调用时传入 modalClassName
    createAdvancedConfirmationModal(
      "S1 Plus 体验升级推荐",
      bodyHtml,
      [disableButton, installButton],
      { modalClassName: "s1p-nux-recommend-modal" }
    );

    // 5. 更新推荐时间戳
    GM_setValue(LAST_REC_KEY, now);
  };

  /**
   * [修改] 自动签到 (V2 - 支持多账号)
   * 修正了多账号切换时，签到记录互相干扰的问题。
   */
  function autoSign() {
    const checkinLink = document.querySelector(
      'a[href*="study_daily_attendance-daily_attendance.html"]'
    );
    if (!checkinLink) return;

    // --- [新增] 获取当前用户UID ---
    const uid = getCurrentLoggedInUid();
    if (!uid) {
      // 如果没有UID（未登录），则不执行签到
      return;
    }
    const signedDateKey = `signedDate_${uid}`; // <-- [修改] Key 变为 per-user
    // ----------------------------

    var now = new Date();
    var date =
      now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    var signedDate = GM_getValue(signedDateKey); // <-- [修改]

    if (signedDate == date) {
      checkinLink.style.display = "none";
      return;
    }

    if (now.getHours() < 6) return;

    GM_xmlhttpRequest({
      method: "GET",
      url: checkinLink.href,
      onload: function (response) {
        GM_setValue(signedDateKey, date); // <-- [修改]
        checkinLink.style.display = "none";
        console.log(
          `S1 Plus: Auto check-in for UID ${uid} sent. Status:`,
          response.status
        );
      },
      onerror: function (response) {
        console.error(
          `S1 Plus: Auto check-in for UID ${uid} failed.`,
          response
        );
      },
    });
  }
  // [修改] 将设置项重命名为 enhanceFloatingControls
  const createCustomFloatingControls = () => {
    // 1. 如果自定义控件已存在，则直接退出
    if (document.getElementById("s1p-floating-controls-wrapper")) {
      return;
    }

    // 2. 从原生 #scrolltop 控件中搜集信息
    const originalContainer = document.getElementById("scrolltop");
    let replyAction = null;
    let returnAction = null;
    if (originalContainer) {
      const replyLink = originalContainer.querySelector("a.replyfast");
      if (replyLink) {
        replyAction = {
          href: replyLink.href,
          onclick: replyLink.onclick,
          title: replyLink.title,
        };
      }
      const returnLink = originalContainer.querySelector(
        "a.returnboard, a.returnlist"
      );
      if (returnLink) {
        returnAction = { href: returnLink.href, title: returnLink.title };
      }
    }

    // 3. 定义SVG图标
    const svgs = {
      scrollTop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 13.9142L16.7929 18.7071L18.2071 17.2929L12 11.0858L5.79289 17.2929L7.20711 18.7071L12 13.9142ZM6 7L18 7V9L6 9L6 7Z"></path></svg>`,
      scrollBottom: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.0858L7.20711 5.29291L5.79289 6.70712L12 12.9142L18.2071 6.70712L16.7929 5.29291L12 10.0858ZM18 17L6 17L6 15L18 15V17Z"></path></svg>`,
      reply: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 22.5L11.2 19H6C5.44772 19 5 18.5523 5 18V7.10256C5 6.55028 5.44772 6.10256 6 6.10256H22C22.5523 6.10256 23 6.55028 23 7.10256V18C23 18.5523 22.5523 19 22 19H16.8L14 22.5ZM15.8387 17H21V8.10256H7V17H11.2H12.1613L14 19.2984L15.8387 17ZM2 2H19V4H3V15H1V3C1 2.44772 1.44772 2 2 2Z"></path></svg>`,
      board: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4ZM4 5V19H20V5H4ZM6 7H8V9H6V7ZM8 11H6V13H8V11ZM6 15H8V17H6V15ZM18 7H10V9H18V7ZM10 15H18V17H10V15ZM18 11H10V13H18V11Z"></path></svg>`,
    };

    // 4. 创建DOM结构
    const wrapper = document.createElement("div");
    wrapper.id = "s1p-floating-controls-wrapper";
    // [核心修改] 读取新命名的设置并添加对应的class
    const settings = getSettings();
    if (settings.enhanceFloatingControls) {
      wrapper.classList.add("s1p-hover-interaction-enabled");
    }

    const handle = document.createElement("div");
    handle.id = "s1p-controls-handle";

    const panel = document.createElement("div");
    panel.id = "s1p-floating-controls";

    // 5. 创建按钮并添加到 panel 中
    const createButton = (title, className, svg, href, onclick) => {
      const link = document.createElement("a");
      link.title = title;
      link.className = className;
      link.innerHTML = svg;
      if (href) link.href = href;
      if (onclick) link.onclick = onclick;
      return link;
    };

    if (replyAction) {
      panel.appendChild(
        createButton(
          replyAction.title,
          "",
          svgs.reply,
          replyAction.href,
          replyAction.onclick
        )
      );
    }
    const scrollTopBtn = createButton(
      "返回顶部",
      "s1p-scroll-btn",
      svgs.scrollTop,
      "javascript:void(0);",
      (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    );
    const scrollBottomBtn = createButton(
      "返回底部",
      "s1p-scroll-btn",
      svgs.scrollBottom,
      "javascript:void(0);",
      (e) => {
        e.preventDefault();
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }
    );
    panel.appendChild(scrollTopBtn);
    panel.appendChild(scrollBottomBtn);
    if (returnAction) {
      panel.appendChild(
        createButton(
          returnAction.title,
          "",
          svgs.board,
          returnAction.href,
          null
        )
      );
    }

    // 6. 组装并添加到页面
    wrapper.appendChild(panel);
    wrapper.appendChild(handle);
    document.body.appendChild(wrapper);
  };

  // --- [新增] 悬浮控件管理器 ---
  const manageFloatingControls = () => {
    const settings = getSettings();
    // 根据设置，切换body上的class，从而激活不同的CSS规则
    document.body.classList.toggle(
      "s1p-enhanced-controls-active",
      settings.enhanceFloatingControls
    );

    if (settings.enhanceFloatingControls) {
      // 如果设置为开启，则调用创建函数（它内部有防重复机制）
      createCustomFloatingControls();
    } else {
      // 如果设置为关闭，则确保移除脚本创建的控件
      document.getElementById("s1p-floating-controls-wrapper")?.remove();
    }
  };

  const cleanupOldReadProgress = () => {
    const settings = getSettings();
    if (
      !settings.readingProgressCleanupDays ||
      settings.readingProgressCleanupDays <= 0
    )
      return;
    const progress = getReadProgress();
    const originalCount = Object.keys(progress).length;
    if (originalCount === 0) return;

    const now = Date.now();
    const maxAge = settings.readingProgressCleanupDays * 24 * 60 * 60 * 1000;
    const cleanedProgress = {};
    let cleanedCount = 0;

    for (const threadId in progress) {
      if (Object.prototype.hasOwnProperty.call(progress, threadId)) {
        const record = progress[threadId];
        if (record.timestamp && now - record.timestamp < maxAge) {
          cleanedProgress[threadId] = record;
        } else {
          cleanedCount++;
        }
      }
    }

    if (cleanedCount > 0) {
      console.log(
        `S1 Plus: Cleaned up ${cleanedCount} old reading progress records (older than ${settings.readingProgressCleanupDays} days).`
      );
      // [S1PLUS-CLEANUP-FIX] 标记已发生清理，等待用户同步确认
      GM_setValue("s1p_pending_cleanup_info", cleanedCount);
      // [核心] 必须保留 true，以防止干扰启动时同步检查
      saveReadProgress(cleanedProgress, true);
    }
  };
  const handlePerLoadSyncCheck = async () => {
    const settings = getSettings();

    if (!settings.syncDailyFirstLoad && settings.syncAutoEnabled) {
      console.log("S1 Plus: 执行常规启动时同步检查（因每日首次同步已关闭）...");
      // [S1P-FIX] 调用时传入 true，启用启动安全模式
      const result = await performAutoSync(true);
      if (result.status === "success" && result.action === "pulled") {
        showMessage("检测到云端有更新，正在刷新页面...", true);
        setTimeout(() => location.reload(), 1500);
        return true;
      }
    }
    return false;
  };
  const handleStartupSync = async () => {
    const settings = getSettings();
    if (!settings.syncRemoteEnabled || !settings.syncDailyFirstLoad) {
      return false;
    }

    const today = new Date().toLocaleDateString("sv");
    const lastSyncDate = GM_getValue("s1p_last_daily_sync_date", null);

    if (today === lastSyncDate) {
      return false;
    }

    const SYNC_LOCK_KEY = "s1p_sync_lock";
    const SYNC_LOCK_TIMEOUT_MS = 60 * 1000;

    const lockTimestamp = GM_getValue(SYNC_LOCK_KEY, 0);
    if (Date.now() - lockTimestamp < SYNC_LOCK_TIMEOUT_MS) {
      console.log(
        "S1 Plus: 检测到另一个标签页可能正在同步，本次启动同步已跳过。"
      );
      return false;
    }

    GM_setValue(SYNC_LOCK_KEY, Date.now());

    try {
      const currentDateAfterLock = GM_getValue(
        "s1p_last_daily_sync_date",
        null
      );
      if (currentDateAfterLock === today) {
        console.log("S1 Plus: 在锁定期间检测到同步已完成，已取消重复操作。");
        return false;
      }

      console.log("S1 Plus: 正在执行每日首次加载同步...");
      GM_setValue("s1p_last_daily_sync_date", today);

      const result = await performAutoSync(true);

      switch (result.status) {
        case "success":
          // [修改] 增加对 "force_pulled" 状态的处理
          if (result.action === "pulled" || result.action === "force_pulled") {
            const message =
              result.action === "force_pulled"
                ? "启动时强制同步完成：已使用云端数据覆盖本地。正在刷新..."
                : "每日同步完成：云端有更新已被自动拉取。正在刷新...";
            showMessage(message, true);
            setTimeout(() => location.reload(), 1500);
            return true;
          } else if (result.action === "skipped_push_on_startup") {
            createAdvancedConfirmationModal(
              "检测到本地有未同步的更改",
              "<p>S1 Plus 在启动时发现，您的本地数据比云端备份要新。这可能意味着您在其他设备的工作未推送，或有离线修改未同步。</p><p>为防止数据丢失，自动同步已暂停。请选择如何处理：</p>",
              [
                {
                  text: "稍后处理",
                  className: "s1p-cancel",
                  action: () => {
                    showMessage("同步已暂停，您可稍后从导航栏手动同步。", null);
                  },
                },
                {
                  text: "立即解决",
                  className: "s1p-confirm",
                  action: () => {
                    // [S1P-UX-FIX] 调用时传入 true，进入静默模式，避免弹出多余的提示
                    handleManualSync(true);
                  },
                },
              ]
            );
          } else {
            if (result.action !== "pushed_initial") {
              showMessage("每日首次同步完成，数据已是最新。", true);
            }
          }
          break;
        case "failure":
          showMessage(`每日首次同步失败: ${result.error}`, false);
          break;

        case "conflict":
          createAdvancedConfirmationModal(
            "检测到同步冲突",
            "<p>S1 Plus在自动同步时发现，您的本地数据和云端备份可能都已更改。</p><p>为防止数据丢失，自动同步已暂停。请手动选择要保留的版本来解决冲突。</p>",
            [
              {
                text: "稍后处理",
                className: "s1p-cancel",
                action: () => {
                  showMessage("同步已暂停，您可以在设置中手动同步。", null);
                },
              },
              {
                text: "立即解决",
                className: "s1p-confirm",
                action: () => {
                  // [S1P-UX-FIX] 此处也应进入静默模式
                  handleManualSync(true);
                },
              },
            ]
          );
          break;
      }
    } finally {
      GM_deleteValue(SYNC_LOCK_KEY);
      console.log("S1 Plus: 同步锁已释放。");
    }

    return false;
  };

  /**
   * [MODIFIED] 首次加载此版本时，显示更新亮点弹窗，并返回是否显示了弹窗。
   * @returns {boolean} 如果显示了弹窗则返回 true，否则返回 false。
   */
  const showFirstTimeWelcomeIfNeeded = () => {
    // [OPTIMIZED] 动态生成欢迎标记的键，确保每个版本只显示一次
    const WELCOME_FLAG_KEY = `s1p_v${SCRIPT_VERSION.replace(
      /\./g,
      "_"
    )}_welcomed`;
    const hasSeenWelcome = GM_getValue(WELCOME_FLAG_KEY, false);

    if (hasSeenWelcome) {
      return false; // 已看过，不显示弹窗，返回 false
    }

    // [OPTIMIZED] 优化HTML结构以改善文本布局和换行
    const bodyHtml = `
    <p>已更新至 v${SCRIPT_VERSION}！本次更新包含一项同步逻辑修复：</p>
    <p style="margin-top: 16px;">
        修复了因“自动清理阅读记录”功能导致的同步冲突、循环弹窗、以及每日设置被重置等一系列问题。
    </p>
    <p style="margin-top: 8px;">
        现在，脚本能够更智能地处理数据同步，确保您的设置和浏览进度在多设备间可靠同步。
    </p>
  `;

    const buttons = [
      {
        text: "我明白了",
        className: "s1p-confirm",
        action: () => {
          GM_setValue(WELCOME_FLAG_KEY, true);
        },
      },
    ];

    // [OPTIMIZED] 动态获取版本号
    createAdvancedConfirmationModal(
      `S1 Plus v${SCRIPT_VERSION} 更新亮点`,
      bodyHtml,
      buttons,
      {
        modalClassName: "s1p-welcome-modal",
      }
    );

    return true; // 确认显示了弹窗，返回 true
  };

  async function main() {
    // [修改] 调用欢迎弹窗并接收其状态
    const welcomePopupWasShown = showFirstTimeWelcomeIfNeeded();

    // --- [核心修改] 按照您的建议，分离启动同步的调用 ---
    // 步骤1: 尝试执行每日首次同步
    const isReloadingAfterDailySync = await handleStartupSync();
    if (isReloadingAfterDailySync) {
      return; // 如果页面即将刷新，则中断后续所有脚本初始化操作
    }
    // 步骤2: 尝试执行常规的“每次加载”同步检查
    const isReloadingAfterPerLoadSync = await handlePerLoadSyncCheck();
    if (isReloadingAfterPerLoadSync) {
      return; // 如果页面即将刷新，则中断后续所有脚本初始化操作
    }

    cleanupOldReadProgress();
    detectS1Nux();

    // [核心修正] 只有在未显示欢迎弹窗时，才检查NUX推荐，避免冲突
    if (!welcomePopupWasShown) {
      handleNuxRecommendation();
    }

    initializeNavbar();
    initializeGenericDisplayPopover();

    const observerCallback = (mutations, observer) => {
      const navNeedsReinit = !document.getElementById("s1p-nav-link");
      observer.disconnect();
      if (navNeedsReinit) {
        console.log("S1 Plus: 检测到导航栏被重置，正在重新应用自定义设置。");
        initializeNavbar();
      }
      applyChanges();
      const watchTarget = document.getElementById("wp") || document.body;
      observer.observe(watchTarget, { childList: true, subtree: true });
    };

    const observer = new MutationObserver(observerCallback);
    applyChanges();
    const watchTarget = document.getElementById("wp") || document.body;
    observer.observe(watchTarget, { childList: true, subtree: true });
  }

  function applyChanges() {
    const settings = getSettings();

    manageFloatingControls(); // <-- [核心修改]

    if (settings.enablePostBlocking) {
      hideBlockedThreads();
      hideThreadsByTitleKeyword();
      addBlockButtonsToThreads();
      applyUserThreadBlocklist();
    }
    if (settings.enableUserBlocking) {
      hideBlockedUsersPosts();
      hideBlockedUserQuotes();
      hideBlockedUserRatings();
      hideBlockedUserNotifications(); // [新增] 调用提醒屏蔽函数
    }
    if (
      settings.enableUserBlocking ||
      settings.enableUserTagging ||
      settings.enableBookmarkReplies
    ) {
      addActionsToPostFooter();
    }
    if (settings.enableUserTagging) {
      initializeTaggingPopover();
    }
    if (settings.enableReadProgress) {
      addProgressJumpButtons();
    }

    applyInterfaceCustomizations();
    applyImageHiding();
    manageImageToggleAllButtons();
    renameAuthorLinks();
    applyGlobalLinkBehavior(); // <--- MODIFIED
    trackReadProgressInThread();
    try {
      autoSign();
    } catch (e) {
      console.error("S1 Plus: Error caught while running autoSign():", e);
    }
  }

  main();
})();
