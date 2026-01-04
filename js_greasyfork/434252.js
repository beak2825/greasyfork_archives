// ==UserScript==
// @name         九职校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  简单脚本，打开登录页后自动输入账号密码并提交，解放双手
// @author       一股辟谷
// @match        http://172.20.254.249/a79.htm?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434252/%E4%B9%9D%E8%81%8C%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/434252/%E4%B9%9D%E8%81%8C%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    //你的账号
    var name = '110';
    //你的密码
    var pass = '123';

    window.onload=function() {
        var uname = document.getElementsByName('DDDDD')[1];
        var upass = document.getElementsByName('upass')[1];
        var submit = document.getElementsByName('0MKKey')[1];
        uname.value=name;
        upass.value=pass;
        submit.click();
    }
})();