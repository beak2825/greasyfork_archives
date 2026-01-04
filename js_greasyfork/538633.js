// ==UserScript==
// @name         华医三基考核培训助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  华医三基考核培训自动化工具
// @author       BN_Dou
// @match        https://sjkhpx.wsglw.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/538633/%E5%8D%8E%E5%8C%BB%E4%B8%89%E5%9F%BA%E8%80%83%E6%A0%B8%E5%9F%B9%E8%AE%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538633/%E5%8D%8E%E5%8C%BB%E4%B8%89%E5%9F%BA%E8%80%83%E6%A0%B8%E5%9F%B9%E8%AE%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .custom-button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
        }
        .start-button {
            background-color: #4CAF50;
        }
        .stop-button {
            background-color: #f44336;
        }
        .button-container {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            display: flex;
            gap: 10px;
        }
        .completion-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 10001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            min-width: 300px;
        }
        .completion-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        }
        .close-button {
            background-color: #fff;
            color: #4CAF50;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 15px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .close-button:hover {
            background-color: #f0f0f0;
            transform: scale(1.05);
        }
    `);

    // 发送推送通知
    function sendPushNotification(msg) {
        const userName = document.querySelector(".user_name span")?.textContent || "未知用户";
        const now = new Date();
        const timestamp = now.getFullYear() + '年' + 
                         (now.getMonth() + 1) + '月' + 
                         now.getDate() + '日 ' + 
                         now.getHours() + ':' + 
                         now.getMinutes() + ':' + 
                         now.getSeconds();
        const url = "http://www.pushplus.plus/send";
        const data = {
            token: "d6682ab34181437e8ad033cd58c8cb26",
            title: "华医三基培训学习",
            content: `${userName} ${msg} (${timestamp})`,
            channel: "mail",
            webhook: "qq",
            template: "markdown"
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 200) {
                        console.log("pushplus 邮箱推送成功");
                    } else {
                        console.error("pushplus 邮箱推送失败\n", result);
                    }
                } catch (error) {
                    console.error("推送响应解析失败：", error);
                }
            },
            onerror: function(error) {
                console.error("推送请求失败：", error);
            }
        });
    }

    // 显示完成弹窗
    function showCompletionDialog() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'completion-overlay';
        
        // 创建弹窗
        const dialog = document.createElement('div');
        dialog.className = 'completion-message';
        dialog.innerHTML = `
            <h2>🎉 恭喜！</h2>
            <p>所有课程学习已完成！</p>
            <p>您可以关闭此页面了。</p>
            <button class="close-button">关闭弹窗</button>
        `;

        // 添加关闭按钮事件
        const closeButton = dialog.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            overlay.remove();
            dialog.remove();
        });

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // 检查课程完成状态
    function checkCourseCompletion() {
        const dialogBox = document.querySelector("div.dialog_box_pj");
        if (dialogBox && dialogBox.style.display === 'block') {
            // 获取当前课程ID
            const currentUrl = window.location.href;
            const courseIdMatch = currentUrl.match(/courseware_id=([^&]+)/);
            if (courseIdMatch && courseIdMatch[1]) {
                const currentCourseId = courseIdMatch[1];
                
                // 从存储中获取课程ID列表
                const courseIds = GM_getValue('courseIds', []);
                
                // 删除当前课程ID
                const updatedCourseIds = courseIds.filter(item => item.id !== currentCourseId);
                
                // 更新存储
                GM_setValue('courseIds', updatedCourseIds);
                console.log('课程已完成，已从列表中移除：', currentCourseId);
                
                // 如果还有课程，跳转到下一个
                if (updatedCourseIds.length > 0) {
                    const nextCourseId = updatedCourseIds[0]; // 选择第一个课程
                    if (nextCourseId.BJY) {
                        window.location.href = `https://sjkhpx.wsglw.net/exercise/ExerciseCourse/BJYCoursePlay?courseware_id=${nextCourseId.id}`;
                    } else {
                        window.location.href = `https://sjkhpx.wsglw.net/exercise/ExerciseCourse/CoursePlay?courseware_id=${nextCourseId.id}`;
                    }
                } else {
                    // 先重定向到首页
                    window.location.href = 'https://sjkhpx.wsglw.net/exercise/ExerciseHome/index';
                }
            }
        }
    }

    // 检查运行状态并执行相应操作
    function checkRunningState() {
        const isRunning = GM_getValue('isRunning', 0);
        if (isRunning === 1) {            
            // 只在首次启动时跳转到第一个课程
            const currentUrl = window.location.href;
            const courseIds = GM_getValue('courseIds', []);
            if (currentUrl.includes('ExerciseHome/index')) {
                if (courseIds.length > 0) {
                    const course = courseIds[0];
                    if (course.BJY) {
                        window.location.href = `https://sjkhpx.wsglw.net/exercise/ExerciseCourse/BJYCoursePlay?courseware_id=${course.id}`;
                    } else {
                        window.location.href = `https://sjkhpx.wsglw.net/exercise/ExerciseCourse/CoursePlay?courseware_id=${course.id}`;
                    }
                } else {
                    // 显示完成弹窗
                    showCompletionDialog();
                    // 发送推送通知
                    sendPushNotification("已完成所有课程学习！");
                    console.log('所有课程已完成');
                    stopRunning();
                }
            }
        }
    }

    // 开始运行
    function startRunning() {
        GM_setValue('isRunning', 1);
        updateButtonStates();
        checkRunningState();
    }

    // 停止运行
    function stopRunning() {
        GM_setValue('isRunning', 0);
        updateButtonStates();
    }

    // 更新按钮状态
    function updateButtonStates() {
        const isRunning = GM_getValue('isRunning', 0);
        const startButton = document.getElementById('startButton');
        const stopButton = document.getElementById('stopButton');
        
        if (startButton && stopButton) {
            startButton.style.display = isRunning === 1 ? 'none' : 'block';
            stopButton.style.display = isRunning === 1 ? 'block' : 'none';
        }
    }

    // 在页面上添加按钮
    function addButtons() {
        const container = document.createElement('div');
        container.className = 'button-container';

        // 获取课程按钮
        const getCourseButton = document.createElement('button');
        getCourseButton.className = 'custom-button';
        getCourseButton.textContent = '获取培训课程';
        getCourseButton.onclick = getCourseList;

        // 开始按钮
        const startButton = document.createElement('button');
        startButton.id = 'startButton';
        startButton.className = 'custom-button start-button';
        startButton.textContent = '开始学习';
        startButton.onclick = startRunning;

        // 停止按钮
        const stopButton = document.createElement('button');
        stopButton.id = 'stopButton';
        stopButton.className = 'custom-button stop-button';
        stopButton.textContent = '停止学习';
        stopButton.onclick = stopRunning;

        container.appendChild(getCourseButton);
        container.appendChild(startButton);
        container.appendChild(stopButton);
        document.body.appendChild(container);

        // 初始化按钮状态
        updateButtonStates();
    }

    // 获取培训课程列表
    function getCourseList() {
        const url = 'https://sjkhpx.wsglw.net/exercise/ExerciseCourse/GetLearnCourseList';
        const data = {
            learnPlanId: document.querySelector(".learnPlan.cur").getAttribute('learnid'),
            learnState: '2'
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0'
            },
            data: Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&'),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.Data && result.Data.data) {
                        console.log('课程列表获取成功：', result.Data.data);
                        
                        // 处理课程数据
                        const courseIds = result.Data.data
                            .filter(course => course.Learning_state !== 1)
                            .map(course => ({
                                id: course.LearningPlan_Courseware_Id,
                                BJY: course.BJY_Vid !== null,
                            }));
                        
                        // 存储课程ID
                        if (courseIds.length > 0) {
                            GM_setValue('courseIds', courseIds);
                            console.log('已存储课程ID：', courseIds);
                        } else {
                            console.log('没有找到符合条件的课程');
                        }
                    } else {
                        console.error('返回数据格式不正确');
                    }
                } catch (error) {
                    console.error('解析响应失败：', error);
                }
            },
            onerror: function(error) {
                console.error('请求失败：', error);
            }
        });
    }

    // 注册菜单命令
    GM_registerMenuCommand('获取培训课程', getCourseList);
    GM_registerMenuCommand('开始学习', startRunning);
    GM_registerMenuCommand('停止学习', stopRunning);

    // 页面加载完成后添加按钮
    window.addEventListener('load', addButtons);

    // 定期检查运行状态和课程完成状态
    setInterval(() => {
        checkRunningState();
        checkCourseCompletion();
    }, 5000);
})();
