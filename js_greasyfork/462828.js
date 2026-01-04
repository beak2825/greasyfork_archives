// ==UserScript==
// @name         CSDN,简书，掘金,gitee,跳转脚本
// @description  链接地址直接跳转跳转到目标网站
// @namespace    https://www.example.com/
// @version      1.1
// @match        https://link.csdn.net/*
// @match        https://www.jianshu.com/go-wild*
// @match        https://link.juejin.cn/*
// @match        https://gitee.com/link*

// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462828/CSDN%2C%E7%AE%80%E4%B9%A6%EF%BC%8C%E6%8E%98%E9%87%91%2Cgitee%2C%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/462828/CSDN%2C%E7%AE%80%E4%B9%A6%EF%BC%8C%E6%8E%98%E9%87%91%2Cgitee%2C%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const searchParams = new URLSearchParams(window.location.search);
    const target = searchParams.get('target');
    if (target !== null) {
        window.location.href = decodeURIComponent(target);
    }
    const url = searchParams.get('url');
    if (url !== null) {
        window.location.href = decodeURIComponent(url);
    }
})();
