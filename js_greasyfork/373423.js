// ==UserScript==
// @name         Driver Mode for REIMU.NET
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  默认开启灵梦御所老司机模式
// @author       HoLiX
// @match        https://blog.reimu.net/*
// @match        https://blog.reimu.net/archives/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/373423/Driver%20Mode%20for%20REIMUNET.user.js
// @updateURL https://update.greasyfork.org/scripts/373423/Driver%20Mode%20for%20REIMUNET.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 登录御所
    let inputPass = document.querySelector("#password_protected_pass");
    if (inputPass) {
        inputPass.setAttribute("type", "text");
    }
    // 显示老司机结界内容
    setTimeout(() => {
        [].forEach.call(document.querySelectorAll("pre"), element => {
            element.setAttribute("style", "display: block;");
        })}, 3000);
    // 处理折叠内容
    [].forEach.call(document.querySelectorAll("h3.toggle a"), element => {
        element.setAttribute("style", "background-color: #FFFFFF!important")
    });
})();