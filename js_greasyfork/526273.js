// ==UserScript==
// @name         modernstates考试链接提取
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  提取modernstates测验页面中所有考试链接并显示在左上角，点击后弹出包含关闭和打开全部链接按钮的div，并添加开始/提交考试按钮和获取我的网址按钮
// @author       3588
// @match        https://learn.modernstates.org/d2l/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526273/modernstates%E8%80%83%E8%AF%95%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/526273/modernstates%E8%80%83%E8%AF%95%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10px';
    buttonContainer.style.left = '10px';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.display = 'flex';

    // 创建提取按钮
    const extractButton = document.createElement('button');
    extractButton.textContent = '提取考试链接';
    extractButton.style.height = '50px';
    extractButton.style.padding = '10px';
    extractButton.style.marginRight = '10px';
    extractButton.style.cursor = 'pointer';

    // 添加点击事件监听器
    extractButton.addEventListener('click', () => {
        // 提取链接
        const links = document.querySelectorAll('a[href*="/d2l/lms/quizzing/user/quiz_summary.d2l?ou="]');

        // 创建弹出层
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#fff';
        popup.style.padding = '20px';
        popup.style.border = '1px solid #999';
        popup.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '80%';
        popup.style.maxHeight = '80%';
        popup.style.overflow = 'auto';

        // 添加链接到弹出层
        if (links.length > 0) {
            links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.textContent || '考试链接';
                a.style.display = 'block';
                popup.appendChild(a);
            });
        } else {
            const message = document.createElement('span');
            message.textContent = '未找到考试链接';
            popup.appendChild(message);
        }

        // 创建按钮容器
        const popupButtons = document.createElement('div');
        popupButtons.style.marginTop = '10px';
        popupButtons.style.display = 'flex';

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.padding = '8px 15px';
        closeButton.style.marginRight = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(popup);
        });
        popupButtons.appendChild(closeButton);

        // 创建全部打开按钮
        const openAllButton = document.createElement('button');
        openAllButton.textContent = '全部打开';
        openAllButton.style.padding = '8px 15px';
        openAllButton.style.cursor = 'pointer';
        openAllButton.addEventListener('click', () => {
            links.forEach(link => {
                window.open(link.href, '_blank');
            });
        });
        popupButtons.appendChild(openAllButton);

        popup.appendChild(popupButtons);
        document.body.appendChild(popup);
    });

    buttonContainer.appendChild(extractButton);


    // 创建开始/提交考试按钮
    const examButton = document.createElement('button');
    examButton.style.height = '50px';
    examButton.style.padding = '10px';
    examButton.style.cursor = 'pointer';

    // 添加点击事件监听器
    examButton.addEventListener('click', () => {
        // 查找“开始考试”或“提交考试”按钮
        let targetButton = null;
        let buttonText = '';

        const startButtons = document.querySelectorAll('button[type="button"][primary=""]');
        startButtons.forEach(button => {
            if (button.textContent.trim() === 'Start Quiz!') {
                targetButton = button;
                buttonText = 'Start Quiz!';
                return; // 找到“开始考试”按钮后立即停止循环
            }
        });

        if (!targetButton) {
            startButtons.forEach(button => {
                if (button.textContent.trim() === 'Submit Quiz') {
                    targetButton = button;
                    buttonText = 'Submit Quiz';
                    return; // 找到“提交考试”按钮后立即停止循环
                }
            });
        }

        if (targetButton) {
            targetButton.click();
        } else {
            alert('未找到开始或提交考试按钮，请检查页面结构。');
        }
    });

    buttonContainer.appendChild(examButton);

    // 创建获取我的网址按钮
    const myUrlButton = document.createElement('button');
    myUrlButton.textContent = '获取我的网址';
    myUrlButton.style.height = '50px';
    myUrlButton.style.padding = '10px';
    myUrlButton.style.cursor = 'pointer';
    myUrlButton.style.marginLeft = '10px'; // 添加左边距

    // 添加点击事件监听器
    myUrlButton.addEventListener('click', () => {
        const currentUrl = window.location.href;
        window.open(currentUrl, '_blank'); // 在新标签页中打开当前网址
    });

    buttonContainer.appendChild(myUrlButton);

    document.body.appendChild(buttonContainer);

    // 设置按钮文本，在页面加载完成后执行
    window.addEventListener('load', () => {
        let buttonText = '';
        const startButtons = document.querySelectorAll('button[type="button"][primary=""]');
        startButtons.forEach(button => {
            if (button.textContent.trim() === 'Start Quiz!') {
                buttonText = '开始考试';
                return;
            } else if (button.textContent.trim() === 'Submit Quiz') {
                buttonText = '提交考试';
                return;
            }
        });

        // 检查页面上是否有 "Question" 或 "Quiz" 关键词
        const hasQuestionOrQuiz = document.body.textContent.includes('Question') || document.body.textContent.includes('Quiz');

        examButton.textContent = hasQuestionOrQuiz ? (buttonText || '无开始或提交') : ''; // 根据关键词决定是否显示按钮文本
    });
})();