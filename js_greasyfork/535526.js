// ==UserScript==
// @name         右键双击在新标签页打开链接 (可配置跳转)
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  在任何元素上鼠标右键双击，如果它或其父元素是一个链接，则在新标签页打开。可配置新标签页是否立即激活。阻止双击时的右键菜单。
// @author       bin7890
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjM2E4MmY3Ij48cGF0aCBkPSJNMTQuNDE0IDIuMDAxbDcgNi45OThWMTljMCAxLjEwMy0uODk3IDItMiAyaC0xMGMtMS4xMDMgMC0yLS44OTctMi0yVjRjMC0xLjEwMy44OTctMiAyLTJoNnptMCAyaC02djE1aDEwdjAxaC0xLjQxNFY5aC01LjU4NnYtNS55OTl6TTIgNWg0djJoLTRWNXptMCA0aDR2MmgtNFY5em0wIDRoNHYyaC00di0yem0wIDRoNHYyaC00di0yeiIvPjwvc3ZnPg==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535526/%E5%8F%B3%E9%94%AE%E5%8F%8C%E5%87%BB%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%20%28%E5%8F%AF%E9%85%8D%E7%BD%AE%E8%B7%B3%E8%BD%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535526/%E5%8F%B3%E9%94%AE%E5%8F%8C%E5%87%BB%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%20%28%E5%8F%AF%E9%85%8D%E7%BD%AE%E8%B7%B3%E8%BD%AC%29.meta.js
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2024 bin7890 // 版权年份会根据实际发布年份而定

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // --- START: 右键双击检测逻辑变量 ---
    let lastRightClickTime = 0;
    let lastRightClickTarget = null;
    const DOUBLE_CLICK_INTERVAL = 500; // 右键双击的最大时间间隔 (毫秒)
    // --- END: 右键双击检测逻辑变量 ---

    // 用于存储设置的键名
    const ACTIVATE_NEW_TAB_KEY = 'dblClickOpenActivateNewTab';

    // 获取当前设置：新标签页是否应该激活
    function shouldActivateNewTab() {
        return GM_getValue(ACTIVATE_NEW_TAB_KEY, false); // 默认值为 false (后台打开，不跳转)
    }

    // 更新菜单命令的文本
    function updateMenuCommandText() {
        const currentSetting = shouldActivateNewTab();
        GM_registerMenuCommand(
            `切换：新标签页是否立即激活 (当前: ${currentSetting ? '是 - 立即跳转' : '否 - 后台打开'})`,
            toggleActivateSetting
        );
    }

    // 切换设置的函数
    function toggleActivateSetting() {
        const currentValue = shouldActivateNewTab();
        GM_setValue(ACTIVATE_NEW_TAB_KEY, !currentValue);
        alert(`设置已更改：新标签页打开后将${!currentValue ? '立即跳转 (激活)' : '在后台打开 (不激活)'}。\n刷新页面后菜单文本会更新。`);
        updateMenuCommandText();
    }

    // 初始化时注册菜单命令
    updateMenuCommandText();

    document.addEventListener('contextmenu', function(event) {
        // event.button === 2 代表鼠标右键
        if (event.button !== 2) {
            return; // 如果不是右键点击，则忽略
        }

        const currentTime = new Date().getTime();
        let isRightDoubleClick = false;

        // 判断是否在有效时间间隔内且点击的是同一目标元素
        if (currentTime - lastRightClickTime < DOUBLE_CLICK_INTERVAL && event.target === lastRightClickTarget) {
            isRightDoubleClick = true;
            // 重置计时，以便下一次正常的双击检测
            lastRightClickTime = 0;
            lastRightClickTarget = null;
        } else {
            // 如果不是双击，则记录当前点击为下一次判断的“第一次点击”
            lastRightClickTime = currentTime;
            lastRightClickTarget = event.target;
        }

        if (isRightDoubleClick) {
            // 只要检测到是右键双击，就阻止默认的右键菜单
            event.preventDefault();
            event.stopPropagation();

            let clickedElement = event.target;
            let linkElement = null;

            // 向上遍历DOM树，最多检查5层父元素，查找最近的<a>标签
            for (let i = 0; i < 5 && clickedElement; i++) {
                if (clickedElement.tagName === 'A' && clickedElement.href) {
                    linkElement = clickedElement;
                    break;
                }
                clickedElement = clickedElement.parentElement;
            }

            if (linkElement) {
                // 如果这个右键双击确实发生在链接上，则打开链接
                const activate = shouldActivateNewTab();
                GM_openInTab(linkElement.href, { active: activate, insert: true });
            }
            // 如果右键双击但不是链接，菜单已被阻止，不执行其他操作。
        }
        // 如果是单击右键 (isRightDoubleClick 为 false)，则不执行 event.preventDefault()，
        // 允许默认的右键菜单弹出。
    }, true); // 使用捕获阶段

})();
