// ==UserScript==
// @name         鼠标美化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  把鼠标变成当前网站的图标,不影响点击。达到美化作用，同时可以提醒用户当前页面处于的网站。
// @author       五等份的商鞅
// @match        *
// @match        *://*
// @match        *://*/*
// @match        *://*/*/*
// @match        *://*/*/*/*
// @match        *://*/*/*/*/*
// @match        *://*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*
// @icon         https://cas.pxc.jx.cn/lyuapServer/favicon.ico
// @grant        none
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/453972/%E9%BC%A0%E6%A0%87%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/453972/%E9%BC%A0%E6%A0%87%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
(function(){
    let all=document.querySelectorAll('*');
    for (let index = 0; index < all.length; index++) {
        all[index].style.cursor='url('+document.URL.split('/')[0]+'//'+document.URL.split('/')[2]+'/favicon.ico),auto'
    }
}())