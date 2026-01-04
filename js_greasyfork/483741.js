// ==UserScript==
// @name         自动填充答案脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动获取、填充答案
// @author       koishi
// @match        https://nuc.alphacoding.cn/task
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483741/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E7%AD%94%E6%A1%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/483741/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E7%AD%94%E6%A1%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const interval = 300; // 每隔300毫秒检查一次
            let totalTime = 0;

            const timer = setInterval(() => {
                const element = document.querySelector(selector);
                totalTime += interval;

                if (element) {
                    clearInterval(timer);
                    resolve(element);
                } else if (totalTime >= timeout) {
                    clearInterval(timer);
                    reject(new Error("Element not found: " + selector));
                }
            }, interval);
        });
    }

    function findButtonByText(text, className) {
        const buttons = document.querySelectorAll(`button.${className}`);
        for (const button of buttons) {
            if (button.textContent.includes(text)) {
                return button;
            }
        }
        return null;
    }

    async function clickSubmitButton() {
        // 查找并点击提交按钮
        const submitButton = findButtonByText("提交", "font-medium");
        if (submitButton) {
            submitButton.click();
        } else {
            console.error('未找到“提交”按钮');
        }
    }

    async function clickNextItemButton() {
        // 循环查找并点击下一项按钮
        const nextItemButton = findButtonByText("下一项", "font-medium");
        if (nextItemButton) {
            nextItemButton.click();
        } else {
            console.error('未找到“下一项”按钮');
        }
    }

    async function submitAnswer() {
        try {
            // 找到并点击“查看答案”按钮
            const answerButton = findButtonByText("查看答案", "font-medium");
            if (answerButton) {
                answerButton.click();
            } else {
                throw new Error('未找到“查看答案”按钮');
            }

            // 等待答案元素加载
            const answerElement = await waitForElement('pre.code-solution');
            const answerText = answerElement.innerText;

            // 等待 CodeMirror 实例加载
            const codeMirrorElement = await waitForElement('.CodeMirror');
            if (codeMirrorElement) {
                const codeMirrorEditor = codeMirrorElement.CodeMirror;
                codeMirrorEditor.setValue(answerText);
            }

            // 点击提交按钮
            setTimeout(clickSubmitButton, 500);

            // 循环尝试点击下一项按钮
            setTimeout(clickNextItemButton, 500);

        } catch (error) {
            console.error("脚本出错:", error);
        }
    }

    // 每0.5秒循环运行一次
    setInterval(submitAnswer, 500);
})();
