// ==UserScript==
// @name         华北电力大学校园网自动登录
// @namespace    Leex_ncepu
// @version      1.3
// @description  【华北电力大学校园网自动登录】
// @author       leex
// @include      http://202.204.67.15/*
// @include      http://202.204.67.15/srun_portal_pc.php?ac_id=1&
// @downloadURL https://update.greasyfork.org/scripts/419107/%E5%8D%8E%E5%8C%97%E7%94%B5%E5%8A%9B%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/419107/%E5%8D%8E%E5%8C%97%E7%94%B5%E5%8A%9B%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==


//debugger
var username = "进入本油猴脚本13行 改为学号";
var password = "这里填密码"

const accountInput = document.querySelectorAll('input[type="text"]');
const passwordInput = document.querySelectorAll('input[type="password"]');
const loginButton = document.querySelectorAll('input[value="登录"]');
accountInput[0].value = username;
passwordInput[0].value = password;
loginButton[0].click();
