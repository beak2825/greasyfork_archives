// ==UserScript==
// @name         nodeseek复制按钮
// @version      0.1
// @description  为nodeseek代码块添加复制按钮
// @author       endercat
// @license MIT
// @match        https://www.nodeseek.com/*
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/1184905
// @downloadURL https://update.greasyfork.org/scripts/484165/nodeseek%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/484165/nodeseek%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加复制按钮的函数
    function addCopyButton(element) {
        // 创建包装器 div
        var wrapper = document.createElement('div');
        wrapper.style.position = 'relative'; // 设置相对定位

        // 创建复制按钮
        var copyButton = document.createElement('button');
        copyButton.innerHTML = '复制';
        copyButton.style.position = 'absolute'; // 设置绝对定位
        copyButton.style.right = '0'; // 靠右对齐
        copyButton.style.opacity = '0'; // 初始不可见
        copyButton.style.transition = 'opacity 0.3s'; // 添加过渡效果

        // 添加点击事件以复制代码内容
        copyButton.addEventListener('click', function() {
            var codeContent = element.textContent;
            GM_setClipboard(codeContent);
            mscAlert('已复制到剪切板！');
        });

        // 添加鼠标悬停事件以显示按钮
        wrapper.addEventListener('mouseover', function() {
            copyButton.style.opacity = '0.5'; // 鼠标悬停时设置透明度为0.5
        });

        // 添加鼠标离开事件以隐藏按钮
        wrapper.addEventListener('mouseout', function() {
            copyButton.style.opacity = '0'; // 鼠标离开时设置透明度为0
        });

        // 将复制按钮添加到包装器中
        wrapper.appendChild(copyButton);

        // 使用包装器包裹代码块
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
    }

    // 选择页面上的所有代码块
    var codeBlocks = document.querySelectorAll('pre code');

    // 为每个代码块添加复制按钮
    codeBlocks.forEach(function(codeBlock) {
        addCopyButton(codeBlock);
    });
})();
