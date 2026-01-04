// ==UserScript==
// @name         ZJUT研究生评教
// @namespace    https://greasyfork.org/users/your-username
// @version      1.0
// @description  在问卷页面添加一个按钮，点击后自动填写评分题和文本题，不自动提交问卷
// @author       Your Name
// @match        https://yjsfw.zjut.edu.cn/gsapp/sys/jxpgapp/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520874/ZJUT%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/520874/ZJUT%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮并添加到页面
    const addButton = () => {
        const button = document.createElement('button');
        button.innerText = '自动填写问卷';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '10000';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.2)';

        button.addEventListener('click', () => {
            fillQuestionnaire();
        });

        document.body.appendChild(button);
    };

    // 填写问卷的主函数
    const fillQuestionnaire = () => {
        fillScore();
        fillText();
        console.log("问卷填写完成！请检查填写内容并手动提交。");
    };

    // 填写评分题
    const fillScore = () => {
        const scoreInputs = document.querySelectorAll('input.bh-form-control.inputScore');
        let filled = 0;

        scoreInputs.forEach(input => {
            input.value = "10"; // 设置评分为10
            input.dispatchEvent(new Event('input')); // 触发输入事件
            filled++;
        });

        console.log(`已填写评分题数量：${filled}`);
    };

    // 填写文本题
    const fillText = () => {
        const textAreas = document.querySelectorAll('textarea');
        if (textAreas.length > 0) {
            textAreas[0].value = "非常满意"; // 填写第一个文本框
            textAreas[0].dispatchEvent(new Event('input')); // 触发输入事件
            if (textAreas[1]) {
                textAreas[1].value = "无改进建议"; // 填写第二个文本框
                textAreas[1].dispatchEvent(new Event('input')); // 触发输入事件
            }
            console.log("文本框已填写");
        } else {
            console.log("未找到任何文本框！");
        }
    };

    // 初始化脚本
    addButton();
})();
