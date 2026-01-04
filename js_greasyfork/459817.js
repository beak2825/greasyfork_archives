// ==UserScript==
// @name         禁止保存的 CSDN 存档自动跳转首页
// @namespace    https://ivanli.cc
// @version      0.1
// @description  禁止保存的 CSDN 存档自动跳转首页。比如本地存档、Shiori 存档。
// @author       Ivan Li
// @match        *://*.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459817/%E7%A6%81%E6%AD%A2%E4%BF%9D%E5%AD%98%E7%9A%84%20CSDN%20%E5%AD%98%E6%A1%A3%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/459817/%E7%A6%81%E6%AD%A2%E4%BF%9D%E5%AD%98%E7%9A%84%20CSDN%20%E5%AD%98%E6%A1%A3%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elems = document.querySelectorAll("img[onerror^=setTimeout]");
    elems.forEach(el => {el.onerror=() => console.debug("Block jumping to home page", el);});
})();