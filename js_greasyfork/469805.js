
// ==UserScript==
// @name         一键下载视频
// @namespace    yournamespace
// @version      1.0
// @description  在1688网页上添加一键下载视频按钮
// @author       不到华水永寒窗
// @match        https://detail.1688.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469805/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/469805/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 添加下载按钮
  var addButton = function() {
    // 获取具有 class="lib-video" 的 video 标签
    var videoElement = document.querySelector('video.lib-video');

    if (videoElement) {
      var downloadButton = document.createElement('button');
      downloadButton.id = 'downloadButton';
      downloadButton.style.cssText = "position:fixed;top:50px;right:10px;z-index:9999;display: inline-block;width: 152px;height: 32px;font: 14px/26px PingFangSC-Regular;text-align: center;color: #fff;border-radius: 4px;letter-spacing: 0;text-decoration: none;border: 1px solid #ff4000;background-image: linear-gradient(90deg, #FF7E3E 0%, #FF4000 100%);";
      downloadButton.textContent = '一键下载视频';

      downloadButton.addEventListener('click', function() {
        // 创建一个新的 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        xhr.open('GET', videoElement.src, true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
          if (xhr.status === 200) {
            // 获取文件名
            var fileName = videoElement.src.substring(videoElement.src.lastIndexOf('/') + 1);

            // 创建一个临时 URL，用于视频下载
            var blobUrl = URL.createObjectURL(xhr.response);

            // 创建下载链接
            var downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = fileName;

            // 模拟点击下载链接
            downloadLink.click();

            // 释放临时 URL
            URL.revokeObjectURL(blobUrl);
          } else {
            console.log('视频下载失败');
          }
        };

        xhr.send();
      });

      // 将按钮添加到页面上适当的位置
      var targetElement = document.getElementById('pi-component-container'); // 替换为您希望添加按钮的元素的 ID 或选择器
      if (targetElement) {
        targetElement.appendChild(downloadButton);
      }
    }
  };

  // 等待页面加载完成后添加按钮
  window.addEventListener('load', addButton);
})();

