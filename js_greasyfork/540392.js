// ==UserScript==
// @name         上下翻页按钮
// @version      1.2
// @description  添加浮动按钮以进行上下翻页。
// @author       ChatGPT
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/540392/%E4%B8%8A%E4%B8%8B%E7%BF%BB%E9%A1%B5%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/540392/%E4%B8%8A%E4%B8%8B%E7%BF%BB%E9%A1%B5%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建上翻按钮
    const upButton = document.createElement('div');
    upButton.innerText = '△';
    upButton.style.position = 'fixed';
    upButton.style.right = '10px';
    upButton.style.top = '40%'; // 调整位置，缩短间隔
    upButton.style.width = '40px';
    upButton.style.height = '40px';
    upButton.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 半透明背景
    upButton.style.borderRadius = '5px';
    upButton.style.textAlign = 'center';
    upButton.style.lineHeight = '40px';
    upButton.style.cursor = 'pointer';
    upButton.style.zIndex = '9999';
    upButton.style.color = 'rgba(0, 0, 0, 0.5)'; // 半透明字体颜色

    // 创建下翻按钮
    const downButton = document.createElement('div');
    downButton.innerText = '▽';
    downButton.style.position = 'fixed';
    downButton.style.right = '10px';
    downButton.style.top = '55%'; // 调整位置，缩短间隔
    downButton.style.width = '40px';
    downButton.style.height = '40px';
    downButton.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 半透明背景
    downButton.style.borderRadius = '5px';
    downButton.style.textAlign = 'center';
    downButton.style.lineHeight = '40px';
    downButton.style.cursor = 'pointer';
    downButton.style.zIndex = '9999';
    downButton.style.color = 'rgba(0, 0, 0, 0.5)'; // 半透明字体颜色

    // 添加事件监听器
    upButton.addEventListener('click', () => {
        window.scrollBy(0, -window.innerHeight * 0.8); // 向上滚动80%
    });

    downButton.addEventListener('click', () => {
        window.scrollBy(0, window.innerHeight * 0.8); // 向下滚动80%
    });

    // 将按钮添加到文档中
    document.body.appendChild(upButton);
    document.body.appendChild(downButton);
})();
