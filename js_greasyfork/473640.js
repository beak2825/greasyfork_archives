// ==UserScript==
// @name         生成二维码图标
// @author       chentao1006
// @namespace    https://chentao1006.com
// @version      1.0.2
// @description  在页面左下角添加一个图标，点击后生成当前页面地址二维码
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473640/%E7%94%9F%E6%88%90%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/473640/%E7%94%9F%E6%88%90%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==
(function() {
    if (window.self !== window.top) {
        return;
    }
    'use strict';
    // 添加图标样式
    GM_addStyle(`
        #qrCodeIcon {
            position: fixed;
            left: 10px;
            bottom: 10px;
            cursor: pointer;
            z-index: 99999;
            font-size: 12px;
        }
    `);
    // 创建图标元素
    var qrCodeIcon = document.createElement('div');
    qrCodeIcon.id = 'qrCodeIcon';
    qrCodeIcon.innerHTML = '🔗';
    // 添加图标点击事件
    qrCodeIcon.addEventListener('click', function() {
        // 获取当前页面地址
        var currentPageUrl = window.location.href;
        // 创建二维码图片元素
        var qrCodeImg = document.createElement('img');
        qrCodeImg.src = 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(currentPageUrl);
        qrCodeImg.style.position = 'fixed';
        qrCodeImg.style.bottom = '10px';
        qrCodeImg.style.left = '10px';
        qrCodeImg.style.zIndex = '9999';
        qrCodeImg.addEventListener('click', function() {
            document.body.removeChild(qrCodeImg);
        })
        // 添加二维码图片到页面
        document.body.appendChild(qrCodeImg);
    });
    // 添加图标到页面
    document.body.appendChild(qrCodeIcon);
})();
