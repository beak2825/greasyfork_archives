// ==UserScript==
// @name         Course selection in Wust
// @namespace    https://greasyfork.org/scripts/523753/
// @version      4.2
// @description  This UserScript is designed to automate the course selection process at Wust (Wuhan University of Science and Technology). It provides an automated solution for students to navigate through different course selection pages and select courses more efficiently. For detailed usage instructions, please visit: https://294520.xyz/2025/01/16/course-selection-in-wust%e4%bd%use7%94%a8%e6%95%99%e7%a8%8b/
// @author       carter
// @match        https://bkjx.wust.edu.cn/jsxsd/xsxk/*
// @match        https://bkjx.wust.edu.cn/jsxsd/xsxkkc/comeInGgxxkxk
// @match        https://bkjx.wust.edu.cn/jsxsd/xsxkkc/comeInBxxk
// @supportURL   https://294520.xyz/2025/01/16/course-selection-in-wust%e4%bd%use7%94%a8%e6%95%99%e7%a8%8b/
// @homepageURL  https://294520.xyz/2025/01/16/course-selection-in-wust%e4%bd%use7%94%a8%e6%95%99%e7%a8%8b/
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523753/Course%20selection%20in%20Wust.user.js
// @updateURL https://update.greasyfork.org/scripts/523753/Course%20selection%20in%20Wust.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前页面路径
    const pathname = window.location.pathname;

    // 配置参数
    const selectedOption = 4; // 1=必修选课, 2=选修选课, 3=本学期计划选课, 4=公选课选课
    const executeStepFour = true; // 是否执行第四步
    const runOnce = true; // 是否只运行一次（选完课后停止）

    // 目标课程配置 - 只需要填写以下4个主要搜索条件中的任意一个
    const targetCourses = [
        {
            courseName: '', // 课程名，如：经济法
            className: '教学班2348', // 合班名称，如：教学班2163
            teacher: '', // 上课老师，如：马力 (支持部分匹配)
            time: '', // 上课时间，如：星期三 (支持部分匹配)

            // 辅助判断条件（可选）
            hasRemainingCapacity: false, // 是否要求有剩余容量（true=只选有余量的课程）
            avoidTimeConflict: false // 是否避免时间冲突（true=跳过有冲突的课程）
        }
        // 可以添加更多课程搜索条件
    ];

    const optionMapping = {
        1: "必修选课",
        2: "选修选课",
        3: "本学期计划选课",
        4: "公选课选课"
    };

    // 本地存储键名
    const STORAGE_KEY = 'wust_course_selection_completed';

    let isStepFourExecuted = false;
    let searchInProgress = false;
    let courseSelectionStopped = false;

    // 检查是否已完成选课
    function isSelectionCompleted() {
        if (!runOnce) return false;
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }

    // 标记选课完成
    function markSelectionCompleted() {
        if (runOnce) {
            localStorage.setItem(STORAGE_KEY, 'true');
            console.log("✅ 选课完成，已标记为完成状态");
        }
    }

    // 重置选课状态（手动调用）
    function resetSelectionStatus() {
        localStorage.removeItem(STORAGE_KEY);
        console.log("🔄 选课状态已重置");
    }

    // 显示原生通知
    function showNativeNotification(courseInfo) {
        try {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }

            if (Notification.permission === 'granted') {
                const title = '🎉 选课成功！';
                const body = `课程：${courseInfo.courseName}\n合班：${courseInfo.className}\n教师：${courseInfo.teacher}\n时间：${courseInfo.time}\n\n⚠️ 脚本已停止运行！`;

                const notification = new Notification(title, {
                    body: body,
                    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjNENBRjUwIiBkPSJNMjQsNEMxMi45NTIsNCA0LDEyLjk1MiA0LDI0czguOTUyLDIwIDIwLDIwczIwLTguOTUyLDIwLTIwUzM1LjA0OCw0IDI0LDR6IE0zNC41ODYsMTQuNTg2bC0xNiwxNkMxOC4yMTksMzAuOTUzIDE3LjYwOSwzMSAxNywzMXMtMS4yMTktMC4wNDctMS41ODYtMC40MTRsLTgtOGMtMC43ODEtMC43ODEtMC43ODEtMi4wNDcgMC0yLjgyOGMwLjc4MS0wLjc4MSAyLjA0Ny0wLjc4MSAyLjgyOCAwTDE3LDI2LjU4NmwxNC41ODYtMTQuNTg2YzAuNzgxLTAuNzgxIDIuMDQ3LT0uNzgxIDIuODI4IDBTMzUuMzY3LDEzLjgwNSAzNC41ODYsMTQuNTg2eiIvPjwvc3ZnPg=='
                });

                setTimeout(() => {
                    notification.close();
                }, 8000);

                console.log("选课成功通知已显示");
            } else {
                console.log("🎉 选课成功！", courseInfo);
            }
        } catch (e) {
            console.log("🎉 选课成功！", courseInfo);
        }
    }

    // 基于 MutationObserver 实时监听 DOM 变化
    function waitForElementFast(selector, callback, timeout = 5000) {
        if (courseSelectionStopped) return;

        let timer = setTimeout(() => {
            observer.disconnect();
            console.log("等待超时，未找到元素：" + selector);
        }, timeout);

        const observer = new MutationObserver((mutations, obs) => {
            if (courseSelectionStopped) {
                obs.disconnect();
                return;
            }

            const element = document.querySelector(selector);
            if (element) {
                clearTimeout(timer);
                obs.disconnect();
                callback(element);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const element = document.querySelector(selector);
        if (element) {
            clearTimeout(timer);
            observer.disconnect();
            callback(element);
        }
    }

    // 勾选条件
    function checkCondition(id) {
        if (courseSelectionStopped) return;

        const element = document.getElementById(id);
        if (element) {
            element.checked = true;
            console.log(`勾选条件: ${id}`);
        }
    }

    function checkConditions(ids) {
        if (courseSelectionStopped) return;
        ids.forEach(id => checkCondition(id));
    }

    // 开始选课流程
    function startCourseSelection() {
        if (courseSelectionStopped) return;

        console.log("开始搜索目标课程...");
        console.log("搜索条件：", targetCourses);

        // 先勾选限选条件
        if (pathname === '/jsxsd/xsxkkc/comeInGgxxkxk') {
            checkConditions(['sfym', 'sfct', 'sfxx']);
        } else {
            checkCondition('sfym');
        }

        // 点击查询按钮
        const queryButton = document.querySelector('input.el-button[value="查询"], input.el-button[value="查 询"]');
        if (queryButton) {
            queryButton.click();
            console.log("点击查询按钮");

            // 等待查询结果加载
            setTimeout(() => {
                if (!courseSelectionStopped) {
                    searchCourses();
                }
            }, 300);
        }
    }

    // 搜索课程
    function searchCourses() {
        if (searchInProgress || courseSelectionStopped) return;
        searchInProgress = true;

        console.log("开始搜索课程...");

        // 检查当前页面的课程
        const found = checkCurrentPageCourses();

        // 如果没找到，检查是否有更多页面
        if (!found && !courseSelectionStopped) {
            setTimeout(() => {
                if (!courseSelectionStopped) {
                    checkNextPage();
                }
            }, 300);
        }
    }

    // 检查当前页面的课程
    function checkCurrentPageCourses() {
        if (courseSelectionStopped) return false;

        const courseRows = document.querySelectorAll('table tbody tr');
        console.log(`当前页面有 ${courseRows.length} 门课程`);

        let found = false;

        courseRows.forEach((row, index) => {
            if (courseSelectionStopped || found) return;

            const cells = row.querySelectorAll('td');
            if (cells.length < 10) return;

            let courseInfo = {};

            // 根据URL判断表格类型
            if (pathname === '/jsxsd/xsxkkc/comeInGgxxkxk') {
                // 公选课表格结构：课程编号、课程名、课程学分、合班名称、分组名、上课老师、上课时间、上课地点、上课校区、限选人数、剩余容量、时间冲突、通选课类别、操作
                courseInfo = {
                    courseCode: cells[0] ? cells[0].textContent.trim() : '',
                    courseName: cells[1] ? cells[1].textContent.trim() : '',
                    courseCredits: cells[2] ? cells[2].textContent.trim() : '',
                    className: cells[3] ? cells[3].textContent.trim() : '',
                    groupName: cells[4] ? cells[4].textContent.trim() : '',
                    teacher: cells[5] ? cells[5].textContent.trim() : '',
                    time: cells[6] ? cells[6].textContent.trim() : '',
                    location: cells[7] ? cells[7].textContent.trim() : '',
                    campus: cells[8] ? cells[8].textContent.trim() : '',
                    maxCapacity: cells[9] ? cells[9].textContent.trim() : '',
                    remainingCapacity: cells[10] ? cells[10].textContent.trim() : '',
                    timeConflict: cells[11] ? cells[11].textContent.trim() : '',
                    category: cells[12] ? cells[12].textContent.trim() : ''
                };
            } else {
                // 必修课表格结构：课程编号、课程名、课程学分、分组名、合班名称、上课老师、上课时间、上课地点、上课校区、限选人数、课堂余量、时间冲突、操作
                courseInfo = {
                    courseCode: cells[0] ? cells[0].textContent.trim() : '',
                    courseName: cells[1] ? cells[1].textContent.trim() : '',
                    courseCredits: cells[2] ? cells[2].textContent.trim() : '',
                    groupName: cells[3] ? cells[3].textContent.trim() : '',
                    className: cells[4] ? cells[4].textContent.trim() : '',
                    teacher: cells[5] ? cells[5].textContent.trim() : '',
                    time: cells[6] ? cells[6].textContent.trim() : '',
                    location: cells[7] ? cells[7].textContent.trim() : '',
                    campus: cells[8] ? cells[8].textContent.trim() : '',
                    maxCapacity: cells[9] ? cells[9].textContent.trim() : '',
                    remainingCapacity: cells[10] ? cells[10].textContent.trim() : '',
                    timeConflict: cells[11] ? cells[11].textContent.trim() : ''
                };
            }

            // 简化日志输出
            console.log(`课程 ${index + 1}: ${courseInfo.courseName} | 合班: ${courseInfo.className} | 教师: ${courseInfo.teacher} | 时间: ${courseInfo.time}`);

            // 检查是否是目标课程
            const targetCourse = targetCourses.find(course => {
                // 主要搜索条件 - 支持部分匹配
                const nameMatch = !course.courseName || courseInfo.courseName.includes(course.courseName);
                const classMatch = !course.className || courseInfo.className.includes(course.className);
                const teacherMatch = !course.teacher || courseInfo.teacher.includes(course.teacher);
                const timeMatch = !course.time || courseInfo.time.includes(course.time);

                // 辅助判断条件
                const capacityOk = !course.hasRemainingCapacity || (courseInfo.remainingCapacity && courseInfo.remainingCapacity.trim() !== '');
                const conflictOk = !course.avoidTimeConflict || !courseInfo.timeConflict || courseInfo.timeConflict.trim() === '';

                const mainMatch = nameMatch && classMatch && teacherMatch && timeMatch;
                const auxMatch = capacityOk && conflictOk;

                return mainMatch && auxMatch;
            });

            if (targetCourse) {
                console.log(`🎯 找到匹配课程: ${courseInfo.courseName} | 合班: ${courseInfo.className} | 教师: ${courseInfo.teacher}`);

                // 查找选课按钮
                const selectButton = cells[cells.length - 1].querySelector('a');
                if (selectButton && selectButton.textContent.includes('选课')) {
                    console.log("点击选课按钮");

                    // 点击选课按钮
                    selectButton.click();

                    // 标记选课完成
                    markSelectionCompleted();

                    // 显示成功通知
                    setTimeout(() => {
                        showNativeNotification(courseInfo);
                    }, 1000);

                    courseSelectionStopped = true;
                    searchInProgress = false;
                    found = true;
                    return;
                } else {
                    console.log("未找到选课按钮或按钮不可用");
                }
            }
        });

        return found;
    }

    // 检查下一页
    function checkNextPage() {
        if (courseSelectionStopped) return;

        console.log("正在检查下一页...");

        // 多种下一页按钮选择器
        const nextSelectors = [
            '#DataTables_Table_0_next:not(.disabled) a',
            '.dataTables_paginate .paginate_button.next:not(.disabled) a',
            '.paginate_button.next:not(.disabled)',
            '#DataTables_Table_0_next:not(.disabled)',
            '.next:not(.disabled)'
        ];

        let nextButton = null;

        for (const selector of nextSelectors) {
            nextButton = document.querySelector(selector);
            if (nextButton) {
                console.log(`找到下一页按钮，选择器: ${selector}`);
                break;
            }
        }

        if (nextButton) {
            console.log("点击下一页按钮");
            nextButton.click();

            // 等待页面加载完成后继续搜索
            setTimeout(() => {
                if (!courseSelectionStopped) {
                    console.log("继续搜索下一页...");
                    searchInProgress = false;
                    searchCourses();
                }
            }, 300);
        } else {
            console.log("未找到下一页按钮，可能已到最后一页");

            // 检查分页信息
            const pageInfo = document.querySelector('.dataTables_info');
            if (pageInfo) {
                console.log("分页信息:", pageInfo.textContent);
            }

            // 检查所有可能的分页按钮
            const allPagButtons = document.querySelectorAll('.paginate_button');
            console.log(`找到 ${allPagButtons.length} 个分页按钮`);
            allPagButtons.forEach((btn, index) => {
                console.log(`按钮 ${index + 1}: ${btn.textContent.trim()}, 类名: ${btn.className}`);
            });

            console.log("已搜索完所有页面，未找到目标课程");
            searchInProgress = false;
        }
    }

    // 主程序入口
    function main() {
        // 检查是否已完成选课
        if (isSelectionCompleted()) {
            console.log("⏹️ 选课已完成，脚本已停止运行");
            console.log("💡 如需重新运行脚本，请在控制台执行: resetSelectionStatus()");

            // 暴露重置函数给全局
            window.resetSelectionStatus = resetSelectionStatus;
            return;
        }

        // 第一步：进入选课流程
        if (pathname === '/jsxsd/xsxk/xklc_list') {
            if (courseSelectionStopped) return;

            let refreshCount = 0;
            const maxRefresh = 100000000000000000000000000000000000;
            const refreshInterval = 300;

            function checkForButton() {
                if (courseSelectionStopped) return;

                const button = document.querySelector('#jrxk');
                if (button) {
                    console.log("第一步：找到按钮，点击进入选课");
                    button.click();
                } else {
                    refreshCount++;
                    if (refreshCount < maxRefresh) {
                        console.log(`第 ${refreshCount} 次未找到按钮，3秒后刷新页面...`);
                        setTimeout(() => {
                            if (!courseSelectionStopped) {
                                location.reload();
                            }
                        }, refreshInterval);
                    } else {
                        console.log("已达到最大刷新次数，停止刷新");
                    }
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkForButton);
            } else {
                checkForButton();
            }
        }
        // 第二步：进入选课页面
        else if (pathname.startsWith('/jsxsd/xsxk/xklc_view')) {
            if (courseSelectionStopped) return;

            waitForElementFast('input[value=" 进入选课 "]', button => {
                console.log("第二步：点击按钮");
                button.click();
            });
        }
        // 第三步：选择选课类型
        else if (pathname.startsWith('/jsxsd/xsxk/xsxk_index')) {
            if (courseSelectionStopped) return;

            const targetButton = optionMapping[selectedOption];
            if (!targetButton) {
                console.error("第三步：无效的 selectedOption 值");
                return;
            }
            waitForElementFast('#topmenu', menu => {
                const buttons = menu.querySelectorAll('a');
                buttons.forEach(button => {
                    if (button.textContent.trim() === targetButton) {
                        button.click();
                        console.log("第三步：点击按钮 - " + targetButton);
                    }
                });
            });
        }
        // 第四步：执行选课操作
        else if (pathname === '/jsxsd/xsxkkc/comeInGgxxkxk' || pathname === '/jsxsd/xsxkkc/comeInBxxk') {
            if (courseSelectionStopped) return;

            if (executeStepFour) {
                console.log("第四步：开始执行选课...");

                // 检查是否有有效的课程配置
                const hasValidCourse = targetCourses.some(course =>
                    course.courseName || course.className || course.teacher || course.time
                );

                if (!hasValidCourse) {
                    console.error("请至少配置一个搜索条件：课程名、合班名称、上课老师或上课时间！");
                    return;
                }

                // 重写 confirm 函数自动确认
                window.confirm = () => true;

                // 保留原始 alert 函数
                const originalAlert = window.alert;
                window.alert = function (msg) {
                    if (msg.includes("选课成功")) {
                        console.log("选课成功:", msg);
                        markSelectionCompleted();
                        courseSelectionStopped = true;
                        originalAlert(msg);
                    } else {
                        console.log("提示:", msg);
                        originalAlert(msg);
                    }
                };

                startCourseSelection();
                isStepFourExecuted = true;
            }
        }
    }

    // 启动主程序
    main();
})();