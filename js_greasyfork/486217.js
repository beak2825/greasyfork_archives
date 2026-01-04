// ==UserScript==
// @name         FB资料库视频下载插件
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  应对2024年2月1日fb资料库视频和无法右键下载的问题。 -脚本随缘更新
// @author       LYL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @include     *://www.facebook.com/ads/library/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486217/FB%E8%B5%84%E6%96%99%E5%BA%93%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/486217/FB%E8%B5%84%E6%96%99%E5%BA%93%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';


// 创建一个函数来添加下载按钮
function addDownloadButtonsToVideos() {
    // 找到所有符合条件的视频标签
    var videoElements = document.querySelectorAll('.x1lliihq.x5yr21d.xh8yej3');

    // 遍历每个视频标签
    videoElements.forEach(function(videoElement) {
        // 检查是否已经添加了下载按钮
        if (videoElement.parentElement.querySelector('.download-button')) {
            return; // 如果已经存在按钮，则不重复添加
        }

        // 创建下载按钮
        var downloadButton = document.createElement('button');
        downloadButton.innerText = '下载';
        downloadButton.className = 'download-button';
        downloadButton.style.position = 'absolute';
        downloadButton.style.top = '0';
        downloadButton.style.right = '0';
        downloadButton.style.zIndex = '999';

        // 获取视频链接
        var videoSrc = videoElement.getAttribute('src');

        // 检查 videoSrc 是否为 null
        if (videoSrc === null) {
            console.error('Video source is null. Skipping download button creation.');
            return;
        }

        // 提取文件名部分
        var fileNameMatch = videoSrc.match(/\/([^\/?#]+)(?:[?#]|$)/);
        var fileName = fileNameMatch !== null ? fileNameMatch[1] : 'video.mp4';

        // 添加点击事件，点击时触发下载
        downloadButton.addEventListener('click', function() {
            // 创建一个隐藏的链接并设置下载属性
            var xhr = new XMLHttpRequest();
            xhr.open("GET", videoSrc, true);
            xhr.responseType = "blob";

            xhr.onload = function () {
                var blob = new Blob([xhr.response], { type: "video/mp4" });

                // 创建一个隐藏的链接并设置下载属性
                var downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.download = fileName;

                // 添加链接到页面并触发点击
                document.body.appendChild(downloadLink);
                downloadLink.click();

                // 移除链接
                document.body.removeChild(downloadLink);
            };

            xhr.send();
        });
        // 添加鼠标悬停提示
        downloadButton.title = '若想下载高清版本请手动点击齿轮将视频清晰度切换成HD';
        // 将按钮添加到视频元素上
        videoElement.parentElement.appendChild(downloadButton);

        // 监听视频源链接的变化
        var observer = new MutationObserver(function(mutationsList, observer) {
            // 检查视频源链接是否发生变化
            var newSrc = videoElement.getAttribute('src');
            if (newSrc !== videoSrc) {
                // 更新 videoSrc
                videoSrc = newSrc;
                // 创建下载 HD 按钮
                var downloadHDButton = document.createElement('button');
                downloadHDButton.innerText = '下载HD';
                downloadHDButton.className = 'download-hd-button';
                downloadHDButton.style.position = 'absolute';
                downloadHDButton.style.top = '0';
                downloadHDButton.style.right = '60px'; // 调整位置
                downloadHDButton.style.zIndex = '999';

                // 添加点击事件，点击时触发下载 HD
                downloadHDButton.addEventListener('click', function() {
                    // 创建一个隐藏的链接并设置下载属性
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", newSrc, true);
                    xhr.responseType = "blob";

                    xhr.onload = function () {
                        var blob = new Blob([xhr.response], { type: "video/mp4" });

                        // 创建一个隐藏的链接并设置下载属性
                        var downloadLink = document.createElement('a');
                        downloadLink.href = window.URL.createObjectURL(blob);
                        downloadLink.download = fileName.replace('.mp4', '_HD.mp4'); // 添加_HD到文件名前面

                        // 添加链接到页面并触发点击
                        document.body.appendChild(downloadLink);
                        downloadLink.click();

                        // 移除链接
                        document.body.removeChild(downloadLink);
                    };

                    xhr.send();
                });

                // 将 HD 按钮添加到视频元素上
                videoElement.parentElement.appendChild(downloadHDButton);
            }
        });

        // 配置观察选项并开始观察视频源链接的变化
        observer.observe(videoElement, { attributes: true, attributeFilter: ['src'] });
    });
}

// 创建定时器来定时执行添加下载按钮的函数
var timer = setInterval(addDownloadButtonsToVideos, 3000);


})();