// ==UserScript==
// @name         ant-design-vue 官网固定头部
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  ant-design-vue 官网header搜索框在页面滚动后就看不见了, 该脚本将header固定, 方便搜索组件
// @author       ZJoker
// @match        https://1x.antdv.com/*
// @match        https://www.antdv.com/components/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=antdv.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461154/ant-design-vue%20%E5%AE%98%E7%BD%91%E5%9B%BA%E5%AE%9A%E5%A4%B4%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461154/ant-design-vue%20%E5%AE%98%E7%BD%91%E5%9B%BA%E5%AE%9A%E5%A4%B4%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {
        const headerEl = document.querySelector('#header')
        const mainEl = document.querySelector('.main-wrapper')
        if (headerEl) {
            headerEl.style.position = 'fixed'
            headerEl.style.top = 0
            headerEl.style.width = '100%'
        }
        if (mainEl) {
            mainEl.style.padding = '80px 0 0'
        }
    }
    // Your code here...
})();