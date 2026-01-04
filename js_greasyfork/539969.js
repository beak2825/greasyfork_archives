// ==UserScript==
// @name         B站自动点赞 (模块化增强版)
// @namespace    http://tampermonkey.net/
// @version      2025.06.21
// @description  B站视频/番剧自动点赞。强化模块化设计，完善错误处理，优化选择器策略
// @author       Gemini (重构优化)
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539969/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%20%28%E6%A8%A1%E5%9D%97%E5%8C%96%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539969/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%20%28%E6%A8%A1%E5%9D%97%E5%8C%96%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------
    // 1. 核心配置模块
    // -------------------------
    const CONFIG = {
        // 触发点赞的条件配置
        PLAY_PROGRESS_THRESHOLD: 30,       // 播放进度百分比阈值
        PLAY_TIME_THRESHOLD: 60,           // 播放时间阈值(秒)

        // 运行时控制参数
        CHECK_INTERVAL: 1500,              // 状态检查间隔(毫秒)
        INIT_DELAY: 1500,                  // 初始化延迟(毫秒)
        ACTION_DELAY: 200,                 // 操作反馈延迟(毫秒)
        POST_ACTION_DELAY: 700,            // 操作后检查延迟(毫秒)

        // 调试与日志配置
        DEBUG_MODE: true,                  // 调试模式开关
        LOG_LEVEL: 'INFO'                 // 日志级别: DEBUG/INFO/WARN/ERROR
    };

    // -------------------------
    // 2. 全局状态管理
    // -------------------------
    let state = {
        checkInterval: null,       // 进度检查定时器ID
        currentUrl: '',            // 当前页面URL
        isLiked: false,            // 当前点赞状态
        pageType: 'unknown'        // 页面类型标识
    };

    // -------------------------
    // 3. 日志系统模块
    // -------------------------
    /**
     * 统一日志输出接口
     * @param {string} level - 日志级别: DEBUG/INFO/WARN/ERROR
     * @param {string} message - 日志内容
     */
    function log(level, message) {
        if (!CONFIG.DEBUG_MODE && level !== 'ERROR') return;

        const levels = {
            DEBUG: '\x1b[36m[DEBUG]\x1b[0m',
            INFO: '\x1b[32m[INFO]\x1b[0m',
            WARN: '\x1b[33m[WARN]\x1b[0m',
            ERROR: '\x1b[31m[ERROR]\x1b[0m'
        };

        if (levels[level]) {
            console.log(`[BiliAutoLike] ${new Date().toLocaleTimeString()} ${levels[level]} - ${message}`);
        }
    }

    // -------------------------
    // 4. 页面类型识别模块
    // -------------------------
    const PAGE_TYPES = {
        VIDEO: 'video',
        BANGUMI: 'bangumi',
        UNKNOWN: 'unknown'
    };

    /**
     * 获取当前页面类型
     * @returns {string} 页面类型常量
     */
    function getPageType() {
        const href = window.location.href;
        const isBangumi = href.includes('/bangumi/play/');
        const isVideo = href.includes('/video/');

        state.pageType = isBangumi ? PAGE_TYPES.BANGUMI : isVideo ? PAGE_TYPES.VIDEO : PAGE_TYPES.UNKNOWN;
        log('INFO', `识别页面类型: ${state.pageType}`);
        return state.pageType;
    }

    // -------------------------
    // 5. 选择器策略管理模块
    // -------------------------
    /**
     * 点赞按钮选择器策略集合
     * 按优先级顺序排列选择器
     */
    const likeButtonStrategies = {
        [PAGE_TYPES.VIDEO]: [
            '.bpx-player-ctrl .bpx-player-ctrl-like',      // 新版播放器点赞按钮
            'div[title="点赞（Q）"]',                      // 标题属性选择器
            '.video-toolbar-left-item.video-like',         // 视频工具栏点赞
            'button[aria-label="点赞"]'                    // 无障碍属性选择器
        ],
        [PAGE_TYPES.BANGUMI]: [
            '.ep-handle-like',                             // 新版番剧点赞按钮
            '.bangumi-player-container .like-btn',         // 番剧播放器内按钮
            '#like_info',                                  // 旧版ID选择器
            'button[class*="bangumi-player-like"]'         // 类名模糊匹配
        ],
        [PAGE_TYPES.UNKNOWN]: [
            'button[aria-label="点赞"]',                   // 通用无障碍选择器
            '.like-button',                                // 通用类名选择器
            '.bpx-player-ctrl-like'                        // 尝试通用播放器选择器
        ]
    };

    /**
     * 获取点赞按钮元素
     * @returns {HTMLElement|null} 点赞按钮元素或null
     */
    function getLikeButton() {
        const pageType = getPageType();
        const selectors = likeButtonStrategies[pageType] || likeButtonStrategies[PAGE_TYPES.UNKNOWN];

        log('DEBUG', `为${pageType}页面查找点赞按钮，尝试选择器: ${selectors.join(', ')}`);

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                log('INFO', `找到点赞按钮，选择器: ${selector}`);
                return element;
            }
        }

        log('WARN', `未找到可见的点赞按钮，页面类型: ${pageType}`);
        return null;
    }

    // -------------------------
    // 6. DOM状态检测模块
    // -------------------------
    /**
     * 检测元素是否可见
     * @param {HTMLElement} element 目标元素
     * @returns {boolean} 元素可见性状态
     */
    function isElementVisible(element) {
        if (!element) return false;

        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity > 0 &&
            rect.height > 0 &&
            rect.width > 0
        );
    }

    /**
     * 检测视频是否已点赞
     * @param {HTMLElement} button 点赞按钮元素
     * @returns {boolean} 点赞状态
     */
    function isVideoLiked(button) {
        if (!button) return true; // 找不到按钮时假设已点赞避免重复操作

        const activeStates = [
            'on', 'actived', 'is-liked', 'liked', 'active', 'zaned',
            'bili-__heart-on', 'bili-__heart-active' // 补充B站新状态类名
        ];

        for (const stateClass of activeStates) {
            if (button.classList.contains(stateClass)) {
                log('DEBUG', `检测到已点赞状态类: ${stateClass}`);
                return true;
            }
        }

        // 检测无障碍属性
        if (button.getAttribute('aria-checked') === 'true' ||
            button.getAttribute('aria-pressed') === 'true') {
            log('DEBUG', '检测到已点赞无障碍属性');
            return true;
        }

        // 检测子元素状态
        const likedIndicators = [
            '.icon-liked', '.bili-__icon-heart-fill',
            '[class*="icon_like_selected"]', '.liked-icon'
        ];

        for (const selector of likedIndicators) {
            if (button.querySelector(selector)) {
                log('DEBUG', `子元素检测到点赞状态: ${selector}`);
                return true;
            }
        }

        return false;
    }

    // -------------------------
    // 7. 点赞操作执行模块
    // -------------------------
    /**
     * 执行点赞操作
     * @param {HTMLElement} button 点赞按钮元素
     */
    function likeVideo(button) {
        if (isVideoLiked(button)) {
            log('INFO', '目标已点赞，跳过操作');
            stopProgressCheck();
            return;
        }

        log('INFO', '开始执行点赞操作');
        const pageType = getPageType();
        const strategy = getClickStrategy(pageType);

        try {
            // 添加视觉反馈
            button.style.transition = 'transform 0.15s ease';
            button.style.transform = 'scale(1.2)';

            setTimeout(() => {
                // 执行对应页面的点击策略
                strategy(button);

                // 恢复按钮样式
                button.style.transform = '';
                log('INFO', '点赞操作事件已派发');

                // 延迟检查点赞结果
                setTimeout(checkLikeResult, CONFIG.POST_ACTION_DELAY);
            }, CONFIG.ACTION_DELAY);

        } catch (error) {
            log('ERROR', `点赞操作异常: ${error.message}`);
            button.style.transform = '';
            stopProgressCheck();
        }
    }

    /**
     * 获取点击策略函数
     * @param {string} pageType 页面类型
     * @returns {Function} 点击策略函数
     */
    function getClickStrategy(pageType) {
        switch (pageType) {
            case PAGE_TYPES.VIDEO:
                return videoClickStrategy;
            case PAGE_TYPES.BANGUMI:
                return bangumiClickStrategy;
            default:
                return defaultClickStrategy;
        }
    }

    /**
     * 普通视频点击策略
     * @param {HTMLElement} button 点赞按钮
     */
    function videoClickStrategy(button) {
        log('DEBUG', '执行视频页面点击策略: mouseover -> mousedown -> mouseup -> click');
        dispatchEvents(button, ['mouseover', 'mousedown', 'mouseup', 'click']);
    }

    /**
     * 番剧页面点击策略
     * @param {HTMLElement} button 点赞按钮
     */
    function bangumiClickStrategy(button) {
        log('DEBUG', '执行番剧页面点击策略: mousedown -> mouseup');
        dispatchEvents(button, ['mousedown', 'mouseup']);
    }

    /**
     * 默认点击策略
     * @param {HTMLElement} button 点赞按钮
     */
    function defaultClickStrategy(button) {
        log('DEBUG', '执行默认点击策略: 直接click()');
        button.click();
    }

    /**
     * 派发事件序列
     * @param {HTMLElement} element 目标元素
     * @param {string[]} eventTypes 事件类型数组
     */
    function dispatchEvents(element, eventTypes) {
        eventTypes.forEach(type => {
            const event = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            log('DEBUG', `派发事件: ${type}`);
            element.dispatchEvent(event);
        });
    }

    /**
     * 检查点赞结果
     */
    function checkLikeResult() {
        const button = getLikeButton();
        if (button && isVideoLiked(button)) {
            log('INFO', '点赞成功，按钮状态已更新');
        } else {
            log('WARN', '点赞可能未成功，按钮状态未改变');
            log('DEBUG', '建议检查选择器是否匹配当前页面版本');
        }
        stopProgressCheck();
    }

    // -------------------------
    // 8. 播放进度监控模块
    // -------------------------
    /**
     * 检查播放进度并触发点赞
     */
    function checkPlayProgress() {
        const video = document.querySelector('video');
        if (!video) {
            log('WARN', '未找到视频播放元素');
            return;
        }

        // 跳过未准备好的视频
        if (video.paused || video.ended || video.readyState < 2) {
            return;
        }

        const currentTime = video.currentTime;
        const duration = video.duration;

        // 过滤无效视频
        if (!duration || duration === Infinity || duration < 5) {
            log('DEBUG', '视频时长无效或过短');
            return;
        }

        const progressPercent = (currentTime / duration) * 100;
        const meetProgress = progressPercent >= CONFIG.PLAY_PROGRESS_THRESHOLD;
        const meetTime = currentTime >= CONFIG.PLAY_TIME_THRESHOLD;

        if (meetProgress || meetTime) {
            log('INFO', `满足点赞条件 - 进度: ${progressPercent.toFixed(1)}% (阈值: ${CONFIG.PLAY_PROGRESS_THRESHOLD}%) ` +
                        `或 时间: ${currentTime.toFixed(1)}s (阈值: ${CONFIG.PLAY_TIME_THRESHOLD}s)`);

            const button = getLikeButton();
            if (button) {
                likeVideo(button);
            } else {
                log('WARN', '满足点赞条件但未找到点赞按钮，停止检查');
                stopProgressCheck();
            }
        }
    }

    /**
     * 启动进度检查
     */
    function startProgressCheck() {
        if (state.checkInterval) return;

        log('INFO', `启动播放进度检查，间隔: ${CONFIG.CHECK_INTERVAL}ms`);
        state.checkInterval = setInterval(checkPlayProgress, CONFIG.CHECK_INTERVAL);
    }

    /**
     * 停止进度检查
     */
    function stopProgressCheck() {
        if (state.checkInterval) {
            clearInterval(state.checkInterval);
            state.checkInterval = null;
            log('INFO', '停止播放进度检查');
        }
    }

    // -------------------------
    // 9. 脚本生命周期管理模块
    // -------------------------
    /**
     * 初始化脚本模块
     */
    function initialize() {
        stopProgressCheck();

        const video = document.querySelector('video');
        const button = getLikeButton();

        if (video && button) {
            log('INFO', '脚本初始化完成，视频元素和点赞按钮已就绪');

            if (isVideoLiked(button)) {
                log('INFO', '目标已点赞，无需启动检查');
                return;
            }

            startProgressCheck();
        } else {
            log('WARN', '初始化失败，缺少关键元素');
            if (!video) log('DEBUG', '未找到<video>元素');
            if (!button) log('DEBUG', '未找到点赞按钮');
        }
    }

    /**
     * 主执行函数
     */
    function main() {
        // 检测URL变化
        if (window.location.href === state.currentUrl && state.checkInterval) {
            log('DEBUG', 'URL未变化，跳过重复初始化');
            return;
        }

        state.currentUrl = window.location.href;
        log('INFO', `脚本启动/页面变更 - URL: ${state.currentUrl}, 类型: ${getPageType()}`);

        stopProgressCheck();

        // 延迟初始化，等待页面资源加载
        setTimeout(initialize, CONFIG.INIT_DELAY);
    }

    // -------------------------
    // 10. 启动脚本
    // -------------------------
    log('INFO', 'B站自动点赞脚本(模块化增强版)已加载，等待页面初始化...');

    // 页面加载完成事件
    window.addEventListener('load', main);

    // 监听SPA路由变化
    const originalPushState = history.pushState;
    history.pushState = function() {
        const result = originalPushState.apply(this, arguments);
        log('DEBUG', '检测到history.pushState，重新初始化脚本');
        main();
        return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        const result = originalReplaceState.apply(this, arguments);
        log('DEBUG', '检测到history.replaceState，重新初始化脚本');
        main();
        return result;
    };

    // DOM变化观察器
    const observer = new MutationObserver(mutations => {
        if (!state.checkInterval) {
            log('DEBUG', 'DOM变化检测，尝试初始化脚本');
            initialize();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // 处理文档已加载情况
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        main();
    }

})();