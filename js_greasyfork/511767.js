// ==UserScript==
// @name         Cover Zhihu Homepage
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Cover content starting from the header element on Zhihu with a color overlay based on detected header
// @author       Snowballl11
// @license      MIT
// @match        *://www.zhihu.com/
// @match        *://www.zhihu.com/?theme=dark
// @match        *://www.zhihu.com/?theme=light
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511767/Cover%20Zhihu%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/511767/Cover%20Zhihu%20Homepage.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    let targetDiv = null;
    let overlayBackgroundColor = '';

    // Try to find the header element associated with dark theme
    const darkThemeHeader = document.querySelector('.css-vuzuz7.AppHeader.Sticky');
    if (darkThemeHeader) {
        targetDiv = darkThemeHeader;
        overlayBackgroundColor = 'black'; // Use black overlay for this header
    } else {
        // If dark theme header not found, try to find the header associated with light theme
        const lightThemeHeader = document.querySelector('.css-17rnw55.AppHeader.Sticky');
        if (lightThemeHeader) {
            targetDiv = lightThemeHeader;
            overlayBackgroundColor = 'white'; // Use white overlay for this header
        }
    }

    // 如果元素存在，则在其下方添加一个覆盖层
    if (targetDiv) {
        // 获取目标元素的位置信息
        const targetDivRect = targetDiv.getBoundingClientRect();

        // 创建一个新的 div 元素作为覆盖层
        const overlay = document.createElement('div');

        // 设置覆盖层样式
        overlay.style.position = 'fixed';  // 固定定位，确保覆盖层不随滚动移动
        overlay.style.top = `${targetDivRect.bottom}px`;  // 从目标元素的底部开始
        overlay.style.left = '0';          // 左侧对齐
        overlay.style.width = '100%';      // 占满整个页面宽度
        overlay.style.height = '100%';     // 高度设置为100% (of viewport initially), scroll handler will adjust
        overlay.style.zIndex = '9999';     // 确保覆盖层在顶层显示
        overlay.style.pointerEvents = 'none';  // 不影响页面下方的交互操作
        overlay.style.backgroundColor = overlayBackgroundColor; // Set color based on detected header

        // 将覆盖层添加到页面中
        document.body.appendChild(overlay);

        // 当页面滚动时，确保覆盖层始终覆盖所有内容
        window.addEventListener('scroll', function() {
            // 动态调整覆盖层的高度，使其能够覆盖到页面底部
            overlay.style.height = `${document.documentElement.scrollHeight}px`;
        });
        // Also adjust on resize, in case content changes without scrolling
        window.addEventListener('resize', function() {
            overlay.style.height = `${document.documentElement.scrollHeight}px`;
        });
    } else {
        // Optional: Log a warning if neither target element is found.
        console.warn('Zhihu Cover Script: Target header element not found. Overlay not applied. Searched for ".css-vuzuz7.AppHeader.Sticky" and ".css-17rnw55.AppHeader.Sticky".');
    }
});

/*
MIT License

Copyright (c) [2024] [Snowballl11]

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
