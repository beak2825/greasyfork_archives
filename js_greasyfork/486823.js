// ==UserScript==
// @name         Rule34 Video Downloader
// @namespace    http://tampermonkey.net/
// @version      2024-02-07.1
// @description  快捷下载rule34.xxx的视频
// @description:zh-cn 快捷下载rule34.xxx的视频
// @author       键盘&GPT4
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant         GM_xmlhttpRequest
// @license MIT
// @name:zh-CN rule34视频下载插件
// @downloadURL https://update.greasyfork.org/scripts/486823/Rule34%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/486823/Rule34%20Video%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    // 创建一个下载按钮放在id为gelcomVideoPlayer的video标签的右上角
    var video = document.getElementById('gelcomVideoPlayer');
    var downloadButton = document.createElement('p');
    downloadButton.href = video.src;
    downloadButton.download = video.src;
    downloadButton.innerHTML = '下载';
    downloadButton.style.position = 'absolute';
    downloadButton.style.right = '0';
    downloadButton.style.top = '0';

    // 美化按钮
    downloadButton.style.padding = '5px';
    downloadButton.style.backgroundColor = 'rgba(0,0,0,0.5)';
    downloadButton.style.color = 'white';
    downloadButton.style.borderRadius = '5px';
    downloadButton.style.textDecoration = 'none';
    downloadButton.style.zIndex = '999';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.userSelect = 'none';
    video.parentElement.appendChild(downloadButton);

    // 点击下载按钮时触发下载
    downloadButton.onclick = function () {
        const videolink = video.getElementsByTagName('source')[0].src;
        if (videolink) {
            // 使用 GM_xmlhttpRequest 发送跨域请求
            GM_xmlhttpRequest({
                method: "GET",
                url: videolink,
                responseType: 'blob', // 确保以blob形式接收视频数据
                onload: function (response) {
                    // 这里我们接收到了一个Blob对象，我们可以创建一个下载
                    if (response.status === 200) {
                        var blob = response.response;
                        var url = URL.createObjectURL(blob); // 创建一个指向blob的URL
                        var filename = "video.mp4"; // 假设你知道视频的格式，或者从Content-Disposition头或URL中提取

                        // 创建一个临时的a元素用于下载文件
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = filename; // 设置下载文件名
                        document.body.appendChild(a);
                        a.click(); // 触发下载

                        window.URL.revokeObjectURL(url); // 释放URL对象
                        a.remove(); // 删除临时创建的a元素
                    } else {
                        console.error('视频加载失败：', response.status);
                    }
                },
                onerror: function (error) {
                    // 处理错误
                    console.error('视频请求失败：', error);
                }
            });
        }
    }

})();