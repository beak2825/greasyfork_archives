// ==UserScript==
// @name         cela-自动学习脚本模拟版
// @namespace    https://github.com/Moker32/
// @version      2.19.1
// @description  cela自动学习脚本，支持视频自动播放、进度监控、课程自动切换，支持课程列表页面批量学习。
// @author       Moker32
// @license      GPL-3.0-or-later
// @run-at       document-start
// @match        https://cela.e-celap.cn/page.html#/pc/nc/pagecourse/coursePlayer*
// @match        https://cela.e-celap.cn/page.html#/pc/nc/pagecourse/courseList*
// @match        https://cela.e-celap.cn/page.html#*
// @match        https://cela.e-celap.cn/ncIndex.html#/pc/nc/page/pd/pdchanel/specialdetail*
// @match        https://cela.e-celap.cn/ncIndex.html#*
// @match        https://cela.e-celap.cn/*
// @grant        GM_info
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542253/cela-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%E6%A8%A1%E6%8B%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542253/cela-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%E6%A8%A1%E6%8B%9F%E7%89%88.meta.js
// ==/UserScript==


(function() {
    'use strict';

// 新增：拦截"离开网站"弹窗 - 增强版 (已精简)
    function disableBeforeUnload() {
    console.log('🛡️ 启动终极版弹窗拦截机制 (策略B: 全自动模式)...');

    // 核心函数：包装指定窗口的 unload 事件，保留其功能但禁用弹窗
    function forceDisableUnload(win) {
        if (!win) return;
        try {
            // --- 策略1: 强制设为 null (基础清理) ---
            win.onbeforeunload = null;
            win.onunload = null;

            // --- 策略B: 使用 getter/setter 替换属性，巧妙地让所有赋值失效以实现全自动 ---
            Object.defineProperty(win, 'onbeforeunload', {
            get: function() {
                    return null; // 永远返回 null
                },
                set: function() {
                    console.log('🚫 (策略B) 成功拦截并忽略了一次 onbeforeunload 的赋值！');
                    // 什么也不做，直接忽略赋值，以此来阻止最终保存和弹窗
                },
                configurable: true // 保持可配置以遵守代理规则
            });
            Object.defineProperty(win, 'onunload', {
            get: function() {
                return null;
            },
                set: function() {
                    console.log('🚫 (策略B) 成功拦截并忽略了一次 onunload 的赋值！');
            },
            configurable: true
        });
        
            // --- 策略2: 拦截 addEventListener (作为补充) ---
            const originalAddEventListener = win.addEventListener;
            win.addEventListener = function(type, listener, options) {
                if (type === 'beforeunload' || type === 'unload') {
                    console.log('🚫 (策略B) 成功拦截并忽略了一个 beforeunload 事件监听器的添加！');
                    return; // 直接阻止添加
                }
                originalAddEventListener.call(win, type, listener, options);
            };
        } catch (e) {
            console.warn('⚠️ 在窗口上设置包装器失败:', e.message);
        }
    }

    // 1. 处理主窗口 (使用 unsafeWindow 冲破沙箱)
    forceDisableUnload(unsafeWindow);

    // 2. 处理已存在的 iframe
    document.querySelectorAll('iframe').forEach(iframe => {
        // iframe 加载需要时间，确保在加载后执行
         if (iframe.contentWindow) {
            forceDisableUnload(iframe.contentWindow);
        } else {
            iframe.addEventListener('load', () => {
                 forceDisableUnload(iframe.contentWindow);
            }, { once: true });
        }
    });

    // 3. 使用 MutationObserver 监控未来动态添加的 iframe
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IFRAME') {
                    console.log('✅ 检测到新的 iframe，准备拦截其弹窗事件...');
                    node.addEventListener('load', () => {
                         forceDisableUnload(node.contentWindow);
                         console.log('✅ 新 iframe 的弹窗事件已拦截。');
                    }, { once: true });
                }
            });
            });
        });
        
    // 启动监控
    // 修复：确保在 body 加载后再启动监控
    if (document.body) {
         observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        window.addEventListener('DOMContentLoaded', () => {
             observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }, { once: true });
    }


    console.log('🛡️ 终极版弹窗拦截机制已完全启动。');
    }

    // 配置参数 - 优化：支持用户自定义配置
    const DEFAULT_CONFIG = {
        // 基础设置
        checkInterval: 3000,          // 检查间隔(ms) - 优化性能，降低CPU占用
        progressCheckInterval: 5000,  // 进度检查间隔(ms) - 优化性能，合理检查频率
        maxWaitTime: 600000,         // 最大等待时间(10分钟) - 延长等待时间
        
        // 自动化设置
        autoPlay: true,              // 自动播放视频
        autoSwitchCourse: true,      // 自动切换课程
        completionDelay: 5000,       // 课程完成后的延迟（毫秒），以确保最终进度上报
        
        // 进度保存设置 - 改为纯视频事件驱动
        enhancedProgressSave: true,  // 启用增强进度保存（基于视频事件）
        
          // 防检测设置 - 优化以提高效率但保持安全
        enableRandomDelay: true,     // 启用随机延迟
        minDelay: 500,              // 最小延迟 - 减少等待时间
        maxDelay: 1500,             // 最大延迟 - 减少等待时间
        
        // 音频设置
        enforceGlobalMute: true,     // 强制全局静音播放
        
          // 调试设置
        debugMode: false,            // 调试模式
        showProgressIndicator: false, // 显示进度指示器
        showConsoleLog: true,       // 显示控制台日志UI
        maxLogEntries: 20,          // 最大显示日志条数
        
        // 课程状态管理设置
        useCourseName: true,        // 使用课程名称作为唯一ID
        skipCompletedCourses: true, // 跳过已完成的课程
        autoMarkCompleted: true,    // 自动标记100%进度的课程为已完成
        courseStatusStorageKey: 'china_cadre_course_status', // 课程状态存储键
        
        // DOM选择器配置 - 优化：集中管理所有选择器
        selectors: {
            // 视频播放器相关
            videoPlayer: '#emiya-video video',
            videoContainer: '#emiya-video',
            
            // 进度相关
            progressCircle: '.el-progress--circle[aria-valuenow]',
            progressText: '.el-progress__text',
            
            // 课程信息
            courseTitle: '.course-title, .video-title, h1, .title',
            courseName: '[class*="title"], [class*="name"]',
            
            // 课程列表
            courseList: 'ul li a[href*="coursePlayer"], .course-item a, a[href*="/course/"]',
            courseListContainer: 'ul, .course-list, .list-container',
            
            // 导航和控制
            nextButton: '.next-btn, [class*="next"], button[title*="下一"]',
            playButton: '.play-btn, [class*="play"], button[title*="播放"]',
            
            // 弹窗和模态框
            modal: '.el-dialog, .modal, .popup',
            closeButton: '.el-dialog__close, .close-btn, .modal-close'
        }
    };

    // 配置管理器 - 新增：支持用户自定义配置
    class ConfigManager {
        constructor() {
            this.storageKey = 'china_cadre_script_config';
            this.config = this.loadConfig();
        }

        loadConfig() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                const userConfig = stored ? JSON.parse(stored) : {};
                return { ...DEFAULT_CONFIG, ...userConfig };
            } catch (error) {
                console.error('❌ 加载用户配置失败:', error);
                return { ...DEFAULT_CONFIG };
            }
        }

        saveConfig() {
            try {
                const configToSave = { ...this.config };
                delete configToSave.selectors; // 不保存选择器配置，始终使用默认值
                localStorage.setItem(this.storageKey, JSON.stringify(configToSave));
                console.log('💾 用户配置已保存');
            } catch (error) {
                console.error('❌ 保存用户配置失败:', error);
            }
        }

        updateConfig(key, value) {
            this.config[key] = value;
            this.saveConfig();
        }

        getConfig(key) {
            return this.config[key];
        }

        getAllConfig() {
            return { ...this.config };
        }

        resetToDefault() {
            this.config = { ...DEFAULT_CONFIG };
            localStorage.removeItem(this.storageKey);
            console.log('🔄 配置已重置为默认值');
        }
    }

    // 初始化配置管理器
    const configManager = new ConfigManager();
    const CONFIG = configManager.getAllConfig();

    // 启动弹窗拦截，必须在CONFIG定义之后执行
    disableBeforeUnload();

    // 课程状态管理器
    class CourseStatusManager {
        constructor() {
            this.storageKey = CONFIG.courseStatusStorageKey;
            this.courseStatuses = this.loadCourseStatuses();
        }

        // 从localStorage加载课程状态
        loadCourseStatuses() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                return stored ? JSON.parse(stored) : {};
            } catch (error) {
                console.error('❌ 加载课程状态失败:', error);
                return {};
            }
        }

        // 保存课程状态到localStorage
        saveCourseStatuses() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.courseStatuses));
                console.log('💾 课程状态已保存');
            } catch (error) {
                console.error('❌ 保存课程状态失败:', error);
            }
        }

        // 获取课程唯一ID（使用课程名称）
        getCourseId(courseName) {
            if (typeof courseName !== 'string' || !courseName) {
                // 如果课程名称无效，返回一个唯一的、安全的ID，防止后续操作出错
                return `invalid_course_id_${Date.now()}_${Math.random()}`;
            }
            return courseName.trim().replace(/\s+/g, '_');
        }

        // 记录课程状态
        setCourseStatus(courseName, status) {
            const courseId = this.getCourseId(courseName);
            if (!this.courseStatuses[courseId]) {
                this.courseStatuses[courseId] = {};
            }
            
            this.courseStatuses[courseId] = {
                ...this.courseStatuses[courseId],
                name: courseName,
                status: status,
                lastUpdate: new Date().toISOString()
            };
            
            this.saveCourseStatuses();
            console.log(`📝 课程状态已更新: ${courseName} -> ${status}`);
        }

        // 获取课程状态
        getCourseStatus(courseName) {
            const courseId = this.getCourseId(courseName);
            return this.courseStatuses[courseId] || null;
        }

        // 检查课程是否已完成
        isCourseCompleted(courseName) {
            const status = this.getCourseStatus(courseName);
            return status && status.status === 'completed';
        }

        // 标记课程为已完成
        markCourseCompleted(courseName) {
            this.setCourseStatus(courseName, 'completed');
        }

        // 标记课程为进行中
        markCourseInProgress(courseName) {
            this.setCourseStatus(courseName, 'in_progress');
        }

        // 获取所有课程状态
        getAllCourseStatuses() {
            return this.courseStatuses;
        }

        // 清除所有课程状态
        clearAllStatuses() {
            this.courseStatuses = {};
            this.saveCourseStatuses();
            console.log('🗑️ 所有课程状态已清除');
        }

        // 获取统计信息
        getStatistics() {
            const statuses = Object.values(this.courseStatuses);
            const completed = statuses.filter(s => s.status === 'completed').length;
            const inProgress = statuses.filter(s => s.status === 'in_progress').length;
            const total = statuses.length;

            return {
                total,
                completed,
                inProgress,
                completionRate: total > 0 ? (completed / total * 100).toFixed(1) : 0
            };
        }
    }



    // Aura设计系统 - 精polish版UI样式
    const SCRIPT_STYLES = `
        :root {
            --aura-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Source Han Sans SC', 'Helvetica Neue', 'Arial', sans-serif;
            --aura-primary: #007AFF;
            --aura-success: #34C759;
            --aura-warning: #FF9500;
            --aura-danger: #FF3B30;
            --aura-text-primary: #1D1D1F;
            --aura-text-secondary: #6E6E73;
            --aura-bg-glass: rgba(252, 252, 252, 0.8);
            --aura-bg-accent: rgba(235, 235, 245, 0.7);
            --aura-border: rgba(0, 0, 0, 0.08);
            --aura-shadow: 0px 10px 35px rgba(0, 0, 0, 0.08);
            --aura-radius-lg: 18px;
            --aura-radius-md: 10px;
            --aura-transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .aura-panel, .auto-learn-container {
            position: fixed;
            font-family: var(--aura-font-family);
            color: var(--aura-text-primary);
            background-color: var(--aura-bg-glass);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid var(--aura-border);
            border-radius: var(--aura-radius-lg);
            box-shadow: var(--aura-shadow);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }

        .aura-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            border-bottom: 1px solid var(--aura-border);
            cursor: move;
            flex-shrink: 0;
        }

        .aura-title, .auto-learn-title { font-size: 16px; font-weight: 600; }

        .aura-header-controls { display: flex; align-items: center; gap: 4px; }

        .aura-icon-btn, .auto-learn-header-control-btn {
            display: flex; align-items: center; justify-content: center;
            width: 30px; height: 30px; padding: 0; border: none;
            background-color: transparent;
            border-radius: var(--aura-radius-md);
            color: var(--aura-text-secondary);
            cursor: pointer; transition: var(--aura-transition);
        }
        .aura-icon-btn:hover, .auto-learn-header-control-btn:hover {
            background-color: var(--aura-bg-accent);
            color: var(--aura-text-primary);
            transform: scale(1.05);
        }

        .aura-icon { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; }
        .aura-icon svg { width: 100%; height: 100%; }

        .aura-stats-bar, .auto-learn-stats {
            padding: 10px 16px;
            border-bottom: 1px solid var(--aura-border);
            font-size: 13px; color: var(--aura-text-secondary);
            text-align: center; font-weight: 500; flex-shrink: 0;
        }

        .aura-content, .auto-learn-content-container {
            flex: 1 1 auto; overflow-y: auto;
            transition: opacity 0.2s ease-in, max-height 0.3s ease-out;
            max-height: 500px; opacity: 1;
        }
        .aura-content.collapsed, .auto-learn-content-container.collapsed { max-height: 0; opacity: 0; }

        .aura-course-list, .auto-learn-course-list { list-style: none; padding: 8px; margin: 0; }

        .aura-course-item, .auto-learn-course-item {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px;
            border-radius: var(--aura-radius-md);
            cursor: pointer; transition: var(--aura-transition);
            text-decoration: none; color: var(--aura-text-primary);
            font-size: 14px; margin-bottom: 4px;
        }
        .aura-course-item:hover, .auto-learn-course-item:hover { background-color: var(--aura-bg-accent); }
        .aura-course-item.in-progress, .auto-learn-course-item.in-progress { font-weight: 600; color: var(--aura-primary); background-color: rgba(0, 122, 255, 0.1); }
        .aura-course-item.completed, .auto-learn-course-item.completed { color: var(--aura-text-secondary); }
        .aura-course-item.completed .aura-course-name { text-decoration: line-through; }

        .aura-course-status-icon { width: 20px; height: 20px; flex-shrink: 0; }
        .aura-course-status-icon .aura-icon { width: 100%; height: 100%; }

        .aura-log-entry, .auto-learn-log-entry {
            padding: 8px 16px;
            font-size: 13px; line-height: 1.5;
            color: var(--aura-text-secondary);
            border-bottom: 1px solid var(--aura-border);
            transition: background-color 0.3s;
        }
        .aura-log-entry.latest { background-color: rgba(0, 122, 255, 0.08); }
        .aura-log-entry strong, .auto-learn-log-entry strong { font-weight: 500; color: var(--aura-text-primary); }
        .auto-learn-log-entry.latest-log-highlight { background-color: rgba(0, 122, 255, 0.08); }

        .aura-footer, .auto-learn-footer {
            padding: 12px; border-top: 1px solid var(--aura-border);
            flex-shrink: 0; transition: var(--aura-transition);
            max-height: 100px; opacity: 1; overflow: hidden;
        }
        .aura-footer.collapsed, .auto-learn-footer.collapsed { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; }

        .aura-button, .auto-learn-button {
            width: 100%; padding: 12px; border: none;
            border-radius: var(--aura-radius-md);
            font-size: 14px; font-weight: 600;
            cursor: pointer; transition: var(--aura-transition);
            display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .aura-button .aura-icon { width: 16px; height: 16px; }
        .aura-button.primary, .auto-learn-button.primary { background-color: var(--aura-primary); color: white; }
        .aura-button.primary:hover, .auto-learn-button.primary:hover { transform: scale(1.02); box-shadow: 0 4px 15px rgba(0, 122, 255, 0.2); }
        .aura-button.success, .auto-learn-button.success { background-color: var(--aura-success); color: white; }
        .auto-learn-button.warning { background-color: var(--aura-warning); color: white; }
        .auto-learn-button.danger { background-color: var(--aura-danger); color: white; }
        .auto-learn-button:disabled { opacity: 0.6; cursor: not-allowed; }

        .aura-modal-overlay, .auto-learn-modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 1000000; display: flex; align-items: center; justify-content: center;
        }

        .aura-modal, .auto-learn-modal {
            background: var(--aura-bg-glass);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border-radius: var(--aura-radius-lg);
            box-shadow: var(--aura-shadow);
            max-width: 500px; width: 90vw;
            max-height: 90vh; overflow: auto; position: relative;
            padding: 24px;
        }

        .aura-modal-close-btn {
            position: absolute; top: 12px; right: 12px;
            width: 32px; height: 32px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%;
            background-color: var(--aura-bg-accent);
            color: var(--aura-text-secondary);
            cursor: pointer; transition: var(--aura-transition);
            border: none; padding: 0;
        }
        .aura-modal-close-btn:hover { transform: scale(1.05) rotate(90deg); color: var(--aura-text-primary); }
        .aura-modal-close-btn .aura-icon { width: 16px; height: 16px; }

        .aura-settings-panel, .auto-learn-settings-panel { max-height: 450px; overflow-y: auto; padding-right: 8px; }

        .aura-setting-group-title {
            margin: 20px 0 10px 0; padding-bottom: 6px;
            border-bottom: 1px solid var(--aura-border);
            color: var(--aura-text-primary); font-size: 14px; font-weight: 600;
        }
        .aura-setting-group-title:first-of-type { margin-top: 0; }

        .aura-setting-item, .auto-learn-setting-item {
            display: flex; justify-content: space-between; align-items: flex-start;
            padding: 14px 4px;
            border-bottom: 1px solid var(--aura-border);
        }
        .aura-setting-item:last-child, .auto-learn-setting-item:last-child { border-bottom: none; }

        .aura-setting-label-group { display: flex; flex-direction: column; padding-right: 16px; }
        .aura-setting-label, .auto-learn-setting-label { font-weight: 500; color: var(--aura-text-primary); font-size: 14px; }
        .aura-setting-description, .auto-learn-setting-description { font-size: 12px; color: var(--aura-text-secondary); margin-top: 4px; }

        .aura-setting-control, .auto-learn-setting-control { display: flex; align-items: center; flex-shrink: 0; padding-top: 2px; }

        .aura-checkbox, .auto-learn-checkbox { width: 20px; height: 20px; cursor: pointer; accent-color: var(--aura-primary); }

        .aura-input, .auto-learn-input {
            padding: 6px 10px; border: 1px solid var(--aura-border);
            border-radius: var(--aura-radius-md); font-size: 13px;
            width: 80px; background-color: var(--aura-bg-accent);
            transition: var(--aura-transition);
        }
        .aura-input:focus, .auto-learn-input:focus { background-color: white; border-color: var(--aura-primary); outline: none; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .aura-icon.spinning { animation: spin 1.5s linear infinite; }
    `;

    // 注入样式表 - 优化：在脚本初始化时注入所有样式
    function injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.id = "auto-learning-styles";
        styleSheet.textContent = SCRIPT_STYLES;
        
        // 确保样式表被正确插入
        if (document.head) {
            document.head.appendChild(styleSheet);
        } else {
            // 如果head还没有加载，等待DOM加载完成
            document.addEventListener('DOMContentLoaded', () => {
                document.head.appendChild(styleSheet);
            });
        }
        
        console.log('🎨 样式表已注入');
    }

    // 统一UI工具类
    class UIBuilder {
        static ICONS = {
            CHEVRON_DOWN: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
            CHEVRON_UP: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
            SETTINGS: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
            RESET: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
            HELP: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            CLOSE: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            PLAY: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>`,
            SUCCESS: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            IN_PROGRESS: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
            WARNING: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            ERROR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
            INFO: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
        };

        static createIcon(iconName, options = {}) {
            const iconContainer = document.createElement('div');
            const svgString = this.ICONS[iconName];
            if (!svgString) return null;

            iconContainer.className = 'aura-icon ' + (options.className || '');
            iconContainer.innerHTML = svgString;

            if (options.color) {
                iconContainer.style.color = options.color;
            }

            return iconContainer;
        }

        static createContainer(options = {}) {
            const container = document.createElement('div');
            
            // 优化：使用CSS类而不是内联样式
            container.className = 'auto-learn-container' + (options.className ? ' ' + options.className : '');
            
            if (options.id) container.id = options.id;
            
            // 只处理位置相关的内联样式，其他样式通过CSS类处理
            if (options.style) {
                const positionStyles = {};
                const allowedInlineStyles = ['top', 'left', 'right', 'bottom', 'width', 'height', 'maxHeight', 'maxWidth'];
                
                Object.entries(options.style).forEach(([key, value]) => {
                    if (allowedInlineStyles.includes(key)) {
                        positionStyles[this.camelToKebab(key)] = value;
                    }
                });
                
                container.style.cssText = Object.entries(positionStyles)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('; ');
            }

            return container;
        }

        static createButton(text, options = {}) {
            const button = document.createElement('button');
            
            // 优化：使用CSS类而不是内联样式
            let className = 'auto-learn-button';
            
            // 根据选项添加相应的CSS类
            if (options.variant) {
                className += ` ${options.variant}`;
            } else if (options.style) {
                // 为了向后兼容，检查内联样式中的背景色
                const bgColor = options.style.background || options.style.backgroundColor;
                if (bgColor === '#007AFF' || bgColor === '#4A90E2') className += ' primary';
                else if (bgColor === '#34C759' || bgColor === '#5CB85C') className += ' success';
                else if (bgColor === '#FF9500' || bgColor === '#F0AD4E') className += ' warning';
                else if (bgColor === '#FF3B30' || bgColor === '#D9534F') className += ' danger';
            }
            
            if (options.className) {
                className += ` ${options.className}`;
            }
            
            button.className = className;

            // 处理图标
            if (options.icon) {
                const icon = this.createIcon(options.icon);
                if (icon) {
                    button.appendChild(icon);
                }
            }

            // 添加文本
            const textSpan = document.createElement('span');
            textSpan.textContent = text;
            button.appendChild(textSpan);

            // 只处理特殊的内联样式（如尺寸、位置等）
            if (options.style) {
                const allowedInlineStyles = ['width', 'height', 'minWidth', 'maxWidth', 'padding', 'margin', 'fontSize', 'position', 'top', 'right', 'bottom', 'left'];
                const inlineStyles = {};
                
                Object.entries(options.style).forEach(([key, value]) => {
                    if (allowedInlineStyles.includes(key)) {
                        inlineStyles[this.camelToKebab(key)] = value;
                    }
                });
                
                if (Object.keys(inlineStyles).length > 0) {
                    button.style.cssText = Object.entries(inlineStyles)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('; ');
                }
            }

            // 事件处理
            if (options.onClick) {
                button.addEventListener('click', options.onClick);
            }

            if (options.title) {
                button.title = options.title;
            }

            if (options.disabled) {
                button.disabled = true;
            }

            return button;
        }

        static createTitle(text, options = {}) {
            const title = document.createElement('div');
            
            // 优化：使用CSS类而不是内联样式
            title.className = 'auto-learn-title' + (options.className ? ' ' + options.className : '');
            title.textContent = text;
            
            // 只处理特殊的内联样式
            if (options.style) {
                const allowedInlineStyles = ['fontSize', 'textAlign', 'margin', 'padding'];
                const inlineStyles = {};
                
                Object.entries(options.style).forEach(([key, value]) => {
                    if (allowedInlineStyles.includes(key)) {
                        inlineStyles[this.camelToKebab(key)] = value;
                    }
                });
                
                if (Object.keys(inlineStyles).length > 0) {
                    title.style.cssText = Object.entries(inlineStyles)
                        .map(([key, value]) => `${key}: ${value}`)
                .join('; ');
                }
            }

            return title;
        }

        static createModal(content, options = {}) {
            const overlay = document.createElement('div');
            
            // 优化：使用CSS类而不是内联样式
            overlay.className = 'auto-learn-modal-overlay';

            const modal = document.createElement('div');
            modal.className = 'auto-learn-modal';
            
            // 处理模态框的特殊样式
            if (options.modalStyle) {
                const allowedInlineStyles = ['maxWidth', 'maxHeight', 'width', 'height'];
                const inlineStyles = {};
                
                Object.entries(options.modalStyle).forEach(([key, value]) => {
                    if (allowedInlineStyles.includes(key)) {
                        inlineStyles[this.camelToKebab(key)] = value;
                    }
                });
                
                if (Object.keys(inlineStyles).length > 0) {
                    modal.style.cssText = Object.entries(inlineStyles)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('; ');
                }
            }

            if (typeof content === 'string') {
                modal.innerHTML = content;
            } else {
                modal.appendChild(content);
            }

            if (options.closable !== false) {
                const closeBtn = this.createButton('', {
                    icon: 'CLOSE',
                    className: 'aura-modal-close-btn',
                    onClick: () => {
                        overlay.remove();
                        if (options.onClose) options.onClose();
                    }
                });
                modal.appendChild(closeBtn);
            }

            overlay.appendChild(modal);

            if (options.closeOnOverlay !== false) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        overlay.remove();
                        if (options.onClose) options.onClose();
                    }
                });
            }

            return overlay;
        }

        static camelToKebab(str) {
            return str.replace(/([A-Z])/g, '-$1').toLowerCase();
        }

        // 新增：创建设置面板 - 优化：UI驱动的配置管理，分组显示
        static createSettingsPanel() {
            const settingsConfig = {
                '通用设置': [
                    {
                        key: 'enforceGlobalMute',
                        label: '强制静音',
                        description: '强制所有视频静音播放',
                        type: 'checkbox'
                    },
                    {
                        key: 'maxLogEntries',
                        label: '最大日志条数',
                        description: '日志面板显示的最大条目数',
                        type: 'number',
                        min: 5,
                        max: 50
                    }
                ],
                '自动化行为': [
                    {
                        key: 'autoPlay',
                        label: '自动播放',
                        description: '自动播放视频',
                        type: 'checkbox'
                    },
                    {
                        key: 'autoSwitchCourse',
                        label: '自动切换课程',
                        description: '完成当前课程后自动切换到下一个',
                        type: 'checkbox'
                    }
                ],
                '高级设置': [
                    {
                        key: 'enableRandomDelay',
                        label: '随机延迟',
                        description: '启用随机延迟以避免检测',
                        type: 'checkbox'
                    },
                    {
                        key: 'checkInterval',
                        label: '检查间隔 (ms)',
                        description: '视频状态检查间隔时间',
                        type: 'number',
                        min: 1000,
                        max: 10000
                    },
                    {
                        key: 'progressCheckInterval',
                        label: '进度检查间隔 (ms)',
                        description: '学习进度检查间隔时间',
                        type: 'number',
                        min: 1000,
                        max: 15000
                    }
                ]
            };

            const panel = document.createElement('div');
            panel.className = 'auto-learn-settings-panel';

            // 优化：按分组渲染设置项
            Object.entries(settingsConfig).forEach(([groupTitle, settings]) => {
                // 创建分组标题
                const groupHeader = document.createElement('h4');
                groupHeader.textContent = groupTitle;
                groupHeader.style.cssText = `
                    margin: 16px 0 8px 0;
                    padding-bottom: 4px;
                    border-bottom: 1px solid var(--aura-border);
                    color: var(--aura-text-primary);
                    font-size: 14px;
                    font-weight: 600;
                `;
                if (groupTitle !== Object.keys(settingsConfig)[0]) {
                    panel.appendChild(groupHeader);
                } else {
                    // 第一个分组不需要上边距
                    groupHeader.style.marginTop = '0';
                    panel.appendChild(groupHeader);
                }

                // 渲染该分组下的设置项
                settings.forEach(setting => {
                const item = document.createElement('div');
                item.className = 'auto-learn-setting-item';

                // 创建标签组容器
                const labelGroup = document.createElement('div');
                labelGroup.className = 'aura-setting-label-group';

                const label = document.createElement('div');
                label.className = 'auto-learn-setting-label';
                label.textContent = setting.label;
                labelGroup.appendChild(label);

                if (setting.description) {
                    const desc = document.createElement('div');
                    desc.className = 'auto-learn-setting-description';
                    desc.textContent = setting.description;
                    labelGroup.appendChild(desc);
                }

                const controlDiv = document.createElement('div');
                controlDiv.className = 'auto-learn-setting-control';

                if (setting.type === 'checkbox') {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'auto-learn-checkbox';
                    checkbox.checked = configManager.getConfig(setting.key);
                    checkbox.addEventListener('change', (e) => {
                        configManager.updateConfig(setting.key, e.target.checked);
                        console.log(`⚙️ 配置已更新: ${setting.key} = ${e.target.checked}`);
                    });
                    controlDiv.appendChild(checkbox);
                } else if (setting.type === 'number') {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.className = 'auto-learn-input';
                    input.value = configManager.getConfig(setting.key);
                    input.min = setting.min;
                    input.max = setting.max;
                    input.addEventListener('change', (e) => {
                        const value = parseInt(e.target.value);
                        if (value >= setting.min && value <= setting.max) {
                            configManager.updateConfig(setting.key, value);
                            console.log(`⚙️ 配置已更新: ${setting.key} = ${value}`);
                        }
                    });
                    controlDiv.appendChild(input);
                }

                item.appendChild(labelGroup);
                item.appendChild(controlDiv);
                panel.appendChild(item);
                });
            });

            // 添加重置按钮
            const resetDiv = document.createElement('div');
            resetDiv.style.marginTop = '16px';
            resetDiv.style.textAlign = 'center';

            const resetBtn = this.createButton('重置为默认值', {
                variant: 'warning',
                style: { width: '100%' },
                onClick: () => {
                    if (confirm('确定要重置所有配置为默认值吗？')) {
                        configManager.resetToDefault();
                        alert('配置已重置，请刷新页面以应用更改。');
                    }
                }
            });
            resetDiv.appendChild(resetBtn);
            panel.appendChild(resetDiv);

            return panel;
        }

        static updateCourseStats() {
            const statsContainer = document.getElementById('learning-stats-container');
            if (!statsContainer) return;

            const stats = courseStatusManager.getStatistics();
            const { completed = 0, total = 0, inProgress = 0 } = stats;

            if (total === 0 && inProgress === 0) {
                 statsContainer.textContent = '暂无课程，请先访问课程列表页';
                 return;
            }
            
            const remaining = total - completed;
            statsContainer.textContent = `已完成: ${completed} | 剩余: ${remaining} | 总计: ${total}`;
            this.updateCourseListDisplay();
        }

        static updateCourseListDisplay() {
            const courseListContainer = document.getElementById('course-list-items-container');
            if (!courseListContainer) return;

            const courseElements = SharedUtils.findCourseElements();
            const courses = courseElements.map(courseInfo => ({
                name: courseInfo.name,
                href: courseInfo.href,
                isCompleted: courseStatusManager.isCourseCompleted(courseInfo.name),
                status: courseStatusManager.getCourseStatus(courseInfo.name)?.status || 'not_started'
            }));

            this.renderCourseList(courseListContainer, courses);
        }

        static addLogEntry(message, type = 'info') {
            const logDisplayContainer = document.getElementById('auto-learning-log-player');
            const scrollableContainer = document.getElementById('universal-content-container');

            if (!logDisplayContainer || !scrollableContainer) return;

            const prevHighlight = logDisplayContainer.querySelector('.latest-log-highlight');
            if (prevHighlight) {
                prevHighlight.classList.remove('latest-log-highlight');
            }

            const typeToColor = {
                info: 'var(--aura-text-secondary)',
                success: 'var(--aura-success)',
                warning: 'var(--aura-warning)',
                error: 'var(--aura-danger)'
            };
            const color = typeToColor[type.toLowerCase()] || 'var(--aura-text-secondary)';

            const entry = document.createElement('div');
            
            // 优化：使用CSS类而不是内联样式
            entry.className = 'auto-learn-log-entry latest-log-highlight';
            entry.style.color = color; // 颜色仍需内联设置，因为是动态的
            
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            // 优化：高亮日志中的关键信息
            let formattedMessage = message;
            // 高亮被引号包裹的课程名称
            formattedMessage = formattedMessage.replace(/"(.*?)"/g, '<strong style="color: #2c3e50;">"$1"</strong>');
            // 高亮百分比
            formattedMessage = formattedMessage.replace(/(\d+%)/g, '<strong style="color: #27ae60;">$1</strong>');
            // 高亮数字（如课程数量）
            formattedMessage = formattedMessage.replace(/(\d+)(?=\s*(?:个|门|课程|项目))/g, '<strong style="color: #3498db;">$1</strong>');
            // 高亮状态关键词
            formattedMessage = formattedMessage.replace(/(已完成|进行中|失败|成功|开始|结束)/g, '<strong>$1</strong>');
            
            entry.innerHTML = `<span style="font-family: monospace; font-size: 12px; color: #999; margin-right: 5px;">[${timestamp}]</span>${formattedMessage}`;

            logDisplayContainer.appendChild(entry);

            const maxEntries = CONFIG.maxLogEntries || 20;
            while (logDisplayContainer.children.length > maxEntries) {
                logDisplayContainer.removeChild(logDisplayContainer.firstChild);
            }

            scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
        }

        static createUniversalUI(options = {}) {
            const { 
                pageType = 'player',
                courses = [],
                onStartLearning = null,
                onReset = null,
                onHelp = null
            } = options;

            const container = this.createContainer({
                id: 'auto-learning-universal-ui',
                style: {
                    bottom: '20px',
                    right: '20px',
                    width: '380px',
                    height: '550px',
                    overflow: 'hidden',
                    padding: '0'
                }
            });

            // Header
            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background-color: var(--aura-bg-accent);
                border-bottom: 1px solid var(--aura-border);
                flex-shrink: 0;
            `;
            const title = this.createTitle('自动学习助手', {
                style: {
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0',
                    border: 'none',
                    padding: '0'
                }
            });
            header.appendChild(title);

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.gap = '8px';

            const toggleBtn = this.createButton('', {
                icon: 'CHEVRON_DOWN',
                title: '收起/展开',
                className: 'auto-learn-header-control-btn'
            });
            controls.appendChild(toggleBtn);
            
            const resetBtn = this.createButton('', {
                icon: 'RESET',
                title: '重置学习状态',
                onClick: onReset,
                className: 'auto-learn-header-control-btn'
            });
            controls.appendChild(resetBtn);

            const helpBtn = this.createButton('', {
                icon: 'HELP',
                title: '帮助',
                onClick: onHelp,
                className: 'auto-learn-header-control-btn'
            });
            controls.appendChild(helpBtn);

            const settingsBtn = this.createButton('', {
                icon: 'SETTINGS',
                title: '设置',
                onClick: () => {
                    const settingsPanel = this.createSettingsPanel();
                    const modal = this.createModal(settingsPanel, {
                        modalStyle: { maxWidth: '500px' }
                    });
                    document.body.appendChild(modal);
                },
                className: 'auto-learn-header-control-btn'
            });
            controls.appendChild(settingsBtn);
            header.appendChild(controls);
            container.appendChild(header);

            // Stats Bar
            const statsContainer = document.createElement('div');
            statsContainer.id = 'learning-stats-container';
            statsContainer.className = 'auto-learn-stats';
            statsContainer.textContent = '统计信息加载中...';
            container.appendChild(statsContainer);

            // Main Content
            const contentContainer = document.createElement('div');
            contentContainer.id = 'universal-content-container';
            contentContainer.className = 'auto-learn-content-container';
            Object.assign(contentContainer.style, {
                flex: '1 1 auto',
                overflowY: 'auto',
                padding: '10px',
            });

            let courseListContainer = null;
            let logContainer = null;

            if (pageType === 'list') {
                courseListContainer = document.createElement('div');
                courseListContainer.id = 'course-list-items-container';
                this.renderCourseList(courseListContainer, courses);
                contentContainer.appendChild(courseListContainer);
            } else {
                logContainer = document.createElement('div');
                logContainer.id = 'auto-learning-log-player';
                logContainer.style.padding = '5px';
                logContainer.textContent = '等待学习开始...';
                contentContainer.appendChild(logContainer);
            }
            container.appendChild(contentContainer);

            // Footer/Action Bar
            if (pageType === 'list') {
                const footer = document.createElement('div');
                footer.className = 'auto-learn-footer';
                footer.style.cssText = `
                    padding: 12px;
                    border-top: 1px solid var(--aura-border);
                    flex-shrink: 0;
                `;
                const mainButton = this.createButton('开始学习', {
                    icon: 'PLAY',
                style: { 
                        width: '100%',
                        background: 'var(--aura-primary)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    },
                    title: '点击开始自动学习未完成课程',
                    onClick: onStartLearning
                });

                const firstUncompleted = courses.find(c => !c.isCompleted);
                if (!firstUncompleted) {
                    mainButton.querySelector('span').textContent = '全部完成';
                    mainButton.style.background = 'var(--aura-success)';
                    mainButton.disabled = true;
                }
                footer.appendChild(mainButton);
                container.appendChild(footer);
            }
            
            document.body.appendChild(container);

            // Toggle functionality - 优化：使用平滑动画
            let isExpanded = true;
            const footer = container.querySelector('.auto-learn-footer');

            toggleBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;

                // 使用CSS类切换而不是直接修改样式
                contentContainer.classList.toggle('collapsed', !isExpanded);
                if (footer) {
                    footer.classList.toggle('collapsed', !isExpanded);
                }

                // 计算折叠后的高度
                const headerHeight = header.offsetHeight;
                const statsHeight = statsContainer.offsetHeight;
                const collapsedHeight = headerHeight + statsHeight + 2; // +2px for potential borders/margins

                container.style.height = isExpanded ? '550px' : `${collapsedHeight}px`;
                
                // 更新图标，找到图标元素
                const iconElement = toggleBtn.querySelector('.aura-icon');
                if (iconElement) {
                    iconElement.innerHTML = isExpanded ? this.ICONS.CHEVRON_DOWN : this.ICONS.CHEVRON_UP;
                }
            });

            this.updateCourseStats();
            console.log(`🎨 通用UI创建成功 (${pageType}模式)`);
            return { container, contentContainer, courseListContainer, logContainer };
        }

        static renderCourseList(container, courses) {
            if (!container) return;
            container.innerHTML = '';

            if (!courses || courses.length === 0) {
                container.innerHTML = '<div style="color: var(--aura-text-secondary); padding: 20px; text-align: center;">未发现可学习的课程。</div>';
                return;
            }

            const list = document.createElement('ul');
            list.className = 'aura-course-list auto-learn-course-list';

            courses.forEach((course, index) => {
                const { status, isCompleted } = courseStatusManager.getCourseStatus(course.name) || { status: 'not_started', isCompleted: false };
                const isInProgress = status === 'in_progress';

                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = course.href || '#';
                
                // 使用新的CSS类
                let className = 'aura-course-item auto-learn-course-item';
                if (isCompleted) className += ' completed';
                else if (isInProgress) className += ' in-progress';
                a.className = className;

                // 创建状态图标
                const statusIconContainer = document.createElement('div');
                statusIconContainer.className = 'aura-course-status-icon';
                if (isCompleted) {
                    statusIconContainer.appendChild(this.createIcon('SUCCESS', { color: 'var(--aura-success)' }));
                } else if (isInProgress) {
                    const progressIcon = this.createIcon('IN_PROGRESS');
                    progressIcon.classList.add('spinning'); // 添加旋转动画
                    statusIconContainer.appendChild(progressIcon);
                }

                // 创建课程名称
                const courseName = document.createElement('span');
                courseName.textContent = course.name || '';

                a.appendChild(statusIconContainer);
                a.appendChild(courseName);

                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (!isCompleted) {
                        courseListHandler.startCourse(course);
                    } else {
                        UIBuilder.addLogEntry(`课程 "${course.name}" 已完成，无需重复学习。`, 'info');
                    }
                });

                li.appendChild(a);

                if (isInProgress) {
                    setTimeout(() => li.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                }

                list.appendChild(li);
            });

            container.appendChild(list);
        }
    }

