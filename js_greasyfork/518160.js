// ==UserScript==
// @name         InfoSelection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Select the info.
// @author       zxk2099
// @match        https://solar.ofweek.com/*
// @grant        GM_setClipboard
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/518160/InfoSelection.user.js
// @updateURL https://update.greasyfork.org/scripts/518160/InfoSelection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
        // 创建悬浮按钮
    var button = document.createElement('button');
    button.innerHTML = '复制信息';
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.top = '50%';
    button.style.transform = 'translateY(-50%)';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';

    // 将按钮添加到页面
    document.body.appendChild(button);

    // 点击按钮时获取信息并复制到剪贴板
    button.addEventListener('click', function() {
        // 获取标题、时间和网页地址
        var title = document.querySelector('p.title');
        var time = document.querySelector('div.time.fl');
        var url = window.location.href;

        // 如果找到了标题和时间元素，格式化文本
        if (title && time) {
            var titleText = title.innerText.trim();
            var timeText = time.innerText.trim().toLocaleString().split(" ")[0];

            // 格式化复制的内容
            var textToCopy = `${timeText}\t\t\t${titleText}\t${url}`;

            // 使用 GM_setClipboard 将内容复制到剪贴板
            GM_setClipboard(textToCopy);
            alert('信息已复制到剪贴板!');
        } else {
            alert('未能找到标题或时间元素！');
        }
    });

})();
