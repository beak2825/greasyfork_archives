// ==UserScript==
// @name         ixkw去广告
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  去除星空影视（https://ixkw.cc/）两侧及右下角广告
// @author       You
// @match        https://ixkw.cc/*
// @match        https://ixkw.top/*
// @match        https://ixkw.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ixkw.cc
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520563/ixkw%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/520563/ixkw%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 动态注入CSS, 优先隐藏目标元素
    const style = document.createElement('style');
    style.textContent = `
    divz, [id$="left"], [id$="right"], #d_pnftkd, #d_xlwghj, [id$="right"] + div, #richdata + div, #layui-layer-move + div {
    display: none !important;
    }
    `;
    document.head.appendChild(style);

    // 精确处理：等待页面加载后确保隐藏
    window.addEventListener('load', function() {
        const divz = document.getElementsByTagName('divz');
        Array.from(divz).forEach(ele => {
            ele.style.display = 'none';
        })
        const left = document.querySelectorAll('[id$=left]');
        left.forEach(ele => {
            ele.style.display = 'none';
        })
        const right = document.querySelectorAll('[id$=right]');
        right.forEach(ele => {
            ele.style.display = 'none';
        })
        const rightcorner1 = document.querySelectorAll('[id$="right"] + div');
        rightcorner1.forEach(ele => {
            ele.style.display = 'none';
        })
        const rightcorner2 = document.querySelectorAll('#richdata + div');
        rightcorner2.forEach(ele => {
            ele.style.display = 'none';
        })
        const rightcorner3 = document.querySelectorAll('#layui-layer-move + div');
        rightcorner3.forEach(ele => {
            ele.style.display = 'none';
        })
    })
})();