// ==UserScript==
// @name         智能学习助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  你的贴心学习伙伴，帮你轻松完成作业和考试，还能实时更新题库哦！
// @author       Your Friendly Neighborhood Coder
// @match        https://m.mynj.cn:11188/zxpx/hyper/courseDetail?ocid=*
// @match        https://m.mynj.cn:11188/zxpx/auc/courseExam?exid=EX*
// @match        https://m.mynj.cn:11188/zxpx/auc/examination/subexam?exid=EX*
// @match        https://m.mynj.cn:11188/zxpx/auc/myCourse?state=&page=1
// @match        https://m.mynj.cn:11188/zxpx/auc/myCourse*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513839/%E6%99%BA%E8%83%BD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/513839/%E6%99%BA%E8%83%BD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const questionBankUrl = 'https://api.jsonsilo.com/public/ab3d9231-42e1-437e-bc55-34163151c506';
    let questionBank = null;

    let helperMessages = null;

    // 创建一个小助手窗口
    function createHelperWindow() {
        if (helperMessages) {
            return; // 如果已经存在窗口，直接返回
        }
        const helperWindow = document.createElement('div');
        helperWindow.style.position = 'fixed';
        helperWindow.style.bottom = '20px';
        helperWindow.style.right = '20px';
        helperWindow.style.width = '300px';
        helperWindow.style.height = '400px'; // 设置固定高度
        helperWindow.style.backgroundColor = '#f0f8ff';
        helperWindow.style.border = '2px solid #4682b4';
        helperWindow.style.borderRadius = '10px';
        helperWindow.style.padding = '10px';
        helperWindow.style.fontSize = '14px';
        helperWindow.style.zIndex = '10000';
        helperWindow.innerHTML = '<h3 style="color: #4682b4;">你的学习小助手</h3><p>我会在这里为你加油打气哦！</p><div id="helper-messages" style="height: 320px; overflow-y: auto;"></div>';
        document.body.appendChild(helperWindow);
        helperMessages = helperWindow.querySelector('#helper-messages');
    }

    // 记录小助手的消息
    function logHelperMessage(message) {
        if (!helperMessages) {
            createHelperWindow();
        }
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        helperMessages.innerHTML += `<p><strong>${timeString}</strong> ${message}</p>`;
        helperMessages.scrollTop = helperMessages.scrollHeight;
    }

    // 标准化字符串
    function normalizeString(str) {
        if (typeof str !== 'string') {
            return '';
        }
        return str.replace(/[0-9一二三四五六七八九十]+\s*[、.．]/g, "")
                  .replace(/^[a-e]\s*[、.．]/i, "")
                  .replace(/[、，,。！？.!?]/g, "")
                  .replace(/[""'']/g, "")
                  .replace(/[：；:;]/g, "")
                  .replace(/\s+/g, "")
                  .toLowerCase();
    }

    // 获取远程题库
    async function fetchQuestionBank(retries = 3, delay = 2000) {
        for (let i = 0; i < retries; i++) {
            try {
                logHelperMessage(`尝试加载题库，第 ${i + 1} 次...`);
                const response = await fetch(questionBankUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                logHelperMessage('太棒了！我已经成功获取到最新的题库啦！');
                return data;
            } catch (error) {
                logHelperMessage(`哎呀，获取题库时问题${error.message}`);
                if (i < retries - 1) {
                    logHelperMessage(`担心，我会再试一次的！等待 ${delay / 1000} 秒...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        logHelperMessage('抱歉，我尝试了多次，但还是无法获取题库。我们可能需稍后再试。');
        return null;
    }

    // 处理题目并自动选择答案
    async function processQuestions() {
        questionBank = await fetchQuestionBank();
        if (!questionBank) {
            logHelperMessage('糟糕，题库好像出了点问题。别担心，我们一起来解决！');
            return;
        }

        logHelperMessage('准备开始答题啦，让我们一起加油！');
        let allMatched = true;
        let unmatchedQuestions = [];

        const processQuestionType = (questionType, selector) => {
            const containers = document.querySelectorAll(selector);

            containers.forEach((container) => {
                const questionText = container.querySelector('.exam-subject-text-que-title').innerText.trim();
                const normalizedQuestion = normalizeString(questionText);

                logHelperMessage(`处理题目: ${questionType} - ${questionText}`);

                let correctAnswer = Object.keys(questionBank[questionType] || {}).reduce((acc, key) => {
                    return normalizeString(key) === normalizedQuestion ? questionBank[questionType][key] : acc;
                }, null);

                if (!correctAnswer) {
                    correctAnswer = fuzzyMatch(normalizedQuestion, questionBank[questionType]);
                }

                if (correctAnswer) {
                    logHelperMessage(`找到答案: ${Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}`);
                    let answerFound = false;
                    const inputs = container.querySelectorAll('input');
                    const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

                    inputs.forEach((input) => {
                        const label = input.closest('label').innerText.trim();
                        const normalizedLabel = normalizeString(label);

                        const isCorrect = correctAnswers.some(answer =>
                            normalizeString(answer).includes(normalizedLabel) || normalizedLabel.includes(normalizeString(answer))
                        );

                        if (isCorrect) {
                            input.checked = true;
                            answerFound = true;
                            logHelperMessage(`选择答案: ${label}`);
                        }
                    });

                    if (!answerFound) {
                        logHelperMessage(`未找到匹配的选项，题目: ${questionText}`);
                        unmatchedQuestions.push(`${questionType}: ${questionText}`);
                        allMatched = false;
                    }
                } else {
                    logHelperMessage(`题库中未找到答案，题目: ${questionText}`);
                    unmatchedQuestions.push(`${questionType}: ${questionText}`);
                    allMatched = false;
                    randomSelectForQuestion(container, questionType);
                }
            });
        };

        processQuestionType('单选题', '.exam-subject-rd .exam-subject-text-panel');
        processQuestionType('多选题', '.exam-subject-ms .exam-subject-text-panel');
        processQuestionType('判断题', '.exam-subject-jd .exam-subject-text-panel');

        if (allMatched) {
            logHelperMessage('太棒了！所有题目都已经完成啦！');
        } else {
            logHelperMessage('哎呀，有些题目我不太确定。不过别担心，我已经尽力了！');
            unmatchedQuestions.forEach(q => logHelperMessage(`这道题太确定：${q}`));
        }

        // 添加自动交卷功能
        setTimeout(() => {
            if (localStorage.getItem('autoSubmit') === 'true') {
                const submitButton = document.querySelector('.exam-subit a#exam_sub');
                if (submitButton) {
                    logHelperMessage('作业完成啦！我来帮你交卷哦~');
                    submitButton.click();

                    // 等待确认窗出现并点击确定按钮
                    setTimeout(() => {
                        const confirmButton = document.querySelector('.messager-button a.l-btn:first-child');
                        if (confirmButton) {
                            logHelperMessage('点击确定，完成交卷！');
                            confirmButton.click();
                        } else {
                            logHelperMessage('咦，确认按钮去哪儿了？你可以自己点击确认哦~');
                        }
                    }, 1000); // 等待1秒后点击确认按钮
                } else {
                    logHelperMessage('咦，交卷按钮去哪儿了？你可以自己点击交卷哦~');
                }
            } else {
                logHelperMessage('自动交卷已关闭，请手动交卷哦~');
            }
        }, 3000); // 待3秒后自交卷
    }

    // 模糊匹配题目
    function fuzzyMatch(question, questionBank) {
        for (let key in questionBank) {
            const normalizedKey = normalizeString(key);
            if (normalizedKey.includes(question) || question.includes(normalizedKey)) {
                return questionBank[key];
            }
        }
        return null;
    }

    // 随机选择答案
    function randomSelectForQuestion(question, questionType) {
        const inputs = question.querySelectorAll('input');
        if (questionType === '多选题') {
            const selectCount = Math.floor(Math.random() * inputs.length) + 1;
            const shuffled = Array.from(inputs).sort(() => 0.5 - Math.random());
            shuffled.slice(0, selectCount).forEach(input => input.checked = true);
        } else {
            const randomIndex = Math.floor(Math.random() * inputs.length);
            inputs[randomIndex].checked = true;
        }
    }

    // 处理课程详情页
    function handleCourseDetailPage() {
        logHelperMessage('欢迎来到课程详情页！让我们一起开始学习吧！');

        // 查找开始作业按钮
        const startWorkButton = document.querySelector('a.course-intro-btn[href*="checkCWfinished"], a.distop-distoptitle[href*="javascript:reexamconfirm"], a.button-enable[href*="javascript:reexamconfirm"]');

        if (startWorkButton) {
            logHelperMessage('找到开始作业按钮啦，我来帮你点击！');

            // 使用 setTimeout 来模拟人类点击行为
            setTimeout(() => {
                startWorkButton.click();
                logHelperMessage('已点击开始作业按钮');

                // 等待可能出现的确认弹窗
                setTimeout(() => {
                    const confirmButton = document.querySelector('.messager-button a.l-btn:first-child');
                    if (confirmButton) {
                        logHelperMessage('找到确认按钮，点击确开始作业！');
                        confirmButton.click();
                    } else {
                        logHelperMessage('没有找到确认按钮，可能直接进入作业了~');
                    }
                }, 1000);
            }, 1500);
        } else {
            logHelperMessage('哎呀，我找不到开始作业按钮呢。你能帮我找找吗？');
        }

        // 处理未通过作业
        document.querySelectorAll('.distop-text-truncate').forEach((item) => {
            const statusElement = item.querySelector('.distop-subtime[title*="未通过"]');
            if (statusElement) {
                const retryButton = item.querySelector('a.course-intro-btn, a.distop-distoptitle, a.button-enable');
                if (retryButton) {
                    logHelperMessage('发现一个未通过的作业，别灰心，我再试一次！');
                    setTimeout(() => {
                        retryButton.click();
                        logHelperMessage('已点击重新开始作业按钮');

                        // 等待弹窗出现并点击确定按钮
                        setTimeout(() => {
                            const confirmButton = document.querySelector('.messager-button a.l-btn:first-child');
                            if (confirmButton) {
                                logHelperMessage('找到确认按钮，点击确定重新开始作业！');
                                confirmButton.click();
                            } else {
                                logHelperMessage('咦，确认按钮去哪儿了？你可以自己点击确认哦~');
                            }
                        }, 1000);
                    }, 1500);
                }
            }
        });
    }

    // 处理考试页面
    function handleExamPage() {
        logHelperMessage('考试开始啦！别紧张，我会陪着你的！');
        processQuestions();
    }

    // 处理我的课程面
    function handleMyCoursePage() {
        logHelperMessage('欢迎来到我的课程页面！让我们看看有哪些课程吧！');

        // 点击筛选器，选择未完成
        const filterButton = document.querySelector('.mycourse-selectbtn[data-state="1"]');
        if (filterButton) {
            filterButton.click();
            logHelperMessage('已选择未完成的课程');
        } else {
            logHelperMessage('未找到未完成课程的筛选按钮');
            return;
        }

        // 等待筛选结果加载
        setTimeout(() => {
            // 遍历课程列
            const courseRows = document.querySelectorAll('.mycourse-row');
            logHelperMessage(`找到 ${courseRows.length} 个未完成的课程`);

            if (courseRows.length > 0) {
                unfinishedExams = Array.from(courseRows).map(row => ({
                    name: row.querySelector('.mycourse-row-coursename p').innerText.trim(),
                    link: row.querySelector('.mycourse-row-operate a').href,
                    attempts: 0
                }));
                localStorage.setItem('unfinishedExams', JSON.stringify(unfinishedExams));
                processNextExam();
            } else {
                logHelperMessage('没有找到未完成的课程');
            }
        }, 2000); // 等待2秒，确保筛选结果已加载
    }

    // 添加新的全局变量
    let unfinishedExams = [];
    const MAX_ATTEMPTS = 3;
    let isExamInProgress = false;

    // 添加新的函数 processNextExam
    function processNextExam() {
        unfinishedExams = JSON.parse(localStorage.getItem('unfinishedExams')) || [];
        if (unfinishedExams.length > 0) {
            if (isExamInProgress) {
                logHelperMessage('已有一个考试正在进行，请完成当前考试后再继续。');
                return; // 如果已经有考试进行中，直接返回
            }

            const nextExam = unfinishedExams[0];
            if (nextExam.attempts < MAX_ATTEMPTS) {
                logHelperMessage(`准备开始考试: ${nextExam.name}`);
                nextExam.attempts++;
                localStorage.setItem('unfinishedExams', JSON.stringify(unfinishedExams));
                isExamInProgress = true; // 标记考试进行中
                window.open(nextExam.link, '_blank'); // 在新窗口中打开考试链接
                // 等待考试完成的消息，不再调用 processNextExam
            } else {
                logHelperMessage(`${nextExam.name} 已尝试 ${MAX_ATTEMPTS} 次，跳过此考试`);
                unfinishedExams.shift();
                localStorage.setItem('unfinishedExams', JSON.stringify(unfinishedExams));
                processNextExam(); // 处理下一个考试
            }
        } else {
            logHelperMessage('所有考试已完成！');
        }
    }

    // 保存题库
    function saveQuestionBank(questionBank) {
        localStorage.setItem('questionBank', JSON.stringify(questionBank));
        logHelperMessage('题库已成功保存到本地存储。');

        // 检查是否需要自动下载题库
        const autoDownloadEnabled = localStorage.getItem('autoDownloadQuestionBank') === 'true';
        if (autoDownloadEnabled) {
            downloadQuestionBank(questionBank);
        }
    }

    // 添加控制面板
    function addControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.top = '20px';
        controlPanel.style.right = '20px';
        controlPanel.style.zIndex = '10001';
        controlPanel.style.backgroundColor = '#f0f8ff';
        controlPanel.style.border = '2px solid #4682b4';
        controlPanel.style.borderRadius = '10px';
        controlPanel.style.padding = '10px';

        const autoDownloadCheckbox = document.createElement('input');
        autoDownloadCheckbox.type = 'checkbox';
        autoDownloadCheckbox.id = 'autoDownloadCheckbox';
        autoDownloadCheckbox.checked = localStorage.getItem('autoDownloadQuestionBank') === 'true';

        const label = document.createElement('label');
        label.htmlFor = 'autoDownloadCheckbox';
        label.textContent = '自动下载题库';

        autoDownloadCheckbox.addEventListener('change', (e) => {
            localStorage.setItem('autoDownloadQuestionBank', e.target.checked);
            logHelperMessage(`自动下载题库已${e.target.checked ? '开启' : '关闭'}`);
        });

        // 添加下载题库按钮
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '下载题库';
        downloadBtn.style.marginLeft = '10px';
        downloadBtn.onclick = () => {
            const questionBank = JSON.parse(localStorage.getItem('questionBank')) || {};
            downloadQuestionBank(questionBank);
        };

        const autoSubmitCheckbox = document.createElement('input');
        autoSubmitCheckbox.type = 'checkbox';
        autoSubmitCheckbox.id = 'autoSubmitCheckbox';
        autoSubmitCheckbox.checked = localStorage.getItem('autoSubmit') === 'true';

        const autoSubmitLabel = document.createElement('label');
        autoSubmitLabel.htmlFor = 'autoSubmitCheckbox';
        autoSubmitLabel.textContent = '自动交卷';

        autoSubmitCheckbox.addEventListener('change', (e) => {
            localStorage.setItem('autoSubmit', e.target.checked);
            logHelperMessage(`自动交卷已${e.target.checked ? '开启' : '关闭'}`);
        });

        controlPanel.appendChild(autoDownloadCheckbox);
        controlPanel.appendChild(label);
        controlPanel.appendChild(downloadBtn);
        controlPanel.appendChild(document.createElement('br'));
        controlPanel.appendChild(autoSubmitCheckbox);
        controlPanel.appendChild(autoSubmitLabel);
        document.body.appendChild(controlPanel);
    }

    // 下载题库
    function downloadQuestionBank(questionBank) {
        if (!questionBank || Object.keys(questionBank).length === 0) {
            logHelperMessage('题库为空，无法下载');
            return;
        }

        const blob = new Blob([JSON.stringify(questionBank, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        a.download = `${year}${month}${day}${hours}${minutes}_题库.json`;
        a.click();
        URL.revokeObjectURL(url);
        logHelperMessage('题库已下载');
    }

    // 主函数
    function main() {
        createHelperWindow(); // 确保在主函数开始时创建窗口
        addControlPanel(); // 添加控制面板

        // 修改消息监听器
        window.addEventListener('message', (event) => {
            if (event.data === 'examCompleted' || event.data === 'examFailed') {
                isExamInProgress = false;
                setTimeout(() => {
                    processNextExam(); // 处理下一个考试
                }, 3000); // 3秒后处理下一个考试
            }
        });

        // 根据当前页面URL执行相应的处理函数
        if (window.location.href.includes('courseDetail')) {
            handleCourseDetailPage();
        } else if (window.location.href.includes('courseExam')) {
            handleExamPage();
        } else if (window.location.href.includes('examination/subexam')) {
            handleSubmitPage();
        } else if (window.location.href.includes('myCourse')) {
            handleMyCoursePage();
        } else {
            logHelperMessage('哎呀，我好像迷路了！这是什么页面呢？');
            checkAndProcessUnfinishedExams();
        }
    }

    // 新增函数：检查并处理未完成的考试
    function checkAndProcessUnfinishedExams() {
        const unfinishedExams = JSON.parse(localStorage.getItem('unfinishedExams')) || [];
        if (unfinishedExams.length > 0 && !isExamInProgress) {
            processNextExam();
        }
    }

    // 修改 handleSubmitPage 函数
    async function handleSubmitPage() {
        logHelperMessage('交卷页面加载完成，让我们来看看结果如何~');

        // 从 localStorage 获取现有题库
        let questionBank = JSON.parse(localStorage.getItem('questionBank')) || {};
        logHelperMessage('我正在查看我们之前保存的题库...');

        let updatedQuestions = 0;
        let newQuestions = 0;
        let incorrectQuestions = {};

        // 遍历页面上的题目并更新题库
        document.querySelectorAll('.exam-subject-panel > div').forEach((subjectType) => {
            const questionType = subjectType.querySelector('.exam-subject-title').textContent.split('（')[0];

            subjectType.querySelectorAll('.exam-subject-text-panel').forEach((question) => {
                const questionText = question.querySelector('.exam-subject-text-que-title').textContent.trim();
                const userAnswerElement = question.querySelector('.exam-subject-text-queanswar');
                const correctAnswerElement = question.querySelector('.exam-subject-text-queanswar:last-child');

                if (!userAnswerElement || !correctAnswerElement) {
                    logHelperMessage(`哎呀，这道题我找不到答案呢：${questionType} - ${questionText}`);
                    return;
                }

                const userAnswer = userAnswerElement.textContent.replace('我的答案：', '').trim();
                const correctAnswer = correctAnswerElement.textContent.replace('正确答案：', '').trim();
                const normalizedQuestion = normalizeString(questionText);

                // 更新题库，无论答案是否正确都进行保存
                if (!questionBank[questionType]) {
                    questionBank[questionType] = {};
                }

                // 检查题目是否已经存在，存在则覆盖
                if (!questionBank[questionType][normalizedQuestion] || questionBank[questionType][normalizedQuestion] !== correctAnswer) {
                    questionBank[questionType][normalizedQuestion] = correctAnswer;
                    if (!questionBank[questionType][normalizedQuestion]) {
                        newQuestions++;
                        logHelperMessage(`发现一道新题目：${questionType} - ${questionText}`);
                    } else {
                        updatedQuestions++;
                        logHelperMessage(`这道题的答案有变化：${questionType} - ${questionText}`);
                    }
                }

                // 保存错误题目及其正确答案
                if (userAnswer !== correctAnswer) {
                    if (!incorrectQuestions[questionType]) {
                        incorrectQuestions[questionType] = {};
                    }
                    incorrectQuestions[questionType][questionText] = correctAnswer;
                }

                logHelperMessage(`你的答案: ${userAnswer}`);
                logHelperMessage(`正确答案: ${correctAnswer}`);
            });
        });

        logHelperMessage(`太棒了！我们的题库又变得更聪明了！新增了${newQuestions}道题，更新了${updatedQuestions}道题。`);

        // 合并 incorrectQuestions 和 questionBank
        mergeIncorrectQuestionsToQuestionBank(questionBank, incorrectQuestions);

        // 保存更新后的题库
        saveQuestionBank(questionBank);

        // 保存本次的错误题目
        localStorage.setItem('incorrectQuestions', JSON.stringify(incorrectQuestions));

        // 检查是否需要自动下载题库
        const autoDownloadEnabled = localStorage.getItem('autoDownloadQuestionBank') === 'true';
        if (autoDownloadEnabled) {
            downloadQuestionBank(questionBank); // 只有在设置开启时才会执行下载
        }

        // 添加考试结果判断逻辑
        const resultElement = document.querySelector('.exam-message-question');
        if (resultElement) {
            const resultText = resultElement.textContent;
            if (resultText.includes('已合格')) {
                logHelperMessage('恭喜！考试已合格！');
                unfinishedExams = JSON.parse(localStorage.getItem('unfinishedExams')) || [];
                unfinishedExams.shift(); // 移除当前考试
                localStorage.setItem('unfinishedExams', JSON.stringify(unfinishedExams));
                setTimeout(() => {
                    if (window.opener) {
                        window.opener.postMessage('examCompleted', '*');
                    }
                    window.close();
                }, 10000);
            } else {
                logHelperMessage('很遗憾，考试未合格。准备重新尝试...');
                setTimeout(() => {
                    if (window.opener) {
                        window.opener.postMessage('examFailed', '*');
                    }
                    window.close();
                }, 3000);
            }
        } else {
            logHelperMessage('无法找到考试结果信息，请手动检查。');
        }
    }

    // 将 incorrectQuestions 合并到 questionBank
    function mergeIncorrectQuestionsToQuestionBank(questionBank, incorrectQuestions) {
        for (let questionType in incorrectQuestions) {
            if (!questionBank[questionType]) {
                questionBank[questionType] = {};
            }
            for (let questionText in incorrectQuestions[questionType]) {
                // 将错误题目及其正确答案合并到题库
                questionBank[questionType][normalizeString(questionText)] = incorrectQuestions[questionType][questionText];
            }
        }
        logHelperMessage('错误题目已成功合并到题库。');
    }

    // 调用主函数
    main();
})();
