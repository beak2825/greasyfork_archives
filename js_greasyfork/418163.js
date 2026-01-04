// ==UserScript==
// @name         自动登录联通宽带登录页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动登录联通宽带登录，只是自动填上名字和密码然后自动点登录，没啥大用。
// @author       zgggy
// @match        http://192.168.10.3/0.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418163/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%81%94%E9%80%9A%E5%AE%BD%E5%B8%A6%E7%99%BB%E5%BD%95%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/418163/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%81%94%E9%80%9A%E5%AE%BD%E5%B8%A6%E7%99%BB%E5%BD%95%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    document.getElementById('username').value="YOUR USERNAME HERE";
    document.getElementById('password').value="YOUR PASSWORD HERE";
    document.getElementById('submit').click();
}

)();