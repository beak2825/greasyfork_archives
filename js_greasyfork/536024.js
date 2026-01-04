// ==UserScript==
// @name         湖南专技--思想天下学习助手
// @namespace    https://hn.ischinese.cn
// @version      3.0
// @description  自动答题+进度监控+课程切换
// @author       YourName
// @match        https://hn.ischinese.cn/learncenter/play*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536024/%E6%B9%96%E5%8D%97%E4%B8%93%E6%8A%80--%E6%80%9D%E6%83%B3%E5%A4%A9%E4%B8%8B%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/536024/%E6%B9%96%E5%8D%97%E4%B8%93%E6%8A%80--%E6%80%9D%E6%83%B3%E5%A4%A9%E4%B8%8B%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 元素选择器配置
    const SELECTORS = {
        // 答题相关
        question: '#app > div.home-index > div.secondaryContent > div > div.sjsj > div > div > span',
        input: '#app > div.home-index > div.secondaryContent > div > div.sjsj > div > div > div > input',
        submit: '#app > div.home-index > div.secondaryContent > div > div.sjsj > div > span',

        // 进度相关
        progress: '#app > div.home-index > div.secondaryContent > div > div:nth-child(3) > div.main-box > div > div.left-video-box > div.course-progress > div > div > span:nth-child(3)',
        nextCourseBtn: '#app > div.home-index > div.secondaryContent > div > div:nth-child(3) > div.main-box > div > div.left-video-box > div.navigate > ul > li.nextdontcheat'
    };

    // 系统状态控制
    const system = {
        isProcessing: false,      // 答题进行中
        isSwitching: false,       // 切换课程中
        progressCheckTimer: null,// 进度检测定时器
        lastProgress: '0%'       // 上次检测的进度
    };

    // 主功能：自动答题 --------------------------------
    function initAutoAnswer() {
        const observer = new MutationObserver(mutations => {
            if (system.isSwitching) return;

            mutations.forEach(mut => {
                if (mut.addedNodes.length) {
                    handleMathQuestion();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始检查
        handleMathQuestion();
    }

    async function handleMathQuestion() {
        if (system.isProcessing) return;
        system.isProcessing = true;

        try {
            const questionEl = await waitForElement(SELECTORS.question, 3000);
            const questionText = questionEl.textContent.replace(/\s+/g, '');
            console.log('[答题] 题目:', questionText);

            // 解析计算
            const [num1, num2] = questionText.split(/[+－-]/);
            const operator = questionText.includes('+') ? '+' : '-';
            const answer = operator === '+'
                ? parseInt(num1) + parseInt(num2)
                : parseInt(num1) - parseInt(num2);

            // 填写答案
            const input = await waitForElement(SELECTORS.input, 2000);
            input.value = answer;
            triggerInputEvents(input);

            // 提交答案
            const submitBtn = await waitForElement(SELECTORS.submit, 2000);
            submitBtn.click();
            console.log('[答题] 已提交答案:', answer);

        } catch (error) {
            console.warn('[答题] 错误:', error);
        } finally {
            system.isProcessing = false;
        }
    }

    // 主功能：自动切换课程 ----------------------------
    function initProgressMonitor() {
        // 立即执行首次检查
        checkProgress();

        // 启动定时检测（15秒间隔）
        system.progressCheckTimer = setInterval(checkProgress, 15000);

        // 监听元素变化
        const progressEl = document.querySelector(SELECTORS.progress);
        if (progressEl) {
            new MutationObserver(checkProgress).observe(progressEl, {
                characterData: true,
                subtree: true
            });
        }
    }

    async function checkProgress() {
        try {
            const progressEl = await waitForElement(SELECTORS.progress, 3000);
            const current = progressEl.textContent.trim();

            if (current === system.lastProgress) return;
            system.lastProgress = current;
            console.log('[进度] 当前:', current);

            if (current === '100%') {
                await switchCourse();
            }

        } catch (error) {
            console.warn('[进度] 检测失败:', error);
        }
    }

    async function switchCourse() {
        if (system.isSwitching) return;
        system.isSwitching = true;
        console.log('[切换] 开始切换课程');

        try {
            const btn = await waitForElement(SELECTORS.nextCourseBtn, 5000);

            // 模拟人类操作延迟
            await new Promise(r => setTimeout(r, 2000));
            btn.click();
            console.log('[切换] 已点击切换按钮');

            // 等待新课程加载
            await new Promise(r => setTimeout(r, 5000));

            // 重新初始化系统
            system.isSwitching = false;
            initAutoAnswer();
            initProgressMonitor();

        } catch (error) {
            console.error('[切换] 失败:', error);
            system.isSwitching = false;
        }
    }

    // 通用工具函数 --------------------------------
    function waitForElement(selector, timeout) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                if (Date.now() - start > timeout) reject(`元素超时: ${selector}`);
                else setTimeout(check, 100);
            };
            check();
        });
    }

    function triggerInputEvents(input) {
        ['input', 'change'].forEach(eventType => {
            input.dispatchEvent(new Event(eventType, {
                bubbles: true,
                cancelable: true
            }));
        });
    }

    // 系统初始化 --------------------------------
    (function main() {
        // 初始化所有功能
        initAutoAnswer();
        initProgressMonitor();

        // 防SPA路由切换
        let lastHref = location.href;
        setInterval(() => {
            if (location.href !== lastHref) {
                lastHref = location.href;
                system.lastProgress = '0%';
                main();
            }
        }, 2000);
    })();
})();