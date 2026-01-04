// ==UserScript==
// @license MIT
// @name         Hide Telegram Sidebar
// @name:zh-CN   隐藏telegram(电报)侧边栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide the sidebar in Telegram Web version，隐藏网页端telegram（电报）的侧边栏
// @author        Mike
// @match        https://web.telegram.org/a/*
// @match        https://web.telegram.org/k/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/490888/Hide%20Telegram%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/490888/Hide%20Telegram%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来创建并定位图标
    function createAndPositionIcon() {
        // 检查目标div是否存在
        var targetDiv = document.getElementById('LeftColumn');
        if (!targetDiv) {
            return; // 如果目标div不存在，则不执行任何操作
            console.error("获取",targetDiv,"失败")
        }

        // 创建图标元素，使用"X"作为图标
        var icon = document.createElement('div');
        icon.textContent = '<'; // 使用字母"<"作为图标
        icon.style.fontSize = '30px'; // 设置小于号的字体大小
        icon.style.position = 'absolute'; // 绝对定位
        icon.style.top = '50%'; // 垂直居中对齐
        icon.style.left = '0px';  // 将图标放置在目标div的右侧外面
        //icon.style.transform = 'translate(0, -50%)'; // 垂直居中对齐
        icon.style.width = '30px'; // 宽度
        icon.style.height = '60px'; // 高度
        icon.style.backgroundColor = 'grey'; // 背景颜色
        icon.style.color = 'white'; // 文本颜色
        icon.style.borderRadius = '0 50px 50px 0'; // 创建右半圆形状
        icon.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)'; // 阴影效果
        icon.style.zIndex = '999999'; // 确保图标在最上层
        icon.style.textAlign = 'center'; // 文本居中对齐
        icon.style.lineHeight = '60px'; // 行高与图标的高度相同，确保文本垂直居中

        // 添加点击事件
        icon.addEventListener('click', function() {
            // 在这里执行点击图标后的操作
          var divMain = document.getElementById('Main');
          var divLeftColumn = document.getElementById('LeftColumn');
          var divMiddleColumn = document.getElementById('MiddleColumn');
          divMain.style.display = divMain.style.display === '' ? 'flex' : '';
          divMain.style.width = divMain.style.display === 'flex' ? '100vw' : '';
          divMain.style.height = divMain.style.height === '100vh' ? '' : '100vh';
          divLeftColumn.style.display = divLeftColumn.style.display === 'none' ? '' : 'none';
          divMiddleColumn.style.flexGrow = divMiddleColumn.style.flexGrow === '1' ? '' : '1';
          icon.textContent = icon.textContent === '<' ? '>' : '<';



        });

        // 将图标添加到目标div的父元素
        var divMiddleColumn = document.getElementById('MiddleColumn');
    divMiddleColumn.style.position = 'relative';// 设置目标div的定位为相对定位，以便图标的绝对定位有参照
    divMiddleColumn.appendChild(icon);// 将图标添加到目标div



    }

    // 使用MutationObserver监听DOM变化
    var observer = new MutationObserver(function(mutations) {
        // 如果目标div出现，创建并定位图标
        if (document.getElementById('LeftColumn')) {
            createAndPositionIcon();
            observer.disconnect(); // 目标div出现后停止观察
        }
    });

    // 开始观察body元素的变化
    observer.observe(document.body, { childList: true, subtree: true });


    // 立即检查一次，以防目标div已经存在
    //createAndPositionIcon();
})();
