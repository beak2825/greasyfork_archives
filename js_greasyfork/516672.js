// ==UserScript==
// @name         隐藏时间表不想看到的行
// @namespace    http://tampermonkey.net/
// @version      2024-11-10
// @description  修改 targetTextArray 数组添加不想看到的。
// @author       You
// @match        https://tracker.beartoolkit.com/timer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beartoolkit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516672/%E9%9A%90%E8%97%8F%E6%97%B6%E9%97%B4%E8%A1%A8%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E7%9A%84%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/516672/%E9%9A%90%E8%97%8F%E6%97%B6%E9%97%B4%E8%A1%A8%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E7%9A%84%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 输入不想看的 S/A怪，或者 Fate
    const targetTextArray = [
        "努纽努维",
        "卢克洛塔",
    ];

    // 检查并隐藏符合条件的节点
    function checkAndHideNodes() {
    // 查找所有的 MuiTypography-root 元素
    const typographyNodes = document.querySelectorAll('.MuiTypography-root.MuiTypography-button');

    typographyNodes.forEach(node => {
        const nodeText = node.textContent.trim();
        // 检查当前节点的文本是否在目标文本数组中
        if (targetTextArray.includes(nodeText)) {
            let parentNode = node;

            // 循环判断父节点，直到找到包含 MuiTableRow-root 的父节点
            while (parentNode && !parentNode.classList.contains('MuiTableRow-root')) {
                parentNode = parentNode.parentElement;
            }

            // 如果找到了包含 MuiTableRow-root 的父节点
            if (parentNode && parentNode.classList.contains('MuiTableRow-root')) {
                parentNode.style.display = 'none'; // 隐藏该行
            }
        }
    });
}

    // 监听元素的变化（包括属性、文本内容、子节点）
    function observeElementChanges(siblingSpan) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    console.log(`子节点变化:`, mutation);
                } else if (mutation.type === 'attributes') {
                    console.log(`属性变化:`, mutation);
                } else if (mutation.type === 'characterData') {
                    console.log(`文本内容变化:`, mutation.target.textContent.trim());
                }
                checkAndHideNodes()
            });
        });

        // 配置观察者监听子节点变化、属性变化和文本内容变化
        const config = {
            childList: true, // 监听子节点的添加或删除
            attributes: true, // 监听元素的属性变化
            characterData: true, // 监听文本节点的变化
            subtree: true, // 监听所有后代元素的变化
        };

        // 开始监听兄弟 span 的变化
        observer.observe(siblingSpan, config);
    }

    // 找到所有符合条件的 targetSpan 元素
    function findTargetSpans() {
        const targetSpans = document.querySelectorAll('span[aria-label="显示已死亡猎物"]');

        // 如果找到了符合条件的 targetSpan 元素，返回 true
        if (targetSpans.length > 0) {
            console.log('找到目标 span 元素');
            targetSpans.forEach(targetSpan => {
                // 获取目标 span 的父节点 (假设所有兄弟都在同一个父容器内)
                const parentElement = targetSpan.parentElement;
                if (parentElement) {
                    console.log('找到目标 span 的父容器');
                    // 获取所有兄弟 span 元素并监听它们的变化
                    const siblingSpans = parentElement.querySelectorAll('span');
                    siblingSpans.forEach(siblingSpan => {
                        observeElementChanges(siblingSpan); // 为每个兄弟 span 监听变化
                    });
                }
            });
            return true;
        }
        return false;
    }

    // 定时器检查函数
    function startCheckingForTableBodyElement() {
        const intervalId = setInterval(() => {
            if (findTargetSpans()) {
                clearInterval(intervalId); // 找到元素后停止定时器
            }
        }, 1000); // 每1s检查一次
    }

    // 启动定时器检查
    startCheckingForTableBodyElement();

})();