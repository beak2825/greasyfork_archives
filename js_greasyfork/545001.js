// ==UserScript==
// @name         华医网自动化考试助手 (V2.3.3 - Key优化版)
// @namespace    http://tampermonkey.net/
// @version      2.3.3
// @description  【Key逻辑优化】构造Key时，增加去除所有括号和空格的步骤，大幅提升匹配的稳定性和容错性。
// @author       Gemini (Key Optimized)
// @match        *://*.91huayi.com/pages/course.aspx*
// @match        *://*.91huayi.com/pages/exam.aspx*
// @match        *://*.91huayi.com/pages/exam_result.aspx*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545001/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8C%96%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%20%28V233%20-%20Key%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545001/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8C%96%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%20%28V233%20-%20Key%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const BASE_ANSWER_DELAY_MS = 500;
    const BASE_SUBMIT_DELAY_MS = 2000;
    const BASE_RETRY_DELAY_MS = 3000;
    const SCRIPT_STATE_KEY = 'exam_script_state_v11'; // 版本号更新
    const COURSE_LIST_URL_FRAGMENT = '/pages/course.aspx';

    // --- 辅助函数 ---
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const getRandomDelay = (base, range = 1500) => base + Math.random() * range;

    // --- 数据存储模块 ---
    const db = {
        load: (key, defaultValue) => {
            const value = GM_getValue(key);
            return value === undefined ? defaultValue : JSON.parse(value);
        },
        save: (key, data) => GM_setValue(key, JSON.stringify(data)),
        clear: (key) => GM_deleteValue(key)
    };

    // --- 数据库定义 (版本号更新) ---
    const correctAnswersDB = { key: 'correct_answers_db_v11', get: () => db.load(correctAnswersDB.key, {}), set: (data) => db.save(correctAnswersDB.key, data) };
    const wrongAttemptsDB = { key: 'wrong_attempts_db_v11', get: () => db.load(wrongAttemptsDB.key, {}), set: (data) => db.save(wrongAttemptsDB.key, data), clear: () => db.clear(wrongAttemptsDB.key) };
    const examQueueDB = { key: 'exam_queue_db_v11', get: () => db.load(examQueueDB.key, []), set: (data) => db.save(examQueueDB.key, data), clear: () => db.clear(examQueueDB.key) };
    const returnUrlDB = { key: 'return_url_db_v11', get: () => db.load(returnUrlDB.key, null), set: (data) => db.save(returnUrlDB.key, data), clear: () => db.clear(returnUrlDB.key) };
    const questionOptionMapDB = { key: 'question_option_map_v11', get: () => db.load(questionOptionMapDB.key, {}), set: (data) => db.save(questionOptionMapDB.key, data), clear: () => db.clear(questionOptionMapDB.key) };
    const debugKeysDB = { key: 'debug_keys_db_v11', get: () => db.load(debugKeysDB.key, []), set: (data) => db.save(debugKeysDB.key, data), clear: () => db.clear(debugKeysDB.key) };


    // --- 核心逻辑 ---

    // --- V2.3.3 核心修改：优化Key的构造逻辑 ---
    function normalizeQuestion(text) {
        if (!text) return '';
        return text
            .trim()                          // 1. 去除首尾空格
            .replace(/^\d+、\s*/, '')      // 2. 去除题号
            .replace(/[()（）]/g, '')        // 3. 【新增】移除所有括号
            .replace(/\s+|　/g, '')         // 4. 【新增】移除所有空白符（包括全角空格）
            .trim();                         // 5. 最后再trim一次确保万无一失
    }

    function normalizeOption(text) {
        if (!text) return '';
        // 选项的标准化逻辑也统一，确保一致性
        return text
            .trim()
            .replace(/^[A-Z]、\s*/, '')
            .replace(/[()（）]/g, '')
            .replace(/\s+|　/g, '')
            .trim();
    }

    function getOptionInfo(optionEl) {
        if (!optionEl) return null;
        const label = optionEl.querySelector('label');
        if (!label) return null;
        const rawText = label.innerText;
        const match = rawText.trim().match(/^([A-Z])、/);
        return {
            letter: match ? match[1] : null,
            content: normalizeOption(rawText), // 使用标准化的选项内容
            element: optionEl.querySelector('input.qo_name')
        };
    }

    function handleCourseListPage() {
        console.log("脚本：进入课程列表页面。");
        const allCourses = document.querySelectorAll('.course');
        if (allCourses.length === 0) return;

        const pendingExams = [];
        allCourses.forEach(courseEl => {
            const statusSpan = courseEl.querySelector('h3 > span');
            const link = courseEl.querySelector('h3 > a.f14blue');
            if (link && statusSpan && !statusSpan.innerText.includes('已完成')) {
                const courseName = link.innerText.trim();
                const href = link.getAttribute('href');
                const cwidMatch = href.match(/cwid=([a-f0-9-]+)/);
                if (cwidMatch && cwidMatch[1]) {
                    pendingExams.push({ cwid: cwidMatch[1], name: courseName });
                }
            }
        });

        if (pendingExams.length > 0) {
            console.log(`脚本：发现 ${pendingExams.length} 个待考课程。已创建考试队列。`);
            examQueueDB.set(pendingExams);
            returnUrlDB.set(window.location.href);
            updatePanel();
            processNextInQueue();
        } else {
            console.log("脚本：所有课程均已完成，无需操作。");
            alert("太棒了！所有课程都已完成！");
            setScriptState(false);
            updatePanel();
        }
    }

    async function handleExamPage() {
        console.log("脚本：进入考试页面。开始根据内容智能作答...");
        const correctAnswers = correctAnswersDB.get();
        const wrongAttempts = wrongAttemptsDB.get();
        const questions = document.querySelectorAll('.tablestyle');
        const questionOptionMap = {};
        const examPageGeneratedKeys = [];

        for (const questionEl of Array.from(questions)) {
            const questionKey = normalizeQuestion(questionEl.querySelector('.q_name').innerText);
            console.log(`[考试页Key生成]: "${questionKey}"`);
            examPageGeneratedKeys.push(questionKey);

            let isAnswered = false;

            const pageOptions = Array.from(questionEl.querySelectorAll('tbody tr')).map(getOptionInfo).filter(Boolean);

            const currentOptionMap = {};
            pageOptions.forEach(opt => {
                if(opt.letter && opt.content) currentOptionMap[opt.content] = opt.letter;
            });
            questionOptionMap[questionKey] = currentOptionMap;

            const knownCorrects = correctAnswers[questionKey] || [];
            if (knownCorrects.length > 0) {
                for (const knownGood of knownCorrects) {
                    for (const pageOpt of pageOptions) {
                        if (pageOpt.content === knownGood.content) {
                            pageOpt.element.click();
                            isAnswered = true; break;
                        }
                    }
                    if (isAnswered) break;
                }
            }

            if (!isAnswered) {
                const knownWrongs = wrongAttempts[questionKey] || [];
                const wrongContents = knownWrongs.map(item => item.content);
                for (const pageOpt of pageOptions) {
                    if (!wrongContents.includes(pageOpt.content)) {
                        pageOpt.element.click();
                        isAnswered = true; break;
                    }
                }
            }

            if (!isAnswered && pageOptions.length > 0) {
                 pageOptions[0].element.click();
                 isAnswered = true;
            }

            if (!isAnswered) {
                console.error("脚本错误：有题目未能作答，流程停止。"); setScriptState(false); updatePanel(); return;
            }
            await sleep(getRandomDelay(BASE_ANSWER_DELAY_MS, 1000));
        }

        console.log("脚本：保存本次考试的<问题-选项内容-字母>映射表...");
        questionOptionMapDB.set(questionOptionMap);
        debugKeysDB.set(examPageGeneratedKeys);

        const submitDelay = getRandomDelay(BASE_SUBMIT_DELAY_MS, 2000);
        console.log(`脚本：作答完毕，将在约 ${(submitDelay / 1000).toFixed(1)} 秒后提交...`);
        await sleep(submitDelay);
        document.getElementById('btn_submit')?.click();
    }

    async function handleResultPage() {
        console.log("脚本：进入结果页面，准备进行高保真学习。");
        const previousExamKeys = debugKeysDB.get();
        if (previousExamKeys.length > 0) {
            console.log("--- 考试页Key摘要 (用于对比) ---");
            console.table(previousExamKeys);
            console.log("---------------------------------");
            debugKeysDB.clear();
        }

        const questionMap = questionOptionMapDB.get();
        if(Object.keys(questionMap).length === 0){
            console.error("无法加载问题映射表，无法进行学习。");
            return;
        }

        const isPassed = !!document.querySelector('.tips_text')?.innerText.includes('考试通过');

        if (isPassed) {
            console.log("考试通过！准备处理下一个课程...");
            console.log("正在清除本次考试的答案库（适配不同考试）...");
            db.clear(correctAnswersDB.key);
            wrongAttemptsDB.clear();

            questionOptionMapDB.clear();
            const cwidMatch = window.location.href.match(/cwid=([a-f0-9-]+)/);
            if (cwidMatch) {
                const completedCwid = cwidMatch[1];
                let queue = examQueueDB.get();
                queue = queue.filter(exam => exam.cwid !== completedCwid);
                examQueueDB.set(queue);
            }
            await sleep(1000);
            processNextInQueue();
        } else {
            console.log("考试未通过。正在更新智能题库并准备重试...");
            const correctAnswers = correctAnswersDB.get();
            const wrongAttempts = wrongAttemptsDB.get();

            document.querySelectorAll('.state_cour_ul .state_cour_lis').forEach(item => {
                const questionKey = normalizeQuestion(item.querySelector('.state_lis_text:first-of-type').title);
                console.log(`[结果页Key生成]: "${questionKey}"`);

                const answerElement = item.querySelectorAll('.state_lis_text')[1];
                if (!answerElement) return;

                const userAnswerContent = normalizeOption(answerElement.innerText.replace(/【您的答案：|】/g, ''));
                const isCorrect = item.querySelector('.state_error').src.includes('bar_img.png');

                const optionsForThisQuestion = questionMap[questionKey];
                if (!optionsForThisQuestion) {
                    console.warn(`警告：在映射表中未找到问题 KEY: "${questionKey}"`);
                    return;
                }
                // 使用标准化的内容在映射表中反查字母
                const userAnswerLetter = optionsForThisQuestion[userAnswerContent];
                if(!userAnswerLetter) {
                    console.warn(`警告：在问题 "${questionKey}" 的映射中未找到答案内容 "${userAnswerContent}"`);
                    return;
                }

                const knowledgeBit = { letter: userAnswerLetter, content: userAnswerContent };

                if (isCorrect) {
                    if (!correctAnswers[questionKey]) correctAnswers[questionKey] = [];
                    if (!correctAnswers[questionKey].some(k => k.content === knowledgeBit.content)) {
                        correctAnswers[questionKey].push(knowledgeBit);
                    }
                    if (wrongAttempts[questionKey]) {
                        wrongAttempts[questionKey] = wrongAttempts[questionKey].filter(k => k.content !== knowledgeBit.content);
                        if (wrongAttempts[questionKey].length === 0) delete wrongAttempts[questionKey];
                    }
                } else {
                    if (!wrongAttempts[questionKey]) wrongAttempts[questionKey] = [];
                    if (!wrongAttempts[questionKey].some(k => k.content === knowledgeBit.content)) {
                        wrongAttempts[questionKey].push(knowledgeBit);
                    }
                }
            });
            correctAnswersDB.set(correctAnswers);
            wrongAttemptsDB.set(wrongAttempts);
            await sleep(getRandomDelay(BASE_RETRY_DELAY_MS, 2000));

            const retryButton = Array.from(document.querySelectorAll('input.state_foot_btn')).find(btn => btn.value === '重新考试');
            if(retryButton) retryButton.click(); else console.error("找不到“重新考试”按钮！");
        }
    }

    function processNextInQueue() {
        const queue = examQueueDB.get();
        if (queue.length > 0) {
            const nextExam = queue[0];
            console.log(`脚本：正在导航到下一个考试，课程名: ${nextExam.name}`);
            window.location.href = `/pages/exam.aspx?cwid=${nextExam.cwid}`;
        } else {
            console.log("队列已清空！所有考试均已完成！");
            const returnUrl = returnUrlDB.get();
            examQueueDB.clear(); returnUrlDB.clear(); wrongAttemptsDB.clear(); questionOptionMapDB.clear();
            setScriptState(false);
            alert("所有待考课程均已完成！脚本已停止。即将返回课程列表页。");
            setTimeout(() => { if (returnUrl) window.location.href = returnUrl; }, 2000);
        }
    }

    // --- UI 控制面板 ---
    function setupUI() {
        if (document.getElementById('exam-helper-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'exam-helper-panel'; document.body.appendChild(panel);
        const dbViewer = document.createElement('div');
        dbViewer.id = 'db-viewer-panel';
        dbViewer.style.display = 'none';
        dbViewer.innerHTML = `<div id="db-viewer-header"><h3>数据库信息 (只读)</h3><span id="db-viewer-close-btn">&times;</span></div><div id="db-viewer-content"></div>`;
        document.body.appendChild(dbViewer);
        dbViewer.querySelector('#db-viewer-close-btn').addEventListener('click', () => dbViewer.style.display = 'none');
        GM_addStyle(`
            #exam-helper-panel { position: fixed; bottom: 20px; right: 20px; background-color: #f0f9ff; border: 2px solid #1e90ff; border-radius: 8px; padding: 15px; z-index: 9999; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.15); width: 260px; font-size: 14px; }
            #exam-helper-panel h3 { margin: 0 0 12px 0; color: #1e90ff; text-align: center; font-size: 16px; }
            #exam-helper-panel button { width: 100%; padding: 8px; margin-bottom: 10px; border: none; border-radius: 5px; color: white; cursor: pointer; font-size: 14px; transition: background-color 0.2s; }
            #exam-helper-panel button:hover { opacity: 0.9; }
            #toggle-script-btn { background-color: #28a745; } #toggle-script-btn.running { background-color: #dc3545; }
            #clear-queue-btn { background-color: #007bff; } #view-db-btn { background-color: #6c757d; } #clear-db-btn { background-color: #ffc107; }
            #exam-helper-panel p { margin: 5px 0; line-height: 1.4; } #exam-helper-panel strong { color: #333; }
            #queue-list-container { background-color: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 5px 10px; margin-top: 10px; max-height: 150px; overflow-y: auto; font-size: 12px; }
            #db-viewer-panel { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; max-width: 800px; height: 80%; max-height: 600px; background-color: #fff; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 10001; flex-direction: column; }
            #db-viewer-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background-color: #f7f7f7; border-bottom: 1px solid #eee; }
            #db-viewer-close-btn { font-size: 24px; color: #888; cursor: pointer; font-weight: bold; }
            #db-viewer-content { padding: 15px; overflow: auto; flex-grow: 1; font-family: Consolas, Monaco, monospace; font-size: 13px; background-color: #fafafa; }
            #db-viewer-content h4 { margin-top: 0; color: #1e90ff; border-bottom: 1px solid #ddd; padding-bottom: 5px;}
            #db-viewer-content pre { white-space: pre-wrap; word-wrap: break-word; margin: 0; }
        `);
        updatePanel();
    }

    function updatePanel() {
        const panel = document.getElementById('exam-helper-panel');
        if (!panel) return;
        const isRunning = getScriptState();
        const queue = examQueueDB.get();
        const currentExam = queue.length > 0 ? queue[0].name : "无";
        const remainingQueue = queue.slice(1);
        let queueHtml = '<p style="color:#888;text-align:center;font-style:italic;">队列为空</p>';
        if (remainingQueue.length > 0) queueHtml = '<ol style="margin:0;padding-left:20px;">' + remainingQueue.map(exam => `<li style="margin-bottom:5px;color:#555;">${exam.name}</li>`).join('') + '</ol>';
        panel.innerHTML = `
            <h3>自动考试控制 V2.3.3</h3>
            <button id="toggle-script-btn">${isRunning ? '暂停自动考试' : '开始自动考试'}</button>
            <button id="clear-queue-btn">清空队列</button>
            <button id="view-db-btn">查看数据库</button>
            <button id="clear-db-btn">清除全部数据(重要)</button>
            <p><strong>脚本状态:</strong> <span style="color: ${isRunning ? '#28a745' : '#dc3545'}; font-weight: bold;">${isRunning ? '运行中' : '已停止'}</span></p>
            <p><strong>当前操作:</strong> <span style="color: #007bff; font-weight: bold;">${currentExam}</span></p>
            <strong>待考列表:</strong>
            <div id="queue-list-container" style="background-color:#fff;border:1px solid #ddd;border-radius:4px;padding:5px 10px;margin-top:10px;max-height:150px;overflow-y:auto;font-size:12px;">${queueHtml}</div>
        `;
        if (isRunning) panel.querySelector('#toggle-script-btn').classList.add('running');
        panel.querySelector('#toggle-script-btn').addEventListener('click', toggleScript);
        panel.querySelector('#view-db-btn').addEventListener('click', showDbInfo);
        panel.querySelector('#clear-queue-btn').addEventListener('click', () => { if (confirm('确定要清空当前的考试队列吗？')) { examQueueDB.clear(); returnUrlDB.clear(); updatePanel(); } });
        panel.querySelector('#clear-db-btn').addEventListener('click', () => {
            if (confirm('【！！！重要！！！】\n确定要清除所有本地数据吗？\n\n新版脚本的数据库结构与旧版不兼容，必须清除旧数据才能正常工作！此操作不可逆！')) {
                db.clear(correctAnswersDB.key); db.clear(wrongAttemptsDB.key); db.clear(examQueueDB.key); db.clear(returnUrlDB.key); db.clear(questionOptionMapDB.key); db.clear(debugKeysDB.key);
                alert('所有数据已清除！脚本现在可以正常运行。'); updatePanel();
            }
        });
    }

    function showDbInfo() {
        const viewer = document.getElementById('db-viewer-panel');
        const contentEl = document.getElementById('db-viewer-content');
        if (!viewer || !contentEl) return;
        const correct = correctAnswersDB.get(); const wrong = wrongAttemptsDB.get();
        contentEl.innerHTML = `<h4>✔️ 正确答案库</h4><pre>${JSON.stringify(correct, null, 2)}</pre><hr style="margin:20px 0;"><h4>❌ 错题本</h4><pre>${JSON.stringify(wrong, null, 2)}</pre>`;
        viewer.style.display = 'flex';
    }

    function getScriptState() { return db.load(SCRIPT_STATE_KEY, false); }
    function setScriptState(isRunning) { db.save(SCRIPT_STATE_KEY, isRunning); }

    function toggleScript() {
        const currentState = getScriptState(); setScriptState(!currentState);
        if (!currentState) main(); else console.log("脚本已由用户暂停。");
        updatePanel();
    }

    function main() {
        setupUI();
        if (!getScriptState()) {
            console.log("脚本当前为停止状态，请在课程列表页点击【开始自动考试】按钮启动。");
            return;
        }
        const urlPath = window.location.pathname;
        if (urlPath.includes(COURSE_LIST_URL_FRAGMENT)) handleCourseListPage();
        else if (urlPath.includes('/exam.aspx')) handleExamPage();
        else if (urlPath.includes('/exam_result.aspx')) handleResultPage();
    }

    main();
})();