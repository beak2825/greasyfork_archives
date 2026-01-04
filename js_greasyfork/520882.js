// ==UserScript==
// @name         BJTU评教一键好评
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  控制鼠标点击评教页面优秀选项的模拟，并在评论框中输入 '无'
// @author       叶子佩
// @match        https://aa.bjtu.edu.cn/teaching_assessment/stu/*/update/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520882/BJTU%E8%AF%84%E6%95%99%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/520882/BJTU%E8%AF%84%E6%95%99%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保页面加载完成
    window.addEventListener('load', function() {
        // 创建开关按钮
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '模拟点击并输入“无”';
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '50px';
        toggleButton.style.right = '50px';
        toggleButton.style.zIndex = '9999';
        toggleButton.style.cursor = 'pointer';
        document.body.appendChild(toggleButton);

        // 用于标记是否正在执行模拟点击操作
        let isRunning = false;

        // 点击开关按钮的处理函数
        toggleButton.addEventListener('click', function() {
            if (isRunning) {
                isRunning = false;
                toggleButton.textContent = '一键好评（未开启）';
            } else {
                isRunning = true;
                toggleButton.textContent = '一键好评（已开启）';
                // 执行模拟点击操作
                const allSelectors = [
                    ...[...Array(10).keys()].map(i => `#id_select-${i}-select_result_3`),
                    '#id_select-10-select_result_0'
                ];
                allSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (element.tagName === 'INPUT' && element.type === 'checkbox') {
                            element.checked = true; // 直接设置勾选状态
                        } else {
                            const clickEvent = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            element.dispatchEvent(clickEvent);
                        }
                    });
                });
                // 在文本框中输入“无”
                const commentBox = document.querySelector("#id_comment-0-comment_result");
                if (commentBox) {
                    commentBox.value = '无';
                    // 滚动到页面底部
        window.scrollTo(0, document.body.scrollHeight);
                }
            }
        });
    });
})();