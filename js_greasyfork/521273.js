// ==UserScript==
// @name         新海天帮你查跨年级课余量
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  适配新版教务系统的自动跨年级选课脚本（增强通知版）
// @author       上条当咩 & Claude
// @match        https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects/
// @icon         https://yaya.csoci.com:1314/files/spc_ico_sora_sd.jpg
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/521273/%E6%96%B0%E6%B5%B7%E5%A4%A9%E5%B8%AE%E4%BD%A0%E6%9F%A5%E8%B7%A8%E5%B9%B4%E7%BA%A7%E8%AF%BE%E4%BD%99%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/521273/%E6%96%B0%E6%B5%B7%E5%A4%A9%E5%B8%AE%E4%BD%A0%E6%9F%A5%E8%B7%A8%E5%B9%B4%E7%BA%A7%E8%AF%BE%E4%BD%99%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 您的愿望单课程数组
    var wishListCourses = [
        'C102014B 01',
        'M402005B 02',
    ];

    let hasSubmitted = false;
    let notificationIntervals = {};
    let isMonitoring = false; // 是否正在监控中

    console.log("脚本开始运行...");

    // 直接调用initPanel打开跨年级选课页面
    function openCrossGradePage() {
        console.log("尝试打开跨年级选课页面...");
        try {
            unsafeWindow.initPanel('/course_selection/courseselecttask/selects_action/?action=load&iframe=cross&page=1&perpage=10000', 1200);
            console.log("成功调用initPanel");
            return true;
        } catch(e) {
            console.error("调用initPanel失败:", e);
            return false;
        }
    }

    // 检查课程
    function checkCourses(iframeDoc) {
        console.log("开始检查课程...");
        const courseTable = iframeDoc.querySelector('table');
        if (!courseTable) {
            throw new Error("未找到课程表");
        }

        const rows = courseTable.querySelectorAll('tbody tr');
        console.log(`找到${rows.length}门课程`);
        let availableCourseCount = 0;

        rows.forEach((row, index) => {
            const cells = row.cells;
            if (cells.length >= 3) {
                const courseCell = cells[2];
                const statusCell = cells[0];
                const remainingCell = cells[3];

                const courseText = courseCell.textContent.trim();
                const match = courseText.match(/([A-Z]\d{6}[A-Z])[^\d]*(\d{2})/);

                if (match) {
                    const fullCode = `${match[1]} ${match[2]}`;
                    if (wishListCourses.includes(fullCode)) {
                        const statusText = statusCell.textContent.trim();
                        const remaining = parseInt(remainingCell.textContent.trim()) || 0;

                        console.log(`检查课程[${index}]: ${fullCode}, 状态: ${statusText}, 余量: ${remaining}`);

                        if (remaining > 0 && !statusText.includes('已选')) {
                            availableCourseCount++;
                            const checkbox = row.querySelector('input[type="checkbox"]');
                            if (checkbox && !checkbox.disabled) {
                                checkbox.checked = true;
                                console.log(`选中课程: ${fullCode}`);
                            }

                            if (!notificationIntervals[fullCode]) {
                                notificationIntervals[fullCode] = setInterval(() => {
                                    GM_notification({
                                        title: '跨年级课程余量提醒！',
                                        text: `课程 ${fullCode} 有余量！点击停止提醒`,
                                        timeout: 0,
                                        onclick: () => {
                                            clearInterval(notificationIntervals[fullCode]);
                                            delete notificationIntervals[fullCode];
                                        }
                                    });
                                }, 3000);
                            }
                        }
                    }
                }
            }
        });

        return availableCourseCount;
    }

    // 循环监控逻辑
    async function monitor() {
        if (!isMonitoring) return;

        const iframe = document.querySelector('#panel-container iframe');
        if (!iframe) {
            console.log("未找到iframe,重新打开跨年级选课页面");
            openCrossGradePage();
            setTimeout(monitor, 2000);
            return;
        }

        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            // 检查课程并自动选课
            const availableCourseCount = checkCourses(iframeDoc);
            console.log(`检测到${availableCourseCount}个可选课程`);

            if (availableCourseCount > 0 && !hasSubmitted) {
                const submitBtn = iframeDoc.querySelector('#select-submit-btn');
                if (submitBtn) {
                    submitBtn.click();
                    hasSubmitted = true;
                    console.log("已点击提交按钮");

                    iframeDoc.addEventListener('keydown', event => {
                        if (event.key === 'Enter') {
                            const captchaDialog = iframeDoc.querySelector('.captcha-dialog:not(.hide)');
                            if (captchaDialog) {
                                const confirmBtn = iframeDoc.querySelector('.btn-info[data-bb-handler="ok"]');
                                if (confirmBtn) {
                                    confirmBtn.click();
                                }
                            }
                        }
                    });
                }
            }

            // 无论是否有课都继续监控
            console.log("1秒后刷新页面继续检测...");
            setTimeout(() => {
                if (iframe.contentWindow) {
                    iframe.contentWindow.location.reload();
                }
                setTimeout(monitor, 1000); // 页面刷新后继续监控
            }, 1000);

        } catch(e) {
            console.error("执行出错:", e);
            setTimeout(monitor, 2000); // 出错后重试
        }
    }

    // 启动监控
    function startMonitoring() {
        if (!isMonitoring) {
            isMonitoring = true;
            console.log("开始监控...");
            openCrossGradePage();
            setTimeout(monitor, 2000);
        }
    }

    // 停止监控
    function stopMonitoring() {
        isMonitoring = false;
        console.log("停止监控");
        Object.keys(notificationIntervals).forEach(key => {
            clearInterval(notificationIntervals[key]);
        });
    }

    // 清理通知
    window.addEventListener('beforeunload', stopMonitoring);

    // 添加控制按钮
    const controlDiv = document.createElement('div');
    controlDiv.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;';
    controlDiv.innerHTML = `
        <button id="startMonitor" style="margin-right:5px;">开始监控</button>
        <button id="stopMonitor">停止监控</button>
    `;
    document.body.appendChild(controlDiv);

    document.getElementById('startMonitor').addEventListener('click', startMonitoring);
    document.getElementById('stopMonitor').addEventListener('click', stopMonitoring);

    // 自动启动
    startMonitoring();
})();