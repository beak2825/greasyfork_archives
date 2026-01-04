// ==UserScript==
// @name         网页文章总结助手
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  自动总结网页文章内容，支持多种格式输出，适用于各类文章网站
// @author       h7ml <h7ml@qq.com>
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      api.gptgod.online
// @connect      api.deepseek.com
// @connect      localhost
// @connect      *
// @resource     jquery https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @resource     marked https://cdn.bootcdn.net/ajax/libs/marked/4.3.0/marked.min.js
// @resource     highlight https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/highlight.min.js
// @resource     highlightStyle https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/github.min.css
// @downloadURL https://update.greasyfork.org/scripts/529775/%E7%BD%91%E9%A1%B5%E6%96%87%E7%AB%A0%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529775/%E7%BD%91%E9%A1%B5%E6%96%87%E7%AB%A0%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
  // 检查jQuery是否已经存在
  if (typeof jQuery === 'undefined') {
    console.log('正在加载jQuery...');
    try {
      // 使用油猴的GM_getResourceText加载jQuery
      const jqueryCode = GM_getResourceText('jquery');
      // 使用eval执行jQuery代码
      eval(jqueryCode);
      console.log('jQuery加载完成，初始化应用...');
      initApp();
    } catch (error) {
      console.error('使用GM_getResourceText加载jQuery失败:', error);
      // 回退方案：尝试创建本地脚本元素
      const script = document.createElement('script');
      script.textContent = GM_getResourceText('jquery');
      script.onload = function () {
        console.log('jQuery通过本地脚本元素加载完成，初始化应用...');
        initApp();
      };
      document.head.appendChild(script);
    }
  } else {
    console.log('jQuery已存在，直接初始化应用...');
    initApp();
  }

  function initApp() {
    'use strict';

    // 配置管理类
    class ConfigManager {
      constructor() {
        this.DEFAULT_API_SERVICE = 'ollama';
        this.DEFAULT_CONFIGS = {
          ollama: {
            url: 'http:/160.202.244.103:11434/api/chat',
            model: 'deepseek-r1:7b',
            key: '',  // Ollama 不需要 API key
            params: {
              temperature: 0.8,
              top_p: 0.9,
              top_k: 40,
              num_ctx: 4096,
              repeat_penalty: 1.1,
              seed: 0
            }
          },
          gptgod: {
            url: 'https://api.gptgod.online/v1/chat/completions',
            model: 'gpt-4o-all',
            key: 'sk-L1rbJXBp3aDrZLgyrUq8FugKU54FxElTbzt7RfnBaWgHOtFj'
          },
          deepseek: {
            url: 'https://api.deepseek.com/v1/chat/completions',
            model: 'deepseek-chat',
            key: ''
          },
          custom: {
            url: '',
            model: '',
            key: ''
          }
        };
        this.DEFAULT_FORMAT = 'markdown';
        this.DEFAULT_APP_SIZE = {
          width: 400,
          height: 500
        };
        this.ollamaModels = [];
        this.OLLAMA_RECOMMEND_MODELS = [
          'llama2',
          'llama2:13b',
          'llama2:70b',
          'mistral',
          'mixtral',
          'gemma:2b',
          'gemma:7b',
          'qwen:14b',
          'qwen:72b',
          'phi3:mini',
          'phi3:small',
          'phi3:medium',
          'yi:34b',
          'vicuna:13b',
          'vicuna:33b',
          'codellama',
          'wizardcoder',
          'nous-hermes2',
          'neural-chat',
          'openchat',
          'dolphin-mixtral',
          'starling-lm'
        ];
        this.OLLAMA_PARAMS = {
          temperature: { default: 0.8, min: 0, max: 2, step: 0.1 },
          top_p: { default: 0.9, min: 0, max: 1, step: 0.05 },
          top_k: { default: 40, min: 1, max: 100, step: 1 },
          num_ctx: { default: 4096, min: 512, max: 8192, step: 512 },
          repeat_penalty: { default: 1.1, min: 0.5, max: 2, step: 0.1 },
          seed: { default: 0, min: 0, max: 1000000, step: 1 }
        };

        // 添加API转发配置，默认关闭
        this.DEFAULT_API_PROXY = false;
        this.DEFAULT_API_PROXY_DOMAIN = 'https://nakoruru.h7ml.cn';

        // 添加交互式配置选项
        this.FEATURES = {
          '1': { id: 'autoExtract', name: '自动提取文章内容', default: true },
          '2': { id: 'apiProxy', name: 'API转发服务', default: false },
          '3': { id: 'ollamaIntegration', name: 'Ollama本地模型集成', default: true },
          '4': { id: 'customStyleMode', name: '自定义样式模式', default: false },
          '5': { id: 'advancedModelParams', name: '高级模型参数设置', default: false },
          '6': { id: 'showThinking', name: '显示思考过程', default: true }
        };

        // 特性配置状态
        this.featureStates = GM_getValue('featureStates', {
          autoExtract: true,
          apiProxy: false,
          ollamaIntegration: true,
          customStyleMode: false,
          advancedModelParams: false,
          showThinking: true
        });
      }

      getConfigs() {
        return GM_getValue('apiConfigs', this.DEFAULT_CONFIGS);
      }

      getApiService() {
        return GM_getValue('apiService', this.DEFAULT_API_SERVICE);
      }

      getOutputFormat() {
        return GM_getValue('outputFormat', this.DEFAULT_FORMAT);
      }

      getConfigCollapsed() {
        return GM_getValue('configCollapsed', false);
      }

      getAppMinimized() {
        return GM_getValue('appMinimized', false);
      }

      getAppPosition() {
        return GM_getValue('appPosition', null);
      }

      getIconPosition() {
        return GM_getValue('iconPosition', null);
      }

      getAppSize() {
        return GM_getValue('appSize', this.DEFAULT_APP_SIZE);
      }

      setConfigs(configs) {
        GM_setValue('apiConfigs', configs);
      }

      setApiService(service) {
        GM_setValue('apiService', service);
      }

      setOutputFormat(format) {
        GM_setValue('outputFormat', format);
      }

      setConfigCollapsed(collapsed) {
        GM_setValue('configCollapsed', collapsed);
      }

      setAppMinimized(minimized) {
        GM_setValue('appMinimized', minimized);
      }

      setAppPosition(position) {
        GM_setValue('appPosition', position);
      }

      setIconPosition(position) {
        GM_setValue('iconPosition', position);
      }

      setAppSize(size) {
        GM_setValue('appSize', size);
      }

      // 添加获取和设置API转发配置的方法
      getApiProxyEnabled() {
        return GM_getValue('apiProxyEnabled', this.DEFAULT_API_PROXY);
      }

      getApiProxyDomain() {
        return GM_getValue('apiProxyDomain', this.DEFAULT_API_PROXY_DOMAIN);
      }

      setApiProxyEnabled(enabled) {
        GM_setValue('apiProxyEnabled', enabled);
      }

      setApiProxyDomain(domain) {
        GM_setValue('apiProxyDomain', domain);
      }

      getFeatureStates() {
        return this.featureStates;
      }

      isFeatureEnabled(featureId) {
        return this.featureStates[featureId] === true;
      }

      setFeatureStates(states) {
        this.featureStates = { ...this.featureStates, ...states };
        GM_setValue('featureStates', this.featureStates);
      }

      showFeaturePrompt() {
        // 使用对话框而不是prompt
        return false;
      }

      // 添加获取和设置Ollama模型列表的方法
      getOllamaModels() {
        return this.ollamaModels;
      }

      setOllamaModels(models) {
        this.ollamaModels = models;
      }

      // 添加获取和设置Ollama参数的方法
      getOllamaParams(modelName) {
        const configs = this.getConfigs();
        if (configs.ollama && configs.ollama.params) {
          return configs.ollama.params;
        }
        return {
          temperature: 0.8,
          top_p: 0.9,
          top_k: 40,
          num_ctx: 4096,
          repeat_penalty: 1.1,
          seed: 0
        };
      }

      setOllamaParams(params) {
        const configs = this.getConfigs();
        if (!configs.ollama) {
          configs.ollama = this.DEFAULT_CONFIGS.ollama;
        }
        configs.ollama.params = { ...configs.ollama.params, ...params };
        this.setConfigs(configs);
      }
    }

    // UI管理类
    class UIManager {
      constructor(configManager) {
        this.configManager = configManager;
        this.app = null;
        this.iconElement = null;
        this.elements = {};
        this.isDragging = false;
        this.isIconDragging = false;
        this.isMaximized = false;
        this.previousSize = {};
        this.apiService = null; // 将在 init 中初始化
      }

      async init() {
        try {
          console.log('开始初始化UI管理器');
          this.apiService = new APIService(this.configManager);

          await this.loadLibraries();
          console.log('库加载完成');

          this.createApp();
          console.log('应用创建完成');

          this.createIcon();
          console.log('图标创建完成');

          this.bindEvents();
          console.log('事件绑定完成');

          this.restoreState();
          console.log('状态恢复完成');

          this.applyFeatureStates();
          console.log('特性状态应用完成');

          // 如果当前服务是 Ollama，并且启用了Ollama集成特性，尝试获取模型列表
          if (this.configManager.getApiService() === 'ollama' &&
            this.configManager.isFeatureEnabled('ollamaIntegration')) {
            this.fetchOllamaModels();
          }

          console.log('UI管理器初始化完成');
        } catch (error) {
          console.error('UI管理器初始化失败:', error);
          alert('界面初始化失败，请刷新页面重试。错误信息: ' + error.message);
        }
      }

      // 应用特性状态到UI界面
      applyFeatureStates() {
        const featureStates = this.configManager.getFeatureStates();

        // 处理自定义样式模式
        if (featureStates.customStyleMode) {
          document.body.classList.add('summary-custom-style');
          this.app.classList.add('custom-style-enabled');
        } else {
          document.body.classList.remove('summary-custom-style');
          this.app.classList.remove('custom-style-enabled');
        }

        // 处理API转发设置显示
        if (featureStates.apiProxy) {
          if (this.elements.proxySettingsContainer) {
            this.elements.proxySettingsContainer.style.display = 'block';
          }
        } else {
          if (this.elements.proxySettingsContainer) {
            this.elements.proxySettingsContainer.style.display = 'none';
          }
        }

        // 处理显示思考过程开关
        if (this.elements.featureCheckboxes && this.elements.featureCheckboxes.showThinking) {
          this.elements.featureCheckboxes.showThinking.checked = featureStates.showThinking === true;
        }

        // 处理Ollama集成
        if (featureStates.ollamaIntegration) {
          const ollamaOption = this.elements.apiService.querySelector('option[value="ollama"]');
          if (ollamaOption) {
            ollamaOption.style.display = 'block';
          }
        } else {
          const ollamaOption = this.elements.apiService.querySelector('option[value="ollama"]');
          if (ollamaOption) {
            ollamaOption.style.display = 'none';

            // 如果当前选中的是Ollama，切换到其他服务
            if (this.elements.apiService.value === 'ollama') {
              this.elements.apiService.value = 'gptgod';
              this.handleApiServiceChange();
            }
          }
        }

        // 处理高级模型参数设置
        if (featureStates.advancedModelParams && this.elements.ollamaParamsContainer) {
          this.elements.ollamaParamsContainer.style.display = 'block';
          this.updateModelParamsUI();
        } else if (this.elements.ollamaParamsContainer) {
          this.elements.ollamaParamsContainer.style.display = 'none';
        }
      }

      async loadLibraries() {
        // 添加基础样式
        GM_addStyle(`
    /* 基础样式 */
    #article-summary-app {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 400px;
      max-height: 80vh;
      min-width: 320px;
      min-height: 300px;
      background: rgba(255, 255, 255, 0.98);
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      resize: both;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 0, 0, 0.06);
      transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    #article-summary-icon {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 48px;
      height: 48px;
      background: #007AFF;
      border-radius: 50%;
      display: none; /* 默认隐藏图标 */
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
      z-index: 999999;
      color: white;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    #article-summary-icon:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
    }
    
    #article-summary-icon:active {
      transform: scale(0.98);
    }

    #summary-header {
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      -webkit-app-region: drag;
      user-select: none;
    }

    #summary-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #1D1D1F;
    }

    #summary-header-actions {
      display: flex;
      gap: 12px;
      -webkit-app-region: no-drag;
    }

    .header-btn {
      background: none;
      border: none;
      padding: 6px;
      cursor: pointer;
      color: #8E8E93;
      border-radius: 6px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-btn:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #1D1D1F;
    }
    
    .header-btn:active {
      transform: scale(0.95);
    }

    #summary-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .form-group {
      margin-bottom: 20px;
    }
    
    .form-label {
      display: block;
      margin-bottom: 6px;
      color: #6E6E73;
      font-size: 13px;
      font-weight: 500;
    }
    
    .form-input, .form-select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      font-size: 14px;
      background-color: rgba(0, 0, 0, 0.02);
      color: #1D1D1F;
      transition: all 0.2s ease;
      -webkit-appearance: none;
      appearance: none;
    }
    
    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #007AFF;
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
      background-color: #fff;
    }
    
    .form-select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238E8E93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 36px;
    }

    #configPanel {
      margin-top: 12px;
      padding: 16px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    #configPanel.collapsed {
      display: none;
    }

    #formatOptions {
      display: flex;
      gap: 8px;
    }
    
    .format-btn {
      padding: 8px 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.8);
      color: #1D1D1F;
    }
    
    .format-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    
    .format-btn.active {
      background: #007AFF;
      color: white;
      border-color: #007AFF;
      font-weight: 500;
    }
    
    #generateBtn {
      width: 100%;
      padding: 14px;
      background: #007AFF;
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
    }
    
    #generateBtn:hover {
      background: #0071E3;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
    }
    
    #generateBtn:active {
      transform: translateY(1px);
      box-shadow: 0 1px 4px rgba(0, 122, 255, 0.3);
    }
    
    #generateBtn:disabled {
      background: #A2A2A7;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    
    #summaryResult {
      margin-top: 20px;
      display: none;
      flex-direction: column;
      height: 100%;
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    #summaryHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    #summaryHeader h4 {
      margin: 0;
      color: #1D1D1F;
      font-size: 15px;
      font-weight: 500;
    }
    
    .action-btn {
      background: none;
      border: none;
      padding: 6px 10px;
      cursor: pointer;
      color: #007AFF;
      display: flex;
      align-items: center;
      gap: 6px;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-size: 13px;
      font-weight: 500;
    }
    
    .action-btn:hover {
      background: rgba(0, 122, 255, 0.1);
    }
    
    .action-btn:active {
      transform: scale(0.95);
    }

    #loadingIndicator {
      display: none;
      text-align: center;
      padding: 30px;
      animation: fadeIn 0.3s ease;
    }

    .spinner {
      width: 36px;
      height: 36px;
      margin: 0 auto 16px;
      border: 3px solid rgba(0, 0, 0, 0.05);
      border-top: 3px solid #007AFF;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .app-minimized {
      display: none;
    }

    .icon {
      width: 18px;
      height: 18px;
    }

    .toggle-icon {
      transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .markdown-body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #1D1D1F;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .markdown-body h1 { font-size: 1.5rem; margin: 1.2rem 0; font-weight: 600; }
    .markdown-body h2 { font-size: 1.25rem; margin: 1.1rem 0; font-weight: 600; }
    .markdown-body h3 { font-size: 1.1rem; margin: 1rem 0; font-weight: 600; }
    .markdown-body p { margin: 0.8rem 0; }
    .markdown-body code {
      background: rgba(0, 0, 0, 0.04);
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.9em;
    }
    .markdown-body pre {
      background: rgba(0, 0, 0, 0.04);
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
    }

    #modelSelect {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      font-size: 14px;
      background-color: rgba(0, 0, 0, 0.02);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238E8E93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 36px;
      -webkit-appearance: none;
      appearance: none;
      transition: all 0.2s ease;
    }
    
    #modelSelect:focus {
      outline: none;
      border-color: #007AFF;
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
      background-color: #fff;
    }
    
    #modelName {
      display: none;
    }
    
    .ollama-service #modelSelect {
      display: block;
    }
    
    .ollama-service #modelName {
      display: none;
    }
    
    .non-ollama-service #modelSelect {
      display: none;
    }
    
    .non-ollama-service #modelName {
      display: block;
    }

    .content-textarea {
      width: 100%;
      height: 100%;
      min-height: 200px;
      padding: 14px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      resize: vertical;
      flex: 1;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 0.8);
      color: #1D1D1F;
      transition: all 0.2s ease;
    }

    .content-textarea:focus {
      outline: none;
      border-color: #007AFF;
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
      background-color: #fff;
    }

    .resize-handle {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 16px;
      height: 16px;
      cursor: nwse-resize;
      background: linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 100%);
      border-radius: 0 0 10px 0;
      transition: opacity 0.2s ease;
      opacity: 0.5;
    }
    
    .resize-handle:hover {
      opacity: 1;
    }

    .proxy-settings {
      margin-top: 12px;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .form-checkbox {
      margin-right: 10px;
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      background-color: white;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }
    
    .form-checkbox:checked {
      background-color: #007AFF;
      border-color: #007AFF;
    }
    
    .form-checkbox:checked::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 2px;
      width: 4px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .form-checkbox:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
    }
    
    #configToggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: rgba(0, 0, 0, 0.03);
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 12px;
      transition: all 0.2s ease;
      user-select: none;
    }
    
    #configToggle:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    
    #configToggle span {
      font-weight: 500;
      font-size: 14px;
      color: #1D1D1F;
    }

    /* 对话框样式 */
    .dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000000;
    }
    
    .dialog-content {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 400px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .dialog-header {
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .dialog-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #8E8E93;
      cursor: pointer;
      padding: 0;
    }
    
    .dialog-body {
      padding: 20px;
      overflow-y: auto;
      max-height: 60vh;
    }
    
    .dialog-footer {
      padding: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: flex-end;
    }
    
    .btn {
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      background-color: #007AFF;
      color: white;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn:hover {
      background-color: #0062CC;
    }
    
    .feature-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  `);

        console.log('Markdown 渲染库加载完成');

        // 加载第三方库
        try {
          // 加载 marked 库
          if (typeof marked === 'undefined') {
            const markedCode = GM_getResourceText('marked');
            eval(markedCode);
            console.log('marked 库加载成功');
          }

          // 加载 highlight.js
          if (typeof hljs === 'undefined') {
            const highlightCode = GM_getResourceText('highlight');
            eval(highlightCode);
            console.log('highlight.js 库加载成功');
          }

          // 添加高亮样式
          const highlightCSS = GM_getResourceText('highlightStyle');
          GM_addStyle(highlightCSS);
          console.log('highlight.js CSS 样式加载成功');

        } catch (error) {
          console.error('加载第三方库失败:', error);
        }
      }

      createApp() {
        this.app = document.createElement('div');
        this.app.id = 'article-summary-app';
        this.app.innerHTML = this.getAppHTML();
        document.body.appendChild(this.app);
        this.initializeElements();
      }

      createIcon() {
        this.iconElement = document.createElement('div');
        this.iconElement.id = 'article-summary-icon';
        this.iconElement.innerHTML = this.getIconHTML();
        document.body.appendChild(this.iconElement);

        // 不需要在这里设置display，因为CSS已经默认设置为none
      }

      initializeElements() {
        // 使用jQuery获取元素
        this.elements = {
          apiService: $('#apiService')[0],
          apiUrl: $('#apiUrl')[0],
          apiUrlContainer: $('#apiUrlContainer')[0],
          apiKey: $('#apiKey')[0],
          apiKeyContainer: $('#apiKeyContainer')[0],
          modelName: $('#modelName')[0],
          modelSelect: $('#modelSelect')[0],
          ollamaParamsContainer: $('#ollamaParamsContainer')[0],
          generateBtn: $('#generateBtn')[0],
          summaryResult: $('#summaryResult')[0],
          summaryContent: $('#summaryContent')[0],
          loadingIndicator: $('#loadingIndicator')[0],
          configToggle: $('#configToggle')[0],
          configPanel: $('#configPanel')[0],
          toggleMaxBtn: $('#toggleMaxBtn')[0],
          toggleMinBtn: $('#toggleMinBtn')[0],
          formatBtns: $('.format-btn'),
          copyBtn: $('#copyBtn')[0],
          apiProxyEnabled: $('#apiProxyEnabled')[0],
          apiProxyDomain: $('#apiProxyDomain')[0],
          proxyDomainContainer: $('#proxyDomainContainer')[0],
          proxySettingsContainer: $('#proxySettingsContainer')[0],
          openConfigBtn: $('#openConfigBtn')[0],
          featureDialog: $('#featureDialog')[0],
          closeFeatureDialog: $('#closeFeatureDialog')[0],
          saveFeatures: $('#saveFeatures')[0],
          featureSettings: $('#featureSettings')[0],
          featureToggles: $('.feature-toggle'),
          dialogFeatureCheckboxes: {
            autoExtract: $('#dialog_autoExtract')[0],
            apiProxy: $('#dialog_apiProxy')[0],
            ollamaIntegration: $('#dialog_ollamaIntegration')[0],
            customStyleMode: $('#dialog_customStyleMode')[0],
            advancedModelParams: $('#dialog_advancedModelParams')[0],
            showThinking: $('#dialog_showThinking')[0]
          },
          featureCheckboxes: {
            autoExtract: $('#feature_autoExtract')[0],
            apiProxy: $('#feature_apiProxy')[0],
            ollamaIntegration: $('#feature_ollamaIntegration')[0],
            customStyleMode: $('#feature_customStyleMode')[0],
            advancedModelParams: $('#feature_advancedModelParams')[0],
            showThinking: $('#feature_showThinking')[0]
          },
          viewBtns: $('.view-btn'),
          summaryTextarea: $('#summaryTextarea')[0],
          summaryPreview: $('#summaryPreview')[0],
        };

        // 检查关键元素是否存在
        const missingElements = [];
        if (!this.elements.apiService) missingElements.push('apiService');
        if (!this.elements.toggleMinBtn) missingElements.push('toggleMinBtn');
        if (!this.elements.toggleMaxBtn) missingElements.push('toggleMaxBtn');
        if (!$('#summary-header').length) missingElements.push('summary-header');

        if (missingElements.length > 0) {
          console.error('初始化元素检查: 以下元素未找到:', missingElements.join(', '));
        } else {
          console.log('初始化元素完成: 所有关键元素都已找到');
        }
      }

      bindEvents() {
        this.bindAppEvents();
        this.bindIconEvents();
        this.bindConfigEvents();
        this.bindResizeEvents();
      }

      bindAppEvents() {
        // 使用jQuery绑定事件，简化代码，增加安全性
        const self = this;

        // 绑定标题栏拖拽事件
        $('#summary-header').on('mousedown', function (e) { self.dragStart(e); });
        $(document).on('mousemove', function (e) { self.drag(e); });
        $(document).on('mouseup', function (e) { self.dragEnd(e); });

        // 按钮事件
        $('#toggleMaxBtn').on('click', function () { self.toggleMaximize(); });
        $('#toggleMinBtn').on('click', function () { self.toggleMinimize(); });
        $('#copyBtn').on('click', function () { self.copyContent(); });

        // 设置按钮事件
        $('#openConfigBtn').on('click', function () {
          // 打开特性设置对话框并传递true，表示来自设置按钮的点击
          self.openFeatureDialog(true);
        });
        $('#closeFeatureDialog').on('click', function () { self.closeFeatureDialog(); });
        $('#saveFeatures').on('click', function () { self.saveFeatureSettings(); });

        // 记录绑定状态
        console.log('应用事件绑定完成，绑定元素存在状态:', {
          'summary-header': $('#summary-header').length > 0,
          'toggleMaxBtn': $('#toggleMaxBtn').length > 0,
          'toggleMinBtn': $('#toggleMinBtn').length > 0
        });
      }

      bindIconEvents() {
        const self = this;

        // 图标拖拽和点击事件
        $('#article-summary-icon').on('mousedown', function (e) { self.iconDragStart(e); });
        $('#article-summary-icon').on('click', function () { self.toggleApp(); });
        $(document).on('mousemove', function (e) { self.iconDrag(e); });
        $(document).on('mouseup', function (e) { self.iconDragEnd(e); });

        console.log('图标事件绑定完成，绑定状态:', {
          'article-summary-icon': $('#article-summary-icon').length > 0
        });
      }

      bindConfigEvents() {
        const self = this;

        // API服务选择
        $('#apiService').on('change', function () { self.handleApiServiceChange(); });

        // 配置输入
        $('#apiUrl').on('change', function () { self.handleConfigChange(); });
        $('#apiKey').on('change', function () { self.handleConfigChange(); });
        $('#modelName').on('change', function () { self.handleConfigChange(); });
        $('#modelSelect').on('change', function () { self.handleModelSelectChange(); });

        // 配置面板
        $('#configToggle').on('click', function () { self.toggleConfig(); });

        // 格式按钮
        $('.format-btn').on('click', function (e) { self.handleFormatChange(e); });

        // 代理配置
        $('#apiProxyEnabled').on('change', function () { self.handleProxyConfigChange(); });
        $('#apiProxyDomain').on('change', function () { self.handleProxyConfigChange(); });

        // Ollama参数滑块
        $('.param-slider').on('input change', function (e) { self.handleParamChange(e); });

        // 功能设置复选框
        $('.feature-toggle').on('change', function (e) { self.handleFeatureToggle(e); });

        // 视图切换按钮
        $('.view-btn').on('click', function (e) { self.handleViewChange(e); });

        console.log('配置事件绑定完成');
      }

      bindResizeEvents() {
        const self = this;
        $('.resize-handle').on('mousedown', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.startResize(e);
        });

        console.log('调整大小事件绑定完成，绑定状态:', {
          'resize-handle': $('.resize-handle').length > 0
        });
      }

      startResize(e) {
        e.preventDefault();
        e.stopPropagation();

        // 初始位置
        this.isResizing = true;
        this.initialWidth = this.app.offsetWidth;
        this.initialHeight = this.app.offsetHeight;
        this.initialX = e.clientX;
        this.initialY = e.clientY;

        // 创建绑定的处理函数
        this.resizeHandler = this.resize.bind(this);
        this.stopResizeHandler = this.stopResize.bind(this);

        // 添加临时事件监听器
        document.addEventListener('mousemove', this.resizeHandler);
        document.addEventListener('mouseup', this.stopResizeHandler);
      }

      resize(e) {
        if (!this.isResizing) return;

        // 计算新尺寸，设置最小值限制
        const minWidth = 320;
        const minHeight = 300;
        const newWidth = Math.max(minWidth, this.initialWidth + (e.clientX - this.initialX));
        const newHeight = Math.max(minHeight, this.initialHeight + (e.clientY - this.initialY));

        // 应用新尺寸
        this.app.style.width = newWidth + 'px';
        this.app.style.height = newHeight + 'px';

        // 保存尺寸到配置
        this.saveAppSize(newWidth, newHeight);
      }

      saveAppSize(width, height) {
        // 保存应用尺寸到配置
        const appSize = { width, height };
        this.configManager.setAppSize(appSize);
      }

      stopResize() {
        this.isResizing = false;

        // 移除临时事件监听器
        document.removeEventListener('mousemove', this.resizeHandler);
        document.removeEventListener('mouseup', this.stopResizeHandler);
      }

      restoreState() {
        try {
          const configs = this.configManager.getConfigs();
          const apiService = this.configManager.getApiService();

          // 确保服务配置存在
          if (!configs[apiService]) {
            configs[apiService] = {
              url: apiService === 'ollama' ? 'http:/160.202.244.103:11434/api/chat' : '',
              model: apiService === 'ollama' ? 'deepseek-r1:7b' : '',
              key: ''
            };
            // 保存新创建的配置
            this.configManager.setConfigs(configs);
          }

          const currentConfig = configs[apiService];

          // 设置表单值
          $('#apiKey').val(currentConfig.key || '');
          $('#modelName').val(currentConfig.model || '');
          $('#apiUrl').val(currentConfig.url || '');

          // 显示/隐藏 API Key 输入框
          $('#apiKeyContainer').css('display', apiService === 'ollama' ? 'none' : 'block');

          // 显示/隐藏 Ollama 模型参数配置
          if ($('#ollamaParamsContainer').length) {
            $('#ollamaParamsContainer').css('display', (apiService === 'ollama' &&
              this.configManager.isFeatureEnabled('advancedModelParams')) ? 'block' : 'none');
          }

          // 根据服务类型添加类名
          if (apiService === 'ollama') {
            $(this.app).addClass('ollama-service').removeClass('non-ollama-service');

            // 尝试获取 Ollama 模型列表，但需要检查特性是否启用
            if (this.configManager.isFeatureEnabled('ollamaIntegration')) {
              this.fetchOllamaModels();
            } else {
              // 如果特性未启用，仍然需要设置模型选择
              const models = this.configManager.getOllamaModels();
              if (models && models.length > 0) {
                this.updateModelSelectOptions(models);
              } else {
                this.loadRecommendedOllamaModels();
              }
            }
          } else {
            $(this.app).removeClass('ollama-service').addClass('non-ollama-service');
          }

          $('#apiService').val(apiService);

          const format = this.configManager.getOutputFormat();
          $('.format-btn').each(function () {
            if ($(this).data('format') === format) {
              $(this).addClass('active');
            } else {
              $(this).removeClass('active');
            }
          });

          const configCollapsed = this.configManager.getConfigCollapsed();
          if (configCollapsed) {
            $('#configPanel').addClass('collapsed');
            $('#configToggle .toggle-icon').css('transform', 'rotate(-90deg)');
          }

          // 恢复最小化状态 - 使用jQuery操作DOM
          const appMinimized = this.configManager.getAppMinimized();
          console.log('恢复状态: 最小化状态 =', appMinimized);

          if (appMinimized) {
            // 使用jQuery设置显示状态
            $('#article-summary-app').hide();
            $('#article-summary-icon').css('display', 'flex');
            console.log('已恢复最小化状态');
          } else {
            // 使用jQuery设置显示状态
            $('#article-summary-app').css('display', 'flex');
            $('#article-summary-icon').hide();
            console.log('已恢复正常状态');
          }

          // 恢复位置
          const appPosition = this.configManager.getAppPosition();
          if (appPosition && this.app) {
            $(this.app).css({
              left: appPosition.x + 'px',
              top: appPosition.y + 'px',
              right: 'auto',
              bottom: 'auto'
            });
          }

          // 恢复尺寸
          const appSize = this.configManager.getAppSize();
          if (appSize && this.app) {
            $(this.app).css({
              width: appSize.width + 'px',
              height: appSize.height + 'px'
            });
          }

          const iconPosition = this.configManager.getIconPosition();
          if (iconPosition && this.iconElement) {
            $(this.iconElement).css({
              left: iconPosition.x + 'px',
              top: iconPosition.y + 'px',
              right: 'auto',
              bottom: 'auto'
            });
          }

          // 恢复转发配置
          const proxyEnabled = this.configManager.getApiProxyEnabled();
          const proxyDomain = this.configManager.getApiProxyDomain();

          $('#apiProxyEnabled').prop('checked', proxyEnabled);
          $('#apiProxyDomain').val(proxyDomain);
          $('#proxyDomainContainer').css('display', proxyEnabled ? 'block' : 'none');

          // 应用特性状态配置
          this.applyFeatureStates();

          // 更新功能设置复选框状态
          this.updateFeatureCheckboxes();

          console.log('状态恢复完成');
        } catch (error) {
          console.error('恢复状态过程中出错:', error);
        }
      }

      // 拖拽相关方法
      dragStart(e) {
        this.isDragging = true;
        this.initialX = e.clientX - this.app.offsetLeft;
        this.initialY = e.clientY - this.app.offsetTop;
      }

      drag(e) {
        if (this.isDragging) {
          e.preventDefault();
          const currentX = Math.max(0, Math.min(
            e.clientX - this.initialX,
            window.innerWidth - this.app.offsetWidth
          ));
          const currentY = Math.max(0, Math.min(
            e.clientY - this.initialY,
            window.innerHeight - this.app.offsetHeight
          ));

          this.app.style.left = currentX + 'px';
          this.app.style.top = currentY + 'px';
        }
      }

      dragEnd() {
        if (this.isDragging) {
          this.isDragging = false;
          const position = {
            x: parseInt(this.app.style.left),
            y: parseInt(this.app.style.top)
          };
          this.configManager.setAppPosition(position);
        }
      }

      // 图标拖拽相关方法
      iconDragStart(e) {
        this.isIconDragging = true;
        this.iconInitialX = e.clientX - this.iconElement.offsetLeft;
        this.iconInitialY = e.clientY - this.iconElement.offsetTop;
        this.iconElement.style.cursor = 'grabbing';
      }

      iconDrag(e) {
        if (this.isIconDragging) {
          e.preventDefault();
          const currentX = Math.max(0, Math.min(
            e.clientX - this.iconInitialX,
            window.innerWidth - this.iconElement.offsetWidth
          ));
          const currentY = Math.max(0, Math.min(
            e.clientY - this.iconInitialY,
            window.innerHeight - this.iconElement.offsetHeight
          ));

          this.iconElement.style.left = currentX + 'px';
          this.iconElement.style.top = currentY + 'px';
          this.iconElement.style.right = 'auto';
        }
      }

      iconDragEnd() {
        if (this.isIconDragging) {
          this.isIconDragging = false;
          this.iconElement.style.cursor = 'pointer';
          const position = {
            x: parseInt(this.iconElement.style.left),
            y: parseInt(this.iconElement.style.top)
          };
          this.configManager.setIconPosition(position);
        }
      }

      // 配置相关方法
      handleApiServiceChange() {
        const service = this.elements.apiService.value;
        const configs = this.configManager.getConfigs();

        // 确保服务配置存在，如果不存在则创建默认配置
        if (!configs[service]) {
          configs[service] = {
            url: service === 'ollama' ? 'http:/160.202.244.103:11434/api/chat' : '',
            model: service === 'ollama' ? 'deepseek-r1:7b' : '',
            key: service === 'ollama' ? '' : '必填'  // Ollama不需要API Key
          };
          // 保存新创建的配置
          this.configManager.setConfigs(configs);
        }

        const currentConfig = configs[service];

        // 设置表单值
        this.elements.apiKey.value = currentConfig.key || '';
        this.elements.modelName.value = currentConfig.model || '';
        this.elements.apiUrl.value = currentConfig.url || '';

        // 显示/隐藏 API Key 输入框 - Ollama不需要API Key
        this.elements.apiKeyContainer.style.display = service === 'ollama' ? 'none' : 'block';

        // 显示/隐藏 Ollama 模型参数配置
        if (this.elements.ollamaParamsContainer) {
          this.elements.ollamaParamsContainer.style.display = service === 'ollama' ?
            (this.configManager.isFeatureEnabled('advancedModelParams') ? 'block' : 'none') : 'none';
        }

        // 根据服务类型添加类名
        if (service === 'ollama') {
          this.app.classList.add('ollama-service');
          this.app.classList.remove('non-ollama-service');

          // 尝试获取 Ollama 模型列表，但需要检查特性是否启用
          if (this.configManager.isFeatureEnabled('ollamaIntegration')) {
            this.fetchOllamaModels();
          } else {
            // 如果特性未启用，仍然需要设置模型选择
            const models = this.configManager.getOllamaModels();
            if (models && models.length > 0) {
              this.updateModelSelectOptions(models);
            } else {
              this.loadRecommendedOllamaModels();
            }
          }
        } else {
          this.app.classList.remove('ollama-service');
          this.app.classList.add('non-ollama-service');
        }

        this.configManager.setApiService(service);
      }

      handleConfigChange() {
        const service = this.elements.apiService.value;
        const configs = this.configManager.getConfigs();

        // 确保服务配置存在
        if (!configs[service]) {
          configs[service] = {
            url: service === 'ollama' ? 'http:/160.202.244.103:11434/api/chat' : '',
            model: service === 'ollama' ? 'deepseek-r1:7b' : '',
            key: ''
          };
        }

        // 获取当前表单值
        const apiKey = this.elements.apiKey.value || '';
        const modelName = service === 'ollama' ?
          (this.elements.modelSelect.value || 'llama2') :
          (this.elements.modelName.value || '');
        const apiUrl = this.elements.apiUrl.value ||
          (service === 'ollama' ? 'http:/160.202.244.103:11434/api/chat' : '');

        // 更新配置
        configs[service] = {
          ...configs[service],
          key: apiKey,
          model: modelName,
          url: apiUrl
        };

        // 保存配置
        this.configManager.setConfigs(configs);
      }

      toggleConfig() {
        this.elements.configPanel.classList.toggle('collapsed');
        const isCollapsed = this.elements.configPanel.classList.contains('collapsed');
        const toggleIcon = this.elements.configToggle.querySelector('.toggle-icon');
        toggleIcon.style.transform = isCollapsed ? 'rotate(-90deg)' : '';
        this.configManager.setConfigCollapsed(isCollapsed);
      }

      handleFormatChange(e) {
        // 修复 forEach 不是函数的错误，改用 jQuery 的 each 方法迭代
        $(this.elements.formatBtns).each(function () {
          $(this).removeClass('active');
        });
        $(e.target).addClass('active');
        this.configManager.setOutputFormat(e.target.dataset.format);
      }

      handleModelSelectChange() {
        // 获取当前选中的值
        const selectValue = this.elements.modelSelect.value;

        // 如果选择了空值，则允许手动输入
        if (!selectValue) {
          const customModel = prompt('请输入Ollama模型名称:\n\n提示：您可以访问 https://freeollama.oneplus1.top/ 获取免费的Ollama服务', '');
          if (customModel && customModel.trim()) {
            // 检查是否已存在该选项
            const existingOption = Array.from(this.elements.modelSelect.options).find(opt => opt.value === customModel);

            if (!existingOption) {
              // 添加新选项
              const newOption = document.createElement('option');
              newOption.value = customModel;
              newOption.textContent = customModel + ' (自定义)';
              this.elements.modelSelect.appendChild(newOption);
            }

            // 设置为选中状态
            this.elements.modelSelect.value = customModel;
            this.elements.modelName.value = customModel;
          } else {
            // 如果取消或输入为空，恢复之前的选择
            const configs = this.configManager.getConfigs();
            const currentModel = configs.ollama.model || 'llama2';
            this.elements.modelSelect.value = currentModel;
            this.elements.modelName.value = currentModel;
            return;
          }
        } else {
          // 正常选择了一个值
          this.elements.modelName.value = selectValue;
        }

        // 触发配置更新
        this.handleConfigChange();

        // 如果启用了高级参数设置，显示相应参数配置区域
        if (this.configManager.isFeatureEnabled('advancedModelParams')) {
          this.updateModelParamsUI();
        }
      }

      // 更新模型参数UI
      updateModelParamsUI() {
        if (!this.elements.ollamaParamsContainer) return;

        // 获取当前模型参数
        const params = this.configManager.getOllamaParams();

        // 更新UI上的参数值
        Object.keys(this.configManager.OLLAMA_PARAMS).forEach(paramKey => {
          const element = document.getElementById(`param_${paramKey}`);
          if (element) {
            element.value = params[paramKey] || this.configManager.OLLAMA_PARAMS[paramKey].default;
            // 更新显示值
            const displayElement = document.getElementById(`param_${paramKey}_value`);
            if (displayElement) {
              displayElement.textContent = element.value;
            }
          }
        });
      }

      // 处理参数变更
      handleParamChange(event) {
        const paramName = event.target.id.replace('param_', '');
        const paramValue = parseFloat(event.target.value);

        // 更新显示值
        const displayElement = document.getElementById(`param_${paramName}_value`);
        if (displayElement) {
          displayElement.textContent = paramValue;
        }

        // 更新配置
        const params = this.configManager.getOllamaParams();
        params[paramName] = paramValue;
        this.configManager.setOllamaParams(params);
      }

      // UI状态相关方法
      toggleMaximize() {
        if (!this.isMaximized) {
          this.previousSize = {
            width: this.app.style.width,
            height: this.app.style.height,
            left: this.app.style.left,
            top: this.app.style.top
          };

          this.app.style.width = '100%';
          this.app.style.height = '100vh';
          this.app.style.left = '0';
          this.app.style.top = '0';

          this.elements.toggleMaxBtn.innerHTML = this.getMaximizeIcon();
        } else {
          Object.assign(this.app.style, this.previousSize);
          this.elements.toggleMaxBtn.innerHTML = this.getRestoreIcon();
        }
        this.isMaximized = !this.isMaximized;
      }

      toggleMinimize() {
        try {
          // 使用jQuery切换显示状态
          $('#article-summary-app').hide();
          $('#article-summary-icon').css('display', 'flex');

          // 保存状态
          this.configManager.setAppMinimized(true);

          console.log('应用已最小化');
        } catch (error) {
          console.error('最小化过程中出错:', error);
        }
      }

      toggleApp() {
        try {
          // 使用jQuery切换显示状态
          $('#article-summary-app').css('display', 'flex');
          $('#article-summary-icon').hide();

          // 保存状态
          this.configManager.setAppMinimized(false);

          console.log('应用已恢复');
        } catch (error) {
          console.error('恢复应用过程中出错:', error);
        }
      }

      // 工具方法
      copyContent() {
        const activeViewBtn = document.querySelector('.view-btn.active');
        const viewMode = activeViewBtn ? activeViewBtn.dataset.view : 'markdown';

        let textToCopy;
        if (viewMode === 'markdown') {
          textToCopy = this.elements.summaryTextarea.value;
        } else {
          // 从预览区域提取纯文本内容
          textToCopy = this.elements.summaryTextarea.value;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalHTML = this.elements.copyBtn.innerHTML;
          this.elements.copyBtn.innerHTML = this.getCopiedIcon();
          setTimeout(() => {
            this.elements.copyBtn.innerHTML = originalHTML;
          }, 2000);
        }).catch(err => {
          console.error('复制失败:', err);
          alert('复制失败，请手动选择文本复制');
        });
      }

      // HTML模板方法
      getAppHTML() {
        return `
  <div id="summary-header">
    <h3>文章总结助手</h3>
    <div id="summary-header-actions">
      <button id="openConfigBtn" class="header-btn" data-tooltip="功能设置">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
      <button id="toggleMinBtn" class="header-btn" data-tooltip="最小化">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 18h8"></path>
        </svg>
      </button>
      <button id="toggleMaxBtn" class="header-btn" data-tooltip="最大化">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"></path>
        </svg>
      </button>
    </div>
  </div>
  <div id="summary-body">
    <div id="config-section">
      <div id="configToggle">
        <span>配置选项</span>
        <svg class="icon toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      <div id="configPanel">
        <div class="form-group">
          <label class="form-label" for="apiService">API服务</label>
          <select id="apiService" class="form-select">
                <option value="ollama">Ollama</option>
            <option value="gptgod">GPT God</option>
            <option value="deepseek">DeepSeek</option>
            <option value="custom">自定义</option>
          </select>
        </div>
        
            <div id="apiUrlContainer" class="form-group">
              <label class="form-label" for="apiUrl">API地址</label>
              <input type="text" id="apiUrl" class="form-input" placeholder="http:/160.202.244.103:11434/api/chat">
        </div>
        
            <div class="form-group" id="apiKeyContainer">
          <label class="form-label" for="apiKey">API Key</label>
          <input type="password" id="apiKey" class="form-input" placeholder="sk-...">
        </div>
        
        <div class="form-group">
          <label class="form-label" for="modelName">模型</label>
              <select id="modelSelect" class="form-select">
                <option value="">-- 输入或选择模型 --</option>
                <option value="llama2">llama2</option>
                <option value="llama2:13b">llama2:13b</option>
                <option value="llama2:70b">llama2:70b</option>
                <option value="mistral">mistral</option>
                <option value="mixtral">mixtral</option>
                <option value="gemma:2b">gemma:2b</option>
                <option value="gemma:7b">gemma:7b</option>
                <option value="qwen:14b">qwen:14b</option>
                <option value="qwen:72b">qwen:72b</option>
                <option value="phi3:mini">phi3:mini</option>
                <option value="phi3:small">phi3:small</option>
                <option value="phi3:medium">phi3:medium</option>
                <option value="yi:34b">yi:34b</option>
              </select>
              <input type="text" id="modelName" class="form-input" placeholder="模型名称">
              <small class="form-tip">没有Ollama服务？<a href="https://freeollama.oneplus1.top/" target="_blank">点击这里</a>获取免费Ollama服务</small>
        </div>
        
        <!-- Ollama模型参数设置部分 -->
        <div id="ollamaParamsContainer" class="form-group" style="display: none;">
          <label class="form-label">Ollama 模型参数设置</label>
          <div class="ollama-params">
            <!-- 温度参数 -->
            <div class="param-item">
              <div class="param-header">
                <label for="param_temperature">创造性 (<span id="param_temperature_value">0.8</span>)</label>
                <div class="param-desc">值越高结果越有创造性，越低越保守</div>
              </div>
              <input type="range" id="param_temperature" class="param-slider" min="0" max="2" step="0.1" value="0.8">
            </div>
            
            <!-- Top P参数 -->
            <div class="param-item">
              <div class="param-header">
                <label for="param_top_p">多样性 (<span id="param_top_p_value">0.9</span>)</label>
                <div class="param-desc">控制输出的多样性</div>
              </div>
              <input type="range" id="param_top_p" class="param-slider" min="0" max="1" step="0.05" value="0.9">
            </div>
            
            <!-- Top K参数 -->
            <div class="param-item">
              <div class="param-header">
                <label for="param_top_k">词汇范围 (<span id="param_top_k_value">40</span>)</label>
                <div class="param-desc">控制生成内容的词汇范围</div>
              </div>
              <input type="range" id="param_top_k" class="param-slider" min="1" max="100" step="1" value="40">
            </div>
            
            <!-- Context长度参数 -->
            <div class="param-item">
              <div class="param-header">
                <label for="param_num_ctx">上下文长度 (<span id="param_num_ctx_value">4096</span>)</label>
                <div class="param-desc">控制模型可用的上下文窗口大小</div>
              </div>
              <input type="range" id="param_num_ctx" class="param-slider" min="512" max="8192" step="512" value="4096">
            </div>
            
            <!-- 重复惩罚参数 -->
            <div class="param-item">
              <div class="param-header">
                <label for="param_repeat_penalty">重复惩罚 (<span id="param_repeat_penalty_value">1.1</span>)</label>
                <div class="param-desc">控制模型避免重复内容的程度</div>
              </div>
              <input type="range" id="param_repeat_penalty" class="param-slider" min="0.5" max="2" step="0.1" value="1.1">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">输出格式</label>
          <div id="formatOptions">
            <span class="format-btn active" data-format="markdown">Markdown</span>
            <span class="format-btn" data-format="bullet">要点列表</span>
            <span class="format-btn" data-format="paragraph">段落</span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">显示选项</label>
          <div class="checkbox-container">
            <input type="checkbox" id="feature_showThinking" class="feature-toggle form-checkbox">
            <label for="feature_showThinking">显示思考过程</label>
          </div>
        </div>
        
        <div id="proxySettingsContainer" class="form-group">
          <label class="form-label">API转发设置</label>
          <div class="proxy-settings">
            <div class="checkbox-container">
              <input type="checkbox" id="apiProxyEnabled" class="form-checkbox">
              <label for="apiProxyEnabled">启用API转发</label>
            </div>
            <div id="proxyDomainContainer" class="form-group" style="display: none;">
              <label class="form-label" for="apiProxyDomain">转发服务域名</label>
              <input type="text" id="apiProxyDomain" class="form-input" placeholder="https://nakoruru.h7ml.cn">
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <button type="button" id="generateBtn">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
      生成总结
    </button>
    
    <div id="summaryResult">
      <div id="summaryHeader">
        <h4>文章总结</h4>
        <div id="summaryActions">
          <div id="viewOptions">
            <span class="view-btn active" data-view="markdown">Markdown</span>
            <span class="view-btn" data-view="preview">预览</span>
          </div>
          <button id="copyBtn" class="action-btn" data-tooltip="复制到剪贴板">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
            </svg>
            复制
          </button>
        </div>
      </div>
      <div id="summaryContent" class="markdown-body">
        <textarea id="summaryTextarea" class="content-textarea" placeholder="生成的总结将显示在这里..."></textarea>
        <div id="summaryPreview" class="preview-area"></div>
      </div>
    </div>
    
    <div id="loadingIndicator">
      <div class="spinner"></div>
      <p>正在生成总结，请稍候...</p>
    </div>
    <div class="resize-handle"></div>
  </div>
  
  <!-- 功能设置对话框 -->
  <div id="featureDialog" class="dialog">
    <div class="dialog-content">
      <div class="dialog-header">
        <h3>功能设置</h3>
        <button id="closeFeatureDialog" class="close-btn">&times;</button>
      </div>
      <div class="dialog-body">
        <div class="feature-options">
          <div class="checkbox-container">
            <input type="checkbox" id="dialog_autoExtract" class="feature-checkbox">
            <label for="dialog_autoExtract">自动提取文章内容</label>
            <div class="desc-text">启用后自动从页面提取文章内容，禁用则需要手动输入</div>
          </div>
          
          <div class="checkbox-container">
            <input type="checkbox" id="dialog_apiProxy" class="feature-checkbox">
            <label for="dialog_apiProxy">API转发服务</label>
            <div class="desc-text">启用后可以使用转发服务连接被墙的API</div>
          </div>
          
          <div class="checkbox-container">
            <input type="checkbox" id="dialog_ollamaIntegration" class="feature-checkbox">
            <label for="dialog_ollamaIntegration">Ollama本地模型集成</label>
            <div class="desc-text">启用后可以使用本地运行的Ollama模型</div>
          </div>
          
          <div class="checkbox-container">
            <input type="checkbox" id="dialog_customStyleMode" class="feature-checkbox">
            <label for="dialog_customStyleMode">自定义样式模式</label>
            <div class="desc-text">启用后使用自定义样式主题</div>
          </div>
          
          <div class="checkbox-container">
            <input type="checkbox" id="dialog_advancedModelParams" class="feature-checkbox">
            <label for="dialog_advancedModelParams">高级模型参数设置</label>
            <div class="desc-text">启用后可以调整模型参数（温度、top_p等）</div>
          </div>
          
          <div class="checkbox-container">
            <input type="checkbox" id="dialog_showThinking" class="feature-checkbox">
            <label for="dialog_showThinking">显示思考过程</label>
            <div class="desc-text">启用后显示模型的思考过程（&lt;think&gt;标签内容）</div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <button id="saveFeatures" class="btn">保存设置</button>
      </div>
    </div>
  </div>
`;
      }

      getIconHTML() {
        return `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 12h6m-6 4h6m2-10H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z"></path>
  </svg>
`;
      }

      getMaximizeIcon() {
        return `
  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"></path>
  </svg>
`;
      }

      getRestoreIcon() {
        return `
  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
  </svg>
`;
      }

      getCopiedIcon() {
        return `
  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6L9 17l-5-5"></path>
  </svg>
  已复制
`;
      }

      async fetchOllamaModels() {
        return new Promise((resolve, reject) => {
          const ollamaConfig = this.configManager.getConfigs().ollama;
          if (!ollamaConfig || !ollamaConfig.url) {
            console.error('Ollama API地址未配置');
            resolve([]); // 返回空数组
            return;
          }

          try {
            // 从 API URL 中提取基础 URL
            let baseUrl = ollamaConfig.url;
            // 移除路径部分，只保留协议和主机部分
            if (baseUrl.includes('/api/')) {
              baseUrl = baseUrl.split('/api/')[0];
            } else {
              // 如果没有/api/，尝试提取协议和主机
              const urlObj = new URL(baseUrl);
              baseUrl = `${urlObj.protocol}//${urlObj.hostname}:${urlObj.port || 11434}`;
            }

            const modelsEndpoint = `${baseUrl}/api/tags`;

            console.log('正在获取Ollama模型列表，请求地址:', modelsEndpoint);
            const transformedEndpoint = this.transformUrl(modelsEndpoint);

            GM_xmlhttpRequest({
              method: 'GET',
              url: transformedEndpoint,
              headers: {
                'Content-Type': 'application/json'
              },
              onload: (response) => {
                try {
                  if (response.status >= 400) {
                    console.warn('获取 Ollama 模型列表失败:', response.statusText);
                    // 加载推荐模型作为后备方案
                    this.loadRecommendedOllamaModels();
                    resolve([]);
                    return;
                  }

                  const data = JSON.parse(response.responseText);
                  if (data.models && Array.isArray(data.models)) {
                    // 提取模型名称
                    const models = data.models.map(model => model.name);
                    console.log('成功获取Ollama模型列表:', models);

                    // 更新模型到配置
                    this.configManager.setOllamaModels(models);

                    // 更新下拉选项
                    this.updateModelSelectOptions(models);

                    resolve(models);
                  } else {
                    console.warn('Ollama API 返回的模型列表格式异常:', data);
                    // 加载推荐模型作为后备方案
                    this.loadRecommendedOllamaModels();
                    resolve([]);
                  }
                } catch (error) {
                  console.error('解析 Ollama 模型列表失败:', error);
                  // 加载推荐模型作为后备方案
                  this.loadRecommendedOllamaModels();
                  resolve([]);
                }
              },
              onerror: (error) => {
                console.error('获取 Ollama 模型列表请求失败:', error);
                // 加载推荐模型作为后备方案
                this.loadRecommendedOllamaModels();
                resolve([]);
              }
            });
          } catch (error) {
            console.error('构建Ollama API请求URL失败:', error);
            // 加载推荐模型作为后备方案
            this.loadRecommendedOllamaModels();
            resolve([]);
          }
        });
      }

      // 使用获取到的模型列表更新下拉选项
      updateModelSelectOptions(models) {
        // 清空现有选项
        this.elements.modelSelect.innerHTML = '';

        // 添加默认选项，允许用户手动输入
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "-- 输入或选择模型 --";
        this.elements.modelSelect.appendChild(defaultOption);

        // 添加从服务器获取的模型选项
        if (models && models.length > 0) {
          models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            this.elements.modelSelect.appendChild(option);
          });
        } else {
          // 如果没有获取到模型，使用推荐模型列表
          this.configManager.OLLAMA_RECOMMEND_MODELS.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model + ' (推荐)';
            this.elements.modelSelect.appendChild(option);
          });
        }

        // 设置当前选中的模型
        const configs = this.configManager.getConfigs();
        const currentModel = configs.ollama.model;
        if (currentModel) {
          // 检查当前模型是否在列表中
          const existingOption = Array.from(this.elements.modelSelect.options).find(opt => opt.value === currentModel);
          if (existingOption) {
            this.elements.modelSelect.value = currentModel;
          } else {
            // 如果不在列表中，添加一个新选项
            const newOption = document.createElement('option');
            newOption.value = currentModel;
            newOption.textContent = currentModel + ' (自定义)';
            this.elements.modelSelect.appendChild(newOption);
            this.elements.modelSelect.value = currentModel;
          }
        }
      }

      // 加载推荐的Ollama模型列表
      loadRecommendedOllamaModels() {
        // 清空现有选项
        this.elements.modelSelect.innerHTML = '';

        // 添加默认选项，允许用户手动输入
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "-- 输入或选择模型 --";
        this.elements.modelSelect.appendChild(defaultOption);

        // 添加推荐模型选项
        this.configManager.OLLAMA_RECOMMEND_MODELS.forEach(model => {
          const option = document.createElement('option');
          option.value = model;
          option.textContent = model + ' (推荐)';
          this.elements.modelSelect.appendChild(option);
        });

        // 设置当前选中的模型
        const configs = this.configManager.getConfigs();
        const currentModel = configs.ollama.model;
        if (currentModel) {
          // 检查当前模型是否在列表中
          const existingOption = Array.from(this.elements.modelSelect.options).find(opt => opt.value === currentModel);
          if (existingOption) {
            this.elements.modelSelect.value = currentModel;
          } else {
            // 如果不在列表中，添加一个新选项
            const newOption = document.createElement('option');
            newOption.value = currentModel;
            newOption.textContent = currentModel + ' (自定义)';
            this.elements.modelSelect.appendChild(newOption);
            this.elements.modelSelect.value = currentModel;
          }
        }
      }

      // 添加处理转发配置变更的方法
      handleProxyConfigChange() {
        const proxyEnabled = this.elements.apiProxyEnabled.checked;
        const proxyDomain = this.elements.apiProxyDomain.value.trim();

        // 更新配置
        this.configManager.setApiProxyEnabled(proxyEnabled);
        if (proxyDomain) {
          this.configManager.setApiProxyDomain(proxyDomain);
        }

        // 显示/隐藏域名输入框
        this.elements.proxyDomainContainer.style.display = proxyEnabled ? 'block' : 'none';
      }

      // 更新功能设置复选框状态
      updateFeatureCheckboxes() {
        // 获取当前特性状态
        const featureStates = this.configManager.getFeatureStates();

        // 更新对话框中的复选框状态
        if (this.elements.dialogFeatureCheckboxes) {
          Object.keys(this.elements.dialogFeatureCheckboxes).forEach(key => {
            const checkbox = this.elements.dialogFeatureCheckboxes[key];
            if (checkbox) {
              checkbox.checked = featureStates[key] === true;
            }
          });
        }

        // 更新主界面中的复选框状态
        if (this.elements.featureCheckboxes) {
          Object.keys(this.elements.featureCheckboxes).forEach(key => {
            const checkbox = this.elements.featureCheckboxes[key];
            if (checkbox) {
              checkbox.checked = featureStates[key] === true;
            }
          });
        }
      }

      // 打开特性设置对话框
      openFeatureDialog(fromConfigButton = false) {
        if (this.elements.featureDialog) {
          // 如果是从设置按钮点击来的，则切换配置面板状态
          if (fromConfigButton) {
            this.toggleConfig(); // 切换配置面板的展开/收起状态
          } else if (this.elements.configPanel.classList.contains('collapsed')) {
            // 如果是从其他地方调用的且配置面板是收起的，则展开配置面板
            this.toggleConfig();
          }

          // 更新对话框中的复选框状态
          this.updateFeatureCheckboxes();

          // 显示对话框
          this.elements.featureDialog.style.display = 'flex';
        } else {
          console.error('功能设置对话框元素不存在');
        }
      }

      // 关闭特性设置对话框
      closeFeatureDialog() {
        if (this.elements.featureDialog) {
          this.elements.featureDialog.style.display = 'none';
        }
      }

      // 保存特性设置
      saveFeatureSettings() {
        const newStates = {};

        // 从对话框中获取状态
        if (this.elements.dialogFeatureCheckboxes) {
          Object.keys(this.elements.dialogFeatureCheckboxes).forEach(key => {
            const checkbox = this.elements.dialogFeatureCheckboxes[key];
            if (checkbox) {
              newStates[key] = checkbox.checked;
            }
          });
        }

        // 保存到配置
        this.configManager.setFeatureStates(newStates);

        // 应用新状态到UI
        this.applyFeatureStates();

        // 关闭对话框
        this.closeFeatureDialog();
      }

      // 处理特性开关变更
      handleFeatureToggle(event) {
        const featureId = event.target.id.replace('feature_', '');
        const isEnabled = event.target.checked;

        const newStates = {};
        newStates[featureId] = isEnabled;

        // 保存到配置
        this.configManager.setFeatureStates(newStates);

        // 应用新状态到UI
        this.applyFeatureStates();
      }

      // URL转换函数 - 从APIService类引入到UIManager类
      transformUrl(url) {
        // 检查是否启用了转发
        if (!this.configManager.getApiProxyEnabled() || !this.configManager.isFeatureEnabled('apiProxy')) {
          return url; // 如果未启用转发，直接返回原始URL
        }

        try {
          // 获取转发服务域名
          const proxyDomain = this.configManager.getApiProxyDomain();
          if (!proxyDomain) {
            return url; // 如果未设置转发域名，直接返回原始URL
          }

          // 解析原始URL
          const urlObj = new URL(url);
          const protocol = urlObj.protocol;
          const hostname = urlObj.hostname;
          const pathname = urlObj.pathname;
          const search = urlObj.search;

          // 根据规则转换URL
          let proxyUrl;
          if (protocol === 'https:') {
            // HTTPS转发
            proxyUrl = `${proxyDomain}/proxy/${hostname}${pathname}${search}`;
          } else if (protocol === 'http:') {
            // HTTP转发
            proxyUrl = `${proxyDomain}/httpproxy/${hostname}${pathname}${search}`;
          } else if (url.includes('api.')) {
            // API转发 - 针对包含api.的域名
            proxyUrl = `${proxyDomain}/api/${hostname}${pathname}${search}`;
          } else {
            return url; // 不符合转发规则，返回原始URL
          }

          console.log(`API转发: ${url} -> ${proxyUrl}`);
          return proxyUrl;
        } catch (error) {
          console.error('URL转换失败:', error);
          return url; // 出错时返回原始URL
        }
      }

      // 添加处理视图切换的方法
      handleViewChange(e) {
        $('.view-btn').removeClass('active');
        $(e.target).addClass('active');

        const viewMode = e.target.dataset.view;
        this.toggleViewMode(viewMode);
      }

      toggleViewMode(viewMode) {
        if (viewMode === 'markdown') {
          $(this.elements.summaryTextarea).show();
          $(this.elements.summaryPreview).hide();
        } else if (viewMode === 'preview') {
          $(this.elements.summaryTextarea).hide();
          $(this.elements.summaryPreview).show();
        }
      }
    }

    // 文章提取类
    class ArticleExtractor {
      constructor(configManager) {
        this.configManager = configManager;
        this.selectors = [
          '#js_content',
          '.RichText',
          '.article-content',
          '#article_content',
          '#cnblogs_post_body',
          'article',
          '.article',
          '.post-content',
          '.content',
          '.entry-content',
          '.article-content',
          'main',
          '#main',
          '.main'
        ];

        this.removeSelectors = [
          'script',
          'style',
          'iframe',
          'nav',
          'header',
          'footer',
          '.advertisement',
          '.ad',
          '.ads',
          '.social-share',
          '.related-posts',
          '.comments',
          '.comment',
          '.author-info',
          '.article-meta',
          '.article-info',
          '.article-header',
          '.article-footer',
          '#article-summary-app'
        ];
      }

      async extract() {
        // 如果禁用了自动提取特性，则显示文本输入框让用户手动输入
        if (!this.configManager.isFeatureEnabled('autoExtract')) {
          const userInput = prompt('请输入要总结的文本内容：');
          if (userInput && userInput.length > 20) {
            return userInput;
          } else if (userInput) {
            alert('输入内容太短，将尝试自动提取文章内容');
          }
        }

        // 尝试使用不同的选择器获取内容
        for (const selector of this.selectors) {
          const element = document.querySelector(selector);
          if (element) {
            const content = this.processElement(element);
            if (content.length > 100) {
              return content;
            }
          }
        }

        // 如果上述方法都失败，尝试获取整个页面的主要内容
        const content = this.processElement(document.body);
        if (content.length < 100) {
          throw new Error('无法获取足够的文章内容');
        }

        return content;
      }

      processElement(element) {
        const clone = element.cloneNode(true);
        this.removeUnwantedElements(clone);
        return this.cleanText(clone.innerText);
      }

      removeUnwantedElements(element) {
        this.removeSelectors.forEach(selector => {
          const elements = element.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        });
      }

      cleanText(text) {
        return text
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n')
          .trim();
      }
    }

    // API服务类
    class APIService {
      constructor(configManager) {
        this.configManager = configManager;
      }

      async generateSummary(content) {
        const configs = this.configManager.getConfigs();
        const apiService = this.configManager.getApiService();
        const currentConfig = configs[apiService];
        const outputFormat = this.configManager.getOutputFormat();

        const apiEndpoint = this.getApiEndpoint(apiService, currentConfig);
        const transformedEndpoint = this.transformUrl(apiEndpoint);
        const systemPrompt = this.getSystemPrompt(outputFormat);
        const messages = this.createMessages(systemPrompt, content);

        return this.makeRequest(transformedEndpoint, currentConfig, messages);
      }

      async fetchOllamaModels() {
        return new Promise((resolve, reject) => {
          const ollamaConfig = this.configManager.getConfigs().ollama;
          // 从 API URL 中提取基础 URL
          const baseUrl = ollamaConfig.url.split('/api/')[0] || 'http://localhost:11434';
          const modelsEndpoint = `${baseUrl}/api/tags`;

          const transformedEndpoint = this.transformUrl(modelsEndpoint);

          GM_xmlhttpRequest({
            method: 'GET',
            url: transformedEndpoint,
            headers: {
              'Content-Type': 'application/json'
            },
            onload: (response) => {
              try {
                if (response.status >= 400) {
                  console.warn('获取 Ollama 模型列表失败:', response.statusText);
                  resolve([]); // 失败时返回空数组，使用默认模型列表
                  return;
                }

                const data = JSON.parse(response.responseText);
                if (data.models && Array.isArray(data.models)) {
                  // 提取模型名称
                  const models = data.models.map(model => model.name);
                  resolve(models);
                } else {
                  console.warn('Ollama API 返回的模型列表格式异常:', data);
                  resolve([]);
                }
              } catch (error) {
                console.error('解析 Ollama 模型列表失败:', error);
                resolve([]); // 失败时返回空数组，使用默认模型列表
              }
            },
            onerror: (error) => {
              console.error('获取 Ollama 模型列表请求失败:', error);
              resolve([]); // 失败时返回空数组，使用默认模型列表
            }
          });
        });
      }

      getApiEndpoint(apiService, config) {
        // 特殊处理freeollama.oneplus1.top域名的URL
        if (config.url && config.url.includes('freeollama.oneplus1.top')) {
          // 确保URL格式正确
          if (!config.url.endsWith('/api/chat')) {
            return config.url.replace(/\/?$/, '/api/chat');
          }
        }
        return config.url;
      }

      getSystemPrompt(format) {
        const prompts = {
          markdown: "请用中文总结以下文章的主要内容，以标准Markdown格式输出，包括标题、小标题和要点。确保格式规范，便于阅读。",
          bullet: "请用中文总结以下文章的主要内容，以简洁的要点列表形式输出，每个要点前使用'- '标记。",
          paragraph: "请用中文总结以下文章的主要内容，以连贯的段落形式输出，突出文章的核心观点和结论。"
        };
        return prompts[format] || "请用中文总结以下文章的主要内容，以简洁的方式列出重点。";
      }

      createMessages(systemPrompt, content) {
        const apiService = this.configManager.getApiService();
        if (apiService === 'ollama') {
          return [
            { role: "system", content: systemPrompt },
            { role: "user", content: content }
          ];
        } else {
          return [
            { role: "system", content: systemPrompt },
            { role: "user", content: content }
          ];
        }
      }

      makeRequest(endpoint, config, messages) {
        return new Promise((resolve, reject) => {
          const apiService = this.configManager.getApiService();

          // 确保配置有效
          if (!endpoint) {
            reject(new Error('API 地址无效'));
            return;
          }

          if (!config.model) {
            reject(new Error('模型名称无效'));
            return;
          }

          // 构建请求数据
          const requestData = {
            model: config.model,
            messages: messages,
            stream: false
          };

          // 为 Ollama 服务添加参数
          if (apiService === 'ollama' && this.configManager.isFeatureEnabled('advancedModelParams')) {
            const ollamaParams = this.configManager.getOllamaParams();
            if (ollamaParams) {
              requestData.options = { ...ollamaParams };
            }
          }

          // 构建请求头
          const headers = {
            'Content-Type': 'application/json'
          };

          // 非 Ollama 服务需要 API Key
          if (apiService !== 'ollama' && config.key) {
            headers['Authorization'] = `Bearer ${config.key}`;
          }

          // 发送请求
          GM_xmlhttpRequest({
            method: 'POST',
            url: endpoint,
            headers: headers,
            data: JSON.stringify(requestData),
            onload: this.handleResponse.bind(this, resolve, reject, apiService),
            onerror: (error) => reject(new Error('网络请求失败: ' + (error.message || '未知错误')))
          });
        });
      }

      handleResponse(resolve, reject, apiService, response) {
        try {
          // 检查响应是否为 HTML
          if (response.responseText.trim().startsWith('<')) {
            reject(new Error(`API返回了HTML而不是JSON (状态码: ${response.status})`));
            return;
          }

          // 检查状态码
          if (response.status >= 400) {
            try {
              const data = JSON.parse(response.responseText);
              reject(new Error(data.error?.message || `请求失败 (${response.status})`));
            } catch (e) {
              reject(new Error(`请求失败 (${response.status}): ${response.responseText.substring(0, 100)}`));
            }
            return;
          }

          // 解析响应数据
          const data = JSON.parse(response.responseText);

          // 检查错误
          if (data.error) {
            reject(new Error(data.error.message || '未知错误'));
            return;
          }

          // 根据不同的 API 服务提取内容
          if (apiService === 'ollama' && data.message) {
            // Ollama API 响应格式
            resolve(data.message.content);
          } else if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            // OpenAI 兼容的 API 响应格式
            resolve(data.choices[0].message.content);
          } else {
            // 未知的响应格式
            console.warn('未知的 API 响应格式:', data);

            // 尝试从响应中提取可能的内容
            if (data.content) {
              resolve(data.content);
            } else if (data.text) {
              resolve(data.text);
            } else if (data.result) {
              resolve(data.result);
            } else if (data.response) {
              resolve(data.response);
            } else if (data.output) {
              resolve(data.output);
            } else if (data.generated_text) {
              resolve(data.generated_text);
            } else {
              reject(new Error('API 返回格式异常，无法提取内容'));
            }
          }
        } catch (error) {
          reject(new Error(`解析API响应失败: ${error.message || '未知错误'}`));
        }
      }

      // 添加URL转换函数
      transformUrl(url) {
        // 检查是否启用了转发
        if (!this.configManager.getApiProxyEnabled() || !this.configManager.isFeatureEnabled('apiProxy')) {
          return url; // 如果未启用转发，直接返回原始URL
        }

        try {
          // 获取转发服务域名
          const proxyDomain = this.configManager.getApiProxyDomain();
          if (!proxyDomain) {
            return url; // 如果未设置转发域名，直接返回原始URL
          }

          // 解析原始URL
          const urlObj = new URL(url);
          const protocol = urlObj.protocol;
          const hostname = urlObj.hostname;
          const pathname = urlObj.pathname;
          const search = urlObj.search;

          // 根据规则转换URL
          let proxyUrl;
          if (protocol === 'https:') {
            // HTTPS转发
            proxyUrl = `${proxyDomain}/proxy/${hostname}${pathname}${search}`;
          } else if (protocol === 'http:') {
            // HTTP转发
            proxyUrl = `${proxyDomain}/httpproxy/${hostname}${pathname}${search}`;
          } else if (url.includes('api.')) {
            // API转发 - 针对包含api.的域名
            proxyUrl = `${proxyDomain}/api/${hostname}${pathname}${search}`;
          } else {
            return url; // 不符合转发规则，返回原始URL
          }

          console.log(`API转发: ${url} -> ${proxyUrl}`);
          return proxyUrl;
        } catch (error) {
          console.error('URL转换失败:', error);
          return url; // 出错时返回原始URL
        }
      }
    }

    // 主应用类
    class ArticleSummaryApp {
      constructor() {
        this.configManager = new ConfigManager();
        this.uiManager = new UIManager(this.configManager);
        this.articleExtractor = new ArticleExtractor(this.configManager);
        this.apiService = new APIService(this.configManager);
        this.elements = {}; // 初始化elements对象
        this.version = '0.2.3'; // 更新版本号 - 增加Markdown和预览视图切换功能
      }

      async init() {
        this.logScriptInfo();

        try {
          // 先尝试获取已有的元素，避免重复创建
          const existingApp = document.getElementById('article-summary-app');
          const existingIcon = document.getElementById('article-summary-icon');

          // 如果已经存在，则先移除
          if (existingApp) {
            existingApp.remove();
            console.log('已移除现有的应用元素');
          }

          if (existingIcon) {
            existingIcon.remove();
            console.log('已移除现有的图标元素');
          }

          // 初始化应用
          await this.uiManager.init();
          this.bindGenerateButton();

          console.log('应用初始化完成');
        } catch (error) {
          console.error('应用初始化失败:', error);
          // 尝试恢复或提示用户
          alert('文章总结助手初始化失败，请刷新页面重试。错误信息：' + error.message);
        }
      }

      logScriptInfo() {
        const styles = {
          title: 'font-size: 16px; font-weight: bold; color: #4CAF50;',
          subtitle: 'font-size: 14px; font-weight: bold; color: #2196F3;',
          normal: 'font-size: 12px; color: #333;',
          key: 'font-size: 12px; color: #E91E63;',
          value: 'font-size: 12px; color: #3F51B5;'
        };

        console.log('%c网页文章总结助手', styles.title);
        console.log('%c基本信息', styles.subtitle);
        console.log(`%c版本:%c ${this.version}`, styles.key, styles.value);
        console.log(`%c作者:%c h7ml <h7ml@qq.com>`, styles.key, styles.value);
        console.log(`%c描述:%c 自动总结网页文章内容，支持多种格式输出，适用于各类文章网站`, styles.key, styles.value);

        console.log('%c支持的API服务', styles.subtitle);
        console.log(`%c- Ollama:%c 本地大语言模型服务，无需API Key`, styles.key, styles.normal);
        console.log(`%c- GPT God:%c 支持多种OpenAI模型`, styles.key, styles.normal);
        console.log(`%c- DeepSeek:%c 支持DeepSeek系列模型`, styles.key, styles.normal);
        console.log(`%c- 自定义:%c 支持任何兼容OpenAI API格式的服务`, styles.key, styles.normal);

        console.log('%c支持的功能', styles.subtitle);
        console.log(`%c- 自动提取:%c 智能提取网页文章内容`, styles.key, styles.normal);
        console.log(`%c- 多种格式:%c 支持Markdown、要点列表、段落等输出格式`, styles.key, styles.normal);
        console.log(`%c- 动态获取:%c 自动获取Ollama本地已安装模型列表`, styles.key, styles.normal);
        console.log(`%c- 界面定制:%c 支持拖拽、最小化、最大化等操作`, styles.key, styles.normal);

        console.log('%c当前配置', styles.subtitle);
        const configs = this.configManager.getConfigs();
        const apiService = this.configManager.getApiService();
        const currentConfig = configs[apiService] || {};
        console.log(`%c当前API服务:%c ${apiService}`, styles.key, styles.value);
        console.log(`%c当前模型:%c ${currentConfig.model || '未设置'}`, styles.key, styles.value);
        console.log(`%c当前API地址:%c ${currentConfig.url || '未设置'}`, styles.key, styles.value);
        console.log(`%c输出格式:%c ${this.configManager.getOutputFormat()}`, styles.key, styles.value);

        console.log('%c使用提示', styles.subtitle);
        console.log(`%c- 点击右上角按钮可最小化或最大化界面`, styles.normal);
        console.log(`%c- 最小化后可通过右下角图标恢复界面`, styles.normal);
        console.log(`%c- 可拖动顶部标题栏移动位置`, styles.normal);
        console.log(`%c- 使用Ollama服务时会自动获取本地已安装模型`, styles.normal);
      }

      bindGenerateButton() {
        if (this.uiManager.elements.generateBtn) {
          this.uiManager.elements.generateBtn.addEventListener('click', this.handleGenerate.bind(this));
          console.log('生成按钮事件已绑定');
        } else {
          console.error('生成按钮元素不存在');
        }
      }

      async handleGenerate() {
        const apiService = this.uiManager.elements.apiService.value;
        const apiKey = this.uiManager.elements.apiKey.value.trim();
        const apiUrl = this.uiManager.elements.apiUrl.value.trim();

        // 获取当前配置
        const configs = this.configManager.getConfigs();
        const currentConfig = configs[apiService] || {
          url: apiService === 'ollama' ? 'http:/160.202.244.103:11434/api/chat' : '',
          model: apiService === 'ollama' ? 'deepseek-r1:7b' : '',
          key: ''
        };

        // 检查 API URL 是否有效
        if (!apiUrl) {
          alert('请输入有效的 API 地址');
          return;
        }

        // 检查 API Key（Ollama 不需要）
        if (apiService !== 'ollama' && !apiKey) {
          alert('请输入有效的 API Key');
          return;
        }

        // 检查模型是否有效
        const modelName = apiService === 'ollama' ?
          (this.uiManager.elements.modelSelect.value || 'llama2') :
          (this.uiManager.elements.modelName.value || '');

        if (!modelName) {
          alert('请选择或输入有效的模型名称');
          return;
        }

        this.showLoading();

        try {
          const content = await this.articleExtractor.extract();
          const summary = await this.apiService.generateSummary(content);
          this.displaySummary(summary);
        } catch (error) {
          this.handleError(error);
        } finally {
          this.hideLoading();
        }
      }

      showLoading() {
        this.uiManager.elements.loadingIndicator.style.display = 'block';
        this.uiManager.elements.generateBtn.disabled = true;
        this.uiManager.elements.generateBtn.innerHTML = `
      <svg class="icon spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25" stroke-dasharray="30" stroke-dashoffset="0"></circle>
        <circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="15"></circle>
      </svg>
      生成中...
    `;
      }

      hideLoading() {
        this.uiManager.elements.loadingIndicator.style.display = 'none';
        this.uiManager.elements.generateBtn.disabled = false;
        this.uiManager.elements.generateBtn.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
      生成总结
    `;
      }

      displaySummary(summary) {
        const outputFormat = this.configManager.getOutputFormat();
        const summaryContent = this.uiManager.elements.summaryContent;
        const summaryTextarea = this.uiManager.elements.summaryTextarea;
        const summaryPreview = this.uiManager.elements.summaryPreview;

        // 处理思考过程的逻辑
        let processedSummary = summary;
        const showThinking = this.configManager.isFeatureEnabled('showThinking');

        // 使用正则表达式找出所有<think>...</think>标签对
        if (!showThinking) {
          // 如果禁用显示思考过程，则移除所有<think>...</think>内容
          processedSummary = summary.replace(/<think>[\s\S]*?<\/think>/g, '');
        }

        // 设置markdown文本内容
        summaryTextarea.value = processedSummary;

        // 设置预览内容
        summaryPreview.innerHTML = this.simpleMarkdownRender(processedSummary);

        // 根据当前视图模式显示相应区域
        const activeViewBtn = document.querySelector('.view-btn.active');
        const viewMode = activeViewBtn ? activeViewBtn.dataset.view : 'markdown';
        this.uiManager.toggleViewMode(viewMode);

        this.uiManager.elements.summaryResult.style.display = 'flex';
      }

      handleError(error) {
        let errorMsg = error.message;
        if (errorMsg.includes('Authentication Fails') || errorMsg.includes('no such user')) {
          errorMsg = 'API Key 无效或已过期，请更新您的 API Key';
        } else if (errorMsg.includes('rate limit')) {
          errorMsg = 'API 调用次数已达上限，请稍后再试';
        }
        alert('生成总结失败：' + errorMsg);
        console.error('API 错误详情:', error);
      }

      simpleMarkdownRender(text) {
        let html = '<div class="summary-container">';

        // 预处理 - 替换连续的换行为单个换行
        let processedText = text.replace(/\n\s*\n/g, '\n\n');

        // 处理代码块 (必须在其他处理前进行)
        processedText = processedText.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

        // 按行处理文本
        const lines = processedText.split('\n');
        let inList = false;
        let listType = '';
        let listHtml = '';
        let inParagraph = false;
        let paragraphContent = '';

        const content = lines.map(line => {
          // 空行处理
          if (!line.trim()) {
            let result = '';
            // 如果在段落中，结束段落
            if (inParagraph) {
              result = `<p>${paragraphContent}</p>`;
              inParagraph = false;
              paragraphContent = '';
            }
            // 如果在列表中，结束列表
            if (inList) {
              result += listType === 'ol' ? `<ol>${listHtml}</ol>` : `<ul>${listHtml}</ul>`;
              inList = false;
              listHtml = '';
            }
            return result;
          }

          // 标题处理
          if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
          if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
          if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
          if (line.startsWith('#### ')) return `<h4>${line.substring(5)}</h4>`;

          // 有序列表
          const olMatch = line.match(/^\s*(\d+)\.\s+(.*)/);
          if (olMatch) {
            // 处理已存在的段落
            let result = '';
            if (inParagraph) {
              result = `<p>${paragraphContent}</p>`;
              inParagraph = false;
              paragraphContent = '';
            }

            // 如果不在列表中或列表类型不同，开始新列表
            if (!inList || listType !== 'ol') {
              // 结束之前的列表(如果有)
              if (inList) {
                result += listType === 'ol' ? `<ol>${listHtml}</ol>` : `<ul>${listHtml}</ul>`;
                listHtml = '';
              }
              inList = true;
              listType = 'ol';
            }

            // 添加列表项
            const itemContent = this.formatInlineMarkdown(olMatch[2]);
            listHtml += `<li>${itemContent}</li>`;
            return result; // 返回结果(可能为空)
          }

          // 无序列表
          const ulMatch = line.match(/^\s*[\-\*]\s+(.*)/);
          if (ulMatch) {
            // 处理已存在的段落
            let result = '';
            if (inParagraph) {
              result = `<p>${paragraphContent}</p>`;
              inParagraph = false;
              paragraphContent = '';
            }

            // 如果不在列表中或列表类型不同，开始新列表
            if (!inList || listType !== 'ul') {
              // 结束之前的列表(如果有)
              if (inList) {
                result += listType === 'ol' ? `<ol>${listHtml}</ol>` : `<ul>${listHtml}</ul>`;
                listHtml = '';
              }
              inList = true;
              listType = 'ul';
            }

            // 添加列表项
            const itemContent = this.formatInlineMarkdown(ulMatch[1]);
            listHtml += `<li>${itemContent}</li>`;
            return result; // 返回结果(可能为空)
          }

          // 引用块
          if (line.startsWith('> ')) {
            // 处理已存在的段落或列表
            let result = '';
            if (inParagraph) {
              result = `<p>${paragraphContent}</p>`;
              inParagraph = false;
              paragraphContent = '';
            }
            if (inList) {
              result += listType === 'ol' ? `<ol>${listHtml}</ol>` : `<ul>${listHtml}</ul>`;
              inList = false;
              listHtml = '';
            }

            const quoteContent = this.formatInlineMarkdown(line.substring(2));
            return `${result}<blockquote>${quoteContent}</blockquote>`;
          }

          // 水平线
          if (line.match(/^\s*[-*_]{3,}\s*$/)) {
            // 处理已存在的段落或列表
            let result = '';
            if (inParagraph) {
              result = `<p>${paragraphContent}</p>`;
              inParagraph = false;
              paragraphContent = '';
            }
            if (inList) {
              result += listType === 'ol' ? `<ol>${listHtml}</ol>` : `<ul>${listHtml}</ul>`;
              inList = false;
              listHtml = '';
            }

            return `${result}<hr>`;
          }

          // 普通段落
          if (!inList) {
            if (!inParagraph) {
              inParagraph = true;
              paragraphContent = this.formatInlineMarkdown(line);
            } else {
              paragraphContent += ' ' + this.formatInlineMarkdown(line);
            }
            return ''; // 段落内容稍后添加
          } else {
            return ''; // 在列表中，内容已添加到listHtml
          }
        }).filter(html => html).join('\n');

        // 处理最后的段落或列表
        let finalContent = content;
        if (inParagraph) {
          finalContent += `<p>${paragraphContent}</p>`;
        }
        if (inList) {
          finalContent += listType === 'ol' ? `<ol>${listHtml}</ol>` : `<ul>${listHtml}</ul>`;
        }

        html += finalContent + '</div>';
        return html;
      }

      // 处理行内Markdown
      formatInlineMarkdown(text) {
        return text
          // 加粗
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // 斜体
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          // 行内代码
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          // 链接
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
          // 图片
          .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
      }

      // 打开特性设置对话框
      openFeatureDialog(fromConfigButton = false) {
        if (this.elements.featureDialog) {
          // 如果是从设置按钮点击来的，则切换配置面板状态
          if (fromConfigButton) {
            this.toggleConfig(); // 切换配置面板的展开/收起状态
          } else if (this.elements.configPanel.classList.contains('collapsed')) {
            // 如果是从其他地方调用的且配置面板是收起的，则展开配置面板
            this.toggleConfig();
          }

          // 更新对话框中的复选框状态
          this.updateFeatureCheckboxes();

          // 显示对话框
          this.elements.featureDialog.style.display = 'flex';
        } else {
          console.error('功能设置对话框元素不存在');
        }
      }

      // 关闭特性设置对话框
      closeFeatureDialog() {
        if (this.elements.featureDialog) {
          this.elements.featureDialog.style.display = 'none';
        }
      }

      // 保存特性设置
      saveFeatureSettings() {
        const newStates = {};

        // 从对话框中获取状态
        if (this.elements.dialogFeatureCheckboxes) {
          Object.keys(this.elements.dialogFeatureCheckboxes).forEach(key => {
            const checkbox = this.elements.dialogFeatureCheckboxes[key];
            if (checkbox) {
              newStates[key] = checkbox.checked;
            }
          });
        }

        // 保存到配置
        this.configManager.setFeatureStates(newStates);

        // 应用新状态到UI
        this.applyFeatureStates();

        // 关闭对话框
        this.closeFeatureDialog();
      }

      // 处理特性开关变更
      handleFeatureToggle(event) {
        const featureId = event.target.id.replace('feature_', '');
        const isEnabled = event.target.checked;

        const newStates = {};
        newStates[featureId] = isEnabled;

        // 保存到配置
        this.configManager.setFeatureStates(newStates);

        // 应用新状态到UI
        this.applyFeatureStates();
      }
    }

    // 初始化应用
    const app = new ArticleSummaryApp();
    app.init();
    console.log('总结助手已加载完成，当前版本：' + app.version);
  }

  // 添加视图切换按钮的样式
  GM_addStyle(`
  /* 视图切换按钮样式 */
  #viewOptions {
    display: flex;
    margin-right: 8px;
  }
  
  .view-btn {
    padding: 2px 8px;
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f5f5f5;
    margin-right: 4px;
    user-select: none;
  }
  
  .view-btn.active {
    background-color: #007bff;
    color: #fff;
  }
  
  #summaryPreview {
    padding: 10px;
    overflow-y: auto;
    line-height: 1.5;
    display: none;
    height: 100%;
  }
  
  #summaryActions {
    display: flex;
    align-items: center;
  }
  
  .form-tip {
    display: block;
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }
  
  .form-tip a {
    color: #007bff;
    text-decoration: none;
  }
  
  .form-tip a:hover {
    text-decoration: underline;
  }
  
  /* Markdown预览样式 */
  .summary-container {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #333;
    line-height: 1.6;
  }
  
  .summary-container h1, 
  .summary-container h2, 
  .summary-container h3, 
  .summary-container h4 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.25;
  }
  
  .summary-container h1 {
    font-size: 1.8em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  
  .summary-container h2 {
    font-size: 1.5em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  
  .summary-container h3 {
    font-size: 1.25em;
  }
  
  .summary-container h4 {
    font-size: 1em;
  }
  
  .summary-container p {
    margin-top: 0;
    margin-bottom: 1em;
  }
  
  .summary-container ul, 
  .summary-container ol {
    padding-left: 2em;
    margin-top: 0;
    margin-bottom: 1em;
  }
  
  .summary-container li {
    margin-bottom: 0.25em;
  }
  
  .summary-container ul li {
    list-style: disc;
  }
  
  .summary-container ol li {
    list-style: decimal;
  }
  
  .summary-container blockquote {
    padding: 0 1em;
    margin-left: 0;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }
  
  .summary-container code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27,31,35,0.05);
    border-radius: 3px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  }
  
  .summary-container pre {
    padding: 16px;
    overflow: auto;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
  }
  
  .summary-container pre > code {
    padding: 0;
    margin: 0;
    font-size: 85%;
    background-color: transparent;
    border-radius: 0;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    white-space: pre;
    display: block;
  }
  
  .summary-container img {
    max-width: 100%;
    box-sizing: content-box;
  }
  
  .summary-container hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: #e1e4e8;
    border: 0;
  }
  
  .summary-container a {
    color: #0366d6;
    text-decoration: none;
  }
  
  .summary-container a:hover {
    text-decoration: underline;
  }
  `);
})();
