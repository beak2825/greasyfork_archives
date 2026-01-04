// ==UserScript==
// @name         删除共创世界(CCW)录制按钮
// @namespace    https://greasyfork.org/zh-CN/scripts/474834
// @version      1.6
// @description  删除共创世界(CCW)社区的作品游玩页上的录制按钮
// @match        *://ccw.site/detail/*
// @match        *://www.ccw.site/detail/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474834/%E5%88%A0%E9%99%A4%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E5%BD%95%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/474834/%E5%88%A0%E9%99%A4%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E5%BD%95%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TEXT_TO_FIND = "录制"; // 要查找的按钮内文本
    // 录制按钮的直接父容器的选择器 (基于您提供的HTML结构)
    const RECORD_BUTTON_WRAPPER_SELECTOR = 'div.control-record-2NoqJ.action-start-bMuJy';
    // 录制按钮本身的选择器 (在父容器内，并且包含文字 "录制")
    const RECORD_BUTTON_ITSELF_SELECTOR = 'div.action-item-P9SP6';

    /**
     * 查找并移除目标按钮。
     * @returns {boolean} 如果找到并移除了按钮则返回 true，否则返回 false。
     */
    function findAndRemoveRecordButton() {
        // 查找所有可能的录制按钮的父容器
        const wrapperElements = document.querySelectorAll(RECORD_BUTTON_WRAPPER_SELECTOR);

        for (const wrapper of wrapperElements) {
            // 在每个父容器中查找实际的录制按钮 div
            const buttonElements = wrapper.querySelectorAll(RECORD_BUTTON_ITSELF_SELECTOR);
            for (const buttonElement of buttonElements) {
                const span = buttonElement.querySelector('span');
                // 检查 span 是否存在并且其文本内容是否为 "录制"
                if (span && span.textContent.trim() === TEXT_TO_FIND) {
                    // 找到了目标按钮，进行移除
                    console.log('找到录制按钮，准备移除:', buttonElement);
                    buttonElement.remove();
                    console.log('录制按钮已移除。');
                    return true; // 表示已成功找到并移除
                }
            }
        }
        return false; // 未找到按钮
    }

    // 首次尝试：页面加载时立即执行一次查找和移除
    if (findAndRemoveRecordButton()) {
        console.log('录制按钮在页面初始加载时被移除。');
        // 如果按钮只出现一次且不会重新加载，可以考虑在这里直接返回，不启动Observer
        // return;
    }

    // 定义 MutationObserver 的回调函数
    const observerCallback = function(mutationsList, observer) {
        // 每次DOM变化时，都尝试查找并移除按钮
        if (findAndRemoveRecordButton()) {
            console.log('录制按钮通过 MutationObserver 移除。');
            observer.disconnect(); // 成功移除后，停止监听，避免不必要的性能消耗
            console.log('MutationObserver 已停止。');
        }
    };

    // 创建 MutationObserver 实例
    const observer = new MutationObserver(observerCallback);

    // 配置 MutationObserver 监听的选项
    const observerConfig = {
        childList: true, // 监听子节点（包括文本节点）的添加或删除
        subtree: true,   // 监听目标节点所有后代节点的变化
    };

    // 开始监听 document.body 的变化
    // 这样可以捕获到页面上任何地方动态添加的符合条件的按钮
    observer.observe(document.body, observerConfig);

    console.log('移录制按钮脚本已启动，并开始监听页面变化。');

})();