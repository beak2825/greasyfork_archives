// ==UserScript==
// @name         页面隐藏
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  键盘大写锁定键开启时，按下 Shift 和 Ctrl 显示遮罩页面，关闭大写锁定还原页面。
// @author       heiyu
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518754/%E9%A1%B5%E9%9D%A2%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/518754/%E9%A1%B5%E9%9D%A2%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建遮罩元素
    const mask = document.createElement('div');
    mask.style.position = 'fixed';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.width = '100%';
    mask.style.height = '100%';
    mask.style.backgroundColor = 'white';
    mask.style.zIndex = '9999';
    mask.style.display = 'none'; // 默认隐藏
    mask.style.overflow = 'hidden'; // 禁止滚动

    // 嵌入 iframe 加载在线 HTML 页面
    const iframe = document.createElement('iframe');
    iframe.src = 'https://fuck-qq.com/404.html'; // 替换为在线 HTML 的 URL
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    // 将 iframe 添加到遮罩
    mask.appendChild(iframe);

    // 添加遮罩到页面
    document.body.appendChild(mask);

    let isCapsLock = false;

    // 检测 CapsLock 状态
    function checkCapsLock(event) {
        return event.getModifierState && event.getModifierState('CapsLock');
    }

    // 监听键盘事件
    document.addEventListener('keydown', (event) => {
        isCapsLock = checkCapsLock(event);
        if (isCapsLock && event.shiftKey && event.ctrlKey) {
            mask.style.display = 'block';
        }
    });

    document.addEventListener('keyup', (event) => {
        isCapsLock = checkCapsLock(event);
        if (!isCapsLock) {
            mask.style.display = 'none';
        }
    });
})();
