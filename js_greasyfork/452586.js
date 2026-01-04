// ==UserScript==
// @name         AutoLogin to Westlaw UK
// @namespace    http://courtingtrouble.ca
// @version      0.1
// @description  auto login to Westlaw UK
// @author       pwills
// @match        https://signon.thomsonreuters.com/?productid=PLCUK*
// @match        https://signon.thomsonreuters.com/v2/federation/1/UKF?tracetoken=*
// @icon         https://www.google.com/s2/favicons?domain=signon.thomsonreuters.com
// @grant        none
// @license      GNU GPL v 3.0
// @downloadURL https://update.greasyfork.org/scripts/452586/AutoLogin%20to%20Westlaw%20UK.user.js
// @updateURL https://update.greasyfork.org/scripts/452586/AutoLogin%20to%20Westlaw%20UK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("userscript loaded");

    const click_once = setInterval(click_signin_btn, 250);

    function click_btn(btn) {
        if (btn) {
            console.log("got btn")
            console.log(btn)
            clearInterval(click_once)
            btn.click();
            console.log("btn clicked")
        }
    }
    // Your code here...
    function click_signin_btn () {
        var btn = document.querySelector(".Form--additionalInformation>ul>li:nth-child(3)>a")
        click_btn(btn)
        btn = document.getElementById("Continue")
        click_btn(btn)

    }




})();