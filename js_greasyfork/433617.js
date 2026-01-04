// ==UserScript==
// @name         GiWiFi Login gra.
// @namespace    giwifi
// @version      0.2
// @description  Auto to connect Internet for GiWiFi
// @author       ceshon
// @match        *://login.gwifi.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433617/GiWiFi%20Login%20gra.user.js
// @updateURL https://update.greasyfork.org/scripts/433617/GiWiFi%20Login%20gra.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Insert your Login_Username and Login_Password
    let Login_Username = ""//insert your username
    let Login_Password = ""//insert your password

    // Your code here...
    let user = document.getElementById('login_name');
    let pwd = document.getElementById('login_password');
    console.log("123");
    user.value = Login_Username;
    pwd.value = Login_Password;
    let submit = document.getElementById('loginButton');
    //$('.submit').click();
    submit.click();
})();