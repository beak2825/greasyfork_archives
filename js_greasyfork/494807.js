// ==UserScript==
// @name         D-PAR-旧-shop-yes
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/mission/8043/safe-label*
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/494807/D-PAR-%E6%97%A7-shop-yes.user.js
// @updateURL https://update.greasyfork.org/scripts/494807/D-PAR-%E6%97%A7-shop-yes.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var observer = new MutationObserver(function(mutationsList, observer) {
        mutationsList.forEach(function(mutation) {
            console.log('DOM 发生了变化:', mutation);
            checkTriggerElement();
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    var isClickCompleted = true; // 点击是否已经完成的标志位，默认为 true

    function checkTriggerElement() {
        var triggerElementXpath = 'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[2]/DIV[1]/H4[1]';
        var triggerElement = document.evaluate(triggerElementXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (triggerElement) {
            console.log('触发元素已找到，XPath:', triggerElementXpath);

            if (isClickCompleted) {
                // 随机生成3到6秒的延迟
                var randomDelay = Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;

                // 点击前先将标志位设置为 false
                isClickCompleted = false;

                // 执行模拟点击
                setTimeout(function() {
                    simulateClick();
                }, randomDelay);
            }
        } else {
            console.error('未找到触发元素，XPath:', triggerElementXpath);

            // 如果未找到触发元素，1秒后再次检查
            setTimeout(function() {
                checkTriggerElement();
            }, 1000);
        }
    }

    function simulateClick() {
        // 点击第一个按钮
        var xpath1 = 'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[2]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/LABEL[1]/SPAN[2]';
        var element1 = document.evaluate(xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (element1 && !element1.disabled) {
            element1.click();
            console.log('已点击第一个按钮，XPath:', xpath1);
            console.log('第一个按钮已成功点击');

            // 点击后禁用1秒钟
            element1.disabled = true;
            setTimeout(function() {
                element1.disabled = false; // 恢复激活
            }, 1000);

            // 添加延迟再点击第二个按钮
            setTimeout(function() {
                var xpath2 = 'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[2]/DIV[1]/DIV[3]/SPAN[1]/SPAN[1]/BUTTON[1]';
                var element2 = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                if (element2 && !element2.disabled) {
                    element2.click();
                    console.log('已点击第二个按钮，XPath:', xpath2);
                    console.log('第二个按钮已成功点击');

                    // 点击后禁用1秒钟
                    element2.disabled = true;
                    setTimeout(function() {
                        element2.disabled = false; // 恢复激活
                    }, 1000);

                    // 添加延迟再点击第三个按钮
                    setTimeout(function() {
                        var buttons = document.querySelectorAll('button');
                        var confirmButton = null;
                        buttons.forEach(function(button) {
                            if (button.textContent.trim() === '确定') {
                                confirmButton = button;
                            }
                        });

                        if (confirmButton && !confirmButton.disabled) {
                            confirmButton.click();
                            console.log('已点击确定按钮');
                            console.log('确定按钮已成功点击');

                            // 点击后禁用1秒钟
                            confirmButton.disabled = true;
                            setTimeout(function() {
                                confirmButton.disabled = false; // 恢复激活
                            }, 1000);

                        } else {
                            console.error('确定按钮未找到或已被禁用');
                        }
                    }, 0); // 添加延迟以确保在第二个按钮点击后执行
                } else {
                    console.error('XPath为' + xpath2 + '的元素未找到或已被禁用');
                }
            }, 0); // 添加延迟以确保在第一个按钮点击后执行
        } else {
            console.error('XPath为' + xpath1 + '的元素未找到或已被禁用');

            // 如果第一个按钮未找到或已被禁用，1秒后再次检查
            setTimeout(function() {
                checkTriggerElement();
            }, 1000);
        }

        // 设置点击完成标志位为 true
        isClickCompleted = true;
    }

    // 初始运行一次
    checkTriggerElement();
})();
