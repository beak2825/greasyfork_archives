// ==UserScript==
// @name         江苏师范大学科文学院校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  仅仅用于江苏师范大学科文学院校园网的自动登陆认证，配置好脚本后，当打开认证页面时，就会自动填写账号及密码，并且完成认证。
// @author       881
// @match        *://*.10.110.6.251/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431292/%E6%B1%9F%E8%8B%8F%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E7%A7%91%E6%96%87%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/431292/%E6%B1%9F%E8%8B%8F%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E7%A7%91%E6%96%87%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload=function()
    {
        window.document.querySelector('[placeholder=账号]').value="******";//这里填账号
        window.document.querySelector('[placeholder=密码]').value="******";//这里填密码
        window.document.querySelector('[name=ISP_select]').value="@telecom";//这里填运营商 默认电信  移动：@cmcc     联通：@unicom    电信：@telecom
        window.document.querySelector('[value=登录]').click()
    }
})();
//在桌面右键--新建--快捷方式--在“创建快捷方式”窗口中输入 http://10.110.6.251 -- 然后单击下一步即可创建一个网页快捷方式。
//将创建好的快捷方式放入 C:\Users\【这里换成你自己的用户名】\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup 文件夹中即可开机自启.
