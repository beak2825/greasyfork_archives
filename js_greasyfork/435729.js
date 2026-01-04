// ==UserScript==
// @name         菜鸟的自制背景护眼色脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  菜鸟的初次尝试哈！（所有网页均适用，可能与其它修改页面背景色脚本冲突，作者概不负责！任性.gif）
// @author       Crazy_AI
// @match        *://*/*
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435729/%E8%8F%9C%E9%B8%9F%E7%9A%84%E8%87%AA%E5%88%B6%E8%83%8C%E6%99%AF%E6%8A%A4%E7%9C%BC%E8%89%B2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/435729/%E8%8F%9C%E9%B8%9F%E7%9A%84%E8%87%AA%E5%88%B6%E8%83%8C%E6%99%AF%E6%8A%A4%E7%9C%BC%E8%89%B2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const iterator_element = document.querySelectorAll('*')

    iterator_element.forEach(item => {
        item.style.backgroundColor = '#C7EDCC'
    })
})()