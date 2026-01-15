// ==UserScript==
// @name          Otoy 自动操作脚本
// @namespace     http://tampermonkey.net/
// @version       3.7
// @description   自动填充账号和密码并登录，检查订阅状态，显示状态信息及欧元汇率(每日10点后更新)
// @author        wxm
// @match         https://*.otoy.com/*
// @grant         GM_setClipboard
// @grant         GM_notification
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_xmlhttpRequest
// @connect       api.exchangerate.host
// @connect       script.google.com
// @connect       script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/475922/Otoy%20%E8%87%AA%E5%8A%A8%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475922/Otoy%20%E8%87%AA%E5%8A%A8%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 优化：日志级别控制系统（必须在最前面定义，供后续代码使用）---
    /**
     * 日志级别枚举
     * @type {Object}
     */
    const LOG_LEVELS = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };

    /**
     * 日志工具类
     * 提供统一的日志输出接口，支持日志级别控制
     * @namespace Logger
     */
    const Logger = {
        /**
         * 当前日志级别
         * 默认根据VERBOSE_LOGGING开关决定，但可以在运行时动态调整
         * @type {number}
         */
        currentLevel: LOG_LEVELS.INFO, // 默认INFO级别，避免过多日志

        /**
         * 设置日志级别
         * @param {number} level - 日志级别 (LOG_LEVELS.DEBUG/INFO/WARN/ERROR)
         */
        setLevel(level) {
            this.currentLevel = level;
        },

        /**
         * 检查是否应该输出指定级别的日志
         * @param {number} level - 日志级别
         * @returns {boolean} 是否应该输出
         */
        shouldLog(level) {
            return level >= this.currentLevel;
        },

        /**
         * 输出DEBUG级别日志
         * @param {...any} args - 日志参数
         */
        debug(...args) {
            if (this.shouldLog(LOG_LEVELS.DEBUG)) {
                console.log('[DEBUG]', ...args);
            }
        },

        /**
         * 输出INFO级别日志
         * @param {...any} args - 日志参数
         */
        info(...args) {
            if (this.shouldLog(LOG_LEVELS.INFO)) {
                console.log(...args);
            }
        },

        /**
         * 输出WARN级别日志
         * @param {...any} args - 日志参数
         */
        warn(...args) {
            if (this.shouldLog(LOG_LEVELS.WARN)) {
                console.warn(...args);
            }
        },

        /**
         * 输出ERROR级别日志
         * @param {...any} args - 日志参数
         */
        error(...args) {
            if (this.shouldLog(LOG_LEVELS.ERROR)) {
                console.error(...args);
            }
        },

        /**
         * 输出分组日志（始终输出，不受日志级别控制）
         * @param {string} label - 分组标签
         */
        group(label) {
            console.group(label);
        },

        /**
         * 结束分组日志
         */
        groupEnd() {
            console.groupEnd();
        },

        /**
         * 输出表格日志（始终输出，不受日志级别控制）
         * @param {any} data - 表格数据
         */
        table(data) {
            console.table(data);
        }
    };

    Logger.info('>>> Otoy Script STARTING EXECUTION - v20250507-Debug <<<'); // 添加非常靠前的日志

    // --- Google Sheet Integration Configuration ---
    // 【请务必修改】替换为您的 Google Apps Script Web App URL
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyawt-t4yiF0M7h2yfsOyxRj2E7Da5Tbc7cxbMempzeXNV-ieDF_eRd2n3dvLbgb0AL/exec';
    // 【请务必修改】替换为您在 Google Apps Script 中设置的相同的 SECRET_TOKEN
    const GAS_SECRET_TOKEN = 'kGj3hD9sLpQrXuVzW7bN2mYcE4fRtUaI0oPqS8wZ1vFxA5eBnM6tHyJkL'; // 此处应为您脚本中的实际token
    const TEMP_LOGIN_ACCOUNT_KEY = 'otoy_temp_login_account_for_upload';
    const TEMP_PASSWORD_KEY = 'otoy_temp_password_for_upload';
    // --- End Google Sheet Integration Configuration ---

    // --- Workflow State Management Constants ---
    // REMOVED: const WORKFLOW_STAGE_KEY = 'otoy_workflow_stage';
    // REMOVED: const SUBS_TO_PROCESS_KEY = 'otoy_subs_to_process_list'; // Stores subIDs to be processed (e.g., for cancellation)
    // REMOVED: const FINAL_SUB_INFO_KEY = 'otoy_final_sub_info_for_sheet'; // Stores data collected for final Google Sheet entry
    // REMOVED: const TARGET_SUBID_FOR_PAYMENT_DATE_KEY = 'otoy_target_subid_for_payment_date'; // subID of the latest expiry sub to fetch payment date for
    const CANCELLED_SUB_IDS_LIST_KEY = 'otoy_cancelled_sub_ids_list'; // Stays - stores SubIDs that have been processed for cancellation

    // NEW GM Value Keys
    // REMOVED: const LATEST_PAYMENT_DATE_KEY = 'otoy_latest_payment_date'; // Stores YYYY-MM-DD
    const LATEST_PAYMENT_INFO_KEY = 'otoy_latest_payment_info'; // Stores { subID: 'xxxx', paymentDate: 'YYYY-MM-DD' }
    const SUBSCRIPTION_CANCELLED_STATUS_KEY = 'otoy_subscription_cancelled'; // Boolean: true if all current subs are cancelled
    const DETAIL_PAGE_TASK_KEY = 'otoy_detail_page_task'; // String: 'process_new_sub', 'cancel_renewal', 'fetch_payment_date'
    const PROCESSING_SUB_ID_KEY = 'otoy_processing_sub_id'; // String: SubID currently being handled on detail page
    const SUBS_TO_PROCESS_QUEUE_KEY = 'otoy_subs_to_process_queue'; // JSON Array of SubIDs: queue for cancellation run
    const FETCH_ATTEMPTED_SUBID_KEY = 'otoy_fetch_attempted_subid'; // Flag to prevent fetch loop
    const SYNC_STATUS_MESSAGE_KEY = 'otoy_sync_status_message'; // NEW: Stores sync status message
    // --- End Workflow State Management Constants ---

    // REMOVED Workflow Stages Constants
    // const STAGE_INIT = 'INIT';
    // const STAGE_PROCESS_SUBS_STARTED = 'PROCESS_SUBS_STARTED';
    // const STAGE_PROCESSING_SUB_ID = 'PROCESSING_SUB_ID_';
    // const STAGE_ALL_SUBS_PROCESSED = 'ALL_SUBS_PROCESSED';
    // const STAGE_FETCHING_PAYMENT_DATE = 'FETCHING_FINAL_PAYMENT_DATE_FOR_SUB_ID_';
    // const STAGE_READY_TO_SEND = 'READY_TO_SEND_TO_SHEET';
    // const STAGE_COMPLETED = 'COMPLETED_AND_IDLE';
    // --- End Workflow State Management Constants ---

    // --- 优化：选择器常量集中管理 ---
    const SELECTORS = {
        CANCEL_BUTTON: 'span.button_style.button_grey[onclick*="modifySubscription(\\\'cancel\\\')"]',
        CONFIRM_BUTTON: 'div.modal-content button.btn.btn-primary.btn_confirm',
        LICENSE_TABLE: 'table.licenseTable',
        INVOICE_TABLE: 'table.invoice_table',
        USERNAME_INPUT: '#p_username',
        EMAIL_INPUT: '#p_email',
        EXPIRY_DATE_CELL: 'td:nth-child(3)',
        VIEW_INFO_LINK: 'a[href*="subscriptionDetails.php?subID="]',
        REMOVE_CARD_LINK: 'a[href*="javascript:CC_remove"]',
        // 购买成功检测相关选择器
        PAYMENT_SUCCESS_MSG: '#stripeCompleteMsg',
        PAYMENT_SUCCESS_CONTAINER: '#stripeComplete',
        PAYMENT_SUCCESS_BUTTON: 'button.btn.btn-primary.octaneReturn',

        // 表头文本常量（用于列定位）
        HEADERS: {
            EXPIRY_DATE: 'Expiry Date',
            PAYMENT_DATE: 'Date of Last Payment',
            SUBSCRIPTION_ID: 'Subscription ID',
            STATUS: 'Status'
        },

        // 文本模式常量（用于文本匹配，使用正则表达式）
        TEXT_PATTERNS: {
            NO_CARD_MESSAGE: /--\s*no\s*saved\s*cards\s*--/i,
            REMOVE_BUTTON: /remove|删除/i,
            CANCELLED_STATUS: /cancelled|已取消|cancellation\s+scheduled/i
        },

        // 降级索引（当表头定位失败时使用）
        FALLBACK_INDICES: {
            EXPIRY_DATE_COLUMN: 2,
            PAYMENT_DATE_COLUMN: 3,
            VIEW_INFO_LINK_COLUMN: 6
        }
    };

    // --- 优化：常量集中管理 ---
    const CONSTANTS = {
        COOLDOWN_DURATION: 3600 * 1000, // 1小时（毫秒）
        RENEWAL_THRESHOLD_DAYS: 1,
        PAYMENT_DATE_THRESHOLD_DAYS: 2,
        RATE_UPDATE_HOUR: 10,
        EUR_AMOUNTS: {
            SMALL: 23.95,
            LARGE: 239.88
        },
        DAYS_PER_MONTH: {
            STANDARD: 37,
            CALENDAR: 30
        },
        TIMEOUTS: {
            POLL_INTERVAL: 200,
            POLL_TIMEOUT: 10000,
            CONFIRM_BUTTON_TIMEOUT: 8000,
            BUTTON_DISAPPEAR_TIMEOUT: 10000,
            PANEL_UPDATE_DEBOUNCE: 300
        }
    };

    // --- 优化：功能开关配置 ---
    /**
     * 功能开关配置对象
     * 用于控制脚本各项功能的启用/禁用状态
     * @type {Object}
     */
    const FEATURE_FLAGS = {
        // 性能监控开关
        PERFORMANCE_MONITORING: true,
        // 自动登录功能
        AUTO_LOGIN: true,
        // 订阅自动取消功能
        AUTO_CANCEL_SUBSCRIPTION: true,
        // Google Sheet 同步功能
        GOOGLE_SHEET_SYNC: true,
        // 续费提示功能
        RENEWAL_PROMPTS: true,
        // 用户信息面板
        USER_INFO_PANEL: true,
        // 详细日志输出
        VERBOSE_LOGGING: false
    };

    // 根据功能开关设置日志级别
    if (FEATURE_FLAGS.VERBOSE_LOGGING) {
        Logger.setLevel(LOG_LEVELS.DEBUG);
    }

    // --- 优化：性能监控工具 ---
    /**
     * 性能监控工具对象
     * 用于记录和统计函数执行时间
     */
    const PerformanceMonitor = {
        timers: new Map(),
        stats: {
            totalCalls: 0,
            totalTime: 0,
            functionStats: new Map()
        },

        /**
         * 开始计时
         * @param {string} label - 计时标签
         */
        start(label) {
            if (!FEATURE_FLAGS.PERFORMANCE_MONITORING) return;
            this.timers.set(label, performance.now());
        },

        /**
         * 结束计时并记录
         * @param {string} label - 计时标签
         * @returns {number} 执行时间（毫秒）
         */
        end(label) {
            if (!FEATURE_FLAGS.PERFORMANCE_MONITORING) return 0;

            const startTime = this.timers.get(label);
            if (!startTime) {
                Logger.warn(`[PerformanceMonitor] 未找到标签 "${label}" 的开始时间`);
                return 0;
            }

            const duration = performance.now() - startTime;
            this.timers.delete(label);

            // 更新统计信息
            this.stats.totalCalls++;
            this.stats.totalTime += duration;

            if (!this.stats.functionStats.has(label)) {
                this.stats.functionStats.set(label, {
                    calls: 0,
                    totalTime: 0,
                    minTime: Infinity,
                    maxTime: 0
                });
            }

            const funcStats = this.stats.functionStats.get(label);
            funcStats.calls++;
            funcStats.totalTime += duration;
            funcStats.minTime = Math.min(funcStats.minTime, duration);
            funcStats.maxTime = Math.max(funcStats.maxTime, duration);

            // 如果执行时间超过阈值，输出警告
            if (duration > 1000) {
                Logger.warn(`[PerformanceMonitor] "${label}" 执行时间较长: ${duration.toFixed(2)}ms`);
            } else {
                Logger.debug(`[PerformanceMonitor] "${label}" 执行时间: ${duration.toFixed(2)}ms`);
            }

            return duration;
        },

        /**
         * 获取性能统计报告
         * @returns {Object} 性能统计对象
         */
        getStats() {
            const avgTime = this.stats.totalCalls > 0
                ? this.stats.totalTime / this.stats.totalCalls
                : 0;

            const functionStatsObj = {};
            this.stats.functionStats.forEach((stats, label) => {
                functionStatsObj[label] = {
                    calls: stats.calls,
                    totalTime: stats.totalTime,
                    avgTime: stats.totalTime / stats.calls,
                    minTime: stats.minTime,
                    maxTime: stats.maxTime
                };
            });

            return {
                totalCalls: this.stats.totalCalls,
                totalTime: this.stats.totalTime,
                avgTime: avgTime,
                functions: functionStatsObj
            };
        },

        /**
         * 输出性能报告到控制台
         */
        logReport() {
            if (!FEATURE_FLAGS.PERFORMANCE_MONITORING) return;

            const stats = this.getStats();
            Logger.group('📊 性能监控报告');
            Logger.info(`总调用次数: ${stats.totalCalls}`);
            Logger.info(`总执行时间: ${stats.totalTime.toFixed(2)}ms`);
            Logger.info(`平均执行时间: ${stats.avgTime.toFixed(2)}ms`);
            Logger.table(stats.functions);
            Logger.groupEnd();
        },

        /**
         * 重置统计信息
         */
        reset() {
            this.timers.clear();
            this.stats.totalCalls = 0;
            this.stats.totalTime = 0;
            this.stats.functionStats.clear();
        }
    };

    const CONFIG = {
        // 定义所有需要用到的URL地址
        URLS: {
            // 注册页面URL
            SIGN_UP: 'https://account.otoy.com/sign_up',
            // 登录页面URL
            SIGN_IN: 'https://account.otoy.com/sign_in',
            // 主页URL
            HOME: 'https://home.otoy.com/',
            // 账户主页URL
            ACCOUNT_INDEX: 'https://render.otoy.com/account/index.php',
            // 订阅页面URL
            SUBSCRIPTIONS: 'https://render.otoy.com/account/subscriptions.php',
            // 订阅页面URL（带查询参数）
            SUBSCRIPTIONS_STUDIO: 'https://render.otoy.com/account/subscriptions.php?prepay_tier=STUDIO',
            // 银行卡管理页面URL
            CARDS: 'https://render.otoy.com/account/cards.php',
            // 购买记录页面URL
            PURCHASES: 'https://render.otoy.com/account/purchases.php',
            // 新购买页面URL(默认购买1个月的订阅)
            PURCHASE_NEW: 'https://render.otoy.com/shop/purchase.php?quantity=1&product=SUBSCR_4T2_ALL_1MC&pluginIDs=10'
        },
        DEFAULT_VALUES: {
            PASSWORD: 'octane',
            ADDRESS: 'chengdu',
            ZIP: '000000',
            COUNTRY: 'CHN'
        },
        INTERVALS: {
            LOGIN_REDIRECT: 30000,
            PAYMENT_CHECK: 500
        }
    };

    /**
     * 工具函数集合
     * 提供日期格式化、DOM操作、错误处理等通用功能
     * @namespace utils
     */
    const utils = {
        /**
         * 格式化日期为中文格式 (YYYY年MM月DD日)
         * @param {Date} date - 要格式化的日期对象
         * @returns {string} 格式化后的日期字符串，格式：YYYY年MM月DD日
         * @example
         * const date = new Date(2024, 0, 15);
         * utils.formatDate(date); // "2024年01月15日"
         */
        formatDate(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}年${month}月${day}日`;
        },

        /**
         * 解析格式化的日期字符串为Date对象
         * 支持两种格式：YYYY年MM月DD日 和 YYYY-MM-DD
         * @param {string} dateString - 日期字符串
         * @returns {Date|null} 解析成功返回Date对象，失败返回null
         * @example
         * utils.parseFormattedDate("2024年01月15日"); // Date对象
         * utils.parseFormattedDate("2024-01-15"); // Date对象
         * utils.parseFormattedDate("invalid"); // null
         */
        parseFormattedDate(dateString) {
            if (!dateString || typeof dateString !== 'string') return null;

            let year, month, day;
            let match;

            // 尝试匹配 YYYY年MM月DD日
            match = dateString.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
            if (match) {
                year = parseInt(match[1], 10);
                month = parseInt(match[2], 10); // 月份是 1-12
                day = parseInt(match[3], 10);
                Logger.debug(`[utils.parseFormattedDate] Matched YYYY年MM月DD日 format for: "${dateString}"`);
            } else {
                // 尝试匹配 YYYY-MM-DD
                match = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
                if (match) {
                    year = parseInt(match[1], 10);
                    month = parseInt(match[2], 10); // 月份是 1-12
                    day = parseInt(match[3], 10);
                    Logger.debug(`[utils.parseFormattedDate] Matched YYYY-MM-DD format for: "${dateString}"`);
                }
            }

            // 如果任一格式匹配成功，则进行验证
            if (year !== undefined && month !== undefined && day !== undefined) {
                // 基本验证月份和日期范围
                if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                    // 注意：Date 对象构造函数月份是 0-11
                    const date = new Date(year, month - 1, day);
                    // 进一步验证防止如 "2023年02月30日" 或 "2023-02-30" 这样的无效日期被 Date 对象自动调整
                    // 检查 Date 对象生成的年、月、日是否与输入匹配
                    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
                         Logger.debug(`[utils.parseFormattedDate] Successfully parsed date: ${date.toISOString()}`);
                         return date; // 解析成功，返回 Date 对象
                    } else {
                         Logger.warn(`[utils.parseFormattedDate] Date validation failed for year=${year}, month=${month}, day=${day}. Input: "${dateString}"`);
                    }
                } else {
                     Logger.warn(`[utils.parseFormattedDate] Month or day out of range for year=${year}, month=${month}, day=${day}. Input: "${dateString}"`);
                }
            }

            // 如果两种格式都不匹配或日期验证失败
            Logger.error(`[utils.parseFormattedDate] Failed to parse date string or date is invalid: "${dateString}" (Supported formats: YYYY年MM月DD日 or YYYY-MM-DD)`);
            return null; // 解析失败返回 null
        },

        /**
         * 将日期字符串格式化为 YYYY-MM-DD 格式
         * @param {string} dateString - 日期字符串（支持 YYYY年MM月DD日 或 YYYY-MM-DD）
         * @returns {string|null} 格式化后的日期字符串，解析失败返回原值或null
         * @example
         * utils.formatDateToYYYYMMDD("2024年01月15日"); // "2024-01-15"
         * utils.formatDateToYYYYMMDD("2024-01-15"); // "2024-01-15"
         */
        formatDateToYYYYMMDD(dateString) {
            if (!dateString) return null;

            const parsed = this.parseFormattedDate(dateString);
            if (!parsed) {
                Logger.warn(`[utils.formatDateToYYYYMMDD] 无法解析日期: ${dateString}`);
                return dateString; // 解析失败返回原值
            }

            const year = parsed.getFullYear();
            const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
            const day = parsed.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        /**
         * 格式化剩余时间为 MM:SS 格式
         * @param {number} milliseconds - 剩余时间（毫秒）
         * @returns {string} 格式化后的时间字符串，格式：MM:SS
         * @example
         * utils.formatRemainingTime(125000); // "02:05"
         */
        formatRemainingTime(milliseconds) {
            if (milliseconds < 0) milliseconds = 0;
            const totalSeconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },

        /**
         * 安全获取DOM元素
         * @param {string} id - 元素ID
         * @returns {HTMLElement|null} 找到的元素或null
         */
        getElement(id) {
            return document.getElementById(id);
        },

        /**
         * 安全点击元素（检查元素是否存在）
         * @param {HTMLElement|null} element - 要点击的元素
         * @returns {boolean} 点击是否成功
         */
        safeClick(element) {
            if (element) {
                element.click();
                return true;
            }
            return false;
        },

        showNotification(text) {
            // 添加全局样式（仅添加一次）
            if (!document.getElementById('otoy-global-styles')) {
                const globalStyle = document.createElement('style');
                globalStyle.id = 'otoy-global-styles';
                globalStyle.textContent = `
                    /* CSS变量定义 */
                    :root {
                        --otoy-primary: #1E88E5;
                        --otoy-primary-hover: #1976D2;
                        --otoy-primary-light: #64B5F6;
                        --otoy-success: #4CAF50;
                        --otoy-success-hover: #388E3C;
                        --otoy-success-light: #81C784;
                        --otoy-warning: #FF9800;
                        --otoy-warning-hover: #F57C00;
                        --otoy-warning-light: #FFB74D;
                        --otoy-error: #F44336;
                        --otoy-error-hover: #D32F2F;
                        --otoy-error-light: #EF5350;
                        --otoy-neutral-100: #F5F5F5;
                        --otoy-neutral-200: #EEEEEE;
                        --otoy-neutral-300: #E0E0E0;
                        --otoy-neutral-400: #BDBDBD;
                        --otoy-neutral-500: #9E9E9E;
                        --otoy-neutral-600: #757575;
                        --otoy-neutral-700: #616161;
                        --otoy-neutral-800: #424242;
                        --otoy-neutral-900: #212121;
                        --otoy-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
                        --otoy-shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
                        --otoy-shadow-md: 0 4px 12px rgba(0,0,0,0.15);
                        --otoy-shadow-lg: 0 8px 24px rgba(0,0,0,0.2);
                        --otoy-shadow-xl: 0 12px 48px rgba(0,0,0,0.3);
                        --otoy-radius-sm: 4px;
                        --otoy-radius-md: 8px;
                        --otoy-radius-lg: 12px;
                        --otoy-radius-xl: 16px;
                        --otoy-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    /* 全局动画 */
                    @keyframes otoySlideIn {
                        from {
                            transform: translateX(-50%) translateY(-20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(-50%) translateY(0);
                            opacity: 1;
                        }
                    }

                    @keyframes otoySlideOut {
                        from {
                            transform: translateX(-50%) translateY(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(-50%) translateY(-20px);
                            opacity: 0;
                        }
                    }

                    @keyframes otoyFadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes otoyPulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }

                    @keyframes otoyShake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-5px); }
                        75% { transform: translateX(5px); }
                    }
                `;
                document.head.appendChild(globalStyle);
            }

            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 24px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, rgba(30, 136, 229, 0.95) 0%, rgba(21, 101, 192, 0.95) 100%);
                color: white;
                padding: 14px 24px;
                border-radius: var(--otoy-radius-lg);
                z-index: 10000;
                font-size: 14px;
                font-family: var(--otoy-font-family);
                box-shadow: var(--otoy-shadow-lg);
                backdrop-filter: blur(8px);
                animation: otoySlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                display: flex;
                align-items: center;
                gap: 12px;
                max-width: 90vw;
                min-width: 280px;
            `;

            // 添加图标
            const icon = document.createElement('span');
            icon.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                flex-shrink: 0;
            `;
            icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>`;

            const textSpan = document.createElement('span');
            textSpan.textContent = text;
            textSpan.style.cssText = `
                flex: 1;
                line-height: 1.4;
            `;

            notification.appendChild(icon);
            notification.appendChild(textSpan);
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'otoySlideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        },

        async copyToClipboard(text) { // 添加 async
            Logger.debug('[utils.copyToClipboard] 尝试复制:', text);
            try {
                // 首先检查 navigator.clipboard 是否存在且 writeText 是函数
                if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                    Logger.debug('[utils.copyToClipboard] 尝试使用 navigator.clipboard.writeText...');
                    await navigator.clipboard.writeText(text); // 使用 await
                    Logger.debug('[utils.copyToClipboard] navigator.clipboard.writeText 成功。');
                    utils.showNotification('复制成功！');
                    return;
                }

                // 如果 navigator.clipboard 不可用，直接抛出错误进入 catch 块处理 GM
                Logger.debug('[utils.copyToClipboard] navigator.clipboard API 不可用或 writeText 不可用，尝试 GM_setClipboard...');
                throw new Error('Navigator clipboard not available or writeText is not a function'); // 更具体的错误信息
            } catch (navErr) {
                // 统一处理 navigator 失败或不可用的情况
                Logger.warn('[utils.copyToClipboard] navigator.clipboard 操作失败或不可用:', navErr.message);
                Logger.debug('[utils.copyToClipboard] 尝试 GM_setClipboard 作为后备...');
                try {
                    // 检查 GM_setClipboard 是否存在
                    if (typeof GM_setClipboard === 'function') {
                         GM_setClipboard(text);
                         Logger.debug('[utils.copyToClipboard] GM_setClipboard 成功。');
                         utils.showNotification('通过备用方式复制成功！');
                         return;
                    }

                    // 早期返回：GM_setClipboard不可用
                    Logger.warn('[utils.copyToClipboard] GM_setClipboard 不可用。');
                    throw new Error('GM_setClipboard is not available'); // 抛出错误给下一个 catch
                } catch (gmErr) {
                    // 处理 GM_setClipboard 失败或不可用的情况
                    Logger.error('[utils.copyToClipboard] GM_setClipboard 失败或不可用:', gmErr.message);
                    Logger.debug('[utils.copyToClipboard] 调用 fallbackCopy...');
                    utils.fallbackCopy(text); // fallbackCopy 不需要 try-catch，因为它只是显示通知
                }
            }
        },

        fallbackCopy(text) {
            this.showNotification('复制失败，请手动复制：' + text);
        },

        // --- 新增：日期辅助函数 ---
        getTodayDateString() {
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        // --- 日期辅助函数结束 ---

        // --- 新增：日期比较辅助函数 ---
        isDateWithinDays(dateString, referenceDate, days) {
            const dateToCompare = this.parseFormattedDate(dateString);
            if (!dateToCompare) return false; //无法解析日期字符串

            // 克隆参考日期并清除时间部分
            const refDateClean = new Date(referenceDate.getTime());
            refDateClean.setHours(0, 0, 0, 0);

            // 清除比较日期的时间部分
            dateToCompare.setHours(0, 0, 0, 0);

            // 计算日期差异（毫秒）
            const diffTime = refDateClean.getTime() - dateToCompare.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // 如果 dateToCompare 等于 referenceDate 或在其前 days 天内，则 diffDays 的范围是 [0, days]
            return diffDays >= 0 && diffDays <= days;
        },
        // --- 日期比较辅助函数结束 ---

        // --- 新增：元素定位辅助函数 ---
        /**
         * 通过表头文本查找列索引
         * @param {HTMLTableElement} table - 表格元素
         * @param {string} headerText - 表头文本（支持部分匹配）
         * @param {boolean} caseSensitive - 是否区分大小写，默认 false
         * @returns {number|null} 列索引，未找到返回 null
         */
        findColumnIndexByHeader(table, headerText, caseSensitive = false) {
            if (!table || !headerText) return null;

            // 查找表头行（优先查找 thead，否则使用第一行）
            const headerRow = table.querySelector('thead tr') || table.rows[0];
            if (!headerRow) {
                Logger.warn(`[utils.findColumnIndexByHeader] 未找到表头行`);
                return null;
            }

            const headers = headerRow.cells || Array.from(headerRow.querySelectorAll('th, td'));
            const searchText = caseSensitive ? headerText : headerText.toLowerCase();

            for (let i = 0; i < headers.length; i++) {
                const headerTextContent = headers[i].textContent.trim();
                const compareText = caseSensitive ? headerTextContent : headerTextContent.toLowerCase();

                if (compareText.includes(searchText)) {
                    Logger.debug(`[utils.findColumnIndexByHeader] 通过表头 "${headerText}" 找到列索引: ${i}`);
                    return i;
                }
            }

            Logger.warn(`[utils.findColumnIndexByHeader] 未找到包含 "${headerText}" 的表头`);
            return null;
        },

        /**
         * 统一的页面导航函数
         * 提供统一的导航接口，包含日志记录、清理逻辑等
         * @param {string} url - 目标URL（可以是完整URL或CONFIG.URLS中的键名）
         * @param {Object} options - 导航选项
         * @param {number} options.delay - 导航前延迟（毫秒），默认0
         * @param {boolean} options.replace - 是否使用replace而非href（不添加历史记录），默认false
         * @param {Function} options.beforeNavigate - 导航前的回调函数（可以是async）
         * @param {string} options.reason - 导航原因（用于日志）
         * @returns {Promise<void>}
         */
        async navigateTo(url, options = {}) {
            const {
                delay = 0,
                replace = false,
                beforeNavigate = null,
                reason = ''
            } = options;

            // 如果url是CONFIG.URLS中的键名，则获取对应的URL
            let targetUrl = url;
            if (CONFIG.URLS[url]) {
                targetUrl = CONFIG.URLS[url];
                Logger.debug(`[utils.navigateTo] 使用CONFIG.URLS中的URL: ${url} -> ${targetUrl}`);
            }

            // 验证URL格式
            if (!targetUrl || (typeof targetUrl !== 'string')) {
                Logger.error(`[utils.navigateTo] 无效的URL: ${url}`);
                return;
            }

            // 记录导航日志
            const currentUrl = window.location.href;
            const logReason = reason ? ` (原因: ${reason})` : '';
            Logger.debug(`[utils.navigateTo] 准备导航${logReason}`);
            Logger.debug(`[utils.navigateTo] 从: ${currentUrl}`);
            Logger.debug(`[utils.navigateTo] 到: ${targetUrl}`);
            Logger.debug(`[utils.navigateTo] 方式: ${replace ? 'replace' : 'href'}, 延迟: ${delay}ms`);

            // 执行导航前的回调
            if (beforeNavigate && typeof beforeNavigate === 'function') {
                try {
                    await beforeNavigate();
                    Logger.debug('[utils.navigateTo] 导航前回调执行完成');
                } catch (error) {
                    Logger.error('[utils.navigateTo] 导航前回调执行失败:', error);
                    // 即使回调失败，也继续导航（除非回调明确要求停止）
                }
            }

            // 延迟导航（如果需要）
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // 执行导航
            if (replace) {
                window.location.replace(targetUrl);
            } else {
                window.location.href = targetUrl;
            }
        },

        /**
         * 统一的页面刷新函数
         * 提供统一的页面刷新接口，包含日志记录
         * @param {Object} options - 刷新选项
         * @param {number} options.delay - 刷新前延迟（毫秒），默认0
         * @param {string} options.reason - 刷新原因（用于日志）
         * @returns {Promise<void>}
         */
        async reload(options = {}) {
            const {
                delay = 0,
                reason = ''
            } = options;

            const logReason = reason ? ` (原因: ${reason})` : '';
            Logger.debug(`[utils.reload] 准备刷新页面${logReason}`);
            Logger.debug(`[utils.reload] 当前URL: ${window.location.href}`);
            Logger.debug(`[utils.reload] 延迟: ${delay}ms`);

            // 延迟刷新（如果需要）
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // 执行刷新
            window.location.reload();
        },

        /**
         * 安全的表格列定位（带降级策略）
         * @param {HTMLTableElement} table - 表格元素
         * @param {Object} options - 定位选项
         * @param {string} options.headerText - 表头文本
         * @param {number} options.fallbackIndex - 降级索引
         * @param {string} options.columnClass - 列类名（可选）
         * @returns {number|null} 列索引
         */
        safeFindTableColumn(table, options) {
            const { headerText, fallbackIndex, columnClass } = options;

            // 策略1：通过表头文本定位
            if (headerText) {
                const index = this.findColumnIndexByHeader(table, headerText);
                if (index !== null) {
                    return index;
                }
            }

            // 策略2：通过类名定位（如果表头有类名）
            if (columnClass) {
                const headerRow = table.querySelector('thead tr') || table.rows[0];
                if (headerRow) {
                    const headers = Array.from(headerRow.cells || headerRow.querySelectorAll('th, td'));
                    const index = headers.findIndex(cell => cell.classList.contains(columnClass));
                    if (index !== -1) {
                        Logger.debug(`[utils.safeFindTableColumn] 通过类名 "${columnClass}" 找到列索引: ${index}`);
                        return index;
                    }
                }
            }

            // 策略3：降级到固定索引
            if (fallbackIndex !== undefined) {
                Logger.warn(`[utils.safeFindTableColumn] 使用降级索引: ${fallbackIndex} (表头 "${headerText}" 未找到)`);
                return fallbackIndex;
            }

            Logger.error(`[utils.safeFindTableColumn] 所有定位策略均失败:`, options);
            return null;
        },

        /**
         * 获取表格行中指定列的单元格
         * @param {HTMLTableRowElement} row - 表格行
         * @param {HTMLTableElement} table - 表格元素（用于查找列索引）
         * @param {Object} columnOptions - 列定位选项
         * @returns {HTMLElement|null} 单元格元素
         */
        getCellByColumn(row, table, columnOptions) {
            const columnIndex = this.safeFindTableColumn(table, columnOptions);
            if (columnIndex === null || !row.cells || columnIndex >= row.cells.length) {
                return null;
            }
            return row.cells[columnIndex];
        },
        // --- 元素定位辅助函数结束 ---

        // --- 修改：API 获取函数，针对 exchangerate.host ---
        async fetchEurCnyRateFromApi(apiKey) { // Renamed and logic updated
            return new Promise((resolve, reject) => {
                const apiUrl = `https://api.exchangerate.host/live?access_key=${apiKey}`; // No currencies needed, rely on default USD base
                Logger.debug('[utils.fetchEurCnyRateFromApi] Requesting URL:', apiUrl);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    timeout: 15000, // Increased timeout slightly
                    onload: function(response) {
                        try {
                            Logger.debug('[utils.fetchEurCnyRateFromApi] Received response status:', response.status);
                            if (response.status >= 200 && response.status < 300) {
                                const data = JSON.parse(response.responseText);
                                if (data.success === true) {
                                    // Expecting USD base, need USDCNY and USDEUR
                                    if (data.quotes && data.quotes.USDCNY && data.quotes.USDEUR) {
                                        const usdCny = data.quotes.USDCNY;
                                        const usdEur = data.quotes.USDEUR;
                                        Logger.debug(`[utils.fetchEurCnyRateFromApi] USD/CNY: ${usdCny}, USD/EUR: ${usdEur}`);
                                        if (typeof usdCny === 'number' && typeof usdEur === 'number' && usdEur !== 0) {
                                            const eurCnyRate = usdCny / usdEur;
                                            Logger.info(`[utils.fetchEurCnyRateFromApi] Calculated EUR/CNY: ${eurCnyRate}`);
                                            resolve(eurCnyRate);
                                            return;
                                        }

                                        // 早期返回：无效的汇率数据
                                        Logger.error('[utils.fetchEurCnyRateFromApi] Invalid rate data received or division by zero.');
                                        reject(new Error('无效的汇率数据'));
                                        return;
                                    }

                                    // 早期返回：缺少必要的汇率报价
                                    Logger.error('[utils.fetchEurCnyRateFromApi] API response missing required quotes (USDCNY or USDEUR). Response:', data);
                                    reject(new Error('API响应缺少必要的汇率报价 (USDCNY/USDEUR)'));
                                    return;
                                }

                                // 早期返回：API请求失败
                                Logger.error('[utils.fetchEurCnyRateFromApi] API request failed. Full Response Data:', data);
                                const errorInfo = data.error && typeof data.error === 'object' ? ` (Code ${data.error.code}: ${data.error.info})` : ' (No specific error details provided in response)';
                                reject(new Error(`API请求失败${errorInfo}`));
                                return;
                            }

                            // 早期返回：HTTP错误
                            Logger.error('[utils.fetchEurCnyRateFromApi] HTTP error status:', response.status, response.statusText);
                            reject(new Error(`HTTP错误: ${response.status} ${response.statusText}`));
                        } catch (e) {
                             Logger.error('[utils.fetchEurCnyRateFromApi] Error parsing response or processing data:', e);
                             // Include original response text for debugging JSON parse errors
                             Logger.error('[utils.fetchEurCnyRateFromApi] Raw response text:', response.responseText);
                             reject(new Error('解析响应或处理数据时出错'));
                        }
                    },
                    onerror: function(error) {
                         Logger.error('[utils.fetchEurCnyRateFromApi] GM_xmlhttpRequest network error:', error);
                         reject(new Error('网络请求错误'));
                    },
                    ontimeout: function() {
                         Logger.error('[utils.fetchEurCnyRateFromApi] GM_xmlhttpRequest timeout.');
                         reject(new Error('请求超时'));
                    }
                });
            });
        }, // End fetchEurCnyRateFromApi

        // --- 新增：处理汇率获取、存储和时间逻辑的主函数 ---
        async getEurCnyRate(apiKey) {
            const storageKey = 'otoy_eur_cny_rate_info'; // Key for storing { rate: number, date: string }
            const todayString = this.getTodayDateString();
            const currentHour = new Date().getHours();
            const storedInfo = await GM_getValue(storageKey, null);

            Logger.debug(`[utils.getEurCnyRate] Today: ${todayString}, Current Hour: ${currentHour}`);
            Logger.debug('[utils.getEurCnyRate] Stored Info:', storedInfo);

            // Situation 1: 如果今天已有存储的汇率，直接返回
            if (storedInfo && typeof storedInfo === 'object' && storedInfo.rate && storedInfo.date) {
                if (storedInfo.date === todayString) {
                    Logger.info(`[utils.getEurCnyRate] Using stored rate ${storedInfo.rate} from today (${storedInfo.date}).`);
                    return storedInfo.rate;
                }
            }

            // 获取旧汇率作为后备
            const oldRate = (storedInfo && typeof storedInfo === 'object' && storedInfo.rate) ? storedInfo.rate : null;

            // Situation 2: 时间 >= 10 AM，尝试获取新汇率
            if (currentHour >= 10) {
                Logger.info('[utils.getEurCnyRate] Past 10 AM, attempting to fetch new rate...');
                try {
                    const newRate = await this.fetchEurCnyRateFromApi(apiKey);
                    Logger.info('[utils.getEurCnyRate] Successfully fetched new rate:', newRate);
                    await GM_setValue(storageKey, { rate: newRate, date: todayString });
                    Logger.info(`[utils.getEurCnyRate] Stored new rate ${newRate} for date ${todayString}.`);
                    return newRate;
                } catch (fetchError) {
                    Logger.error('[utils.getEurCnyRate] Failed to fetch new rate:', fetchError);
                    // 如果有旧汇率，使用旧汇率作为后备
                    if (oldRate !== null) {
                        Logger.warn(`[utils.getEurCnyRate] Fetch failed, using stale rate ${oldRate} as fallback.`);
                        return oldRate;
                    }
                    // 没有旧汇率，抛出错误
                    Logger.error('[utils.getEurCnyRate] Fetch failed and no stale rate available.');
                    throw fetchError;
                }
            }

            // Situation 3: 时间 < 10 AM
            Logger.debug('[utils.getEurCnyRate] Before 10 AM and no rate stored for today.');
            if (oldRate !== null) {
                Logger.info(`[utils.getEurCnyRate] Using stale rate ${oldRate} before 10 AM.`);
                return oldRate;
            }

            // 没有旧汇率，返回等待状态
            Logger.debug('[utils.getEurCnyRate] No stale rate available, returning WAITING status.');
            return 'WAITING';
        },
        // --- 汇率主函数结束 ---  // This comment might be slightly misplaced if it was after the brace

        // --- Google Sheet Data Sending Utility ---
        sendDataToGoogleSheet: async function(dataFields) { // 函数签名修改，直接接收包含所有数据的对象
            // 早期返回：检查配置
            if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
                Logger.error('[sendDataToGoogleSheet] Google Apps Script Web App URL 未配置。');
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 配置错误');
                return false;
            }

            if (!GAS_SECRET_TOKEN || GAS_SECRET_TOKEN.length < 30) {
                Logger.error('[sendDataToGoogleSheet] Google Apps Script Secret Token 未配置或过短。');
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 配置错误');
                return false;
            }

            // 早期返回：验证数据字段
            if (!dataFields || typeof dataFields !== 'object' ||
                typeof dataFields.username === 'undefined' ||
                typeof dataFields.email === 'undefined' ||
                typeof dataFields.password === 'undefined' || // 密码可以是空字符串，但字段必须存在
                typeof dataFields.paymentDate === 'undefined' || // 新增 paymentDate
                typeof dataFields.expiryDate === 'undefined') {
                Logger.error('[sendDataToGoogleSheet] 传入的 dataFields 无效或缺少必要字段 (username, email, password, paymentDate, expiryDate)。Data:', dataFields);
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 数据不完整');
                return false;
            }

            const payload = {
                token: GAS_SECRET_TOKEN,
                username: dataFields.username,
                email: dataFields.email,
                password: dataFields.password, // 直接使用传入的密码
                timestamp: dataFields.paymentDate, // 修改：使用 paymentDate 作为Apps Script期望的 timestamp
                expiryDate: dataFields.expiryDate,
            };

            Logger.info('[sendDataToGoogleSheet] 准备发送数据:', { ...payload, password: '[REDACTED]' });

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: GAS_WEB_APP_URL,
                    data: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 20000,
                    onload: function(response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (response.status === 200 && result.status === 'success') {
                                Logger.info('[sendDataToGoogleSheet] 数据成功发送到 Google Sheet:', result.message);
                                GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步成功');
                                resolve(true);
                                return;
                            }

                            // 早期返回：处理错误情况
                            Logger.error('[sendDataToGoogleSheet] 发送数据错误或服务器错误:', response.status, response.responseText);
                            GM_setValue(SYNC_STATUS_MESSAGE_KEY, `同步失败: ${result.message || response.statusText}`);
                            resolve(false);
                        } catch (e) {
                            Logger.error('[sendDataToGoogleSheet] 解析服务器响应错误:', e, response.responseText);
                            GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 响应解析错误');
                            resolve(false);
                        }
                    },
                    onerror: function(error) {
                        Logger.error('[sendDataToGoogleSheet] 网络错误:', error);
                        GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 网络错误');
                        resolve(false);
                    },
                    ontimeout: function() {
                        Logger.error('[sendDataToGoogleSheet] 请求超时。');
                        GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 请求超时');
                        resolve(false);
                    }
                }); // Semicolon was missing here
            });
        }, // --- End Google Sheet Data Sending Utility ---

        // --- Workflow Cleanup Utility ---
        cleanupWorkflowStatus: async function() {
            Logger.debug('[cleanupWorkflowStatus] Clearing specific workflow GM_values for reset or completion...');
            try {
                // Clear task-specific GM values instead of all old ones
                await GM_deleteValue(DETAIL_PAGE_TASK_KEY);
                await GM_deleteValue(PROCESSING_SUB_ID_KEY);
                await GM_deleteValue(SUBS_TO_PROCESS_QUEUE_KEY);
                // LATEST_PAYMENT_DATE_KEY might be preserved or cleared depending on context.
                // SUBSCRIPTION_CANCELLED_STATUS_KEY is managed by main logic.
                // CANCELLED_SUB_IDS_LIST_KEY is usually preserved unless a full reset.

                // Old values that might still exist and should be cleared if a full reset is intended
                await GM_deleteValue('otoy_workflow_stage'); // old key
                await GM_deleteValue('otoy_subs_to_process_list'); // old key
                await GM_deleteValue('otoy_final_sub_info_for_sheet'); // old key
                await GM_deleteValue('otoy_target_subid_for_payment_date'); // old key
                await GM_deleteValue('otoy_original_expiry_date'); // Often temporary

                Logger.debug('[cleanupWorkflowStatus] Specific workflow GM_values cleared.');
            } catch (e) {
                Logger.error('[cleanupWorkflowStatus] Error clearing workflow GM_values:', e);
            }
        },
        // --- End Workflow Cleanup Utility ---

        // NEW: Utility to clear user-specific session data on logout
        clearUserSessionData: async function() {
            Logger.debug('[utils.clearUserSessionData] Clearing user session GM values...');
            const keysToClear = [
                'otoy_username',
                'otoy_email',
                'otoy_expiry_date',
                SUBSCRIPTION_CANCELLED_STATUS_KEY,
                'otoy_card_deleted',
                LATEST_PAYMENT_INFO_KEY, // Replaced LATEST_PAYMENT_DATE_KEY
                CANCELLED_SUB_IDS_LIST_KEY,
                SUBS_TO_PROCESS_QUEUE_KEY,
                'otoy_calculated_renewal_expiry_date',
                'otoy_original_expiry_date_for_renewal_copy',
                'otoy_status_message',
                TEMP_LOGIN_ACCOUNT_KEY,
                TEMP_PASSWORD_KEY,
                DETAIL_PAGE_TASK_KEY,      // Task-specific, good to clear on logout
                PROCESSING_SUB_ID_KEY,      // Task-specific, good to clear on logout
                SYNC_STATUS_MESSAGE_KEY    // ADDED: Clear sync status on logout
            ];

            let clearedCount = 0;
            let errorCount = 0;

            for (const key of keysToClear) {
                try {
                    if (key) { // Ensure key is not undefined/null if array is ever malformed
                        await GM_deleteValue(key);
                        clearedCount++;
                    }
                } catch (e) {
                    Logger.error(`[utils.clearUserSessionData] Error deleting GM value for key '${key}':`, e);
                    errorCount++;
                }
            }
            Logger.info(`[utils.clearUserSessionData] Finished clearing. ${clearedCount} keys processed for deletion, ${errorCount} errors.`);
        },

        // --- 优化：批量读取GM值 ---
        /**
         * 批量读取多个GM存储值，提升性能
         * @param {string[]} keys - 要读取的键数组
         * @param {any} defaultValue - 默认值（可选）
         * @returns {Promise<Object>} 返回键值对对象
         */
        batchGetGMValues: async function(keys, defaultValue = null) {
            Logger.debug(`[utils.batchGetGMValues] 批量读取 ${keys.length} 个GM值...`);
            try {
                const promises = keys.map(key => GM_getValue(key, defaultValue));
                const values = await Promise.all(promises);
                const result = keys.reduce((obj, key, index) => {
                    obj[key] = values[index];
                    return obj;
                }, {});
                Logger.debug(`[utils.batchGetGMValues] 批量读取完成，成功读取 ${Object.keys(result).length} 个值`);
                return result;
            } catch (error) {
                Logger.error('[utils.batchGetGMValues] 批量读取失败:', error);
                // 返回部分结果或空对象
                return keys.reduce((obj, key) => {
                    obj[key] = defaultValue;
                    return obj;
                }, {});
            }
        },

        // --- 优化：统一错误处理函数 ---
    /**
     * 统一的错误处理函数
     * 提供统一的错误日志记录和用户通知机制
     * @param {string} context - 错误上下文描述，用于标识错误发生的位置
     * @param {Error|string} error - 错误对象或错误消息字符串
     * @param {Object} [options={}] - 选项配置对象
     * @param {boolean} [options.silent=false] - 是否静默处理（不显示通知）
     * @param {boolean} [options.showNotification=true] - 是否显示用户通知
     * @param {string} [options.logLevel='error'] - 日志级别 ('error'|'warn')
     * @returns {Object} 返回错误结果对象，包含 success: false 和 error 消息
     * @example
     * utils.handleError('数据同步', new Error('网络错误'), { showNotification: true });
     */
        handleError: function(context, error, options = {}) {
            const {
                silent = false,
                showNotification = true,
                logLevel = 'error'
            } = options;

            const errorMessage = error?.message || error || '未知错误';
            const fullMessage = `[${context}] ${errorMessage}`;

            // 根据日志级别输出
            if (logLevel === 'error') {
                Logger.error(fullMessage, error);
            } else if (logLevel === 'warn') {
                Logger.warn(fullMessage, error);
            }

            // 显示通知（如果需要）
            if (showNotification && !silent) {
                this.showNotification(`错误: ${context} - ${errorMessage}`);
            }

            return {
                success: false,
                error: fullMessage
            };
        },

        // --- 优化：安全异步操作包装函数 ---
    /**
     * 安全执行异步操作，自动捕获和处理错误
     * 包装异步函数，自动捕获异常并返回统一格式的结果对象
     * @param {Function} operation - 要执行的异步操作函数，应返回Promise
     * @param {string} context - 操作上下文描述，用于错误日志
     * @param {Object} [errorOptions={}] - 错误处理选项，传递给handleError
     * @returns {Promise<{success: boolean, result: any, error: string|null}>}
     *   返回Promise，resolve时包含操作结果对象
     * @example
     * const result = await utils.safeAsyncOperation(
     *   async () => await someAsyncOperation(),
     *   '数据处理',
     *   { showNotification: false }
     * );
     * if (result.success) {
     *   console.log('操作成功:', result.result);
     * }
     */
        safeAsyncOperation: async function(operation, context, errorOptions = {}) {
            try {
                const result = await operation();
                return {
                    success: true,
                    result: result,
                    error: null
                };
            } catch (error) {
                const errorResult = this.handleError(context, error, errorOptions);
                return {
                    success: false,
                    result: null,
                    error: errorResult.error
                };
            }
        },

        // {{CHENGQI:
        // Action: Added
        // Timestamp: 2025-07-01 16:30:00 +08:00
        // Reason: P3-UTILS-001 - 创建手动同步数据收集函数，提取handleSubscriptions中的数据收集逻辑，遵循DRY原则
        // Principle_Applied: KISS (简洁单一职责), DRY (重用现有逻辑), 单一职责原则
        // Optimization: 集中化数据收集逻辑，提升代码复用性和可维护性
        // Architectural_Note (AR): 符合开闭原则，通过扩展而非修改现有功能
        // Documentation_Note (DW): 手动同步功能第一步实现，详细文档见 /project_document/手动同步按钮需求.md
        // }}
        // {{START MODIFICATIONS}}
        // + 新增手动同步数据收集函数
        /**
         * 收集同步所需的用户数据，重用现有的数据收集和格式化逻辑
         * @returns {Promise<{isValid: boolean, data: object|null, error: string|null}>}
         */
        collectSyncData: async function() {
            Logger.debug('[utils.collectSyncData] 开始收集手动同步数据...');

            try {
                // 读取GM存储中的用户数据 - 复用handleSubscriptions的逻辑
                const tempAccount = await GM_getValue(TEMP_LOGIN_ACCOUNT_KEY, null);
                const storedUsername = await GM_getValue('otoy_username', null);
                // 优先使用存储的用户名，回退到临时登录账号 - 与handleSubscriptions保持一致
                const username = storedUsername || tempAccount;

                const email = await GM_getValue('otoy_email', null);
                const password = await GM_getValue(TEMP_PASSWORD_KEY, null);
                const paymentInfo = await GM_getValue(LATEST_PAYMENT_INFO_KEY, null);
                const expiryDate = await GM_getValue('otoy_expiry_date', null);

                Logger.debug('[utils.collectSyncData] 原始数据读取完成，开始处理...');

                // 优化：使用统一的日期格式化函数
                let paymentDateForSheet = null;
                if (paymentInfo && paymentInfo.paymentDate) {
                    paymentDateForSheet = this.formatDateToYYYYMMDD(paymentInfo.paymentDate);
                    if (paymentDateForSheet) {
                        Logger.debug('[utils.collectSyncData] 支付日期格式化为 YYYY-MM-DD:', paymentDateForSheet);
                    } else {
                        Logger.warn('[utils.collectSyncData] 无法格式化 paymentInfo.paymentDate:', paymentInfo.paymentDate);
                    }
                }

                // 优化：使用统一的日期格式化函数
                let expiryDateForSheet = expiryDate; // 如果解析失败，使用原始值
                if (expiryDate) {
                    const formattedExpiry = this.formatDateToYYYYMMDD(expiryDate);
                    if (formattedExpiry) {
                        expiryDateForSheet = formattedExpiry;
                        Logger.debug('[utils.collectSyncData] 到期日期格式化为 YYYY-MM-DD:', expiryDateForSheet);
                    } else {
                        Logger.warn('[utils.collectSyncData] 无法格式化到期日期，使用原始值:', expiryDate);
                    }
                } else {
                    Logger.warn('[utils.collectSyncData] 到期日期为空或缺失');
                }

                // 数据验证 - 确保所有必需字段存在
                const missingFields = [];
                if (!username) missingFields.push('username');
                if (!email) missingFields.push('email');
                if (!password) missingFields.push('password');
                if (!paymentDateForSheet) missingFields.push('paymentDate');
                if (!expiryDateForSheet) missingFields.push('expiryDate');

                // 记录数据状态（不暴露密码）
                Logger.debug('[utils.collectSyncData] 数据验证状态:', {
                    username: !!username,
                    email: !!email,
                    password: !!password,
                    paymentDateForSheet: !!paymentDateForSheet,
                    expiryDateForSheet: !!expiryDateForSheet,
                    rawPaymentInfo: paymentInfo,
                    missingFields: missingFields
                });

                if (missingFields.length > 0) {
                    const errorMsg = `缺少必需字段: ${missingFields.join(', ')}`;
                    Logger.warn('[utils.collectSyncData] 数据验证失败:', errorMsg);
                    return {
                        isValid: false,
                        data: null,
                        error: errorMsg
                    };
                }

                // 数据验证成功，准备返回数据
                const syncData = {
                    username: username,
                    email: email,
                    password: password,
                    paymentDate: paymentDateForSheet,
                    expiryDate: expiryDateForSheet
                };

                Logger.info('[utils.collectSyncData] 数据收集成功，所有必需字段完整');
                return {
                    isValid: true,
                    data: syncData,
                    error: null
                };

            } catch (error) {
                Logger.error('[utils.collectSyncData] 数据收集过程中发生错误:', error);
                return {
                    isValid: false,
                    data: null,
                    error: `数据收集错误: ${error.message}`
                };
            }
        },

        // {{CHENGQI:
        // Action: Added
        // Timestamp: 2025-07-01 16:35:00 +08:00
        // Reason: P3-UTILS-002 - 创建手动同步主函数，为手动同步提供统一的入口点
        // Principle_Applied: KISS (简洁职责清晰), 单一职责原则 (专门负责手动同步协调)
        // Optimization: 统一状态管理和错误处理，提升用户体验一致性
        // Architectural_Note (AR): 提供清晰的API接口，便于UI层调用
        // Documentation_Note (DW): 手动同步主要协调函数，实现状态管理和流程控制
        // }}
        // {{START MODIFICATIONS}}
        // + 新增手动同步主函数
        /**
         * 执行手动同步操作，协调数据收集、同步请求和状态管理
         * @returns {Promise<boolean>} 同步是否成功
         */
        performManualSync: async function() {
            Logger.info('[utils.performManualSync] 开始执行手动同步...');

            try {
                // 步骤1: 设置同步状态为进行中
                Logger.debug('[utils.performManualSync] 更新状态为"正在同步..."');
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '正在同步...');

                // 优化：使用防抖函数刷新面板
                debouncedCreateUserInfoPanel();

                // 步骤2: 收集同步数据
                Logger.debug('[utils.performManualSync] 调用数据收集功能...');
                const dataResult = await this.collectSyncData();

                if (!dataResult.isValid) {
                    Logger.warn('[utils.performManualSync] 数据收集失败:', dataResult.error);
                    await GM_setValue(SYNC_STATUS_MESSAGE_KEY, `同步跳过: ${dataResult.error}`);

                    // 优化：使用防抖函数刷新面板
                    debouncedCreateUserInfoPanel();

                    return false;
                }

                // 步骤3: 检查防重复机制 - 复用现有逻辑
                const lastSyncedPassword = await GM_getValue('otoy_last_synced_password', null);
                if (dataResult.data.password === lastSyncedPassword) {
                    Logger.info('[utils.performManualSync] 检测到重复数据，跳过同步');
                    await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步跳过: 记录已存在');

                    // 优化：使用防抖函数刷新面板
                    debouncedCreateUserInfoPanel();

                    return false;
                }

                // 步骤4: 执行同步操作
                Logger.info('[utils.performManualSync] 开始发送数据到Google Sheet...');
                const syncSuccess = await this.sendDataToGoogleSheet(dataResult.data);

                if (syncSuccess) {
                    Logger.info('[utils.performManualSync] 手动同步成功完成');

                    // 清理临时凭据 - 复用现有逻辑
                    await GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                    await GM_deleteValue(TEMP_PASSWORD_KEY);
                    await GM_setValue('otoy_last_synced_password', dataResult.data.password);

                    Logger.debug('[utils.performManualSync] 临时凭据已清理，最后同步密码已记录');
                } else {
                    Logger.error('[utils.performManualSync] 手动同步失败');
                }

                // 优化：使用防抖函数刷新面板
                debouncedCreateUserInfoPanel();

                return syncSuccess;

            } catch (error) {
                Logger.error('[utils.performManualSync] 手动同步过程中发生错误:', error);

                // 设置错误状态
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, `同步失败: ${error.message}`);

                // 优化：使用防抖函数刷新面板
                debouncedCreateUserInfoPanel();

                return false;
            }
        }
        // {{END MODIFICATIONS}}
    };

    // --- 全局辅助函数 ---

    /**
     * 清理文本中的标签和包裹性字符
     * 移除账号/密码/邮箱标签及其后的冒号，以及常见的包裹性字符（如【】、[]等）
     * @param {string} text - 需要清理的文本
     * @returns {string} 清理后的文本，如果输入不是字符串则返回空字符串
     * @example
     * cleanLabels("账号：test@example.com"); // "test@example.com"
     * cleanLabels("【密码：123456】"); // "123456"
     */
    function cleanLabels(text) {
        if (typeof text !== 'string') return '';
        // 移除常见的账号/密码/邮箱标签（包括带"OC"前缀的）及其后的冒号和空格，
        // 并移除常见的由粘贴产生的包裹性字符（如【】）和多余的空格。
        let cleaned = text.trim(); // 1. 初始清理首尾空格

        // 2. 移除标签，例如 "账号：", "OC 密码：", "邮箱" 等
        cleaned = cleaned.replace(/(OC\s*账号|账号|OC\s*密码|密码|邮箱)\s*[:：]?\s*/gi, '');

        // 3. 移除包裹性字符如 【...】 或 [[...]] 等，并提取内部内容
        //    例如："【  我的内容  】" 会尝试提取 "  我的内容  "
        cleaned = cleaned.replace(/^[\s【［\[\(]*(.*?)[\s】］\]\)]*$/g, '$1');

        // 4. 最终清理，确保移除所有因替换操作可能产生的新的首尾空格
        return cleaned.trim();
    }

    /**
     * 解析凭据字符串，提取账号和密码
     * 支持多种格式：换行符分隔、标签格式、空格分隔等
     * @param {string} rawInput - 原始输入字符串，可能包含账号和密码
     * @returns {{account: string|null, password: string|null}} 包含账号和密码的对象
     * @example
     * parseCredentials("test@example.com\npassword123"); // {account: "test@example.com", password: "password123"}
     * parseCredentials("账号：test@example.com 密码：password123"); // {account: "test@example.com", password: "password123"}
     */
    function parseCredentials(rawInput) {
        if (!rawInput || typeof rawInput !== 'string') {
             Logger.error('[parseCredentials] Invalid input:', rawInput);
             return { account: null, password: null };
        }
        const input = rawInput.trim();
        let account = null;
        let password = null;

        Logger.debug(`[parseCredentials] Attempting to parse input: "${input}"`);

        // --- 新增：邮件优先策略 ---
        Logger.debug('[parseCredentials] Trying Strategy E: Email detection first.');
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const emailMatch = input.match(emailRegex);

        if (emailMatch) {
            account = emailMatch[0];
            const emailEndIndex = emailMatch.index + account.length;
            const remainingPart = input.substring(emailEndIndex);
            password = cleanLabels(remainingPart); // cleanLabels 会移除标签并 trim
            Logger.debug(`[parseCredentials] Strategy E Result (Email Found): Account='${account}', Password='${password}'`);
            if (account && password) {
                return { account, password };
            }
             Logger.debug('[parseCredentials] Strategy E: Found email, but failed to extract a non-empty password from the remaining part.');
            // 如果只找到邮箱但密码为空，重置变量，继续尝试其他策略
            account = null;
            password = null;
        } else {
            Logger.debug('[parseCredentials] Strategy E: No email detected. Proceeding to other strategies.');
        }
        // --- 邮件优先策略结束 ---

        // 策略 A: 换行符
        if (input.includes('\n')) {
            Logger.debug('[parseCredentials] Strategy A: Newline detected.');
            const lines = input.split('\n');
            const nonEmptyLines = lines.map(line => line.trim()).filter(line => line);
            if (nonEmptyLines.length === 2) {
                account = cleanLabels(nonEmptyLines[0]);
                password = cleanLabels(nonEmptyLines[1]);
                Logger.debug(`[parseCredentials] Strategy A Result: Account='${account}', Password='${password}'`);
                if (account && password) return { account, password };
            } else {
                 Logger.debug('[parseCredentials] Strategy A: Found newline, but not exactly 2 non-empty lines.');
            }
            // Reset for next strategy if this failed
            account = null; password = null;
        }

        // 策略 B: 密码标签 (改进，更灵活地定位)
        Logger.debug('[parseCredentials] Trying Strategy B: Password label detection.');
        const pwdLabelMatch = input.match(/密码\s*[:：]?\s*(.+)/i);
        if (pwdLabelMatch) {
            password = pwdLabelMatch[1].trim();
            // 账号是密码标签之前的所有内容，清理掉账号标签
            const potentialAccountPart = input.substring(0, pwdLabelMatch.index).trim();
            account = cleanLabels(potentialAccountPart);
            Logger.debug(`[parseCredentials] Strategy B Result (Pwd Label): Account='${account}', Password='${password}'`);
            if (account && password) return { account, password };
        }
        // Reset for next strategy if this failed
        account = null; password = null;

        // 策略 C: 账号标签 (如果密码标签未找到)
        Logger.debug('[parseCredentials] Trying Strategy C: Account label detection.');
        const accLabelMatch = input.match(/账号\s*[:：]?\s*(.+)/i);
        if (accLabelMatch) {
            // 假设账号标签后的所有内容是账号+密码，尝试用空格分割
            const remainingText = accLabelMatch[1].trim();
            const accParts = remainingText.split(/\s+/);
            if (accParts.length >= 2) {
                 account = accParts[0];
                 password = accParts.slice(1).join(' ');
                 Logger.debug(`[parseCredentials] Strategy C Result (Acc Label): Account='${account}', Password='${password}'`);
                 if (account && password) return { account, password };
            }
        }
         // Reset for next strategy if this failed
        account = null; password = null;

        // 策略 D: 空格分割 (最终回退)
        Logger.debug('[parseCredentials] Strategy D: Trying space separation as final fallback.');
        // 在分割前，先清理一次标签，以应对 "账号xxx 密码yyy" 格式
        const cleanedInputForSpaceSplit = input.replace(/(账号|密码)\s*[:：]?\s*/gi, ' ').replace(/\s+/g, ' ').trim();
        const parts = cleanedInputForSpaceSplit.split(' '); // 使用单个空格分割，因为已合并空格
        const nonEmptyParts = parts.filter(part => part);

        if (nonEmptyParts.length >= 2) {
            account = nonEmptyParts[0];
            password = nonEmptyParts.slice(1).join(' ');
            Logger.debug(`[parseCredentials] Strategy D Result (Space Split): Account='${account}', Password='${password}'`);
            if (account && password) return { account, password };
        } else {
             Logger.debug('[parseCredentials] Strategy D: Not enough parts after space splitting.');
        }

        // 失败
        Logger.error('[parseCredentials] Failed to parse credentials from input:', rawInput);
        return { account: null, password: null };
    }

    // --- 全局弹窗函数 ---

    /**
     * 创建自定义提示对话框
     * 显示一个模态对话框，用于获取用户输入
     * @param {string} title - 对话框标题
     * @param {string} placeholder - 输入框的占位符文本
     * @returns {Promise<string|null>} 用户输入的文本，如果取消则返回null
     * @example
     * const result = await createCustomPrompt('请输入账号', '账号或邮箱');
     * if (result) console.log('用户输入:', result);
     */
    async function createCustomPrompt(title, placeholder) {
        Logger.debug('[createCustomPrompt] Called with title:', title);

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 10100;
            animation: otoyFadeIn 0.3s ease;
        `;

        // 创建对话框
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            padding: 32px;
            border-radius: var(--otoy-radius-xl, 16px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
            z-index: 10101;
            min-width: 420px;
            max-width: 90vw;
            font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
            animation: otoyDialogIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            border: 1px solid rgba(255, 255, 255, 0.3);
        `;

        // 添加特定动画
        if (!document.getElementById('otoy-dialog-animation')) {
            const animStyle = document.createElement('style');
            animStyle.id = 'otoy-dialog-animation';
            animStyle.textContent = `
                @keyframes otoyDialogIn {
                    from {
                        transform: translate(-50%, -50%) scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }
                @keyframes otoyDialogOut {
                    from {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    to {
                        transform: translate(-50%, -50%) scale(0.95);
                        opacity: 0;
                    }
                }
                @keyframes otoyFadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                @keyframes otoyInputFocus {
                    0% {
                        box-shadow: 0 0 0 0 rgba(30, 136, 229, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.1);
                    }
                }
            `;
            document.head.appendChild(animStyle);
        }

        // 使用传入的参数设置内容
        div.innerHTML = `
            <h3 style="
                margin: 0 0 24px 0;
                color: var(--otoy-neutral-900, #212121);
                font-size: 22px;
                text-align: center;
                font-weight: 600;
                letter-spacing: -0.02em;
                line-height: 1.3;
            ">${title}</h3>
            <input type="text" id="custom-credentials" placeholder="${placeholder}" style="
                display: block;
                width: 100%;
                padding: 14px 18px;
                margin-bottom: 28px;
                border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                border-radius: var(--otoy-radius-md, 8px);
                box-sizing: border-box;
                font-size: 15px;
                font-family: inherit;
                outline: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                background: rgba(255, 255, 255, 0.8);
                color: var(--otoy-neutral-900, #212121);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) inset;
            ">
            <div style="
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            ">
                <button id="custom-cancel" style="
                    padding: 12px 28px;
                    border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: var(--otoy-radius-md, 8px);
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 500;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                    color: var(--otoy-neutral-700, #616161);
                    letter-spacing: 0.02em;
                    position: relative;
                    overflow: hidden;
                ">取消</button>
                <button id="custom-submit" style="
                    padding: 12px 28px;
                    border: none;
                    background: linear-gradient(135deg, var(--otoy-primary, #1E88E5) 0%, #1976D2 100%);
                    color: white;
                    border-radius: var(--otoy-radius-md, 8px);
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 500;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                    letter-spacing: 0.02em;
                    box-shadow: 0 4px 14px rgba(30, 136, 229, 0.3);
                    position: relative;
                    overflow: hidden;
                ">确定</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(div);

        Logger.debug('[createCustomPrompt] Dialog and overlay appended to body. Checking for input field...');
        const checkInput = document.getElementById('custom-credentials');
        Logger.debug('[createCustomPrompt] Input field found by ID after append:', !!checkInput);

        const submitBtn = document.getElementById('custom-submit');
        const cancelBtn = document.getElementById('custom-cancel');

        // 添加增强的交互效果
        if (submitBtn) {
            submitBtn.onmouseover = () => {
                submitBtn.style.background = 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)';
                submitBtn.style.transform = 'translateY(-1px)';
                submitBtn.style.boxShadow = '0 6px 20px rgba(30, 136, 229, 0.4)';
            };
            submitBtn.onmouseout = () => {
                submitBtn.style.background = 'linear-gradient(135deg, #1E88E5 0%, #1976D2 100%)';
                submitBtn.style.transform = 'translateY(0)';
                submitBtn.style.boxShadow = '0 4px 14px rgba(30, 136, 229, 0.3)';
            };
            submitBtn.onmousedown = () => {
                submitBtn.style.transform = 'translateY(0)';
                submitBtn.style.boxShadow = '0 2px 8px rgba(30, 136, 229, 0.3)';
            };
        }

        if (cancelBtn) {
            cancelBtn.onmouseover = () => {
                cancelBtn.style.background = 'rgba(245, 245, 245, 0.9)';
                cancelBtn.style.borderColor = 'var(--otoy-neutral-400, #BDBDBD)';
                cancelBtn.style.transform = 'translateY(-1px)';
            };
            cancelBtn.onmouseout = () => {
                cancelBtn.style.background = 'rgba(255, 255, 255, 0.8)';
                cancelBtn.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                cancelBtn.style.transform = 'translateY(0)';
            };
        }

        if (checkInput) {
            checkInput.onfocus = () => {
                checkInput.style.borderColor = 'var(--otoy-primary, #1E88E5)';
                checkInput.style.background = 'rgba(255, 255, 255, 1)';
                checkInput.style.animation = 'otoyInputFocus 0.3s ease forwards';
            };
            checkInput.onblur = () => {
                checkInput.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                checkInput.style.background = 'rgba(255, 255, 255, 0.8)';
                checkInput.style.animation = 'none';
            };
            // 自动聚焦输入框
            setTimeout(() => checkInput.focus(), 100);
        }

        // 返回 Promise 以处理用户交互
        return new Promise((resolve, reject) => {
            const cleanup = () => {
                // 添加退出动画
                div.style.animation = 'otoyDialogOut 0.3s ease forwards';
                overlay.style.animation = 'otoyFadeOut 0.3s ease forwards';

                setTimeout(() => {
                // 检查元素是否存在再尝试移除
                if (div.parentNode) div.parentNode.removeChild(div);
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, 300);
            };

            submitBtn.onclick = () => {
                const value = checkInput.value;
                cleanup();
                resolve(value); // 返回输入框的值
            };

            cancelBtn.onclick = () => {
                cleanup();
                reject(new Error('用户取消操作')); // 使用 Error 对象 reject
            };

            checkInput.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                } else if (e.key === 'Escape') {
                    cancelBtn.click();
                }
            };
        });
    }
    // --- 全局弹窗函数结束 ---

    // --- 优化：面板更新防抖机制 ---
    let panelUpdateTimer = null;

    /**
     * 防抖版本的用户信息面板创建函数
     * 避免频繁调用导致不必要的DOM操作和性能问题
     * @param {number} delay - 防抖延迟时间（毫秒），默认使用CONSTANTS.TIMEOUTS.PANEL_UPDATE_DEBOUNCE
     * @returns {void}
     */
    function debouncedCreateUserInfoPanel(delay = CONSTANTS.TIMEOUTS.PANEL_UPDATE_DEBOUNCE) {
        if (panelUpdateTimer) {
            clearTimeout(panelUpdateTimer);
        }
        panelUpdateTimer = setTimeout(async () => {
            try {
                await createUserInfoPanel();
            } catch (error) {
                Logger.error('[debouncedCreateUserInfoPanel] 调用 createUserInfoPanel 时发生错误:', error);
            } finally {
                panelUpdateTimer = null;
            }
        }, delay);
    }

    // --- 用户信息悬浮面板辅助函数 ---

    /**
     * 注入面板样式到文档头部
     * 仅在首次调用时注入，避免重复添加
     */
    function injectPanelStyles() {
        if (document.getElementById('otoy-panel-styles')) {
            return; // 样式已存在，跳过
        }

        const style = document.createElement('style');
        style.id = 'otoy-panel-styles';
        style.textContent = `
                #otoy-user-info-panel {
                    position: fixed;
                    left: 20px;
                    bottom: 20px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
                    backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: var(--otoy-radius-xl, 16px);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.06);
                    padding: 24px;
                    width: 320px;
                    z-index: 10001;
                    font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
                    font-size: 14px;
                    color: var(--otoy-neutral-800, #424242);
                    line-height: 1.6;
                    animation: otoyPanelSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes otoyPanelSlideIn {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                #otoy-user-info-panel:hover {
                    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);
                    transform: translateY(-2px);
                }

                .panel-section {
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                    position: relative;
                }

                .panel-section:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }

                .panel-section::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 20%;
                    right: 20%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(30, 136, 229, 0.2), transparent);
                }

                .panel-section:last-child::after {
                    display: none;
                }

                .info-line {
                    margin-bottom: 12px;
                   display: flex;
                   justify-content: space-between;
                    align-items: center;
                    transition: transform 0.2s ease;
                }

                .info-line:hover {
                    transform: translateX(2px);
                }

                 .info-line:last-child {
                     margin-bottom: 0;
                 }

                .info-label {
                    font-weight: 500;
                    color: var(--otoy-neutral-600, #757575);
                    margin-right: 8px;
                    font-size: 13px;
                    letter-spacing: 0.02em;
                }

                .info-value {
                    color: var(--otoy-neutral-900, #212121);
                    word-break: break-all;
                    text-align: right;
                    font-weight: 500;
                    flex: 1;
                    max-width: 70%;
                }

                 .expiry-line {
                     display: flex;
                     align-items: center;
                     justify-content: space-between;
                    margin-bottom: 12px;
                    padding: 8px 12px;
                    background: rgba(30, 136, 229, 0.06);
                    border-radius: var(--otoy-radius-md, 8px);
                    transition: all 0.2s ease;
                }

                .expiry-line:hover {
                    background: rgba(30, 136, 229, 0.1);
                }

                #copy-expiry-btn {
                    background: var(--otoy-primary, #1E88E5);
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 6px 16px;
                    font-size: 12px;
                    border-radius: var(--otoy-radius-sm, 4px);
                    margin-left: 12px;
                    transition: all 0.2s ease;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                    box-shadow: 0 2px 8px rgba(30, 136, 229, 0.25);
                }

                #copy-expiry-btn:hover {
                    background: var(--otoy-primary-hover, #1976D2);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.35);
                }

                #copy-expiry-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 6px rgba(30, 136, 229, 0.25);
                }

                 #copy-expiry-btn:disabled {
                    opacity: 0.6;
                     cursor: default;
                    transform: none;
                    box-shadow: none;
                 }

                .rate-line {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    padding: 10px 12px;
                    background: rgba(0, 0, 0, 0.02);
                    border-radius: var(--otoy-radius-md, 8px);
                    transition: all 0.2s ease;
                }

                .rate-line:hover {
                    background: rgba(0, 0, 0, 0.04);
                    transform: translateX(2px);
                }

                .rate-label {
                    color: var(--otoy-neutral-600, #757575);
                    font-size: 13px;
                    font-weight: 500;
                }

                .rate-value {
                    font-weight: 700;
                    font-size: 15px;
                    letter-spacing: -0.02em;
                    font-variant-numeric: tabular-nums;
                }

                .todo-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .todo-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    padding: 12px;
                    background: rgba(0, 0, 0, 0.02);
                    border-radius: var(--otoy-radius-md, 8px);
                    transition: all 0.2s ease;
                }

                .todo-item:hover:not(.completed) {
                    background: rgba(30, 136, 229, 0.06);
                    transform: translateX(4px);
                }

                 .todo-item:last-child {
                     margin-bottom: 0;
                 }

                .todo-item.completed {
                    background: rgba(76, 175, 80, 0.08);
                    opacity: 0.8;
                }

                .todo-icon {
                    margin-right: 12px;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    transition: transform 0.3s ease;
                }

                .todo-item.completed .todo-icon {
                    color: var(--otoy-success, #4CAF50);
                    transform: scale(1.1);
                }

                .todo-item:not(.completed) .todo-icon {
                    color: var(--otoy-warning, #FF9800);
                    animation: otoyPulse 2s infinite;
                }

                .todo-link {
                    text-decoration: none;
                    color: var(--otoy-primary, #1E88E5);
                    font-weight: 500;
                    transition: color 0.2s ease;
                    flex: 1;
                }

                 .todo-link:hover {
                    color: var(--otoy-primary-hover, #1976D2);
                 }

                .todo-item.completed .todo-link {
                    color: var(--otoy-neutral-600, #757575);
                    text-decoration: line-through;
                    pointer-events: none;
                }

                .status-message {
                    color: var(--otoy-error, #F44336);
                    font-weight: 600;
                    margin-top: 12px;
                    font-size: 13px;
                    background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%);
                    border: 1px solid rgba(244, 67, 54, 0.2);
                    padding: 12px 16px;
                    border-radius: var(--otoy-radius-md, 8px);
                    text-align: center;
                    animation: otoyShake 0.5s ease-in-out;
                }

                #cooldown-timers-list p {
                    margin: 8px 0;
                    padding: 8px 12px;
                    background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%);
                    border-radius: var(--otoy-radius-sm, 4px);
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--otoy-warning, #FF9800);
                    animation: otoyPulse 2s infinite;
                    text-align: center;
                }

                .sync-status-section {
                    margin-top: 16px;
                    padding-top: 16px;
                    font-size: 13px;
                    text-align: center;
                }

                .sync-status-text {
                    padding: 8px 16px;
                    border-radius: var(--otoy-radius-md, 8px);
                    display: inline-block;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                    transition: all 0.2s ease;
                }

                .sync-status-success {
                    color: var(--otoy-success, #4CAF50);
                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%);
                    border: 1px solid rgba(76, 175, 80, 0.3);
                }

                .sync-status-failure {
                    color: var(--otoy-error, #F44336);
                    background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%);
                    border: 1px solid rgba(244, 67, 54, 0.3);
                }

                .sync-status-pending {
                    color: var(--otoy-primary, #1E88E5);
                    background: linear-gradient(135deg, rgba(30, 136, 229, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%);
                    border: 1px solid rgba(30, 136, 229, 0.3);
                    animation: otoyPulse 1.5s infinite;
                }

                .sync-status-default {
                    color: var(--otoy-neutral-600, #757575);
                    background: rgba(0, 0, 0, 0.04);
                    border: 1px solid rgba(0, 0, 0, 0.08);
                }

                /* 响应式设计 */
                @media (max-width: 600px) {
                  #otoy-user-info-panel {
                        width: calc(100vw - 40px);
                        max-width: 400px;
                        left: 20px;
                        right: 20px;
                        bottom: 20px;
                        font-size: 15px;
                    }

                    .panel-section {
                        margin-bottom: 16px;
                        padding-bottom: 16px;
                    }

                    .info-line, .rate-line {
                        padding: 8px 10px;
                    }

                    .todo-item {
                        padding: 10px;
                    }
                }

                /* 暗色模式支持 */
                @media (prefers-color-scheme: dark) {
                    #otoy-user-info-panel {
                        background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(25, 25, 25, 0.95) 100%);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        color: #E0E0E0;
                    }

                    .info-label, .rate-label {
                        color: #BDBDBD;
                    }

                  .info-value {
                        color: #F5F5F5;
                    }

                    .panel-section {
                        border-bottom-color: rgba(255, 255, 255, 0.1);
                    }

                    .rate-line, .todo-item {
                        background: rgba(255, 255, 255, 0.05);
                    }

                    .rate-line:hover, .todo-item:hover:not(.completed) {
                        background: rgba(255, 255, 255, 0.08);
                  }
                }

                /* {{CHENGQI:
                // Action: Added
                // Timestamp: 2025-07-01 16:40:00 +08:00
                // Reason: P3-CSS-003 - 添加手动同步按钮样式，确保与现有设计体系一致
                // Principle_Applied: KISS (简洁清晰的样式), DRY (重用现有CSS变量和设计模式)
                // Optimization: 完整的交互状态支持，响应式设计和暗色模式兼容
                // Architectural_Note (AR): 符合现有的设计语言和视觉层次
                // Documentation_Note (DW): 手动同步按钮完整样式系统，支持所有交互状态
                // }} */
                /* 手动同步按钮样式 */
                .manual-sync-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    background: var(--otoy-primary, #1E88E5);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    margin-left: 8px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 6px rgba(30, 136, 229, 0.25);
                    position: relative;
                    flex-shrink: 0;
                }

                .manual-sync-btn:hover:not(:disabled) {
                    background: var(--otoy-primary-hover, #1976D2);
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.35);
                }

                .manual-sync-btn:active:not(:disabled) {
                    transform: scale(0.95);
                    box-shadow: 0 2px 6px rgba(30, 136, 229, 0.25);
                }

                .manual-sync-btn:disabled {
                    background: var(--otoy-neutral-400, #BDBDBD);
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .manual-sync-btn:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.2), 0 2px 6px rgba(30, 136, 229, 0.25);
                }

                /* 按钮图标 */
                .manual-sync-btn-icon {
                    width: 14px;
                    height: 14px;
                    fill: white;
                    transition: transform 0.3s ease;
                }

                /* 加载状态旋转动画 */
                .manual-sync-btn.loading .manual-sync-btn-icon {
                    animation: otoyManualSyncSpin 1s linear infinite;
                }

                @keyframes otoyManualSyncSpin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* 同步状态区域布局 */
                .sync-status-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 16px;
                    padding-top: 16px;
                    font-size: 13px;
                }

                .sync-status-section .sync-status-text {
                    flex: 1;
                    text-align: center;
                }

                /* 手动同步按钮显示/隐藏逻辑相关样式 */
                .manual-sync-btn.hidden {
                    display: none;
                }

                .manual-sync-btn.show {
                    display: inline-flex;
                    animation: otoyButtonFadeIn 0.3s ease;
                }

                @keyframes otoyButtonFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                /* 响应式设计 - 手动同步按钮 */
                @media (max-width: 600px) {
                    .manual-sync-btn {
                        width: 26px;
                        height: 26px;
                        margin-left: 10px;
                    }

                    .manual-sync-btn-icon {
                        width: 15px;
                        height: 15px;
                    }

                    .sync-status-section {
                        gap: 10px;
                    }
                }

                /* 暗色模式 - 手动同步按钮 */
                @media (prefers-color-scheme: dark) {
                    .manual-sync-btn:disabled {
                        background: rgba(255, 255, 255, 0.2);
                    }

                    .manual-sync-btn:focus {
                        box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.3), 0 2px 6px rgba(30, 136, 229, 0.25);
                    }
                }
            `;
        document.head.appendChild(style);
    }

    /**
     * 读取面板所需的所有数据
     * @returns {Promise<Object>} 包含所有面板数据的对象
     */
    async function readPanelData() {
        const username = GM_getValue('otoy_username', '未知');
        const email = GM_getValue('otoy_email', '未知');
        let expiryDateText = GM_getValue('otoy_expiry_date', '加载中...');
        const statusMessage = GM_getValue('otoy_status_message', null);
        const cardDeleted = GM_getValue('otoy_card_deleted', false);
        const subscriptionCancelled = await GM_getValue(SUBSCRIPTION_CANCELLED_STATUS_KEY, false);
        const syncStatusMessage = await GM_getValue(SYNC_STATUS_MESSAGE_KEY, '等待同步...');
        const latestPaymentInfo = await GM_getValue(LATEST_PAYMENT_INFO_KEY, null);

        // 格式化支付日期
        let displayPaymentDate = '未获取';
        if (latestPaymentInfo && latestPaymentInfo.paymentDate) {
            const parsedPaymentDate = utils.parseFormattedDate(latestPaymentInfo.paymentDate);
            if (parsedPaymentDate) {
                displayPaymentDate = utils.formatDate(parsedPaymentDate);
                Logger.debug(`[UserInfoPanel] Payment date formatted for display: ${displayPaymentDate} (original: ${latestPaymentInfo.paymentDate}, subID: ${latestPaymentInfo.subID})`);
            } else {
                displayPaymentDate = latestPaymentInfo.paymentDate;
                Logger.warn(`[UserInfoPanel] Failed to parse paymentDate: ${latestPaymentInfo.paymentDate}`);
            }
        }

        // 格式化到期日期
        let displayExpiryDate = expiryDateText;
        if (expiryDateText && expiryDateText !== '加载中...' && expiryDateText !== '无有效订阅') {
            const parsedDate = utils.parseFormattedDate(expiryDateText);
            if (parsedDate) {
                displayExpiryDate = utils.formatDate(parsedDate);
                Logger.debug(`[UserInfoPanel] Expiry date formatted for display: ${displayExpiryDate} (original: ${expiryDateText})`);
            } else {
                Logger.warn(`[UserInfoPanel] Failed to parse expiryDateText: ${expiryDateText}`);
            }
        }

        return {
            username,
            email,
            expiryDateText,
            displayExpiryDate,
            statusMessage,
            cardDeleted,
            subscriptionCancelled,
            syncStatusMessage,
            displayPaymentDate
        };
    }

    /**
     * 构建面板HTML内容
     * @param {Object} data - 面板数据对象
     * @returns {string} HTML字符串
     */
    function buildPanelHTML(data) {
        const { username, email, displayExpiryDate, displayPaymentDate, statusMessage, cardDeleted, subscriptionCancelled } = data;

        const isDateValid = displayExpiryDate !== '加载中...' && displayExpiryDate !== '无有效订阅';

        let contentHTML = `
            <div class="panel-section">
                <!-- 用户信息 -->
                <div class="info-line">
                    <span class="info-label">用户:</span>
                    <span class="info-value">${username}</span>
                </div>
                <div class="info-line">
                    <span class="info-label">邮箱:</span>
                    <span class="info-value">${email}</span>
                </div>
            </div>

            <div class="panel-section">
                <!-- 订阅信息 -->
                <div class="info-line">
                    <span class="info-label">支付时间:</span>
                    <span class="info-value">${displayPaymentDate}</span>
                </div>
                <div class="expiry-line">
                    <span class="info-label">到期时间:</span>
                    <span id="panel-expiry-date-text" class="info-value">${displayExpiryDate}</span>`;

        if (isDateValid) {
            contentHTML += `<button id="copy-expiry-btn" title="复制到期信息">复制</button>`;
        }

        contentHTML += `
                </div>
            </div>`;

        // 状态消息
        if (statusMessage && statusMessage !== '支付处理中，请等待冷却结束') {
            contentHTML += `<div class="panel-section"><p class="status-message">${statusMessage}</p></div>`;
        }

        // ToDo列表
        contentHTML += `
            <div class="panel-section">
                <ul class="todo-list">
                    <li class="todo-item${cardDeleted ? ' completed' : ''}">
                        <span class="todo-icon">${cardDeleted ? '✅' : '⏳'}</span>
                        <a href="${CONFIG.URLS.CARDS}" class="todo-link">删除绑定的信用卡</a>
                    </li>
                    <li class="todo-item${subscriptionCancelled ? ' completed' : ''}">
                        <span class="todo-icon">${subscriptionCancelled ? '✅' : '⏳'}</span>
                        <a href="${CONFIG.URLS.SUBSCRIPTIONS}" class="todo-link">取消自动续费</a>
                    </li>
                </ul>
            </div>
        `;

        // 汇率和冷却计时器
        contentHTML += `
            <div class="panel-section">
                 <div class="rate-line">
                    <span class="rate-label">${CONSTANTS.EUR_AMOUNTS.SMALL} EUR ≈</span>
                    <span id="eur-rmb-value-1" class="rate-value" title="汇率来源: exchangerate.host">计算中...</span>
                </div>
                <div class="rate-line">
                    <span class="rate-label">${CONSTANTS.EUR_AMOUNTS.LARGE} EUR ≈</span>
                    <span id="eur-rmb-value-2" class="rate-value" title="汇率来源: exchangerate.host">计算中...</span>
                </div>
                <div id="cooldown-timers-list" style="margin-top: 10px;"></div>
            </div>
        `;

        // 同步状态
        contentHTML += `
            <div class="sync-status-section">
                <span class="sync-status-text" id="sync-status-text">读取中...</span>
                <button
                    type="button"
                    class="manual-sync-btn hidden"
                    id="manual-sync-btn"
                    title="手动重试同步"
                    aria-label="手动重试同步"
                    role="button">
                    <svg class="manual-sync-btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                </button>
            </div>
        `;

        return contentHTML;
    }

    // --- 用户信息悬浮面板主函数 ---
    async function createUserInfoPanel() {
        try {
            // 移除已存在的面板
            const existingPanel = document.getElementById('otoy-user-info-panel');
            if (existingPanel) {
                Logger.debug('[createUserInfoPanel] Removing existing panel before recreating.');
                existingPanel.remove();
            }

            // 注入样式
            injectPanelStyles();

            // 读取数据
            const panelData = await readPanelData();

        // 从 panelData 中提取 syncStatusMessage 和 displayExpiryDate 供后续使用
        const { syncStatusMessage, displayExpiryDate } = panelData;

        // 计算 isDateValid，用于后续的复制按钮逻辑
        const isDateValid = displayExpiryDate !== '加载中...' && displayExpiryDate !== '无有效订阅';

        // 创建面板元素并设置HTML
        const panel = document.createElement('div');
        panel.id = 'otoy-user-info-panel';
        panel.innerHTML = buildPanelHTML(panelData);

        // --- 冷却计时器、复制按钮事件监听器等逻辑保持不变 ---
        // ... (Existing logic for cooldown timer display) ...
        const timersListContainer = panel.querySelector('#cooldown-timers-list');
        let cooldownIntervalId = null; // (可选) 存储 Interval ID

        function updateActiveTimersDisplay() {
            // ... (Function content remains the same) ...
            const timers = GM_getValue('otoy_cooldown_timers', {}); // 每次都重新读取
            const loggedInUsername = GM_getValue('otoy_username', null);
            let needsStorageUpdate = false;
            const now = Date.now();
            let activeTimersFound = false; // 标志是否有活动计时器

            if (timersListContainer) {
                timersListContainer.innerHTML = ''; // 清空旧列表

                Object.keys(timers).forEach(timerUsername => {
                    const timerData = timers[timerUsername];
                    const endTime = timerData.startTime + timerData.duration;
            const remainingTime = endTime - now;

                    if (remainingTime > 0) {
                        activeTimersFound = true; // 发现活动计时器
                        // 计时器有效，显示
                        const timerElement = document.createElement('p');
                        timerElement.style.cssText = `
                            color: #fd7e14; /* Orange */
                            font-weight: bold;
                            font-size: 12px;
                            margin: 5px 0;
                            text-align: center;
                        `;
                        timerElement.textContent = `["${timerUsername}": 支付冷却中: "${utils.formatRemainingTime(remainingTime)}"]`;
                        timersListContainer.appendChild(timerElement);
            } else {
                        // 计时器过期，标记清理
                        Logger.debug(`[Cooldown Cleanup] Timer for ${timerUsername} expired.`);
                        delete timers[timerUsername];
                        needsStorageUpdate = true;

                        // 如果过期的是当前登录用户的计时器，并且全局状态是冷却状态，则清除全局状态
                        if (timerUsername === loggedInUsername && GM_getValue('otoy_status_message') === '支付处理中，请等待冷却结束') {
                            Logger.debug(`[Cooldown Cleanup] Clearing global status message as timer for logged-in user ${loggedInUsername} expired.`);
                            GM_deleteValue('otoy_status_message');
                            // Note: The status message display was already handled above based on statusMessage value
                        }
                    }
                });

                // 如果有计时器被清理，更新存储
                if (needsStorageUpdate) {
                    Logger.debug('[Cooldown Cleanup] Updating GM storage with expired timers removed.');
                    GM_setValue('otoy_cooldown_timers', timers);
                }

            } else {
                Logger.error('[Cooldown Display] Could not find #cooldown-timers-list container in panel.');
                // 如果找不到容器，也应该停止计时器
                if (cooldownIntervalId) {
                    clearInterval(cooldownIntervalId);
                    cooldownIntervalId = null;
                    Logger.debug('[Cooldown Interval] Cleared interval due to missing container.');
                }
            }
        }

        // 初始调用一次以显示当前状态
        updateActiveTimersDisplay();

        // 启动定时器，每秒更新一次
        if (cooldownIntervalId) clearInterval(cooldownIntervalId);
        cooldownIntervalId = setInterval(updateActiveTimersDisplay, 1000);
        Logger.debug('[Cooldown Interval] Started interval timer for display updates.');


        // --- 修改：调用新的汇率处理逻辑 ---
        const apiKey = '1d4fe01f53f66567b0363d16907cfc36'; // <-- Update API Key
        // 将调用放在 panel 元素添加到 DOM 之后执行
        setTimeout(() => {
            const rmbSpan1 = panel.querySelector('#eur-rmb-value-1'); // Use querySelector for robustness
            const rmbSpan2 = panel.querySelector('#eur-rmb-value-2');

            if (rmbSpan1 && rmbSpan2) {
                 Logger.debug('[createUserInfoPanel] Attempting to get EUR/CNY rate...');
                 utils.getEurCnyRate(apiKey) // Call the new main function
                 .then(result => {
                      Logger.debug('[createUserInfoPanel] Received result from getEurCnyRate:', result);
                      if (typeof result === 'number') {
                           // Rate received (could be fresh or stale)
                           // 优化：使用常量
                           const rate = result;
                           const rmbValue1 = rate * CONSTANTS.EUR_AMOUNTS.SMALL;
                           const rmbValue2 = rate * CONSTANTS.EUR_AMOUNTS.LARGE;

                           rmbSpan1.textContent = `${rmbValue1.toFixed(2)} RMB`;
                           rmbSpan2.textContent = `${rmbValue2.toFixed(2)} RMB`;
                           rmbSpan1.style.color = rmbValue1 >= 190 ? '#dc3545' : '#28a745'; // Use specific colors
                           rmbSpan2.style.color = rmbValue2 >= 1845 ? '#dc3545' : '#28a745';
                           rmbSpan1.title = `汇率: ${rate.toFixed(6)} (来源: exchangerate.host)`; // Add rate to title
                           rmbSpan2.title = `汇率: ${rate.toFixed(6)} (来源: exchangerate.host)`;

                           Logger.debug(`[createUserInfoPanel] Rate calculation successful. Rate: ${rate.toFixed(6)}`);

                      } else if (result === 'WAITING') {
                           // Waiting for 10 AM update
                           Logger.debug('[createUserInfoPanel] Waiting for 10 AM rate update.');
                           const waitMsg = "等待10点后更新...";
                           rmbSpan1.textContent = waitMsg;
                           rmbSpan2.textContent = waitMsg;
                           rmbSpan1.style.color = ''; // Reset color
                           rmbSpan2.style.color = '';
                           rmbSpan1.title = '汇率将在每日10点后首次加载时更新';
                           rmbSpan2.title = '汇率将在每日10点后首次加载时更新';
        } else {
                           // Should not happen with current logic, but handle defensively
                           Logger.warn('[createUserInfoPanel] Received unexpected result from getEurCnyRate:', result);
                           rmbSpan1.textContent = '未知状态';
                           rmbSpan2.textContent = '未知状态';
                           rmbSpan1.style.color = '';
                           rmbSpan2.style.color = '';
                      }
                 })
                 .catch(error => {
                      // This catch block now only triggers if API fetch failed AND no old rate was available
                      Logger.error('[createUserInfoPanel] Failed to get EUR/CNY rate and no fallback available:', error);
                      const errorMsg = `计算失败: ${error.message || error}`;
                      rmbSpan1.textContent = '计算失败';
                      rmbSpan2.textContent = '计算失败';
                      rmbSpan1.title = errorMsg;
                      rmbSpan2.title = errorMsg;
                      rmbSpan1.style.color = '#dc3545'; // Error color
                      rmbSpan2.style.color = '#dc3545';
                 });
            } else {
                 Logger.error('[createUserInfoPanel] Could not find one or both rate display elements.');
        }
        }, 100); // Delay slightly

        // NEW: Update Sync Status Display
        const syncStatusElement = panel.querySelector('#sync-status-text');
        if (syncStatusElement) {
            syncStatusElement.textContent = syncStatusMessage;
            syncStatusElement.className = 'sync-status-text'; // Reset classes first
            if (syncStatusMessage === '同步成功') {
                syncStatusElement.classList.add('sync-status-success');
            } else if (syncStatusMessage.startsWith('同步失败:')) {
                syncStatusElement.classList.add('sync-status-failure');
            } else if (syncStatusMessage === '正在同步...') { // Check for pending status
                syncStatusElement.classList.add('sync-status-pending');
            } else { // Default or '等待同步...'
                 syncStatusElement.classList.add('sync-status-default');
            }
            Logger.debug(`[createUserInfoPanel] Sync status set to: ${syncStatusMessage}`);
        } else {
            Logger.error('[createUserInfoPanel] Could not find #sync-status-text element.');
        }
        // End NEW Sync Status Display Logic

        // {{CHENGQI:
        // Action: Added
        // Timestamp: 2025-07-01 16:55:00 +08:00
        // Reason: P3-STATE-006 - 实现智能状态管理系统，根据同步状态控制按钮显示/隐藏
        // Principle_Applied: KISS (简洁的状态逻辑), 单一职责原则 (专门负责按钮状态管理)
        // Optimization: 智能化的按钮显示逻辑，避免不必要的用户操作，提升UX
        // Architectural_Note (AR): 清晰的状态-视图映射规则，符合响应式UI设计原则
        // Documentation_Note (DW): 智能按钮状态管理系统，根据同步状态自动控制可见性
        // }}
        // {{START MODIFICATIONS}}
        // + 新增智能按钮状态管理系统
        const manualSyncBtnForState = panel.querySelector('#manual-sync-btn');
        if (manualSyncBtnForState) {
            // 智能显示/隐藏逻辑
            let shouldShowButton = false;

            if (syncStatusMessage === '同步成功') {
                // 同步成功时隐藏按钮，无需手动重试
                shouldShowButton = false;
                Logger.debug('[Button State] 同步成功，隐藏手动同步按钮');

            } else if (syncStatusMessage.startsWith('同步失败:')) {
                // 同步失败时显示按钮，允许用户重试
                shouldShowButton = true;
                Logger.debug('[Button State] 同步失败，显示手动同步按钮供重试');

            } else if (syncStatusMessage.startsWith('同步跳过:')) {
                // 同步跳过时显示按钮，允许用户手动触发
                shouldShowButton = true;
                Logger.debug('[Button State] 同步跳过，显示手动同步按钮供手动触发');

            } else if (syncStatusMessage === '正在同步...') {
                // 正在同步时隐藏按钮，避免重复操作
                shouldShowButton = false;
                Logger.debug('[Button State] 正在同步中，隐藏手动同步按钮');

            } else {
                // 默认状态（如"等待同步..."）显示按钮，允许用户主动同步
                shouldShowButton = true;
                Logger.debug('[Button State] 默认状态，显示手动同步按钮');
            }

            // 应用显示/隐藏状态
            if (shouldShowButton) {
                manualSyncBtnForState.classList.remove('hidden');
                manualSyncBtnForState.classList.add('show');
                Logger.debug('[Button State] 按钮已设置为显示状态');
            } else {
                manualSyncBtnForState.classList.remove('show');
                manualSyncBtnForState.classList.add('hidden');
                Logger.debug('[Button State] 按钮已设置为隐藏状态');
            }

            Logger.debug(`[Button State] 智能状态管理完成 - 状态: "${syncStatusMessage}", 显示按钮: ${shouldShowButton}`);
        } else {
            Logger.error('[Button State] 未找到手动同步按钮元素，无法进行状态管理');
        }
        // {{END MODIFICATIONS}}

        // ... (Existing logic for copy button listener) ...
        if (isDateValid) {
            const copyBtn = panel.querySelector('#copy-expiry-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', async (e) => { // Make async for GM_getValue
                    e.preventDefault();
                    e.stopPropagation();

                    const calculatedRenewalExpiryDate = await GM_getValue('otoy_calculated_renewal_expiry_date', null);
                    let textToCopy = '';
                    // Ensure otoy_original_expiry_date_for_renewal_copy is also awaited if it's set asynchronously elsewhere, but it's usually set before this click.
                    const originalExpiryDateForCopy = await GM_getValue('otoy_original_expiry_date_for_renewal_copy', null); // Expects YYYY年MM月DD日

                    if (calculatedRenewalExpiryDate && originalExpiryDateForCopy) {
                        // 步骤 4 的复制逻辑 (新需求)
                        // originalExpiryDateForCopy should be YYYY年MM月DD日 from createRenewalPromptMonths
                        // calculatedRenewalExpiryDate is YYYY年MM月DD日 from createRenewalPromptMonths
                        textToCopy = `最新订阅充值已经提交！\n${originalExpiryDateForCopy}软件会自动刷新充值时间！\n账号最新的到期时间是：${calculatedRenewalExpiryDate}！`;
                        Logger.debug(`[Copy Button] 步骤 4 (自定义月数续费后) 复制内容. Original: ${originalExpiryDateForCopy}, Calculated: ${calculatedRenewalExpiryDate}`);

                        // 清除临时GM值
                        await GM_deleteValue('otoy_calculated_renewal_expiry_date');
                        await GM_deleteValue('otoy_original_expiry_date_for_renewal_copy');

                    } else {
                        // 原有的复制逻辑 (作为后备)
                        const latestExpiryDateStr = await GM_getValue('otoy_expiry_date', null); // This is the general expiry, YYYY年MM月DD日 or YYYY-MM-DD
                        const originalExpiryDateForGeneralOps = await GM_getValue('otoy_original_expiry_date', null); // Used for 'just renewed' from purchase flow, usually YYYY-MM-DD

                        let formattedLatestExpiryDateForCopy = '未知到期日';
                        if (latestExpiryDateStr) {
                            const parsedForCopy = utils.parseFormattedDate(latestExpiryDateStr);
                            if (parsedForCopy) {
                                formattedLatestExpiryDateForCopy = utils.formatDate(parsedForCopy); // to "YYYY年MM月DD日"
                            } else {
                                formattedLatestExpiryDateForCopy = latestExpiryDateStr; // Use raw if parsing fails
                                Logger.warn(`[Copy Button] (后备逻辑) 无法解析 latestExpiryDateStr: ${latestExpiryDateStr}。将使用原始值。`);
                            }
                        } else {
                            Logger.error('[Copy Button] (后备逻辑) 无法获取有效的 otoy_expiry_date');
                            utils.showNotification('错误：无法获取到期日期');
                            return;
                        }

                        // 后备逻辑：检查是否是刚通过标准购买流程续费 (非步骤4的自定义月数弹窗续费)
                        if (originalExpiryDateForGeneralOps && originalExpiryDateForGeneralOps !== latestExpiryDateStr) {
                            let formattedOriginalExpiryDate = originalExpiryDateForGeneralOps;
                            const parsedOriginal = utils.parseFormattedDate(originalExpiryDateForGeneralOps);
                            if (parsedOriginal) {
                                formattedOriginalExpiryDate = utils.formatDate(parsedOriginal);
                            }
                            textToCopy = `最新订阅充值已经提交！\n${formattedOriginalExpiryDate}软件会自动刷新充值时间！\n账号最新的到期时间是：${formattedLatestExpiryDateForCopy}！`;
                            Logger.debug(`[Copy Button] (后备逻辑) '刚续费' 条件满足. Text: "${textToCopy.replace(/\n/g, '\\n')}"`);
                        } else {
                            // 后备逻辑：非刚续费，根据剩余天数决定格式
                            const latestExpiryDateForDiff = utils.parseFormattedDate(latestExpiryDateStr);
                            if (!latestExpiryDateForDiff) {
                                Logger.error(`[Copy Button] (后备逻辑) 日期解析失败 (for diff calculation): "${latestExpiryDateStr}"`);
                                utils.showNotification('错误：无法解析到期日期以计算差异');
                                return;
                            }

                            const currentDate = new Date();
                            currentDate.setHours(0, 0, 0, 0);
                            const dayDiff = Math.ceil((latestExpiryDateForDiff.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                            Logger.debug(`[Copy Button] (后备逻辑) 计算日差: ${dayDiff} (基于 ${latestExpiryDateStr})`);

                            if (dayDiff >= 29) { // 大于等于约一个月
                                textToCopy = `账号充值完成:\n最新到期时间：${formattedLatestExpiryDateForCopy}`;
                                Logger.debug(`[Copy Button] (后备逻辑) dayDiff >= 29. Text: "${textToCopy.replace(/\n/g, '\\n')}"`);
                            } else { // 少于一个月，或者日期无效
                                textToCopy = `最新到期时间：${formattedLatestExpiryDateForCopy}`;
                                Logger.warn(`[Copy Button] (后备逻辑) 非刚续费且 dayDiff < 29 (${dayDiff}). 使用默认回退文本. Text: "${textToCopy.replace(/\n/g, '\\n')}"`);
                            }
                        }
                    }

                    utils.copyToClipboard(textToCopy);

                    copyBtn.textContent = '已复制!';
                    copyBtn.disabled = true;
                    setTimeout(() => {
                        copyBtn.textContent = '复制';
                        copyBtn.disabled = false;
                    }, 1500);
                });
            }
        }

        // {{CHENGQI:
        // Action: Added
        // Timestamp: 2025-07-01 16:50:00 +08:00
        // Reason: P3-EVENT-005 - 添加手动同步按钮事件监听器，实现防抖机制和状态管理
        // Principle_Applied: KISS (简洁的事件处理), 单一职责原则 (专门处理按钮交互)
        // Optimization: 防抖机制防止重复点击，完善的加载状态和错误反馈
        // Architectural_Note (AR): 清晰的事件处理分离，符合现有的事件监听器模式
        // Documentation_Note (DW): 手动同步按钮事件监听器，提供完整的用户交互支持
        // }}
        // {{START MODIFICATIONS}}
        // + 新增手动同步按钮事件监听器
        const manualSyncBtn = panel.querySelector('#manual-sync-btn');
        if (manualSyncBtn) {
            // 防抖机制 - 防止短时间内重复点击
            let isProcessing = false;

            manualSyncBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                Logger.debug('[Manual Sync Button] 按钮被点击');

                // 防抖检查
                if (isProcessing) {
                    Logger.debug('[Manual Sync Button] 同步正在进行中，忽略重复点击');
                    return;
                }

                try {
                    // 设置处理状态
                    isProcessing = true;

                    // 更新按钮状态为加载中
                    manualSyncBtn.disabled = true;
                    manualSyncBtn.classList.add('loading');

                    Logger.info('[Manual Sync Button] 开始执行手动同步...');

                    // 调用手动同步函数
                    const syncResult = await utils.performManualSync();

                    Logger.info(`[Manual Sync Button] 手动同步完成，结果: ${syncResult}`);

                    // 根据结果提供用户反馈
                    if (syncResult) {
                        utils.showNotification('手动同步成功！');
                    } else {
                        utils.showNotification('手动同步失败，请查看同步状态信息');
                    }

                } catch (error) {
                    Logger.error('[Manual Sync Button] 手动同步过程中发生错误:', error);
                    utils.showNotification(`手动同步错误: ${error.message}`);

                } finally {
                    // 恢复按钮状态
                    manualSyncBtn.disabled = false;
                    manualSyncBtn.classList.remove('loading');
                    isProcessing = false;

                    Logger.debug('[Manual Sync Button] 按钮状态已恢复');
                }
            });

            Logger.debug('[Manual Sync Button] 事件监听器已添加');
        } else {
            Logger.error('[Manual Sync Button] 未找到手动同步按钮元素');
        }
        // {{END MODIFICATIONS}}

            // 确保 document.body 存在
            if (!document.body) {
                Logger.error('[createUserInfoPanel] document.body 不存在，无法添加面板');
                return;
            }

            document.body.appendChild(panel);
            Logger.info('[createUserInfoPanel] 用户信息面板已创建并添加到DOM (布局调整：汇率在待办下方)。 Rate update logic initiated.');

            // 验证面板是否真的被添加
            const verifyPanel = document.getElementById('otoy-user-info-panel');
            if (!verifyPanel) {
                Logger.error('[createUserInfoPanel] 面板创建后验证失败：面板未在DOM中找到');
            } else {
                Logger.debug('[createUserInfoPanel] 面板验证成功：面板已在DOM中');
            }
        } catch (error) {
            Logger.error('[createUserInfoPanel] 创建用户信息面板时发生错误:', error);
            Logger.error('[createUserInfoPanel] 错误堆栈:', error.stack);
            // 尝试显示错误通知
            try {
                utils.showNotification('创建用户信息面板失败，请查看控制台日志');
            } catch (notifError) {
                Logger.error('[createUserInfoPanel] 无法显示错误通知:', notifError);
            }
        }
    }
    // --- 面板功能结束 ---

    // --- 新增：退出登录拦截器 ---

    /**
     * 添加退出登录拦截器
     * 在用户点击退出链接时，检查待办事项是否完成
     * 如果待办事项未完成，阻止退出并导航到相应的页面
     * @returns {void}
     */
    function addLogoutInterceptor() {
        Logger.debug('[addLogoutInterceptor] 添加退出登录拦截器...');
        document.addEventListener('click', async (e) => {
            // 查找被点击元素或其父级中的退出链接
            const logoutLink = e.target.closest('a[href$="logout.php"]');

            if (logoutLink) {
                Logger.debug('[addLogoutInterceptor] 检测到退出链接点击。');

                // 异步获取待办事项状态
                const cardDeleted = await GM_getValue('otoy_card_deleted', false);
                const subscriptionCancelled = await GM_getValue('otoy_subscription_cancelled', false);

                Logger.debug(`[addLogoutInterceptor] 待办事项状态 - 信用卡已删除: ${cardDeleted}, 订阅已取消: ${subscriptionCancelled}`);

                if (!cardDeleted) {
                    Logger.info('[addLogoutInterceptor] 阻止退出：信用卡删除未完成。');
                    e.preventDefault(); // 阻止默认导航
                    utils.showNotification('操作提示：请先完成删除信用卡操作！');
                    utils.navigateTo('CARDS', { reason: '待办事项：删除信用卡' });
                } else if (!subscriptionCancelled) {
                    Logger.info('[addLogoutInterceptor] 阻止退出：取消自动续费未完成。');
                    e.preventDefault(); // 阻止默认导航
                    utils.showNotification('操作提示：请先完成取消自动续费操作！');
                    utils.navigateTo('SUBSCRIPTIONS', { reason: '待办事项：取消自动续费' });
                } else {
                    Logger.debug('[addLogoutInterceptor] 所有待办事项已完成，准备允许退出登录。');
                    // Clear session data BEFORE allowing navigation to logout.php
                    // utils.clearUserSessionData is async, so ensure this completes.
                    // The event listener itself is not async, so we can't directly await here.
                    // One way is to preventDefault, then await, then navigate.
                    e.preventDefault(); // Prevent default navigation first
                    e.stopPropagation(); // Stop other listeners
                    utils.clearUserSessionData().then(() => {
                        Logger.debug('[addLogoutInterceptor] 用户会话数据已清除，现在导航到 logout.php。');
                        utils.navigateTo(logoutLink.href, { reason: '用户退出登录' });
                    }).catch(err => {
                        Logger.error('[addLogoutInterceptor] Error clearing session data, still logging out:', err);
                        utils.navigateTo(logoutLink.href, { reason: '用户退出登录（清理失败但仍继续）' });
                    });
                    // 不阻止默认行为，允许退出 (This line is effectively replaced by the async handling above)
                }
            }
        }, true); // 使用捕获阶段，以确保在链接默认行为之前执行
    }
    // --- 拦截器结束 ---

    // --- 新增：续费弹窗 ---

    /**
     * 创建续费提示对话框
     * 当订阅即将到期时，显示续费提示并允许用户选择续费月数
     * @returns {void}
     */
    function createRenewalPrompt() {
        const oldDialog = document.getElementById('custom-renewal-dialog');
        const oldOverlay = document.getElementById('custom-renewal-overlay');
        if (oldDialog) oldDialog.remove();
        if (oldOverlay) oldOverlay.remove();

        return new Promise((resolve, reject) => {
            const overlay = document.createElement('div');
            overlay.id = 'custom-renewal-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 10005;
                animation: otoyFadeIn 0.3s ease;
            `;

            const dialog = document.createElement('div');
            dialog.id = 'custom-renewal-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                padding: 32px;
                border-radius: var(--otoy-radius-xl, 16px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                z-index: 10006;
                min-width: 400px;
                max-width: 90vw;
                font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
                animation: otoyDialogIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                border: 1px solid rgba(255, 255, 255, 0.3);
            `;

            dialog.innerHTML = `
                <h3 style="
                    margin: 0 0 28px 0;
                    color: var(--otoy-neutral-900, #212121);
                    font-size: 22px;
                    text-align: center;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                ">续费订阅</h3>
                <div style="margin-bottom: 20px;">
                    <label for="renewal-months" style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        color: var(--otoy-neutral-700, #616161);
                        font-weight: 500;
                        letter-spacing: 0.02em;
                    ">续费月数:</label>
                    <input type="number" id="renewal-months" min="1" value="1" style="
                        display: block;
                        width: 100%;
                        padding: 14px 18px;
                        border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                        border-radius: var(--otoy-radius-md, 8px);
                        box-sizing: border-box;
                        font-size: 15px;
                        font-family: inherit;
                        outline: none;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        background: rgba(255, 255, 255, 0.8);
                        color: var(--otoy-neutral-900, #212121);
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) inset;
                    ">
                </div>
                <div style="
                    margin-bottom: 28px;
                    padding: 16px;
                    background: rgba(30, 136, 229, 0.05);
                    border-radius: var(--otoy-radius-md, 8px);
                    border: 1px solid rgba(30, 136, 229, 0.1);
                ">
                    <span style="
                        display: block;
                        margin-bottom: 12px;
                        font-size: 14px;
                        color: var(--otoy-neutral-700, #616161);
                        font-weight: 500;
                        letter-spacing: 0.02em;
                    ">计算方式:</span>
                    <div style="display: flex; gap: 24px;">
                        <label style="
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            font-size: 14px;
                            color: var(--otoy-neutral-800, #424242);
                            transition: color 0.2s ease;
                        ">
                            <input type="radio" id="days-37" name="daysPerMonth" value="37" checked style="
                                margin-right: 8px;
                                cursor: pointer;
                                accent-color: var(--otoy-primary, #1E88E5);
                            ">
                            <span>37天/月 (标准)</span>
                        </label>
                        <label style="
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            font-size: 14px;
                            color: var(--otoy-neutral-800, #424242);
                            transition: color 0.2s ease;
                        ">
                            <input type="radio" id="days-30" name="daysPerMonth" value="30" style="
                                margin-right: 8px;
                                cursor: pointer;
                                accent-color: var(--otoy-primary, #1E88E5);
                            ">
                            <span>30天/月</span>
                        </label>
                    </div>
                </div>
                <div style="
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                ">
                    <button id="renewal-cancel" style="
                        padding: 12px 28px;
                        border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                        background: rgba(255, 255, 255, 0.8);
                        border-radius: var(--otoy-radius-md, 8px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        color: var(--otoy-neutral-700, #616161);
                        letter-spacing: 0.02em;
                        position: relative;
                        overflow: hidden;
                    ">取消</button>
                    <button id="renewal-submit" style="
                        padding: 12px 28px;
                        border: none;
                        background: linear-gradient(135deg, var(--otoy-primary, #1E88E5) 0%, #1976D2 100%);
                        color: white;
                        border-radius: var(--otoy-radius-md, 8px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        letter-spacing: 0.02em;
                        box-shadow: 0 4px 14px rgba(30, 136, 229, 0.3);
                        position: relative;
                        overflow: hidden;
                    ">确定</button>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(dialog);

            const monthsInput = dialog.querySelector('#renewal-months');
            const submitBtn = dialog.querySelector('#renewal-submit');
            const cancelBtn = dialog.querySelector('#renewal-cancel');

            // Enhanced style interactions
            if (submitBtn) {
                submitBtn.onmouseover = () => {
                    submitBtn.style.background = 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)';
                    submitBtn.style.transform = 'translateY(-1px)';
                    submitBtn.style.boxShadow = '0 6px 20px rgba(30, 136, 229, 0.4)';
                };
                submitBtn.onmouseout = () => {
                    submitBtn.style.background = 'linear-gradient(135deg, #1E88E5 0%, #1976D2 100%)';
                    submitBtn.style.transform = 'translateY(0)';
                    submitBtn.style.boxShadow = '0 4px 14px rgba(30, 136, 229, 0.3)';
                };
                submitBtn.onmousedown = () => {
                    submitBtn.style.transform = 'translateY(0)';
                    submitBtn.style.boxShadow = '0 2px 8px rgba(30, 136, 229, 0.3)';
                };
            }

            if (cancelBtn) {
                cancelBtn.onmouseover = () => {
                    cancelBtn.style.background = 'rgba(245, 245, 245, 0.9)';
                    cancelBtn.style.borderColor = 'var(--otoy-neutral-400, #BDBDBD)';
                    cancelBtn.style.transform = 'translateY(-1px)';
                };
                cancelBtn.onmouseout = () => {
                    cancelBtn.style.background = 'rgba(255, 255, 255, 0.8)';
                    cancelBtn.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                    cancelBtn.style.transform = 'translateY(0)';
                };
            }

            if (monthsInput) {
                monthsInput.onfocus = () => {
                    monthsInput.style.borderColor = 'var(--otoy-primary, #1E88E5)';
                    monthsInput.style.background = 'rgba(255, 255, 255, 1)';
                    monthsInput.style.boxShadow = '0 0 0 4px rgba(30, 136, 229, 0.1)';
                };
                monthsInput.onblur = () => {
                    monthsInput.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                    monthsInput.style.background = 'rgba(255, 255, 255, 0.8)';
                    monthsInput.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05) inset';
                };
            }

            const cleanup = () => {
                // 添加退出动画
                dialog.style.animation = 'otoyDialogOut 0.3s ease forwards';
                overlay.style.animation = 'otoyFadeOut 0.3s ease forwards';

                setTimeout(() => {
                    if (dialog.parentNode) document.body.removeChild(dialog);
                    if (overlay.parentNode) document.body.removeChild(overlay);
                }, 300);
            };

            submitBtn.onclick = () => {
                const months = parseInt(monthsInput.value, 10);
                const selectedDaysElement = dialog.querySelector('input[name="daysPerMonth"]:checked');
                if (!months || months <= 0) {
                    // 使用更现代的提示方式
                    monthsInput.style.borderColor = 'var(--otoy-error, #F44336)';
                    monthsInput.style.animation = 'otoyShake 0.5s ease-in-out';
                    monthsInput.focus();

                    setTimeout(() => {
                        monthsInput.style.animation = 'none';
                    }, 500);

                    utils.showNotification('请输入有效的续费月数（大于0的整数）');
                    return;
                }
                if (!selectedDaysElement) {
                    utils.showNotification('请选择计算方式');
                    return;
                }
                const days = parseInt(selectedDaysElement.value, 10);
                cleanup();
                resolve({ months, days });
            };

            cancelBtn.onclick = () => {
                cleanup();
                reject(new Error('用户取消续费'));
            };

            // Handle Enter key in input
            monthsInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                } else if (e.key === 'Escape') {
                    cancelBtn.click();
                }
            });

            // Auto focus input
            setTimeout(() => monthsInput.focus(), 100);
        });
    }
    // --- 续费弹窗结束 ---

    // --- 新增：自定义月数续费弹窗 (基于规则3) ---

    /**
     * 创建续费月数选择提示对话框
     * 允许用户选择续费的月数（1-12个月）
     * @returns {Promise<void>}
     */
    async function createRenewalPromptMonths() {
        const oldDialog = document.getElementById('custom-renewal-months-dialog');
        const oldOverlay = document.getElementById('custom-renewal-months-overlay');
        if (oldDialog) oldDialog.remove();
        if (oldOverlay) oldOverlay.remove();

        return new Promise(async (resolve, reject) => {
            const overlay = document.createElement('div');
            overlay.id = 'custom-renewal-months-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 10009;
                animation: otoyFadeIn 0.3s ease;
            `;

            const dialog = document.createElement('div');
            dialog.id = 'custom-renewal-months-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                padding: 32px;
                border-radius: var(--otoy-radius-xl, 16px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                z-index: 10010;
                min-width: 480px;
                max-width: 90vw;
                font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
                animation: otoyDialogIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                border: 1px solid rgba(255, 255, 255, 0.3);
            `;

            dialog.innerHTML = `
                <h3 style="
                    margin: 0 0 20px 0;
                    color: var(--otoy-neutral-900, #212121);
                    font-size: 22px;
                    text-align: center;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                ">续费提醒与计算</h3>
                <p style="
                    font-size: 15px;
                    color: var(--otoy-neutral-600, #757575);
                    margin-bottom: 28px;
                    text-align: center;
                    line-height: 1.6;
                ">您的上次支付日期较早，建议续费以确保服务连续。</p>
                <div style="margin-bottom: 20px;">
                    <label for="renewal-custom-months" style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        color: var(--otoy-neutral-700, #616161);
                        font-weight: 500;
                        letter-spacing: 0.02em;
                    ">续费月数:</label>
                    <input type="number" id="renewal-custom-months" min="1" value="1" style="
                        display: block;
                        width: 100%;
                        padding: 14px 18px;
                        border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                        border-radius: var(--otoy-radius-md, 8px);
                        box-sizing: border-box;
                        font-size: 15px;
                        font-family: inherit;
                        outline: none;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        background: rgba(255, 255, 255, 0.8);
                        color: var(--otoy-neutral-900, #212121);
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) inset;
                    ">
                </div>
                <div style="
                    margin-bottom: 24px;
                    padding: 16px;
                    background: rgba(76, 175, 80, 0.05);
                    border-radius: var(--otoy-radius-md, 8px);
                    border: 1px solid rgba(76, 175, 80, 0.1);
                ">
                    <span style="
                        display: block;
                        margin-bottom: 12px;
                        font-size: 14px;
                        color: var(--otoy-neutral-700, #616161);
                        font-weight: 500;
                        letter-spacing: 0.02em;
                    ">计算方式 (天/月):</span>
                    <div style="display: flex; gap: 24px;">
                        <label style="
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            font-size: 14px;
                            color: var(--otoy-neutral-800, #424242);
                            transition: color 0.2s ease;
                        ">
                            <input type="radio" id="renewal-days-30" name="renewalDaysPerMonth" value="30" checked style="
                                margin-right: 8px;
                                cursor: pointer;
                                accent-color: var(--otoy-success, #4CAF50);
                            ">
                            <span>30天</span>
                        </label>
                        <label style="
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            font-size: 14px;
                            color: var(--otoy-neutral-800, #424242);
                            transition: color 0.2s ease;
                        ">
                            <input type="radio" id="renewal-days-37" name="renewalDaysPerMonth" value="37" style="
                                margin-right: 8px;
                                cursor: pointer;
                                accent-color: var(--otoy-success, #4CAF50);
                            ">
                            <span>37天</span>
                        </label>
                    </div>
                </div>
                <div id="renewal-calculated-expiry-display" style="
                    margin-bottom: 28px;
                    font-size: 16px;
                    color: var(--otoy-success, #4CAF50);
                    text-align: center;
                    min-height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px;
                    background: rgba(76, 175, 80, 0.08);
                    border-radius: var(--otoy-radius-md, 8px);
                    font-weight: 500;
                    transition: all 0.3s ease;
                "></div>
                <div style="
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                ">
                    <button id="renewal-months-cancel" style="
                        padding: 12px 28px;
                        border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                        background: rgba(255, 255, 255, 0.8);
                        border-radius: var(--otoy-radius-md, 8px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        color: var(--otoy-neutral-700, #616161);
                        letter-spacing: 0.02em;
                        position: relative;
                        overflow: hidden;
                    ">取消</button>
                    <button id="renewal-months-submit" style="
                        padding: 12px 28px;
                        border: none;
                        background: linear-gradient(135deg, var(--otoy-success, #4CAF50) 0%, #388E3C 100%);
                        color: white;
                        border-radius: var(--otoy-radius-md, 8px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        letter-spacing: 0.02em;
                        box-shadow: 0 4px 14px rgba(76, 175, 80, 0.3);
                        position: relative;
                        overflow: hidden;
                    ">计算并确认</button>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(dialog);

            const monthsInput = dialog.querySelector('#renewal-custom-months');
            const submitBtn = dialog.querySelector('#renewal-months-submit');
            const cancelBtn = dialog.querySelector('#renewal-months-cancel');
            const displayDiv = dialog.querySelector('#renewal-calculated-expiry-display');
            const radioButtons = dialog.querySelectorAll('input[name="renewalDaysPerMonth"]');

            let currentLatestActiveExpiryDate = null;
            let currentLatestActiveExpiryDateStr = await GM_getValue('otoy_expiry_date', null);
            if (currentLatestActiveExpiryDateStr) {
                currentLatestActiveExpiryDate = utils.parseFormattedDate(currentLatestActiveExpiryDateStr);
            }
            if (!currentLatestActiveExpiryDate) {
                currentLatestActiveExpiryDate = new Date();
                currentLatestActiveExpiryDate.setHours(0,0,0,0);
                currentLatestActiveExpiryDateStr = utils.formatDate(currentLatestActiveExpiryDate);
                Logger.debug('[RenewalPromptMonths] 无有效现有到期日，或解析失败，将从今天开始计算。');
            }

            async function calculateAndDisplay() {
                const months = parseInt(monthsInput.value, 10);
                const selectedDaysElement = dialog.querySelector('input[name="renewalDaysPerMonth"]:checked');
                if (!months || months <= 0 || !selectedDaysElement) {
                    displayDiv.textContent = '请输入有效月数并选择计算方式。';
                    displayDiv.style.color = 'var(--otoy-error, #F44336)';
                    displayDiv.style.background = 'rgba(244, 67, 54, 0.08)';
                    return null;
                }
                const daysPerMonth = parseInt(selectedDaysElement.value, 10);

                const newExpiryDate = new Date(currentLatestActiveExpiryDate.getTime());
                newExpiryDate.setDate(newExpiryDate.getDate() + (months * daysPerMonth));

                const formattedNewExpiry = utils.formatDate(newExpiryDate);
                displayDiv.textContent = `计算出的新到期时间: ${formattedNewExpiry}`;
                displayDiv.style.color = 'var(--otoy-success, #4CAF50)';
                displayDiv.style.background = 'rgba(76, 175, 80, 0.08)';
                return { months, daysPerMonth, formattedNewExpiry, newExpiryDateObj: newExpiryDate };
            }

            monthsInput.oninput = calculateAndDisplay;
            radioButtons.forEach(radio => radio.onchange = calculateAndDisplay);
            calculateAndDisplay();

            // Enhanced style interactions
            if (submitBtn) {
                submitBtn.onmouseover = () => {
                    submitBtn.style.background = 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)';
                    submitBtn.style.transform = 'translateY(-1px)';
                    submitBtn.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                };
                submitBtn.onmouseout = () => {
                    submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)';
                    submitBtn.style.transform = 'translateY(0)';
                    submitBtn.style.boxShadow = '0 4px 14px rgba(76, 175, 80, 0.3)';
                };
                submitBtn.onmousedown = () => {
                    submitBtn.style.transform = 'translateY(0)';
                    submitBtn.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
                };
            }

            if (cancelBtn) {
                cancelBtn.onmouseover = () => {
                    cancelBtn.style.background = 'rgba(245, 245, 245, 0.9)';
                    cancelBtn.style.borderColor = 'var(--otoy-neutral-400, #BDBDBD)';
                    cancelBtn.style.transform = 'translateY(-1px)';
                };
                cancelBtn.onmouseout = () => {
                    cancelBtn.style.background = 'rgba(255, 255, 255, 0.8)';
                    cancelBtn.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                    cancelBtn.style.transform = 'translateY(0)';
                };
            }

            if (monthsInput) {
                monthsInput.onfocus = () => {
                    monthsInput.style.borderColor = 'var(--otoy-success, #4CAF50)';
                    monthsInput.style.background = 'rgba(255, 255, 255, 1)';
                    monthsInput.style.boxShadow = '0 0 0 4px rgba(76, 175, 80, 0.1)';
                };
                monthsInput.onblur = () => {
                    monthsInput.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                    monthsInput.style.background = 'rgba(255, 255, 255, 0.8)';
                    monthsInput.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05) inset';
                };
            }

            const cleanup = () => {
                dialog.style.animation = 'otoyDialogOut 0.3s ease forwards';
                overlay.style.animation = 'otoyFadeOut 0.3s ease forwards';

                setTimeout(() => {
                    if (dialog.parentNode) document.body.removeChild(dialog);
                    if (overlay.parentNode) document.body.removeChild(overlay);
                }, 300);
            };

            submitBtn.onclick = async () => {
                const calculationResult = await calculateAndDisplay();
                if (!calculationResult) {
                    monthsInput.style.borderColor = 'var(--otoy-error, #F44336)';
                    monthsInput.style.animation = 'otoyShake 0.5s ease-in-out';
                    monthsInput.focus();

                    setTimeout(() => {
                        monthsInput.style.animation = 'none';
                    }, 500);

                    utils.showNotification('错误: 请输入有效月数并选择计算方式。');
                    return;
                }

                const { formattedNewExpiry, newExpiryDateObj } = calculationResult;
                const panelExpiryTextElement = document.getElementById('panel-expiry-date-text');
                if (panelExpiryTextElement) {
                    panelExpiryTextElement.textContent = formattedNewExpiry;
                }

                let originalExpiryForCopy = '未知原到期日';
                if (currentLatestActiveExpiryDateStr) {
                    const parsedOriginalForDisplay = utils.parseFormattedDate(currentLatestActiveExpiryDateStr);
                    if(parsedOriginalForDisplay) originalExpiryForCopy = utils.formatDate(parsedOriginalForDisplay);
                    else originalExpiryForCopy = currentLatestActiveExpiryDateStr;
                }

                await GM_setValue('otoy_original_expiry_date_for_renewal_copy', originalExpiryForCopy);
                await GM_setValue('otoy_calculated_renewal_expiry_date', formattedNewExpiry);
                await GM_setValue('otoy_expiry_date', formattedNewExpiry);
                utils.showNotification(`新到期时间 ${formattedNewExpiry} 已计算并更新。`);
                cleanup();
                resolve(calculationResult);
            };

            cancelBtn.onclick = () => {
                cleanup();
                reject(new Error('用户取消自定义月数续费'));
            };

            // Handle keyboard shortcuts
            monthsInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                } else if (e.key === 'Escape') {
                    cancelBtn.click();
                }
            });

            // Auto focus input
            setTimeout(() => monthsInput.focus(), 100);
        });
    }
    // --- 自定义月数续费弹窗结束 ---

    // --- 新增：订阅选择弹窗 ---

    /**
     * 创建订阅选择提示对话框
     * 当检测到多个订阅选项时，允许用户选择要处理的订阅
     * @returns {void}
     */
    function createSubscriptionChoicePrompt() {
        // 先移除可能存在的旧弹窗
        const oldDialog = document.getElementById('custom-subchoice-dialog');
        const oldOverlay = document.getElementById('custom-subchoice-overlay');
        if (oldDialog) oldDialog.remove();
        if (oldOverlay) oldOverlay.remove();

        return new Promise((resolve, reject) => {
            const overlay = document.createElement('div');
            overlay.id = 'custom-subchoice-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 10007;
                animation: otoyFadeIn 0.3s ease;
            `;

            const dialog = document.createElement('div');
            dialog.id = 'custom-subchoice-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                padding: 36px;
                border-radius: var(--otoy-radius-xl, 16px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                z-index: 10008;
                min-width: 480px;
                max-width: 90vw;
                font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
                animation: otoyDialogIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                border: 1px solid rgba(255, 255, 255, 0.3);
            `;

            dialog.innerHTML = `
                <h3 style="
                    margin: 0 0 20px 0;
                    color: var(--otoy-neutral-900, #212121);
                    font-size: 24px;
                    text-align: center;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                ">续费选择</h3>
                <p style="
                    margin-bottom: 32px;
                    font-size: 15px;
                    color: var(--otoy-neutral-600, #757575);
                    text-align: center;
                    line-height: 1.6;
                ">检测到当前无有效订阅或订阅即将过期，请选择续费方式：</p>
                <div style="
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 28px;
                ">
                    <button id="choice-30days" style="
                        padding: 18px 24px;
                        border: none;
                        background: linear-gradient(135deg, var(--otoy-success, #4CAF50) 0%, #388E3C 100%);
                        color: white;
                        border-radius: var(--otoy-radius-lg, 12px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        box-shadow: 0 4px 14px rgba(76, 175, 80, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        position: relative;
                        overflow: hidden;
                    ">
                        <span style="display: flex; align-items: center; gap: 12px;">
                            <span style="
                                width: 40px;
                                height: 40px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;
                            ">💎</span>
                            <span style="text-align: left;">
                                <div style="font-size: 16px; font-weight: 600;">续费30天</div>
                                <div style="font-size: 13px; opacity: 0.9; margin-top: 2px;">Studio+ 专业版</div>
                            </span>
                        </span>
                        <span style="
                            font-size: 13px;
                            background: rgba(255, 255, 255, 0.2);
                            padding: 4px 12px;
                            border-radius: 12px;
                        ">推荐</span>
                    </button>
                    <button id="choice-37days" style="
                        padding: 18px 24px;
                        border: none;
                        background: linear-gradient(135deg, var(--otoy-primary, #2196F3) 0%, #1976D2 100%);
                        color: white;
                        border-radius: var(--otoy-radius-lg, 12px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        box-shadow: 0 4px 14px rgba(33, 150, 243, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        position: relative;
                        overflow: hidden;
                    ">
                        <span style="display: flex; align-items: center; gap: 12px;">
                            <span style="
                                width: 40px;
                                height: 40px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;
                            ">⭐</span>
                            <span style="text-align: left;">
                                <div style="font-size: 16px; font-weight: 600;">续费37天</div>
                                <div style="font-size: 13px; opacity: 0.9; margin-top: 2px;">标准版</div>
                            </span>
                        </span>
                        <span style="
                            font-size: 13px;
                            background: rgba(255, 255, 255, 0.2);
                            padding: 4px 12px;
                            border-radius: 12px;
                        ">热门</span>
                    </button>
                    <button id="choice-1year" style="
                        padding: 18px 24px;
                        border: none;
                        background: linear-gradient(135deg, var(--otoy-warning, #FF9800) 0%, #F57C00 100%);
                        color: white;
                        border-radius: var(--otoy-radius-lg, 12px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        box-shadow: 0 4px 14px rgba(255, 152, 0, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        position: relative;
                        overflow: hidden;
                    ">
                        <span style="display: flex; align-items: center; gap: 12px;">
                            <span style="
                                width: 40px;
                                height: 40px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;
                            ">🚀</span>
                            <span style="text-align: left;">
                                <div style="font-size: 16px; font-weight: 600;">续费一年</div>
                                <div style="font-size: 13px; opacity: 0.9; margin-top: 2px;">Studio+ 年度版</div>
                            </span>
                        </span>
                        <span style="
                            font-size: 13px;
                            background: rgba(255, 255, 255, 0.2);
                            padding: 4px 12px;
                            border-radius: 12px;
                        ">超值</span>
                    </button>
                </div>
                <button id="choice-cancel" style="
                    padding: 12px 28px;
                    border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: var(--otoy-radius-md, 8px);
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 500;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                    color: var(--otoy-neutral-700, #616161);
                    letter-spacing: 0.02em;
                    display: block;
                    margin: 0 auto;
                    position: relative;
                    overflow: hidden;
                ">暂不续费</button>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(dialog);

            const btn30 = dialog.querySelector('#choice-30days');
            const btn37 = dialog.querySelector('#choice-37days');
            const btnYear = dialog.querySelector('#choice-1year');
            const btnCancel = dialog.querySelector('#choice-cancel');

            // Enhanced style interactions
            if (btn30) {
                btn30.onmouseover = () => {
                    btn30.style.background = 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)';
                    btn30.style.transform = 'translateY(-2px)';
                    btn30.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                };
                btn30.onmouseout = () => {
                    btn30.style.background = 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)';
                    btn30.style.transform = 'translateY(0)';
                    btn30.style.boxShadow = '0 4px 14px rgba(76, 175, 80, 0.3)';
                };
                btn30.onmousedown = () => {
                    btn30.style.transform = 'translateY(0)';
                    btn30.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
                };
            }
            if (btn37) {
                btn37.onmouseover = () => {
                    btn37.style.background = 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)';
                    btn37.style.transform = 'translateY(-2px)';
                    btn37.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.4)';
                };
                btn37.onmouseout = () => {
                    btn37.style.background = 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
                    btn37.style.transform = 'translateY(0)';
                    btn37.style.boxShadow = '0 4px 14px rgba(33, 150, 243, 0.3)';
                };
                btn37.onmousedown = () => {
                    btn37.style.transform = 'translateY(0)';
                    btn37.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.3)';
                };
            }
            if (btnYear) {
                btnYear.onmouseover = () => {
                    btnYear.style.background = 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)';
                    btnYear.style.transform = 'translateY(-2px)';
                    btnYear.style.boxShadow = '0 6px 20px rgba(255, 152, 0, 0.4)';
                };
                btnYear.onmouseout = () => {
                    btnYear.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
                    btnYear.style.transform = 'translateY(0)';
                    btnYear.style.boxShadow = '0 4px 14px rgba(255, 152, 0, 0.3)';
                };
                btnYear.onmousedown = () => {
                    btnYear.style.transform = 'translateY(0)';
                    btnYear.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.3)';
                };
            }
            if (btnCancel) {
                btnCancel.onmouseover = () => {
                    btnCancel.style.background = 'rgba(245, 245, 245, 0.9)';
                    btnCancel.style.borderColor = 'var(--otoy-neutral-400, #BDBDBD)';
                    btnCancel.style.transform = 'translateY(-1px)';
                };
                btnCancel.onmouseout = () => {
                    btnCancel.style.background = 'rgba(255, 255, 255, 0.8)';
                    btnCancel.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                    btnCancel.style.transform = 'translateY(0)';
                };
                btnCancel.onmousedown = () => {
                    btnCancel.style.transform = 'translateY(0)';
                };
            }

            const cleanup = () => {
                // 添加退出动画
                dialog.style.animation = 'otoyDialogOut 0.3s ease forwards';
                overlay.style.animation = 'otoyFadeOut 0.3s ease forwards';

                setTimeout(() => {
                if (dialog.parentNode === document.body) document.body.removeChild(dialog);
                if (overlay.parentNode === document.body) document.body.removeChild(overlay);
                }, 300);
            };

            if (btn30) {
                btn30.onclick = async () => {
                    cleanup();
                    Logger.info('[createSubscriptionChoicePrompt] 用户选择续费30天，跳转到 Studio+ 预付费页面...');
                    await utils.navigateTo('SUBSCRIPTIONS_STUDIO', { reason: '用户选择续费30天' });
                    resolve('30days');
                };
            }

            if (btn37) {
                btn37.onclick = async () => {
                    cleanup();
                    Logger.info('[createSubscriptionChoicePrompt] 用户选择续费37天，跳转到标准购买页面...');
                    await utils.navigateTo('PURCHASE_NEW', { reason: '用户选择续费37天' });
                    resolve('37days');
                };
            }

            if (btnYear) {
                btnYear.onclick = async () => {
                    cleanup();
                    Logger.info('[createSubscriptionChoicePrompt] 用户选择续费一年，跳转到 Studio+ 预付费页面...');
                    await utils.navigateTo('SUBSCRIPTIONS_STUDIO', { reason: '用户选择续费一年' });
                    resolve('1year');
                };
            }

            if (btnCancel) {
                btnCancel.onclick = () => {
                    cleanup();
                    Logger.debug('[createSubscriptionChoicePrompt] 用户取消续费选择。');
                    reject(new Error('用户取消续费选择'));
                };
            }
        });
    }
    // --- 订阅选择弹窗结束 ---

    // --- 优化：购买成功检测函数（多重检测机制）---
    /**
     * 检测购买是否成功（多重检测机制）
     * 结合文本消息、成功容器显示状态和返回按钮的存在性进行检测
     * @returns {Object} {success: boolean, reason: string} 检测结果和原因
     */
    function checkPaymentSuccess() {
        // 检测点1：成功消息文本
        const successMsg = document.querySelector(SELECTORS.PAYMENT_SUCCESS_MSG);
        const hasSuccessText = successMsg?.innerText === 'Your payment has been completed and your invoice has been processed.';

        // 检测点2：成功容器是否显示（检查样式，通常成功时会显示，处理中会隐藏）
        const successContainer = document.querySelector(SELECTORS.PAYMENT_SUCCESS_CONTAINER);
        const isContainerVisible = successContainer &&
            successContainer.offsetParent !== null &&
            window.getComputedStyle(successContainer).display !== 'none';

        // 检测点3：返回按钮是否存在（购买成功后会显示此按钮）
        const returnButton = document.querySelector(SELECTORS.PAYMENT_SUCCESS_BUTTON);
        const hasReturnButton = returnButton !== null &&
            returnButton.offsetParent !== null &&
            window.getComputedStyle(returnButton).display !== 'none';

        // 多重检测：只要满足任一条件就认为成功（提高可靠性）
        if (hasSuccessText || (isContainerVisible && hasReturnButton)) {
            const reasons = [];
            if (hasSuccessText) reasons.push('成功消息文本');
            if (isContainerVisible) reasons.push('成功容器显示');
            if (hasReturnButton) reasons.push('返回按钮存在');

            return {
                success: true,
                reason: `检测到购买成功（${reasons.join(' + ')}）`
            };
        }

        return { success: false, reason: '未检测到购买成功标志' };
    }

    // --- 优化：统一的订阅取消处理函数（消除重复代码）---
    // 注意：此函数将在 pageHandlers 定义后使用，所以 tryCancelSubscriptionRenewal 的调用需要延迟绑定
    /**
     * 统一的订阅取消处理函数
     * @param {string} subId - 订阅ID
     * @param {string} taskName - 任务名称（用于日志）
     * @param {Function} tryCancelFn - 取消订阅的函数引用（从 pageHandlers.tryCancelSubscriptionRenewal 传入）
     * @returns {Promise<boolean>} 是否成功处理
     */
    async function processSubscriptionCancellation(subId, taskName, tryCancelFn) {
        Logger.info(`[processSubscriptionCancellation] 开始处理订阅 ${subId} (任务: ${taskName})`);

        try {
            // 读取已取消列表
            const cancelledSubsList = JSON.parse(
                await GM_getValue(CANCELLED_SUB_IDS_LIST_KEY, '[]')
            );

            // 如果已经在列表中，直接返回
            if (cancelledSubsList.includes(subId)) {
                Logger.debug(`[processSubscriptionCancellation] 订阅 ${subId} 已在取消列表中`);
                return true;
            }

            // 查找取消按钮（使用常量选择器）
            const cancelButton = document.querySelector(SELECTORS.CANCEL_BUTTON);

            if (cancelButton) {
                // 有取消按钮，执行取消操作
                Logger.debug(`[processSubscriptionCancellation] 找到取消按钮，开始取消流程`);
                const cancellationConfirmed = await tryCancelFn();

                if (cancellationConfirmed) {
                    cancelledSubsList.push(subId);
                    await GM_setValue(CANCELLED_SUB_IDS_LIST_KEY, JSON.stringify(cancelledSubsList));
                    Logger.info(`[processSubscriptionCancellation] 订阅 ${subId} 取消成功并已标记`);
                    return true;
                } else {
                    Logger.warn(`[processSubscriptionCancellation] 订阅 ${subId} 取消操作未确认`);
                    return false;
                }
            } else {
                // 无取消按钮，视为已取消
                Logger.debug(`[processSubscriptionCancellation] 未找到取消按钮，视为已取消`);
                cancelledSubsList.push(subId);
                await GM_setValue(CANCELLED_SUB_IDS_LIST_KEY, JSON.stringify(cancelledSubsList));
                return true;
            }
        } catch (error) {
            Logger.error(`[processSubscriptionCancellation] 处理订阅 ${subId} 时出错:`, error);
            return false;
        }
    }

    // --- handleCards 辅助函数（在 pageHandlers 外部定义） ---

    /**
     * 完成卡片删除并导航到订阅页面
     * @returns {Promise<void>}
     */
    async function finalizeCardRemovalAndNavigate() {
        Logger.info('[finalizeCardRemovalAndNavigate] 开始处理卡片删除完成流程...');
        await utils.cleanupWorkflowStatus();
        await GM_setValue('otoy_card_deleted', true);

        const oldStatus = await GM_getValue('otoy_status_message');
        if (oldStatus === '无银行卡记录') {
            await GM_deleteValue('otoy_status_message');
        }

        await utils.navigateTo('SUBSCRIPTIONS', { reason: '卡片处理完成，返回订阅列表' });
    }

    /**
     * 查找包含卡片数据的目标tbody
     * @param {HTMLTableElement} table - 表格元素
     * @returns {HTMLTableSectionElement|null} 找到的tbody或null
     */
    function findTargetTbody(table) {
        for (let i = 0; i < table.tBodies.length; i++) {
            const tbody = table.tBodies[i];
            if (tbody.rows.length > 0) {
                const firstRow = tbody.rows[0];
                const rowText = firstRow.textContent.trim();
                if (SELECTORS.TEXT_PATTERNS.NO_CARD_MESSAGE.test(rowText) ||
                    firstRow.querySelector(SELECTORS.REMOVE_CARD_LINK)) {
                    Logger.debug(`[findTargetTbody] 找到目标tbody（索引${i}）`);
                    return tbody;
                }
            }
        }

        // 降级策略：使用第一个tbody
        if (table.tBodies.length > 0) {
            Logger.debug('[findTargetTbody] 使用降级策略：第一个tbody');
            return table.tBodies[0];
        }

        return null;
    }

    /**
     * 查找"无卡片"消息行
     * @param {HTMLTableSectionElement} tbody - tbody元素
     * @returns {HTMLTableRowElement|null} 找到的行或null
     */
    function findNoCardMessageRow(tbody) {
        for (let i = 0; i < tbody.rows.length; i++) {
            const row = tbody.rows[i];
            if (row.cells.length === 1 && row.cells[0]) {
                const cell = row.cells[0];
                const cellText = cell.textContent.trim();
                const colspanAttr = cell.getAttribute('colspan');

                if (colspanAttr && parseInt(colspanAttr) >= 4 &&
                    SELECTORS.TEXT_PATTERNS.NO_CARD_MESSAGE.test(cellText)) {
                    Logger.debug(`[findNoCardMessageRow] 在第${i + 1}行检测到"无卡片"消息`);
                    return row;
                }
            }
        }
        return null;
    }

    /**
     * 查找卡片数据行
     * @param {HTMLTableSectionElement} tbody - tbody元素
     * @param {HTMLTableRowElement|null} noCardMessageRow - "无卡片"消息行（用于排除）
     * @returns {HTMLTableRowElement|null} 找到的卡片数据行或null
     */
    function findCardDataRow(tbody, noCardMessageRow) {
        // 策略1：查找包含删除链接的行
        for (let i = 0; i < tbody.rows.length; i++) {
            const row = tbody.rows[i];
            if (row === noCardMessageRow) continue;

            const removeLink = row.querySelector(SELECTORS.REMOVE_CARD_LINK);
            if (removeLink) {
                Logger.debug(`[findCardDataRow] 在第${i + 1}行找到卡片数据行（包含删除链接）`);
                return row;
            }
        }

        // 策略2：查找包含卡片信息的行
        for (let i = 0; i < tbody.rows.length; i++) {
            const row = tbody.rows[i];
            if (row === noCardMessageRow) continue;

            const rowText = row.textContent.trim();
            if (row.cells.length >= 4 &&
                (SELECTORS.TEXT_PATTERNS.REMOVE_BUTTON.test(rowText) ||
                 rowText.match(/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/))) {
                Logger.debug(`[findCardDataRow] 在第${i + 1}行找到卡片数据行（包含卡片信息）`);
                return row;
            }
        }

        // 降级策略：使用第一行（排除"无卡片"消息行）
        for (let i = 0; i < tbody.rows.length; i++) {
            if (tbody.rows[i] !== noCardMessageRow) {
                Logger.debug(`[findCardDataRow] 使用降级策略：第${i + 1}行`);
                return tbody.rows[i];
            }
        }

        return null;
    }

    /**
     * 查找删除链接元素
     * @param {HTMLTableRowElement} cardDataRow - 卡片数据行
     * @returns {{link: HTMLAnchorElement, cell: HTMLTableCellElement}|null} 删除链接和单元格对象或null
     */
    function findRemoveLink(cardDataRow) {
        // 策略1：使用属性选择器查找
        let removeLink = cardDataRow.querySelector(SELECTORS.REMOVE_CARD_LINK);
        if (removeLink) {
            const removeCell = removeLink.closest('td');
            Logger.debug('[findRemoveLink] 通过属性选择器找到删除链接');
            return { link: removeLink, cell: removeCell };
        }

        // 策略2：遍历单元格查找包含删除文本的链接
        for (let i = 0; i < cardDataRow.cells.length; i++) {
            const cell = cardDataRow.cells[i];
            const cellText = cell.textContent.trim();
            if (SELECTORS.TEXT_PATTERNS.REMOVE_BUTTON.test(cellText)) {
                removeLink = cell.querySelector('a');
                if (removeLink) {
                    Logger.debug(`[findRemoveLink] 通过文本匹配在第${i + 1}个单元格找到删除链接`);
                    return { link: removeLink, cell: cell };
                }
            }
        }

        return null;
    }

    /**
     * 检查卡片删除状态
     * @param {Function} finalizeCallback - 删除完成后的回调函数
     * @param {number} maxAttempts - 最大尝试次数
     * @param {number} interval - 检查间隔（毫秒）
     * @returns {Promise<boolean>} 删除是否成功
     */
    async function checkRemovalStatus(finalizeCallback, maxAttempts = 10, interval = 500) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            Logger.debug(`[checkRemovalStatus] 检查删除状态 (尝试 ${attempt}/${maxAttempts})...`);

            const updatedTable = document.querySelector(SELECTORS.INVOICE_TABLE);
            if (!updatedTable) {
                Logger.warn('[checkRemovalStatus] 删除后未找到表格');
                await new Promise(resolve => setTimeout(resolve, interval));
                continue;
            }

            // 查找"无卡片"消息
            let cardActuallyRemoved = false;
            for (let i = 0; i < updatedTable.tBodies.length; i++) {
                const tbody = updatedTable.tBodies[i];
                for (let j = 0; j < tbody.rows.length; j++) {
                    const row = tbody.rows[j];
                    if (row.cells.length === 1 && row.cells[0]) {
                        const cell = row.cells[0];
                        const colspan = cell.getAttribute('colspan');
                        const text = cell.textContent.trim();

                        if (colspan && parseInt(colspan) >= 4 &&
                            SELECTORS.TEXT_PATTERNS.NO_CARD_MESSAGE.test(text)) {
                            cardActuallyRemoved = true;
                            Logger.info(`[checkRemovalStatus] 删除成功确认 - 在第${i + 1}个tbody的第${j + 1}行找到"无卡片"消息`);
                            break;
                        }
                    }
                }
                if (cardActuallyRemoved) break;
            }

            // 额外检查：删除链接是否消失
            if (!cardActuallyRemoved) {
                const stillHasRemoveLink = updatedTable.querySelector(SELECTORS.REMOVE_CARD_LINK);
                if (!stillHasRemoveLink) {
                    Logger.info('[checkRemovalStatus] 删除链接已消失，可能删除成功');
                    cardActuallyRemoved = true;
                }
            }

            if (cardActuallyRemoved) {
                Logger.info('[checkRemovalStatus] 卡片删除已确认');
                await finalizeCallback();
                return true;
            }

            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        }

        Logger.warn('[checkRemovalStatus] 无法确认卡片删除（超时）');
        return false;
    }

    /**
     * 页面处理器集合
     * 包含各种页面类型的处理逻辑
     * @namespace pageHandlers
     */
    const pageHandlers = {
        // --- 优化：订阅处理辅助函数 ---

        /**
         * 扫描页面获取活跃订阅列表
         * 从订阅页面的表格中提取所有未过期的活跃订阅信息
         * @returns {Array<Object>} 活跃订阅数组，每个对象包含：
         *   - {string} subID - 订阅ID
         *   - {Date} expiryDate - 到期日期对象
         *   - {string} expiryText - 到期日期文本
         *   - {string} viewInfoLink - 查看详情的链接
         */
        scanPageForActiveSubscriptions() {
            PerformanceMonitor.start('scanPageForActiveSubscriptions');
            const subs = [];
            // 优化：使用常量选择器
            const table = document.querySelector(SELECTORS.LICENSE_TABLE);
            if (!table) {
                Logger.warn('[scanPageForActiveSubscriptions] 未找到订阅表格');
                PerformanceMonitor.end('scanPageForActiveSubscriptions');
                return subs;
            }

            // 优化：使用表头定位列索引（替代硬编码索引）
            const expiryColumnIndex = utils.safeFindTableColumn(table, {
                headerText: SELECTORS.HEADERS.EXPIRY_DATE,
                fallbackIndex: SELECTORS.FALLBACK_INDICES.EXPIRY_DATE_COLUMN
            });

            // View Info列定位：通过查找包含View Info链接的列来定位（更稳定）
            let viewInfoColumnIndex = null;
            const headerRow = table.querySelector('thead tr') || table.rows[0];
            if (headerRow) {
                const headers = headerRow.cells || Array.from(headerRow.querySelectorAll('th, td'));
                // 查找包含View Info链接的列
                for (let i = 0; i < headers.length; i++) {
                    // 检查该列下的数据行是否包含View Info链接
                    const sampleRows = table.querySelectorAll('tbody tr, tbody + tr');
                    for (const row of sampleRows) {
                        if (row.cells && row.cells[i]) {
                            const link = row.cells[i].querySelector(SELECTORS.VIEW_INFO_LINK);
                            if (link) {
                                viewInfoColumnIndex = i;
                                Logger.debug(`[scanPageForActiveSubscriptions] 通过View Info链接找到列索引: ${i}`);
                                break;
                            }
                        }
                    }
                    if (viewInfoColumnIndex !== null) break;
                }
            }
            // 降级策略：如果未找到，使用固定索引
            if (viewInfoColumnIndex === null) {
                Logger.warn(`[scanPageForActiveSubscriptions] 未找到View Info列，使用降级索引: ${SELECTORS.FALLBACK_INDICES.VIEW_INFO_LINK_COLUMN}`);
                viewInfoColumnIndex = SELECTORS.FALLBACK_INDICES.VIEW_INFO_LINK_COLUMN;
            }

            if (expiryColumnIndex === null || viewInfoColumnIndex === null) {
                Logger.error('[scanPageForActiveSubscriptions] 无法定位必要的列，使用降级策略');
                PerformanceMonitor.end('scanPageForActiveSubscriptions');
                return subs;
            }

            const allRows = table.querySelectorAll('tbody tr, tbody + tr');
            const currentDateForExpiryCheck = new Date();
            currentDateForExpiryCheck.setHours(0, 0, 0, 0);

            allRows.forEach((row, index) => {
                // 跳过表头行
                if (index === 0 && row.parentElement.tagName === 'THEAD') return;

                const cells = row.cells;
                if (!cells || cells.length < Math.max(expiryColumnIndex, viewInfoColumnIndex) + 1) {
                    return;
                }

                // 使用定位到的列索引获取单元格
                const expiryDateTextCell = cells[expiryColumnIndex];
                const viewInfoLinkElement = cells[viewInfoColumnIndex]?.querySelector(SELECTORS.VIEW_INFO_LINK);

                if (expiryDateTextCell && viewInfoLinkElement) {
                    const expiryDateStr = expiryDateTextCell.textContent.trim();
                    const parsedDate = utils.parseFormattedDate(expiryDateStr);
                    const subIDMatch = viewInfoLinkElement.href.match(/subID=(\d+)/);
                    if (parsedDate && subIDMatch && parsedDate > currentDateForExpiryCheck) {
                        subs.push({
                            subID: subIDMatch[1],
                            expiryDate: parsedDate,
                            expiryText: expiryDateStr,
                            viewInfoLink: viewInfoLinkElement.href
                        });
                    }
                }
            });

            Logger.info(`[scanPageForActiveSubscriptions] 从页面表格提取到 ${subs.length} 个有效且未过期的原始订阅。`);
            PerformanceMonitor.end('scanPageForActiveSubscriptions');
            return subs;
        },

        /**
         * 处理订阅队列，更新队列并处理第一个订阅
         * 识别未取消的订阅并加入队列，然后处理队列中的第一个订阅
         * @param {Array<Object>} activeSubsRaw - 活跃订阅列表
         * @param {Object|null} latestActiveSub - 最新活跃订阅对象
         * @param {Array<string>} cancelledSubs - 已取消订阅ID列表
         * @param {Array<string>} queue - 待处理队列
         * @returns {Promise<{shouldNavigate: boolean, updatedQueue: Array<string>}>}
         *   返回处理结果，包含是否需要导航和更新后的队列
         */
        async processSubscriptionQueue(activeSubsRaw, latestActiveSub, cancelledSubs, queue) {
            PerformanceMonitor.start('processSubscriptionQueue');
            Logger.info('[processSubscriptionQueue] 开始处理订阅队列...');

            // 识别未取消的活跃订阅
            const uncancelledActiveSubs = activeSubsRaw.filter(sub => !cancelledSubs.includes(sub.subID));
            Logger.info(`[processSubscriptionQueue] 找到 ${uncancelledActiveSubs.length} 个未取消的活跃订阅`);

            // 更新队列
            let needsQueueUpdate = false;
            if (uncancelledActiveSubs.length > 0) {
                uncancelledActiveSubs.forEach(sub => {
                    if (!queue.includes(sub.subID)) {
                        queue.push(sub.subID);
                        needsQueueUpdate = true;
                        Logger.debug(`[processSubscriptionQueue] 添加订阅 ${sub.subID} 到队列`);
                    }
                });

                if (needsQueueUpdate) {
                    await GM_setValue(SUBS_TO_PROCESS_QUEUE_KEY, JSON.stringify(queue));
                    Logger.info(`[processSubscriptionQueue] 队列已更新，长度: ${queue.length}`);
                }
            }

            // 处理队列中的第一个订阅
            if (queue.length > 0) {
                const subIdToProcess = queue.shift();
                await GM_setValue(SUBS_TO_PROCESS_QUEUE_KEY, JSON.stringify(queue));
                Logger.info(`[processSubscriptionQueue] 处理队列中的订阅 ${subIdToProcess}，剩余: ${queue.length}`);

                const targetSub = activeSubsRaw.find(s => s.subID === subIdToProcess);
                if (targetSub) {
                    const task = (latestActiveSub && subIdToProcess === latestActiveSub.subID)
                        ? 'process_main_sub'
                        : 'cancel_queued_sub';

                    Logger.info(`[processSubscriptionQueue] 准备导航，任务: ${task}, 订阅ID: ${subIdToProcess}`);
                    await GM_setValue(DETAIL_PAGE_TASK_KEY, task);
                    await GM_setValue(PROCESSING_SUB_ID_KEY, subIdToProcess);

                    await new Promise(resolve => setTimeout(resolve, 200));

                    Logger.info(`[processSubscriptionQueue] 导航到: ${targetSub.viewInfoLink}`);
                    await utils.navigateTo(targetSub.viewInfoLink, {
                        delay: 200,
                        reason: `处理订阅 ${subIdToProcess} (任务: ${task})`
                    });
                    return { shouldNavigate: true, updatedQueue: queue };
                } else {
                    Logger.warn(`[processSubscriptionQueue] 订阅 ${subIdToProcess} 在活跃列表中未找到`);
                }
            }

            PerformanceMonitor.end('processSubscriptionQueue');
            return { shouldNavigate: false, updatedQueue: queue };
        },

        /**
         * 为最新活跃订阅获取支付日期
         * @param {Object} latestActiveSub - 最新活跃订阅
         * @param {Object} currentPaymentInfo - 当前支付信息
         * @param {string} attemptedSubIdForFetch - 已尝试获取的订阅ID
         * @returns {Promise<boolean>} 是否需要导航
         */
        async fetchPaymentDateForLatest(latestActiveSub, currentPaymentInfo, attemptedSubIdForFetch) {
            if (!latestActiveSub) return false;

            Logger.info('[fetchPaymentDateForLatest] 检查最新订阅的支付日期...');

            let needsPaymentDateFetch = false;
            if (!currentPaymentInfo || currentPaymentInfo.subID !== latestActiveSub.subID) {
                if (attemptedSubIdForFetch === latestActiveSub.subID) {
                    Logger.warn(`[fetchPaymentDateForLatest] 订阅 ${latestActiveSub.subID} 的支付信息获取已尝试过，跳过重试`);
                } else {
                    Logger.info(`[fetchPaymentDateForLatest] 需要获取订阅 ${latestActiveSub.subID} 的支付日期`);
                    needsPaymentDateFetch = true;
                }
            }

            if (needsPaymentDateFetch) {
                await GM_setValue(DETAIL_PAGE_TASK_KEY, 'fetch_payment_date_for_main');
                await GM_setValue(PROCESSING_SUB_ID_KEY, latestActiveSub.subID);
                await GM_setValue(FETCH_ATTEMPTED_SUBID_KEY, latestActiveSub.subID);
                Logger.info(`[fetchPaymentDateForLatest] 导航获取支付日期: ${latestActiveSub.subID}`);
                await utils.navigateTo(latestActiveSub.viewInfoLink, {
                    delay: 200,
                    reason: `获取订阅 ${latestActiveSub.subID} 的支付日期`
                });
                return true;
            }

            return false;
        },

        /**
         * 更新订阅取消状态
         * @param {Array} activeSubsRaw - 活跃订阅列表
         * @returns {Promise<void>}
         */
        async updateSubscriptionStatus(activeSubsRaw) {
            Logger.info('[updateSubscriptionStatus] 更新订阅取消状态...');

            const finalCheckCancelledSubs = JSON.parse(
                await GM_getValue(CANCELLED_SUB_IDS_LIST_KEY, '[]')
            );
            const finalCheckUncancelledActive = activeSubsRaw.filter(
                sub => !finalCheckCancelledSubs.includes(sub.subID)
            );

            if (finalCheckUncancelledActive.length === 0 && activeSubsRaw.length > 0) {
                await GM_setValue(SUBSCRIPTION_CANCELLED_STATUS_KEY, true);
                Logger.info('[updateSubscriptionStatus] 所有活跃订阅已处理，状态设为 true');
            } else if (finalCheckUncancelledActive.length > 0) {
                await GM_setValue(SUBSCRIPTION_CANCELLED_STATUS_KEY, false);
                Logger.info(`[updateSubscriptionStatus] 仍有 ${finalCheckUncancelledActive.length} 个未取消订阅，状态设为 false`);
            } else {
                await GM_setValue(SUBSCRIPTION_CANCELLED_STATUS_KEY, true);
                Logger.info('[updateSubscriptionStatus] 无活跃订阅，状态设为 true');
            }

            debouncedCreateUserInfoPanel();
        },

        /**
         * 处理续费提示
         * @param {Object} latestActiveSub - 最新活跃订阅
         * @param {Object} currentPaymentInfo - 当前支付信息
         * @returns {Promise<boolean>} 是否已显示提示并返回
         */
        async handleRenewalPrompts(latestActiveSub, currentPaymentInfo) {
            Logger.debug('[handleRenewalPrompts] 检查续费提示条件...');

            let latestExpiryDateObj = null;
            let latestExpiryTextForPanel = "无有效订阅";

            if (latestActiveSub) {
                latestExpiryDateObj = latestActiveSub.expiryDate;
                latestExpiryTextForPanel = latestActiveSub.expiryText;
            }

            await GM_setValue('otoy_expiry_date', latestExpiryTextForPanel);
            Logger.debug(`[handleRenewalPrompts] 到期日期已更新: ${latestExpiryTextForPanel}`);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // 检查是否即将过期（1天内）
            if (!latestExpiryDateObj || latestExpiryDateObj.getTime() <= today.getTime() + (1 * 24 * 60 * 60 * 1000)) {
                Logger.info('[handleRenewalPrompts] 订阅即将过期，显示选择提示');
                if (latestExpiryDateObj) {
                    Logger.debug(`[handleRenewalPrompts] 到期日期: ${utils.formatDate(latestExpiryDateObj)}`);
                }
                createSubscriptionChoicePrompt().catch(err =>
                    utils.handleError('handleRenewalPrompts', err, { logLevel: 'warn', showNotification: false })
                );
                return true;
            }

            // 检查支付日期是否超过2天
            if (currentPaymentInfo && currentPaymentInfo.subID === latestActiveSub?.subID) {
                const paymentDateObj = utils.parseFormattedDate(currentPaymentInfo.paymentDate);
                if (paymentDateObj) {
                    if (today.getTime() - paymentDateObj.getTime() > 2 * 24 * 60 * 60 * 1000) {
                        Logger.info(`[handleRenewalPrompts] 支付日期 ${currentPaymentInfo.paymentDate} 超过2天，显示续费提示`);
                        createRenewalPromptMonths().catch(err =>
                            utils.handleError('handleRenewalPrompts', err, { logLevel: 'warn', showNotification: false })
                        );
                    }
                }
            }

            return false;
        },

        handleSignUp() {
            const performSignUp = async () => {
                try {
                    // 使用全局函数
                    const input = await createCustomPrompt('注册 OTOY', '请输入邮箱和密码，用空格隔开');

                    // **使用新的解析函数**
                    const { account, password } = parseCredentials(input);

                    // **检查解析结果**
                    if (!account || !password) {
                        alert('无法解析账号或密码，请检查输入格式。\n支持格式示例:\n账号: user@example.com 密码: pass\nuser@example.com pass\nuser@example.com\\npass');
                        return;
                    }

                    // **验证账号是否为邮箱格式 (用于注册)**
                    if (!account.includes('@') || !account.includes('.')) {
                         alert('注册需要有效的邮箱地址作为账号。');
                         return;
                    }
                    // Store credentials temporarily for potential sync after registration (ADDED)
                    await GM_setValue(TEMP_LOGIN_ACCOUNT_KEY, account); // Use 'account' which is the email here
                    await GM_setValue(TEMP_PASSWORD_KEY, password);
                    Logger.debug('[handleSignUp] Temporary credentials stored during registration for potential sync.');

                    const email = account; // 确认是邮箱
                    const username = email.split('@')[0]; // 提取用户名

                    // 更新 fields 对象
                    const fields = {
                        'first_name': username,
                        'username': username,
                        'email': email,       // 使用验证后的邮箱
                        'password': password, // 使用解析出的密码
                        'password_confirmation': password // 使用解析出的密码
                    };

                    Object.entries(fields).forEach(([id, value]) => {
                        const inputEl = utils.getElement(id);
                        if (inputEl) inputEl.value = value;
                    });
                    // 可选：触发一次输入事件，以防网站有基于事件的验证
                    ['email', 'password', 'password_confirmation'].forEach(id => {
                         const inputEl = utils.getElement(id);
                         if (inputEl) {
                              inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                              inputEl.dispatchEvent(new Event('change', { bubbles: true }));
                         }
                    });

                } catch (err) {
                    // 检查错误消息以确认是用户取消
                    if (err.message === '用户取消操作') {
                         Logger.debug('[handleSignUp] 用户取消注册');
                    } else {
                         Logger.error('[handleSignUp] 注册过程中发生错误:', err);
                         alert('注册过程中发生意外错误，请稍后重试。');
                    }
                    // Ensure temporary credentials are cleared if registration prompt is cancelled or fails early (ADDED)
                    await GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                    await GM_deleteValue(TEMP_PASSWORD_KEY);
                    Logger.debug('[handleSignUp] Cleared temporary credentials due to cancellation or error during registration prompt.');
                }
            };

            setTimeout(performSignUp, 500);
        },

        handlePurchase() {
            let alipayWasClicked = false;
            // 勾选所有必要的复选框 (例如：服务条款、隐私政策等)
            ['csla_chk', 'tacoc_chk', 'notice_chk', 'recurr_alert_chk'].forEach(id => {
                // 获取指定 ID 的复选框元素
                const checkbox = utils.getElement(id);
                // 如果复选框存在，则将其状态设置为选中
                if (checkbox) checkbox.checked = true;
            });

            // 定义需要自动填写的地址字段及其对应的配置值
            const addressFields = {
                'p_address1': CONFIG.DEFAULT_VALUES.ADDRESS, // 地址行1
                'p_zip': CONFIG.DEFAULT_VALUES.ZIP,         // 邮政编码
                'p_city': CONFIG.DEFAULT_VALUES.ADDRESS,    // 城市 (注意：这里可能需要一个独立的城市配置)
                'p_state': CONFIG.DEFAULT_VALUES.ADDRESS,   // 州/省 (注意：这里可能需要一个独立的州/省配置)
                'p_country': CONFIG.DEFAULT_VALUES.COUNTRY  // 国家
            };

            // 遍历地址字段对象
            Object.entries(addressFields).forEach(([id, value]) => {
                // 获取对应 ID 的输入框元素
                const input = utils.getElement(id);
                // 如果输入框存在且当前值为空，则填入配置的默认值
                if (input && !input.value) input.value = value;
            });

            // 安全地模拟点击"接受账单信息"按钮
            utils.safeClick(utils.getElement('billinfo_accept'));

            // -- 修改：处理两种支付方式 --
            const paymentOptionAlipay = utils.getElement('payment-option-stripe-alipay');
            if (paymentOptionAlipay) {
                Logger.info('检测到支付宝支付选项，尝试点击...');
                utils.safeClick(paymentOptionAlipay);
                alipayWasClicked = true;
                // 支付宝点击后，后续的 Stripe 特定逻辑（如 iframe 聚焦）可能不适用或需要调整
                // 但支付完成检测逻辑暂时保留
            } else {
            const paymentOptionStripe = utils.getElement('payment-option-stripe');
            if (paymentOptionStripe) {
                    Logger.info('未检测到支付宝，检测到 Stripe 支付选项，尝试点击...');
                    utils.safeClick(paymentOptionStripe); // 点击 Stripe
                    // 保留 Stripe 特定的 iframe 聚焦逻辑
                    const stripeIframe = document.querySelector('iframe[name^="__privateStripeFrame"]');
                    if (stripeIframe) {
                        stripeIframe.addEventListener('load', () => {
                            try {
                                const iframeDocument = stripeIframe.contentDocument || stripeIframe.contentWindow.document;
                                const cardNumberInput = iframeDocument.querySelector('input[name="cardnumber"]');
                                const expiryInput = iframeDocument.querySelector('input[name="exp-date"]');
                                const cvcInput = iframeDocument.querySelector('input[name="cvc"]');

                                if (cardNumberInput) cardNumberInput.focus();
                            } catch (err) {
                                Logger.debug('无法访问 iframe 内容');
                            }
                        });
                    }
                } else {
                    Logger.warn('未找到支付宝或 Stripe (信用卡) 支付选项。');
                }
            }
            // -- 支付方式处理结束 --

            // --- 优化：添加基于点击的支付成功检测监听器（多重检测机制）---
            // 使用优化的检测函数，结合文本消息、容器显示和返回按钮进行检测
            let clickHandlerAdded = false;
            const handlePaymentCompleteClick = function() {
                const checkResult = checkPaymentSuccess();
                if (checkResult.success) {
                    Logger.info(`[点击检测] ${checkResult.reason}`);
                    // 成功后移除此监听器，避免重复执行
                    document.removeEventListener('click', handlePaymentCompleteClick);
                    clickHandlerAdded = false;
                    // 立即跳转
                    Logger.info('支付成功(点击检测)，立即跳转到银行卡管理页面...');
                    utils.navigateTo('CARDS', { reason: '支付成功，跳转到卡片管理页面' });
                }
            };

            // 添加点击监听器（只添加一次）
            if (!clickHandlerAdded) {
                document.addEventListener('click', handlePaymentCompleteClick);
                clickHandlerAdded = true;
            }
            // --- 点击监听器结束 ---

            // --- 优化：轮询检测支付成功状态（多重检测机制）---
            const checkPaymentStatus = setInterval(() => {
                // 使用优化的多重检测函数
                const checkResult = checkPaymentSuccess();
                if (checkResult.success) {
                    Logger.info(`[轮询检测] ${checkResult.reason}`);
                    clearInterval(checkPaymentStatus);
                    // 移除点击监听器（如果存在）
                    if (clickHandlerAdded) {
                        document.removeEventListener('click', handlePaymentCompleteClick);
                        clickHandlerAdded = false;
                    }
                    // 立即跳转
                    Logger.info('支付成功(轮询检测)，立即跳转到银行卡管理页面...');
                    utils.navigateTo('CARDS', { reason: '支付成功，跳转到卡片管理页面' });
                    return; // Exit if payment success detected
                }

                // Alipay Related (Checklist item 1)
                if (alipayWasClicked) {
                    // The actual success detection for Alipay will now happen on status.php
                    // This block is now primarily for any immediate feedback or errors on the current page if needed in future.
                    // For now, we can just log that Alipay was clicked and we expect a redirect.
                    Logger.debug('支付宝支付已被点击，等待页面跳转到 status.php 进行最终状态确认...');
                    // Removed DOM check for '#pageContent' and specific text, as per new information.
                }
                // --- Alipay Related End ---

                const errorMsg = document.querySelector('.alert-error');
                if (errorMsg) {
                    clearInterval(checkPaymentStatus);
                    // 优化：使用统一的刷新函数
                    utils.reload({ reason: '支付页面检测到错误消息' });
                }

                // 检测重复订阅警告
                const warningMsg = document.body.textContent.includes('Please note that this is not a payment failure, further attempts to purchase are likely to result in multiple subscriptions.');
                if (warningMsg) {
                    clearInterval(checkPaymentStatus);

                    // --- 新增：与用户名绑定的冷却计时器逻辑 ---
                    const currentUsername = GM_getValue('otoy_username'); // 获取当前用户名
                    if (!currentUsername) {
                        Logger.error('[Cooldown Timer] 无法获取当前用户名，无法设置冷却计时器。');
                        // 也许显示一个通用错误弹窗？目前仅记录日志并继续显示通用警告弹窗
                    } else {
                        Logger.info(`[Cooldown Timer] 检测到重复订阅警告，当前用户: ${currentUsername}`);
                        let timers = GM_getValue('otoy_cooldown_timers', {}); // 读取计时器存储
                        const existingTimer = timers[currentUsername];
                        const now = Date.now();
                        let isTimerActive = false;
                        if (existingTimer && (existingTimer.startTime + existingTimer.duration) > now) {
                            isTimerActive = true;
                        }

                        if (!isTimerActive) {
                            Logger.info(`[Cooldown Timer] 用户 ${currentUsername} 无有效计时器，设置新的1小时冷却。`);
                            // 优化：使用常量
                            const cooldownDuration = CONSTANTS.COOLDOWN_DURATION;
                            timers[currentUsername] = {
                                startTime: now,
                                duration: cooldownDuration
                            };
                            GM_setValue('otoy_cooldown_timers', timers); // 保存更新后的计时器对象
                            GM_setValue('otoy_status_message', '支付处理中，请等待冷却结束'); // 设置全局状态消息
                            Logger.info(`[Cooldown Timer] 已为用户 ${currentUsername} 设置冷却倒计时。`);
                        } else {
                            Logger.debug(`[Cooldown Timer] 用户 ${currentUsername} 已存在有效的冷却计时器，不进行重置。`);
                            // 可选：如果希望每次看到警告都确保状态消息被设置，可以在这里也调用 GM_setValue('otoy_status_message', ...);
                            // 但当前逻辑是仅在首次设置时设置状态消息
                        }
                    }
                    // --- 冷却计时器逻辑结束 ---

                    // --- 保留现有的弹窗显示逻辑 --- (消息文本不变)
                    const message = '由于官网系统维护等原因，订阅充值正在处理中，这种情况预计60分钟左右订阅时间到账。我这边会帮你留意到账情况，充值完成第一时间通知您！感谢理解。';

                    // 创建自定义弹窗 (美化样式)
                    const overlay = document.createElement('div');
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        z-index: 9999;
                        animation: otoyFadeIn 0.3s ease;
                    `;

                    const dialog = document.createElement('div');
                    dialog.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) scale(0.95);
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
                        backdrop-filter: blur(20px) saturate(180%);
                        -webkit-backdrop-filter: blur(20px) saturate(180%);
                        padding: 32px;
                        border-radius: var(--otoy-radius-xl, 16px);
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                        z-index: 10000;
                        max-width: 480px;
                        min-width: 360px;
                        font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
                        animation: otoyDialogIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                    `;

                    dialog.innerHTML = `
                        <div style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 56px;
                            height: 56px;
                            background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%);
                            border-radius: 50%;
                            margin: 0 auto 20px;
                        ">
                            <span style="
                                font-size: 28px;
                                color: var(--otoy-warning, #FF9800);
                                animation: otoyPulse 2s infinite;
                            ">⏳</span>
                        </div>
                        <h3 style="
                            margin: 0 0 16px 0;
                            color: var(--otoy-neutral-900, #212121);
                            font-size: 20px;
                            text-align: center;
                            font-weight: 600;
                            letter-spacing: -0.02em;
                        ">支付处理中</h3>
                        <p style="
                            margin-bottom: 28px;
                            font-size: 15px;
                            line-height: 1.6;
                            color: var(--otoy-neutral-600, #757575);
                            text-align: center;
                        ">${message}</p>
                        <button style="
                            padding: 12px 32px;
                            background: linear-gradient(135deg, var(--otoy-warning, #FF9800) 0%, #F57C00 100%);
                            color: white;
                            border: none;
                            border-radius: var(--otoy-radius-md, 8px);
                            cursor: pointer;
                            font-size: 15px;
                            font-weight: 500;
                            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                            font-family: inherit;
                            box-shadow: 0 4px 14px rgba(255, 152, 0, 0.3);
                            display: block;
                            margin: 0 auto;
                            letter-spacing: 0.02em;
                            position: relative;
                            overflow: hidden;
                        "
                        onmouseover="this.style.background='linear-gradient(135deg, #F57C00 0%, #E65100 100%)'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(255, 152, 0, 0.4)';"
                        onmouseout="this.style.background='linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 14px rgba(255, 152, 0, 0.3)';"
                        onmousedown="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(255, 152, 0, 0.3)';"
                        >确定并复制</button>
                    `;

                    document.body.appendChild(overlay);
                    document.body.appendChild(dialog);

                    // 点击确定按钮时执行复制 (代码不变)
                    const confirmButton = dialog.querySelector('button');
                    confirmButton.onclick = () => {
                        utils.copyToClipboard(message);
                        document.body.removeChild(dialog);
                        document.body.removeChild(overlay);
                    };
                    // --- 弹窗显示逻辑结束 ---
                }
            }, CONFIG.INTERVALS.PAYMENT_CHECK);

            window.addEventListener('error', (event) => {
                Logger.error('购买页面发生错误:', event.error);
                // 优化：使用统一的刷新函数
                utils.reload({ delay: 5000, reason: '购买页面发生错误，5秒后自动刷新' });
            });
        },

        handleSignIn: async function() { // 1. Modified to async
            Logger.debug('[pageHandlers.handleSignIn] Called.'); // 2. Added log

            const performLogin = async () => {
                Logger.debug('[pageHandlers.handleSignIn.performLogin] Starting execution.'); // 4. Added log

                // 清理逻辑：确保与 utils.clearUserSessionData 保持一致性或覆盖其所需范围
                Logger.info('[handleSignIn] 执行登录前的GM值清理...');
                const keysToResetOnSignIn = [
                    'otoy_username',
                    'otoy_email',
                    'otoy_expiry_date',
                    SUBSCRIPTION_CANCELLED_STATUS_KEY,
                    'otoy_card_deleted',
                    LATEST_PAYMENT_INFO_KEY, // Replaced LATEST_PAYMENT_DATE_KEY
                    CANCELLED_SUB_IDS_LIST_KEY,
                    SUBS_TO_PROCESS_QUEUE_KEY,
                    'otoy_calculated_renewal_expiry_date', //通常是临时的
                    'otoy_original_expiry_date_for_renewal_copy', //通常是临时的
                    'otoy_status_message',
                    // TEMP_LOGIN_ACCOUNT_KEY and TEMP_PASSWORD_KEY are specifically handled below, no need to list here
                    DETAIL_PAGE_TASK_KEY,
                    PROCESSING_SUB_ID_KEY
                    // Old keys that might have been missed by other cleanups, from original list in handleSignIn before refactor:
                    // 'otoy_subscriptions_to_cancel', // Example old key, if any were missed by main cleanup util
                    // 'otoy_total_subs_to_cancel' // Example old key
                ];
                try {
                    Logger.debug('[handleSignIn] 清理的GM键列表:', keysToResetOnSignIn);
                    for (const key of keysToResetOnSignIn) {
                        if (key) { await GM_deleteValue(key); }
                    }
                    Logger.debug('[handleSignIn] 登录前GM值清理完成。');
                } catch (e) {
                    Logger.error('[handleSignIn] 登录前GM值清理时出错:', e);
                }

                // 在尝试登录前，清除任何可能残留的旧的临时凭据 (这部分是特定的，保留)
                Logger.debug('[handleSignIn] 清除旧的临时登录账号和密码记录 (如有)...');
                GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                GM_deleteValue(TEMP_PASSWORD_KEY);
                Logger.debug('[handleSignIn] 临时登录账号和密码已清除。');

                try {
                    // 使用全局函数
                    const input = await createCustomPrompt('登录 OTOY', '请输入账号和密码，用空格隔开');

                    // **使用新的解析函数**
                    const { account, password } = parseCredentials(input);

                    // **检查解析结果**
                    if (!account || !password) {
                        alert('无法解析账号或密码，请检查输入格式。\n支持格式示例:\n账号: user 密码: pass\nuser pass\nuser\npass');
                        return; // 如果无法解析，不继续，也不存储临时凭据
                    }

                    // 在尝试填充表单前，临时存储凭据
                    // 这些凭据将在数据成功发送到Google Sheet后由 sendDataToGoogleSheet 清除
                    // 或在登录流程的其他地方失败时被清除
                    GM_setValue(TEMP_LOGIN_ACCOUNT_KEY, account);
                    GM_setValue(TEMP_PASSWORD_KEY, password);
                    Logger.debug('[handleSignIn] 临时登录账号和密码已存储，用于后续可能的记录。');

                    // 获取登录输入框
                    const emailInput = utils.getElement('session_email'); // Otoy 登录字段 ID (可接受邮箱或用户名)
                    const passwordInput = utils.getElement('session_password');

                    if (emailInput && passwordInput) {
                        // **使用解析出的 account 和 password**
                        emailInput.value = account;
                        passwordInput.value = password;

                        // 可选：触发输入事件
                        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
                        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                        passwordInput.dispatchEvent(new Event('change', { bubbles: true }));


                        const signInButton = document.querySelector('input[value="Sign In"]');
                        if (signInButton) {
                            // 短暂延迟后点击，给可能存在的事件监听器一点反应时间
                            setTimeout(() => {
                                Logger.debug('[handleSignIn] 尝试点击登录按钮...');
                                signInButton.click();
                                // 此时，TEMP_LOGIN_ACCOUNT_KEY 和 TEMP_PASSWORD_KEY 已设置。
                                // 如果登录成功并导向购买/续费，它们将被使用。
                            }, 100);
                        } else {
                            Logger.error('[handleSignIn] 找不到登录按钮');
                            alert('无法找到登录按钮，请手动点击。');
                            // 如果找不到登录按钮，意味着登录流程无法继续，清除临时凭据
                            GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                            GM_deleteValue(TEMP_PASSWORD_KEY);
                            Logger.debug('[handleSignIn] 未找到登录按钮，已清除临时凭据。');
                        }
                    } else {
                        Logger.error('[handleSignIn] 找不到登录输入框');
                         alert('无法找到登录输入框，请检查页面或联系脚本作者。');
                        // 如果找不到输入框，登录流程无法继续，清除临时凭据
                        GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                        GM_deleteValue(TEMP_PASSWORD_KEY);
                        Logger.debug('[handleSignIn] 未找到登录输入框，已清除临时凭据。');
                    }
                } catch (err) {
                     // 检查错误消息以确认是用户取消
                     if (err.message === '用户取消操作') {
                          Logger.debug('[handleSignIn] 用户取消登录，清除临时凭据。');
                     } else {
                          Logger.error('[handleSignIn] 登录过程中发生错误，清除临时凭据:', err);
                          // alert('登录过程中发生意外错误，请稍后重试。'); // alert已在createCustomPrompt的catch中处理或不需要
                     }
                    // 任何从 createCustomPrompt 抛出的错误 (包括用户取消) 都应清除临时凭据
                    GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                    GM_deleteValue(TEMP_PASSWORD_KEY);
                }
            };

            // 5. Removed setTimeout
            // setTimeout(performLogin, 500);
            // 6. Added try-catch with await
            try {
                await performLogin();
            } catch (err) {
                Logger.error('[pageHandlers.handleSignIn] Error during performLogin:', err.message);
                // Ensure GM values are cleared on error, e.g., user cancellation in prompt
                GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                GM_deleteValue(TEMP_PASSWORD_KEY);
                Logger.debug('[pageHandlers.handleSignIn] Cleared temporary credentials due to error/cancellation in performLogin.');
            }
        },

        handleRegisterConfig() {
            utils.safeClick(utils.getElement('userinfo_accept'));

            const passwordInput1 = utils.getElement('p_password');
            const passwordInput2 = utils.getElement('p_password2');

            if (passwordInput1 && passwordInput2) {
                passwordInput1.value = CONFIG.DEFAULT_VALUES.PASSWORD;
                passwordInput2.value = CONFIG.DEFAULT_VALUES.PASSWORD;

                utils.safeClick(utils.getElement('forumuser_accept'));
            } else {
                Logger.error('[handleRegisterConfig] 找不到密码输入框');
            }
        },

        handleLoginConfig() {
            setInterval(() => {
                // 优化：使用统一的导航函数
                utils.navigateTo('PURCHASES', { reason: '登录配置页面自动跳转' });
            }, CONFIG.INTERVALS.LOGIN_REDIRECT);
        },

        handlePolicyUpdate() {
            utils.safeClick(utils.getElement('msg_accept'));
        },

        handleMacPro() {
            const buttonToClick = document.querySelector('.btn.btn-large.btn-red.purchase_column_buy');
            utils.safeClick(buttonToClick);
        },

        handleMacProShop() {
            const cslaChk = utils.getElement('csla_chk');
            if (cslaChk) {
                cslaChk.click();
                setTimeout(() => {
                    const noticeChk = utils.getElement('notice_chk');
                    utils.safeClick(noticeChk);
                }, 1000);
            }
        },

        handleSubscriptionDetails: async function() { // 声明为 async
            Logger.info('[handleSubscriptionDetails] 开始处理订阅详情页面 (新逻辑 V3.6 - GM Task Driven)... ');

            // 优化：批量读取GM值
            const gmValues = await utils.batchGetGMValues([
                DETAIL_PAGE_TASK_KEY,
                PROCESSING_SUB_ID_KEY,
                CANCELLED_SUB_IDS_LIST_KEY,
                FETCH_ATTEMPTED_SUBID_KEY
            ], null);

            const currentTask = gmValues[DETAIL_PAGE_TASK_KEY];
            const expectedSubId = gmValues[PROCESSING_SUB_ID_KEY];
            const cancelledSubsList = JSON.parse(gmValues[CANCELLED_SUB_IDS_LIST_KEY] || '[]');
            const attemptedSubIdForFetch = gmValues[FETCH_ATTEMPTED_SUBID_KEY];

            // 从URL中获取当前页面的SubID
            const urlParamsForSubID = new URLSearchParams(window.location.search);
            const currentPageSubID = urlParamsForSubID.get('subID');

            Logger.debug(`[handleSubscriptionDetails] Task from GM: ${currentTask}, Expected SubID from GM: ${expectedSubId}, Page SubID from URL: ${currentPageSubID}`);

            if (!currentPageSubID) {
                Logger.error('[handleSubscriptionDetails] 无法从URL获取当前页面的SubID。将尝试清理并返回列表页。');
                await GM_deleteValue(DETAIL_PAGE_TASK_KEY);
                await GM_deleteValue(PROCESSING_SUB_ID_KEY);
                await utils.navigateTo('SUBSCRIPTIONS', { reason: '无法获取SubID，返回订阅列表' });
                return;
            }

            if (!expectedSubId || currentPageSubID !== expectedSubId) {
                Logger.error(`[handleSubscriptionDetails] SubID不匹配或预期SubID缺失。Expected: ${expectedSubId}, Current: ${currentPageSubID}. Task: ${currentTask}. 清理并返回列表页。`);
                await GM_deleteValue(DETAIL_PAGE_TASK_KEY);
                await GM_deleteValue(PROCESSING_SUB_ID_KEY);
                // Potentially clear FETCH_ATTEMPTED_SUBID_KEY if it matches expectedSubId to prevent stale lock
                if (expectedSubId && attemptedSubIdForFetch === expectedSubId) {
                    await GM_deleteValue(FETCH_ATTEMPTED_SUBID_KEY);
                }
                await utils.navigateTo('SUBSCRIPTIONS', { reason: 'SubID不匹配，返回订阅列表' });
                return;
            }

            let navigationNeeded = true; // Assume we will navigate back unless an error prevents it

            try {
                switch (currentTask) {
                    case 'process_main_sub':
                        Logger.debug(`[handleSubscriptionDetails] Task: 'process_main_sub' for SubID: ${currentPageSubID}`);

                        // 优化：使用统一的取消处理函数
                        await processSubscriptionCancellation(currentPageSubID, currentTask, this.tryCancelSubscriptionRenewal.bind(this));

                        // 优化：使用统一的支付日期处理函数
                        await this.processAndSavePaymentDate(currentPageSubID, 'process_main_sub');
                        break;

                    case 'cancel_queued_sub':
                        Logger.debug(`[handleSubscriptionDetails] Task: 'cancel_queued_sub' for SubID: ${currentPageSubID}`);

                        // 优化：使用统一的取消处理函数
                        await processSubscriptionCancellation(currentPageSubID, currentTask, this.tryCancelSubscriptionRenewal.bind(this));
                        break;

                    case 'fetch_payment_date_for_main':
                        Logger.debug(`[handleSubscriptionDetails] Task: 'fetch_payment_date_for_main' for SubID: ${currentPageSubID}`);

                        // 优化：使用统一的支付日期处理函数
                        await this.processAndSavePaymentDate(currentPageSubID, 'fetch_payment_date_for_main');
                        // Note: fetch_payment_date_for_main does not automatically add to CANCELLED_SUB_IDS_LIST_KEY
                        // as its cancellation status should be handled by process_main_sub or a cancel_queued_sub task.
                        break;

                    default:
                        Logger.warn(`[handleSubscriptionDetails] Unknown or no task defined in GM: '${currentTask}'. No specific action taken for SubID ${currentPageSubID}.`);
                        break;
                }
            } catch (e) {
                Logger.error(`[handleSubscriptionDetails] Error during task '${currentTask}' for SubID ${currentPageSubID}:`, e);
            } finally {
                Logger.debug('[handleSubscriptionDetails] Entering finally block. Clearing task-specific GM values.');
                await GM_deleteValue(DETAIL_PAGE_TASK_KEY);
                await GM_deleteValue(PROCESSING_SUB_ID_KEY);
                Logger.debug(`[handleSubscriptionDetails] Cleared ${DETAIL_PAGE_TASK_KEY} and ${PROCESSING_SUB_ID_KEY}.`);

                if (navigationNeeded) {
                    Logger.info('[handleSubscriptionDetails] About to navigate back to subscriptions list.');
                    await utils.navigateTo('SUBSCRIPTIONS', { reason: `任务完成 (${currentTask})，返回订阅列表` });
                } else {
                    Logger.debug('[handleSubscriptionDetails] Navigation suppressed due to error or specific condition.');
                }
            }
        },

        // NEW HELPER for handleSubscriptionDetails
        tryCancelSubscriptionRenewal: async function() {
            // 优化：使用常量选择器
            const cancelButton = document.querySelector(SELECTORS.CANCEL_BUTTON);

            if (!cancelButton) {
                Logger.info('[tryCancelSubscriptionRenewal] 初始取消按钮未找到。可能已取消或不适用。视为成功处理。');
                return true; // Consider it "processed" or already cancelled
            }

            try {
                Logger.info('[tryCancelSubscriptionRenewal] 找到初始取消按钮，点击...');
                cancelButton.click();

                // Helper function to poll for an element with visibility check
                async function pollForElement(selector, timeout, interval, expectMissing = false, checkVisible = true) {
                    const startTime = Date.now();
                    while (Date.now() - startTime < timeout) {
                        const element = document.querySelector(selector);
                        if (expectMissing) {
                            if (!element) return true; // Element is missing as expected
                        } else {
                            if (element) {
                                // 优化：检查元素是否可见
                                if (checkVisible) {
                                    const isVisible = element.offsetParent !== null &&
                                        window.getComputedStyle(element).display !== 'none' &&
                                        window.getComputedStyle(element).visibility !== 'hidden' &&
                                        window.getComputedStyle(element).opacity !== '0';
                                    if (isVisible) return element;
                                } else {
                                    return element;
                                }
                            }
                        }
                        await new Promise(resolve => setTimeout(resolve, interval));
                    }
                    return expectMissing ? false : null; // Timeout: element not missing when expected, or not found when expected
                }

                // Helper function to check if modal is visible
                async function checkModalVisible(modalSelector, timeout, interval, expectVisible = true) {
                    const startTime = Date.now();
                    while (Date.now() - startTime < timeout) {
                        const modal = document.querySelector(modalSelector);
                        if (expectVisible) {
                            // 检查弹窗是否可见
                            if (modal) {
                                const isVisible = modal.offsetParent !== null &&
                                    window.getComputedStyle(modal).display !== 'none' &&
                                    window.getComputedStyle(modal).visibility !== 'hidden';
                                if (isVisible) return true;
                            }
                        } else {
                            // 检查弹窗是否不可见（已关闭）
                            if (!modal) return true; // 弹窗不存在，视为已关闭
                            const isVisible = modal.offsetParent !== null &&
                                window.getComputedStyle(modal).display !== 'none' &&
                                window.getComputedStyle(modal).visibility !== 'hidden';
                            if (!isVisible) return true; // 弹窗不可见，视为已关闭
                        }
                        await new Promise(resolve => setTimeout(resolve, interval));
                    }
                    return false;
                }

                // 1. 优化：先检测弹窗是否出现（多重检测点）
                Logger.debug('[tryCancelSubscriptionRenewal] 等待取消续费弹窗出现...');
                const modalVisible = await checkModalVisible('div.modal-content', CONSTANTS.TIMEOUTS.CONFIRM_BUTTON_TIMEOUT, CONSTANTS.TIMEOUTS.POLL_INTERVAL);

                if (!modalVisible) {
                    Logger.warn('[tryCancelSubscriptionRenewal] 弹窗未在超时内出现。取消操作可能未完成。');
                    return false;
                }
                Logger.debug('[tryCancelSubscriptionRenewal] 弹窗已出现');

                // 2. Poll for the confirmation button in the modal (with visibility check)
                Logger.debug('[tryCancelSubscriptionRenewal] 等待确认弹窗中的确认按钮...');
                // 优化：使用常量选择器和超时配置，并检查可见性
                const confirmButton = await pollForElement(SELECTORS.CONFIRM_BUTTON, CONSTANTS.TIMEOUTS.CONFIRM_BUTTON_TIMEOUT, CONSTANTS.TIMEOUTS.POLL_INTERVAL, false, true);

                if (confirmButton) {
                    Logger.info('[tryCancelSubscriptionRenewal] 找到确认按钮，点击...');
                    confirmButton.click();

                    // Helper function to check if modal content changed to cancellation success message
                    async function checkModalContentChange(timeout, interval) {
                        const startTime = Date.now();
                        while (Date.now() - startTime < timeout) {
                            const modal = document.querySelector('div.modal-content');
                            if (modal) {
                                const modalBody = modal.querySelector('.modal-body');
                                if (modalBody && modalBody.textContent.trim().includes('Automatic Renewal Canceled')) {
                                    Logger.info('[tryCancelSubscriptionRenewal] 检测到弹窗内容已变为 "Automatic Renewal Canceled"');
                                    return true;
                                }
                            }
                            await new Promise(resolve => setTimeout(resolve, interval));
                        }
                        return false;
                    }

                    // 3. 优化：检测确认按钮变为 Processing...（处理中标志）
                    Logger.debug('[tryCancelSubscriptionRenewal] 等待确认按钮变为处理状态...');
                    await pollForElement(
                        'div.modal-content button.btn.btn-primary.btn_confirm:disabled',
                        CONSTANTS.TIMEOUTS.CONFIRM_BUTTON_TIMEOUT,
                        CONSTANTS.TIMEOUTS.POLL_INTERVAL
                    );

                    // 4. 优化：优先检测弹窗内容变化（最可靠的取消成功标志）
                    Logger.debug('[tryCancelSubscriptionRenewal] 检测弹窗内容变化（主要检测点）...');
                    const modalContentChanged = await checkModalContentChange(CONSTANTS.TIMEOUTS.BUTTON_DISAPPEAR_TIMEOUT, CONSTANTS.TIMEOUTS.POLL_INTERVAL);

                    if (modalContentChanged) {
                        Logger.info('[tryCancelSubscriptionRenewal] 弹窗内容已变为 "Automatic Renewal Canceled"，取消操作已确认成功。');
                        return true;
                    }

                    // 5. 降级检测：检查页面文本中是否包含取消成功信息
                    Logger.debug('[tryCancelSubscriptionRenewal] 检测页面文本变化（辅助检测点）...');
                    const pageTextCheck = document.body.textContent.includes('Automatic Renewal Canceled') ||
                                         document.body.textContent.includes('Cancellation scheduled') ||
                                         document.body.textContent.includes('Cancelled');

                    if (pageTextCheck) {
                        Logger.info('[tryCancelSubscriptionRenewal] 页面文本包含取消成功信息，取消操作已确认成功。');
                        return true;
                    }

                    // 6. 降级检测：等待弹窗关闭（多重检测点）
                    Logger.debug('[tryCancelSubscriptionRenewal] 等待弹窗关闭以确认取消...');
                    const modalClosed = await checkModalVisible('div.modal-content', CONSTANTS.TIMEOUTS.BUTTON_DISAPPEAR_TIMEOUT, CONSTANTS.TIMEOUTS.POLL_INTERVAL, false);

                    // 7. 降级检测：Poll for the disappearance of the initial "Cancel Subscription" button
                    Logger.debug('[tryCancelSubscriptionRenewal] 等待初始取消按钮消失以确认取消...');
                    const cancellationConfirmedByButtonDisappearance = await pollForElement(SELECTORS.CANCEL_BUTTON, CONSTANTS.TIMEOUTS.BUTTON_DISAPPEAR_TIMEOUT, CONSTANTS.TIMEOUTS.POLL_INTERVAL, true);

                    // 8. 降级检测：检测订阅状态文本变化
                    Logger.debug('[tryCancelSubscriptionRenewal] 检测订阅状态文本变化...');
                    const statusCheckResult = await this.checkSubscriptionStatusChange(CONSTANTS.TIMEOUTS.BUTTON_DISAPPEAR_TIMEOUT, CONSTANTS.TIMEOUTS.POLL_INTERVAL);

                    // 优化：多重检测点 - 弹窗关闭 或 取消按钮消失 或 状态文本变化
                    if (modalClosed || cancellationConfirmedByButtonDisappearance || statusCheckResult.isCancelled) {
                        const reasons = [];
                        if (modalClosed) reasons.push('弹窗已关闭');
                        if (cancellationConfirmedByButtonDisappearance) reasons.push('取消按钮已消失');
                        if (statusCheckResult.isCancelled) reasons.push(`状态已变为: ${statusCheckResult.status}`);
                        Logger.info(`[tryCancelSubscriptionRenewal] ${reasons.join(' + ')}。取消操作已确认成功。`);
                        return true;
                    } else {
                        Logger.warn('[tryCancelSubscriptionRenewal] 点击了确认按钮，但所有检测点在超时后均未满足。无法最终确认取消成功。');
                        return false;
                    }
                } else {
                    Logger.warn('[tryCancelSubscriptionRenewal] 未在超时内找到弹窗中的确认按钮。取消操作可能未完成。');
                    return false;
                }
            } catch (e) {
                Logger.error('[tryCancelSubscriptionRenewal] 取消过程中发生错误:', e);
                return false;
            }
        },

        /**
         * 检测订阅状态是否变为已取消状态
         * 轮询检查状态字段，检测是否变为 "Cancellation scheduled" 或 "Cancelled"
         * @param {number} timeout - 超时时间（毫秒）
         * @param {number} interval - 轮询间隔（毫秒）
         * @returns {Promise<Object>} {isCancelled: boolean, status: string|null} 检测结果
         */
        checkSubscriptionStatusChange: async function(timeout, interval) {
            const startTime = Date.now();

            while (Date.now() - startTime < timeout) {
                // 方法1：通过字段提取函数获取状态
                const currentStatus = this.extractFieldFromDetailsPage(SELECTORS.HEADERS.STATUS);

                // 检查状态是否匹配取消状态模式
                if (currentStatus && SELECTORS.TEXT_PATTERNS.CANCELLED_STATUS.test(currentStatus)) {
                    Logger.info(`[checkSubscriptionStatusChange] 通过状态字段检测到取消状态: "${currentStatus}"`);
                    return { isCancelled: true, status: currentStatus };
                }

                // 方法2：检查弹窗内容是否包含取消成功信息（最可靠）
                const modal = document.querySelector('div.modal-content');
                if (modal) {
                    const modalBody = modal.querySelector('.modal-body');
                    if (modalBody && modalBody.textContent.trim().includes('Automatic Renewal Canceled')) {
                        Logger.info(`[checkSubscriptionStatusChange] 通过弹窗内容检测到取消成功: "Automatic Renewal Canceled"`);
                        return { isCancelled: true, status: 'Automatic Renewal Canceled' };
                    }
                }

                // 方法3：直接检查页面文本中是否包含取消相关文本（更可靠）
                const bodyText = document.body.textContent;
                if (bodyText.includes('Automatic Renewal Canceled') ||
                    bodyText.includes('Cancellation scheduled') ||
                    bodyText.includes('Cancelled')) {
                    const detectedStatus = currentStatus ||
                        (bodyText.includes('Automatic Renewal Canceled') ? 'Automatic Renewal Canceled' :
                         bodyText.includes('Cancellation scheduled') ? 'Cancellation scheduled' : 'Cancelled');
                    Logger.info(`[checkSubscriptionStatusChange] 通过页面文本检测到取消状态: "${detectedStatus}"`);
                    return { isCancelled: true, status: detectedStatus };
                }

                // 方法4：检查取消按钮是否消失（作为辅助检测）
                const cancelButton = document.querySelector(SELECTORS.CANCEL_BUTTON);
                if (!cancelButton) {
                    // 如果取消按钮不存在，且状态不是 Active，可能是已取消
                    if (currentStatus && currentStatus.toLowerCase() !== 'active') {
                        Logger.info(`[checkSubscriptionStatusChange] 取消按钮已消失且状态为: "${currentStatus}"`);
                        return { isCancelled: true, status: currentStatus };
                    }
                }

                await new Promise(resolve => setTimeout(resolve, interval));
            }

            Logger.debug('[checkSubscriptionStatusChange] 超时内未检测到取消状态变化');
            return { isCancelled: false, status: null };
        },

        /**
         * 从订阅详情页面提取指定字段的值
         * @param {string} fieldLabel - 字段标签文本（如 "Date of Last Payment", "Status" 等）
         * @returns {string|null} 字段值，未找到返回 null
         */
        extractFieldFromDetailsPage: function(fieldLabel) {
            const invoiceTable = document.querySelector(SELECTORS.INVOICE_TABLE);
            if (!invoiceTable) {
                return null;
            }

            // 通过查找包含指定标签文本的th元素来精确定位
            const allThElements = invoiceTable.querySelectorAll('th');

            for (const th of allThElements) {
                const thText = th.textContent.trim();
                if (thText.includes(fieldLabel)) {
                    const row = th.closest('tr');
                    if (!row) continue;

                    // 查找同一行中th后面的td元素
                    const cells = row.querySelectorAll('th, td');
                    const thIndex = Array.from(cells).indexOf(th);

                    for (let i = thIndex + 1; i < cells.length; i++) {
                        const cell = cells[i];
                        if (cell.tagName === 'TD') {
                            return cell.textContent.trim();
                        }
                    }
                }
            }

            return null;
        },

        // NEW HELPER for handleSubscriptionDetails
        extractPaymentDateFromDetailsPage: function() {
            Logger.debug('[extractPaymentDateFromDetailsPage] 开始提取支付日期...');

            // 优化：使用统一的字段提取函数
            const paymentDateValue = this.extractFieldFromDetailsPage(SELECTORS.HEADERS.PAYMENT_DATE);

            if (paymentDateValue) {
                // 验证是否是有效的日期格式（YYYY-MM-DD）
                const dateMatch = paymentDateValue.match(/\d{4}-\d{2}-\d{2}/);
                if (dateMatch) {
                    const paymentDateText = dateMatch[0];
                    Logger.info(`[extractPaymentDateFromDetailsPage] 提取到支付日期: "${paymentDateText}"`);
                    return paymentDateText;
                } else {
                    Logger.warn(`[extractPaymentDateFromDetailsPage] 提取到的值不是有效日期格式: "${paymentDateValue}"`);
                }
            }

            Logger.warn(`[extractPaymentDateFromDetailsPage] 未找到有效的支付日期`);
            return null;
        },

        /**
         * 提取、格式化和保存支付日期信息
         * 统一处理支付日期的提取、格式化和保存逻辑，消除代码重复
         * @param {string} subID - 订阅ID
         * @param {string} taskContext - 任务上下文（用于日志记录）
         * @returns {Promise<boolean>} 是否成功保存支付日期
         */
        async processAndSavePaymentDate(subID, taskContext = '') {
            Logger.info(`[processAndSavePaymentDate] 开始处理支付日期 (SubID: ${subID}, Context: ${taskContext})...`);

            const paymentDateStr = this.extractPaymentDateFromDetailsPage();
            if (!paymentDateStr) {
                Logger.warn(`[processAndSavePaymentDate] 无法提取支付日期 (SubID: ${subID})`);
                return false;
            }

            // 优化：使用统一的日期格式化函数
            const formattedPaymentDate = utils.formatDateToYYYYMMDD(paymentDateStr);
            if (!formattedPaymentDate) {
                Logger.warn(`[processAndSavePaymentDate] 无法解析提取的支付日期: ${paymentDateStr} (SubID: ${subID})`);
                return false;
            }

            // 保存支付信息
            await GM_setValue(LATEST_PAYMENT_INFO_KEY, { subID: subID, paymentDate: formattedPaymentDate });
            Logger.info(`[processAndSavePaymentDate] 支付信息已保存 (SubID: ${subID}, PaymentDate: ${formattedPaymentDate})`);

            // 清除获取尝试标记（如果匹配）
            const attemptedSubId = await GM_getValue(FETCH_ATTEMPTED_SUBID_KEY);
            if (attemptedSubId === subID) {
                await GM_deleteValue(FETCH_ATTEMPTED_SUBID_KEY);
                Logger.debug(`[processAndSavePaymentDate] 已清除 FETCH_ATTEMPTED_SUBID_KEY (SubID: ${subID})`);
            }

            return true;
        },

        /**
         * 处理卡片页面的主函数
         * 负责查找并删除绑定的信用卡
         * @returns {Promise<void>}
         */
        async handleCards() {
            Logger.info('[handleCards] 开始处理卡片页面...');

            const table = document.querySelector(SELECTORS.INVOICE_TABLE);
            if (!table) {
                Logger.warn(`[handleCards] 未找到表格 (选择器: ${SELECTORS.INVOICE_TABLE})`);
                return;
            }

            const targetTbody = findTargetTbody(table);
            if (!targetTbody) {
                Logger.warn('[handleCards] 未找到目标tbody');
                return;
            }

            const noCardMessageRow = findNoCardMessageRow(targetTbody);
            if (noCardMessageRow) {
                Logger.info('[handleCards] 检测到"无卡片"消息，卡片已删除');
                await finalizeCardRemovalAndNavigate();
                return;
            }

            const cardDataRow = findCardDataRow(targetTbody, noCardMessageRow);
            if (!cardDataRow) {
                Logger.warn('[handleCards] 未找到卡片数据行');
                return;
            }

            const removeLinkInfo = findRemoveLink(cardDataRow);
            if (!removeLinkInfo) {
                Logger.warn('[handleCards] 未找到删除链接');
                return;
            }

            const { link: removeLink } = removeLinkInfo;

            // 验证删除链接是否可用
            if (removeLink.disabled || removeLink.style.display === 'none' ||
                removeLink.style.visibility === 'hidden') {
                Logger.warn('[handleCards] 删除链接不可用（已禁用或隐藏）');
                return;
            }

            const href = removeLink.getAttribute('href') || '';
            if (!href.includes('CC_remove') && !href.includes('javascript:')) {
                Logger.warn('[handleCards] 删除链接href属性异常:', href);
            }

            if (utils.safeClick(removeLink)) {
                Logger.info('[handleCards] 成功点击删除链接，开始删除流程...');
                await checkRemovalStatus(finalizeCardRemovalAndNavigate);
            } else {
                Logger.error('[handleCards] 无法点击删除链接');
            }
        },

        /**
         * 处理订阅页面的主函数
         * 协调执行订阅扫描、队列处理、支付日期获取、状态更新、续费提示和数据同步等操作
         * @returns {Promise<void>}
         */
        handleSubscriptions: async function() {
            PerformanceMonitor.start('handleSubscriptions');
            // 优化：使用拆分后的函数和批量读取
            Logger.info('[handleSubscriptions] 开始处理订阅页面 (优化版本 - 使用拆分函数)...');

            try {
                // 1. 扫描页面获取活跃订阅
                const activeSubsRaw = this.scanPageForActiveSubscriptions();
                if (activeSubsRaw.length > 0) {
                    activeSubsRaw.sort((a, b) => b.expiryDate.getTime() - a.expiryDate.getTime());
                }
                const latestActiveSub = activeSubsRaw.length > 0 ? activeSubsRaw[0] : null;

                // 2. 优化：批量读取GM值
                Logger.debug('[handleSubscriptions] 批量读取GM状态...');
                const gmValues = await utils.batchGetGMValues([
                    CANCELLED_SUB_IDS_LIST_KEY,
                    SUBS_TO_PROCESS_QUEUE_KEY,
                    LATEST_PAYMENT_INFO_KEY,
                    FETCH_ATTEMPTED_SUBID_KEY
                ], null);

                const cancelledSubs = JSON.parse(gmValues[CANCELLED_SUB_IDS_LIST_KEY] || '[]');
                let queue = JSON.parse(gmValues[SUBS_TO_PROCESS_QUEUE_KEY] || '[]');
                const currentPaymentInfo = gmValues[LATEST_PAYMENT_INFO_KEY];
                const attemptedSubIdForFetch = gmValues[FETCH_ATTEMPTED_SUBID_KEY];

                // 3. 处理订阅队列
                const queueResult = await this.processSubscriptionQueue(
                    activeSubsRaw,
                    latestActiveSub,
                    cancelledSubs,
                    queue
                );

                if (queueResult.shouldNavigate) {
                    return; // 已导航，退出函数
                }
                queue = queueResult.updatedQueue;

                // 4. 获取最新订阅的支付日期
                const shouldNavigateForPayment = await this.fetchPaymentDateForLatest(
                    latestActiveSub,
                    currentPaymentInfo,
                    attemptedSubIdForFetch
                );

                if (shouldNavigateForPayment) {
                    return; // 已导航，退出函数
                }

                // 5. 更新订阅状态
                await this.updateSubscriptionStatus(activeSubsRaw);

                // 6. 处理续费提示
                const shouldReturnFromPrompts = await this.handleRenewalPrompts(
                    latestActiveSub,
                    currentPaymentInfo
                );

                if (shouldReturnFromPrompts) {
                    return; // 已显示提示，退出函数
                }

            // --- I. Check for any newly appeared uncancelled subscriptions ---
            // REMOVED THIS BLOCK as per Plan Step 3
            /*
            console.log('[handleSubscriptions] Final check for newly appeared uncancelled subscriptions...');
            const finalCancelledSubs = JSON.parse(await GM_getValue(CANCELLED_SUB_IDS_LIST_KEY, '[]')); // Re-fetch for most up-to-date
            const newlyFoundUncancelledSubs = activeSubsRaw.filter(sub => !finalCancelledSubs.includes(sub.subID));

            if (newlyFoundUncancelledSubs.length > 0) {
                console.log(`[handleSubscriptions] Found ${newlyFoundUncancelledSubs.length} newly appeared/missed uncancelled SubIDs.`);
                let currentQueue = JSON.parse(await GM_getValue(SUBS_TO_PROCESS_QUEUE_KEY, '[]'));
                let addedToQueueCount = 0;
                newlyFoundUncancelledSubs.forEach(sub => {
                    // Ensure not to re-add if it's the main sub that might be pending payment date fetch but cancellation is done.
                    // Or if it's already in the queue (though shift should prevent this for current run).
                    // if (sub.subID !== latestActiveSub?.subID || !currentPaymentInfo || currentPaymentInfo.subID !== latestActiveSub.subID) {
                    if (!currentQueue.includes(sub.subID)) { // Simplified check: just add if not already in queue
                         currentQueue.push(sub.subID);
                         addedToQueueCount++;
                         console.log(`[handleSubscriptions][FinalCheck] Added SubID ${sub.subID} to queue.`);
                    // }
                    } else {
                        console.log(`[handleSubscriptions][FinalCheck] SubID ${sub.subID} already in queue or processed. Skipping add.`);
                    }
                });
                if (addedToQueueCount > 0) {
                    await GM_setValue(SUBS_TO_PROCESS_QUEUE_KEY, JSON.stringify(currentQueue));
                    await GM_setValue(SUBSCRIPTION_CANCELLED_STATUS_KEY, false); // Ensure status reflects pending work
                    console.log(`[handleSubscriptions] Added ${addedToQueueCount} SubIDs to the queue for next run. Reloading to process.`);
                    setTimeout(() => window.location.reload(), 1000); // Reload to pick up from queue
                    return;
                }
            }
            */

                Logger.debug('[handleSubscriptions] 所有处理路径（除数据同步外）已完成');

                // 7. 发送数据到Google Sheet
                // 优化：使用 collectSyncData 函数统一数据收集逻辑，遵循DRY原则
                const syncResult = await utils.safeAsyncOperation(async () => {
                    Logger.info('[handleSubscriptions][SendData] 开始收集数据用于Google Sheet同步...');
                    await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '正在同步...');
                    debouncedCreateUserInfoPanel();

                    // 优化：使用统一的 collectSyncData 函数收集数据
                    const dataResult = await utils.collectSyncData();

                    if (!dataResult.isValid) {
                        Logger.warn('[handleSubscriptions][SendData] 数据收集失败:', dataResult.error);
                        const currentSyncStatus = await GM_getValue(SYNC_STATUS_MESSAGE_KEY);
                        if (currentSyncStatus !== '同步跳过 (记录已存在)') {
                            await GM_setValue(SYNC_STATUS_MESSAGE_KEY, `同步跳过: ${dataResult.error}`);
                            debouncedCreateUserInfoPanel();
                        }
                        utils.showNotification("提示：部分关键信息未能获取，数据未同步到云端表格。请检查控制台日志了解详情。");
                        return;
                    }

                    // 检查是否已同步过（避免重复）
                    const lastSyncedPassword = await GM_getValue('otoy_last_synced_password', null);
                    if (dataResult.data.password === lastSyncedPassword) {
                        Logger.debug('[handleSubscriptions][SendData] 该密码的数据已同步过，跳过');
                        await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步跳过 (记录已存在)');
                        debouncedCreateUserInfoPanel();
                        return;
                    }

                    // 发送数据
                    Logger.info('[handleSubscriptions][SendData] 所有必需数据已收集，准备发送');
                    const success = await utils.sendDataToGoogleSheet(dataResult.data);
                    if (success) {
                        Logger.info('[handleSubscriptions][SendData] 数据成功发送到Google Sheet');
                        await GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                        await GM_deleteValue(TEMP_PASSWORD_KEY);
                        await GM_setValue('otoy_last_synced_password', dataResult.data.password);
                        Logger.debug('[handleSubscriptions][SendData] 临时凭据已清除，最后同步密码已记录');
                    } else {
                        Logger.error('[handleSubscriptions][SendData] 发送数据到Google Sheet失败');
                    }
                    debouncedCreateUserInfoPanel();
                }, 'handleSubscriptions[SendData]', { showNotification: false });

                if (!syncResult.success) {
                    Logger.error('[handleSubscriptions] 数据同步过程出错:', syncResult.error);
                }

            } catch (error) {
                utils.handleError('handleSubscriptions', error, { showNotification: false });
            } finally {
                PerformanceMonitor.end('handleSubscriptions');
            }

        }, // End of handleSubscriptions

        // --- 新增：处理账户主页 (index.php) ---
        handleAccountIndex() {
            Logger.info('处理账户主页 (index.php)...');
            // 选择器需要根据实际页面确认，这里使用占位符
            // 优化：使用常量选择器
            Logger.debug(`[handleAccountIndex] Attempting to find username element with selector: ${SELECTORS.USERNAME_INPUT}`);
            const usernameElement = document.querySelector(SELECTORS.USERNAME_INPUT);
            Logger.debug(`[handleAccountIndex] Attempting to find email element with selector: ${SELECTORS.EMAIL_INPUT}`);
            const emailElement = document.querySelector(SELECTORS.EMAIL_INPUT);

            let usernameFound = false;
            let emailFound = false;

            if (usernameElement) {
                const username = usernameElement.value.trim(); // 读取 value 属性
                Logger.debug('[handleAccountIndex] Username element found. Raw value:', usernameElement.value, 'Trimmed value:', username);
                if (username) {
                    GM_setValue('otoy_username', username);
                    Logger.info('用户名已获取并存储:', username);
                    usernameFound = true;
                } else {
                    Logger.debug('[handleAccountIndex] 找到用户名元素，但内容为空。');
                }
            } else {
                Logger.warn(`[handleAccountIndex] 未找到用户名元素 (选择器: ${SELECTORS.USERNAME_INPUT})。`);
            }

            if (emailElement) {
                const email = emailElement.value.trim(); // 读取 value 属性
                Logger.debug('[handleAccountIndex] Email element found. Raw value:', emailElement.value, 'Trimmed value:', email);
                if (email) {
                    GM_setValue('otoy_email', email);
                    Logger.info('邮箱已获取并存储:', email);
                    emailFound = true;
                } else {
                    Logger.debug('[handleAccountIndex] 找到邮箱元素，但内容为空。');
                }
            } else {
                Logger.warn(`[handleAccountIndex] 未找到邮箱元素 (选择器: ${SELECTORS.EMAIL_INPUT})。`);
            }

            if (usernameFound && emailFound) {
                Logger.info('用户信息获取成功，跳转到 subscriptions.php 进行下一步...');
                // 优化：使用统一的导航函数
                utils.navigateTo('SUBSCRIPTIONS', { reason: '用户信息获取成功，跳转到订阅页面' });
            } else {
                Logger.warn('[handleAccountIndex] 未能完全获取用户信息，请检查页面元素选择器。暂时停留在当前页面。');
                utils.showNotification("警告：未能从账户主页获取部分用户信息。后续操作可能受影响。");
                // 优化：使用防抖函数创建面板
                setTimeout(() => debouncedCreateUserInfoPanel(0), 100);
            }
        },
        // --- 账户主页处理结束 ---

        // --- 新增：处理支付状态页面 (status.php) (Checklist item 3) ---
        handleStatusPage() {
            Logger.info('到达 status.php 页面，检查支付状态...');
            const currentUrl = window.location.href;

            if (currentUrl.includes('redirect_status=succeeded')) {
                Logger.info('检测到支付成功状态 (redirect_status=succeeded) 于 status.php 页面。');
                // 不在此处发送数据，确保后续导航到 subscriptions 页面由 handleSubscriptions 统一处理记录
                Logger.info('支付成功，将导航到银行卡管理页面。记录将在订阅页进行。');
                // 优化：使用统一的导航函数
                utils.navigateTo('CARDS', { reason: '支付成功，跳转到银行卡管理页面' });
            } else if (currentUrl.includes('redirect_status=failed')) {
                Logger.error('检测到支付失败状态 (redirect_status=failed) 于 status.php 页面。');
                utils.showNotification('支付失败，请检查您的支付方式或联系客服。');
            } else if (currentUrl.includes('redirect_status=pending')) {
                Logger.warn('检测到支付待处理状态 (redirect_status=pending) 于 status.php 页面。');
                utils.showNotification('支付正在处理中，请稍后查看。');
            } else {
                Logger.debug('在 status.php 页面未检测到明确的 redirect_status (succeeded/failed/pending)。URL:', currentUrl);
            }
        }
        // --- 支付状态页面处理结束 ---
    };

    /**
     * 主函数
     * 根据当前URL路由到相应的页面处理器
     * @returns {Promise<void>}
     */
    async function main() {
        PerformanceMonitor.start('main');

        // 在脚本启动时检查是否存在上次未成功发送的临时凭据
        const initialTempAccount = GM_getValue(TEMP_LOGIN_ACCOUNT_KEY, null);
        const initialTempPassword = GM_getValue(TEMP_PASSWORD_KEY, null);
        if (initialTempAccount || initialTempPassword) {
            Logger.warn('[Main] 检测到上次未成功发送的临时登录信息。如果发生记录事件，将尝试使用这些信息。它们会在下次成功发送或重新登录时被清除。账号:', initialTempAccount, '密码是否设置:', !!initialTempPassword);
            // utils.showNotification('提示：有待发送的充值记录信息。'); // 可选的用户提示
        }


        const currentURL = window.location.href;

        // 在非登录/注册页面显示面板并添加拦截器
        if (currentURL !== CONFIG.URLS.SIGN_IN && currentURL !== CONFIG.URLS.SIGN_UP) {
            // 延迟一点点创建面板，确保 body 完全加载
            // 优化：使用防抖函数，避免频繁刷新
            setTimeout(() => debouncedCreateUserInfoPanel(0), 100);
            addLogoutInterceptor(); // 调用拦截器
        }

        if (currentURL === CONFIG.URLS.SIGN_UP) {
            pageHandlers.handleSignUp();
        } else if (currentURL === CONFIG.URLS.SIGN_IN) {
            // pageHandlers.handleSignIn(); // Old call
            await pageHandlers.handleSignIn(); // 7. Modified to await
        } else if (currentURL === CONFIG.URLS.HOME) {
            Logger.info('当前页面是 Otoy Home，跳转到账户主页 (index.php)...');
            // 优化：使用统一的导航函数
            utils.navigateTo('ACCOUNT_INDEX', { reason: '从主页跳转到账户主页' });
        } else if (currentURL === 'https://render.otoy.com/account/index.php' || currentURL === 'https://render.otoy.com/account/index.php?') { // 更新条件以包含问号
            await pageHandlers.handleAccountIndex(); // handleAccountIndex might do GM_setValue, make it awaitable if it becomes async
        } else if (currentURL === CONFIG.URLS.SUBSCRIPTIONS || currentURL === 'https://render.otoy.com/account/subscriptions.php?') { // Ensure this matches CONFIG.URLS.SUBSCRIPTIONS
            await pageHandlers.handleSubscriptions(); // handleSubscriptions is async
        } else if (currentURL === 'https://render.otoy.com/config/shared/register.php') {
            pageHandlers.handleRegisterConfig();
        } else if (currentURL.includes('config/shared/login')) {
            pageHandlers.handleLoginConfig();
        } else if (currentURL === 'https://render.otoy.com/config/shared/policy_update.php') {
            pageHandlers.handlePolicyUpdate();
        } else if (currentURL.includes('mac-pro')) {
            pageHandlers.handleMacPro();
        } else if (currentURL.includes('shop/macpro')) {
            pageHandlers.handleMacProShop();
        // REMOVED: else if (currentURL.startsWith(CONFIG.URLS.PURCHASES)) { // This URL is no longer in CONFIG
        //     pageHandlers.handlePurchases();
        // }
        } else if (currentURL.includes('account/subscriptionDetails.php')) {
            await pageHandlers.handleSubscriptionDetails(); // handleSubscriptionDetails is async
        } else if (currentURL.includes('account/cards.php')) {
            await pageHandlers.handleCards(); // handleCards can be async due to GM calls
        } else if (currentURL.includes('shop/purchase.php')) {
            pageHandlers.handlePurchase();
        } else if (currentURL.startsWith('https://render.otoy.com/shop/status.php')) { // Checklist item 2
            pageHandlers.handleStatusPage();
        }

        PerformanceMonitor.end('main');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();