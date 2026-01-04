// ==UserScript==
// @name         华北水利水电大学校园网页面自动登录
// @description  一个简单的脚本送给跟我一样懒的华水人
// @version      0.3
// @author       202012122
// @match        http://192.168.0.170/*
// @grant        none 
// @license MIT
// @namespace https://greasyfork.org/users/831987
// @downloadURL https://update.greasyfork.org/scripts/453207/%E5%8D%8E%E5%8C%97%E6%B0%B4%E5%88%A9%E6%B0%B4%E7%94%B5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453207/%E5%8D%8E%E5%8C%97%E6%B0%B4%E5%88%A9%E6%B0%B4%E7%94%B5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
if(document.querySelector("#username")==null)
{
  return;
}
document.querySelector("#username").value="这里输入账号";//把前面几个文字换为你的账户密码哦
document.querySelector("#password").value="这里输入密码";
document.querySelector("#login").click();