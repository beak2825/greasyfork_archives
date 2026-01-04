// ==UserScript==
// @name         UJSwlan自动登录
// @version      0.2
// @author       YuYuYu
// @description  自动登录UJSwlan
// @match        http*://p.ujs.edu.cn/a70.htm
// @namespace    https://greasyfork.org/users/702714
// @downloadURL https://update.greasyfork.org/scripts/423063/UJSwlan%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/423063/UJSwlan%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

//在这里配置你的用户名和密码
var username = '';
var password = '';

window.onload = function(){
    document.getElementsByClassName('edit_lobo_cell')[1].value = username;
    document.getElementsByClassName('edit_lobo_cell')[2].value = password;
    document.getElementsByClassName('edit_lobo_cell')[0].click();
}