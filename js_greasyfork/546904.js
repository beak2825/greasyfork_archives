// ==UserScript==
// @name         微软Rewards自动搜索脚本-重构版
// @namespace    https://tampermonkey.net/
// @version      2.2.0
// @description  微软Rewards自动搜索脚本重构版：模块化架构，智能自适应间隔，支持30/40次搜索，多源热搜词，现代化UI设计
// @author       lutiancheng
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @run-at       document-idle
// @noframes     true
// @connect      top.baidu.com
// @connect      weibo.com
// @connect      www.toutiao.com
// @connect      aweme.snssdk.com
// @connect      api.gmya.net
// @connect      www.bing.com
// @icon         https://www.bing.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/eruda@3.0.1/eruda.min.js
// @license      MIT
// @homepage    https://github.com/Lutiancheng1/Traveling-monkey/
// @supportURL   https://github.com/Lutiancheng1/Traveling-monkey/issues
// @ts-nocheck
// @downloadURL https://update.greasyfork.org/scripts/546904/%E5%BE%AE%E8%BD%AFRewards%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E8%84%9A%E6%9C%AC-%E9%87%8D%E6%9E%84%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/546904/%E5%BE%AE%E8%BD%AFRewards%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E8%84%9A%E6%9C%AC-%E9%87%8D%E6%9E%84%E7%89%88.meta.js
// ==/UserScript==

/**
 * 微软Rewards自动搜索脚本-重构版 v2.2.0
 * 
 * 🚀 功能特性：
 * • 智能自适应搜索间隔（1-120秒可调）
 * • 支持30/40次搜索目标选择
 * • 多源热搜词获取（百度、微博、头条、抖音）
 * • 现代化Liquid Glass风格UI
 * • 完整的缓存管理系统
 * • 移动端调试控制台支持
 * • 模块化架构设计
 * 
 * 🎯 适用平台：
 * • 必应搜索 (bing.com)
 * • 必应中国 (cn.bing.com)
 * 
 * 📱 兼容性：
 * • 桌面端浏览器
 * • 移动端浏览器
 * • 支持所有主流油猴插件
 * 
 * 🔧 技术架构：
 * • ES6+ 模块化设计
 * • 异步编程模式
 * • 响应式UI组件
 * • 智能错误处理
 * 
 * 📄 开源协议：MIT License
 * 🏠 项目主页：https://github.com/Lutiancheng1/Traveling-monkey
 * 🐛 问题反馈：https://github.com/Lutiancheng1/Traveling-monkey/issues
 * 
 * @version 2.2.0
 * @author lutiancheng
 * @since 2024
 * 
 * 重构特性：
 * - 模块化架构设计
 * - 支持启动时选择30次或40次搜索
 * - 优化热搜词获取为40个（4个数据源各10个）
 * - 移除暂停启动模式
 * - 保持45秒固定搜索间隔
 * - 保持每日进度缓存机制
 * - 全新Liquid Glass风格UI界面
 * - 优化按钮交互和视觉效果
 * 
 * @version 2.1.0
 * @since 2025-04-22
 */

