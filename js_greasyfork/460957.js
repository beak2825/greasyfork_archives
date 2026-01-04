// ==UserScript==
// @name         北部湾大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  仅仅用于-北部湾大学-校园网的自动登陆认证，配置好脚本后，当打开认证页面时，就会自动填写账号及密码，并且完成认证。如遇技术问题请联系我，QQ:1194196422
// @icon		 https://s3.bmp.ovh/imgs/2022/05/23/2788e32a87378c42.png
// @author       milou
// @match        *://*.10.0.9.35/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460957/%E5%8C%97%E9%83%A8%E6%B9%BE%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/460957/%E5%8C%97%E9%83%A8%E6%B9%BE%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload=function()
    {
        window.document.querySelector('[placeholder=账号]').value="*******";//这里*******换成你的账号
        window.document.querySelector('[placeholder=密码]').value="*******";//这里*******换成你的密码
        window.document.querySelector('[name=ISP_select]').value="@cmcc";//这里填运营商 默认移动  移动：@cmcc     联通：@unicom    电信：@telecom
        window.document.querySelector('[value=登录]').click()
    }
})();
