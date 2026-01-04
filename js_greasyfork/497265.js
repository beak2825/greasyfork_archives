// ==UserScript==
// @name         新海天帮你查课余量 (可视化日志增强版)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  适配新版教务系统的自动选课脚本（可视日志、可暂停刷新、UI增强版）
// @author       上条当咩 & Claude & Gemini
// @match        https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects/
// @icon         https://love.nimisora.icu/homework-notify/nimisora.png
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497265/%E6%96%B0%E6%B5%B7%E5%A4%A9%E5%B8%AE%E4%BD%A0%E6%9F%A5%E8%AF%BE%E4%BD%99%E9%87%8F%20%28%E5%8F%AF%E8%A7%86%E5%8C%96%E6%97%A5%E5%BF%97%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/497265/%E6%96%B0%E6%B5%B7%E5%A4%A9%E5%B8%AE%E4%BD%A0%E6%9F%A5%E8%AF%BE%E4%BD%99%E9%87%8F%20%28%E5%8F%AF%E8%A7%86%E5%8C%96%E6%97%A5%E5%BF%97%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------- 配置区 -------------------
    // 您的愿望单课程数组 - 只需填写课程号和序号，例如: ['M402001B 01', 'A121033B 01']
    var wishListCourses = [
        'M402018B 01',//虚拟化
        'M402004B 01',// 软工
    ];

    // 刷新延迟（毫秒），默认为 2000 (2秒)
    const REFRESH_DELAY = 2000;
    // ------------------- 配置区结束 -------------------


    // --- 全局状态变量 ---
    let hasSubmitted = false;
    let notificationIntervals = {}; // 存储每个课程的通知计时器
    let isPaused = false; // 是否暂停自动刷新

    // ------------------- 可视化日志窗口模块 -------------------
    const LogManager = {
        logWindow: null,
        logContent: null,
        showLogButton: null,

        init: function() {
            // 1. 注入CSS样式
            GM_addStyle(`
                #log-window-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 450px;
                    max-height: 350px;
                    background-color: rgba(255, 255, 255, 0.95);
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Microsoft YaHei', sans-serif;
                    font-size: 13px;
                    transition: opacity 0.3s, transform 0.3s;
                }
                #log-window-container.hidden {
                    opacity: 0;
                    transform: scale(0.95);
                    pointer-events: none;
                }
                #log-header {
                    padding: 8px 12px;
                    background-color: #f0f0f0;
                    border-bottom: 1px solid #ccc;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    user-select: none;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                #log-header-title {
                    font-weight: bold;
                    color: #333;
                }
                #log-content {
                    padding: 10px;
                    overflow-y: auto;
                    flex-grow: 1;
                    color: #333;
                    background-color: #fff;
                }
                #log-content p {
                    margin: 0 0 6px 0;
                    padding: 0 0 4px 0;
                    line-height: 1.5;
                    border-bottom: 1px dotted #eee;
                    word-break: break-all;
                }
                #log-content .log-success { color: #28a745; font-weight: bold; }
                #log-content .log-error { color: #dc3545; font-weight: bold; }
                #log-content .log-warn { color: #f39c12; }
                #log-content .log-info { color: #007bff; }
                #log-content .log-check { color: #6c757d; }
                .log-controls button {
                    margin-left: 8px;
                    padding: 4px 8px;
                    font-size: 12px;
                    cursor: pointer;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background-color: #fff;
                }
                .log-controls button:hover {
                    background-color: #e9e9e9;
                    border-color: #bbb;
                }
                #show-log-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9998;
                    display: none; /* Initially hidden */
                    padding: 8px 12px;
                    cursor: pointer;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                 #show-log-button.visible {
                    display: block;
                }
            `);

            // 2. 创建HTML元素
            document.body.insertAdjacentHTML('beforeend', `
                <div id="log-window-container">
                    <div id="log-header">
                        <span id="log-header-title">选课脚本日志</span>
                        <div class="log-controls">
                            <button id="toggle-pause-btn">暂停刷新</button>
                            <button id="clear-log-btn">清空日志</button>
                            <button id="hide-log-btn">隐藏</button>
                        </div>
                    </div>
                    <div id="log-content"></div>
                </div>
                <button id="show-log-button">显示日志</button>
            `);

            // 3. 获取DOM引用
            this.logWindow = document.getElementById('log-window-container');
            this.logContent = document.getElementById('log-content');
            this.showLogButton = document.getElementById('show-log-button');

            // 4. 绑定事件
            this.makeDraggable(document.getElementById('log-header'), this.logWindow);
            document.getElementById('toggle-pause-btn').addEventListener('click', this.togglePause);
            document.getElementById('clear-log-btn').addEventListener('click', () => this.logContent.innerHTML = '');
            document.getElementById('hide-log-btn').addEventListener('click', () => this.toggleVisibility(false));
            this.showLogButton.addEventListener('click', () => this.toggleVisibility(true));

            this.log('日志窗口初始化成功', 'success');
        },

        log: function(message, type = 'info') {
            if (!this.logContent) return;

            const time = new Date().toLocaleTimeString();
            const logClass = `log-${type}`;
            const p = document.createElement('p');
            p.className = logClass;
            p.innerHTML = `[${time}] ${message}`;

            this.logContent.appendChild(p);
            // 自动滚动到底部
            this.logContent.scrollTop = this.logContent.scrollHeight;

            // 同时在控制台输出，方便调试
            console.log(`[Tampermonkey] ${message}`);
        },

        togglePause: function() {
            isPaused = !isPaused;
            const btn = document.getElementById('toggle-pause-btn');
            btn.textContent = isPaused ? '恢复刷新' : '暂停刷新';
            btn.style.color = isPaused ? '#dc3545' : '';
            LogManager.log(`刷新已 ${isPaused ? '暂停' : '恢复'}`, 'warn');
        },

        toggleVisibility: function(show) {
            if(show) {
                this.logWindow.classList.remove('hidden');
                this.showLogButton.classList.remove('visible');
            } else {
                this.logWindow.classList.add('hidden');
                this.showLogButton.classList.add('visible');
            }
        },

        makeDraggable: function(header, element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            header.onmousedown = e => {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = () => {
                    document.onmouseup = null;
                    document.onmousemove = null;
                };
                document.onmousemove = e => {
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    element.style.top = (element.offsetTop - pos2) + "px";
                    element.style.left = (element.offsetLeft - pos1) + "px";
                };
            };
        }
    };

    // ------------------- 原有脚本逻辑（已集成日志功能） -------------------

    // 发送循环通知
    function startRepeatingNotification(courseCode) {
        if (notificationIntervals[courseCode]) return;
        LogManager.log(`为课程 ${courseCode} 开启循环通知`, 'warn');

        notificationIntervals[courseCode] = setInterval(() => {
            GM_notification({
                title: '课程余量提醒！',
                text: `课程 ${courseCode} 有余量！点击此通知停止该课程的提醒`,
                timeout: 0,
                onclick: () => stopNotification(courseCode)
            });
        }, 500); // 每0.5秒发送一次通知
    }

    // 停止特定课程的通知
    function stopNotification(courseCode) {
        if (notificationIntervals[courseCode]) {
            clearInterval(notificationIntervals[courseCode]);
            delete notificationIntervals[courseCode];
            LogManager.log(`已停止 ${courseCode} 的通知`, 'info');
        }
    }

    // 停止所有通知
    function stopAllNotifications() {
        Object.keys(notificationIntervals).forEach(stopNotification);
    }

    // 从课程描述中提取课程信息
    function extractCourseInfo(courseCell) {
        const ellipsisElement = courseCell.querySelector('.ellipsis');
        if (!ellipsisElement) return null;

        const description = ellipsisElement.getAttribute('title');
        if (!description) return null;

        const regex = /([A-Z]\d{6}[A-Z]):.*?(\d{2})/;
        const match = description.match(regex);

        if (match) {
            return {
                courseCode: match[1],
                sectionNum: match[2],
                fullCode: `${match[1]} ${match[2]}`
            };
        }
        return null;
    }

    // 点击提交按钮
    function clickSubmitButton() {
        var submitButton = document.getElementById('select-submit-btn');
        if (submitButton) {
            submitButton.click();
            LogManager.log('提交按钮已点击', 'info');
            return true;
        }
        LogManager.log('提交按钮未找到', 'error');
        return false;
    }

    // 处理验证码
    function handleCaptcha() {
        var captchaDialog = document.querySelector('.captcha-dialog:not(.hide)');
        if (captchaDialog) {
            var inputField = captchaDialog.querySelector('input[name="answer"]');
            if (inputField) {
                LogManager.log('检测到验证码，请输入后按下回车键提交', 'warn');
                return true;
            }
        }
        return false;
    }

    // 点击确认按钮
    function clickConfirmButton() {
        var confirmButton = document.querySelector('.btn-info[data-bb-handler="ok"]');
        if (confirmButton) {
            confirmButton.click();
            LogManager.log('最终确认按钮已点击，选课成功！', 'success');
            stopAllNotifications();
            return true;
        }
        return false;
    }

    // 点击复选框并处理"已了解"模态框
    function clickCheckboxAndUnderstandModal(courseCode, fullCode) {
        var checkbox = document.querySelector(`input[name="checkboxs"][kch="${courseCode}"]`);
        if (checkbox && !checkbox.disabled) {
            checkbox.click();
            LogManager.log(`已为课程 ${fullCode} 勾选复选框`, 'info');

            setTimeout(() => {
                const understandButton = document.querySelector('.btn[data-bb-handler="info"]');
                if (understandButton) {
                    understandButton.click();
                    LogManager.log(`已自动确认 ${fullCode} 的“已了解”提示`, 'info');
                }
            }, 500);
        }
    }

    // 提交选课
    function submit() {
        if (clickSubmitButton()) {
            hasSubmitted = true;
            setTimeout(() => {
                if (handleCaptcha()) {
                    document.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter') {
                            clickConfirmButton();
                        }
                    });
                } else {
                    // 如果没有验证码，可能直接弹出成功/失败窗口
                    clickConfirmButton();
                }
            }, 1000); // 等待一下，让验证码或结果对话框出现
        }
    }

    // 主要逻辑
    function main() {
        LogManager.log(`开始扫描愿望单课程: [${wishListCourses.join(', ')}]`, 'info');
        const courseTable = document.querySelector('#current table');
        if (!courseTable) {
            LogManager.log('未找到课程表，可能是页面结构已改变。', 'error');
            return;
        }

        const rows = courseTable.querySelectorAll('tbody tr');
        let availableCourseCount = 0;
        let foundWishListCourses = [];

        rows.forEach(row => {
            const cells = row.cells;
            if (cells.length < 2) return;

            const courseInfo = extractCourseInfo(cells[1]);
            if (courseInfo && wishListCourses.includes(courseInfo.fullCode)) {
                const statusText = cells[0].textContent.trim();
                LogManager.log(`检查课程: ${courseInfo.fullCode}, 状态: ${statusText}`, 'check');
                foundWishListCourses.push(courseInfo.fullCode);

                if (!statusText.includes('无余量') && !statusText.includes('已选')) {
                    LogManager.log(`发现课程 ${courseInfo.fullCode} 有余量！`, 'success');
                    availableCourseCount++;

                    if (!hasSubmitted) {
                        clickCheckboxAndUnderstandModal(courseInfo.courseCode, courseInfo.fullCode);
                    }
                    startRepeatingNotification(courseInfo.fullCode);
                }
            }
        });

        // 检查是否有愿望单中的课程未在页面上找到
        wishListCourses.forEach(c => {
            if (!foundWishListCourses.includes(c)) {
                LogManager.log(`警告：愿望单课程 ${c} 未在当前页面找到，请检查课程号和选课轮次是否正确。`, 'error');
            }
        });


        if (availableCourseCount > 0 && !hasSubmitted) {
            LogManager.log(`共发现 ${availableCourseCount} 门可选课程，准备提交...`, 'warn');
            submit();
        } else if (availableCourseCount === 0) {
            LogManager.log('愿望单中无有余量的课程，准备刷新...');
            if (!isPaused) {
                setTimeout(() => {
                    LogManager.log('正在刷新页面...', 'info');
                    location.reload();
                }, REFRESH_DELAY);
            } else {
                 LogManager.log('刷新已暂停，脚本将不执行任何操作。', 'warn');
            }
        }
    }

    // 页面卸载时清理所有通知
    window.addEventListener('beforeunload', () => {
        stopAllNotifications();
    });

    // 启动脚本
    // 使用 setTimeout 确保页面元素完全加载
    setTimeout(() => {
        LogManager.init(); // 初始化日志窗口
        main(); // 运行主逻辑
    }, 500);

})();