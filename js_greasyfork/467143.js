// ==UserScript==
// @name         Tower工作区全屏
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动将tower网站的工作取全屏铺满
// @author       witt
// @match        https://tower.im/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tower.im
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467143/Tower%E5%B7%A5%E4%BD%9C%E5%8C%BA%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/467143/Tower%E5%B7%A5%E4%BD%9C%E5%8C%BA%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改最底下，团队ID 的padding值
    const footerElement = document.querySelector('.footer.light');
    footerElement.style.padding = '25px';

    // 查找具有 class="workspace" 的 div 元素
    var workspaceDiv = document.querySelector('div.workspace');
    if (workspaceDiv) {
        // 强制设置 workspace div 的宽度为 100%
        // fix: 横向滚动条
        workspaceDiv.style.width = '99.84%';
    }
})();