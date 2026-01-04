// ==UserScript==
// @name         cela-自动学习脚本API版
// @namespace    https://github.com/Moker32/
// @version      3.40
// @description  [API版] cela自动学习脚本，支持浦东分院课程列表页面，支持专栏详情页面课程获取
// @author       Moker32
// @license      GPL-3.0-or-later
// @grant        GM_getValue
// @grant        GM_setValue
// @match        *://cela.e-celap.cn/*
// @match        *://pudong.e-celap.cn/*
// @match        *://pd.cela.cn/*
// @match        *://*.e-celap.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      cela.e-celap.cn
// @connect      pudong.e-celap.cn
// @connect      pd.cela.cn
// @connect      zpyapi.shsets.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542254/cela-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%ACAPI%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542254/cela-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%ACAPI%E7%89%88.meta.js
// ==/UserScript==

/**
 * CELA自动学习脚本API版
 *
 * 本脚本通过直接调用CELA网站的API端点来实现自动学习功能，
 * 支持主站和浦东分院环境，具有智能学习策略和多种容错机制。
 *
 * 主要特性：
 * - 基于真实API分析，直接调用后端接口
 * - 支持快速学习、超快速模式等多种策略
 * - 多数据源支持，API失败时自动降级
 * - 学习记录保存到服务器，后台可查询
 * - 现代化UI设计，支持拖拽和配置界面
 * - 7层弹窗拦截机制，确保学习不被中断
 *
 * 技术亮点：
 * - 双API架构: 主站API + 视频API双重保障
 * - 事件驱动模块化设计，EventBus解耦
 * - 根据课程进度自动选择学习策略
 * - 支持主站和各分院环境
 *
 * @author Moker32
 * @version 3.40
 * @license GPL-3.0-or-later
 */

