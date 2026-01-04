// ==UserScript==
// @name              搜索引擎增强
// @namespace         search_enhance_namespace
// @version           4.4.0
// @description       搜索引擎导航增强，支持拖拽、缩放、折叠和状态记忆，并集成硅基流动 AI 回答
// @author            zyh
// @match             *://www.baidu.com/*
// @match             *://www.so.com/s*
// @match             *://www.sogou.com/web*
// @match             *://cn.bing.com/search*
// @match             *://www.bing.com/search*
// @match             *://www.google.com/search*
// @match             *://www.google.com.hk/search*
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @connect           api.siliconflow.cn
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/524101/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/524101/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';

  class SearchEnhancer {
    constructor() {
      this.host = window.location.host;
      this.initData();
      this.initApiConfig();

      this.engineConfig = this.searchEnginesData.find(engine => this.host.includes(engine.host));
      if (!this.engineConfig) {
        return;
      }

      this.waitForElement(this.engineConfig.elementInput, () => {
        this.settings = this.loadSettings();
        this.lastExpandedHeight = this.settings.height > 40 ? this.settings.height : 400;
        this.initUI();
        if (this.apiSettings.autoAsk) {
          this.ensureAutoWatcher();
          this.askAi('auto');
        }
      });
    }

    initData() {
      this.searchEnginesData = [
        { host: 'baidu.com', name: '百度', elementInput: '#kw' },
        { host: 'so.com', name: '360搜索', elementInput: '#keyword' },
        { host: 'sogou.com', name: '搜狗', elementInput: '#upquery' },
        { host: 'bing.com', name: '必应', elementInput: '#sb_form_q' },
        { host: 'google.com', name: '谷歌', elementInput: "input[name='q'],textarea[name='q']" }
      ];
      const defaults = [
        {
          name: '搜索引擎',
          list: [
            { name: '百度', url: 'https://www.baidu.com/s?wd=@@', icon: 'https://www.google.com/s2/favicons?domain=baidu.com&sz=16' },
            { name: '必应', url: 'https://cn.bing.com/search?q=@@', icon: 'https://www.google.com/s2/favicons?domain=bing.com&sz=16' },
            { name: 'Google', url: 'https://www.google.com/search?q=@@', icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=16' }
          ]
        },
        {
          name: '综合搜索',
          list: [
            { name: '知乎', url: 'https://www.zhihu.com/search?q=@@', icon: 'https://www.google.com/s2/favicons?domain=zhihu.com&sz=16' },
            { name: 'CSDN', url: 'https://so.csdn.net/so/search?q=@@', icon: 'https://www.google.com/s2/favicons?domain=csdn.net&sz=16' },
            { name: 'GitHub', url: 'https://github.com/search?q=@@', icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=16' },
            { name: '小红书', url: 'https://www.xiaohongshu.com/search_result?keyword=@@', icon: 'https://bu.dusays.com/2025/10/05/68e1ea7572ba0.png' },


          ]
        },
        {
          name: '视频搜索',
          list: [
            { name: 'B站', url: 'https://search.bilibili.com/all?keyword=@@', icon: 'https://www.google.com/s2/favicons?domain=bilibili.com&sz=16' },
            { name: '抖音', url: 'https://www.douyin.com/search/@@', icon: 'https://bu.dusays.com/2025/10/05/68e1eac4790de.png' },
            { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=@@', icon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=16' }
          ]
        },
        {
          name: '学术搜索',
          list: [
            { name: '谷粉学术', url: 'https://www.defineabc.com/scholar?hl=en&q=@@', icon: 'https://www.google.com/s2/favicons?domain=defineabc.com&sz=16' },
            { name: 'Aminer', url: 'https://www.aminer.cn/search?t=b&q=@@', icon: 'https://www.google.com/s2/favicons?domain=aminer.cn&sz=16' }
          ]
        }
      ];
      this.navigationStorageKey = 'enhancer_nav_data_v1';
      this.defaultNavigationData = defaults;
      this.navigationData = this.loadNavigationData();
    }

    initApiConfig() {
      this.apiConfig = {
        baseUrl: 'https://api.siliconflow.cn/v1',
        chatPath: '/chat/completions',
        defaultModel: 'moonshotai/Kimi-K2-Instruct-0905',
        models: [
          { value: 'moonshotai/Kimi-K2-Instruct-0905', label: 'Kimi-K2-Instruct-0905' },
          { value: 'Qwen/Qwen3-32B', label: 'Qwen3-32B' },
          { value: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek-R1' },
          { value: 'Qwen/Qwen2.5-72B-Instruct', label: 'Qwen2.5-72B' }
        ]
      };
      this.apiSettings = {
        apiKey: GM_getValue('siliconflow_api_key', ''),
        model: GM_getValue('siliconflow_last_model', this.apiConfig.defaultModel),
        autoAsk: GM_getValue('siliconflow_auto_ask', false)
      };
      if (!this.apiConfig.models.some(item => item.value === this.apiSettings.model)) {
        this.apiSettings.model = this.apiConfig.defaultModel;
      }
      // 清理旧的AI折叠状态，强制默认为搜索页面
      GM_setValue('siliconflow_ai_collapsed', undefined);
      this.uiState = {
        currentPage: GM_getValue('siliconflow_current_page', 'search'),
        showKeyEditor: !this.apiSettings.apiKey
      };
      // 确保默认始终是搜索页面
      if (this.uiState.currentPage !== 'search' && this.uiState.currentPage !== 'ai') {
        this.uiState.currentPage = 'search';
        GM_setValue('siliconflow_current_page', 'search');
      }
      this.lastAnswerQuery = '';
      this.isRequesting = false;
      this.queryWatcher = null;
      this.aiElements = null;
    }

    initUI() {
      if (document.getElementById('search-enhancer-panel')) return;
      this.createPanel();
      this.applyStyles();
      this.attachEventListeners();
      if (!this.apiSettings.apiKey) {
        this.updateAiStatus('配置 SiliconFlow API Key 后即可调用 AI', 'warn');
      } else if (this.apiSettings.autoAsk) {
        this.updateAiStatus('自动回答已开启', 'info');
      } else {
        this.updateAiStatus('可手动生成 AI 回答', 'info');
      }
    }

    loadSettings() {
      const defaults = { x: 20, y: 120, width: 220, height: 120, isCollapsed: false };
      const saved = GM_getValue(`enhancer_settings_${this.host}`, {});
      return { ...defaults, ...saved };
    }

    saveSettings() {
      if (!this.panel) return;
      const currentSettings = {
        x: this.panel.offsetLeft,
        y: this.panel.offsetTop,
        width: this.panel.offsetWidth,
        height: this.lastExpandedHeight,
        isCollapsed: this.panel.classList.contains('collapsed')
      };
      GM_setValue(`enhancer_settings_${this.host}`, currentSettings);
    }

    createPanel() {
      const navHtml = this.navigationData
        .map(cat => {
          const links = cat.list
            .map(item => `<a href="#" data-url="${item.url}"><img src="${item.icon}" class="nav-icon" alt="${item.name}" onerror="this.style.display='none'" />${item.name}</a>`)
            .join('');
          return `<div class="nav-section"><div class="section-title">${cat.name}</div><div class="nav-links">${links}</div></div>`;
        })
        .join('');

      const modelOptions = this.apiConfig.models
        .map(item => `<option value="${item.value}">${item.label}</option>`)
        .join('');

      const shouldShowEditor = this.uiState.showKeyEditor || !this.apiSettings.apiKey;
      const shouldShowStatus = this.apiSettings.apiKey && !shouldShowEditor;
      const manageBtnVisible = this.apiSettings.apiKey || !shouldShowEditor;
      const manageBtnLabel = shouldShowEditor ? '取消编辑' : (this.apiSettings.apiKey ? '重新配置密钥' : '配置密钥');

      const searchPageHtml = `
        <div class="page-content search-page ${this.uiState.currentPage === 'search' ? 'active' : ''}">
          ${navHtml}
        </div>
      `;

      const aiPageHtml = `
        <div class="page-content ai-page ${this.uiState.currentPage === 'ai' ? 'active' : ''}">
          <div class="ai-key-row${shouldShowEditor ? '' : ' hidden'}">
            <input type="password" class="ai-key-input" placeholder="粘贴 SiliconFlow API Key" autocomplete="off" />
            <button type="button" class="ai-save-btn secondary">保存密钥</button>
          </div>
          <div class="ai-key-status${shouldShowStatus ? '' : ' hidden'}">密钥已安全保存，默认仅在本地可见。</div>
          <div class="ai-controls">
            <select class="ai-model-select ai-option-select">${modelOptions}</select>
            <button type="button" class="ai-ask-btn">快速回答</button>
            <label class="ai-auto-label"><input type="checkbox" class="ai-auto-toggle" /> 自动回答</label>
          </div>
          <div class="ai-status"></div>
          <div class="ai-answer"></div>
          <div class="ai-manage-section">
            <button type="button" class="ai-manage-key-btn secondary${manageBtnVisible ? '' : ' hidden'}">${manageBtnLabel}</button>
          </div>
        </div>
      `;

      const panelHtml = `
        <div class="nav-header">
          <div class="page-tabs">
            <button type="button" class="page-tab ${this.uiState.currentPage === 'search' ? 'active' : ''}" data-page="search">搜索</button>
            <button type="button" class="page-tab ${this.uiState.currentPage === 'ai' ? 'active' : ''}" data-page="ai">AI</button>
            <button type="button" class="page-tab ${this.uiState.currentPage === 'settings' ? 'active' : ''}" data-page="settings">设置</button>
          </div>
          <button type="button" class="nav-toggle-btn">收起</button>
        </div>
        <div class="nav-content">${searchPageHtml}${aiPageHtml}<div class="page-content settings-page ${this.uiState.currentPage === 'settings' ? 'active' : ''}"></div></div>
        <div class="resize-handle"></div>
      `;

      this.panel = document.createElement('div');
      this.panel.id = 'search-enhancer-panel';
      this.panel.innerHTML = panelHtml;
      document.body.appendChild(this.panel);
      // 渲染设置页
      this.renderSettingsPage?.();

      if (this.settings.isCollapsed) {
        this.panel.classList.add('collapsed');
        this.panel.querySelector('.nav-content').style.display = 'none';
        this.panel.querySelector('.nav-toggle-btn').textContent = '展开';
        this.panel.style.height = 'auto';
      }
    }

    applyStyles() {
      const s = this.settings;
      const css = `
        #search-enhancer-panel {
          position: fixed;
          top: ${s.y}px;
          left: ${s.x}px;
          width: ${s.width}px;
          height: ${s.isCollapsed ? 'auto' : `${s.height}px`};
          min-width: 260px;
          min-height: 48px;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          user-select: none;
          overflow: hidden;
          transition: height 0.2s ease-in-out;
        }
        #search-enhancer-panel.no-transition {
          transition: none !important;
        }
        #search-enhancer-panel.collapsed {
          height: auto !important;
        }
        .nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          background: rgba(0, 0, 0, 0.04);
          cursor: move;
          flex-shrink: 0;
        }
        .page-tabs {
          display: flex;
          gap: 4px;
        }
        .page-tab {
          border: none;
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 13px;
          color: #666;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s;
          font-weight: 500;
        }
        .page-tab:hover {
          background: rgba(255, 255, 255, 0.8);
        }
        .page-tab.active {
          background: #007bff;
          color: #fff;
          font-weight: 600;
        }
        .nav-toggle-btn {
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          color: #4a4a4a;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .nav-toggle-btn:hover {
          background: rgba(0, 0, 0, 0.08);
        }
        .nav-content {
          padding: 12px 15px 16px;
          overflow-y: auto;
          flex-grow: 1;
          position: relative;
        }
        .page-content {
          display: none !important;
        }
        .page-content.active {
          display: block !important;
        }
        .page-content.active.ai-page {
          display: flex !important;
          flex-direction: column;
          gap: 12px;
        }
        .nav-section {
          margin-bottom: 14px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 500;
          color: #666;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid #eee;
        }
        .nav-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .nav-links a {
          padding: 4px 9px;
          color: #333;
          text-decoration: none;
          font-size: 13px;
          background: #f1f1f1;
          border-radius: 6px;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .nav-links a:hover {
          background: #007bff;
          color: #fff;
          transform: translateY(-1px);
        }
        .nav-icon {
          width: 16px;
          height: 16px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .resize-handle {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 16px;
          height: 16px;
          cursor: se-resize;
          z-index: 10;
        }
        .ai-key-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ai-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ai-controls input, .ai-key-row input {
          flex: 1 1 150px;
          padding: 5px 8px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          font-size: 12px;
          outline: none;
          background: rgba(255, 255, 255, 0.85);
        }
        .ai-controls input:focus, .ai-key-row input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.16);
        }
        .ai-controls button, .ai-key-row button, .ai-manage-section button {
          border: none;
          background: #007bff;
          color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        .ai-controls button:hover:not(:disabled), .ai-key-row button:hover:not(:disabled), .ai-manage-section button:hover:not(:disabled) {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .ai-controls button:disabled, .ai-key-row button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .ai-controls button.secondary, .ai-key-row button.secondary, .ai-manage-section button.secondary {
          background: #6c757d;
        }
        .ai-option-select {
          flex: 0 1 160px;
          padding: 5px 8px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          font-size: 12px;
          background: rgba(255, 255, 255, 0.85);
        }
.ai-status {
  font-size: 12px;
  color: #555;
  min-height: 18px;
  margin-top: 4px;
  padding: 4px 6px;
  border-radius: 4px;
  background: rgba(0,0,0,0.03);
}

        .ai-key-status {
          font-size: 12px;
          color: #444;
          background: rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 6px 8px;
          border-radius: 6px;
        }
        .ai-status {
          font-size: 12px;
          color: #555;
          min-height: 16px;
        }
        .ai-status[data-type='error'] {
          color: #d1495b;
        }
        .ai-status[data-type='warn'] {
          color: #f4a261;
        }
        .ai-status[data-type='success'] {
          color: #2a9d8f;
        }
        .ai-answer {
          font-size: 13px;
          line-height: 1.6;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          padding: 10px;
          max-height: 220px;
          overflow-y: auto;
          white-space: pre-wrap;
        }
        .ai-manage-section {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }
        .hidden {
          display: none !important;
        }
        /* 设置页样式 */
        .settings-page {
          display: none !important;
        }
        .page-content.active.settings-page {
          display: block !important;
        }
        .settings-form {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 10px;
        }
        .settings-form input, .settings-form select {
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          font-size: 12px;
          background: rgba(255, 255, 255, 0.9);
        }
        .settings-form .btn {
          border: none;
          background: #007bff;
          color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
        }
        /* 通用按钮样式，设置页内都适用 */
        .settings-page .btn {
          border: none;
          background: #007bff;
          color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
        }
        .settings-page .btn.secondary { background: #6c757d; }
        /* 删除按钮颜色与其他一致，不使用红色 */
        .settings-page .btn.danger { background: #007bff; }
        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .settings-cat { border-top: 1px solid #eee; padding-top: 6px; }
        .settings-cat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .settings-cat-title { font-size: 13px; color: #666; }
        .settings-cat-actions .btn { margin-left: 6px; }
        .settings-item {
          display: grid;
          grid-template-columns: 1fr 2fr 1.2fr auto;
          gap: 6px;
          align-items: center;
          padding: 6px;
          border: 1px dashed #e5e7eb;
          border-radius: 6px;
          background: rgba(255,255,255,0.6);
        }
        .settings-item input { width: 100%; }
        .settings-actions button { margin-left: 6px; }
      `;
      const styleEl = document.createElement('style');
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }

    attachEventListeners() {
      const header = this.panel.querySelector('.nav-header');
      const toggleBtn = this.panel.querySelector('.nav-toggle-btn');
      const resizeHandle = this.panel.querySelector('.resize-handle');
      const pageTabs = this.panel.querySelectorAll('.page-tab');

      // 页面切换功能
      pageTabs.forEach(tab => {
        tab.addEventListener('click', e => {
          e.stopPropagation();
          const targetPage = e.currentTarget.dataset.page;
          this.switchPage(targetPage);
        });
      });

      toggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        const isCollapsed = this.panel.classList.toggle('collapsed');
        const contentEl = this.panel.querySelector('.nav-content');
        contentEl.style.display = isCollapsed ? 'none' : 'block';
        toggleBtn.textContent = isCollapsed ? '展开' : '收起';
        if (isCollapsed) {
          this.panel.style.height = 'auto';
        } else {
          this.panel.style.height = `${this.lastExpandedHeight}px`;
        }
        this.saveSettings();
      });

      this.bindNavLinkEvents();

      const dragOrResize = (e, type) => {
        e.preventDefault();
        this.panel.classList.add('no-transition');

        const startX = e.clientX;
        const startY = e.clientY;
        const initialX = this.panel.offsetLeft;
        const initialY = this.panel.offsetTop;
        const initialW = this.panel.offsetWidth;
        const initialH = this.panel.offsetHeight;
        let animationFrameId = null;

        const onMove = moveEvent => {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
          animationFrameId = requestAnimationFrame(() => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            if (type === 'drag') {
              const newX = Math.max(0, Math.min(window.innerWidth - this.panel.offsetWidth, initialX + dx));
              const newY = Math.max(0, Math.min(window.innerHeight - this.panel.offsetHeight, initialY + dy));
              this.panel.style.left = `${newX}px`;
              this.panel.style.top = `${newY}px`;
            } else {
              const newW = Math.max(240, initialW + dx);
              const newH = Math.max(160, initialH + dy);
              this.panel.style.width = `${newW}px`;
              if (!this.panel.classList.contains('collapsed')) {
                this.panel.style.height = `${newH}px`;
              }
            }
          });
        };

        const onEnd = () => {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
          if (!this.panel.classList.contains('collapsed')) {
            this.lastExpandedHeight = this.panel.offsetHeight;
          }
          this.saveSettings();
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onEnd);
          this.panel.classList.remove('no-transition');
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
      };

      header.addEventListener('mousedown', e => {
        // 只有在点击头部空白区域时才允许拖拽，避免点击标签时误触发
        if (e.target === header) {
          dragOrResize(e, 'drag');
        }
      });
      resizeHandle.addEventListener('mousedown', e => dragOrResize(e, 'resize'));

      this.aiElements = {
        page: this.panel.querySelector('.ai-page'),
        answer: this.panel.querySelector('.ai-answer'),
        status: this.panel.querySelector('.ai-status'),
        keyInput: this.panel.querySelector('.ai-key-input'),
        keyRow: this.panel.querySelector('.ai-key-row'),
        keyStatus: this.panel.querySelector('.ai-key-status'),
        saveBtn: this.panel.querySelector('.ai-save-btn'),
        askBtn: this.panel.querySelector('.ai-ask-btn'),
        autoToggle: this.panel.querySelector('.ai-auto-toggle'),
        modelSelect: this.panel.querySelector('.ai-model-select'),
        manageKeyBtn: this.panel.querySelector('.ai-manage-key-btn')
      };

      if (this.aiElements.keyInput) {
        this.aiElements.keyInput.value = '';
      }
      if (this.aiElements.autoToggle) {
        this.aiElements.autoToggle.checked = Boolean(this.apiSettings.autoAsk);
      }
      if (this.aiElements.modelSelect) {
        this.aiElements.modelSelect.value = this.apiSettings.model;
      }

      this.refreshKeyUi();

      // 强制确保正确的页面显示状态
      this.forcePageDisplay();

      this.aiElements.saveBtn?.addEventListener('click', () => {
        const value = this.aiElements.keyInput.value.trim();
        this.persistApiKey(value);
      });

      this.aiElements.keyInput?.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const value = this.aiElements.keyInput.value.trim();
          this.persistApiKey(value);
        }
      });

      this.aiElements.modelSelect?.addEventListener('change', e => {
        this.persistModelValue(e.target.value);
      });

      this.aiElements.askBtn?.addEventListener('click', () => {
        this.askAi('manual');
      });

      this.aiElements.autoToggle?.addEventListener('change', e => {
        this.setAutoAsk(e.target.checked);
      });

      this.aiElements.manageKeyBtn?.addEventListener('click', () => {
        const hasKey = Boolean(this.apiSettings.apiKey);
        if (!hasKey && this.uiState.showKeyEditor) {
          this.uiState.showKeyEditor = false;
        } else {
          this.uiState.showKeyEditor = !this.uiState.showKeyEditor;
        }
        if (this.uiState.showKeyEditor && this.aiElements.keyInput) {
          this.aiElements.keyInput.value = '';
          this.updateAiStatus('请输入新的 API Key 并点击保存', 'info');
        }
        this.refreshKeyUi();
        if (this.uiState.showKeyEditor) {
          this.aiElements.keyInput?.focus();
        }
      });

      // 设置页交互
      this.attachSettingsHandlers?.();
    }

    bindNavLinkEvents() {
      this.panel.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          const keyword = this.getSearchKeyword();
          const templateUrl = e.currentTarget.dataset.url;
          const targetUrl = templateUrl.replace('@@', encodeURIComponent(keyword));
          window.open(targetUrl, '_blank');
        });
      });
    }

    getSearchKeyword() {
      const input = document.querySelector(this.engineConfig.elementInput);
      if (!input) return '';
      const value = input.value || input.getAttribute('value') || input.defaultValue || '';
      return value.trim();
    }

    switchPage(targetPage) {
      if (this.uiState.currentPage === targetPage) return;

      this.uiState.currentPage = targetPage;
      GM_setValue('siliconflow_current_page', targetPage);

      // 更新页面标签状态
      this.panel.querySelectorAll('.page-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.page === targetPage);
      });

      // 更新页面内容显示
      this.panel.querySelectorAll('.page-content').forEach(page => {
        page.classList.toggle('active', page.classList.contains(`${targetPage}-page`));
      });
    }

    forcePageDisplay() {
      // 强制更新页面显示状态，确保与currentPage一致
      this.panel.querySelectorAll('.page-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.page === this.uiState.currentPage);
      });

      this.panel.querySelectorAll('.page-content').forEach(page => {
        page.classList.toggle('active', page.classList.contains(`${this.uiState.currentPage}-page`));
      });
    }

    // ----- 搜索导航数据：加载/保存/渲染 -----
    loadNavigationData() {
      const saved = GM_getValue(this.navigationStorageKey, null);
      if (Array.isArray(saved)) return saved;
      GM_setValue(this.navigationStorageKey, this.defaultNavigationData);
      return this.defaultNavigationData;
    }

    saveNavigationData() {
      GM_setValue(this.navigationStorageKey, this.navigationData);
      this.renderSearchPageNav();
      this.renderSettingsPage();
      this.attachSettingsHandlers();
    }

    renderSearchPageNav() {
      const container = this.panel.querySelector('.search-page');
      if (!container) return;
      const navHtml = this.navigationData
        .map(cat => {
          const links = cat.list
            .map(item => `<a href="#" data-url="${item.url}"><img src="${item.icon}" class="nav-icon" alt="${item.name}" onerror="this.style.display='none'" />${item.name}</a>`)
            .join('');
          return `<div class="nav-section"><div class="section-title">${cat.name}</div><div class="nav-links">${links}</div></div>`;
        })
        .join('');
      container.innerHTML = navHtml;
      this.bindNavLinkEvents();
    }

    renderSettingsPage() {
      const page = this.panel.querySelector('.settings-page');
      if (!page) return;

      const catOptions = this.navigationData
        .map((c, i) => `<option value="${i}">${c.name}</option>`)
        .join('');
      const formHtml = `
        <div class="settings-form">
          <label>分组：</label>
          <select class="set-cat-select">${catOptions}<option value="__new__">+ 新建分组</option></select>
          <input type="text" class="set-new-cat hidden" placeholder="新分组名" />
          <input type="text" class="set-name" placeholder="名称" />
          <input type="text" class="set-url" placeholder="URL（使用 @@ 作为关键词占位符）" />
          <input type="text" class="set-icon" placeholder="图标URL（可留空）" />
          <button type="button" class="btn set-save">添加</button>
          <button type="button" class="btn secondary set-cancel hidden">取消</button>
        </div>`;

      const listHtml = this.navigationData
        .map((cat, ci) => {
          const items = cat.list
            .map((it, ii) => `
              <div class="settings-item" data-ci="${ci}" data-ii="${ii}">
                <input type="text" class="si-name" value="${it.name}" />
                <input type="text" class="si-url" value="${it.url}" />
                <input type="text" class="si-icon" value="${it.icon || ''}" />
                <div class="settings-actions">
                  <button type="button" class="btn secondary si-update">保存</button>
                  <button type="button" class="btn secondary si-delete">删除</button>
                </div>
              </div>`)
            .join('');
          return `<div class="settings-cat" data-ci="${ci}">
            <div class="settings-cat-header">
              <div class="settings-cat-title">${cat.name}</div>
              <div class="settings-cat-actions">
                <button type="button" class="btn secondary cat-delete">删除分组</button>
              </div>
            </div>
            <div class="settings-list">${items || '<div style=\"color:#888;font-size:12px;\">暂无条目</div>'}</div>
          </div>`;
        })
        .join('');

      page.innerHTML = formHtml + listHtml;
    }

    attachSettingsHandlers() {
      const page = this.panel.querySelector('.settings-page');
      if (!page) return;

      const select = page.querySelector('.set-cat-select');
      const newCatInput = page.querySelector('.set-new-cat');
      const nameInput = page.querySelector('.set-name');
      const urlInput = page.querySelector('.set-url');
      const iconInput = page.querySelector('.set-icon');
      const saveBtn = page.querySelector('.set-save');
      const cancelBtn = page.querySelector('.set-cancel');

      let editing = null; // {ci, ii}

      const resetForm = () => {
        editing = null;
        nameInput.value = '';
        urlInput.value = '';
        iconInput.value = '';
        cancelBtn.classList.add('hidden');
        saveBtn.textContent = '添加';
      };

      select.addEventListener('change', () => {
        const isNew = select.value === '__new__';
        newCatInput.classList.toggle('hidden', !isNew);
      });

      saveBtn.addEventListener('click', () => {
        const isNewCat = select.value === '__new__';
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        const icon = iconInput.value.trim();
        if (!name || !url || !url.includes('@@')) {
          alert('请填写名称与URL，且URL需要包含 @@ 作为关键词占位符');
          return;
        }

        if (editing) {
          const { ci, ii } = editing;
          this.navigationData[ci].list[ii] = { name, url, icon };
          this.saveNavigationData();
          resetForm();
          return;
        }

        let targetCatIndex;
        if (isNewCat) {
          const catName = newCatInput.value.trim();
          if (!catName) {
            alert('请输入新分组名');
            return;
          }
          targetCatIndex = this.navigationData.length;
          this.navigationData.push({ name: catName, list: [] });
        } else {
          targetCatIndex = parseInt(select.value, 10);
        }
        this.navigationData[targetCatIndex].list.push({ name, url, icon });
        this.saveNavigationData();
        this.renderSettingsPage();
        this.attachSettingsHandlers();
        resetForm();
      });

      cancelBtn.addEventListener('click', () => resetForm());

      page.querySelectorAll('.si-update').forEach(btn => {
        btn.addEventListener('click', e => {
          const itemEl = e.currentTarget.closest('.settings-item');
          const ci = parseInt(itemEl.dataset.ci, 10);
          const ii = parseInt(itemEl.dataset.ii, 10);
          const name = itemEl.querySelector('.si-name').value.trim();
          const url = itemEl.querySelector('.si-url').value.trim();
          const icon = itemEl.querySelector('.si-icon').value.trim();
          if (!name || !url || !url.includes('@@')) {
            alert('请填写名称与URL，且URL需要包含 @@ 作为关键词占位符');
            return;
          }
          this.navigationData[ci].list[ii] = { name, url, icon };
          this.saveNavigationData();
        });
      });

      page.querySelectorAll('.si-delete').forEach(btn => {
        btn.addEventListener('click', e => {
          const itemEl = e.currentTarget.closest('.settings-item');
          const ci = parseInt(itemEl.dataset.ci, 10);
          const ii = parseInt(itemEl.dataset.ii, 10);
          if (!confirm('确认删除该搜索引擎？')) return;
          this.navigationData[ci].list.splice(ii, 1);
          this.saveNavigationData();
          this.renderSettingsPage();
          this.attachSettingsHandlers();
        });
      });

      page.querySelectorAll('.cat-delete').forEach(btn => {
        btn.addEventListener('click', e => {
          const catEl = e.currentTarget.closest('.settings-cat');
          const ci = parseInt(catEl.dataset.ci, 10);
          const cat = this.navigationData[ci];
          const count = (cat && Array.isArray(cat.list)) ? cat.list.length : 0;
          if (!confirm(`确认删除分组「${cat?.name || ''}」？（其中包含 ${count} 个搜索引擎）`)) return;
          this.navigationData.splice(ci, 1);
          this.saveNavigationData();
          this.renderSettingsPage();
          this.attachSettingsHandlers();
        });
      });
    }

    askAi(trigger = 'manual') {
      if (this.isRequesting) {
        if (trigger === 'manual') {
          this.updateAiStatus('已有请求正在处理，请稍候...', 'warn');
        }
        return;
      }

      const query = this.getSearchKeyword();
      if (!query) {
        this.updateAiStatus('未检测到搜索关键词', 'warn');
        return;
      }

      if (!this.apiSettings.apiKey) {
        this.updateAiStatus('请先保存 SiliconFlow API Key', 'error');
        return;
      }

      if (trigger !== 'manual' && query === this.lastAnswerQuery) {
        return;
      }

      if (trigger === 'manual' && this.uiState.currentPage !== 'ai') {
        this.switchPage('ai');
      }

      const payload = {
        model: this.apiSettings.model,
        messages: [
          {
            role: 'system',
            content: '你是一名中文搜索助手，回答要简洁、可靠、引用常识。如缺少信息，请诚实说明。'
          },
          {
            role: 'user',
            content: `用户搜索词: ${query}
请给出一句话总结，并附上可能的参考链接（可选）。`
          }
        ],
        temperature: 0.3,
        max_tokens: 400,
        stream: false
      };

      this.isRequesting = true;
      this.updateAiStatus('正在向 SiliconFlow 请求回答...', 'info');
      if (this.aiElements?.answer) {
        this.aiElements.answer.textContent = '';
      }

      GM_xmlhttpRequest({
        method: 'POST',
        url: `${this.apiConfig.baseUrl}${this.apiConfig.chatPath}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiSettings.apiKey}`
        },
        data: JSON.stringify(payload),
        timeout: 20000,
        onload: response => {
          this.isRequesting = false;
          if (response.status < 200 || response.status >= 300) {
            this.updateAiStatus(`请求失败，状态码 ${response.status}`, 'error');
            return;
          }
          let data;
          try {
            data = JSON.parse(response.responseText);
          } catch (err) {
            this.updateAiStatus('解析响应失败', 'error');
            return;
          }
          const errorMessage = data?.error?.message;
          if (errorMessage) {
            this.updateAiStatus(`服务返回错误: ${errorMessage}`, 'error');
            return;
          }
          const message = data?.choices?.[0]?.message?.content?.trim();
          if (!message) {
            this.updateAiStatus('AI 未返回内容', 'warn');
            return;
          }
          this.lastAnswerQuery = query;
          this.renderAiAnswer(message);
          this.updateAiStatus('AI 回答已生成', 'success');
        },
        onerror: () => {
          this.isRequesting = false;
          this.updateAiStatus('网络错误或被拦截', 'error');
        },
        ontimeout: () => {
          this.isRequesting = false;
          this.updateAiStatus('请求超时，请稍后重试', 'error');
        }
      });
    }

    renderAiAnswer(text) {
      if (!this.aiElements?.answer) return;
      this.aiElements.answer.textContent = text;
    }

    updateAiStatus(message, type = 'info') {
      if (!this.aiElements?.status) return;
      this.aiElements.status.textContent = message;
      this.aiElements.status.dataset.type = type;
    }

    persistApiKey(value) {
      if (!value) {
        GM_setValue('siliconflow_api_key', '');
        this.apiSettings.apiKey = '';
        this.uiState.showKeyEditor = true;
        this.updateAiStatus('API Key 已清除', 'warn');
        this.refreshKeyUi();
        return;
      }
      GM_setValue('siliconflow_api_key', value);
      this.apiSettings.apiKey = value;
      this.uiState.showKeyEditor = false;
      this.refreshKeyUi();
      this.updateAiStatus('API Key 已保存', 'success');
      if (this.aiElements?.keyInput) {
        this.aiElements.keyInput.value = '';
      }
    }

    persistModelValue(value) {
      if (!value || !this.apiConfig.models.some(item => item.value === value)) {
        this.apiSettings.model = this.apiConfig.defaultModel;
      } else {
        this.apiSettings.model = value;
      }
      GM_setValue('siliconflow_last_model', this.apiSettings.model);
      this.updateAiStatus(`已切换模型：${this.apiSettings.model}`, 'info');
      if (this.apiSettings.autoAsk) {
        this.askAi('auto');
      }
    }

    setAutoAsk(enabled) {
      this.apiSettings.autoAsk = Boolean(enabled);
      GM_setValue('siliconflow_auto_ask', this.apiSettings.autoAsk);
      if (this.aiElements?.autoToggle) {
        this.aiElements.autoToggle.checked = this.apiSettings.autoAsk;
      }
      if (this.apiSettings.autoAsk) {
        this.updateAiStatus('自动回答已开启', 'info');
        this.ensureAutoWatcher();
        this.askAi('auto');
      } else {
        this.clearAutoWatcher();
        this.updateAiStatus('自动回答已关闭', 'info');
      }
    }

    ensureAutoWatcher() {
      if (this.queryWatcher) return;
      this.queryWatcher = window.setInterval(() => {
        if (!this.apiSettings.autoAsk || this.isRequesting) return;
        const query = this.getSearchKeyword();
        if (!query) return;
        if (query === this.lastAnswerQuery) return;
        this.askAi('auto');
      }, 4000);
    }

    clearAutoWatcher() {
      if (this.queryWatcher) {
        window.clearInterval(this.queryWatcher);
        this.queryWatcher = null;
      }
    }

    refreshKeyUi() {
      if (!this.aiElements) return;
      const hasKey = Boolean(this.apiSettings.apiKey);
      const showEditor = this.uiState.showKeyEditor || !hasKey;
      const showStatus = hasKey && !showEditor;

      this.aiElements.keyRow?.classList.toggle('hidden', !showEditor);
      this.aiElements.keyStatus?.classList.toggle('hidden', !showStatus);

      if (this.aiElements.keyStatus) {
        this.aiElements.keyStatus.textContent = hasKey
          ? '密钥已安全保存，默认仅在本地可见。'
          : '粘贴后保存即可启用 AI 功能。';
      }

      if (this.aiElements.manageKeyBtn) {
        if (hasKey) {
          this.aiElements.manageKeyBtn.classList.remove('hidden');
          this.aiElements.manageKeyBtn.textContent = showEditor ? '取消编辑' : '重新配置密钥';
        } else {
          this.aiElements.manageKeyBtn.textContent = showEditor ? '隐藏输入' : '配置密钥';
          this.aiElements.manageKeyBtn.classList.toggle('hidden', showEditor);
        }
      }
    }

    waitForElement(selector, callback) {
      const interval = setInterval(() => {
        if (document.querySelector(selector)) {
          clearInterval(interval);
          callback();
        }
      }, 200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SearchEnhancer());
  } else {
    new SearchEnhancer();
  }
})();