// ==UserScript==
// @name         学习教育公需课和专业课视频
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  提前报名所需课程，进入【学习中心】，点击脚本开始按钮。鼠标移到左上角显示控制窗口，移开自动隐藏。
// @author       shadow
// @match        http://sdld.gxk.yxlearning.com/my/learning*
// @match        http://sdld.gxk.yxlearning.com/learning*
// @match        https://sdld.zyk.yxlearning.com/my/learning*
// @match        https://sdld.zyk.yxlearning.com/learning*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/502321/%E5%AD%A6%E4%B9%A0%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%E5%92%8C%E4%B8%93%E4%B8%9A%E8%AF%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/502321/%E5%AD%A6%E4%B9%A0%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%E5%92%8C%E4%B8%93%E4%B8%9A%E8%AF%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const SCRIPT_RUNNING_KEY = 'script_running';
    const ORIGIN_URL_KEY = 'script_origin_url';
    const MAX_LOG_LINES = 100;
    // 浮动窗口样式
    const styles = `
        #floating-window {
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 10px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            font-family: Arial, sans-serif;
        }
        #floating-window button {
            margin: 5px;
        }
    `;

    // 创建浮动窗口
    const createFloatingWindow = () => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);

        const container = document.createElement('div');
        container.id = 'floating-window';

        const startButton = document.createElement('button');
        startButton.textContent = '开始';
        startButton.id = 'start-button';
        // container.appendChild(startButton);

        const pauseButton = document.createElement('button');
        pauseButton.textContent = '暂停';
        pauseButton.id = 'pause-button';
        // container.appendChild(pauseButton);

        // 创建一个div来容纳按钮
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(pauseButton);

        // 将按钮容器和日志文本区域添加到容器中
        container.appendChild(buttonContainer);

        document.body.appendChild(container);

        const log = document.createElement('textarea');
        log.id = 'log';
        log.rows = 5;
        log.cols = 40;
        log.readOnly = true;
        container.appendChild(log);

        // 鼠标移动到页面左上角时显示浮窗
        document.addEventListener('mousemove', (event) => {
            if (event.clientX < 20 && event.clientY < 20) { // 根据需要调整触发区域大小
                container.style.display = 'block';
            }
        });

        // 鼠标在浮窗上时不隐藏浮窗
        container.addEventListener('mouseenter', () => {
            container.style.display = 'block';
        });

        container.addEventListener('mouseleave', () => {
            container.style.display = 'none';
        });
        container.style.display = 'none';
        return {log, startButton, pauseButton};
    };

    // 写入日志
    const writeLog = (message) => {
        console.log(message); // 输出到控制台
        const timestamp = new Date().toISOString();
        const logTextarea = document.getElementById('log');
        if (logTextarea) {
            const lines = logTextarea.value.split('\n');
            if (lines.length >= MAX_LOG_LINES) {
                logTextarea.value = ''; // 清空日志
            }
            logTextarea.value += `[${timestamp}] ${message}` + '\n';
            logTextarea.scrollTop = logTextarea.scrollHeight;
        }
    };

    // 判断当前 URL 是否以特定开头
    const isLearningIndexPage = () => {
        const currentUrl = window.location.href;
        return currentUrl.startsWith('http://sdld.gxk.yxlearning.com/learning/index') || currentUrl.startsWith('https://sdld.zyk.yxlearning.com/learning/index');
    };

    // 检查元素是否可见
    const isElementVisible = (element) => {
        if (!(element instanceof HTMLElement)) {
            throw new Error('参数必须是一个 HTMLElement 对象');
        }

        // 检查元素是否在视口内
        const rect = element.getBoundingClientRect();
        const inViewport = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

        // 检查元素的 CSS 样式
        const style = getComputedStyle(element);
        return (
            inViewport &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0'
        );
    };

    // 脚本功能
    let isRunning = false;
    let initialUrl = ''; // 记录初始url，用于返回
    let intervalId = null;
    let courseLinks;
    let last_index = -1;

    const startScript = () => {
        if (intervalId) return;
        GM_setValue(SCRIPT_RUNNING_KEY, 'true');
        isRunning = true;
        writeLog('脚本开始运行');
        debugger; // 在此位置暂停脚本的执行

        intervalId = setInterval(async () => {
            if (!isLearningIndexPage()) {
                // 查找并点击内容为【学习中】的a标签
                initialUrl = window.location.href
                GM_setValue(ORIGIN_URL_KEY, initialUrl);
                const learningLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === '学习中');
                if (learningLink && isElementVisible(learningLink)) {
                    learningLink.click();
                    writeLog('点击了内容为【学习中】的标签');

                    // 等待页面跳转并加载课程链接
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // 查找所有课程链接
                    courseLinks = Array.from(document.querySelectorAll('div.active[content-index="2"]  a[du-click="courseck"]')).filter(isElementVisible);
                    if (courseLinks.length > 0) {
                        writeLog(`找到 ${courseLinks.length} 个可见课程链接`);
                        // 点击当前课程链接
                        const link = courseLinks[0];
                        link.click();
                        writeLog(`点击了课程链接: 1`);
                        // 等待页面跳转并加载视频
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } else {
                        writeLog('未找到任何可见课程链接');
                        isRunning = false;

                    }
                } else {
                    writeLog('未找到内容为【学习中】的a标签或该标签不可见');
                    isRunning = false;
                }
            } else {
                // 检测视频播放完成并检查条件
                // writeLog('检测视频播放完成并检查条件');
                checkAndClickVideo();
                await waitForVideoCompletionAndCheckCondition();
                // 增加索引，准备点击下一个课程链接
                // 返回到初始 URL
                window.location.href = initialUrl;
                writeLog('返回到初始网页');
                // 等待返回操作完成
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            if (!isRunning) {
                writeLog('所有课程链接已处理完毕');
                pauseScript()
            }
        }, 5000); // 每10秒运行一次
    };

    const pauseScript = () => {
        isRunning = false;
        GM_setValue(SCRIPT_RUNNING_KEY, 'false');
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = null;
        writeLog('脚本已暂停');
    };

    const checkAndClickVideo = () => {
        // 循环检测视频列表，若不为100则点击播放
        let lst = document.querySelectorAll('div.course-list li.videoLi')
        // console.log(lst)
        for (let i = 0; i < lst.length; i++) {
            let row = lst[i];
            let span = row.querySelector('span.badge');
            const content = span.textContent.trim();
            // console.log(content)
            if (content !== '100%') {
                let hasActiveDiv = row.querySelector('div.active') !== null;
                // writeLog(`未完成：${index},last_index:${last_index}`);
                if (!hasActiveDiv) {
                    last_index = i;
                    writeLog('点击视频');
                    row.click()
                }
                break
            }
        }


    };

    // 等待视频播放完成并检查条件
    const waitForVideoCompletionAndCheckCondition = () => {
        return new Promise((resolve) => {
            checkCondition(resolve);
        });
    };

    // 检查条件
    const checkCondition = (callback) => {
        const spanElement = document.querySelector('span[du-html="sumschedule"]');
        if (spanElement) {
            const content = spanElement.textContent.trim();
            if (content === '100.00') {
                // writeLog('条件满足：span 内容等于 100');
                callback();
            } else {
                // writeLog(`条件不满足：span 内容不等于 100  ${content} `);
            }
        } else {
            writeLog('未找到 span 元素');
            callback();
        }

    };

    // 初始化浮动窗口
    const {log, startButton, pauseButton} = createFloatingWindow();

    // 绑定按钮事件
    startButton.addEventListener('click', startScript);
    pauseButton.addEventListener('click', pauseScript);

    // 仅在页面加载完成后显示
    window.onload = () => {
        writeLog('页面加载完成');
        isRunning = GM_getValue(SCRIPT_RUNNING_KEY)
        initialUrl = GM_getValue(ORIGIN_URL_KEY)
        if (isRunning === 'false') {
            isRunning = false
        }
        writeLog(`isRunning: ${isRunning}`);
        if (isRunning) {
            startScript()
        }
    };
})();
