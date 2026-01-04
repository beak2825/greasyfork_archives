// ==UserScript==
// @license MIT
// @name         知乎复制追加网址（Alt+C 触发）
// @namespace    http://your.namespace/
// @version      1.4
// @description  在知乎网站使用 Alt+C 复制文本时，自动追加当前页面的网址到剪贴板，并在页面上显示提示
// @author       你的名字
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505620/%E7%9F%A5%E4%B9%8E%E5%A4%8D%E5%88%B6%E8%BF%BD%E5%8A%A0%E7%BD%91%E5%9D%80%EF%BC%88Alt%2BC%20%E8%A7%A6%E5%8F%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/505620/%E7%9F%A5%E4%B9%8E%E5%A4%8D%E5%88%B6%E8%BF%BD%E5%8A%A0%E7%BD%91%E5%9D%80%EF%BC%88Alt%2BC%20%E8%A7%A6%E5%8F%91%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听键盘按键事件
    document.addEventListener('keydown', function(e) {
        // 检查是否同时按下了 Alt 键和 C 键
        if (e.altKey && e.keyCode === 67) { // keyCode 67 对应 C 键
            e.preventDefault(); // 阻止默认行为，防止页面后退
            copyWithAppendUrl();
        }
    });

    // 复制文本并追加当前页面的网址
    function copyWithAppendUrl() {
        var selectedText = window.getSelection().toString().trim();
        if (!selectedText) return; // 如果没有选中文本，则直接返回

        var currentUrl = window.location.href;
        var newClipText = selectedText + "\n" + currentUrl;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(newClipText).then(function() {
                showCopySuccessHint(); // 显示复制成功的提示
            }).catch(function(err) {
                console.error('复制失败：', err);
                alert('复制失败，请尝试手动复制。');
            });
        } else {
            GM_setClipboard(newClipText, 'text');
            showCopySuccessHint(); // 显示复制成功的提示
        }
    }

    // 显示复制成功的提示信息
    function showCopySuccessHint() {
        var hintDiv = document.createElement('div');
        hintDiv.id = 'copyHint';
        hintDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: #fff;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            transition: opacity 1s ease-out;
        `;
        hintDiv.textContent = '已追加复制。';

        document.body.appendChild(hintDiv);

        // 一秒后淡出并移除提示信息
        setTimeout(function() {
            hintDiv.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(hintDiv);
            }, 1000);
        }, 1000);
    }
})();