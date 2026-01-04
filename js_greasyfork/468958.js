// ==UserScript==
// @name         禁用长按屏幕跳出菜单
// @namespace    your-namespace
// @version      1.0
// @description  跳出菜单
// @match        *://www.youtube.com/*
// @match        *://hanime1.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468958/%E7%A6%81%E7%94%A8%E9%95%BF%E6%8C%89%E5%B1%8F%E5%B9%95%E8%B7%B3%E5%87%BA%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/468958/%E7%A6%81%E7%94%A8%E9%95%BF%E6%8C%89%E5%B1%8F%E5%B9%95%E8%B7%B3%E5%87%BA%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

window.addEventListener('contextmenu', function(event) {
    event.preventDefault();
}, true);