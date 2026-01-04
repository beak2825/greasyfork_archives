// ==UserScript==
// @name         checkReven
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  计算总价
// @author       你的名字
// @match        https://www.ads.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528604/checkReven.user.js
// @updateURL https://update.greasyfork.org/scripts/528604/checkReven.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标元素的类名
    const targetClassName = 'v-toolbar-title__placeholder';

    // 检查目标元素是否已经存在
    function checkForElement() {
        return document.querySelector(`.${targetClassName}`);
    }

    // 如果目标元素已经存在，直接执行操作
    if (checkForElement()) {
        setTimeout(function() {
            console.log('hi');
        }, 5000); // 等待5秒后打印 "hi"
    } else {
        // 如果目标元素不存在，使用 MutationObserver 监听 DOM 变化
        const observer = new MutationObserver(function(mutationsList, observer) {
            // 检查目标元素是否已经出现
            if (checkForElement()) {
                // 停止观察
                observer.disconnect();

                // 等待5秒后打印 "hi"
                setTimeout(function() {
                    console.log('hi');
                }, 5000);
            }
        });

        // 配置观察选项
        const config = {
            childList: true, // 监听子节点的添加或删除
            subtree: true    // 监听所有后代节点的变化
        };

        // 开始观察整个文档
        observer.observe(document.body, config);
    }
})();