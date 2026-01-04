// ==UserScript==
// @name         RUB Moodle Login
// @version      1.0.0
// @description  Stay logged in on moodle.ruhr-uni-bochum.de
// @author       Yu Zha <sa-u@live.com>
// @namespace    github.com/DavidZha1994
// @match        https://moodle.ruhr-uni-bochum.de
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439499/RUB%20Moodle%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/439499/RUB%20Moodle%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var loginDetails = {
        userName: "username",
        password: "password",
    }

    function login(){
        document.querySelector('input[name="username"]').value = loginDetails.userName;
        document.querySelector('input[name="password"]').value = loginDetails.password;

        clickLoginButton();
    }

    function clickLoginButton(){
        document.querySelector('input[value="Login"]').click()
    }

    function isLoggedIn() {
        if(document.querySelector('a[title="Profil anzeigen"]')!=null) {
            return true
        }
        else {
            return false
        }
    }

    if(window.location.href == 'https://moodle.ruhr-uni-bochum.de/') {
        if(isLoggedIn()==false) {
            document.addEventListener('load', login());
        }
    }
})();