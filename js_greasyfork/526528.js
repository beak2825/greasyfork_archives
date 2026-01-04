// ==UserScript==
// @version      1.0.1
// @name         自动点击
// @namespace    https://aic.oceanengine.com/
// @include      https://aic.oceanengine.com/*
// @description  Auto
// @author       You
// @match        https://aic.oceanengine.com/tools/commodity_card?bpId=1802895905078362
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oceanengine.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526528/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/526528/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==
(function() {
    'use strict';


    let isExecuting = false;


    let shouldStop = false;


    let continueIntervalId;


    function checkAndClickGenerateButton() {
        if (isExecuting || shouldStop) {
            return;
        }

        const span = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === '立即生成');
        if (span) {
            const button = span.parentElement;
            if (button) {
                button.click();
                console.log('已点击“立即生成”按钮');
                clickContinueButton(9); // 9次
            } else {
                console.error('未找到span的父级button元素');
            }
        } else {
            console.log('未找到文本内容为“立即生成”的span元素，继续检查...');
        }
    }

    function clickContinueButton(count) {
        if (shouldStop) {
            console.log('停止流程');
            return;
        }

        isExecuting = true;
        let remainingClicks = count;
        continueIntervalId = setInterval(() => {
            if (shouldStop) {
                clearInterval(continueIntervalId);
                isExecuting = false;
                console.log('停止流程');
                return;
            }

            const continueButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === '继续生成');
            if (continueButton) {
                continueButton.click();
                remainingClicks -= 1;
                console.log('已点击“继续生成”按钮，剩余次数：'+remainingClicks);
                if (remainingClicks === 0) {
                    clearInterval(continueIntervalId); // 停止定时器
                    console.log('完成9次“继续生成”按钮的点击');

                    setTimeout(() => {
                        if (!shouldStop) {
                            isExecuting = false;
                            checkAndClickGenerateButton();
                        }
                    }, 30000); // 等待30000毫秒（30秒）
                }
            } else {
                console.log('未找到“继续生成”按钮，继续检查...');
            }
        }, 10000); // 每次点击间隔10000毫秒（10秒）
    }

    function addCustomButtons() {
        const startButton = document.createElement('button');
        startButton.textContent = '开始';
        startButton.style.position = 'fixed';
        startButton.style.top = '10px';
        startButton.style.left = '10px';
        startButton.style.zIndex = '9999';
        startButton.style.padding = '5px 10px';
        startButton.style.fontSize = '14px';
        startButton.style.backgroundColor = 'green';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '50%';
        startButton.style.cursor = 'pointer';
        startButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        startButton.style.transition = 'background-color 0.3s';

        startButton.addEventListener('mouseover', () => {
            startButton.style.backgroundColor = 'darkgreen';
        });

        startButton.addEventListener('mouseout', () => {
            startButton.style.backgroundColor = 'green';
        });

        startButton.addEventListener('click', () => {
            console.log('开始全流程');
            shouldStop = false; // 确保流程可以开始
            checkAndClickGenerateButton();
        });

        const stopButton = document.createElement('button');
        stopButton.textContent = '停止';
        stopButton.style.position = 'fixed';
        stopButton.style.top = '10px';
        stopButton.style.left = '60px';
        stopButton.style.zIndex = '9999';
        stopButton.style.padding = '5px 10px';
        stopButton.style.fontSize = '14px';
        stopButton.style.backgroundColor = 'red';
        stopButton.style.color = 'white';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '50%';
        stopButton.style.cursor = 'pointer';
        stopButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        stopButton.style.transition = 'background-color 0.3s';

        stopButton.addEventListener('mouseover', () => {
            stopButton.style.backgroundColor = 'darkred';
        });

        stopButton.addEventListener('mouseout', () => {
            stopButton.style.backgroundColor = 'red';
        });

        stopButton.addEventListener('click', () => {
            console.log('停止全流程');
            shouldStop = true; // 设置停止标志
            clearInterval(continueIntervalId); // 清除“继续生成”按钮的定时器
            isExecuting = false; // 清除执行标志
        });

        document.body.appendChild(startButton);
        document.body.appendChild(stopButton);
    }

    addCustomButtons();
})();