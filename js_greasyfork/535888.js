// ==UserScript==
// @name         知乎隐藏问题页信息流广告
// @namespace    https://www.zhihu.com/
// @version      1.0
// @description  每分钟检测并隐藏页面上包含特定子元素文本的Pc-word-new类元素
// @author       一晚好梦
// @match        https://www.zhihu.com/question/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535888/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E9%97%AE%E9%A2%98%E9%A1%B5%E4%BF%A1%E6%81%AF%E6%B5%81%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/535888/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E9%97%AE%E9%A2%98%E9%A1%B5%E4%BF%A1%E6%81%AF%E6%B5%81%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_CLASS = 'Pc-word-new';
    const AD_KEYWORD = '广告';
    const CHECK_INTERVAL = 15 * 1000; // 30s，单位毫秒

    function checkForAdsAndHide() {
        console.log('[AdHider] 开始检测广告...');
        const elements = document.getElementsByClassName(TARGET_CLASS);

        if (elements.length === 0) {
            console.log(`[AdHider] 未找到类名为 "${TARGET_CLASS}" 的元素。`);
            return;
        }

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            // 1. 检查元素是否已隐藏 (通过计算样式判断，更准确)
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.display === 'none') {
                // console.log(`[AdHider] 元素 (class: ${TARGET_CLASS}) #${i} 已被隐藏，跳过。`);
                continue;
            }

            // 2. 遍历子元素里的span标签，是否存在“广告”字样
            const spanElements = element.getElementsByTagName('span');
            let containsAdKeyword = false;
            if (spanElements.length > 0) {
                for (let j = 0; j < spanElements.length; j++) {
                    const span = spanElements[j];
                    if (span.textContent && span.textContent.includes(AD_KEYWORD)) {
                        containsAdKeyword = true;
                        break; // 找到一个包含关键词的span即可
                    }
                }
            }

            // 3. 如果满足所有条件，则隐藏元素
            if (containsAdKeyword) {
                console.log(`[AdHider] 发现广告内容于元素 (class: ${TARGET_CLASS}) #${i}，执行隐藏。`, element);
                element.style.display = 'none';
            } else {
                // console.log(`[AdHider] 元素 (class: ${TARGET_CLASS}) #${i} 未检测到广告关键词，不处理。`);
            }
        }
        console.log('[AdHider] 检测结束。');
    }

    // 首次加载页面时执行一次检查
    // 使用 document-idle 和 setTimeout 确保页面基本加载完毕
    setTimeout(checkForAdsAndHide, 1000);


    // 设置定时器，每隔指定时间执行一次检查
    setInterval(checkForAdsAndHide, CHECK_INTERVAL);

    console.log('[AdHider] 脚本已启动，将每隔 ' + (CHECK_INTERVAL / 1000) + ' 秒检测一次。');
})();