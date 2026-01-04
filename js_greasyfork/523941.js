// ==UserScript==
// @name        自动取消百度云链接订阅
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description   取消百度云自动订阅链接
// @author       as176590811
// @match        *://pan.baidu.com/s/*
// @license     GPL License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523941/%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E7%99%BE%E5%BA%A6%E4%BA%91%E9%93%BE%E6%8E%A5%E8%AE%A2%E9%98%85.user.js
// @updateURL https://update.greasyfork.org/scripts/523941/%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E7%99%BE%E5%BA%A6%E4%BA%91%E9%93%BE%E6%8E%A5%E8%AE%A2%E9%98%85.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hasClicked = false; // 防止重复点击

    // 创建一个MutationObserver来监听DOM变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (hasClicked) return;

            // 查找已订阅元素
            const subscribedElement = document.querySelector('em.icon.noicon.pdr3px.noicon-yidingyue[title="已订阅"]');
            if (subscribedElement) {
                console.log('找到已订阅元素');
                subscribedElement.click();

                // 查找取消订阅按钮
                const cancelElement = document.querySelector('a.g-button.g-button-large[title="不再订阅"][node-type="cancel"] .text');
                if (cancelElement) {
                    console.log('找到不再订阅元素');
                    cancelElement.click();
                }

                hasClicked = true; // 设置标志
                observer.disconnect(); // 停止观察

                // 延时关闭订阅的弹窗
                setTimeout(() => {
                    const closeButtons = document.querySelectorAll('span.dialog-icon.dialog-close.icon.icon-close');
                    if (closeButtons.length > 0) {
                        console.log(`找到 ${closeButtons.length} 个弹窗关闭按钮`);
                        closeButtons.forEach(button => {
                            button.click(); // 模拟点击每个关闭按钮
                        });
                    } else {
                        console.log('未找到任何 span.dialog-icon.dialog-close.icon.icon-close 元素');
                    }
                }, 500); // 延时500ms关闭订阅的弹窗

                // 延时关闭保存的弹窗
                setTimeout(() => {
                    const fxCloseButtons = document.querySelectorAll('div.fx-icon-close.icon.icon-svg-s-close');
                    if (fxCloseButtons.length > 0) {
                        console.log(`找到 ${fxCloseButtons.length} 个 div.fx-icon-close.icon.icon-svg-s-close 元素`);
                        fxCloseButtons.forEach(button => {
                            button.click(); // 模拟点击每个关闭按钮
                        });
                    } else {
                        console.log('未找到任何 div.fx-icon-close.icon.icon-svg-s-close 元素');
                    }

                    // 重新启动观察器
                    hasClicked = false; // 重置标志
                    observer.observe(document.body, { childList: true, subtree: true });
                }, 500); // 延时500ms处理关闭保存的弹窗
            }
        });
    });

    // 开始监听
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('脚本已启动，正在监听DOM文档变化...');
})();
