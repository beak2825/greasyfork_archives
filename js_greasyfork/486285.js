// ==UserScript==
// @name         按确定自动中断回复后发送|按上箭头自动恢复上次发送的内容|在点击问题文本时自动将该文本填充到输入框中 for ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  This script enhances ChatGPT interaction by automatically sending input when Enter is pressed, restoring the last sent message with the Up arrow key, and filling the input field with text from clicked questions.
// @description:zh 该脚本通过在按下Enter键时自动发送输入、使用上箭头键恢复上次发送的消息，并在点击问题文本时将该文本自动填充到输入框中，来增强与ChatGPT的交互。
// @description:es Este script mejora la interacción con ChatGPT enviando automáticamente el contenido del input al presionar Enter, restaurando el último mensaje enviado con la tecla de flecha arriba, y llenando el campo de entrada con el texto de las preguntas al hacer clic en ellas.
// @author       CHENJIAMIAN
// @match        https://chat.openai.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/486285/%E6%8C%89%E7%A1%AE%E5%AE%9A%E8%87%AA%E5%8A%A8%E4%B8%AD%E6%96%AD%E5%9B%9E%E5%A4%8D%E5%90%8E%E5%8F%91%E9%80%81%7C%E6%8C%89%E4%B8%8A%E7%AE%AD%E5%A4%B4%E8%87%AA%E5%8A%A8%E6%81%A2%E5%A4%8D%E4%B8%8A%E6%AC%A1%E5%8F%91%E9%80%81%E7%9A%84%E5%86%85%E5%AE%B9%7C%E5%9C%A8%E7%82%B9%E5%87%BB%E9%97%AE%E9%A2%98%E6%96%87%E6%9C%AC%E6%97%B6%E8%87%AA%E5%8A%A8%E5%B0%86%E8%AF%A5%E6%96%87%E6%9C%AC%E5%A1%AB%E5%85%85%E5%88%B0%E8%BE%93%E5%85%A5%E6%A1%86%E4%B8%AD%20for%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/486285/%E6%8C%89%E7%A1%AE%E5%AE%9A%E8%87%AA%E5%8A%A8%E4%B8%AD%E6%96%AD%E5%9B%9E%E5%A4%8D%E5%90%8E%E5%8F%91%E9%80%81%7C%E6%8C%89%E4%B8%8A%E7%AE%AD%E5%A4%B4%E8%87%AA%E5%8A%A8%E6%81%A2%E5%A4%8D%E4%B8%8A%E6%AC%A1%E5%8F%91%E9%80%81%E7%9A%84%E5%86%85%E5%AE%B9%7C%E5%9C%A8%E7%82%B9%E5%87%BB%E9%97%AE%E9%A2%98%E6%96%87%E6%9C%AC%E6%97%B6%E8%87%AA%E5%8A%A8%E5%B0%86%E8%AF%A5%E6%96%87%E6%9C%AC%E5%A1%AB%E5%85%85%E5%88%B0%E8%BE%93%E5%85%A5%E6%A1%86%E4%B8%AD%20for%20ChatGPT.meta.js
// ==/UserScript==



(function() {
    'use strict';

    //------------------按确定自动发送---------------
    document.addEventListener('keydown', function(event) {
        // 确保仅在按下Enter键时且没有按下Ctrl、Shift、Alt键时触发
        if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            // 尝试点击“停止生成”按钮
            const stopGeneratingElement = document.querySelector('[aria-label="停止生成"]');
            if (stopGeneratingElement && document.activeElement.textContent !== '') {
                stopGeneratingElement.click();
                // 延迟点击发送按钮，以确保页面已响应停止操作
                setTimeout(clickSendButton, 1000);
            } else {
                // 如果不需要停止生成，则直接尝试保存并提交
                clickSaveAndSubmit();
            }
        }
    });

    function clickSendButton() {
        const sendButton = document.querySelector('[data-testid="send-button"]');
        if (sendButton) {
            sendButton.click();
        }
    }

    function clickSaveAndSubmit() {
        var xpath = "//div[text()='保存并提交']";
        var targetElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(targetElement) {
            targetElement.click();
        }
    }




    //------------------按上箭头自动恢复上次发送的内容---------------
    let value = ''// 用于存储元素的值
    document.addEventListener('keydown', function(e) {
        // 获取当前焦点所在的元素
        let activeElement = document.activeElement;

        // 检查是否为输入框，并获取其值
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            if(activeElement.value!==''){
                value = activeElement.value; // 对于 INPUT 和 TEXTAREA 使用 value 属性
            }
        }

        //按enter记录输入
        if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            // 检查值是否非空，然后保存
            if (value !== '') {
                sessionStorage.setItem('lastSentContent', value);
            }
        }


        //按上箭头健自动恢复上次输入
        var inputBox = document.querySelector('#prompt-textarea');
        if (inputBox) {
            if (e.key === 'ArrowUp' && inputBox.value === '') {
                var lastInput = sessionStorage.getItem('lastSentContent');
                if (lastInput !== null) {
                    inputBox.value = lastInput;
                }
            }
        }
    });


    //------------------在点击问题文本时自动将该文本填充到输入框中---------------

    // 使用MutationObserver来处理动态加载的内容
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    // 检查新添加的节点是否包含问题文本
                    if (node.nodeType === 1) { // 确保是元素节点
                        var questionElements = node.querySelectorAll("div[data-message-author-role='user'] div");
                        questionElements.forEach(function(element) {
                            element.style.cursor = 'pointer'; // 可选：更改鼠标样式以指示可点击
                            element.addEventListener('click', function() {
                                var questionText = this.innerText;
                                var inputBox = document.querySelector('input[type="text"], textarea');
                                if (inputBox) {
                                    inputBox.value = questionText;
                                    inputBox.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                            });
                        });
                    }
                });
            }
        });
    });

    // 配置MutationObserver监视子节点变动
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
