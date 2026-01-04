// ==UserScript==
// @name         哈工程古董链接替换
// @namespace    xyenon.bid
// @version      0.2.1
// @description  替换哈工程官网只能用 IE 打开的链接
// @author       XYenon
// @match        *://*.hrbeu.edu.cn/*
// @match        *://*.heu.edu.cn/*
// @match        *://*.heu.cn/*
// @match        *://*.hrbeu.cn/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @supportURL   https://greasyfork.org/zh-CN/scripts/401521-%E5%93%88%E5%B7%A5%E7%A8%8B%E5%8F%A4%E8%91%A3%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2/feedback
// @downloadURL https://update.greasyfork.org/scripts/401521/%E5%93%88%E5%B7%A5%E7%A8%8B%E5%8F%A4%E8%91%A3%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/401521/%E5%93%88%E5%B7%A5%E7%A8%8B%E5%8F%A4%E8%91%A3%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const a_elements = document.getElementsByTagName('a');
    for (const index in a_elements) {
        const a = a_elements[index];
        if (/javascript:JsMod\('.*?',\d*?,\d*?\)/.test(a.href)) {
            a.href = a.href.split("'")[1];
            a.target = '_blank';
        }
    }
})();