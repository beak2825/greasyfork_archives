// ==UserScript==
// @name         Pixiv壁纸设置
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键下载Pixiv图片并设置为壁纸
// @author       您的名字
// @match        *://www.pixiv.net/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/521874/Pixiv%E5%A3%81%E7%BA%B8%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/521874/Pixiv%E5%A3%81%E7%BA%B8%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', () => {
        // 在页面右上角添加按钮
        const button = document.createElement('button');
        button.textContent = '设置为壁纸';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#f39c12';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        document.body.appendChild(button);

        // 按钮点击事件
        button.addEventListener('click', () => {
            // 获取图片URL
            const imageElement = document.querySelector('.sc-1qpw8k9-1 img'); // Pixiv 图片的 CSS 选择器
            if (!imageElement) {
                alert('未找到图片，请确保在正确的页面上。');
                return;
            }

            const imageUrl = imageElement.src.replace(/c\/\d+x\d+\//, ''); // 去掉缩略图尺寸参数
            console.log('图片URL:', imageUrl);

            // 调用本地服务器接口
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://localhost:3000/set-wallpaper', // 您的本地服务器地址
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({ imageUrl }),
                onload: (response) => {
                    if (response.status === 200) {
                        alert('壁纸已更新！');
                    } else {
                        alert('设置壁纸时发生错误，请检查服务器。');
                    }
                },
                onerror: (error) => {
                    alert('无法连接到本地服务器，请确保服务器正在运行。');
                    console.error(error);
                },
            });
        });
    });
})();
