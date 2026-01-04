// ==UserScript==
// @name         风评计算
// @namespace    https://note.jiepeng.tech
// @version      2024-04-15-3
// @description  计算CC98的风评并在展开按钮点击时进行统计
// @author       ColdInk杰
// @match        https://www.cc98.org/*
// @match        www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @icon         https://www.cc98.org/static/images/心灵头像.gif
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492534/%E9%A3%8E%E8%AF%84%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/492534/%E9%A3%8E%E8%AF%84%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("风评计算中...");

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        .visualization-container {
            border: 1px solid #ddd;
            padding: 15px;
            margin: 15px 0;
            background-color: #f9f9f9;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            animation: fadeIn 0.5s ease-in-out;
        }
        .visualization-container b {
            color: #333;
        }
        .positive-count, .negative-count {
            display: inline-block;
            font-size: 16px;
            margin: 5px 0;
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
        }
        .positive-count {
            background-color: #d4edda;
            color: #155724;
        }
        .negative-count {
            background-color: #f8d7da;
            color: #721c24;
        }
        .reasons-list {
            list-style: none;
            padding: 0;
        }
        .reasons-list li {
            margin: 2px 0;
        }
        .reasons-list li:before {
            content: "•";
            color: #888;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // 插入可视化信息
    function insertVisualizedInfo(reply, positiveCreditsCount, negativeCreditsCount, positiveCreditsReasons, negativeCreditsReasons) {
        let visualizationDiv = document.createElement('div');
        visualizationDiv.className = 'visualization-container';

        // 风评值加的个数
        visualizationDiv.innerHTML += `<div class="positive-count">风评值加的个数: ${positiveCreditsCount}</div>`;

        // 对应的风评值加的理由
        visualizationDiv.innerHTML += "<ul class='reasons-list'>";
        let positiveReasonsSorted = Object.entries(positiveCreditsReasons).sort((a, b) => b[1] - a[1]);
        positiveReasonsSorted.forEach((reason, index) => {
            visualizationDiv.innerHTML += `<li>${index + 1}. ${reason[0]} 出现 ${reason[1]} 次</li>`;
        });
        visualizationDiv.innerHTML += "</ul>";

        // 风评值减的个数
        visualizationDiv.innerHTML += `<div class="negative-count">风评值减的个数: ${negativeCreditsCount}</div>`;

        // 对应的风评值减的理由
        visualizationDiv.innerHTML += "<ul class='reasons-list'>";
        let negativeReasonsSorted = Object.entries(negativeCreditsReasons).sort((a, b) => b[1] - a[1]);
        negativeReasonsSorted.forEach((reason, index) => {
            visualizationDiv.innerHTML += `<li>${index + 1}. ${reason[0]} 出现 ${reason[1]} 次</li>`;
        });
        visualizationDiv.innerHTML += "</ul>";

        // 找到对应的awardInfo类并插入可视化信息
        let awardInfoElement = reply.querySelector('.awardInfo');
        if (awardInfoElement) {
            awardInfoElement.parentNode.insertBefore(visualizationDiv, awardInfoElement.nextSibling);
        }
    }

    let flag = 0;

    // 监听页面加载完成事件
    window.addEventListener('load', function () {
        flag = 0;
        let intervalId = setInterval(() => {
            let showAllButtons = document.querySelectorAll('button');
            showAllButtons.forEach(button => {
                if (button.textContent === '显示全部') {
                    button.click();
                }
            });
            let isAllExpanded = Array.from(showAllButtons).every(button => button.textContent !== '显示全部');
            if (isAllExpanded) {
                clearInterval(intervalId);
                performCreditCalculation();
            }
            if (flag) {
                document.querySelectorAll('button').forEach(button => {
                    if (button.textContent === '收起') {
                        button.click();
                    }
                });
            }
        }, 4000);
    });

    // 点击展开按钮时进行风评统计
    function performCreditCalculation() {
        let replies = document.querySelectorAll('.reply');

        replies.forEach(reply => {
            let creditElements = reply.querySelectorAll('.grades');
            let positiveCreditsCount = 0;
            let negativeCreditsCount = 0;
            let positiveCreditsReasons = {};
            let negativeCreditsReasons = {};

            creditElements.forEach(element => {
                let creditChange = element.innerText;
                let creditReason = element.nextElementSibling.innerText;

                if (creditChange.includes('+')) {
                    positiveCreditsCount++;
                    positiveCreditsReasons[creditReason] = (positiveCreditsReasons[creditReason] || 0) + 1;
                } else if (creditChange.includes('-')) {
                    negativeCreditsCount++;
                    negativeCreditsReasons[creditReason] = (negativeCreditsReasons[creditReason] || 0) + 1;
                }
            });

            if (positiveCreditsCount > 0 || negativeCreditsCount > 0) {
                insertVisualizedInfo(reply, positiveCreditsCount, negativeCreditsCount, positiveCreditsReasons, negativeCreditsReasons);
                flag = 1;
            }
        });
    }

    // 如果页面包含hash跳转，也需要执行风评统计
    window.addEventListener('hashchange', function () {
        flag = 0;
        performCreditCalculation();
    });

    // 监听点击事件，包括超链接的点击
    window.addEventListener('click', function (event) {
        flag = 0;
        if (event.target && event.target.matches && event.target.matches('a.page-link')) {
            let intervalId = setInterval(() => {
                let showAllButtons = document.querySelectorAll('button');
                showAllButtons.forEach(button => {
                    if (button.textContent === '显示全部') {
                        button.click();
                    }
                });
                let isAllExpanded = Array.from(showAllButtons).every(button => button.textContent !== '显示全部');
                if (isAllExpanded) {
                    clearInterval(intervalId);
                    performCreditCalculation();
                }
                if (flag) {
                    document.querySelectorAll('button').forEach(button => {
                        if (button.textContent === '收起') {
                            button.click();
                        }
                    });
                }
            }, 1500);
        }
    });

})();
