// ==UserScript==
// @name         B站动态关键词屏蔽器
// @namespace    http://tampermonkey.net/
// @version      2025-06-18.1
// @description  高效快速地隐藏B站动态中的广告内容
// @author       pydroid & gemini
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541601/B%E7%AB%99%E5%8A%A8%E6%80%81%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541601/B%E7%AB%99%E5%8A%A8%E6%80%81%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keywords = ['妙界', '温眠', '小蓝瓶鱼油', '护眼仪', '护颈枕', '小冰席', '海力生', '冲牙器']; // 关键词列表

    /**
     * 处理单个节点，检查是否包含广告关键词并隐藏其所在的动态卡片
     * @param {Node} node - 要检查的 DOM 节点
     */
    const processNode = (node) => {
        // 确保我们只处理元素节点，忽略文本节点等
        if (!(node instanceof Element)) {
            return;
        }

        // 在当前节点内查找所有可能包含广告文本的元素
        // querySelectorAll 比多次 getElementsByClassName/TagName 更高效
        const textElements = node.querySelectorAll('.bili-rich-text__content');

        textElements.forEach(el => {
            // 如果已经处理过，则跳过，避免重复操作
            if (el.dataset.filtered === 'true') return;

            const text = el.textContent || '';
            // 使用 some 方法，一旦找到一个匹配的关键词就停止检查
            if (keywords.some(kw => text.includes(kw))) {
                // 使用 closest 查找最近的父级动态卡片，这比一长串的 .parentElement 更健壮、更清晰
                const itemCard = el.closest('.bili-dyn-item');
                if (itemCard) {
                    console.log('检测到广告并隐藏:', text.substring(0, 50)); // 在控制台输出日志，方便调试
                    itemCard.style.display = 'none';
                    el.dataset.filtered = 'true'; // 标记已处理
                }
            }
        });
    };

    // --- MutationObserver 设置 ---

    // 1. 选择要观察变动的目标节点
    // 通常是动态列表的父容器，如果找不到特定的，body 是一个可靠的备选项
    const targetNode = document.body;

    // 2. 配置观察器：我们关心子节点的添加
    const config = {
        childList: true, // 观察目标子节点的变化（添加或删除）
        subtree: true    // 观察后代所有节点的变化
    };

    // 3. 创建一个观察器实例，并定义当变动发生时执行的回调函数
    const observer = new MutationObserver((mutationsList, observer) => {
        // 遍历所有发生的变动
        for (const mutation of mutationsList) {
            // 如果变动类型是'childList'（有节点被添加或删除）
            if (mutation.type === 'childList') {
                // 遍历所有被添加的节点
                for (const addedNode of mutation.addedNodes) {
                    processNode(addedNode);
                }
            }
        }
    });

    // --- 脚本执行 ---

    // 4. 首次加载时，立即处理页面上已经存在的内容
    // 因为 MutationObserver 只对未来的变化作出反应
    console.log('B站广告隐藏脚本：开始首次扫描...');
    processNode(document.body);

    // 5. 启动观察器，开始监视目标节点
    observer.observe(targetNode, config);
    console.log('B站广告隐藏脚本：启动 MutationObserver，持续监控页面变化。');

})();