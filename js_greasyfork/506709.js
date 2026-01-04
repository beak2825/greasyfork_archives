// ==UserScript==
// @license MIT
// @name         d2jsp
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight posts with keywords you input. Help to filter the important messages you need.
// @author       kingpeter
// @match        https://forums.d2jsp.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=d2jsp.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506709/d2jsp.user.js
// @updateURL https://update.greasyfork.org/scripts/506709/d2jsp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从 localStorage 获取保存的文本内容
    var savedText = localStorage.getItem('textareaContent') || '';

    // 更新 a 标签样式的函数
    function updateLinkStyles() {
        var lines = (localStorage.getItem('textareaContent') || '').split('\n').map(line => line.trim()).filter(line => line !== '');

        document.querySelectorAll('tbody a').forEach(function(a) {
            if (lines.some(line => a.textContent.toLowerCase().includes(line.toLowerCase()))) {
                a.style.color = 'blue';
                a.style.fontSize = '190%';
                a.style.fontWeight = 'normal !important';
                if(a.querySelector('b'))
                    a.querySelector('b').fontWeight = 'normal !important';
            } else {
                a.style.color = 'black'; // 恢复默认颜色
                a.style.fontWeight = 'normal !important';
                if(a.querySelector('b'))
                    a.querySelector('b').fontWeight = 'normal !important';
                a.style.fontSize = ''; // 恢复默认字体大小
            }
        });
    }

    // 遍历所有 dl.c 元素
    document.querySelectorAll('dl.c').forEach(function(dl) {
        console.log("run")
        // 修改 dl.c 的 padding 样式
        dl.style.padding = '0 0 0 110px';

        // 创建新的 div 元素
        var newDiv = document.createElement('div');
        newDiv.style.width = '100px';
        newDiv.style.height = dl.offsetHeight + 'px';  // 使新 div 的高度与 dl.c 的高度相同
        newDiv.style.float = 'left';  // 将 div 放置在左边
        newDiv.style.margin = '5px 0 0 0'
        newDiv.style.border = '1px solid black'; // 绘制边框

        // 创建 textarea 元素
        var textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.resize = 'none';
        textarea.style.height = (dl.offsetHeight - 30) + 'px';  // 留出按钮的位置
        textarea.value = savedText;  // 设置 textarea 的初始值

        // 创建按钮元素
        var button = document.createElement('button');
        button.textContent = 'Button';
        button.style.width = '100%';

        // 添加按钮点击事件
        button.addEventListener('click', function() {
            // 保存 textarea 中的内容到 localStorage
            localStorage.setItem('textareaContent', textarea.value);
            updateLinkStyles();
        });

        // 将 textarea 和按钮添加到新 div 中
        newDiv.appendChild(textarea);
        newDiv.appendChild(button);

        // 将新 div 插入到 dl.c 元素的左边
        dl.parentNode.insertBefore(newDiv, dl);
    });

    // 监听 DOM 变化
    const observer = new MutationObserver(() => {
        updateLinkStyles();
    });

    // 观察整个 document.body 变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 初次运行更新样式
    updateLinkStyles();
})();