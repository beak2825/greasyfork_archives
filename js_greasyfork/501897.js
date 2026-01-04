// ==UserScript==
// @name         视频倍数播放
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  自用，勿扰
// @author       Your Name
// @match        *://*.classroom365.com/*
// @icon         https://eu.classroom365.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501897/%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/501897/%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个控制面板的DOM元素
    const controlPanel = document.createElement('div');
    // 设置控制面板的样式
    controlPanel.style.position = 'fixed'; // 固定位置
    //controlPanel.style.top = '10px'; // 距离顶部10px
    controlPanel.style.bottom = '10px'; // 距离底部10px
    controlPanel.style.right = '10px'; // 距离右侧10px
    controlPanel.style.zIndex = '9999'; // 高层级，确保在最上方
    controlPanel.style.backgroundColor = 'white'; // 背景颜色为白色
    controlPanel.style.border = '1px solid black'; // 边框样式
    controlPanel.style.padding = '5px'; // 内边距
    controlPanel.style.borderRadius = '5px'; // 边框圆角
    controlPanel.style.width = 'fit-content'; // 宽度自适应内容
    controlPanel.style.height = 'fit-content'; // 高度自适应内容
    controlPanel.style.cursor = 'move'; // 鼠标样式为移动
    controlPanel.innerHTML = `
        <button id="promptSpeedButton">倍数1</button>
        <span style="user-select: none; padding-left: 5px;">Delete键隐藏</span>
    `;

    // 将控制面板添加到页面中
    document.body.appendChild(controlPanel);

    // 初始化拖动状态
    let isDragging = false;
    let offsetX, offsetY;

    // 拖动开始
    controlPanel.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - controlPanel.getBoundingClientRect().left;
        offsetY = e.clientY - controlPanel.getBoundingClientRect().top;
        controlPanel.style.cursor = 'grabbing';
    });

    // 拖动结束
    document.addEventListener('mouseup', function() {
        isDragging = false;
        controlPanel.style.cursor = 'move';
    });

    // 拖动进行
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            controlPanel.style.top = (e.clientY - offsetY) + 'px';
            controlPanel.style.left = (e.clientX - offsetX) + 'px';
        }
    });

    // 监听“倍数”按钮的点击事件
    document.getElementById('promptSpeedButton').addEventListener('click', () => {
        const userInput = prompt('请输入一个介于0.1和16之间的速度：');
        const speed = parseFloat(userInput);
        if (speed >= 0.1 && speed <= 16) {
            setVideoSpeed(speed);
            updateSpeedButton(speed); // 更新按钮上的速度显示
        } else {
            alert('超出此范围。');
        }
    });

    // 设置播放速度的函数
    function setVideoSpeed(speed) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.playbackRate = speed;
        });
        saveSpeedToLocalStorage(speed);
    }

    // 更新速度按钮的函数
    function updateSpeedButton(speed) {
        const speedButton = document.getElementById('promptSpeedButton');
        speedButton.textContent = `倍数${speed.toFixed(1)}`;
    }

    // 存储播放速度到localStorage
    function saveSpeedToLocalStorage(speed) {
        localStorage.setItem('videoSpeed', speed);
    }

    // 从localStorage获取播放速度
    function getSpeedFromLocalStorage() {
        return parseFloat(localStorage.getItem('videoSpeed')) || 1;
    }

    // 清除localStorage中的播放速度并设置为1
    localStorage.removeItem('videoSpeed');
    setVideoSpeed(1);
    updateSpeedButton(1);

    // 为所有视频元素添加play事件监听器
    function addPlayEventListeners() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('play', function() {
                this.playbackRate = getSpeedFromLocalStorage();
            });
        });
    }

    // 初始化时，为所有现有视频和未来创建的视频添加play事件监听器
    addPlayEventListeners();

    // 使用MutationObserver监听页面变化，为新添加的视频元素添加play事件监听器
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'VIDEO') {
                        node.addEventListener('play', function() {
                            this.playbackRate = getSpeedFromLocalStorage();
                        });
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

   // 监听键盘事件，按下delete键隐藏控制面板，按下home键显示控制面板
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Delete') {
            controlPanel.style.display = 'none';
        } else if (e.key === 'Home') {
            controlPanel.style.display = 'block';
        }
    });
})();
