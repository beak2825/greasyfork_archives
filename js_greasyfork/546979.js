// ==UserScript==
// @name         微伴助手
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  基于 v0.1 稳定版，完整修复并集成了考试功能与格式正确的答案导出功能。
// @author       Yi & 毫厘
// @match        https://weiban.mycourse.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      weiban.mycourse.cn
// @connect      safety.mycourse.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546979/%E5%BE%AE%E4%BC%B4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/546979/%E5%BE%AE%E4%BC%B4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================================================
    //                         变量定义与初始化 (来自 v0.1)
    // ========================================================================

    let USER_PROJECT_ID;
    let countdownInterval = null;
    const hashParams = window.location.hash.substring(1);

    if (hashParams) {
        const paramsPart = hashParams.indexOf('?') > -1 ? hashParams.substring(hashParams.indexOf('?') + 1) : '';
        if (paramsPart) {
            const urlParams = new URLSearchParams(paramsPart);
            USER_PROJECT_ID = urlParams.get('projectId');
        }
    }

    const COURSE_TYPES = ['3', '2'];
    let singleButton, allButton, examButton, exportButton, logPanel, statusPanel;

    if (!USER_PROJECT_ID) {
        console.error("非课程页面，脚本将保持静默。");
        return;
    }

    // ========================================================================
    //                          核心工具函数 (来自 v0.1 并适配)
    // ========================================================================

    function getUserInfo() {
        const userData = localStorage.getItem('user');
        if (!userData) { logMessage("错误：未找到用户信息，请确保已登录。", 'error'); return null; }
        try {
            const user = JSON.parse(userData);
            if (!user.token || !user.userId || !user.tenantCode) { logMessage("错误：用户信息不完整。", 'error'); return null; }
            return user;
        } catch (e) { logMessage("错误：解析用户信息失败。", 'error'); return null; }
    }

    function makeRequest(options) {
        const userInfo = getUserInfo();
        if (!userInfo) return Promise.reject("无法获取用户信息");
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || "POST",
                url: options.url,
                headers: options.headers || { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "x-token": userInfo.token },
                data: options.data,
                responseType: options.responseType || "json",
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        let responseData = response.response;
                        if (options.responseType === 'text') {
                            try {
                                const text = response.responseText;
                                responseData = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')')));
                            } catch (e) { resolve(response.responseText); return; }
                        }
                        if (responseData && responseData.code && responseData.code !== "0") {
                            logMessage(`API错误: ${responseData.message || responseData.msg}`, 'error');
                            reject(responseData);
                        } else { resolve(responseData); }
                    } else { logMessage(`HTTP 错误: ${response.status}`, 'error'); reject(response); }
                },
                onerror: function (response) { logMessage(`网络错误: ${response.statusText}`, 'error'); reject(response); }
            });
        });
    }

    function logMessage(message, type = 'info') {
        if (!logPanel) return;
        const entry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString();
        entry.className = 'log-entry';
        const timeSpan = document.createElement('span');
        timeSpan.className = 'log-timestamp';
        timeSpan.textContent = `[${timestamp}]`;
        entry.appendChild(timeSpan);
        const messageSpan = document.createElement('span');
        messageSpan.className = `log-message log-${type}`;
        switch (type) {
            case 'error': messageSpan.textContent = `错误: ${message}`; break;
            case 'success': messageSpan.textContent = `成功: ${message}`; break;
            case 'warning': messageSpan.textContent = `警告: ${message}`; break;
            case 'category-start': messageSpan.textContent = `--- ${message} ---`; break;
            case 'category-end': messageSpan.textContent = `--- ${message} ---`; entry.appendChild(messageSpan); logPanel.appendChild(entry); { const divider = document.createElement('div'); divider.className = 'log-divider'; logPanel.appendChild(divider); } logPanel.scrollTop = logPanel.scrollHeight; return;
            default: messageSpan.textContent = message; break;
        }
        entry.appendChild(messageSpan);
        logPanel.appendChild(entry);
        logPanel.scrollTop = logPanel.scrollHeight;
    }

    async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function setAllButtonsDisabled(disabled) {
        [singleButton, allButton, examButton, exportButton].forEach(btn => {
            if (btn) btn.disabled = disabled;
        });
    }

    // ========================================================================
    //                          课程学习相关功能 (来自 v0.1)
    // ========================================================================

    async function fetchAllCategories(userInfo, userProjectId) {
        logMessage("正在获取所有课程分类...", 'info');
        let allCategories = [];
        for (const type of COURSE_TYPES) {
            try {
                const response = await makeRequest({ url: `https://weiban.mycourse.cn/pharos/usercourse/listCategory.do?timestamp=${Date.now()}`, data: `tenantCode=${userInfo.tenantCode}&userId=${userInfo.userId}&userProjectId=${userProjectId}&chooseType=${type}` });
                if (response?.data) { allCategories.push(...response.data.map(cat => ({ ...cat, chooseType: type }))); }
            } catch (e) { logMessage(`获取类型 [${type}] 分类失败`, 'error'); }
        }
        return allCategories;
    }

    async function attemptCompleteNextCourseInCategory(userInfo, userProjectId, categoryCode, categoryName, chooseType) {
        const listCourseUrl = `https://weiban.mycourse.cn/pharos/usercourse/listCourse.do?timestamp=${Date.now()}`;
        const listCourseData = `tenantCode=${userInfo.tenantCode}&userId=${userInfo.userId}&userProjectId=${userProjectId}&chooseType=${chooseType}&categoryCode=${categoryCode}`;
        const delayMilliseconds = (Math.random() * 10 + 15) * 1000; //核心模拟学习函数
        try {
            const courseListResponse = await makeRequest({ url: listCourseUrl, data: listCourseData });
            const targetCourse = courseListResponse.data?.find(c => c.finished !== 1);
            if (!targetCourse) return false;
            logMessage(`找到目标课程: ${targetCourse.resourceName}`, 'info');
            await makeRequest({ url: `https://weiban.mycourse.cn/pharos/usercourse/study.do?timestamp=${Date.now()}`, data: `tenantCode=${userInfo.tenantCode}&userId=${userInfo.userId}&courseId=${targetCourse.resourceId}&userProjectId=${userProjectId}` });
            updateStatus(`模拟学习: ${targetCourse.resourceName}`, Math.round(delayMilliseconds / 1000));
            await sleep(delayMilliseconds);
            await makeRequest({ method: "GET", url: `https://weiban.mycourse.cn/pharos/usercourse/v2/${targetCourse.userCourseId}.do?callback=jQuery&userCourseId=${targetCourse.userCourseId}&tenantCode=${userInfo.tenantCode}&_=${Date.now()}`, responseType: 'text' });
            await sleep(5000);
            for (let i = 0; i < 3; i++) {
                try {
                    const verifyResponse = await makeRequest({ url: listCourseUrl, data: listCourseData });
                    const updatedCourse = verifyResponse.data.find(c => c.userCourseId === targetCourse.userCourseId);
                    if (updatedCourse?.finished === 1) { logMessage(`课程 "${targetCourse.resourceName}" 已成功完成！`, 'success'); return true; }
                    logMessage(`验证尝试 ${i + 1}/3: 状态为 ${updatedCourse?.finished ?? '未知'}`, 'warning');
                } catch (e) { logMessage(`验证尝试 ${i + 1}/3 失败`, 'error'); }
                if (i < 2) await sleep(4000);
            }
            logMessage(`课程 "${targetCourse.resourceName}" 状态验证失败`, 'error'); return false;
        } catch (error) { logMessage(`处理课程时发生错误: ${error.message}`, 'error'); return false; }
    }

    async function automateSingleCategory() {
        await setAllButtonsDisabled(true);
        singleButton.textContent = '处理中...';
        try {
             const userInfo = getUserInfo();
             if (!userInfo) return;
             let categories = await fetchAllCategories(userInfo, USER_PROJECT_ID);
             const unfinishedCategory = categories.find(cat => cat.finishedNum < cat.totalNum);
             if (unfinishedCategory) {
                 logMessage("开始处理下一个课程...", 'info');
                 await attemptCompleteNextCourseInCategory(userInfo, USER_PROJECT_ID, unfinishedCategory.categoryCode, unfinishedCategory.categoryName, unfinishedCategory.chooseType);
             } else {
                 logMessage("所有课程均已完成。", "success");
             }
        } finally {
            await setAllButtonsDisabled(false);
            singleButton.textContent = '完成下一个';
        }
    }

    async function automateAllUnfinishedCategories() {
        await setAllButtonsDisabled(true);
        allButton.textContent = '处理中...';
        logMessage("开始尝试完成所有未完成的课程...", 'info');
        updateStatus("开始处理所有课程...");
        try {
            const userInfo = getUserInfo();
            if (!userInfo) return;
            let categories = await fetchAllCategories(userInfo, USER_PROJECT_ID);
            let unfinishedCategories = categories.filter(cat => cat.finishedNum < cat.totalNum);
            if (unfinishedCategories.length === 0) { logMessage("所有课程已完成。", 'success'); return; }
            logMessage(`发现 ${unfinishedCategories.length} 个分类有未完成的课程。`, 'info');
            for (const category of unfinishedCategories) {
                logMessage(`处理分类: ${category.categoryName}`, 'category-start');
                while (true) {
                    const success = await attemptCompleteNextCourseInCategory(userInfo, USER_PROJECT_ID, category.categoryCode, category.categoryName, category.chooseType);
                    if (!success) { logMessage(`分类 "${category.categoryName}" 已无课可刷或出错。`, 'info'); break; }
                    await sleep(5000);
                }
            }
            logMessage("所有未完成课程处理完毕。", 'success');
        } finally {
            await setAllButtonsDisabled(false);
            allButton.textContent = '完成所有课程';
            updateStatus("课程处理完毕");
        }
    }

    // ========================================================================
    //                          考试及导出功能
    // ========================================================================

    async function getProjectList() { return makeRequest({ url: `https://weiban.mycourse.cn/pharos/index/listMyProject.do`, data: `tenantCode=${getUserInfo().tenantCode}&userId=${getUserInfo().userId}&ended=2` }).then(res => res.data).catch(() => null); }
    async function getExams(userProjectId) { return makeRequest({ url: `https://weiban.mycourse.cn/pharos/exam/listPlan.do`, data: `tenantCode=${getUserInfo().tenantCode}&userId=${getUserInfo().userId}&userProjectId=${userProjectId}` }).then(res => res.data).catch(() => null); }
    async function getExamHistory(examPlanId, examType) { return makeRequest({ url: `https://weiban.mycourse.cn/pharos/exam/listHistory.do`, data: `tenantCode=${getUserInfo().tenantCode}&userId=${getUserInfo().userId}&examPlanId=${examPlanId}&examType=${examType}` }).then(res => res.data).catch(() => null); }
    async function getExamAnswer(userExamId) { return makeRequest({ url: `https://weiban.mycourse.cn/pharos/exam/reviewPaper.do`, data: `tenantCode=${getUserInfo().tenantCode}&userId=${getUserInfo().userId}&userExamId=${userExamId}&isRetake=2` }).then(res => res.data?.questions).catch(() => null); }
    async function startExam(userExamPlanId) { return makeRequest({ url: `https://weiban.mycourse.cn/pharos/exam/startPaper.do`, data: `tenantCode=${getUserInfo().tenantCode}&userId=${getUserInfo().userId}&userExamPlanId=${userExamPlanId}` }).then(res => res.data?.questionList).catch(() => null); }
    async function submitAnswer(examPlanId, userExamPlanId, questionId, answerIds) { return makeRequest({ url: `https://weiban.mycourse.cn/pharos/exam/recordQuestion.do`, data: `tenantCode=${getUserInfo().tenantCode}&userId=${getUserInfo().userId}&examPlanId=${examPlanId}&userExamPlanId=${userExamPlanId}&questionId=${questionId}&answerIds=${answerIds}&useTime=10` }).then(res => res.code === '0').catch(() => false); }
    async function submitPaper(userExamPlanId) { return makeRequest({ url: `https://weiban.mycourse.cn/pharos/exam/submitPaper.do`, data: `tenantCode=${getUserInfo().tenantCode}&userId=${getUserInfo().userId}&userExamPlanId=${userExamPlanId}` }).then(res => res.data).catch(() => null); }

    async function takeAllExams() {
        await setAllButtonsDisabled(true);
        examButton.textContent = '考试中...';
        updateStatus("开始处理考试...");
        try {
            const projects = await getProjectList();
            if (!projects || projects.length === 0) {
                logMessage("未找到任何学习项目。", 'warning');
                return;
            }

            for (const project of projects) {
                logMessage(`处理项目: "${project.projectName}"`, 'category-start');
                const exams = await getExams(project.userProjectId);

                if (!exams || exams.length === 0) {
                    logMessage("该项目下没有考试。", 'info');
                    continue;
                }

                // 筛选出已完成（有作答记录）的考试
                const doneExams = exams.filter(x => x.examFinishNum > 0);
                let examAnswers = [];

                if (doneExams.length > 0) {
                    logMessage(`发现 ${doneExams.length} 个已完成的考试，开始获取答案库...`, 'info');
                    for (const doneExam of doneExams) {
                        const historyList = await getExamHistory(doneExam.examPlanId, doneExam.examType);
                        if (!historyList) continue;
                        for (const history of historyList) {
                            const answers = await getExamAnswer(history.id);
                            if (answers) {
                                for (const answer of answers) {
                                    // 使用题目作为唯一标识，避免重复添加
                                    if (!examAnswers.some(ea => ea.title === answer.title)) {
                                        examAnswers.push(answer);
                                    }
                                }
                            }
                        }
                    }
                    if (examAnswers.length > 0) {
                       logMessage(`成功构建答案库，共 ${examAnswers.length} 道题。`, 'success');
                    } else {
                       logMessage(`未能从已完成的考试中提取到答案。`, 'warning');
                    }
                }

                // 如果没有任何考试记录，则进行一次“探索性”考试以生成答案库
                if (examAnswers.length === 0) {
                    logMessage("未发现可用答案库。将进行一次探索性考试以获取答案。", 'warning');
                    const firstExam = exams.find(e => e.examOddNum > 0);
                    if (!firstExam) {
                        logMessage("没有可用的考试来进行初次尝试。", "error");
                        continue;
                    }

                    logMessage(`将对《${firstExam.examPlanName}》进行初次尝试...`, 'info');
                    const questions = await startExam(firstExam.id);

                    if (!questions) {
                        logMessage("开始初次考试失败。这通常是因为需要人机验证。请手动进入该考试完成一次，然后再运行脚本。", 'error');
                        continue; // 继续处理下一个项目
                    }

                    for (const q of questions) {
                        // 统一选择第一个选项
                        await submitAnswer(firstExam.examPlanId, firstExam.id, q.id, q.optionList[0].id);
                    }
                    await submitPaper(firstExam.id);
                    logMessage("初次尝试已提交。脚本将停止，请再次点击“开始考试”按钮，脚本将使用新生成的答案进行补考。", 'success');
                    return; // 关键：停止当前所有操作，让用户重新触发
                }

                // 寻找需要进行且分数低于100的考试
                const todoExam = exams.find(x => x.examOddNum > 0 && x.examScore < 100);
                if (!todoExam) {
                    logMessage("所有考试均已完成或达标。", 'success');
                    logMessage(`项目: "${project.projectName}" 处理完毕`, 'category-end');
                    continue;
                }

                logMessage(`开始对《${todoExam.examPlanName}》进行正式考试...`, 'info');
                const questions = await startExam(todoExam.id);

                if (!questions) {
                    logMessage("开始正式考试失败。这通常是因为需要人机验证。请手动进入该考试完成一次，然后再运行脚本。", 'error');
                    continue; // 继续处理下一个项目
                }

                let notFoundCount = 0;
                for (const q of questions) {
                    const foundAnswer = examAnswers.find(a => a.title === q.title);
                    let answerIds = [];

                    if (foundAnswer) {
                        // 从答案库中找到正确选项的内容
                        const correctOptionsContent = foundAnswer.optionList
                            .filter(opt => opt.isCorrect === 1)
                            .map(opt => opt.content);

                        // 在当前考试的选项中，根据内容匹配，找到对应的ID
                        answerIds = q.optionList
                            .filter(currentOpt => correctOptionsContent.includes(currentOpt.content))
                            .map(currentOpt => currentOpt.id);
                    }

                    // 如果答案库中没有或者匹配失败，则默认选第一个
                    if (answerIds.length === 0) {
                        notFoundCount++;
                        answerIds.push(q.optionList[0].id);
                    }
                    await submitAnswer(todoExam.examPlanId, todoExam.id, q.id, answerIds.join(','));
                }

                if (notFoundCount > 0) {
                    logMessage(`本次有 ${notFoundCount} 道题未找到答案，已蒙第一个选项。`, 'warning');
                }

                logMessage("所有题目回答完毕，等待3秒后交卷...", 'info');
                await sleep(3000);
                const result = await submitPaper(todoExam.id);

                if (result) {
                    logMessage(`交卷成功！本次得分: ${result.score}`, 'success');
                    if (result.score < 100) {
                        logMessage("得分未满，若还有考试次数，可再次运行脚本刷分。", "info");
                    }
                } else {
                    logMessage("交卷失败。", 'error');
                }
                logMessage(`项目: "${project.projectName}" 处理完毕`, 'category-end');
            }
        } finally {
            await setAllButtonsDisabled(false);
            examButton.textContent = '开始考试';
            updateStatus("考试任务结束");
        }
    }

    async function exportAnswersToDoc() {
        await setAllButtonsDisabled(true);
        exportButton.textContent = '导出中...';
        updateStatus("开始构建答案库...");
        logMessage("开始构建答案库以供导出...", "info");
        try {
            const projects = await getProjectList();
            if (!projects) { logMessage("未找到学习项目。", 'warning'); return; }
            let allExamAnswers = [];
            for (const project of projects) {
                const exams = await getExams(project.userProjectId);
                if (!exams) continue;
                const doneExams = exams.filter(x => x.examFinishNum > 0);
                if (doneExams.length === 0) continue;
                logMessage(`从项目 "${project.projectName}" 中提取答案...`, 'info');
                for (const doneExam of doneExams) {
                    const historyList = await getExamHistory(doneExam.examPlanId, doneExam.examType);
                    if (!historyList) continue;
                    for (const history of historyList) {
                        const answers = await getExamAnswer(history.id);
                        if (answers) { for (const answer of answers) { if (!allExamAnswers.some(ea => ea.title === answer.title)) { allExamAnswers.push(answer); } } }
                    }
                }
            }
            if (allExamAnswers.length === 0) { logMessage("未能提取到任何答案。", "warning"); return; }

            logMessage(`答案库构建完成，共 ${allExamAnswers.length} 道题。开始生成Word...`, "success");

            let contentHtml = `
                <!DOCTYPE html><html><head><meta charset='utf-8'>
                <style>
                    body { font-family: 'SimSun', '宋体', serif; font-size: 12pt; }
                    .q-block { margin-bottom: 20px; border-left: 3px solid #eee; padding-left: 15px; }
                    .q-title { font-weight: bold; }
                    .q-options p { margin: 5px 0; }
                    .correct-opt { color: #4CAF50; font-weight: bold; }
                    .final-answer { font-weight: bold; margin-top: 10px; }
                </style>
                </head><body>
                <h1>安全微伴 考试答案库</h1><p>导出时间: ${new Date().toLocaleString()}</p><hr>
            `;

            allExamAnswers.sort((a, b) => a.sequence - b.sequence).forEach((q, index) => {
                const correctAnswerLetters = [];
                let optionsHtml = '';
                q.optionList.forEach((opt, optIndex) => {
                    const isCorrect = opt.isCorrect === 1;
                    const optionLetter = String.fromCharCode(65 + optIndex);
                    if (isCorrect) { correctAnswerLetters.push(optionLetter); }
                    optionsHtml += `<p class="${isCorrect ? 'correct-opt' : ''}">${optionLetter}. ${opt.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')} </p>`;
                });
                contentHtml += `<div class="q-block"><p class="q-title">${index + 1}. ${q.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')} [${q.typeLabel}]</p><div class="q-options">${optionsHtml}</div><p class="final-answer">正确答案：${correctAnswerLetters.join(', ')}</p></div>`;
            });
            contentHtml += `</body></html>`;

            const blob = new Blob([contentHtml], { type: 'application/msword;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `安全微伴答案库.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            logMessage("Word文档已开始下载！", "success");
        } finally {
            await setAllButtonsDisabled(false);
            exportButton.textContent = '导出答案库';
            updateStatus("导出任务结束");
        }
    }

    // ========================================================================
    //                                UI 设置
    // ========================================================================

    function updateStatus(message, countdownSeconds = 0) {
        if (statusPanel) {
            if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
            statusPanel.textContent = message;
            if (countdownSeconds > 0) {
                let remainingSeconds = countdownSeconds;
                const countdownSpan = document.createElement('span');
                countdownSpan.style.cssText = 'margin-left: 5px; color: #FFD700; font-weight: bold;';
                statusPanel.appendChild(countdownSpan);
                const updateCountdown = () => {
                    const minutes = Math.floor(remainingSeconds / 60);
                    const seconds = remainingSeconds % 60;
                    countdownSpan.textContent = ` (${minutes}:${seconds < 10 ? '0' : ''}${seconds})`;
                    if (--remainingSeconds < 0) {
                        clearInterval(countdownInterval);
                        countdownSpan.textContent = ' (完成)';
                        setTimeout(() => { if (statusPanel.contains(countdownSpan)) { statusPanel.removeChild(countdownSpan); } }, 2000);
                    }
                };
                updateCountdown();
                countdownInterval = setInterval(updateCountdown, 1000);
            }
        }
    }

    function setupUI() {
        const uiContainer = document.createElement('div');
        uiContainer.style.cssText = 'position: fixed; bottom: 10px; right: 10px; z-index: 9997; display: flex; flex-direction: column; align-items: flex-end; gap: 10px;';
        statusPanel = document.createElement('div');
        statusPanel.textContent = '脚本已加载';
        statusPanel.style.cssText = 'background-color: rgba(0, 0, 0, 0.7); color: white; padding: 5px 10px; border-radius: 5px; font-size: 13px; text-align: right;';
        uiContainer.appendChild(statusPanel);
        logPanel = document.createElement('div');
        logPanel.style.cssText = 'width: 450px; height: 300px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 12px; overflow-y: scroll; font-size: 13px; font-family: "SF Mono", Consolas, "Liberation Mono", Menlo, monospace; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: block; line-height: 1.5;';
        const logStyle = document.createElement('style');
        logStyle.textContent = `#userscript-log-panel::-webkit-scrollbar { width: 8px; } #userscript-log-panel::-webkit-scrollbar-track { background: #f1f1f1; } #userscript-log-panel::-webkit-scrollbar-thumb { background: #c1c1c1; } .log-entry { padding: 3px 0; display: flex; align-items: baseline; gap: 8px; } .log-timestamp { color: #6c757d; font-size: 12px; flex-shrink: 0; } .log-message { word-break: break-word; } .log-error { color: #dc3545; font-weight: 600; } .log-success { color: #198754; } .log-warning { color: #fd7e14; } .log-category-start, .log-category-end { color: #0d6efd; font-weight: 600; } .log-divider { height: 1px; background-color: #dee2e6; margin: 6px 0; }`;
        document.head.appendChild(logStyle);
        uiContainer.appendChild(logPanel);
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 10px;';
        const lightenColor = (hex, lum) => {
            hex = String(hex).replace(/[^0-9a-f]/gi, ''); if (hex.length < 6) { hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; } lum = lum || 0; let rgb = "#", c; for (let i = 0; i < 3; i++) { c = parseInt(hex.substr(i*2,2),16); c = Math.round(Math.min(Math.max(0, c + (c * lum/100)), 255)).toString(16); rgb += ("00"+c).substr(c.length); } return rgb;
        };
        const applyButtonStyles = (button, bgColor) => {
            button.style.cssText = `padding: 10px 18px; background-color: ${bgColor}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold; transition: all 0.2s ease;`;
            button.onmouseover = () => { if (!button.disabled) button.style.backgroundColor = lightenColor(bgColor, -20); };
            button.onmouseout = () => { if (!button.disabled) button.style.backgroundColor = bgColor; };
        };

        singleButton = document.createElement('button');
        singleButton.textContent = '完成下一个';
        applyButtonStyles(singleButton, '#2196F3');
        singleButton.onclick = automateSingleCategory;
        buttonContainer.appendChild(singleButton);

        allButton = document.createElement('button');
        allButton.textContent = '完成所有课程';
        applyButtonStyles(allButton, '#4CAF50');
        allButton.onclick = automateAllUnfinishedCategories;
        buttonContainer.appendChild(allButton);

        examButton = document.createElement('button');
        examButton.textContent = '开始考试';
        applyButtonStyles(examButton, '#FF9800');
        examButton.onclick = takeAllExams;
        buttonContainer.appendChild(examButton);

        exportButton = document.createElement('button');
        exportButton.textContent = '导出答案库';
        applyButtonStyles(exportButton, '#00BCD4');
        exportButton.onclick = exportAnswersToDoc;
        buttonContainer.appendChild(exportButton);

        uiContainer.appendChild(buttonContainer);
        document.body.appendChild(uiContainer);
        logMessage("课程+考试+导出脚本已初始化。");
    }

    // ========================================================================
    //                                  启动脚本
    // ========================================================================

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', setupUI);
    } else {
        setupUI();
    }
})();