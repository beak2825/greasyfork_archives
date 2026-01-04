// ==UserScript==
// @name         点击跳转其乐论坛tag链接（超链接版）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  将按钮改为超链接，左键跳转到Keylol的Tab页面，鼠标中键点击后模拟右键点击 + PgDn + Enter
// @author       You
// @match        https://store.steampowered.com/*
// @icon         https://www.keylol.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520101/%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC%E5%85%B6%E4%B9%90%E8%AE%BA%E5%9D%9Btag%E9%93%BE%E6%8E%A5%EF%BC%88%E8%B6%85%E9%93%BE%E6%8E%A5%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/520101/%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC%E5%85%B6%E4%B9%90%E8%AE%BA%E5%9D%9Btag%E9%93%BE%E6%8E%A5%EF%BC%88%E8%B6%85%E9%93%BE%E6%8E%A5%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('.apphub_HeaderStandardTop').forEach(element => {
        console.log(element);
        let link = document.createElement('a');
        link.textContent = '在 Keylol 的 Tab 上查看';  // 修改为超链接

        // 添加类似于你提供的按钮样式
        link.style.padding = '10px 20px';
        link.style.fontSize = '14px';
        link.style.background = 'rgba(103, 193, 245, 0.2)';  // 背景颜色
        link.style.color = '#67c1f5';  // 字体颜色
        link.style.textDecoration = 'none';
        link.style.borderRadius = '3px';  // 边角半径
        link.style.display = 'inline-flex';
        link.style.alignItems = 'center';
        link.style.marginTop = '20px';
        link.style.border = 'none';
        link.style.cursor = 'pointer';
        link.style.fontWeight = '600';

        // 悬停时的样式变化
        link.addEventListener('mouseenter', () => {
            link.style.backgroundColor = '#6f99e6';  // 鼠标悬停时背景变色
        });
        link.addEventListener('mouseleave', () => {
            link.style.backgroundColor = 'rgba(103, 193, 245, 0.2)';  // 恢复原来的背景色
        });

        // 添加图标
        var icon = document.createElement('i');
        icon.className = 'ico16';  // 图标样式
        icon.style.background = 'url("https://www.keylol.com/favicon.ico") 0 0 / contain no-repeat';
        icon.style.width = '16px';
        icon.style.height = '16px';
        icon.style.marginRight = '8px';  // 图标和文字之间的间隔

        link.prepend(icon);  // 将图标放在文字前

        // 获取 Steam 页面的 App ID
        var appid = window.location.pathname.split('/')[2];  // 获取当前页面的appid
        var redirectUrl = 'https://keylol.com/plugin.php?id=keylol_tags:redirect&appid=' + appid;  // 构造跳转链接
        link.href = redirectUrl;

        // 左键点击时跳转到对应的Tab页面
        link.addEventListener('click', (e) => {
            e.preventDefault();  // 阻止默认行为
            window.location.href = redirectUrl;  // 跳转到Keylol的页面
        });

        // 鼠标中键点击时模拟右键点击 + PgDn + Enter
        link.addEventListener('mousedown', (e) => {
            if (e.button === 1) {  // 检查是否是中键点击
                // 模拟右键点击
                var rightClickEvent = new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    button: 2
                });
                link.dispatchEvent(rightClickEvent);  // 触发右键点击事件

                // 模拟按下“PgDn”键
                var pgDnEvent = new KeyboardEvent('keydown', {
                    key: 'PageDown',
                    keyCode: 34,
                    code: 'PageDown',
                    bubbles: true,
                    cancelable: true
                });
                document.body.dispatchEvent(pgDnEvent);  // 触发“PgDn”键事件

                // 模拟按下“Enter”键
                var enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    keyCode: 13,
                    code: 'Enter',
                    bubbles: true,
                    cancelable: true
                });
                document.body.dispatchEvent(enterEvent);  // 触发“Enter”键事件
            }
        });

        // 将超链接插入到页面中
        var appHub = document.querySelector('.apphub_AppName'); // 获取游戏标题元素
        if (appHub) {
            appHub.parentNode.appendChild(link); // 将超链接添加到标题下方
        }
    });
})();
