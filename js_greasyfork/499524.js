// ==UserScript==
// @name         UOM moodle auto login
// @namespace    http://tampermonkey.net/
// @version      2024-07-02
// @description  Auto login when moodle got logged out
// @author       charindith
// @match        https://online.uom.lk/login/*
// @icon         https://uom.lk/assets/images/Uni_emblem.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499524/UOM%20moodle%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/499524/UOM%20moodle%20auto%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var loginDetails = {
        userName: "YourUsername",
        password: "YourPassword",
    }

    function login(){
        document.querySelector("input#username").value = loginDetails.userName;
        document.querySelector("input#password").value = loginDetails.password;

        setTimeout(clickLoginButton, 200);
    }

    function clickLoginButton(){
        document.querySelector("button#loginbtn").click()
    }

    if (window.location.href == "https://online.uom.lk/login/index.php"){
        login();
    }

})();