// ==UserScript==
// @name         纠错脚本（自动版带手动按钮）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在答案页面自动收集需要修正的答案并返回，同时保留手动按钮
// @match        https://www.cmechina.net/cme/examQuizFail.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505144/%E7%BA%A0%E9%94%99%E8%84%9A%E6%9C%AC%EF%BC%88%E8%87%AA%E5%8A%A8%E7%89%88%E5%B8%A6%E6%89%8B%E5%8A%A8%E6%8C%89%E9%92%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/505144/%E7%BA%A0%E9%94%99%E8%84%9A%E6%9C%AC%EF%BC%88%E8%87%AA%E5%8A%A8%E7%89%88%E5%B8%A6%E6%89%8B%E5%8A%A8%E6%8C%89%E9%92%AE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('答案页脚本已加载');

    let wrongAnswers = [];

    // 添加返回修正按钮
    function addReturnButton() {
        const returnButton = document.createElement('button');
        returnButton.textContent = '手动返回并修正';
        returnButton.style.position = 'fixed';
        returnButton.style.top = '40px';
        returnButton.style.right = '10px';
        returnButton.style.zIndex = '9999';
        document.body.appendChild(returnButton);

        returnButton.addEventListener('click', returnAndCorrect);
    }

    // 收集错误答案
    function collectWrongAnswers() {
        wrongAnswers = [];
        const answerItems = document.querySelectorAll('.answer_list h3');
        answerItems.forEach(item => {
            if (item.classList.contains('cuo')) {
                const questionNumber = item.textContent.split('、')[0];
                wrongAnswers.push(questionNumber);
            }
        });
        console.log('收集到的错误答案：', wrongAnswers);
    }

    // 返回并修正函数
    function returnAndCorrect() {
        collectWrongAnswers();
        // 将错误答案存储到 localStorage
        localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
        console.log('错误答案已存储到 localStorage');
        // 模拟点击浏览器后退按钮
        window.history.go(-1);
    }

    // 自动执行函数
    function autoExecute() {
        console.log('开始自动执行');
        collectWrongAnswers();
        if (wrongAnswers.length > 0) {
            console.log('发现需要修正的答案，准备返回');
            setTimeout(returnAndCorrect, 2000); // 延迟2秒后执行，给用户一个查看结果的机会
        } else {
            console.log('所有答案都正确，无需修正');
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        console.log('页面加载完成，准备自动执行');
        addReturnButton(); // 添加手动返回按钮
        setTimeout(autoExecute, 1000); // 延迟1秒后自动执行，确保页面元素已完全加载
    });

    console.log('答案页脚本设置完成');
})();