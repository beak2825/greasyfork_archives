// ==UserScript==
// @name        旧-shop-yes
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/492120/%E6%97%A7-shop-yes.user.js
// @updateURL https://update.greasyfork.org/scripts/492120/%E6%97%A7-shop-yes.meta.js
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

    function checkTriggerElement() {
        var triggerElementXpath = 'id("app")/DIV[1]/DIV[3]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[2]/DIV[1]/H4[1]';
        var triggerElement = document.evaluate(triggerElementXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (triggerElement) {
            console.log('触发元素已找到，XPath:', triggerElementXpath);

            // 添加点击事件监听器
            triggerElement.addEventListener('click', function handleClick(event) {
                console.log('触发元素已点击');
                // 移除点击事件监听器，避免重复点击
                triggerElement.removeEventListener('click', handleClick);

                setTimeout(function() {
                    // 点击第一个按钮
                    var xpath1 = 'id("app")/DIV[1]/DIV[3]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[2]/DIV[1]/FORM[1]/DIV[1]/DIV[1]/DIV[1]/LABEL[1]/SPAN[2]';
                    var element1 = document.evaluate(xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                    if (element1) {
                        element1.click();
                        console.log('已点击第一个按钮，XPath:', xpath1);
                        console.log('第一个按钮已成功点击');
                    } else {
                        console.error('XPath为' + xpath1 + '的元素未找到');
                    }

                    setTimeout(function() {
                        console.log('延迟100ms');

                        // 点击第二个按钮
                        var xpath2 = 'id("app")/DIV[1]/DIV[3]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[2]/DIV[1]/FORM[1]/DIV[3]/DIV[1]/SPAN[1]/SPAN[1]/BUTTON[1]';
                        var element2 = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                        if (element2 && !element2.disabled) {
                            element2.click();
                            console.log('已点击第二个按钮，XPath:', xpath2);
                            console.log('第二个按钮已成功点击');

                            // 禁用第二个按钮
                            element2.disabled = true;

                            // 允许再次点击第二个按钮
                            setTimeout(function() {
                                element2.disabled = false;
                            }, 1000); // 1秒后允许再次点击
                        } else {
                            console.error('XPath为' + xpath2 + '的元素未找到或已被禁用');
                        }

                        setTimeout(function() {
                            console.log('延迟100ms已完成');

                            // 点击第三个按钮
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

                                // 禁用确定按钮
                                confirmButton.disabled = true;

                                // 允许再次点击确定按钮
                                setTimeout(function() {
                                    confirmButton.disabled = false;
                                }, 1000); // 1秒后允许再次点击
                            } else {
                                console.error('确定按钮未找到或已被禁用');
                            }
                        }, 0);
                    }, 0);
                }, 0); // 延迟0毫秒
            });
        } else {
            console.error('未找到触发元素，XPath:', triggerElementXpath);
        }
    }

    // 初始运行一次
    checkTriggerElement();
})();
