// ==UserScript==
// @name         reduced feishu document watermark appearance 淡化飞书文档水印
// @namespace    http://tampermonkey.net/
// @version      2024-02-22 1
// @description  让飞书文档的水印看上去不要明显到影响阅读，通过右下角 checkbox 开启。
// @author       ha
// @match        https://*.larkoffice.com/*
// @match        https://*.feishu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=larkoffice.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487926/reduced%20feishu%20document%20watermark%20appearance%20%E6%B7%A1%E5%8C%96%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/487926/reduced%20feishu%20document%20watermark%20appearance%20%E6%B7%A1%E5%8C%96%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = "controlScript";
    checkbox.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 100px;
        zIndex: 1000000;
    `;

    document.body.appendChild(checkbox);

    checkbox.addEventListener('change', function() {
        if(this.checked) {
            style.innerHTML = `
                #mainBox {
                    z-index: 99999;
                }
            `;
            document.head.appendChild(style);
        } else {
            style.innerHTML = "";
        }
    });

})();