// ==UserScript==
// @name         GitHub侧边栏滚动
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  让信息等侧边栏内容随滚动移动
// @author       大触紫衣WisteriaZy
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505872/GitHub%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/505872/GitHub%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sidebar = document.querySelector('.Layout-sidebar');
    const CHECK_INTERVAL = 5;
    if (sidebar) {
        // 获取 sidebar 初始的 y 轴位置
        var initialSidebarTop = sidebar.getBoundingClientRect().top + window.pageYOffset;
        var sidebarRect = sidebar.getBoundingClientRect();
        var sidebarLeft = sidebarRect.left + window.pageXOffset;
        var sidebarWidth = sidebarRect.width;

        var isScrollLocked = false; // 滚动锁定状态

        // 滚动锁定按钮
        var reportLink = document.querySelector('a[href*="#readme-ov-file"]');
        var scrollLockContainer = document.createElement('div');
        scrollLockContainer.style.display = 'inline-block';
        scrollLockContainer.style.marginLeft = '10px';

        var scrollLockCheckbox = document.createElement('input');
        scrollLockCheckbox.type = 'checkbox';
        scrollLockCheckbox.id = 'scroll-lock-checkbox';
        scrollLockCheckbox.style.marginRight = '5px';

        var scrollLockLabel = document.createElement('label');
        scrollLockLabel.innerText = '滚动锁定';
        scrollLockLabel.htmlFor = 'scroll-lock-checkbox';
        scrollLockLabel.style.color = '#59636e';

        scrollLockContainer.appendChild(scrollLockCheckbox);
        scrollLockContainer.appendChild(scrollLockLabel);

        if (reportLink) {
            reportLink.parentNode.appendChild(scrollLockContainer);
        }

        sidebar.style.position = 'relative';
        sidebar.style.top = '0px';
        sidebar.style.left = 'auto';
        sidebar.style.width = `${sidebarWidth}px`;

        // 滚动事件监听
        setInterval(() => {
            var scrollY = window.pageYOffset;

            if (scrollY > initialSidebarTop - 10 & !isScrollLocked) {
                // 跟随
                sidebar.style.position = 'fixed';
                sidebar.style.top = '10px';
                sidebar.style.left = `${sidebarLeft}px`;
                sidebar.style.width = `${sidebarWidth}px`;
            } else {
                // 固定
                sidebar.style.position = 'relative';
                sidebar.style.top = '0px';
                sidebar.style.left = 'auto';
                sidebar.style.width = `${sidebarWidth}px`;
            }
        }, CHECK_INTERVAL);
        // 滚动锁定切换事件监听
        scrollLockCheckbox.addEventListener('change', function() {
            isScrollLocked = scrollLockCheckbox.checked;

            if (isScrollLocked) {
                // 启用滚动锁定
                sidebar.style.position = 'auto';
                sidebar.style.top = 'auto';
                sidebar.style.left = 'auto';
                sidebar.style.width = `${sidebarWidth}px`;

            } else {
                // 解除滚动锁定
                sidebar.style.position = 'fixed';
                sidebar.style.top = '10px';
                sidebar.style.left = `${sidebarLeft}px`;
                sidebar.style.width = `${sidebarWidth}px`;
            }
        });
    }
})();
