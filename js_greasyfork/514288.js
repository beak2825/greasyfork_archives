// ==UserScript==
// @author   ss
// @name 115扩展
// @description     用于115整理资源
// @namespace AceScript Scripts
// @match https://115.com/*
// @grant none
// @version 1.0.
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/514288/115%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/514288/115%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
 // 创建浮窗输入框和确定按钮
    const inputContainer = document.createElement('div');
    inputContainer.style.position = 'fixed';
    inputContainer.style.top = '10px';
    inputContainer.style.right = '10px';
    inputContainer.style.zIndex = '9999';
    document.body.appendChild(inputContainer);

    const input = document.createElement('input');
    inputContainer.appendChild(input);

    const button = document.createElement('button');
    button.textContent = '确定';
    inputContainer.appendChild(button);

    // 点击确定按钮时执行处理逻辑
    button.addEventListener('click', () => {
        const keyword = input.value;
        const listContents = document.querySelectorAll('.list-contents');
        listContents.forEach(content => {
            const listItems = content.querySelectorAll('li');
            listItems.forEach(item => {
                const name = item.textContent;
                if (name.includes(keyword)) {
                    item.classList.add('selected');
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.checked = true;
                }
            });
        });
    });
})();