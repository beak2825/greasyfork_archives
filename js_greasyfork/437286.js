// ==UserScript==
// @name         Dogecoin  Captcha Faucet
// @namespace    Claim free Doge
// @version      2.1
// @description  Claim free Doge
// @author       lotocamion
// @match        http://captchafaucet.unaux.com/page/dashboard
// @match        http://captchafaucet.unaux.com/page/dashboard/*
// @icon         https://www.google.com/s2/favicons?domain=unaux.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437286/Dogecoin%20%20Captcha%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/437286/Dogecoin%20%20Captcha%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clicked = false;
    setInterval(function() {
    if (!clicked && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
    document.querySelector("#holder > div > div.col-xs-12.col-sm-8 > form > input").click();
    clicked = true;
    }
    }, 8000);
    })();