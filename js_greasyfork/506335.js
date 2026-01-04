// ==UserScript==
// @name         兰州大学校园网自动登录脚本
// @namespace    http://tampermonkey.net/
// @version      2024-09-02
// @description  兰州大学校园网自动登录
// @author       Wxliu
// @match        http://10.10.0.166/srun_portal_pc?ac_id=*
// @icon         http://10.10.0.166/static/lzu/images/logo.png
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506335/%E5%85%B0%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/506335/%E5%85%B0%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const username=""
    const password=""
    //延时900ms开始登录，防止加载不完全
    setTimeout(function() {
        //点击账号登录
        document.querySelector("body > div.login-panel.active > div.tab-container > div:nth-child(2)").click()
        //开启记住账号
        document.querySelector("#remember").checked=true
        //选择elearning
        document.querySelector("#domain").selectedIndex=1
        //输入账号
        document.querySelector("#username").value=username
        //输入密码
        document.querySelector("#password").value=password
        //点击登录
        document.querySelector("#login").click()
    }, 900);
})();