// ==UserScript==
// @name         王攀的ChatGpt
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  ChatGpt
// @author       wangpan
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490349/%E7%8E%8B%E6%94%80%E7%9A%84ChatGpt.user.js
// @updateURL https://update.greasyfork.org/scripts/490349/%E7%8E%8B%E6%94%80%E7%9A%84ChatGpt.meta.js
// ==/UserScript==

// 此元数据用于描述用户脚本的信息，包括脚本名称、作者、版本等。

// @name：脚本的名称，将显示在用户脚本管理器中。
// @namespace：脚本的命名空间，用于标识脚本的唯一性。
// @version：脚本的版本号，用于跟踪脚本的更新。
// @description：脚本的简要描述，用于向用户解释脚本的功能。
// @author：脚本的作者，用于注明脚本的创建者。
// @match：脚本匹配的 URL 模式，用于指定脚本在哪些网站上运行。
// @grant：脚本需要的权限，用于指定脚本可以访问的浏览器功能。
// @license：脚本的许可证，用于指定脚本的使用条款。
// @downloadURL：脚本的下载 URL，用于提供脚本的更新。
// @updateURL：脚本的更新 URL，用于提供脚本的更新检查。

(function() {
    'use strict';

    // 定义一些变量
    let popupOpen = false;  // 标记弹出窗口是否打开
    let popupElement = null;  // 保存弹出窗口元素的引用

    // 创建聊天按钮
    function createChatButton() {
        // 创建一个按钮元素
        const chatButton = document.createElement('button');

        // 设置按钮的文本内容
        chatButton.textContent = 'Chat';

        // 设置按钮的样式
        chatButton.style.position = 'fixed';  // 固定定位
        chatButton.style.bottom = '20px';  // 距离底部 20px
        chatButton.style.right = '27px';  // 距离右侧 27px
        chatButton.style.width = '40px';  // 宽度为 40px
        chatButton.style.height = '22px';  // 高度为 20px
        chatButton.style.zIndex = '9999';  // 设置较高的 z-index 以确保按钮始终在最前面
        chatButton.style.padding = '10px';  // 设置按钮内边距
        chatButton.style.backgroundColor = '#007bff';  // 设置按钮背景色
        chatButton.style.color = 'white';  // 设置按钮文本颜色
        chatButton.style.border = 'none';  // 去除按钮边框
        chatButton.style.borderRadius = '5px';  // 设置按钮圆角
        chatButton.style.cursor = 'pointer';  // 设置按钮光标为指针
        chatButton.style.display = 'flex';  // 设置按钮为 flex 布局
        chatButton.style.justifyContent = 'center';  // 让按钮文字水平居中
        chatButton.style.alignItems = 'center';  // 让按钮文字垂直居中

        // 添加点击事件监听器
        chatButton.addEventListener('click', function() {
            // 如果弹出窗口已打开，则关闭它
            if (popupOpen) {
                document.body.removeChild(popupElement);
                popupOpen = false;
                popupElement = null;
            } else {
                // 如果弹出窗口未打开，则创建它
                createPopup();
                popupOpen = true;
            }
        });

        // 将按钮添加到页面中
        document.body.appendChild(chatButton);
    }

    // 创建弹出窗口
    function createPopup() {
        // 创建一个 div 元素作为弹出窗口
        const popup = document.createElement('div');

        // 设置弹出窗口的 ID
        popup.id = 'chatPopup';

        // 设置弹出窗口的样式
        popup.style.position = 'fixed';  // 固定定位
        popup.style.bottom = '20px';  // 距离底部 20px
        popup.style.right = '20px';  // 距离右侧 20px
        popup.style.width = '360px';  // 宽度为 360px
        popup.style.height = '650px';  // 高度为 650px
        popup.style.backgroundColor = '#f9f9f9';  // 设置背景色
        popup.style.border = '1px solid #ccc';  // 设置边框
        popup.style.borderRadius = '8px';  // 设置圆角
        popup.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';  // 设置阴影
        popup.style.overflow = 'hidden';  // 隐藏溢出内容
        popup.style.zIndex = '999';  // 设置较高的 z-index 以确保弹出窗口始终在最前面

        // 创建一个 iframe 元素并将其添加到弹出窗口中
        const iframe = document.createElement('iframe');
        iframe.src = 'https://zhangrui.chat/#/chat';  // 设置 iframe 的源 URL
        iframe.style.width = '100%';  // 设置 iframe 的宽度
        iframe.style.height = '100%';  // 设置 iframe 的高度
        iframe.style.border = 'none';  // 去除 iframe 的边框
        popup.appendChild(iframe);

        // 将弹出窗口添加到页面中
        document.body.appendChild(popup);

        // 保存弹出窗口元素的引用
        popupElement = popup;
    }

    // 添加右键菜单
    document.addEventListener('contextmenu', function(e) {
        // 阻止默认右键菜单
        e.preventDefault();

        // 移除之前存在的右键菜单
        const existingContextMenu = document.getElementById('contextMenu');
        if (existingContextMenu) {
            document.body.removeChild(existingContextMenu);
        }

        // 创建一个 div 元素作为右键菜单
        const contextMenu = document.createElement('div');

        // 设置右键菜单的 ID
        contextMenu.id = 'contextMenu';

        // 设置右键菜单的样式
        contextMenu.style.position = 'fixed';  // 固定定位
        contextMenu.style.top = e.clientY + 'px';  // 设置距离鼠标光标顶部的位置
        contextMenu.style.left = e.clientX + 'px';  // 设置距离鼠标光标左边的位置
        contextMenu.style.backgroundColor = '#fff';  // 设置背景色
        contextMenu.style.border = '1px solid #ccc';  // 设置边框
        contextMenu.style.padding = '5px';  // 设置内边距
        contextMenu.style.zIndex = '9999';  // 设置较高的 z-index 以确保右键菜单始终在最前面

        // 根据弹出窗口是否打开，添加不同的选项
        if (popupOpen) {
            // 如果弹出窗口已打开，则添加关闭选项
            const closeChatOption = document.createElement('div');
            closeChatOption.textContent = '关闭 Chat';  // 设置选项文本
            closeChatOption.style.cursor = 'pointer';  // 设置光标为指针
            closeChatOption.addEventListener('click', function() {
                // 如果弹出窗口已打开，则关闭它
                if (popupOpen) {
                    document.body.removeChild(popupElement);
                    popupOpen = false;
                    popupElement = null;
                }
                // 移除右键菜单
                document.body.removeChild(contextMenu);
            });
            contextMenu.appendChild(closeChatOption);
        } else {
            // 如果弹出窗口未打开，则添加打开选项
            const openChatOption = document.createElement('div');
            openChatOption.textContent = '打开 Chat';  // 设置选项文本
            openChatOption.style.cursor = 'pointer';  // 设置光标为指针
            openChatOption.addEventListener('click', function() {
                // 如果弹出窗口未打开，则创建它
                if (!popupOpen) {
                    createPopup();
                    popupOpen = true;
                }
                // 移除右键菜单
                document.body.removeChild(contextMenu);
            });
            contextMenu.appendChild(openChatOption);
        }

        // 将右键菜单添加到页面中
        document.body.appendChild(contextMenu);
    });


    // 检查当前页面是否是 https://zhangrui.chat/#/chat，如果是则不创建聊天按钮
    if (!window.location.href.includes('https://zhangrui.chat/#/chat')) {
        createChatButton();
    }

})();
