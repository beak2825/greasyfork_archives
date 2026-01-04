// ==UserScript==
// @name         Steam Card Exchange Redirect (中键点击模拟右键和键盘操作)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  点击中键模拟鼠标右键点击，按“PgDn”键再按“Enter”键，左键点击跳转到 SteamCardExchange 页面
// @author       你
// @match        https://store.steampowered.com/app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520251/Steam%20Card%20Exchange%20Redirect%20%28%E4%B8%AD%E9%94%AE%E7%82%B9%E5%87%BB%E6%A8%A1%E6%8B%9F%E5%8F%B3%E9%94%AE%E5%92%8C%E9%94%AE%E7%9B%98%E6%93%8D%E4%BD%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520251/Steam%20Card%20Exchange%20Redirect%20%28%E4%B8%AD%E9%94%AE%E7%82%B9%E5%87%BB%E6%A8%A1%E6%8B%9F%E5%8F%B3%E9%94%AE%E5%92%8C%E9%94%AE%E7%9B%98%E6%93%8D%E4%BD%9C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完毕
    window.addEventListener('load', function() {
        // 获取游戏页面的App ID
        var steamAppUrl = window.location.href;
        var regex = /\/app\/(\d+)\//; // 正则表达式匹配 App ID
        var match = steamAppUrl.match(regex);

        if (match && match[1]) {
            var appId = match[1]; // 获取 App ID

            // 创建超链接元素
            var link = document.createElement('a');
            link.textContent = '在 SteamCardExchange 上查看';

            // 添加按钮样式
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

            // 添加图标（根据提供的图标样式）
            var icon = document.createElement('i');
            icon.className = 'ico16'; // 这里假设你会添加相应的 CSS 样式来显示图标
            icon.style.background = 'url("https://www.steamcardexchange.net/favicon.ico") 0 0 / contain no-repeat';
            icon.style.width = '16px';
            icon.style.height = '16px';
            icon.style.marginRight = '8px'; // 图标和文字之间的间隔

            link.prepend(icon); // 将图标放在文本前面

            // 获取 SteamCardExchange 的 URL
            var steamCardExchangeUrl = 'https://www.steamcardexchange.net/index.php?gamepage-appid-' + appId;

            // 设置超链接的 href
            link.href = steamCardExchangeUrl;

            // 当点击超链接时，直接跳转到 SteamCardExchange 页面
            link.addEventListener('click', function(event) {
                window.location.href = steamCardExchangeUrl; // 当前页面直接跳转
            });

            // 当鼠标滚轮点击（中键点击）时，模拟鼠标右键点击、按PgDn键和Enter键
            link.addEventListener('mousedown', function(event) {
                // 检查鼠标是否是滚轮点击（中键点击，button == 1）
                if (event.button === 1) {
                    // 模拟右键点击
                    var rightClickEvent = new MouseEvent('contextmenu', {
                        bubbles: true,
                        cancelable: true,
                        button: 2
                    });
                    link.dispatchEvent(rightClickEvent); // 触发右键点击事件

                    // 模拟按“PgDn”键
                    var pgDnEvent = new KeyboardEvent('keydown', {
                        key: 'PageDown',
                        keyCode: 34,
                        code: 'PageDown',
                        bubbles: true,
                        cancelable: true
                    });
                    document.body.dispatchEvent(pgDnEvent); // 触发“PgDn”键事件

                    // 模拟按“Enter”键
                    var enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        keyCode: 13,
                        code: 'Enter',
                        bubbles: true,
                        cancelable: true
                    });
                    document.body.dispatchEvent(enterEvent); // 触发“Enter”键事件
                }
            });

            // 将超链接插入到页面中
            var appHub = document.querySelector('.apphub_AppName'); // 获取游戏标题元素
            if (appHub) {
                appHub.parentNode.appendChild(link); // 将超链接添加到标题下方
            }
        } else {
            console.log('无法从当前页面提取 App ID');
        }
    });
})();
