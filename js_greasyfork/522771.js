// ==UserScript==
// @name         新海天帮你查专业课课余量
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  适配新版教务系统的自动选课脚本（增强通知版）
// @author       上条当咩 & Claude
// @match        https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects/
// @icon         https://yaya.csoci.com:1314/files/spc_ico_sora_sd.jpg
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/522771/%E6%96%B0%E6%B5%B7%E5%A4%A9%E5%B8%AE%E4%BD%A0%E6%9F%A5%E4%B8%93%E4%B8%9A%E8%AF%BE%E8%AF%BE%E4%BD%99%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/522771/%E6%96%B0%E6%B5%B7%E5%A4%A9%E5%B8%AE%E4%BD%A0%E6%9F%A5%E4%B8%93%E4%B8%9A%E8%AF%BE%E8%AF%BE%E4%BD%99%E9%87%8F.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 您的愿望单课程数组 - 只需填写课程号和序号，例如: ['M402001B 01', 'A121033B 01']
    var wishListCourses = [
        'M402005B 01',
        'M402005B 02',
    ];
 
    let hasSubmitted = false;
    let notificationIntervals = {}; // 存储每个课程的通知计时器
 
    // 发送循环通知
    function startRepeatingNotification(courseCode) {
        if (notificationIntervals[courseCode]) {
            return; // 如果已经在发送通知，就不重复创建
        }
 
        // 创建新的通知间隔
        notificationIntervals[courseCode] = setInterval(() => {
            GM_notification({
                title: '课程余量提醒！',
                text: `课程 ${courseCode} 有余量！点击停止提醒`,
                timeout: 0, // 设置为0表示通知不会自动消失
                onclick: () => stopNotification(courseCode)
            });
        }, 3000); // 每3秒发送一次通知
    }
 
    // 停止特定课程的通知
    function stopNotification(courseCode) {
        if (notificationIntervals[courseCode]) {
            clearInterval(notificationIntervals[courseCode]);
            delete notificationIntervals[courseCode];
            console.log(`已停止 ${courseCode} 的通知`);
        }
    }
 
    // 停止所有通知
    function stopAllNotifications() {
        Object.keys(notificationIntervals).forEach(courseCode => {
            stopNotification(courseCode);
        });
    }
 
    // 从课程描述中提取课程信息
    function extractCourseInfo(courseCell) {
        const ellipsisElement = courseCell.querySelector('.ellipsis');
        if (!ellipsisElement) {
            console.log('未找到课程描述元素');
            return null;
        }
 
        const description = ellipsisElement.getAttribute('title');
        if (!description) {
            console.log('课程描述为空');
            return null;
        }
 
        const regex = /([A-Z]\d{6}[A-Z]):.*?(\d{2})/;
        const match = description.match(regex);
 
        if (match) {
            return {
                courseCode: match[1],
                sectionNum: match[2],
                fullCode: `${match[1]} ${match[2]}`
            };
        }
 
        console.log(`无法解析课程信息: ${description}`);
        return null;
    }
 
    // 点击提交按钮
    function clickSubmitButton() {
        var submitButton = document.getElementById('select-submit-btn');
        if (submitButton) {
            submitButton.click();
            console.log('提交按钮已点击');
            return true;
        }
        console.log('提交按钮未找到');
        return false;
    }
 
    // 处理验证码
    function handleCaptcha() {
        var captchaDialog = document.querySelector('.captcha-dialog:not(.hide)');
        if (captchaDialog) {
            var inputField = captchaDialog.querySelector('input[name="answer"]');
            if (inputField) {
                console.log('请输入验证码后按下回车');
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
            console.log('确认按钮已点击');
            stopAllNotifications(); // 选课成功后停止所有通知
            return true;
        }
        return false;
    }
 
    // 点击复选框并处理"已了解"模态框
    async function clickCheckboxAndUnderstandModal(courseCode) {
        var checkbox = document.querySelector(`input[name="checkboxs"][kch="${courseCode}"]`);
        if (checkbox && !checkbox.disabled) {
            checkbox.click();
            console.log(`找到课程 ${courseCode} 的复选框并点击`);
 
            // 等待并处理"已了解"模态框
            setTimeout(() => {
                // 添加回车键监听
                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        const understandButton = document.querySelector('.btn[data-bb-handler="info"]');
                        if (understandButton) {
                            understandButton.click();
                            console.log(`${courseCode} 已了解提示已确认（通过回车键）`);
                            // 移除事件监听器，避免重复触发
                            document.removeEventListener('keydown', handleEnterKey);
                        }
                    }
                };
 
                document.addEventListener('keydown', handleEnterKey);
 
                // 原有的自动点击逻辑保持不变
                var understandButton = document.querySelector('.btn[data-bb-handler="info"]');
                if (understandButton) {
                    understandButton.click();
                    console.log(`${courseCode} 已了解提示已确认`);
                    // 点击后也要移除事件监听器
                    document.removeEventListener('keydown', handleEnterKey);
                }
            }, 500);
        }
    }
 
    // 提交选课
    function submit() {
        if (clickSubmitButton()) {
            hasSubmitted = true;
 
            // 监听验证码输入
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' && handleCaptcha()) {
                    clickConfirmButton();
                }
            });
        }
    }
 
    // 主要逻辑
    function main() {
        const courseTable = document.querySelector('#current table');
        if (!courseTable) {
            console.log('未找到课程表');
            return;
        }
 
        const rows = courseTable.querySelectorAll('tbody tr');
        let availableCourseCount = 0;
 
        rows.forEach(row => {
            const cells = row.cells;
            if (cells.length >= 2) {
                const courseCell = cells[1];
                const statusCell = cells[0];
 
                const courseInfo = extractCourseInfo(courseCell);
                if (courseInfo && wishListCourses.includes(courseInfo.fullCode)) {
                    const statusText = statusCell.textContent.trim();
                    console.log(`检查课程: ${courseInfo.fullCode}, 状态: ${statusText}`);
 
                    if (!statusText.includes('无余量') && !statusText.includes('已选')) {
                        availableCourseCount++;
 
                        if (!hasSubmitted) {
                            clickCheckboxAndUnderstandModal(courseInfo.courseCode);
                        }
 
                        // 启动循环通知
                        startRepeatingNotification(courseInfo.fullCode);
                    }
                }
            }
        });
 
        // 根据可选课程数量决定下一步操作
        if (availableCourseCount > 0 && !hasSubmitted) {
            submit();
        } else if (availableCourseCount === 0) {
            setTimeout(() => {
                location.reload();
            }, 1000); // 2秒后刷新
        }
    }
 
    // 页面卸载时清理所有通知
    window.addEventListener('beforeunload', () => {
        stopAllNotifications();
    });
 
    // 启动脚本
    main();
})();