// ==UserScript==
// @name         广东海洋大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可用于广东海洋大学校园网自动登录
// @author       You
// @match        http://10.129.1.1/srun_portal_pc?ac_id=22
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489554/%E5%B9%BF%E4%B8%9C%E6%B5%B7%E6%B4%8B%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/489554/%E5%B9%BF%E4%B8%9C%E6%B5%B7%E6%B4%8B%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==


// user_account、user_password 分别是账号和密码
var user_account='xxx';
var user_password='xxx';
var boxOfLogin='#app > section > div.panel.panel-login';


// 各个控件的 selector
var inputOfAccount='#username';
var inputOfPassword='#password';
var buttonOfLogin='#login-account';
var iknow='#protocol';


// 登录函数
function login()
{
    // 自动填写账号密码到输入框
    document.querySelector(inputOfAccount).value=user_account;
    document.querySelector(inputOfPassword).value=user_password;
    // 自动点击登录按钮
    window.setTimeout(function(){document.querySelector(iknow).click()},200);
    window.setTimeout(function(){document.querySelector(buttonOfLogin).click()},200);
}


//输出完整时间
(function()
{
    'use strict';
    // Your code here..
    window.setTimeout(function()
    {
                console.log("登录框存在");
                login();
                window.setTimeout(function()
                {
                }, 1000);
    },300)
})();