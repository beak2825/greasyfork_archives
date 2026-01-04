// ==UserScript==
// @name         Nacos 分页修改
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将 Nacos 后台的默认分页长度修改为 100
// @author       Selier
// @match        http://192.168.1.7:8848/nacos/
// @match        http://nacos.lemobar.com/nacos/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nacos.io
// @license       GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540566/Nacos%20%E5%88%86%E9%A1%B5%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/540566/Nacos%20%E5%88%86%E9%A1%B5%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 定义要执行的函数 a
    async function a() {
        await sleep(500);
        console.log("执行函数 a - 配置管理相关操作");
        $("#root > div > div.right-panel > div > div > div.next-pagination.next-medium.next-normal > div.next-pagination-size-selector > span.next-select.next-select-trigger.next-select-single.next-medium.next-pagination-size-selector-dropdown.next-inactive.next-no-search").click()

        $("#root > div > div.right-panel > div > div > div.next-pagination.next-medium.next-normal > div.next-pagination-size-selector > div > ul > li:nth-child(5)").click()

    }

    // 定义要执行的函数 b
    async function b() {
        console.log("执行函数 b - 服务列表相关操作");
        await sleep(500);
        $("#root > div > div.right-panel > div > div:nth-child(5) > div > div.next-pagination-size-selector > span.next-select.next-select-trigger.next-select-single.next-medium.next-pagination-size-selector-dropdown.next-inactive.next-no-search").click()

        $("#root > div > div.right-panel > div > div:nth-child(5) > div > div.next-pagination-size-selector > div > ul > li:nth-child(5)").click()
    }
    (function($) {
        'use strict';




        // 目标元素选择器和对应的处理函数
        const menuItems = [
            {
                selector: '#root > div > div.left-panel > ul > li:nth-child(1) > ul > li.next-menu-item.current-path',
                handler: a,
                label: '配置列表'
            },
            {
                selector: '#root > div > div.left-panel > ul > li:nth-child(2) > ul > li.next-menu-item.current-path',
                handler: b,
                label: '服务列表'
            }
        ];


        // 等待 DOM 加载完成
        $(document).ready(function() {
            // 为每个菜单项绑定点击事件
            menuItems.forEach(item => {
                $(document).on('click', item.selector, function(event) {
                    event.preventDefault();
                    console.log(`${item.label} 被点击，触发对应函数`);
                    // 触发对应的处理函数
                    item.handler();
                });
            });

            // 监听 DOM 变化，确保动态元素也能被处理
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        menuItems.forEach(item => {
                            const newElements = $(mutation.addedNodes).find(item.selector);
                            if (newElements.length) {
                                console.log(`检测到新的 ${item.label} 菜单项:`, newElements.length);
                            }
                        });
                    }
                });
            });

            // 开始观察 DOM 变化
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 初始检查元素是否存在
            checkElementsExistence();
        });

        // 定期检查元素存在状态
        function checkElementsExistence() {
            menuItems.forEach(item => {
                const element = $(item.selector);
                if (element.length) {
                    console.log(`${item.label} 存在，当前状态:`, element.is(':visible') ? '可见' : '隐藏');
                } else {
                    console.log(`${item.label} 不存在或尚未加载`);
                }
            });

            // 每 3 秒检查一次
            setTimeout(checkElementsExistence, 3000);
        }
    })(jQuery);

    // 获取当前页面的 URL
    const currentUrl = window.location.href;

    // 检查 URL 并执行函数的方法
    function checkUrl() {
        const currentUrl = window.location.href;

        // 只有当 URL 变化或首次检查时才执行逻辑
        // 判断 URL 中是否包含特定关键词并执行对应函数
        if (currentUrl.includes("configurationManagement")) {
            a();
        } else if (currentUrl.includes("serviceManagement")) {
            b();
        }
    }
    // 初始检查
    checkUrl();


})();