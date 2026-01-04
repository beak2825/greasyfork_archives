// ==UserScript==
// @name         安全微伴 2025-06 可刷课程,考试 (by 浩劫者12345)
// @namespace    http://tampermonkey.net/
// @version      2025-06-14
// @description  安全微伴, 非自动点击版, 直接调API, 速度快. 可刷课程和考试. 受服务端限制, 每 13 秒只能学习一个课程, 超出这个频率即使返回成功也不会更新学习记录. 多线程同时学习多个课程也没用
// @author       浩劫者12345
// @match        https://weiban.mycourse.cn/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539299/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%202025-06%20%E5%8F%AF%E5%88%B7%E8%AF%BE%E7%A8%8B%2C%E8%80%83%E8%AF%95%20%28by%20%E6%B5%A9%E5%8A%AB%E8%80%8512345%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539299/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%202025-06%20%E5%8F%AF%E5%88%B7%E8%AF%BE%E7%A8%8B%2C%E8%80%83%E8%AF%95%20%28by%20%E6%B5%A9%E5%8A%AB%E8%80%8512345%29.meta.js
// ==/UserScript==

// @ts-check

(async function () {
    'use strict';

    const vConsole = (() => {
        const el = document.createElement('div')
        el.classList.add('weiban-console')
        el.innerHTML = /*html*/`
            <div class="console-header">
                <span>安全微伴助手</span>
                <button class="btn-learn">开始刷课</button>
                <span style="font-size: 13px">
                    <span>间隔</span>
                    <input class="learn-interval" value="13500" style="width: 60px">
                    <span>ms</span>
                <button class="btn-exam">开始刷考试</button>
                </span>
            </div>
            <div class="console-text-wrapper"></div>
        `;
        const textEl = /** @type {HTMLDivElement} */(el.querySelector('.console-text-wrapper'))
        const learnIntervalInput = /** @type {HTMLInputElement} */(el.querySelector('.learn-interval'))

        const style = document.createElement('style')
        style.innerHTML = /*css*/`
            .weiban-console {
                position: fixed;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 255, 255, 0.8);
                font-size: 16px;
                z-index: 9999;
            }

            .console-header {
                padding: 4px;
                background-color: rgba(0, 0, 0, 0.1);
            }

            .console-header button {
                font-size: 13px;
                padding: 0 2px;
            }

            .weiban-console .console-text-wrapper {
                width: 400px;
                height: 400px;
                font-size: 14px;
                overflow: auto;
                white-space: pre;
            }

            .weiban-console ::-webkit-scrollbar {
                display: block;
            }

           .weiban-console ::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.15);
            }
        `;

        document.body.appendChild(el)
        document.head.appendChild(style)

        /**
         * @param {HTMLButtonElement} btnEl 
         * @param {TaskFunction} taskFn
         * @param {string} startText 
         * @param {string} stoppText 
         */
        function initToggleButton(btnEl, taskFn, startText, stoppText) {
            /** @type {ReturnType<createTask> | undefined} */
            let task;
            btnEl.onclick = () => {
                if (task == undefined || task.stopped) {
                    task = createTask(taskFn)
                    task.onFinish = () => {
                        btnEl.textContent = startText
                    }
                    btnEl.textContent = stoppText
                } else {
                    task.stop()
                }
            }
        }

        initToggleButton(
            /** @type {HTMLButtonElement} */(el.querySelector('.btn-learn')),
            learnAllCourses,
            '开始刷课',
            '停止刷课'
        )
        initToggleButton(
            /** @type {HTMLButtonElement} */(el.querySelector('.btn-exam')),
            takeAllExams,
            '开始刷考试',
            '停止刷考试'
        )

        const self = {
            /** @param {string} obj */
            log(obj) {
                const str = typeof obj == 'string' ? obj : obj
                const toBottom = textEl.scrollHeight - textEl.scrollTop - textEl.clientHeight

                const line = document.createElement('div')
                line.textContent = str
                textEl.appendChild(line)

                if (toBottom < 50) {
                    textEl.scrollTop = textEl.scrollHeight
                }
            },
            getLearnInterval() {
                return parseInt(learnIntervalInput.value)
            },
        }

        return self
    })()

    /**
     * @typedef {object} User
     * @property {string} token
     * @property {string} userId
     * @property {string} userName
     * @property {string} realName
     * @property {string} userNameLabel
     * @property {string} uniqueValue
     * @property {string} isBind
     * @property {string} tenantCode
     * @property {string} batchCode
     * @property {number} gender
     * @property {number} switchGoods
     * @property {number} switchDanger
     * @property {number} switchNetCase
     * @property {string} preBanner
     * @property {string} normalBanner
     * @property {string} specialBanner
     * @property {string} militaryBanner
     * @property {number} isLoginFromWechat
     * @property {string} tenantName
     * @property {number} tenantType
     * @property {number} loginSide
     * @property {number} popForcedCompleted
     * @property {number} showGender
     * @property {number} showOrg
     * @property {string} orgLabel
     * @property {string} nickName
     * @property {string} imageUrl
     * @property {number} defensePower
     * @property {number} knowledgePower
     * @property {number} safetyIndex
     */


    /** @type {User} */
    let User

    function loadUser() {
        const userStorage = localStorage.getItem('user')
        User = /** @type {User} */(userStorage ? JSON.parse(userStorage) : null)
        if (!User) {
            vConsole.log('用户未登录! 请登录后刷新页面以生效')
        }
    }

    loadUser()

    async function listAllProjects() {
        const projects = await getProjectList();
        if (projects) {
            vConsole.log('获取到用户学习项目:')
            if (projects.length == 0) {
                vConsole.log('没有学习项目')
            }
            for (const project of projects) {
                vConsole.log(project.projectName)
            }
        } else {
            vConsole.log('获取用户学习项目失败')
        }
        return projects
    }

    listAllProjects()

    /**
     * @typedef {object} TaskOptions
     * @property {boolean} stopFlag 
     */

    /** @typedef {(taskOptions: TaskOptions) => Promise} TaskFunction */

    /** @param {TaskFunction} taskFunction  */
    function createTask(taskFunction) {
        /** @type {TaskOptions} */
        let taskOptions = {
            stopFlag: false,
        }
        let stopped = false

        const task = {
            stop() {
                taskOptions.stopFlag = true
            },
            get stopped() {
                return stopped
            },
            onFinish: () => undefined,
        }

        taskFunction(taskOptions).finally(() => {
            stopped = true
            task.onFinish()
        })

        return task
    }

    /** @type {TaskFunction}  */
    async function learnAllCourses(taskOptions) {
        const projects = await listAllProjects()

        if (!projects || !projects.length) return

        for (const project of projects) {
            if (taskOptions.stopFlag) return
            vConsole.log(`获取项目 "${project.projectName}" 的课程分类:`);

            const categories = await getCourseCategories(project.userProjectId);
            if (!categories) {
                vConsole.log(`获取失败`)
                continue
            }
            if (categories.length == 0) {
                vConsole.log(`没有分类`)
                continue
            }

            for (const category of categories) {
                if (taskOptions.stopFlag) return
                vConsole.log(`- ${category.categoryName} (已完成: ${category.finishedNum} / ${category.totalNum})`);

                const courses = await getCourses(project.userProjectId, category.categoryCode);
                if (!courses) {
                    vConsole.log(`   获取课程失败`);
                    continue
                }
                if (courses.length == 0) continue

                for (const course of courses) {
                    if (taskOptions.stopFlag) return
                    vConsole.log(`   - ${course.resourceName}${course.finished == 1 ? ' (已完成)' : ''}`);
                    if (course.finished == 1) continue

                    vConsole.log(`       开始学习课程`);
                    if (!await startStudy(project.userProjectId, course.resourceId)) {
                        vConsole.log(`       失败`);
                        continue
                    }

                    vConsole.log(`       等待 ${vConsole.getLearnInterval()} ms, 服务器限制学习频率, 请耐心等待`);
                    await sleep(vConsole.getLearnInterval())
                    if (taskOptions.stopFlag) return

                    vConsole.log(`       获取验证码`);
                    const captchaResult = await getCaptcha(course.userCourseId, project.userProjectId);
                    if (!captchaResult) {
                        vConsole.log(`       失败`)
                        continue
                    }

                    vConsole.log(`       验证验证码`);
                    const methodToken = await checkCaptcha(course.userCourseId, project.userProjectId, captchaResult.captcha.questionId)
                    if (!methodToken) {
                        vConsole.log(`       失败`)
                        continue
                    }

                    vConsole.log(`       完成学习`);
                    vConsole.log((await finishStudy(course.userCourseId, methodToken))
                        ? `       成功`
                        : `       失败`
                    )
                }
            }
        }
    }

    /** @type {TaskFunction}  */
    async function takeAllExams(taskOptions) {
        const projects = await listAllProjects()

        if (!projects || !projects.length) return

        /** @param {Exam} exam  */
        function printExam(exam) {
            vConsole.log(`- ${exam.examPlanName}  最高成绩: ${exam.examScore} 分  已答 ${exam.examFinishNum} / ${exam.answerNum} 次${(exam.isRetake == 1 && exam.examType == 1) ? '  (补考)' : ''}`)
        }

        /**
         * @param {Exam} exam
         * @param {(question: ExamQuestion, answers: string[]) => void} questionHandler
         * @returns {Promise<boolean>}
         */
        async function startExamWithCallback(exam, questionHandler) {
            vConsole.log(`    开始考试`)
            const examQuestions = await startExam(exam.id)
            if (!examQuestions) {
                vConsole.log(`    失败\n    尝试调用页面验证码进入考试\n    请完成验证码后重试`)
                await gotoProject()
                gotoExam(exam)
                return false
            }

            for (const question of examQuestions) {
                if (taskOptions.stopFlag) return false
                vConsole.log(`    ${question.title}`)

                /** @type {string[]} */
                const answers = []

                questionHandler(question, answers)

                vConsole.log((await submitAnswer(exam.examPlanId, exam.id, question.id, answers.join(',')))
                    ? `    成功`
                    : `    失败`
                )
            }

            for (let i = 5; i > 0; i--) {
                vConsole.log(`    等待 ${i} 秒后交卷, 按 "停止刷考试" 取消交卷`)
                await sleep(1000)
                if (taskOptions.stopFlag) {
                    vConsole.log(`    取消交卷`)
                    return false
                }
            }

            const submitResult = await submitPaper(exam.id)
            vConsole.log(`    ${submitResult ? `交卷成功, 分数: ${submitResult.score}${submitResult.score < 100 ? '\n    没有满分的可以多刷几次, 因为考的次数越多, 能查到的题就越多' : ''}` : '交卷失败!'}`)

            return true
        }

        for (const project of projects) {
            if (taskOptions.stopFlag) return
            vConsole.log(`获取项目 "${project.projectName}" 的考试:`);

            const exams = await getExams(project.userProjectId)
            if (!exams) {
                vConsole.log(`获取失败`)
                continue
            }
            if (exams.length == 0) {
                vConsole.log(`没有考试`)
                continue
            }

            for (const exam of exams) {
                printExam(exam)
            }

            vConsole.log(`查找做过的考试:`)
            const doneExams = exams.filter(x => x.examFinishNum)

            if (doneExams.length == 0) {
                vConsole.log(`找不到已完成考试\n我们需要先故意做错至少一个考试, 获取到答案再做补考`)

                const todoExam = exams[0]
                printExam(todoExam)

                if (!await startExamWithCallback(todoExam, (question, answers) => {
                    answers.push(question.optionList[0].id)
                })) continue

                vConsole.log(`    初次考试已完成\n    再次运行 "刷考试" 即可根据初次考试的答案刷补考`)
                continue
            }

            doneExams.forEach(x => printExam(x))

            /** @type {ExamQuestionAnswer[]} */
            const examAnswers = []

            for (const doneExam of doneExams) {
                if (taskOptions.stopFlag) return
                vConsole.log(`获取答题记录`)

                const examHistory = await getExamHistory(doneExam.examPlanId, doneExam.examType)
                if (!examHistory) {
                    vConsole.log(`获取失败`)
                    continue
                }

                vConsole.log(`正在获取 ${examHistory.length} 个答题分析和答案`)
                for (const history of examHistory) {
                    if (taskOptions.stopFlag) return

                    const answers = await getExamAnswer(history.id)
                    if (!answers) {
                        vConsole.log(`获取失败`)
                        continue
                    }

                    for (const answer of answers) {
                        if (examAnswers.find(x => x.title == answer.title)) continue
                        examAnswers.push(answer)
                    }

                    vConsole.log(`成功`)
                }
            }

            vConsole.log(`成功获取 ${examAnswers.length} 条答案`)

            vConsole.log(`查找未完成考试:`)
            const todoExam = exams.find(x => x.examOddNum && x.examScore < 100)
            if (!todoExam) {
                vConsole.log(`所有考试都已完成!`)
                continue
            }
            printExam(todoExam)

            await startExamWithCallback(todoExam, (question, answers) => {
                const answer = examAnswers.find(x => x.title == question.title)
                if (!answer) {
                    vConsole.log(`    找不到本题答案`)
                    return
                }
                const correctAnswers = answer.optionList.filter(x => x.isCorrect == 1).map(x => x.content)

                for (const option of question.optionList) {
                    if (correctAnswers.includes(option.content)) {
                        vConsole.log(`    ${option.content}`)
                        answers.push(option.id)
                    }
                }
            })
        }
    }

    /** @param {number} ms */
    async function sleep(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(null)
            }, ms);
        })
    }


    // page navigation
    //

    /** @param {string} [projectId] */
    async function gotoProject(projectId) {
        const targetHash = `#/course?projectId=${projectId}&projectType=special`
        if (projectId && location.hash == targetHash) return
        if (!projectId && location.hash.startsWith('#/course?')) return
        location.hash = targetHash
        await sleep(500)
    }

    /**
     * @param {Exam} exam
     * @returns {boolean}
     */
    function gotoExam(exam) {
        try {
            // @ts-expect-error
            document.querySelector('#app>.page').__vue__.navToExamDetail(exam)
            return true
        } catch (error) {
            return false
        }
    }


    // API
    //

    /**
     * @template T
     * @typedef {object} CourseApiResponse
     * @property {string} code
     * @property {T?} data
     * @property {string} detailCode
     * @property {string?} msg
     */

    /**
     * @template T
     * @param {string} url
     * @param {Record<string, string>} params
     * @returns {Promise<CourseApiResponse<T> | undefined>}
     */
    async function CourseApiRequest(url, params) {
        const requestBody = new URLSearchParams()
        for (const key in params) {
            requestBody.append(key, params[key])
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'X-Token': User.token,
                },
                body: requestBody.toString(), // Convert URLSearchParams to a string
                credentials: 'same-origin' // Ensure cookies are sent with same-origin requests
            });

            if (!response.ok) {
                const errorText = await response.text();
                vConsole.log(`请求失败! Status: ${response.status}, Message: ${errorText}`);
                return
            }

            /** @type {CourseApiResponse<T>} */
            const data = await response.json();

            if (data.code != '0') {
                vConsole.log(`请求返回错误码: Code: ${data.code}, DetailCode: ${data.detailCode}, Msg: ${data.msg}`);
            }
            return data

        } catch (error) {
            vConsole.log(`请求出现未知错误:\n${error}`);
        }
    }

    /**
     * @typedef {object} Project
     * @property {string} projectId
     * @property {string} projectName
     * @property {string} projectImageUrl
     * @property {string} endTime
     * @property {number} finished
     * @property {number} progressPet
     * @property {number} exceedPet
     * @property {string} assessment
     * @property {string} userProjectId
     * @property {number} projectMode
     * @property {number} projectCategory
     * @property {number} projectAttribute
     * @property {number} studyState
     * @property {string} studyStateLabel
     * @property {number} certificateAcquired
     * @property {object} completion
     * @property {number} completion.marked
     * @property {number} completion.finished
     * @property {number} completion.grey
     * @property {number} completion.active
     * @property {string} completion.message
     */

    /**
     * 获取用户学习项目
     * @returns {Promise<Project[] | undefined>}
     */
    async function getProjectList() {
        const url = `https://weiban.mycourse.cn/pharos/index/listMyProject.do`;
        const params = {
            tenantCode: User.tenantCode,
            userId: User.userId,
            ended: '2',
        };
        const response = /** @type {CourseApiResponse<Project[]> | undefined} */(await CourseApiRequest(url, params))
        return Array.isArray(response?.data) ? response.data : undefined
    }

    /** @typedef {object} CourseCategory
     * @property {string} categoryCode
     * @property {string} categoryName
     * @property {string} categoryRemark
     * @property {number} totalNum
     * @property {number} finishedNum
     * @property {string} categoryImageUrl
     */

    /**
     * 获取指定学习项目下的课程分类列表
     * @param {string} userProjectId
     * @returns {Promise<CourseCategory[] | undefined>}
     */
    async function getCourseCategories(userProjectId) {
        const url = `https://weiban.mycourse.cn/pharos/usercourse/listCategory.do`;
        const params = {
            tenantCode: User.tenantCode,
            userId: User.userId,
            userProjectId,
            chooseType: '3',
        };
        const response = /** @type {CourseApiResponse<CourseCategory[]> | undefined} */(await CourseApiRequest(url, params))
        return Array.isArray(response?.data) ? response.data : undefined
    }

    /** @typedef {object} Course
     * @property {string} userCourseId
     * @property {string} resourceId
     * @property {string} resourceName
     * @property {number} finished 1 = 已完成, 2 = 未完成
     * @property {number} isPraise
     * @property {number} isShare
     * @property {number} praiseNum
     * @property {number} shareNum
     * @property {number} shared
     * @property {number} source
     * @property {string} imageUrl
     * @property {string} categoryName
     */

    /**
     * 获取指定学习项目和分类下的课程列表
     * @param {string} userProjectId
     * @param {string} categoryCode
     * @returns {Promise<Course[] | undefined>}
     */
    async function getCourses(userProjectId, categoryCode) {
        const url = `https://weiban.mycourse.cn/pharos/usercourse/listCourse.do`;
        const params = {
            tenantCode: User.tenantCode,
            userId: User.userId,
            userProjectId,
            categoryCode,
            chooseType: '3',
        };
        const response = /** @type {CourseApiResponse<Course[]> | undefined} */(await CourseApiRequest(url, params))
        return Array.isArray(response?.data) ? response.data : undefined
    }

    /**
     * 开始学习指定课程, 上传进度前需要先开始学习, 不然状态不更新
     * @param {string} userProjectId
     * @param {string} resourceId
     * @returns {Promise<boolean>}
     */
    async function startStudy(userProjectId, resourceId) {
        const url = `https://weiban.mycourse.cn/pharos/usercourse/study.do`;
        const params = {
            tenantCode: User.tenantCode,
            userId: User.userId,
            userProjectId,
            courseId: resourceId,
        };
        const response = /** @type {CourseApiResponse<undefined> | undefined} */(await CourseApiRequest(url, params))
        return response?.code == '0'
    }

    /** @typedef {object} CaptchaGetResult
     * @property {object} captcha
     * @property {number} captcha.num
     * @property {string} captcha.questionId
     * @property {string} captcha.imageUrl
     */

    /**
     * 获取验证码
     * @param {string} userCourseId
     * @param {string} userProjectId
     * @returns {Promise<CaptchaGetResult | undefined>}
     */
    async function getCaptcha(userCourseId, userProjectId) {
        const url = new URL(`https://weiban.mycourse.cn/pharos/usercourse/getCaptcha.do`);
        url.searchParams.append('userCourseId', userCourseId);
        url.searchParams.append('userProjectId', userProjectId);
        url.searchParams.append('userId', User.userId);
        url.searchParams.append('tenantCode', User.tenantCode);

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                credentials: 'same-origin'
            });

            if (!response.ok) {
                const errorText = await response.text();
                vConsole.log(`获取验证码失败! Status: ${response.status}, Message: ${errorText}`);
            }

            /** @type {CaptchaGetResult | CourseApiResponse<undefined>} */
            const data = await response.json();

            if ('captcha' in data) {
                return data;
            } else {
                vConsole.log(`获取验证码接口返回错误代码: Code: ${data.code}, DetailCode: ${data.detailCode}, Msg: ${data.msg}`);
            }

        } catch (error) {
            vConsole.log(`获取验证码时出现未知错误:\n${error}`);
        }
    }

    /** @typedef {object} CaptchaCheckResult
     * @property {number} checkResult
     * @property {string?} methodToken
     * @property {string} showText
     * @property {string?} errorText
     */

    /**
     * 验证验证码, 不一定需要答对, 直接给固定坐标
     * @param {string} userCourseId
     * @param {string} userProjectId
     * @param {string} questionId
     * @returns {Promise<string | undefined>}
     */
    async function checkCaptcha(userCourseId, userProjectId, questionId) {
        const url = new URL(`https://weiban.mycourse.cn/pharos/usercourse/checkCaptcha.do`);
        url.searchParams.append('userCourseId', userCourseId);
        url.searchParams.append('userProjectId', userProjectId);
        url.searchParams.append('userId', User.userId);
        url.searchParams.append('tenantCode', User.tenantCode);
        url.searchParams.append('questionId', questionId);

        try {
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: 'coordinateXYs=%5B%7B%22x%22%3A57%2C%22y%22%3A417%7D%2C%7B%22x%22%3A142%2C%22y%22%3A422%7D%2C%7B%22x%22%3A209%2C%22y%22%3A420%7D%5D', // 固定坐标
                credentials: 'same-origin'
            });

            if (!response.ok) {
                const errorText = await response.text();
                vConsole.log(`验证验证码失败! Status: ${response.status}, Message: ${errorText}`);
            }

            /** @type {CourseApiResponse<CaptchaCheckResult>} */
            const data = await response.json();

            if (data?.data?.methodToken) {
                return data.data.methodToken;
            } else {
                vConsole.log(`验证验证码失败: ${data.data?.errorText || '未知错误'}`);
            }

        } catch (error) {
            vConsole.log(`验证验证码时出现未知错误:\n${error}`);
        }
    }

    /**
     * 用验证码 `methodToken` 完成学习
     * @param {string} userCourseId
     * @param {string} methodToken
     * @returns {Promise<boolean>}
     */
    async function finishStudy(userCourseId, methodToken) {
        const url = new URL(`https://weiban.mycourse.cn/pharos/usercourse/v2/${methodToken}.do`);
        url.searchParams.append('userCourseId', userCourseId);
        url.searchParams.append('tenantCode', User.tenantCode);
        url.searchParams.append('callback', 'jQuery341011962447562795464_' + Date.now().toString());
        url.searchParams.append('_', Date.now().toString());

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                credentials: 'same-origin'
            });

            if (!response.ok) {
                const errorText = await response.text();
                vConsole.log(`完成学习失败! Status: ${response.status}, Message: ${errorText}`);
            }

            const text = await response.text();
            /** @type {CourseApiResponse<undefined>} */
            const data = text.includes('jQuery') ? JSON.parse(text.split('(')[1].split(')')[0]) : JSON.parse(text)

            if (data.code == '0') {
                return true
            } else {
                vConsole.log(`完成学习接口返回错误代码: Code: ${data.code}, DetailCode: ${data.detailCode}, Msg: ${data.msg}`);
            }

        } catch (error) {
            vConsole.log(`完成学习时出现未知错误:\n${error}`);
        }

        return false
    }

    /** @typedef {object} Exam
     * @property {string} id 通常作为 `userExamPlanId` 调用其他考试接口
     * @property {string} examPlanId
     * @property {string} examPlanName
     * @property {number} answerNum 总可考次数
     * @property {number} answerTime
     * @property {number} passScore
     * @property {number} isRetake 补考
     * @property {number} examType 1 = 补考, 2 = 普通考试
     * @property {number} isAssessment
     * @property {string} startTime
     * @property {string} endTime
     * @property {number} examFinishNum 完成次数
     * @property {number} examOddNum 剩余次数
     * @property {number} examScore
     * @property {number} examTimeState
     * @property {number} displayState
     * @property {string} prompt
     */

    /**
     * 获取考试列表
     * @param {string} userProjectId
     * @returns {Promise<Exam[] | undefined>}
     */
    async function getExams(userProjectId) {
        const url = `https://weiban.mycourse.cn/pharos/exam/listPlan.do`;
        const params = {
            tenantCode: User.tenantCode,
            userId: User.userId,
            userProjectId,
        };
        const response = /** @type {CourseApiResponse<Exam[]> | undefined} */(await CourseApiRequest(url, params))
        return Array.isArray(response?.data) ? response.data : undefined
    }

    /** @typedef {object} ExamHistory
     * @property {string} id
     * @property {number} score
     * @property {number} useTime
     * @property {string} submitTime
     * @property {number} passScore
     * @property {number} isRetake
     */

    /**
     * 获取考试历史记录
     * @param {string} examPlanId
     * @param {number} examType
     * @returns {Promise<ExamHistory[] | undefined>}
     */
    async function getExamHistory(examPlanId, examType) {
        const url = `https://weiban.mycourse.cn/pharos/exam/listHistory.do`;
        const params = {
            tenantCode: User.tenantCode,
            userId: User.userId,
            examPlanId,
            examType: examType.toString(),
        };
        const response = /** @type {CourseApiResponse<ExamHistory[]> | undefined} */(await CourseApiRequest(url, params))
        return Array.isArray(response?.data) ? response.data : undefined
    }

    /** @typedef {object} ExamQuestionAnswer
     * @property {string} title
     * @property {number} type
     * @property {string} typeLabel
     * @property {number} score
     * @property {number} sequence
     * @property {string} analysis
     * @property {number} isRight
     * @property {object[]} optionList
     * @property {string} optionList.content
     * @property {number} optionList.sequence
     * @property {number} optionList.selected
     * @property {number} optionList.isCorrect
     * @property {unknown[]} optionList.attachmentList
     * @property {unknown[]} attachmentList
     */

    /** @typedef {object} ExamReview
     * @property {string} submitTime
     * @property {number} score
     * @property {number} useTime
     * @property {ExamQuestionAnswer[]} questions
     */

    /**
     * 获取考试答题记录和正确答案
     * @param {string} userExamId
     * @returns {Promise<ExamQuestionAnswer[] | undefined>}
     */
    async function getExamAnswer(userExamId) {
        const url = `https://weiban.mycourse.cn/pharos/exam/reviewPaper.do`;
        const params = {
            tenantCode: User.tenantCode,
            userId: User.userId,
            userExamId,
            isRetake: '2',
        };
        const response = /** @type {CourseApiResponse<ExamReview> | undefined} */(await CourseApiRequest(url, params))
        return Array.isArray(response?.data?.questions) ? response.data.questions : undefined
    }

    /** @typedef {object} ExamQuestion
     * @property {string} id
     * @property {string} title
     * @property {number} type
     * @property {string} typeLabel
     * @property {number} score
     * @property {number} sequence
     * @property {number} isRight
     * @property {object[]} optionList
     * @property {string} optionList.id
     * @property {string} optionList.questionId
     * @property {string} optionList.content
     * @property {number} optionList.sequence
     * @property {number} optionList.selected
     * @property {unknown[]} optionList.attachmentList
     * @property {unknown[]} attachmentList
     */

    /** @typedef {object} ExamPaper
     * @property {number} answerTime
     * @property {ExamQuestion} questionList
     */

    /**
     * 开始考试
     * @param {string} userExamPlanId
     * @returns {Promise<ExamQuestion[] | undefined>}
     */
    async function startExam(userExamPlanId) {
        const url = `https://weiban.mycourse.cn/pharos/exam/startPaper.do`;
        const params = {
            tenantCode: User.tenantCode,
            userId: User.userId,
            userExamPlanId,
        };
        const response = /** @type {CourseApiResponse<ExamPaper> | undefined} */(await CourseApiRequest(url, params))
        return Array.isArray(response?.data?.questionList) ? response.data.questionList : undefined
    }

    /**
     * 提交答案
     * @param {string} examPlanId
     * @param {string} userExamPlanId
     * @param {string} questionId
     * @param {string} answerIds 逗号分隔
     * @returns {Promise<boolean>}
     */
    async function submitAnswer(examPlanId, userExamPlanId, questionId, answerIds) {
        const url = `https://weiban.mycourse.cn/pharos/exam/recordQuestion.do`;
        const params = {
            tenantCode: User.tenantCode,
            userId: User.userId,
            examPlanId,
            userExamPlanId,
            questionId,
            answerIds,
            useTime: '10',
        };
        const response = /** @type {CourseApiResponse<ExamPaper> | undefined} */(await CourseApiRequest(url, params))
        return response?.code == '0'
    }

    /** @typedef {object} SubmitPaperResult
     * @property {number} score
     * @property {object} redpacketInfo
     * @property {string} redpacketInfo.redpacketName
     * @property {string} redpacketInfo.redpacketComment
     * @property {number} redpacketInfo.redpacketMoney
     * @property {number} redpacketInfo.isSendRedpacket
     * @property {object} ebookInfo
     * @property {number} ebookInfo.displayBook
     */

    /**
     * 交卷
     * @param {string} userExamPlanId
     * @returns {Promise<SubmitPaperResult | undefined>}
     */
    async function submitPaper(userExamPlanId) {
        const url = `https://weiban.mycourse.cn/pharos/exam/submitPaper.do`;
        const params = {
            tenantCode: User.tenantCode,
            userId: User.userId,
            userExamPlanId,
        };
        const response = /** @type {CourseApiResponse<SubmitPaperResult> | undefined} */(await CourseApiRequest(url, params))
        return (response?.code == '0' && response.data) ? response.data : undefined
    }

})();
