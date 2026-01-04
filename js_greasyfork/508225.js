// ==UserScript==
// @name           AOSP Xref 字体美化
// @name:en        AOSP Xref Font Changer
// @namespace      http://tampermonkey.net/
// @version        0.2
// @description    美化 aospxref.com 字体与大小
// @match          http://aospxref.com/*
// @match          https://aospxref.com/*
// @grant          none
// @author         二次蓝
// @description:en Change font and size for aospxref.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508225/AOSP%20Xref%20%E5%AD%97%E4%BD%93%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/508225/AOSP%20Xref%20%E5%AD%97%E4%BD%93%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.type = 'text/css';

    style.innerHTML = `
        pre, code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
        }
    `;
    document.head.appendChild(style);

    /*
    var sizeButton = document.createElement('button');
    sizeButton.textContent = 'Toggle Font Size';
    sizeButton.style.position = 'fixed';
    sizeButton.style.top = '10px';
    sizeButton.style.right = '10px';
    sizeButton.style.zIndex = '9999';

    sizeButton.addEventListener('click', function() {
        console.log("TODO");
        var currentSize = parseInt(getComputedStyle(document.body).fontSize);
        var newSize = currentSize === 14 ? 16 : 14;
        document.body.style.fontSize = newSize + 'px';
        document.querySelector('div#src pre').style.fontSize = newSize + 'px';
    });

    document.body.appendChild(sizeButton);*/
})();