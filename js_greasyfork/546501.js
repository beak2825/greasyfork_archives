// ==UserScript==
// @name         H5魔塔强制移动端UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制H5魔塔使用移动端UI
// @author       Douyaoyao
// @match        https://h5mota.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546501/H5%E9%AD%94%E5%A1%94%E5%BC%BA%E5%88%B6%E7%A7%BB%E5%8A%A8%E7%AB%AFUI.user.js
// @updateURL https://update.greasyfork.org/scripts/546501/H5%E9%AD%94%E5%A1%94%E5%BC%BA%E5%88%B6%E7%A7%BB%E5%8A%A8%E7%AB%AFUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听 core 加载
    const checkCore = setInterval(() => {
        if (window.core) {
            clearInterval(checkCore);
            // 强制设置为移动端 UI
            Object.defineProperty(core.domStyle, 'isVertical', {
                get: () => true,
                set: (v) => { /* 忽略设置 */ }
            });
            // 触发一次 resize 以应用移动端布局
            window.dispatchEvent(new Event('resize'));
        }
    }, 100);
})();