// ==UserScript==
// @name         视频神器-改变播放速度
// @namespace    http://tampermonkey.net/
// @version      2024-12-21
// @description  无视限制，改变网页端视频播放速度
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521435/%E8%A7%86%E9%A2%91%E7%A5%9E%E5%99%A8-%E6%94%B9%E5%8F%98%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/521435/%E8%A7%86%E9%A2%91%E7%A5%9E%E5%99%A8-%E6%94%B9%E5%8F%98%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
    setTimeout(() => {
    // 获取页面上的所有video元素
    const videos = document.querySelectorAll('video');
    if (videos?.length <= 0) {
      console.log('this website has no video tag');
      return;
    }
        // 创建一个最外层的容器来包裹所有元素
    const outerContainer = document.createElement('div');
    outerContainer.id = 'playback-rate-controller-outer';
    outerContainer.style.position = 'fixed';
    outerContainer.style.top = '10px';
    outerContainer.style.right = '10px';
    outerContainer.style.zIndex = '9999';
    outerContainer.style.display = 'flex';
    outerContainer.style.flexDirection = 'column';
    outerContainer.style.alignItems = 'flex-end'; // 将内容对齐到容器的右侧
    outerContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // 设置半透明背景
    outerContainer.style.padding = '10px';
    outerContainer.style.borderRadius = '5px';
    outerContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

    // 创建标题行
    const title = document.createElement('div');
    title.textContent = '播放速度控制条';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10px'; // 添加底部间距以分隔标题与内容

    // 创建一个内层容器来包裹输入框和按钮
    const innerContainer = document.createElement('div');
    innerContainer.style.display = 'flex';
    innerContainer.style.alignItems = 'center';

    // 创建输入框
    const inputBox = document.createElement('input');
    inputBox.type = 'number';
    inputBox.value = '1.0'; // 设定默认播放速率为1.0
    inputBox.min = '0.1'; // 设定最小播放速率为0.1
    inputBox.max = '10.0'; // 设定最大播放速率为4.0（根据浏览器和视频支持情况调整）
    inputBox.step = '0.1'; // 设定步长为0.1
    inputBox.style.width = '60px';
    inputBox.style.padding = '5px';
    inputBox.style.marginRight = '10px'; // 为按钮预留间距

    // 创建按钮
    const applyButton = document.createElement('button');
    applyButton.textContent = '应用';
    applyButton.style.padding = '5px 10px';
    applyButton.style.cursor = 'pointer';

    // 将元素添加到内层容器中
    innerContainer.appendChild(inputBox);
    innerContainer.appendChild(applyButton);

    // 将标题和内层容器添加到外层容器中
    outerContainer.appendChild(title);
    outerContainer.appendChild(innerContainer);

    // 将外层容器添加到页面的body中
    document.body.appendChild(outerContainer);

    // 为按钮添加点击事件监听器
    applyButton.addEventListener('click', function() {
        const rate = parseFloat(inputBox.value);
        videos.forEach(video => {
            if (video.playbackRate !== rate) { // 避免不必要的设置，如果速率未改变
                video.playbackRate = rate;
            }
        });
    });

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    outerContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = parseInt(outerContainer.style.left, 10);
        initialTop = parseInt(outerContainer.style.top, 10);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
       // e.preventDefault(); // 阻止默认行为，如文本选择
    });

    function onMouseMove(e) {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            let left = initialLeft + deltaX;
            let top = initialTop + deltaY;
            if (left < 0) {
              left = 0;
            }
            if (top < 0) {
              top = 0;
            }
            if (top >= 300) {
              top = 300;
            }
            console.log(`left:${left} top ${top}`);
            outerContainer.style.left = `${left}px`;
            outerContainer.style.top = `${top}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    }, 1000);

    }



    // Your code here...
})();