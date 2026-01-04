// ==UserScript==

// @name         流放之路2集市AI助手插件
// @namespace    http://tampermonkey.net/
// @version      2025-07-25
// @description  POE2 trade data processor with clipboard and shared data support, and Coze.cn support
// @author       三鲜大饺子滋滋滋
// @match        https://www.pathofexile.com/*
// @match        https://www.coze.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @license           AGPL License
// @downloadURL https://update.greasyfork.org/scripts/543130/%E6%B5%81%E6%94%BE%E4%B9%8B%E8%B7%AF2%E9%9B%86%E5%B8%82AI%E5%8A%A9%E6%89%8B%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/543130/%E6%B5%81%E6%94%BE%E4%B9%8B%E8%B7%AF2%E9%9B%86%E5%B8%82AI%E5%8A%A9%E6%89%8B%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ========================================
  // 配置常量 (Configuration Constants)
  // ========================================

  const CONFIG = {
    API_BASE_URL: 'https://www.pathofexile.com/api/trade2/search',
    TRADE_BASE_URL: 'https://www.pathofexile.com/trade2/search/poe2',
    REQUEST_TIMEOUT: 10000, // 10秒超时
    CHECK_INTERVAL: 500,    // 检查间隔500ms
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    // 数据前缀常量
    CLIPBOARD_DATA_PREFIX: 'POE2AITRADEQPOS0_',
    SHARED_DATA_PREFIX: 'POE2AITRADEQPOS1_',
    STORAGE_KEY: 'poe2_trade_data',
    PROCESSED_MESSAGE: '已处理'
  };

  // ========================================
  // 全局状态管理 (Global State Management)
  // ========================================

  const AppState = {
    checkInterval: null,
    isCozeWebsite: false,
    isPathOfExileWebsite: false,

    /**
     * 初始化应用状态
     */
    init() {
      this.isCozeWebsite = window.location.hostname.includes('coze.cn');
      this.isPathOfExileWebsite = window.location.hostname.includes('pathofexile.com');
      Logger.info(`当前域名: ${window.location.hostname}`);
    },

    /**
     * 清理定时器
     */
    clearInterval() {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }
    }
  };

  // ========================================
  // 日志工具 (Logging Utilities)
  // ========================================

  const Logger = {
    /**
     * 输出信息日志
     * @param {string} message - 日志消息
     * @param {any} data - 可选的数据对象
     */
    info(message, data = null) {
      console.log(`[POE2 Trade Helper] ${message}`, data || '');
    },

    /**
     * 输出警告日志
     * @param {string} message - 警告消息
     * @param {Error} error - 可选的错误对象
     */
    warn(message, error = null) {
      console.warn(`[POE2 Trade Helper] ${message}`, error || '');
    },

    /**
     * 输出错误日志
     * @param {string} message - 错误消息
     * @param {Error} error - 错误对象
     */
    error(message, error = null) {
      console.error(`[POE2 Trade Helper] ${message}`, error || '');
    }
  };

  // ========================================
  // 数据处理工具 (Data Processing Utilities)
  // ========================================

  const DataProcessor = {
    /**
     * 解析JSON数据
     * @param {string} jsonString - JSON字符串
     * @returns {Object|null} 解析后的对象或null
     */
    parseJSON(jsonString) {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        Logger.error('JSON解析失败', error);
        return null;
      }
    },

    /**
     * 验证数据前缀
     * @param {string} data - 数据字符串
     * @param {string} prefix - 前缀
     * @returns {boolean} 是否匹配前缀
     */
    hasPrefix(data, prefix) {
      return data && data.trim().startsWith(prefix);
    },

    /**
     * 提取前缀后的数据
     * @param {string} data - 完整数据
     * @param {string} prefix - 前缀
     * @returns {string} 提取的数据
     */
    extractData(data, prefix) {
      return data.substring(prefix.length);
    },

    /**
     * 转换数据前缀
     * @param {string} data - 原始数据
     * @param {string} fromPrefix - 源前缀
     * @param {string} toPrefix - 目标前缀
     * @returns {string} 转换后的数据
     */
    convertPrefix(data, fromPrefix, toPrefix) {
      return data.replace(fromPrefix, toPrefix);
    }
  };

  // ========================================
  // API交互模块 (API Interaction Module)
  // ========================================

  const TradeAPI = {
    /**
     * 执行交易搜索
     * @param {Object} queryInfo - 查询信息
     * @returns {Promise<Object>} 搜索结果
     */
    async executeTradeSearch(queryInfo) {
      try {
        Logger.info('开始执行交易搜索', queryInfo);

        const { server_name: serverName, trade_req: tradeReq } = queryInfo;

        if (!serverName || !tradeReq) {
          throw new Error('缺少必要的查询参数: server_name 或 trade_req');
        }

        const requestBody = this._prepareRequestBody(tradeReq);
        const response = await this._sendAPIRequest(serverName, requestBody);
        const result = await this._processAPIResponse(response, serverName);

        Logger.info('交易搜索完成', result);
        return result;

      } catch (error) {
        Logger.error('交易搜索失败', error);
        throw error;
      }
    },

    /**
     * 准备请求体
     * @param {any} tradeReq - 交易请求数据
     * @returns {Object} 格式化的请求体
     */
    _prepareRequestBody(tradeReq) {
      try {
        return tradeReq;
      } catch {
        // 如果解析失败，创建基本搜索结构
        return {
          query: {
            status: { option: "online" },
            name: tradeReq,
            type: "",
            stats: [{ type: "and", filters: [] }]
          },
          sort: { price: "asc" }
        };
      }
    },

    /**
     * 发送API请求
     * @param {string} serverName - 服务器名称
     * @param {Object} requestBody - 请求体
     * @returns {Promise<Response>} API响应
     */
    async _sendAPIRequest(serverName, requestBody) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

      try {
        const apiUrl = `${CONFIG.API_BASE_URL}/${serverName}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': CONFIG.USER_AGENT,
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        return response;

      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error(`请求超时 (${CONFIG.REQUEST_TIMEOUT / 1000}秒)`);
        }
        throw fetchError;
      }
    },

    /**
     * 处理API响应
     * @param {Response} response - API响应
     * @param {string} serverName - 服务器名称
     * @returns {Promise<Object>} 处理结果
     */
    async _processAPIResponse(response, serverName) {
      if (!response.ok) {
        const errorText = await response.text().catch(() => '未知错误');
        throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();

      if (!data || typeof data !== 'object' || !data.id) {
        throw new Error('API响应格式无效或缺少必要字段');
      }

      const tradeUrl = `${CONFIG.TRADE_BASE_URL}/${serverName}/${data.id}`;
      this._openTradeURL(tradeUrl);

      return {
        id: data.id,
        url: tradeUrl,
        timestamp: new Date().toISOString()
      };
    },

    /**
     * 打开交易URL
     * @param {string} tradeUrl - 交易URL
     */
    _openTradeURL(tradeUrl) {
      const currentUrl = window.location.href;

      if (currentUrl.includes('pathofexile.com/trade2/')) {
        window.location.href = tradeUrl;
      } else {
        window.open(tradeUrl, '_blank');
      }

      Logger.info('已打开交易URL', tradeUrl);
    }
  };

  // ========================================
  // Coze DOM监控模块 (Coze DOM Monitoring Module)
  // ========================================

  const CozeDOMMonitor = {
    /**
     * 检查DOM元素内容变化
     */
    checkChanges() {
      try {
        const targetDiv = document.getElementById('Div17');
        if (!targetDiv) {
          Logger.info('CozeDOMMonitor: checkChanges - 未找到ID为 Div17 的元素');
          return; // Div not found, do nothing
        }

        // 获取所有符合条件的textDiv元素
        const textDivs = targetDiv.querySelectorAll('.ui-builder-text > div');
        if (!textDivs || textDivs.length === 0) {
          Logger.info('CozeDOMMonitor: checkChanges - 在 Div2 内未找到 .ui-builder-text > div 元素');
          return; // Text divs not found
        }

        const prefix = 'POE2AITRADEQPOS0_';
        const suffix = '_POE2AITRADEQPOS0';
        let processedCount = 0;

        // 按顺序处理每个textDiv元素
        textDivs.forEach((textDiv, index) => {
          try {
            const rawData = textDiv.textContent;

            const hasPrefix = rawData && rawData.startsWith(prefix);
            const hasSuffix = rawData && rawData.endsWith(suffix);
            const isNotProcessed = rawData && !rawData.startsWith('finish.');

            // Check for prefix/suffix and that it hasn't been processed yet
            if (hasPrefix && hasSuffix && isNotProcessed) {
              Logger.info(`检测到第${index + 1}个Coze DOM数据，准备处理`, rawData.substring(0, 80) + '...');

              // Mark as processed immediately to avoid loops
              textDiv.textContent = 'finish.' + rawData;
              Logger.info(`已更新第${index + 1}个DOM元素内容，防止重复处理`);

              // Extract the core data
              const data = rawData.substring(prefix.length, rawData.length - suffix.length);

              // Prepend the original prefix for processData function
              const fullData = CONFIG.CLIPBOARD_DATA_PREFIX + data;

              this.processData(fullData);
              processedCount++;
            }
          } catch (error) {
            Logger.warn(`处理第${index + 1}个textDiv时出错`, error);
          }
        });

        if (processedCount > 0) {
          Logger.info(`本次检查共处理了${processedCount}个DOM元素`);
        }
      } catch (error) {
        Logger.warn('检查Coze DOM失败', error);
      }
    },

    /**
     * 处理数据
     * @param {string} data - The full data string with prefix
     */
    processData(data) {
      Logger.info('开始处理Coze DOM数据');

      const jsonData = DataProcessor.extractData(data, CONFIG.CLIPBOARD_DATA_PREFIX);
      const parsedData = DataProcessor.parseJSON(jsonData);

      if (!parsedData) {
        Logger.error('Coze DOM数据JSON解析失败');
        return;
      }

      const { server_name: serverName } = parsedData;

      if (!serverName) {
        Logger.warn('Coze DOM数据中未找到server_name');
        return;
      }

      Logger.info('提取的服务器名称', serverName);

      // 转换数据前缀并保存到共享存储
      const convertedData = DataProcessor.convertPrefix(
        data,
        CONFIG.CLIPBOARD_DATA_PREFIX,
        CONFIG.SHARED_DATA_PREFIX
      );

      SharedDataManager.save(convertedData);

      // 打开交易页面
      this._openTradePage(serverName);
    },

    /**
     * 打开交易页面
     * @param {string} serverName - 服务器名称
     */
    _openTradePage(serverName) {
      const tradeUrl = `${CONFIG.TRADE_BASE_URL}/${encodeURIComponent(serverName)}`;
      Logger.info('打开POE2交易页面', tradeUrl);
      GM_openInTab(tradeUrl, { active: true });
    }
  };

  // ========================================
  // 共享数据管理模块 (Shared Data Management Module)
  // ========================================

  const SharedDataManager = {
    /**
     * 保存数据到共享存储
     * @param {string} data - 要保存的数据
     */
    save(data) {
      try {
        GM_setValue(CONFIG.STORAGE_KEY, data);
        Logger.info('共享数据保存成功');
      } catch (error) {
        Logger.error('共享数据保存失败', error);
      }
    },

    /**
     * 从共享存储读取数据
     * @returns {string} 共享数据
     */
    load() {
      try {
        return GM_getValue(CONFIG.STORAGE_KEY, '');
      } catch (error) {
        Logger.error('共享数据读取失败', error);
        return '';
      }
    },

    /**
     * 清除共享数据
     */
    clear() {
      try {
        GM_setValue(CONFIG.STORAGE_KEY, 'handle_finish');
        Logger.info('共享数据已清除');
      } catch (error) {
        Logger.error('共享数据清除失败', error);
      }
    },

    /**
     * 检查共享数据变化
     */
    checkChanges() {
      try {
        const sharedData = this.load();
        Logger.info('当前共享数据', sharedData);

        if (sharedData && sharedData.trim() !== '') {
          const trimmedData = sharedData.trim();

          if (DataProcessor.hasPrefix(trimmedData, CONFIG.SHARED_DATA_PREFIX)) {
            Logger.info('检测到共享数据', trimmedData.substring(0, 50) + '...');
            this.processData(trimmedData);
          }
        }
      } catch (error) {
        Logger.error('共享数据检查失败', error);
      }
    },

    /**
     * 处理共享数据
     * @param {string} data - 共享数据
     */
    async processData(data) {
      Logger.info('开始处理共享数据');

      const jsonData = DataProcessor.extractData(data, CONFIG.SHARED_DATA_PREFIX);
      const parsedData = DataProcessor.parseJSON(jsonData);

      if (!parsedData) {
        Logger.error('共享数据JSON解析失败');
        return;
      }

      try {
        await TradeAPI.executeTradeSearch(parsedData);
        this.clear();
      } catch (error) {
        Logger.error('交易搜索执行失败', error);
      }
    }
  };

  // ========================================
  // 应用监控管理模块 (Application Monitoring Manager)
  // ========================================

  const MonitoringManager = {
    /**
     * 启动监控
     */
    start() {
      Logger.info('开始启动监控服务');

      // 清理现有定时器
      AppState.clearInterval();

      // 初始化应用状态
      AppState.init();

      // 根据域名启动相应的监控
      if (AppState.isCozeWebsite) {
        this._startCozeDOMMonitoring();
      } else if (AppState.isPathOfExileWebsite) {
        this._startSharedDataMonitoring();
      } else {
        Logger.warn('当前域名不支持监控功能');
      }
    },

    /**
     * 停止监控
     */
    stop() {
      AppState.clearInterval();
      Logger.info('监控服务已停止');
    },

    /**
     * 启动Coze DOM监控 (仅在coze.cn)
     */
    _startCozeDOMMonitoring() {
      Logger.info('启动Coze DOM监控服务 (coze.cn)');

      AppState.checkInterval = setInterval(() => {
        CozeDOMMonitor.checkChanges();
      }, CONFIG.CHECK_INTERVAL);
    },

    /**
     * 启动共享数据监控 (仅在pathofexile.com)
     */
    _startSharedDataMonitoring() {
      Logger.info('准备启动共享数据监控服务 (pathofexile.com)');

      if (document.readyState === 'complete') {
        Logger.info('DOM已完全加载，立即执行共享数据检查');
        SharedDataManager.checkChanges();
      } else {
        Logger.info('等待DOM完全加载...');
        window.addEventListener('load', () => {
          Logger.info('DOM加载完成，执行共享数据检查');
          SharedDataManager.checkChanges();
        });
      }
    }
  };

  // ========================================
  // 应用初始化 (Application Initialization)
  // ========================================

  /**
   * 应用程序入口点
   */
  function initializeApp() {
    Logger.info('POE2 Trade Helper 正在初始化...');

    try {
      // 注册事件监听器
      window.addEventListener('beforeunload', () => {
        MonitoringManager.stop();
      });

      // 启动监控服务
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          MonitoringManager.start();
        });
      } else {
        MonitoringManager.start();
      }

      Logger.info('POE2 Trade Helper 初始化完成');

    } catch (error) {
      Logger.error('应用初始化失败', error);
    }
  }

  // ========================================
  // 启动应用 (Start Application)
  // ========================================

  // 立即执行应用初始化
  initializeApp();

})();