(function () {
  'use strict';

  // Tampermonkey API 类型声明
  /* global GM_addStyle, GM_getValue, GM_setValue, GM_registerMenuCommand, GM_xmlhttpRequest, unsafeWindow */

  // 类型声明 - 扩展Window接口和其他类型定义
  /**
   * @typedef {Object} Window
   * @property {Object|null} rewardsExecutor - 搜索执行器实例
   * @property {Object|null} uiManager - UI管理器实例
   */

  /**
   * @typedef {Object} PromiseSettledResult
   * @property {string} status - 'fulfilled' 或 'rejected'
   * @property {any} [value] - 如果状态为fulfilled，则为解决值
   * @property {any} [reason] - 如果状态为rejected，则为拒绝原因
   */

  /**
   * @typedef {Object} UIManager
   * @property {Function} showNotification - 显示通知
   * @property {Function} showSearchWordsDialog - 显示搜索词对话框
   */

  // 扩展 Window 接口
  if (typeof window !== 'undefined') {
    window.rewardsExecutor = null;
    window.uiManager = null;
  }

  // ============================================================================
  // 配置管理模块 (ConfigManager)
  // ============================================================================

  /**
   * 应用配置常量
   * @namespace CONFIG
   */
  const CONFIG = {
    // 搜索配置
    SEARCH: {
      INTERVAL: 45000,           // 默认搜索间隔45秒
      MIN_INTERVAL: 1000,        // 最小间隔1秒（允许用户自定义）
      MAX_INTERVAL: 120000,      // 最大间隔120秒（允许用户自定义）
      DEFAULT_COUNT: 30,         // 默认搜索次数
      MAX_COUNT: 40,            // 最大搜索次数
      RANDOM_SUFFIX_LENGTH: 6,   // 随机后缀长度
    },

    // 自适应间隔配置
    ADAPTIVE_INTERVAL: {
      ENABLED: true,             // 是否启用自适应间隔
      MIN_INTERVAL: 1000,        // 最小间隔1秒（允许用户自定义）
      MAX_INTERVAL: 120000,      // 最大间隔120秒（允许用户自定义）
      BASE_INTERVAL: 45000,      // 基础间隔45秒
      VARIANCE: 0.3,             // 随机变化30%
      NETWORK_TIMEOUT: 3000,     // 网络延迟检测超时
    },

    // 热搜词配置
    HOT_WORDS: {
      TARGET_COUNT: 40,          // 目标热搜词数量（调整为4个数据源各10个）
      PER_SOURCE_COUNT: 10,      // 每个数据源获取数量
      REQUEST_TIMEOUT: 5000,     // 请求超时时间
      FALLBACK_WORDS: [          // 降级词汇
        '科技新闻', '娱乐资讯', '体育赛事', '财经动态', '健康养生',
        '美食推荐', '旅游攻略', '教育培训', '汽车资讯', '房产信息',
        '时尚潮流', '游戏攻略', '电影评论', '音乐推荐', '书籍阅读',
        '数码产品', '生活技巧', '职场发展', '投资理财', '创业故事',
        '人工智能', '区块链', '新能源', '环保科技', '医疗健康',
        '在线教育', '电商购物', '短视频', '直播带货', '元宇宙',
        '智能家居', '新零售', '共享经济', '移动支付', '云计算',
        '大数据', '物联网', '5G技术', '自动驾驶', '虚拟现实'
      ]
    },

    // 存储配置
    STORAGE: {
      TODAY_COUNT_KEY: 'bing_search_count_',
      HOT_WORDS_KEY: 'bing_hot_words',
      CACHE_DURATION: 24 * 60 * 60 * 1000, // 24小时缓存
    },

    // API配置
    API: {
      BAIDU_HOT: 'https://top.baidu.com/api/board?platform=wise&tab=realtime',
      TOUTIAO_HOT: 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc',
      DOUYIN_HOT: 'https://aweme.snssdk.com/aweme/v1/hot/search/list/',
      WEIBO_HOT: 'https://api.gmya.net/Api/WeiBoHot'
    },

    // UI配置
    UI: {
      NOTIFICATION_DURATION: 3000,  // 通知显示时长
      MODAL_Z_INDEX: 10000,        // 模态框层级
      // 注意：动画时长现在使用CSS变量 --liquid-animation-duration
    }
  };

  /**
   * 配置验证器
   * @class ConfigValidator
   */
  class ConfigValidator {
    /**
     * 验证搜索次数是否有效
     * @param {number} count - 搜索次数
     * @returns {boolean} 是否有效
     */
    static isValidSearchCount(count) {
      return Number.isInteger(count) && count > 0 && count <= CONFIG.SEARCH.MAX_COUNT;
    }

    /**
     * 验证热搜词数组是否有效
     * @param {Array} words - 热搜词数组
     * @returns {boolean} 是否有效
     */
    static isValidHotWords(words) {
      return Array.isArray(words) && words.length > 0 && words.every(word => typeof word === 'string' && word.trim().length > 0);
    }
  }

  // ============================================================================
  // 存储管理模块 (StorageManager)
  // ============================================================================

  /**
   * 存储管理器
   * @class StorageManager
   */
  class StorageManager {
    /**
     * 获取今日搜索计数键
     * @returns {string} 存储键
     */
    static getTodayKey() {
      const today = new Date();
      return CONFIG.STORAGE.TODAY_COUNT_KEY + today.getFullYear() + '_' + (today.getMonth() + 1) + '_' + today.getDate();
    }

    /**
     * 获取今日搜索次数
     * @returns {number} 搜索次数
     */
    static getTodayCount() {
      try {
        const count = GM_getValue(this.getTodayKey(), 0);
        return Number.isInteger(count) ? count : 0;
      } catch (error) {
        console.error('[StorageManager] 获取今日计数失败:', error);
        return 0;
      }
    }

    /**
     * 保存今日搜索次数
     * @param {number} count - 搜索次数
     */
    static saveTodayCount(count) {
      try {
        if (ConfigValidator.isValidSearchCount(count)) {
          GM_setValue(this.getTodayKey(), count);
          this.cleanOldData();
        }
      } catch (error) {
        console.error('[StorageManager] 保存今日计数失败:', error);
      }
    }

    /**
     * 清除今日进度
     */
    static clearTodayProgress() {
      try {
        GM_setValue(this.getTodayKey(), 0);
        console.log('[StorageManager] 今日进度已清除');
      } catch (error) {
        console.error('[StorageManager] 清除今日进度失败:', error);
      }
    }

    /**
     * 获取缓存的热搜词
     * @returns {Array|null} 热搜词数组或null
     */
    static getCachedHotWords() {
      try {
        const cached = GM_getValue(CONFIG.STORAGE.HOT_WORDS_KEY, null);
        if (!cached) return null;

        const data = JSON.parse(cached);
        const now = Date.now();

        if (now - data.timestamp > CONFIG.STORAGE.CACHE_DURATION) {
          return null; // 缓存过期
        }

        return ConfigValidator.isValidHotWords(data.words) ? data.words : null;
      } catch (error) {
        console.error('[StorageManager] 获取缓存热搜词失败:', error);
        return null;
      }
    }

    /**
     * 缓存热搜词
     * @param {Array} words - 热搜词数组
     */
    static cacheHotWords(words) {
      try {
        if (ConfigValidator.isValidHotWords(words)) {
          const data = {
            words: words,
            timestamp: Date.now()
          };
          GM_setValue(CONFIG.STORAGE.HOT_WORDS_KEY, JSON.stringify(data));
        }
      } catch (error) {
        console.error('[StorageManager] 缓存热搜词失败:', error);
      }
    }

    /**
     * 通用获取存储值方法
     * @param {string} key - 存储键
     * @param {*} defaultValue - 默认值
     * @returns {*} 存储的值或默认值
     */
    static getValue(key, defaultValue = null) {
      try {
        return GM_getValue(key, defaultValue);
      } catch (error) {
        console.error(`[StorageManager] 获取存储值失败 ${key}:`, error);
        return defaultValue;
      }
    }

    /**
     * 通用设置存储值方法
     * @param {string} key - 存储键
     * @param {*} value - 存储值
     */
    static setValue(key, value) {
      try {
        GM_setValue(key, value);
      } catch (error) {
        console.error(`[StorageManager] 设置存储值失败 ${key}:`, error);
        throw error;
      }
    }

    /**
     * 清理过期数据
     */
    static cleanOldData() {
      try {
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const yesterdayKey = CONFIG.STORAGE.TODAY_COUNT_KEY + yesterday.getFullYear() + '_' + (yesterday.getMonth() + 1) + '_' + yesterday.getDate();

        // 清理昨天的数据
        if (GM_getValue(yesterdayKey, null) !== null) {
          GM_setValue(yesterdayKey, undefined);
        }
      } catch (error) {
        console.error('[StorageManager] 清理过期数据失败:', error);
      }
    }
  }

  // ============================================================================
  // 工具函数模块 (Utils)
  // ============================================================================

  /**
   * 工具函数集合
   * @namespace Utils
   */
  const Utils = {
    /**
     * 生成指定长度的随机字符串
     * @param {number} length - 字符串长度
     * @returns {string} 随机字符串
     */
    generateRandomString(length = CONFIG.SEARCH.RANDOM_SUFFIX_LENGTH) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    /**
     * 获取今日日期字符串
     * @returns {string} 日期字符串 YYYY-MM-DD
     */
    getTodayString() {
      const today = new Date();
      return today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
    },

    /**
     * 延迟执行
     * @param {number} ms - 延迟毫秒数
     * @returns {Promise} Promise对象
     */
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * 休眠函数（别名）
     * @param {number} ms - 延迟毫秒数
     * @returns {Promise} Promise对象
     */
    sleep(ms) {
      return this.delay(ms);
    },

    /**
     * 生成指定范围内的随机整数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 随机整数
     */
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 安全的JSON解析
     * @param {string} jsonString - JSON字符串
     * @param {*} defaultValue - 默认值
     * @returns {*} 解析结果或默认值
     */
    safeJsonParse(jsonString, defaultValue = null) {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.warn('[Utils] JSON解析失败:', error);
        return defaultValue;
      }
    },

    /**
     * 数组去重
     * @param {Array} array - 原数组
     * @returns {Array} 去重后的数组
     */
    uniqueArray(array) {
      return [...new Set(array)];
    },

    /**
     * 随机打乱数组
     * @param {Array} array - 原数组
     * @returns {Array} 打乱后的数组
     */
    shuffleArray(array) {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }
  };

  // ============================================================================
  // 自适应搜索间隔模块 (AdaptiveSearchInterval)
  // ============================================================================

  /**
   * 自适应搜索间隔管理器
   * 根据网络延迟和搜索成功率动态调整搜索间隔
   * @class AdaptiveSearchInterval
   */
  class AdaptiveSearchInterval {
    /**
     * 构造函数
     */
    constructor() {
      this.config = CONFIG.ADAPTIVE_INTERVAL;
      this.networkLatency = 0;
      this.searchSuccessRate = 1.0;
      this.recentSearchTimes = [];
      this.maxHistorySize = 10;
      this.lastInterval = this.config.BASE_INTERVAL;
    }

    /**
     * 计算下一次搜索的间隔时间
     * @returns {number} 间隔时间（毫秒）
     */
    calculateNextInterval() {
      if (!this.config.ENABLED) {
        return CONFIG.SEARCH.INTERVAL;
      }

      // 基础间隔
      let interval = this.config.BASE_INTERVAL;

      // 根据网络延迟调整
      const latencyFactor = this.calculateLatencyFactor();
      interval *= latencyFactor;

      // 根据搜索成功率调整
      const successFactor = this.calculateSuccessFactor();
      interval *= successFactor;

      // 添加随机变化
      const variance = this.config.VARIANCE;
      const randomFactor = 1 + (Math.random() - 0.5) * 2 * variance;
      interval *= randomFactor;

      // 限制在最小和最大间隔之间
      interval = Math.max(this.config.MIN_INTERVAL, Math.min(this.config.MAX_INTERVAL, interval));

      this.lastInterval = Math.round(interval);
      console.log(`[AdaptiveSearchInterval] 计算间隔: ${this.lastInterval}ms (延迟因子: ${latencyFactor.toFixed(2)}, 成功因子: ${successFactor.toFixed(2)})`);

      return this.lastInterval;
    }

    /**
     * 计算网络延迟因子
     * @returns {number} 延迟因子 (0.8-1.5)
     * @private
     */
    calculateLatencyFactor() {
      if (this.networkLatency <= 100) {
        return 0.8; // 网络良好，缩短间隔
      } else if (this.networkLatency <= 300) {
        return 1.0; // 网络正常，保持基础间隔
      } else if (this.networkLatency <= 1000) {
        return 1.2; // 网络较慢，适当延长
      } else {
        return 1.5; // 网络很慢，显著延长
      }
    }

    /**
     * 计算搜索成功率因子
     * @returns {number} 成功率因子 (0.9-1.3)
     * @private
     */
    calculateSuccessFactor() {
      if (this.searchSuccessRate >= 0.9) {
        return 0.9; // 成功率高，可以缩短间隔
      } else if (this.searchSuccessRate >= 0.7) {
        return 1.0; // 成功率正常，保持基础间隔
      } else if (this.searchSuccessRate >= 0.5) {
        return 1.2; // 成功率较低，延长间隔
      } else {
        return 1.3; // 成功率很低，显著延长间隔
      }
    }

    /**
     * 检测网络延迟
     * @returns {Promise<number>} 延迟时间（毫秒）
     */
    async detectNetworkLatency() {
      const startTime = Date.now();

      try {
        // 创建AbortController用于超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.NETWORK_TIMEOUT);

        // 使用简单的网络请求测试延迟
        const response = await fetch('https://httpbin.org/get', {
          method: 'GET',
          cache: 'no-cache',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // 只要请求完成就认为网络连通，记录延迟
        this.networkLatency = Date.now() - startTime;
        console.log(`[AdaptiveSearchInterval] 网络延迟检测: ${this.networkLatency}ms`);
        return this.networkLatency;
      } catch (error) {
        console.warn('[AdaptiveSearchInterval] 网络延迟检测失败:', error);
        this.networkLatency = this.config.NETWORK_TIMEOUT; // 使用超时时间作为默认延迟
      }

      return this.networkLatency;
    }

    /**
     * 记录搜索结果
     * @param {boolean} success - 搜索是否成功
     * @param {number} [duration] - 搜索耗时（毫秒）
     */
    recordSearchResult(success, duration = null) {
      const record = {
        success,
        timestamp: Date.now(),
        duration: duration || 0
      };

      this.recentSearchTimes.push(record);

      // 保持历史记录大小
      if (this.recentSearchTimes.length > this.maxHistorySize) {
        this.recentSearchTimes.shift();
      }

      // 更新成功率
      this.updateSuccessRate();

      console.log(`[AdaptiveSearchInterval] 记录搜索结果: ${success ? '成功' : '失败'}, 当前成功率: ${(this.searchSuccessRate * 100).toFixed(1)}%`);
    }

    /**
     * 更新搜索成功率
     * @private
     */
    updateSuccessRate() {
      if (this.recentSearchTimes.length === 0) {
        this.searchSuccessRate = 1.0;
        return;
      }

      const successCount = this.recentSearchTimes.filter(record => record.success).length;
      this.searchSuccessRate = successCount / this.recentSearchTimes.length;
    }

    /**
     * 获取当前状态信息
     * @returns {Object} 状态信息
     */
    getStatus() {
      return {
        enabled: this.config.ENABLED,
        lastInterval: this.lastInterval,
        networkLatency: this.networkLatency,
        searchSuccessRate: this.searchSuccessRate,
        recentSearchCount: this.recentSearchTimes.length,
        baseInterval: this.config.BASE_INTERVAL,
        minInterval: this.config.MIN_INTERVAL,
        maxInterval: this.config.MAX_INTERVAL
      };
    }

    /**
     * 重置统计数据
     */
    reset() {
      this.networkLatency = 0;
      this.searchSuccessRate = 1.0;
      this.recentSearchTimes = [];
      this.lastInterval = this.config.BASE_INTERVAL;
      console.log('[AdaptiveSearchInterval] 统计数据已重置');
    }
  }

  // ============================================================================
  // 模块初始化和导出
  // ============================================================================

  // 全局应用状态
  const AppState = {
    isRunning: false,
    currentCount: 0,
    targetCount: CONFIG.SEARCH.MAX_COUNT,
    hotWords: [],
    searchTimer: null
  };

  // 模块导出对象
  const App = {
    CONFIG,
    ConfigValidator,
    StorageManager,
    Utils,
    AppState
  };

  // 在控制台输出模块信息（仅开发模式）
  if (typeof GM_getValue !== 'undefined' && GM_getValue('DEBUG_MODE', false)) {
    console.log('[微软Rewards脚本-重构版] 模块化架构已加载');
    console.log('[模块] CONFIG:', CONFIG);
    console.log('[模块] StorageManager:', StorageManager);
    console.log('[模块] Utils:', Utils);
    console.log('[状态] AppState:', AppState);
  }

  // ============================================================================
  // 热搜词管理模块 (HotWordsManager)
  // ============================================================================

  /**
   * 热搜词管理器
   * @class HotWordsManager
   */
  class HotWordsManager {
    /**
     * 获取热搜词
     * @returns {Promise<Array>} 热搜词数组
     */
    static async getHotWords() {
      try {
        // 先尝试从缓存获取
        const cached = StorageManager.getCachedHotWords();
        if (cached && cached.length >= CONFIG.HOT_WORDS.TARGET_COUNT) {
          console.log('[HotWordsManager] 使用缓存的热搜词:', cached.length + '个');
          return cached;
        }

        console.log('[HotWordsManager] 开始获取热搜词...');
        const words = await this.fetchHotWordsFromSources();

        if (words.length > 0) {
          StorageManager.cacheHotWords(words);
          console.log('[HotWordsManager] 成功获取热搜词:', words.length + '个');
          return words;
        }

        // 降级到默认词汇
        console.warn('[HotWordsManager] 获取热搜词失败，使用默认词汇');
        return this.getFallbackWords();
      } catch (error) {
        console.error('[HotWordsManager] 获取热搜词异常:', error);
        return this.getFallbackWords();
      }
    }

    /**
     * 从多个数据源并发获取热搜词
     * @returns {Promise<Array>} 热搜词数组
     */
    static async fetchHotWordsFromSources() {
      const sources = [
        { name: '百度', url: CONFIG.API.BAIDU_HOT, parser: this.parseBaiduHot },
        { name: '头条', url: CONFIG.API.TOUTIAO_HOT, parser: this.parseToutiaoHot },
        { name: '抖音', url: CONFIG.API.DOUYIN_HOT, parser: this.parseDouyinHot },
        { name: '微博', url: CONFIG.API.WEIBO_HOT, parser: this.parseWeiboHot }
      ];

      // 并发请求所有数据源
      const promises = sources.map(source => this.fetchFromSource(source));
      /** @type {PromiseSettledResult<string[]>[]} */
      const results = await Promise.allSettled(promises);

      // 合并所有成功的结果
      let allWords = [];
      let successfulSources = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
          console.log(`[HotWordsManager] ${sources[index].name}热搜获取成功:`, result.value.length + '个');
          allWords = allWords.concat(result.value);
          successfulSources++;
        } else if (result.status === 'rejected') {
          // 明确检查rejected状态，避免TypeScript错误
          console.warn(`[HotWordsManager] ${sources[index].name}热搜获取失败:`, result.reason);
        }
      });

      // 去重、打乱
      const uniqueWords = Utils.uniqueArray(allWords);
      const shuffledWords = Utils.shuffleArray(uniqueWords);

      // 确保至少有目标数量的搜索词
      if (shuffledWords.length < CONFIG.HOT_WORDS.TARGET_COUNT) {
        console.warn(`[HotWordsManager] 热搜词不足(${shuffledWords.length}/${CONFIG.HOT_WORDS.TARGET_COUNT})，补充默认词汇`);
        const fallbackWords = this.getFallbackWords();
        const additionalWords = fallbackWords.slice(0, CONFIG.HOT_WORDS.TARGET_COUNT - shuffledWords.length);
        return shuffledWords.concat(additionalWords);
      }

      return shuffledWords.slice(0, CONFIG.HOT_WORDS.TARGET_COUNT);
    }

    /**
     * 从单个数据源获取热搜词
     * @param {Object} source - 数据源配置
     * @returns {Promise<Array>} 热搜词数组
     */
    static fetchFromSource(source) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`${source.name}请求超时`));
        }, CONFIG.HOT_WORDS.REQUEST_TIMEOUT);

        GM_xmlhttpRequest({
          method: 'GET',
          url: source.url,
          timeout: CONFIG.HOT_WORDS.REQUEST_TIMEOUT,
          onload: (response) => {
            clearTimeout(timeout);
            try {
              if (response.status === 200) {
                const words = source.parser(response.responseText);
                resolve(words.slice(0, CONFIG.HOT_WORDS.PER_SOURCE_COUNT));
              } else {
                reject(new Error(`${source.name}响应状态错误: ${response.status}`));
              }
            } catch (error) {
              reject(new Error(`${source.name}解析失败: ${error.message}`));
            }
          },
          onerror: (error) => {
            clearTimeout(timeout);
            reject(new Error(`${source.name}网络错误: ${error}`));
          },
          ontimeout: () => {
            clearTimeout(timeout);
            reject(new Error(`${source.name}请求超时`));
          }
        });
      });
    }

    /**
     * 解析百度热搜数据
     * @param {string} responseText - 响应文本
     * @returns {Array} 热搜词数组
     */
    static parseBaiduHot(responseText) {
      try {
        const data = Utils.safeJsonParse(responseText);
        if (data && data.data && data.data.cards && data.data.cards[0] && data.data.cards[0].content) {
          return data.data.cards[0].content.map(item => item.word || item.query).filter(Boolean);
        }
        return [];
      } catch (error) {
        console.error('[HotWordsManager] 百度热搜解析失败:', error);
        return [];
      }
    }



    /**
     * 解析头条热搜数据
     * @param {string} responseText - 响应文本
     * @returns {Array} 热搜词数组
     */
    static parseToutiaoHot(responseText) {
      try {
        const data = Utils.safeJsonParse(responseText);
        if (data && data.data) {
          return data.data.map(item => item.Title || item.title || item.word).filter(Boolean);
        }
        return [];
      } catch (error) {
        console.error('[HotWordsManager] 头条热搜解析失败:', error);
        return [];
      }
    }

    /**
     * 解析微博热搜数据
     * @param {string} responseText - 响应文本
     * @returns {Array} 热搜词数组
     */
    static parseWeiboHot(responseText) {
      try {
        const data = Utils.safeJsonParse(responseText);
        if (data && data.code === 200 && data.data && Array.isArray(data.data)) {
          return data.data.map(item => item.title).filter(Boolean);
        }
        return [];
      } catch (error) {
        console.error('[HotWordsManager] 微博热搜解析失败:', error);
        return [];
      }
    }

    /**
     * 解析抖音热搜数据
     * @param {string} responseText - 响应文本
     * @returns {Array} 热搜词数组
     */
    static parseDouyinHot(responseText) {
      try {
        const data = Utils.safeJsonParse(responseText);
        if (data && data.data && data.data.word_list) {
          return data.data.word_list.map(item => item.word || item.sentence).filter(Boolean);
        }
        return [];
      } catch (error) {
        console.error('[HotWordsManager] 抖音热搜解析失败:', error);
        return [];
      }
    }

    /**
     * 获取降级词汇
     * @returns {Array} 降级词汇数组
     */
    static getFallbackWords() {
      const fallbackWords = [...CONFIG.HOT_WORDS.FALLBACK_WORDS];
      return Utils.shuffleArray(fallbackWords).slice(0, CONFIG.HOT_WORDS.TARGET_COUNT);
    }

    /**
     * 生成搜索词（添加随机后缀）
     * @param {string} baseWord - 基础词汇
     * @param {number} count - 当前搜索次数
     * @returns {string} 最终搜索词
     */
    static generateSearchWord(baseWord, count) {
      const randomSuffix = Utils.generateRandomString();
      return `${baseWord} ${count} ${randomSuffix}`;
    }

    /**
     * 刷新热搜词缓存
     * @returns {Promise<Array>} 新的热搜词数组
     */
    static async refreshHotWords() {
      try {
        console.log('[HotWordsManager] 刷新热搜词缓存...');
        // 清除缓存
        GM_setValue(CONFIG.STORAGE.HOT_WORDS_KEY, '');

        // 重新获取
        const words = await this.fetchHotWordsFromSources();
        if (words.length > 0) {
          StorageManager.cacheHotWords(words);
          console.log('[HotWordsManager] 热搜词缓存刷新成功:', words.length + '个');
          return words;
        }

        return this.getFallbackWords();
      } catch (error) {
        console.error('[HotWordsManager] 刷新热搜词失败:', error);
        return this.getFallbackWords();
      }
    }
  }

  // ============================================================================
  // 搜索次数选择UI模块 (SearchCountSelector)
  // ============================================================================

  /**
   * 搜索次数选择器
   * @class SearchCountSelector
   */
  class SearchCountSelector {
    /**
     * 显示搜索次数选择对话框
     * @returns {Promise<number>} 用户选择的搜索次数
     */
    static showSelectionDialog() {
      return new Promise((resolve) => {
        // 创建遮罩层
        const overlay = this.createOverlay();

        // 创建对话框
        const dialog = this.createDialog();

        // 创建内容
        const content = this.createDialogContent(resolve, overlay);

        dialog.appendChild(content);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // 添加动画效果
        setTimeout(() => {
          overlay.style.opacity = '1';
          dialog.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // 键盘事件监听
        this.addKeyboardListeners(resolve, overlay);
      });
    }

    /**
     * 创建遮罩层
     * @returns {HTMLElement} 遮罩层元素
     */
    static createOverlay() {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--liquid-overlay-bg);
        z-index: ${CONFIG.UI.MODAL_Z_INDEX};
        opacity: 0;
        transition: opacity var(--liquid-transition-standard);
        backdrop-filter: blur(var(--liquid-blur-light));
        -webkit-backdrop-filter: blur(var(--liquid-blur-light));
      `;
      return overlay;
    }

    /**
     * 创建对话框
     * @returns {HTMLElement} 对话框元素
     */
    static createDialog() {
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: var(--liquid-dialog-bg);
        border-radius: var(--liquid-radius-large);
        box-shadow: var(--liquid-shadow-lg);
        border: 1px solid var(--liquid-border-light);
        min-width: 320px;
        width: 80%;
        max-width: 90vw;
        margin: 0 auto;
        transition: transform var(--liquid-transition-standard);
        font-family: var(--liquid-font-family);
      `;
      return dialog;
    }

    /**
     * 创建对话框内容
     * @param {Function} resolve - Promise resolve函数
     * @param {HTMLElement} overlay - 遮罩层元素
     * @returns {HTMLElement} 内容元素
     */
    static createDialogContent(resolve, overlay) {
      const content = document.createElement('div');
      content.style.cssText = 'padding: 24px;';

      // 标题
      const title = document.createElement('h3');
      title.textContent = '选择搜索次数';
      title.style.cssText = `
        margin: 0 0 16px 0;
        font-size: var(--liquid-font-size-large);
        font-weight: 600;
        color: var(--liquid-text-primary);
        text-align: center;
      `;

      // 描述
      const description = document.createElement('p');
      description.textContent = '请选择本次要执行的搜索次数：';
      description.style.cssText = `
        margin: 0 0 24px 0;
        font-size: var(--liquid-font-size-medium);
        color: var(--liquid-text-secondary);
        text-align: center;
        line-height: 1.4;
      `;

      // 按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: center;
      `;

      // 30次按钮
      const button30 = this.createButton('30次搜索', '#007AFF', () => {
        this.closeDialog(overlay, () => resolve(30));
      });

      // 40次按钮
      const button40 = this.createButton('40次搜索', '#34C759', () => {
        this.closeDialog(overlay, () => resolve(40));
      });

      // 取消按钮
      const cancelButton = document.createElement('button');
      cancelButton.textContent = '×';
      cancelButton.style.cssText = `
        position: absolute;
        top: 12px;
        right: 12px;
        background: transparent;
        border: none;
        color: var(--liquid-text-tertiary);
        font-size: 22px;
        line-height: 1;
        padding: 0;
        width: 28px;
        height: 28px;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--liquid-transition-fast);
      `;

      // 悬停效果
      cancelButton.addEventListener('mouseenter', () => {
        cancelButton.style.background = 'var(--liquid-bg-tertiary)';
        cancelButton.style.color = 'var(--liquid-text-primary)';
      });

      cancelButton.addEventListener('mouseleave', () => {
        cancelButton.style.background = 'transparent';
        cancelButton.style.color = 'var(--liquid-text-tertiary)';
      });

      // 点击事件
      cancelButton.addEventListener('click', () => {
        this.closeDialog(overlay, () => resolve(null));
      });

      buttonContainer.appendChild(button30);
      buttonContainer.appendChild(button40);

      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(buttonContainer);
      content.appendChild(cancelButton);

      return content;
    }

    /**
     * 创建按钮
     * @param {string} text - 按钮文本
     * @param {string} color - 按钮颜色（用于兼容旧版本，新版本使用CSS变量）
     * @param {Function} onClick - 点击回调
     * @returns {HTMLElement} 按钮元素
     */
    static createButton(text, color, onClick) {
      const button = document.createElement('button');
      button.textContent = text;

      // 根据文本内容选择不同的强调色
      const accentColor = text.includes('30') ? 'var(--liquid-accent-primary)' : 'var(--liquid-accent-success)';
      const accentBg = text.includes('30') ? 'var(--liquid-accent-primary-bg)' : 'var(--liquid-accent-success-bg)';

      button.style.cssText = `
        padding: 12px 24px;
        border: 1px solid ${accentColor};
        border-radius: var(--liquid-radius-medium);
        background: ${accentColor};
        color: var(--liquid-text-on-accent);
        font-size: var(--liquid-font-size-medium);
        font-weight: 600;
        cursor: pointer;
        transition: var(--liquid-transition-standard);
        min-width: 100px;
        box-shadow: var(--liquid-shadow-sm);
      `;

      // 悬停效果
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = 'var(--liquid-shadow-hover)';
        button.style.filter = 'brightness(1.1)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'var(--liquid-shadow-sm)';
        button.style.filter = 'brightness(1)';
      });

      // 点击效果
      button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(0) scale(0.98)';
        button.style.boxShadow = 'var(--liquid-shadow-inset)';
        button.style.filter = 'brightness(0.95)';
      });

      button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(-2px) scale(1)';
        button.style.boxShadow = 'var(--liquid-shadow-hover)';
        button.style.filter = 'brightness(1.1)';
      });

      button.addEventListener('click', onClick);

      return button;
    }

    /**
     * 添加键盘事件监听
     * @param {Function} resolve - Promise resolve函数
     * @param {HTMLElement} overlay - 遮罩层元素
     */
    static addKeyboardListeners(resolve, overlay) {
      const keyHandler = (event) => {
        if (event.key === '1' || event.key === '3') {
          // 按1或3选择30次
          event.preventDefault();
          this.closeDialog(overlay, () => resolve(30));
          document.removeEventListener('keydown', keyHandler);
        } else if (event.key === '2' || event.key === '4') {
          // 按2或4选择40次
          event.preventDefault();
          this.closeDialog(overlay, () => resolve(40));
          document.removeEventListener('keydown', keyHandler);
        } else if (event.key === 'Escape') {
          // ESC键取消操作
          event.preventDefault();
          this.closeDialog(overlay, () => resolve(null));
          document.removeEventListener('keydown', keyHandler);
        } else if (event.key === 'Enter') {
          // Enter键默认选择30次
          event.preventDefault();
          this.closeDialog(overlay, () => resolve(30));
          document.removeEventListener('keydown', keyHandler);
        }
      };

      document.addEventListener('keydown', keyHandler);
    }

    /**
     * 关闭对话框
     * @param {HTMLElement} overlay - 遮罩层元素
     * @param {Function} callback - 关闭后的回调
     */
    static closeDialog(overlay, callback) {
      const dialog = overlay.querySelector('div');

      // 添加关闭动画
      overlay.style.opacity = '0';
      dialog.style.animation = 'liquidScaleOut var(--liquid-animation-duration) var(--liquid-animation-easing) forwards';

      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        if (callback) callback();
      }, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--liquid-animation-duration')) || 300);
    }

    /**
     * 显示快速选择提示
     * @returns {Promise<number>} 用户选择的搜索次数
     */
    static async showQuickSelection() {
      // 检查是否有保存的偏好设置
      const savedPreference = GM_getValue('search_count_preference', null);
      if (savedPreference && ConfigValidator.isValidSearchCount(savedPreference)) {
        console.log('[SearchCountSelector] 使用保存的偏好设置:', savedPreference);
        return savedPreference;
      }

      // 显示选择对话框
      const selectedCount = await this.showSelectionDialog();

      // 保存用户偏好（可选）
      // GM_setValue('search_count_preference', selectedCount);

      console.log('[SearchCountSelector] 用户选择搜索次数:', selectedCount);
      return selectedCount;
    }
  }

  // ============================================================================
  // 搜索执行器模块 (SearchExecutor)
  // ============================================================================

  /**
   * 搜索执行器 - 核心搜索逻辑引擎
   * @class SearchExecutor
   */
  class SearchExecutor {
    /**
     * 构造函数
     * @param {number} targetCount - 目标搜索次数
     */
    constructor(targetCount) {
      this.targetCount = targetCount;
      this.currentCount = 0;
      this.isRunning = false;
      this.intervalId = null;
      this.hotWords = [];
      this.usedWords = new Set();
      this.lastSearchTime = null; // 上次搜索时间，用于计算倒计时
      this.searchTimer = null; // 搜索定时器
      this.adaptiveInterval = new AdaptiveSearchInterval(); // 自适应间隔管理器

      // 绑定方法上下文
      this.executeSearch = this.executeSearch.bind(this);
      this.stop = this.stop.bind(this);
    }

    /**
     * 初始化搜索执行器
     * @returns {Promise<void>}
     */
    async initialize() {
      try {
        // 加载当前进度
        await this.loadProgress();

        // 获取热搜词
        try {
          this.hotWords = await HotWordsManager.getHotWords();
          console.log(`[SearchExecutor] 热搜词加载完成，共 ${this.hotWords.length} 个`);
        } catch (error) {
          console.warn('[SearchExecutor] 热搜词获取失败，将使用随机字符串:', error);
          this.hotWords = [];
        }

        // 检测网络延迟（异步执行，不阻塞初始化）
        this.adaptiveInterval.detectNetworkLatency().catch(error => {
          console.warn('[SearchExecutor] 网络延迟检测失败，使用默认配置:', error);
        });

        console.log('[SearchExecutor] 初始化完成', {
          targetCount: this.targetCount,
          currentCount: this.currentCount,
          hotWordsCount: this.hotWords.length,
          adaptiveIntervalEnabled: this.adaptiveInterval.config.ENABLED
        });
      } catch (error) {
        console.error('[SearchExecutor] 初始化失败:', error);
        throw error;
      }
    }

    /**
      * 加载搜索进度
      * @returns {Promise<void>}
      */
    async loadProgress() {
      this.currentCount = StorageManager.getTodayCount();

      // 检查是否已完成今日任务
      if (this.currentCount >= this.targetCount) {
        console.log('[SearchExecutor] 今日搜索任务已完成');
        return;
      }
    }

    /**
     * 开始搜索任务
     * @returns {Promise<void>}
     */
    async start() {
      // 强化重复启动保护
      if (this.isRunning) {
        console.warn('[SearchExecutor] 搜索任务已在运行中，忽略重复启动请求');
        return;
      }

      if (this.currentCount >= this.targetCount) {
        console.log('[SearchExecutor] 今日搜索任务已完成，无需继续');
        return;
      }

      // 清理之前的定时器（防止重复启动）
      this.stop();

      // 设置运行状态标志，防止并发启动
      this.isRunning = true;
      this.lastSearchTime = Date.now(); // 重置上次搜索时间

      console.log('[SearchExecutor] 开始搜索任务', {
        current: this.currentCount,
        target: this.targetCount,
        remaining: this.targetCount - this.currentCount,
        timestamp: new Date().toLocaleTimeString()
      });

      try {
        // 立即执行第一次搜索
        await this.executeSearch();

        // 使用scheduleNextSearch方法而不是setInterval，避免累积定时器
        if (this.isRunning && this.currentCount < this.targetCount) {
          this.scheduleNextSearch();
        }
      } catch (error) {
        console.error('[SearchExecutor] 启动搜索任务失败:', error);
        this.stop(); // 发生错误时停止任务
        throw error;
      }
    }

    /**
     * 停止搜索任务
     */
    stop() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
        this.searchTimer = null;
      }
      this.isRunning = false;
      this.lastSearchTime = null; // 清除上次搜索时间

      // 重置自适应间隔统计数据
      this.adaptiveInterval.reset();

      console.log('[SearchExecutor] 搜索任务已停止，自适应间隔已重置');
    }

    /**
     * 执行单次搜索
     * @returns {Promise<void>}
     */
    async executeSearch() {
      // 检查任务是否仍在运行
      if (!this.isRunning) {
        console.log('[SearchExecutor] 任务已停止，跳过执行');
        return;
      }

      try {
        // 检查是否已完成
        if (this.currentCount >= this.targetCount) {
          this.stop();
          console.log('[SearchExecutor] 搜索任务完成!');
          return;
        }

        // 获取搜索词
        const searchTerm = this.getNextSearchTerm();
        if (!searchTerm) {
          console.warn('[SearchExecutor] 无可用搜索词，停止任务');
          this.stop();
          return;
        }

        console.log(`[SearchExecutor] 执行第${this.currentCount + 1}次搜索: "${searchTerm}"`);

        // 记录本次搜索时间，用于计算下一次搜索的倒计时
        this.lastSearchTime = Date.now();

        // 执行搜索跳转
        await this.performSearch(searchTerm);

        // 更新计数器
        this.currentCount++;
        await this.saveProgress();

        console.log(`[SearchExecutor] 搜索进度: ${this.currentCount}/${this.targetCount}`);

        // 检查是否完成
        if (this.currentCount >= this.targetCount) {
          this.stop();
          console.log('[SearchExecutor] 🎉 今日搜索任务完成!');
          return;
        }

        // 安排下一次搜索（只有在任务仍在运行时）
        if (this.isRunning) {
          this.scheduleNextSearch();
        }

      } catch (error) {
        console.error('[SearchExecutor] 搜索执行失败:', error);
        // 发生错误时继续下一次搜索（如果任务仍在运行）
        if (this.isRunning && this.currentCount < this.targetCount) {
          this.scheduleNextSearch();
        }
      }
    }

    /**
     * 获取下一个搜索词
     * @returns {string} 搜索词
     */
    getNextSearchTerm() {
      // 优先使用热搜词
      if (this.hotWords.length > 0) {
        // 找到未使用的热搜词
        const availableWords = this.hotWords.filter(word => !this.usedWords.has(word));

        if (availableWords.length > 0) {
          const word = availableWords[Math.floor(Math.random() * availableWords.length)];
          this.usedWords.add(word);
          return word + Utils.generateRandomString(2);
        }

        // 如果热搜词用完了，重置使用记录
        this.usedWords.clear();
        const word = this.hotWords[Math.floor(Math.random() * this.hotWords.length)];
        this.usedWords.add(word);
        return word + Utils.generateRandomString(2);
      }

      // 降级到随机字符串
      return Utils.generateRandomString(Utils.getRandomInt(3, 8));
    }

    /**
     * 执行搜索操作
     * @param {string} searchTerm - 搜索词
     * @returns {Promise<void>}
     */
    async performSearch(searchTerm) {
      const searchStartTime = Date.now();
      let searchSuccess = false;

      try {
        // 查找搜索框和搜索按钮
        const searchInput = document.getElementById('sb_form_q') || document.querySelector('input[name="q"]');
        const searchButton = document.getElementById('sb_form_go') || document.querySelector('button[type="submit"]');

        if (!searchInput) {
          throw new Error('搜索框未找到');
        }
        if (!searchButton) {
          throw new Error('搜索按钮未找到');
        }

        console.log(`[SearchExecutor] 执行搜索: ${searchTerm}`);

        // 设置搜索词并点击搜索按钮
        // 使用JavaScript兼容的类型转换
      /** @type {HTMLInputElement} */ (searchInput).value = searchTerm;
      /** @type {HTMLElement} */ (searchButton).click();

        // 等待搜索执行
        await Utils.sleep(1000);

        // 搜索后滚动到底部
        if (typeof window !== 'undefined' && window.uiManager) {
          window.uiManager.scrollToBottom();
        }

        searchSuccess = true;

      } catch (error) {
        console.error('[SearchExecutor] 搜索执行失败:', error);
        searchSuccess = false;
        throw error;
      } finally {
        // 记录搜索结果到自适应间隔管理器
        const searchDuration = Date.now() - searchStartTime;
        this.adaptiveInterval.recordSearchResult(searchSuccess, searchDuration);
      }
    }

    /**
     * 获取搜索URL
     * @param {string} searchTerm - 搜索词
     * @returns {string} 搜索URL
     */
    getSearchUrl(searchTerm) {
      const encodedTerm = encodeURIComponent(searchTerm);

      // 根据当前搜索次数选择不同的搜索引擎
      // 前30次使用国际版Bing，后续使用中国版
      if (this.currentCount < 30) {
        return `https://www.bing.com/search?q=${encodedTerm}&form=QBLH&sp=-1&lq=0&pq=${encodedTerm}&sc=0-${searchTerm.length}&qs=n&sk=&cvid=${Utils.generateRandomString(32).toUpperCase()}`;
      } else {
        return `https://cn.bing.com/search?q=${encodedTerm}&form=QBLH&sp=-1&lq=0&pq=${encodedTerm}&sc=0-${searchTerm.length}&qs=n&sk=&cvid=${Utils.generateRandomString(32).toUpperCase()}`;
      }
    }

    /**
      * 保存搜索进度
      * @returns {Promise<void>}
      */
    async saveProgress() {
      StorageManager.saveTodayCount(this.currentCount);
    }

    /**
      * 重置搜索进度
      * @returns {Promise<void>}
      */
    async resetProgress() {
      this.currentCount = 0;
      this.usedWords.clear();
      StorageManager.clearTodayProgress();
      console.log('[SearchExecutor] 搜索进度已重置');
    }

    /**
     * 获取搜索状态
     * @returns {Object} 搜索状态信息
     */
    getStatus() {
      // 计算下一次搜索的剩余时间（秒）
      let nextSearchSeconds = 0;
      if (this.isRunning && !this.isCompleted() && this.lastSearchTime) {
        const elapsed = Date.now() - this.lastSearchTime;
        let actualInterval;

        if (this.adaptiveInterval.config.ENABLED) {
          // 如果自适应间隔启用但还没有计算过间隔，先计算一次
          if (!this.adaptiveInterval.lastInterval) {
            actualInterval = this.adaptiveInterval.calculateNextInterval();
          } else {
            actualInterval = this.adaptiveInterval.lastInterval;
          }
        } else {
          actualInterval = CONFIG.SEARCH.INTERVAL;
        }

        nextSearchSeconds = Math.max(0, Math.ceil((actualInterval - elapsed) / 1000));
      }

      return {
        isRunning: this.isRunning,
        currentCount: this.currentCount,
        targetCount: this.targetCount,
        progress: Math.round((this.currentCount / this.targetCount) * 100),
        remaining: Math.max(0, this.targetCount - this.currentCount),
        usedWordsCount: this.usedWords.size,
        nextSearchSeconds: nextSearchSeconds // 添加下一次搜索的剩余秒数
      };
    }

    /**
     * 检查是否完成今日任务
     * @returns {boolean} 是否完成
     */
    isCompleted() {
      return this.currentCount >= this.targetCount;
    }

    /**
     * 立即执行一次搜索（与定时任务集成）
     * @returns {Promise<void>}
     */
    async executeImmediateSearch() {
      if (this.isCompleted()) {
        console.log('[SearchExecutor] 今日任务已完成，无法执行立即搜索');
        return;
      }

      if (!this.isRunning) {
        console.log('[SearchExecutor] 搜索任务未启动，无法执行立即搜索');
        return;
      }

      console.log('[SearchExecutor] 触发立即搜索（集成到定时任务）');

      // 清除当前定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
        this.searchTimer = null;
      }

      // 立即执行下一次搜索
      await this.executeSearch();

      // 如果任务未完成，重新启动定时器
      if (this.isRunning && !this.isCompleted()) {
        this.scheduleNextSearch();
      }
    }

    /**
     * 安排下一次搜索
     * @returns {void}
     */
    scheduleNextSearch() {
      if (!this.isRunning || this.isCompleted()) {
        console.log('[SearchExecutor] 任务已停止或完成，取消安排下一次搜索');
        return;
      }

      // 清理之前的定时器，防止重复调度
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
        this.searchTimer = null;
      }

      // 使用自适应间隔计算延迟时间
      let delay = this.adaptiveInterval.calculateNextInterval();

      // 强制最小间隔保护，防止间隔过短（使用用户配置的最小间隔）
      const MIN_SAFE_INTERVAL = CONFIG.SEARCH.MIN_INTERVAL; // 使用配置的最小间隔
      if (delay < MIN_SAFE_INTERVAL) {
        console.warn(`[SearchExecutor] 计算间隔过短(${delay}ms)，强制使用最小安全间隔(${MIN_SAFE_INTERVAL}ms)`);
        delay = MIN_SAFE_INTERVAL;
        // 更新lastInterval以确保状态显示一致
        this.adaptiveInterval.lastInterval = MIN_SAFE_INTERVAL;
      }

      const adaptiveStatus = this.adaptiveInterval.getStatus();

      console.log(`[SearchExecutor] 安排下一次搜索，延迟: ${Math.round(delay)}ms`, {
        enabled: adaptiveStatus.enabled,
        networkLatency: adaptiveStatus.networkLatency,
        successRate: (adaptiveStatus.searchSuccessRate * 100).toFixed(1) + '%',
        baseInterval: adaptiveStatus.baseInterval,
        nextSearchAt: new Date(Date.now() + delay).toLocaleTimeString()
      });

      // 设置上次搜索时间为当前时间，确保倒计时从正确的时间开始
      this.lastSearchTime = Date.now();

      this.searchTimer = setTimeout(async () => {
        // 双重检查任务状态
        if (this.isRunning && !this.isCompleted()) {
          console.log('[SearchExecutor] 定时器触发，执行下一次搜索');
          await this.executeSearch();
        } else {
          console.log('[SearchExecutor] 定时器触发时任务已停止或完成，跳过执行');
        }
      }, delay);
    }
  }

  // ============================================================================
  // UI管理器模块 (UIManager)
  // ============================================================================

  /**
   * UI管理器 - 负责用户界面管理
   * @class UIManager
   */
  class UIManager {
    /**
     * 构造函数
     */
    constructor() {
      this.controlPanel = null;
      this.statusDisplay = null;
      this.isInitialized = false;
    }

    /**
     * 初始化UI管理器
     * @returns {Promise<void>}
     */
    async initialize() {
      if (this.isInitialized) return;

      try {
        await this.createControlPanel();
        await this.createStatusDisplay();
        this.addGlobalStyles();
        this.isInitialized = true;
        console.log('[UIManager] UI管理器初始化完成');
      } catch (error) {
        console.error('[UIManager] 初始化失败:', error);
        throw error;
      }
    }

    /**
     * 创建控制面板 - macOS Liquid Glass风格
     * @returns {Promise<void>}
     */
    async createControlPanel() {
      // 等待页面加载完成
      await this.waitForPageReady();

      // 创建控制面板容器
      this.controlPanel = document.createElement('div');
      this.controlPanel.id = 'rewards-control-panel';
      this.isMenuCollapsed = false;
      this.controlPanel.style.cssText = `
        position: fixed;
        top: 20px;
        left: auto;
        right: 20px;
        background: var(--liquid-bg-secondary);
        color: var(--liquid-text-primary);
        padding: 0;
        border-radius: var(--liquid-radius-large);
        box-shadow: 0 8px 32px var(--liquid-shadow-medium), inset 0 0 0 1px var(--liquid-border-light);
        z-index: ${CONFIG.UI.MODAL_Z_INDEX - 1};
        font-family: var(--liquid-font-family);
        font-size: var(--liquid-font-size-medium);
        min-width: 200px;
        backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        -webkit-backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        border: 1px solid var(--liquid-border-light);
        cursor: move;
        transition: var(--liquid-transition-standard);
        transform: var(--liquid-gpu-acceleration);
        opacity: 0.95;
        overflow: hidden;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);
        will-change: var(--liquid-will-change-transform), var(--liquid-will-change-filter);
        backface-visibility: var(--liquid-backface-visibility);
        perspective: var(--liquid-perspective);
        animation: liquidFadeIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
      `;

      // 创建标题栏
      const titleBar = document.createElement('div');
      titleBar.className = 'titleBar';
      titleBar.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--liquid-border-medium);
        cursor: move;
        background: var(--liquid-bg-tertiary);
        border-top-left-radius: var(--liquid-radius-large);
        border-top-right-radius: var(--liquid-radius-large);
      `;

      const title = document.createElement('span');
      title.textContent = '微软Rewards助手';
      title.style.cssText = `
        font-weight: 600;
        font-size: var(--liquid-font-size-large);
        color: var(--liquid-text-primary);
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);
      `;

      // 创建折叠按钮 - Liquid Glass风格
      const toggleButton = document.createElement('button');
      toggleButton.className = 'toggleButton';
      toggleButton.textContent = '−';
      toggleButton.style.cssText = `
        background: var(--liquid-bg-tertiary);
        border: 1px solid var(--liquid-border-medium);
        color: var(--liquid-text-primary);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: var(--liquid-font-size-medium);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--liquid-transition-fast);
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        box-shadow: 0 1px 3px var(--liquid-shadow-light);
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(var(--liquid-blur-light));
        -webkit-backdrop-filter: blur(var(--liquid-blur-light));
        padding: 0;
        line-height: 1;
        text-align: center;
        outline: none;
      `;

      toggleButton.addEventListener('mouseenter', () => {
        toggleButton.style.background = 'var(--liquid-bg-primary)';
        toggleButton.style.transform = 'scale(1.05)';
        toggleButton.style.boxShadow = '0 2px 8px var(--liquid-shadow-medium)';
      });

      toggleButton.addEventListener('mouseleave', () => {
        toggleButton.style.background = 'var(--liquid-bg-tertiary)';
        toggleButton.style.transform = 'scale(1)';
        toggleButton.style.boxShadow = '0 1px 3px var(--liquid-shadow-light)';
      });

      // 添加焦点处理
      toggleButton.addEventListener('focus', () => {
        toggleButton.style.outline = 'none';
        toggleButton.style.boxShadow = '0 2px 8px var(--liquid-shadow-medium)';
      });

      toggleButton.addEventListener('blur', () => {
        toggleButton.style.boxShadow = '0 1px 3px var(--liquid-shadow-light)';
      });

      toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });

      // 添加触摸事件监听器，解决移动端点击问题
      toggleButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMenu();
      }, { passive: false });

      titleBar.appendChild(title);
      titleBar.appendChild(toggleButton);

      // 创建按钮容器 - Liquid Glass风格
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'menu-content';
      buttonContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        transition: var(--liquid-transition-standard);
        background: var(--liquid-bg-tertiary);
        border-bottom-left-radius: var(--liquid-radius-large);
        border-bottom-right-radius: var(--liquid-radius-large);
      `;

      // 创建启动按钮
      const startButton = this.createButton('启动搜索', '#28a745', async () => {
        await this.handleStartSearch();
      });

      // 创建停止按钮
      const stopButton = this.createButton('停止搜索', '#dc3545', () => {
        this.handleStopSearch();
      });

      // 创建重置按钮
      const resetButton = this.createButton('重置进度', '#ffc107', () => {
        this.handleResetProgress();
      });

      // 创建立即搜索按钮
      const immediateButton = this.createButton('立即搜索', '#FF9800', () => {
        this.handleImmediateSearch();
      });

      const viewWordsButton = this.createButton('查看搜索词', '#9C27B0', () => {
        this.handleViewSearchWords();
      });

      // 创建设置按钮
      const settingsButton = this.createButton('设置选项', '#6C757D', () => {
        this.handleShowSettings();
      });

      buttonContainer.appendChild(startButton);
      buttonContainer.appendChild(stopButton);
      buttonContainer.appendChild(resetButton);
      buttonContainer.appendChild(immediateButton);
      buttonContainer.appendChild(viewWordsButton);
      buttonContainer.appendChild(settingsButton);

      this.controlPanel.appendChild(titleBar);
      this.controlPanel.appendChild(buttonContainer);

      // 添加到页面
      document.body.appendChild(this.controlPanel);

      // 使面板可拖动
      this.makeDraggable();
    }

    /**
     * 创建状态显示
     * @returns {Promise<void>}
     */
    async createStatusDisplay() {
      this.statusDisplay = document.createElement('div');
      this.statusDisplay.id = 'rewards-status-display';
      this.statusDisplay.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--liquid-bg-secondary);
        color: var(--liquid-text-primary);
        padding: 12px 16px;
        border-radius: var(--liquid-radius-large);
        font-family: var(--liquid-font-family);
        font-size: var(--liquid-font-size-small);
        z-index: ${CONFIG.UI.MODAL_Z_INDEX - 1};
        backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        -webkit-backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        border: 1px solid var(--liquid-border-light);
        box-shadow: 0 8px 32px var(--liquid-shadow-medium), inset 0 0 0 1px var(--liquid-border-light);
        text-shadow: var(--liquid-text-shadow-light);
        min-width: 150px;
        transition: var(--liquid-transition-standard);
        transform: translateY(0);
        opacity: 0.98;
        overflow: hidden;
        animation: liquidSlideIn var(--liquid-animation-duration) var(--liquid-animation-easing);
      `;

      // 初始状态显示
      this.updateStatusDisplay({
        isRunning: false,
        currentCount: StorageManager.getTodayCount(),
        targetCount: 0,
        progress: 0
      });

      document.body.appendChild(this.statusDisplay);

      // 启动状态更新定时器
      this.startStatusUpdate();
    }

    /**
     * 创建按钮 - macOS Liquid Glass风格
     * @param {string} text - 按钮文本
     * @param {string} color - 按钮颜色
     * @param {Function} onClick - 点击回调
     * @returns {HTMLElement} 按钮元素
     */
    createButton(text, color, onClick) {
      const button = document.createElement('button');
      button.textContent = text;
      button.style.cssText = `
        padding: 10px 14px;
        border: 1px solid var(--liquid-bg-primary);
        border-radius: var(--liquid-radius-medium);
        background: var(--liquid-bg-primary);
        color: var(--liquid-text-primary);
        font-size: var(--liquid-font-size-small);
        font-weight: 500;
        cursor: pointer;
        transition: var(--liquid-transition-fast);
        width: 100%;
        backdrop-filter: blur(var(--liquid-blur-medium));
        -webkit-backdrop-filter: blur(var(--liquid-blur-medium));
        box-shadow: var(--liquid-shadow-button);
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 0.3px;
        outline: none;
        transform: var(--liquid-gpu-acceleration);
        will-change: var(--liquid-will-change-transform);
        backface-visibility: var(--liquid-backface-visibility);
      `;

      // 添加按钮左侧边框颜色指示器（更符合Liquid Glass风格的光晕效果）
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 70%;
        width: 3px;
        background: ${color};
        box-shadow: 0 0 8px ${color};
        opacity: 0.8;
        border-radius: var(--liquid-radius-pill);
        margin-left: 4px;
        transition: var(--liquid-transition-fast);
      `;
      button.appendChild(indicator);

      // 悬停效果 - 使用Liquid Glass风格的变量
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = 'var(--liquid-shadow-button-hover)';
        button.style.background = 'var(--liquid-bg-secondary)';
        button.style.borderColor = 'var(--liquid-border-medium)';
        indicator.style.height = '85%';
        indicator.style.opacity = '1';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'var(--liquid-shadow-button)';
        button.style.background = 'var(--liquid-bg-primary)';
        button.style.borderColor = 'var(--liquid-border-light)';
        indicator.style.height = '70%';
        indicator.style.opacity = '0.8';
      });

      // 点击效果
      button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(1px)';
        button.style.boxShadow = 'var(--liquid-shadow-button-pressed)';
        button.style.background = 'var(--liquid-bg-tertiary)';
      });

      button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = 'var(--liquid-shadow-button-hover)';
        button.style.background = 'var(--liquid-bg-secondary)';
      });

      // 点击事件
      button.addEventListener('click', onClick);

      // 添加焦点处理，移除默认的黑色边框
      button.addEventListener('focus', () => {
        button.style.outline = 'none';
        button.style.boxShadow = 'var(--liquid-shadow-button-hover)';
        button.style.borderColor = 'var(--liquid-border-medium)';
      });

      button.addEventListener('blur', () => {
        button.style.boxShadow = 'var(--liquid-shadow-button)';
        button.style.borderColor = 'var(--liquid-border-light)';
      });

      return button;
    }

    /**
     * 等待页面准备就绪
     * @returns {Promise<void>}
     */
    waitForPageReady() {
      return new Promise((resolve) => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          resolve();
        } else {
          document.addEventListener('DOMContentLoaded', resolve);
        }
      });
    }

    /**
     * 添加全局样式
     */
    addGlobalStyles() {
      const style = document.createElement('style');
      style.textContent = `
        /* macOS Liquid Glass 风格 CSS 变量系统 */
        :root {
          /* 性能优化 - GPU加速和渲染优化 */
          --liquid-gpu-acceleration: translateZ(0);
          --liquid-will-change-transform: transform, opacity;
          --liquid-will-change-filter: backdrop-filter, filter;
          --liquid-backface-visibility: hidden;
          --liquid-perspective: 1000px;
          /* 基础颜色 */
          --liquid-white: #ffffff;
          --liquid-black: #000000;
          
          /* 背景色 - 优化透明度以提升性能和可读性 */
          --liquid-bg-primary: rgba(255, 255, 255, 0.92);
          --liquid-bg-secondary: rgba(255, 255, 255, 0.88);
          --liquid-bg-tertiary: rgba(255, 255, 255, 0.82);
          
          /* 对话框和遮罩层背景 */
          --liquid-dialog-bg: var(--liquid-bg-primary);
          --liquid-overlay-bg: rgba(0, 0, 0, 0.6);
          
          /* 文本颜色 */
          --liquid-text-primary: rgba(0, 0, 0, 0.85);
          --liquid-text-secondary: rgba(0, 0, 0, 0.65);
          --liquid-text-tertiary: rgba(0, 0, 0, 0.45);
          
          /* 边框颜色 */
          --liquid-border-light: rgba(255, 255, 255, 0.6);
          --liquid-border-medium: rgba(255, 255, 255, 0.4);
          --liquid-border-heavy: rgba(0, 0, 0, 0.1);
          
          /* 阴影 - 增强层次感和按钮效果 */
          --liquid-shadow-light: rgba(0, 0, 0, 0.08);
          --liquid-shadow-medium: rgba(0, 0, 0, 0.12);
          --liquid-shadow-heavy: rgba(0, 0, 0, 0.25);
          --liquid-shadow-button: 0 2px 8px rgba(0, 0, 0, 0.12), 0 0 0 0.5px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.9);
          --liquid-shadow-button-hover: 0 4px 16px rgba(0, 0, 0, 0.18), 0 0 0 0.5px rgba(255, 255, 255, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.95);
          --liquid-shadow-button-pressed: 0 1px 4px rgba(0, 0, 0, 0.15), 0 0 0 0.5px rgba(255, 255, 255, 0.7), inset 0 1px 2px rgba(0, 0, 0, 0.1);
          
          /* 模糊效果 - 优化性能和视觉效果 */
          --liquid-blur-light: 8px;
          --liquid-blur-medium: 12px;
          --liquid-blur-standard: 18px;
          --liquid-blur-heavy: 25px;
          
          /* 圆角 */
          --liquid-radius-small: 8px;
          --liquid-radius-medium: 12px;
          --liquid-radius-large: 16px;
          --liquid-radius-pill: 50px;
          
          /* 字体 */
          --liquid-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --liquid-font-size-small: 12px;
          --liquid-font-size-medium: 14px;
          --liquid-font-size-large: 16px;
          
          /* 过渡效果 - 优化性能的过渡 */
          --liquid-transition-fast: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.2s ease;
          --liquid-transition-standard: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.3s ease, backdrop-filter 0.3s ease;
          --liquid-transition-slow: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
          
          /* 动画效果 */
          --liquid-animation-duration: 300ms;
          --liquid-animation-duration-long: 500ms;
          --liquid-animation-easing: cubic-bezier(0.25, 0.1, 0.25, 1);
          --liquid-animation-distance: 10px;
          --liquid-animation-scale: 1.05;
          
          /* 强调色 */
          --liquid-accent-blue: #0a84ff;
          --liquid-accent-green: #30d158;
          --liquid-accent-red: #ff453a;
          --liquid-accent-orange: #ff9f0a;
          --liquid-accent-purple: #bf5af2;
          
          /* 强调色文本 */
          --liquid-text-on-accent: #ffffff;
          
          /* 状态指示色 */
          --liquid-accent-primary: var(--liquid-accent-blue);
          --liquid-accent-secondary: var(--liquid-accent-purple);
          --liquid-accent-success: var(--liquid-accent-green);
          --liquid-accent-danger: var(--liquid-accent-red);
          --liquid-accent-warning: var(--liquid-accent-orange);
        }
        
        /* 深色模式变量 */
        @media (prefers-color-scheme: dark) {
          :root {
            /* 背景色 - 优化深色模式透明度和对比度 */
            --liquid-bg-primary: rgba(28, 28, 30, 0.85);
            --liquid-bg-secondary: rgba(44, 44, 46, 0.78);
            --liquid-bg-tertiary: rgba(58, 58, 60, 0.65);
            
            /* 文本颜色 - 提高可读性 */
            --liquid-text-primary: rgba(255, 255, 255, 0.92);
            --liquid-text-secondary: rgba(255, 255, 255, 0.72);
            --liquid-text-tertiary: rgba(255, 255, 255, 0.52);
            
            /* 边框颜色 - 更明显的边框 */
            --liquid-border-light: rgba(140, 140, 140, 0.45);
            --liquid-border-medium: rgba(120, 120, 120, 0.35);
            --liquid-border-heavy: rgba(100, 100, 100, 0.25);
            
            /* 阴影 - 优化深色模式阴影和按钮效果 */
            --liquid-shadow-light: rgba(0, 0, 0, 0.35);
            --liquid-shadow-medium: rgba(0, 0, 0, 0.45);
            --liquid-shadow-heavy: rgba(0, 0, 0, 0.55);
            --liquid-shadow-button: 0 2px 12px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            --liquid-shadow-button-hover: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
            --liquid-shadow-button-pressed: 0 1px 6px rgba(0, 0, 0, 0.45), 0 0 0 0.5px rgba(255, 255, 255, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.2);
            
            /* 强调色 - 深色模式下调亮以提高可见性 */
            --liquid-accent-blue: #0a84ff;
            --liquid-accent-green: #30d158;
            --liquid-accent-red: #ff453a;
            --liquid-accent-orange: #ff9f0a;
            --liquid-accent-purple: #bf5af2;
            
            /* 强调色文本 */
            --liquid-text-on-accent: #ffffff;
            
            --liquid-accent-primary: var(--liquid-accent-blue);
            --liquid-accent-secondary: var(--liquid-accent-purple);
            --liquid-accent-success: var(--liquid-accent-green);
            --liquid-accent-danger: var(--liquid-accent-red);
            --liquid-accent-warning: var(--liquid-accent-orange);
          }
        }
        
        /* 控制面板和状态显示面板共享效果 */
        #rewards-control-panel, #rewards-status-display {
          transition: var(--liquid-transition-standard);
          animation: liquidFadeIn var(--liquid-animation-duration) var(--liquid-animation-easing) forwards;
        }
        
        #rewards-control-panel:hover, #rewards-status-display:hover {
          transform: translateY(-2px);
          box-shadow: var(--liquid-shadow-button-hover);
          opacity: 1;
          transition: var(--liquid-transition-fast);
        }
        
        #rewards-control-panel.collapsed #menu-content {
          display: none;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          #rewards-control-panel {
            top: 10px;
            right: 10px;
            min-width: 160px;
            font-size: var(--liquid-font-size-small);
            border-radius: var(--liquid-radius-large);
            padding: 0;
          }
          
          #rewards-control-panel button {
            touch-action: manipulation; /* 优化触摸操作 */
            border-radius: var(--liquid-radius-medium); /* 增加圆角半径，使按钮更圆 */
          }

          #rewards-control-panel #menu-content {
            padding: 12px;
            gap: 8px;
          }

          #rewards-control-panel .titleBar {
            padding: 10px 12px;
            border-top-left-radius: var(--liquid-radius-large);
            border-top-right-radius: var(--liquid-radius-large);
          }
          
          #rewards-status-display {
            bottom: 10px;
            left: 10px;
            font-size: var(--liquid-font-size-small);
            padding: 10px 14px;
            border-radius: var(--liquid-radius-large);
          }
        }
        
        /* 动画效果 */
        @keyframes liquidFadeIn {
          from { opacity: 0; transform: translateY(var(--liquid-animation-distance)); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes liquidFadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(var(--liquid-animation-distance)); }
        }
        
        @keyframes liquidPulse {
          0% { transform: scale(1); }
          50% { transform: scale(var(--liquid-animation-scale)); }
          100% { transform: scale(1); }
        }
        
        @keyframes liquidSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes liquidSlideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes liquidScaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes liquidScaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.9); opacity: 0; }
        }
          }

          #rewards-control-panel button {
            background: rgba(60, 60, 60, 0.7);
            color: #f5f5f7;
            border-color: rgba(80, 80, 80, 0.5);
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
          }

          #rewards-control-panel button:hover {
            background: rgba(70, 70, 70, 0.85);
          }

          #rewards-control-panel .titleBar {
            background: rgba(60, 60, 60, 0.3);
            border-bottom-color: rgba(80, 80, 80, 0.5);
          }

          #rewards-control-panel #menu-content {
            background: rgba(60, 60, 60, 0.2);
          }

          #rewards-control-panel span {
            color: #f5f5f7;
          }

          #rewards-control-panel .toggleButton {
            background: rgba(80, 80, 80, 0.3);
            color: #f5f5f7;
          }
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * 更新状态显示 - macOS Liquid Glass风格
     * @param {Object} status - 状态信息
     */
    updateStatusDisplay(status) {
      if (!this.statusDisplay) return;

      const { isRunning, currentCount, targetCount, progress } = status;

      // 根据运行状态设置不同的颜色
      const statusText = isRunning ? '运行中' : '已停止';
      const statusColor = isRunning ? 'var(--liquid-accent-success)' : 'var(--liquid-accent-danger)';

      // 进度条颜色
      const progressBarColor = isRunning ? 'var(--liquid-accent-primary)' : 'var(--liquid-accent-secondary)';

      // 计算下一次任务的倒计时（如果正在运行）
      let countdownHtml = '';
      if (isRunning && status.nextSearchSeconds > 0) {
        countdownHtml = `
        <div style="margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
          <strong style="font-weight: 600; color: var(--liquid-text-primary);">下一次:</strong>
          <span style="
            font-variant-numeric: tabular-nums; 
            color: var(--liquid-text-primary); 
            font-weight: 500;
            background: var(--liquid-bg-tertiary);
            padding: 2px 8px;
            border-radius: var(--liquid-radius-small);
            border: 1px solid var(--liquid-border-light);
          ">${status.nextSearchSeconds}秒</span>
        </div>
        `;
      }

      this.statusDisplay.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <div style="
            width: 8px; 
            height: 8px; 
            border-radius: var(--liquid-radius-pill); 
            background: ${statusColor}; 
            margin-right: 8px;
            box-shadow: 0 0 6px ${statusColor};
          "></div>
          <strong style="font-weight: 600; color: var(--liquid-text-primary);">状态:</strong>
          <span style="margin-left: 6px; color: ${statusColor}; font-weight: 500;">${statusText}</span>
        </div>
        <div style="margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
          <strong style="font-weight: 600; color: var(--liquid-text-primary);">进度:</strong>
          <span style="
            font-variant-numeric: tabular-nums; 
            color: var(--liquid-text-primary); 
            font-weight: 500;
            background: var(--liquid-bg-tertiary);
            padding: 2px 8px;
            border-radius: var(--liquid-radius-small);
            border: 1px solid var(--liquid-border-light);
          ">${currentCount}/${targetCount || '?'}</span>
        </div>
        ${countdownHtml}
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <strong style="font-weight: 600; color: var(--liquid-text-primary);">完成度:</strong>
            <span style="
              font-variant-numeric: tabular-nums; 
              color: var(--liquid-text-primary); 
              font-weight: 500;
            ">${progress}%</span>
          </div>
          <div style="
            height: 6px; 
            width: 100%; 
            background: var(--liquid-bg-tertiary); 
            border-radius: var(--liquid-radius-pill); 
            overflow: hidden;
            border: 1px solid var(--liquid-border-light);
          ">
            <div style="
              height: 100%; 
              width: ${progress}%; 
              background: ${progressBarColor}; 
              border-radius: var(--liquid-radius-pill); 
              transition: width var(--liquid-transition-standard);
              box-shadow: 0 0 8px ${progressBarColor};
            "></div>
          </div>
        </div>
      `;
    }

    /**
     * 显示通知 - macOS Liquid Glass风格
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型 (success, error, warning, info)
     * @param {number} duration - 显示时长(毫秒)
     */
    showNotification(message, type = 'info', duration = 3000) {
      // 移除已存在的通知
      const existing = document.querySelector('.rewards-notification');
      if (existing) {
        existing.remove();
      }

      const notification = document.createElement('div');
      notification.className = `rewards-notification rewards-notification-${type}`;

      // 创建通知内容容器
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'notification-content';
      contentWrapper.textContent = message;

      // 创建图标
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'notification-icon';

      // 根据类型设置图标
      let iconSvg = '';
      switch (type) {
        case 'success':
          iconSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7.25 11.75L3.5 8l1.5-1.5 2.25 2.25 4.75-4.75 1.5 1.5-6.25 6.25z" fill="var(--liquid-accent-green)"/>
          </svg>`;
          break;
        case 'error':
          iconSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM6.5 4.5l5 5-2 2-5-5 2-2zm5 3l-5-5 2-2 5 5-2 2z" fill="var(--liquid-accent-red)"/>
          </svg>`;
          break;
        case 'warning':
          iconSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-3a1 1 0 0 1-1-1V5a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1z" fill="var(--liquid-accent-orange)"/>
          </svg>`;
          break;
        default: // info
          iconSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-8a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1z" fill="var(--liquid-accent-blue)"/>
          </svg>`;
      }

      iconWrapper.innerHTML = iconSvg;

      // 创建关闭按钮
      const closeBtn = document.createElement('button');
      closeBtn.className = 'notification-close';
      closeBtn.innerHTML = '×';
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideNotification(notification);
      });

      // 组装通知
      notification.appendChild(iconWrapper);
      notification.appendChild(contentWrapper);
      notification.appendChild(closeBtn);

      // 设置样式
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--liquid-bg-primary);
        color: var(--liquid-text-primary);
        padding: 12px 16px;
        border-radius: var(--liquid-radius-medium);
        font-family: var(--liquid-font-family);
        font-size: var(--liquid-font-size-medium);
        font-weight: 500;
        z-index: ${CONFIG.UI.MODAL_Z_INDEX + 1};
        box-shadow: 0 8px 30px var(--liquid-shadow-medium), 0 0 1px var(--liquid-shadow-light), inset 0 0 0 1px var(--liquid-border-light);
        max-width: 320px;
        word-wrap: break-word;
        transform: translateX(100%);
        transition: var(--liquid-transition-standard);
        cursor: default;
        backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        -webkit-backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        border: 0.5px solid var(--liquid-border-medium);
        will-change: var(--liquid-will-change-transform), var(--liquid-will-change-filter);
        backface-visibility: var(--liquid-backface-visibility);
        transform: var(--liquid-gpu-acceleration);
        animation: liquidFadeIn var(--liquid-animation-duration) var(--liquid-animation-easing);
      `;

      // 图标样式
      iconWrapper.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      `;

      // 内容样式
      contentWrapper.style.cssText = `
        flex-grow: 1;
        line-height: 1.4;
      `;

      // 关闭按钮样式
      closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: var(--liquid-text-tertiary);
        font-size: 18px;
        line-height: 1;
        padding: 0;
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: var(--liquid-transition-fast);
        margin-left: 4px;
        flex-shrink: 0;
      `;

      // 添加悬停效果
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'var(--liquid-bg-tertiary)';
        closeBtn.style.color = 'var(--liquid-text-primary)';
      });

      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'transparent';
        closeBtn.style.color = 'var(--liquid-text-tertiary)';
      });

      // 根据类型设置边框颜色
      let accentColor;
      switch (type) {
        case 'success': accentColor = 'var(--liquid-accent-green)'; break;
        case 'error': accentColor = 'var(--liquid-accent-red)'; break;
        case 'warning': accentColor = 'var(--liquid-accent-orange)'; break;
        default: accentColor = 'var(--liquid-accent-blue)'; // info
      }

      notification.style.borderLeft = `3px solid ${accentColor}`;

      document.body.appendChild(notification);

      // 显示动画
      notification.style.animation = 'liquidSlideIn var(--liquid-animation-duration) var(--liquid-animation-easing) forwards';
      notification.style.transform = 'translateX(0)';

      // 点击通知区域关闭
      notification.addEventListener('click', () => {
        this.hideNotification(notification);
      });

      // 自动隐藏
      if (duration > 0) {
        setTimeout(() => {
          this.hideNotification(notification);
        }, duration);
      }
    }

    /**
     * 隐藏通知 - macOS Liquid Glass风格
     * @param {HTMLElement} notification - 通知元素
     */
    hideNotification(notification) {
      if (notification && notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        notification.style.animation = 'liquidSlideOut var(--liquid-animation-duration) var(--liquid-animation-easing)';

        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--liquid-animation-duration')) || 300);
      }
    }

    /**
     * 处理启动搜索
     * @returns {Promise<void>}
     */
    async handleStartSearch() {
      try {
        // 强化重复启动保护
        if (window.rewardsExecutor && window.rewardsExecutor.isRunning) {
          console.warn('[UIManager] 搜索任务已在运行中，忽略重复启动请求');
          this.showNotification('搜索任务已在运行中，请勿重复启动', 'warning');
          return;
        }

        // 清理之前的实例
        if (window.rewardsExecutor) {
          console.log('[UIManager] 清理之前的搜索执行器实例');
          window.rewardsExecutor.stop();
          window.rewardsExecutor = null;
          // 等待一小段时间确保旧任务完全停止
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 显示搜索次数选择对话框
        const targetCount = await SearchCountSelector.showQuickSelection();

        // 如果用户点击了取消按钮或按了ESC键
        if (targetCount === null) {
          console.log('[UIManager] 用户取消了搜索');
          return;
        }

        console.log(`[UIManager] 创建新的搜索执行器，目标搜索次数: ${targetCount}`);

        // 创建新的搜索执行器（单例模式）
        const executor = new SearchExecutor(targetCount);
        await executor.initialize();

        // 检查是否已完成
        if (executor.isCompleted()) {
          this.showNotification('今日搜索任务已完成！', 'success');
          return;
        }

        // 先保存执行器实例，再启动任务
        window.rewardsExecutor = executor;
        window.uiManager = this;

        // 开始搜索
        await executor.start();

        // 更新状态显示
        this.updateStatusDisplay(executor.getStatus());

        this.showNotification(`开始执行${targetCount}次搜索任务`, 'success');
        console.log(`[UIManager] 搜索任务启动成功，目标次数: ${targetCount}`);

      } catch (error) {
        console.error('[UIManager] 启动搜索失败:', error);
        this.showNotification('启动搜索失败: ' + error.message, 'error');

        // 清理失败的实例
        if (window.rewardsExecutor) {
          window.rewardsExecutor.stop();
          window.rewardsExecutor = null;
        }
      }
    }

    /**
     * 处理停止搜索
     */
    handleStopSearch() {
      if (window.rewardsExecutor) {
        window.rewardsExecutor.stop();
        this.updateStatusDisplay(window.rewardsExecutor.getStatus());
        this.showNotification('搜索任务已停止', 'warning');
      } else {
        this.showNotification('没有正在运行的搜索任务', 'info');
      }
    }

    /**
     * 处理重置进度
     */
    async handleResetProgress() {
      try {
        // 使用自定义确认对话框替代原生confirm
        this.showConfirmDialog(
          '确定要重置今日搜索进度吗？',
          async () => {
            if (window.rewardsExecutor) {
              await window.rewardsExecutor.resetProgress();
              this.updateStatusDisplay(window.rewardsExecutor.getStatus());
            } else {
              StorageManager.clearTodayProgress();
            }

            this.showNotification('进度已重置，正在跳转...', 'success');

            // 重定向到搜索页面，使用当前时间作为查询参数
            setTimeout(() => {
              const currentTime = new Date().toLocaleString('zh-CN');
              const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(currentTime)}`;
              window.location.href = searchUrl;
            }, 1000);
          }
        );
      } catch (error) {
        console.error('[UIManager] 重置进度失败:', error);
        this.showNotification('重置失败: ' + error.message, 'error');
      }
    }

    /**
     * 显示确认对话框
     * @param {string} message - 确认消息
     * @param {Function} onConfirm - 确认回调
     * @param {Function} onCancel - 取消回调
     */
    showConfirmDialog(message, onConfirm, onCancel = null) {
      // 创建遮罩层
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--liquid-overlay-bg);
        z-index: ${CONFIG.UI.MODAL_Z_INDEX};
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity var(--liquid-transition-standard);
        backdrop-filter: blur(var(--liquid-blur-light));
        -webkit-backdrop-filter: blur(var(--liquid-blur-light));
      `;

      // 创建对话框
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        background: var(--liquid-bg-primary);
        border-radius: var(--liquid-radius-large);
        padding: 24px;
        max-width: 400px;
        width: 80%;
        margin: 0 auto;
        box-shadow: 0 8px 32px var(--liquid-shadow-medium), inset 0 0 0 1px var(--liquid-border-light);
        transform: scale(0.9);
        transition: all var(--liquid-transition-standard);
        backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        -webkit-backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        border: 1px solid var(--liquid-border-light);
        font-family: var(--liquid-font-family);
        will-change: var(--liquid-will-change-transform), var(--liquid-will-change-filter);
        backface-visibility: var(--liquid-backface-visibility);
        transform: var(--liquid-gpu-acceleration);
        animation: liquidScaleIn var(--liquid-animation-duration) var(--liquid-animation-easing) forwards;
      `;

      // 创建图标和内容
      const iconType = 'question';
      const iconColor = 'var(--liquid-accent-primary)';
      const iconSvg = this.getIconSvg(iconType, iconColor);

      dialog.innerHTML = `
        <div style="display: flex; align-items: flex-start; margin-bottom: 20px; padding: 0 5px;">
          <div style="margin-right: 16px; flex-shrink: 0;">${iconSvg}</div>
          <div style="flex-grow: 1; font-size: var(--liquid-font-size-medium); color: var(--liquid-text-primary); line-height: 1.5;">${message}</div>
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="cancel-btn" style="
            padding: 10px 16px;
            border: 1px solid var(--liquid-border-light);
            background: rgba(255, 255, 255, 0.1);
            color: var(--liquid-text-primary);
            border-radius: var(--liquid-radius-medium);
            cursor: pointer;
            font-size: var(--liquid-font-size-medium);
            font-weight: 500;
            font-family: var(--liquid-font-family);
            transition: var(--liquid-transition-standard);
            box-shadow: var(--liquid-shadow-light);
            backdrop-filter: blur(var(--liquid-blur-light));
            -webkit-backdrop-filter: blur(var(--liquid-blur-light));
          ">取消</button>
          <button class="confirm-btn" style="
            padding: 10px 16px;
            border: none;
            background: var(--liquid-accent-primary);
            color: white;
            border-radius: var(--liquid-radius-medium);
            cursor: pointer;
            font-size: var(--liquid-font-size-medium);
            font-weight: 500;
            font-family: var(--liquid-font-family);
            transition: var(--liquid-transition-standard);
            box-shadow: var(--liquid-shadow-light);
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(var(--liquid-blur-light));
            -webkit-backdrop-filter: blur(var(--liquid-blur-light));
          ">确定</button>
        </div>
      `;

      // 为按钮添加悬停效果
      const confirmBtn = dialog.querySelector('.confirm-btn');
      const cancelBtn = dialog.querySelector('.cancel-btn');

      // 添加按钮悬停和离开效果
      const addButtonHoverEffects = (button, isConfirm) => {
        button.addEventListener('mouseenter', () => {
          button.style.transform = 'translateY(-2px)';
          button.style.boxShadow = '0 4px 12px var(--liquid-shadow-medium), 0 0 1px var(--liquid-shadow-light), inset 0 0 0 0.5px var(--liquid-border-light)';
          if (isConfirm) {
            button.style.filter = 'brightness(1.1)';
          } else {
            button.style.background = 'rgba(255, 255, 255, 0.2)';
          }
        });

        button.addEventListener('mouseleave', () => {
          button.style.transform = 'translateY(0)';
          button.style.boxShadow = 'var(--liquid-shadow-light)';
          if (isConfirm) {
            button.style.filter = 'brightness(1)';
          } else {
            button.style.background = 'rgba(255, 255, 255, 0.1)';
          }
        });

        button.addEventListener('mousedown', () => {
          button.style.transform = 'translateY(0) scale(0.98)';
          button.style.boxShadow = 'var(--liquid-shadow-light), inset 0 1px 2px var(--liquid-shadow-medium)';
          if (isConfirm) {
            button.style.filter = 'brightness(0.95)';
          }
        });

        button.addEventListener('mouseup', () => {
          button.style.transform = 'translateY(-2px) scale(1)';
          button.style.boxShadow = '0 4px 12px var(--liquid-shadow-medium), 0 0 1px var(--liquid-shadow-light), inset 0 0 0 0.5px var(--liquid-border-light)';
          if (isConfirm) {
            button.style.filter = 'brightness(1.1)';
          }
        });
      };

      // 应用按钮效果
      addButtonHoverEffects(confirmBtn, true);
      addButtonHoverEffects(cancelBtn, false);

      const closeDialog = () => {
        overlay.style.opacity = '0';
        dialog.style.animation = 'liquidScaleOut var(--liquid-animation-duration) var(--liquid-animation-easing) forwards';
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--liquid-animation-duration')) || 300);
      };

      confirmBtn.addEventListener('click', () => {
        closeDialog();
        if (onConfirm) onConfirm();
      });

      cancelBtn.addEventListener('click', () => {
        closeDialog();
        if (onCancel) onCancel();
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeDialog();
          if (onCancel) onCancel();
        }
      });

      // 显示对话框
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      setTimeout(() => {
        overlay.style.opacity = '1';
        dialog.style.transform = 'scale(1)';
        dialog.style.opacity = '1';
      }, 10);
    }

    /**
     * 处理立即搜索
     */
    async handleImmediateSearch() {
      try {
        if (window.rewardsExecutor) {
          await window.rewardsExecutor.executeImmediateSearch();
          this.updateStatusDisplay(window.rewardsExecutor.getStatus());
          this.showNotification('立即搜索已执行', 'success');
        } else {
          this.showNotification('请先启动搜索任务', 'warning');
        }
      } catch (error) {
        console.error('[UIManager] 立即搜索失败:', error);
        this.showNotification('立即搜索失败: ' + error.message, 'error');
      }
    }

    /**
     * 处理查看搜索词
     */
    async handleViewSearchWords() {
      try {
        // 获取当前搜索词列表
        const hotWords = await HotWordsManager.getHotWords();

        if (!hotWords || hotWords.length === 0) {
          this.showNotification('暂无搜索词数据，请稍后重试', 'warning');
          return;
        }

        this.showSearchWordsDialog(hotWords);
      } catch (error) {
        console.error('[UIManager] 获取搜索词失败:', error);
        this.showNotification('获取搜索词失败: ' + error.message, 'error');
      }
    }

    /**
     * 处理显示设置面板
     */
    handleShowSettings() {
      this.showSettingsPanel();
    }

    /**
     * 显示设置面板
     */
    showSettingsPanel() {
      // 加载当前设置
      this.loadSettings();

      // 创建遮罩层
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        z-index: ${CONFIG.UI.MODAL_Z_INDEX};
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity var(--liquid-transition-standard);
        backdrop-filter: blur(var(--liquid-blur-light));
        -webkit-backdrop-filter: blur(var(--liquid-blur-light));
      `;

      // 创建设置面板
      const panel = document.createElement('div');
      panel.style.cssText = `
        background: var(--liquid-bg-primary);
        border-radius: var(--liquid-radius-large);
        box-shadow: 0 20px 60px var(--liquid-shadow-heavy), inset 0 0 0 1px var(--liquid-border-light);
        max-width: 480px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        -webkit-backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        border: 1px solid var(--liquid-border-light);
        transform: scale(0.9);
        opacity: 0;
        transition: var(--liquid-transition-standard);
        will-change: var(--liquid-will-change-transform), var(--liquid-will-change-filter);
        backface-visibility: var(--liquid-backface-visibility);
        perspective: var(--liquid-perspective);
      `;

      // 创建标题栏
      const header = document.createElement('div');
      header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid var(--liquid-border-medium);
        background: var(--liquid-bg-tertiary);
        border-top-left-radius: var(--liquid-radius-large);
        border-top-right-radius: var(--liquid-radius-large);
      `;

      const title = document.createElement('h3');
      title.textContent = '设置选项';
      title.style.cssText = `
        margin: 0;
        font-size: var(--liquid-font-size-large);
        font-weight: 600;
        color: var(--liquid-text-primary);
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);
      `;

      // 创建关闭按钮
      const closeButton = document.createElement('button');
      closeButton.textContent = '×';
      closeButton.style.cssText = `
        background: transparent;
        border: none;
        color: var(--liquid-text-tertiary);
        font-size: 24px;
        line-height: 1;
        padding: 0;
        width: 32px;
        height: 32px;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--liquid-transition-fast);
      `;

      closeButton.addEventListener('mouseenter', () => {
        closeButton.style.background = 'var(--liquid-bg-tertiary)';
        closeButton.style.color = 'var(--liquid-text-primary)';
      });

      closeButton.addEventListener('mouseleave', () => {
        closeButton.style.background = 'transparent';
        closeButton.style.color = 'var(--liquid-text-tertiary)';
      });

      closeButton.addEventListener('click', () => {
        this.closeSettingsPanel(overlay);
      });

      header.appendChild(title);
      header.appendChild(closeButton);

      // 创建内容区域
      const content = document.createElement('div');
      content.style.cssText = `
        padding: 24px;
        max-height: 60vh;
        overflow-y: auto;
      `;

      // 创建设置项
      content.appendChild(this.createSettingsContent());

      panel.appendChild(header);
      panel.appendChild(content);
      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      // 显示动画
      setTimeout(() => {
        overlay.style.opacity = '1';
        panel.style.transform = 'scale(1)';
        panel.style.opacity = '1';
      }, 10);

      // 点击遮罩关闭
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeSettingsPanel(overlay);
        }
      });
    }

    /**
     * 关闭设置面板
     * @param {HTMLElement} overlay - 遮罩层元素
     */
    closeSettingsPanel(overlay) {
      const panel = overlay.querySelector('div');

      // 关闭动画
      overlay.style.opacity = '0';
      panel.style.transform = 'scale(0.9)';
      panel.style.opacity = '0';

      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }

    /**
     * 创建设置内容
     * @returns {HTMLElement} 设置内容元素
     */
    createSettingsContent() {
      const container = document.createElement('div');
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 20px;
      `;

      // 搜索间隔设置
      container.appendChild(this.createIntervalSetting());

      // 自适应间隔设置
      container.appendChild(this.createAdaptiveIntervalSetting());

      // 调试模式设置
      container.appendChild(this.createDebugSetting());

      // 缓存管理
      container.appendChild(this.createCacheManagement());

      return container;
    }

    /**
     * 创建搜索间隔设置
     * @returns {HTMLElement} 间隔设置元素
     */
    createIntervalSetting() {
      const section = this.createSettingSection('搜索间隔', '调整搜索间隔时间（秒）');

      const inputContainer = document.createElement('div');
      inputContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 12px;
        flex-wrap: wrap;
      `;

      // 移动端适配样式
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      const updateContainerStyle = () => {
        if (mediaQuery.matches) {
          // 移动端：垂直布局，更大的间距和触摸友好的尺寸
          inputContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            margin-top: 16px;
          `;
        } else {
          // 桌面端：水平布局，紧凑排列
          inputContainer.style.cssText = `
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 16px;
            margin-top: 12px;
            flex-wrap: nowrap;
          `;
        }
      };
      updateContainerStyle();
      mediaQuery.addListener(updateContainerStyle);

      // 创建输入组容器（移动端优化）
      const createInputGroup = (labelText, input) => {
        const group = document.createElement('div');
        const updateGroupStyle = () => {
          if (mediaQuery.matches) {
            // 移动端：垂直布局，标签在上方
            group.style.cssText = `
              display: flex;
              flex-direction: column;
              gap: 8px;
            `;
          } else {
            // 桌面端：水平布局，紧凑间距
            group.style.cssText = `
              display: flex;
              align-items: center;
              gap: 6px;
              flex-shrink: 0;
            `;
          }
        };
        updateGroupStyle();
        mediaQuery.addListener(updateGroupStyle);

        const label = document.createElement('label');
        label.textContent = labelText;
        const updateLabelStyle = () => {
          if (mediaQuery.matches) {
            // 移动端：更大的字体，更明显的标签
            label.style.cssText = `
              font-size: var(--liquid-font-size-medium);
              color: var(--liquid-text-primary);
              font-weight: 500;
            `;
          } else {
            // 桌面端：紧凑样式，固定宽度
            label.style.cssText = `
              font-size: var(--liquid-font-size-small);
              color: var(--liquid-text-secondary);
              min-width: 36px;
              white-space: nowrap;
              flex-shrink: 0;
            `;
          }
        };
        updateLabelStyle();
        mediaQuery.addListener(updateLabelStyle);

        group.appendChild(label);
        group.appendChild(input);
        return group;
      };

      // 最小间隔输入

      const minInput = document.createElement('input');
      minInput.type = 'number';
      minInput.min = '1';
      minInput.max = '60';
      minInput.value = CONFIG.SEARCH.MIN_INTERVAL / 1000;

      const updateMinInputStyle = () => {
        if (mediaQuery.matches) {
          // 移动端：更大的触摸目标，全宽度
          minInput.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--liquid-border-light);
            border-radius: var(--liquid-radius-medium);
            background: var(--liquid-bg-primary);
            color: var(--liquid-text-primary);
            font-size: var(--liquid-font-size-medium);
            transition: var(--liquid-transition-fast);
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
            outline: none;
            min-height: 44px;
            box-sizing: border-box;
          `;
        } else {
          // 桌面端：紧凑样式
          minInput.style.cssText = `
            width: 80px;
            padding: 8px 12px;
            border: 2px solid var(--liquid-border-light);
            border-radius: var(--liquid-radius-medium);
            background: var(--liquid-bg-primary);
            color: var(--liquid-text-primary);
            font-size: var(--liquid-font-size-small);
            transition: var(--liquid-transition-fast);
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
            outline: none;
          `;
        }
      };
      updateMinInputStyle();
      mediaQuery.addListener(updateMinInputStyle);

      // 添加输入框焦点效果（移动端优化：减弱蓝色边框）
      minInput.addEventListener('focus', () => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        if (mediaQuery.matches) {
          // 移动端：更柔和的焦点效果
          minInput.style.borderColor = 'rgba(0, 122, 255, 0.6)';
          minInput.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 122, 255, 0.1)';
        } else {
          // 桌面端：保持原有效果
          minInput.style.borderColor = 'var(--liquid-accent-primary)';
          minInput.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(0, 122, 255, 0.2)';
        }
      });

      minInput.addEventListener('blur', () => {
        minInput.style.borderColor = 'var(--liquid-border-light)';
        minInput.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
      });

      // 最大间隔输入

      const maxInput = document.createElement('input');
      maxInput.type = 'number';
      maxInput.min = '2';
      maxInput.max = '120';
      maxInput.value = CONFIG.SEARCH.MAX_INTERVAL / 1000;

      const updateMaxInputStyle = () => {
        if (mediaQuery.matches) {
          // 移动端：更大的触摸目标，全宽度
          maxInput.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--liquid-border-light);
            border-radius: var(--liquid-radius-medium);
            background: var(--liquid-bg-primary);
            color: var(--liquid-text-primary);
            font-size: var(--liquid-font-size-medium);
            transition: var(--liquid-transition-fast);
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
            outline: none;
            min-height: 44px;
            box-sizing: border-box;
          `;
        } else {
          // 桌面端：紧凑样式
          maxInput.style.cssText = `
            width: 80px;
            padding: 8px 12px;
            border: 2px solid var(--liquid-border-light);
            border-radius: var(--liquid-radius-medium);
            background: var(--liquid-bg-primary);
            color: var(--liquid-text-primary);
            font-size: var(--liquid-font-size-small);
            transition: var(--liquid-transition-fast);
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
            outline: none;
          `;
        }
      };
      updateMaxInputStyle();
      mediaQuery.addListener(updateMaxInputStyle);

      // 添加输入框焦点效果（移动端优化：减弱蓝色边框）
      maxInput.addEventListener('focus', () => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        if (mediaQuery.matches) {
          // 移动端：更柔和的焦点效果
          maxInput.style.borderColor = 'rgba(0, 122, 255, 0.6)';
          maxInput.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 122, 255, 0.1)';
        } else {
          // 桌面端：保持原有效果
          maxInput.style.borderColor = 'var(--liquid-accent-primary)';
          maxInput.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(0, 122, 255, 0.2)';
        }
      });

      maxInput.addEventListener('blur', () => {
        maxInput.style.borderColor = 'var(--liquid-border-light)';
        maxInput.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
      });

      // 保存按钮
      const saveButton = this.createButton('保存', '#007AFF', () => {
        const minInputValue = parseInt(minInput.value);
        const maxInputValue = parseInt(maxInput.value);

        // 验证输入值是否为有效数字
        if (isNaN(minInputValue) || isNaN(maxInputValue)) {
          this.showNotification('请输入有效的数字', 'error');
          return;
        }

        // 验证输入范围
        if (minInputValue < 1 || minInputValue > 60) {
          this.showNotification('最小间隔必须在1-60秒之间', 'error');
          return;
        }

        if (maxInputValue < 2 || maxInputValue > 120) {
          this.showNotification('最大间隔必须在2-120秒之间', 'error');
          return;
        }

        const minValue = minInputValue * 1000;
        const maxValue = maxInputValue * 1000;

        if (minValue >= maxValue) {
          this.showNotification('最小间隔必须小于最大间隔', 'error');
          return;
        }

        // 更新全局配置
        CONFIG.SEARCH.MIN_INTERVAL = minValue;
        CONFIG.SEARCH.MAX_INTERVAL = maxValue;

        // 更新自适应间隔配置
        CONFIG.ADAPTIVE_INTERVAL.MIN_INTERVAL = minValue;
        CONFIG.ADAPTIVE_INTERVAL.MAX_INTERVAL = maxValue;

        // 保存到本地存储
        this.saveSetting('searchInterval', { min: minValue, max: maxValue });

        // 立即应用新设置到正在运行的任务
        if (window.rewardsExecutor && window.rewardsExecutor.adaptiveInterval) {
          console.log('[UIManager] 立即应用新的延迟设置到当前任务');
          window.rewardsExecutor.adaptiveInterval.config.MIN_INTERVAL = minValue;
          window.rewardsExecutor.adaptiveInterval.config.MAX_INTERVAL = maxValue;

          // 如果任务正在运行，重新计算下一次搜索间隔
          if (window.rewardsExecutor.isRunning) {
            console.log('[UIManager] 任务正在运行，将在下次搜索时应用新间隔');
            this.showNotification(`搜索间隔已更新为 ${minValue / 1000}-${maxValue / 1000} 秒，将在下次搜索时生效`, 'success');
          } else {
            this.showNotification(`搜索间隔已更新为 ${minValue / 1000}-${maxValue / 1000} 秒`, 'success');
          }
        } else {
          this.showNotification(`搜索间隔已保存为 ${minValue / 1000}-${maxValue / 1000} 秒，将在下次启动时生效`, 'success');
        }
      });

      // 创建标签和输入组（响应式布局）
      const minGroup = createInputGroup('最小间隔 (秒):', minInput);
      const maxGroup = createInputGroup('最大间隔 (秒):', maxInput);

      // PC端简化标签文本
      const updateGroupLabels = () => {
        const minLabel = minGroup.querySelector('label');
        const maxLabel = maxGroup.querySelector('label');
        if (mediaQuery.matches) {
          // 移动端：完整标签
          minLabel.textContent = '最小间隔 (秒):';
          maxLabel.textContent = '最大间隔 (秒):';
        } else {
          // PC端：简化标签
          minLabel.textContent = '最小:';
          maxLabel.textContent = '最大:';
        }
      };
      updateGroupLabels();
      mediaQuery.addListener(updateGroupLabels);

      // 优化保存按钮的响应式样式（移动端与PC端保持统一）
      const updateSaveButtonStyle = () => {
        if (mediaQuery.matches) {
          // 移动端：与PC端保持统一的样式，仅调整尺寸适配触摸
          saveButton.style.width = '100%';
          saveButton.style.minHeight = '44px';
          saveButton.style.marginTop = '8px';
          saveButton.style.padding = '12px 16px';
        } else {
          // 桌面端：恢复默认样式
          saveButton.style.width = 'auto';
          saveButton.style.minHeight = 'auto';
          saveButton.style.fontSize = 'var(--liquid-font-size-small)';
          saveButton.style.fontWeight = '500';
          saveButton.style.marginTop = '0';
        }
      };
      updateSaveButtonStyle();
      mediaQuery.addListener(updateSaveButtonStyle);

      inputContainer.appendChild(minGroup);
      inputContainer.appendChild(maxGroup);
      inputContainer.appendChild(saveButton);

      section.appendChild(inputContainer);
      return section;
    }

    /**
     * 创建自适应间隔设置
     * @returns {HTMLElement} 自适应间隔设置元素
     */
    createAdaptiveIntervalSetting() {
      const section = this.createSettingSection('自适应间隔', '根据网络状况和搜索成功率自动调整搜索间隔');

      const switchContainer = document.createElement('div');
      switchContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
      `;

      const label = document.createElement('span');
      label.textContent = '启用自适应间隔';
      label.style.cssText = `
        font-size: var(--liquid-font-size-medium);
        color: var(--liquid-text-primary);
      `;

      // 创建开关
      const toggle = this.createToggleSwitch(CONFIG.ADAPTIVE_INTERVAL.ENABLED, (enabled) => {
        CONFIG.ADAPTIVE_INTERVAL.ENABLED = enabled;
        this.saveSetting('adaptiveIntervalEnabled', enabled);
        this.showNotification(`自适应间隔已${enabled ? '开启' : '关闭'}`, 'success');
      });

      switchContainer.appendChild(label);
      switchContainer.appendChild(toggle);
      section.appendChild(switchContainer);

      return section;
    }

    /**
     * 创建调试模式设置
     * @returns {HTMLElement} 调试设置元素
     */
    createDebugSetting() {
      const section = this.createSettingSection('调试模式', '开启后将显示详细的运行日志');

      const switchContainer = document.createElement('div');
      switchContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
      `;

      const label = document.createElement('span');
      label.textContent = '启用调试模式';
      label.style.cssText = `
        font-size: var(--liquid-font-size-medium);
        color: var(--liquid-text-primary);
      `;

      // 创建开关
      const toggle = this.createToggleSwitch(CONFIG.DEBUG, (enabled) => {
        CONFIG.DEBUG = enabled;
        this.saveSetting('debugMode', enabled);

        // 立即初始化或移除控制台
        if (enabled) {
          // 获取全局app实例并启用调试控制台
          if (window.app && typeof window.app.enableMobileDebug === 'function') {
            window.app.enableMobileDebug();
          }
        } else {
          // 移除调试控制台
          this.removeMobileDebug();
        }

        this.showNotification(`调试模式已${enabled ? '开启' : '关闭'}`, 'success');
      });

      switchContainer.appendChild(label);
      switchContainer.appendChild(toggle);
      section.appendChild(switchContainer);

      return section;
    }

    /**
     * 创建缓存管理
     * @returns {HTMLElement} 缓存管理元素
     */
    createCacheManagement() {
      const section = this.createSettingSection('缓存管理', '管理本地缓存数据');

      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 12px;
        margin-top: 12px;
        flex-wrap: wrap;
      `;

      // 刷新热搜词
      const refreshHotWordsButton = this.createButton('刷新热搜词', '#007AFF', async () => {
        try {
          this.showNotification('正在强制刷新热搜词...', 'info');
          const newHotWords = await HotWordsManager.refreshHotWords();
          AppState.hotWords = newHotWords;
          this.showNotification(`热搜词已强制刷新，获取到 ${newHotWords.length} 个词`, 'success');
        } catch (error) {
          console.error('[刷新热搜词失败]', error);
          this.showNotification('刷新热搜词失败: ' + error.message, 'error');
        }
      });

      // 清除所有缓存
      const clearAllButton = this.createButton('清除所有缓存', '#FF3B30', () => {
        if (confirm('确定要清除所有缓存数据吗？此操作不可恢复，页面将自动刷新。')) {
          try {
            // 清除今日搜索计数（所有日期）
            const today = new Date();
            for (let i = 0; i < 30; i++) { // 清除过去30天的数据
              const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
              const dateKey = CONFIG.STORAGE.TODAY_COUNT_KEY + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate();
              StorageManager.setValue(dateKey, undefined);
            }

            // 清除热搜词缓存
            StorageManager.setValue(CONFIG.STORAGE.HOT_WORDS_KEY, undefined);

            // 清除用户设置
            StorageManager.setValue('searchInterval', undefined);
            StorageManager.setValue('adaptiveIntervalEnabled', undefined);
            StorageManager.setValue('debugMode', undefined);

            // 清除其他可能的缓存键
            StorageManager.setValue('todaySearchCount', undefined);
            StorageManager.setValue('hotWordsCache', undefined);

            // 重置应用状态
            AppState.todaySearchCount = 0;
            AppState.hotWords = [];
            AppState.isRunning = false;
            AppState.currentCount = 0;

            // 重置配置到默认值
            CONFIG.ADAPTIVE_INTERVAL.ENABLED = true;
            CONFIG.DEBUG = false;
            CONFIG.SEARCH.MIN_INTERVAL = 1000;
            CONFIG.SEARCH.MAX_INTERVAL = 120000;
            CONFIG.ADAPTIVE_INTERVAL.MIN_INTERVAL = 1000;
            CONFIG.ADAPTIVE_INTERVAL.MAX_INTERVAL = 120000;

            this.showNotification('所有缓存已清除，页面即将刷新', 'success');

            // 延迟刷新页面，让用户看到通知
            setTimeout(() => {
              location.reload();
            }, 1500);
          } catch (error) {
            console.error('[清除缓存失败]', error);
            this.showNotification('清除缓存时发生错误: ' + error.message, 'error');
          }
        }
      });

      buttonContainer.appendChild(refreshHotWordsButton);
      buttonContainer.appendChild(clearAllButton);
      section.appendChild(buttonContainer);

      return section;
    }

    /**
     * 创建设置区块
     * @param {string} title - 标题
     * @param {string} description - 描述
     * @returns {HTMLElement} 设置区块元素
     */
    createSettingSection(title, description) {
      const section = document.createElement('div');
      section.style.cssText = `
        padding: 20px;
        background: var(--liquid-bg-secondary);
        border-radius: var(--liquid-radius-medium);
        border: 1px solid var(--liquid-border-light);
        backdrop-filter: blur(var(--liquid-blur-light));
        -webkit-backdrop-filter: blur(var(--liquid-blur-light));
      `;

      const titleElement = document.createElement('h4');
      titleElement.textContent = title;
      titleElement.style.cssText = `
        margin: 0 0 8px 0;
        font-size: var(--liquid-font-size-medium);
        font-weight: 600;
        color: var(--liquid-text-primary);
      `;

      const descElement = document.createElement('p');
      descElement.textContent = description;
      descElement.style.cssText = `
        margin: 0;
        font-size: var(--liquid-font-size-small);
        color: var(--liquid-text-secondary);
        line-height: 1.4;
      `;

      section.appendChild(titleElement);
      section.appendChild(descElement);

      return section;
    }

    /**
     * 创建开关组件
     * @param {boolean} checked - 是否选中
     * @param {Function} onChange - 变化回调
     * @returns {HTMLElement} 开关元素
     */
    createToggleSwitch(checked, onChange) {
      const container = document.createElement('div');
      container.style.cssText = `
        position: relative;
        width: 50px;
        height: 28px;
        background: ${checked ? 'var(--liquid-accent-primary)' : 'rgba(120, 120, 128, 0.32)'};
        border-radius: 14px;
        cursor: pointer;
        transition: var(--liquid-transition-fast);
        border: 2px solid ${checked ? 'var(--liquid-accent-primary)' : 'var(--liquid-border-light)'};
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
        outline: none;
      `;

      const thumb = document.createElement('div');
      thumb.style.cssText = `
        position: absolute;
        top: 2px;
        left: ${checked ? '22px' : '2px'};
        width: 22px;
        height: 22px;
        background: white;
        border-radius: 50%;
        transition: var(--liquid-transition-fast);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.04);
      `;

      container.appendChild(thumb);

      // 添加悬停效果
      container.addEventListener('mouseenter', () => {
        container.style.transform = 'scale(1.02)';
        container.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.15)';
      });

      container.addEventListener('mouseleave', () => {
        container.style.transform = 'scale(1)';
        container.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)';
      });

      container.addEventListener('click', () => {
        const newChecked = !checked;
        checked = newChecked;

        container.style.background = newChecked ? 'var(--liquid-accent-primary)' : 'rgba(120, 120, 128, 0.32)';
        container.style.borderColor = newChecked ? 'var(--liquid-accent-primary)' : 'var(--liquid-border-light)';
        thumb.style.left = newChecked ? '22px' : '2px';

        onChange(newChecked);
      });

      return container;
    }

    /**
     * 加载设置
     */
    loadSettings() {
      try {
        // 加载搜索间隔设置
        const intervalSettings = StorageManager.getValue('searchInterval');
        if (intervalSettings) {
          // 同时更新搜索配置和自适应间隔配置
          CONFIG.SEARCH.MIN_INTERVAL = intervalSettings.min || CONFIG.SEARCH.MIN_INTERVAL;
          CONFIG.SEARCH.MAX_INTERVAL = intervalSettings.max || CONFIG.SEARCH.MAX_INTERVAL;
          CONFIG.ADAPTIVE_INTERVAL.MIN_INTERVAL = intervalSettings.min || CONFIG.ADAPTIVE_INTERVAL.MIN_INTERVAL;
          CONFIG.ADAPTIVE_INTERVAL.MAX_INTERVAL = intervalSettings.max || CONFIG.ADAPTIVE_INTERVAL.MAX_INTERVAL;
        }

        // 加载自适应间隔开关设置
        const adaptiveIntervalEnabled = StorageManager.getValue('adaptiveIntervalEnabled');
        if (adaptiveIntervalEnabled !== null) {
          CONFIG.ADAPTIVE_INTERVAL.ENABLED = adaptiveIntervalEnabled;
        }

        // 加载调试模式设置
        const debugMode = StorageManager.getValue('debugMode');
        if (debugMode !== null) {
          CONFIG.DEBUG = debugMode;
        }

        console.log('[UIManager] 设置加载完成:', {
          searchMinInterval: CONFIG.SEARCH.MIN_INTERVAL,
          searchMaxInterval: CONFIG.SEARCH.MAX_INTERVAL,
          adaptiveMinInterval: CONFIG.ADAPTIVE_INTERVAL.MIN_INTERVAL,
          adaptiveMaxInterval: CONFIG.ADAPTIVE_INTERVAL.MAX_INTERVAL,
          adaptiveIntervalEnabled: CONFIG.ADAPTIVE_INTERVAL.ENABLED,
          debugMode: CONFIG.DEBUG,
        });
      } catch (error) {
        console.error('[UIManager] 加载设置失败:', error);
      }
    }

    /**
     * 保存设置
     * @param {string} key - 设置键
     * @param {*} value - 设置值
     */
    saveSetting(key, value) {
      try {
        StorageManager.setValue(key, value);
        console.log(`[UIManager] 设置已保存: ${key} =`, value);
      } catch (error) {
        console.error(`[UIManager] 保存设置失败 ${key}:`, error);
        throw error;
      }
    }

    /**
     * 显示搜索词弹窗
     * @param {Array} words - 搜索词数组
     * @param {string} [wordType='热搜词'] - 词汇类型
     */
    showSearchWordsDialog(words, wordType = '热搜词') {
      // 创建遮罩层
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        z-index: ${CONFIG.UI.MODAL_Z_INDEX};
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity var(--liquid-transition-standard);
        backdrop-filter: blur(var(--liquid-blur-light));
        -webkit-backdrop-filter: blur(var(--liquid-blur-light));
      `;

      // 创建对话框
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        background: var(--liquid-bg-primary);
        border-radius: var(--liquid-radius-large);
        padding: 0;
        max-width: 600px;
        width: 80%;
        margin: 0 auto;
        box-shadow: 0 12px 36px var(--liquid-shadow-heavy), inset 0 0 0 1px var(--liquid-border-light);
        transform: scale(0.9);
        transition: transform var(--liquid-transition-standard);
        overflow: hidden;
        backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        -webkit-backdrop-filter: blur(var(--liquid-blur-standard)) saturate(180%);
        border: 1px solid var(--liquid-border-light);
        will-change: var(--liquid-will-change-transform), var(--liquid-will-change-filter);
        backface-visibility: var(--liquid-backface-visibility);
        transform: var(--liquid-gpu-acceleration);
      `;

      // 创建标题栏
      const header = document.createElement('div');
      header.className = 'search-words-header';
      header.style.cssText = `
        background: var(--liquid-bg-secondary);
        color: var(--liquid-text-primary);
        padding: 20px 24px;
        font-size: var(--liquid-font-size-large);
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--liquid-border-medium);
        text-shadow: 0 1px 1px var(--liquid-shadow-light);
      `;
      header.innerHTML = `
        <span>当前搜索词列表 (共 ${words.length} 个)</span>
        <button class="close-btn" style="
          background: var(--liquid-bg-tertiary);
          border: none;
          color: var(--liquid-text-primary);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--liquid-transition-fast);
          backdrop-filter: blur(var(--liquid-blur-light));
          -webkit-backdrop-filter: blur(var(--liquid-blur-light));
          border: 1px solid var(--liquid-border-light);
          box-shadow: 0 2px 6px var(--liquid-shadow-light);
          padding: 0;
          line-height: 1;
          text-align: center;
        ">×</button>
      `;

      // 创建内容区域
      const content = document.createElement('div');
      content.style.cssText = `
        padding: 24px;
        max-height: 60vh;
        overflow-y: auto;
        background: var(--liquid-bg-tertiary);
        scrollbar-width: thin;
        scrollbar-color: var(--liquid-border-medium) transparent;
      `;

      // 自定义滚动条样式
      content.innerHTML = `
        <style>
          .search-words-content::-webkit-scrollbar {
            width: 8px;
          }
          .search-words-content::-webkit-scrollbar-track {
            background: transparent;
          }
          .search-words-content::-webkit-scrollbar-thumb {
            background-color: var(--liquid-border-medium);
            border-radius: 20px;
            border: 2px solid transparent;
          }
          .search-words-content::-webkit-scrollbar-thumb:hover {
            background-color: var(--liquid-border-heavy);
          }
        </style>
      `;
      content.className = 'search-words-content';

      // 创建搜索词网格
      const wordsGrid = document.createElement('div');
      wordsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
        margin-bottom: 20px;
      `;

      // 添加搜索词项
      words.forEach((word, index) => {
        const wordItem = document.createElement('div');
        wordItem.style.cssText = `
          background: var(--liquid-bg-primary);
          padding: 12px 16px;
          border-radius: var(--liquid-radius-medium);
          border: 1px solid var(--liquid-border-light);
          font-size: var(--liquid-font-size-medium);
          color: var(--liquid-text-primary);
          transition: var(--liquid-transition-fast);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(var(--liquid-blur-medium));
          -webkit-backdrop-filter: blur(var(--liquid-blur-medium));
          box-shadow: 0 2px 8px var(--liquid-shadow-light);
          text-shadow: 0 1px 1px var(--liquid-shadow-light);
          will-change: var(--liquid-will-change-transform);
          backface-visibility: var(--liquid-backface-visibility);
          transform: var(--liquid-gpu-acceleration);
        `;

        wordItem.innerHTML = `
          <div style="font-weight: 500; margin-bottom: 4px; color: var(--liquid-text-primary);">${index + 1}. ${word}</div>
        `;

        // 悬停效果
        wordItem.addEventListener('mouseenter', () => {
          wordItem.style.transform = 'translateY(-2px)';
          wordItem.style.boxShadow = '0 8px 16px var(--liquid-shadow-medium), inset 0 0 0 1px var(--liquid-border-medium)';
          wordItem.style.background = 'var(--liquid-bg-secondary)';
          wordItem.style.borderColor = 'var(--liquid-border-medium)';
        });

        wordItem.addEventListener('mouseleave', () => {
          wordItem.style.transform = 'translateY(0)';
          wordItem.style.boxShadow = '0 2px 8px var(--liquid-shadow-light)';
          wordItem.style.background = 'var(--liquid-bg-primary)';
          wordItem.style.borderColor = 'var(--liquid-border-light)';
        });

        // 点击复制
        wordItem.addEventListener('click', () => {
          navigator.clipboard.writeText(word).then(() => {
            this.showNotification(`已复制: ${word}`, 'success', 2000);
          }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            // 使用JavaScript兼容的类型转换
      /** @type {HTMLTextAreaElement} */ (textArea).value = word;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification(`已复制: ${word}`, 'success', 2000);
          });
        });

        wordsGrid.appendChild(wordItem);
      });

      // 移除底部操作区

      // 组装对话框
      content.appendChild(wordsGrid);
      dialog.appendChild(header);
      dialog.appendChild(content);
      overlay.appendChild(dialog);

      // 绑定关闭事件
      const closeDialog = () => {
        overlay.style.opacity = '0';
        dialog.style.transform = 'scale(0.9)';
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 300);
      };

      // 关闭按钮事件
      header.querySelector('.close-btn').addEventListener('click', closeDialog);

      // 移除刷新按钮相关代码

      // 点击遮罩关闭
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeDialog();
        }
      });

      // ESC键关闭
      const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
          closeDialog();
          document.removeEventListener('keydown', handleKeyPress);
        }
      };
      document.addEventListener('keydown', handleKeyPress);

      // 显示对话框
      document.body.appendChild(overlay);
      setTimeout(() => {
        overlay.style.opacity = '1';
        dialog.style.transform = 'scale(1)';
      }, 10);
    }

    /**
     * 折叠/展开菜单
     */
    toggleMenu() {
      this.isMenuCollapsed = !this.isMenuCollapsed;
      const toggleButton = this.controlPanel.querySelector('button');
      const menuContent = this.controlPanel.querySelector('#menu-content');

      if (this.isMenuCollapsed) {
        this.controlPanel.classList.add('collapsed');
        toggleButton.textContent = '+';
        menuContent.style.display = 'none';
      } else {
        this.controlPanel.classList.remove('collapsed');
        toggleButton.textContent = '−';
        menuContent.style.display = 'flex';
      }
    }

    /**
     * 获取SVG图标
     * @param {string} type - 图标类型 (success, error, warning, info, question)
     * @param {string} color - 图标颜色
     * @returns {string} SVG图标HTML
     */
    getIconSvg(type, color) {
      const icons = {
        success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" fill="${color}"/>
        </svg>`,
        error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.415 1.415L12 13.414l2.828 2.829 1.415-1.415L13.414 12l2.829-2.828-1.415-1.415L12 10.586z" fill="${color}"/>
        </svg>`,
        warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="${color}"/>
        </svg>`,
        info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" fill="${color}"/>
        </svg>`,
        question: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm2-1.645A3.502 3.502 0 0 0 12 6.5a3.501 3.501 0 0 0-3.433 2.813l1.962.393A1.5 1.5 0 1 1 12 11.5a1 1 0 0 0-1 1V14h2v-.645z" fill="${color}"/>
        </svg>`
      };

      return icons[type] || icons.info;
    }

    /**
     * 使面板可拖动（支持PC和移动端）
     */
    makeDraggable() {
      let isDragging = false;
      let currentX = 0;
      let currentY = 0;
      let initialX = 0;
      let initialY = 0;
      let xOffset = 0;
      let yOffset = 0;

      const titleBar = this.controlPanel.querySelector('div');
      if (!titleBar) return;

      // 统一的拖拽处理函数
      const startDrag = (clientX, clientY, target) => {
        // 检查是否点击的是折叠按钮，如果是则不启动拖拽
        if (target?.tagName === 'BUTTON' || target?.parentElement?.tagName === 'BUTTON') {
          return false;
        }

        initialX = clientX - xOffset;
        initialY = clientY - yOffset;

        if (target === titleBar || titleBar.contains(target)) {
          isDragging = true;
          this.controlPanel.style.cursor = 'grabbing';
          this.controlPanel.style.userSelect = 'none';
          this.controlPanel.style.transition = 'none';
          return true;
        }
        return false;
      };

      const moveDrag = (clientX, clientY) => {
        if (!isDragging) return;

        currentX = clientX - initialX;
        currentY = clientY - initialY;

        // 限制拖拽范围在视窗内
        const maxX = window.innerWidth - this.controlPanel.offsetWidth;
        const maxY = window.innerHeight - this.controlPanel.offsetHeight;

        currentX = Math.max(0, Math.min(maxX, currentX));
        currentY = Math.max(0, Math.min(maxY, currentY));

        xOffset = currentX;
        yOffset = currentY;

        // 更新面板位置，使用绝对定位而不是transform
        this.controlPanel.style.left = `${currentX}px`;
        this.controlPanel.style.top = `${currentY}px`;
        this.controlPanel.style.right = 'auto';
        this.controlPanel.style.bottom = 'auto';
        this.controlPanel.style.transform = 'none';
      };

      const endDrag = () => {
        if (!isDragging) return;

        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        this.controlPanel.style.cursor = 'move';
        this.controlPanel.style.userSelect = '';
        this.controlPanel.style.transition = '';
      };

      // PC端鼠标事件
      titleBar.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startDrag(e.clientX, e.clientY, e.target);
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          e.preventDefault();
          moveDrag(e.clientX, e.clientY);
        }
      });

      document.addEventListener('mouseup', endDrag);

      // 移动端触摸事件
      titleBar.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY, e.target);
      }, { passive: false });

      document.addEventListener('touchmove', (e) => {
        if (isDragging) {
          e.preventDefault();
          const touch = e.touches[0];
          moveDrag(touch.clientX, touch.clientY);
        }
      }, { passive: false });

      document.addEventListener('touchend', endDrag);

      // 设置初始样式
      this.controlPanel.style.cursor = 'move';
      titleBar.style.touchAction = 'none';

      // 初始化拖动位置
      const rect = this.controlPanel.getBoundingClientRect();
      currentX = rect.left;
      currentY = rect.top;
      xOffset = currentX;
      yOffset = currentY;
    }

    /**
     * 启动状态更新定时器
     */
    startStatusUpdate() {
      setInterval(() => {
        if (typeof window !== 'undefined' && window.rewardsExecutor) {
          const status = window.rewardsExecutor.getStatus();
          if (status) {
            this.updateStatusDisplay(status);
          }
        }
      }, 1000);
    }

    /**
     * 搜索后滚动到底部 - 优化版丝滑滚动
     */
    scrollToBottom() {
      // 使用更丝滑的自定义滚动动画
      const startPosition = window.pageYOffset;
      const targetPosition = document.body.scrollHeight - window.innerHeight;
      const distance = targetPosition - startPosition;
      const duration = 2000; // 使用更长的动画时长，提供更丝滑的体验
      let startTime = null;

      // 缓动函数 - easeInOutCubic (更平滑的缓动)
      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animateScroll = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const easedProgress = easeInOutCubic(progress);
        const currentPosition = startPosition + (distance * easedProgress);

        window.scrollTo({ top: currentPosition, behavior: 'auto' });

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      // 只有当有足够的滚动距离时才执行动画
      if (distance > 50) {
        // 延迟执行以确保页面内容已加载
        setTimeout(() => {
          requestAnimationFrame(animateScroll);
        }, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--liquid-animation-duration')) || 300);
      }
    }

    /**
     * 测试UI组件在不同场景下的表现
     * @param {boolean} [autoClose=true] - 是否自动关闭测试组件
     * @returns {Promise<void>}
     */
    async testUIComponents(autoClose = true) {
      try {
        console.log('[UIManager] 开始测试UI组件...');

        // 1. 测试通知系统
        await this.testNotifications();

        // 2. 测试对话框系统
        await this.testDialogs();

        // 3. 测试控制面板和状态显示
        await this.testPanels();

        // 4. 测试动画效果
        await this.testAnimations();

        console.log('[UIManager] UI组件测试完成');
        this.showNotification('UI组件测试完成', 'success');

        return true;
      } catch (error) {
        console.error('[UIManager] UI组件测试失败:', error);
        this.showNotification('UI组件测试失败: ' + error.message, 'error');
        return false;
      }
    }

    /**
     * 测试通知系统
     * @returns {Promise<void>}
     * @private
     */
    async testNotifications() {
      // 测试不同类型的通知
      this.showNotification('这是一条信息通知', 'info');
      await Utils.sleep(1000);

      this.showNotification('这是一条成功通知', 'success');
      await Utils.sleep(1000);

      this.showNotification('这是一条警告通知', 'warning');
      await Utils.sleep(1000);

      this.showNotification('这是一条错误通知', 'error');
      await Utils.sleep(1000);
    }

    /**
     * 测试对话框系统
     * @returns {Promise<void>}
     * @private
     */
    async testDialogs() {
      // 测试确认对话框
      this.showConfirmDialog(
        '这是一个测试确认对话框',
        async () => {
          this.showNotification('确认按钮点击成功', 'success');
        },
        () => {
          this.showNotification('取消按钮点击成功', 'info');
        }
      );

      // 等待用户交互
      await Utils.sleep(3000);

      // 测试搜索词对话框
      const testWords = ['测试词1', '测试词2', '测试词3', '测试词4', '测试词5'];
      this.showSearchWordsDialog(testWords, '测试搜索词');

      // 等待用户交互
      await Utils.sleep(3000);
    }

    /**
     * 测试控制面板和状态显示
     * @returns {Promise<void>}
     * @private
     */
    async testPanels() {
      // 测试状态显示更新
      const testStatus = {
        isRunning: true,
        currentCount: 15,
        targetCount: 30,
        remainingTime: '00:30:00',
        hotWords: ['测试词1', '测试词2', '测试词3']
      };

      this.updateStatusDisplay(testStatus);
      await Utils.sleep(1000);

      // 测试控制面板折叠/展开
      if (this.controlPanel) {
        const titleBar = this.controlPanel.querySelector('.titleBar');
        if (titleBar) {
          // 使用JavaScript兼容的类型转换
      /** @type {HTMLElement} */ (titleBar).click(); // 折叠
          await Utils.sleep(1000);
      /** @type {HTMLElement} */ (titleBar).click(); // 展开
          await Utils.sleep(1000);
        }
      }
    }

    /**
     * 测试动画效果
     * @returns {Promise<void>}
     * @private
     */
    async testAnimations() {
      // 创建测试元素
      const testContainer = document.createElement('div');
      testContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: ${CONFIG.UI.MODAL_Z_INDEX + 1};
        background: var(--liquid-bg-secondary);
        padding: 20px;
        border-radius: var(--liquid-radius-large);
        box-shadow: var(--liquid-shadow-medium);
        text-align: center;
        max-width: 300px;
      `;

      const title = document.createElement('h3');
      title.textContent = '动画效果测试';
      title.style.margin = '0 0 15px 0';

      const animationContainer = document.createElement('div');
      animationContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
      `;

      // 测试各种动画
      const animations = [
        'liquidFadeIn',
        'liquidFadeOut',
        'liquidPulse',
        'liquidSlideIn',
        'liquidSlideOut',
        'liquidScaleIn',
        'liquidScaleOut'
      ];

      // 创建测试元素
      const testElement = document.createElement('div');
      testElement.style.cssText = `
        background: var(--liquid-accent-blue);
        color: white;
        padding: 10px;
        border-radius: var(--liquid-radius-medium);
        margin: 10px 0;
      `;
      testElement.textContent = '动画测试元素';

      // 关闭按钮
      const closeButton = document.createElement('button');
      closeButton.textContent = '关闭测试';
      closeButton.style.cssText = `
        background: var(--liquid-accent-red);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: var(--liquid-radius-medium);
        cursor: pointer;
        font-family: var(--liquid-font-family);
        font-size: var(--liquid-font-size-medium);
      `;

      closeButton.addEventListener('click', () => {
        document.body.removeChild(testContainer);
      });

      // 添加元素到容器
      testContainer.appendChild(title);
      testContainer.appendChild(testElement);
      testContainer.appendChild(closeButton);
      document.body.appendChild(testContainer);

      // 测试各种动画
      for (const animation of animations) {
        testElement.textContent = `测试: ${animation}`;
        testElement.style.animation = `${animation} var(--liquid-animation-duration) var(--liquid-animation-easing) forwards`;
        await Utils.sleep(1000);
        testElement.style.animation = '';
        await Utils.sleep(500);
      }

      // 自动关闭
      await Utils.sleep(1000);
      // 确保autoClose变量在作用域内
      if (testContainer.parentNode && typeof autoClose !== 'undefined' && autoClose) {
        document.body.removeChild(testContainer);
      }
    }

    /**
     * 移除移动端调试控制台
     */
    removeMobileDebug() {
      try {
        // 移除Eruda调试控制台
        if (typeof window.eruda !== 'undefined' && window.eruda && window.eruda.destroy) {
          window.eruda.destroy();
          console.log('[MobileDebug] Eruda调试工具已移除');
        }

        // 移除简单调试控制台
        const debugConsole = document.getElementById('mobile-debug-console');
        if (debugConsole) {
          debugConsole.remove();
          console.log('[MobileDebug] 简单调试控制台已移除');
        }

        this.showNotification('调试控制台已移除', 'success');
      } catch (error) {
        console.error('[UIManager] 移除调试控制台失败:', error);
        this.showNotification('移除调试控制台失败', 'error');
      }
    }

    /**
     * 销毁UI管理器
     */
    destroy() {
      if (this.controlPanel && this.controlPanel.parentNode) {
        this.controlPanel.parentNode.removeChild(this.controlPanel);
      }

      if (this.statusDisplay && this.statusDisplay.parentNode) {
        this.statusDisplay.parentNode.removeChild(this.statusDisplay);
      }

      this.isInitialized = false;
      console.log('[UIManager] UI管理器已销毁');
    }
  }

  // ============================================================================
  // 应用程序入口
  // ============================================================================

  /**
   * 应用程序主类
   * @class RewardsApp
   */
  class RewardsApp {
    /**
     * 构造函数
     */
    constructor() {
      this.uiManager = new UIManager();
      this.isInitialized = false;
    }

    /**
     * 初始化应用程序
     * @returns {Promise<void>}
     */
    async initialize() {
      if (this.isInitialized) return;

      try {
        console.log('[RewardsApp] 开始初始化应用程序...');

        // 初始化UI管理器
        await this.uiManager.initialize();

        // 将app实例保存到全局变量，供UI组件调用
        window.app = this;

        // 加载用户设置
        this.uiManager.loadSettings();

        // 检查调试模式设置，如果开启则立即初始化控制台
        const debugMode = StorageManager.getValue('debugMode', false);
        if (debugMode) {
          this.enableMobileDebug();
        }

        // 注册菜单命令
        this.registerMenuCommands();

        this.isInitialized = true;
        console.log('[RewardsApp] 🎉 应用程序初始化完成!');

      } catch (error) {
        console.error('[RewardsApp] 初始化失败:', error);
        throw error;
      }
    }

    /**
     * 注册菜单命令
     */
    registerMenuCommands() {
      // 菜单命令已移除，相关功能已集成到设置面板中
    }

    /**
     * 启用真机调试支持 - 使用Eruda
     */
    enableMobileDebug() {
      try {
        // 检查Eruda是否已通过@require加载
        if (typeof window.eruda !== 'undefined' && window.eruda) {
          window.eruda.init({
            tool: ['console', 'elements', 'network', 'resources', 'info'],
            autoScale: true,
            defaults: {
              displaySize: 40,
              theme: 'Dark'
            }
          });
          console.log('[MobileDebug] Eruda调试工具已启用 (通过@require加载)');
          this.uiManager.showNotification('Eruda调试控制台已启用', 'success');
        } else {
          // Eruda未加载时回退到简单控制台
          console.warn('[MobileDebug] Eruda未加载，使用简单调试控制台');
          this.createDebugConsole();
          this.uiManager.showNotification('简单调试控制台已启用', 'success');
        }
      } catch (error) {
        console.error('[RewardsApp] 启用调试控制台失败:', error);
        // 回退到简单控制台
        this.createDebugConsole();
        this.uiManager.showNotification('简单调试控制台已启用', 'success');
      }
    }



    /**
     * 创建简单调试控制台（Eruda加载失败时的备选方案）
     */
    createDebugConsole() {
      // 检查是否已存在调试控制台
      if (document.getElementById('mobile-debug-console')) {
        return;
      }

      // 创建调试控制台容器
      const debugConsole = document.createElement('div');
      debugConsole.id = 'mobile-debug-console';
      debugConsole.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 300px;
        height: 200px;
        background: rgba(0, 0, 0, 0.9);
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 8px;
        z-index: 10001;
        overflow-y: auto;
        border: 1px solid #333;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        display: none;
      `;

      // 创建标题栏
      const titleBar = document.createElement('div');
      titleBar.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #333;
      `;

      const title = document.createElement('span');
      title.textContent = '调试控制台';
      title.style.color = '#00ff00';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.cssText = `
        background: none;
        border: none;
        color: #ff0000;
        font-size: 16px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
      `;
      closeBtn.onclick = () => {
        debugConsole.style.display = 'none';
      };

      titleBar.appendChild(title);
      titleBar.appendChild(closeBtn);

      // 创建日志显示区域
      const logArea = document.createElement('div');
      logArea.id = 'debug-log-area';
      logArea.style.cssText = `
        height: 150px;
        overflow-y: auto;
        white-space: pre-wrap;
        word-break: break-all;
      `;

      debugConsole.appendChild(titleBar);
      debugConsole.appendChild(logArea);
      document.body.appendChild(debugConsole);

      // 创建调试按钮
      const debugBtn = document.createElement('button');
      debugBtn.textContent = '🐛';
      debugBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #007bff;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        z-index: 10002;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      `;
      debugBtn.onclick = () => {
        debugConsole.style.display = debugConsole.style.display === 'none' ? 'block' : 'none';
      };
      document.body.appendChild(debugBtn);

      // 重写console方法以显示在调试控制台
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };

      const addToDebugConsole = (type, args) => {
        const timestamp = new Date().toLocaleTimeString();
        const message = args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');

        const logEntry = document.createElement('div');
        logEntry.style.marginBottom = '2px';

        const typeColors = {
          log: '#00ff00',
          error: '#ff0000',
          warn: '#ffff00',
          info: '#00ffff'
        };

        logEntry.innerHTML = `<span style="color: #888">[${timestamp}]</span> <span style="color: ${typeColors[type]}">[${type.toUpperCase()}]</span> ${message}`;

        logArea.appendChild(logEntry);
        logArea.scrollTop = logArea.scrollHeight;

        // 限制日志条数
        if (logArea.children.length > 100) {
          logArea.removeChild(logArea.firstChild);
        }
      };

      // 重写console方法
      console.log = (...args) => {
        originalConsole.log.apply(console, args);
        addToDebugConsole('log', args);
      };

      console.error = (...args) => {
        originalConsole.error.apply(console, args);
        addToDebugConsole('error', args);
      };

      console.warn = (...args) => {
        originalConsole.warn.apply(console, args);
        addToDebugConsole('warn', args);
      };

      console.info = (...args) => {
        originalConsole.info.apply(console, args);
        addToDebugConsole('info', args);
      };

      console.log('[MobileDebug] 真机调试控制台已启用');
    }
  }

  // ============================================================================
  // 脚本启动
  // ============================================================================

  // 全局应用实例
  let app = null;

  /**
   * 检查当前页面是否为搜索页面
   * @returns {boolean} 是否为搜索页面
   */
  function isSearchPage() {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    // 检查是否为搜索页面路径或包含搜索参数
    return currentPath.includes('/search') ||
      currentSearch.includes('q=') ||
      currentPath === '/' && currentSearch.includes('q=');
  }

  /**
   * 重定向到搜索页面
   */
  function redirectToSearchPage() {
    console.log('[PageDetector] 当前不在搜索页面，准备重定向');

    // 生成一个简单的搜索词用于重定向
    const searchTerm = '微软搜索';
    const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}`;

    console.log('[PageDetector] 重定向到:', searchUrl);
    window.location.href = searchUrl;
  }

  /**
   * 启动应用程序
   */
  async function startApp() {
    try {
      // 检查页面类型
      if (!isSearchPage()) {
        console.log('[PageDetector] 检测到非搜索页面，执行重定向');
        redirectToSearchPage();
        return; // 重定向后不继续初始化
      }

      console.log('[PageDetector] 检测到搜索页面，开始初始化应用');
      app = new RewardsApp();
      await app.initialize();
    } catch (error) {
      console.error('[启动失败]', error);
    }
  }

  // 等待页面加载完成后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }

  console.log('[微软Rewards脚本-重构版] 模块加载完成 v2.0.0');

})();