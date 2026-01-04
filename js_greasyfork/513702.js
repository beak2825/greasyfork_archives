// ==UserScript==
// @name         弹窗题目与答案6.0
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  获取页面上的题目和选项，并以浮窗形式显示
// @author       niuren
// @match        https://lms.sysu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513702/%E5%BC%B9%E7%AA%97%E9%A2%98%E7%9B%AE%E4%B8%8E%E7%AD%94%E6%A1%8860.user.js
// @updateURL https://update.greasyfork.org/scripts/513702/%E5%BC%B9%E7%AA%97%E9%A2%98%E7%9B%AE%E4%B8%8E%E7%AD%94%E6%A1%8860.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有链接
    const links = document.querySelectorAll('.qn_buttons a');

    // 创建一个浮窗元素
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.width = '300px';
    popup.style.height = '400px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid black';
    popup.style.overflowY = 'scroll';
    popup.style.zIndex = '1000';
    document.body.appendChild(popup);

    // 用于存储所有题目信息
    let allQuestions = '';
    let questionCount = 0; // 用于记录题目的序号

    // 遍历所有链接
    links.forEach((link) => {
        const url = link.href;

        // 使用fetch API获取页面内容
        fetch(url)
            .then(response => response.text())
            .then(html => {
                // 解析HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // 提取题目信息（假设题目信息在某个特定的元素中）
                const questionElements = doc.querySelectorAll('.que'); // 根据实际情况调整选择器
                questionElements.forEach(question => {
                    questionCount++; // 增加题目序号
                    const questionText = question.querySelector('.qtext').innerText.trim();
                    const options = Array.from(question.querySelectorAll('.answer .r0, .answer .r1'))
                        .map(option => option.querySelector('.flex-fill').innerText.trim());

                    // 提取正确答案
                    const correctAnswerElement = question.querySelector('.rightanswer');
                    const correctAnswer = correctAnswerElement ? correctAnswerElement.innerText.trim() : '不存在';

                    allQuestions += `题目 ${questionCount}: ${questionText}<br><br>`; 
                    options.forEach((option, optIndex) => {
                        allQuestions += `  选项 ${optIndex + 1}: ${option}<br>`;
                    });
                    allQuestions += `  正确答案: ${correctAnswer}<br><br><hr><br>`;
                });

                // 更新浮窗内容
                popup.innerHTML = allQuestions;

                // 创建关闭按钮
                if (!popup.querySelector('button')) {
                    const closeButton = document.createElement('button');
                    closeButton.innerText = '关闭';
                    closeButton.style.float = 'right';
                    closeButton.style.marginBottom = '10px';
                    closeButton.onclick = () => {
                        popup.remove();
                    };
                    popup.insertBefore(closeButton, popup.firstChild);
                }
            })
            .catch(error => {
                console.error('Error fetching the page:', error);
            });
    });
})();