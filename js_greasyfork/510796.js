// ==UserScript==
// @name         Auto Show Decoded URL
// @name:zh-CN 无编码网址窗
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  显示解码后的 URL，方便手动复制到地址栏，带有关闭按钮
// @description:zh-CN  显示解码后的 URL，方便手动复制到地址栏，带有关闭按钮
// @author       王大锤
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510796/Auto%20Show%20Decoded%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/510796/Auto%20Show%20Decoded%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function () {
        // 解码当前 URL
        var decodedURL = decodeURIComponent(window.location.href);
        console.log('Decoded URL:', decodedURL);

        // 检查解码后的 URL 是否与原始 URL 不同
        if (decodedURL !== window.location.href) {
            // 在页面顶部显示解码后的 URL
            let displayDiv = document.createElement('div');
            displayDiv.style.position = 'fixed';
            displayDiv.style.top = '0';
            displayDiv.style.left = '0';
            displayDiv.style.width = '100%';
            displayDiv.style.backgroundColor = '#f0f0f0';
            displayDiv.style.padding = '10px';
            displayDiv.style.zIndex = '9999';
            displayDiv.style.textAlign = 'center';
            displayDiv.style.borderBottom = '2px solid #ccc';

            // 添加关闭按钮
            let closeButton = document.createElement('span');
            closeButton.textContent = '×';
            closeButton.style.cursor = 'pointer';
            closeButton.style.float = 'right';
            closeButton.style.marginRight = '10px';
            closeButton.style.fontSize = '20px';
            closeButton.style.color = '#f00';

            // 点击关闭按钮时，隐藏显示框
            closeButton.addEventListener('click', function() {
                displayDiv.style.display = 'none';
            });

            // 添加解码后的 URL 和提示文本
            displayDiv.innerHTML = `<strong>解码后的 URL：</strong> <input type="text" value="${decodedURL}" style="width:70%;" id="decoded-url"> <button id="copy-url">复制</button>`;
            
            // 将关闭按钮添加到显示框
            displayDiv.appendChild(closeButton);

            // 将显示框添加到页面
            document.body.appendChild(displayDiv);

            // 添加复制功能
            document.getElementById('copy-url').addEventListener('click', function() {
                let urlInput = document.getElementById('decoded-url');
                urlInput.select();
                document.execCommand('copy');
                alert('解码后的 URL 已复制到剪贴板，请粘贴到地址栏中。');
            });
        }
    });
})();
