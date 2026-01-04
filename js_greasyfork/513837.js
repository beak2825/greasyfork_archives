// ==UserScript==
// @name         南京继续教育系统助手
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  合并课程列表显示 + 定时关闭网页
// @author       Your Name
// @match        https://m.mynj.cn:11188/*
// @match        https://m.mynj.cn:11096/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/513837/%E5%8D%97%E4%BA%AC%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/513837/%E5%8D%97%E4%BA%AC%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================ 定时关闭功能 ================
    const DEFAULT_CLOSE_HOURS = 12;
    const STORAGE_PREFIX = 'mynj_assistant_';
    const CLOSE_TIME_KEY = STORAGE_PREFIX + 'closeTime';

    // 在定时关闭功能之前添加模块管理系统
    const MODULES = {
        MERGE_COURSES: {
            key: 'merge_courses',
            name: '合并课程列表',
            description: '自动合并多页课程到一页显示',
            defaultEnabled: true,
            urls: [
                '/search/courselist',
                '/auc/myCourse'
            ],
            initialize: function() {
                addLoadingIndicator();
                waitForPageLoad();
            }
        },
        AUTO_SELECT: {
            key: 'auto_select',
            name: '自动选课',
            description: '自动选择公需课，按年份处理课程，显示和重置累计学时',
            defaultEnabled: false,
            urls: [
                '/search/courselist',
                '/courseDetail'
            ],
            config: {
                maxHours: 30,
                selectedYear: GM_getValue(STORAGE_PREFIX + 'selectedYear', '2024'),
                completedHours: GM_getValue(STORAGE_PREFIX + 'completedHours', 0),
                courseQueue: []
            },
            initialize: function() {
                if(window.location.href.includes('courselist')) {
                    // 初始化年份选择器
                    const yearSelect = document.getElementById('yearSelect');
                    const yearOptions = document.querySelectorAll('#selection-year li a');
                    yearOptions.forEach(option => {
                        const year = option.getAttribute('year');
                        const opt = document.createElement('option');
                        opt.value = year;
                        opt.text = `${year}年度`;
                        if(year === this.config.selectedYear) {
                            opt.selected = true;
                        }
                        yearSelect.appendChild(opt);
                    });

                    // 绑定年份选择事件
                    yearSelect.addEventListener('change', () => {
                        this.config.selectedYear = yearSelect.value;
                        GM_setValue(STORAGE_PREFIX + 'selectedYear', this.config.selectedYear);
                        const yearLink = document.querySelector(`#selection-year a[year="${this.config.selectedYear}"]`);
                        if(yearLink) yearLink.click();
                    });

                    // 绑定学时输入事件
                    document.getElementById('hoursInput').value = this.config.completedHours;
                    document.getElementById('hoursInput').addEventListener('change', (e) => {
                        this.config.completedHours = parseFloat(e.target.value) || 0;
                        GM_setValue(STORAGE_PREFIX + 'completedHours', this.config.completedHours);
                    });

                    // 绑定重置按钮
                    document.getElementById('resetHoursBtn').addEventListener('click', () => {
                        this.config.completedHours = 0;
                        GM_setValue(STORAGE_PREFIX + 'completedHours', 0);
                        document.getElementById('hoursInput').value = 0;
                    });

                    // 绑定开始选课按钮
                    document.getElementById('startSelectBtn').addEventListener('click', () => {
                        this.startAutoSelect();
                    });

                    // 创建调试窗口
                    this.createDebugWindow();
                } else if(window.location.href.includes('courseDetail')) {
                    this.handleCourseSelection();
                }
            },
            createDebugWindow: function() {
                let debugWindow = document.createElement('div');
                debugWindow.id = 'debugWindow';
                debugWindow.style.cssText = `
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background-color: rgba(0,0,0,0.7);
                    color: white;
                    max-height: 200px;
                    overflow-y: scroll;
                    z-index: 9999;
                    padding: 10px;
                    box-sizing: border-box;
                    font-size: 12px;
                    font-family: monospace;
                `;
                document.body.appendChild(debugWindow);
            },
            logMessage: function(message) {
                const debugWindow = document.getElementById('debugWindow');
                if(debugWindow) {
                    const time = new Date().toLocaleTimeString();
                    debugWindow.innerHTML += `[${time}] ${message}<br>`;
                    debugWindow.scrollTop = debugWindow.scrollHeight;
                }
                console.log(message);
            },
            startAutoSelect: function() {
                if(!window.location.href.includes(`ys=${this.config.selectedYear}`)) {
                    this.logMessage('请先选择正确的年份！');
                    return;
                }

                this.logMessage('开始选课流程...');
                this.processCourses();
            },
            processCourses: function() {
                const courseItems = document.querySelectorAll('ul.list-courses li');
                this.logMessage(`找到 ${courseItems.length} 门课程`);

                const remainingHours = this.config.maxHours - this.config.completedHours;
                const selectThreeHoursOnly = document.getElementById('selectThreeHours').checked;

                this.config.courseQueue = [];

                courseItems.forEach(course => {
                    const courseType = course.querySelector('.course-other .course-type')?.innerText.trim();
                    const courseHours = parseFloat(course.querySelector('.course-hour span')?.innerText || '0');
                    const selectButton = course.querySelector('.course-detail-btn a');

                    if(courseType?.includes('公需')) {
                        if(this.config.completedHours >= this.config.maxHours) {
                            this.logMessage('已达到目标学时，停止操作');
                            return;
                        }

                        if(selectButton.classList.contains('hasbuy')) {
                            this.logMessage('该课程已选，计入学时');
                            setTimeout(() => {
                                this.addCompletedHours(courseHours);
                            }, 0);
                            return;
                        }

                        if(selectThreeHoursOnly && courseHours !== 3) {
                            this.logMessage('跳过非3学时课程');
                            return;
                        }

                        if(courseHours <= remainingHours) {
                            this.config.courseQueue.push({ selectButton, courseHours });
                            this.logMessage(`将课程加入队列，学时：${courseHours}`);
                        }
                    }
                });

                if(this.config.courseQueue.length > 0) {
                    this.processNextCourse();
                } else if(remainingHours > 0) {
                    this.goToNextPage();
                }
            },
            processNextCourse: function() {
                if(this.config.courseQueue.length === 0) {
                    this.logMessage('课程队列处理完毕');
                    if(this.config.maxHours - this.config.completedHours > 0) {
                        this.goToNextPage();
                    }
                    return;
                }

                const { selectButton, courseHours } = this.config.courseQueue.shift();
                this.logMessage(`处理课程，学时：${courseHours}`);

                selectButton.click();
                setTimeout(() => {
                    this.addCompletedHours(courseHours);
                    setTimeout(() => {
                        if(this.config.maxHours - this.config.completedHours > 0) {
                            this.processNextCourse();
                        }
                    }, 2000);
                }, 1000);
            },
            addCompletedHours: function(hours) {
                try {
                    this.config.completedHours += hours;
                    GM_setValue(STORAGE_PREFIX + 'completedHours', this.config.completedHours);

                    // 使用 requestAnimationFrame 确保DOM已经准备好
                    requestAnimationFrame(() => {
                        const hoursInput = document.getElementById('hoursInput');
                        if(hoursInput) {
                            hoursInput.value = this.config.completedHours;
                        }
                    });

                    this.logMessage(`添加学时：${hours}，累计：${this.config.completedHours}`);
                } catch(error) {
                    console.error('更新学时时出错:', error);
                    this.logMessage('更新学时时出错: ' + error.message);
                }
            },
            goToNextPage: function() {
                const nextPageButton = Array.from(document.querySelectorAll('.ui-pagination-page-item'))
                    .find(el => el.textContent.trim() === '下一页');

                if(nextPageButton && !nextPageButton.classList.contains('disabled')) {
                    this.logMessage('翻到下一页...');
                    nextPageButton.click();
                    setTimeout(() => {
                        this.processCourses();
                    }, 2000);
                } else {
                    this.logMessage('没有更多页面了');
                }
            },
            handleCourseSelection: function() {
                const courseButton = document.querySelector('#btn-addToShopcart.active');
                if(courseButton) {
                    courseButton.click();
                    setTimeout(() => {
                        const confirmButton = document.querySelector('a.l-btn.l-btn-small');
                        if(confirmButton) {
                            confirmButton.click();
                            setTimeout(() => window.close(), 500);
                        }
                    }, 500);
                }
            }
        },
        SMART_LEARNING: {
            key: 'smart_learning',
            name: '智能学习',
            description: '自动完成作业和考试，实时更新题库',
            defaultEnabled: false,
            urls: [
                '/courseDetail',
                '/courseExam',
                '/examination/subexam',
                '/myCourse'
            ],
            config: {
                questionBankUrl: 'https://api.jsonsilo.com/public/ab3d9231-42e1-437e-bc55-34163151c506',
                localQuestionBank: GM_getValue(STORAGE_PREFIX + 'localQuestionBank', {}),
                autoSubmit: GM_getValue(STORAGE_PREFIX + 'autoSubmit', true),
                learningProgress: GM_getValue(STORAGE_PREFIX + 'learningProgress', {
                    totalCourses: 0,
                    completedCourses: 0,
                    currentCourse: null
                }),
                retryConfig: {
                    maxRetries: 3,
                    retryDelay: 2000
                },
                completedCourses: GM_getValue(STORAGE_PREFIX + 'completedCourses', []),
                courseStates: GM_getValue(STORAGE_PREFIX + 'courseStates', {
                    inProgress: null,  // 当前正在处理的课程
                    processing: false, // 是否正在处理课程
                    lastUpdate: 0      // 最后更新时间
                })
            },
            initialize: function() {
                this.createHelperWindow();
                this.initMessageListener();
                this.checkCourseState(); // 添加状态检查

                if(window.location.href.includes('courseDetail')) {
                    this.handleCourseDetailPage();
                } else if(window.location.href.includes('courseExam')) {
                    this.handleExamPage();
                } else if(window.location.href.includes('examination/subexam')) {
                    this.handleExamResultPage();
                } else if(window.location.href.includes('myCourse')) {
                    this.handleMyCoursePage();
                }
            },
            // 创建小助手窗口
            createHelperWindow: function() {
                if(this.helperMessages) return;

                const helperWindow = document.createElement('div');
                helperWindow.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 300px;
                    height: 400px;
                    background-color: #f0f8ff;
                    border: 2px solid #4682b4;
                    border-radius: 10px;
                    padding: 10px;
                    font-size: 14px;
                    z-index: 10000;
                `;
                helperWindow.innerHTML = `
                    <h3 style="color: #4682b4;">智能学习助手</h3>
                    <p>我会在这里为你加油打气哦！</p>
                    <div id="helper-messages" style="height: 320px; overflow-y: auto;"></div>
                `;
                document.body.appendChild(helperWindow);
                this.helperMessages = helperWindow.querySelector('#helper-messages');
            },
            // 记录消息
            logMessage: function(message) {
                if(!this.helperMessages) {
                    this.createHelperWindow();
                }
                const now = new Date();
                const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                this.helperMessages.innerHTML += `<p><strong>${timeString}</strong> ${message}</p>`;
                this.helperMessages.scrollTop = this.helperMessages.scrollHeight;
            },
            // 处理课程详情页
            handleCourseDetailPage: function() {
                this.logMessage('欢迎来到课程详情页！让我们一起开始学习吧！');

                const startWorkButton = document.querySelector('a.course-intro-btn[href*="checkCWfinished"], a.distop-distoptitle[href*="javascript:reexamconfirm"], a.button-enable[href*="javascript:reexamconfirm"]');

                if(startWorkButton) {
                    this.logMessage('找到开始作业按钮啦，我来帮你点击！');
                    setTimeout(() => {
                        startWorkButton.click();
                        this.logMessage('已点击开始作业按钮');

                        setTimeout(() => {
                            const confirmButton = document.querySelector('.messager-button a.l-btn:first-child');
                            if(confirmButton) {
                                this.logMessage('找到确认按钮，点击确认开始作业！');
                                confirmButton.click();
                            }
                        }, 1000);
                    }, 1500);
                }

                // 处理未通过作业
                document.querySelectorAll('.distop-text-truncate').forEach((item) => {
                    const statusElement = item.querySelector('.distop-subtime[title*="未通过"]');
                    if(statusElement) {
                        const retryButton = item.querySelector('a.course-intro-btn, a.distop-distoptitle, a.button-enable');
                        if(retryButton) {
                            this.logMessage('发现未通过的作业，准备重新尝试！');
                            setTimeout(() => {
                                retryButton.click();
                                setTimeout(() => {
                                    const confirmButton = document.querySelector('.messager-button a.l-btn:first-child');
                                    if(confirmButton) confirmButton.click();
                                }, 1000);
                            }, 1500);
                        }
                    }
                });
            },
            // 处理考试页面
            handleExamPage: async function() {
                this.logMessage('考试开始啦！别紧张，我会陪着你的！');
                await this.processQuestions();

                // 添加考试完成后的处理
                if (this.config.autoSubmit) {
                    setTimeout(() => {
                        const submitButton = document.querySelector('.exam-subit a#exam_sub');
                        if (submitButton) {
                            this.logMessage('准备自动交卷...');
                            submitButton.click();

                            // 等待确认框出现并点击确认
                            setTimeout(() => {
                                const confirmButton = document.querySelector('.messager-button a.l-btn:first-child');
                                if (confirmButton) {
                                    this.logMessage('确认交卷');
                                    confirmButton.click();

                                    // 等待结果页面加载完成
                                    setTimeout(() => {
                                        this.handleExamResultPage();
                                    }, 2000);
                                }
                            }, 1000);
                        }
                    }, 3000);
                }
            },
            // 添加题库管理相关方法
            normalizeString: function(str) {
                if (typeof str !== 'string') return '';
                return str.replace(/[0-9一二三四五六七八九十]+\s*[、.．]/g, "")
                          .replace(/^[a-e]\s*[、.．]/i, "")
                          .replace(/[、，,。！？.!?]/g, "")
                          .replace(/[""'']/g, "")
                          .replace(/[：；:;]/g, "")
                          .replace(/\s+/g, "")
                          .toLowerCase();
            },
            // 获取远程题库
            fetchQuestionBank: async function(retries = 3, delay = 2000) {
                for (let i = 0; i < retries; i++) {
                    try {
                        this.logMessage(`尝试加载远程题库，第 ${i + 1} 次...`);
                        const response = await fetch(this.config.questionBankUrl);
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        const data = await response.json();
                        this.logMessage('成功获取到最新的远程题库！');
                        return data;
                    } catch (error) {
                        this.logMessage(`获取远程题库时出错: ${error.message}`);
                        if (i < retries - 1) {
                            this.logMessage(`等待 ${delay / 1000} 秒后重试...`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                        }
                    }
                }
                this.logMessage('无法获取远程题库，将使用本地题库。');
                return null;
            },
            // 合并题库
            mergeQuestionBanks: function(localBank, remoteBank) {
                if (!remoteBank) return localBank;
                const mergedBank = { ...remoteBank };
                for (const type in localBank) {
                    if (!mergedBank[type]) mergedBank[type] = {};
                    Object.assign(mergedBank[type], localBank[type]);
                }
                return mergedBank;
            },
            // 处理题目
            processQuestions: async function() {
                const remoteBank = await this.fetchQuestionBank();
                const combinedBank = this.mergeQuestionBanks(this.config.localQuestionBank, remoteBank);

                this.logMessage('开始答题...');

                const processQuestionType = (questionType, selector) => {
                    const containers = document.querySelectorAll(selector);
                    containers.forEach((container) => {
                        const questionText = container.querySelector('.exam-subject-text-que-title').innerText.trim();
                        const normalizedQuestion = this.normalizeString(questionText);

                        this.logMessage(`处理题目: ${questionType} - ${questionText}`);

                        let correctAnswer = Object.keys(combinedBank[questionType] || {}).reduce((acc, key) => {
                            return this.normalizeString(key) === normalizedQuestion ? combinedBank[questionType][key] : acc;
                        }, null);

                        if (correctAnswer) {
                            this.logMessage(`找到答案: ${Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}`);
                            const inputs = container.querySelectorAll('input');
                            const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

                            inputs.forEach((input) => {
                                const label = input.closest('label').innerText.trim();
                                const normalizedLabel = this.normalizeString(label);

                                if (correctAnswers.some(answer =>
                                    this.normalizeString(answer).includes(normalizedLabel) ||
                                    normalizedLabel.includes(this.normalizeString(answer)))) {
                                    input.checked = true;
                                }
                            });
                        } else {
                            this.logMessage(`题库中未找到答案，随机选择`);
                            this.randomSelectForQuestion(container, questionType);
                        }
                    });
                };

                processQuestionType('单选题', '.exam-subject-rd .exam-subject-text-panel');
                processQuestionType('多选题', '.exam-subject-ms .exam-subject-text-panel');
                processQuestionType('判断题', '.exam-subject-jd .exam-subject-text-panel');

                // 如果开启了自动交卷
                if (this.config.autoSubmit) {
                    setTimeout(() => {
                        const submitButton = document.querySelector('.exam-subit a#exam_sub');
                        if (submitButton) {
                            this.logMessage('准备自动交卷...');
                            submitButton.click();
                            setTimeout(() => {
                                const confirmButton = document.querySelector('.messager-button a.l-btn:first-child');
                                if (confirmButton) {
                                    this.logMessage('确认交卷');
                                    confirmButton.click();
                                }
                            }, 1000);
                        }
                    }, 3000);
                }
            },
            // 随机选择答案
            randomSelectForQuestion: function(question, questionType) {
                const inputs = question.querySelectorAll('input');
                if (questionType === '多选题') {
                    const selectCount = Math.floor(Math.random() * inputs.length) + 1;
                    const shuffled = Array.from(inputs).sort(() => 0.5 - Math.random());
                    shuffled.slice(0, selectCount).forEach(input => input.checked = true);
                } else {
                    const randomIndex = Math.floor(Math.random() * inputs.length);
                    inputs[randomIndex].checked = true;
                }
                this.logMessage('已随机选择答案');
            },
            // 下载题库
            downloadQuestionBank: function() {
                const questionBank = this.config.localQuestionBank;
                if (!questionBank || Object.keys(questionBank).length === 0) {
                    this.logMessage('题库为空，无法下载');
                    return;
                }

                const blob = new Blob([JSON.stringify(questionBank, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const now = new Date();
                a.download = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}_题库.json`;
                a.click();
                URL.revokeObjectURL(url);
                this.logMessage('题库已下载');
            },
            // 处理我的课程页面
            handleMyCoursePage: function() {
                this.logMessage('欢迎来到我的课程页面！让我们看看有哪些课程需要学习...');

                // 初始化学习队列
                this.config.learningQueue = [];

                // 点击筛选器，选择未完成
                const filterButton = document.querySelector('.mycourse-selectbtn[data-state="1"]');
                if (filterButton) {
                    filterButton.click();
                    this.logMessage('已选择未完成的课程');

                    // 等待筛选结果加载
                    setTimeout(() => {
                        this.scanUnfinishedCourses();
                    }, 2000);
                }
            },
            // 扫描未完成的课程
            scanUnfinishedCourses: function() {
                const courseRows = document.querySelectorAll('.mycourse-row');
                this.logMessage(`找到 ${courseRows.length} 个课程`);

                if (courseRows.length > 0) {
                    // 过滤掉已完成的课程
                    const newCourses = Array.from(courseRows)
                        .filter(row => {
                            const courseId = row.querySelector('.mycourse-row-operate a')?.href?.match(/ocid=([^&]+)/)?.[1];
                            return courseId && !this.config.completedCourses.includes(courseId);
                        })
                        .map(row => ({
                            name: row.querySelector('.mycourse-row-coursename p').innerText.trim(),
                            link: row.querySelector('.mycourse-row-operate a').href,
                            id: row.querySelector('.mycourse-row-operate a').href.match(/ocid=([^&]+)/)[1],
                            attempts: 0,
                            maxAttempts: 3
                        }));

                    this.logMessage(`找到 ${newCourses.length} 个未完成的课程`);

                    if (newCourses.length > 0) {
                        this.config.learningQueue = newCourses;
                        GM_setValue(STORAGE_PREFIX + 'learningQueue', this.config.learningQueue);
                        this.processNextCourse();
                    } else {
                        this.logMessage('没有新的课程需要处理');
                    }
                }
            },
            // 处理下一个课程
            processNextCourse: function() {
                // 检查是否有正在处理的课程
                if (this.config.courseStates.processing) {
                    this.logMessage('已有课程正在处理中，请等待完成...');
                    return;
                }

                if (this.config.learningQueue.length === 0) {
                    this.logMessage('太棒了！所有课程都处理完啦！');
                    return;
                }

                const currentCourse = this.config.learningQueue[0];
                if (currentCourse.attempts >= currentCourse.maxAttempts) {
                    this.logMessage(`${currentCourse.name} 尝试了${currentCourse.maxAttempts}次还没成功，先跳过这一课吧~`);
                    this.config.learningQueue.shift();
                    GM_setValue(STORAGE_PREFIX + 'learningQueue', this.config.learningQueue);

                    setTimeout(() => {
                        this.processNextCourse();
                    }, 3000);
                    return;
                }

                // 设置当前处理状态
                this.config.courseStates.inProgress = currentCourse;
                this.config.courseStates.processing = true;
                this.config.courseStates.lastUpdate = Date.now();
                GM_setValue(STORAGE_PREFIX + 'courseStates', this.config.courseStates);

                this.logMessage(`让我们开始学习：${currentCourse.name}`);
                this.logMessage('稍等一下，我正在打开课程页面...');

                setTimeout(() => {
                    currentCourse.attempts++;
                    GM_setValue(STORAGE_PREFIX + 'learningQueue', this.config.learningQueue);

                    if (this.currentWindow && !this.currentWindow.closed) {
                        this.logMessage('咦，好像还有一个课程窗口没关闭，我先帮你关掉它~');
                        this.currentWindow.close();
                    }

                    this.currentWindow = window.open(currentCourse.link, '_blank');
                    this.logMessage('课程页面已经打开啦，让我们开始学习吧！');
                }, 2000 + Math.random() * 1000);
            },
            // 处理考试结果页面
            handleExamResultPage: function() {
                this.logMessage('正在检查考试结果...');

                // 更新题库
                let updatedQuestions = 0;
                document.querySelectorAll('.exam-subject-panel > div').forEach((subjectType) => {
                    const questionType = subjectType.querySelector('.exam-subject-title').textContent.split('（')[0];

                    subjectType.querySelectorAll('.exam-subject-text-panel').forEach((question) => {
                        const questionText = question.querySelector('.exam-subject-text-que-title').textContent.trim();
                        const correctAnswerElement = question.querySelector('.exam-subject-text-queanswar:last-child');

                        if (correctAnswerElement) {
                            const correctAnswer = correctAnswerElement.textContent.replace('正确答案：', '').trim();
                            const normalizedQuestion = this.normalizeString(questionText);

                            if (!this.config.localQuestionBank[questionType]) {
                                this.config.localQuestionBank[questionType] = {};
                            }

                            if (!this.config.localQuestionBank[questionType][normalizedQuestion]) {
                                this.config.localQuestionBank[questionType][normalizedQuestion] = correctAnswer;
                                updatedQuestions++;
                            }
                        }
                    });
                });

                if (updatedQuestions > 0) {
                    GM_setValue(STORAGE_PREFIX + 'localQuestionBank', this.config.localQuestionBank);
                    this.logMessage(`题库已更新，新增 ${updatedQuestions} 道题目`);
                }

                // 修改结果检查部分
                const resultElement = document.querySelector('.exam-message-question');
                if (resultElement) {
                    const resultText = resultElement.textContent;
                    if (resultText.includes('已合格')) {
                        this.logMessage('太棒了！考试通过了！');
                        this.logMessage('让我帮你记录一下，这样下次就不用重复学习啦~');

                        // 清除处理状态
                        this.config.courseStates.inProgress = null;
                        this.config.courseStates.processing = false;
                        this.config.courseStates.lastUpdate = Date.now();
                        GM_setValue(STORAGE_PREFIX + 'courseStates', this.config.courseStates);

                        if (this.config.learningQueue && this.config.learningQueue.length > 0) {
                            const completedCourse = this.config.learningQueue[0];
                            if (completedCourse.id && !this.config.completedCourses.includes(completedCourse.id)) {
                                this.config.completedCourses.push(completedCourse.id);
                                GM_setValue(STORAGE_PREFIX + 'completedCourses', this.config.completedCourses);
                            }

                            this.config.learningQueue.shift();
                            GM_setValue(STORAGE_PREFIX + 'learningQueue', this.config.learningQueue);
                        }

                        this.logMessage('等待3秒后我们继续下一课...');
                        setTimeout(() => {
                            if (window.opener) {
                                window.opener.postMessage('examCompleted', '*');
                            }
                            window.close();
                        }, 3000);
                    } else {
                        this.logMessage('啊哦，这次没有通过呢，不要灰心，我们再试一次！');
                        setTimeout(() => {
                            if (window.opener) {
                                window.opener.postMessage('examFailed', '*');
                            }
                            window.close();
                        }, 3000);
                    }
                } else {
                    this.logMessage('正在等待考试结果加载...');
                    setTimeout(() => this.handleExamResultPage(), 1000);
                }
            },
            // 添加消息监听
            initMessageListener: function() {
                window.addEventListener('message', (event) => {
                    if (event.data === 'examCompleted') {
                        this.logMessage('准备开始下一课程的学习...');
                        setTimeout(() => {
                            this.processNextCourse();
                        }, 2000);
                    } else if (event.data === 'examFailed') {
                        this.logMessage('让我们休息3秒钟，然后重新尝试...');
                        setTimeout(() => {
                            this.processNextCourse();
                        }, 3000);
                    }
                });
            },
            // 添加题库导入功能
            importQuestionBank: function() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.style.display = 'none';

                input.onchange = async (e) => {
                    try {
                        const file = e.target.files[0];
                        const text = await file.text();
                        const importedBank = JSON.parse(text);

                        // 合并题库
                        this.config.localQuestionBank = this.mergeQuestionBanks(
                            this.config.localQuestionBank,
                            importedBank
                        );

                        GM_setValue(STORAGE_PREFIX + 'localQuestionBank', this.config.localQuestionBank);
                        this.logMessage('题库导入成功！');
                    } catch (error) {
                        this.logMessage('题库导入失败：' + error.message);
                    }
                };

                document.body.appendChild(input);
                input.click();
                document.body.removeChild(input);
            },
            // 更新学习进度
            updateLearningProgress: function() {
                const progress = this.config.learningProgress;
                if (progress.totalCourses > 0) {
                    const percentage = Math.round((progress.completedCourses / progress.totalCourses) * 100);
                    this.logMessage(`学习进度：${percentage}% (${progress.completedCourses}/${progress.totalCourses})`);

                    if (progress.currentCourse) {
                        this.logMessage(`当前课程：${progress.currentCourse.name}`);
                    }
                }

                GM_setValue(STORAGE_PREFIX + 'learningProgress', progress);
            },
            // 优化自动学习流程
            startAutoLearning: async function() {
                this.logMessage('开始自动学习流程...');

                // 重置进度
                this.config.learningProgress = {
                    totalCourses: this.config.learningQueue.length,
                    completedCourses: 0,
                    currentCourse: null
                };

                while (this.config.learningQueue.length > 0) {
                    const course = this.config.learningQueue[0];
                    this.config.learningProgress.currentCourse = course;

                    try {
                        await this.processCourseWithRetry(course);
                        this.config.learningProgress.completedCourses++;
                        this.config.learningQueue.shift();
                    } catch (error) {
                        this.logMessage(`处理课程失败：${error.message}`);
                        if (course.attempts >= this.config.retryConfig.maxRetries) {
                            this.logMessage(`课程 ${course.name} 已达到最大重试次数，跳过`);
                            this.config.learningQueue.shift();
                        }
                    }

                    this.updateLearningProgress();
                    GM_setValue(STORAGE_PREFIX + 'learningQueue', this.config.learningQueue);
                }

                this.logMessage('自动学习完成！');
            },
            // 添加重试机制
            processCourseWithRetry: async function(course) {
                for (let i = 0; i < this.config.retryConfig.maxRetries; i++) {
                    try {
                        await this.processSingleCourse(course);
                        return;
                    } catch (error) {
                        course.attempts++;
                        if (i < this.config.retryConfig.maxRetries - 1) {
                            this.logMessage(`处理课程失败，${this.config.retryConfig.retryDelay/1000}秒后重试...`);
                            await new Promise(resolve => setTimeout(resolve, this.config.retryConfig.retryDelay));
                        } else {
                            throw error;
                        }
                    }
                }
            },
            // 处理单个课程
            processSingleCourse: function(course) {
                return new Promise((resolve, reject) => {
                    try {
                        const win = window.open(course.link, '_blank');

                        // 添加消息监听
                        const messageHandler = (event) => {
                            if (event.data === 'examCompleted') {
                                window.removeEventListener('message', messageHandler);
                                resolve();
                            } else if (event.data === 'examFailed') {
                                window.removeEventListener('message', messageHandler);
                                reject(new Error('考试未通过'));
                            }
                        };

                        window.addEventListener('message', messageHandler);

                        // 设置超时
                        setTimeout(() => {
                            window.removeEventListener('message', messageHandler);
                            reject(new Error('处理超时'));
                        }, 300000); // 5分钟超时
                    } catch (error) {
                        reject(error);
                    }
                });
            },
            // 添加清除已完成课程记录的功能
            clearCompletedCourses: function() {
                this.config.completedCourses = [];
                GM_setValue(STORAGE_PREFIX + 'completedCourses', []);
                this.logMessage('已清除所有已完成课程记录');
            },
            // 添加窗口管理
            currentWindow: null,
            // 添加状态检查方法
            checkCourseState: function() {
                const states = this.config.courseStates;
                const now = Date.now();

                // 如果有正在处理的课程，但超过5分钟没有更新，认为是异常状态
                if (states.processing && (now - states.lastUpdate > 300000)) {
                    this.logMessage('检测到上一个课程可能处理异常，重置状态...');
                    states.processing = false;
                    states.inProgress = null;
                    states.lastUpdate = now;
                    GM_setValue(STORAGE_PREFIX + 'courseStates', states);
                }
            }
        }
    };

    // 模块控制相关函数
    function isModuleEnabled(moduleKey) {
        const key = STORAGE_PREFIX + 'module_' + moduleKey;
        return GM_getValue(key, MODULES[moduleKey].defaultEnabled);
    }

    function setModuleEnabled(moduleKey, enabled) {
        const key = STORAGE_PREFIX + 'module_' + moduleKey;
        GM_setValue(key, enabled);
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            min-width: 250px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;

        // 添加窗口标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            padding: 8px 12px;
            border-bottom: 1px solid #e0e0e0;
            border-radius: 8px 8px 0 0;
            background: linear-gradient(to bottom, #f8f8f8, #f2f2f2);
            display: flex;
            align-items: center;
            cursor: move;
        `;

        // 添加控制按钮
        const controlButtons = document.createElement('div');
        controlButtons.style.cssText = `
            display: flex;
            gap: 6px;
            margin-right: 8px;
        `;

        // 关闭按钮
        const closeBtn = createControlButton('#ff5f57', '#e0443e');
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            createFloatingBall(panel);
        });

        // 最小化按钮
        const minimizeBtn = createControlButton('#ffbd2e', '#dea123');
        minimizeBtn.addEventListener('click', () => {
            const content = panel.querySelector('.panel-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        // 全屏按钮
        const fullscreenBtn = createControlButton('#28c940', '#17bf2e');

        controlButtons.appendChild(closeBtn);
        controlButtons.appendChild(minimizeBtn);
        controlButtons.appendChild(fullscreenBtn);

        // 标题文本
        const titleText = document.createElement('span');
        titleText.textContent = '系统助手';
        titleText.style.cssText = `
            color: #4a4a4a;
            font-size: 13px;
            margin-left: 4px;
        `;

        titleBar.appendChild(controlButtons);
        titleBar.appendChild(titleText);

        // 内容区域
        const content = document.createElement('div');
        content.className = 'panel-content';
        content.style.cssText = `
            padding: 15px;
            color: #333;
            font-size: 13px;
        `;
        content.innerHTML = `
            <div class="quick-actions" style="
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            ">
                <div style="margin-bottom: 8px; color: #666; font-weight: 500;">快捷操作</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                    <button class="action-button" id="btn-select-course" style="
                        padding: 8px;
                        background: #0087f2;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 5px;
                        transition: all 0.2s;
                    ">
                        <svg viewBox="0 0 1024 1024" width="14" height="14">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="currentColor"/>
                        </svg>
                        选课
                    </button>
                    <button class="action-button" id="btn-my-course" style="
                        padding: 8px;
                        background: #28c940;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 5px;
                        transition: all 0.2s;
                    ">
                        <svg viewBox="0 0 1024 1024" width="14" height="14">
                            <path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3C422 175.1 373.9 161 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32z" fill="currentColor"/>
                        </svg>
                        我的课程
                    </button>
                    <button class="action-button" id="btn-refresh" style="
                        padding: 8px;
                        background: #ffbd2e;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 5px;
                        transition: all 0.2s;
                    ">
                        <svg viewBox="0 0 1024 1024" width="14" height="14">
                            <path d="M512 938.666667C276.362667 938.666667 85.333333 747.637333 85.333333 512S276.362667 85.333333 512 85.333333s426.666667 191.029333 426.666667 426.666667-191.029333 426.666667-426.666667 426.666667z" fill="currentColor"/>
                            <path d="M512 704c-105.856 0-192-86.144-192-192s86.144-192 192-192a191.232 191.232 0 0 1 149.12 71.04l-48.298667 33.962667A127.573333 127.573333 0 0 0 512 384c-70.570667 0-128 57.429333-128 128s57.429333 128 128 128 128-57.429333 128-128h64c0 105.856-86.144 192-192 192z" fill="currentColor"/>
                        </svg>
                        刷新页面
                    </button>
                </div>
            </div>
            <div class="modules-section" style="
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            ">
                <div style="margin-bottom: 8px; color: #666; font-weight: 500;">功能模块</div>
                <div class="module-list" style="display: flex; flex-direction: column; gap: 8px;">
                    ${Object.entries(MODULES).map(([key, module]) => `
                        <div class="module-item" style="
                            display: flex;
                            flex-direction: column;
                            background: #f5f5f5;
                            border-radius: 4px;
                            overflow: hidden;
                        ">
                            <div style="
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                padding: 8px;
                            ">
                                <div>
                                    <div style="font-weight: 500;">${module.name}</div>
                                    <div style="font-size: 12px; color: #666;">${module.description}</div>
                                </div>
                                <label class="switch" style="
                                    position: relative;
                                    display: inline-block;
                                    width: 40px;
                                    height: 20px;
                                ">
                                    <input type="checkbox" id="module-${module.key}"
                                        ${isModuleEnabled(key) ? 'checked' : ''}
                                        style="opacity: 0; width: 0; height: 0;">
                                    <span class="slider"></span>
                                </label>
                            </div>
                            ${module.key === 'auto_select' ? `
                                <div id="autoSelectPanel" class="module-panel" style="
                                    display: ${isModuleEnabled(key) ? 'block' : 'none'};
                                    padding: 10px;
                                    background: white;
                                    border-top: 1px solid #eee;
                                ">
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 5px; color: #666;">选择年份</label>
                                        <select id="yearSelect" style="
                                            width: 100%;
                                            padding: 6px;
                                            border: 1px solid #ddd;
                                            border-radius: 4px;
                                        "></select>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 5px; color: #666;">累计学时</label>
                                        <div style="display: flex; gap: 8px;">
                                            <input type="number" id="hoursInput" style="
                                                flex: 1;
                                                padding: 6px;
                                                border: 1px solid #ddd;
                                                border-radius: 4px;
                                                text-align: center;
                                            ">
                                            <button id="resetHoursBtn" style="
                                                padding: 6px 12px;
                                                background: #ff3b30;
                                                color: white;
                                                border: none;
                                                border-radius: 4px;
                                                cursor: pointer;
                                            ">清除</button>
                                        </div>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: flex; align-items: center; gap: 8px;">
                                            <input type="checkbox" id="selectThreeHours" checked>
                                            <span style="color: #666;">只选择3学时课程</span>
                                        </label>
                                    </div>
                                    <button id="startSelectBtn" style="
                                        width: 100%;
                                        padding: 8px;
                                        background: #0087f2;
                                        color: white;
                                        border: none;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        font-weight: 500;
                                    ">开始选课</button>
                                </div>
                            ` : ''}
                            ${module.key === 'smart_learning' ? `
                                <div id="smartLearningPanel" class="module-panel" style="
                                    display: ${isModuleEnabled(key) ? 'block' : 'none'};
                                    padding: 10px;
                                    background: white;
                                    border-top: 1px solid #eee;
                                ">
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: flex; align-items: center; gap: 8px;">
                                            <input type="checkbox" id="autoSubmitCheckbox" ${MODULES.SMART_LEARNING.config.autoSubmit ? 'checked' : ''}>
                                            <span style="color: #666;">自动交卷</span>
                                        </label>
                                    </div>
                                    <button id="downloadQuestionBank" style="
                                        width: 100%;
                                        padding: 8px;
                                        background: #0087f2;
                                        color: white;
                                        border: none;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        font-weight: 500;
                                    ">下载题库</button>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="timer-section" style="
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            ">
                <div style="margin-bottom: 8px; color: #666; font-weight: 500;">定时设置</div>
                <div style="margin-bottom: 10px;">
                    <div style="margin-bottom: 8px;">设定关闭时间: <span id="closeTimeDisplay" style="color: #666;"></span></div>
                    <div style="margin-bottom: 8px;">剩余时间: <span id="remainingTimeDisplay" style="color: #0087f2;"></span></div>
                </div>
                <div style="margin-bottom: 15px;">
                    <div style="margin-bottom: 8px;">设置定时关闭小时数:</div>
                    <div style="display: flex; gap: 8px;">
                        <input type="number" id="closeHourInput" value="${DEFAULT_CLOSE_HOURS}" min="1"
                            style="
                                width: 60px;
                                padding: 4px 8px;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                                text-align: center;
                            ">
                        <button id="setTimeButton" style="
                            padding: 4px 12px;
                            background: #0087f2;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            flex-grow: 1;
                        ">设置</button>
                    </div>
                </div>
            </div>
            <button id="closeNowButton" style="
                width: 100%;
                padding: 8px;
                background: #ff3b30;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            ">立即关闭</button>
        `;

        panel.appendChild(titleBar);
        panel.appendChild(content);
        document.body.appendChild(panel);

        // 添加拖拽功能
        makeDraggable(panel, titleBar);

        // 绑定快捷操作按钮事件
        bindQuickActions();

        // 添加模块开关事件监听
        Object.entries(MODULES).forEach(([key, module]) => {
            const checkbox = document.getElementById(`module-${module.key}`);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    setModuleEnabled(key, e.target.checked);

                    // 处理自动选课面板的显示/隐藏
                    if(module.key === 'auto_select') {
                        const panel = document.getElementById('autoSelectPanel');
                        if(panel) {
                            panel.style.display = e.target.checked ? 'block' : 'none';
                        }
                    }

                    // 如果在模块相关页面,立即生效
                    if (module.urls.some(url => window.location.href.includes(url))) {
                        if (e.target.checked) {
                            module.initialize();
                        } else {
                            window.location.reload();
                        }
                    }
                });
            }
        });

        return panel;
    }

    // 创建控制按钮的辅助函数
    function createControlButton(color, hoverColor) {
        const button = document.createElement('div');
        button.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: ${color};
            cursor: pointer;
            transition: background-color 0.2s;
        `;

        button.addEventListener('mouseover', () => button.style.backgroundColor = hoverColor);
        button.addEventListener('mouseout', () => button.style.backgroundColor = color);

        return button;
    }

    // 添加拖拽功能
    function makeDraggable(element, handle, callbacks = {}) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            if (callbacks.onDragStart) {
                callbacks.onDragStart();
            }
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // 计算新位置
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            // 边界检查
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;

            newTop = Math.max(0, Math.min(newTop, maxY));
            newLeft = Math.max(0, Math.min(newLeft, maxX));

            // 设置新位置
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;

            if (callbacks.onDragEnd) {
                callbacks.onDragEnd();
            }
        }
    }

    // 添加跨域通信功能
    function broadcastCloseTime(closeTime) {
        GM_setValue(CLOSE_TIME_KEY, closeTime);
    }

    // 添加值变化监听
    GM_addValueChangeListener(CLOSE_TIME_KEY, (name, old_value, new_value, remote) => {
        if (remote) {
            updatePanel();
        }
    });

    // 修改获取时间的函数
    function getCloseTime() {
        return GM_getValue(CLOSE_TIME_KEY, 0);
    }

    // 添加 setCloseTime 函数
    function setCloseTime(hours) {
        const now = new Date();
        const closeTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
        broadcastCloseTime(closeTime.getTime());
        updatePanel();
    }

    // 修改检查时间函数
    function checkTime() {
        const closeTime = getCloseTime();
        const now = new Date().getTime();

        if (closeTime <= now) {
            const newCloseTime = now + DEFAULT_CLOSE_HOURS * 60 * 60 * 1000;
            broadcastCloseTime(newCloseTime);
            return;
        }

        updatePanel();
    }

    // 修改关闭函数
    function closeWindow() {
        // 获取当前域名下的所有标签页
        const currentHost = window.location.host;

        // 如果是登录页面，发送关闭信号后保持打开
        if(window.location.href.includes('/njwsbs/index.do?method=login')) {
            broadcastCloseTime(0); // 发送立即关闭信号
            return;
        }

        // 其他页面收到关闭信号后关闭
        window.close();
    }

    // 修改初始化函数
    function initCloseTimer() {
        const savedCloseTime = getCloseTime();
        const now = new Date().getTime();

        // 如果收到立即关闭信号(closeTime = 0)，直接关闭非登录页面
        if(savedCloseTime === 0 && !window.location.href.includes('/njwsbs/index.do?method=login')) {
            window.close();
            return;
        }

        // 如果没有存储关闭时间或者存储的时间已过期,重新设置
        if (!savedCloseTime || savedCloseTime <= now) {
            setCloseTime(DEFAULT_CLOSE_HOURS);
        }

        createControlPanel();
        setInterval(checkTime, 60 * 1000);
        updatePanel();
    }

    // ================ 课程列表合并功能 ================

    // 等待页面加载完成
    function waitForPageLoad() {
        // 检查是课程列表页还是我的课程页
        if(window.location.href.includes('/search/courselist')) {
            if(document.querySelector('.list-courses')) {
                initCourseList();
            } else {
                setTimeout(waitForPageLoad, 100);
            }
        } else if(window.location.href.includes('/auc/myCourse')) {
            if(document.querySelector('.mycourse-courselist')) {
                initMyCourse();
            } else {
                setTimeout(waitForPageLoad, 100);
            }
        }
    }

    // 处理课程列表页
    async function initCourseList() {
        // 获取当前URL的参数
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(urlParams.get('p')) || 1;

        // 要合并的页数(这里设置合并5页)
        const pagesToFetch = 5;
        const allCourses = [];

        // 获取当前页面的课程列表
        const currentCourses = Array.from(document.querySelectorAll('.list-courses > li:not(.no-data)'));
        allCourses.push(...currentCourses);

        // 获取其他页面的数据
        for(let i = 1; i < pagesToFetch; i++) {
            const nextPage = currentPage + i;
            try {
                const nextPageHtml = await fetchPage(nextPage);
                const parser = new DOMParser();
                const doc = parser.parseFromString(nextPageHtml, 'text/html');
                const courses = Array.from(doc.querySelectorAll('.list-courses > li:not(.no-data)'));
                if(courses.length === 0) break; // 如果没有更多课程则停止
                allCourses.push(...courses);
            } catch(err) {
                console.error('获取第' + nextPage + '页失败:', err);
                break;
            }
        }

        // 更新课程列表
        updateCourseList(allCourses);

        // 更新分页信息
        updatePagination(allCourses.length);

        // 移除加载提示
        removeLoadingIndicator();
    }

    // 处理我的课程页
    async function initMyCourse() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(urlParams.get('page')) || 1;
        const state = urlParams.get('state') || '';

        // 要合并的页数(这里设置合并5页)
        const pagesToFetch = 5;
        const allCourses = [];

        // 获取当前页面的课程列表
        const currentCourses = Array.from(document.querySelectorAll('table.mycourse-row'));
        allCourses.push(...currentCourses);

        // 获取其他页面的数据
        for(let i = 1; i < pagesToFetch; i++) {
            const nextPage = currentPage + i;
            try {
                const nextPageHtml = await fetchMyCourses(nextPage, state);
                const parser = new DOMParser();
                const doc = parser.parseFromString(nextPageHtml, 'text/html');
                const courses = Array.from(doc.querySelectorAll('table.mycourse-row'));
                if(courses.length === 0) break; // 如果没有更多课程则停止
                allCourses.push(...courses);
            } catch(err) {
                console.error('获取第' + nextPage + '页失败:', err);
                break;
            }
        }

        // 更新课程列表
        updateMyCourseList(allCourses);

        // 更新分页信息
        updatePagination(allCourses.length);

        // 移除加载提示
        removeLoadingIndicator();
    }

    // 获取指定页面的HTML
    function fetchPage(page) {
        // 保持原有的URL参数,只修改页码
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('p', page);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: currentUrl.toString(),
                onload: function(response) {
                    if(response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject('请求失败: ' + response.status);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 获取我的课程页面数据
    function fetchMyCourses(page, state) {
        const url = `/zxpx/auc/myCourse?state=${state}&page=${page}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if(response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject('请求失败: ' + response.status);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 更新课程列表显示
    function updateCourseList(courses) {
        const courseList = document.querySelector('.list-courses');
        // 清空现有列表
        courseList.innerHTML = '';

        // 添加所有课程
        courses.forEach(course => {
            // 克隆课程元素
            const courseClone = course.cloneNode(true);

            // 处理图片加载错误
            const img = courseClone.querySelector('img');
            if(img) {
                img.onerror = function() {
                    this.style.display = 'none';
                };

                if(img.src && img.src.startsWith('http://')) {
                    img.src = img.src.replace('http://', 'https://');
                }
            }

            courseList.appendChild(courseClone);
        });

        // 更新显示的课程数量
        const orderBar = document.querySelector('.list-order-conditions');
        if(orderBar) {
            const firstLink = orderBar.querySelector('a');
            if(firstLink) {
                firstLink.textContent = `全部（${courses.length}）门`;
            }
        }
    }

    // 更新我的课程列表
    function updateMyCourseList(courses) {
        const courseList = document.querySelector('.mycourse-courselist');
        // 保留筛选按钮和标题行
        const selectBar = courseList.querySelector('.mycourse-selectbar');
        const titleBar = courseList.querySelector('.mycourse-list-title');

        // 清空现有列表
        courseList.innerHTML = '';

        // 重新添加筛选按钮和标题行
        courseList.appendChild(selectBar);
        courseList.appendChild(titleBar);

        // 添加所有课程
        courses.forEach(course => {
            // 克隆课程元素
            const courseClone = course.cloneNode(true);

            // 处理图片加载错误
            const img = courseClone.querySelector('img');
            if(img) {
                img.onerror = function() {
                    this.style.display = 'none';
                };

                if(img.src && img.src.startsWith('http://')) {
                    img.src = img.src.replace('http://', 'https://');
                }
            }

            courseList.appendChild(courseClone);
        });
    }

    // 更新分页信息
    function updatePagination(totalItems) {
        const paginationBar = document.querySelector('#reply-pagination');
        if(paginationBar) {
            paginationBar.style.display = 'none';
        }

        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            text-align: center;
            padding: 10px;
            color: #666;
            font-size: 14px;
            margin-top: 10px;
        `;
        infoDiv.textContent = `已显示 ${totalItems} 条课程信息`;
        if(paginationBar) {
            paginationBar.parentNode.appendChild(infoDiv);
        }
    }

    // 添加加载提示
    function addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 20px;
            border-radius: 5px;
            z-index: 9999;
        `;
        loadingDiv.textContent = '正在加载更多课程...';
        document.body.appendChild(loadingDiv);
    }

    function removeLoadingIndicator() {
        const loadingDiv = document.getElementById('loading-indicator');
        if(loadingDiv) {
            loadingDiv.remove();
        }
    }

    // ================ 初始化 ================
    function init() {
        // 初始化定时关闭功能
        initCloseTimer();

        // 检查并初始化启用的模块
        Object.entries(MODULES).forEach(([key, module]) => {
            if (isModuleEnabled(key) && module.urls.some(url => window.location.href.includes(url))) {
                module.initialize();
            }
        });
    }

    // 添加创建悬浮球的函数
    function createFloatingBall(panel) {
        const ball = document.createElement('div');
        ball.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #666;
            transition: all 0.3s ease;
            user-select: none;
        `;

        // 添加图标
        ball.innerHTML = `
            <svg viewBox="0 0 1024 1024" width="20" height="20">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#666"/>
                <path d="M512 320c-105.9 0-192 86.1-192 192s86.1 192 192 192 192-86.1 192-192-86.1-192-192-192zm0 320c-70.6 0-128-57.4-128-128s57.4-128 128-128 128 57.4 128 128-57.4 128-128 128z" fill="#666"/>
            </svg>
        `;

        // 优化拖拽逻辑，添加自动吸附功能
        let isDragging = false;

        function handleDragEnd() {
            if (!isDragging) return;
            isDragging = false;

            // 获取窗口尺寸和球的位置
            const windowWidth = window.innerWidth;
            const ballRect = ball.getBoundingClientRect();
            const ballCenter = ballRect.left + ballRect.width / 2;

            // 判断是否吸附到右侧
            if (ballCenter > windowWidth / 2) {
                ball.style.left = 'auto';
                ball.style.right = '10px';
            } else {
                ball.style.right = 'auto';
                ball.style.left = '10px';
            }
        }

        // 修改拖拽函数
        makeDraggable(ball, ball, {
            onDragStart: () => {
                isDragging = true;
            },
            onDragEnd: handleDragEnd
        });

        // 点击悬浮球显示面板
        ball.addEventListener('click', () => {
            if (!isDragging) {
                panel.style.display = 'block';
                const ballRect = ball.getBoundingClientRect();

                // 根据球的位置决定面板出现的位置
                if (ballRect.left > window.innerWidth / 2) {
                    panel.style.right = (window.innerWidth - ballRect.right) + 'px';
                    panel.style.left = 'auto';
                } else {
                    panel.style.left = ballRect.left + 'px';
                    panel.style.right = 'auto';
                }
                panel.style.top = ballRect.top + 'px';
            }
        });

        document.body.appendChild(ball);
        return ball;
    }

    // 修改更新面板函数
    function updatePanel() {
        const closeTime = new Date(getCloseTime());
        const now = new Date();
        const remainingTime = closeTime - now;

        const displayElement = document.getElementById('closeTimeDisplay');
        const remainingElement = document.getElementById('remainingTimeDisplay');

        if(!displayElement || !remainingElement) return;

        displayElement.textContent = closeTime.toLocaleString();

        if (remainingTime > 0) {
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            remainingElement.textContent = `${hours}小时 ${minutes}分钟`;
        } else {
            remainingElement.textContent = '已到关闭时间';
            closeWindow();
        }
    }

    // 修改事件绑定部分
    function bindQuickActions() {
        const selectCourseBtn = document.getElementById('btn-select-course');
        const myCourseBtn = document.getElementById('btn-my-course');
        const refreshBtn = document.getElementById('btn-refresh');
        const setTimeBtn = document.getElementById('setTimeButton');
        const closeNowBtn = document.getElementById('closeNowButton');

        // 快捷操作按钮
        if(selectCourseBtn) {
            selectCourseBtn.addEventListener('click', () => {
                window.open('https://m.mynj.cn:11188/zxpx/hyper/search/courselist?rt=CT2017110000000074&cls=&ys=&tag=&odr=-1', '_blank');
            });
        }

        if(myCourseBtn) {
            myCourseBtn.addEventListener('click', () => {
                window.open('https://m.mynj.cn:11188/zxpx/auc/myCourse', '_blank');
            });
        }

        if(refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }

        // 定时控制按钮
        if(setTimeBtn) {
            setTimeBtn.addEventListener('click', () => {
                const hours = parseInt(document.getElementById('closeHourInput').value);
                if(hours && !isNaN(hours)) {
                    setCloseTime(hours);
                }
            });
        }

        if(closeNowBtn) {
            closeNowBtn.addEventListener('click', () => {
                closeWindow();
            });
        }

        // 添加按钮悬停效果
        document.querySelectorAll('.action-button').forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.filter = 'brightness(1.1)';
                button.style.transform = 'translateY(-1px)';
            });
            button.addEventListener('mouseout', () => {
                button.style.filter = 'none';
                button.style.transform = 'none';
            });
        });

        // 添加开关按钮样式
        document.querySelectorAll('.switch input[type="checkbox"]').forEach(checkbox => {
            const span = checkbox.nextElementSibling;
            if(span) {
                span.style.cssText += `
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 20px;
                `;

                // 添加滑块
                const slider = document.createElement('span');
                slider.style.cssText = `
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 2px;
                    bottom: 2px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                `;
                span.appendChild(slider);

                // 添加选中状态样式
                checkbox.addEventListener('change', () => {
                    if(checkbox.checked) {
                        span.style.backgroundColor = '#0087f2';
                        slider.style.transform = 'translateX(20px)';
                    } else {
                        span.style.backgroundColor = '#ccc';
                        slider.style.transform = 'translateX(0)';
                    }
                });

                // 初始化状态
                if(checkbox.checked) {
                    span.style.backgroundColor = '#0087f2';
                    slider.style.transform = 'translateX(20px)';
                }
            }
        });
    }

    // 启动脚本
    init();

})();