// 共享工具函数
const SharedUtils = {
    /**
     * 从指定上下文元素中按选择器优先级提取文本内容
     * @param {Element} context - 查找的上下文 (例如 document 或某个特定元素)
     * @param {string[]} selectors - 选择器数组
     * @returns {string|null} 找到的文本内容或 null
     */
    findTextContent(context, selectors) {
        for (const selector of selectors) {
            const element = context.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        return null;
    },

    // 优化版课程元素查找 - 减少冗余代码
    findCourseElements() {
        // 优化选择器，使其更精确，减少重复查找
        const selectors = [
            // 优先使用最明确的、带有唯一属性的父级容器下的条目
            '.specialdetail_catalogue .catalogue_item[ctrl_type="dsf.pdzlcard2"]',
            // 备用选择器
            '.catalogue_content .catalogue_item',
            'a[href*="coursePlayer"]'
        ];

        const allCourses = this.findCoursesWithSelectors(selectors);
        return this.deduplicateCourses(allCourses);
    },

    // 统一的选择器查找方法，减少重复代码
    findCoursesWithSelectors(selectors) {
        const courses = [];

        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                console.log(`🎯 "${selector}": ${elements.length}个元素`);

                elements.forEach(el => {
                    const courseInfo = this.extractCourseInfo(el, selector);
                    if (courseInfo && this.isValidCourse(courseInfo)) {
                        courses.push(courseInfo);
                    }
                });
            } catch (error) {
                console.warn(`⚠️ 选择器"${selector}"执行失败:`, error);
            }
        });

        return courses;
    },

    // 统一的课程信息提取方法
    extractCourseInfo(element, selector) {
        const courseInfo = {
            element: element,
            href: element.href || element.getAttribute('href'),
            name: '', // 统一使用 name
            selector: selector,
            isCatalogueItem: selector.includes('catalogue_item'),
            hasDataAttributes: element.hasAttribute('data-course-id') || element.hasAttribute('data-lesson-id')
        };

        // 优先从特定子元素中查找标题
        const titleElement = element.querySelector('.item-title, .title, .name, h3, h4, .course-title');
        if (titleElement) {
            courseInfo.name = titleElement.textContent.trim();
        } else {
            // 如果找不到特定子元素，则使用元素自身的文本或属性作为后备
            courseInfo.name = (element.textContent || element.title || element.getAttribute('title') || element.getAttribute('alt') || '').trim();
        }

        // 如果最终标题为空，则不处理
        if (!courseInfo.name) {
            return null;
        }


        // 根据元素类型提取href
        if (courseInfo.isCatalogueItem && !courseInfo.href) {
            courseInfo.href = `catalogue-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        } else if (courseInfo.hasDataAttributes && !courseInfo.href) {
            courseInfo.href = `data-course-${element.getAttribute('data-course-id') || element.getAttribute('data-lesson-id')}`;
        }

        return courseInfo;
    },

    // 优化版课程验证 - 合并重复的验证逻辑
    isValidCourse(courseInfo) {
        // 在提取阶段已经过滤了无效课程，这里可以简化
        if (!courseInfo || !courseInfo.name) {
            return false;
        }

        const { element, href } = courseInfo;

        // 1. 课程目录条目和有数据属性的元素直接认为有效
        if (courseInfo.isCatalogueItem || courseInfo.hasDataAttributes) {
            return true;
        }

        // 2. 检查onclick事件
        const onclickAttr = element.getAttribute('onclick');
        if (onclickAttr && /course|play|learn/i.test(onclickAttr)) {
            return true;
        }

        // 3. URL验证（合并原有的多个URL检查方法）
        if (href && this.isValidCourseURL(href)) {
            return true;
        }

        // 4. 检查元素结构特征
        const structureSelectors = [
            '.item-title, .course-title, .video-title, .lesson-title',
            '.duration, .time-icon, .course-info, .instructor, .teacher'
        ];

        return structureSelectors.some(sel => element.querySelector(sel) !== null);
    },

    // 简化的URL验证
    isValidCourseURL(href) {
        if (!href || href === '#') return false;

        // 允许特殊标识符和标准课程URL模式
        return href.includes('catalogue-item-') ||
               href.includes('data-course-') ||
               /coursePlayer|pagecourse|\/course\/|play.*course|learn.*course/i.test(href);
    },

    // 课程去重
    deduplicateCourses(courses) {
        const seen = new Set();
        return courses.filter(course => {
            // 恢复原始的、更健壮的去重逻辑
            const titleElement = course.element.querySelector('.item-title, .title, .name, h3, h4, .course-title');
            const key = titleElement ? titleElement.textContent.trim() : (course.href || course.element.textContent.trim());

            if (!key || seen.has(key)) {
                if (CONFIG.debugMode && key) {
                    console.log(`🔄 (调试) 去除重复课程: ${key}`);
                }
                return false;
            }
            seen.add(key);
            return true;
        });
    }
};

    // 进度追踪器
    class ProgressTracker {
        constructor() {
            this.lastVideoProgress = 0;
            this.lastLearningProgress = 0;
            this.stuckCount = 0;
            this.cachedVideoElement = null;
        }
        
        // 统一的视频元素获取方法，带缓存优化
        getVideoElement(useCache = true) {
            if (useCache && this.cachedVideoElement && this.cachedVideoElement.isConnected) {
                return this.cachedVideoElement;
            }
            
        // 优化：使用配置化的选择器
        const video = document.querySelector(CONFIG.selectors.videoPlayer);
            if (video) {
                this.cachedVideoElement = video;
            }
            return video;
        }
        
        getVideoProgress() {
            const video = this.getVideoElement();
            if (!video) return null;
            
            return {
                currentTime: video.currentTime,
                duration: video.duration,
                percentage: video.duration ? (video.currentTime / video.duration * 100) : 0
            };
        }
        
        getLearningProgress() {
        // 优化：使用配置化的选择器
        const progressElement = document.querySelector(CONFIG.selectors.progressCircle);
            if (!progressElement) return null;
            
            const ariaValue = parseInt(progressElement.getAttribute('aria-valuenow'));
        const textElement = progressElement.querySelector(CONFIG.selectors.progressText);
            const textValue = textElement ? textElement.textContent.trim() : '';
            
            return {
                ariaValue: ariaValue || 0,
                textValue,
                isComplete: ariaValue >= 100
            };
        }
        
        checkProgressSync() {
            const videoProgress = this.getVideoProgress();
            const learningProgress = this.getLearningProgress();
            
            if (!videoProgress || !learningProgress) {
                return { synced: false, reason: 'Progress elements not found' };
            }
            
            const progressDiff = Math.abs(videoProgress.percentage - learningProgress.ariaValue);
            const synced = progressDiff < 5; // 允许5%的误差
            
            return {
                synced,
                videoProgress: videoProgress.percentage,
                learningProgress: learningProgress.ariaValue,
                difference: progressDiff
            };
        }
          isProgressStuck() {
            const currentProgress = this.getLearningProgress();
            if (!currentProgress) return false;
            
            if (currentProgress.ariaValue === this.lastLearningProgress) {
                this.stuckCount++;
            } else {
                this.stuckCount = 0;
                this.lastLearningProgress = currentProgress.ariaValue;
            }
            
            return this.stuckCount > 3; // 连续3次检查进度未变化
        }
        
        // 保存视频进度（增强版进度保存）
        saveProgress(currentTime, duration, progressPercentage) {
            try {
                // 基于视频事件的进度保存，不干扰原生机制
                if (!currentTime || !duration || isNaN(currentTime) || isNaN(duration)) {
                    return false;
                }
                  // 更新内部状态
                this.lastVideoProgress = progressPercentage;
                
                // 可选：保存到localStorage作为备份
                const progressData = {
                    currentTime,
                    duration,
                    percentage: progressPercentage,
                    timestamp: Date.now(),
                    courseId: this.getCurrentCourseId()
                };
                
                try {
                    localStorage.setItem('videoProgress', JSON.stringify(progressData));
                } catch (storageError) {
                    // localStorage可能不可用，忽略错误
                }
                
                return true;
            } catch (error) {
                console.warn('⚠️ 进度保存出错:', error);
                return false;
            }
        }
        
        // 获取当前课程ID的辅助方法
        getCurrentCourseId() {
            // 从URL中提取课程ID
            const urlMatch = window.location.href.match(/coursePlayer[^'"]*([\w-]{24,})/i) || 
                            window.location.href.match(/study[^'"]*([\w-]{24,})/i) ||
                            window.location.href.match(/id=([^&]+)/i);
            
            if (urlMatch) {
                return urlMatch[1];
            }
            
            // 从页面元素中提取
            const courseElement = document.querySelector('[data-course-id], [data-id]');
            if (courseElement) {
                return courseElement.getAttribute('data-course-id') || 
                       courseElement.getAttribute('data-id');
            }
            
            // 备用方案：使用页面标题生成ID
            const title = document.title;
            let hash = 0;
            for (let i = 0; i < title.length; i++) {
                const char = title.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return `page-${Math.abs(hash).toString(16).substr(0, 16)}`;
        }
    }    // 课程列表页面处理器
    class CourseListHandler {
        constructor() {
            this.courses = [];
            this.currentIndex = 0;
            this.courseNavigator = new CourseNavigator(); // 添加课程导航器实例
            this.setupMessageListener();
    }      // 设置消息监听器，接收来自课程播放页的完成信号
        setupMessageListener() {
            // 防止重复设置监听器
            if (window.courseCompletionListenerSet) {
                console.log('👂 课程完成消息监听器已存在，跳过重复设置');
                return;
            }
        
              window.addEventListener('message', async (event) => {
                if (event.data && event.data.type === 'COURSE_COMPLETED') {
                    console.log('📬 收到课程完成信号:', event.data);
                    
                    const completedCourseName = event.data.courseName;
                    
                    // 记录当前时间，防止重复处理相同时间戳的消息
                    const messageTimestamp = event.data.timestamp;
                    const lastProcessed = window.lastProcessedTimestamp || 0;
                    
                    if (messageTimestamp === lastProcessed) {
                        console.log('⏭️ 跳过重复的课程完成消息 (相同时间戳)');
                        return;
                    }
                    
                    window.lastProcessedTimestamp = messageTimestamp;
                    console.log(`⏰ 处理课程完成消息: ${completedCourseName}`);
                
                      // 确保课程状态已更新为完成
                    if (completedCourseName) {
                        courseStatusManager.markCourseCompleted(completedCourseName);
                        
                    // 错误修复：移除了对不存在的 updateCourseListUIStatus 方法的调用
                    // UI将会在 continueNextCourse 方法中被正确刷新
                    }
                
                      // 等待一下确保页面状态稳定
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // 更新统计数据
                UIBuilder.updateCourseStats();
                
                      // 继续学习下一个未完成的课程
                    await this.continueNextCourse();
                }
            });
            
            window.courseCompletionListenerSet = true;
            console.log('👂 课程列表页消息监听器已设置');
        }        // 继续学习下一个未完成的课程（优化版 - 避免重复查找）
        async continueNextCourse() {
            console.log('🔄 查找下一个未完成的课程...');
            
            try {
                // 优化：使用缓存的课程列表，避免重复查找DOM
                let courses = this.cachedCourses;
                
                // 只有在缓存不存在或过期时才重新获取
                if (!courses || this.shouldRefreshCourseCache()) {
                    console.log('🔄 刷新课程缓存...');
                    courses = await this.getAllCoursesWithStatus();
                this.cachedCourses = courses; // 更新缓存
                    this.cacheTimestamp = Date.now();
                } else {
                    console.log('📋 使用缓存的课程列表');
                    // 只更新课程状态，不重新查找DOM
                    courses = this.updateCachedCourseStatuses(courses);
                this.cachedCourses = courses; // 状态更新后，同样更新缓存
                }
                
            // BUG修复：不再重新创建UI，而是更新UI
                this.updateCourseListUI(courses);
            
            // 更新统计数据
            UIBuilder.updateCourseStats();
                
                // 筛选出未完成的课程
                const uncompletedCourses = courses.filter(course => !course.isCompleted);
                
                if (uncompletedCourses.length === 0) {
                    console.log('🎉 所有课程都已完成！');
                    this.showCompletionMessage();
                    return;
                }
                
                console.log(`📚 还有 ${uncompletedCourses.length} 个课程需要学习`);
                
                // 开始学习第一个未完成的课程
                const nextCourse = uncompletedCourses[0];
                console.log(`🎯 开始学习下一个课程: ${nextCourse.name}`);
                
                await this.startCourse(nextCourse);
                
            } catch (error) {
                console.error('❌ 继续下一个课程时出错:', error);
            }
        }        // 检查是否需要刷新课程缓存 - 优化缓存策略
        shouldRefreshCourseCache() {
            const CACHE_DURATION = 60000; // 延长缓存时间到60秒，减少重复查找
            
            // 如果没有缓存时间戳，需要刷新
            if (!this.cacheTimestamp) {
                return true;
            }
            
            // 如果超过缓存时间，需要刷新
            if (Date.now() - this.cacheTimestamp > CACHE_DURATION) {
                console.log('🔄 缓存已过期，需要刷新');
                return true;
            }
            
            // 如果没有缓存数据，需要刷新
            if (!this.cachedCourses || this.cachedCourses.length === 0) {
                console.log('🔄 缓存数据为空，需要刷新');
                return true;
            }
            
            return false;
        }

        // 更新缓存中的课程状态（不重新查找DOM）- 优化版
        updateCachedCourseStatuses(courses) {
            if (!courses || courses.length === 0) {
                console.log('⚠️ 无课程数据需要更新状态');
                return [];
            }
            
            console.log(`🔄 更新 ${courses.length} 个课程的缓存状态`);
            
            return courses.map(course => {
                const status = courseStatusManager.getCourseStatus(course.name);
                const updatedCourse = {
                    ...course,
                    status: status ? status.status : 'not_started',
                    isCompleted: courseStatusManager.isCourseCompleted(course.name)
                };
                
                // 只在状态变化时记录日志
                if (course.status !== updatedCourse.status) {
                    console.log(`📝 课程状态变化: ${course.name} (${course.status} -> ${updatedCourse.status})`);
                }
                
                return updatedCourse;
            });
        }

        // 主要的课程列表处理方法
        async handleCourseList() {
            console.log('📚 开始处理课程列表页面...');
            
            // 等待页面加载
            await this.waitForPageLoad();
            
            // 获取所有课程并记录状态
            const courses = await this.getAllCoursesWithStatus();
        this.cachedCourses = courses; // 首次获取时缓存课程列表
        this.cacheTimestamp = Date.now(); // 记录缓存时间
            
            if (courses.length === 0) {
                console.log('❌ 未找到可学习的课程');
            this.showUsageInstructions();
                return;
            }

            // 显示课程状态统计
            this.showCourseStatistics(courses);
            
        // 创建课程列表页UI
        this.listUI = UIBuilder.createUniversalUI({
            pageType: 'list',
            courses: courses,
            onStartLearning: () => this.startAutoLearning(courses),
            onReset: () => {
                if (confirm('确定要重置所有课程的学习状态吗？这将无法撤销。')) {
                    courseStatusManager.clearAllStatuses();
                    alert('课程状态已重置。请刷新页面以应用更改。');
                    location.reload();
                }
            },
            onHelp: () => {
                const modal = UIBuilder.createModal(`
                    <div style="padding: 20px; text-align: left; line-height: 1.8;">
                        <h3 style="text-align: center; margin-bottom: 15px;">📚 课程列表页使用说明</h3>
                        <p><strong>核心功能：</strong></p>
                        <ul>
                            <li>✅ 自动检测并展示所有课程。</li>
                            <li>✅ 一键启动，自动学习所有未完成的课程。</li>
                            <li>✅ 学习完成后自动切换到下一个课程。</li>
                            <li>✅ 实时统计学习进度。</li>
                        </ul>
                        <p><strong>操作指南：</strong></p>
                        <ul>
                            <li>点击 <strong>开始学习</strong> 按钮，脚本将自动为您导航和播放。</li>
                            <li>使用顶部 <strong>收起/展开</strong> 按钮来最小化或恢复面板。</li>
                            <li>如果需要重置所有记录，请点击 <strong>重置</strong> 按钮。</li>
                        </ul>
                    </div>
                `, { modalStyle: { maxWidth: '450px' } });
                document.body.appendChild(modal);
            }
        });
            
            // 如果启用自动学习，开始处理课程
            if (CONFIG.autoSwitchCourse) {
                await this.startAutoLearning(courses);
            }
        // 关键：在UI创建后，立即更新统计数据
        UIBuilder.updateCourseStats();
    }

    // 获取所有课程链接（带重试机制）
    async getAllCourses() {
        console.log('🔍 开始查找课程（带重试机制）...');
        
        const maxRetries = 5;
        const retryDelay = 2000;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`🔄 尝试 ${attempt}/${maxRetries}`);
            
            const courses = SharedUtils.findCourseElements();
            
            if (courses.length > 0) {
                console.log(`✅ 找到 ${courses.length} 个课程！`);
                return courses;
            }
            
            if (attempt < maxRetries) {
                console.log(`⏰ 等待 ${retryDelay}ms 后重试...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
        
        console.log('❌ 重试次数用尽，仍未找到课程');
        return [];
        }

        // 获取所有课程并记录状态
        async getAllCoursesWithStatus() {
            console.log('🔍 开始查找课程并记录状态...');
            
            const courses = await this.getAllCourses();
            const coursesWithStatus = [];
            
            for (const course of courses) {
                const courseName = this.extractCourseName(course);
                const status = courseStatusManager.getCourseStatus(courseName);
                
                const courseWithStatus = {
                    ...course,
                    name: courseName,
                    status: status ? status.status : 'not_started',
                    isCompleted: courseStatusManager.isCourseCompleted(courseName)
                };
                
                coursesWithStatus.push(courseWithStatus);
                
                // 如果是首次发现的课程，记录为未开始状态
                if (!status) {
                    courseStatusManager.setCourseStatus(courseName, 'not_started');
                }
            }
            
            console.log(`📝 记录了 ${coursesWithStatus.length} 个课程的状态`);
            return coursesWithStatus;
        }

        // 提取课程名称
        extractCourseName(course) {
            if (course.name) return course.name;
            if (course.title) return course.title;
            
            // 从元素中提取标题
            const titleSelectors = [
                '.item-title',
                '.course-title', 
                '.video-title',
                '.lesson-title',
                '.title',
                'h3', 'h4', 'h5'
            ];
            
        const foundTitle = SharedUtils.findTextContent(course.element, titleSelectors);
        if (foundTitle) {
            return foundTitle;
            }
            
            // 最后尝试使用元素的文本内容
            return course.element.textContent.trim().substring(0, 100) || '未知课程';
        }

        // 显示课程状态统计
        showCourseStatistics(courses) {
            const stats = {
                total: courses.length,
                completed: courses.filter(c => c.isCompleted).length,
                inProgress: courses.filter(c => c.status === 'in_progress').length,
                notStarted: courses.filter(c => c.status === 'not_started').length
            };
            
            const completionRate = stats.total > 0 ? (stats.completed / stats.total * 100).toFixed(1) : 0;
            
            console.log(`📊 课程统计: 总计${stats.total}个，已完成${stats.completed}个，进行中${stats.inProgress}个，未开始${stats.notStarted}个，完成率${completionRate}%`);
        }

        // 开始自动学习流程
        async startAutoLearning(courses) {
        // 首先更新一次UI，标记为进行中
        UIBuilder.updateCourseStats();

        this.currentIndex = courses.findIndex(c => !courseStatusManager.isCourseCompleted(this.extractCourseName(c)));
        if (this.currentIndex === -1) {
                console.log('🎉 所有课程都已完成，无需继续学习！');
                this.showCompletionMessage();
                return;
            }
            
        console.log(`📚 准备学习 ${courses.length} 个课程（跳过了 ${this.currentIndex} 个已完成课程）`);
            
            // 开始学习第一个未完成的课程
        await this.startCourse(courses[this.currentIndex]);
        }

        // 开始学习指定课程
        async startCourse(course) {
            console.log(`🎯 准备开始学习课程: ${course.name}`);
            
            // 标记课程为进行中
            courseStatusManager.markCourseInProgress(course.name);
        
        // ★ 新增：在标记后立即更新UI以高亮当前课程
        const allCourses = await this.getAllCoursesWithStatus();
        // this.updateCourseListUI(allCourses);
            
            try {
                if (course.isCatalogueItem) {
                    console.log('📁 点击课程目录条目');
                    course.element.click();
                } else if (course.element.click) {
                    console.log('🔗 点击课程链接');
                    course.element.click();
                } else {
                    console.log('🌐 直接跳转到课程URL');
                    window.location.href = course.href;
                }
            } catch (error) {
                console.error('❌ 点击课程失败:', error);
                if (course.href && !course.href.includes('javascript:')) {
                    window.location.href = course.href;
                }
            }
        }

        // 显示学习完成消息
        showCompletionMessage() {
            const stats = courseStatusManager.getStatistics();
            
            const content = document.createElement('div');
            content.style.textAlign = 'center';
            
            const title = UIBuilder.createTitle('🎉 学习完成！', {
                style: { color: 'var(--aura-success)' }
            });
            content.appendChild(title);
            
            const message = document.createElement('div');
            message.style.cssText = `
                margin: 12px 0;
                color: var(--aura-text-primary);
                line-height: 1.8;
            `;
            message.innerHTML = `
                <div>恭喜您完成了所有课程的学习！</div>
                <div style="margin-top: 10px;">
                    <strong>学习统计:</strong><br>
                    总课程数: ${stats.total}<br>
                    已完成: ${stats.completed}<br>
                    完成率: ${stats.completionRate}%
                </div>
            `;
            content.appendChild(message);
            
            const okBtn = UIBuilder.createButton('确定', {
            style: { background: 'var(--aura-primary)', color: '#ffffff' },
                onClick: () => modal.remove()
            });
            content.appendChild(okBtn);
              const modal = UIBuilder.createModal(content, {
                closable: true,
                closeOnOverlay: false
            });
            
            document.body.appendChild(modal);
        }

        // 显示脚本使用说明
        showUsageInstructions() {
            const content = document.createElement('div');
            const title = UIBuilder.createTitle('📖 使用说明', {
                style: { color: 'var(--aura-text-secondary)' }
            });
            content.appendChild(title);
            const instructions = document.createElement('div');
            instructions.style.cssText = `
                margin: 12px 0;
                color: var(--aura-text-primary);
                line-height: 1.8;
                font-size: 12px;
            `;
            instructions.innerHTML = `
                <div><strong>💡 功能特色:</strong></div>
                <ul style="margin: 10px 0; padding-left: 20px;">
                <li>✅ 自动播放与进度监控</li>
                <li>📊 实时学习统计</li>
                <li>🔄 断点续学与状态保存</li>
                <li>🛡️ 错误处理与重试机制</li>
                </ul>
                <div style="color: var(--aura-warning); margin-top: 15px;">
                <strong>⚠️ 注意事项与局限性:</strong><br>
                • 播放页面必须始终置于前台，切换标签页或最小化浏览器会导致进度暂停或检测不到<br>
                • 本脚本仅供学习研究，风险自负<br>
                • 请勿频繁刷新或批量操作，避免服务器压力<br>
                • 网站更新可能导致脚本失效，建议定期关注更新<br>
                • 使用前请确认符合网站服务条款
                </div>
            `;
            content.appendChild(instructions);
            const okBtn = UIBuilder.createButton('我知道了', {
                style: { 
                background: 'var(--aura-primary)',
                color: '#ffffff',
                    width: '100%',
                    textAlign: 'center'
                },
                onClick: () => modal.remove()
            });
            content.appendChild(okBtn);
            const modal = UIBuilder.createModal(content, {
                closable: true,
                closeOnOverlay: true
            });
            document.body.appendChild(modal);
        }
        
        // 检测是否在课程列表页面
        isCourseListPage() {
            return window.location.href.includes('specialdetail') || 
                   window.location.href.includes('courseList') ||
                   document.querySelector('.course-list, .pd-course-list, .specialdetail');
        }
          // 智能等待页面加载
        async waitForPageLoad(timeout = 30000) {
            console.log('⏳ 等待页面加载完成...');
            
            const startTime = Date.now();
            
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    // 检查页面是否加载完成的多个条件
                    const isReady = document.readyState === 'complete' &&
                                  document.querySelectorAll('a').length > 0 &&
                                  (document.querySelector('.el-loading-mask') === null);
                    
                    if (isReady || Date.now() - startTime > timeout) {
                        clearInterval(checkInterval);
                        console.log('✅ 页面加载检查完成');
                        resolve(isReady);
                    }
                }, 500);
            });
        }

    // 仅更新课程列表的UI内容，而不重新创建整个面板
        updateCourseListUI(courses) {
        const courseListContainer = document.getElementById('course-list-items-container');
        if (!courseListContainer) {
            console.error('❌ 无法找到课程列表容器进行更新！');
                    return;
                }
                
        // 使用通用UI的渲染方法更新课程列表
        UIBuilder.renderCourseList(courseListContainer, courses);
        }
    }    // 课程导航器
    class CourseNavigator {        constructor(progressTracker = null) {
            this.currentCourseIndex = 0;
            this.progressTracker = progressTracker; // 使用依赖注入
        }
        
        // 使用 ProgressTracker 的视频元素获取方法，避免重复
        getVideoElement(useCache = true) {
            if (this.progressTracker) {
                return this.progressTracker.getVideoElement(useCache);
            }
            
            // 降级方案：直接查找（如果没有 progressTracker）
            return document.querySelector('#emiya-video video');
        }
        
        getCurrentCourse() {
            return document.querySelector('.el-menu-item.is-active');
        }

          getAllCourses() {
        // 调用共享的课程查找逻辑
        const courseInfoArray = SharedUtils.findCourseElements();
        console.log(`🗺️ 导航器找到 ${courseInfoArray.length} 个课程元素`);
        
        // 返回DOM元素列表以保持兼容性
        return courseInfoArray.map(info => info.element);
    }

    getNextCourse() {
            const courses = this.getAllCourses();
            const currentIndex = Array.from(courses).findIndex(course => 
            course.classList.contains('is-active')
        );
            
            return currentIndex < courses.length - 1 ? courses[currentIndex + 1] : null;
        }
    }    // 主要的自动学习播放器
    class AutoLearningPlayer {
        constructor(config = {}) {
            this.config = { ...CONFIG, ...config };
            this.progressTracker = new ProgressTracker();
            this.courseNavigator = new CourseNavigator(this.progressTracker); // 注入依赖
            this.isRunning = false;
            this.checkCount = 0;
            this.currentCourseName = null; // 当前课程名称
            this.lastLearningProgress = 0; // 上次记录的学习进度
            this.progressObserver = null; // 学习进度监控器
            
            // 绑定事件处理器
            this.handleVideoEvents = this.handleVideoEvents.bind(this);
            this.handleProgressUpdate = this.handleProgressUpdate.bind(this);
            
            // 设置全局引用，供页面可见性处理使用
            window.autoLearningPlayer = this;
            
            // 设置页面可见性事件监听器
            this.setupVisibilityEventListeners();
            
            // 初始化UI
            this.initUI();
        }

        // 设置页面可见性事件监听器
        setupVisibilityEventListeners() {
            // 监听进度保存事件
            document.addEventListener('saveProgress', (event) => {
                const isSilent = event.detail && event.detail.silent;
                if (!isSilent) {
                this.addLog(`收到进度保存请求: ${event.detail.reason}`);
                }
                this.saveCurrentProgress();
            });

            // 监听状态检查事件
            document.addEventListener('checkStatus', (event) => {
                const isSilent = event.detail && event.detail.silent;
                if (!isSilent) {
                this.addLog(`收到状态检查请求: ${event.detail.reason}`);
                }
                this.checkCurrentStatus();
            });

            // 监听进度检查事件
            document.addEventListener('checkProgress', (event) => {
                const isSilent = event.detail && event.detail.silent;
                if (!isSilent) {
                this.addLog(`收到进度检查请求: ${event.detail.reason}`);
                }
                this.checkCourseProgress();
            });
        }

        // 保存当前进度
        saveCurrentProgress() {
            try {
                const video = this.getVideoElement();
                if (video) {
                    const currentTime = video.currentTime;
                    const duration = video.duration;
                    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
                    
                    this.progressTracker.saveProgress(currentTime, duration, progressPercentage);
                    // 静默保存，不输出日志
                }
            } catch (error) {
                // 静默处理错误
            }
        }

        // 检查当前状态
        checkCurrentStatus() {
            try {
                const video = this.getVideoElement();
                if (video) {
                    const isPlaying = !video.paused;
                    const currentTime = video.currentTime;
                    const duration = video.duration;
                    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
                    
                    // 如果视频暂停了，尝试恢复播放
                    if (!isPlaying && progress < 100) {
                        video.play().catch(() => {
                            // 静默处理错误
                        });
                    }
                }
            } catch (error) {
                // 静默处理错误
            }
        }

        initUI() {
        if (this.config.showConsoleLog) {
            // 获取课程列表用于显示
            const courseElements = SharedUtils.findCourseElements();
            const courses = courseElements.map(courseInfo => {
                return {
                    name: courseInfo.name, // 修复：使用 courseInfo.name 而不是 courseInfo.title
                    href: courseInfo.href,
                    isCompleted: courseStatusManager.isCourseCompleted(courseInfo.name), // 修复：使用 courseInfo.name
                    status: courseStatusManager.getCourseStatus(courseInfo.name)?.status || 'not_started' // 修复：使用 courseInfo.name
                };
            });

            // 使用通用UI组件替代原有的播放页UI
            this.playerUI = UIBuilder.createUniversalUI({
                pageType: 'player',
                onReset: () => {
                    if (confirm('确定要重置所有课程的学习状态吗？这将无法撤销。')) {
                        courseStatusManager.clearAllStatuses();
                        alert('课程状态已重置。请刷新页面以应用更改。');
                        location.reload();
                    }
                },
                onHelp: () => {
                    const modal = UIBuilder.createModal(`
                        <div style="padding: 20px; text-align: left; line-height: 1.8;">
                            <h3 style="text-align: center; margin-bottom: 15px;">🎬 播放页使用说明</h3>
                            <p><strong>核心功能：</strong></p>
                            <ul>
                                <li>▶️ 自动播放和暂停视频。</li>
                                <li>📊 实时监控学习进度并显示在日志中。</li>
                                <li>🔄 课程完成后自动跳转到下一个。</li>
                                <li>🛡️ 拦截烦人的“离开页面”弹窗。</li>
                            </ul>
                            <p><strong>注意事项：</strong></p>
                            <ul>
                                <li>⚠️ 为了保证脚本正常运行，请勿手动操作播放器。</li>
                                <li>📺 请将此页面保持在前台，切换标签页可能导致学习暂停。</li>
                            </ul>
                        </div>
                    `, { modalStyle: { maxWidth: '450px' } });
                    document.body.appendChild(modal);
                }
            });
        }
        this.addLog(`脚本启动 v${GM_info.script.version}`, 'SUCCESS');
            this.detectAndLogCourseName();
        }

        // 检测并记录课程名称
        detectAndLogCourseName() {
            const courseName = this.getCurrentCourseName();
        if (courseName) {
             this.addLog(`当前课程: ${courseName}`);
            } else {
             this.addLog('正在等待课程名称加载...', 'INFO');
        }
            return courseName;
    }

    // 设置学习进度监控
        setupLearningProgressMonitor() {
            // 等待页面加载完成后再设置监控
            setTimeout(() => {
                const progressElement = document.querySelector('.el-progress--circle[aria-valuenow]');
                if (progressElement) {
                this.addLog('找到学习进度组件，开始监控', 'INFO');
                    
                    // 创建监控器
                    this.progressObserver = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-valuenow') {
                                const newProgress = parseInt(progressElement.getAttribute('aria-valuenow')) || 0;
                                this.handleLearningProgressUpdate(newProgress);
                            }
                        });
                    });
                    
                    // 开始监控
                    this.progressObserver.observe(progressElement, {
                        attributes: true,
                        attributeFilter: ['aria-valuenow']
                    });
                    
                    // 记录初始进度并检查是否已完成
                    const initialProgress = parseInt(progressElement.getAttribute('aria-valuenow')) || 0;
                this.addLog(`初始学习进度: ${initialProgress}%`);
                    this.lastLearningProgress = initialProgress;
                    
                    // 关键修复：如果初始进度就是100%，立即触发完成处理
                    if (initialProgress >= 100) {
                    this.addLog('发现课程已完成！', 'SUCCESS');
                        setTimeout(() => {
                            this.handleCourseCompletion();
                        }, 1000);
                    }
                } else {
                this.addLog('未找到学习进度组件', 'WARNING');
                }
            }, 2000);
        }

        // 处理学习进度更新
        handleLearningProgressUpdate(newProgress) {
            if (this.lastLearningProgress !== newProgress) {
            this.addLog(`学习进度更新: ${this.lastLearningProgress}% → ${newProgress}%`);
                this.lastLearningProgress = newProgress;
                
                // 检查是否完成
                if (newProgress >= 100) {
                this.addLog('课程学习完成！', 'SUCCESS');
                this.handleCourseCompletion(); // 直接调用，不再使用 setTimeout
                }
            }
        }        // 处理课程完成 - 唯一标准：学习进度100%
        async handleCourseCompletion() {
        // 立即停止所有监控器，防止重复触发
        if (this.progressObserver) {
            this.progressObserver.disconnect();
            this.addLog('学习进度监控器已停止', 'INFO');
        }

            const courseName = this.getCurrentCourseName();
        this.addLog(`课程已完成: ${courseName}`, 'SUCCESS');
              // 记录课程完成状态
        if (courseName && courseStatusManager) {
            courseStatusManager.markCourseCompleted(courseName);
            this.addLog(`已标记课程完成状态: ${courseName}`);
            
            // 关键：立即更新UI上的统计数据
            UIBuilder.updateCourseStats();
        }

        // 等待指定的延迟时间，以确保服务器完全保存进度
        this.addLog(`等待 ${this.config.completionDelay / 1000} 秒，以确保最终进度已上报...`);
        await this.sleep(this.config.completionDelay);
            
            // 如果启用自动切换，切换到下一个课程；否则关闭页面
            if (this.config.autoSwitchCourse) {
            this.addLog('准备切换到下一个课程...');
                await this.switchToNextCourse();
            } else {
            this.addLog('准备关闭页面...', 'INFO');
                window.close();
            }
        }

    addLog(message, type = 'INFO') {
        // 总是输出到控制台（用于调试）
        console.log(`[${type}] ${message}`);
        // 根据showConsoleLog配置决定是否显示UI日志
        if (this.config.showConsoleLog) {
            UIBuilder.addLogEntry(message, type);
    }        }
        getVideoElement() {
            return this.courseNavigator.getVideoElement();
        }        // 获取当前课程名称 - 课程名称是识别课程的唯一ID
        getCurrentCourseName() {
            if (this.currentCourseName) {
                return this.currentCourseName;
            }

            // 优先级顺序的课程名称提取策略
            const extractionStrategies = [
                // 策略1：专用课程标题选择器
                () => {
                    const selectors = [
                        '.course-title',
                        '.video-title', 
                        '.lesson-title',
                        '.course-name',
                        '.content-title'
                    ];
                return SharedUtils.findTextContent(document, selectors);
                },
                
                // 策略2：通用标题选择器
                () => {
                    const selectors = ['h1', 'h2', '.title'];
                const foundTitle = SharedUtils.findTextContent(document, selectors);
                if (foundTitle && !foundTitle.includes('中国干部网络学院')) {
                    return foundTitle;
                    }
                    return null;
                },
                
                // 策略3：面包屑导航
                () => {
                    const breadcrumb = document.querySelector('.breadcrumb .active, .page-title');
                    if (breadcrumb && breadcrumb.textContent.trim()) {
                        return breadcrumb.textContent.trim();
                    }
                    return null;
                },
                
                // 策略4：页面标题
                () => {
                    if (document.title && 
                        document.title !== '中国干部网络学院' && 
                        !document.title.includes('登录')) {
                        return document.title.replace(' - 中国干部网络学院', '').trim();
                    }
                    return null;
                },
                
                // 策略5：从URL提取课程ID作为备用标识
                () => {
                    const urlMatch = window.location.href.match(/coursePlayer[^'"]*([\w-]{24,})/i) || 
                                    window.location.href.match(/id=([^&]+)/i);
                    
                    if (urlMatch) {
                        return `课程-${urlMatch[1]}`;
                    }
                    return null;
                }
            ];

            // 按优先级尝试提取课程名称
            for (const strategy of extractionStrategies) {
                try {
                    const courseName = strategy();
                    if (courseName) {
                        this.currentCourseName = courseName;
                    this.addLog(`识别到课程名称: ${courseName}`, 'INFO');
                        return this.currentCourseName;
                    }
                } catch (error) {
                    console.warn('课程名称提取策略失败:', error);
                }
            }

            // 如果所有策略都失败，使用时间戳作为唯一标识
            const fallbackName = `未知课程-${Date.now()}`;
            this.currentCourseName = fallbackName;
        this.addLog(`无法识别课程名称，使用备用标识: ${fallbackName}`, 'WARNING');
            return this.currentCourseName;
        }

    async start() {
        if (this.isRunning) {
            this.addLog('脚本已在运行中', 'WARNING');
            return;
        }

            this.isRunning = true;
            
            // 获取并记录当前课程名称
            const courseName = this.getCurrentCourseName();
            
            // ⚠️ 重要：先检查课程是否已经完成，避免重复学习
            if (courseStatusManager.isCourseCompleted(courseName)) {
            this.addLog(`课程已完成，跳过学习: ${courseName}`, 'SUCCESS');
                
                if (this.config.autoSwitchCourse) {
                this.addLog('准备切换到下一个未完成的课程...');
                    await this.sleep(3000);
                    await this.switchToNextCourse();
                } else {
                this.addLog('课程已完成，准备关闭页面...');
                    await this.sleep(2000);
                    window.close();
                }
                return;
            }
            
        this.addLog(`开始学习课程: ${courseName}`, 'INFO');
            // 标记课程为进行中
            courseStatusManager.markCourseInProgress(courseName);

            try {
                // 等待视频元素加载
                const video = await this.waitForVideo();
                if (!video) {
                this.addLog('未找到视频元素，启动进度监控以处理非视频课程', 'WARNING');
                // 即使没有视频，也要启动进度监控来处理非视频课程
                this.setupLearningProgressMonitor();
                    return;
                }

                // 设置视频事件监听
                this.setupVideoEvents(video);
                
            // 启动学习进度监控 (MutationObserver)
            this.setupLearningProgressMonitor();
                
                // 开始主循环
                await this.mainLoop();
                
            } catch (error) {
            this.addLog(`运行错误: ${error.message}`, 'ERROR');
                console.error('AutoLearningPlayer error:', error);
            } finally {
                this.isRunning = false;
        }
        }

        // 工具函数：等待指定时间
        sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

        async waitForVideo() {
        this.addLog('等待视频加载...', 'INFO');
            
            for (let i = 0; i < 30; i++) {
                const video = this.getVideoElement();
                if (video) {
                this.addLog('视频元素已找到', 'SUCCESS');
                    return video;
                }
                await this.sleep(1000);
            }
            
            return null;
        }        setupVideoEvents(video) {
            // 移除之前的事件监听器（如果存在）
            video.removeEventListener('loadedmetadata', this.handleVideoEvents);
            video.removeEventListener('timeupdate', this.handleProgressUpdate);
            video.removeEventListener('ended', this.handleVideoEvents);
            video.removeEventListener('error', this.handleVideoEvents);

            // 添加新的事件监听器
            video.addEventListener('loadedmetadata', this.handleVideoEvents);
            video.addEventListener('timeupdate', this.handleProgressUpdate);
            video.addEventListener('ended', this.handleVideoEvents);  
        video.addEventListener('error', this.handleVideoEvents);            this.addLog('视频事件监听器已设置', 'INFO');
        }

        handleVideoEvents(event) {
            const video = event.target;
            
            switch (event.type) {
                case 'loadedmetadata':
                this.addLog(`视频元数据加载完成: ${Math.round(video.duration)}秒`);
                    break;
                    
                case 'ended':
                this.addLog('视频播放结束', 'SUCCESS');
                    this.handleVideoEnd();
                    break;
                    
                case 'error':
                this.addLog(`视频播放错误: ${video.error?.message || '未知错误'}`, 'ERROR');
                    break;            }
        }

        handleProgressUpdate(event) {
            const video = event.target;
            
            if (video.duration > 0) {
                const progress = (video.currentTime / video.duration) * 100;
                
                // 保存进度（但不记录日志，避免与学习进度混淆）
                if (this.config.enhancedProgressSave) {
                    this.progressTracker.saveProgress(video.currentTime, video.duration, progress);
                }                // 注意：课程完成判断仅依据页面显示的学习进度，不依据视频播放进度
            }
        }

        async handleVideoEnd() {
        this.addLog('视频播放完成', 'SUCCESS');
            
            // 重置完成检查标记
            this.videoCompletionChecked = false;
            
            // 注意：课程完成判断已由学习进度监控器自动处理
            // 不再基于视频播放完成来判断课程是否完成
        this.addLog('视频播放结束，等待学习进度达到100%完成课程', 'INFO');
        }        async switchToNextCourse() {
            try {
            this.addLog('准备切换到下一个课程...', 'INFO');
                
                const courseName = this.getCurrentCourseName();
            this.addLog(`当前完成的课程: ${courseName}`);
                  // 发送课程完成消息给课程列表页面
                const completionMessage = {
                    type: 'COURSE_COMPLETED',
                    courseName: courseName,
                    timestamp: Date.now()
                };
                
            this.addLog('发送课程完成消息给课程列表页面', 'INFO');
                
                // 尝试发送消息给可能的父页面或开启者页面
                if (window.opener && !window.opener.closed) {
                    // 如果是通过window.open打开的，发送给开启者
                    window.opener.postMessage(completionMessage, '*');
                this.addLog('消息已发送给开启者页面', 'SUCCESS');
                } else if (window.parent !== window) {
                    // 如果是在iframe中，发送给父页面
                    window.parent.postMessage(completionMessage, '*');
                this.addLog('消息已发送给父页面', 'SUCCESS');
                } else {
                    // 发送给所有可能的窗口
                    window.postMessage(completionMessage, '*');
                this.addLog('消息已发送到当前窗口', 'INFO');
                }
                  // 等待一下确保消息发送完成
                await this.sleep(2000);
                
            this.addLog('课程完成，准备关闭页面...', 'INFO');
                
                // 尝试关闭页面
            this.addLog('执行页面关闭', 'INFO');
                window.close();
                
                // 如果关闭失败，使用备用策略
                setTimeout(() => {
                    if (!window.closed) {
                    this.addLog('第一次关闭失败，使用备用策略', 'WARNING');
                        this.handleCloseFailure();
                    }
                }, 1000);
                
                return true;
                  } catch (error) {
            this.addLog(`切换课程失败: ${error.message}`, 'ERROR');
                console.error('Switch course error:', error);
                  // 出错时也尝试关闭页面
            this.addLog('出错时尝试关闭页面', 'INFO');
                
                // 设置浏览器弹窗处理器 - 已被新的拦截机制取代，故删除
                // this.setupBrowserDialogHandler();
                
                setTimeout(() => {
                    window.close();
                    
                    // 如果关闭失败，使用备用策略
                    setTimeout(() => {
                        if (!window.closed) {
                        this.addLog('错误处理中关闭失败，使用智能返回', 'WARNING');
                            this.handleCloseFailure();
                        }
                    }, 1000);
                }, 1000);
                  return false;
            }
        }
        
        // 处理关闭失败的情况
        handleCloseFailure() {
        this.addLog('处理关闭失败，检查备用策略', 'INFO');
            
            // 优先尝试返回到父页面
            if (window.opener && !window.opener.closed) {
            this.addLog('返回到开启者页面', 'INFO');
                window.opener.focus();
                window.close();
            } else if (window.history.length > 1) {
            this.addLog('使用历史记录返回', 'INFO');
                window.history.back();
            } else {
                // 最后才考虑重新导航
            this.addLog('导航回列表页', 'INFO');
                const listUrl = sessionStorage.getItem('courseListUrl') || 
                              document.referrer ||
                              window.location.href.replace(/coursePlayer.*/, 'specialdetail');
                
                // 添加标记防止重复打开
                if (!sessionStorage.getItem('courseCompletionRedirecting')) {
                    sessionStorage.setItem('courseCompletionRedirecting', 'true');
                    window.location.href = listUrl;
                }
            }
        }

        getCurrentCourseId() {
        // 统一调用 progressTracker 中的方法，避免代码重复
        return this.progressTracker.getCurrentCourseId();
        }

        async mainLoop() {
        this.addLog('开始主循环', 'INFO');
            
            while (this.isRunning) {
                try {
                    const video = this.getVideoElement();
                    
                    if (!video) {
                    this.addLog('视频元素丢失，尝试重新获取', 'WARNING');
                        await this.sleep(this.config.checkInterval);
                        continue;
                }
                
                // 检查视频状态并进行相应操作
                    await this.processVideo(video);
                    
                } catch (error) {
                this.addLog(`主循环错误: ${error.message}`, 'ERROR');
                    console.error('Main loop error:', error);
                }
                
            // 定期等待，但不再检查超时
                await this.sleep(this.config.checkInterval);
            }
        }

        async processVideo(video) {
            // 确保视频静音（如果配置要求）
            if (this.config.enforceGlobalMute && !video.muted) {
                video.muted = true;
            this.addLog('视频已静音', 'INFO');
            }

            // 检查视频是否暂停，如果是则播放
            if (video.paused && this.config.autoPlay) {
                try {
                    await video.play();
                this.addLog('视频开始播放', 'INFO');
                } catch (error) {
                this.addLog(`视频播放失败: ${error.message}`, 'ERROR');
                }
            }

            // 检查播放速度
            if (video.playbackRate !== 1) {
                video.playbackRate = 1;
            this.addLog('播放速度已重置为正常', 'INFO');  
            }        }

        sleep(ms) {
            // 如果启用随机延迟，添加随机成分
            if (this.config.enableRandomDelay) {
                const randomDelay = Math.random() * (this.config.maxDelay - this.config.minDelay) + this.config.minDelay;
                ms += randomDelay;
            }
            
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        stop() {
            this.isRunning = false;
        this.addLog('自动学习已停止', 'INFO');
        }
    }

    // 页面类型检测和主函数
    function getPageType() {
        const url = window.location.href;
        const hash = window.location.hash;
        
    console.log('🔍 开始检测页面类型...');
        
    // 1. 优先通过URL特征判断
        if (url.includes('coursePlayer') || hash.includes('coursePlayer')) {
        console.log('📺 检测为视频播放页 (基于URL)');
            return 'video';
        }
        
        if (url.includes('courseList') || hash.includes('courseList') || 
            url.includes('specialdetail') || hash.includes('specialdetail') ||
            url.includes('pdchanel') || hash.includes('pdchanel')) {
        console.log('📚 检测为课程列表页 (基于URL)');
            return 'courseList';
        }
        
    // 2. 如果URL不明确，通过DOM特征判断
    console.log('...URL不明确，继续通过DOM特征检测');

            // 检查视频元素
            const video = document.querySelector('#emiya-video video, video');
            if (video) {
        console.log('📺 检测为视频播放页 (基于DOM)');
                return 'video';
            }
            
            // 检查课程列表元素
    const courseList = document.querySelector('.catalogue_item, .course-item, .specialdetail_catalogue, .course-list, .pd-course-list');
            if (courseList) {
        console.log('📚 检测为课程列表页 (基于DOM)');
                return 'courseList';
            }
            
    console.log('❓ 未能识别页面类型');
        return 'unknown';
    }

    // 全局监听器设置标记 - 防止重复设置
    let globalMessageListenerSet = false;
    let urlChangeListenerSet = false;
    let isMainRunning = false; // 防止main函数重复执行
    let mainCallCount = 0; // 添加调用计数器
    const MAX_MAIN_CALLS = 5; // 最大调用次数限制
    let lastMainCallTime = 0; // 最后一次调用时间
    let scriptStopped = false; // 脚本停止标记

    // 创建全局课程状态管理器
    const courseStatusManager = new CourseStatusManager();

    async function main() {
    // 在开始时确保清除所有旧的UI
    const existingPlayerUI = document.getElementById('auto-learning-player-ui');
    if (existingPlayerUI) existingPlayerUI.remove();
    const existingListUI = document.getElementById('auto-learn-ui-container');
    if (existingListUI) existingListUI.remove();

    console.log('🚀 Main function started');
    const pageType = getPageType();

    try {
        console.log('🚀 中国干部网络学院自动学习脚本启动 v2.18.1 - UI/UX优化版');
        console.log('🔧 配置:', CONFIG);
        
        // 优化：注入样式表
        injectStyles();
            
            // 等待页面加载完成
            if (document.readyState !== 'complete') {
                await new Promise(resolve => {
                    window.addEventListener('load', resolve);
                });
            }
            
            // 额外等待，确保动态内容加载
        await new Promise(resolve => setTimeout(resolve, 3000));            console.log(`📄 当前页面类型: ${pageType}`);
            
            switch (pageType) {
                case 'video':
                    console.log('🎬 初始化视频播放器...');
                    const player = new AutoLearningPlayer();
                    await player.start();
                    break;
                case 'courseList':
                    console.log('📚 初始化课程列表处理器...');
                    const courseListHandler = new CourseListHandler();
                    
                    // 保存当前页面URL，用于后续返回
                    sessionStorage.setItem('courseListUrl', window.location.href);
                    
                    await courseListHandler.handleCourseList();                    break;
                case 'unknown':
                default:
                    console.log('❓ 未知页面类型，使用降级策略');
                    
                    // 等待更长时间后重新检测
                    setTimeout(async () => {
                        const video = document.querySelector('#emiya-video video, video');
                        const courseList = document.querySelector('.catalogue_item, .course-item, .specialdetail_catalogue');
                        
                        if (video) {
                            console.log('🎬 降级检测：发现视频元素，启动播放器');
                            const player = new AutoLearningPlayer();
                            await player.start();
                        } else if (courseList) {
                            console.log('📚 降级检测：发现课程列表，启动列表处理器');
                            const courseListHandler = new CourseListHandler();
                            await courseListHandler.handleCourseList();
                        } else {
                            console.log('❌ 降级检测也未找到可处理的元素');
                        }
                    }, 5000);
                    break;
            }
        } catch (error) {
            console.error('❌ 主函数执行错误:', error);
        } finally {
            isMainRunning = false; // 确保标记被重置
        console.log(`✅ main函数执行完成。`);
        }
        
        // 只在第一次运行时设置URL变化监听器，防止重复设置
        if (!urlChangeListenerSet) {
            setupUrlChangeListener();
            urlChangeListenerSet = true;
        }
        
        console.log('📡 脚本初始化完成');
    console.log(`🏁 Main function finished for page type: ${pageType}`);
    }

    // 单独的URL变化监听器设置函数
    function setupUrlChangeListener() {
    let debounceTimer;

    // 创建一个"防抖"函数，确保main只在URL稳定后执行一次
    const debouncedMain = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            console.log('🚀 Executing debounced main function after URL change.');
            main();
        }, 500); // 500ms的防抖延迟
    };

    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            console.log(`🌀 URL change detected (MutationObserver) to: ${oldHref}.`);
            debouncedMain();
        }
    });
    observer.observe(body, { childList: true, subtree: true });

    // 备用方案：监听hashchange事件
    window.addEventListener('hashchange', () => {
        console.log('🌀 Hash change detected (hashchange event).');
        debouncedMain();
    });
    console.log('👂 URL change listener is active.');
}

// --- 脚本启动点 ---

// 启动URL变化监听器
setupUrlChangeListener();

// 首次运行主函数
main();
})();