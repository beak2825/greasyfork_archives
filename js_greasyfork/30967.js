// ==UserScript==
// @name         Login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  login
// @author       null
// @match        https://login.palcschool.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30967/Login.user.js
// @updateURL https://update.greasyfork.org/scripts/30967/Login.meta.js
// ==/UserScript==

(function() {
    var match = window.location.href.search(/login.palcschool.org/i);
    if (match != -1) {
        document.getElementById("username").value = "YOURUSERNAME";
        document.getElementById("password").value = "YOURPASSWORD";
        var loginbutton;
        var inputs = document.getElementsByTagName("input");
        for (i=0,l=inputs.length;i<l;i++) {
            if (inputs[i].type=="submit") {
                loginbutton = inputs[i];
            }
        }
        loginbutton.click();
    }
})();