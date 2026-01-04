// ==UserScript==
// @name         新海天帮你查任选课余量
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  适配新版教务系统的自动选课脚本（增强通知版 + iframe适配）
// @author       上条当咩 & Claude
// @match        https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects/
// @icon         https://yaya.csoci.com:1314/files/spc_ico_sora_sd.jpg
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/521677/%E6%96%B0%E6%B5%B7%E5%A4%A9%E5%B8%AE%E4%BD%A0%E6%9F%A5%E4%BB%BB%E9%80%89%E8%AF%BE%E4%BD%99%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/521677/%E6%96%B0%E6%B5%B7%E5%A4%A9%E5%B8%AE%E4%BD%A0%E6%9F%A5%E4%BB%BB%E9%80%89%E8%AF%BE%E4%BD%99%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 您的愿望单课程数组 - 只需填写课程号和序号，例如: ['M402001B 01', 'A121033B 01']
    var wishListCourses = [
        'A101006B 01',
        'M402005B 02',
    ];

    let hasSubmitted = false;
    let notificationIntervals = {}; // 存储每个课程的通知计时器
    let isInitialized = false;

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

        // 修改正则表达式以匹配课程号和序号
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
                timeout: 0,
                onclick: () => stopNotification(courseCode)
            });
        }, 3000);
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

    // 点击提交按钮
    function clickSubmitButton() {
        const iframe = document.querySelector('iframe[src*="selects_action"]');
        if (!iframe) return false;

        const submitButton = iframe.contentDocument.querySelector('#select-submit-btn');
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
        const iframe = document.querySelector('iframe[src*="selects_action"]');
        if (!iframe) return false;

        const captchaDialog = iframe.contentDocument.querySelector('.captcha-dialog:not(.hide)');
        if (captchaDialog) {
            const inputField = captchaDialog.querySelector('input[name="answer"]');
            if (inputField) {
                console.log('请输入验证码后按下回车');
                return true;
            }
        }
        return false;
    }

    // 点击确认按钮
    function clickConfirmButton() {
        const iframe = document.querySelector('iframe[src*="selects_action"]');
        if (!iframe) return false;

        const confirmButton = iframe.contentDocument.querySelector('.btn-info[data-bb-handler="ok"]');
        if (confirmButton) {
            // 移除可能导致警告的属性
            const closeButtons = iframe.contentDocument.querySelectorAll('.bootbox-close-button');
            closeButtons.forEach(button => {
                button.removeAttribute('aria-hidden');
                // 可选：添加 inert 属性作为替代
                // button.setAttribute('inert', '');
            });

            confirmButton.click();
            console.log('确认按钮已点击');
            stopAllNotifications();
            return true;
        }
        return false;
    }

    // 点击复选框并处理"已了解"模态框
    async function clickCheckboxAndUnderstandModal(courseCode) {
        const iframe = document.querySelector('iframe[src*="selects_action"]');
        if (!iframe) return;

        const checkbox = iframe.contentDocument.querySelector(`input[name="checkboxs"][kch="${courseCode}"]`);
        if (checkbox && !checkbox.disabled) {
            checkbox.click();
            console.log(`找到课程 ${courseCode} 的复选框并点击`);

            // 等待并处理"已了解"模态框
            setTimeout(() => {
                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        const understandButton = iframe.contentDocument.querySelector('.btn[data-bb-handler="info"]');
                        if (understandButton) {
                            understandButton.click();
                            console.log(`${courseCode} 已了解提示已确认（通过回车键）`);
                            iframe.contentDocument.removeEventListener('keydown', handleEnterKey);
                        }
                    }
                };

                iframe.contentDocument.addEventListener('keydown', handleEnterKey);

                const understandButton = iframe.contentDocument.querySelector('.btn[data-bb-handler="info"]');
                if (understandButton) {
                    understandButton.click();
                    console.log(`${courseCode} 已了解提示已确认`);
                    iframe.contentDocument.removeEventListener('keydown', handleEnterKey);
                }
            }, 500);
        }
    }

    // 提交选课
    function submit() {
        if (clickSubmitButton()) {
            hasSubmitted = true;

            // 监听验证码输入
            const iframe = document.querySelector('iframe[src*="selects_action"]');
            if (iframe) {
                iframe.contentDocument.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' && handleCaptcha()) {
                        clickConfirmButton();
                    }
                });
            }
        }
    }

    // 刷新iframe内容
   async function refreshIframeContent() {
        const iframe = document.querySelector('iframe[src*="selects_action"]');
        if (!iframe) {
            console.log('未找到iframe，无法刷新');
            return false;
        }

        try {
            // 使用 iframe 的 src 属性重新加载，而不是直接修改内容
            iframe.src = 'https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects_action/?action=load&iframe=school&page=1&perpage=1000';

            // 等待 iframe 重新加载完成
            return new Promise((resolve) => {
                iframe.onload = () => {
                    console.log('iframe内容刷新成功');
                    resolve(true);
                };

            });
        } catch (error) {
            console.error('刷新过程出错:', error);
            return false;
        }
    }

    // 检查课程余量并处理选课
    async function checkAndProcessCourses() {
        const iframe = document.querySelector('iframe[src*="selects_action"]');
        if (!iframe) {
            console.log('未找到课程列表 iframe');
            return;
        }

        const courseTable = iframe.contentDocument.querySelector('.table.table-bordered');
        if (!courseTable) {
            console.log('未找到课程表，尝试刷新iframe内容');
            await refreshIframeContent();
            return;
        }
        // 等待0.3秒让页面完全加载
        await new Promise(resolve => setTimeout(resolve, 1000));
        const rows = courseTable.querySelectorAll('tbody tr:not(:first-child)'); // 跳过表头行
        let availableCourseCount = 0;

        rows.forEach(row => {
            const cells = row.cells;
            if (cells.length >= 3) {
                const courseCell = cells[2]; // 课程名称在第3列
                const statusCell = cells[0]; // 选择框/无余量提示在第1列
                const quantityCell = cells[3]; // 具体余量数字在第4列

                const courseInfo = extractCourseInfo(courseCell);
                if (courseInfo && wishListCourses.includes(courseInfo.fullCode)) {
                    const quantity = quantityCell.textContent.trim();
                    const isAvailable = !statusCell.querySelector('.red');  // 检查是否有"无余量"的红色标记

                    console.log(`检查课程: ${courseInfo.fullCode}, 课余量: ${quantity}`);

                    if (isAvailable && quantity !== '0') {
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
            // 如果没有可选课程，刷新iframe内容
            console.log('无可选课程，正在刷新...');
            await refreshIframeContent();
        }
    }

    // 加载完整课程列表
    async function loadFullCourseList() {
        console.log('正在加载完整课程列表...');
        try {
            const iframe = document.querySelector('iframe[src*="selects_action"]');
            if (!iframe) {
                console.log('未找到课程列表 iframe');
                return false;
            }

            // 构建加载 1000 条数据的 URL
            const fullListUrl = 'https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects_action/?action=load&iframe=school&page=1&perpage=1000';

            // 更新 iframe 的 URL
            iframe.src = fullListUrl;

            // 等待 iframe 加载完成
            return new Promise((resolve) => {
                iframe.onload = () => {
                    console.log('完整课程列表加载完成');
                    isInitialized = true;
                    resolve(true);
                };
            });
        } catch (error) {
            console.error('加载完整课程列表时出错:', error);
            return false;
        }
    }

    // 主函数
    async function main() {
        // 等待iframe加载完成
        const iframe = document.querySelector('iframe[src*="selects_action"]');
        if (!iframe) {
            console.log('等待iframe加载...');
            setTimeout(main, 1000);
            return;
        }

        // 如果还没有初始化完整课程列表，先进行初始化
        if (!isInitialized) {
            const success = await loadFullCourseList();
            if (!success) {
                console.log('完整课程列表加载失败，2秒后重试...');
                setTimeout(main, 2000);
                return;
            }
        }

        iframe.onload = () => {
            console.log('iframe已加载，开始运行选课脚本');
            checkAndProcessCourses();

            // 设置定期检查，避免过于频繁刷新
            setInterval(() => {
                if (!hasSubmitted) {
                    checkAndProcessCourses();
                }
            }, 2000);
        };

        // 确保iframe加载完成后执行初始检查
        if (iframe.contentDocument.readyState === 'complete') {
            iframe.onload();
        }
    }

    // 页面卸载时清理所有通知
    window.addEventListener('beforeunload', () => {
        stopAllNotifications();
    });

    // 启动脚本
    main();
})();