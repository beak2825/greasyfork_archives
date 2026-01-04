// ==UserScript==
// @name         AutoLogin to SOLO
// @namespace    http://courtingtrouble.ca
// @version      0.1
// @description  Automatically login to SOLO
// @author       pwills
// @match        https://solo.bodleian.ox.ac.uk/*
// @icon         https://www.google.com/s2/favicons?domain=ox.ac.uk
// @grant        none
// @license      GNU GPL v 3.0
// @downloadURL https://update.greasyfork.org/scripts/452588/AutoLogin%20to%20SOLO.user.js
// @updateURL https://update.greasyfork.org/scripts/452588/AutoLogin%20to%20SOLO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("userscript loaded");

    const click_once = setInterval(click_signin_btn, 250);

    // Your code here...
    function click_signin_btn () {
        var btn = document.querySelector(".Form--additionalInformation")
        if (btn) {
            console.log("got btn")
            console.log(btn)
            clearInterval(click_once)
            btn.click();
            console.log("btn clicked")
        }
    }




})();