// ==UserScript==
// @name         Gerrit Auto Login
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto login to Gerrit Code Review
// @author       Du Zhe
// @match        http://172.20.3.67:8080/login/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528247/Gerrit%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/528247/Gerrit%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var f_user = document.getElementById('f_user');
    var f_pass = document.getElementById('f_pass');
    var login_form = document.getElementById('login_form');

    if (f_user && f_pass && login_form) {
        f_user.value = 'username'; // 替换为你的用户名
        f_pass.value = 'password'; // 替换为你的密码

        login_form.submit();
    } else {
        console.error('Login form elements are not found.');
    }
})();