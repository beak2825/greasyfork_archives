// ==UserScript==
// @name         齐大教务助手
// @namespace    https://greasyfork.org/users/737539
// @version      2.3.4
// @description  集成抢课功能与教学评估功能，一体化教务助手
// @author       忘忧
// @icon         https://xyh.qqhru.edu.cn/favicon.ico
// @license      MIT
// @match        http://111.43.36.164/student/teachingEvaluation/evaluation/index
// @match        http://111.43.36.164/student/courseSelect/courseSelect/index
// @match        http://111.43.36.164/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        http://111.43.36.164/student/teachingEvaluation/teachingEvaluation/index
// @match        http://172.20.139.153:7700/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        http://172.20.139.153:7700/student/teachingEvaluation/teachingEvaluation/index
// @match        https://172-20-139-153-7700.webvpn.qqhru.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        https://172-20-139-153-7700.webvpn.qqhru.edu.cn/student/teachingEvaluation/teachingEvaluation/index
// @match        https://172-20-139-153-7700.webvpn.qqhru.edu.cn/student/teachingEvaluation/evaluation/index
// @match        http://172.20.139.153:7700/student/teachingEvaluation/evaluation/index
// @match        http://172.20.139.153:7700/student/courseSelect/courseSelect/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534036/%E9%BD%90%E5%A4%A7%E6%95%99%E5%8A%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534036/%E9%BD%90%E5%A4%A7%E6%95%99%E5%8A%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 齐大教务助手主模块
     * 模块化结构，将不同功能划分为独立模块
     */
    const EducationHelper = {
        // 系统配置
        Config: {
            // 全局状态
            state: {
                targetCourses: [],
                matchedCourses: [],
                timer: null,
                autoMode: false,
                autoClickEvaluationEnabled: false, 
                selectedOption: "A",
                autoSubmitEnabled: true,
                debugMode: false,
                uiFollowPage: true,
            },
            
            // 页面类型
            pageType: {
                currentPageUrl: window.location.href,
                isCoursePage: false,
                isEvaluationPage: false,
                isEvaluationListPage: false
            },
            
            // 时间设置
            timers: {
                autoClickEvaluationDelay: 10000, // 延迟10秒执行自动点击
                autoSubmitDelay: 120000,        // 自动提交延迟，默认2分钟
            },
            
            // 内容设置
            content: {
                evaluationComment: "上课有热情，积极解决学生问题，很好的老师！！", // 默认评价内容
            },
            
            // 初始化配置
            init: function() {
                // 检测页面类型
                this.pageType.isCoursePage = this.pageType.currentPageUrl.includes('courseSelect');
                this.pageType.isEvaluationPage = this.pageType.currentPageUrl.includes('teachingEvaluation/evaluationPage');
                this.pageType.isEvaluationListPage = this.pageType.currentPageUrl.includes('teachingEvaluation/teachingEvaluation/index') || 
                                      this.pageType.currentPageUrl.includes('teachingEvaluation/evaluation/index');
                
                // 从localStorage读取持久化设置
                this.loadSavedSettings();
                
                return this;
            },
            
            // 保存设置到localStorage
            saveSettings: function() {
                try {
                    localStorage.setItem('autoMode', this.state.autoMode.toString());
                    localStorage.setItem('evaluationComment', this.content.evaluationComment);
                    localStorage.setItem('selectedOption', this.state.selectedOption);
                    console.log('[设置] 已保存设置到localStorage');
                } catch (e) {
                    console.warn("[警告] 保存设置到localStorage失败:", e);
                }
            },
            
            // 从localStorage加载设置
            loadSavedSettings: function() {
                try {
                    const storedAutoMode = localStorage.getItem('autoMode');
                    if (storedAutoMode === 'true') {
                        this.state.autoMode = true;
                        console.log('[检测] 从localStorage检测到全自动模式已启用');
                    }
                    
                    const storedComment = localStorage.getItem('evaluationComment');
                    if (storedComment) {
                        this.content.evaluationComment = storedComment;
                    }
                    
                    const storedOption = localStorage.getItem('selectedOption');
                    if (storedOption) {
                        this.state.selectedOption = storedOption;
                    }
                } catch (e) {
                    console.warn("[警告] 读取localStorage失败:", e);
                }
            }
        },
        
        // 日志模块
        Logger: {
            // 调试日志
            debug: function(message, data) {
                if (EducationHelper.Config.state.debugMode) {
                    console.log(`[调试] ${message}`, data || '');
                    
                    const debugContent = document.getElementById('debugContent');
                    if (debugContent) {
                        const logItem = document.createElement('div');
                        logItem.style.borderBottom = '1px dashed #eee';
                        logItem.style.paddingBottom = '3px';
                        logItem.style.marginBottom = '3px';
                        
                        let logText = message;
                        if (data) {
                            if (typeof data === 'object') {
                                try {
                                    logText += ` ${JSON.stringify(data)}`;
                                } catch (e) {
                                    logText += ` [复杂对象]`;
                                }
                            } else {
                                logText += ` ${data}`;
                            }
                        }
                        
                        logItem.textContent = logText;
                        debugContent.appendChild(logItem);
                        debugContent.scrollTop = debugContent.scrollHeight; // 自动滚动到底部
                    }
                }
            },
            
            // 信息日志
            info: function(message) {
                console.log(`[信息] ${message}`);
            },
            
            // 操作日志
            action: function(message) {
                console.log(`[操作] ${message}`);
            },
            
            // 成功日志
            success: function(message) {
                console.log(`[成功] ${message}`);
            },
            
            // 警告日志
            warn: function(message) {
                console.warn(`[警告] ${message}`);
            },
            
            // 错误日志
            error: function(message, error) {
                if (error) {
                    console.error(`[错误] ${message}`, error);
                } else {
                    console.error(`[错误] ${message}`);
                }
            }
        },
        
        // UI模块
        UI: {
            // UI元素
            elements: {
                container: null,
                dragBar: null,
                content: null,
            },
            
            // UI样式 - iOS风格设计
            styles: {
                // 将在初始化时添加
                cssRules: `
                    /* iOS风格全局样式 */
                    * {
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }

                    /* iOS风格按钮 */
                    .ui-button {
                        background: linear-gradient(135deg, #007AFF, #0051D5);
                        color: white;
                        border: none;
                        padding: 12px 16px;
                        cursor: pointer;
                        width: 100%;
                        margin-bottom: 12px;
                        border-radius: 12px;
                        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        font-weight: 600;
                        font-size: 16px;
                        letter-spacing: -0.24px;
                        box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
                        position: relative;
                        overflow: hidden;
                    }

                    .ui-button::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
                        border-radius: 12px;
                        pointer-events: none;
                    }

                    .ui-button:hover {
                        background: linear-gradient(135deg, #0051D5, #003D9F);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 16px rgba(0, 122, 255, 0.35);
                    }

                    .ui-button:active {
                        transform: scale(0.96);
                        box-shadow: 0 1px 4px rgba(0, 122, 255, 0.2);
                    }

                    .ui-button:disabled {
                        background: #E5E5EA;
                        color: #8E8E93;
                        cursor: not-allowed;
                        transform: none;
                        box-shadow: none;
                    }

                    /* iOS风格输入框 */
                    .ui-input {
                        width: 100%;
                        padding: 12px 16px;
                        margin-bottom: 12px;
                        border: 1px solid #E5E5EA;
                        border-radius: 12px;
                        box-sizing: border-box;
                        font-size: 16px;
                        background: #FFFFFF;
                        transition: all 0.2s ease;
                        -webkit-appearance: none;
                    }

                    .ui-input:focus {
                        outline: none;
                        border-color: #007AFF;
                        box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
                    }

                    /* iOS风格标签 */
                    .ui-label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: 600;
                        color: #1C1C1E;
                        font-size: 15px;
                        letter-spacing: -0.24px;
                    }

                    /* iOS风格面板 */
                    .ui-panel {
                        border: none;
                        border-radius: 16px;
                        padding: 16px;
                        margin-bottom: 16px;
                        background: #F2F2F7;
                        max-height: 140px;
                        overflow-y: auto;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    }

                    .ui-panel-title {
                        font-weight: 700;
                        margin-bottom: 8px;
                        color: #007AFF;
                        font-size: 16px;
                        letter-spacing: -0.32px;
                    }

                    /* iOS风格标签页 */
                    .ui-tabs {
                        display: flex;
                        margin-bottom: 16px;
                        background: #F2F2F7;
                        border-radius: 12px;
                        padding: 4px;
                        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
                    }

                    .ui-tab {
                        flex: 1;
                        padding: 10px 16px;
                        cursor: pointer;
                        background: transparent;
                        border: none;
                        border-radius: 8px;
                        margin: 0;
                        font-weight: 500;
                        color: #8E8E93;
                        transition: all 0.2s ease;
                        text-align: center;
                        font-size: 15px;
                    }

                    .ui-tab.active {
                        background: #FFFFFF;
                        color: #007AFF;
                        font-weight: 600;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    }

                    .ui-tab-content {
                        display: none;
                    }

                    .ui-tab-content.active {
                        display: block;
                    }

                    /* iOS风格删除按钮 */
                    .delete-btn {
                        background: #FF3B30;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        padding: 6px 12px;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    }

                    .delete-btn:hover {
                        background: #D70015;
                        transform: scale(0.95);
                    }

                    /* 课程项目 */
                    .course-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 0;
                        border-bottom: 1px solid #E5E5EA;
                        font-size: 15px;
                    }

                    .course-item:last-child {
                        border-bottom: none;
                    }

                    /* iOS风格复选框容器 */
                    .ui-checkbox-container {
                        display: flex;
                        align-items: center;
                        margin-bottom: 16px;
                        padding: 12px 16px;
                        background: #F2F2F7;
                        border-radius: 12px;
                    }

                    .ui-checkbox {
                        margin-right: 12px;
                        width: 20px;
                        height: 20px;
                        accent-color: #007AFF;
                    }

                    /* 选项容器 */
                    .option-container {
                        margin-bottom: 16px;
                        background: #F2F2F7;
                        border-radius: 12px;
                        padding: 8px;
                    }

                    .option-row {
                        margin-bottom: 0;
                    }

                    .radio-label {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        padding: 12px 16px;
                        border-radius: 8px;
                        transition: background-color 0.2s ease;
                        font-size: 15px;
                        font-weight: 500;
                    }

                    .radio-label:hover {
                        background: rgba(0, 122, 255, 0.1);
                    }

                    .radio-label input {
                        margin-right: 12px;
                        width: 18px;
                        height: 18px;
                        accent-color: #007AFF;
                    }

                    /* iOS风格计时器显示 */
                    .timer-display {
                        background: linear-gradient(135deg, #34C759, #30A14E);
                        color: white;
                        padding: 12px 16px;
                        border-radius: 12px;
                        text-align: center;
                        margin-bottom: 16px;
                        font-weight: 600;
                        font-size: 16px;
                        display: none;
                        box-shadow: 0 2px 8px rgba(52, 199, 89, 0.25);
                    }
                `,
                
                // 添加CSS样式到页面
                addStyles: function() {
                    const style = document.createElement('style');
                    style.innerHTML = this.cssRules;
                    document.head.appendChild(style);
                }
            },
            
            // 创建UI界面 - iOS风格
            create: function() {
                EducationHelper.Logger.action('正在创建iOS风格UI...');

                // 添加样式
                this.styles.addStyles();

                // 创建主容器
                this.elements.container = document.createElement('div');
                this.elements.container.id = 'qqhruHelperUI';
                this.elements.container.style.position = EducationHelper.Config.state.uiFollowPage ? 'fixed' : 'absolute';
                this.elements.container.style.top = '20px';
                this.elements.container.style.right = '20px';
                this.elements.container.style.width = '320px';
                this.elements.container.style.backgroundColor = '#FFFFFF';
                this.elements.container.style.border = 'none';
                this.elements.container.style.padding = '0';
                this.elements.container.style.zIndex = '9999';
                this.elements.container.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)';
                this.elements.container.style.borderRadius = '20px';
                this.elements.container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
                this.elements.container.style.backdropFilter = 'blur(20px)';
                this.elements.container.style.webkitBackdropFilter = 'blur(20px)';
                this.elements.container.style.overflow = 'hidden';

                // iOS风格标题和内容区域HTML
                this.elements.container.innerHTML = `
                    <div id="dragBar" style="
                        background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
                        color: white;
                        padding: 16px 20px;
                        text-align: center;
                        cursor: grab;
                        font-weight: 700;
                        font-size: 17px;
                        letter-spacing: -0.41px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        position: relative;
                        overflow: hidden;
                    ">
                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0)); pointer-events: none;"></div>
                        <span style="position: relative; z-index: 1;">📚 齐大教务助手</span>
                        <div style="position: relative; z-index: 1; display: flex; gap: 8px;">
                            <button id="minimizeBtn" style="
                                background: rgba(255, 255, 255, 0.2);
                                border: none;
                                color: white;
                                cursor: pointer;
                                font-size: 18px;
                                width: 28px;
                                height: 28px;
                                border-radius: 14px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.2s ease;
                                backdrop-filter: blur(10px);
                                -webkit-backdrop-filter: blur(10px);
                            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">−</button>
                            <button id="closeBtn" style="
                                background: rgba(255, 59, 48, 0.8);
                                border: none;
                                color: white;
                                cursor: pointer;
                                font-size: 16px;
                                width: 28px;
                                height: 28px;
                                border-radius: 14px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.2s ease;
                                backdrop-filter: blur(10px);
                                -webkit-backdrop-filter: blur(10px);
                            " onmouseover="this.style.background='rgba(255,59,48,1)'" onmouseout="this.style.background='rgba(255,59,48,0.8)'">×</button>
                        </div>
                    </div>
                    <div id="uiContent" style="
                        padding: 20px;
                        background: #FFFFFF;
                        min-height: 200px;
                    ">
                        <!-- 内容将根据页面类型动态生成 -->
                    </div>
                `;

                document.body.appendChild(this.elements.container);

                // 保存元素引用
                this.elements.dragBar = document.getElementById('dragBar');
                this.elements.content = document.getElementById('uiContent');

                // 根据页面类型生成内容
                this.generateContent();

                // 实现拖动功能
                this.makeDraggable();

                // 添加按钮事件
                document.getElementById('minimizeBtn').addEventListener('click', this.toggleMinimize.bind(this));
                document.getElementById('closeBtn').addEventListener('click', () => {
                    // iOS风格关闭动画
                    this.elements.container.style.transform = 'scale(0.8)';
                    this.elements.container.style.opacity = '0';
                    setTimeout(() => {
                        this.elements.container.style.display = 'none';
                        this.elements.container.style.transform = 'scale(1)';
                        this.elements.container.style.opacity = '1';
                    }, 200);
                });

                EducationHelper.Logger.success('iOS风格UI创建完成');

                return this;
            },
            
            // 根据页面类型生成内容
            generateContent: function() {
                // 将在后续实现
                EducationHelper.Logger.action('生成页面内容');
            },
            
            // 使UI可拖动
            makeDraggable: function() {
                let offsetX = 0;
                let offsetY = 0;
                let isDragging = false;
                
                this.elements.dragBar.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    offsetX = e.clientX - this.elements.container.getBoundingClientRect().left;
                    offsetY = e.clientY - this.elements.container.getBoundingClientRect().top;
                    this.elements.dragBar.style.cursor = 'grabbing';
                    document.body.style.userSelect = 'none';
                });
                
                document.addEventListener('mousemove', (e) => {
                    if (isDragging) {
                        let newX = e.clientX - offsetX;
                        let newY = e.clientY - offsetY;
                        
                        // 限制UI在页面内
                        const maxX = window.innerWidth - this.elements.container.offsetWidth;
                        const maxY = window.innerHeight - this.elements.container.offsetHeight;
                        
                        if (newX < 0) newX = 0;
                        if (newY < 0) newY = 0;
                        if (newX > maxX) newX = maxX;
                        if (newY > maxY) newY = maxY;
                        
                        this.elements.container.style.left = `${newX}px`;
                        this.elements.container.style.top = `${newY}px`;
                    }
                });
                
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                    this.elements.dragBar.style.cursor = 'grab';
                    document.body.style.userSelect = '';
                });
            },
            
            // 切换最小化状态 - iOS风格动画
            toggleMinimize: function() {
                const content = this.elements.content;
                const btn = document.getElementById('minimizeBtn');

                if (content.style.display === 'none') {
                    // 展开动画
                    content.style.display = 'block';
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(-10px)';

                    setTimeout(() => {
                        content.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }, 10);

                    btn.textContent = '−';
                    btn.style.transform = 'rotate(0deg)';
                } else {
                    // 收起动画
                    content.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(-10px)';

                    setTimeout(() => {
                        content.style.display = 'none';
                        content.style.transition = '';
                    }, 300);

                    btn.textContent = '+';
                    btn.style.transform = 'rotate(90deg)';
                }
            },

            // 显示状态消息 - iOS风格
            showMessage: function(message, type = 'info', duration = 3000) {
                const msgElement = document.createElement('div');
                msgElement.style = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.8);
                    padding: 20px 24px;
                    border-radius: 16px;
                    z-index: 10000;
                    text-align: center;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1);
                    color: white;
                    font-weight: 600;
                    font-size: 16px;
                    letter-spacing: -0.24px;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    max-width: 300px;
                    min-width: 200px;
                `;

                // 根据类型设置iOS风格颜色
                switch(type) {
                    case 'success':
                        msgElement.style.background = 'rgba(52, 199, 89, 0.9)';
                        break;
                    case 'error':
                        msgElement.style.background = 'rgba(255, 59, 48, 0.9)';
                        break;
                    case 'warning':
                        msgElement.style.background = 'rgba(255, 149, 0, 0.9)';
                        break;
                    default:
                        msgElement.style.background = 'rgba(0, 122, 255, 0.9)';
                }

                msgElement.innerHTML = message;
                document.body.appendChild(msgElement);

                // iOS风格进入动画
                setTimeout(() => {
                    msgElement.style.opacity = '1';
                    msgElement.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 10);

                // 自动消失
                if (duration > 0) {
                    setTimeout(() => {
                        if (msgElement && document.contains(msgElement)) {
                            // iOS风格退出动画
                            msgElement.style.opacity = '0';
                            msgElement.style.transform = 'translate(-50%, -50%) scale(0.8)';
                            setTimeout(() => {
                                if (msgElement && document.contains(msgElement)) {
                                    msgElement.remove();
                                }
                            }, 300);
                        }
                    }, duration);
                }

                return msgElement;
            }
        },
        
        /**
         * 其他模块将在后续添加
         */
        
        // 抢课模块
        CourseGrabber: {
            // 课程列表操作
            courseList: {
                // 添加课程
                add: function(courseCode) {
                    if (!courseCode) return false;
                    
                    const courses = courseCode.split('\n').map(code => code.trim());
                    courses.forEach(course => {
                        if (course && !EducationHelper.Config.state.targetCourses.includes(course)) {
                            EducationHelper.Config.state.targetCourses.push(course);
                        }
                    });
                    
                    this.updateUI();
                    EducationHelper.Logger.success(`已添加课程: ${courses.join(', ')}`);
                    return true;
                },
                
                // 移除课程
                remove: function(index) {
                    if (index >= 0 && index < EducationHelper.Config.state.targetCourses.length) {
                        const removedCourse = EducationHelper.Config.state.targetCourses.splice(index, 1)[0];
                        this.updateUI();
                        EducationHelper.Logger.success(`已移除课程: ${removedCourse}`);
                        return true;
                    }
                    return false;
                },
                
                // 更新课程列表UI - iOS风格
                updateUI: function() {
                    const courseListDiv = document.getElementById('courseList');
                    if (!courseListDiv) return;

                    courseListDiv.innerHTML = '';

                    if (EducationHelper.Config.state.targetCourses.length === 0) {
                        courseListDiv.innerHTML = `
                            <div style="
                                text-align: center;
                                color: #8E8E93;
                                padding: 20px 0;
                                font-size: 15px;
                            ">
                                暂无课程，请先添加课程代码
                            </div>
                        `;
                    } else {
                        EducationHelper.Config.state.targetCourses.forEach((course, index) => {
                            const courseItem = document.createElement('div');
                            courseItem.className = 'course-item';
                            courseItem.style.cssText = `
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 12px 0;
                                border-bottom: 1px solid #E5E5EA;
                                font-size: 15px;
                                font-weight: 500;
                            `;

                            courseItem.innerHTML = `
                                <span style="
                                    color: #1C1C1E;
                                    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                                    background: #F2F2F7;
                                    padding: 4px 8px;
                                    border-radius: 6px;
                                    font-size: 14px;
                                ">${course}</span>
                                <button class="delete-btn" data-index="${index}" style="
                                    background: #FF3B30;
                                    color: white;
                                    border: none;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    padding: 6px 12px;
                                    font-size: 14px;
                                    font-weight: 500;
                                    transition: all 0.2s ease;
                                ">🗑️ 删除</button>
                            `;

                            // 最后一个项目不显示底部边框
                            if (index === EducationHelper.Config.state.targetCourses.length - 1) {
                                courseItem.style.borderBottom = 'none';
                            }

                            courseListDiv.appendChild(courseItem);
                        });

                        // 添加删除按钮事件
                        courseListDiv.querySelectorAll('.delete-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const idx = parseInt(e.target.getAttribute('data-index'));
                                this.remove(idx);
                            });

                            // 添加悬停效果
                            btn.addEventListener('mouseenter', function() {
                                this.style.background = '#D70015';
                                this.style.transform = 'scale(0.95)';
                            });

                            btn.addEventListener('mouseleave', function() {
                                this.style.background = '#FF3B30';
                                this.style.transform = 'scale(1)';
                            });
                        });
                    }
                }
            },
            
            // 匹配成功课程操作
            matchedCourses: {
                // 添加匹配成功的课程
                add: function(courseCode) {
                    if (courseCode && !EducationHelper.Config.state.matchedCourses.includes(courseCode)) {
                        EducationHelper.Config.state.matchedCourses.push(courseCode);
                        this.updateUI();
                        EducationHelper.Logger.success(`已添加匹配成功课程: ${courseCode}`);
                        return true;
                    }
                    return false;
                },
                
                // 更新匹配成功课程UI - iOS风格
                updateUI: function() {
                    const matchedCoursesDiv = document.getElementById('matchedCourses');
                    if (!matchedCoursesDiv) return;

                    matchedCoursesDiv.innerHTML = '';

                    if (EducationHelper.Config.state.matchedCourses.length === 0) {
                        matchedCoursesDiv.innerHTML = `
                            <div style="
                                text-align: center;
                                color: #8E8E93;
                                padding: 20px 0;
                                font-size: 15px;
                            ">
                                暂无匹配成功的课程
                            </div>
                        `;
                    } else {
                        EducationHelper.Config.state.matchedCourses.forEach((course, index) => {
                            const courseItem = document.createElement('div');
                            courseItem.className = 'course-item';
                            courseItem.style.cssText = `
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 12px 0;
                                border-bottom: 1px solid #E5E5EA;
                                font-size: 15px;
                                font-weight: 500;
                            `;

                            courseItem.innerHTML = `
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="
                                        color: #34C759;
                                        font-size: 16px;
                                    ">✅</span>
                                    <span style="
                                        color: #1C1C1E;
                                        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                                        background: #E8F5E9;
                                        padding: 4px 8px;
                                        border-radius: 6px;
                                        font-size: 14px;
                                        border: 1px solid #C8E6C9;
                                    ">${course}</span>
                                </div>
                            `;

                            // 最后一个项目不显示底部边框
                            if (index === EducationHelper.Config.state.matchedCourses.length - 1) {
                                courseItem.style.borderBottom = 'none';
                            }

                            matchedCoursesDiv.appendChild(courseItem);
                        });
                    }
                }
            },
            
            // 抢课过程控制
            control: {
                // 启动抢课
                start: function() {
                    if (EducationHelper.Config.state.targetCourses.length === 0) {
                        EducationHelper.UI.showMessage('请先添加课程', 'error');
                        return false;
                    }
                    
                    // 设置按钮状态
                    document.getElementById('startScript').disabled = true;
                    document.getElementById('stopScript').disabled = false;
                    
                    // 启动定时器
                    EducationHelper.Config.state.timer = setInterval(this.checkAndSelectCourses.bind(this), 1000);
                    EducationHelper.Logger.action('抢课脚本已启动');
                    return true;
                },
                
                // 停止抢课
                stop: function() {
                    if (EducationHelper.Config.state.timer) {
                        clearInterval(EducationHelper.Config.state.timer);
                        EducationHelper.Config.state.timer = null;
                        
                        // 设置按钮状态
                        document.getElementById('startScript').disabled = false;
                        document.getElementById('stopScript').disabled = true;
                        
                        EducationHelper.Logger.action('抢课脚本已停止');
                        return true;
                    }
                    return false;
                },
                
                // 检查并选择课程
                checkAndSelectCourses: function() {
                    EducationHelper.Logger.action('开始检查课程...');
                    
                    const iframeDoc = document.querySelector('#ifra')?.contentDocument;
                    if (!iframeDoc) {
                        EducationHelper.Logger.error('无法获取 iframe 文档');
                        return;
                    }
                    
                    if (EducationHelper.Config.state.targetCourses.length === 0) {
                        EducationHelper.Logger.action('所有课程已处理，尝试提交...');
                        this.clickSubmitButton();
                        this.stop();
                        return;
                    }
                    
                    const courseCode = EducationHelper.Config.state.targetCourses[0];
                    const rows = iframeDoc.querySelectorAll('tr');
                    EducationHelper.Logger.debug(`正在匹配课程代码: ${courseCode}，总共找到 ${rows.length} 行课程数据`);
                    
                    let matched = false;
                    
                    rows.forEach((row) => {
                        const courseCells = row.querySelectorAll('td[rowspan]');
                        courseCells.forEach((courseCell) => {
                            const cellText = courseCell.textContent.trim();
                            const cellNumber = cellText.match(/\d+/g)?.join('') || '';
                            EducationHelper.Logger.debug(`检查单元格内容: ${cellText}, 提取的数字: ${cellNumber}`);
                            
                            if (cellNumber === courseCode) {
                                matched = true;
                                EducationHelper.Logger.success(`匹配成功 - 课程代码: ${courseCode}, 单元格内容: ${cellText}`);
                                
                                const checkbox = row.querySelector(`input[type="checkbox"]`);
                                if (checkbox && !checkbox.checked) {
                                    checkbox.click();
                                    EducationHelper.Logger.success(`已勾选课程: ${courseCode}`);
                                }
                            }
                        });
                    });
                    
                    if (matched) {
                        EducationHelper.Logger.action(`已处理课程: ${courseCode}`);
                        EducationHelper.CourseGrabber.matchedCourses.add(courseCode);
                        EducationHelper.Config.state.targetCourses.shift();
                    } else {
                        EducationHelper.Logger.warn(`未匹配到课程代码: ${courseCode}`);
                    }
                },
                
                // 点击提交按钮
                clickSubmitButton: function() {
                    const button = document.querySelector('#submitButton');
                    if (button) {
                        EducationHelper.Logger.action('找到提交按钮，正在尝试提交...');
                        const event = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        button.dispatchEvent(event);
                        EducationHelper.Logger.success('已提交选课请求');
                        return true;
                    } else {
                        EducationHelper.Logger.warn('未找到提交按钮，请检查页面结构');
                        return false;
                    }
                }
            },
            
            // UI内容生成 - iOS风格
            generateUI: function() {
                return `
                    <div class="ui-tabs">
                        <div class="ui-tab active" data-tab="courseTab">🎯 抢课功能</div>
                    </div>
                    <div class="ui-tab-content active" id="courseTab">
                        <label class="ui-label">📝 课程代码</label>
                        <textarea id="courseCode" class="ui-input" style="
                            height: 80px;
                            resize: vertical;
                            font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                        " placeholder="请输入课程代码，每行一个&#10;例如：&#10;123456&#10;789012"></textarea>

                        <button class="ui-button" id="addCourses" style="
                            background: linear-gradient(135deg, #34C759, #30A14E);
                            box-shadow: 0 2px 8px rgba(52, 199, 89, 0.25);
                        ">
                            ➕ 添加课程
                        </button>

                        <div class="ui-panel">
                            <div class="ui-panel-title">📋 课程列表</div>
                            <div id="courseList">
                                <div style="
                                    text-align: center;
                                    color: #8E8E93;
                                    padding: 20px 0;
                                    font-size: 15px;
                                ">
                                    暂无课程，请先添加课程代码
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                            <button class="ui-button" id="startScript" style="
                                flex: 1;
                                background: linear-gradient(135deg, #FF9500, #FF6B00);
                                box-shadow: 0 2px 8px rgba(255, 149, 0, 0.25);
                            ">
                                🚀 启动抢课
                            </button>
                            <button class="ui-button" id="stopScript" disabled style="
                                flex: 1;
                                background: #E5E5EA;
                                color: #8E8E93;
                                box-shadow: none;
                            ">
                                ⏹️ 停止抢课
                            </button>
                        </div>

                        <div class="ui-panel">
                            <div class="ui-panel-title">✅ 匹配成功的课程</div>
                            <div id="matchedCourses">
                                <div style="
                                    text-align: center;
                                    color: #8E8E93;
                                    padding: 20px 0;
                                    font-size: 15px;
                                ">
                                    暂无匹配成功的课程
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },
            
            // 注册事件监听
            bindEvents: function() {
                document.getElementById('addCourses').addEventListener('click', () => {
                    const courseCodesInput = document.getElementById('courseCode').value.trim();
                    if (this.courseList.add(courseCodesInput)) {
                        document.getElementById('courseCode').value = '';
                    }
                });
                
                document.getElementById('startScript').addEventListener('click', () => {
                    this.control.start();
                });
                
                document.getElementById('stopScript').addEventListener('click', () => {
                    this.control.stop();
                });
            },
            
            // 初始化抢课模块
            init: function() {
                // 只在课程选择页面初始化
                if (!EducationHelper.Config.pageType.isCoursePage) return;
                
                EducationHelper.Logger.action('初始化抢课模块...');
                // 其他初始化操作
                return this;
            }
        },
        
        // 评估模块 - 处理单个评估页面
        Evaluator: {
            // 选项选择功能
            optionSelector: {
                // 根据所选字母选择选项
                selectByLetter: function(letter) {
                    EducationHelper.Logger.action(`正在选择${letter}选项...`);
                    
                    // 更新配置中的选择
                    EducationHelper.Config.state.selectedOption = letter;
                    
                    try {
                        // 使用jQuery选择选项
                        $(".ace").each(function() {
                            var self = $(this);
                            var text = $(this).next().next().html();
                            if (text && text.indexOf(`(${letter})`) !== -1) {
                                self.click();
                            }
                        });
                        
                        EducationHelper.Logger.success(`已全选${letter}选项`);
                        return true;
                    } catch (error) {
                        EducationHelper.Logger.error(`选择${letter}选项时出错`, error);
                        return false;
                    }
                }
            },
            
            // 评价内容填写
            contentFiller: {
                // 填写评价内容
                fillContent: function(content) {
                    content = content || EducationHelper.Config.content.evaluationComment;
                    EducationHelper.Logger.action('正在填写评价内容...');
                    
                    try {
                        // 尝试多种选择器找到文本区域
                        let filled = false;
                        
                        // 1. 通过name属性查找
                        const mainTextarea = document.querySelector('textarea[name="zgpj"]');
                        if (mainTextarea) {
                            mainTextarea.value = content;
                            // 触发change事件
                            const event = new Event('input', { bubbles: true });
                            mainTextarea.dispatchEvent(event);
                            EducationHelper.Logger.success("已通过name='zgpj'找到并填写主观评价文本框");
                            filled = true;
                        } 
                        
                        // 2. 查找所有文本区域
                        if (!filled) {
                            const textareas = document.querySelectorAll('textarea.form-control');
                            if (textareas.length > 0) {
                                for (const textarea of textareas) {
                                    textarea.value = content;
                                    const event = new Event('input', { bubbles: true });
                                    textarea.dispatchEvent(event);
                                }
                                EducationHelper.Logger.success("已填写所有文本框");
                                filled = true;
                            }
                        }
                        
                        // 3. 使用jQuery选择器
                        if (!filled) {
                            const jqTextarea = $("#page-content-template > div > div > div.widget-content > form > div > table > tbody > tr:nth-child(25) > td > div > textarea");
                            if (jqTextarea.length > 0) {
                                jqTextarea.val(content);
                                EducationHelper.Logger.success("已使用jQuery选择器填写评价内容");
                                filled = true;
                            }
                        }
                        
                        // 4. 最后尝试任何文本区域
                        if (!filled) {
                            const allTextareas = document.querySelectorAll('textarea');
                            if (allTextareas.length > 0) {
                                for (const textarea of allTextareas) {
                                    textarea.value = content;
                                    const event = new Event('input', { bubbles: true });
                                    textarea.dispatchEvent(event);
                                }
                                EducationHelper.Logger.success("已填写所有找到的文本区域");
                                filled = true;
                            }
                        }
                        
                        return filled;
                    } catch (error) {
                        EducationHelper.Logger.error("填写评价内容时出错", error);
                        return false;
                    }
                }
            },
            
            // 评价提交处理
            submitter: {
                // 倒计时组件
                countdown: {
                    timer: null,
                    seconds: 0,
                    
                    // 开始倒计时
                    start: function(duration, onComplete) {
                        // 停止现有倒计时
                        this.stop();
                        
                        // 设置初始秒数
                        this.seconds = duration || EducationHelper.Config.timers.autoSubmitDelay / 1000;
                        
                        // 确保倒计时显示元素存在且可见
                        this.ensureDisplayExists();
                        
                        // 更新显示
                        this.updateDisplay();
                        
                        // 开始倒计时
                        this.timer = setInterval(() => {
                            this.seconds--;
                            this.updateDisplay();
                            
                            if (this.seconds <= 0) {
                                this.stop();
                                if (typeof onComplete === 'function') {
                                    onComplete();
                                }
                            }
                        }, 1000);
                        
                        return this;
                    },
                    
                    // 停止倒计时
                    stop: function() {
                        if (this.timer) {
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                        return this;
                    },
                    
                    // 确保倒计时显示元素存在
                    ensureDisplayExists: function() {
                        // 检查是否已存在倒计时显示
                        let timerDisplay = document.getElementById('timerDisplay');
                        
                        // 如果不存在，创建一个新的
                        if (!timerDisplay) {
                            EducationHelper.Logger.action('创建倒计时显示元素');
                            timerDisplay = document.createElement('div');
                            timerDisplay.id = 'timerDisplay';
                            timerDisplay.className = 'timer-display';
                            
                            // 添加到UI容器中
                            const uiContent = document.getElementById('uiContent');
                            if (uiContent) {
                                // 添加到UI内容区的合适位置
                                const buttons = uiContent.querySelector('div[style*="display: flex"]');
                                if (buttons) {
                                    uiContent.insertBefore(timerDisplay, buttons);
                                } else {
                                    // 如果找不到按钮区域，添加到内容区最后
                                    uiContent.appendChild(timerDisplay);
                                }
                            } else {
                                // 如果找不到UI容器，添加到body
                                document.body.appendChild(timerDisplay);
                            }
                        }
                        
                        // 确保样式正确
                        timerDisplay.style.display = 'block';
                        timerDisplay.style.backgroundColor = '#e3f2fd';
                        timerDisplay.style.border = '1px solid #1976d2';
                        timerDisplay.style.padding = '10px';
                        timerDisplay.style.borderRadius = '4px';
                        timerDisplay.style.marginBottom = '10px';
                        timerDisplay.style.fontWeight = 'bold';
                        timerDisplay.style.fontSize = '16px';
                        timerDisplay.style.textAlign = 'center';
                        timerDisplay.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                        
                        // 设置初始内容
                        if (!timerDisplay.innerHTML || !timerDisplay.innerHTML.includes('timerValue')) {
                            timerDisplay.innerHTML = '等待提交: <span id="timerValue">120</span> 秒';
                        }
                        
                        // 如果是自动模式，使用不同的样式
                        if (EducationHelper.Config.state.autoMode) {
                            timerDisplay.style.backgroundColor = '#e8f5e9';
                            timerDisplay.style.border = '1px solid #4caf50';
                            timerDisplay.innerHTML = '<span style="color:#2e7d32; font-size:18px;">⏱️ 自动提交倒计时: <span id="timerValue">120</span> 秒</span>';
                        }
                        
                        return timerDisplay;
                    },
                    
                    // 更新倒计时显示
                    updateDisplay: function() {
                        const timerElement = document.getElementById('timerValue');
                        if (timerElement) {
                            timerElement.textContent = this.seconds;
                        }
                        return this;
                    }
                },
                
                // 查找并点击提交按钮
                findAndClickSubmitButton: function(showMessage = true) {
                    EducationHelper.Logger.action('查找提交按钮...');
                    
                    // 显示状态消息
                    let statusMsg = null;
                    if (showMessage) {
                        statusMsg = EducationHelper.UI.showMessage('<div>正在提交评价...</div>', 'info', 0);  // 0表示不自动消失
                    }
                    
                    setTimeout(() => {
                        // 收集所有可能的按钮，生成一个优先级列表
                        const possibleButtons = [];
                        
                        // 查找带有"提交"文本的所有按钮
                        const allButtons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
                        EducationHelper.Logger.debug(`找到 ${allButtons.length} 个按钮元素`);
                        
                        allButtons.forEach(btn => {
                            const btnText = btn.textContent || btn.value || '';
                            EducationHelper.Logger.debug(`检查按钮: "${btnText}", HTML: ${btn.outerHTML}`);
                            
                            // 按钮匹配度评分
                            let score = 0;
                            
                            // 文本包含"提交"
                            if (btnText.includes('提交')) {
                                score += 10;
                            }
                            
                            // 底部按钮优先
                            const rect = btn.getBoundingClientRect();
                            if (rect.top > window.innerHeight / 2) {
                                score += 5;
                            }
                            
                            // 样式匹配度
                            if (btn.className.includes('btn-danger') || 
                                btn.className.includes('btn-primary') || 
                                btn.className.includes('layui-btn')) {
                                score += 3;
                            }
                            
                            // 有红色或蓝色背景
                            const style = window.getComputedStyle(btn);
                            const bgColor = style.backgroundColor;
                            if (bgColor.includes('rgb(') && 
                                (bgColor.includes('255') || bgColor.includes('0, 0, 255'))) {
                                score += 2;
                            }
                            
                            // 如果得分大于0，添加到可能按钮列表
                            if (score > 0) {
                                possibleButtons.push({button: btn, score: score});
                            }
                        });
                        
                        // 按得分排序
                        possibleButtons.sort((a, b) => b.score - a.score);
                        
                        // 选择得分最高的按钮
                        let submitButton = null;
                        if (possibleButtons.length > 0) {
                            submitButton = possibleButtons[0].button;
                            EducationHelper.Logger.success(`找到提交按钮, 得分: ${possibleButtons[0].score}`);
                        }
                        
                        // 如果没找到按钮，尝试其他方法
                        if (!submitButton) {
                            // 尝试特定ID或名称
                            submitButton = document.querySelector('#submit, #btnSubmit, .submit-btn, [name="submit"]');
                            
                            if (!submitButton) {
                                // 尝试表单提交按钮
                                const forms = document.querySelectorAll('form');
                                forms.forEach(form => {
                                    const submitBtn = form.querySelector('[type="submit"]');
                                    if (submitBtn) {
                                        submitButton = submitBtn;
                                    }
                                });
                            }
                        }
                        
                        // 点击提交按钮
                        if (submitButton) {
                            // 更新状态提示
                            if (statusMsg) {
                                statusMsg.innerHTML = '<div>找到提交按钮，正在点击...</div>';
                            }
                            
                            EducationHelper.Logger.action("找到提交按钮，点击提交");
                            
                            // 确保按钮可见
                            submitButton.scrollIntoView({behavior: 'smooth', block: 'center'});
                            
                            // 加上小延迟，确保滚动完成后再点击
                            setTimeout(() => {
                                // 点击按钮
                                submitButton.click();
                                
                                // 处理确认对话框
                                this.handleConfirmDialog(statusMsg);
                            }, 500);
                            
                            return true;
                        } else {
                            EducationHelper.Logger.warn("未找到提交按钮");
                            
                            if (statusMsg) {
                                statusMsg.innerHTML = '<div style="color:#ff9800">未找到提交按钮，尝试其他方法...</div>';
                            }
                            
                            // 尝试直接提交表单
                            const mainForm = document.querySelector('form');
                            if (mainForm) {
                                EducationHelper.Logger.action("尝试直接提交表单");
                                
                                try {
                                    mainForm.submit();
                                    EducationHelper.Logger.success("已调用表单的submit()方法");
                                    
                                    if (statusMsg) {
                                        statusMsg.innerHTML = '<div style="color:#4caf50">已尝试提交表单，请检查是否成功</div>';
                                        
                                        // 2秒后移除状态提示
                                        setTimeout(() => {
                                            if (statusMsg && document.contains(statusMsg)) {
                                                statusMsg.remove();
                                            }
                                        }, 2000);
                                    }
                                    
                                    return true;
                                } catch (e) {
                                    EducationHelper.Logger.error("尝试提交表单失败", e);
                                    
                                    if (statusMsg) {
                                        statusMsg.innerHTML = '<div style="color:red">自动提交失败，请手动点击页面中的"提交"按钮</div>';
                                        
                                        // 5秒后移除提示
                                        setTimeout(() => {
                                            if (statusMsg && document.contains(statusMsg)) {
                                                statusMsg.remove();
                                            }
                                        }, 5000);
                                    }
                                    
                                    return false;
                                }
                            } else {
                                // 提示用户手动提交
                                if (statusMsg) {
                                    statusMsg.innerHTML = '<div style="color:red">未找到提交按钮，请手动点击页面中的"提交"按钮</div>';
                                    
                                    // 5秒后移除提示
                                    setTimeout(() => {
                                        if (statusMsg && document.contains(statusMsg)) {
                                            statusMsg.remove();
                                        }
                                    }, 5000);
                                }
                                
                                return false;
                            }
                        }
                    }, 500);
                },
                
                // 处理确认对话框
                handleConfirmDialog: function(statusMsg) {
                    EducationHelper.Logger.action("等待确认对话框...");
                    
                    // 等待确认对话框出现
                    setTimeout(() => {
                        // 尝试查找确认按钮
                        let confirmButton = document.querySelector('.layui-layer-btn0, .layui-btn, [type="submit"]');
                        
                        if (!confirmButton) {
                            // 更通用地查找确认按钮
                            const modalButtons = document.querySelectorAll('.modal-footer .btn, .layui-layer-btn .layui-layer-btn0, .dialog-footer .btn');
                            if (modalButtons.length > 0) {
                                confirmButton = modalButtons[0];
                            } else {
                                const buttons = document.querySelectorAll('button, a.btn, input[type="button"]');
                                for (const btn of buttons) {
                                    const btnText = btn.textContent || btn.value || '';
                                    if (btnText.includes('确定') || btnText.includes('确认') || btnText.includes('是')) {
                                        confirmButton = btn;
                                        break;
                                    }
                                }
                            }
                        }
                        
                        if (confirmButton) {
                            EducationHelper.Logger.action("找到确认按钮，确认提交");
                            
                            // 更新状态提示
                            if (statusMsg) {
                                statusMsg.innerHTML = '<div>找到确认按钮，正在确认提交...</div>';
                            }
                            
                            // 点击确认按钮
                            confirmButton.click();
                            
                            // 显示成功消息
                            if (statusMsg) {
                                statusMsg.innerHTML = '<div style="color:#4caf50">评价提交成功！</div>';
                                
                                // 2秒后隐藏提示
                                setTimeout(() => {
                                    if (statusMsg && document.contains(statusMsg)) {
                                        statusMsg.remove();
                                    }
                                }, 2000);
                            }
                            
                            EducationHelper.Logger.success("已完成评价提交");
                            
                            // 全屏成功提示
                            EducationHelper.UI.showMessage(`
                                <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                                <div style="font-weight: bold; margin-bottom: 10px;">评价提交成功！</div>
                            `, 'success', 2000);
                            
                            // 如果处于自动模式，尝试自动返回列表页以继续评价
                            if (EducationHelper.Config.state.autoMode) {
                                // 查找返回按钮或列表链接
                                setTimeout(() => {
                                    const backBtn = document.querySelector('a:contains("返回"), a:contains("列表"), a[href*="index"]');
                                    if (backBtn) {
                                        EducationHelper.Logger.action("找到返回按钮，自动返回列表页");
                                        backBtn.click();
                                    }
                                }, 2000);
                            }
                            
                            return true;
                        } else {
                            EducationHelper.Logger.action("未找到确认按钮，可能评价已直接提交或需要手动确认");
                            
                            // 提示用户可能需要手动确认
                            if (statusMsg) {
                                statusMsg.innerHTML = '<div style="color:#ff9800">可能需要手动确认提交，请检查是否有弹出确认窗口</div>';
                                
                                // 5秒后移除提示
                                setTimeout(() => {
                                    if (statusMsg && document.contains(statusMsg)) {
                                        statusMsg.remove();
                                    }
                                }, 5000);
                            }
                            
                            return false;
                        }
                    }, 1000);
                }
            },
            
            // 流程控制
            process: {
                // 启动自动评价流程
                start: function() {
                    EducationHelper.Logger.action('开始评价流程...');
                    
                    // 显示状态消息
                    EducationHelper.UI.showMessage(
                        '<div>正在进行评价操作...</div>',
                        'info',
                        2000
                    );
                    
                    // 1. 选择选项
                    EducationHelper.Evaluator.optionSelector.selectByLetter(
                        EducationHelper.Config.state.selectedOption
                    );
                    
                    // 2. 填写评价内容
                    setTimeout(() => {
                        EducationHelper.Evaluator.contentFiller.fillContent(
                            document.getElementById('evaluationContent')?.value || 
                            EducationHelper.Config.content.evaluationComment
                        );
                        
                        // 禁用开始按钮，防止重复点击
                        const startButton = document.getElementById('startEvaluation');
                        if (startButton) {
                            startButton.disabled = true;
                            startButton.style.opacity = '0.6';
                            startButton.textContent = '评价已开始';
                        }
                        
                        // 3. 如果自动提交已启用，启动倒计时
                        if (EducationHelper.Config.state.autoSubmitEnabled) {
                            EducationHelper.Logger.action('已启用自动提交，开始倒计时...');
                            
                            // 启动倒计时
                            EducationHelper.Evaluator.submitter.countdown.start(
                                EducationHelper.Config.timers.autoSubmitDelay / 1000,
                                // 倒计时结束回调
                                () => {
                                    if (EducationHelper.Config.state.autoSubmitEnabled) {
                                        EducationHelper.Logger.action('倒计时结束，自动提交评价');
                                        // 提示用户即将提交
                                        EducationHelper.UI.showMessage(
                                            `<div style="font-size: 24px; margin-bottom: 10px;">⏱️ 倒计时结束</div>
                                             <div style="font-weight: bold; margin-bottom: 15px;">正在自动提交评价...</div>`,
                                            'info',
                                            2000
                                        );
                                        
                                        // 提交评价
                                        setTimeout(() => {
                                            EducationHelper.Evaluator.process.submit();
                                        }, 2000);
                                    }
                                }
                            );
                        }
                    }, 500);
                },
                
                // 提交评价
                submit: function() {
                    EducationHelper.Logger.action('提交评价...');
                    
                    // 保存评价内容到配置
                    const contentElement = document.getElementById('evaluationContent');
                    if (contentElement) {
                        EducationHelper.Config.content.evaluationComment = contentElement.value;
                        // 保存到localStorage
                        EducationHelper.Config.saveSettings();
                    }
                    
                    // 再次确认文本框已填写
                    EducationHelper.Evaluator.contentFiller.fillContent();
                    
                    // 查找并点击提交按钮
                    EducationHelper.Evaluator.submitter.findAndClickSubmitButton();
                }
            },
            
            // UI生成 - iOS风格
            generateUI: function() {
                return `
                    <div class="ui-tabs">
                        <div class="ui-tab active" data-tab="evaluationTab">📊 教学评估</div>
                    </div>
                    <div class="ui-tab-content active" id="evaluationTab">
                        <div class="ui-panel" style="max-height: none; margin-bottom: 20px;">
                            <div class="ui-panel-title">⚙️ 选项设置</div>
                            <div class="option-container">
                                <div class="option-row">
                                    <label class="radio-label">
                                        <input type="radio" name="evaluationOption" value="A" ${EducationHelper.Config.state.selectedOption === 'A' ? 'checked' : ''}>
                                        <span>🅰️ 全选A选项（优秀）</span>
                                    </label>
                                </div>
                                <div class="option-row">
                                    <label class="radio-label">
                                        <input type="radio" name="evaluationOption" value="B" ${EducationHelper.Config.state.selectedOption === 'B' ? 'checked' : ''}>
                                        <span>🅱️ 全选B选项（良好）</span>
                                    </label>
                                </div>
                                <div class="option-row">
                                    <label class="radio-label">
                                        <input type="radio" name="evaluationOption" value="C" ${EducationHelper.Config.state.selectedOption === 'C' ? 'checked' : ''}>
                                        <span>🅲 全选C选项（一般）</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <label class="ui-label">💬 评价内容</label>
                        <textarea id="evaluationContent" class="ui-input" style="
                            height: 100px;
                            resize: vertical;
                            line-height: 1.5;
                        " placeholder="请输入对老师的评价内容...">${EducationHelper.Config.content.evaluationComment}</textarea>

                        <div class="ui-checkbox-container">
                            <input type="checkbox" id="autoSubmitEvaluation" class="ui-checkbox" ${EducationHelper.Config.state.autoSubmitEnabled ? 'checked' : ''}>
                            <label for="autoSubmitEvaluation" class="ui-label" style="display: inline; margin: 0; font-size: 15px;">
                                ⏰ 自动提交评价（2分钟后）
                            </label>
                        </div>

                        <div class="timer-display" id="timerDisplay">
                            ⏱️ 等待提交: <span id="timerValue">120</span> 秒
                        </div>

                        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                            <button class="ui-button" id="selectOptions" style="
                                flex: 1;
                                background: linear-gradient(135deg, #5856D6, #4B49C7);
                                box-shadow: 0 2px 8px rgba(88, 86, 214, 0.25);
                            ">
                                ✅ 选择选项
                            </button>
                            <button class="ui-button" id="submitEvaluation" style="
                                flex: 1;
                                background: linear-gradient(135deg, #FF9500, #FF6B00);
                                box-shadow: 0 2px 8px rgba(255, 149, 0, 0.25);
                            ">
                                🚀 立即提交
                            </button>
                        </div>

                        <button class="ui-button" id="startEvaluation" style="
                            background: linear-gradient(135deg, #34C759, #30A14E);
                            box-shadow: 0 2px 8px rgba(52, 199, 89, 0.25);
                            font-size: 17px;
                            padding: 14px 16px;
                        ">
                            🎯 开始评价流程
                        </button>
                    </div>
                `;
            },
            
            // 事件绑定
            bindEvents: function() {
                // 选项单选按钮
                const optionRadios = document.getElementsByName('evaluationOption');
                optionRadios.forEach(radio => {
                    radio.addEventListener('change', function() {
                        EducationHelper.Config.state.selectedOption = this.value;
                        EducationHelper.Logger.action(`已选择${this.value}选项`);
                        // 保存选择到localStorage
                        EducationHelper.Config.saveSettings();
                    });
                });
                
                // 自动提交复选框
                document.getElementById('autoSubmitEvaluation').addEventListener('change', function() {
                    EducationHelper.Config.state.autoSubmitEnabled = this.checked;
                    EducationHelper.Logger.action(`自动提交评价: ${this.checked ? '已启用' : '已禁用'}`);
                });
                
                // 评价内容输入框
                document.getElementById('evaluationContent').addEventListener('input', function() {
                    EducationHelper.Config.content.evaluationComment = this.value;
                });
                
                // 选择选项按钮
                document.getElementById('selectOptions').addEventListener('click', () => {
                    EducationHelper.Evaluator.optionSelector.selectByLetter(
                        EducationHelper.Config.state.selectedOption
                    );
                    
                    // 如果启用了自动提交，则应用选项后自动提交
                    if (EducationHelper.Config.state.autoSubmitEnabled) {
                        EducationHelper.Logger.action('已启用自动提交，将在3秒后提交评价...');
                        setTimeout(() => {
                            EducationHelper.Evaluator.process.submit();
                        }, 3000);
                    }
                });
                
                // 立即提交评价按钮
                document.getElementById('submitEvaluation').addEventListener('click', () => {
                    EducationHelper.Evaluator.process.submit();
                });
                
                // 开始评价按钮
                document.getElementById('startEvaluation').addEventListener('click', () => {
                    EducationHelper.Evaluator.process.start();
                });
            },
            
            // 初始化
            init: function() {
                if (!EducationHelper.Config.pageType.isEvaluationPage) return;

                EducationHelper.Logger.action('初始化评估模块...');

                // 检查localStorage中是否存在autoMode标记
                if (EducationHelper.Config.state.autoMode) {
                    EducationHelper.Logger.action('检测到全自动模式，自动开始评价流程');

                    // 延迟执行，确保页面已完全加载
                    setTimeout(() => {
                        // 自动执行评价流程
                        this.process.start();
                    }, 1000);
                }

                return this;
            }
        },
        
        // 评估列表模块 - 处理评估列表页面
        EvaluationList: {
            // 进度统计
            progress: {
                total: 0,
                completed: 0,

                // 统计评价进度
                updateProgress: function() {
                    try {
                        // 查找所有评估按钮
                        const evaluationButtons = document.querySelectorAll('button, a');

                        let totalCount = 0;
                        let completedCount = 0;

                        // 统计包含"评估"的按钮
                        evaluationButtons.forEach(btn => {
                            const text = btn.textContent || btn.innerText || '';
                            if (text.includes('评估') || text.includes('评价')) {
                                totalCount++;

                                // 检查是否已完成（按钮被禁用或包含完成标记）
                                if (btn.disabled ||
                                    text.includes('已评') ||
                                    text.includes('完成') ||
                                    btn.classList.contains('disabled') ||
                                    btn.style.display === 'none') {
                                    completedCount++;
                                }
                            }
                        });

                        // 如果通过按钮统计不准确，尝试其他方法
                        if (totalCount === 0) {
                            // 查找表格行或列表项
                            const rows = document.querySelectorAll('tr, .list-item, .evaluation-item');
                            rows.forEach(row => {
                                const text = row.textContent || row.innerText || '';
                                if (text.includes('评估') || text.includes('评价') || text.includes('教师')) {
                                    totalCount++;
                                    if (text.includes('已评') || text.includes('完成') || text.includes('已完成')) {
                                        completedCount++;
                                    }
                                }
                            });
                        }

                        this.total = totalCount;
                        this.completed = completedCount;

                        EducationHelper.Logger.debug(`进度统计: ${completedCount}/${totalCount}`);

                        // 更新UI显示
                        this.updateUI();

                        return { total: totalCount, completed: completedCount };
                    } catch (error) {
                        EducationHelper.Logger.error('统计评价进度时出错', error);
                        return { total: 0, completed: 0 };
                    }
                },

                // 更新进度显示UI
                updateUI: function() {
                    const progressDiv = document.getElementById('evaluationProgress');
                    if (!progressDiv) return;

                    const percentage = this.total > 0 ? Math.round((this.completed / this.total) * 100) : 0;
                    const isCompleted = this.completed === this.total && this.total > 0;

                    progressDiv.innerHTML = `
                        <div style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-bottom: 12px;
                        ">
                            <div style="
                                font-weight: 600;
                                color: #1C1C1E;
                                font-size: 16px;
                            ">📊 评价进度</div>
                            <div style="
                                font-weight: 700;
                                color: ${isCompleted ? '#34C759' : '#007AFF'};
                                font-size: 16px;
                            ">${this.completed}/${this.total}</div>
                        </div>

                        <div style="
                            background: #E5E5EA;
                            border-radius: 8px;
                            height: 8px;
                            overflow: hidden;
                            margin-bottom: 12px;
                        ">
                            <div style="
                                background: ${isCompleted ? 'linear-gradient(135deg, #34C759, #30A14E)' : 'linear-gradient(135deg, #007AFF, #0051D5)'};
                                height: 100%;
                                width: ${percentage}%;
                                border-radius: 8px;
                                transition: width 0.3s ease;
                            "></div>
                        </div>

                        <div style="
                            text-align: center;
                            font-size: 14px;
                            color: #8E8E93;
                        ">
                            ${isCompleted ?
                                '🎉 所有评价已完成！' :
                                `完成度: ${percentage}% ${this.total > 0 ? `(还剩 ${this.total - this.completed} 个)` : ''}`
                            }
                        </div>
                    `;
                }
            },
            // 自动点击功能
            autoClicker: {
                // 开始自动点击倒计时
                startCountdown: function() {
                    EducationHelper.Logger.action(`开始自动点击倒计时，${EducationHelper.Config.timers.autoClickEvaluationDelay/1000}秒后开始执行...`);
                    
                    // 设置初始倒计时值
                    const countdownElement = document.getElementById('countdownValue');
                    if (!countdownElement) return false;
                    
                    let secondsLeft = EducationHelper.Config.timers.autoClickEvaluationDelay / 1000;
                    countdownElement.textContent = secondsLeft;
                    
                    // 清除之前的计时器
                    if (window.autoClickCountdownTimer) {
                        clearInterval(window.autoClickCountdownTimer);
                    }
                    
                    // 创建全局标记来表示停止状态
                    window.autoClickStopped = false;
                    
                    // 创建新的倒计时
                    window.autoClickCountdownTimer = setInterval(() => {
                        // 每次检查是否已停止
                        if (window.autoClickStopped) {
                            clearInterval(window.autoClickCountdownTimer);
                            window.autoClickCountdownTimer = null;
                            EducationHelper.Logger.action('倒计时已被手动停止');
                            return;
                        }
                        
                        secondsLeft -= 1;
                        countdownElement.textContent = secondsLeft;
                        
                        // 倒计时结束，执行自动点击
                        if (secondsLeft <= 0) {
                            clearInterval(window.autoClickCountdownTimer);
                            window.autoClickCountdownTimer = null;
                            
                            // 再次检查是否仍然启用了自动点击和未被停止
                            if ((EducationHelper.Config.state.autoClickEvaluationEnabled || EducationHelper.Config.state.autoMode) && !window.autoClickStopped) {
                                EducationHelper.Logger.action('倒计时结束，开始扫描评估按钮...');
                                
                                // 更新倒计时文本
                                const countdownDiv = document.getElementById('countdownDiv');
                                if (countdownDiv) {
                                    countdownDiv.innerHTML = '<span style="color:#4caf50;">自动操作开始执行...</span>';
                                }
                                
                                // 延迟执行扫描，让用户有机会看到状态更新
                                setTimeout(() => {
                                    // 再次检查，确保在延迟期间没有被停止
                                    if (!window.autoClickStopped) {
                                        // 扫描并点击评估按钮
                                        EducationHelper.EvaluationList.scanner.scanAndClick();

                                        // 扫描完成后隐藏倒计时区域
                                        setTimeout(() => {
                                            if (countdownDiv) {
                                                countdownDiv.style.display = 'none';
                                            }

                                            // 自动模式下不关闭开关，保持自动状态
                                            if (!EducationHelper.Config.state.autoMode) {
                                                EducationHelper.Config.state.autoClickEvaluationEnabled = false;
                                                const checkbox = document.getElementById('autoClickEvaluation');
                                                if (checkbox) checkbox.checked = false;
                                            }
                                        }, 2000);
                                    } else {
                                        EducationHelper.Logger.action('在延迟期间检测到停止请求，取消自动操作');
                                        if (countdownDiv) {
                                            countdownDiv.style.display = 'none';
                                        }
                                    }
                                }, 500);
                            } else {
                                EducationHelper.Logger.action('倒计时结束，但自动点击已被禁用');
                                const countdownDiv = document.getElementById('countdownDiv');
                                if (countdownDiv) {
                                    countdownDiv.style.display = 'none';
                                }
                            }
                        }
                    }, 1000);
                    
                    return true;
                }
            },
            
            // 扫描与点击
            scanner: {
                // 扫描评估按钮并点击（仅自动模式）
                scanAndClick: function() {
                    EducationHelper.Logger.action('自动扫描评估按钮开始...');

                    // 更新进度统计
                    EducationHelper.EvaluationList.progress.updateProgress();

                    // 获取所有按钮
                    const buttons = document.querySelectorAll('button');

                    // 找到包含"评估"的按钮
                    let evaluationButtons = [];
                    buttons.forEach(button => {
                        if ((button.innerText && button.innerText.includes('评估')) ||
                            (button.textContent && button.textContent.includes('评估'))) {

                            evaluationButtons.push(button);
                            EducationHelper.Logger.debug(`评估按钮: ${button.outerHTML}`);
                        }
                    });

                    // 如果找不到评估按钮，尝试链接
                    if (evaluationButtons.length === 0) {
                        const links = document.querySelectorAll('a');
                        links.forEach(link => {
                            if ((link.innerText && link.innerText.includes('评估')) ||
                                (link.textContent && link.textContent.includes('评估'))) {

                                evaluationButtons.push(link);
                                EducationHelper.Logger.debug(`评估链接: ${link.outerHTML}`);
                            }
                        });
                    }

                    EducationHelper.Logger.action(`找到 ${evaluationButtons.length} 个评估按钮`);

                    // 自动模式处理
                    if (evaluationButtons.length > 0) {
                        // 优先点击带有"评估"文本的按钮
                        const buttonToClick = evaluationButtons[0];

                        // 创建简洁的倒计时提示
                        let countdownSeconds = 3; // 缩短倒计时时间

                        // 显示简洁的状态提示
                        const statusMsg = EducationHelper.UI.showMessage(`
                            <div style="font-size: 18px; margin-bottom: 10px;">🎯 找到评估按钮</div>
                            <div>将在 <span id="clickCountdown" style="font-size: 20px; font-weight: 700;">${countdownSeconds}</span> 秒后点击</div>
                        `, 'info', 0);

                        // 开始倒计时
                        const countdownTimer = setInterval(() => {
                            countdownSeconds--;

                            // 检查是否已手动停止
                            if (window.autoClickStopped) {
                                clearInterval(countdownTimer);
                                if (statusMsg && document.contains(statusMsg)) {
                                    statusMsg.remove();
                                }
                                return;
                            }

                            const countdownElement = document.getElementById('clickCountdown');
                            if (countdownElement) {
                                countdownElement.textContent = countdownSeconds;
                            }

                            if (countdownSeconds <= 0) {
                                clearInterval(countdownTimer);

                                // 更新提示信息
                                if (statusMsg && document.contains(statusMsg)) {
                                    statusMsg.innerHTML = '<div style="font-size: 18px;">🚀 正在点击评估按钮...</div>';
                                }

                                // 点击评估按钮
                                setTimeout(() => {
                                    if (!window.autoClickStopped) {
                                        this.clickButton(buttonToClick);

                                        // 移除状态提示
                                        if (statusMsg && document.contains(statusMsg)) {
                                            statusMsg.remove();
                                        }
                                    }
                                }, 500);
                            }
                        }, 1000);
                    } else {
                        EducationHelper.UI.showMessage('未找到评估按钮', 'warning', 3000);
                    }
                },
                
                // 安全点击按钮
                clickButton: function(button) {
                    EducationHelper.Logger.action(`点击按钮: ${button.outerHTML}`);
                    
                    // 尝试使用默认点击事件
                    try {
                        button.click();
                        EducationHelper.Logger.success('已点击按钮');
                        return true;
                    } catch (error) {
                        EducationHelper.Logger.warn('直接点击失败，尝试使用替代方法:', error);
                    }
                    
                    // 尝试触发合成事件
                    try {
                        // 创建鼠标事件并触发
                        const evt = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        
                        // 分发事件
                        button.dispatchEvent(evt);
                        EducationHelper.Logger.success('已通过事件触发点击按钮');
                        return true;
                    } catch (error) {
                        EducationHelper.Logger.error('无法点击按钮:', error);
                        return false;
                    }
                }
            },
            
            // 自动模式控制
            autoMode: {
                // 启用自动模式
                enable: function() {
                    EducationHelper.Config.state.autoMode = true;
                    EducationHelper.Logger.action('全自动模式已启用');
                    
                    // 将autoMode状态保存到localStorage
                    EducationHelper.Config.saveSettings();
                    
                    // 自动启用评估按钮点击
                    EducationHelper.Config.state.autoClickEvaluationEnabled = true;
                    const checkbox = document.getElementById('autoClickEvaluation');
                    if (checkbox) checkbox.checked = true;
                    
                    // 显示倒计时并开始自动点击
                    const countdownDiv = document.getElementById('countdownDiv');
                    if (countdownDiv) {
                        countdownDiv.style.display = 'block';
                        countdownDiv.innerHTML = `
                            <span style="display: block; margin-bottom: 5px; font-weight: bold; color: #2e7d32;">
                                🚀 全自动模式已启用！
                            </span>
                            <span>自动操作将在 <span id="countdownValue">${EducationHelper.Config.timers.autoClickEvaluationDelay/1000}</span> 秒后开始</span>
                        `;
                    }
                    
                    // 开始倒计时
                    EducationHelper.EvaluationList.autoClicker.startCountdown();
                    
                    // 显示提示消息
                    EducationHelper.UI.showMessage(`
                        <div style="margin-bottom: 10px; font-weight: bold; font-size: 18px;">✅ 全自动模式已启用</div>
                        <div>系统将自动完成整个评价流程：</div>
                        <div style="margin: 10px 0; text-align: left;">
                            1. 自动点击"评估"按钮 ⏳<br>
                            2. 自动选择选项和填写内容 ⏳<br>
                            3. 自动提交评价 ⏳
                        </div>
                    `, 'success', 5000);
                    
                    return true;
                },
                
                // 禁用自动模式
                disable: function() {
                    EducationHelper.Config.state.autoMode = false;
                    EducationHelper.Logger.action('全自动模式已禁用');
                    
                    // 将autoMode状态保存到localStorage
                    EducationHelper.Config.saveSettings();
                    
                    // 立即设置停止标记
                    window.autoClickStopped = true;
                    
                    // 立即停止倒计时
                    if (window.autoClickCountdownTimer) {
                        clearInterval(window.autoClickCountdownTimer);
                        window.autoClickCountdownTimer = null;
                    }
                    
                    // 关闭自动点击评估按钮功能
                    EducationHelper.Config.state.autoClickEvaluationEnabled = false;
                    const checkbox = document.getElementById('autoClickEvaluation');
                    if (checkbox) checkbox.checked = false;
                    
                    // 隐藏倒计时区域
                    const countdownDiv = document.getElementById('countdownDiv');
                    if (countdownDiv) {
                        countdownDiv.style.display = 'none';
                    }
                    
                    // 显示停止提示
                    EducationHelper.UI.showMessage(`
                        <div style="margin-bottom: 10px; font-weight: bold; font-size: 18px;">⛔ 全自动模式已停止</div>
                        <div>自动评价流程已终止，您可以手动操作</div>
                    `, 'error', 3000);
                    
                    return true;
                }
            },
            
            // UI生成 - iOS风格
            generateUI: function() {
                return `
                    <div class="ui-tabs">
                        <div class="ui-tab active" data-tab="evaluationListTab">📋 评估列表</div>
                    </div>
                    <div class="ui-tab-content active" id="evaluationListTab">
                        <div class="ui-checkbox-container" style="margin-bottom: 16px;">
                            <input type="checkbox" id="autoClickEvaluation" class="ui-checkbox" ${EducationHelper.Config.state.autoClickEvaluationEnabled ? 'checked' : ''}>
                            <label for="autoClickEvaluation" class="ui-label" style="display: inline; margin: 0; font-size: 15px;">
                                🎯 自动点击"评估"按钮
                            </label>
                        </div>

                        <div class="ui-panel" style="
                            max-height: none;
                            margin-bottom: 16px;
                            background: linear-gradient(135deg, #FFF8E1, #FFF3C4);
                            border: 1px solid #FFE082;
                        ">
                            <div class="ui-panel-title" style="color: #FF8F00;">⚠️ 注意事项</div>
                            <div style="margin: 8px 0; font-size: 14px; color: #E65100; line-height: 1.5;">
                              • 自动点击功能默认关闭，需手动启用<br>
                              • 全自动模式将完成所有评价流程<br>
                              • 自动操作将在 <strong>${EducationHelper.Config.timers.autoClickEvaluationDelay/1000}秒</strong> 后开始执行<br>
                              • 操作过程中可随时取消
                            </div>
                        </div>

                        <div class="ui-panel" id="evaluationProgress" style="
                            margin-bottom: 20px;
                            background: linear-gradient(135deg, #F8F9FA, #E9ECEF);
                            border: 1px solid #DEE2E6;
                        ">
                            <div style="
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                margin-bottom: 12px;
                            ">
                                <div style="
                                    font-weight: 600;
                                    color: #1C1C1E;
                                    font-size: 16px;
                                ">📊 评价进度</div>
                                <div style="
                                    font-weight: 700;
                                    color: #007AFF;
                                    font-size: 16px;
                                ">0/0</div>
                            </div>

                            <div style="
                                background: #E5E5EA;
                                border-radius: 8px;
                                height: 8px;
                                overflow: hidden;
                                margin-bottom: 12px;
                            ">
                                <div style="
                                    background: linear-gradient(135deg, #007AFF, #0051D5);
                                    height: 100%;
                                    width: 0%;
                                    border-radius: 8px;
                                    transition: width 0.3s ease;
                                "></div>
                            </div>

                            <div style="
                                text-align: center;
                                font-size: 14px;
                                color: #8E8E93;
                            ">
                                正在统计评价进度...
                            </div>
                        </div>

                        <div class="ui-checkbox-container" style="margin-bottom: 20px;">
                            <input type="checkbox" id="debugMode" class="ui-checkbox" ${EducationHelper.Config.state.debugMode ? 'checked' : ''}>
                            <label for="debugMode" class="ui-label" style="display: inline; margin: 0; font-size: 15px;">
                                🔧 调试模式
                            </label>
                        </div>

                        <button class="ui-button" id="autoModeButton" style="
                            background: ${EducationHelper.Config.state.autoMode ? 'linear-gradient(135deg, #FF3B30, #D70015)' : 'linear-gradient(135deg, #34C759, #30A14E)'};
                            box-shadow: 0 2px 8px ${EducationHelper.Config.state.autoMode ? 'rgba(255, 59, 48, 0.25)' : 'rgba(52, 199, 89, 0.25)'};
                            font-size: 17px;
                            padding: 14px 16px;
                        ">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <span style="font-size: 20px;">${EducationHelper.Config.state.autoMode ? '⏹️' : '🚀'}</span>
                                <div style="text-align: left;">
                                    <div style="font-weight: 700;">${EducationHelper.Config.state.autoMode ? '停止全自动模式' : '启用全自动模式'}</div>
                                    ${!EducationHelper.Config.state.autoMode ? '<div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">自动评估 • 选择 • 提交</div>' : ''}
                                </div>
                            </div>
                        </button>

                        <div id="countdownDiv" style="
                            display: ${(EducationHelper.Config.state.autoClickEvaluationEnabled || EducationHelper.Config.state.autoMode) ? 'block' : 'none'};
                            margin: 16px 0;
                            text-align: center;
                            padding: 12px 16px;
                            background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
                            border-radius: 12px;
                            border: 1px solid #2196F3;
                            font-weight: 600;
                            color: #1976D2;
                        ">
                            <div style="font-size: 16px;">⏱️ 自动操作倒计时</div>
                            <div style="font-size: 24px; margin-top: 4px;">
                                <span id="countdownValue">${EducationHelper.Config.timers.autoClickEvaluationDelay/1000}</span> 秒
                            </div>
                        </div>

                        <div id="debugInfo" class="ui-panel" style="
                            max-height: 180px;
                            display: ${EducationHelper.Config.state.debugMode ? 'block' : 'none'};
                            background: #F8F9FA;
                            border: 1px solid #DEE2E6;
                        ">
                            <div class="ui-panel-title" style="color: #6C757D;">🔧 调试信息</div>
                            <div id="debugContent" style="
                                font-size: 13px;
                                color: #6C757D;
                                font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                                line-height: 1.4;
                            ">
                                <div style="padding: 8px 0; color: #28A745;">✅ 调试模式已启用，详细信息将在此显示</div>
                            </div>
                        </div>

                        <div class="ui-panel" style="margin-top: 20px;">
                            <div class="ui-panel-title">📖 使用说明</div>
                            <div style="margin: 8px 0; font-size: 14px; color: #6C757D; line-height: 1.6;">
                              <div><strong style="color: #34C759;">全自动模式</strong>：点击"全自动模式"按钮</div>
                            </div>
                        </div>
                    </div>
                `;
            },
            
            // 事件绑定
            bindEvents: function() {
                // 自动点击评估按钮复选框
                document.getElementById('autoClickEvaluation').addEventListener('change', function() {
                    EducationHelper.Config.state.autoClickEvaluationEnabled = this.checked;
                    EducationHelper.Logger.action(`自动点击评估按钮: ${this.checked ? '已启用' : '已禁用'}`);
                    
                    // 显示或隐藏倒计时区域
                    const countdownDiv = document.getElementById('countdownDiv');
                    if (this.checked) {
                        countdownDiv.style.display = 'block';
                        EducationHelper.EvaluationList.autoClicker.startCountdown();
                    } else {
                        countdownDiv.style.display = 'none';
                        // 如果有正在进行的倒计时，取消它
                        if (window.autoClickCountdownTimer) {
                            clearInterval(window.autoClickCountdownTimer);
                            window.autoClickCountdownTimer = null;
                        }
                    }
                });
                
                // 全自动模式按钮
                document.getElementById('autoModeButton').addEventListener('click', function() {
                    // 根据当前状态切换自动模式
                    if (EducationHelper.Config.state.autoMode) {
                        EducationHelper.EvaluationList.autoMode.disable();
                    } else {
                        EducationHelper.EvaluationList.autoMode.enable();
                    }
                    
                    // 更新按钮样式
                    this.style.background = EducationHelper.Config.state.autoMode ? 
                        'linear-gradient(135deg, #4caf50, #2e7d32)' : 
                        'linear-gradient(135deg, #2196f3, #0d47a1)';
                    
                    this.innerHTML = `<div style="display: flex; align-items: center; justify-content: center;">
                        <span style="margin-right: 5px;">${EducationHelper.Config.state.autoMode ? '✅' : '🚀'}</span>
                        <span>${EducationHelper.Config.state.autoMode ? '停止全自动模式' : '启用全自动模式'}</span>
                        ${!EducationHelper.Config.state.autoMode ? '<span style="margin-left: 5px; font-size: 11px;">(自动评估、选择、提交)</span>' : ''}
                    </div>`;
                });
                
                // 调试模式复选框
                document.getElementById('debugMode').addEventListener('change', function() {
                    EducationHelper.Config.state.debugMode = this.checked;
                    EducationHelper.Logger.action(`调试模式: ${this.checked ? '已启用' : '已禁用'}`);
                    
                    // 显示/隐藏调试面板
                    const debugPanel = document.getElementById('debugInfo');
                    if (debugPanel) {
                        debugPanel.style.display = this.checked ? 'block' : 'none';
                    }
                    
                    // 如果启用调试模式，输出页面基本信息
                    if (this.checked) {
                        EducationHelper.Logger.debug('调试模式已启用');
                        EducationHelper.Logger.debug(`当前URL: ${window.location.href}`);
                        EducationHelper.Logger.debug(`页面标题: ${document.title}`);
                        EducationHelper.Logger.debug(`jQuery可用: ${typeof $ !== 'undefined'}`);
                    }
                });
                

            },
            
            // 初始化
            init: function() {
                if (!EducationHelper.Config.pageType.isEvaluationListPage) return;

                EducationHelper.Logger.action('初始化评估列表模块...');

                // 初始化进度统计
                setTimeout(() => {
                    this.progress.updateProgress();

                    // 定期更新进度（每5秒）
                    setInterval(() => {
                        this.progress.updateProgress();
                    }, 5000);
                }, 1000);

                // 如果启用了自动点击，则设置倒计时
                if (EducationHelper.Config.state.autoClickEvaluationEnabled || EducationHelper.Config.state.autoMode) {
                    // 等待UI元素创建完成后启动倒计时
                    setTimeout(() => {
                        const countdownDiv = document.getElementById('countdownDiv');
                        if (countdownDiv) {
                            countdownDiv.style.display = 'block';
                            // 开始倒计时
                            this.autoClicker.startCountdown();
                        }
                    }, 500);
                }

                return this;
            }
        },
    };
    
    // 初始化配置
    EducationHelper.Config.init();
    
    // 主入口点 - 脚本初始化
    function init() {
        console.log('齐大教务助手启动中...');
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAfterDOMLoaded);
        } else {
            initAfterDOMLoaded();
        }
    }
    
    // DOM加载完成后初始化
    function initAfterDOMLoaded() {
        // 创建UI界面
        EducationHelper.UI.create();
        
        // 根据页面类型初始化相应模块
        initModulesByPageType();
    }
    
    // 根据页面类型初始化模块
    function initModulesByPageType() {
        const config = EducationHelper.Config;
        
        if (config.pageType.isCoursePage) {
            // 初始化抢课模块
            EducationHelper.CourseGrabber.init();
            // 生成UI内容
            EducationHelper.UI.elements.content.innerHTML = EducationHelper.CourseGrabber.generateUI();
            // 绑定事件
            EducationHelper.CourseGrabber.bindEvents();
        } 
        else if (config.pageType.isEvaluationPage) {
            // 评估页面初始化代码
            EducationHelper.Evaluator.init();
            EducationHelper.UI.elements.content.innerHTML = EducationHelper.Evaluator.generateUI();
            EducationHelper.Evaluator.bindEvents();
        } 
        else if (config.pageType.isEvaluationListPage) {
            // 评估列表页面初始化代码
            EducationHelper.EvaluationList.init();
            EducationHelper.UI.elements.content.innerHTML = EducationHelper.EvaluationList.generateUI();
            EducationHelper.EvaluationList.bindEvents();
        } 
        else {
            // 不支持的页面
            EducationHelper.UI.elements.content.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <p>当前页面不支持本助手功能</p>
                </div>
            `;
        }
    }
    
    // 启动脚本
    init();
})(); 