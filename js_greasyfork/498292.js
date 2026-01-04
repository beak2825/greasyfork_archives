// ==UserScript==
// @name         上海第二工业大学一键教学评估
// @namespace    chinggg
// @version      0.1.1
// @description  自动完成上海第二工业大学教学评估
// @author       雨无尘
// @match        *://jx.sspu.edu.cn/eams/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498292/%E4%B8%8A%E6%B5%B7%E7%AC%AC%E4%BA%8C%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E4%B8%80%E9%94%AE%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/498292/%E4%B8%8A%E6%B5%B7%E7%AC%AC%E4%BA%8C%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E4%B8%80%E9%94%AE%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver((mutationsList, observer) => {
        // 当目标节点添加子节点或更改其子节点时，执行回调
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 查找所有value为174的单选按钮，并将其设置为已选中
                let collection = document.querySelectorAll('input[type="radio"][value="174"],input[type="radio"][value="168"],input[type="radio"][value="178"]');
                for (let item of collection) {
                    item.checked = true;
                }
            }
        }
    });

    // 配置观察器，观察目标节点及其子节点的变化
    const config = { childList: true, subtree: true };

    // 选择目标节点（例如：body）
    const targetNode = document.body;

    // 开始观察目标节点
    observer.observe(targetNode, config);
})();