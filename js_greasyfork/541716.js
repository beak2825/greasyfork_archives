// ==UserScript==
// @name         🎬 YouTube&Bilibili FrameMaster Pro - Ultimate Video Capture Suite
// @name:zh-TW   🎬 YouTube&Bilibili 影格大師 Pro - 終極影片擷取套件
// @name:zh-CN   🎬 YouTube&Bilibili 帧师傅 Pro - 终极视频捕获套件
// @namespace    org.jw23.framemaster
// @version      4.3
// @description  🚀 The ultimate YouTube  screenshot toolkit! It can merge the multiple screenshot by a specific way! 
// @description:zh-TW 🚀 終極YouTube截圖工具套件！
// @description:zh-CN 🚀 终极YouTube截图工具套件！按照平行或者重叠结构合并截图
// @author       ChatGPT & Community
// @grant        GM_registerMenuCommand
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/video/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSIxMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjAwMDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjYwMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIxMiIgZmlsbD0idXJsKCNhKSIvPjxwYXRoIGQ9Ik0yMCAxNmgxNmEyIDIgMCAwIDEgMiAydjEwYTIgMiAwIDAgMS0yIDJIMjBhMiAyIDIgMCAwIDEgMi0yeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yOCAyMnY2bDQtM3oiIGZpbGw9IiNmZjAwMDAiLz48cGF0aCBkPSJNMTYgMzZoMzJhMiAyIDAgMCAxIDIgMnY4YTIgMiAwIDAgMS0yIDJIMTZhMiAyIDAgMCAxLTItMnYtOGEyIDIgMCAwIDEgMi0yeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMCA0MGgzdjJ2M2gtM3YtNXptNCAwaDN2Mmg0djNIMjR2LTV6bTggMGgzdjJoNHYzSDMydC01em04IDBoM3YydjNoLTN2LTV6IiBmaWxsPSIjMzMzIi8+PC9zdmc+
// @supportURL   https://github.com/example/youtube-framemaster/issues
// @homepageURL  https://github.com/example/youtube-framemaster
// @downloadURL https://update.greasyfork.org/scripts/541716/%F0%9F%8E%AC%20YouTubeBilibili%20FrameMaster%20Pro%20-%20Ultimate%20Video%20Capture%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/541716/%F0%9F%8E%AC%20YouTubeBilibili%20FrameMaster%20Pro%20-%20Ultimate%20Video%20Capture%20Suite.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待DOM完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('FrameMaster Pro initializing...');
        console.log('DOM ready state:', document.readyState);
        console.log('Document body:', document.body);

        /**
         * 语言管理系统
         */
        class LanguageManager {
            constructor() {
                this.currentLang = GM_getValue('lang', 'EN');
                this.translations = {
                    EN: {
                        // 面板标题
                        title: '🎬 FrameMaster Pro',
                        subtitle: 'Ultimate Video Capture Suite',

                        // 快速操作
                        quickActions: '⚡ Quick Actions',
                        takeScreenshot: '📸 Take Screenshot',
                        burstMode: '🔥 Burst Mode',
                        currentHotkey: 'Current Hotkey: ',

                        // 基础设置
                        basicSettings: '⚙️ Basic Settings',
                        screenshotHotkey: 'Screenshot Hotkey',
                        apply: 'Apply',
                        burstInterval: 'Burst Interval: ',
                        interfaceLanguage: 'Interface Language',

                        // 字幕设置
                        subtitleSettings: '💬 Subtitle Settings',
                        subtitleFile: 'Subtitle File',
                        enableSubtitle: 'Enable Subtitle Overlay',
                        fontSize: 'Font Size: ',
                        maxLines: 'Max Lines: ',
                        status: 'Status: ',
                        notLoaded: 'Not Loaded',

                        // 批量截图
                        batchScreenshot: '🎯 Batch Screenshot',
                        compositeMode: 'Composite Mode',
                        parallelMode: 'Parallel Mode',
                        overlapMode: 'Overlap Mode',
                        overlapHeight: 'Overlap Height: ',
                        timeRange: 'Time Range',
                        startBatch: '🚀 Start Batch Screenshot',
                        inProgress: '📸 In Progress...',

                        // 底部按钮
                        resetConfig: 'Reset Config',
                        saveConfig: 'Save Config',

                        // 通知消息
                        hotkeyUpdated: 'Hotkey updated to: ',
                        invalidHotkey: 'Please enter a valid single letter as hotkey',
                        languageUpdated: 'Language setting updated',
                        subtitleLoaded: 'Subtitle file loaded successfully',
                        subtitleError: 'Invalid subtitle file format',
                        subtitleEnabled: 'Subtitle function enabled',
                        subtitleDisabled: 'Subtitle function disabled',
                        compositeModeChanged: 'Composite mode changed to',
                        screenshotSaved: 'Screenshot saved',
                        useHotkey: 'Please hold hotkey for burst mode',
                        enterTimeRange: 'Please enter time range',
                        batchInProgress: 'Batch screenshot in progress, please wait',
                        batchComplete: 'Batch screenshot completed, generated {count} images',
                        batchFailed: 'Batch screenshot failed: {error}',
                        configReset: 'Configuration reset, please refresh page',
                        configSaved: 'Configuration saved',
                        confirmReset: 'Are you sure you want to reset all configurations?',
                        complete: 'Complete!',

                        // 帮助文本
                        formatHelp: '💡 Supported formats: Time range (01:00-02:00), Second range (60-120), or Subtitle grouping (01:00-02:12,10 means divide subtitles into 10 groups, generate 10 composite images)',
                        placeholderTimeRange: 'e.g.: 01:00-02:00 or 60-120 or 01:00-02:12,10',

                        // 错误消息
                        noVideo: 'Video element not found',
                        noSubtitle: 'Please load subtitle file and enable subtitle function first',
                        invalidTimeFormat: 'Invalid time range format',
                        noSubtitlesInRange: 'No subtitles found in the specified time range',
                        loadedSubtitles: 'Loaded ({count} subtitles)',
                        adapter: 'Adapter: {name}',
                        unknown: 'Unknown',

                        // 浮动按钮提示
                        frameMasterLoaded: '🎬 FrameMaster Pro loaded! Press {shortcut} to open configuration panel'
                    },
                    ZH: {
                        // 面板标题
                        title: '🎬 FrameMaster Pro',
                        subtitle: 'Ultimate Video Capture Suite',

                        // 快速操作
                        quickActions: '⚡ 快速操作',
                        takeScreenshot: '📸 立即截图',
                        burstMode: '🔥 连拍模式',
                        currentHotkey: '当前快捷键: ',

                        // 基础设置
                        basicSettings: '⚙️ 基础设置',
                        screenshotHotkey: '截图快捷键',
                        apply: '应用',
                        burstInterval: '连拍间隔: ',
                        interfaceLanguage: '界面语言',

                        // 字幕设置
                        subtitleSettings: '💬 字幕设置',
                        subtitleFile: '字幕文件',
                        enableSubtitle: '启用字幕叠加',
                        fontSize: '字体大小: ',
                        maxLines: '最大行数: ',
                        status: '状态: ',
                        notLoaded: '未加载',

                        // 批量截图
                        batchScreenshot: '🎯 批量截图',
                        compositeMode: '拼接模式',
                        parallelMode: '平行模式',
                        overlapMode: '重叠模式',
                        overlapHeight: '重叠高度: ',
                        timeRange: '时间范围',
                        startBatch: '🚀 开始批量截图',
                        inProgress: '📸 正在截图...',

                        // 底部按钮
                        resetConfig: '重置配置',
                        saveConfig: '保存配置',

                        // 通知消息
                        hotkeyUpdated: '快捷键已更新为: ',
                        invalidHotkey: '请输入有效的单个字母作为快捷键',
                        languageUpdated: '语言设置已更新',
                        subtitleLoaded: '字幕文件加载成功',
                        subtitleError: '字幕文件格式错误',
                        subtitleEnabled: '字幕功能已开启',
                        subtitleDisabled: '字幕功能已关闭',
                        compositeModeChanged: '拼接模式已切换为',
                        screenshotSaved: '截图已保存',
                        useHotkey: '请按住快捷键进行连拍',
                        enterTimeRange: '请输入时间范围',
                        batchInProgress: '批量截图正在进行中，请稍候',
                        batchComplete: '批量截图完成，生成了 {count} 张图片',
                        batchFailed: '批量截图失败: {error}',
                        configReset: '配置已重置，请刷新页面',
                        configSaved: '配置已保存',
                        confirmReset: '确定要重置所有配置吗？',
                        complete: '完成!',

                        // 帮助文本
                        formatHelp: '💡 支持格式：时间范围（01:00-02:00）、秒数范围（60-120）、字幕分组（01:00-02:12,10 表示将字幕分为10组，生成10张拼接图）、或多时间点叠加（01:00,01:22,01:33 无需字幕）',
                        placeholderTimeRange: '例: 01:00-02:00 或 60-120 或 01:00-02:12,10 或 01:00,01:22,01:33',

                        // 错误消息
                        noVideo: '找不到视频元素',
                        noSubtitle: '请先加载字幕文件并开启字幕功能',
                        invalidTimeFormat: '时间范围格式错误',
                        noSubtitlesInRange: '指定时间范围内没有找到字幕',
                        loadedSubtitles: '已加载 ({count} 条字幕)',
                        adapter: '适配器: {name}',
                        unknown: '未知'
                    }
                };
            }

            setLanguage(lang) {
                this.currentLang = lang;
                GM_setValue('lang', lang);
            }

            // 翻译方法
            t(key, replacements = {}) {
                const currentLang = GM_getValue('lang', 'ZH');
                const translations = {
                    EN: {
                        title: '🎬 FrameMaster Pro',
                        subtitle: 'Ultimate Video Capture Suite',
                        adapter: 'Adapter: {name}',
                        unknown: 'Unknown',
                        quickActions: '⚡ Quick Actions',
                        takeScreenshot: '📸 Take Screenshot',
                        burstMode: '🔥 Burst Mode',
                        currentHotkey: 'Current Hotkey: ',
                        basicSettings: '⚙️ Basic Settings',
                        screenshotHotkey: 'Screenshot Hotkey',
                        apply: 'Apply',
                        interfaceLanguage: 'Interface Language',
                        subtitleSettings: '💬 Subtitle Settings',
                        subtitleFile: 'Subtitle File',
                        enableSubtitle: 'Enable Subtitle Overlay',
                        fontSize: 'Font Size: ',
                        maxLines: 'Max Lines: ',
                        status: 'Status: ',
                        notLoaded: 'Not Loaded',
                        batchScreenshot: '🎯 Batch Screenshot',
                        compositeMode: 'Composite Mode',
                        parallelMode: 'Parallel Mode',
                        overlapMode: 'Overlap Mode',
                        overlapHeight: 'Overlap Height: ',
                        timeRange: 'Time Range',
                        startBatch: '🚀 Start Batch Screenshot',
                        resetConfig: 'Reset Config',
                        saveConfig: 'Save Config',
                        screenshotSaved: 'Screenshot saved',
                        useHotkey: 'Please hold hotkey for burst mode',
                        enterTimeRange: 'Please enter time range',
                        batchInProgress: 'Batch screenshot in progress, please wait',
                        languageUpdated: 'Language setting updated',
                        showSubtitlesInComposite: 'Show subtitles in composite images',
                        burstInterval: 'Burst Interval: ',
                        formatHelp: '💡 Supported formats: Time range (01:00-02:00), Second range (60-120), Subtitle grouping (01:00-02:12,10), or Multi-time overlay (01:00,01:22,01:33 no subtitles required)',
                        placeholderTimeRange: 'e.g.: 01:00-02:00 or 60-120 or 01:00-02:12,10 or 01:00,01:22,01:33',
                        showSubtitlesInComposite: 'Show subtitles in composite images'
                    },
                    ZH: {
                        title: '🎬 FrameMaster Pro',
                        subtitle: 'Ultimate Video Capture Suite',
                        adapter: '适配器: {name}',
                        unknown: '未知',
                        quickActions: '⚡ 快速操作',
                        takeScreenshot: '📸 立即截图',
                        burstMode: '🔥 连拍模式',
                        currentHotkey: '当前快捷键: ',
                        basicSettings: '⚙️ 基础设置',
                        screenshotHotkey: '截图快捷键',
                        apply: '应用',
                        interfaceLanguage: '界面语言',
                        subtitleSettings: '💬 字幕设置',
                        subtitleFile: '字幕文件',
                        enableSubtitle: '启用字幕叠加',
                        fontSize: '字体大小: ',
                        maxLines: '最大行数: ',
                        status: '状态: ',
                        notLoaded: '未加载',
                        batchScreenshot: '🎯 批量截图',
                        compositeMode: '拼接模式',
                        parallelMode: '平行模式',
                        overlapMode: '重叠模式',
                        overlapHeight: '重叠高度: ',
                        timeRange: '时间范围',
                        startBatch: '🚀 开始批量截图',
                        resetConfig: '重置配置',
                        saveConfig: '保存配置',
                        screenshotSaved: '截图已保存',
                        useHotkey: '请按住快捷键进行连拍',
                        enterTimeRange: '请输入时间范围',
                        batchInProgress: '批量截图正在进行中，请稍候',
                        languageUpdated: '语言设置已更新',
                        showSubtitlesInComposite: '在拼接图片中显示字幕',
                        burstInterval: '连拍间隔: ',
                        formatHelp: '💡 支持格式：时间范围（01:00-02:00）、秒数范围（60-120）、字幕分组（01:00-02:12,10）、或多时间点叠加（01:00,01:22,01:33 无需字幕）',
                        placeholderTimeRange: '例: 01:00-02:00 或 60-120 或 01:00-02:12,10 或 01:00,01:22,01:33'
                    }
                };

                let text = translations[currentLang][key] || translations['ZH'][key] || key;

                // 处理占位符替换
                Object.keys(replacements).forEach(placeholder => {
                    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
                });

                return text;
            }

            // 更新界面语言
            updateInterfaceLanguage() {
                const currentLang = GM_getValue('lang', 'ZH');

                // 更新标题
                const titleElement = document.querySelector('#ytFrameMasterConfig h3');
                if (titleElement) titleElement.textContent = this.t('title');

                // 更新副标题
                const subtitleElement = document.querySelector('#ytFrameMasterConfig p');
                if (subtitleElement) subtitleElement.textContent = this.t('subtitle');

                // 更新按钮文本
                const takeScreenshotBtn = document.getElementById('takeScreenshotBtn');
                if (takeScreenshotBtn) takeScreenshotBtn.textContent = this.t('takeScreenshot');

                const burstModeBtn = document.getElementById('burstModeBtn');
                if (burstModeBtn) burstModeBtn.textContent = this.t('burstMode');

                const setHotkeyBtn = document.getElementById('setHotkey');
                if (setHotkeyBtn) setHotkeyBtn.textContent = this.t('apply');

                const batchScreenshotBtn = document.getElementById('batchScreenshot');
                if (batchScreenshotBtn && !batchScreenshotBtn.disabled) {
                    batchScreenshotBtn.textContent = this.t('startBatch');
                }

                const resetConfigBtn = document.getElementById('resetConfig');
                if (resetConfigBtn) resetConfigBtn.textContent = this.t('resetConfig');

                const saveConfigBtn = document.getElementById('saveConfig');
                if (saveConfigBtn) saveConfigBtn.textContent = this.t('saveConfig');

                // 更新帮助文本
                const helpText = document.querySelector('#ytFrameMasterConfig .helpText');
                if (helpText) helpText.textContent = this.t('formatHelp');

                // 更新placeholder
                const timeRangeInput = document.getElementById('timeRangeInput');
                if (timeRangeInput) timeRangeInput.setAttribute('placeholder', this.t('placeholderTimeRange'));

                // 更新标签文本
                this.updateLabels();
            }

            // 更新标签文本
            updateLabels() {
                const labels = {
                    '快速操作': 'quickActions',
                    '基础设置': 'basicSettings',
                    '截图快捷键': 'screenshotHotkey',
                    '连拍间隔': 'burstInterval',
                    '界面语言': 'interfaceLanguage',
                    '字幕设置': 'subtitleSettings',
                    '字幕文件': 'subtitleFile',
                    '启用字幕叠加': 'enableSubtitle',
                    '字体大小': 'fontSize',
                    '最大行数': 'maxLines',
                    '状态': 'status',
                    '批量截图': 'batchScreenshot',
                    '拼接模式': 'compositeMode',
                    '时间范围': 'timeRange'
                };

                Object.entries(labels).forEach(([chinese, key]) => {
                    const elements = document.querySelectorAll('#ytFrameMasterConfig *');
                    elements.forEach(element => {
                        if (element.textContent && element.textContent.includes(chinese)) {
                            element.textContent = element.textContent.replace(chinese, this.t(key));
                        }
                    });
                });
            }
        }

        // 创建全局语言管理器实例
        const langManager = new LanguageManager();

        /**
         * 视频截图工具 - 重构版本
         * 支持快捷键截图、批量截图、字幕叠加等功能
         */

        class VideoScreenshotTool {
            constructor() {
                this.config = {
                    defaultHotkey: 's',
                    defaultInterval: 1000,
                    minInterval: 100,
                    defaultLang: 'EN',
                };

                this.state = {
                    keyDown: false,
                    intervalId: null,
                    subtitleData: null,
                    subtitleEnabled: false,
                    screenshotKey: 's',
                    interval: 1000,
                    lang: 'EN',
                    subtitleFontSize: 48,
                    subtitleMaxLines: 2,
                    compositeMode: 'parallel'
                };

                this.init();
            }

            /**
             * 初始化工具
             */
            init() {
                this.setupEventListeners();
                this.videoManager = new VideoManager();
                this.subtitleManager = new SubtitleManager();
                this.screenshotManager = new ScreenshotManager(this.videoManager, this.subtitleManager);
                this.imageComposer = new ImageComposer(this.subtitleManager);
                // 初始化重叠高度设置
                this.imageComposer.updateOverlapHeight(GM_getValue('overlapHeight', 150));
                this.taskManager = new TaskManager(this.videoManager, this.subtitleManager, this.screenshotManager, this.imageComposer);
            }

            /**
             * 设置事件监听
             */
            setupEventListeners() {
                document.addEventListener('keydown', (e) => this.handleKeyDown(e));
                document.addEventListener('keyup', (e) => this.handleKeyUp(e));
            }

            /**
             * 处理按键按下
             */
            handleKeyDown(e) {
                if (
                    e.key.toLowerCase() === this.state.screenshotKey &&
                    !this.state.keyDown &&
                    !['INPUT', 'TEXTAREA'].includes(e.target.tagName)
                ) {
                    this.state.keyDown = true;
                    this.screenshotManager.takeScreenshot();
                    this.state.intervalId = setInterval(() => {
                        this.screenshotManager.takeScreenshot();
                    }, this.state.interval);
                }
            }

            /**
             * 处理按键抬起
             */
            handleKeyUp(e) {
                if (e.key.toLowerCase() === this.state.screenshotKey) {
                    this.state.keyDown = false;
                    clearInterval(this.state.intervalId);
                }
            }
        }

        /**
         * 视频适配器接口
         */
        class VideoAdapter {
            /**
             * 获取视频元素
             */
            getVideoElement() {
                throw new Error('getVideoElement method must be implemented');
            }

            /**
             * 获取视频标题
             */
            getVideoTitle() {
                throw new Error('getVideoTitle method must be implemented');
            }

            /**
             * 获取视频ID
             */
            getVideoID() {
                throw new Error('getVideoID method must be implemented');
            }

            /**
             * 检测当前网站是否支持
             */
            isSupported() {
                throw new Error('isSupported method must be implemented');
            }

            /**
             * 获取网站名称
             */
            getSiteName() {
                throw new Error('getSiteName method must be implemented');
            }

            /**
             * 清理标题中的非法字符
             */
            sanitizeTitle(title) {
                return title.replace(/[\\/:*?"<>|]/g, '').trim();
            }
        }

        /**
         * YouTube视频适配器
         */
        class YouTubeAdapter extends VideoAdapter {
            getVideoElement() {
                const videos = Array.from(document.querySelectorAll('video'));
                if (window.location.href.includes('/shorts/')) {
                    return videos.find(v => v.offsetParent !== null);
                }
                return videos[0] || null;
            }

            getVideoTitle() {
                if (window.location.href.includes('/shorts/')) {
                    let h2 = document.querySelector('ytd-reel-video-renderer[is-active] h2');
                    if (h2 && h2.textContent.trim()) return this.sanitizeTitle(h2.textContent.trim());

                    h2 = document.querySelector('ytd-reel-video-renderer h2');
                    if (h2 && h2.textContent.trim()) return this.sanitizeTitle(h2.textContent.trim());

                    let meta = document.querySelector('meta[name="title"]');
                    if (meta) return this.sanitizeTitle(meta.getAttribute('content'));

                    return this.sanitizeTitle(document.title || 'unknown');
                }

                if (window.location.href.includes('/live/')) {
                    let title = document.querySelector('meta[name="title"]')?.getAttribute('content')
                        || document.title
                        || 'unknown';
                    return this.sanitizeTitle(title);
                }

                let title = document.querySelector('h1.ytd-watch-metadata')?.textContent
                    || document.querySelector('h1.title')?.innerText
                    || document.querySelector('h1')?.innerText
                    || document.querySelector('meta[name="title"]')?.getAttribute('content')
                    || document.title
                    || 'unknown';
                return this.sanitizeTitle(title);
            }

            getVideoID() {
                let match = window.location.href.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
                if (match) return match[1];

                match = window.location.href.match(/\/live\/([a-zA-Z0-9_-]+)/);
                if (match) return match[1];

                match = window.location.href.match(/[?&]v=([^&]+)/);
                return match ? match[1] : 'unknown';
            }

            isSupported() {
                return window.location.hostname.includes('youtube.com') ||
                    window.location.hostname.includes('youtu.be');
            }

            getSiteName() {
                return 'YouTube';
            }
        }

        /**
         * 哔哩哔哩视频适配器
         */
        class BilibiliAdapter extends VideoAdapter {
            getVideoElement() {
                // 优先使用哔哩哔哩特定的选择器
                return document.querySelector('.bpx-player-video-wrap>video') ||
                    document.querySelector('video');
            }

            getVideoTitle() {
                const titleElement = document.querySelector('.video-title') ||
                    document.querySelector('.media-title') ||
                    document.querySelector('h1[title]') ||
                    document.querySelector('.video-info-title');
                return titleElement ?
                    this.sanitizeTitle(titleElement.textContent || titleElement.title) :
                    this.sanitizeTitle(document.title || 'Bilibili_Video');
            }

            getVideoID() {
                // 从URL中提取BV号或av号
                const url = window.location.href;
                const bvMatch = url.match(/\/video\/(BV[a-zA-Z0-9]+)/);
                if (bvMatch) return bvMatch[1];

                const avMatch = url.match(/\/video\/av(\d+)/);
                if (avMatch) return 'av' + avMatch[1];

                return 'unknown';
            }

            isSupported() {
                return window.location.hostname.includes('bilibili.com');
            }

            getSiteName() {
                return 'Bilibili';
            }
        }

        /**
         * 通用视频适配器（兜底方案）
         */
        class GenericAdapter extends VideoAdapter {
            getVideoElement() {
                return document.querySelector('video');
            }

            getVideoTitle() {
                const title = document.title || 'Video';
                return this.sanitizeTitle(title);
            }

            getVideoID() {
                return Date.now().toString();
            }

            isSupported() {
                return document.querySelector('video') !== null;
            }

            getSiteName() {
                return window.location.hostname;
            }
        }

        /**
         * 视频适配器工厂
         */
        class VideoAdapterFactory {
            static adapters = [
                new YouTubeAdapter(),
                new BilibiliAdapter(),
                new GenericAdapter() // 兜底适配器，必须放在最后
            ];

            /**
             * 获取适合当前网站的适配器
             */
            static getAdapter() {
                for (const adapter of this.adapters) {
                    if (adapter.isSupported()) {
                        console.log(`使用 ${adapter.getSiteName()} 适配器`);
                        return adapter;
                    }
                }
                throw new Error('No suitable video adapter found');
            }

            /**
             * 添加自定义适配器
             */
            static addAdapter(adapter) {
                if (!(adapter instanceof VideoAdapter)) {
                    throw new Error('Adapter must extend VideoAdapter');
                }
                // 插入到通用适配器之前
                this.adapters.splice(-1, 0, adapter);
            }
        }

        /**
         * 视频管理器
         */
        class VideoManager {
            constructor() {
                this.adapter = VideoAdapterFactory.getAdapter();
            }

            /**
             * 获取视频元素
             */
            getVideoElement() {
                return this.adapter.getVideoElement();
            }

            /**
             * 获取视频ID
             */
            getVideoID() {
                return this.adapter.getVideoID();
            }

            /**
             * 获取视频标题
             */
            getVideoTitle() {
                return this.adapter.getVideoTitle();
            }

            /**
             * 获取网站名称
             */
            getSiteName() {
                return this.adapter.getSiteName();
            }

            /**
             * 清理标题中的非法字符
             */
            sanitizeTitle(title) {
                return title.replace(/[\\/:*?"<>|]/g, '').trim();
            }

            /**
             * 跳转到指定时间点
             */
            goToTime(video, targetTime) {
                if (!video) return false;

                if (targetTime < 0 || targetTime > video.duration) {
                    console.error(`Target time ${targetTime}s is out of video range (0-${video.duration}s)`);
                    return false;
                }

                video.currentTime = targetTime;
                return true;
            }

            /**
             * 格式化时间
             */
            formatTime(seconds) {
                const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
                const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
                const s = String(Math.floor(seconds % 60)).padStart(2, '0');
                const ms = String(Math.floor((seconds % 1) * 1000)).padStart(3, '0');
                return { h, m, s, ms };
            }
        }

        /**
         * 字幕适配器接口
         */
        class SubtitleAdapter {
            isFormatSupported(data) {
                throw new Error('isFormatSupported method must be implemented');
            }

            parseSubtitleData(data) {
                throw new Error('parseSubtitleData method must be implemented');
            }

            findSubtitleAtTime(data, timeInSeconds) {
                throw new Error('findSubtitleAtTime method must be implemented');
            }

            findSubtitlesInRange(data, startTime, endTime) {
                throw new Error('findSubtitlesInRange method must be implemented');
            }

            getSubtitleCount(data) {
                throw new Error('getSubtitleCount method must be implemented');
            }

            getFormatName() {
                throw new Error('getFormatName method must be implemented');
            }
        }

        /**
         * YouTube字幕适配器（原有格式）
         */
        class YouTubeSubtitleAdapter extends SubtitleAdapter {
            isFormatSupported(data) {
                return data && data.events && Array.isArray(data.events);
            }

            parseSubtitleData(data) {
                if (!this.isFormatSupported(data)) {
                    throw new Error('Unsupported YouTube subtitle format');
                }
                return data;
            }

            findSubtitleAtTime(data, timeInSeconds) {
                if (!data.events) return null;

                const timeInMs = timeInSeconds * 1000;

                for (const event of data.events) {
                    const startTime = event.tStartMs;
                    const endTime = event.tStartMs + event.dDurationMs;

                    if (timeInMs >= startTime && timeInMs <= endTime) {
                        let text = '';
                        if (event.segs) {
                            text = event.segs.map(seg => seg.utf8 || '').join('');
                        }
                        return text.trim();
                    }
                }
                return null;
            }

            findSubtitlesInRange(data, startTime, endTime) {
                if (!data.events) return [];

                const startMs = startTime * 1000;
                const endMs = endTime * 1000;
                const subtitlesInRange = [];

                for (const event of data.events) {
                    const eventStartTime = event.tStartMs;
                    const eventEndTime = event.tStartMs + event.dDurationMs;

                    if (eventStartTime < endMs && eventEndTime > startMs) {
                        let text = '';
                        if (event.segs) {
                            text = event.segs.map(seg => seg.utf8 || '').join('');
                        }

                        const trimmedText = text.trim();
                        if (trimmedText) {
                            const midTime = (eventStartTime + eventEndTime) / 2 / 1000;
                            subtitlesInRange.push({
                                startTime: eventStartTime / 1000,
                                endTime: eventEndTime / 1000,
                                midTime: midTime,
                                text: trimmedText
                            });
                        }
                    }
                }

                return subtitlesInRange.sort((a, b) => a.startTime - b.startTime);
            }

            getSubtitleCount(data) {
                return data.events ? data.events.length : 0;
            }

            getFormatName() {
                return 'YouTube';
            }
        }

        /**
         * 哔哩哔哩字幕适配器
         */
        class BilibiliSubtitleAdapter extends SubtitleAdapter {
            isFormatSupported(data) {
                return data && data.body && Array.isArray(data.body) && 
                       data.type === 'AIsubtitle';
            }

            parseSubtitleData(data) {
                if (!this.isFormatSupported(data)) {
                    throw new Error('Unsupported Bilibili subtitle format');
                }
                return data;
            }

            findSubtitleAtTime(data, timeInSeconds) {
                if (!data.body) return null;

                for (const item of data.body) {
                    if (!item.content) continue;

                    const startTime = item.from;
                    const endTime = item.to;

                    if (timeInSeconds >= startTime && timeInSeconds <= endTime) {
                        return item.content.trim();
                    }
                }
                return null;
            }

            findSubtitlesInRange(data, startTime, endTime) {
                if (!data.body) return [];

                const subtitlesInRange = [];

                for (const item of data.body) {
                    if (!item.content) continue;

                    const itemStartTime = item.from;
                    const itemEndTime = item.to;

                    if (itemStartTime < endTime && itemEndTime > startTime) {
                        const trimmedText = item.content.trim();
                        if (trimmedText) {
                            const midTime = (itemStartTime + itemEndTime) / 2;
                            subtitlesInRange.push({
                                startTime: itemStartTime,
                                endTime: itemEndTime,
                                midTime: midTime,
                                text: trimmedText
                            });
                        }
                    }
                } 

                return subtitlesInRange.sort((a, b) => a.startTime - b.startTime);
            }

            getSubtitleCount(data) {
                return data.body ? data.body.filter(item => item.content).length : 0;
            }

            getFormatName() {
                return 'Bilibili';
            }
        }

        /**
         * 字幕适配器工厂
         */
        class SubtitleAdapterFactory {
            static adapters = [
                new BilibiliSubtitleAdapter(),
                new YouTubeSubtitleAdapter()
            ];

            static getAdapter(data, preferredSite = null) {
                console.log('SubtitleAdapterFactory.getAdapter called with:', {
                    hasData: !!data,
                    preferredSite: preferredSite,
                    dataType: data?.type,
                    hasBody: !!data?.body,
                    hasEvents: !!data?.events
                });
                
                // 如果指定了首选网站，先尝试对应的适配器
                if (preferredSite) {
                    const preferredAdapter = this.adapters.find(adapter => {
                        const formatName = adapter.getFormatName().toLowerCase();
                        const matches = formatName.includes(preferredSite.toLowerCase()) && adapter.isFormatSupported(data);
                        console.log(`检查适配器 ${adapter.getFormatName()}: 名称匹配=${formatName.includes(preferredSite.toLowerCase())}, 格式支持=${adapter.isFormatSupported(data)}, 总体匹配=${matches}`);
                        return matches;
                    });
                    
                    if (preferredAdapter) {
                        console.log(`优先使用 ${preferredAdapter.getFormatName()} 字幕适配器（基于网站：${preferredSite}）`);
                        return preferredAdapter;
                    }
                }
                
                // 回退到常规检测
                for (const adapter of this.adapters) {
                    if (adapter.isFormatSupported(data)) {
                        console.log(`使用 ${adapter.getFormatName()} 字幕适配器`);
                        return adapter;
                    }
                }
                console.error('没有找到支持的字幕适配器');
                throw new Error('Unsupported subtitle format');
            }

            static addAdapter(adapter) {
                if (!(adapter instanceof SubtitleAdapter)) {
                    throw new Error('Adapter must extend SubtitleAdapter');
                }
                this.adapters.unshift(adapter);
            }
        }

        /**
         * 字幕管理器
         */
        class SubtitleManager {
            constructor() {
                this.subtitleData = null;
                this.subtitleEnabled = false;
                this.fontSize = 48;
                this.maxLines = 2;
                this.adapter = null; // 当前使用的字幕适配器
                this.showSubtitlesInComposite = GM_getValue('showSubtitlesInComposite', true); // 新增：控制是否在拼接图片中显示字幕
                this.currentSite = this.detectCurrentSite(); // 检测当前网站
                console.log('字幕管理器初始化完成, 当前网站:', this.currentSite);
            }

            /**
             * 检测当前网站
             */
            detectCurrentSite() {
                const hostname = window.location.hostname;
                let site = 'unknown';
                
                if (hostname.includes('bilibili.com')) {
                    site = 'bilibili';
                } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
                    site = 'youtube';
                }
                
                console.log(`检测到当前网站: ${hostname} -> ${site}`);
                return site;
            }

            /**
             * 设置是否在拼接图片中显示字幕
             */
            setShowSubtitlesInComposite(show) {
                this.showSubtitlesInComposite = show;
                GM_setValue('showSubtitlesInComposite', show);
            }

            /**
             * 获取是否在拼接图片中显示字幕
             */
            getShowSubtitlesInComposite() {
                return GM_getValue('showSubtitlesInComposite', true);
            }

            /**
             * 加载字幕文件
             */
            loadSubtitleFile() {
                return new Promise((resolve, reject) => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.txt,.json';
                    input.onchange = (event) => {
                        const file = event.target.files[0];
                        if (!file) {
                            reject(new Error('No file selected'));
                            return;
                        }

                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                const rawData = JSON.parse(e.target.result);
                                
                                // 使用适配器工厂获取合适的适配器，优先使用当前网站的适配器
                                this.adapter = SubtitleAdapterFactory.getAdapter(rawData, this.currentSite);
                                this.subtitleData = this.adapter.parseSubtitleData(rawData);
                                this.subtitleEnabled = true;
                                
                                const count = this.adapter.getSubtitleCount(this.subtitleData);
                                console.log(`${this.adapter.getFormatName()} 字幕加载成功:`, count, '条字幕');
                                resolve(this.subtitleData);
                            } catch (error) {
                                console.error('字幕文件解析错误:', error);
                                reject(error);
                            }
                        };
                        reader.readAsText(file);
                    };
                    input.click();
                });
            }

            /**
             * 检查字幕文本是否为空或只包含无意义字符
             */
            isSubtitleEmpty(text) {
                if (!text) return true;

                // 清理文本：移除括号内容、换行符、多余空格
                const cleanText = text
                    .replace(/\([^)]*\)/g, '')  // 移除括号内容
                    .replace(/\[[^\]]*\]/g, '') // 秘除方括号内容
                    .replace(/\{[^}]*\}/g, '')  // 移除大括号内容
                    .replace(/\n+/g, ' ')       // 换行符替换为空格
                    .replace(/\s+/g, ' ')       // 多个空格替换为单个空格
                    .trim();

                // 检查是否为空或只包含标点符号
                return cleanText.length === 0 || /^[.,!?;:\-_\s]*$/.test(cleanText);
            }

            /**
             * 查找指定时间的字幕
             */
            findSubtitleAtTime(timeInSeconds) {
                if (!this.subtitleData || !this.subtitleEnabled || !this.adapter) {
                    return null;
                }

                const subtitleText = this.adapter.findSubtitleAtTime(this.subtitleData, timeInSeconds);
                
                // 过滤空字幕
                if (subtitleText && !this.isSubtitleEmpty(subtitleText)) {
                    return subtitleText;
                }

                return null;
            }

            /**
             * 在时间范围内查找所有字幕
             */
            findSubtitlesInRange(startTime, endTime) {
                if (!this.subtitleData || !this.adapter) {
                    return [];
                }

                return this.adapter.findSubtitlesInRange(this.subtitleData, startTime, endTime);
            }

            /**
             * 在画布上绘制字幕
             */
            drawSubtitleOnCanvas(canvas, text) {
                if (!text) return;

                const ctx = canvas.getContext('2d');
                ctx.save();

                // 清理文本
                const cleanText = text.replace(/\([^)]*\)/g, '').replace(/\n+/g, ' ').trim();
                const words = cleanText.split(/\s+/).filter(word => word.trim());

                if (words.length === 0) {
                    ctx.restore();
                    return;
                }

                // 字体设置
                const fontSize = Math.max(36, Math.min(96, this.fontSize));
                ctx.font = `bold ${fontSize}px "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif`;

                // 样式计算
                const lineHeight = fontSize * 1.3;
                const padding = Math.max(12, fontSize * 0.4);
                const margin = Math.max(25, fontSize * 0.8);
                const maxWidth = canvas.width * 0.85;

                // 分行处理
                const lines = this.splitTextToLines(words, ctx, maxWidth, this.maxLines);

                if (lines.length === 0) {
                    ctx.restore();
                    return;
                }

                // 绘制背景
                this.drawSubtitleBackground(ctx, canvas, lines, fontSize, lineHeight, padding, margin);

                // 绘制文本
                this.drawSubtitleText(ctx, canvas, lines, fontSize, lineHeight, padding, margin);

                ctx.restore();
            }

            /**
             * 将文本分行
             */
            splitTextToLines(words, ctx, maxWidth, maxLines) {
                const lines = [];
                let currentLine = '';

                for (const word of words) {
                    const testLine = currentLine ? `${currentLine} ${word}` : word;
                    const testWidth = ctx.measureText(testLine).width;

                    if (testWidth <= maxWidth) {
                        currentLine = testLine;
                    } else {
                        if (currentLine) {
                            lines.push(currentLine);
                            currentLine = word;
                        } else {
                            lines.push(word);
                        }

                        if (lines.length >= maxLines) {
                            break;
                        }
                    }
                }

                if (currentLine && lines.length < maxLines) {
                    lines.push(currentLine);
                }

                return lines;
            }

            /**
             * 绘制字幕背景
             */
            drawSubtitleBackground(ctx, canvas, lines, fontSize, lineHeight, padding, margin) {
                const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
                const totalHeight = lines.length * lineHeight + padding * 2;
                const bgWidth = maxLineWidth + padding * 2;
                const bgHeight = totalHeight;

                const bgX = (canvas.width - bgWidth) / 2;
                const bgY = canvas.height - bgHeight - margin;

                // 重置绘制状态
                ctx.globalAlpha = 1.0;
                ctx.globalCompositeOperation = 'source-over';
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                // 绘制背景
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.beginPath();
                ctx.rect(bgX, bgY, bgWidth, bgHeight);
                ctx.fill();

                // 绘制边框
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.rect(bgX, bgY, bgWidth, bgHeight);
                ctx.stroke();
            }

            /**
             * 绘制字幕文本
             */
            drawSubtitleText(ctx, canvas, lines, fontSize, lineHeight, padding, margin) {
                const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
                const totalHeight = lines.length * lineHeight + padding * 2;
                const bgWidth = maxLineWidth + padding * 2;
                const bgHeight = totalHeight;

                const bgX = (canvas.width - bgWidth) / 2;
                const bgY = canvas.height - bgHeight - margin;

                lines.forEach((line, index) => {
                    const textWidth = ctx.measureText(line).width;
                    const x = (canvas.width - textWidth) / 2;
                    const y = bgY + padding + (index + 1) * lineHeight - lineHeight * 0.25;

                    // 绘制文本描边
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.lineWidth = Math.max(2, fontSize * 0.08);
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'alphabetic';
                    ctx.strokeText(line, x, y);

                    // 绘制文本
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(line, x, y);
                });
            }
        }

        /**
         * 截图管理器
         */
        class ScreenshotManager {
            constructor(videoManager, subtitleManager) {
                this.videoManager = videoManager;
                this.subtitleManager = subtitleManager;
            }

            /**
             * 截取单张图片
             */
            takeScreenshot() {
                const video = this.videoManager.getVideoElement();
                if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
                    console.warn('Video not available or invalid dimensions');
                    return;
                }

                if (video.readyState < 2) {
                    console.warn(`Video not ready for capture (readyState: ${video.readyState})`);
                    return;
                }

                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // 检查图片亮度
                const averageBrightness = this.checkImageBrightness(canvas);
                if (averageBrightness < 10) {
                    console.warn(`Screenshot appears to be mostly black (brightness: ${averageBrightness.toFixed(2)})`);
                }

                // 添加字幕
                if (this.subtitleManager.subtitleEnabled && this.subtitleManager.subtitleData) {
                    const subtitleText = this.subtitleManager.findSubtitleAtTime(video.currentTime);
                    if (subtitleText) {
                        this.subtitleManager.drawSubtitleOnCanvas(canvas, subtitleText);
                    }
                }

                this.downloadScreenshot(canvas, video.currentTime);
            }

            /**
             * 检查图片亮度
             */
            checkImageBrightness(canvas) {
                const ctx = canvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                let totalBrightness = 0;
                let samplePoints = 0;

                for (let i = 0; i < pixels.length; i += 40) {
                    if (i + 2 < pixels.length) {
                        const r = pixels[i];
                        const g = pixels[i + 1];
                        const b = pixels[i + 2];
                        const brightness = (r + g + b) / 3;
                        totalBrightness += brightness;
                        samplePoints++;
                    }
                }

                return totalBrightness / samplePoints;
            }

            /**
             * 下载截图
             */
            downloadScreenshot(canvas, currentTime) {
                const link = document.createElement('a');
                const timeObj = this.videoManager.formatTime(currentTime);
                const title = this.videoManager.getVideoTitle();
                const id = this.videoManager.getVideoID();
                const resolution = `${canvas.width}x${canvas.height}`;
                const subtitleSuffix = (this.subtitleManager.subtitleEnabled && this.subtitleManager.subtitleData) ? '_sub' : '';

                link.download = `${title}_${timeObj.h}_${timeObj.m}_${timeObj.s}_${timeObj.ms}_${id}_${resolution}${subtitleSuffix}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }

            /**
             * 在指定时间点截图
             */
            captureFrameAtTime(video, targetTime) {
                return new Promise((resolve) => {
                    const originalTime = video.currentTime;

                    if (targetTime < 0 || targetTime > video.duration) {
                        console.error(`Target time ${targetTime}s is out of video range`);
                        resolve(null);
                        return;
                    }

                    let seekAttempts = 0;
                    const maxSeekAttempts = 3;

                    const attemptCapture = () => {
                        const onSeeked = () => {
                            video.removeEventListener('seeked', onSeeked);
                            video.removeEventListener('error', onSeekedError);

                            const delay = 200 + (seekAttempts * 100);

                            setTimeout(() => {
                                try {
                                    if (video.readyState < 2) {
                                        console.warn(`Video not ready (readyState: ${video.readyState}), retrying...`);
                                        if (seekAttempts < maxSeekAttempts - 1) {
                                            seekAttempts++;
                                            setTimeout(attemptCapture, 300);
                                            return;
                                        }
                                    }

                                    const canvas = document.createElement('canvas');
                                    canvas.width = video.videoWidth;
                                    canvas.height = video.videoHeight;

                                    if (canvas.width === 0 || canvas.height === 0) {
                                        console.error(`Invalid video dimensions: ${canvas.width}x${canvas.height}`);
                                        video.currentTime = originalTime;
                                        resolve(null);
                                        return;
                                    }

                                    const ctx = canvas.getContext('2d');
                                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                                    const averageBrightness = this.checkImageBrightness(canvas);

                                    if (averageBrightness < 10 && seekAttempts < maxSeekAttempts - 1) {
                                        console.warn(`Frame appears to be mostly black, retrying...`);
                                        seekAttempts++;
                                        setTimeout(attemptCapture, 500);
                                        return;
                                    }

                                    console.log(`Captured frame: ${canvas.width}x${canvas.height} at time ${video.currentTime}s`);
                                    video.currentTime = originalTime;
                                    resolve(canvas);
                                } catch (error) {
                                    console.error('Error capturing frame:', error);
                                    video.currentTime = originalTime;
                                    resolve(null);
                                }
                            }, delay);
                        };

                        const onSeekedError = () => {
                            console.error('Seek operation failed');
                            video.removeEventListener('seeked', onSeeked);
                            video.removeEventListener('error', onSeekedError);
                            if (seekAttempts < maxSeekAttempts - 1) {
                                seekAttempts++;
                                setTimeout(attemptCapture, 500);
                            } else {
                                resolve(null);
                            }
                        };

                        video.addEventListener('seeked', onSeeked);
                        video.addEventListener('error', onSeekedError);

                        try {
                            video.currentTime = targetTime;
                        } catch (error) {
                            console.error('Error setting video time:', error);
                            video.removeEventListener('seeked', onSeeked);
                            video.removeEventListener('error', onSeekedError);
                            if (seekAttempts < maxSeekAttempts - 1) {
                                seekAttempts++;
                                setTimeout(attemptCapture, 500);
                            } else {
                                resolve(null);
                            }
                        }
                    };

                    attemptCapture();
                });
            }
        }

        /**
         * 图片合成器
         */
        class ImageComposer {
            constructor(subtitleManager) {
                this.subtitleManager = subtitleManager;
                this.overlapHeight = GM_getValue('overlapHeight', 150);
            }

            /**
             * 更新重叠高度设置
             */
            updateOverlapHeight(height) {
                this.overlapHeight = height;
            }

            /**
             * 创建合成图片
             */
            createCompositeImage(screenshots, subtitles, mode = 'parallel') {
                if (screenshots.length === 0) return null;

                const frameWidth = screenshots[0].width;
                const frameHeight = screenshots[0].height;

                let totalHeight;
                if (mode === 'overlap') {
                    // 使用可配置的重叠高度
                    totalHeight = frameHeight + (screenshots.length - 1) * this.overlapHeight;
                } else {
                    const spacing = 10;
                    totalHeight = screenshots.length * frameHeight + (screenshots.length - 1) * spacing;
                }

                const compositeCanvas = document.createElement('canvas');
                compositeCanvas.width = frameWidth;
                compositeCanvas.height = totalHeight;
                const ctx = compositeCanvas.getContext('2d');

                // 初始化画布
                ctx.save();
                ctx.globalAlpha = 1.0;
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, frameWidth, totalHeight);

                if (mode === 'overlap') {
                    this.drawOverlapMode(ctx, compositeCanvas, screenshots, subtitles, frameWidth, frameHeight);
                } else {
                    this.drawParallelMode(ctx, compositeCanvas, screenshots, subtitles, frameWidth, frameHeight);
                }

                ctx.restore();
                return compositeCanvas;
            }

            /**
             * 重叠模式绘制
             */
            drawOverlapMode(ctx, compositeCanvas, screenshots, subtitles, frameWidth, frameHeight) {
                // 使用可配置的重叠高度
                const subtitleHeight = this.overlapHeight;
                let currentY = 0;

                screenshots.forEach((canvas, index) => {
                    if (!canvas || canvas.width === 0 || canvas.height === 0) return;

                    if (index === 0) {
                        // 第一张图片完整绘制
                        ctx.drawImage(canvas, 0, currentY, frameWidth, frameHeight);

                        if (subtitles[index] && subtitles[index].text && this.subtitleManager.showSubtitlesInComposite) {
                            this.drawSubtitleOnSpecificArea(compositeCanvas, subtitles[index].text, currentY, frameHeight);
                        }

                        currentY += frameHeight;
                    } else {
                        // 后续图片只绘制字幕区域
                        const subtitleRegionHeight = subtitleHeight;
                        const sourceY = frameHeight - subtitleRegionHeight;

                        ctx.drawImage(canvas, 0, sourceY, frameWidth, subtitleRegionHeight, 0, currentY, frameWidth, subtitleRegionHeight);

                        if (subtitles[index] && subtitles[index].text && this.subtitleManager.showSubtitlesInComposite) {
                            this.drawSubtitleOnSpecificArea(compositeCanvas, subtitles[index].text, currentY, subtitleRegionHeight);
                        }

                        currentY += subtitleRegionHeight;
                    }
                });
            }

            /**
             * 并行模式绘制
             */
            drawParallelMode(ctx, compositeCanvas, screenshots, subtitles, frameWidth, frameHeight) {
                const spacing = 10;
                let currentY = 0;

                screenshots.forEach((canvas, index) => {
                    if (!canvas || canvas.width === 0 || canvas.height === 0) return;

                    ctx.drawImage(canvas, 0, currentY, frameWidth, frameHeight);

                    if (subtitles[index] && subtitles[index].text && this.subtitleManager.showSubtitlesInComposite) {
                        this.drawSubtitleOnSpecificArea(compositeCanvas, subtitles[index].text, currentY, frameHeight);
                    }

                    currentY += frameHeight + spacing;
                });
            }

            /**
             * 在特定区域绘制字幕
             */
            drawSubtitleOnSpecificArea(canvas, text, yOffset, areaHeight) {
                if (!text) return;

                const ctx = canvas.getContext('2d');
                ctx.save();

                // 文本处理
                const cleanText = text.replace(/\([^)]*\)/g, '').replace(/\n+/g, ' ').trim();
                const words = cleanText.split(/\s+/).filter(word => word.trim());

                if (words.length === 0) {
                    ctx.restore();
                    return;
                }

                // 字体设置
                const fontSize = Math.max(36, Math.min(96, this.subtitleManager.fontSize));
                ctx.font = `bold ${fontSize}px "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif`;

                // 样式计算
                const lineHeight = fontSize * 1.3;
                const padding = Math.max(10, fontSize * 0.35);
                const margin = Math.max(20, fontSize * 0.7);
                const maxWidth = canvas.width * 0.85;

                // 分行
                const lines = this.subtitleManager.splitTextToLines(words, ctx, maxWidth, this.subtitleManager.maxLines);

                if (lines.length === 0) {
                    ctx.restore();
                    return;
                }

                // 计算位置
                const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
                const totalHeight = lines.length * lineHeight + padding * 2;
                const bgWidth = maxLineWidth + padding * 2;
                const bgHeight = totalHeight;

                const bgX = (canvas.width - bgWidth) / 2;
                const bgY = yOffset + areaHeight - bgHeight - margin;

                // 绘制背景
                ctx.globalAlpha = 1.0;
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.beginPath();
                ctx.rect(bgX, bgY, bgWidth, bgHeight);
                ctx.fill();

                // 绘制文本
                lines.forEach((line, index) => {
                    const textWidth = ctx.measureText(line).width;
                    const x = (canvas.width - textWidth) / 2;
                    const y = bgY + padding + (index + 1) * lineHeight - lineHeight * 0.25;

                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.lineWidth = Math.max(2, fontSize * 0.08);
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'alphabetic';
                    ctx.strokeText(line, x, y);

                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(line, x, y);
                });

                ctx.restore();
            }
        }

        /**
         * 任务管理器
         */
        class TaskManager {
            constructor(videoManager, subtitleManager, screenshotManager, imageComposer) {
                this.videoManager = videoManager;
                this.subtitleManager = subtitleManager;
                this.screenshotManager = screenshotManager;
                this.imageComposer = imageComposer;
            }

            /**
             * 解析时间输入
             */
            parseTimeInput(timeString) {
                const timeMatch = timeString.match(/^(\d{1,2}):(\d{1,3})$/);
                if (timeMatch) {
                    return parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
                }

                const secondsMatch = timeString.match(/^(\d+(?:\.\d+)?)$/);
                if (secondsMatch) {
                    return parseFloat(secondsMatch[1]);
                }

                return null;
            }

            /**
             * 解析时间范围
             */
            parseTimeRanges(input) {
                if (!input) return null;

                // 检查是否是新的按字幕分组格式: "01:00-02:12,10"
                const subtitleGroupMatch = input.match(/^(.+),\s*(\d+)$/);
                if (subtitleGroupMatch) {
                    const rangeInput = subtitleGroupMatch[1];
                    const groupCount = parseInt(subtitleGroupMatch[2]);

                    const rangeParts = rangeInput.split('-');
                    if (rangeParts.length === 2) {
                        const startTime = this.parseTimeInput(rangeParts[0]);
                        const endTime = this.parseTimeInput(rangeParts[1]);

                        if (startTime !== null && endTime !== null && startTime < endTime) {
                            // 返回单个范围，但标记为需要按字幕分组
                            return [{
                                startTime: startTime,
                                endTime: endTime,
                                isSubtitleGroupBased: true,
                                targetGroupCount: groupCount,
                                isDivided: false
                            }];
                        }
                    }
                }

                // 检查是否是多时间点叠加格式: "01:00,01:22,01:33"
                if (input.includes(',') && !input.includes('-')) {
                    const timePoints = input.split(',').map(t => t.trim());
                    const parsedTimes = [];

                    for (const timePoint of timePoints) {
                        const parsedTime = this.parseTimeInput(timePoint);
                        if (parsedTime === null) return null;
                        parsedTimes.push(parsedTime);
                    }

                    return [{
                        timePoints: parsedTimes,
                        isMultiTimeOverlay: true,
                        isDivided: false
                    }];
                }

                const timePoints = input.split('-');
                if (timePoints.length < 2) return null;

                const parsedTimes = [];
                for (const timePoint of timePoints) {
                    const parsedTime = this.parseTimeInput(timePoint.trim());
                    if (parsedTime === null) return null;
                    parsedTimes.push(parsedTime);
                }

                for (let i = 1; i < parsedTimes.length; i++) {
                    if (parsedTimes[i] <= parsedTimes[i - 1]) {
                        return null;
                    }
                }

                const ranges = [];
                for (let i = 0; i < parsedTimes.length - 1; i++) {
                    ranges.push({
                        startTime: parsedTimes[i],
                        endTime: parsedTimes[i + 1],
                        isDivided: false
                    });
                }

                return ranges;
            }

            /**
             * 批量截图
             */
            async batchScreenshot(timeRangeInput, compositeMode = 'parallel') {
                const timeRanges = this.parseTimeRanges(timeRangeInput.trim());
                if (!timeRanges) {
                    throw new Error('时间范围格式错误');
                }

                const video = this.videoManager.getVideoElement();
                if (!video) {
                    throw new Error('找不到视频元素');
                }

                // 处理多时间点叠加模式
                if (timeRanges[0].isMultiTimeOverlay) {
                    return await this.handleMultiTimeOverlay(timeRanges[0], compositeMode);
                }

                // 处理字幕分组模式
                if (timeRanges[0].isSubtitleGroupBased) {
                    if (!this.subtitleManager.subtitleEnabled || !this.subtitleManager.subtitleData) {
                        throw new Error('请先加载字幕文件并开启字幕功能');
                    }
                    return await this.handleSubtitleGroupMode(timeRanges[0], compositeMode);
                }

                // 原有的逻辑处理
                return await this.handleRegularMode(timeRanges, compositeMode);
            }

            /**
             * 处理多时间点叠加模式
             */
            async handleMultiTimeOverlay(timeRange, compositeMode) {
                const video = this.videoManager.getVideoElement();
                const screenshots = [];
                const subtitles = [];

                let completedScreenshots = 0;
                const totalScreenshots = timeRange.timePoints.length;

                for (const timePoint of timeRange.timePoints) {
                    // 更新进度
                    completedScreenshots++;
                    const progress = Math.round((completedScreenshots / totalScreenshots) * 100);

                    if (typeof this.onProgress === 'function') {
                        this.onProgress(progress, completedScreenshots, totalScreenshots);
                    }

                    const canvas = await this.screenshotManager.captureFrameAtTime(video, timePoint);
                    if (canvas && canvas.width > 0 && canvas.height > 0) {
                        screenshots.push(canvas);
                        // 不需要字幕，所以添加空字幕
                        subtitles.push({ text: '', time: timePoint });
                    }

                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                if (screenshots.length === 0) {
                    throw new Error('没有成功截取到任何图片');
                }

                // 创建合成图片
                const compositeCanvas = this.imageComposer.createCompositeImage(screenshots, subtitles, compositeMode);

                if (compositeCanvas) {
                    const title = this.videoManager.getVideoTitle();
                    const id = this.videoManager.getVideoID();
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

                    const link = document.createElement('a');
                    link.download = `${title}_multi_overlay_${screenshots.length}pts_${id}_${timestamp}.png`;
                    link.href = compositeCanvas.toDataURL('image/png');
                    link.click();
                }

                return 1;
            }

            /**
             * 处理字幕分组模式
             */
            async handleSubtitleGroupMode(timeRange, compositeMode) {
                const { startTime, endTime, targetGroupCount } = timeRange;
                const allSubtitlesInRange = this.subtitleManager.findSubtitlesInRange(startTime, endTime);

                if (allSubtitlesInRange.length === 0) {
                    throw new Error('指定时间范围内没有找到字幕');
                }

                // 计算每组的字幕数量
                const subtitlesPerGroup = Math.max(1, Math.floor(allSubtitlesInRange.length / targetGroupCount));
                const remainder = allSubtitlesInRange.length % targetGroupCount;

                // 将字幕分组
                const groups = [];
                let currentIndex = 0;

                for (let groupIndex = 0; groupIndex < targetGroupCount; groupIndex++) {
                    const currentGroupSize = subtitlesPerGroup + (groupIndex < remainder ? 1 : 0);

                    if (currentIndex >= allSubtitlesInRange.length) {
                        break;
                    }

                    const groupSubtitles = allSubtitlesInRange.slice(currentIndex, currentIndex + currentGroupSize);

                    if (groupSubtitles.length > 0) {
                        groups.push({
                            groupIndex,
                            subtitles: groupSubtitles
                        });
                    }

                    currentIndex += currentGroupSize;
                }

                // 处理每个组
                const video = this.videoManager.getVideoElement();
                let completedGroups = 0;

                for (const group of groups) {
                    const screenshots = [];

                    for (const subtitle of group.subtitles) {
                        const canvas = await this.screenshotManager.captureFrameAtTime(video, subtitle.midTime);
                        if (canvas && canvas.width > 0 && canvas.height > 0) {
                            screenshots.push(canvas);
                        }
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }

                    if (screenshots.length > 0) {
                        const compositeCanvas = this.imageComposer.createCompositeImage(screenshots, group.subtitles, compositeMode);

                        if (compositeCanvas) {
                            const title = this.videoManager.getVideoTitle();
                            const id = this.videoManager.getVideoID();
                            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

                            const link = document.createElement('a');
                            link.download = `${title}_batch_group${group.groupIndex + 1}_of_${targetGroupCount}_${id}_${timestamp}.png`;
                            link.href = compositeCanvas.toDataURL('image/png');
                            link.click();

                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }

                    completedGroups++;
                    const progress = Math.round((completedGroups / groups.length) * 100);
                    if (typeof this.onProgress === 'function') {
                        this.onProgress(progress, completedGroups, groups.length);
                    }
                }

                return groups.length;
            }

            /**
             * 处理常规模式
             */
            async handleRegularMode(timeRanges, compositeMode) {
                if (!this.subtitleManager.subtitleEnabled || !this.subtitleManager.subtitleData) {
                    throw new Error('请先加载字幕文件并开启字幕功能');
                }

                const video = this.videoManager.getVideoElement();
                let processedRanges = 0;

                for (const range of timeRanges) {
                    const subtitlesInRange = this.subtitleManager.findSubtitlesInRange(range.startTime, range.endTime);

                    if (subtitlesInRange.length > 0) {
                        const screenshots = [];

                        for (const subtitle of subtitlesInRange) {
                            const canvas = await this.screenshotManager.captureFrameAtTime(video, subtitle.midTime);
                            if (canvas && canvas.width > 0 && canvas.height > 0) {
                                screenshots.push(canvas);
                            }
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }

                        if (screenshots.length > 0) {
                            const compositeCanvas = this.imageComposer.createCompositeImage(screenshots, subtitlesInRange, compositeMode);

                            if (compositeCanvas) {
                                const title = this.videoManager.getVideoTitle();
                                const id = this.videoManager.getVideoID();
                                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

                                const link = document.createElement('a');
                                link.download = `${title}_batch_range${processedRanges + 1}_${id}_${timestamp}.png`;
                                link.href = compositeCanvas.toDataURL('image/png');
                                link.click();

                                await new Promise(resolve => setTimeout(resolve, 500));
                            }
                        }
                    }

                    processedRanges++;
                    const progress = Math.round((processedRanges / timeRanges.length) * 100);
                    if (typeof this.onProgress === 'function') {
                        this.onProgress(progress, processedRanges, timeRanges.length);
                    }
                }

                return processedRanges;
            }
        }
        /**
         * 配置面板管理器
         */
        class ConfigPanelManager {
            constructor() {
                this.tool = null;
                this.panelVisible = false;
                this.t=new LanguageManager().t
                this.init();
            }

            init() {
                console.log('ConfigPanelManager initializing...');
                // 创建配置面板
                this.createConfigPanel();
                // 添加快捷键监听
                this.setupShortcuts();
                // 添加油猴菜单
                this.setupTampermonkeyMenu();
                console.log('ConfigPanelManager initialized successfully');
            }

            createConfigPanel() {
                // 检查面板是否已存在
                if (document.getElementById('ytFrameMasterConfig')) {
                    console.log('Panel already exists');
                    return;
                }

                console.log('Creating config panel...');

                // 创建主面板容器
                const panel = this.createElement('div', {
                    id: 'ytFrameMasterConfig',
                    style: {
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        width: '350px',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        color: '#fff',
                        border: '1px solid #444',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        zIndex: '10000',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: '14px',
                        display: 'none',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        backdropFilter: 'blur(10px)'
                    }
                });

                // 添加自定义滚动条样式
                const style = document.createElement('style');
                style.textContent = `
                    #ytFrameMasterConfig::-webkit-scrollbar {
                        width: 8px;
                    }
                    #ytFrameMasterConfig::-webkit-scrollbar-track {
                        background: rgba(255,255,255,0.1);
                        border-radius: 4px;
                    }
                    #ytFrameMasterConfig::-webkit-scrollbar-thumb {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 4px;
                        transition: all 0.3s ease;
                    }
                    #ytFrameMasterConfig::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
                    }
                `;
                document.head.appendChild(style);

                // 创建头部
                const header = this.createHeader();
                panel.appendChild(header);

                // 创建主体内容
                const content = this.createContent();
                panel.appendChild(content);

                // 添加到页面
                document.body.appendChild(panel);

                // 设置事件监听器
                this.setupPanelEvents();
                console.log('Panel created successfully');
            }

            createElement(tag, options = {}) {
                const element = document.createElement(tag);

                // 设置属性
                if (options.id) element.id = options.id;
                if (options.className) element.className = options.className;
                if (options.textContent) element.textContent = options.textContent;
                if (options.innerHTML) element.innerHTML = options.innerHTML;

                // 设置样式
                if (options.style) {
                    Object.assign(element.style, options.style);
                }

                // 设置其他属性
                if (options.attributes) {
                    Object.entries(options.attributes).forEach(([key, value]) => {
                        element.setAttribute(key, value);
                    });
                }

                return element;
            }

            createHeader() {
                const header = this.createElement('div', {
                    id: 'configPanelHeader',
                    style: {
                        padding: '20px',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        borderRadius: '12px 12px 0 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'move'
                    }
                });

                // 左侧标题区域
                const titleArea = this.createElement('div');

                const title = this.createElement('h4', {
                    textContent: this.t('title'),
                    style: {
                        margin: '0',
                        fontSize: '18px',
                        color: '#fff',
                        fontWeight: '600'
                    }
                });

                const subtitle = this.createElement('p', {
                    textContent: this.t('subtitle'),
                    style: {
                        margin: '5px 0 0 0',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: '300'
                    }
                });

                // 添加适配器信息
                const adapterInfo = this.createElement('p', {
                    textContent: this.t('adapter', { name: this.tool ? this.tool.videoManager.getSiteName() : this.t('unknown') }),
                    style: {
                        margin: '2px 0 0 0',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: '300'
                    }
                });

                titleArea.appendChild(title);
                titleArea.appendChild(subtitle);
                titleArea.appendChild(adapterInfo);

                // 关闭按钮
                const closeBtn = this.createElement('button', {
                    id: 'closeConfigPanel',
                    textContent: '×',
                    style: {
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '0',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        flexShrink: '0',
                        lineHeight: '1',
                        fontWeight: 'bold'
                    }
                });

                // 悬停效果
                closeBtn.addEventListener('mouseenter', () => {
                    closeBtn.style.background = 'rgba(255,255,255,0.3)';
                });
                closeBtn.addEventListener('mouseleave', () => {
                    closeBtn.style.background = 'rgba(255,255,255,0.2)';
                });

                header.appendChild(titleArea);
                header.appendChild(closeBtn);

                return header;
            }

            createContent() {
                const content = this.createElement('div', {
                    style: { padding: '25px' }
                });

                // 创建各个区域
                content.appendChild(this.createQuickActionsSection());
                content.appendChild(this.createBasicSettingsSection());
                content.appendChild(this.createSubtitleSection());
                content.appendChild(this.createBatchSection());
                content.appendChild(this.createBottomButtons());

                return content;
            }

            createQuickActionsSection() {
                const section = this.createElement('div', {
                    style: {
                        marginBottom: '25px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px'
                    }
                });

                const title = this.createElement('h4', {
                    textContent: langManager.t('quickActions'),
                    style: {
                        margin: '0 0 15px 0',
                        fontSize: '16px',
                        color: '#fff',
                        fontWeight: '600'
                    }
                });

                const buttonGroup = this.createElement('div', {
                    style: {
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '15px'
                    }
                });

                const screenshotBtn = this.createActionButton('takeScreenshotBtn', langManager.t('takeScreenshot'), '#11998e', '#38ef7d');
                const burstBtn = this.createActionButton('burstModeBtn', langManager.t('burstMode'), '#f093fb', '#f5576c');

                buttonGroup.appendChild(screenshotBtn);
                buttonGroup.appendChild(burstBtn);

                const shortcutInfo = this.createElement('div', {
                    style: {
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.8)',
                        textAlign: 'center'
                    }
                });

                const shortcutText = this.createElement('span', {
                    textContent: langManager.t('currentHotkey')
                });

                const shortcutKey = this.createElement('span', {
                    id: 'currentHotkey',
                    textContent: 'S',
                    style: {
                        background: 'rgba(255,255,255,0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: '600'
                    }
                });

                shortcutInfo.appendChild(shortcutText);
                shortcutInfo.appendChild(shortcutKey);

                section.appendChild(title);
                section.appendChild(buttonGroup);
                section.appendChild(shortcutInfo);

                return section;
            }

            createActionButton(id, text, color1, color2) {
                const button = this.createElement('button', {
                    id: id,
                    textContent: text,
                    style: {
                        flex: '1',
                        padding: '14px 16px',
                        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: `0 4px 15px rgba(${this.hexToRgb(color1)}, 0.3)`,
                        position: 'relative',
                        overflow: 'hidden'
                    }
                });

                // 悬停效果
                button.addEventListener('mouseenter', () => {
                    button.style.transform = 'translateY(-2px) scale(1.02)';
                    button.style.boxShadow = `0 8px 25px rgba(${this.hexToRgb(color1)}, 0.4)`;
                });
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translateY(0) scale(1)';
                    button.style.boxShadow = `0 4px 15px rgba(${this.hexToRgb(color1)}, 0.3)`;
                });

                // 点击效果
                button.addEventListener('mousedown', () => {
                    button.style.transform = 'translateY(0) scale(0.98)';
                });
                button.addEventListener('mouseup', () => {
                    button.style.transform = 'translateY(-2px) scale(1.02)';
                });

                return button;
            }

            createBasicSettingsSection() {
                const section = this.createElement('div', {
                    style: {
                        marginBottom: '25px',
                        padding: '20px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }
                });

                const title = this.createElement('h4', {
                    textContent: langManager.t('basicSettings'),
                    style: {
                        margin: '0 0 15px 0',
                        fontSize: '16px',
                        color: '#fff',
                        fontWeight: '600'
                    }
                });

                section.appendChild(title);
                section.appendChild(this.createHotkeyControl());
                section.appendChild(this.createIntervalControl());
                section.appendChild(this.createLanguageControl());

                return section;
            }

            createHotkeyControl() {
                const container = this.createElement('div', {
                    style: { marginBottom: '15px' }
                });

                const label = this.createElement('label', {
                    textContent: langManager.t('screenshotHotkey'),
                    style: {
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        color: '#ccc'
                    }
                });

                const inputGroup = this.createElement('div', {
                    style: {
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center'
                    }
                });

                const input = this.createElement('input', {
                    id: 'hotkeyInput',
                    attributes: {
                        type: 'text',
                        value: 's',
                        maxlength: '1'
                    },
                    style: {
                        width: '60px',
                        padding: '10px',
                        border: '1px solid #555',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                    }
                });

                const applyBtn = this.createElement('button', {
                    id: 'setHotkey',
                    textContent: langManager.t('apply'),
                    style: {
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(79, 172, 254, 0.3)'
                    }
                });

                // 应用按钮悬停效果
                applyBtn.addEventListener('mouseenter', () => {
                    applyBtn.style.transform = 'translateY(-1px)';
                    applyBtn.style.boxShadow = '0 4px 12px rgba(79, 172, 254, 0.4)';
                });
                applyBtn.addEventListener('mouseleave', () => {
                    applyBtn.style.transform = 'translateY(0)';
                    applyBtn.style.boxShadow = '0 2px 8px rgba(79, 172, 254, 0.3)';
                });

                inputGroup.appendChild(input);
                inputGroup.appendChild(applyBtn);

                container.appendChild(label);
                container.appendChild(inputGroup);

                return container;
            }

            createIntervalControl() {
                const container = this.createElement('div', {
                    style: { marginBottom: '15px' }
                });

                const label = this.createElement('label', {
                    style: {
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        color: '#ccc'
                    }
                });

                const labelText = this.createElement('span', { textContent: langManager.t('burstInterval') });
                const valueSpan = this.createElement('span', {
                    id: 'intervalValue',
                    textContent: '1000'
                });
                const unitSpan = this.createElement('span', { textContent: 'ms' });

                label.appendChild(labelText);
                label.appendChild(valueSpan);
                label.appendChild(unitSpan);            const slider = this.createElement('input', {
                id: 'intervalSlider',
                attributes: {
                    type: 'range',
                    min: '100',
                    max: '3000',
                    value: '1000',
                    step: '100'
                },
                    style: {
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#555',
                    outline: 'none',
                    marginBottom: '10px'
                }
            });

            container.appendChild(label);
            container.appendChild(slider);

            return container;
    }

    createLanguageControl() {
        const container = this.createElement('div', {
            style: { marginBottom: '15px' }
        });

        const label = this.createElement('label', {
            textContent: langManager.t('interfaceLanguage'),
            style: {
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#ccc'
            }
        });

        const select = this.createElement('select', {
            id: 'langSelect',
            style: {
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '14px'
            }
        });

        const option1 = this.createElement('option', {
            textContent: 'English',
            attributes: { value: 'EN' }
        });
        const option2 = this.createElement('option', {
            textContent: '中文',
            attributes: { value: 'ZH' }
        });

        select.appendChild(option1);
        select.appendChild(option2);

        container.appendChild(label);
        container.appendChild(select);

        return container;
    }

    createSubtitleSection() {
        const section = this.createElement('div', {
            style: {
                marginBottom: '25px',
                padding: '20px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        });

        const title = this.createElement('h4', {
            textContent: langManager.t('subtitleSettings'),
            style: {
                margin: '0 0 15px 0',
                fontSize: '16px',
                color: '#fff',
                fontWeight: '600'
            }
        });

        section.appendChild(title);
        section.appendChild(this.createSubtitleFileControl());
        section.appendChild(this.createSubtitleToggle());
        section.appendChild(this.createSubtitleInCompositeToggle());
        section.appendChild(this.createFontSizeControl());
        section.appendChild(this.createMaxLinesControl());
        section.appendChild(this.createSubtitleStatus());

        return section;
    }

    createSubtitleFileControl() {
        const container = this.createElement('div', {
            style: { marginBottom: '15px' }
        });

        const label = this.createElement('label', {
            textContent: langManager.t('subtitleFile'),
            style: {
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#ccc'
            }
        });

        const input = this.createElement('input', {
            id: 'subtitleFile',
            attributes: {
                type: 'file',
                accept: '.txt,.json'
            },
            style: {
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '12px'
            }
        });

        container.appendChild(label);
        container.appendChild(input);

        return container;
    }

    createSubtitleToggle() {
        const container = this.createElement('div', {
            style: { marginBottom: '15px' }
        });

        const label = this.createElement('label', {
            style: {
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
            }
        });

        const checkbox = this.createElement('input', {
            id: 'subtitleToggle',
            attributes: { type: 'checkbox' },
            style: {
                marginRight: '10px',
                width: '18px',
                height: '18px',
                accentColor: '#4facfe'
            }
        });

        const span = this.createElement('span', {
            textContent: langManager.t('enableSubtitle'),
            style: {
                fontWeight: '500',
                color: '#ccc'
            }
        });

        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);

        return container;
    }

    createSubtitleInCompositeToggle() {
        const container = this.createElement('div', {
            style: { marginBottom: '15px' }
        });

        const label = this.createElement('label', {
            style: {
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
            }
        });

        const checkbox = this.createElement('input', {
            id: 'subtitleInCompositeToggle',
            attributes: { 
                type: 'checkbox',
                checked: true // Default to true
            },
            style: {
                marginRight: '10px',
                width: '18px',
                height: '18px',
                accentColor: '#4facfe'
            }
        });

        const span = this.createElement('span', {
            textContent: this.t('showSubtitlesInComposite'),
            style: {
                fontWeight: '500',
                color: '#ccc'
            }
        });

        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);

        return container;
    }

    createFontSizeControl() {
        const container = this.createElement('div', {
            style: { marginBottom: '15px' }
        });

        const label = this.createElement('label', {
            style: {
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#ccc'
            }
        });

        const labelText = this.createElement('span', { textContent: langManager.t('fontSize') });
        const valueSpan = this.createElement('span', {
            id: 'fontSizeValue',
            textContent: '48'
        });
        const unitSpan = this.createElement('span', { textContent: 'px' });

        label.appendChild(labelText);
        label.appendChild(valueSpan);
        label.appendChild(unitSpan);

        const slider = this.createElement('input', {
            id: 'fontSizeSlider',
            attributes: {
                type: 'range',
                min: '24',
                max: '96',
                value: '48'
            },
            style: {
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#555',
                outline: 'none',
                marginBottom: '10px'
            }
        });

        container.appendChild(label);
        container.appendChild(slider);

        return container;
    }

    createMaxLinesControl() {
        const container = this.createElement('div', {
            style: { marginBottom: '15px' }
        });

        const label = this.createElement('label', {
            style: {
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#ccc'
            }
        });

        const labelText = this.createElement('span', { textContent: langManager.t('maxLines') });
        const valueSpan = this.createElement('span', {
            id: 'maxLinesValue',
            textContent: '2'
        });

        label.appendChild(labelText);
        label.appendChild(valueSpan);

        const slider = this.createElement('input', {
            id: 'maxLinesSlider',
            attributes: {
                type: 'range',
                min: '1',
                max: '5',
                value: '2'
            },
            style: {
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#555',
                outline: 'none',
                marginBottom: '10px'
            }
        });

        container.appendChild(label);
        container.appendChild(slider);

        return container;
    }

    createSubtitleStatus() {
        const container = this.createElement('div', {
            style: {
                fontSize: '12px',
                color: '#999',
                textAlign: 'center',
                padding: '8px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '6px'
            }
        });

        const statusText = this.createElement('span', { textContent: langManager.t('status') });
        const statusSpan = this.createElement('span', {
            id: 'subtitleStatus',
            textContent: langManager.t('notLoaded')
        });

        container.appendChild(statusText);
        container.appendChild(statusSpan);

        return container;
    }

    createBatchSection() {
        const section = this.createElement('div', {
            style: {
                marginBottom: '25px',
                padding: '20px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        });

        const title = this.createElement('h4', {
            textContent: langManager.t('batchScreenshot'),
            style: {
                margin: '0 0 15px 0',
                fontSize: '16px',
                color: '#fff',
                fontWeight: '600'
            }
        });

        section.appendChild(title);
        section.appendChild(this.createCompositeModeControl());
        section.appendChild(this.createOverlapHeightControl());
        section.appendChild(this.createTimeRangeControl());
        section.appendChild(this.createBatchButton());

        return section;
    }

    createCompositeModeControl() {
        const container = this.createElement('div', {
            style: { marginBottom: '15px' }
        });

        const label = this.createElement('label', {
            textContent: langManager.t('compositeMode'),
            style: {
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#ccc'
            }
        });

        const select = this.createElement('select', {
            id: 'compositeModeSelect',
            style: {
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '14px'
            }
        });

        const option1 = this.createElement('option', {
            textContent: langManager.t('parallelMode'),
            attributes: { value: 'parallel' }
        });
        const option2 = this.createElement('option', {
            textContent: langManager.t('overlapMode'),
            attributes: { value: 'overlap' }
        });

        select.appendChild(option1);
        select.appendChild(option2);

        container.appendChild(label);
        container.appendChild(select);

        return container;
    }

    createOverlapHeightControl() {
        const container = this.createElement('div', {
            id: 'overlapHeightContainer',
            style: { 
                marginBottom: '15px',
                display: 'none' // Initially hidden, show only when overlap mode is selected
            }
        });

        const label = this.createElement('label', {
            style: {
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#ccc'
            }
        });

        const labelText = this.createElement('span', { textContent: this.t('overlapHeight') });
        const valueSpan = this.createElement('span', {
            id: 'overlapHeightValue',
            textContent: '150'
        });
        const unitSpan = this.createElement('span', { textContent: 'px' });

        label.appendChild(labelText);
        label.appendChild(valueSpan);
        label.appendChild(unitSpan);

        const slider = this.createElement('input', {
            id: 'overlapHeightSlider',
            attributes: {
                type: 'range',
                min: '50',
                max: '400',
                value: '150',
                step: '10'
            },
            style: {
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#555',
                outline: 'none',
                marginBottom: '10px'
            }
        });

        const helpText = this.createElement('div', {
            textContent: '💡 仅在重叠模式下生效，控制除第一张图片外的其他图片重叠区域高度。取消显示字幕时会自动调整到较小值',
            style: {
                fontSize: '11px',
                color: '#888',
                marginTop: '5px',
                lineHeight: '1.3'
            }
        });

        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(helpText);

        return container;
    }

    createTimeRangeControl() {
        const container = this.createElement('div', {
            style: { marginBottom: '15px' }
        });

        const label = this.createElement('label', {
            textContent: langManager.t('timeRange'),
            style: {
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#ccc'
            }
        });

        const input = this.createElement('input', {
            id: 'timeRangeInput',
            attributes: {
                type: 'text',
                placeholder: langManager.t('placeholderTimeRange')
            },
            style: {
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '14px'
            }
        });

        const helpText = this.createElement('div', {
            textContent: langManager.t('formatHelp'),
            style: {
                fontSize: '11px',
                color: '#888',
                marginTop: '5px',
                lineHeight: '1.3'
            }
        });

        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(helpText);

        return container;
    }

    createBatchButton() {
        const container = this.createElement('div');

        const button = this.createElement('button', {
            id: 'batchScreenshot',
            textContent: langManager.t('startBatch'),
            style: {
                width: '100%',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                marginBottom: '10px',
                position: 'relative',
                overflow: 'hidden'
            }
        });

        // 进度条容器
        const progressContainer = this.createElement('div', {
            id: 'batchProgressContainer',
            style: {
                display: 'none',
                marginTop: '10px'
            }
        });

        // 进度条
        const progressBar = this.createElement('div', {
            style: {
                width: '100%',
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '8px'
            }
        });

        const progressFill = this.createElement('div', {
            id: 'batchProgressFill',
            style: {
                width: '0%',
                height: '100%',
                background: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)',
                transition: 'width 0.3s ease',
                borderRadius: '3px'
            }
        });

        progressBar.appendChild(progressFill);

        // 进度文字
        const progressText = this.createElement('div', {
            id: 'batchProgressText',
            textContent: '0%',
            style: {
                fontSize: '12px',
                color: '#ccc',
                textAlign: 'center'
            }
        });

        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(-2px) scale(1.02)';
                button.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }
        });
        button.addEventListener('mouseleave', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(0) scale(1)';
                button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }
        });

        // 点击效果
        button.addEventListener('mousedown', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(0) scale(0.98)';
            }
        });
        button.addEventListener('mouseup', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            }
        });

        container.appendChild(button);
        container.appendChild(progressContainer);

        return container;
    }

    createBottomButtons() {
        const container = this.createElement('div', {
            style: {
                marginTop: '25px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: '10px'
            }
        });

        const resetBtn = this.createElement('button', {
            id: 'resetConfig',
            textContent: langManager.t('resetConfig'),
            style: {
                flex: '1',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #868f96 0%, #596164 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(134, 143, 150, 0.3)'
            }
        });

        const saveBtn = this.createElement('button', {
            id: 'saveConfig',
            textContent: langManager.t('saveConfig'),
            style: {
                flex: '1',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(17, 153, 142, 0.3)'
            }
        });

        // 底部按钮悬停效果
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.transform = 'translateY(-1px)';
            resetBtn.style.boxShadow = '0 4px 12px rgba(134, 143, 150, 0.4)';
        });
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.transform = 'translateY(0)';
            resetBtn.style.boxShadow = '0 2px 8px rgba(134, 143, 150, 0.3)';
        });

        saveBtn.addEventListener('mouseenter', () => {
            saveBtn.style.transform = 'translateY(-1px)';
            saveBtn.style.boxShadow = '0 4px 12px rgba(17, 153, 142, 0.4)';
        });
        saveBtn.addEventListener('mouseleave', () => {
            saveBtn.style.transform = 'translateY(0)';
            saveBtn.style.boxShadow = '0 2px 8px rgba(17, 153, 142, 0.3)';
        });

        container.appendChild(resetBtn);
        container.appendChild(saveBtn);

        return container;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '0, 0, 0';
    }

    setupPanelEvents() {
        const panel = document.getElementById('ytFrameMasterConfig');
        const closeBtn = document.getElementById('closeConfigPanel');
        const header = document.getElementById('configPanelHeader');

        // 关闭面板
        closeBtn.addEventListener('click', () => {
            this.hidePanel();
        });

        // 拖拽功能
        this.setupDragFunctionality(panel, header);

        // 各种设置事件
        this.setupSettingsEvents();
    }

    setupDragFunctionality(panel, header) {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragOffset.x = e.clientX - panel.offsetLeft;
            dragOffset.y = e.clientY - panel.offsetTop;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX - dragOffset.x) + 'px';
                panel.style.top = (e.clientY - dragOffset.y) + 'px';
                panel.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'move';
        });
    }

    setupSettingsEvents() {
        // 快捷键设置
        document.getElementById('setHotkey').addEventListener('click', () => {
            const input = document.getElementById('hotkeyInput').value;
            if (input && /^[a-zA-Z]$/.test(input)) {
                GM_setValue('screenshotKey', input.toLowerCase());
                document.getElementById('currentHotkey').textContent = input.toUpperCase();
                this.showNotification(langManager.t('hotkeyUpdated') + input.toUpperCase());
            } else {
                this.showNotification(langManager.t('invalidHotkey'), 'error');
            }
        });

        // 间隔设置
        document.getElementById('intervalSlider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('intervalValue').textContent = value;
            GM_setValue('captureInterval', value);
        });

        // 语言设置
        document.getElementById('langSelect').addEventListener('change', (e) => {
            langManager.setLanguage(e.target.value);
            this.showNotification(langManager.t('languageUpdated'));
            // 更新界面语言
            this.updateInterfaceLanguage();
        });

        // 字幕文件上传
        document.getElementById('subtitleFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const rawData = JSON.parse(event.target.result);
                        
                        if (this.tool && this.tool.subtitleManager) {
                            console.log('开始处理字幕文件...', rawData);
                            
                            // 使用适配器工厂获取合适的适配器
                            const adapter = SubtitleAdapterFactory.getAdapter(rawData, this.tool.subtitleManager.currentSite);
                            console.log('选择的适配器:', adapter.getFormatName());
                            
                            const subtitleData = adapter.parseSubtitleData(rawData);
                            console.log('字幕数据解析成功');
                            
                            // 设置字幕管理器的数据和适配器
                            this.tool.subtitleManager.adapter = adapter;
                            this.tool.subtitleManager.subtitleData = subtitleData;
                            this.tool.subtitleManager.subtitleEnabled = true;
                            
                            const count = adapter.getSubtitleCount(subtitleData);
                            console.log('字幕数量:', count);
                            
                            document.getElementById('subtitleStatus').textContent = `已加载 (${count} 条字幕) - ${adapter.getFormatName()}`;
                            this.showNotification(`${adapter.getFormatName()}字幕文件加载成功`);
                        } else {
                            console.error('字幕管理器未初始化');
                            throw new Error('字幕管理器未初始化');
                        }
                    } catch (error) {
                        console.error('字幕文件解析错误:', error);
                        this.showNotification('字幕文件格式错误: ' + error.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        });

        // 字幕开关
        document.getElementById('subtitleToggle').addEventListener('change', (e) => {
            if (this.tool && this.tool.subtitleManager) {
                this.tool.subtitleManager.subtitleEnabled = e.target.checked;
            }
            this.showNotification(`字幕功能已${e.target.checked ? '开启' : '关闭'}`);
        });

        // 字幕在拼接图中显示开关
        document.getElementById('subtitleInCompositeToggle').addEventListener('change', (e) => {
            if (this.tool && this.tool.subtitleManager) {
                this.tool.subtitleManager.setShowSubtitlesInComposite(e.target.checked);
            }
            
            // 自动调整重叠高度
            const overlapHeightSlider = document.getElementById('overlapHeightSlider');
            const overlapHeightValue = document.getElementById('overlapHeightValue');
            
            if (overlapHeightSlider && overlapHeightValue) {
                if (!e.target.checked) {
                    // 不显示字幕时，减少重叠高度到较小值
                    const newHeight = 80; // 不显示字幕时使用较小的重叠高度
                    overlapHeightSlider.value = newHeight;
                    overlapHeightValue.textContent = newHeight;
                    GM_setValue('overlapHeight', newHeight);
                    
                    // 更新 ImageComposer 实例的重叠高度设置
                    if (this.tool && this.tool.imageComposer) {
                        this.tool.imageComposer.updateOverlapHeight(newHeight);
                    }
                } else {
                    // 显示字幕时，恢复到默认较大值
                    const newHeight = 150; // 显示字幕时使用较大的重叠高度
                    overlapHeightSlider.value = newHeight;
                    overlapHeightValue.textContent = newHeight;
                    GM_setValue('overlapHeight', newHeight);
                    
                    // 更新 ImageComposer 实例的重叠高度设置
                    if (this.tool && this.tool.imageComposer) {
                        this.tool.imageComposer.updateOverlapHeight(newHeight);
                    }
                }
            }
            
            this.showNotification(`拼接图中字幕已${e.target.checked ? '显示' : '隐藏'}`);
        });

        // 字体大小
        document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('fontSizeValue').textContent = value;
            if (this.tool && this.tool.subtitleManager) {
                this.tool.subtitleManager.fontSize = value;
            }
            GM_setValue('subtitleFontSize', value);
        });

        // 最大行数
        document.getElementById('maxLinesSlider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('maxLinesValue').textContent = value;
            if (this.tool && this.tool.subtitleManager) {
                this.tool.subtitleManager.maxLines = value;
            }
            GM_setValue('subtitleMaxLines', value);
        });

        // 拼接模式
        document.getElementById('compositeModeSelect').addEventListener('change', (e) => {
            GM_setValue('compositeMode', e.target.value);
            this.showNotification(`拼接模式已切换为${e.target.value === 'parallel' ? '平行' : '重叠'}模式`);
            
            // 显示/隐藏重叠高度控件
            const overlapHeightContainer = document.getElementById('overlapHeightContainer');
            if (overlapHeightContainer) {
                overlapHeightContainer.style.display = e.target.value === 'overlap' ? 'block' : 'none';
            }
        });

        // 重叠高度
        document.getElementById('overlapHeightSlider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('overlapHeightValue').textContent = value;
            GM_setValue('overlapHeight', value);
            
            // 更新 ImageComposer 实例的重叠高度设置
            if (this.tool && this.tool.imageComposer) {
                this.tool.imageComposer.updateOverlapHeight(value);
            }
        });

        // 快速操作按钮
        document.getElementById('takeScreenshotBtn').addEventListener('click', () => {
            if (this.tool && this.tool.screenshotManager) {
                this.tool.screenshotManager.takeScreenshot();
                this.showNotification(this.t('screenshotSaved'));
            }
        });

        // 连拍模式按钮
        document.getElementById('burstModeBtn').addEventListener('click', () => {
            this.showNotification(this.t('useHotkey'));
        });

        // 批量截图
        document.getElementById('batchScreenshot').addEventListener('click', () => {
            const timeRange = document.getElementById('timeRangeInput').value;
            const mode = document.getElementById('compositeModeSelect').value;
            const button = document.getElementById('batchScreenshot');
            const progressContainer = document.getElementById('batchProgressContainer');
            const progressFill = document.getElementById('batchProgressFill');
            const progressText = document.getElementById('batchProgressText');

            if (!timeRange) {
                this.showNotification(langManager.t('enterTimeRange'), 'error');
                return;
            }

            if (button.disabled) {
                this.showNotification(langManager.t('batchInProgress'), 'error');
                return;
            }

            if (this.tool && this.tool.taskManager) {
                // 禁用按钮和显示进度
                button.disabled = true;
                button.textContent = langManager.t('inProgress');
                button.style.background = 'linear-gradient(135deg, #868f96 0%, #596164 100%)';
                button.style.cursor = 'not-allowed';
                progressContainer.style.display = 'block';
                progressFill.style.width = '0%';
                progressText.textContent = '0% (0/0)';

                // 设置进度回调
                this.tool.taskManager.onProgress = (progress, completed, total) => {
                    progressFill.style.width = progress + '%';
                    progressText.textContent = `${progress}% (${completed}/${total})`;
                };

                this.tool.taskManager.batchScreenshot(timeRange, mode)
                    .then((count) => {
                        this.showNotification(langManager.t('batchComplete', { count: count }));
                        progressFill.style.width = '100%';
                        progressText.textContent = '100% - ' + langManager.t('complete');
                    })
                    .catch((error) => {
                        this.showNotification(langManager.t('batchFailed', { error: error.message }), 'error');
                    })
                    .finally(() => {
                        // 恢复按钮状态
                        setTimeout(() => {
                            button.disabled = false;
                            button.textContent = langManager.t('startBatch');
                            button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                            button.style.cursor = 'pointer';
                            progressContainer.style.display = 'none';

                            // 清除进度回调
                            if (this.tool && this.tool.taskManager) {
                                this.tool.taskManager.onProgress = null;
                            }
                        }, 2000); // 2秒后隐藏进度条
                    });
            }
        });

        // 重置配置
        document.getElementById('resetConfig').addEventListener('click', () => {
            if (confirm('确定要重置所有配置吗？')) {
                GM_setValue('screenshotKey', 's');
                GM_setValue('captureInterval', 1000);
                GM_setValue('lang', 'EN');
                GM_setValue('subtitleFontSize', 48);
                GM_setValue('subtitleMaxLines', 2);
                GM_setValue('compositeMode', 'parallel');
                GM_setValue('overlapHeight', 150);
                this.showNotification('配置已重置，请刷新页面');
            }
        });

        // 保存配置
        document.getElementById('saveConfig').addEventListener('click', () => {
            this.showNotification('配置已保存');
        });
    }

    updateInterfaceLanguage() {
        // 重新创建配置面板以使用新语言
        setTimeout(() => {
            const panel = document.getElementById('ytFrameMasterConfig');
            if (panel) {
                const isVisible = panel.style.display !== 'none';
                panel.remove();
                this.createConfigPanel();
                if (isVisible) {
                    this.showPanel();
                }
            }
        }, 100);
    }

    setupShortcuts() {
        // 检测平台并设置对应的快捷键
        // Mac: Cmd+Shift+F (F for FrameMaster)，其他平台: Ctrl+Shift+F
        // 避免与浏览器默认快捷键冲突
        document.addEventListener('keydown', (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifierKey = isMac ? e.metaKey : e.ctrlKey;

            if (modifierKey && e.shiftKey && e.key === 'F') {
                console.log('Shortcut key detected!');
                e.preventDefault();
                this.togglePanel();
            }
        });
        console.log('Shortcuts set up');
    }

    setupTampermonkeyMenu() {
        // 检测平台并显示对应的快捷键提示
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const shortcutText = isMac ? 'Cmd+Shift+F' : 'Ctrl+Shift+F';

        GM_registerMenuCommand(`🎬 打开 FrameMaster 配置面板 (${shortcutText})`, () => {
            this.togglePanel();
        });
    }

    showPanel() {
        const panel = document.getElementById('ytFrameMasterConfig');
        if (panel) {
            panel.style.display = 'block';
            this.panelVisible = true;
            // 加载当前配置
            this.loadCurrentConfig();
        }
    }

    hidePanel() {
        const panel = document.getElementById('ytFrameMasterConfig');
        if (panel) {
            panel.style.display = 'none';
            this.panelVisible = false;
        }
    }

    togglePanel() {
        console.log('togglePanel called, current visible:', this.panelVisible);
        if (this.panelVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }

    loadCurrentConfig() {
        // 加载当前配置到面板
        const screenshotKey = GM_getValue('screenshotKey', 's');
        const interval = GM_getValue('captureInterval', 1000);
        const lang = GM_getValue('lang', 'EN');
        const fontSize = GM_getValue('subtitleFontSize', 48);
        const maxLines = GM_getValue('subtitleMaxLines', 2);
        const compositeMode = GM_getValue('compositeMode', 'parallel');
        const overlapHeight = GM_getValue('overlapHeight', 150);
        const showSubtitlesInComposite = GM_getValue('showSubtitlesInComposite', true);

        const hotkeyInput = document.getElementById('hotkeyInput');
        const currentHotkey = document.getElementById('currentHotkey');
        const intervalSlider = document.getElementById('intervalSlider');
        const intervalValue = document.getElementById('intervalValue');
        const langSelect = document.getElementById('langSelect');
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        const fontSizeValue = document.getElementById('fontSizeValue');
        const maxLinesSlider = document.getElementById('maxLinesSlider');
        const maxLinesValue = document.getElementById('maxLinesValue');
        const compositeModeSelect = document.getElementById('compositeModeSelect');
        const overlapHeightSlider = document.getElementById('overlapHeightSlider');
        const overlapHeightValue = document.getElementById('overlapHeightValue');
        const overlapHeightContainer = document.getElementById('overlapHeightContainer');
        const subtitleInCompositeToggle = document.getElementById('subtitleInCompositeToggle');

        if (hotkeyInput) hotkeyInput.value = screenshotKey;
        if (currentHotkey) currentHotkey.textContent = screenshotKey.toUpperCase();
        if (intervalSlider) intervalSlider.value = interval;
        if (intervalValue) intervalValue.textContent = interval;
        if (langSelect) langSelect.value = lang;
        if (fontSizeSlider) fontSizeSlider.value = fontSize;
        if (fontSizeValue) fontSizeValue.textContent = fontSize;
        if (maxLinesSlider) maxLinesSlider.value = maxLines;
        if (maxLinesValue) maxLinesValue.textContent = maxLines;
        if (compositeModeSelect) compositeModeSelect.value = compositeMode;
        if (subtitleInCompositeToggle) subtitleInCompositeToggle.checked = showSubtitlesInComposite;
        
        // 根据字幕显示状态自动调整重叠高度
        let adjustedOverlapHeight = overlapHeight;
        if (!showSubtitlesInComposite) {
            adjustedOverlapHeight = Math.min(80, overlapHeight); // 不显示字幕时使用较小值
        }
        
        if (overlapHeightSlider) overlapHeightSlider.value = adjustedOverlapHeight;
        if (overlapHeightValue) overlapHeightValue.textContent = adjustedOverlapHeight;
        
        // 显示/隐藏重叠高度控件
        if (overlapHeightContainer) {
            overlapHeightContainer.style.display = compositeMode === 'overlap' ? 'block' : 'none';
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;

        const backgroundColor = type === 'error' ? '#ff6b6b' : '#38ef7d';

        notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 10001;
                font-size: 14px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 500;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                transform: translateX(400px);
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            `;

        document.body.appendChild(notification);

        // 动画显示
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // 自动消失
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    setTool(tool) {
        this.tool = tool;
    }
}

    // 主工具类的改进版本
    class EnhancedVideoScreenshotTool extends VideoScreenshotTool {
    constructor() {
        super();
        this.loadConfig();
    }

    loadConfig() {
        this.state.screenshotKey = GM_getValue('screenshotKey', 's');
        this.state.interval = GM_getValue('captureInterval', 1000);
        this.state.lang = GM_getValue('lang', 'EN');
        this.subtitleManager.fontSize = GM_getValue('subtitleFontSize', 48);
        this.subtitleManager.maxLines = GM_getValue('subtitleMaxLines', 2);
        this.state.compositeMode = GM_getValue('compositeMode', 'parallel');
    }

    handleKeyDown(e) {
        if (
            e.key.toLowerCase() === this.state.screenshotKey &&
            !this.state.keyDown &&
            !['INPUT', 'TEXTAREA'].includes(e.target.tagName)
        ) {
            this.state.keyDown = true;
            this.screenshotManager.takeScreenshot();
            this.state.intervalId = setInterval(() => {
                this.screenshotManager.takeScreenshot();
            }, this.state.interval);
        }
    }
}

// 初始化工具和配置面板
const tool = new EnhancedVideoScreenshotTool();
const configPanel = new ConfigPanelManager();

// 将工具实例传递给配置面板
configPanel.setTool(tool);

// 添加一个可拖拽的浮动按钮
function createFloatingButton() {
    console.log('Creating floating button...');
    console.log('Document ready state:', document.readyState);
    console.log('Document body exists:', !!document.body);

    if (!document.body) {
        console.log('Body not ready, retrying in 500ms...');
        setTimeout(createFloatingButton, 500);
        return;
    }

    // 检查是否已存在
    const existingButton = document.getElementById('frameMasterFloatingBtn');
    if (existingButton) {
        console.log('Button already exists, removing...');
        existingButton.remove();
    }

    const testButton = document.createElement('button');
    testButton.textContent = '🎬';
    testButton.id = 'frameMasterFloatingBtn';
    testButton.title = 'FrameMaster Pro - 点击打开配置面板';

    console.log('Button created:', testButton);

    // 设置按钮样式
    testButton.style.cssText = `
            position: fixed !important;
            top: 100px !important;
            right: 20px !important;
            width: 50px !important;
            height: 50px !important;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            font-size: 20px !important;
            cursor: grab !important;
            z-index: 99999 !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
            transition: all 0.2s ease !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;

    // 拖拽功能变量
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let startPos = { x: 0, y: 0 };
    let hasMoved = false;

    // 鼠标按下事件
    testButton.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasMoved = false;
        startPos.x = e.clientX;
        startPos.y = e.clientY;

        // 计算鼠标相对于按钮的偏移
        const rect = testButton.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;

        // 改变光标和样式
        testButton.style.cursor = 'grabbing';
        testButton.style.transform = 'scale(1.1)';
        testButton.style.transition = 'none';

        // 防止选择文本
        e.preventDefault();
    });

    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // 计算移动距离
        const moveX = Math.abs(e.clientX - startPos.x);
        const moveY = Math.abs(e.clientY - startPos.y);

        // 如果移动距离超过阈值，则认为是拖拽
        if (moveX > 5 || moveY > 5) {
            hasMoved = true;
        }

        // 计算新位置
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // 获取视口边界
        const maxX = window.innerWidth - testButton.offsetWidth;
        const maxY = window.innerHeight - testButton.offsetHeight;

        // 限制在视口内
        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));

        // 更新位置
        testButton.style.left = constrainedX + 'px';
        testButton.style.top = constrainedY + 'px';
        testButton.style.right = 'auto';
        testButton.style.bottom = 'auto';
    });

    // 鼠标释放事件
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;

        isDragging = false;
        testButton.style.cursor = 'grab';
        testButton.style.transform = 'scale(1)';
        testButton.style.transition = 'all 0.2s ease';

        // 如果没有移动，延迟一点时间再重置hasMoved，避免点击事件被影响
        if (!hasMoved) {
            setTimeout(() => {
                hasMoved = false;
            }, 100);
        }
    });

    // 点击事件（只在没有拖拽时触发）
    testButton.addEventListener('click', (e) => {
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        console.log('Test button clicked');
        configPanel.togglePanel();
    });

    // 悬停效果
    testButton.addEventListener('mouseenter', () => {
        if (!isDragging) {
            testButton.style.transform = 'scale(1.1)';
            testButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        }
    });

    testButton.addEventListener('mouseleave', () => {
        if (!isDragging) {
            testButton.style.transform = 'scale(1)';
            testButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        }
    });

    // 添加长按提示
    let longPressTimer = null;
    testButton.addEventListener('mousedown', (e) => {
        longPressTimer = setTimeout(() => {
            if (!hasMoved) {
                // 显示提示
                const tooltip = document.createElement('div');
                tooltip.textContent = '拖拽移动按钮位置';
                tooltip.style.cssText = `
                        position: fixed;
                        background: rgba(0,0,0,0.8);
                        color: white;
                        padding: 8px 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        z-index: 10000;
                        pointer-events: none;
                        white-space: nowrap;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    `;

                // 计算提示框位置
                const rect = testButton.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                tooltip.style.top = (rect.top - 35) + 'px';
                tooltip.style.transform = 'translateX(-50%)';

                document.body.appendChild(tooltip);

                // 3秒后自动消失
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.remove();
                    }
                }, 3000);
            }
        }, 1000);
    });

    testButton.addEventListener('mouseup', () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });

    // 触摸设备支持
    testButton.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        isDragging = true;
        hasMoved = false;
        startPos.x = touch.clientX;
        startPos.y = touch.clientY;

        // 计算鼠标相对于按钮的偏移
        const rect = testButton.getBoundingClientRect();
        dragOffset.x = touch.clientX - rect.left;
        dragOffset.y = touch.clientY - rect.top;

        testButton.style.cursor = 'grabbing';
        testButton.style.transform = 'scale(1.1)';
        testButton.style.transition = 'none';

        e.preventDefault();
    });

    testButton.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        const moveX = Math.abs(touch.clientX - startPos.x);
        const moveY = Math.abs(touch.clientY - startPos.y);

        if (moveX > 5 || moveY > 5) {
            hasMoved = true;
        }

        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;

        const maxX = window.innerWidth - testButton.offsetWidth;
        const maxY = window.innerHeight - testButton.offsetHeight;

        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));

        testButton.style.left = constrainedX + 'px';
        testButton.style.top = constrainedY + 'px';
        testButton.style.right = 'auto';
        testButton.style.bottom = 'auto';

        e.preventDefault();
    });

    testButton.addEventListener('touchend', () => {
        if (!isDragging) return;

        isDragging = false;
        testButton.style.cursor = 'grab';
        testButton.style.transform = 'scale(1)';
        testButton.style.transition = 'all 0.2s ease';

        if (!hasMoved) {
            setTimeout(() => {
                hasMoved = false;
            }, 100);
        }
    });

    // 窗口大小改变时重新定位按钮
    window.addEventListener('resize', () => {
        const rect = testButton.getBoundingClientRect();
        const maxX = window.innerWidth - testButton.offsetWidth;
        const maxY = window.innerHeight - testButton.offsetHeight;

        if (rect.left > maxX) {
            testButton.style.left = maxX + 'px';
        }
        if (rect.top > maxY) {
            testButton.style.top = maxY + 'px';
        }
    });

    document.body.appendChild(testButton);
    console.log('Draggable floating button added to body');
    console.log('Button element:', testButton);
    console.log('Button in DOM:', document.getElementById('frameMasterFloatingBtn'));
    console.log('Body children count:', document.body.children.length);
}

// 开始创建按钮
createFloatingButton();

// 延迟显示配置面板（让用户知道有这个功能）
setTimeout(() => {
    // 检测平台并显示对应的快捷键提示
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcutText = isMac ? 'Cmd+Shift+F' : 'Ctrl+Shift+F';

    const message = GM_getValue('lang', 'ZH') === 'EN' ?
        `🎬 FrameMaster Pro loaded! Press ${shortcutText} to open configuration panel` :
        `🎬 FrameMaster Pro 已加载！按 ${shortcutText} 打开配置面板`;

    configPanel.showNotification(message, 'success');
}, 2000);

    } // 结束 init 函数

// 调用 init 函数启动脚本
init();

}) (); // 结束 IIFE