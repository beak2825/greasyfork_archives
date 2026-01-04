// ==UserScript==
// @name         百家号优化工具
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  悬浮按钮菜单，陆续更新更多百家号实用小工具
// @author       诸葛
// @license      MIT
// @match        https://baijiahao.baidu.com/
// @match        https://baijiahao.baidu.com/builder/rc/*
// @match        https://duanju.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512237/%E7%99%BE%E5%AE%B6%E5%8F%B7%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/512237/%E7%99%BE%E5%AE%B6%E5%8F%B7%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在页面加载时检查是否需要自动执行已读操作并返回
    window.addEventListener('load', function() {
        const noticePageUrl = 'https://baijiahao.baidu.com/builder/rc/noticemessage/notice';
        const returnUrl = localStorage.getItem('returnUrl');

        // 如果当前在通知页面且存在返回 URL，则等待 5 秒后执行检测和点击操作
        if (window.location.href === noticePageUrl && returnUrl) {
            // 等待 5 秒
            setTimeout(function() {
                // 检查是否存在 "全部置为已读" 按钮
                var originalButton = document.querySelector('a.read[data-urlkey="通知-一键已读-pv/uv"]');

                if (originalButton) {
                    originalButton.click();  // 模拟点击
                    console.log('已点击一键已读按钮');
                } else {
                    console.log('未找到"全部置为已读"按钮');
                }

                // 点击后返回原页面
                setTimeout(function() {
                    localStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                }, 1000);  // 延迟 1 秒后跳转回原页面

            }, 100);  // 等待 0.1 秒再执行检测
        }
    });

    window.addEventListener('load', function() {
        // 创建悬浮按钮
        var floatingButton = document.createElement('div');
        floatingButton.style.position = 'fixed';
        floatingButton.style.top = '20px';  // 固定在页面右上角
        floatingButton.style.bottom = '20px';
        floatingButton.style.right = '20px';
        floatingButton.style.zIndex = '1000';
        floatingButton.style.width = '40px';
        floatingButton.style.height = '40px';
        floatingButton.style.backgroundColor = '#007bff';
        floatingButton.style.borderRadius = '50%';
        floatingButton.style.display = 'flex';
        floatingButton.style.justifyContent = 'center';
        floatingButton.style.alignItems = 'center';
        floatingButton.style.cursor = 'pointer';
        floatingButton.style.color = '#fff';
        floatingButton.innerText = '+';

        // 创建菜单容器
        var menuContainer = document.createElement('div');
        menuContainer.style.position = 'absolute';
        menuContainer.style.right = '60px'; // 向左展开
        menuContainer.style.top = '0px';
        menuContainer.style.backgroundColor = 'transparent'; // 背景透明
        menuContainer.style.border = 'none'; // 无边框
        menuContainer.style.borderRadius = '5px';
        menuContainer.style.display = 'none'; // 初始隐藏
        menuContainer.style.flexDirection = 'column';
        menuContainer.style.color = '#000'; // 菜单文字颜色

        // 菜单项样式
        const menuItemStyle = {
            padding: '5px 10px',
            cursor: 'pointer',
            backgroundColor: '#fff',
            border: '1px solid #007bff',
            borderRadius: '5px',
            marginBottom: '5px',
            color: '#000',
            whiteSpace: 'nowrap'
        };

        // 创建菜单项1：一键已读通知
        var menuItem1 = document.createElement('div');
        Object.assign(menuItem1.style, menuItemStyle);
        menuItem1.innerText = '一键已读通知';
        menuItem1.addEventListener('click', function() {
            const currentUrl = window.location.href;
            const noticePageUrl = 'https://baijiahao.baidu.com/builder/rc/noticemessage/notice';

            // 保存当前页面的URL到localStorage中
            localStorage.setItem('returnUrl', currentUrl);

            // 跳转到通知页面
            window.location.href = noticePageUrl;
        });
        // 创建菜单项2：干掉AI助手
        var menuItem2 = document.createElement('div');
        Object.assign(menuItem2.style, menuItemStyle);
        menuItem2.innerText = '干掉AI助手';
        menuItem2.addEventListener('click', function() {
            window.location.href = 'https://greasyfork.org/zh-CN/scripts/489210';
        });
         // 创建菜单项3：百家号工单反馈
        var menuItem3 = document.createElement('div');
        Object.assign(menuItem3.style, menuItemStyle);
        menuItem3.innerText = '问题反馈';
        menuItem3.addEventListener('click', function() {
            window.location.href = 'https://baijiahao.baidu.com/builder/rc/stores/complain?aside=0';
        });

        // 将菜单项添加到菜单容器
        menuContainer.appendChild(menuItem1);
        menuContainer.appendChild(menuItem2);
        menuContainer.appendChild(menuItem3);

        // 将菜单容器和按钮添加到页面
        document.body.appendChild(floatingButton);
        floatingButton.appendChild(menuContainer);

        // 控制菜单显示和隐藏
        floatingButton.addEventListener('click', function(event) {
            event.stopPropagation(); // 防止事件冒泡
            if (menuContainer.style.display === 'none') {
                menuContainer.style.display = 'flex';
            } else {
                menuContainer.style.display = 'none';
            }
        });

        // 点击页面其他地方隐藏菜单
        document.addEventListener('click', function() {
            menuContainer.style.display = 'none';
        });

        // 实现按钮可拖动
        let offsetX, offsetY;
        floatingButton.addEventListener('mousedown', function(e) {
            offsetX = e.clientX - floatingButton.getBoundingClientRect().left;
            offsetY = e.clientY - floatingButton.getBoundingClientRect().top;
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        function mouseMoveHandler(e) {
            floatingButton.style.left = e.clientX - offsetX + 'px';
            floatingButton.style.top = e.clientY - offsetY + 'px';
            floatingButton.style.bottom = 'auto'; // 移动时不再固定在底部
            floatingButton.style.right = 'auto';  // 移动时不再固定在右边
        }

        function mouseUpHandler() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }
    });
})();
