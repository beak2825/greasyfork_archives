// ==UserScript==
// @name         解除文本复制粘贴（支持生财有术、小报童、飞书文档）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  禁用复制功能的提示框，并启用文本复制功能，让文档不受权限限制，可以复制任意内容，可以打开右键菜单(复制下载图片)。免责声明，该工具仅供学习之用，不得出于商业目的使用。
// @author       pangyue
// @match        https://scys.com/*
// @match        https://xiaobot.net/*
// @match        https://*.feishu.cn/*
// 测试不行的：    https://h5.tianxiayaoli.com*   https://www.doc88.com/
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508452/%E8%A7%A3%E9%99%A4%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%EF%BC%88%E6%94%AF%E6%8C%81%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E3%80%81%E5%B0%8F%E6%8A%A5%E7%AB%A5%E3%80%81%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/508452/%E8%A7%A3%E9%99%A4%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%EF%BC%88%E6%94%AF%E6%8C%81%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E3%80%81%E5%B0%8F%E6%8A%A5%E7%AB%A5%E3%80%81%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前网址是否匹配指定的域名
    if (window.location.href.startsWith('https://scys.com/')) {
        // 隐藏 .toast-wrap 元素
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .toast-wrap {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        // 解除禁用右键菜单和文本选择的限制
        document.addEventListener('contextmenu', function(e) {
            e.stopPropagation();
        }, true);

        document.addEventListener('selectstart', function(e) {
            e.stopPropagation();
        }, true);

        document.addEventListener('copy', function(e) {
            e.stopPropagation();
        }, true);

        // 创建自定义右键菜单
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();

            // 移除现有的自定义菜单（如果存在）
            var existingMenu = document.getElementById('custom-context-menu');
            if (existingMenu) {
                existingMenu.remove();
            }

            // 创建菜单容器
            var menu = document.createElement('div');
            menu.id = 'custom-context-menu';
            menu.style.position = 'fixed';
            menu.style.top = event.clientY + 'px';
            menu.style.left = event.clientX + 'px';
            menu.style.backgroundColor = '#fff';
            menu.style.border = '1px solid #ccc';
            menu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            menu.style.zIndex = '10000';
            menu.style.padding = '5px';
            menu.style.cursor = 'pointer';

            // 创建复制选项
            var copyOption = document.createElement('div');
            copyOption.innerText = '复制';
            copyOption.style.padding = '5px';
            copyOption.style.whiteSpace = 'nowrap';

            // 复制选项点击事件
            copyOption.addEventListener('click', function() {
                document.execCommand('copy');
                menu.remove();
            });

            menu.appendChild(copyOption);
            document.body.appendChild(menu);

            // 点击页面其他地方时移除自定义菜单
            document.addEventListener('click', function onClickOutside() {
                menu.remove();
                document.removeEventListener('click', onClickOutside);
            });
        });

        // 启用复制功能
        document.addEventListener('copy', function(event) {
            var selection = document.getSelection();
            event.clipboardData.setData('text/plain', selection.toString());
            event.preventDefault();
        });
    }


    // 解除小报童的文本复制
    if (window.location.href.startsWith('https://xiaobot.net/')) {
        setTimeout(() => {
            // 解除 body 元素的文本选择限制
            document.body.style.userSelect = 'auto';
            document.body.onmousedown = null;
            document.body.onselectstart = null;

            // 解除所有元素的文本选择限制
            var elems = document.querySelectorAll('*');
            for (var i = 0; i < elems.length; i++) {
                elems[i].style.userSelect = 'auto';
                elems[i].onmousedown = null;
                elems[i].onselectstart = null;
            }
        }, 1000)
    }
})();
