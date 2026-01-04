// ==UserScript==
// @name         Optimize the deepseek.com interface
// @name:en      Optimize the deepseek.com interface
// @name:zh-CN   优化 deepseek.com 界面
// @name:zh-TW   优化 deepseek.com 界面
// @namespace    deepseek.com
// @version      0.2.2
// @description  Hide deepseek.com Watermark, click menu controls the display and hiding of the left sidebar
// @description:en     Hide deepseek.com Watermark, click menu controls the display and hiding of the left sidebar
// @description:zh-CN  隐藏 deepseek.com 的水印，点击脚本菜单控制左侧边栏的显示与隐藏
// @description:zh-TW  隐藏 deepseek.com 的水印，点击脚本菜单控制左侧边栏的显示与隐藏
// @author       xxnuo
// @match        https://chat.deepseek.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494351/Optimize%20the%20deepseekcom%20interface.user.js
// @updateURL https://update.greasyfork.org/scripts/494351/Optimize%20the%20deepseekcom%20interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏侧边栏函数
    function hideSidebar() {
        GM_setValue('isHideSidebar', '1');
        var sidebar = document.querySelector('#root > div:first-child > div:first-child');
        if (sidebar) {
            sidebar.style.display = 'none';
        }
    }

    // 显示侧边栏函数
    function showSidebar() {
        GM_setValue('isHideSidebar', '0');
        var sidebar = document.querySelector('#root > div:first-child > div:first-child');
        if (sidebar) {
            sidebar.style.display = 'block';
        }
    }

    // 注册隐藏侧边栏的菜单项
    GM_registerMenuCommand('Hide Sidebar', hideSidebar, 'H');

    // 注册显示侧边栏的菜单项
    GM_registerMenuCommand('Show Sidebar', showSidebar, 'S');

    // 等待DOM加载完成
    window.addEventListener('load', function() {
        if (GM_getValue('isHideSidebar') === '1') {
            hideSidebar();
        }
        // 获取所有具有指定类名的元素
        var elements = document.querySelectorAll('.ds-watermark.ds-watermark--fullscreen');

        // 遍历元素并隐藏它们
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    });
})();