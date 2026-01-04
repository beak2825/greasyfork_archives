// ==UserScript==
// @name         通义千问侧边栏收缩(Tongyi Qianwen Sidebar Toggle)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a toggleable sidebar to Aliyun Tongyi Qianwen page.
// @author       Epool
// @match        https://tongyi.aliyun.com/qianwen/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484785/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%94%B6%E7%BC%A9%28Tongyi%20Qianwen%20Sidebar%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484785/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%94%B6%E7%BC%A9%28Tongyi%20Qianwen%20Sidebar%20Toggle%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入CSS样式
    function GM_addStyle(css) {
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    GM_addStyle(`
        .container--IUBnVmjY .contentWrap--x9xW84h6 .side--L0W1WdHl {
            width: 275px; /* 假设初始宽度 */
            transition: width 0.3s ease; /* 添加过渡效果 */
        }

        /* 收缩状态的样式 */
        .container--IUBnVmjY .contentWrap--x9xW84h6 .side--L0W1WdHl.collapsed {
            display: none;
            transition: width 0.3s ease; /* 添加过渡效果 */
        }

        /* 按钮样式 */
        #toggle-sidebar {
            position: absolute;
            right: calc(50% - 50px); /* 让按钮位于侧边栏右侧的中间位置 */
            top: 10px;
            z-index: 9999;
            padding: 5px 10px;
            background-color: #ffffff;
            border: 1px solid #000000;
            cursor: pointer;
        }
    `);

    // 延迟读取侧边栏元素
    setTimeout(function() {
        var sidebar = document.querySelector('.side--L0W1WdHl');
        if (!sidebar) {
            // 如果不存在这个侧边栏，则退出脚本
            return;
        }

        // 创建按钮
        var toggleButton;
        if (document.getElementById('toggle-sidebar')) {
            toggleButton = document.getElementById('toggle-sidebar');
        } else {
            toggleButton = document.createElement('button');
            toggleButton.id = 'toggle-sidebar';
            toggleButton.textContent = '展开/收缩';
            document.body.appendChild(toggleButton);
        }

        // 添加点击事件监听器
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }, 2000); // 延迟2秒读取侧边栏元素

    // 使用MutationObserver监听侧边栏元素的出现
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes.length > 0) {
                // 遍历新增的节点，检查是否包含侧边栏元素
                for (var node of mutation.addedNodes) {
                    if (node.classList && node.classList.contains('side--L0W1WdHl')) {
                        // 创建按钮
                        var toggleButton;
                        if (document.getElementById('toggle-sidebar')) {
                            toggleButton = document.getElementById('toggle-sidebar');
                        } else {
                            toggleButton = document.createElement('button');
                            toggleButton.id = 'toggle-sidebar';
                            toggleButton.textContent = '展开/收缩';
                            document.body.appendChild(toggleButton);
                        }

                        // 添加点击事件监听器
                        toggleButton.addEventListener('click', function() {
                            node.classList.toggle('collapsed');
                        });

                        // 停止观察器
                        observer.disconnect();
                        return;
                    }
                }
            }
        }
    });

    // 监听整个文档的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();