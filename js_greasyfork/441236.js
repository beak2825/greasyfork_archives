// ==UserScript==
// @name         Auto-login on gerrit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check if you're logged in to gerrit or not.  If not, click the sign-in link.
// @author       Darin Kelkhoff <darin.kelkhoff@gmail.com>
// @match        http://<your-garret-url>/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441236/Auto-login%20on%20gerrit.user.js
// @updateURL https://update.greasyfork.org/scripts/441236/Auto-login%20on%20gerrit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        try
        {
            console.log("Looking for login button...");

            var mainHeader = document.querySelector("gr-app").shadowRoot.querySelector("gr-app-element").shadowRoot.querySelector("gr-main-header")
            if(mainHeader.attributes["logged-in"])
            {
                console.log("Already logged in");
                return;
            }

            var loginButton = mainHeader.shadowRoot.querySelector(".loginButton")
            console.log("query for login button: " + loginButton);
            if (loginButton)
            {
                loginButton.click();
            }
        } catch(e)
        {
            console.log("Caught: " + e);
        }}, 1000);

})();