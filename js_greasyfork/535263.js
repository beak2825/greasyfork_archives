// ==UserScript==
// @name         抖音直播后台依旧加载弹幕-摸鱼奎恩 | Douyin Live
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  让直播间页面在后台时依旧加载弹幕
// @author       xero127
// @match        *://live.douyin.com/*
// @icon         https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535263/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E5%90%8E%E5%8F%B0%E4%BE%9D%E6%97%A7%E5%8A%A0%E8%BD%BD%E5%BC%B9%E5%B9%95-%E6%91%B8%E9%B1%BC%E5%A5%8E%E6%81%A9%20%7C%20Douyin%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/535263/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E5%90%8E%E5%8F%B0%E4%BE%9D%E6%97%A7%E5%8A%A0%E8%BD%BD%E5%BC%B9%E5%B9%95-%E6%91%B8%E9%B1%BC%E5%A5%8E%E6%81%A9%20%7C%20Douyin%20Live.meta.js
// ==/UserScript==

(function() {
    'use strict'; //严格模式
    Object.defineProperty(document, 'hidden', {
        value: false,
        writable: false, // 阻止页面修改
        configurable: false // 不可配置
    });
    Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        writable: false, // 阻止页面修改
        configurable: false // 不可配置
    });
    window.requestAnimationFrame = (callback) => setTimeout(() => callback(performance.now()), 16); // 1000/16≈60fps
})();