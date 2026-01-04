// ==UserScript==
// @name         Copy Text to Clipboard
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to copy text to clipboard inside an <li> with specific classes before the first element in toolbar-items
// @author       Nomind
// @match        *://*/*
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/521620/Copy%20Text%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/521620/Copy%20Text%20to%20Clipboard.meta.js
// ==/UserScript==

(function() {

    function getConntent(){
        const url = window.location.href;

        // 使用正则表达式提取项目名称和任务 ID
        const regex = /projects\/([^\/]+)\/work_packages\/(\d+)/;
        const match = url.match(regex);

        if (match) {
            const projectName = match[1].toUpperCase(); // 提取项目名称
            const taskId = match[2]; // 提取任务 ID
            const detail = document.getElementsByClassName("inline-edit--display-field subject -required -editable")[0].title;

            return `git commit -m "${projectName}-${taskId}: ${detail}"`
        } else {
            console.log('未能匹配到项目名称和任务 ID');
        }
        return '';
    }

    'use strict';



    // 创建一个新的 <li> 元素，并添加类
    const listItem = document.createElement('li');
    listItem.className = 'toolbar-item hidden-for-tablet'; // 添加类

    // 创建按钮
    const button = document.createElement('button');
    button.innerText = '复制文本';
    button.className = 'button -primary'; // 添加按钮类

    // 将按钮添加到 <li> 中
    listItem.appendChild(button);

    // 检查目标元素是否存在的函数
    function checkForElement() {
        const toolbarItems = document.getElementById('toolbar-items');
        if (toolbarItems) {
            // 找到第一个子元素
            const firstChild = toolbarItems.firstChild;
            // 在第一个子元素前插入 <li>
            toolbarItems.insertBefore(listItem, firstChild);

            // 添加按钮点击事件
            button.addEventListener('click', () => {
                navigator.clipboard.writeText(getConntent()).then(() => {
                    alert(getConntent());
                }).catch(err => {
                    console.error('复制失败: ', err);
                });
            });
        } else {
            // 如果元素不存在，继续检查
            setTimeout(checkForElement, 100); // 每100毫秒检查一次
        }
    }

    // 开始检查
    checkForElement();
})();
