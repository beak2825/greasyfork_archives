// ==UserScript==
// @name         PixelFederation's Portal Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Vins
// @match        https://portal.pixelfederation.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/98672
// @downloadURL https://update.greasyfork.org/scripts/30436/PixelFederation%27s%20Portal%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/30436/PixelFederation%27s%20Portal%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var handler = 0, count = 0;
    function clearHandler() {
        if(handler !== 0) { clearInterval(handler); }
        handler = 0;
    }
    function tryLogin() {
        var a = Array.from(document.getElementsByClassName("btn--facebook")).filter(item => item.href = "https://login.pixelfederation.com/oauth/connect/facebook")[0];
        if(a || count++ >= 10) {
            clearHandler();
            a.click();
        }
    }

    var loginButton = document.getElementById("login-click");
    if(loginButton) {
        loginButton.click();
        handler = setInterval(tryLogin, 500);
    }
})();