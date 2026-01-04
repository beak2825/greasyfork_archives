// ==UserScript==
// @name         JLPT看答案的按钮快捷键
// @namespace    http://tampermonkey.net/
// @version      2025-06-20
// @description  为 JLPT 页面添加按钮快捷键，可一键查看答案和关闭弹窗
// @author       Ramen Curator
// @match        https://dethitiengnhat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dethitiengnhat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540301/JLPT%E7%9C%8B%E7%AD%94%E6%A1%88%E7%9A%84%E6%8C%89%E9%92%AE%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/540301/JLPT%E7%9C%8B%E7%AD%94%E6%A1%88%E7%9A%84%E6%8C%89%E9%92%AE%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(e) {
        if (e.key === '1') {
            Saiten();       // 调用网站全局函数
            modalClose();
            e.preventDefault();
        }
        if (e.key === '2') {
            Saiten();
            e.preventDefault();
        }
        // 关掉弹窗
        if (e.key === '3') {
            modalClose();
            e.preventDefault();
        }

    });
})();