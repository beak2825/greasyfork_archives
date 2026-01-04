// ==UserScript==
// @name         gdufe校园网自动登录
// @namespace    qwquqwq
// @version      0.4
// @description  这是一条描述
// @author       qwquqwq
// @match        http://100.64.13.17/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=13.17
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466554/gdufe%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/466554/gdufe%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
 
// 设置账号和密码
let account = "";
let password = "";
 
window.onload = function() {
    'use strict';
    // 设置为不弹窗?
    // 输入账号密码，然后点击登录
    let $account = document.getElementsByName('DDDDD')[1];
    let $password = document.getElementsByName('upass')[1];
    let $login = document.getElementsByName('0MKKey')[1] ;
    if ($account === null || $password === null || $login === null) return;
    $account.value = account;
    $password.value = password;
    $login.click();
};