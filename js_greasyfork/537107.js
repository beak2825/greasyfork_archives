// ==UserScript==
// @name         岐黄助手-每日上限管理器
// @namespace    http://tampermonkey.net/
// @version      1.0.4 // 版本更新
// @description  管理岐黄天使学习平台的每日学习上限并更新UI显示
// @author       AI 助手
// @match        *://www.tcm512.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    class DailyLimitManager {
        constructor(options = {}) {
            this.config = {
                limitVideos: options.limitVideos || 10, // 默认每天10个视频
                resetHour: GM_getValue('qh_daily_limit_reset_hour', options.resetHour || 8), // 默认早上8点重置
                selectors: options.selectors || {
                    limitReachedHintBox: '.sc_tips_box[style*="display: block"]', // 网站提示达到上限的容器选择器
                    limitReachedTextHint: '.title', // 在上述容器中包含特定文本的元素
                    limitReachedTextContent: '每天最多只能学习10个视频', // 指示达到上限的具体文本
                    confirmButton: '.layui-layer-btn0' // "我知道了"按钮的选择器
                },
                onLimitReached: options.onLimitReached || function() { console.warn('[每日上限管理器] onLimitReached 回调未设置。'); },
                onLimitReset: options.onLimitReset || function() { console.info('[每日上限管理器] 每日上限已重置。'); }
            };

            this.state = {
                videosWatchedToday: GM_getValue('qh_videos_watched_today', 0), // 今天已观看视频数
                lastResetDate: GM_getValue('qh_daily_limit_last_reset_date', new Date().toDateString()), // 上次重置日期
                isLimitReached: GM_getValue('qh_daily_limit_reached', false), // 是否已达到上限
                lastLimitDate: GM_getValue('qh_daily_limit_date', null), // 记录达到上限的日期
                autoResetTimer: null, // 自动重置的setTimeout ID
                countdownInterval: null, // UI倒计时更新的setInterval ID
                pageCheckInterval: null, // 页面检查的setInterval ID
            };

            this._checkAndResetOnNewDay(); // 初始化检查
            if (this.state.isLimitReached) {
                 this._scheduleAutoReset(); // 如果已达上限，确保已安排重置并启动倒计时
            }
            this._updateUIDisplay(); // 初始化UI更新
            console.log('[每日上限管理器] 初始化完成。状态:', JSON.parse(JSON.stringify(this.state)));
        }

        _getMillisecondsUntilReset() {
            const now = new Date();
            let resetTime = new Date();
            resetTime.setHours(this.config.resetHour, 0, 0, 0);

            if (now.getHours() >= this.config.resetHour) { // 如果当前时间已过重置小时，则安排到下一天
                resetTime.setDate(resetTime.getDate() + 1);
            }
            return resetTime.getTime() - now.getTime();
        }

        _formatCountdown(ms) {
            if (ms <= 0) return "00:00:00";
            let seconds = Math.floor((ms / 1000) % 60);
            let minutes = Math.floor((ms / (1000 * 60)) % 60);
            let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            return `${hours}:${minutes}:${seconds}`;
        }

        _updateUIDisplay() {
            if (typeof window.updateDailyLimitDisplay !== 'function') {
                // console.warn('[每日上限管理器] window.updateDailyLimitDisplay 函数不可用。');
                return;
            }

            let statusText = '';
            let countdownText = '--:--:--';

            if (this.state.isLimitReached) {
                statusText = `已达上限 (${this.state.videosWatchedToday}/${this.config.limitVideos} 个视频)`;
                const msUntilReset = this._getMillisecondsUntilReset();
                countdownText = this._formatCountdown(msUntilReset);
            } else {
                statusText = `今日已看 ${this.state.videosWatchedToday}/${this.config.limitVideos} 个视频`;
                const msUntilReset = this._getMillisecondsUntilReset();
                countdownText = this._formatCountdown(msUntilReset);
            }
            if (this.config.limitVideos <= 0) {
                statusText = '无每日学习上限';
                countdownText = '不适用'; // N/A
            }

            // 防抖机制：只在状态真正变化时更新UI和输出日志
            const newDisplayState = `${statusText}|${countdownText}`;
            if (this.state.lastDisplayState !== newDisplayState) {
                this.state.lastDisplayState = newDisplayState;
                window.updateDailyLimitDisplay(statusText, countdownText);
            }
        }

        _checkAndResetOnNewDay() {
            const today = new Date().toDateString();
            // console.log(`[每日上限管理器] 检查新的一天。今天是: ${today}, 上次重置: ${this.state.lastResetDate}`);
            if (this.state.lastResetDate !== today) {
                const now = new Date();
                if (this.state.lastResetDate !== today && now.getHours() >= this.config.resetHour) {
                    console.log('[每日上限管理器] 检测到新的一天且已过重置时间，正在重置每日上限。');
                    this.state.videosWatchedToday = 0;
                    this.state.isLimitReached = false;
                    this.state.lastResetDate = today;
                    this.state.lastLimitDate = null;
                    GM_setValue('qh_videos_watched_today', 0);
                    GM_setValue('qh_daily_limit_reached', false);
                    GM_setValue('qh_daily_limit_last_reset_date', today);
                    GM_setValue('qh_daily_limit_date', null);

                    if (this.state.autoResetTimer) {
                        clearTimeout(this.state.autoResetTimer);
                        this.state.autoResetTimer = null;
                    }
                    if (this.state.countdownInterval) {
                        clearInterval(this.state.countdownInterval);
                        this.state.countdownInterval = null;
                    }
                    this.config.onLimitReset();
                    this._scheduleAutoReset();
                } else if (this.state.lastResetDate !== today && now.getHours() < this.config.resetHour) {
                    if (!this.state.isLimitReached) {
                        this.state.videosWatchedToday = 0;
                        GM_setValue('qh_videos_watched_today', 0);
                        this.state.lastResetDate = today;
                        GM_setValue('qh_daily_limit_last_reset_date', today);
                        console.log('[每日上限管理器] 新的一天，未到重置时间，学习上限未满。计数器已重置，等待今日的计划重置。');
                    } else {
                        console.log('[每日上限管理器] 新的一天，未到重置时间，但学习上限已满。等待计划重置。');
                    }
                    if (this.state.isLimitReached && !this.state.autoResetTimer) {
                        this._scheduleAutoReset();
                    }
                }
            }
            this._updateUIDisplay();
        }

        /**
         * 通过检查页面内容来判断是否已达到每日学习上限。
         * @param {Document} docContext - 要检查的文档上下文 (主窗口或 iframe)。
         * @returns {boolean} 如果检测到上限则为 true，否则为 false。
         */
        checkLimitReachedOnPage(docContext) {
            if (!docContext) {
                console.warn('[每日上限管理器] 在 checkLimitReachedOnPage 中 docContext 为空');
                return false;
            }
            try {
                const hintBox = docContext.querySelector(this.config.selectors.limitReachedHintBox);
                if (hintBox) {
                    const titleElement = hintBox.querySelector(this.config.selectors.limitReachedTextHint);
                    if (titleElement && titleElement.textContent.includes(this.config.selectors.limitReachedTextContent)) {
                        console.log('[每日上限管理器] 检测到每日上限提示:', titleElement.textContent);
                        return true;
                    }
                }
            } catch (e) {
                console.error('[每日上限管理器] 检查页面每日上限时出错:', e);
            }
            return false;
        }

        /**
         * 当一个视频被视为已观看时调用此方法，以可能更新上限状态。
         */
        notifyVideoWatched() {
            this._checkAndResetOnNewDay(); // 计数前确保日期是最新的

            if (this.state.isLimitReached) {
                console.log('[每日上限管理器] 已达到上限，不增加视频计数。');
                this._updateUIDisplay();
                return; // 如果已通过程序设置上限，则不计数
            }

            this.state.videosWatchedToday++;
            GM_setValue('qh_videos_watched_today', this.state.videosWatchedToday);
            console.log(`[每日上限管理器] 视频已观看。计数: ${this.state.videosWatchedToday}`);

            if (this.config.limitVideos > 0 && this.state.videosWatchedToday >= this.config.limitVideos) {
                console.log('[每日上限管理器] 视频观看数量已达上限。');
                this.handleLimitReached(); // 处理达到上限的情况
            } else {
                 // 如果因为页面检测到上限而调用了 handleLimitReached，则 isLimitReached 可能已经是 true
                 // 但如果仅通过计数达到上限，则在此处调用
                const pageLimit = this.checkLimitReachedOnPage(document); // 检查当前页面是否也提示上限
                if (pageLimit) {
                    console.log('[每日上限管理器] 页面也检测到上限信息。');
                    this.handleLimitReached();
                }
            }
            this._updateUIDisplay();
        }

        /**
         * Handles the scenario when the daily limit is reached.
         * Sets internal state, informs UI, and schedules auto-reset.
         */
        handleLimitReached() {
            // console.warn('[每日上限管理器] handleLimitReached 未完全实现。');
            if (this.state.isLimitReached && this.state.lastLimitDate === new Date().toDateString()) {
                // 今天已经处理过并且记录了。
                // 如果倒计时不存在或需要更新，则重新调度
                if (!this.state.countdownInterval) {
                    this._scheduleAutoReset(); // 确保倒计时启动
                }
                this._updateUIDisplay(); // 确保UI是最新的
                return; // 避免重复处理
            }

            console.log('[每日上限管理器] 每日上限已通过页面检测或计数达到。');
            this.state.isLimitReached = true;
            this.state.lastLimitDate = new Date().toDateString(); // 记录达到上限的日期
            GM_setValue('qh_daily_limit_reached', true);
            GM_setValue('qh_daily_limit_date', this.state.lastLimitDate);

            this.config.onLimitReached(); // 调用外部回调
            this._scheduleAutoReset(); // 安排自动重置并启动UI倒计时
            this._updateUIDisplay(); // 更新UI显示
        }

        /**
         * Starts a periodic check for the on-page limit hints.
         */
        startPeriodicPageCheck(docContextRoot, interval = 300000) { // 默认5分钟检查一次
            // console.warn('[每日上限管理器] startPeriodicPageCheck 未完全实现。');
            if (this.state.pageCheckIntervalId) {
                clearInterval(this.state.pageCheckIntervalId);
            }
            this.state.lastLimitCheckTime = Date.now(); // 初始化上次检查时间

            this.state.pageCheckIntervalId = setInterval(() => {
                const now = Date.now();
                // 避免过于频繁的检查，例如当浏览器标签页在后台时定时器可能行为异常
                if (now - this.state.lastLimitCheckTime > interval - 1000) { // 稍微提前一点，以防万一
                    this.state.lastLimitCheckTime = now;
                    console.log('[每日上限管理器] 定期检查页面上的上限提示。');
                    if (this.checkLimitReachedOnPage(docContextRoot || document)) {
                        console.log('[每日上限管理器] 通过定期检查在页面上检测到上限提示。');
                        this.handleLimitReached();
                    } else {
                        // 如果页面不再提示上限，但脚本内部状态仍是 isLimitReached
                        // 这可能意味着上限通过其他方式被解除了，或者之前是误报
                        // 暂时不自动重置，依赖于每日自动重置或手动重置
                        // console.log('[每日上限管理器] 定期检查未发现页面上限提示。');
                    }
                }
            }, Math.max(interval, 60000)); // 确保检查间隔至少为1分钟
            console.log(`[每日上限管理器] 已启动页面上限提示的定期检查 (间隔: ${interval / 1000} 秒)。`);
        }

        stopPeriodicPageCheck() {
            if (this.state.pageCheckIntervalId) {
                clearInterval(this.state.pageCheckIntervalId);
                this.state.pageCheckIntervalId = null;
                console.log('[每日上限管理器] 已停止页面上限提示的定期检查。');
            }
        }

        /**
         * Gets the current state of whether the limit is reached.
         * @returns {boolean}
         */
        isLimitActive() {
            this._checkAndResetOnNewDay(); // 确保状态是最新的
            return this.state.isLimitReached;
        }

        getVideosWatchedToday() {
            this._checkAndResetOnNewDay();
            return this.state.videosWatchedToday;
        }

        getLimitVideos() {
            return this.config.limitVideos;
        }

        /**
         * Calculates and returns the countdown string to the next reset time.
         * @returns {string} Formatted countdown string (e.g., "HH:MM:SS") or "--:--:--"
         */
        getCountdownString() {
            if (!this.state.isLimitReached) return "未达上限";
            const msUntilReset = this._getMillisecondsUntilReset();
            return this._formatCountdown(msUntilReset);
        }

        /**
         * Manually resets the daily limit.
         */
        manualReset(callOnResetCallback = true) {
            // console.warn('[每日上限管理器] manualReset 未完全实现。');
            console.log('[每日上限管理器] 手动重置已触发。');
            this.state.videosWatchedToday = 0;
            this.state.isLimitReached = false;
            this.state.lastResetDate = new Date().toDateString(); // 将最后重置日期更新为今天
            this.state.lastLimitDate = null; // 清除上次达到上限的日期

            GM_setValue('qh_videos_watched_today', 0);
            GM_setValue('qh_daily_limit_reached', false);
            GM_setValue('qh_daily_limit_last_reset_date', this.state.lastResetDate);
            GM_setValue('qh_daily_limit_date', null);

            if (this.state.autoResetTimer) {
                clearTimeout(this.state.autoResetTimer);
                this.state.autoResetTimer = null;
            }
            if (this.state.countdownInterval) {
                clearInterval(this.state.countdownInterval);
                this.state.countdownInterval = null;
            }

            if (callOnResetCallback) {
                this.config.onLimitReset();
            }
            this._scheduleAutoReset(); // 重新安排下一次自动重置并更新倒计时
            this._updateUIDisplay();
            console.log('[每日上限管理器] 手动重置后状态:', JSON.parse(JSON.stringify(this.state)));
        }

        /**
         * Updates the configured reset hour.
         * @param {number} hour - The new hour (0-23) for reset.
         */
        setResetHour(hour) {
            // console.warn('[每日上限管理器] setResetHour 未完全实现。');
            const hourInt = parseInt(hour, 10);
            if (!isNaN(hourInt) && hourInt >= 0 && hourInt <= 23) {
                console.log(`[每日上限管理器] 设置重置小时为: ${hourInt}`);
                this.config.resetHour = hourInt;
                GM_setValue('qh_daily_limit_reset_hour', hourInt);

                // 如果当前已达上限或只是普通情况，都需要重新计算并安排下一次重置
                console.log('[每日上限管理器] 重置小时已更改，重新安排自动重置并更新UI。');
                this._scheduleAutoReset(); // 会清除旧的timer和interval，并用新时间启动
                this._updateUIDisplay(); // 立即更新UI倒计时

            } else {
                console.error('[每日上限管理器] 提供了无效的重置小时:', hour);
            }
        }

        getResetHour() {
            return this.config.resetHour;
        }

        getState() {
            return JSON.parse(JSON.stringify(this.state)); // 返回状态的深拷贝
        }

        setConfig(newConfig) {
            let changed = false;
            for (const key in newConfig) {
                if (Object.hasOwnProperty.call(this.config, key) && this.config[key] !== newConfig[key]) {
                    this.config[key] = newConfig[key];
                    changed = true;
                }
            }
            if (changed) {
                console.log('[每日上限管理器] 配置已更新。正在检查是否需要调整上限状态...');
                // 如果视频上限数量改变，可能需要重新评估 isLimitReached状态
                if (newConfig.limitVideos !== undefined) {
                    if (this.config.limitVideos > 0 && this.state.videosWatchedToday >= this.config.limitVideos) {
                        if (!this.state.isLimitReached) {
                            console.log('[每日上限管理器] 根据新配置，视频数量已达上限。');
                            this.handleLimitReached(); // 触发上限处理
                        }
                    } else if (this.state.isLimitReached && (this.config.limitVideos <= 0 || this.state.videosWatchedToday < this.config.limitVideos)) {
                        // 如果之前是上限状态，但新配置允许更多视频或无限制，则解除上限
                        console.log('[每日上限管理器] 根据新配置，视频数量未达上限或无限制。解除上限状态。');
                        this.manualReset(true); // 使用manualReset来重置状态并触发回调和重新调度
                    }
                }
                 if (newConfig.resetHour !== undefined) {
                    this.setResetHour(newConfig.resetHour); // 调用setResetHour来处理重置小时的变更逻辑
                }
                this._updateUIDisplay();
                console.log('[每日上限管理器] 配置更新完毕:', this.config);
            } else {
                console.log('[每日上限管理器] 无配置变更。');
            }
        }

        // --- Internal methods ---

        _scheduleAutoReset() {
            if (this.state.autoResetTimer) {
                clearTimeout(this.state.autoResetTimer);
                this.state.autoResetTimer = null;
            }
            if (this.state.countdownInterval) {
                clearInterval(this.state.countdownInterval);
                this.state.countdownInterval = null;
            }

            const msUntilReset = this._getMillisecondsUntilReset();
            console.log(`[每日上限管理器] 计划在 ${msUntilReset / 1000 / 60} 分钟后自动重置。`);

            this.state.autoResetTimer = setTimeout(() => {
                console.log('[每日上限管理器] 自动每日上限重置已触发。');
                this._checkAndResetOnNewDay(); // 这个方法会处理实际的重置逻辑和回调
                // _checkAndResetOnNewDay 会调用 _updateUIDisplay 和 _scheduleAutoReset (如果需要再次调度)
            }, msUntilReset);

            // 启动UI倒计时更新（降低频率，减少日志输出）
            this.state.countdownInterval = setInterval(() => {
                this._updateUIDisplay(); // 每30秒更新倒计时显示
            }, 30000); // 从1秒改为30秒
            this._updateUIDisplay(); // 立即更新一次UI
        }
    }

    // 确保 qh 对象存在
    window.qh = window.qh || {};
    window.qh.DailyLimitManager = DailyLimitManager;

    // 导出全局函数供UI模块使用
    window.updateDailyLimitDisplay = function(statusText, countdownText) {
        // 减少日志输出频率，只在debug模式下输出
        if (window.qh && window.qh.debugMode) {
            console.log('[每日上限管理器] 全局 updateDailyLimitDisplay 被调用:', statusText, countdownText);
        }

        // 尝试调用UI模块的函数
        if (window.qh && typeof window.qh.updateDailyLimitDisplay === 'function') {
            window.qh.updateDailyLimitDisplay(statusText, countdownText);
        } else {
            // 直接更新DOM元素
            const limitStatusEl = document.getElementById('qh-daily-limit-status');
            const countdownEl = document.getElementById('qh-daily-limit-countdown');

            if (limitStatusEl) {
                limitStatusEl.textContent = statusText;
            }
            if (countdownEl) {
                countdownEl.textContent = countdownText;
            }
        }
    };

    console.log('[模块加载] dailyLimitManager 模块已加载, 版本 1.0.2');

})();