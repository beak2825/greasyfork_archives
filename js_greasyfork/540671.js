// ==UserScript==
// @name         专利查询站点弹窗处理
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在cpquery.cponline.cnipa.gov.cn网站删除q-dialog元素
// @author       Ripper
// @match        https://cpquery.cponline.cnipa.gov.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540671/%E4%B8%93%E5%88%A9%E6%9F%A5%E8%AF%A2%E7%AB%99%E7%82%B9%E5%BC%B9%E7%AA%97%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/540671/%E4%B8%93%E5%88%A9%E6%9F%A5%E8%AF%A2%E7%AB%99%E7%82%B9%E5%BC%B9%E7%AA%97%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除q-dialog元素的函数
    function removeDialogBackdrops() {
        const backdrops = document.querySelectorAll('.q-dialog');
        backdrops.forEach(backdrop => {
            backdrop.remove();
        });
        if (backdrops.length > 0) {
            console.log(`已删除 ${backdrops.length} 个 q-dialog 元素`);
        }
        return backdrops.length;
    }

    // 页面加载完成后立即执行一次
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeDialogBackdrops);
    } else {
        removeDialogBackdrops();
    }

    // 使用MutationObserver监听DOM变化，处理动态添加的元素
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            // 检查是否有新增的节点
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    // 检查新增的节点是否是Element类型且包含q-dialog类
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('q-dialog')) {
                            shouldCheck = true;
                        } else if (node.querySelector && node.querySelector('.q-dialog')) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });

        // 如果检测到q-dialog相关的变化，则执行删除
        if (shouldCheck) {
            setTimeout(removeDialogBackdrops, 100); // 延迟100ms执行，确保元素完全加载
        }
    });

    // 开始监听整个document的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 额外的定时检查机制（可选，用于处理特殊情况）
    let checkCount = 0;
    const maxChecks = 20; // 最多检查20次
    const intervalId = setInterval(function() {
        removeDialogBackdrops();
        checkCount++;

        // 20秒后停止定时检查
        if (checkCount >= maxChecks) {
            clearInterval(intervalId);
            console.log('定时检查已停止');
        }
    }, 1000); // 每秒检查一次

    console.log('q-dialog删除脚本已启动');
})();