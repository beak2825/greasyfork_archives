// ==UserScript==
// @name         美团售卖勾选和输入脚本
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动勾选美团售卖复选框并在特定的输入框中输入值，每次点击和输入时延迟0.5秒，并添加按钮触发功能
// @author       Your Name
// @match        *://*.meituan.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497089/%E7%BE%8E%E5%9B%A2%E5%94%AE%E5%8D%96%E5%8B%BE%E9%80%89%E5%92%8C%E8%BE%93%E5%85%A5%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/497089/%E7%BE%8E%E5%9B%A2%E5%94%AE%E5%8D%96%E5%8B%BE%E9%80%89%E5%92%8C%E8%BE%93%E5%85%A5%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并插入按钮
    var button = document.createElement('button');
    button.innerHTML = '自动填写和勾选';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    document.body.appendChild(button);

    button.addEventListener('click', function() {
        // 查找包含“售卖”文本的标签
        var labels = document.querySelectorAll('label.boo-checkbox-wrapper');
        var index = 0;

        function clickNextLabel() {
            if (index < labels.length) {
                var label = labels[index];
                if (label.textContent.includes('售卖')) {
                    // 查找复选框元素
                    var checkbox = label.querySelector('input.boo-checkbox-input');

                    // 检查复选框是否存在且未被勾选
                    if (checkbox && !checkbox.checked) {
                        // 创建一个点击事件
                        var event = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        // 触发点击事件
                        checkbox.dispatchEvent(event);
                    }
                }
                index++;
                setTimeout(clickNextLabel, 500); // 0.5秒间隔
            } else {
                // 定位到特定的输入框并输入值
                var containerDivs = document.querySelectorAll('div.container[placeholder="请输入"]');
                var numberInputs = document.querySelectorAll('input.boo-input-number-input');

                function inputValues() {
                    for (var i = 0; i < containerDivs.length; i++) {
                        var container = containerDivs[i];
                        var inputInContainer = container.querySelector('input');
                        if (inputInContainer) {
                            inputInContainer.value = '1';
                            var inputEvent = new Event('input', {
                                bubbles: true,
                                cancelable: true
                            });
                            inputInContainer.dispatchEvent(inputEvent);
                        }
                    }

                    for (var j = 0; j < numberInputs.length; j++) {
                        var numberInput = numberInputs[j];
                        numberInput.value = '1';
                        var inputEvent = new Event('input', {
                            bubbles: true,
                            cancelable: true
                        });
                        numberInput.dispatchEvent(inputEvent);
                    }
                }

                setTimeout(inputValues, 500); // 0.5秒间隔
            }
        }

        clickNextLabel();
    });
})();
