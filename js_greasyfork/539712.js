// ==UserScript==
// @name         掘金自由复制代码按钮
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  跳过登录，直接复制代码，按钮显示“自由复制”
// @match        *://juejin.cn/*
// @grant        GM_setClipboard
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/539712/%E6%8E%98%E9%87%91%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/539712/%E6%8E%98%E9%87%91%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 工具函数：复制文本到剪贴板（兼容性好）
    function copyToClipboard(text) {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(text);
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            // 兼容老浏览器
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }
    // 监控并劫持“复制代码”按钮
    function hackCopyButtons() {
        const btns = document.querySelectorAll('.code-block-extension-copyCodeBtn'); 
        btns.forEach(btn => {
            // 改按钮文字
            if (btn.textContent == '自由复制' || btn.textContent == '复制成功！') return;
            btn.textContent = '自由复制';
            // 移除原有事件（防止冒泡到原生M函数）
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            // 重新绑定点击事件
            newBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                let code = '';
                let codeElem = newBtn.parentElement.parentElement.parentElement.querySelector('.code-block-extension-codeShowNum');
                if (codeElem) {
                    code = codeElem.textContent || '';
                } 
                code = code.replace(/\n$/, '');
                copyToClipboard(code);
                const oldText = newBtn.textContent;
                const oldColor = newBtn.style.color;
                const oldFilter = newBtn.style.filter;
                newBtn.textContent = '复制成功！';
                newBtn.style.color = 'red';
                newBtn.style.filter = 'none';
                setTimeout(() => {
                    newBtn.textContent = oldText;
                    newBtn.style.color = oldColor;
                    newBtn.style.filter = oldFilter;
                }, 1600);
            }, false);
        });
    }

    {
    function loopHack() {
        hackCopyButtons();
        setTimeout(loopHack, 2000);
    }
    loopHack();
    }
})();