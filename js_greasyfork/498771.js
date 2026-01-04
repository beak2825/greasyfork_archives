// ==UserScript==
// @name         mytan-Markdown序号选择
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Make Markdown list numbers selectable via keyboard shortcut (Ctrl+Shift+S)
// @match        https://mytan.maiseed.com.cn/chat/*
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498771/mytan-Markdown%E5%BA%8F%E5%8F%B7%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/498771/mytan-Markdown%E5%BA%8F%E5%8F%B7%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function makeNumbersSelectable() {
        // 获取所有的 <ol> 元素
        const orderedLists = document.querySelectorAll('ol');

        // 遍历所有的 <ol> 元素
        orderedLists.forEach((ol) => {
            // 获取当前 <ol> 内的所有 <li> 元素
            const listItems = ol.querySelectorAll('li');

            // 修改当前 <ol> 的样式，去掉默认的列表样式
            ol.style.listStyleType = 'none';

            // 遍历所有 <li> 元素
            listItems.forEach((li, liIndex) => {
                // 检查是否已经添加了序号
                if (!li.querySelector('.selectable-number')) {
                    // 创建包含序号的 span 元素
                    const numberSpan = document.createElement('span');
                    numberSpan.textContent = `${liIndex + 1}. `;
                    numberSpan.className = 'selectable-number';
                    numberSpan.style.userSelect = 'text';
                    numberSpan.style.WebkitUserSelect = 'text';

                    // 在 <li> 元素的开头插入序号
                    li.insertBefore(numberSpan, li.firstChild);
                }
            });
        });

        console.log("列表序号添加完成");
        alert('列表序号现在可以选择了！');
    }

    // 添加键盘事件监听器
    document.addEventListener('keydown', function(e) {
        // 检查是否按下了 Ctrl+Shift+S
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault(); // 阻止默认行为
            makeNumbersSelectable();
        }
    });

    console.log("脚本已加载，使用 Ctrl+Shift+S 激活可选择的列表序号");
})();
