// ==UserScript==
// @name         wps表单提前填写
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  循环清理指定元素的CSS类和按钮禁用属性
// @author       LinXingJun
// @match        *://f.wps.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534640/wps%E8%A1%A8%E5%8D%95%E6%8F%90%E5%89%8D%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/534640/wps%E8%A1%A8%E5%8D%95%E6%8F%90%E5%89%8D%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要处理的XPath路径
    const XPATHS = [
        {
            path: "/html/body/div/div/div[2]/div[1]/div[2]/div[2]/div[1]",
            action: (element) => {
                element.classList.remove('src-pages-form-write-index__mask');
                console.log("Mask class removed");
            }
        },
        {
            path: "/html/body/div/div/div[2]/div[1]/div[2]/div[2]/div[1]/div[2]/div/div/button",
            action: (element) => {
                element.removeAttribute('disabled');
                console.log("Button enabled");
            }
        }
    ];

    // 核心处理函数
    function processElements() {
        XPATHS.forEach(item => {
            const result = document.evaluate(
                item.path,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            );

            if (result.singleNodeValue) {
                item.action(result.singleNodeValue);
            }
        });
    }

    // 建立观察器监控DOM变化（备用方案）
    const observer = new MutationObserver(processElements);
    observer.observe(document.body, { childList: true, subtree: true });

    // 主循环（双重保障）
    setInterval(processElements, 1000);
})();