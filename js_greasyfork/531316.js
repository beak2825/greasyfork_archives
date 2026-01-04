// ==UserScript==
// @name               嗨皮漫畫手機版網頁連結轉跳桌面版
// @name:zh-CN         嗨皮漫画手机版网页连结转跳桌面版
// @version            1.0
// @description        嗨皮漫畫 手機版網頁連結轉跳桌面版
// @description:zh-CN  嗨皮漫画 手机版网页连结转跳桌面版
// @author             AlexLI(tkp206093)
// @namespace          https://greasyfork.org/users/150638-tkp206093
// @homepageURL        https://greasyfork.org/scripts/531316
// @supportURL         https://greasyfork.org/scripts/531316/feedback
// @match              *://m.happymh.com/*
// @icon               https://hihimanga.com/imgs/favico.ico
// @license            MIT
// @run-at             document-start
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/531316/%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E9%A0%81%E9%80%A3%E7%B5%90%E8%BD%89%E8%B7%B3%E6%A1%8C%E9%9D%A2%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531316/%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E9%A0%81%E9%80%A3%E7%B5%90%E8%BD%89%E8%B7%B3%E6%A1%8C%E9%9D%A2%E7%89%88.meta.js
// ==/UserScript==
(function () {
    'use strict';
    location.href = location.href.replace(/m\.happymh\.com/g, 'hihimanga.com');
})();