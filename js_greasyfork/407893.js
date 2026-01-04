// ==UserScript==
// @name         hdu自动登录
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动登录hdu
// @author       hezongdnf
// @match        http://acm.hdu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407893/hdu%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/407893/hdu%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var tmp = document.getElementById("username");
    if(!tmp)
    {
        if(document.getElementsByTagName('input')[3].name == "username" && document.getElementsByTagName('input')[4].name == "userpass")
        {
            document.getElementsByTagName('input')[3].value = "";       /*用户名*/
            document.getElementsByTagName('input')[4].value = "";       /*密码*/
            document.getElementsByTagName('input')[5].click();
        }
    }
    else
    {
        document.getElementById("username").value = "";     /*比赛用的用户名*/
        document.getElementById("userpass").value = "";     /*密码*/
        document.getElementById("login").click();
    }
    // Your code here...
})();