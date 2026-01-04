// ==UserScript==
// @name         csdn添加CODE复制按钮
// @namespace    http://tampermonkey.net/
// @version      2024-04-07
// @description  介绍个屁啊，自用!
// @author       没得名字
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491869/csdn%E6%B7%BB%E5%8A%A0CODE%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/491869/csdn%E6%B7%BB%E5%8A%A0CODE%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保 DOM 加载完成
    window.addEventListener('load', function() {
        var codeElements = document.querySelectorAll('code');

        codeElements.forEach(function(codeElement) {
            // 创建复制按钮
            var copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.textContent = '点击复制';

            // 使用 Clipboard API 实现复制（兼容大部分现代浏览器）
            if (navigator.clipboard) {
                copyButton.addEventListener('click', async function() {
                    try {
                        await navigator.clipboard.writeText(codeElement.textContent || codeElement.innerText);
                        alert('CODE内容已写入剪贴板!');
                    } catch (err) {
                        console.error('复制失败: ', err);
                    }
                });
            } else {
                // 对于不支持 Clipboard API 的浏览器，可以保留原有的 execCommand 方法作为备选方案，但效果可能不佳
                copyButton.addEventListener('click', function() {
                    var tempInput = document.createElement('input');
                    document.body.appendChild(tempInput);

                    tempInput.value = codeElement.textContent || codeElement.innerText;
                    tempInput.select();
                    document.execCommand('点击复制');
                    document.body.removeChild(tempInput);

                    alert('CODE内容已写入剪贴板!');
                });
            }

            // 在code元素后插入复制按钮
            codeElement.parentNode.insertBefore(copyButton, codeElement.nextSibling);
        });
    });
})();