// ==UserScript==
// @name         共创世界Gandi 全局毛玻璃
// @namespace    https://greasyfork.org/zh-CN/scripts/487179
// @version      1.5
// @description  将指定元素改为半透明，仅影响背景而不影响子元素
// @match        https://www.ccw.site/gandi
// @match        https://www.ccw.site/gandi/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487179/%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8CGandi%20%E5%85%A8%E5%B1%80%E6%AF%9B%E7%8E%BB%E7%92%83.user.js
// @updateURL https://update.greasyfork.org/scripts/487179/%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8CGandi%20%E5%85%A8%E5%B1%80%E6%AF%9B%E7%8E%BB%E7%92%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加监听鼠标右键事件
    document.addEventListener('contextmenu', function(event) {
        // 获取并修改新的上下文菜单元素
        var newContextMenu = document.querySelector('.goog-menu.blocklyContextMenu');
        if (newContextMenu) {
            newContextMenu.style.backdropFilter = 'blur(10px)';
            newContextMenu.style.backgroundColor = 'rgba(47, 55, 69, 0.29)'; // 根据需要调整背景颜色和透明度
        }
    });

    // 等待页面加载完成后执行脚本
    window.addEventListener('load', function() {

        // 获取要修改的元素
        var element = document.querySelector('.blocklyToolboxDiv');
        var elements = document.querySelectorAll('section.gandi_collapsible-box_collapsible-box_1_329');
        var divElement = document.querySelector('div.gandi_addons_addons-root_37y2A');
        var divElement2 = document.querySelector('div.gandi_stage-wrapper_stage-canvas-wrapper_3ewmd');
        var divElement3 = Array.from(elements).find(element => {
            return element.getAttribute('style') === 'top: 337px; height: calc(100% - 352px); width: 450px;';
        });
        var divElement4 = document.querySelector('section.gandi_collapsible-box_collapsible-box_1_329');
        var divElement5 = document.querySelector('ul.gandi_editor-wrapper_tabList_4HFZz');

        // 修改积木栏
        if (element) {
            element.style.backdropFilter = 'blur(5px)';
            element.style.backgroundColor = 'rgba(47, 55, 69, 0.10)';
        }

        // 修改工具栏
        if (divElement) {
            divElement.style.backdropFilter = 'blur(10px)';
            divElement.style.backgroundColor = 'rgba(47, 55, 69, 0.29)';
        }

        if (divElement2) {
            divElement2.style.backdropFilter = 'blur(10px)';
            divElement2.style.backgroundColor = 'rgba(47, 55, 69, 0.29)';
        }

        if (divElement3) {
            divElement3.style.backgroundColor = 'rgba(47, 55, 69, 0.29)';
        }

        if (divElement4) {
            divElement4.style.backgroundColor = 'rgba(47, 55, 69, 0.29)';
        }

        if (divElement5) {
            divElement5.style.backdropFilter = 'blur(10px)';
            divElement5.style.backgroundColor = 'rgba(25, 30, 37, 0.70)';
        }

    });
})();