// ==UserScript==
// @name         alist历史播放
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  可以查看历史播记录（10条）
// @author       You
// @match        http://127.0.0.1:5244/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=repl.co
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474818/alist%E5%8E%86%E5%8F%B2%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/474818/alist%E5%8E%86%E5%8F%B2%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
const message = "这是一个简体中文字符串";
    let popupVisible = false; // 弹窗可见状态
    // 创建按钮
    function createButton() {
        const button = document.createElement('button');
        button.textContent = '播放历史';
        button.style.position = 'fixed';
        button.style.top = '40px'; // 调整按钮的垂直位置，让它显示在页面中间上方
        button.style.left = '50%';
        button.style.transform = 'translateX(-50%)'; // 居中水平定位
        button.style.zIndex = '1000';

        // 添加按钮到页面
        document.body.appendChild(button);

        // 按钮点击事件
        button.addEventListener('click', togglePopup);
    }
    // 创建或关闭弹窗
    function togglePopup() {
        if (popupVisible) {
            closePopup();
        } else {
            showPopup();
        }
    }
   // 创建弹窗
    function createPopup() {
        const popup = document.createElement('div');
        popup.id = 'popup';
        popup.style.position = 'fixed';
        popup.style.top = '70%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '20px';
        popup.style.border = '22px solid #ccc';
        popup.style.zIndex = '1001'; // 提高按钮的 z-index，确保它在页面上最上层
        document.body.appendChild(popup);

        // 读取LocalStorage中的值
        const artplayerSettings = localStorage.getItem('artplayer_settings');
        const settings = JSON.parse(artplayerSettings);

       // 创建一个列表
    const ul = document.createElement('ul');
    ul.id = 'video-list';  // 列表的id，你可以根据需要自行更改

     // 遍历times对象并提取视频路径字符串
    for (const key in settings.times) {
        if (settings.times.hasOwnProperty(key)) {
            const videoPath = key;

            // 创建列表项
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = videoPath;
            link.href = videoPath;  // 设置链接的href为视频路径

            // 将链接添加到列表项中
            li.appendChild(link);

            // 将列表项添加到列表中
            ul.appendChild(li);
        }
    }

        // 将列表添加到弹窗中
        popup.appendChild(ul);
    }

     // 显示弹窗
    function showPopup() {
        // 在弹窗显示后，重定向到首页
        createPopup();
        popupVisible = true;
    }

    // 关闭弹窗
    function closePopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.remove();
        }
        popupVisible = false;
    }
      // 在页面加载后创建按钮
    window.addEventListener('load', createButton);
})();