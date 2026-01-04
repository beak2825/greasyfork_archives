// ==UserScript==
// @name         头条号批量删除作品
// @namespace    https://zhangzifan.com
// @version      0.1
// @description  头条号批量删除作品，可以设置搜索关键词，删除指定内容。
// @author       你的名字
// @match        https://mp.toutiao.com/profile_v4/manage/content/all
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/507073/%E5%A4%B4%E6%9D%A1%E5%8F%B7%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E4%BD%9C%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/507073/%E5%A4%B4%E6%9D%A1%E5%8F%B7%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E4%BD%9C%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        console.log('页面打开成功！');

        // 脚本初始化
        inputAndEnterKeyword('泪雪网');//搜索词

        // 定义监控间隔
        const INTERVAL_MS = 1000; // 每秒检查一次

        // 输入关键词并执行回车操作
        function inputAndEnterKeyword(search) {
            // 找到输入框元素
            const inputElement = document.querySelector(".search-wrap input");
            if (inputElement) {
                setTimeout(() => {
                    inputElement.focus();
                    setTimeout(() => {
                        document.execCommand('insertText', false, search);
                        setTimeout(() => {
                            // 点击搜索
                            const searchElement = document.querySelector(".search-wrap .search-icon-wrap");
                            if (searchElement) {
                                searchElement.click();
                            }
                            // 开始监控页面元素
                            startMonitoring();
                        }, 500);
                    }, 500);
                }, 1000);
            }else{
                const intervalInput = setInterval(() => {
                    console.log('加载完成');
                    inputAndEnterKeyword(search);
                    clearInterval(intervalInput);
                }, 1000);
            }
        }


        // 开始监控指定元素
        function startMonitoring() {
            // 创建一个定时器，用于每隔 INTERVAL_MS 毫秒检查一次
            let checkInterval = setInterval(() => {
                // 查找目标元素
                const targetElement = document.querySelector("#root > div > div.all-content-list > div.search-result");

                // 如果目标元素存在，则停止监控
                if (targetElement) {
                    clearInterval(checkInterval);
                    performClickActions();
                }
            }, INTERVAL_MS);
        }

        // 执行点击操作的函数
        function performClickActions() {
            // 模拟鼠标悬停到 更多
            const hoverElement = document.querySelector("#root div.all-content-list > div:nth-child(2)  div.xigua-article-action-list .action-content .item:last-child .item-inner");
            if (hoverElement) {
                simulateMouseEvent(hoverElement, 'mouseover');
                simulateMouseEvent(hoverElement, 'mousemove');
            }

            setTimeout(() => {
                // 点击 删除作品
                const delElement = document.querySelector('.more-content .item:last-child .item-inner');
                if (delElement) {
                    delElement.click();
                }
                // 点击 确定
                setTimeout(() => {
                    const confirmButton = document.querySelector('.byte-modal-footer button.byte-btn-primary');
                    if (confirmButton) {
                        confirmButton.click();
                        setTimeout(() => {
                            performClickActions();
                        }, 2000);
                    }
                }, 1000);
            }, 1000);
        }

        // 模拟鼠标事件
        function simulateMouseEvent(element, eventName) {
            const event = new MouseEvent(eventName, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
        }

    });
})();