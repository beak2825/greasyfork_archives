// ==UserScript==
// @name         北京航空航天大学（北航）研究生选课人数显示
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  通过直接调用官方API获取数据，并修正任务调度逻辑，确保所有课程都能被正确查询。
// @author       理亏亏
// @match        https://yjsxk.buaa.edu.cn/yjsxkapp/sys/xsxkappbuaa/course.html
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547692/%E5%8C%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%EF%BC%88%E5%8C%97%E8%88%AA%EF%BC%89%E7%A0%94%E7%A9%B6%E7%94%9F%E9%80%89%E8%AF%BE%E4%BA%BA%E6%95%B0%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/547692/%E5%8C%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%EF%BC%88%E5%8C%97%E8%88%AA%EF%BC%89%E7%A0%94%E7%A9%B6%E7%94%9F%E9%80%89%E8%AF%BE%E4%BA%BA%E6%95%B0%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .course-info-display { margin-left: 10px; font-weight: bold; font-size: 0.9em; white-space: nowrap; }
        .course-info-display.error { color: red; }
        .course-info-display.success { color: green; }
        .course-info-display.loading { color: gray; }
    `);

    const API_BASE_URL = 'https://yjsxk.buaa.edu.cn/yjsxkapp/sys/xsxkappbuaa/xsxkCourse/loadAllCourseInfo.do';

    let currentSemesterId = '20251';
    const semesterInput = document.querySelector('input[name="xnxq"]#xnxq');
    if (semesterInput && semesterInput.value) {
        currentSemesterId = semesterInput.value;
        console.log(`成功动态获取到当前学期ID: ${currentSemesterId}`);
    } else {
        console.warn(`未能动态获取当前学期ID，将使用后备值: ${currentSemesterId}`);
    }

    const courseQuerier = {
        taskQueue: [],
        isWorking: false,

        // ★ 修复点 1: 移除 this.start()
        addTask(courseCode, fullCourseName, linkElement) {
            this.taskQueue.push({ courseCode, fullCourseName, linkElement });
            displayCourseInfo(linkElement, '排队中...', '', false, true);
            // this.start(); // <-- 移除这一行
        },

        async start() {
            if (this.isWorking || this.taskQueue.length === 0) return;
            this.isWorking = true;

            const tasks = [...this.taskQueue];
            this.taskQueue = [];

            await Promise.all(tasks.map(async (task) => {
                displayCourseInfo(task.linkElement, '查询中...', '', false, true);
                const { capacity, selected } = await this.queryWithAPI(task);

                setTimeout(() => {
                    const isQueryError = selected.includes('失败') || selected.includes('出错') || selected.includes('匹配');
                    displayCourseInfo(task.linkElement, capacity, selected, isQueryError);
                }, 0);
            }));

            console.log("所有查询任务已完成。");
            this.isWorking = false;
        },

        queryWithAPI(task) {
            const { courseCode, fullCourseName } = task;
            const logPrefix = `[${fullCourseName}]`;

            return new Promise((resolve) => {
                const apiUrl = `${API_BASE_URL}?_=${Date.now()}`;
                const formData = new URLSearchParams();
                formData.append('query_keyword', courseCode);
                formData.append('query_xnxq', currentSemesterId);
                formData.append('query_kkyx', '');
                formData.append('query_kksx', '');
                formData.append('fixedAutoSubmitBug', '');
                formData.append('query_jxsjhnkc', '0');
                formData.append('query_jxsfankc', '0');
                formData.append('pageIndex', '1');
                formData.append('pageSize', '20');
                formData.append('sortField', '');
                formData.append('sortOrder', '');

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiUrl,
                    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                    data: formData.toString(),
                    timeout: 10000,
                    onload: function(response) {
                        try {
                            if (response.status !== 200) throw new Error(`HTTP状态码: ${response.status}`);
                            const result = JSON.parse(response.responseText);
                            const courses = result.datas || [];
                            for (const course of courses) {
                                const reconstructedFullName = `${course.KCDM}-${course.KCMC}（${course.BJMC}）`;
                                if (reconstructedFullName === fullCourseName) {
                                    console.log(`成功精确匹配到课程 ${logPrefix} 的信息。`);
                                    resolve({ capacity: course.KXRS, selected: `${course.YXXKJGRS}人` });
                                    return;
                                }
                            }
                            console.warn(`API查询成功，但在结果中未精确匹配到课程 ${logPrefix}。`);
                            resolve({ capacity: 'N/A', selected: '未精确匹配' });
                        } catch (error) {
                            console.error(`解析课程 ${logPrefix} 的API响应失败:`, error, response.responseText);
                            resolve({ capacity: 'N/A', selected: '解析失败' });
                        }
                    },
                    onerror: function(error) {
                        console.error(`请求课程 ${logPrefix} 的API时发生网络错误:`, error);
                        resolve({ capacity: 'N/A', selected: '网络错误' });
                    },
                    ontimeout: function() {
                        console.error(`请求课程 ${logPrefix} 的API超时。`);
                        resolve({ capacity: 'N/A', selected: '请求超时' });
                    }
                });
            });
        }
    };

    function displayCourseInfo(linkElement, capacity, selected, isError = false, isLoading = false) {
        let infoSpan = linkElement.nextElementSibling;
        if (!infoSpan || !infoSpan.classList.contains('course-info-display')) {
            infoSpan = document.createElement('span');
            infoSpan.classList.add('course-info-display');
            linkElement.after(infoSpan);
        }
        infoSpan.classList.remove('error', 'success', 'loading');
        if (isLoading) {
            infoSpan.classList.add('loading');
            infoSpan.innerText = ` (${capacity})`;
        } else if (isError) {
            infoSpan.classList.add('error');
            infoSpan.innerText = ` (${selected})`;
        } else {
            infoSpan.classList.add('success');
            infoSpan.innerText = ` (容量: ${capacity}, 已选: ${selected})`;
        }
    }

    // ★ 修复点 2: 在循环结束后调用 start()
    function processCourses() {
        const courseLinks = document.querySelectorAll('td.yxkc a[role-kcdm]:not(.processed)');
        if (courseLinks.length === 0) return;

        console.log(`找到 ${courseLinks.length} 门新课程，添加到查询队列...`);
        courseLinks.forEach(linkElement => {
            linkElement.classList.add('processed');
            const courseCode = linkElement.getAttribute('role-kcdm');
            const fullCourseName = linkElement.innerText.trim();
            if (courseCode && fullCourseName) {
                courseQuerier.addTask(courseCode, fullCourseName, linkElement);
            }
        });

        // 所有任务都添加完毕后，统一启动一次处理
        courseQuerier.start();
    }

    function setupMutationObserver() {
        const observer = new MutationObserver(processCourses);
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("主页面 MutationObserver 已启动。");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            processCourses();
            setupMutationObserver();
        });
    } else {
        processCourses();
        setupMutationObserver();
    }
})();