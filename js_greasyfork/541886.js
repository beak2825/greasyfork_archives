// ==UserScript==
// @name         思纽DeepSeek 自动答题助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动识别题型，调用 DeepSeek 接口进行自动答题，支持判断题、单选题、多选题、填空题，并支持暂停/继续，防止接口卡死
// @author       老师
// @match        https://*.ketangx.net/learn/NewExam*
// @match        https://*.ketangx.net/learn/NewExam/*
// @grant        none
// @license
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541886/%E6%80%9D%E7%BA%BDDeepSeek%20%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541886/%E6%80%9D%E7%BA%BDDeepSeek%20%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = 'sk-0913130abeab479b9bcf30fecc776347';
    const API_URL = 'https://api.deepseek.com/v1/chat/completions';

    let isRunning = false;
    let isPaused = false;
    let questions = [];
    let currentIndex = 0;

    const panel = document.createElement('div');
    panel.innerHTML = `
        <div id="deepseek-panel" style="position: fixed; top: 10px; left: 10px; z-index: 9999; background: #fff; border: 2px solid #4CAF50; padding: 16px; border-radius: 12px; box-shadow: 0 0 12px rgba(0,0,0,0.2); font-family: sans-serif; width: 320px;">
            <div id="deepseek-header" style="cursor: move; font-weight: bold; margin-bottom: 10px;">🧠 DeepSeek 答题助手</div>
            <button id="start-btn" style="margin-right:10px; padding: 6px 12px; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">开始答题</button>
            <button id="pause-btn" style="padding: 6px 12px; background-color: #f44336; color: white; border: none; border-radius: 4px;" disabled>暂停答题</button>
            <div style="margin-top: 10px; font-size: 14px;">
                总题目：<span id="total-count">0</span> 题 已答：<span id="done-count">0</span>题 未答：<span id="left-count">0</span>题
            </div>
            <div id="log-box" style="margin-top:10px; font-size: 13px; max-height: 240px; overflow-y: auto; border-top: 1px solid #ccc; padding-top: 6px; white-space: pre-line;"></div>
        </div>
    `;
    document.body.appendChild(panel);

    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const totalCountSpan = document.getElementById('total-count');
    const doneCountSpan = document.getElementById('done-count');
    const leftCountSpan = document.getElementById('left-count');
    const logBox = document.getElementById('log-box');

    function log(msg) {
        const p = document.createElement('div');
        p.textContent = msg;
        logBox.appendChild(p);
        logBox.scrollTop = logBox.scrollHeight;
    }

    function updateStats() {
        totalCountSpan.textContent = questions.length;
        doneCountSpan.textContent = currentIndex;
        leftCountSpan.textContent = questions.length - currentIndex;
    }

    function makePanelDraggable() {
        const header = document.getElementById('deepseek-header');
        const wrapper = document.getElementById('deepseek-panel');
        let isDragging = false, offsetX = 0, offsetY = 0;

        header.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - wrapper.offsetLeft;
            offsetY = e.clientY - wrapper.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            wrapper.style.left = `${e.clientX - offsetX}px`;
            wrapper.style.top = `${e.clientY - offsetY}px`;
            wrapper.style.right = 'auto';
            wrapper.style.bottom = 'auto';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }
    makePanelDraggable();

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function fetchWithTimeout(resource, options = {}) {
        const { timeout = 15000 } = options;
        return Promise.race([
            fetch(resource, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("请求超时")), timeout)
            )
        ]);
    }

    async function getAnswerFromDeepSeek(questionType, questionText) {
        const body = {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: `你是一个考试答题助手，请严格根据题型与选项内容回答。\n- 判断题只返回 A 或 B（A 表示正确，B 表示错误）\n- 单选题只返回一个字母 A/B/C/D\n- 多选题只返回多个大写字母，用英文逗号隔开，如 A,C,D\n- 简答题只返回填写内容，不要解释，不要分点。\n禁止输出题干分析和其他说明。当前题型是：${questionType}`
                },
                { role: "user", content: questionText }
            ],
            temperature: 0.2
        };

        const res = await fetchWithTimeout(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
            },
            body: JSON.stringify(body),
            timeout: 15000
        });

        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim();
    }

    function getAllQuestions() {
        return Array.from(document.querySelectorAll('.topic.border-all .topic1'))
            .map(el => el.closest('.topic.border-all'));
    }

    async function answerOne(index) {
        const q = questions[index];

        // 这里删除案例分析题的处理逻辑（即删除原有 if (writingDiv) {...} 代码块）

        const stem = q.querySelector('.qsctt, .topic1')?.innerText?.trim().replace(/\(\)/g, '').replace(/\n/g, '');
        const choiceDiv = q.querySelector('.choice');
        const textarea = q.querySelector('textarea');
        const ulOptions = q.querySelectorAll('ul.xuan li');

        let questionType = '';
        let prompt = '';

        if (textarea) {
            questionType = '简答题';
            prompt = `题目：${stem}`;
        } else if (choiceDiv?.querySelectorAll('input[type=radio]').length === 2 && [...choiceDiv.querySelectorAll('label')].some(el => el.textContent.includes('正确') || el.textContent.includes('错误'))) {
            questionType = '判断题';
            prompt = `题目：${stem}\n选项：\nA. 正确\nB. 错误`;
        } else {
            const qtype = choiceDiv?.getAttribute('qtype');
            const inputs = [...choiceDiv.querySelectorAll('input')];
            let options = [];
            if (ulOptions.length > 0) {
                options = [...ulOptions].map(li => li.textContent.trim());
            } else {
                options = inputs.map(i => `${i.value}. ${(i.parentElement.textContent || '').trim()}`);
            }
            if (qtype === '1') questionType = '单选题';
            else if (qtype === '2') questionType = '多选题';
            prompt = `题目：${stem}\n选项：\n${options.join('\n')}`;
        }

        log(`➡️ 第${index + 1}题（${questionType}）：\n${prompt}`);

        const answer = await getAnswerFromDeepSeek(questionType, prompt);
        if (!answer || (!textarea && !/[A-E]/i.test(answer) && questionType !== '简答题')) {
            log(`⚠️ 答案无效或未识别，跳过该题`);
            return true;
        }

        if (textarea) {
            textarea.value = answer;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            const inputs = q.querySelectorAll('input');
            const answerLetters = answer.toUpperCase().match(/[A-E]/g) || [];
            inputs.forEach(input => {
                if (answerLetters.includes(input.value)) {
                    if (!input.checked) input.click();
                } else if (questionType === '多选题' && input.checked) {
                    input.click();
                }
            });
        }

        log(`✅ 答案：${answer}`);
         return true;
    }

    async function startAnswer() {
        if (isRunning) return;
        isRunning = true;
        isPaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        questions = getAllQuestions();
        updateStats();
        log(`📋 检测到 ${questions.length} 道题`);

        // 从暂停点继续答题，避免每次都从0开始
        // 这里不重置 currentIndex，允许从暂停点继续

        while (currentIndex < questions.length && isRunning) {
            if (isPaused) {
                log('⏸ 已暂停，等待继续...');
                // 等待继续时，start按钮可重新启动并继续答题
                await new Promise(r => {
                    const check = () => {
                        if (!isPaused) r();
                        else setTimeout(check, 500);
                    };
                    check();
                });
            }

            try {
                const answeredCount = await answerOne(currentIndex);
                if (typeof answeredCount === 'number') {
                    currentIndex += answeredCount;
                } else {
                    currentIndex++;
                }
            } catch (e) {
                log(`❌ 第 ${currentIndex + 1} 题异常：${e.message}`);
                currentIndex++;
            }

            updateStats();
            await delay(2000 + Math.random() * 1000);
        }

        if (currentIndex >= questions.length) {
            log('🎉 所有题目答题完成');
            alert('✅ DeepSeek 自动答题完成！');
            // 重置索引，方便后续再次答题
            currentIndex = 0;
        }

        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function pauseAnswer() {
        if (!isRunning) return;
        isPaused = true;
        pauseBtn.disabled = true;
        startBtn.disabled = false;
        log('⏸ 答题已暂停');
    }

    startBtn.onclick = () => {
        if (isPaused) {
            // 继续答题
            isPaused = false;
            pauseBtn.disabled = false;
            startBtn.disabled = true;
            log('▶️ 答题继续');
        } else {
            // 新开始
            currentIndex = 0;
        }
        startAnswer();
    };

    pauseBtn.onclick = pauseAnswer;

    log('✅ DeepSeek 自动答题助手就绪');
})();
