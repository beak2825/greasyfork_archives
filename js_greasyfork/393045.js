// ==UserScript==
// @name         Side Secure Auto-Login
// @namespace    JotaSideScripts
// @version      1.01
// @description  Clica na merda do login por mim!
// @author       You
// @match        https://idp.utad.pt/idp/profile/SAML2/Redirect/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/393045/Side%20Secure%20Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/393045/Side%20Secure%20Auto-Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var myLogin = "your login here inside the quotation marks";
    var myPass = "your password here inside the quotation marks";
    var UsernameField = document.getElementsByClassName("form-control")[0];
    var PassField = document.getElementsByClassName("input-xlarge")[0];
    var buttonLogin = document.getElementsByClassName("btn btn-large btn-primary")[0];

    UsernameField.value = myLogin;
    PassField.value = myPass;
    buttonLogin.click();
})();