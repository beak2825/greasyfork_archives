// ==UserScript==
// @name         Modify Telegram Web Elements
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  修改特定元素样式并删除元素
// @author       Your Name
// @match        https://web.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518878/Modify%20Telegram%20Web%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/518878/Modify%20Telegram%20Web%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 使用 MutationObserver 观察动态内容变化
        const observer = new MutationObserver(modifyElements);
        observer.observe(document.body, { childList: true, subtree: true });

        // 初始调用修改函数
        modifyElements();

        function modifyElements() {
            // 隐藏 class 为 peer-title 的 span 元素
            const peerTitles = document.querySelectorAll('span.peer-title');
            peerTitles.forEach(span => {
                span.style.display = 'none'; // 隐藏元素
            });

            // 将 class 为 translatable-message 的 span 元素的字号设置为 10px
            const translatableMessages = document.querySelectorAll('span.translatable-message');
            translatableMessages.forEach(span => {
                span.style.fontSize = '10px'; // 设置字体大小
            });

            // 删除 class 为 chat-background 的 div 元素
            const chatBackgrounds = document.querySelectorAll('div.chat-background');
            chatBackgrounds.forEach(div => {
                div.remove(); // 删除元素
            });

            // 将 class 为 media-photo 的 img 元素的宽度设置为 50px
            const mediaPhotos = document.querySelectorAll('img.media-photo');
            mediaPhotos.forEach(img => {
                img.style.width = '50px'; // 设置图片宽度
                img.style.height = 'auto'; // 保持宽高比
            });

            // 将 class 为 avatar 的 div 元素的宽高设置为 20px
            const avatars = document.querySelectorAll('div.avatar');
            avatars.forEach(div => {
                div.style.width = '20px'; // 设置宽度
                div.style.height = '20px'; // 设置高度
            });

            // 调整 #column-left 的最大宽度为 150px
            const columnLeft = document.querySelector('#column-left');
            if (columnLeft) {
                columnLeft.style.maxWidth = '150px'; // 设置最大宽度
            }
        }
    });
})();
