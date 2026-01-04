// ==UserScript==
// @name         讯飞星火助手
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  讯飞星火助手工具
// @author       kj
// @match        https://xinghuo.xfyun.cn/desk
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xfyun.cn
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465651/%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%AB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/465651/%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%AB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const generateUUID = () => {
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); // use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    let styleId = generateUUID();
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.setAttribute('id', styleId);
        styleEl.innerHTML = `div#watermark-wrapper{display:none!important;transform: translateX(100000000px);overflow: hidden;}`;
        document.body.appendChild(styleEl);
    }
})();