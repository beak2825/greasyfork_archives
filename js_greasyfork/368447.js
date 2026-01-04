// ==UserScript==
// @name         Django 文档中文跳转助手
// @version      1.0
// @description  当您访问非中文的 Django 的文档页面时，自动跳转至简体中文页面。
// @author       SR2k <seeran#outlook.com>
// @match        https://docs.djangoproject.com/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/187625
// @downloadURL https://update.greasyfork.org/scripts/368447/Django%20%E6%96%87%E6%A1%A3%E4%B8%AD%E6%96%87%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/368447/Django%20%E6%96%87%E6%A1%A3%E4%B8%AD%E6%96%87%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前 URL
    var url = window.location.pathname

    // 如果语言代码不是 zh-hans 则跳转至 zh-hans
    if (!/^\/zh-hans/.test(url)) {
        document.title = '正在跳转中文版…'
        window.location.href = window.location.href.replace(/https?:\/\/docs\.djangoproject\.com\/.[^/]+\//, 'https://docs.djangoproject.com/zh-hans/')
    }
})();