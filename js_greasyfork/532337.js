// ==UserScript==
// @name         LightSail 自动化阅读助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动阅读+答题支持（实验性）
// @author       YourName
// @match        https://lightsailed.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/532337/LightSail%20%E8%87%AA%E5%8A%A8%E5%8C%96%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532337/LightSail%20%E8%87%AA%E5%8A%A8%E5%8C%96%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置参数
    const config = {
        scrollInterval: 5000,    // 滚动间隔(ms)
        answerDelay: 2000,       // 答题延迟
        debugMode: false         // 调试模式
    };

    // 自动滚动阅读
    function autoScroll() {
        const scrollStep = 500;
        window.scrollBy(0, scrollStep);
        if (config.debugMode) console.log('[AutoScroll] 已滚动位置');
        setTimeout(autoScroll, config.scrollInterval);
    }

    // 智能答题逻辑
    function intelligentAnswer() {
        const questions = document.querySelectorAll('.question-item');
        questions.forEach((q, index) => {
            setTimeout(() => {
                const correctOption = findCorrectOption(q);
                if (correctOption) {
                    correctOption.click();
                    if (config.debugMode) console.log(`[Answer] 第 ${index+1} 题已作答`);
                }
            }, index * config.answerDelay);
        });
    }

    // 模拟人工寻找答案（示例逻辑）
    function findCorrectOption(questionElement) {
        // 策略1：查找预设答案标记
        if (questionElement.querySelector('.correct-mark')) {
            return questionElement.querySelector('.correct-mark');
        }

        // 策略2：最长选项推测
        const options = questionElement.querySelectorAll('.option-item');
        let maxLength = 0;
        let probableOption = null;
        options.forEach(opt => {
            if (opt.textContent.length > maxLength) {
                maxLength = opt.textContent.length;
                probableOption = opt;
            }
        });
        return probableOption;
    }

    // 界面控制
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style = 'position:fixed;top:20px;right:20px;z-index:9999;background:#fff;padding:10px;box-shadow:0 0 10px rgba(0,0,0,0.2);';
        panel.innerHTML = `
            <h3>自动化控制</h3>
            <button onclick="window.automationStart()">开始阅读</button>
            <button onclick="window.automationStop()">停止所有</button>
        `;
        document.body.appendChild(panel);
    }

    // 全局方法
    window.automationStart = () => {
        if (location.pathname.includes('/reading')) {
            autoScroll();
            GM_notification({ text: '自动阅读已启动' });
        } else if (location.pathname.includes('/quiz')) {
            intelligentAnswer();
            GM_notification({ text: '自动答题已触发' });
        }
    };

    window.automationStop = () => {
        window.location.reload();
    };

    // 初始化
    (function init() {
        // 等待页面加载完成
        setTimeout(() => {
            createControlPanel();
            if (config.debugMode) console.log('[Init] 脚本已加载');
            
            // 自动检测页面类型
            if (location.pathname.includes('/reading')) {
                window.automationStart();
            }
        }, 3000);
    })();

})();