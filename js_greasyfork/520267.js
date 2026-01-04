// ==UserScript==
// @name         点击跳转至Keylol和SteamCardExchange论坛（超链接版）
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  将按钮改为超链接，分别跳转至Keylol和SteamCardExchange页面，鼠标中键点击后模拟右键点击 + PgDn + Enter
// @author       You
// @match        https://store.steampowered.com/app/*
// @icon         https://www.keylol.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520267/%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC%E8%87%B3Keylol%E5%92%8CSteamCardExchange%E8%AE%BA%E5%9D%9B%EF%BC%88%E8%B6%85%E9%93%BE%E6%8E%A5%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/520267/%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC%E8%87%B3Keylol%E5%92%8CSteamCardExchange%E8%AE%BA%E5%9D%9B%EF%BC%88%E8%B6%85%E9%93%BE%E6%8E%A5%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // 获取 Steam 页面 App ID
        var steamAppUrl = window.location.href;
        var regex = /\/app\/(\d+)\//; // 正则表达式匹配 App ID
        var match = steamAppUrl.match(regex);

        if (match && match[1]) {
            var appId = match[1]; // 获取 App ID

            // 创建 Keylol链接
            var keylolLink = document.createElement('a');
            keylolLink.textContent = '在Keylol的Tab上查看';
            // 添加按钮样式
            keylolLink.style.padding = '10px 20px';
            keylolLink.style.fontSize = '14px';
            keylolLink.style.background = 'rgba(103, 193, 245, 0.2)';
            keylolLink.style.color = '#67c1f5';
            keylolLink.style.textDecoration = 'none';
            keylolLink.style.borderRadius = '3px';
            keylolLink.style.display = 'inline-flex';
            keylolLink.style.alignItems = 'center';
            keylolLink.style.marginTop = '20px';
            keylolLink.style.border = 'none';
            keylolLink.style.cursor = 'pointer';
            keylolLink.style.fontWeight = '600';

            // 悬停时的样式变化
            keylolLink.addEventListener('mouseenter', () => {
                keylolLink.style.backgroundColor = '#6f99e6';
            });
            keylolLink.addEventListener('mouseleave', () => {
                keylolLink.style.backgroundColor = 'rgba(103, 193, 245, 0.2)';
            });

            // 添加图标
            var keylolIcon = document.createElement('i');
            keylolIcon.className = 'ico16';
            keylolIcon.style.background = 'url("https://www.keylol.com/favicon.ico") 0 0 / contain no-repeat';
            keylolIcon.style.width = '16px';
            keylolIcon.style.height = '16px';
            keylolIcon.style.marginRight = '8px';
            keylolLink.prepend(keylolIcon);

            // 构建Keylol链接
            var keylolUrl = 'https://keylol.com/plugin.php?id=keylol_tags:redirect&appid=' + appId;
            keylolLink.href = keylolUrl;

            // 创建 SteamCardExchange链接
            var steamCardLink = document.createElement('a');
            steamCardLink.textContent = '在SteamCardExchange上查看';
            // 添加按钮样式
            steamCardLink.style.padding = '10px 20px';
            steamCardLink.style.fontSize = '14px';
            steamCardLink.style.background = 'rgba(103, 193, 245, 0.2)';
            steamCardLink.style.color = '#67c1f5';
            steamCardLink.style.textDecoration = 'none';
            steamCardLink.style.borderRadius = '3px';
            steamCardLink.style.display = 'inline-flex';
            steamCardLink.style.alignItems = 'center';
            steamCardLink.style.marginTop = '20px';
            steamCardLink.style.border = 'none';
            steamCardLink.style.cursor = 'pointer';
            steamCardLink.style.fontWeight = '600';

            // 悬停时的样式变化
            steamCardLink.addEventListener('mouseenter', () => {
                steamCardLink.style.backgroundColor = '#6f99e6';
            });
            steamCardLink.addEventListener('mouseleave', () => {
                steamCardLink.style.backgroundColor = 'rgba(103, 193, 245, 0.2)';
            });

            // 添加图标
            var steamCardIcon = document.createElement('i');
            steamCardIcon.className = 'ico16';
            steamCardIcon.style.background = 'url("https://www.steamcardexchange.net/favicon.ico") 0 0 / contain no-repeat';
            steamCardIcon.style.width = '16px';
            steamCardIcon.style.height = '16px';
            steamCardIcon.style.marginRight = '8px';
            steamCardLink.prepend(steamCardIcon);

            // 构建SteamCardExchange链接
            var steamCardUrl = 'https://www.steamcardexchange.net/index.php?gamepage-appid-' + appId;
            steamCardLink.href = steamCardUrl;

            // 添加点击事件
            keylolLink.addEventListener('click', function() {
                window.location.href = keylolUrl;
            });

            steamCardLink.addEventListener('click', function() {
                window.location.href = steamCardUrl;
            });

            // 鼠标中键点击模拟右键点击，PgDn和Enter键
            function simulateKeyPress(event) {
                if (event.button === 1) {  // 鼠标中键点击
                    // 模拟右键点击
                    var rightClickEvent = new MouseEvent('contextmenu', {
                        bubbles: true,
                        cancelable: true,
                        button: 2
                    });
                    event.target.dispatchEvent(rightClickEvent);

                    // 模拟PgDn键
                    var pgDnEvent = new KeyboardEvent('keydown', {
                        key: 'PageDown',
                        keyCode: 34,
                        bubbles: true
                    });
                    document.body.dispatchEvent(pgDnEvent);

                    // 模拟Enter键
                    var enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        keyCode: 13,
                        bubbles: true
                    });
                    document.body.dispatchEvent(enterEvent);
                }
            }

            // 监听鼠标事件
            keylolLink.addEventListener('mousedown', simulateKeyPress);
            steamCardLink.addEventListener('mousedown', simulateKeyPress);

            // 将超链接插入到页面中
            var appHub = document.querySelector('.apphub_AppName');
            if (appHub) {
                appHub.parentNode.appendChild(keylolLink);
                appHub.parentNode.appendChild(steamCardLink);
            }
        } else {
            console.log('无法从当前页面提取 App ID');
        }
    });
})();
