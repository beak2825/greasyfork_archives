// ==UserScript==
// @name         Remove target attribute and play video in new element on ASMRgay
// @namespace    https://www.asmrgay.com/
// @version      3
// @description  Removes target attribute from all a tags and plays video in new element on click on ASMRgay website.
// @author       Wrx
// @include      *://*.asmrgay.com/*
// @match        https://www.asmrgay.com/*
// @grant        none
// @license      Wrx-Only
// @downloadURL https://update.greasyfork.org/scripts/462989/Remove%20target%20attribute%20and%20play%20video%20in%20new%20element%20on%20ASMRgay.user.js
// @updateURL https://update.greasyfork.org/scripts/462989/Remove%20target%20attribute%20and%20play%20video%20in%20new%20element%20on%20ASMRgay.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 创建悬浮按钮元素
    const floatingButton = document.createElement('button');
    floatingButton.textContent = '播放视频';
    floatingButton.style.position = 'fixed';
    floatingButton.style.top = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.zIndex = '9999';

    // 将悬浮按钮添加到页面中
    document.body.appendChild(floatingButton);

    // 给悬浮按钮添加点击事件
    floatingButton.addEventListener('click', function() {
        const buttonElements = document.querySelectorAll('.hope-c-ivMHWx');

        if (buttonElements.length >= 2) {
            console.log("2")
            const playerLink = document.createElement('a');
            playerLink.setAttribute('id', 'my-player');
            playerLink.setAttribute('href', '#');
            playerLink.textContent = '点击这里播放视频';
            playerLink.setAttribute('class', 'hope-button hope-c-ivMHWx hope-c-ivMHWx-kcPQpq-variant-subtle hope-c-ivMHWx-kWSPeQ-size-md hope-c-ivMHWx-dvmlqS-cv hope-c-PJLV hope-c-PJLV-iikaotv-css');

            // 创建一个包含黑色半透明背景的容器
            const overlayContainer = document.createElement('div');
            overlayContainer.style.position = 'fixed';
            overlayContainer.style.top = '0';
            overlayContainer.style.left = '0';
            overlayContainer.style.width = '100%';
            overlayContainer.style.height = '100%';
            overlayContainer.style.background = 'rgba(0, 0, 0, 0.7)';
            overlayContainer.style.zIndex = '9999';

            // 创建一个包含视频播放器的容器
            const videoContainer = document.createElement('div');
            videoContainer.style.position = 'fixed';
            videoContainer.style.top = '50%';
            videoContainer.style.left = '50%';
            videoContainer.style.transform = 'translate(-50%, -50%)';
            videoContainer.style.width = '80%';
            videoContainer.style.height = '80%';
            videoContainer.style.zIndex = '10000';

            const closeButton = document.createElement('button');
            closeButton.setAttribute('id', 'close-button');
            closeButton.textContent = 'X';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '0';
            closeButton.style.right = '0';
            closeButton.style.background = 'white';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '50%';
            closeButton.style.fontSize = '20px';
            closeButton.style.height = '30px';
            closeButton.style.width = '30px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.zIndex = '10001';

            const minimizeButton = document.createElement('button');
            minimizeButton.textContent = '-';
            minimizeButton.style.position = 'absolute';
            minimizeButton.style.top = '10px';
            minimizeButton.style.right = '10px';
            minimizeButton.style.background = 'white';
            minimizeButton.style.border = 'none';
            minimizeButton.style.borderRadius = '50%';
            minimizeButton.style.fontSize = '20px';
            minimizeButton.style.height = '30px';
            minimizeButton.style.width = '30px';
            minimizeButton.style.cursor = 'pointer';
            minimizeButton.style.zIndex = '10001';

            closeButton.addEventListener('click', function() {
                // 销毁视频播放器和黑色背景

                document.body.removeChild(overlayContainer);
            });

            minimizeButton.addEventListener('click', function() {
                document.body.removeChild(overlayContainer);
                //videoContainer.style.width = '20%'; // 将视频容器宽度缩小到原来的20%
                //videoContainer.style.height = '20%'; // 将视频容器高度缩小到原来的20%
                //videoContainer.style.top = '50%'; // 使视频容器位于屏幕底部
                //videoContainer.style.right = '0'; // 使视频容器位于屏幕右侧
            });

            playerLink.addEventListener('click', function(event) {
                event.preventDefault();

                const videoUrl = buttonElements[1].href; // 获取第二个按钮的链接作为视频地址

                // 创建一个用于显示视频的video元素
                const videoPlayer = document.createElement('video');

                videoPlayer.src = videoUrl;
                videoPlayer.style.transform = "scale(1.2)";

                videoPlayer.controls = true;

                // 将关闭按钮添加到视频容器中
                videoContainer.appendChild(closeButton);

                // 将最小化按钮添加到视频容器中
                //videoContainer.appendChild(minimizeButton);

                // 将视频播放器添加到视频容器中
                videoContainer.appendChild(videoPlayer);

                // 将黑色半透明背景容器添加到页面中
                document.body.appendChild(overlayContainer);

                // 将视频容器添加到黑色半透明背景容器中
                overlayContainer.appendChild(videoContainer);
            });

            buttonElements[1].parentNode.insertBefore(playerLink, buttonElements[1].nextSibling);
        }
    });
})();

