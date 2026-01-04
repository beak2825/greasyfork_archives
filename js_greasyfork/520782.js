// ==UserScript==
// @name         智慧职教课件下载
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       KEshan
// @description  [可以下载智慧职教课件]
// @match        *://zjy2.icve.com.cn/study/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520782/%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/520782/%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '下载课件';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // 按钮点击事件
    button.addEventListener('click', function () {
        // 获取标题元素
        const titleElement = document.querySelector('div.courseName');
        const folderName = titleElement
            ? titleElement.textContent.trim().replace(/[\\/:*?"<>|]/g, '_') // 替换非法字符
            : '默认标题'; // 设置默认标题

        // 获取页面上的所有图片
        const images = document.querySelectorAll('img');
        let count = 0;

        images.forEach(img => {
            const src = img.src; // 获取图片的 URL
            if (src.includes('_gen') && src.endsWith('/1.png')) {
                // 修改 URL
                const modifiedUrl = src
                    .replace('_gen', '') // 移除 _gen
                    .replace('/1.png', '') // 移除 /1.png
                    + `?response-content-disposition=attachment;filename=${folderName}`;

                // 创建隐藏的 <a> 元素触发下载
                const link = document.createElement('a');
                link.href = modifiedUrl;
                link.download = folderName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                count++;
            }
        });

    });

    // 将按钮添加到页面中
    document.body.appendChild(button);
})();
