// ==UserScript==
// @name         去除贴吧登陆
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       copymaker
// @match        https://tieba.baidu.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419127/%E5%8E%BB%E9%99%A4%E8%B4%B4%E5%90%A7%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/419127/%E5%8E%BB%E9%99%A4%E8%B4%B4%E5%90%A7%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==
var del_element;
(function() {
    'use strict';
   // Your code  here..
    // 1.读取登陆界面和灰质背景的父元素
    del_element=document.querySelector("#tiebaCustomPassLogin");
    // 2.删除
    del_element.parentNode.removeChild(del_element);
})();