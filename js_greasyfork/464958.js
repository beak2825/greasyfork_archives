// ==UserScript==
// @name         武汉大学教务系统自动评教-Teaching Evaluation For WHU
// @namespace    plusv
// @version      1.1
// @description  自动评教，点击开始按钮即可执行评教操作。
// @match        https://ugsqs.whu.edu.cn/new/student/rank/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464958/%E6%AD%A6%E6%B1%89%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99-Teaching%20Evaluation%20For%20WHU.user.js
// @updateURL https://update.greasyfork.org/scripts/464958/%E6%AD%A6%E6%B1%89%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99-Teaching%20Evaluation%20For%20WHU.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建开始按钮
    const startBtn = document.createElement('button');
    startBtn.textContent = '任意键评教';
    startBtn.style.position = 'fixed';
    startBtn.style.zIndex = 114514;
    startBtn.style.top = '50%';
    startBtn.style.left = '50%';
    startBtn.style.transform = 'translate(-50%, -50%)';
    startBtn.style.backgroundColor = '#01aba0';
    startBtn.style.border = 'none';
    startBtn.style.borderRadius = '4px';
    startBtn.style.color = '#fff';
    startBtn.style.fontSize = '16px';
    startBtn.style.fontWeight = 'bold';
    startBtn.style.padding = '12px 24px';
    startBtn.style.cursor = 'pointer';
    startBtn.style.transition = 'all 0.3s ease';
    startBtn.style.boxShadow = '0px 2px 6px rgba(0, 0, 0, 0.3)'; // 添加阴影效果
    // 添加圆角
    startBtn.style.webkitBorderRadius = '10px';
    startBtn.style.mozBorderRadius = '10px';
    startBtn.style.borderRadius = '10px';
    document.body.appendChild(startBtn);

    // 点击开始按钮执行评教操作
    startBtn.addEventListener('click', async function() {
        // 获取所有单选题的元素
        const questions = document.querySelectorAll('.dxt');

        // 遍历每个单选题
        questions.forEach(question => {
            // 获取该题的所有选项元素
            const options = question.querySelectorAll('input[type="radio"]')

            // 找到最大的选项值
            let maxOption = options[0];
            for (let i = 1; i < options.length; i++) {
                if (parseFloat(options[i].value) > parseFloat(maxOption.value)) {
                    maxOption = options[i];
                }
            }

            // 点击最大的选项
            maxOption.click();
        });

        // 获取第一个单选题元素
        const question = document.querySelector('.dxt');

        // 获取该题的所有选项元素
        const options = question.querySelectorAll('input[type="radio"]');

        // 点击第二个选项
        options[1].click();

        // 获取文本框元素
        const input = document.querySelector('textarea[name="2259"]');

        // 设置文本框的值为"无"
        input.value = "无";

        // 创建一个名为"input"的事件
        const event = new Event('input', { bubbles: true });

        // 触发文本框的"input"事件
        input.dispatchEvent(event);

        // 获取提交按钮元素
        const submitBtn = document.getElementById('pjsubmit');

        // 点击提交按钮
        submitBtn.click();

        // 等待1秒钟
        await new Promise(resolve => setTimeout(resolve, 100));

        // 在这里执行等待1秒后需要执行的代码
        // 获取关闭按钮元素
        const closeBtn = document.querySelector('#finishDlg button[data-dismiss="modal"]');

        // 点击关闭按钮
        closeBtn.click();
    });

    // 使用 MutationObserver 监听页面变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 如果新增节点是在 body 下，且不是 startBtn 按钮，则重新设置 startBtn 的 z-index 属性
            if (mutation.addedNodes.length && mutation.addedNodes[0].parentNode === document.body && mutation.addedNodes[0] !== startBtn) {
                startBtn.style.zIndex = 114514; // 最高图层的 z-index 值
            }
        });
    });

    // 监听键盘按下事件
    window.addEventListener('keydown', function handleKeyDown(event) {
        // 确保用户按下的是任意键，而不是特殊键，如 shift、ctrl、alt 等
        if (event.keyCode !== 16 && event.keyCode !== 17 && event.keyCode !== 18) {
            // 触发开始按钮的点击事件
            startBtn.click();
        }
    });


    // 开始监听页面变化
    observer.observe(document.body, { childList: true });
})();