// ==UserScript==
// @name         强制解除 12315 粘贴限制
// @namespace    https://12315.cn/
// @version      1.1
// @description  解除 www.12315.cn 投诉页面输入框禁止粘贴限制，支持 Vue 封装组件，自动启用。
// @author       WithYW
// @match        *://www.12315.cn/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540686/%E5%BC%BA%E5%88%B6%E8%A7%A3%E9%99%A4%2012315%20%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/540686/%E5%BC%BA%E5%88%B6%E8%A7%A3%E9%99%A4%2012315%20%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const unlock = () => {
        document.querySelectorAll('input, textarea').forEach(el => {
            ['onpaste', 'oncopy', 'oncut', 'oncontextmenu'].forEach(evt => {
                el[evt] = null;
                el.removeAttribute(evt);
            });
            ['paste', 'copy', 'cut', 'contextmenu'].forEach(evt => {
                el.addEventListener(evt, e => e.stopImmediatePropagation(), true);
            });
        });
    };
    window.addEventListener('load', unlock);
    const observer = new MutationObserver(unlock);
    observer.observe(document.body, { childList: true, subtree: true });
})();