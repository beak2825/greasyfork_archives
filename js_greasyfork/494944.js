// ==UserScript==
// @name         Twitter Unblock All
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically unblock all blocked accounts on Twitter with feedback
// @author       DN
// @match        https://twitter.com/settings/blocked/all
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/494944/Twitter%20Unblock%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/494944/Twitter%20Unblock%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加按钮到页面
    const button = document.createElement('button');
    button.textContent = '取消所有屏蔽';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.color = '#fff';
    button.style.backgroundColor = '#1da1f2';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // 添加进度显示
    const statusDiv = document.createElement('div');
    statusDiv.style.position = 'fixed';
    statusDiv.style.top = '50px';
    statusDiv.style.right = '10px';
    statusDiv.style.zIndex = '1000';
    statusDiv.style.padding = '5px 10px';
    statusDiv.style.fontSize = '14px';
    statusDiv.style.color = '#fff';
    statusDiv.style.backgroundColor = '#000';
    statusDiv.style.borderRadius = '5px';
    statusDiv.textContent = '准备开始...';

    document.body.appendChild(button);
    document.body.appendChild(statusDiv);

    // 点击按钮执行取消屏蔽操作
    button.addEventListener('click', function() {
        const unblockButtons = Array.from(document.querySelectorAll('button[aria-label="已屏蔽"]'));
        let completed = 0;

        function unblock(index) {
            if (index >= unblockButtons.length) {
                statusDiv.textContent = '所有用户已取消屏蔽';
                return;
            }

            const button = unblockButtons[index];
            button.click();
            completed++;
            statusDiv.textContent = `正在取消屏蔽: ${completed}/${unblockButtons.length}`;
            setTimeout(() => unblock(index + 1), 1000);
        }

        unblock(0);
    });
})();
