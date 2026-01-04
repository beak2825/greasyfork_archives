// ==UserScript==
// @name         Deepseek自动点击继续生成
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  增强版自动点击继续生成按钮，支持多种按钮类型
// @author       q1001p
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524761/Deepseek%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/524761/Deepseek%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer;
    let isClicked = false;
    let clickCount = 0;
    const cooldownTime = 10000;
    let cooldownInterval;

    // 创建计数器显示元素
    const clickCountText = document.createElement('div');
    Object.assign(clickCountText.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(0, 0, 0)',
        padding: '5px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    });
    clickCountText.innerText = '点击次数: 0';
    document.body.appendChild(clickCountText);

    // 增强版按钮检测函数
    function findContinueButton() {
        const candidates = document.querySelectorAll('button, div[role="button"]');
        
        for (const element of candidates) {
            const text = (element.textContent || '').trim();
            if (text.includes('继续生成')) {
                return element;
            }
        }
        return null;
    }

    // MutationObserver回调
    const observerCallback = () => {
        if (isClicked) return;

        const continueButton = findContinueButton();
        if (continueButton) {
            console.log('检测到继续生成按钮，执行点击');
            continueButton.click();
            clickCount++;
            clickCountText.innerText = `点击次数: ${clickCount}`;

            isClicked = true;
            observer.disconnect();

            // 启动冷却倒计时
            let remaining = cooldownTime / 1000;
            clickCountText.style.color = '#7d7d7d';
            
            cooldownInterval = setInterval(() => {
                remaining--;
                if (remaining <= 0) {
                    clearInterval(cooldownInterval);
                    clickCountText.style.color = '#000';
                    isClicked = false;
                    startObserving();
                }
            }, 1000);
        }
    };

    // 初始化Observer
    function startObserving() {
        observer = new MutationObserver(observerCallback);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    // 初始启动
    startObserving();

    // 添加窗口焦点重新检测
    window.addEventListener('focus', () => {
        if (!isClicked) {
            startObserving();
        }
    });
})();