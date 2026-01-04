// ==UserScript==
// @name         广东专技继续教育学习辅助工具
// @namespace    https://greasyfork.org
// @version      2.4
// @description  自动播放视频，自动选择并提交答案，避免自动化检测
// @author       midpoint
// @match        *https://ggfw.hrss.gd.gov.cn/zxpx/auc/play/player?*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520370/%E5%B9%BF%E4%B8%9C%E4%B8%93%E6%8A%80%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/520370/%E5%B9%BF%E4%B8%9C%E4%B8%93%E6%8A%80%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    // 控制变量
    let isRunning = true;
    let isRight = true;
    let mainIntervalId;
    let quizIntervalId;
    let quizIntervalId1;
    let quizIntervalId2;
    let mmin = 2000;
    let mmax = 24000;
    // 随机生成时间间隔 (单位: 毫秒)
    function getRandomInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 点击左下角的播放按钮
    function clickPlayButton() {
        const playButton = document.querySelector('.prism-big-play-btn');
        if (playButton) {
            playButton.click();
            console.log("已点击左下角播放按钮，开始播放视频");
        } else {
            console.log("未找到左下角播放按钮，可能视频已经在播放中");
        }
    }

    // 检查视频进度是否已完成
    function checkVideoCompletion() {
        const progressElement = document.querySelector('.learnpercent span');
        if (progressElement && progressElement.innerText.includes('已完成')) {
            console.log("视频已完成，准备点击右下角播放按钮以切换到下一个视频");
            clickLearningButton();
            // 延迟 1-2 秒后点击左下角播放按钮
            quizIntervalId2 = setTimeout(() => {
                clickPlayButton()
            }, getRandomInterval(1000, 2000));
        } else {
            console.log("视频未完成，继续播放");
        }
    }

    // 点击右下角播放按钮以切换到下一个视频
    function clickLearningButton() {
        const learnButton = document.querySelector('span.append-plugin-tip a');
        if (learnButton) {
            learnButton.click();
            console.log("点击了右下角播放按钮，切换到下一个视频");
        } else {
            console.log("未找到右下角播放按钮");
        }
    }

    // 检查答题弹窗
    function checkAnswerPopup() {
        const popup = document.querySelector('.panel.window');
        if (popup && popup.style.display === 'block') {
            console.log("检测到答题弹窗，开始自动答题");
            handleAnswer();
        }
    }

    // 处理答题
    function handleAnswer() {
        const answerA = document.querySelector('#adiv .exam-subject-text-queanswar-answer');
        const answerB = document.querySelector('#bdiv .exam-subject-text-queanswar-answer');
        const submitButton = document.querySelector('.exam-subject-btn .reply-sub');

        if (!answerA || !answerB || !submitButton) {
            console.error('未找到选项或提交按钮，答题逻辑无法继续');
            return;
        }
        if (isRight) {
            // 选择答案 A 并提交
            answerA.click();
            console.log('选择答案 A');
            submitButton.click();
            console.log('提交答案 A');
            isRight = false;
        } else {
            // 选择答案 B 并提交
            answerB.click();
            console.log('选择答案 B');
            submitButton.click();
            console.log('提交答案 B');
            isRight = true;
        }
        // 等待反馈弹窗
        quizIntervalId1 = setTimeout(() => {
            const feedbackPopup = document.querySelector('.messager-body.panel-body.panel-body-noborder.window-body');
                console.log('等待反馈弹窗');
                const confirmButton = document.querySelector('.dialog-button.messager-button a');
                if (confirmButton) {
                        confirmButton.click(); // 关闭弹窗
                        console.log('关闭提示框');
                    }
        }, getRandomInterval(1000, 2000)); // 随机等待
    }

    // 主执行函数，检测页面并进行操作
    function main() {
        console.log("脚本已启动！");
        // 延迟 1-2 秒后点击左下角播放按钮
        quizIntervalId = setTimeout(() => {
                addStopButton();
                clickPlayButton()
            }, getRandomInterval(1000, 2000));
        // 随机间隔时间监测视频和答题弹窗
        mainIntervalId = setInterval(() => {
            if (isRunning) {
                checkVideoCompletion();
                checkAnswerPopup();
            }
        }, getRandomInterval(mmin, mmax)); // 随机间隔时间

        // 初始执行检查
    }
    /** 停止脚本 */
    function stopScript() {
        console.log("脚本已停止！");
        clearInterval(mainIntervalId);
        clearInterval(quizIntervalId);
        clearInterval(quizIntervalId1);
        clearInterval(quizIntervalId2);
        isRunning = false;
    }
    function addStopButton() {
        // 添加停止脚本按钮
        const stopButton = document.createElement('button');
        stopButton.innerText = "停止脚本";
        stopButton.style.position = "fixed";
        stopButton.style.bottom = "10px";
        stopButton.style.right = "10px";
        stopButton.style.zIndex = "1000";
        stopButton.style.padding = "10px 20px";
        stopButton.style.backgroundColor = "red";
        stopButton.style.color = "white";
        stopButton.style.border = "none";
        stopButton.style.borderRadius = "5px";
        stopButton.style.cursor = "pointer";
        stopButton.addEventListener('click', stopScript);
        document.body.appendChild(stopButton);
    }

    // 启动脚本
    main();
})();
