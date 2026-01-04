// ==UserScript==
// @name         福建网络干部学院课程自动播放
// @name:en      Fujian Cadre Network College Course Auto Player
// @namespace    https://greasyfork.org/users/1410751-liuxing7954
// @version      2.2.0
// @description  自动播放福建网络干部学院课程视频，支持自动切换章节和科目，自动保存进度，自动处理token
// @description:en  Auto play Fujian Cadre Network College course videos, auto switch chapters and subjects, auto save progress, auto handle token
// @author       liuxing7954
// @match        *://www.fsa.gov.cn/*
// @match        https://www.fsa.gov.cn/video*
// @match        *://www.fsa.gov.cn/videoChoose*
// @match        https://www.fsa.gov.cn/videoChoose*
// @license      MIT
// @icon         https://www.fsa.gov.cn/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/520696/%E7%A6%8F%E5%BB%BA%E7%BD%91%E7%BB%9C%E5%B9%B2%E9%83%A8%E5%AD%A6%E9%99%A2%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/520696/%E7%A6%8F%E5%BB%BA%E7%BD%91%E7%BB%9C%E5%B9%B2%E9%83%A8%E5%AD%A6%E9%99%A2%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 应用程序常量配置
     * 集中管理所有配置项，便于维护和修改
     */
    const CONSTANTS = {
        /**
         * localStorage存储键值配置
         * 用于持久化保存用户设置和应用状态
         */
        STORAGE_KEYS: {
            DEBUG_MODE: 'debugMode',                    // 调试模式开关状态
            COURSE_MODE: 'courseMode',                  // 课程模式：elective(选修) / required(必修)
            STUDENT_ID: 'studentId',                    // 学生ID，用于API请求
            TOKEN: 'wlxytk',                           // 网络学院认证token
            REFRESH_TOKEN: 'rt',                       // 刷新token，用于续期认证
            CONSOLE_POSITION: 'console_position',       // 控制台窗口位置
            PANEL_POSITION: 'config-panel_position'    // 配置面板窗口位置
        },
        
        /**
         * 时间间隔配置（毫秒）
         * 控制各种定时任务的执行频率
         */
        INTERVALS: {
            DEBUG: 5000,                // 调试模式下的主循环间隔（5秒，便于调试）
            NORMAL: 20000,              // 正常模式下的主循环间隔（20秒，减少服务器负载）
            SAVE_PROGRESS: 2000,        // 保存进度的延迟时间（2秒）
            INITIALIZATION: 5000,       // 页面初始化等待时间（5秒）
            VIDEO_CHECK: 1000,          // 检查视频元素的间隔（1秒）
            PAGE_RELOAD: 5000           // 页面重新加载延迟（5秒）
        },
        
        /**
         * 进度相关配置
         * 控制课程完成度的判断标准
         */
        PROGRESS: {
            TARGET: 100,               // 章节完成的目标进度百分比
            MAX_VIDEO_ATTEMPTS: 10     // 等待视频加载的最大尝试次数
        },
        
        /**
         * 用户界面配置
         * 控制UI组件的显示效果
         */
        UI: {
            MAX_LOG_LINES_DEBUG: 20,    // 调试模式下控制台最大日志行数
            MAX_LOG_LINES_NORMAL: 10,   // 正常模式下控制台最大日志行数
            NOTIFICATION_DURATION: 2000  // 通知消息显示时长（2秒）
        },
        
        /**
         * API接口地址配置
         * 福建网络干部学院的课程数据接口
         */
        API: {
            // 选修课程列表接口
            ELECTIVE: 'https://www.fsa.gov.cn/api/study/my/elective/myElectives',
            // 必修课程列表接口
            REQUIRED: 'https://www.fsa.gov.cn/api/study/years/yearsCourseware/annualPortalCourseList'
        },
        
        /**
         * DOM选择器配置
         * 用于定位页面中的关键元素
         */
        SELECTORS: {
            VIDEO: 'video',                                                    // 视频播放元素
            CURRENT_COURSE: '.kc-list li h5[style*="color: rgb(166, 0, 0)"]', // 当前选中的课程（红色标题）
            CHAPTERS: '.kc-list li',                                          // 所有章节列表
            PROGRESS_SPAN: '.kc-info span:last-child',                       // 章节进度显示文本
            SAVE_BUTTON: 'button.el-button.btn span:first-child',            // 保存进度按钮
            COURSE_TITLE: 'h5',                                              // 课程标题元素
            // 课程选择页面的第一个课程选项
            FIRST_COURSE: '#app > div.video-page-main > div.page-content > div > div.choose-body > div:nth-child(2) > span.choose-content',
            // 文章阅读页面的状态显示
            READING_STATUS: '#app > div.index-content > div.page-content > div.time-d-box > div > span',
            START_READING_BUTTON: 'button:nth-child(2)'                      // 开始阅读按钮
        }
    };

    /**
     * 拖拽管理器 - 处理元素拖拽功能
     * 提供通用的元素拖拽能力，支持位置记忆和边界检测
     */
    class DragManager {
        /**
         * 构造函数 - 初始化拖拽状态
         */
        constructor() {
            this.isDragging = false;        // 是否正在拖拽
            this.currentElement = null;     // 当前被拖拽的元素
            this.startX = 0;               // 拖拽开始时的鼠标X坐标
            this.startY = 0;               // 拖拽开始时的鼠标Y坐标
            this.elementStartX = 0;        // 拖拽开始时元素的X坐标
            this.elementStartY = 0;        // 拖拽开始时元素的Y坐标
            this.originalStyles = {};      // 保存元素原始样式，用于拖拽结束后恢复
        }

        /**
         * 使元素可拖拽
         * @param {HTMLElement} element - 要拖拽的目标元素
         * @param {HTMLElement} handle - 拖拽手柄元素（通常是标题栏）
         * @param {string|null} storageKey - localStorage存储键，用于记忆位置
         */
        makeDraggable(element, handle, storageKey = null) {
            if (!element || !handle) return;

            // 恢复上次保存的位置
            if (storageKey) {
                this.restorePosition(element, storageKey);
            }

            // 设置拖拽手柄样式
            handle.style.cursor = 'move';           // 显示移动光标
            handle.style.userSelect = 'none';       // 禁止文本选择

            // 绑定鼠标按下事件 - 开始拖拽
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();                  // 阻止默认行为（如文本选择）
                this.startDrag(e, element, storageKey);
            });

            // 全局鼠标移动事件 - 拖拽过程
            document.addEventListener('mousemove', (e) => {
                if (this.isDragging && this.currentElement === element) {
                    this.drag(e);
                }
            });

            // 全局鼠标释放事件 - 结束拖拽
            document.addEventListener('mouseup', () => {
                if (this.isDragging && this.currentElement === element) {
                    this.stopDrag(storageKey);
                }
            });
        }

        /**
         * 开始拖拽操作
         * @param {MouseEvent} e - 鼠标按下事件对象
         * @param {HTMLElement} element - 被拖拽的目标元素
         * @param {string} storageKey - localStorage存储键，用于保存位置
         */
        startDrag(e, element, storageKey) {
            this.isDragging = true;          // 标记为正在拖拽状态
            this.currentElement = element;   // 记录当前拖拽的元素
            
            // 记录拖拽开始时的鼠标坐标（相对于视口）
            this.startX = e.clientX;
            this.startY = e.clientY;
            
            // 获取元素当前在屏幕上的绝对位置
            const rect = element.getBoundingClientRect();
            this.elementStartX = rect.left;  // 元素左边距离视口左边的距离
            this.elementStartY = rect.top;   // 元素上边距离视口上边的距离
            
            // 保存元素的原始样式，确保拖拽结束后能完全恢复
            this.originalStyles = {
                transition: element.style.transition,  // 过渡动画
                zIndex: element.style.zIndex,         // 层级
                opacity: element.style.opacity,       // 透明度
                transform: element.style.transform,   // 变换效果
                filter: element.style.filter         // 滤镜效果（包含backdrop-filter）
            };
            
            // 应用拖拽时的视觉反馈样式
            element.style.transition = 'none';        // 暂时禁用过渡动画，确保拖拽流畅
            element.style.zIndex = '10002';          // 提升层级，确保在最上层显示
            element.style.opacity = '0.9';           // 轻微透明，提示正在拖拽
            element.style.transform = 'scale(1.02)'; // 轻微放大，增强视觉反馈
            
            // 在原有滤镜基础上添加投影效果，保持现有的毛玻璃效果
            const currentFilter = element.style.filter || '';
            element.style.filter = currentFilter + ' drop-shadow(0 10px 30px rgba(0,0,0,0.3))';
            
            // 改变全局光标样式，提示用户正在拖拽操作
            document.body.style.cursor = 'move';      // 显示移动光标
            document.body.style.userSelect = 'none';  // 禁止文本选择，避免拖拽时误选
        }

        /**
         * 拖拽过程中的位置更新
         * @param {MouseEvent} e - 鼠标移动事件对象
         */
        drag(e) {
            if (!this.isDragging || !this.currentElement) return;

            // 计算鼠标相对于拖拽开始位置的移动距离
            const deltaX = e.clientX - this.startX;  // X轴移动距离
            const deltaY = e.clientY - this.startY;  // Y轴移动距离
            
            // 根据移动距离计算元素的新位置
            let newX = this.elementStartX + deltaX;
            let newY = this.elementStartY + deltaY;
            
            // 边界检测 - 防止元素被拖拽到屏幕可视区域外
            const element = this.currentElement;
            const rect = element.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;   // 最大X坐标（右边界）
            const maxY = window.innerHeight - rect.height; // 最大Y坐标（下边界）
            
            // 限制坐标范围：左上角不能超出(0,0)，右下角不能超出屏幕边界
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            // 将计算后的新位置应用到元素上
            element.style.left = newX + 'px';    // 设置左边距
            element.style.top = newY + 'px';     // 设置上边距
            element.style.right = 'auto';        // 清除右边距定位
            element.style.bottom = 'auto';       // 清除下边距定位
        }

        /**
         * 结束拖拽操作，恢复元素状态
         * @param {string} storageKey - localStorage存储键，用于保存最终位置
         */
        stopDrag(storageKey) {
            if (!this.isDragging || !this.currentElement) return;

            const element = this.currentElement;
            
            // 恢复所有原始样式，确保不破坏元素的原有外观
            element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'; // 添加平滑过渡动画
            element.style.zIndex = this.originalStyles.zIndex || '';      // 恢复层级
            element.style.opacity = this.originalStyles.opacity || '';   // 恢复透明度
            element.style.transform = this.originalStyles.transform || '';// 恢复变换效果
            element.style.filter = this.originalStyles.filter || '';     // 恢复滤镜效果（重要！保持毛玻璃效果）
            
            // 恢复全局光标和选择状态
            document.body.style.cursor = '';      // 恢复默认光标
            document.body.style.userSelect = ''; // 恢复文本选择功能
            
            // 将当前位置保存到localStorage，下次页面加载时自动恢复
            if (storageKey) {
                this.savePosition(element, storageKey);
            }
            
            // 重置拖拽管理器的内部状态
            this.isDragging = false;     // 标记拖拽结束
            this.currentElement = null;  // 清空当前元素引用
            this.originalStyles = {};    // 清空样式缓存
        }

        /**
         * 保存元素当前位置到localStorage
         * @param {HTMLElement} element - 要保存位置的元素
         * @param {string} storageKey - localStorage存储键前缀
         */
        savePosition(element, storageKey) {
            const rect = element.getBoundingClientRect();
            const position = {
                left: rect.left,  // 元素距离视口左边的距离
                top: rect.top     // 元素距离视口上边的距离
            };
            // 将位置信息序列化并保存到localStorage
            StorageManager.set(`${storageKey}_position`, JSON.stringify(position));
        }

        /**
         * 从localStorage恢复元素位置
         * @param {HTMLElement} element - 要恢复位置的元素
         * @param {string} storageKey - localStorage存储键前缀
         */
        restorePosition(element, storageKey) {
            const savedPosition = StorageManager.get(`${storageKey}_position`);
            if (savedPosition) {
                try {
                    // 解析保存的位置信息
                    const position = JSON.parse(savedPosition);
                    
                    // 应用保存的位置，使用fixed定位
                    element.style.left = position.left + 'px';   // 设置左边距
                    element.style.top = position.top + 'px';     // 设置上边距
                    element.style.right = 'auto';                // 清除右边距定位
                    element.style.bottom = 'auto';               // 清除下边距定位
                } catch (error) {
                    console.warn('Failed to restore position:', error);
                }
            }
        }
    }

    /**
     * 工具类 - 提供通用工具方法
     * 包含异步操作、时间格式化、DOM操作等常用功能
     */
    class Utils {
        /**
         * 异步延时函数
         * @param {number} ms - 等待时间（毫秒）
         * @returns {Promise} - 延时Promise对象
         */
        static async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        /**
         * 格式化当前时间为本地时间字符串
         * @returns {string} - 格式化的时间字符串（如：14:30:25）
         */
        static formatTime() {
            return new Date().toLocaleTimeString();
        }

        /**
         * 解析进度文本，提取百分比数值
         * @param {string} progressText - 进度文本（如："进度：85.5%"）
         * @returns {number} - 解析出的进度数值（如：85.5），解析失败返回0
         */
        static parseProgress(progressText) {
            return parseFloat(progressText.replace('进度：', '')) || 0;
        }

        /**
         * 验证元素是否为有效的DOM元素
         * @param {*} element - 要检验的对象
         * @returns {boolean} - 是否为有效的DOM元素
         */
        static isValidElement(element) {
            return element && element instanceof Element;
        }

        /**
         * 安全的单元素选择器，避免无效选择器导致的异常
         * @param {string} selector - CSS选择器字符串
         * @param {Element|Document} parent - 父元素，默认为document
         * @returns {Element|null} - 找到的元素或null
         */
        static safeQuerySelector(selector, parent = document) {
            try {
                return parent.querySelector(selector);
            } catch (error) {
                console.warn(`Invalid selector: ${selector}`, error);
                return null;
            }
        }

        /**
         * 安全的多元素选择器，避免无效选择器导致的异常
         * @param {string} selector - CSS选择器字符串
         * @param {Element|Document} parent - 父元素，默认为document
         * @returns {NodeList|Array} - 找到的元素列表或空数组
         */
        static safeQuerySelectorAll(selector, parent = document) {
            try {
                return parent.querySelectorAll(selector);
            } catch (error) {
                console.warn(`Invalid selector: ${selector}`, error);
                return [];
            }
        }
    }

    /**
     * 存储管理器 - 处理localStorage操作
     * 提供安全的本地存储读写功能，包含错误处理和类型转换
     */
    class StorageManager {
        /**
         * 从localStorage获取字符串值
         * @param {string} key - 存储键名
         * @param {*} defaultValue - 默认值，当key不存在时返回
         * @returns {string|*} - 存储的值或默认值
         */
        static get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value !== null ? value : defaultValue;
            } catch (error) {
                console.warn(`Failed to get storage item: ${key}`, error);
                return defaultValue;
            }
        }

        /**
         * 向localStorage设置字符串值
         * @param {string} key - 存储键名
         * @param {string} value - 要存储的值
         * @returns {boolean} - 是否设置成功
         */
        static set(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (error) {
                console.warn(`Failed to set storage item: ${key}`, error);
                return false;
            }
        }

        /**
         * 从localStorage获取布尔值
         * @param {string} key - 存储键名
         * @param {boolean} defaultValue - 默认布尔值
         * @returns {boolean} - 解析后的布尔值
         */
        static getBool(key, defaultValue = false) {
            return this.get(key) === 'true' || defaultValue;
        }

        /**
         * 向localStorage设置布尔值
         * @param {string} key - 存储键名
         * @param {boolean} value - 要存储的布尔值
         * @returns {boolean} - 是否设置成功
         */
        static setBool(key, value) {
            return this.set(key, String(Boolean(value)));
        }
    }

    /**
     * 配置管理器 - 集中管理所有配置
     * 负责应用程序的配置状态管理，包括调试模式、运行间隔、课程模式等
     */
    class ConfigManager {
        /**
         * 构造函数 - 初始化配置项
         * 从localStorage读取保存的配置，提供默认值
         */
        constructor() {
            // 调试模式相关配置
            this.debug = {
                enabled: StorageManager.getBool(CONSTANTS.STORAGE_KEYS.DEBUG_MODE, false), // 是否开启调试模式
                interval: CONSTANTS.INTERVALS.DEBUG,                                       // 调试模式运行间隔（5秒）
                maxLogLines: CONSTANTS.UI.MAX_LOG_LINES_DEBUG                             // 调试模式最大日志行数
            };

            // 正常模式相关配置
            this.normal = {
                interval: CONSTANTS.INTERVALS.NORMAL,         // 正常模式运行间隔（20秒）
                maxLogLines: CONSTANTS.UI.MAX_LOG_LINES_NORMAL // 正常模式最大日志行数
            };

            // 课程相关配置
            this.course = {
                targetProgress: CONSTANTS.PROGRESS.TARGET,                                      // 章节完成的目标进度（100%）
                mode: StorageManager.get(CONSTANTS.STORAGE_KEYS.COURSE_MODE, 'elective')       // 课程模式：elective(选修) / required(必修)
            };
        }

        /**
         * 获取当前是否处于调试模式
         * @returns {boolean} - 是否启用调试模式
         */
        get isDebugEnabled() {
            return this.debug.enabled;
        }

        /**
         * 获取当前运行间隔
         * @returns {number} - 根据调试模式返回对应的运行间隔（毫秒）
         */
        get currentInterval() {
            return this.isDebugEnabled ? this.debug.interval : this.normal.interval;
        }

        /**
         * 获取最大日志行数
         * @returns {number} - 根据调试模式返回对应的最大日志行数
         */
        get maxLogLines() {
            return this.isDebugEnabled ? this.debug.maxLogLines : this.normal.maxLogLines;
        }

        /**
         * 获取当前课程模式对应的API地址
         * @returns {string} - 课程列表API地址
         */
        get courseApiUrl() {
            return this.course.mode === 'required' ? CONSTANTS.API.REQUIRED : CONSTANTS.API.ELECTIVE;
        }

        /**
         * 切换调试模式开关
         * 同时更新localStorage中的设置
         */
        toggleDebug() {
            this.debug.enabled = !this.debug.enabled;
            StorageManager.setBool(CONSTANTS.STORAGE_KEYS.DEBUG_MODE, this.debug.enabled);
        }

        /**
         * 设置课程模式
         * @param {string} mode - 课程模式：'elective'(选修) 或 'required'(必修)
         */
        setCourseMode(mode) {
            this.course.mode = mode;
            StorageManager.set(CONSTANTS.STORAGE_KEYS.COURSE_MODE, mode);
        }
    }

    /**
     * 日志管理器 - 处理日志输出和显示
     */
    class LogManager {
        constructor(config) {
            this.config = config;
            this.consoleDiv = null;
            this.headerDiv = null;
            this.bodyDiv = null;
            this.isMinimized = false;
            this.dragManager = new DragManager();
            this.init();
        }

        init() {
            this.createConsole();
            this.bindEvents();
            this.enableDragging();
        }

        createConsole() {
            // 创建主容器
            this.consoleDiv = document.createElement('div');
            this.consoleDiv.id = 'custom-console';
            this.consoleDiv.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 500px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
                z-index: 9999;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(20px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            `;

            // 创建头部
            this.headerDiv = document.createElement('div');
            this.headerDiv.style.cssText = `
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
                font-size: 13px;
                cursor: move;
                user-select: none;
            `;
            this.headerDiv.innerHTML = `
                <div style="display: flex; align-items: center; flex: 1; cursor: move;" id="console-drag-handle">
                    <div style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 8px rgba(74, 222, 128, 0.6);"></div>
                    <span>脚本控制台</span>
                    <div style="margin-left: 8px; opacity: 0.7; font-size: 10px;">拖拽移动</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button id="clearLog" style="
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 11px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">清空</button>
                    <div id="minimizeBtn" style="
                        width: 16px;
                        height: 16px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 3px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">−</div>
                </div>
            `;

            // 创建主体
            this.bodyDiv = document.createElement('div');
            this.bodyDiv.style.cssText = `
                height: 300px;
                overflow-y: auto;
                padding: 16px;
                font-size: 12px;
                line-height: 1.5;
                color: #e2e8f0;
                background: rgba(0, 0, 0, 0.2);
            `;

            // 自定义滚动条样式
            const style = document.createElement('style');
            style.textContent = `
                #custom-console div::-webkit-scrollbar {
                    width: 6px;
                }
                #custom-console div::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                #custom-console div::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                }
                #custom-console div::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `;
            document.head.appendChild(style);

            this.consoleDiv.appendChild(this.headerDiv);
            this.consoleDiv.appendChild(this.bodyDiv);
            document.body.appendChild(this.consoleDiv);
        }

        bindEvents() {
            // 最小化/最大化功能
            const minimizeBtn = document.getElementById('minimizeBtn');
            minimizeBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });

            // 清空日志功能
            const clearBtn = document.getElementById('clearLog');
            clearBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearLogs();
            });
        }

        enableDragging() {
            const dragHandle = document.getElementById('console-drag-handle');
            if (dragHandle) {
                this.dragManager.makeDraggable(this.consoleDiv, dragHandle, 'console');
            }
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            const minimizeBtn = document.getElementById('minimizeBtn');
            
            if (this.isMinimized) {
                this.bodyDiv.style.display = 'none';
                this.consoleDiv.style.height = 'auto';
                minimizeBtn.textContent = '+';
            } else {
                this.bodyDiv.style.display = 'block';
                this.consoleDiv.style.height = 'auto';
                minimizeBtn.textContent = '−';
            }
        }

        clearLogs() {
            this.bodyDiv.innerHTML = '';
            this.log('日志已清空', true);
        }

        log(message, isDebug = false) {
            if (isDebug && !this.config.isDebugEnabled) return;

            const logLine = this.createLogLine(message, isDebug);
            this.bodyDiv.appendChild(logLine);
            this.bodyDiv.scrollTop = this.bodyDiv.scrollHeight;
            this.limitLogLines();

            // 控制台输出
            const consoleMessage = `${Utils.formatTime()} - ${message}`;
            if (isDebug) {
                console.debug(`[DEBUG] ${consoleMessage}`);
            } else {
                console.log(consoleMessage);
            }
        }

        createLogLine(message, isDebug) {
            const logLine = document.createElement('div');
            const time = Utils.formatTime();
            
            // 根据消息类型设置不同的样式
            let messageColor = '#e2e8f0';
            let icon = '•';
            
            if (isDebug) {
                messageColor = '#10b981';
                icon = '🔍';
            } else if (message.includes('错误') || message.includes('失败')) {
                messageColor = '#ef4444';
                icon = '❌';
            } else if (message.includes('成功') || message.includes('完成')) {
                messageColor = '#22c55e';
                icon = '✅';
            } else if (message.includes('警告')) {
                messageColor = '#f59e0b';
                icon = '⚠️';
            }

            logLine.style.cssText = `
                display: flex;
                align-items: flex-start;
                gap: 8px;
                padding: 6px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                animation: fadeIn 0.3s ease-in-out;
                word-wrap: break-word;
                color: ${messageColor};
            `;

            logLine.innerHTML = `
                <span style="
                    color: #64748b;
                    font-size: 10px;
                    min-width: 60px;
                    margin-top: 1px;
                ">${time}</span>
                <span style="
                    margin-top: 1px;
                    min-width: 16px;
                ">${icon}</span>
                <span style="
                    flex: 1;
                    word-break: break-word;
                ">${isDebug ? '[DEBUG] ' : ''}${message}</span>
            `;

            // 添加淡入动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            if (!document.head.querySelector('style[data-log-animation]')) {
                style.setAttribute('data-log-animation', 'true');
                document.head.appendChild(style);
            }

            return logLine;
        }

        limitLogLines() {
            while (this.bodyDiv.children.length > this.config.maxLogLines) {
                this.bodyDiv.removeChild(this.bodyDiv.firstChild);
            }
        }

        error(message, error = null) {
            const errorMessage = error ? `${message}: ${error.message}` : message;
            this.log(`❌ ${errorMessage}`);
            if (this.config.isDebugEnabled && error?.stack) {
                this.log(`Stack: ${error.stack}`, true);
            }
        }
    }

    /**
     * 视频控制器 - 处理视频播放操作
     * 负责课程视频的播放控制，这是自动挂课的核心业务逻辑
     */
    class VideoController {
        /**
         * 构造函数
         * @param {LogManager} logger - 日志管理器实例
         */
        constructor(logger) {
            this.logger = logger;
        }

        /**
         * 获取页面中的视频播放器元素
         * @returns {HTMLVideoElement|null} - 视频元素或null
         */
        getPlayer() {
            const video = Utils.safeQuerySelector(CONSTANTS.SELECTORS.VIDEO);
            if (!video && this.logger.config.isDebugEnabled) {
                this.logger.log('未找到视频元素', true);
            }
            return video;
        }

        /**
         * 等待视频元素加载完成
         * 由于页面动态加载，需要轮询等待视频元素出现
         * @param {number} maxAttempts - 最大尝试次数，避免无限等待
         * @returns {Promise<HTMLVideoElement|null>} - 返回视频元素或null
         */
        async waitForVideo(maxAttempts = CONSTANTS.PROGRESS.MAX_VIDEO_ATTEMPTS) {
            for (let attempts = 0; attempts < maxAttempts; attempts++) {
                const video = this.getPlayer();
                if (video) {
                    this.logVideoInfo(video);
                    return video;
                }
                
                this.logger.log(`等待视频加载，第 ${attempts + 1} 次尝试...`, true);
                await Utils.sleep(CONSTANTS.INTERVALS.VIDEO_CHECK);
            }
            
            this.logger.log(`视频加载超时，已尝试 ${maxAttempts} 次`, true);
            return null;
        }

        /**
         * 记录视频基本信息，用于调试
         * @param {HTMLVideoElement} video - 视频元素
         */
        logVideoInfo(video) {
            if (!this.logger.config.isDebugEnabled) return;
            
            this.logger.log('视频元素已就绪', true);
            this.logger.log(`视频状态: ${video.paused ? '已暂停' : '播放中'}`, true);
            this.logger.log(`视频时长: ${video.duration || 0}秒`, true);
            this.logger.log(`当前进度: ${video.currentTime || 0}秒`, true);
        }

        /**
         * 播放视频 - 自动挂课的核心功能
         * 实现视频的自动播放，确保课程能够正常进行
         * @returns {Promise<boolean>} - 播放是否成功
         */
        async play() {
            const video = await this.waitForVideo();
            if (!video) return false;

            try {
                // 检查视频是否已在播放
                if (video.paused) {
                    // 设置静音模式，避免浏览器自动播放策略限制
                    video.muted = true;
                    
                    // 调用播放方法，可能返回Promise
                    await video.play();
                    this.logger.log('视频已开始播放（静音模式）', true);
                    this.logPlaybackInfo(video);
                    return true;
                } else {
                    this.logger.log('视频已经在播放中', true);
                }
            } catch (error) {
                // 播放失败可能由于浏览器安全策略，需要用户交互
                this.logger.error('播放视频出错', error);
            }
            return false;
        }

        /**
         * 记录视频播放相关信息
         * @param {HTMLVideoElement} video - 视频元素
         */
        logPlaybackInfo(video) {
            if (!this.logger.config.isDebugEnabled) return;
            
            this.logger.log(`视频播放速率: ${video.playbackRate}`, true);
            this.logger.log(`视频音量: ${video.volume}`, true);
        }

        /**
         * 暂停视频播放
         * @returns {boolean} - 暂停是否成功
         */
        pause() {
            const video = this.getPlayer();
            if (!video) return false;

            if (!video.paused) {
                video.pause();
                this.logger.log('暂停播放视频', true);
                this.logger.log(`暂停时视频进度: ${video.currentTime}秒`, true);
                return true;
            } else {
                this.logger.log('视频已经处于暂停状态', true);
            }
            return false;
        }

        /**
         * 获取视频当前状态 - 用于监控播放进度
         * @returns {Object|null} - 视频状态对象，包含播放进度等信息
         */
        getStatus() {
            const video = this.getPlayer();
            if (!video) return null;

            const status = {
                currentTime: video.currentTime || 0,    // 当前播放时间（秒）
                duration: video.duration || 0,          // 视频总时长（秒）
                paused: video.paused,                   // 是否暂停
                playbackRate: video.playbackRate || 1,  // 播放倍速
                volume: video.volume || 0               // 音量 (0-1)
            };

            this.logVideoStatus(status);
            return status;
        }

        /**
         * 记录详细的视频状态信息，便于监控和调试
         * @param {Object} status - 视频状态对象
         */
        logVideoStatus(status) {
            if (!this.logger.config.isDebugEnabled) return;
            
            this.logger.log('当前视频状态:', true);
            this.logger.log(`- 当前时间: ${status.currentTime}秒`, true);
            this.logger.log(`- 总时长: ${status.duration}秒`, true);
            this.logger.log(`- 播放状态: ${status.paused ? '已暂停' : '播放中'}`, true);
            this.logger.log(`- 播放速率: ${status.playbackRate}`, true);
            this.logger.log(`- 音量: ${status.volume}`, true);
        }
    }

    /**
     * API客户端 - 处理网络请求
     * 负责与福建网络干部学院API的通信，包括认证、课程列表获取等
     */
    class ApiClient {
        /**
         * 构造函数
         * @param {LogManager} logger - 日志管理器实例
         */
        constructor(logger) {
            this.logger = logger;
        }

        /**
         * 获取API请求的认证头信息
         * 从localStorage读取token和refreshToken，用于API认证
         * @returns {Object} - 包含认证信息的HTTP头
         * @throws {Error} - 当缺少认证信息时抛出错误
         */
        getAuthHeaders() {
            const token = StorageManager.get(CONSTANTS.STORAGE_KEYS.TOKEN);
            const refreshToken = StorageManager.get(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
            
            if (!token || !refreshToken) {
                throw new Error('缺少认证信息');
            }

            return {
                'Content-Type': 'application/json',
                'Authorization': token,              // 主要认证token
                'RefreshAuthorization': refreshToken // 刷新token，用于续期
            };
        }

        /**
         * 获取课程列表 - 核心API调用方法
         * 向干部学院服务器请求学生的课程列表数据
         * @param {string} url - API接口地址（选修课或必修课）
         * @returns {Promise<Object>} - 返回课程列表数据
         * @throws {Error} - 当请求失败时抛出错误
         */
        async fetchCourseList(url) {
            const studentId = StorageManager.get(CONSTANTS.STORAGE_KEYS.STUDENT_ID);
            if (!studentId) {
                throw new Error('未找到学生ID');
            }

            // 构建API请求体 - 符合干部学院API规范
            const requestBody = {
                studentId: studentId,  // 学生唯一标识
                size: 30,             // 每页课程数量
                current: 1            // 当前页码
            };

            this.logRequestInfo(url, requestBody);

            // 发送POST请求获取课程数据
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getAuthHeaders(),  // 包含认证信息
                body: JSON.stringify(requestBody)
            });

            // 处理可能的token刷新
            await this.handleTokenRefresh(response);

            if (!response.ok) {
                throw new Error(`请求失败: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            this.logResponseInfo(data);
            return data;
        }

        /**
         * 记录API请求信息，用于调试
         * @param {string} url - 请求地址
         * @param {Object} requestBody - 请求体
         */
        logRequestInfo(url, requestBody) {
            if (!this.logger.config.isDebugEnabled) return;
            
            this.logger.log('准备获取课程列表...', true);
            this.logger.log(`请求URL: ${url}`, true);
            this.logger.log(`请求体: ${JSON.stringify(requestBody)}`, true);
        }

        /**
         * 处理token刷新逻辑
         * 服务器可能在响应头中返回新的token，需要及时更新本地存储
         * @param {Response} response - HTTP响应对象
         */
        async handleTokenRefresh(response) {
            if (response.status !== 200) return;

            // 从响应头获取新的token（可能是小写或大写Authorization）
            const newToken = response.headers.get('authorization') || response.headers.get('Authorization');
            const newRefreshToken = response.headers.get('refre');

            if (this.logger.config.isDebugEnabled) {
                this.logger.log('Token更新信息:', true);
                this.logger.log(`- 新token: ${newToken ? '已获取' : '未获取'}`, true);
                this.logger.log(`- 新refreshToken: ${newRefreshToken ? '已获取' : '未获取'}`, true);
            }

            // 更新本地存储中的认证信息
            if (newToken) {
                StorageManager.set(CONSTANTS.STORAGE_KEYS.TOKEN, newToken);
            }
            if (newRefreshToken) {
                StorageManager.set(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
            }
        }

        /**
         * 记录API响应信息，用于调试和监控
         * @param {Object} data - API返回的数据
         */
        logResponseInfo(data) {
            if (!this.logger.config.isDebugEnabled) return;
            
            this.logger.log('课程列表响应:', true);
            this.logger.log(`- 总课程数: ${data.data?.total || 0}`, true);
            this.logger.log(`- 当前页: ${data.data?.current || 0}`, true);
            this.logger.log(`- 每页大小: ${data.data?.size || 0}`, true);
            this.logger.log(`- 课程记录数: ${data.data?.records?.length || 0}`, true);
        }
    }

    /**
     * 课程管理器 - 处理课程相关操作
     * 负责课程进度检测、保存、切换等核心业务逻辑，是自动挂课的关键组件
     */
    class CourseManager {
        /**
         * 构造函数
         * @param {ConfigManager} config - 配置管理器实例
         * @param {LogManager} logger - 日志管理器实例
         */
        constructor(config, logger) {
            this.config = config;
            this.logger = logger;
            this.apiClient = new ApiClient(logger);  // API客户端，用于获取课程列表
        }

        /**
         * 获取当前课程信息 - 核心方法
         * 解析页面中当前选中的课程及其进度信息
         * @returns {Object|null} - 课程信息对象或null
         */
        getCurrentCourseInfo() {
            // 查找页面中标红的当前课程（通过CSS样式识别）
            const currentCourse = Utils.safeQuerySelector(CONSTANTS.SELECTORS.CURRENT_COURSE);
            if (!currentCourse) {
                this.logger.log('未找到当前课程');
                return null;
            }

            // 获取课程进度信息
            const progressSpan = Utils.safeQuerySelector(CONSTANTS.SELECTORS.PROGRESS_SPAN, currentCourse.parentElement);
            const progressText = progressSpan ? progressSpan.textContent : '进度：0.0%';
            const progress = Utils.parseProgress(progressText);

            const courseInfo = {
                element: currentCourse.parentElement,    // DOM元素引用
                title: currentCourse.textContent.trim(), // 课程标题
                progress: progress,                      // 进度数值（0-100）
                progressText: progressText               // 原始进度文本
            };

            this.logCourseInfo(courseInfo);
            return courseInfo;
        }

        /**
         * 记录课程信息，用于调试
         * @param {Object} courseInfo - 课程信息对象
         */
        logCourseInfo(courseInfo) {
            if (!this.logger.config.isDebugEnabled) return;
            
            this.logger.log('当前课程信息:', true);
            this.logger.log(`- 课程标题: ${courseInfo.title}`, true);
            this.logger.log(`- 进度文本: ${courseInfo.progressText}`, true);
            this.logger.log(`- 进度数值: ${courseInfo.progress}%`, true);
        }

        /**
         * 保存课程进度 - 关键业务功能
         * 自动点击保存按钮，确保学习进度被记录到服务器
         */
        saveProgress() {
            const saveButton = Utils.safeQuerySelector(CONSTANTS.SELECTORS.SAVE_BUTTON);
            const button = saveButton?.closest('button');
            
            if (button) {
                this.logger.log(`正在点击保存进度按钮: ${button.textContent.trim()}`, true);
                button.click();  // 模拟用户点击保存按钮
                this.logger.log('自动保存进度');
            } else {
                this.logger.log('未找到保存进度按钮');
                this.logAvailableButtons();
            }
        }

        /**
         * 记录页面中所有可用按钮，用于调试
         */
        logAvailableButtons() {
            if (!this.logger.config.isDebugEnabled) return;
            
            this.logger.log('页面按钮列表:', true);
            const buttons = Utils.safeQuerySelectorAll('button');
            buttons.forEach((btn, index) => {
                this.logger.log(`按钮${index + 1}: ${btn.textContent.trim()}`, true);
            });
        }

        /**
         * 检查当前科目的所有章节是否都已完成 - 核心业务逻辑
         * 遍历所有章节，检查进度是否达到目标值（100%）
         * @returns {boolean} - 所有章节是否都已完成
         */
        areAllChaptersCompleted() {
            const chapters = Utils.safeQuerySelectorAll(CONSTANTS.SELECTORS.CHAPTERS);
            this.logger.log(`检查所有章节状态，共找到 ${chapters.length} 个章节`, true);

            for (const chapter of chapters) {
                // 获取每个章节的进度信息
                const progressSpan = Utils.safeQuerySelector(CONSTANTS.SELECTORS.PROGRESS_SPAN, chapter);
                const progressText = progressSpan ? progressSpan.textContent : '进度：0.0%';
                const progress = Utils.parseProgress(progressText);
                const chapterTitle = Utils.safeQuerySelector(CONSTANTS.SELECTORS.COURSE_TITLE, chapter)?.textContent.trim() || '未知章节';

                this.logger.log(`章节: ${chapterTitle} - 进度: ${progressText}`, true);

                // 如果发现任何一个章节未完成，返回false
                if (progress < this.config.course.targetProgress) {
                    return false;
                }
            }

            return true;  // 所有章节都已完成
        }

        /**
         * 获取课程列表数据
         * @returns {Promise<Object|null>} - 课程列表数据或null
         */
        async fetchCourseList() {
            try {
                const url = this.config.courseApiUrl;  // 根据配置获取对应的API地址
                return await this.apiClient.fetchCourseList(url);
            } catch (error) {
                this.logger.error('获取课程列表失败', error);
                return null;
            }
        }

        /**
         * 查找下一个未完成的科目 - 自动切换科目的核心逻辑
         * 从服务器获取所有科目，找到第一个未完成的科目
         * @returns {Promise<Object|null>} - 下一个未完成的科目或null
         */
        async findNextUnfinishedSubject() {
            this.logger.log('开始查找未完成科目...', true);

            const courseList = await this.fetchCourseList();
            if (!courseList?.data?.records) {
                this.logger.log('获取课程列表失败或列表为空');
                return null;
            }

            this.logger.log(`共找到 ${courseList.data.records.length} 个科目`, true);

            // 查找第一个未完成的科目
            const nextSubject = courseList.data.records.find(course => {
                // 通过比较已学时数和总学时数判断是否完成
                const isCompleted = course.creditsEarned === course.credit;
                this.logSubjectInfo(course, isCompleted);
                return !isCompleted;
            });

            return nextSubject;
        }

        /**
         * 记录科目信息，用于调试
         * @param {Object} course - 科目数据
         * @param {boolean} isCompleted - 是否已完成
         */
        logSubjectInfo(course, isCompleted) {
            if (!this.logger.config.isDebugEnabled) return;
            
            this.logger.log(`科目: ${course.courseware.coursewareName}`, true);
            this.logger.log(`- 已学时数: ${course.creditsEarned}/${course.credit}`, true);
            this.logger.log(`- 状态: ${isCompleted ? '已完成' : '未完成'}`, true);
        }

        /**
         * 导航到指定科目 - 自动跳转功能
         * 构建科目URL并跳转到对应页面
         * @param {Object} courseware - 科目课件信息
         */
        navigateToSubject(courseware) {
            const url = `https://www.fsa.gov.cn/videoChoose?newId=${courseware.id}`;
            this.logNavigationInfo(courseware, url);
            window.location.href = url;  // 页面跳转
        }

        /**
         * 记录导航信息，用于调试
         * @param {Object} courseware - 科目课件信息
         * @param {string} url - 跳转URL
         */
        logNavigationInfo(courseware, url) {
            if (!this.logger.config.isDebugEnabled) return;
            
            this.logger.log('准备跳转到新科目:', true);
            this.logger.log(`- 科目ID: ${courseware.id}`, true);
            this.logger.log(`- 科目名称: ${courseware.coursewareName}`, true);
            this.logger.log(`- 跳转URL: ${url}`, true);
        }
    }

    /**
     * 页面管理器 - 处理不同页面的逻辑
     * 负责协调视频控制器和课程管理器，实现自动挂课的主要业务流程
     */
    class PageManager {
        /**
         * 构造函数
         * @param {ConfigManager} config - 配置管理器
         * @param {LogManager} logger - 日志管理器
         * @param {VideoController} videoController - 视频控制器
         * @param {CourseManager} courseManager - 课程管理器
         */
        constructor(config, logger, videoController, courseManager) {
            this.config = config;
            this.logger = logger;
            this.videoController = videoController;
            this.courseManager = courseManager;
        }

        /**
         * 视频页面主循环 - 自动挂课的核心业务流程
         * 定期执行以下操作：保存进度、检查视频状态、处理课程切换
         */
        async videoPageLoop() {
            this.logger.log('开始新一轮视频页面检查...', true);

            // 1. 保存当前学习进度到服务器
            this.courseManager.saveProgress();

            // 2. 检查视频播放状态，确保视频在播放
            const videoStatus = this.videoController.getStatus();
            if (videoStatus?.paused) {
                await this.videoController.play();
            }

            // 3. 等待一段时间让进度更新
            await Utils.sleep(CONSTANTS.INTERVALS.SAVE_PROGRESS);
            
            // 4. 处理课程进度和切换逻辑
            await this.handleCourseProgress();
        }

        /**
         * 处理课程进度和切换逻辑 - 核心业务决策
         * 检查当前章节是否完成，决定是否需要切换章节或科目
         */
        async handleCourseProgress() {
            try {
                const currentInfo = this.courseManager.getCurrentCourseInfo();
                if (!currentInfo) return;

                // 检查当前章节是否已达到完成标准
                if (currentInfo.progress >= this.config.course.targetProgress) {
                    this.logger.log('当前章节完成，检查其他章节...', true);

                    // 检查所有章节是否都已完成
                    if (this.courseManager.areAllChaptersCompleted()) {
                        this.logger.log('所有章节已完成，准备切换科目...');
                        await this.switchToNextSubject();  // 切换到下一个科目
                    } else {
                        this.switchToNextChapter();  // 切换到下一个章节
                    }
                }
            } catch (error) {
                this.logger.error('处理课程切换时发生错误', error);
            }
        }

        /**
         * 文章页面主循环 - 处理文章阅读类型的课程
         * 定期检查阅读状态，处理课程切换
         */
        async articlePageLoop() {
            this.logger.log('开始新一轮文章页面检查...', true);

            await Utils.sleep(CONSTANTS.INTERVALS.SAVE_PROGRESS);
            await this.handleArticleProgress();
        }

        /**
         * 处理文章阅读进度
         * 检查阅读状态，决定是否切换到下一个科目
         */
        async handleArticleProgress() {
            try {
                const statusElement = Utils.safeQuerySelector(CONSTANTS.SELECTORS.READING_STATUS);
                if (!statusElement) {
                    this.logger.log('未找到阅读状态元素');
                    return;
                }

                const statusText = statusElement.innerText;
                this.logger.log(`当前阅读状态: ${statusText}`, true);

                if (statusText !== '已完成') {
                    this.logger.log(`当前阅读时长：${statusText}`);
                } else {
                    this.logger.log('所有章节已完成，准备切换科目...');
                    await this.switchToNextSubject();
                }
            } catch (error) {
                this.logger.error('处理课程切换时发生错误', error);
            }
        }

        /**
         * 切换到下一个未完成的章节 - 章节级别的自动切换
         * 遍历所有章节，找到第一个未完成的章节并点击
         */
        switchToNextChapter() {
            this.logger.log('开始查找下一个未完成章节...', true);

            const chapters = Utils.safeQuerySelectorAll(CONSTANTS.SELECTORS.CHAPTERS);
            for (const chapter of chapters) {
                // 获取章节进度信息
                const progressSpan = Utils.safeQuerySelector(CONSTANTS.SELECTORS.PROGRESS_SPAN, chapter);
                const progressText = progressSpan ? progressSpan.textContent : '进度：0.0%';
                const progress = Utils.parseProgress(progressText);
                const chapterTitle = Utils.safeQuerySelector(CONSTANTS.SELECTORS.COURSE_TITLE, chapter)?.textContent.trim() || '未知章节';

                this.logger.log(`检查章节: ${chapterTitle} - 进度: ${progressText}`, true);

                // 找到第一个未完成的章节
                if (progress < this.config.course.targetProgress) {
                    this.logger.log('------------------------');
                    this.logger.log('准备切换到章节: ' + chapterTitle);
                    this.logger.log('当前进度: ' + progressText);
                    this.logger.log('------------------------');

                    // 点击章节标题进行切换
                    this.logger.log(`点击章节: ${chapterTitle}`, true);
                    const titleElement = Utils.safeQuerySelector(CONSTANTS.SELECTORS.COURSE_TITLE, chapter);
                    if (titleElement) {
                        titleElement.click();  // 模拟用户点击
                    }
                    break;
                }
            }
        }

        /**
         * 切换到下一个未完成的科目 - 科目级别的自动切换
         * 这是自动挂课的最高级别切换，完成一个科目后自动进入下一个
         */
        async switchToNextSubject() {
            this.logger.log('开始查找下一个未完成科目...', true);

            const nextSubject = await this.courseManager.findNextUnfinishedSubject();
            if (nextSubject) {
                this.logger.log(`找到下一个未完成的科目: ${nextSubject.courseware.coursewareName}`);
                this.logger.log(`当前进度: ${nextSubject.creditsEarned}/${nextSubject.credit}`);
                this.courseManager.navigateToSubject(nextSubject.courseware);  // 跳转到新科目
            } else {
                this.logger.log('恭喜！所有科目都已完成！');
            }
        }

        initVideoPage() {
            this.logger.log('初始化视频播放页面...', true);

            setTimeout(() => {
                this.videoPageLoop();
                this.logger.log(`设置主循环间隔: ${this.config.currentInterval}ms`, true);
                setInterval(() => this.videoPageLoop(), this.config.currentInterval);
            }, CONSTANTS.INTERVALS.INITIALIZATION);
        }

        initArticlePage() {
            this.logger.log('初始化文章阅读页面...', true);

            setTimeout(() => {
                this.clickStartReadingButton();
                this.articlePageLoop();
                this.logger.log(`设置主循环间隔: ${this.config.currentInterval}ms`, true);
                setInterval(() => this.articlePageLoop(), this.config.currentInterval);
            }, CONSTANTS.INTERVALS.INITIALIZATION);
        }

        clickStartReadingButton() {
            const buttons = Utils.safeQuerySelectorAll('button');
            const startButton = buttons[1]; // 第二个按钮是开始阅读按钮
            if (startButton) {
                this.logger.log('点击开始阅读按钮...', true);
                startButton.click();
            }
        }

        initCourseChoosePage() {
            this.logger.log('初始化课程选择页面...', true);

            setTimeout(() => {
                const firstCourse = Utils.safeQuerySelector(CONSTANTS.SELECTORS.FIRST_COURSE);
                if (firstCourse) {
                    this.logger.log(`找到第一条课程: ${firstCourse.textContent}`, true);
                    firstCourse.click();
                    this.logger.log('已选择第一条课程');

                    this.logger.log('5秒后将刷新页面...', true);
                    setTimeout(() => window.location.reload(), CONSTANTS.INTERVALS.PAGE_RELOAD);
                } else {
                    this.logger.log('未找到课程选项');
                    this.logPageContent();
                }
            }, CONSTANTS.INTERVALS.VIDEO_CHECK);
        }

        logPageContent() {
            if (!this.logger.config.isDebugEnabled) return;
            
            this.logger.log('页面内容:', true);
            const pageContent = Utils.safeQuerySelector('.page-content');
            this.logger.log(pageContent ? pageContent.innerHTML : '未找到page-content', true);
        }
    }

    /**
     * 配置面板 - 处理用户界面配置
     */
    class ConfigPanel {
        constructor(config, logger) {
            this.config = config;
            this.logger = logger;
            this.isVisible = true;
            this.dragManager = new DragManager();
        }

        create() {
            const panel = this.createPanelElement();
            document.body.appendChild(panel);
            this.bindEvents();
            this.enableDragging();
        }

        createPanelElement() {
            const panel = document.createElement('div');
            panel.innerHTML = `
                <div id="config-panel" style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
                    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    min-width: 280px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                ">
                    <!-- 头部 -->
                    <div id="panel-header" style="
                        background: rgba(255, 255, 255, 0.1);
                        padding: 16px 20px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        cursor: move;
                        user-select: none;
                    ">
                        <div style="display: flex; align-items: center; gap: 10px; flex: 1;" id="panel-drag-handle">
                            <div style="
                                width: 24px;
                                height: 24px;
                                background: linear-gradient(45deg, #4ade80, #22c55e);
                                border-radius: 6px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 12px;
                                color: white;
                                font-weight: bold;
                            ">⚙️</div>
                            <div style="flex: 1;">
                                <div style="color: white; font-weight: 600; font-size: 15px;">脚本控制</div>
                                <div style="color: rgba(255,255,255,0.7); font-size: 11px;">v2.2.0 • 拖拽移动</div>
                            </div>
                        </div>
                        <div id="panel-toggle" style="
                            width: 20px;
                            height: 20px;
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 4px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 14px;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">−</div>
                    </div>

                    <!-- 主体内容 -->
                    <div id="panel-body" style="
                        background: rgba(255, 255, 255, 0.95);
                        padding: 20px;
                    ">
                        <!-- 调试模式 -->
                        <div style="margin-bottom: 20px;">
                            <div style="
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                padding: 12px 16px;
                                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                                border-radius: 12px;
                                border: 1px solid rgba(0, 0, 0, 0.05);
                                cursor: pointer;
                                transition: all 0.2s ease;
                            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div id="debugIcon" style="
                                        width: 32px;
                                        height: 32px;
                                        border-radius: 8px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-size: 16px;
                                        ${this.config.isDebugEnabled ? 
                                            'background: linear-gradient(135deg, #22c55e, #16a34a); color: white;' : 
                                            'background: linear-gradient(135deg, #64748b, #475569); color: white;'
                                        }
                                        transition: all 0.3s ease;
                                    ">${this.config.isDebugEnabled ? '🟢' : '🔴'}</div>
                                    <div>
                                        <div style="font-weight: 600; color: #1e293b; font-size: 14px;">调试模式</div>
                                        <div style="color: #64748b; font-size: 12px;">显示详细运行日志</div>
                                    </div>
                                </div>
                                <div style="
                                    position: relative;
                                    width: 48px;
                                    height: 24px;
                                    background: ${this.config.isDebugEnabled ? '#22c55e' : '#cbd5e1'};
                                    border-radius: 12px;
                                    transition: all 0.3s ease;
                                    cursor: pointer;
                                " id="debugToggle">
                                    <div style="
                                        position: absolute;
                                        top: 2px;
                                        left: ${this.config.isDebugEnabled ? '26px' : '2px'};
                                        width: 20px;
                                        height: 20px;
                                        background: white;
                                        border-radius: 10px;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                    "></div>
                                </div>
                            </div>
                        </div>

                        <!-- 课程模式 -->
                        <div style="margin-bottom: 16px;">
                            <label style="
                                display: block;
                                font-weight: 600;
                                color: #374151;
                                font-size: 13px;
                                margin-bottom: 8px;
                            ">课程模式</label>
                            <div style="position: relative;">
                                <select id="courseMode" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                                    border: 1px solid rgba(0, 0, 0, 0.1);
                                    border-radius: 12px;
                                    font-size: 14px;
                                    color: #1e293b;
                                    font-weight: 500;
                                    cursor: pointer;
                                    transition: all 0.2s ease;
                                    appearance: none;
                                    background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 12 12\"><path fill=\"%23374151\" d=\"M6 8L2 4h8L6 8z\"/></svg>');
                                    background-repeat: no-repeat;
                                    background-position: right 12px center;
                                " onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='rgba(0,0,0,0.1)'; this.style.boxShadow='none'">
                                    <option value="elective" ${this.config.course.mode === 'elective' ? 'selected' : ''}>📚 选修课程</option>
                                    <option value="required" ${this.config.course.mode === 'required' ? 'selected' : ''}>📖 必修课程</option>
                                </select>
                            </div>
                        </div>

                        <!-- 状态信息 -->
                        <div style="
                            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                            border: 1px solid rgba(245, 158, 11, 0.2);
                            border-radius: 12px;
                            padding: 12px 16px;
                            margin-top: 16px;
                        ">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                <div style="color: #92400e; font-size: 14px;">ℹ️</div>
                                <div style="color: #92400e; font-weight: 600; font-size: 13px;">运行状态</div>
                            </div>
                            <div style="color: #451a03; font-size: 12px; line-height: 1.4;">
                                脚本正在自动运行中...<br>
                                <span style="color: #92400e;">⏱️ 间隔: ${this.config.isDebugEnabled ? '5秒' : '20秒'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            return panel;
        }

        bindEvents() {
            // 面板收缩/展开
            const panelToggle = document.getElementById('panel-toggle');
            const panelBody = document.getElementById('panel-body');

            const togglePanel = () => {
                this.isVisible = !this.isVisible;
                if (this.isVisible) {
                    panelBody.style.display = 'block';
                    panelToggle.textContent = '−';
                } else {
                    panelBody.style.display = 'none';
                    panelToggle.textContent = '+';
                }
            };

            panelToggle?.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePanel();
            });

            // 调试模式切换
            const debugToggle = document.getElementById('debugToggle');
            const debugIcon = document.getElementById('debugIcon');
            
            const updateDebugUI = () => {
                const toggle = document.getElementById('debugToggle');
                const icon = document.getElementById('debugIcon');
                const ball = toggle?.querySelector('div');
                
                if (this.config.isDebugEnabled) {
                    toggle.style.background = '#22c55e';
                    ball.style.left = '26px';
                    icon.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                    icon.textContent = '🟢';
                } else {
                    toggle.style.background = '#cbd5e1';
                    ball.style.left = '2px';
                    icon.style.background = 'linear-gradient(135deg, #64748b, #475569)';
                    icon.textContent = '🔴';
                }
            };

            debugToggle?.addEventListener('click', () => {
                this.config.toggleDebug();
                updateDebugUI();
                this.logger.log(`调试模式已${this.config.isDebugEnabled ? '开启' : '关闭'}`);
            });

            // 课程模式切换
            const courseModeSelect = document.getElementById('courseMode');
            courseModeSelect?.addEventListener('change', (e) => {
                this.config.setCourseMode(e.target.value);
                this.logger.log(`已切换到${this.config.course.mode === 'required' ? '必修' : '选修'}模式`);
            });
        }

        enableDragging() {
            const dragHandle = document.getElementById('panel-drag-handle');
            const panel = document.getElementById('config-panel');
            if (dragHandle && panel) {
                this.dragManager.makeDraggable(panel, dragHandle, 'config-panel');
            }
        }
    }

    /**
     * 通知管理器 - 处理用户通知
     */
    class NotificationManager {
        static notifications = [];
        static maxNotifications = 3;

        static show(message, type = 'success', duration = CONSTANTS.UI.NOTIFICATION_DURATION) {
            const notification = this.createNotification(message, type);
            this.addNotification(notification);
            
            // 设置自动消失
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);

            return notification;
        }

        static createNotification(message, type) {
            const notification = document.createElement('div');
            
            // 获取类型相关的样式
            const typeConfig = this.getTypeConfig(type);
            
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: ${typeConfig.background};
                color: white;
                padding: 16px 20px;
                border-radius: 12px;
                z-index: 10001;
                box-shadow: 0 10px 25px ${typeConfig.shadow}, 0 0 0 1px rgba(255, 255, 255, 0.1);
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                font-size: 14px;
                max-width: 320px;
                min-width: 200px;
                word-wrap: break-word;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
            `;

            notification.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.2);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        margin-top: 1px;
                        flex-shrink: 0;
                    ">${typeConfig.icon}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 2px;">${typeConfig.title}</div>
                        <div style="opacity: 0.9; font-size: 13px; line-height: 1.4;">${message}</div>
                    </div>
                    <div style="
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.2);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        cursor: pointer;
                        flex-shrink: 0;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</div>
                </div>
            `;

            // 点击关闭
            notification.addEventListener('click', () => {
                this.removeNotification(notification);
            });

            document.body.appendChild(notification);

            // 触发进入动画
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
                notification.style.opacity = '1';
            });

            return notification;
        }

        static getTypeConfig(type) {
            const configs = {
                success: {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    shadow: 'rgba(16, 185, 129, 0.4)',
                    icon: '✓',
                    title: '成功'
                },
                error: {
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    shadow: 'rgba(239, 68, 68, 0.4)',
                    icon: '✕',
                    title: '错误'
                },
                warning: {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    shadow: 'rgba(245, 158, 11, 0.4)',
                    icon: '⚠',
                    title: '警告'
                },
                info: {
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    shadow: 'rgba(59, 130, 246, 0.4)',
                    icon: 'i',
                    title: '提示'
                }
            };

            return configs[type] || configs.success;
        }

        static addNotification(notification) {
            this.notifications.push(notification);
            this.updatePositions();

            // 如果通知过多，移除最旧的
            if (this.notifications.length > this.maxNotifications) {
                const oldest = this.notifications.shift();
                this.removeNotification(oldest);
            }
        }

        static removeNotification(notification) {
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
                
                // 退出动画
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);

                this.updatePositions();
            }
        }

        static updatePositions() {
            this.notifications.forEach((notification, index) => {
                const offset = index * 90; // 每个通知间距90px
                notification.style.top = `${80 + offset}px`;
            });
        }

        // 便捷方法
        static success(message, duration) {
            return this.show(message, 'success', duration);
        }

        static error(message, duration) {
            return this.show(message, 'error', duration);
        }

        static warning(message, duration) {
            return this.show(message, 'warning', duration);
        }

        static info(message, duration) {
            return this.show(message, 'info', duration);
        }
    }

    /**
     * 应用程序主类 - 自动挂课脚本的入口和协调中心
     * 负责初始化所有组件，根据页面类型启动相应的业务流程
     */
    class AutoPlayApp {
        /**
         * 构造函数 - 初始化所有核心组件
         * 按照依赖关系创建各个管理器实例
         */
        constructor() {
            // 基础组件
            this.config = new ConfigManager();                                                          // 配置管理器
            this.logger = new LogManager(this.config);                                                  // 日志管理器
            
            // 业务组件
            this.videoController = new VideoController(this.logger);                                   // 视频控制器
            this.courseManager = new CourseManager(this.config, this.logger);                         // 课程管理器
            this.pageManager = new PageManager(this.config, this.logger, this.videoController, this.courseManager); // 页面管理器
            
            // UI组件
            this.configPanel = new ConfigPanel(this.config, this.logger);                             // 配置面板
        }

        /**
         * 应用程序初始化 - 启动自动挂课功能
         * 创建UI界面，等待页面稳定，然后根据页面类型启动相应流程
         */
        async initialize() {
            try {
                // 1. 创建用户界面
                this.configPanel.create();

                // 2. 显示启动通知，告知用户脚本已开始工作
                NotificationManager.success("脚本已启动，正在初始化...");

                // 3. 等待页面完全加载和稳定
                await Utils.sleep(CONSTANTS.INTERVALS.SAVE_PROGRESS);
                this.logger.log('等待2s后开始初始化');

                // 4. 根据当前页面URL启动对应的业务流程
                this.initializePageByUrl();

            } catch (error) {
                this.logger.error('初始化失败', error);
            }
        }

        /**
         * 根据页面URL初始化对应的业务流程
         * 福建干部网络学院有三种主要页面类型，需要不同的处理逻辑
         */
        initializePageByUrl() {
            const currentURL = window.location.href;

            if (currentURL.includes('/video?')) {
                // 视频学习页面 - 主要的挂课页面，包含视频播放和章节切换
                this.pageManager.initVideoPage();
            } else if (currentURL.includes('/videoChoose')) {
                // 课程选择页面 - 科目选择页面，自动选择第一个课程
                this.pageManager.initCourseChoosePage();
            } else if (currentURL.includes('/study-artical')) {
                // 文章阅读页面 - 文档类课程页面，需要等待阅读时间
                this.pageManager.initArticlePage();
            } else {
                this.logger.log('未知页面类型');
            }
        }
    }

    /**
     * ========================================
     * 应用程序入口 - 自动挂课脚本启动点
     * ========================================
     */
    
    // 创建应用程序实例
    const app = new AutoPlayApp();
    
    // 根据页面加载状态决定初始化时机
    if (document.readyState === 'loading') {
        // 页面还在加载中，等待DOM内容加载完成
        document.addEventListener('DOMContentLoaded', () => app.initialize());
    } else {
        // 页面已经加载完成，立即初始化
        app.initialize();
    }

})();