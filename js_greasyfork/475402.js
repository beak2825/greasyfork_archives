// ==UserScript==
// @name         水木社区web转APP 测试版
// @namespace    https://www.newsmth.top/
// @version      1.0.1
// @description  将水木pc版转换为app效果
// @author       tiewuzi
// @match        https://www.newsmth.net/nForum/*
// @match        https://static.mysmth.net/*
// @match        https://static.newsmth.net/*
// @license      MIT
// @run-at       document-start
// @icon         https://www.newsmth.top/favicon.ico
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/475402/%E6%B0%B4%E6%9C%A8%E7%A4%BE%E5%8C%BAweb%E8%BD%ACAPP%20%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/475402/%E6%B0%B4%E6%9C%A8%E7%A4%BE%E5%8C%BAweb%E8%BD%ACAPP%20%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    if (window.newsmth_to_app) {
        return;
    } else {
        window.newsmth_to_app = true;
    }
    let sc = document.createElement('script');
    sc.charset = 'UTF-8';
    sc.src = 'https://www.newsmth.top/js/smth_to_app.iife.js'
    sc.type = 'text/javascript';
    document.querySelector('head').appendChild(sc);
})();