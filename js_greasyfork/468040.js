// ==UserScript==
// @name         ChatGPT自动对话
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  让ChatGPT实现for循环任务
// @author       yedsn
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468040/ChatGPT%E8%87%AA%E5%8A%A8%E5%AF%B9%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/468040/ChatGPT%E8%87%AA%E5%8A%A8%E5%AF%B9%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoSendFlag = false;
    let stopText = '学习结束。';
    let autoSendText='请继续下一章节的讲解。'
    let autoText = '所有讲解结束后请在回复末尾输入：'+stopText+'否则'+autoSendText;
    let checkboxContainer = null;
    let textInputContainer = null;
    let stopTextInput = null;
    let autoSendTextInput = null;

    // 创建checkbox
    (function generateCheckbox() {

        // 创建checkbox
        checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.flexDirection = 'column';
        checkboxContainer.style.gap = '5px';

        const checkboxLabel = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.style.marginRight = ".5rem";
        checkbox.type = 'checkbox';
        checkbox.id = 'auto-operate-checkbox';
        checkboxLabel.appendChild(checkbox);
        const label = document.createTextNode('中断后自动发送自定义文本');
        checkboxLabel.appendChild(label);
        checkboxContainer.appendChild(checkboxLabel);

        checkbox.addEventListener('change', function() {
            autoSendFlag = this.checked;
        });

        // 创建输入框容器
        textInputContainer = document.createElement('div');
        textInputContainer.style.display = 'flex';
        textInputContainer.style.gap = '5px';

        // 添加终止条件输入框
        stopTextInput = document.createElement('input');
        stopTextInput.type = 'text';
        stopTextInput.placeholder = '输入终止条件';
        stopTextInput.value = stopText;
        stopTextInput.style.width = '125px';
        stopTextInput.style.height = '30px';
        stopTextInput.style.color = 'black';

        stopTextInput.addEventListener('input', function() {
            let oldStopText = stopText;
            stopText = this.value;
            // Replace the old stop text with new stop text in autoSendText
            autoSendText = autoSendText.replace(oldStopText, stopText);
            autoSendTextInput.value = autoSendText;
        });
        textInputContainer.appendChild(stopTextInput);


        // 添加自动发送的文本输入框
        autoSendTextInput = document.createElement('input');
        autoSendTextInput.type = 'text';
        autoSendTextInput.placeholder = '输入自动发送的文本';
        autoSendTextInput.value = autoSendText;
        autoSendTextInput.style.width = 'auto';
        autoSendTextInput.style.height = '30px';
        autoSendTextInput.style.color = 'black';

        autoSendTextInput.addEventListener('input', function() {
            autoSendText = this.value;
        });
        textInputContainer.appendChild(autoSendTextInput);

        // 将输入框容器添加到checkbox容器
        checkboxContainer.appendChild(textInputContainer);
    })();

    // 创建一个 MutationObserver 实例，监听 body 元素内子元素的变化
    const observer = new MutationObserver(function(mutations) {
        if(!document.getElementById("auto-operate-checkbox")) {
            const btnNeutral = document.querySelector('.btn-neutral');
            if(btnNeutral) {
                btnNeutral.parentNode.insertBefore(checkboxContainer, btnNeutral);
            }
        }

        if(autoSendFlag) {
            // 执行自动发送
            const button = document.querySelector('.btn-neutral');
            if (!button || button.querySelector('div').textContent.trim() != "Stop generating") {
                const paragraphs = Array.from(document.getElementsByTagName('p'));
                const lastParagraph = paragraphs.filter(p => p.id !== '__next-route-announcer__').pop();

                 if (lastParagraph && !lastParagraph.parentNode.classList.contains('result-streaming') &&
                    !(new RegExp("^" + stopText).test(lastParagraph.textContent.trim()) || new RegExp(stopText + "$").test(lastParagraph.textContent.trim()))) {
                    setTimeout(function () {
                        const textarea = document.querySelector('textarea');
                        textarea.value = autoText;

                        setTimeout(function () {
                            const event = new Event('input', { bubbles: true });
                            textarea.dispatchEvent(event);

                            const siblingButton = textarea.nextElementSibling;
                            siblingButton.click();
                        }, 500);
                    }, Math.floor(Math.random() * (3000 - 500 + 1) + 500));
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
