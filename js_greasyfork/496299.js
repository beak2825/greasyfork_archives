// ==UserScript==
// @name         禁用浏览器快捷键窗口
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      MIT
// @grant        none
// @author       forcier
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-start
// @match        *://kimi.moonshot.cn/*
// @description  chrome、edge等浏览器中会弹出窗口，经常会误触，故禁用所有页面中的快捷键
// @supportURL   https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=270
// @homepage     https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=270
// @downloadURL https://update.greasyfork.org/scripts/496299/%E7%A6%81%E7%94%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/496299/%E7%A6%81%E7%94%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==
(function () {
    "use strict";
    const style = document.createElement('style');
    style.innerHTML = `*{font-size: 苹方-简 !important}`;
    document.head.appendChild(style);
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
    const handleMouseDown = debounce((event) => {
        if ('which' in event) {
            switch (event.which) {
                case 1:
                case 2:
                case 3:
                    break;
                default:
                    if (window.history.length === 1) window.close();
                    break;
            }
        }
    }, 200);
    document.addEventListener('mousedown', handleMouseDown);
    // 处理键盘按下事件
    const keysToPrevent = ['F1', 'F3', 'F7', 'F9'];
    document.addEventListener('keydown', function (event) {
        if (keysToPrevent.includes(event.key)) {
            event.preventDefault();
        } else if (event.ctrlKey && (event.key === 's' || event.key === 'e')) {
            event.preventDefault();
        }
    });

    // 选中复制,自动跳转选中的url
    document.addEventListener('mouseup', () => {
        let selectedText = window.getSelection().toString();
        try {
            new URL(selectedText);
            document.getSelection().removeAllRanges();
            window.open(selectedText);
        } catch (err) {
            if (selectedText.length > 0) navigator.clipboard.writeText(selectedText)
        }
    });
})();
