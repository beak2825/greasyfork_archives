// ==UserScript==
// @name         哔哩哔哩(小)竖屏布局优化
// @namespace    http://tampermonkey.net/
// @version      24.10.1
// @description  用于优化小屏幕设备（尤其是1080P屏幕竖过来这种）上的竖屏布局
// @author       You
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509685/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28%E5%B0%8F%29%E7%AB%96%E5%B1%8F%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/509685/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28%E5%B0%8F%29%E7%AB%96%E5%B1%8F%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的style元素
    var style = document.createElement('style');
    style.setAttribute('tag', 'ctu')
    // 设置style的内容，隐藏具有特定类名的元素
    style.innerHTML = '.recommended-swipe { display: none !important; }';
    style.innerHTML = style.innerHTML + `.recommended-container_floor-aside .container>*{ margin-top: 0px !important; }`;
    style.innerHTML = style.innerHTML + `body { min-width: 0px !important; }`;
    style.innerHTML = style.innerHTML + `main { max-width: calc(100% - 50px) !important; }`;

    // 将style元素添加到head中
    document.head.appendChild(style);

})();