// ==UserScript==
// @name         AutoLogin to OpenAthens
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autologin to OpenAthens
// @author       You
// @match        https://wayfinder.openathens.net/*
// @icon         https://www.google.com/s2/favicons?domain=openathens.net
// @grant        none
// @license      GNU GPL v 3.0
// @downloadURL https://update.greasyfork.org/scripts/452587/AutoLogin%20to%20OpenAthens.user.js
// @updateURL https://update.greasyfork.org/scripts/452587/AutoLogin%20to%20OpenAthens.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("userscript loaded");

    const click_once = setInterval(click_signin_btn, 250);

    // Your code here...
    function click_signin_btn () {
        for (let el of document.querySelectorAll(".wayfinder-item-displayname-text")) {
            if (el.textContent == "University of Oxford") {
                clearInterval(click_once)
                el.click();
            }
        }
    }
})();


