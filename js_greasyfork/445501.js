// ==UserScript==
// @name         内部网络认证自动登录
// @namespace    null
// @version      0.1
// @description  网络认证自动登录。
// @author       Ciu
// @match        https://10.1.1.1:20000
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445501/%E5%86%85%E9%83%A8%E7%BD%91%E7%BB%9C%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/445501/%E5%86%85%E9%83%A8%E7%BD%91%E7%BB%9C%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
window.addEventListener('load', function() {
var username = ""//账号
var password = ""//密码
var Username = document.getElementsByClassName('username');
var Password = document.getElementsByClassName('password');
Username.value=username;
Password.value=password;
parent.document.getElementById("leftFrame").contentWindow.document.forms[ 'LoginForm' ].onsubmit();
    }, false);
})();