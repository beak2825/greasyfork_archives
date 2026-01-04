// ==UserScript==
// @name         工作室酷学院加速
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据不同元素触发不同功能：自动填写答案并提交，同时在页面上显示当前的加速倍数
// @author       MADAO_Mu
// @match        https://pro.coolcollege.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535765/%E5%B7%A5%E4%BD%9C%E5%AE%A4%E9%85%B7%E5%AD%A6%E9%99%A2%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/535765/%E5%B7%A5%E4%BD%9C%E5%AE%A4%E9%85%B7%E5%AD%A6%E9%99%A2%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SPEED_FACTOR = 200; // 页面加速倍数

    // 等待特定元素加载完成的函数
    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }

    // 显示加速倍数
    function displaySpeedIndicator() {
        const speedIndicator = document.createElement('div');
        speedIndicator.style = "position: fixed; top: 10px; left: 50%; transform: translateX(-50%); z-index: 10001; background: #1e90ff; color: white; padding: 10px; border-radius: 5px; font-size: 14px; box-shadow: 0px 0px 10px rgba(0,0,0,0.5);";
        speedIndicator.textContent = `当前加速倍数: ${SPEED_FACTOR}x`;
        document.body.appendChild(speedIndicator);
    }

    // 修改 setTimeout 和 setInterval 以加速页面
    function overrideTimers() {
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;

        window.setTimeout = function(callback, delay, ...args) {
            return originalSetTimeout(callback, delay / SPEED_FACTOR, ...args);
        };

        window.setInterval = function(callback, interval, ...args) {
            return originalSetInterval(callback, interval / SPEED_FACTOR, ...args);
        };
    }

    // 添加答题界面
    function addAnswerInterface() {
        const container = document.createElement('div');
        container.style = "position: fixed; top: 10px; left: 10px; z-index: 10000; background: #f8f8f8; padding: 10px; border: 2px solid #007bff; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.3);";
        container.innerHTML = `
            <input type="text" id="answerInput" placeholder="请输入答案" style="width: 300px; margin-bottom: 5px;">
            <button id="submitAnswers" style="margin-right: 5px;">确认答题</button>
            <button id="submitExam">自动交卷</button>
        `;
        document.body.appendChild(container);

        document.getElementById('submitAnswers').addEventListener('click', () => submitAnswers(document.getElementById('answerInput').value.trim()));
        document.getElementById('submitExam').addEventListener('click', submitExam);
    }

    function submitAnswers(answers) {
        answers.split('').forEach((answer, index) => {
            const questionId = `question${index + 1}`;
            const optionValue = mapAnswerToOption(answer);
            if (optionValue) selectAnswerByValue(questionId, optionValue);
        });
    }

    function submitExam() {
        const button = Array.from(document.querySelectorAll('button.ant-btn.ant-btn-primary')).find(button => button.textContent.includes('交卷'));
        if (button) {
            button.click();
            setTimeout(handleConfirmation, 2000);
        }
    }

    function handleConfirmation() {
        const button = document.querySelector("div.ant-modal-confirm-btns button.ant-btn.ant-btn-primary");
        if (button) {
            button.click();
        } else {
            setTimeout(handleConfirmation, 500);
        }
    }

    function mapAnswerToOption(answer) {
        return {
            'a': 'option1',
            'b': 'option2',
            'c': 'option3',
            'd': 'option4',
            '对': 'option1',
            '错': 'option2',
            '1': 'option1',
            '0': 'option2',
            '2': 'option2',
            '3': 'option3',
            '4': 'option4',
        }[answer.toLowerCase()];
    }

    function selectAnswerByValue(questionId, optionValue) {
        const input = document.querySelector(`#${questionId} input[value='${optionValue}']`);
        if (input) input.closest('label').click();
    }

    // 等待 .doc-reader-container 元素加载后执行页面加速
    waitForElement(".doc-reader-container", function() {
        displaySpeedIndicator(); // 显示加速倍数指示器
        overrideTimers(); // 加速页面计时器
    });

    // 等待 #question1 元素加载后添加答题界面
    waitForElement("#question1", function() {
        addAnswerInterface(); // 初始化答题界面
    });
})();
