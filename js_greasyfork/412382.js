// ==UserScript==
// @name         南工大智慧南工网络登录
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       lkfish
// @match        https://u.njtech.edu.cn/cas/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412382/%E5%8D%97%E5%B7%A5%E5%A4%A7%E6%99%BA%E6%85%A7%E5%8D%97%E5%B7%A5%E7%BD%91%E7%BB%9C%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/412382/%E5%8D%97%E5%B7%A5%E5%A4%A7%E6%99%BA%E6%85%A7%E5%8D%97%E5%B7%A5%E7%BD%91%E7%BB%9C%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

var username = "XXXXX"; //改成自己的账号
var password = "XXXXX"; //改成自己的密码
(function() {
'use strict';
document.getElementById("username").value = username;
document.getElementById("password").value = password;
document.getElementsByTagName("span")[1].click();//移动填一，电信填二,校内网填0
document.getElementById("login").click();
})();