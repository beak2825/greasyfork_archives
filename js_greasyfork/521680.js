// ==UserScript==
// @name         Code下载视频集合
// @namespace    http://tampermonkey.net/
// @version      2024-12-16
// @description  下载视频收集数据流
// @author       You
// @match        *://tiksave.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521680/Code%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/521680/Code%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initCss () {
        // 创建并插入样式标签
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            body {
                padding-top: 10px;
                padding-right: 210px; /* 给右侧预留空间 */
            }
            .fixed-textarea {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 200px;
                height: auto;
                resize: none; /* 禁用 textarea 的拖动改变大小功能 */
            }
        `;
        document.head.appendChild(style);

    }

    //add textarea input
    function Patch() {
        // 创建菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.setAttribute('id', 'my-textarea-box');
        menuContainer.style.position = 'fixed';
        menuContainer.style.top = '18px';
        menuContainer.style.right = '2px';
        menuContainer.style.display = 'flex';
        menuContainer.style.flexDirection = 'column';
        menuContainer.style.alignItems = 'flex-end';
        menuContainer.style.transition = 'opacity 0.3s';
        menuContainer.style.zIndex = '10001';
        menuContainer.style.background = 'red';


        // 创建 textarea 元素
        var textarea = document.createElement('textarea');
        textarea.setAttribute('id', 'my-textarea');

        // 设置类名以便应用样式
        textarea.className = 'fixed-textarea';

        // 设置 textarea 行数
        textarea.rows = 20;

        // 将 textarea 添加到 body 中
        menuContainer.appendChild(textarea);

        document.body.appendChild(menuContainer);
    }

    function show() {
        const menuContainer = document.querySelector('#my-textarea-box');
        menuContainer.style.display =='flex'? menuContainer.style.display= 'none':menuContainer.style.display= 'flex';
    }

    // Your code here...
    // 初始化按钮
    function initFixedButton() {
        // 创建菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.setAttribute('id', 'my-buttons');
        menuContainer.style.position = 'fixed';
        menuContainer.style.bottom = '18px';
        menuContainer.style.right = '2px';
        menuContainer.style.display = 'flex';
        menuContainer.style.flexDirection = 'column';
        menuContainer.style.alignItems = 'flex-end';
        menuContainer.style.transition = 'opacity 0.3s';
        menuContainer.style.opacity = '0'; // 初始隐藏
        menuContainer.style.pointerEvents = 'none'; // 初始不可点击
        menuContainer.style.zIndex = '10001';

        // 创建菜单项 'Code',
        let items = ['Patch']
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.setAttribute('id', item);
            menuItem.style.zIndex = '10001';
            menuItem.innerText = item;
            menuItem.style.padding = '10px';
            menuItem.style.backgroundColor = '#007BFF';
            menuItem.style.color = 'white';
            menuItem.style.borderRadius = '50%';
            menuItem.style.margin = '5px 0';
            menuItem.style.width = '50px';
            menuItem.style.height = '50px';
            menuItem.style.display = 'flex';
            menuItem.style.alignItems = 'center';
            menuItem.style.justifyContent = 'center';
            menuItem.style.transition = 'transform 0.3s';
            menuItem.style.transform = 'scale(0)'; // 初始隐藏
            menuItem.style.cursor = 'pointer';

            menuItem.addEventListener('click', () => {
                switch(item) {
                    case "Patch": show();break;
                }
            })

            menuContainer.appendChild(menuItem);
        });

        // 创建切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.style.width = '0';
        toggleButton.style.height = '0';
        toggleButton.style.borderRadius = '50%';
        toggleButton.style.border = '10px solid #FB7701';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.position = 'fixed';
        toggleButton.style.zIndex = '10001';
        toggleButton.style.bottom = '0px';
        toggleButton.style.right = '0px';

        // 切换菜单显示效果
        toggleButton.addEventListener('click', () => {
            const isVisible = menuContainer.style.opacity === '1';
            menuContainer.style.opacity = isVisible ? '0' : '1';
            menuContainer.style.pointerEvents = isVisible ? 'none' : 'auto';

            // 显示/隐藏菜单项
            const menuItems = menuContainer.children;
            for (let i = 0; i < menuItems.length; i++) {
                menuItems[i].style.transform = isVisible ? 'scale(0)' : 'scale(1)';
            }
        });
        toggleButton.click()

        // 添加元素到文档
        document.body.appendChild(menuContainer);
        document.body.appendChild(toggleButton);

        // 逐个显示菜单项
        setTimeout(() => {
            const menuItems = menuContainer.children;
            for (let i = 0; i < menuItems.length; i++) {
                menuItems[i].style.transitionDelay = `${i * 100}ms`;
            }
        }, 0);
    }
    initCss()
    // show textarea
    Patch()
    initFixedButton()
})();