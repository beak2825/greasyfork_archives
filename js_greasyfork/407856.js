// ==UserScript==
// @name         联通光猫超级管理员登陆
// @namespace    https://github.com/monsterzzzz/UserScript
// @version      0.1.2
// @description  目前测试支持光猫 KD-YUN-811E(北京联通) 软件版本V1.1.0，其他光猫新的软件版本可以尝试
// @author       monsterzzzz
// @match        http://192.168.1.1/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/407856/%E8%81%94%E9%80%9A%E5%85%89%E7%8C%AB%E8%B6%85%E7%BA%A7%E7%AE%A1%E7%90%86%E5%91%98%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/407856/%E8%81%94%E9%80%9A%E5%85%89%E7%8C%AB%E8%B6%85%E7%BA%A7%E7%AE%A1%E7%90%86%E5%91%98%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

//部分代码来自https://github.com/luomoxu/UserScript
(function () {
    'use strict';
    if (document.title == '中国联通家庭网关') {
        var passwordbox = document.getElementsByClassName("wrapper_administrtor_passwordbox")[0];
        var adminbutton = document.createElement("div");
        adminbutton.innerHTML='<div class="wrapper_administrtor_passwordbox"><input style="width: 323px;" type="button" id="admin_login" value="管理员登陆" class="wrapper_administrtor_but" onclick=""></div>';
        passwordbox.parentNode.insertBefore(adminbutton, passwordbox.nextSibling);
        adminbutton.onclick = function() {
            document.getElementById('username').value = 'CUAdmin';
            document.getElementById('loginfrm').setAttribute('method','get');
            document.getElementById('loginfrm').submit();
        };
        console.log(unsafeWindow.authLevel)
        if (typeof unsafeWindow.authLevel != "undefined") {
            unsafeWindow.authLevel = 10;
        }
    }
})();