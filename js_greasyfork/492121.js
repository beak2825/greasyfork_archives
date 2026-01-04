// ==UserScript==
// @name        筛选No delay-shop-yes
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/492121/%E7%AD%9B%E9%80%89No%20delay-shop-yes.user.js
// @updateURL https://update.greasyfork.org/scripts/492121/%E7%AD%9B%E9%80%89No%20delay-shop-yes.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 监视整个文档，包括子节点的变化
    var observer = new MutationObserver(function(mutationsList, observer) {
        // 在每次变化时执行以下操作
        mutationsList.forEach(function(mutation) {
            // 这里可以添加您的操作逻辑
            console.log('DOM 发生了变化:', mutation);
 
            // 重新检查触发元素
            checkTriggerElement();
        });
    });
 
    // 开始监视
    observer.observe(document.documentElement, {
        childList: true,  // 监视子节点的变化
        subtree: true     // 监视整个文档树
    });
 
    // 检查触发元素的函数
    function checkTriggerElement() {
        // 触发元素的 XPath
        var triggerElementXpath = 'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[2]/DIV[1]/DIV[1]/DIV[1]';
        var triggerElement = document.evaluate(triggerElementXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
 
        if (triggerElement) {
            console.log('触发元素已找到，XPath:', triggerElementXpath);
 
            // 添加点击事件监听器
            triggerElement.addEventListener('click', function() {
                console.log('触发元素已点击');
 
                // 当触发元素被点击时执行以下操作
 
                // 点击第一个按钮
                var xpath1 = 'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[2]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/LABEL[1]/SPAN[2]';
                var element1 = document.evaluate(xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
 
                if (element1) {
                    element1.click();
                    console.log('已点击第一个按钮，XPath:', xpath1);
                    console.log('第一个按钮已成功点击');
                } else {
                    console.error('XPath为' + xpath1 + '的元素未找到');
                }
 
                // 添加延迟
                setTimeout(async function() {
                    console.log('延迟50ms');
 
                    // 点击第二个按钮
                    var xpath2 = 'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[2]/DIV[1]/DIV[3]/SPAN[1]/SPAN[1]/BUTTON[1]';
                    var element2 = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
 
                    if (element2) {
                        element2.click();
                        console.log('已点击第二个按钮，XPath:', xpath2);
                        console.log('第二个按钮已成功点击');
                    } else {
                        console.error('XPath为' + xpath2 + '的元素未找到');
                    }
 
                    // 添加延迟
                    await new Promise(resolve => setTimeout(resolve, 50));
                    console.log('延迟50ms已完成');
 
                    // 点击第三个按钮
                    var buttons = document.querySelectorAll('button');
                    var confirmButton = null;
                    buttons.forEach(function(button) {
                        if (button.textContent.trim() === '确定') {
                            confirmButton = button;
                        }
                    });
 
                    if (confirmButton) {
                        confirmButton.click();
                        console.log('已点击确定按钮');
                        console.log('确定按钮已成功点击');
                    } else {
                        console.error('确定按钮未找到');
                    }
                }, 100);
            });
        } else {
            console.error('未找到触发元素，XPath:', triggerElementXpath);
        }
    }
 
    // 初始运行一次
    checkTriggerElement();
})();