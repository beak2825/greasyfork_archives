// ==UserScript==
// @name         TAU-Moodle auto login
// @name:he           כניסה אוטומטית למודל
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  An automatic login script for TAU moodle.
// @description:he  מאפשר להכנס למודל של תל אביב מהר
// @author       Ofir Kedem & Guy Morag
// @include      https://nidp.tau.ac.il/*
// @match        https://moodle.tau.ac.il/my/
// @match        https://moodle.tau.ac.il/
// @match        https://moodle.tau.ac.il/mod/resource/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424813/TAU-Moodle%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/424813/TAU-Moodle%20auto%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var loginDetails = {
        userName: "",
        idNumber: "123456789",
        password: "",
    }

    function login(){
        document.querySelector("input#Ecom_User_ID").value = loginDetails.userName;
        document.querySelector("input#Ecom_User_Pid").value = loginDetails.idNumber;
        document.querySelector("input#Ecom_Password").value = loginDetails.password;

        setTimeout(clickLoginButton, 200);
    }

    function clickLoginButton(){
        document.querySelector("button#loginButton2").click()
    }

    function isLoggedIn() {
        return document.getElementsByClassName('usertext').length > 0
    }

    function redirectToLogin() {
        window.location.href = 'https://moodle.tau.ac.il/login/index.php';
    }

    var host = window.location.host;

    if (host == "moodle.tau.ac.il") {
        if (!isLoggedIn()) {
            // login if needed
            redirectToLogin();
        } else {
            // do other things when logged in
            if (window.location.pathname == "/mod/resource/view.php") {
                // click on link to document
                document.querySelector("div.resourceworkaround a").click()
                window.close()
            }
        }
    } else if (host == "nidp.tau.ac.il") {
        window.addEventListener('load', (event) => {
            // wait for 'load' to allow reacting faster without setTimeOut
            login()
        });
    }

})();