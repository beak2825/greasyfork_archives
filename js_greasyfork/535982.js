// ==UserScript==
// @name         八一农大校园网登录
// @namespace    io.longhorn3683.script.byausrun
// @version      2025-05-14
// @description  BYAU-WINDOWS自动填写信息并登录
// @author       Longhorn3683
// @match        http://10.1.2.1/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @homepage     https://longhorn3683.github.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535982/%E5%85%AB%E4%B8%80%E5%86%9C%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/535982/%E5%85%AB%E4%B8%80%E5%86%9C%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var username = document.getElementById("username");
    username.value = '学号';

    var password = document.getElementById("password");
    password.value = '密码';

    var login = document.getElementById("login");
    login.click();

})();