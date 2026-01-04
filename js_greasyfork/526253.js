// ==UserScript==
// @name         subhd资源
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在订阅按钮前添加资源内容按钮，链接指向当前页面地址
// @author       您的名字
// @match        https://subhd.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526253/subhd%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/526253/subhd%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function () {

        // 选择所有订阅或已订阅按钮
        const buttons = document.querySelectorAll('button.fav');

        buttons.forEach((button) => {
            // 检查按钮内容
            const span = button.querySelector('span');
            if (span && (span.textContent === '订阅' || span.textContent === '已订阅')) {
                // 创建新的按钮
                const newButton = document.createElement('button');
                newButton.className = 'btn btn-outline-success btn-sm f12 me-1'; // 设置新按钮样式
                newButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                        <path d="M6.354 5.646a.5.5 0 0 1 .708 0L8 6.293l.939-.939a.5.5 0 1 1 .707.707l-1 1a.5.5 0 0 1-.708 0L8 6.707l-.646.647a.5.5 0 0 1-.707-.707l1-1z"/>
                        <path d="M4 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm4-5a5 5 0 1 0 0 10A5 5 0 0 0 8 3z"/>
                    </svg>
                    <span>资源内容</span>
                `;

                // 添加按钮行为
                newButton.onclick = function () {
                    //const currentUrl = window.location.href;
                    const currentUrl = document.querySelector('h1 .link-light').href;
                    const newUrl = currentUrl.replace('https://subhd.tv', 'https://webbd.top');
                    console.log(newUrl);
                    window.open(newUrl, '_blank'); // 在新窗口中打开
                };

                // 在当前按钮之前插入新按钮
                button.parentNode.insertBefore(newButton, button);
            }
        });
    });
})();
