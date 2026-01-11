// ==UserScript==
// @name         cela-自动学习脚本API版
// @namespace    https://github.com/Moker32/
// @version      3.50
// @description  [API版] 中国干部网络学院自动学习脚本，支持主站及浦东分院，采用状态机驱动的极简高效架构。
// @author       Moker32
// @license      GPL-3.0-or-later
// @grant        GM_getValue
// @grant        GM_setValue
// @match        *://cela.e-celap.cn/*
// @match        *://pudong.e-celap.cn/*
// @match        *://pd.cela.cn/*
// @match        *://*.e-celap.cn/*
// @match        *://www.cela.gov.cn/*
// @match        *://cela.gwypx.com.cn/*
// @match        *://cela.cbead.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      cela.e-celap.cn
// @connect      pudong.e-celap.cn
// @connect      pd.cela.cn
// @connect      cela.gwypx.com.cn
// @connect      cela.cbead.cn
// @connect      www.cela.gov.cn
// @connect      zpyapi.shsets.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542254/cela-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%ACAPI%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542254/cela-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%ACAPI%E7%89%88.meta.js
// ==/UserScript==

/**
 * CELA 自动学习脚本 API 版
 *
 * 本脚本通过直接调用 CELA 平台后端 API 实现自动化学习逻辑，
 * 核心支持浦东分院环境，采用状态机驱动架构，具备极高的执行效率与稳定性。
 *
 * 主要特性：
 * - 极简 API 驱动：基于真实接口分析，单端点同步进度，解决 20001 拦截异常。
 * - 状态机架构：引入 LEARNER_STATES 显式管理异步流程，杜绝逻辑竞态。
 * - 性能优化：实现已完成课程的“零秒切换”，无谓等待时间降至最低。
 * - 环境识别：自动区分门户、浦东分院及暂不支持的其他分支。
 * - 现代化 UI：常量驱动的 EventBus 设计，实时反馈任务进度与统计。
 *
 * @author Moker32
 * @version 3.50
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
         * 事件名称定义
         */
        EVENTS: {
            LOG: 'log',
            STATUS_UPDATE: 'statusUpdate',
            PROGRESS_UPDATE: 'progressUpdate',
            STATISTICS_UPDATE: 'statisticsUpdate'
        },
        /**
         * API端点配置
         * 定义所有与学习相关的API端点
         */
        API_ENDPOINTS: {
            GET_PLAY_TREND: '/inc/nc/course/play/getPlayTrend',      // 获取播放趋势信息
            PULSE_SAVE_RECORD: '/inc/nc/course/play/pulseSaveRecord', // 进度同步上报
            GET_STUDY_RECORD: '/inc/nc/course/getStudyRecord',
            GET_COURSEWARE_DETAIL: '/inc/nc/course/play/getCoursewareDetail', // 获取课件详情
            GET_PACK_BY_ID: '/inc/nc/pack/getById',                   // 根据ID获取包信息
            GET_COURSE_LIST: '/api/course/list'                      // 获取课程列表
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
            '.dsf-many-schedule-course-list-row', '.dsf_nc_pd_special_item',
            '[class*="course"]', '[data-course]', '.course-item', '.lesson-item',
            '.el-card', '.el-card__body', '.course-card', '.course-box',
            '.nc-course-item', '.study-item', '.learn-item',
            '[class*="item"]', '[class*="card"]', '[data-id]',
            '.pudong-course', '.pd-course', '.dsf-course',
            '.dsjy_card', '.item_content', '.class-item-desc'
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

    /**
     * 浦东分院专用处理器
     * 集中管理浦东分院的页面识别、选择器配置及特殊逻辑
     */
    const PudongHandler = {
        /**
         * 页面类型定义
         */
        PAGE_TYPES: {
            INDEX: 'index',           // 首页/综合页
            COLUMN: 'column',         // 专栏页 (zgpdyxkc 等)
            PLAYER: 'player',         // 播放页
            UNKNOWN: 'unknown'
        },

        /**
         * 选择器配置
         */
        SELECTORS: {
            // 课程列表项
            COURSE_ITEMS: [
                '.dsf_nc_zg_item',                // 职工培训专栏
                '.dsf_nc_pd_course_express_item', // 首页课程速递
                '.dsf-many-schedule-course-list-row', // 常见列表行
                '.dsf_nc_pd_special_item',        // 浦东专题项
                '.pd_course_item',                // 浦东课程项 (备用)
                '.dsjy_card'                      // 党史教育卡片
            ],
            // 进入学习按钮
            ENTER_BTN: '.course-enter-btn', // 需进一步确认
            // 播放器容器
            PLAYER_CONTAINER: '#coursePlayer'
        },

        /**
         * 识别当前页面类型
         * @returns {string} 页面类型
         */
        identifyPage: function() {
            const url = window.location.href;
            if (url.includes('coursePlayer')) return this.PAGE_TYPES.PLAYER;
            if (url.includes('/pc/nc/page/pd/') || 
                url.includes('zgpdyxkc') || 
                url.includes('specialcolumn') || 
                url.includes('channelDetail')) return this.PAGE_TYPES.COLUMN;
            if (url.includes('/pc/nc/pagehome/index')) return this.PAGE_TYPES.INDEX;
            return this.PAGE_TYPES.UNKNOWN;
        },

        /**
         * 初始化处理器
         */
        init: function() {
            if (!this.isPudongMode()) return;
            console.log('🏗️ 浦东分院处理器已激活');
            this.handle();
        },

        /**
         * 主处理逻辑分发
         */
        handle: function() {
            const pageType = this.identifyPage();
            console.log(`🧭 识别为浦东页面类型: ${pageType}`);

            // 核心逻辑分发
            if (pageType === this.PAGE_TYPES.INDEX) {
                console.log('🏠 执行浦东首页处理逻辑');
            } else if (pageType === this.PAGE_TYPES.COLUMN) {
                console.log('📑 执行浦东专栏页处理逻辑');
            } else if (pageType === this.PAGE_TYPES.PLAYER) {
                console.log('▶️ 执行浦东播放页处理逻辑');
            } else {
                console.log('⚠️ 未知页面类型，跳过处理');
            }
        },

        /**
         * 检测是否为浦东分院模式
         */
        isPudongMode: function() {
            return CONFIG.PUDONG_MODE || false;
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
         * @property {string} LEARNING_STRATEGY - 学习策略 ('default': 默认学习模式)
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
            LEARNING_STRATEGY: 'default',                    // 默认学习模式
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
            IS_PORTAL: false,                             // 是否为门户页面
            SUPER_FAST_MODE: true,                        // 极速模式：单次上报直接完成

            // === 内部状态 ===
            FAST_LEARNING_MODE: true                      // 极速模式标志
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
                            EventBus.publish(CONSTANTS.EVENTS.LOG, { message: '✅ 使用固定配置：默认学习模式', type: 'success' });
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

        // 1. 检测是否为门户网站
        if (hostname === 'www.cela.gov.cn' || href.includes('cela.gov.cn/home')) {
            CONFIG.IS_PORTAL = true;
            console.log('🏠 检测到中国干部网络学院门户页面');
        }

        // 2. 检测是否为浦东分院 (当前核心支持环境)
        if (hostname.includes('pudong') ||
            hostname.includes('pd.') ||
            hostname === 'cela.e-celap.cn') {
            CONFIG.PUDONG_MODE = true;
            console.log('🏢 检测到浦东分院环境');
        }

        // 3. 检测暂不支持的分院
        if (hostname.includes('gwypx.com.cn')) {
            CONFIG.UNSUPPORTED_BRANCH = '党校分院';
        } else if (hostname.includes('cbead.cn')) {
            CONFIG.UNSUPPORTED_BRANCH = '企业分院';
        }

        // 设置API基础URL
        if (CONFIG.PUDONG_MODE) {
            // 如果已经在 cela.e-celap.cn，直接使用相对路径或当前域名
            CONFIG.PUDONG_API_BASE = `https://${hostname}`;
        }

        console.log(`🌐 当前环境: ${CONFIG.PUDONG_MODE ? '浦东分院' : '未知或门户环境'} (${hostname})`);
        
        // 处理不兼容提示
        setTimeout(() => {
            if (typeof UI === 'undefined' || !UI.setIncompatible) return;

            if (CONFIG.UNSUPPORTED_BRANCH) {
                UI.setIncompatible(`当前检测到【${CONFIG.UNSUPPORTED_BRANCH}】，本脚本暂不支持该环境，请联系开发者适配。`);
            } else if (CONFIG.IS_PORTAL) {
                UI.setIncompatible('门户网站仅用于信息展示，不支持自动学习，请进入具体的学习平台。');
            } else if (!CONFIG.PUDONG_MODE) {
                UI.setIncompatible('当前域名未被识别为受支持的学习环境，脚本已停止加载。');
            } else if (href.includes('pagehome/index')) {
                UI.setIncompatible('首页不支持自动学习，请进入具体的课程列表或详情页。');
            }
        }, 1500);
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
                    cela学习助手 v3.50
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
                    <div class="feature-note">✨ 默认学习模式 + 自动记录</div>
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
            EventBus.subscribe(CONSTANTS.EVENTS.LOG, ({ message, type }) => this.log(message, type));
            EventBus.subscribe(CONSTANTS.EVENTS.STATUS_UPDATE, status => this.updateStatus(status));
            EventBus.subscribe(CONSTANTS.EVENTS.PROGRESS_UPDATE, progress => this.updateProgress(progress));
            EventBus.subscribe(CONSTANTS.EVENTS.STATISTICS_UPDATE, stats => this.updateStatistics(stats));
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
                #api-learner-panel { 
                    all: initial !important; 
                    position: fixed !important; 
                    bottom: 20px !important; 
                    right: 20px !important; 
                    left: auto !important;
                    top: auto !important;
                    width: 400px !important; 
                    height: auto !important;
                    min-height: 200px !important; /* 设定最小高度，保证初始感官一致 */
                    margin: 0 !important;
                    padding: 0 !important;
                    transform: none !important; /* 防止外部缩放或平移干扰 */
                    zoom: 1 !important; /* 防止有些网站设置了全局缩放 */
                    background: #ffffff !important; 
                    border: 1px solid #dddddd !important; 
                    border-radius: 8px !important; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; 
                    z-index: 2147483647 !important; 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important; 
                    font-size: 14px !important; 
                    color: #333333 !important;
                    line-height: 1.5 !important;
                    text-align: left !important;
                    box-sizing: border-box !important;
                    display: flex !important;
                    flex-direction: column !important;
                    overflow: hidden !important;
                }
                #api-learner-panel * { 
                    all: unset !important; 
                    box-sizing: border-box !important; 
                    font-family: inherit !important;
                    background: transparent !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: none !important;
                }
                #api-learner-panel *:before, #api-learner-panel *:after { 
                    content: none !important; 
                    display: none !important;
                }
                #api-learner-panel .header { 
                    display: block !important;
                    background: #f7f7f7 !important; 
                    padding: 10px 15px !important; 
                    font-weight: bold !important; 
                    border-bottom: 1px solid #ddd !important; 
                    width: 100% !important;
                }
                #api-learner-panel .content { 
                    display: block !important;
                    padding: 15px !important; 
                    width: 100% !important;
                    background: #ffffff !important;
                    flex-grow: 1 !important;
                }
                #api-learner-panel .status { 
                    display: block !important;
                    margin-bottom: 10px !important; 
                    font-weight: bold !important; 
                }
                #api-learner-panel .statistics { 
                    display: flex !important; 
                    justify-content: space-between !important; 
                    margin-bottom: 10px !important; 
                    padding: 8px !important; 
                    background: #f9f9f9 !important; 
                    border-radius: 4px !important; 
                    font-size: 12px !important; 
                    width: 100% !important;
                }
                #api-learner-panel .stat-item { 
                    display: block !important;
                    text-align: center !important; 
                    flex: 1 !important; 
                }
                #api-learner-panel .progress-bar { 
                    display: block !important;
                    height: 8px !important; 
                    background: #eeeeee !important; 
                    border-radius: 4px !important; 
                    overflow: hidden !important; 
                    margin-bottom: 10px !important; 
                    width: 100% !important;
                }
                #api-learner-panel #learner-progress-inner { 
                    display: block !important;
                    height: 100% !important; 
                    width: 0% !important; 
                    background: #4caf50 !important; 
                    transition: width 0.3s ease !important; 
                }
                #api-learner-panel .log-container { 
                    display: block !important;
                    height: 150px !important; /* 固定高度，确保面板整体大小更一致 */
                    overflow-y: auto !important; 
                    background: #fafafa !important; 
                    padding: 8px !important; 
                    border: 1px solid #eeeeee !important; 
                    border-radius: 4px !important; 
                    font-size: 11px !important; 
                    line-height: 1.4 !important; 
                    font-family: monospace !important; 
                    width: 100% !important;
                }
                #api-learner-panel .log-entry { 
                    display: block !important;
                    margin-bottom: 4px !important; 
                    border-left: 2px solid #ccc !important; 
                    padding-left: 6px !important; 
                    word-break: break-all !important;
                }
                #api-learner-panel .log-entry.error { color: #f44336 !important; border-left-color: #f44336 !important; }
                #api-learner-panel .log-entry.success { color: #4caf50 !important; border-left-color: #4caf50 !important; }
                #api-learner-panel .log-entry.warn { color: #ff9800 !important; border-left-color: #ff9800 !important; }
                #api-learner-panel .log-entry.info { color: #2196f3 !important; border-left-color: #2196f3 !important; }
                #api-learner-panel .footer { 
                    display: block !important;
                    padding: 10px 15px !important; 
                    border-top: 1px solid #dddddd !important; 
                    text-align: right !important; 
                    width: 100% !important;
                    background: #ffffff !important;
                }
                #api-learner-panel button { 
                    display: inline-block !important;
                    padding: 8px 16px !important; 
                    border-radius: 4px !important; 
                    cursor: pointer !important; 
                    font-size: 13px !important; 
                    font-weight: bold !important;
                    line-height: 1.2 !important;
                    background-color: #2196f3 !important;
                    color: #ffffff !important;
                    margin-left: 8px !important;
                    vertical-align: middle !important;
                }
                #api-learner-panel button#toggle-learning-btn[data-state="running"] {
                    background-color: #f44336 !important;
                }
                #api-learner-panel .feature-note { 
                    display: block !important;
                    font-size: 11px !important; 
                    color: #666666 !important; 
                    margin-top: 8px !important; 
                    text-align: center !important; 
                    width: 100% !important;
                }
            `;
            const styleSheet = document.createElement('style');
            styleSheet.type = 'text/css';
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        },
        /**
         * 设置页面为不兼容状态
         *
         * 在状态栏显示警告并记录原因
         *
         * @param {string} reason - 不兼容的具体原因
         */
        setIncompatible: (reason) => {
            UI.updateStatus('⚠️ 当前页面暂不兼容');
            UI.log(`[兼容性检查] ${reason}`, 'warn');
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
     * 仅保留极速完成模式
     *
     * @typedef {Object} LearningStrategies
     * @property {Function} instant_finish - 即时完成策略：直接上报到99%
     */
    const LearningStrategies = {
        /**
         * 即时完成策略：单次上报直接达到 99% 并完成
         *
         * @async
         * @param {Object} context - 学习上下文对象
         * @returns {boolean} 是否成功
         */
        async instant_finish(context) {
            const { duration } = context;
            EventBus.publish(CONSTANTS.EVENTS.LOG, { message: '🚀 采用极速完成策略 - 直接冲刺', type: 'info' });

            if (Learner.stopRequested) return false;

            const delay = Math.floor(Math.random() * 500 + 500); // 0.5-1.0秒小延迟
            await new Promise(resolve => setTimeout(resolve, delay));
            const finalTime = Math.max(0, duration - 30);
            return await API.reportProgressWithDelay(context.playInfo, finalTime);
        }
    };

    /**
     * 工具函数模块
     *
     * 提供各种实用的辅助函数
     *
     * @typedef {Object} Utils
     * @property {Function} formatTime - 将秒数格式化为时:分:秒格式
     * @property {Function} parseTimeToSeconds - 将时间字符串解析为秒数
     * @property {Function} parseDuration - 解析持续时间
     */
    const Utils = {
        /**
         * 将秒数格式化为时:分:秒格式
         * @param {number} seconds - 秒数
         * @returns {string} 格式化后的时间字符串 (HH:MM:SS)
         */
        formatTime: function(seconds) {
            if (!seconds || seconds < 0) return '00:00:00';
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        },

        /**
         * 将时间字符串解析为秒数
         * @param {string} timeStr - 时间字符串 (HH:MM:SS)
         * @returns {number} 总秒数
         */
        parseTimeToSeconds: function(timeStr) {
            try {
                if (!timeStr) return 0;
                const parts = timeStr.split(':').map(part => parseInt(part, 10));
                if (parts.length === 3) {
                    return parts[0] * 3600 + parts[1] * 60 + parts[2];
                }
                return 0;
            } catch {
                return 0;
            }
        },

        /**
         * 解析持续时间字符串
         * @param {string} durationStr - 持续时间字符串
         * @returns {number} 秒数
         */
        parseDuration: function(durationStr) {
            if (!durationStr || typeof durationStr !== 'string') return CONSTANTS.TIME_FORMATS.DEFAULT_DURATION;
            return this.parseTimeToSeconds(durationStr) || CONSTANTS.TIME_FORMATS.DEFAULT_DURATION;
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
        return new Promise((resolve) => {
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
                dsUnitId: raw.dsUnitId || raw.unitId || (raw.unitOrder && raw.order ? `unit_${raw.unitOrder}_${raw.order}` : 'unit_default'),
                title: raw.name || raw.title || raw.courseName || '未命名课程',
                courseName: raw.name || raw.title || raw.courseName || '未命名课程',
                teacher: raw.teacher || '',
                durationStr: raw.duration || raw.durationStr || raw.timeLength || '00:30:00',
                period: raw.period || 0,
                status: raw.status || 'not_started',
                source: source
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
     * @property {AbortController} abortController - 用于中止请求的控制器
     * @property {Function} getBaseUrl - 动态获取基础URL
     * @property {Function} _isSuccessResponse - 统一的成功响应判断逻辑
     * @property {Function} _request - 通用请求函数
     * @property {Function} _extractToken - 提取认证令牌
     * @property {Function} reportProgress - 进度上报
     * @property {Function} getCourseListFromChannel - 从频道获取课程列表
     * @property {Function} getCourseList - 获取课程列表
     * @property {Function} getPlayInfo - 获取播放信息
     * @property {Function} pulseSaveRecord - 脉冲式保存记录
     * @property {Function} checkCourseCompletion - 检查课程完成状态
     * @property {Function} executeLearnStrategy - 执行学习策略
     */
    const API = {
        /**
         * 认证Token缓存
         * @type {string|null}
         */
        _cachedToken: null,

        /**
         * 动态获取基础URL
         *
         * 根据当前环境返回相应的API基础URL
         *
         * @returns {string} API基础URL
         */
        getBaseUrl: function() {
            return CONFIG.PUDONG_API_BASE || `https://${window.location.hostname}`;
        },

        /**
         * 解析课程列表数据 (重构整合版)
         * 将 API 返回的多种课程列表结构标准化
         * 
         * @param {Object} data - API返回的数据
         * @param {string} sourcePrefix - 来源标识前缀
         * @returns {Array} 标准化后的课程列表
         */
        _parseCourseListData(data, sourcePrefix) {
            const courseList = [];
            if (data.pdChannelUnitList) {
                for (const unit of data.pdChannelUnitList) {
                    if (unit.subList) {
                        for (const course of unit.subList) {
                            if (course.typeValue === 'course') {
                                course.unitOrder = unit.order;
                                courseList.push(CourseAdapter.normalize(course, `${sourcePrefix}_unit`));
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
                    courseList.push(CourseAdapter.normalize(course, `${sourcePrefix}_list`));
                });
            }
            return courseList;
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
         * 准备请求头
         * @private
         */
        _prepareHeaders(customHeaders = {}, data = null) {
            const token = this._extractToken();
            const headers = {
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': window.location.href,
                'Origin': this.getBaseUrl(),
                'Cookie': document.cookie,
                ...customHeaders
            };

            // 自动设置 Content-Type
            if (!(data instanceof FormData)) {
                if (typeof data === 'string' && data.includes('=')) {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                } else if (data) {
                    headers['Content-Type'] = 'application/json';
                }
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
                headers['X-Auth-Token'] = token;
            }

            return headers;
        },

        /**
         * 处理响应逻辑
         * @private
         */
        _handleResponse(response, resolve) {
            // 401 Token过期处理
            if (response.status === 401) {
                UI.log('⚠️ Token可能已过期 (401)，清除缓存', 'warn');
                this._cachedToken = null;
            }

            if (CONFIG.DEBUG_MODE) {
                UI.log(`[API] ${response.status} ${response.responseText?.substring(0, 100)}...`);
            }

            try {
                if (response.responseText && response.responseText.trim()) {
                    return resolve(JSON.parse(response.responseText));
                }
                
                if (response.status >= 200 && response.status < 300) {
                    return resolve({ code: response.status, success: true, message: 'Success' });
                }
                
                resolve({ status: response.status, message: 'Empty response' });
            } catch {
                const html = response.responseText || '';
                if (html.trim().startsWith('<')) {
                    if (html.includes('login') || html.includes('登录')) {
                        UI.log('❌ 登录已失效，请重新登录', 'error');
                        alert('cela学习助手：登录已失效，请刷新页面重新登录！');
                        Learner.stop();
                    } else if (html.includes('verification') || html.includes('验证码') || html.includes('人机')) {
                        UI.log('❌ 触发人机验证，请手动完成验证', 'error');
                        alert('cela学习助手：触发人机验证！请在页面上完成验证后点击“开始学习”继续。');
                        Learner.stop();
                    }
                    return resolve({ error: 'HTML response received', status: response.status, isHtml: true });
                }
                resolve({ status: response.status, message: html || 'Empty response', success: response.status >= 200 && response.status < 300 });
            }
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
            return RequestQueue.add(() => new Promise((resolve, reject) => {
                if (this.abortController && this.abortController.signal.aborted) {
                    return reject(new DOMException('Aborted', 'AbortError'));
                }

                const headers = this._prepareHeaders(options.headers, options.data);

                if (CONFIG.DEBUG_MODE) {
                    UI.log(`[API] ${options.method || 'GET'} ${options.url}`);
                }

                const req = GM_xmlhttpRequest({
                    method: options.method || 'GET',
                    url: options.url,
                    headers: headers,
                    data: options.data,
                    timeout: options.timeout || 30000,
                    onload: (res) => this._handleResponse(res, resolve),
                    onerror: (err) => {
                        UI.log(`❌ 请求失败: ${err.message}`, 'error');
                        resolve({ error: err.message, status: err.status || 0 });
                    },
                    ontimeout: () => {
                        UI.log('❌ 请求超时', 'error');
                        resolve({ error: '请求超时', status: 0, type: 'timeout' });
                    }
                });

                if (this.abortController) {
                    this.abortController.signal.addEventListener('abort', () => {
                        if (req.abort) req.abort();
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
                } catch {
                    // 忽略提取错误
                }
            }

            UI.log('[Token] 未找到认证token', 'debug');
            return null;
        },

        /**
         * 进度上报 - 增强版，根据深度分析报告优化
         * 支持真实API优先，智能降级到兜底模式
         */
        reportProgress: async function(playInfo, currentTime) {
            try {
                const isMockData = playInfo.videoId && playInfo.videoId.startsWith('mock_');
                const progressPercent = Math.round((currentTime / playInfo.duration) * 100);
                
                if (isMockData) {
                    UI.log('⚠️ [警告] 正在对模拟视频ID上报进度，可能不会被记录！', 'warn');
                }

                const result = await this.pulseSaveRecord(playInfo, currentTime);

                if (this._isSuccessResponse(result)) {
                    const successMsg = isMockData 
                        ? `[进度上报] ⚠️ 模拟数据提交成功 (${progressPercent}%)` 
                        : `[进度上报] 成功 (${progressPercent}%)`;
                    EventBus.publish(CONSTANTS.EVENTS.LOG, { message: successMsg, type: 'success' });
                    return result;
                }

                const errorMsg = result?.message || '服务器拒绝接收学习进度';
                EventBus.publish(CONSTANTS.EVENTS.LOG, { message: `[进度上报] ❌ 失败: ${errorMsg}`, type: 'warn' });
                throw new Error(errorMsg);

            } catch (error) {
                if (error.name === 'AbortError') throw error;
                UI.log(`[进度上报] 发生严重错误: ${error.message}`, 'error');
                throw error;
            }
        },

        /**
         * 带延迟的进度上报
         * 在进度接近完成时增加随机延迟，避免瞬时上报过快
         */
        reportProgressWithDelay: async function(playInfo, currentTime) {
            const progressPercent = Math.round((currentTime / playInfo.duration) * 100);

            if (progressPercent > 90) {
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            }

            return await this.reportProgress(playInfo, currentTime);
        },

        // 剩余的API方法（使用常量优化）

        getCourseListFromChannel: async function(channelId) {
            try {
                UI.log(`正在从频道/专栏API获取课程列表 (ID: ${channelId})...`, 'info');

                const apiEndpoints = [
                    `${CONSTANTS.API_ENDPOINTS.GET_PACK_BY_ID}?id=${channelId}&_t=${Date.now()}`,
                    `/api/nc/channel/detail?id=${channelId}&_t=${Date.now()}`,
                    `/inc/nc/course/list?channelId=${channelId}&_t=${Date.now()}`,
                    `${CONSTANTS.API_ENDPOINTS.GET_COURSE_LIST}?channelId=${channelId}&_t=${Date.now()}`
                ];

                for (const endpoint of apiEndpoints) {
                    try {
                        UI.log(`尝试API端点: ${endpoint}`, 'debug');
                        const response = await this._request({
                            method: 'GET',
                            url: `${this.getBaseUrl()}${endpoint}`
                        });

                        if (response && response.success && response.data) {
                            const courseList = this._parseCourseListData(response.data, 'channel');
                            if (courseList.length > 0) {
                                UI.log(`✅ 从API获取到 ${courseList.length} 门课程`, 'info');
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
                    } catch {
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

                // 统一专栏和频道页面识别 (增加关键词兼容性)
                if (currentUrl.toLowerCase().includes('specialdetail') ||
                    currentUrl.toLowerCase().includes('channeldetail') || 
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

                // [优化] 动态等待课程元素加载，最多等待5秒
                UI.log('⏳ 正在扫描页面课程元素...', 'debug');
                for (let i = 0; i < 10; i++) {
                    const found = CONSTANTS.COURSE_SELECTORS.some(s => document.querySelector(s));
                    if (found) break;
                    await new Promise(r => setTimeout(r, 500));
                }

                UI.log('🔍 页面内容分析:', 'debug');
                
                // 专门针对浦东分院频道页的列表项
                const pudongItems = document.querySelectorAll('.dsf_nc_pd_special_item, .list_item, .pd_course_item, .dsjy_card');
                if (pudongItems.length > 0) {
                    UI.log(`📋 找到浦东分院专用列表项: ${pudongItems.length}个`, 'info');
                    courseElements = Array.from(pudongItems);
                } else {
                    for (const selector of CONSTANTS.COURSE_SELECTORS) {
                        const elements = document.querySelectorAll(selector);
                        // 过滤掉 UI 面板内部的元素
                        const validElements = Array.from(elements).filter(el => !el.closest('#api-learner-panel'));
                        if (validElements.length > 0) {
                            courseElements = validElements;
                            UI.log(`📋 使用选择器 "${selector}" 找到 ${validElements.length} 个课程元素`, 'info');
                            break;
                        }
                    }
                }

                courseElements.forEach((el, index) => {
                    // [优化] 深度提取ID逻辑：增加递归向上查找
                    const findId = (element) => {
                        let current = element;
                        let depth = 0;
                        while (current && depth < 5) {
                            const id = current.getAttribute('data-id') ||
                                       current.getAttribute('data-course-id') ||
                                       current.getAttribute('id') ||
                                       current.getAttribute('data-courseid') ||
                                       current.querySelector('[data-id]')?.getAttribute('data-id') ||
                                       current.querySelector('[data-course-id]')?.getAttribute('data-course-id');
                            
                            // 排除 Kapture 注入的辅助 ID 和过短的 ID
                            if (id && !id.includes('kapture') && !id.includes('course_') && id.length > 5) return id;
                            current = current.parentElement;
                            depth++;
                        }
                        // 尝试从 innerHTML 或父元素内容中通过正则匹配 UUID (32位十六进制)
                        const uuidMatch = (element.getAttribute('onclick') || element.parentElement?.innerHTML || '').match(/[a-f0-9]{32}/);
                        return uuidMatch ? uuidMatch[0] : null;
                    };

                    const courseId = findId(el);
                    if (!courseId) return; // [新增] 如果没找到有效 ID，跳过此元素

                    const rawData = {
                        courseId: courseId,
                        dsUnitId: el.getAttribute('data-unit-id') || el.getAttribute('data-dsunit') || `unit_${index}`,
                        courseName: el.querySelector('.title, .name, .course-title, .item_content, h3, h4')?.textContent?.trim() || 
                                   el.getAttribute('title') || 
                                   el.textContent?.trim()?.split('\n')[0]?.substring(0, 80) ||
                                   `课程${index + 1}`,
                        durationStr: el.querySelector('.duration, .time, .period')?.textContent?.trim() || '00:30:00',
                        status: el.getAttribute('data-status') || 'not_started'
                    };

                    if (rawData.courseName && rawData.courseName.length > 2) {
                        courseList.push(CourseAdapter.normalize(rawData, 'dom_scrape'));
                    }
                });

                // [新增] 兼容性检查触发逻辑
                if (courseList.length === 0 && courseElements.length > 0) {
                    UI.setIncompatible('检测到课程列表元素，但无法解析有效的课程 ID 属性。这通常意味着该专栏采用了非标准的数据绑定方式。');
                } else if (courseList.length === 0 && PudongHandler.identifyPage() === PudongHandler.PAGE_TYPES.COLUMN) {
                    UI.setIncompatible('当前专栏页面的 DOM 结构未被识别，脚本无法自动扫描课程。');
                }

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
                            lastLearnedTime = target.lastWatchPoint ? Utils.parseTimeToSeconds(target.lastWatchPoint) : 0;
                            UI.log(`[getPlayInfo] 成功匹配到课件: ${target.title}`, 'success');
                        }
                    }

                    // 2. 如果没匹配到或没传 dsUnitId，使用 locationSite
                    if (!videoId && data.locationSite) {
                        videoId = data.locationSite.id;
                        coursewareId = data.locationSite.id;
                        duration = data.locationSite.sumDurationLong || 0;
                        lastLearnedTime = data.locationSite.lastWatchPoint ? Utils.parseTimeToSeconds(data.locationSite.lastWatchPoint) : 0;
                    }
                }

                // 3. 兜底时长处理
                if (duration === 0 && courseDuration) {
                    duration = Utils.parseDuration(courseDuration);
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
         * 提交学习进度 (原脉冲上报)
         *
         * 将当前学习位置同步到服务器
         *
         * @async
         * @param {Object} playInfo - 播放信息对象
         * @param {number} currentTime - 当前播放时间（秒）
         * @returns {Object} API响应结果
         */
        pulseSaveRecord: async (playInfo, currentTime) => {
            const watchPoint = Utils.formatTime(currentTime);
            const progress = Math.round((currentTime / playInfo.duration) * 100);

            const payload = new URLSearchParams({
                courseId: playInfo.courseId,
                coursewareId: playInfo.coursewareId || playInfo.videoId,
                videoId: playInfo.videoId || '',
                watchPoint: watchPoint,
                currentTime: currentTime,
                duration: playInfo.duration,
                progress: progress,
                pulseTime: 10,
                pulseRate: 1,
                _t: Date.now()
            }).toString();

            UI.log(`[进度同步] ${watchPoint} (${progress}%)`, 'info');

            try {
                return await API._request({
                    method: 'POST',
                    url: `${API.getBaseUrl()}${CONSTANTS.API_ENDPOINTS.PULSE_SAVE_RECORD}`,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            } catch (error) {
                // 浦东模式下尝试专用端点作为降级
                if (CONFIG.PUDONG_MODE) {
                    UI.log('[进度同步] 切换至备用端点重试...', 'debug');
                    return await API._request({
                        method: 'POST',
                        url: `${API.getBaseUrl()}/api/player/pulse`,
                        data: payload,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                }
                throw error;
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
                                UI.log('[完成度检查] 学习记录显示主课程已完成', 'success');
                                return { isCompleted: true, finishedRate: 100, method: 'studyRecord' };
                            }
                        }
                    } catch {
                        // 忽略单个端点检查失败
                    }
                }

                return { isCompleted: false, finishedRate: 0, method: 'default' };

            } catch (error) {
                UI.log(`[完成度检查] 检查失败: ${error.message}`, 'error');
                return { isCompleted: false, finishedRate: 0, method: 'error' };
            }
        },

        /**
         * 执行课程学习策略
         *
         * @param {Object} courseInfo - 课程信息对象
         * @returns {Promise<boolean>} 学习是否成功
         */
        async executeLearnStrategy(courseInfo) {
            const { courseId, duration, lastLearnedTime } = courseInfo;
            const currentProgress = Math.floor((lastLearnedTime / duration) * 100);

            EventBus.publish(CONSTANTS.EVENTS.LOG, { message: `[学习启动] 课程: ${courseInfo.title || courseId}`, type: 'info' });
            EventBus.publish(CONSTANTS.EVENTS.LOG, { message: `[当前进度] ${currentProgress}% (${Utils.formatTime(lastLearnedTime)}/${Utils.formatTime(duration)})`, type: 'info' });

            // 极速模式：单次上报直接完成
            UI.log('🚀 执行极速完成策略 - 直接冲刺 99%');
            
            // 直接调用即时完成逻辑
            const success = await LearningStrategies.instant_finish({ 
                playInfo: courseInfo, 
                duration, 
                currentTime: lastLearnedTime 
            });

            if (success) {
                UI.log(`✅ 课程处理完成: ${courseInfo.title || courseId}`, 'success');
            } else {
                UI.log(`❌ 课程处理失败: ${courseInfo.title || courseId}`, 'error');
            }

            return success;
        }
    };

    /**
     * 学习器状态定义
     */
    const LEARNER_STATES = {
        IDLE: 'idle',           // 待命
        PREPARING: 'preparing', // 准备中（获取信息、校验进度）
        LEARNING: 'learning',   // 学习中（发送API请求）
        COOLING: 'cooling',     // 冷却中（课间延迟）
        STOPPED: 'stopped'      // 已停止
    };

    // --- 主控制逻辑（增强版） ---
    const Learner = {
        /**
         * 当前运行状态
         * @type {string}
         */
        state: LEARNER_STATES.IDLE,
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
                    this.state = LEARNER_STATES.STOPPED;
        
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
                 * 准备课程学习环境
                 * @private
                 */
                async _prepareCourse(course) {
                    this.state = LEARNER_STATES.PREPARING;
                    const courseId = course.id || course.courseId;
                    const coursewareId = course.dsUnitId;
        
                    // 1. 检查跳过逻辑
                    if (CONFIG.SKIP_COMPLETED_COURSES) {
                        const completionCheck = await API.checkCourseCompletion(courseId, coursewareId);
                        if (completionCheck.isCompleted) {
                            UI.log(`✅ 课程已完成，跳过: ${course.title} (${completionCheck.finishedRate}%)`, 'success');
                            return { action: 'skip' };
                        }
                    }
        
                    // 2. 获取播放信息
                    const playInfo = await API.getPlayInfo(courseId, course.dsUnitId, course.durationStr);
                    if (!playInfo) {
                        UI.log(`❌ 无法获取课程播放信息，跳过: ${course.title}`, 'error');
                        return { action: 'fail' };
                    }
        
                    // 3. 双重检查
                    const progressPercent = Math.floor((playInfo.lastLearnedTime / playInfo.duration) * 100);
                    if (progressPercent >= CONFIG.COMPLETION_THRESHOLD) {
                        UI.log(`✅ 播放信息确认课程已完成，跳过: ${course.title} (${progressPercent}%)`, 'success');
                        return { action: 'skip' };
                    }
        
                    return { action: 'learn', playInfo };
                },
        
                /**
                 * 执行课程学习
                 * @private
                 */
                async _learnCourse(course, playInfo) {
                    this.state = LEARNER_STATES.LEARNING;
                    const courseInfo = {
                        ...course,
                        ...playInfo,
                        title: course.title || course.courseName,
                        courseId: course.id || course.courseId
                    };
        
                    return await API.executeLearnStrategy(courseInfo);
                },
        
                /**
                 * 处理学习后的冷却与收尾
                 * @private
                 */
                async _afterCourse(isLast) {
                    if (isLast || this.stopRequested) return;
        
                    this.state = LEARNER_STATES.COOLING;
                    const delay = Math.random() * 5000 + 5000;
                    const seconds = Math.round(delay / 1000);
                    
                    UI.log('⏳ 等待处理下一门课程...');
                    for (let i = seconds; i > 0; i--) {
                        if (this.stopRequested) break;
                        UI.updateStatus(`等待中 (${i}s)`);
                        await new Promise(r => setTimeout(r, 1000));
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
        
                    const stats = { total: courses.length, completed: 0, learned: 0, failed: 0, skipped: 0 };
                    UI.updateStatistics(stats);
        
                    for (let i = 0; i < courses.length; i++) {
                        if (this.stopRequested) break;
        
                        const course = courses[i];
                        UI.log(`\n📚 处理第 ${i + 1}/${courses.length} 门课程: ${course.title}`);
                        UI.updateStatus(`学习课程 ${i + 1}/${courses.length}`);
        
                        try {
                            const prep = await this._prepareCourse(course);
                            
                            if (prep.action === 'skip') {
                                stats.skipped++; // 原本已完成，跳过
                            } else if (prep.action === 'fail') {
                                stats.failed++;
                            } else if (prep.action === 'learn') {
                                const success = await this._learnCourse(course, prep.playInfo);
                                if (success) {
                                    UI.log(`✅ 课程学习完成: ${course.title}`, 'success');
                                    stats.learned++;
                                } else {
                                    UI.log(`❌ 课程学习失败: ${course.title}`, 'error');
                                    stats.failed++;
                                }
                            }
        
                            // 更新总完成数：跳过数 + 本次学习数
                            stats.completed = stats.skipped + stats.learned;
        
                            UI.updateStatistics(stats);
                            UI.updateProgress(Math.floor(((i + 1) / courses.length) * 100));
        
                            // 仅在实际执行了学习操作且非最后一门时触发冷却延迟
                            if (prep.action === 'learn') {
                                await this._afterCourse(i === courses.length - 1);
                            }
        
                        } catch (error) {
                            if (error.name === 'AbortError' || this.stopRequested) {
                                UI.log(`⏹️ 学习流程已中断: ${course.title}`, 'warn');
                                break;
                            }
                            UI.log(`❌ 处理课程 ${course.title} 时出错: ${error.message}`, 'error');
                            stats.failed++;
                            UI.updateStatistics(stats);
                        }
                    }
        
                    this.state = LEARNER_STATES.IDLE;
                    if (this.stopRequested) {
                        UI.log('\n🛑 学习已手动停止', 'warn');
                    } else {
                        UI.log('\n🎉 所有课程处理完成！', 'success');
                        UI.updateStatus(`完成 - ${stats.completed + stats.learned}/${stats.total} 门课程`);
                    }
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
            // 已在 detectEnvironment 中处理门户、首页及不支持分院的判定
            if (CONFIG.IS_PORTAL || CONFIG.UNSUPPORTED_BRANCH) return false;
            
            const href = window.location.href;
            if (href.includes('pagehome/index') || document.querySelector('[module-name="nc.pagehome.index"]')) {
                return false;
            }


            // 检查是否在课程播放页面
            const isCoursePlayerPage = window.location.href.includes('/coursePlayer');

            // 检查是否在专栏详情页面
            const isSpecialDetailPage = window.location.href.includes('/specialdetail');

            // 检查是否在频道详情页面
            const isChannelDetailPage = window.location.href.includes('channelDetail');

            // [新增] 检查是否在浦东分院特殊专栏页面 (使用 PudongHandler)
            const isPudongSpecialPage = PudongHandler.identifyPage() === PudongHandler.PAGE_TYPES.COLUMN;

            // 检查是否在课程列表页面（不包含ID参数）
            const isChannelListPage = window.location.href.includes('channelList');

            if (isChannelListPage) {
                // 如果在频道列表页面，没有ID是正常的
                return false;
            }

            if (isCoursePlayerPage || isSpecialDetailPage || isChannelDetailPage || isPudongSpecialPage) {
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

            // [优化] 如果没找到 ID，但页面上有课程元素，也允许启动
            if (!id) {
                const hasCourseElements = CONSTANTS.COURSE_SELECTORS.some(selector => document.querySelector(selector));
                if (hasCourseElements) {
                    UI.log('[校验] 虽然URL没发现ID，但页面检测到课程元素，允许启动', 'info');
                    return true;
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
                EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, '学习中...');

                // 启动学习流程
                Learner.startLearning().catch(error => {
                    EventBus.publish(CONSTANTS.EVENTS.LOG, { message: `❌ 启动学习流程失败: ${error.message}`, type: 'error' });
                    Learner.stop();
                });
            }
        });

        // 5. 发布初始化完成事件
        EventBus.publish(CONSTANTS.EVENTS.LOG, { message: '🚀 cela学习助手 v3.50 初始化完成', type: 'success' });
    }

    // 初始化环境检测和脚本
    function initScript() {
        detectEnvironment();
        
        // 初始化浦东分院处理器
        PudongHandler.init();

        init();
    }

    setTimeout(initScript, 2000);

})();