// ==UserScript==
// @name         自动勾选登录协议
// @namespace    http://tampermonkey.net/
// @version      2025-03-11
// @description  自动勾选登录协议框。不定时更新
// @author       Winston

// @match        https://user.mihoyo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mihoyo.com

// @match        http://jira.cmbi.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cmbi.online
// @match        http://wiki.cmbi.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cmbi.online


// @grant        none
// @license MIT
// @require https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @downloadURL https://update.greasyfork.org/scripts/529153/%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E7%99%BB%E5%BD%95%E5%8D%8F%E8%AE%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/529153/%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E7%99%BB%E5%BD%95%E5%8D%8F%E8%AE%AE.meta.js
// ==/UserScript==

(function() {
    elmGetter.get('.mhy-checkbox').then(box => {box.click();});//米哈游通行证

    elmGetter.get('#login-form-remember-me').then(box => {box.click();});//jira
    elmGetter.get('#gadget-0-chrome').then(box => {box.click();});//jira
    elmGetter.get('#os_cookie').then(box => {box.click();});//wiki


})();