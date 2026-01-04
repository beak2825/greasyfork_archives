// ==UserScript==
// @name         通义页面自动隐藏历史对话记录
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  在阿里云通义页面收起对话记录
// @author       liunian
// @include      *://www.qianwen.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529779/%E9%80%9A%E4%B9%89%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E5%8E%86%E5%8F%B2%E5%AF%B9%E8%AF%9D%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529779/%E9%80%9A%E4%B9%89%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E5%8E%86%E5%8F%B2%E5%AF%B9%E8%AF%9D%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        try {
            const ns = "http://www.w3.org/1999/xlink";
            const result = [...document.querySelectorAll('span[data-role="icon"] use')]
                .filter(el => {
                    const href = el.getAttributeNS(ns, "href");
                    return href === "#pcicon-operateLeft-line";
                });

            if (result.length > 0 && result[0].parentElement.parentElement) {
                var historyPanel = result[0].parentElement.parentElement;
                console.log("找到历史记录栏图标，状态为展开");

                // 添加点击前的验证
                if (typeof historyPanel.click === 'function') {
                    historyPanel.click();
                    console.log("隐藏历史记录栏元素成功");
                } else {
                    console.error("找到元素但无法点击");
                }
            } else {
                console.log("历史记录栏状态为未展开或未找到对应元素");
            }
        } catch (error) {
            console.error("隐藏历史记录栏元素时发生错误:", error);
        }
    }, false);
})();