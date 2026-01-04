// ==UserScript==
// @name         后视镜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击悬浮球开启摄像头视频悬浮窗，再次点击悬浮球关闭视频，鼠标滚轮缩放大小，左键按住拖动位置，双击视频隐藏，再次双击隐藏位置显示视频。
// @author       husky180
// @match        http://*/*
// @match        https://*/*
// @exclude      http://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490433/%E5%90%8E%E8%A7%86%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/490433/%E5%90%8E%E8%A7%86%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let hasVideo = false;
    let video = null;
    let cover = null;
    let videoStream = null;
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // 悬浮按钮
    var button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.backgroundColor = 'rgba(0, 130, 220, 0.2)';
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.textAlign = 'center';
    button.style.lineHeight = '50px';
    button.style.color = 'white';
    button.style.zIndex = '999999';
    button.textContent = 'Click';

    document.body.appendChild(button);

    // 悬浮按钮点击事件
    button.addEventListener('click', function() {
        if(hasVideo) {
            document.body.removeChild(video);
            document.body.removeChild(cover);
            hasVideo = false;
            video = null;
            cover = null;
            videoStream.getTracks().forEach(track => {
                track.stop();
            })
            return
        }
        hasVideo = true;
        video = document.createElement('video');
        video.id = 'huskyBackVideo';
        video.style.width = '300px';
        video.style.height = '300px';
        video.style.position = 'fixed';
        video.style.bottom = '200px';
        video.style.right = '200px';
        video.style.zIndex = '999998';
        video.autoplay = true;
        video.playsinline = true;
        // 获取摄像头视频流
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                // 将视频流分配给 video 元素
                video.srcObject = stream;
                videoStream = stream;
            }).catch(error => {
            console.error('Error accessing the camera:', error);
        });
        document.body.appendChild(video);
        cover = document.createElement("div");
        cover.id = 'huskyBackVideoCover';
        cover.style.backgroundColor = 'rgba(255,255,255,0.5)';
        cover.style.width = '300px';
        cover.style.height = '300px';
        cover.style.zIndex = '999999';
        cover.style.position = 'fixed';
        cover.style.bottom = '200px';
        cover.style.right = '200px';
        document.body.appendChild(cover);
        cover.addEventListener("click", function(){
            if (isDragging) {
                return
            }
            if (video.style.width == "0px") {
                video.style.width = "300px";
            } else {
                video.style.width = "0px"
            }
        })
        cover.addEventListener('mousedown', function(event){
            isDragging = true;
            offsetX = event.clientX - video.offsetLeft;
            offsetY = event.clientY - video.offsetTop;
        })
        cover.addEventListener('mousemove', function(event) {
            if (isDragging) {
                // Update video element position based on mouse movement
                video.style.left = (event.clientX - offsetX) + 'px';
                video.style.top = (event.clientY - offsetY) + 'px';
                cover.style.left = (event.clientX - offsetX) + 'px';
                cover.style.top = (event.clientY - offsetY) + 'px';
            }
        });
        cover.addEventListener('mouseup', function() {
            setTimeout(() => {
                isDragging = false;
            }, 100)
        });
        // 监听鼠标滚轮事件
        cover.addEventListener('wheel', function(event) {
            // 阻止默认的滚轮事件，避免页面滚动
            event.preventDefault();

            // 判断滚轮方向
            const zoomSpeed = 0.1; // 缩放速度
            if (event.deltaY < 0) {
                // 向上滚动，放大
                video.style.width = (parseFloat(video.style.width) * (1 + zoomSpeed)) + 'px';
                video.style.height = (parseFloat(video.style.height) * (1 + zoomSpeed)) + 'px';
                cover.style.width = (parseFloat(cover.style.width) * (1 + zoomSpeed)) + 'px';
                cover.style.height = (parseFloat(cover.style.height) * (1 + zoomSpeed)) + 'px';
            } else {
                // 向下滚动，缩小
                video.style.width = (parseFloat(video.style.width) * (1 - zoomSpeed)) + 'px';
                video.style.height = (parseFloat(video.style.height) * (1 - zoomSpeed)) + 'px';
                cover.style.width = (parseFloat(cover.style.width) * (1 - zoomSpeed)) + 'px';
                cover.style.height = (parseFloat(cover.style.height) * (1 - zoomSpeed)) + 'px';
            }
        });
    });
})();
