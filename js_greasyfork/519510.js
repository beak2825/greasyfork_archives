// ==UserScript==
// @name         Auto Login For Moto
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  AutoLogin for moto inside wesites
// @author       JQ
// @match        https://gerrit.mot.com/login/*
// @match        https://idart.mot.com/login.js*
// @match        https://idart.mot.com/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mot.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519510/Auto%20Login%20For%20Moto.user.js
// @updateURL https://update.greasyfork.org/scripts/519510/Auto%20Login%20For%20Moto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    sleep(1000).then(autoLogin)

    function autoLogin(){
        console.log(`====================== Auto Login Start ======================`)
        let loginLink = document.getElementsByClassName("login-link")[0]
        if(loginLink != undefined) loginLink.click()

        let name = "wangjq10"
        let psd = "Aa;;;;;'''''"
        // userName, password, login, form
        let ids = [
            // idart
            ['login-form-username', 'login-form-password'],
            // gerrit
            ['f_user', 'f_pass', 'b_signin'],
            // artifactory
            ['user', 'password', 'login', 'login-form', 'login-form-submit'],
        ]

        for (let id of ids) {
            let element = document.getElementById(id[0])
            if(element) element.value = name

            element = document.getElementById(id[1])
            if(element) element.value = psd

            element = document.getElementById(id[2])
            if(element) element.click()

            element = document.getElementById(id[3])
            if(element) element.submit()
        }

        console.log(`====================== Auto Login End ======================`)
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
})();