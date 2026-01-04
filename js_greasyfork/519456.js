// ==UserScript==
// @name         zlibrary盗版链接警告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  检查并提示访问盗版链接
// @author       星悦夕
// @icon         https://www.google.com/s2/favicons?sz=64&domain=z-lib.gs
// @match        *://*/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/519456/zlibrary%E7%9B%97%E7%89%88%E9%93%BE%E6%8E%A5%E8%AD%A6%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/519456/zlibrary%E7%9B%97%E7%89%88%E9%93%BE%E6%8E%A5%E8%AD%A6%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const fakeLinksPatterns = [
        ' *://zlibrary.to/*',
        '*://z-lib.io/*',
        '*://z-lib.id/*',
        '*://z-lib.is/*'
    ];


    const currentUrl = window.location.href;


    if (fakeLinksPatterns.some(pattern => matchPattern(currentUrl, pattern))) {
        // 弹出警告框
        showAlert();
    }


    function matchPattern(url, pattern) {

        const regex = new RegExp('^' + pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            + '$');
        return regex.test(url);
    }

    function showAlert() {

        const alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.top = '50%';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translate(-50%, -50%)';
        alertBox.style.padding = '30px';
        alertBox.style.background = 'linear-gradient(145deg, #f8d7da, #f1b0b7)';
        alertBox.style.color = '#721c24';
        alertBox.style.border = '1px solid #f5c6cb';
        alertBox.style.borderRadius = '15px';
        alertBox.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        alertBox.style.fontFamily = 'Arial, sans-serif';
        alertBox.style.fontSize = '16px';
        alertBox.style.zIndex = '9999';
        alertBox.style.maxWidth = '400px';
        alertBox.style.textAlign = 'center';
        alertBox.style.animation = 'fadeIn 0.5s ease-in-out';


        const title = document.createElement('h3');
        title.textContent = '警告！';
        title.style.marginBottom = '15px';
        title.style.fontSize = '24px';
        title.style.fontWeight = 'bold';


        const message = document.createElement('p');
        message.textContent = '你正在访问的是假冒地址，请尽快退出，避免钱财损失！';
        message.style.marginBottom = '20px';
        message.style.lineHeight = '1.5';


        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.padding = '12px 20px';
        closeButton.style.backgroundColor = '#721c24';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '25px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '18px';
        closeButton.style.transition = 'background-color 0.3s ease';

        closeButton.onmouseover = function() {
            closeButton.style.backgroundColor = '#f44336';
        };

        closeButton.onmouseout = function() {
            closeButton.style.backgroundColor = '#721c24';
        };


        closeButton.onclick = function() {
            alertBox.style.display = 'none'; // 关闭弹窗
        };

        alertBox.appendChild(title);
        alertBox.appendChild(message);
        alertBox.appendChild(closeButton);


        document.body.appendChild(alertBox);
    }
})();
