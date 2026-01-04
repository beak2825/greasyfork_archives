// ==UserScript==
// @name        屏蔽iirose机器人消息
// @namespace   Violentmonkey Scripts
// @match       https://iirose.com/*
// @grant       none
// @version     1.0
// @license MIT
// @author      Zola
// @description 2024/3/7 19:22:27
// @downloadURL https://update.greasyfork.org/scripts/489223/%E5%B1%8F%E8%94%BDiirose%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/489223/%E5%B1%8F%E8%94%BDiirose%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：检查并屏蔽消息
    function checkAndBlockMsgs() {
        // 获取所有的msg元素
        document.querySelectorAll('.msg').forEach(function(msg) {
            // 检查是否包含mdi-robot
            if(msg.querySelector('.mdi-robot')) {
                // 屏蔽该消息
                msg.style.display = 'none';
            }
        });
    }

    // 使用MutationObserver监听DOM变化，以应对动态加载的内容
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            checkAndBlockMsgs(); // 对每次DOM变更执行检查和屏蔽操作
        });
    });

    // 配置和启动observer
    let config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // 初次执行，以应对已经加载的内容
    checkAndBlockMsgs();
})();
