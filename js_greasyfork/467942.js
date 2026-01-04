// ==UserScript==
// @name         pgyer 宽度100%
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将pgyer网站的宽度改为100%，文字不变成...
// @author       witt
// @match        https://www.pgyer.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pgyer.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467942/pgyer%20%E5%AE%BD%E5%BA%A6100%25.user.js
// @updateURL https://update.greasyfork.org/scripts/467942/pgyer%20%E5%AE%BD%E5%BA%A6100%25.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找具有 class="workspace" 的 div 元素
    var workspaceDiv = document.querySelector('div.container');
    if (workspaceDiv) {
        // 强制设置 workspace div 的宽度为 100%
        workspaceDiv.style.width = '100%';
    }

    const qrcodeImg = document.querySelector('img.qrcode');
    if (qrcodeImg) {
        qrcodeImg.style.width = '200px';
        qrcodeImg.style.height = '200px';
        console.log('reset qrcode<img> weihgt , height .');
    }

})();