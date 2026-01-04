// ==UserScript==
// @name         DNSLog域名复制
// @namespace    http://tampermonkey.net/
// @version      2024-01-23
// @description  复制DNSLog生成的域名
// @author       Mrxn
// @match        http://dnslog.pw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dnslog.pw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484831/DNSLog%E5%9F%9F%E5%90%8D%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/484831/DNSLog%E5%9F%9F%E5%90%8D%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找所有包含 mark 标签的 span 元素
    const spans = document.querySelectorAll('span > mark');

    // 对每个包含 mark 标签的 span 元素执行操作
    spans.forEach(span => {
        // 创建一个复制按钮
        const copyButton = document.createElement('mark');
        copyButton.textContent = 'Copy';
        // 给复制按钮设置样式
        copyButton.style.position = 'relative';
        copyButton.style.top = 0;
        copyButton.style.right = 0;
        copyButton.style.marginLeft = '5px';
        copyButton.style.color = 'orangered';
        //设置监听事件
        copyButton.addEventListener('click', () => {
            const textToCopy = copyButton.previousElementSibling.textContent; // 获取前一个兄弟元素（即 mark 标签）的文本内容

            // 创建一个临时 textarea 元素，并将要复制的文本放入其中
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            tempTextArea.style.position = 'fixed';
            document.body.appendChild(tempTextArea);

            // 选中临时 textarea 中的文本并执行复制命令
            tempTextArea.select();
            document.execCommand('copy');

            // 清理临时元素
            document.body.removeChild(tempTextArea);

            console.log('DNSLog copied to clipboard');
        });

        // 将复制按钮添加到 mark 标签后面
        span.insertAdjacentElement('afterend', copyButton);
    });

    //自动选中刷新
    window.addEventListener("load", function() {
        var checkbox = document.getElementById("auto_refresh");
        // 检查 checkbox 是否获取成功
        if (checkbox) {
            var intervalId = setInterval(checkbox_status, 500); // 保存定时器ID

            function checkbox_status() {
                // 如果复选框已经被手动勾选，则停止定时器
                if (checkbox.checked) {
                    clearInterval(intervalId);
                }
                // 否则，如果当前未勾选，则触发点击
                else if (!checkbox.checked) {
                    checkbox.click();
                }
            }
        }
    }, false);

})();