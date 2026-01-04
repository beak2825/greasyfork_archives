// ==UserScript==
// @name         Universal Discussions Copy Plugin
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  通用论坛内容复制插件，支持 Markdown、HTML、PDF、PNG 格式导出，兼容多个主流论坛平台
// @author       dext7r
// @match        *://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/turndown/7.1.2/turndown.min.js
// @downloadURL https://update.greasyfork.org/scripts/539000/Universal%20Discussions%20Copy%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/539000/Universal%20Discussions%20Copy%20Plugin.meta.js
// ==/UserScript==

// {{CHENGQI:
// Action: Added; Timestamp: 2025-06-10 14:09:34 +08:00; Reason: P1-AR-001 创建通用平台检测架构; Principle_Applied: SOLID-S (单一职责原则);
// }}

(function () {
  'use strict';

  // 配置和常量
  const CONFIG = {
    DEBUG: true,
    VERSION: '2.0.0',
    PLUGIN_NAME: 'UniversalDiscussionsCopier',
    SHORTCUTS: {
      TOGGLE_PANEL: 'KeyC', // Ctrl/Cmd + Shift + C
    }
  };

  // 日志系统
  const Logger = {
    log: (...args) => CONFIG.DEBUG && console.log(`[${CONFIG.PLUGIN_NAME}]`, ...args),
    error: (...args) => console.error(`[${CONFIG.PLUGIN_NAME}]`, ...args),
    warn: (...args) => CONFIG.DEBUG && console.warn(`[${CONFIG.PLUGIN_NAME}]`, ...args)
  };

  // 平台检测配置
  const PLATFORM_CONFIGS = {
    github: {
      name: 'GitHub Discussions',
      detect: () => window.location.hostname.includes('github.com') &&
        (window.location.pathname.includes('/discussions/') ||
          document.querySelector('[data-testid="discussion-timeline"]')),
      selectors: {
        container: '[data-testid="discussion-timeline"], .js-discussion-timeline, .discussion-timeline',
        title: 'h1.gh-header-title, .js-issue-title, [data-testid="discussion-title"]',
        content: '.timeline-comment-wrapper, .discussion-timeline-item, .js-timeline-item',
        author: '.timeline-comment-header .author, .discussion-timeline-item .author'
      }
    },
    reddit: {
      name: 'Reddit',
      detect: () => window.location.hostname.includes('reddit.com') &&
        (document.querySelector('[data-testid="post-content"]') ||
          document.querySelector('.Post')),
      selectors: {
        container: '[data-testid="post-content"], .Post, .thing.link',
        title: 'h1, [data-testid="post-content"] h3, .Post h3',
        content: '[data-testid="post-content"], .Post .usertext-body, .md',
        author: '.author, [data-testid="comment_author_link"]'
      }
    },
    stackoverflow: {
      name: 'Stack Overflow',
      detect: () => window.location.hostname.includes('stackoverflow.com') &&
        (document.querySelector('.question') || document.querySelector('#question')),
      selectors: {
        container: '.question, #question, .answer',
        title: '.question-hyperlink, h1[itemprop="name"]',
        content: '.postcell, .post-text, .s-prose',
        author: '.user-details, .user-info'
      }
    },
    discourse: {
      name: 'Discourse',
      detect: () => document.querySelector('meta[name="generator"]')?.content?.includes('Discourse') ||
        document.querySelector('.discourse-root') ||
        window.location.pathname.includes('/t/'),
      selectors: {
        container: '.topic-post, .post-stream, #topic',
        title: '.fancy-title, h1.title, .topic-title',
        content: '.post, .cooked, .topic-body',
        author: '.username, .post-username'
      }
    },
    v2ex: {
      name: 'V2EX',
      detect: () => window.location.hostname.includes('v2ex.com') &&
        (document.querySelector('.topic_content') || document.querySelector('#topic')),
      selectors: {
        container: '.topic_content, #topic, .reply_content',
        title: '.header h1, .topic_title',
        content: '.topic_content, .reply_content',
        author: '.username, .dark'
      }
    },
    generic: {
      name: 'Generic Forum',
      detect: () => true, // 总是返回true作为后备方案
      selectors: {
        container: 'article, main, .content, .post, .thread, .topic',
        title: 'h1, h2, .title, .subject',
        content: '.content, .message, .post-content, .body, p',
        author: '.author, .username, .user'
      }
    }
  };

  // 内嵌 TailwindCSS 核心样式
  const EMBEDDED_STYLES = `
    /* TailwindCSS 核心类 */
    .tw-fixed { position: fixed !important; }
    .tw-absolute { position: absolute !important; }
    .tw-relative { position: relative !important; }
    .tw-top-4 { top: 1rem !important; }
    .tw-right-4 { right: 1rem !important; }
    .tw-bottom-4 { bottom: 1rem !important; }
    .tw-z-50 { z-index: 50 !important; }
    .tw-z-40 { z-index: 40 !important; }
    .tw-bg-white { background-color: #ffffff !important; }
    .tw-bg-blue-500 { background-color: #3b82f6 !important; }
    .tw-bg-blue-600 { background-color: #2563eb !important; }
    .tw-bg-gray-500 { background-color: #6b7280 !important; }
    .tw-bg-orange-500 { background-color: #f97316 !important; }
    .tw-bg-red-500 { background-color: #ef4444 !important; }
    .tw-bg-purple-500 { background-color: #8b5cf6 !important; }
    .tw-bg-green-50 { background-color: #f0fdf4 !important; }
    .tw-text-white { color: #ffffff !important; }
    .tw-text-gray-600 { color: #4b5563 !important; }
    .tw-text-gray-800 { color: #1f2937 !important; }
    .tw-text-green-600 { color: #059669 !important; }
    .tw-border { border-width: 1px !important; }
    .tw-border-gray-200 { border-color: #e5e7eb !important; }
    .tw-border-green-200 { border-color: #bbf7d0 !important; }
    .tw-rounded-lg { border-radius: 0.5rem !important; }
    .tw-rounded-full { border-radius: 9999px !important; }
    .tw-rounded { border-radius: 0.25rem !important; }
    .tw-shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
    .tw-shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }
    .tw-p-4 { padding: 1rem !important; }
    .tw-p-3 { padding: 0.75rem !important; }
    .tw-px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
    .tw-py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
    .tw-py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
    .tw-m-1 { margin: 0.25rem !important; }
    .tw-mb-3 { margin-bottom: 0.75rem !important; }
    .tw-mb-4 { margin-bottom: 1rem !important; }
    .tw-w-80 { width: 20rem !important; }
    .tw-w-14 { width: 3.5rem !important; }
    .tw-h-14 { height: 3.5rem !important; }
    .tw-w-full { width: 100% !important; }
    .tw-w-1\\/2 { width: 50% !important; }
    .tw-flex { display: flex !important; }
    .tw-inline-block { display: inline-block !important; }
    .tw-hidden { display: none !important; }
    .tw-items-center { align-items: center !important; }
    .tw-justify-center { justify-content: center !important; }
    .tw-justify-between { justify-content: space-between !important; }
    .tw-text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
    .tw-text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
    .tw-text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
    .tw-font-semibold { font-weight: 600 !important; }
    .tw-font-medium { font-weight: 500 !important; }
    .tw-cursor-pointer { cursor: pointer !important; }
    .tw-cursor-not-allowed { cursor: not-allowed !important; }
    .tw-transition-all { transition-property: all !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
    .tw-transform { transform: translateX(0) !important; }
    .tw-translate-x-full { transform: translateX(100%) !important; }
    .tw-translate-x-0 { transform: translateX(0) !important; }
    .tw-opacity-0 { opacity: 0 !important; }
    .tw-opacity-100 { opacity: 1 !important; }
    .hover\\:tw-bg-blue-600:hover { background-color: #2563eb !important; }
    .hover\\:tw-bg-gray-600:hover { background-color: #4b5563 !important; }
    .hover\\:tw-text-gray-700:hover { color: #374151 !important; }
    .disabled\\:tw-bg-gray-400:disabled { background-color: #9ca3af !important; }
    .disabled\\:tw-cursor-not-allowed:disabled { cursor: not-allowed !important; }

    /* 自定义样式 */
    .copier-highlight { outline: 2px solid #3b82f6 !important; outline-offset: 2px !important; background-color: rgba(59, 130, 246, 0.1) !important; }
    .copier-selected { outline: 2px solid #10b981 !important; outline-offset: 2px !important; background-color: rgba(16, 185, 129, 0.1) !important; }
    .copier-panel-enter { animation: slideInRight 0.3s ease-out !important; }
    .copier-panel-exit { animation: slideOutRight 0.3s ease-in !important; }
    
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;

  // 全局状态管理
  class AppState {
    constructor() {
      this.selectedContent = null;
      this.currentPlatform = null;
      this.isSelectionMode = false;
      this.isInitialized = false;
      this.ui = {
        panel: null,
        trigger: null
      };
    }

    reset() {
      this.selectedContent = null;
      this.isSelectionMode = false;
      this.clearHighlights();
    }

    clearHighlights() {
      document.querySelectorAll('.copier-highlight, .copier-selected').forEach(el => {
        el.classList.remove('copier-highlight', 'copier-selected');
      });
    }
  }

  // 平台检测器
  class PlatformDetector {
    static detect() {
      Logger.log('开始检测平台...');

      for (const [key, config] of Object.entries(PLATFORM_CONFIGS)) {
        if (key === 'generic') continue; // 跳过通用配置

        try {
          if (config.detect()) {
            Logger.log(`检测到平台: ${config.name}`);
            return { key, ...config };
          }
        } catch (error) {
          Logger.error(`平台检测错误 (${key}):`, error);
        }
      }

      Logger.log('使用通用平台配置');
      return { key: 'generic', ...PLATFORM_CONFIGS.generic };
    }

    static getSelectors(platform) {
      return platform?.selectors || PLATFORM_CONFIGS.generic.selectors;
    }
  }

  // 内容选择器
  class ContentSelector {
    constructor(appState, platform) {
      this.appState = appState;
      this.platform = platform;
      this.selectors = PlatformDetector.getSelectors(platform);
    }

    enable() {
      Logger.log('启用内容选择模式');
      this.appState.isSelectionMode = true;
      document.body.style.cursor = 'crosshair';

      // 添加事件监听器
      document.addEventListener('mouseover', this.handleMouseOver, true);
      document.addEventListener('mouseout', this.handleMouseOut, true);
      document.addEventListener('click', this.handleClick, true);
      document.addEventListener('keydown', this.handleKeyDown, true);
    }

    disable() {
      Logger.log('禁用内容选择模式');
      this.appState.isSelectionMode = false;
      document.body.style.cursor = '';
      this.appState.clearHighlights();

      // 移除事件监听器
      document.removeEventListener('mouseover', this.handleMouseOver, true);
      document.removeEventListener('mouseout', this.handleMouseOut, true);
      document.removeEventListener('click', this.handleClick, true);
      document.removeEventListener('keydown', this.handleKeyDown, true);
    }

    handleMouseOver = (e) => {
      if (!this.appState.isSelectionMode) return;

      const target = this.findSelectableContent(e.target);
      if (target && !target.classList.contains('copier-selected')) {
        target.classList.add('copier-highlight');
      }
    }

    handleMouseOut = (e) => {
      if (!this.appState.isSelectionMode) return;
      e.target.classList.remove('copier-highlight');
    }

    handleClick = (e) => {
      if (!this.appState.isSelectionMode) return;

      e.preventDefault();
      e.stopPropagation();

      const target = this.findSelectableContent(e.target);
      if (target) {
        this.selectContent(target);
        this.disable();
      }
    }

    handleKeyDown = (e) => {
      if (!this.appState.isSelectionMode) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.disable();
        UI.updatePanelState();
      }
    }

    findSelectableContent(element) {
      // 尝试匹配平台特定的选择器
      for (const selector of Object.values(this.selectors)) {
        try {
          if (element.matches && element.matches(selector)) {
            return element;
          }

          const parent = element.closest(selector);
          if (parent) {
            return parent;
          }
        } catch (error) {
          // 忽略无效选择器错误
        }
      }

      // 通用内容检测
      if (this.isContentElement(element)) {
        return element;
      }

      return element.closest('article, .post, .comment, .message, .content') || element;
    }

    isContentElement(element) {
      const contentTags = ['ARTICLE', 'SECTION', 'MAIN', 'DIV', 'P'];
      const excludeClasses = ['nav', 'header', 'footer', 'sidebar', 'menu', 'toolbar'];

      if (!contentTags.includes(element.tagName)) return false;

      const className = element.className.toLowerCase();
      if (excludeClasses.some(cls => className.includes(cls))) return false;

      // 检查内容长度
      const textContent = element.textContent?.trim() || '';
      return textContent.length > 20;
    }

    selectContent(element) {
      this.appState.reset();
      this.appState.selectedContent = element;
      element.classList.add('copier-selected');

      Logger.log('内容已选择:', {
        tag: element.tagName,
        classes: element.className,
        textLength: element.textContent?.length || 0
      });

      UI.updatePanelState();
    }
  }

  // 导出管理器
  class ExportManager {
    constructor(appState, platform) {
      this.appState = appState;
      this.platform = platform;
    }

    generateFileName(format) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const platformName = this.platform?.key || 'unknown';
      return `${platformName}_content_${timestamp}.${format}`;
    }

    getCleanContent(options = {}) {
      const { includeImages = true, includeStyles = false } = options;

      if (!this.appState.selectedContent) {
        Logger.error('没有选择的内容');
        return null;
      }

      const clone = this.appState.selectedContent.cloneNode(true);

      // 清理样式类
      clone.classList.remove('copier-selected', 'copier-highlight');
      clone.querySelectorAll('.copier-selected, .copier-highlight').forEach(el => {
        el.classList.remove('copier-selected', 'copier-highlight');
      });

      // 处理图片
      if (!includeImages) {
        clone.querySelectorAll('img').forEach(el => el.remove());
      }

      // 处理样式
      if (!includeStyles) {
        clone.querySelectorAll('*').forEach(el => {
          el.removeAttribute('style');
          if (!includeImages) {
            el.removeAttribute('class');
          }
        });
      }

      // 清理脚本和不必要的元素
      clone.querySelectorAll('script, style, noscript').forEach(el => el.remove());

      return clone;
    }

    async exportToMarkdown() {
      try {
        const content = this.getCleanContent();
        if (!content) return;

        if (typeof TurndownService === 'undefined') {
          throw new Error('TurndownService 未加载');
        }

        const turndownService = new TurndownService({
          headingStyle: 'atx',
          codeBlockStyle: 'fenced',
          emDelimiter: '*'
        });

        const markdown = turndownService.turndown(content.innerHTML);
        this.downloadFile(markdown, this.generateFileName('md'), 'text/markdown');

        Logger.log('Markdown 导出成功');
        return true;
      } catch (error) {
        Logger.error('Markdown 导出失败:', error);
        this.showError('Markdown 导出失败');
        return false;
      }
    }

    async exportToHTML() {
      try {
        const content = this.getCleanContent({ includeStyles: true });
        if (!content) return;

        const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>导出内容 - ${this.platform?.name || '未知平台'}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px; 
      color: #333;
    }
    img { max-width: 100%; height: auto; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
  </style>
</head>
<body>
  <header>
    <h1>内容导出</h1>
    <p><strong>来源:</strong> ${this.platform?.name || '未知平台'}</p>
    <p><strong>导出时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
    <p><strong>原始URL:</strong> <a href="${window.location.href}">${window.location.href}</a></p>
    <hr>
  </header>
  <main>
    ${content.innerHTML}
  </main>
</body>
</html>`;

        this.downloadFile(html, this.generateFileName('html'), 'text/html');
        Logger.log('HTML 导出成功');
        return true;
      } catch (error) {
        Logger.error('HTML 导出失败:', error);
        this.showError('HTML 导出失败');
        return false;
      }
    }

    async exportToPDF() {
      try {
        const content = this.getCleanContent({ includeStyles: true });
        if (!content) return;

        if (typeof window.jspdf === 'undefined') {
          throw new Error('jsPDF 未加载');
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // 创建临时容器用于渲染
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `
          position: absolute;
          top: -9999px;
          left: -9999px;
          width: 800px;
          background: white;
          padding: 20px;
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        `;

        tempDiv.innerHTML = `
          <h1>内容导出</h1>
          <p><strong>来源:</strong> ${this.platform?.name || '未知平台'}</p>
          <p><strong>导出时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
          <hr>
          ${content.innerHTML}
        `;

        document.body.appendChild(tempDiv);

        // 使用 html2canvas 转换为图片
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        // 添加第一页
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // 添加额外页面
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 10;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(this.generateFileName('pdf'));
        document.body.removeChild(tempDiv);

        Logger.log('PDF 导出成功');
        return true;
      } catch (error) {
        Logger.error('PDF 导出失败:', error);
        this.showError('PDF 导出失败');
        return false;
      }
    }

    async exportToPNG() {
      try {
        const content = this.appState.selectedContent;
        if (!content) return;

        if (typeof html2canvas === 'undefined') {
          throw new Error('html2canvas 未加载');
        }

        const canvas = await html2canvas(content, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        // 创建下载链接
        const link = document.createElement('a');
        link.download = this.generateFileName('png');
        link.href = canvas.toDataURL();
        link.click();

        Logger.log('PNG 导出成功');
        return true;
      } catch (error) {
        Logger.error('PNG 导出失败:', error);
        this.showError('PNG 导出失败');
        return false;
      }
    }

    downloadFile(content, filename, mimeType) {
      try {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        Logger.error('文件下载失败:', error);
        this.showError('文件下载失败');
      }
    }

    showError(message) {
      // 显示错误提示
      const errorDiv = document.createElement('div');
      errorDiv.className = 'tw-fixed tw-top-4 tw-left-1/2 tw-transform tw--translate-x-1/2 tw-bg-red-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-shadow-lg tw-z-50';
      errorDiv.textContent = message;
      document.body.appendChild(errorDiv);

      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 3000);
    }
  }

  // UI 管理器
  class UI {
    static init(appState, platform) {
      this.appState = appState;
      this.platform = platform;
      this.contentSelector = new ContentSelector(appState, platform);
      this.exportManager = new ExportManager(appState, platform);

      this.injectStyles();
      this.createTriggerButton();
      this.createPanel();
      this.bindEvents();

      Logger.log('UI 初始化完成');
    }

    static injectStyles() {
      const styleEl = document.createElement('style');
      styleEl.id = 'universal-copier-styles';
      styleEl.textContent = EMBEDDED_STYLES;
      document.head.appendChild(styleEl);
    }

    static createTriggerButton() {
      const button = document.createElement('button');
      button.id = 'universal-copier-trigger';
      button.className = 'tw-fixed tw-bottom-4 tw-right-4 tw-z-50 tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-w-14 tw-h-14 tw-rounded-full tw-shadow-xl tw-flex tw-items-center tw-justify-center tw-cursor-pointer tw-transition-all';
      button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5C8 3.34315 9.34315 2 11 2H20C21.6569 2 23 3.34315 23 5V14C23 15.6569 21.6569 17 20 17H18V19C18 20.6569 16.6569 22 15 22H6C4.34315 22 3 20.6569 3 19V10C3 8.34315 4.34315 7 6 7H8V5Z" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M8 7V15C8 16.1046 8.89543 17 10 17H18" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      `;
      button.title = `${this.platform?.name || '通用论坛'} 内容复制工具\n快捷键: Ctrl/Cmd + Shift + C`;

      button.addEventListener('click', () => this.togglePanel());

      document.body.appendChild(button);
      this.appState.ui.trigger = button;
    }

    static createPanel() {
      const panel = document.createElement('div');
      panel.id = 'universal-copier-panel';
      panel.className = 'tw-fixed tw-top-4 tw-right-4 tw-z-40 tw-bg-white tw-shadow-xl tw-rounded-lg tw-border tw-border-gray-200 tw-w-80 tw-p-4 tw-transform tw-translate-x-full tw-transition-all tw-opacity-0';

      panel.innerHTML = `
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
          <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800">内容复制工具</h3>
          <button id="close-panel" class="tw-text-gray-600 hover:tw-text-gray-700 tw-cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="tw-mb-3">
          <p class="tw-text-sm tw-text-gray-600 tw-mb-2">
            检测到平台: <span class="tw-font-medium tw-text-blue-600">${this.platform?.name || '通用论坛'}</span>
          </p>
        </div>
        
        <div id="selection-info" class="tw-bg-green-50 tw-border tw-border-green-200 tw-rounded tw-p-3 tw-mb-3 tw-hidden">
          <p class="tw-text-sm tw-text-green-600 tw-font-medium">✓ 内容已选择</p>
          <p class="tw-text-xs tw-text-green-600">可以开始导出了</p>
        </div>
        
        <button id="select-content" class="tw-w-full tw-bg-blue-500 hover:tw-bg-blue-600 disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed tw-text-white tw-py-3 tw-px-4 tw-rounded tw-cursor-pointer tw-transition-all tw-mb-3 tw-font-medium">
          选择内容
        </button>
        
        <div class="tw-mb-3">
          <p class="tw-text-sm tw-text-gray-600 tw-mb-2 tw-font-medium">导出格式:</p>
          <div class="tw-flex tw-flex-wrap">
            <button id="export-markdown" class="tw-bg-gray-500 hover:tw-bg-gray-600 disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed tw-text-white tw-text-xs tw-py-2 tw-px-3 tw-rounded tw-cursor-pointer tw-transition-all tw-m-1 tw-w-1/2" style="width: calc(50% - 0.5rem);" disabled>
              Markdown
            </button>
            <button id="export-html" class="tw-bg-orange-500 hover:tw-bg-gray-600 disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed tw-text-white tw-text-xs tw-py-2 tw-px-3 tw-rounded tw-cursor-pointer tw-transition-all tw-m-1 tw-w-1/2" style="width: calc(50% - 0.5rem);" disabled>
              HTML
            </button>
            <button id="export-pdf" class="tw-bg-red-500 hover:tw-bg-gray-600 disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed tw-text-white tw-text-xs tw-py-2 tw-px-3 tw-rounded tw-cursor-pointer tw-transition-all tw-m-1 tw-w-1/2" style="width: calc(50% - 0.5rem);" disabled>
              PDF
            </button>
            <button id="export-png" class="tw-bg-purple-500 hover:tw-bg-gray-600 disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed tw-text-white tw-text-xs tw-py-2 tw-px-3 tw-rounded tw-cursor-pointer tw-transition-all tw-m-1 tw-w-1/2" style="width: calc(50% - 0.5rem);" disabled>
              PNG
            </button>
          </div>
        </div>
        
        <div class="tw-text-xs tw-text-gray-600">
          <p>💡 提示: 使用 Ctrl/Cmd + Shift + C 快速切换面板</p>
          <p>🔗 版本: ${CONFIG.VERSION} | 支持多平台论坛</p>
        </div>
      `;

      document.body.appendChild(panel);
      this.appState.ui.panel = panel;
    }

    static bindEvents() {
      // 关闭面板
      document.getElementById('close-panel')?.addEventListener('click', () => {
        this.hidePanel();
      });

      // 选择内容
      document.getElementById('select-content')?.addEventListener('click', () => {
        this.contentSelector.enable();
        this.hidePanel();
      });

      // 导出按钮
      const exportButtons = [
        { id: 'export-markdown', handler: () => this.exportManager.exportToMarkdown() },
        { id: 'export-html', handler: () => this.exportManager.exportToHTML() },
        { id: 'export-pdf', handler: () => this.exportManager.exportToPDF() },
        { id: 'export-png', handler: () => this.exportManager.exportToPNG() }
      ];

      exportButtons.forEach(({ id, handler }) => {
        document.getElementById(id)?.addEventListener('click', handler);
      });

      // 快捷键
      document.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modifierKey = isMac ? e.metaKey : e.ctrlKey;

        if (modifierKey && e.shiftKey && e.code === CONFIG.SHORTCUTS.TOGGLE_PANEL) {
          e.preventDefault();
          this.togglePanel();
        }
      });
    }

    static togglePanel() {
      const panel = this.appState.ui.panel;
      if (!panel) return;

      const isHidden = panel.classList.contains('tw-translate-x-full');

      if (isHidden) {
        this.showPanel();
      } else {
        this.hidePanel();
      }
    }

    static showPanel() {
      const panel = this.appState.ui.panel;
      if (!panel) return;

      panel.classList.remove('tw-translate-x-full', 'tw-opacity-0');
      panel.classList.add('tw-translate-x-0', 'tw-opacity-100', 'copier-panel-enter');

      this.updatePanelState();
      Logger.log('面板已显示');
    }

    static hidePanel() {
      const panel = this.appState.ui.panel;
      if (!panel) return;

      panel.classList.remove('tw-translate-x-0', 'tw-opacity-100', 'copier-panel-enter');
      panel.classList.add('tw-translate-x-full', 'tw-opacity-0', 'copier-panel-exit');

      Logger.log('面板已隐藏');
    }

    static updatePanelState() {
      const hasSelection = !!this.appState.selectedContent;

      // 更新选择信息显示
      const selectionInfo = document.getElementById('selection-info');
      if (selectionInfo) {
        if (hasSelection) {
          selectionInfo.classList.remove('tw-hidden');
        } else {
          selectionInfo.classList.add('tw-hidden');
        }
      }

      // 更新导出按钮状态
      const exportButtons = ['export-markdown', 'export-html', 'export-pdf', 'export-png'];
      exportButtons.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
          button.disabled = !hasSelection;
        }
      });

      // 更新选择按钮文本
      const selectButton = document.getElementById('select-content');
      if (selectButton) {
        selectButton.textContent = hasSelection ? '重新选择内容' : '选择内容';
      }
    }
  }

  // 库依赖检查器
  class LibraryChecker {
    static check() {
      const libraries = {
        'html2canvas': () => typeof html2canvas !== 'undefined',
        'jsPDF': () => typeof window.jspdf !== 'undefined',
        'TurndownService': () => typeof TurndownService !== 'undefined'
      };

      const missing = [];
      const available = [];

      for (const [name, check] of Object.entries(libraries)) {
        if (check()) {
          available.push(name);
        } else {
          missing.push(name);
        }
      }

      Logger.log('库检查结果:', { available, missing });

      if (missing.length > 0) {
        Logger.warn('缺少依赖库:', missing);
        return false;
      }

      return true;
    }
  }

  // 主应用程序
  class UniversalDiscussionsCopier {
    constructor() {
      this.appState = new AppState();
      this.platform = null;
    }

    async init() {
      if (this.appState.isInitialized) {
        Logger.log('插件已初始化，跳过重复初始化');
        return;
      }

      try {
        Logger.log(`插件初始化开始 - 版本 ${CONFIG.VERSION}`);

        // 检测平台
        this.platform = PlatformDetector.detect();
        this.appState.currentPlatform = this.platform;

        // 等待依赖库加载
        if (!await this.waitForLibraries()) {
          Logger.error('依赖库加载超时，插件可能无法完全工作');
        }

        // 初始化UI
        UI.init(this.appState, this.platform);

        this.appState.isInitialized = true;
        Logger.log('插件初始化完成');

      } catch (error) {
        Logger.error('初始化过程中发生错误:', error);
      }
    }

    async waitForLibraries(maxAttempts = 10, interval = 1000) {
      let attempts = 0;

      return new Promise((resolve) => {
        const checkLibraries = () => {
          attempts++;
          Logger.log(`检查依赖库 (${attempts}/${maxAttempts})`);

          if (LibraryChecker.check()) {
            resolve(true);
          } else if (attempts < maxAttempts) {
            setTimeout(checkLibraries, interval);
          } else {
            resolve(false);
          }
        };

        checkLibraries();
      });
    }
  }

  // 初始化应用
  const app = new UniversalDiscussionsCopier();

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      Logger.log('DOM 载入完成，延迟初始化...');
      setTimeout(() => app.init(), 1000);
    });
  } else {
    Logger.log('页面已载入，延迟初始化...');
    setTimeout(() => app.init(), 1000);
  }

  // 导出到全局作用域（用于调试）
  if (CONFIG.DEBUG) {
    window.UniversalDiscussionsCopier = {
      app,
      Logger,
      CONFIG,
      PLATFORM_CONFIGS
    };
  }

})(); 
