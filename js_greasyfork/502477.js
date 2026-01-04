// ==UserScript==
// @name         监控并输出TotalCost
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  监控totalCost值并在控制台输出，并更新总价格到指定位置，标注未成功获取的价格数量
// @author       You
// @match        https://play.pixels.xyz/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/502477/%E7%9B%91%E6%8E%A7%E5%B9%B6%E8%BE%93%E5%87%BATotalCost.user.js
// @updateURL https://update.greasyfork.org/scripts/502477/%E7%9B%91%E6%8E%A7%E5%B9%B6%E8%BE%93%E5%87%BATotalCost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateTotalCost() {
        const elements = document.querySelectorAll("[id^='item-price-']");
        let totalCost = 0;
        let failedCount = 0;
        elements.forEach(element => {
            let text = element.textContent;
            let matches = text.match(/花销: (\d+(\.\d+)?)/);
            if (matches) {
                totalCost += parseFloat(matches[1]);
            } else {
                failedCount++;
            }
        });
        console.log(`总花销: ${totalCost} (有 ${failedCount} 个未成功获取价格)`);
        updateTotalCostInDOM(totalCost, failedCount);
    }

    function updateTotalCostInDOM(totalCost, failedCount) {
        const result = document.evaluate("/html/body/div/div/div[4]/div/div/div[2]/div/div[3]/div/div/div/div/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (result) {
            result.textContent = `总花销: ${totalCost} (有 ${failedCount} 个未成功获取价格)`;
        } else {
            console.error("未找到指定的XPath元素");
        }
    }

    function monitorElement(element) {
        console.log(`开始监控元素: ${element.id}`);
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    let text = element.textContent;
                    console.log(`元素ID: ${element.id}, 更新内容: ${text}`);
                    updateTotalCost();
                }
            });
        });

        observer.observe(element, {
            characterData: true,
            subtree: true,
            childList: true
        });
    }

    function initializeMonitoring() {
        const elements = document.querySelectorAll("[id^='item-price-']");
        console.log(`初始化监控，找到 ${elements.length} 个以 'item-price-' 开头的元素`);
        elements.forEach(element => {
            monitorElement(element);
        });
        updateTotalCost();
    }

    function monitorPageChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 仅处理元素节点
                        const elements = node.querySelectorAll("[id^='item-price-']");
                        elements.forEach(element => {
                            console.log(`动态添加并监控新元素: ${element.id}`);
                            monitorElement(element);
                        });
                        // 检查直接添加的节点
                        if (node.id && node.id.startsWith('item-price-')) {
                            console.log(`动态添加并监控新元素: ${node.id}`);
                            monitorElement(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        initializeMonitoring();
    }

    monitorPageChanges();
})();