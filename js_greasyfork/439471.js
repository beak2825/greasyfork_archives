// ==UserScript==
// @name         TU Dortmmund Moodle Login
// @version      1.0.0
// @description  Stay logged in on moodle.tu-dortmund.de
// @author       Yu Zha <sa-u@live.com>
// @namespace    github.com/DavidZha1994



// @match        https://moodle.tu-dortmund.de
// @match        https://moodle.tu-dortmund.de/login/index.php
// @match        https://sso.itmc.tu-dortmund.de/openam/UI/Login
// @match        https://sso.itmc.tu-dortmund.de/openam/UI/Logout.jsp
// @match        https://sso.itmc.tu-dortmund.de/openam/Welcome.jsp

// @match        https://sso.itmc.tu-dortmund.de/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439471/TU%20Dortmmund%20Moodle%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/439471/TU%20Dortmmund%20Moodle%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var loginDetails = {
        userName: "",
        password: "",
    }

    function login(){
        document.querySelector('input[id="IDToken1"]').value = loginDetails.userName;
        document.querySelector('input[id="IDToken2"]').value = loginDetails.password;

        clickLoginButton();
    }

    function clickLoginButton(){
        document.querySelector('input[type="submit"]').click();
    }

    function isLoggedIn() {
        if(document.querySelector('a[title="Profil anzeigen"]')!=null)
        {return true}
        else{return false}
    }

    function redirectToLogin() {
        window.location.href = 'https://sso.itmc.tu-dortmund.de/openam/UI/Login';
    }
    function redirectToMoodle() {
        window.location.href = 'https://moodle.tu-dortmund.de';
    }

    var host = window.location.href;
    if(window.location.href != 'https://sso.itmc.tu-dortmund.de/openam/UI/Login')
       {
       if(window.location.href != 'https://sso.itmc.tu-dortmund.de/openam/Welcome.jsp'){
       redirectToLogin();
       }
       }
    if(isLoggedIn()==false){
        if(window.location.href == 'https://sso.itmc.tu-dortmund.de/openam/UI/Login'){
             document.addEventListener('load', login());
        }

        if(window.location.href == 'https://sso.itmc.tu-dortmund.de/openam/Welcome.jsp'){
            redirectToMoodle();
        }
    }
})();