// ==UserScript==
// @name         理工学堂助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动化理工学堂，让学习更轻松！✨自动提交作业、导出题目和跟踪进度，一站式搞定所有任务，提高效率，让你专注学习🚀
// @author       Yi
// @match        http://lgxt.wutp.com.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://unpkg.com/docx@7.1.0/build/index.js
// @icon         http://lgxt.wutp.com.cn/favicon.8de18.ico
// @homepageURL https://github.com/zygame1314/LGXT-Assistant
// @supportURL https://zygame1314.github.io/LGXT-Assistant/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512465/%E7%90%86%E5%B7%A5%E5%AD%A6%E5%A0%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/512465/%E7%90%86%E5%B7%A5%E5%AD%A6%E5%A0%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const baseURL = "http://lgxt.wutp.com.cn/api";
    const headers = {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
    };

    GM_addStyle(`
        #lgxt-widget {
            position: fixed;
            bottom: 0;
            right: 0;
            width: 100%;
            max-height: 80%;
            background-color: #ffffff;
            border-radius: 12px 12px 0 0;
            font-family: 'Microsoft YaHei', sans-serif;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            animation: slideUp 0.5s ease-in-out;
        }
        #refresh-login-btn {
            background-color: #4a90e2;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
            font-weight: bold;
            font-family: 'Microsoft YaHei', sans-serif;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        #refresh-login-btn:hover {
            background-color: #357ABD;
            transform: translateY(-2px);
        }
        #refresh-login-btn:active {
            background-color: #2c6aa6;
            transform: translateY(0);
        }
        #widget-header {
            background-color: #4a90e2;
            color: #fff;
            padding: 15px;
            font-size: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        #widget-header h3 {
            margin: 0;
            font-weight: bold;
        }
        #widget-toggle {
            transition: transform 0.3s ease;
        }
        #widget-toggle.rotated {
            transform: rotate(180deg);
        }
        #widget-content {
            max-height: 0;
            opacity: 0;
            overflow: auto;
            transition: max-height 0.5s ease, opacity 0.5s ease;
            flex: 1;
        }
        #widget-content.expanded {
            max-height: calc(100vh - 70px);
            opacity: 1;
            overflow-y: auto;
            scrollbar-color: #4a90e2 #f1f1f1;
            scrollbar-width: thin;
        }
        .arrow {
            display: inline-block;
            transition: transform 0.3s ease;
        }
        .arrow.rotated {
            transform: rotate(180deg);
        }
        #main-content {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .panel {
            margin: 10px;
            background-color: #f8f9fa;
            border-radius: 8px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        .collapsible-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            background-color: #e9ecef;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .collapsible-header h4 {
            margin: 0;
            font-size: 16px;
            color: #495057;
            font-weight: bold;
            font-family: 'Microsoft YaHei', sans-serif;
        }
        .collapsible-header > div {
            display: flex;
            align-items: center;
        }
        .button-collapse {
            background: none;
            border: none;
            color: #4a90e2;
            font-size: 14px;
            cursor: pointer;
            padding: 0;
            outline: none;
            font-weight: bold;
            font-family: 'Microsoft YaHei', sans-serif;
            transition: color 0.3s ease, transform 0.2s ease;
        }
        .button-collapse:hover {
            color: #357ABD;
            transform: translateY(-2px);
        }
        .collapsible-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease, opacity 0.5s ease;
            opacity: 0;
        }
        .collapsible-content.expanded {
            max-height: 1000px;
            opacity: 1;
        }
        .course-item, .work-item {
            padding: 12px 15px;
            border-bottom: 1px solid #e9ecef;
            transition: background-color 0.2s ease;
        }
        .course-item > div, .work-item > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            flex-wrap: wrap;
        }
        .course-item > div span, .work-item > div span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 70%;
            font-size: 14px;
            color: #495057;
            font-weight: bold;
        }
        .status {
            font-size: 12px;
            padding: 3px 8px;
            border-radius: 12px;
            background-color: #dc3545;
            color: white;
            transition: background-color 0.2s ease;
            font-weight: bold;
            margin-top: 5px;
        }
        .status.completed {
            background-color: #28a745;
        }
        .course-buttons {
            display: flex;
            gap: 10px;
            margin-left: auto;
        }

        .submit-100-btn, .submit-all-btn, .submit-all-courses-btn {
            background-color: #f39c12;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.2s ease;
            outline: none;
            font-family: 'Microsoft YaHei', sans-serif;
            font-weight: bold;
            margin-top: 5px;
        }
        .submit-100-btn:hover, .submit-all-btn:hover, .submit-all-courses-btn:hover {
            background-color: #e67e22;
            transform: translateY(-2px);
        }
        .submit-100-btn:disabled, .submit-all-btn:disabled, .submit-all-courses-btn:disabled {
            background-color: #adb5bd;
            cursor: not-allowed;
        }

        .load-works-btn {
            background-color: #2ecc71;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.2s ease;
            outline: none;
            font-family: 'Microsoft YaHei', sans-serif;
            font-weight: bold;
            margin-top: 5px;
        }
        .load-works-btn:hover {
            background-color: #27ae60;
            transform: translateY(-2px);
        }

        .export-questions-btn, .export-all-works-btn, .export-all-courses-btn {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.2s ease;
            outline: none;
            font-family: 'Microsoft YaHei', sans-serif;
            font-weight: bold;
            margin-top: 5px;
        }
        .export-questions-btn:hover, .export-all-works-btn:hover, .export-all-courses-btn:hover {
            background-color: #2980b9;
            transform: translateY(-2px);
        }
        .export-questions-btn:disabled, .export-all-works-btn:disabled, .export-all-courses-btn:disabled {
            background-color: #adb5bd;
            cursor: not-allowed;
        }

        #login-prompt {
            padding: 20px;
            text-align: center;
            color: #495057;
        }
        #login-prompt p {
            margin: 0 0 15px 0;
            font-size: 16px;
            font-weight: bold;
        }
        #login-prompt button {
            background-color: #4a90e2;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.2s ease;
            font-weight: bold;
        }
        #login-prompt button:hover {
            background-color: #357ABD;
            transform: translateY(-2px);
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(100%); }
            to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background: #4a90e2;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        #progress-bar {
            display: flex;
            margin: 10px;
            height: 20px;
        }
        .progress-block {
            flex: 1;
            margin: 0 2px;
            background-color: #e9ecef;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        .progress-block.success {
            background-color: #28a745;
        }
        .progress-block.failure {
            background-color: #dc3545;
        }
        #status-message {
            padding: 10px;
            color: #495057;
            background-color: #e9ecef;
            border-radius: 6px;
            margin: 10px;
            font-size: 14px;
            font-weight: bold;
        }
        @media (min-width: 768px) {
            #lgxt-widget {
                width: 450px;
                right: 20px;
                bottom: 20px;
                border-radius: 12px;
            }
            #widget-content.expanded {
                max-height: 800px;
            }
            .course-item > div span, .work-item > div span {
                max-width: 200px;
            }
        }
    `);

    const createUI = () => {
        const container = document.createElement("div");
        container.id = "lgxt-widget";
        container.innerHTML = `
            <div id="widget-header">
                <h3>理工学堂助手</h3>
                <span id="widget-toggle" class="arrow">▼</span>
            </div>
            <div id="widget-content">
                <div id="status-message" style="display:none;"></div>
                <div id="main-content">
                    <div id="course-panel" class="panel">
                        <div id="course-header" class="collapsible-header">
                            <h4>课程列表</h4>
                            <button id="collapse-course-btn" class="button-collapse">收起 ▲</button>
                        </div>
                        <div id="course-list" class="collapsible-content expanded"></div>
                        <div id="submit-all-courses-container" style="padding: 10px; text-align: center;">
                            <button id="submit-all-courses-btn" class="submit-all-courses-btn">一键提交所有课程作业100分</button>
                            <button id="export-all-courses-btn" class="export-all-courses-btn" style="margin-left: 10px;">导出所有课程作业</button>
                        </div>
                    </div>
                    <div id="work-panel" class="panel">
                        <div id="work-header" class="collapsible-header">
                            <h4>作业列表</h4>
                            <button id="collapse-work-btn" class="button-collapse">收起 ▲</button>
                        </div>
                        <div id="work-list" class="collapsible-content expanded"></div>
                        <div id="submit-all-container" style="padding: 10px; text-align: center;">
                            <button id="submit-all-btn" class="submit-all-btn">一键提交当前课程作业100分</button>
                        </div>
                    </div>
                </div>
                <div id="login-prompt" style="display:none;">
                    <p>请先登录。</p>
                    <button id="refresh-login-btn">刷新登录状态</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        const widgetHeader = document.getElementById("widget-header");
        const widgetContent = document.getElementById("widget-content");
        const widgetToggle = document.getElementById("widget-toggle");

        widgetContent.classList.remove("expanded");

        widgetHeader.addEventListener("click", () => {
            if (widgetContent.classList.contains("expanded")) {
                widgetContent.classList.remove("expanded");
                widgetToggle.classList.remove("rotated");
            } else {
                widgetContent.classList.add("expanded");
                widgetToggle.classList.add("rotated");
            }
        });

        const toggleCollapse = (contentId, button) => {
            const content = document.getElementById(contentId);
            content.classList.toggle("expanded");
            if (content.classList.contains("expanded")) {
                button.textContent = "收起 ▲";
            } else {
                button.textContent = "展开 ▼";
            }
        };

        document.getElementById("course-header").addEventListener("click", () => {
            const button = document.getElementById("collapse-course-btn");
            toggleCollapse("course-list", button);
        });

        document
            .getElementById("collapse-course-btn")
            .addEventListener("click", (e) => {
                e.stopPropagation();
                const button = document.getElementById("collapse-course-btn");
                toggleCollapse("course-list", button);
            });

        document.getElementById("work-header").addEventListener("click", () => {
            const button = document.getElementById("collapse-work-btn");
            toggleCollapse("work-list", button);
        });

        document
            .getElementById("collapse-work-btn")
            .addEventListener("click", (e) => {
                e.stopPropagation();
                const button = document.getElementById("collapse-work-btn");
                toggleCollapse("work-list", button);
            });

        document
            .getElementById("refresh-login-btn")
            .addEventListener("click", () => {
                checkLoginStatus();
            });

        document.getElementById("submit-all-btn").addEventListener("click", () => {
            submitAllAnswers();
        });

        document.getElementById("submit-all-courses-btn").addEventListener("click", () => {
            submitAllCoursesAnswers();
        });

        document.getElementById("export-all-courses-btn").addEventListener("click", () => {
            exportAllCoursesWorks();
        });

        checkLoginStatus();
        interceptLoginResponse();
    };

    const interceptLoginResponse = () => {
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            this._url = url;
            return originalXHROpen.apply(this, arguments);
        };

        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            this.addEventListener(
                "readystatechange",
                function () {
                    if (this.readyState === 4 && this.status === 200) {
                        if (this._url.includes("/api/login")) {
                            const response = this.responseText;
                            try {
                                const result = JSON.parse(response);
                                if (result.code === 0 && result.data) {
                                    const token = result.data;
                                    GM_setValue("token", token);
                                    showNotification("登录成功，已获取凭证！", "success");
                                    checkLoginStatus();
                                }
                            } catch (e) {
                                console.error("解析登录响应出错", e);
                            }
                        }
                    }
                },
                false
            );
            return originalXHRSend.apply(this, arguments);
        };
    };

    const checkLoginStatus = () => {
        const myCoursesUrl = `${baseURL}/myCourses`;

        const requestHeaders = {
            ...headers,
        };
        const token = GM_getValue("token", "");
        if (token) {
            requestHeaders.Authorization = token;
        } else {
            document.getElementById("main-content").style.display = "none";
            document.getElementById("login-prompt").style.display = "block";
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: myCoursesUrl,
            headers: requestHeaders,
            onload: (response) => {
                const result = JSON.parse(response.responseText);
                if (result.code === 0) {
                    document.getElementById("main-content").style.display = "block";
                    document.getElementById("login-prompt").style.display = "none";
                    getMyCourses();
                } else {
                    showNotification("登录失效，请重新登录！", "error");
                    GM_setValue("token", "");
                    document.getElementById("main-content").style.display = "none";
                    document.getElementById("login-prompt").style.display = "block";
                }
            },
            onerror: (error) => {
                showNotification("网络错误，请检查！", "error");
                console.error(error);
            },
        });
    };

    const getMyCourses = () => {
        const myCoursesUrl = `${baseURL}/myCourses`;

        const requestHeaders = {
            ...headers,
        };
        const token = GM_getValue("token", "");
        if (token) {
            requestHeaders.Authorization = token;
        } else {
            showNotification("未检测到登录信息，请先登录！", "error");
            document.getElementById("main-content").style.display = "none";
            document.getElementById("login-prompt").style.display = "block";
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: myCoursesUrl,
            headers: requestHeaders,
            onload: (response) => {
                const result = JSON.parse(response.responseText);
                if (result.code === 0) {
                    const courses = result.data;
                    displayCourses(courses);
                } else {
                    showNotification("获取课程失败：" + result.msg, "error");
                    document.getElementById("main-content").style.display = "none";
                    document.getElementById("login-prompt").style.display = "block";
                }
            },
            onerror: (error) => {
                showNotification("网络错误，请检查！", "error");
                console.error(error);
            },
        });
    };

    const getMyCoursesAsync = () => {
        return new Promise((resolve, reject) => {
            const myCoursesUrl = `${baseURL}/myCourses`;

            const requestHeaders = {
                ...headers,
            };
            const token = GM_getValue("token", "");
            if (token) {
                requestHeaders.Authorization = token;
            } else {
                showNotification("未检测到登录信息，请先登录！", "error");
                document.getElementById("main-content").style.display = "none";
                document.getElementById("login-prompt").style.display = "block";
                reject(new Error("未登录"));
                return;
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: myCoursesUrl,
                headers: requestHeaders,
                onload: (response) => {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0) {
                        const courses = result.data;
                        resolve(courses);
                    } else {
                        showNotification("获取课程失败：" + result.msg, "error");
                        reject(new Error("获取课程失败"));
                    }
                },
                onerror: (error) => {
                    showNotification("网络错误，请检查！", "error");
                    console.error(error);
                    reject(error);
                },
            });
        });
    };

    const displayCourses = (courses) => {
        const courseList = document.getElementById("course-list");
        courseList.innerHTML = "";

        courses.forEach((course) => {
            const courseItem = document.createElement("div");
            courseItem.className = "course-item";
            courseItem.innerHTML = `
            <div>
                <span title="${course.courseName}">${course.courseName}</span>
                <div class="course-buttons">
                    <button class="load-works-btn" data-course-id="${course.courseId}">查看作业</button>
                    <button class="export-all-works-btn" data-course-id="${course.courseId}">导出所有作业</button>
                </div>
            </div>
        `;
            courseList.appendChild(courseItem);
        });

        document.querySelectorAll(".load-works-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const courseId = e.target.getAttribute("data-course-id");
                getCourseWorks(courseId);
            });
        });

        document.querySelectorAll(".export-all-works-btn").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const courseId = e.target.getAttribute("data-course-id");
                await exportAllWorks(courseId);
            });
        });
    };

    let currentWorks = [];

    const getCourseWorks = (courseId) => {
        const myCourseWorksUrl = `${baseURL}/myCourseWorks`;
        const data = `courseId=${courseId}`;

        const requestHeaders = {
            ...headers,
        };
        const token = GM_getValue("token", "");
        if (token) {
            requestHeaders.Authorization = token;
        } else {
            showNotification("未检测到登录信息，请先登录！", "error");
            document.getElementById("main-content").style.display = "none";
            document.getElementById("login-prompt").style.display = "block";
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: myCourseWorksUrl,
            headers: requestHeaders,
            data: data,
            onload: (response) => {
                const result = JSON.parse(response.responseText);
                if (result.code === 0) {
                    const works = result.data;
                    currentWorks = works;
                    displayWorks(works);

                    const courseListContent = document.getElementById("course-list");
                    const collapseCourseButton = document.getElementById("collapse-course-btn");
                    courseListContent.classList.remove("expanded");
                    collapseCourseButton.textContent = "展开 ▼";

                    const workListContent = document.getElementById("work-list");
                    const collapseWorkButton = document.getElementById("collapse-work-btn");
                    workListContent.classList.add("expanded");
                    collapseWorkButton.textContent = "收起 ▲";
                } else {
                    showNotification("获取作业失败：" + result.msg, "error");
                }
            },
            onerror: (error) => {
                showNotification("网络错误，请检查！", "error");
                console.error(error);
            },
        });
    };

    async function exportAllWorks(courseId) {
        try {
            const works = await getCourseWorksAsync(courseId);
            if (works.length === 0) {
                showNotification("当前课程没有可导出的作业。", "error");
                return;
            }

            for (const work of works) {
                await exportQuestions(work.workId, work.workName);
            }

            showNotification("所有作业已成功导出！", "success");
        } catch (error) {
            console.error("导出作业时出错：", error);
            showNotification("导出作业时出现错误，请检查网络或稍后重试。", "error");
        }
    }

    const getCourseWorksAsync = (courseId) => {
        return new Promise((resolve, reject) => {
            const myCourseWorksUrl = `${baseURL}/myCourseWorks`;
            const data = `courseId=${courseId}`;

            const requestHeaders = {
                ...headers,
            };
            const token = GM_getValue("token", "");
            if (token) {
                requestHeaders.Authorization = token;
            } else {
                showNotification("未检测到登录信息，请先登录！", "error");
                document.getElementById("main-content").style.display = "none";
                document.getElementById("login-prompt").style.display = "block";
                reject(new Error("未登录"));
                return;
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: myCourseWorksUrl,
                headers: requestHeaders,
                data: data,
                onload: (response) => {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0) {
                        const works = result.data;
                        resolve(works);
                    } else {
                        showNotification("获取作业失败：" + result.msg, "error");
                        reject(new Error("获取作业失败"));
                    }
                },
                onerror: (error) => {
                    showNotification("网络错误，请检查！", "error");
                    console.error(error);
                    reject(error);
                },
            });
        });
    };

    async function exportAllCoursesWorks() {
        try {
            const exportAllCoursesBtn = document.getElementById("export-all-courses-btn");
            exportAllCoursesBtn.disabled = true;
            exportAllCoursesBtn.textContent = "导出中...";

            const courses = await getMyCoursesAsync();
            let successCount = 0;
            let failureCount = 0;

            for (const course of courses) {
                try {
                    const works = await getCourseWorksAsync(course.courseId);

                    if (!works || works.length === 0) {
                        throw new Error(`课程 "${course.courseName}" 没有作业或获取作业失败`);
                    }

                    for (const work of works) {
                        await exportQuestions(work.workId, work.workName);
                    }

                    successCount++;
                    showNotification(`课程 "${course.courseName}" 的作业导出成功。`, "success");

                } catch (error) {
                    console.error(`导出课程 "${course.courseName}" 的作业失败:`, error);
                    failureCount++;
                    showNotification(`课程 "${course.courseName}" 的作业导出失败。`, "error");
                }
            }

            if (successCount > 0 && failureCount === 0) {
                showNotification("所有课程作业已成功导出！", "success");
            } else if (successCount > 0 && failureCount > 0) {
                showNotification(`部分课程作业导出成功。成功: ${successCount}, 失败: ${failureCount}`, "error");
            } else {
                showNotification("所有课程作业导出失败，请检查网络或稍后重试。", "error");
            }

        } catch (error) {
            console.error("导出所有课程作业时出错：", error);
            showNotification("导出所有课程作业时出错，请稍后重试。", "error");
        } finally {
            const exportAllCoursesBtn = document.getElementById("export-all-courses-btn");
            exportAllCoursesBtn.disabled = false;
            exportAllCoursesBtn.textContent = "导出所有课程作业";
        }
    }

    const displayWorks = (works) => {
        const workList = document.getElementById("work-list");
        workList.innerHTML = "";

        works.forEach((work) => {
            const workItem = document.createElement("div");
            workItem.className = "work-item";

            const isCompleted =
                work.times >= work.tryTimes ||
                (work.grade !== null && work.grade >= 60);
            const statusClass = isCompleted ? "completed" : "";
            const gradeText = work.grade !== null ? `分数：${work.grade}` : "";
            workItem.innerHTML = `
                <div>
                    <span title="${work.workName}">${work.workName}</span>
                    <span>(${work.times}/${work.tryTimes} 次)</span>
                </div>
                <div>
                    <div style="display:flex; align-items:center; flex-wrap:wrap;">
                        <span class="status ${statusClass}">${isCompleted ? "已完成" : "未完成"}</span>
                        <span class="grade-text" style="margin-left: 8px;">${gradeText}</span>
                    </div>
                    <div style="margin-top: 5px;">
                        <button class="submit-100-btn" data-work-id="${work.workId}">
                            提交100分
                        </button>
                        <button class="export-questions-btn" data-work-id="${work.workId}" data-work-name="${work.workName}" style="margin-left: 5px;">
                            导出作业
                        </button>
                    </div>
                </div>
            `;
            workList.appendChild(workItem);
        });

        document.querySelectorAll(".submit-100-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const workId = e.target.getAttribute("data-work-id");
                submitAnswer(workId, 100, e.target);
            });
        });

        document.querySelectorAll(".export-questions-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const workId = e.target.getAttribute("data-work-id");
                const workName = e.target.getAttribute("data-work-name");
                exportQuestions(workId, workName);
            });
        });
    };

    const updateStatusMessage = (message, show = true) => {
        const statusMessageElement = document.getElementById("status-message");
        statusMessageElement.textContent = message;
        statusMessageElement.style.display = show ? "block" : "none";
    };

    function getQuestions(workId) {
        return new Promise((resolve, reject) => {
            const showQuestionsUrl = `${baseURL}/showQuestions`;
            const data = `workId=${workId}`;

            const requestHeaders = {
                ...headers,
            };
            const token = GM_getValue("token", "");
            if (token) {
                requestHeaders.Authorization = token;
            } else {
                showNotification("未检测到登录信息，请先登录！", "error");
                document.getElementById("main-content").style.display = "none";
                document.getElementById("login-prompt").style.display = "block";
                resolve([]);
                return;
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: showQuestionsUrl,
                headers: requestHeaders,
                data: data,
                onload: (response) => {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0) {
                        const questions = result.data;
                        resolve(questions);
                    } else {
                        showNotification("获取题目失败：" + result.msg, "error");
                        resolve([]);
                    }
                },
                onerror: (error) => {
                    showNotification("网络错误，请检查！", "error");
                    console.error(error);
                    resolve([]);
                },
            });
        });
    }

    function downloadImage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "arraybuffer",
                onload: (response) => {
                    resolve(response.response);
                },
                onerror: (error) => {
                    console.error("下载图片失败：", error);
                    reject(error);
                },
            });
        });
    }

    async function exportQuestions(workId, workName) {
        try {
            updateStatusMessage(`开始导出作业 "${workName}" 的题目，请稍候...`);

            let collectedQuestions = {};
            let noNewQuestionsCount = 0;
            const maxIterations = 100;

            let progressBar = document.getElementById("export-progress-bar");
            if (progressBar) {
                progressBar.remove();
            }
            progressBar = document.createElement("div");
            progressBar.id = "export-progress-bar";
            progressBar.style.cssText = `
                margin: 20px auto;
                height: 30px;
                width: 80%;
                background-color: #e9ecef;
                border-radius: 15px;
                position: relative;
                overflow: hidden;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
            `;
            document.getElementById("status-message").appendChild(progressBar);

            const progressIndicator = document.createElement("div");
            progressIndicator.style.cssText = `
                height: 100%;
                background: linear-gradient(90deg, #4a90e2, #63b3ed);
                border-radius: 15px;
                width: 0%;
                transition: width 0.5s ease;
                position: relative;
                overflow: hidden;
            `;
            progressBar.appendChild(progressIndicator);

            const lightEffect = document.createElement("div");
            lightEffect.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 50px;
                background: rgba(255, 255, 255, 0.3);
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
                opacity: 0.6;
                animation: moveLight 1.5s infinite linear;
            `;
            progressIndicator.appendChild(lightEffect);

            const progressText = document.createElement("div");
            progressText.style.cssText = `
                position: absolute;
                top: 5px;
                left: 50%;
                transform: translateX(-50%);
                color: #000;
                font-weight: bold;
                font-size: 14px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-family: 'Microsoft YaHei', sans-serif;
                max-width: 90%;
            `;
            progressBar.appendChild(progressText);

            const style = document.createElement('style');
            style.textContent = `
                @keyframes moveLight {
                    0% { left: -50px; }
                    100% { left: 100%; }
                }
            `;
            document.head.appendChild(style);

            for (let i = 0; i < maxIterations; i++) {
                const questions = await getQuestions(workId);
                let newQuestionFound = false;

                for (const question of questions) {
                    const questionId = question.id;
                    if (!collectedQuestions[questionId]) {
                        collectedQuestions[questionId] = question;
                        newQuestionFound = true;
                    }
                }

                const totalQuestions = Object.keys(collectedQuestions).length;
                progressText.textContent = `已收集: ${totalQuestions} 题`;
                progressIndicator.style.width = `${Math.min((totalQuestions / 100) * 100, 100)}%`;

                if (!newQuestionFound) {
                    noNewQuestionsCount += 1;
                    if (noNewQuestionsCount >= 10) {
                        break;
                    }
                } else {
                    noNewQuestionsCount = 0;
                }
            }

            const totalQuestions = Object.keys(collectedQuestions).length;
            if (totalQuestions === 0) {
                showNotification("没有获取到题目，无法导出。", "error");
                updateStatusMessage("", false);
                return;
            }

            const { Document, Paragraph, Packer, HeadingLevel, AlignmentType, ImageRun } = window.docx;

            const doc = new Document({
                creator: "理工学堂助手",
                title: workName,
                description: "由理工学堂助手自动生成",
                sections: []
            });

            const children = [];

            children.push(
                new Paragraph({
                    text: workName,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER
                })
            );

            const sortedQuestionIds = Object.keys(collectedQuestions).sort((a, b) => a - b);
            for (let i = 0; i < sortedQuestionIds.length; i++) {
                const questionId = sortedQuestionIds[i];
                const question = collectedQuestions[questionId];
                const name = question.name || "N/A";
                const answer = question.answer || "N/A";
                const imgurl = question.imgurl;

                children.push(
                    new Paragraph({
                        text: `题目 ${i + 1}: ${name}`,
                        heading: HeadingLevel.HEADING_2
                    })
                );

                if (imgurl) {
                    try {
                        const imageData = await downloadImage(imgurl);
                        const imageBlob = new Blob([imageData], { type: 'image/png' });

                        const img = await new Promise((resolve, reject) => {
                            const img = new Image();
                            img.onload = () => resolve(img);
                            img.onerror = (err) => reject(err);
                            img.src = URL.createObjectURL(imageBlob);
                        });

                        const originalWidth = img.width;
                        const originalHeight = img.height;

                        const maxWidth = 500;
                        const maxHeight = 500;

                        let width = originalWidth;
                        let height = originalHeight;

                        if (width > maxWidth || height > maxHeight) {
                            const widthRatio = maxWidth / width;
                            const heightRatio = maxHeight / height;
                            const scale = Math.min(widthRatio, heightRatio);
                            width = width * scale;
                            height = height * scale;
                        }

                        const imageDataUrl = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(imageBlob);
                        });

                        const image = new ImageRun({
                            data: imageDataUrl,
                            transformation: {
                                width: width,
                                height: height
                            }
                        });

                        children.push(
                            new Paragraph({
                                children: [image],
                                alignment: AlignmentType.CENTER
                            })
                        );
                    } catch (error) {
                        children.push(
                            new Paragraph(`无法下载或处理图片：${error.message}`)
                        );
                    }
                } else {
                    children.push(
                        new Paragraph("（无图片）")
                    );
                }

                children.push(
                    new Paragraph({
                        text: `答案：${answer}`,
                        style: "answerStyle"
                    })
                );

                progressText.textContent = `正在导出第 ${i + 1}/${totalQuestions} 道题目`;
                progressIndicator.style.width = `${Math.min(((i + 1) / totalQuestions) * 100, 100)}%`;
            }

            doc.addSection({
                properties: {},
                children: children
            });

            const blob = await Packer.toBlob(doc);

            window.saveAs(blob, `${workName}.docx`);
            showNotification(`成功导出作业 "${workName}" 的题目，共 ${totalQuestions} 道！`, "success");
            updateStatusMessage("", false);
        } catch (error) {
            console.error(error);
            showNotification("导出过程中出现错误：" + error.message, "error");
            updateStatusMessage("", false);
        }
    }

    function submitAnswer(workId, grade, button) {
        return new Promise((resolve, reject) => {
            const submitAnswerUrl = `${baseURL}/submitAnswer`;
            const data = `workId=${workId}&grade=${grade}`;

            const requestHeaders = {
                ...headers,
            };
            const token = GM_getValue("token", "");
            if (token) {
                requestHeaders.Authorization = token;
            } else {
                showNotification("未检测到登录信息，请先登录！", "error");
                document.getElementById("main-content").style.display = "none";
                document.getElementById("login-prompt").style.display = "block";
                reject(new Error("未登录"));
                return;
            }

            if (button) {
                button.disabled = true;
                button.textContent = "提交中...";
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: submitAnswerUrl,
                headers: requestHeaders,
                data: data,
                onload: (response) => {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0) {
                        showNotification(`提交成功，成绩：${grade}`, "success");
                        if (button) {
                            button.textContent = "提交100分";
                            button.disabled = false;

                            const gradeSpan = button.closest(".work-item").querySelector(".grade-text");
                            gradeSpan.textContent = `分数：${grade}`;

                            const statusElem = button.closest(".work-item").querySelector(".status");
                            statusElem.classList.add("completed");
                            statusElem.textContent = "已完成";

                            const timesSpan = button.closest(".work-item").querySelector("div > span:nth-child(2)");
                            const timesText = timesSpan.textContent.match(/\d+/g);
                            let currentTimes = parseInt(timesText[0]);
                            let maxTimes = parseInt(timesText[1]);
                            currentTimes = Math.min(currentTimes + 1, maxTimes);
                            timesSpan.textContent = `(${currentTimes}/${maxTimes} 次)`;
                        }
                        resolve();
                    } else {
                        showNotification("提交失败：" + result.msg, "error");
                        if (button) {
                            button.disabled = false;
                            button.textContent = "提交100分";
                        }
                        reject(new Error(result.msg));
                    }
                },
                onerror: (error) => {
                    showNotification("网络错误，请检查！", "error");
                    console.error(error);
                    if (button) {
                        button.disabled = false;
                        button.textContent = "提交100分";
                    }
                    reject(new Error("网络错误"));
                },
            });
        });
    }

    function submitAnswerAsync(workId, grade) {
        return new Promise((resolve, reject) => {
            const submitAnswerUrl = `${baseURL}/submitAnswer`;
            const data = `workId=${workId}&grade=${grade}`;

            const requestHeaders = {
                ...headers,
            };
            const token = GM_getValue("token", "");
            if (token) {
                requestHeaders.Authorization = token;
            } else {
                showNotification("未检测到登录信息，请先登录！", "error");
                document.getElementById("main-content").style.display = "none";
                document.getElementById("login-prompt").style.display = "block";
                reject(new Error("未登录"));
                return;
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: submitAnswerUrl,
                headers: requestHeaders,
                data: data,
                onload: (response) => {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0) {
                        resolve();
                    } else {
                        showNotification("提交失败：" + result.msg, "error");
                        reject(new Error(result.msg));
                    }
                },
                onerror: (error) => {
                    showNotification("网络错误，请检查！", "error");
                    console.error(error);
                    reject(new Error("网络错误"));
                },
            });
        });
    }

    async function submitAllAnswers() {
        const buttons = document.querySelectorAll(".submit-100-btn");
        const totalWorks = buttons.length;

        if (totalWorks === 0) {
            showNotification("没有可提交的作业！", "error");
            return;
        }

        let progressBar = document.getElementById("progress-bar");
        if (progressBar) {
            progressBar.remove();
        }
        progressBar = document.createElement("div");
        progressBar.id = "progress-bar";
        document.getElementById("submit-all-container").appendChild(progressBar);

        const progressBlocks = [];
        for (let i = 0; i < totalWorks; i++) {
            const block = document.createElement("div");
            block.className = "progress-block";
            progressBar.appendChild(block);
            progressBlocks.push(block);
        }

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            const workId = button.getAttribute("data-work-id");
            try {
                await submitAnswer(workId, 100, button);
                progressBlocks[i].classList.add("success");
            } catch (error) {
                console.error(`提交作业 ${workId} 失败:`, error);
                progressBlocks[i].classList.add("failure");
            }
        }
        showNotification("所有可提交的作业已完成！", "success");

        if (progressBar) {
            setTimeout(() => {
                progressBar.remove();
            }, 3000);
        }

    }

    async function submitAllCoursesAnswers() {
        try {
            const submitAllCoursesBtn = document.getElementById("submit-all-courses-btn");
            submitAllCoursesBtn.disabled = true;
            submitAllCoursesBtn.textContent = "提交中...";

            const courses = await getMyCoursesAsync();
            let allWorks = [];

            for (const course of courses) {
                try {
                    const works = await getCourseWorksAsync(course.courseId);
                    allWorks = allWorks.concat(works);
                } catch (error) {
                    console.error(`获取课程 ${course.courseName} 的作业失败:`, error);
                    showNotification(`课程 ${course.courseName} 的作业获取失败，跳过该课程。`, "error");
                }
            }

            const totalWorks = allWorks.length;

            if (totalWorks === 0) {
                showNotification("没有可提交的课程作业！", "error");
                submitAllCoursesBtn.disabled = false;
                submitAllCoursesBtn.textContent = "一键提交所有课程作业100分";
                return;
            }

            let progressBar = document.getElementById("progress-bar");
            if (progressBar) {
                progressBar.remove();
            }
            progressBar = document.createElement("div");
            progressBar.id = "progress-bar";
            document.getElementById("submit-all-courses-container").appendChild(progressBar);

            const progressBlocks = [];
            for (let i = 0; i < totalWorks; i++) {
                const block = document.createElement("div");
                block.className = "progress-block";
                progressBar.appendChild(block);
                progressBlocks.push(block);
            }

            for (let i = 0; i < allWorks.length; i++) {
                const work = allWorks[i];
                try {
                    await submitAnswerAsync(work.workId, 100);
                    progressBlocks[i].classList.add("success");
                } catch (error) {
                    console.error(`提交作业 ${work.workId} 失败:`, error);
                    progressBlocks[i].classList.add("failure");
                }
            }
            showNotification("所有可提交的课程作业已完成！", "success");
            if (progressBar) {
                setTimeout(() => {
                    progressBar.remove();
                }, 3000);
            }
        } catch (error) {
            console.error(error);
            showNotification("提交过程中出现错误：" + error.message, "error");
        } finally {
            const submitAllCoursesBtn = document.getElementById("submit-all-courses-btn");
            submitAllCoursesBtn.disabled = false;
            submitAllCoursesBtn.textContent = "一键提交所有课程作业100分";
        }
    }

    let notificationCount = 0;

    const showNotification = (message, type) => {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: ${20 + notificationCount * 60}px;
            left: 50%;
            transform: translateX(-50%) translateY(-10px);
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-weight: bold;
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s, top 0.5s ease;
            font-family: 'Microsoft YaHei', sans-serif;
        `;
        if (type === "success") {
            notification.style.backgroundColor = "#28a745";
        } else if (type === "error") {
            notification.style.backgroundColor = "#dc3545";
        } else {
            notification.style.backgroundColor = "#4a90e2";
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = "1";
            notification.style.transform = "translateX(-50%) translateY(0)";
        }, 10);

        notificationCount++;

        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateX(-50%) translateY(-10px)";

            setTimeout(() => {
                document.body.removeChild(notification);
                notificationCount--;
                updateNotificationsPosition();
            }, 300);
        }, 3000);
    };

    const updateNotificationsPosition = () => {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach((notif, index) => {
            notif.style.top = `${20 + index * 60}px`;
        });
    };

    createUI();
})();