// ==UserScript==
// @name         B站小窗尺寸
// @namespace    http://tampermonkey.net/
// @version      2025-02-11
// @description  原本的B站有两种小窗，一种置顶小窗，可以调整尺寸但不会显示弹幕。一种下滑到评论区时出现的小窗，可以显示弹幕但没法调整尺寸。而该脚本可以让后者支持调整尺寸，鱼和熊掌可以兼得。
// @author       ZhangDaLi
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524596/B%E7%AB%99%E5%B0%8F%E7%AA%97%E5%B0%BA%E5%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/524596/B%E7%AB%99%E5%B0%8F%E7%AA%97%E5%B0%BA%E5%AF%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取目标元素
    const targetElement = document.querySelector('.bpx-player-container');
    const originWidth = targetElement.clientWidth;
    const originHeight = targetElement.clientHeight;

    let topEventHandled = false;
    let bottomEventHandled = false;
    function handleScroll() {      
      let styleRight = document.querySelector('.bpx-player-container').style.right
      if(styleRight && !bottomEventHandled){
        // 如果有缓存数据，则获取缓存并设置宽高
        let oldWidth = localStorage.getItem('miniVideoWidth')
        let oldHeight = localStorage.getItem('miniVideoHeight')
        if(oldWidth){
            document.querySelector('.bpx-player-container').style.width = oldWidth;
        }
        if(oldHeight){
            document.querySelector('.bpx-player-container').style.height = oldHeight;
        }
        bottomEventHandled = true
        topEventHandled = false
      }
      if(styleRight == '' && !topEventHandled){
        document.querySelector('.bpx-player-container').style.width = `${originWidth}px`;
        document.querySelector('.bpx-player-container').style.height = `${originHeight}px`;
        topEventHandled = true
        bottomEventHandled = false
      }
    }
    
    // 防抖函数
    function debounce(func, delay = 200) {
      let timeoutId;
      return function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, delay);
      };
    }
    
    // 监听滚动事件（带防抖）
    window.addEventListener('scroll', debounce(handleScroll));

    // 添加拖拽缩放功能
    if (!targetElement) {
        console.log('未找到 class="bpx-player-container" 的元素！');
        return;
    }

    // 添加拖拽缩放逻辑
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    // 创建拖拽手柄
    const resizer = document.createElement('div');
    resizer.style.position = 'absolute';
    resizer.style.left = '0';
    resizer.style.top = '0';
    resizer.style.width = '10px';
    resizer.style.height = '10px';
    // resizer.style.backgroundColor = '#007bff';
    resizer.style.cursor = 'se-resize';
    resizer.style.zIndex = 999
    targetElement.appendChild(resizer);

    // 监听拖拽手柄的鼠标按下事件
    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = targetElement.offsetWidth;
        startHeight = targetElement.offsetHeight;

        // 监听鼠标移动事件
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            localStorage.setItem('miniVideoWidth', targetElement.style.width)
            localStorage.setItem('miniVideoHeight', targetElement.style.height)
        });
    });

    // 调整尺寸的函数
    function resize(e) {
        if (isResizing) {
            const width = startWidth - (e.clientX - startX);
            const height = startHeight -(e.clientY - startY);
            targetElement.style.width = `${width}px`;
            targetElement.style.height = `${height}px`;
        }
    }
})();