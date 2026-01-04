// ==UserScript==
// @name         他奶奶的英特尔
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  显示牙膏厂的名字
// @author       You
// @match        https://www.intel.cn/*
// @match        https://www.intel.com/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=intel.cn
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/442151/%E4%BB%96%E5%A5%B6%E5%A5%B6%E7%9A%84%E8%8B%B1%E7%89%B9%E5%B0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/442151/%E4%BB%96%E5%A5%B6%E5%A5%B6%E7%9A%84%E8%8B%B1%E7%89%B9%E5%B0%94.meta.js
// ==/UserScript==

(function() {

    'use strict';

    //document.body.replaceAll('<h1 class="h1">英特尔® 驱动程序和支持助理</h1>'，"<h1 class="h1">牙膏厂® 驱动程序和支持助理</h1>")
    document.body.innerHTML = document.body.innerHTML.replace(/英特尔/g, '牙膏厂')
    document.body.innerHTML = document.body.innerHTML.replace(/Intel/g, 'Toothpaste Factory')
    document.body.innerHTML = document.body.innerHTML.replace(/处理器/g, '牙膏')
    document.body.innerHTML = document.body.innerHTML.replace(/Processor/g, 'Toothpaste')
    document.head.innerHTML = document.head.innerHTML.replace(/英特尔/g, '牙膏厂')
    document.head.innerHTML = document.head.innerHTML.replace(/英特尔®/g, '牙膏厂')
    document.body.innerHTML = document.body.innerHTML.replace(/英特尔/g, '牙膏厂')
    document.head.innerHTML = document.head.innerHTML.replace(/英特尔/g, '牙膏厂')
    document.head.innerHTML = document.head.innerHTML.replace(/英特尔®/g, '牙膏厂')
    document.body.innerHTML = document.body.innerHTML.replace(/英特尔/g, '牙膏厂')
    document.head.innerHTML = document.head.innerHTML.replace(/英特尔/g, '牙膏厂')
    document.head.innerHTML = document.head.innerHTML.replace(/英特尔®/g, '牙膏厂')
    document.body.innerHTML = document.body.innerHTML.replace(/英特尔/g, '牙膏厂')
    document.head.innerHTML = document.head.innerHTML.replace(/英特尔/g, '牙膏厂')
    document.head.innerHTML = document.head.innerHTML.replace(/英特尔®/g, '牙膏厂')
    // Your code here...
})();