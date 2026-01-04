// ==UserScript==
// @name         智慧树刷课脚本(增强版-优化进度显示) -by这是哪头猪？
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  智慧树自动刷课程序,支持自动获取课程信息和控制功能,优化日志显示和进度显示
// @author       Anony
// @match        https://www.learning.mil.cn/student/study
// @grant        GM_xmlhttpRequest
// @connect      armystudy.zhihuishu.com
// @connect      www.learning.mil.cn
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/516499/%E6%99%BA%E6%85%A7%E6%A0%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%28%E5%A2%9E%E5%BC%BA%E7%89%88-%E4%BC%98%E5%8C%96%E8%BF%9B%E5%BA%A6%E6%98%BE%E7%A4%BA%29%20-by%E8%BF%99%E6%98%AF%E5%93%AA%E5%A4%B4%E7%8C%AA%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/516499/%E6%99%BA%E6%85%A7%E6%A0%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%28%E5%A2%9E%E5%BC%BA%E7%89%88-%E4%BC%98%E5%8C%96%E8%BF%9B%E5%BA%A6%E6%98%BE%E7%A4%BA%29%20-by%E8%BF%99%E6%98%AF%E5%93%AA%E5%A4%B4%E7%8C%AA%EF%BC%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let courses = [];
    let currentTask = null;

    // 添加控制面板
    function addPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            width: 500px;
        `;

        const panelHTML = `
            <div style="margin-bottom: 10px;">
                <h3 style="margin: 0 0 10px 0;">智慧树课程列表</h3>
                <div id="courseList" style="max-height: 300px; overflow-y: auto;"></div>
            </div>
            <div id="currentProgress" style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px; font-size: 13px;"></div>
            <div class="log-container" style="display: flex; flex-direction: column; gap: 10px;">
                <div id="watchRecords" style="border: 1px solid #eee; border-radius: 4px; overflow: hidden;">
                    <div class="log-header" style="background: #f5f5f5; padding: 8px; font-weight: bold; display: grid; grid-template-columns: 40% 30% 30%; gap: 10px;">
                        <div>课程章节</div>
                        <div>观看进度</div>
                        <div>观看结果</div>
                    </div>
                    <div id="watchLog" style="max-height: 150px; overflow-y: auto;"></div>
                </div>
                <div id="systemLog" style="max-height: 100px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; padding: 8px;"></div>
            </div>
        `;

        panel.innerHTML = panelHTML;
        document.body.appendChild(panel);
    }

    // 更新当前进度显示
    function updateCurrentProgress(message) {
        const progressElement = document.getElementById('currentProgress');
        if (progressElement) {
            progressElement.innerHTML = `<div style="color: #1976d2;">⏳ ${message}</div>`;
        }
    }

    // 格式化观看记录
    function formatWatchRecord(chapterName, progress, result) {
        return `
            <div style="display: grid; grid-template-columns: 40% 30% 30%; gap: 10px; padding: 8px; border-bottom: 1px solid #eee;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${chapterName}">${chapterName}</div>
                <div>${progress}</div>
                <div style="color: ${result.success ? '#4CAF50' : '#ff4444'}">${result.msg || '完成'}</div>
            </div>
        `;
    }

    // 添加系统日志
    function addSystemLog(message) {
        const logElement = document.getElementById('systemLog');
        if (logElement) {
            const logEntry = document.createElement('div');
            logEntry.style.cssText = 'padding: 4px 0; color: #666; border-bottom: 1px solid #eee;';
            logEntry.innerHTML = `<span style="color: #999;">[${new Date().toLocaleTimeString()}]</span> ${message}`;
            logElement.insertBefore(logEntry, logElement.firstChild);
        }
    }

    // 添加观看记录
    function addWatchRecord(chapterName, progress, result) {
        const watchLogElement = document.getElementById('watchLog');
        if (watchLogElement) {
            const recordEntry = document.createElement('div');
            recordEntry.innerHTML = formatWatchRecord(chapterName, progress, result);
            watchLogElement.insertBefore(recordEntry, watchLogElement.firstChild);
        }
    }

    // 更新课程列表显示
    function updateCourseList() {
        const courseListElement = document.getElementById('courseList');
        if (!courseListElement) return;

        courseListElement.innerHTML = courses.map((course, index) => `
            <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="font-weight: bold;">${course.course_title}</div>
                    <div style="font-size: 12px; color: #666;">进度: ${course.learned_process}</div>
                </div>
                <button
                    id="courseBtn_${index}"
                    data-index="${index}"
                    style="padding: 5px 10px; border-radius: 3px; cursor: pointer; border: none; background: ${currentTask && currentTask.courseIndex === index ? '#ff4444' : '#4CAF50'}; color: white;"
                >
                    ${currentTask && currentTask.courseIndex === index ? '停止' : '开始'}
                </button>
            </div>
        `).join('');

        courses.forEach((_, index) => {
            const btn = document.getElementById(`courseBtn_${index}`);
            if (btn) {
                btn.addEventListener('click', () => toggleCourse(index));
            }
        });
    }

    // 切换课程状态
    function toggleCourse(index) {
        if (currentTask && currentTask.courseIndex === index) {
            currentTask = null;
            updateCourseList();
            addSystemLog(`停止处理课程: ${courses[index].course_title}`);
            updateCurrentProgress('已停止');
        } else {
            if (currentTask) {
                currentTask = null;
                updateCourseList();
            }
            const course = courses[index];
            currentTask = {
                courseIndex: index,
                userId: course.user_id,
                courseId: course.course_id
            };
            updateCourseList();
            addSystemLog(`开始处理课程: ${course.course_title}`);
            zhihuishu(course.user_id, course.course_id);
        }
    }

    // 使用GM_xmlhttpRequest进行请求
    function makeRequest(url, options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                data: options.body,
                responseType: 'json',
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.response);
                    } else {
                        reject(new Error('请求失败: ' + response.status));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 获取课程列表
    async function fetchCourseList() {
        try {
            const response = await makeRequest('http://www.learning.mil.cn/api/web/student/enrollment/course/?limit=7&offset=0', {
                method: 'GET',
                headers: {
                    'Cookie': document.cookie
                }
            });

            courses = response.results.filter(course => course.platform === 33);
            updateCourseList();
        } catch (error) {
            addSystemLog('获取课程列表失败: ' + error.message);
        }
    }

    // 主处理函数
    async function zhihuishu(userId, courseId) {
        if (!currentTask) return;

        const queryUrl = `http://armystudy.zhihuishu.com/armystudy/queryChapterInfos?userId=${userId}&courseId=${courseId}&ts&token`;
        const setWichTime = 'http://armystudy.zhihuishu.com/armystudy/stuRecord';

        try {
            updateCurrentProgress('正在获取课程信息...');
            const chapterInfo = await makeRequest(queryUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    userId: userId.toString(),
                    courseId: courseId.toString()
                }).toString()
            });

            if (!chapterInfo.chapterInfoDtoList) {
                throw new Error('获取课程信息失败，请检查ID是否正确');
            }

            const chapterInfoDtoList = chapterInfo.chapterInfoDtoList;
            let totalLessons = 0;
            let completedLessons = 0;

            chapterInfoDtoList.forEach(chapter => {
                totalLessons += chapter.lessonInfoDtos.length;
            });

            for (const chapter of chapterInfoDtoList) {
                if (!currentTask) return;

                for (const lesson of chapter.lessonInfoDtos) {
                    if (!currentTask) return;

                    completedLessons++;
                    updateCurrentProgress(`正在处理: ${lesson.lessonName} (${completedLessons}/${totalLessons}课)`);

                    const videoTime = lesson.videoTime;
                    let s = videoTime.split(':')[0];
                    let watchTime = 0;

                    if (s.startsWith('0')) {
                        watchTime = (parseInt(s.replace('0', '')) + 1) * 60;
                    } else {
                        watchTime = (parseInt(s) + 1) * 60;
                    }

                    let hh = Math.floor(watchTime / 3);
                    let lastResult = null;

                    for (let i = 0; i < 3; i++) {
                        if (!currentTask) return;

                        const formData = new URLSearchParams({
                            userId: userId.toString(),
                            courseId: courseId.toString(),
                            videoId: lesson.videoId.toString(),
                            exitwatchTime: '0',
                            lessonId: lesson.lessonId.toString(),
                            measureId: lesson.measureId.toString(),
                            videoNum: '53',
                            watchTime: hh.toString()
                        }).toString();

                        lastResult = await makeRequest(setWichTime, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: formData
                        });

                        hh++;
                        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
                    }

                    addWatchRecord(lesson.lessonName, `${completedLessons}/${totalLessons}`, lastResult);
                }
            }

            addSystemLog('课程处理完成！');
            updateCurrentProgress('完成！');
            currentTask = null;
            updateCourseList();
        } catch (error) {
            console.error('处理过程中出错:', error);
            addSystemLog('处理过程中出错: ' + error.message);
            updateCurrentProgress('出错: ' + error.message);
            currentTask = null;
            updateCourseList();
        }
    }

    // 初始化
    addPanel();
    fetchCourseList();

})();