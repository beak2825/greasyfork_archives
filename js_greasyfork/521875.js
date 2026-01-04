// ==UserScript==
// @name         Pixiv 调用本地程序按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在Pixiv页面添加按钮，点击后调用本地程序并传递路径参数
// @author       You
// @match         *://www.pixiv.net/*  // 匹配 Pixiv 页面
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521875/Pixiv%20%E8%B0%83%E7%94%A8%E6%9C%AC%E5%9C%B0%E7%A8%8B%E5%BA%8F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/521875/Pixiv%20%E8%B0%83%E7%94%A8%E6%9C%AC%E5%9C%B0%E7%A8%8B%E5%BA%8F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '启动本地程序';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.left = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    // 获取当前页面的路径作为参数
    const currentPath = window.location.href;  // 获取 Pixiv 页面当前的 URL 作为参数

    // 按钮点击事件
    button.addEventListener('click', () => {
        // 发送请求到本地服务器，并附带路径参数
        fetch(`http://localhost:5000/run_program?path=${encodeURIComponent(currentPath)}`)
            .then(response => response.text())
            .then(data => alert(data))
            .catch(error => alert('启动失败：' + error));
    });

    // 将按钮添加到网页
    document.body.appendChild(button);
})();