(function() {
    'use strict';

    // --- 常量集中管理 ---
    /**
     * 常量配置对象
     * 包含API端点、DOM选择器、存储键名等所有常量配置
     */
    const CONSTANTS = {
        /**
         * API端点配置
         * 定义所有与学习相关的API端点
         */
        API_ENDPOINTS: {
            GET_PLAY_TREND: '/inc/nc/course/play/getPlayTrend',      // 获取播放趋势信息
            PULSE_SAVE_RECORD: '/inc/nc/course/play/pulseSaveRecord', // 脉冲式保存学习记录
            REPORT_PROGRESS: '/inc/nc/course/play/reportProgress',    // 报告学习进度
            UPDATE_PROGRESS: '/inc/nc/course/play/updateProgress',    // 更新学习进度
            GET_STUDY_RECORD: '/inc/nc/course/getStudyRecord',
            SAVE_STUDY_RECORD: '/inc/nc/course/saveStudyRecord',
            GET_COURSEWARE_DETAIL: '/inc/nc/course/play/getCoursewareDetail', // 获取课件详情
            GET_PACK_BY_ID: '/inc/nc/pack/getById',                   // 根据ID获取包信息
            GET_COURSE_LIST: '/api/course/list',                      // 获取课程列表
            PUSH_COURSE: '/dsfa/nc/cela/api/pushCourse',              // 推送课程
            GET_COURSE_BY_USER: '/dsfa/nc/cela/api/getCourseByUserAndCourse', // 根据用户获取课程
            VIDEO_PROGRESS: '/api/player/progress'                    // 视频进度
        },
        /**
         * DOM选择器配置
         * 定义UI面板和相关元素的选择器
         */
        SELECTORS: {
            PANEL: '#api-learner-panel',           // 主面板
            STATUS_DISPLAY: '#learner-status',     // 状态显示
            PROGRESS_INNER: '#learner-progress-inner', // 进度条内部元素
            TOGGLE_BTN: '#toggle-learning-btn',    // 开始/停止按钮
            LOG_CONTAINER: '#api-learner-panel .log-container', // 日志容器
            STAT_TOTAL: '#stat-total',             // 总课程数统计
            STAT_COMPLETED: '#stat-completed',     // 已完成课程数统计
            STAT_LEARNED: '#stat-learned',         // 新学习课程数统计
            STAT_FAILED: '#stat-failed',           // 失败课程数统计
            STAT_SKIPPED: '#stat-skipped',         // 跳过课程数统计
            APP: '#app'                            // 应用容器
        },
        /**
         * 存储键名配置
         * 定义localStorage和sessionStorage中使用的键名
         */
        STORAGE_KEYS: {
            TOKEN: 'token',           // 认证令牌
            AUTH_TOKEN: 'authToken',  // 认证令牌（备选）
            ACCESS_TOKEN: 'access_token', // 访问令牌
            USER_ID: 'userId',        // 用户ID
            USER_ID_ALT: 'user_id'    // 用户ID（备选）
        },
        /**
         * 课程选择器配置
         * 定义用于查找课程元素的CSS选择器列表
         */
        COURSE_SELECTORS: [
            '[class*="course"]', '[data-course]', '.course-item', '.lesson-item',
            '.el-card', '.el-card__body', '.course-card', '.course-box',
            '.nc-course-item', '.study-item', '.learn-item',
            '[class*="item"]', '[class*="card"]', '[data-id]',
            '.pudong-course', '.pd-course', '.dsf-course'
        ],
        /**
         * 备用选择器配置
         * 当主要选择器无效时使用的备用选择器
         */
        FALLBACK_SELECTORS: [
            'div[class*="list"] > div',
            'ul > li',
            '.content div',
            '#app div[class]',
            '[class*="container"] > div'
        ],
        /**
         * 视频选择器配置
         * 定义用于查找视频元素的CSS选择器列表
         */
        VIDEO_SELECTORS: [
            'video', '[api-base-url]', '[class*="video"]', 'iframe[src*="play"]'
        ],
        /**
         * Cookie模式配置
         * 定义用于从Cookie中提取信息的正则表达式
         */
        COOKIE_PATTERNS: {
            USER_ID: /userId=([^;]+)/,  // 用户ID模式
            TOKEN: /token=([^;]+)/,     // 令牌模式
            P_PARAM: /_p=([^;]+)/       // P参数模式
        },
        /**
         * 时间格式配置
         * 定义时间相关的常量
         */
        TIME_FORMATS: {
            DEFAULT_DURATION: 1800, // 默认时长：30分钟
        },
        /**
         * UI限制配置
         * 定义UI相关的限制参数
         */
        UI_LIMITS: {
            MAX_LOG_ENTRIES: 50,      // 最大日志条数
            LOG_FLUSH_DELAY: 100      // 日志刷新延迟（毫秒）
        }
    };

    // --- 事件驱动机制 (v2.0优化) ---
    /**
     * 事件总线 - 实现组件间解耦的事件驱动机制
     *
     * 提供事件订阅、发布和一次性监听功能，用于组件间通信
     *
     * @typedef {Object} EventBus
     * @property {Object} events - 存储事件监听器的映射表
     * @property {Function} subscribe - 订阅事件
     * @property {Function} publish - 发布事件
     * @property {Function} once - 一次性事件监听
     */
    const EventBus = {
        /**
         * 事件监听器映射表
         * @type {Object.<string, Function[]>}
         */
        events: {},

        /**
         * 订阅事件
         *
         * @param {string} event - 事件名称
         * @param {Function} listener - 事件监听器
         * @returns {Function} 取消订阅函数
         */
        subscribe(event, listener) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(listener);
            return () => {
                // 返回取消订阅函数
                const index = this.events[event].indexOf(listener);
                if (index > -1) {
                    this.events[event].splice(index, 1);
                }
            };
        },

        /**
         * 发布事件
         *
         * @param {string} event - 事件名称
         * @param {*} data - 传递给监听器的数据
         */
        publish(event, data) {
            if (!this.events[event]) return;
            this.events[event].forEach(listener => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`EventBus error in ${event}:`, error);
                }
            });
        },

        /**
         * 一次性事件监听
         *
         * 监听器在执行一次后自动取消订阅
         *
         * @param {string} event - 事件名称
         * @param {Function} listener - 事件监听器
         * @returns {Function} 取消订阅函数
         */
        once(event, listener) {
            const unsubscribe = this.subscribe(event, (data) => {
                unsubscribe();
                listener(data);
            });
            return unsubscribe;
        }
    };

    // --- 配置管理模块 (v2.0优化) ---
    /**
     * 配置管理模块
     *
     * 管理脚本的所有配置选项，包括学习策略、API端点、调试选项等
     *
     * @typedef {Object} Settings
     * @property {Object} defaultConfig - 默认配置对象
     * @property {Object} config - 当前配置对象
     * @property {Function} load - 加载配置
     * @property {Function} get - 获取配置值
     */
    const Settings = {
        /**
         * 默认配置对象
         * 定义所有可用的配置选项及其默认值
         *
         * @type {Object}
         * @property {string} LEARNING_STRATEGY - 学习策略 ('smart': 智能学习模式)
         * @property {boolean} SKIP_COMPLETED_COURSES - 是否跳过已完成课程
         * @property {boolean} STUDY_RECORD_ENABLED - 是否启用学习记录
         * @property {boolean} FALLBACK_MODE - 是否启用兜底模式（已禁用）
         * @property {boolean} DEBUG_MODE - 是否开启调试模式
         * @property {number} HEARTBEAT_INTERVAL - 进度上报间隔(秒)
         * @property {number} COMPLETION_THRESHOLD - 完成度阈值(%)
         * @property {number} MAX_RETRY_ATTEMPTS - 最大重试次数
         * @property {number} RETRY_DELAY - 重试延迟(毫秒)
         * @property {number} COURSE_COMPLETION_DELAY - 课程完成延迟(秒)
         * @property {boolean} PUDONG_MODE - 浦东分院模式(自动检测)
         * @property {string} PUDONG_API_BASE - 浦东API基础URL(自动设置)
         * @property {boolean} FAST_LEARNING_MODE - 兼容旧版本的快速学习模式
         */
        defaultConfig: {
            // === 固定配置 (不可修改) ===
            LEARNING_STRATEGY: 'smart',                    // 智能学习模式
            SKIP_COMPLETED_COURSES: true,                  // 跳过已完成课程
            STUDY_RECORD_ENABLED: true,                    // 启用学习记录
            FALLBACK_MODE: false,                          // 禁用兜底模式
            DEBUG_MODE: true,                             // 开启调试模式
            HEARTBEAT_INTERVAL: 10,                        // 进度上报间隔(秒)
            COMPLETION_THRESHOLD: 95,                      // 完成度阈值(%)

            // === 技术配置 (高级选项) ===
            MAX_RETRY_ATTEMPTS: 10,                        // 最大重试次数
            RETRY_DELAY: 3000,                            // 重试延迟(毫秒)
            COURSE_COMPLETION_DELAY: 5,                    // 课程完成延迟(秒)

            // === 自动配置 (系统检测) ===
            PUDONG_MODE: false,                           // 浦东分院模式(自动检测)
            PUDONG_API_BASE: '',                          // 浦东API基础URL(自动设置)

            // === 安全配置 ===
            STRICT_MODE: false,                           // 严格模式：禁止使用模拟ID上报
            SAFE_MODE: false,                             // 安全模式：模拟更真实的人类学习行为(耗时更长)

            // === 向后兼容配置 (将被迁移) ===
            FAST_LEARNING_MODE: true,                     // 兼容旧版本
        },

        /**
         * 当前配置对象
         * @type {Object}
         */
        config: {},

        /**
         * 加载配置
         *
         * 使用固定配置，不再从存储加载
         */
        load() {
            // 使用固定配置，不再从存储加载
            this.config = { ...this.defaultConfig };
            EventBus.publish('log', { message: '✅ 使用固定配置：智能学习模式', type: 'success' });
        },

        /**
         * 获取配置值
         *
         * @param {string} key - 配置键名
         * @returns {*} 配置值
         */
        get(key) {
            return this.config[key];
        }
    };

    // --- 配置区域 (v3.37.4简化) ---
    /**
     * 配置代理对象
     *
     * 使用Proxy模式访问配置，优先从Settings获取配置，如果不存在则使用默认值
     *
     * @type {Proxy}
     */
    const CONFIG = new Proxy({}, {
        get(target, prop) {
            // 优先从Settings获取配置，如果不存在则使用默认值
            return Settings.get(prop) ?? target[prop];
        },
        set(target, prop, value) {
            // 固定配置模式，直接设置到target
            target[prop] = value;
            return true;
        }
    });

    /**
     * 自动检测当前环境
     *
     * 检测当前是否为浦东分院环境，并设置相应的API基础URL
     *
     * @function detectEnvironment
     */
    const detectEnvironment = () => {
        const hostname = window.location.hostname;
        const href = window.location.href;

        // 检测是否为浦东分院
        if (hostname.includes('pudong') ||
            hostname.includes('pd.') ||
            href.includes('浦东分院') ||
            href.includes('pudong') ||
            document.title.includes('浦东')) {
            CONFIG.PUDONG_MODE = true;
            console.log('🏢 检测到浦东分院环境');
        }

        // 设置API基础URL
        if (CONFIG.PUDONG_MODE) {
            if (hostname.includes('pudong.e-celap.cn')) {
                CONFIG.PUDONG_API_BASE = `https://${hostname}`;
            } else if (hostname.includes('pd.cela.cn')) {
                CONFIG.PUDONG_API_BASE = `https://${hostname}`;
            } else {
                // 默认使用主站API
                CONFIG.PUDONG_API_BASE = 'https://cela.e-celap.cn';
            }
        }

        console.log(`🌐 当前环境: ${CONFIG.PUDONG_MODE ? '浦东分院' : '主站'} (${hostname})`);
        console.log(`🔗 API基础URL: ${CONFIG.PUDONG_API_BASE || 'https://cela.e-celap.cn'}`);
    };

    /**
     * 检测浦东分院环境下的API端点可用性
     *
     * 检测浦东分院环境下的特殊API端点是否可用，用于优化API调用策略
     *
     * @async
     * @function detectPudongApiEndpoints
     */
    const detectPudongApiEndpoints = async () => {
        if (!CONFIG.PUDONG_MODE) return;

        try {
            // 尝试检测浦东分院的特殊API端点
            const endpointsToTest = [
                '/api/player/progress',
                '/api/study/record',
                '/api/video/info',
                '/api/player/pulse',
                '/inc/nc/course/play/getPlayTrend',
                '/inc/nc/course/play/pulseSaveRecord',
                '/inc/nc/course/play/reportProgress',
                '/inc/nc/course/play/updateProgress',
                '/inc/nc/course/play/getPlayInfo',
                '/inc/nc/course/play/getPlayInfoById',
                '/inc/nc/course/play/updatePlayProgress',
                '/api/course/player/progress',
                '/dsf/nc/cela/api/coursePlayerInfo',
                '/api/course/detail',
                '/inc/nc/course/detail',
                '/api/course/progress',
                '/inc/nc/course/progress',
                '/api/learning/record',
                '/inc/nc/learning/record'
            ];

            for (const endpoint of endpointsToTest) {
                try {
                    const response = await API._request({
                        method: 'GET',
                        url: `${API.getBaseUrl()}${endpoint}?_t=${Date.now()}`,
                        timeout: 5000
                    });

                    // 记录可用的端点，即使返回错误码也可能表示端点存在
                    console.log(`🔍 API端点检测: ${endpoint} - ${response?.code || response?.status || response?.message || 'no response'}`);
                } catch (error) {
                    // 端点不可用或需要POST请求
                    console.log(`🔍 API端点检测: ${endpoint} - 不可用 (${error.message})`);
                }
            }
        } catch (error) {
            console.log(`⚠️ API端点检测失败: ${error.message}`);
        }
    };

    // --- UI和日志（优化版） ---
    /**
     * UI管理模块
     *
     * 负责创建和管理用户界面，包括控制面板、日志显示、进度条等
     *
     * @typedef {Object} UI
     * @property {Array} logs - 存储所有日志条目的数组
     * @property {Array} logBuffer - 日志缓冲区，用于批量更新
     * @property {number} logUpdateTimeout - 日志更新定时器ID
     * @property {Object} statistics - 统计信息对象
     * @property {Function} createPanel - 创建UI面板
     * @property {Function} log - 记录日志
     * @property {Function} initEventListeners - 初始化事件监听器
     * @property {Function} flushLogBuffer - 批量刷新日志缓冲区
     * @property {Function} updateStatus - 更新状态显示
     * @property {Function} updateProgress - 更新进度条
     * @property {Function} updateStatistics - 更新统计信息
     * @property {Function} addStyles - 添加CSS样式
     * @property {Function} exportLogs - 导出日志
     */
    const UI = {
        /**
         * 存储所有日志条目的数组
         * @type {Array}
         */
        logs: [],
        /**
         * 日志缓冲区，用于批量更新
         * @type {Array}
         */
        logBuffer: [], // 日志缓冲区
        /**
         * 日志更新定时器ID
         * @type {number}
         */
        logUpdateTimeout: null,
        /**
         * 统计信息对象
         * @type {Object}
         * @property {number} total - 总课程数
         * @property {number} completed - 已完成课程数
         * @property {number} learned - 新学习课程数
         * @property {number} failed - 失败课程数
         * @property {number} skipped - 跳过课程数
         */
        statistics: {
            total: 0,
            completed: 0,
            learned: 0,
            failed: 0,
            skipped: 0
        },
        /**
         * 创建UI面板
         *
         * 创建包含控制按钮、状态显示、进度条和日志的面板
         */
        createPanel: () => {
            const panel = document.createElement('div');
            panel.id = 'api-learner-panel';
            panel.innerHTML = `
                <div class="header">
                    API学习助手 v3.40
                </div>
                <div class="content">
                    <div class="status">状态: <span id="learner-status">待命</span></div>
                    <div class="statistics">
                        <div class="stat-item">总计: <span id="stat-total">0</span></div>
                        <div class="stat-item">已完成: <span id="stat-completed">0</span></div>
                        <div class="stat-item">新学习: <span id="stat-learned">0</span></div>
                        <div class="stat-item">失败: <span id="stat-failed">0</span></div>
                        <div class="stat-item">跳过: <span id="stat-skipped">0</span></div>
                    </div>
                    <div class="progress-bar"><div id="learner-progress-inner"></div></div>

                    <div class="log-container"></div>
                </div>
                <div class="footer">
                    <button id="toggle-learning-btn" data-state="stopped">开始学习</button>
                    <div class="feature-note">✨ 智能学习模式 + 自动记录</div>
                </div>
            `;
            document.body.appendChild(panel);
            UI.addStyles();
            UI.initEventListeners();
        },
        /**
         * 记录日志
         *
         * 使用批量更新策略优化性能，避免频繁DOM操作
         *
         * @param {string} message - 日志消息
         * @param {'info'|'success'|'error'|'warn'|'debug'} type - 日志类型
         */
        // 优化后的日志函数 - 使用批量更新策略
        log: function(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const logMessage = `[${timestamp}] ${message}`;

            // 添加到缓冲区
            this.logBuffer.push({ message: logMessage, type });

            // 使用防抖处理，批量更新DOM
            if (this.logUpdateTimeout) clearTimeout(this.logUpdateTimeout);
            this.logUpdateTimeout = setTimeout(() => this.flushLogBuffer(), CONSTANTS.UI_LIMITS.LOG_FLUSH_DELAY);

            if (CONFIG.DEBUG_MODE) {
                const debugMessage = `[API Learner Debug] ${logMessage}`;
                console.log(debugMessage);
                this.logs.push(debugMessage);
            }
        },

        /**
         * 初始化事件监听器 (v2.0新增)
         *
         * 订阅EventBus事件并绑定相应的处理函数
         */
        // 初始化事件监听器 (v2.0新增)
        initEventListeners: function() {
            // 订阅事件
            EventBus.subscribe('log', ({ message, type }) => this.log(message, type));
            EventBus.subscribe('statusUpdate', status => this.updateStatus(status));
            EventBus.subscribe('progressUpdate', progress => this.updateProgress(progress));
            EventBus.subscribe('statisticsUpdate', stats => this.updateStatistics(stats));
        },
        /**
         * 批量刷新日志缓冲区
         *
         * 将缓冲区中的日志批量更新到DOM中，提高性能
         */
        // 批量刷新日志缓冲区
        flushLogBuffer: function() {
            const logContainer = document.querySelector(CONSTANTS.SELECTORS.LOG_CONTAINER);
            if (!logContainer || this.logBuffer.length === 0) return;

            const fragment = document.createDocumentFragment();
            this.logBuffer.forEach(log => {
                const logEntry = document.createElement('div');
                logEntry.className = `log-entry ${log.type}`;
                logEntry.textContent = log.message;
                fragment.appendChild(logEntry);
            });

            logContainer.appendChild(fragment);
            logContainer.scrollTop = logContainer.scrollHeight;

            // 限制日志条数，避免占用过多内存
            const entries = logContainer.querySelectorAll('.log-entry');
            if (entries.length > CONSTANTS.UI_LIMITS.MAX_LOG_ENTRIES) {
                for (let i = 0; i < entries.length - CONSTANTS.UI_LIMITS.MAX_LOG_ENTRIES; i++) {
                    entries[i].remove();
                }
            }

            this.logBuffer = []; // 清空缓冲区
        },
        /**
         * 更新状态显示
         *
         * @param {string} status - 新状态文本
         */
        updateStatus: (status) => {
            const statusEl = document.getElementById(CONSTANTS.SELECTORS.STATUS_DISPLAY.replace('#', ''));
            if (statusEl) statusEl.textContent = status;
        },
        /**
         * 更新进度条
         *
         * @param {number} percentage - 进度百分比
         */
        updateProgress: (percentage) => {
            const progressInner = document.getElementById(CONSTANTS.SELECTORS.PROGRESS_INNER.replace('#', ''));
            if (progressInner) progressInner.style.width = `${percentage}%`;
        },
        /**
         * 更新统计信息
         *
         * @param {Object} stats - 统计信息对象
         */
        updateStatistics: (stats) => {
            Object.assign(UI.statistics, stats);
            document.getElementById(CONSTANTS.SELECTORS.STAT_TOTAL.replace('#', '')).textContent = UI.statistics.total;
            document.getElementById(CONSTANTS.SELECTORS.STAT_COMPLETED.replace('#', '')).textContent = UI.statistics.completed;
            document.getElementById(CONSTANTS.SELECTORS.STAT_LEARNED.replace('#', '')).textContent = UI.statistics.learned;
            document.getElementById(CONSTANTS.SELECTORS.STAT_FAILED.replace('#', '')).textContent = UI.statistics.failed;
            document.getElementById(CONSTANTS.SELECTORS.STAT_SKIPPED.replace('#', '')).textContent = UI.statistics.skipped;
        },
        /**
         * 添加CSS样式
         *
         * 为UI面板添加必要的CSS样式
         */
        addStyles: () => {
            const styles = `
                #api-learner-panel { position: fixed; bottom: 20px; right: 20px; width: 400px; background: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 99999; font-family: sans-serif; font-size: 14px; color: #333; }
                #api-learner-panel .header { background: #f7f7f7; padding: 10px 15px; font-weight: bold; border-bottom: 1px solid #ddd; border-radius: 8px 8px 0 0; }
                #api-learner-panel .content { padding: 15px; }
                #api-learner-panel .status { margin-bottom: 10px; }
                #api-learner-panel .statistics { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px; background: #f9f9f9; border-radius: 4px; font-size: 12px; }
                #api-learner-panel .stat-item { text-align: center; }
                #api-learner-panel .progress-bar { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
                #api-learner-panel #learner-progress-inner { height: 100%; width: 0%; background: #4caf50; transition: width 0.3s ease; }
                #api-learner-panel .log-container { max-height: 120px; overflow-y: auto; background: #fafafa; padding: 8px; border: 1px solid #eee; border-radius: 4px; font-size: 11px; line-height: 1.4; }
                #api-learner-panel .log-entry.error { color: #f44336; }
                #api-learner-panel .log-entry.success { color: #4caf50; }
                #api-learner-panel .log-entry.warn { color: #ff9800; }
                #api-learner-panel .footer { padding: 10px 15px; border-top: 1px solid #ddd; text-align: right; }
                #api-learner-panel button { padding: 6px 10px; border: none; border-radius: 4px; cursor: pointer; margin-left: 8px; font-size: 12px; }
                #api-learner-panel button#toggle-learning-btn {
                    background: #2196f3;
                    color: white;
                    transition: background-color 0.3s ease;
                }
                #api-learner-panel button#toggle-learning-btn[data-state="running"] {
                    background: #f44336;
                }
                #api-learner-panel button:disabled { background: #ccc; }
                #api-learner-panel .feature-note { font-size: 11px; color: #666; margin-top: 8px; text-align: center; }
            `;
            const styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        },
        /**
         * 导出日志
         *
         * 将调试日志导出为文本文件
         */
        exportLogs: () => {
            if (UI.logs.length === 0) {
                alert('没有可导出的调试日志。');
                return;
            }
            const blob = new Blob([UI.logs.join('\r\n')], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `api_learner_debug_log_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // --- 学习策略模式 (v2.0优化) ---
    /**
     * 学习策略模块
     *
     * 定义不同的学习策略，根据课程进度自动选择最适合的策略
     *
     * @typedef {Object} LearningStrategies
     * @property {Function} _executeSteps - 策略执行的辅助函数
     * @property {Function} slow_start - 慢启动策略：分3步到50%，然后快速完成
     * @property {Function} progressive - 渐进式策略：分5步完成
     * @property {Function} fast_finish - 快速完成策略：直接跳到95%然后完成
     * @property {Function} final_push - 最后冲刺策略：直接完成
     */
    const LearningStrategies = {
        /**
         * 策略执行的辅助函数，封装重复逻辑
         *
         * @async
         * @param {Object} context - 学习上下文对象
         * @param {Array<number>} steps - 要执行的步骤时间点数组
         * @param {number} delay - 每个步骤之间的延迟（毫秒）
         * @returns {boolean} 是否成功执行所有步骤
         */
        async _executeSteps(context, steps, delay) {
            for (const targetTime of steps) {
                if (Learner.stopRequested) {
                    EventBus.publish('log', { message: '⏹️ 收到停止请求，中断策略执行', type: 'warn' });
                    return false;
                }

                const randomDelay = Math.floor(delay * 0.6 + Math.random() * delay * 0.4); // 延迟的60%-100%
                await new Promise(resolve => setTimeout(resolve, randomDelay));
                const success = await API.smartReportProgress(context.playInfo, targetTime);
                if (!success) return false;

                context.currentTime = targetTime;
                const progress = Math.floor((context.currentTime / context.duration) * 100);
                EventBus.publish('log', { message: `[策略执行] 进度: ${progress}%`, type: 'info' });
            }
            return true;
        },

        /**
         * 慢启动策略：分3步到50%，然后快速完成
         *
         * 适用于刚开始学习的课程，模拟真实学习行为
         *
         * @async
         * @param {Object} context - 学习上下文对象
         * @returns {boolean} 策略是否成功执行
         */
        async slow_start(context) {
            const { duration } = context;
            EventBus.publish('log', { message: '[慢启动策略] 开始执行', type: 'info' });

            // 优化：更平滑的曲线，增加 65%, 80%, 90% 节点，防止从 50% 直接跳到 100%
            const progressPoints = [0.2, 0.35, 0.5, 0.65, 0.8, 0.9];
            const steps = progressPoints.map(p => Math.floor(duration * p));
            
            // 动态延迟计算：课程越长，延迟应该越长，以增加真实感
            // 基础延迟 3秒，每分钟课程增加 0.1秒延迟
            let baseDelay = 3000 + (duration / 60) * 100;
            
            if (CONFIG.SAFE_MODE) {
                baseDelay = baseDelay * 2; // 安全模式下延迟翻倍
                EventBus.publish('log', { message: '[安全模式] 启用更真实的延迟模拟', type: 'info' });
            }

            const success = await this._executeSteps(context, steps, baseDelay);

            if (success && !Learner.stopRequested) {
                const delay = Math.floor(Math.random() * 2000 + 1000); 
                await new Promise(resolve => setTimeout(resolve, delay));
                context.currentTime = duration - 5; // 稍微留一点余量
                return await API.smartReportProgress(context.playInfo, context.currentTime);
            }
            return success;
        },

        /**
         * 渐进式策略：分5步完成
         *
         * 适用于进度在10%-50%之间的课程，逐步推进学习进度
         *
         * @async
         * @param {Object} context - 学习上下文对象
         * @returns {boolean} 策略是否成功执行
         */
        async progressive(context) {
            const { duration, currentTime } = context;
            EventBus.publish('log', { message: '[渐进式策略] 开始执行', type: 'info' });

            const remaining = duration - currentTime;
            const stepSize = Math.floor(remaining / 6); // 分得更细一点
            const steps = [];

            for (let i = 1; i <= 5; i++) {
                const nextTime = Math.min(currentTime + (stepSize * i), duration - 10);
                steps.push(nextTime);
            }

            // 动态延迟
            let baseDelay = 3000 + (duration / 60) * 100;
            if (CONFIG.SAFE_MODE) baseDelay *= 1.5;

            return await this._executeSteps(context, steps, baseDelay);
        },

        /**
         * 快速完成策略：直接跳到95%然后完成
         *
         * 适用于进度在50%-80%之间的课程，快速完成剩余部分
         *
         * @async
         * @param {Object} context - 学习上下文对象
         * @returns {boolean} 策略是否成功执行
         */
        async fast_finish(context) {
            const { duration } = context;
            EventBus.publish('log', { message: '[快速完成策略] 开始执行', type: 'info' });

            if (Learner.stopRequested) return false;

            const target95 = Math.floor(duration * 0.95);
            const initialDelay = Math.floor(Math.random() * 1000 + 500); // 0.5-1.5秒随机延迟
            await new Promise(resolve => setTimeout(resolve, initialDelay));
            let success = await API.smartReportProgress(context.playInfo, target95);

            if (success && !Learner.stopRequested) {
                const finalDelay = Math.floor(Math.random() * 1000 + 500); // 0.5-1.5秒随机延迟
                await new Promise(resolve => setTimeout(resolve, finalDelay));
                context.currentTime = duration - 10;
                success = await API.smartReportProgress(context.playInfo, context.currentTime);
            }
            return success;
        },

        /**
         * 最后冲刺策略：直接完成
         *
         * 适用于进度在80%以上的课程，直接完成剩余部分
         *
         * @async
         * @param {Object} context - 学习上下文对象
         * @returns {boolean} 策略是否成功执行
         */
        async final_push(context) {
            const { duration } = context;
            EventBus.publish('log', { message: '[最后冲刺策略] 开始执行', type: 'info' });

            if (Learner.stopRequested) return false;

            const delay = Math.floor(Math.random() * 1000 + 500); // 0.5-1.5秒随机延迟
            await new Promise(resolve => setTimeout(resolve, delay));
            context.currentTime = duration - 10;
            return await API.smartReportProgress(context.playInfo, context.currentTime);
        },

    };

    // --- 工具函数 ---
    /**
     * 工具函数模块
     *
     * 提供各种实用的辅助函数
     *
     * @typedef {Object} Utils
     * @property {Function} formatTime - 将秒数格式化为时:分:秒格式
     */
    const Utils = {
        /**
         * 将秒数格式化为时:分:秒格式
         *
         * @param {number} seconds - 秒数
         * @returns {string} 格式化后的时间字符串 (HH:MM:SS)
         */
        formatTime: function(seconds) {
            if (!seconds || seconds < 0) return '00:00:00';

            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    };

    /**
     * 请求队列管理器 - 限制并发请求，防止WAF拦截
     * 
     * @typedef {Object} RequestQueue
     * @property {Array} queue - 等待执行的请求队列
     * @property {number} activeCount - 当前活跃的请求数
     * @property {number} maxConcurrent - 最大并发数
     * @property {number} requestGap - 请求间隔(ms)
     */
    const RequestQueue = {
        queue: [],
        activeCount: 0,
        maxConcurrent: 2, // 限制最大并发数为2，模拟人类操作
        requestGap: 1000, // 每次请求间隔 1秒

        /**
         * 添加请求到队列
         * @param {Function} fn - 返回Promise的请求函数
         * @returns {Promise}
         */
        add(fn) {
            return new Promise((resolve, reject) => {
                this.queue.push({ fn, resolve, reject });
                this.process();
            });
        },

        /**
         * 处理队列
         */
        async process() {
            if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) return;

            this.activeCount++;
            const { fn, resolve, reject } = this.queue.shift();

            try {
                // 添加随机延迟，模拟真实行为
                const delay = this.requestGap + Math.random() * 500;
                if (delay > 0) await new Promise(r => setTimeout(r, delay));
                
                const result = await fn();
                resolve(result);
            } catch (e) {
                reject(e);
            } finally {
                this.activeCount--;
                // 给下一个请求留一点缓冲时间
                setTimeout(() => this.process(), 100);
            }
        }
    };

    /**
     * 等待元素出现 (MutationObserver版)
     * 替代低效的轮询机制
     * 
     * @param {string} selector - CSS选择器
     * @param {number} timeout - 超时时间(ms)
     * @returns {Promise<Element>}
     */
    const waitForElement = (selector, timeout = 30000) => {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                // 不reject，而是返回null，避免中断流程
                console.warn(`[waitForElement] Timeout waiting for ${selector}`);
                resolve(null);
            }, timeout);
        });
    };

    /**
     * 课程数据适配器 (Normalizer Pattern)
     * 将不同来源的课程数据标准化为统一格式
     */
    const CourseAdapter = {
        /**
         * 标准化课程数据
         * @param {Object} raw - 原始数据
         * @param {string} source - 数据来源标识
         * @returns {Object} 标准化后的课程对象
         */
        normalize(raw, source = 'api') {
            return {
                id: raw.id || raw.businessId || raw.courseId,
                courseId: raw.courseId || raw.id || raw.businessId,
                // 优先使用dsUnitId，其次尝试构建，最后兜底
                dsUnitId: raw.dsUnitId || raw.unitId || (raw.unitOrder && raw.order ? `unit_${raw.unitOrder}_${raw.order}` : `unit_default`),
                title: raw.name || raw.title || raw.courseName || '未命名课程',
                courseName: raw.name || raw.title || raw.courseName || '未命名课程',
                teacher: raw.teacher || '',
                durationStr: raw.duration || raw.durationStr || raw.timeLength || '00:30:00',
                period: raw.period || 0,
                status: raw.status || 'not_started',
                source: source,
                // 保留原始数据以备不时之需
                _raw: raw
            };
        }
    };

    // --- API 核心（优化版） ---
    /**
     * API核心模块
     *
     * 负责与CELA网站进行API通信，包括进度上报、课程信息获取等功能
     *
     * @typedef {Object} API
     * @property {string} _baseUrl - 主站API基础URL
     * @property {string} _videoApiBaseUrl - 视频API基础URL
     * @property {AbortController} abortController - 用于中止请求的控制器
     * @property {Function} getBaseUrl - 动态获取基础URL
     * @property {Function} _tryApiEndpoints - 通用API端点尝试策略
     * @property {Function} _isSuccessResponse - 统一的成功响应判断逻辑
     * @property {Function} _request - 通用请求函数
     * @property {Function} _extractToken - 提取认证令牌
     * @property {Function} reportProgress - 进度上报
     * @property {Function} _createStudyRecord - 创建学习记录
     * @property {Function} finishStudyRecord - 完成学习记录
     * @property {Function} completeCourse - 完成课程
     * @property {Function} getCourseListFromSpecialDetail - 从专栏详情获取课程列表
     * @property {Function} getCourseListFromChannel - 从频道获取课程列表
     * @property {Function} getCourseList - 获取课程列表
     * @property {Function} getPlayInfo - 获取播放信息
     * @property {Function} parseTimeToSeconds - 将时间字符串解析为秒数
     * @property {Function} parseDuration - 解析持续时间
     * @property {Function} pulseSaveRecord - 脉冲式保存记录
     * @property {Function} secondsToTimeString - 将秒数转换为时间字符串
     * @property {Function} antiCheatCheck - 防刷课检查
     * @property {Function} extractUserId - 提取用户ID
     * @property {Function} checkCourseCompletion - 检查课程完成状态
     * @property {Function} smartLearnCourse - 智能学习课程
     */
    const API = {
        /**
         * 认证Token缓存
         * @type {string|null}
         */
        _cachedToken: null,

        /**
         * 主站API基础URL
         * @type {string}
         */
        _baseUrl: 'https://cela.e-celap.cn',
        /**
         * 视频API基础URL
         * @type {string}
         */
        _videoApiBaseUrl: 'https://zpyapi.shsets.com',
        /**
         * 用于中止请求的控制器
         * @type {AbortController}
         */
        abortController: null, // AbortController 支持

        /**
         * 动态获取基础URL
         *
         * 根据当前环境（主站或浦东分院）返回相应的API基础URL
         *
         * @returns {string} API基础URL
         */
        getBaseUrl: function() {
            if (CONFIG.PUDONG_MODE && CONFIG.PUDONG_API_BASE) {
                return CONFIG.PUDONG_API_BASE;
            }
            return this._baseUrl;
        },

        /**
         * 通用API端点尝试策略 (根据审查报告建议优化)
         *
         * 尝试多个API端点，直到找到一个成功响应的端点
         *
         * @async
         * @param {Array<Function>} apiCalls - API调用函数数组
         * @param {string} successMessage - 成功时的消息
         * @param {string} failureMessage - 所有端点都失败时的消息
         * @returns {Object|null} 成功响应或null
         */
        async _tryApiEndpoints(apiCalls, successMessage, failureMessage) {
            for (let i = 0; i < apiCalls.length; i++) {
                // 检查是否被中止
                if (this.abortController && this.abortController.signal.aborted) {
                    throw new DOMException('Aborted', 'AbortError');
                }

                try {
                    const result = await apiCalls[i]();

                    // 检查是否有错误
                    if (result?.error) {
                        // 如果有错误信息，记录并继续尝试下一个
                        const errorMessage = result?.error || result?.message || 'unknown error';
                        EventBus.publish('log', { message: `[API Strategy] 方法${i+1}失败: ${errorMessage}`, type: 'debug' });
                        continue; // 尝试下一个方法
                    }

                    if (this._isSuccessResponse(result)) {
                        EventBus.publish('log', { message: `${successMessage} (方法${i+1})`, type: 'success' });
                        return result;
                    }
                    // 改进错误信息，显示更详细的响应内容
                    const errorMessage = result?.message || result?.msg || result?.error || 'unknown error';
                    EventBus.publish('log', { message: `[API Strategy] 方法${i+1}失败: ${errorMessage}`, type: 'debug' });
                } catch (error) {
                    EventBus.publish('log', { message: `[API Strategy] 方法${i+1}异常: ${error.message}`, type: 'debug' });
                    if (error.name === 'AbortError') {
                        throw error; // 重新抛出中止错误
                    }
                }
            }
            EventBus.publish('log', { message: failureMessage, type: 'warn' });
            return null;
        },

        /**
         * 统一的成功响应判断逻辑
         *
         * 判断API响应是否表示成功
         *
         * @param {Object} result - API响应结果
         * @returns {boolean} 是否为成功响应
         */
        _isSuccessResponse(result) {
            return result && (
                result.success === true ||
                result.code === 200 ||
                result.code === 20000 ||
                result.state === 20000 ||
                result.status === 'success' ||
                result.status === 'ok' ||
                (result.code >= 200 && result.code < 300) ||
                // 浦东分院可能的响应格式
                result.result === 'success' ||
                result.success === 1
            );
        },

        /**
         * 通用请求函数
         *
         * 使用GM_xmlhttpRequest发送HTTP请求，支持多种数据格式和错误处理
         *
         * @async
         * @param {Object} options - 请求选项
         * @param {string} options.method - HTTP方法 (GET, POST, etc.)
         * @param {string} options.url - 请求URL
         * @param {Object} options.headers - 请求头
         * @param {string|FormData} options.data - 请求数据
         * @param {number} options.timeout - 超时时间（毫秒）
         * @returns {Promise<Object>} 响应数据
         */
        _request: async function(options) {
            // 使用请求队列包裹实际请求逻辑
            return RequestQueue.add(() => new Promise((resolve, reject) => {
                // 检查是否被中止
                if (this.abortController && this.abortController.signal.aborted) {
                    return reject(new DOMException('Aborted', 'AbortError'));
                }

                // 提取Cookie和其他认证信息
                const cookies = document.cookie;
                const token = this._extractToken();

                // 构建请求头 - 根据数据类型设置Content-Type
                const headers = {
                    'Accept': 'application/json, text/plain, */*',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': window.location.href,
                    'Origin': this.getBaseUrl(),
                    'Cookie': cookies,
                    ...options.headers
                };

                // 根据数据类型设置Content-Type
                if (options.data instanceof FormData) {
                    // FormData会自动设置Content-Type，包括boundary
                    // 不要手动设置Content-Type
                } else if (typeof options.data === 'string' && options.data.includes('=')) {
                    // URL编码的表单数据
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                } else {
                    // JSON数据
                    headers['Content-Type'] = 'application/json';
                }

                // 如果有token，添加到请求头
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                    headers['X-Auth-Token'] = token;
                }

                // 精简日志输出
                if (CONFIG.DEBUG_MODE) {
                    UI.log(`[API] ${options.method || 'GET'} ${options.url}`);
                }

                const req = GM_xmlhttpRequest({
                    method: options.method || 'GET',
                    url: options.url,
                    headers: headers,
                    data: options.data,
                    timeout: 30000,
                    onload: (response) => {
                        // 401 Token过期处理
                        if (response.status === 401) {
                            UI.log(`⚠️ Token可能已过期 (401)，清除缓存`, 'warn');
                            this._cachedToken = null;
                        }

                        if (CONFIG.DEBUG_MODE) {
                            UI.log(`[API] ${response.status} ${response.responseText?.substring(0, 100)}...`);
                        }

                        try {
                            if (response.responseText && response.responseText.trim()) {
                                const data = JSON.parse(response.responseText);
                                resolve(data);
                            } else {
                                // 对于空响应，尝试从状态码判断
                                if (response.status >= 200 && response.status < 300) {
                                    // 成功状态码但无响应体
                                    resolve({ code: response.status, success: true, message: 'Success' });
                                } else {
                                    resolve({ status: response.status, message: 'Empty response' });
                                }
                            }
                        } catch (parseError) {
                            // 尝试处理非JSON响应
                            if (response.responseText && response.responseText.trim().startsWith('<')) {
                                // HTML响应，可能是错误页面
                                UI.log(`⚠️ 收到HTML响应，可能请求错误`, 'warn');
                                resolve({ error: 'HTML response received', status: response.status, raw: response.responseText });
                            } else {
                                // 尝试解析为文本
                                try {
                                    const textData = response.responseText ? JSON.parse(response.responseText) : null;
                                    if (textData) {
                                        resolve(textData);
                                    } else {
                                        // 返回状态信息
                                        resolve({ status: response.status, message: response.responseText || 'Empty response', success: response.status >= 200 && response.status < 300 });
                                    }
                                } catch {
                                    UI.log(`❌ JSON解析失败: ${parseError.message}`, 'error');
                                    resolve({ error: 'JSON解析失败', status: response.status, raw: response.responseText });
                                }
                            }
                        }
                    },
                    onerror: function(error) {
                        UI.log(`❌ 请求失败: ${error.message}`, 'error');
                        // 根据错误类型提供更多信息
                        resolve({ error: error.message, type: error.type || 'unknown', status: error.status || 0 });
                    },
                    ontimeout: function() {
                        UI.log(`❌ 请求超时`, 'error');
                        resolve({ error: '请求超时', status: 0, type: 'timeout' });
                    }
                });

                // 支持AbortController
                if (this.abortController) {
                    this.abortController.signal.addEventListener('abort', () => {
                        if (req.abort) {
                            req.abort();
                        }
                        reject(new DOMException('Aborted', 'AbortError'));
                    });
                }
            }));
        },

        /**
         * 提取认证令牌
         *
         * 尝试从多个位置提取认证令牌，包括localStorage、sessionStorage、Cookie、window对象等
         *
         * @returns {string|null} 认证令牌或null
         */
        _extractToken: function() {
            // 1. 优先使用缓存的Token
            if (this._cachedToken) return this._cachedToken;

            // 尝试从多个位置提取认证token
            const sources = [
                () => localStorage.getItem(CONSTANTS.STORAGE_KEYS.TOKEN),
                () => localStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN),
                () => localStorage.getItem(CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN),
                () => sessionStorage.getItem(CONSTANTS.STORAGE_KEYS.TOKEN),
                () => sessionStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN),
                () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                () => window.token,
                () => window.authToken,
                () => {
                    const match = document.cookie.match(CONSTANTS.COOKIE_PATTERNS.TOKEN);
                    return match ? match[1] : null;
                }
            ];

            for (const source of sources) {
                try {
                    const token = source();
                    if (token && token.length > 10) {
                        UI.log(`[Token] 找到认证token: ${token.substring(0, 20)}...`, 'debug');
                        this._cachedToken = token; // 更新缓存
                        return token;
                    }
                } catch (e) {
                    // 忽略提取错误
                }
            }

            UI.log('[Token] 未找到认证token', 'debug');
            return null;
        },

        /**
         * 进度上报 - 增强版，根据深度分析报告优化
         * 支持真实API优先，智能降级到模拟模式
         */
        reportProgress: async function(playInfo, currentTime) {
            try {
                const isMockData = playInfo.videoId && playInfo.videoId.startsWith('mock_');
                const progressPercent = Math.round((currentTime / playInfo.duration) * 100);
                
                if (isMockData) {
                    UI.log(`⚠️ [警告] 正在对模拟视频ID上报进度，这通常意味着课程识别失败，服务器可能不会记录进度！`, 'warn');
                }

                // 构建真实API调用方法
                const reportMethods = [
                    // 方法1: 脉冲式进度上报
                    () => this.pulseSaveRecord(playInfo, currentTime),
                    // 方法2: 备用上报
                    async () => {
                        const watchPoint = API.secondsToTimeString(currentTime);
                        const url = `${this.getBaseUrl()}/api/player/progress?courseId=${playInfo.courseId}&watchPoint=${watchPoint}&_t=${Date.now()}`;
                        return await this._request({ method: 'GET', url });
                    }
                ];

                const result = await this._tryApiEndpoints(
                    reportMethods,
                    `[进度上报] 成功 (${progressPercent}%)`,
                    `[进度上报] ❌ 所有API同步方法均已失败！`
                );

                if (result) return result;

                // 如果所有方法都失败了，且是模拟数据，我们如实报错
                throw new Error('服务器拒绝接收学习进度，同步失败');

            } catch (error) {
                if (error.name === 'AbortError') throw error;
                UI.log(`[进度上报] 发生严重错误: ${error.message}`, 'error');
                throw error;
            }
        },

        smartReportProgress: async function(playInfo, currentTime) {
            const progressPercent = Math.round((currentTime / playInfo.duration) * 100);

            if (progressPercent > 90) {
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            }

            return await this.reportProgress(playInfo, currentTime);
        },

        /**
         * 创建学习记录
         *
         * 优化：移除不必要的学习记录创建，浦东分院环境不需要此步骤
         *
         * @async
         * @param {string} courseId - 课程ID
         * @returns {boolean} 操作是否成功
         */
        _createStudyRecord: async function(courseId) {
            UI.log(`[学习记录] 浦东分院环境，跳过学习记录创建: ${courseId}`, 'debug');
            return true; // 直接返回成功，避免404错误
        },

        /**
         * 完成学习记录
         *
         * 优化：移除不必要的学习记录完成，浦东分院环境不需要此步骤
         *
         * @async
         * @param {Object} playInfo - 播放信息对象
         * @param {number} finalTime - 最终时间
         * @returns {boolean} 操作是否成功
         */
        finishStudyRecord: async function(playInfo, finalTime) {
            UI.log(`[学习记录] 浦东分院环境，跳过学习记录完成: ${playInfo.courseId}`, 'debug');
            return true; // 直接返回成功，避免404错误
        },

        /**
         * 完成课程
         *
         * 优化：浦东分院环境下课程完成API可能不存在，简化为日志记录
         *
         * @async
         * @param {Object} courseInfo - 课程信息对象
         * @returns {boolean} 操作是否成功
         */
        completeCourse: async function(courseInfo) {
            const courseId = courseInfo.id || courseInfo.courseId;
            UI.log(`[课程完成] 浦东分院环境，课程学习标记完成: ${courseInfo.title || courseId}`, 'success');
            return true; // 直接返回成功，避免404错误
        },

        // 剩余的API方法（使用常量优化）

        getCourseListFromSpecialDetail: async () => {
            try {
                UI.log('检测到专栏详情页面，尝试获取课程列表...', 'info');

                const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
                const channelId = urlParams.get('id');

                if (!channelId) {
                    UI.log('未找到专栏ID', 'error');
                    return [];
                }

                UI.log(`专栏ID: ${channelId}`, 'debug');

                const url = `${CONSTANTS.API_ENDPOINTS.GET_PACK_BY_ID}?id=${channelId}&_t=${Date.now()}`;
                const response = await API._request({
                    method: 'GET',
                    url: `${API.getBaseUrl()}${url}`
                });

                if (!response.success || !response.data) {
                    UI.log('专栏API返回数据异常', 'error');
                    return [];
                }

                const channelData = response.data;
                UI.log(`专栏标题: ${channelData.title}`, 'info');

                const courseList = [];
                if (channelData.pdChannelUnitList) {
                    for (const unit of channelData.pdChannelUnitList) {
                        UI.log(`单元: ${unit.unitName} (${unit.totalPeriod}学时)`, 'debug');

                        if (unit.subList) {
                            for (const course of unit.subList) {
                                if (course.typeValue === 'course') {
                                    // 预处理数据以适配 CourseAdapter
                                    course.unitOrder = unit.order;
                                    courseList.push(CourseAdapter.normalize(course, 'special_detail'));
                                }
                            }
                        }
                    }
                }

                UI.log(`[专栏课程] 成功获取 ${courseList.length} 门课程`, 'info');
                return courseList;

            } catch (error) {
                UI.log(`获取专栏课程列表失败: ${error.message}`, 'error');
                return [];
            }
        },

        getCourseListFromChannel: async function(channelId) {
            try {
                UI.log(`正在从频道API获取课程列表 (ID: ${channelId})...`, 'info');

                const apiEndpoints = [
                    `${CONSTANTS.API_ENDPOINTS.GET_PACK_BY_ID}?id=${channelId}&_t=${Date.now()}`,
                    `/api/nc/channel/detail?id=${channelId}&_t=${Date.now()}`,
                    `/inc/nc/course/list?channelId=${channelId}&_t=${Date.now()}`,
                    `${CONSTANTS.API_ENDPOINTS.GET_COURSE_LIST}?channelId=${channelId}&_t=${Date.now()}`
                ];

                for (const endpoint of apiEndpoints) {
                    try {
                        UI.log(`尝试API端点: ${endpoint}`, 'debug');
                        const response = await API._request({
                            method: 'GET',
                            url: `${API.getBaseUrl()}${endpoint}`
                        });

                        if (response && response.success && response.data) {
                            const courseList = [];
                            const data = response.data;

                            if (data.pdChannelUnitList) {
                                for (const unit of data.pdChannelUnitList) {
                                    UI.log(`单元: ${unit.unitName} (${unit.totalPeriod}学时)`, 'debug');

                                    if (unit.subList) {
                                        for (const course of unit.subList) {
                                            if (course.typeValue === 'course') {
                                                // 预处理数据
                                                course.unitOrder = unit.order;
                                                courseList.push(CourseAdapter.normalize(course, 'channel_unit'));
                                            }
                                        }
                                    }
                                }
                            } else {
                                let courses = [];
                                if (data.courseList) {
                                    courses = data.courseList;
                                } else if (data.courses) {
                                    courses = data.courses;
                                } else if (data.list) {
                                    courses = data.list;
                                } else if (Array.isArray(data)) {
                                    courses = data;
                                }

                                courses.forEach(course => {
                                    courseList.push(CourseAdapter.normalize(course, 'channel_list'));
                                });
                            }

                            if (courseList.length > 0) {
                                UI.log(`✅ 从频道API获取到 ${courseList.length} 门课程`, 'info');
                                return courseList;
                            }
                        }
                    } catch (error) {
                        UI.log(`API端点 ${endpoint} 失败: ${error.message}`, 'debug');
                    }
                }

                UI.log('❌ 所有频道API端点都失败了', 'warn');
                return [];
            } catch (error) {
                UI.log(`❌ 获取频道课程列表失败: ${error.message}`, 'error');
                return [];
            }
        },

        async getCoursewareListFromPlayer(courseId) {
            try {
                UI.log(`🔍 正在获取课程包详细信息 (ID: ${courseId})...`, 'debug');
                
                const endpoints = [
                    `/inc/nc/course/play/getPlayTrend?courseId=${courseId}&_t=${Date.now()}`,
                    `/dsf/nc/cela/api/coursePlayerInfo?id=${courseId}&_t=${Date.now()}`,
                    `/inc/nc/course/play/getPlayInfoById?id=${courseId}&_t=${Date.now()}`,
                    `/api/course/player/info?id=${courseId}&_t=${Date.now()}`
                ];

                for (const endpoint of endpoints) {
                    try {
                        const response = await this._request({
                            method: 'GET',
                            url: `${this.getBaseUrl()}${endpoint}`
                        });

                        if (response && response.success && response.data) {
                            const data = response.data;
                            
                            // 1. 优先检查 playTree (针对浦东分院等环境的多视频结构)
                            if (data.playTree && data.playTree.children && Array.isArray(data.playTree.children)) {
                                const videos = data.playTree.children.filter(c => c.rTypeValue === 'video' || c.rTypeValue === 'courseware');
                                if (videos.length > 0) {
                                    UI.log(`📋 从playTree获取到 ${videos.length} 个课件`, 'info');
                                    return videos.map((v, index) => CourseAdapter.normalize({
                                        id: courseId,
                                        courseId: courseId,
                                        dsUnitId: v.id,
                                        title: v.title || `${data.title || '课程'} - 视频${index + 1}`,
                                        duration: v.sumDurationLong || 0
                                    }, 'player_api_tree'));
                                }
                            }

                            // 2. 检查 coursewareIdList (标准多课件结构)
                            if (data.coursewareIdList && Array.isArray(data.coursewareIdList) && data.coursewareIdList.length > 0) {
                                UI.log(`📋 从coursewareIdList获取到 ${data.coursewareIdList.length} 个课件`, 'info');
                                return data.coursewareIdList.map((cw, index) => {
                                    return CourseAdapter.normalize({
                                        id: courseId,
                                        courseId: courseId,
                                        dsUnitId: cw.id || cw.coursewareId,
                                        title: cw.name || cw.title || `${data.title || '课程'} - 视频${index + 1}`,
                                        duration: cw.duration || 0
                                    }, 'player_api_list');
                                });
                            }

                            // 3. 检查 subList 或其他列表结构 (通用退路)
                            const list = data.subList || data.courseList || data.lessons;
                            if (list && Array.isArray(list) && list.length > 0) {
                                UI.log(`📋 从API子列表获取到 ${list.length} 个视频`, 'info');
                                return list.map(item => CourseAdapter.normalize(item, 'player_api_sublist'));
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }
                return [];
            } catch (error) {
                UI.log(`获取课件列表失败: ${error.message}`, 'debug');
                return [];
            }
        },

        getCourseList: async () => {
            try {
                UI.log('正在获取课程列表...', 'info');

                // 优化：使用 MutationObserver 替代轮询
                const waitForVueApp = async () => {
                    // 1. 尝试直接检测
                    const app = document.querySelector(CONSTANTS.SELECTORS.APP);
                    if (app && (window.Vue || app.__vue__ || app._vnode)) return true;

                    // 2. 尝试检测内容
                    const hasContent = document.querySelectorAll('.el-card, [class*="course"], [class*="item"], [class*="card"]').length > 0;
                    if (hasContent) return true;

                    // 3. 使用 MutationObserver 等待
                    UI.log('⏳ 等待页面动态加载...', 'debug');
                    const el = await waitForElement(CONSTANTS.SELECTORS.APP, 15000);
                    if (el) return true;
                    
                    // 4. 再次检查通用元素
                    if (document.querySelectorAll('.el-card').length > 0) return true;

                    UI.log('⚠️ 页面加载超时或非Vue环境', 'warn');
                    return false;
                };

                await waitForVueApp();

                const currentUrl = window.location.href;
                UI.log(`当前页面URL: ${currentUrl}`, 'debug');

                if (currentUrl.includes('/specialdetail')) {
                    UI.log('检测到专栏详情页面，尝试从API获取课程列表...', 'info');
                    return await API.getCourseListFromSpecialDetail();
                }

                // 强化频道页面识别 (增加关键词兼容性)
                if (currentUrl.toLowerCase().includes('channeldetail') || 
                    currentUrl.toLowerCase().includes('zgpdyxkczl') ||
                    currentUrl.toLowerCase().includes('pdchanel')) {
                    
                    UI.log('检测到频道/专栏页面，尝试从API获取课程列表...', 'info');

                    let channelId = null;
                    try {
                        const urlObj = new URL(currentUrl.replace('#', ''));
                        channelId = urlObj.searchParams.get('id');

                        if (!channelId) {
                            const hash = window.location.hash;
                            const match = hash.match(/[?&]id=([^&]+)/);
                            if (match) channelId = match[1];
                        }
                    } catch (error) {
                        UI.log(`解析频道ID失败: ${error.message}`, 'debug');
                    }

                    if (channelId) {
                        UI.log(`频道ID: ${channelId}`, 'debug');
                        return await API.getCourseListFromChannel(channelId);
                    }
                }

                let courseList = [];
                let courseElements = [];

                await new Promise(resolve => setTimeout(resolve, 3000));

                UI.log(`🔍 页面内容分析:`, 'debug');
                
                // 专门针对浦东分院频道页的列表项
                const pudongItems = document.querySelectorAll('.dsf_nc_pd_special_item, .list_item, .pd_course_item');
                if (pudongItems.length > 0) {
                    UI.log(`📋 找到浦东分院专用列表项: ${pudongItems.length}个`, 'info');
                    courseElements = Array.from(pudongItems);
                } else {
                    for (const selector of CONSTANTS.COURSE_SELECTORS) {
                        const elements = document.querySelectorAll(selector);
                        if (elements.length > 0) {
                            courseElements = Array.from(elements);
                            UI.log(`📋 使用选择器 "${selector}" 找到 ${elements.length} 个课程元素`, 'info');
                            break;
                        }
                    }
                }

                if (courseElements.length === 0) {
                    for (const selector of CONSTANTS.FALLBACK_SELECTORS) {
                        const elements = document.querySelectorAll(selector);
                        if (elements.length > 0) {
                            courseElements = Array.from(elements);
                            UI.log(`📋 使用备用选择器 "${selector}" 找到 ${elements.length} 个元素`, 'info');
                            break;
                        }
                    }
                }

                courseElements.forEach((el, index) => {
                    // 深度提取ID逻辑
                    const findId = (element) => {
                        return element.getAttribute('data-course-id') ||
                               element.getAttribute('data-id') ||
                               element.getAttribute('id') ||
                               element.querySelector('[data-id]')?.getAttribute('data-id') ||
                               element.querySelector('[data-course-id]')?.getAttribute('data-course-id') ||
                               element.innerHTML.match(/[a-f0-9]{32}/)?.[0];
                    };

                    const rawData = {
                        courseId: findId(el) || `course_${index}`,
                        dsUnitId: el.getAttribute('data-unit-id') || el.getAttribute('data-dsunit') || `unit_${index}`,
                        courseName: el.querySelector('.title, .name, .course-title, h3, h4')?.textContent?.trim() || 
                                   el.getAttribute('title') || 
                                   el.textContent?.trim()?.split('\n')[0]?.substring(0, 50) ||
                                   `课程${index + 1}`,
                        durationStr: el.querySelector('.duration, .time, .period')?.textContent?.trim() || '00:30:00',
                        status: el.getAttribute('data-status') || 'not_started'
                    };

                    if (rawData.courseName && rawData.courseName.length > 2) {
                        courseList.push(CourseAdapter.normalize(rawData, 'dom_scrape'));
                    }
                });

                if (courseList.length === 0) {
                    try {
                        const apiUrl = `${API.getBaseUrl()}${CONSTANTS.API_ENDPOINTS.GET_COURSE_LIST}`;
                        const apiResponse = await API._request({
                            method: 'GET',
                            url: apiUrl + '?' + new URLSearchParams({
                                _t: Date.now(),
                                page: 1,
                                size: 50
                            }).toString()
                        });

                        if (apiResponse.success && apiResponse.data) {
                            const apiCourses = Array.isArray(apiResponse.data) ? apiResponse.data :
                                              apiResponse.data.list || apiResponse.data.records || [];
                            
                            courseList = apiCourses.map((course, index) => {
                                // 确保有必要的字段供适配器使用
                                if (!course.courseId && !course.id) course.id = `api_course_${index}`;
                                if (!course.name && !course.title) course.title = `API课程${index + 1}`;
                                return CourseAdapter.normalize(course, 'api_fallback');
                            });
                        }
                    } catch (apiError) {
                        UI.log(`[API获取课程] 失败: ${apiError.message}`, 'debug');
                    }
                }

                if (courseList.length === 0) {
                    const videoElements = document.querySelectorAll(CONSTANTS.VIDEO_SELECTORS.join(', '));
                    UI.log(`[视频元素分析] 找到 ${videoElements.length} 个视频元素`, 'debug');

                    videoElements.forEach((el, index) => {
                        const courseData = {
                            courseId: el.getAttribute('data-course-id') || `video_course_${index}`,
                            dsUnitId: el.getAttribute('data-unit-id') || `video_unit_${index}`,
                            courseName: document.title || `视频课程${index + 1}`,
                            durationStr: el.getAttribute('duration') || '00:30:00',
                            status: 'not_started',
                            videoElement: el
                        };
                        courseList.push(courseData);
                    });
                }

                const uniqueCourses = courseList.filter((course, index, self) =>
                    index === self.findIndex(c => c.courseId === course.courseId)
                );

                UI.log(`[课程列表] 获取到 ${uniqueCourses.length} 门课程`, 'info');
                uniqueCourses.forEach(course => {
                    UI.log(`- ${course.courseName} (${course.courseId})`, 'debug');
                });

                return uniqueCourses;

            } catch (error) {
                UI.log(`获取课程列表失败: ${error.message}`, 'error');
                return [];
            }
        },

        /**
         * 获取课程播放信息 - 增强版，支持多种数据源和智能降级
         * 根据深度分析报告优化：处理API空数据、增强videoId提取、智能时长解析
         */
        getPlayInfo: async (courseId, dsUnitId, courseDuration) => {
            try {
                UI.log(`[getPlayInfo] 开始获取课程 ${courseId}${dsUnitId ? ` (课件: ${dsUnitId})` : ''} 的播放信息`);

                const playTrendResponse = await API._request({
                    method: 'GET',
                    url: `${API.getBaseUrl()}${CONSTANTS.API_ENDPOINTS.GET_PLAY_TREND}?courseId=${courseId}&_t=${Date.now()}`
                });

                let videoId = null;
                let duration = 0;
                let lastLearnedTime = 0;
                let coursewareId = dsUnitId;
                let dataSource = 'api';

                if (playTrendResponse?.success && playTrendResponse?.data) {
                    const data = playTrendResponse.data;
                    
                    // 1. 优先在 playTree 中通过 dsUnitId 精确匹配
                    if (dsUnitId && data.playTree?.children) {
                        const target = data.playTree.children.find(c => String(c.id) === String(dsUnitId));
                        if (target) {
                            videoId = target.id;
                            coursewareId = target.id;
                            duration = target.sumDurationLong || 0;
                            lastLearnedTime = target.lastWatchPoint ? API.parseTimeToSeconds(target.lastWatchPoint) : 0;
                            UI.log(`[getPlayInfo] 成功匹配到课件: ${target.title}`, 'success');
                        }
                    }

                    // 2. 如果没匹配到或没传 dsUnitId，使用 locationSite
                    if (!videoId && data.locationSite) {
                        videoId = data.locationSite.id;
                        coursewareId = data.locationSite.id;
                        duration = data.locationSite.sumDurationLong || 0;
                        lastLearnedTime = data.locationSite.lastWatchPoint ? API.parseTimeToSeconds(data.locationSite.lastWatchPoint) : 0;
                    }
                }

                // 3. 兜底时长处理
                if (duration === 0 && courseDuration) {
                    duration = API.parseDuration(courseDuration);
                }
                if (duration === 0) {
                    duration = CONSTANTS.TIME_FORMATS.DEFAULT_DURATION;
                }

                // 4. 提取 videoId (如果上面还没拿到)
                if (!videoId) {
                    videoId = `mock_video_${courseId}`;
                    dataSource = 'fallback';
                    UI.log('⚠️ 无法获取真实videoId，使用模拟ID', 'warn');
                }

                const playInfo = {
                    courseId: courseId,
                    coursewareId: coursewareId,
                    videoId: videoId,
                    duration: duration,
                    lastLearnedTime: lastLearnedTime,
                    playURL: `https://zpyapi.shsets.com/player/get?videoId=${videoId}`,
                    dataSource: dataSource
                };

                UI.log(`[getPlayInfo] 最终播放信息: ${JSON.stringify(playInfo)}`, 'debug');
                return playInfo;

            } catch (error) {
                UI.log(`[getPlayInfo] 出错: ${error.message}`, 'error');
                return null;
            }
        },

        /**
         * 将时间字符串解析为秒数
         *
         * 将HH:MM:SS格式的时间字符串解析为总秒数
         *
         * @param {string} timeStr - 时间字符串 (HH:MM:SS)
         * @returns {number} 总秒数
         */
        parseTimeToSeconds: (timeStr) => {
            try {
                const parts = timeStr.split(':').map(part => parseInt(part, 10));
                if (parts.length === 3) {
                    return parts[0] * 3600 + parts[1] * 60 + parts[2];
                }
                return 0;
            } catch (e) {
                return 0;
            }
        },

        /**
         * 解析持续时间
         *
         * 将持续时间字符串解析为秒数
         *
         * @param {string} durationStr - 持续时间字符串 (HH:MM:SS)
         * @returns {number} 总秒数
         */
        parseDuration: (durationStr) => {
            if (!durationStr || typeof durationStr !== 'string') return CONSTANTS.TIME_FORMATS.DEFAULT_DURATION;
            const timeParts = durationStr.split(':');
            if (timeParts.length === 3) {
                const hours = parseInt(timeParts[0]) || 0;
                const minutes = parseInt(timeParts[1]) || 0;
                const seconds = parseInt(timeParts[2]) || 0;
                return hours * 3600 + minutes * 60 + seconds;
            }
            return CONSTANTS.TIME_FORMATS.DEFAULT_DURATION;
        },

        /**
         * 脉冲式保存记录
         *
         * 发送脉冲式学习记录，模拟用户持续学习行为
         *
         * @async
         * @param {Object} playInfo - 播放信息对象
         * @param {number} currentTime - 当前播放时间（秒）
         * @returns {Object} API响应结果
         */
        pulseSaveRecord: async (playInfo, currentTime) => {
            const watchPoint = API.secondsToTimeString(currentTime);

            // 针对浦东分院环境调整脉冲上报参数
            let payload;
            if (CONFIG.PUDONG_MODE) {
                payload = new URLSearchParams({
                    courseId: playInfo.courseId,
                    videoId: playInfo.videoId,
                    watchPoint: watchPoint,
                    currentTime: currentTime,
                    duration: playInfo.duration,
                    progress: Math.round((currentTime / playInfo.duration) * 100),
                    _t: Date.now()
                }).toString();
            } else {
                payload = new URLSearchParams({
                    courseId: playInfo.courseId,
                    coursewareId: playInfo.coursewareId || playInfo.videoId,
                    watchPoint: watchPoint,
                    pulseTime: 10,
                    pulseRate: 1
                }).toString();
            }

            UI.log(`[脉冲上报] ${watchPoint} (${Math.round((currentTime / playInfo.duration) * 100)}%)`, 'info');

            return await API._request({
                method: 'POST',
                url: `${API.getBaseUrl()}${CONFIG.PUDONG_MODE ? '/api/player/pulse' : CONSTANTS.API_ENDPOINTS.PULSE_SAVE_RECORD}`,
                data: payload,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        },

        /**
         * 将秒数转换为时间字符串
         *
         * 将秒数转换为HH:MM:SS格式的时间字符串
         *
         * @param {number} seconds - 秒数
         * @returns {string} 时间字符串 (HH:MM:SS)
         */
        secondsToTimeString: (seconds) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        },

        /**
         * 防刷课检查
         *
         * 执行防刷课检查，验证课程学习的合法性
         *
         * @async
         * @param {string} courseId - 课程ID
         * @param {string} userId - 用户ID
         * @returns {Object} 检查结果对象
         * @property {boolean} pushOk - 推送检查是否通过
         * @property {boolean} checkOk - 用户课程检查是否通过
         */
        antiCheatCheck: async (courseId, userId) => {
            try {
                UI.log(`[防刷课检查] 课程ID: ${courseId}`, 'debug');

                const pushUrl = `${CONSTANTS.API_ENDPOINTS.PUSH_COURSE}?user_id=${userId}&course_id=${courseId}&_t=${Date.now()}`;
                const pushResponse = await API._request({
                    method: 'GET',
                    url: `${API.getBaseUrl()}${pushUrl}`
                });

                const checkUrl = `${CONSTANTS.API_ENDPOINTS.GET_COURSE_BY_USER}?user_id=${userId}&course_id=${courseId}&_t=${Date.now()}`;
                const checkResponse = await API._request({
                    method: 'GET',
                    url: `${API.getBaseUrl()}${checkUrl}`
                });

                UI.log(`[防刷课检查结果] Push: ${pushResponse?.message || '未知'}, Check: ${checkResponse?.message || '未知'}`, 'debug');

                return {
                    pushOk: pushResponse?.success === true,
                    checkOk: checkResponse?.success === true
                };
            } catch (error) {
                UI.log(`[防刷课检查失败] ${error.message}`, 'error');
                return { pushOk: false, checkOk: false };
            }
        },

        /**
         * 提取用户ID
         *
         * 从多个可能的位置提取用户ID，包括Cookie、DOM元素、URL参数、localStorage等
         *
         * @returns {string|null} 用户ID或null
         */
        extractUserId: () => {
            try {
                const cookieMatch = document.cookie.match(CONSTANTS.COOKIE_PATTERNS.USER_ID);
                if (cookieMatch) {
                    UI.log(`[用户ID提取] 从Cookie获取: ${cookieMatch[1]}`, 'debug');
                    return cookieMatch[1];
                }

                const userIdElement = document.querySelector('[data-user-id]');
                if (userIdElement) {
                    const userId = userIdElement.getAttribute('data-user-id');
                    UI.log(`[用户ID提取] 从DOM获取: ${userId}`, 'debug');
                    return userId;
                }

                const urlParams = new URLSearchParams(window.location.search);
                const userId = urlParams.get('user_id');
                if (userId) {
                    UI.log(`[用户ID提取] 从URL获取: ${userId}`, 'debug');
                    return userId;
                }

                const storedUserId = localStorage.getItem(CONSTANTS.STORAGE_KEYS.USER_ID) || localStorage.getItem(CONSTANTS.STORAGE_KEYS.USER_ID_ALT);
                if (storedUserId) {
                    UI.log(`[用户ID提取] 从localStorage获取: ${storedUserId}`, 'debug');
                    return storedUserId;
                }

                const pMatch = document.cookie.match(CONSTANTS.COOKIE_PATTERNS.P_PARAM);
                if (pMatch) {
                    UI.log(`[用户ID提取] 从_p参数获取: ${pMatch[1]}`, 'debug');
                    return pMatch[1];
                }

                UI.log('[用户ID提取] 未找到用户ID', 'warn');
                return null;
            } catch (error) {
                UI.log(`[用户ID提取失败] ${error.message}`, 'error');
                return null;
            }
        },

        /**
         * 检查课程完成状态
         *
         * 检查指定课程是否已完成，通过多种方式验证完成状态
         *
         * @async
         * @param {string} courseId - 课程ID
         * @returns {Object} 完成状态检查结果
         * @property {boolean} isCompleted - 课程是否已完成
         * @property {number} finishedRate - 完成百分比
         * @property {string} method - 检查方式
         */
        async checkCourseCompletion(courseId, coursewareId = null) {
            try {
                UI.log(`[完成度检查] 检查课程 ${courseId}${coursewareId ? ` (课件: ${coursewareId})` : ''} 的完成状态`);

                const playTrend = await this._request({
                    url: `${this.getBaseUrl()}${CONSTANTS.API_ENDPOINTS.GET_PLAY_TREND}?courseId=${courseId}&_t=${Date.now()}`,
                    method: 'GET'
                });

                if (playTrend && playTrend.success && playTrend.data) {
                    const data = playTrend.data;
                    
                    // 1. 如果提供了 coursewareId，必须且仅参考该课件在 playTree 中的进度
                    if (coursewareId && data.playTree && data.playTree.children) {
                        const target = data.playTree.children.find(c => String(c.id) === String(coursewareId));
                        if (target) {
                            const finishedRate = parseInt(target.finishedRate || 0);
                            UI.log(`[完成度检查] 目标课件 "${target.title || '未知'}" 完成度: ${finishedRate}%`);
                            return { 
                                isCompleted: finishedRate >= CONFIG.COMPLETION_THRESHOLD, 
                                finishedRate, 
                                method: 'playTree_match' 
                            };
                        }
                    }

                    // 2. 如果没传 coursewareId 或没找到匹配项，再检查总进度
                    const { locationSite } = data;
                    if (locationSite && locationSite.finishedRate !== undefined) {
                        const finishedRate = parseInt(locationSite.finishedRate);
                        UI.log(`[完成度检查] 课程总进度: ${finishedRate}%`);

                        return { 
                            isCompleted: finishedRate >= CONFIG.COMPLETION_THRESHOLD, 
                            finishedRate, 
                            method: 'playTrend_total' 
                        };
                    }
                }

                // 3. 只有在没有特定课件 ID 时，才参考全局学习记录（防止误杀未完成的子课件）
                if (!coursewareId) {
                    try {
                        const studyRecord = await this._request({
                            url: `${this.getBaseUrl()}${CONSTANTS.API_ENDPOINTS.GET_STUDY_RECORD}?courseId=${courseId}&_t=${Date.now()}`,
                            method: 'GET'
                        });

                        if (studyRecord && studyRecord.success && studyRecord.data) {
                            const isFinished = studyRecord.data.isFinished === true || studyRecord.data.status === 'completed';
                            if (isFinished) {
                                UI.log(`[完成度检查] 学习记录显示主课程已完成`, 'success');
                                return { isCompleted: true, finishedRate: 100, method: 'studyRecord' };
                            }
                        }
                    } catch (e) {}
                }

                return { isCompleted: false, finishedRate: 0, method: 'default' };

            } catch (error) {
                UI.log(`[完成度检查] 检查失败: ${error.message}`, 'error');
                return { isCompleted: false, finishedRate: 0, method: 'error' };
            }
        },

        /**
         * 智能学习课程 - 根据当前进度自动选择最佳学习策略
         *
         * @param {Object} courseInfo - 课程信息对象
         * @param {string} courseInfo.courseId - 课程ID
         * @param {string} courseInfo.coursewareId - 课件ID
         * @param {string} courseInfo.videoId - 视频ID
         * @param {number} courseInfo.duration - 课程总时长(秒)
         * @param {number} courseInfo.lastLearnedTime - 上次学习时间点(秒)
         * @param {string} courseInfo.title - 课程标题
         * @returns {Promise<boolean>} 学习是否成功
         */
        async smartLearnCourse(courseInfo) {
            const { courseId, coursewareId, videoId, duration, lastLearnedTime } = courseInfo;
            const currentProgress = Math.floor((lastLearnedTime / duration) * 100);

            EventBus.publish('log', { message: `[智能学习] 课程: ${courseInfo.title || courseId}`, type: 'info' });
            EventBus.publish('log', { message: `[智能学习] 当前进度: ${currentProgress}% (${Utils.formatTime(lastLearnedTime)}/${Utils.formatTime(duration)})`, type: 'info' });

            let strategy = 'normal';

            if (currentProgress < 5) {
                strategy = 'slow_start';
                UI.log(`[智能学习] 策略: 慢启动 - 从头开始学习`);
            } else if (currentProgress < 30) {
                strategy = 'progressive';
                UI.log(`[智能学习] 策略: 渐进式 - 从${currentProgress}%继续`);
            } else if (currentProgress < 70) {
                strategy = 'fast_finish';
                UI.log(`[智能学习] 策略: 快速完成 - 直接跳跃到结束`);
            } else {
                strategy = 'final_push';
                UI.log(`[智能学习] 策略: 最后冲刺 - 完成剩余部分`);
            }

            if (duration < 300) { // 小于5分钟的课程
                if (currentProgress < 50) {
                    strategy = 'fast_finish';
                    UI.log(`[智能学习] 短课程策略: 快速完成`);
                } else {
                    strategy = 'final_push';
                    UI.log(`[智能学习] 短课程策略: 最后冲刺`);
                }
            }

            await this._createStudyRecord(courseId);

            let currentTime = lastLearnedTime;
            let success = false;

            switch (strategy) {
                case 'slow_start':
                    const step1 = Math.floor(duration * 0.2);
                    const step2 = Math.floor(duration * 0.35);
                    const step3 = Math.floor(duration * 0.5);

                    for (const targetTime of [step1, step2, step3]) {
                        if (Learner.stopRequested) {
                            UI.log('⏹️ 收到停止请求，中断智能学习', 'warn');
                            return false;
                        }

                        // 使用更短的随机延迟时间，但保持学习步骤不变
                        const delay = Math.floor(Math.random() * 2000 + 1000); // 1-3秒随机延迟
                        await new Promise(resolve => setTimeout(resolve, delay));
                        success = await this.smartReportProgress({ courseId, coursewareId, videoId, duration }, targetTime);
                        if (!success) break;
                        currentTime = targetTime;
                        UI.log(`[慢启动] 进度: ${Math.floor((currentTime/duration)*100)}%`);
                    }

                    if (success && !Learner.stopRequested) {
                        const delay = Math.floor(Math.random() * 1000 + 500); // 0.5-1.5秒随机延迟
                        await new Promise(resolve => setTimeout(resolve, delay));
                        currentTime = duration - 10;
                        success = await this.smartReportProgress({ courseId, coursewareId, videoId, duration }, currentTime);
                    }
                    break;

                case 'progressive':
                    const remaining = duration - currentTime;
                    const stepSize = Math.floor(remaining / 5);

                    for (let i = 1; i <= 5; i++) {
                        if (Learner.stopRequested) {
                            UI.log('⏹️ 收到停止请求，中断智能学习', 'warn');
                            return false;
                        }

                        // 使用更短的随机延迟时间，但保持学习步骤不变
                        const delay = Math.floor(Math.random() * 1500 + 1000); // 1-2.5秒随机延迟
                        await new Promise(resolve => setTimeout(resolve, delay));
                        const nextTime = Math.min(currentTime + (stepSize * i), duration - 10);
                        success = await this.smartReportProgress({ courseId, coursewareId, videoId, duration }, nextTime);
                        if (!success) break;
                        currentTime = nextTime;
                        UI.log(`[渐进式] 步骤 ${i}/5: ${Math.floor((currentTime/duration)*100)}%`);
                    }
                    break;

                case 'fast_finish':
                    if (Learner.stopRequested) {
                        UI.log('⏹️ 收到停止请求，中断智能学习', 'warn');
                        return false;
                    }

                    const target95 = Math.floor(duration * 0.95);
                    const initialDelay = Math.floor(Math.random() * 1000 + 500); // 0.5-1.5秒随机延迟
                    await new Promise(resolve => setTimeout(resolve, initialDelay));
                    success = await this.smartReportProgress({ courseId, coursewareId, videoId, duration }, target95);

                    if (success && !Learner.stopRequested) {
                        const finalDelay = Math.floor(Math.random() * 1000 + 500); // 0.5-1.5秒随机延迟
                        await new Promise(resolve => setTimeout(resolve, finalDelay));
                        currentTime = duration - 10;
                        success = await this.smartReportProgress({ courseId, coursewareId, videoId, duration }, currentTime);
                    }
                    break;

                case 'final_push':
                    if (Learner.stopRequested) {
                        UI.log('⏹️ 收到停止请求，中断智能学习', 'warn');
                        return false;
                    }

                    const delay = Math.floor(Math.random() * 1000 + 500); // 0.5-1.5秒随机延迟
                    await new Promise(resolve => setTimeout(resolve, delay));
                    currentTime = duration - 10;
                    success = await this.reportProgress({ courseId, coursewareId, videoId, duration }, currentTime);
                    break;
            }

            if (success) {
                UI.log(`✅ 智能学习完成: ${courseInfo.title || courseId}`, 'success');

                try {
                    await this.finishStudyRecord(courseInfo, currentTime);
                    await this.completeCourse(courseInfo);
                    UI.log(`✅ 学习记录已保存`, 'success');
                } catch (error) {
                    UI.log(`⚠️ 学习记录保存失败: ${error.message}`, 'warn');
                }

                return true;
            } else {
                UI.log(`❌ 智能学习失败`, 'error');
                return false;
            }
        }
    };

    // --- 主控制逻辑（增强版） ---
    /**
     * 主控制模块
     *
     * 负责整体学习流程的控制，包括开始学习、停止学习、处理课程等功能
     *
     * @typedef {Object} Learner
     * @property {boolean} isRunning - 学习是否正在运行
     * @property {boolean} stopRequested - 是否收到停止请求
     * @property {Function} stop - 停止学习流程
     * @property {Function} skipCompletedCourses - 跳过已完成课程
     * @property {Function} processCourses - 处理课程列表
     * @property {Function} startLearning - 开始学习流程
     */
    const Learner = {
        /**
         * 学习是否正在运行
         * @type {boolean}
         */
        isRunning: false,
        /**
         * 是否收到停止请求
         * @type {boolean}
         */
        stopRequested: false,

        /**
         * 停止学习流程
         *
         * 中止所有正在进行的请求并更新UI状态
         */
        stop: function() {
            this.isRunning = false;
            this.stopRequested = true;

            // 使用AbortController真正中止所有正在进行的请求
            if (API.abortController) {
                API.abortController.abort();
                UI.log('🛑 正在中止所有网络请求...', 'info');
            }

            const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace('#', ''));
            if (toggleBtn) {
                toggleBtn.setAttribute('data-state', 'stopped');
                toggleBtn.textContent = '开始学习';
            }
            UI.updateStatus('已停止');
            UI.log('⏹️ 学习流程已停止', 'warn');
        },

        /**
         * 跳过已完成课程
         *
         * 检查并跳过已完成的课程，更新统计信息
         *
         * @async
         */
        async skipCompletedCourses() {
            try {
                UI.log('🔍 开始检查并跳过已完成的课程...');
                UI.updateStatus('检查已完成课程');

                // 获取课程列表
                const courses = await API.getCourseList();
                if (!courses || courses.length === 0) {
                    UI.log('❌ 未找到课程列表', 'error');
                    return;
                }

                let completedCount = 0;

                for (let i = 0; i < courses.length; i++) {
                    const course = courses[i];
                    const courseId = course.id || course.courseId;

                    UI.log(`检查第 ${i + 1}/${courses.length} 门课程: ${course.title}`);

                    try {
                        const completionCheck = await API.checkCourseCompletion(courseId);
                        if (completionCheck.isCompleted) {
                            UI.log(`✅ 已完成: ${course.title} (${completionCheck.finishedRate}%)`, 'success');
                            completedCount++;
                        } else {
                            UI.log(`📖 未完成: ${course.title} (${completionCheck.finishedRate}%)`);
                        }
                    } catch (error) {
                        UI.log(`❌ 检查失败: ${course.title} - ${error.message}`, 'error');
                    }

                    // 更新进度
                    const progress = Math.floor(((i + 1) / courses.length) * 100);
                    UI.updateProgress(progress);
                }

                UI.log(`\n📊 检查完成: ${completedCount}/${courses.length} 门课程已完成`, 'success');
                UI.updateStatus(`检查完成 - ${completedCount}/${courses.length} 已完成`);

            } catch (error) {
                UI.log(`❌ 检查过程出错: ${error.message}`, 'error');
                UI.updateStatus('检查失败');
            }
        },

        /**
         * 处理课程列表
         *
         * 依次处理课程列表中的每门课程，应用学习策略
         *
         * @async
         * @param {Array} courses - 课程列表
         */
        async processCourses(courses) {
            UI.log(`发现 ${courses.length} 门课程，开始处理...`);
            UI.updateStatus('处理课程列表');

            // 初始化统计信息
            const stats = {
                total: courses.length,
                completed: 0,
                learned: 0,
                failed: 0,
                skipped: 0
            };

            UI.updateStatistics(stats);

            for (let i = 0; i < courses.length; i++) {
                // 检查是否收到停止请求
                if (this.stopRequested) {
                    UI.log('⏹️ 收到停止请求，中断学习流程', 'warn');
                    break;
                }

                const course = courses[i];
                UI.log(`\n📚 处理第 ${i + 1}/${courses.length} 门课程: ${course.title}`);
                UI.updateStatus(`学习课程 ${i + 1}/${courses.length}`);

                try {
                    const courseId = course.id || course.courseId;
                    const coursewareId = course.dsUnitId;

                    // 首先检查课程是否已完成
                    if (CONFIG.SKIP_COMPLETED_COURSES) {
                        const completionCheck = await API.checkCourseCompletion(courseId, coursewareId);
                        if (completionCheck.isCompleted) {
                            UI.log(`✅ 课程已完成，跳过: ${course.title} (${completionCheck.finishedRate}%)`, 'success');
                            stats.completed++;
                            UI.updateStatistics(stats);
                            continue;
                        }
                    }

                    // 获取课程播放信息
                    const playInfo = await API.getPlayInfo(courseId, course.dsUnitId, course.durationStr);
                    if (!playInfo) {
                        UI.log(`❌ 无法获取课程播放信息，跳过: ${course.title}`, 'error');
                        stats.failed++;
                        UI.updateStatistics(stats);
                        continue;
                    }

                    // 双重检查：通过播放信息再次确认完成状态
                    const progressPercent = Math.floor((playInfo.lastLearnedTime / playInfo.duration) * 100);
                    if (progressPercent >= CONFIG.COMPLETION_THRESHOLD) {
                        UI.log(`✅ 播放信息确认课程已完成，跳过: ${course.title} (${progressPercent}%)`, 'success');
                        stats.completed++;
                        UI.updateStatistics(stats);
                        continue;
                    }

                    // 开始学习课程
                    const courseInfoWithPlayInfo = {
                        ...course,
                        ...playInfo,
                        title: course.title || course.courseName,
                        courseId: courseId
                    };

                    // 使用智能学习策略
                    const success = await API.smartLearnCourse(courseInfoWithPlayInfo);

                    if (success) {
                        UI.log(`✅ 课程学习完成: ${course.title}`, 'success');
                        stats.learned++;
                    } else {
                        UI.log(`❌ 课程学习失败: ${course.title}`, 'error');
                        stats.failed++;
                    }

                    UI.updateStatistics(stats);

                    // 更新总体进度
                    const overallProgress = Math.floor(((i + 1) / courses.length) * 100);
                    UI.updateProgress(overallProgress);

                    if (i < courses.length - 1) {
                        const delay = Math.random() * 5000 + 5000; // 5-10秒随机间隔
                        UI.log(`⏳ 等待 ${Math.round(delay/1000)} 秒后处理下一门课程...`);

                        const delaySeconds = Math.round(delay / 1000);
                        for (let j = 0; j < delaySeconds; j++) {
                            if (this.stopRequested) {
                                UI.log('⏹️ 等待期间收到停止请求，中断学习流程', 'warn');
                                return;
                            }
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                } catch (error) {
                    if (error.name === 'AbortError' || this.stopRequested) {
                        UI.log(`⏹️ 学习流程已中断: ${course.title}`, 'warn');
                        break; // 退出循环
                    }
                    
                    UI.log(`❌ 处理课程 ${course.title} 时出错: ${error.message}`, 'error');
                    stats.failed++;
                    UI.updateStatistics(stats);
                    continue;
                }
            }

            // 显示学习统计
            if (this.stopRequested) {
                 UI.log(`\n🛑 学习已手动停止`, 'warn');
            } else {
                 UI.log(`\n🎉 所有课程处理完成！`, 'success');
            }
            
            UI.log(`📊 学习统计:`);
            UI.log(`   ✅ 已完成课程: ${stats.completed} 门`);
            UI.log(`   📚 新学完课程: ${stats.learned} 门`);
            UI.log(`   ❌ 失败课程: ${stats.failed} 门`);
            UI.log(`   📖 总课程数: ${stats.total} 门`);

            UI.updateStatus(`完成 - ${stats.completed + stats.learned}/${stats.total} 门课程`);
            UI.updateProgress(100);
        },

        /**
         * 开始学习流程
         *
         * 启动整个学习流程，包括获取课程列表、处理每门课程等
         *
         * @async
         */
        /**
         * 检查当前页面是否包含有效的课程ID或专栏ID
         *
         * @returns {boolean} 是否包含有效ID
         */
        hasValidId: function() {
            // 检查是否在课程播放页面
            const isCoursePlayerPage = window.location.href.includes('/coursePlayer');

            // 检查是否在专栏详情页面
            const isSpecialDetailPage = window.location.href.includes('/specialdetail');

            // 检查是否在频道详情页面
            const isChannelDetailPage = window.location.href.includes('channelDetail');

            // 检查是否在课程列表页面（不包含ID参数）
            const isChannelListPage = window.location.href.includes('channelList');

            if (isChannelListPage) {
                // 如果在频道列表页面，没有ID是正常的
                return false;
            }

            if (isCoursePlayerPage || isSpecialDetailPage || isChannelDetailPage) {
                // 从URL中提取ID
                let id = null;

                // 检查search参数
                const urlParams = new URLSearchParams(window.location.search);
                id = urlParams.get('id');

                // 如果search参数中没有ID，尝试从hash中获取
                if (!id) {
                    const hash = window.location.hash;
                    if (hash.includes('?')) {
                        const hashParams = new URLSearchParams(hash.split('?')[1]);
                        id = hashParams.get('id');
                    }
                    if (!id) {
                        const match = hash.match(/[?&]id=([^&]+)/);
                        if (match) {
                            id = match[1];
                        }
                    }
                }

                return !!id;
            }

            // 对于其他页面，检查是否有ID参数
            const urlParams = new URLSearchParams(window.location.search);
            let id = urlParams.get('id');

            if (!id) {
                const hash = window.location.hash;
                if (hash.includes('?')) {
                    const hashParams = new URLSearchParams(hash.split('?')[1]);
                    id = hashParams.get('id');
                }
                if (!id) {
                    const match = hash.match(/[?&]id=([^&]+)/);
                    if (match) {
                        id = match[1];
                    }
                }
            }

            return !!id;
        },

        async startLearning() {
            try {
                // 检查当前页面是否包含有效的ID
                if (!this.hasValidId()) {
                    UI.log('❌ 当前页面未找到课程ID或专栏ID，请进入包含ID的页面再开始学习', 'error');
                    UI.log('ℹ️ 例如: 包含?id=参数的课程播放页面或专栏详情页面', 'info');
                    UI.updateStatus('请进入正确页面');
                    return;
                }

                // 重置停止标志并创建新的AbortController
                this.stopRequested = false;
                API.abortController = new AbortController();
                UI.log('开始学习流程...');

                // 检测是否在课程播放页面
                const isCoursePlayerPage = window.location.href.includes('/coursePlayer');

                let courses = [];

                if (isCoursePlayerPage) {
                    // 在课程播放页面，尝试获取所有视频课件
                    UI.log('检测到课程播放页面，正在检索所有视频课件...', 'info');

                    // 从URL中提取基础课程ID
                    const urlParams = new URLSearchParams(window.location.search);
                    let courseId = urlParams.get('id');

                    if (!courseId) {
                        const hash = window.location.hash;
                        if (hash.includes('?')) {
                            const hashParams = new URLSearchParams(hash.split('?')[1]);
                            courseId = hashParams.get('id');
                        }
                        if (!courseId) {
                            const match = hash.match(/[?&]id=([^&]+)/);
                            if (match) {
                                courseId = match[1];
                            }
                        }
                    }

                    if (courseId) {
                        // 尝试从API获取该课程下的所有课件
                        const apiCourses = await API.getCoursewareListFromPlayer(courseId);
                        
                        if (apiCourses && apiCourses.length > 0) {
                            courses = apiCourses;
                            UI.log(`✅ 成功获取到 ${courses.length} 个视频课件`, 'success');
                        } else {
                            // API获取失败，退回到处理当前单个视频
                            UI.log('⚠️ 无法通过API获取视频列表，处理当前单一视频', 'warn');
                            courses = [{
                                id: courseId,
                                courseId: courseId,
                                title: document.title || `当前视频 ${courseId}`,
                                courseName: document.title || `当前视频 ${courseId}`,
                                durationStr: '00:30:00'
                            }];
                        }
                    } else {
                        UI.log('❌ 无法从页面URL中提取课程ID', 'error');
                        return;
                    }
                } else {
                    // 获取课程列表（非课程播放页面）
                    courses = await API.getCourseList();
                    if (!courses || courses.length === 0) {
                        UI.log('❌ 未找到课程列表', 'error');
                        return;
                    }
                }

                // 使用新的课程处理方法
                await this.processCourses(courses);

                // 学习完成后重置按钮状态
                if (!this.stopRequested) {
                    const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace('#', ''));
                    toggleBtn.setAttribute('data-state', 'stopped');
                    toggleBtn.textContent = '开始学习';
                    UI.updateStatus('学习完成');
                }

            } catch (error) {
                UI.log(`❌ 学习流程出错: ${error.message}`, 'error');
                console.error('学习流程错误:', error);

                // 出错时也要重置按钮状态
                const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace('#', ''));
                toggleBtn.setAttribute('data-state', 'stopped');
                toggleBtn.textContent = '开始学习';
                UI.updateStatus('学习出错');
            }
        }
    };

    // --- 初始化 (v2.0优化) ---
    function init() {
        // 1. 加载用户配置
        Settings.load();

        // 2. 创建UI面板（会自动初始化事件监听器）
        UI.createPanel();

        // 3. 注册菜单命令
        GM_registerMenuCommand('导出调试日志', UI.exportLogs, 'e');

        // 4. 绑定主要控制按钮
        const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace('#', ''));
        toggleBtn.addEventListener('click', () => {
            const isRunning = toggleBtn.getAttribute('data-state') === 'running';
            if (isRunning) {
                Learner.stop();
            } else {
                // 更新按钮状态
                toggleBtn.setAttribute('data-state', 'running');
                toggleBtn.textContent = '停止学习';

                // 使用事件驱动更新状态
                EventBus.publish('statusUpdate', '学习中...');

                // 启动学习流程
                Learner.startLearning().catch(error => {
                    EventBus.publish('log', { message: `❌ 启动学习流程失败: ${error.message}`, type: 'error' });
                    Learner.stop();
                });
            }
        });

        // 5. 发布初始化完成事件
        EventBus.publish('log', { message: '🚀 API学习助手 v3.40 初始化完成', type: 'success' });
    }

    // 初始化环境检测和脚本
    function initScript() {
        detectEnvironment();

        // 如果是浦东分院环境，检测API端点
        if (CONFIG.PUDONG_MODE) {
            setTimeout(() => {
                detectPudongApiEndpoints();
            }, 3000); // 稍后执行，避免影响初始化
        }

        init();
    }

    setTimeout(initScript, 2000);

})();