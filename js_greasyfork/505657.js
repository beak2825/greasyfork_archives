// ==UserScript==
// @name         Pinterest 图片下载
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在 Pinterest 页面上添加一个按钮，自动下载特定图片并随机重命名
// @author       Lapis0x0
// @match        https://www.pinterest.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505657/Pinterest%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/505657/Pinterest%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    function createButton() {
        var button = document.createElement('button');
        button.innerHTML = '下载图片';
        button.style.position = 'fixed';
        button.style.top = '50%';
        button.style.left = '0';
        button.style.transform = 'translateY(-50%)';
        button.style.zIndex = 1000;
        document.body.appendChild(button);
        return button;
    }

    // 生成随机文件名函数
    function generateRandomFilename() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let filename = '';
        for (let i = 0; i < 10; i++) {
            filename += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return filename + '.jpg';
    }

    // 下载图片函数
    function downloadImage() {
        var link = document.querySelector('div[itemprop="name"] a[href*="i.pinimg.com/originals"]');
        if (link) {
            var imageUrl = link.href;
            fetch(imageUrl)
                .then(response => response.blob())
                .then(blob => {
                    var a = document.createElement('a');
                    var url = window.URL.createObjectURL(blob);
                    var filename = generateRandomFilename();
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                })
                .catch(() => alert('下载图片失败'));
        } else {
            alert('未找到图片链接');
        }
    }

    // 创建并添加按钮
    var button = createButton();
    button.addEventListener('click', downloadImage);

    // 使用 MutationObserver 监听 DOM 变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var link = document.querySelector('div[itemprop="name"] a[href*="i.pinimg.com/originals"]');
                if (link) {
                    observer.disconnect(); // 停止观察
                    console.log('图片链接已找到，可以下载');
                }
            }
        });
    });

    // 配置观察选项
    var config = { childList: true, subtree: true };

    // 开始观察文档主体
    observer.observe(document.body, config);
})();
